import React, { useEffect, useState } from "react";
import { ShoppingBag, DollarSign, Package, Users } from "lucide-react";
import Loader from "../../components/common/Loader";
import api from "../../utils/api";
import { getImageUrl } from "../../utils/media";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await api.get("/admin/dashboard");
      setStats(data);
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <Loader text="Loading dashboard..." />;
  }

  const statCards = [
    { label: "Total Products", value: stats.totalProducts, icon: <Package size={24} color="#9C27B0" />, bg: "#F3E5F5" },
    { label: "Total Orders", value: stats.totalOrders, icon: <ShoppingBag size={24} color="#2196F3" />, bg: "#E3F2FD" },
    { label: "Total Revenue", value: `Rs.${stats.totalRevenue}`, icon: <DollarSign size={24} color="#4CAF50" />, bg: "#E8F5E9" },
    { label: "Total Customers", value: stats.totalCustomers, icon: <Users size={24} color="#FF9800" />, bg: "#FFF3E0" },
  ];

  return (
    <div className="admin-page animate-fade-in">
      <div className="flex-between mb-lg">
        <div>
          <h2 className="page-title">Dashboard Overview</h2>
          <p className="text-muted">Welcome back, Admin</p>
        </div>
        <div className="date-badge">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
      </div>

      <div className="dashboard-grid">
        {statCards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="icon-box" style={{ backgroundColor: card.bg }}>{card.icon}</div>
            <div><p className="stat-label">{card.label}</p><h3 className="stat-value">{card.value}</h3></div>
          </div>
        ))}
      </div>

      <div className="section mt-xl">
        <h3 className="section-title mb-md">Recent Products</h3>
        <div className="table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentProducts.map((product) => (
                <tr key={product._id}>
                  <td><img className="table-image" src={getImageUrl(product.image)} alt={product.name} /></td>
                  <td>{product.name}</td>
                  <td>Rs.{product.salePrice || product.price}</td>
                  <td>{product.stock}</td>
                  <td>{product.category}</td>
                  <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .page-title { font-size: 1.8rem; margin-bottom: 5px; }
        .date-badge { background-color: white; padding: 8px 16px; border-radius: var(--radius-full); border: 1px solid var(--border); color: var(--text-muted); font-size: 0.9rem; }
        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; }
        .stat-card { background: white; padding: 24px; border-radius: var(--radius-card); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 20px; }
        .icon-box { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .stat-label { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 5px; }
        .stat-value { font-size: 1.8rem; font-weight: 700; color: var(--dark); margin: 0; line-height: 1; }
        .table-card { background: white; border-radius: var(--radius-card); box-shadow: var(--shadow-sm); overflow: hidden; }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th, .admin-table td { padding: 15px 20px; text-align: left; border-bottom: 1px solid var(--border); }
        .admin-table th { background-color: #f9fafb; font-weight: 600; color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; }
        .table-image { width: 52px; height: 52px; object-fit: cover; border-radius: 12px; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
