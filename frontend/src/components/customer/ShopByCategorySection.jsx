import React from "react";
import CategoryCard from "./CategoryCard";

const ShopByCategorySection = ({ categoryGroups = [] }) => {
  if (!categoryGroups.length) {
    return null;
  }

  return (
    <section className="category-section">
      <div className="section-copy">
        <h2 className="title">Find Your Perfect Match</h2>
        <p className="subtitle">Shop by Categories</p>
      </div>

      <div className="category-grid">
        {categoryGroups.map((group, index) => (
          <CategoryCard
            key={group.category}
            category={group.category}
            image={group.image}
            index={index}
          />
        ))}
      </div>

      <style jsx>{`
        .category-section {
          margin-bottom: 72px;
        }

        .section-copy {
          margin-bottom: 34px;
          text-align: center;
        }

        .title {
          margin: 0 0 8px;
          font-size: clamp(2.3rem, 4vw, 3rem);
          color: #1b0f16;
        }

        .subtitle {
          margin: 0;
          font-family: var(--font-heading);
          font-size: 1.15rem;
          color: #66505a;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 30px 24px;
        }

        @media (max-width: 1024px) {
          .category-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .category-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default ShopByCategorySection;
