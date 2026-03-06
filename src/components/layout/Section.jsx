import React from 'react';

export default function Section({ children, className = '', as: Tag = 'section', ...rest }) {
  return (
    <Tag className={`sl-section ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
