import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import ImageUploader from '../components/ImageUploader';
import ItemSelector from '../components/ItemSelector';
import ProductPicker from '../components/ProductPicker';
import { fileToBase64, detectItemsInImage, recolorImageItem, applyTextureToItem } from '../services/geminiService';
import { fetchSheets, type Sheet } from '../services/sheetsService'; // Added Sheet type
import { DEFAULT_COLOR, DEFAULT_DETECTABLE_ITEMS, API_BASE_URL } from '../../constants';
import { DetectedItem } from '../../types';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Home() {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
    const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<DetectedItem[]>([]); // Changed to array
    const [selectedColor, setSelectedColor] = useState<string>(DEFAULT_COLOR);
    const [selectedSheet, setSelectedSheet] = useState<Sheet | null>(null); // Changed to Sheet object
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [multiSelectMode, setMultiSelectMode] = useState<boolean>(false); // New state for multi-select toggle
    const [detectableItems, setDetectableItems] = useState<(string | { name: string; slug: string })[]>();
    // const [detectableItems, setDetectableItems] = useState<(string | { name: string; slug: string })[]>(DEFAULT_DETECTABLE_ITEMS);
    const [showPanoramaViewer, setShowPanoramaViewer] = useState<boolean>(false); // New state for panorama viewer

    useEffect(() => {
        const fetchDetectableItems = async () => {
            try {
                // Adjust endpoint as needed based on actual backend API
                const response = await axios.get(`${API_BASE_URL}/areas`);
                if (response.data && Array.isArray(response.data)) {
                    setDetectableItems(response.data);
                    // console.log(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch detectable items, using default list:", error);
                // Fallback is already set in initial state
            }
        };

        fetchDetectableItems();
    }, []);

    const handleImageSelected = useCallback(async (file: File) => {
        setOriginalFile(file);
        setOriginalImageUrl(URL.createObjectURL(file));
        setEditedImageUrl(null); // Clear previous edited image
        setDetectedItems([]);
        setSelectedItems([]); // Clear selected items
        setError(null);

        setIsLoading(true);
        try {
            const base64 = await fileToBase64(file);
            const items = await detectItemsInImage(base64, file.type, detectableItems);
            setDetectedItems(items);
        } catch (err) {
            console.error("Error during image processing:", err);
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setIsLoading(false);
        }
    }, [detectableItems]); // Added detectableItems to dependency array

    const handleRecolor = useCallback(async () => {
        if (!originalFile || selectedItems.length === 0 || !selectedColor) {
            setError("Please upload an image, select an item, and choose a color.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            // const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); // Create new instance for fresh key - not needed here, handled in service
            const originalBase64 = await fileToBase64(originalFile);
            const editedBase64 = await recolorImageItem(
                originalBase64,
                originalFile.type,
                selectedItems[0].description, // Use first selected item
                selectedColor
            );
            setEditedImageUrl(`data:${originalFile.type};base64,${editedBase64}`);
        } catch (err) {
            console.error("Error during recoloring:", err);
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setIsLoading(false);
        }
    }, [originalFile, selectedItems, selectedColor]);

    const handleApplyTexture = useCallback(async () => {
        if (!originalFile || selectedItems.length === 0 || !selectedSheet) {
            setError("Please upload an image, select item(s), and choose a texture sheet.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Fetch the texture image and convert to base64
            // Ensure we always hit the correct backend domain in production
            let textureUrl = selectedSheet.path;

            // If the API returned a relative path (e.g. "/storage/media/..."),
            // prefix it with the kmigroups base URL so it doesn't get resolved against the Vercel frontend domain.
            if (!textureUrl.startsWith('http')) {
                textureUrl = `https://kmigroups.com${textureUrl}`;
            }

            const textureResponse = await fetch(textureUrl);
            const textureBlob = await textureResponse.blob();
            const textureFile = new File([textureBlob], 'texture.png', { type: textureBlob.type });
            const textureBase64 = await fileToBase64(textureFile);

            const originalBase64 = await fileToBase64(originalFile);

            // Extract all item descriptions
            const itemDescriptions = selectedItems.map(item => item.description);

            // Always generate standard image
            const editedBase64 = await applyTextureToItem(
                originalBase64,
                originalFile.type,
                itemDescriptions, // Pass array of all descriptions
                textureBase64,
                textureFile.type
            );

            setEditedImageUrl(`data:${originalFile.type};base64,${editedBase64}`);
        } catch (err) {
            console.error("Error during texture application:", err);
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setIsLoading(false);
        }
    }, [originalFile, selectedItems, selectedSheet]);


    const handleImageRemoved = useCallback(() => {
        setOriginalFile(null);
        setOriginalImageUrl(null);
        setEditedImageUrl(null);
        setDetectedItems([]);
        setSelectedItems([]);
        setError(null);
    }, []);



    return (
        <>
            <Header />
            <div className="min-h-screen bg-white">
                {/* Main Content Container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-800 shadow-lg">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                                        <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-red-900 dark:text-red-200 mb-1">Something went wrong</p>
                                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                                    </div>
                                    <button
                                        onClick={() => setError(null)}
                                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Studio Workspace Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* Left Panel - Upload & Settings */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Section Label */}
                            <div className="flex items-center gap-2 px-1">
                                <div className="w-1 h-6 bg-[#EFE223] rounded-full"></div>
                                <h2 className="text-lg font-bold text-black uppercase tracking-wide">
                                    Step 1
                                </h2>
                            </div>


                            <ImageUploader
                                onImageSelected={handleImageSelected}
                                onImageRemoved={handleImageRemoved}
                                previewUrl={originalImageUrl}
                                isLoading={isLoading && !detectedItems.length}
                            />
                        </div>

                        {/* Center Panel - Design Tools */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Section Label */}
                            <div className="flex items-center gap-2 px-1">
                                <div className="w-1 h-6 bg-[#EFE223] rounded-full"></div>
                                <h2 className="text-lg font-bold text-black uppercase tracking-wide">
                                    Step 2
                                </h2>
                            </div>

                            {/* Multi-select mode toggle */}
                            <div className="relative overflow-hidden rounded-2xl bg-[#EFE223] p-[2px] shadow-lg">
                                <div className="bg-white rounded-2xl p-4">
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-yellow-50 rounded-lg group-hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <div>
                                                <span className="block text-sm font-bold text-black">
                                                    Multi-Select Mode
                                                </span>
                                                <span className="block text-xs text-gray-500">
                                                    Apply texture to multiple items
                                                </span>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={multiSelectMode}
                                                onChange={(e) => {
                                                    setMultiSelectMode(e.target.checked);
                                                    setSelectedItems([]);
                                                }}
                                                className="sr-only peer"
                                                disabled={isLoading}
                                            />
                                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#EFE223] shadow-inner"></div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <ItemSelector
                                detectedItems={detectedItems}
                                selectedItems={selectedItems}
                                onItemsSelected={setSelectedItems}
                                disabled={isLoading || !originalFile}
                                isLoading={isLoading && !detectedItems.length}
                                multiSelectMode={multiSelectMode}
                            />
                            {/* Section Label */}
                            <div className="flex items-center gap-2 px-1">
                                <div className="w-1 h-6 bg-[#EFE223] rounded-full"></div>
                                <h2 className="text-lg font-bold text-black uppercase tracking-wide">
                                    Step 3
                                </h2>
                            </div>

                            <ProductPicker
                                selectedSheet={selectedSheet}
                                onSheetChange={setSelectedSheet}
                                disabled={isLoading || selectedItems.length === 0}
                                slugs={selectedItems.length > 0
                                    ? selectedItems.map(item => item.slug).filter((s): s is string => s !== undefined)
                                    : undefined}
                            />
                            {/* Section Label */}
                            <div className="flex items-center gap-2 px-1">
                                <div className="w-1 h-6 bg-[#EFE223] rounded-full"></div>
                                <h2 className="text-lg font-bold text-black uppercase tracking-wide">
                                    Step 4
                                </h2>
                            </div>
                            {/* Apply Texture Button */}
                            <button
                                onClick={handleApplyTexture}
                                disabled={isLoading || selectedItems.length === 0 || !originalFile || !selectedSheet}
                                className="group relative w-full overflow-hidden rounded-full bg-[#EFE223] p-[2px] shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                <div className="relative bg-[#EFE223] rounded-full px-6 py-4">
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    {isLoading ? (
                                        <span className="relative flex items-center justify-center text-black font-bold text-lg">
                                            <svg className="animate-spin -ml-1 mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {multiSelectMode && selectedItems.length > 1
                                                ? `Applying to ${selectedItems.length} Items...`
                                                : 'Applying Texture...'}
                                        </span>
                                    ) : (
                                        <span className="relative flex items-center justify-center gap-3 text-black font-bold text-lg">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                            </svg>
                                            {multiSelectMode && selectedItems.length > 1
                                                ? `Apply to ${selectedItems.length} Items`
                                                : 'Apply Texture'}
                                        </span>
                                    )}
                                </div>
                            </button>
                        </div>

                        {/* Right Panel - Preview & Results */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Section Label */}
                            <div className="flex items-center gap-2 px-1">
                                <div className="w-1 h-6 bg-[#EFE223] rounded-full"></div>
                                <h2 className="text-lg font-bold text-black uppercase tracking-wide">
                                    Preview
                                </h2>
                            </div>

                            {/* Result Preview Card */}
                            <div className="relative overflow-hidden rounded-2xl bg-gray-100 p-[2px] shadow-xl">
                                <div className="bg-white rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-black flex items-center gap-2">
                                            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            Result
                                        </h3>
                                        {editedImageUrl && (
                                            <span className="px-3 py-1 bg-yellow-100 text-black text-xs font-bold rounded-full flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Ready
                                            </span>
                                        )}
                                    </div>

                                    {editedImageUrl ? (
                                        <div className="space-y-4">
                                            <div className="relative group rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg h-96 w-full">
                                                <Zoom>
                                                    <img
                                                        src={editedImageUrl}
                                                        alt="Edited Room"
                                                        className="w-full h-full object-contain bg-gray-50"
                                                    />
                                                </Zoom>
                                                <div className="absolute top-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                                                    AI Enhanced
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="space-y-3">

                                                {/* Download Button */}
                                                {editedImageUrl && originalFile && (
                                                    <a
                                                        href={editedImageUrl}
                                                        download={`kmi-studio-${originalFile.name}`}
                                                        className="group relative w-full overflow-hidden rounded-full bg-[#EFE223] p-[2px] shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] block"
                                                    >
                                                        <div className="relative bg-[#EFE223] rounded-full px-6 py-4">
                                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                            <span className="relative flex items-center justify-center gap-3 text-black font-bold text-lg">
                                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                </svg>
                                                                Download Design
                                                            </span>
                                                        </div>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative h-96 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                            <svg className="w-20 h-20 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-gray-600 font-medium text-center px-4">
                                                {originalFile
                                                    ? 'Select items and texture to see your design'
                                                    : 'Upload an image to begin your project'}
                                            </p>
                                            <p className="text-gray-400 text-sm mt-2">
                                                Your result will appear here
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Download Button */}

                        </div>
                    </div>
                </div>

            </div >
            <Footer />

        </>
    );
}

export default Home;