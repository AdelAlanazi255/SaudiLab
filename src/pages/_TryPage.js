import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import LandscapeTip from '@site/src/components/LandscapeTip';
import ColorPaletteTool from '@site/src/components/ColorPaletteTool';
import JavascriptTryWorkspace from '@site/src/components/JavascriptTryWorkspace';
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
  minHeight: 0,
  overflow: 'hidden',
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

const jsRunBlockStyle = {
  height: '56px',
  padding: '0 0.75rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  justifyContent: 'flex-start',
  border: '1px solid var(--sl-border)',
  borderRadius: '16px',
  background: 'linear-gradient(180deg, var(--sl-surface), var(--sl-surface-2))',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)',
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

function buildOutputDoc(course, source) {
  return withPreviewTheme(source);
}

function codeMirrorModeForCourse(course) {
  if (course === 'css') return 'css';
  if (course === 'javascript') return 'javascript';
  return 'htmlmixed';
}

function TryCodeEditor({ value, options, onBeforeChange }) {
  return (
    <BrowserOnly fallback={<div className="sl-try-editorLoading">Loading editor...</div>}>
      {() => {
        // Load CodeMirror only in the browser to avoid SSR navigator issues.
        // eslint-disable-next-line global-require
        const { Controlled: CodeMirror } = require('react-codemirror2');
        // eslint-disable-next-line global-require
        require('codemirror/lib/codemirror.css');
        // eslint-disable-next-line global-require
        require('codemirror/theme/material-darker.css');
        // eslint-disable-next-line global-require
        require('codemirror/mode/xml/xml');
        // eslint-disable-next-line global-require
        require('codemirror/mode/javascript/javascript');
        // eslint-disable-next-line global-require
        require('codemirror/mode/css/css');
        // eslint-disable-next-line global-require
        require('codemirror/mode/htmlmixed/htmlmixed');

        return (
          <CodeMirror
            value={value}
            options={options}
            editorDidMount={(editor) => {
              editor.refresh();
            }}
            onBeforeChange={onBeforeChange}
          />
        );
      }}
    </BrowserOnly>
  );
}

