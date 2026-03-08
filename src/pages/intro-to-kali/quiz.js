import React, { useState } from 'react';
import Layout from '@theme/Layout';
import QuizRunner from '@site/src/components/Quiz/QuizRunner';
import QuizAccessGate from '@site/src/components/Quiz/QuizAccessGate';
import CourseCompleteModal from '@site/src/components/CourseCompleteModal';
import { COURSES } from '@site/src/course/courseMap';
import { COURSE_EVENT, markCompleted } from '@site/src/utils/progressKeys';
import { kaliIntroQuiz, kaliIntroQuizPassScore } from '@site/src/data/quizzes/kaliIntroQuiz';

export default function IntroToKaliQuizPage() {
  const [showCourseComplete, setShowCourseComplete] = useState(false);

  const onCompleteCourse = () => {
    const kaliLessons = COURSES?.kalitools?.lessons || [];
    kaliLessons.forEach((lesson) => {
      if (!lesson?.lessonId) return;
      markCompleted('kalitools', lesson.lessonId);
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(COURSE_EVENT));
    }

    setShowCourseComplete(true);
  };

  return (
    <Layout title="Final Quiz - Intro to Security Tools (Kali Linux)">
      <QuizAccessGate
        course="kalitools"
        requiredLessonId="lesson8"
        redirectTo="/kali"
        fallback={(
          <div className="sl-quiz-page">
            <div className="sl-quiz-card">
              <h1 className="sl-quiz-title">Final Quiz - Intro to Security Tools (Kali Linux)</h1>
              <p className="sl-quiz-subtitle">Checking quiz access...</p>
            </div>
          </div>
        )}
      >
        <QuizRunner
          title="Final Quiz - Intro to Security Tools (Kali Linux)"
          questions={kaliIntroQuiz}
          passScore={kaliIntroQuizPassScore}
          backToCourseHref="/kali"
          onCompleteCourse={onCompleteCourse}
          completeCourseLabel="Complete course"
        />
      </QuizAccessGate>

      <CourseCompleteModal
        open={showCourseComplete}
        onClose={() => setShowCourseComplete(false)}
        courseName="Intro to Security Tools (Kali Linux)"
        lessonsHref="/kali"
      />
    </Layout>
  );
}
