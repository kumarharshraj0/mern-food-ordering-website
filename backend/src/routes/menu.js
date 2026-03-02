const express = require("express");
const router = express.Router();

const { verifyAccessToken, requireRole } = require("../middlewares/auth");
const menuController = require("../controllers/menuController");

// -------------------------------------
// PUBLIC ROUTES
// -------------------------------------

// Latest menu items
router.get("/latest", menuController.getLatestMenu);

// Menu list with search, filter, and pagination
router.get("/", menuController.getMenu);

// Get menu item by ID (must be last in public routes)
router.get("/:id", menuController.getById);

// -------------------------------------
// ADMIN ROUTES (AUTH REQUIRED)
// -------------------------------------

// Create menu item (with images)
router.post(
  "/",
  verifyAccessToken,
  requireRole("admin", "owner"),
  menuController.create
);

// Update menu item (with optional additional images)
router.put(
  "/:id",
  verifyAccessToken,
  requireRole("admin", "owner"),
  menuController.update
);

// Delete menu item
router.delete(
  "/:id",
  verifyAccessToken,
  requireRole("admin", "owner"),
  menuController.remove
);

// -------------------------------------
// REVIEWS (AUTH USERS)
// -------------------------------------

router.get("/:id/reviews", menuController.getReviews);

// Create review
router.post(
  "/:id/reviews",
  verifyAccessToken,
  menuController.createReview
);

// Update review
router.put(
  "/:id/reviews",
  verifyAccessToken,
  menuController.updateReview
);

// Delete review
router.delete(
  "/:id/reviews",
  verifyAccessToken,
  menuController.deleteReview
);

module.exports = router;

