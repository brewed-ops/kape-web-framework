/*
  Words for the legal pages. TEMPLATES, NOT LEGAL ADVICE.
  Every business-specific fact is marked [CONFIRM: ...]. Resolve each marker (or delete the
  sentence) before launch, then have a qualified person review the result for your jurisdiction.
  Each document is dated on its own: edit legal.privacyUpdated / termsUpdated / cookiesUpdated in
  src/config/site.ts, and only when that document really changes.
*/

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export interface SubProcessor {
  name: string;
  purpose: string;
  data: string;
  location: string;
}

export interface LegalDocContent {
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: LegalSection[];
}

export const privacy: LegalDocContent & { processors: SubProcessor[]; processorsHeading: string; processorsIntro: string } = {
  title: 'Privacy Policy',
  description: 'What personal information this website collects, why, how long it is kept, who processes it, and how to ask for access or deletion.',
  h1: 'Privacy policy',
  intro: 'This policy explains what personal information we collect through this website, why we collect it, and the choices you have. It is written in plain language on purpose.',
  sections: [
    {
      heading: 'Who we are',
      paragraphs: ['This website is operated by the business named in the footer. [CONFIRM: legal entity name, registered address and, if required, a data protection contact or representative]'],
    },
    {
      heading: 'What we collect',
      paragraphs: ['We collect only what you give us and a small amount of technical data needed to keep the site secure.'],
      list: [
        'Contact and opt-in forms: your name, email address and the message you write. [CONFIRM: remove or add fields to match the forms you actually run]',
        'Technical data: your IP address and browser details, processed by our hosting provider to deliver the site and block abuse. [CONFIRM: retention period of host logs]',
        'Bot check: Cloudflare Turnstile reads limited browser signals to tell people from bots.',
        '[CONFIRM: analytics, advertising pixels or booking tools, if any. Delete this line if there are none]',
      ],
    },
    {
      heading: 'Why we use it',
      list: [
        'To reply to your message or send what you asked for.',
        'To keep the website secure and stop spam and abuse.',
        '[CONFIRM: marketing email, only if you send it and only with consent]',
      ],
    },
    {
      heading: 'Our legal basis',
      paragraphs: ['Where the law asks for one: we reply to you because you asked us to (taking steps at your request), and we secure the site because we have a legitimate interest in doing so. [CONFIRM: basis for each purpose under the law that applies to you, for example GDPR or CCPA]'],
    },
    {
      heading: 'How long we keep it',
      paragraphs: ['Contact messages are kept for [CONFIRM: retention period, for example 12 months] after your last message, then deleted. Opt-in subscribers are kept until they unsubscribe. [CONFIRM]'],
    },
    {
      heading: 'Who we share it with',
      paragraphs: ['We do not sell personal information. We share it only with the sub-processors listed below, who handle it on our behalf, and where the law requires it.'],
    },
    {
      heading: 'Your rights',
      paragraphs: ['Depending on where you live you can ask us to give you a copy of your data, correct it, delete it, restrict or object to its use, or send it to you in a portable format. To use any of these, email us from the address you used with us. We answer within [CONFIRM: 30 days]. You can also complain to your local data protection authority.'],
    },
    {
      heading: 'International transfers',
      paragraphs: ['Some of our sub-processors are based outside your country. [CONFIRM: transfer mechanism, for example standard contractual clauses]'],
    },
    {
      heading: 'Children',
      paragraphs: ['This website is not aimed at children under 13 [CONFIRM: or 16 in your region], and we do not knowingly collect their information.'],
    },
    {
      heading: 'Changes to this policy',
      paragraphs: ['When this policy changes in a way that matters, we update the date at the top of this page. The date changes only when this document changes.'],
    },
    {
      heading: 'Contact',
      paragraphs: ['Questions or requests about your data: use the email address and postal address shown in the footer and on the contact page.'],
    },
  ],
  processorsHeading: 'Sub-processors',
  processorsIntro: 'Every company that touches your data on our behalf. One new service adds one row.',
  // CONFIRM: keep this list true. Add a row for each tool you connect (email sender, CRM, analytics, AI provider, storage).
  processors: [
    { name: 'Cloudflare, Inc.', purpose: 'Hosting, network security, Turnstile bot check', data: 'IP address, browser signals', location: 'Global network' },
    { name: '[CONFIRM: form webhook destination, for example your CRM or automation tool]', purpose: 'Receives form submissions so we can reply', data: 'Name, email, message', location: '[CONFIRM]' },
    { name: '[CONFIRM: email provider]', purpose: 'Sends our replies', data: 'Name, email, message', location: '[CONFIRM]' },
  ],
};

