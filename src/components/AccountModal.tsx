import React, { useState } from 'react';
import { X, ShieldCheck, Send, User, Lock, Mail, LogOut } from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  memberId: string;
  tier: string;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (email: string, name: string) => void;
  onLogout: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'vault' | 'concierge'>('vault');
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  
  const [messages, setMessages] = useState<{ sender: 'concierge' | 'user'; text: string; time: string }[]>([
    {
      sender: 'concierge',
      text: 'Good evening. Your Chronova allocation is secured with 5-year manufacture warranty. How may the Geneva salon assist you today?',
      time: '18:24'
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    const resolvedName = nameInput.trim() || (emailInput.split('@')[0]);
    onLogin(emailInput, resolvedName);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const text = inputVal.trim();
    setInputVal('');

    setMessages(prev => [...prev, { sender: 'user', text, time: 'Now' }]);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: 'concierge',
        text: 'Thank you for reaching out. A Senior Horology Advisor has received your message and will follow up immediately.',
        time: 'Just now'
      }]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#07110c] border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/10 bg-black/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-emerald-400/60 bg-emerald-950/40 flex items-center justify-center shadow-emerald-glow">
              <span className="font-cinzel text-emerald-400 text-sm font-bold">C</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">VIP Collector Vault</span>
                {currentUser && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-[9px] font-bold text-emerald-300">
                    {currentUser.tier}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {currentUser ? `Member ID: ${currentUser.memberId}` : 'Geneva Client Authentication'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-red-500/20 text-xs text-slate-400 hover:text-red-300 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Logged In -> Login / Register Form */}
        {!currentUser ? (
          <div className="p-8 sm:p-12 overflow-y-auto flex-1 flex flex-col justify-center max-w-lg mx-auto w-full space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 flex items-center justify-center mx-auto shadow-emerald-glow">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white">
                {authMode === 'signin' ? 'Sign In to Your Vault' : 'Create VIP Patron Account'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Access your serialized timepiece registry, active 5-year manufacture warranties, and private concierge salon.
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="e.g. Lord Alexander Wright"
                      className="w-full bg-[#040906] border border-emerald-500/25 focus:border-emerald-400 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="patron@chronova.ch"
                    className="w-full bg-[#040906] border border-emerald-500/25 focus:border-emerald-400 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-300">
                  Security Passcode
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#040906] border border-emerald-500/25 focus:border-emerald-400 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-[0.2em] shadow-emerald-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>{authMode === 'signin' ? 'ENTER COLLECTOR VAULT' : 'CREATE PATRON ACCOUNT'}</span>
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'signin' ? 'register' : 'signin')}
                className="text-xs text-emerald-400 hover:underline"
              >
                {authMode === 'signin' 
                  ? "Don't have an account? Register as a VIP Patron" 
                  : "Already a registered collector? Sign in here"}
              </button>
            </div>
          </div>
        ) : (
          /* Logged In View */
          <>
            {/* Tab Selection */}
            <div className="flex border-b border-white/10 px-6 sm:px-8 bg-[#050e09] text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setActiveTab('vault')}
                className={`py-3 px-4 border-b-2 transition-colors ${
                  activeTab === 'vault'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                My Timepiece Vault
              </button>
              <button
                onClick={() => setActiveTab('concierge')}
                className={`py-3 px-4 border-b-2 transition-colors ${
                  activeTab === 'concierge'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Private Concierge
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1">
              {activeTab === 'vault' ? (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-400/30 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400">Welcome back,</div>
                      <div className="text-base font-bold text-white">{currentUser.name}</div>
                      <div className="text-xs text-emerald-400 font-mono">{currentUser.email}</div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-wider border border-emerald-400/40">
                      Active Patron
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#08150f] border border-emerald-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-black p-1 border border-white/10 shrink-0">
                        <img src="/images/hero_watch.jpg" alt="Apex GT-01" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Chronova Apex GT-01</h4>
                        <div className="text-xs text-emerald-400 font-mono">Serial: CN-8800-084 / 500</div>
                        <div className="text-[11px] text-emerald-400 mt-1">Warranty: Active until October 2031</div>
                      </div>
                    </div>
                    <div className="hidden sm:block text-right text-xs">
                      <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-400/40 text-emerald-300 font-bold">
                        Chronometer Certified
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-[10px] text-slate-400 block uppercase">Next Recommended Service</span>
                      <span className="font-semibold text-white mt-1 block">October 2031</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-[10px] text-slate-400 block uppercase">Bespoke Engraving</span>
                      <span className="font-semibold text-emerald-400 mt-1 block">Custom Monogram Verified</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-[10px] text-slate-400 block uppercase">Certificate of Origin</span>
                      <span className="font-semibold text-white mt-1 block">Blockchain Registered ✓</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-72 justify-between">
                  <div className="space-y-3 overflow-y-auto pr-2">
                    {messages.map((m, i) => (
                      <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3 rounded-2xl text-xs sm:text-sm max-w-md ${
                          m.sender === 'user' ? 'bg-emerald-400 text-slate-950 font-medium' : 'bg-white/[0.04] border border-white/10 text-slate-200'
                        }`}>
                          {m.text}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 px-1">{m.time}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSend} className="flex gap-2 pt-3 border-t border-white/10">
                    <input
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      placeholder="Inquire with the Geneva atelier concierge..."
                      className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="px-6 sm:px-8 py-3 border-t border-white/10 bg-black/40 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Collector VIP Portal</span>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
