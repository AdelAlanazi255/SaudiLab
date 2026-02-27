import { htmlLessons, cssLessons, javascriptLessons } from '@site/src/data/lessons';

function mapToCourseLessons(items, course) {
  return items.map((item) => ({
    lessonId: item.lessonId,
    title: item.title,
    docId: `${course}/${item.lessonId}`,
    permalink: `/${course}/${item.lessonId}`,
    tryPath: `/${course}/${item.lessonId}/try`,
    requireLessonId: item.n === 1 ? null : `lesson${item.n - 1}`,
    paid: course === 'html' ? item.n >= 4 : true,
  }));
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
    lessons: mapToCourseLessons(htmlLessons, 'html'),
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
    lessons: mapToCourseLessons(cssLessons, 'css'),
    completeDocId: 'css/css-complete',
    completePermalink: '/css/css-complete',
  },
  javascript: {
    id: 'javascript',
    title: 'JavaScript',
    totalLessons: 10,
    access: {
      freeMode: true,
      paidFromLesson: 1,
    },
    lessons: mapToCourseLessons(javascriptLessons, 'javascript'),
    completeDocId: 'javascript/javascript-complete',
    completePermalink: '/javascript/javascript-complete',
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
