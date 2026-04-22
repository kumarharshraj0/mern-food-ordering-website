const Restaurant = require("../models/Restaurant");
const Review = require("../models/Review");
const Order = require("../models/Order");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");

/* =====================================================
   CREATE RESTAURANT (OWNER REQUEST)
===================================================== */
exports.create = async (req, res) => {
  try {
    const { images, email, address, ...payload } = req.body;

    // Check if user already owns a restaurant
    const existingOwner = await Restaurant.findOne({ owner: req.user._id });
    if (existingOwner)
      return res.status(400).json({ message: "You already have a restaurant" });

    // Check if email is already used
    const emailUsed = await Restaurant.findOne({ email });
    if (emailUsed)
      return res.status(400).json({ message: "This email is already associated with a restaurant" });

    payload.owner = req.user._id;
    payload.email = email;
    payload.isApproved = false; // admin approval
    payload.isOpen = true; // default open once approved
    payload.menuItems = [];

    // Set GEO location if provided
    if (address?.latitude && address?.longitude) {
      payload.address = address;
      payload.location = {
        type: "Point",
        coordinates: [address.longitude, address.latitude]
      };
    }

    const restaurant = await Restaurant.create(payload);

    // UPGRADE USER TO OWNER IMMEDIATELY
    const user = await User.findById(req.user._id);
    if (user && !user.roles.includes("owner")) {
      user.roles.push("owner");
      await user.save();

    }

    // Upload images if provided
    if (images && Array.isArray(images)) {
      const uploadedImages = [];
      for (const base64Image of images) {
        const uploadRes = await cloudinary.uploader.upload(base64Image, {
          folder: `restaurants/${restaurant._id}`,
          quality: "auto"
        });
        uploadedImages.push({
          public_id: uploadRes.public_id,
          url: uploadRes.secure_url
        });
      }
      restaurant.images.push(...uploadedImages);
      await restaurant.save();
    }

    res.status(201).json({
      message: "Restaurant request created. Waiting for admin approval.",
      restaurant
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   UPDATE RESTAURANT (OWNER OR ADMIN)
===================================================== */
exports.update = async (req, res) => {
  try {
    const { images, address, ...payload } = req.body;

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    // Check owner or admin
    const isOwner = restaurant.owner && restaurant.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.roles?.includes("admin");
    if (!isOwner && !isAdmin) return res.status(403).json({ message: "Forbidden" });

    // Update fields
    Object.assign(restaurant, payload);

    // Update GEO location
    if (address?.latitude && address?.longitude) {
      restaurant.address = address;
      restaurant.location = {
        type: "Point",
        coordinates: [address.longitude, address.latitude]
      };
    }

    // Upload new images
    if (images && Array.isArray(images)) {
      const newUploads = [];
      for (const base64Image of images) {
        const uploadRes = await cloudinary.uploader.upload(base64Image, {
          folder: `restaurants/${restaurant._id}`,
          quality: "auto"
        });
        newUploads.push({
          public_id: uploadRes.public_id,
          url: uploadRes.secure_url
        });
      }
      restaurant.images.push(...newUploads);
    }

    await restaurant.save();
    res.json({ message: "Restaurant updated", restaurant });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   TOGGLE RESTAURANT STATUS (OPEN/CLOSE)
===================================================== */
exports.toggleStatus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    // Check owner or admin
    const isOwner = restaurant.owner && restaurant.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.roles?.includes("admin");
    if (!isOwner && !isAdmin) return res.status(403).json({ message: "Forbidden" });

    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();

    res.json({
      message: `Restaurant is now ${restaurant.isOpen ? "Open" : "Closed"}`,
      isOpen: restaurant.isOpen
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   DELETE RESTAURANT (OWNER OR ADMIN)
===================================================== */
exports.remove = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const isOwner = restaurant.owner && restaurant.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.roles?.includes("admin");
    if (!isOwner && !isAdmin) return res.status(403).json({ message: "Forbidden" });

    await restaurant.deleteOne();
    res.json({ message: "Restaurant deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   GET RESTAURANT BY ID (WITH MENU)
===================================================== */
exports.getById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate("menuItems");
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   LIST RESTAURANTS (SEARCH + FILTER + PAGINATION)
===================================================== */
exports.getRestaurants = async (req, res) => {
  try {
    const { q, city, cuisine, rating, sort, page = 1, limit = 10 } = req.query;
    const filter = { isApproved: true };

    if (q) filter.$text = { $search: q };

    // Handle city/cities
    if (city) {
      const cityList = city.split(",").map(c => new RegExp(c.trim(), "i"));
      filter["address.city"] = { $in: cityList };
    }

    if (cuisine) filter.cuisineTypes = { $in: cuisine.split(",").map(c => new RegExp(`^${c.trim()}$`, "i")) };
    if (rating) filter.rating = { $gte: Number(rating) };

    let sortOption = { popularity: -1, createdAt: -1 };
    if (sort === "rating") sortOption = { rating: -1, popularity: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };
    if (sort === "popularity") sortOption = { popularity: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Restaurant.countDocuments(filter);

    const restaurants = await Restaurant.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort(sortOption);

    res.json({
      restaurants,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   GET NEAREST RESTAURANTS
===================================================== */
exports.getNearestRestaurants = async (req, res) => {
  try {
    const { latitude, longitude, limit = 10 } = req.query;
    if (!latitude || !longitude) return res.status(400).json({ message: "Latitude and longitude are required" });

    const restaurants = await Restaurant.find({
      isApproved: true,
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [Number(longitude), Number(latitude)] },
          $maxDistance: 10000
        }
      }
    }).limit(Number(limit));

    res.json({ nearest: restaurants });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   LIST PENDING RESTAURANT REQUESTS (ADMIN)
===================================================== */
exports.getPendingRequests = async (req, res) => {
  try {
    if (!req.user.roles?.includes("admin")) return res.status(403).json({ message: "Forbidden" });
    const requests = await Restaurant.find({ isApproved: false }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   APPROVE RESTAURANT (ADMIN)
===================================================== */
exports.approveRestaurant = async (req, res) => {
  try {
    if (!req.user.roles?.includes("admin")) return res.status(403).json({ message: "Forbidden" });

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    restaurant.isApproved = true;
    await restaurant.save();

    // UPGRADE USER TO OWNER
    if (restaurant.owner) {
      const ownerUser = await User.findById(restaurant.owner);
      if (ownerUser && !ownerUser.roles.includes("owner")) {
        ownerUser.roles.push("owner");
        await ownerUser.save();

      }
    }

    res.json({ message: "Restaurant approved and owner role assigned.", restaurant });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   GET ALL RESTAURANTS (ADMIN / PUBLIC)
===================================================== */
exports.getAllRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find().populate("owner", "name email");
    res.json(restaurants);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getmyResturants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user._id }).populate("owner", "name email");
    if (!restaurants) {
      return res.status(404).json({ message: "No restaurants found for this owner" });
    }
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   RESTAURANT REVIEWS
===================================================== */

exports.createReview = async (req, res) => {
  try {
    const { id: restaurantId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    // 1️⃣ Check if user has any delivered order from this restaurant
    const hasPurchased = await Order.findOne({
      user: userId,
      status: "delivered",
      restaurant: restaurantId
    });

    if (!hasPurchased) {
      return res.status(403).json({
        message: "You can only review restaurants you have ordered from."
      });
    }

    const existing = await Review.findOne({
      restaurant: restaurantId,
      menuItem: null, // General restaurant review
      user: userId,
    });

    if (existing)
      return res.status(400).json({ message: "Already reviewed this restaurant" });

    const review = await Review.create({
      restaurant: restaurantId,
      menuItem: null,
      user: userId,
      rating,
      comment,
    });

    // Update restaurant stats
    const stats = await Review.aggregate([
      { $match: { restaurant: new mongoose.Types.ObjectId(restaurantId), menuItem: null } },
      {
        $group: {
          _id: "$restaurant",
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const { avg, count } = stats[0] || { avg: rating, count: 1 };

    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: avg,
      reviewsCount: count,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { id: restaurantId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findOneAndUpdate(
      { restaurant: restaurantId, user: userId, menuItem: null },
      { rating, comment },
      { new: true }
    );

    if (!review)
      return res.status(404).json({ message: "Review not found" });

    const stats = await Review.aggregate([
      { $match: { restaurant: new mongoose.Types.ObjectId(restaurantId), menuItem: null } },
      {
        $group: {
          _id: "$restaurant",
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: stats[0].avg,
      reviewsCount: stats[0].count,
    });

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id: restaurantId } = req.params;
    const userId = req.user._id;

    const review = await Review.findOneAndDelete({
      restaurant: restaurantId,
      user: userId,
      menuItem: null
    });

    if (!review)
      return res.status(404).json({ message: "Review not found" });

    const stats = await Review.aggregate([
      { $match: { restaurant: new mongoose.Types.ObjectId(restaurantId), menuItem: null } },
      {
        $group: {
          _id: "$restaurant",
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const { avg = 0, count = 0 } = stats[0] || {};

    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: avg,
      reviewsCount: count,
    });

    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   GET REVIEWS
===================================================== */
exports.getReviews = async (req, res) => {
  try {
    const { id: restaurantId } = req.params;
    const reviews = await Review.find({ restaurant: restaurantId, menuItem: null })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
