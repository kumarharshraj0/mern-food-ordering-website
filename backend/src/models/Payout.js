const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
    {
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "paid", "rejected"],
            default: "pending"
        },
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order"
            }
        ],
        transactionId: String,
        processedAt: Date,
        adminNote: String,

        // Commission Breakdown
        totalSales: { type: Number, default: 0 },
        commissionAmount: { type: Number, default: 0 },
        netAmount: { type: Number, default: 0 }, // Same as 'amount' but explicit
        commissionRate: { type: Number, default: 30 },

        // RazorpayX Fields
        razorpayPayoutId: String,
        razorpayStatus: {
            type: String,
            enum: ["queued", "pending", "rejected", "processed", "reversed", "cancelled", null],
            default: null
        },
        failureReason: String
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payout", payoutSchema);
