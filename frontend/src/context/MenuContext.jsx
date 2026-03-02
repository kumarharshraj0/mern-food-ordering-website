import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import api from "../lib/api";
import { useAuth } from "./AuthContext";

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const { user } = useAuth();

  const [menu, setMenu] = useState([]);
  const [menuItem, setMenuItem] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  /* ----------------------------------
     GET MENU (search, filter, pagination)
  -----------------------------------*/
  const getMenu = useCallback(async (params = {}) => {
    setLoading(true);
    const res = await api.get("/menu", { params });
    setMenu(res.data.items);

    setPagination(res.data.pagination);
    setLoading(false);
  }, []);

  /* ----------------------------------
     GET LATEST MENU
  -----------------------------------*/
  const getLatestMenu = useCallback(async () => {
    setLoading(true);
    const res = await api.get("/menu/latest");
    setMenu(res.data);
    setLoading(false);
  }, []);

  /* ----------------------------------
     GET MENU ITEM BY ID
  -----------------------------------*/
  const getMenuById = useCallback(async (id) => {
    setLoading(true);
    const res = await api.get(`/menu/${id}`);
    setMenuItem(res.data);
    setLoading(false);
  }, []);

  /* ----------------------------------
     ADMIN: CREATE MENU ITEM
  -----------------------------------*/

  const createMenuItem = useCallback(async (data) => {
    const res = await api.post("/menu", data);
    return res.data;
  }, []);

  const updateMenuItem = useCallback(async (id, data) => {
    const res = await api.put(`/menu/${id}`, data);
    return res.data;
  }, []);

  const deleteMenuItem = useCallback(async (id) => {
    const res = await api.delete(`/menu/${id}`);
    return res.data;
  }, []);

  /* ----------------------------------
     REVIEWS
  -----------------------------------*/
  const createReview = useCallback(async (id, data) => {
    const res = await api.post(`/menu/${id}/reviews`, data);
    return res.data;
  }, []);

  const updateReview = useCallback(async (id, data) => {
    const res = await api.put(`/menu/${id}/reviews`, data);
    return res.data;
  }, []);

  const deleteReview = useCallback(async (id) => {
    const res = await api.delete(`/menu/${id}/reviews`);
    return res.data;
  }, []);

  const getMenuReviews = useCallback(async (id) => {
    const res = await api.get(`/menu/${id}/reviews`);
    return res.data;
  }, []);

  const value = useMemo(() => ({
    menu,
    menuItem,
    pagination,
    loading,
    getMenu,
    getLatestMenu,
    getMenuById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    createReview,
    updateReview,
    deleteReview,
    getMenuReviews
  }), [menu, menuItem, pagination, loading, getMenu, getLatestMenu, getMenuById, createMenuItem, updateMenuItem, deleteMenuItem, createReview, updateReview, deleteReview, getMenuReviews]);

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  return useContext(MenuContext);
}
