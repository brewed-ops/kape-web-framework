// Words for the FAQ feature. These also become FAQPage schema (JSON-LD) automatically.
// Keep answers plain text: schema.org expects text, not markup.
export const faq = {
  heading: 'Questions people ask before booking',
  // TODO(owner): replace with the questions your customers really ask, with true answers
  items: [
    { question: 'Are you accepting new patients?', answer: 'Yes. Most new patients are seen within two days, and we keep a short list for same-day cancellations.' },
    { question: 'Which insurance plans do you accept?', answer: 'Most major PPO plans. Send us your plan name before the visit and we will confirm your coverage and what you would owe.' },
    { question: 'What if I do not have insurance?', answer: 'Our care membership covers two cleanings and exams a year for $39 a month and takes 20% off other treatment.' },
    { question: 'I am nervous about the dentist. Can you help?', answer: 'Yes. Tell us when you book. We slow down, explain each step first, and you can stop us at any point.' },
    { question: 'Do you treat children?', answer: 'Yes, from age three. First visits are short and mostly about getting comfortable in the chair.' },
    { question: 'What should I bring to my first visit?', answer: 'Photo ID, your insurance card if you have one, and a list of any medicines you take. Our checklist covers the rest.' },
  ],
};
