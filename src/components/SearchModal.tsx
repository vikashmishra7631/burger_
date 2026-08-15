import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const catalog = [
    { title: "CHRONOVA APEX GT-01", tag: "Calibre CN-8800 · Limited 500 Pcs", cat: "Limited Edition" },
    { title: "Chronova Classic Champagne Sunburst", tag: "Ultra-Thin Dress Watch · Dauphine Hands", cat: "Classic" },
    { title: "Chronova Sport Forged Carbon 44mm", tag: "Ceramic Tachymeter · Rubber Strap", cat: "Sport" },
    { title: "Chronova Mechanical Skeleton Calibre", tag: "In-House Openwork Calibre · Geneva Stripes", cat: "Mechanical" },
    { title: "Geneva Atelier Private Appointment", tag: "VIP Salon Viewing & Bespoke Consultation", cat: "Concierge" },
  ];

  const filtered = catalog.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.tag.toLowerCase().includes(query.toLowerCase()) ||
    item.cat.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#070c14] border border-chronova-gold/30 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-black/50">
          <Search className="w-5 h-5 text-chronova-gold" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Collections, Calibres, Materials (e.g. Apex, Sapphire, Carbon)..."
            className="w-full bg-transparent border-none text-white placeholder-slate-400 text-sm focus:outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white text-xs">
              Clear
            </button>
          )}
          <button
            onClick={() => {
              audioEngine.playHapticClick();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="p-6 max-h-96 overflow-y-auto space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            {query ? 'Search Results' : 'Featured Timepieces & Complications'}
          </div>

          {filtered.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                audioEngine.playHapticClick();
                onSelectResult();
                onClose();
              }}
              className="w-full text-left p-3.5 rounded-2xl bg-white/[0.02] hover:bg-chronova-gold/10 border border-white/[0.06] hover:border-chronova-gold/40 flex items-center justify-between group transition-all"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white group-hover:text-chronova-gold transition-colors">
                    {item.title}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-chronova-gold/15 text-chronova-gold font-medium">
                    {item.cat}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5 font-mono">
                  {item.tag}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-chronova-gold group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/40 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Geneva Manufacture Horology Search</span>
          <span className="text-chronova-gold">Press ESC to close</span>
        </div>

      </div>
    </div>
  );
};
