import React from 'react';
import Link from '@docusaurus/Link';

export default function TryItButton({ to, label = 'Try It Yourself ->' }) {
  return (
    <Link to={to} className="sl-btn-primary sl-lessonTryBtn">
      <b>{label}</b>
    </Link>
  );
}
