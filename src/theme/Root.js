import React from 'react';
import { AuthProvider } from '@site/src/utils/authState';

export default function Root({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
