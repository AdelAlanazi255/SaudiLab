import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FAQ_ITEMS } from '@site/src/data/faqItems';
import { useAuth } from '@site/src/utils/authState';
import FeedbackModal from '@site/src/components/FeedbackModal';
import FAQTypingIndicator from '@site/src/components/FAQTypingIndicator';
import './faqChatWidget.css';

const MIN_TYPING_MS = 650;
const MAX_TYPING_MS = 1100;

function randomDelayMs() {
  return Math.floor(Math.random() * (MAX_TYPING_MS - MIN_TYPING_MS + 1)) + MIN_TYPING_MS;
}

export default function FAQChatWidget() {
  const auth = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const timerRef = useRef(null);

  const activeItem = useMemo(
    () => FAQ_ITEMS.find((item) => item.id === activeQuestionId) || null,
    [activeQuestionId],
  );

  useEffect(
    () => () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    },
    [],
  );

  const handleSelectQuestion = (item) => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    setActiveQuestionId(item.id);
    setShowAnswer(false);
    setShowTyping(true);

    timerRef.current = window.setTimeout(() => {
      setShowTyping(false);
      setShowAnswer(true);
    }, randomDelayMs());
  };

  return (
    <>
      <div className="sl-faqWidget">
        {isOpen ? (
          <section className="sl-faqPanel" aria-label="FAQ assistant panel">
            <div className="sl-faqHeader">
              <div>
                <h2 className="sl-faqTitle">Need help?</h2>
                <p className="sl-faqSubtitle">Choose a question and I will answer instantly.</p>
              </div>
              <button
                type="button"
                className="sl-faqClose"
                aria-label="Close FAQ assistant"
                onClick={() => setIsOpen(false)}
              >
                x
              </button>
            </div>

            <div className="sl-faqChat" aria-live="polite">
              <p className="sl-faqEmpty">Choose a question below to get a guided answer.</p>

              <div className="sl-faqSuggestionStack" role="list" aria-label="Frequently asked questions">
                {FAQ_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`sl-faqQuestionChip ${activeQuestionId === item.id ? 'sl-faqQuestionChipActive' : ''}`}
                    onClick={() => handleSelectQuestion(item)}
                    aria-label={`Ask: ${item.question}`}
                  >
                    {item.question}
                  </button>
                ))}
              </div>

              {activeItem ? (
                <>
                  <div className="sl-faqMsg sl-faqMsgUser">{activeItem.question}</div>
                  {showTyping ? <FAQTypingIndicator /> : null}
                  {showAnswer ? <div className="sl-faqMsg sl-faqMsgBot">{activeItem.answer}</div> : null}
                </>
              ) : null}
            </div>

            <div className="sl-faqFooter">
              <button
                type="button"
                className="sl-faqFeedbackBtn"
                onClick={() => setFeedbackOpen(true)}
                aria-label="Open feedback form"
              >
                Share feedback
              </button>
            </div>
          </section>
        ) : null}

        <button
          type="button"
          className="sl-faqBubble"
          aria-label={isOpen ? 'Hide FAQ assistant' : 'Open FAQ assistant'}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          ?
        </button>
      </div>

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        userEmail={auth?.user?.email || auth?.profile?.email || ''}
        userId={auth?.user?.id || null}
      />
    </>
  );
}
