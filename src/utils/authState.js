import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearToken, getMe, getToken } from './auth';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const refresh = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const me = await getMe();
      setUser(me.user);
    } catch (e) {
      clearToken();
      setUser(null);
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
      refresh,
      logout: () => {
        clearToken();
        setUser(null);
        window.location.href = '/';
      },
    }),
    [loading, user]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
