import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '@site/src/utils/authState';
import { hasSupabaseConfig, supabase } from '@site/src/utils/supabaseClient';
import PageContainer from '@site/src/components/layout/PageContainer';
import Section from '@site/src/components/layout/Section';

function fmtDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString();
}

export default function AdminFeedbackPage() {
  const auth = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const userId = useMemo(() => auth?.user?.id || null, [auth?.user?.id]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (auth?.loading) return;

      if (!auth?.isLoggedIn || !userId) {
        if (mounted) {
          setLoading(false);
          window.location.href = '/login';
        }
        return;
      }

      if (!supabase || !hasSupabaseConfig) {
        if (mounted) {
          setErr('Supabase is not configured.');
          setLoading(false);
        }
        return;
      }

      try {
        const { data: me, error: meErr } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .maybeSingle();

        if (meErr) throw meErr;

        const authorized = me?.role === 'admin';
        if (!authorized) {
          if (mounted) {
            setIsAdmin(false);
            setLoading(false);
            window.location.href = '/account';
          }
          return;
        }

        if (mounted) setIsAdmin(true);

        const { data, error } = await supabase
          .from('feedback')
          .select('id, created_at, email, category, message, page_url')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (mounted) setRows(data || []);
      } catch (e) {
        if (mounted) setErr(e?.message || 'Failed to load feedback.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [auth?.loading, auth?.isLoggedIn, userId]);

  if (auth?.loading || loading) {
    return (
      <Layout title="Admin Feedback">
        <PageContainer>
          <Section>Loading...</Section>
        </PageContainer>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout title="Admin Feedback">
        <PageContainer>
          <Section>Not authorized.</Section>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Feedback">
      <PageContainer>
        <Section>
        <h1 style={{ marginBottom: '1rem' }}>Feedback</h1>

        {err ? <div style={{ marginBottom: '1rem', color: '#ffb0b0' }}>{err}</div> : null}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Message</th>
                <th style={thStyle}>Page</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td style={tdStyle}>{fmtDate(row.created_at)}</td>
                  <td style={tdStyle}>{row.email || '-'}</td>
                  <td style={tdStyle}>{row.category || '-'}</td>
                  <td style={tdStyle}>{row.message || '-'}</td>
                  <td style={tdStyle}>{row.page_url || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </Section>
      </PageContainer>
    </Layout>
  );
}

const thStyle = {
  textAlign: 'left',
  borderBottom: '1px solid var(--sl-border)',
  padding: '0.65rem 0.5rem',
  color: 'var(--sl-muted)',
  fontWeight: 800,
  fontSize: '0.86rem',
};

const tdStyle = {
  borderBottom: '1px solid var(--sl-border)',
  padding: '0.65rem 0.5rem',
  verticalAlign: 'top',
  fontSize: '0.92rem',
};
