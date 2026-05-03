import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, CheckCircle, Zap, Globe, BarChart2 } from 'lucide-react';
import { Link } from 'wouter';

export default function SubmitBrand() {
  return (
    <div id="submit-brand-page">
      <section className="bg-brand-black py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-12 relative z-10">
          <div className="max-w-3xl">
            <span className="text-brand-red text-[11px] font-bold tracking-[0.2em] uppercase mb-4 block">B2B PARTNERSHIPS</span>
            <h1 className="text-5xl md:text-8xl text-brand-white leading-tight mb-8">SCALE YOUR CAIRO BRAND</h1>
            <p className="text-brand-white/60 text-lg leading-relaxed">
              Apply to join 47 curation-first Cairo brands and gain access to the market's most advanced fashion intelligence layer.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl uppercase">THE ADMISSION PROCESS</h2>
                <p className="text-brand-black-60">Every brand on The Cairo Code undergoes a manual audit against our 12 rigorous quality criteria.</p>
              </div>

              <div className="space-y-8">
                {[
                  { title: "Stage 01: Audit", desc: "Our analysts review your product quality, shipping speed, and brand maturity." },
                  { title: "Stage 02: Verification", desc: "We verify your fulfillment channels and customer service responsiveness." },
                  { title: "Stage 03: Integration", desc: "Your collections are mapped to our AI discovery engine." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-brand-black text-brand-white flex items-center justify-center font-display text-xl rounded-lg">
                      0{i+1}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm tracking-wider uppercase mb-1">{step.title}</h4>
                      <p className="text-brand-black-60 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-brand-white-95 rounded-2xl space-y-4">
                <div className="flex items-center gap-3 text-brand-red">
                  <ShieldCheck size={24} />
                  <span className="font-display text-xl">THE CAIRO CODE QUALITY BADGE</span>
                </div>
                <p className="text-sm text-brand-black-60 leading-relaxed font-medium">
                  Verified brands receive 3x more discovery traffic and gain access to the "Cairo Code Certified" digital badge for use on their own channels.
                </p>
              </div>
            </div>

            <div className="bg-brand-white-98 p-8 md:p-12 rounded-3xl border border-black/5">
               <h3 className="text-2xl mb-8 uppercase font-display">APPLICATION FORM</h3>
               <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-brand-black-40 uppercase tracking-widest pl-1">Brand Name</label>
                       <input type="text" placeholder="e.g. Cairo Loom" className="w-full bg-white border border-black/10 p-4 rounded-xl text-sm focus:border-brand-red transition-colors outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-brand-black-40 uppercase tracking-widest pl-1">Website or Instagram</label>
                       <input type="text" placeholder="e.g. @cairoloom" className="w-full bg-white border border-black/10 p-4 rounded-xl text-sm focus:border-brand-red transition-colors outline-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-brand-black-40 uppercase tracking-widest pl-1">Primary Category</label>
                     <select className="w-full bg-white border border-black/10 p-4 rounded-xl text-sm focus:border-brand-red transition-colors outline-none font-medium">
                        <option>Apparel</option>
                        <option>Jewelry & Accessories</option>
                        <option>Footwear</option>
                        <option>Home Decor</option>
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-brand-black-40 uppercase tracking-widest pl-1">Monthly Orders Range</label>
                     <select className="w-full bg-white border border-black/10 p-4 rounded-xl text-sm focus:border-brand-red transition-colors outline-none font-medium">
                        <option>0 - 100</option>
                        <option>100 - 500</option>
                        <option>500 - 1500</option>
                        <option>1500+</option>
                     </select>
                  </div>

                  <div className="space-y-2 pt-4">
                    <button type="submit" className="w-full btn-primary h-14 flex items-center justify-center gap-2">
                      <span>SUBMIT FOR AUDIT</span>
                      <ArrowRight size={16} />
                    </button>
                    <p className="text-[9px] text-center text-brand-black-40 mt-4 uppercase font-bold tracking-widest">
                      Our analysts respond within 48 business hours.
                    </p>
                  </div>
               </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-brand-black text-brand-white">
        <div className="container mx-auto px-4 md:px-12">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-4xl md:text-6xl uppercase">PARTNER BENEFITS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BarChart2, title: "DATA DASHBOARD", desc: "Real-time market conversion data." },
              { icon: Zap, title: "AI INVENTORY", desc: "Predictive trend mapping for Cairo." },
              { icon: Globe, title: "WORLDWIDE REACH", desc: "Direct routes to global export markets." },
              { icon: CheckCircle, title: "LOYALTY TOOLS", desc: "Built-in customer retention engines." }
            ].map((benefit, i) => (
              <div key={i} className="text-center space-y-4">
                <benefit.icon className="mx-auto text-brand-red" size={32} />
                <h4 className="font-bold text-sm tracking-wider uppercase">{benefit.title}</h4>
                <p className="text-brand-white/40 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
