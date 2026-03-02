const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../middlewares/auth');
const usersController = require('../controllers/usersController');

router.get('/me', verifyAccessToken, usersController.me);
router.put('/me', verifyAccessToken, usersController.updateProfile);
router.post('/avatar', verifyAccessToken, usersController.uploadAvatar);
router.post('/addresses', verifyAccessToken, usersController.addAddress);
router.put('/addresses/:id', verifyAccessToken, usersController.updateAddress);
router.delete('/addresses/:id', verifyAccessToken, usersController.deleteAddress);
router.put('/location', verifyAccessToken, usersController.updateLocation);
router.delete('/location', verifyAccessToken, usersController.deleteLocation);


module.exports = router;
