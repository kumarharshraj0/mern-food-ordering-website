import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { useRestaurant } from "@/context/RestaurantContext";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import Skeleton from "@/components/ui/Skeleton";

export default function Account() {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const { user, loading: userLoading, updateLocation, deleteLocation } = useUser();
  const { getAllRestaurants } = useRestaurant();

  const [myRestaurant, setMyRestaurant] = useState(null);
  const [checkingRestaurant, setCheckingRestaurant] = useState(true);
  const [error, setError] = useState("");
  const [updatingLocation, setUpdatingLocation] = useState(false);

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation is not supported by your browser");
    }

    setUpdatingLocation(true);
    const toastId = toast.loading("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          await updateLocation(latitude, longitude);
          toast.success("Location updated successfully! 📍", { id: toastId });
        } catch (err) {
          console.error(err);
          toast.error("Failed to update location", { id: toastId });
        } finally {
          setUpdatingLocation(false);
        }
      },
      (err) => {
        console.error(err);
        toast.error("Error getting location: " + err.message, { id: toastId });
        setUpdatingLocation(false);
      }
    );
  };

  const handleDeleteLocation = async () => {
    if (!window.confirm("Are you sure you want to delete your live location?")) return;

    const toastId = toast.loading("Deleting location...");
    try {
      await deleteLocation();
      toast.success("Location deleted successfully!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete location", { id: toastId });
    }
  };

  const roles = user?.roles || authUser?.roles || [];
  const isAdmin = roles.includes("admin");
  const isOwner = roles.includes("owner");
  const isDeliveryBoy = roles.includes("deliveryBoy");
  const isUser = roles.includes("user");

  /* --------------------------------------------
     FETCH ALL RESTAURANTS AND FIND USER'S RESTAURANT
  ---------------------------------------------*/
  useEffect(() => {
    const fetchUserRestaurant = async () => {
      if (!authUser?.email) return;

      setCheckingRestaurant(true);
      setError("");

      try {
        const allRestaurants = await getAllRestaurants();
        const owned = allRestaurants.find(
          (r) => r.owner?.email === authUser.email || r.email === authUser.email
        );
        setMyRestaurant(owned || null);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Failed to load your restaurant. Please try again later.");
      } finally {
        setCheckingRestaurant(false);
      }
    };

    fetchUserRestaurant();
  }, [authUser, getAllRestaurants]);

  if (userLoading || checkingRestaurant) {
    return (
      <div className="min-h-screen bg-orange-50 pt-24 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8 space-y-8">
          <Skeleton className="h-10 w-48 mb-6" />

          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-2/3" />
          </div>

          <div className="pt-6 border-t">
            <Skeleton className="h-8 w-40 mb-4" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>

          <div className="pt-6 border-t">
            <Skeleton className="h-8 w-40 mb-4" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No user data found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 pt-24 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
        <h2 className="text-3xl font-bold text-orange-600 mb-6">My Account</h2>

        {/* PROFILE INFO */}
        <div className="space-y-4 text-gray-700">
          <div><b>Name:</b> {user.name}</div>
          <div><b>Email:</b> {user.email}</div>
          <div><b>Role:</b> {user.role || roles.join(", ")}</div>
          <div><b>Phone:</b> {user.phone || "Not provided"}</div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}

        {/* DASHBOARD */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4 text-orange-600">Restaurant</h3>

          {/* DELIVERY DASHBOARD */}
          {isDeliveryBoy && (
            <button
              onClick={() => navigate("/delivery/dashboard")}
              className="w-full mb-4 px-4 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition"
            >
              Go to Delivery Boy Panel
            </button>
          )}

          {/* ADMIN DASHBOARD */}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="w-full mb-4 px-4 py-3 bg-purple-600 text-white rounded-lg font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 transition"
            >
              Go to Admin Dashboard
            </button>
          )}

          {/* CREATE RESTAURANT - Only for 'user' role with no restaurant */}
          {isUser && !myRestaurant && (
            <button
              onClick={() => navigate("/create-restaurant")}
              className="w-full mb-4 px-4 py-3 bg-green-600 text-white rounded-lg font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition"
            >
              Create Restaurant
            </button>
          )}

          {/* EXISTING RESTAURANT - For owners */}
          {myRestaurant && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{myRestaurant.name}</h4>
                  <p className="text-sm text-gray-500">
                    Status:{" "}
                    {myRestaurant.isOpen ? (
                      <span className="text-green-600 font-medium">Approved & Active</span>
                    ) : (
                      <span className="text-orange-600 font-medium">Pending Admin Approval</span>
                    )}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${myRestaurant.isOpen ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {myRestaurant.isOpen ? 'Active' : 'Pending'}
                </div>
              </div>

              {myRestaurant.isOpen ? (
                <button
                  onClick={() => navigate("/owner/dashboard")}
                  className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg font-bold shadow-lg shadow-orange-100 hover:bg-orange-700 transition flex items-center justify-center gap-2"
                >
                  Go to Owner Dashboard
                </button>
              ) : (
                <button
                  disabled
                  className="w-full px-4 py-3 bg-gray-200 text-gray-500 rounded-lg font-bold cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Waiting for Admin Approval
                </button>
              )}
            </div>
          )}
        </div>

        {/* LIVE LOCATION */}
        <div className="mt-8 border-t pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <h3 className="text-xl font-semibold text-orange-600 flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Live Location
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.location?.coordinates && (
                <button
                  onClick={handleDeleteLocation}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition flex items-center gap-2"
                >
                  Delete Location
                </button>
              )}
              <button
                onClick={handleUpdateLocation}
                disabled={updatingLocation}
                className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg font-semibold hover:bg-orange-200 transition flex items-center gap-2 disabled:opacity-50"
              >
                {updatingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4" />
                )}
                Update Current Location
              </button>
            </div>
          </div>

          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
            {user.location?.coordinates ? (
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-gray-700">
                  Current Coords:
                </p>
                <div className="flex items-center gap-2 font-mono text-xs text-orange-600">
                  <span className="bg-white px-2 py-1 rounded border">LAT: {user.location.coordinates[1].toFixed(6)}</span>
                  <span className="bg-white px-2 py-1 rounded border">LONG: {user.location.coordinates[0].toFixed(6)}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider">
                  Last Sync: {new Date(user.updatedAt).toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic flex items-center gap-2">
                <Navigation className="h-4 w-4 text-gray-300" /> No live location set.
              </p>
            )}
          </div>
        </div>

        {/* SAVED ADDRESSES */}
        {user.addresses?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Saved Addresses</h3>
            {user.addresses.map((addr) => (
              <div key={addr._id} className="p-3 border rounded-lg mb-2">
                <p>{addr.street}, {addr.city}, {addr.state}</p>
                <p className="text-sm text-gray-500">
                  {addr.country} – {addr.pincode}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate("/profile/edit")}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Edit Profile
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}



