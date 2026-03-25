import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CartContext } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { ShoppingBag, Camera, Sparkles, Eye, Heart, Star } from "lucide-react";
import { getDiscountPercent, getDisplayPrice } from "../../utils/product";
import { getImageUrl } from "../../utils/media";

const ProductCard = ({ product, onTryOn }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const isOutOfStock = product.stock === 0;
  const hasAR = product.arType && product.arType !== "None";
  const discount = getDiscountPercent(product);

  return (
    <motion.div
      className="product-card group"
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/products/${product._id}`)}
    >
      <div className="product-image-container">
        {product.image ? (
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="product-image"
          />
        ) : (
          <div className="placeholder-image">No Image</div>
        )}

        <div className="product-badges">
          {discount ? <span className="badge badge-sale">-{discount}%</span> : null}
          {hasAR ? <span className="badge badge-ar"><Sparkles size={12} /> AR</span> : null}
          {isOutOfStock ? <span className="badge badge-out">Sold Out</span> : null}
        </div>

        <button
          className={`wishlist-btn ${isWishlisted(product._id) ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product._id);
          }}
        >
          <Heart size={16} fill={isWishlisted(product._id) ? "currentColor" : "transparent"} />
        </button>

        <div className="product-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${product._id}`);
            }}
            className="btn-icon-action"
            title="Quick View"
          >
            <Eye size={18} />
          </button>
          {hasAR ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTryOn(product);
              }}
              className="btn-icon-action btn-ar"
              title="Live Try-On"
            >
              <Camera size={18} />
            </button>
          ) : null}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) addToCart(product);
            }}
            disabled={isOutOfStock}
            className="btn-icon-action"
            title="Add to Cart"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>

      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-title">{product.name}</h3>
        <div className="rating-row">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={14}
              fill={index < Math.round(product.rating || 0) ? "#f59e0b" : "transparent"}
              color="#f59e0b"
            />
          ))}
          <span>{product.rating || 0}</span>
        </div>
        <div className="product-price">
          <span className={product.salePrice ? "price-sale" : "price-regular"}>
            Rs.{getDisplayPrice(product)}
          </span>
          {product.salePrice ? <span className="price-old">Rs.{product.price}</span> : null}
        </div>
      </div>

      <style jsx>{`
        .product-card { background: rgba(255,255,255,0.92); border-radius: var(--radius-card); overflow: hidden; box-shadow: var(--shadow-sm); position: relative; cursor: pointer; backdrop-filter: blur(10px); }
        .product-card:hover { box-shadow: var(--shadow-premium); }
        .product-image-container { position: relative; aspect-ratio: 1; overflow: hidden; background-color: var(--bg-muted); }
        .product-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .product-card:hover .product-image { transform: scale(1.08); }
        .product-badges { position: absolute; top: 10px; left: 10px; display: flex; flex-direction: column; gap: 6px; }
        .badge { padding: 4px 10px; border-radius: var(--radius-badge); font-size: 0.75rem; font-weight: 600; color: white; display: inline-flex; gap: 4px; align-items: center; }
        .badge-sale { background-color: var(--primary); }
        .badge-ar { background: linear-gradient(135deg, var(--primary), #d98aa1); }
        .badge-out { background-color: var(--dark-light); }
        .wishlist-btn { position: absolute; top: 10px; right: 10px; width: 36px; height: 36px; border-radius: 50%; border: none; background: rgba(255,255,255,0.92); color: var(--text-muted); display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm); transition: background-color 0.2s ease, color 0.2s ease; }
        .wishlist-btn.active { color: #7f2335; background: rgba(127,35,53,0.12); }
        .product-actions { position: absolute; bottom: 15px; right: 15px; display: flex; gap: 10px; opacity: 0; transform: translateY(12px); transition: all var(--transition-normal); }
        .product-card:hover .product-actions { opacity: 1; transform: translateY(0); }
        .btn-icon-action { width: 40px; height: 40px; border-radius: 50%; background: white; border: none; display: flex; align-items: center; justify-content: center; color: var(--dark); cursor: pointer; box-shadow: var(--shadow-md); transition: all var(--transition-fast); }
        .btn-icon-action:hover { background-color: var(--primary); color: white; }
        .btn-ar { background: linear-gradient(135deg, var(--primary), #d98aa1); color: white; }
        .product-info { padding: 15px; }
        .product-category { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
        .product-title { font-size: 1rem; font-weight: 500; color: var(--dark); margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .rating-row, .product-price { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .rating-row { margin-bottom: 8px; color: var(--text-muted); font-size: 0.85rem; }
        .price-regular, .price-sale { font-weight: 600; color: #7f2335; }
        .price-sale { color: #7f2335; }
        .price-old { text-decoration: line-through; color: #a35a6a; font-size: 0.9rem; }
      `}</style>
    </motion.div>
  );
};

export default ProductCard;
