import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';
import { COURSES } from '@site/src/course/courseMap';

function getFirstLessonPath(course) {
  const firstLessonId = COURSES[course]?.lessons?.[0]?.lessonId || 'lesson1';
  return `/${course}/${firstLessonId}`;
}

export default function RedirectToFirstLesson({ course }) {
  const history = useHistory();

  useEffect(() => {
    if (!course) return;
    const target = getFirstLessonPath(course);
    const current = typeof window !== 'undefined' ? window.location.pathname : '';
    if (current !== target) {
      history.replace(target);
    }
  }, [course, history]);

  return null;
}
