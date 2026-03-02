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

function getStatus(score) {
  if (score <= 1) return 'Stable';
  if (score <= 3) return 'Needs Review';
  return 'At Risk';
}

function getStatusColor(level) {
  if (level === 'Stable') return 'var(--ifm-color-success)';
  if (level === 'Needs Review') return '#fbbf24';
  return 'var(--ifm-color-danger)';
}

export default function NetworkBasicsLessonTry({ lessonId = 'lesson1' }) {
  const lessonNumber = getLessonNumber(lessonId);
  const lessonMeta = useMemo(() => getLessonMeta('networkbasics', lessonNumber), [lessonNumber]);
  const lesson = useMemo(() => getLesson('networkbasics', lessonId), [lessonId]);
  const backPath = lesson?.permalink || `/network-basics/lesson${lessonNumber}`;

  const [connectionType, setConnectionType] = useState('wired');
  const [securityLevel, setSecurityLevel] = useState('high');
  const [dnsCheck, setDnsCheck] = useState(true);
  const [backHover, setBackHover] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (canAccessLesson('networkbasics', lessonNumber)) return;
    window.location.replace(getLastUnlockedLessonPath('networkbasics') || '/network-basics/lesson1');
  }, [lessonNumber]);

  const score =
    (connectionType === 'wired' ? 0 : 1)
    + (securityLevel === 'high' ? 0 : securityLevel === 'medium' ? 1 : 2)
    + (dnsCheck ? 0 : 2);

  const status = getStatus(score);
  const explanation = status === 'Stable'
    ? 'Current placeholder settings indicate a stable and safer baseline for this networking scenario.'
    : status === 'Needs Review'
      ? 'Current placeholder settings are acceptable, but a few choices should be improved.'
      : 'Current placeholder settings indicate higher risk. Improve connection and validation choices.';

  const reset = () => {
    setConnectionType('wired');
    setSecurityLevel('high');
    setDnsCheck(true);
  };

  return (
    <Layout title={`Network Basics Lesson ${lessonNumber}: ${lessonMeta.title} - Try It Yourself`}>
      <div className="sl-try-page">
        <h1 className="sl-try-title">{`Network Basics Lesson ${lessonNumber}: ${lessonMeta.title} - Try It Yourself`}</h1>
        <div className="sl-try-layout">
          <div className="sl-try-col">
            <div style={editorShellStyle} className="sl-try-panel sl-try-editor-panel">
              <div style={panelHeaderStyle}>Inputs</div>
              <div style={{ flex: 1, padding: '0.5rem' }}>
                <div style={panelBodyStyle}>
                  <p style={{ marginTop: 0 }}>Interactive Demo Placeholder</p>

                  <label htmlFor="connection-type" style={{ display: 'block', marginBottom: '0.35rem' }}>
                    Connection Type
                  </label>
                  <select id="connection-type" value={connectionType} onChange={(e) => setConnectionType(e.target.value)} style={inputStyle}>
                    <option value="wired">Wired</option>
                    <option value="wifi">WiFi</option>
                  </select>

                  <label htmlFor="security-level" style={{ display: 'block', marginBottom: '0.35rem' }}>
                    Security Level
                  </label>
                  <select id="security-level" value={securityLevel} onChange={(e) => setSecurityLevel(e.target.value)} style={inputStyle}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>

                  <label style={{ display: 'block', marginBottom: '0.6rem' }}>
                    <input type="checkbox" checked={dnsCheck} onChange={(e) => setDnsCheck(e.target.checked)} /> Enable DNS Check
                  </label>
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
              <div style={panelHeaderStyle}>Status</div>
              <div style={{ flex: 1, padding: '0.5rem' }}>
                <div style={panelBodyStyle}>
                  <div style={outputBoxStyle}>
                    Status:{' '}
                    <span style={{ color: getStatusColor(status), fontWeight: 800 }}>{status}</span>
                  </div>
                  <div style={outputBoxStyle}>{explanation}</div>
                  <p style={{ margin: 0, color: '#9ca3af' }}>
                    This is a placeholder interactive model for lesson {lessonNumber}. Full networking scenarios will be added in the content phase.
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

