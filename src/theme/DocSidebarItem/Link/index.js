import React from 'react';
import OriginalLink from '@theme-original/DocSidebarItem/Link';
import useLessonAccess from '@site/src/hooks/useLessonAccess';
import { parseDocId } from '@site/src/course/courseMap';

export default function DocSidebarItemLink(props) {
  const { item } = props;
  const docId = item?.docId || '';
  const parsed = parseDocId(docId);

  const access = useLessonAccess({
    course: parsed?.course || null,
    lessonId: parsed?.lessonId || null,
    docId: parsed ? docId : null,
  });

  if (parsed?.kind === 'complete' && !access.allowed) {
    return null;
  }

  if (access.reason === 'paid' && parsed?.kind === 'lesson') {
    const newItem = { ...item, label: `${item.label ?? ''} Locked` };
    return <OriginalLink {...props} item={newItem} />;
  }

  return <OriginalLink {...props} />;
}
