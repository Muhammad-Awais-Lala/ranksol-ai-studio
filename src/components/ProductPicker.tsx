import React, { useState, useEffect } from 'react';
import { fetchSheets, type Sheet } from '../services/sheetsService';
import '../css/productPicker.css';

interface ProductPickerProps {
    selectedSheet: Sheet | null;
    onSheetChange: (sheet: Sheet) => void;
    disabled: boolean;
    slugs?: string[]; // Changed from slug to slugs array
}

const ProductPicker: React.FC<ProductPickerProps> = ({ selectedSheet, onSheetChange, disabled, slugs }) => {
    const [sheets, setSheets] = useState<Sheet[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadSheets = async (pageNum: number, isInitial: boolean = false) => {
        try {
            if (isInitial) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);

            const data = await fetchSheets(slugs, pageNum);

            if (isInitial) {
                setSheets(data);
                // If initial load returns fewer than 6 items, there are no more pages
                setHasMore(data.length === 6);
            } else {
                setSheets(prev => [...prev, ...data]);
                // If this page load returns fewer than 6 items, there are no more pages
                setHasMore(data.length === 6);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load sheets');
            console.error('Error loading sheets:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        loadSheets(1, true);
    }, [JSON.stringify(slugs)]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        loadSheets(nextPage, false);
    };

    const handleSheetSelect = (sheet: Sheet) => {
        onSheetChange(sheet);
        setIsModalOpen(false);
    };

    const PickerContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className={`bg-white rounded-2xl p-6 ${isMobile ? 'h-full flex flex-col' : ''}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#EFE223] rounded-lg">
                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-black">
                        Material Library
                    </h3>
                </div>
                {isMobile && (
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            <div className={`${isMobile ? 'flex-1 overflow-y-auto' : 'max-h-[250px] overflow-y-auto'} pr-1 custom-scrollbar`}>
                {error && sheets.length === 0 ? (
                    <div className="text-center p-6 bg-red-50 rounded-xl border-2 border-red-200">
                        <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-bold text-red-900">Error loading materials</p>
                        <p className="text-sm mt-2 text-red-700">{error}</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-3 gap-2 w-full mb-2">
                            {sheets.map((sheet) => (
                                <button
                                    key={sheet.id}
                                    onClick={() => handleSheetSelect(sheet)}
                                    disabled={disabled}
                                    className={`group relative aspect-square rounded-xl overflow-hidden transition-all duration-300 
                                        ${selectedSheet && selectedSheet.id === sheet.id
                                            ? 'ring-2 ring-black scale-95 shadow-inner'
                                            : 'ring-1 ring-gray-100 hover:ring-gray-300 hover:shadow-md'
                                        }
                                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                    `}
                                    title={sheet.name}
                                >
                                    <img
                                        src={sheet.thumbnail || sheet.path}
                                        alt={sheet.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    {selectedSheet && selectedSheet.id === sheet.id && (
                                        <div className="absolute top-1 right-1">
                                            <div className="bg-black text-white p-1 rounded-full shadow-lg">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}

                            {loadingMore && [...Array(3)].map((_, i) => (
                                <div
                                    key={`loading-more-${i}`}
                                    className="aspect-square rounded-xl bg-gray-50 animate-pulse"
                                />
                            ))}
                        </div>

                        {hasMore && !loadingMore && sheets.length > 0 && (
                            <div className="flex justify-center pb-4">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={disabled}
                                    className="px-4 py-1 bg-[#EFE223] text-black rounded-full text-xs shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-[#EFE223]"
                                >
                                    Load More Materials
                                </button>
                            </div>
                        )}

                        {!hasMore && sheets.length > 0 && page > 1 && (
                            <p className="text-center text-xs text-gray-500 pb-4">
                                No more materials to load
                            </p>
                        )}
                    </>
                )}
            </div>

            {selectedSheet && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-black flex items-center gap-2">
                        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium truncate max-w-[200px]">{selectedSheet.name}</span>
                    </p>
                    {isMobile && (
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="text-xs font-bold text-black bg-[#EFE223] px-3 py-1 rounded-full"
                        >
                            Select
                        </button>
                    )}
                </div>
            )}
        </div>
    );

    // Loading state for initial load
    if (loading) {
        return (
            <div className="relative overflow-hidden rounded-2xl bg-gray-100 p-[2px] shadow-lg">
                <div className="bg-white rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-[#EFE223] rounded-lg">
                            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-black">
                            Material Library
                        </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3 w-full">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="aspect-square rounded-xl bg-gray-100 animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Desktop View - Inline */}
            <div className="hidden lg:block relative overflow-hidden rounded-2xl bg-gray-100 p-[2px] shadow-lg">
                <PickerContent isMobile={false} />
            </div>

            {/* Mobile View - Trigger Button */}
            <div className="block lg:hidden w-full">
                <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={disabled}
                    className="w-full relative overflow-hidden rounded-2xl bg-gray-100 p-[2px] shadow-lg active:scale-95 transition-transform"
                >
                    <div className="bg-white rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#EFE223] rounded-lg">
                                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h3 className="text-sm font-bold text-black uppercase tracking-wide">
                                    Choose Material
                                </h3>
                                {selectedSheet ? (
                                    <p className="text-xs text-gray-500 font-medium">Selected: {selectedSheet.name}</p>
                                ) : (
                                    <p className="text-xs text-gray-400">Select texture from library</p>
                                )}
                            </div>
                        </div>

                        {selectedSheet ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-[#EFE223]">
                                <img
                                    src={selectedSheet.thumbnail || selectedSheet.path}
                                    alt={selectedSheet.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="p-2 rounded-full bg-gray-100 text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        )}
                    </div>
                </button>
            </div>

            {/* Mobile Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden h-[85vh] sm:h-auto animate-in slide-in-from-bottom duration-300">
                        <PickerContent isMobile={true} />
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductPicker;
