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

## Deploy

This folder is linked to the Vercel project `akakika-v2`.

```bash
vercel --prod --yes
vercel alias set <deployment>.vercel.app akakika.com
vercel alias set <deployment>.vercel.app www.akakika.com
```

Do not deploy the older Bobi/Astro projects for `akakika.com`; they were previous site shells and were removed from Vercel on 2026-05-18 to prevent domain mix-ups.

Removed Vercel projects:

- `bobiblog-astro`
- `bobiblog`

## App Landing Pages

The `/apps` page links directly to each app's real landing page:

- `/breakpoint/`
- `/localhostwatcher/`
- `/dgmd/`
- `/resq/`
- `/mochi/`
- `/clipsan/`
- `/focus/`
- `/folderwardrobe/`

Those landing pages live under `public/<app>/` and are copied by Vite into `dist/<app>/`.

`vercel.json` has explicit rewrites for those app folders before the catch-all SPA rewrite. Keep app landing rewrites above:

```json
{ "source": "/(.*)", "destination": "/index.html" }
```

Otherwise app landing pages will be swallowed by the React app.

## Notes

- `/apps/<id>` is still supported by the React app as an internal fallback, but the visible apps index should send visitors to the standalone landing pages.
- `focus.akakika.com` currently returns `403`, so the Focus landing page is served at `/focus/` from this site.
- Root-level QA screenshots are ignored by Git. Public assets under `public/` are intentional site assets.

## Templates

Reusable page starters live in `templates/`.

- `templates/blog-post-template.html` is the current wide, bold blog post template.
- Copy it into `public/blog/<slug>.html`, replace the placeholders, then add the post to the blog index and `vercel.json` rewrites when needed.
