import React from 'react';
import { audioEngine } from '../utils/audioEngine';

export const Footer: React.FC = () => {
  return (
    <footer className="relative w-full bg-[#030508] border-t border-white/[0.08] text-slate-400 select-none pt-20 pb-12 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Top Row: Brand & Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          
          {/* Brand Info (2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-chronova-gold/60 flex items-center justify-center bg-chronova-gold/10">
                <span className="font-cinzel text-chronova-gold text-sm font-bold">C</span>
              </div>
              <span className="font-cinzel tracking-[0.28em] text-xl font-bold text-white uppercase">
                CHRONOVA
              </span>
            </div>

            <p className="text-xs text-slate-400 font-light leading-relaxed max-w-sm">
              Geneva manufacture of precision-engineered automatic chronographs and bespoke mechanical complications.
            </p>

            <div className="text-[11px] font-mono text-chronova-gold/80">
              CHRONOVA MANUFACTURE S.A. · RUE DU RHÔNE 42, GENÈVE
            </div>
          </div>

          {/* Column: SHOP */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white">SHOP</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#collections" onClick={() => audioEngine.playHapticClick()} className="hover:text-chronova-gold transition-colors">Men's Timepieces</a></li>
              <li><a href="#collections" onClick={() => audioEngine.playHapticClick()} className="hover:text-chronova-gold transition-colors">Women's Complications</a></li>
              <li><a href="#collections" onClick={() => audioEngine.playHapticClick()} className="hover:text-chronova-gold transition-colors">Limited Edition</a></li>
              <li><a href="#collections" onClick={() => audioEngine.playHapticClick()} className="hover:text-chronova-gold transition-colors">Accessories & Straps</a></li>
            </ul>
          </div>

          {/* Column: SUPPORT */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white">SUPPORT</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#newsletter" onClick={() => audioEngine.playHapticClick()} className="hover:text-chronova-gold transition-colors">Track Order</a></li>
              <li><a href="#story" onClick={() => audioEngine.playHapticClick()} className="hover:text-chronova-gold transition-colors">5-Year Warranty</a></li>
              <li><a href="#newsletter" onClick={() => audioEngine.playHapticClick()} className="hover:text-chronova-gold transition-colors">Returns & Service</a></li>
              <li><a href="#newsletter" onClick={() => audioEngine.playHapticClick()} className="hover:text-chronova-gold transition-colors">Contact Concierge</a></li>
            </ul>
          </div>

          {/* Column: COMPANY */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white">COMPANY</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#story" onClick={() => audioEngine.playHapticClick()} className="hover:text-chronova-gold transition-colors">Our Story</a></li>
              <li><a href="#craftsmanship" onClick={() => audioEngine.playHapticClick()} className="hover:text-chronova-gold transition-colors">Craftsmanship</a></li>
              <li><a href="#sustainability" onClick={() => audioEngine.playHapticClick()} className="hover:text-chronova-gold transition-colors">Sustainability</a></li>
              <li><a href="#gallery" onClick={() => audioEngine.playHapticClick()} className="hover:text-chronova-gold transition-colors">Journal & Media</a></li>
            </ul>
          </div>

          {/* Column: FOLLOW US */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white">FOLLOW US</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-chronova-gold transition-colors">Instagram</a></li>
              <li><a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-chronova-gold transition-colors">YouTube</a></li>
              <li><a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-chronova-gold transition-colors">X (Twitter)</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-chronova-gold transition-colors">LinkedIn</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Motto */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 Chronova. All rights reserved.
          </div>

          <div className="font-serif italic text-slate-300 text-sm tracking-wider">
            "TIME BEYOND ORDINARY."
          </div>

          <div className="flex gap-6 text-[11px]">
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#terms" className="hover:underline">Terms of Service</a>
            <a href="#cookies" className="hover:underline">Cookie Preferences</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
