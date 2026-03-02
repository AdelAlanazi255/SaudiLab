import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { getSupabaseConfigStatus, supabase } from '@site/src/utils/supabaseClient';

export default function AuthCallback() {
  const [msg, setMsg] = useState('Signing you in...');
  const supabaseConfig = getSupabaseConfigStatus();

  useEffect(() => {
    const run = async () => {
      if (!supabase || !supabaseConfig.ok) {
        setMsg('Supabase is not configured.');
        return;
      }

      try {
        for (let attempt = 0; attempt < 10; attempt += 1) {
          const { data } = await supabase.auth.getSession();
          if (data?.session) {
            window.location.href = '/account';
            return;
          }
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
        window.location.href = '/login';
      } catch {
        window.location.href = '/login';
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
