import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Package, Home, LogOut } from "lucide-react";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("admin");
        navigate("/admin/login");
    };

    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/admin/orders", label: "Orders", icon: ShoppingBag },
        { path: "/admin/products", label: "Products", icon: Package },
        { path: "/admin/home", label: "Home Settings", icon: Home },
    ];

    return (
        <aside style={styles.sidebar}>
            <div style={styles.header}>
                <h3 style={styles.brand}>Prima Admin</h3>
            </div>

            <nav style={styles.menu}>
                {menuItems.map((item) => {
                    const active = isActive(item.path);
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            style={{
                                ...styles.menuItem,
                                backgroundColor: active ? "rgba(183, 110, 121, 0.15)" : "transparent",
                                color: active ? "var(--primary)" : "#888",
                                borderRight: active ? "3px solid var(--primary)" : "3px solid transparent",
                            }}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </div>
                    );
                })}
            </nav>

            <div style={styles.footer}>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

const styles = {
    sidebar: {
        width: "260px",
        height: "100vh",
        backgroundColor: "#fff",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1000,
        boxShadow: "2px 0 10px rgba(0,0,0,0.03)"
    },
    header: {
        padding: "30px 24px",
        borderBottom: "1px solid var(--border)"
    },
    brand: {
        fontFamily: "var(--font-heading)",
        color: "var(--primary)",
        fontSize: "1.5rem",
        margin: 0
    },
    menu: {
        flex: 1,
        padding: "20px 0",
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },
    menuItem: {
        padding: "12px 24px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontWeight: 500,
        transition: "all 0.2s ease",
        fontSize: "0.95rem"
    },
    footer: {
        padding: "20px 24px",
        borderTop: "1px solid var(--border)"
    },
    logoutBtn: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding: "12px",
        backgroundColor: "#DC35450D",
        color: "#DC3545",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: 500,
        transition: "background 0.2s"
    }
};

export default Sidebar;
