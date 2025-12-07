import React from 'react';

export const LoopConnections: React.FC = () => {
  return (
    // inset-[-50px] aligns perfectly with cubes at -80px (80 - 30 = 50)
    <div className="absolute inset-[-50px] z-10 pointer-events-none hidden md:block">
      <svg className="w-full h-full overflow-visible">
        <defs>
          <filter id="glow-pulse" x="-50%" y="-50%" width="200%" height="200%">
             <feGaussianBlur stdDeviation="3" result="coloredBlur" />
             <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
             </feMerge>
          </filter>
        </defs>

        {/* 
          Base Track: Continuous loop
          Using 'pathLength="100"' allows us to use simple percentage-based dasharray/offset for animation 
        */}
        <rect 
          x="0" y="0" width="100%" height="100%" 
          fill="none" 
          stroke="var(--color-border)" 
          strokeWidth="2" 
          strokeDasharray="2 2"
          strokeOpacity="0.4"
          pathLength="100"
          className="animate-[dash-loop_60s_linear_infinite]"
        />

        {/* 
          Data Pulse: A bright signal traveling along the pipe
          Dasharray: 5 units of stroke, 95 units of gap (total 100)
          Animation: Offsets by 100 to 0 to loop
        */}
        <rect 
          x="0" y="0" width="100%" height="100%" 
          fill="none" 
          stroke="var(--color-accent)" 
          strokeWidth="4" 
          strokeDasharray="5 95" 
          strokeLinecap="round"
          pathLength="100"
          filter="url(#glow-pulse)"
          className="animate-[dash-loop_3s_linear_infinite]"
        />
      </svg>
    </div>
  );
};