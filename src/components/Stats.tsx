import React from 'react';
import { BRAND_STATS } from '../data/chronovaData';

export const Stats: React.FC = () => {
  return (
    <section className="relative w-full py-14 px-6 sm:px-10 border-y border-emerald-500/15 bg-[#050e09] select-none">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-emerald-500/15">
          {BRAND_STATS.map((stat, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col items-center text-center px-4 ${idx > 0 ? 'pt-4 sm:pt-0' : ''}`}
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight emerald-gradient-text drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-slate-200 mt-1">
                {stat.label}
              </div>
              <div className="text-[11px] text-emerald-400/80 font-light mt-0.5">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
