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
  email: '[CONTACT_EMAIL]',
  phone: '[COMPANY_PHONE]',
  /** Digits only, with country code. Used for wa.me links. */
  whatsapp: '[WHATSAPP_NUMBER]',
  address: '[OFFICE_ADDRESS]',
  /** Only add profiles that exist. Empty = no social links rendered. */
  social: [] as { label: string; href: string }[],
};

export const channels = () => [
  { label: 'Email', value: site.email, href: isPlaceholder(site.email) ? null : `mailto:${site.email}` },
  { label: 'Phone', value: site.phone, href: isPlaceholder(site.phone) ? null : `tel:${site.phone.replace(/[^\d+]/g, '')}` },
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
  /** Project type preselected in the inquiry form by this module's link. Must exist in projectTypes. */
  type: string;
}

export const services: Service[] = [
  {
    title: 'Custom business software',
    breaks: 'Work that lives in spreadsheets, notebooks and one person’s memory.',
    solution:
      'Systems shaped around how your business actually runs: your workflow, your data, your rules. From a single internal tool to the system the whole company works in.',
    includes: ['Business management systems', 'Billing and inventory', 'Booking and scheduling', 'Database-driven systems', 'Internal tools'],
    glyph: 'slabs',
    type: 'Custom business software',
  },
  {
    title: 'Web, mobile and desktop apps',
    breaks: 'Customers and field staff on phones, while the software sits on a desk.',
    solution:
      'Web applications and portals, Android and iOS apps, and desktop software with offline-first storage where the connection cannot be trusted.',
    includes: ['Web applications', 'Customer portals', 'Mobile applications', 'Desktop and offline-first apps', 'Business websites'],
    glyph: 'frames',
    type: 'Web application or portal',
  },
  {
    title: 'Automation and integrations',
    breaks: 'The same data typed into three systems, every single day.',
    solution:
      'Scripts, scheduled jobs and integrations that move data between the tools you already use, and take the repetitive work off people.',
    includes: ['Business process automation', 'Scripts and scheduled jobs', 'System integrations and APIs', 'Reports and alerts'],
    glyph: 'cube',
    type: 'Automation or integration',
  },
  {
    title: 'Product design and identity',
    breaks: 'Software the team avoids because it is confusing.',
    solution:
      'Workflow mapping, prototypes tested with the people who will use them, and a component system that keeps every screen consistent. Brand identity when the product needs one.',
    includes: ['UI and UX design', 'Design systems', 'Prototyping', 'Brand identity'],
    glyph: 'compass',
    type: 'Design or branding',
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
// No client case study is published yet, so these are concept studies, always labelled as such.
// To publish a real project: add an entry with status 'client', only with the client's permission.

export type WorkStatus = 'client' | 'concept';
export type Artifact = 'receipt' | 'ledger' | 'flow';

export interface Work {
  title: string;
  status: WorkStatus;
  category: string;
  sector: string;
  problem: string;
  approach: string;
  artifact: Artifact;
  /** Project type preselected by the "discuss" link. Must exist in projectTypes. */
  type: string;
  /** Documented stack only. Empty = not shown. */
  stack: string[];
  /** Case-study page, only if one exists. */
  href: string | null;
}

export const statusLabel: Record<WorkStatus, string> = {
  client: 'Client project',
  concept: 'Concept study, not a client deployment',
};

export const work: Work[] = [
  {
    title: 'The counter that never waits',
    status: 'concept',
    category: 'Offline-first billing',
    sector: 'Retail',
    problem:
      'A billing tool that slows down at peak hours and stops when the internet does. Bills get written by hand and typed in later, with mistakes.',
    approach: 'Counter billing that saves every bill on the device and syncs when the connection returns.',
    artifact: 'receipt',
    type: 'Billing or inventory',
    stack: [],
    href: null,
  },
  {
    title: 'One schedule, every team',
    status: 'concept',
    category: 'Booking and scheduling',
    sector: 'Service businesses',
    problem: 'Bookings arrive by phone and chat, live in a paper diary, and clash. Staff find out about changes too late.',
    approach: 'Online booking, a shared staff calendar with automatic reminders, and a mobile app for the people doing the work.',
    artifact: 'ledger',
    type: 'Custom business software',
    stack: [],
    href: null,
  },
  {
    title: 'Five spreadsheets, retired',
    status: 'concept',
    category: 'Operations system',
    sector: 'Growing companies',
    problem: 'Tools that worked at ten people are held together with spreadsheets at a hundred. Departments disagree about which number is right.',
    approach:
      'One system replacing the duplicated sheets, with roles and permissions, an audit trail and current reports, introduced without stopping daily work.',
    artifact: 'flow',
    type: 'Custom business software',
    stack: [],
    href: null,
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

/* ---------------------------------------------------------------- inquiry form */

export const projectTypes = [
  'Custom business software',
  'Web application or portal',
  'Mobile app',
  'Desktop application',
  'Automation or integration',
  'Billing or inventory',
  'Website',
  'Design or branding',
  'Not sure yet',
];

/** Indicative ranges only, copied from the original site. Optional field. */
export const budgets = ['Not sure yet', 'Under ₹2 lakh', '₹2 to 5 lakh', '₹5 to 15 lakh', 'Above ₹15 lakh'];
