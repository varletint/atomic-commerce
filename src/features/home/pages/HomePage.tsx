import { SEO } from '@/components/SEO';
import { HeroSection } from '../components/HeroSection';
import { TrustStrip } from '../components/TrustStrip';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { CollectionSpotlight } from '../components/CollectionSpotlight';
import { CategoryBrowser } from '../components/CategoryBrowser';
import { NewsletterSection } from '../components/NewsletterSection';

export function HomePage() {
  return (
    <>
      <SEO
        title="Atomic Order — Engineered for the Bold"
        description="Premium curated products designed with precision. Shop electronics, accessories, and apparel."
      />
      <HeroSection />
      <TrustStrip />
      <FeaturedProducts />
      <CollectionSpotlight />
      <CategoryBrowser />
      <NewsletterSection />
    </>
  );
}
