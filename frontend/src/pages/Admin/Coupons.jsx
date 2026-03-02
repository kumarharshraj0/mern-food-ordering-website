import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Ticket, Plus, Trash2, Calendar, Tag, CreditCard, Users } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Skeleton from "@/components/ui/Skeleton";
import { toast } from "react-hot-toast";
import api from "@/lib/api";

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: "",
        maxDiscount: "",
        expiryDate: "",
        usageLimit: 100,
        description: ""
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await api.get("/coupons");
            setCoupons(res.data);
        } catch (err) {
            toast.error("Failed to fetch coupons");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;
        try {
            await api.delete(`/coupons/${id}`);
            toast.success("Coupon deleted");
            setCoupons(coupons.filter(c => c._id !== id));
        } catch (err) {
            toast.error("Failed to delete coupon");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post("/coupons", formData);
            toast.success("Coupon created successfully!");
            setShowModal(false);
            fetchCoupons();
            setFormData({
                code: "",
                discountType: "percentage",
                discountValue: "",
                minOrderAmount: "",
                maxDiscount: "",
                expiryDate: "",
                usageLimit: 100,
                description: ""
            });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create coupon");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <Header title="Manage Coupons" />
                <Button
                    onClick={() => setShowModal(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white gap-2 rounded-xl"
                >
                    <Plus className="h-4 w-4" /> Create Coupon
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard icon={Ticket} label="Total Coupons" value={coupons.length} color="bg-blue-500" />
                <StatCard icon={Users} label="Top Code Usage" value={coupons.reduce((a, b) => a + (b.usedCount || 0), 0)} color="bg-green-500" />
                <StatCard icon={Calendar} label="Active Codes" value={coupons.filter(c => new Date(c.expiryDate) > new Date()).length} color="bg-orange-500" />
            </div>

            <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-orange-50/50 text-orange-700">
                                <tr>
                                    <th className="p-4 uppercase text-xs font-black tracking-widest">Code</th>
                                    <th className="p-4 uppercase text-xs font-black tracking-widest">Discount</th>
                                    <th className="p-4 uppercase text-xs font-black tracking-widest">Rules</th>
                                    <th className="p-4 uppercase text-xs font-black tracking-widest">Usage</th>
                                    <th className="p-4 uppercase text-xs font-black tracking-widest">Expires</th>
                                    <th className="p-4 uppercase text-xs font-black tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan="6" className="p-4"><Skeleton className="h-8 w-full" /></td>
                                        </tr>
                                    ))
                                ) : coupons.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-12 text-center text-gray-500 font-medium">No coupons found. Start by creating one!</td>
                                    </tr>
                                ) : (
                                    coupons.map((coupon) => (
                                        <tr key={coupon._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-lg tracking-tight text-gray-900">{coupon.code}</span>
                                                    <span className="text-xs text-gray-400 font-medium truncate max-w-[150px]">{coupon.description || "No description"}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-orange-100 text-orange-800">
                                                    {coupon.discountType === "percentage" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-xs space-y-1">
                                                    <p className="font-bold text-gray-600">Min Order: <span className="text-orange-600">₹{coupon.minOrderAmount}</span></p>
                                                    {coupon.maxDiscount && <p className="font-bold text-gray-600">Max Cap: <span className="text-orange-600">₹{coupon.maxDiscount}</span></p>}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 mb-1">
                                                        <span>{coupon.usedCount} used</span>
                                                        <span>Limit: {coupon.usageLimit}</span>
                                                    </div>
                                                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-orange-500 rounded-full"
                                                            style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-sm font-bold ${new Date(coupon.expiryDate) < new Date() ? "text-red-500" : "text-gray-600"}`}>
                                                    {new Date(coupon.expiryDate).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => handleDelete(coupon._id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* CREATE MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !submitting && setShowModal(false)}></div>
                    <div className="relative bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-orange-50">
                            <h3 className="text-xl font-black text-orange-900 tracking-tight flex items-center gap-2">
                                <Tag className="h-5 w-5" /> New Coupon
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-orange-400 hover:text-orange-600 font-bold">Close</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div>
                                <label className="block text-xs font-black uppercase text-gray-400 mb-1.5 ml-1">Coupon Code</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. FOODHUB50"
                                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 font-bold focus:ring-2 focus:ring-orange-500 uppercase"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-400 mb-1.5 ml-1">Type</label>
                                    <select
                                        className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 font-bold focus:ring-2 focus:ring-orange-500"
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-400 mb-1.5 ml-1">Discount Value</label>
                                    <input
                                        required
                                        type="number"
                                        placeholder={formData.discountType === "percentage" ? "e.g. 50" : "e.g. 100"}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 font-bold focus:ring-2 focus:ring-orange-500"
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-400 mb-1.5 ml-1">Min Order Amount</label>
                                    <input
                                        required
                                        type="number"
                                        placeholder="e.g. 299"
                                        className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 font-bold focus:ring-2 focus:ring-orange-500"
                                        value={formData.minOrderAmount}
                                        onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-400 mb-1.5 ml-1">Max Discount (Cap)</label>
                                    <input
                                        type="number"
                                        placeholder="Leave empty for none"
                                        className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 font-bold focus:ring-2 focus:ring-orange-500"
                                        value={formData.maxDiscount}
                                        onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-400 mb-1.5 ml-1">Expiry Date</label>
                                    <input
                                        required
                                        type="date"
                                        className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 font-bold focus:ring-2 focus:ring-orange-500"
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-400 mb-1.5 ml-1">Usage Limit</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 font-bold focus:ring-2 focus:ring-orange-500"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase text-gray-400 mb-1.5 ml-1">Description</label>
                                <textarea
                                    placeholder="Tell users what this code does..."
                                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 font-bold focus:ring-2 focus:ring-orange-500 h-20 resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-6 rounded-2xl shadow-lg shadow-orange-100 mt-2"
                            >
                                {submitting ? "Creating..." : "SAVE COUPON"}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white">
            <CardContent className="p-6 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{label}</p>
                    <p className="text-2xl font-black text-gray-900 leading-tight">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}
