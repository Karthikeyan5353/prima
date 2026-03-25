import React, { useEffect, useState } from "react";
import { Truck, ShieldCheck, Clock, CreditCard, Quote } from "lucide-react";
import { getImageUrl } from "../../utils/media";

const reviews = [
  { name: "Anika", text: "Elegant packaging, timely delivery and the finish looks premium in person." },
  { name: "Divya", text: "The bridal collection photographs beautifully and the try-on tool is genuinely useful." },
  { name: "Maya", text: "Smooth checkout, good support and the sale pricing felt worth it." },
];

const FeaturesSection = ({ products = [] }) => {
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setReviewIndex((current) => (current + 1) % reviews.length), 3500);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: <Truck size={32} />, title: "Global Shipping", desc: "Fast & secure delivery worldwide" },
    { icon: <ShieldCheck size={32} />, title: "Authentic Quality", desc: "Handpicked premium materials" },
    { icon: <CreditCard size={32} />, title: "Secure Payment", desc: "100% secure checkout process" },
    { icon: <Clock size={32} />, title: "24/7 Support", desc: "Dedicated support for our clients" },
  ];

  return (
    <div className="features-section">
      <div className="container">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-text"><h4>{feature.title}</h4><p>{feature.desc}</p></div>
            </div>
          ))}
        </div>

        <div className="promo-grid">
          <div className="promo-card">
            <h4>Trending Products</h4>
            <div className="promo-products">
              {products.slice(0, 4).map((product) => (
                <div key={product._id} className="promo-product">
                  <img src={getImageUrl(product.image)} alt={product.name} />
                  <span>{product.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="promo-card review-card">
            <Quote size={20} />
            <h4>Customer Reviews</h4>
            <p>{reviews[reviewIndex].text}</p>
            <span>{reviews[reviewIndex].name}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .features-section { padding: 60px 0; background-color: var(--bg-surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 60px; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 30px; margin-bottom: 24px; }
        .feature-item { display: flex; align-items: center; gap: 20px; padding: 20px; transition: var(--transition); }
        .feature-item:hover { transform: translateY(-5px); }
        .feature-icon { color: var(--primary); background: rgba(183, 110, 121, 0.1); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .feature-text h4 { font-size: 1.1rem; margin-bottom: 5px; color: var(--dark); }
        .feature-text p { font-size: 0.9rem; color: var(--text-muted); margin: 0; }
        .promo-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px; }
        .promo-card { background: rgba(255,255,255,0.9); border-radius: var(--radius-card); padding: 22px; box-shadow: var(--shadow-sm); }
        .promo-products { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 14px; }
        .promo-product img { width: 100%; height: 110px; object-fit: cover; border-radius: 14px; margin-bottom: 8px; }
        .promo-product span { font-size: 0.85rem; color: var(--text-muted); }
        .review-card { display: grid; align-content: center; gap: 10px; }
        .review-card p { color: var(--text-muted); }
        @media (max-width: 900px) { .promo-grid, .promo-products { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default FeaturesSection;
