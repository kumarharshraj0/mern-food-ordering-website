import { useEffect, useState } from "react";
import {
  Package,
  MapPin,
  Clock,
  ChevronRight,
  Star,
} from "lucide-react";
import { useOrder } from "@/context/OrderContext";
import { useNavigate } from "react-router-dom";
import Skeleton from "@/components/ui/Skeleton";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("active");

  const { orders, fetchMyOrders, loading } = useOrder();
  const navigate = useNavigate();

  /* ----------------------------------
     FETCH ORDERS
  -----------------------------------*/
  useEffect(() => {
    fetchMyOrders();
  }, []);

  /* ----------------------------------
     FILTER ORDERS
  -----------------------------------*/
  const activeOrders = orders.filter((o) =>
    ["placed", "confirmed", "preparing", "packed", "out for delivery"].includes(o.status)
  );

  const orderHistory = orders.filter(
    (o) => o.status === "delivered"
  );

  const displayOrders =
    activeTab === "active" ? activeOrders : orderHistory;

  /* ----------------------------------
     STATUS STYLES
  -----------------------------------*/
  const statusStyles = {
    placed: "bg-gray-100 text-gray-700 border-gray-200",
    confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    preparing: "bg-orange-100 text-orange-700 border-orange-200",
    packed: "bg-cyan-100 text-cyan-700 border-cyan-200",
    "out for delivery": "bg-orange-200 text-orange-800 border-orange-300",
    delivered: "bg-green-100 text-green-700 border-green-200",
  };

  const statusLabel = {
    placed: "Placed",
    confirmed: "Confirmed",
    preparing: "Preparing",
    packed: "Packed",
    "out for delivery": "Out for delivery",
    delivered: "Delivered",
  };

  /* ----------------------------------
     LOADING STATE
  -----------------------------------*/
  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 pt-24 pb-16">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="flex gap-6 border-b border-orange-200 mb-8 pb-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl bg-white p-6 shadow flex gap-6">
                <Skeleton className="h-40 w-48 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-4 w-40" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-24 rounded-md" />
                      <Skeleton className="h-8 w-24 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 md:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-700 mb-2">
            My Orders
          </h1>
          <p className="text-orange-900/70">
            Track your current orders and view order history
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-6 border-b border-orange-200">
          {["active", "history"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-medium relative transition-colors ${activeTab === tab
                ? "text-orange-600"
                : "text-orange-900/60 hover:text-orange-700"
                }`}
            >
              {tab === "active" ? "Active Orders" : "Order History"}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
              )}
            </button>
          ))}
        </div>

        {/* Orders */}
        {displayOrders.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow">
            <Package className="mx-auto mb-4 h-14 w-14 text-orange-400" />
            <h3 className="text-xl font-semibold text-orange-800 mb-2">
              No orders found
            </h3>
            <p className="text-orange-900/60">
              You don’t have any orders in this section
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayOrders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg"
              >
                <div className="flex flex-col md:flex-row gap-6">

                  {/* Image */}
                  <div className="h-40 w-full md:w-48 overflow-hidden rounded-lg bg-orange-100">
                    <img
                      src={
                        order.items?.[0]?.image?.url ||
                        order.items?.[0]?.menuItem?.images?.[0]?.url ||
                        "https://placehold.co/400x300?text=Food+Order"
                      }
                      alt={order.restaurant?.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-orange-900">
                          {order.restaurant?.name}
                        </h3>
                        <span
                          className={`inline-block mt-1 rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[order.status]
                            }`}
                        >
                          {statusLabel[order.status]}
                        </span>
                      </div>

                      <div className="text-xl font-bold text-orange-700">
                        ₹{order.total}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mb-4 text-sm text-orange-900/70">
                      {order.items.map((item) => (
                        <div key={item._id}>
                          {item.qty}× {item.name}
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                      <div className="flex items-center gap-4 text-orange-900/60">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(order.createdAt).toLocaleString()}
                        </div>

                        {order.status === "out for delivery" && (
                          <div className="flex items-center gap-1 text-orange-600">
                            <MapPin className="h-4 w-4" />
                            Track Order
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {order.status === "delivered" && (
                          <>
                            <button
                              onClick={() => navigate(`/restaurants/${order.restaurant._id}#reviews`)}
                              className="rounded-md border border-orange-300 px-3 py-1 text-orange-600 hover:bg-orange-100">
                              <Star className="inline h-4 w-4 mr-1" />
                              Rate
                            </button>

                            <button className="rounded-md bg-orange-600 px-4 py-1 text-white hover:bg-orange-700">
                              Reorder
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => navigate(`/orders/${order._id}`)}

                          className="rounded-md border border-orange-300 px-3 py-1 text-orange-600 hover:bg-orange-100">
                          Details
                          <ChevronRight className="inline h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
