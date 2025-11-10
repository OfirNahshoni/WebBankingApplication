import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { login as loginRequest } from "../../lib/api";
import { clearTokenCookie, getTokenCookie, setTokenCookie } from "../../lib/cookies";

export type AuthUser = {
  email: string;
  name?: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setAuthenticatedUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const token = getTokenCookie();
    if (token && !user) {
      setUser({ email: "session@user" });
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginRequest({ email, password });
    setTokenCookie(response.token);
    setUser({ email: response.email });
  }, []);

  const logout = useCallback(() => {
    clearTokenCookie();
    setUser(null);
  }, []);

  const setAuthenticatedUser = useCallback((nextUser: AuthUser | null) => {
    setUser(nextUser);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, login, logout, setAuthenticatedUser }),
    [login, logout, setAuthenticatedUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
