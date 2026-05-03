import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Star, ShieldCheck, Instagram, ChevronRight, X, Heart, MessageCircle, TrendingUp, ExternalLink, ShoppingBag } from 'lucide-react';
import { Brand, BrandTier, StyleVibe, Gender, Product } from '../types';
import { TIERS, VIBES, GENDERS, TIER_COLORS } from '../constants';

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTiers, setSelectedTiers] = useState<BrandTier[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<StyleVibe[]>([]);
  const [selectedGender, setSelectedGender] = useState<Gender | 'All'>('All');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/brands').then(res => res.json()),
      fetch('/api/products').then(res => res.json())
    ]).then(([brandsData, productsData]) => {
      setBrands(brandsData);
      setProducts(productsData);
      setLoading(false);
    });
  }, []);

  const filteredBrands = brands.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchesTier = selectedTiers.length === 0 || selectedTiers.includes(b.tier);
    const matchesVibe = selectedVibes.length === 0 || b.vibes.some(v => selectedVibes.includes(v));
    const matchesGender = selectedGender === 'All' || b.genders.includes(selectedGender as Gender);
    return matchesSearch && matchesTier && matchesVibe && matchesGender;
  });

  const toggleTier = (tier: BrandTier) => {
    setSelectedTiers(prev => prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]);
  };

  const toggleVibe = (vibe: StyleVibe) => {
    setSelectedVibes(prev => prev.includes(vibe) ? prev.filter(v => v !== vibe) : [...prev, vibe]);
  };

  const selectedBrandProducts = products.filter(p => p.brandId === selectedBrand?.id);

  return (
    <div id="brands-page" className="min-h-screen bg-brand-white">
      <div className="container mx-auto px-4 md:px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl">Discover</h3>
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black-40" />
                  <input 
                    type="text" 
                    placeholder="Search brands..."
                    className="w-full bg-brand-white-95 border-none p-4 pl-12 rounded-lg font-bold text-sm focus:ring-1 focus:ring-brand-red outline-none transition-shadow"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-bold text-brand-black-40 uppercase tracking-[0.2em]">Gender</label>
                <div className="flex flex-wrap gap-2">
                  {['All', ...GENDERS].map(g => (
                    <button 
                      key={g}
                      onClick={() => setSelectedGender(g as any)}
                      className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border ${selectedGender === g ? 'bg-brand-black text-brand-white border-brand-black' : 'bg-transparent text-brand-black-60 border-black/10 hover:border-black/30'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-bold text-brand-black-40 uppercase tracking-[0.2em]">Tiers</label>
                <div className="flex flex-col space-y-2">
                  {TIERS.map(t => (
                    <button 
                      key={t}
                      onClick={() => toggleTier(t)}
                      className="flex items-center space-x-3 group"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedTiers.includes(t) ? 'bg-brand-red border-brand-red' : 'border-black/20 group-hover:border-black/40'}`}>
                        {selectedTiers.includes(t) && <div className="w-1.5 h-1.5 bg-brand-white rounded-full" />}
                      </div>
                      <span className={`text-[12px] font-bold uppercase tracking-wider ${selectedTiers.includes(t) ? 'text-brand-black' : 'text-brand-black-60'}`}>{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-bold text-brand-black-40 uppercase tracking-[0.2em]">Style Vibe</label>
                <div className="flex flex-wrap gap-2">
                  {VIBES.map(v => (
                    <button 
                      key={v}
                      onClick={() => toggleVibe(v)}
                      className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${selectedVibes.includes(v) ? 'bg-brand-red text-brand-white' : 'bg-brand-white-95 text-brand-black-60 hover:bg-brand-white-90'}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            <div className="flex justify-between items-center mb-8">
              <span className="text-[11px] font-bold text-brand-black-60 uppercase tracking-[0.15em]">{filteredBrands.length} Results Found</span>
              <div className="flex items-center space-x-4">
                <Filter size={16} className="text-brand-black-60" />
                <select className="bg-transparent border-none font-bold text-[11px] uppercase tracking-wider focus:ring-0 outline-none">
                  <option>Featured</option>
                  <option>Rating</option>
                  <option>Price: Low-High</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-brand-white-95 animate-pulse rounded-lg aspect-[4/5]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredBrands.map(brand => (
                  <motion.div 
                    layout
                    key={brand.id} 
                    className="card-brand group"
                    onClick={() => setSelectedBrand(brand)}
                  >
                    <div className="relative aspect-[400/280] overflow-hidden bg-brand-black-90">
                      {brand.img ? (
                        <img src={brand.img} alt={brand.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center p-8 text-center"
                          style={{ backgroundColor: TIER_COLORS[brand.tier] }}
                        >
                          <span className="font-display text-4xl text-brand-white">{brand.name}</span>
                        </div>
                      )}
                      
                      <div className="absolute top-4 left-4">
                        <span 
                          className="tier-badge"
                          style={{ 
                            backgroundColor: TIER_COLORS[brand.tier],
                            color: brand.tier === BrandTier.BESPOKE ? '#F0C84A' : '#FFFFFF'
                          }}
                        >
                          {brand.tier}
                        </span>
                      </div>
                      
                      <div className="absolute top-4 right-4 flex space-y-2 flex-col translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="bg-brand-white text-brand-black p-2 rounded-full shadow-lg hover:text-brand-red">
                          <Heart size={16} />
                        </button>
                        <button className="bg-brand-white text-brand-black p-2 rounded-full shadow-lg hover:text-brand-red">
                          <TrendingUp size={16} />
                        </button>
                      </div>

                      {brand.installment && (
                        <div className="absolute bottom-0 left-0 right-0 bg-brand-red/90 py-1 px-4">
                          <span className="text-[8px] font-bold text-brand-white uppercase tracking-widest text-center block">INSTALLMENTS AVAILABLE</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-display mb-1">{brand.name}</h4>
                          <div className="flex items-center space-x-1 text-yellow-500">
                            <Star size={10} fill="currentColor" />
                            <span className="text-[10px] font-bold text-brand-black/60">{brand.rating} ({brand.reviewCount})</span>
                          </div>
                        </div>
                        <span className="text-brand-red font-bold text-xs">{brand.minPrice}–{brand.maxPrice} EGP</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {brand.vibes.map(v => (
                          <span key={v} className="text-[9px] font-bold text-brand-black-40 bg-brand-white-95 px-2 py-0.5 rounded uppercase tracking-wider">{v}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-black/5">
                         <div className="flex items-center space-x-2">
                           <ShieldCheck size={14} className="text-brand-amber" />
                           <span className="text-[9px] font-bold text-brand-black-60 uppercase tracking-widest">Quality Verified</span>
                         </div>
                         <button className="text-brand-red font-bold text-[10px] uppercase tracking-[0.2em] flex items-center group-hover:translate-x-1 transition-transform">
                           View <ChevronRight size={14} />
                         </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Brand Modal */}
      {selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-brand-black/80 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-brand-white w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl relative"
          >
            <button 
              onClick={() => setSelectedBrand(null)}
              className="absolute top-4 right-4 p-2 text-brand-black hover:text-brand-red z-10"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto">
              <div className="w-full md:w-2/5 aspect-auto bg-brand-black-90">
                <img src={selectedBrand.img} alt={selectedBrand.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="w-full md:w-3/5 p-8 md:p-12 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span 
                      className="tier-badge"
                      style={{ 
                        backgroundColor: TIER_COLORS[selectedBrand.tier],
                        color: selectedBrand.tier === BrandTier.BESPOKE ? '#F0C84A' : '#FFFFFF'
                      }}
                    >
                      {selectedBrand.tier}
                    </span>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-[12px] font-bold text-brand-black/60">{selectedBrand.rating} ({selectedBrand.reviewCount} Reviews)</span>
                    </div>
                  </div>
                  <h2 className="text-5xl md:text-6xl">{selectedBrand.name}</h2>
                  <p className="text-brand-black-60 leading-relaxed font-sans">{selectedBrand.desc}</p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-black-40 uppercase tracking-widest">Price Range</label>
                    <p className="font-bold text-brand-red">{selectedBrand.minPrice} – {selectedBrand.maxPrice} EGP</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-black-40 uppercase tracking-widest">Sizes</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedBrand.sizes.map(s => <span key={s} className="px-2 py-1 bg-brand-white-95 font-bold text-[10px] rounded">{s}</span>)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-brand-black-40 uppercase tracking-widest">Quality Scorecard</label>
                  <div className="bg-brand-white-95 rounded-xl p-6 flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-display mb-1">{selectedBrand.qualityScore}/100</div>
                      <div className="text-[9px] font-bold text-brand-black-40 uppercase tracking-widest">Elite Verified Standards</div>
                    </div>
                    <div className="flex items-center space-x-4">
                       <div className="text-right">
                          <div className="text-sm font-bold">{selectedBrand.shippingRating} Days</div>
                          <div className="text-[8px] text-brand-black-40 uppercase font-bold tracking-tighter">Avg. Delivery</div>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-8">
                  <button 
                    onClick={() => selectedBrand.websiteUrl ? window.open(selectedBrand.websiteUrl, '_blank') : window.open(selectedBrand.ig, '_blank')}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2 h-14 uppercase"
                  >
                    {selectedBrand.websiteUrl ? (
                      <>
                        <ExternalLink size={18} />
                        <span>Visit Website</span>
                      </>
                    ) : (
                      <>
                        <Instagram size={18} />
                        <span>Shop on Instagram</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => window.open(`https://wa.me/${selectedBrand.whatsapp}`, '_blank')}
                    className="flex-1 btn-outline flex items-center justify-center space-x-2 h-14 uppercase border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                  >
                    <MessageCircle size={18} />
                    <span>WhatsApp</span>
                  </button>
                </div>

                {selectedBrandProducts.length > 0 && (
                  <div className="pt-12 border-t border-black/10">
                    <h3 className="text-2xl font-display mb-6">Latest from {selectedBrand.name}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedBrandProducts.map(product => (
                        <div 
                          key={product.id} 
                          className="group cursor-pointer border border-black/5 rounded-lg overflow-hidden bg-brand-white-95"
                          onClick={() => product.url && window.open(product.url, '_blank')}
                        >
                          <div className="aspect-square bg-brand-black-90 relative">
                            <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            {!product.inStock && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider">Sold Out</span>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold text-sm mb-1 truncate">{product.name}</h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-brand-red font-bold text-xs">{product.price} EGP</span>
                              {product.originalPrice && <span className="text-[10px] text-brand-black-40 line-through">{product.originalPrice} EGP</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
