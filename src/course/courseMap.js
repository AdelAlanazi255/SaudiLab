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

function mapToCourseLessons(items, course, routeBase = course) {
  return items.map((item, i) => {
    const routeId = item.routeId || item.lessonId;
    const prev = i > 0 ? items[i - 1] : null;
    return {
      lessonId: item.lessonId,
      routeId,
      title: item.title,
      docId: `${course}/${routeId}`,
      permalink: `/${routeBase}/${routeId}`,
      tryPath: `/${routeBase}/${routeId}/try`,
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
  cse: {
    id: 'cse',
    title: 'Cyber Security Essentials',
    totalLessons: 10,
    access: {
      freeMode: true,
      paidFromLesson: 1,
    },
    lessons: mapToCourseLessons(cseLessons, 'cse'),
    completeDocId: 'cse/cse-complete',
    completePermalink: '/cse/cse-complete',
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
    completeDocId: 'crypto/crypto-complete',
    completePermalink: '/cryptography/crypto-complete',
  },
  websecurity: {
    id: 'websecurity',
    title: 'Web Security',
    totalLessons: 10,
    access: {
      freeMode: true,
      paidFromLesson: 1,
    },
    lessons: mapToCourseLessons(webSecurityLessons, 'websecurity', 'web-security'),
    completeDocId: 'websecurity/web-security-complete',
    completePermalink: '/web-security/web-security-complete',
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
    completeDocId: 'networkbasics/network-basics-complete',
    completePermalink: '/network-basics/network-basics-complete',
  },
  ethics: {
    id: 'ethics',
    title: 'Security Ethics',
    totalLessons: 10,
    access: {
      freeMode: true,
      paidFromLesson: 1,
    },
    lessons: mapToCourseLessons(ethicsLessons, 'ethics', 'ethics'),
    completeDocId: 'ethics/ethics-complete',
    completePermalink: '/ethics/ethics-complete',
  },
  pcs: {
    id: 'pcs',
    title: 'Personal Cyber Safety',
    totalLessons: 12,
    access: {
      freeMode: true,
      paidFromLesson: 1,
    },
    lessons: mapToCourseLessons(pcsLessons, 'pcs', 'pcs'),
    completeDocId: 'pcs/pcs-complete',
    completePermalink: '/pcs/pcs-complete',
  },
  kalitools: {
    id: 'kalitools',
    title: 'Intro to Security Tools (Kali Linux)',
    totalLessons: 10,
    access: {
      freeMode: true,
      paidFromLesson: 1,
    },
    lessons: mapToCourseLessons(kaliToolsLessons, 'kalitools', 'kali'),
    completeDocId: 'kalitools/kali-tools-complete',
    completePermalink: '/kali/kali-tools-complete',
  },
  forensics: {
    id: 'forensics',
    title: 'Digital Forensics',
    totalLessons: 10,
    access: {
      freeMode: true,
      paidFromLesson: 1,
    },
    lessons: mapToCourseLessons(forensicsLessons, 'forensics', 'forensics'),
    completeDocId: 'forensics/forensics-complete',
    completePermalink: '/forensics/forensics-complete',
  },
  blueteam: {
    id: 'blueteam',
    title: 'Blue Team Fundamentals',
    totalLessons: 10,
    access: {
      freeMode: true,
      paidFromLesson: 1,
    },
    lessons: mapToCourseLessons(blueteamLessons, 'blueteam', 'blueteam'),
    completeDocId: 'blueteam/blueteam-complete',
    completePermalink: '/blueteam/blueteam-complete',
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
    completeDocId: 'career/career-complete',
    completePermalink: '/career/career-complete',
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

export function getLessonByRoute(course, routeId) {
  const c = COURSES[course];
  if (!c) return null;
  return c.lessons.find((lesson) => lesson.routeId === routeId) || null;
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
