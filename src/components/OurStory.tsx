import React, { useState } from 'react';
import { ArrowRight, X, Award } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export const OurStory: React.FC = () => {
  const [storyModalOpen, setStoryModalOpen] = useState(false);

  return (
    <>
      <section id="story" className="relative w-full py-28 px-6 sm:px-10 bg-[#05070a] border-t border-white/[0.06] select-none">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[500px] bg-chronova-gold/[0.03] blur-[170px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Main Editorial Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-chronova-gold"></span>
                <span className="text-[11px] font-bold tracking-[0.35em] text-chronova-gold uppercase">
                  OUR PHILOSOPHY
                </span>
              </div>

              <h2 className="text-4xl sm:text-6xl font-serif font-bold text-white tracking-tight leading-[1.08]">
                BUILT FOR <br />
                <span className="italic gold-gradient-text">GENERATIONS.</span>
              </h2>

              <p className="text-base sm:text-lg text-slate-200 font-light leading-relaxed">
                Founded with a singular vision in Geneva: to strip away the unnecessary, 
                elevate mechanical purity, and create timepieces that exist beyond transient trends.
              </p>

              <p className="text-sm sm:text-base text-slate-400 font-light leading-relaxed">
                A Chronova is not merely an instrument of precision; it is an heirloom forged in 
                surgical-grade steel and sapphire, designed to be passed down from father to daughter, 
                from generation to generation.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => {
                    audioEngine.playHapticClick();
                    setStoryModalOpen(true);
                  }}
                  className="px-8 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/15 hover:border-chronova-gold/50 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] transition-all flex items-center gap-2"
                >
                  <span>READ OUR STORY</span>
                  <ArrowRight className="w-4 h-4 text-chronova-gold" />
                </button>
              </div>
            </div>

            {/* Right Column: Editorial Image Collage */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-white/[0.08] shadow-luxury-card bg-black h-56">
                  <img
                    src="/images/classic_watch.jpg"
                    alt="Chronova Classic Dress Watch"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-5 rounded-2xl bg-chronova-card border border-white/[0.06] space-y-1">
                  <div className="text-[10px] text-chronova-gold font-mono uppercase">Principle 01</div>
                  <div className="text-sm font-bold text-white">Mechanical Autonomy</div>
                  <div className="text-xs text-slate-400 font-light">Zero reliance on electronics or planned obsolescence.</div>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="p-5 rounded-2xl bg-chronova-card border border-white/[0.06] space-y-1">
                  <div className="text-[10px] text-chronova-gold font-mono uppercase">Principle 02</div>
                  <div className="text-sm font-bold text-white">Material Immortality</div>
                  <div className="text-xs text-slate-400 font-light">316L cold-forged stainless steel and diamond-tough sapphire.</div>
                </div>
                <div className="rounded-2xl overflow-hidden border border-white/[0.08] shadow-luxury-card bg-black h-56">
                  <img
                    src="/images/mechanical_watch.jpg"
                    alt="Chronova In-House Skeleton"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Story Dossier Modal */}
      {storyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#070b12] border border-chronova-gold/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-chronova-gold" />
                <span className="font-cinzel text-base font-bold text-white tracking-widest uppercase">
                  CHRONOVA · GENEVA ARCHIVES
                </span>
              </div>
              <button
                onClick={() => setStoryModalOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 text-sm text-slate-300 font-light leading-relaxed">
              <h3 className="text-2xl font-serif font-bold text-white">
                The Origin of Chronova: Engineering the Uncompromising
              </h3>
              <p>
                Founded in Geneva by a collective of master horologists and aerospace engineers, Chronova was born 
                out of resistance to mass-produced disposable consumer technology.
              </p>
              <p>
                We asked a simple question: What if a mechanical watch combined the uncompromising precision of Swiss 
                calibre regulation with the high-strength alloys of modern aerospace design?
              </p>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-chronova-gold/20 space-y-2">
                <div className="text-xs font-bold text-chronova-gold uppercase tracking-wider">
                  The Chronova Manifesto
                </div>
                <p className="text-xs text-slate-300 italic">
                  "We do not build watches for the next season. We build mechanical timepieces that will outlive 
                  our smartphones, our supercomputers, and ourselves. Time is the only true luxury."
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <div className="font-bold text-white">Geneva</div>
                  <div className="text-[10px] text-slate-400">Manufacture HQ</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <div className="font-bold text-chronova-gold">100%</div>
                  <div className="text-[10px] text-slate-400">Mechanical Autonomy</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <div className="font-bold text-white">5-Year</div>
                  <div className="text-[10px] text-slate-400">Global Guarantee</div>
                </div>
              </div>
            </div>

            <div className="px-8 py-4 border-t border-white/10 bg-black/40 flex justify-end">
              <button
                onClick={() => setStoryModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-chronova-gold text-slate-950 font-bold text-xs uppercase tracking-widest"
              >
                Close Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
