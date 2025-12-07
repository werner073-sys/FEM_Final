import React from 'react';
import { CyclePhase } from '../types';

interface LunarDialProps {
  currentDay: number;
  cycleLength: number;
  phases: CyclePhase[];
}

const LunarDial: React.FC<LunarDialProps> = ({ currentDay, cycleLength, phases }) => {
  const radius = 120;
  const strokeWidth = 20;
  const center = radius + strokeWidth;
  const size = center * 2;

  // Helper to calculate arc path
  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className="relative flex items-center justify-center py-8 animate-fade-in">
      {/* Background Glow - Softened */}
      <div className="absolute inset-0 bg-lumina-rose/10 blur-3xl rounded-full transform scale-75"></div>

      <svg width={size} height={size} className="transform -rotate-90">
        {/* Render Phases */}
        {phases.map((phase, index) => {
          const startAngle = (phase.startDay / cycleLength) * 360;
          const endAngle = (phase.endDay / cycleLength) * 360;
          
          return (
            <path
              key={index}
              d={describeArc(center, center, radius, startAngle, endAngle)}
              fill="none"
              stroke={phase.color}
              strokeWidth={strokeWidth}
              className="opacity-90 mix-blend-multiply"
              strokeLinecap="round"
            />
          );
        })}

        {/* Current Day Marker Track */}
        <circle cx={center} cy={center} r={radius - 25} fill="none" stroke="#E0BBE4" strokeWidth="1" strokeDasharray="4 4" className="opacity-50" />
      </svg>
      
      {/* Central Info */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <h3 className="text-lumina-soft text-sm font-sans tracking-widest uppercase mb-1 font-bold">Cycle Day</h3>
        <span className="text-6xl font-serif text-lumina-highlight drop-shadow-sm">
          {currentDay}
        </span>
        <p className="text-lumina-rose/80 text-xs mt-2 font-medium">Follicular Phase</p>
      </div>

      {/* Interactive Marker */}
      <div 
        className="absolute w-6 h-6 bg-white rounded-full shadow-lg border-2 border-lumina-rose z-10"
        style={{
          transform: `rotate(${(currentDay / cycleLength) * 360}deg) translateY(-${radius}px)`,
          transition: 'transform 1s ease-out'
        }}
      ></div>
    </div>
  );
};

export default LunarDial;