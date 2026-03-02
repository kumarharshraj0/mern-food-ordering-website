const Order = require('../models/Order');
const transporter = require('../config/nodemailer');
const templates = require('../utils/emailTemplates');


exports.listAssignedOrders = async (req, res, next) => {
  try {


    const orders = await Order.find({
      deliveryAssignedTo: req.user._id,
      status: { $ne: 'delivered' }
    })
      .select("-deliveryOtp")
      .sort({ createdAt: -1 })
      .populate('restaurant', 'name location address phone image');


    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .select("-deliveryOtp")
      .populate('user', 'name phone email')
      .populate('restaurant', 'name location address phone image');

    if (!order) return res.status(404).json({ message: 'Not found' });
    if (!order.deliveryAssignedTo?.equals(req.user._id)) return res.status(403).json({ message: 'Not assigned' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Not found' });
    if (!order.deliveryAssignedTo?.equals(req.user._id)) return res.status(403).json({ message: 'Not assigned' });

    // 🔥 NEW: Check for OTP verification before marking as DELIVERED
    if (status === 'delivered') {
      if (!order.deliveryOtpVerified) {
        return res.status(400).json({ message: 'Please verify the Delivery OTP first.' });
      }
    }

    // 🔥 GENERATE OTP when going "out for delivery"
    if (status === 'out for delivery' && !order.deliveryOtp) {
      order.deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();

      // 📧 SEND EMAIL TO CUSTOMER
      try {
        const orderWithUser = await Order.findById(order._id).populate('user');
        if (orderWithUser?.user?.email) {
          const mail = templates.deliveryOtp(order.deliveryOtp);
          await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: orderWithUser.user.email,
            subject: mail.subject,
            html: mail.html
          });
          // Email logic here

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
        userId: order.user,
        status: order.status
      });
    }

    res.status(200).json({ order, message: 'Status updated' });
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ message: err.message });
    next(err);
  }
};

exports.verifyOtpByDelivery = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const order = await Order.findById(req.params.id).populate('user');
    if (!order) return res.status(404).json({ message: 'Not found' });
    if (!order.deliveryAssignedTo?.equals(req.user._id)) return res.status(403).json({ message: 'Not assigned' });
    // Debug logging to file
    const logData = `[${new Date().toISOString()}] \nOrder: ${req.params.id} \nStored: "${order.deliveryOtp}" \nReceived: "${otp}" \nMatch: ${String(order.deliveryOtp).trim() === String(otp).trim()}\n---\n`;
    fs.appendFileSync(path.join(__dirname, '../../otp_debug.log'), logData);

    if (String(order.deliveryOtp).trim() !== String(otp).trim()) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // 🔥 NEW: Only verify, don't complete status yet
    order.deliveryOtpVerified = true;
    await order.save();

    // 🔥 EMIT SOCKET EVENT for OTP Verification (Optional for real-time UI)
    const io = req.app.get('io');
    if (io) {
      io.emit('orderOtpVerified', {
        orderId: order._id,
        userId: order.user,
        verified: true
      });
    }

    res.json({ success: true, message: 'OTP Verified successfully!' });
  } catch (err) {
    next(err);
  }
};

exports.listAvailableOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      status: 'out for delivery',
      deliveryAssignedTo: { $exists: false }
    }).populate('restaurant', 'name location address');

    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.acceptOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.deliveryAssignedTo) return res.status(400).json({ message: 'Order already claimed' });

    order.deliveryAssignedTo = req.user._id;
    await order.save();

    // Notify others that order is taken
    const io = req.app.get('io');
    if (io) {
      io.emit('orderClaimed', { orderId: order._id });
      io.emit('orderStatusUpdate', {
        orderId: order._id,
        userId: order.user,
        status: order.status
      });
    }

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

exports.toggleStatus = async (req, res, next) => {
  try {
    const user = await req.user;
    user.isAvailable = !user.isAvailable;
    await user.save();
    res.json({ success: true, isAvailable: user.isAvailable });
  } catch (err) {
    next(err);
  }
};


exports.getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    /* --------------------------- DATE RANGES --------------------------- */

    // Today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Week (last 7 days)
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    // Month (last 30 days)
    const monthStart = new Date();
    monthStart.setDate(monthStart.getDate() - 30);

    /* ---------------------- OVERALL STAT COUNTS ----------------------- */
    const totalDeliveries = await Order.countDocuments({
      deliveryAssignedTo: userId,
    });

    const pendingDeliveries = await Order.countDocuments({
      deliveryAssignedTo: userId,
      status: { $in: ["packed", "out for delivery"] },
    });

    const completedDeliveries = await Order.countDocuments({
      deliveryAssignedTo: userId,
      status: "delivered",
    });

    /* ---------------------- TODAY'S STAT COUNTS ----------------------- */
    const todayDeliveries = await Order.countDocuments({
      deliveryAssignedTo: userId,
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    const todayCompleted = await Order.countDocuments({
      deliveryAssignedTo: userId,
      status: "delivered",
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    /* ---------------------- WEEKLY STAT COUNTS ------------------------ */
    const weeklyDeliveries = await Order.countDocuments({
      deliveryAssignedTo: userId,
      createdAt: { $gte: weekStart },
    });

    const weeklyCompleted = await Order.countDocuments({
      deliveryAssignedTo: userId,
      status: "delivered",
      createdAt: { $gte: weekStart },
    });

    /* ---------------------- MONTHLY STAT COUNTS ----------------------- */
    const monthlyDeliveries = await Order.countDocuments({
      deliveryAssignedTo: userId,
      createdAt: { $gte: monthStart },
    });

    const monthlyCompleted = await Order.countDocuments({
      deliveryAssignedTo: userId,
      status: "delivered",
      createdAt: { $gte: monthStart },
    });

    /* --------------------------- RESPONSE ----------------------------- */
    res.status(200).json({
      success: true,
      stats: {
        overall: {
          totalDeliveries,
          pendingDeliveries,
          completedDeliveries,
          totalEarnings: completedDeliveries * 40, // ₹40 per delivery
        },
        today: {
          total: todayDeliveries,
          completed: todayCompleted,
          earnings: todayCompleted * 40,
        },
        weekly: {
          total: weeklyDeliveries,
          completed: weeklyCompleted,
          earnings: weeklyCompleted * 40,
        },
        monthly: {
          total: monthlyDeliveries,
          completed: monthlyCompleted,
          earnings: monthlyCompleted * 40,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
