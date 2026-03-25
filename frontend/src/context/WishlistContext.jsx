import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export const useWishlist = () => useContext(WishlistContext);

const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated, refreshSession } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setWishlist(user?.wishlist || []);
  }, [user]);

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      return false;
    }

    const { data } = await api.post(`/products/${productId}/wishlist`);
    setWishlist(data.wishlist || []);

    const storageKey = localStorage.getItem("admin") ? "admin" : "user";
    const current = JSON.parse(localStorage.getItem(storageKey));

    if (current?.user) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          ...current,
          user: {
            ...current.user,
            wishlist: data.wishlist || [],
          },
        })
      );
      refreshSession();
    }

    return true;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlisted: (productId) => wishlist.some((id) => String(id) === String(productId)),
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
