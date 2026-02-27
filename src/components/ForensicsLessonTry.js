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

export default function ForensicsLessonTry({ lessonId = 'lesson1' }) {
  const lessonNumber = getLessonNumber(lessonId);
  const lessonMeta = useMemo(() => getLessonMeta('forensics', lessonNumber), [lessonNumber]);
  const lesson = useMemo(() => getLesson('forensics', lessonId), [lessonId]);
  const backPath = lesson?.permalink || `/forensics/lesson${lessonNumber}`;
  const [backHover, setBackHover] = useState(false);

  const [caseType, setCaseType] = useState('lost-phone');
  const [chainSteps, setChainSteps] = useState(['Collect', 'Log', 'Seal', 'Transfer']);
  const [dragChainIndex, setDragChainIndex] = useState(null);
  const [logTime, setLogTime] = useState('all');
  const [logUser, setLogUser] = useState('all');
  const [logEvent, setLogEvent] = useState('all');
  const [fileType, setFileType] = useState('photo.jpg');
  const [timelineEvents, setTimelineEvents] = useState(['Password reset', 'Login alert', 'Suspicious login blocked']);
  const [dragTimelineIndex, setDragTimelineIndex] = useState(null);
  const [artifactQuestion, setArtifactQuestion] = useState('visited-site');
  const [artifactChoice, setArtifactChoice] = useState('history');
  const [hashA, setHashA] = useState('invoice_2026_v1');
  const [hashB, setHashB] = useState('invoice_2026_v1');
  const [copyMsg, setCopyMsg] = useState('');
  const [flowStep, setFlowStep] = useState('intake');
  const [claimChoice, setClaimChoice] = useState('login-log');
  const [bestPracticeChoice, setBestPracticeChoice] = useState('preserve-first');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (canAccessLesson('forensics', lessonNumber)) return;
    window.location.replace(getLastUnlockedLessonPath('forensics') || '/forensics/lesson1');
  }, [lessonNumber]);

  const logs = [
    { time: 'morning', user: 'admin', event: 'login', text: '08:05 admin login from office network' },
    { time: 'afternoon', user: 'staff', event: 'file', text: '13:22 staff exported incident report draft' },
    { time: 'night', user: 'admin', event: 'alert', text: '21:10 alert: unusual sign-in blocked' },
  ];

  const filteredLogs = logs.filter((log) => {
    const t = logTime === 'all' || log.time === logTime;
    const u = logUser === 'all' || log.user === logUser;
    const e = logEvent === 'all' || log.event === logEvent;
    return t && u && e;
  });

  const metadataMap = {
    'photo.jpg': 'Type: Image\nCreated: 2026-02-20 14:12\nCamera: Mobile device\nLocation tag: Disabled',
    'report.docx': 'Type: Document\nAuthor: incident-team\nLast modified: 2026-02-21 09:40\nRevision count: 5',
    'archive.zip': 'Type: Compressed archive\nCreated: 2026-02-21 18:05\nContains: 4 files\nIntegrity flag: No errors',
  };

  const simpleHash = (value) => {
    let hash = 0;
    const input = String(value || '');
    for (let i = 0; i < input.length; i += 1) {
      hash = ((hash << 5) - hash) + input.charCodeAt(i);
      hash |= 0;
    }
    return `H-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
  };

  const hashValueA = simpleHash(hashA);
  const hashValueB = simpleHash(hashB);
  const hashMatch = hashValueA === hashValueB;

  const reset = () => {
    setCaseType('lost-phone');
    setChainSteps(['Collect', 'Log', 'Seal', 'Transfer']);
    setDragChainIndex(null);
    setLogTime('all');
    setLogUser('all');
    setLogEvent('all');
    setFileType('photo.jpg');
    setTimelineEvents(['Password reset', 'Login alert', 'Suspicious login blocked']);
    setDragTimelineIndex(null);
    setArtifactQuestion('visited-site');
    setArtifactChoice('history');
    setHashA('invoice_2026_v1');
    setHashB('invoice_2026_v1');
    setCopyMsg('');
    setFlowStep('intake');
    setClaimChoice('login-log');
    setBestPracticeChoice('preserve-first');
  };

  const onDropReorder = (items, setItems, from, to) => {
    if (from === null || from === to) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setItems(next);
  };

  const copyHash = async () => {
    try {
      await navigator.clipboard.writeText(`${hashValueA} | ${hashValueB}`);
      setCopyMsg('Copied');
      setTimeout(() => setCopyMsg(''), 1200);
    } catch {
      setCopyMsg('Copy failed');
    }
  };

  const renderSimulator = () => {
    if (lessonNumber === 1) {
      return (
        <>
          <label htmlFor="case-type">Case type</label>
          <select id="case-type" value={caseType} onChange={(e) => setCaseType(e.target.value)} style={inputStyle}>
            <option value="lost-phone">Lost phone</option>
            <option value="compromised-account">Compromised account</option>
            <option value="insider">Insider misuse concern</option>
          </select>
        </>
      );
    }
    if (lessonNumber === 2) {
      return (
        <>
          <p style={{ marginTop: 0 }}>Chain of Custody Builder (drag to reorder)</p>
          {chainSteps.map((step, i) => (
            <div
              key={step}
              draggable
              onDragStart={() => setDragChainIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                onDropReorder(chainSteps, setChainSteps, dragChainIndex, i);
                setDragChainIndex(null);
              }}
              style={{ ...outputBoxStyle, cursor: 'grab', marginBottom: '0.45rem' }}
            >
              {step}
            </div>
          ))}
        </>
      );
    }
    if (lessonNumber === 3) {
      return (
        <>
          <label htmlFor="log-time">Time</label>
          <select id="log-time" value={logTime} onChange={(e) => setLogTime(e.target.value)} style={inputStyle}>
            <option value="all">All</option><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="night">Night</option>
          </select>
          <label htmlFor="log-user">User</label>
          <select id="log-user" value={logUser} onChange={(e) => setLogUser(e.target.value)} style={inputStyle}>
            <option value="all">All</option><option value="admin">Admin</option><option value="staff">Staff</option>
          </select>
          <label htmlFor="log-event">Event type</label>
          <select id="log-event" value={logEvent} onChange={(e) => setLogEvent(e.target.value)} style={inputStyle}>
            <option value="all">All</option><option value="login">Login</option><option value="file">File</option><option value="alert">Alert</option>
          </select>
        </>
      );
    }
    if (lessonNumber === 4) {
      return (
        <>
          <label htmlFor="file-type">Choose file</label>
          <select id="file-type" value={fileType} onChange={(e) => setFileType(e.target.value)} style={inputStyle}>
            <option value="photo.jpg">photo.jpg</option>
            <option value="report.docx">report.docx</option>
            <option value="archive.zip">archive.zip</option>
          </select>
        </>
      );
    }
    if (lessonNumber === 5) {
      return (
        <>
          <p style={{ marginTop: 0 }}>Timeline Builder (drag to reorder)</p>
          {timelineEvents.map((step, i) => (
            <div
              key={`${step}-${i}`}
              draggable
              onDragStart={() => setDragTimelineIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                onDropReorder(timelineEvents, setTimelineEvents, dragTimelineIndex, i);
                setDragTimelineIndex(null);
              }}
              style={{ ...outputBoxStyle, cursor: 'grab', marginBottom: '0.45rem' }}
            >
              {step}
            </div>
          ))}
        </>
      );
    }
    if (lessonNumber === 6) {
      return (
        <>
          <label htmlFor="artifact-question">Question</label>
          <select id="artifact-question" value={artifactQuestion} onChange={(e) => setArtifactQuestion(e.target.value)} style={inputStyle}>
            <option value="visited-site">Which artifact shows visited sites?</option>
            <option value="login-time">Which artifact helps with login session timing?</option>
            <option value="cached-copy">Which artifact may hold old page copies?</option>
          </select>
          <label htmlFor="artifact-choice">Your choice</label>
          <select id="artifact-choice" value={artifactChoice} onChange={(e) => setArtifactChoice(e.target.value)} style={inputStyle}>
            <option value="history">History</option>
            <option value="cookies">Cookies</option>
            <option value="cache">Cache</option>
          </select>
        </>
      );
    }
    if (lessonNumber === 7) {
      return (
        <>
          <label htmlFor="hash-a">Input A</label>
          <textarea id="hash-a" rows={3} value={hashA} onChange={(e) => setHashA(e.target.value)} style={inputStyle} />
          <label htmlFor="hash-b">Input B</label>
          <textarea id="hash-b" rows={3} value={hashB} onChange={(e) => setHashB(e.target.value)} style={inputStyle} />
        </>
      );
    }
    if (lessonNumber === 8) {
      return (
        <>
          <p style={{ marginTop: 0 }}>Investigation flow</p>
          {['intake', 'preserve', 'analyze', 'report'].map((s) => (
            <button key={s} onClick={() => setFlowStep(s)} style={{ ...buttonBase, marginRight: '0.45rem', marginBottom: '0.45rem', height: '34px' }}>{s}</button>
          ))}
        </>
      );
    }
    if (lessonNumber === 9) {
      return (
        <>
          <label htmlFor="claim-choice">Which evidence best supports “unauthorized account access occurred”?</label>
          <select id="claim-choice" value={claimChoice} onChange={(e) => setClaimChoice(e.target.value)} style={inputStyle}>
            <option value="login-log">Unexpected login log + geo mismatch</option>
            <option value="wallpaper">Changed desktop wallpaper</option>
            <option value="battery">Battery drain report</option>
          </select>
        </>
      );
    }
    return (
      <>
        <label htmlFor="best-practice">Choose the best response</label>
        <select id="best-practice" value={bestPracticeChoice} onChange={(e) => setBestPracticeChoice(e.target.value)} style={inputStyle}>
          <option value="preserve-first">Preserve evidence first, then analyze</option>
          <option value="edit-logs">Edit logs to clean noise before review</option>
          <option value="skip-notes">Skip documentation to save time</option>
        </select>
      </>
    );
  };

  const renderOutput = () => {
    if (lessonNumber === 1) {
      const text = caseType === 'lost-phone'
        ? 'Prioritize device timeline, account login history, and location-related records.'
        : caseType === 'compromised-account'
          ? 'Focus on authentication logs, password reset records, and notification history.'
          : 'Review access logs, file actions, and policy compliance records.';
      return <div style={outputBoxStyle}>{text}</div>;
    }
    if (lessonNumber === 2) {
      const correct = chainSteps.join(' > ') === 'Collect > Log > Seal > Transfer';
      return <div style={outputBoxStyle}>{correct ? 'Correct order preserves traceability from collection to transfer.' : `Current order: ${chainSteps.join(' > ')}\nTip: Collect, then log, seal, and transfer.`}</div>;
    }
    if (lessonNumber === 3) {
      return <div style={outputBoxStyle}>{filteredLogs.length ? filteredLogs.map((l) => l.text).join('\n') : 'No entries match current filters.'}</div>;
    }
    if (lessonNumber === 4) {
      return <div style={outputBoxStyle}>{metadataMap[fileType]}</div>;
    }
    if (lessonNumber === 5) {
      const correct = timelineEvents.join(' > ') === 'Login alert > Suspicious login blocked > Password reset';
      return <div style={outputBoxStyle}>{correct ? 'Timeline sequence is plausible and supports event reconstruction.' : `Current timeline: ${timelineEvents.join(' > ')}\nAdjust order to reflect event flow.`}</div>;
    }
    if (lessonNumber === 6) {
      const answerMap = {
        'visited-site': 'history',
        'login-time': 'cookies',
        'cached-copy': 'cache',
      };
      const correct = answerMap[artifactQuestion] === artifactChoice;
      return <div style={outputBoxStyle}>{correct ? 'Correct. This artifact best matches the question.' : 'Not ideal. Choose the artifact that most directly answers the question.'}</div>;
    }
    if (lessonNumber === 7) {
      return (
        <>
          <div style={outputBoxStyle}>{`Hash A: ${hashValueA}\nHash B: ${hashValueB}\nResult: ${hashMatch ? 'Same' : 'Different'}`}</div>
          <button onClick={copyHash} style={{ ...buttonBase, height: '34px' }}>Copy Hash Result</button>
          {copyMsg ? <span style={{ marginLeft: '0.5rem' }}>{copyMsg}</span> : null}
        </>
      );
    }
    if (lessonNumber === 8) {
      const msg = {
        intake: 'Intake clarifies scope, stakeholders, and initial evidence sources.',
        preserve: 'Preservation protects evidence integrity before deep analysis.',
        analyze: 'Analysis correlates logs, metadata, and timelines to answer questions.',
        report: 'Reporting documents findings, limitations, and recommended actions.',
      };
      return <div style={outputBoxStyle}>{msg[flowStep]}</div>;
    }
    if (lessonNumber === 9) {
      return <div style={outputBoxStyle}>{claimChoice === 'login-log' ? 'Correct. Authentication logs with geo anomalies provide strong support.' : 'Weak support. Select evidence directly linked to account access events.'}</div>;
    }
    return <div style={outputBoxStyle}>{bestPracticeChoice === 'preserve-first' ? 'Correct. Preserve first, then analyze and document carefully.' : 'Incorrect. Avoid modifying evidence or skipping documentation.'}</div>;
  };

  return (
    <Layout title={`Digital Forensics Lesson ${lessonNumber}: ${lessonMeta.title} - Try It Yourself`}>
      <div style={{ padding: '2rem' }}>
        <h1>{`Digital Forensics Lesson ${lessonNumber}: ${lessonMeta.title} - Try It Yourself`}</h1>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
          <div style={{ flex: 1 }}>
            <div style={editorShellStyle}>
              <div style={panelHeaderStyle}>Simulator</div>
              <div style={{ flex: 1, padding: '0.5rem' }}>
                <div style={panelBodyStyle}>{renderSimulator()}</div>
              </div>
              <div style={editorFooterStyle}>
                <button onClick={reset} style={buttonBase}>Reset</button>
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
              <div style={panelHeaderStyle}>Output / Findings / Explanation</div>
              <div style={{ flex: 1, padding: '0.5rem' }}>
                <div style={panelBodyStyle}>
                  {renderOutput()}
                  <p style={{ margin: 0, color: '#9ca3af' }}>
                    Safety note: This simulator is educational and defensive. It does not perform hacking or offensive actions.
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


