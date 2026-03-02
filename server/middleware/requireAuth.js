const { getSupabaseConfigStatus, supabase } = require('../supabase');

async function requireAuth(req, res, next) {
  const configStatus = getSupabaseConfigStatus();
  if (!configStatus.ok || !supabase) {
    return res.status(500).json({
      error: `Supabase server auth is not configured. Missing: ${configStatus.missing.join(', ')}`,
    });
  }

  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';

  if (!token) {
    return res.status(401).json({ error: 'Missing Bearer access token' });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: 'Invalid or expired Supabase access token' });
  }

  req.user = data.user;
  return next();
}

module.exports = { requireAuth };
