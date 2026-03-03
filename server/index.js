require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { getSupabaseConfigStatus, supabase } = require('./supabase');
const { requireAuth } = require('./middleware/requireAuth');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '25kb' }));

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://saudilab.io',
  'https://www.saudilab.io',
  'https://saudilab.vercel.app',
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      if (origin.endsWith('.vercel.app')) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.options(/.*/, (req, res) => res.sendStatus(204));

function pickProfileUsername(user) {
  const metadata = user?.user_metadata || {};
  return metadata.username || metadata.name || metadata.full_name || null;
}

function pickProfileAvatar(user) {
  const metadata = user?.user_metadata || {};
  return metadata.avatar_url || metadata.picture || null;
}

app.get('/health', (req, res) => res.json({ ok: true }));

const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

function validateEmail(raw) {
  const email = String(raw || '').trim().toLowerCase();
  if (!email) return { ok: false, email: '', error: 'Email is required' };
  const basicPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicPattern.test(email)) return { ok: false, email, error: 'Email is not valid' };
  return { ok: true, email, error: null };
}

app.post('/auth/sync', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const configStatus = getSupabaseConfigStatus();
    if (!configStatus.ok || !supabase) {
      return res.status(500).json({
        error: `Supabase server auth is not configured. Missing: ${configStatus.missing.join(', ')}`,
      });
    }

    const payload = {
      id: user.id,
      email: user.email || null,
      username: pickProfileUsername(user),
      avatar_url: pickProfileAvatar(user),
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select('*')
      .single();

    if (error) {
      console.error('SYNC PROFILE ERROR:', error);
      return res.status(500).json({ error: 'Failed to sync profile' });
    }

    return res.json({ profile: data });
  } catch (err) {
    console.error('SYNC PROFILE ERROR:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/auth/me', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const configStatus = getSupabaseConfigStatus();
    if (!configStatus.ok || !supabase) {
      return res.status(500).json({
        error: `Supabase server auth is not configured. Missing: ${configStatus.missing.join(', ')}`,
      });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('SUPABASE ME ERROR:', error);
      return res.status(500).json({ error: 'Failed to load profile' });
    }

    return res.json({ user, profile: profile || null });
  } catch (err) {
    console.error('SUPABASE ME ERROR:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/account/change-email', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const configStatus = getSupabaseConfigStatus();
    if (!configStatus.ok || !supabase) {
      return res.status(500).json({
        error: `Supabase server auth is not configured. Missing: ${configStatus.missing.join(', ')}`,
      });
    }

    const checked = validateEmail(req.body?.email);
    if (!checked.ok) {
      return res.status(400).json({ error: checked.error });
    }
    if ((user.email || '').toLowerCase() === checked.email) {
      return res.status(400).json({ error: 'New email must be different from current email' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, last_email_change_at')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('CHANGE EMAIL PROFILE ERROR:', profileError);
      return res.status(500).json({ error: 'Failed to load profile cooldown state' });
    }
    if (!profile) {
      return res.status(404).json({ error: 'Profile was not found for this user' });
    }

    if (profile.last_email_change_at) {
      const elapsedMs = Date.now() - new Date(profile.last_email_change_at).getTime();
      const remainingMs = FIVE_DAYS_MS - elapsedMs;
      if (remainingMs > 0) {
        return res.status(429).json({
          error: 'Email can only be changed once every 5 days',
          remainingDays: Math.ceil(remainingMs / (24 * 60 * 60 * 1000)),
        });
      }
    }

    const { error: updateAuthError } = await supabase.auth.admin.updateUserById(user.id, {
      email: checked.email,
    });
    if (updateAuthError) {
      console.error('CHANGE EMAIL AUTH ERROR:', updateAuthError);
      return res.status(400).json({ error: updateAuthError.message || 'Failed to update auth email' });
    }

    const nowIso = new Date().toISOString();
    const { data: updatedProfile, error: updateProfileError } = await supabase
      .from('profiles')
      .update({ last_email_change_at: nowIso })
      .eq('id', user.id)
      .select('last_email_change_at')
      .single();

    if (updateProfileError) {
      console.error('CHANGE EMAIL PROFILE UPDATE ERROR:', updateProfileError);
      return res.status(500).json({ error: 'Email changed, but failed to update cooldown state' });
    }

    return res.json({
      ok: true,
      message: 'Email updated successfully',
      lastEmailChangeAt: updatedProfile?.last_email_change_at || nowIso,
    });
  } catch (err) {
    console.error('CHANGE EMAIL ERROR:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(process.env.PORT || 5000, () => {
  console.log(`SaudiLab API running on http://localhost:${process.env.PORT || 5000}`);
});
