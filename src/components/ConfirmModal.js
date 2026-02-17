import React from 'react';

export default function ConfirmModal({
  open,
  title = 'Confirm',
  message = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div style={backdrop} onMouseDown={onBackdrop}>
      <div style={modal} role="dialog" aria-modal="true" aria-label={title}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={titleStyle}>{title}</div>
            <div style={msgStyle}>{message}</div>
          </div>
          <button onClick={onCancel} style={xBtn} aria-label="Close">
            ✕
          </button>
        </div>

        <div style={btnRow}>
          <button onClick={onCancel} style={cancelBtn}>
            {cancelText}
          </button>
          <button onClick={onConfirm} style={confirmBtn}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

const backdrop = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.62)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1.5rem',
  zIndex: 9999,
};

const modal = {
  width: '100%',
  maxWidth: 460,
  borderRadius: 18,
  padding: '1.25rem',
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'rgba(10, 14, 20, 0.92)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.55), 0 0 60px rgba(124, 242, 176, 0.10)',
  color: 'rgba(255,255,255,0.92)',
};

const titleStyle = {
  fontWeight: 950,
  fontSize: '1.15rem',
  marginBottom: '0.35rem',
};

const msgStyle = {
  opacity: 0.75,
  lineHeight: 1.6,
};

const btnRow = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  marginTop: '1.15rem',
};

const cancelBtn = {
  padding: '0.65rem 0.95rem',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'rgba(255,255,255,0.06)',
  color: 'rgba(255,255,255,0.92)',
  fontWeight: 900,
  cursor: 'pointer',
};

const confirmBtn = {
  padding: '0.65rem 0.95rem',
  borderRadius: 12,
  border: 'none',
  background: '#7cf2b0',
  color: '#0b0f14',
  fontWeight: 950,
  cursor: 'pointer',
};

const xBtn = {
  width: 34,
  height: 34,
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'rgba(255,255,255,0.06)',
  color: 'rgba(255,255,255,0.85)',
  cursor: 'pointer',
};
