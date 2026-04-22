import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RestaurantCard } from "./RestaurantCard";
import api from "../lib/api";
import { Reveal } from "@/components/ui/Reveal";

export function RestaurantsSection() {
  const navigate = useNavigate();
  const [popularRestaurants, setPopularRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setLoading(true);
        // Use api instead of fetch, and slightly lower rating threshold for visibility
        const res = await api.get("/restaurants", {
          params: { rating: 4.0, limit: 6 }
        });
        setPopularRestaurants(res.data.restaurants || []);
      } catch (err) {
        console.error("Failed to fetch popular restaurants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  return (
    <Reveal>
      <section className="bg-orange-50 py-16 px-4 font-inter">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-orange-500 md:text-4xl">
              Popular Restaurants
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Discover our curated selection of top-rated restaurants delivering
              delicious meals right to your doorstep
            </p>
          </div>

          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-80 bg-white rounded-xl shadow p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))
            ) : popularRestaurants.length === 0 ? (
              <div className="col-span-full text-center py-10 text-gray-500">
                No popular restaurants found at the moment.
              </div>
            ) : (
              popularRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant._id}
                  restaurant={restaurant}
                  onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                />
              ))
            )}
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <Link
              to="/restaurants"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-700 px-8 py-4 text-sm font-bold text-white transition hover:bg-orange-800 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-orange-900/10"
            >
              View All Restaurants
            </Link>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
