import React from 'react';

export default function Section({ children, className = '', as: Tag = 'section' }) {
  return <Tag className={`sl-section ${className}`.trim()}>{children}</Tag>;
}
