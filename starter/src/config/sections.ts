/*
  sections.ts - the ordered feature list per site type.
  Reorder, add or remove names here. Each name is a folder in src/features/<name>/.
  `variants` lets one feature render differently for a site type (minimal header, opt-in hero).
  src/pages/index.astro renders the list for the active `siteType` (src/config/site.ts).
*/
import type { SiteType } from './site';

export const sections: Record<SiteType, string[]> = {
  portfolio: ['header', 'hero', 'work', 'about', 'proof', 'contact', 'footer'],
  landing: ['header', 'hero', 'logos', 'services', 'process', 'proof', 'pricing', 'faq', 'cta', 'footer'],
  funnel: ['header', 'hero', 'proof', 'process', 'faq', 'optin', 'footer'],
  website: ['header', 'hero', 'logos', 'services', 'stats', 'proof', 'cta', 'footer'],
};

export const variants: Partial<Record<SiteType, Record<string, string>>> = {
  funnel: { header: 'minimal', hero: 'optin', footer: 'minimal' },
};
