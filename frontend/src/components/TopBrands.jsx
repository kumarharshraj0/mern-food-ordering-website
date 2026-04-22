import React from 'react';
import { Reveal } from '@/components/ui/Reveal';

const brands = [
  { id: 1, name: "KFC", img: "https://unavatar.io/twitter/kfc", time: "25 min" },
  { id: 2, name: "Domino's", img: "https://unavatar.io/twitter/dominos", time: "30 min" },
  { id: 3, name: "McDonald's", img: "https://unavatar.io/twitter/McDonalds", time: "20 min" },
  { id: 4, name: "Burger King", img: "https://unavatar.io/twitter/BurgerKing", time: "35 min" },
  { id: 5, name: "Subway", img: "https://unavatar.io/twitter/SUBWAY", time: "15 min" },
  { id: 6, name: "Starbucks", img: "https://unavatar.io/twitter/Starbucks", time: "22 min" },
  { id: 7, name: "Pizza Hut", img: "https://unavatar.io/twitter/pizzahut", time: "40 min" },
  { id: 8, name: "Taco Bell", img: "https://unavatar.io/twitter/tacobell", time: "25 min" }
];

export function TopBrands() {
  return (
    <Reveal>
      <section className="max-w-7xl mx-auto px-4 py-8 relative">
        <h2 className="text-3xl font-outfit text-gray-900 tracking-tight mb-8">Top Brands For You</h2>
        
        <div className="flex gap-6 sm:gap-8 overflow-x-auto pb-6 scrollbar-hide snap-x">
          {brands.map((brand) => (
            <div key={brand.id} className="flex flex-col items-center gap-3 shrink-0 snap-center cursor-pointer group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white shadow-sm border border-stone-200/60 overflow-hidden group-hover:shadow-md group-hover:border-orange-200 transition-all duration-300">
                 <img 
                   src={brand.img} 
                   alt={brand.name}
                   className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                 />
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-800 text-sm">{brand.name}</p>
                <p className="text-xs text-gray-500 font-medium">{brand.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
