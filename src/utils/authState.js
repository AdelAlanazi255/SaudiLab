import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { hasSupabaseConfig, supabase } from './supabaseClient';

const AuthCtx = createContext(null);

function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    return window.__docusaurus?.customFields?.API_BASE_URL || 'http://localhost:5000';
  }
  return 'http://localhost:5000';
}

async function syncProfile(accessToken) {
  const res = await fetch(`${getApiBaseUrl()}/auth/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to sync profile');
  return data.profile || null;
}

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  const refresh = async () => {
    setLoading(true);

    try {
      if (!supabase || !hasSupabaseConfig) {
        setSession(null);
        setUser(null);
        setProfile(null);
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      const nextSession = data?.session || null;
      setSession(nextSession);
      setUser(nextSession?.user || null);

      if (nextSession?.access_token) {
        try {
          const syncedProfile = await syncProfile(nextSession.access_token);
          setProfile(syncedProfile);
        } catch (syncError) {
          // eslint-disable-next-line no-console
          console.error('[auth] profile sync failed:', syncError);
        }
      } else {
        setProfile(null);
      }
    } catch {
      setSession(null);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();

    if (!supabase || !hasSupabaseConfig) return undefined;

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession || null);
      setUser(nextSession?.user || null);

      if (nextSession?.access_token) {
        syncProfile(nextSession.access_token)
          .then((syncedProfile) => {
            setProfile(syncedProfile);
          })
          .catch((syncError) => {
            // eslint-disable-next-line no-console
            console.error('[auth] profile sync failed:', syncError);
            setProfile(null);
          })
          .finally(() => setLoading(false));
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      data?.subscription?.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      loading,
      user,
      session,
      profile,
      isLoggedIn: !!user,
      refresh,
      signOut: async () => {
        if (supabase && hasSupabaseConfig) {
          await supabase.auth.signOut();
        }
        setSession(null);
        setUser(null);
        setProfile(null);
        window.location.href = '/';
      },
      logout: async () => {
        if (supabase && hasSupabaseConfig) {
          await supabase.auth.signOut();
        }
        setSession(null);
        setUser(null);
        setProfile(null);
        window.location.href = '/';
      },
    }),
    [loading, user, session, profile]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
