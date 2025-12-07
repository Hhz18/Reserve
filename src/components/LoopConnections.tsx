import React from 'react';

export const LoopConnections: React.FC = () => {
  return (
    // inset-[-50px] creates a box that is 100px larger than the parent in both dimensions.
    // The parent is the login card wrapper. 
    // The Cube centers are offset by approx 50px outwards from the card edges.
    // This rect draws a line connecting those centers.
    <div className="absolute inset-[-50px] z-10 pointer-events-none hidden md:block">
      <svg className="w-full h-full overflow-visible">
        <defs>
          <filter id="glow-pulse" x="-50%" y="-50%" width="200%" height="200%">
             <feGaussianBlur stdDeviation="4" result="coloredBlur" />
             <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
             </feMerge>
          </filter>
        </defs>

        {/* 
          Base Track: Continuous loop background.
          Visible but subtle.
        */}
        <rect 
          x="0" y="0" width="100%" height="100%" 
          fill="none" 
          stroke="var(--color-border)" 
          strokeWidth="1" 
          strokeDasharray="4 4"
          strokeOpacity="0.3"
          rx="20"
          pathLength="100"
        />

        {/* 
          Data Pulse: The active signal.
          strokeDasharray="15 85" means on a pathLength of 100, we have 15 units of line, 85 units of gap.
          animate-dash-loop moves the offset to make it travel.
        */}
        <rect 
          x="0" y="0" width="100%" height="100%" 
          fill="none" 
          stroke="var(--color-accent)" 
          strokeWidth="3" 
          strokeDasharray="15 85" 
          strokeLinecap="round"
          rx="20"
          pathLength="100"
          filter="url(#glow-pulse)"
          className="animate-dash-loop"
        />
        
        {/* Secondary faint pulse traveling opposite direction or just filling */}
      </svg>
    </div>
  );
};