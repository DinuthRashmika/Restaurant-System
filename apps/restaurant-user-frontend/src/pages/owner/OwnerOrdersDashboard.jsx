import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Bell, 
  LogOut,
  AlertCircle,
  Clock,
  ChefHat,
  CheckCircle2,
  PackageCheck,
  Search
} from "lucide-react";
import { getAllOrders, updateOrderStatus } from "../../services/orderService"; 
import { useAuth } from "../../context/AuthContext";
import { setToken } from "../../api/axios";

export default function OwnerOrdersDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useAuth();
  const currentPath = location.pathname;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all"); 
  const [searchQuery, setSearchQuery] = useState("");
  
  // THE FIX: Added a strict ref and a more robust state for the dropdown
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // THE FIX: Global listener to close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      let currentToken = auth?.token || auth?.accessToken;
      if (!currentToken) {
        try {
          const storedAuth = JSON.parse(localStorage.getItem("auth"));
          currentToken = storedAuth?.token || storedAuth?.accessToken;
        } catch (e) {}
      }
      if (currentToken) setToken(currentToken);

      const orderRes = await getAllOrders();

      const extractArrayAggressive = (obj) => {
        if (!obj) return [];
        if (Array.isArray(obj)) return obj;
        let foundArrays = [];
        const search = (item) => {
          if (!item || typeof item !== 'object') return;
          for (let key in item) {
            if (Array.isArray(item[key])) foundArrays.push(item[key]);
            else if (item[key] && typeof item[key] === 'object') search(item[key]);
          }
        };
        search(obj);
        if (foundArrays.length > 0) return foundArrays.sort((a, b) => b.length - a.length)[0];
        return [];
      };

      const extractedOrders = extractArrayAggressive(orderRes);
      
      const sortedOrders = extractedOrders.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.orderDate || 0);
        const dateB = new Date(b.createdAt || b.orderDate || 0);
        return dateB - dateA;
      });

      setOrders(sortedOrders);
    } catch (err) {
      console.error("Order Fetch Failed:", err);
      setError(`Failed to load orders: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => fetchOrders(), 15000);
    return () => clearInterval(interval);
  }, [auth]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setError(""); 
      
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      
      await updateOrderStatus(orderId, newStatus);
      
      fetchOrders();

    } catch (err) {
      console.error("Status Update Failed:", err);
      
      setError(`Backend Error 500: The server crashed when changing status to ${newStatus}. Please check your Java terminal logs.`);
      setTimeout(() => setError(""), 8000);
      
      fetchOrders(); 
    }
  };

  const getWorkflowDetails = (rawStatus) => {
    const s = String(rawStatus || "PENDING").toUpperCase();
    if (s === "PENDING") return { color: "bg-red-50 text-red-600 border-red-100", label: "NEW", nextStatus: "PREPARING", btnText: "APPROVE", icon: <AlertCircle size={14}/> };
    if (s === "PREPARING") return { color: "bg-[#1f2937]/5 text-[#1f2937] border-gray-200", label: "PREPARING", nextStatus: "CONFIRMED", btnText: "MARK READY", icon: <ChefHat size={14}/> };
    if (s === "CONFIRMED") return { color: "bg-blue-50 text-blue-600 border-blue-100", label: "READY", nextStatus: "COMPLETED", btnText: "HANDED OVER", icon: <PackageCheck size={14}/> };
    if (s === "COMPLETED") return { color: "bg-green-50 text-green-600 border-green-100", label: "COMPLETED", nextStatus: null, btnText: null, icon: <CheckCircle2 size={14}/> };
    if (s === "CANCELLED") return { color: "bg-gray-50 text-gray-500 border-gray-200", label: "CANCELLED", nextStatus: null, btnText: null, icon: <Clock size={14}/> };
    return { color: "bg-gray-50 text-gray-600 border-gray-200", label: s, nextStatus: null, btnText: null, icon: <Clock size={14}/> };
  };

  const incomingOrders = orders.filter(o => String(o.status || "").toUpperCase() === "PENDING");
  const kitchenOrders = orders.filter(o => String(o.status || "").toUpperCase() === "PREPARING");
  const readyOrders = orders.filter(o => String(o.status || "").toUpperCase() === "CONFIRMED");
  const completedOrders = orders.filter(o => String(o.status || "").toUpperCase() === "COMPLETED");

  const getActiveOrders = () => {
      let baseOrders = orders;
      if(activeTab === "incoming") baseOrders = incomingOrders;
      else if(activeTab === "kitchen") baseOrders = kitchenOrders;
      else if(activeTab === "ready") baseOrders = readyOrders;
      else if(activeTab === "completed") baseOrders = completedOrders;
      
      if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          return baseOrders.filter(o => 
              (o.id && String(o.id).toLowerCase().includes(q)) ||
              (o.customerName && String(o.customerName).toLowerCase().includes(q)) ||
              (o.deliveryAddress && String(o.deliveryAddress).toLowerCase().includes(q))
          );
      }
      
      return baseOrders;
  };

  const activeOrders = getActiveOrders();

  const formatTime = (dateString) => {
      if(!dateString) return "JUST NOW";
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return "JUST NOW";
      if (diffMins < 60) return `${diffMins} MIN AGO`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} HR AGO`;
      return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans flex flex-col items-center pb-12">
      
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm py-4 border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-16">
            <Link to="/owner/dashboard">
              <h1 className="text-xl md:text-2xl font-black italic tracking-tighter text-[#1f2937] transition-colors hover:text-[#d05322]">
                Digital Maitre D
              </h1>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-10">
              <Link to="/owner/dashboard" className={`text-[13px] font-bold tracking-widest uppercase transition-colors duration-300 flex flex-col after:h-0.5 after:mt-1 ${currentPath === '/owner/dashboard' ? 'text-[#1f2937] after:w-full after:bg-[#d05322]' : 'text-[#6b7280] hover:text-[#1f2937] after:w-0 hover:after:w-full hover:after:bg-[#d05322]/50'}`}>Dashboard</Link>
              <Link to="/owner/orders" className={`text-[13px] font-bold tracking-widest uppercase transition-colors duration-300 flex flex-col after:h-0.5 after:mt-1 ${currentPath === '/owner/orders' ? 'text-[#1f2937] after:w-full after:bg-[#d05322]' : 'text-[#6b7280] hover:text-[#1f2937] after:w-0 hover:after:w-full hover:after:bg-[#d05322]/50'}`}>Live Orders</Link>
              <Link to="/owner/menu" className={`text-[13px] font-bold tracking-widest uppercase transition-colors duration-300 flex flex-col after:h-0.5 after:mt-1 ${currentPath === '/owner/menu' ? 'text-[#1f2937] after:w-full after:bg-[#d05322]' : 'text-[#6b7280] hover:text-[#1f2937] after:w-0 hover:after:w-full hover:after:bg-[#d05322]/50'}`}>Menu Editor</Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            
            {/* THE FIX: Ref attached to this container, stopPropagation prevents click from getting lost */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowNotifications(prev => !prev);
                }}
                className="text-[#6b7280] hover:text-[#d05322] transition-colors relative flex items-center justify-center h-10 w-10 rounded-full hover:bg-orange-50 focus:outline-none"
              >
                <Bell size={20} strokeWidth={2.5} />
                {incomingOrders.length > 0 && (
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#d05322] rounded-full border-2 border-white animate-pulse"></div>
                )}
              </button>

              {/* The high z-index dropdown */}
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-4 z-[9999] animate-in fade-in slide-in-from-top-2">
                  <div className="px-6 pb-3 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="text-[14px] font-extrabold text-[#1f2937]">Notifications</h3>
                    <span className="text-[10px] font-black tracking-widest bg-orange-50 text-[#d05322] px-2 py-0.5 rounded-full">
                      {incomingOrders.length} NEW
                    </span>
                  </div>
                  
                  <div className="max-h-[300px] overflow-y-auto">
                    {incomingOrders.length === 0 ? (
                      <div className="px-6 py-8 text-center text-[13px] text-gray-500 font-medium">
                        You're all caught up!
                      </div>
                    ) : (
                      incomingOrders.slice(0, 5).map(order => (
                        <div 
                          key={order.id} 
                          className="px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer" 
                          onClick={() => {setActiveTab("incoming"); setShowNotifications(false);}}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[13px] font-bold text-[#1f2937]">New Order #{order.id?.slice(-4).toUpperCase()}</span>
                            <span className="text-[10px] font-bold text-gray-400">{formatTime(order.createdAt || order.orderDate)}</span>
                          </div>
                          <p className="text-[12px] text-gray-500 line-clamp-1">{order.customerName}</p>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {incomingOrders.length > 5 && (
                    <div className="px-6 pt-3 border-t border-gray-50 text-center">
                      <button 
                        onClick={() => {setActiveTab("incoming"); setShowNotifications(false);}} 
                        className="text-[11px] font-bold text-[#d05322] hover:text-[#b84318] uppercase tracking-widest"
                      >
                        View All Incoming
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link to="/profile"><div className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-transparent hover:border-[#d05322] transition-colors shadow-sm" style={{backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80')"}}></div></Link>
            <div className="h-6 w-px bg-gray-200 hidden sm:block mx-1"></div>
            <button onClick={handleLogout} className="flex items-center justify-center h-10 w-10 rounded-full text-gray-500 hover:text-[#d05322] hover:bg-orange-50 transition-all duration-300 focus:outline-none"><LogOut size={20} strokeWidth={2.5} /></button>
          </div>
        </div>
      </header>

      <div className="h-[100px] w-full"></div>

      <div className="w-full max-w-[1440px] px-8 py-6">
        
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-sm animate-in fade-in slide-in-from-top-4">
            <AlertCircle size={24} className="flex-shrink-0" />
            <div>
              <h4 className="font-bold text-[15px]">API Connection Issue</h4>
              <p className="text-[13px] font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-[32px] font-extrabold text-[#1f2937] tracking-tight">Live Orders</h2>
            <p className="text-[14px] text-[#6b7280] mt-1">Manage the kitchen workflow and fulfill customer requests.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative group w-full sm:w-64 flex-shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] group-focus-within:text-[#d05322] transition-colors" size={16} strokeWidth={2.5}/>
              <input
                type="text"
                placeholder="Search by ID or Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#e5e7eb] rounded-full pl-10 pr-4 py-2.5 text-[12px] font-bold text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#d05322] focus:ring-1 focus:ring-[#d05322] transition-all shadow-sm"
              />
            </div>

            <div className="flex bg-white rounded-full p-1.5 border border-[#e5e7eb] shadow-sm overflow-x-auto scrollbar-hide w-full sm:w-auto">
              {["ALL", "NEW", "PREPARING", "READY", "COMPLETED"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(
                    tab === "ALL" ? "all" : 
                    tab === "NEW" ? "incoming" : 
                    tab === "PREPARING" ? "kitchen" : 
                    tab === "READY" ? "ready" : 
                    "completed"
                  )}
                  className={`px-5 py-2.5 rounded-full text-[12px] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${
                    (activeTab === "incoming" && tab === "NEW") || 
                    (activeTab === "kitchen" && tab === "PREPARING") || 
                    (activeTab === "ready" && tab === "READY") || 
                    (activeTab === "all" && tab === "ALL") ||
                    (activeTab === "completed" && tab === "COMPLETED")
                      ? "bg-[#1f2937] text-white shadow-md" 
                      : "text-[#6b7280] hover:text-[#1f2937] hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e5e7eb]">
            <div className="flex items-center gap-8">
            <button onClick={() => setActiveTab("incoming")} className={`text-[13px] font-extrabold tracking-widest uppercase transition-colors relative ${activeTab === "incoming" ? "text-[#d05322]" : "text-[#9ca3af] hover:text-[#6b7280]"}`}>
                INCOMING ({incomingOrders.length})
                {activeTab === "incoming" && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#d05322]" />}
            </button>
            <button onClick={() => setActiveTab("kitchen")} className={`text-[13px] font-extrabold tracking-widest uppercase transition-colors relative ${activeTab === "kitchen" ? "text-[#1f2937]" : "text-[#9ca3af] hover:text-[#6b7280]"}`}>
                KITCHEN ({kitchenOrders.length})
                {activeTab === "kitchen" && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#1f2937]" />}
            </button>
            <button onClick={() => setActiveTab("ready")} className={`text-[13px] font-extrabold tracking-widest uppercase transition-colors relative ${activeTab === "ready" ? "text-[#10b981]" : "text-[#9ca3af] hover:text-[#6b7280]"}`}>
                READY ({readyOrders.length})
                {activeTab === "ready" && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#10b981]" />}
            </button>
            </div>
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-green-700 tracking-widest uppercase">KITCHEN OPEN</span>
            </div>
        </div>

        {loading && orders.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {[1,2,3,4].map(n => <div key={n} className="h-64 rounded-3xl bg-gray-200 animate-pulse border border-[#e5e7eb]"></div>)}
          </div>
        ) : activeOrders.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-[#e5e7eb] rounded-[2rem] p-16 text-center">
            <PackageCheck size={48} className="mx-auto text-gray-300 mb-4" strokeWidth={1.5} />
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">No orders to display</h3>
            <p className="text-gray-500 text-sm">
              {searchQuery ? `No orders found matching "${searchQuery}"` : `There are no orders in the "${activeTab.toUpperCase()}" category.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeOrders.map(order => {
              const workflow = getWorkflowDetails(order.status);
              const orderTotal = parseFloat(order.totalAmount || order.totalPrice || order.items?.reduce((sum, i) => sum + (parseFloat(i.unitPrice || i.price || 0) * parseInt(i.quantity || 1, 10)), 0) || 0);
              const formattedDate = order.createdAt || order.orderDate ? new Date(order.createdAt || order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just Now";

              return (
                <div key={order.id} className="bg-white rounded-3xl border border-[#e5e7eb] shadow-sm flex flex-col hover:shadow-md transition-shadow group relative overflow-hidden">
                  
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${workflow.color.split(' ')[0]}`}></div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-extrabold text-[#1f2937] text-[15px]">Order</h3>
                        <p className="text-[14px] text-[#1f2937] font-black mt-1">
                          #{order.id ? order.id.slice(-6).toUpperCase() : "N/A"}
                        </p>
                        <p className="text-[12px] text-[#6b7280] font-medium flex items-center gap-1 mt-1">
                          <Clock size={12}/> {formattedDate}
                        </p>
                      </div>
                      <div className={`px-2.5 py-1 rounded-md border text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 ${workflow.color}`}>
                        {workflow.icon} {workflow.label}
                      </div>
                    </div>

                    <div className="bg-[#fafaf9] rounded-xl p-3 mb-6 border border-gray-100">
                      <p className="text-[13px] font-bold text-[#1f2937]">{order.customerName || "Walk-in Customer"}</p>
                      <p className="text-[11px] text-[#6b7280] truncate mt-0.5">{order.deliveryAddress || "Dine-in / Pickup"}</p>
                    </div>

                    <div className="flex-1 space-y-3 mb-6 max-h-[160px] overflow-y-auto pr-2">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start text-[13px]">
                          <div className="flex gap-2.5">
                            <span className="font-black text-[#1f2937] bg-gray-100 px-1.5 rounded">{item.quantity}x</span>
                            <span className="font-medium text-[#4b5563] leading-snug">{item.itemName || item.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-dashed border-[#e5e7eb] pt-4 mt-auto">
                      <div className="flex justify-between items-center mb-5">
                        <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest">Total</span>
                        <span className="font-black text-[#1f2937] text-[18px]">${orderTotal.toFixed(2)}</span>
                      </div>

                      {workflow.nextStatus ? (
                        <div className="flex gap-2">
                          {workflow.label === "NEW" && (
                            <button 
                                onClick={() => handleStatusUpdate(order.id, "CANCELLED")}
                                className="text-[12px] font-bold text-[#9ca3af] hover:text-[#4b5563] uppercase tracking-wider px-2 focus:outline-none"
                            >
                                REJECT
                            </button>
                          )}
                          <button
                            onClick={() => handleStatusUpdate(order.id, workflow.nextStatus)}
                            className={`w-full py-3.5 rounded-xl text-[13px] font-black tracking-widest uppercase transition-all flex justify-center items-center gap-2 focus:outline-none ${
                              workflow.nextStatus === "PREPARING" ? "bg-[#d05322] text-white hover:bg-[#b84318] shadow-md" :
                              workflow.nextStatus === "CONFIRMED" ? "bg-[#1f2937] text-white hover:bg-black shadow-md" :
                              "bg-white border border-[#1f2937] text-[#1f2937] hover:bg-[#1f2937] hover:text-white"
                            }`}
                          >
                            {workflow.btnText}
                          </button>
                        </div>
                      ) : (
                        <div className="w-full py-3.5 rounded-xl text-[13px] font-black tracking-widest uppercase bg-gray-100 text-gray-400 flex justify-center items-center gap-2 cursor-not-allowed">
                          <CheckCircle2 size={16} /> COMPLETED
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}