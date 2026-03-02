import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'saudilab_hide_landscape_tip_v1';

function shouldShowTip() {
  if (typeof window === 'undefined') return false;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const isPortrait = window.matchMedia('(orientation: portrait)').matches;
  const dismissed = window.localStorage.getItem(STORAGE_KEY) === 'true';
  return isMobile && isPortrait && !dismissed;
}

export default function LandscapeTip() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      setVisible(shouldShowTip());
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  const dismiss = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="sl-landscape-tip" role="status" aria-live="polite">
      <span>Tip: This page works best in Landscape mode on mobile.</span>
      <button
        type="button"
        className="sl-landscape-tip-close"
        onClick={dismiss}
        aria-label="Dismiss landscape tip"
      >
        x
      </button>
    </div>
  );
}
