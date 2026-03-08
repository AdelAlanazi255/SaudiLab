import React, { useMemo, useState } from 'react';
import Link from '@docusaurus/Link';

function clampPassScore(passScore, questionCount) {
  const fallback = Math.ceil(questionCount * 0.6);
  const normalized = Number.isFinite(Number(passScore)) ? Number(passScore) : fallback;
  if (normalized < 1) return 1;
  if (normalized > questionCount) return questionCount;
  return normalized;
}

export default function QuizRunner({
  title = 'Final Quiz',
  questions = [],
  passScore = null,
  backToCourseHref = '/',
  onCompleteCourse = null,
  completeCourseLabel = 'Complete course',
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(() => Array.from({ length: questions.length }, () => null));
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalQuestions = questions.length;
  const safePassScore = useMemo(
    () => clampPassScore(passScore, totalQuestions || 1),
    [passScore, totalQuestions],
  );
  const currentQuestion = questions[currentIndex] || null;
  const selectedAnswer = answers[currentIndex];

  const score = useMemo(
    () => questions.reduce((sum, item, i) => (answers[i] === item.answer ? sum + 1 : sum), 0),
    [answers, questions],
  );
  const passed = score >= safePassScore;

  const onSelect = (optionIndex) => {
    setAnswers((prev) => {
      const nextAnswers = [...prev];
      nextAnswers[currentIndex] = optionIndex;
      return nextAnswers;
    });
  };

  const onNext = () => {
    if (selectedAnswer === null || selectedAnswer === undefined) return;
    if (currentIndex >= totalQuestions - 1) {
      setIsSubmitted(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const onRetry = () => {
    setAnswers(Array.from({ length: totalQuestions }, () => null));
    setCurrentIndex(0);
    setIsSubmitted(false);
  };

  if (!totalQuestions) {
    return (
      <div className="sl-quiz-page">
        <div className="sl-quiz-card">
          <h1 className="sl-quiz-title">{title}</h1>
          <p className="sl-quiz-subtitle">Quiz questions are not available yet.</p>
          <div className="sl-quiz-actions">
            <Link to={backToCourseHref} className="sl-btn-primary">Back to Course</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sl-quiz-page">
      <div className="sl-quiz-card">
        <h1 className="sl-quiz-title">{title}</h1>

        {isSubmitted ? (
          <>
            <h2 className="sl-quiz-resultTitle">Quiz Complete</h2>
            <p className="sl-quiz-score">{`Score: ${score} / ${totalQuestions}`}</p>
            <p className="sl-quiz-resultMessage">
              {passed
                ? 'Great job! You passed the course quiz.'
                : 'You did not pass yet. Review the lessons and try again.'}
            </p>
            <div className="sl-quiz-actions">
              <button type="button" onClick={onRetry} className="sl-btn-primary">Retry Quiz</button>
              <Link to={backToCourseHref} className="sl-btn-ghost">Back to Course</Link>
              {passed && typeof onCompleteCourse === 'function' ? (
                <button type="button" onClick={onCompleteCourse} className="sl-btn-primary">
                  {completeCourseLabel}
                </button>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <p className="sl-quiz-progress">{`Question ${currentIndex + 1} of ${totalQuestions}`}</p>
            <h2 className="sl-quiz-question">{currentQuestion.question}</h2>
            <div className="sl-quiz-options">
              {currentQuestion.options.map((option, optionIndex) => (
                <button
                  key={option}
                  type="button"
                  className={`sl-quiz-option${selectedAnswer === optionIndex ? ' is-selected' : ''}`}
                  onClick={() => onSelect(optionIndex)}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="sl-quiz-actions">
              <button
                type="button"
                onClick={onNext}
                className="sl-btn-primary"
                disabled={selectedAnswer === null || selectedAnswer === undefined}
              >
                {currentIndex === totalQuestions - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
