// Words for the Services feature (home section and /services/ page).
export interface ServiceItem {
  title: string;
  text: string;
  /** Optional short price line. Leave out if you do not publish prices. */
  from?: string;
}

export const services = {
  heading: 'What we do',
  lead: 'Everyday care and the bigger fixes, in one practice you can call by name.',
  // TODO(owner): replace with the real service list, wording and "from" prices
  items: [
    { title: 'Check-ups and cleanings', text: 'A full exam, x-rays when needed, and a cleaning that does not rush. Every visit ends with a plain-English summary.', from: 'from $129' },
    { title: 'Fillings and crowns', text: 'Tooth-colored fillings and same-visit crowns, so a cracked tooth is one appointment, not three.', from: 'from $210' },
    { title: 'Teeth whitening', text: 'Supervised in-office whitening that lifts several shades without the sensitivity of drugstore strips.', from: 'from $349' },
    { title: 'Clear aligners', text: 'Straighter teeth with removable aligners. We scan, plan and price the full course before you commit.', from: 'consult is free' },
    { title: 'Emergency care', text: 'Broken tooth, lost filling or a sudden ache. Call before 10am and we will fit you in the same day.' },
    { title: 'Kids and teens', text: 'Short, unhurried visits for first-timers, sealants, and mouthguards for sports.', from: 'from $89' },
  ] satisfies ServiceItem[],
};
