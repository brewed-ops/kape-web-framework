/*
  schema.ts - typed builders for schema.org JSON-LD.
  Pages call these and hand the result to <JsonLd data={...} />.
  Which page emits what: docs/SEO.md.
*/
import { site } from '@/config/site';

export type JsonLdNode = Record<string, unknown>;

const abs = (path: string): string => new URL(path, site.url).toString();
const ID = {
  org: `${site.url}/#organization`,
  website: `${site.url}/#website`,
};

function postalAddress(): JsonLdNode | undefined {
  const a = site.address;
  if (!a) return undefined;
  return {
    '@type': 'PostalAddress',
    streetAddress: a.street,
    addressLocality: a.city,
    addressRegion: a.region,
    postalCode: a.postalCode,
    addressCountry: a.country,
  };
}

const DAY: Record<string, string> = {
  Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday',
};

/** Organization: used when the business has no public address. */
export function organization(): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ID.org,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: abs('/favicon.svg'),
    email: site.email,
    telephone: site.phone,
    sameAs: site.socials.map((s) => s.href),
  };
}

/** LocalBusiness (or a subtype from site.businessType): used when site.ts has an address. */
export function localBusiness(): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': site.businessType || 'LocalBusiness',
    '@id': ID.org,
    name: site.name,
    legalName: site.legalName,
    description: site.seo.homeDescription,
    url: site.url,
    image: abs(site.seo.ogImage),
    logo: abs('/favicon.svg'),
    email: site.email,
    telephone: site.phone,
    address: postalAddress(),
    openingHoursSpecification: site.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map((d) => DAY[d] ?? d),
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: site.socials.map((s) => s.href),
  };
}

/** The right entity for the home page: LocalBusiness if an address exists, else Organization. */
export function business(): JsonLdNode {
  return site.address ? localBusiness() : organization();
}

export function website(): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': ID.website,
    name: site.name,
    url: site.url,
    inLanguage: site.language,
    publisher: { '@id': ID.org },
  };
}

export function webPage(opts: { path: string; title: string; description: string }): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${abs(opts.path)}#webpage`,
    url: abs(opts.path),
    name: opts.title,
    description: opts.description,
    isPartOf: { '@id': ID.website },
    inLanguage: site.language,
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbList(crumbs: Crumb[]): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

export interface QA {
  question: string;
  answer: string;
}

export function faqPage(items: QA[]): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  };
}

export function person(opts: { name: string; jobTitle: string; image?: string; sameAs?: string[] }): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: opts.name,
    jobTitle: opts.jobTitle,
    image: opts.image ? abs(opts.image) : undefined,
    worksFor: { '@id': ID.org },
    sameAs: opts.sameAs,
  };
}

export function service(opts: { name: string; description: string; areaServed?: string }): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    provider: { '@id': ID.org },
    areaServed: opts.areaServed ?? site.address?.city,
  };
}

export function offer(opts: { name: string; price: number; currency?: string; description?: string }): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: opts.name,
    price: opts.price,
    priceCurrency: opts.currency ?? 'USD',
    description: opts.description,
    seller: { '@id': ID.org },
  };
}
