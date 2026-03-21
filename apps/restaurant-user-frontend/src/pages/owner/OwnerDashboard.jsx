import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, User, Bell, TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getAllUsers } from "../../services/userService";

export default function OwnerDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCustomers: 0,
    totalOwners: 0
  });

  const revenueData = [
    { name: "Mon", current: 4000, previous: 2400 },
    { name: "Tue", current: 3000, previous: 1398 },
    { name: "Wed", current: 2000, previous: 9800 },
    { name: "Thu", current: 2780, previous: 3908 },
    { name: "Fri", current: 1890, previous: 4800 },
    { name: "Sat", current: 2390, previous: 3800 },
    { name: "Sun", current: 3490, previous: 4300 },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        if (response && response.success) {
          setUsers(response.data || []);
          const customers = response.data.filter(u => u.role === "CUSTOMER").length;
          const owners = response.data.filter(u => u.role === "OWNER").length;
          
          setStats({
            totalUsers: response.data.length,
            totalCustomers: customers,
            totalOwners: owners
          });
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load users");
        // Fallback for visual demo if API fails
        setUsers([
          { id: "1", fullName: "John Doe", email: "john@example.com", phone: "+1 234 567 8900", role: "CUSTOMER" },
          { id: "2", fullName: "Jane Smith", email: "jane@example.com", phone: "+1 234 567 8901", role: "OWNER" },
          { id: "3", fullName: "Alice Johnson", email: "alice@example.com", phone: "+1 234 567 8902", role: "CUSTOMER" }
        ]);
        setStats({ totalUsers: 3, totalCustomers: 2, totalOwners: 1 });
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-8 py-6 flex flex-col flex-1">
        
        {/* Header Navigation */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-16">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#1f2937] tracking-wider uppercase">
                Bistro Luxe
              </h1>
              <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-widest bg-gray-200/50 px-2 py-1 rounded-md">
                Admin Portal
              </span>
            </div>
            
            <nav className="hidden md:flex items-center gap-10">
              <Link to="/owner/dashboard" className="text-[13px] font-bold text-[#d05322] border-b-2 border-[#d05322] pb-1">
                Dashboard
              </Link>
              <Link to="/owner/orders" className="text-[13px] font-bold text-[#6b7280] hover:text-[#1f2937] transition-colors pb-1">
                Live Orders
              </Link>
              <Link to="/owner/menu" className="text-[13px] font-bold text-[#6b7280] hover:text-[#1f2937] transition-colors pb-1">
                Menu Editor
              </Link>
              <Link to="/owner/analytics" className="text-[13px] font-bold text-[#6b7280] hover:text-[#1f2937] transition-colors pb-1">
                Analytics
              </Link>
              <Link to="/owner/settings" className="text-[13px] font-bold text-[#6b7280] hover:text-[#1f2937] transition-colors pb-1">
                Settings
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af] group-focus-within:text-[#d05322]" size={16} strokeWidth={2.5}/>
              <input 
                type="text" 
                placeholder="SEARCH..." 
                className="bg-white border border-[#e5e7eb] rounded-full pl-10 pr-4 py-2 text-[12px] font-bold tracking-wider text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#d05322] focus:ring-1 focus:ring-[#d05322] w-[200px] transition-all uppercase"
              />
            </div>
            <button className="text-[#6b7280] hover:text-[#1f2937] transition-colors relative">
              <Bell size={20} strokeWidth={2.5} />
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#d05322] rounded-full border-2 border-[#fafaf9]"></div>
            </button>
            <button className="h-9 w-9 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[#6b7280] hover:text-[#1f2937] transition-colors overflow-hidden border border-[#e5e7eb]">
              <User size={18} strokeWidth={2.5} />
            </button>
          </div>
        </header>

        {/* Dashboard Title */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-[32px] font-extrabold text-[#1f2937] tracking-tight">Overview</h2>
            <p className="text-[14px] text-[#6b7280] mt-1">Platform performance and user metrics for Bistro Luxe.</p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-[#e5e7eb] rounded-lg px-4 py-2.5 text-[12px] font-bold tracking-wider text-[#1f2937] hover:border-[#d05322] hover:text-[#d05322] transition-colors uppercase shadow-sm">
            <SlidersHorizontal size={16} strokeWidth={2.5} />
            THIS WEEK
          </button>
        </div>

        {/* Top KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-white rounded-3xl p-6 border border-[#e5e7eb] shadow-sm flex flex-col justify-between group hover:border-[#d05322]/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users size={20} strokeWidth={2.5}/>
              </div>
              <span className="text-[11px] font-black text-[#10b981] bg-green-50 px-2 py-1 rounded border border-green-100">+12.5%</span>
            </div>
            <div>
              <p className="text-[11px] font-black text-[#9ca3af] uppercase tracking-widest mb-1">TOTAL USERS</p>
              <h3 className="text-[32px] font-extrabold text-[#1f2937] leading-none">{stats.totalUsers}</h3>
              <p className="text-[12px] text-[#6b7280] mt-3">{stats.totalCustomers} Customers • {stats.totalOwners} Owners</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#e5e7eb] shadow-sm flex flex-col justify-between group hover:border-[#d05322]/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                <ShoppingBag size={20} strokeWidth={2.5}/>
              </div>
              <span className="text-[11px] font-black text-[#10b981] bg-green-50 px-2 py-1 rounded border border-green-100">+8.2%</span>
            </div>
            <div>
              <p className="text-[11px] font-black text-[#9ca3af] uppercase tracking-widest mb-1">TOTAL ORDERS</p>
              <h3 className="text-[32px] font-extrabold text-[#1f2937] leading-none">156</h3>
              <p className="text-[12px] text-[#6b7280] mt-3">24 Today • 89 This Week</p>
            </div>
          </div>

          <div className="bg-[#1f2937] rounded-3xl p-6 border border-[#1f2937] shadow-sm flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 opacity-10">
              <DollarSign size={120} strokeWidth={3} />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <DollarSign size={20} strokeWidth={2.5}/>
              </div>
              <span className="text-[11px] font-black text-[#10b981] bg-[#10b981]/20 px-2 py-1 rounded border border-[#10b981]/30">+24.0%</span>
            </div>
            <div className="relative z-10">
              <p className="text-[11px] font-black text-white/50 uppercase tracking-widest mb-1">TOTAL REVENUE</p>
              <h3 className="text-[32px] font-extrabold text-white leading-none">$12,450</h3>
              <p className="text-[12px] text-white/70 mt-3">$1,240 Today • $8,450 This Month</p>
            </div>
          </div>

          <div className="bg-[#d05322] rounded-3xl p-6 shadow-sm flex flex-col justify-between text-white hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp size={20} strokeWidth={2.5}/>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-black text-white/70 uppercase tracking-widest mb-1">ACTION REQUIRED</p>
              <h3 className="text-[20px] font-extrabold text-white leading-tight mt-1">3 New Manual Orders Needed Review</h3>
              <div className="mt-4 flex items-center gap-2 text-[12px] font-bold text-white uppercase tracking-wider">
                GO TO LIVE ORDERS →
              </div>
            </div>
          </div>

        </div>

        {/* Main Content Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e7eb] shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
              <div>
                <h3 className="text-[18px] font-extrabold text-[#1f2937] tracking-tight">Revenue Analytics</h3>
                <p className="text-[13px] text-[#6b7280]">Current week vs previous week performance</p>
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

          {/* Quick Actions / Activity Feed */}
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
                  <p className="text-[12px] text-[#6b7280]">Update recipes, availability & prices</p>
                </div>
                <span className="text-[#9ca3af] group-hover:text-[#d05322] transform group-hover:translate-x-1 transition-all">→</span>
              </Link>

              <Link to="/owner/settings" className="flex items-center p-4 rounded-2xl border border-[#f3f4f6] hover:border-[#d05322] hover:shadow-sm transition-all group">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <span className="text-xl">⚙️</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-extrabold text-[#1f2937] text-[15px]">System Settings</h4>
                  <p className="text-[12px] text-[#6b7280]">Manage tax, hours, and profile</p>
                </div>
                <span className="text-[#9ca3af] group-hover:text-[#d05322] transform group-hover:translate-x-1 transition-all">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-[#e5e7eb] shadow-sm flex flex-col overflow-hidden mb-8">
          <div className="px-8 py-6 border-b border-[#e5e7eb] flex items-center justify-between bg-white">
            <div>
              <h3 className="text-[20px] font-extrabold text-[#1f2937] tracking-tight">Active Users Directory</h3>
              <p className="text-[13px] text-[#9ca3af] font-medium mt-1">View the roles and access levels of all users</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#f3f4f6] bg-[#fafaf9]">
                  <th className="py-4 px-8 text-[11px] font-black tracking-widest text-[#9ca3af] uppercase">Full Name</th>
                  <th className="py-4 px-8 text-[11px] font-black tracking-widest text-[#9ca3af] uppercase">Email</th>
                  <th className="py-4 px-8 text-[11px] font-black tracking-widest text-[#9ca3af] uppercase">Phone</th>
                  <th className="py-4 px-8 text-[11px] font-black tracking-widest text-[#9ca3af] uppercase">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-500 text-sm font-semibold">No users found.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b last:border-b-0 border-[#f3f4f6] hover:bg-[#fafaf9] transition-colors">
                      <td className="py-4 px-8">
                        <div className="font-bold text-[#1f2937] text-[14px]">{user.fullName || "—"}</div>
                      </td>
                      <td className="py-4 px-8 text-[14px] font-medium text-[#6b7280]">
                        {user.email || "—"}
                      </td>
                      <td className="py-4 px-8 text-[14px] font-medium text-[#6b7280]">
                        {user.phone || "—"}
                      </td>
                      <td className="py-4 px-8">
                        <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-sm ${
                          user.role === "OWNER" 
                            ? "bg-[#d05322]/10 text-[#d05322]" 
                            : "bg-gray-100 text-[#6b7280]"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-8 pb-8 border-t border-[#f3f4f6] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <h3 className="font-bold italic text-[#d05322] text-[14px]">Digital Maitre D</h3>
             <span className="text-[#9ca3af] text-[12px]">|</span>
             <p className="text-[#6b7280] text-[12px] font-medium">Elevating restaurant operations with premium design.</p>
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