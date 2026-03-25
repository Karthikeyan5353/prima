import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/media";

const fallbackImages = {
  banner:
    "https://images.unsplash.com/photo-1759651037868-eb8039c79ed1?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2200",
  left:
    "https://images.unsplash.com/photo-1670229470875-880737e736d0?fm=jpg&ixlib=rb-4.0.3&q=80&w=1800",
  right:
    "https://images.unsplash.com/photo-1761479267943-2c984254807c?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1800",
};

const CollectionsShowcase = ({ products = [] }) => {
  const navigate = useNavigate();
  const leadProduct = products[0];
  const leftCard = products[1];
  const rightCard = products[2];

  return (
    <section className="showcase-section">
      <motion.div
        className="showcase-stage"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <div className="showcase-hero">
          <img
            src={leadProduct?.image ? getImageUrl(leadProduct.image) : fallbackImages.banner}
            alt={leadProduct?.name || "New arrivals"}
          />
          <div className="showcase-overlay" />
          <div className="showcase-copy">
            <div className="chip">
              <Sparkles size={15} />
              <span>{products.length || 3}+ featured pieces</span>
            </div>
            <h2>New Arrivals</h2>
            <p>Fresh drops with a richer editorial presentation and premium visual storytelling.</p>
          </div>
        </div>

        <div className="floating-grid">
          <motion.button
            type="button"
            className="feature-card"
            whileHover={{ y: -6 }}
            onClick={() => (leftCard ? navigate(`/products/${leftCard._id}`) : navigate("/products"))}
          >
            <img
              src={leftCard?.image ? getImageUrl(leftCard.image) : fallbackImages.left}
              alt={leftCard?.name || "Featured collection"}
            />
            <div className="card-copy">
              <h3>{leftCard?.name || "Gold Essentials"}</h3>
            </div>
          </motion.button>

          <motion.button
            type="button"
            className="feature-card"
            whileHover={{ y: -6 }}
            onClick={() => (rightCard ? navigate(`/products/${rightCard._id}`) : navigate("/products"))}
          >
            <img
              src={rightCard?.image ? getImageUrl(rightCard.image) : fallbackImages.right}
              alt={rightCard?.name || "Featured collection"}
            />
            <div className="card-copy">
              <h3>{rightCard?.name || "Floral Bloom"}</h3>
            </div>
          </motion.button>
        </div>
      </motion.div>

      <style jsx>{`
        .showcase-section {
          margin: 88px 0 120px;
        }

        .showcase-stage {
          position: relative;
        }

        .showcase-hero {
          position: relative;
          min-height: 450px;
          overflow: hidden;
          background: #d8c9bb;
        }

        .showcase-hero img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .showcase-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(78, 50, 28, 0.46), rgba(78, 50, 28, 0.1));
        }

        .showcase-copy {
          position: relative;
          z-index: 1;
          max-width: 560px;
          padding: 72px 58px;
          color: white;
        }

        .chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          padding: 8px 14px;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(10px);
          margin-bottom: 18px;
        }

        .showcase-copy h2 {
          margin: 0 0 14px;
          font-size: clamp(2.8rem, 5vw, 4.5rem);
          color: white;
        }

        .showcase-copy p {
          margin: 0;
          font-size: 1.15rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.9);
        }

        .floating-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 28px;
          margin-top: 24px;
        }

        .feature-card {
          position: relative;
          border: 8px solid #fff;
          border-radius: 18px;
          overflow: hidden;
          padding: 0;
          background: white;
          cursor: pointer;
          box-shadow: 0 24px 50px -34px rgba(36, 17, 22, 0.45);
          min-height: 280px;
        }

        .feature-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .feature-card:hover img {
          transform: scale(1.04);
        }

        .card-copy {
          position: absolute;
          left: 18px;
          right: 18px;
          bottom: 18px;
          padding: 14px 16px;
          border-radius: 14px;
          background: linear-gradient(180deg, rgba(27, 16, 17, 0.08), rgba(27, 16, 17, 0.72));
        }

        .card-copy h3 {
          margin: 0;
          color: white;
          font-size: 1.32rem;
          line-height: 1.15;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-align: left;
        }

        @media (max-width: 900px) {
          .showcase-section {
            margin-bottom: 50px;
          }

          .showcase-hero {
            min-height: 340px;
          }

          .showcase-copy {
            padding: 30px 22px;
          }

          .showcase-copy h2 {
            font-size: 2.4rem;
          }

          .floating-grid { grid-template-columns: 1fr; gap: 16px; margin-top: 18px; }

          .feature-card {
            min-height: 240px;
          }
        }
      `}</style>
    </section>
  );
};

export default CollectionsShowcase;
