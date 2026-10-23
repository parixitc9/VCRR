/**
 * All copy and business facts for the VCRR site. Practices, commitments and contact placeholders come from the
 * original site's src/data/site.ts. Anything in [SQUARE_BRACKETS] is still a placeholder: replace it with the
 * verified value. Placeholder contact values render as plain text, never as a link.
 */

export const isPlaceholder = (v: string | null | undefined): boolean => !v || /^\[.*\]$/.test(v.trim());

/** The "Prompt" mark: a V turned on its side (viewBox 0 0 122 148). The amber block cursor sits beside it. */
export const chevron = 'M0 0h49l73 74-73 74H0l74-74Z';

export const site = {
  name: 'VCRR',
  tagline: 'Software · Apps · Automation',
  description:
    'VCRR is a software studio founded by four partners. Any kind of software, built to your business requirements: business systems, web and mobile apps, desktop tools and automation.',
  email: 'vcrrit@gmail.com',
  /** Indian mobile numbers, shown with country code. Each one gets a tel: link. */
  phones: ['+91 98248 02936', '+91 94278 18152', '+91 96645 88257', '+91 70466 98582'],
  /** Shown with country code. Its digits feed the wa.me link. */
  whatsapp: '+91 70466 98582',
  /** Only add profiles that exist. Empty = no social links rendered. */
  social: [] as { label: string; href: string }[],
};

export const channels = () => [
  { label: 'Email', value: site.email, href: isPlaceholder(site.email) ? null : `mailto:${site.email}` },
  ...site.phones.map((p) => ({ label: 'Phone', value: p, href: isPlaceholder(p) ? null : `tel:${p.replace(/[^\d+]/g, '')}` })),
  { label: 'WhatsApp', value: site.whatsapp, href: isPlaceholder(site.whatsapp) ? null : `https://wa.me/${site.whatsapp.replace(/\D/g, '')}` },
];

