import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Truck, Star, Zap } from "lucide-react";
import Swal from "sweetalert2";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/common/Loader";
import ModelViewer3D from "../../components/customer/ModelViewer3D";
import api from "../../utils/api";
import { getDisplayPrice } from "../../utils/product";
import { getImageUrl } from "../../utils/media";

const renderStars = (rating) =>
  Array.from({ length: 5 }).map((_, index) => (
    <Star
      key={index}
      size={16}
      fill={index < Math.round(rating) ? "#f59e0b" : "transparent"}
      color="#f59e0b"
    />
  ));

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [viewMode, setViewMode] = useState("image");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [{ data }, ordersResponse] = await Promise.all([
          api.get(`/products/${id}`),
          user ? api.get("/orders/user") : Promise.resolve({ data: [] }),
        ]);
        setProduct(data);
        setActiveImage(data.images?.[0] || data.image);
        setViewMode(data.model3d ? "model" : "image");
        setCanReview(
          (ordersResponse.data || []).some(
            (order) =>
              order.status !== "Cancelled" &&
              (order.items || []).some(
                (item) => String(item.productId) === String(id)
              )
          )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.post(`/products/${id}/reviews`, reviewForm);
    setProduct(data);
    setReviewForm({ rating: 5, comment: "" });
    Swal.fire({ icon: "success", title: "Review added", confirmButtonColor: "#B76E79" });
  };

  if (loading) {
    return <Loader text="Loading product details..." />;
  }

  if (!product) {
    return <div className="card">Product not found.</div>;
  }

  const images = product.images?.length ? product.images : [product.image];
  const deliveryDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString();

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="product-details-page">
      <div className="details-grid">
        <div className="gallery-card">
          {product.model3d ? (
            <div className="view-toggle">
              <button
                type="button"
                className={`toggle-btn ${viewMode === "image" ? "active" : ""}`}
                onClick={() => setViewMode("image")}
              >
                Images
              </button>
              <button
                type="button"
                className={`toggle-btn ${viewMode === "model" ? "active" : ""}`}
                onClick={() => setViewMode("model")}
              >
                View 3D
              </button>
            </div>
          ) : null}
          <div className="main-image">
            {viewMode === "model" && product.model3d ? (
              <ModelViewer3D src={product.model3d} alt={product.name} />
            ) : (
              <img src={getImageUrl(activeImage)} alt={product.name} />
            )}
          </div>
          {viewMode === "image" ? (
            <div className="thumb-row">
              {images.map((image) => (
                <button
                  key={image}
                  className={`thumb-btn ${activeImage === image ? "active" : ""}`}
                  onClick={() => setActiveImage(image)}
                >
                  <img src={getImageUrl(image)} alt={product.name} />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="info-card">
          <p className="product-category">{product.category}</p>
          {product.model3d || product.arType ? (
            <div className="capability-row">
              {product.arType ? <span className="capability-chip">AR Available</span> : null}
              {product.model3d ? <span className="capability-chip">3D View Available</span> : null}
            </div>
          ) : null}
          <h1>{product.name}</h1>
          <div className="rating-row">
            {renderStars(product.rating || 0)}
            <span>{product.rating || 0}</span>
            <span className="text-muted">({product.reviews?.length || 0} reviews)</span>
          </div>
          <div className="price-row">
            <span className="price-current">Rs.{getDisplayPrice(product)}</span>
            {product.salePrice ? <span className="price-old">Rs.{product.price}</span> : null}
          </div>
          <p className="desc">{product.description}</p>
          <div className="meta-card">
            <p>Available stock: <strong>{product.stock}</strong></p>
            <p className="delivery"><Truck size={16} /> Estimated delivery by {deliveryDate}</p>
          </div>

          <div className="action-row">
            <button className="btn btn-outline" onClick={() => addToCart(product)}>
              <ShoppingBag size={18} /> Add To Cart
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                addToCart(product);
                navigate("/checkout");
              }}
            >
              <Zap size={18} /> Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="reviews-section card">
        <div className="reviews-header flex-between">
          <h3>Reviews</h3>
          <span className="text-muted">{product.reviews?.length || 0} customer reviews</span>
        </div>

        {user && canReview ? (
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <select
              className="form-input"
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>{value} Stars</option>
              ))}
            </select>
            <textarea
              className="form-input"
              rows="3"
              placeholder="Write your review"
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              required
            />
            <button className="btn btn-primary" type="submit">Submit Review</button>
          </form>
        ) : (
          <p className="review-note text-muted">
            {user
              ? "You can write a review after purchasing this product."
              : "Login and purchase this product to leave a review."}
          </p>
        )}

        <div className="review-list">
          {(product.reviews || []).map((review) => (
            <div key={`${review.userEmail}-${review.createdAt}`} className="review-item">
              <div className="flex-between">
                <strong>{review.userName}</strong>
                <div className="rating-row">{renderStars(review.rating)}</div>
              </div>
              <p>{review.comment}</p>
              <span className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .product-details-page { display: grid; gap: 24px; }
        .details-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 24px; }
        .gallery-card, .info-card { background: white; border-radius: var(--radius-card); box-shadow: var(--shadow-sm); padding: 24px; }
        .view-toggle { display: inline-flex; gap: 10px; margin-bottom: 14px; background: rgba(183,110,121,0.06); padding: 6px; border-radius: 999px; }
        .toggle-btn { border: none; background: transparent; padding: 8px 14px; border-radius: 999px; color: var(--text-muted); }
        .toggle-btn.active { background: white; color: var(--primary); box-shadow: var(--shadow-sm); }
        .main-image { aspect-ratio: 1; overflow: hidden; border-radius: 16px; background: var(--bg-muted); }
        .main-image img, .thumb-btn img { width: 100%; height: 100%; object-fit: cover; }
        .thumb-row { display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
        .thumb-btn { width: 72px; height: 72px; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: white; }
        .thumb-btn.active { border-color: var(--primary); }
        .capability-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
        .capability-chip { display: inline-flex; align-items: center; padding: 7px 12px; border-radius: 999px; background: rgba(183,110,121,0.08); color: var(--primary); font-size: 0.88rem; font-weight: 600; }
        .rating-row, .action-row, .price-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .price-current { font-size: 1.8rem; font-weight: 700; color: #7f2335; }
        .price-old { color: #a35a6a; text-decoration: line-through; }
        .meta-card { background: rgba(183,110,121,0.06); border-radius: 16px; padding: 16px; margin: 20px 0; }
        .delivery { display: flex; gap: 8px; align-items: center; }
        .reviews-section { padding: 28px; }
        .reviews-header { margin-bottom: 18px; align-items: flex-start; gap: 12px; }
        .reviews-header h3 { margin: 0; }
        .review-form { display: grid; gap: 14px; margin-bottom: 20px; }
        .review-note { margin: 0 0 20px; padding: 14px 16px; background: rgba(183,110,121,0.05); border-radius: 12px; }
        .review-list { display: grid; gap: 0; }
        .review-item { padding: 18px 0; border-top: 1px solid var(--border); }
        .review-item p { margin: 8px 0 6px; }
        @media (max-width: 900px) { .details-grid { grid-template-columns: 1fr; } }
      `}</style>
    </motion.div>
  );
};

export default ProductDetails;
