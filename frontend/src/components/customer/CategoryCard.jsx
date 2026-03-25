import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/media";

const CategoryCard = ({ category, image, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.button
      type="button"
      className="category-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/products?category=${encodeURIComponent(category)}`)}
    >
      <div className="category-image-wrap">
        <img src={getImageUrl(image)} alt={category} className="category-image" />
      </div>
      <h3>{category}</h3>

      <style jsx>{`
        .category-card {
          width: 100%;
          background: transparent;
          border: none;
          overflow: hidden;
          cursor: pointer;
          text-align: center;
          padding: 0;
        }

        .category-image-wrap {
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: var(--bg-muted);
          border-radius: 18px;
          box-shadow: var(--shadow-sm);
        }

        .category-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .category-card:hover .category-image {
          transform: scale(1.08);
        }

        h3 {
          margin: 14px 0 0;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #1f1720;
        }
      `}</style>
    </motion.button>
  );
};

export default CategoryCard;
