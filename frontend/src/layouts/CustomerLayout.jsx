import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/customer/Navbar";
import Footer from "../components/customer/Footer";

const CustomerLayout = () => {
    return (
        <div className="customer-layout">
            <Navbar />
            <motion.main
                className="container customer-main animate-fade-in"
                style={{ minHeight: "80vh" }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
            >
                <Outlet />
            </motion.main>
            <Footer />
            <style jsx>{`
                .customer-layout {
                    --container-width: 1380px;
                    --container-padding: 24px;
                }

                .customer-main {
                    min-height: 80vh;
                    margin-top: 16px;
                    margin-bottom: var(--spacing-section);
                }
            `}</style>
        </div>
    );
};

export default CustomerLayout;
