import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Bell, AlertCircle, ExternalLink } from 'lucide-react';
import { Brand, BrandTier, Product } from '../types';
import { TIER_COLORS } from '../constants';

export default function Products() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  const getBrandDetails = (brandId: number) => {
    return brands.find(b => b.id === brandId);
  };

  return (
    <div id="products-page" className="min-h-screen bg-brand-white py-24">
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="space-y-4">
            <span className="text-brand-red text-[11px] font-bold tracking-[0.2em] uppercase">Curated Catalog</span>
            <h1 className="text-5xl md:text-7xl">LATEST DROPS</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             <div className="relative flex-grow">
               <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black-40" />
               <input 
                type="text" 
                placeholder="Search products..."
                className="w-full md:w-72 bg-brand-white-95 border-none p-4 pl-12 rounded-lg font-bold text-sm outline-none focus:ring-1 focus:ring-brand-red"
               />
             </div>
             <select className="bg-brand-white-95 border-none p-4 rounded-lg font-bold text-sm">
               <option>All Tiers</option>
               {Object.values(BrandTier).map(t => <option key={t}>{t}</option>)}
             </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-[3/4] bg-brand-white-95 animate-pulse rounded-lg" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => {
              const brand = getBrandDetails(product.brandId);
              if (!brand) return null;
              
              return (
              <div key={product.id} className="group cursor-pointer" onClick={() => product.url && window.open(product.url, '_blank', 'noopener,noreferrer')}>
                <div className="relative aspect-[3/4] bg-brand-black-90 rounded-lg overflow-hidden mb-4">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  <div className="absolute top-3 left-3">
                    <span 
                      className="tier-badge"
                      style={{ backgroundColor: TIER_COLORS[brand.tier] }}
                    >
                      {brand.tier}
                    </span>
                  </div>

                  {!product.inStock && (
                    <div className="absolute inset-0 bg-brand-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
                      <div className="bg-brand-white px-4 py-2 rounded flex items-center space-x-2">
                        <AlertCircle size={14} className="text-brand-red" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-black">Sold Out</span>
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-brand-white/95 backdrop-blur-sm">
                    {product.inStock ? (
                      <button className="w-full btn-primary !h-10 !text-[9px] flex items-center justify-center space-x-2">
                        <ShoppingBag size={14} />
                        <span>Buy on Website</span>
                        <ExternalLink size={12} className="ml-1" />
                      </button>
                    ) : (
                      <button className="w-full btn-outline !border-brand-black !h-10 !text-[9px] flex items-center justify-center space-x-2">
                        <Bell size={14} />
                        <span>Notify Me</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[9px] font-bold text-brand-black-40 uppercase tracking-widest">{brand.name}</div>
                  <h3 className="font-bold text-sm leading-tight group-hover:text-brand-red transition-colors flex items-center justify-between">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                     <span className="text-brand-red font-bold text-xs">{product.price} EGP</span>
                     {product.originalPrice && (
                       <span className="text-[10px] text-brand-black-40 line-through">{product.originalPrice} EGP</span>
                     )}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
