const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("../models/Order");
const Product = require("../models/Product");

const SHIPPING_COST = 0;
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag";
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

const getRazorpayClient = () => {
  if (!razorpayKeyId || !razorpayKeySecret) {
    throw new Error("Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env");
  }

  return new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });
};

const resolveCart = async (cart = []) => {
  if (!cart.length) {
    throw new Error("Cart is empty");
  }

  const resolvedItems = [];
  let subtotal = 0;

  for (const item of cart) {
    const product = await Product.findById(item._id || item.productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const unitPrice = product.salePrice || product.price;
    subtotal += unitPrice * item.quantity;

    resolvedItems.push({
      productId: product._id,
      name: product.name,
      price: unitPrice,
      quantity: item.quantity,
      image: product.image,
    });
  }

  return {
    items: resolvedItems,
    subtotal,
    totalAmount: subtotal + SHIPPING_COST,
    shippingCost: SHIPPING_COST,
  };
};

const reserveStock = async (items = []) => {
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${item.name}`);
    }
    product.stock -= item.quantity;
    await product.save();
  }
};

const createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, address, phone, cart, paymentMethod, shippingAddress } = req.body;
    const summary = await resolveCart(cart);

    await reserveStock(summary.items);

    const order = await Order.create({
      user: req.user?._id,
      customerName,
      customerEmail,
      address,
      phone,
      shippingAddress,
      items: summary.items,
      totalAmount: summary.totalAmount,
      shippingCost: summary.shippingCost,
      paymentMethod: paymentMethod || "Cash on Delivery",
      paymentStatus: paymentMethod === "Razorpay" ? "Pending" : "COD Pending",
      status: "Pending",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message || "Server Error" });
  }
};

const createRazorpayOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, address, phone, cart, shippingAddress } = req.body;
    const summary = await resolveCart(cart);
    const razorpay = getRazorpayClient();

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(summary.totalAmount * 100),
      currency: "INR",
      receipt: `prima_${Date.now()}`,
      notes: {
        customerName,
        customerEmail,
        phone,
      },
    });

    const pendingOrder = await Order.create({
      user: req.user?._id,
      customerName,
      customerEmail,
      address,
      phone,
      shippingAddress,
      items: summary.items,
      totalAmount: summary.totalAmount,
      shippingCost: summary.shippingCost,
      paymentMethod: "Razorpay",
      paymentStatus: "Pending",
      razorpayOrderId: razorpayOrder.id,
      status: "Pending",
    });

    res.status(201).json({
      order: razorpayOrder,
      pendingOrderId: pendingOrder._id,
      amount: summary.totalAmount,
      key: razorpayKeyId,
    });
  } catch (error) {
    res.status(400).json({ message: error.message || "Server Error" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      pendingOrderId,
    } = req.body;

    if (!razorpayKeySecret) {
      return res.status(400).json({
        message: "Razorpay verification is not configured. Add RAZORPAY_KEY_SECRET in backend/.env",
      });
    }

    const expected = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const order = await Order.findById(pendingOrderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await reserveStock(order.items);

    order.razorpayOrderId = razorpay_order_id;
    order.razorpayPaymentId = razorpay_payment_id;
    order.paymentStatus = "Paid";
    await order.save();

    res.json({ message: "Payment verified successfully", order });
  } catch (error) {
    res.status(400).json({ message: error.message || "Server Error" });
  }
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getCustomerOrders = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({ message: "Delivered orders cannot be modified" });
    }

    if (status === "Cancelled" && order.status !== "Cancelled") {
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createOrder,
  createRazorpayOrder,
  verifyPayment,
  getAllOrders,
  getUserOrders,
  getCustomerOrders,
  updateOrderStatus,
  resolveCart,
};
