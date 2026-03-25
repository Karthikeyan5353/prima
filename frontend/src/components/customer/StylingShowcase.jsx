import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/media";

const fallbackImages = {
  center:
    "https://images.unsplash.com/photo-1670229470875-880737e736d0?fm=jpg&ixlib=rb-4.0.3&q=80&w=1800",
  left:
    "https://images.unsplash.com/photo-1761479267943-2c984254807c?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1800",
  right:
    "https://images.unsplash.com/photo-1759651037868-eb8039c79ed1?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1800",
};

const StylingShowcase = ({ products = [] }) => {
  const navigate = useNavigate();
  const centerCard = products[0];
  const leftCard = products[1];
  const rightCard = products[2];

  return (
    <section className="styling-section">
      <div className="copy">
        <h2>Styling 101 With Prima</h2>
        <p>Trend-led jewellery styling with cleaner alignment and layered editorial cards.</p>
      </div>

      <div className="styling-stage">
        <motion.button
          type="button"
          className="style-card side left"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          onClick={() => navigate(leftCard?._id ? `/products/${leftCard._id}` : "/products")}
        >
          <img src={leftCard?.image ? getImageUrl(leftCard.image) : fallbackImages.left} alt={leftCard?.name || "Prima style"} />
          <div className="fade side-fade" />
          <div className="card-copy side-copy">
            <span>{leftCard?.category || "Signature"}</span>
            <h3>{leftCard?.name || "Day To Night Shine"}</h3>
          </div>
        </motion.button>

        <motion.button
          type="button"
          className="style-card center"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          onClick={() => navigate(centerCard?._id ? `/products/${centerCard._id}` : "/products")}
        >
          <img src={centerCard?.image ? getImageUrl(centerCard.image) : fallbackImages.center} alt={centerCard?.name || "Prima style"} />
          <div className="fade center-fade" />
          <div className="card-copy center-copy">
            <span>{centerCard?.category || "Editorial Pick"}</span>
            <h3>{centerCard?.name || "Modern Diamond Styling"}</h3>
            <p>Rich visual storytelling arranged in a layered premium composition.</p>
          </div>
        </motion.button>

        <motion.button
          type="button"
          className="style-card side right"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.04 }}
          onClick={() => navigate(rightCard?._id ? `/products/${rightCard._id}` : "/products")}
        >
          <img src={rightCard?.image ? getImageUrl(rightCard.image) : fallbackImages.right} alt={rightCard?.name || "Prima style"} />
          <div className="fade side-fade" />
          <div className="card-copy side-copy">
            <span>{rightCard?.category || "Occasion"}</span>
            <h3>{rightCard?.name || "Evening Brilliance"}</h3>
          </div>
        </motion.button>
      </div>

      <style jsx>{`
        .styling-section {
          margin: 84px 0 48px;
        }

        .copy {
          text-align: center;
          margin-bottom: 24px;
        }

        .copy h2 {
          margin: 0 0 8px;
          font-size: clamp(2.4rem, 4vw, 3.5rem);
          color: #2a1318;
        }

        .copy p {
          margin: 0;
          font-family: var(--font-heading);
          font-size: 1.15rem;
          color: #66505a;
        }

        .styling-stage {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(320px, 1.15fr) minmax(0, 0.9fr);
          align-items: end;
          gap: 24px;
          max-width: 1120px;
          margin: 0 auto;
          padding: 18px 0 0;
        }

        .style-card {
          position: relative;
          overflow: hidden;
          border: none;
          border-radius: 22px;
          padding: 0;
          background: #091722;
          text-align: left;
          cursor: pointer;
          box-shadow: 0 30px 60px -34px rgba(22, 22, 30, 0.42);
        }

        .style-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .style-card:hover img {
          transform: scale(1.04);
        }

        .center {
          z-index: 2;
          min-height: 620px;
          transform: translateY(0);
        }

        .side {
          z-index: 1;
          min-height: 440px;
        }

        .left,
        .right {
          margin-bottom: 56px;
        }

        .fade {
          position: absolute;
          inset: 0;
        }

        .side-fade {
          background: linear-gradient(180deg, rgba(8, 12, 18, 0.02), rgba(8, 12, 18, 0.78));
        }

        .center-fade {
          background: linear-gradient(180deg, rgba(16, 24, 32, 0.05), rgba(16, 24, 32, 0.82));
        }

        .card-copy {
          position: absolute;
          left: 18px;
          right: 18px;
          bottom: 18px;
          z-index: 1;
          color: white;
        }

        .card-copy span {
          display: inline-block;
          margin-bottom: 8px;
          font-size: 0.74rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.8);
        }

        .card-copy h3 {
          margin: 0;
          color: white;
          line-height: 1.12;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .side-copy h3 {
          font-size: 1.3rem;
          -webkit-line-clamp: 2;
        }

        .center-copy h3 {
          font-size: 2rem;
          -webkit-line-clamp: 2;
        }

        .center-copy p {
          margin: 10px 0 0;
          font-size: 0.96rem;
          line-height: 1.5;
          color: rgba(255,255,255,0.84);
        }

        @media (max-width: 1180px) {
          .styling-stage {
            grid-template-columns: minmax(0, 0.85fr) minmax(280px, 1.05fr) minmax(0, 0.85fr);
            gap: 18px;
          }

          .center {
            min-height: 540px;
          }

          .side {
            min-height: 380px;
          }

          .left,
          .right {
            margin-bottom: 36px;
          }
        }

        @media (max-width: 820px) {
          .styling-stage {
            display: grid;
            gap: 16px;
            grid-template-columns: 1fr;
            max-width: none;
            padding-top: 0;
          }

          .style-card,
          .center,
          .side {
            position: relative;
            min-height: 320px;
            margin-bottom: 0;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
};

export default StylingShowcase;
