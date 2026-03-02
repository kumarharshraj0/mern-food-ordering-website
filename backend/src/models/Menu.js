const mongoose = require("mongoose");

// Image Schema
const imageSchema = new mongoose.Schema({
  public_id: String,
  url: String
});

// Addon Schema
const addonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

// Size Options Schema
const sizeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

// Main Menu Item Schema
const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: "text" },

    description: { type: String, index: true },

    price: { type: Number, required: true }, // Base price

    category: {
      type: String,
      required: true,
      index: true
    },

    cuisine: {
      type: String
    },

    images: [imageSchema],

    isVeg: {
      type: Boolean,
      default: true
    },

    isAvailable: {
      type: Boolean,
      default: true
    },

    preparationTime: {
      type: Number
    },

    rating: {
      type: Number,
      default: 0
    },

    reviewsCount: {
      type: Number,
      default: 0
    },

    popularity: {
      type: Number,
      default: 0
    },

    /* ================================
       🔥 RESTAURANT REFERENCE (FIX)
    ================================= */
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true
    },

    /* ================================
       CREATED BY
    ================================= */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }

  },
  { timestamps: true }
);

// Text Search Index
menuItemSchema.index({
  name: "text",
  description: "text",
  category: "text",
  cuisine: "text"
});

module.exports = mongoose.model("MenuItem", menuItemSchema);


