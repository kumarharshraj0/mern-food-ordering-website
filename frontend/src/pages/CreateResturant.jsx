import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRestaurant } from "@/context/RestaurantContext";

const CreateRestaurant = () => {
  const navigate = useNavigate();
  const { createRestaurant } = useRestaurant();

  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "",
    phone: "",
    cuisineTypes: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    latitude: "",
    longitude: ""
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ----------------------------------
     HANDLE INPUT
  -----------------------------------*/
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ----------------------------------
     IMAGE → BASE64
  -----------------------------------*/
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  /* ----------------------------------
     SUBMIT
  -----------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        name: form.name,
        email: form.email,
        description: form.description,
        phone: form.phone,
        cuisineTypes: form.cuisineTypes.split(",").map((c) => c.trim()),
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          country: form.country,
          pincode: form.pincode,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude)
        },
        images
      };

      await createRestaurant(payload);
      navigate("/account");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 pt-24 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">

        <h2 className="text-3xl font-bold text-orange-600 mb-6">
          Create Restaurant
        </h2>

        {error && (
          <div className="mb-4 text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            placeholder="Restaurant Name"
            onChange={handleChange}
            required
            className="w-full border p-3 rounded"
          />

          <input
            name="email"
            placeholder="Restaurant Email"
            onChange={handleChange}
            required
            className="w-full border p-3 rounded"
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            name="cuisineTypes"
            placeholder="Cuisines (comma separated)"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input name="street" placeholder="Street" onChange={handleChange} className="w-full border p-3 rounded" />
          <input name="city" placeholder="City" onChange={handleChange} className="w-full border p-3 rounded" />
          <input name="state" placeholder="State" onChange={handleChange} className="w-full border p-3 rounded" />
          <input name="country" placeholder="Country" onChange={handleChange} className="w-full border p-3 rounded" />
          <input name="pincode" placeholder="Pincode" onChange={handleChange} className="w-full border p-3 rounded" />

          <div className="grid grid-cols-2 gap-4">
            <input
              name="latitude"
              placeholder="Latitude"
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />
            <input
              name="longitude"
              placeholder="Longitude"
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
          >
            {loading ? "Creating..." : "Create Restaurant"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRestaurant;

