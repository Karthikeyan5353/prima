const { resolveCart } = require("./orderController");

const createCartSummary = async (req, res) => {
  try {
    const summary = await resolveCart(req.body.cart || []);
    res.json(summary);
  } catch (error) {
    res.status(400).json({ message: error.message || "Server Error" });
  }
};

module.exports = { createCartSummary };
