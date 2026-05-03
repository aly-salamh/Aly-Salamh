import { motion } from 'motion/react';
import { BarChart2, Users, MessageSquare, TrendingUp, ArrowUpRight, Zap, Target, Search } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
  const [activeSegment, setActiveSegment] = useState<'b2c' | 'b2b'>('b2c');

  const stats = [
    { label: 'Active Users', value: '4.2k', change: '+12%', icon: Users, color: 'text-blue-500' },
    { label: 'AI Conversations', value: '12.8k', change: '+24%', icon: MessageSquare, color: 'text-brand-red' },
    { label: 'Brand Matches', value: '3.1k', change: '+18%', icon: Target, color: 'text-brand-amber' },
    { label: 'B2B Leads', value: '142', change: '+5%', icon: TrendingUp, color: 'text-green-500' },
  ];

  return (
    <div id="dashboard-page" className="min-h-screen bg-brand-white-95 py-12">
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-2">
            <span className="text-brand-red text-[11px] font-bold tracking-[0.2em] uppercase">Intelligence Portal</span>
            <h1 className="text-4xl md:text-5xl uppercase font-display">System Dashboard</h1>
          </div>
          <div className="flex bg-brand-white p-1 rounded-xl shadow-editorial border border-black/5">
            <button 
              onClick={() => setActiveSegment('b2c')}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeSegment === 'b2c' ? 'bg-brand-black text-brand-white' : 'text-brand-black-40 hover:text-brand-black'}`}
            >
              Consumer (B2C)
            </button>
            <button 
              onClick={() => setActiveSegment('b2b')}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeSegment === 'b2b' ? 'bg-brand-black text-brand-white' : 'text-brand-black-40 hover:text-brand-black'}`}
            >
              Business (B2B)
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-white p-6 rounded-2xl shadow-editorial border border-black/5"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 bg-black/5 rounded-lg ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div className="flex items-center text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                  <ArrowUpRight size={12} className="mr-1" />
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-brand-black-40 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-display">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts & Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Placeholder */}
          <div className="lg:col-span-2 bg-brand-white p-8 rounded-2xl shadow-editorial border border-black/5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-display uppercase">Engagement Trends</h3>
              <select className="bg-black/5 border-none rounded-lg text-[10px] font-bold uppercase tracking-widest p-2">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
              </select>
            </div>
            <div className="h-[300px] flex items-end gap-2">
              {[60, 45, 75, 40, 90, 65, 80, 55, 70, 85, 50, 95].map((h, i) => (
                <div key={i} className="flex-1 space-y-2">
                  <div 
                    className="w-full bg-brand-black/5 rounded-t-sm transition-all hover:bg-brand-red cursor-pointer" 
                    style={{ height: `${h}%` }}
                  />
                  <div className="text-[8px] text-center font-bold text-brand-black-20">M{i+1}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar - Active Tests & Signals */}
          <div className="space-y-8">
            <div className="bg-brand-white p-6 rounded-2xl shadow-editorial border border-black/5 space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-black-40">Active A/B Tests</h4>
              <div className="space-y-4">
                <div className="p-4 bg-brand-white-98 rounded-xl border border-black/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold">Hero CTR Test</span>
                    <span className="text-[9px] bg-brand-red/10 text-brand-red px-2 py-0.5 rounded uppercase font-bold">Live</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-brand-black-40">
                      <span>Variant A (Modern)</span>
                      <span>52%</span>
                    </div>
                    <div className="w-full h-1 bg-black/5 rounded-full">
                      <div className="w-[52%] h-full bg-brand-red rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-brand-white-98 rounded-xl border border-black/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold">Pricing Layout</span>
                    <span className="text-[9px] bg-brand-black/10 text-brand-black-60 px-2 py-0.5 rounded uppercase font-bold">Paused</span>
                  </div>
                  <p className="text-[9px] text-brand-black-40">Awaiting significant sample size (+1.2k more req).</p>
                </div>
              </div>
            </div>

            <div className="bg-brand-black text-brand-white p-6 rounded-2xl shadow-2xl relative overflow-hidden">
              <Zap size={40} className="absolute -right-4 -top-4 text-brand-gold/10" />
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-4">Market Signals</h4>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-brand-gold rounded-full mt-1 flex-shrink-0" />
                  <p className="text-[11px] leading-relaxed">Spike in search volume for <span className="text-brand-gold">"Linen Summer"</span> brands in Cairo East.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-brand-gold rounded-full mt-1 flex-shrink-0" />
                  <p className="text-[11px] leading-relaxed">BNPL usage up <span className="text-brand-gold">14%</span> week-over-week in the Elite tier segment.</p>
                </li>
              </ul>
              <button className="w-full mt-6 py-3 bg-brand-white/10 hover:bg-brand-white/20 transition-colors rounded-lg text-[10px] font-bold uppercase tracking-widest">
                Full Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
