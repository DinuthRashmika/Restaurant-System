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
  Clock,
  User,
  ArrowUpRight,
  ChevronRight,
  Activity
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

  // --- SYNCED PROFILE IMAGE LOGIC ---
  const storedAuth = JSON.parse(localStorage.getItem("auth")) || {};
  const currentUser = auth?.user || auth || storedAuth?.user || storedAuth || {};
  const userId = currentUser.id || currentUser._id || currentUser.userId || "Unassigned";
  const cachedImage = localStorage.getItem(`frontend_image_cache_${userId}`);
  const profileImage = cachedImage || currentUser.profileImage || currentUser.avatarUrl || "";

  const handleLogout = () => { logout(); navigate("/login"); };

  // Data fetching logic remains robust as per your original code
  useEffect(() => {
    const fetchData = async () => {
      let currentToken = auth?.token || auth?.accessToken || storedAuth?.token;
      if (currentToken) setToken(currentToken);

      try {
        const [userRes, orderRes] = await Promise.all([getAllUsers(), getAllOrders()]);
        
        const extract = (obj) => (Array.isArray(obj) ? obj : obj?.data || []);
        const extractedUsers = extract(userRes);
        const extractedOrders = extract(orderRes);

        const pending = extractedOrders.filter(o => ["PENDING", "PREPARING"].includes(String(o.status).toUpperCase()));
        const revenue = extractedOrders.reduce((sum, o) => 
          ["COMPLETED", "DELIVERED"].includes(String(o.status).toUpperCase()) ? sum + parseFloat(o.totalAmount || 0) : sum, 0);

        setUsers(extractedUsers);
        setIncomingOrders(pending);
        setStats({
          totalUsers: extractedUsers.length,
          totalOrders: extractedOrders.length,
          pendingOrders: pending.length,
          totalRevenue: revenue
        });
      } catch (err) { setDebugError("Data sync delayed..."); }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [auth]);

  const revenueData = [
    { name: "Mon", current: 2400 }, { name: "Tue", current: 1398 },
    { name: "Wed", current: 9800 }, { name: "Thu", current: 3908 },
    { name: "Fri", current: 4800 }, { name: "Sat", current: 3800 },
    { name: "Sun", current: 4300 },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans selection:bg-[#d05322] selection:text-white pb-12">
      
      {/* PROFESSIONAL TOP BAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm px-8 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/owner/dashboard" className="flex items-center gap-2">
              <div className="bg-[#d05322] p-1.5 rounded-lg"><Activity size={20} className="text-white"/></div>
              <h1 className="text-xl font-black italic tracking-tighter text-[#1f2937]">Digital Maitre D'</h1>
            </Link>
            <nav className="hidden lg:flex items-center gap-8">
              {[
                { name: 'Dashboard', path: '/owner/dashboard' },
                { name: 'Live Orders', path: '/owner/orders' },
                { name: 'Menu Editor', path: '/owner/menu' }
              ].map(link => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`text-[12px] font-bold uppercase tracking-widest transition-all ${currentPath === link.path ? 'text-[#d05322]' : 'text-gray-400 hover:text-[#1f2937]'}`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-[#d05322] relative transition-colors">
              <Bell size={20} strokeWidth={2.5}/>
              {incomingOrders.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#d05322] rounded-full animate-pulse"></span>}
            </button>
            <div className="h-6 w-px bg-gray-100"></div>
            <Link to="/profile" className="flex items-center gap-3 group">
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-black text-[#1f2937] leading-none uppercase">{currentUser.fullName || 'Owner'}</p>
                <p className="text-[10px] font-bold text-[#d05322] uppercase tracking-tighter">Verified Admin</p>
              </div>
              <div className="relative h-10 w-10 rounded-full border-2 border-transparent group-hover:border-[#d05322] transition-all overflow-hidden bg-gray-100 flex items-center justify-center shadow-md">
                {profileImage ? (
                  <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: `url('${profileImage}')`}} />
                ) : (
                  <User size={18} className="text-gray-400" />
                )}
              </div>
            </Link>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors ml-2"><LogOut size={20}/></button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 pt-28">
        
        {/* DASHBOARD HERO */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <h2 className="text-4xl font-black text-[#1f2937] tracking-tight">Executive Dashboard</h2>
            <p className="text-gray-400 font-medium mt-1">Global operations overview for Digital Maitre D'.</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl flex items-center gap-2 text-[12px] font-bold text-gray-600 shadow-sm">
              <Clock size={16}/> Last updated: Just now
            </div>
            <button className="bg-[#1f2937] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg">
              <SlidersHorizontal size={16}/> Settings
            </button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign/>, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12%' },
            { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag/>, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+5%' },
            { label: 'Active Users', value: stats.totalUsers, icon: <Users/>, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+18%' },
            { label: 'Avg Order Value', value: `$${(stats.totalRevenue / (stats.totalOrders || 1)).toFixed(2)}`, icon: <TrendingUp/>, color: 'text-orange-600', bg: 'bg-orange-50', trend: 'Stable' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-500`}>{stat.icon}</div>
                <div className="bg-gray-50 px-2 py-1 rounded-lg text-[10px] font-black text-gray-400 flex items-center gap-1">
                  <ArrowUpRight size={12}/> {stat.trend}
                </div>
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-[#1f2937]">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* CHART AREA */}
          <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-bold text-[#1f2937] tracking-tight">Revenue Dynamics</h3>
                <p className="text-sm text-gray-400 font-medium">Daily performance tracking</p>
              </div>
              <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-[12px] font-bold text-gray-500 outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d05322" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#d05322" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#adb5bd', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#adb5bd', fontSize: 12, fontWeight: 600}} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="current" stroke="#d05322" strokeWidth={4} fillOpacity={1} fill="url(#colorCurrent)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ACTION CENTER */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#1f2937] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 p-6 opacity-10"><AlertCircle size={100}/></div>
              <h3 className="text-xl font-bold mb-6 relative z-10">Attention Required</h3>
              <div className="bg-white/10 rounded-2xl p-6 border border-white/10 mb-8 relative z-10">
                <p className="text-[11px] font-black text-[#d05322] uppercase tracking-[0.2em] mb-2">Pending Workflow</p>
                <h4 className="text-3xl font-black mb-4">{incomingOrders.length} New Orders</h4>
                <p className="text-sm text-gray-400 font-medium leading-relaxed mb-6">Immediate preparation required to maintain Maitre D' delivery standards.</p>
                <button onClick={() => navigate('/owner/orders')} className="w-full bg-[#d05322] py-4 rounded-xl font-black uppercase tracking-widest text-[12px] flex items-center justify-center gap-2 hover:bg-[#b84318] transition-all active:scale-95">
                  Process Orders <ChevronRight size={16}/>
                </button>
              </div>
              <div className="space-y-4">
                 <Link to="/owner/menu" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group">
                    <span className="text-sm font-bold">Update Menu Inventory</span>
                    <ChevronRight size={18} className="text-gray-500 group-hover:text-white transition-colors" />
                 </Link>
              </div>
            </div>
          </div>
        </div>

        {/* USER DIRECTORY */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-1000">
          <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#1f2937]">User Management</h3>
            <div className="relative">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input type="text" placeholder="Search directory..." className="bg-gray-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm outline-none w-64 focus:ring-2 focus:ring-[#d05322]/20 transition-all" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Administrator / Customer</th>
                  <th className="px-10 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Authentication Email</th>
                  <th className="px-10 py-5 text-right text-[11px] font-black text-gray-400 uppercase tracking-widest">Authorization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.slice(0, 5).map((user, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#d05322] flex items-center justify-center font-black text-xs shadow-sm">
                          {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
                        </div>
                        <span className="text-[14px] font-bold text-[#1f2937]">{user.fullName || user.username}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-sm font-medium text-gray-500">{user.email}</td>
                    <td className="px-10 py-6 text-right">
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        String(user.role).includes('OWNER') ? 'bg-orange-50 text-[#d05322] border border-[#d05322]/20' : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="max-w-[1600px] mx-auto px-8 mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-400 pb-12">
         <p className="text-[11px] font-bold uppercase tracking-[0.3em]">© 2026 DIGITAL MAITRE D' • INTERNAL AUDIT DASHBOARD</p>
         <div className="flex gap-10 text-[11px] font-black uppercase tracking-widest">
            <Link to="/support" className="hover:text-[#d05322] transition-colors">Privacy</Link>
            <Link to="/support" className="hover:text-[#d05322] transition-colors">Terms</Link>
            <Link to="/support" className="hover:text-[#d05322] transition-colors">Concierge</Link>
         </div>
      </footer>
    </div>
  );
}