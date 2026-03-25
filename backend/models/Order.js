const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    shippingAddress: {
      fullName: String,
      addressLine: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ["Razorpay", "Cash on Delivery"],
      default: "Cash on Delivery",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "COD Pending"],
      default: "Pending",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
