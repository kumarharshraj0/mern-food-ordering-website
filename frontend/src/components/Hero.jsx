import React from "react";
import { Link } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2000&q=80"
          alt="Premium food background"
          className="w-full h-full object-cover object-center scale-105 animate-[zoom_20s_ease-in-out_infinite]"
        />
        {/* Elegant Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-stone-900/60 to-stone-900/90" />
      </div>

      {/* Content */}
      <Reveal>
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-20 text-center animate-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-5xl md:text-7xl font-outfit font-bold text-white leading-tight tracking-tight mb-6">
            Discover the best food & drinks <br className="hidden md:block" />
            <span className="text-orange-400 font-medium">in your city</span>
          </h1>

          <p className="text-lg md:text-xl text-stone-300 font-inter mb-12 max-w-2xl mx-auto font-medium">
            Whether you're looking for a quick bite or a gourmet feast, experience lightning-fast delivery from our top-rated partners.
          </p>

          {/* Global Search Bar (Industry Standard) */}
          <div className="max-w-3xl mx-auto bg-white p-1 rounded-full flex flex-col md:flex-row items-center shadow-2xl">

            {/* Location Selector */}
            <div className="flex items-center gap-1 px-4 py-1 md:w-1/3 md:border-r border-stone-200 w-full">
              <MapPin className="w-5 h-5 text-orange-600" />
              <input
                type="text"
                placeholder="Bangalore, India"
                className="w-full outline-none text-stone-700 font-medium bg-transparent focus:ring-0 truncate"
                defaultValue="Bangalore"
              />
            </div>

            {/* Core Search */}
            <div className="flex items-center gap-1 px-4 py-1 w-full flex-1 ">
              <Search className="w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search for restaurant, cuisine or a dish"
                className="w-full outline-none text-stone-700 font-medium bg-transparent focus:ring-0 "
              />
              <Link
                to="/restaurants"
                className="hidden md:flex ml-auto items-center justify-center bg-orange-700 text-white font-bold px-6 py-2 rounded-full hover:bg-orange-800 transition-colors"
              >
                Search
              </Link>
            </div>
          </div>

          {/* Mobile Search Button */}
          <Link
            to="/restaurants"
            className="md:hidden mt-4 inline-flex items-center justify-center w-full max-w-3xl bg-orange-700 text-white font-bold px-6 py-4 rounded-full shadow-lg"
          >
            Search Now
          </Link>
        </div>
      </Reveal>

      <style>{`
        @keyframes zoom {
            0% { transform: scale(1.05); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1.05); }
        }
      `}</style>
    </section>
  );
}
