import React, { useEffect, useState } from 'react';
import OriginalLink from '@theme-original/DocSidebarItem/Link';
import { isLessonComplete } from '@site/src/utils/progress';

const PAID_DOC_IDS = new Set([
  'lesson4',
  'lesson5',
  'lesson6',
  'lesson7',
  'lesson8',
  'lesson9',
  'lesson10',
]);

const SUB_KEY = 'saudilab_subscription_v1';

function isSubscribed() {
  try {
    if (typeof window === 'undefined') return false;

    const raw = window.localStorage.getItem(SUB_KEY);
    if (!raw) return false;

    const s = String(raw).trim().toLowerCase();

    // Common truthy strings
    if (s === 'true' || s === '1' || s === 'yes' || s === 'active') return true;

    // JSON support: {"active":true} etc
    if (s.startsWith('{') || s.startsWith('[')) {
      try {
        const obj = JSON.parse(raw);
        if (obj === true) return true;
        if (obj?.active === true) return true;
        if (obj?.subscribed === true) return true;
        if (obj?.isSubscribed === true) return true;
      } catch {}
    }

    return false;
  } catch {
    return false;
  }
}

export default function DocSidebarItemLink(props) {
  const { item } = props;
  const docId = item?.docId;

  const isCompletePage =
    docId === 'html-complete' || item?.href?.includes('/docs/html-complete');

  const isPaidLesson = PAID_DOC_IDS.has(docId);

  const [state, setState] = useState({
    hydrated: false,
    subscribed: false,
    showComplete: true,
  });

  useEffect(() => {
    const compute = () => {
      const subscribed = isSubscribed();

      let showComplete = true;
      if (isCompletePage) showComplete = isLessonComplete('lesson10');

      setState({ hydrated: true, subscribed, showComplete });
    };

    compute();

    // Update on storage events
    const onStorage = () => compute();
    window.addEventListener('storage', onStorage);

    return () => window.removeEventListener('storage', onStorage);
  }, [isCompletePage]);

  // Hide Course Complete until lesson10 is completed
  if (isCompletePage && state.hydrated && !state.showComplete) return null;

  // 🔒 only depends on subscription (since you said "logged in OR subscribed" logic is fine)
  const locked = isPaidLesson && state.hydrated && !state.subscribed;

  if (!locked) return <OriginalLink {...props} />;

  const newItem = { ...item, label: `${item.label ?? ''} 🔒` };
  return <OriginalLink {...props} item={newItem} />;
}
