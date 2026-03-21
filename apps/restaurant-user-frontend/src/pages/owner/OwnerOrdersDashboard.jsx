import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, User, Bell } from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function OwnerOrdersDashboard() {
  const [activeTab, setActiveTab] = useState("incoming");

  // Mock Data
  const incomingOrders = [
    {
      id: "#MD-2094",
      items: "1x Truffle Risotto, 2x Sparkling Water",
      time: "2 MIN AGO",
    },
    {
      id: "#MD-2095",
      items: "4x Oysters, 1x Chablis",
      time: "JUST NOW",
    },
    {
      id: "#MD-2096",
      items: "2x Lobster Roll",
      time: "5 MIN AGO",
    }
  ];

  const kitchenOrders = [
    {
      id: "#MD-2092",
      items: "2x Wagyu Burger, 1x Fries",
      status: "PREPARING - 10 MIN",
    }
  ];

  const readyOrders = [
    {
      id: "#MD-2090",
      items: "1x Caesar Salad, 1x Pinot Noir",
      status: "WAITING FOR PICKUP",
    }
  ];

  const hourlyData = [
    { time: "2PM", sales: 400 },
    { time: "3PM", sales: 300 },
    { time: "4PM", sales: 550 },
    { time: "5PM", sales: 450 },
    { time: "6PM", sales: 800 },
    { time: "7PM", sales: 1200 },
    { time: "8PM", sales: 900 },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans flex flex-col items-center">
      {/* Container for bounded width */}
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
              <Link to="/owner/dashboard" className="text-[13px] font-bold text-[#6b7280] hover:text-[#1f2937] transition-colors pb-1">
                Dashboard
              </Link>
              <Link to="/owner/orders" className="text-[13px] font-bold text-[#d05322] border-b-2 border-[#d05322] pb-1">
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
            <button className="text-[#6b7280] hover:text-[#1f2937] transition-colors">
              <Bell size={20} strokeWidth={2.5} />
            </button>
            <button className="h-9 w-9 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[#6b7280] hover:text-[#1f2937] transition-colors overflow-hidden border border-[#e5e7eb]">
              <User size={18} strokeWidth={2.5} />
            </button>
          </div>
        </header>

        {/* Top Controls: Search & Filters */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[32px] font-extrabold text-[#1f2937] tracking-tight">Live Orders</h2>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af] group-focus-within:text-[#d05322]" size={16} strokeWidth={2.5}/>
              <input 
                type="text" 
                placeholder="SEARCH ORDER" 
                className="bg-white border border-[#e5e7eb] rounded-lg pl-10 pr-4 py-2.5 text-[12px] font-bold tracking-wider text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#d05322] focus:ring-1 focus:ring-[#d05322] w-[220px] transition-all uppercase"
              />
            </div>
            <button className="flex items-center gap-2 bg-white border border-[#e5e7eb] rounded-lg px-4 py-2.5 text-[12px] font-bold tracking-wider text-[#1f2937] hover:border-[#d05322] hover:text-[#d05322] transition-colors uppercase">
              <SlidersHorizontal size={16} strokeWidth={2.5} />
              FILTER
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Orders List (Span 8) */}
          <div className="lg:col-span-8 flex flex-col">
            
            {/* Status Tabs */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e5e7eb]">
              <div className="flex items-center gap-8">
                <button 
                  onClick={() => setActiveTab("incoming")}
                  className={`text-[13px] font-extrabold tracking-widest uppercase transition-colors relative ${activeTab === "incoming" ? "text-[#d05322]" : "text-[#9ca3af] hover:text-[#6b7280]"}`}
                >
                  INCOMING ({incomingOrders.length})
                  {activeTab === "incoming" && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#d05322]" />}
                </button>
                <button 
                  onClick={() => setActiveTab("kitchen")}
                  className={`text-[13px] font-extrabold tracking-widest uppercase transition-colors relative ${activeTab === "kitchen" ? "text-[#1f2937]" : "text-[#9ca3af] hover:text-[#6b7280]"}`}
                >
                  KITCHEN ({kitchenOrders.length})
                  {activeTab === "kitchen" && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#1f2937]" />}
                </button>
                <button 
                  onClick={() => setActiveTab("ready")}
                  className={`text-[13px] font-extrabold tracking-widest uppercase transition-colors relative ${activeTab === "ready" ? "text-[#10b981]" : "text-[#9ca3af] hover:text-[#6b7280]"}`}
                >
                  READY ({readyOrders.length})
                  {activeTab === "ready" && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#10b981]" />}
                </button>
              </div>
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-green-700 tracking-widest uppercase">KITCHEN OPEN</span>
              </div>
            </div>

            {/* Orders Feed */}
            <div className="flex flex-col gap-4">
              
              {activeTab === "incoming" && incomingOrders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl p-5 border border-[#e5e7eb] flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[14px] font-black text-[#1f2937]">{order.id}</span>
                      <span className="text-[11px] font-bold text-[#d05322] bg-[#d05322]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{order.time}</span>
                    </div>
                    <p className="text-[14px] text-[#6b7280] font-medium">{order.items}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-[12px] font-bold text-[#9ca3af] hover:text-[#4b5563] uppercase tracking-wider px-2">
                      REJECT
                    </button>
                    <button className="bg-[#d05322] hover:bg-[#b84318] text-white text-[12px] font-bold tracking-wider uppercase px-6 py-2.5 rounded-lg transition-colors shadow-sm">
                      APPROVE
                    </button>
                  </div>
                </div>
              ))}

              {activeTab === "kitchen" && kitchenOrders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl p-5 border border-[#e5e7eb] flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[14px] font-black text-[#1f2937]">{order.id}</span>
                      <span className="text-[11px] font-bold text-[#1f2937] bg-gray-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{order.status}</span>
                    </div>
                    <p className="text-[14px] text-[#6b7280] font-medium">{order.items}</p>
                  </div>
                  <button className="bg-[#1f2937] hover:bg-black text-white text-[12px] font-bold tracking-wider uppercase px-6 py-2.5 rounded-lg transition-colors shadow-sm">
                    MARK READY
                  </button>
                </div>
              ))}

              {activeTab === "ready" && readyOrders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl p-5 border border-[#e5e7eb] flex items-center justify-between hover:shadow-md transition-shadow border-l-4 border-l-[#10b981]">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[14px] font-black text-[#1f2937]">{order.id}</span>
                      <span className="text-[11px] font-bold text-[#10b981] bg-green-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{order.status}</span>
                    </div>
                    <p className="text-[14px] text-[#6b7280] font-medium">{order.items}</p>
                  </div>
                  <button className="bg-white border border-[#e5e7eb] hover:border-[#10b981] text-[#1f2937] hover:text-[#10b981] text-[12px] font-bold tracking-wider uppercase px-6 py-2.5 rounded-lg transition-colors shadow-sm">
                    HANDED OVER
                  </button>
                </div>
              ))}

            </div>
          </div>

          {/* Right Column: Key Metrics (Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Total Sales Card */}
            <div className="bg-white rounded-3xl p-8 border border-[#e5e7eb] shadow-sm">
              <h3 className="text-[11px] font-black text-[#9ca3af] uppercase tracking-widest mb-2">TOTAL SALES TODAY</h3>
              <div className="text-[42px] font-extrabold text-[#1f2937] leading-none mb-2 tracking-tight">$4,250.00</div>
              <p className="text-[13px] font-bold text-[#10b981] flex items-center gap-1">
                ↗ +12% from yesterday
              </p>
            </div>

            {/* Hourly Performance Chart Setup */}
            <div className="bg-[#1f2937] rounded-3xl p-8 shadow-sm text-white">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[11px] font-black text-[#9ca3af] uppercase tracking-widest">HOURLY PERFORMANCE</h3>
                <button className="text-[11px] font-bold text-[#d05322] hover:text-white uppercase tracking-wider transition-colors">
                  VIEW FULL →
                </button>
              </div>
              <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#d05322' }}
                    />
                    <Bar dataKey="sales" fill="#d05322" radius={[4, 4, 4, 4]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-[#6b7280] mt-3">
                {hourlyData.map(d => <span key={d.time}>{d.time}</span>)}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-[#e5e7eb]">
                <h4 className="text-[10px] font-black text-[#9ca3af] uppercase tracking-widest mb-1">AVG TICKET</h4>
                <div className="text-[20px] font-extrabold text-[#1f2937]">$85.00</div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-[#e5e7eb]">
                <h4 className="text-[10px] font-black text-[#9ca3af] uppercase tracking-widest mb-1">ACTIVE TABLES</h4>
                <div className="text-[20px] font-extrabold text-[#1f2937]">12</div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-16 pb-8 border-t border-[#f3f4f6] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <h3 className="font-bold italic text-[#d05322] text-[14px]">Digital Maître D'</h3>
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