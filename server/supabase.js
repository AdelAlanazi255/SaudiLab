const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function getSupabaseConfigStatus() {
  const missing = [];
  if (!supabaseUrl) missing.push('SUPABASE_URL');
  if (!supabaseServiceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  return { ok: missing.length === 0, missing };
}

const configStatus = getSupabaseConfigStatus();

if (!configStatus.ok) {
  // eslint-disable-next-line no-console
  console.error(
    `[supabase] Missing env vars: ${configStatus.missing.join(', ')}. Set these in server/.env.`,
  );
}

const supabase = configStatus.ok
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

module.exports = {
  supabase,
  getSupabaseConfigStatus,
};
