// server/index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

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
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      if (origin.endsWith('.vercel.app')) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// handle preflight
app.options(/.*/, (req, res) => res.sendStatus(204));

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
      .prepare('INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)')
      .run(u, e, password_hash, now);

    const user = { id: info.lastInsertRowid, username: u, email: e };
    const token = signToken(user);

    return res.json({ token, user });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// LOGIN
app.post('/auth/login', (req, res) => {
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

app.get('/billing/status', authMiddleware, (req, res) => {
  const row = db.prepare('SELECT subscribed FROM users WHERE id = ?').get(req.user.id);
  return res.json({ subscribed: !!row?.subscribed });
});

app.post('/billing/checkout/start', authMiddleware, (req, res) => {
  // TODO: Replace with Lemon Squeezy integration
  return res.json({ ok: true, checkoutUrl: '/payment-success' });
});

app.get('/billing/checkout/status/:id', authMiddleware, (req, res) => {
  // TODO: Replace with Lemon Squeezy integration
  db.prepare('UPDATE users SET subscribed = 1 WHERE id = ?').run(req.user.id);
  return res.json({ paid: true });
});

app.post('/api/paypal/create-order', authMiddleware, (req, res) => {
  const hasConfig = Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
  if (!hasConfig) return res.status(501).json({ error: 'PayPal not configured' });

  // TODO: Replace with real PayPal order creation flow.
  return res.json({ orderId: `stub-order-${Date.now()}` });
});

app.post('/api/paypal/capture-order', authMiddleware, (req, res) => {
  const hasConfig = Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
  if (!hasConfig) return res.status(501).json({ error: 'PayPal not configured' });

  const { orderId } = req.body || {};
  if (!orderId) return res.status(400).json({ error: 'orderId is required' });

  // TODO: Replace with real PayPal capture flow.
  db.prepare('UPDATE users SET subscribed = 1 WHERE id = ?').run(req.user.id);
  return res.json({ ok: true, orderId, status: 'captured_placeholder' });
});

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(process.env.PORT || 5000, () => {
  console.log(`SaudiLab API running on http://localhost:${process.env.PORT || 5000}`);
});
