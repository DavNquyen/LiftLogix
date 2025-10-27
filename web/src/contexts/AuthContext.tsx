"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth as authApi } from "@/lib/api";

// Type definitions
interface User {
  id: number;
  email: string;
  name: string;
  height_cm?: number;
  weight_kg?: number;
  units: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create context with undefined default (will be provided by AuthProvider)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check if user is authenticated by verifying token
  const checkAuth = async () => {
    try {
      // Only check if we're in the browser (not during SSR)
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("access_token");

      // If no token, user is not authenticated
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Verify token is valid by fetching user data
      const userData = await authApi.getMe();
      setUser(userData);
      setError(null);
    } catch (err) {
      // Token is invalid or expired - clear it
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
      setError(null); // Don't show error on initial auth check
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      // Call login API (this stores tokens in localStorage)
      await authApi.login({ email, password });

      // Fetch user data after successful login
      const userData = await authApi.getMe();
      setUser(userData);
    } catch (err: any) {
      const errorMessage = err.message || "Login failed. Please try again.";
      setError(errorMessage);
      throw err; // Re-throw so calling component can handle it
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      // Register new user
      await authApi.register({ name, email, password });

      // Automatically log in after registration
      await authApi.login({ email, password });

      // Fetch user data
      const userData = await authApi.getMe();
      setUser(userData);
    } catch (err: any) {
      const errorMessage = err.message || "Registration failed. Please try again.";
      setError(errorMessage);
      throw err; // Re-throw so calling component can handle it
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authApi.logout(); // Clears localStorage
    setUser(null);
    setError(null);
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
