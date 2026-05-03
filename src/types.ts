export enum BrandTier {
  BESPOKE = 'Bespoke',
  ELITE = 'Elite',
  PREMIUM = 'Premium',
  STREETWEAR = 'Streetwear',
  SPORT = 'Sport',
  BUDGET = 'Budget',
  THRIFT = 'Thrift',
  ECOMMERCE = 'E-commerce'
}

export enum Gender {
  MEN = 'Men',
  WOMEN = 'Women',
  UNISEX = 'Unisex'
}

export enum StyleVibe {
  MINIMALIST = 'Minimalist',
  STREETWEAR = 'Streetwear',
  LUXURY = 'Luxury',
  CASUAL = 'Casual',
  FORMAL = 'Formal',
  BOHEMIAN = 'Bohemian',
  SPORTY = 'Sporty',
  VINTAGE = 'Vintage',
  PREPPY = 'Preppy',
  EDGY = 'Edgy'
}

export interface Brand {
  id: number;
  name: string;
  handle: string;
  tier: BrandTier;
  genders: Gender[];
  vibes: StyleVibe[];
  minPrice: number;
  maxPrice: number;
  ig: string;
  whatsapp: string;
  websiteUrl?: string;
  desc: string;
  rating: number;
  reviewCount: number;
  sizes: string[];
  installment: boolean;
  installmentProviders: string[];
  img: string;
  qualityScore: number;
  shippingRating: number;
  onAmazon: boolean;
  onNoon: boolean;
  onJumia: boolean;
  hasOfflineStore: boolean;
  featured: boolean;
}

export interface Product {
  id: number;
  brandId: number;
  name: string;
  price: number;
  originalPrice?: number;
  img: string;
  inStock: boolean;
  url?: string;
}

export interface Review {
  id: number;
  userId: number;
  brandId: number;
  productName: string;
  rating: number;
  reviewText: string;
  shippingProvider: string;
  shippingRating: number;
  bestThing1: string;
  bestThing2: string;
  worstThing1: string;
  worstThing2: string;
  experienceType: 'good' | 'bad' | 'neutral';
  createdAt: string;
}

export interface FeedItem {
  id: number;
  type: 'trend' | 'drop' | 'insight' | 'report' | 'alert';
  title: string;
  content: string;
  brandId?: number;
  brandName?: string;
  tags: string[];
  createdAt: string;
}
