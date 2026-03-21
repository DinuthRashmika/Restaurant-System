import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { useAuth } from "../../context/AuthContext";
import { getOrdersByCustomerId } from "../../services/orderService";

export default function OrderHistory() {
  const { auth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrdersByCustomerId(auth.userId);
      if (response.success) {
        setOrders(response.data);
        // Find active order (not completed or cancelled)
        const active = response.data.find(
          order => order.status !== "COMPLETED" && order.status !== "CANCELLED"
        );
        setActiveOrder(active);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "PENDING": return "bg-yellow-100 text-yellow-700";
      case "CONFIRMED": return "bg-blue-100 text-blue-700";
      case "PREPARING": return "bg-purple-100 text-purple-700";
      case "COMPLETED": return "bg-green-100 text-green-700";
      case "CANCELLED": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    if (filter === "active") return order.status !== "COMPLETED" && order.status !== "CANCELLED";
    if (filter === "completed") return order.status === "COMPLETED";
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Topbar />

        {/* Header with navigation */}
        <div className="mt-8 flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-gray-900">Digital Maitre D'</h1>
            <nav className="flex gap-4">
              <Link to="/menu" className="text-sm text-gray-500 hover:text-gray-700">Explore</Link>
              <Link to="/orders" className="text-sm font-semibold text-orange-600">Orders</Link>
            </nav>
          </div>
        </div>

        {/* Active Order Section */}
        {activeOrder && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900">Track your feast.</h2>
            <p className="text-gray-500">Your culinary journey is currently in progress.</p>
            
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">L'Artisan Brasserie</h3>
                  <p className="text-sm text-gray-500">Order #{activeOrder.id.slice(-8).toUpperCase()} • {activeOrder.items.length} items</p>
                </div>
              </div>
              
              {/* Status Timeline */}
              <div className="mt-6 flex items-center justify-between">
                {["CONFIRMED", "PREPARING", "ON_THE_WAY", "DELIVERED"].map((status, index) => {
                  const statusMap = {
                    "CONFIRMED": 0,
                    "PREPARING": 1,
                    "ON_THE_WAY": 2,
                    "DELIVERED": 3
                  };
                  const currentStatus = statusMap[activeOrder.status] || 0;
                  const isCompleted = index <= currentStatus;
                  
                  return (
                    <div key={status} className="flex flex-col items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        isCompleted ? "bg-orange-600" : "bg-gray-200"
                      }`}>
                        {isCompleted && (
                          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`mt-2 text-xs ${
                        isCompleted ? "text-orange-600 font-semibold" : "text-gray-400"
                      }`}>
                        {status.replace("_", " ")}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 flex gap-3">
                <button className="flex-1 rounded-lg bg-orange-600 py-2 text-sm font-semibold text-white hover:bg-orange-700">
                  Track Live
                </button>
                <button className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Order Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Past Orders */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Past Orders</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
            >
              <option value="all">All Orders</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {loading ? (
            <div className="mt-4 space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-32 animate-pulse rounded-xl bg-gray-200"></div>
              ))}
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {filteredOrders.filter(order => order.id !== activeOrder?.id).map((order) => (
                <div key={order.id} className="rounded-xl border border-gray-200 bg-white p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-gray-900">The Burger Collective</h3>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="mt-2 text-sm text-gray-600">
                        {order.items.map(item => `${item.quantity}x ${item.itemName}`).join(' • ')}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                      <div className="mt-2 flex gap-2">
                        <button className="rounded-lg bg-orange-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-orange-700">
                          Reorder
                        </button>
                        <button className="rounded-lg border border-gray-300 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                          View Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                  <p className="text-gray-500">No orders found</p>
                </div>
              )}
            </div>
          )}

          {/* View older orders link */}
          {filteredOrders.length > 5 && (
            <button className="mt-4 text-sm font-semibold text-orange-600 hover:text-orange-700">
              View older orders →
            </button>
          )}
        </div>

        {/* Footer Links */}
        <footer className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-700">Terms of Service</Link>
            <Link to="/partner-support" className="hover:text-gray-700">Partner Support</Link>
            <Link to="/contact" className="hover:text-gray-700">Contact Us</Link>
          </div>
          <p className="mt-4 text-center text-xs text-gray-400">
            © 2024 Digital Maitre D' Technologies
          </p>
        </footer>
      </div>
    </div>
  );
}