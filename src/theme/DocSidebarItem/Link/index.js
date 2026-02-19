import React, { useEffect, useMemo, useState } from 'react';
import OriginalLink from '@theme-original/DocSidebarItem/Link';
import { useAuth } from '@site/src/utils/authState';
import { isCompleted } from '@site/src/utils/progress';
import { CSS_FREE_MODE } from '@site/src/components/CssGate';
import { HTML_FREE_MODE } from '@site/src/components/LessonGate';

// HTML paid lessons: 4-10
const HTML_PAID = new Set([
  'lesson4',
  'lesson5',
  'lesson6',
  'lesson7',
  'lesson8',
  'lesson9',
  'lesson10',
]);

function getLastSegment(docId = '') {
  const s = String(docId);
  const parts = s.split('/').filter(Boolean);
  return parts[parts.length - 1] || s;
}

function isHtmlCompleteDoc(docId, href) {
  return docId === 'html/html-complete' || String(href || '').includes('/html/html-complete');
}

function hasLesson10Completed() {
  return (
    isCompleted('lesson10') ||
    isCompleted('html/lesson10') ||
    isCompleted('html-lesson10') ||
    isCompleted('html_lesson10')
  );
}

export default function DocSidebarItemLink(props) {
  const auth = useAuth();
  const { item } = props;

  const docId = item?.docId || '';
  const href = item?.href || '';

  const last = useMemo(() => getLastSegment(docId), [docId]);

  const isCSS = docId.startsWith('css/') || last.startsWith('css-') || docId.startsWith('css-');
  const isHTML = docId.startsWith('html/') || docId.startsWith('html-');
  const isPaidHtmlLesson = isHTML && HTML_PAID.has(last);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (isHtmlCompleteDoc(docId, href) && hydrated && !hasLesson10Completed()) {
    return null;
  }

  const locked =
    hydrated &&
    !auth?.loading &&
    !auth?.subscribed &&
    ((isCSS && !CSS_FREE_MODE) || (isPaidHtmlLesson && !HTML_FREE_MODE));

  if (!locked) return <OriginalLink {...props} />;

  const newItem = { ...item, label: `${item.label ?? ''} 🔒` };
  return <OriginalLink {...props} item={newItem} />;
}
