const express = require("express");
const router = express.Router();

const { verifyAccessToken, requireRole } = require("../middlewares/auth");
const couponController = require("../controllers/couponController");

/* ======================================================
   PUBLIC/AUTHENTICATED ROUTES
====================================================== */
router.post("/validate", verifyAccessToken, couponController.validateCoupon);

/* ======================================================
   ADMIN ROUTES
====================================================== */
router.post("/", verifyAccessToken, requireRole("admin"), couponController.createCoupon);
router.get("/", verifyAccessToken, requireRole("admin"), couponController.getAllCoupons);
router.delete("/:id", verifyAccessToken, requireRole("admin"), couponController.deleteCoupon);

module.exports = router;
