import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import api from "../lib/api";
import { useAuth } from "./AuthContext";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ----------------------------------
     Reset orders on logout
  -----------------------------------*/
  useEffect(() => {
    if (!user) {
      setOrders([]);
      setOrder(null);
    }
  }, [user]);

  /* ----------------------------------
     CREATE ORDER
  -----------------------------------*/
  const createOrder = useCallback(async (data) => {
    try {
      setLoading(true);
      const res = await api.post("/orders", data);
      return res.data; // { order, razorpayOrder }
    } finally {
      setLoading(false);
    }
  }, []);

  /* ----------------------------------
     VERIFY PAYMENT (RAZORPAY)
  -----------------------------------*/
  const verifyPayment = useCallback(async (orderId, payload) => {
    const res = await api.post(`/orders/${orderId}/pay`, payload);
    return res.data;
  }, []);

  /* ----------------------------------
     GET SINGLE ORDER
  -----------------------------------*/
  const getOrderById = useCallback(async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ----------------------------------
     LIST MY ORDERS (USER)
  -----------------------------------*/
  const fetchMyOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data);
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchResturantOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/restaurant/orders");
      setOrders(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ----------------------------------
     LIST RESTAURANT ORDERS
     (restaurant / admin)

  
  /* ----------------------------------
  
     UPDATE ORDER STATUS
     (restaurant / admin)
  -----------------------------------*/
  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status });
      // 👈 Update local orders state for immediate UI feedback
      setOrders((prevOrders) =>
        prevOrders.map((ord) => (ord._id === orderId ? { ...ord, status } : ord))
      );
      // 👈 Update single order if it's currently loaded
      if (order && order._id === orderId) {
        setOrder((prev) => ({ ...prev, status }));
      }
      return res.data;
    } catch (error) {
      console.error("Error updating status:", error);
      throw error;
    }
  }, [order]);

  const fetchAllOrders = useCallback(async () => {
    try {
      setLoading(true);
      // 🔥 Call admin-specific endpoint
      const res = await api.get("/admin/orders");
      setOrders(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAdminStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/dashboard-stats");
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkReviewEligibility = useCallback(async (params) => {
    const res = await api.get("/orders/check-eligibility", { params });
    return res.data;
  }, []);

  const value = useMemo(() => ({
    orders,
    order,
    loading,
    createOrder,
    verifyPayment,
    getOrderById,
    fetchMyOrders,
    fetchResturantOrders,
    updateOrderStatus,
    fetchAllOrders,
    getAdminStats,
    checkReviewEligibility
  }), [orders, order, loading, createOrder, verifyPayment, getOrderById, fetchMyOrders, fetchResturantOrders, updateOrderStatus, fetchAllOrders, getAdminStats, checkReviewEligibility]);

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
