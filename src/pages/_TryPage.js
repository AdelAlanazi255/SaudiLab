import React, { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';
import { getTryStarter } from '@site/src/pages/_tryData';
import { canAccessLesson, getLastUnlockedLessonPath } from '@site/src/utils/lessonAccess';
import { getLessonMeta } from '@site/src/data/lessons';
import { getLesson } from '@site/src/course/courseMap';

const editorShellStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '550px',
  border: '1px solid var(--sl-border)',
  borderRadius: '16px',
  background: 'linear-gradient(180deg, var(--sl-surface), var(--sl-surface-2))',
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
  color: 'var(--sl-muted)',
  borderBottom: '1px solid var(--sl-border)',
  background: 'rgba(226, 238, 251, 0.02)',
};

const editorBodyStyle = {
  flex: 1,
  padding: '0.5rem',
};

const editorFooterStyle = {
  height: '56px',
  padding: '0 0.75rem',
  borderTop: '1px solid var(--sl-border)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  justifyContent: 'flex-start',
  background: 'rgba(226, 238, 251, 0.02)',
};

const textareaStyle = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  padding: '1rem',
  resize: 'none',
  border: 'none',
  borderRadius: '12px',
  outline: 'none',
  background: 'transparent',
  color: 'transparent',
  caretColor: 'var(--sl-text)',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  fontSize: '14px',
  lineHeight: 1.6,
  whiteSpace: 'pre',
  overflow: 'auto',
};

const highlightPreStyle = {
  position: 'absolute',
  inset: 0,
  margin: 0,
  padding: '1rem',
  background: '#0a0f14',
  color: 'var(--sl-text)',
  pointerEvents: 'none',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  fontSize: '14px',
  lineHeight: 1.6,
  overflow: 'auto',
  borderRadius: '8px',
  whiteSpace: 'pre',
};

const editorInputWrapStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
  borderRadius: '12px',
  background: '#0a0f14',
  overflow: 'hidden',
};

const outputPanelStyle = {
  width: '100%',
  height: '550px',
  border: '1px solid var(--sl-border)',
  borderRadius: '16px',
  background: 'linear-gradient(180deg, var(--sl-surface), var(--sl-surface-2))',
  overflow: 'hidden',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)',
};

const outputBodyStyle = {
  flex: 1,
  padding: '0.5rem',
};

const frameStyle = {
  width: '100%',
  height: '100%',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#0a0f14',
};

