import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Plus, MapPin, Search, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useCart } from "@/context/CartContext";
import { useRestaurant } from "@/context/RestaurantContext";
import { useMenu } from "@/context/MenuContext"; // New Import
import useDebounce from "@/hooks/useDebounce";
import Skeleton from "@/components/ui/Skeleton";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";
import { useOrder } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import OptimizedImage from "@/components/ui/OptimizedImage";

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { getRestaurantById, restaurant, loading, getRestaurantReviews, createRestaurantReview } = useRestaurant();
  const { menu, loading: menuLoading, getMenu } = useMenu(); // From MenuContext
  const { checkReviewEligibility } = useOrder();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [category, setCategory] = useState("All");
  const [cuisines, setCuisines] = useState([]);
  const [isVeg, setIsVeg] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [addingId, setAddingId] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [eligibilityDetail, setEligibilityDetail] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    getRestaurantById(id);
    fetchReviews();
    if (user) {
      checkEligibility();
    } else {
      setIsEligible(false);
      setEligibilityDetail(null);
    }

    if (window.location.hash === "#reviews") {
      setTimeout(() => {
        const element = document.getElementById("reviews");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }
  }, [id, user]);

  /* ================= FETCH FILTERED MENU (Backend) ================= */
  useEffect(() => {
    getMenu({
      restaurant: id,
      q: debouncedSearch || undefined,
      category: category === "All" ? undefined : category,
      cuisine: cuisines.join(",") || undefined,
      isVeg: isVeg === null ? undefined : String(isVeg),
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      limit: 50 // Limit high enough for a restaurant menu
    });
  }, [id, debouncedSearch, category, cuisines, isVeg, priceRange, getMenu]);

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const data = await getRestaurantReviews(id);
      setReviews(data);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkEligibility = async () => {
    try {
      const res = await checkReviewEligibility({ restaurantId: id });
      setIsEligible(res.eligible);
      setEligibilityDetail(res);
    } catch (err) {
      console.error("Eligibility check failed:", err);
      setIsEligible(false);
      setEligibilityDetail(null);
    }
  };

  const handleReviewSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createRestaurantReview(id, data);
      toast.success("Review submitted successfully!");
      fetchReviews();
      getRestaurantById(id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= FILTER SIDEBAR DATA ================= */
  // We derive categories/cuisines from the initial restaurant.menuItems (full list populated on getById)
  const menuItems = restaurant?.menuItems || [];

  const categories = useMemo(() => {
    return ["All", ...new Set(menuItems.map(i => i.category))];
  }, [menuItems]);

  const cuisineTypes = useMemo(() => {
    return [...new Set(menuItems.map(i => i.cuisine).filter(Boolean))];
  }, [menuItems]);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async (item) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/signin");
      return;
    }

    try {
      setAddingId(item._id);
      await addToCart({
        menuItem: item._id,
        menuItemDetails: {
          _id: item._id,
          name: item.name,
          price: item.price,
          images: item.images,
          isVeg: item.isVeg
        },
        restaurant: restaurant._id,
        quantity: 1,
        size: null,
        addons: []
      });
      toast.success(`${item.name} added to cart!`);
    } catch (err) {
      console.error("Add to cart failed", err);
      toast.error("Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-transparent pt-24 px-4 pb-16">

      {/* ================= HEADER ================= */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="bg-white rounded-3xl shadow-sm p-8 flex flex-col md:flex-row gap-8 border border-gray-100">
            <Skeleton className="w-full md:w-80 h-60 rounded-2xl flex-shrink-0" />
            <div className="flex-1 space-y-6 py-2">
              <Skeleton className="h-12 w-2/3" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-8 w-1/3" />
            </div>
          </div>
        ) : restaurant && (
          <div className="bg-white rounded-3xl shadow-sm p-8 flex flex-col md:flex-row gap-8 border border-stone-200/60 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1.5 bg-orange-500 px-4 py-2 rounded-2xl text-white shadow-lg shadow-orange-500/20">
                  <Star className="w-5 h-5 fill-white" />
                  <span className="text-xl font-black">{restaurant.rating.toFixed(1)}</span>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{restaurant.reviewsCount || 0} Reviews</span>
              </div>
            </div>

            <OptimizedImage
              src={restaurant.images?.[0]?.url || "/placeholder.png"}
              className="w-full md:w-80 h-60 rounded-2xl shadow-xl flex-shrink-0"
              alt={restaurant.name}
              priority
            />

            <div className="flex-1 py-2">
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-5xl font-outfit text-gray-900 tracking-tight">
                  {restaurant.name}
                </h1>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${restaurant.isOpen ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-stone-50 text-stone-600 border-stone-200'}`}>
                  {restaurant.isOpen ? "Open Now" : "Currently Closed"}
                </span>
              </div>

              <p className="mt-4 text-gray-500 leading-relaxed max-w-2xl font-medium">
                {restaurant.description || "Indulge in a culinary journey with our specially curated menu, featuring the finest ingredients and authentic flavors."}
              </p>

              <div className="flex flex-wrap items-center gap-6 mt-6">
                <div className="flex items-center gap-2 text-gray-600 font-bold text-sm bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  {restaurant.address?.street}, {restaurant.address?.city}
                </div>
                <div className="flex items-center gap-2 text-gray-600 font-bold text-sm bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 text-orange-600">
                  {restaurant.cuisineTypes?.join(" • ") || "Global Cuisine"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">

        {/* ================= FILTER ================= */}
        <aside className="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-5 space-y-6">
          {/* Search */}
          <div>
            <h3 className="font-semibold text-orange-900 mb-2">Search</h3>
            <div className="flex items-center gap-2 border rounded-lg px-2 py-1">
              <Search className="w-4 h-4 text-orange-500" />
              <input
                className="w-full outline-none"
                placeholder="Search food..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <h3 className="font-semibold text-orange-900 mb-2">Category</h3>
            {categories.map(c => (
              <Button
                key={c}
                className="w-full mb-1"
                variant={category === c ? "default" : "outline"}
                onClick={() => setCategory(c)}
              >
                {c}
              </Button>
            ))}
          </div>

          {/* Cuisine */}
          <div>
            <h3 className="font-semibold text-orange-900 mb-2">Cuisine</h3>
            {cuisineTypes.map(c => (
              <label key={c} className="flex gap-2 items-center text-sm">
                <input
                  type="checkbox"
                  className="accent-orange-500"
                  checked={cuisines.includes(c)}
                  onChange={() =>
                    setCuisines(prev =>
                      prev.includes(c)
                        ? prev.filter(x => x !== c)
                        : [...prev, c]
                    )
                  }
                />
                {c}
              </label>
            ))}
          </div>

          {/* Food Type */}
          <div>
            <h3 className="font-semibold text-orange-900 mb-2">Food Type</h3>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setIsVeg(null)}>All</Button>
              <Button size="sm" variant={isVeg === true ? "default" : "outline"} onClick={() => setIsVeg(true)}>
                Veg
              </Button>
              <Button size="sm" variant={isVeg === false ? "default" : "outline"} onClick={() => setIsVeg(false)}>
                Non-Veg
              </Button>
            </div>
          </div>

          {/* Price */}
          <div>
            <h3 className="font-semibold text-orange-900 mb-2">
              ₹{priceRange[0]} – ₹{priceRange[1]}
            </h3>
            <Slider
              min={0}
              max={5000}
              step={50}
              value={priceRange}
              onValueChange={setPriceRange}
            />
          </div>
        </aside>

        {/* ================= MENU ================= */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {menuLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow overflow-hidden space-y-4 font-bold flex flex-col items-center justify-center h-48">
                <Skeleton className="h-40 w-full" />
                <div className="p-4 w-full space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                </div>
              </div>
            ))
          ) : menu.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No menu items found match your criteria
            </p>
          ) : (
            menu.map(item => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-sm border border-stone-200/60 hover:shadow-md transition-all duration-500 overflow-hidden group"
              >
                <div className="h-44 overflow-hidden relative">
                  <OptimizedImage
                    src={item.images?.[0]?.url || "/placeholder.png"}
                    className="h-full w-full group-hover:scale-110 transition-transform duration-700"
                    alt={item.name}
                  />
                  {item.isVeg && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm border border-emerald-100/50">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-outfit font-bold text-gray-900 group-hover:text-orange-700 transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500 line-clamp-2 mt-2 font-medium leading-relaxed">
                    {item.description || "Freshly prepared with the finest ingredients and authentic spices."}
                  </p>

                  <div className="flex justify-between items-center mt-6">
                    <span className="text-xl font-black text-orange-600">
                      ₹{item.price.toLocaleString()}
                    </span>
                    <Button
                      size="sm"
                      disabled={addingId === item._id || !restaurant.isOpen}
                      onClick={() => handleAddToCart(item)}
                      className="rounded-xl px-5 py-5 bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                    >
                      {addingId === item._id ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Adding
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Plus className="w-4 h-4" /> Add
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ================= REVIEWS SECTION ================= */}
      <div id="reviews" className="max-w-7xl mx-auto mt-16 bg-white rounded-3xl shadow-sm overflow-hidden border border-stone-200/60">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Left Column: Summary & Form */}
          <div className="p-8 lg:p-12 bg-orange-50/30 border-b lg:border-b-0 lg:border-r border-orange-100">
            <h2 className="text-3xl font-outfit text-gray-900 mb-2 tracking-tight">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-4 mb-8">
              <div className="text-5xl font-black text-orange-600">
                {restaurant?.rating?.toFixed(1) || "0.0"}
              </div>
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className={s <= restaurant?.rating ? "fill-orange-500 text-orange-500" : "text-gray-200"}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-400 font-medium">
                  Based on {restaurant?.reviewsCount || 0} reviews
                </p>
              </div>
            </div>

            {isEligible ? (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-sm uppercase tracking-wider text-orange-600">
                  <Star size={18} /> Write a Review
                </h3>
                <ReviewForm onSubmit={handleReviewSubmit} loading={isSubmitting} />
              </div>
            ) : eligibilityDetail?.alreadyReviewed ? (
              <div className="bg-green-50 p-6 rounded-2xl border border-green-200 text-center">
                <p className="text-sm text-green-800 font-bold mb-1">Feedback Received!</p>
                <p className="text-xs text-green-600 leading-relaxed font-medium">
                  You have already reviewed this restaurant. Thank you for your feedback!
                </p>
              </div>
            ) : (
              <div className="bg-orange-100/50 p-6 rounded-2xl border border-dashed border-orange-200 text-center">
                <p className="text-sm text-orange-800 font-bold mb-1">Want to review?</p>
                <p className="text-xs text-orange-600 leading-relaxed font-medium">
                  {eligibilityDetail?.purchased === false
                    ? "Only customers who have ordered from this restaurant can leave a review."
                    : "Only customers who have ordered from this restaurant can leave a review." // default fallback
                  }
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Review List */}
          <div className="lg:col-span-2 p-8 lg:p-12">
            <ReviewList reviews={reviews} loading={reviewsLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
