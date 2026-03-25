const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    stock: { type: Number, required: true },
    image: { type: String },
    images: [{ type: String }],
    model3d: { type: String },
    arImage: { type: String },
    arType: {
      type: String,
      enum: ["earring", "chain"],
      default: null,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
