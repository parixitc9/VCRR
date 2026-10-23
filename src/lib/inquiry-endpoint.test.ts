import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleInquiry, type Env } from './inquiry-endpoint.ts';

const env: Env = { INQUIRY_SCRIPT_URL: 'https://script.example/exec', INQUIRY_SECRET: 'test-secret' };
const brief = {
  name: 'Asha',
  email: 'asha@example.com',
  company: '',
  projectType: 'Web application or portal',
  budget: '',
  description: 'Our billing stops whenever the internet drops.',
  website: '',
};

const post = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('https://vcrr.example/api/inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

/** A stand-in for the Apps Script; records what it was sent and answers with `answer`. */
function fakeScript(answer: () => Response) {
  const calls: { url: string; body: Record<string, string> }[] = [];
  const fetchFn = async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(input), body: JSON.parse(String(init?.body)) });
    return answer();
  };
  return { calls, fetchFn };
}
const ok = () => new Response(JSON.stringify({ ok: true }));

test('a valid brief goes to the script with the secret and the visitor IP', async () => {
  const script = fakeScript(ok);
  const res = await handleInquiry(post(brief, { 'x-forwarded-for': '203.0.113.7, 10.0.0.1' }), env, script.fetchFn);
  assert.equal(res.status, 200);
  assert.equal(script.calls.length, 1);
  assert.equal(script.calls[0].url, env.INQUIRY_SCRIPT_URL);
  assert.equal(script.calls[0].body.secret, 'test-secret');
  assert.equal(script.calls[0].body.ip, '203.0.113.7');
  assert.equal(script.calls[0].body.email, 'asha@example.com');
});

test('a filled honeypot gets a success answer and sends nothing', async () => {
  const script = fakeScript(ok);
  const res = await handleInquiry(post({ ...brief, website: 'http://spam.example' }), env, script.fetchFn);
  assert.equal(res.status, 200);
  assert.equal(script.calls.length, 0);
});

test('an invalid brief is refused before anything is sent', async () => {
  const script = fakeScript(ok);
  const res = await handleInquiry(post({ ...brief, name: '', projectType: 'Rocket' }), env, script.fetchFn);
  assert.equal(res.status, 400);
  assert.deepEqual(Object.keys(((await res.json()) as { fields: object }).fields).sort(), ['name', 'projectType']);
  assert.equal(script.calls.length, 0);
});

test('the script decides the rate limit, the visitor sees 429', async () => {
  const script = fakeScript(() => new Response(JSON.stringify({ ok: false, error: 'limit' })));
  const res = await handleInquiry(post(brief), env, script.fetchFn);
  assert.equal(res.status, 429);
});

test('a script that is down or refuses gives an error, never a success', async () => {
  const down = await handleInquiry(post(brief), env, async () => {
    throw new TypeError('fetch failed');
  });
  assert.equal(down.status, 502);

  const refused = await handleInquiry(post(brief), env, fakeScript(() => new Response('<html>denied</html>')).fetchFn);
  assert.equal(refused.status, 502);
});

test('bad requests are turned away: wrong method, bad JSON, too large, not configured', async () => {
  const script = fakeScript(ok);
  assert.equal((await handleInquiry(new Request('https://vcrr.example/api/inquiry'), env, script.fetchFn)).status, 405);
  assert.equal((await handleInquiry(post('{not json'), env, script.fetchFn)).status, 400);
  assert.equal((await handleInquiry(post({ ...brief, description: 'x'.repeat(10_001) }), env, script.fetchFn)).status, 413);
  assert.equal((await handleInquiry(post(brief), {}, script.fetchFn)).status, 500);
  assert.equal(script.calls.length, 0);
});
