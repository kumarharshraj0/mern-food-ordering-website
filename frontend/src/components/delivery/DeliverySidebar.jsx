import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, User, LogOut } from "lucide-react";
import { useDelivery } from "../../context/DeliveryContext";
import { useAuth } from "../../context/AuthContext";

const DeliverySidebar = ({ onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { orders } = useDelivery();

    const assignedCount = orders.filter(o => o.status === 'assigned' || o.status === 'picked up' || o.status === 'out for delivery').length;

    const links = [
        { label: "Dashboard", href: "/delivery/dashboard", icon: LayoutDashboard },
        { label: "Deliveries", href: "/delivery/orders", icon: ShoppingBag, badge: assignedCount },
        { label: "Profile", href: "/account", icon: User },
    ];

    return (
        <div className="flex flex-col h-full bg-white border-r">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-orange-600">Food Delivery</h1>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">
                    Delivery Boy Panel
                </p>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            to={link.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? "bg-orange-600 text-white shadow-lg shadow-orange-200"
                                : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t">
                <button
                    onClick={() => {
                        logout();
                        navigate("/signin");
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default DeliverySidebar;
