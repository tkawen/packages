/**
 * hreflang link generator + cluster validator.
 */

import { escapeXml, validateUrl } from './utils.js';

/**
 * @param {Array<{hreflang:string, href:string}>} pairs
 * @returns {string} <link> tags
 */
export function generateHreflangTags(pairs = []) {
  const out = [];
  for (const p of pairs) {
    if (!p.hreflang || !p.href || !validateUrl(p.href)) continue;
    out.push(`<link rel="alternate" hreflang="${escapeXml(p.hreflang)}" href="${escapeXml(p.href)}">`);
  }
  return out.join('\n');
}

/**
 * Validates a hreflang cluster:
 * - Each URL must be reachable
 * - x-default should be present
 * - All locales should reciprocally link
 * @param {Array<{hreflang:string, href:string}>} pairs
 * @returns {{ok:boolean, warnings:string[]}}
 */
export function validateHreflang(pairs = []) {
  const warnings = [];
  const tags = new Set(pairs.map(p => p.hreflang));
  const urls = new Set(pairs.map(p => p.href));

  if (!tags.has('x-default')) warnings.push('Missing x-default fallback');
  if (urls.size !== pairs.length) warnings.push('Duplicate URLs across locales');
  if (tags.size !== pairs.length) warnings.push('Duplicate hreflang codes');

  const validCode = /^([a-z]{2,3}(-[A-Z]{2})?|x-default)$/;
  for (const p of pairs) {
    if (!validCode.test(p.hreflang)) warnings.push(`Invalid hreflang code: ${p.hreflang}`);
    if (!validateUrl(p.href)) warnings.push(`Invalid URL: ${p.href}`);
  }

  return { ok: warnings.length === 0, warnings };
}
