import React from 'react';
import { Database } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="relative w-full bg-[#020504] border-t border-emerald-500/15 text-slate-400 select-none pt-20 pb-12 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Top Row: Brand & Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          
          {/* Brand Info (2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-emerald-400/60 flex items-center justify-center bg-emerald-950/40">
                <span className="font-cinzel text-emerald-400 text-sm font-bold">C</span>
              </div>
              <span className="font-cinzel tracking-[0.28em] text-xl font-bold text-white uppercase">
                CHRONOVA
              </span>
            </div>

            <p className="text-xs text-slate-400 font-light leading-relaxed max-w-sm">
              Geneva manufacture of precision-engineered automatic chronographs and bespoke mechanical complications.
            </p>

            <div className="text-[11px] font-mono text-emerald-400/80">
              CHRONOVA MANUFACTURE S.A. · RUE DU RHÔNE 42, GENÈVE
            </div>

            {/* Admin Dashboard Trigger */}
            {onOpenAdmin && (
              <div className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider transition-all shadow-emerald-glow"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Salon Admin Database</span>
                </button>
              </div>
            )}
          </div>

          {/* Column: SHOP */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white">SHOP</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#collections" className="hover:text-emerald-400 transition-colors">Men's Timepieces</a></li>
              <li><a href="#collections" className="hover:text-emerald-400 transition-colors">Women's Complications</a></li>
              <li><a href="#collections" className="hover:text-emerald-400 transition-colors">Limited Edition</a></li>
              <li><a href="#collections" className="hover:text-emerald-400 transition-colors">Accessories & Straps</a></li>
            </ul>
          </div>

          {/* Column: SUPPORT */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white">SUPPORT</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#newsletter" className="hover:text-emerald-400 transition-colors">Track Order</a></li>
              <li><a href="#story" className="hover:text-emerald-400 transition-colors">5-Year Warranty</a></li>
              <li><a href="#newsletter" className="hover:text-emerald-400 transition-colors">Returns & Service</a></li>
              <li><a href="#newsletter" className="hover:text-emerald-400 transition-colors">Contact Concierge</a></li>
            </ul>
          </div>

          {/* Column: COMPANY */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white">COMPANY</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#story" className="hover:text-emerald-400 transition-colors">Our Story</a></li>
              <li><a href="#craftsmanship" className="hover:text-emerald-400 transition-colors">Craftsmanship</a></li>
              <li><a href="#sustainability" className="hover:text-emerald-400 transition-colors">Sustainability</a></li>
              <li><a href="#gallery" className="hover:text-emerald-400 transition-colors">Journal & Media</a></li>
            </ul>
          </div>

          {/* Column: FOLLOW US */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white">FOLLOW US</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">Instagram</a></li>
              <li><a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">YouTube</a></li>
              <li><a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">X (Twitter)</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">LinkedIn</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Motto */}
        <div className="pt-8 border-t border-emerald-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 Chronova Manufacture Genève. All rights reserved.
          </div>

          <div className="font-serif italic text-emerald-300 text-sm tracking-wider">
            "TIME BEYOND ORDINARY."
          </div>

          <div className="flex gap-6 text-[11px]">
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#terms" className="hover:underline">Terms of Service</a>
            {onOpenAdmin && (
              <button onClick={onOpenAdmin} className="text-emerald-400 hover:underline">
                Admin Salon
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