function courseLabel(course) {
  if (course === 'css') return 'CSS';
  if (course === 'javascript') return 'JavaScript';
  if (course === 'cse') return 'CSE';
  return 'HTML';
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

function getHtmlTryHint(lessonId) {
  if (lessonId === 'lesson1') {
    return {
      title: 'Hint',
      intro: 'Start simple and test each change with RUN.',
      ordered: false,
      items: [
        <>Press RUN once to see the starter page in Preview.</>,
        <>Edit the text inside <code>&lt;h1&gt;</code> and <code>&lt;p&gt;</code>, then run again.</>,
        <>Add one more <code>&lt;p&gt;</code> line to practice page structure.</>,
      ],
      tip: <>Tip: Small edits + RUN make it easy to understand what changed.</>,
    };
  }

  if (lessonId === 'lesson2') {
    return {
      title: 'Hint',
      intro: 'Practice structure with headings and paragraphs.',
      ordered: false,
      items: [
        <>Use one <code>&lt;h1&gt;</code>, then add <code>&lt;h2&gt;</code> and <code>&lt;h3&gt;</code> as sub-sections.</>,
        <>Write 2-3 short <code>&lt;p&gt;</code> paragraphs under your headings.</>,
        <>Change the topic text to your own example and press RUN.</>,
      ],
      tip: <>Tip: Pick heading levels by structure, not by size.</>,
    };
  }

  if (lessonId === 'lesson3') {
    return {
      title: 'Hint',
      intro: 'Try text formatting tags to compare meaning and readability.',
      ordered: false,
      items: [
        <>Wrap important words with <code>&lt;strong&gt;</code> and emphasized words with <code>&lt;em&gt;</code>.</>,
        <>Use one <code>&lt;br&gt;</code> for a single line break inside a paragraph.</>,
        <>Press RUN and compare formatted text with normal text.</>,
      ],
      tip: <>Tip: Example: <code>&lt;strong&gt;Important&lt;/strong&gt;</code> and <code>&lt;em&gt;Note&lt;/em&gt;</code>.</>,
    };
  }

  if (lessonId === 'lesson4') {
    return {
      title: 'Hint',
      intro: 'Practice links by changing text and destinations.',
      ordered: false,
      items: [
        <>Edit the clickable words between <code>&lt;a&gt;</code> and <code>&lt;/a&gt;</code>.</>,
        <>Replace the URL in <code>href</code> with another website.</>,
        <>Keep <code>target="_blank"</code> so links open in a new tab.</>,
      ],
      tip: <>Tip: Try linking to your favorite site and give it clear link text.</>,
    };
  }

  if (lessonId === 'lesson5') {
    return {
      title: 'Try Your Own Image',
      intro: 'You can try using your own image from the internet.',
      ordered: true,
      items: [
        <>Search for a photo on Google.</>,
        <>Right-click the image.</>,
        <>Click <strong>"Copy Image Address"</strong>.</>,
        <>Replace the URL inside the <code>src</code> attribute.</>,
        <>Update the <code>alt</code> description to match your image.</>,
      ],
      tip: <><em>Tip: Try finding a picture of a city, animal, or car and display it on your page.</em></>,
    };
  }

  if (lessonId === 'lesson6') {
    return {
      title: 'Hint',
      intro: 'Practice both list types and then build one nested list.',
      ordered: true,
      items: [
        <>Add a new <code>&lt;li&gt;</code> item to the unordered list.</>,
        <>Reorder the ordered list items and run again.</>,
        <>Create a nested <code>&lt;ul&gt;</code> under one list item.</>,
      ],
      tip: <>Challenge: Make a "Top 3" list of anything you like and a separate bullet list of hobbies.</>,
    };
  }

  if (lessonId === 'lesson7') {
    return {
      title: 'Hint',
      intro: 'Build confidence with table structure one step at a time.',
      ordered: true,
      items: [
        <>Add a new row (<code>&lt;tr&gt;</code>) with 3 cells (<code>&lt;td&gt;</code>).</>,
        <>Change one header (<code>&lt;th&gt;</code>) text.</>,
        <>Add a <code>&lt;caption&gt;</code> to your table.</>,
      ],
      tip: <>Challenge: Make a table for "Top 3 Movies" with columns: Title, Year, Rating.</>,
    };
  }

  if (lessonId === 'lesson8') {
    return {
      title: 'Hint',
      intro: 'Practice editing this form.',
      ordered: true,
      items: [
        <>Change the text inside the "Name" label.</>,
        <>Change the placeholder text inside the name input.</>,
        <>Change the text on the button.</>,
      ],
      tip: <>Challenge: Change the form title to your own name.</>,
    };
  }

  if (lessonId === 'lesson9') {
    return {
      title: 'Hint',
      intro: 'Practice editing and adding simple form inputs.',
      ordered: true,
      items: [
        <>Change the placeholder text inside the Name input.</>,
        <>Add a new input for "Password" using <code>&lt;input type="password"&gt;</code>.</>,
        <>Change the text on the submit button.</>,
      ],
      tip: <>Challenge: Add one more input field for "Email".</>,
    };
  }

  if (lessonId === 'lesson10') {
    return {
      title: 'Hint',
      intro: 'Try editing parts of this webpage layout.',
      ordered: true,
      items: [
        <>Change the website title inside the <code>&lt;header&gt;</code>.</>,
        <>Change the text inside the table.</>,
        <>Add another item to the list.</>,
      ],
      tip: (
        <>
          Challenge: Add another <code>&lt;section&gt;</code> with a short paragraph about yourself.
          <br />
          <br />
          Challenge 2: Include a photo from the internet using the <code>&lt;img&gt;</code> tag.
        </>
      ),
    };
  }

  return null;
}

function getCssTryHint(lessonId) {
  if (lessonId === 'lesson1') {
    return {
      title: 'Hint',
      intro: 'Change one simple CSS rule, then press RUN and watch the page update.',
      ordered: false,
      items: [
        <>Edit the <code>h1</code> color first and run.</>,
        <>Change one <code>font-size</code> value (heading or paragraph), then run again.</>,
        <>Change the page <code>background-color</code> as your final small edit.</>,
      ],
      tip: <>Tip: Keep edits small. One line change at a time helps you learn faster.</>,
    };
  }

  if (lessonId === 'lesson2') {
    return {
      title: 'Hint',
      intro: 'Start by changing the color of the heading.',
      ordered: false,
      items: [
        <>Edit the <code>h1</code> selector and press RUN.</>,
        <>Change the paragraph <code>font-size</code> in the <code>p</code> selector.</>,
        <>Try <code>text-align</code> on the heading and observe the difference.</>,
      ],
      tip: <>Tip: Selectors control which HTML elements receive each style.</>,
    };
  }

  if (lessonId === 'lesson3') {
    return {
      title: 'Hint',
      intro: 'Start by changing the heading color, then try a new page background color.',
      ordered: false,
      items: [
        <>Edit the heading <code>color</code> value and press RUN.</>,
        <>Change the page <code>background-color</code> in the <code>body</code> rule.</>,
        <>Make sure paragraph text is still easy to read.</>,
        <>Try one more small color change and compare the result.</>,
      ],
      tip: <>Tip: <code>color</code> changes text. <code>background-color</code> changes the area behind an element.</>,
    };
  }

  if (lessonId === 'lesson4') {
    return {
      title: 'Hint',
      intro: 'Start by changing the class style, then edit the ID style and compare the result.',
      ordered: false,
      items: [
        <>Edit the <code>.highlight</code> rule and press RUN.</>,
        <>Change one property in the <code>#special-note</code> rule.</>,
        <>Observe which element uses the class and which uses the ID.</>,
        <>Try one more small change and compare the page.</>,
      ],
      tip: <>Tip: A class can be reused. An ID usually styles one special element.</>,
    };
  }

  if (lessonId === 'lesson5') {
    return {
      title: 'Hint',
      intro: 'Start by increasing the padding, then try changing the border and margin.',
      ordered: false,
      items: [
        <>Edit the <code>padding</code> value and press RUN.</>,
        <>Change the <code>border</code> to make the box stand out more.</>,
        <>Increase or decrease the <code>margin</code>.</>,
        <>Observe how the box changes inside and outside.</>,
      ],
      tip: <>Tip: Padding adds space inside the box. Margin adds space outside it.</>,
    };
  }

  if (lessonId === 'lesson6') {
    return {
      title: 'Hint',
      intro: 'Start by changing the width of the box, then adjust the spacing around it.',
      ordered: false,
      items: [
        <>Edit the <code>width</code> value and press RUN.</>,
        <>Increase the <code>padding</code> to give the content more space.</>,
        <>Change the <code>margin</code> to move the box away from other elements.</>,
        <>Observe how the layout changes.</>,
      ],
      tip: <>Tip: Width controls size. Margin and padding control spacing.</>,
    };
  }

  if (lessonId === 'lesson7') {
    return {
      title: 'Hint',
      intro: 'Start by turning the container into a flex container.',
      ordered: false,
      items: [
        <>Add or edit <code>display: flex</code> and press RUN.</>,
        <>Change <code>flex-direction</code> between <code>row</code> and <code>column</code>.</>,
        <>Try <code>justify-content: center</code>.</>,
        <>Observe how the layout changes.</>,
      ],
      tip: <>Tip: Flexbox arranges elements inside a container.</>,
    };
  }

  if (lessonId === 'lesson8') {
    return {
      title: 'Hint',
      intro: 'Start by changing the button color, then test the hover style.',
      ordered: false,
      items: [
        <>Edit the button <code>background-color</code> and press RUN.</>,
        <>Change the text <code>color</code> if you want better contrast.</>,
        <>Adjust the <code>padding</code> or <code>border-radius</code>.</>,
        <>Edit the <code>:hover</code> background color and move your mouse over the button.</>,
      ],
      tip: <>Tip: <code>:hover</code> changes the style when the mouse is over the button.</>,
    };
  }

  if (lessonId === 'lesson9') {
    return {
      title: 'Hint',
      intro: 'Start by turning the container into a grid, then change the column layout.',
      ordered: false,
      items: [
        <>Add or edit <code>display: grid</code> and press RUN.</>,
        <>Change <code>grid-template-columns</code> to see how many columns appear.</>,
        <>Adjust the <code>gap</code> value to change the spacing.</>,
        <>Observe how the boxes move into a neat layout.</>,
      ],
      tip: <>Tip: Grid helps arrange items into rows and columns.</>,
    };
  }

  if (lessonId === 'lesson10') {
    return {
      title: 'Hint',
      intro: 'This lesson is about combining what you already know.',
      ordered: false,
      items: [
        <>Change the background color or text color.</>,
        <>Adjust the spacing inside the card.</>,
        <>Edit the button style or hover color.</>,
        <>Try changing one part of the layout and observe the result.</>,
      ],
      tip: <>Tip: Small CSS changes can make the whole page feel different.</>,
    };
  }

  return null;
}

function getJavascriptTryMode(lessonNumber) {
  if (lessonNumber === 9) return 'console+preview';
  if (lessonNumber === 10) return 'preview';
  return 'console';
}

function getJavascriptTryHint(lessonId) {
  const lessonNumber = getLessonNumber(lessonId);
  const mode = getJavascriptTryMode(lessonNumber);

  if (lessonNumber === 1) {
    return {
      title: 'Hint',
      intro: 'Start by running the code to see your first JavaScript output.',
      ordered: false,
      items: [
        <>Press RUN and look at the Console Output panel.</>,
        <>Change the text inside the quotes.</>,
        <>Press RUN again to see the new output.</>,
      ],
      tip: <>Tip: <code>console.log()</code> prints messages to the console.</>,
    };
  }

  if (lessonNumber === 2) {
    return {
      title: 'Hint',
      intro: 'Start by changing one variable value, then press RUN.',
      ordered: false,
      items: [
        <>Edit the text stored in the <code>name</code> variable.</>,
        <>Change the number in the <code>age</code> variable.</>,
        <>Try changing the boolean value from <code>true</code> to <code>false</code>.</>,
        <>Press RUN and observe the Console Output.</>,
      ],
      tip: <>Tip: A variable stores a value that JavaScript can use later.</>,
    };
  }

  if (lessonNumber === 3) {
    return {
      title: 'Hint',
      intro: 'Start by changing the numbers, then press RUN.',
      ordered: false,
      items: [
        <>Change the numbers in the addition example.</>,
        <>Try using different operators like <code>+</code> or <code>*</code>.</>,
        <>Modify the comparison to see when it returns <code>true</code> or <code>false</code>.</>,
        <>Press RUN and observe the Console Output.</>,
      ],
      tip: <>Tip: Operators allow JavaScript to calculate values and compare them.</>,
    };
  }

  if (lessonNumber === 4) {
    return {
      title: 'Hint',
      intro: 'Start by changing the value being checked, then press RUN.',
      ordered: false,
      items: [
        <>Edit the value in the variable.</>,
        <>Press RUN and see which message appears.</>,
        <>Try a different value so the <code>else</code> block runs.</>,
        <>If there is an <code>else if</code>, test that too.</>,
      ],
      tip: <>Tip: Conditionals help JavaScript choose between different results.</>,
    };
  }

  if (lessonNumber === 5) {
    return {
      title: 'Hint',
      intro: 'Start by changing the loop values, then press RUN.',
      ordered: false,
      items: [
        <>Change the number where the loop starts.</>,
        <>Change the number where the loop stops.</>,
        <>Try printing a different message inside the loop.</>,
        <>Press RUN and observe the Console Output.</>,
      ],
      tip: <>Tip: Loops repeat the same code multiple times.</>,
    };
  }

  if (lessonNumber === 6) {
    return {
      title: 'Hint',
      intro: 'Start by running the function, then experiment with it.',
      ordered: false,
      items: [
        <>Change the name inside the function call.</>,
        <>Call the function multiple times.</>,
        <>Try editing the message inside the function.</>,
        <>Press RUN and observe the Console Output.</>,
      ],
      tip: <>Tip: Functions let you reuse the same code many times.</>,
    };
  }

  if (lessonNumber === 7) {
    return {
      title: 'Hint',
      intro: 'Start by exploring the array values.',
      ordered: false,
      items: [
        <>Change the items inside the array.</>,
        <>Try accessing a different index like <code>[1]</code> or <code>[2]</code>.</>,
        <>Modify one of the array values.</>,
        <>Press RUN and observe the Console Output.</>,
      ],
      tip: <>Tip: Arrays store multiple values inside one variable.</>,
    };
  }

  if (lessonNumber === 8) {
    return {
      title: 'Hint',
      intro: 'Start by exploring the object values.',
      ordered: false,
      items: [
        <>Change one of the object properties.</>,
        <>Try printing a different property using <code>console.log()</code>.</>,
        <>Modify the age or job value.</>,
        <>Press RUN and observe the Console Output.</>,
      ],
      tip: <>Tip: Objects help organize related information together.</>,
    };
  }

  if (lessonNumber === 9) {
    return {
      title: 'Hint',
      intro: 'Start by running the code.',
      ordered: false,
      items: [
        <>Press RUN and watch the page preview change.</>,
        <>Change the text inside the quotes.</>,
        <>Press RUN again to update the page.</>,
        <>Check the Console Output to see messages from the script.</>,
      ],
      tip: <>Tip: JavaScript can change webpage content using the DOM.</>,
    };
  }

  if (lessonNumber === 10) {
    return {
      title: 'Hint',
      intro: 'Start by clicking the button in the preview.',
      ordered: false,
      items: [
        <>Press RUN to load the page.</>,
        <>Click the button in the preview.</>,
        <>Watch how the text changes.</>,
        <>Try editing the message inside the code.</>,
        <>Press RUN again and test it.</>,
      ],
      tip: <>Tip: JavaScript can react to user actions using events.</>,
    };
  }

  if (mode === 'console') {
    return {
      title: 'Hint',
      intro: 'Use RUN to execute your JavaScript and read the result in Console Output.',
      ordered: false,
      items: [
        <>Write one small change in the editor, then press RUN.</>,
        <>Use <code>console.log()</code> to print values and follow your program flow.</>,
        <>If your code fails, read the error line in Console Output and fix one issue at a time.</>,
      ],
      tip: <>Tip: Use clear logs like <code>console.log("score:", score)</code> while learning logic.</>,
    };
  }

  if (mode === 'console+preview') {
    return {
      title: 'Hint',
      intro: 'This lesson is a transition: check logic in Console Output and DOM changes in Preview.',
      ordered: false,
      items: [
        <>Use <code>console.log()</code> to confirm values and steps.</>,
        <>Use DOM methods like <code>document.getElementById()</code> to select and update elements.</>,
        <>Press RUN after each small edit and compare Console Output with Preview changes.</>,
      ],
      tip: <>Tip: Keep one log line near each DOM change while you debug.</>,
    };
  }

  return {
    title: 'Hint',
    intro: 'Focus on page interaction in Preview for this lesson.',
    ordered: false,
    items: [
      <>Attach event handlers like <code>addEventListener("click", ...)</code>.</>,
      <>Update text, classes, or styles after user actions.</>,
      <>Press RUN to reload your script, then test the interaction in Preview.</>,
    ],
    tip: <>Tip: Build one interaction at a time and test immediately after each change.</>,
  };
}

function TryHintTextOnly({ hint, onDismissed }) {
  const ListTag = hint.ordered ? 'ol' : 'ul';

  useEffect(() => {
    if (typeof onDismissed === 'function') {
      onDismissed();
    }
  }, [hint, onDismissed]);

  return (
    <div id="try-hint" className="sl-try-hint-text">
      <div id="try-hint-text" className="sl-try-hint">
        <div className="sl-try-hintHeader">
          <div className="sl-try-hintTitle">{hint.title}</div>
        </div>
        <p>{hint.intro}</p>
        <ListTag>
          {hint.items.map((item, index) => (
            <li key={`${hint.title}-${index + 1}`}>{item}</li>
          ))}
        </ListTag>
        <p>{hint.tip}</p>
      </div>
    </div>
  );
}

function TryHint({ hint, onDismissed }) {
  const inlineSlotRef = useRef(null);
  const overlayRef = useRef(null);
  const textRef = useRef(null);
  const videoRef = useRef(null);
  const demoSlotRef = useRef(null);
  const [overlayTextNode, setOverlayTextNode] = useState(null);
  const [overlayVideoNode, setOverlayVideoNode] = useState(null);
  const [inlineTextNode, setInlineTextNode] = useState(null);
  const [inlineVideoNode, setInlineVideoNode] = useState(null);
  const [demoSlotNode, setDemoSlotNode] = useState(null);
  const [inlineNode, setInlineNode] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [textTarget, setTextTarget] = useState('overlay');
  const [videoTarget, setVideoTarget] = useState('overlay');
  const [desktopSplitActive, setDesktopSplitActive] = useState(false);
  const [videoRevealActive, setVideoRevealActive] = useState(false);
  const ListTag = hint.ordered ? 'ol' : 'ul';
  const textPortalContainer = textTarget === 'overlay' && overlayVisible ? overlayTextNode : inlineTextNode;
  const videoPortalContainer =
    videoTarget === 'overlay' && overlayVisible
      ? overlayVideoNode
      : videoTarget === 'slot'
        ? demoSlotNode
        : inlineVideoNode;
  const canPortalText = Boolean(textPortalContainer);
  const canPortalVideo = Boolean(videoPortalContainer);

  const setOverlayTextRef = useCallback((node) => {
    setOverlayTextNode((prev) => (prev === node ? prev : node));
  }, []);
  const setOverlayVideoRef = useCallback((node) => {
    setOverlayVideoNode((prev) => (prev === node ? prev : node));
  }, []);
  const setInlineRef = useCallback((node) => {
    inlineSlotRef.current = node;
    setInlineNode((prev) => (prev === node ? prev : node));
  }, []);
  const setInlineTextRef = useCallback((node) => {
    setInlineTextNode((prev) => (prev === node ? prev : node));
  }, []);
  const setInlineVideoRef = useCallback((node) => {
    setInlineVideoNode((prev) => (prev === node ? prev : node));
  }, []);
  const setDemoSlotRef = useCallback((node) => {
    demoSlotRef.current = node;
    setDemoSlotNode((prev) => (prev === node ? prev : node));
  }, []);

  useEffect(() => {
    setOverlayVisible(true);
    setIsClosing(false);
    setTextTarget('overlay');
    setVideoTarget('overlay');
    setDesktopSplitActive(false);
    setVideoRevealActive(false);
  }, [hint]);

  const onClose = () => {
    if (!textRef.current || !videoRef.current || !inlineNode || !overlayRef.current) {
      setOverlayVisible(false);
      return;
    }

    const textEl = textRef.current;
    const textStart = textEl.getBoundingClientRect();
    const videoStart = videoRef.current.getBoundingClientRect();
    const overlay = overlayRef.current;
    const inlineSlot = inlineNode;
    const shouldSplitDesktop =
      typeof window !== 'undefined'
      && window.matchMedia('(min-width: 1200px)').matches
      && Boolean(demoSlotNode);

    inlineSlot.style.minHeight = `${textStart.height + (shouldSplitDesktop ? 0 : videoStart.height)}px`;
    if (shouldSplitDesktop && demoSlotNode) {
      demoSlotNode.style.minHeight = `${videoStart.height}px`;
      demoSlotNode.classList.add('is-active');
      setDesktopSplitActive(true);
    }

    overlay.classList.add('hint-closing');
    setIsClosing(true);
    setTextTarget('inline');
    setVideoTarget(shouldSplitDesktop ? 'slot' : 'inline');
    setVideoRevealActive(false);

    if (shouldSplitDesktop && demoSlotNode) {
      const triggerVideoReveal = () => {
        if (!videoRef.current || videoRef.current.parentElement !== demoSlotNode) {
          window.requestAnimationFrame(triggerVideoReveal);
          return;
        }
        void videoRef.current.getBoundingClientRect();
        void demoSlotNode.getBoundingClientRect();
        window.requestAnimationFrame(() => {
          setVideoRevealActive(true);
        });
      };
      window.requestAnimationFrame(triggerVideoReveal);
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (!textRef.current || !videoRef.current) {
          setOverlayVisible(false);
          setIsClosing(false);
          return;
        }

        const movedTextEl = textRef.current;
        const textEnd = movedTextEl.getBoundingClientRect();
        const textDx = textStart.left - textEnd.left;
        const textDy = textStart.top - textEnd.top;
        const textSx = textEnd.width > 0 ? textStart.width / textEnd.width : 1;
        const textSy = textEnd.height > 0 ? textStart.height / textEnd.height : 1;

        const textAnim = movedTextEl.animate(
          [
            { transform: `translate(${textDx}px, ${textDy}px) scale(${textSx}, ${textSy})` },
            { transform: 'translate(0, 0) scale(1, 1)' },
          ],
          {
            duration: 420,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'both',
          },
        );

        let doneCount = 0;
        const finish = () => {
          doneCount += 1;
          if (doneCount < 2) return;
          inlineSlot.style.minHeight = '';
          if (demoSlotNode) {
            demoSlotNode.style.minHeight = '';
          }
          overlay.classList.remove('hint-closing');
          setIsClosing(false);
          setOverlayVisible(false);
          if (!shouldSplitDesktop) {
            setDesktopSplitActive(false);
          }
          if (typeof onDismissed === 'function') {
            onDismissed();
          }
        };
        textAnim.onfinish = finish;

        finish();
      });
    });
  };

  const textContent = (
    <div id="try-hint-text" ref={textRef} className="sl-try-hint">
      <div className="sl-try-hintHeader">
        <div className="sl-try-hintTitle">{hint.title}</div>
        {overlayVisible ? (
          <button id="hint-close" type="button" className="sl-try-hintClose" onClick={onClose}>
            Got it
          </button>
        ) : null}
      </div>
      <p>{hint.intro}</p>
      <ListTag>
        {hint.items.map((item, index) => (
          <li key={`${hint.title}-${index + 1}`}>{item}</li>
        ))}
      </ListTag>
      <p>{hint.tip}</p>
    </div>
  );

  const videoContent = (
    <div id="try-hint-videoWrap" ref={videoRef} className={`sl-hint-demo${videoRevealActive ? ' sl-demo-reveal' : ''}`}>
      <video
        className="sl-hint-demo-video"
        src="/demos/Demo.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    </div>
  );

  return (
    <>
      {overlayVisible ? (
        <div id="hint-overlay" ref={overlayRef} className={isClosing ? 'hint-closing' : ''} aria-hidden="true">
          <div id="hint-modal">
            <div id="try-hint-modal-content">
              <div id="try-hint-modal-text" ref={setOverlayTextRef} />
              <div id="try-hint-modal-video" ref={setOverlayVideoRef} />
            </div>
          </div>
        </div>
      ) : null}
      <div className="sl-try-layout sl-try-topRow">
        <div id="try-hint" className="sl-try-col sl-try-hint-text" ref={setInlineRef} style={overlayVisible && !isClosing ? { visibility: 'hidden' } : undefined}>
          <div id="try-hint-inline-text" ref={setInlineTextRef} />
          <div id="try-hint-inline-video" ref={setInlineVideoRef} />
        </div>
        <div
          id="try-hint-demo-slot"
          className={`sl-hint-demo-slot sl-try-col sl-try-hint-video${desktopSplitActive ? ' is-active' : ''}`}
          aria-hidden="true"
          ref={setDemoSlotRef}
        />
      </div>
      {canPortalText ? createPortal(textContent, textPortalContainer) : null}
      {canPortalVideo ? createPortal(videoContent, videoPortalContainer) : null}
    </>
  );
}

