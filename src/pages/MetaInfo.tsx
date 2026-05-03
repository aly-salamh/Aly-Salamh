import { motion } from 'motion/react';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

export default function MetaInfo({ title }: { title: string }) {
  return (
    <div id="meta-info-page" className="min-h-screen bg-brand-white flex items-center justify-center py-24">
      <div className="container mx-auto px-4 md:px-12 text-center max-w-2xl">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="space-y-8"
        >
          <div className="w-20 h-20 bg-brand-white-95 border border-black/5 rounded-full flex items-center justify-center mx-auto mb-8">
             <Clock className="text-brand-black-40" size={32} />
          </div>
          
          <div className="space-y-4">
            <span className="text-brand-red text-[11px] font-bold tracking-[0.2em] uppercase">SYSTEM ADVISORY</span>
            <h1 className="text-5xl md:text-7xl font-display uppercase leading-none">{title}</h1>
            <p className="text-brand-black-60 text-lg leading-relaxed">
              We are currently integrating this intelligence module into The Cairo Code Elite ecosystem. Phase 2 launch scheduled for late SS26.
            </p>
          </div>

          <div className="pt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary h-14 !px-12 flex items-center justify-center gap-2">
              <ArrowLeft size={16} />
              <span>RETURN HOME</span>
            </Link>
            <Link href="/brands" className="btn-outline h-14 !px-12 flex items-center justify-center gap-2">
              <Sparkles size={16} />
              <span>EXPLORE BRANDS</span>
            </Link>
          </div>

          <div className="pt-24 grid grid-cols-3 gap-8">
             <div className="space-y-2">
               <div className="text-2xl font-display">Q3 2026</div>
               <div className="text-[8px] font-bold text-brand-black-40 uppercase tracking-widest">Expected Live</div>
             </div>
             <div className="space-y-2">
               <div className="text-2xl font-display">89%</div>
               <div className="text-[8px] font-bold text-brand-black-40 uppercase tracking-widest">Dev Completion</div>
             </div>
             <div className="space-y-2">
               <div className="text-2xl font-display">ALPHA</div>
               <div className="text-[8px] font-bold text-brand-black-40 uppercase tracking-widest">Current Status</div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
