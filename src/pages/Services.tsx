import { Sparkles, ShieldCheck, TrendingUp, Package, BarChart2, MessageCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function Services() {
  return (
    <div id="services-page">
      {/* Hero */}
      <section className="bg-brand-white-95 py-24 border-b border-black/5">
        <div className="container mx-auto px-4 md:px-12">
          <div className="max-w-3xl space-y-6">
            <span className="text-brand-red text-[11px] font-bold tracking-[0.2em] uppercase">The Platform</span>
            <h1 className="text-5xl md:text-8xl leading-tight">SERVICES FOR BUYERS & BRANDS</h1>
            <p className="text-brand-black-60 text-lg leading-relaxed">
              We provide a suite of tools and services designed to bridge the gap between Cairo's best brands and most conscious buyers.
            </p>
          </div>
        </div>
      </section>

      {/* For Buyers */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-4 md:px-12">
          <div className="flex items-center space-x-4 mb-12">
            <h2 className="text-4xl md:text-5xl">FOR BUYERS</h2>
            <div className="h-0.5 bg-brand-red/20 flex-grow"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { icon: Sparkles, title: "AI STYLING", desc: "Get personalized matches based on your body type, style, and budget." },
              { icon: ShieldCheck, title: "QUALITY VERIFIED", desc: "Shop with confidence. Every brand is vetted on 12 quality criteria." },
              { icon: TrendingUp, title: "TREND ALERTS", desc: "Stay ahead of the Cairo fashion curve with real-time drop notifications." },
              { icon: Package, title: "DELIVERY TRACKING", desc: "Centralized tracking for multiple Cairo brands in one portal." },
              { icon: BarChart2, title: "PRICE INTELLIGENCE", desc: "Compare prices and collections side-by-side to find the best deal." },
              { icon: MessageCircle, title: "REVIEWS", desc: "Read real feedback from verified buyers about sizing and shipping." }
            ].map((s, i) => (
              <div key={i} className="space-y-4">
                <s.icon className="text-brand-red" size={28} />
                <h4 className="font-bold text-lg">{s.title}</h4>
                <p className="text-brand-black-60 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Brands */}
      <section className="py-24 bg-brand-black text-brand-white">
        <div className="container mx-auto px-4 md:px-12">
          <div className="flex items-center space-x-4 mb-12">
            <h2 className="text-4xl md:text-5xl">FOR BRANDS</h2>
            <div className="h-0.5 bg-brand-white/10 flex-grow"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { icon: ShieldCheck, title: "BRAND LISTING", desc: "Get featured on Cairo's premier discovery platform for fashion conscious buyers." },
              { icon: Sparkles, title: "QUALITY BADGE", desc: "Earn our verified badge to build instant trust with shoppers." },
              { icon: BarChart2, title: "INTELLIGENCE DASHBOARD", desc: "Access real-time data on conversion, trends, and market positioning." },
              { icon: MessageCircle, title: "COMMUNITY PORTAL", desc: "Connect with buyers and manage your brand reputation." },
              { icon: Package, title: "SHIPPING ALERTS", desc: "Get real-time monitoring on delivery speeds across all Cairo providers." },
              { icon: TrendingUp, title: "OFFER ENGINE", desc: "Run targeted promotions and surprise discounts for high-intent shoppers." }
            ].map((s, i) => (
              <div key={i} className="space-y-4">
                <s.icon className="text-brand-gold" size={28} />
                <h4 className="font-bold text-lg text-brand-white uppercase tracking-wider">{s.title}</h4>
                <p className="text-brand-white/60 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-brand-white-95">
        <div className="container mx-auto px-4 md:px-12 text-center">
           <h2 className="text-4xl md:text-6xl mb-16 uppercase">PLATFORM ACCESS</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             <div className="bg-brand-white p-12 rounded-2xl shadow-editorial space-y-8 flex flex-col">
               <div className="space-y-4">
                 <h3 className="text-2xl">FOR BUYERS</h3>
                 <div className="text-4xl font-display text-brand-red">FREE</div>
               </div>
               <ul className="text-left space-y-4 flex-grow">
                 <li className="flex items-center gap-3 text-sm font-medium"><ShieldCheck size={16} className="text-brand-red" /> Unlimited Discovery</li>
                 <li className="flex items-center gap-3 text-sm font-medium"><ShieldCheck size={16} className="text-brand-red" /> AI Stylist Access</li>
                 <li className="flex items-center gap-3 text-sm font-medium"><ShieldCheck size={16} className="text-brand-red" /> Review Access</li>
               </ul>
               <Link href="/brands" className="w-full btn-primary h-14 flex items-center justify-center">START EXPLORING</Link>
             </div>
             
             <div className="bg-brand-black text-brand-white p-12 rounded-2xl shadow-2xl space-y-8 flex flex-col border-2 border-brand-gold">
               <div className="space-y-4">
                 <h3 className="text-2xl text-brand-gold">FOR BRANDS</h3>
                 <div className="text-4xl font-display text-brand-gold">INQUIRE</div>
               </div>
               <ul className="text-left space-y-4 flex-grow">
                 <li className="flex items-center gap-3 text-sm font-medium"><Sparkles size={16} className="text-brand-gold" /> Full Intelligence Suite</li>
                 <li className="flex items-center gap-3 text-sm font-medium"><Sparkles size={16} className="text-brand-gold" /> Brand Badge Program</li>
                 <li className="flex items-center gap-3 text-sm font-medium"><Sparkles size={16} className="text-brand-gold" /> Priority Support</li>
               </ul>
               <Link href="/submit-brand" className="w-full btn-gold h-14 flex items-center justify-center">LIST YOUR BRAND</Link>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}