export default function TryPage({ course = 'html', lessonId = 'lesson1' }) {
  const runButtonRef = useRef(null);
  const editorContainerRef = useRef(null);
  const runStartTimeoutRef = useRef(null);
  const runGuideTimeoutRef = useRef(null);
  const editorGuideTimeoutRef = useRef(null);
  const lessonNumber = getLessonNumber(lessonId);
  const isCse = course === 'cse';
  const isJavascript = course === 'javascript';
  const javascriptMode = useMemo(
    () => (isJavascript ? getJavascriptTryMode(lessonNumber) : null),
    [isJavascript, lessonNumber],
  );
  const tryHint = useMemo(() => {
    if (course === 'html') return getHtmlTryHint(lessonId);
    if (course === 'css') return getCssTryHint(lessonId);
    if (course === 'javascript') return getJavascriptTryHint(lessonId);
    return null;
  }, [course, lessonId]);
  const cseScenario = useMemo(() => getCseScenario(lessonId), [lessonId]);
  const cseStepConfig = useMemo(() => (isCse ? cseScenario.steps : []), [isCse, cseScenario]);
  const totalCseSteps = cseStepConfig.length;
  const initialCode = useMemo(() => getTryStarter(course, lessonId), [course, lessonId]);
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState(initialCode);
  const [runToken, setRunToken] = useState(0);
  const [hasRun, setHasRun] = useState(false);
  const [runHover, setRunHover] = useState(false);
  const [backHover, setBackHover] = useState(false);
  const [cseStep, setCseStep] = useState(1);
  const [cseChoices, setCseChoices] = useState(() => buildCseChoices(cseStepConfig));
  const [cseSubmittedChoices, setCseSubmittedChoices] = useState(null);
  const [cseSubmittedOutcome, setCseSubmittedOutcome] = useState(null);
  const outputDoc = useMemo(
    () => (isJavascript ? '' : buildOutputDoc(course, output)),
    [isJavascript, course, output],
  );
  const editorInputWrapResolvedStyle = useMemo(() => {
    if (!isJavascript) return editorInputWrapStyle;
    return {
      ...editorInputWrapStyle,
      minHeight: 0,
      maxHeight: '100%',
      height: '100%',
      flex: '1 1 auto',
      overflow: 'hidden',
    };
  }, [isJavascript]);
  const editorBodyResolvedStyle = useMemo(() => {
    if (!isJavascript) return editorBodyStyle;
    return {
      ...editorBodyStyle,
      height: 'calc(100% - 34px)',
      maxHeight: 'calc(100% - 34px)',
    };
  }, [isJavascript]);
  const editorPanelResolvedStyle = useMemo(() => {
    if (!isJavascript) return editorShellStyle;
    return {
      ...editorShellStyle,
      height: 'clamp(340px, 50vh, 430px)',
      minHeight: '340px',
    };
  }, [isJavascript]);
  const label = courseLabel(course);
  const lessonMeta = useMemo(() => getLessonMeta(course, lessonNumber), [course, lessonNumber]);
  const lessonTitle = lessonMeta.title;
  const lesson = useMemo(() => getLesson(course, lessonId), [course, lessonId]);
  const backPath = lesson?.permalink || `/${course}/lesson${lessonNumber}`;
  const codeMirrorMode = useMemo(() => codeMirrorModeForCourse(course), [course]);
  const codeMirrorOptions = useMemo(
    () => ({
      mode: codeMirrorMode,
      theme: 'material-darker',
      lineNumbers: true,
      lineWrapping: false,
      smartIndent: true,
      indentUnit: 2,
      tabSize: 2,
      autofocus: false,
      viewportMargin: isJavascript ? 20 : Infinity,
      extraKeys: {
        Tab: (cm) => cm.replaceSelection('  ', 'end'),
      },
    }),
    [codeMirrorMode, isJavascript],
  );

  useEffect(() => {
    setCode(initialCode);
    setOutput(initialCode);
    setRunToken(0);
    setHasRun(false);
  }, [initialCode]);

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

  useEffect(
    () => () => {
      if (runGuideTimeoutRef.current) {
        window.clearTimeout(runGuideTimeoutRef.current);
      }
      if (editorGuideTimeoutRef.current) {
        window.clearTimeout(editorGuideTimeoutRef.current);
      }
      if (runStartTimeoutRef.current) {
        window.clearTimeout(runStartTimeoutRef.current);
      }
    },
    [],
  );

  const triggerHintGuidance = useCallback(() => {
    const runBtn = runButtonRef.current;
    const editor = editorContainerRef.current;

    if (editor) {
      editor.classList.remove('editor-pulse');
      void editor.offsetWidth;
      editor.classList.add('editor-pulse');
      if (editorGuideTimeoutRef.current) {
        window.clearTimeout(editorGuideTimeoutRef.current);
      }
      editorGuideTimeoutRef.current = window.setTimeout(() => {
        editor.classList.remove('editor-pulse');
      }, 2800);
    }

    if (runStartTimeoutRef.current) {
      window.clearTimeout(runStartTimeoutRef.current);
    }
    runStartTimeoutRef.current = window.setTimeout(() => {
      const latestRunBtn = runButtonRef.current;
      if (!latestRunBtn) return;
      latestRunBtn.classList.remove('run-highlight');
      void latestRunBtn.offsetWidth;
      latestRunBtn.classList.add('run-highlight');
      if (runGuideTimeoutRef.current) {
        window.clearTimeout(runGuideTimeoutRef.current);
      }
      runGuideTimeoutRef.current = window.setTimeout(() => {
        latestRunBtn.classList.remove('run-highlight');
      }, 2300);
    }, 2800);
  }, []);

  const cseChoicesChangedAfterSubmit = useMemo(() => {
    if (!isCse || !cseSubmittedChoices) return false;
    return JSON.stringify(cseChoices) !== JSON.stringify(cseSubmittedChoices);
  }, [isCse, cseChoices, cseSubmittedChoices]);

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
      <div className="sl-try-page">
        <h1 className="sl-try-title">{`${label} Lesson ${lessonNumber}: ${lessonTitle} - Try It Yourself`}</h1>
        <LandscapeTip />
        {tryHint ? (
          isJavascript
            ? <TryHintTextOnly hint={tryHint} onDismissed={triggerHintGuidance} />
            : <TryHint hint={tryHint} onDismissed={triggerHintGuidance} />
        ) : null}

        <div
          className="sl-try-layout"
          style={isJavascript ? { display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem' } : undefined}
        >
          <div className="sl-try-col" style={isJavascript ? { display: 'flex', flexDirection: 'column', gap: '10px' } : undefined}>
            <div
              ref={editorContainerRef}
              style={editorPanelResolvedStyle}
              className={`sl-try-panel${isJavascript ? '' : ' sl-try-editor-panel'} editor-container`}
            >
              <div
                className={isJavascript ? 'sl-js-editor-shell' : undefined}
                style={isJavascript ? { display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 } : undefined}
              >
                <div style={panelHeaderStyle}>{isCse ? 'Scenario' : 'Editor'}</div>
                <div style={editorBodyResolvedStyle} className="sl-try-editorBody">
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
                    <>
                      <div style={editorInputWrapResolvedStyle} className="sl-try-editorRoot sl-try-editorInputWrap">
                        <TryCodeEditor
                          value={code}
                          options={codeMirrorOptions}
                          onBeforeChange={(_editor, _data, value) => {
                            setCode(value);
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              {!isJavascript ? (
                <div
                  style={editorFooterStyle}
                  className={`sl-try-actions sl-try-editorFooter${!isCse && course === 'css' ? ' sl-try-actions-css' : ''}`}
                >
                  {isCse ? (
                    <button
                      onClick={onResetCse}
                      className="sl-try-action-btn"
                      style={{
                        ...buttonBase,
                        ...primaryButtonStyle,
                      }}
                    >
                      Reset
                    </button>
                  ) : (
                    <button
                      ref={runButtonRef}
                      onClick={() => {
                        setOutput(code);
                        if (isJavascript) {
                          setHasRun(true);
                          setRunToken((prev) => prev + 1);
                        }
                      }}
                      onMouseEnter={() => setRunHover(true)}
                      onMouseLeave={() => setRunHover(false)}
                      className="sl-try-action-btn sl-try-action-primary run-button"
                      style={{
                        ...buttonBase,
                        ...primaryButtonStyle,
                        backgroundColor: runHover ? '#93f6c1' : 'var(--sl-accent)',
                      }}
                    >
                      RUN
                    </button>
                  )}
                  {!isCse && course === 'css' ? <ColorPaletteTool /> : null}
                  <Link
                    to={backPath}
                    onMouseEnter={() => setBackHover(true)}
                    onMouseLeave={() => setBackHover(false)}
                    className="sl-try-action-btn"
                      style={{
                        ...buttonBase,
                        ...ghostButtonStyle,
                        backgroundColor: backHover ? 'rgba(226, 238, 251, 0.08)' : 'transparent',
                      }}
                    >
                    {`Back to Lesson ${lessonNumber}`}
                  </Link>
                </div>
              ) : null}
            </div>
            {!isCse && isJavascript ? (
              <div style={jsRunBlockStyle} className="sl-try-actions">
                <button
                  ref={runButtonRef}
                  onClick={() => {
                    setOutput(code);
                    setHasRun(true);
                    setRunToken((prev) => prev + 1);
                  }}
                  onMouseEnter={() => setRunHover(true)}
                  onMouseLeave={() => setRunHover(false)}
                  className="sl-try-action-btn sl-try-action-primary run-button"
                  style={{
                    ...buttonBase,
                    ...primaryButtonStyle,
                    backgroundColor: runHover ? '#93f6c1' : 'var(--sl-accent)',
                  }}
                >
                  RUN
                </button>
              </div>
            ) : null}
          </div>

          <div className="sl-try-col">
            {isJavascript ? (
              <JavascriptTryWorkspace
                mode={javascriptMode}
                source={output}
                runToken={runToken}
                hasRun={hasRun}
                lessonNumber={lessonNumber}
                outputPanelStyle={outputPanelStyle}
                panelHeaderStyle={panelHeaderStyle}
                outputBodyStyle={outputBodyStyle}
                frameStyle={frameStyle}
              />
            ) : (
              <div style={{ ...outputPanelStyle, display: 'flex', flexDirection: 'column' }} className="sl-try-panel sl-try-preview-panel">
                <div style={panelHeaderStyle}>{isCse ? 'Outcome' : 'Preview'}</div>
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
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sl-try-back-wrap">
          <Link to={backPath} className="sl-btn-ghost sl-try-back-btn">Go back to lesson</Link>
        </div>
      </div>
    </Layout>
  );
}

