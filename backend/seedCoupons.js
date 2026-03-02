require("dotenv").config();
const mongoose = require("mongoose");
const Coupon = require("./src/models/Coupon");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/food-delivery";

const seedCoupons = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing
        await Coupon.deleteMany({});

        const coupons = [
            {
                code: "WELCOME50",
                discountType: "percentage",
                discountValue: 50,
                minOrderAmount: 200,
                maxDiscount: 150,
                expiryDate: new Date("2026-12-31"),
                usageLimit: 1000,
                description: "50% OFF on your first order (Max ₹150)"
            },
            {
                code: "FOODIE20",
                discountType: "percentage",
                discountValue: 20,
                minOrderAmount: 100,
                maxDiscount: 100,
                expiryDate: new Date("2026-12-31"),
                usageLimit: 500,
                description: "Flat 20% OFF on all orders"
            },
            {
                code: "SAVEMORE",
                discountType: "fixed",
                discountValue: 50,
                minOrderAmount: 300,
                expiryDate: new Date("2026-12-31"),
                description: "Flat ₹50 OFF on orders above ₹300"
            }
        ];

        await Coupon.insertMany(coupons);
        console.log("Coupons seeded successfully! ✅");
        process.exit();
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedCoupons();
