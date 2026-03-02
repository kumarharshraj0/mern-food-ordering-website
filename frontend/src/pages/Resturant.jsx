import { useEffect, useState } from "react";
import { Star, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRestaurant } from "@/context/RestaurantContext";
import { RestaurantCard } from "@/components/RestaurantCard";
import useDebounce from "@/hooks/useDebounce";

/* -------------------------------
   Cuisine & City Filters
-------------------------------- */
const cuisines = ["Italian", "Chinese", "Indian", "Japanese", "Desserts", "Beverages"];
const cities = ["Lucknow", "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Pune"];

/* -------------------------------
   Skeleton Card
-------------------------------- */
const RestaurantSkeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl p-4 shadow">
    <div className="h-40 bg-gray-300 rounded-xl mb-4" />
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-300 rounded w-1/2" />
  </div>
);

export default function RestaurantPage() {
  const navigate = useNavigate();
  const { restaurants, loading, getRestaurants } = useRestaurant();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);

  /* -------------------------------
     Fetch Restaurants (Backend)
  -------------------------------- */
  useEffect(() => {
    getRestaurants({
      q: debouncedSearch || undefined,
      cuisine: selectedCuisines.join(",") || undefined,
      city: selectedCities.join(",") || undefined,
      page: 1,
      limit: 12
    });
  }, [debouncedSearch, selectedCuisines, selectedCities]);

  /* -------------------------------
     Toggle Filters
  -------------------------------- */
  const toggleCuisine = (cuisine) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );
  };

  const toggleCity = (city) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCuisines([]);
    setSelectedCities([]);
  };

  return (
    <div className="min-h-screen bg-orange-50 pt-24 pb-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* ================= FILTER SIDEBAR ================= */}
        <aside className="lg:w-64 bg-white p-5 rounded-xl shadow sticky top-24 h-max">

          {/* City Filter */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-orange-600">
              Filter by City
            </h2>
            <ul className="flex flex-col gap-3">
              {cities.map((city) => (
                <li key={city}>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCities.includes(city)}
                      onChange={() => toggleCity(city)}
                      className="accent-orange-600 w-4 h-4 cursor-pointer"
                    />
                    <span className={`font-medium transition-colors ${selectedCities.includes(city) ? "text-orange-700" : "text-gray-700 group-hover:text-orange-500"}`}>
                      {city}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Cuisine Filter */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-orange-600">
              Filter by Cuisine
            </h2>
            <ul className="flex flex-col gap-3">
              {cuisines.map((cuisine) => (
                <li key={cuisine}>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCuisines.includes(cuisine)}
                      onChange={() => toggleCuisine(cuisine)}
                      className="accent-orange-600 w-4 h-4 cursor-pointer"
                    />
                    <span className={`font-medium transition-colors ${selectedCuisines.includes(cuisine) ? "text-orange-700" : "text-gray-700 group-hover:text-orange-500"}`}>
                      {cuisine}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={resetFilters}
            className="w-full mt-4 py-2 border border-orange-200 rounded-lg text-orange-600 font-bold hover:bg-orange-50 transition-colors"
          >
            Reset All Filters
          </button>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Search */}
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search by name or city..."
              aria-label="Search restaurants by name or city"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-orange-300 focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-600" />
          </div>

          {/* ================= GRID ================= */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <RestaurantSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant, index) => (
                <RestaurantCard
                  key={restaurant._id}
                  restaurant={restaurant}
                  priority={index < 3}
                  onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                />
              ))}

              {!loading && restaurants.length === 0 && (
                <div className="col-span-full text-center text-gray-500 mt-10">
                  No restaurants found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

