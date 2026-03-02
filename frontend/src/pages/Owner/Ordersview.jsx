import { useEffect, useState } from "react";
import { useOrder } from "@/context/OrderContext";
import Layout from "@/components/ownerlayout/Layout";
import Skeleton from "@/components/ui/Skeleton";
import { toast } from "react-hot-toast";

const RestaurantOrders = () => {
  const {
    orders,
    loading,
    fetchResturantOrders,
    updateOrderStatus
  } = useOrder();

  const [updatingId, setUpdatingId] = useState(null);

  /* ================= FETCH REAL RESTAURANT ORDERS ================= */
  useEffect(() => {
    fetchResturantOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    const tid = toast.loading("Updating status...");
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success("Status updated!", { id: tid });
    } catch (err) {
      toast.error("Failed to update status", { id: tid });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && (!orders || orders.length === 0)) {
    return (
      <Layout>
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-4 flex gap-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-20" />
            </div>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="p-4 border-t flex gap-4 items-center">
                <Skeleton className="h-6 w-24" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-12 w-48" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-32 rounded" />
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-6">Restaurant Orders</h2>

        {!orders || orders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 font-medium text-lg">No orders found for your restaurant yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-orange-50/50 text-orange-600 border-b">
                  <tr>
                    <th className="p-4 font-semibold">Order ID</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Items</th>
                    <th className="p-4 font-semibold">Total</th>
                    <th className="p-4 font-semibold text-center">Status</th>
                    <th className="p-4 font-semibold text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order?._id || Math.random()} className="hover:bg-orange-50/10 transition-colors">
                      <td className="p-4 font-medium text-gray-700">
                        #{order?._id?.slice(-6) || "N/A"}
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-gray-900">{order?.user?.name || "Guest"}</div>
                        <div className="text-xs text-gray-500">{order?.user?.phone || "No phone"}</div>
                      </td>

                      <td className="p-4">
                        <ul className="space-y-1">
                          {(order?.items || []).map((item, idx) => (
                            <li key={idx} className="flex items-center justify-between text-sm gap-4">
                              <span className="text-gray-600 truncate max-w-[150px]">{item.name || "Item"}</span>
                              <span className="font-bold text-orange-600 shrink-0">x{item.qty || 0}</span>
                            </li>
                          ))}
                        </ul>
                      </td>

                      <td className="p-4 font-bold text-gray-900">
                        ₹{(order?.total || 0).toLocaleString()}
                      </td>

                      <td className="p-4 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order?.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order?.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                          {(order?.status || "Unknown").replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <select
                          value={order?.status || "placed"}
                          onChange={(e) =>
                            handleStatusUpdate(order?._id, e.target.value)
                          }
                          disabled={(order?.status === "delivered") || (updatingId === order?._id) || !order?._id}
                          className="w-full max-w-[140px] border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white hover:border-orange-300 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="placed">Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="packed">Packed</option>
                          <option value="out for delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RestaurantOrders;
