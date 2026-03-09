import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshTimer = useRef(null);

  // Schedule silent refresh 1 minute before expiry (token lives 15min)
  function scheduleRefresh() {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(silentRefresh, 14 * 60 * 1000);
  }

  const silentRefresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.accessToken);
        setAdmin(data.admin);
        scheduleRefresh();
      } else {
        setAccessToken(null);
        setAdmin(null);
      }
    } catch {
      setAccessToken(null);
      setAdmin(null);
    }
  }, []);

  // Try to restore session on mount
  useEffect(() => {
    silentRefresh().finally(() => setLoading(false));
    return () => { if (refreshTimer.current) clearTimeout(refreshTimer.current); };
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Connexion échouée.');
    setAccessToken(data.accessToken);
    setAdmin(data.admin);
    scheduleRefresh();
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        credentials: 'include'
      });
    } catch {}
    setAccessToken(null);
    setAdmin(null);
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
  }, [accessToken]);

  // Authenticated fetch helper
  const authFetch = useCallback(async (url, options = {}) => {
    const headers = { ...(options.headers || {}), Authorization: `Bearer ${accessToken}` };
    let res = await fetch(url, { ...options, headers, credentials: 'include' });

    if (res.status === 401) {
      // Try refresh
      await silentRefresh();
      if (!accessToken) throw new Error('Session expirée.');
      headers.Authorization = `Bearer ${accessToken}`;
      res = await fetch(url, { ...options, headers, credentials: 'include' });
    }
    return res;
  }, [accessToken, silentRefresh]);

  return (
    <AuthContext.Provider value={{ admin, accessToken, loading, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
