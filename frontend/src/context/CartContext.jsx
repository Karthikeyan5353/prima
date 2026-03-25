import React, { createContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getDisplayPrice } from "../utils/product";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      if (existing.quantity < product.stock) {
        setCart(
          cart.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        Swal.fire({
          icon: "warning",
          title: "Stock Limit Reached",
          text: "Cannot add more than available stock",
          confirmButtonColor: "#B76E79",
        });
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    setIsDrawerOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id && item.quantity < item.stock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + getDisplayPrice(item) * item.quantity,
    0
  );
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        subtotal,
        shippingCost,
        total,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
