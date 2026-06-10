# AKAKIKA Site

New KIKA portfolio site for `akakika.com`: home, apps index, about, blog routes, and embedded static landing pages for individual tools.

## Run

```bash
npm install
npm run dev
```

The dev server uses Vite on port `3000`.

## Build

```bash
npm run build
```

The production output is written to `dist/`.

## Build Performance

`vite.config.ts` uses Rollup `manualChunks` to keep the production JavaScript below Vite's default large-chunk warning threshold.

Current manual chunks:

- `motion` for Motion animation code.
- `icons` for `lucide-react`.
- `markdown` for `react-markdown` and its markdown parser/rendering dependencies.

After changing dependencies or moving page code, run `npm run build` and check the chunk table. The main `index-*.js` chunk should stay below `500 kB` uncompressed. If the warning returns, prefer moving route-specific code or blog content behind lazy imports before raising `build.chunkSizeWarningLimit`.

## Deploy

This folder is linked to the Vercel project `akakika-v2`.

```bash
vercel deploy --prod -y --no-wait
```

After deploy, confirm readiness with:

```bash
vercel inspect <deployment-url>
```

The project has `akakika.com` and `www.akakika.com` attached in Vercel, so production deploys should list those under aliases when ready. Use manual alias commands only if Vercel does not attach the domains automatically.

Do not deploy the older Bobi/Astro projects for `akakika.com`; they were previous site shells and were removed from Vercel on 2026-05-18 to prevent domain mix-ups.

Removed Vercel projects:

- `bobiblog-astro`
- `bobiblog`

## Commit Workflow

Before every commit, review whether the change requires documentation updates.

- Update `README.md` for project behavior, local development, build, deploy, routing, or workflow changes.
- Update `CHANGELOG.md` for user-facing site/content changes.
- Update `AGENTS.md` for agent instructions, cleanup rules, screenshot rules, or process changes.
- If no docs need updating, call that out in the final summary for the work.

## App Landing Pages

The `/apps` page links directly to each app's real landing page:

- `https://github.com/aka-kika/Seedling` for Seedling, until it has a dedicated page
- `https://undrdr.com/` for UNDRDR, with old `/undrdr` paths redirected there
- `/brand`
- `/breakpoint/`
- `/localhostwatcher/`
- `/resq/`
- `/mochi/`
- `/clipsan/`
- `/focus/`
- `/folderwardrobe/`

Those landing pages live under `public/<app>/` and are copied by Vite into `dist/<app>/`.
GitHub-only app entries, such as Seedling, should link directly to GitHub and set `detailPage: false` so `/apps/<id>` does not create an accidental local page.

`vercel.json` has explicit redirects for migrated external projects and explicit rewrites for local app folders before the catch-all SPA rewrite. Keep app landing rewrites above:

```json
{ "source": "/(.*)", "destination": "/index.html" }
```

Otherwise app landing pages will be swallowed by the React app.

## Route Ownership

- `/brand` is served from `public/brand/` by this site.
- `/undrdr` and `/undrdr/*` are not served by this site. They redirect to `https://undrdr.com/`.
- Do not re-add UNDRDR rewrites, static `public/undrdr` bundles, `dist/undrdr` build copies, or sitemap entries under `akakika.com/undrdr`.

## Notes

- `/apps/<id>` is still supported by the React app as an internal fallback, but the visible apps index should send visitors to the standalone landing pages.
- `focus.akakika.com` currently returns `403`, so the Focus landing page is served at `/focus/` from this site.
- Local screenshots belong in `screenshots/`; root-level screenshots are not allowed. Public assets under `public/` are intentional site assets.
- Screenshot binaries are ignored by Git by default. See `screenshots/README.md` and `AGENTS.md` before adding visual captures.

## Templates

Reusable page starters live in `templates/`.

- `templates/blog-post-template.html` is the current wide, bold blog post template.
- Copy it into `public/blog/<slug>.html`, replace the placeholders, then add the post to the blog index and `vercel.json` rewrites when needed.

## Footer Contract

Keep site and blog footers minimal and consistent:

- `© KIKA 2026 / PERSONAL SOFTWARE LAB`
- `BUILT WITH AI AND TOO MUCH CURIOSITY.`
- one GitHub link to `https://github.com/aka-kika`

Avoid adding footer nav, product links, author cards, or store links unless the footer direction changes intentionally.
