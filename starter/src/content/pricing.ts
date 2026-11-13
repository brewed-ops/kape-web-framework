// Words for the Pricing feature. One tier can be featured (flat accent fill).
export interface Tier {
  name: string;
  price: string;
  unit: string;
  text: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

export const pricing = {
  heading: 'Clear prices',
  lead: 'What the common things cost without insurance. If you have a plan, we send the claim for you.',
  // TODO(owner): replace every price and inclusion with your real ones. Never publish a price you do not honor.
  currency: 'USD',
  tiers: [
    { name: 'New patient visit', price: '$129', unit: 'one time', text: 'The right start for anyone new.', features: ['Full exam and x-rays', 'Cleaning', 'Written plan with prices'], cta: 'Book this visit' },
    { name: 'Care membership', price: '$39', unit: 'per month', text: 'For adults without insurance.', features: ['Two cleanings and exams a year', 'Annual x-rays', '20% off all other treatment', 'Emergency visit included'], cta: 'Join the membership', featured: true },
    { name: 'Whitening', price: '$349', unit: 'one time', text: 'Supervised, in-office.', features: ['Shade check before and after', 'One 60 minute session', 'Take-home top-up tray'], cta: 'Ask about whitening' },
  ] satisfies Tier[],
};
