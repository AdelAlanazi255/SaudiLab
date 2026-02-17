import React from 'react';

export default function LayoutWrapper({ children }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* HEADER */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          backgroundColor: '#1f2937',
          color: 'white',
          fontWeight: 700,
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        }}
      >
        {/* LEFT */}
        <a
          href="/"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.3rem',
            fontWeight: 900,
          }}
        >
          SaudiLab
        </a>

        {/* RIGHT */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a
            href="/login"
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              border: '1px solid rgba(255,255,255,0.8)',
              borderRadius: '8px',
            }}
          >
            Login
          </a>

          <a
            href="/signup"
            style={{
              color: '#1f2937',
              backgroundColor: 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: 800,
            }}
          >
            Sign Up
          </a>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* FOOTER */}
      <footer
        style={{
          padding: '2rem',
          backgroundColor: '#0f172a',
          color: 'rgba(255,255,255,0.85)',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
          }}
        >
          {/* BRAND */}
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'white' }}>
              SaudiLab
            </div>
            <div style={{ marginTop: '0.5rem', lineHeight: 1.6 }}>
              Learn web development with interactive lessons.
            </div>
          </div>

          {/* SOCIALS */}
          <div>
            <div
              style={{
                fontWeight: 800,
                color: 'white',
                marginBottom: '0.75rem',
              }}
            >
              Socials
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href="https://www.instagram.com/saudi.lab"
                target="_blank"
                rel="noopener noreferrer"
                style={socialPill}
              >
                Instagram
              </a>

              <a
                href="https://www.tiktok.com/@saudi.lab"
                target="_blank"
                rel="noopener noreferrer"
                style={socialPill}
              >
                TikTok
              </a>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div
          style={{
            maxWidth: '1100px',
            margin: '1.5rem auto 0',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            textAlign: 'center',
            fontSize: '0.9rem',
          }}
        >
          © {new Date().getFullYear()} SaudiLab. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

const socialPill = {
  color: 'white',
  textDecoration: 'none',
  border: '1px solid rgba(255,255,255,0.25)',
  padding: '0.4rem 0.8rem',
  borderRadius: '999px',
  fontWeight: 700,
  fontSize: '0.9rem',
};
