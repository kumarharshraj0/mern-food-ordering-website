const Coupon = require("../models/Coupon");

/* =====================================================
   VALIDATE COUPON
===================================================== */
exports.validateCoupon = async (req, res) => {
    try {
        const { code, amount } = req.body;

        if (!code) {
            return res.status(400).json({ message: "Coupon code is required" });
        }

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true
        });

        if (!coupon) {
            return res.status(404).json({ message: "Invalid or inactive coupon code" });
        }

        // Check expiry
        if (coupon.expiryDate < new Date()) {
            return res.status(400).json({ message: "Coupon has expired" });
        }

        // Check usage limit
        if (coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: "Coupon usage limit reached" });
        }

        // Check minimum amount
        if (amount < coupon.minOrderAmount) {
            return res.status(400).json({
                message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`
            });
        }

        let discount = 0;
        if (coupon.discountType === "percentage") {
            discount = (amount * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        } else {
            discount = coupon.discountValue;
        }

        res.json({
            message: "Coupon applied successfully",
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                discountAmount: discount
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* =====================================================
   ADMIN: CREATE COUPON
===================================================== */
exports.createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json(coupon);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

/* =====================================================
   ADMIN: GET ALL COUPONS
===================================================== */
exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* =====================================================
   ADMIN: DELETE COUPON
===================================================== */
exports.deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: "Coupon deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
