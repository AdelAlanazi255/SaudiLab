import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import LandscapeTip from '@site/src/components/LandscapeTip';
import { canAccessLesson, getLastUnlockedLessonPath } from '@site/src/utils/lessonAccess';
import { getLessonMeta } from '@site/src/data/lessons';
import { getLesson } from '@site/src/course/courseMap';
import {
  aesGcmDecrypt,
  aesGcmEncrypt,
  base64ToBytes,
  bytesToBase64,
  caesarEncrypt,
  deriveEcdhSharedBase64,
  generateRsaKeyPair,
  hmacSha256Hex,
  rsaDecryptBase64,
  rsaEncryptBase64,
  sha256Hex,
  utf8ToBytes,
  vigenereEncrypt,
} from '@site/src/utils/cryptoDemos';

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

const editorBodyStyle = { flex: 1, padding: '0.5rem' };
const outputBodyStyle = { flex: 1, padding: '0.5rem' };

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

const cryptoOutputBoxStyle = {
  background: 'var(--sl-editor-bg, #0b1220)',
  color: '#e5e7eb',
  border: '1px solid #2a2f36',
  borderRadius: '8px',
  padding: '0.75rem',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
  lineHeight: 1.5,
};

const outputLabelStyle = {
  margin: '0 0 0.4rem 0',
  color: '#9ca3af',
  fontSize: '0.85rem',
  fontWeight: 600,
};

const outputItemStyle = {
  marginBottom: '0.75rem',
};

