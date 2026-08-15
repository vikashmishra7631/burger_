import React, { useState, useEffect } from 'react';
import { 
  Search, 
  User, 
  ShoppingBag, 
  Menu, 
  X, 
  ArrowRight,
  ShieldCheck,
  Palette
} from 'lucide-react';
import type { UserProfile } from './AccountModal';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  currentTheme: string;
  onSelectTheme: (theme: string) => void;
  currentUser: UserProfile | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenAccount,
  currentTheme,
  onSelectTheme,
  currentUser,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Curated 4 core navigation links for an uncluttered, spacious luxury header
  const primaryLinks = [
    { label: "Collections", href: "#collections" },
    { label: "Technology", href: "#technology" },
    { label: "Craftsmanship", href: "#craftsmanship" },
    { label: "Our Story", href: "#story" },
  ];

  const allLinks = [
    { label: "Home", href: "#hero" },
    { label: "Collections", href: "#collections" },
    { label: "Technology", href: "#technology" },
    { label: "Craftsmanship", href: "#craftsmanship" },
    { label: "Our Story", href: "#story" },
    { label: "Sustainability", href: "#sustainability" },
    { label: "Journal & Media", href: "#gallery" },
    { label: "Private Client Salon", href: "#newsletter" },
  ];

  const themeOptions = [
    { id: "emerald", name: "Smoked Racing Emerald & Gold", dot: "bg-emerald-400" },
    { id: "sapphire", name: "Midnight Sapphire & Platinum", dot: "bg-cyan-400" },
    { id: "obsidian", name: "Obsidian & Champagne Gold", dot: "bg-amber-400" },
    { id: "carbon", name: "Stealth Carbon & Silver", dot: "bg-slate-300" },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled 
            ? 'bg-[#030705]/90 backdrop-blur-2xl border-b border-emerald-500/15 py-4 shadow-2xl' 
            : 'bg-gradient-to-b from-[#030705]/80 via-[#030705]/30 to-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
          
          {/* Left: Brand Identity */}
          <a 
            href="#hero" 
            className="flex items-center gap-3.5 group select-none shrink-0"
          >
            {/* Minimal Luxury "C" Emblem */}
            <div className="relative w-8 h-8 rounded-full border border-emerald-400/60 flex items-center justify-center bg-gradient-to-br from-emerald-950 via-[#030705] to-[#030705] group-hover:border-chronova-gold transition-colors shadow-emerald-glow">
              <span className="font-cinzel font-bold text-chronova-gold text-sm tracking-tighter">C</span>
            </div>

            <div className="flex flex-col">
              <span className="font-cinzel tracking-[0.28em] text-lg font-bold text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                CHRONOVA
              </span>
              <span className="text-[8px] tracking-[0.32em] text-emerald-400/90 font-medium uppercase -mt-0.5">
                GENÈVE
              </span>
            </div>
          </a>

          {/* Center: Curated 4 Essential Links with Generous Breathing Room */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-11 text-[11px] uppercase tracking-[0.25em] font-medium text-slate-300">
            {primaryLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative py-1 hover:text-emerald-400 transition-colors duration-300 group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-px bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Right: Minimal, Balanced Action Controls */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            
            {/* Palette Switcher */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="p-2.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-400/40 text-slate-300 hover:text-emerald-400 transition-all"
                title="Select Luxury Theme"
              >
                <Palette className="w-4 h-4 text-emerald-400" />
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 rounded-2xl bg-[#06120c] border border-emerald-500/30 shadow-2xl py-2 z-50 backdrop-blur-2xl animate-fadeIn">
                  <div className="px-4 py-2 text-[9px] uppercase tracking-widest text-slate-400 font-bold border-b border-white/10">
                    Luxury Color Palettes
                  </div>
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        onSelectTheme(opt.id);
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center justify-between ${
                        currentTheme === opt.id
                          ? 'bg-emerald-950/60 text-emerald-300 font-bold'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full ${opt.dot}`}></span>
                        <span>{opt.name}</span>
                      </div>
                      {currentTheme === opt.id && <span className="text-[10px] text-emerald-400 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-400/40 text-slate-300 hover:text-emerald-400 transition-all"
              title="Search Timepieces & Calibres"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* VIP Account / User */}
            <button
              onClick={onOpenAccount}
              className={`relative p-2.5 rounded-full border transition-all ${
                currentUser 
                  ? 'bg-emerald-950/70 border-emerald-400/60 text-emerald-300 shadow-emerald-glow' 
                  : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 hover:border-emerald-400/40 text-slate-300 hover:text-emerald-400'
              }`}
              title={currentUser ? `VIP Patron: ${currentUser.name}` : "VIP Client Sign In"}
            >
              <User className="w-4 h-4" />
              {currentUser && (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#030705] animate-pulse"></span>
              )}
            </button>

            {/* Shopping Bag */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-gradient-to-tr from-emerald-950/50 to-white/[0.04] hover:from-emerald-900/70 border border-emerald-500/40 hover:border-emerald-400 text-white transition-all shadow-emerald-glow"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full bg-white/[0.03] border border-white/10 text-slate-300 hover:text-white ml-1"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-8 animate-fadeIn">
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full border border-emerald-400/60 flex items-center justify-center bg-emerald-950/30">
                <span className="font-cinzel text-emerald-400 text-xs font-bold">C</span>
              </div>
              <span className="font-cinzel tracking-widest text-base font-bold text-white">CHRONOVA</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-4 my-auto text-sm uppercase tracking-[0.25em] font-medium text-slate-200">
            {allLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-emerald-400 transition-colors flex items-center justify-between border-b border-white/[0.04]"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-emerald-400/60" />
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-3 text-xs text-slate-400">
            {currentUser ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-400/30 text-emerald-300 font-mono text-xs">
                <span>Patron: {currentUser.name}</span>
                <span className="text-[10px] text-emerald-400 uppercase font-bold">{currentUser.tier}</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAccount();
                }}
                className="py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 text-center font-bold text-xs uppercase tracking-wider"
              >
                VIP Client Sign In
              </button>
            )}
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Geneva Master Horology Certification</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
