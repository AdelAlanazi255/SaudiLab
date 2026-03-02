import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import { useAuth } from '@site/src/utils/authState';
import ConfirmModal from '@site/src/components/ConfirmModal';

function capitalizeFirstLetter(str) {
  if (!str || typeof str !== 'string') return 'there';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Navbar() {
  const auth = useAuth();
  const [open, setOpen] = useState(false);
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
      <nav className="navbar navbar--fixed-top" role="navigation" aria-label="Main navigation">
        <div className="navbar__inner">
          <div className="navbar__items">
            <Link className="navbar__brand sl-nav-brand" to="/">
              <span className="sl-nav-brandText">
                <span className="sl-nav-wordmarkWrap">
                  <span className="sl-nav-wordmark">SaudiLab</span>
                  <span className="sl-nav-beta">BETA</span>
                </span>
              </span>
            </Link>
          </div>

          {auth?.isLoggedIn ? (
            <div className="sl-nav-centerWelcome">
              Welcome, {formattedName}
            </div>
          ) : null}

          <div className="navbar__items navbar__items--right">
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
    </>
  );
}
