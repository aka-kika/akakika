# Template Instructions

These instructions apply to files in `templates/`.

## Blog Template Rules

- Use `blog-post-template.html` as the source for static blog posts.
- Keep blog icon references in generated posts as `icons/<filename>`.
- Choose icon filenames from `templates/icons/`; this folder is the source palette for template work.
- When creating a real post in `public/blog/<slug>.html`, copy any selected icons from `templates/icons/` into `public/blog/icons/` if they are not already present.
- Do not reference icons from arbitrary folders, remote URLs, or the project root in blog templates.
- Keep placeholders explicit with the `{{PLACEHOLDER_NAME}}` format.
- For the tool shelf, use `{{ICON_N_FILE}}`, `{{ICON_N_NAME}}`, and `{{ICON_N_ROLE}}` placeholders.
