import React, { useState } from 'react';
import Layout from '@theme/Layout';
import QuizRunner from '@site/src/components/Quiz/QuizRunner';
import QuizAccessGate from '@site/src/components/Quiz/QuizAccessGate';
import CourseCompleteModal from '@site/src/components/CourseCompleteModal';
import { COURSES } from '@site/src/course/courseMap';
import { COURSE_EVENT, markCompleted } from '@site/src/utils/progressKeys';
import {
  cyberSecurityEssentialsQuiz,
  cyberSecurityEssentialsQuizPassScore,
} from '@site/src/data/quizzes/cyberSecurityEssentialsQuiz';

export default function CyberSecurityEssentialsQuizPage() {
  const [showCourseComplete, setShowCourseComplete] = useState(false);

  const onCompleteCourse = () => {
    const cseLessons = COURSES?.cse?.lessons || [];
    cseLessons.forEach((lesson) => {
      if (!lesson?.lessonId) return;
      markCompleted('cse', lesson.lessonId);
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(COURSE_EVENT));
    }

    setShowCourseComplete(true);
  };

  return (
    <Layout title="Final Quiz - Cyber Security Essentials">
      <QuizAccessGate
        course="cse"
        requiredLessonId="cse_lesson8"
        redirectTo="/cse"
        fallback={(
          <div className="sl-quiz-page">
            <div className="sl-quiz-card">
              <h1 className="sl-quiz-title">Final Quiz - Cyber Security Essentials</h1>
              <p className="sl-quiz-subtitle">Checking quiz access...</p>
            </div>
          </div>
        )}
      >
        <QuizRunner
          title="Final Quiz - Cyber Security Essentials"
          questions={cyberSecurityEssentialsQuiz}
          passScore={cyberSecurityEssentialsQuizPassScore}
          backToCourseHref="/cse"
          onCompleteCourse={onCompleteCourse}
          completeCourseLabel="Complete course"
        />
      </QuizAccessGate>

      <CourseCompleteModal
        open={showCourseComplete}
        onClose={() => setShowCourseComplete(false)}
        courseName="Cyber Security Essentials"
        lessonsHref="/cse"
      />
    </Layout>
  );
}
