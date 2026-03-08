import React, { useEffect, useState } from 'react';
import { isCompleted, migrateProgressOnce } from '@site/src/utils/progressKeys';

export default function QuizAccessGate({
  course,
  requiredLessonId,
  redirectTo = '/',
  fallback = null,
  children,
}) {
  const [canAccess, setCanAccess] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    migrateProgressOnce();
    const allowed = isCompleted(course, requiredLessonId);
    setCanAccess(allowed);
    setChecked(true);
    if (!allowed) {
      window.location.replace(redirectTo);
    }
  }, [course, requiredLessonId, redirectTo]);

  if (!checked || !canAccess) {
    return fallback;
  }

  return <>{children}</>;
}
