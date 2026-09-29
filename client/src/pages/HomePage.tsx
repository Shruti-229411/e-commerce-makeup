import React from 'react';
import { BrandCarousel } from '../components/common/BrandCarousel';
import { HeroPromoSlider } from '../components/home/HeroPromoSlider';
import { TrustBadges } from '../components/home/TrustBadges';
import { ShopByCategory } from '../components/home/ShopByCategory';
import { SpotlightCarousel } from '../components/home/SpotlightCarousel';
import { VideoCarousel } from '../components/home/VideoCarousel';
import { CircularBrandBar } from '../components/home/CircularBrandBar';
import { ShopByConcern } from '../components/home/ShopByConcern';
import { PromoBannerSection } from '../components/home/PromoBannerSection';
import { FeaturedProductsSection } from '../components/home/FeaturedProductsSection';
import { BeautyAdviceSection } from '../components/home/BeautyAdviceSection';
import { SocialProofSection } from '../components/home/SocialProofSection';
import { NewsletterSection } from '../components/home/NewsletterSection';

export const HomePage: React.FC = () => {
  return (
    <div className="homepage-enhanced-view">
      {/* 3. Existing BrandCarousel */}
      <BrandCarousel />

      {/* 4. HeroPromoSlider */}
      <HeroPromoSlider />

      {/* 5. Trust Badges */}
      <TrustBadges />

      {/* 6. Enhanced Shop by Category */}
      <ShopByCategory />

      {/* 7. SpotlightCarousel */}
      <SpotlightCarousel />

      {/* 8. VideoCarousel */}
      <VideoCarousel />

      {/* 9. CircularBrandBar */}
      <CircularBrandBar />

      {/* 10. ShopByConcern */}
      <ShopByConcern />

      {/* 11. PromoBannerSection */}
      <PromoBannerSection />

      {/* 12. Featured & Bestseller Products */}
      <FeaturedProductsSection />

      {/* 13. BeautyAdviceSection */}
      <BeautyAdviceSection />

      {/* 14. SocialProofSection */}
      <SocialProofSection />

      {/* 15. NewsletterSection */}
      <NewsletterSection />
    </div>
  );
};
