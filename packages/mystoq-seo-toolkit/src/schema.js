/**
 * Schema.org JSON-LD helpers. Each function returns a plain object
 * with @context set, ready to be JSON.stringify'd inside a <script>.
 */

const CTX = 'https://schema.org';

function strip(obj) {
  for (const k of Object.keys(obj)) {
    if (obj[k] === undefined || obj[k] === null || obj[k] === '') delete obj[k];
  }
  return obj;
}

export function schemaPerson(p = {}) {
  return strip({
    '@context': CTX,
    '@type': 'Person',
    name: p.name,
    givenName: p.givenName,
    familyName: p.familyName,
    alternateName: p.alternateName,
    url: p.url,
    image: p.image,
    jobTitle: p.jobTitle,
    worksFor: p.worksFor ? { '@type': 'Organization', name: p.worksFor } : undefined,
    sameAs: p.sameAs,
    email: p.email,
    address: p.address,
    knowsAbout: p.knowsAbout,
    description: p.description,
  });
}

export function schemaOrganization(o = {}) {
  return strip({
    '@context': CTX,
    '@type': o.type || 'Organization',
    name: o.name,
    legalName: o.legalName,
    url: o.url,
    logo: o.logo,
    image: o.image,
    description: o.description,
    foundingDate: o.foundingDate,
    founder: o.founder ? { '@type': 'Person', name: o.founder } : undefined,
    sameAs: o.sameAs,
    contactPoint: o.contactPoint,
    address: o.address,
    areaServed: o.areaServed,
  });
}

export function schemaProduct(p = {}) {
  return strip({
    '@context': CTX,
    '@type': 'Product',
    name: p.name,
    image: p.image,
    description: p.description,
    sku: p.sku,
    brand: p.brand ? { '@type': 'Brand', name: p.brand } : undefined,
    offers: p.price !== undefined ? strip({
      '@type': 'Offer',
      url: p.url,
      priceCurrency: p.currency || 'USD',
      price: String(p.price),
      availability: `https://schema.org/${p.availability || 'InStock'}`,
      itemCondition: `https://schema.org/${p.condition || 'NewCondition'}`,
    }) : undefined,
    aggregateRating: p.rating ? strip({
      '@type': 'AggregateRating',
      ratingValue: String(p.rating),
      reviewCount: p.reviewCount ? String(p.reviewCount) : undefined,
    }) : undefined,
  });
}

export function schemaArticle(a = {}) {
  return strip({
    '@context': CTX,
    '@type': a.type || 'Article',
    headline: a.headline,
    description: a.description,
    image: a.image,
    datePublished: a.datePublished,
    dateModified: a.dateModified || a.datePublished,
    author: a.author ? (typeof a.author === 'string'
      ? { '@type': 'Person', name: a.author }
      : a.author) : undefined,
    publisher: a.publisher ? (typeof a.publisher === 'string'
      ? { '@type': 'Organization', name: a.publisher }
      : a.publisher) : undefined,
    mainEntityOfPage: a.url ? { '@type': 'WebPage', '@id': a.url } : undefined,
    inLanguage: a.lang,
    articleSection: a.section,
    keywords: a.keywords,
  });
}

export function schemaFAQPage(faqs = []) {
  return {
    '@context': CTX,
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function schemaBreadcrumbList(items = []) {
  return {
    '@context': CTX,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function schemaWebSite(s = {}) {
  return strip({
    '@context': CTX,
    '@type': 'WebSite',
    name: s.name,
    url: s.url,
    inLanguage: s.lang,
    potentialAction: s.searchUrl ? {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${s.searchUrl}{search_term_string}` },
      'query-input': 'required name=search_term_string',
    } : undefined,
    publisher: s.publisher ? { '@type': 'Organization', name: s.publisher } : undefined,
  });
}

export function schemaCourse(c = {}) {
  return strip({
    '@context': CTX,
    '@type': 'Course',
    name: c.name,
    description: c.description,
    provider: c.provider ? { '@type': 'Organization', name: c.provider, sameAs: c.providerUrl } : undefined,
    url: c.url,
    inLanguage: c.lang,
    educationalLevel: c.level,
    offers: c.price !== undefined ? {
      '@type': 'Offer',
      price: String(c.price),
      priceCurrency: c.currency || 'USD',
      category: c.priceCategory,
    } : undefined,
    hasCourseInstance: c.duration ? {
      '@type': 'CourseInstance',
      courseMode: c.mode || 'online',
      courseWorkload: c.duration,
    } : undefined,
  });
}

export function schemaService(s = {}) {
  return strip({
    '@context': CTX,
    '@type': 'Service',
    name: s.name,
    description: s.description,
    provider: s.provider ? { '@type': 'Organization', name: s.provider } : undefined,
    serviceType: s.serviceType,
    areaServed: s.areaServed,
    url: s.url,
    offers: s.price !== undefined ? {
      '@type': 'Offer',
      price: String(s.price),
      priceCurrency: s.currency || 'USD',
    } : undefined,
  });
}

export function schemaLocalBusiness(b = {}) {
  return strip({
    '@context': CTX,
    '@type': b.type || 'LocalBusiness',
    name: b.name,
    image: b.image,
    description: b.description,
    address: b.address ? strip({
      '@type': 'PostalAddress',
      streetAddress: b.address.street,
      addressLocality: b.address.city,
      addressRegion: b.address.region,
      postalCode: b.address.postalCode,
      addressCountry: b.address.country,
    }) : undefined,
    geo: b.geo ? { '@type': 'GeoCoordinates', latitude: b.geo.lat, longitude: b.geo.lng } : undefined,
    telephone: b.phone,
    url: b.url,
    openingHours: b.hours,
    priceRange: b.priceRange,
  });
}

export function schemaReview(r = {}) {
  return strip({
    '@context': CTX,
    '@type': 'Review',
    itemReviewed: r.item ? { '@type': r.itemType || 'Thing', name: r.item } : undefined,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: String(r.rating),
      bestRating: String(r.bestRating || 5),
    },
    name: r.title,
    author: r.author ? { '@type': 'Person', name: r.author } : undefined,
    reviewBody: r.body,
    datePublished: r.date,
  });
}

export function schemaJobPosting(j = {}) {
  return strip({
    '@context': CTX,
    '@type': 'JobPosting',
    title: j.title,
    description: j.description,
    datePosted: j.datePosted,
    validThrough: j.validThrough,
    employmentType: j.employmentType,
    hiringOrganization: j.org ? {
      '@type': 'Organization',
      name: j.org,
      sameAs: j.orgUrl,
    } : undefined,
    jobLocation: j.location ? {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: j.location, addressCountry: j.country },
    } : undefined,
    baseSalary: j.salary !== undefined ? {
      '@type': 'MonetaryAmount',
      currency: j.currency || 'USD',
      value: { '@type': 'QuantitativeValue', value: String(j.salary), unitText: j.salaryUnit || 'MONTH' },
    } : undefined,
  });
}

/**
 * Helper: wrap a schema object in a <script type="application/ld+json"> tag.
 * @param {object|object[]} schema
 * @returns {string}
 */
export function jsonLdScript(schema) {
  const json = JSON.stringify(schema, null, 2);
  return `<script type="application/ld+json">\n${json}\n</script>`;
}
