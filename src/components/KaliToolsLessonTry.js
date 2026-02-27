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

const boxStyle = {
  background: '#0b1220',
  color: '#e5e7eb',
  border: '1px solid #2a2f36',
  borderRadius: '8px',
  padding: '0.75rem',
  marginBottom: '0.65rem',
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

const terminalOutputs = {
  pwd: '/home/student/lab',
  ls: 'notes.txt\nsafe-labs/\nreports/',
  cd: 'Changed directory to safe-labs/',
};

const toolMap = {
  recon: 'Recon tools help map systems and assets in authorized environments.',
  web: 'Web inspection tools help understand request/response behavior safely.',
  traffic: 'Traffic analysis tools help visualize protocol flow and packet metadata.',
};

const scannerSim = {
  website: { open: [80, 443], closed: [22, 3306] },
  server: { open: [22, 80, 443], closed: [3389] },
  router: { open: [53, 80], closed: [22, 445] },
};

function getLessonNumber(lessonId) {
  const m = String(lessonId || '').match(/(\d+)/);
  return m ? Number(m[1]) : NaN;
}

export default function KaliToolsLessonTry({ lessonId = 'lesson1' }) {
  const lessonNumber = getLessonNumber(lessonId);
  const lessonMeta = useMemo(() => getLessonMeta('kalitools', lessonNumber), [lessonNumber]);
  const lesson = useMemo(() => getLesson('kalitools', lessonId), [lessonId]);
  const backPath = lesson?.permalink || `/kali/lesson${lessonNumber}`;

  const [backHover, setBackHover] = useState(false);

  const [toolCategory, setToolCategory] = useState('recon');
  const [terminalCommand, setTerminalCommand] = useState('pwd');
  const [targetType, setTargetType] = useState('website');
  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('/profile');
  const [packetIndex, setPacketIndex] = useState(0);
  const [passwordLength, setPasswordLength] = useState(8);
  const [uniquePassword, setUniquePassword] = useState(false);
  const [workflowStep, setWorkflowStep] = useState('discover');
  const [awarenessChoice, setAwarenessChoice] = useState('domain-records');
  const [workflowOrder, setWorkflowOrder] = useState(['discover', 'inspect', 'analyze', 'report']);
  const [dragIndex, setDragIndex] = useState(null);
  const [ethicsChoice, setEthicsChoice] = useState('ask-permission');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (canAccessLesson('kalitools', lessonNumber)) return;
    window.location.replace(getLastUnlockedLessonPath('kalitools') || '/kali/lesson1');
  }, [lessonNumber]);

  const packets = [
    { src: '10.0.0.5', dst: '8.8.8.8', protocol: 'DNS', info: 'DNS query for safelab.local' },
    { src: '10.0.0.5', dst: '151.101.1.69', protocol: 'HTTPS', info: 'Encrypted web session established' },
    { src: '10.0.0.5', dst: '192.168.1.1', protocol: 'ARP', info: 'Local network address resolution' },
  ];

  const selectedPacket = packets[packetIndex];

  const guessTime = passwordLength >= 14 && uniquePassword
    ? 'Very high resistance (years in conceptual model)'
    : passwordLength >= 10
      ? 'Moderate resistance (months in conceptual model)'
      : 'Low resistance (hours/days in conceptual model)';

  const reset = () => {
    setToolCategory('recon');
    setTerminalCommand('pwd');
    setTargetType('website');
    setMethod('GET');
    setPath('/profile');
    setPacketIndex(0);
    setPasswordLength(8);
    setUniquePassword(false);
    setWorkflowStep('discover');
    setAwarenessChoice('domain-records');
    setWorkflowOrder(['discover', 'inspect', 'analyze', 'report']);
    setDragIndex(null);
    setEthicsChoice('ask-permission');
  };

  const onDropStep = (dropIndex) => {
    if (dragIndex === null || dragIndex === dropIndex) return;
    const next = [...workflowOrder];
    const [item] = next.splice(dragIndex, 1);
    next.splice(dropIndex, 0, item);
    setWorkflowOrder(next);
    setDragIndex(null);
  };

  const renderSimulator = () => {
    if (lessonNumber === 1) {
      return (
        <>
          <p style={{ marginTop: 0 }}>Tool Map (concept-only)</p>
          {Object.keys(toolMap).map((k) => (
            <button key={k} onClick={() => setToolCategory(k)} style={{ ...buttonBase, marginRight: '0.5rem', marginBottom: '0.5rem', height: '34px' }}>{k}</button>
          ))}
        </>
      );
    }
    if (lessonNumber === 2) {
      return (
        <>
          <p style={{ marginTop: 0 }}>Simulated terminal (no real execution)</p>
          {['pwd', 'ls', 'cd'].map((cmd) => (
            <button key={cmd} onClick={() => setTerminalCommand(cmd)} style={{ ...buttonBase, marginRight: '0.5rem', marginBottom: '0.5rem', height: '34px' }}>{cmd}</button>
          ))}
        </>
      );
    }
    if (lessonNumber === 3) {
      return (
        <>
          <label htmlFor="target-type">Target type (simulated)</label>
          <select id="target-type" value={targetType} onChange={(e) => setTargetType(e.target.value)} style={inputStyle}>
            <option value="website">Website</option>
            <option value="server">Server</option>
            <option value="router">Router</option>
          </select>
        </>
      );
    }
    if (lessonNumber === 4) {
      return (
        <>
          <label htmlFor="http-method">Method</label>
          <select id="http-method" value={method} onChange={(e) => setMethod(e.target.value)} style={inputStyle}>
            <option>GET</option><option>POST</option><option>PUT</option>
          </select>
          <label htmlFor="http-path">Path</label>
          <select id="http-path" value={path} onChange={(e) => setPath(e.target.value)} style={inputStyle}>
            <option value="/profile">/profile</option>
            <option value="/settings">/settings</option>
            <option value="/api/status">/api/status</option>
          </select>
        </>
      );
    }
    if (lessonNumber === 5) {
      return (
        <>
          <p style={{ marginTop: 0 }}>Packet Viewer</p>
          {packets.map((p, i) => (
            <button key={`${p.protocol}-${i}`} onClick={() => setPacketIndex(i)} style={{ ...buttonBase, marginBottom: '0.45rem', width: '100%', justifyContent: 'flex-start' }}>
              {`${i + 1}. ${p.protocol} ${p.src} -> ${p.dst}`}
            </button>
          ))}
        </>
      );
    }
    if (lessonNumber === 6) {
      return (
        <>
          <label htmlFor="pwd-len">Password length: {passwordLength}</label>
          <input id="pwd-len" type="range" min="6" max="20" value={passwordLength} onChange={(e) => setPasswordLength(Number(e.target.value))} style={inputStyle} />
          <label style={{ display: 'block' }}><input type="checkbox" checked={uniquePassword} onChange={(e) => setUniquePassword(e.target.checked)} /> Unique password per account</label>
        </>
      );
    }
    if (lessonNumber === 7) {
      return (
        <>
          <p style={{ marginTop: 0 }}>Workflow Diagram</p>
          {['discover', 'inspect', 'assess', 'report'].map((s) => (
            <button key={s} onClick={() => setWorkflowStep(s)} style={{ ...buttonBase, marginRight: '0.5rem', marginBottom: '0.5rem', height: '34px' }}>{s}</button>
          ))}
        </>
      );
    }
    if (lessonNumber === 8) {
      return (
        <>
          <label htmlFor="awareness">Choose public info example</label>
          <select id="awareness" value={awarenessChoice} onChange={(e) => setAwarenessChoice(e.target.value)} style={inputStyle}>
            <option value="domain-records">Domain registration records</option>
            <option value="social-profile">Public social profile bio</option>
            <option value="private-message">Private direct messages</option>
          </select>
        </>
      );
    }
    if (lessonNumber === 9) {
      return (
        <>
          <p style={{ marginTop: 0 }}>Drag-and-drop workflow order</p>
          {workflowOrder.map((step, index) => (
            <div
              key={step}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDropStep(index)}
              style={{ ...boxStyle, cursor: 'grab', marginBottom: '0.45rem' }}
            >
              {step}
            </div>
          ))}
        </>
      );
    }
    return (
      <>
        <p style={{ marginTop: 0 }}>Ethics scenario</p>
        <label><input type="radio" name="ethics-choice" checked={ethicsChoice === 'ask-permission'} onChange={() => setEthicsChoice('ask-permission')} /> Ask permission first</label><br />
        <label><input type="radio" name="ethics-choice" checked={ethicsChoice === 'test-first'} onChange={() => setEthicsChoice('test-first')} /> Test first, ask later</label><br />
        <label><input type="radio" name="ethics-choice" checked={ethicsChoice === 'share-findings'} onChange={() => setEthicsChoice('share-findings')} /> Share findings publicly before notifying owner</label>
      </>
    );
  };

  const renderOutput = () => {
    if (lessonNumber === 1) {
      return <div style={boxStyle}>{toolMap[toolCategory]}</div>;
    }
    if (lessonNumber === 2) {
      return <div style={boxStyle}><strong>{terminalCommand}</strong>{`\n`}{terminalOutputs[terminalCommand]}</div>;
    }
    if (lessonNumber === 3) {
      const p = scannerSim[targetType];
      return <div style={boxStyle}>{`Open ports (simulated): ${p.open.join(', ')}\nClosed ports (simulated): ${p.closed.join(', ')}\nThis is conceptual only and does not scan real systems.`}</div>;
    }
    if (lessonNumber === 4) {
      return (
        <>
          <div style={boxStyle}>{`${method} ${path} HTTP/1.1\nHost: demo.local\nUser-Agent: Safe-Lab-Simulator`}</div>
          <div style={boxStyle}>{`HTTP/1.1 200 OK\nContent-Type: application/json\n{ "status": "simulated response" }`}</div>
        </>
      );
    }
    if (lessonNumber === 5) {
      return <div style={boxStyle}>{`Source: ${selectedPacket.src}\nDestination: ${selectedPacket.dst}\nProtocol: ${selectedPacket.protocol}\nInfo: ${selectedPacket.info}`}</div>;
    }
    if (lessonNumber === 6) {
      return <div style={boxStyle}>{`Estimated guess-time resistance (conceptual): ${guessTime}`}</div>;
    }
    if (lessonNumber === 7) {
      return <div style={boxStyle}>{`Current step: ${workflowStep}\nEthics note: Framework knowledge must stay inside authorized labs and reporting workflows.`}</div>;
    }
    if (lessonNumber === 8) {
      const msg = awarenessChoice === 'private-message'
        ? 'Private messages are not public OSINT sources. Respect privacy and consent boundaries.'
        : 'This can be public information. Use it for awareness and defensive privacy improvements only.';
      return <div style={boxStyle}>{msg}</div>;
    }
    if (lessonNumber === 9) {
      const correct = workflowOrder.join(' > ') === 'discover > inspect > analyze > report';
      return <div style={boxStyle}>{correct ? 'Correct order. This supports a safe, defensible workflow.' : `Current order: ${workflowOrder.join(' > ')}\nTip: Start with discovery, then inspect, analyze, and report.`}</div>;
    }
    const ethicsMsg = ethicsChoice === 'ask-permission'
      ? 'Correct. Authorization and consent must come before any testing activity.'
      : 'Not correct. Ethical practice requires permission first and responsible communication.';
    return <div style={boxStyle}>{ethicsMsg}</div>;
  };

  return (
    <Layout title={`Kali Tools Lesson ${lessonNumber}: ${lessonMeta.title} - Try It Yourself`}>
      <div style={{ padding: '2rem' }}>
        <h1>{`Kali Tools Lesson ${lessonNumber}: ${lessonMeta.title} - Try It Yourself`}</h1>
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
              <div style={panelHeaderStyle}>Output/Explanation</div>
              <div style={{ flex: 1, padding: '0.5rem' }}>
                <div style={panelBodyStyle}>
                  {renderOutput()}
                  <p style={{ margin: 0, color: '#9ca3af' }}>
                    Safety note: This page is simulation-only and does not perform real scanning, testing, or exploitation.
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
