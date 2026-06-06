/**
 * robots.txt builder — including modern AI crawler awareness.
 */

const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'Google-Extended',
  'PerplexityBot',
  'Perplexity-User',
  'YouBot',
  'Applebot-Extended',
  'CCBot',
  'cohere-ai',
  'Diffbot',
  'FacebookBot',
  'Bytespider',
  'ImagesiftBot',
  'Omgilibot',
  'Amazonbot',
  'MistralAI-User',
];

/**
 * @param {object} opts
 * @param {Array<{userAgent:string|string[], allow?:string[], disallow?:string[], crawlDelay?:number}>} [opts.groups]
 * @param {string|string[]} [opts.sitemap] - Sitemap URLs
 * @param {string} [opts.host]
 * @param {'allow'|'disallow'|'sitemap-only'} [opts.aiCrawlers] - Quick AI policy
 * @returns {string}
 */
export function generateRobotsTxt(opts = {}) {
  const { groups = [], sitemap, host, aiCrawlers } = opts;
  const lines = [];

  if (groups.length === 0 && !aiCrawlers) {
    lines.push('User-agent: *');
    lines.push('Allow: /');
    lines.push('');
  }

  for (const g of groups) {
    const agents = Array.isArray(g.userAgent) ? g.userAgent : [g.userAgent];
    for (const ua of agents) lines.push(`User-agent: ${ua}`);
    for (const a of g.allow || []) lines.push(`Allow: ${a}`);
    for (const d of g.disallow || []) lines.push(`Disallow: ${d}`);
    if (g.crawlDelay) lines.push(`Crawl-delay: ${g.crawlDelay}`);
    lines.push('');
  }

  if (aiCrawlers) {
    lines.push('# AI crawlers');
    for (const bot of AI_CRAWLERS) {
      lines.push(`User-agent: ${bot}`);
      if (aiCrawlers === 'allow' || aiCrawlers === 'sitemap-only') lines.push('Allow: /');
      if (aiCrawlers === 'disallow') lines.push('Disallow: /');
      lines.push('');
    }
  }

  if (host) lines.push(`Host: ${host}`);

  const sitemaps = sitemap ? (Array.isArray(sitemap) ? sitemap : [sitemap]) : [];
  for (const s of sitemaps) lines.push(`Sitemap: ${s}`);

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
