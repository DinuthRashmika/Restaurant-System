import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Search, 
  SlidersHorizontal, 
  Bell, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  LogOut,
  AlertCircle,
  Clock // Added Clock icon for notifications
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { getAllUsers } from "../../services/userService";
import { getAllOrders } from "../../services/orderService"; 
import { useAuth } from "../../context/AuthContext";
import { setToken } from "../../api/axios";

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useAuth(); 
  const currentPath = location.pathname;

  const [users, setUsers] = useState([]);
  const [debugError, setDebugError] = useState("");
  
  // NEW: State for Notifications
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCustomers: 0,
    totalOwners: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0 
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // NEW: Click outside listener for the notification dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const revenueData = [
    { name: "Mon", current: 4000, previous: 2400 },
    { name: "Tue", current: 3000, previous: 1398 },
    { name: "Wed", current: 2000, previous: 9800 },
    { name: "Thu", current: 2780, previous: 3908 },
    { name: "Fri", current: 1890, previous: 4800 },
    { name: "Sat", current: 2390, previous: 3800 },
    { name: "Sun", current: 3490, previous: 4300 },
  ];

  // UPDATED: Added an interval so the dashboard stats and bell update automatically
  useEffect(() => {
    const fetchData = async () => {
      setDebugError("");
      let extractedUsers = [];
      let extractedOrders = [];
      let fetchErrors = [];

      let currentToken = auth?.token || auth?.accessToken;
      if (!currentToken) {
        try {
          const storedAuth = JSON.parse(localStorage.getItem("auth"));
          currentToken = storedAuth?.token || storedAuth?.accessToken;
        } catch (e) {}
      }
      
      if (currentToken) {
        setToken(currentToken); 
      }

      const extractArrayAggressive = (obj) => {
        if (!obj) return [];
        if (Array.isArray(obj)) return obj;
        let foundArrays = [];
        const search = (item) => {
          if (!item || typeof item !== 'object') return;
          for (let key in item) {
            if (Array.isArray(item[key])) {
              foundArrays.push(item[key]);
            } else if (item[key] && typeof item[key] === 'object') {
              search(item[key]);
            }
          }
        };
        search(obj);
        if (foundArrays.length > 0) {
          return foundArrays.sort((a, b) => b.length - a.length)[0];
        }
        return [];
      };

      try {
        const userRes = await getAllUsers();
        extractedUsers = extractArrayAggressive(userRes);
        setUsers(extractedUsers);
      } catch (err) {
        console.error("User Fetch Failed:", err);
        fetchErrors.push(`Users API: ${err.message}`);
      }

      try {
        const orderRes = await getAllOrders();
        extractedOrders = extractArrayAggressive(orderRes);
      } catch (err) {
        console.error("Order Fetch Failed:", err);
        fetchErrors.push(`Orders API: ${err.message}`);
      }

      if (fetchErrors.length > 0) {
        setDebugError(fetchErrors.join(" | "));
      }

      const customersCount = extractedUsers.filter(u => {
        const r = String(u.role || u.userRole || u.authorities || "").toUpperCase();
        return r.includes("CUSTOMER") || r.includes("USER");
      }).length;

      const ownersCount = extractedUsers.filter(u => {
        const r = String(u.role || u.userRole || u.authorities || "").toUpperCase();
        return r.includes("OWNER") || r.includes("ADMIN");
      }).length;

      const pendingOrdersList = extractedOrders.filter(o => String(o.status || o.orderStatus || "").toUpperCase() === "PENDING");
      const pendingCount = extractedOrders.filter(o => ["PENDING", "PLACED", "PREPARING", "READY"].includes(String(o.status || o.orderStatus || "").toUpperCase())).length;
      const completedCount = extractedOrders.filter(o => ["COMPLETED", "DELIVERED"].includes(String(o.status || o.orderStatus || "").toUpperCase())).length;

      const calculatedRevenue = extractedOrders.reduce((sum, order) => {
          const status = String(order.status || order.orderStatus || "").toUpperCase();
          if (["COMPLETED", "DELIVERED"].includes(status)) {
             const amount = parseFloat(order.totalAmount || order.totalPrice || 0);
             return sum + amount;
          }
          return sum;
      }, 0);

      // NEW: Set incoming orders specifically for the notification dropdown
      setIncomingOrders(pendingOrdersList.sort((a, b) => new Date(b.createdAt || b.orderDate || 0) - new Date(a.createdAt || a.orderDate || 0)));

      setStats({
        totalUsers: extractedUsers.length,
        totalCustomers: customersCount,
        totalOwners: ownersCount,
        totalOrders: extractedOrders.length,
        pendingOrders: pendingCount,
        completedOrders: completedCount,
        totalRevenue: calculatedRevenue
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, [auth]); 

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
            
            {/* FULLY FUNCTIONAL BELL DROPDOWN */}
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
                          onClick={() => navigate("/owner/orders")}
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
                        onClick={() => navigate("/owner/orders")} 
                        className="text-[11px] font-bold text-[#d05322] hover:text-[#b84318] uppercase tracking-widest"
                      >
                        View All Incoming
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <Link to="/profile">
              <div 
                className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-transparent hover:border-[#d05322] transition-colors shadow-sm" 
                style={{backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80')"}}
              ></div>
            </Link>

            <div className="h-6 w-px bg-gray-200 hidden sm:block mx-1"></div>

            <button 
              onClick={handleLogout}
              className="flex items-center justify-center h-10 w-10 rounded-full text-gray-500 hover:text-[#d05322] hover:bg-orange-50 transition-all duration-300 focus:outline-none"
              title="Logout"
            >
              <LogOut size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      <div className="h-[100px] w-full"></div>

      <div className="w-full max-w-[1440px] px-8 py-6">
        
        {debugError && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-sm">
            <AlertCircle size={24} className="flex-shrink-0" />
            <div>
              <h4 className="font-bold text-[15px]">API Connection Issue</h4>
              <p className="text-[13px] font-medium">{debugError}</p>
            </div>
          </div>
        )}

        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-[32px] font-extrabold text-[#1f2937] tracking-tight">Overview</h2>
            <p className="text-[14px] text-[#6b7280] mt-1">Platform performance and real-time operational metrics.</p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-[#e5e7eb] rounded-lg px-4 py-2.5 text-[12px] font-bold tracking-wider text-[#1f2937] hover:border-[#d05322] hover:text-[#d05322] transition-colors uppercase shadow-sm">
            <SlidersHorizontal size={16} strokeWidth={2.5} />
            THIS WEEK
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="bg-white rounded-3xl p-6 border border-[#e5e7eb] shadow-sm flex flex-col justify-between group hover:border-[#d05322]/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users size={20} strokeWidth={2.5}/>
            </div>
            <div>
              <p className="text-[11px] font-black text-[#9ca3af] uppercase tracking-widest mb-1">TOTAL USERS</p>
              <h3 className="text-[32px] font-extrabold text-[#1f2937]">{stats.totalUsers}</h3>
              <p className="text-[12px] text-[#6b7280] mt-3">
                {stats.totalCustomers} Customer{stats.totalCustomers !== 1 ? 's' : ''} • {stats.totalOwners} Owner{stats.totalOwners !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#e5e7eb] shadow-sm flex flex-col justify-between group hover:border-[#d05322]/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <ShoppingBag size={20} strokeWidth={2.5}/>
            </div>
            <div>
              <p className="text-[11px] font-black text-[#9ca3af] uppercase tracking-widest mb-1">TOTAL ORDERS</p>
              <h3 className="text-[32px] font-extrabold text-[#1f2937]">{stats.totalOrders}</h3>
              <p className="text-[12px] text-[#6b7280] mt-3">
                {stats.pendingOrders} Pending • {stats.completedOrders} Completed
              </p>
            </div>
          </div>

          <div className="bg-[#1f2937] rounded-3xl p-6 text-white shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-6">
              <DollarSign size={20} strokeWidth={2.5}/>
            </div>
            <div>
              <p className="text-[11px] font-black text-white/50 uppercase tracking-widest mb-1">TOTAL REVENUE</p>
              <h3 className="text-[32px] font-extrabold text-white">${stats.totalRevenue.toFixed(2)}</h3>
              <p className="text-[12px] text-white/70 mt-3">From Completed Orders</p>
            </div>
          </div>

          <div className="bg-[#d05322] rounded-3xl p-6 shadow-sm flex flex-col justify-between text-white cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => navigate('/owner/orders')}>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-6">
              <TrendingUp size={20} strokeWidth={2.5}/>
            </div>
            <div>
              <p className="text-[11px] font-black text-white/70 uppercase tracking-widest mb-1">ACTION REQUIRED</p>
              <h3 className="text-[20px] font-extrabold text-white leading-tight mt-1">Review {incomingOrders.length} Incoming Orders</h3>
              <div className="mt-4 text-[12px] font-bold text-white uppercase tracking-wider underline">VIEW LIVE LIST →</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e7eb] shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
              <div>
                <h3 className="text-[18px] font-extrabold text-[#1f2937] tracking-tight">Revenue Analytics</h3>
                <p className="text-[13px] text-[#6b7280]">Real-time growth visualization</p>
              </div>
              <div className="flex items-center gap-4 mt-4 sm:mt-0 text-[12px] font-bold">
                <div className="flex items-center gap-2 text-[#d05322]">
                  <div className="w-3 h-3 rounded-full bg-[#d05322]"></div> Current Week
                </div>
                <div className="flex items-center gap-2 text-[#9ca3af]">
                  <div className="w-3 h-3 rounded-full bg-[#f3f4f6] border border-[#d1d5db]"></div> Previous Week
                </div>
              </div>
            </div>
            
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d05322" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#d05322" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 700}} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontWeight: 'bold' }}
                    itemStyle={{ fontSize: '13px' }}
                    labelStyle={{ color: '#9ca3af', fontSize: '11px', textTransform: 'uppercase', tracking: 'widest' }}
                  />
                  <Area type="monotone" dataKey="previous" stroke="#d1d5db" strokeWidth={2} fillOpacity={0} />
                  <Area type="monotone" dataKey="current" stroke="#d05322" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e7eb] shadow-sm flex flex-col">
            <h3 className="text-[18px] font-extrabold text-[#1f2937] tracking-tight mb-6">Quick Links</h3>
            <div className="flex flex-col gap-4">
              <Link to="/owner/orders" className="flex items-center p-4 rounded-2xl border border-[#f3f4f6] hover:border-[#d05322] hover:shadow-sm transition-all group">
                <div className="w-12 h-12 rounded-full bg-orange-50 text-[#d05322] flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <span className="text-xl">📋</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-extrabold text-[#1f2937] text-[15px]">Live Orders Area</h4>
                  <p className="text-[12px] text-[#6b7280]">Process and track cooking status</p>
                </div>
                <span className="text-[#9ca3af] group-hover:text-[#d05322] transform group-hover:translate-x-1 transition-all">→</span>
              </Link>

              <Link to="/owner/menu" className="flex items-center p-4 rounded-2xl border border-[#f3f4f6] hover:border-[#d05322] hover:shadow-sm transition-all group">
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <span className="text-xl">🍔</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-extrabold text-[#1f2937] text-[15px]">Menu Editor</h4>
                  <p className="text-[12px] text-[#6b7280]">Update recipes and availability</p>
                </div>
                <span className="text-[#9ca3af] group-hover:text-[#d05322] transform group-hover:translate-x-1 transition-all">→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#e5e7eb] shadow-sm flex flex-col overflow-hidden mb-8">
          <div className="px-8 py-6 border-b border-[#e5e7eb] flex items-center justify-between bg-white">
            <div>
              <h3 className="text-[20px] font-extrabold text-[#1f2937] tracking-tight">Active Users Directory</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#f3f4f6] bg-[#fafaf9]">
                  <th className="py-4 px-8 text-[11px] font-black tracking-widest text-[#9ca3af] uppercase">Full Name</th>
                  <th className="py-4 px-8 text-[11px] font-black tracking-widest text-[#9ca3af] uppercase">Email</th>
                  <th className="py-4 px-8 text-[11px] font-black tracking-widest text-[#9ca3af] uppercase">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="3" className="py-12 text-center text-gray-500 text-[14px] font-semibold">No users found.</td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id || user.email} className="border-b last:border-b-0 border-[#f3f4f6] hover:bg-[#fafaf9] transition-colors text-[14px]">
                      <td className="py-4 px-8 font-bold text-[#1f2937]">{user.fullName || user.username || "—"}</td>
                      <td className="py-4 px-8 font-medium text-[#6b7280]">{user.email || "—"}</td>
                      <td className="py-4 px-8">
                        <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-sm ${
                          String(user.role || user.userRole || "USER").toUpperCase().includes("OWNER") 
                            ? "bg-[#d05322]/10 text-[#d05322]" 
                            : "bg-gray-100 text-[#6b7280]"
                        }`}>
                          {user.role || user.userRole || "USER"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="mt-auto pt-8 pb-8 border-t border-[#f3f4f6] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 text-[12px]">
             <h3 className="font-bold italic text-[#d05322] text-[14px]">Digital Maitre D</h3>
             <span className="text-[#9ca3af]">|</span>
             <p className="text-[#6b7280] font-medium">Elevating restaurant operations with premium design.</p>
          </div>
          <div className="flex gap-6 text-[12px] font-semibold text-[#6b7280]">
            <Link to="/terms" className="hover:text-[#1f2937] transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-[#1f2937] transition-colors">Privacy Policy</Link>
            <Link to="/support" className="hover:text-[#1f2937] transition-colors">Partner Support</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}