import React from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '@/components/ui/Reveal';

export function JoinAsPartner() {
  return (
    <Reveal>
      <section className="bg-stone-900 text-white my-16 py-0 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">

          {/* Left Side: image */}
          <div className="w-full md:w-1/2 h-[300px] md:h-[450px] relative">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80"
              alt="Restaurant owner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-stone-900 md:hidden" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent md:bg-gradient-to-l" />
          </div>

          {/* Right Side: content */}
          <div className="w-full md:w-1/2 p-8 md:pl-16 lg:py-16 text-center md:text-left">
            <h2 className="text-4xl lg:text-5xl font-outfit text-white tracking-tight mb-4 leading-tight">
              Partner with FoodHub
            </h2>
            <p className="text-lg text-stone-400 font-inter font-medium mb-8 max-w-md mx-auto md:mx-0">
              Join thousands of restaurants who are already boosting their revenue and reaching new customers every day.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-orange-700 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600 shadow-xl"
              >
                Register your restaurant
              </Link>
              <Link
                to="/signin"
                className="inline-flex items-center justify-center rounded-xl border border-stone-600 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-stone-800"
              >
                Login to dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
