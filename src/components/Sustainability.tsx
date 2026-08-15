import React from 'react';
import { Leaf, ShieldCheck, RefreshCw, Package } from 'lucide-react';

export const Sustainability: React.FC = () => {
  const pillars = [
    {
      icon: <Leaf className="w-4 h-4 text-emerald-400" />,
      title: "Responsibly Sourced Materials",
      description: "100% ethically certified recycled 316L stainless steel and non-conflict synthetic sapphire crystals."
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      title: "Built to Last Generations",
      description: "Zero planned obsolescence. Designed to function for decades with routine 5-year maintenance."
    },
    {
      icon: <RefreshCw className="w-4 h-4 text-emerald-400" />,
      title: "100% Modular & Repairable",
      description: "Every screw, spring, and gear can be individually restored or replaced without discarding the calibre."
    },
    {
      icon: <Package className="w-4 h-4 text-emerald-400" />,
      title: "Sustainable FSC® Packaging",
      description: "Presentation chests crafted from sustainably harvested walnut timber and organic recycled linen."
    },
  ];

  return (
    <section id="sustainability" className="relative w-full py-24 px-6 sm:px-10 bg-[#070b12] border-t border-white/[0.06] select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Nature & Watch Image */}
        <div className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-white/[0.08] shadow-luxury-card bg-black group">
          <div className="relative h-[420px] sm:h-[500px] w-full overflow-hidden">
            <img
              src="/images/sustainability.jpg"
              alt="Chronova Sustainable Horology in Nature"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-slate-300">
              <span className="font-mono text-emerald-400">Pure Mechanical Energy</span>
              <span className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] uppercase font-bold tracking-wider">
                Zero Electronic Waste
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Sustainable Luxury Copy & Pillars */}
        <div className="lg:col-span-6 space-y-8 lg:pl-4">
          
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-emerald-400"></span>
            <span className="text-[11px] font-bold tracking-[0.32em] text-emerald-400 uppercase">
              ECO-HOROLOGY
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            SUSTAINABLE BY DESIGN
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            True luxury does not exploit the future. By championing self-winding mechanical movements powered 
            solely by the natural motion of your wrist, a Chronova timepiece generates zero battery disposal 
            and zero electronic landfill waste.
          </p>

          {/* 4 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {pillars.map((p, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    {p.icon}
                  </div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">{p.title}</h3>
                </div>
                <p className="text-xs text-slate-400 font-light leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
