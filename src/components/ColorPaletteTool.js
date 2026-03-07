import React, { useEffect, useMemo, useRef, useState } from 'react';

function normalizeHex(value) {
  const raw = String(value || '').trim();
  if (!/^#[0-9a-f]{6}$/i.test(raw)) return '#2563EB';
  return raw.toUpperCase();
}

async function copyText(text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  if (typeof document === 'undefined') return;
  const temp = document.createElement('textarea');
  temp.value = text;
  temp.setAttribute('readonly', '');
  temp.style.position = 'absolute';
  temp.style.left = '-9999px';
  document.body.appendChild(temp);
  temp.select();
  document.execCommand('copy');
  document.body.removeChild(temp);
}

export default function ColorPaletteTool() {
  const [open, setOpen] = useState(false);
  const [hex, setHex] = useState('#2563EB');
  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef(null);
  const colorValue = useMemo(() => normalizeHex(hex), [hex]);

  useEffect(
    () => () => {
      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const onCopy = async () => {
    try {
      await copyText(colorValue);
      setCopied(true);
      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
      copiedTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="sl-colorPaletteWrap">
      <button
        type="button"
        className="sl-btn-ghost sl-colorPaletteTrigger"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open color palette"
        title="Open color palette"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="sl-color-palette-popover"
      >
        <svg
          className="sl-colorPaletteIcon"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="slPaletteBase" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#A7F3D0" />
              <stop offset="1" stopColor="#86EFAC" />
            </linearGradient>
          </defs>
          <path
            d="M12 3.2C7.03 3.2 3 7.08 3 11.87c0 4.4 3.47 7.98 7.75 7.98h1.24a2.58 2.58 0 0 0 2.58-2.58c0-.8-.36-1.45-.36-2.08 0-.96.79-1.74 1.74-1.74h1.66a6.3 6.3 0 0 0 6.3-6.3c0-4.36-4.51-7.95-9.91-7.95Z"
            fill="url(#slPaletteBase)"
          />
          <circle cx="7.1" cy="11.6" r="1.15" fill="#3B82F6" />
          <circle cx="9.9" cy="8.1" r="1.15" fill="#22C55E" />
          <circle cx="13.45" cy="7.7" r="1.15" fill="#FACC15" />
          <circle cx="16.5" cy="9.9" r="1.15" fill="#EF4444" />
        </svg>
      </button>

      {open ? (
        <div
          className="sl-colorPaletteModalBackdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            id="sl-color-palette-popover"
            className="sl-colorPaletteModal"
            role="dialog"
            aria-modal="true"
            aria-label="Color Palette"
          >
            <div className="sl-colorPaletteModalHead">
              <h3 className="sl-colorPaletteModalTitle">Color Palette</h3>
              <button
                type="button"
                className="sl-colorPaletteClose"
                onClick={() => setOpen(false)}
                aria-label="Close color palette"
              >
                X
              </button>
            </div>
            <p className="sl-colorPaletteNote">Pick a color and copy its HEX value into your CSS.</p>

            <div className="sl-colorPalettePickerRow">
              <input
                type="color"
                className="sl-colorPalettePicker"
                aria-label="Choose color"
                value={colorValue}
                onChange={(event) => setHex(normalizeHex(event.target.value))}
              />
              <div className="sl-colorPalettePreview" style={{ backgroundColor: colorValue }} aria-hidden="true" />
            </div>

            <div className="sl-colorPaletteValueRow">
              <input
                type="text"
                className="sl-colorPaletteHex"
                value={colorValue}
                readOnly
                aria-label="Selected HEX value"
              />
              <button type="button" className="sl-btn-primary sl-colorPaletteCopy" onClick={onCopy}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
