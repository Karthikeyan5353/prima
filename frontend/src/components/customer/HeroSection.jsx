import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/media";

const fallbackSlides = [
  {
    name: "Velvet Gold Story",
    category: "Prima Signature Edit",
    description: "A richer luxury mood with warm metallic contrast, editorial depth, and cleaner premium presentation.",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1800&q=80",
  },
  {
    name: "Diamond Light",
    category: "Occasion Jewellery",
    description: "Bright diamond styling, refined composition, and a softer cinematic motion through the full-width hero.",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1800&q=80",
  },
  {
    name: "Bridal Aura",
    category: "Wedding Collection",
    description: "Luminous bridal details paired with deeper contrast and a more polished luxury storefront tone.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1800&q=80",
  },
  {
    name: "Modern Rose Gold",
    category: "Everyday Luxe",
    description: "Modern silhouettes with a soft premium finish, styled to look clearer and more elevated on large screens.",
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1800&q=80",
  },
];

const HeroSection = ({ products = [] }) => {
  const navigate = useNavigate();
  const slides = useMemo(() => {
    const jewelleryFirst = products
      .filter(
        (item) =>
          item.image &&
          /(jew|bridal|diamond|gold|impon|bangle|chain|earring|necklace)/i.test(
            `${item.category} ${item.name}`
          )
      )
      .slice(0, 2);

    const curatedSlides = fallbackSlides.slice(0, 4);
    const productSlides = jewelleryFirst.map((item) => ({
      ...item,
      description: "Curated from your catalog with upgraded motion, richer contrast, and a clearer editorial presentation.",
    }));

    return [...curatedSlides, ...productSlides].slice(0, 4);
  }, [products]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const active = slides[index];
  const previous = slides[(index - 1 + slides.length) % slides.length];
  const next = slides[(index + 1) % slides.length];

  return (
    <section className="hero-wrap">
      <div className="hero-carousel">
        <button type="button" className="side-preview left" onClick={() => setIndex((index - 1 + slides.length) % slides.length)}>
          <img src={getImageUrl(previous.image)} alt={previous.name} />
        </button>

        <div className="hero-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${active.name}-${index}`}
              className="hero-slide"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.img
                src={getImageUrl(active.image)}
                alt={active.name}
                className="hero-bg"
                initial={{ scale: 1.015 }}
                animate={{ scale: 1 }}
                transition={{ duration: 5.8, ease: "easeOut" }}
              />
              <div className="hero-overlay" />
              <div className="hero-content">
                <span className="hero-subtitle">{active.category}</span>
                <h1 className="hero-title">{active.name}</h1>
                <p className="hero-desc">{active.description}</p>
                <div className="hero-actions">
                  <button className="btn btn-primary hero-btn" onClick={() => navigate("/products")}>
                    Shop Now <ArrowRight size={20} />
                  </button>
                  <button className="btn btn-outline ghost-btn" onClick={() => navigate(`/products?category=${encodeURIComponent(active.category)}`)}>
                    Explore Collection
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button type="button" className="side-preview right" onClick={() => setIndex((index + 1) % slides.length)}>
          <img src={getImageUrl(next.image)} alt={next.name} />
        </button>
      </div>

      <div className="hero-dots">
        {slides.map((slide, slideIndex) => (
          <button
            key={`${slide.name}-${slideIndex}`}
            type="button"
            className={`dot ${slideIndex === index ? "active" : ""}`}
            onClick={() => setIndex(slideIndex)}
            aria-label={`Go to slide ${slideIndex + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        .hero-wrap { width: 100vw; margin-left: calc(-50vw + 50%); margin-right: calc(-50vw + 50%); padding: 18px 0 44px; background: linear-gradient(180deg, #fff, #f7f2ee); }
        .hero-carousel { display: grid; grid-template-columns: 110px minmax(0, 1fr) 110px; gap: 18px; align-items: center; width: min(1540px, calc(100vw - 36px)); margin: 0 auto; }
        .side-preview { height: 610px; border: none; border-radius: 18px; overflow: hidden; padding: 0; background: #e8ddd8; opacity: 0.9; cursor: pointer; box-shadow: 0 24px 48px -36px rgba(31, 18, 20, 0.42); }
        .side-preview img { width: 100%; height: 100%; object-fit: cover; filter: saturate(1.08) contrast(1.04) brightness(0.9); }
        .hero-main { min-width: 0; }
        .hero-slide { position: relative; min-height: 610px; border-radius: 26px; overflow: hidden; box-shadow: 0 38px 70px -42px rgba(31, 18, 20, 0.5); }
        .hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center center; filter: saturate(1.08) contrast(1.05) brightness(0.93); }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(22, 12, 16, 0.82) 0%, rgba(22, 12, 16, 0.42) 42%, rgba(22, 12, 16, 0.18) 65%, rgba(22, 12, 16, 0.55) 100%), linear-gradient(180deg, rgba(183,110,121,0.12), rgba(12,8,10,0.1)); }
        .hero-content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: center; padding: 60px 72px; color: white; max-width: 620px; }
        .hero-content::before { content: ""; position: absolute; inset: 42px auto 42px 42px; width: min(100%, 540px); border-radius: 28px; background: linear-gradient(180deg, rgba(18, 10, 13, 0.5), rgba(18, 10, 13, 0.28)); backdrop-filter: blur(10px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.1); z-index: -1; }
        .hero-subtitle { display: inline-block; font-size: 0.84rem; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 16px; border-left: 3px solid #f0c7cf; padding-left: 14px; color: rgba(255,255,255,0.92); }
        .hero-title { font-size: clamp(3.4rem, 6vw, 5.6rem); line-height: 0.98; margin-bottom: 18px; color: white; }
        .hero-desc { font-size: 1.08rem; max-width: 500px; margin-bottom: 28px; color: rgba(255,255,255,0.9); }
        .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
        .hero-btn { padding: 15px 34px; }
        .ghost-btn { border-color: rgba(255,255,255,0.72); color: white; background: rgba(255,255,255,0.08); backdrop-filter: blur(8px); }
        .ghost-btn:hover { background: rgba(255,255,255,0.16); color: white; border-color: white; }
        .hero-dots { display: flex; justify-content: center; gap: 10px; margin-top: 20px; }
        .dot { width: 10px; height: 10px; border-radius: 50%; border: none; background: #d7d1cf; }
        .dot.active { background: #8f3543; transform: scale(1.15); }
        @media (max-width: 1100px) {
          .hero-carousel { grid-template-columns: 1fr; width: min(100%, calc(100vw - 24px)); }
          .side-preview { display: none; }
          .hero-slide { min-height: 520px; }
          .hero-content { padding: 44px 28px; }
          .hero-content::before { inset: 24px; width: auto; }
        }
        @media (max-width: 700px) {
          .hero-slide { min-height: 460px; }
          .hero-title { font-size: 2.6rem; }
          .hero-desc { font-size: 1rem; }
          .hero-content::before { inset: 18px; border-radius: 22px; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
