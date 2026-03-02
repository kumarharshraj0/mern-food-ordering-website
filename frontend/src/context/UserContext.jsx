import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import api from "../lib/api";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user: authUser } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ----------------------------------
     Load profile when auth user exists
  -----------------------------------*/
  useEffect(() => {
    if (authUser) {
      fetchMe();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [authUser]);

  const fetchMe = useCallback(async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (err) {

    } finally {
      setLoading(false);
    }
  }, []);

  /* ----------------------------------
     PROFILE
  -----------------------------------*/

  const updateProfile = useCallback(async (data) => {
    const res = await api.put("/users/me", data);
    setUser(res.data);
    return res.data;
  }, []);

  const uploadAvatar = useCallback(async (base64) => {
    const res = await api.post("/users/avatar", {
      dataUrl: base64
    });
    setUser(res.data);
    return res.data;
  }, []);

  /* ----------------------------------
     ADDRESSES
  -----------------------------------*/

  const addAddress = useCallback(async (data) => {
    const res = await api.post("/users/addresses", data);
    setUser((prev) => ({ ...prev, addresses: res.data }));
    return res.data;
  }, []);

  const updateAddress = useCallback(async (id, data) => {
    const res = await api.put(`/users/addresses/${id}`, data);
    setUser((prev) => ({ ...prev, addresses: res.data }));
    return res.data;
  }, []);

  const deleteAddress = useCallback(async (id) => {
    const res = await api.delete(`/users/addresses/${id}`);
    setUser((prev) => ({ ...prev, addresses: res.data }));
    return res.data;
  }, []);

  /* ----------------------------------
     REALTIME LOCATION
  -----------------------------------*/
  const updateLocation = useCallback(async (latitude, longitude) => {
    const res = await api.put("/users/location", { latitude, longitude });
    setUser(res.data);
    return res.data;
  }, []);

  const deleteLocation = useCallback(async () => {
    const res = await api.delete("/users/location");
    setUser(res.data);
    return res.data;
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    fetchMe,
    updateProfile,
    uploadAvatar,
    addAddress,
    updateAddress,
    deleteAddress,
    updateLocation,
    deleteLocation
  }), [user, loading, fetchMe, updateProfile, uploadAvatar, addAddress, updateAddress, deleteAddress, updateLocation, deleteLocation]);

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};

/* ----------------------------------
   Custom Hook
-----------------------------------*/
export const useUser = () => useContext(UserContext);
