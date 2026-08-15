import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Check,
  Lock,
  User,
  Mail
} from 'lucide-react';
import type { WatchModel } from '../data/chronovaData';
import type { UserProfile } from './AccountModal';

export interface CartItem {
  watch: WatchModel;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  currentUser: UserProfile | null;
  onLogin: (email: string, name: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currentUser,
  onLogin,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  // Checkout Login Gate State
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.watch.price * item.quantity, 0);
  const total = Math.max(0, subtotal - discount);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'GENEVA' || promoCode.toUpperCase() === 'VIP') {
      setDiscount(150);
    }
  };

  const handleCheckoutClick = () => {
    // If not logged in, prompt VIP authentication first
    if (!currentUser) {
      setShowAuthGate(true);
      return;
    }
    executeOrder();
  };

  const executeOrder = () => {
    const generatedOrderNum = `CH-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(generatedOrderNum);
    setCheckoutComplete(true);
    setShowAuthGate(false);
    onClearCart();
    setDiscount(0);
    setPromoCode('');
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) return;
    const name = authName.trim() || authEmail.split('@')[0];
    onLogin(authEmail, name);
    // Proceed with order immediately once logged in
    executeOrder();
  };

  const handleCloseModal = () => {
    setCheckoutComplete(false);
    setShowAuthGate(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#07110c] border-l border-emerald-500/25 h-full flex flex-col justify-between p-6 sm:p-8 shadow-2xl overflow-y-auto">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h3 className="font-cinzel text-base font-bold text-white uppercase tracking-widest">
                {showAuthGate ? 'VIP AUTHENTICATION' : 'YOUR SHOPPING BAG'}
              </h3>
            </div>
            <button
              onClick={handleCloseModal}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          {checkoutComplete ? (
            <div className="py-12 text-center space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-emerald-glow border border-emerald-400/40">
                <Check className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-serif font-bold text-white">Order Confirmed</h4>
                <div className="text-xs font-mono text-emerald-400">Order Ref: {orderNumber}</div>
              </div>
              
              {currentUser && (
                <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-emerald-500/20 text-xs text-slate-300">
                  Registered Patron: <span className="font-bold text-white">{currentUser.name}</span>
                </div>
              )}

              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                Thank you for your acquisition. A personal horology advisor from our Geneva salon will contact you shortly with armored courier tracking.
              </p>
              
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-emerald-500/20 text-[11px] text-slate-300 space-y-1 text-left">
                <div className="flex justify-between font-medium text-white">
                  <span>Certificate of Origin</span>
                  <span className="text-emerald-400">Generated ✓</span>
                </div>
                <div className="flex justify-between font-medium text-white">
                  <span>5-Year Warranty Vault</span>
                  <span className="text-emerald-400">Activated ✓</span>
                </div>
              </div>
              
              <button
                onClick={handleCloseModal}
                className="mt-4 w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-widest shadow-emerald-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Continue Browsing
              </button>
            </div>
          ) : showAuthGate ? (
            /* Auth Gate required before checkout */
            <div className="py-6 space-y-5 animate-fadeIn">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 flex items-center justify-center mx-auto shadow-emerald-glow">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-serif font-bold text-white">
                  {isRegisterMode ? 'Register Patron Account' : 'VIP Sign In Required'}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  To assign your serialized warranty certificate and allocate your timepiece, please log in to proceed.
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                {isRegisterMode && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="e.g. Lord Alexander Wright"
                        className="w-full bg-[#040906] border border-emerald-500/25 focus:border-emerald-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
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
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="patron@chronova.ch"
                      className="w-full bg-[#040906] border border-emerald-500/25 focus:border-emerald-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
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
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#040906] border border-emerald-500/25 focus:border-emerald-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-[0.2em] shadow-emerald-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>{isRegisterMode ? 'CREATE ACCOUNT & COMPLETE ORDER' : 'LOGIN & COMPLETE ORDER'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(!isRegisterMode)}
                    className="text-emerald-400 hover:underline"
                  >
                    {isRegisterMode ? 'Already registered? Sign in' : 'New Collector? Register'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAuthGate(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    Back to Bag
                  </button>
                </div>
              </form>
            </div>
          ) : items.length === 0 ? (
            <div className="py-24 text-center space-y-4 text-slate-400">
              <div className="w-14 h-14 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center mx-auto text-slate-600">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-300">Your shopping bag is currently empty.</p>
                <p className="text-xs text-slate-500">Explore our handcrafted chronographs and calibres.</p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-emerald-500/30 text-xs font-semibold text-emerald-400 uppercase tracking-wider transition-colors"
              >
                Explore Collections
              </button>
            </div>
          ) : (
            <div className="py-6 space-y-4 overflow-y-auto max-h-[48vh]">
              {currentUser && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-400/30 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Logged in as: <strong className="text-white">{currentUser.name}</strong></span>
                  </div>
                  <span className="text-[10px] text-emerald-400 uppercase font-mono">{currentUser.tier}</span>
                </div>
              )}

              {items.map((item) => (
                <div 
                  key={item.watch.id}
                  className="p-4 rounded-2xl bg-[#08150f] border border-emerald-500/15 flex items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-xl bg-black p-1 border border-white/10 shrink-0">
                    <img
                      src={item.watch.image}
                      alt={item.watch.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{item.watch.name}</h5>
                    <div className="text-[11px] font-serif text-emerald-400 mt-0.5">
                      ${item.watch.price.toLocaleString()}
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-2 py-0.5 text-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.watch.id, -1)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-white text-xs">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.watch.id, 1)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.watch.id)}
                        className="text-slate-500 hover:text-red-400 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {!checkoutComplete && !showAuthGate && items.length > 0 && (
          <div className="pt-6 border-t border-white/10 space-y-4">
            
            {/* Promo code */}
            <form onSubmit={applyPromo} className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo code (e.g. VIP)"
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-emerald-400"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white uppercase"
              >
                Apply
              </button>
            </form>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>VIP Collector Voucher</span>
                  <span>-${discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Express Shipping</span>
                <span className="text-emerald-400">COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                <span>Total Due</span>
                <span className="text-base emerald-gradient-text font-bold">${total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-[0.2em] shadow-emerald-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>{currentUser ? 'CONFIRM & ACQUIRE TIMEPIECE' : 'PROCEED TO SECURE CHECKOUT'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Encrypted Swiss Bank Security Protocol</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
