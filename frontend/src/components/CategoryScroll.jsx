import React from "react";
import {
    Pizza,
    Donut,
    Coffee,
    Utensils,
    Beef,
    IceCream,
    Salad,
    ChefHat
} from "lucide-react";

const categories = [
    { id: 1, name: "Pizza", icon: Pizza, color: "bg-red-100 text-red-600" },
    { id: 2, name: "Burgers", icon: Utensils, color: "bg-orange-100 text-orange-600" },
    { id: 3, name: "Desserts", icon: Donut, color: "bg-pink-100 text-pink-600" },
    { id: 4, name: "Coffee", icon: Coffee, color: "bg-amber-100 text-amber-700" },
    { id: 5, name: "Steak", icon: Beef, color: "bg-brown-100 text-amber-900" },
    { id: 6, name: "Ice Cream", icon: IceCream, color: "bg-blue-100 text-blue-600" },
    { id: 7, name: "Healthy", icon: Salad, color: "bg-green-100 text-green-600" },
    { id: 8, name: "Bistro", icon: ChefHat, color: "bg-purple-100 text-purple-600" },
];

export function CategoryScroll() {
    return (
        <section className="py-12 bg-white px-4">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    <span className="w-8 h-1 bg-orange-500 rounded-full"></span>
                    Explore Categories
                </h2>

                <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="group flex flex-col items-center gap-3 cursor-pointer min-w-[100px]"
                        >
                            <div className={`${cat.color} p-5 rounded-2xl transition-all duration-300 group-hover:-translate-y-2 shadow-sm group-hover:shadow-lg group-hover:ring-2 group-hover:ring-orange-200`}>
                                <cat.icon size={32} />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">
                                {cat.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
