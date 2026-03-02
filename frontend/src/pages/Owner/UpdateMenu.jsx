import { useEffect, useState } from "react";
import { useMenu } from "@/context/MenuContext";

export default function UpdateMenu({ menuItem, onSuccess }) {
  const { updateMenuItem } = useMenu();

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

  /* ===== SAFETY GUARD ===== */
  if (!menuItem) {
    return (
      <div className="text-center text-gray-500 py-10">
        Select a menu item to update
      </div>
    );
  }

  useEffect(() => {
    setForm({
      name: menuItem.name || "",
      description: menuItem.description || "",
      price: menuItem.price || "",
      category: menuItem.category || "",
      cuisine: menuItem.cuisine || "",
      isVeg: menuItem.isVeg ?? true,
      images: []
    });
  }, [menuItem]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImage = (e) => {
    const files = Array.from(e.target.files);

    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      )
    ).then((base64) =>
      setForm((prev) => ({ ...prev, images: base64 }))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!menuItem?._id) return;

    setLoading(true);

    await updateMenuItem(menuItem._id, {
      ...form,
      price: Number(form.price)
    });

    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* NAME */}
      <div>
        <label className="block text-sm font-medium mb-1">Menu Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* PRICE */}
      <div>
        <label className="block text-sm font-medium mb-1">Price</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* CATEGORY */}
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* CUISINE */}
      <div>
        <label className="block text-sm font-medium mb-1">Cuisine</label>
        <input
          name="cuisine"
          value={form.cuisine}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* VEG */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isVeg"
          checked={form.isVeg}
          onChange={handleChange}
        />
        Veg Item
      </label>

      {/* IMAGE */}
      <div>
        <label className="block text-sm font-medium mb-1">Images</label>
        <input type="file" multiple accept="image/*" onChange={handleImage} />
      </div>

      <button
        disabled={loading}
        className="w-full bg-orange-600 text-white py-2 rounded"
      >
        {loading ? "Updating..." : "Update Menu"}
      </button>
    </form>
  );
}
