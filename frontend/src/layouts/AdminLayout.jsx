import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/admin/Sidebar";

const AdminLayout = () => {
    return (
        <div className="admin-layout" style={{ display: "flex", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
            <Sidebar />
            <motion.div
                className="admin-content"
                style={{ flex: 1, marginLeft: "260px", padding: "30px", overflowY: "auto" }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
            >
                <Outlet />
            </motion.div>
        </div>
    );
};

export default AdminLayout;
