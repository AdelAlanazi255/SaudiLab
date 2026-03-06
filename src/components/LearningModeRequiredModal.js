import React, { useMemo, useState } from 'react';
import { useAuth } from '@site/src/utils/authState';
import { LEARNING_MODE_FREE, LEARNING_MODE_GUIDED } from '@site/src/utils/learningMode';

export default function LearningModeRequiredModal() {
  const auth = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const showModal = Boolean(auth?.isLoggedIn && !auth?.loading && auth?.profile && auth?.isLearningModeMissing);

  const subtitle = useMemo(
    () => 'Choose how you want to learn. You can switch this later from your dashboard.',
    [],
  );

  const onChoose = async (mode) => {
    if (!auth?.updateLearningMode || saving) return;
    setSaving(true);
    setError('');

    const result = await auth.updateLearningMode(mode);
    setSaving(false);
    if (!result?.ok) {
      setError(result?.error || 'Could not save your learning mode. Please try again.');
    }
  };

  if (!showModal) return null;

  return (
    <div className="sl-modalBackdrop sl-learningModeBackdrop">
      <section
        className="sl-modal sl-learningModeModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sl-learning-mode-title"
      >
        <header className="sl-learningModeHead">
          <h2 id="sl-learning-mode-title" className="sl-modalTitle">Choose Your Learning Mode</h2>
          <p className="sl-modalMsg">{subtitle}</p>
        </header>

        <div className="sl-learningModeGrid">
          <button
            type="button"
            className="sl-learningModeCard"
            onClick={() => onChoose(LEARNING_MODE_GUIDED)}
            disabled={saving}
          >
            <span className="sl-learningModeCardTitle">Guided roadmap</span>
            <span className="sl-learningModeCardText">Follow the recommended lesson order.</span>
          </button>
          <button
            type="button"
            className="sl-learningModeCard"
            onClick={() => onChoose(LEARNING_MODE_FREE)}
            disabled={saving}
          >
            <span className="sl-learningModeCardTitle">Free exploration</span>
            <span className="sl-learningModeCardText">Unlock all lessons and learn in any order.</span>
          </button>
        </div>

        <p className="sl-learningModeWarning">YOU CAN ALWAYS CHANGE THIS OPTION IN THE DASHBOARD AT ANY TIME</p>

        {error ? <p className="sl-learningModeError">{error}</p> : null}
      </section>
    </div>
  );
}
