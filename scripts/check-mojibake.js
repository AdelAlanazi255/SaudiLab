#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const IGNORE_DIRS = new Set(['.git', 'node_modules', 'build', '.docusaurus', '_backup']);
const ALLOWED_EXT = new Set(['.js', '.jsx', '.ts', '.tsx', '.md', '.mdx', '.css', '.json']);

const BAD_PATTERNS = [
  { name: 'mojibake-emdash', re: /\u00e2\u20ac\u201d/g },
  { name: 'mojibake-endash', re: /\u00e2\u20ac\u201c/g },
  { name: 'mojibake-bullet', re: /\u00e2\u20ac\u00a2/g },
  { name: 'mojibake-rsquo', re: /\u00e2\u20ac\u2122/g },
  { name: 'mojibake-ldquo', re: /\u00e2\u20ac\u0153/g },
  { name: 'mojibake-rdquo', re: /\u00e2\u20ac\ufffd/g },
  { name: 'mojibake-lsquo', re: /\u00e2\u20ac\u02dc/g },
  { name: 'stray-Acirc', re: /\u00c2/g },
  { name: 'utf8-bom-artifact', re: /\u00ef\u00bb\u00bf/g },
  { name: 'replacement-char', re: /\uFFFD/g },
];

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
      continue;
    }
    const ext = path.extname(entry.name);
    if (ALLOWED_EXT.has(ext)) out.push(full);
  }
}

function findMatches(text) {
  const hits = [];
  for (const p of BAD_PATTERNS) {
    if (p.re.test(text)) {
      hits.push(p.name);
    }
    p.re.lastIndex = 0;
  }
  return hits;
}

const files = [];
walk(ROOT, files);

let hasError = false;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const hits = findMatches(content);
  if (hits.length === 0) continue;
  hasError = true;
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  console.error(`${rel}: ${hits.join(', ')}`);
}

if (hasError) {
  console.error('\nMojibake patterns found. Fix encoding/text before commit.');
  process.exit(1);
}

console.log('No mojibake patterns found.');
