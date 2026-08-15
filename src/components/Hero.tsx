import React, { useState, useRef } from 'react';
import { ChevronRight, ShieldCheck, Compass, Eye } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface HeroProps {
  onExploreCollections: () => void;
  onDiscoverCraft: () => void;
  onQuickView: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCollections,
  onDiscoverCraft,
  onQuickView,
}) => {
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x: x * 12, y: -y * 12 });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <section 
      id="hero" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-16 px-6 sm:px-12 select-none overflow-hidden bg-[#030705]"
    >
      {/* Cinematic Ambient Lighting & Particles in Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-emerald-500/[0.12] blur-[160px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[550px] h-[550px] rounded-full bg-chronova-gold/[0.08] blur-[140px]" />
        <div className="absolute top-[40%] left-[10%] w-[450px] h-[450px] rounded-full bg-emerald-700/[0.08] blur-[130px]" />
        
        {/* Subtle Horological Orbit Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-emerald-500/[0.04] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full border border-chronova-gold/[0.04] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center relative z-10">
        
        {/* Left Column: Hero Editorial Typography & CTAs */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-8">
          
          {/* Eyebrow Pill */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-gradient-to-r from-emerald-400 to-transparent"></span>
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.35em] text-emerald-400 uppercase font-sans">
              HAUTE HORLOGERIE 2026
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 shadow-emerald-glow">
              RACING EMERALD & GOLD
            </span>
          </div>

          {/* Hero Headline */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight leading-[1.04] text-white">
              <span className="block font-normal">TIME BEYOND</span>
              <span className="block italic emerald-gradient-text drop-shadow-[0_0_35px_rgba(16,185,129,0.3)]">
                ORDINARY.
              </span>
            </h1>
          </div>

          {/* Subheading Text */}
          <p className="text-sm sm:text-base md:text-lg text-slate-300 font-light leading-relaxed max-w-lg">
            Precision engineered for those who value every second. Blending ancestral Swiss watchmaking 
            with smoked forest racing aesthetics and aerospace materials.
          </p>

          {/* Micro Specs List */}
          <div className="grid grid-cols-3 gap-3 py-1 max-w-md">
            <div className="p-3 rounded-xl bg-[#08150f]/80 border border-emerald-500/20 backdrop-blur-md">
              <div className="text-[9px] uppercase tracking-widest text-slate-400">Calibre</div>
              <div className="text-xs sm:text-sm font-semibold text-white mt-0.5">CN-8800 Auto</div>
            </div>
            <div className="p-3 rounded-xl bg-[#08150f]/80 border border-emerald-500/20 backdrop-blur-md">
              <div className="text-[9px] uppercase tracking-widest text-slate-400">Reserve</div>
              <div className="text-xs sm:text-sm font-semibold text-chronova-gold mt-0.5">72 Hours</div>
            </div>
            <div className="p-3 rounded-xl bg-[#08150f]/80 border border-emerald-500/20 backdrop-blur-md">
              <div className="text-[9px] uppercase tracking-widest text-slate-400">Case</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5">316L Steel</div>
            </div>
          </div>

          {/* Action Buttons: EXPLORE COLLECTION & DISCOVER THE CRAFT */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => {
                audioEngine.playHapticClick();
                onExploreCollections();
              }}
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-[0.2em] shadow-emerald-glow hover:shadow-[0_0_50px_rgba(16,185,129,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2"
            >
              <span>EXPLORE COLLECTION</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => {
                audioEngine.playHapticClick();
                onDiscoverCraft();
              }}
              className="px-7 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-emerald-400/30 hover:border-emerald-400 text-slate-200 hover:text-white font-medium text-xs sm:text-sm uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2"
            >
              <span>DISCOVER THE CRAFT</span>
            </button>
          </div>

          {/* Swiss Guarantee Tag */}
          <div className="flex items-center gap-6 pt-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>5-Year Chronova International Warranty</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-chronova-gold" />
              <span>Manufactured in Geneva</span>
            </div>
          </div>

        </div>

        {/* Right Column: Large Futuristic Luxury Chronograph Watch Visual */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative mt-6 lg:mt-0">
          
          {/* Watch Visual Container with Parallax Tilt */}
          <div 
            className="relative w-full max-w-[540px] aspect-square flex items-center justify-center group cursor-pointer"
            onClick={() => {
              audioEngine.playHapticClick();
              onQuickView();
            }}
          >
            {/* Dynamic Emerald Halo Glow */}
            <div 
              className="absolute inset-8 rounded-full bg-gradient-to-tr from-emerald-500/20 via-chronova-gold/10 to-transparent blur-3xl transition-opacity duration-700 pointer-events-none"
              style={{
                transform: `scale(${isHovered ? 1.15 : 1})`,
                opacity: isHovered ? 0.95 : 0.65
              }}
            />

            {/* Watch Render with Parallax Depth */}
            <div
              className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
              style={{
                transform: `rotateY(${mouseTilt.x}deg) rotateX(${mouseTilt.y}deg) scale(${isHovered ? 1.03 : 1})`,
                transformStyle: 'preserve-3d'
              }}
            >
              <img
                src="/images/hero_watch.jpg"
                alt="Chronova Apex GT-01 Futuristic Luxury Chronograph"
                className="w-full h-full object-contain filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)] drop-shadow-[0_0_40px_rgba(16,185,129,0.25)] rounded-3xl select-none pointer-events-none"
                draggable={false}
              />

              {/* Floating Quick View Hotspot Button */}
              <div className="absolute bottom-6 right-6 z-20">
                <div className="px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-emerald-glow group-hover:scale-105 transition-transform">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Apex GT-01</span>
                </div>
              </div>
            </div>

          </div>

          {/* Model Tagline Line */}
          <div className="mt-2 text-center text-xs text-slate-400 tracking-[0.25em] font-mono uppercase">
            CHRONOVA APEX GT-01 · AUTOMATIC CHRONOGRAPH 42MM
          </div>
        </div>

      </div>

      {/* Vertical Scroll Indicator on Right Side */}
      <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-3 select-none pointer-events-none">
        <span className="text-[9px] uppercase tracking-[0.3em] text-slate-500 [writing-mode:vertical-lr] rotate-180 font-mono">
          SCROLL TO EXPLORE
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-emerald-400/60 via-slate-600 to-transparent"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"></div>
      </div>

    </section>
  );
};
