import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import MenuView from "./pages/customer/MenuView";
import CheckoutPage from "./pages/customer/CheckoutPage";
import OrderConfirmation from "./pages/customer/OrderConfirmation";
import OrderHistory from "./pages/customer/OrderHistory";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerOrdersDashboard from "./pages/owner/OwnerOrdersDashboard";
import MenuManagement from "./pages/owner/MenuManagement";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./context/CartContext";

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Customer Routes */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <MenuView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-confirmation/:orderId"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <OrderConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-history"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <OrderHistory />
            </ProtectedRoute>
          }
        />

        {/* Owner Routes */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute allowedRoles={["OWNER"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/orders"
          element={
            <ProtectedRoute allowedRoles={["OWNER"]}>
              <OwnerOrdersDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/menu"
          element={
            <ProtectedRoute allowedRoles={["OWNER"]}>
              <MenuManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER", "OWNER"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </CartProvider>
  );
}