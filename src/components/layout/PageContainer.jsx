import React from 'react';

export default function PageContainer({ children, className = '', size = 'default' }) {
  const sizeClass = size === 'narrow' ? 'sl-page-container--narrow' : 'sl-page-container--default';
  return <div className={`sl-page-container ${sizeClass} ${className}`.trim()}>{children}</div>;
}
