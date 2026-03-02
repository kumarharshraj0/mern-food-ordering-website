import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";
import Skeleton from "./components/ui/Skeleton";
import { Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

// LAZY LOAD PAGES
const Home = lazy(() => import("./pages/Home"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const MenuPage = lazy(() => import("./pages/Menu"));
const RestaurantPage = lazy(() => import("./pages/Resturant"));
const RestaurantDetailPage = lazy(() => import("./pages/RestaurantDetailPage"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminOrders = lazy(() => import("./pages/Admin/Ordersview"));
const SignUp = lazy(() => import("./pages/Signup"));
const Signin = lazy(() => import("./pages/SignIn"));
const ForgotPassword = lazy(() => import("./pages/Forgot Password"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Account = lazy(() => import("./pages/Account"));
const AdminRestaurants = lazy(() => import("./pages/Admin/Restaurants"));
const CreateRestaurant = lazy(() => import("./pages/CreateResturant"));
const OwnerRestaurants = lazy(() => import("./pages/Owner/OwnerRestaurants"));
const AddMenu = lazy(() => import("./pages/Owner/AddMenu"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailsPage"));
const ResturantOrders = lazy(() => import("./pages/Owner/Ordersview"));
const OwnerDashboard = lazy(() => import("./pages/Owner/Dashboard"));
const OwnerAnalytics = lazy(() => import("./pages/Owner/Analytics"));
const OwnerPayouts = lazy(() => import("./pages/Owner/Payouts"));
const PayoutBill = lazy(() => import("./pages/Owner/PayoutBill"));
const AdminPayouts = lazy(() => import("./pages/Admin/Payouts"));
const AdminCoupons = lazy(() => import("./pages/Admin/Coupons"));
const DeliveryDashboard = lazy(() => import("./pages/Delivery/Dashboard"));
const DeliveryOrders = lazy(() => import("./pages/Delivery/Orders"));
const DeliveryOrderDetail = lazy(() => import("./pages/Delivery/OrderDetail"));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-orange-50">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">Something went wrong.</h2>
          <p className="text-gray-600 mb-6">We're sorry for the inconvenience. Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageLoader = () => (
  <div className="min-h-screen pt-32 px-4 max-w-7xl mx-auto flex flex-col items-center">
    <Loader2 className="h-12 w-12 text-orange-600 animate-spin mb-8" />
    <div className="w-full space-y-6">
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-64 w-full rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ScrollToTop />
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <Routes>
              {/* ... routes ... */}
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/account" element={<Account />} />
              <Route path="/restaurants" element={<RestaurantPage />} />
              <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetailsPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/order-success/:id" element={<OrderSuccess />} />
              <Route path="/create-restaurant" element={<CreateRestaurant />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/restaurants" element={<AdminRestaurants />} />
              <Route path="/admin/payouts" element={<AdminPayouts />} />
              <Route path="/admin/coupons" element={<AdminCoupons />} />

              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
              <Route path="/owner/restaurant" element={<OwnerRestaurants />} />
              <Route path="/owner/orders" element={<ResturantOrders />} />
              <Route path="/owner/menu/add" element={<AddMenu />} />
              <Route path="/owner/analytics" element={<OwnerAnalytics />} />
              <Route path="/owner/payouts" element={<OwnerPayouts />} />
              <Route path="/owner/payout/:id" element={<PayoutBill />} />

              {/* DELIVERY BOY ROUTES */}
              <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
              <Route path="/delivery/orders" element={<DeliveryOrders />} />
              <Route path="/delivery/orders/:id" element={<DeliveryOrderDetail />} />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Footer />
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
};

export default App;


