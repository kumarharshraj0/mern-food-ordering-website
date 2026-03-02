import { useEffect, useState, useCallback, useMemo } from "react"
import { Link } from "react-router-dom"
import { IndianRupee, Clock, History, Send, Loader2, AlertCircle, CheckCircle2, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Skeleton from "@/components/ui/Skeleton"
import Header from "@/components/Header"
import Layout from "@/components/ownerlayout/Layout"
import api from "@/lib/api"
import { toast } from "react-hot-toast"

export default function OwnerPayouts() {
    const [loading, setLoading] = useState(true)
    const [requesting, setRequesting] = useState(false)
    const [earnings, setEarnings] = useState({ availableBalance: 0, pendingAmount: 0 })
    const [history, setHistory] = useState([])

    const adminCommission = useMemo(() => {
        const total = earnings?.totalSales || 0;
        const available = earnings?.availableBalance || 0;
        return (total - available).toLocaleString()
    }, [earnings?.totalSales, earnings?.availableBalance])

    const historyItems = useMemo(() => {
        return history.map(item => (
            <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-6 text-sm text-gray-600 font-medium">
                    {item?.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    }) : 'N/A'}
                </td>
                <td className="p-6 font-bold text-gray-800">₹{(item?.amount || 0).toLocaleString()}</td>
                <td className="p-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status === 'paid' ? 'bg-green-100 text-green-700' :
                        item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                        {item.status === 'paid' && <CheckCircle2 size={12} />}
                        {item.status === 'rejected' && <AlertCircle size={12} />}
                        {item.status === 'pending' && <Clock size={12} />}
                        {item.status}
                    </span>
                </td>
                <td className="p-6 text-xs text-gray-400 font-mono">
                    {item.transactionId || '---'}
                </td>
                <td className="p-6 text-center">
                    <Link
                        to={`/owner/payout/${item._id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-orange-600 rounded-lg text-xs font-black uppercase tracking-tighter hover:bg-orange-600 hover:text-white transition shadow-sm border border-orange-100"
                    >
                        <FileText size={14} /> View Bill
                    </Link>
                </td>
            </tr>
        ))
    }, [history])

    const fetchPayoutData = useCallback(async () => {
        try {
            const [earningRes, historyRes] = await Promise.all([
                api.get("/payouts/earnings"),
                api.get("/payouts/history")
            ])

            setEarnings(earningRes.data)
            setHistory(historyRes.data)
        } catch (error) {
            console.error("Error fetching payout data:", error)
            toast.error("Failed to load payout data")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPayoutData()
    }, [fetchPayoutData])

    const handleRequestPayout = async () => {
        if (earnings.availableBalance <= 0) {
            return toast.error("No balance available to withdraw")
        }

        setRequesting(true)
        try {
            await api.post("/payouts/request")
            toast.success("Payout request sent!")
            fetchPayoutData()
        } catch (error) {
            toast.error(error.response?.data?.message || "Request failed")
        } finally {
            setRequesting(false)
        }
    }

    if (loading) {
        return (
            <Layout>
                <Header title="Bill Payouts" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="h-64">
                        <CardContent className="p-8 space-y-6">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-12 w-48" />
                            <Skeleton className="h-16 w-full rounded-xl" />
                            <Skeleton className="h-12 w-full rounded-xl" />
                        </CardContent>
                    </Card>
                    <Card className="h-64">
                        <CardContent className="p-8 space-y-6 flex flex-col justify-center">
                            <div className="flex gap-4">
                                <Skeleton className="h-14 w-14 rounded-2xl" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-8 w-32" />
                                </div>
                            </div>
                            <Skeleton className="h-12 w-full rounded-xl" />
                        </CardContent>
                    </Card>
                </div>
                <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                    <Skeleton className="h-8 w-48 mb-6" />
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-4 items-center border-t pt-4">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-10 w-32 rounded-lg" />
                        </div>
                    ))}
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <Header title="Bill Payouts" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-orange-500 to-orange-700 text-white border-none shadow-xl">
                    <CardContent className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-orange-100 font-medium mb-1 uppercase tracking-wider text-[10px]">Net Available Balance</p>
                                <h2 className="text-5xl font-black">₹{(earnings?.availableBalance || 0).toLocaleString()}</h2>
                            </div>
                            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                                <IndianRupee size={32} />
                            </div>
                        </div>

                        <div className="space-y-3 mb-6 bg-black/10 p-4 rounded-xl">
                            <div className="flex justify-between text-xs font-medium">
                                <span className="text-orange-100">Total Sales (GMV)</span>
                                <span>₹{earnings.totalSales?.toLocaleString() || '0'}</span>
                            </div>
                            <div className="flex justify-between text-xs font-medium border-t border-white/10 pt-2">
                                <span className="text-orange-200">
                                    - ₹{adminCommission}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleRequestPayout}
                            disabled={requesting || earnings.availableBalance <= 0}
                            className="w-full flex items-center justify-center gap-2 bg-white text-orange-700 font-bold py-4 rounded-xl shadow-lg hover:bg-orange-50 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                        >
                            {requesting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                            {requesting ? "Sending Request..." : "Request Payout Now"}
                        </button>
                    </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-xl">
                    <CardContent className="p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                                <Clock size={32} />
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium text-xs uppercase tracking-wider">In-Settlement Balance</p>
                                <h2 className="text-3xl font-bold text-gray-800">₹{(earnings?.pendingAmount || 0).toLocaleString()}</h2>
                            </div>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 border-dashed">
                            <p className="text-xs text-orange-800 leading-relaxed font-medium">
                                * Payouts are usually processed within 24-48 working hours after request.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                        <History size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Payout History</h2>
                </div>

                {history.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                                <tr>
                                    <th className="p-6">Requested Date</th>
                                    <th className="p-6">Amount</th>
                                    <th className="p-6">Status</th>
                                    <th className="p-6">Transaction ID</th>
                                    <th className="p-6 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {historyItems}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-20 text-center">
                        <div className="inline-block p-6 bg-gray-50 rounded-full mb-4 text-gray-200">
                            <History size={64} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-400">No payout history found</h3>
                        <p className="text-sm text-gray-300">Your future payouts will appear here.</p>
                    </div>
                )}
            </div>
        </Layout>
    )
}
