import {
  htmlLessons,
  cssLessons,
  javascriptLessons,
  cseLessons,
  cryptoLessons,
  webSecurityLessons,
  networkBasicsLessons,
  ethicsLessons,
  pcsLessons,
  kaliToolsLessons,
  forensicsLessons,
  blueteamLessons,
  careerLessons,
} from '@site/src/data/lessons';

function mapToCourseLessons(items, course, routeBase = course, hasTryPages = true) {
  return items.map((item, i) => {
    const routeId = item.routeId || item.lessonId;
    const prev = i > 0 ? items[i - 1] : null;
    return {
      lessonId: item.lessonId,
      routeId,
      title: item.title,
      docId: `${course}/${routeId}`,
      permalink: `/${routeBase}/${routeId}`,
      tryPath: hasTryPages ? `/${routeBase}/${routeId}/try` : null,
      requireLessonId: prev ? prev.lessonId : null,
      paid: course === 'html' ? item.n >= 4 : true,
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
    lessons: mapToCourseLessons(htmlLessons, 'html'),
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
  },
  cse: {
    id: 'cse',
    title: 'Cyber Security Essentials',
    hasTryPages: false,
    totalLessons: 10,
    access: {
      freeMode: true,
      paidFromLesson: 1,
    },
    lessons: mapToCourseLessons(cseLessons, 'cse', 'cse', false),
  },
  crypto: {
    id: 'crypto',
    title: 'Cryptography',
    totalLessons: 11,
    access: {
      freeMode: true,
      paidFromLesson: 1,
    },
    lessons: mapToCourseLessons(cryptoLessons, 'crypto', 'cryptography'),
  },
  websecurity: {
    id: 'websecurity',
    title: 'Web Security',
    hasTryPages: false,
    totalLessons: 10,
    access: {
      freeMode: true,
      paidFromLesson: 1,
    },
    lessons: mapToCourseLessons(webSecurityLessons, 'websecurity', 'web-security', false),
  },
  networkbasics: {
    id: 'networkbasics',
    title: 'Network Basics',
    totalLessons: 10,
    access: {
      freeMode: true,
      paidFromLesson: 1,
    },
    lessons: mapToCourseLessons(networkBasicsLessons, 'networkbasics', 'network-basics'),
  },
  ethics: {
    id: 'ethics',
    title: 'Security Ethics',
    hasTryPages: false,
    totalLessons: 10,
    access: {
      freeMode: true,
      paidFromLesson: 1,
    },
    lessons: mapToCourseLessons(ethicsLessons, 'ethics', 'ethics', false),
  },
  pcs: {
    id: 'pcs',
    title: 'Personal Cyber Safety',
    hasTryPages: false,
    totalLessons: 6,
    access: {
      freeMode: true,
      paidFromLesson: 1,
    },
    lessons: mapToCourseLessons(pcsLessons, 'pcs', 'pcs', false),
  },
  kalitools: {
    id: 'kalitools',
    title: 'Intro to Security Tools (Kali Linux)',
    hasTryPages: false,
    totalLessons: 10,
    access: {
      freeMode: true,
      paidFromLesson: 1,
    },
    lessons: mapToCourseLessons(kaliToolsLessons, 'kalitools', 'kali', false),
  },
  forensics: {
    id: 'forensics',
    title: 'Digital Forensics',
    hasTryPages: false,
    totalLessons: 10,
    access: {
      freeMode: true,
      paidFromLesson: 1,
    },
    lessons: mapToCourseLessons(forensicsLessons, 'forensics', 'forensics', false),
  },
  blueteam: {
    id: 'blueteam',
    title: 'Blue Team Fundamentals',
    hasTryPages: false,
    totalLessons: 10,
    access: {
      freeMode: true,
      paidFromLesson: 1,
    },
    lessons: mapToCourseLessons(blueteamLessons, 'blueteam', 'blueteam', false),
  },
  career: {
    id: 'career',
    title: 'Cyber Security Career Paths',
    totalLessons: 10,
    access: {
      freeMode: true,
      paidFromLesson: 1,
    },
    lessons: mapToCourseLessons(careerLessons, 'career', 'career'),
  },
};

const DEFAULT_HAS_TRY_PAGES = true;

export function courseHasTryPages(course) {
  const courseConfig = COURSES[course];
  if (!courseConfig) return false;
  return courseConfig.hasTryPages ?? DEFAULT_HAS_TRY_PAGES;
}

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
  if (!courseHasTryPages(course)) return null;
  return getLesson(course, lessonId)?.tryPath || null;
}

export function getLessonByRoute(course, routeId) {
  const c = COURSES[course];
  if (!c) return null;
  return c.lessons.find((lesson) => lesson.routeId === routeId) || null;
}

export function isValidLesson(course, lessonId) {
  return Boolean(getLesson(course, lessonId));
}

export function parseDocId(docId = '', courseHint = null) {
  const id = String(docId || '').trim().toLowerCase();
  if (!id) return null;

  const candidates = [];
  if (courseHint && COURSES[courseHint]) {
    candidates.push(courseHint);
  }
  if (!candidates.length && id.includes('/')) {
    const maybeCourse = id.split('/')[0];
    if (COURSES[maybeCourse]) {
      candidates.push(maybeCourse);
    }
  }
  if (!candidates.length) {
    return null;
  }

  for (const course of candidates) {
    const c = COURSES[course];
    const lesson = c.lessons.find((item) => {
      const normalized = String(item.docId).toLowerCase();
      const lessonId = String(item.lessonId).toLowerCase();
      const routeId = String(item.routeId).toLowerCase();
      return id === normalized || id === lessonId || id === routeId || id === `${course}/${routeId}`;
    });
    if (lesson) {
      return { course, kind: 'lesson', lessonId: lesson.lessonId };
    }
  }
  return null;
}
