import { useState, useEffect, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Package,
  MapPin
} from "lucide-react";

import Cart from "@/pages/Cart.jsx";

import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";

export const Navbar = memo(function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/restaurants", label: "Restaurants" },
    { href: "/orders", label: "My Orders" }
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
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50"
          : "bg-black/20 backdrop-blur-[2px] shadow-md"
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
                style={{ textShadow: scrolled ? "none" : "0 2px 4px rgba(0,0,0,0.5)" }}
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
                  style={{ textShadow: scrolled ? "none" : "0 1px 3px rgba(0,0,0,0.4)" }}
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
                    className={`border-orange-400/50 transition-all duration-300 ${scrolled
                      ? "bg-orange-50 text-gray-800 border-orange-200"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20 shadow-md"
                      }`}
                  >
                    <MapPin className="h-5 w-5" />
                  </Button>

                  {cityName && (
                    <span
                      className={`text-sm font-bold transition-all duration-300 ${scrolled ? "text-gray-800" : "text-white"
                        }`}
                      style={{ textShadow: scrolled ? "none" : "0 1px 3px rgba(0,0,0,0.5)" }}
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
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCartOpen(true)}
                aria-label={`View shopping cart, ${itemCount} items`}
                className={`relative border-orange-400/50 transition-all duration-300 ${scrolled
                  ? "bg-orange-50 text-gray-800 border-orange-200"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20 shadow-md"
                  }`}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </Button>

              {/* USER */}
              {authUser ? (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate("/account")}
                  aria-label="View my account"
                  className={`hidden sm:flex border-orange-400/50 transition-all duration-300 ${scrolled
                    ? "bg-orange-50 text-gray-800 border-orange-200"
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20 shadow-md"
                    }`}
                >
                  <User className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/signin")}
                  className="hidden sm:flex bg-orange-500 text-white hover:bg-orange-600"
                >
                  Sign In
                </Button>
              )}

              {/* MOBILE MENU */}
              <Button
                variant="ghost"
                size="icon"
                className={`md:hidden transition-all duration-300 ${scrolled ? "text-gray-800 hover:bg-gray-100" : "text-white hover:bg-white/10"
                  }`}
                style={{ filter: scrolled ? "none" : "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>

            </div>
          </div>
        </div>

        {/* MOBILE MENU BODY */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-lg border-b border-orange-100 animate-in slide-in-from-top duration-300">
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-lg font-medium py-3 px-2 ${pathname === link.href
                    ? "text-orange-500"
                    : "text-gray-800"
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-orange-50 flex flex-col gap-4">
                {authUser ? (
                  <>
                    <div className="flex items-center gap-3 py-3 px-2 cursor-pointer" onClick={shareLocation}>
                      <MapPin className="h-5 w-5 text-orange-500" />
                      <span className="font-medium text-gray-800">
                        {cityName || "Detect Location"}
                      </span>
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-3 px-2"
                    >
                      <User className="h-5 w-5 text-orange-500" />
                      <span className="font-medium text-gray-800">My Account</span>
                    </Link>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/signin");
                    }}
                    className="w-full bg-orange-500 text-white"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
});





