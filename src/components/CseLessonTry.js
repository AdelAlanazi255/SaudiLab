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

const editorBodyStyle = {
  flex: 1,
  padding: '0.5rem',
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

const outputBodyStyle = {
  flex: 1,
  padding: '0.5rem',
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
};

const fieldStyle = {
  width: '100%',
  padding: '0.55rem 0.65rem',
  borderRadius: '8px',
  border: '1px solid #2a2f36',
  background: '#111827',
  color: '#e5e7eb',
  marginBottom: '0.6rem',
};

function riskTone(level) {
  if (level === 'Low' || level === 'Safe' || level === 'Strong') return 'var(--ifm-color-success)';
  if (level === 'Medium' || level === 'Warning') return '#fbbf24';
  return 'var(--ifm-color-danger)';
}

function getLessonNumber(lessonId) {
  const match = String(lessonId || '').match(/(\d+)/);
  return match ? Number(match[1]) : NaN;
}

export default function CseLessonTry({ lessonId = 'cse_lesson2' }) {
  const lessonNumber = getLessonNumber(lessonId);
  const lessonMeta = useMemo(() => getLessonMeta('cse', lessonNumber), [lessonNumber]);
  const lesson = useMemo(() => getLesson('cse', lessonId), [lessonId]);
  const backPath = lesson?.permalink || `/cse/lesson${lessonNumber}`;
  const [backHover, setBackHover] = useState(false);

  const [password, setPassword] = useState('');
  const [phishHits, setPhishHits] = useState({});
  const [browser, setBrowser] = useState({ https: true, certValid: true, typo: false });
  const [perms, setPerms] = useState({ camera: false, microphone: false, location: false, notifications: true, contacts: false });
  const [network, setNetwork] = useState({ secure: false, openWifi: true, vpn: false });
  const [auth, setAuth] = useState({ mfa: true, weak: false, reused: false });
  const [exposure, setExposure] = useState({ emailPublic: false, phonePublic: false, locationVisible: false });
  const [habits, setHabits] = useState({ updateSoftware: true, ignoreUpdates: false, reusePasswords: false, backupFiles: true, clickUnknownLinks: false });
  const [challengeAnswers, setChallengeAnswers] = useState({});
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (canAccessLesson('cse', lessonNumber)) return;
    window.location.replace(getLastUnlockedLessonPath('cse') || '/cse/lesson1');
  }, [lessonNumber]);

  const reset = () => {
    setPassword('');
    setPhishHits({});
    setBrowser({ https: true, certValid: true, typo: false });
    setPerms({ camera: false, microphone: false, location: false, notifications: true, contacts: false });
    setNetwork({ secure: false, openWifi: true, vpn: false });
    setAuth({ mfa: true, weak: false, reused: false });
    setExposure({ emailPublic: false, phonePublic: false, locationVisible: false });
    setHabits({ updateSoftware: true, ignoreUpdates: false, reusePasswords: false, backupFiles: true, clickUnknownLinks: false });
    setChallengeAnswers({});
    setChallengeSubmitted(false);
  };

  const passwordChecks = {
    length: password.length >= 10,
    numbers: /\d/.test(password),
    symbols: /[^A-Za-z0-9]/.test(password),
  };
  const passwordScore = Object.values(passwordChecks).filter(Boolean).length + (password.length >= 14 ? 1 : 0);
  const passwordLevel = password.length === 0 ? 'Weak' : passwordScore >= 4 ? 'Strong' : passwordScore >= 2 ? 'Medium' : 'Weak';

  const suspiciousMap = { sender: true, subject: false, link: true, urgency: true, greeting: false };
  const spotted = Object.keys(suspiciousMap).filter((k) => phishHits[k] && suspiciousMap[k]).length;
  const totalSigns = Object.values(suspiciousMap).filter(Boolean).length;

  const browserScore = (browser.https ? 0 : 2) + (browser.certValid ? 0 : 2) + (browser.typo ? 2 : 0);
  const browserLevel = browserScore >= 4 ? 'Dangerous' : browserScore >= 2 ? 'Warning' : 'Safe';

  const privacyRisk = (perms.camera ? 1 : 0) + (perms.microphone ? 1 : 0) + (perms.location ? 1 : 0) + (perms.contacts ? 1 : 0) + (perms.notifications ? 0.5 : 0);
  const privacyLevel = privacyRisk >= 3 ? 'High' : privacyRisk >= 1.5 ? 'Medium' : 'Low';

  const networkScore = (network.openWifi ? 2 : 0) + (network.secure ? -1 : 0) + (network.vpn ? -2 : 0);
  const networkLevel = networkScore >= 2 ? 'Exposed' : networkScore >= 1 ? 'Warning' : 'Protected';

  const authScore = (auth.mfa ? -2 : 2) + (auth.weak ? 2 : 0) + (auth.reused ? 2 : 0);
  const authLevel = authScore >= 3 ? 'High' : authScore >= 1 ? 'Medium' : 'Low';

  const visibleCount = Object.values(exposure).filter(Boolean).length;
  const exposureLevel = visibleCount >= 2 ? 'High' : visibleCount === 1 ? 'Medium' : 'Low';

  const habitsScore =
    (habits.updateSoftware ? -1 : 0) +
    (habits.ignoreUpdates ? 2 : 0) +
    (habits.reusePasswords ? 2 : 0) +
    (habits.backupFiles ? -1 : 0) +
    (habits.clickUnknownLinks ? 2 : 0);
  const habitsLevel = habitsScore >= 3 ? 'High' : habitsScore >= 1 ? 'Medium' : 'Low';

  const challengeConfig = [
    {
      id: 'email',
      label: 'You receive an email saying your account is suspended unless you act now.',
      safe: 'verify_sender',
      options: [
        { value: 'verify_sender', label: 'Verify the sender and open the official site directly' },
        { value: 'click_link', label: 'Click the email link immediately' },
        { value: 'save_for_later', label: 'Leave it for later without checking' },
      ],
    },
    {
      id: 'wifi',
      label: 'You need to use public Wi-Fi in a cafe.',
      safe: 'trusted_protection',
      options: [
        { value: 'trusted_protection', label: 'Use trusted protection and avoid sensitive logins' },
        { value: 'open_for_banking', label: 'Use open Wi-Fi for banking and email' },
        { value: 'ask_network', label: 'Ask staff to confirm the correct network first' },
      ],
    },
    {
      id: 'reset',
      label: 'A password reset message appears, but you did not request it.',
      safe: 'secure_account_now',
      options: [
        { value: 'secure_account_now', label: 'Secure your account and change your password immediately' },
        { value: 'ignore_alert', label: 'Ignore the message completely' },
        { value: 'reply_message', label: 'Reply to the message and ask if it is real' },
      ],
    },
    {
      id: 'update',
      label: 'Your device asks to install a security update.',
      safe: 'install_now',
      options: [
        { value: 'install_now', label: 'Install the update now' },
        { value: 'disable_updates', label: 'Disable updates to avoid interruptions' },
        { value: 'delay_week', label: 'Delay for a week' },
      ],
    },
    {
      id: 'login',
      label: 'You get a login approval request from an unknown device.',
      safe: 'deny_and_review',
      options: [
        { value: 'deny_and_review', label: 'Deny the request and review account activity' },
        { value: 'approve_quickly', label: 'Approve it so the notification stops' },
        { value: 'wait_without_action', label: 'Wait and do nothing' },
      ],
    },
  ];
  const challengeComplete = challengeConfig.every((q) => challengeAnswers[q.id]);
  const challengeSafe = challengeConfig.filter((q) => challengeAnswers[q.id] === q.safe).length;
  const challengeLevel = challengeSafe >= 4 ? 'Beginner Safe' : challengeSafe >= 2 ? 'Improving' : 'High Risk';

  const leftByLesson = {
    2: (
      <>
        <p style={{ marginTop: 0 }}>Type a password to see live feedback.</p>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter a password" style={fieldStyle} />
        <div style={{ marginBottom: '0.4rem' }}>Length 10+: {passwordChecks.length ? 'Yes' : 'No'}</div>
        <div style={{ marginBottom: '0.4rem' }}>Contains numbers: {passwordChecks.numbers ? 'Yes' : 'No'}</div>
        <div>Contains symbols: {passwordChecks.symbols ? 'Yes' : 'No'}</div>
      </>
    ),
    3: (
      <>
        <p style={{ marginTop: 0 }}>Click the parts of this email that look suspicious.</p>
        {[
          ['sender', 'Sender: support@bank-secure-alerts.io'],
          ['subject', 'Subject: Monthly statement available'],
          ['link', 'Link: http://secure-check-account-update.com'],
          ['urgency', 'Message: URGENT - verify now or lose access'],
          ['greeting', 'Greeting: Hello Ahmad'],
        ].map(([key, text]) => {
          const hit = Boolean(phishHits[key]);
          const suspicious = Boolean(suspiciousMap[key]);
          const bg = hit ? (suspicious ? 'rgba(239,68,68,0.18)' : 'rgba(148,163,184,0.2)') : '#111827';
          return (
            <button
              key={key}
              onClick={() => setPhishHits((s) => ({ ...s, [key]: !s[key] }))}
              style={{ ...fieldStyle, textAlign: 'left', marginBottom: '0.5rem', background: bg }}
            >
              {text}
            </button>
          );
        })}
      </>
    ),
    4: (
      <>
        <p style={{ marginTop: 0 }}>Toggle browser indicators and watch the safety state.</p>
        <label><input type="checkbox" checked={browser.https} onChange={(e) => setBrowser((s) => ({ ...s, https: e.target.checked }))} /> HTTPS enabled</label><br />
        <label><input type="checkbox" checked={browser.certValid} onChange={(e) => setBrowser((s) => ({ ...s, certValid: e.target.checked }))} /> Certificate valid</label><br />
        <label><input type="checkbox" checked={browser.typo} onChange={(e) => setBrowser((s) => ({ ...s, typo: e.target.checked }))} /> Domain typo present</label>
        <div style={{ marginTop: '0.8rem', padding: '0.65rem', border: '1px solid #2a2f36', borderRadius: '8px' }}>
          URL: {browser.https ? 'https://' : 'http://'}{browser.typo ? 'paypa1.com' : 'paypal.com'}
        </div>
      </>
    ),
    5: (
      <>
        <p style={{ marginTop: 0 }}>Enable only permissions the app really needs.</p>
        {Object.keys(perms).map((k) => (
          <label key={k} style={{ display: 'block', marginBottom: '0.35rem' }}>
            <input type="checkbox" checked={perms[k]} onChange={(e) => setPerms((s) => ({ ...s, [k]: e.target.checked }))} /> {k}
          </label>
        ))}
      </>
    ),
    6: (
      <>
        <p style={{ marginTop: 0 }}>Choose network protections and inspect the data flow.</p>
        <label><input type="checkbox" checked={network.secure} onChange={(e) => setNetwork((s) => ({ ...s, secure: e.target.checked }))} /> Secure connection</label><br />
        <label><input type="checkbox" checked={network.openWifi} onChange={(e) => setNetwork((s) => ({ ...s, openWifi: e.target.checked }))} /> Open Wi-Fi</label><br />
        <label><input type="checkbox" checked={network.vpn} onChange={(e) => setNetwork((s) => ({ ...s, vpn: e.target.checked }))} /> VPN enabled</label>
        <pre style={{ marginTop: '0.8rem', border: '1px solid #2a2f36', borderRadius: '8px', padding: '0.6rem' }}>
{`User Device -> Router -> Internet -> Website
${network.vpn ? 'Traffic tunnel: Encrypted (VPN)' : network.openWifi ? 'Traffic tunnel: Exposed on public Wi-Fi' : 'Traffic tunnel: Standard encrypted session'}`}
        </pre>
      </>
    ),
    7: (
      <>
        <p style={{ marginTop: 0 }}>Toggle account controls to see takeover risk.</p>
        <label><input type="checkbox" checked={auth.mfa} onChange={(e) => setAuth((s) => ({ ...s, mfa: e.target.checked }))} /> MFA ON</label><br />
        <label><input type="checkbox" checked={auth.weak} onChange={(e) => setAuth((s) => ({ ...s, weak: e.target.checked }))} /> Weak password</label><br />
        <label><input type="checkbox" checked={auth.reused} onChange={(e) => setAuth((s) => ({ ...s, reused: e.target.checked }))} /> Reused password</label>
        <p style={{ marginTop: '0.8rem', marginBottom: 0 }}>Login -> Password -> Multi-Factor Authentication -> Access Granted</p>
      </>
    ),
    8: (
      <>
        <p style={{ marginTop: 0 }}>Set profile visibility and check exposure.</p>
        <label><input type="checkbox" checked={exposure.emailPublic} onChange={(e) => setExposure((s) => ({ ...s, emailPublic: e.target.checked }))} /> Email public</label><br />
        <label><input type="checkbox" checked={exposure.phonePublic} onChange={(e) => setExposure((s) => ({ ...s, phonePublic: e.target.checked }))} /> Phone public</label><br />
        <label><input type="checkbox" checked={exposure.locationVisible} onChange={(e) => setExposure((s) => ({ ...s, locationVisible: e.target.checked }))} /> Location visible</label>
      </>
    ),
    9: (
      <>
        <p style={{ marginTop: 0 }}>Select weekly habits to generate a risk timeline summary.</p>
        {Object.keys(habits).map((k) => (
          <label key={k} style={{ display: 'block', marginBottom: '0.35rem' }}>
            <input type="checkbox" checked={habits[k]} onChange={(e) => setHabits((s) => ({ ...s, [k]: e.target.checked }))} /> {k}
          </label>
        ))}
      </>
    ),
    10: (
      <>
        <p style={{ marginTop: 0 }}>Pick the safest action for each situation.</p>
        {challengeConfig.map((q) => (
          <div key={q.id} style={{ marginBottom: '0.6rem' }}>
            <div style={{ marginBottom: '0.2rem' }}>{q.label}</div>
            <select value={challengeAnswers[q.id] || ''} onChange={(e) => setChallengeAnswers((s) => ({ ...s, [q.id]: e.target.value }))} style={fieldStyle}>
              <option value="">Select an action</option>
              {q.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          onClick={() => setChallengeSubmitted(true)}
          disabled={!challengeComplete}
          style={{ ...buttonBase, backgroundColor: '#15181d', color: '#e5e7eb', opacity: challengeComplete ? 1 : 0.5 }}
        >
          Submit Challenge
        </button>
      </>
    ),
  };

  const rightByLesson = {
    2: (
      <>
        <p style={{ marginTop: 0, marginBottom: '0.5rem' }}>
          Strength: <b style={{ color: riskTone(passwordLevel) }}>{passwordLevel}</b>
        </p>
        <p style={{ margin: 0 }}>
          {passwordLevel === 'Strong'
            ? 'Strong passwords are longer and harder to guess.'
            : passwordLevel === 'Medium'
              ? 'Good start. Add length and symbols to improve.'
              : 'Weak passwords are easier to crack and should be upgraded.'}
        </p>
      </>
    ),
    3: (
      <>
        <p style={{ marginTop: 0 }}>You spotted <b>{spotted}</b> / <b>{totalSigns}</b> phishing signs.</p>
        <p style={{ margin: 0 }}>Focus on suspicious sender domains, urgent language, and unsafe links.</p>
      </>
    ),
    4: (
      <>
        <p style={{ marginTop: 0 }}>Status: <b style={{ color: riskTone(browserLevel) }}>{browserLevel}</b></p>
        <p style={{ margin: 0 }}>Valid HTTPS and certificate reduce risk. Domain typos and invalid certificates are major warning signs.</p>
      </>
    ),
    5: (
      <>
        <p style={{ marginTop: 0 }}>Privacy Risk: <b style={{ color: riskTone(privacyLevel) }}>{privacyLevel}</b></p>
        <p style={{ margin: 0 }}>Minimal-permission principle: only allow access required for app function.</p>
      </>
    ),
    6: (
      <>
        <p style={{ marginTop: 0 }}>Connection State: <b style={{ color: riskTone(networkLevel) }}>{networkLevel}</b></p>
        <p style={{ margin: 0 }}>{network.vpn ? 'Traffic is tunneled and harder to intercept.' : network.openWifi ? 'Open Wi-Fi can expose traffic to nearby attackers.' : 'Standard browsing is safer on trusted networks.'}</p>
      </>
    ),
    7: (
      <>
        <p style={{ marginTop: 0 }}>Takeover Risk: <b style={{ color: riskTone(authLevel) }}>{authLevel}</b></p>
        <p style={{ margin: 0 }}>MFA plus strong unique passwords is the safest combination for account protection.</p>
      </>
    ),
    8: (
      <>
        <p style={{ marginTop: 0 }}>Exposure Level: <b style={{ color: riskTone(exposureLevel) }}>{exposureLevel}</b></p>
        <p style={{ marginBottom: '0.4rem' }}>What attackers can see:</p>
        <ul style={{ margin: 0, paddingLeft: '1rem' }}>
          {exposure.emailPublic && <li>Email address</li>}
          {exposure.phonePublic && <li>Phone number</li>}
          {exposure.locationVisible && <li>Location details</li>}
          {visibleCount === 0 && <li>No sensitive profile fields exposed.</li>}
        </ul>
      </>
    ),
    9: (
      <>
        <p style={{ marginTop: 0 }}>Weekly Risk: <b style={{ color: riskTone(habitsLevel) }}>{habitsLevel}</b></p>
        <p style={{ margin: 0 }}>Positive habits lower risk over time; unsafe shortcuts increase exposure quickly.</p>
      </>
    ),
    10: challengeSubmitted ? (
      <>
        <p style={{ marginTop: 0 }}>Final Score: <b style={{ color: riskTone(challengeLevel === 'Beginner Safe' ? 'Safe' : challengeLevel === 'Improving' ? 'Warning' : 'Dangerous') }}>{challengeLevel}</b></p>
        <p style={{ marginBottom: '0.4rem' }}>Correct choices: {challengeSafe} / {challengeConfig.length}</p>
        <p style={{ margin: 0 }}>
          {challengeLevel === 'Beginner Safe'
            ? 'Well done. You applied practical security decisions consistently.'
            : challengeLevel === 'Improving'
              ? 'Good progress. Keep practicing verification and secure browsing habits.'
              : 'You are still learning. Small daily habit changes can improve security quickly.'}
        </p>
      </>
    ) : (
      <p style={{ marginTop: 0 }}>Complete all situations and submit to see your final level.</p>
    ),
  };

  return (
    <Layout title={`CSE Lesson ${lessonNumber}: ${lessonMeta.title} - Try It Yourself`}>
      <div style={{ padding: '2rem' }}>
        <h1>{`CSE Lesson ${lessonNumber}: ${lessonMeta.title} - Try It Yourself`}</h1>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
          <div style={{ flex: 1 }}>
            <div style={editorShellStyle}>
              <div style={panelHeaderStyle}>Scenario</div>
              <div style={editorBodyStyle}>
                <div style={panelBodyStyle}>{leftByLesson[lessonNumber] || <p style={{ marginTop: 0 }}>Interactive content coming soon.</p>}</div>
              </div>
              <div style={editorFooterStyle}>
                <button onClick={reset} style={{ ...buttonBase, backgroundColor: '#15181d', color: '#e5e7eb' }}>Reset</button>
                <Link
                  to={backPath}
                  onMouseEnter={() => setBackHover(true)}
                  onMouseLeave={() => setBackHover(false)}
                  style={{ ...buttonBase, backgroundColor: backHover ? '#14171b' : 'transparent', color: '#9ca3af' }}
                >
                  {`Back to Lesson ${lessonNumber}`}
                </Link>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={outputPanelStyle}>
              <div style={panelHeaderStyle}>Outcome</div>
              <div style={outputBodyStyle}>
                <div style={panelBodyStyle}>{rightByLesson[lessonNumber] || <p style={{ marginTop: 0 }}>No outcome available.</p>}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
