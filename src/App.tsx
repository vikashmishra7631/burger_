import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Collections } from './components/Collections';
import { FeaturedProduct } from './components/FeaturedProduct';
import { Technology3D } from './components/Technology3D';
import { Craftsmanship } from './components/Craftsmanship';
import { OurStory } from './components/OurStory';
import { Sustainability } from './components/Sustainability';
import { Testimonials } from './components/Testimonials';
import { LifestyleGallery } from './components/LifestyleGallery';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CartDrawer, type CartItem } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { AccountModal } from './components/AccountModal';
import { AdminDashboard } from './components/AdminDashboard';
import { APEX_GT01, type WatchModel, type CollectionItem } from './data/chronovaData';
import { api, authStorage, type UserProfile } from './services/api';

export const App: React.FC = () => {
  // Theme State (Default: Smoked Racing Emerald & Gold)
  const [currentTheme, setCurrentTheme] = useState('emerald');

  // VIP Collector User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { watch: APEX_GT01, quantity: 1 }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Product Detail Modal State
  const [selectedWatch, setSelectedWatch] = useState<WatchModel | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Restore authenticated session from backend on page load
  useEffect(() => {
    const token = authStorage.getToken();
    if (token) {
      api.getMe().then(user => {
        if (user) setCurrentUser(user);
      });
    }
  }, []);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
  };

  const handleLogoutSuccess = () => {
    authStorage.removeToken();
    setCurrentUser(null);
  };

  const handleAddToCart = (watch: WatchModel) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.watch.id === watch.id);
      if (existing) {
        return prev.map(item => 
          item.watch.id === watch.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { watch, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.watch.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.watch.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleBuyNow = (watch: WatchModel) => {
    handleAddToCart(watch);
    setIsProductModalOpen(false);
    setIsCartOpen(true);
  };

  const handleSelectCollection = (_col: CollectionItem) => {
    setSelectedWatch(APEX_GT01);
    setIsProductModalOpen(true);
  };

  const handleExploreCollections = () => {
    const el = document.getElementById('collections');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDiscoverCraft = () => {
    const el = document.getElementById('craftsmanship');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  // Keyboard shortcut ESC to dismiss modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
        setIsSearchOpen(false);
        setIsAccountOpen(false);
        setIsProductModalOpen(false);
        setIsAdminOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Background style based on theme
  const getThemeBackground = () => {
    switch (currentTheme) {
      case 'sapphire':
        return 'bg-[#030813] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200';
      case 'obsidian':
        return 'bg-[#000000] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200';
      case 'carbon':
        return 'bg-[#080808] text-slate-100 selection:bg-slate-500/30 selection:text-white';
      case 'emerald':
      default:
        return 'bg-[#030705] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200';
    }
  };

  return (
    <div className={`relative min-h-screen w-full transition-colors duration-700 ${getThemeBackground()}`}>
      
      {/* Navigation */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        currentUser={currentUser}
      />

      {/* Main Sections */}
      <main className="w-full">
        {/* Hero Section */}
        <Hero
          onExploreCollections={handleExploreCollections}
          onDiscoverCraft={handleDiscoverCraft}
          onQuickView={() => {
            setSelectedWatch(APEX_GT01);
            setIsProductModalOpen(true);
          }}
        />

        {/* Brand Statistics */}
        <Stats />

        {/* Iconic Collections */}
        <Collections
          onSelectCollection={handleSelectCollection}
        />

        {/* Featured Watch (Apex GT-01) */}
        <FeaturedProduct
          onAddToCart={() => handleAddToCart(APEX_GT01)}
          onViewDetails={() => {
            setSelectedWatch(APEX_GT01);
            setIsProductModalOpen(true);
          }}
        />

        {/* 3D Watch Technology (Exploded Layers + Three.js 3D Studio) */}
        <Technology3D />

        {/* Craftsmanship */}
        <Craftsmanship
          onDiscoverMore={() => {
            setSelectedWatch(APEX_GT01);
            setIsProductModalOpen(true);
          }}
        />

        {/* Our Story */}
        <OurStory />

        {/* Sustainability */}
        <Sustainability />

        {/* Testimonials */}
        <Testimonials />

        {/* Lifestyle Gallery */}
        <LifestyleGallery />

        {/* Newsletter CTA */}
        <Newsletter />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Product Detail Modal */}
      <ProductModal
        watch={selectedWatch}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Shopping Bag Drawer with Real Backend Checkout */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={() => {
          setSelectedWatch(APEX_GT01);
          setIsProductModalOpen(true);
        }}
      />

      {/* Account Modal (VIP Login & Real Vault) */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogoutSuccess={handleLogoutSuccess}
      />

      {/* Admin Salon Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

    </div>
  );
};

export default App;
