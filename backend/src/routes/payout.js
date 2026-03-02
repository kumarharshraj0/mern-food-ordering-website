const express = require("express");
const router = express.Router();
const { verifyAccessToken, requireRole } = require("../middlewares/auth");
const payoutController = require("../controllers/payoutController");

// Owner routes
router.get(
    "/earnings",
    verifyAccessToken,
    requireRole("owner"),
    payoutController.getEarnings
);

router.post(
    "/request",
    verifyAccessToken,
    requireRole("owner"),
    payoutController.requestPayout
);

router.get(
    "/history",
    verifyAccessToken,
    requireRole("owner"),
    payoutController.getOwnerPayouts
);

// Admin routes
router.get(
    "/admin/all",
    verifyAccessToken,
    requireRole("admin"),
    payoutController.getAdminPayouts
);

router.post(
    "/admin/batch-process",
    verifyAccessToken,
    requireRole("admin"),
    payoutController.processWeeklyPayouts
);

router.put(
    "/admin/:id",
    verifyAccessToken,
    requireRole("admin"),
    payoutController.updatePayoutStatus
);

// Get single payout (Dynamic ID - Keep at bottom)
router.get(
    "/:id",
    verifyAccessToken,
    payoutController.getPayoutDetails
);

module.exports = router;
