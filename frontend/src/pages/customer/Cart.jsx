import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { getDisplayPrice } from "../../utils/product";
import { getImageUrl } from "../../utils/media";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, increaseQty, decreaseQty, subtotal, shippingCost, total } = useContext(CartContext);

  if (cart.length === 0) {
    return (
      <div className="empty-cart-container flex-col flex-center animate-fade-in">
        <ShoppingBag size={64} style={{ color: "var(--text-light)", marginBottom: "20px" }} />
        <h2>Your Bag is Empty</h2>
        <p>Start filling it with luxury items.</p>
        <button onClick={() => navigate("/products")} className="btn btn-primary mt-md">Continue Shopping</button>
      </div>
    );
  }

  return (
    <motion.div className="cart-page animate-fade-in" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
      <h2 className="page-title">Shopping Bag</h2>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="item-image">
                <img src={getImageUrl(item.image)} alt={item.name} />
              </div>

              <div className="item-details">
                <div className="item-header flex-between">
                  <h4>{item.name}</h4>
                  <p className="item-price">Rs.{getDisplayPrice(item)}</p>
                </div>

                <p className="item-meta">Category: {item.category}</p>

                <div className="item-actions flex-between">
                  <div className="quantity-control">
                    <button onClick={() => decreaseQty(item._id)} disabled={item.quantity === 1} className="qty-btn"><Minus size={14} /></button>
                    <span className="qty-value">{item.quantity}</span>
                    <button onClick={() => increaseQty(item._id)} disabled={item.quantity >= item.stock} className="qty-btn"><Plus size={14} /></button>
                  </div>

                  <button onClick={() => removeFromCart(item._id)} className="remove-btn flex-center">
                    <Trash2 size={16} />
                    <span className="hidden-mobile">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row flex-between"><span>Subtotal</span><span>Rs.{subtotal}</span></div>
            <div className="summary-row flex-between"><span>Shipping</span><span>{shippingCost ? `Rs.${shippingCost}` : "Free"}</span></div>
            <div className="divider"></div>
            <div className="summary-total flex-between"><span>Total</span><span>Rs.{total}</span></div>
            <button onClick={() => navigate("/checkout")} className="btn btn-primary btn-block">
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
            <div className="secure-checkout mt-md"><p>Secure Checkout</p></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .empty-cart-container { padding: 100px 20px; text-align: center; color: var(--text-muted); }
        .page-title { margin-bottom: var(--spacing-lg); border-bottom: 1px solid var(--border); padding-bottom: 20px; }
        .cart-layout { display: grid; grid-template-columns: 1fr 350px; gap: 40px; }
        @media (max-width: 900px) { .cart-layout { grid-template-columns: 1fr; } }
        .cart-items { display: flex; flex-direction: column; gap: 20px; }
        .cart-item { display: flex; gap: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
        .item-image { width: 100px; height: 100px; border-radius: var(--radius-sm); overflow: hidden; background-color: var(--bg-muted); flex-shrink: 0; }
        .item-image img { width: 100%; height: 100%; object-fit: cover; }
        .item-details { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .item-price { font-weight: 600; font-size: 1.1rem; }
        .item-meta { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px; }
        .quantity-control { display: flex; align-items: center; border: 1px solid var(--border); border-radius: var(--radius-btn); overflow: hidden; }
        .qty-btn { background: var(--bg-surface); border: none; padding: 5px 10px; cursor: pointer; display: flex; align-items: center; }
        .qty-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .qty-value { padding: 0 10px; font-weight: 500; font-size: 0.9rem; }
        .remove-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.9rem; gap: 5px; }
        .remove-btn:hover { color: var(--danger); }
        .summary-card { background: rgba(255,255,255,0.96); padding: 25px; border-radius: var(--radius-card); box-shadow: var(--shadow-sm); position: sticky; top: 100px; backdrop-filter: blur(10px); }
        .summary-row { margin-bottom: 15px; color: var(--text-muted); }
        .divider { height: 1px; background: var(--border); margin: 20px 0; }
        .summary-total { font-size: 1.25rem; font-weight: 700; color: var(--dark); margin-bottom: 25px; }
        .btn-block { width: 100%; display: flex; justify-content: space-between; }
        .secure-checkout { text-align: center; font-size: 0.8rem; color: var(--text-muted); }
      `}</style>
    </motion.div>
  );
};

export default Cart;
