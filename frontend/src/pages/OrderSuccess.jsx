import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useOrder } from "@/context/OrderContext";

export default function OrderSuccess() {
  const { id } = useParams();
  const { order, getOrderById, loading } = useOrder();

  useEffect(() => {
    getOrderById(id);
  }, [id]);

  if (loading || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading order...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 pt-24 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow">

        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-green-600">
            Order Placed Successfully 🎉
          </h1>
          <p className="text-gray-600">
            Order ID: <span className="font-semibold">{order._id}</span>
          </p>
        </div>

        {/* ITEMS */}
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{item.qty} × {item.name}</span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}
        </div>

        <hr className="my-4" />

        {/* TOTAL */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>₹{order.deliveryFee}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-orange-600">₹{order.total}</span>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="mt-6">
          <h3 className="font-semibold mb-1">Delivery Address</h3>
          <p className="text-sm text-gray-600">
            {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
            {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex gap-3">
          <Link
            to="/orders"
            className="flex-1 text-center bg-orange-600 text-white py-2 rounded-lg"
          >
            View My Orders
          </Link>

          <Link
            to="/"
            className="flex-1 text-center border border-orange-600 text-orange-600 py-2 rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
