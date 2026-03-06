import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { hasSupabaseConfig, supabase } from './supabaseClient';
import {
  LEARNING_MODE_GUIDED,
  getProfileLearningMode,
  isStoredLearningMode,
  normalizeLearningMode,
  setCurrentLearningMode,
  setCurrentUserAuthenticated,
  setCurrentUserRole,
} from './learningMode';

const AuthCtx = createContext(null);
const PROFILE_SELECT = 'id, email, role, username, last_email_change_at, learning_mode';
const PROFILE_SELECT_FALLBACK = 'id, email, role, username, last_email_change_at';

function deriveUsername(user) {
  const metadata = user?.user_metadata || {};
  return metadata.username || metadata.name || metadata.full_name || null;
}

function hasMissingLearningModeColumn(error) {
  const message = String(error?.message || '').toLowerCase();
  return message.includes('learning_mode') && message.includes('column');
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
    learning_mode: profile?.learning_mode ?? null,
  });
  // eslint-disable-next-line no-console
  console.log('[auth-debug] isAdmin:', profile?.role === 'admin');
}

async function selectProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_SELECT)
    .eq('id', userId)
    .maybeSingle();

  if (!error) return data || null;
  if (!hasMissingLearningModeColumn(error)) throw error;

  const { data: fallbackData, error: fallbackError } = await supabase
    .from('profiles')
    .select(PROFILE_SELECT_FALLBACK)
    .eq('id', userId)
    .maybeSingle();
  if (fallbackError) throw fallbackError;
  if (!fallbackData) return null;
  return { ...fallbackData, learning_mode: null };
}

