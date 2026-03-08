import React, { useState } from 'react';
import Layout from '@theme/Layout';
import QuizRunner from '@site/src/components/Quiz/QuizRunner';
import QuizAccessGate from '@site/src/components/Quiz/QuizAccessGate';
import CourseCompleteModal from '@site/src/components/CourseCompleteModal';
import { COURSES } from '@site/src/course/courseMap';
import { COURSE_EVENT, markCompleted } from '@site/src/utils/progressKeys';
import {
  securityEthicsQuiz,
  securityEthicsQuizPassScore,
} from '@site/src/data/quizzes/securityEthicsQuiz';

export default function SecurityEthicsQuizPage() {
  const [showCourseComplete, setShowCourseComplete] = useState(false);

  const onCompleteCourse = () => {
    const ethicsLessons = COURSES?.ethics?.lessons || [];
    ethicsLessons.forEach((lesson) => {
      if (!lesson?.lessonId) return;
      markCompleted('ethics', lesson.lessonId);
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(COURSE_EVENT));
    }

    setShowCourseComplete(true);
  };

  return (
    <Layout title="Final Quiz - Security Ethics">
      <QuizAccessGate
        course="ethics"
        requiredLessonId="lesson7"
        redirectTo="/ethics"
        fallback={(
          <div className="sl-quiz-page">
            <div className="sl-quiz-card">
              <h1 className="sl-quiz-title">Final Quiz - Security Ethics</h1>
              <p className="sl-quiz-subtitle">Checking quiz access...</p>
            </div>
          </div>
        )}
      >
        <QuizRunner
          title="Final Quiz - Security Ethics"
          questions={securityEthicsQuiz}
          passScore={securityEthicsQuizPassScore}
          backToCourseHref="/ethics"
          onCompleteCourse={onCompleteCourse}
          completeCourseLabel="Complete course"
        />
      </QuizAccessGate>

      <CourseCompleteModal
        open={showCourseComplete}
        onClose={() => setShowCourseComplete(false)}
        courseName="Security Ethics"
        lessonsHref="/ethics"
      />
    </Layout>
  );
}
