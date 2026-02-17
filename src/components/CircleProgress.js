// src/components/CircleProgress.js
import React from 'react';

export default function CircleProgress({ percent = 0, size = 120, stroke = 10, label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <div style={{ display: 'grid', justifyItems: 'center', gap: '0.6rem' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="transparent"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="transparent"
            stroke="#7cf2b0"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 650ms ease' }}
          />
        </svg>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            fontWeight: 950,
            fontSize: '1.35rem',
            color: 'rgba(255,255,255,0.92)',
          }}
        >
          {percent}%
        </div>
      </div>

      {label ? (
        <div style={{ fontWeight: 900, color: 'rgba(255,255,255,0.80)' }}>{label}</div>
      ) : null}
    </div>
  );
}
