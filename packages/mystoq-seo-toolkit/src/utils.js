/**
 * Internal utilities. Not part of the public stable API.
 */

export function escapeXml(s) {
  if (typeof s !== 'string') return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function validateUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

export function normalizeUrl(url) {
  if (!validateUrl(url)) throw new Error(`Invalid URL: ${url}`);
  const u = new URL(url);
  u.hash = '';
  if (u.pathname !== '/' && u.pathname.endsWith('/')) {
    u.pathname = u.pathname.replace(/\/+$/, '');
  }
  return u.toString();
}

export function isoDate(d) {
  const date = d instanceof Date ? d : new Date(d || Date.now());
  return date.toISOString().split('T')[0];
}
