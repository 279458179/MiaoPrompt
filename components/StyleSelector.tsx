import React from 'react';
import { STYLES, StyleOption, ASPECT_RATIOS } from '../types';

interface StyleSelectorProps {
  selectedStyle: string;
  onSelectStyle: (id: string) => void;
  selectedRatio: string;
  onSelectRatio: (id: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
  selectedRatio,
  onSelectRatio
}) => {
  return (
    <div className="space-y-6">
      {/* Style Selection */}
      <div>
        <label className="block text-gray-700 font-bold mb-3 px-1 flex items-center gap-2">
          <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">1</span> 
          选择画风
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STYLES.map((style: StyleOption) => (
            <button
              key={style.id}
              onClick={() => onSelectStyle(style.id)}
              className={`
                relative p-3 rounded-2xl border-2 transition-all duration-200 text-left group
                ${selectedStyle === style.id 
                  ? 'border-primary bg-primary/10 shadow-md transform scale-[1.02]' 
                  : 'border-transparent bg-white hover:border-primary/30 hover:shadow-sm shadow-sm'
                }
              `}
            >
              <div className="text-2xl mb-1">{style.icon}</div>
              <div className={`font-bold text-sm ${selectedStyle === style.id ? 'text-primary' : 'text-gray-700'}`}>
                {style.label}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {style.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Ratio Selection */}
      <div>
        <label className="block text-gray-700 font-bold mb-3 px-1 flex items-center gap-2">
          <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">2</span> 
          画面比例
        </label>
        <div className="flex flex-wrap gap-2">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.id}
              onClick={() => onSelectRatio(ratio.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-colors border
                ${selectedRatio === ratio.id
                  ? 'bg-secondary text-white border-secondary shadow-md'
                  : 'bg-white text-gray-600 border-gray-100 hover:border-secondary/50'
                }
              `}
            >
              {ratio.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};