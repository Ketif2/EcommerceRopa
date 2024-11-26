import React, { createContext, useState, useEffect, useContext } from "react";
import { getTokens, storeTokens, clearTokens } from "../utils/indexedDB";
import { API_URL } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTokens = async () => {
      setLoading(true);
      const tokens = await getTokens();
      if (tokens) {
        const currentTime = new Date().getTime();
        const tokenLifetime = 30 * 24 * 60 * 60 * 1000; // 30 días

        if (currentTime - tokens.createdAt < tokenLifetime) {
          try {
            const response = await fetch(`${API_URL}/verify-token`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
              },
            });

            if (!response.ok) {
              throw new Error("Token inválido o expirado");
            }

            const userData = await response.json();
            setIsAuthenticated(true);
            setUser(userData);
          } catch (error) {
            console.error("Error al verificar el token:", error.message);
            await clearTokens();
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          await clearTokens();
        }
      }
      setLoading(false);
    };

    checkTokens();
  }, []);

  const login = async (accessToken, refreshToken, userData) => {
    setLoading(true);
    await storeTokens(accessToken, refreshToken);
    setIsAuthenticated(true);
    setUser(userData);
    setLoading(false);
  };

  const logout = async () => {
    await clearTokens();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
