// All words for the Hero feature. Edit text here, never in the component.
// Business facts (phone, address, hours) come from src/config/site.ts.
import type { SiteType, NavItem } from '@/config/site';

export interface Fact {
  label: string;
  value: string;
}

export interface HeroContent {
  headline: string;
  sub: string;
  /** Second button per site type (the first is `primaryAction` in site.ts). */
  secondary: Record<SiteType, NavItem>;
  facts: Fact[];
  /** Used when the hero runs as the funnel "optin" variant. */
  optin: { headline: string; sub: string; button: string };
}

export const hero: HeroContent = {
  // Keep headlines 5-10 words, 2-3 lines.
  headline: 'Dentistry that feels calm, for the whole family',
  // TODO(owner): replace the founding year, wait time and billing claims with true statements
  sub: 'Larkfield Dental has looked after Portland smiles since 2014. New patients are usually seen within two days, and every plan comes with prices in writing.',
  secondary: {
    website: { label: 'See our services', href: '/services/' },
    landing: { label: 'See how it works', href: '#process' },
    portfolio: { label: 'See selected work', href: '#work' },
    funnel: { label: 'What is inside', href: '#process' },
  },
  // TODO(owner): three short facts a visitor checks first
  facts: [
    { label: 'New patients', value: 'Accepted, usually seen within 2 days' },
    { label: 'Insurance', value: 'Most major PPO plans, plus a self-pay membership' },
    { label: 'Hours', value: 'Mon to Thu 8am to 5pm, Fri 8am to 1pm' },
  ],
  optin: {
    headline: 'The first-visit checklist, free in your inbox',
    // TODO(owner): describe the real lead magnet
    sub: 'Seven questions to ask any new dentist, what a fair exam costs in Portland, and the forms to bring. One email, no newsletter.',
    button: 'Send me the checklist',
  },
};
