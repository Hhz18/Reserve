import React from 'react';

export const LoopDiagram: React.FC = () => {
  return (
    <div className="w-full max-w-sm aspect-square relative flex items-center justify-center p-4">
      <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#a3e635" />
          </marker>
        </defs>

        {/* Connecting Lines */}
        <path d="M200 60 L340 200" stroke="white" strokeWidth="4" strokeDasharray="10 5" className="animate-flow" strokeLinecap="round" />
        <path d="M340 200 L200 340" stroke="white" strokeWidth="4" strokeDasharray="10 5" className="animate-flow" strokeLinecap="round" />
        <path d="M200 340 L60 200" stroke="white" strokeWidth="4" strokeDasharray="10 5" className="animate-flow" strokeLinecap="round" />
        <path d="M60 200 L200 60" stroke="white" strokeWidth="4" strokeDasharray="10 5" className="animate-flow" strokeLinecap="round" />

        {/* Nodes */}
        {/* Top: INPUT */}
        <g className="animate-pulse-node" style={{ animationDelay: '0s' }}>
          <rect x="140" y="20" width="120" height="50" rx="8" fill="#1a1a1a" stroke="#a3e635" strokeWidth="3" />
          <text x="200" y="52" textAnchor="middle" fill="#a3e635" className="font-mono font-bold text-lg">INPUT</text>
        </g>

        {/* Right: SYSTEM */}
        <g className="animate-pulse-node" style={{ animationDelay: '0.5s' }}>
          <rect x="280" y="175" width="120" height="50" rx="8" fill="#1a1a1a" stroke="#38bdf8" strokeWidth="3" />
          <text x="340" y="207" textAnchor="middle" fill="#38bdf8" className="font-mono font-bold text-lg">SYSTEM</text>
        </g>

        {/* Bottom: OUTPUT */}
        <g className="animate-pulse-node" style={{ animationDelay: '1s' }}>
          <rect x="140" y="330" width="120" height="50" rx="8" fill="#1a1a1a" stroke="#fb7185" strokeWidth="3" />
          <text x="200" y="362" textAnchor="middle" fill="#fb7185" className="font-mono font-bold text-lg">OUTPUT</text>
        </g>

        {/* Left: CORRECTION */}
        <g className="animate-pulse-node" style={{ animationDelay: '1.5s' }}>
          <rect x="0" y="175" width="130" height="50" rx="8" fill="#1a1a1a" stroke="#fbbf24" strokeWidth="3" />
          <text x="65" y="207" textAnchor="middle" fill="#fbbf24" className="font-mono font-bold text-lg">CORRECTION</text>
        </g>

      </svg>
    </div>
  );
};