/**
 * sitemap.xml + sitemap index + image sitemap builders.
 * Spec: https://www.sitemaps.org/protocol.html
 */

import { escapeXml, isoDate, validateUrl } from './utils.js';

const VALID_FREQ = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

/**
 * @param {Array<{loc:string, lastmod?:string|Date, changefreq?:string, priority?:number, alternates?:Array<{hreflang:string, href:string}>}>} urls
 * @returns {string} XML sitemap
 */
export function generateSitemap(urls = []) {
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
  lines.push('        xmlns:xhtml="http://www.w3.org/1999/xhtml">');

  for (const entry of urls) {
    if (!entry.loc || !validateUrl(entry.loc)) continue;
    lines.push('  <url>');
    lines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
    if (entry.lastmod) lines.push(`    <lastmod>${isoDate(entry.lastmod)}</lastmod>`);
    if (entry.changefreq && VALID_FREQ.includes(entry.changefreq)) {
      lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    }
    if (entry.priority !== undefined) {
      const p = Math.max(0, Math.min(1, Number(entry.priority)));
      lines.push(`    <priority>${p.toFixed(1)}</priority>`);
    }
    for (const alt of entry.alternates || []) {
      if (alt.href && alt.hreflang) {
        lines.push(`    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.hreflang)}" href="${escapeXml(alt.href)}"/>`);
      }
    }
    lines.push('  </url>');
  }

  lines.push('</urlset>');
  return lines.join('\n');
}

/**
 * @param {Array<{loc:string, lastmod?:string|Date}>} sitemaps
 * @returns {string}
 */
export function generateSitemapIndex(sitemaps = []) {
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  for (const s of sitemaps) {
    if (!s.loc || !validateUrl(s.loc)) continue;
    lines.push('  <sitemap>');
    lines.push(`    <loc>${escapeXml(s.loc)}</loc>`);
    if (s.lastmod) lines.push(`    <lastmod>${isoDate(s.lastmod)}</lastmod>`);
    lines.push('  </sitemap>');
  }
  lines.push('</sitemapindex>');
  return lines.join('\n');
}

/**
 * @param {Array<{loc:string, images:Array<{loc:string, caption?:string, title?:string}>}>} entries
 */
export function generateImageSitemap(entries = []) {
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
  lines.push('        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">');

  for (const entry of entries) {
    if (!entry.loc || !validateUrl(entry.loc)) continue;
    lines.push('  <url>');
    lines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
    for (const img of entry.images || []) {
      if (!img.loc) continue;
      lines.push('    <image:image>');
      lines.push(`      <image:loc>${escapeXml(img.loc)}</image:loc>`);
      if (img.caption) lines.push(`      <image:caption>${escapeXml(img.caption)}</image:caption>`);
      if (img.title) lines.push(`      <image:title>${escapeXml(img.title)}</image:title>`);
      lines.push('    </image:image>');
    }
    lines.push('  </url>');
  }

  lines.push('</urlset>');
  return lines.join('\n');
}
