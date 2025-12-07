
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { PREVIEW_COLORS } from '../constants';
import { ThemeColor } from '../types';

export const ThemeSwitcher: React.FC = () => {
  const { globalTheme, setGlobalTheme } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const colors = Object.keys(PREVIEW_COLORS) as ThemeColor[];

  return (
    <div className="relative flex items-center z-50">
      {/* Main Trigger Button - Enhanced Visibility with Ring */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-10 h-10 rounded-full border-2 border-nb-black 
          transition-all hover:scale-110 active:scale-90 z-20 
          flex items-center justify-center shadow-nb-sm
          ring-2 ring-white ring-offset-2 ring-offset-nb-black
          ${PREVIEW_COLORS[globalTheme]}
        `}
        title="Change Theme"
      >
        <span className="sr-only">Change Theme</span>
      </button>

      {/* Expanded Palette */}
      <div 
        className={`
          absolute top-0 left-0 h-10 flex items-center gap-2 pl-14 transition-all duration-300 ease-bouncy overflow-visible
          ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}
        `}
      >
        <div className="flex gap-2 bg-nb-white p-2 border-2 border-nb-black rounded-full shadow-nb">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => {
                setGlobalTheme(color);
                setIsExpanded(false);
              }}
              className={`
                w-6 h-6 rounded-full border-2 border-nb-black transition-transform hover:scale-125
                ${PREVIEW_COLORS[color]}
                ${globalTheme === color ? 'ring-2 ring-offset-1 ring-white' : ''}
              `}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
