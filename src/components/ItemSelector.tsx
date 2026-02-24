import React from 'react';
import { DetectedItem } from '../../types';
import { HiOutlineCursorClick, HiOutlineCheckCircle, HiOutlineTrash, HiOutlineCubeTransparent } from 'react-icons/hi';

interface ItemSelectorProps {
  detectedItems: DetectedItem[];
  selectedItems: DetectedItem[];
  onItemsSelected: (items: DetectedItem[]) => void;
  disabled: boolean;
  isLoading: boolean;
  multiSelectMode?: boolean;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({
  detectedItems,
  selectedItems,
  onItemsSelected,
  disabled,
  isLoading,
  multiSelectMode = false,
}) => {

  const handleItemClick = (item: DetectedItem) => {
    if (multiSelectMode) {
      const isSelected = selectedItems.some(i => i.id === item.id);
      if (isSelected) {
        onItemsSelected(selectedItems.filter(i => i.id !== item.id));
      } else {
        if (selectedItems.length >= 3) return;
        onItemsSelected([...selectedItems, item]);
      }
    } else {
      const isSelected = selectedItems.some(i => i.id === item.id);
      onItemsSelected(isSelected ? [] : [item]);
    }
  };

  const handleClearAll = () => onItemsSelected([]);

  const isItemSelected = (item: DetectedItem) => selectedItems.some(i => i.id === item.id);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-black text-black uppercase tracking-widest flex items-center gap-2">
          <div className="text-[#F37021]">
            <HiOutlineCursorClick size={18} />
          </div>
          {multiSelectMode ? 'Target Areas' : 'Target Area'}
        </h3>
        {selectedItems.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-[10px] font-black uppercase text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <HiOutlineTrash />
            Reset
          </button>
        )}
      </div>

      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-10 h-10 border-4 border-[#F37021] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold text-black font-primary">Scanning Scene...</p>
            <p className="text-xs text-gray-400">Our AI is detecting editable areas</p>
          </div>
        ) : detectedItems.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 text-gray-200">
              <HiOutlineCubeTransparent size={48} />
            </div>
            <p className="text-sm font-bold text-gray-400">Waiting for Image</p>
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2 space-y-1">
            {detectedItems.map((item) => {
              const isSelected = isItemSelected(item);
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  disabled={disabled}
                  className={`
                    w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group
                    ${isSelected
                      ? 'bg-black text-white shadow-xl shadow-black/10'
                      : 'bg-transparent text-gray-600 hover:bg-orange-50 hover:text-black'}
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center transition-all
                    ${isSelected ? 'bg-[#F37021]' : 'bg-gray-100 group-hover:bg-white'}
                  `}>
                    {isSelected ? (
                      <HiOutlineCheckCircle size={20} className="text-white" />
                    ) : (
                      <span className="text-xs font-black opacity-50">{item.name.charAt(0)}</span>
                    )}
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <p className="text-xs font-black truncate">{item.name}</p>
                    <p className={`text-[10px] truncate opacity-60`}>
                      {item.description}
                    </p>
                  </div>

                  {multiSelectMode && !isSelected && (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-100 group-hover:border-[#F37021] transition-colors"></div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedItems.length > 0 && (
        <div className="flex gap-2 flex-wrap px-1">
          {selectedItems.map(item => (
            <span key={item.id} className="px-3 py-1 bg-black text-white rounded-full text-[10px] font-bold flex items-center gap-2 animate-in zoom-in-75 duration-300">
              {item.name}
              <button onClick={() => handleItemClick(item)} className="hover:text-[#F37021]">&times;</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemSelector;