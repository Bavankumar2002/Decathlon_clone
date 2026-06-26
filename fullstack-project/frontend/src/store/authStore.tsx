"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

interface User {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: { email?: string; phone?: string; password?: string }) => Promise<{ success: boolean; message?: string }>;
  register: (details: { name: string; email?: string; phone?: string; password?: string }) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (emailOrPhone: { email?: string; phone?: string }) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (payload: { email?: string; phone?: string; newPassword?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-login on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("decathlon_token");
        if (storedToken) {
          setToken(storedToken);
          // Fetch current user details
          const response = await api.get("/api/auth/me");
          if (response.data && response.data.success) {
            setUser(response.data.user);
          } else {
            // Invalid token
            localStorage.removeItem("decathlon_token");
            setToken(null);
          }
        }
      } catch (err) {
        console.error("[AuthStore] Auto-login failed:", err);
        localStorage.removeItem("decathlon_token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: { email?: string; phone?: string; password?: string }) => {
    setError(null);
    try {
      const response = await api.post("/api/auth/login", credentials);
      if (response.data && response.data.success) {
        const { token: userToken, user: userData } = response.data;
        localStorage.setItem("decathlon_token", userToken);
        setToken(userToken);
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, message: response.data.message || "Invalid Credentials" };
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Invalid Credentials";
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (details: { name: string; email?: string; phone?: string; password?: string }) => {
    setError(null);
    try {
      const response = await api.post("/api/auth/register", details);
      if (response.data && response.data.success) {
        const { token: userToken, user: userData } = response.data;
        localStorage.setItem("decathlon_token", userToken);
        setToken(userToken);
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, message: response.data.message || "Registration failed" };
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const forgotPassword = async (emailOrPhone: { email?: string; phone?: string }) => {
    setError(null);
    try {
      const response = await api.post("/api/auth/forgot-password", emailOrPhone);
      if (response.data && response.data.success) {
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message || "Request failed" };
    } catch (err: any) {
      const msg = err.response?.data?.message || "Request failed";
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const resetPassword = async (payload: { email?: string; phone?: string; newPassword?: string }) => {
    setError(null);
    try {
      const response = await api.post("/api/auth/reset-password", payload);
      if (response.data && response.data.success) {
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message || "Reset failed" };
    } catch (err: any) {
      const msg = err.response?.data?.message || "Reset failed";
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("[AuthStore] Logout API call failed:", err);
    } finally {
      localStorage.removeItem("decathlon_token");
      setToken(null);
      setUser(null);
    }
  };

  const clearError = () => setError(null);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
