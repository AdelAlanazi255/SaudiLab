import React, { useState } from 'react';
import Layout from '@theme/Layout';
import QuizRunner from '@site/src/components/Quiz/QuizRunner';
import QuizAccessGate from '@site/src/components/Quiz/QuizAccessGate';
import CourseCompleteModal from '@site/src/components/CourseCompleteModal';
import { COURSES } from '@site/src/course/courseMap';
import { COURSE_EVENT, markCompleted } from '@site/src/utils/progressKeys';
import { blueTeamQuiz, blueTeamQuizPassScore } from '@site/src/data/quizzes/blueTeamQuiz';

export default function BlueTeamFundamentalsQuizPage() {
  const [showCourseComplete, setShowCourseComplete] = useState(false);

  const onCompleteCourse = () => {
    const blueTeamLessons = COURSES?.blueteam?.lessons || [];
    blueTeamLessons.forEach((lesson) => {
      if (!lesson?.lessonId) return;
      markCompleted('blueteam', lesson.lessonId);
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(COURSE_EVENT));
    }

    setShowCourseComplete(true);
  };

  return (
    <Layout title="Final Quiz - Blue Team Fundamentals">
      <QuizAccessGate
        course="blueteam"
        requiredLessonId="lesson7"
        redirectTo="/blueteam"
        fallback={(
          <div className="sl-quiz-page">
            <div className="sl-quiz-card">
              <h1 className="sl-quiz-title">Final Quiz - Blue Team Fundamentals</h1>
              <p className="sl-quiz-subtitle">Checking quiz access...</p>
            </div>
          </div>
        )}
      >
        <QuizRunner
          title="Final Quiz - Blue Team Fundamentals"
          questions={blueTeamQuiz}
          passScore={blueTeamQuizPassScore}
          backToCourseHref="/blueteam"
          onCompleteCourse={onCompleteCourse}
          completeCourseLabel="Complete course"
        />
      </QuizAccessGate>

      <CourseCompleteModal
        open={showCourseComplete}
        onClose={() => setShowCourseComplete(false)}
        courseName="Blue Team Fundamentals"
        lessonsHref="/blueteam"
      />
    </Layout>
  );
}
