import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { loginUser, registerUser, getMe, refreshToken, logoutUser } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    try {
      const { token: newToken } = await refreshToken();
      setToken(newToken);
      const me = await getMe(newToken);
      setUser(me.user);
    } catch {
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const login = useCallback(async (email, password) => {
    const { user: u, token: t } = await loginUser({ email, password });
    setUser(u);
    setToken(t);
    return u;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { user: u, token: t } = await registerUser({ name, email, password });
    setUser(u);
    setToken(t);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}


