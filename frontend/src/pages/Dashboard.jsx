import React, { useEffect, useState } from "react";
import { ShoppingBag, IndianRupee, Store, Users, Loader2 } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import { Card, CardContent } from "../components/ui/card";
import Header from "../components/Header";
import Layout from "@/components/layout/Layout";
import { useOrder } from "@/context/OrderContext";
import { useRestaurant } from "@/context/RestaurantContext";

export default function Dashboard() {
  const { getAdminStats } = useOrder();
  const { restaurants, getRestaurants } = useRestaurant();
  const [stats, setStats] = useState({
    ordersCount: 0,
    totalSales: 0,
    deliveryBoyCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        if (isMounted) {
          setStats(data || { ordersCount: 0, totalSales: 0, deliveryBoyCount: 0 });
          await getRestaurants();
        }
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchStats();
    return () => { isMounted = false };
  }, [getAdminStats, getRestaurants]);

  if (loading) {
    return (
      <Layout>
        <Header title="Admin Dashboard" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="flex gap-4 items-center p-6">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header title="Admin Dashboard" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat icon={ShoppingBag} label="Total Orders" value={stats?.ordersCount || 0} />
        <Stat icon={IndianRupee} label="Revenue" value={`₹${(stats?.totalSales || 0).toLocaleString()}`} />
        <Stat icon={Store} label="Restaurants" value={restaurants?.length || 0} />
        <Stat icon={Users} label="Delivery Boys" value={stats?.deliveryBoyCount || 0} />
      </div>
    </Layout>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <Card>
      <CardContent className="flex gap-4 items-center">
        <div className="p-3 bg-orange-100 rounded-xl">
          <Icon className="text-orange-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
