import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const promos = [
  {
    id: 1,
    title: "50% OFF",
    subtitle: "Up to ₹100 on your first order",
    code: "WELCOME50",
    bgClass: "from-orange-500 to-rose-500",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    title: "Buy 1 Get 1 Free",
    subtitle: "On all premium pizzas today",
    code: "BOGOPIZZA",
    bgClass: "from-blue-600 to-indigo-600",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    title: "Free Delivery",
    subtitle: "On orders above ₹500",
    code: "FREEDEL",
    bgClass: "from-emerald-500 to-teal-500",
    image: "https://images.unsplash.com/photo-1544025162-811c7b80a4ba?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 4,
    title: "Flat ₹150 OFF",
    subtitle: "On weekend mega feasts",
    code: "WEEKEND150",
    bgClass: "from-purple-600 to-pink-600",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80"
  }
];

export function PromoCarousel() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Reveal>
      <div className="max-w-7xl mx-auto px-4 py-8 mt-10 relative">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-outfit text-gray-900 tracking-tight">Best Offers For You</h2>
          <p className="text-gray-500 font-medium mt-1 font-inter">Grab the best deals before they expire</p>
        </div>
        <div className="hidden sm:flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white shadow-md border border-gray-100 hover:bg-gray-50 transition active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white shadow-md border border-gray-100 hover:bg-gray-50 transition active:scale-95"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {promos.map((promo) => (
          <div 
            key={promo.id} 
            className={`min-w-[320px] md:min-w-[400px] h-[200px] rounded-2xl shrink-0 snap-start relative overflow-hidden bg-gradient-to-br ${promo.bgClass} shadow-sm border border-stone-200/50 cursor-pointer group`}
          >
            {/* Background Pattern / Image */}
            <div className="absolute inset-0 right-0 w-1/2 ml-auto h-full opacity-40 mix-blend-overlay group-hover:scale-110 transition-transform duration-700">
               <img src={promo.image} alt="Promo" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
            </div>

            <div className="absolute inset-x-0 bottom-0 top-0 w-3/4 p-6 z-10 flex flex-col justify-center text-white bg-gradient-to-r from-black/20 to-transparent">
              <span className="text-4xl font-outfit tracking-tight drop-shadow-md">
                {promo.title}
              </span>
              <span className="text-sm font-medium opacity-90 mt-2 mb-4 font-inter line-clamp-1">
                {promo.subtitle}
              </span>
              
              <div className="bg-white/20 backdrop-blur-md border border-white/40 border-dashed rounded-xl px-4 py-2 w-max shadow-sm hover:bg-white hover:text-gray-900 transition-colors flex items-center gap-2">
                 <Tag className="w-4 h-4" />
                 <span className="font-bold tracking-widest text-sm">{promo.code}</span>
              </div>
            </div>
            
            {/* Decorative shapes */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black opacity-20 rounded-full blur-2xl"></div>
          </div>
        ))}
      </div>
    </div>
    </Reveal>
  );
}
