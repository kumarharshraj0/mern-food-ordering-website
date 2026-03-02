import { useEffect, useState } from "react"
import { IndianRupee, Clock, History, CheckCircle2, XCircle, ExternalLink, Loader2, Search, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Skeleton from "@/components/ui/Skeleton"
import Header from "@/components/Header"
import Layout from "@/components/layout/Layout"
import api from "@/lib/api"
import { toast } from "react-hot-toast"

export default function AdminPayouts() {
    const [loading, setLoading] = useState(true)
    const [payouts, setPayouts] = useState([])
    const [filter, setFilter] = useState("pending") // pending, paid, rejected, all
    const [searchTerm, setSearchTerm] = useState("")

    // Modal state
    const [showModal, setShowModal] = useState(false)
    const [selectedPayout, setSelectedPayout] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [transactionId, setTransactionId] = useState("")
    const [adminNote, setAdminNote] = useState("")

    const fetchAllPayouts = async () => {
        try {
            const res = await api.get("/payouts/admin/all")
            setPayouts(res.data)
        } catch (error) {
            console.error("Error fetching payouts:", error)
            toast.error("Failed to load payout requests")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAllPayouts()
    }, [])

    const handleUpdateStatus = async (status) => {
        if (status === 'paid' && !transactionId) {
            return toast.error("Please enter a transaction ID")
        }

        setProcessing(true)
        try {
            await api.put(`/payouts/admin/${selectedPayout._id}`, {
                status,
                transactionId,
                adminNote
            })

            toast.success(`Payout marked as ${status}`)
            setShowModal(false)
            setSelectedPayout(null)
            setTransactionId("")
            setAdminNote("")
            fetchAllPayouts()
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed")
        } finally {
            setProcessing(false)
        }
    }

    const filteredPayouts = payouts.filter(p => {
        const matchesSearch = p.restaurant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.owner?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === "all" || p.status === filter;
        return matchesSearch && matchesFilter;
    })

    if (loading) {
        return (
            <Layout>
                <Header title="Payout Management" />
                <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                    <Skeleton className="h-10 w-full md:w-96 rounded-lg" />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-40 rounded-xl" />
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-8 w-20 rounded-full" />)}
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-orange-50 p-4 flex gap-4">
                        {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-6 w-full" />)}
                    </div>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="p-4 border-t flex gap-4 items-center">
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-8 w-24 rounded-full" />
                            <Skeleton className="h-10 w-32 rounded-lg" />
                        </div>
                    ))}
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <Header title="Payout Management" />

            <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search restaurant or owner..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    <button
                        onClick={async () => {
                            if (window.confirm("Are you sure you want to process weekly settlements for ALL restaurants? This will create payout requests for all unpaid delivered orders.")) {
                                try {
                                    setLoading(true);
                                    const res = await api.post("/payouts/admin/batch-process");
                                    toast.success(res.data.message);
                                    fetchAllPayouts();
                                } catch (error) {
                                    toast.error("Batch processing failed");
                                } finally {
                                    setLoading(false);
                                }
                            }
                        }}
                        className="mr-4 px-6 py-2 bg-orange-100 text-orange-700 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-orange-600 hover:text-white transition-all shadow-sm border border-orange-200"
                    >
                        Weekly Settlement
                    </button>

                    {["pending", "paid", "rejected", "all"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${filter === f ? "bg-orange-600 text-white shadow-lg" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-orange-50 text-orange-600 border-b">
                        <tr>
                            <th className="p-4 font-black text-[10px] uppercase tracking-widest">Restaurant</th>
                            <th className="p-4 font-black text-[10px] uppercase tracking-widest">Owner Info</th>
                            <th className="p-4 font-black text-[10px] uppercase tracking-widest">Amount</th>
                            <th className="p-4 font-black text-[10px] uppercase tracking-widest">Date</th>
                            <th className="p-4 font-black text-[10px] uppercase tracking-widest">Status</th>
                            <th className="p-4 font-black text-[10px] uppercase tracking-widest text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredPayouts.length > 0 ? filteredPayouts.map(payout => (
                            <tr key={payout._id} className="hover:bg-orange-50/20 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-gray-800">{payout.restaurant?.name || "Deleted Restaurant"}</div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-tight">ID: {payout._id.slice(-8)}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm font-medium text-gray-700">{payout.owner?.name}</div>
                                    <div className="text-xs text-blue-500">{payout.owner?.email}</div>
                                </td>
                                <td className="p-4 font-black text-orange-600">₹{payout.amount.toLocaleString()}</td>
                                <td className="p-4 text-xs text-gray-500">
                                    {new Date(payout.createdAt).toLocaleString()}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${payout.status === 'paid' ? 'bg-green-100 text-green-700' :
                                        payout.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700 shadow-sm'
                                        }`}>
                                        {payout.status}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    {payout.status === 'pending' ? (
                                        <button
                                            onClick={() => {
                                                setSelectedPayout(payout);
                                                setShowModal(true);
                                            }}
                                            className="px-4 py-2 bg-orange-600 text-white rounded-lg text-xs font-bold hover:bg-orange-700 transition shadow hover:shadow-md"
                                        >
                                            Process Payout
                                        </button>
                                    ) : (
                                        <div className="text-[10px] text-gray-400 font-mono">
                                            {payout.transactionId || "N/A"}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="p-20 text-center text-gray-400">
                                    No payout requests matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PROCESS MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md bg-white border-none shadow-2xl animate-in fade-in zoom-in duration-200">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-gray-800">Process Request</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <div className="bg-orange-50 p-6 rounded-2xl mb-8 border border-orange-100">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-orange-800 tracking-wider">PAYABLE AMOUNT</span>
                                    <span className="text-blue-600 animate-pulse font-black text-xs uppercase tracking-widest">Real-time Balance</span>
                                </div>
                                <div className="text-4xl font-black text-gray-900 mb-4">
                                    ₹{selectedPayout?.amount.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                                        <IndianRupee size={16} className="text-orange-600" />
                                    </div>
                                    <span className="font-bold underline decoration-orange-300 decoration-2">{selectedPayout?.restaurant?.name}</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Transaction ID (Required for Paid)</label>
                                    <input
                                        type="text"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        placeholder="e.g. TXN98723412"
                                        className="w-full p-4 border border-gray-100 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:outline-none font-mono text-sm bg-gray-50/30"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Internal Note (Optional)</label>
                                    <textarea
                                        value={adminNote}
                                        onChange={(e) => setAdminNote(e.target.value)}
                                        placeholder="Reason for rejection or payment details..."
                                        className="w-full p-4 border border-gray-100 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:outline-none text-sm bg-gray-50/30 min-h-[100px]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <button
                                        onClick={() => handleUpdateStatus('rejected')}
                                        disabled={processing}
                                        className="py-4 rounded-xl border-2 border-red-50 text-red-600 font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        Reject Request
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus('paid')}
                                        disabled={processing}
                                        className="py-4 rounded-xl bg-green-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {processing ? "Processing..." : "Mark as Paid"}
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </Layout>
    )
}
