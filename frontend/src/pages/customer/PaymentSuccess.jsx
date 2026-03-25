import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const order = useMemo(() => JSON.parse(localStorage.getItem("lastOrder") || "null"), []);

  return (
    <div className="payment-success-page flex-center animate-fade-in">
      <div className="confetti">
        {Array.from({ length: 24 }).map((_, index) => <span key={index} style={{ left: `${(index / 24) * 100}%`, animationDelay: `${index * 0.08}s` }} />)}
      </div>
      <div className="success-card text-center">
        <div className="icon-wrapper mb-md"><CheckCircle size={64} color="var(--success)" /></div>
        <h2 className="mb-sm">Payment Successful</h2>
        <p className="text-muted mb-lg">Your order has been confirmed and will be processed shortly.</p>
        <div className="order-meta">
          <p><strong>Order ID:</strong> {order?._id || "N/A"}</p>
          <p><strong>Amount Paid:</strong> Rs.{order?.totalAmount || 0}</p>
        </div>
        <div className="actions flex-center gap-md">
          <button onClick={() => navigate("/my-orders")} className="btn btn-outline">View Order</button>
          <button onClick={() => navigate("/products")} className="btn btn-primary">Continue Shopping <ArrowRight size={18} /></button>
        </div>
      </div>

      <style jsx>{`
        .payment-success-page { min-height: 60vh; padding: 40px 20px; position: relative; overflow: hidden; }
        .success-card { background: rgba(255,255,255,0.97); padding: 50px; border-radius: var(--radius-card); box-shadow: var(--shadow-lg); max-width: 520px; width: 100%; border: 1px solid var(--border); position: relative; z-index: 1; }
        .icon-wrapper { display: inline-flex; justify-content: center; align-items: center; background: rgba(76, 175, 80, 0.1); width: 100px; height: 100px; border-radius: 50%; }
        .order-meta { margin-bottom: 24px; padding: 16px; background: var(--bg-muted); border-radius: 16px; text-align: left; }
        .confetti span { position: absolute; top: -30px; width: 10px; height: 18px; background: linear-gradient(135deg, var(--primary), #f59e0b); animation: drop 4s linear infinite; opacity: 0.75; }
        @keyframes drop { to { transform: translateY(80vh) rotate(540deg); } }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
