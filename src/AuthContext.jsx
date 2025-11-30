// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("currentUser");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // ---------------- LOGIN ----------------
  const login = async (email, password) => {
    // call backend API
    const loggedUser = await loginUser({ email, password });

    // save user in state + localStorage
    setUser(loggedUser);
    localStorage.setItem("currentUser", JSON.stringify(loggedUser));
  };

  // ---------------- REGISTER ----------------
  const register = async (name, email, password) => {
    // call backend API
    return await registerUser({ name, email, password });
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
