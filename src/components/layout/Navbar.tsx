import { Link, useLocation } from 'wouter';
import { ShoppingBag, Search, User, Menu, X, ArrowRight, TrendingUp, Sparkles, MapPin, BarChart2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  // Disable scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Handle escape to close search
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const navItems = [
    { name: 'Brands', href: '/brands', icon: <TrendingUp size={14} /> },
    { name: 'Products', href: '/products', icon: <ShoppingBag size={14} /> },
    { name: 'AI Stylist', href: '/stylist', icon: <Sparkles size={14} /> },
    { name: 'Community', href: '/community', icon: <User size={14} /> },
    { name: 'Services', href: '/services', icon: <MapPin size={14} /> },
    { name: 'Dashboard', href: '/dashboard', icon: <BarChart2 size={14} /> },
    { name: 'About', href: '/about', icon: null }
  ];

  const categories = [
    { name: 'Luxury & Elite', count: 12 },
    { name: 'Streetwear Drops', count: 24 },
    { name: 'Bespoke Tailors', count: 8 },
    { name: 'Eco-Conscious', count: 5 },
  ];

  return (
    <nav id="main-nav" className="sticky top-0 z-50 bg-brand-white border-b border-black/5">
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <span className="font-display text-xl md:text-2xl leading-none tracking-tight">THE CAIRO CODE</span>
            <span className="text-brand-amber font-sans text-[8px] md:text-[9px] font-bold tracking-[0.2em] uppercase leading-none mt-0.5">FASHION INTELLIGENCE</span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={`text-[12px] font-bold uppercase tracking-wider transition-colors hover:text-brand-red ${location === item.href ? 'text-brand-red' : 'text-brand-black-60'}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {/* Expandable Search Bar */}
              <div className="hidden lg:flex items-center relative">
                <motion.div
                  initial={false}
                  animate={{ width: isSearchOpen ? 240 : 40 }}
                  className="relative flex items-center h-10 overflow-hidden"
                >
                  <button 
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-brand-black-60 hover:text-brand-black transition-colors"
                  >
                    <Search size={18} />
                  </button>
                  <input
                    type="text"
                    placeholder="Search brand, product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`bg-transparent text-[13px] font-medium focus:outline-none w-full pr-4 transition-opacity duration-300 ${isSearchOpen ? 'opacity-100' : 'opacity-0'}`}
                    autoFocus={isSearchOpen}
                  />
                  {isSearchOpen && (
                    <motion.div 
                      key="underline"
                      layoutId="underline"
                      className="absolute bottom-1 left-10 right-4 h-[1px] bg-brand-black/20"
                    />
                  )}
                </motion.div>
              </div>

              {/* Mobile/Tablet Search Trigger (simple) */}
              <button 
                className="lg:hidden text-brand-black-60 hover:text-brand-black p-2"
                onClick={() => setIsMenuOpen(true)}
              >
                <Search size={18} />
              </button>
              
              <button className="text-brand-black-60 hover:text-brand-black p-2">
                <ShoppingBag size={18} />
              </button>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <button className="btn-outline !py-2 !px-4">Sign In</button>
              <button className="btn-primary !py-2 !px-4">Join Free</button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              id="mobile-menu-toggle"
              className="lg:hidden p-2 text-brand-black transition-transform active:scale-95"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-[400px] bg-brand-white z-[70] shadow-2xl flex flex-col lg:hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-black/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-display text-lg leading-none">THE CAIRO CODE</span>
                  <span className="text-brand-amber font-sans text-[7px] font-bold uppercase tracking-widest">MOBILE EDITION</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-brand-black-60 hover:text-brand-black rounded-full hover:bg-black/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search Section */}
              <div className="p-4 bg-brand-white-98">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-black-40" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search brands, products, experts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-black/10 rounded-[4px] py-2.5 pl-10 pr-4 text-[13px] font-medium focus:outline-none focus:border-brand-red transition-colors"
                  />
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-2 space-y-8">
                {/* Main Links */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-brand-black-40 uppercase tracking-[0.2em] mb-4 pl-1">Main Sections</p>
                  {navItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      className={`flex items-center justify-between group p-3 rounded-lg transition-colors ${location === item.href ? 'bg-brand-red/5 text-brand-red' : 'hover:bg-black/5 text-brand-black-90'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`${location === item.href ? 'text-brand-red' : 'text-brand-black-40'}`}>
                          {item.icon}
                        </span>
                        <span className="text-[14px] font-bold uppercase tracking-wider">{item.name}</span>
                      </div>
                      <ArrowRight size={14} className={`transition-transform duration-300 ${location === item.href ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} />
                    </Link>
                  ))}
                </div>

                {/* Popular Categories */}
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-brand-black-40 uppercase tracking-[0.2em] mb-4 pl-1">Intelligence directory</p>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <div key={cat.name} className="p-3 border border-black/5 rounded-lg hover:border-brand-amber/30 transition-colors group cursor-pointer">
                        <p className="text-[11px] font-bold text-brand-black uppercase leading-tight group-hover:text-brand-amber">{cat.name}</p>
                        <p className="text-[9px] text-brand-black-40 font-medium">{cat.count} listings</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Account & Meta */}
                <div className="space-y-2 pb-8">
                  <button className="w-full flex items-center justify-center gap-2 btn-primary !py-3.5">
                    <User size={16} />
                    Create Professional Account
                  </button>
                  <button className="w-full btn-outline !py-3.5">Member Sign In</button>
                </div>
              </div>

              {/* Ticker for drawer bottom */}
              <div className="bg-brand-black py-2 overflow-hidden whitespace-nowrap border-t border-white/10">
                <div className="inline-block animate-marquee text-[9px] font-bold text-brand-white uppercase tracking-[0.3em]">
                  THE CAIRO CODE ELITE • PREMIER FASHION INTELLIGENCE • DISCOVER CURATED BRANDS • THE CAIRO CODE ELITE • PREMIER FASHION INTELLIGENCE • DISCOVER CURATED BRANDS • 
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
