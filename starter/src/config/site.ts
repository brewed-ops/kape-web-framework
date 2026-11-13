/*
  site.ts - the ONE file for business facts.
  Name, address, phone, nav, socials, SEO defaults, legal dates.
  Words on the page live in src/content/*.ts. Colors live in src/styles/tokens.css.

  Every value below is placeholder demo data for "Larkfield Dental".
  Replace each one, then search the repo for TODO(owner) to find the rest.
*/

export type SiteType = 'portfolio' | 'landing' | 'funnel' | 'website';

/** Switch this one line to change the whole site layout. Section lists: src/config/sections.ts */
export const siteType: SiteType = 'website';

export interface NavItem {
  label: string;
  href: string;
}

export interface Address {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export const site = {
  // TODO(owner): business name as customers know it
  name: 'Larkfield Dental',
  // TODO(owner): registered legal name (used in legal pages and footer)
  legalName: 'Larkfield Dental Group LLC',
  // TODO(owner): one-line description of what the business does
  tagline: 'Family dentistry in Portland, Oregon',
  // TODO(owner): the final live domain, https, no trailing slash. Canonicals, sitemap and OG use it.
  url: 'https://larkfielddental.example',
  locale: 'en_US',
  language: 'en',

  // TODO(owner): schema.org type for the business (Dentist, Restaurant, LegalService, ProfessionalService...)
  businessType: 'Dentist',
  // TODO(owner): public contact details
  email: 'hello@larkfielddental.example',
  phone: '+1 503 555 0142',
  phoneDisplay: '(503) 555-0142',
  // TODO(owner): physical address. Set to undefined for an online-only business
  // (the site then emits Organization schema instead of LocalBusiness).
  address: {
    street: '412 Harbor Street, Suite 2',
    city: 'Portland',
    region: 'OR',
    postalCode: '97201',
    country: 'US',
  } as Address | undefined,
  // TODO(owner): opening hours (schema.org day codes: Mo Tu We Th Fr Sa Su)
  hours: [
    { days: ['Mo', 'Tu', 'We', 'Th'], opens: '08:00', closes: '17:00' },
    { days: ['Fr'], opens: '08:00', closes: '13:00' },
  ],
  hoursDisplay: 'Mon to Thu 8am to 5pm, Fri 8am to 1pm',

  // TODO(owner): real profiles only. Remove the rest.
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/larkfielddental.example' },
    { label: 'Facebook', href: 'https://facebook.com/larkfielddental.example' },
  ] as NavItem[],

  seo: {
    // Page titles become "<page title> | <name>". The home page uses homeTitle as is.
    // Rules: title 50-60 characters, description 140-160 (see docs/SEO.md).
    homeTitle: 'Larkfield Dental | Family Dentist in Portland, OR',
    homeDescription:
      'Gentle family dentistry in Portland. Check-ups, cleanings, whitening and clear aligners, with new patient appointments usually within two days.',
    ogImage: '/og-default.png',
    ogImageAlt: 'Larkfield Dental',
    // TODO(owner): X/Twitter handle without @, or leave empty
    twitter: '',
  },

  // Where forms post. Default is the Cloudflare Pages Function in functions/api/contact.ts.
  forms: {
    action: '/api/contact',
    thankYou: '/thank-you/',
  },

  // Each legal document is dated on its own and only when that document really changes.
  legal: {
    privacyUpdated: '2026-11-13',
    termsUpdated: '2026-11-13',
    cookiesUpdated: '2026-11-13',
  },
};

/** Header navigation per site type. Funnels have none on purpose. */
export const nav: Record<SiteType, NavItem[]> = {
  website: [
    { label: 'Services', href: '/services/' },
    { label: 'About', href: '/about/' },
    { label: 'Contact', href: '/contact/' },
  ],
  portfolio: [
    { label: 'Work', href: '/#work' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ],
  landing: [
    { label: 'Services', href: '/#services' },
    { label: 'Process', href: '/#process' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'FAQ', href: '/#faq' },
  ],
  funnel: [],
};

/** The one primary action per site type (header button, closing CTA). */
export const primaryAction: Record<SiteType, NavItem> = {
  website: { label: 'Book a visit', href: '/contact/' },
  portfolio: { label: 'Get in touch', href: '/#contact' },
  landing: { label: 'Book a visit', href: '/contact/' },
  funnel: { label: 'Get the free guide', href: '/#optin' },
};
