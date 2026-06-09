# AKAKIKA

[akakika.com](https://akakika.com) — portfolio, blog, apps, and the KIKA Brand Lab.

What you'll find:

| Page | What's there |
|------|-------------|
| `/` | Home — projects and about |
| `/apps` | App showcase |
| `/brand` | KIKA Brand Lab — local brand app |
| `/blog` | Blog posts |

UNDRDR is a separate site at [undrdr.com](https://undrdr.com/). Old `/undrdr` paths on `akakika.com` are permanent redirects to that site.

## Get started

```bash
npm install
npm run dev
```

Then open [localhost:3000](http://localhost:3000) in your browser.

## Publish

```bash
npm run build
```

The finished site ends up in the `dist` folder. Vercel handles hosting.

Production is the Vercel project `akakika-v2`, with `akakika.com` and `www.akakika.com` attached. Before deploying, run `git status --short --branch` and confirm the branch/commit you are about to deploy is the one you intend to ship.

## Route Ownership

- `/brand` is served from `public/brand/` by this site.
- `/undrdr` and `/undrdr/*` are not served by this site. They redirect to `https://undrdr.com/`.
- Do not re-add UNDRDR rewrites, `dist/undrdr` build copies, or sitemap entries under `akakika.com/undrdr`.
