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

export default function BlueTeamLessonTry({ lessonId = 'lesson1' }) {
  const lessonNumber = getLessonNumber(lessonId);
  const lessonMeta = useMemo(() => getLessonMeta('blueteam', lessonNumber), [lessonNumber]);
  const lesson = useMemo(() => getLesson('blueteam', lessonId), [lessonId]);
  const backPath = lesson?.permalink || `/blueteam/lesson${lessonNumber}`;
  const [backHover, setBackHover] = useState(false);

  const [activeLayer, setActiveLayer] = useState('prevent');
  const [scenario, setScenario] = useState('phishing-email');
  const [pickedControls, setPickedControls] = useState(['mfa']);
  const [loginFailures, setLoginFailures] = useState(false);
  const [newDevice, setNewDevice] = useState(false);
  const [impossibleTravel, setImpossibleTravel] = useState(false);
  const [hourFilter, setHourFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [alertChoice, setAlertChoice] = useState({ a1: 'medium', a2: 'low', a3: 'high' });
  const [signalChoice, setSignalChoice] = useState('confirm-login-log');
  const [irStep, setIrStep] = useState('prepare');
  const [hardeningItems, setHardeningItems] = useState(['updates']);
  const [backupPlan, setBackupPlan] = useState('weekly-local');
  const [rootCause, setRootCause] = useState('shared-password');
  const [actionChoice, setActionChoice] = useState(['rotate-secrets']);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (canAccessLesson('blueteam', lessonNumber)) return;
    window.location.replace(getLastUnlockedLessonPath('blueteam') || '/blueteam/lesson1');
  }, [lessonNumber]);

  const logs = [
    { hour: 'morning', source: 'auth', text: '08:12 auth failed login x4 for user analyst' },
    { hour: 'afternoon', source: 'endpoint', text: '14:50 endpoint new process spawned by updater' },
    { hour: 'night', source: 'vpn', text: '22:04 vpn login from new device approved' },
  ];

  const filteredLogs = logs.filter((log) => (hourFilter === 'all' || log.hour === hourFilter) && (sourceFilter === 'all' || log.source === sourceFilter));

  const toggleInList = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const reset = () => {
    setActiveLayer('prevent');
    setScenario('phishing-email');
    setPickedControls(['mfa']);
    setLoginFailures(false);
    setNewDevice(false);
    setImpossibleTravel(false);
    setHourFilter('all');
    setSourceFilter('all');
    setAlertChoice({ a1: 'medium', a2: 'low', a3: 'high' });
    setSignalChoice('confirm-login-log');
    setIrStep('prepare');
    setHardeningItems(['updates']);
    setBackupPlan('weekly-local');
    setRootCause('shared-password');
    setActionChoice(['rotate-secrets']);
  };

  const renderSimulator = () => {
    if (lessonNumber === 1) {
      return (
        <>
          <p style={{ marginTop: 0 }}>Defense Layers Map</p>
          {[
            { id: 'prevent', label: 'Prevent' },
            { id: 'detect', label: 'Detect' },
            { id: 'respond', label: 'Respond' },
          ].map((layer) => (
            <button key={layer.id} onClick={() => setActiveLayer(layer.id)} style={{ ...buttonBase, marginRight: '0.45rem', marginBottom: '0.45rem', height: '34px' }}>{layer.label}</button>
          ))}
        </>
      );
    }

    if (lessonNumber === 2) {
      return (
        <>
          <label htmlFor="scenario">Scenario</label>
          <select id="scenario" value={scenario} onChange={(e) => setScenario(e.target.value)} style={inputStyle}>
            <option value="phishing-email">Suspicious email campaign</option>
            <option value="stolen-laptop">Stolen staff laptop</option>
            <option value="credential-reuse">Credential reuse warning</option>
          </select>
          <p style={{ marginTop: 0 }}>Select controls</p>
          {[
            ['mfa', 'Multi-Factor Authentication'],
            ['endpoint', 'Endpoint protection'],
            ['email-filter', 'Email filtering'],
            ['backups', 'Backups'],
          ].map(([id, label]) => (
            <button key={id} onClick={() => toggleInList(id, pickedControls, setPickedControls)} style={{ ...buttonBase, marginRight: '0.45rem', marginBottom: '0.45rem', height: '34px', opacity: pickedControls.includes(id) ? 1 : 0.7 }}>
              {label}
            </button>
          ))}
        </>
      );
    }

    if (lessonNumber === 3) {
      return (
        <>
          <p style={{ marginTop: 0 }}>Signals Dashboard</p>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}><input type="checkbox" checked={loginFailures} onChange={(e) => setLoginFailures(e.target.checked)} /> Repeated login failures</label>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}><input type="checkbox" checked={newDevice} onChange={(e) => setNewDevice(e.target.checked)} /> New device login</label>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}><input type="checkbox" checked={impossibleTravel} onChange={(e) => setImpossibleTravel(e.target.checked)} /> Impossible travel alert</label>
        </>
      );
    }

    if (lessonNumber === 4) {
      return (
        <>
          <label htmlFor="hour">Time</label>
          <select id="hour" value={hourFilter} onChange={(e) => setHourFilter(e.target.value)} style={inputStyle}>
            <option value="all">All</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="night">Night</option>
          </select>
          <label htmlFor="source">Source</label>
          <select id="source" value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} style={inputStyle}>
            <option value="all">All</option>
            <option value="auth">Authentication</option>
            <option value="endpoint">Endpoint</option>
            <option value="vpn">VPN</option>
          </select>
        </>
      );
    }

    if (lessonNumber === 5) {
      const setAlert = (key, value) => setAlertChoice({ ...alertChoice, [key]: value });
      return (
        <>
          <p style={{ marginTop: 0 }}>Triage Inbox</p>
          <label htmlFor="a1">Alert: 12 failed logins in 2 minutes</label>
          <select id="a1" value={alertChoice.a1} onChange={(e) => setAlert('a1', e.target.value)} style={inputStyle}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
          <label htmlFor="a2">Alert: New browser version detected</label>
          <select id="a2" value={alertChoice.a2} onChange={(e) => setAlert('a2', e.target.value)} style={inputStyle}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
          <label htmlFor="a3">Alert: Admin login from unknown region</label>
          <select id="a3" value={alertChoice.a3} onChange={(e) => setAlert('a3', e.target.value)} style={inputStyle}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
        </>
      );
    }

    if (lessonNumber === 6) {
      return (
        <>
          <label htmlFor="signal">Choose strongest confirming evidence</label>
          <select id="signal" value={signalChoice} onChange={(e) => setSignalChoice(e.target.value)} style={inputStyle}>
            <option value="confirm-login-log">Correlated login logs and device fingerprint</option>
            <option value="single-pop">Single popup from one endpoint</option>
            <option value="rumor">Unverified team message</option>
          </select>
        </>
      );
    }

    if (lessonNumber === 7) {
      return (
        <>
          <p style={{ marginTop: 0 }}>Incident Response Flow</p>
          {['prepare', 'detect', 'contain', 'recover', 'learn'].map((step) => (
            <button key={step} onClick={() => setIrStep(step)} style={{ ...buttonBase, marginRight: '0.45rem', marginBottom: '0.45rem', height: '34px' }}>{step}</button>
          ))}
        </>
      );
    }

    if (lessonNumber === 8) {
      return (
        <>
          <p style={{ marginTop: 0 }}>Hardening Checklist</p>
          {[
            ['updates', 'Automatic updates enabled'],
            ['least-priv', 'Least privilege for admin accounts'],
            ['mfa-admin', 'Multi-Factor Authentication for admin logins'],
            ['unused-off', 'Disable unused accounts and services'],
          ].map(([id, label]) => (
            <label key={id} style={{ display: 'block', marginBottom: '0.5rem' }}>
              <input type="checkbox" checked={hardeningItems.includes(id)} onChange={() => toggleInList(id, hardeningItems, setHardeningItems)} /> {label}
            </label>
          ))}
        </>
      );
    }

    if (lessonNumber === 9) {
      return (
        <>
          <label htmlFor="backup">Backup strategy</label>
          <select id="backup" value={backupPlan} onChange={(e) => setBackupPlan(e.target.value)} style={inputStyle}>
            <option value="weekly-local">Weekly local backup only</option>
            <option value="daily-offline">Daily backup with offline copy</option>
            <option value="none">No backups configured</option>
          </select>
        </>
      );
    }

    return (
      <>
        <label htmlFor="root-cause">Select likely root cause</label>
        <select id="root-cause" value={rootCause} onChange={(e) => setRootCause(e.target.value)} style={inputStyle}>
          <option value="shared-password">Shared password across services</option>
          <option value="missing-review">No alert review process</option>
          <option value="unknown">Unknown, no evidence documented</option>
        </select>
        <p style={{ marginTop: 0 }}>Choose follow-up actions</p>
        {[
          ['rotate-secrets', 'Rotate credentials and keys'],
          ['write-runbook', 'Document and update runbook'],
          ['ignore', 'Close without changes'],
        ].map(([id, label]) => (
          <label key={id} style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input type="checkbox" checked={actionChoice.includes(id)} onChange={() => toggleInList(id, actionChoice, setActionChoice)} /> {label}
          </label>
        ))}
      </>
    );
  };

  const renderOutput = () => {
    if (lessonNumber === 1) {
      const text = activeLayer === 'prevent'
        ? 'Prevent layer example: strong authentication, patching, and endpoint controls reduce likely incidents.'
        : activeLayer === 'detect'
          ? 'Detect layer example: logs and alerts reveal unusual behavior quickly.'
          : 'Respond layer example: triage, containment, and recovery reduce impact after detection.';
      return <div style={outputBoxStyle}>{text}</div>;
    }

    if (lessonNumber === 2) {
      const requiredByScenario = {
        'phishing-email': ['email-filter', 'mfa'],
        'stolen-laptop': ['endpoint', 'mfa'],
        'credential-reuse': ['mfa', 'least-priv'],
      };
      const needed = requiredByScenario[scenario] || ['mfa'];
      const covered = needed.filter((c) => pickedControls.includes(c)).length;
      const gaps = needed.length - covered;
      return <div style={outputBoxStyle}>{`Coverage: ${covered}/${needed.length}\nGaps: ${gaps}\nTip: Layer controls so one failure does not expose everything.`}</div>;
    }

    if (lessonNumber === 3) {
      let risk = 0;
      if (loginFailures) risk += 2;
      if (newDevice) risk += 2;
      if (impossibleTravel) risk += 3;
      const label = risk >= 5 ? 'High' : risk >= 3 ? 'Medium' : 'Low';
      return <div style={outputBoxStyle}>{`Risk score: ${risk}\nRisk level: ${label}\nCombine multiple signals before escalation.`}</div>;
    }

    if (lessonNumber === 4) {
      const body = filteredLogs.length
        ? filteredLogs.map((log) => log.text).join('\n')
        : 'No log entries match these filters.';
      return <div style={outputBoxStyle}>{body}</div>;
    }

    if (lessonNumber === 5) {
      let score = 0;
      if (alertChoice.a1 === 'high') score += 1;
      if (alertChoice.a2 === 'low') score += 1;
      if (alertChoice.a3 === 'high') score += 1;
      return <div style={outputBoxStyle}>{`Triage quality: ${score}/3\nUse severity + context to prioritize response effort.`}</div>;
    }

    if (lessonNumber === 6) {
      const ok = signalChoice === 'confirm-login-log';
      return <div style={outputBoxStyle}>{ok ? 'Good decision. Correlated technical evidence reduces false positives.' : 'Weak evidence. Confirm with logs and context before escalating.'}</div>;
    }

    if (lessonNumber === 7) {
      const info = {
        prepare: 'Prepare: define roles, playbooks, and communication channels before incidents happen.',
        detect: 'Detect: identify suspicious activity quickly and validate what happened.',
        contain: 'Contain: limit spread and protect critical systems.',
        recover: 'Recover: restore normal operations safely and verify system health.',
        learn: 'Learn: document root causes and improve controls to prevent recurrence.',
      };
      return <div style={outputBoxStyle}>{info[irStep]}</div>;
    }

    if (lessonNumber === 8) {
      const total = 4;
      const done = hardeningItems.length;
      const risk = done >= 3 ? 'Low' : done >= 2 ? 'Medium' : 'High';
      return <div style={outputBoxStyle}>{`Checklist complete: ${done}/${total}\nResidual risk: ${risk}\nLeast privilege and patching are core baseline controls.`}</div>;
    }

    if (lessonNumber === 9) {
      const msg = backupPlan === 'daily-offline'
        ? 'Recovery readiness: High. Offline copies reduce ransomware impact.'
        : backupPlan === 'weekly-local'
          ? 'Recovery readiness: Medium. Increase frequency and keep an offline copy.'
          : 'Recovery readiness: High risk. Add regular verified backups immediately.';
      return <div style={outputBoxStyle}>{msg}</div>;
    }

    const quality = (rootCause !== 'unknown' ? 1 : 0) + (actionChoice.includes('rotate-secrets') ? 1 : 0) + (actionChoice.includes('write-runbook') ? 1 : 0) - (actionChoice.includes('ignore') ? 1 : 0);
    return <div style={outputBoxStyle}>{`Postmortem quality score: ${quality}\nGood post-incident work identifies cause and updates prevention steps.`}</div>;
  };

  return (
    <Layout title={`Blue Team Lesson ${lessonNumber}: ${lessonMeta.title} - Try It Yourself`}>
      <div style={{ padding: '2rem' }}>
        <h1>{`Blue Team Lesson ${lessonNumber}: ${lessonMeta.title} - Try It Yourself`}</h1>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
          <div style={{ flex: 1 }}>
            <div style={editorShellStyle}>
              <div style={panelHeaderStyle}>Simulator / Actions</div>
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
