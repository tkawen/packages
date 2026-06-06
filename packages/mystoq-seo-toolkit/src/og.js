/**
 * OpenGraph + Twitter Card meta tag builders.
 */

import { escapeXml } from './utils.js';

function tag(property, content) {
  if (content === undefined || content === null || content === '') return '';
  return `<meta property="${escapeXml(property)}" content="${escapeXml(String(content))}">`;
}

function metaName(name, content) {
  if (content === undefined || content === null || content === '') return '';
  return `<meta name="${escapeXml(name)}" content="${escapeXml(String(content))}">`;
}

/**
 * @param {object} o
 * @param {string} o.title
 * @param {string} o.description
 * @param {string} o.url
 * @param {string} [o.image]
 * @param {string} [o.type='website']
 * @param {string} [o.siteName]
 * @param {string} [o.locale]
 * @param {string|string[]} [o.localeAlternate]
 * @returns {string}
 */
export function generateOgTags(o = {}) {
  const lines = [
    tag('og:type', o.type || 'website'),
    tag('og:title', o.title),
    tag('og:description', o.description),
    tag('og:url', o.url),
    tag('og:image', o.image),
    tag('og:site_name', o.siteName),
    tag('og:locale', o.locale),
  ];
  if (o.localeAlternate) {
    const alts = Array.isArray(o.localeAlternate) ? o.localeAlternate : [o.localeAlternate];
    for (const a of alts) lines.push(tag('og:locale:alternate', a));
  }
  if (o.imageWidth) lines.push(tag('og:image:width', o.imageWidth));
  if (o.imageHeight) lines.push(tag('og:image:height', o.imageHeight));
  if (o.imageAlt) lines.push(tag('og:image:alt', o.imageAlt));
  return lines.filter(Boolean).join('\n');
}

/**
 * @param {object} t
 * @param {'summary'|'summary_large_image'|'app'|'player'} [t.card='summary_large_image']
 * @param {string} [t.site] - @handle
 * @param {string} [t.creator] - @handle
 */
export function generateTwitterCard(t = {}) {
  return [
    metaName('twitter:card', t.card || 'summary_large_image'),
    metaName('twitter:site', t.site),
    metaName('twitter:creator', t.creator),
    metaName('twitter:title', t.title),
    metaName('twitter:description', t.description),
    metaName('twitter:image', t.image),
    metaName('twitter:image:alt', t.imageAlt),
  ].filter(Boolean).join('\n');
}

/**
 * Validates OG image dimensions for major platforms.
 * @param {{width:number, height:number}} dims
 * @returns {{ok:boolean, warnings:string[]}}
 */
export function validateOgImage({ width, height } = {}) {
  const warnings = [];
  if (!width || !height) return { ok: false, warnings: ['width and height required'] };
  const ratio = width / height;
  if (ratio < 1.85 || ratio > 1.95) warnings.push(`Aspect ratio ${ratio.toFixed(2)} differs from 1.91:1 (1200x630)`);
  if (width < 1200 || height < 630) warnings.push('Below recommended 1200x630 minimum');
  if (width > 4096 || height > 4096) warnings.push('Above platform maximum 4096px');
  return { ok: warnings.length === 0, warnings };
}
