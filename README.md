# VCRR — any software, built to your requirements

A second, self-contained VCRR website. It has the same Prompt design and colours as `../vcrr-surreal-modern-brutal`, but the copy is broadened: VCRR builds any kind of software from a business's requirements, and billing and inventory are one offering among many. Content lives in `src/data/site.ts`; "What we build" (`components/Builds.astro`) lists example software types.

- **Stack:** Astro 7 (static), plain CSS with tokens, a little vanilla TypeScript, and [Lenis](https://lenis.darkroom.engineering/) for smooth scrolling (the original site uses it too). No shared runtime with the original.
- **No backend, no analytics, no cookies, no third-party requests.** Fonts are self-hosted via Fontsource.

## Run it

Requires Node 22.12+. Run these from this folder:

```bash
npm install
npm run dev        # http://localhost:4325 (4321-4324 belong to the other two sites)
npm run build      # static site in dist/
npm run preview    # serve dist/ locally
npm run check      # Astro + TypeScript checks
npm test           # inquiry-form rules (node:test)
```

## Brand and motion

- **Brand (temporary, swappable).** Ink `#14110F`, Amber `#FFB000`, cream `#F3EDE3`. They are defined once at the top of `styles/global.css`. The mark is defined once: its chevron path is in `data/site.ts`, and `components/Wordmark.astro` is the small lockup. A rebrand means changing those two places plus `public/favicon.svg`.
- **Hero film** (`components/Hero.astro`). This is the "VCRR Prompt Motion" video rebuilt in CSS, not embedded. It stays crisp at every size and adds no video weight. `vcrr build --all` types out, the build log prints with amber `ok`s and a progress bar, the screen clears, and the V of VCRR tips onto its side to become the prompt. The tagline types and the block cursor drops in and blinks three times. It plays once, about 7.5 s. `--vx/--vy/--vs` on `.lockup` are the calibration for where the chevron poses as the V.
- **Scroll.** Lenis gives inertial smooth scrolling, and in-page links glide and stop below the sticky nav. The hero recedes as you scroll away. Each section's header rule fills like a build bar, with the amber cursor on its edge. Blocks reveal as they enter.
- **Structure and attitude.** There's a 12-column grid drawn behind every section, a type and spacing scale, and § numbered bands. Headlines are oversized uppercase, rules are 2px, corners are square, shadows are hard offsets, and modules invert on hover or focus.

## Structure

```
src/
  data/site.ts         all copy and facts (adapted from the original's src/data/site.ts)
  lib/inquiry.ts       form validation + brief text (tested in inquiry.test.ts)
  layouts/Base.astro   head/SEO, motion flag, nav, footer
  components/          Nav, Hero (the film), Manifesto, Services (+Glyph), Builds, Work,
                       Why, Process, Contact, Footer, SectionHead, Wordmark (the lockup)
  scripts/main.ts      Lenis, scroll-linked motion, reveals, "start with this" form preselect
  styles/global.css    tokens, surfaces, grid, buttons, motion
```

## Content: what is real and what is not

Everything comes from the original site. Nothing was invented. That means:

- **Contact details** (`[CONTACT_EMAIL]`, `[COMPANY_PHONE]`, `[WHATSAPP_NUMBER]`, `[OFFICE_ADDRESS]`) are still placeholders in the original. They show as plain text and become links automatically once set in `site.ts`. Social links are hidden while `social` is empty.
- **Work:** the original has no published case studies, only placeholders. The three entries are **concept studies, labelled on the page as "not a client deployment"**, built from the situations the original describes. Add real projects with `status: 'client'` only with the client's permission.
- **What we build:** the twelve entries in `builds` are examples of software types, not past projects. Edit or extend the list freely.
- **Commitments** (code ownership, written scope, tested backups, documentation) and the budget ranges are copied as-is. The original's README asks you to confirm these before launch.

## Inquiry form

The form validates in the browser (name, email, project type and a 20+ character description are required; company and budget are optional). It never claims a message was sent unless it was.

- **Now (no endpoint):** submitting shows *"Not sent — online sending is not connected yet"* and offers *Copy brief*, plus *Open in email app* once `site.email` is real.
- **To connect it:** set `PUBLIC_INQUIRY_ENDPOINT` at build time. The form POSTs JSON `{ name, email, company, projectType, budget, description, website }`. It shows *Received* only on a 2xx response and an error (keeping the answers) otherwise. The endpoint must re-validate every field, drop submissions where `website` (spam trap) is filled, rate-limit, and keep any keys server-side.

## Motion and accessibility

- `prefers-reduced-motion`: no film, no reveals, no Lenis (native scrolling). The finished lockup shows at once. Without JavaScript, the page is complete and static.
- No scroll hijacking, no custom cursor, no loading screen. The hero entrance is CSS only.
- Skip link, semantic landmarks and headings, a real `<table>` for the comparison (it becomes labelled records on phones), a native `popover` mobile menu (Escape closes it), visible focus everywhere, and inline form errors with `aria-invalid`. Decorative objects are `aria-hidden`; every fact they show is stated in text.

## Deploying

Set `SITE_URL` to the production origin (used for the canonical link and Open Graph). No `og:image` is set yet. Add a 1200×630 image and the tags in `layouts/Base.astro` once one exists.
