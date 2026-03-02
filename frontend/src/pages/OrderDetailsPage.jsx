import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  PackageCheck,
  ShieldCheck,
  Smartphone
} from "lucide-react";
import { useOrder } from "@/context/OrderContext";
import OrderTrackerMap from "@/components/orders/OrderTrackerMap";
import Skeleton from "@/components/ui/Skeleton";
import { toast } from "react-hot-toast";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { order, getOrderById, loading } = useOrder();

  useEffect(() => {
    getOrderById(id);
  }, [id]);

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-orange-50 pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 space-y-6">
          <Skeleton className="h-6 w-32 mb-6" />
          <Skeleton className="h-64 w-full rounded-2xl mb-8" />

          <div className="bg-white rounded-2xl shadow p-6 space-y-8">
            <div className="flex justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>

            <Skeleton className="h-6 w-48" />

            <div className="space-y-4">
              <Skeleton className="h-6 w-24 mb-3" />
              <div className="space-y-3">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-orange-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Back to orders
        </button>

        {/* Tracking Map - Show if not delivered or cancelled */}
        {order.status !== "delivered" && order.status !== "cancelled" && (
          <div className="mb-8">
            <OrderTrackerMap order={order} />
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-6">

          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-orange-800">
                {order.restaurant?.name}
              </h1>
              <p className="text-sm text-orange-900/60">
                Order ID: {order._id}
              </p>
            </div>

            <span className="rounded-full bg-orange-100 text-orange-700 px-4 py-1 text-sm font-medium">
              {order.status.replaceAll("_", " ")}
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 text-orange-900/70">
            <Clock size={18} />
            {new Date(order.createdAt).toLocaleString()}
          </div>

          {/* Items */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Items
            </h3>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 border rounded-lg p-3"
                >
                  <img
                    src={
                      item.image?.url ||
                      item.menuItem?.images?.[0]?.url ||
                      "https://placehold.co/100x100?text=Food"
                    }
                    className="h-16 w-16 rounded object-cover"
                  />

                  <div className="flex-1">
                    <h4 className="font-medium">
                      {item.name}
                    </h4>
                    <p className="text-sm text-orange-900/60">
                      Qty: {item.qty}
                    </p>

                    {item.addons?.length > 0 && (
                      <p className="text-sm text-orange-600">
                        Addons:{" "}
                        {item.addons.map(a => a.name).join(", ")}
                      </p>
                    )}
                  </div>

                  <div className="font-semibold">
                    ₹{item.price * item.qty}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bill */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{order.deliveryFee}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>

          {/* Address */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">
              Delivery Address
            </h3>
            <div className="flex items-start gap-2 text-orange-900/70">
              <MapPin size={18} />
              <div>
                <p>{order.deliveryAddress.street}</p>
                <p>
                  {order.deliveryAddress.city},{" "}
                  {order.deliveryAddress.state} -{" "}
                  {order.deliveryAddress.pincode}
                </p>
                <p>📞 {order.deliveryAddress.phone}</p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="border-t pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <PackageCheck size={18} />
              <span className="capitalize text-sm font-medium">
                Payment: {order.paymentMethod} ({order.paymentStatus})
              </span>
            </div>
            {order.status === "out for delivery" && (
              <div className="flex flex-col items-center gap-2 p-4 bg-orange-600 text-white rounded-xl shadow-lg border-2 border-orange-400 animate-pulse">
                <Smartphone size={24} />
                <p className="text-xs font-bold uppercase tracking-wider opacity-80 text-white">Share this OTP with Rider</p>
                <span className="text-3xl font-extrabold tracking-widest text-white">{order.deliveryOtp}</span>
              </div>
            )}
            {(order.status === "placed" || order.status === "confirmed" || order.status === "preparing" || order.status === "packed") && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                <ShieldCheck size={16} />
                <span className="text-xs font-bold uppercase tracking-tight">OTP Verification Required</span>
              </div>
            )}
            {order.status === "delivered" && (
              <button
                onClick={() => navigate(`/restaurants/${order.restaurant._id}#reviews`)}
                className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl shadow-lg hover:bg-orange-700 transition-all font-bold"
              >
                <Star size={18} />
                Rate Restaurant
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}