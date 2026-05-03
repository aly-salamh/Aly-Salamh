import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Package, Lightbulb, BarChart2, AlertCircle, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { FeedItem } from '../types';
import { getChatResponse } from '../services/geminiService';

const TYPE_ICONS = {
  trend: { icon: TrendingUp, color: 'text-brand-red', border: 'border-l-brand-red' },
  drop: { icon: Package, color: 'text-brand-amber', border: 'border-l-brand-amber' },
  insight: { icon: Lightbulb, color: 'text-brand-gold', border: 'border-l-brand-gold' },
  report: { icon: BarChart2, color: 'text-brand-black', border: 'border-l-brand-black' },
  alert: { icon: AlertCircle, color: 'text-brand-red', border: 'border-l-brand-red' }
};

export default function Community() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'report' | 'b2b'>('feed');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);

  useEffect(() => {
    fetch('/api/feed')
      .then(res => res.json())
      .then(data => setFeed(data));
  }, []);

  const generateMarketInsight = async () => {
    setInsightLoading(true);
    try {
      const response = await getChatResponse([
        { role: 'user', content: 'As a Cairo fashion brand owner, give me a unique market insight for SS26 based on the current Egyptian fashion scene (Linen sets, earthy tones, BNPL popularity, and delivery speeds).' }
      ], 'b2b');
      setAiInsight(response || null);
    } catch (error) {
      console.error(error);
    } finally {
      setInsightLoading(false);
    }
  };

  return (
    <div id="community-page" className="min-h-screen bg-brand-white pb-24">
      {/* Hero */}
      <section className="bg-brand-black py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-12 relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-1.5 bg-brand-white/10 rounded-full mb-8">
            <span className="text-brand-gold text-[10px] font-bold tracking-[0.2em] uppercase">FASHION INTELLIGENCE</span>
          </div>
          <h1 className="text-5xl md:text-7xl text-brand-white mb-6">THE CAIRO CODE FEED</h1>
          <p className="text-brand-white/60 text-lg max-w-2xl mx-auto">Real-time trends, brand insights, and market data for Cairo's fashion ecosystem.</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-16 z-30 bg-brand-white border-b border-black/5">
        <div className="container mx-auto px-4 md:px-12">
          <div className="flex space-x-12 overflow-x-auto scrollbar-hide">
            {[
              { id: 'feed', name: 'Live Feed' },
              { id: 'report', name: 'AI Weekly Report' },
              { id: 'b2b', name: 'Brand Owner Dashboard' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-6 text-[11px] font-bold uppercase tracking-[0.2em] relative transition-colors ${activeTab === tab.id ? 'text-brand-red' : 'text-brand-black-60 hover:text-brand-black'}`}
              >
                {tab.name}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-red" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-12 py-16">
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {feed.map((item) => {
              const { icon: Icon, color, border } = TYPE_ICONS[item.type];
              return (
                <motion.div 
                  layout
                  key={item.id}
                  className={`bg-brand-white border border-black/5 p-8 rounded-lg shadow-editorial border-l-4 translate-y-0 hover:-translate-y-1 transition-transform ${border}`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className={`flex items-center space-x-2 ${color}`}>
                      <Icon size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{item.type}</span>
                    </div>
                    <span className="text-[9px] font-bold text-brand-black-40 uppercase tracking-widest">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl mb-4 leading-tight">{item.title}</h3>
                  <p className="text-brand-black-60 text-sm leading-relaxed mb-8">{item.content}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-brand-white-95 text-[9px] font-bold uppercase tracking-wider rounded text-brand-black-40">#{tag}</span>
                    ))}
                  </div>

                  <button className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-brand-black hover:text-brand-red transition-colors group">
                    View Insight <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {activeTab === 'report' && (
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="bg-brand-black text-brand-white p-12 rounded-2xl relative overflow-hidden">
               <div className="relative z-10 space-y-8">
                 <div className="space-y-4">
                   <span className="text-brand-gold text-[10px] font-bold tracking-[0.2em]">WEEK 18 — SS26 MID-SEASON REPORT</span>
                   <h2 className="text-4xl md:text-5xl">LINEN RENAISSANCE & BNPL ADOPTION</h2>
                   <p className="text-brand-white/60 text-lg leading-relaxed">The mid-season data shows a shift towards sustainable fabrics and a massive 22% increase in Buy Now Pay Later adoption across the Premium and Elite tiers.</p>
                 </div>

                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                   <div className="bg-white/5 p-4 rounded-lg">
                     <span className="text-brand-gold text-[10px] font-bold block mb-2">TOP TREND</span>
                     <span className="font-bold">Earth Tones</span>
                   </div>
                   <div className="bg-white/5 p-4 rounded-lg">
                     <span className="text-brand-gold text-[10px] font-bold block mb-2">TOP CATEGORY</span>
                     <span className="font-bold">Linen Sets</span>
                   </div>
                   <div className="bg-white/5 p-4 rounded-lg">
                     <span className="text-brand-gold text-[10px] font-bold block mb-2">TOP BRAND</span>
                     <span className="font-bold">Okhtein</span>
                   </div>
                   <div className="bg-white/5 p-4 rounded-lg">
                     <span className="text-brand-gold text-[10px] font-bold block mb-2">BOSTA PERFORMANCE</span>
                     <span className="font-bold">1.8 Days Avg</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'b2b' && (
          <div className="space-y-12">
            <div className="bg-brand-black p-12 rounded-2xl text-brand-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 blur-[100px] rounded-full" />
               <div className="relative z-10 space-y-8">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                   <div className="space-y-2">
                     <div className="flex items-center space-x-2 text-brand-gold">
                       <Sparkles size={18} />
                       <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Gen-AI Intelligence</span>
                     </div>
                     <h3 className="text-3xl">AI MARKET INSIGHT</h3>
                   </div>
                   <button 
                    onClick={generateMarketInsight}
                    disabled={insightLoading}
                    className="btn-gold h-12 !px-8 flex items-center space-x-2"
                   >
                     {insightLoading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                     <span>GENERATE INSIGHT</span>
                   </button>
                 </div>

                 {aiInsight && (
                   <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 bg-white/5 border border-white/10 rounded-xl text-lg leading-relaxed text-brand-white/80"
                   >
                     {aiInsight}
                   </motion.div>
                 )}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Avg Conversion', value: '4.2%', change: '+0.8%', desc: 'Since last month' },
                { title: 'Avg Order Value', value: '1,840 EGP', change: '+12%', desc: 'With installments' },
                { title: 'Delivery Time', value: '2.1 Days', change: '-0.3d', desc: 'Bosta leads speed' },
                { title: 'Marketplace Presence', value: '62%', change: '+5%', desc: 'Amazon/Noon/Jumia' },
                { title: 'Offline Presence', value: '38%', change: '+2%', desc: 'Hybrid model brands' },
                { title: 'Quality Badge Rate', value: '71%', change: 'Stable', desc: 'Listed brands verified' }
              ].map((stat, i) => (
                <div key={i} className="bg-brand-white border border-black/5 p-8 rounded-lg shadow-editorial">
                  <h4 className="text-[10px] font-bold text-brand-black-40 uppercase tracking-widest mb-4">{stat.title}</h4>
                  <div className="flex items-baseline space-x-3 mb-2">
                    <span className="text-4xl font-display">{stat.value}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-brand-red'}`}>{stat.change}</span>
                  </div>
                  <p className="text-[9px] font-bold text-brand-black-60 uppercase tracking-tighter">{stat.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-brand-amber/10 p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0">
                <h3 className="text-3xl mb-2">READY TO SCALE YOUR BRAND?</h3>
                <p className="text-brand-black-60">Join 47 Cairo brands using intelligence data to grow.</p>
              </div>
              <button className="btn-amber h-14 !px-12">LIST YOUR BRAND</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
