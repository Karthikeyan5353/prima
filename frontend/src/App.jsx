import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Flash from "./pages/customer/Flash";
import CustomerLogin from "./pages/customer/CustomerLogin";
import CustomerRegister from "./pages/customer/CustomerRegister";
import CustomerHome from "./pages/customer/CustomerHome";
import Products from "./pages/customer/Products";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import PaymentSuccess from "./pages/customer/PaymentSuccess";
import OrderHistory from "./pages/customer/OrderHistory";
import ProductDetails from "./pages/customer/ProductDetails";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminHome from "./pages/admin/AdminHome";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import ManageProducts from "./pages/admin/ManageProducts";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Flash />} />
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/register" element={<CustomerRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<CustomerLayout />}>
              <Route path="/customer/home" element={<CustomerHome />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/my-orders" element={<OrderHistory />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute adminOnly />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/home" element={<AdminHome />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/products" element={<ManageProducts />} />
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
