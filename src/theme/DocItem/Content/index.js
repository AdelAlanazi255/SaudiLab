import React from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import LessonProgress from '@site/src/components/LessonProgress';
import { COURSES } from '@site/src/course/courseMap';
import { getCourseKeyFromPathname } from '@site/src/utils/courseMeta';

function useSyntheticTitle() {
  const { metadata, frontMatter, contentTitle } = useDoc();
  const shouldRender =
    !frontMatter.hide_title && typeof contentTitle === 'undefined';
  if (!shouldRender) {
    return null;
  }
  return metadata.title;
}

function getLessonProgressInfo(permalink = '') {
  const courseKey = getCourseKeyFromPathname(permalink);
  if (!courseKey || !COURSES[courseKey]) return null;

  const total = Number(COURSES[courseKey].totalLessons) || 0;
  if (!total) return null;

  const match = String(permalink || '').match(/\/lesson(\d+)\/?$/i);
  const current = match ? Number(match[1]) : NaN;
  if (!Number.isFinite(current) || current < 1 || current > total) return null;

  return { current, total };
}

export default function DocItemContent({ children }) {
  const { metadata } = useDoc();
  const syntheticTitle = useSyntheticTitle();
  const progressInfo = getLessonProgressInfo(metadata?.permalink || '');

  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {progressInfo ? (
        <div className="sl-docProgress">
          <LessonProgress current={progressInfo.current} total={progressInfo.total} />
        </div>
      ) : null}

      {syntheticTitle ? (
        <header>
          <Heading as="h1">{syntheticTitle}</Heading>
        </header>
      ) : null}

      <MDXContent>{children}</MDXContent>
    </div>
  );
}
