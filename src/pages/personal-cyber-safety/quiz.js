import React, { useState } from 'react';
import Layout from '@theme/Layout';
import QuizRunner from '@site/src/components/Quiz/QuizRunner';
import QuizAccessGate from '@site/src/components/Quiz/QuizAccessGate';
import CourseCompleteModal from '@site/src/components/CourseCompleteModal';
import { COURSES } from '@site/src/course/courseMap';
import { COURSE_EVENT, markCompleted } from '@site/src/utils/progressKeys';
import {
  personalCyberSafetyQuiz,
  personalCyberSafetyQuizPassScore,
} from '@site/src/data/quizzes/personalCyberSafetyQuiz';

export default function PersonalCyberSafetyQuizPage() {
  const [showCourseComplete, setShowCourseComplete] = useState(false);

  const onCompleteCourse = () => {
    const pcsLessons = COURSES?.pcs?.lessons || [];
    pcsLessons.forEach((lesson) => {
      if (!lesson?.lessonId) return;
      markCompleted('pcs', lesson.lessonId);
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(COURSE_EVENT));
    }

    setShowCourseComplete(true);
  };

  return (
    <Layout title="Final Quiz - Personal Cyber Safety">
      <QuizAccessGate
        course="pcs"
        requiredLessonId="lesson6"
        redirectTo="/pcs"
        fallback={(
          <div className="sl-quiz-page">
            <div className="sl-quiz-card">
              <h1 className="sl-quiz-title">Final Quiz - Personal Cyber Safety</h1>
              <p className="sl-quiz-subtitle">Checking quiz access...</p>
            </div>
          </div>
        )}
      >
        <QuizRunner
          title="Final Quiz - Personal Cyber Safety"
          questions={personalCyberSafetyQuiz}
          passScore={personalCyberSafetyQuizPassScore}
          backToCourseHref="/pcs"
          onCompleteCourse={onCompleteCourse}
          completeCourseLabel="Complete course"
        />
      </QuizAccessGate>

      <CourseCompleteModal
        open={showCourseComplete}
        onClose={() => setShowCourseComplete(false)}
        courseName="Personal Cyber Safety"
        lessonsHref="/pcs"
      />
    </Layout>
  );
}
