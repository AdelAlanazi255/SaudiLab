const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export function utf8ToBytes(text) {
  return textEncoder.encode(String(text || ''));
}

export function bytesToUtf8(bytes) {
  return textDecoder.decode(bytes);
}

export function bytesToBase64(bytes) {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = '';
  for (let i = 0; i < arr.length; i += 1) binary += String.fromCharCode(arr[i]);
  return btoa(binary);
}

export function base64ToBytes(base64) {
  const bin = atob(String(base64 || ''));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

export function bytesToHex(bytes) {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function caesarEncrypt(text, shift) {
  const s = Number(shift || 0) % 26;
  return String(text || '').replace(/[a-z]/gi, (ch) => {
    const base = ch <= 'Z' ? 65 : 97;
    const code = ch.charCodeAt(0) - base;
    return String.fromCharCode(((code + s + 26) % 26) + base);
  });
}

export function vigenereEncrypt(text, key) {
  const k = String(key || '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
  if (!k) return String(text || '');
  let i = 0;
  return String(text || '').replace(/[A-Z]/gi, (ch) => {
    const base = ch <= 'Z' ? 65 : 97;
    const shift = k.charCodeAt(i % k.length) - 65;
    i += 1;
    const code = ch.charCodeAt(0) - base;
    return String.fromCharCode(((code + shift) % 26) + base);
  });
}

export async function sha256Hex(text) {
  const digest = await crypto.subtle.digest('SHA-256', utf8ToBytes(text));
  return bytesToHex(new Uint8Array(digest));
}

export async function hmacSha256Hex(message, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    utf8ToBytes(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, utf8ToBytes(message));
  return bytesToHex(new Uint8Array(sig));
}

async function aesKeyFromSecret(secret) {
  const digest = await crypto.subtle.digest('SHA-256', utf8ToBytes(secret));
  return crypto.subtle.importKey('raw', digest, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

export async function aesGcmEncrypt(plaintext, secret) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await aesKeyFromSecret(secret);
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, utf8ToBytes(plaintext));
  return {
    ivBase64: bytesToBase64(iv),
    cipherBase64: bytesToBase64(new Uint8Array(cipher)),
  };
}

export async function aesGcmDecrypt(cipherBase64, ivBase64, secret) {
  const key = await aesKeyFromSecret(secret);
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(ivBase64) },
    key,
    base64ToBytes(cipherBase64),
  );
  return bytesToUtf8(new Uint8Array(plain));
}

export async function generateRsaKeyPair() {
  return crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt'],
  );
}

export async function rsaEncryptBase64(publicKey, plaintext) {
  const cipher = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, utf8ToBytes(plaintext));
  return bytesToBase64(new Uint8Array(cipher));
}

export async function rsaDecryptBase64(privateKey, cipherBase64) {
  const plain = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, base64ToBytes(cipherBase64));
  return bytesToUtf8(new Uint8Array(plain));
}

export async function deriveEcdhSharedBase64() {
  const alice = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const bob = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const aliceBits = await crypto.subtle.deriveBits({ name: 'ECDH', public: bob.publicKey }, alice.privateKey, 256);
  const bobBits = await crypto.subtle.deriveBits({ name: 'ECDH', public: alice.publicKey }, bob.privateKey, 256);
  const a = bytesToBase64(new Uint8Array(aliceBits));
  const b = bytesToBase64(new Uint8Array(bobBits));
  return { aliceSecret: a, bobSecret: b, match: a === b };
}
