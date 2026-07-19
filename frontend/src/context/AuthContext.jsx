import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api, { formatApiErrorDetail } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null); // null=checking, false=unauth, obj=auth
  const [checked, setChecked] = useState(false);

  const bootstrap = useCallback(async () => {
    const token = localStorage.getItem("dc_admin_token");
    if (!token) {
      setAdmin(false);
      setChecked(true);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setAdmin(data);
    } catch (e) {
      localStorage.removeItem("dc_admin_token");
      setAdmin(false);
    } finally {
      setChecked(true);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("dc_admin_token", data.access_token);
      setAdmin(data.user);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: formatApiErrorDetail(e.response?.data?.detail) || e.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("dc_admin_token");
    setAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ admin, checked, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
