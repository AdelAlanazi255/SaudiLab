import React from 'react';
import Link from '@docusaurus/Link';

export default function TryItButton({ to, label = 'Try It Yourself ->' }) {
  return (
    <Link
      to={to}
      style={{
        padding: '0.8rem 1.5rem',
        backgroundColor: 'white',
        color: 'black',
        borderRadius: '6px',
        textDecoration: 'none',
        display: 'inline-block',
        marginTop: '1rem',
        fontWeight: 400,
      }}
    >
      <b>{label}</b>
    </Link>
  );
}
