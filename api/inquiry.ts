import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleInquiry } from '../src/lib/inquiry-endpoint.ts';

// Vercel Node function at /api/inquiry. Settings come from the Vercel project's environment variables.
// It runs on the Node runtime, which bundles the shared code without trouble; the edge runtime could not.
export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  const request = new Request(`https://${req.headers.host ?? 'localhost'}${req.url ?? '/'}`, {
    method: req.method,
    headers: pick(req.headers, ['content-type', 'x-forwarded-for']),
    body: await readBody(req),
  });
  const response = await handleInquiry(request, process.env);
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.end(await response.text());
}

async function readBody(req: IncomingMessage & { body?: unknown }): Promise<string | undefined> {
  if (req.method === 'GET' || req.method === 'HEAD') return undefined;
  // Vercel may already have read and parsed the body. If so, use that: the stream is spent.
  if (typeof req.body === 'string') return req.body;
  if (req.body !== undefined) return JSON.stringify(req.body);
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function pick(headers: IncomingMessage['headers'], names: string[]) {
  const out = new Headers();
  for (const name of names) {
    const value = headers[name];
    if (typeof value === 'string') out.set(name, value);
  }
  return out;
}
