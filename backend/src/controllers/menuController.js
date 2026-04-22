const MenuItem = require("../models/Menu");
const Review = require("../models/Review");
const Restaurant = require("../models/Restaurant");
const Order = require("../models/Order");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");

/* =====================================================
   CREATE MENU ITEM (ADMIN)
===================================================== */
exports.create = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      cuisine,
      isVeg,
      preparationTime,
      images,
    } = req.body;

    // 1️⃣ Find restaurant of logged-in owner
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // 2️⃣ Create menu item (WITH REQUIRED FIELDS)
    const item = await MenuItem.create({
      name,
      description,
      price,
      category,
      cuisine,
      isVeg,
      preparationTime,

      restaurant: restaurant._id,   // ✅ REQUIRED
      createdBy: req.user._id,      // ✅ REQUIRED

      images: [], // initialize
    });

    // 3️⃣ Upload images to Cloudinary
    if (images && Array.isArray(images)) {
      const uploadedImages = [];

      for (const base64Image of images) {
        const uploadRes = await cloudinary.uploader.upload(base64Image, {
          folder: `menu/${item._id}`,
          quality: "auto",
        });

        uploadedImages.push({
          public_id: uploadRes.public_id,
          url: uploadRes.secure_url,
        });
      }

      item.images.push(...uploadedImages);
      await item.save();
    }

    // 4️⃣ Push menu item into restaurant
    restaurant.menuItems.push(item._id);
    await restaurant.save();

    // 5️⃣ Response
    res.status(201).json({
      message: "Menu item created successfully",
      item,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
/* =====================================================
   UPDATE MENU ITEM (ADMIN)
===================================================== */
exports.update = async (req, res) => {
  try {
    const { images, ...payload } = req.body;

    const item = await MenuItem.findById(req.params.id).populate("restaurant");
    if (!item)
      return res.status(404).json({ message: "Menu item not found" });

    // ✅ CHECK AUTHORIZATION (Owner or Admin)
    const isAdmin = req.user.roles.includes("admin");
    const isOwner = item.restaurant && item.restaurant.owner.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Forbidden: You don't own this restaurant" });
    }

    Object.assign(item, payload);

    if (images && Array.isArray(images)) {
      const newUploads = [];

      for (const base64Image of images) {
        const uploadRes = await cloudinary.uploader.upload(base64Image, {
          folder: `menu/${item._id}`,
          quality: "auto",
        });

        newUploads.push({
          public_id: uploadRes.public_id,
          url: uploadRes.secure_url,
        });
      }

      item.images.push(...newUploads);
    }

    await item.save();
    res.json({ message: "Menu item updated", item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   DELETE MENU ITEM (ADMIN)
===================================================== */
exports.remove = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate("restaurant");
    if (!item)
      return res.status(404).json({ message: "Menu item not found" });

    // ✅ CHECK AUTHORIZATION (Owner or Admin)
    const isAdmin = req.user.roles.includes("admin");
    const isOwner = item.restaurant && item.restaurant.owner.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Forbidden: You don't own this restaurant" });
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    // ✅ Remove menu from restaurant
    if (item.restaurant) {
      await Restaurant.findByIdAndUpdate(item.restaurant._id, {
        $pull: { menuItems: item._id },
      });
    }

    res.json({ message: "Menu item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   GET MENU ITEM BY ID
===================================================== */
exports.getById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id)
      .populate("restaurant", "name")
      .populate("createdBy", "name");

    if (!item)
      return res.status(404).json({ message: "Menu item not found" });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   LIST MENU ITEMS (SEARCH + FILTER + SORT)
===================================================== */
exports.getMenu = async (req, res) => {
  try {
    const {
      q,
      category,
      cuisine,
      isVeg,
      minPrice,
      maxPrice,
      restaurant, // ✅ Match frontend usage
      sort,
      page = 1,
      limit = 8,
    } = req.query;

    const filter = {};

    if (q) filter.name = { $regex: q, $options: "i" };
    if (category) filter.category = { $in: category.split(",").map(cat => new RegExp(`^${cat.trim()}$`, "i")) };
    if (cuisine) filter.cuisine = { $in: cuisine.split(",").map(c => new RegExp(`^${c.trim()}$`, "i")) };
    if (isVeg !== undefined) filter.isVeg = isVeg === "true";
    if (restaurant) filter.restaurant = restaurant; // ✅ Apply filter

    filter.price = {
      $gte: Number(minPrice) || 0,
      $lte: Number(maxPrice) || 5000,
    };

    let sortOption = {};
    if (sort === "price_asc") sortOption.price = 1;
    if (sort === "price_desc") sortOption.price = -1;
    if (sort === "newest") sortOption.createdAt = -1;
    if (sort === "rating") sortOption.rating = -1;
    if (sort === "popular") sortOption.popularity = -1;

    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;

    const total = await MenuItem.countDocuments(filter);

    const items = await MenuItem.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(perPage)
      .populate("restaurant", "name");

    res.json({
      items,
      pagination: {
        page: currentPage,
        limit: perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   LATEST MENU ITEMS
===================================================== */
exports.getLatestMenu = async (req, res) => {
  try {
    const items = await MenuItem.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("restaurant", "name");

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   CREATE REVIEW
===================================================== */
exports.createReview = async (req, res) => {
  try {
    const { id: menuItemId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    // 1️⃣ Find the menu item and its restaurant
    const item = await MenuItem.findById(menuItemId);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    // 2️⃣ Check if user has a delivered order for this item
    const hasPurchased = await Order.findOne({
      user: userId,
      status: "delivered",
      "items.menuItem": menuItemId
    });

    if (!hasPurchased) {
      return res.status(403).json({
        message: "You can only review items you have purchased and received."
      });
    }

    const existing = await Review.findOne({
      menuItem: menuItemId,
      user: userId,
    });

    if (existing)
      return res.status(400).json({ message: "Already reviewed" });

    const review = await Review.create({
      restaurant: item.restaurant, // Required field
      menuItem: menuItemId,
      user: userId,
      rating,
      comment,
    });

    const stats = await Review.aggregate([
      { $match: { menuItem: new mongoose.Types.ObjectId(menuItemId) } },
      {
        $group: {
          _id: "$menuItem",
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const { avg, count } = stats[0] || { avg: rating, count: 1 };

    await MenuItem.findByIdAndUpdate(menuItemId, {
      rating: avg,
      reviewsCount: count,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   UPDATE REVIEW
===================================================== */
exports.updateReview = async (req, res) => {
  try {
    const { id: menuItemId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findOneAndUpdate(
      { menuItem: menuItemId, user: userId },
      { rating, comment },
      { new: true }
    );

    if (!review)
      return res.status(404).json({ message: "Review not found" });

    const stats = await Review.aggregate([
      { $match: { menuItem: new mongoose.Types.ObjectId(menuItemId) } },
      {
        $group: {
          _id: "$menuItem",
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    await MenuItem.findByIdAndUpdate(menuItemId, {
      rating: stats[0].avg,
      reviewsCount: stats[0].count,
    });

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   DELETE REVIEW
===================================================== */
exports.deleteReview = async (req, res) => {
  try {
    const { id: menuItemId } = req.params;
    const userId = req.user._id;

    const review = await Review.findOneAndDelete({
      menuItem: menuItemId,
      user: userId,
    });

    if (!review)
      return res.status(404).json({ message: "Review not found" });

    const stats = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(menuItemId) } },
      {
        $group: {
          _id: "$product",
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const { avg = 0, count = 0 } = stats[0] || {};

    await MenuItem.findByIdAndUpdate(menuItemId, {
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
    const { id: menuItemId } = req.params;
    const reviews = await Review.find({ menuItem: menuItemId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
