import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ArrowLeft, ArrowRight, Loader2, Star, Sparkles } from 'lucide-react';
import { getStylistRecommendation } from '../services/geminiService';
import { Brand } from '../types';

const STEPS = [
  { id: 1, title: 'Gender', question: "What's your gender?", options: ['Men', 'Women', 'Unisex'] },
  { id: 2, title: 'Occasion', question: "What's the occasion?", options: ['Daily', 'Work', 'Event', 'Sport', 'Travel'] },
  { id: 3, title: 'Season', question: "What season are you shopping for?", options: ['SS26 (Spring/Summer)', 'AW26 (Autumn/Winter)'] },
  { id: 4, title: 'Vibe', question: "What's your style vibe?", options: ['Minimalist', 'Streetwear', 'Luxury', 'Casual', 'Formal', 'Bohemian', 'Sporty', 'Preppy'] },
  { id: 5, title: 'Budget', question: "What's your budget per outfit?", options: ['Under 500 EGP', '500–1500 EGP', '1500–3000 EGP', '3000–6000 EGP', '6000+ EGP'] },
  { id: 6, title: 'Body Type', question: "What's your body type?", options: ['Slim', 'Athletic', 'Regular', 'Broad', 'Plus Size'] }
];

export default function Stylist() {
  const [step, setStep] = useState(0); // 0 is intro
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    fetch('/api/brands')
      .then(res => res.json())
      .then(data => setBrands(data));
  }, []);

  const handleAnswer = (answer: string) => {
    const nextAnswers = { ...answers, [STEPS[step - 1].id]: answer };
    setAnswers(nextAnswers);
    if (step < STEPS.length) {
      setStep(step + 1);
    } else {
      generateResult(nextAnswers);
    }
  };

  const generateResult = async (currentAnswers: any) => {
    setLoading(true);
    try {
      const data = await getStylistRecommendation(currentAnswers, brands);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-brand-black text-brand-white py-24 px-4 overflow-x-hidden">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <span className="text-brand-gold text-[11px] font-bold tracking-[0.2em] uppercase">Stylist Recommendations</span>
              <h1 className="text-6xl text-brand-gold flex items-center justify-center gap-4">
                <Sparkles /> YOUR CAIRO LOOK <Sparkles />
              </h1>
            </div>

            <div className="bg-brand-black-90 border border-brand-gold/20 p-8 md:p-12 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl rounded-full translate-x-12 -translate-y-12" />
              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xl text-brand-gold tracking-widest font-display">Notes from your Stylist</h3>
                  <p className="text-lg leading-relaxed text-brand-white/80">{result.stylistNoteEn}</p>
                  <p className="text-lg leading-relaxed text-brand-white/60 font-sans" dir="rtl">{result.stylistNoteAr}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-brand-gold/10">
                  <div className="space-y-6">
                    <h3 className="text-xl text-brand-gold tracking-widest font-display">Outfit Breakdown</h3>
                    <ul className="space-y-4">
                      {Object.entries(result.outfitBreakdown).map(([key, val]: [string, any]) => (
                        <li key={key} className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-[10px] font-bold text-brand-white/40 uppercase tracking-widest">{key}</span>
                          <span className="font-bold text-sm">{val}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl text-brand-gold tracking-widest font-display">Matched Brands</h3>
                    <div className="space-y-4">
                      {result.matchedBrands.map((brand: any) => (
                        <div key={brand.name} className="bg-white/5 p-4 rounded-lg flex justify-between items-center group cursor-pointer hover:bg-white/10 transition-colors">
                          <div>
                            <div className="text-brand-gold font-bold">{brand.name}</div>
                            <div className="text-[9px] text-white/40 uppercase tracking-widest">{brand.tier}</div>
                          </div>
                          <ArrowRight size={16} className="text-brand-gold transition-transform group-hover:translate-x-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-12">
              <button 
                onClick={() => { setResult(null); setStep(0); setAnswers({}); }}
                className="btn-outline !text-brand-gold !border-brand-gold/30 hover:!bg-brand-gold hover:!text-brand-black h-14 !px-12"
              >
                START NEW STYLING SESSION
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black text-brand-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[50vw] h-[50vw] bg-brand-red/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-1/4 w-[50vw] h-[50vw] bg-brand-gold/5 blur-[120px] rounded-full" />
      </div>

      <div className="container max-w-xl relative z-10">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div 
              key="intro"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-center space-y-12"
            >
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl !bg-clip-text text-transparent bg-linear-to-br from-[#F0C84A] to-[#C9A63A] bg-brand-gold">
                  YOUR PERSONAL CAIRO STYLIST
                </h1>
                <p className="text-brand-white/60 text-lg">Answer 6 questions. Get your perfect Cairo brand match.</p>
              </div>
              <button 
                onClick={() => setStep(1)}
                className="btn-gold h-16 w-full text-lg !rounded-full shadow-[0_0_30px_rgba(240,200,74,0.2)]"
              >
                START STYLING
              </button>
            </motion.div>
          ) : loading ? (
            <motion.div 
               key="loading"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="text-center space-y-8"
            >
              <Loader2 className="w-16 h-16 text-brand-gold animate-spin mx-auto" />
              <p className="text-brand-gold font-display text-2xl tracking-[0.2em]">Your Cairo Stylist is thinking...</p>
            </motion.div>
          ) : (
            <motion.div 
              key={step}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="space-y-12 w-full"
            >
              <div className="space-y-2">
                <div className="h-1 bg-white/10 w-full rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-gold transition-all duration-500" 
                    style={{ width: `${(step / STEPS.length) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] font-bold text-brand-white/40 uppercase tracking-widest">Step {step} of {STEPS.length}</span>
                  <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">{STEPS[step - 1].title}</span>
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-3xl md:text-5xl">{STEPS[step - 1].question}</h2>
                <div className="grid grid-cols-1 gap-3">
                  {STEPS[step - 1].options.map((option) => (
                    <button 
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className="w-full p-6 text-left bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-brand-gold/30 transition-all font-bold group"
                    >
                      <div className="flex justify-between items-center">
                        <span>{option}</span>
                        <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-brand-gold" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setStep(step - 1)}
                className="text-brand-white/40 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:text-brand-white transition-colors"
              >
                <ArrowLeft size={14} /> Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
