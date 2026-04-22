import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, Star, SlidersHorizontal } from "lucide-react";
import SideSheet from "@/components/ui/SideSheet";
import { toast } from "react-hot-toast";
import { useMenu } from "@/context/MenuContext";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import MenuSkeleton from "@/components/MenuSkeleton.jsx";
import ReviewList from "@/components/reviews/ReviewList";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { Reveal } from "@/components/ui/Reveal";
import { useAuth } from "@/context/AuthContext";

const cuisinesList = [
  "Italian",
  "Chinese",
  "Indian",
  "Japanese",
  "Dessert",
  "Beverages"
];

export default function MenuPage() {
  const { menu, loading, getMenu, getMenuReviews, createReview } = useMenu();
  const { addToCart } = useCart();
  const { checkReviewEligibility } = useOrder();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adding, setAdding] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /* ---------------- FETCH REVIEWS & ELIGIBILITY ---------------- */
  useEffect(() => {
    if (selectedItem) {
      fetchItemReviews();
      checkEligibility();
    } else {
      setReviews([]);
      setIsEligible(false);
    }
  }, [selectedItem]);

  const fetchItemReviews = async () => {
    setReviewsLoading(true);
    try {
      const data = await getMenuReviews(selectedItem._id);
      setReviews(data);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkEligibility = async () => {
    try {
      const res = await checkReviewEligibility({ menuItemId: selectedItem._id });
      setIsEligible(res.eligible);
    } catch (err) {
      setIsEligible(false);
    }
  };

  const handleReviewSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createReview(selectedItem._id, data);
      toast.success("Review added!");
      fetchItemReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add review");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------- FETCH MENU ---------------- */
  useEffect(() => {
    getMenu({
      cuisine: selectedCuisines.join(","),
      page: 1,
      limit: 12
    });
  }, [selectedCuisines]);

  /* ---------------- TOGGLE CUISINE ---------------- */
  const toggleCuisine = (cuisine) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  /* ---------------- ADD TO CART ---------------- */
  const handleAddToCart = async (item) => {
    if (!authUser) {
      toast.error("Please sign in to add items to cart");
      navigate("/signin");
      return;
    }
    const toastId = toast.loading("Adding to cart...");

    try {
      setAdding(true);

      const payload = {
        menuItem: item._id,
        restaurant: item.restaurant?._id || item.restaurant,
        title: item.name,
        image: item.images?.[0] || null,
        basePrice: item.price,
        quantity: 1,
        size: null,
        addons: [],
        totalPrice: item.price * 1
      };

      await addToCart(payload);

      toast.success("Item added to cart! 🍔", {
        id: toastId,
        position: 'top-right'
      });
      setSelectedItem(null);

    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error(err?.response?.data?.message || "Failed to add item", {
        id: toastId
      });
    } finally {
      setAdding(false);
    }
  };



  return (
    <div className="min-h-screen bg-transparent pt-24 pb-16 px-4 md:px-8 lg:px-12">
      <Reveal>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

          {/* ================= FILTER (Desktop) ================= */}
          <aside className="hidden lg:block lg:w-64 bg-transparent border-r border-stone-200 p-5 sticky top-24 h-max z-20">
            <MenuFilterContent
              cuisinesList={cuisinesList}
              selectedCuisines={selectedCuisines}
              toggleCuisine={toggleCuisine}
            />
          </aside>

          {/* ================= FILTER (Mobile) ================= */}
          <SideSheet
            open={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            title="Filter Cuisine"
          >
            <div className="bg-white">
              <MenuFilterContent
                cuisinesList={cuisinesList}
                selectedCuisines={selectedCuisines}
                toggleCuisine={toggleCuisine}
              />
            </div>
          </SideSheet>

          {/* ================= MENU CONTENT ================= */}
          <div className="flex-1 flex flex-col gap-6">

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-6 py-2 bg-white border border-orange-200 rounded-xl text-orange-600 font-bold hover:bg-orange-50 transition-all shadow-sm group"
              >
                <SlidersHorizontal className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                <span>Filter Cuisine</span>
                {selectedCuisines.length > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 bg-orange-600 text-white text-[10px] rounded-full">
                    {selectedCuisines.length}
                  </span>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <MenuSkeleton key={i} />
                ))}

              {!loading &&
                menu.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200/60 hover:-translate-y-1 hover:shadow-md transition cursor-pointer group"
                    onClick={() => setSelectedItem(item)}
                  >
                    <img
                      src={item.images?.[0]?.url?.startsWith("http")
                        ? `${item.images[0].url}?auto=format&fit=crop&w=500&q=75`
                        : item.images?.[0]?.url || "/placeholder.png"}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-outfit font-bold font-gray-900 group-hover:text-orange-700 transition-colors leading-tight pr-2">{item.name}</h3>
                        <span className="text-orange-700 font-semibold whitespace-nowrap">
                          ₹{item.price}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {item.cuisine} • {item.category}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ================= MODAL ================= */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-full overflow-hidden relative shadow-2xl flex flex-col md:flex-row">
            <button
              className="absolute top-4 right-4 text-gray-500 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors shadow-sm"
              onClick={() => setSelectedItem(null)}
            >
              <X size={20} />
            </button>

            {/* Left: Item Details */}
            <div className="md:w-1/2 p-1 lg:p-2">
              <img
                src={selectedItem.images?.[0]?.url?.startsWith("http")
                  ? `${selectedItem.images[0].url}?auto=format&fit=crop&w=800&q=80`
                  : selectedItem.images?.[0]?.url || "/placeholder.png"}
                className="w-full h-48 md:h-full object-cover rounded-2xl md:rounded-l-2xl md:rounded-r-none"
                alt={selectedItem.name}
                loading="lazy"
              />
            </div>

            {/* Right: Details & Reviews */}
            <div className="flex-1 flex flex-col max-h-[85vh] md:max-h-none overflow-hidden">
              <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                <div className="mb-8">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-4xl font-outfit text-gray-900 leading-tight">
                      {selectedItem.name}
                    </h2>
                    <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded border border-orange-200/50">
                      <Star size={16} className="fill-orange-500 text-orange-500" />
                      <span className="font-black text-orange-600">
                        {selectedItem.rating?.toFixed(1) || "5.0"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs uppercase tracking-normal font-semibold text-gray-500 mb-4 font-inter">
                    {selectedItem.cuisine} • {selectedItem.category}
                  </p>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {selectedItem.description}
                  </p>

                  <div className="flex items-center justify-between mb-8">
                    <p className="text-3xl font-semibold text-orange-700 tracking-tight">
                      ₹{selectedItem.price}
                    </p>
                    <button
                      disabled={adding}
                      onClick={() => handleAddToCart(selectedItem)}
                      className="flex items-center justify-center gap-2 bg-stone-900 border border-stone-900 hover:bg-stone-800 text-white font-bold px-8 py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Plus className="h-5 w-5" />
                      {adding ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </div>

                {/* Reviews Section in Modal */}
                <div className="border-t border-gray-50 pt-8 mt-8">
                  <h3 className="text-2xl font-outfit text-gray-900 mb-6 tracking-tight">
                    Reviews ({reviews.length})
                  </h3>

                  {isEligible && (
                    <div className="mb-10 bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                      <h4 className="text-xs font-semibold text-orange-700 tracking-wide mb-4 flex items-center gap-2">
                        <Star size={14} /> Write your review
                      </h4>
                      <ReviewForm onSubmit={handleReviewSubmit} loading={isSubmitting} />
                    </div>
                  )}

                  <ReviewList reviews={reviews} loading={reviewsLoading} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------
   Helper: Menu Filter Content
-------------------------------- */
function MenuFilterContent({ cuisinesList, selectedCuisines, toggleCuisine }) {
  return (
    <>
      <h2 className="text-xl font-outfit mb-4 text-gray-900 border-b border-stone-200/50 pb-2">
        Filter by Cuisine
      </h2>

      <ul className="flex flex-col gap-3">
        {cuisinesList.map((cuisine) => (
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
    </>
  );
}


