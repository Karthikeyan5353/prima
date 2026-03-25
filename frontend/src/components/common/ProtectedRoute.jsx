import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={adminOnly ? "/admin/login" : "/customer/login"} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/products" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
