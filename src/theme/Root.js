import React from 'react';
import { AuthProvider } from '@site/src/utils/authState';
import FAQChatWidget from '@site/src/components/FAQChatWidget';
import LearningModeRequiredModal from '@site/src/components/LearningModeRequiredModal';

export default function Root({ children }) {
  return (
    <AuthProvider>
      {children}
      <LearningModeRequiredModal />
      <FAQChatWidget />
    </AuthProvider>
  );
}
