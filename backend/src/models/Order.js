const mongoose = require("mongoose");

/* ======================================================
   ORDER ITEM (MENU ITEM)
====================================================== */

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true
  },

  name: String,           // snapshot
  price: Number,          // base price



  addons: [
    {
      name: String,
      price: Number
    }
  ],

  qty: {
    type: Number,
    required: true
  },

  image: {
    public_id: String,
    url: String
  },

  isVeg: Boolean
});

/* ======================================================
   ORDER SCHEMA
====================================================== */

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },

    items: [orderItemSchema],

    subtotal: {
      type: Number,
      required: true
    },

    tax: {
      type: Number,
      default: 0
    },

    deliveryFee: {
      type: Number,
      default: 0
    },

    discount: {
      type: Number,
      default: 0
    },

    couponCode: String,

    total: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "razorpay", "stripe"],
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,

    status: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "preparing",
        "packed",
        "out for delivery",
        "delivered",
        "cancelled"
      ],
      default: "placed"
    },

    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      phone: String
    },

    deliveryAssignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    deliveryOtp: String,
    deliveryOtpVerified: {
      type: Boolean,
      default: false
    },

    payoutStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid"],
      default: "unpaid"
    },
    notes: String
  },
  { timestamps: true }
);

// Indexes for production performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model("Order", orderSchema);

