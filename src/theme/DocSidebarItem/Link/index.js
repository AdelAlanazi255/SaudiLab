import React from 'react';
import OriginalLink from '@theme-original/DocSidebarItem/Link';
import useLessonAccess from '@site/src/hooks/useLessonAccess';
import { parseDocId } from '@site/src/course/courseMap';
import { getCourseKeyFromPathname } from '@site/src/utils/courseMeta';

export default function DocSidebarItemLink(props) {
  const { item } = props;
  const docId = item?.docId || '';
  const courseFromHref = getCourseKeyFromPathname(item?.href || '');
  const parsed = parseDocId(docId, courseFromHref);

  const access = useLessonAccess({
    course: parsed?.course || courseFromHref || null,
    lessonId: parsed?.lessonId || null,
    docId: parsed ? docId : null,
  });

  if (access.reason === 'paid' && parsed?.kind === 'lesson') {
    const newItem = { ...item, label: `${item.label ?? ''} Locked` };
    return <OriginalLink {...props} item={newItem} />;
  }

  return <OriginalLink {...props} />;
}
