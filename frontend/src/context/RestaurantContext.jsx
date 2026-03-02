import { createContext, useContext, useState, useCallback, useMemo } from "react";
import api from "../lib/api";

const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- PUBLIC ---------------- */

  const getRestaurants = useCallback(async (params = {}) => {
    setLoading(true);
    const res = await api.get("/restaurants", { params });
    setRestaurants(res.data.restaurants);
    setPagination(res.data.pagination);
    setLoading(false);
  }, []);

  const getRestaurantById = useCallback(async (id) => {
    setLoading(true);
    const res = await api.get(`/restaurants/${id}`);
    setRestaurant(res.data);
    setLoading(false);
  }, []);

  const getNearestRestaurants = useCallback(async (lat, lng) => {
    const res = await api.get("/restaurants/nearest", {
      params: { latitude: lat, longitude: lng }
    });
    return res.data.nearest;
  }, []);

  /* ---------------- OWNER ---------------- */

  const createRestaurant = useCallback(async (data) => {
    return api.post("/restaurants/owner/request", data);
  }, []);

  const updateRestaurant = useCallback(async (id, data) => {
    return api.put(`/restaurants/owner/${id}`, data);
  }, []);

  const deleteRestaurant = useCallback(async (id) => {
    return api.delete(`/restaurants/owner/${id}`);
  }, []);

  const toggleRestaurantStatus = useCallback(async (id) => {
    return api.put(`/restaurants/owner/${id}/status`);
  }, []);

  /* ---------------- ADMIN ---------------- */

  const getPendingRestaurants = useCallback(async () => {
    const res = await api.get("/restaurants/admin/pending");
    return res.data;
  }, []);

  const approveRestaurant = useCallback(async (id) => {
    return api.put(`/restaurants/admin/${id}/approve`);
  }, []);

  const getAllRestaurants = useCallback(async () => {
    const res = await api.get("/restaurants/all");
    return res.data;
  }, []);

  const getmyResturants = useCallback(async () => {
    const res = await api.get("/restaurants/myresturant");
    return res.data;
  }, []);

  /* ---------------- REVIEWS ---------------- */

  const getRestaurantReviews = useCallback(async (id) => {
    const res = await api.get(`/restaurants/${id}/reviews`);
    return res.data;
  }, []);

  const createRestaurantReview = useCallback(async (id, data) => {
    const res = await api.post(`/restaurants/${id}/reviews`, data);
    return res.data;
  }, []);

  const updateRestaurantReview = useCallback(async (id, data) => {
    const res = await api.put(`/restaurants/${id}/reviews`, data);
    return res.data;
  }, []);

  const deleteRestaurantReview = useCallback(async (id) => {
    const res = await api.delete(`/restaurants/${id}/reviews`);
    return res.data;
  }, []);

  const value = useMemo(() => ({
    restaurants,
    restaurant,
    pagination,
    loading,
    getRestaurants,
    getRestaurantById,
    getNearestRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getPendingRestaurants,
    approveRestaurant,
    getAllRestaurants,
    getmyResturants,
    getRestaurantReviews,
    createRestaurantReview,
    updateRestaurantReview,
    deleteRestaurantReview,
    toggleRestaurantStatus
  }), [restaurants, restaurant, pagination, loading, getRestaurants, getRestaurantById, getNearestRestaurants, createRestaurant, updateRestaurant, deleteRestaurant, getPendingRestaurants, approveRestaurant, getAllRestaurants, getmyResturants, getRestaurantReviews, createRestaurantReview, updateRestaurantReview, deleteRestaurantReview, toggleRestaurantStatus]);

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => useContext(RestaurantContext);

