import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { useAuth } from "../../context/AuthContext";
import { getOrdersByCustomerId, getAllOrders, createOrder } from "../../services/orderService";
import { X, AlertCircle } from "lucide-react"; 

export default function OrderHistory() {
  const { auth } = useAuth();
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
  
  // THE FIX: Extracted the customer email to satisfy the backend @Email constraint
  const customerEmail = auth?.user?.email || storedAuth?.user?.email || "customer@digitalmaitred.com";

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
      // THE FIX: Stripped out extra fields and perfectly mapped to OrderItemRequest.java
      const exactItems = pastOrder.items?.map(item => ({
        menuItemId: String(item.menuItemId || item.id || "0"), 
        itemName: String(item.itemName || item.name || "Item"),
        unitPrice: parseFloat(item.unitPrice || item.price || 0),
        quantity: parseInt(item.quantity || 1, 10)
      })) || [];

      // THE FIX: Perfectly mapped to CreateOrderRequest.java
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
    <div className="min-h-screen bg-[#fafaf9] pb-12">
      <Topbar />

      <div className="mx-auto max-w-[1024px] px-4 pt-6 pb-8 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-6 border-b border-gray-200 pb-6 mb-8">
          <h1 className="text-2xl font-black italic tracking-tighter text-[#1f2937]">Digital Maitre D'</h1>
          <div className="h-4 w-px bg-gray-300"></div>
          <nav className="flex gap-6">
            <Link to="/customer/dashboard" className="text-[13px] font-bold tracking-widest uppercase text-gray-400 hover:text-gray-900 transition-colors">Explore</Link>
            <Link to="/order-history" className="text-[13px] font-bold tracking-widest uppercase text-[#d05322]">Orders</Link>
          </nav>
        </div>

        {reorderError && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-sm animate-in fade-in slide-in-from-top-4">
            <AlertCircle size={24} className="flex-shrink-0" />
            <div>
              <h4 className="font-bold text-[15px]">Order Creation Failed</h4>
              <p className="text-[13px] font-medium">{reorderError}</p>
            </div>
          </div>
        )}

        {activeOrder && (
          <div className="mb-16">
            <h2 className="text-[24px] font-extrabold text-gray-900 tracking-tight">Track your feast.</h2>
            <p className="text-[14px] text-gray-500 font-medium mt-1">Your culinary journey is currently in progress.</p>
            
            <div className="mt-6 rounded-2xl border border-[#e5e7eb] bg-white p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">Digital Maitre D' Kitchen</h3>
                  <p className="text-[13px] font-medium text-gray-500 mt-1">
                    Order #{activeOrder.id ? activeOrder.id.slice(-6).toUpperCase() : "N/A"} • {activeOrder.items?.length || 0} items
                  </p>
                </div>
              </div>
              
              <div className="mt-12 flex items-center justify-between relative px-2 md:px-8">
                <div className="absolute left-4 right-4 md:left-10 md:right-10 top-4 -z-10 h-0.5 bg-gray-100"></div>
                <div 
                   className="absolute left-4 md:left-10 top-4 -z-10 h-0.5 bg-[#d05322] transition-all duration-700 ease-in-out" 
                   style={{ width: `calc(${(getStepIndex(activeOrder.status) / (workflowSteps.length - 1)) * 100}% - 2rem)` }}
                ></div>

                {workflowSteps.map((step, index) => {
                  const currentStatusIdx = getStepIndex(activeOrder.status);
                  const isCompleted = index <= currentStatusIdx;
                  
                  return (
                    <div key={step.key} className="flex flex-col items-center bg-white px-2">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-500 ${
                        isCompleted ? "bg-[#d05322] shadow-md" : "bg-gray-100 border-2 border-white"
                      }`}>
                        {isCompleted && (
                          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`mt-3 text-[10px] md:text-[11px] uppercase tracking-widest font-black text-center ${
                        isCompleted ? "text-[#d05322]" : "text-gray-400"
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-10 flex gap-4">
                <button className="flex-1 rounded-xl bg-[#d05322] hover:bg-[#b84318] py-3.5 text-[12px] uppercase tracking-widest font-black text-white transition-colors shadow-md">
                  Track Live
                </button>
                <button 
                  onClick={() => setSelectedOrderDetails(activeOrder)}
                  className="flex-1 rounded-xl border border-[#e5e7eb] py-3.5 text-[12px] uppercase tracking-widest font-black text-[#1f2937] hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Order Details
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[20px] font-extrabold text-[#1f2937] tracking-tight">Past Orders</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-[13px] font-bold text-[#1f2937] outline-none focus:border-[#d05322] shadow-sm cursor-pointer"
            >
              <option value="all">All Orders</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-32 animate-pulse rounded-2xl bg-gray-200"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.filter(order => order.id !== activeOrder?.id).map((order) => {
                const total = order.totalAmount || order.totalPrice || order.items?.reduce((sum, i) => sum + ((i.unitPrice || i.price || 0) * i.quantity), 0) || 0;
                const formattedDate = order.createdAt || order.orderDate ? new Date(order.createdAt || order.orderDate).toLocaleDateString('en-US', { 
                  month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                }) : "Just Now";
                
                const displayStatus = String(order.status).toUpperCase() === "CONFIRMED" ? "ON THE WAY" : 
                                      String(order.status).toUpperCase() === "PENDING" ? "CONFIRMED" : 
                                      String(order.status).toUpperCase();

                return (
                  <div key={order.id} className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-extrabold text-[#1f2937] text-[16px]">Digital Maitre D' Kitchen</h3>
                          <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-full ${getStatusColor(order.status)}`}>
                            {displayStatus}
                          </span>
                        </div>
                        <p className="text-[12px] font-semibold text-[#9ca3af] mb-4">
                          {formattedDate}
                        </p>
                        <p className="text-[13px] font-medium text-[#4b5563] leading-relaxed max-w-xl">
                          {order.items?.map(item => `${item.quantity}x ${item.itemName || item.name}`).join(' • ') || "No items listed"}
                        </p>
                      </div>
                      
                      <div className="text-left md:text-right flex flex-col md:items-end justify-between mt-4 md:mt-0">
                        <p className="text-[20px] font-black text-[#1f2937] mb-4">${parseFloat(total).toFixed(2)}</p>
                        <div className="flex gap-2">
                          
                          <button 
                            onClick={() => handleReorder(order)}
                            disabled={processingId === order.id}
                            className="flex items-center justify-center min-w-[90px] rounded-lg bg-[#d05322] px-5 py-2.5 text-[11px] font-black tracking-widest uppercase text-white hover:bg-[#b84318] transition-colors shadow-sm disabled:bg-[#d05322]/70 disabled:cursor-not-allowed"
                          >
                            {processingId === order.id ? (
                              <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : "REORDER"}
                          </button>

                          <button 
                            onClick={() => setSelectedOrderDetails(order)}
                            className="rounded-lg border border-[#e5e7eb] px-5 py-2.5 text-[11px] font-black tracking-widest uppercase text-[#1f2937] hover:bg-gray-50 transition-colors"
                          >
                            DETAILS
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredOrders.length === 0 && (
                <div className="rounded-3xl border-2 border-dashed border-[#e5e7eb] bg-white p-16 text-center">
                  <p className="text-[16px] font-bold text-[#9ca3af]">No past orders found.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <footer className="mt-16 border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap justify-center gap-6 text-[12px] font-bold tracking-wider text-gray-400 uppercase">
            <Link to="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-600 transition-colors">Terms</Link>
            <Link to="/support" className="hover:text-gray-600 transition-colors">Support</Link>
          </div>
          <p className="text-center text-[11px] font-bold tracking-widest text-gray-400 uppercase">
            © 2024 Digital Maitre D'
          </p>
        </footer>
      </div>

      {selectedOrderDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-[2rem] bg-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Order Receipt</h2>
                <p className="text-sm font-semibold text-gray-500 mt-1">#{selectedOrderDetails.id?.slice(-8).toUpperCase()}</p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#d05322] hover:border-[#d05322] transition-colors shadow-sm"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
              <div className="mb-8">
                <h3 className="text-[11px] font-black tracking-widest text-gray-400 uppercase mb-4">Order Information</h3>
                <div className="space-y-3 text-sm font-medium text-gray-700">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <span className="text-gray-500">Date</span>
                    <span className="text-gray-900 font-bold">{formatModalTime(selectedOrderDetails.createdAt || selectedOrderDetails.orderDate)}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <span className="text-gray-500">Customer</span>
                    <span className="text-gray-900 font-bold">{selectedOrderDetails.customerName || "Walk-in"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <span className="text-gray-500">Status</span>
                    <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded bg-gray-100`}>
                      {selectedOrderDetails.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-start pt-1">
                    <span className="text-gray-500">Destination</span>
                    <span className="text-gray-900 font-bold text-right max-w-[200px] leading-relaxed">
                      {selectedOrderDetails.deliveryAddress || "Dine-in / Pickup"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-black tracking-widest text-gray-400 uppercase mb-4">Items Ordered</h3>
                <div className="space-y-4">
                  {selectedOrderDetails.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <span className="bg-gray-100 text-gray-900 font-black text-xs px-2 py-1 rounded">x{item.quantity}</span>
                        <div>
                          <span className="font-bold text-gray-900 block">{item.itemName || item.name}</span>
                          <span className="text-xs text-gray-500 font-semibold">${parseFloat(item.unitPrice || item.price || 0).toFixed(2)} each</span>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">${((item.unitPrice || item.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  
                  {!selectedOrderDetails.items || selectedOrderDetails.items.length === 0 && (
                    <p className="text-sm text-gray-500 font-medium">No items found.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-black tracking-widest text-gray-500 uppercase">Total Amount</span>
                <span className="text-2xl font-black text-[#d05322]">
                  ${parseFloat(selectedOrderDetails.totalAmount || selectedOrderDetails.totalPrice || selectedOrderDetails.items?.reduce((sum, i) => sum + ((i.unitPrice || i.price || 0) * i.quantity), 0) || 0).toFixed(2)}
                </span>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}