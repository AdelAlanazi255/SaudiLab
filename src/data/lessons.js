const htmlTitles = [
  'Introduction to HTML',
  'Headings and Paragraphs',
  'Text Formatting',
  'Links',
  'Images',
  'Lists',
  'Tables',
  'Forms Basics',
  'Form inputs',
  'Semantic Layout',
];

const cssTitles = [
  'Introduction to CSS',
  'Selectors and Text',
  'Box Model',
  'Backgrounds and Borders',
  'Flexbox Basics',
  'Spacing and Sizing',
  'Buttons and Hover',
  'Form Styling',
  'Grid Basics',
  'Mini Page Layout',
];

function buildLessons(course, titles) {
  return titles.map((title, i) => {
    const n = i + 1;
    return {
      course,
      n,
      lessonId: `lesson${n}`,
      title,
    };
  });
}

export const htmlLessons = buildLessons('html', htmlTitles);
export const cssLessons = buildLessons('css', cssTitles);

const byCourse = {
  html: htmlLessons,
  css: cssLessons,
};

export function getLessonMeta(course, n) {
  const key = String(course || '').toLowerCase();
  const num = Number(n);
  const list = byCourse[key];
  if (!list) {
    throw new Error(`Unknown course "${course}"`);
  }
  const lesson = list.find((item) => item.n === num);
  if (!lesson) {
    throw new Error(`Missing lesson metadata for ${key} lesson ${n}`);
  }
  return lesson;
}

export function getLessonMetaSafe(course, n) {
  try {
    return getLessonMeta(course, n);
  } catch {
    return null;
  }
}
