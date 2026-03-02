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
    <div className="sl-modalBackdrop" onMouseDown={onBackdrop}>
      <div className="sl-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="sl-modalHead">
          <div>
            <div className="sl-modalTitle">{title}</div>
            <div className="sl-modalMsg">{message}</div>
          </div>
          <button onClick={onCancel} className="sl-modalX" aria-label="Close">
            ×
          </button>
        </div>

        <div className="sl-modalActions">
          <button onClick={onCancel} className="sl-btn-ghost">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="sl-btn-primary">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
