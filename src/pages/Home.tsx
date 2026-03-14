import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import ImageUploader from '../components/ImageUploader';
import ItemSelector from '../components/ItemSelector';
import ProductPicker from '../components/ProductPicker';
import { fileToBase64, detectItemsInImage, recolorImageItem, applyTextureToItem } from '../services/geminiService';
import { type Sheet } from '../services/sheetsService';
import { toProxyUrl } from '../services/roomTemplatesService';
import { DEFAULT_COLOR, API_BASE_URL } from '../../constants';
import { DetectedItem } from '../../types';
import { HiOutlineSparkles, HiOutlineDownload, HiOutlineExclamationCircle, HiOutlineViewGrid, HiOutlineAdjustments } from 'react-icons/hi';

function Home() {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
    const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<DetectedItem[]>([]);
    const [selectedSheet, setSelectedSheet] = useState<Sheet | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [multiSelectMode, setMultiSelectMode] = useState<boolean>(false);
    const [detectableItems, setDetectableItems] = useState<(string | { name: string; slug: string })[]>();

    useEffect(() => {
        const fetchDetectableItems = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/areas`);
                if (response.data && Array.isArray(response.data)) {
                    setDetectableItems(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch detectable items:", error);
            }
        };
        fetchDetectableItems();
    }, []);

    const handleImageSelected = useCallback(async (file: File) => {
        setOriginalFile(file);
        setOriginalImageUrl(URL.createObjectURL(file));
        setEditedImageUrl(null);
        setDetectedItems([]);
        setSelectedItems([]);
        setError(null);

        setIsLoading(true);
        try {
            const base64 = await fileToBase64(file);
            const items = await detectItemsInImage(base64, file.type, detectableItems || []);
            setDetectedItems(items);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setIsLoading(false);
        }
    }, [detectableItems]);

    const handleApplyTexture = useCallback(async () => {
        if (!originalFile || selectedItems.length === 0 || !selectedSheet) {
            setError("Please complete all steps to apply texture.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Use proxy-friendly relative URL to avoid CORS
            const fetchUrl = toProxyUrl(selectedSheet.path);

            const textureResponse = await fetch(fetchUrl);
            const textureBlob = await textureResponse.blob();
            const textureFile = new File([textureBlob], 'texture.png', { type: textureBlob.type });
            const textureBase64 = await fileToBase64(textureFile);
            const originalBase64 = await fileToBase64(originalFile);

            const itemDescriptions = selectedItems.map(item => item.description);
            const editedBase64 = await applyTextureToItem(
                originalBase64,
                originalFile.type,
                itemDescriptions,
                textureBase64,
                textureFile.type
            );

            setEditedImageUrl(`data:${originalFile.type};base64,${editedBase64}`);
        } catch (err) {
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
        <div className="h-full flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700">
            {/* Left: Main Canvas Area */}
            <div className="flex-1 flex flex-col gap-6">
                {/* Result Preview Header */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-lg">
                            <HiOutlineViewGrid size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-black leading-none">Canvas Area</h2>
                            <p className="text-xs text-gray-500 font-medium">Preview your design changes in real-time</p>
                        </div>
                    </div>

                    {editedImageUrl && (
                        <div className="flex gap-3">
                            <a
                                href={editedImageUrl}
                                download={`ranksol-studio-${originalFile?.name}`}
                                className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-[#F37021] transition-all shadow-xl hover:scale-105 active:scale-95"
                            >
                                <HiOutlineDownload size={20} />
                                Download Result
                            </a>
                        </div>
                    )}
                </div>

                {/* The Canvas Backdrop */}
                <div className="relative flex-1 min-h-[500px] bg-gray-100/50 rounded-[32px] border-2 border-dashed border-gray-200 p-8 flex items-center justify-center overflow-hidden group shadow-inner">
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50"></div>

                    {error && (
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-fit px-6 py-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 shadow-2xl animate-bounce">
                            <HiOutlineExclamationCircle size={20} />
                            <span className="text-sm font-bold">{error}</span>
                            <button onClick={() => setError(null)} className="ml-2 hover:text-red-900 font-bold">&times;</button>
                        </div>
                    )}

                    {!originalImageUrl ? (
                        <div className="relative z-10 w-full max-w-lg">
                            <ImageUploader
                                onImageSelected={handleImageSelected}
                                onImageRemoved={handleImageRemoved}
                                previewUrl={null}
                                isLoading={isLoading && !detectedItems.length}
                            />
                        </div>
                    ) : (
                        <div className="relative z-10 w-full h-full flex items-center justify-center">
                            <div className="max-w-full max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white group/zoom transition-transform duration-500">
                                <Zoom>
                                    <img
                                        src={editedImageUrl || originalImageUrl}
                                        alt="Design Preview"
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </Zoom>
                                {editedImageUrl && (
                                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest text-white uppercase border border-white/20">
                                        AI Enhanced
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Studio Sidebar Controls */}
            <div className="w-full lg:w-[400px] flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                {/* Workflow Status */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-orange-50 text-[#F37021] rounded-xl">
                            <HiOutlineAdjustments size={24} />
                        </div>
                        <h3 className="text-lg font-black text-black">Design Tools</h3>
                    </div>

                    <div className="space-y-6">
                        {/* Step 1: Image Info (When loaded) */}
                        {originalFile && (
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Active Source</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 flex items-center justify-center bg-white">
                                        <img src={originalImageUrl!} className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-black truncate">{originalFile.name}</p>
                                        <p className="text-[10px] text-gray-500">{(originalFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button onClick={handleImageRemoved} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                        &times;
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Multi-Select Toggle inside the flow */}
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm font-bold text-gray-700">Multi-Select Mode</span>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={multiSelectMode}
                                        onChange={(e) => {
                                            setMultiSelectMode(e.target.checked);
                                            setSelectedItems([]);
                                        }}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#F37021] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full shadow-inner"></div>
                                </div>
                            </label>
                        </div>

                        {/* Detect & Select */}
                        <ItemSelector
                            detectedItems={detectedItems}
                            selectedItems={selectedItems}
                            onItemsSelected={setSelectedItems}
                            disabled={isLoading || !originalFile}
                            isLoading={isLoading && !detectedItems.length}
                            multiSelectMode={multiSelectMode}
                        />

                        {/* Material Picker */}
                        <ProductPicker
                            selectedSheet={selectedSheet}
                            onSheetChange={setSelectedSheet}
                            disabled={isLoading || selectedItems.length === 0}
                            slugs={selectedItems.length > 0
                                ? selectedItems.map(item => item.slug).filter((s): s is string => s !== undefined)
                                : undefined}
                        />

                        {/* Apply Button */}
                        <button
                            onClick={handleApplyTexture}
                            disabled={isLoading || selectedItems.length === 0 || !originalFile || !selectedSheet}
                            className={`
                                w-full py-5 rounded-3xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl relative overflow-hidden group
                                ${isLoading || selectedItems.length === 0 || !originalFile || !selectedSheet
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-[#F37021] hover:scale-[1.02] active:scale-95 shadow-orange-500/10'
                                }
                            `}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="animate-pulse">AI is working...</span>
                                </>
                            ) : (
                                <>
                                    <div className="group-hover:rotate-12 transition-transform">
                                        <HiOutlineSparkles size={24} />
                                    </div>
                                    Generate Design
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Tips Card */}
                <div className="bg-gradient-to-br from-[#F37021] to-[#ff8a3d] rounded-3xl p-6 text-white font-medium text-sm shadow-xl shadow-orange-500/20">
                    <p className="flex items-center gap-2 mb-2 font-black text-lg">💡 Studio Tip</p>
                    For best results, upload images with clear lighting and distinct object boundaries. AI works better with high-resolution sources.
                </div>
            </div>
        </div>
    );
}

export default Home;
