# Templates

Reusable source files for creating new AKAKIKA pages.

## Blog Post

Use `blog-post-template.html` for new posts.

1. Copy it to `public/blog/<slug>.html`.
2. Replace every `{{PLACEHOLDER}}`.
3. Keep icon paths as `icons/<file>.png`; those resolve from `public/blog/`.
4. Add the post to the blog index in `src/App.tsx` if it should appear in `/blog`.
5. Add a Vercel rewrite in `vercel.json` if the extensionless route should work, for example:

```json
{ "source": "/blog/<slug>", "destination": "/blog/<slug>.html" }
```

The template uses the current wide, bold, developer-style blog design with the shared top navigation, post facts/share strip, tool shelf, scroll reveal animation, progress bar, and minimal footer.

Footer content should stay consistent with the rest of the site: the KIKA 2026 lab line, the build line, and one GitHub link only.

Common icon choices live in `public/blog/icons/`.
