import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface CraftsmanshipProps {
  onDiscoverMore: () => void;
}

export const Craftsmanship: React.FC<CraftsmanshipProps> = ({ onDiscoverMore }) => {
  return (
    <section id="craftsmanship" className="relative w-full py-24 px-6 sm:px-10 bg-[#070a10] border-t border-white/[0.06] select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Cinematic Master Watchmaker Photography */}
        <div className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-white/[0.08] group shadow-luxury-card bg-black">
          <div className="relative h-[420px] sm:h-[500px] w-full overflow-hidden">
            <img
              src="/images/craftsman.jpg"
              alt="Chronova Master Watchmaker Atelier"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            {/* Overlay Tag */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-slate-300">
              <span className="font-mono text-chronova-gold">Geneva Atelier Bench No. 04</span>
              <span className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] uppercase font-bold tracking-wider">
                Hand-Chamfered Finishing
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Craftsmanship Copy */}
        <div className="lg:col-span-6 space-y-8 lg:pl-4">
          
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-chronova-gold"></span>
            <span className="text-[11px] font-bold tracking-[0.32em] text-chronova-gold uppercase">
              ARTISANAL HOROLOGY
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            CRAFTED BY HAND
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Every Chronova timepiece begins with an obsession for precision. From the smallest gear to the 
            final polish, every component is inspected, assembled and tested with extraordinary attention to detail.
          </p>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Our master watchmakers spend over 120 bench hours per timepiece, hand-beveling every steel bridge, 
            applying concentric circular Geneva stripes, and regulating the Glucydur balance wheel across 
            five distinct gravitational positions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-slate-200 font-medium">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-chronova-gold" />
              <span>Hand-chamfered mirror polish</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-chronova-gold" />
              <span>28,800 A/h frequency regulation</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-chronova-gold" />
              <span>Thermal-blued anti-magnetic screws</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-chronova-gold" />
              <span>Individually numbered master certificate</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                audioEngine.playHapticClick();
                onDiscoverMore();
              }}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-chronova-gold via-chronova-gold-light to-chronova-gold text-slate-950 font-bold text-xs uppercase tracking-[0.2em] shadow-gold-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span>DISCOVER OUR CRAFT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
