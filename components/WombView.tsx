import React from 'react';

interface WombViewProps {
  week: number;
}

const WombView: React.FC<WombViewProps> = ({ week }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      
      <div className="relative w-full max-w-md aspect-square rounded-full border border-white/50 bg-gradient-to-b from-lumina-rose/20 to-lumina-lavender/20 backdrop-blur-sm overflow-hidden flex items-center justify-center shadow-xl">
        
        {/* Placeholder for "High-fidelity artistic rendering" */}
        {/* In a real app, this would be a WebGL canvas or specific asset */}
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/fetus_art/800/800')] bg-cover bg-center opacity-30 mix-blend-overlay hover:opacity-50 transition-opacity duration-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent"></div>
        
        <div className="relative z-10 text-center p-6">
            <h2 className="text-3xl font-serif text-lumina-highlight mb-2">Week {week}</h2>
            <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 border border-white/40 shadow-sm">
                <p className="text-lumina-highlight/60 font-sans text-sm uppercase tracking-wide mb-1 font-bold">Size Comparison</p>
                <p className="text-xl text-lumina-highlight font-serif italic">"Size of a Wild Fig"</p>
            </div>
        </div>

        {/* Interactive Hotspots (Simulated) */}
        <button className="absolute top-1/3 left-1/4 w-3 h-3 bg-white rounded-full animate-ping opacity-75 shadow-lg"></button>
        <button className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-white rounded-full animate-ping opacity-50 delay-700 shadow-lg"></button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-md">
         <div className="bg-white/40 p-4 rounded-lg border border-white/50 text-center shadow-sm">
            <span className="block text-lumina-soft text-xs uppercase font-bold">Baby's Weight</span>
            <span className="block text-lumina-highlight font-serif text-lg">~14g</span>
         </div>
         <div className="bg-white/40 p-4 rounded-lg border border-white/50 text-center shadow-sm">
            <span className="block text-lumina-soft text-xs uppercase font-bold">Mother's Body</span>
            <span className="block text-lumina-highlight font-serif text-lg">Blood volume +10%</span>
         </div>
      </div>
    </div>
  );
};

export default WombView;