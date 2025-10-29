import React, { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// Fix import of jwt-decode
import { jwtDecode } from 'jwt-decode';
import { adminApi } from "../services/adminApi";

// API base URL from environment
const API_BASE = import.meta.env.VITE_BACKEND_URL;

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getToken = useCallback(() => localStorage.getItem("adminToken"), []);

  // Cache keys
  const ADMIN_CACHE_KEY = "adminCache";
  const REMEMBER_ME_KEY = "adminRememberMe";

  // Function to get cached admin data
  const getCachedAdmin = useCallback(() => {
    try {
      const cached = localStorage.getItem(ADMIN_CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Error reading cached admin data:", error);
      return null;
    }
  }, []);

  // Function to set cached admin data
  const setCachedAdmin = useCallback((adminData) => {
    try {
      localStorage.setItem(ADMIN_CACHE_KEY, JSON.stringify(adminData));
    } catch (error) {
      console.error("Error caching admin data:", error);
    }
  }, []);

  // Function to clear cached admin data
  const clearCachedAdmin = useCallback(() => {
    localStorage.removeItem(ADMIN_CACHE_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
  }, []);

  // Function to check if remember me is enabled
  const isRememberMeEnabled = useCallback(() => {
    return localStorage.getItem(REMEMBER_ME_KEY) === "true";
  }, []);

  useEffect(() => {
    const token = getToken();
    if (token) {
      // Check for cached admin data first
      const cachedAdmin = getCachedAdmin();
      if (cachedAdmin) {
        setAdmin(cachedAdmin);
        setIsAuthenticated(true);
        setLoading(false);
        // Optionally, verify token validity in background
        fetchAdminDetails(token, false); // false means don't set loading
      } else {
        fetchAdminDetails(token);
      }
    } else {
      setIsAuthenticated(false);
      setAdmin(null);
      // Delay navigation to login by 5 seconds
      setTimeout(() => {
        setLoading(false);
        navigate("/log-in");
      }, 5000);
    }
    // eslint-disable-next-line
  }, []);

  // Function to check token and redirect if not found
  const checkTokenAndRedirect = useCallback(() => {
    const token = getToken();
    if (!token) {
      navigate("/log-in");
    }
  }, [getToken, navigate]);

  const fetchAdminDetails = useCallback(async (token, setLoadingState = true) => {
    try {
      if (setLoadingState) setLoading(true);
      const decoded = jwtDecode(token);
      const adminId = decoded.id;
      const data = await adminApi.getProfile(adminId, token);

      if (data.success) {
        setAdmin(data.admin);
        setCachedAdmin(data.admin); // Cache the admin data
        setIsAuthenticated(true);
      } else {
        // Only redirect on authentication errors
        console.warn("Authentication failed, redirecting to login");
        setAdmin(null);
        setIsAuthenticated(false);
        clearCachedAdmin();
        localStorage.removeItem("adminToken");
        navigate("/log-in");
      }
    } catch (error) {
      console.error("Network error fetching admin details:", error);
      // On network errors, log out the user
      setAdmin(null);
      setIsAuthenticated(false);
      clearCachedAdmin();
      localStorage.removeItem("adminToken");
      navigate("/log-in");
    } finally {
      if (setLoadingState) setLoading(false);
    }
  }, [navigate, setCachedAdmin, clearCachedAdmin]);

  const login = useCallback(async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      const data = await adminApi.login({ email, password });
      if (data.success && data.token) {
        localStorage.setItem("adminToken", data.token);
        if (rememberMe) {
          localStorage.setItem(REMEMBER_ME_KEY, "true");
        }
        setAdmin(data.admin);
        setCachedAdmin(data.admin); // Cache admin data on login
        setIsAuthenticated(true);
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      return { success: false, message: "Network error during login" };
    }
  }, [setCachedAdmin, REMEMBER_ME_KEY]);

  const logout = useCallback(() => {
    setAdmin(null);
    setIsAuthenticated(false);
    setLoading(false);
    clearCachedAdmin(); // Clear cache on logout
    localStorage.removeItem("adminToken");
    navigate("/log-in");
  }, [navigate, clearCachedAdmin]);

  const register = useCallback(async (adminData) => {
    try {
      setLoading(true);
      const data = await adminApi.register(adminData);
      if (data.success && data.token) {
        localStorage.setItem("adminToken", data.token);
        setAdmin(data.admin);
        setIsAuthenticated(true);
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return { success: false, message: data.message || "Registration failed" };
      }
    } catch (error) {
      console.error("Registration error:", error);
      setLoading(false);
      return { success: false, message: "Network error during registration" };
    }
  }, []);

  const memoizedValue = useMemo(() => ({
    admin,
    isAuthenticated,
    loading,
    getToken,
    login,
    logout,
    register,
    fetchAdminDetails,
    checkTokenAndRedirect,
    isRememberMeEnabled,
  }), [admin, isAuthenticated, loading, getToken, login, logout, register, fetchAdminDetails, checkTokenAndRedirect, isRememberMeEnabled]);

  return (
    <AdminContext.Provider value={memoizedValue}>
      {children}
    </AdminContext.Provider>
  );
};
