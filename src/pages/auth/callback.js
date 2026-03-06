import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { getSupabaseConfigStatus, supabase } from '@site/src/utils/supabaseClient';
import { getNextPathFromSearch } from '@site/src/utils/nextPath';

export default function AuthCallback() {
  const [msg, setMsg] = useState('Confirming your email...');
  const supabaseConfig = getSupabaseConfigStatus();

  useEffect(() => {
    const run = async () => {
      if (!supabase || !supabaseConfig.ok) {
        setMsg('Supabase is not configured.');
        return;
      }

      const nextPath = getNextPathFromSearch(window.location.search || '', '/');

      try {
        const hasCode = window.location.search.includes('code=');
        const hasHash = Boolean(window.location.hash);

        let sessionData = await supabase.auth.getSession();

        if (!sessionData?.data?.session && (hasCode || hasHash)) {
          await supabase.auth.exchangeCodeForSession(window.location.href);
          sessionData = await supabase.auth.getSession();
        }

        window.history.replaceState({}, '', nextPath);
        window.location.href = nextPath;
      } catch {
        window.history.replaceState({}, '', nextPath);
        window.location.href = nextPath;
      }
    };

    run();
  }, [supabaseConfig.ok]);

  return (
    <Layout title="Auth Callback">
      <main style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p>{msg}</p>
      </main>
    </Layout>
  );
}
