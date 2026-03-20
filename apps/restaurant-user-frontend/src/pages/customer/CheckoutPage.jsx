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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!deliveryAddress) {
      setError("Please enter delivery address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderData = {
        customerId: auth.userId,
        customerName: auth.fullName,
        customerEmail: auth.email,
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
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-500">Add some items to your cart before checkout.</p>
            <button
              onClick={() => navigate("/menu")}
              className="mt-4 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
            >
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Topbar />

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
              
              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* Delivery Address */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Delivery Address
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    rows="3"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:bg-white"
                    placeholder="Enter your full delivery address"
                    required
                  />
                </div>

                {/* Order Notes */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="2"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:bg-white"
                    placeholder="Any special instructions for your order?"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="credit_card"
                        checked={paymentMethod === "credit_card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-orange-600"
                      />
                      <span className="text-sm text-gray-700">Credit Card</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-orange-600"
                      />
                      <span className="text-sm text-gray-700">PayPal</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-orange-600"
                      />
                      <span className="text-sm text-gray-700">Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
              
              <div className="mt-4 space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-500">
                  <span>Delivery Fee</span>
                  <span>$5.00</span>
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-500">
                  <span>Tax</span>
                  <span>${(cartTotal * 0.1).toFixed(2)}</span>
                </div>
                <div className="mt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${(cartTotal + 5 + cartTotal * 0.1).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}