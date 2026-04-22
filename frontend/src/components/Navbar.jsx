import { useState, useEffect, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Package,
  MapPin,
  Home,
  Store,
  History,
  HelpCircle,
  Settings,
  LogOut,
  Info,
  MessageCircle
} from "lucide-react";

import Cart from "@/pages/Cart.jsx";

import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";

export const Navbar = memo(function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolledState, setIsScrolledState] = useState(false);
  const [cityName, setCityName] = useState("");

  const { user: authUser } = useAuth();
  const { user, addAddress } = useUser();
  const { cart } = useCart();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const itemCount =
    cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  // HIDE NAVBAR ON ADMIN, OWNER, AND DELIVERY PANELS
  const noNavbarRoutes = ["/admin", "/owner", "/delivery"];
  const shouldHideNavbar = noNavbarRoutes.some(route => pathname.startsWith(route));

  if (shouldHideNavbar) return null;

  useEffect(() => {
    const handleScroll = () => setIsScrolledState(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrolled = isScrolledState || pathname !== "/";

  /* -----------------------------
     SHOW DEFAULT ADDRESS CITY
  ----------------------------- */
  useEffect(() => {
    if (user?.addresses?.length) {
      const def = user.addresses.find(a => a.default);
      if (def?.city) setCityName(def.city);
    }
  }, [user]);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/restaurants", label: "Restaurants", icon: Store },
    { href: "/about", label: "About Us", icon: Info },
    { href: "/contact", label: "Contact Us", icon: MessageCircle },
    ...(authUser ? [{ href: "/orders", label: "My Orders", icon: History }] : [])
  ];

  /* --------------------------------
     LOCATION → AUTO ADDRESS
  -------------------------------- */
  const shareLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          // 🔁 Reverse geocoding
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          const data = await res.json();
          const addr = data.address || {};

          const city =
            addr.city || addr.town || addr.village || "";

          await addAddress({
            label: "Current Location",
            street:
              addr.road ||
              addr.suburb ||
              addr.neighbourhood ||
              "",
            city,
            state: addr.state || "",
            pincode: addr.postcode || "",
            country: addr.country || "India",
            latitude: lat,
            longitude: lon,
            default: true
          });

          setCityName(city);
        } catch (err) {
          console.error(err);
          alert("Failed to detect location");
        }
      },
      () => alert("Location permission denied")
    );
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-[#faf9f6]/90 backdrop-blur-md border-b border-gray-200"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-full bg-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span
                className={`text-2xl font-black tracking-tighter transition-colors ${scrolled ? "text-gray-900" : "text-white"
                  }`}
                style={{ textShadow: scrolled ? "none" : "none" }}
              >
                FoodHub
              </span>
            </Link>

            {/* DESKTOP LINKS */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-bold transition-all duration-300 ${pathname === link.href
                    ? "text-orange-500"
                    : scrolled
                      ? "text-gray-800 hover:text-orange-500"
                      : "text-white hover:text-orange-300"
                    }`}
                  style={{ textShadow: scrolled ? "none" : "none" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3">

              {/* LOCATION */}
              {authUser && (
                <div className="hidden sm:flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={shareLocation}
                    aria-label="Detect and use current location"
                    className={`border-transparent transition-all duration-300 ${scrolled
                      ? "bg-orange-50 text-gray-800 border-orange-200 shadow-none border"
                      : "bg-transparent text-white border-transparent hover:bg-white/10"
                      }`}
                  >
                    <MapPin className="h-5 w-5" />
                  </Button>

                  {cityName && (
                    <span
                      className={`text-sm font-bold transition-all duration-300 ${scrolled ? "text-gray-800" : "text-white"
                        }`}
                      style={{ textShadow: scrolled ? "none" : "none" }}
                    >
                      {cityName}
                    </span>
                  )}
                </div>
              )}

              {/* ORDERS */}
              {authUser && (
                <Link to="/orders" className="hidden md:block" aria-label="View my orders">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-hidden="true"
                    className={`transition-all duration-300 ${scrolled ? "text-gray-800 hover:bg-gray-100" : "text-white hover:bg-white/10"}`}
                    style={{ filter: scrolled ? "none" : "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
                  >
                    <Package className="h-5 w-5" />
                  </Button>
                </Link>
              )}

              {/* CART */}
              {authUser && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCartOpen(true)}
                  aria-label={`View shopping cart, ${itemCount} items`}
                  className={`relative border-transparent transition-all duration-300 ${scrolled
                    ? "bg-orange-50 text-gray-800 border-orange-200 shadow-none border"
                    : "bg-transparent text-white border-transparent hover:bg-white/10"
                    }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </Button>
              )}

              {/* USER */}
              {authUser ? (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate("/account")}
                  aria-label="View my account"
                  className={`hidden sm:flex border-transparent transition-all duration-300 ${scrolled
                    ? "bg-orange-50 text-gray-800 border-orange-200 shadow-none border"
                    : "bg-transparent text-white border-transparent hover:bg-white/10"
                    }`}
                >
                  <User className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/signin")}
                  className="hidden sm:flex bg-orange-500 text-white hover:bg-orange-600 rounded-full px-6"
                >
                  Sign In
                </Button>
              )}

              {/* MOBILE MENU */}
              <Button
                variant="ghost"
                size="icon"
                className={`md:hidden transition-all duration-300 ${scrolled ? "text-gray-800 hover:bg-gray-100 shadow-none" : "text-white hover:bg-white/10 shadow-none"
                  }`}
                style={{ filter: scrolled ? "none" : "none" }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>

            </div>
          </div>
        </div>
      </nav>
      
      {/* MOBILE MENU OVERLAY - Moved outside <nav> for solid stacking context */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[1000] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="relative w-[300px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 border-l border-gray-100">
            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-orange-600 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20 transform -rotate-2">
                  <span className="text-xl transform rotate-2">{authUser ? user?.name?.charAt(0) || "U" : "F"}</span>
                </div>
                <div>
                  <h3 className="font-black text-gray-900 leading-tight tracking-tight text-lg">
                    {authUser ? `Hi, ${user?.name || "User"}` : "FoodHub"}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    {authUser ? "Premium Member" : "Guest Account"}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full hover:bg-gray-50 h-10 w-10"
              >
                <X className="h-6 w-6 text-gray-400" />
              </Button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto pt-8 pb-4 px-4 space-y-1 bg-white">
              <div className="px-4 mb-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Main Navigation</p>
              </div>
              {navLinks.map((link) => {
                const Icon = link.icon || Home;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
                      isActive 
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" 
                      : "text-gray-600 hover:bg-white hover:shadow-md hover:shadow-gray-200/50"
                    }`}
                  >
                    <div className={`p-2 rounded-xl transition-colors ${
                      isActive ? "bg-white/20" : "bg-gray-100 group-hover:bg-orange-50"
                    }`}>
                      <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-500 group-hover:text-orange-500"}`} />
                    </div>
                    <span className="font-bold text-[15px] tracking-tight">{link.label}</span>
                  </Link>
                )
              })}

              {/* Additional Sections for Authenticated Users */}
              {authUser && (
                <div className="pt-8 space-y-1">
                  <div className="px-4 mb-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Personal</p>
                  </div>
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-600 hover:bg-white hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="p-2 rounded-xl bg-gray-100 group-hover:bg-orange-50">
                      <Settings className="h-5 w-5 text-gray-500 group-hover:text-orange-500" />
                    </div>
                    <span className="font-bold text-[15px] tracking-tight">Account Settings</span>
                  </Link>
                  <div
                    onClick={shareLocation}
                    className="flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-600 hover:bg-white hover:shadow-md transition-all duration-300 group cursor-pointer"
                  >
                    <div className="p-2 rounded-xl bg-gray-100 group-hover:bg-orange-50">
                      <MapPin className="h-5 w-5 text-gray-500 group-hover:text-orange-500" />
                    </div>
                    <span className="font-bold text-[15px] tracking-tight truncate">
                      {cityName || "Detect Location"}
                    </span>
                  </div>
                  <div
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      navigate("/signin");
                    }}
                    className="flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 hover:shadow-md transition-all duration-300 group cursor-pointer"
                  >
                    <div className="p-2 rounded-xl bg-red-100 group-hover:bg-red-200">
                      <LogOut className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="font-bold text-[15px] tracking-tight">Logout</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 bg-white/50 backdrop-blur-md shrink-0">
              {!authUser ? (
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/signin");
                  }}
                  className="w-full bg-orange-600 text-white font-bold py-7 rounded-2xl hover:bg-orange-700 transition-all shadow-xl shadow-orange-500/20 text-lg flex items-center justify-center gap-2 group"
                >
                  <span>Sign In</span>
                  <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                    <div className="flex items-center gap-3 text-orange-700 mb-1">
                      <HelpCircle className="h-4 w-4" />
                      <span className="text-xs font-black uppercase tracking-wider">Need Help?</span>
                    </div>
                    <p className="text-[11px] text-orange-600 font-medium">Contact our 24/7 support for any ordering issues.</p>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex items-center justify-between text-[9px] uppercase font-black tracking-[2px] text-gray-400 px-2">
                 <span>FoodHub v1.2</span>
                 <div className="flex gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span>Systems Live</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
});





