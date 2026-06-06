/**
 * llms.txt — the standard for making content discoverable by LLMs.
 * Spec: https://llmstxt.org
 *
 * generateLlmsTxt(opts) — concise index for AI crawlers
 * generateLlmsFullTxt(opts) — full-content variant
 */

import { validateUrl } from './utils.js';

/**
 * @param {object} opts
 * @param {string} opts.title - Site/project name (required)
 * @param {string} opts.summary - One-line description (required)
 * @param {string} [opts.details] - Longer paragraph (optional)
 * @param {Array<{title:string, links:Array<{text:string, url:string, note?:string}>}>} [opts.sections]
 * @param {Array<{text:string, url:string, note?:string}>} [opts.optional] - "Optional" section
 * @returns {string}
 */
export function generateLlmsTxt(opts = {}) {
  const { title, summary, details, sections = [], optional = [] } = opts;

  if (!title) throw new Error('generateLlmsTxt: title is required');
  if (!summary) throw new Error('generateLlmsTxt: summary is required');

  const lines = [];
  lines.push(`# ${title}`);
  lines.push('');
  lines.push(`> ${summary}`);
  lines.push('');

  if (details) {
    lines.push(details.trim());
    lines.push('');
  }

  for (const section of sections) {
    if (!section.title) continue;
    lines.push(`## ${section.title}`);
    lines.push('');
    for (const link of section.links || []) {
      if (!link.url || !link.text) continue;
      if (!validateUrl(link.url)) continue;
      const note = link.note ? `: ${link.note}` : '';
      lines.push(`- [${link.text}](${link.url})${note}`);
    }
    lines.push('');
  }

  if (optional.length) {
    lines.push('## Optional');
    lines.push('');
    for (const link of optional) {
      if (!link.url || !link.text) continue;
      if (!validateUrl(link.url)) continue;
      const note = link.note ? `: ${link.note}` : '';
      lines.push(`- [${link.text}](${link.url})${note}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Full-content variant — inlines markdown bodies.
 * @param {object} opts
 * @param {string} opts.title
 * @param {string} opts.summary
 * @param {Array<{path:string, content:string}>} opts.pages - Markdown pages
 * @returns {string}
 */
export function generateLlmsFullTxt(opts = {}) {
  const { title, summary, pages = [] } = opts;
  if (!title) throw new Error('generateLlmsFullTxt: title is required');

  const lines = [];
  lines.push(`# ${title}`);
  lines.push('');
  if (summary) {
    lines.push(`> ${summary}`);
    lines.push('');
  }

  for (const page of pages) {
    if (!page.content) continue;
    lines.push('---');
    lines.push('');
    if (page.path) {
      lines.push(`<!-- path: ${page.path} -->`);
      lines.push('');
    }
    lines.push(page.content.trim());
    lines.push('');
  }

  return lines.join('\n');
}
