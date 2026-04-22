import { Features } from '@/components/Features';
import { Hero } from '@/components/Hero';
import { PromoCarousel } from '@/components/PromoCarousel';
import { TopBrands } from '@/components/TopBrands';
import { TrendingDishes } from '@/components/TrendingDishes';
import { RestaurantsSection } from '@/components/resturant-section';
import { CityRestaurantsSection } from '@/components/CityRestaurantsSection';
import { CategoryScroll } from '@/components/CategoryScroll';
import { HowItWorks } from '@/components/HowItWorks';
import { Newsletter } from '@/components/Newsletter';
import { FAQ } from '@/components/FAQ';
import { TestimonialsSection } from '@/components/Testimonials';
import { Collections } from '@/components/Collections';
import { JoinAsPartner } from '@/components/JoinAsPartner';
import React from 'react';

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <PromoCarousel />
      <TopBrands />
      <Collections />
      <TrendingDishes />
      <CityRestaurantsSection />
      <RestaurantsSection />
      <Features />
      <JoinAsPartner />
      <HowItWorks />
      <TestimonialsSection />
      <FAQ />
      <Newsletter />
    </div>
  );
}

export default Home;

