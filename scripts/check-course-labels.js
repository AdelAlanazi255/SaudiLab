#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const target = path.join(process.cwd(), 'src', 'pages', 'index.js');
const text = fs.readFileSync(target, 'utf8');

const forbiddenMarks = /[\u064B-\u065F\u200E\u200F\u202A-\u202E\u201C\u201D]/;
const nonAscii = /[^\x00-\x7F]/;

let hasError = false;

// Guard 1: no bidi marks / Arabic diacritics / smart quotes on lines with CSS/JavaScript.
const lines = text.split('\n');
lines.forEach((line, i) => {
  if (!/CSS|JavaScript/.test(line)) return;
  if (forbiddenMarks.test(line)) {
    hasError = true;
    console.error(`src/pages/index.js:${i + 1} forbidden mark detected near course label`);
  }
});

// Guard 2: course headings must be exact ASCII labels: HTML, CSS, JavaScript.
const h3Matches = [...text.matchAll(/<h3>([\s\S]*?)<\/h3>/g)];
const courseValues = h3Matches
  .map((m) => m[1].replace(/<[^>]+>/g, '').trim())
  .filter((v) => ['HTML', 'CSS', 'JavaScript'].includes(v));

for (const label of ['HTML', 'CSS', 'JavaScript']) {
  if (!courseValues.includes(label)) {
    hasError = true;
    console.error(`src/pages/index.js missing exact ASCII course label: ${label}`);
  }
}

for (const v of courseValues) {
  if (nonAscii.test(v)) {
    hasError = true;
    console.error(`src/pages/index.js non-ASCII characters found in course label: ${v}`);
  }
}

if (hasError) {
  process.exit(1);
}

console.log('Course labels check passed.');