export const terms: LegalDocContent = {
  title: 'Terms of Service',
  description: 'The rules for using this website: what it offers, acceptable use, bookings and payments, liability limits and how to contact us.',
  h1: 'Terms of service',
  intro: 'By using this website you agree to these terms. If you do not agree, please do not use it.',
  sections: [
    {
      heading: 'What this website is',
      paragraphs: ['This website describes the services of the business named in the footer and lets you contact us. Information here is general and may change. [CONFIRM: regulated advice disclaimer for your profession, for example that nothing here is medical, legal or financial advice]'],
    },
    {
      heading: 'Using the website',
      paragraphs: ['You agree not to misuse the website. In particular you will not:'],
      list: ['attempt to break, probe or overload it', 'send spam or unlawful content through our forms', 'copy our content for commercial use without permission', 'use automated tools to submit forms'],
    },
    {
      heading: 'Bookings, services and payments',
      paragraphs: ['A message through this website is a request, not a confirmed booking, until we confirm it. [CONFIRM: cancellation window, deposit and late fees]', 'Prices shown are guides and are confirmed in writing before work starts. [CONFIRM: taxes, payment methods and invoicing terms]'],
    },
    {
      heading: 'Refunds',
      paragraphs: ['[CONFIRM: state plainly whether refunds exist and when. A blanket "no refunds" does not remove rights you have under consumer law.]'],
    },
    {
      heading: 'Our content',
      paragraphs: ['The text, images and design of this website belong to us or our licensors. You may share links to it freely.'],
    },
    {
      heading: 'Suspension',
      paragraphs: ['We may block access to the website or refuse a request if these terms are broken or the site is being abused.'],
    },
    {
      heading: 'Liability',
      paragraphs: ['We take care to keep this website accurate and available, but we provide it as is. To the extent the law allows, we are not liable for indirect losses that come from using it. Nothing in these terms limits liability that cannot be limited by law, and nothing overrides your consumer rights. [CONFIRM: liability cap, if any, reviewed for your jurisdiction]'],
    },
    {
      heading: 'Governing law',
      paragraphs: ['These terms are governed by the laws of [CONFIRM: state or country]. [CONFIRM: venue for disputes]'],
    },
    {
      heading: 'Changes',
      paragraphs: ['We may update these terms. The date at the top changes only when this document changes.'],
    },
    {
      heading: 'Contact',
      paragraphs: ['Use the email and postal address in the footer.'],
    },
  ],
};

export const cookies: LegalDocContent & { tableHeading: string; cookies: { name: string; provider: string; purpose: string; duration: string; consent: string }[] } = {
  title: 'Cookie Policy',
  description: 'Which cookies and similar storage this website uses, what each one does, how long it lasts and how to control or refuse them.',
  h1: 'Cookie policy',
  intro: 'A strictly necessary cookie only needs disclosing. Analytics and advertising cookies need your consent first. This page lists both kinds.',
  sections: [
    {
      heading: 'What this website sets',
      paragraphs: [
        'By default this starter sets no cookies of its own, runs no analytics and loads no advertising scripts. The bot check on the contact and opt-in forms is supplied by Cloudflare and may use limited browser storage to tell people from bots. [CONFIRM: verify in your browser dev tools (Application > Cookies and Local Storage) after the forms are live, then fix the table below to match]',
      ],
    },
    {
      heading: 'Analytics and advertising',
      paragraphs: ['[CONFIRM: if you add analytics, advertising pixels or embedded video, list each one in the table and load it only after the visitor agrees through a consent banner. If you add none, keep this sentence: we use no analytics or advertising cookies.]'],
    },
    {
      heading: 'How to control cookies',
      paragraphs: ['Every browser lets you block or delete cookies in its settings. Blocking the bot check may stop the forms from working, in which case please contact us by phone or email.'],
    },
    {
      heading: 'Contact',
      paragraphs: ['Questions about cookies: use the email address in the footer.'],
    },
  ],
  tableHeading: 'Cookies and storage in use',
  // CONFIRM: keep this table true. Remove the example row if nothing is set after you check.
  cookies: [
    { name: '[CONFIRM: Turnstile cookie or storage key, if any]', provider: 'Cloudflare', purpose: 'Bot check on forms', duration: '[CONFIRM]', consent: 'Strictly necessary' },
  ],
};
