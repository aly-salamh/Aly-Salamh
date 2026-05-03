import { BrandTier, Gender, StyleVibe } from './types';

export const TIER_COLORS: Record<BrandTier, string> = {
  [BrandTier.BESPOKE]: '#000000',
  [BrandTier.ELITE]: '#1a1a2e',
  [BrandTier.PREMIUM]: '#2d1b69',
  [BrandTier.STREETWEAR]: '#1a1a1a',
  [BrandTier.SPORT]: '#0d2137',
  [BrandTier.BUDGET]: '#1b4332',
  [BrandTier.THRIFT]: '#2c3e50',
  [BrandTier.ECOMMERCE]: '#1a1a1a'
};

export const GENDERS = [Gender.MEN, Gender.WOMEN, Gender.UNISEX];
export const VIBES = Object.values(StyleVibe);
export const TIERS = Object.values(BrandTier);
