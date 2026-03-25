import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import LiveTryOn from "./LiveTryOn";
import ProductCard from "../../components/customer/ProductCard";
import Loader from "../../components/common/Loader";
import HeroSection from "../../components/customer/HeroSection";
import FeaturesSection from "../../components/customer/FeaturesSection";
import ShopByCategorySection from "../../components/customer/ShopByCategorySection";
import TrendingSection from "../../components/customer/TrendingSection";
import CollectionsShowcase from "../../components/customer/CollectionsShowcase";
import StylingShowcase from "../../components/customer/StylingShowcase";
import api from "../../utils/api";

const Products = () => {
  const [searchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { wishlist } = useWishlist();

  const selectedCategory = searchParams.get("category") || "All";
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "newest";
  const maxPrice = Number(searchParams.get("maxPrice") || 100000);
  const wishlistOnly = searchParams.get("wishlist") === "1";
  const visualSearchActive = searchParams.get("visualSearch") === "1";
  const visualMatchesParam = searchParams.get("visualMatches") || "";
  const hasActiveFilters =
    Boolean(search.trim()) ||
    selectedCategory !== "All" ||
    sortBy !== "newest" ||
    maxPrice < 100000 ||
    wishlistOnly ||
    visualSearchActive;

  useEffect(() => {
    const fetchAllProducts = async () => {
      setCategoriesLoading(true);
      try {
        const { data } = await api.get("/products", { params: { limit: 200 } });
        setAllProducts(data.products || []);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (visualSearchActive) {
        const ids = visualMatchesParam === "none" ? [] : visualMatchesParam.split(",").filter(Boolean);
        const visualProducts = ids.length
          ? ids
              .map((targetId) => allProducts.find((product) => String(product._id) === String(targetId)))
              .filter(Boolean)
          : [];

        setProducts(
          wishlistOnly
            ? visualProducts.filter((product) =>
                wishlist.some((id) => String(id) === String(product._id))
              )
            : visualProducts
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data } = await api.get("/products", {
          params: {
            category: selectedCategory,
            search,
            sortBy,
            maxPrice,
            limit: 24,
          },
        });
        const fetchedProducts = data.products || [];
        setProducts(
          wishlistOnly
            ? fetchedProducts.filter((product) =>
                wishlist.some((id) => String(id) === String(product._id))
              )
            : fetchedProducts
        );
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 200);
    return () => clearTimeout(timer);
  }, [selectedCategory, search, sortBy, maxPrice, wishlistOnly, wishlist, visualSearchActive, visualMatchesParam, allProducts]);

  const categoryGroups = useMemo(() => {
    const groups = new Map();

    for (const product of allProducts) {
      if (!product.category || groups.has(product.category)) {
        continue;
      }

      groups.set(product.category, {
        category: product.category,
        image: product.image,
      });
    }

    return Array.from(groups.values());
  }, [allProducts]);

  const trendingProducts = useMemo(
    () =>
      [...allProducts]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3),
    [allProducts]
  );

  const featuredCollections = useMemo(
    () => [...allProducts].slice(3, 6),
    [allProducts]
  );

  const stylingProducts = useMemo(
    () => [...allProducts].slice(6, 9),
    [allProducts]
  );

  return (
    <>
      <motion.div className="products-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {!hasActiveFilters ? <HeroSection products={allProducts} /> : null}
        {!hasActiveFilters ? <FeaturesSection products={allProducts.slice(0, 8)} /> : null}

        {!hasActiveFilters ? (
          categoriesLoading ? (
            <Loader text="Loading categories..." />
          ) : (
            <ShopByCategorySection categoryGroups={categoryGroups} />
          )
        ) : null}

        {!hasActiveFilters ? <TrendingSection products={trendingProducts} /> : null}
        {!hasActiveFilters ? <CollectionsShowcase products={featuredCollections} /> : null}
        {!hasActiveFilters ? <StylingShowcase products={stylingProducts} /> : null}

        <div className="section-header flex-between mb-md">
          <div>
            <h2 className="section-title">{hasActiveFilters ? "Filtered Results" : "Latest Collections"}</h2>
            <p className="text-muted">
              {visualSearchActive
                ? "Showing products that visually match your uploaded image or live camera capture."
                : hasActiveFilters
                ? "Showing only products matching your current search and filter selection."
                : "Use the header filters above to search, sort, and browse by category."}
            </p>
          </div>
        </div>

        {loading ? (
          <Loader text="Curating collection..." size={50} />
        ) : (
          <div className="grid grid-products">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} onTryOn={setSelectedProduct} />
              ))
            ) : (
              <div className="no-products">
                <h3>
                  {visualSearchActive
                    ? "No results found."
                    : wishlistOnly
                    ? "No wishlist items match the current filters"
                    : "No products found for the current filters"}
                </h3>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {selectedProduct ? <LiveTryOn onClose={() => setSelectedProduct(null)} product={selectedProduct} /> : null}

      <style jsx>{`
        .products-page { padding-top: 18px; }
        .section-header { margin-bottom: var(--spacing-lg); flex-wrap: wrap; gap: 20px; }
        .section-title { font-size: 2rem; margin: 0; }
        .grid-products { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; }
        .no-products { width: 100%; text-align: center; padding: 50px; grid-column: 1 / -1; color: var(--text-muted); }
        @media (max-width: 980px) { .products-page { padding-top: 24px; } }
      `}</style>
    </>
  );
};

export default Products;
