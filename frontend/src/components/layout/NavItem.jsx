import { memo } from "react"
import { Link } from "react-router-dom"

const NavItem = memo(function NavItem({ to, icon: Icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-orange-100"
    >
      <Icon className="w-5 h-5 text-orange-600" />
      {label}
    </Link>
  )
});

export default NavItem;
