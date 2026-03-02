import { useState } from "react";
import { useMenu } from "@/context/MenuContext";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AddMenu({ restaurantId, onSuccess }) {
  const { createMenuItem } = useMenu();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    cuisine: "",
    isVeg: true,
    images: []
  });

  const [loading, setLoading] = useState(false);

  /* ----------------------------------
     Handle Change
  -----------------------------------*/
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  /* ----------------------------------
     Handle Images
  -----------------------------------*/
  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const toastId = toast.loading("Processing images...");

    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    ).then((base64Strings) => {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...base64Strings]
      }));
      toast.success(`${files.length} images added`, { id: toastId });
    }).catch((err) => {
      console.error(err);
      toast.error("Failed to process images", { id: toastId });
    });
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  /* ----------------------------------
     Submit Menu
  -----------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Creating menu item...");

    try {
      await createMenuItem({
        ...form,
        price: Number(form.price),
        restaurant: restaurantId
      });

      toast.success("Menu item created! 🍔", { id: toastId });
      onSuccess(); // close sheet + refresh menu
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add menu item", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-6">
      {/* NAME */}
      <div>
        <label className="text-sm font-medium">Item Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="e.g. Spicy Pepperoni Pizza"
          className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="What makes this dish special?"
          className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none h-24"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* PRICE */}
        <div>
          <label className="text-sm font-medium">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="text-sm font-medium">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Pizza, Burger..."
            required
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      {/* CUISINE */}
      <div>
        <label className="text-sm font-medium">Cuisine</label>
        <input
          name="cuisine"
          value={form.cuisine}
          onChange={handleChange}
          placeholder="Indian, Italian..."
          className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      {/* IMAGES */}
      <div>
        <label className="text-sm font-medium block mb-2">Item Images</label>

        <div className="flex flex-wrap gap-2 mb-2">
          {form.images.map((img, idx) => (
            <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border">
              <img src={img} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          <label className="w-20 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition text-gray-400 hover:text-green-600">
            <ImagePlus size={20} />
            <span className="text-[10px] mt-1">Add</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
          </label>
        </div>
        <p className="text-[10px] text-gray-400">Add one or more images of the dish</p>
      </div>

      {/* VEG */}
      <div className="flex items-center gap-2 py-2">
        <input
          type="checkbox"
          name="isVeg"
          id="isVeg"
          checked={form.isVeg}
          onChange={handleChange}
          className="w-4 h-4 accent-green-600"
        />
        <label htmlFor="isVeg" className="text-sm font-medium cursor-pointer">Vegetarian</label>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Adding Item...
          </>
        ) : (
          "Add Menu Item"
        )}
      </button>
    </form>
  );
}

