import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import Translate, { translate } from '@docusaurus/Translate';
import { useDoc, useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
import PaginatorNavLink from '@theme/PaginatorNavLink';
import CourseCompleteModal from '@site/src/components/CourseCompleteModal';
import { COURSE_EVENT, markCompleted } from '@site/src/utils/progressKeys';
import { getCourseNavigationContext } from '@site/src/utils/courseNavigation';
import useLessonAccess from '@site/src/hooks/useLessonAccess';

export default function DocPaginator(props) {
  const { className, previous, next } = props;
  const { metadata } = useDoc();
  const docsSidebar = useDocsSidebar();
  const [showCourseComplete, setShowCourseComplete] = useState(false);

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

  const shouldInterceptNext = Boolean(nav.courseKey && nav.isOnLastLesson && nav.lastLessonRoute);
  const nextLink = shouldInterceptNext
    ? {
      permalink: nav.lastLessonRoute,
      title: translate({
        id: 'theme.docs.paginator.finishCourse',
        message: 'Finish course',
        description: 'The label used to trigger the course complete dialog on the last lesson',
      }),
    }
    : next;

  const onNextClick = (event) => {
    if (!shouldInterceptNext) return;
    event.preventDefault();
    if (nav.courseKey && metadata?.id) {
      markCompleted(nav.courseKey, metadata.id);
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
