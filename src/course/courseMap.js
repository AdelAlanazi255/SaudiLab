const HTML_LESSON_TITLES = [
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

const CSS_LESSON_TITLES = [
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

function makeLessons(course, titles) {
  return titles.map((title, index) => {
    const number = index + 1;
    const lessonId = `lesson${number}`;
    return {
      lessonId,
      title,
      docId: `${course}/${lessonId}`,
      permalink: `/${course}/${lessonId}`,
      tryPath: `/${course}/${lessonId}/try`,
      requireLessonId: number === 1 ? null : `lesson${number - 1}`,
      paid: course === 'html' ? number >= 4 : true,
    };
  });
}

export const COURSES = {
  html: {
    id: 'html',
    title: 'HTML',
    totalLessons: 10,
    access: {
      freeMode: true,
      paidFromLesson: 4,
    },
    lessons: makeLessons('html', HTML_LESSON_TITLES),
    completeDocId: 'html/html-complete',
    completePermalink: '/html/html-complete',
  },
  css: {
    id: 'css',
    title: 'CSS',
    totalLessons: 10,
    access: {
      freeMode: true,
      paidFromLesson: 1,
    },
    lessons: makeLessons('css', CSS_LESSON_TITLES),
    completeDocId: 'css/css-complete',
    completePermalink: '/css/css-complete',
  },
};

export function getLesson(course, lessonId) {
  const c = COURSES[course];
  if (!c) return null;
  return c.lessons.find((lesson) => lesson.lessonId === lessonId) || null;
}

export function getNextLesson(course, lessonId) {
  const c = COURSES[course];
  if (!c) return null;
  const i = c.lessons.findIndex((lesson) => lesson.lessonId === lessonId);
  if (i < 0 || i + 1 >= c.lessons.length) return null;
  return c.lessons[i + 1];
}

export function getPrevLesson(course, lessonId) {
  const c = COURSES[course];
  if (!c) return null;
  const i = c.lessons.findIndex((lesson) => lesson.lessonId === lessonId);
  if (i <= 0) return null;
  return c.lessons[i - 1];
}

export function getTryPath(course, lessonId) {
  return getLesson(course, lessonId)?.tryPath || null;
}

export function getCompletePage(course) {
  const c = COURSES[course];
  if (!c) return null;
  return {
    docId: c.completeDocId,
    permalink: c.completePermalink,
  };
}

export function isValidLesson(course, lessonId) {
  return Boolean(getLesson(course, lessonId));
}

export function parseDocId(docId = '') {
  const id = String(docId || '');
  for (const course of Object.keys(COURSES)) {
    const c = COURSES[course];
    if (id === c.completeDocId) {
      return { course, kind: 'complete', lessonId: null };
    }
    const lesson = c.lessons.find((item) => item.docId === id);
    if (lesson) {
      return { course, kind: 'lesson', lessonId: lesson.lessonId };
    }
  }
  return null;
}
