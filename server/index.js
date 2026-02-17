
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const axios = require('axios');

const db = require('./db');

const app = express();

// ===== hard fail if JWT secret missing/weak =====
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  console.error('JWT_SECRET missing or too short. Put a 16+ char secret in server/.env');
  process.exit(1);
}

// ===== security middleware =====
app.use(helmet());
app.use(express.json({ limit: '25kb' }));

// CORS (dev + production)
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
      // allow server-to-server / tools without Origin header
      if (!origin) return cb(null, true);

      // allow exact matches
      if (allowedOrigins.includes(origin)) return cb(null, true);

      // allow Vercel preview deployments: https://xxxx.vercel.app
      if (origin.endsWith('.vercel.app')) return cb(null, true);

      return cb(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// handle preflight
app.options('*', cors());



// ===== rate limits =====
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Try again later.' },
});

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again later.' },
});

// apply to /auth
app.use('/auth', authLimiter);

// ===== helpers =====
function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function cleanUsername(u) {
  const s = (u || '').trim().toLowerCase();
  // 3–20 chars: letters, numbers, dot, underscore
  if (!/^[a-z0-9._]{3,20}$/.test(s)) return null;
  return s;
}

function cleanEmail(e) {
  const s = (e || '').trim().toLowerCase();
  if (!validator.isEmail(s)) return null;
  return s;
}

function passwordPolicy(pw) {
  const p = pw || '';
  if (p.length < 8) return 'Password must be at least 8 characters.';
  if (p.length > 72) return 'Password too long.';
  if (!/[A-Za-z]/.test(p) || !/[0-9]/.test(p)) {
    return 'Password must include at least 1 letter and 1 number.';
  }
  return null;
}

function safeUser(u) {
  return { id: u.id, username: u.username, email: u.email };
}

// ===== routes =====
app.get('/health', (req, res) => res.json({ ok: true }));

