import React, { useEffect, useMemo, useState } from "react";
import { Search, Package } from "lucide-react";
import Swal from "sweetalert2";
import Loader from "../../components/common/Loader";
import api from "../../utils/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });
      fetchOrders();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Update failed",
        confirmButtonColor: "#B76E79",
      });
    }
  };

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const matchesSearch =
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order._id.includes(searchTerm);
        const matchesStatus = statusFilter === "All" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [orders, searchTerm, statusFilter]
  );

  return (
    <div className="admin-orders animate-fade-in">
      <div className="flex-between mb-lg">
        <h2 className="page-title">Order Management</h2>
        <div className="filters">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
          </div>
          <select className="search-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="table-card">
        {loading ? (
          <Loader text="Loading orders..." />
        ) : filteredOrders.length ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-8).toUpperCase()}</td>
                  <td>
                    <div className="customer-cell">
                      <strong>{order.customerName}</strong>
                      <span>{order.customerEmail}</span>
                    </div>
                  </td>
                  <td>Rs.{order.totalAmount}</td>
                  <td>{order.paymentStatus}</td>
                  <td>
                    <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)} className={`status-select ${order.status.toLowerCase()}`}>
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state text-center p-20 text-muted">
            <Package size={40} style={{ margin: "0 auto 12px" }} />
            <p>No orders found.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .filters { display: flex; gap: 12px; }
        .search-box { position: relative; }
        .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .search-input { padding: 10px 10px 10px 35px; border: 1px solid var(--border); border-radius: var(--radius-btn); min-width: 220px; }
        .table-card { background: white; border-radius: var(--radius-card); box-shadow: var(--shadow-sm); overflow: hidden; }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th, .admin-table td { padding: 14px 16px; border-bottom: 1px solid var(--border); text-align: left; }
        .customer-cell { display: grid; }
        .customer-cell span { color: var(--text-muted); font-size: 0.85rem; }
        .status-select { padding: 6px 12px; border-radius: 20px; border: 1px solid transparent; font-size: 0.85rem; font-weight: 600; cursor: pointer; outline: none; }
        .status-select.pending { background: #FFF3E0; color: #EF6C00; }
        .status-select.shipped { background: #E3F2FD; color: #1976D2; }
        .status-select.delivered { background: #E8F5E9; color: #2E7D32; }
        .status-select.cancelled { background: #FFEBEE; color: #C62828; }
      `}</style>
    </div>
  );
};

export default AdminOrders;
