import React from "react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=80"
          srcSet="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=75 600w,
                  https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1200&q=80 1200w,
                  https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=80 1600w"
          sizes="100vw"
          alt="Delicious food delivery"
          className="h-full w-full object-cover scale-105 animate-[zoom_20s_ease-in-out_infinite]"
          loading="eager"
          fetchpriority="high"
          width="1600"
          height="900"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-orange-500/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="max-w-xl animate-fadeIn">
            {/* Badge */}
            <span className="mb-4 inline-block rounded-full bg-orange-500/20 px-4 py-2 text-sm font-semibold text-orange-400">
              🎉 Free delivery on orders over $30
            </span>

            {/* Heading */}
            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
              Artisanal cuisine <br /> delivered to your door
            </h1>

            {/* Description */}
            <p className="mb-8 text-lg leading-relaxed text-white/90">
              Experience restaurant-quality meals crafted by expert chefs,
              delivered fresh to your home in under 30 minutes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/menu"
                className="rounded-lg bg-orange-500 px-8 py-3 text-base font-semibold text-white transition hover:bg-orange-600 inline-block text-center"
              >
                Explore Menu
              </Link>
              <Link
                to="/restaurants"
                className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-8 py-3 text-base font-semibold text-white transition hover:bg-orange-500/20 inline-block text-center"
              >
                View Restaurants
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 flex flex-wrap gap-10">
              <div>
                <p className="text-2xl font-bold text-orange-400">500+</p>
                <p className="text-sm text-white/70">Restaurants</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-400">10k+</p>
                <p className="text-sm text-white/70">Happy Customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-400">4.8★</p>
                <p className="text-sm text-white/70">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>
        {`
          @keyframes zoom {
            0% { transform: scale(1.05); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1.05); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 1s ease-out both;
          }
        `}
      </style>
    </section>
  );
}