// REGISTER
app.post('/auth/register', (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    const u = cleanUsername(username);
    const e = cleanEmail(email);
    const pwErr = passwordPolicy(password);

    if (!u) return res.status(400).json({ error: 'Invalid username (3–20, a-z 0-9 . _).' });
    if (!e) return res.status(400).json({ error: 'Invalid email.' });
    if (pwErr) return res.status(400).json({ error: pwErr });

    const existing = db
      .prepare('SELECT id FROM users WHERE username = ? OR email = ?')
      .get(u, e);

    if (existing) return res.status(409).json({ error: 'Username or email already exists.' });

    const password_hash = bcrypt.hashSync(password, 12);
    const now = new Date().toISOString();

    const info = db
      .prepare(
        'INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)'
      )
      .run(u, e, password_hash, now);

    const user = { id: info.lastInsertRowid, username: u, email: e };
    const token = signToken(user);

    return res.json({ token, user });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// LOGIN (rate limited, generic errors to avoid enumeration)
app.post('/auth/login', loginLimiter, (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body || {};
    const key = (usernameOrEmail || '').trim().toLowerCase();

    if (!key || !password) {
      return res.status(400).json({ error: 'usernameOrEmail and password required.' });
    }

    const isEmail = validator.isEmail(key);
    const lookup = isEmail ? cleanEmail(key) : cleanUsername(key);
    if (!lookup) return res.status(400).json({ error: 'Invalid username/email format.' });

    const user = db
      .prepare('SELECT id, username, email, password_hash FROM users WHERE username = ? OR email = ?')
      .get(lookup, lookup);

    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials.' });

    const token = signToken(user);
    return res.json({ token, user: safeUser(user) });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ME
app.get('/auth/me', authMiddleware, (req, res) => {
  try {
    const u = db
      .prepare('SELECT id, username, email, created_at FROM users WHERE id = ?')
      .get(req.user.id);

    if (!u) return res.status(404).json({ error: 'User not found' });
    return res.json({ user: u });
  } catch (err) {
    console.error('ME ERROR:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// SUBSCRIPTION STATUS
app.get('/billing/status', authMiddleware, (req, res) => {
  try {
    const u = db.prepare('SELECT subscribed FROM users WHERE id = ?').get(req.user.id);
    return res.json({ subscribed: !!(u && u.subscribed) });
  } catch (err) {
    console.error('STATUS ERROR:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// TEST subscribe/unsubscribe (temporary)
app.post('/billing/subscribe', authMiddleware, (req, res) => {
  try {
    db.prepare('UPDATE users SET subscribed = 1 WHERE id = ?').run(req.user.id);
    return res.json({ ok: true, subscribed: true });
  } catch (err) {
    console.error('SUBSCRIBE ERROR:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/billing/unsubscribe', authMiddleware, (req, res) => {
  try {
    db.prepare('UPDATE users SET subscribed = 0 WHERE id = ?').run(req.user.id);
    return res.status(500).json({ ok: true, subscribed: false });
  } catch (err) {
    console.error('UNSUBSCRIBE ERROR:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ============================
// MOYASAR TEST PAYMENT ROUTES
// ============================

app.post('/billing/moyasar/create', authMiddleware, async (req, res) => {
  try {
    const { plan, token } = req.body || {};

    const amount =
      plan === 'student' ? 100 :
      plan === 'normal' ? 500 :
      null;

    if (!amount) return res.status(400).json({ error: 'Invalid plan' });
    if (!token) return res.status(400).json({ error: 'Missing token' });

    const sk = process.env.MOYASAR_SECRET_KEY;
    if (!sk) return res.status(500).json({ error: 'Missing MOYASAR_SECRET_KEY in server/.env' });

    // ✅ DEBUG: verify token belongs to this secret key/account
    try {
      await axios.get(`https://api.moyasar.com/v1/tokens/${token}`, {
        auth: { username: sk, password: '' },
      });
    } catch (e) {
      const d = e.response?.data || { message: e.message };
      console.error('MOYASAR TOKEN FETCH FAILED:', d);

      return res.status(400).json({
        error: 'Token not valid for this secret key (sk mismatch)',
        details: d,
        hint: 'Make sure pk_test and sk_test are from the SAME Moyasar account/test mode.',
      });
    }

    // Create payment
    const resp = await axios.post(
      'https://api.moyasar.com/v1/payments',
      {
        amount,
        currency: 'SAR',
        description: `SaudiLab ${plan} subscription (test)`,
       callback_url: 'https://saudilab.io/payment-success',
        metadata: { userId: String(req.user.id), plan: String(plan) },
        source: { type: 'token', token },
      },
      {
        auth: { username: sk, password: '' },
        headers: { 'Content-Type': 'application/json' },
      }
    );

    return res.json({
      paymentId: resp.data.id,
      status: resp.data.status,
      redirectUrl: resp.data.source?.transaction_url || null,
    });
  } catch (err) {
    const details = err.response?.data || { message: err.message };
    console.error('MOYASAR CREATE ERROR DETAILS:', details);
    return res.status(400).json({
      error: details.message || 'Payment create failed',
      details: details.errors || details,
    });
  }
});




// Check Moyasar payment status + activate subscription if paid
app.get('/billing/moyasar/status/:paymentId', authMiddleware, async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!process.env.MOYASAR_SECRET_KEY) {
      return res.status(500).json({ error: 'Missing MOYASAR_SECRET_KEY in server/.env' });
    }

    const resp = await axios.get(`https://api.moyasar.com/v1/payments/${paymentId}`, {
      auth: { username: process.env.MOYASAR_SECRET_KEY, password: '' },
    });

    const p = resp.data;
    const isPaid = p.status === 'paid';

    if (isPaid) {
      db.prepare('UPDATE users SET subscribed = 1 WHERE id = ?').run(req.user.id);
    }

    return res.json({ status: p.status, paid: isPaid });
  } catch (err) {
    console.error('MOYASAR STATUS ERROR:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Payment status check failed' });
  }
});

app.get('/billing/moyasar/pk', (req, res) => {
  return res.json({ pk: process.env.MOYASAR_PUBLIC_KEY || null });
});

app.post('/billing/moyasar/hosted', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body || {};

    const amount =
      plan === 'student' ? 100 :
      plan === 'normal' ? 500 :
      null;

    if (!amount) return res.status(400).json({ error: 'Invalid plan' });

    const sk = process.env.MOYASAR_SECRET_KEY;
    const pk = process.env.MOYASAR_PUBLIC_KEY;

    if (!sk) return res.status(500).json({ error: 'Missing MOYASAR_SECRET_KEY' });
    if (!pk) return res.status(500).json({ error: 'Missing MOYASAR_PUBLIC_KEY' });

    // ✅ create a hosted payment page (Moyasar transaction_url)
    const resp = await axios.post(
      'https://api.moyasar.com/v1/payments',
      {
        amount,
        currency: 'SAR',
        description: `SaudiLab ${plan} subscription (test)`,
       callback_url: 'https://saudilab.io/payment-success',
        metadata: { userId: String(req.user.id), plan },
        source: {
          type: 'creditcard',
          name: 'SaudiLab User',
          number: '4111111111111111',
          month: '12',
          year: '28',
          cvc: '123',
        },
      },
      { auth: { username: sk, password: '' } }
    );

    // When hosted, Moyasar gives transaction_url
    const transactionUrl = resp.data?.source?.transaction_url || null;

    if (!transactionUrl) {
      return res.status(400).json({ error: 'No transaction_url returned', details: resp.data });
    }

    return res.json({ transactionUrl, paymentId: resp.data.id });
  } catch (err) {
    const details = err.response?.data || { message: err.message };
    console.error('MOYASAR HOSTED ERROR:', details);
    return res.status(400).json({ error: details.message || 'Hosted payment failed', details });
  }
});

app.post('/billing/moyasar/finalize', authMiddleware, async (req, res) => {
  try {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: 'Missing payment id' });

    const sk = process.env.MOYASAR_SECRET_KEY;
    if (!sk) return res.status(500).json({ error: 'Missing MOYASAR_SECRET_KEY' });

    const r = await axios.get(`https://api.moyasar.com/v1/payments/${id}`, {
      auth: { username: sk, password: '' },
    });

    const status = r.data?.status;

    if (status === 'paid') {
      db.prepare('UPDATE users SET subscribed = 1 WHERE id = ?').run(req.user.id);
      return res.json({ ok: true, paid: true, status });
    }

    return res.json({ ok: true, paid: false, status });
  } catch (err) {
    const details = err.response?.data || { message: err.message };
    console.error('FINALIZE ERROR:', details);
    return res.status(400).json({ error: details.message || 'Finalize failed', details });
  }
});


// 404 JSON
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(process.env.PORT || 5000, () => {
  console.log(`SaudiLab API running on http://localhost:${process.env.PORT || 5000}`);
});

