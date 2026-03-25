const express = require("express");
const { createCartSummary } = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createCartSummary);

module.exports = router;
