import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { ShieldCheck, CreditCard, MapPin, Phone, User, Landmark } from "lucide-react";
import Swal from "sweetalert2";
import Loader from "../../components/common/Loader";
import api from "../../utils/api";
import { getDisplayPrice } from "../../utils/product";
import { getImageUrl } from "../../utils/media";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, setCart, subtotal, shippingCost, total } = useContext(CartContext);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const shippingAddress = {
    fullName: formData.name,
    addressLine: formData.address,
    city: formData.city,
    state: formData.state,
    postalCode: formData.postalCode,
    country: formData.country,
  };

  const clearCheckout = (order) => {
    localStorage.setItem("lastOrder", JSON.stringify(order));
    localStorage.removeItem("cart");
    setCart([]);
  };

  const handleCOD = async () => {
    const { data } = await api.post("/orders/create", {
      customerName: formData.name,
      customerEmail: user.email,
      address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.postalCode}, ${formData.country}`,
      phone: formData.phone,
      paymentMethod,
      shippingAddress,
      cart,
    });

    clearCheckout(data);
    navigate("/payment-success");
  };

  const handleRazorpay = async () => {
    const loaded = await loadRazorpay();
    if (!loaded) {
      throw new Error("Razorpay SDK failed to load");
    }

    const { data } = await api.post("/orders/create-order", {
      customerName: formData.name,
      customerEmail: user.email,
      address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.postalCode}, ${formData.country}`,
      phone: formData.phone,
      shippingAddress,
      cart,
    });

    return new Promise((resolve, reject) => {
      const razorpay = new window.Razorpay({
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Prima Boutique",
        description: "Order payment",
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const verify = await api.post("/payment/verify", {
              ...response,
              pendingOrderId: data.pendingOrderId,
            });
            clearCheckout(verify.data.order);
            navigate("/payment-success");
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        prefill: {
          name: formData.name,
          email: user.email,
          contact: formData.phone,
        },
        theme: { color: "#B76E79" },
      });

      razorpay.on("payment.failed", reject);
      razorpay.open();
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (paymentMethod === "Cash on Delivery") {
        await handleCOD();
      } else {
        await handleRazorpay();
      }
    } catch (error) {
      const paymentErrorMessage =
        error?.response?.data?.message ||
        error?.error?.description ||
        error?.message ||
        "Checkout failed";

      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: paymentErrorMessage,
        confirmButtonColor: "#B76E79",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page animate-fade-in">
      <h2 className="page-title">Secure Checkout</h2>
      {loading ? <Loader fullScreen text="Processing your secure payment..." /> : null}

      <div className="checkout-layout">
        <div className="checkout-form-container">
          <form onSubmit={handlePayment}>
            <div className="card mb-lg">
              <div className="section-header flex-start gap-md mb-md border-bottom pb-sm">
                <MapPin className="text-primary" size={20} />
                <h3>Shipping Details</h3>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="icon" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input indent" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Address</label>
                <div className="input-with-icon">
                  <div className="icon" style={{ top: "15px" }}><MapPin size={18} /></div>
                  <textarea name="address" value={formData.address} onChange={handleChange} className="form-input indent" rows="3" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group"><input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="form-input" required /></div>
                <div className="form-group"><input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className="form-input" required /></div>
              </div>

              <div className="form-row">
                <div className="form-group"><input type="text" name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} className="form-input" required /></div>
                <div className="form-group"><input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="form-input" required /></div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={18} className="icon" />
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-input indent" required />
                </div>
              </div>
            </div>

            <div className="card mb-lg">
              <div className="section-header flex-start gap-md mb-md border-bottom pb-sm">
                <CreditCard className="text-primary" size={20} />
                <h3>Payment Method</h3>
              </div>

              {["Razorpay", "Cash on Delivery"].map((method) => (
                <button
                  type="button"
                  key={method}
                  className={`payment-option ${paymentMethod === method ? "selected" : ""}`}
                  onClick={() => setPaymentMethod(method)}
                >
                  <div className="radio-circle"></div>
                  {method === "Razorpay" ? <CreditCard size={18} /> : <Landmark size={18} />}
                  <span>{method}</span>
                  {method === "Razorpay" ? (
                    <span className="badge badge-success ml-auto flex-center gap-sm"><ShieldCheck size={14} /> 100% Secure</span>
                  ) : null}
                </button>
              ))}
            </div>

            <button type="submit" className="btn btn-primary lg full-width" disabled={loading || !cart.length}>
              {loading ? "Processing..." : `${paymentMethod === "Cash on Delivery" ? "Place Order" : `Pay Rs.${total}`} `}
            </button>
          </form>
        </div>

        <div className="order-summary-sidebar">
          <div className="card sticky-top">
            <h3>In Your Bag</h3>
            <div className="summary-items">
              {cart.map((item) => (
                <div key={item._id} className="summary-item flex-between gap-md mb-md">
                  <img src={getImageUrl(item.image)} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
                  <div className="item-txt flex-1">
                    <p className="name font-medium">{item.name}</p>
                    <p className="qty text-muted text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="price font-medium">Rs.{getDisplayPrice(item)}</p>
                </div>
              ))}
            </div>

            <div className="divider my-md bg-border" style={{ height: "1px" }}></div>
            <div className="summary-row flex-between mb-sm text-muted"><span>Subtotal</span><span>Rs.{subtotal}</span></div>
            <div className="summary-row flex-between mb-sm text-muted"><span>Shipping</span><span>{shippingCost ? `Rs.${shippingCost}` : "Free"}</span></div>
            <div className="summary-total flex-between font-bold text-lg mt-md"><span>Total Pay</span><span>Rs.{total}</span></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkout-page { max-width: 1080px; margin: 0 auto; padding: 8px 0 56px; }
        .page-title { text-align: center; margin-bottom: 40px; font-size: 2rem; }
        .checkout-layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 30px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 900px) { .checkout-layout, .form-row { grid-template-columns: 1fr; } .order-summary-sidebar { order: -1; } }
        .input-with-icon { position: relative; }
        .icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
        .form-input.indent { padding-left: 45px; }
        .checkout-form-container .card, .order-summary-sidebar .card { padding: 24px; border-radius: var(--radius-card); }
        .section-header { align-items: center; }
        .payment-option { width: 100%; background-color: var(--bg-surface); border: 2px solid var(--border); padding: 15px; border-radius: var(--radius-btn); display: flex; align-items: center; gap: 15px; cursor: pointer; margin-bottom: 12px; }
        .payment-option.selected { border-color: var(--primary); background: rgba(183, 110, 121, 0.05); }
        .radio-circle { width: 18px; height: 18px; border: 2px solid var(--primary); border-radius: 50%; background: white; }
        .sticky-top { position: sticky; top: 100px; }
        .full-width { width: 100%; }
        .lg { padding: 15px; font-size: 1.1rem; }
        .summary-items { display: grid; gap: 14px; margin-top: 18px; }
        .summary-item { align-items: center; padding: 10px 0; margin-bottom: 0; }
        .summary-item img { flex-shrink: 0; border-radius: 12px !important; }
        .item-txt { min-width: 0; }
        .item-txt .name { margin: 0 0 4px; line-height: 1.4; }
        .item-txt .qty, .summary-row, .summary-total { margin: 0; }
        .summary-row, .summary-total { padding: 4px 0; }
        @media (max-width: 900px) { .checkout-page { padding-top: 0; } }
      `}</style>
    </div>
  );
};

export default Checkout;
