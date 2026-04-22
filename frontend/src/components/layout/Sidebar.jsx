import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import NavItem from "./NavItem"
import { LayoutDashboard, ListOrdered, BarChart3, Store, DollarSign, Ticket, LogOut } from "lucide-react"

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r flex flex-col h-full">
      <div className="p-5 text-2xl font-bold text-orange-600">
        Food Admin
      </div>

      <nav className="px-3 space-y-1 flex-1">
        <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={onClose} />
        <NavItem to="/admin/orders" icon={ListOrdered} label="Orders" onClick={onClose} />
        <NavItem to='/admin/restaurants' icon={Store} label="Restaurants" onClick={onClose} />
        <NavItem to='/admin/coupons' icon={Ticket} label="Coupons" onClick={onClose} />

        <NavItem to="/admin/analytics" icon={BarChart3} label="Analytics" onClick={onClose} />
        <NavItem to="/admin/payouts" icon={DollarSign} label="Payouts" onClick={onClose} />
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={() => {
            logout();
            navigate("/signin");
            onClose?.();
          }}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
