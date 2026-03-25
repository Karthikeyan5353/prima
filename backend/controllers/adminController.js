const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  try {
    const [totalOrders, totalProducts, totalCustomers, lowStockProducts, totalRevenueData, recentProducts] =
      await Promise.all([
        Order.countDocuments(),
        Product.countDocuments(),
        User.countDocuments({ role: "customer" }),
        Product.find({ stock: { $lt: 5 } }).sort({ stock: 1 }).limit(10),
        Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }]),
        Product.find().sort({ createdAt: -1 }).limit(10),
      ]);

    const totalRevenue = totalRevenueData.length > 0 ? totalRevenueData[0].totalRevenue : 0;

    res.json({
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      recentProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getDashboardStats };
