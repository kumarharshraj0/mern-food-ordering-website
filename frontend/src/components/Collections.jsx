import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const collections = [
  {
    id: 1,
    title: "Newly Opened",
    places: "12 Places",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Trending This Week",
    places: "30 Places",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Best Rooftop Cafes",
    places: "8 Places",
    image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "Romantic Dining",
    places: "15 Places",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
  }
];

export function Collections() {
  return (
    <Reveal>
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-outfit text-gray-900 tracking-tight">Collections</h2>
            <p className="text-gray-500 font-medium mt-2 text-lg font-inter max-w-2xl">
              Explore curated lists of top restaurants, cafes, pubs, and bars in your city, based on trends.
            </p>
          </div>
          <Link to="/restaurants" className="flex items-center text-orange-700 font-semibold hover:text-orange-800 shrink-0">
            All collections in your city <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {collections.map((item) => (
            <Link 
              to="/restaurants" 
              key={item.id} 
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              {/* Dark Gradient bottom to top */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-5 text-white">
                <h3 className="text-xl font-outfit tracking-tight mb-1">{item.title}</h3>
                <div className="flex items-center text-sm font-inter text-stone-300">
                  {item.places} <ChevronRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
