import { Link } from 'wouter';
import { Instagram, Smartphone, Globe, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="main-footer" className="bg-brand-white border-t border-black/5 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex flex-col">
              <span className="font-display text-2xl leading-none tracking-tight">THE CAIRO CODE</span>
              <span className="text-brand-amber font-sans text-[9px] font-bold tracking-[0.2em] uppercase leading-none mt-0.5">FASHION INTELLIGENCE</span>
            </Link>
            <p className="text-brand-black-60 text-sm leading-relaxed max-w-xs">
              Egypt's premier curated discovery layer connecting style-conscious buyers to curated local brands.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-brand-black text-brand-white rounded-full hover:bg-brand-red transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-brand-black text-brand-white rounded-full hover:bg-brand-red transition-colors">
                <Smartphone size={18} />
              </a>
              <a href="#" className="p-2 bg-brand-black text-brand-white rounded-full hover:bg-brand-red transition-colors">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Discover */}
          <div className="space-y-6">
            <h4 className="font-display text-lg tracking-wide">Discover</h4>
            <ul className="space-y-3">
              <li><Link href="/brands" className="text-brand-black-60 text-sm hover:text-brand-red transition-colors uppercase font-bold tracking-wider">Brands</Link></li>
              <li><Link href="/products" className="text-brand-black-60 text-sm hover:text-brand-red transition-colors uppercase font-bold tracking-wider">Products</Link></li>
              <li><Link href="/stylist" className="text-brand-black-60 text-sm hover:text-brand-red transition-colors uppercase font-bold tracking-wider">AI Stylist</Link></li>
              <li><Link href="/compare" className="text-brand-black-60 text-sm hover:text-brand-red transition-colors uppercase font-bold tracking-wider">Compare</Link></li>
              <li><Link href="/reviews" className="text-brand-black-60 text-sm hover:text-brand-red transition-colors uppercase font-bold tracking-wider">Reviews</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-6">
            <h4 className="font-display text-lg tracking-wide">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="/community" className="text-brand-black-60 text-sm hover:text-brand-red transition-colors uppercase font-bold tracking-wider">Community Feed</Link></li>
              <li><Link href="/services" className="text-brand-black-60 text-sm hover:text-brand-red transition-colors uppercase font-bold tracking-wider">Services</Link></li>
              <li><Link href="/about" className="text-brand-black-60 text-sm hover:text-brand-red transition-colors uppercase font-bold tracking-wider">About Us</Link></li>
              <li><Link href="/dashboard" className="text-brand-black-60 text-sm hover:text-brand-red transition-colors uppercase font-bold tracking-wider">System Dashboard</Link></li>
              <li><Link href="/submit-brand" className="text-brand-black-60 text-sm hover:text-brand-red transition-colors uppercase font-bold tracking-wider">Submit Brand</Link></li>
              <li><Link href="/orders" className="text-brand-black-60 text-sm hover:text-brand-red transition-colors uppercase font-bold tracking-wider">Order Tracking</Link></li>
            </ul>
          </div>

          {/* For Brands */}
          <div className="space-y-6">
            <h4 className="font-display text-lg tracking-wide">For Brands</h4>
            <ul className="space-y-3">
              <li><Link href="/submit-brand" className="text-brand-black-60 text-sm hover:text-brand-red transition-colors uppercase font-bold tracking-wider">List Your Brand</Link></li>
              <li><Link href="/brand-portal" className="text-brand-black-60 text-sm hover:text-brand-red transition-colors uppercase font-bold tracking-wider">Brand Portal</Link></li>
              <li><Link href="/quality" className="text-brand-black-60 text-sm hover:text-brand-red transition-colors uppercase font-bold tracking-wider">Quality Standards</Link></li>
              <li><Link href="/contact" className="text-brand-black-60 text-sm hover:text-brand-red transition-colors uppercase font-bold tracking-wider">Contact Sales</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-brand-black-40 text-[10px] font-bold uppercase tracking-[0.1em]">
            © 2026 THE CAIRO CODE · UPDATED MAY 2026 · SS26 SEASON LIVE
          </p>
          <div className="flex space-x-6">
            <span className="text-brand-black-40 text-[10px] font-bold uppercase tracking-[0.1em]">Visa</span>
            <span className="text-brand-black-40 text-[10px] font-bold uppercase tracking-[0.1em]">Mastercard</span>
            <span className="text-brand-black-40 text-[10px] font-bold uppercase tracking-[0.1em]">Sympl</span>
            <span className="text-brand-black-40 text-[10px] font-bold uppercase tracking-[0.1em]">ValU</span>
            <span className="text-brand-black-40 text-[10px] font-bold uppercase tracking-[0.1em]">Shahry</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
