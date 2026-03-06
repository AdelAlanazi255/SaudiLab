import React from 'react';

export default function FAQTypingIndicator() {
  return (
    <div className="sl-faqTyping" role="status" aria-live="polite" aria-label="Preparing answer">
      <span className="sl-faqTypingDot" />
      <span className="sl-faqTypingDot" />
      <span className="sl-faqTypingDot" />
    </div>
  );
}
