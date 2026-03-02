const express = require('express');
const router = express.Router();
const { verifyAccessToken, requireRole } = require('../middlewares/auth');
const adminController = require('../controllers/adminController');

// Only admin can access these routes
router.use(verifyAccessToken, requireRole('admin'));

/* ======================================================
   DASHBOARD STATS
====================================================== */
router.get('/dashboard-stats', adminController.getStats);

/* ======================================================
   ORDERS
====================================================== */
router.get('/orders', adminController.listOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);
router.put('/orders/:id/assign-delivery', adminController.assignDelivery);

/* ======================================================
   USERS
====================================================== */
router.get('/users', adminController.listUsers);

/* ======================================================
   MENU ITEMS (Previously products)
====================================================== */
router.get('/menu-items', adminController.listMenuItems); // <-- updated

/* ======================================================
   DELIVERY BOYS
====================================================== */
router.post('/create-delivery-boy', adminController.createDeliveryBoy);
router.get('/delivery-boys', adminController.getAllDeliveryBoys);

module.exports = router;

