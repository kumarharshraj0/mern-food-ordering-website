const cloudinary = require("../config/cloudinary");
const User = require("../models/User");
const transporter = require("../config/nodemailer");
const templates = require("../utils/emailTemplates");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ---------------------------------------------------
   SIGNUP
---------------------------------------------------- */
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });
    // Only allow specific roles to be set via signup
    const allowedRoles = ['user', 'deliveryBoy'];
    const assignedRoles = allowedRoles.includes(role) ? [role] : ['user'];



    const user = new User({
      name,
      email,
      roles: assignedRoles,
      isVerified: true
    });

    user.password = password; // Explicitly set to trigger isModified


    await user.save();


    res.status(201).json({
      message: "Account created successfully. You can now login."
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verification removed as per request

/* ---------------------------------------------------
   LOGIN
---------------------------------------------------- */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email }).select("+password");
    if (!user) {

      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);


    if (!validPassword)
      return res.status(400).json({ message: "Invalid credentials" });



    const accessToken = jwt.sign(
      { id: user._id, roles: user.roles },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------------------------------------
   REFRESH TOKEN
---------------------------------------------------- */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token provided" });

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err)
          return res.status(401).json({ message: "Invalid refresh token" });

        const user = await User.findById(decoded.id);
        if (!user)
          return res.status(404).json({ message: "User not found" });

        const newAccessToken = jwt.sign(
          { id: user._id, roles: user.roles },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: "15m" }
        );

        res.json({
          message: "Token refreshed",
          accessToken: newAccessToken
        });
      }
    );

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------------------------------------
   LOGOUT
---------------------------------------------------- */
exports.logout = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};

/* ---------------------------------------------------
   GET USER PROFILE
---------------------------------------------------- */
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({ user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------------------------------------
   FORGOT PASSWORD
---------------------------------------------------- */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const otp = user.generateResetPasswordOTP();
    await user.save({ validateBeforeSave: false });

    const mail = templates.resetPassword(otp);
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: mail.subject,
      html: mail.html
    });

    res.json({ message: "Password reset OTP sent to email" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------------------------------------
   RESET PASSWORD
---------------------------------------------------- */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const user = await User.findOne({
      email,
      resetPasswordOTP: hashedOtp,
      resetPasswordExpires: { $gt: Date.now() }
    }).select("+password");

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = password; // pre-save hook hashes
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------------------------------------
   UPLOAD PROFILE PICTURE
---------------------------------------------------- */
exports.uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const { image } = req.body;

    if (!image)
      return res.status(400).json({ message: "No image provided" });

    const uploaded = await cloudinary.uploader.upload(image, {
      folder: "profile_pictures"
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: uploaded.secure_url },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile picture uploaded",
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------------------------------------
   DELETE PROFILE PICTURE
---------------------------------------------------- */
exports.deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (!user.profileImage)
      return res.status(400).json({ message: "No profile picture to delete" });

    const publicId = user.profileImage
      .split("/")
      .slice(-2)
      .join("/")
      .split(".")[0];

    await cloudinary.uploader.destroy(publicId);

    user.profileImage = null;
    await user.save();

    res.json({
      message: "Profile picture deleted",
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------------------------------------
   CHANGE PASSWORD (LOGGED IN USER)
---------------------------------------------------- */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findById(userId).select("+password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Current password incorrect" });

    user.password = newPassword; // pre-save hook hashes
    await user.save();

    res.json({ message: "Password changed successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------------------------------------
   GOOGLE LOGIN
---------------------------------------------------- */
exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "No ID Token provided" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
      user = new User({
        name,
        email,
        roles: ["user"],
        isEmailVerified: true,
        profileImage: picture,
        googleId,
        password: crypto.randomBytes(16).toString("hex"), // Random password for social login
      });
      await user.save();

    } else {
      // Update googleId if not present
      if (!user.googleId) {
        user.googleId = googleId;
        if (!user.profileImage) user.profileImage = picture;
        await user.save();
      }

    }

    const accessToken = jwt.sign(
      { id: user._id, roles: user.roles },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error("[Google Login] Error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
};

