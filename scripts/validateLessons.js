#!/usr/bin/env node
const path = require('path');

async function main() {
  const lessonsModulePath = path.resolve(__dirname, '../src/data/lessons.js');
  const lessonsModule = await import(`file://${lessonsModulePath}`);
  const { htmlLessons, cssLessons } = lessonsModule;

  const errors = [];

  function validateCourse(name, list) {
    if (!Array.isArray(list)) {
      errors.push(`${name}: metadata is not an array`);
      return;
    }
    if (list.length !== 10) {
      errors.push(`${name}: expected 10 lessons, found ${list.length}`);
    }

    const seen = new Set();
    for (let n = 1; n <= 10; n += 1) {
      const item = list.find((x) => Number(x?.n) === n);
      if (!item) {
        errors.push(`${name}: missing lesson number ${n}`);
        continue;
      }
      if (item.course !== name) {
        errors.push(`${name}: lesson ${n} has wrong course "${item.course}"`);
      }
      if (item.lessonId !== `lesson${n}`) {
        errors.push(`${name}: lesson ${n} has wrong lessonId "${item.lessonId}"`);
      }
      if (!item.title || typeof item.title !== 'string') {
        errors.push(`${name}: lesson ${n} missing title`);
      }
      if (seen.has(item.lessonId)) {
        errors.push(`${name}: duplicate lessonId "${item.lessonId}"`);
      }
      seen.add(item.lessonId);
    }
  }

  validateCourse('html', htmlLessons);
  validateCourse('css', cssLessons);

  if (errors.length > 0) {
    console.error('Lesson metadata validation failed:');
    for (const err of errors) {
      console.error(`- ${err}`);
    }
    process.exit(1);
  }

  console.log('Lesson metadata validation passed for HTML and CSS (1-10).');
}

main().catch((err) => {
  console.error('Validation script failed:', err?.message || err);
  process.exit(1);
});
