import React, { useMemo } from 'react';

interface PlanetProps {
  color1: string; // Primary galaxy color
  color2: string; // Secondary galaxy color
  size: number;   // Diameter
  top: string;
  left: string;
  orbitDuration?: string;
  delay?: string;
}

export const Planet: React.FC<PlanetProps> = ({ 
  color1, 
  color2, 
  size, 
  top, 
  left, 
  orbitDuration = '120s', 
  delay = '0s' 
}) => {

  // Generates a cloud of particles forming spiral arms
  const generateGalaxy = (count: number, maxRadius: number, c1: string, c2: string) => {
    let boxShadow = '';
    const arms = 2; // Two main arms like the reference
    const spinFactor = 4; // Relaxed spin factor to fill space better (was 5)

    for (let i = 0; i < count; i++) {
      // Assign particle to an arm
      const arm = i % arms;
      const armOffset = (Math.PI * 2 / arms) * arm;

      // Distance from center (0 to 1)
      const distPercent = Math.random(); 
      
      const radius = distPercent * maxRadius;

      // Angle = Arm Start + Winding Amount
      const angle = armOffset + (spinFactor * distPercent);

      // Scatter logic:
      // Increased scatter width to fill the "gaps" and make arms thicker
      const scatterWidth = 0.8 + (distPercent * 0.9); 
      const angleScatter = (Math.random() - 0.5) * scatterWidth;
      
      // Radial scatter makes the edges of the arms less sharp
      const radialScatter = (Math.random() - 0.5) * (maxRadius * 0.15);

      const finalAngle = angle + angleScatter;
      const finalRadius = radius + radialScatter;

      const x = Math.cos(finalAngle) * finalRadius;
      const y = Math.sin(finalAngle) * finalRadius;

      // Color variation
      const color = Math.random() > 0.6 ? c1 : c2;
      
      // Particle Size - slightly varied and larger for fullness
      const s = Math.random() * 1.5 + 0.5;
      
      boxShadow += `${x.toFixed(1)}px ${y.toFixed(1)}px 0 ${s}px ${color},`;
    }
    return boxShadow.slice(0, -1);
  };

  // Dense glowing core particles - Modified for higher visibility
  const generateCore = (count: number, radius: number) => {
    let boxShadow = '';
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Random radius within core, highly concentrated at center
        const r = Math.random() * radius * Math.pow(Math.random(), 0.5); 
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        
        // Significantly increased size for core stars to make them pop (1.5px to 3.5px)
        const s = Math.random() * 2.0 + 1.5;
        
        boxShadow += `${x.toFixed(1)}px ${y.toFixed(1)}px 0 ${s}px #ffffff,`;
    }
    return boxShadow.slice(0, -1);
  }

  // Increased count to 800 (was 300) for a much denser, filled-in look
  const stars = useMemo(() => generateGalaxy(800, size / 1.7, color1, color2), [size, color1, color2]);
  
  // Increased core count (200) and tightened radius (size/7) for a brighter, more distinct center
  const coreStars = useMemo(() => generateCore(200, size / 7), [size]);

  return (
    <div 
      className="absolute flex items-center justify-center opacity-90 transition-all duration-700 ease-out hover:scale-150 hover:brightness-125 cursor-pointer pointer-events-auto"
      style={{ 
        top, 
        left, 
        width: size, 
        height: size,
        perspective: '600px', // Adds depth to the tilt
      }}
    >
        {/* Tilted Plane */}
        <div 
            className="w-full h-full relative"
            style={{
                transform: 'rotateX(60deg) rotateY(-15deg)', // Significant tilt to match reference
                transformStyle: 'preserve-3d'
            }}
        >
            {/* Rotating Assembly */}
            <div 
                className="absolute inset-0 flex items-center justify-center animate-orbit"
                style={{
                    animationDuration: orbitDuration,
                    animationDelay: delay,
                    transformStyle: 'preserve-3d'
                }}
            >
                 {/* 1. Core Glow (Volumetric look) - Brightened center */}
                <div 
                    className="absolute rounded-full"
                    style={{
                        width: size * 0.3,
                        height: size * 0.3,
                        background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.1) 70%, transparent 100%)',
                        filter: 'blur(12px)',
                        boxShadow: `0 0 40px 15px ${color1}60`, // brighter localized colored glow
                        transform: 'translateZ(1px)'
                    }}
                />

                {/* 2. Main Spiral Arms */}
                <div className="absolute w-0.5 h-0.5 bg-transparent rounded-full" style={{ boxShadow: stars }} />
                
                {/* 3. Dense Core Stars */}
                <div className="absolute w-0.5 h-0.5 bg-transparent rounded-full" style={{ boxShadow: coreStars }} />
            </div>
        </div>
    </div>
  );
};