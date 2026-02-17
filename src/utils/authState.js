import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearToken, getMe, getToken, api } from './auth';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [subscribed, setSubscribed] = useState(false);

  const refresh = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setSubscribed(false);
      setLoading(false);
      return;
    }

    try {
      const me = await getMe();
      setUser(me.user);

      const sub = await api('/billing/status');
      setSubscribed(!!sub.subscribed);
    } catch (e) {
      clearToken();
      setUser(null);
      setSubscribed(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const value = useMemo(
    () => ({
      loading,
      user,
      isLoggedIn: !!user,
      subscribed,
      refresh,
      logout: () => {
        clearToken();
        setUser(null);
        setSubscribed(false);
        window.location.href = '/';
      },
    }),
    [loading, user, subscribed]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
