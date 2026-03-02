const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshTokens');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const payload = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, payload, { new: true }).select('-password -refreshTokens');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    const { dataUrl } = req.body;
    if (!dataUrl) return res.status(400).json({ message: 'No image provided' });
    const upload = await cloudinary.uploader.upload(dataUrl, { folder: 'avatars', transformation: [{ width: 500, height: 500, crop: 'thumb' }] });
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: { public_id: upload.public_id, url: upload.secure_url } }, { new: true }).select('-password -refreshTokens');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const {
      label,
      name,
      phone,
      street,
      line1,
      line2,
      city,
      state,
      pincode,
      country,
      latitude,
      longitude,
      default: isDefault
    } = req.body;

    // If new address is default → unset old default
    if (isDefault) {
      user.addresses.forEach(addr => (addr.default = false));
    }

    user.addresses.push({
      label,
      name,
      phone,
      street,
      line1,
      line2,
      city,
      state,
      pincode,
      country,
      latitude,
      longitude,
      default: isDefault || false
    });

    await user.save();
    res.json(user.addresses);

  } catch (err) {
    next(err);
  }
};


exports.updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    const address = user.addresses.id(id);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    const {
      label,
      name,
      phone,
      street,
      line1,
      line2,
      city,
      state,
      pincode,
      country,
      latitude,
      longitude,
      default: isDefault
    } = req.body;

    // Update fields
    Object.assign(address, {
      label,
      name,
      phone,
      street,
      line1,
      line2,
      city,
      state,
      pincode,
      country,
      latitude,
      longitude
    });

    // Handle default logic
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.default = addr._id.equals(id);
      });
    }

    await user.save();
    res.json(user.addresses);

  } catch (err) {
    next(err);
  }
};


exports.deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    user.addresses.id(id)?.remove();
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    next(err);
  }
};



// UPDATE REALTIME LOCATION
exports.updateLocation = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude]
        }
      },
      { new: true }
    ).select("-password -refreshTokens");

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// DELETE REALTIME LOCATION
exports.deleteLocation = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: { location: "" }
      },
      { new: true }
    ).select("-password -refreshTokens");

    res.json(user);
  } catch (err) {
    next(err);
  }
};
