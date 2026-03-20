import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Customer Pages
import Dashboard from '../pages/customer/Dashboard';
import Checkout from '../pages/customer/Checkout';
import OrderHistory from '../pages/customer/OrderHistory';

// Owner Pages
import LiveOrders from '../pages/owner/LiveOrders';
import MenuEditor from '../pages/owner/MenuEditor';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Customer Routes */}
      <Route path="/dashboard" element={<ProtectedRoute allowedRole="CUSTOMER"><Dashboard /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute allowedRole="CUSTOMER"><Checkout /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute allowedRole="CUSTOMER"><OrderHistory /></ProtectedRoute>} />

      {/* Owner Routes */}
      <Route path="/owner/orders" element={<ProtectedRoute allowedRole="OWNER"><LiveOrders /></ProtectedRoute>} />
      <Route path="/owner/menu" element={<ProtectedRoute allowedRole="OWNER"><MenuEditor /></ProtectedRoute>} />
    </Routes>
  );
};