const Order = require('../models/Order');
const MenuItem = require('../models/Menu');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const transporter = require('../config/nodemailer');
const templates = require('../utils/emailTemplates');
const { calculateDistance } = require('../utils/distance'); // helper function to calculate distance in km

// Live delivery boy locations (userId -> { latitude, longitude })
// In production, this can be stored in Redis or any in-memory DB
const deliveryLocations = {};

/* ======================================================
   ADMIN STATS
====================================================== */
exports.getStats = async (req, res, next) => {
  try {
    const [totalSalesAgg] = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, totalSales: { $sum: "$total" }, ordersCount: { $sum: 1 } } }
    ]);

    const deliveryBoyCount = await User.countDocuments({ roles: { $in: ["deliveryBoy"] } });
    const menuCount = await MenuItem.countDocuments();

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const monthlySales = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: { $month: "$createdAt" }, total: { $sum: "$total" } } },
      { $sort: { "_id": 1 } }
    ]);

    const weeklySales = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: { $week: "$createdAt" }, total: { $sum: "$total" } } },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      totalSales: totalSalesAgg?.totalSales || 0,
      ordersCount: totalSalesAgg?.ordersCount || 0,
      deliveryBoyCount,
      menuCount,
      ordersByStatus,
      monthlySales,
      weeklySales
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
    next(err);
  }
};

/* ======================================================
   LIST ORDERS
====================================================== */
exports.listOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone')
      .populate('restaurant', 'name')
      .populate('deliveryAssignedTo', 'name phone');
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

/* ======================================================
   UPDATE ORDER STATUS
====================================================== */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("user");

    if (!order) return res.status(404).json({ message: "Order not found" });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: order.user.email,
      subject: templates.orderStatusUpdate(order, status).subject,
      html: templates.orderStatusUpdate(order, status).html,
    });

    if (status.toLowerCase() === "shipped") {
      order.deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();
      await order.save();

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: order.user.email,
        subject: templates.deliveryOtp(order.deliveryOtp).subject,
        html: templates.deliveryOtp(order.deliveryOtp).html,
      });
    }

    return res.status(200).json({ message: "Order status updated", order });

  } catch (err) {
    res.status(500).json({ message: err.message });
    next(err);
  }
};

/* ======================================================
   ASSIGN DELIVERY (REAL-WORLD STYLE)
====================================================== */
exports.assignDelivery = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate('restaurant').populate('user');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.deliveryAssignedTo) {
      return res.status(400).json({ message: 'Delivery already assigned' });
    }

    // Find all available delivery boys
    const deliveryBoys = await User.find({
      roles: 'deliveryBoy',
      isAvailable: true
    });

    if (!deliveryBoys.length) return res.status(400).json({ message: 'No available delivery boy' });

    // Determine nearest delivery boy based on order delivery location
    const { latitude, longitude } = order.deliveryAddress; // order must have lat/lng
    let nearestBoy = null;
    let minDistance = Infinity;

    for (const boy of deliveryBoys) {
      const loc = deliveryLocations[boy._id];
      if (!loc) continue;

      const distance = calculateDistance(latitude, longitude, loc.latitude, loc.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        nearestBoy = boy;
      }
    }

    if (!nearestBoy) return res.status(400).json({ message: 'No delivery boy with live location available' });

    // Assign delivery boy
    order.deliveryAssignedTo = nearestBoy._id;
    order.status = 'assigned';
    await order.save();

    // Notify delivery boy
    const io = req.app.get('io');
    if (io) {
      io.emit('deliveryAssigned', {
        orderId: order._id,
        deliveryBoyId: nearestBoy._id,
        message: 'New delivery assigned to you!'
      });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: nearestBoy.email,
      subject: `New delivery assigned: Order ${order._id}`,
      html: `
        <p>You have been assigned to deliver order <b>${order._id}</b>.</p>
        <p>Customer: ${order.user.name}, Address: ${order.deliveryAddress.street}, ${order.deliveryAddress.city}</p>
        <p>Please update the order status once picked up and delivered.</p>
      `
    });

    res.json({
      message: 'Delivery assigned to nearest delivery boy successfully',
      order,
      deliveryBoy: { name: nearestBoy.name, email: nearestBoy.email }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
    next(err);
  }
};

/* ======================================================
   LIST USERS
====================================================== */
exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password -refreshTokens');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

/* ======================================================
   LIST MENU ITEMS
====================================================== */
exports.listMenuItems = async (req, res, next) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (err) {
    next(err);
  }
};

/* ======================================================
   CREATE DELIVERY BOY
====================================================== */
exports.createDeliveryBoy = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already in use' });

    user = new User({
      name,
      email,
      password,
      roles: ['deliveryBoy'],
      isVerified: true,
      isAvailable: true
    });

    await user.save();

    res.json({ message: 'Delivery Boy account created successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   GET ALL DELIVERY BOYS
====================================================== */
exports.getAllDeliveryBoys = async (req, res, next) => {
  try {
    const deliveryBoys = await User.find({ roles: 'deliveryBoy' });
    res.json(deliveryBoys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   GET ALL RESTAURANTS
====================================================== */
exports.getAllRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find().populate('owner', 'name email');
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

