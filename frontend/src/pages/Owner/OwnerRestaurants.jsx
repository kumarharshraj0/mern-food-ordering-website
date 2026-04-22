import { useEffect, useState, useCallback } from "react";
import { Plus, Trash, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Layout from "@/components/ownerlayout/Layout";
import Header from "@/components/Header";
import SideSheet from "@/components/ui/SideSheet";

import { useRestaurant } from "@/context/RestaurantContext";
import { useMenu } from "@/context/MenuContext";
import Skeleton from "@/components/ui/Skeleton";

import AddMenu from "@/pages/Owner/AddMenu";
import UpdateMenu from "@/pages/Owner/UpdateMenu";

export default function OwnerRestaurants() {
  const navigate = useNavigate();

  const { getmyResturants, deleteRestaurant } = useRestaurant();
  const { menu, getMenu, deleteMenuItem } = useMenu();

  const [myRestaurant, setMyRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  /* ================= FETCH DATA ================= */
  const fetchData = useCallback(async () => {
    setLoading(true);

    const myRestaurants = await getmyResturants();
    if (!myRestaurants || myRestaurants.length === 0) {
      setLoading(false);
      return;
    }

    const restaurant = myRestaurants[0];
    setMyRestaurant(restaurant);

    await getMenu({ restaurant: restaurant._id });

    setLoading(false);
  }, [getmyResturants, getMenu]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ================= DELETE RESTAURANT ================= */
  const handleDeleteRestaurant = async () => {
    if (!confirm("Delete restaurant?")) return;
    await deleteRestaurant(myRestaurant._id);
    setMyRestaurant(null);
  };

  /* ================= DELETE MENU ITEM ================= */
  const handleDeleteMenu = async (id) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    const toastId = toast.loading("Deleting item...");
    try {
      await deleteMenuItem(id);
      toast.success("Item deleted successfully!", { id: toastId });
      // Refresh menu list
      getMenu({ restaurant: myRestaurant._id });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete item", { id: toastId });
    }
  };

  if (loading) {
    return (
      <Layout>
        <Header title="My Restaurant" />
        <div className="bg-white rounded-xl shadow p-6 mb-10 space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-8 w-1/3" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow overflow-hidden space-y-4 font-bold h-64">
              <Skeleton className="h-40 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Layout>
    );
  }

  if (!myRestaurant) {
    return (
      <Layout>
        <Header title="My Restaurant" />
        <p className="text-center text-gray-500">
          You don't have a restaurant yet.
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header title="My Restaurant" />

      {/* ================= RESTAURANT CARD ================= */}
      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <img
          src={myRestaurant.images?.[0]?.url || "/placeholder.png"}
          className="h-48 w-full object-cover rounded-lg"
        />

        <h2 className="text-2xl font-bold mt-4">{myRestaurant.name}</h2>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={18} /> Add Menu
          </button>

          <button
            onClick={handleDeleteRestaurant}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            <Trash size={18} /> Delete
          </button>
        </div>
      </div>

      {/* ================= MENU LIST ================= */}
      <h2 className="text-xl font-bold mb-4 text-orange-600">
        Restaurant Menu
      </h2>

      {menu.length === 0 ? (
        <p className="text-gray-500">No menu items added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menu.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={item.images?.[0]?.url || "/placeholder.png"}
                onClick={() => navigate(`/menu/${item._id}`)}
                className="h-40 w-full object-cover cursor-pointer"
              />

              <div className="p-4">
                <div className="flex justify-between">
                  <h4 className="font-semibold">{item.name}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${item.isVeg
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {item.isVeg ? "Veg" : "Non-Veg"}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  {item.description || "No description"}
                </p>

                <div className="mt-4 flex justify-between items-center">
                  <span className="font-bold">₹{item.price}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteMenu(item._id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete Item"
                    >
                      <Trash size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMenu(item);
                        setOpenUpdate(true);
                      }}
                      className="bg-orange-600 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Edit size={14} /> Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <SideSheet open={openAdd} onClose={() => setOpenAdd(false)} title="Add Menu">
        <AddMenu
          restaurantId={myRestaurant._id}
          onSuccess={() => {
            setOpenAdd(false);
            getMenu({ restaurant: myRestaurant._id });
          }}
        />
      </SideSheet>

      <SideSheet
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        title="Update Menu"
      >
        <UpdateMenu
          menuItem={selectedMenu}
          onSuccess={() => {
            setOpenUpdate(false);
            getMenu({ restaurant: myRestaurant._id });
          }}
        />
      </SideSheet>
    </Layout>
  );
}