const buttonBase = {
  height: '40px',
  padding: '0 1rem',
  borderRadius: '14px',
  border: '1px solid var(--sl-border)',
  cursor: 'pointer',
  fontWeight: 600,
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const primaryButtonStyle = {
  backgroundColor: 'var(--sl-accent)',
  color: '#08110b',
};

const ghostButtonStyle = {
  backgroundColor: 'transparent',
  color: 'var(--sl-text)',
};

const previewThemeStyle = `
  <style id="saudilab-preview-theme">
    :root { color-scheme: dark; }
    html, body {
      background: #0b0d10;
      color: #e5e7eb;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      padding: 16px;
      box-sizing: border-box;
    }
    h1, h2, h3, h4, h5, h6 {
      color: #f3f4f6;
    }
    p, li, span, div {
      color: #e5e7eb;
    }
    a {
      color: #93c5fd;
    }
  </style>
`;

function withPreviewTheme(doc) {
  const source = String(doc || '');
  if (source.includes('saudilab-preview-theme')) return source;
  if (/<head[^>]*>/i.test(source)) {
    return source.replace(/<head[^>]*>/i, (m) => `${m}${previewThemeStyle}`);
  }
  return `<!DOCTYPE html><html><head>${previewThemeStyle}</head><body>${source}</body></html>`;
}

function makeJavascriptRunnerDoc(source) {
  const code = JSON.stringify(String(source || '')).replace(/<\//g, '<\\/');
  return `<!DOCTYPE html>
<html>
  <head>
    ${previewThemeStyle}
    <style>
      #console-root {
        white-space: pre-wrap;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size: 14px;
        line-height: 1.55;
      }
      .log { color: #e5e7eb; }
      .error { color: #fca5a5; }
    </style>
  </head>
  <body>
    <div id="console-root"></div>
    <script>
      (function () {
        var output = document.getElementById('console-root');

        function stringify(value) {
          if (typeof value === 'string') return value;
          try {
            return JSON.stringify(value);
          } catch (e) {
            return String(value);
          }
        }

        function writeLine(kind, text) {
          var line = document.createElement('div');
          line.className = kind;
          line.textContent = text;
          output.appendChild(line);
        }

        var originalConsoleLog = console.log.bind(console);
        console.log = function () {
          var message = Array.prototype.map.call(arguments, stringify).join(' ');
          writeLine('log', message);
          originalConsoleLog.apply(console, arguments);
        };

        window.onerror = function (message, source, lineno, colno) {
          writeLine('error', 'Runtime Error: ' + message + ' (' + lineno + ':' + colno + ')');
          return true;
        };

        window.onunhandledrejection = function (event) {
          var reason = event && event.reason ? stringify(event.reason) : 'Unknown promise rejection';
          writeLine('error', 'Unhandled Rejection: ' + reason);
        };

        try {
          var fn = new Function(${code});
          fn();
        } catch (error) {
          writeLine('error', 'Runtime Error: ' + (error && error.message ? error.message : String(error)));
        }
      })();
    </script>
  </body>
</html>`;
}

function buildOutputDoc(course, source) {
  if (course === 'javascript') {
    return makeJavascriptRunnerDoc(source);
  }
  return withPreviewTheme(source);
}

function courseLabel(course) {
  if (course === 'css') return 'CSS';
  if (course === 'javascript') return 'JavaScript';
  if (course === 'cse') return 'CSE';
  return 'HTML';
}

function prismLanguageForCourse(course) {
  if (course === 'css') return 'css';
  if (course === 'javascript') return 'javascript';
  return 'html';
}

function getLessonNumber(lessonId) {
  const match = String(lessonId || '').match(/(\d+)/);
  return match ? Number(match[1]) : NaN;
}

const CSE_SCENARIOS = {
  'cse_lesson1': {
    steps: [
      {
        key: 'password',
        title: 'Password',
        question: 'Choose a password for your new account.',
        options: [
          { label: 'password123', risk: 3, note: 'Using a weak password made the account easier to guess.' },
          { label: 'MyDog2020!', risk: 1, note: 'Your password was moderate but still more predictable than a random one.' },
          { label: 'X9!kA@72Lm#', risk: 0, note: 'A strong password improved account protection.' },
        ],
      },
      {
        key: 'mfa',
        title: 'Multi-Factor Authentication',
        question: 'Do you enable Multi-Factor Authentication?',
        options: [
          { label: 'Enable', risk: -2, note: 'Multi-Factor Authentication added an extra verification layer.' },
          { label: 'Skip', risk: 2, note: 'Skipping Multi-Factor Authentication increased takeover risk.' },
        ],
      },
      {
        key: 'message',
        title: 'Suspicious Message',
        question: "You receive a message: 'URGENT: Verify your account now' with a link.",
        options: [
          { label: 'Click the link', risk: 3, note: 'Clicking the urgent link increased phishing exposure.' },
          { label: 'Ignore', risk: 1, note: 'Ignoring the message avoided direct interaction, but verification is safer.' },
          { label: 'Verify the sender first', risk: 0, note: 'Verifying the sender first reduced phishing risk.' },
        ],
      },
      {
        key: 'updates',
        title: 'Updates',
        question: 'Your device asks to install an update.',
        options: [
          { label: 'Install now', risk: -1, note: 'Installing updates quickly reduced known vulnerability risk.' },
          { label: 'Remind me later', risk: 1, note: 'Delaying updates left security fixes unapplied for longer.' },
          { label: 'Disable updates', risk: 3, note: 'Disabling updates created long-term device exposure.' },
        ],
      },
    ],
  },
  'cse_lesson2': {
    steps: [
      {
        key: 'reuse',
        title: 'Password Reuse',
        question: 'How do you handle passwords across multiple websites?',
        options: [
          { label: 'Use the same password everywhere', risk: 3, note: 'Password reuse can expose many accounts after one data breach.' },
          { label: 'Use slight variations', risk: 1, note: 'Small variations are still predictable and can be guessed.' },
          { label: 'Use unique passwords per account', risk: 0, note: 'Unique passwords contain the impact of a single breach.' },
        ],
      },
      {
        key: 'manager',
        title: 'Password Manager',
        question: 'How do you store and generate your passwords?',
        options: [
          { label: 'Memorize simple passwords', risk: 2, note: 'Simple memorable passwords are easier to crack.' },
          { label: 'Save in notes app', risk: 2, note: 'Unsecured notes increase exposure if the device is compromised.' },
          { label: 'Use a password manager', risk: -2, note: 'A password manager supports strong, unique credentials.' },
        ],
      },
      {
        key: 'master',
        title: 'Master Password',
        question: 'What type of master password do you choose?',
        options: [
          { label: 'Short and common', risk: 3, note: 'A weak master password undermines all stored credentials.' },
          { label: 'Personal phrase with numbers', risk: 1, note: 'Moderate strength helps, but random complexity is better.' },
          { label: 'Long random passphrase', risk: 0, note: 'A strong master passphrase greatly improves vault security.' },
        ],
      },
      {
        key: 'backup',
        title: 'Recovery Plan',
        question: 'How do you protect account recovery for lost access?',
        options: [
          { label: 'No recovery setup', risk: 2, note: 'Missing recovery setup can lock you out when incidents happen.' },
          { label: 'Email-only recovery', risk: 1, note: 'Single-channel recovery is better than none but still limited.' },
          { label: 'Recovery methods reviewed and saved', risk: -1, note: 'Prepared recovery methods improve resilience.' },
        ],
      },
    ],
  },
  'cse_lesson3': {
    steps: [
      {
        key: 'method',
        title: '2FA Method',
        question: 'Which second factor do you choose?',
        options: [
          { label: 'SMS codes', risk: 1, note: 'SMS works but is less resilient than app-based methods.' },
          { label: 'Authenticator app', risk: -2, note: 'Authenticator apps provide stronger account protection.' },
          { label: 'No second factor', risk: 3, note: 'No second factor leaves your account vulnerable if password leaks.' },
        ],
      },
      {
        key: 'backupCodes',
        title: 'Backup Codes',
        question: 'Do you save recovery or backup codes?',
        options: [
          { label: 'Do not save them', risk: 2, note: 'Skipping backup codes can block account recovery later.' },
          { label: 'Save in inbox', risk: 1, note: 'Email storage helps but can be exposed if inbox is compromised.' },
          { label: 'Save in secure offline place', risk: -1, note: 'Securely stored backup codes improve recovery readiness.' },
        ],
      },
      {
        key: 'prompts',
        title: 'Unexpected Prompts',
        question: 'You receive a login approval prompt you did not request.',
        options: [
          { label: 'Approve quickly', risk: 3, note: 'Approving unknown prompts can grant attacker access.' },
          { label: 'Ignore it', risk: 1, note: 'Ignoring helps, but immediate password reset is safer.' },
          { label: 'Deny and change password', risk: -1, note: 'Denying and resetting credentials limits attack impact.' },
        ],
      },
      {
        key: 'device',
        title: 'Trusted Device',
        question: 'How often do you review trusted devices in account settings?',
        options: [
          { label: 'Never', risk: 2, note: 'Unreviewed trusted devices can hide unauthorized access.' },
          { label: 'Sometimes', risk: 1, note: 'Occasional checks are helpful but should be routine.' },
          { label: 'Regularly', risk: -1, note: 'Regular reviews help remove unknown sessions quickly.' },
        ],
      },
    ],
  },
  'cse_lesson4': {
    steps: [
      {
        key: 'urgentEmail',
        title: 'Urgent Email',
        question: "An email says 'verify now or lose access'. What do you do first?",
        options: [
          { label: 'Click the link immediately', risk: 3, note: 'Immediate clicks on urgent links increase phishing risk.' },
          { label: 'Reply asking if it is real', risk: 1, note: 'Replying still engages potentially malicious senders.' },
          { label: 'Open the site directly and verify', risk: 0, note: 'Independent verification avoids phishing links.' },
        ],
      },
      {
        key: 'sender',
        title: 'Sender Check',
        question: 'How do you validate the sender address?',
        options: [
          { label: 'Only read display name', risk: 2, note: 'Display names can be spoofed easily.' },
          { label: 'Check full email address', risk: 0, note: 'Checking the full address catches many fake messages.' },
          { label: 'Do not check sender', risk: 3, note: 'Skipping sender checks increases likelihood of phishing success.' },
        ],
      },
      {
        key: 'attachments',
        title: 'Unexpected Attachment',
        question: 'You receive an unexpected attachment from a known contact.',
        options: [
          { label: 'Open it directly', risk: 3, note: 'Unexpected attachments can deliver malware.' },
          { label: 'Scan then open', risk: 1, note: 'Scanning helps but confirmation is still recommended.' },
          { label: 'Confirm with sender first', risk: -1, note: 'Out-of-band confirmation reduces malware and phishing risk.' },
        ],
      },
      {
        key: 'report',
        title: 'Reporting',
        question: 'What do you do with a suspicious message?',
        options: [
          { label: 'Delete only', risk: 1, note: 'Deleting helps personally, but reporting protects others too.' },
          { label: 'Ignore and keep', risk: 2, note: 'Keeping suspicious messages can lead to accidental clicks later.' },
          { label: 'Report and delete', risk: -1, note: 'Reporting and deleting improves team and personal safety.' },
        ],
      },
    ],
  },
  'cse_lesson5': {
    steps: [
      {
        key: 'source',
        title: 'Download Source',
        question: 'Where do you download software from?',
        options: [
          { label: 'Random link from search results', risk: 3, note: 'Unverified download sources increase malware risk.' },
          { label: 'Any file shared in chat', risk: 2, note: 'Shared files can be tampered with or unsafe.' },
          { label: 'Official vendor website or app store', risk: 0, note: 'Trusted sources reduce tampered installer risk.' },
        ],
      },
      {
        key: 'warnings',
        title: 'Browser Warning',
        question: 'Your browser warns the file may be unsafe.',
        options: [
          { label: 'Download anyway', risk: 3, note: 'Ignoring warnings can expose your device to malware.' },
          { label: 'Pause and research file reputation', risk: 0, note: 'Checking reputation prevents many unsafe installs.' },
          { label: 'Disable browser warnings', risk: 3, note: 'Disabling warnings removes an important protection layer.' },
        ],
      },
      {
        key: 'permissions',
        title: 'Install Permissions',
        question: 'An app asks for permissions unrelated to its function.',
        options: [
          { label: 'Grant all permissions', risk: 2, note: 'Excess permissions increase privacy and security exposure.' },
          { label: 'Review and allow only needed', risk: -1, note: 'Limiting permissions reduces unnecessary data access.' },
          { label: 'Cancel installation', risk: 0, note: 'Cancelling suspicious installs prevents potential misuse.' },
        ],
      },
      {
        key: 'antivirus',
        title: 'Protection Layer',
        question: 'How do you handle endpoint security scans?',
        options: [
          { label: 'Disable scans for performance', risk: 3, note: 'Disabling scans removes early malware detection.' },
          { label: 'Keep scans on but ignore alerts', risk: 1, note: 'Ignored alerts can leave threats unresolved.' },
          { label: 'Keep scans on and review alerts', risk: -1, note: 'Active scan review improves detection and response.' },
        ],
      },
    ],
  },
  'cse_lesson6': {
    steps: [
      {
        key: 'timing',
        title: 'Update Timing',
        question: 'A security update is available. What do you do?',
        options: [
          { label: 'Install now', risk: -1, note: 'Prompt patching closes known vulnerabilities sooner.' },
          { label: 'Delay for weeks', risk: 2, note: 'Long delays keep known weaknesses exposed.' },
          { label: 'Skip updates', risk: 3, note: 'Skipping updates leaves exploitable gaps unpatched.' },
        ],
      },
      {
        key: 'auto',
        title: 'Automatic Updates',
        question: 'How are your update settings configured?',
        options: [
          { label: 'Automatic enabled', risk: -1, note: 'Automatic updates improve baseline protection.' },
          { label: 'Manual checks monthly', risk: 1, note: 'Manual updates help, but infrequent checks create delay risk.' },
          { label: 'Automatic disabled', risk: 2, note: 'Disabled automation often leads to missed patches.' },
        ],
      },
      {
        key: 'restart',
        title: 'Restart Prompt',
        question: 'An update needs restart to finish.',
        options: [
          { label: 'Restart soon', risk: 0, note: 'Finishing the restart applies the protection fully.' },
          { label: 'Postpone repeatedly', risk: 1, note: 'Repeated postponement delays effective patching.' },
          { label: 'Ignore permanently', risk: 2, note: 'Ignoring restart prompts can leave patching incomplete.' },
        ],
      },
      {
        key: 'legacy',
        title: 'Unsupported Software',
        question: 'You rely on software that no longer receives updates.',
        options: [
          { label: 'Keep using unchanged', risk: 3, note: 'Unsupported software may contain unpatched critical flaws.' },
          { label: 'Limit use and isolate', risk: 1, note: 'Isolation lowers risk but does not remove vulnerabilities.' },
          { label: 'Plan migration to supported version', risk: -1, note: 'Migrating to supported versions restores patch coverage.' },
        ],
      },
    ],
  },
  'cse_lesson7': {
    steps: [
      {
        key: 'wifi',
        title: 'Public Wi-Fi',
        question: 'You connect in a cafe. Which network do you pick?',
        options: [
          { label: 'Open network with no password', risk: 3, note: 'Open Wi-Fi increases interception risk.' },
          { label: 'Unknown network with similar name', risk: 2, note: 'Lookalike networks can be attacker-controlled.' },
          { label: 'Verified official network', risk: 0, note: 'Verified networks reduce accidental rogue access.' },
        ],
      },
      {
        key: 'vpn',
        title: 'Connection Protection',
        question: 'How do you protect traffic on public networks?',
        options: [
          { label: 'No extra protection', risk: 2, note: 'Unprotected sessions increase data exposure risk.' },
          { label: 'Use trusted VPN', risk: -1, note: 'Trusted VPN adds privacy on shared networks.' },
          { label: 'Avoid sensitive logins entirely', risk: 0, note: 'Avoiding sensitive activity lowers attack impact.' },
        ],
      },
      {
        key: 'https',
        title: 'Secure Browsing',
        question: 'A site shows certificate warning while logging in.',
        options: [
          { label: 'Continue anyway', risk: 3, note: 'Ignoring certificate warnings can expose credentials.' },
          { label: 'Close and revisit later', risk: 0, note: 'Stopping on certificate warnings avoids unsafe sessions.' },
          { label: 'Switch to trusted connection first', risk: -1, note: 'Using trusted connections reduces interception risk.' },
        ],
      },
      {
        key: 'sharing',
        title: 'File Sharing',
        question: 'Your laptop asks to enable sharing on public network.',
        options: [
          { label: 'Enable sharing', risk: 2, note: 'Public file sharing can expose data to unknown users.' },
          { label: 'Disable sharing', risk: -1, note: 'Disabling sharing protects local files on public networks.' },
          { label: 'Unsure and keep defaults', risk: 1, note: 'Unclear network settings can keep unnecessary exposure.' },
        ],
      },
    ],
  },
  'cse_lesson8': {
    steps: [
      {
        key: 'appPerms',
        title: 'App Permissions',
        question: 'A flashlight app requests contacts and microphone.',
        options: [
          { label: 'Allow all permissions', risk: 3, note: 'Over-permissioned apps can collect unnecessary personal data.' },
          { label: 'Allow while using app', risk: 1, note: 'Limited access is better but still should match app purpose.' },
          { label: 'Deny unrelated permissions', risk: -1, note: 'Denying unrelated permissions reduces privacy exposure.' },
        ],
      },
      {
        key: 'browser',
        title: 'Browser Privacy',
        question: 'How do you handle website tracking permissions?',
        options: [
          { label: 'Accept all by default', risk: 2, note: 'Automatic acceptance increases tracking footprint.' },
          { label: 'Review site-by-site', risk: 0, note: 'Reviewing permissions limits unnecessary tracking.' },
          { label: 'Use strict privacy settings', risk: -1, note: 'Stricter defaults reduce data collection.' },
        ],
      },
      {
        key: 'location',
        title: 'Location Access',
        question: 'A social app requests always-on location.',
        options: [
          { label: 'Allow always', risk: 2, note: 'Continuous location access can expose movement patterns.' },
          { label: 'Allow once', risk: 0, note: 'One-time access reduces continuous tracking.' },
          { label: 'Only while using app', risk: -1, note: 'Limited location access is safer for privacy.' },
        ],
      },
      {
        key: 'cleanup',
        title: 'Permission Review',
        question: 'How often do you audit app/browser permissions?',
        options: [
          { label: 'Never review', risk: 2, note: 'Unused permissions may remain active without review.' },
          { label: 'Review occasionally', risk: 1, note: 'Occasional review helps but scheduled checks are stronger.' },
          { label: 'Review regularly', risk: -1, note: 'Regular audits keep permissions aligned with need.' },
        ],
      },
    ],
  },
  'cse_lesson9': {
    steps: [
      {
        key: 'backupType',
        title: 'Backup Method',
        question: 'How are your important files backed up?',
        options: [
          { label: 'No backups', risk: 3, note: 'Without backups, data loss incidents have high impact.' },
          { label: 'Single local backup', risk: 1, note: 'One backup helps but can still fail or be lost.' },
          { label: 'Cloud + local backup', risk: -1, note: 'Multiple backup locations improve recovery reliability.' },
        ],
      },
      {
        key: 'backupFreq',
        title: 'Backup Frequency',
        question: 'How often do backups run?',
        options: [
          { label: 'Rarely', risk: 2, note: 'Infrequent backups increase potential data loss window.' },
          { label: 'Weekly', risk: 1, note: 'Weekly backups are useful but may miss recent changes.' },
          { label: 'Automatic daily', risk: -1, note: 'Frequent automated backups improve recovery quality.' },
        ],
      },
      {
        key: 'accountRecovery',
        title: 'Recovery Setup',
        question: 'How do you secure account recovery options?',
        options: [
          { label: 'Outdated phone/email', risk: 2, note: 'Outdated recovery info can block access during incidents.' },
          { label: 'Current info but no checks', risk: 1, note: 'Current data helps, but periodic validation is better.' },
          { label: 'Current info reviewed regularly', risk: -1, note: 'Reviewed recovery settings improve account resilience.' },
        ],
      },
      {
        key: 'restoreTest',
        title: 'Restore Test',
        question: 'Do you test recovery and restore procedures?',
        options: [
          { label: 'Never test restore', risk: 2, note: 'Untested backups may fail when urgently needed.' },
          { label: 'Test only after issues', risk: 1, note: 'Reactive testing can reveal problems too late.' },
          { label: 'Test restore periodically', risk: -1, note: 'Periodic restore testing confirms backup readiness.' },
        ],
      },
    ],
  },
  'cse_lesson10': {
    steps: [
      {
        key: 'dailyCheck',
        title: 'Daily Checklist',
        question: 'How do you start your security routine each day?',
        options: [
          { label: 'No routine', risk: 2, note: 'No routine makes it easier to miss early warning signs.' },
          { label: 'Check alerts sometimes', risk: 1, note: 'Occasional checks help, but consistency matters.' },
          { label: 'Review alerts and updates daily', risk: -1, note: 'Consistent checks improve early detection and response.' },
        ],
      },
      {
        key: 'accountHygiene',
        title: 'Account Hygiene',
        question: 'How do you maintain account access hygiene?',
        options: [
          { label: 'Reuse passwords, no 2FA', risk: 3, note: 'Weak account hygiene increases takeover risk significantly.' },
          { label: 'Strong password but no 2FA', risk: 1, note: 'Strong passwords help, but no second factor leaves a gap.' },
          { label: 'Unique passwords and 2FA', risk: -2, note: 'Strong hygiene greatly reduces credential attack success.' },
        ],
      },
      {
        key: 'phishing',
        title: 'Message Handling',
        question: 'How do you handle urgent messages with links?',
        options: [
          { label: 'Click quickly', risk: 3, note: 'Fast clicks on urgent links are a common phishing entry point.' },
          { label: 'Pause and verify sender', risk: -1, note: 'Verification prevents many social engineering attacks.' },
          { label: 'Ignore all messages', risk: 1, note: 'Ignoring can avoid danger but may miss legitimate alerts.' },
        ],
      },
      {
        key: 'resilience',
        title: 'Recovery Readiness',
        question: 'What is your plan if an account is compromised?',
        options: [
          { label: 'No clear plan', risk: 2, note: 'Missing response plans slows recovery and increases impact.' },
          { label: 'Basic plan only', risk: 1, note: 'Basic plans help but may miss critical response steps.' },
          { label: 'Documented checklist and backups', risk: -1, note: 'A documented plan and backups improve resilience.' },
        ],
      },
    ],
  },
};

function getCseScenario(lessonId) {
  return CSE_SCENARIOS[lessonId] || CSE_SCENARIOS['cse_lesson1'];
}

function buildCseChoices(steps) {
  return steps.reduce((acc, step) => ({ ...acc, [step.key]: null }), {});
}

function computeCseOutcome(choices, stepConfig) {
  let score = 0;
  const bullets = [];
  let nextImprovement = null;

  for (const step of stepConfig) {
    const selectedLabel = choices?.[step.key];
    const selected = step.options.find((option) => option.label === selectedLabel);
    if (!selected) continue;
    score += Number(selected.risk || 0);
    if (selected.note) bullets.push(selected.note);
    if (!nextImprovement && selected.risk > 0) {
      nextImprovement = `Improve this first: ${step.title}.`;
    }
  }

  score = Math.max(0, score);
  const riskLevel = score >= 7 ? 'High' : score >= 3 ? 'Medium' : 'Low';

  let whatHappened = 'Your decisions reduced common beginner threats and lowered the chance of account misuse.';
  if (riskLevel === 'Medium') {
    whatHappened = 'Some choices were safe, but a few decisions still leave realistic exposure to common attacks.';
  }
  if (riskLevel === 'High') {
    whatHappened = 'Several risky decisions combined to leave your account and device exposed to frequent attack patterns.';
  }

  if (!nextImprovement) {
    nextImprovement = 'Well done: maintain these habits and review your settings regularly.';
  }

  return { score, riskLevel, bullets, whatHappened, nextImprovement };
}

function getRiskMessage(riskLevel) {
  if (riskLevel === 'Low') {
    return 'Well done. Your choices significantly reduced common beginner risks - attackers would have a much harder time accessing your information.';
  }
  if (riskLevel === 'Medium') {
    return 'Good start. You made some safe choices, but a few habits still increase your exposure to common attacks.';
  }
  return 'Your choices left several weak points that attackers often exploit. The good news: small habit changes can quickly improve your security.';
}

function getRiskColor(riskLevel) {
  if (riskLevel === 'Low') return 'var(--ifm-color-success)';
  if (riskLevel === 'Medium') return '#f9c64f';
  return 'var(--ifm-color-danger)';
}

export default function TryPage({ course = 'html', lessonId = 'lesson1' }) {
  const lessonNumber = getLessonNumber(lessonId);
  const isCse = course === 'cse';
  const cseScenario = useMemo(() => getCseScenario(lessonId), [lessonId]);
  const cseStepConfig = useMemo(() => (isCse ? cseScenario.steps : []), [isCse, cseScenario]);
  const totalCseSteps = cseStepConfig.length;
  const initialCode = useMemo(() => getTryStarter(course, lessonId), [course, lessonId]);
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState(initialCode);
  const [runHover, setRunHover] = useState(false);
  const [backHover, setBackHover] = useState(false);
  const [cseStep, setCseStep] = useState(1);
  const [cseChoices, setCseChoices] = useState(() => buildCseChoices(cseStepConfig));
  const [cseSubmittedChoices, setCseSubmittedChoices] = useState(null);
  const [cseSubmittedOutcome, setCseSubmittedOutcome] = useState(null);
  const outputDoc = useMemo(() => buildOutputDoc(course, output), [course, output]);
  const label = courseLabel(course);
  const lessonMeta = useMemo(() => getLessonMeta(course, lessonNumber), [course, lessonNumber]);
  const lessonTitle = lessonMeta.title;
  const lesson = useMemo(() => getLesson(course, lessonId), [course, lessonId]);
  const backPath = lesson?.permalink || `/${course}/lesson${lessonNumber}`;
  const prismLanguage = prismLanguageForCourse(course);
  const codeClass = `language-${prismLanguage}`;
  const preRef = useRef(null);

  const highlighted = useMemo(() => {
    const grammar = Prism.languages[prismLanguage] || Prism.languages.markup;
    return Prism.highlight(code, grammar, prismLanguage);
  }, [code, prismLanguage]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (canAccessLesson(course, lessonNumber)) return;

    const fallbackPath = backPath;
    const redirectPath = getLastUnlockedLessonPath(course) || fallbackPath;
    window.location.replace(redirectPath);
  }, [course, lessonNumber, backPath]);

  useEffect(() => {
    if (!isCse) return;
    setCseStep(1);
    setCseChoices(buildCseChoices(cseStepConfig));
    setCseSubmittedChoices(null);
    setCseSubmittedOutcome(null);
  }, [isCse, lessonId, cseStepConfig]);

  const cseChoicesChangedAfterSubmit = useMemo(() => {
    if (!isCse || !cseSubmittedChoices) return false;
    return JSON.stringify(cseChoices) !== JSON.stringify(cseSubmittedChoices);
  }, [isCse, cseChoices, cseSubmittedChoices]);

  const syncScroll = (e) => {
    if (!preRef.current) return;
    preRef.current.scrollTop = e.target.scrollTop;
    preRef.current.scrollLeft = e.target.scrollLeft;
  };

  const onResetCse = () => {
    setCseStep(1);
    setCseChoices(buildCseChoices(cseStepConfig));
    setCseSubmittedChoices(null);
    setCseSubmittedOutcome(null);
  };

  const activeStep = cseStepConfig[cseStep - 1];
  const currentChoice = activeStep ? cseChoices[activeStep.key] : null;
  const setScenarioChoice = (value) => {
    if (!activeStep) return;
    setCseChoices((prev) => ({ ...prev, [activeStep.key]: value }));
  };
  const allStepsAnswered = cseStepConfig.every((step) => Boolean(cseChoices[step.key]));
  const onSubmitCse = () => {
    if (!allStepsAnswered) return;
    const snapshot = { ...cseChoices };
    setCseSubmittedChoices(snapshot);
    setCseSubmittedOutcome(computeCseOutcome(snapshot, cseStepConfig));
  };

  return (
    <Layout title={`${label} Lesson ${lessonNumber}: ${lessonTitle} - Try It Yourself`}>
      <div style={{ padding: '2rem' }}>
        <h1>{`${label} Lesson ${lessonNumber}: ${lessonTitle} - Try It Yourself`}</h1>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
          <div style={{ flex: 1 }}>
            <div style={editorShellStyle}>
              <div style={panelHeaderStyle}>{isCse ? 'Scenario' : 'Editor'}</div>
              <div style={editorBodyStyle}>
                {isCse ? (
                  <div
                    style={{
                      ...editorInputWrapStyle,
                      padding: '1rem',
                      color: 'var(--sl-text)',
                      background: '#0a0f14',
                      overflow: 'auto',
                    }}
                  >
                    <p style={{ marginTop: 0, marginBottom: '0.4rem', fontWeight: 700 }}>
                      {`Step ${cseStep} of ${totalCseSteps} - ${activeStep?.title || ''}`}
                    </p>
                    <p style={{ marginTop: 0, marginBottom: '0.9rem' }}>{activeStep?.question}</p>

                    <div style={{ display: 'grid', gap: '0.55rem' }}>
                      {activeStep?.options.map((option) => {
                        const selected = currentChoice === option.label;
                        return (
                          <button
                            key={option.label}
                            onClick={() => setScenarioChoice(option.label)}
                            style={{
                              textAlign: 'left',
                              padding: '0.65rem 0.75rem',
                              borderRadius: '14px',
                              border: selected ? '1px solid var(--sl-accent)' : '1px solid var(--sl-border)',
                              background: selected ? 'rgba(124,242,176,0.12)' : '#111827',
                              color: 'var(--sl-text)',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', gap: '0.55rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setCseStep((s) => Math.max(1, s - 1))}
                        disabled={cseStep === 1}
                        style={{
                          ...buttonBase,
                          height: '36px',
                          opacity: cseStep === 1 ? 0.5 : 1,
                          cursor: cseStep === 1 ? 'default' : 'pointer',
                          background: '#111827',
                          color: 'var(--sl-text)',
                        }}
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setCseStep((s) => Math.min(totalCseSteps, s + 1))}
                        disabled={cseStep === totalCseSteps || !currentChoice}
                        style={{
                          ...buttonBase,
                          height: '36px',
                          opacity: cseStep === totalCseSteps || !currentChoice ? 0.5 : 1,
                          cursor: cseStep === totalCseSteps || !currentChoice ? 'default' : 'pointer',
                          background: '#111827',
                          color: 'var(--sl-text)',
                        }}
                      >
                        Next
                      </button>
                      {cseStep === totalCseSteps ? (
                        <button
                          onClick={onSubmitCse}
                          disabled={!allStepsAnswered}
                          style={{
                            ...buttonBase,
                            ...primaryButtonStyle,
                            height: '36px',
                            opacity: allStepsAnswered ? 1 : 0.5,
                            cursor: allStepsAnswered ? 'pointer' : 'default',
                          }}
                        >
                          Submit
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div style={editorInputWrapStyle}>
                    <pre ref={preRef} style={highlightPreStyle} className={codeClass} aria-hidden>
                      <code className={codeClass} dangerouslySetInnerHTML={{ __html: highlighted }} />
                    </pre>
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      onScroll={syncScroll}
                      spellCheck={false}
                      style={textareaStyle}
                    />
                  </div>
                )}
              </div>
              <div style={editorFooterStyle}>
                {isCse ? (
                  <button
                    onClick={onResetCse}
                    style={{
                      ...buttonBase,
                      ...primaryButtonStyle,
                    }}
                  >
                    Reset
                  </button>
                ) : (
                  <button
                    onClick={() => setOutput(code)}
                    onMouseEnter={() => setRunHover(true)}
                    onMouseLeave={() => setRunHover(false)}
                    style={{
                      ...buttonBase,
                      ...primaryButtonStyle,
                      backgroundColor: runHover ? '#93f6c1' : 'var(--sl-accent)',
                    }}
                  >
                    RUN
                  </button>
                )}
                <Link
                  to={backPath}
                  onMouseEnter={() => setBackHover(true)}
                  onMouseLeave={() => setBackHover(false)}
                    style={{
                      ...buttonBase,
                      ...ghostButtonStyle,
                      backgroundColor: backHover ? 'rgba(226, 238, 251, 0.08)' : 'transparent',
                    }}
                  >
                  {`Back to Lesson ${lessonNumber}`}
                </Link>
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ ...outputPanelStyle, display: 'flex', flexDirection: 'column' }}>
              <div style={panelHeaderStyle}>{isCse ? 'Outcome' : course === 'javascript' ? 'Results' : 'Preview'}</div>
              <div style={outputBodyStyle}>
                {isCse ? (
                  <div
                    style={{
                      ...editorInputWrapStyle,
                      padding: '1rem',
                      color: 'var(--sl-text)',
                      background: '#0a0f14',
                      overflow: 'auto',
                    }}
                  >
                    {cseSubmittedOutcome ? (
                      <>
                        <p style={{ marginTop: 0, marginBottom: '0.6rem', fontWeight: 700 }}>
                          Risk Level:{' '}
                          <span
                            style={{
                              color: getRiskColor(cseSubmittedOutcome.riskLevel),
                              fontWeight: 800,
                            }}
                          >
                            {cseSubmittedOutcome.riskLevel}
                          </span>
                        </p>
                        <p style={{ marginTop: 0, marginBottom: '0.8rem', opacity: 0.95 }}>
                          {getRiskMessage(cseSubmittedOutcome.riskLevel)}
                        </p>
                        <ul style={{ marginTop: 0, marginBottom: '0.8rem', paddingLeft: '1.1rem' }}>
                          {(cseSubmittedOutcome.bullets || []).slice(0, 6).map((item) => (
                            <li key={item} style={{ marginBottom: '0.35rem' }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                        <p style={{ marginTop: 0, marginBottom: '0.8rem' }}>
                          <strong>What happened:</strong> {cseSubmittedOutcome.whatHappened}
                        </p>
                        <p style={{ margin: 0 }}>
                          <strong>Next Improvement:</strong> {cseSubmittedOutcome.nextImprovement}
                        </p>
                        {cseChoicesChangedAfterSubmit ? (
                          <p style={{ marginTop: '0.8rem', marginBottom: 0, color: '#facc15' }}>
                            Your answers changed. Click Submit again to update the result.
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <p style={{ marginTop: 0, marginBottom: '0.6rem' }}>
                          Complete all {totalCseSteps} steps, then click Submit to see your risk level and summary.
                        </p>
                        <p style={{ margin: 0, opacity: 0.9 }}>
                          Progress: Step {cseStep} of {totalCseSteps}
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <iframe
                    title="output"
                    style={frameStyle}
                    srcDoc={outputDoc}
                    sandbox={course === 'javascript' || course === 'cse' ? 'allow-scripts' : undefined}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

