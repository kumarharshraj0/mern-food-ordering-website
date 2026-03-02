const express = require("express");
const router = express.Router();

/* ---------------- IMPORTS ---------------- */
const { verifyAccessToken } = require("../middlewares/auth");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require("../controllers/cartController");

/* ---------------- CART ROUTES ---------------- */

// Get logged-in user's cart
router.get("/", verifyAccessToken, getCart);

// Add item to cart
router.post("/add", verifyAccessToken, addToCart);

// Update cart item quantity
router.put("/update/:itemId", verifyAccessToken, updateCartItem);

// Remove single item from cart
router.delete("/remove/:itemId", verifyAccessToken, removeCartItem);

// Clear entire cart
router.delete("/clear", verifyAccessToken, clearCart);

module.exports = router;


