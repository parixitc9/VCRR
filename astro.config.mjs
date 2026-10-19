// @ts-check
import { defineConfig } from 'astro/config';

// Canonical URL and Open Graph need the real domain: set SITE_URL in the host's environment.
const site =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  'http://localhost:4325';

export default defineConfig({
  site,
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  // 4321-4324 belong to the other two sites, so both can run side by side
  server: { port: 4325 },
  build: { format: 'file', inlineStylesheets: 'always' },
});
