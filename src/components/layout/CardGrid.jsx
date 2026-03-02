import React from 'react';

export default function CardGrid({ children, className = '', columns = 'three' }) {
  const columnClass = columns === 'four' ? 'sl-card-grid--four' : 'sl-card-grid--three';
  return <div className={`sl-card-grid ${columnClass} ${className}`.trim()}>{children}</div>;
}
