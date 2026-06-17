import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useContext } from "react";
import api from "@/api/axiosInstance";
import { AuthContext } from "./AuthContext";

const TOKEN_KEY = "sanctum_token";
const USER_KEY = "admin_user";
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isChecking, setIsChecking] = useState(
    () => !!localStorage.getItem(TOKEN_KEY),
  );

  const persistAuth = useCallback((token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setToken(token);
    setUser(user);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);

    if (!savedToken) return;

    api
      .get("/auth/check-token")
      .then((res) => {
        setToken(savedToken);
        setUser(res.data ?? JSON.parse(localStorage.getItem(USER_KEY)));
      })
      .catch(() => clearAuth())
      .finally(() => setIsChecking(false));
  }, [clearAuth]);

  // Listen for 401 from axios interceptor
  useEffect(() => {
    const handleExpired = () => clearAuth();
    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, [clearAuth]);

  const login = useCallback(
    async (email, password) => {
      const res = await api.post("/auth/login", { email, password });
      persistAuth(res.data.token, res.data.user);
      return res;
    },
    [persistAuth],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const hasPermission = useCallback(
    (permissionName) => {
      if (!user) return false;
      if (user.roles?.includes("Super Admin")) return true;
      return user.permissions?.includes(permissionName) || false;
    },
    [user],
  );

  const hasRole = useCallback(
    (roleName) => {
      if (!user) return false;
      return user.roles?.includes(roleName) || false;
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isChecking,
        login,
        logout,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
