const express = require("express");
const router = express.Router();

const { verifyAccessToken, requireRole } = require("../middlewares/auth");
const restaurantController = require("../controllers/restaurantController");

/* ======================================================
   OWNER ROUTES (STATIC FIRST)
====================================================== */

router.get(
  "/myresturant",
  verifyAccessToken,
  requireRole("owner"),
  restaurantController.getmyResturants
);

/* ======================================================
   PUBLIC ROUTES
====================================================== */

router.get("/nearest", restaurantController.getNearestRestaurants);

router.get("/all", restaurantController.getAllRestaurants);

router.get("/", restaurantController.getRestaurants);

/* ❗ MUST BE LAST */
router.get("/:id", restaurantController.getById);

/* ======================================================
   OWNER CRUD
====================================================== */

router.post(
  "/owner/request",
  verifyAccessToken,
  restaurantController.create
);

router.put(
  "/owner/:id",
  verifyAccessToken,
  requireRole("owner"),
  restaurantController.update
);

router.put(
  "/owner/:id/status",
  verifyAccessToken,
  requireRole("owner"),
  restaurantController.toggleStatus
);

router.delete(
  "/owner/:id",
  verifyAccessToken,
  requireRole("owner"),
  restaurantController.remove
);

/* ======================================================
   ADMIN ROUTES
====================================================== */

router.get(
  "/admin/pending",
  verifyAccessToken,
  requireRole("admin"),
  restaurantController.getPendingRequests
);

router.put(
  "/admin/:id/approve",
  verifyAccessToken,
  requireRole("admin"),
  restaurantController.approveRestaurant
);

/* ======================================================
   REVIEWS (AUTH USERS)
====================================================== */

router.get("/:id/reviews", restaurantController.getReviews);

router.post(
  "/:id/reviews",
  verifyAccessToken,
  restaurantController.createReview
);

router.put(
  "/:id/reviews",
  verifyAccessToken,
  restaurantController.updateReview
);

router.delete(
  "/:id/reviews",
  verifyAccessToken,
  restaurantController.deleteReview
);

module.exports = router;


