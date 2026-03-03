import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import { useAuth } from '@site/src/utils/authState';
import ConfirmModal from '@site/src/components/ConfirmModal';
import FeedbackModal from '@site/src/components/FeedbackModal';

function capitalizeFirstLetter(str) {
  if (!str || typeof str !== 'string') return 'there';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Navbar() {
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState('');
  const displayName =
    auth?.profile?.username?.split(' ')?.[0]
    ?? auth?.user?.user_metadata?.username
    ?? auth?.user?.user_metadata?.name?.split(' ')?.[0]
    ?? auth?.user?.user_metadata?.full_name?.split(' ')?.[0]
    ?? auth?.user?.name?.split(' ')?.[0]
    ?? auth?.user?.username
    ?? auth?.user?.email?.split('@')?.[0]
    ?? 'there';
  const formattedName = capitalizeFirstLetter(displayName);

  return (
    <>
      <nav className="navbar navbar--fixed-top sl-nav-outer" role="navigation" aria-label="Main navigation">
        <div className="navbar__inner sl-nav-row">
          <div className="navbar__items sl-nav-leftSlot">
            <Link className="navbar__brand sl-nav-brand" to="/">
              <span className="sl-nav-brandText">
                <span className="sl-nav-wordmarkWrap">
                  <span className="sl-nav-wordmark">SaudiLab</span>
                  <span className="sl-nav-beta">BETA</span>
                </span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setFeedbackOpen(true)}
              className="sl-btn-ghost sl-nav-feedbackBtn"
            >
              <span className="sl-show-mobile">Feedback</span>
              <span className="sl-hide-mobile">Give Feedback</span>
            </button>
          </div>

          {auth?.isLoggedIn ? (
            <div className="sl-nav-centerAbs navbarWelcome">
              <span className="sl-nav-centerText">Welcome, {formattedName}</span>
            </div>
          ) : null}

          <div className="navbar__items navbar__items--right sl-nav-rightSlot">
            {!auth?.isLoggedIn ? (
              <div className="sl-nav-guestActions">
                <Link className="sl-btn-ghost sl-nav-authBtn sl-nav-linkBtn" to="/login">
                  Login
                </Link>

                <Link to="/signup" className="sl-btn-primary sl-nav-authBtn sl-nav-signupBtn">
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="sl-nav-authActions">
                <Link to="/account" className="sl-nav-accountLink">
                  <span className="sl-nav-accountInner">Dashboard</span>
                </Link>

                <button onClick={() => setOpen(true)} className="sl-btn-primary sl-nav-logoutBtn">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <ConfirmModal
        open={open}
        title="Logout"
        message="Do you want to logout from SaudiLab?"
        confirmText="Logout"
        cancelText="Cancel"
        onCancel={() => setOpen(false)}
        onConfirm={async () => {
          setOpen(false);
          if (auth.signOut) await auth.signOut();
          else await auth.logout();
        }}
      />

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        userEmail={auth?.user?.email || auth?.profile?.email || ''}
        userId={auth?.user?.id || null}
        onSuccess={(text) => {
          setFeedbackToast(text || 'Thanks for the feedback.');
          window.setTimeout(() => setFeedbackToast(''), 1800);
        }}
      />

      {feedbackToast ? (
        <div style={toastStyle} role="status" aria-live="polite">
          {feedbackToast}
        </div>
      ) : null}
    </>
  );
}

const toastStyle = {
  position: 'fixed',
  right: '1rem',
  bottom: '1rem',
  zIndex: 10002,
  padding: '0.62rem 0.8rem',
  borderRadius: 10,
  border: '1px solid rgba(124,242,176,0.35)',
  background: 'rgba(10, 17, 24, 0.92)',
  color: '#c6f8dc',
  fontWeight: 800,
  fontSize: '0.85rem',
  boxShadow: '0 8px 22px rgba(0,0,0,0.35)',
};
