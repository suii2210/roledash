import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, profileApi, setAuthToken } from '../services/api';

const AuthContext = createContext(null);

const getStored = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return { token, user: user ? JSON.parse(user) : null };
  } catch {
    return { token: null, user: null };
  }
};

// Prime axios with any stored token so first render API calls have Authorization set
const stored = getStored();
if (stored.token) {
  setAuthToken(stored.token);
}

export const AuthProvider = ({ children }) => {
  const [{ token, user }, setAuth] = useState(stored);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  useEffect(() => {
    if (token && !user) {
      refreshProfile().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const persist = (nextToken, nextUser) => {
    setAuth({ token: nextToken, user: nextUser });
    if (nextToken) {
      localStorage.setItem('token', nextToken);
      localStorage.setItem('user', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setAuthToken(nextToken);
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const res = await authApi.login(payload);
      persist(res.data.token, res.data.user);
      return res.data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await authApi.register(payload);
      persist(res.data.token, res.data.user);
      return res.data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    persist(null, null);
  };

  const refreshProfile = async () => {
    if (!token) return null;
    const res = await profileApi.me();
    persist(token, res.data.user);
    return res.data.user;
  };

  const value = useMemo(
    () => ({ token, user, loading, login, register, logout, refreshProfile }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