export const nav = [
  { href: '#services', label: 'Services' },
  { href: '#builds', label: 'What we build' },
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

/* ------------------------------------------------------------------ manifesto */

export const manifesto = [
  {
    tag: 'On function',
    line: 'Useful software should do more than function.',
    note: 'It should remove friction, reveal possibilities, and make complicated things feel simple.',
  },
  {
    tag: 'On problems',
    line: 'Most failed software solved the wrong problem well.',
    note: 'So we spend the first weeks finding the right one.',
  },
  {
    tag: 'On requirements',
    line: 'Your requirements first. Technology second.',
    note: 'We choose the stack after we understand the problem, not before.',
  },
  {
    tag: 'On time',
    line: 'Leave it maintainable.',
    note: 'Readable code, recorded decisions and tested backups, so the system outlives the project.',
  },
];

export const principles = [
  { title: 'Understand before building.', body: 'Most failed software solved the wrong problem well. We spend the first weeks finding the right one.' },
  { title: 'Prefer proven technology.', body: 'Tools are chosen for how long they will be supported and how easy they are to hire for, not for how new they are.' },
  { title: 'Say what we do not know.', body: 'Estimates come with their assumptions. Risks are raised when we see them, not at the deadline.' },
  { title: 'Leave it maintainable.', body: 'Readable code, recorded decisions and tested backups, so the system outlives the project.' },
];

/* ------------------------------------------------------------------- services */

export type Glyph = 'slabs' | 'cube' | 'frames' | 'compass';

export interface Service {
  title: string;
  breaks: string;
  solution: string;
  includes: string[];
  glyph: Glyph;
}

export const services: Service[] = [
  {
    title: 'Custom business software',
    breaks: 'Work that lives in spreadsheets, notebooks and one person’s memory.',
    solution:
      'Systems shaped around how your business actually runs: your workflow, your data, your rules. From a single internal tool to the system the whole company works in.',
    includes: ['Business management systems', 'Billing and inventory', 'Booking and scheduling', 'Database-driven systems', 'Internal tools'],
    glyph: 'slabs',
  },
  {
    title: 'Web, mobile and desktop apps',
    breaks: 'Customers and field staff on phones, while the software sits on a desk.',
    solution:
      'Web applications and portals, Android and iOS apps, and desktop software with offline-first storage where the connection cannot be trusted.',
    includes: ['Web applications', 'Customer portals', 'Mobile applications', 'Desktop and offline-first apps', 'Business websites'],
    glyph: 'frames',
  },
  {
    title: 'Automation and integrations',
    breaks: 'The same data typed into three systems, every single day.',
    solution:
      'Scripts, scheduled jobs and integrations that move data between the tools you already use, and take the repetitive work off people.',
    includes: ['Business process automation', 'Scripts and scheduled jobs', 'System integrations and APIs', 'Reports and alerts'],
    glyph: 'cube',
  },
  {
    title: 'Product design and identity',
    breaks: 'Software the team avoids because it is confusing.',
    solution:
      'Workflow mapping, prototypes tested with the people who will use them, and a component system that keeps every screen consistent. Brand identity when the product needs one.',
    includes: ['UI and UX design', 'Design systems', 'Prototyping', 'Brand identity'],
    glyph: 'compass',
  },
];

/* --------------------------------------------------------------- what we build */
// Examples, not a menu: the point is that the requirement decides what gets built.

export const builds = [
  { name: 'Business management systems', eg: 'ERP-style operations, approvals, roles and audit trail' },
  { name: 'CRM and sales tools', eg: 'Leads, follow-ups, quotations and pipelines' },
  { name: 'Billing and point of sale', eg: 'Invoices, GST, receipts and payment reminders' },
  { name: 'Inventory and warehousing', eg: 'Stock, batches, locations and reorder levels' },
  { name: 'Booking and scheduling', eg: 'Appointments, staff calendars and reminders' },
  { name: 'HR and attendance', eg: 'Staff records, leave, shifts and attendance' },
  { name: 'Customer and vendor portals', eg: 'Orders, documents and status, self-served' },
  { name: 'Dashboards and reports', eg: 'The numbers you check every day, in one place' },
  { name: 'E-commerce and catalogues', eg: 'Products, orders and delivery for your own store' },
  { name: 'Field and mobile apps', eg: 'Work that happens on the move, with or without signal' },
  { name: 'Desktop and offline-first tools', eg: 'Software that keeps working when the internet does not' },
  { name: 'Automation and integrations', eg: 'Scripts, scheduled jobs and APIs between your tools' },
];

/* ----------------------------------------------------------------------- work */
// Live projects. Each entry links to the working site.

export type Artifact = 'receipt' | 'ledger' | 'flow';

export interface Work {
  title: string;
  category: string;
  sector: string;
  problem: string;
  approach: string;
  artifact: Artifact;
  /** Documented stack only. Empty = not shown. */
  stack: string[];
  /** The live site. */
  url: string;
}

export const work: Work[] = [
  {
    title: 'Counterly',
    category: 'Billing and inventory',
    sector: 'Shops, wholesalers and small factories',
    problem: 'Shops and small factories need GST invoices, stock and real profit in one place.',
    approach: 'A Windows app that keeps everything on your own PC: GST tax invoices, stock lots and gross profit on every sale.',
    artifact: 'receipt',
    stack: [],
    url: 'https://counterlyweb.vercel.app',
  },
  {
    title: 'The Brown Print',
    category: 'Photography and film studio',
    sector: 'Weddings, concerts and events across Canada',
    problem: 'Film and photography from many kinds of events needs one place to browse, and one way for people to get in touch.',
    approach: 'A landing gate into a WebGL archive of the work, a page for each category, and an enquiry form that confirms on its own page.',
    artifact: 'ledger',
    stack: ['HTML', 'CSS', 'JavaScript', 'WebGL'],
    url: 'https://thebrownprint.vercel.app',
  },
  {
    title: 'parixit.dev',
    category: 'Personal portfolio and client websites',
    sector: 'Businesses, worldwide',
    problem: 'A business needs a website that looks serious, without a long agency process.',
    approach: 'Design, code and launch handled end to end by one full-stack developer.',
    artifact: 'ledger',
    stack: [],
    url: 'https://www.parixit.dev',
  },
  {
    title: 'YantraShruti 2026',
    category: 'Event site and shortlisting',
    sector: 'College hackathon',
    problem: 'Team registrations, project files and the shortlist need to live in one place, not scattered across email and folders.',
    approach:
      'Team registration and PDF upload on the event site, saved to a shared sheet, with shortlist tracking and shortlist emails sent from the sheet.',
    artifact: 'flow',
    stack: ['Google Apps Script', 'Google Sheets', 'Google Drive'],
    url: 'https://yantrashruti.vercel.app',
  },
];

/* -------------------------------------------------------------------- why */

export const risks = [
  {
    title: 'Off-the-shelf almost fits.',
    without: 'Workarounds pile up around the part it does not do, and you pay for features nobody uses.',
    with: 'Software built for exactly how you work, and nothing you do not need.',
  },
  {
    title: 'The data lives in five places.',
    without: 'The same numbers are typed into several systems and never quite agree.',
    with: 'One system of record, connected to the tools you keep.',
  },
  {
    title: 'One person holds the process.',
    without: 'When they are away, the work stops or gets done a different way each time.',
    with: 'The workflow lives in the software, with roles and permissions, instead of in a sheet only one person understands.',
  },
  {
    title: 'The data was never backed up.',
    without: 'A failed disk or a stolen laptop can take years of records with it.',
    with: 'Automatic, encrypted, off-site backups, with a restore procedure that has actually been tried.',
  },
  {
    title: 'Requirements were never agreed.',
    without: 'The project runs over, and the result solves a problem slightly different from yours.',
    with: 'Discovery ends in a written scope and acceptance criteria before development begins.',
  },
];

export const commitments = [
  { title: 'You own the code and the data.', body: 'Source code, database and access credentials are handed over at the end of the project.' },
  { title: 'Scope is written down first.', body: 'Requirements, assumptions, exclusions and acceptance criteria are agreed in writing.' },
  { title: 'Backups are tested, not assumed.', body: 'Before launch, a backup is restored to a clean machine.' },
  { title: 'Documentation comes with it.', body: 'How the system works, how to run it and how to change it, written for the next engineer.' },
];

/* -------------------------------------------------------------------- process */

export const steps = [
  {
    step: 'Discover',
    body: 'Understand how the business really runs: the people, the paperwork, the constraints and the edge cases.',
    deliverable: 'A map of current workflows and the problems worth solving first.',
  },
  {
    step: 'Define',
    body: 'Turn what we learned into requirements, scope, priorities and success criteria you can check.',
    deliverable: 'A written scope with assumptions, exclusions and acceptance criteria.',
  },
  {
    step: 'Design',
    body: 'Work out the flows, prototype the key screens and test them with the people who will use them.',
    deliverable: 'A clickable prototype and a consistent interface system.',
  },
  {
    step: 'Build',
    body: 'Build in short increments with code review, automated tests and regular demonstrations on realistic data.',
    deliverable: 'Working software you can try throughout, not only at the end.',
  },
  {
    step: 'Validate',
    body: 'Check behaviour, security, usability, performance and recovery against the agreed criteria.',
    deliverable: 'A test summary and a rehearsed backup restore.',
  },
  {
    step: 'Deliver',
    body: 'Deploy, migrate data, train the team and hand over documentation, then support the system in daily use.',
    deliverable: 'A running system, documentation and an agreed support arrangement.',
  },
];
