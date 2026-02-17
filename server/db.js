const Database = require('better-sqlite3');

const db = new Database('saudilab.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    subscribed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );
`);

// if table existed before, add column if missing
try {
  db.exec(`ALTER TABLE users ADD COLUMN subscribed INTEGER NOT NULL DEFAULT 0;`);
} catch (_) {
  // ignore if already exists
}

module.exports = db;
