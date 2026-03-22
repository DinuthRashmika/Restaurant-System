import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getOrderById } from "../../services/orderService";
import { useAuth } from "../../context/AuthContext";
import { 
  CheckCircle2, 
  ShoppingBag, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Bell,
  LogOut,
  User,
  PartyPopper,
  ShieldCheck,
  Printer
} from "lucide-react";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- SYNCED PROFILE IMAGE LOGIC ---
  const storedAuth = JSON.parse(localStorage.getItem("auth")) || {};
  const currentUser = auth?.user || auth || storedAuth?.user || storedAuth || {};
  const userId = currentUser.id || currentUser._id || currentUser.userId || "Unassigned";
  const cachedImage = localStorage.getItem(`frontend_image_cache_${userId}`);
  const profileImage = cachedImage || currentUser.profileImage || currentUser.avatarUrl || "";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(orderId);
        if (response.success) {
          setOrder(response.data);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleLogout = () => { logout(); navigate("/login"); };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-[#d05322] rounded-full animate-spin mb-4"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans selection:bg-[#d05322] pb-24">
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4">
        <div className="max-w-[1440px] mx-auto px-8 flex items-center justify-between">
          <Link to="/customer/dashboard" className="text-xl md:text-2xl font-black italic tracking-tighter text-[#1f2937]">
            Digital Maitre D'
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/profile" className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d05322] to-[#b84318] rounded-full opacity-0 group-hover:opacity-100 blur transition-all"></div>
              <div className="relative h-10 w-10 rounded-full bg-gray-100 border-2 border-white overflow-hidden flex items-center justify-center shadow-sm">
                {profileImage ? (
                  <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: `url('${profileImage}')`}} />
                ) : (
                  <User size={20} className="text-gray-400" />
                )}
              </div>
            </Link>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors"><LogOut size={20}/></button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <div className="relative w-full h-[55vh] min-h-[500px] bg-[#111827] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay scale-110" 
          alt="" 
        />
        {/* Gradient overlay adjusted to not interfere with z-index of content */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#111827]/40 to-[#fafaf9] z-0"></div>
        
        <div className="relative z-10 text-center px-8 mt-[-40px] animate-in fade-in zoom-in duration-1000">
           <div className="w-20 h-20 bg-[#d05322] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-3">
              <PartyPopper size={40} className="text-white" />
           </div>
           <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">
              Bon Appétit!
           </h1>
           <p className="text-gray-300 text-lg font-medium max-w-md mx-auto">
              Your gourmet selection is now being handcrafted.
           </p>
        </div>
      </div>

      {/* MAIN RECEIPT SECTION - FIXED Z-INDEX AND MARGIN */}
      <main className="max-w-[850px] mx-auto px-8 relative z-30 mt-[-120px]">
        <div className="bg-white rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] border border-white overflow-hidden animate-in slide-in-from-bottom-10 duration-700">
          
          {/* Header Info */}
          <div className="bg-gradient-to-r from-gray-50 to-white px-10 py-10 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="text-center md:text-left">
                <p className="text-[11px] font-black text-[#d05322] uppercase tracking-[0.4em] mb-2">Order Authenticated</p>
                <h2 className="text-4xl font-black text-[#1f2937] tracking-tight">#{orderId?.slice(-6).toUpperCase()}</h2>
             </div>
             <div className="flex items-center gap-4">
                <button onClick={() => window.print()} className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-2.5 rounded-xl text-[12px] font-bold text-gray-500 hover:text-[#1f2937] hover:border-gray-400 shadow-sm transition-all active:scale-95">
                   <Printer size={16}/> Print
                </button>
                <div className="bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-100 shadow-sm">
                   <CheckCircle2 size={16}/> Confirmed
                </div>
             </div>
          </div>

          {/* Details Content */}
          <div className="p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               
               {/* Left Side: Logistics */}
               <div className="lg:col-span-5 space-y-8">
                  <div className="flex items-start gap-5">
                     <div className="h-12 w-12 bg-orange-50 rounded-2xl flex-shrink-0 flex items-center justify-center text-[#d05322] shadow-sm"><MapPin size={24}/></div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Destination</p>
                        <p className="text-[16px] font-bold text-[#1f2937] leading-relaxed">{order?.deliveryAddress || "s"}</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-5">
                     <div className="h-12 w-12 bg-orange-50 rounded-2xl flex-shrink-0 flex items-center justify-center text-[#d05322] shadow-sm"><Clock size={24}/></div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Estimated Arrival</p>
                        <p className="text-[16px] font-bold text-[#1f2937]">35 - 45 Minutes</p>
                     </div>
                  </div>
                  <div className="pt-4">
                     <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
                        <ShieldCheck size={18} className="text-emerald-500"/>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">Verified Secure Transaction</span>
                     </div>
                  </div>
               </div>

               {/* Right Side: Items Tray */}
               <div className="lg:col-span-7">
                  <div className="bg-[#fafaf9] rounded-[2.5rem] p-8 border border-gray-100 shadow-inner">
                     <h3 className="text-[11px] font-black text-[#9ca3af] uppercase tracking-widest mb-6">Your Selection</h3>
                     <div className="space-y-5">
                       {order?.items?.map((item, index) => (
                         <div key={index} className="flex justify-between items-start text-sm font-bold">
                           <span className="text-[#4b5563] flex gap-3">
                             <span className="text-[#d05322] bg-orange-100/50 px-2 py-0.5 rounded text-xs">x{item.quantity}</span> 
                             <span className="leading-tight">{item.itemName}</span>
                           </span>
                           <span className="text-[#1f2937] font-mono ml-4">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                         </div>
                       ))}
                     </div>
                     <div className="mt-8 pt-6 border-t border-dashed border-gray-200 flex justify-between items-end">
                        <span className="text-[11px] font-black uppercase tracking-widest text-[#9ca3af]">Total Settlement</span>
                        <span className="text-4xl font-black text-[#1f2937] tracking-tighter">${parseFloat(order?.totalAmount || 0).toFixed(2)}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="flex flex-col sm:flex-row gap-4 mt-12">
              <button 
                onClick={() => navigate("/order-history")}
                className="flex-1 bg-[#1f2937] hover:bg-black text-white py-5 rounded-2xl text-[13px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 group"
              >
                Track Live Order <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate("/menu")}
                className="flex-1 bg-white border-2 border-gray-100 hover:border-[#d05322]/30 text-[#1f2937] hover:text-[#d05322] py-5 rounded-2xl text-[13px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm"
              >
                Order More <ShoppingBag size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1440px] mx-auto px-8 mt-24 text-center text-gray-400">
         <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-50">Digital Maitre D' Logistics • Priority Service</p>
      </footer>
    </div>
  );
}