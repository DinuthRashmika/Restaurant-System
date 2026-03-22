import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../services/orderService";
import { 
  Bell, 
  LogOut, 
  User, 
  MapPin, 
  CreditCard, 
  Wallet, 
  Truck, 
  ChevronRight, 
  ShieldCheck, 
  MessageSquare,
  ShoppingBag,
  ArrowLeft,
  Lock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function CheckoutPage() {
  const { cart, clearCart, cartTotal } = useCart();
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  // --- SYNCED PROFILE IMAGE LOGIC ---
  const storedAuth = JSON.parse(localStorage.getItem("auth")) || {};
  const currentUser = auth?.user || auth || storedAuth?.user || storedAuth || {};
  const userId = currentUser.id || currentUser._id || currentUser.userId || "Unassigned";
  const cachedImage = localStorage.getItem(`frontend_image_cache_${userId}`);
  const profileImage = cachedImage || currentUser.profileImage || currentUser.avatarUrl || "";

  // Payment Details States
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!deliveryAddress) {
      setError("Please enter a delivery address.");
      return;
    }

    if (paymentMethod === "credit_card") {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        setError("Please fill out all Credit Card details.");
        return;
      }
    }

    if (paymentMethod === "paypal") {
      if (!paypalEmail) {
        setError("Please enter your PayPal email address.");
        return;
      }
    }

    setLoading(true);

    try {
      const orderData = {
        customerId: auth?.userId || userId,
        customerName: auth?.fullName || currentUser.fullName,
        customerEmail: auth?.email || currentUser.email,
        paymentMethod: paymentMethod, 
        items: cart.map(item => ({
          menuItemId: item.id,
          itemName: item.name,
          unitPrice: item.price,
          quantity: item.quantity
        })),
        deliveryAddress,
        notes
      };

      const response = await createOrder(orderData);
      
      if (response.success) {
        clearCart();
        navigate(`/order-confirmation/${response.data.id}`);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center p-6">
        <div className="text-center animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-white shadow-xl rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
            <ShoppingBag className="text-gray-300" size={36} />
          </div>
          <h2 className="text-3xl font-black text-[#1f2937] mb-3 tracking-tight">Your Tray is Empty</h2>
          <p className="text-gray-500 mb-10 max-w-xs mx-auto font-medium">Add some of our finest selections before proceeding to checkout.</p>
          <button 
            onClick={() => navigate("/menu")} 
            className="bg-[#1f2937] text-white px-10 py-4 rounded-full font-black uppercase tracking-[0.2em] hover:bg-[#d05322] transition-all shadow-xl active:scale-95"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  const deliveryFee = 5.00;
  const taxAmount = cartTotal * 0.1;
  const finalTotal = cartTotal + deliveryFee + taxAmount;

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans selection:bg-[#d05322] selection:text-white pb-24">
      
      {/* CINEMATIC HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4">
        <div className="max-w-[1440px] mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/customer/dashboard" className="text-xl md:text-2xl font-black italic tracking-tighter text-[#1f2937] hover:text-[#d05322] transition-colors">
              Digital Maitre D'
            </Link>
            <nav className="hidden lg:flex items-center gap-8 border-l border-gray-200 pl-10">
               <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#1f2937] transition-all">
                  <ArrowLeft size={14} strokeWidth={3}/> Return to Selection
               </button>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/profile" className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#d05322] to-[#b84318] rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-500"></div>
              <div className="relative h-10 w-10 rounded-full bg-gray-100 border-2 border-transparent group-hover:border-white transition-all shadow-sm overflow-hidden flex items-center justify-center">
                {profileImage ? (
                  <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: `url('${profileImage}')`}} />
                ) : (
                  <User size={20} className="text-gray-400" />
                )}
              </div>
            </Link>
            <div className="h-6 w-px bg-gray-200"></div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-[#d05322] transition-colors"><LogOut size={20} strokeWidth={2.5}/></button>
          </div>
        </div>
      </header>

      {/* BACKGROUND DECOR */}
      <div className="absolute top-0 left-0 right-0 h-[45vh] bg-[#111827] -z-10 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-20 mix-blend-overlay" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fafaf9]/80 to-[#fafaf9]"></div>
      </div>

      <main className="max-w-[1280px] mx-auto px-8 pt-36">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
           <div className="animate-in slide-in-from-left duration-700">
              <div className="flex items-center gap-3 mb-3">
                 <div className="h-6 w-1 bg-[#d05322] rounded-full"></div>
                 <span className="text-[11px] font-black text-[#d05322] tracking-[0.4em] uppercase">Secure Checkout</span>
              </div>
              <h2 className="text-5xl font-extrabold text-[#1f2937] tracking-tighter">Finalize Your Order</h2>
           </div>
           <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm animate-in slide-in-from-right duration-700">
              <Lock size={14} className="text-green-500" />
              <span className="text-[10px] font-black text-gray-500 tracking-widest uppercase">End-to-End Encrypted</span>
           </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          
          {/* LEFT: INFORMATION FORMS */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Delivery Section */}
            <section className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-white animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="flex items-center gap-5 mb-10">
                <div className="h-14 w-14 bg-orange-50 rounded-2xl flex items-center justify-center text-[#d05322] shadow-sm">
                  <MapPin size={28} strokeWidth={2.2} />
                </div>
                <div>
                   <h3 className="text-2xl font-bold text-[#1f2937] tracking-tight">Delivery Details</h3>
                   <p className="text-sm text-gray-400 font-medium">Where shall we serve your meal?</p>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="group">
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1 group-focus-within:text-[#d05322] transition-colors">Arrival Address</label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    rows="3"
                    className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50/50 px-6 py-5 text-[16px] font-medium outline-none transition-all focus:border-[#d05322]/20 focus:bg-white focus:ring-8 focus:ring-[#d05322]/5 placeholder:text-gray-300"
                    placeholder="E.g. 123 Luxury Lane, Suite 500, New York, NY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1 flex items-center gap-2">
                    <MessageSquare size={14} className="text-gray-300" /> Concierge Notes
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50/50 px-6 py-5 text-[16px] font-medium outline-none transition-all focus:border-[#d05322]/20 focus:bg-white focus:ring-8 focus:ring-[#d05322]/5 placeholder:text-gray-300"
                    placeholder="Gate codes, floor number, or dietary reminders..."
                  />
                </div>
              </div>
            </section>

            {/* Payment Section */}
            <section className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-white animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center gap-5 mb-10">
                <div className="h-14 w-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <CreditCard size={28} strokeWidth={2.2} />
                </div>
                <div>
                   <h3 className="text-2xl font-bold text-[#1f2937] tracking-tight">Payment Method</h3>
                   <p className="text-sm text-gray-400 font-medium">Select your preferred transaction style.</p>
                </div>
              </div>

              {/* Visual Payment Switcher */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
                {[
                  { id: 'credit_card', label: 'Credit Card', icon: <CreditCard size={20} /> },
                  { id: 'paypal', label: 'PayPal', icon: <Wallet size={20} /> },
                  { id: 'cash', label: 'Cash', icon: <Truck size={20} /> }
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] border-2 transition-all duration-500 relative overflow-hidden group ${
                      paymentMethod === method.id 
                      ? 'border-[#d05322] bg-orange-50/30 text-[#d05322] shadow-md' 
                      : 'border-gray-50 bg-gray-50/50 text-gray-400 hover:border-gray-200'
                    }`}
                  >
                    {paymentMethod === method.id && (
                       <div className="absolute top-3 right-3 animate-in fade-in zoom-in">
                          <CheckCircle2 size={16} className="text-[#d05322]" />
                       </div>
                    )}
                    <div className={`${paymentMethod === method.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-500`}>
                       {method.icon}
                    </div>
                    <span className="text-[12px] font-black uppercase tracking-[0.15em]">{method.label}</span>
                  </button>
                ))}
              </div>

              {/* Conditional Payment Detail Forms */}
              <div className="bg-[#fafaf9] rounded-3xl p-8 border border-gray-100">
                {paymentMethod === 'credit_card' && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="grid gap-5 sm:grid-cols-2">
                       <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Cardholder Name</label>
                          <input type="text" placeholder="FULL NAME" value={cardName} onChange={(e)=>setCardName(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 outline-none focus:border-[#d05322] transition-all font-bold text-[#1f2937] placeholder:text-gray-200" />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Card Number</label>
                          <input type="text" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={(e)=>setCardNumber(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 outline-none focus:border-[#d05322] transition-all font-mono font-bold text-[#1f2937] placeholder:text-gray-200" />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                       <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Expiry Date</label>
                          <input type="text" placeholder="MM / YY" value={expiryDate} onChange={(e)=>setExpiryDate(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 outline-none focus:border-[#d05322] transition-all font-bold text-[#1f2937] placeholder:text-gray-200 text-center" />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Security Code</label>
                          <input type="text" placeholder="CVV" value={cvv} onChange={(e)=>setCvv(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 outline-none focus:border-[#d05322] transition-all font-bold text-[#1f2937] placeholder:text-gray-200 text-center" />
                       </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="py-10 text-center animate-in fade-in duration-500">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Wallet className="text-blue-500" />
                    </div>
                    <h4 className="text-[16px] font-bold text-gray-800 mb-6">Redirecting to PayPal for verification</h4>
                    <input 
                      type="email" 
                      placeholder="PayPal Email Address" 
                      value={paypalEmail} 
                      onChange={(e)=>setPaypalEmail(e.target.value)} 
                      className="w-full max-w-sm mx-auto rounded-xl border border-gray-200 bg-white px-6 py-4 outline-none focus:border-[#d05322] transition-all font-medium text-center" 
                    />
                  </div>
                )}

                {paymentMethod === 'cash' && (
                  <div className="py-10 text-center animate-in fade-in duration-500">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                       <Truck />
                    </div>
                    <h4 className="text-[18px] font-bold text-gray-800 mb-2">Pay on Arrival</h4>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">Please ensure you have <strong>${finalTotal.toFixed(2)}</strong> ready for our Maitre D' upon delivery.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT: ORDER SUMMARY (STICKY) */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <div className="bg-[#1f2937] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-right duration-1000">
                {/* Decorative background element */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#d05322]/10 blur-[80px] rounded-full pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#d05322]/5 blur-[60px] rounded-full pointer-events-none"></div>
                
                <h3 className="text-xl font-bold mb-10 relative z-10 flex items-center gap-3">
                  <ShoppingBag size={20} className="text-[#d05322]" /> 
                  Order Summary
                </h3>

                {/* Cart Items List */}
                <div className="space-y-6 mb-10 relative z-10 max-h-[35vh] overflow-y-auto pr-3 scrollbar-hide">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-start group">
                      <div className="pr-4 flex-1">
                        <p className="text-[15px] font-bold leading-tight group-hover:text-[#d05322] transition-colors">{item.name}</p>
                        <p className="text-[11px] font-black text-gray-500 mt-1 uppercase tracking-widest">Quantity: {item.quantity}</p>
                      </div>
                      <span className="text-[15px] font-black text-white/90 font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Totals Section */}
                <div className="border-t border-white/10 pt-8 space-y-4 relative z-10">
                  <div className="flex justify-between text-sm font-medium text-gray-400">
                    <span className="tracking-wide uppercase text-[10px] font-black">Subtotal</span>
                    <span className="text-white font-mono">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-400">
                    <span className="tracking-wide uppercase text-[10px] font-black">Delivery Service</span>
                    <span className="text-white font-mono">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-400">
                    <span className="tracking-wide uppercase text-[10px] font-black">V.A.T (10%)</span>
                    <span className="text-white font-mono">${taxAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-6 flex justify-between items-end">
                    <div>
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d05322] block mb-1">Total Payable</span>
                       <span className="text-5xl font-black leading-none tracking-tighter">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* ERROR FEEDBACK */}
                {error && (
                  <div className="mt-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3 animate-in shake duration-500">
                     <AlertCircle size={18} />
                     <span className="text-xs font-bold">{error}</span>
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full mt-10 bg-[#d05322] hover:bg-[#b84318] text-white py-6 rounded-2xl text-[14px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 shadow-[0_15px_30px_-5px_rgba(208,83,34,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      Confirm & Pay 
                      <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 flex flex-col items-center gap-4 shadow-sm">
                <div className="flex items-center gap-2">
                   <ShieldCheck size={18} className="text-green-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Secured via Stripe & SSL</span>
                </div>
                <div className="flex gap-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                   <CreditCard size={20} />
                   <Wallet size={20} />
                   <ShoppingBag size={20} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      
      {/* Editorial Footer */}
      <footer className="max-w-[1440px] mx-auto px-8 mt-40 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-400">
         <p className="text-[11px] font-bold uppercase tracking-[0.3em]">© 2026 DIGITAL MAITRE D' • HIGH CULINARY LOGISTICS</p>
         <div className="flex gap-10 text-[11px] font-black uppercase tracking-widest">
            <Link to="/support" className="hover:text-[#d05322] transition-colors">Privacy</Link>
            <Link to="/support" className="hover:text-[#d05322] transition-colors">Terms</Link>
            <Link to="/support" className="hover:text-[#d05322] transition-colors">Concierge</Link>
         </div>
      </footer>
    </div>
  );
}