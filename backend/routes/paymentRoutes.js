const express = require("express");
const { verifyPayment } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/verify", protect, verifyPayment);

module.exports = router;
