import { Features } from '@/components/Features';
import { Hero } from '@/components/Hero';
import { RestaurantsSection } from '@/components/resturant-section';
import { CityRestaurantsSection } from '@/components/CityRestaurantsSection';
import { CategoryScroll } from '@/components/CategoryScroll';
import { AppDownload } from '@/components/AppDownload';
import { Newsletter } from '@/components/Newsletter';
import { FAQ } from '@/components/FAQ';
import { TestimonialsSection } from '@/components/Testimonials';
import React from 'react';

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <CategoryScroll />
      <CityRestaurantsSection />
      <RestaurantsSection />
      <Features />
      <AppDownload />
      <TestimonialsSection />
      <FAQ />
      <Newsletter />
    </div>
  );
}

export default Home;

