import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Eye, Trash2, Loader2, Package } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useOrder } from "@/context/OrderContext";
import Skeleton from "@/components/ui/Skeleton";
import { toast } from "react-hot-toast";

export default function AdminOrders() {
  const { orders, loading, fetchAllOrders, updateOrderStatus } = useOrder();
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  useEffect(() => {
    fetchAllOrders();
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

  const filteredOrders = (orders || []).filter(order => {
    if (!order) return false;
    const matchesSearch =
      (order._id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" ||
      (order.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  if (loading && orders.length === 0) {
    return (
      <Layout>
        <Header title="All Orders" />
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <Skeleton className="h-10 w-full md:w-72 rounded-lg" />
          <Skeleton className="h-10 w-full md:w-56 rounded-lg" />
        </div>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="bg-orange-50 p-4 flex gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="p-4 border-t flex gap-4 items-center">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-8 w-full rounded-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-8 w-full rounded" />
            </div>
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header title="All Orders" />

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search order ID or customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-72 focus:ring-2 focus:ring-orange-500 outline-none"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-56 focus:ring-2 focus:ring-orange-500 outline-none"
        >
          <option>All Status</option>
          <option>Placed</option>
          <option>Confirmed</option>
          <option>Preparing</option>
          <option>Out for Delivery</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-orange-50 text-orange-600">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Restaurant</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-orange-50/40 transition">
                    <td className="p-4 font-medium">#{order._id.slice(-6)}</td>
                    <td className="p-4">
                      <div className="font-medium">{order.user?.name || "Guest"}</div>
                      <div className="text-xs text-gray-400">{order.user?.email}</div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-orange-600">
                      {order.restaurant?.name || "N/A"}
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between gap-2 max-w-[150px]">
                            <span className="truncate">{item.name}</span>
                            <span className="font-bold">x{item.qty}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-bold">₹{order.total}</td>
                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          disabled={order.status === "delivered" || updatingId === order._id}
                          className="border text-xs p-1 rounded bg-white"
                        >
                          <option value="placed">Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="packed">Packed</option>
                          <option value="out for delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </Layout>
  );
}

/* -------------------- */
/* Status Badge */
/* -------------------- */

function StatusBadge({ status }) {
  const styles = {
    placed: "bg-blue-100 text-blue-700",
    confirmed: "bg-cyan-100 text-cyan-700",
    preparing: "bg-yellow-100 text-yellow-700",
    packed: "bg-blue-100 text-blue-700",
    "out for delivery": "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const normalizedStatus = (status || "").toLowerCase();

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[normalizedStatus] || "bg-gray-100 text-gray-700"
        }`}
    >
      {normalizedStatus.replace(/_/g, " ") || "Unknown"}
    </span>
  );
}
