import React from 'react';
import { Camera, MapPin } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/chronovaData';
import { audioEngine } from '../utils/audioEngine';

export const LifestyleGallery: React.FC = () => {
  return (
    <section id="gallery" className="relative w-full py-24 px-6 sm:px-10 bg-[#070a10] border-t border-white/[0.06] select-none">
      
      {/* Background Radial Light */}
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[400px] bg-chronova-gold/[0.03] blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/[0.06]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-chronova-gold font-semibold">
              <Camera className="w-3.5 h-3.5" />
              <span>COMMUNITY & LIFESTYLE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
              #TIMEWITHCHRONOVA
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="font-mono text-chronova-gold">@ChronovaTime</span>
            <span>Follow our global journey on Instagram</span>
          </div>
        </div>

        {/* Asymmetric Masonry-style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => audioEngine.playHapticClick()}
              className={`group relative rounded-3xl overflow-hidden bg-black border border-white/[0.08] hover:border-chronova-gold/60 transition-all duration-500 cursor-pointer shadow-luxury-card hover:shadow-luxury-card-hover ${
                idx === 0 || idx === 3 ? 'sm:col-span-2 lg:col-span-1 h-80 sm:h-96' : 'h-80'
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

              {/* Tag on Top */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-bold uppercase tracking-wider text-slate-300 font-mono">
                {item.tag}
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-5 left-5 right-5 transform group-hover:-translate-y-1 transition-transform">
                <h3 className="text-base font-bold text-white group-hover:text-chronova-gold transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-light mt-1">
                  <MapPin className="w-3.5 h-3.5 text-chronova-gold" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
