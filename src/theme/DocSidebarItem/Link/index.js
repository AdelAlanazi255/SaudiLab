import React from 'react';
import OriginalLink from '@theme-original/DocSidebarItem/Link';
import useLessonAccess from '@site/src/hooks/useLessonAccess';
import { parseDocId } from '@site/src/course/courseMap';
import { getCourseKeyFromPathname } from '@site/src/utils/courseMeta';
import { isCompleted } from '@site/src/utils/progressKeys';
import {
  getCurrentLearningMode,
  isAdminRuntime,
  isAuthenticatedRuntime,
  isFreeExplorationMode,
} from '@site/src/utils/learningMode';

export default function DocSidebarItemLink(props) {
  const { item } = props;
  const docId = item?.docId || '';
  const href = item?.href || '';
  const courseFromHref = getCourseKeyFromPathname(item?.href || '');
  const parsed = parseDocId(docId, courseFromHref);
  const isPcsFinalQuizItem = courseFromHref === 'pcs' && /\/final-quiz\/?$/i.test(href);

  const access = useLessonAccess({
    course: parsed?.course || courseFromHref || null,
    lessonId: parsed?.lessonId || null,
    docId: parsed ? docId : null,
  });
  const isGuidedMode = !isFreeExplorationMode(getCurrentLearningMode());
  const isGuidedTrackedLesson = Boolean(
    parsed?.kind === 'lesson'
    && isGuidedMode
    && isAuthenticatedRuntime()
    && !isAdminRuntime(),
  );
  const isGuidedTrackedFinalQuiz = Boolean(
    isPcsFinalQuizItem
    && isGuidedMode
    && isAuthenticatedRuntime()
    && !isAdminRuntime(),
  );
  const finalQuizUnlocked = isGuidedTrackedFinalQuiz ? isCompleted('pcs', 'lesson6') : true;
  const shouldLockSidebarLesson = Boolean(
    (isGuidedTrackedLesson && !access.allowed)
    || (isGuidedTrackedFinalQuiz && !finalQuizUnlocked),
  );
  const lessonDone = Boolean(isGuidedTrackedLesson && parsed?.course && parsed?.lessonId && isCompleted(parsed.course, parsed.lessonId));
  const itemClassName = String(item?.className || '');
  const isCurrentLesson = itemClassName.includes('menu__link--active');

  const stateClass = shouldLockSidebarLesson
    ? 'sl-docSidebarStateLocked'
    : isCurrentLesson
      ? 'sl-docSidebarStateCurrent'
      : lessonDone
        ? 'sl-docSidebarStateCompleted'
        : '';

  const progressClassName = isGuidedTrackedLesson
    ? `sl-docSidebarLinkProgress ${stateClass}`.trim()
    : isGuidedTrackedFinalQuiz
    ? `sl-docSidebarLinkProgress ${stateClass}`.trim()
    : '';

  if (access.reason === 'paid' && parsed?.kind === 'lesson') {
    const newItem = { ...item, label: `${item.label ?? ''} Locked` };
    return <OriginalLink {...props} item={newItem} />;
  }

  if (shouldLockSidebarLesson) {
    return (
      <span
        className={`menu__link sl-docSidebarLinkLocked ${progressClassName}`.trim()}
        aria-disabled="true"
        title="Complete previous lessons to unlock this lesson"
      >
        {item?.label}
      </span>
    );
  }

  if (progressClassName) {
    const nextItem = {
      ...item,
      className: `${itemClassName} ${progressClassName}`.trim(),
    };
    return <OriginalLink {...props} item={nextItem} />;
  }

  return <OriginalLink {...props} item={item} />;
}
