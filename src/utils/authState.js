import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { hasSupabaseConfig, supabase } from './supabaseClient';

const AuthCtx = createContext(null);

function deriveUsername(user) {
  const metadata = user?.user_metadata || {};
  return metadata.username || metadata.name || metadata.full_name || null;
}

function logAdminDebug(user, profile) {
  if (process.env.NODE_ENV === 'production') return;
  // eslint-disable-next-line no-console
  console.log('[auth-debug] session user:', {
    id: user?.id || null,
    email: user?.email || null,
  });
  // eslint-disable-next-line no-console
  console.log('[auth-debug] profile row:', {
    id: profile?.id || null,
    email: profile?.email || null,
    role: profile?.role || null,
  });
  // eslint-disable-next-line no-console
  console.log('[auth-debug] isAdmin:', profile?.role === 'admin');
}

async function fetchOrInitProfile(user) {
  if (!supabase || !user?.id) return null;

  const { data: existing, error: selectError } = await supabase
    .from('profiles')
    .select('id, email, role, username')
    .eq('id', user.id)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return existing;

  const upsertPayload = {
    id: user.id,
    email: user.email || null,
    username: deriveUsername(user),
    role: 'user',
  };

  const { data: created, error: upsertError } = await supabase
    .from('profiles')
    .upsert(upsertPayload, { onConflict: 'id' })
    .select('id, email, role, username')
    .single();

  if (upsertError) throw upsertError;
  return created || null;
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

      if (nextSession?.user) {
        try {
          const nextProfile = await fetchOrInitProfile(nextSession.user);
          setProfile(nextProfile);
          logAdminDebug(nextSession.user, nextProfile);
        } catch (profileError) {
          // eslint-disable-next-line no-console
          console.error('[auth] profile fetch failed:', profileError);
          setProfile(null);
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
      setLoading(true);
      setSession(nextSession || null);
      setUser(nextSession?.user || null);

      if (nextSession?.user) {
        fetchOrInitProfile(nextSession.user)
          .then((nextProfile) => {
            setProfile(nextProfile);
            logAdminDebug(nextSession.user, nextProfile);
          })
          .catch((profileError) => {
            // eslint-disable-next-line no-console
            console.error('[auth] profile fetch failed:', profileError);
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
