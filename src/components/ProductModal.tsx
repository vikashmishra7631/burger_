import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  RotateCw, 
  ShieldCheck, 
  Truck, 
  Check
} from 'lucide-react';
import { APEX_GT01 } from '../data/chronovaData';
import type { WatchModel } from '../data/chronovaData';
import { audioEngine } from '../utils/audioEngine';

interface ProductModalProps {
  watch: WatchModel | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (watch: WatchModel) => void;
  onBuyNow: (watch: WatchModel) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  watch,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  const currentWatch = watch || APEX_GT01;
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'movement' | 'shipping'>('overview');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!isOpen) return null;

  const handleAdd = () => {
    audioEngine.playHapticClick();
    setAddedAnimation(true);
    onAddToCart(currentWatch);
    setTimeout(() => setAddedAnimation(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#070c14] border border-chronova-gold/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-white/10 bg-black/50">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-chronova-gold/15 border border-chronova-gold/40 text-[9px] font-bold text-chronova-gold uppercase tracking-widest">
              {currentWatch.collection}
            </span>
            <span className="text-xs text-slate-300 font-mono hidden sm:inline">
              Ref. CH-GT01 · Geneva Manufacture
            </span>
          </div>

          <button
            onClick={() => {
              audioEngine.playHapticClick();
              onClose();
            }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Interactive Watch Media & Gallery */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Stage View */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black/60 border border-white/[0.08] p-6 flex items-center justify-center">
              <img
                src={currentWatch.alternateImages[selectedImgIndex] || currentWatch.image}
                alt={currentWatch.name}
                className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
              />

              {/* 360 Indicator */}
              <button
                onClick={() => {
                  audioEngine.playHapticClick();
                  setSelectedImgIndex((prev) => (prev + 1) % currentWatch.alternateImages.length);
                }}
                className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-chronova-gold/40 text-[10px] font-bold uppercase tracking-wider text-chronova-gold flex items-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Rotate 360° Angle</span>
              </button>
            </div>

            {/* Thumbnail Selection */}
            <div className="flex items-center gap-3 justify-center">
              {currentWatch.alternateImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    audioEngine.playHapticClick();
                    setSelectedImgIndex(idx);
                  }}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 p-1 bg-black transition-all ${
                    selectedImgIndex === idx
                      ? 'border-chronova-gold shadow-gold-glow scale-105'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`View ${idx}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

          </div>

          {/* Right Column: Title, Tabs, Specs, Purchase Actions */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                  {currentWatch.name}
                </h2>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-2xl sm:text-3xl font-serif font-bold gold-gradient-text">
                    {currentWatch.priceFormatted}
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">In Stock · Ready to Dispatch</span>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex border-b border-white/10 text-xs font-bold uppercase tracking-wider">
                {(['overview', 'specs', 'movement', 'shipping'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      audioEngine.playHapticClick();
                      setActiveTab(tab);
                    }}
                    className={`py-2.5 px-3 border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-chronova-gold text-chronova-gold'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                {activeTab === 'overview' && (
                  <div className="space-y-3">
                    <p>{currentWatch.description}</p>
                    <ul className="space-y-1.5 pt-2">
                      {currentWatch.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                          <Check className="w-3.5 h-3.5 text-chronova-gold shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-[10px] text-slate-400 block">Case Diameter</span>
                      <span className="font-semibold text-white">{currentWatch.specs.caseDiameter}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-[10px] text-slate-400 block">Thickness</span>
                      <span className="font-semibold text-white">{currentWatch.specs.caseThickness}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-[10px] text-slate-400 block">Lug Width</span>
                      <span className="font-semibold text-white">{currentWatch.specs.lugWidth}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-[10px] text-slate-400 block">Water Resistance</span>
                      <span className="font-semibold text-white">{currentWatch.specs.waterResistance}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'movement' && (
                  <div className="space-y-2 text-xs">
                    <p className="font-semibold text-white">{currentWatch.specs.movement}</p>
                    <p>Features 34 synthetic ruby bearings, 28,800 vibrations per hour (4Hz), and 72-hour power reserve with bidirectional automatic winding.</p>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <Truck className="w-4 h-4 text-chronova-gold" />
                      <span>Complimentary Global Express Delivery</span>
                    </div>
                    <p>All shipments are fully insured via specialized armored courier. Signature required upon receipt.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons: ADD TO CART & BUY NOW */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAdd}
                  className={`py-3.5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                    addedAnimation
                      ? 'bg-emerald-500 text-black'
                      : 'bg-gradient-to-r from-chronova-gold via-chronova-gold-light to-chronova-gold text-slate-950 shadow-gold-glow'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedAnimation ? 'ADDED TO BAG' : 'ADD TO CART'}</span>
                </button>

                <button
                  onClick={() => {
                    audioEngine.playHapticClick();
                    onBuyNow(currentWatch);
                  }}
                  className="py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 text-white font-bold text-xs uppercase tracking-[0.2em] transition-all"
                >
                  <span>BUY NOW</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-chronova-gold" />
                  5-Year Manufacturer Warranty
                </span>
                <span>30-Day Luxury Returns</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
