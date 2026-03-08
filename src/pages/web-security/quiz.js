import React, { useState } from 'react';
import Layout from '@theme/Layout';
import QuizRunner from '@site/src/components/Quiz/QuizRunner';
import QuizAccessGate from '@site/src/components/Quiz/QuizAccessGate';
import CourseCompleteModal from '@site/src/components/CourseCompleteModal';
import { COURSES } from '@site/src/course/courseMap';
import { COURSE_EVENT, markCompleted } from '@site/src/utils/progressKeys';
import { webSecurityQuiz, webSecurityQuizPassScore } from '@site/src/data/quizzes/webSecurityQuiz';

export default function WebSecurityQuizPage() {
  const [showCourseComplete, setShowCourseComplete] = useState(false);

  const onCompleteCourse = () => {
    const webSecurityLessons = COURSES?.websecurity?.lessons || [];
    webSecurityLessons.forEach((lesson) => {
      if (!lesson?.lessonId) return;
      markCompleted('websecurity', lesson.lessonId);
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(COURSE_EVENT));
    }

    setShowCourseComplete(true);
  };

  return (
    <Layout title="Final Quiz - Web Security">
      <QuizAccessGate
        course="websecurity"
        requiredLessonId="lesson7"
        redirectTo="/web-security"
        fallback={(
          <div className="sl-quiz-page">
            <div className="sl-quiz-card">
              <h1 className="sl-quiz-title">Final Quiz - Web Security</h1>
              <p className="sl-quiz-subtitle">Checking quiz access...</p>
            </div>
          </div>
        )}
      >
        <QuizRunner
          title="Final Quiz - Web Security"
          questions={webSecurityQuiz}
          passScore={webSecurityQuizPassScore}
          backToCourseHref="/web-security"
          onCompleteCourse={onCompleteCourse}
          completeCourseLabel="Complete course"
        />
      </QuizAccessGate>

      <CourseCompleteModal
        open={showCourseComplete}
        onClose={() => setShowCourseComplete(false)}
        courseName="Web Security"
        lessonsHref="/web-security"
      />
    </Layout>
  );
}
