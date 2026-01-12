import React, { useState, useRef, useEffect } from 'react';
import { fetchRoomTemplates, urlToFile, type RoomTemplate } from '../services/roomTemplatesService';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  onImageRemoved?: () => void;
  previewUrl: string | null;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  onImageRemoved,
  previewUrl,
  isLoading
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [roomTemplates, setRoomTemplates] = useState<RoomTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [selectedTemplateSlug, setSelectedTemplateSlug] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Fetch room templates on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        const templates = await fetchRoomTemplates();
        setRoomTemplates(templates);
      } catch (error) {
        console.error('Error loading room templates:', error);
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    loadTemplates();
  }, []);

  // Auto-scroll effect for carousel
  useEffect(() => {
    if (!scrollContainerRef.current || roomTemplates.length === 0) return;

    const container = scrollContainerRef.current;
    let scrollInterval: NodeJS.Timeout;

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          // Reset to start when reaching the end
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll by one template width
          container.scrollBy({ left: 200, behavior: 'smooth' });
        }
      }, 3000); // Scroll every 3 seconds
    };

    const stopAutoScroll = () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
    };

    // Start auto-scroll
    startAutoScroll();

    // Pause on hover
    container.addEventListener('mouseenter', stopAutoScroll);
    container.addEventListener('mouseleave', startAutoScroll);

    return () => {
      stopAutoScroll();
      container.removeEventListener('mouseenter', stopAutoScroll);
      container.removeEventListener('mouseleave', startAutoScroll);
    };
  }, [roomTemplates]);

  // Check scroll position to show/hide navigation arrows
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    );
  };

  // Update scroll position on mount and when templates change
  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [roomTemplates]);

  // Scroll handlers
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleTemplateSelect = async (template: RoomTemplate) => {
    if (isLoading) return;

    setSelectedTemplateSlug(template.slug);
    try {
      // Convert the template image URL to a File object
      const file = await urlToFile(template.image, template.title || `template-${template.slug}.jpg`);

      setFileInfo({
        name: file.name,
        size: formatFileSize(file.size)
      });

      onImageSelected(file);
    } catch (error) {
      console.error('Error selecting template:', error);
      setSelectedTemplateSlug(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFileInfo({
        name: file.name,
        size: formatFileSize(file.size)
      });
      onImageSelected(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!isLoading && e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setFileInfo({
          name: file.name,
          size: formatFileSize(file.size)
        });
        onImageSelected(file);
      }
    }
  };

  const handleRemoveImage = () => {
    setFileInfo(null);
    setSelectedTemplateSlug(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col p-6 bg-white rounded-xl shadow-lg border-2 border-gray-100 w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-[#EFE223] rounded-lg">
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-black">
          Upload Room Image
        </h3>
      </div>

      {/* Info Tagline */}
      <div className="mb-4 flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <svg className="w-5 h-5 text-black flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <p className="text-xs text-black leading-relaxed">
          <span className="font-semibold">Note:</span> Accuracy of texture applying is depending upon uploaded image quality. Higher quality images yield better results.
        </p>
      </div>

      {/* Upload Area or Preview */}
      {!previewUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative h-96 flex flex-col justify-center border-3 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer
            ${isDragging
              ? 'border-[#EFE223] bg-yellow-50 scale-[1.02]'
              : 'border-gray-200 bg-white hover:border-[#EFE223] hover:bg-gray-50'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={!isLoading ? handleBrowseClick : undefined}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
            className="hidden"
            aria-label="Upload room image"
          />

          <div className="flex flex-col items-center justify-center text-center space-y-4">
            {/* Upload Icon */}
            <div className={`p-4 rounded-full transition-all duration-300 ${isDragging
              ? 'bg-[#EFE223] scale-110'
              : 'bg-gray-100'
              }`}>
              <svg className={`w-12 h-12 transition-colors ${isDragging
                ? 'text-black'
                : 'text-gray-400'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>

            {/* Text */}
            <div>
              <p className="text-lg font-semibold text-black mb-1">
                {isDragging ? 'Drop your image here' : 'Drag & drop your image here'}
              </p>
              <p className="text-sm text-gray-500 mb-3">
                or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Supports: JPG, PNG, WEBP (Max 10MB)
              </p>
            </div>

            {/* Browse Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleBrowseClick();
              }}
              disabled={isLoading}
              className="px-6 py-2.5 bg-black hover:bg-gray-900 text-[#EFE223] font-semibold rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              Browse Files
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Image Preview */}
          <div className="relative group rounded-xl overflow-hidden border-2 border-gray-100 shadow-lg h-96 w-full">
            <img
              src={previewUrl}
              alt="Uploaded Room Preview"
              className="w-full h-full object-contain bg-gray-50"
            />

            {/* Overlay with Remove Button */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
              <button
                onClick={handleRemoveImage}
                disabled={isLoading}
                className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 px-4 py-2 bg-black text-[#EFE223] font-semibold rounded-lg shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-[#EFE223]"
                aria-label="Remove image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove Image
              </button>
            </div>
          </div>

          {/* File Info */}
          {fileInfo && (
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 bg-yellow-50 rounded-lg flex-shrink-0">
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-black truncate">
                    {fileInfo.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {fileInfo.size}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveImage}
                disabled={isLoading}
                className="ml-2 p-2 text-black hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Remove image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Room Templates Carousel */}
      {!previewUrl && roomTemplates.length > 0 && (
        <div className="mb-4">
          {/* Divider */}
          <div className="mt-4 mb-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h4 className="text-sm font-bold text-black">Room Templates</h4>
            </div>
            <span className="text-xs text-gray-500">Click to select</span>
          </div>

          {/* Scrollable Template Container with Navigation Arrows */}
          <div className="relative">
            {/* Left Arrow Button */}
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black hover:bg-gray-900 text-[#EFE223] rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Scroll left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Right Arrow Button */}
            {canScrollRight && (
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black hover:bg-gray-900 text-[#EFE223] rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Scroll right"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#D1D5DB #F3F4F6'
              }}
            >
              {isLoadingTemplates ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="flex-shrink-0 w-40 h-28 bg-gray-200 rounded-lg animate-pulse"
                  />
                ))
              ) : (
                roomTemplates.map((template) => (
                  <button
                    key={template.slug}
                    onClick={() => handleTemplateSelect(template)}
                    disabled={isLoading}
                    className={`
                      flex-shrink-0 w-40 h-28 rounded-lg overflow-hidden border-2 transition-all duration-300
                      ${selectedTemplateSlug === template.slug
                        ? 'border-[#EFE223] ring-2 ring-[#EFE223] ring-offset-2 scale-105'
                        : 'border-gray-200 hover:border-[#EFE223] hover:scale-105'
                      }
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      relative group
                    `}
                  >
                    <img
                      src={template.image}
                      alt={template.title || `Template ${template.slug}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Simple fallback - just log error
                        console.error('Failed to load template image:', template.image);
                      }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Selected indicator */}
                    {selectedTemplateSlug === template.slug && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-[#EFE223] rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}

                    {/* Template name tooltip */}
                    {template.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {template.title}
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}


      {/* Loading State */}
      {isLoading && (
        <div className="mt-4 flex items-center justify-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm font-medium text-black">
            Processing image...
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
