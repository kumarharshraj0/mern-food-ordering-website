import { useEffect, useState } from "react";
import { Plus, X, Star } from "lucide-react";
import { toast } from "react-hot-toast";
import { useMenu } from "@/context/MenuContext";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import MenuSkeleton from "@/components/MenuSkeleton.jsx";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";

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

  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adding, setAdding] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="min-h-screen bg-orange-50 pt-24 pb-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* ================= FILTER ================= */}
        <aside className="lg:w-64 bg-white p-5 rounded-xl shadow sticky top-24 h-max">
          <h2 className="text-xl font-bold mb-4 text-orange-600">
            Filter by Cuisine
          </h2>

          <ul className="flex flex-col gap-3">
            {cuisinesList.map((cuisine) => (
              <li key={cuisine}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCuisines.includes(cuisine)}
                    onChange={() => toggleCuisine(cuisine)}
                    className="accent-orange-600 w-4 h-4"
                  />
                  <span className="font-medium text-gray-700">
                    {cuisine}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </aside>

        {/* ================= MENU GRID ================= */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <MenuSkeleton key={i} />
            ))}

          {!loading &&
            menu.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
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
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <span className="text-orange-600 font-bold">
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
                    <h2 className="text-3xl font-black text-gray-900 leading-tight">
                      {selectedItem.name}
                    </h2>
                    <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
                      <Star size={16} className="fill-orange-500 text-orange-500" />
                      <span className="font-black text-orange-600">
                        {selectedItem.rating?.toFixed(1) || "5.0"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs uppercase tracking-widest font-black text-orange-600/60 mb-4">
                    {selectedItem.cuisine} • {selectedItem.category}
                  </p>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {selectedItem.description}
                  </p>

                  <div className="flex items-center justify-between mb-8">
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">
                      ₹{selectedItem.price}
                    </p>
                    <button
                      disabled={adding}
                      onClick={() => handleAddToCart(selectedItem)}
                      className="flex items-center justify-center gap-2 bg-gray-900 border-2 border-gray-900 hover:bg-transparent hover:text-gray-900 text-white font-bold px-8 py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Plus className="h-5 w-5" />
                      {adding ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </div>

                {/* Reviews Section in Modal */}
                <div className="border-t border-gray-50 pt-8 mt-8">
                  <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">
                    Reviews ({reviews.length})
                  </h3>

                  {isEligible && (
                    <div className="mb-10 bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                      <h4 className="text-xs font-black text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-2">
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


