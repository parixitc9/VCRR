/**
 * Server side of the inquiry form. It re-checks every field, drops spam, and passes the brief to the Google Apps Script
 * that emails it. The browser never sees the script URL or the secret: both are environment variables on the host.
 */
import { FIELDS, validate, type Inquiry } from './inquiry.ts';
import { projectTypes, budgets } from '../data/site.ts';

export interface Env {
  /** Apps Script web app URL (ends in /exec). Server-only: never give it a PUBLIC_ name. */
  INQUIRY_SCRIPT_URL?: string;
  /** Shared with the Apps Script, so nothing but this function can reach it. */
  INQUIRY_SECRET?: string;
}

type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

const MAX_BODY_BYTES = 10_000;

const reply = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export async function handleInquiry(req: Request, env: Env, fetchFn: FetchLike = fetch): Promise<Response> {
  if (req.method !== 'POST') return reply(405, { ok: false, error: 'method' });

  const text = await req.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) return reply(413, { ok: false, error: 'too-large' });

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return reply(400, { ok: false, error: 'invalid' });
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return reply(400, { ok: false, error: 'invalid' });
  const fields = parsed as Record<string, unknown>;

  // Spam trap: people never see this field, bots fill it in. Answer as if it worked, and send nothing.
  if (typeof fields.website === 'string' && fields.website.trim() !== '') return reply(200, { ok: true });

  const data = {} as Inquiry;
  for (const f of FIELDS) {
    const v = fields[f];
    data[f] = typeof v === 'string' ? v.trim() : '';
  }
  const errors = validate(data, projectTypes, budgets);
  if (Object.keys(errors).length) return reply(400, { ok: false, error: 'invalid', fields: errors });

  if (!env.INQUIRY_SCRIPT_URL || !env.INQUIRY_SECRET) return reply(500, { ok: false, error: 'not-configured' });

  // Vercel sets this header to the visitor's address. The script uses it for its own rate limit.
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  let res: Response;
  try {
    res = await fetchFn(env.INQUIRY_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, ip, secret: env.INQUIRY_SECRET }),
      redirect: 'follow',
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    console.error('Inquiry script unreachable:', err);
    return reply(502, { ok: false, error: 'unreachable' });
  }

  const result = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (result?.ok) return reply(200, { ok: true });
  if (result?.error === 'limit') return reply(429, { ok: false, error: 'limit' });
  // Lands in the Vercel function logs, so a failing script is never silent.
  console.error('Inquiry script failed:', result?.error ?? `HTTP ${res.status} without a JSON answer`);
  return reply(502, { ok: false, error: 'failed' });
}
