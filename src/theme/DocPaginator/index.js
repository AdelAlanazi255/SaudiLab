import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import Translate, { translate } from '@docusaurus/Translate';
import { useDoc, useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
import PaginatorNavLink from '@theme/PaginatorNavLink';
import CourseCompleteModal from '@site/src/components/CourseCompleteModal';
import { COURSE_EVENT, isCompleted, markCompleted } from '@site/src/utils/progressKeys';
import { getCourseNavigationContext } from '@site/src/utils/courseNavigation';
import useLessonAccess from '@site/src/hooks/useLessonAccess';
import { parseDocId } from '@site/src/course/courseMap';
import {
  LEARNING_MODE_EVENT,
  USER_ROLE_EVENT,
  getCurrentLearningMode,
  isAdminRuntime,
  isFreeExplorationMode,
} from '@site/src/utils/learningMode';

function resolveCurrentLessonId(metadata, courseKey) {
  const parsed = parseDocId(metadata?.id || '', courseKey || null);
  if (parsed?.lessonId) return parsed.lessonId;

  const match = String(metadata?.permalink || '').match(/\/lesson(\d+)\/?$/i);
  if (!match) return null;
  return `lesson${Number(match[1])}`;
}

export default function DocPaginator(props) {
  const { className, previous, next } = props;
  const { metadata } = useDoc();
  const docsSidebar = useDocsSidebar();
  const [showCourseComplete, setShowCourseComplete] = useState(false);
  const [stateTick, setStateTick] = useState(0);

  const nav = useMemo(
    () => getCourseNavigationContext({
      pathname: metadata?.permalink || (typeof window !== 'undefined' ? window.location.pathname : '/'),
      sidebarItems: docsSidebar?.items || [],
    }),
    [docsSidebar?.items, metadata?.permalink],
  );
  const access = useLessonAccess({
    course: nav.courseKey || null,
    docId: metadata?.id || null,
  });
  const currentLessonId = useMemo(
    () => resolveCurrentLessonId(metadata, nav.courseKey),
    [metadata, nav.courseKey],
  );

  const shouldShowFinalQuizNext = Boolean(nav.courseKey && nav.isOnLastLesson && nav.finalQuizRoute && !next);
  const shouldInterceptNext = Boolean(nav.courseKey && nav.isOnLastLesson && nav.lastLessonRoute && !shouldShowFinalQuizNext && !next);
  const nextLink = shouldShowFinalQuizNext
    ? {
      permalink: nav.finalQuizRoute,
      title: translate({
        id: 'theme.docs.paginator.finalQuiz',
        message: 'Take final quiz',
        description: 'The label used to navigate to the final quiz after the last lesson',
      }),
    }
    : shouldInterceptNext
    ? {
      permalink: nav.lastLessonRoute,
      title: translate({
        id: 'theme.docs.paginator.finishCourse',
        message: 'Finish course',
        description: 'The label used to trigger the course complete dialog on the last lesson',
      }),
    }
    : next;
  const shouldBlockNext = useMemo(() => {
    if (!nextLink) return false;
    const guidedMode = !isFreeExplorationMode(getCurrentLearningMode());
    if (!guidedMode || isAdminRuntime()) return false;
    if (!nav.courseKey || !currentLessonId) return false;
    return !isCompleted(nav.courseKey, currentLessonId);
  }, [nextLink, nav.courseKey, currentLessonId, stateTick]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const bump = () => setStateTick((tick) => tick + 1);
    window.addEventListener(COURSE_EVENT, bump);
    window.addEventListener(LEARNING_MODE_EVENT, bump);
    window.addEventListener(USER_ROLE_EVENT, bump);
    window.addEventListener('storage', bump);
    window.addEventListener('focus', bump);
    return () => {
      window.removeEventListener(COURSE_EVENT, bump);
      window.removeEventListener(LEARNING_MODE_EVENT, bump);
      window.removeEventListener(USER_ROLE_EVENT, bump);
      window.removeEventListener('storage', bump);
      window.removeEventListener('focus', bump);
    };
  }, []);

  const onNextClick = (event) => {
    if (shouldBlockNext) {
      event.preventDefault();
      return;
    }
    if (!shouldInterceptNext) return;
    event.preventDefault();
    if (nav.courseKey && currentLessonId) {
      markCompleted(nav.courseKey, currentLessonId);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(COURSE_EVENT));
      }
    }
    setShowCourseComplete(true);
  };

  return (
    <>
      {access.allowed ? (
        <nav
          className={clsx(className, 'pagination-nav')}
          aria-label={translate({
            id: 'theme.docs.paginator.navAriaLabel',
            message: 'Docs pages',
            description: 'The ARIA label for the docs pagination',
          })}
        >
          {previous ? (
            <PaginatorNavLink
              {...previous}
              subLabel={(
                <Translate
                  id="theme.docs.paginator.previous"
                  description="The label used to navigate to the previous doc"
                >
                  Previous
                </Translate>
              )}
            />
          ) : null}

          {nextLink ? (
            <PaginatorNavLink
              {...nextLink}
              subLabel={(
                <Translate
                  id="theme.docs.paginator.next"
                  description="The label used to navigate to the next doc"
                >
                  Next
                </Translate>
              )}
              isNext
              onClick={onNextClick}
              isDisabled={shouldBlockNext}
              className={clsx(
                'sl-nextLessonLink',
                shouldBlockNext ? 'sl-nextLessonLinkLocked' : 'sl-nextLessonLinkReady',
              )}
            />
          ) : null}
        </nav>
      ) : null}

      <CourseCompleteModal
        open={showCourseComplete}
        onClose={() => setShowCourseComplete(false)}
        courseName={nav.courseName}
        lessonsHref={nav.lessonsRoute}
      />
    </>
  );
}
