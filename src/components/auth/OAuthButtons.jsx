import React from 'react';
import { supabase } from '@site/src/utils/supabaseClient';
import { sanitizeNextPath } from '@site/src/utils/nextPath';

const PROVIDERS = [
  { key: 'google', label: 'Google', Icon: GoogleIcon },
  { key: 'github', label: 'GitHub', Icon: GitHubIcon },
  { key: 'discord', label: 'Discord', Icon: DiscordIcon },
];

export default function OAuthButtons({
  disabled = false,
  onError,
  nextPath = null,
}) {
  const onOAuth = async (provider) => {
    if (typeof window === 'undefined') return;
    if (!supabase) {
      onError?.('OAuth login is not configured.');
      return;
    }

    const safeNext = sanitizeNextPath(nextPath, '/');
    const callbackUrl = new URL('/auth/callback', window.location.origin);
    callbackUrl.searchParams.set('next', safeNext);

    onError?.('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });
    if (error) onError?.(error.message);
  };

  return (
    <div style={stackStyle}>
      {PROVIDERS.map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => onOAuth(key)}
          className="sl-auth-oauthBtn"
          style={buttonStyle}
          disabled={disabled}
        >
          <span style={iconWrapStyle}><Icon /></span>
          <span>{`Continue with ${label}`}</span>
        </button>
      ))}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v4.1h5.8c-.3 1.3-1.8 3.9-5.8 3.9-3.5 0-6.4-2.9-6.4-6.4s2.9-6.4 6.4-6.4c2 0 3.4.8 4.2 1.6l2.9-2.8C17.2 2.6 14.8 1.6 12 1.6 6.2 1.6 1.6 6.2 1.6 12S6.2 22.4 12 22.4c6.9 0 10.2-4.8 10.2-7.3 0-.5-.1-.9-.1-1.3H12z" />
      <path fill="#34A853" d="M1.6 7.1l3.4 2.5c.9-2 2.9-3.4 5.1-3.4 1.4 0 2.7.5 3.7 1.4l2.9-2.8C15.2 2.8 13.7 2 12 2 7.9 2 4.3 4.5 2.6 8.1z" opacity=".001" />
      <path fill="#4285F4" d="M22.2 12.1c0-.7-.1-1.2-.2-1.8H12v3.9h5.7c-.2 1.2-1 2.3-2.1 3v2.4h3.4c2-1.8 3.2-4.6 3.2-7.5z" />
      <path fill="#FBBC05" d="M5 14.5c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V8.3H1.6A10.3 10.3 0 0 0 1.6 12c0 1.6.4 3.2 1.1 4.5z" />
      <path fill="#34A853" d="M12 22.4c2.8 0 5.2-.9 6.9-2.6l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-4.9-1.8-5.7-4.2H2.8v2.6c1.7 3.4 5.3 5.8 9.2 5.8z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.8 0-1.3.4-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.7 11.7 0 0 1 6 0C17.3 5.6 18.3 6 18.3 6c.6 1.6.2 2.8.1 3.1.7.9 1.2 2 1.2 3.2 0 4.5-2.8 5.5-5.5 5.8.5.4.8 1.1.8 2.2v3.1c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.3 4.3A16.7 16.7 0 0 0 16.2 3c-.2.3-.4.8-.6 1.2a15.2 15.2 0 0 0-7.1 0A9.2 9.2 0 0 0 8 3a16.6 16.6 0 0 0-4.2 1.4C1.1 8.4.4 12.2.8 16.1a16.8 16.8 0 0 0 5.1 2.6c.4-.5.8-1.1 1.1-1.7-.6-.2-1.1-.5-1.7-.8l.4-.3c3.3 1.5 6.9 1.5 10.1 0l.4.3c-.5.3-1.1.6-1.7.8.3.6.7 1.2 1.1 1.7a16.8 16.8 0 0 0 5.1-2.6c.5-4.6-.9-8.4-3.4-11.8ZM9.3 13.8c-1 0-1.9-.9-1.9-2s.8-2 1.9-2c1.1 0 1.9.9 1.9 2s-.8 2-1.9 2Zm5.4 0c-1 0-1.9-.9-1.9-2s.8-2 1.9-2c1.1 0 1.9.9 1.9 2s-.8 2-1.9 2Z"
      />
    </svg>
  );
}

const stackStyle = {
  display: 'grid',
  gap: '10px',
};

const buttonStyle = {
  width: '100%',
  height: 46,
  padding: '0 14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.18)',
  fontWeight: 800,
  cursor: 'pointer',
  background: 'rgba(255,255,255,0.05)',
  color: 'rgba(255,255,255,0.94)',
  transition: 'background-color 0.15s ease, border-color 0.15s ease',
};

const iconWrapStyle = {
  width: 20,
  height: 20,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};
