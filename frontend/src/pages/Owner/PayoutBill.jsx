import { useEffect, useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { IndianRupee, Printer, ArrowLeft, Loader2, Calendar, User, ShoppingBag, Receipt, Percent } from "lucide-react"
import { Card, CardContent } from "../../components/ui/card"
import Layout from "../../components/ownerlayout/Layout"
import api from "../../lib/api"
import { toast } from "react-hot-toast"

export default function PayoutBill() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [payout, setPayout] = useState(null)

    useEffect(() => {
        const fetchPayout = async () => {
            try {
                const res = await api.get(`/payouts/${id}`)
                setPayout(res.data)
            } catch (error) {
                toast.error("Failed to load payout details")
                navigate("/owner/payouts")
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchPayout()
    }, [id])

    if (loading) {
        return (
            <Layout>
                <div className="h-[80vh] flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
                </div>
            </Layout>
        )
    }

    if (!payout) return (
        <Layout>
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-gray-400 font-bold uppercase tracking-widest text-xs">
                <Receipt size={48} className="opacity-20 mb-4" />
                Payout statement not found
                <button onClick={() => navigate(-1)} className="text-orange-600 underline">Go Back</button>
            </div>
        </Layout>
    )

    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-8 px-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-orange-600 font-bold mb-8 transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Payouts
                </button>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100" id="payout-bill">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-8 text-white flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Receipt size={32} className="text-white" />
                                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Payout Statement</h1>
                            </div>
                            <p className="text-orange-100 font-medium opacity-80">Ref: {payout?._id?.toString().toUpperCase() || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-orange-100 text-[10px] font-black uppercase tracking-widest mb-1 font-bold">Net Settlement</p>
                            <h2 className="text-5xl font-black text-white">₹{payout?.amount !== undefined ? payout.amount.toLocaleString() : '0'}</h2>
                        </div>
                    </div>

                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 border-b border-gray-50 pb-12 text-black">
                            <div>
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Restaurant Details</h3>
                                <div className="space-y-1">
                                    <p className="text-xl font-black text-gray-800">{payout.restaurant?.name || 'N/A'}</p>
                                    <p className="text-sm text-gray-500">
                                        {payout.restaurant?.address ? (
                                            typeof payout.restaurant.address === 'object' ?
                                                `${payout.restaurant.address.street || ''}, ${payout.restaurant.address.city || ''}, ${payout.restaurant.address.state || ''} ${payout.restaurant.address.pincode || ''}` :
                                                payout.restaurant.address
                                        ) : 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-500">Phone: {payout.restaurant?.phone || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="md:text-right">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Settlement Info</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between md:justify-end gap-4">
                                        <span className="text-gray-400 text-sm">Requested:</span>
                                        <span className="font-bold text-gray-700">{payout.createdAt ? new Date(payout.createdAt).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between md:justify-end gap-4">
                                        <span className="text-gray-400 text-sm">Status:</span>
                                        <span className="font-black text-orange-600 uppercase text-xs tracking-widest">{payout.status}</span>
                                    </div>
                                    <div className="flex justify-between md:justify-end gap-4">
                                        <span className="text-gray-400 text-sm">Transaction ID:</span>
                                        <span className="font-mono font-bold text-blue-600 text-xs">{payout.transactionId || '---'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-black">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Gross Sales</p>
                                <p className="text-2xl font-black text-gray-800">
                                    ₹{useMemo(() => (payout.totalSales !== undefined ? payout.totalSales : (payout.amount / 0.7)), [payout.totalSales, payout.amount]).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Commission ({payout.commissionRate || 30}%)</p>
                                <p className="text-2xl font-black text-red-600">
                                    - ₹{useMemo(() => (payout.commissionAmount !== undefined ? payout.commissionAmount : (payout.amount / 0.7 * 0.3)), [payout.commissionAmount, payout.amount]).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Net Payout</p>
                                <p className="text-2xl font-black text-orange-600">
                                    ₹{useMemo(() => (payout.netAmount !== undefined ? payout.netAmount : payout.amount), [payout.netAmount, payout.amount]).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Order Details Table */}
                        <div className="mb-8">
                            <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                                <ShoppingBag className="text-orange-600" size={20} />
                                Included Orders
                            </h3>
                            <div className="overflow-x-auto text-black">
                                <table className="w-full">
                                    <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <tr>
                                            <th className="p-4 text-left">Order Date</th>
                                            <th className="p-4 text-left">Customer</th>
                                            <th className="p-4 text-right">Order Value</th>
                                            <th className="p-4 text-right">Comm. %</th>
                                            <th className="p-4 text-right">Earnings</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {useMemo(() => {
                                            if (!payout.orders || payout.orders.length === 0) {
                                                return (
                                                    <tr>
                                                        <td colSpan="5" className="p-8 text-center text-gray-300">No orders found in this payout.</td>
                                                    </tr>
                                                );
                                            }
                                            return payout.orders.map(order => (
                                                <tr key={order?._id} className="text-sm">
                                                    <td className="p-4 text-gray-600 font-medium">
                                                        {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="font-bold text-gray-800">{order?.user?.name || 'Customer'}</p>
                                                        <p className="text-[10px] text-gray-400">ID: {order?._id?.slice(-8) || 'N/A'}</p>
                                                    </td>
                                                    <td className="p-4 text-right font-medium text-gray-700">₹{(order?.subtotal || 0).toLocaleString()}</td>
                                                    <td className="p-4 text-right text-red-400">-{payout.commissionRate || 30}%</td>
                                                    <td className="p-4 text-right font-black text-orange-600">₹{(order?.subtotal ? (order.subtotal * 0.7) : 0).toLocaleString()}</td>
                                                </tr>
                                            ));
                                        }, [payout.orders, payout.commissionRate])}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {payout.adminNote && (
                            <div className="p-6 bg-red-50 rounded-2xl border border-red-100 mb-8">
                                <h4 className="text-[10px] font-black text-red-800 uppercase tracking-widest mb-2">Admin Note</h4>
                                <p className="text-sm text-red-700">"{payout.adminNote}"</p>
                            </div>
                        )}

                        <div className="flex justify-between items-center bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
                            <div className="text-xs text-gray-400 font-medium">
                                This is a computer-generated statement with 30% platform service fee applied.
                            </div>
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-orange-700 transition active:scale-95"
                            >
                                <Printer size={18} /> Print Statement
                            </button>
                        </div>
                    </CardContent>
                </div>
            </div>
        </Layout>
    )
}
