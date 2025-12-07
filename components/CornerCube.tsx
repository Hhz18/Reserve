import React from 'react';

interface CornerCubeProps {
  label: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color: string; // Tailwind bg class e.g., 'bg-nb-lime'
  onClick?: () => void;
  isActive?: boolean;
  isDimmed?: boolean;
  isHighlighted?: boolean;
}

export const CornerCube: React.FC<CornerCubeProps> = ({ label, position, color, onClick, isActive, isDimmed, isHighlighted }) => {
  let posClass = '';
  // Determine positioning based on active state
  if (isActive) {
      // Centered, Scaled Up, High Z-Index
      posClass = 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[3] z-50';
  } else {
      // Default corner positions - Adjusted to -20 (80px) for a balanced spacing
      switch (position) {
        case 'top-left': posClass = '-top-20 -left-20'; break;
        case 'top-right': posClass = '-top-20 -right-20'; break;
        case 'bottom-left': posClass = '-bottom-20 -left-20'; break;
        case 'bottom-right': posClass = '-bottom-20 -right-20'; break;
      }
  }

  // Animation & Interaction Logic
  const delay = Math.random() * 2 + 's';
  const floatClass = (isActive || isHighlighted) ? '' : 'animate-float'; // Stop floating when focused
  
  // Visibility Logic
  const visibilityClass = isDimmed ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer';

  // Highlight Styles
  const highlightStyle = isHighlighted 
    ? 'scale-110 drop-shadow-[0_0_15px_var(--color-accent)] z-40' 
    : '';

  // Rotation Logic: 
  // - When active: Continuous slow spin to show off the cube
  // - When idle: Spin on hover
  // - When highlighted: Fast spin to indicate processing/active
  const cubeAnimationClass = isActive || isHighlighted
     ? 'animate-[spin-3d_2s_linear_infinite]' 
     : 'group-hover:animate-[spin-3d_3s_linear_infinite]';

  // Base Z-Index is 30 to sit above typical content (z-20) but below active overlays
  return (
    <div 
        onClick={onClick}
        className={`absolute ${posClass} w-[60px] h-[60px] hidden md:block cube-scene select-none group transition-all duration-500 ease-bouncy z-30 ${visibilityClass} ${highlightStyle}`}
    >
        {/* Floating Wrapper - Handles Y Movement (Disabled when active) */}
        <div className={`w-full h-full ${floatClass}`} style={{ animationDelay: delay }}>
            
            {/* Cube Wrapper - Handles 3D Rotation */}
            <div className={`cube ${cubeAnimationClass}`}>
                {/* Front Face - Main Label */}
                <div className={`cube-face cube-front ${color} text-black shadow-[inset_0_0_10px_rgba(0,0,0,0.1)]`}>
                    <div className="flex flex-col items-center justify-center leading-tight">
                        <span className="text-[10px] font-bold opacity-70 font-mono tracking-tighter mb-0.5">NODE</span>
                        <span className="text-xs font-black tracking-tight">{label}</span>
                    </div>
                </div>
                
                {/* Side Faces - Stylized (Darker/Opacity variants for 3D effect) */}
                <div className={`cube-face cube-right ${color} border-l-0 brightness-90`}>
                    <div className="w-full h-1 bg-black opacity-20"></div>
                </div>
                <div className={`cube-face cube-top ${color} border-b-0 brightness-110`}>
                    <div className="h-full w-1 bg-black opacity-20"></div>
                </div>

                {/* Back faces - Visible when spinning */}
                <div className={`cube-face cube-back ${color} brightness-50 flex items-center justify-center`}>
                   <div className="w-2 h-2 rounded-full bg-nb-black opacity-50"></div>
                </div>
                <div className={`cube-face cube-left ${color} brightness-75`}></div>
                <div className={`cube-face cube-bottom ${color} brightness-50`}></div>
            </div>
        </div>
    </div>
  );
};