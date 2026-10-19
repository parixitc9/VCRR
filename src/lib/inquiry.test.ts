import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate, briefText, type Inquiry } from './inquiry.ts';

const types = ['Website', 'Not sure yet'];
const budgets = ['Not sure yet', 'Under ₹2 lakh'];
const ok: Inquiry = {
  name: 'Asha',
  email: 'asha@example.com',
  company: '',
  projectType: 'Website',
  budget: '',
  description: 'Our billing stops whenever the internet drops.',
};

test('a complete inquiry passes, optional fields may be empty', () => {
  assert.deepEqual(validate(ok, types, budgets), {});
});

test('required fields and formats are enforced', () => {
  const e = validate({ ...ok, name: ' ', email: 'asha@', projectType: 'Rocket', description: 'too short' }, types, budgets);
  assert.deepEqual(Object.keys(e).sort(), ['description', 'email', 'name', 'projectType']);
});

test('budget must come from the list when given', () => {
  assert.ok(validate({ ...ok, budget: 'A million' }, types, budgets).budget);
  assert.equal(validate({ ...ok, budget: 'Under ₹2 lakh' }, types, budgets).budget, undefined);
});

test('brief text marks empty optional fields', () => {
  assert.match(briefText(ok), /Company: Not specified/);
});
