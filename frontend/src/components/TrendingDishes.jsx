import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const dishes = [
  { id: 1, name: "Spicy Tuna Roll", price: "₹550", img: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=500&q=80", restaurant: "Neon Sushi" },
  { id: 2, name: "Butter Chicken", price: "₹450", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=500&q=80", restaurant: "Spice Symphony" },
  { id: 3, name: "Chocolate Lava Cake", price: "₹250", img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=80", restaurant: "Sweet Cravings" },
  { id: 4, name: "Classic Cheeseburger", price: "₹350", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80", restaurant: "Burger Joint" },
  { id: 5, name: "Hakka Noodles", price: "₹200", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80", restaurant: "Dragon Wok" },
  { id: 6, name: "Margherita Pizza", price: "₹399", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80", restaurant: "Italiano Gusto" }
];

export function TrendingDishes() {
  return (
    <Reveal>
      <section className="bg-transparent py-12 mt-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-outfit text-gray-900 tracking-tight">Trending Near You</h2>
              <p className="text-gray-500 font-medium mt-1">Most ordered dishes in your city right now</p>
            </div>
            <Link to="/menu" className="hidden sm:inline-block text-orange-600 font-bold hover:text-orange-700">
              View All Menu
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishes.map((dish) => (
              <div key={dish.id} className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-sm flex gap-4 hover:shadow-md transition-shadow group">
                <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0 relative shadow-inner">
                  <img 
                    src={dish.img}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <h3 className="font-outfit font-bold text-gray-900 text-lg leading-tight group-hover:text-orange-700 transition-colors">{dish.name}</h3>
                  <p className="text-sm font-medium text-gray-500 mt-1">{dish.restaurant}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-semibold text-orange-700 text-lg">{dish.price}</span>
                    <Link 
                      to="/menu"
                      className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 hover:bg-orange-500 hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4 text-inherit" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center sm:hidden">
            <Link to="/menu" className="inline-block px-6 py-3 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-bold w-full">
              View All Trending Dishes
            </Link>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
