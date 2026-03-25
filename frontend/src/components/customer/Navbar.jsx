import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import VisualSearchModal from "./VisualSearchModal";
import api from "../../utils/api";
import { getDisplayPrice } from "../../utils/product";
import { getImageUrl } from "../../utils/media";
import { findVisualMatches } from "../../utils/visualSearch";
import {
  Package,
  Sparkles,
  ShoppingBag,
  Heart,
  User,
  LogOut,
  X,
  Search,
  Shirt,
  Gift,
  Hand,
  Footprints,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

const categoryIcons = [Package, Sparkles, Gift, Shirt, ShoppingBag, Hand, Footprints, Heart];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { logout } = useAuth();
  const { wishlist } = useWishlist();
  const { cart, isDrawerOpen, setIsDrawerOpen, total } = useContext(CartContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [categories, setCategories] = useState([]);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const isProductsPage = location.pathname === "/products";
  const selectedCategory = searchParams.get("category") || "All";
  const selectedSort = searchParams.get("sortBy") || "newest";
  const selectedMaxPrice = searchParams.get("maxPrice") || "100000";
  const wishlistOnly = searchParams.get("wishlist") === "1";
  const sortOptions = [
    { value: "priceAsc", label: "Price Low to High" },
    { value: "priceDesc", label: "Price High to Low" },
    { value: "newest", label: "Newest Products" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!event.target.closest(".dropdown-shell")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!isProductsPage) {
      return;
    }

    const trimmed = searchValue.trim();
    const currentSearch = searchParams.get("search") || "";

    const timer = setTimeout(() => {
      if (trimmed === currentSearch) {
        return;
      }

      updateParams({ search: trimmed });
    }, 250);

    return () => clearTimeout(timer);
  }, [searchValue, isProductsPage, searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await api.get("/products", { params: { limit: 200 } });
      const fetchedProducts = data.products || [];
      const unique = Array.from(new Set(fetchedProducts.map((item) => item.category).filter(Boolean)));
      setCategories(unique);
      setCatalogProducts(fetchedProducts);
    };

    fetchCategories();
  }, []);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const topLinks = useMemo(
    () => [
      { icon: Package, label: "Orders", action: () => navigate("/my-orders") },
      { icon: User, label: "Profile", action: () => navigate("/customer/home") },
    ],
    [navigate]
  );
  
  const handleVisualSearch = async (file) => {
    const matches = await findVisualMatches(file, catalogProducts);
    const matchedIds = matches.map((item) => item.product._id);
    const nextParams = new URLSearchParams();

    nextParams.set("visualSearch", "1");
    nextParams.set("visualMatches", matchedIds.length ? matchedIds.join(",") : "none");

    navigate(`/products?${nextParams.toString()}`);
  };

  const navigateWithParams = (updates = {}) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "" || value === "All" || value === "0") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    navigate(`/products${nextParams.toString() ? `?${nextParams.toString()}` : ""}`);
  };

  const updateParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "" || value === "All") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    setSearchParams(nextParams);
  };

  const submitSearch = (event) => {
    event.preventDefault();

    if (!isProductsPage) {
      const params = new URLSearchParams();
      if (searchValue.trim()) {
        params.set("search", searchValue.trim());
      }
      navigate(`/products${params.toString() ? `?${params.toString()}` : ""}`);
      return;
    }
  };

  return (
    <>
      <motion.nav
        className={`navbar ${isScrolled ? "scrolled" : ""}`}
        initial={{ y: -18, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          boxShadow: isScrolled ? "0 12px 25px -20px rgba(0,0,0,0.18)" : "0 0 0 rgba(0,0,0,0)",
          backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
        }}
        transition={{ duration: 0.35 }}
        style={{
          position: "sticky",
          top: 0,
          zIndex: "var(--z-sticky)",
          backgroundColor: "rgba(255, 255, 255, 0.97)",
          borderBottom: "1px solid rgba(224,224,224,0.8)",
        }}
      >
        <div className="container nav-shell">
          <div className="nav-top">
            <Link to="/products" className="brand-mark">
              <span className="brand-name">Prima Boutique</span>
            </Link>

            <form className="nav-search" onSubmit={submitSearch}>
              <Search size={18} />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for boutique styles"
              />
            </form>

            <div className="nav-actions">
              <button
                type="button"
                className="nav-icon-btn"
                onClick={() => setIsVisualSearchOpen(true)}
                aria-label="Visual Search"
              >
                <Sparkles size={20} strokeWidth={1.7} />
              </button>

              {topLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.label} type="button" className="nav-icon-btn" onClick={item.action} aria-label={item.label}>
                    <Icon size={20} strokeWidth={1.7} />
                  </button>
                );
              })}

              <button
                type="button"
                className={`nav-icon-btn ${wishlistOnly ? "active-icon" : ""}`}
                onClick={() => {
                  if (!isProductsPage) {
                    navigate(`/products${wishlist.length ? "?wishlist=1" : ""}`);
                    return;
                  }
                  updateParams({ wishlist: wishlistOnly ? "0" : "1" });
                }}
                aria-label="Wishlist"
              >
                <Heart size={20} strokeWidth={1.7} fill={wishlistOnly ? "currentColor" : "transparent"} />
                {wishlist.length > 0 ? <span className="cart-badge">{wishlist.length}</span> : null}
              </button>

              <button type="button" className="nav-icon-btn cart-trigger" onClick={() => setIsDrawerOpen(true)} aria-label="Cart">
                <ShoppingBag size={20} strokeWidth={1.7} />
                {totalItems > 0 ? <span className="cart-badge">{totalItems}</span> : null}
              </button>

              <button
                type="button"
                className="nav-icon-btn"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                aria-label="Logout"
              >
                <LogOut size={20} strokeWidth={1.7} />
              </button>
            </div>
          </div>

          <motion.div
            className="nav-row-wrap"
            initial={false}
            animate={
              isScrolled
                ? { height: 0, opacity: 0, marginTop: 0 }
                : { height: "auto", opacity: 1, marginTop: 8 }
            }
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="nav-bottom">
              <button
                type="button"
                className={`category-chip ${selectedCategory === "All" ? "active" : ""}`}
                onClick={() => navigate("/products")}
              >
                <Package size={17} />
                <span>All Collections</span>
              </button>

              {categories.map((category, index) => {
                const Icon = categoryIcons[index % categoryIcons.length];
                return (
                  <button
                    key={category}
                    type="button"
                    className={`category-chip ${isProductsPage && selectedCategory === category ? "active" : ""}`}
                    onClick={() => navigateWithParams({ category, wishlist: wishlistOnly ? "1" : "0" })}
                  >
                    <Icon size={17} />
                    <span>{category}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {isProductsPage ? (
            <motion.div
              className="nav-row-wrap"
              initial={{ opacity: 0, y: -12 }}
              animate={
                isScrolled
                  ? { opacity: 0, y: -8, height: 0, marginTop: 0 }
                  : { opacity: 1, y: 0, height: "auto", marginTop: 10 }
              }
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="filter-bar">
                <div className="filter-chip dropdown-shell">
                  <SlidersHorizontal size={16} />
                  <button
                    type="button"
                    className="filter-dropdown-trigger"
                    onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
                    aria-expanded={openDropdown === "category"}
                  >
                    <span>{selectedCategory}</span>
                    <ChevronDown size={16} className={openDropdown === "category" ? "rotate" : ""} />
                  </button>
                  {openDropdown === "category" ? (
                    <div className="filter-dropdown-menu">
                      <button type="button" className={`dropdown-item ${selectedCategory === "All" ? "active" : ""}`} onClick={() => { updateParams({ category: "All" }); setOpenDropdown(null); }}>
                        All
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          className={`dropdown-item ${selectedCategory === category ? "active" : ""}`}
                          onClick={() => { updateParams({ category }); setOpenDropdown(null); }}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="price-chip">
                  <span>Max Price: Rs.{selectedMaxPrice}</span>
                  <input
                    type="range"
                    min="500"
                    max="100000"
                    step="500"
                    value={selectedMaxPrice}
                    onChange={(e) => updateParams({ maxPrice: e.target.value })}
                  />
                </div>

                <div className="filter-chip dropdown-shell">
                  <button
                    type="button"
                    className="filter-dropdown-trigger"
                    onClick={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
                    aria-expanded={openDropdown === "sort"}
                  >
                    <span>{sortOptions.find((option) => option.value === selectedSort)?.label || "Newest Products"}</span>
                    <ChevronDown size={16} className={openDropdown === "sort" ? "rotate" : ""} />
                  </button>
                  {openDropdown === "sort" ? (
                    <div className="filter-dropdown-menu align-right">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={`dropdown-item ${selectedSort === option.value ? "active" : ""}`}
                          onClick={() => { updateParams({ sortBy: option.value }); setOpenDropdown(null); }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </motion.nav>

      <AnimatePresence>
        {isDrawerOpen ? (
          <>
            <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} />
            <motion.aside className="cart-drawer" initial={{ x: 360 }} animate={{ x: 0 }} exit={{ x: 360 }}>
              <div className="flex-between mb-md">
                <h3>Cart Preview</h3>
                <button className="icon-btn" onClick={() => setIsDrawerOpen(false)}><X size={18} /></button>
              </div>
              <div className="drawer-items">
                {cart.length ? cart.map((item) => (
                  <div key={item._id} className="drawer-item">
                    <img src={getImageUrl(item.image)} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <span className="text-muted">Qty: {item.quantity} x Rs.{getDisplayPrice(item)}</span>
                    </div>
                  </div>
                )) : <p className="text-muted">Your cart is empty.</p>}
              </div>
              <div className="drawer-footer">
                <div className="flex-between mb-md"><span>Total</span><strong>Rs.{total}</strong></div>
                <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => { setIsDrawerOpen(false); navigate("/cart"); }}>Go to Cart</button>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <VisualSearchModal
        open={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
        onSearch={handleVisualSearch}
      />

      <style jsx>{`
        .nav-shell { padding-top: 10px; padding-bottom: 8px; }
        .nav-top { display: grid; grid-template-columns: 110px minmax(280px, 1fr) auto; align-items: center; gap: 10px; }
        .brand-mark { display: inline-flex; flex-direction: column; gap: 2px; color: var(--primary); }
        .brand-name { font-family: var(--font-heading); font-size: 1.35rem; line-height: 1.05; }
        .nav-search { height: 50px; display: flex; align-items: center; gap: 10px; padding: 0 16px; border: 1px solid rgba(183,110,121,0.22); border-radius: 999px; background: #fff; }
        .nav-search input { border: none; width: 100%; background: transparent; color: var(--text-main); }
        .nav-actions { display: flex; align-items: center; gap: 2px; }
        .nav-icon-btn { width: 36px; height: 36px; border-radius: 50%; border: none; background: transparent; color: #7f2f3f; display: flex; align-items: center; justify-content: center; position: relative; }
        .nav-icon-btn:hover, .nav-icon-btn.active-icon { background: rgba(183,110,121,0.08); color: var(--primary); }
        .cart-trigger { margin-left: 2px; }
        .cart-badge { position: absolute; top: -2px; right: -2px; min-width: 18px; height: 18px; padding: 0 4px; border-radius: 999px; background: #7f2335; color: white; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
        .nav-row-wrap { overflow: visible; }
        .nav-bottom { display: flex; align-items: center; gap: 8px; overflow-x: auto; padding-top: 10px; border-top: 1px solid rgba(224,224,224,0.8); scrollbar-width: none; -ms-overflow-style: none; }
        .nav-bottom::-webkit-scrollbar { display: none; }
        .category-chip { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; border: none; background: transparent; color: #2f2f2f; padding: 8px 10px; border-radius: 999px; }
        .category-chip:hover, .category-chip.active { background: rgba(183,110,121,0.08); color: var(--primary); }
        .filter-bar { padding-top: 10px; border-top: 1px solid rgba(224,224,224,0.8); display: grid; grid-template-columns: 220px minmax(280px, 420px) 220px; gap: 12px; align-items: center; justify-content: space-between; }
        .filter-chip, .price-chip { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.52); border: 1px solid rgba(183,110,121,0.22); border-radius: 999px; padding: 10px 14px; min-height: 46px; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.55); }
        .dropdown-shell { position: relative; }
        .filter-dropdown-trigger { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 10px; border: none; background: transparent; color: var(--text-main); text-align: left; }
        .filter-dropdown-trigger span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .filter-dropdown-trigger .rotate { transform: rotate(180deg); }
        .filter-dropdown-menu { position: absolute; top: calc(100% + 10px); left: 0; min-width: 280px; max-height: 320px; overflow: auto; padding: 10px; border-radius: 22px; background: rgba(255,255,255,0.72); border: 1px solid rgba(183,110,121,0.18); box-shadow: 0 28px 44px -30px rgba(36, 17, 22, 0.42); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); z-index: 40; }
        .filter-dropdown-menu.align-right { right: 0; left: auto; min-width: 260px; }
        .dropdown-item { width: 100%; display: block; border: none; background: transparent; padding: 12px 14px; border-radius: 14px; text-align: left; color: #2b2023; transition: background-color 0.18s ease, color 0.18s ease; }
        .dropdown-item:hover, .dropdown-item.active { background: rgba(127,35,53,0.1); color: #7f2335; }
        .price-chip { display: grid; grid-template-columns: auto 1fr; max-width: 420px; width: 100%; }
        .price-chip span { white-space: nowrap; color: var(--text-muted); font-size: 0.92rem; }
        .price-chip input { width: 100%; max-width: 180px; justify-self: end; accent-color: var(--primary); }
        .drawer-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.28); z-index: 999; }
        .cart-drawer { position: fixed; top: 0; right: 0; width: 340px; max-width: 100%; height: 100vh; background: rgba(255,255,255,0.96); backdrop-filter: blur(14px); box-shadow: var(--shadow-lg); z-index: 1000; padding: 24px; display: grid; grid-template-rows: auto 1fr auto; }
        .drawer-items { overflow: auto; display: grid; gap: 12px; }
        .drawer-item { display: grid; grid-template-columns: 56px 1fr; gap: 12px; align-items: center; }
        .drawer-item img { width: 56px; height: 56px; object-fit: cover; border-radius: 12px; }
        .icon-btn { border: none; background: transparent; }
        @media (max-width: 980px) {
          .nav-top { grid-template-columns: 1fr; }
          .nav-actions { justify-content: flex-end; }
          .filter-bar { grid-template-columns: 1fr; }
          .price-chip { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
