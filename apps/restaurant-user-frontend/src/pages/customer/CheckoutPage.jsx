import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../services/orderService";

export default function CheckoutPage() {
  const { cart, clearCart, cartTotal } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  // --- NEW: Payment Details States ---
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Form Validation
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
      // Build order payload (NOTE: Payment details are typically processed by a secure payment gateway like Stripe, 
      // so we don't usually send raw CC data to our own DB. We just note the method used!)
      const orderData = {
        customerId: auth?.userId,
        customerName: auth?.fullName,
        customerEmail: auth?.email,
        paymentMethod: paymentMethod, // Added payment method
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
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <Topbar />
          <div className="mt-12 text-center rounded-xl border border-dashed border-gray-300 bg-white p-12">
            <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-500">Add some delicious items to your cart before checkout.</p>
            <button
              onClick={() => navigate("/menu")}
              className="mt-6 rounded-lg bg-[#d05322] px-8 py-3 font-bold uppercase tracking-wider text-white hover:bg-[#b84318] transition-colors shadow-lg"
            >
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals
  const deliveryFee = 5.00;
  const taxAmount = cartTotal * 0.1;
  const finalTotal = cartTotal + deliveryFee + taxAmount;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Topbar />

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Checkout Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Delivery Address */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Delivery Address
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    rows="3"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] outline-none transition-all focus:border-[#d05322] focus:bg-white focus:ring-2 focus:ring-[#d05322]/20"
                    placeholder="Enter your full delivery address (e.g., 123 Main St, Apt 4B)"
                    required
                  />
                </div>

                {/* Order Notes */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Order Notes <span className="text-gray-400 font-medium normal-case">(Optional)</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="2"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] outline-none transition-all focus:border-[#d05322] focus:bg-white focus:ring-2 focus:ring-[#d05322]/20"
                    placeholder="Any special instructions for the chef or driver?"
                  />
                </div>

                <div className="h-px bg-gray-100 w-full my-8"></div>

                {/* Payment Method */}
                <div>
                  <label className="mb-4 block text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Payment Method
                  </label>
                  
                  {/* Radio Selectors */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    {/* Credit Card Radio */}
                    <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-xl border p-4 transition-all ${paymentMethod === "credit_card" ? "border-[#d05322] bg-[#d05322]/5" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                      <input
                        type="radio"
                        value="credit_card"
                        checked={paymentMethod === "credit_card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-[#d05322] focus:ring-[#d05322]"
                      />
                      <span className={`font-semibold ${paymentMethod === "credit_card" ? "text-[#d05322]" : "text-gray-700"}`}>Credit Card</span>
                    </label>

                    {/* PayPal Radio */}
                    <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-xl border p-4 transition-all ${paymentMethod === "paypal" ? "border-[#d05322] bg-[#d05322]/5" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                      <input
                        type="radio"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-[#d05322] focus:ring-[#d05322]"
                      />
                      <span className={`font-semibold ${paymentMethod === "paypal" ? "text-[#d05322]" : "text-gray-700"}`}>PayPal</span>
                    </label>

                    {/* Cash Radio */}
                    <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-xl border p-4 transition-all ${paymentMethod === "cash" ? "border-[#d05322] bg-[#d05322]/5" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                      <input
                        type="radio"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-[#d05322] focus:ring-[#d05322]"
                      />
                      <span className={`font-semibold ${paymentMethod === "cash" ? "text-[#d05322]" : "text-gray-700"}`}>Cash on Delivery</span>
                    </label>
                  </div>

                  {/* Dynamic Payment Details Area */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    
                    {/* 1. Credit Card Form */}
                    {paymentMethod === "credit_card" && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Name on Card</label>
                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-[#d05322] focus:ring-1 focus:ring-[#d05322]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="0000 0000 0000 0000"
                            maxLength="19"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-[#d05322] focus:ring-1 focus:ring-[#d05322]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Expiry (MM/YY)</label>
                            <input
                              type="text"
                              value={expiryDate}
                              onChange={(e) => setExpiryDate(e.target.value)}
                              placeholder="MM/YY"
                              maxLength="5"
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-[#d05322] focus:ring-1 focus:ring-[#d05322]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">CVV</label>
                            <input
                              type="text"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value)}
                              placeholder="123"
                              maxLength="4"
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-[#d05322] focus:ring-1 focus:ring-[#d05322]"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. PayPal Form */}
                    {paymentMethod === "paypal" && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 text-center py-4">
                        <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13h5.5c2.5 0 4-1.5 4-4s-1.5-4-4-4H5c-.5 0-1 .5-1 1v14"></path><path d="M11 13h3.5c2.5 0 4 1.5 4 4s-1.5 4-4 4H8.5"></path></svg>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">Pay with your PayPal Account</h4>
                        <div>
                          <input
                            type="email"
                            value={paypalEmail}
                            onChange={(e) => setPaypalEmail(e.target.value)}
                            placeholder="Enter your PayPal Email"
                            className="w-full max-w-sm mx-auto rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-[#d05322] focus:ring-1 focus:ring-[#d05322]"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-3">You will be redirected to PayPal to complete your purchase securely.</p>
                      </div>
                    )}

                    {/* 3. Cash on Delivery Form */}
                    {paymentMethod === "cash" && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300 text-center py-6">
                        <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">Cash on Delivery selected</h4>
                        <p className="text-sm text-gray-600">
                          Please have the exact amount of <strong>${finalTotal.toFixed(2)}</strong> ready when our Maitre D' arrives with your order.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#1f2937] py-4 text-[15px] font-black tracking-widest uppercase text-white transition-all hover:bg-[#d05322] hover:shadow-lg disabled:opacity-60 flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    `Pay $${finalTotal.toFixed(2)}`
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Your Order</h3>
              
              <div className="mt-4 space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm group">
                    <div className="flex-1 pr-4">
                      <p className="font-bold text-gray-900 group-hover:text-[#d05322] transition-colors">{item.name}</p>
                      <p className="text-xs font-semibold text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-gray-900 whitespace-nowrap">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-dashed border-gray-300 pt-6">
                <div className="flex justify-between font-semibold text-gray-700 mb-3">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  <span>Tax (10%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                
                <div className="my-4 border-t border-gray-100"></div>
                
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Total</span>
                  <span className="text-3xl font-black text-[#d05322]">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}