const outputTextStyle = {
  margin: 0,
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

const inputStyle = {
  width: '100%',
  background: '#111827',
  color: '#e5e7eb',
  border: '1px solid #2a2f36',
  borderRadius: '8px',
  padding: '0.6rem',
  marginBottom: '0.6rem',
};

const caesarRowStyle = {
  ...cryptoOutputBoxStyle,
  display: 'grid',
  gridTemplateColumns: 'repeat(26, minmax(18px, 1fr))',
  gap: '0.2rem',
  alignItems: 'center',
  textAlign: 'center',
  fontSize: '0.82rem',
  padding: '0.5rem',
};

const caesarCellStyle = {
  padding: '0.2rem 0',
  borderRadius: '4px',
  border: '1px solid #2a2f36',
  background: '#0f1115',
};

const CAESAR_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function getLessonNumber(lessonId) {
  const m = String(lessonId || '').match(/(\d+)/);
  return m ? Number(m[1]) : NaN;
}

function vigenereDecrypt(text, key) {
  const k = String(key || '').toUpperCase().replace(/[^A-Z]/g, '');
  if (!k) return String(text || '');
  let i = 0;
  return String(text || '').replace(/[A-Z]/gi, (ch) => {
    const base = ch <= 'Z' ? 65 : 97;
    const shift = k.charCodeAt(i % k.length) - 65;
    i += 1;
    const code = ch.charCodeAt(0) - base;
    return String.fromCharCode(((code - shift + 26) % 26) + base);
  });
}

export default function CryptoLessonTry({ lessonId = 'lesson1' }) {
  const lessonNumber = getLessonNumber(lessonId);
  const lessonMeta = useMemo(() => getLessonMeta('crypto', lessonNumber), [lessonNumber]);
  const lesson = useMemo(() => getLesson('crypto', lessonId), [lessonId]);
  const backPath = lesson?.permalink || `/cryptography/lesson${lessonNumber}`;
  const [backHover, setBackHover] = useState(false);
  const [copyMsg, setCopyMsg] = useState('');

  const [l1Message, setL1Message] = useState('Meet me at 5 PM');
  const [l1Locked, setL1Locked] = useState(true);

  const [l2Text, setL2Text] = useState('Hello cryptography');
  const [l2Base64, setL2Base64] = useState('');
  const [l2Hash, setL2Hash] = useState('');

  const [l3Text, setL3Text] = useState('attack at dawn');
  const [l3Shift, setL3Shift] = useState(3);

  const [l4Text, setL4Text] = useState('defend the gate');
  const [l4Key, setL4Key] = useState('KEY');
  const [l4ShowSteps, setL4ShowSteps] = useState(false);

  const [l5Input, setL5Input] = useState('SaudiLab');
  const [l5HashA, setL5HashA] = useState('');
  const [l5HashB, setL5HashB] = useState('');

  const [l6Password, setL6Password] = useState('MyPass123!');
  const [l6SaltA, setL6SaltA] = useState('salt-alpha');
  const [l6SaltB, setL6SaltB] = useState('salt-beta');
  const [l6HashA, setL6HashA] = useState('');
  const [l6HashB, setL6HashB] = useState('');

  const [l7Message, setL7Message] = useState('Transfer approved');
  const [l7Secret, setL7Secret] = useState('shared-secret');
  const [l7Tag, setL7Tag] = useState('');
  const [l7VerifyMsg, setL7VerifyMsg] = useState('Transfer approved');
  const [l7VerifyResult, setL7VerifyResult] = useState('');

  const [l8Plain, setL8Plain] = useState('Confidential note');
  const [l8Secret, setL8Secret] = useState('strong-demo-key');
  const [l8Iv, setL8Iv] = useState('');
  const [l8Cipher, setL8Cipher] = useState('');
  const [l8Decrypted, setL8Decrypted] = useState('');

  const [l9Plain, setL9Plain] = useState('Public-key message');
  const [l9Cipher, setL9Cipher] = useState('');
  const [l9Decrypted, setL9Decrypted] = useState('');
  const [l9Keys, setL9Keys] = useState(null);

  const [l10Alice, setL10Alice] = useState('');
  const [l10Bob, setL10Bob] = useState('');
  const [l10Match, setL10Match] = useState(false);

  const [l11Checks, setL11Checks] = useState({
    reusePasswords: false,
    noMfa: false,
    openWifiSensitive: false,
    ignoreUpdates: false,
    clickUrgentLinks: false,
  });
  const [l11Result, setL11Result] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (canAccessLesson('crypto', lessonNumber)) return;
    window.location.replace(getLastUnlockedLessonPath('crypto') || '/cryptography/lesson1');
  }, [lessonNumber]);

  useEffect(() => {
    if (!l1Locked) return;
    setCopyMsg('');
  }, [l1Locked]);

  const l1Display = l1Locked ? '*'.repeat(Math.max(6, l1Message.length)) : l1Message;
  const l2Decoded = useMemo(() => {
    try {
      return l2Base64 ? new TextDecoder().decode(base64ToBytes(l2Base64)) : '';
    } catch {
      return 'Invalid Base64 input';
    }
  }, [l2Base64]);

  const l3ShiftNormalized = useMemo(() => {
    const parsed = Number.isFinite(l3Shift) ? l3Shift : 0;
    return ((parsed % 26) + 26) % 26;
  }, [l3Shift]);

  const l3ShiftedAlphabet = useMemo(
    () => `${CAESAR_ALPHABET.slice(l3ShiftNormalized)}${CAESAR_ALPHABET.slice(0, l3ShiftNormalized)}`,
    [l3ShiftNormalized],
  );

  const l3Cipher = useMemo(() => caesarEncrypt(l3Text, l3ShiftNormalized), [l3Text, l3ShiftNormalized]);
  const l3Decrypted = useMemo(() => caesarEncrypt(l3Text, -l3ShiftNormalized), [l3Text, l3ShiftNormalized]);

  const l4Cipher = useMemo(() => vigenereEncrypt(l4Text, l4Key), [l4Text, l4Key]);
  const l4Decrypted = useMemo(() => vigenereDecrypt(l4Cipher, l4Key), [l4Cipher, l4Key]);
  const l4AlignedKeyword = useMemo(() => {
    const cleanKey = String(l4Key || '').toUpperCase().replace(/[^A-Z]/g, '');
    if (!cleanKey) return '';
    let index = 0;
    return String(l4Text || '').replace(/[A-Z]/gi, () => {
      const ch = cleanKey[index % cleanKey.length];
      index += 1;
      return ch;
    });
  }, [l4Text, l4Key]);

  const l5Diff = useMemo(() => {
    if (!l5HashA || !l5HashB) return 0;
    let d = 0;
    for (let i = 0; i < Math.min(l5HashA.length, l5HashB.length); i += 1) {
      if (l5HashA[i] !== l5HashB[i]) d += 1;
    }
    return d;
  }, [l5HashA, l5HashB]);

  const doL2 = async () => {
    setL2Base64(bytesToBase64(utf8ToBytes(l2Text)));
    setL2Hash(await sha256Hex(l2Text));
  };

  const doL5 = async () => {
    setL5HashA(await sha256Hex(l5Input));
    setL5HashB(await sha256Hex(`${l5Input}!`));
  };

  const doL6 = async () => {
    setL6HashA(await sha256Hex(`${l6Password}:${l6SaltA}`));
    setL6HashB(await sha256Hex(`${l6Password}:${l6SaltB}`));
  };

  const doL7Sign = async () => {
    const tag = await hmacSha256Hex(l7Message, l7Secret);
    setL7Tag(tag);
    setL7VerifyMsg(l7Message);
    setL7VerifyResult('');
  };

  const doL7Verify = async () => {
    const expected = await hmacSha256Hex(l7VerifyMsg, l7Secret);
    setL7VerifyResult(expected === l7Tag ? 'Valid signature' : 'Invalid signature');
  };

  const doL8Encrypt = async () => {
    const out = await aesGcmEncrypt(l8Plain, l8Secret);
    setL8Iv(out.ivBase64);
    setL8Cipher(out.cipherBase64);
    setL8Decrypted('');
  };

  const doL8Decrypt = async () => {
    try {
      setL8Decrypted(await aesGcmDecrypt(l8Cipher, l8Iv, l8Secret));
    } catch {
      setL8Decrypted('Decryption failed. Check key or ciphertext.');
    }
  };

  const doL9Encrypt = async () => {
    const kp = l9Keys || (await generateRsaKeyPair());
    setL9Keys(kp);
    setL9Cipher(await rsaEncryptBase64(kp.publicKey, l9Plain));
    setL9Decrypted('');
  };

  const doL9Decrypt = async () => {
    try {
      if (!l9Keys || !l9Cipher) return;
      setL9Decrypted(await rsaDecryptBase64(l9Keys.privateKey, l9Cipher));
    } catch {
      setL9Decrypted('Decryption failed.');
    }
  };

  const doL10 = async () => {
    const out = await deriveEcdhSharedBase64();
    setL10Alice(out.aliceSecret);
    setL10Bob(out.bobSecret);
    setL10Match(out.match);
  };

  const doL11 = () => {
    const score =
      (l11Checks.reusePasswords ? 1 : 0) +
      (l11Checks.noMfa ? 1 : 0) +
      (l11Checks.openWifiSensitive ? 1 : 0) +
      (l11Checks.ignoreUpdates ? 1 : 0) +
      (l11Checks.clickUrgentLinks ? 1 : 0);
    if (score <= 1) setL11Result('Low Risk - Good security habits.');
    else if (score <= 3) setL11Result('Medium Risk - Improve a few daily habits.');
    else setL11Result('High Risk - Review core security basics and avoid risky shortcuts.');
  };

  const copyText = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopyMsg('Copied');
      setTimeout(() => setCopyMsg(''), 1200);
    } catch {
      setCopyMsg('Copy failed');
    }
  };

  const resetLesson = () => {
    setCopyMsg('');
    if (lessonNumber === 1) {
      setL1Message('Meet me at 5 PM');
      setL1Locked(true);
    } else if (lessonNumber === 2) {
      setL2Text('Hello cryptography');
      setL2Base64('');
      setL2Hash('');
    } else if (lessonNumber === 3) {
      setL3Text('attack at dawn');
      setL3Shift(3);
    } else if (lessonNumber === 4) {
      setL4Text('defend the gate');
      setL4Key('KEY');
      setL4ShowSteps(false);
    } else if (lessonNumber === 5) {
      setL5Input('SaudiLab');
      setL5HashA('');
      setL5HashB('');
    } else if (lessonNumber === 6) {
      setL6Password('MyPass123!');
      setL6SaltA('salt-alpha');
      setL6SaltB('salt-beta');
      setL6HashA('');
      setL6HashB('');
    } else if (lessonNumber === 7) {
      setL7Message('Transfer approved');
      setL7Secret('shared-secret');
      setL7Tag('');
      setL7VerifyMsg('Transfer approved');
      setL7VerifyResult('');
    } else if (lessonNumber === 8) {
      setL8Plain('Confidential note');
      setL8Secret('strong-demo-key');
      setL8Iv('');
      setL8Cipher('');
      setL8Decrypted('');
    } else if (lessonNumber === 9) {
      setL9Plain('Public-key message');
      setL9Cipher('');
      setL9Decrypted('');
      setL9Keys(null);
    } else if (lessonNumber === 10) {
      setL10Alice('');
      setL10Bob('');
      setL10Match(false);
    } else if (lessonNumber === 11) {
      setL11Checks({
        reusePasswords: false,
        noMfa: false,
        openWifiSensitive: false,
        ignoreUpdates: false,
        clickUrgentLinks: false,
      });
      setL11Result('');
    }
  };

  return (
    <Layout title={`Cryptography Lesson ${lessonNumber}: ${lessonMeta.title} - Try It Yourself`}>
      <div className="sl-try-page">
        <h1 className="sl-try-title">{`Cryptography Lesson ${lessonNumber}: ${lessonMeta.title} - Try It Yourself`}</h1>
        <LandscapeTip />
        <div className="sl-try-layout">
          <div className="sl-try-col">
            <div style={editorShellStyle} className="sl-try-panel sl-try-editor-panel">
              <div style={panelHeaderStyle}>Input</div>
              <div style={editorBodyStyle}>
                <div style={panelBodyStyle}>
                  {lessonNumber === 1 ? (
                    <>
                      <p style={{ marginTop: 0 }}>Type a message and switch between locked and unlocked states.</p>
                      <textarea rows={4} style={inputStyle} value={l1Message} onChange={(e) => setL1Message(e.target.value)} />
                      <label>
                        <input type="checkbox" checked={l1Locked} onChange={(e) => setL1Locked(e.target.checked)} /> Lock message
                      </label>
                    </>
                  ) : null}
                  {lessonNumber === 2 ? (
                    <>
                      <p style={{ marginTop: 0 }}>Compare Base64 encoding with hashing.</p>
                      <textarea rows={4} style={inputStyle} value={l2Text} onChange={(e) => setL2Text(e.target.value)} />
                      <button onClick={doL2} style={buttonBase}>Run Demo</button>
                    </>
                  ) : null}
                  {lessonNumber === 3 ? (
                    <>
                      <p style={{ marginTop: 0 }}>Encrypt or decrypt text with a Caesar shift key.</p>
                      <textarea rows={4} style={inputStyle} value={l3Text} onChange={(e) => setL3Text(e.target.value)} />
                      <input type="number" style={inputStyle} value={l3Shift} onChange={(e) => setL3Shift(Number(e.target.value || 0))} />
                      <p style={{ marginTop: 0, color: '#9ca3af', fontSize: '0.85rem' }}>
                        Shift key normalizes with mod 26 (example: 26 -&gt; 0, -1 -&gt; 25). Active shift: {l3ShiftNormalized}
                      </p>
                      <div style={outputItemStyle}>
                        <p style={outputLabelStyle}>Caesar Shift Visualizer</p>
                        <p style={{ marginTop: 0, marginBottom: '0.4rem', color: '#9ca3af', fontSize: '0.85rem' }}>Plain alphabet</p>
                        <div style={caesarRowStyle}>
                          {CAESAR_ALPHABET.split('').map((ch) => (
                            <span key={`plain-${ch}`} style={caesarCellStyle}>{ch}</span>
                          ))}
                        </div>
                        <p style={{ marginTop: '0.5rem', marginBottom: '0.4rem', color: '#9ca3af', fontSize: '0.85rem' }}>Shifted alphabet</p>
                        <div style={caesarRowStyle}>
                          {l3ShiftedAlphabet.split('').map((ch, index) => (
                            <span key={`shift-${index}-${ch}`} style={{ ...caesarCellStyle, ...(index === 0 ? { borderColor: '#fbbf24' } : {}) }}>{ch}</span>
                          ))}
                        </div>
                        <p style={{ margin: '0.6rem 0 0 0', color: '#cbd5e1', fontSize: '0.85rem' }}>
                          Each letter moves forward by the key. Example: A to D when key is 3.
                        </p>
                      </div>
                    </>
                  ) : null}
                  {lessonNumber === 4 ? (
                    <>
                      <p style={{ marginTop: 0 }}>Use a keyword to encrypt and decrypt with the Vigenere cipher.</p>
                      <textarea rows={4} style={inputStyle} value={l4Text} onChange={(e) => setL4Text(e.target.value)} />
                      <input type="text" style={inputStyle} value={l4Key} onChange={(e) => setL4Key(e.target.value)} placeholder="Keyword (letters only)" />
                      <label>
                        <input type="checkbox" checked={l4ShowSteps} onChange={(e) => setL4ShowSteps(e.target.checked)} /> Show steps
                      </label>
                    </>
                  ) : null}
                  {lessonNumber === 5 ? (
                    <>
                      <p style={{ marginTop: 0 }}>Hash a message and compare with a tiny change.</p>
                      <input type="text" style={inputStyle} value={l5Input} onChange={(e) => setL5Input(e.target.value)} />
                      <button onClick={doL5} style={buttonBase}>Hash Messages</button>
                    </>
                  ) : null}
                  {lessonNumber === 6 ? (
                    <>
                      <p style={{ marginTop: 0 }}>Same password with two salts produces different hashes.</p>
                      <input type="text" style={inputStyle} value={l6Password} onChange={(e) => setL6Password(e.target.value)} placeholder="Password" />
                      <input type="text" style={inputStyle} value={l6SaltA} onChange={(e) => setL6SaltA(e.target.value)} placeholder="Salt A" />
                      <input type="text" style={inputStyle} value={l6SaltB} onChange={(e) => setL6SaltB(e.target.value)} placeholder="Salt B" />
                      <button onClick={doL6} style={buttonBase}>Generate Hashes</button>
                    </>
                  ) : null}
                  {lessonNumber === 7 ? (
                    <>
                      <p style={{ marginTop: 0 }}>Generate and verify an HMAC for message integrity.</p>
                      <textarea rows={3} style={inputStyle} value={l7Message} onChange={(e) => setL7Message(e.target.value)} placeholder="Message" />
                      <input type="text" style={inputStyle} value={l7Secret} onChange={(e) => setL7Secret(e.target.value)} placeholder="Shared secret" />
                      <button onClick={doL7Sign} style={{ ...buttonBase, marginRight: '0.5rem' }}>Sign</button>
                      <button onClick={doL7Verify} style={buttonBase}>Verify</button>
                      <textarea rows={2} style={{ ...inputStyle, marginTop: '0.6rem' }} value={l7VerifyMsg} onChange={(e) => setL7VerifyMsg(e.target.value)} placeholder="Message to verify" />
                    </>
                  ) : null}
                  {lessonNumber === 8 ? (
                    <>
                      <p style={{ marginTop: 0 }}>Encrypt and decrypt with AES-GCM using a shared secret.</p>
                      <textarea rows={3} style={inputStyle} value={l8Plain} onChange={(e) => setL8Plain(e.target.value)} />
                      <input type="text" style={inputStyle} value={l8Secret} onChange={(e) => setL8Secret(e.target.value)} placeholder="Secret key phrase" />
                      <button onClick={doL8Encrypt} style={{ ...buttonBase, marginRight: '0.5rem' }}>Encrypt</button>
                      <button onClick={doL8Decrypt} style={buttonBase}>Decrypt</button>
                    </>
                  ) : null}
                  {lessonNumber === 9 ? (
                    <>
                      <p style={{ marginTop: 0 }}>Generate an RSA key pair and encrypt/decrypt a message.</p>
                      <textarea rows={3} style={inputStyle} value={l9Plain} onChange={(e) => setL9Plain(e.target.value)} />
                      <button onClick={doL9Encrypt} style={{ ...buttonBase, marginRight: '0.5rem' }}>Encrypt</button>
                      <button onClick={doL9Decrypt} style={buttonBase}>Decrypt</button>
                    </>
                  ) : null}
                  {lessonNumber === 10 ? (
                    <>
                      <p style={{ marginTop: 0 }}>Derive shared secrets for Alice and Bob using ECDH.</p>
                      <button onClick={doL10} style={buttonBase}>Derive Shared Secret</button>
                    </>
                  ) : null}
                  {lessonNumber === 11 ? (
                    <>
                      <p style={{ marginTop: 0 }}>Mark common mistakes that apply. Then grade your setup.</p>
                      {Object.keys(l11Checks).map((k) => (
                        <label key={k} style={{ display: 'block', marginBottom: '0.35rem' }}>
                          <input type="checkbox" checked={l11Checks[k]} onChange={(e) => setL11Checks((s) => ({ ...s, [k]: e.target.checked }))} /> {k}
                        </label>
                      ))}
                      <button onClick={doL11} style={buttonBase}>Grade Checklist</button>
                    </>
                  ) : null}
                </div>
              </div>
              <div style={editorFooterStyle} className="sl-try-actions">
                <button onClick={resetLesson} style={buttonBase}>Reset</button>
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
              <div style={panelHeaderStyle}>Output</div>
              <div style={outputBodyStyle}>
                <div style={panelBodyStyle}>
                  {lessonNumber === 1 ? (
                    <>
                      <p style={{ marginTop: 0 }}>Confidentiality Demo</p>
                      <div style={outputItemStyle}>
                        <p style={outputLabelStyle}>Displayed Message</p>
                        <div style={cryptoOutputBoxStyle}>{l1Display}</div>
                      </div>
                      <p>{l1Locked ? 'Locked view hides the content from others.' : 'Unlocked view reveals readable content.'}</p>
                    </>
                  ) : null}
                  {lessonNumber === 2 ? (
                    <>
                      <div style={{ ...outputItemStyle, marginTop: 0 }}>
                        <p style={outputLabelStyle}>Base64</p>
                        <div style={cryptoOutputBoxStyle}>{l2Base64 || 'Run demo'}</div>
                      </div>
                      <div style={outputItemStyle}>
                        <p style={outputLabelStyle}>Decoded</p>
                        <div style={cryptoOutputBoxStyle}>{l2Decoded || '-'}</div>
                      </div>
                      <div style={outputItemStyle}>
                        <p style={outputLabelStyle}>SHA-256</p>
                        <div style={cryptoOutputBoxStyle}>{l2Hash || '-'}</div>
                      </div>
                      <p>Base64 is encoding, not security. Hashing is one-way.</p>
                    </>
                  ) : null}
                  {lessonNumber === 3 ? (
                    <>
                      <div style={{ ...outputItemStyle, marginTop: 0 }}>
                        <p style={outputLabelStyle}>Caesar Ciphertext</p>
                        <div style={cryptoOutputBoxStyle}>{l3Cipher}</div>
                      </div>
                      <div style={outputItemStyle}>
                        <p style={outputLabelStyle}>Caesar Decrypted (reverse shift)</p>
                        <div style={cryptoOutputBoxStyle}>{l3Decrypted}</div>
                      </div>
                    </>
                  ) : null}
                  {lessonNumber === 4 ? (
                    <>
                      <div style={{ ...outputItemStyle, marginTop: 0 }}>
                        <p style={outputLabelStyle}>Vigenere Ciphertext</p>
                        <div style={cryptoOutputBoxStyle}>{l4Cipher}</div>
                      </div>
                      <div style={outputItemStyle}>
                        <p style={outputLabelStyle}>Decrypted with Keyword</p>
                        <div style={cryptoOutputBoxStyle}>{l4Decrypted}</div>
                      </div>
                      {l4ShowSteps ? (
                        <div style={outputItemStyle}>
                          <p style={outputLabelStyle}>Keyword Alignment</p>
                          <div style={cryptoOutputBoxStyle}>{l4AlignedKeyword || 'Enter a keyword with letters only.'}</div>
                        </div>
                      ) : null}
                    </>
                  ) : null}
                  {lessonNumber === 5 ? (
                    <>
                      <div style={{ ...outputItemStyle, marginTop: 0 }}>
                        <p style={outputLabelStyle}>Hash A</p>
                        <div style={cryptoOutputBoxStyle}>{l5HashA || '-'}</div>
                      </div>
                      <div style={outputItemStyle}>
                        <p style={outputLabelStyle}>Hash B (input + !)</p>
                        <div style={cryptoOutputBoxStyle}>{l5HashB || '-'}</div>
                      </div>
                      <div style={outputItemStyle}>
                        <p style={outputLabelStyle}>Hex positions changed</p>
                        <div style={cryptoOutputBoxStyle}>{String(l5Diff)}</div>
                      </div>
                    </>
                  ) : null}
                  {lessonNumber === 6 ? (
                    <>
                      <div style={{ ...outputItemStyle, marginTop: 0 }}>
                        <p style={outputLabelStyle}>Hash with Salt A</p>
                        <div style={cryptoOutputBoxStyle}>{l6HashA || '-'}</div>
                      </div>
                      <div style={outputItemStyle}>
                        <p style={outputLabelStyle}>Hash with Salt B</p>
                        <div style={cryptoOutputBoxStyle}>{l6HashB || '-'}</div>
                      </div>
                    </>
                  ) : null}
                  {lessonNumber === 7 ? (
                    <>
                      <div style={{ ...outputItemStyle, marginTop: 0 }}>
                        <p style={outputLabelStyle}>HMAC Tag</p>
                        <div style={cryptoOutputBoxStyle}>{l7Tag || '-'}</div>
                      </div>
                      <div style={outputItemStyle}>
                        <p style={outputLabelStyle}>Verification</p>
                        <div style={cryptoOutputBoxStyle}>{l7VerifyResult || 'Not verified yet'}</div>
                      </div>
                    </>
                  ) : null}
                  {lessonNumber === 8 ? (
                    <>
                      <div style={{ ...outputItemStyle, marginTop: 0 }}>
                        <p style={outputLabelStyle}>IV (Base64)</p>
                        <div style={cryptoOutputBoxStyle}>{l8Iv || '-'}</div>
                      </div>
                      <div style={outputItemStyle}>
                        <p style={outputLabelStyle}>Ciphertext (Base64)</p>
                        <div style={cryptoOutputBoxStyle}>{l8Cipher || '-'}</div>
                      </div>
                      <div style={outputItemStyle}>
                        <p style={outputLabelStyle}>Decrypted</p>
                        <div style={cryptoOutputBoxStyle}>{l8Decrypted || '-'}</div>
                      </div>
                    </>
                  ) : null}
                  {lessonNumber === 9 ? (
                    <>
                      <div style={{ ...outputItemStyle, marginTop: 0 }}>
                        <p style={outputLabelStyle}>Ciphertext</p>
                        <div style={cryptoOutputBoxStyle}>{l9Cipher || '-'}</div>
                      </div>
                      <div style={outputItemStyle}>
                        <p style={outputLabelStyle}>Decrypted</p>
                        <div style={cryptoOutputBoxStyle}>{l9Decrypted || '-'}</div>
                      </div>
                    </>
                  ) : null}
                  {lessonNumber === 10 ? (
                    <>
                      <div style={{ ...outputItemStyle, marginTop: 0 }}>
                        <p style={outputLabelStyle}>Alice Secret</p>
                        <div style={cryptoOutputBoxStyle}>{l10Alice || '-'}</div>
                      </div>
                      <div style={outputItemStyle}>
                        <p style={outputLabelStyle}>Bob Secret</p>
                        <div style={cryptoOutputBoxStyle}>{l10Bob || '-'}</div>
                      </div>
                      <div style={outputItemStyle}>
                        <p style={outputLabelStyle}>Match</p>
                        <div style={cryptoOutputBoxStyle}>{String(l10Match)}</div>
                      </div>
                    </>
                  ) : null}
                  {lessonNumber === 11 ? (
                    <>
                      <div style={{ ...outputItemStyle, marginTop: 0 }}>
                        <p style={outputLabelStyle}>Checklist Result</p>
                        <div style={cryptoOutputBoxStyle}>{l11Result || 'Run the checklist to get a risk grade.'}</div>
                      </div>
                      <p style={outputTextStyle}>Common mistakes in authentication, updates, and links increase real-world risk.</p>
                    </>
                  ) : null}
                  <div style={{ marginTop: '0.8rem' }}>
                    <button
                      onClick={() => copyText(
                        lessonNumber === 2 ? l2Hash
                          : lessonNumber === 5 ? l5HashA
                            : lessonNumber === 6 ? l6HashA
                              : lessonNumber === 7 ? l7Tag
                                : lessonNumber === 8 ? l8Cipher
                                  : lessonNumber === 9 ? l9Cipher
                                    : lessonNumber === 10 ? l10Alice
                                      : '',
                      )}
                      style={{ ...buttonBase, height: '34px' }}
                    >
                      Copy Key Output
                    </button>
                    {copyMsg ? <span style={{ marginLeft: '0.5rem' }}>{copyMsg}</span> : null}
                  </div>
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

