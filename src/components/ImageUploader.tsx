import React, { useState, useRef, useEffect } from 'react';
import { fetchRoomTemplates, urlToFile, type RoomTemplate } from '../services/roomTemplatesService';
import { HiOutlineCloudUpload, HiOutlineDuplicate, HiOutlineCamera, HiOutlineTrash, HiOutlineExclamation } from 'react-icons/hi';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [roomTemplates, setRoomTemplates] = useState<RoomTemplate[]>([]);
  const [selectedTemplateSlug, setSelectedTemplateSlug] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templates = await fetchRoomTemplates();
        setRoomTemplates(templates);
      } catch (error) {
        console.error('Error loading templates:', error);
      }
    };
    loadTemplates();
  }, []);

  const handleTemplateSelect = async (template: RoomTemplate) => {
    if (isLoading) return;
    setSelectedTemplateSlug(template.slug);
    try {
      const file = await urlToFile(template.image, `template-${template.slug}.jpg`);
      onImageSelected(file);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) onImageSelected(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isLoading && e.dataTransfer.files?.[0]) {
      onImageSelected(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full font-primary">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-black text-black uppercase tracking-widest flex items-center gap-2">
          <span className="text-[#F37021]"><HiOutlineCamera size={18} /></span>
          Source Image
        </h3>
      </div>

      {!previewUrl ? (
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
                    group relative h-48 rounded-[32px] border-2 border-dashed transition-all duration-500 cursor-pointer flex flex-col items-center justify-center p-6 text-center
                    ${isDragging
                ? 'border-[#F37021] bg-orange-50 scale-[0.98]'
                : 'border-gray-100 bg-white hover:border-[#F37021] hover:bg-gray-50'}
                `}
          >
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

            <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500
                    ${isDragging ? 'bg-[#F37021] text-white rotate-12' : 'bg-gray-100 text-gray-400 group-hover:bg-[#F37021] group-hover:text-white group-hover:rotate-12'}
                `}>
              <HiOutlineCloudUpload size={28} />
            </div>

            <p className="text-xs font-black text-black uppercase tracking-widest mb-1">Upload Photo</p>
            <p className="text-[10px] text-gray-400 font-medium">Drag & drop or Click to browse</p>
          </div>

          {roomTemplates.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <span className="text-[#F37021]"><HiOutlineDuplicate size={14} /></span>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Try a Template</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {roomTemplates.map(template => (
                  <button
                    key={template.slug}
                    onClick={() => handleTemplateSelect(template)}
                    className={`
                                    flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all flex items-center justify-center bg-gray-50
                                    ${selectedTemplateSlug === template.slug ? 'border-[#F37021] scale-95 shadow-lg' : 'border-gray-100 hover:border-[#F37021]'}
                                `}
                  >
                    <img src={template.image} className="max-w-full max-h-full object-contain" alt={template.slug} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative group rounded-[32px] overflow-hidden border-2 border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center min-h-[300px] max-h-[600px] p-2">
          <img src={previewUrl} className="max-w-full max-h-full object-contain rounded-2xl" alt="Preview" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={onImageRemoved}
              className="p-3 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all transform scale-90 group-hover:scale-100 shadow-xl"
            >
              <HiOutlineTrash size={24} />
            </button>
          </div>
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#F37021] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      )}

      {!previewUrl && (
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <span className="text-[#F37021] flex-shrink-0 mt-0.5"><HiOutlineExclamation size={16} /></span>
          <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
            Higher quality images give better AI detection results. Try to use well-lit photos.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
