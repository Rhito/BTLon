import { Routes, Route, Navigate } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import RequirePermission from "@/components/common/RequirePermission";
import NotFound from "@/pages/NotFound";
import GuestLayout from "@/layouts/GuestLayout";
import AdminLayout from "@/layouts/AdminLayout";
import Home from "@/pages/guest/Home";
import Product from "@/pages/guest/Product";
import ProductList from "@/pages/Admin/ProductList";
import Cart from "@/pages/guest/Cart";
import Checkout from "@/pages/guest/Checkout";
import OrderSuccess from "@/pages/guest/OrderSuccess";
import TrackOrder from "@/pages/guest/TrackOrder";
import AdminLogin from "@/pages/admin/Login";
import Category from "@/pages/admin/Categories";
import ProductForm from "@/components/admin/ProductForm";
import Dashboard from "@/pages/admin/Dashboard";
import ProductDetail from "@/pages/guest/ProductDetail";
import Orders from "@/pages/admin/Orders";
import OrderDetail from "@/pages/admin/OrderDetail";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Product />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route path="track-order" element={<TrackOrder />} />
      </Route>

      <Route path="admin/login" element={<AdminLogin />} />

      <Route path="admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<RequirePermission permission="view_dashboard" fallback={<Navigate to="/admin/orders" replace />}><Dashboard /></RequirePermission>} />
        <Route path="categories" element={<Category />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/create" element={<RequirePermission permission="manage_products" fallback={<Navigate to="/admin/products" replace />}><ProductForm /></RequirePermission>} />
        <Route path="products/:id/edit" element={<RequirePermission permission="manage_products" fallback={<Navigate to="/admin/products" replace />}><ProductForm /></RequirePermission>} />
        <Route path="orders" element={<RequirePermission permission="manage_orders"><Orders /></RequirePermission>} />
        <Route path="orders/:id" element={<RequirePermission permission="manage_orders"><OrderDetail /></RequirePermission>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
