/**
 * @tkawen/mystoq-seo-toolkit
 * Comprehensive SEO toolkit for the modern AI-aware web.
 * MIT © Hartem Yaakoub
 */

export { generateLlmsTxt, generateLlmsFullTxt } from './llmstxt.js';
export { generateSitemap, generateSitemapIndex, generateImageSitemap } from './sitemap.js';
export { generateRobotsTxt } from './robots.js';
export {
  schemaPerson,
  schemaOrganization,
  schemaProduct,
  schemaArticle,
  schemaFAQPage,
  schemaBreadcrumbList,
  schemaWebSite,
  schemaCourse,
  schemaService,
  schemaLocalBusiness,
  schemaReview,
  schemaJobPosting,
  jsonLdScript,
} from './schema.js';
export { generateOgTags, generateTwitterCard, validateOgImage } from './og.js';
export { generateHreflangTags, validateHreflang } from './hreflang.js';
export { validateUrl, normalizeUrl, escapeXml } from './utils.js';
