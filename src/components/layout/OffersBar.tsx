import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const OFFERS = [
  "5% OFF YOUR FIRST ORDER — USE CODE CAIRO5",
  "FREE SHIPPING ON ALL SS26 COLLECTIONS THIS WEEK",
  "NEW CURATED BRANDS ADDED — EXPLORE THE ELITE TIER",
  "SHOP NOW, PAY LATER WITH SYMPL, VALU, OR SHAHRY"
];

export default function OffersBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % OFFERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="offers-bar" className="bg-brand-red text-brand-white h-8 flex items-center overflow-hidden relative z-50">
      <div className="container mx-auto px-4 md:px-12 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-[10px] md:text-[11px] font-bold tracking-[0.15em] uppercase"
          >
            {OFFERS[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
