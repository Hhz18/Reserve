import React, { useMemo } from 'react';
import { ReviewItem } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { THEME_COLORS } from '../constants';

interface HeatmapProps {
  items: ReviewItem[];
}

export const Heatmap: React.FC<HeatmapProps> = ({ items }) => {
  const { globalTheme, t } = useAppContext();

  // Helper to generate the last 365 days
  const days = useMemo(() => {
    const d = [];
    const today = new Date();
    // Start from 52 weeks ago (approx)
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      d.push(date);
    }
    return d;
  }, []);

  // Process data: map 'YYYY-MM-DD' to count
  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach(item => {
      if (item.lastReviewedAt) {
        const dateStr = new Date(item.lastReviewedAt).toISOString().split('T')[0];
        map.set(dateStr, (map.get(dateStr) || 0) + 1);
      }
    });
    return map;
  }, [items]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-nb-gray';
    // Using opacity logic or shade logic based on global theme
    // For simplicity in this stack, we'll just use the theme color but with opacity
    // Or hardcode shades. Let's use opacity for a "monochromatic" feel.
    // However, Tailwind classes need to be constructed carefully.
    
    // Let's rely on standard Green for heatmap or use the theme. 
    // Ideally user wants "Mature". Standard GitHub green is classic.
    // Let's try to adapt to theme.
    
    // Mapping theme names to tailwind colors roughly
    const baseColorMap: Record<string, string> = {
        amber: 'bg-amber',
        lime: 'bg-lime',
        pink: 'bg-pink',
        sky: 'bg-sky',
        violet: 'bg-violet',
        orange: 'bg-orange',
        teal: 'bg-teal',
        rose: 'bg-rose',
    }
    const base = baseColorMap[globalTheme] || 'bg-gray';
    
    if (count > 4) return `${base}-600`;
    if (count > 2) return `${base}-400`;
    return `${base}-300`;
  };

  return (
    <div className="w-full overflow-x-auto p-4 bg-white border-2 border-nb-black rounded-lg shadow-nb">
      <div className="flex justify-between items-end mb-2">
         <h3 className="font-bold text-sm text-nb-black uppercase">{t('dash.heatmapTitle')}</h3>
         <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>{t('dash.less')}</span>
            <div className="w-3 h-3 bg-nb-gray rounded-sm"></div>
            <div className={`w-3 h-3 ${getColor(1)} rounded-sm`}></div>
            <div className={`w-3 h-3 ${getColor(3)} rounded-sm`}></div>
            <div className={`w-3 h-3 ${getColor(5)} rounded-sm`}></div>
            <span>{t('dash.more')}</span>
         </div>
      </div>
      
      <div className="flex gap-1 min-w-max">
        {Array.from({ length: 53 }).map((_, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, dayIndex) => {
              // Calculate day index in the linear array
              const dayLinearIndex = weekIndex * 7 + dayIndex;
              if (dayLinearIndex >= days.length) return null;
              
              const date = days[dayLinearIndex];
              const dateStr = date.toISOString().split('T')[0];
              const count = activityMap.get(dateStr) || 0;

              return (
                <div 
                  key={dateStr}
                  className={`w-3 h-3 rounded-sm ${getColor(count)}`}
                  title={`${dateStr}: ${count} reviews`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};