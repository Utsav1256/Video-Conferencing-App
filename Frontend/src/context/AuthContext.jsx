import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { loginUser, registerUser, getMe, refreshToken, logoutUser } from '../services/auth';

const AuthContext = createContext(null);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token and user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }
    }
  }, []);

  const loadSession = useCallback(async () => {
    try {
      // First try to use stored token
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        try {
          const me = await getMe(storedToken);
          setUser(me.user);
          setToken(storedToken);
          localStorage.setItem(USER_KEY, JSON.stringify(me.user));
          setLoading(false);
          return;
        } catch (e) {
          // If stored token is invalid, try to refresh
          console.log('Stored token invalid, attempting refresh...');
        }
      }
      
      // Try to refresh token
      const { token: newToken } = await refreshToken();
      setToken(newToken);
      localStorage.setItem(TOKEN_KEY, newToken);
      const me = await getMe(newToken);
      setUser(me.user);
      localStorage.setItem(USER_KEY, JSON.stringify(me.user));
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
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
    // Save to localStorage
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    return u;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { user: u, token: t } = await registerUser({ name, email, password });
    setUser(u);
    setToken(t);
    // Save to localStorage
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    return u;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    setToken(null);
    // Clear localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}


