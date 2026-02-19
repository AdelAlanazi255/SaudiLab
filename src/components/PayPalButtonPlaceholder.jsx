import React from 'react';

export default function PayPalButtonPlaceholder() {
  return (
    <div style={box}>
      <button type="button" disabled style={disabledBtn} aria-label="PayPal unavailable">
        PayPal (coming soon)
      </button>
      <p style={helper}>PayPal is a placeholder for now. Integration will be added later.</p>
    </div>
  );
}

const box = {
  marginTop: '0.95rem',
};

const disabledBtn = {
  width: '100%',
  border: '1px solid rgba(255,255,255,0.16)',
  borderRadius: 12,
  background: 'rgba(255,255,255,0.05)',
  color: 'rgba(255,255,255,0.55)',
  padding: '0.85rem',
  fontWeight: 800,
  cursor: 'not-allowed',
};

const helper = {
  marginTop: '0.55rem',
  opacity: 0.75,
  fontSize: '0.9rem',
};
