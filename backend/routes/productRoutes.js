const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview,
  toggleWishlist,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "model/gltf-binary",
  "application/octet-stream",
]);

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".glb"]);

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    if (allowedMimeTypes.has(file.mimetype) || allowedExtensions.has(ext)) {
      return cb(null, true);
    }

    return cb(new Error("Unsupported file type. Please upload an image or GLB file."));
  },
});

const productUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "model3d", maxCount: 1 },
  { name: "arImage", maxCount: 1 },
  { name: "gallery", maxCount: 5 },
]);

const handleProductUpload = (req, res, next) => {
  productUpload(req, res, (error) => {
    if (error) {
      return res.status(400).json({ message: error.message || "Upload failed" });
    }
    next();
  });
};

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/add", protect, adminOnly, handleProductUpload, addProduct);
router.post("/:id/update", protect, adminOnly, handleProductUpload, updateProduct);
router.put("/:id", protect, adminOnly, handleProductUpload, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);
router.post("/:id/reviews", protect, addReview);
router.post("/:id/wishlist", protect, toggleWishlist);

module.exports = router;
