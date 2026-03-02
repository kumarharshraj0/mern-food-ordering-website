const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyAccessToken } = require('../middlewares/auth');

// ---------------------------
// PUBLIC ROUTES (No access token needed)
// ---------------------------

// Signup
router.post('/signup', authController.signup);

// Verify email (Removed as per request)
// router.post('/verify-email', authController.verifyEmail);

// Login
router.post('/login', authController.login);

// Refresh token
router.post('/refresh-token', authController.refreshToken);

// Forgot password
router.post('/forgot-password', authController.forgotPassword);

// Reset password
router.post('/reset-password', authController.resetPassword);

router.post(
  "/change-password",
  verifyAccessToken, // same middleware you use for /me
  authController.changePassword
);


// Logout
router.post('/logout', authController.logout);

// Google Login
router.post('/google-login', authController.googleLogin);

// ---------------------------
// PROTECTED ROUTES (Require access token)
// ---------------------------

// Get user profile
router.get('/profile', verifyAccessToken, authController.me);
router.post("/upload-profile", verifyAccessToken, authController.uploadProfilePicture);

router.delete("/delete-profile-picture", verifyAccessToken, authController.deleteProfilePicture);

module.exports = router;

