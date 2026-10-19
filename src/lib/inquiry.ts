/** Inquiry form rules, shared by the browser script and the test. Any future backend must re-check these server-side. */

export const FIELDS = ['name', 'email', 'company', 'projectType', 'budget', 'description'] as const;
export type Field = (typeof FIELDS)[number];
export type Inquiry = Record<Field, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validate(d: Inquiry, projectTypes: string[], budgets: string[]): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (!d.name.trim()) e.name = 'Tell us your name.';
  if (!d.email.trim()) e.email = 'Add an email address so we can reply.';
  else if (!EMAIL.test(d.email.trim())) e.email = 'That email looks incomplete. Check for a missing @ or domain.';
  if (!projectTypes.includes(d.projectType)) e.projectType = 'Choose the closest project type, or “Not sure yet”.';
  if (d.budget && !budgets.includes(d.budget)) e.budget = 'Choose a budget range from the list, or leave it empty.';
  const len = d.description.trim().length;
  if (len < 20) e.description = 'Describe the problem in a sentence or two (at least 20 characters).';
  else if (len > 2000) e.description = 'Keep it under 2000 characters. We will ask for the rest.';
  return e;
}

const LABELS: Record<Field, string> = {
  name: 'Name',
  email: 'Email',
  company: 'Company',
  projectType: 'Project type',
  budget: 'Budget',
  description: 'The problem',
};

export const briefText = (d: Inquiry) => FIELDS.map((f) => `${LABELS[f]}: ${d[f].trim() || 'Not specified'}`).join('\n');
