import React, { useState } from 'react';
import Layout from '@theme/Layout';
import QuizRunner from '@site/src/components/Quiz/QuizRunner';
import QuizAccessGate from '@site/src/components/Quiz/QuizAccessGate';
import CourseCompleteModal from '@site/src/components/CourseCompleteModal';
import { COURSES } from '@site/src/course/courseMap';
import { COURSE_EVENT, markCompleted } from '@site/src/utils/progressKeys';
import { digitalForensicsQuiz, digitalForensicsQuizPassScore } from '@site/src/data/quizzes/digitalForensicsQuiz';

export default function DigitalForensicsQuizPage() {
  const [showCourseComplete, setShowCourseComplete] = useState(false);

  const onCompleteCourse = () => {
    const forensicsLessons = COURSES?.forensics?.lessons || [];
    forensicsLessons.forEach((lesson) => {
      if (!lesson?.lessonId) return;
      markCompleted('forensics', lesson.lessonId);
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(COURSE_EVENT));
    }

    setShowCourseComplete(true);
  };

  return (
    <Layout title="Final Quiz - Digital Forensics">
      <QuizAccessGate
        course="forensics"
        requiredLessonId="lesson7"
        redirectTo="/forensics"
        fallback={(
          <div className="sl-quiz-page">
            <div className="sl-quiz-card">
              <h1 className="sl-quiz-title">Final Quiz - Digital Forensics</h1>
              <p className="sl-quiz-subtitle">Checking quiz access...</p>
            </div>
          </div>
        )}
      >
        <QuizRunner
          title="Final Quiz - Digital Forensics"
          questions={digitalForensicsQuiz}
          passScore={digitalForensicsQuizPassScore}
          backToCourseHref="/forensics"
          onCompleteCourse={onCompleteCourse}
          completeCourseLabel="Complete course"
        />
      </QuizAccessGate>

      <CourseCompleteModal
        open={showCourseComplete}
        onClose={() => setShowCourseComplete(false)}
        courseName="Digital Forensics"
        lessonsHref="/forensics"
      />
    </Layout>
  );
}