async function fetchOrInitProfile(user) {
  if (!supabase || !user?.id) return null;

  const existing = await selectProfile(user.id);
  if (existing) {
    const authEmail = String(user.email || '').trim().toLowerCase();
    const profileEmail = String(existing.email || '').trim().toLowerCase();

    if (authEmail && authEmail !== profileEmail) {
      const nowIso = new Date().toISOString();
      const { data: synced, error: syncError } = await supabase
        .from('profiles')
        .update({
          email: authEmail,
          last_email_change_at: nowIso,
        })
        .eq('id', user.id)
        .select(PROFILE_SELECT)
        .single();

      if (syncError) {
        if (!hasMissingLearningModeColumn(syncError)) {
          // eslint-disable-next-line no-console
          console.error('[auth] profile email sync failed:', syncError);
        } else {
          const { data: fallbackSynced, error: fallbackSyncError } = await supabase
            .from('profiles')
            .update({
              email: authEmail,
              last_email_change_at: nowIso,
            })
            .eq('id', user.id)
            .select(PROFILE_SELECT_FALLBACK)
            .single();
          if (!fallbackSyncError) {
            return { ...fallbackSynced, learning_mode: existing.learning_mode ?? null };
          }
          // eslint-disable-next-line no-console
          console.error('[auth] profile fallback email sync failed:', fallbackSyncError);
        }
        return existing;
      }

      return synced || existing;
    }

    return existing;
  }

  const upsertPayload = {
    id: user.id,
    email: user.email || null,
    username: deriveUsername(user),
    role: 'user',
  };

  const { data: created, error: upsertError } = await supabase
    .from('profiles')
    .upsert(upsertPayload, { onConflict: 'id' })
    .select(PROFILE_SELECT)
    .single();

  if (!upsertError) return created || null;
  if (!hasMissingLearningModeColumn(upsertError)) throw upsertError;

  const { data: fallbackCreated, error: fallbackUpsertError } = await supabase
    .from('profiles')
    .upsert(upsertPayload, { onConflict: 'id' })
    .select(PROFILE_SELECT_FALLBACK)
    .single();
  if (fallbackUpsertError) throw fallbackUpsertError;
  return fallbackCreated ? { ...fallbackCreated, learning_mode: null } : null;
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
        setCurrentLearningMode(LEARNING_MODE_GUIDED);
        setCurrentUserRole('user');
        setCurrentUserAuthenticated(false);
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
          setCurrentLearningMode(getProfileLearningMode(nextProfile));
          setCurrentUserRole(nextProfile?.role || 'user');
          setCurrentUserAuthenticated(true);
          logAdminDebug(nextSession.user, nextProfile);
        } catch (profileError) {
          // eslint-disable-next-line no-console
          console.error('[auth] profile fetch failed:', profileError);
          setProfile(null);
          setCurrentLearningMode(LEARNING_MODE_GUIDED);
          setCurrentUserRole('user');
          setCurrentUserAuthenticated(true);
        }
      } else {
        setProfile(null);
        setCurrentLearningMode(LEARNING_MODE_GUIDED);
        setCurrentUserRole('user');
        setCurrentUserAuthenticated(false);
      }
    } catch {
      setSession(null);
      setUser(null);
      setProfile(null);
      setCurrentLearningMode(LEARNING_MODE_GUIDED);
      setCurrentUserRole('user');
      setCurrentUserAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!supabase || !hasSupabaseConfig) return;

    const hash = String(window.location.hash || '');
    const hasAuthTokens = hash.includes('access_token=') || hash.includes('refresh_token=');
    if (!hasAuthTokens) return;

    supabase.auth.getSession().finally(() => {
      const cleanUrl = `${window.location.pathname}${window.location.search || ''}`;
      window.history.replaceState({}, '', cleanUrl || '/');
    });
  }, []);

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
            setCurrentLearningMode(getProfileLearningMode(nextProfile));
            setCurrentUserRole(nextProfile?.role || 'user');
            setCurrentUserAuthenticated(true);
            logAdminDebug(nextSession.user, nextProfile);
          })
          .catch((profileError) => {
            // eslint-disable-next-line no-console
            console.error('[auth] profile fetch failed:', profileError);
            setProfile(null);
            setCurrentLearningMode(LEARNING_MODE_GUIDED);
            setCurrentUserRole('user');
            setCurrentUserAuthenticated(true);
          })
          .finally(() => setLoading(false));
      } else {
        setProfile(null);
        setCurrentLearningMode(LEARNING_MODE_GUIDED);
        setCurrentUserRole('user');
        setCurrentUserAuthenticated(false);
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
      learningMode: getProfileLearningMode(profile),
      isLearningModeMissing: Boolean(user) && Boolean(profile) && !isStoredLearningMode(profile?.learning_mode),
      isLoggedIn: !!user,
      refresh,
      updateLearningMode: async (mode) => {
        if (!supabase || !hasSupabaseConfig) {
          return { ok: false, error: 'Supabase is not configured.' };
        }
        if (!user?.id) return { ok: false, error: 'No authenticated user found.' };

        const normalized = normalizeLearningMode(mode);
        const { data: updated, error } = await supabase
          .from('profiles')
          .update({ learning_mode: normalized })
          .eq('id', user.id)
          .select(PROFILE_SELECT)
          .single();

        if (error) {
          if (hasMissingLearningModeColumn(error)) {
            return { ok: false, error: 'Learning mode column is missing. Run the Supabase SQL migration first.' };
          }
          return { ok: false, error: error.message || 'Failed to update learning mode.' };
        }

        const nextProfile = updated || { ...(profile || {}), learning_mode: normalized };
        setProfile(nextProfile);
        setCurrentLearningMode(normalized);
        setCurrentUserRole(nextProfile?.role || 'user');
        setCurrentUserAuthenticated(true);
        return { ok: true, learningMode: normalized };
      },
      signOut: async () => {
        if (supabase && hasSupabaseConfig) {
          await supabase.auth.signOut();
        }
        setSession(null);
        setUser(null);
        setProfile(null);
        setCurrentLearningMode(LEARNING_MODE_GUIDED);
        setCurrentUserRole('user');
        setCurrentUserAuthenticated(false);
        window.location.href = '/';
      },
      logout: async () => {
        if (supabase && hasSupabaseConfig) {
          await supabase.auth.signOut();
        }
        setSession(null);
        setUser(null);
        setProfile(null);
        setCurrentLearningMode(LEARNING_MODE_GUIDED);
        setCurrentUserRole('user');
        setCurrentUserAuthenticated(false);
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
