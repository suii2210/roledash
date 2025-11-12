"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppUser, meRequest } from "@/lib/api";

type AuthContextValue = {
  user: AppUser | null;
  token: string | null;
  loading: boolean;
  login: (payload: { user: AppUser; token: string }) => void;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "fs_role_app_token";
const USER_KEY = "fs_role_app_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const login = useCallback(
    ({ user: nextUser, token: nextToken }: { user: AppUser; token: string }) => {
      setUser(nextUser);
      setToken(nextToken);
      localStorage.setItem(TOKEN_KEY, nextToken);
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    },
    []
  );

  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      const { user: fetchedUser } = await meRequest(token);
      setUser(fetchedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(fetchedUser));
    } catch (error) {
      console.error("Failed to refresh session", error);
      logout();
    }
  }, [logout, token]);

  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            localStorage.removeItem(USER_KEY);
          }
        }
        try {
          const { user: fetchedUser } = await meRequest(storedToken);
          setUser(fetchedUser);
          localStorage.setItem(USER_KEY, JSON.stringify(fetchedUser));
        } catch (error) {
          console.error("Session bootstrap failed", error);
          logout();
        }
      }
      setLoading(false);
    };

    bootstrap();
  }, [logout]);

  const value: AuthContextValue = {
    user,
    token,
    loading,
    login,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
