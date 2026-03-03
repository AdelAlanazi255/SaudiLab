import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { getSupabaseConfigStatus, supabase } from '@site/src/utils/supabaseClient';

export default function AuthCallback() {
  const [msg, setMsg] = useState('Confirming your email...');
  const supabaseConfig = getSupabaseConfigStatus();

  useEffect(() => {
    const run = async () => {
      if (!supabase || !supabaseConfig.ok) {
        setMsg('Supabase is not configured.');
        return;
      }

      try {
        const hasCode = window.location.search.includes('code=');
        const hasHash = Boolean(window.location.hash);

        let sessionData = await supabase.auth.getSession();

        if (!sessionData?.data?.session && (hasCode || hasHash)) {
          await supabase.auth.exchangeCodeForSession(window.location.href);
          sessionData = await supabase.auth.getSession();
        }

        window.history.replaceState({}, '', '/');
        window.location.href = '/';
      } catch {
        window.history.replaceState({}, '', '/');
        window.location.href = '/';
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
