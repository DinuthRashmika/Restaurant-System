import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getOrdersByCustomerId, getAllOrders, createOrder } from "../../services/orderService";
import { 
  X, 
  AlertCircle, 
  Bell, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Sparkles,
  ShoppingBag
} from "lucide-react"; 

export default function OrderHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { auth, logout } = useAuth();
  
  const [scrolled, setScrolled] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [activeOrder, setActiveOrder] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  
  const [processingId, setProcessingId] = useState(null);
  const [reorderError, setReorderError] = useState("");

  const storedAuth = JSON.parse(localStorage.getItem("auth")) || {};
  const customerId = auth?.user?.id || auth?.userId || auth?.id || storedAuth?.user?.id || storedAuth?.id;
  const customerName = auth?.user?.name || auth?.user?.fullName || storedAuth?.user?.name;
  const customerEmail = auth?.user?.email || storedAuth?.user?.email || "customer@digitalmaitred.com";

  // Scroll effect for immersive navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchOrders();
  }, [auth]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      let fetchedOrders = [];

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

      if (customerId) {
        try {
          const response = await getOrdersByCustomerId(customerId);
          fetchedOrders = extractArrayAggressive(response);
        } catch (e) {
          console.warn("Failed to fetch by customer ID, attempting fallback...");
        }
      }

      if (fetchedOrders.length === 0) {
        const allRes = await getAllOrders();
        const allOrders = extractArrayAggressive(allRes);
        
        fetchedOrders = allOrders.filter(o => 
          (customerId && String(o.customerId) === String(customerId)) || 
          (customerName && o.customerName === customerName)
        );
      }

      fetchedOrders.sort((a, b) => new Date(b.createdAt || b.orderDate || 0) - new Date(a.createdAt || a.orderDate || 0));
      setOrders(fetchedOrders);

      const active = fetchedOrders.find(order => {
        const s = String(order.status).toUpperCase();
        return s !== "COMPLETED" && s !== "DELIVERED" && s !== "CANCELLED";
      });
      
      setActiveOrder(active || null);
      
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (pastOrder) => {
    setProcessingId(pastOrder.id);
    setReorderError(""); 
    
    try {
      const exactItems = pastOrder.items?.map(item => ({
        menuItemId: String(item.menuItemId || item.id || "0"), 
        itemName: String(item.itemName || item.name || "Item"),
        unitPrice: parseFloat(item.unitPrice || item.price || 0),
        quantity: parseInt(item.quantity || 1, 10)
      })) || [];

      const orderPayload = {
        customerId: String(customerId || pastOrder.customerId || "user-123"),
        customerName: String(customerName || pastOrder.customerName || "Customer"),
        customerEmail: String(customerEmail),
        deliveryAddress: String(pastOrder.deliveryAddress || "Dine-in / Pickup"),
        items: exactItems
      };

      await createOrder(orderPayload);
      await fetchOrders(); 
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (err) {
      console.error("Reorder failed", err);
      let backendMessage = err.response?.data?.message || err.message;
      if (err.response?.data?.errors) {
         backendMessage = JSON.stringify(err.response.data.errors);
      }
      setReorderError(`Backend Validation Failed: ${backendMessage}.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status) => {
    const s = String(status).toUpperCase();
    if (s === "PENDING" || s === "PLACED") return "bg-red-50 text-red-600 border-red-100";
    if (s === "PREPARING" || s === "PROCESSING") return "bg-orange-50 text-[#d05322] border-orange-100";
    if (s === "CONFIRMED" || s === "READY") return "bg-blue-50 text-blue-600 border-blue-100";
    if (s === "COMPLETED" || s === "DELIVERED") return "bg-green-50 text-green-600 border-green-100";
    if (s === "CANCELLED") return "bg-gray-50 text-gray-500 border-gray-200";
    return "bg-gray-100 text-gray-700";
  };

  const filteredOrders = orders.filter(order => {
    const s = String(order.status).toUpperCase();
    if (filter === "all") return true;
    if (filter === "active") return s !== "COMPLETED" && s !== "DELIVERED" && s !== "CANCELLED";
    if (filter === "completed") return s === "COMPLETED" || s === "DELIVERED";
    return true;
  });

  const workflowSteps = [
    { key: "PENDING", label: "CONFIRMED" },
    { key: "PREPARING", label: "PREPARING" },
    { key: "CONFIRMED", label: "ON THE WAY" }, 
    { key: "COMPLETED", label: "DELIVERED" }
  ];

  const getStepIndex = (status) => {
    const s = String(status).toUpperCase();
    if (s === "PENDING" || s === "PLACED") return 0;
    if (s === "PREPARING" || s === "PROCESSING") return 1;
    if (s === "CONFIRMED" || s === "READY") return 2;
    if (s === "COMPLETED" || s === "DELIVERED") return 3;
    return -1; 
  };

  const formatModalTime = (dateString) => {
    if (!dateString) return "Just Now";
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans selection:bg-[#d05322] selection:text-white pb-20">
      
      {/* IMMERSIVE HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm py-4 border-b border-white/20' : 'bg-gradient-to-b from-black/70 to-transparent py-8'}`}>
        <div className="max-w-[1440px] mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-16">
            <Link to="/customer/dashboard">
              <h1 className={`text-2xl font-black italic tracking-tighter transition-colors duration-500 ${scrolled ? 'text-[#1f2937]' : 'text-white drop-shadow-md'}`}>
                Digital Maitre D'
              </h1>
            </Link>
            <nav className="hidden lg:flex items-center gap-10">
              <Link to="/customer/dashboard" className={`text-[12px] font-black tracking-[0.15em] uppercase transition-colors duration-500 ${scrolled ? 'text-[#9ca3af] hover:text-[#d05322]' : 'text-white/60 hover:text-white'}`}>
                Explore
              </Link>
              <Link to="/menu" className={`text-[12px] font-black tracking-[0.15em] uppercase transition-colors duration-500 ${scrolled ? 'text-[#9ca3af] hover:text-[#d05322]' : 'text-white/60 hover:text-white'}`}>
                Order Now
              </Link>
              <Link to="/order-history" className={`text-[12px] font-black tracking-[0.15em] uppercase transition-colors duration-500 ${scrolled ? 'text-[#1f2937]' : 'text-white'} flex flex-col after:w-full after:h-[2px] after:bg-[#d05322] after:mt-1.5`}>
                History
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <button className={`transition-all duration-500 hover:scale-110 ${scrolled ? 'text-[#1f2937] hover:text-[#d05322]' : 'text-white hover:text-gray-200 drop-shadow-md'}`}>
              <Bell size={22} strokeWidth={2.5} />
            </button>
            <Link to="/profile" className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#d05322] to-[#b84318] rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-500"></div>
              <div className={`relative h-10 w-10 rounded-full bg-cover bg-center border-2 transition-colors duration-500 shadow-xl ${scrolled ? 'border-white' : 'border-white/30'}`} style={{backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80')"}}></div>
            </Link>
            <div className={`h-6 w-px hidden sm:block mx-2 ${scrolled ? 'bg-gray-200' : 'bg-white/20'}`}></div>
            <button onClick={handleLogout} className={`flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300 ${scrolled ? 'text-gray-400 hover:text-[#d05322] hover:bg-orange-50' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
              <LogOut size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      {/* MINI CINEMATIC HERO */}
      <div className="relative w-full h-[40vh] min-h-[320px] flex flex-col items-center justify-center overflow-hidden bg-[#111827]">
        <img 
          src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop" 
          alt="Restaurant Atmosphere" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#111827]/80 via-[#111827]/40 to-[#fafaf9]"></div>

        <div className="relative z-10 text-center px-4 mt-16">
          <div className="flex items-center justify-center gap-3 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="h-[2px] w-6 bg-[#d05322]"></div>
            <span className="text-[11px] font-black text-[#d05322] tracking-[0.3em] uppercase drop-shadow-md">Your Culinary Archives</span>
            <div className="h-[2px] w-6 bg-[#d05322]"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-[64px] font-extrabold text-white tracking-tight mb-4 leading-tight drop-shadow-xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Track Your Feast.
          </h2>
        </div>
      </div>

      <div className="mx-auto max-w-[1024px] px-8 relative z-20 -mt-12">

        {reorderError && (
          <div className="mb-10 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-sm animate-in fade-in slide-in-from-top-4">
            <AlertCircle size={24} className="flex-shrink-0" />
            <div>
              <h4 className="font-bold text-[15px]">Order Creation Failed</h4>
              <p className="text-[13px] font-medium">{reorderError}</p>
            </div>
          </div>
        )}

        {/* ACTIVE ORDER TRACKER */}
        {activeOrder && (
          <div className="mb-24 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h3 className="text-[32px] font-extrabold text-[#1f2937] tracking-tight">In Progress</h3>
                <p className="text-[15px] text-[#6b7280] font-medium mt-1">Your culinary journey is currently active.</p>
              </div>
            </div>
            
            <div className="mt-6 rounded-[2.5rem] border border-[#f3f4f6] bg-white p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles size={20} className="text-[#d05322]" />
                    <h3 className="text-[24px] font-extrabold text-gray-900 leading-none">Digital Maitre D' Kitchen</h3>
                  </div>
                  <p className="text-[14px] font-medium text-gray-500">
                    Order #{activeOrder.id ? activeOrder.id.slice(-6).toUpperCase() : "N/A"} • {activeOrder.items?.length || 0} items
                  </p>
                </div>
                <div className="bg-orange-50/80 text-[#d05322] border border-[#d05322]/20 px-6 py-2.5 rounded-full text-[12px] font-black tracking-widest uppercase shadow-sm">
                  {activeOrder.status || "Preparing"}
                </div>
              </div>
              
              {/* Premium Progress Timeline */}
              <div className="mt-16 flex items-center justify-between relative px-2 md:px-12">
                <div className="absolute left-6 right-6 md:left-16 md:right-16 top-5 -z-10 h-1 bg-gray-100 rounded-full"></div>
                <div 
                   className="absolute left-6 md:left-16 top-5 -z-10 h-1 bg-[#d05322] rounded-full transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(208,83,34,0.5)]" 
                   style={{ width: `calc(${(getStepIndex(activeOrder.status) / (workflowSteps.length - 1)) * 100}% - 4rem)` }}
                ></div>

                {workflowSteps.map((step, index) => {
                  const currentStatusIdx = getStepIndex(activeOrder.status);
                  const isCompleted = index <= currentStatusIdx;
                  const isCurrent = index === currentStatusIdx;
                  
                  return (
                    <div key={step.key} className="flex flex-col items-center bg-white px-3">
                      <div className={`h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center transition-colors duration-500 border-4 border-white ${
                        isCompleted ? "bg-[#d05322] shadow-[0_10px_20px_rgba(208,83,34,0.3)]" : "bg-gray-100"
                      } ${isCurrent ? 'ring-4 ring-orange-50' : ''}`}>
                        {isCompleted && (
                          <svg className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`mt-4 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-black text-center ${
                        isCompleted ? "text-[#d05322]" : "text-gray-400"
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-16 flex flex-col sm:flex-row gap-4 pt-8 border-t border-[#f3f4f6]">
                <button className="flex-1 bg-[#d05322] hover:bg-[#b84318] text-white py-4.5 rounded-[1.25rem] text-[13px] uppercase tracking-[0.2em] font-black transition-all shadow-[0_10px_20px_rgba(208,83,34,0.2)] text-center h-14">
                  Track Live
                </button>
                <button 
                  onClick={() => setSelectedOrderDetails(activeOrder)}
                  className="flex-1 bg-white border border-gray-200 hover:border-[#1f2937] hover:bg-gray-50 text-[#1f2937] py-4.5 rounded-[1.25rem] text-[13px] uppercase tracking-[0.2em] font-black transition-all shadow-sm text-center h-14"
                >
                  Order Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAST ORDERS SECTION */}
        <div className="mb-32">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6">
            <h2 className="text-[32px] font-extrabold text-[#1f2937] tracking-tight">Past Orders</h2>
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-[#1f2937] text-[13px] font-black tracking-wider uppercase py-3.5 pl-6 pr-12 rounded-full focus:outline-none focus:border-[#d05322] focus:ring-1 focus:ring-[#d05322] cursor-pointer shadow-sm"
              >
                <option value="all">All Orders</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-40 animate-pulse rounded-[2rem] bg-gray-200/50"></div>
              ))}
            </div>
          ) : filteredOrders.filter(order => order.id !== activeOrder?.id).length === 0 ? (
            <div className="bg-gray-50/50 rounded-[3rem] p-20 text-center border-2 border-dashed border-[#e5e7eb]">
              <div className="w-24 h-24 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-8">
                <ChefHat size={40} className="text-gray-300" strokeWidth={1.5} />
              </div>
              <h3 className="text-[24px] font-extrabold text-[#1f2937] mb-3 tracking-tight">No past orders yet</h3>
              <p className="text-[#6b7280] font-medium text-[15px] mb-10">Your culinary history will appear here once you place an order.</p>
              <Link to="/menu" className="inline-flex items-center gap-2 bg-[#1f2937] text-white px-10 py-4.5 rounded-full text-[13px] font-black uppercase tracking-[0.2em] hover:bg-[#d05322] hover:-translate-y-1 transition-all shadow-xl shadow-gray-900/20 hover:shadow-[#d05322]/30 h-14">
                Start Exploring
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.filter(order => order.id !== activeOrder?.id).map((order) => {
                const total = order.totalAmount || order.totalPrice || order.items?.reduce((sum, i) => sum + ((i.unitPrice || i.price || 0) * i.quantity), 0) || 0;
                const formattedDate = order.createdAt || order.orderDate ? new Date(order.createdAt || order.orderDate).toLocaleDateString('en-US', { 
                  month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                }) : "Just Now";
                
                const displayStatus = String(order.status).toUpperCase() === "CONFIRMED" ? "ON THE WAY" : 
                                      String(order.status).toUpperCase() === "PENDING" ? "CONFIRMED" : 
                                      String(order.status).toUpperCase();

                return (
                  <div key={order.id} className="bg-white rounded-[2rem] p-8 border border-[#f3f4f6] hover:border-[#d05322]/30 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col md:flex-row justify-between md:items-center gap-8 group">
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <h4 className="text-[20px] font-extrabold text-[#1f2937] group-hover:text-[#d05322] transition-colors">Digital Maitre D' Kitchen</h4>
                        <span className={`px-3 py-1.5 rounded-md text-[10px] font-black tracking-widest uppercase border ${getStatusColor(order.status)}`}>
                          {displayStatus}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#9ca3af] font-bold mb-5 flex items-center gap-2">
                        <Clock size={14} strokeWidth={2.5}/> {formattedDate}
                      </p>
                      <p className="text-[15px] font-medium text-[#4b5563] leading-relaxed max-w-2xl">
                        {order.items?.map(i => `${i.quantity}x ${i.itemName || i.name}`).join(' • ') || "Premium Tasting Menu"}
                      </p>
                    </div>

                    <div className="flex flex-col md:items-end gap-6 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-10 md:min-w-[200px]">
                      <div className="text-[32px] font-black text-[#1f2937] leading-none">
                        ${parseFloat(total).toFixed(2)}
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                        <button 
                          onClick={() => handleReorder(order)}
                          disabled={processingId === order.id}
                          className="flex-1 md:flex-none flex items-center justify-center min-w-[110px] bg-[#d05322] hover:bg-[#b84318] text-white px-6 py-3 rounded-xl text-[12px] font-black tracking-widest uppercase transition-colors shadow-md disabled:bg-[#d05322]/70 disabled:cursor-not-allowed h-12"
                        >
                          {processingId === order.id ? (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          ) : "REORDER"}
                        </button>

                        <button 
                          onClick={() => setSelectedOrderDetails(order)}
                          className="flex-1 md:flex-none rounded-xl border border-gray-200 px-6 py-3 text-[12px] font-black tracking-widest uppercase text-[#1f2937] hover:bg-gray-50 transition-colors shadow-sm h-12"
                        >
                          DETAILS
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* PREMIUM MODAL */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111827]/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-xl rounded-[2.5rem] bg-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform animate-in zoom-in-95 duration-300">
            
            <div className="flex items-center justify-between px-10 py-8 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-extrabold text-[#1f2937] tracking-tight">Order Receipt</h2>
                <p className="text-[13px] font-bold text-[#9ca3af] mt-1 tracking-widest uppercase">#{selectedOrderDetails.id?.slice(-8).toUpperCase()}</p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="h-12 w-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#d05322] hover:border-[#d05322] transition-colors shadow-sm focus:outline-none"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-10 overflow-y-auto flex-1 scrollbar-hide">
              <div className="mb-10">
                <h3 className="text-[11px] font-black tracking-[0.2em] text-gray-400 uppercase mb-5 border-b border-gray-100 pb-3">Information</h3>
                <div className="space-y-4 text-[14px] font-medium text-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-[#9ca3af]">Date</span>
                    <span className="text-[#1f2937] font-bold">{formatModalTime(selectedOrderDetails.createdAt || selectedOrderDetails.orderDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#9ca3af]">Customer</span>
                    <span className="text-[#1f2937] font-bold">{selectedOrderDetails.customerName || "Walk-in"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#9ca3af]">Status</span>
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${getStatusColor(selectedOrderDetails.status)} border`}>
                      {selectedOrderDetails.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-start pt-2">
                    <span className="text-[#9ca3af]">Destination</span>
                    <span className="text-[#1f2937] font-bold text-right max-w-[200px] leading-relaxed">
                      {selectedOrderDetails.deliveryAddress || "Dine-in / Pickup"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-black tracking-[0.2em] text-gray-400 uppercase mb-5 border-b border-gray-100 pb-3">Items Ordered</h3>
                <div className="space-y-6">
                  {selectedOrderDetails.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <span className="bg-gray-100 text-[#1f2937] font-black text-[11px] px-2.5 py-1 rounded-lg">x{item.quantity}</span>
                        <div>
                          <span className="font-bold text-[#1f2937] block text-[15px] mb-1">{item.itemName || item.name}</span>
                          <span className="text-[12px] text-[#9ca3af] font-semibold">${parseFloat(item.unitPrice || item.price || 0).toFixed(2)} each</span>
                        </div>
                      </div>
                      <span className="font-black text-[#1f2937] text-[16px]">${((item.unitPrice || item.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  
                  {(!selectedOrderDetails.items || selectedOrderDetails.items.length === 0) && (
                    <p className="text-sm text-gray-500 font-medium">No items found in this order.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-[#1f2937] px-10 py-8 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-[50%] bg-[#d05322]/20 blur-[50px] rounded-full pointer-events-none"></div>
              <div className="flex justify-between items-center relative z-10">
                <span className="text-[12px] font-black tracking-[0.2em] text-gray-400 uppercase">Total Amount</span>
                <span className="text-[36px] font-extrabold text-white leading-none">
                  ${parseFloat(selectedOrderDetails.totalAmount || selectedOrderDetails.totalPrice || selectedOrderDetails.items?.reduce((sum, i) => sum + ((i.unitPrice || i.price || 0) * i.quantity), 0) || 0).toFixed(2)}
                </span>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* Sophisticated Footer */}
      <footer className="bg-white border-t border-[#f3f4f6] pt-24 pb-12">
        <div className="w-full max-w-[1440px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h3 className="font-black italic text-[#1f2937] text-[24px] mb-6 tracking-tighter">Digital Maitre D'</h3>
            <p className="text-[#6b7280] text-[16px] max-w-[480px] leading-relaxed font-medium">
              Elevating the at-home dining experience through technology and culinary expertise. We bridge the gap between fine dining and sophisticated convenience.
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-between">
            <div className="flex flex-wrap gap-x-10 gap-y-4 text-[13px] font-black tracking-[0.2em] uppercase text-[#1f2937]">
              <span className="hover:text-[#d05322] transition-colors cursor-pointer">Privacy</span>
              <span className="hover:text-[#d05322] transition-colors cursor-pointer">Terms</span>
              <span className="hover:text-[#d05322] transition-colors cursor-pointer">Support</span>
              <span className="hover:text-[#d05322] transition-colors cursor-pointer">Careers</span>
            </div>
            <p className="text-[#9ca3af] text-[12px] font-bold mt-16 md:mt-0 tracking-widest uppercase">
              © 2024 DIGITAL MAITRE D' TECHNOLOGIES. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}