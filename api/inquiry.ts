import { handleInquiry } from '../src/lib/inquiry-endpoint.ts';

// Vercel function at /api/inquiry. Settings come from the Vercel project's environment variables.
export const config = { runtime: 'edge' };

export default function handler(req: Request): Promise<Response> {
  return handleInquiry(req, process.env);
}
