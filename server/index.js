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

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(process.env.PORT || 5000, () => {
  console.log(`SaudiLab API running on http://localhost:${process.env.PORT || 5000}`);
});
