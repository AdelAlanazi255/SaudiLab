import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

function getSupabaseConfigStatus() {
  const missing = [];
  if (!supabaseUrl) missing.push('REACT_APP_SUPABASE_URL');
  if (!supabaseAnonKey) missing.push('REACT_APP_SUPABASE_ANON_KEY');
  return { ok: missing.length === 0, missing };
}

const configStatus = getSupabaseConfigStatus();
const hasSupabaseConfig = configStatus.ok;

let warnedMissingConfig = false;

if (!hasSupabaseConfig && process.env.NODE_ENV !== 'production' && !warnedMissingConfig) {
  warnedMissingConfig = true;
  // eslint-disable-next-line no-console
  console.error(
    `Supabase is not configured. Missing: ${configStatus.missing.join(
      ', ',
    )}. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in .env.local, then restart the dev server.`,
  );
}

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export { getSupabaseConfigStatus };
export { hasSupabaseConfig };
