// Words for the Proof feature: testimonials and a rating line.
export interface Quote {
  text: string;
  name: string;
  detail: string;
}

export const proof = {
  heading: 'What patients say',
  // TODO(owner): use real reviews you have permission to quote, with the real source and count
  rating: { value: '4.9', outOf: '5', source: '312 Google reviews' },
  featured: {
    text: 'I had avoided the dentist for six years. They never made me feel bad about it, and my plan was on paper before I left the chair.',
    name: 'Priya S.',
    detail: 'Patient since 2022, Portland',
  } satisfies Quote,
  others: [
    { text: 'My son asked when he could go back. That has never happened before.', name: 'Daniel R.', detail: 'Parent of two' },
    { text: 'Cracked a tooth on a Tuesday, crown fitted on Wednesday. No runaround.', name: 'Meera K.', detail: 'Patient since 2020' },
  ] satisfies Quote[],
};
