import React from 'react';

export default function LessonProgress({ current, total }) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="sl-lessonProgress">
      <div className="sl-lessonProgressHead">
        <span>Lesson {current} of {total}</span>
        <span>{percent}%</span>
      </div>

      <div className="sl-lessonProgressTrack">
        <div className="sl-lessonProgressFill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
