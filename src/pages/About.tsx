import { Link } from 'wouter';
import { ArrowRight, Globe, ShieldCheck, TrendingUp, Users } from 'lucide-react';

export default function About() {
  return (
    <div id="about-page">
      {/* Hero */}
      <section className="bg-brand-black py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-12 relative z-10 text-center">
          <span className="text-brand-gold text-[11px] font-bold tracking-[0.2em] uppercase mb-8 block">EST. 2024 / CAIRO</span>
          <h1 className="text-5xl md:text-8xl text-brand-white mb-8">CAIRO'S FASHION INTELLIGENCE</h1>
          <p className="text-brand-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            We are building the premier curated discovery and intelligence layer for Egypt's burgeoning fashion scene.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl">OUR MISSION</h2>
              <p className="text-brand-black-60 text-lg leading-relaxed">
                The Cairo Code was born from a simple observation: Cairo's fashion ecosystem is thriving, but it lacks a centralized intelligence layer. Buyers struggle to find quality brands, and brands struggle to reach the right buyers.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="p-6 bg-brand-white-95 rounded-lg">
                  <div className="text-4xl font-display mb-2">47</div>
                  <div className="text-[10px] font-bold text-brand-black-40 uppercase tracking-widest">Curated Brands</div>
                </div>
                <div className="p-6 bg-brand-white-95 rounded-lg">
                  <div className="text-4xl font-display mb-2">12</div>
                  <div className="text-[10px] font-bold text-brand-black-40 uppercase tracking-widest">Quality Criteria</div>
                </div>
              </div>
            </div>
            <div className="bg-brand-black-90 p-12 rounded-2xl text-brand-white space-y-6">
              <h3 className="text-2xl text-brand-gold">WHAT WE DO</h3>
              <ul className="space-y-4">
                {[
                  "Evaluate brands on 12 rigorous quality criteria",
                  "Provide AI-powered stylist matches for buyers",
                  "Publish real-time trend and shipping intelligence",
                  "Facilitate direct connection between buyers and brands",
                  "Monitor Cairo market data for B2B growth"
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-4">
                    <ShieldCheck className="text-brand-gold mt-1 shrink-0" size={18} />
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-brand-white-95">
        <div className="container mx-auto px-4 md:px-12">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-4xl md:text-6xl">PLATFORM VALUES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "QUALITY FIRST", desc: "No shortcuts. Every brand is verified before listing." },
              { icon: Users, title: "BUYER-CENTRIC", desc: "Designed to simplify the fashion discovery journey." },
              { icon: TrendingUp, title: "DATA-DRIVEN", desc: "Intelligence over intuition. We track the numbers." },
              { icon: Globe, title: "COMMUNITY", desc: "Building a global stage for Egyptian craftsmanship." }
            ].map((value, i) => (
              <div key={i} className="bg-brand-white p-8 rounded-xl shadow-editorial text-center space-y-4">
                <value.icon className="mx-auto text-brand-red" size={32} />
                <h4 className="font-bold text-sm tracking-wider uppercase">{value.title}</h4>
                <p className="text-brand-black-60 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-4 md:px-12 text-center">
           <h2 className="text-brand-white text-4xl md:text-6xl mb-8">READY TO EXPLORE?</h2>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/brands" className="btn-primary h-14 !px-12 flex items-center justify-center space-x-2">
                <span>START BROWSING</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/stylist" className="btn-outline !text-brand-white !border-brand-white/20 h-14 !px-12 flex items-center justify-center">
                AI STYLIST
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
