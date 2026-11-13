// Words for the Work feature: selected projects (portfolio sites). Images live in public/images/.
export interface WorkItem {
  title: string;
  summary: string;
  result: string;
  year: string;
  image: { src: string; alt: string };
}

export const work = {
  heading: 'Selected cases',
  lead: 'A few of the treatments we are proudest of, shared with patient consent.',
  // TODO(owner): replace with real projects, real results and your own photos (with permission)
  items: [
    { title: 'Full-mouth restoration', summary: 'Worn and broken teeth rebuilt over four visits, planned and priced up front.', result: 'Eating comfortably again within a week', year: '2025', image: { src: '/images/work-1.svg', alt: 'Placeholder illustration of a restoration case study' } },
    { title: 'Aligners for an adult smile', summary: 'Eleven months of clear aligners for crowding that had bothered the patient for decades.', result: 'Finished two weeks ahead of plan', year: '2025', image: { src: '/images/work-2.svg', alt: 'Placeholder illustration of an aligner case study' } },
    { title: 'A first visit after ten years', summary: 'An anxious patient, a slow plan, and a clear order of what to fix first.', result: 'Booked every check-up since', year: '2024', image: { src: '/images/work-3.svg', alt: 'Placeholder illustration of a nervous-patient case study' } },
  ] satisfies WorkItem[],
};
