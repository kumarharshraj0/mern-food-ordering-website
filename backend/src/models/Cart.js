const mongoose = require("mongoose");

/* -----------------------------
   Addon inside Cart Item
----------------------------- */
const cartAddonSchema = new mongoose.Schema({
  addon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Addon" // optional if you later create Addon model
  },
  name: String,
  price: Number
});

/* -----------------------------
   Selected Size inside Cart Item
----------------------------- */
const cartSizeSchema = new mongoose.Schema({
  name: String,   // Small, Medium, Large
  price: Number
});

/* -----------------------------
   Cart Item Schema
----------------------------- */
const cartItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true
  },

  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },

  title: String,        // Item name snapshot
  image: Object,        // First image snapshot

  size: cartSizeSchema,

  addons: [cartAddonSchema],

  quantity: {
    type: Number,
    default: 1,
    min: 1
  },

  basePrice: Number,    // Menu item base price
  totalPrice: Number   // (base + size + addons) * quantity
});

/* -----------------------------
   Main Cart Schema
----------------------------- */
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true
    },

    items: [cartItemSchema],

    cartTotal: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);

