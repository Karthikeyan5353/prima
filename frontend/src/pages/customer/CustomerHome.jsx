import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  LogOut,
  Package as PackageIcon,
  ShoppingBag,
  Sparkles,
  Star,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import Loader from "../../components/common/Loader";
import api from "../../utils/api";
import { getImageUrl } from "../../utils/media";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: "easeOut" },
  }),
};

const editorialFallbacks = {
  arrivalsBackdrop:
    "https://images.unsplash.com/photo-1759651037868-eb8039c79ed1?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2200",
  arrivalsCardLeft:
    "https://images.unsplash.com/photo-1670229470875-880737e736d0?fm=jpg&ixlib=rb-4.0.3&q=80&w=1800",
  arrivalsCardRight:
    "https://images.unsplash.com/photo-1761479267943-2c984254807c?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1800",
  stylingCenter:
    "https://images.unsplash.com/photo-1670229470875-880737e736d0?fm=jpg&ixlib=rb-4.0.3&q=80&w=1800",
  stylingLeft:
    "https://images.unsplash.com/photo-1761479267943-2c984254807c?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1800",
  stylingRight:
    "https://images.unsplash.com/photo-1759651037868-eb8039c79ed1?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1800",
};

const CustomerHome = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products", { params: { limit: 40 } });
        setProducts((data.products || []).filter((item) => item.image));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const heroProducts = useMemo(() => products.slice(0, 5), [products]);

  const categoryGroups = useMemo(() => {
    const unique = new Map();

    products.forEach((product) => {
      if (!product.category || unique.has(product.category)) {
        return;
      }

      unique.set(product.category, product);
    });

    return Array.from(unique.values()).slice(0, 6);
  }, [products]);

  const signatureProducts = useMemo(() => products.slice(5, 9), [products]);
  const newArrivals = useMemo(() => products.slice(9, 12), [products]);
  const spotlightProducts = useMemo(
    () => [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4),
    [products]
  );
  const stylingCards = useMemo(
    () => [...products].filter((item) => item.image).slice(12, 17),
    [products]
  );

  const quickActions = [
    {
      title: "Shop Collection",
      desc: "Browse the latest catalogue and premium arrivals.",
      icon: ShoppingBag,
      action: () => navigate("/products"),
    },
    {
      title: "My Orders",
      desc: "Track active orders and revisit past purchases.",
      icon: PackageIcon,
      action: () => navigate("/my-orders"),
    },
    {
      title: "Wishlist",
      desc: `${wishlist.length} saved styles waiting for you.`,
      icon: Heart,
      action: () => navigate("/products?wishlist=1"),
    },
    {
      title: "Sign Out",
      desc: "Securely log out of your boutique account.",
      icon: LogOut,
      action: () => {
        logout();
        navigate("/");
      },
    },
  ];

  if (!user) {
    return null;
  }

  if (loading) {
    return <Loader text="Designing your boutique homepage..." />;
  }

  if (!products.length) {
    return (
      <div className="home-empty">
        <h2>Catalogue unavailable</h2>
        <p className="text-muted">Add products with images to unlock the new storefront experience.</p>
      </div>
    );
  }

  const heroMain = heroProducts[0];
  const heroSecondary = heroProducts.slice(1, 3);
  const arrivalsLead = newArrivals[0];
  const arrivalsShowcase = [
    newArrivals[1]
      ? {
          id: newArrivals[1]._id,
          title: newArrivals[1].name,
          image: getImageUrl(newArrivals[1].image),
          action: () => navigate(`/products/${newArrivals[1]._id}`),
        }
      : {
          id: "online-left",
          title: "Gold Essentials",
          image: editorialFallbacks.arrivalsCardLeft,
          action: () => navigate("/products"),
        },
    newArrivals[2]
      ? {
          id: newArrivals[2]._id,
          title: newArrivals[2].name,
          image: getImageUrl(newArrivals[2].image),
          action: () => navigate(`/products/${newArrivals[2]._id}`),
        }
      : {
          id: "online-right",
          title: "Floral Bloom",
          image: editorialFallbacks.arrivalsCardRight,
          action: () => navigate("/products"),
        },
  ];

  return (
    <div className="customer-home">
      <motion.section
        className="welcome-strip"
        initial="hidden"
        animate="show"
        variants={fadeUp}
        custom={0}
      >
        <div>
          <p className="eyebrow">Curated for {user.name}</p>
          <h1>Modern boutique stories with richer motion, imagery, and premium composition.</h1>
        </div>
        <button type="button" className="primary-pill" onClick={() => navigate("/products")}>
          Explore Collections <ArrowRight size={18} />
        </button>
      </motion.section>

      <section className="hero-editorial">
        {heroMain ? (
          <motion.button
            type="button"
            className="hero-card hero-main"
            onClick={() => navigate(`/products/${heroMain._id}`)}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={0.05}
          >
            <img src={getImageUrl(heroMain.image)} alt={heroMain.name} />
            <div className="hero-overlay warm" />
            <div className="hero-copy">
              <span>{heroMain.category}</span>
              <h2>{heroMain.name}</h2>
              <p>Designed to feel editorial, immersive, and premium from the first fold.</p>
            </div>
          </motion.button>
        ) : null}

        <div className="hero-stack">
          {heroSecondary.map((product, index) => (
            <motion.button
              key={product._id}
              type="button"
              className="hero-card hero-side"
              onClick={() => navigate(`/products/${product._id}`)}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={0.12 + index * 0.08}
            >
              <img src={getImageUrl(product.image)} alt={product.name} />
              <div className="hero-overlay blush" />
              <div className="hero-copy compact">
                <span>{product.category}</span>
                <h3>{product.name}</h3>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <motion.section
        className="category-story"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <div className="section-heading centered">
          <p className="eyebrow">Shop By Category</p>
          <h2>A cleaner, richer storefront grid</h2>
          <p className="section-text">Using your real catalog images to create a sharper premium browsing experience.</p>
        </div>

        <div className="category-grid">
          {categoryGroups.map((product, index) => (
            <motion.button
              key={product.category}
              type="button"
              className={`category-panel ${index === 0 || index === 5 ? "tall" : ""}`}
              onClick={() => navigate(`/products?category=${encodeURIComponent(product.category)}`)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.18 }}
              variants={fadeUp}
              custom={index * 0.05}
              whileHover={{ y: -8 }}
            >
              <img src={getImageUrl(product.image)} alt={product.category} />
              <div className="panel-gradient" />
              <div className="panel-copy">
                <h3>{product.category}</h3>
                <span>View Collection</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      <section className="world-section">
        <motion.div
          className="section-heading centered"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <p className="eyebrow">Prima World</p>
          <h2>A companion for occasion, gifting, and statement styling</h2>
        </motion.div>

        <div className="world-grid">
          {signatureProducts.map((product, index) => (
            <motion.button
              key={product._id}
              type="button"
              className="world-tile"
              onClick={() => navigate(`/products/${product._id}`)}
              initial={{ opacity: 0, y: 26, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              whileHover={{ y: -6 }}
            >
              <img src={getImageUrl(product.image)} alt={product.name} />
              <div className="world-fade" />
              <div className="world-copy">
                <span>{product.category}</span>
                <h3>{product.name}</h3>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {arrivalsLead ? (
        <section className="arrivals-section">
          <motion.div
            className="arrivals-stage"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
          >
            <div className="arrivals-hero">
              <img
                src={editorialFallbacks.arrivalsBackdrop}
                alt="Luxury jewelry arrivals"
              />
              <div className="arrivals-overlay" />
              <div className="arrivals-copy">
                <div className="badge-line">
                  <Sparkles size={16} />
                  <span>{newArrivals.length}+ fresh picks</span>
                </div>
                <h2>New arrivals in a richer editorial layout</h2>
                <p>Daily drops, elevated imagery, and a premium section styled closer to the luxury references you shared.</p>
              </div>
            </div>

            <div className="arrivals-cards">
              {arrivalsShowcase.map((item, index) => (
                <motion.button
                  key={item.id}
                  type="button"
                  className="arrival-card floating"
                  onClick={item.action}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  custom={0.08 + index * 0.06}
                  whileHover={{ y: -6 }}
                >
                  <img src={item.image} alt={item.title} />
                  <div className="arrival-card-label">
                    <h3>{item.title}</h3>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </section>
      ) : null}

      <section className="styling-section">
        <motion.div
          className="section-heading centered"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <p className="eyebrow">Styling Edit</p>
          <h2>Styling 101 with Prima selections</h2>
          <p className="section-text">A layered editorial card treatment with cleaner alignment and controlled copy length.</p>
        </motion.div>

        <div className="styling-stage">
          <motion.button
            type="button"
            className="styling-card side left"
            onClick={() =>
              navigate(stylingCards[1]?._id ? `/products/${stylingCards[1]._id}` : "/products")
            }
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
          >
            <img
              src={stylingCards[1]?.image ? getImageUrl(stylingCards[1].image) : editorialFallbacks.stylingLeft}
              alt={stylingCards[1]?.name || "Prima styling card"}
            />
            <div className="styling-fade" />
            <div className="styling-card-copy">
              <span>{stylingCards[1]?.category || "Signature"}</span>
              <h3>{stylingCards[1]?.name || "Day To Night Shine"}</h3>
            </div>
          </motion.button>

          <motion.button
            type="button"
            className="styling-card center"
            onClick={() =>
              navigate(stylingCards[0]?._id ? `/products/${stylingCards[0]._id}` : "/products")
            }
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <img
              src={stylingCards[0]?.image ? getImageUrl(stylingCards[0].image) : editorialFallbacks.stylingCenter}
              alt={stylingCards[0]?.name || "Prima editorial card"}
            />
            <div className="styling-center-fade" />
            <div className="styling-center-copy">
              <span>{stylingCards[0]?.category || "Editorial Pick"}</span>
              <h3>{stylingCards[0]?.name || "Modern Diamond Styling"}</h3>
              <p>Rich visual storytelling arranged in a layered, premium composition.</p>
            </div>
          </motion.button>

          <motion.button
            type="button"
            className="styling-card side right"
            onClick={() =>
              navigate(stylingCards[2]?._id ? `/products/${stylingCards[2]._id}` : "/products")
            }
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.04 }}
          >
            <img
              src={stylingCards[2]?.image ? getImageUrl(stylingCards[2].image) : editorialFallbacks.stylingRight}
              alt={stylingCards[2]?.name || "Prima styling card"}
            />
            <div className="styling-fade" />
            <div className="styling-card-copy">
              <span>{stylingCards[2]?.category || "Occasion"}</span>
              <h3>{stylingCards[2]?.name || "Evening Brilliance"}</h3>
            </div>
          </motion.button>
        </div>
      </section>

      <section className="spotlight-section">
        <motion.div
          className="section-heading"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <p className="eyebrow">Customer Favorites</p>
          <h2>Highly rated styles</h2>
        </motion.div>

        <div className="spotlight-grid">
          {spotlightProducts.map((product, index) => (
            <motion.button
              key={product._id}
              type="button"
              className="spotlight-card"
              onClick={() => navigate(`/products/${product._id}`)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              custom={index * 0.05}
              whileHover={{ y: -6 }}
            >
              <div className="spotlight-image-wrap">
                <img src={getImageUrl(product.image)} alt={product.name} />
              </div>
              <div className="spotlight-info">
                <p>{product.category}</p>
                <h3>{product.name}</h3>
                <div className="rating-pill">
                  <Star size={14} fill="currentColor" />
                  <span>{(product.rating || 0).toFixed(1)}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <motion.section
        className="account-actions"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <div className="section-heading">
          <p className="eyebrow">Quick Access</p>
          <h2>Your account shortcuts</h2>
        </div>

        <div className="actions-grid">
          {quickActions.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.title}
                type="button"
                className="action-card"
                onClick={item.action}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                custom={index * 0.04}
                whileHover={{ y: -6 }}
              >
                <div className="action-icon">
                  <Icon size={22} />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </motion.button>
            );
          })}

          <div className="action-card user-summary">
            <div className="action-icon">
              <User size={22} />
            </div>
            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </div>
        </div>
      </motion.section>

      <style jsx>{`
        .customer-home {
          display: grid;
          gap: 38px;
          padding-bottom: 28px;
        }

        .home-empty {
          padding: 72px 0;
          text-align: center;
        }

        .welcome-strip {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          padding: 6px 0 2px;
        }

        .eyebrow {
          margin: 0 0 8px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--primary);
        }

        .welcome-strip h1 {
          max-width: 860px;
          margin: 0;
          font-size: clamp(2.6rem, 5vw, 4.5rem);
          line-height: 0.98;
          color: #2a1318;
        }

        .primary-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #8c3042, #c17a88);
          color: white;
          padding: 14px 24px;
          box-shadow: 0 18px 36px -18px rgba(140, 48, 66, 0.6);
        }

        .hero-editorial {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(360px, 0.85fr);
          gap: 16px;
        }

        .hero-stack {
          display: grid;
          gap: 16px;
        }

        .hero-card,
        .category-panel,
        .world-tile,
        .arrival-card,
        .spotlight-card,
        .action-card {
          border: none;
          padding: 0;
          background: transparent;
          cursor: pointer;
          text-align: left;
        }

        .hero-card {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          min-height: 320px;
          box-shadow: 0 30px 60px -35px rgba(42, 19, 24, 0.4);
        }

        .hero-main {
          min-height: 720px;
        }

        .hero-side {
          min-height: 352px;
        }

        .hero-card img,
        .category-panel img,
        .world-tile img,
        .arrivals-hero img,
        .arrival-card img,
        .spotlight-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ease;
        }

        .hero-card:hover img,
        .category-panel:hover img,
        .world-tile:hover img,
        .arrivals-hero:hover img,
        .arrival-card:hover img,
        .spotlight-card:hover img {
          transform: scale(1.05);
        }

        .hero-overlay,
        .panel-gradient,
        .world-fade,
        .arrivals-overlay {
          position: absolute;
          inset: 0;
        }

        .hero-overlay.warm {
          background: linear-gradient(115deg, rgba(39, 18, 22, 0.2), rgba(39, 18, 22, 0.7));
        }

        .hero-overlay.blush {
          background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(41, 16, 21, 0.6));
        }

        .hero-copy,
        .panel-copy,
        .world-copy,
        .arrivals-copy {
          position: absolute;
          z-index: 2;
          color: white;
        }

        .hero-copy {
          left: 40px;
          right: 40px;
          bottom: 36px;
          max-width: 620px;
        }

        .hero-copy.compact {
          bottom: 28px;
        }

        .hero-copy span,
        .world-copy span {
          display: inline-block;
          margin-bottom: 12px;
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .hero-copy h2,
        .hero-copy h3 {
          margin: 0 0 12px;
          color: white;
        }

        .hero-copy h2 {
          font-size: clamp(3rem, 5vw, 5.3rem);
          line-height: 0.95;
        }

        .hero-copy h3 {
          font-size: clamp(1.8rem, 2.8vw, 2.6rem);
        }

        .hero-copy p {
          margin: 0;
          max-width: 460px;
          font-size: 1rem;
          color: rgba(255,255,255,0.86);
        }

        .section-heading {
          margin-bottom: 18px;
        }

        .section-heading.centered {
          text-align: center;
        }

        .section-heading h2 {
          margin: 0;
          font-size: clamp(2rem, 3.6vw, 3.5rem);
          color: #2a1318;
        }

        .section-text {
          max-width: 700px;
          margin: 10px auto 0;
          color: #78646a;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          grid-auto-rows: 250px;
        }

        .category-panel {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          background: #ead9d5;
          box-shadow: 0 18px 40px -30px rgba(42, 19, 24, 0.35);
        }

        .category-panel.tall {
          grid-row: span 2;
        }

        .panel-gradient {
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(36, 15, 20, 0.68));
        }

        .panel-copy {
          left: 22px;
          right: 22px;
          bottom: 20px;
        }

        .panel-copy h3 {
          margin: 0 0 6px;
          color: white;
          font-size: 1.5rem;
        }

        .panel-copy span {
          font-size: 0.92rem;
          color: rgba(255,255,255,0.84);
        }

        .world-section {
          padding: 26px 0 4px;
        }

        .world-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .world-tile {
          position: relative;
          min-height: 430px;
          overflow: hidden;
          border-radius: 28px;
          box-shadow: 0 22px 48px -32px rgba(42, 19, 24, 0.42);
        }

        .world-fade {
          background: linear-gradient(180deg, rgba(255,255,255,0) 34%, rgba(104, 34, 46, 0.75) 100%);
        }

        .world-copy {
          left: 28px;
          right: 28px;
          bottom: 26px;
        }

        .world-copy h3 {
          margin: 0;
          font-size: clamp(2rem, 3vw, 2.9rem);
          color: white;
        }

        .arrivals-section {
          padding-top: 4px;
        }

        .arrivals-stage {
          position: relative;
          padding-bottom: 108px;
        }

        .arrivals-hero {
          position: relative;
          min-height: 470px;
          overflow: hidden;
          border-radius: 0;
          box-shadow: 0 26px 56px -34px rgba(42, 19, 24, 0.38);
        }

        .arrivals-overlay {
          background: linear-gradient(90deg, rgba(88, 59, 38, 0.5), rgba(88, 59, 38, 0.12));
        }

        .arrivals-copy {
          left: 58px;
          top: 62px;
          max-width: 560px;
        }

        .arrivals-copy h2 {
          margin: 14px 0 10px;
          font-size: clamp(2.4rem, 4vw, 4rem);
          color: white;
        }

        .arrivals-copy p {
          margin: 0;
          color: rgba(255,255,255,0.86);
          font-size: 1rem;
        }

        .badge-line {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.16);
          color: white;
          backdrop-filter: blur(12px);
        }

        .arrivals-cards {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 26px;
          position: absolute;
          left: 58px;
          right: 58px;
          bottom: 0;
          transform: translateY(38%);
        }

        .arrival-card {
          overflow: hidden;
          border-radius: 18px;
          background: white;
          box-shadow: 0 22px 46px -32px rgba(42, 19, 24, 0.38);
          border: 12px solid #fff;
        }

        .arrival-card img {
          aspect-ratio: 1.35;
        }

        .arrival-card-label {
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 16px;
          padding: 16px 18px;
          border-radius: 14px;
          background: linear-gradient(180deg, rgba(25, 15, 16, 0.08), rgba(25, 15, 16, 0.72));
        }

        .arrival-card-label h3,
        .spotlight-info h3,
        .action-card h3 {
          margin: 0;
          color: white;
          line-height: 1.15;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .spotlight-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .styling-section {
          padding: 14px 0 10px;
        }

        .styling-stage {
          position: relative;
          min-height: 700px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .styling-card {
          position: absolute;
          overflow: hidden;
          border: none;
          border-radius: 22px;
          padding: 0;
          background: #091722;
          box-shadow: 0 30px 60px -34px rgba(22, 22, 30, 0.42);
          text-align: left;
        }

        .styling-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .styling-card.center {
          z-index: 3;
          width: min(390px, 33vw);
          height: 640px;
        }

        .styling-card.side {
          z-index: 2;
          width: min(280px, 24vw);
          height: 470px;
        }

        .styling-card.left {
          left: 12%;
        }

        .styling-card.right {
          right: 12%;
        }

        .styling-fade,
        .styling-center-fade {
          position: absolute;
          inset: 0;
        }

        .styling-fade {
          background: linear-gradient(180deg, rgba(8, 12, 18, 0.02), rgba(8, 12, 18, 0.78));
        }

        .styling-center-fade {
          background: linear-gradient(180deg, rgba(16, 24, 32, 0.05), rgba(16, 24, 32, 0.82));
        }

        .styling-card-copy,
        .styling-center-copy {
          position: absolute;
          left: 18px;
          right: 18px;
          bottom: 18px;
          z-index: 1;
          color: white;
        }

        .styling-card-copy span,
        .styling-center-copy span {
          display: inline-block;
          margin-bottom: 8px;
          font-size: 0.74rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.8);
        }

        .styling-card-copy h3,
        .styling-center-copy h3 {
          margin: 0;
          color: white;
          line-height: 1.12;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .styling-card-copy h3 {
          font-size: 1.3rem;
          -webkit-line-clamp: 2;
        }

        .styling-center-copy h3 {
          font-size: 2rem;
          -webkit-line-clamp: 2;
        }

        .styling-center-copy p {
          margin: 10px 0 0;
          font-size: 0.96rem;
          line-height: 1.5;
          color: rgba(255,255,255,0.84);
        }

        .spotlight-card {
          background: rgba(255,255,255,0.9);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 44px -32px rgba(42, 19, 24, 0.36);
        }

        .spotlight-image-wrap {
          aspect-ratio: 0.95;
          overflow: hidden;
          background: #efe8e3;
        }

        .spotlight-info {
          padding: 18px;
        }

        .spotlight-info p {
          margin: 0 0 6px;
          font-size: 0.78rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #8e6870;
        }

        .rating-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(183, 110, 121, 0.12);
          color: #934b58;
        }

        .account-actions {
          padding-top: 8px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 16px;
        }

        .action-card {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 22px 20px;
          border-radius: 22px;
          background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(250,244,241,0.96));
          box-shadow: 0 18px 38px -30px rgba(42, 19, 24, 0.34);
        }

        .action-card p {
          margin: 8px 0 0;
          color: #78646a;
          font-size: 0.92rem;
        }

        .action-icon {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: rgba(183, 110, 121, 0.12);
          color: var(--primary);
        }

        .user-summary {
          cursor: default;
        }

        @media (max-width: 1180px) {
          .hero-editorial,
          .world-grid,
          .spotlight-grid,
          .actions-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .hero-main {
            min-height: 560px;
          }

          .category-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .styling-stage {
            min-height: 620px;
          }

          .styling-card.center {
            width: min(350px, 38vw);
            height: 560px;
          }

          .styling-card.side {
            width: min(240px, 25vw);
            height: 400px;
          }

          .styling-card.left {
            left: 6%;
          }

          .styling-card.right {
            right: 6%;
          }
        }

        @media (max-width: 820px) {
          .welcome-strip,
          .hero-editorial,
          .arrivals-cards,
          .world-grid,
          .spotlight-grid,
          .actions-grid {
            grid-template-columns: 1fr;
            display: grid;
          }

          .welcome-strip {
            align-items: start;
          }

          .hero-main,
          .hero-side,
          .world-tile,
          .arrivals-hero {
            min-height: 360px;
          }

          .styling-stage {
            min-height: auto;
            display: grid;
            gap: 16px;
          }

          .styling-card,
          .styling-card.center,
          .styling-card.side {
            position: relative;
            width: 100%;
            height: 320px;
            left: auto;
            right: auto;
          }

          .category-grid {
            grid-template-columns: 1fr;
            grid-auto-rows: 260px;
          }

          .category-panel.tall {
            grid-row: span 1;
          }

          .hero-copy {
            left: 24px;
            right: 24px;
            bottom: 24px;
          }

          .hero-copy h2 {
            font-size: 2.4rem;
          }

          .arrivals-stage {
            padding-bottom: 0;
          }

          .arrivals-copy,
          .world-copy,
          .panel-copy {
            left: 22px;
            right: 22px;
          }

          .arrivals-copy {
            top: auto;
            bottom: 22px;
          }

          .arrivals-cards {
            position: static;
            left: auto;
            right: auto;
            bottom: auto;
            transform: none;
            margin-top: 16px;
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerHome;
