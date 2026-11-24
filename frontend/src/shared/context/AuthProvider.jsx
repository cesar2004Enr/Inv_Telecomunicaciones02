import { useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    if (token && userData) {
      try {
        return { ...JSON.parse(userData), token };
      } catch {
        return token ? { token } : null;
      }
    }
    return token ? { token } : null;
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const response = await api.login(credentials);
      const { user: userData, token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(userData));
      setUser({ ...userData, token });
      return userData;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
