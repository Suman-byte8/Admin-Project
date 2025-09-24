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

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchAdminDetails(token);
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

  const fetchAdminDetails = useCallback(async (token) => {
    try {
      setLoading(true);
      const decoded = jwtDecode(token);
      const adminId = decoded.id;
      const data = await adminApi.getProfile(adminId, token);

      if (data.success) {
        setAdmin(data.admin);
        setIsAuthenticated(true);
      } else {
        // Only redirect on authentication errors
        console.warn("Authentication failed, redirecting to login");
        setAdmin(null);
        setIsAuthenticated(false);
        localStorage.removeItem("adminToken");
        navigate("/log-in");
      }
    } catch (error) {
      console.error("Network error fetching admin details:", error);
      // On network errors, log out the user
      setAdmin(null);
      setIsAuthenticated(false);
      localStorage.removeItem("adminToken");
      navigate("/log-in");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const data = await adminApi.login({ email, password });
      if (data.success && data.token) {
        localStorage.setItem("adminToken", data.token);
        setAdmin(data.admin);
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
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
    setIsAuthenticated(false);
    setLoading(false);
    localStorage.removeItem("adminToken");
    navigate("/log-in");
  }, [navigate]);

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
  }), [admin, isAuthenticated, loading, getToken, login, logout, register, fetchAdminDetails, checkTokenAndRedirect]);

  return (
    <AdminContext.Provider value={memoizedValue}>
      {children}
    </AdminContext.Provider>
  );
};
