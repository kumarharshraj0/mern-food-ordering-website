const express = require("express");
const router = express.Router();

const { verifyAccessToken, requireRole } = require("../middlewares/auth");
const orderController = require("../controllers/orderController");

/* ======================================================
   USER ROUTES
====================================================== */

// Create new order
router.post(
  "/",
  verifyAccessToken,
  orderController.createOrder
);

// Check review eligibility
router.get(
  "/check-eligibility",
  verifyAccessToken,
  orderController.checkReviewEligibility
);

// List logged-in user's orders
router.get(
  "/",
  verifyAccessToken,
  orderController.listMyOrders
);

// Get single order (user / admin)
router.get(
  "/:id",
  verifyAccessToken,
  orderController.getOrder
);

// Verify Razorpay payment
router.post(
  "/:id/pay",
  verifyAccessToken,
  orderController.verifyPayment
);

/* ======================================================
   RESTAURANT / ADMIN ROUTES
====================================================== */

// List orders for a restaurant
// restaurant → their own orders
// admin → pass ?restaurantId=
router.get(
  "/restaurant/orders",
  verifyAccessToken,
  requireRole("owner", "admin"),
  orderController.listMyRestaurantOrders
);

router.post('/:id/confirm-delivery', verifyAccessToken, orderController.confirmDeliveryWithOtp);



// Update order status
router.put(
  "/:id/status",
  verifyAccessToken,
  requireRole("owner", "admin"),
  orderController.updateOrderStatus
);

module.exports = router;

