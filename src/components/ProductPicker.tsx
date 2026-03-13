import React, { useState, useEffect } from 'react';
import { fetchSheets, type Sheet } from '../services/sheetsService';
import { HiOutlineColorSwatch, HiOutlineCheckCircle, HiOutlinePlusCircle, HiOutlineExclamationCircle } from 'react-icons/hi';

interface ProductPickerProps {
    selectedSheet: Sheet | null;
    onSheetChange: (sheet: Sheet) => void;
    disabled: boolean;
    slugs?: string[];
}

const ProductPicker: React.FC<ProductPickerProps> = ({ selectedSheet, onSheetChange, disabled, slugs }) => {
    const [sheets, setSheets] = useState<Sheet[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadSheets = async (pageNum: number, isInitial: boolean = false) => {
        try {
            if (isInitial) setLoading(true);
            else setLoadingMore(true);

            setError(null);
            const data = await fetchSheets(slugs, pageNum);

            if (isInitial) {
                setSheets(data);
                setHasMore(data.length === 6);
            } else {
                setSheets(prev => [...prev, ...data]);
                setHasMore(data.length === 6);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load library');
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

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-black text-black uppercase tracking-widest flex items-center gap-2">
                    <HiOutlineColorSwatch size={18} className="text-[#F37021]" />
                    Material Library
                </h3>
            </div>

            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-4">
                {error && sheets.length === 0 ? (
                    <div className="text-center py-8">
                        <HiOutlineExclamationCircle size={32} className="mx-auto text-red-400 mb-2" />
                        <p className="text-xs font-bold text-red-600">{error}</p>
                    </div>
                ) : loading && sheets.length === 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="aspect-square rounded-2xl bg-gray-50 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                            {sheets.map((sheet) => {
                                const isSelected = selectedSheet?.id === sheet.id;
                                return (
                                    <button
                                        key={sheet.id}
                                        onClick={() => onSheetChange(sheet)}
                                        disabled={disabled}
                                        className={`
                                            group relative aspect-square rounded-2xl overflow-hidden transition-all duration-300
                                            ${isSelected
                                                ? 'ring-4 ring-black scale-95 shadow-2xl'
                                                : 'ring-1 ring-gray-100 hover:ring-[#F37021] hover:scale-105'
                                            }
                                        `}
                                    >
                                        <img
                                            src={sheet.thumbnail || sheet.path || `https://aistudio.ranksol.net${sheet.path}`}
                                            alt={sheet.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        {isSelected && (
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                <HiOutlineCheckCircle size={24} className="text-white drop-shadow-lg" />
                                            </div>
                                        )}
                                        {/* Overlay name on hover */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                                            <p className="text-[8px] font-black text-white uppercase tracking-tighter leading-none">
                                                {sheet.name}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}

                            {hasMore && (
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore || disabled}
                                    className="aspect-square rounded-2xl bg-gray-50 hover:bg-orange-50 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-[#F37021] transition-all border-2 border-dashed border-gray-200 hover:border-[#F37021]"
                                >
                                    {loadingMore ? (
                                        <div className="w-4 h-4 border-2 border-[#F37021] border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <HiOutlinePlusCircle size={24} />
                                            <span className="text-[8px] font-black uppercase">More</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {selectedSheet && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 animate-in slide-in-from-bottom-2 duration-300">
                                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-white">
                                    <img src={selectedSheet.thumbnail || selectedSheet.path} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Active Selection</p>
                                    <p className="text-xs font-black text-black truncate">{selectedSheet.name}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductPicker;
