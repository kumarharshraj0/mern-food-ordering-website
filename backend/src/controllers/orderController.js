const Order = require("../models/Order");
const MenuItem = require("../models/Menu");
const Restaurant = require("../models/Restaurant");
const Review = require("../models/Review");
const transporter = require("../config/nodemailer");
const templates = require("../utils/emailTemplates");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Coupon = require("../models/Coupon"); // ✅ Import Coupon

/* ======================================================
   RAZORPAY INSTANCE
====================================================== */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/* ======================================================
   CREATE ORDER
====================================================== */
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      deliveryAddress,
      paymentMethod,
      deliveryFee = 0,
      notes,
      couponCode // ✅ Accept coupon code
    } = req.body;

    console.log("CREATE ORDER PAYLOAD:", req.body);

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    /* ================= RESTAURANT ================= */
    const restaurantId = items[0].restaurant;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    /* ================= BUILD ORDER ITEMS ================= */
    let subtotal = 0;
    const orderItems = [];

    for (const it of items) {
      const menuItem = await MenuItem.findById(it.menuItem);

      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({
          message: `Item unavailable: ${menuItem?.name || "Unknown"}`
        });
      }

      // 🔥 FIX: frontend sends quantity, schema expects qty
      const qty = Number(it.quantity || 0);
      if (qty <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      // 🔥 FIX: trust backend price
      const price = Number(menuItem.price);
      const itemTotal = price * qty;

      subtotal += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        qty,
        price,
        totalPrice: itemTotal,
        addons: it.addons || [],
        image: menuItem.images?.[0] || null, // Capture first image from array
        isVeg: menuItem.isVeg
      });
    }

    /* ================= TOTAL ================= */
    const tax = 0;
    let discount = 0;

    // ✅ Apply Coupon Logic (Server-Side Validation)
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiryDate: { $gte: new Date() }
      });

      if (coupon && subtotal >= coupon.minOrderAmount && coupon.usedCount < coupon.usageLimit) {
        if (coupon.discountType === "percentage") {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.discountValue;
        }

        // Update coupon usage
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const total = subtotal + deliveryFee + tax - discount;

    /* ================= CREATE ORDER ================= */
    const order = await Order.create({
      user: req.user._id,
      restaurant: restaurantId,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      discount,     // ✅ Save discount
      couponCode,   // ✅ Save code applied
      total,
      paymentMethod: paymentMethod === "online" ? "razorpay" : "cod",
      paymentStatus: "pending",
      deliveryAddress,
      notes
    });

    /* ================= RAZORPAY ================= */
    let razorpayOrder = null;

    if (paymentMethod === "online") {
      razorpayOrder = await razorpay.orders.create({
        amount: Math.round(total * 100), // paise
        currency: "INR",
        receipt: order._id.toString()
      });

      order.razorpayOrderId = razorpayOrder.id;
      await order.save();
    }

    res.status(201).json({
      order,
      razorpayOrder
    });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   VERIFY RAZORPAY PAYMENT
====================================================== */
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayPaymentId, razorpaySignature } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(order.razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      order.paymentStatus = "failed";
      await order.save();
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    order.paymentStatus = "paid";
    order.razorpayPaymentId = razorpayPaymentId;
    order.status = "confirmed";

    await order.save();

    res.json({
      message: "Payment verified successfully",
      order
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   GET SINGLE ORDER
====================================================== */
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("restaurant", "name location address")
      .populate("user", "name email")
      .populate("deliveryAssignedTo", "name phone location isAvailable")
      .populate("items.menuItem", "images"); // Populate for image fallback

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.roles.includes("admin")
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   LIST USER ORDERS
====================================================== */
exports.listMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("restaurant", "name")
      .populate("items.menuItem", "images"); // Populate for image fallback

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   LIST RESTAURANT ORDERS
====================================================== */
exports.listMyRestaurantOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found for this owner"
      });
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .select("-deliveryOtp")
      .sort({ createdAt: -1 })
      .populate("user", "name email phone")
      .populate("restaurant", "name")
      .populate("items.menuItem", "images"); // Populate for image fallback

    res.status(200).json(orders);
    console.log("my resturant Orders:", orders);
  } catch (err) {
    console.error("LIST MY RESTAURANT ORDERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   UPDATE ORDER STATUS
====================================================== */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      "placed",
      "confirmed",
      "preparing",
      "packed",
      "out for delivery",
      "delivered",
      "cancelled"
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔥 GENERATE OTP when going "out for delivery"
    if (status === "out for delivery" && !order.deliveryOtp) {
      order.deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();

      // 📧 SEND EMAIL TO CUSTOMER
      try {
        const orderWithUser = await Order.findById(order._id).populate('user');
        if (orderWithUser?.user?.email) {
          const mail = templates.deliveryOtp(order.deliveryOtp);
          const io = req.app.get('io'); // reuse io if needed, but transporter is global
          await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: orderWithUser.user.email,
            subject: mail.subject,
            html: mail.html
          });
          console.log(`OTP Email sent to ${orderWithUser.user.email}`);
        }
      } catch (emailErr) {
        console.error("FAILED TO SEND OTP EMAIL:", emailErr);
      }
    }

    order.status = status;
    await order.save();

    // 🔥 EMIT SOCKET EVENT
    const io = req.app.get('io');
    if (io) {
      io.emit('orderStatusUpdate', {
        orderId: order._id,
        status: order.status,
        userId: order.user
      });
    }

    res.json({ message: "Order status updated", order });

    // 🔥 BROADCAST TO MARKETPLACE if "out for delivery" and no rider
    if (status === "out for delivery" && !order.deliveryAssignedTo) {
      if (io) {
        io.emit('newOrderAvailable', {
          orderId: order._id,
          restaurant: order.restaurant?.name || "New Restaurant",
          total: order.total
        });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   CONFIRM DELIVERY WITH OTP
====================================================== */
exports.confirmDeliveryWithOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (String(order.deliveryOtp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    order.status = "delivered";
    await order.save();

    res.json({ message: "Delivery confirmed", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   CHECK REVIEW ELIGIBILITY
====================================================== */
exports.checkReviewEligibility = async (req, res) => {
  try {
    const { restaurantId, menuItemId } = req.query;
    const userId = req.user._id;

    if (menuItemId) {
      const hasPurchased = await Order.findOne({
        user: userId,
        status: "delivered",
        "items.menuItem": menuItemId
      });

      const alreadyReviewed = await Review.findOne({
        user: userId,
        menuItem: menuItemId
      });

      return res.json({
        eligible: !!hasPurchased && !alreadyReviewed,
        purchased: !!hasPurchased,
        alreadyReviewed: !!alreadyReviewed
      });
    }

    if (restaurantId) {
      const hasPurchased = await Order.findOne({
        user: userId,
        status: "delivered",
        restaurant: restaurantId
      });

      const alreadyReviewed = await Review.findOne({
        user: userId,
        restaurant: restaurantId,
        menuItem: null
      });

      return res.json({
        eligible: !!hasPurchased && !alreadyReviewed,
        purchased: !!hasPurchased,
        alreadyReviewed: !!alreadyReviewed
      });
    }

    res.status(400).json({ message: "restaurantId or menuItemId required" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};