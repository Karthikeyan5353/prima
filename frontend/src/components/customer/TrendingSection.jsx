import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/media";

const TrendingSection = ({ products = [] }) => {
  const navigate = useNavigate();

  if (!products.length) {
    return null;
  }

  return (
    <section className="trending-section">
      <div className="copy">
        <h2>Trending Now</h2>
        <p>Pieces everyone is eyeing right now</p>
      </div>

      <div className="trending-grid">
        {products.slice(0, 3).map((product, index) => (
          <motion.button
            key={product._id}
            type="button"
            className="trend-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -8 }}
            onClick={() => navigate(`/products/${product._id}`)}
          >
            <div className="image-wrap">
              <img src={getImageUrl(product.image)} alt={product.name} />
            </div>
            <h3>{product.name}</h3>
          </motion.button>
        ))}
      </div>

      <style jsx>{`
        .trending-section {
          margin: 80px 0 72px;
        }

        .copy {
          text-align: center;
          margin-bottom: 30px;
        }

        .copy h2 {
          margin: 0 0 6px;
          font-size: clamp(2.2rem, 4vw, 2.9rem);
          color: #1b0f16;
        }

        .copy p {
          margin: 0;
          font-family: var(--font-heading);
          font-size: 1.15rem;
          color: #66505a;
        }

        .trending-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .trend-card {
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 0;
          text-align: center;
        }

        .image-wrap {
          overflow: hidden;
          border-radius: 18px;
          box-shadow: var(--shadow-sm);
          aspect-ratio: 4 / 4.2;
        }

        .image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .trend-card:hover img {
          transform: scale(1.06);
        }

        .trend-card h3 {
          margin: 14px 0 0;
          font-size: 1rem;
          color: #5d2430;
        }

        @media (max-width: 900px) {
          .trending-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default TrendingSection;
