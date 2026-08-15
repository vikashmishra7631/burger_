import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await api.subscribeNewsletter(email.trim());
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="newsletter" className="relative w-full py-28 px-6 sm:px-10 bg-[#030705] border-t border-emerald-500/15 select-none overflow-hidden">
      
      {/* Background Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/[0.04] blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        
        <div className="space-y-4">
          <span className="text-[11px] font-bold tracking-[0.35em] text-emerald-400 uppercase">
            PRIVATE CLIENT PRIVILEGES
          </span>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            BE PART OF THE CHRONOVA LEGACY
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-light max-w-xl mx-auto leading-relaxed">
            Get early access to new collections, limited editions and exclusive releases. 
            Receive bespoke private salon invitations and horology dossiers.
          </p>
        </div>

        {/* Form */}
        {submitted ? (
          <div className="p-6 rounded-2xl bg-[#08150f] border border-emerald-500/40 max-w-md mx-auto space-y-2 animate-fadeIn shadow-emerald-glow">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Welcome to the Chronova Circle</h3>
            <p className="text-xs text-slate-400">
              An allocation priority number has been reserved for your email ({email}).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-white/[0.04] border border-emerald-500/20 focus:border-emerald-400 rounded-xl px-5 py-4 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-[0.2em] shadow-emerald-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'CONNECTING...' : 'SUBSCRIBE'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Strict privacy protocol. Zero spam. Unsubscribe anytime.</span>
        </div>

      </div>
    </section>
  );
};
