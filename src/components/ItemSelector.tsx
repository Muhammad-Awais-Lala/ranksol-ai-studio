import React from 'react';
import { DetectedItem } from '../../types';

interface ItemSelectorProps {
  detectedItems: DetectedItem[];
  selectedItems: DetectedItem[]; // Changed to array for multi-select
  onItemsSelected: (items: DetectedItem[]) => void; // Changed to handle array
  disabled: boolean;
  isLoading: boolean;
  multiSelectMode?: boolean; // New prop to toggle multi-select
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
      // Multi-select logic
      const isSelected = selectedItems.some(i => i.id === item.id);
      if (isSelected) {
        onItemsSelected(selectedItems.filter(i => i.id !== item.id));
      } else {
        onItemsSelected([...selectedItems, item]);
      }
    } else {
      // Single select logic
      const isSelected = selectedItems.some(i => i.id === item.id);
      onItemsSelected(isSelected ? [] : [item]);
    }
  };

  const handleSelectAll = () => {
    onItemsSelected([...detectedItems]);
  };

  const handleClearAll = () => {
    onItemsSelected([]);
  };

  const isItemSelected = (item: DetectedItem) => {
    return selectedItems.some(i => i.id === item.id);
  };

  return (
    <div className="flex flex-col items-start p-4 bg-white rounded-lg shadow-lg w-full border border-gray-100">
      {/* Header with selection count */}
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-bold text-black flex items-center gap-2">
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {multiSelectMode ? 'Select Items' : 'Select Item'}
        </h3>
        {selectedItems.length > 0 && (
          <span className="px-3 py-1 bg-[#EFE223] text-black text-sm font-bold rounded-full shadow-md">
            {selectedItems.length} selected
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center w-full py-8 text-black">
          <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-medium">Detecting items...</span>
        </div>
      ) : detectedItems.length === 0 ? (
        <div className="w-full py-8 text-center">
          <svg className="w-16 h-16 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-600 font-medium">No items detected yet</p>
          <p className="text-gray-400 text-sm mt-1">Upload an image to get started</p>
        </div>
      ) : (
        <>
          {/* Batch selection controls for multi-select mode */}
          {multiSelectMode && (
            <div className="flex gap-2 mb-3 w-full">
              <button
                onClick={handleSelectAll}
                disabled={disabled || detectedItems.length === selectedItems.length}
                className="flex-1 px-3 py-2 bg-black hover:bg-gray-900 text-[#EFE223] text-sm font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                Select All
              </button>
              <button
                onClick={handleClearAll}
                disabled={disabled || selectedItems.length === 0}
                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-black text-sm font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Items list */}
          <div className="w-full h-[300px] overflow-y-auto px-1 space-y-2 custom-scrollbar overflow-x-hidden">
            {detectedItems.map((item) => {
              const isSelected = isItemSelected(item);
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  disabled={disabled}
                  className={`block w-full text-left p-2 rounded-lg transition-all duration-200 group relative
                    ${isSelected
                      ? 'bg-[#EFE223] text-black shadow-lg scale-[1.02] border-1 border-black'
                      : 'bg-white text-gray-800 hover:bg-yellow-50 border-1 border-transparent hover:border-[#EFE223] shadow-sm hover:shadow-md'}
                    disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01]`}
                  aria-labelledby={`item-name-${item.id}`}
                  aria-describedby={`item-description-tooltip-${item.id}`}
                >
                  <div className="flex items-start gap-2">
                    {/* Checkbox for multi-select */}
                    {multiSelectMode && (
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-4 h-4 rounded border-1 flex items-center justify-center transition-all duration-200
                          ${isSelected
                            ? 'bg-black border-black'
                            : 'bg-transparent border-gray-400 group-hover:border-black'}`}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3 text-[#EFE223]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Item content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span id={`item-name-${item.id}`} className={`font-bold text-xs ${isSelected ? 'text-black' : 'text-black opacity-70'}`}>
                          {item.name}
                        </span>
                        {isSelected && !multiSelectMode && (
                          <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className={`text-[10px] mt-0.5 line-clamp-2 ${isSelected ? 'text-black/80' : 'text-gray-500'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Tooltip for full description */}
                  <div
                    id={`item-description-tooltip-${item.id}`}
                    role="tooltip"
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2
                                hidden group-hover:block w-auto max-w-xs
                                bg-black text-white text-xs p-3 rounded-lg shadow-xl z-20 whitespace-normal
                                border border-gray-700"
                  >
                    <div className="font-semibold mb-1">{item.name}</div>
                    <div className="text-gray-300">{item.description}</div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                      <div className="border-8 border-transparent border-t-black"></div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selection summary */}
          {selectedItems.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100 w-full">
              <div className="flex items-center justify-between text-sm">
                <span className="text-black font-medium">
                  {multiSelectMode
                    ? `${selectedItems.length} of ${detectedItems.length} items selected`
                    : `Selected: ${selectedItems[0].name}`
                  }
                </span>
                <button
                  onClick={handleClearAll}
                  disabled={disabled}
                  className="px-3 py-1 bg-black text-[#EFE223] text-xs font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-[#EFE223]"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ItemSelector;