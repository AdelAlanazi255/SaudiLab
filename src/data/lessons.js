const htmlTitles = [
  'Introduction to HTML',
  'Headings and Paragraphs',
  'Text Formatting',
  'Links',
  'Images',
  'Lists',
  'Tables',
  'Forms Basics',
  'Form inputs',
  'Semantic Layout',
];

const cssTitles = [
  'Introduction to CSS',
  'Selectors and Text',
  'Box Model',
  'Backgrounds and Borders',
  'Flexbox Basics',
  'Spacing and Sizing',
  'Buttons and Hover',
  'Form Styling',
  'Grid Basics',
  'Mini Page Layout',
];

const javascriptTitles = [
  'Introduction to JavaScript',
  'Variables and Data Types',
  'Operators and Expressions',
  'Conditionals',
  'Loops',
  'Functions Basics',
  'Arrays',
  'Objects',
  'DOM Basics',
  'Events and Interaction',
];

const cseTitles = [
  'Protecting Your First Account',
  'Strong Passwords & Password Managers',
  'Multi-Factor Authentication (2FA)',
  'Phishing & Suspicious Messages',
  'Safe Downloads & Malware Basics',
  'Device Updates & Patch Basics',
  'Public Wi-Fi & Secure Browsing',
  'Privacy & Permissions (Apps/Browser)',
  'Backups & Account Recovery',
  'Putting It Together (Everyday Security Checklist)',
];

const cryptoTitles = [
  'What Cryptography Is',
  'Encoding vs Encryption vs Hashing',
  'Classic Cipher: Caesar',
  'Classic Cipher: Vigenere',
  'Hashing (SHA-256) and Avalanche Effect',
  'Salts and Password Hashing',
  'HMAC for Integrity and Authenticity',
  'AES-GCM Symmetric Encryption',
  'Public-Key Basics (RSA-OAEP)',
  'Key Exchange Concept (ECDH)',
  'Real-World Patterns: TLS and Common Mistakes',
];

const webSecurityTitles = [
  'What Web Security Means',
  'How Websites Are Attacked (Conceptual)',
  'Input Validation Basics',
  'XSS (Cross-Site Scripting) Concepts',
  'Authentication vs Authorization',
  'Session Security Basics',
  'HTTPS and Secure Connections',
  'Secure Forms and User Input',
  'Common Developer Security Mistakes',
  'Secure Website Checklist',
];

const networkBasicsTitles = [
  'What is a Network?',
  'IP Addresses Basics',
  'DNS Explained Simply',
  'How Data Travels Across the Internet',
  'HTTP vs HTTPS',
  'Ports and Services (Concept Level)',
  'Routers, Switches, and Firewalls',
  'WiFi vs Wired Connections',
  'Common Network Problems',
  'Network Basics Summary',
];

const ethicsTitles = [
  'Why Ethics Matters in Cyber Security',
  'Legal vs Illegal (Clear Boundaries)',
  'Authorization & Scope (The #1 Rule)',
  'Responsible Disclosure Basics',
  'Privacy, Consent, and Data Responsibility',
  'Security Research vs "Hacking" Myths',
  'Safe Learning: Labs, Simulations, and What Not To Do',
  'Real-World Case Studies (Simplified)',
  'Security Mindset: Attacker vs Defender Thinking',
  'Personal Code of Conduct + Next Steps',
];

const pcsTitles = [
  'Account Security Basics',
  'Passwords & Password Managers',
  'Multi-Factor Authentication',
  'Spotting Phishing (Email/SMS)',
  'Social Engineering Basics',
  'Safe Downloads & Extensions',
  'Mobile Security Basics',
  'Public Wi-Fi & VPN Concepts',
  'Privacy Settings Checklist',
  'Backups & Recovery Mindset',
  'Safe Browsing Habits',
  'Personal Security Routine (Daily/Weekly)',
];

const kaliToolsTitles = [
  'Kali Linux Overview',
  'Terminal Basics for Security',
  'Nmap Concept',
  'Burp Suite Concept',
  'Wireshark Basics',
  'Password Attacks Concept',
  'Metasploit Concept',
  'Recon & OSINT Mindset',
  'Putting Tools Together',
  'Ethics & Legal Reminder',
];

const forensicsTitles = [
  'What Digital Forensics Is',
  'Evidence & Chain of Custody',
  'Logs & Traces',
  'Metadata Basics',
  'Timelines',
  'Browser Artifacts',
  'File Integrity & Hashes',
  'Incident Investigation Flow',
  'Fictional Case Walkthrough',
  'Common Mistakes & Best Practices',
];

const blueteamTitles = [
  'What Blue Team Is',
  'Defense-in-Depth',
  'Monitoring Basics',
  'Logs 101',
  'Alerts & Triage',
  'False Positives vs True Positives',
  'Incident Response Flow',
  'Basic Hardening Concepts',
  'Backups & Recovery',
  'Post-Incident Learnings',
];

const careerTitles = [
  'What Cyber Security Careers Are',
  'Major Tracks Overview',
  'Blue Team / SOC Path',
  'Red Team vs AppSec',
  'Digital Forensics Path',
  'GRC Path',
  'Skills Map',
  'Building a Beginner Portfolio',
  'Certifications Explained Simply',
  'Realistic Roadmap + Common Mistakes',
];

function buildLessons(course, titles) {
  return titles.map((title, i) => {
    const n = i + 1;
    return {
      course,
      n,
      lessonId: `lesson${n}`,
      title,
    };
  });
}

function buildCseLessons(titles) {
  return titles.map((title, i) => {
    const n = i + 1;
    return {
      course: 'cse',
      n,
      lessonId: `cse_lesson${n}`,
      routeId: `lesson${n}`,
      title,
    };
  });
}

export const htmlLessons = buildLessons('html', htmlTitles);
export const cssLessons = buildLessons('css', cssTitles);
export const javascriptLessons = buildLessons('javascript', javascriptTitles);
export const cseLessons = buildCseLessons(cseTitles);
export const cryptoLessons = buildLessons('crypto', cryptoTitles);
export const webSecurityLessons = buildLessons('websecurity', webSecurityTitles);
export const networkBasicsLessons = buildLessons('networkbasics', networkBasicsTitles);
export const ethicsLessons = buildLessons('ethics', ethicsTitles);
export const pcsLessons = buildLessons('pcs', pcsTitles);
export const kaliToolsLessons = buildLessons('kalitools', kaliToolsTitles);
export const forensicsLessons = buildLessons('forensics', forensicsTitles);
export const blueteamLessons = buildLessons('blueteam', blueteamTitles);
export const careerLessons = buildLessons('career', careerTitles);

const byCourse = {
  html: htmlLessons,
  css: cssLessons,
  javascript: javascriptLessons,
  cse: cseLessons,
  crypto: cryptoLessons,
  websecurity: webSecurityLessons,
  networkbasics: networkBasicsLessons,
  ethics: ethicsLessons,
  pcs: pcsLessons,
  kalitools: kaliToolsLessons,
  forensics: forensicsLessons,
  blueteam: blueteamLessons,
  career: careerLessons,
};

export function getLessonMeta(course, n) {
  const key = String(course || '').toLowerCase();
  const num = Number(n);
  const list = byCourse[key];
  if (!list) {
    throw new Error(`Unknown course "${course}"`);
  }
  const lesson = list.find((item) => item.n === num);
  if (!lesson) {
    throw new Error(`Missing lesson metadata for ${key} lesson ${n}`);
  }
  return lesson;
}

export function getLessonMetaSafe(course, n) {
  try {
    return getLessonMeta(course, n);
  } catch {
    return null;
  }
}
