import { useState } from "react";
import { Menu } from "lucide-react";
import SideSheet from "../ui/SideSheet";

export default function GenericDashboardLayout({ children, sidebar: SidebarComponent, title }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-orange-50">
            {/* DESKTOP SIDEBAR */}
            <div className="hidden md:block">
                <SidebarComponent />
            </div>

            {/* MOBILE HEADER */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center px-4 z-40">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    <Menu size={24} />
                </button>
                <span className="ml-4 font-bold text-orange-600">{title}</span>
            </div>

            {/* MOBILE SIDEBAR (SideSheet) */}
            <SideSheet
                open={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                title="Menu"
            >
                <div className="h-full">
                    <SidebarComponent onClose={() => setIsMobileMenuOpen(false)} />
                </div>
            </SideSheet>

            <main className="flex-1 p-6 md:pt-6 pt-20 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
