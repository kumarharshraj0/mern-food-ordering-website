const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', index: true }, // null for general restaurant review
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String
  },
  { timestamps: true }
);

// One review per user for the restaurant itself + one review per user for each menu item
reviewSchema.index({ user: 1, restaurant: 1, menuItem: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
