#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TARGET_DIRS = ['docs/html', 'docs/css'];
const LESSON_FILE = /^lesson\d+\.mdx$/i;

function listLessonFiles() {
  const files = [];
  for (const dir of TARGET_DIRS) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    for (const name of fs.readdirSync(abs)) {
      if (!LESSON_FILE.test(name)) continue;
      files.push(path.join(abs, name));
    }
  }
  return files.sort();
}

function checkFile(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  const text = fs.readFileSync(filePath, 'utf8');
  const violations = [];

  if (!/import\s+LessonShell\s+from\s+['"]@site\/src\/components\/LessonShell['"]\s*;?/.test(text)) {
    violations.push('Missing LessonShell import.');
  }

  if (/import\s+.*LessonProgress.*from/.test(text)) {
    violations.push('Direct LessonProgress import is not allowed.');
  }

  if (/import\s+.*CompleteButton.*from/.test(text)) {
    violations.push('Direct CompleteButton import is not allowed.');
  }

  if (/import\s+.*@docusaurus\/Link/.test(text)) {
    violations.push('Direct @docusaurus/Link import is not allowed in lessons.');
  }

  if (/\/(html|css)\/lesson\d+\/try\b/i.test(text) || /to\s*=\s*['"][^'"]*\/try['"]/.test(text)) {
    violations.push('Hardcoded try path detected. Use LessonShell + courseMap.');
  }

  const customNavPattern = /<(Link|button)\b[^>]*>\s*(Next|Previous)\b/i;
  if (customNavPattern.test(text)) {
    violations.push('Custom Next/Previous button detected.');
  }

  return { rel, violations };
}

const files = listLessonFiles();
const failures = files.map(checkFile).filter((f) => f.violations.length > 0);

if (failures.length > 0) {
  console.error('Lesson structure check failed:\n');
  for (const failure of failures) {
    console.error(`- ${failure.rel}`);
    for (const violation of failure.violations) {
      console.error(`  - ${violation}`);
    }
  }
  process.exit(1);
}

console.log(`Lesson structure check passed for ${files.length} files.`);
