import React from 'react';
import { AuthProvider } from '@site/src/utils/authState';
import FAQChatWidget from '@site/src/components/FAQChatWidget';

export default function Root({ children }) {
  return (
    <AuthProvider>
      {children}
      <FAQChatWidget />
    </AuthProvider>
  );
}
