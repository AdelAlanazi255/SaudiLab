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
  marginBottom: '0.7rem',
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

const SCENARIOS = {
  1: {
    labelA: 'Enable login alerts',
    labelB: 'Review account activity weekly',
    selectLabel: 'Password strength level',
    options: [
      { value: 'strong', label: 'Strong' },
      { value: 'medium', label: 'Medium' },
      { value: 'weak', label: 'Weak' },
    ],
    score: (a, b, c) => (a ? 0 : 2) + (b ? 0 : 1) + (c === 'strong' ? 0 : c === 'medium' ? 1 : 2),
  },
  2: {
    labelA: 'Use a password manager',
    labelB: 'Use unique passwords for each account',
    selectLabel: 'Master password quality',
    options: [
      { value: 'strong', label: 'Strong passphrase' },
      { value: 'medium', label: 'Moderate phrase' },
      { value: 'weak', label: 'Simple password' },
    ],
    score: (a, b, c) => (a ? 0 : 2) + (b ? 0 : 2) + (c === 'strong' ? 0 : c === 'medium' ? 1 : 2),
  },
  3: {
    labelA: 'Enable Multi-Factor Authentication',
    labelB: 'Save backup recovery codes',
    selectLabel: 'Second factor type',
    options: [
      { value: 'app', label: 'Authenticator app' },
      { value: 'sms', label: 'SMS code' },
      { value: 'none', label: 'No second factor' },
    ],
    score: (a, b, c) => (a ? 0 : 3) + (b ? 0 : 1) + (c === 'app' ? 0 : c === 'sms' ? 1 : 2),
  },
  4: {
    labelA: 'Verify sender before clicking links',
    labelB: 'Report suspicious messages',
    selectLabel: 'Response to urgent message',
    options: [
      { value: 'verify', label: 'Verify first' },
      { value: 'ignore', label: 'Ignore only' },
      { value: 'click', label: 'Click immediately' },
    ],
    score: (a, b, c) => (a ? 0 : 2) + (b ? 0 : 1) + (c === 'verify' ? 0 : c === 'ignore' ? 1 : 2),
  },
  5: {
    labelA: 'Pause before sharing sensitive data',
    labelB: 'Confirm identity through trusted channel',
    selectLabel: 'Unknown caller request',
    options: [
      { value: 'verify', label: 'Verify identity' },
      { value: 'delay', label: 'Delay response' },
      { value: 'share', label: 'Share requested info' },
    ],
    score: (a, b, c) => (a ? 0 : 1) + (b ? 0 : 2) + (c === 'verify' ? 0 : c === 'delay' ? 1 : 2),
  },
  6: {
    labelA: 'Download only from official sources',
    labelB: 'Review extension permissions',
    selectLabel: 'Browser warning handling',
    options: [
      { value: 'cancel', label: 'Cancel and verify' },
      { value: 'scan', label: 'Scan then continue' },
      { value: 'proceed', label: 'Proceed anyway' },
    ],
    score: (a, b, c) => (a ? 0 : 2) + (b ? 0 : 1) + (c === 'cancel' ? 0 : c === 'scan' ? 1 : 2),
  },
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

export default function PcsLessonTry({ lessonId = 'lesson1' }) {
  const lessonNumber = getLessonNumber(lessonId);
  const lessonMeta = useMemo(() => getLessonMeta('pcs', lessonNumber), [lessonNumber]);
  const lesson = useMemo(() => getLesson('pcs', lessonId), [lessonId]);
  const backPath = lesson?.permalink || `/pcs/lesson${lessonNumber}`;
  const scenario = SCENARIOS[lessonNumber] || null;

  const [toggleA, setToggleA] = useState(false);
  const [toggleB, setToggleB] = useState(false);
  const [selectValue, setSelectValue] = useState(scenario ? scenario.options[0].value : 'pending');
  const [backHover, setBackHover] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (canAccessLesson('pcs', lessonNumber)) return;
    window.location.replace(getLastUnlockedLessonPath('pcs') || '/pcs/lesson1');
  }, [lessonNumber]);

  useEffect(() => {
    if (!scenario) {
      setSelectValue('pending');
      return;
    }
    setSelectValue(scenario.options[0].value);
    setToggleA(false);
    setToggleB(false);
  }, [lessonNumber, scenario]);

  const score = scenario ? scenario.score(toggleA, toggleB, selectValue) : 0;
  const risk = getRisk(score);
  const explanation = !scenario
    ? 'Try activity coming soon. This lesson currently has theory content only.'
    : risk === 'Low'
      ? 'Good choices. Your current selections reduce common personal security risks.'
      : risk === 'Medium'
        ? 'Mixed choices. You are partially protected but should tighten key habits.'
        : 'Current choices increase exposure. Improve the highlighted habits to reduce risk.';

  const reset = () => {
    if (scenario) {
      setToggleA(false);
      setToggleB(false);
      setSelectValue(scenario.options[0].value);
    }
  };

  return (
    <Layout title={`Personal Cyber Safety Lesson ${lessonNumber}: ${lessonMeta.title} - Try It Yourself`}>
      <div className="sl-try-page">
        <h1 className="sl-try-title">{`Personal Cyber Safety Lesson ${lessonNumber}: ${lessonMeta.title} - Try It Yourself`}</h1>
        <LandscapeTip />
        <div className="sl-try-layout">
          <div className="sl-try-col">
            <div style={editorShellStyle} className="sl-try-panel sl-try-editor-panel">
              <div style={panelHeaderStyle}>Scenario</div>
              <div style={{ flex: 1, padding: '0.5rem' }}>
                <div style={panelBodyStyle}>
                  {scenario ? (
                    <>
                      <p style={{ marginTop: 0 }}>Select choices and review the resulting safety level.</p>
                      <label style={{ display: 'block', marginBottom: '0.6rem' }}>
                        <input type="checkbox" checked={toggleA} onChange={(e) => setToggleA(e.target.checked)} /> {scenario.labelA}
                      </label>
                      <label style={{ display: 'block', marginBottom: '0.6rem' }}>
                        <input type="checkbox" checked={toggleB} onChange={(e) => setToggleB(e.target.checked)} /> {scenario.labelB}
                      </label>
                      <label htmlFor="pcs-select" style={{ display: 'block', marginBottom: '0.35rem' }}>
                        {scenario.selectLabel}
                      </label>
                      <select id="pcs-select" value={selectValue} onChange={(e) => setSelectValue(e.target.value)} style={inputStyle}>
                        {scenario.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <>
                      <p style={{ marginTop: 0 }}>Try activity coming soon.</p>
                      <p style={{ marginBottom: 0, color: '#9ca3af' }}>
                        This lesson will receive an interactive scenario in the next content phase.
                      </p>
                    </>
                  )}
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
                    {scenario ? (
                      <>
                        Risk Level:{' '}
                        <span style={{ color: getRiskColor(risk), fontWeight: 800 }}>{risk}</span>
                      </>
                    ) : (
                      <>Try activity coming soon</>
                    )}
                  </div>
                  <div style={outputBoxStyle}>{explanation}</div>
                  <p style={{ margin: 0, color: '#9ca3af' }}>
                    This safe simulation is educational only and focuses on personal decision quality.
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

