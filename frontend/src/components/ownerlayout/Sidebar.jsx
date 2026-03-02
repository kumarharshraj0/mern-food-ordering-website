import { memo } from "react"
import NavItem from "../layout/NavItem"
import { LayoutDashboard, ListOrdered, BarChart3, Store, DollarSign } from "lucide-react"

const Sidebar = memo(function Sidebar({ onClose }) {
  return (
    <aside className="w-64 bg-white border-r flex flex-col h-full">
      <div className="p-5 text-2xl font-bold text-orange-600">
        Restaurant Owner
      </div>

      <nav className="px-3 space-y-1 flex-1">
        <NavItem to="/owner/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={onClose} />
        <NavItem to="/owner/orders" icon={ListOrdered} label="Orders" onClick={onClose} />
        <NavItem to='/owner/restaurant' icon={Store} label="Restaurants" onClick={onClose} />

        <NavItem to="/owner/analytics" icon={BarChart3} label="Analytics" onClick={onClose} />
        <NavItem to="/owner/payouts" icon={DollarSign} label="Payouts" onClick={onClose} />
      </nav>
    </aside>
  )
});

export default Sidebar;
