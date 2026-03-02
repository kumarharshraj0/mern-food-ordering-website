const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const addressSchema = new mongoose.Schema({
  label: String,
  name: String,
  phone: String,
  street: String,
  line1: String,
  line2: String,
  city: String,
  state: String,
  pincode: String,
  country: { type: String, default: "India" },

  // ✅ Realtime Location
  latitude: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 },

  default: { type: Boolean, default: false }
});


const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    googleId: { type: String, unique: true, sparse: true },
    profileImage: { type: String },
    roles: { type: [String], default: ['user'] },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetPasswordOTP: { type: String },
    resetPasswordExpires: Date,
    refreshTokens: [{ token: String, createdAt: Date }],
    addresses: [addressSchema],
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }, // updated to MenuItem
        qty: { type: Number, default: 1 },
        price: Number,
        title: String,
        image: Object
      }
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],

    // ✅ Delivery boy fields
    isAvailable: { type: Boolean, default: true }, // is delivery boy available
    location: {                                    // GeoJSON coordinates
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    }

  },
  { timestamps: true }
);

// 2dsphere index for geospatial queries
userSchema.index({ location: '2dsphere' });

// Password hash
userSchema.pre('save', async function (next) {
  console.log(`[Model Pre-Save] Hook triggered for user: ${this.email}`);
  if (!this.isModified('password')) {
    console.log(`[Model Pre-Save] Password NOT modified, skipping hash`);
    return next();
  }

  console.log(`[Model Pre-Save] Hashing password for: ${this.email}`);
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  console.log(`[Model Pre-Save] Password hashed successfully`);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.generateVerificationToken = function () {
  this.verificationToken = uuidv4();
  return this.verificationToken;
};

/* OTP METHOD */
userSchema.methods.generateResetPasswordOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  this.resetPasswordOTP = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');

  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min

  return otp; // plain OTP for email
};

module.exports = mongoose.model('User', userSchema);

