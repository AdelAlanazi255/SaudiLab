import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import { useAuth } from '@site/src/utils/authState';
import ConfirmModal from '@site/src/components/ConfirmModal';

export default function Navbar() {
  const auth = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="navbar navbar--fixed-top" role="navigation" aria-label="Main navigation">
        <div className="navbar__inner">
          <div className="navbar__items">
            <Link className="navbar__brand" to="/" style={{ textDecoration: 'none' }}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  fontWeight: 900,
                  fontSize: '1.2rem',
                  color: 'white',
                  letterSpacing: '0.2px',
                }}
              >
                <span
                  style={{
                    width: 34,
                    height: 22,
                    borderRadius: 4,
                    background: '#006c35',
                    border: '1px solid rgba(255,255,255,0.25)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontWeight: 900,
                    fontSize: 10,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '45%',
                      background: 'rgba(255,255,255,0.08)',
                    }}
                  />
                  <span style={{ position: 'relative' }}>KSA</span>
                </span>
                SaudiLab
              </span>
            </Link>
          </div>

          <div className="navbar__items navbar__items--right">
            {!auth?.isLoggedIn ? (
              <>
                <Link className="navbar__item navbar__link" to="/login" style={{ color: 'white' }}>
                  Login
                </Link>

                <Link
                  to="/signup"
                  style={{
                    background: 'white',
                    color: '#111827',
                    padding: '0.45rem 0.9rem',
                    borderRadius: '10px',
                    fontWeight: 800,
                    textDecoration: 'none',
                    marginLeft: '0.5rem',
                  }}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link
                  to="/account"
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    textDecoration: 'none',
                    fontWeight: 900,
                    padding: '0.35rem 0.6rem',
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.14)',
                    background: 'rgba(255,255,255,0.06)',
                  }}
                >
                  {auth.user?.username || 'Account'}
                </Link>

                <button
                  onClick={() => setOpen(true)}
                  style={{
                    background: '#7cf2b0',
                    color: '#0b0f14',
                    padding: '0.45rem 0.9rem',
                    borderRadius: '10px',
                    fontWeight: 900,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
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
        onConfirm={() => {
          setOpen(false);
          auth.logout();
        }}
      />
    </>
  );
}
