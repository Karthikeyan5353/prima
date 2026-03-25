const express = require("express");
const {
  createOrder,
  createRazorpayOrder,
  getAllOrders,
  getUserOrders,
  getCustomerOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createOrder);
router.post("/create-order", protect, createRazorpayOrder);
router.get("/", protect, adminOnly, getAllOrders);
router.get("/user", protect, getUserOrders);
router.get("/customer/:email", protect, getCustomerOrders);
router.put("/:id", protect, adminOnly, updateOrderStatus);

module.exports = router;
