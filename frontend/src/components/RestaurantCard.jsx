import React from "react";
import { Star, Clock, MapPin } from "lucide-react";
import OptimizedImage from "./ui/OptimizedImage";

export const RestaurantCard = React.memo(function RestaurantCard({ restaurant, onClick, priority = false }) {
    // Field mapping with fallbacks for mock data consistency
    const name = restaurant.name || "Restaurant Name";

    // Select a high-quality food image based on cuisine or name as fallback
    const getFallbackImage = (name, cuisines) => {
        const query = (cuisines?.[0] || name || "food").toLowerCase();
        return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80&sig=${encodeURIComponent(name)}`;
    };

    const rawImage = restaurant.images?.[0]?.url || restaurant.image;
    const fallbackImage = getFallbackImage(name, restaurant.cuisineTypes);
    const image = rawImage && rawImage.startsWith("http") ? `${rawImage}?auto=format&fit=crop&w=500&q=75` : (rawImage || fallbackImage);

    const rating = restaurant.rating || 0;
    const reviews = restaurant.reviewsCount || restaurant.reviews || 0;
    const cuisines = restaurant.cuisineTypes || (restaurant.cuisine ? [restaurant.cuisine] : ["Delicious Food"]);
    const tags = restaurant.tags || cuisines.slice(0, 3);

    const deliveryTime = restaurant.deliveryTime || "25-35";
    const distance = restaurant.distance || (restaurant.address?.city ? `${restaurant.address.city}` : "Nearby");
    const priceRange = restaurant.priceRange || "$$";
    const featured = restaurant.featured || restaurant.popularity > 8;

    return (
        <div
            onClick={onClick}
            className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-gray-100"
        >
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
                <OptimizedImage
                    src={image}
                    alt={name}
                    priority={priority}
                    className="h-full w-full"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {featured && (
                    <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg z-10">
                        Featured
                    </span>
                )}

                <span className={`absolute left-4 ${featured ? 'top-11' : 'top-4'} rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-lg z-10 ${restaurant.isOpen ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                    {restaurant.isOpen ? "Open" : "Closed"}
                </span>

                <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-black text-orange-600 shadow-xl z-10 border border-orange-100">
                    <Star className="h-3.5 w-3.5 fill-orange-600" />
                    {rating.toFixed(1)}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-black text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                            {name}
                        </h3>
                        <p className="text-sm font-bold text-gray-400 mt-0.5 tracking-tight uppercase">
                            {cuisines.slice(0, 2).join(" • ")}
                        </p>
                    </div>
                </div>

                {/* Rating & Distance */}
                <div className="flex items-center gap-4 mb-4 text-xs font-bold text-gray-600">
                    <div className="flex items-center gap-1.5 bg-orange-50 px-2 py-1 rounded-md text-orange-700">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{deliveryTime} MIN</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" />
                        <span className="truncate max-w-[100px]">{distance}</span>
                    </div>
                    <div className="ml-auto text-gray-300 font-black">
                        {priceRange}
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-gray-50 px-2.5 py-1 text-[10px] font-black text-gray-500 border border-gray-100 uppercase tracking-tighter"
                        >
                            {tag}
                        </span>
                    ))}
                    {reviews > 0 && (
                        <span className="ml-auto text-[10px] font-black text-gray-400 self-center uppercase tracking-tighter">
                            {reviews} Reviews
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
});
