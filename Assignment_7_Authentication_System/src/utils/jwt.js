/**
 * JWT Token Simulation Utility
 * Simulates real RFC 7519 JSON Web Tokens (Header.Payload.Signature)
 */

// Helper to encode string to URL-safe Base64 safely supporting Unicode/UTF-8
const base64UrlEncode = (str) => {
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Helper to decode URL-safe Base64 to string safely supporting Unicode/UTF-8
const base64UrlDecode = (str) => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
};

// Simple deterministic hash simulation for HMAC-SHA256 signature
const simulateHmacSignature = (headerB64, payloadB64, secret = 'react_assign_secret_key_2026') => {
  const data = `${headerB64}.${payloadB64}.${secret}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hexHash = Math.abs(hash).toString(16).padStart(8, '0') + 
                  Math.abs(~hash).toString(16).padStart(8, '0') +
                  Date.now().toString(16);
  return base64UrlEncode(hexHash);
};

/**
 * Generate a simulated JWT token
 * @param {Object} user - User payload data
 * @param {number} expiresInMinutes - Expiration time in minutes (default: 60)
 * @returns {string} Encoded JWT token string
 */
export const generateJwt = (user, expiresInMinutes = 60) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const nowSeconds = Math.floor(Date.now() / 1000);
  const expSeconds = nowSeconds + (expiresInMinutes * 60);

  const payload = {
    sub: user.id || 'usr_' + Date.now(),
    username: user.username,
    displayName: user.displayName || user.username,
    role: user.role || 'Standard User',
    iat: nowSeconds,
    exp: expSeconds,
    iss: 'TaskFlow-Auth-Service',
    aud: 'TaskFlow-Client-App'
  };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signatureB64 = simulateHmacSignature(headerB64, payloadB64);

  return `${headerB64}.${payloadB64}.${signatureB64}`;
};

/**
 * Decode a simulated JWT token into its header, payload, and signature components
 * @param {string} token - The raw JWT token string
 * @returns {Object|null} Decoded token parts
 */
export const decodeJwt = (token) => {
  if (!token || typeof token !== 'string') return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const signature = parts[2];

    return {
      raw: token,
      header,
      payload,
      signature
    };
  } catch (err) {
    console.error('Failed to decode simulated JWT', err);
    return null;
  }
};

/**
 * Verify if the JWT token is structurally valid and unexpired
 * @param {string} token 
 * @returns {boolean}
 */
export const verifyJwt = (token) => {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.payload) return false;

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (decoded.payload.exp && decoded.payload.exp < nowSeconds) {
    return false; // Expired
  }

  return true;
};

/**
 * Get remaining seconds until token expires
 * @param {string} token 
 * @returns {number} Remaining seconds (or 0 if expired/invalid)
 */
export const getTokenRemainingSeconds = (token) => {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.payload || !decoded.payload.exp) return 0;

  const nowSeconds = Math.floor(Date.now() / 1000);
  return Math.max(0, decoded.payload.exp - nowSeconds);
};
