import React from 'react';
import Link from '@docusaurus/Link';

export default function Footer() {
  return (
    <footer
      style={{
        padding: '2.5rem 1.5rem',
        backgroundColor: '#0f172a',
        color: 'rgba(255,255,255,0.85)',
        marginTop: '4rem',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2.5rem',
        }}
      >
        {/* Brand */}
        <div style={{ maxWidth: 320 }}>
          <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'white' }}>
            SaudiLab
          </div>
          <div style={{ marginTop: '0.6rem', lineHeight: 1.6, opacity: 0.85 }}>
            Learn web development with interactive lessons designed for
            Arabic-speaking beginners.
          </div>
        </div>

        {/* Social */}
        <div>
          <div style={sectionTitle}>Social</div>
          <div style={linkRow}>
            <a
              href="https://www.instagram.com/saudi.lab"
              target="_blank"
              rel="noopener noreferrer"
              style={pill}
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@saudi.lab"
              target="_blank"
              rel="noopener noreferrer"
              style={pill}
            >
              TikTok
            </a>
          </div>
        </div>

        {/* Legal */}
        <div>
          <div style={sectionTitle}>Legal</div>
          <div style={linkRow}>
            <Link to="/contact" style={pill}>
              Contact
            </Link>
            <Link to="/privacy" style={pill}>
              Privacy
            </Link>
            <Link to="/terms" style={pill}>
              Terms
            </Link>
            <Link to="/refund" style={pill}>
              Refund
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: '1100px',
          margin: '2rem auto 0',
          paddingTop: '1.2rem',
          borderTop: '1px solid rgba(255,255,255,0.15)',
          textAlign: 'center',
          fontSize: '0.9rem',
          opacity: 0.8,
        }}
      >
        © {new Date().getFullYear()} SaudiLab. All rights reserved.
      </div>
    </footer>
  );
}

const sectionTitle = {
  fontWeight: 900,
  color: 'white',
  marginBottom: '0.8rem',
};

const linkRow = {
  display: 'flex',
  gap: '0.6rem',
  flexWrap: 'wrap',
};

const pill = {
  color: 'white',
  textDecoration: 'none',
  border: '1px solid rgba(255,255,255,0.25)',
  padding: '0.4rem 0.85rem',
  borderRadius: '999px',
  fontWeight: 700,
  fontSize: '0.9rem',
};
