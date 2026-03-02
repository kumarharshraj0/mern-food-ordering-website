import { useEffect, useState } from "react"
import { ShoppingBag, IndianRupee, Store, Utensils, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/Header"
import Layout from "@/components/ownerlayout/Layout"
import { useOrder } from "@/context/OrderContext"
import { useRestaurant } from "@/context/RestaurantContext"
import { useMenu } from "@/context/MenuContext"
import Skeleton from "@/components/ui/Skeleton"
import { Switch } from "@/components/ui/Switch"
import { toast } from "react-hot-toast"

export default function OwnerDashboard() {
    const { orders, fetchResturantOrders } = useOrder()
    const { getmyResturants, toggleRestaurantStatus } = useRestaurant()
    const { menu, getMenu } = useMenu()

    const [myRestaurant, setMyRestaurant] = useState(null)
    const [isToggling, setIsToggling] = useState(false)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalEarnings: 0,
        restaurantCount: 0,
        menuItemsCount: 0
    })

    useEffect(() => {
        let isMounted = true;
        const loadDashboardData = async () => {
            if (isMounted) setLoading(true)
            try {
                // Fetch restaurants first to get the ID
                const myRestaurants = await getmyResturants();

                if (!isMounted) return;

                const restaurantCount = myRestaurants?.length || 0;
                setStats(prev => ({ ...prev, restaurantCount }));

                if (restaurantCount > 0) {
                    const firstRest = myRestaurants[0];
                    setMyRestaurant(firstRest);
                    // Fetch menu and orders in parallel for efficiency
                    await Promise.all([
                        getMenu({ restaurant: firstRest._id }),
                        fetchResturantOrders()
                    ]);
                } else {
                    // Even if no restaurant, try fetching orders (just in case)
                    await fetchResturantOrders();
                }

            } catch (error) {
                console.error("Error loading dashboard data:", error)
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        loadDashboardData()
        return () => { isMounted = false };
    }, [getmyResturants, getMenu, fetchResturantOrders])

    const handleToggleStatus = async () => {
        if (!myRestaurant?._id) return
        setIsToggling(true)
        try {
            const res = await toggleRestaurantStatus(myRestaurant._id)
            setMyRestaurant(prev => ({ ...prev, isOpen: res.data?.isOpen }))
            toast.success(res.data?.message || "Status updated")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status")
        } finally {
            setIsToggling(false)
        }
    }

    useEffect(() => {
        if (Array.isArray(orders)) {
            const totalEarnings = orders
                .filter(ord => ord && ord.status !== 'cancelled')
                .reduce((sum, ord) => sum + (Number(ord.total) || 0), 0)

            setStats(prev => ({
                ...prev,
                totalOrders: orders.length,
                totalEarnings
            }))
        }
    }, [orders])

    useEffect(() => {
        if (Array.isArray(menu)) {
            setStats(prev => ({
                ...prev,
                menuItemsCount: menu.length
            }))
        }
    }, [menu])

    if (loading) {
        return (
            <Layout>
                <Header title="Owner Dashboard" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
                <div className="bg-white rounded-xl shadow p-6 space-y-4">
                    <Skeleton className="h-8 w-48 mb-4" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <Header title="Owner Dashboard" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Stat icon={ShoppingBag} label="Total Orders" value={stats.totalOrders || 0} />
                <Stat icon={IndianRupee} label="Total Earnings" value={`₹${(stats.totalEarnings || 0).toLocaleString()}`} />
                <Card>
                    <CardContent className="flex gap-4 items-center p-6 text-gray-800 justify-between">
                        <div className="flex gap-4 items-center">
                            <div className="p-3 bg-orange-100 rounded-xl">
                                <Store className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Status</p>
                                <p className={`text-lg font-bold ${myRestaurant?.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                                    {myRestaurant?.isOpen ? "OPEN" : "CLOSED"}
                                </p>
                            </div>
                        </div>
                        <Switch
                            checked={!!myRestaurant?.isOpen}
                            onCheckedChange={handleToggleStatus}
                            disabled={isToggling || !myRestaurant}
                        />
                    </CardContent>
                </Card>
                <Stat icon={Utensils} label="Menu Items" value={stats.menuItemsCount || 0} />
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4 text-orange-600 uppercase tracking-wider">Recent Orders</h2>
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    {orders && orders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-orange-50 text-orange-600">
                                    <tr>
                                        <th className="p-4">Order ID</th>
                                        <th className="p-4">Customer</th>
                                        <th className="p-4">Total</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(0, 5).map(order => (
                                        <tr key={order._id} className="border-b hover:bg-orange-50/40">
                                            <td className="p-4 font-medium">#{order._id?.slice(-6) || "N/A"}</td>
                                            <td className="p-4">{order.user?.name || "Guest"}</td>
                                            <td className="p-4">₹{order.total || 0}</td>
                                            <td className="p-4 capitalize">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {order.status || "Unknown"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6">
                            <p className="text-gray-500">No recent orders to show.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}

function Stat({ icon: Icon, label, value }) {
    return (
        <Card>
            <CardContent className="flex gap-4 items-center p-6 text-gray-800">
                <div className="p-3 bg-orange-100 rounded-xl">
                    <Icon className="text-orange-600" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </CardContent>
        </Card>
    )
}
