"use client";

import { createContext, useState, useEffect, useCallback } from "react";

interface User {
  id: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ `fetchUser` est maintenant stable grâce à `useCallback`
  const fetchUser = useCallback((token: string) => {
    console.log("🔍 Envoi du token pour récupération de l'utilisateur...");
  
    fetch("/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🔍 Réponse API:", data);
        if (data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          throw new Error("Utilisateur non trouvé");
        }
      })
      .catch((error) => {
        console.log("❌ Erreur lors de la récupération de l'utilisateur:", error);
        logout(); // Un seul appel ici
      });
  }, []);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token); // ✅ Plus de warning
    }
  }, [fetchUser]); // ✅ fetchUser est maintenant stable

  function login(token: string) {
    console.log("✅ Connexion réussie, stockage du token...");
    localStorage.setItem("token", token);
    fetchUser(token);
  }

  function logout() {
    console.log("🚪 Déconnexion, suppression du token...");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
