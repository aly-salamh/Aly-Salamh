import { motion } from 'motion/react';
import { Link } from 'wouter';
import { ArrowRight, CheckCircle, ShieldCheck, Zap, TrendingUp, BarChart2, Package } from 'lucide-react';
import { useState, useEffect } from 'react';

import { useABTest } from '../lib/ab-test';

const COUNT_TARGETS = {
  brands: 47,
  quality: 100,
  partners: 3
};

function StatCounter({ target, label, suffix = "", prefix = "" }: { target: number, label: string, suffix?: string, prefix?: string }) {
  const [count, setCount] = useState(Math.floor(target * 0.85));

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev < target) return prev + 1;
        clearInterval(timer);
        return target;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="flex flex-col p-6 h-full justify-center">
      <span className="font-display text-4xl text-brand-white mb-2">{prefix}{count}{suffix}</span>
      <span className="text-[10px] font-bold text-brand-white/60 uppercase tracking-widest">{label}</span>
    </div>
  );
}

export default function Home() {
  const { variant, trackEvent } = useABTest('hero_heading', ['intelligence', 'excellence']);

  const heroHeading = variant === 'excellence' 
    ? <>CAIRO'S FASHION <span className="text-brand-red">EXCELLENCE</span></>
    : <>CAIRO'S FASHION <span className="text-brand-red">INTELLIGENCE</span></>;

  return (
    <div id="home-page">
      {/* Section 1: Hero */}
      <section className="relative min-h-[90vh] bg-brand-black flex items-center overflow-hidden">
        {/* Red Grid Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{ 
            backgroundImage: 'linear-gradient(#F50537 1px, transparent 1px), linear-gradient(90deg, #F50537 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        ></div>

        <div className="container mx-auto px-4 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex items-center px-3 py-1 bg-brand-red/10 border border-brand-red/20 rounded-full mb-8">
              <span className="text-brand-red text-[10px] font-bold tracking-widest uppercase">SS26 COLLECTION — LIVE NOW</span>
            </div>
            
            <h1 className="text-brand-white text-5xl md:text-8xl leading-[0.9] mb-8">
              {heroHeading}
            </h1>
            
            <p className="text-brand-white/60 text-lg mb-12 max-w-lg leading-relaxed">
              Egypt's premier fashion intelligence platform. Discover, style, and shop curated local brands through Cairo's smartest discovery layer.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/brands" 
                onClick={() => trackEvent('cta_explore_brands')}
                className="btn-primary flex items-center justify-center space-x-2 h-14 !px-8 text-sm"
              >
                <span>EXPLORE BRANDS</span>
                <ArrowRight size={16} />
              </Link>
              <Link 
                href="/stylist" 
                onClick={() => trackEvent('cta_stylist')}
                className="btn-outline !text-brand-white !border-brand-white/20 h-14 !px-8 text-sm flex items-center justify-center"
              >
                AI STYLIST
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-brand-black-90 border border-brand-white/5 rounded-lg h-40">
              <StatCounter target={COUNT_TARGETS.brands} label="Curated Brands" />
            </div>
            <div className="bg-brand-red rounded-lg h-40">
              <div className="flex flex-col p-6 h-full justify-center">
                <span className="font-display text-4xl text-brand-white mb-2 uppercase">SS26</span>
                <span className="text-[10px] font-bold text-brand-white/80 uppercase tracking-widest">Season Live</span>
              </div>
            </div>
            <div className="bg-brand-white text-brand-black rounded-lg h-40">
              <div className="flex flex-col p-6 h-full justify-center">
                <div className="flex items-baseline space-x-1 mb-2">
                  <span className="font-display text-4xl">{COUNT_TARGETS.quality}</span>
                  <span className="font-display text-2xl">%</span>
                </div>
                <span className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest">Quality Verified</span>
              </div>
            </div>
            <div className="bg-brand-black-90 border border-brand-white/5 rounded-lg h-40">
              <StatCounter target={COUNT_TARGETS.partners} label="Installment Partners" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Offers Ticker */}
      <section className="bg-brand-white border-y border-black/5 h-14 flex items-center overflow-hidden">
        <div className="flex whitespace-nowrap offers-ticker-scroll space-x-24">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center space-x-24">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <Zap size={12} className="text-brand-amber fill-brand-amber" />
                5% OFF YOUR FIRST ORDER
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <TrendingUp size={12} className="text-brand-red" />
                NEW BRAND: OKHTEIN SS26
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <CheckCircle size={12} className="text-green-500" />
                100% QUALITY VERIFIED
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Style Quiz Entry */}
      <section className="py-24 bg-brand-white-98">
        <div className="container mx-auto px-4 md:px-12 text-center max-w-4xl">
          <span className="text-brand-red text-[11px] font-bold tracking-[0.2em] uppercase mb-4 block">FIND YOUR MATCH</span>
          <h2 className="text-4xl md:text-6xl mb-8">DISCOVER YOUR CAIRO VIBE</h2>
          <p className="text-brand-black-60 mb-12 text-lg">Answer 3 questions and we'll instantly sort through 47 brands to find your perfect fashion match.</p>
          
          <div className="bg-brand-white border border-black/5 p-8 md:p-12 rounded-2xl shadow-editorial text-left">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="space-y-4">
                 <label className="text-[10px] font-bold text-brand-black-40 uppercase tracking-widest">Step 01 / Vibe</label>
                 <select className="w-full bg-brand-white-95 border-none p-4 rounded-lg font-bold text-sm">
                   <option>MINIMALIST</option>
                   <option>STREETWEAR</option>
                   <option>LUXURY</option>
                   <option>FORMAL</option>
                 </select>
               </div>
               <div className="space-y-4">
                 <label className="text-[10px] font-bold text-brand-black-40 uppercase tracking-widest">Step 02 / Budget</label>
                 <select className="w-full bg-brand-white-95 border-none p-4 rounded-lg font-bold text-sm">
                   <option>UNDER 500 EGP</option>
                   <option>500 - 1500 EGP</option>
                   <option>1500 - 3000 EGP</option>
                   <option>3000+ EGP</option>
                 </select>
               </div>
               <div className="space-y-4">
                 <label className="text-[10px] font-bold text-brand-black-40 uppercase tracking-widest">Step 03 / Occasion</label>
                 <select className="w-full bg-brand-white-95 border-none p-4 rounded-lg font-bold text-sm">
                   <option>DAILY WEAR</option>
                   <option>WORK</option>
                   <option>EVENTS</option>
                   <option>SPORT</option>
                 </select>
               </div>
             </div>
             <div className="mt-8">
               <Link href="/brands" className="w-full btn-primary h-14 flex items-center justify-center space-x-2">
                 <span>GET MY RECOMMENDATIONS</span>
                 <Zap size={14} />
               </Link>
             </div>
          </div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <span className="font-display text-6xl text-brand-red opacity-20">01</span>
              <h3 className="text-3xl">DISCOVER</h3>
              <p className="text-brand-black-60 leading-relaxed font-sans">Browse 47 curated Cairo brands filtered by your style, budget, and vibe.</p>
            </div>
            <div className="space-y-6">
              <span className="font-display text-6xl text-brand-red opacity-20">02</span>
              <h3 className="text-3xl">STYLE</h3>
              <p className="text-brand-black-60 leading-relaxed font-sans">Get AI-powered outfit recommendations and perfect brand matches for any occasion.</p>
            </div>
            <div className="space-y-6">
              <span className="font-display text-6xl text-brand-red opacity-20">03</span>
              <h3 className="text-3xl">SHOP</h3>
              <p className="text-brand-black-60 leading-relaxed font-sans">Order via brand's own channel using Visa or easy installments. 100% Secure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: B2B Section */}
      <section className="py-24 bg-brand-black relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-brand-white text-4xl md:text-6xl mb-8">ARE YOU A CAIRO FASHION BRAND?</h2>
            <p className="text-brand-white/60 mb-12 text-lg">Join 47 premium Cairo brands and scale your business with Egypt's most powerful fashion intelligence platform.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <div className="space-y-2">
                <BarChart2 className="text-brand-red mx-auto mb-4" size={32} />
                <h4 className="text-brand-white text-sm">INTELLIGENCE</h4>
              </div>
              <div className="space-y-2">
                <ShieldCheck className="text-brand-amber mx-auto mb-4" size={32} />
                <h4 className="text-brand-white text-sm">QUALITY BADGE</h4>
              </div>
              <div className="space-y-2">
                <Package className="text-brand-red mx-auto mb-4" size={32} />
                <h4 className="text-brand-white text-sm">GROWTH TOOLS</h4>
              </div>
              <div className="space-y-4">
                <span className="font-display text-brand-white text-3xl">4.2%</span>
                <h4 className="text-brand-white/40 text-[10px] font-bold tracking-widest uppercase">AVG CONVERSION</h4>
              </div>
            </div>

            <Link href="/submit-brand" className="btn-amber h-14 !px-12 inline-flex items-center space-x-2">
              <span>APPLY TO LIST YOUR BRAND</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
