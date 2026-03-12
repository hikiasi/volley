"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: unknown;
  loading: boolean;
  login: (token: string, userData: unknown) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const login = (token: string, userData: unknown) => {
    localStorage.setItem("token", token);
    setUser(userData);
    // Note: Cookie is set by the API response
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/auth/login");
  };

  useEffect(() => {
    async function initAuth() {
      const tg = (window as { Telegram?: { WebApp?: { initData: string } } }).Telegram?.WebApp;
      const initData = tg?.initData;

      if (initData) {
        try {
          const res = await fetch("/api/auth/telegram", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initData }),
          });

          if (res.ok) {
            const { token, user: userData } = await res.json();
            localStorage.setItem("token", token);
            setUser(userData);
          }
        } catch (err) {
          console.error("TG Auth error:", err);
        }
      } else {
          // Check for existing token
          const token = localStorage.getItem("token");
          if (token) {
              try {
                  const res = await fetch("/api/user/profile", {
                      headers: { "Authorization": `Bearer ${token}` }
                  });
                  if (res.ok) {
                      setUser(await res.json());
                  } else {
                      localStorage.removeItem("token");
                  }
              } catch {
                  localStorage.removeItem("token");
              }
          }
      }
      setLoading(false);
    }

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
