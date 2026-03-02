import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
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
  whiteSpace: 'pre-wrap',
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

function getRiskLabel(value) {
  if (value <= 1) return 'Low';
  if (value <= 3) return 'Medium';
  return 'High';
}

export default function CareerLessonTry({ lessonId = 'lesson1' }) {
  const lessonNumber = getLessonNumber(lessonId);
  const lessonMeta = useMemo(() => getLessonMeta('career', lessonNumber), [lessonNumber]);
  const lesson = useMemo(() => getLesson('career', lessonId), [lessonId]);
  const backPath = lesson?.permalink || `/career/lesson${lessonNumber}`;

  const [interests, setInterests] = useState('defense');
  const [workStyle, setWorkStyle] = useState('structured');
  const [communication, setCommunication] = useState('medium');
  const [skillItems, setSkillItems] = useState(['networking']);
  const [hoursPerWeek, setHoursPerWeek] = useState('5');
  const [backHover, setBackHover] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (canAccessLesson('career', lessonNumber)) return;
    window.location.replace(getLastUnlockedLessonPath('career') || '/career/lesson1');
  }, [lessonNumber]);

  const reset = () => {
    setInterests('defense');
    setWorkStyle('structured');
    setCommunication('medium');
    setSkillItems(['networking']);
    setHoursPerWeek('5');
  };

  const toggleSkill = (item) => {
    setSkillItems((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]));
  };

  const trackSuggestion = () => {
    if (interests === 'defense' && workStyle === 'structured') return 'Blue Team / SOC';
    if (interests === 'governance') return 'GRC';
    if (interests === 'investigation') return 'Digital Forensics';
    if (interests === 'application') return 'AppSec';
    return 'General Cyber Foundations';
  };

  const weekPlan = () => {
    const h = Number(hoursPerWeek);
    const focus = skillItems.slice(0, 3);
    const perArea = focus.length ? Math.max(1, Math.floor(h / focus.length)) : h;
    return focus.length
      ? focus.map((item) => `- ${item}: ${perArea} hour(s)/week`).join('\n')
      : '- Add at least one skill area to generate a plan';
  };

  const placeholderLevel = getRiskLabel(Math.max(0, 4 - skillItems.length));

  const renderInput = () => {
    if (lessonNumber === 2) {
      return (
        <>
          <p style={{ marginTop: 0 }}>Pick Your Track Quiz</p>
          <label htmlFor="interests">Main interest</label>
          <select id="interests" value={interests} onChange={(e) => setInterests(e.target.value)} style={inputStyle}>
            <option value="defense">Defensive monitoring and response</option>
            <option value="governance">Policy, risk, and compliance</option>
            <option value="investigation">Evidence and investigation</option>
            <option value="application">Application security concepts</option>
          </select>

          <label htmlFor="work-style">Preferred work style</label>
          <select id="work-style" value={workStyle} onChange={(e) => setWorkStyle(e.target.value)} style={inputStyle}>
            <option value="structured">Structured process</option>
            <option value="creative">Exploratory analysis</option>
          </select>

          <label htmlFor="communication">Communication focus</label>
          <select id="communication" value={communication} onChange={(e) => setCommunication(e.target.value)} style={inputStyle}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </>
      );
    }

    if (lessonNumber === 7) {
      return (
        <>
          <p style={{ marginTop: 0 }}>Skill Builder Checklist</p>
          {[
            'networking',
            'operating systems',
            'security basics',
            'documentation',
            'communication',
          ].map((item) => (
            <label key={item} style={{ display: 'block', marginBottom: '0.45rem' }}>
              <input
                type="checkbox"
                checked={skillItems.includes(item)}
                onChange={() => toggleSkill(item)}
              /> {item}
            </label>
          ))}

          <label htmlFor="hours">Available hours per week</label>
          <select id="hours" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} style={inputStyle}>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="8">8</option>
            <option value="12">12</option>
          </select>
        </>
      );
    }

    return (
      <>
        <p style={{ marginTop: 0 }}>Career Exercise Placeholder</p>
        <label htmlFor="placeholder">Learning focus</label>
        <select id="placeholder" value={interests} onChange={(e) => setInterests(e.target.value)} style={inputStyle}>
          <option value="defense">Defensive roles</option>
          <option value="governance">Governance roles</option>
          <option value="investigation">Investigation roles</option>
          <option value="application">Application security roles</option>
        </select>
      </>
    );
  };

  const renderOutput = () => {
    if (lessonNumber === 2) {
      return (
        <>
          <div style={outputBoxStyle}>{`Suggested track: ${trackSuggestion()}`}</div>
          <div style={outputBoxStyle}>Next step: Focus on one core skill area this week and document what you learned.</div>
        </>
      );
    }

    if (lessonNumber === 7) {
      return (
        <>
          <div style={outputBoxStyle}>4-week plan preview:\n{weekPlan()}</div>
          <div style={outputBoxStyle}>Recommendation: Keep weekly goals small and measurable, then review progress every weekend.</div>
        </>
      );
    }

    return (
      <>
        <div style={outputBoxStyle}>Progress level: {placeholderLevel}</div>
        <div style={outputBoxStyle}>This is a lightweight placeholder interactive for lesson {lessonNumber}. Expanded career activities can be added later.</div>
      </>
    );
  };

  return (
    <Layout title={`Career Lesson ${lessonNumber}: ${lessonMeta.title} - Try It Yourself`}>
      <div className="sl-try-page">
        <h1 className="sl-try-title">{`Career Lesson ${lessonNumber}: ${lessonMeta.title} - Try It Yourself`}</h1>
        <div className="sl-try-layout">
          <div className="sl-try-col">
            <div style={editorShellStyle} className="sl-try-panel sl-try-editor-panel">
              <div style={panelHeaderStyle}>Simulator / Actions</div>
              <div style={{ flex: 1, padding: '0.5rem' }}>
                <div style={panelBodyStyle}>{renderInput()}</div>
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
              <div style={panelHeaderStyle}>Output / Findings / Explanation</div>
              <div style={{ flex: 1, padding: '0.5rem' }}>
                <div style={panelBodyStyle}>
                  {renderOutput()}
                  <p style={{ margin: 0, color: '#9ca3af' }}>
                    This simulator is educational and career-focused only. No offensive security actions are included.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

