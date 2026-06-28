"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PROTECTED_ROUTES = ["/dashboard", "/portefeuille", "/contrats", "/investissements", "/documents", "/profil"];
const ADMIN_ROUTES = ["/gestion-sb"];
const PUBLIC_ROUTES = ["/", "/services", "/produits", "/actualites", "/contact", "/connexion", "/mentions-legales"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!user && !!accessToken;
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  // Rafraîchir le token ou vérifier la session
  const refreshAuth = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        return false;
      }

      const data = await response.json();
      setAccessToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      return true;
    } catch {
      setUser(null);
      setAccessToken(null);
      return false;
    }
  }, []);

  // Connexion
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || "Erreur de connexion" };
      }

      setAccessToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      return { success: true };
    } catch {
      return { success: false, error: "Erreur de connexion au serveur" };
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        credentials: "include",
      });
    } catch {
      // Même si l'API échoue, on déconnecte côté client
    }

    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    router.push("/connexion");
  };

  // Initialisation : vérifier si l'utilisateur a un token en mémoire
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      const storedToken = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        // Vérifier si le token est encore valide
        try {
          const response = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${storedToken}` },
          });

          if (response.ok) {
            const userData = await response.json();
            setAccessToken(storedToken);
            setUser(userData);
          } else {
            // Token expiré, essayer le refresh
            const refreshed = await refreshAuth();
            if (!refreshed) {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("user");
            }
          }
        } catch {
          const refreshed = await refreshAuth();
          if (!refreshed) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
          }
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, [refreshAuth]);

  // Protection des routes : rediriger si non authentifié
  useEffect(() => {
    if (isLoading) return;

    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));

    // Si c'est une route protégée et pas authentifié → rediriger vers connexion
    if ((isProtectedRoute || isAdminRoute) && !isAuthenticated) {
      const params = new URLSearchParams({ redirect: pathname });
      router.push(`/connexion?${params.toString()}`);
      return;
    }

    // Si c'est une route admin et pas admin → rediriger vers dashboard
    if (isAdminRoute && isAuthenticated && !isAdmin) {
      router.push("/dashboard");
      return;
    }

    // Si on est sur la page connexion et déjà authentifié → rediriger
    if (pathname === "/connexion" && isAuthenticated) {
      const redirectTo = new URLSearchParams(window.location.search).get("redirect") || "/dashboard";
      router.push(redirectTo);
      return;
    }
  }, [isLoading, isAuthenticated, isAdmin, pathname, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
}
