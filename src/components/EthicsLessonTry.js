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

const ETHICS_SCENARIOS = {
  1: {
    title: 'Is this ethical?',
    prompt: 'A student scans a school portal without permission to "learn faster."',
    options: ['OK', 'Not OK', 'Depends'],
    feedback: {
      OK: 'Not correct. Permission is required before any security testing.',
      'Not OK': 'Correct. Ethics starts with permission and harm prevention.',
      Depends: 'Partly. Context matters, but without authorization this is not acceptable.',
    },
  },
  2: {
    title: 'Legal or illegal?',
    prompt: 'Testing a company system that did not invite you to test.',
    options: ['Legal', 'Illegal', 'Unsure'],
    feedback: {
      Legal: 'Incorrect. Unauthorized testing can violate laws and policy.',
      Illegal: 'Correct. No authorization means no legal basis to test.',
      Unsure: 'Good caution. Default to no testing until explicit permission exists.',
    },
  },
  3: {
    title: 'Scope checker',
    prompt: 'You are approved to test app.example.com only.',
    options: ['Test any related domain', 'Only test app.example.com', 'Test employee accounts'],
    feedback: {
      'Test any related domain': 'Out of scope. Similar domains are not automatically authorized.',
      'Only test app.example.com': 'Correct. Scope boundaries are the #1 rule in testing.',
      'Test employee accounts': 'Not allowed. Personal accounts are not implied in scope.',
    },
  },
  4: {
    title: 'Disclosure flow',
    prompt: 'You found a vulnerability in a permitted test.',
    options: ['Post publicly first', 'Report privately then coordinate disclosure', 'Sell details privately'],
    feedback: {
      'Post publicly first': 'Not responsible. Public exposure before coordination can cause harm.',
      'Report privately then coordinate disclosure': 'Correct. Private reporting and coordination is responsible practice.',
      'Sell details privately': 'Unethical and risky. Responsible disclosure prioritizes safety and remediation.',
    },
  },
};

function getLessonNumber(lessonId) {
  const m = String(lessonId || '').match(/(\d+)/);
  return m ? Number(m[1]) : NaN;
}

export default function EthicsLessonTry({ lessonId = 'lesson1' }) {
  const lessonNumber = getLessonNumber(lessonId);
  const lessonMeta = useMemo(() => getLessonMeta('ethics', lessonNumber), [lessonNumber]);
  const lesson = useMemo(() => getLesson('ethics', lessonId), [lessonId]);
  const backPath = lesson?.permalink || `/ethics/lesson${lessonNumber}`;
  const scenario = ETHICS_SCENARIOS[lessonNumber] || null;

  const [choice, setChoice] = useState(scenario ? scenario.options[0] : 'pending');
  const [backHover, setBackHover] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (canAccessLesson('ethics', lessonNumber)) return;
    window.location.replace(getLastUnlockedLessonPath('ethics') || '/ethics/lesson1');
  }, [lessonNumber]);

  useEffect(() => {
    setChoice(scenario ? scenario.options[0] : 'pending');
  }, [lessonNumber, scenario]);

  const result = scenario
    ? scenario.feedback[choice]
    : 'Try activity coming soon. This lesson currently has theory-only content.';

  return (
    <Layout title={`Security Ethics Lesson ${lessonNumber}: ${lessonMeta.title} - Try It Yourself`}>
      <div style={{ padding: '2rem' }}>
        <h1>{`Security Ethics Lesson ${lessonNumber}: ${lessonMeta.title} - Try It Yourself`}</h1>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
          <div style={{ flex: 1 }}>
            <div style={editorShellStyle}>
              <div style={panelHeaderStyle}>Scenario</div>
              <div style={{ flex: 1, padding: '0.5rem' }}>
                <div style={panelBodyStyle}>
                  {scenario ? (
                    <>
                      <p style={{ marginTop: 0, marginBottom: '0.5rem', fontWeight: 700 }}>{scenario.title}</p>
                      <p style={{ marginTop: 0 }}>{scenario.prompt}</p>
                      <label htmlFor="ethics-choice" style={{ display: 'block', marginBottom: '0.35rem' }}>
                        Your decision
                      </label>
                      <select id="ethics-choice" value={choice} onChange={(e) => setChoice(e.target.value)} style={inputStyle}>
                        {scenario.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <>
                      <p style={{ marginTop: 0 }}>Try activity coming soon.</p>
                      <p style={{ marginBottom: 0, color: '#9ca3af' }}>
                        This lesson will receive an interactive ethics scenario in the next content phase.
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div style={editorFooterStyle}>
                <button onClick={() => setChoice(scenario ? scenario.options[0] : 'pending')} style={buttonBase}>Reset</button>
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
          <div style={{ flex: 1 }}>
            <div style={outputPanelStyle}>
              <div style={panelHeaderStyle}>Outcome</div>
              <div style={{ flex: 1, padding: '0.5rem' }}>
                <div style={panelBodyStyle}>
                  <div style={outputBoxStyle}>{result}</div>
                  <p style={{ margin: 0, color: '#9ca3af' }}>
                    This simulation is educational and focuses on legal, ethical, and responsible decision-making.
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
