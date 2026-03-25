import React, { useEffect, useState } from "react";
import { ChevronDown, Package, Clock, CheckCircle, XCircle, CreditCard } from "lucide-react";
import Loader from "../../components/common/Loader";
import api from "../../utils/api";
import { getImageUrl } from "../../utils/media";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/user");
        setOrders(data);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (String(status).toLowerCase()) {
      case "delivered":
        return <CheckCircle size={18} color="var(--success)" />;
      case "cancelled":
        return <XCircle size={18} color="var(--danger)" />;
      default:
        return <Clock size={18} color="var(--warning)" />;
    }
  };

  if (loading) {
    return <Loader text="Fetching your orders..." />;
  }

  return (
    <div className="order-history animate-fade-in">
      <h2 className="page-title mb-lg">My Orders</h2>

      {orders.length === 0 ? (
        <div className="empty-state text-center p-20 card">
          <Package size={48} className="text-muted mb-md" />
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const isOpen = expanded === order._id;
            return (
              <div key={order._id} className="order-card mb-lg">
                <div className="order-header flex-between">
                  <div>
                    <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                    <div className="order-date text-muted text-sm">{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="order-status flex-center gap-sm">
                    {getStatusIcon(order.status)}
                    <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                  </div>
                </div>

                <div className="order-footer flex-between">
                  <div>
                    <p><strong>Total Amount:</strong> Rs.{order.totalAmount}</p>
                    <p className="text-muted"><CreditCard size={14} /> {order.paymentStatus} via {order.paymentMethod}</p>
                  </div>
                  <button className="btn btn-outline" onClick={() => setExpanded(isOpen ? null : order._id)}>
                    View Details <ChevronDown size={16} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                  </button>
                </div>

                {isOpen ? (
                  <div className="order-body">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item flex-start gap-md">
                        <img className="item-img" src={getImageUrl(item.image)} alt={item.name} />
                        <div className="item-info">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-muted text-sm">Qty: {item.quantity}</p>
                        </div>
                        <div className="item-price ml-auto font-medium">Rs.{item.price * item.quantity}</div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .order-history { max-width: 900px; margin: 0 auto; }
        .order-card { background: white; border-radius: var(--radius-card); border: 1px solid var(--border); overflow: hidden; }
        .order-header { padding: 15px 20px; background: var(--bg-muted); border-bottom: 1px solid var(--border); }
        .order-id { font-weight: 600; color: var(--dark); }
        .status-badge { font-size: 0.85rem; font-weight: 500; text-transform: capitalize; }
        .status-badge.pending { color: var(--warning); }
        .status-badge.delivered { color: var(--success); }
        .status-badge.cancelled { color: var(--danger); }
        .order-body { padding: 20px; }
        .order-item { padding-bottom: 15px; margin-bottom: 15px; border-bottom: 1px solid var(--border-light); }
        .order-item:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
        .item-img { width: 50px; height: 50px; background: var(--bg-muted); border-radius: var(--radius-sm); object-fit: cover; }
        .order-footer { padding: 15px 20px; border-top: 1px solid var(--border); background: #fff; }
      `}</style>
    </div>
  );
};

export default OrderHistory;
