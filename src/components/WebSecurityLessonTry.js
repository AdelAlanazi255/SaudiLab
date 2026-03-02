import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import LandscapeTip from '@site/src/components/LandscapeTip';
import { canAccessLesson, getLastUnlockedLessonPath } from '@site/src/utils/lessonAccess';
import { getLessonMeta } from '@site/src/data/lessons';
import { getLesson } from '@site/src/course/courseMap';

const editorShellStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '550px',
  border: '1px solid #2a2f36',
  borderRadius: '10px',
  background: '#0f1115',
  overflow: 'hidden',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)',
};

const panelHeaderStyle = {
  height: '34px',
  padding: '0 0.75rem',
  display: 'flex',
  alignItems: 'center',
  fontSize: '12px',
  fontWeight: 700,
  color: '#9ca3af',
  borderBottom: '1px solid #2a2f36',
  background: '#0f1115',
};

const panelBodyStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
  borderRadius: '8px',
  background: '#0b0d10',
  overflow: 'auto',
  padding: '1rem',
  color: '#e5e7eb',
};

const inputStyle = {
  width: '100%',
  background: '#111827',
  color: '#e5e7eb',
  border: '1px solid #2a2f36',
  borderRadius: '8px',
  padding: '0.6rem',
  marginBottom: '0.6rem',
};

const outputBoxStyle = {
  background: '#0b1220',
  color: '#e5e7eb',
  border: '1px solid #2a2f36',
  borderRadius: '8px',
  padding: '0.75rem',
  marginBottom: '0.65rem',
};

const editorFooterStyle = {
  height: '56px',
  padding: '0 0.75rem',
  borderTop: '1px solid #2a2f36',
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  justifyContent: 'flex-start',
  background: '#0f1115',
};

const outputPanelStyle = {
  width: '100%',
  height: '550px',
  border: '1px solid #2a2f36',
  borderRadius: '10px',
  backgroundColor: '#0f1115',
  overflow: 'hidden',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)',
  display: 'flex',
  flexDirection: 'column',
};

const buttonBase = {
  height: '40px',
  padding: '0 1rem',
  borderRadius: '8px',
  border: '1px solid #2a2f36',
  cursor: 'pointer',
  fontWeight: 600,
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#15181d',
  color: '#e5e7eb',
};

function getLessonNumber(lessonId) {
  const m = String(lessonId || '').match(/(\d+)/);
  return m ? Number(m[1]) : NaN;
}

function getRisk(score) {
  if (score <= 1) return 'Low';
  if (score <= 3) return 'Medium';
  return 'High';
}

function getRiskColor(level) {
  if (level === 'Low') return 'var(--ifm-color-success)';
  if (level === 'Medium') return '#fbbf24';
  return 'var(--ifm-color-danger)';
}

export default function WebSecurityLessonTry({ lessonId = 'lesson1' }) {
  const lessonNumber = getLessonNumber(lessonId);
  const lessonMeta = useMemo(() => getLessonMeta('websecurity', lessonNumber), [lessonNumber]);
  const lesson = useMemo(() => getLesson('websecurity', lessonId), [lessonId]);
  const backPath = lesson?.permalink || `/web-security/lesson${lessonNumber}`;

  const [controlA, setControlA] = useState(false);
  const [controlB, setControlB] = useState(true);
  const [inputLevel, setInputLevel] = useState('review');
  const [backHover, setBackHover] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (canAccessLesson('websecurity', lessonNumber)) return;
    window.location.replace(getLastUnlockedLessonPath('websecurity') || '/web-security/lesson1');
  }, [lessonNumber]);

  const score = (controlA ? 0 : 2) + (controlB ? 0 : 2) + (inputLevel === 'strict' ? 0 : inputLevel === 'review' ? 1 : 2);
  const risk = getRisk(score);

  const explanation = risk === 'Low'
    ? 'Current placeholder settings represent safer defaults for this lesson.'
    : risk === 'Medium'
      ? 'Current placeholder settings are partially safe but still need improvement.'
      : 'Current placeholder settings represent elevated risk and should be tightened.';

  const reset = () => {
    setControlA(false);
    setControlB(true);
    setInputLevel('review');
  };

  return (
    <Layout title={`Web Security Lesson ${lessonNumber}: ${lessonMeta.title} - Try It Yourself`}>
      <div className="sl-try-page">
        <h1 className="sl-try-title">{`Web Security Lesson ${lessonNumber}: ${lessonMeta.title} - Try It Yourself`}</h1>
        <LandscapeTip />
        <div className="sl-try-layout">
          <div className="sl-try-col">
            <div style={editorShellStyle} className="sl-try-panel sl-try-editor-panel">
              <div style={panelHeaderStyle}>Inputs</div>
              <div style={{ flex: 1, padding: '0.5rem' }}>
                <div style={panelBodyStyle}>
                  <p style={{ marginTop: 0 }}>Interactive Demo Placeholder</p>
                  <label style={{ display: 'block', marginBottom: '0.6rem' }}>
                    <input type="checkbox" checked={controlA} onChange={(e) => setControlA(e.target.checked)} /> Toggle A
                  </label>
                  <label style={{ display: 'block', marginBottom: '0.6rem' }}>
                    <input type="checkbox" checked={controlB} onChange={(e) => setControlB(e.target.checked)} /> Toggle B
                  </label>
                  <label htmlFor="ws-level" style={{ display: 'block', marginBottom: '0.35rem' }}>
                    Review Mode
                  </label>
                  <select id="ws-level" value={inputLevel} onChange={(e) => setInputLevel(e.target.value)} style={inputStyle}>
                    <option value="strict">Strict</option>
                    <option value="review">Review</option>
                    <option value="relaxed">Relaxed</option>
                  </select>
                </div>
              </div>
              <div style={editorFooterStyle} className="sl-try-actions">
                <button onClick={reset} className="sl-try-action-btn" style={buttonBase}>Reset</button>
                <Link
                  to={backPath}
                  onMouseEnter={() => setBackHover(true)}
                  onMouseLeave={() => setBackHover(false)}
                  style={{ ...buttonBase, backgroundColor: backHover ? '#1b1e24' : 'transparent', color: '#9ca3af' }}
                >
                  {`Back to Lesson ${lessonNumber}`}
                </Link>
              </div>
            </div>
          </div>
          <div className="sl-try-col">
            <div style={outputPanelStyle} className="sl-try-panel sl-try-preview-panel">
              <div style={panelHeaderStyle}>Result</div>
              <div style={{ flex: 1, padding: '0.5rem' }}>
                <div style={panelBodyStyle}>
                  <div style={outputBoxStyle}>
                    Risk Level:{' '}
                    <span style={{ color: getRiskColor(risk), fontWeight: 800 }}>{risk}</span>
                  </div>
                  <div style={outputBoxStyle}>{explanation}</div>
                  <p style={{ margin: 0, color: '#9ca3af' }}>
                    This is a placeholder interactive model for lesson {lessonNumber}. Full scenario logic will be added in the content phase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sl-try-back-wrap">
          <Link to={backPath} className="sl-btn-ghost sl-try-back-btn">Go back to lesson</Link>
        </div>
      </div>
    </Layout>
  );
}

