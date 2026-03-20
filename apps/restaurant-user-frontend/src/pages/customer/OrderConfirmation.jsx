import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { getOrderById } from "../../services/orderService";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await getOrderById(orderId);
      if (response.success) {
        setOrder(response.data);
      }
    } catch (err) {
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <Topbar />
          <div className="mt-12 text-center">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <Topbar />
          <div className="mt-12 text-center text-red-600">{error || "Order not found"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <Topbar />

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Order Confirmed!</h2>
          <p className="mt-2 text-gray-500">
            Thank you for your order. Your food is being prepared.
          </p>
          
          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="text-xl font-bold text-orange-600">#{order.id.slice(-8).toUpperCase()}</p>
          </div>

          <div className="mt-6 text-left">
            <h3 className="font-semibold text-gray-900">Order Details</h3>
            <div className="mt-3 space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.itemName}</span>
                  <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Delivery to: {order.deliveryAddress}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Estimated delivery: 30-45 minutes
            </p>
          </div>

          <div className="mt-8 flex gap-4">
            <Link
              to="/order-history"
              className="flex-1 rounded-lg border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Track Order
            </Link>
            <Link
              to="/menu"
              className="flex-1 rounded-lg bg-orange-600 py-3 font-semibold text-white hover:bg-orange-700"
            >
              Order More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}