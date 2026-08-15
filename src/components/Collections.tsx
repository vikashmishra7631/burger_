import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { COLLECTIONS_DATA } from '../data/chronovaData';
import type { CollectionItem } from '../data/chronovaData';
import { audioEngine } from '../utils/audioEngine';

interface CollectionsProps {
  onSelectCollection: (col: CollectionItem) => void;
}

export const Collections: React.FC<CollectionsProps> = ({ onSelectCollection }) => {
  return (
    <section id="collections" className="relative w-full py-24 px-6 sm:px-10 bg-[#030705] select-none">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/[0.04] blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="flex items-center justify-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-emerald-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MANUFACTURE GENÈVE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
            ICONIC COLLECTIONS
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-light tracking-wide">
            Find the timepiece that defines you.
          </p>
          
          <div className="w-12 h-px bg-emerald-500/40 mx-auto mt-4"></div>
        </div>

        {/* Four Large Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLLECTIONS_DATA.map((col) => (
            <div
              key={col.id}
              onClick={() => {
                audioEngine.playHapticClick();
                onSelectCollection(col);
              }}
              className="group relative rounded-2xl overflow-hidden bg-[#07130d] border border-emerald-500/20 hover:border-emerald-400/80 transition-all duration-500 cursor-pointer shadow-luxury-card hover:shadow-luxury-card-hover flex flex-col justify-between min-h-[460px]"
            >
              {/* Image Container with Zoom Effect */}
              <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-black">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07130d] via-black/30 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-emerald-500/20 text-[9px] font-bold uppercase tracking-widest text-emerald-300 font-mono">
                  {col.count}
                </div>

                {/* Top Right Action Arrow */}
                <div className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-slate-300 group-hover:bg-emerald-400 group-hover:text-slate-950 transition-all duration-300 group-hover:rotate-45 shadow-emerald-glow">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom Card Content with Rising Animation */}
              <div className="p-6 pt-2 flex flex-col justify-between flex-1 relative z-10">
                <div className="transform group-hover:-translate-y-1 transition-transform duration-300">
                  <h3 className="text-xl font-serif font-bold text-white group-hover:text-emerald-300 transition-colors tracking-wide">
                    {col.name}
                  </h3>
                  
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mt-1">
                    {col.subtitle}
                  </div>
                  
                  <p className="text-xs text-slate-300 font-light mt-2 line-clamp-2 leading-relaxed">
                    {col.description}
                  </p>
                </div>

                {/* Animated Emerald/Gold Line Reveal on Hover */}
                <div className="mt-4 pt-3 border-t border-emerald-500/15 relative">
                  <div className="absolute top-0 left-0 h-px bg-gradient-to-r from-emerald-400 via-chronova-gold to-transparent w-0 group-hover:w-full transition-all duration-500"></div>
                  
                  <div className="flex items-center justify-between text-[11px] text-slate-300 group-hover:text-white font-medium uppercase tracking-wider">
                    <span>Explore Series</span>
                    <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
