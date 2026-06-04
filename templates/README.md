# Templates

Reusable source files for creating new AKAKIKA pages.

## Blog Post

Use `blog-post-template.html` for new posts.

1. Copy it to `public/blog/<slug>.html`.
2. Replace every `{{PLACEHOLDER}}`.
3. Choose tool-shelf icons from `templates/icons/`.
4. Use only filenames in `{{ICON_N_FILE}}`, for example `codex_icon.png` or `PiecesOS-memory_app_icon.png`.
5. Keep rendered icon paths as `icons/<file>.png`; those resolve from `public/blog/`.
6. Copy any selected icon from `templates/icons/` to `public/blog/icons/` if it is not already there.
7. Replace the project link placeholders for app/project posts:
   - `{{PROJECT_LANDING_URL}}` and `{{PROJECT_LANDING_LABEL}}`
   - `{{PROJECT_GITHUB_URL}}` and `{{PROJECT_GITHUB_LABEL}}`
   - the landing image already points to `icons/home_icon_clean.png` for raw template previews
   - the GitHub image already points to `icons/github_icon.png` for raw template previews
8. Keep the project link block below the CTA unless the post is intentionally not about a project/app.
9. Add the post to the blog index in `src/App.tsx` if it should appear in `/blog`.
10. Save durable archive copies under `blogs/<slug>.html` and `blogs/<slug>.md` so the post is kept in the repo outside deploy output.
11. Add a Vercel rewrite in `vercel.json` if the extensionless route should work, for example:

```json
{ "source": "/blog/<slug>", "destination": "/blog/<slug>.html" }
```

The template uses the current wide, bold, developer-style blog design with the shared top navigation, post facts/share strip, tool shelf, CTA, project links, scroll reveal animation, progress bar, JSON-LD, and minimal footer.

Footer content should stay consistent with the rest of the site: the KIKA 2026 lab line, the build line, and one GitHub link only.

Common template icon choices live in `templates/icons/`. Shipping blog icons live in `public/blog/icons/`.

For SEO/GEO, keep the visible project link block and JSON-LD `sameAs` values aligned with the real landing page and GitHub repo.

## Markdown-Only Draft

Use `blog-structure-template.md` when you want to write only the structure/content first and leave the styled HTML UI pass for later.

1. Copy it to `blogs/<slug>.md`.
2. Replace the metadata, shelf icon filenames, sections, CTA, and final notes.
3. Keep icon values as filenames from `templates/icons/`.
4. Later, convert it into `public/blog/<slug>.html` using `blog-post-template.html`.
