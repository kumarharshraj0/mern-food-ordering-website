const express = require('express');
const router = express.Router();
const { verifyAccessToken, requireRole } = require('../middlewares/auth');
const deliveryController = require('../controllers/deliveryController');

router.use(verifyAccessToken, requireRole('deliveryBoy'));

router.get('/assigned', deliveryController.listAssignedOrders);
router.get('/available', deliveryController.listAvailableOrders);
router.post('/accept/:id', deliveryController.acceptOrder);
router.get('/orders/:id', deliveryController.getOrder);
router.post('/orders/:id/update-status', deliveryController.updateStatus); // body: status
router.post('/orders/:id/verify-otp', deliveryController.verifyOtpByDelivery); // check OTP entered by user/delivery
router.post('/toggle-status', deliveryController.toggleStatus);
router.get('/deliveryBoyStats', deliveryController.getStats);
module.exports = router;
