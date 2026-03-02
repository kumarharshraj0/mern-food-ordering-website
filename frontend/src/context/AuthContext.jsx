import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import api from "../lib/api";

const AuthContext = createContext();

// const API = "http://localhost:5000/api/auth"; // Removed hardcoded URL

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken")
  );
  const [loading, setLoading] = useState(true);

  /* ----------------------------------
     App init: load profile
  -----------------------------------*/
  useEffect(() => {
    if (accessToken) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data.user);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  /* ----------------------------------
     AUTH FUNCTIONS
  -----------------------------------*/
  const login = useCallback(async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    const { user, accessToken: newAccess, refreshToken: newRefresh } = res.data;

    setUser(user);
    setAccessToken(newAccess);
    setRefreshToken(newRefresh);

    localStorage.setItem("accessToken", newAccess);
    localStorage.setItem("refreshToken", newRefresh);

    return res.data;
  }, []);

  const signup = useCallback(async (name, email, password, role = "user") => {
    return api.post("/auth/signup", { name, email, password, role });
  }, []);

  const googleLogin = useCallback(async (idToken) => {
    const res = await api.post("/auth/google-login", { idToken });

    const { user, accessToken: newAccess, refreshToken: newRefresh } = res.data;

    setUser(user);
    setAccessToken(newAccess);
    setRefreshToken(newRefresh);

    localStorage.setItem("accessToken", newAccess);
    localStorage.setItem("refreshToken", newRefresh);

    return res.data;
  }, []);

  const verifyEmail = useCallback(async (token) => {
    return api.post("/auth/verify-email", { token });
  }, []);

  const forgotPassword = useCallback(async (email) => {
    return api.post("/auth/forgot-password", { email });
  }, []);

  const resetPassword = useCallback(async (email, otp, password) => {
    return api.post("/auth/reset-password", {
      email,
      otp,
      password
    });
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    return api.post("/auth/change-password", {
      currentPassword,
      newPassword
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    signup,
    googleLogin,
    verifyEmail,
    forgotPassword,
    resetPassword,
    changePassword,
    logout
  }), [user, loading, login, signup, verifyEmail, forgotPassword, resetPassword, changePassword, logout]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/* ----------------------------------
   Custom Hook
-----------------------------------*/
export const useAuth = () => useContext(AuthContext);

