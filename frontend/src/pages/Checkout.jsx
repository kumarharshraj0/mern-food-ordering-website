import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  CreditCard,
  Wallet,
  Truck,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useOrder } from "@/context/OrderContext";
import api from "../lib/api";

export default function Checkout() {
  const navigate = useNavigate();

  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder, verifyPayment } = useOrder();

  const items = cart?.items || [];
  const addresses = user?.addresses || [];

  const [paymentMethod, setPaymentMethod] = useState("online");
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newAddress, setNewAddress] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    pincode: ""
  });

  /* ---------------- COUPON ---------------- */
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  /* ---------------- TOTALS ---------------- */
  const subtotal = cart?.cartTotal || 0;
  const deliveryFee = 40;
  const discount = appliedCoupon?.discountAmount || 0;
  const totalAmount = subtotal + deliveryFee - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setApplyingCoupon(true);
    setCouponError("");
    try {
      const res = await api.post("/coupons/validate", {
        code: couponCode,
        amount: subtotal
      });
      setAppliedCoupon(res.data.coupon);
      setCouponError("");
    } catch (err) {
      setCouponError(err.response?.data?.message || "Invalid coupon");
      setAppliedCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const selectedAddress = useNewAddress
    ? newAddress
    : addresses[selectedAddressIndex];

  /* ---------------- RAZORPAY ---------------- */
  const openRazorpay = async () => {
    try {
      setLoading(true);

      // 1️⃣ Create order in backend
      const { order, razorpayOrder } = await createOrder({
        items,
        deliveryAddress: selectedAddress,
        paymentMethod: "online",
        deliveryFee,
        couponCode: appliedCoupon?.code
      });

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        return;
      }

      // 2️⃣ Open Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Food App",
        description: "Food Order Payment",
        order_id: razorpayOrder.id,

        handler: async (response) => {
          // 3️⃣ Verify payment
          await verifyPayment(order._id, {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          });

          clearCart();

          // ✅ Redirect to success page
          navigate(`/order-success/${order._id}`);
        },

        prefill: {
          name: user?.name,
          email: user?.email
        },

        theme: {
          color: "#f97316"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("❌ Payment failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- PLACE ORDER ---------------- */
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select or add address");
      return;
    }

    // ONLINE PAYMENT
    if (paymentMethod === "online") {
      openRazorpay();
      return;
    }

    // COD
    try {
      setLoading(true);

      const { order } = await createOrder({
        items,
        deliveryAddress: selectedAddress,
        paymentMethod: "cod",
        deliveryFee,
        couponCode: appliedCoupon?.code
      });

      clearCart();
      navigate(`/order-success/${order._id}`);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* ADDRESS */}
          <div className="bg-white rounded-2xl p-6 border">
            <h2 className="text-xl font-semibold flex gap-2 mb-4">
              <MapPin className="text-orange-600" />
              Delivery Address
            </h2>

            {!useNewAddress && addresses.length > 0 && (
              <div className="space-y-3">
                {addresses.map((addr, i) => (
                  <label
                    key={i}
                    className={`block p-4 rounded-xl border cursor-pointer ${selectedAddressIndex === i
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200"
                      }`}
                  >
                    <input
                      type="radio"
                      checked={selectedAddressIndex === i}
                      onChange={() => setSelectedAddressIndex(i)}
                      className="mr-2"
                    />
                    <strong>{addr.label}</strong>
                    <p className="text-sm text-gray-600">
                      {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                  </label>
                ))}
              </div>
            )}

            {/* NEW ADDRESS */}
            {useNewAddress && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {["label", "street", "city", "state", "pincode"].map((field) => (
                  <input
                    key={field}
                    className="input"
                    placeholder={field.toUpperCase()}
                    value={newAddress[field]}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, [field]: e.target.value })
                    }
                  />
                ))}
              </div>
            )}

            <Button
              variant="ghost"
              className="mt-4 text-orange-600"
              onClick={() => setUseNewAddress(!useNewAddress)}
            >
              {useNewAddress ? "Use saved address" : "+ Add new address"}
            </Button>
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-2xl p-6 border">
            <h2 className="text-xl font-semibold flex gap-2 mb-4">
              <CreditCard className="text-orange-600" />
              Payment Method
            </h2>

            {[
              { id: "online", label: "UPI / Card / Netbanking", icon: Wallet },
              { id: "cod", label: "Cash on Delivery", icon: Truck }
            ].map((method) => (
              <label
                key={method.id}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer ${paymentMethod === method.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200"
                  }`}
              >
                <input
                  type="radio"
                  checked={paymentMethod === method.id}
                  onChange={() => setPaymentMethod(method.id)}
                />
                <method.icon className="text-orange-600" />
                {method.label}
              </label>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-2xl p-6 border h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {items.length === 0 ? (
            <p className="text-center text-gray-500">Cart is empty</p>
          ) : (
            <>
              {/* ================= PROMO CODE ================= */}
              <div className="space-y-3 mb-6">
                <label className="text-sm font-medium text-gray-700 uppercase tracking-wider">Promo Code</label>
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME50"
                      className="flex-1 px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase font-bold"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={applyingCoupon || !couponCode}
                      className="bg-orange-600 hover:bg-orange-700 rounded-xl px-4"
                    >
                      {applyingCoupon ? "..." : "Apply"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-xl text-sm text-green-700 animate-in zoom-in-95 duration-200">
                    <div>
                      <span className="font-black tracking-widest">{appliedCoupon.code}</span>
                      <p className="text-[10px] uppercase font-bold text-green-600">Applied Successfully</p>
                    </div>
                    <button onClick={removeCoupon} className="text-xs font-bold text-red-500 hover:text-red-700 uppercase">Remove</button>
                  </div>
                )}
                {couponError && <p className="text-xs text-red-500 font-bold ml-1">{couponError}</p>}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between font-black text-2xl text-orange-700 pt-4 border-t border-dashed mt-4">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <Button
                className="w-full mt-8 bg-orange-600 hover:bg-orange-700 py-7 text-xl font-black rounded-2xl shadow-lg shadow-orange-200"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                <ShieldCheck className="mr-2 h-6 w-6" />
                {paymentMethod === "online" ? "PAY NOW" : "PLACE ORDER"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}



