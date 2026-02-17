import React from 'react';
import Layout from '@theme/Layout';

export default function Contact() {
  return (
    <Layout title="Contact">
      <div
        style={{
          padding: '4rem 1.5rem',
          maxWidth: 800,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontWeight: 950, marginBottom: '0.5rem' }}>Contact</h1>
        <p style={{ opacity: 0.75, marginBottom: '2rem' }}>
          Reach out to SaudiLab on our social platforms.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Instagram */}
          <a
            href="https://www.instagram.com/saudi.lab"
            target="_blank"
            rel="noopener noreferrer"
            style={card}
          >
            <InstagramIcon />
            <span style={label}>Instagram</span>
          </a>

          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@saudi.lab"
            target="_blank"
            rel="noopener noreferrer"
            style={card}
          >
            <TikTokIcon />
            <span style={label}>TikTok</span>
          </a>
        </div>
      </div>
    </Layout>
  );
}

const card = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.9rem 1.3rem',
  borderRadius: 16,
  textDecoration: 'none',
  color: 'white',
  fontWeight: 900,
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(0,0,0,0.35)',
  boxShadow:
    '0 14px 40px rgba(0,0,0,0.45), 0 0 40px rgba(124,242,176,0.08)',
  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
};

const label = {
  fontSize: '1rem',
};

function InstagramIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="white"
    >
      <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 
      0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm0 
      2h10c1.66 0 3 1.34 3 3v10c0 1.66-1.34 
      3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 
      1.34-3 3-3zm5 2.5A5.5 5.5 0 1 0 
      17.5 12 5.51 5.51 0 0 0 12 
      6.5zm0 2A3.5 3.5 0 1 1 8.5 
      12 3.5 3.5 0 0 1 12 
      8.5zm4.75-.75a1.25 1.25 0 1 0 
      1.25 1.25 1.25 1.25 0 0 0-1.25-1.25z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="white"
    >
      <path d="M16 2h2.5c.28 1.6 1.54 2.86 3.5 
      3.14v2.36c-1.33-.04-2.63-.39-3.86-1.03V14.5a5.5 
      5.5 0 1 1-5.5-5.5c.22 
      0 .43.02.64.05v2.44a3.1 3.1 
      0 1 0 2.72 3.07V2z" />
    </svg>
  );
}
