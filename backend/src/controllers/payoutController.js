const Payout = require("../models/Payout");
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");

/* ======================================================
   GET OWNER EARNINGS (AVAILABLE BALANCE)
====================================================== */
exports.getEarnings = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ owner: req.user._id });
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

        const unpaidOrders = await Order.find({
            restaurant: restaurant._id,
            status: "delivered",
            payoutStatus: "unpaid"
        });

        const commissionRate = restaurant.commissionRate || 30;
        const totalSales = unpaidOrders.reduce((acc, order) => acc + order.subtotal, 0);
        const availableBalance = Math.floor(totalSales * (1 - commissionRate / 100));

        const pendingPayouts = await Payout.find({
            restaurant: restaurant._id,
            status: "pending"
        });

        const pendingAmount = pendingPayouts.reduce((acc, p) => acc + p.amount, 0);

        res.json({
            availableBalance,
            pendingAmount,
            totalSales,
            commissionRate,
            currency: "INR"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ======================================================
   REQUEST PAYOUT
====================================================== */
exports.requestPayout = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ owner: req.user._id });
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

        // 1. Find all unpaid delivered orders
        const orders = await Order.find({
            restaurant: restaurant._id,
            status: "delivered",
            payoutStatus: "unpaid"
        });

        if (orders.length === 0) {
            return res.status(400).json({ message: "No earnings available for payout" });
        }

        const totalSales = orders.reduce((acc, order) => acc + order.subtotal, 0);
        const commissionRate = restaurant.commissionRate || 30;
        const commissionAmount = Math.floor(totalSales * (commissionRate / 100));
        const netAmount = totalSales - commissionAmount;

        // 2. Create Payout Request
        const payout = new Payout({
            restaurant: restaurant._id,
            owner: req.user._id,
            amount: netAmount, // Final amount to pay
            totalSales,
            commissionAmount,
            netAmount,
            commissionRate,
            orders: orders.map(o => o._id)
        });

        // 3. Mark orders as pending
        await Order.updateMany(
            { _id: { $in: orders.map(o => o._id) } },
            { $set: { payoutStatus: "pending" } }
        );

        await payout.save();

        res.status(201).json({ message: "Payout requested successfully", payout });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ======================================================
   GET OWNER PAYOUT HISTORY
====================================================== */
exports.getOwnerPayouts = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ owner: req.user._id });
        const payouts = await Payout.find({ restaurant: restaurant._id })
            .select("-orders") // keep list light
            .sort({ createdAt: -1 });
        res.json(payouts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ======================================================
   ADMIN: GET ALL PAYOUT REQUESTS
====================================================== */
exports.getAdminPayouts = async (req, res) => {
    try {
        const payouts = await Payout.find()
            .populate("restaurant", "name")
            .populate("owner", "name email")
            .sort({ createdAt: -1 });
        res.json(payouts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ======================================================
   ADMIN: UPDATE PAYOUT STATUS
====================================================== */
exports.updatePayoutStatus = async (req, res) => {
    try {
        const { status, transactionId, adminNote } = req.body;
        const payout = await Payout.findById(req.params.id);

        if (!payout) return res.status(404).json({ message: "Payout not found" });
        if (payout.status !== "pending") return res.status(400).json({ message: "Payout already processed" });

        payout.status = status;
        payout.transactionId = transactionId;
        payout.adminNote = adminNote;
        payout.processedAt = Date.now();

        if (status === "paid") {
            await Order.updateMany(
                { _id: { $in: payout.orders } },
                { $set: { payoutStatus: "paid" } }
            );
        } else if (status === "rejected") {
            await Order.updateMany(
                { _id: { $in: payout.orders } },
                { $set: { payoutStatus: "unpaid" } }
            );
        }

        await payout.save();
        res.json({ message: `Payout marked as ${status}`, payout });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ======================================================
   GET SINGLE PAYOUT DETAILS (BILL VIEW)
====================================================== */
exports.getPayoutDetails = async (req, res) => {
    try {
        const payout = await Payout.findById(req.params.id)
            .populate("restaurant", "name address phone image")
            .populate("owner", "name email")
            .populate({
                path: "orders",
                select: "items total subtotal status createdAt user",
                populate: { path: "user", select: "name email phone" }
            });

        if (!payout) return res.status(404).json({ message: "Payout not found" });

        // Security check
        if (!req.user.roles.includes("admin")) {
            const restaurant = await Restaurant.findOne({ owner: req.user._id });
            if (!restaurant) {
                console.log(`[PAYOUT] No restaurant found for owner ${req.user._id}`);
                return res.status(403).json({ message: "Forbidden: No restaurant found" });
            }

            const payoutRestId = payout.restaurant._id || payout.restaurant;
            if (payoutRestId.toString() !== restaurant._id.toString()) {
                console.log(`[PAYOUT] Security mismatch! Payout Rest: ${payoutRestId}, Owner Rest: ${restaurant._id}`);
                return res.status(403).json({ message: "Forbidden: Ownership mismatch" });
            }
        }

        res.json(payout);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ======================================================
   ADMIN: BATCH PROCESS WEEKLY SETTLEMENTS
====================================================== */
exports.processWeeklyPayouts = async (req, res) => {
    try {
        console.log("[PAYOUT] Starting Batch Weekly Settlement...");
        const restaurants = await Restaurant.find();
        let processedCount = 0;
        let totalAmount = 0;

        for (const restaurant of restaurants) {
            const orders = await Order.find({
                restaurant: restaurant._id,
                status: "delivered",
                payoutStatus: "unpaid"
            });

            if (orders.length > 0) {
                const totalSales = orders.reduce((acc, o) => acc + o.subtotal, 0);
                const commissionRate = restaurant.commissionRate || 30;
                const commissionAmount = Math.floor(totalSales * (commissionRate / 100));
                const netAmount = totalSales - commissionAmount;

                const payout = new Payout({
                    restaurant: restaurant._id,
                    owner: restaurant.owner,
                    amount: netAmount,
                    totalSales,
                    commissionAmount,
                    netAmount,
                    commissionRate,
                    orders: orders.map(o => o._id),
                    adminNote: "Automated Weekly Settlement"
                });

                await payout.save();

                await Order.updateMany(
                    { _id: { $in: orders.map(o => o._id) } },
                    { $set: { payoutStatus: "pending" } }
                );

                processedCount++;
                totalAmount += netAmount;
            }
        }

        res.json({
            message: `Successfully processed ${processedCount} restaurant settlements.`,
            totalNetPayout: totalAmount
        });
    } catch (err) {
        console.error("[PAYOUT] Batch error:", err);
        res.status(500).json({ message: err.message });
    }
};
