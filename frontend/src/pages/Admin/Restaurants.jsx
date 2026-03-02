import { useEffect, useState } from "react"
import { Check, Eye } from "lucide-react"
import Skeleton from "@/components/ui/Skeleton"
import Layout from "@/components/layout/Layout"
import Header from "@/components/Header"
import { useRestaurant } from "@/context/RestaurantContext"

export default function AdminRestaurants() {
  const {
    restaurants,
    loading,
    getRestaurants,
    getPendingRestaurants,
    approveRestaurant
  } = useRestaurant()

  const [pending, setPending] = useState([])

  /* ----------------------------------
     Fetch Data
  -----------------------------------*/
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const pendingRes = await getPendingRestaurants()
    setPending(pendingRes)

    await getRestaurants({ page: 1, limit: 50 })
  }

  /* ----------------------------------
     Approve Restaurant
  -----------------------------------*/
  const handleApprove = async (id) => {
    await approveRestaurant(id)
    fetchData()
  }

  return (
    <Layout>
      <Header title="Restaurants Management" pt-10 />

      {/* ================= PENDING REQUESTS ================= */}
      <h2 className="text-xl font-bold mb-4 text-orange-600">
        Pending Requests
      </h2>

      {pending.length === 0 ? (
        <p className="text-gray-500 mb-6">No pending requests</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {pending.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-xl shadow overflow-hidden"
            >
              <img
                src={r.images?.[0]?.url || "/placeholder.png"}
                className="h-40 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="text-lg font-bold">{r.name}</h3>
                <p className="text-sm text-gray-500">
                  {r.address?.city}, {r.address?.country}
                </p>

                <button
                  onClick={() => handleApprove(r._id)}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  <Check size={18} /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= ALL RESTAURANTS ================= */}
      <h2 className="text-xl font-bold mb-4 text-orange-600">
        Approved Restaurants
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow overflow-hidden space-y-4 font-bold h-64">
              <Skeleton className="h-40 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <p className="text-gray-500">No restaurants found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-xl shadow overflow-hidden"
            >
              <img
                src={r.images?.[0]?.url || "/placeholder.png"}
                className="h-40 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="text-lg font-bold">{r.name}</h3>

                <p className="text-sm text-gray-500">
                  {r.address?.city}, {r.address?.country}
                </p>

                <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                  Open
                </span>

                <div className="flex justify-end mt-4">
                  <button className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}

