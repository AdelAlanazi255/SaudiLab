import React, { useEffect, useMemo, useState } from 'react';
import OriginalLink from '@theme-original/DocSidebarItem/Link';
import { useAuth } from '@site/src/utils/authState';
import { isCompleted } from '@site/src/utils/progress';

// HTML paid lessons: 4–10
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
  // your doc id is: html/html-complete
  return docId === 'html/html-complete' || String(href || '').includes('/html/html-complete');
}

function hasLesson10Completed() {
  // support multiple possible keys (you changed ids over time)
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

  // Hide HTML completion page until lesson 10 completed
  if (isHtmlCompleteDoc(docId, href) && hydrated && !hasLesson10Completed()) {
    return null;
  }

  // LOCK RULES:
  // - CSS: always locked unless subscribed
  // - HTML lessons 4–10: locked unless subscribed
  const locked =
    hydrated &&
    !auth?.loading &&
    !auth?.subscribed &&
    (isCSS || isPaidHtmlLesson);

  // IMPORTANT: do NOT redirect, do NOT change href — only show 🔒
  if (!locked) return <OriginalLink {...props} />;

  const newItem = { ...item, label: `${item.label ?? ''} 🔒` };
  return <OriginalLink {...props} item={newItem} />;
}
