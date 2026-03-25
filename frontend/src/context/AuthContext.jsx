import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const readSession = () =>
  JSON.parse(localStorage.getItem("user")) ||
  JSON.parse(localStorage.getItem("admin"));

const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(readSession);

  useEffect(() => {
    const sync = () => setSession(readSession());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const saveSession = (key, payload) => {
    localStorage.removeItem(key === "user" ? "admin" : "user");
    localStorage.setItem(key, JSON.stringify(payload));
    setSession(payload);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    setSession(null);
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      token: session?.token || null,
      isAuthenticated: Boolean(session?.token),
      isAdmin: session?.user?.role === "admin",
      saveUserSession: (payload) => saveSession("user", payload),
      saveAdminSession: (payload) => saveSession("admin", payload),
      logout,
      refreshSession: () => setSession(readSession()),
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
