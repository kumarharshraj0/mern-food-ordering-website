import React, { useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useOrder } from '@/context/OrderContext';
import Layout from '@/components/ownerlayout/Layout';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, TrendingUp, DollarSign, Package, PieChart as PieChartIcon } from 'lucide-react';

export default function Analytics() {
    const { orders, loading } = useOrder();

    const analyticsData = useMemo(() => {
        if (!orders || orders.length === 0) return null;

        // 1. Daily Revenue & Orders
        const dailyDataMap = {};
        const statusMap = {};
        const itemMap = {};

        orders.forEach(order => {
            // Date formatting (YYYY-MM-DD)
            const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            if (!dailyDataMap[date]) {
                dailyDataMap[date] = { date, revenue: 0, count: 0 };
            }

            if (order.status !== 'cancelled') {
                dailyDataMap[date].revenue += order.total || 0;
            }
            dailyDataMap[date].count += 1;

            // Status Distribution
            statusMap[order.status] = (statusMap[order.status] || 0) + 1;

            // Top Items (if items exist in order)
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    const name = item.menuItem?.name || 'Unknown Item';
                    itemMap[name] = (itemMap[name] || 0) + (item.quantity || 1);
                });
            }
        });

        const dailyData = Object.values(dailyDataMap).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7);

        const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));
        const COLORS = ['#f97316', '#22c55e', '#ef4444', '#eab308', '#6366f1'];

        const topItemsData = Object.entries(itemMap)
            .map(([name, quantity]) => ({ name, quantity }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        return { dailyData, statusData, topItemsData, COLORS };
    }, [orders]);

    if (loading) {
        return (
            <Layout>
                <div className="h-[80vh] flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
                </div>
            </Layout>
        );
    }

    if (!analyticsData) {
        return (
            <Layout>
                <Header title="Analytics" />
                <div className="bg-white rounded-xl shadow p-12 text-center">
                    <PieChartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700">No Data Available</h3>
                    <p className="text-gray-500">Wait for your first orders to see analytics here.</p>
                </div>
            </Layout>
        );
    }

    const { dailyData, statusData, topItemsData, COLORS } = analyticsData;

    return (
        <Layout>
            <Header title="Owner Analytics" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* REVENUE TREND */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-orange-600" />
                            Revenue Trend (Last 7 Days)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dailyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`₹${value}`, 'Revenue']}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* ORDER STATUS DISTRIBUTION */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Package className="w-5 h-5 text-orange-600" />
                            Order Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* TOP SELLING ITEMS */}
                <Card className="shadow-sm lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-orange-600" />
                            Top Selling Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topItemsData} layout="vertical" margin={{ left: 30, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#555" fontSize={12} width={150} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#fff1f2' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="quantity" fill="#f97316" radius={[0, 8, 8, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>
        </Layout>
    );
}
