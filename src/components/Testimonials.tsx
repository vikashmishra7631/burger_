import React from 'react';
import { Star, Sparkles, CheckCircle } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/chronovaData';

export const Testimonials: React.FC = () => {
  return (
    <section className="relative w-full py-24 px-6 sm:px-10 bg-[#05070a] border-t border-white/[0.06] select-none">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-chronova-gold/[0.03] blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-chronova-gold font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GLOBAL COLLECTOR REVIEWS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
            LOVED BY WATCH ENTHUSIASTS
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-light">
            Read reflections from discerning horology collectors, engineers, and designers across the globe.
          </p>
        </div>

        {/* Three Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="p-8 rounded-3xl bg-chronova-card border border-white/[0.08] hover:border-chronova-gold/50 shadow-luxury-card hover:shadow-luxury-card-hover transition-all duration-500 flex flex-col justify-between group space-y-6"
            >
              {/* Star Rating & Verified Tag */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-chronova-gold">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-chronova-gold" />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                  <CheckCircle className="w-3 h-3 text-chronova-gold" />
                  <span>Verified Owner</span>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-sm sm:text-base text-slate-200 font-light italic leading-relaxed">
                "{t.quote}"
              </p>

              {/* User Info */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center gap-3.5">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border border-chronova-gold/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-chronova-gold transition-colors">
                    {t.name}
                  </h4>
                  <div className="text-xs text-slate-400 font-light">
                    {t.title} · {t.location}
                  </div>
                  <div className="text-[10px] text-chronova-gold/90 font-mono mt-0.5">
                    {t.watchOwned}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
