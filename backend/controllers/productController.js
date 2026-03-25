const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

const buildSort = (sortBy) => {
  switch (sortBy) {
    case "priceAsc":
      return { salePrice: 1, price: 1 };
    case "priceDesc":
      return { salePrice: -1, price: -1 };
    case "newest":
    default:
      return { createdAt: -1 };
  }
};

const normalizeImages = (files = {}) => {
  const uploaded = [];

  if (files.image?.[0]?.filename) {
    uploaded.push(files.image[0].filename);
  }

  if (files.gallery?.length) {
    uploaded.push(...files.gallery.map((file) => file.filename));
  }

  return uploaded;
};

const recalculateRating = (reviews = []) => {
  if (!reviews.length) {
    return 4.5;
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Number((total / reviews.length).toFixed(1));
};

const parseOptionalNumber = (value, fallback = null) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const addProduct = async (req, res) => {
  try {
    const { name, category, description, price, salePrice, stock, arType, rating } = req.body;
    const imagePath = req.files?.image?.[0]?.filename || null;
    const model3dPath = req.files?.model3d?.[0]?.filename || null;
    const arImagePath = req.files?.arImage?.[0]?.filename || null;
    const images = normalizeImages(req.files);

    const newProduct = await Product.create({
      name,
      category,
      description,
      price: Number(price),
      salePrice: parseOptionalNumber(salePrice),
      stock: Number(stock),
      image: imagePath,
      images: images.length ? images : imagePath ? [imagePath] : [],
      model3d: model3dPath,
      arImage: arImagePath,
      arType: arType && arType !== "None" ? arType : null,
      rating: parseOptionalNumber(rating, 4.5),
    });

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const {
      category,
      search = "",
      minPrice,
      maxPrice,
      sortBy = "newest",
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      const searchTerms = search
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      filter.$or = [
        {
          name: {
            $regex: searchTerms.join("|"),
            $options: "i",
          },
        },
        {
          category: {
            $regex: searchTerms.join("|"),
            $options: "i",
          },
        },
      ];
    }

    if (minPrice || maxPrice) {
      const priceFilters = [];

      if (minPrice) {
        priceFilters.push({
          $gte: [{ $ifNull: ["$salePrice", "$price"] }, Number(minPrice)],
        });
      }

      if (maxPrice) {
        priceFilters.push({
          $lte: [{ $ifNull: ["$salePrice", "$price"] }, Number(maxPrice)],
        });
      }

      if (priceFilters.length) {
        filter.$expr = { $and: priceFilters };
      }
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(buildSort(sortBy)).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const images = normalizeImages(req.files);
    product.name = req.body.name ?? product.name;
    product.category = req.body.category ?? product.category;
    product.description = req.body.description ?? product.description;
    product.price = parseOptionalNumber(req.body.price, product.price);
    product.salePrice = parseOptionalNumber(req.body.salePrice, null);
    product.stock = parseOptionalNumber(req.body.stock, product.stock);
    product.image = req.files?.image?.[0]?.filename || product.image;
    product.model3d = req.files?.model3d?.[0]?.filename || product.model3d;
    product.arImage = req.files?.arImage?.[0]?.filename || product.arImage;
    product.images = images.length ? images : product.images;
    product.arType = req.body.arType && req.body.arType !== "None" ? req.body.arType : null;

    await product.save();

    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const hasPurchased = await Order.exists({
      user: req.user._id,
      status: { $ne: "Cancelled" },
      "items.productId": product._id,
    });

    if (!hasPurchased) {
      return res.status(403).json({
        message: "You can review this product only after purchasing it.",
      });
    }

    const existingReview = product.reviews.find(
      (review) => review.userEmail === req.user.email
    );

    if (existingReview) {
      existingReview.rating = Number(rating);
      existingReview.comment = comment;
    } else {
      product.reviews.unshift({
        userName: req.user.name,
        userEmail: req.user.email,
        rating: Number(rating),
        comment,
      });
    }

    product.rating = recalculateRating(product.reviews);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.id;
    const exists = user.wishlist.some((item) => String(item) === productId);

    user.wishlist = exists
      ? user.wishlist.filter((item) => String(item) !== productId)
      : [...user.wishlist, productId];

    await user.save();

    res.json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview,
  toggleWishlist,
};
