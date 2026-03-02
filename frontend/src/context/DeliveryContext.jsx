import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import api from "../lib/api";
import { useAuth } from "./AuthContext";

const DeliveryContext = createContext();

export const DeliveryProvider = ({ children }) => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [availableOrders, setAvailableOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statsLoading, setStatsLoading] = useState(false);
    const [availableLoading, setAvailableLoading] = useState(false);
    const [assignedLoading, setAssignedLoading] = useState(false);
    const [stats, setStats] = useState(null);
    const [isAvailable, setIsAvailable] = useState(false);

    useEffect(() => {
        if (user) {
            setIsAvailable(user.isAvailable);
        }
    }, [user]);

    const fetchAssignedOrders = useCallback(async () => {
        try {
            setAssignedLoading(true);
            const res = await api.get("/delivery/assigned");
            setOrders(res.data);
        } catch (err) {
            console.error("Fetch Assigned Orders Error:", err);
        } finally {
            setAssignedLoading(false);
        }
    }, []);

    const getOrderDetails = useCallback(async (id) => {
        try {
            setLoading(true);
            const res = await api.get(`/delivery/orders/${id}`);
            return res.data;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateDeliveryStatus = useCallback(async (id, status) => {
        try {
            setLoading(true);
            const res = await api.post(`/delivery/orders/${id}/update-status`, { status });
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
            return res.data;
        } finally {
            setLoading(false);
        }
    }, []);

    const verifyDeliveryOtp = useCallback(async (id, otp) => {
        try {
            setLoading(true);
            const res = await api.post(`/delivery/orders/${id}/verify-otp`, { otp });
            setOrders(prev => prev.map(o => o._id === id ? { ...o, deliveryOtpVerified: true } : o));
            return res.data;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDeliveryStats = useCallback(async () => {
        try {
            setStatsLoading(true);
            const res = await api.get("/delivery/deliveryBoyStats");
            setStats(res.data.stats);
            return res.data.stats;
        } catch (err) {
            console.error("Fetch Delivery Stats Error:", err);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    const toggleDutyStatus = useCallback(async () => {
        try {
            const res = await api.post("/delivery/toggle-status");
            setIsAvailable(res.data.isAvailable);
            return res.data.isAvailable;
        } catch (err) {
            console.error("Toggle Status Error:", err);
            throw err;
        }
    }, []);

    const fetchAvailableOrders = useCallback(async () => {
        try {
            setAvailableLoading(true);
            const res = await api.get("/delivery/available");
            setAvailableOrders(res.data);
        } catch (err) {
            console.error("Fetch Available Orders Error:", err);
        } finally {
            setAvailableLoading(false);
        }
    }, []);

    const acceptOrder = useCallback(async (id) => {
        try {
            setLoading(true);
            const res = await api.post(`/delivery/accept/${id}`);
            setAvailableOrders(prev => prev.filter(o => o._id !== id));
            fetchAssignedOrders();
            return res.data;
        } finally {
            setLoading(false);
        }
    }, [fetchAssignedOrders]);

    const value = useMemo(() => ({
        orders,
        loading: statsLoading || availableLoading || assignedLoading,
        statsLoading,
        availableLoading,
        assignedLoading,
        stats,
        isAvailable,
        availableOrders,
        setAvailableOrders,
        fetchAssignedOrders,
        fetchAvailableOrders,
        acceptOrder,
        getOrderDetails,
        updateDeliveryStatus,
        verifyDeliveryOtp,
        fetchDeliveryStats,
        toggleDutyStatus
    }), [orders, statsLoading, availableLoading, assignedLoading, stats, isAvailable, availableOrders, fetchAssignedOrders, fetchAvailableOrders, acceptOrder, getOrderDetails, updateDeliveryStatus, verifyDeliveryOtp, fetchDeliveryStats, toggleDutyStatus]);

    return (
        <DeliveryContext.Provider value={value}>
            {children}
        </DeliveryContext.Provider>
    );
};

export const useDelivery = () => useContext(DeliveryContext);
