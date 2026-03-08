import {
  getCourseKeyFromPathname,
  getCourseLabel,
  getCourseFinalQuizRoute,
  getCourseLessonsRoute,
  getCourseMeta,
  normalizeCoursePath,
} from '@site/src/utils/courseMeta';

function flattenSidebarLinks(items, out = []) {
  for (const item of items || []) {
    if (!item || typeof item !== 'object') continue;

    if (item.type === 'link' && typeof item.href === 'string') {
      out.push(item);
      continue;
    }

    if (item.type === 'category') {
      if (typeof item.href === 'string') {
        out.push({ type: 'link', href: item.href, label: item.label || '' });
      }
      flattenSidebarLinks(item.items, out);
    }
  }
  return out;
}

function isLessonPath(pathname = '') {
  return /\/lesson\d+$/i.test(normalizeCoursePath(pathname));
}

function firstSidebarCategoryLabel(items) {
  for (const item of items || []) {
    if (item?.type === 'category' && item.label) return item.label;
    if (item?.type === 'category') {
      const nested = firstSidebarCategoryLabel(item.items);
      if (nested) return nested;
    }
  }
  return null;
}

function matchCourseLessonLink(courseKey, href) {
  const meta = getCourseMeta(courseKey);
  if (!meta) return false;
  const clean = normalizeCoursePath(href).toLowerCase();
  const base = meta.routeBasePath.toLowerCase();
  return clean.startsWith(`${base}/`) && /\/lesson\d+$/i.test(clean);
}

export function getCourseNavigationContext({ pathname = '/', sidebarItems = [] } = {}) {
  const sidebarLinks = flattenSidebarLinks(sidebarItems);
  const currentPath = normalizeCoursePath(pathname);

  const courseKeyFromPath = getCourseKeyFromPathname(currentPath);
  const courseKeyFromSidebar = getCourseKeyFromPathname(sidebarLinks[0]?.href || '');
  const courseKey = courseKeyFromPath || courseKeyFromSidebar || null;

  const lessonLinks = sidebarLinks.filter((item) => {
    if (courseKey) return matchCourseLessonLink(courseKey, item.href);
    return isLessonPath(item.href);
  });

  const firstLessonRoute = lessonLinks[0]?.href || null;
  const lastLessonRoute = lessonLinks.length > 0 ? lessonLinks[lessonLinks.length - 1].href : null;

  const isOnLastLesson = Boolean(
    lastLessonRoute
      && normalizeCoursePath(lastLessonRoute).toLowerCase() === currentPath.toLowerCase(),
  );

  const sidebarLabel = firstSidebarCategoryLabel(sidebarItems);
  const courseName = getCourseLabel(courseKey, sidebarLabel || 'Course');
  const lessonsRoute = getCourseLessonsRoute(courseKey, firstLessonRoute || '/');
  const finalQuizRoute = getCourseFinalQuizRoute(courseKey);

  return {
    courseKey,
    courseName,
    lessonsRoute,
    finalQuizRoute,
    firstLessonRoute,
    lastLessonRoute,
    isOnLastLesson,
  };
}
