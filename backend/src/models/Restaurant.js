// Restaurant Schema (UPDATED)
const mongoose = require("mongoose");

// Image Schema
const imageSchema = new mongoose.Schema({
  public_id: String,
  url: String
});

// Opening Hours Schema
const openingHourSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "Monday", "Tuesday", "Wednesday", "Thursday",
      "Friday", "Saturday", "Sunday"
    ]
  },
  open: String,
  close: String
});

// Address Schema
const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  pincode: String,
  country: { type: String, default: "India" },
  latitude: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 }
});

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: "text" },
    description: String,

    images: [imageSchema],

    cuisineTypes: [String],

    phone: String,
    email: String,

    address: addressSchema,

    openingHours: [openingHourSchema],

    isOpen: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },

    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    popularity: { type: Number, default: 0 },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    /* 🔥 MENU REFERENCE */
    menuItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem"
      }
    ],

    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }
    },

    commissionRate: {
      type: Number,
      default: 30
    }
  },

  { timestamps: true }
);

// Indexes
restaurantSchema.index({ location: "2dsphere" });
restaurantSchema.index({
  name: "text",
  description: "text",
  "address.city": "text",
  cuisineTypes: "text"
});

module.exports = mongoose.model("Restaurant", restaurantSchema);


