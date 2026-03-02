import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RestaurantCard } from "./RestaurantCard";
import { useAuth } from "@/context/AuthContext";
import Skeleton from "./ui/Skeleton";
import { MapPin } from "lucide-react";
import api from "../lib/api";

export function CityRestaurantsSection() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [cityRestaurants, setCityRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    const userCity = user?.addresses?.find(addr => addr.default)?.city ||
        user?.addresses?.[0]?.city ||
        "Lucknow";

    useEffect(() => {
        const fetchByCity = async () => {
            try {
                setLoading(true);
                const res = await api.get("/restaurants", {
                    params: { city: userCity, limit: 6 }
                });
                setCityRestaurants(res.data.restaurants || []);
            } catch (err) {
                console.error("Failed to fetch city restaurants:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchByCity();
    }, [userCity]);

    if (!loading && cityRestaurants.length === 0) return null;

    return (
        <section className="bg-white py-16 px-4 font-inter">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-orange-600 md:text-4xl flex items-center gap-2">
                            <MapPin className="text-orange-500" />
                            Restaurants in {userCity}
                        </h2>
                        <p className="text-lg text-gray-600">
                            Popular dining destinations in your area
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/restaurants')}
                        className="text-orange-500 font-bold hover:underline"
                    >
                        Explore all in {userCity} →
                    </button>
                </div>

                {/* Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-80 bg-gray-50 rounded-xl shadow-sm p-4 animate-pulse">
                                <div className="h-48 bg-gray-200 rounded-lg mb-4" />
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                            </div>
                        ))
                    ) : (
                        cityRestaurants.map((restaurant) => (
                            <RestaurantCard
                                key={restaurant._id}
                                restaurant={restaurant}
                                onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
