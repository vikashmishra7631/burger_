import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Maximize2,
  Check
} from 'lucide-react';
import { APEX_GT01 } from '../data/chronovaData';
import { audioEngine } from '../utils/audioEngine';

interface FeaturedProductProps {
  onAddToCart: () => void;
  onViewDetails: () => void;
}

export const FeaturedProduct: React.FC<FeaturedProductProps> = ({
  onAddToCart,
  onViewDetails,
}) => {
  const [selectedAngleIndex, setSelectedAngleIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = () => {
    audioEngine.playHapticClick();
    setAddedAnimation(true);
    onAddToCart();
    setTimeout(() => setAddedAnimation(false), 1800);
  };

  const keySpecs = [
    { label: "Movement", value: APEX_GT01.specs.movement },
    { label: "Glass", value: APEX_GT01.specs.crystal },
    { label: "Water Resistance", value: APEX_GT01.specs.waterResistance },
    { label: "Power Reserve", value: APEX_GT01.specs.powerReserve },
    { label: "Case Material", value: APEX_GT01.specs.caseMaterial },
  ];

  return (
    <section className="relative w-full py-24 px-6 sm:px-10 bg-[#050d08] border-t border-emerald-500/15 select-none overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/[0.08] blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Product Info & Key Specs */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Top Label */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.25em] bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 uppercase shadow-emerald-glow">
              {APEX_GT01.collection}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {APEX_GT01.editionCount}
            </span>
          </div>

          {/* Title & Price */}
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
              {APEX_GT01.name}
            </h2>
            <div className="flex items-baseline gap-4">
              <span className="text-3xl sm:text-4xl font-serif font-bold emerald-gradient-text">
                {APEX_GT01.priceFormatted}
              </span>
              <span className="text-xs text-slate-400 uppercase tracking-widest">
                Complimentary Worldwide Express Insured Shipping
              </span>
            </div>
          </div>

          {/* Editorial Description */}
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            {APEX_GT01.description}
          </p>

          {/* Key Specifications Grid */}
          <div className="space-y-2.5 pt-2">
            <div className="text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-semibold mb-3">
              Master Horology Specifications
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {keySpecs.map((spec, i) => (
                <div 
                  key={i} 
                  className="p-3.5 rounded-xl bg-[#08150f] border border-emerald-500/15 flex flex-col justify-between"
                >
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">{spec.label}</span>
                  <span className="font-semibold text-slate-100 mt-1">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons: ADD TO CART & VIEW DETAILS */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={handleAdd}
              className={`px-8 py-4 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2.5 shadow-emerald-glow ${
                addedAnimation
                  ? 'bg-emerald-400 text-slate-950 scale-105'
                  : 'bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 text-slate-950 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>ADDED TO BAG</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART · $1,299</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                audioEngine.playHapticClick();
                onViewDetails();
              }}
              className="px-7 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-emerald-500/30 hover:border-emerald-400 text-slate-200 hover:text-white font-medium text-xs sm:text-sm uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2"
            >
              <span>VIEW DETAILS</span>
            </button>
          </div>

          {/* Warranty tag */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Includes 5-Year Global Warranty & Serialized Certificate of Origin</span>
          </div>

        </div>

        {/* Right Column: Huge Cinematic Watch Render & Angle Switcher */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-6">
          
          {/* Main Huge Render Container */}
          <div 
            onClick={() => {
              audioEngine.playHapticClick();
              onViewDetails();
            }}
            className="relative w-full max-w-[500px] aspect-square rounded-3xl overflow-hidden bg-[#07130e]/80 border border-emerald-500/25 hover:border-emerald-400 p-6 flex items-center justify-center cursor-pointer group shadow-2xl transition-all"
          >
            <img
              src={APEX_GT01.alternateImages[selectedAngleIndex]}
              alt="Chronova Apex GT-01 Angle View"
              className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)] drop-shadow-[0_0_35px_rgba(16,185,129,0.2)] group-hover:scale-105 transition-transform duration-500 ease-out"
            />

            {/* Inspect Overlay Prompt */}
            <div className="absolute top-4 right-4 p-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-slate-300 group-hover:text-emerald-400 transition-colors">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>

          {/* Angle Thumbnails Row */}
          <div className="flex items-center gap-3">
            {APEX_GT01.alternateImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  audioEngine.playHapticClick();
                  setSelectedAngleIndex(idx);
                }}
                className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all p-1 bg-black ${
                  selectedAngleIndex === idx
                    ? 'border-emerald-400 shadow-emerald-glow scale-105'
                    : 'border-white/10 opacity-60 hover:opacity-100 hover:border-emerald-500/40'
                }`}
              >
                <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
