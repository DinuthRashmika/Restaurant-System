import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import { getAllMenuItems } from "../../services/menuService";

export default function OwnerOrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("today");
  const [year, setYear] = useState("2023");
  const [month, setMonth] = useState("1");
  const [day, setDay] = useState("1");
  const [week, setWeek] = useState("1");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, menuRes] = await Promise.all([
        getAllOrders(),
        getAllMenuItems()
      ]);
      
      if (ordersRes.success) setOrders(ordersRes.data);
      if (menuRes.success) setMenuItems(menuRes.data);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await updateOrderStatus(orderId, newStatus);
      if (response.success) {
        setOrders(prev => 
          prev.map(order => 
            order.id === orderId ? response.data : order
          )
        );
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  // Calculate stats
  const activeOrders = orders.filter(o => 
    o.status !== "COMPLETED" && o.status !== "CANCELLED"
  ).length;
  
  const todaySales = orders
    .filter(o => {
      const orderDate = new Date(o.createdAt).toDateString();
      const today = new Date().toDateString();
      return orderDate === today;
    })
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const avgOrderTime = "18m"; // This would come from real data
  const completedToday = orders.filter(o => {
    const orderDate = new Date(o.createdAt).toDateString();
    const today = new Date().toDateString();
    return orderDate === today && o.status === "COMPLETED";
  }).length;

  const filteredOrders = orders.filter(order => {
    if (filter === "active") return order.status !== "COMPLETED" && order.status !== "CANCELLED";
    if (filter === "ready") return order.status === "PREPARING";
    if (filter === "completed") return order.status === "COMPLETED";
    return true;
  }).filter(order => 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Topbar />

        {/* Header */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">BISTRO LUXE</h1>
            <p className="text-sm text-gray-500">Advent Portal</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="SEARCH ORDER"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48 text-sm outline-none"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex gap-6 border-b border-gray-200">
          <button className="border-b-2 border-orange-600 pb-2 font-semibold text-orange-600">
            Dashboard
          </button>
          <button className="pb-2 text-gray-500 hover:text-gray-700">Live Orders</button>
          <button className="pb-2 text-gray-500 hover:text-gray-700">Menu Editor</button>
          <button className="pb-2 text-gray-500 hover:text-gray-700">Analytics</button>
          <button className="pb-2 text-gray-500 hover:text-gray-700">Settings</button>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 grid gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Live Orders</p>
            <p className="text-2xl font-bold text-gray-900">{activeOrders}</p>
            <p className="text-xs text-gray-400">active deliveries in progress</p>
          </div>
          
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">TOTAL SALES TODAY</p>
            <p className="text-2xl font-bold text-gray-900">${todaySales.toFixed(2)}</p>
          </div>
          
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Hourly Performance</p>
            <div className="mt-2 flex gap-2">
              <select value={year} onChange={(e) => setYear(e.target.value)} className="text-xs border rounded px-1">
                <option>2023</option>
                <option>2024</option>
              </select>
              <select value={month} onChange={(e) => setMonth(e.target.value)} className="text-xs border rounded px-1">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
              <select value={day} onChange={(e) => setDay(e.target.value)} className="text-xs border rounded px-1">
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </select>
              <select value={week} onChange={(e) => setWeek(e.target.value)} className="text-xs border rounded px-1">
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </select>
            </div>
          </div>
          
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Quick Stats</p>
            <div className="mt-2 flex justify-between">
              <div>
                <p className="text-xs text-gray-400">Avg Order</p>
                <p className="font-semibold">{avgOrderTime}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Completed</p>
                <p className="font-semibold">{completedToday}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kitchen Status */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-semibold">KITCHEN OPEN</span>
          </div>
          <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">KITCHEN</button>
          <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">READY</button>
          <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">FILTER</button>
        </div>

        {/* Orders List */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {filteredOrders.map((order) => (
            <div key={order.id} className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{order.customerName}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {order.items.map(item => `${item.quantity}x ${item.itemName}`).join(' • ')}
                  </p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                  order.status === "CONFIRMED" ? "bg-blue-100 text-blue-700" :
                  order.status === "PREPARING" ? "bg-purple-100 text-purple-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {order.status}
                </span>
              </div>
              
              <div className="mt-4 flex gap-2">
                {order.status === "PENDING" && (
                  <>
                    <button 
                      onClick={() => handleStatusUpdate(order.id, "CONFIRMED")}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                    >
                      CONFIRM
                    </button>
                    <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                      QUICK-SHIP
                    </button>
                  </>
                )}
                {order.status === "CONFIRMED" && (
                  <button 
                    onClick={() => handleStatusUpdate(order.id, "PREPARING")}
                    className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700"
                  >
                    START PREPARING
                  </button>
                )}
                {order.status === "PREPARING" && (
                  <button 
                    onClick={() => handleStatusUpdate(order.id, "COMPLETED")}
                    className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                  >
                    MARK COMPLETED
                  </button>
                )}
              </div>
              
              {order.status === "PREPARING" && (
                <p className="mt-2 text-xs text-gray-400">Kitchen: 10 minutes</p>
              )}
            </div>
          ))}
        </div>

        {/* New Orders Alert */}
        <div className="mt-6 rounded-lg bg-orange-100 p-4">
          <p className="font-semibold text-orange-800">🚀 NEW ORDERS</p>
          <p className="text-sm text-orange-600">3 new orders need confirmation</p>
        </div>

        {/* Manual Order Section */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-bold text-gray-900">New Manual Order</h3>
          <p className="text-sm text-gray-500">
            Teams of professionals working together to create a seamless ordering experience.
          </p>
          <button className="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700">
            Create Order
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-wrap justify-between gap-4 text-sm">
            <div>
              <p className="font-semibold text-gray-900">Digital Maître D'</p>
              <p className="text-gray-500">Elevating restaurant operations with editorial design and professional tools.</p>
            </div>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-gray-500 hover:text-gray-700">Privacy</Link>
              <Link to="/terms" className="text-gray-500 hover:text-gray-700">Terms</Link>
              <Link to="/support" className="text-gray-500 hover:text-gray-700">Support</Link>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-gray-400">
            © 2024 Digital Maître D' Technologies
          </p>
        </footer>
      </div>
    </div>
  );
}