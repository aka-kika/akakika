# {{POST_TITLE}}

<!--
  KIKA blog structure template.

  Use this when you want to draft only the article structure/content first.
  Later, Codex can turn this Markdown into the styled HTML blog UI using:
    templates/blog-post-template.html

  Icon rule:
  - Choose icon filenames from templates/icons/.
  - Use only filenames below, not full paths.
  - When this becomes a real blog post, selected icons should exist in public/blog/icons/.
-->

## Post Metadata

- Slug: `{{POST_SLUG}}`
- Title: `{{POST_TITLE}}`
- Description: `{{POST_DESCRIPTION}}`
- Category: `{{CATEGORY}}`
- Month/year: `{{MONTH_YEAR}}`
- Publish date: `{{POST_DATE}}`
- Read time: `{{READ_TIME}}`
- Canonical URL: `https://akakika.com/blog/{{POST_SLUG}}`
- CTA URL: `{{CTA_URL}}`
- Landing page URL: `{{PROJECT_LANDING_URL}}`
- GitHub repo URL: `{{PROJECT_GITHUB_URL}}`

## Hero

Deck:

> {{POST_DECK}}

## Tool Shelf

Shelf label: `{{SHELF_LABEL}}`

Shelf summary: `{{SHELF_SUMMARY}}`

| Slot | Icon file from `templates/icons/` | Name | Role |
| --- | --- | --- | --- |
| 1 | `{{ICON_1_FILE}}` | `{{ICON_1_NAME}}` | `{{ICON_1_ROLE}}` |
| 2 | `{{ICON_2_FILE}}` | `{{ICON_2_NAME}}` | `{{ICON_2_ROLE}}` |
| 3 | `{{ICON_3_FILE}}` | `{{ICON_3_NAME}}` | `{{ICON_3_ROLE}}` |
| 4 | `{{ICON_4_FILE}}` | `{{ICON_4_NAME}}` | `{{ICON_4_ROLE}}` |

## Opening

{{OPENING_PARAGRAPH}}

{{SECOND_PARAGRAPH}}

## {{SECTION_1_LABEL}}: {{SECTION_1_TITLE}}

{{SECTION_1_PARAGRAPH}}

- {{SECTION_1_BULLET_1}}
- {{SECTION_1_BULLET_2}}
- {{SECTION_1_BULLET_3}}

## {{SECTION_2_LABEL}}: {{SECTION_2_TITLE}}

{{SECTION_2_PARAGRAPH}}

Pull quote:

> {{PULL_QUOTE}}

### {{SUBSECTION_TITLE}}

{{SUBSECTION_PARAGRAPH}}

1. **{{STEP_1_TITLE}}** {{STEP_1_BODY}}
2. **{{STEP_2_TITLE}}** {{STEP_2_BODY}}
3. **{{STEP_3_TITLE}}** {{STEP_3_BODY}}

## CTA

- Title: `{{CTA_TITLE}}`
- Copy: `{{CTA_COPY}}`
- Label: `{{CTA_LABEL}}`
- URL: `{{CTA_URL}}`

## Project Links

- Label: `{{PROJECT_LINKS_LABEL}}`
- Landing page label: `{{PROJECT_LANDING_LABEL}}`
- Landing page URL: `{{PROJECT_LANDING_URL}}`
- GitHub label: `{{PROJECT_GITHUB_LABEL}}`
- GitHub repo URL: `{{PROJECT_GITHUB_URL}}`
- GitHub icon file: `{{PROJECT_GITHUB_ICON_FILE}}`

## {{FINAL_SECTION_LABEL}}: {{FINAL_SECTION_TITLE}}

{{FINAL_SECTION_PARAGRAPH}}

## Conversion Notes For Codex

When converting this Markdown draft into the styled blog UI:

1. Use `templates/blog-post-template.html` as the visual template.
2. Replace matching `{{PLACEHOLDER}}` values from this file.
3. Keep final icon paths in HTML as `icons/<filename>`.
4. Copy any missing selected icons from `templates/icons/` to `public/blog/icons/`.
5. Include the landing page and GitHub repo project links after the CTA, using `home_icon_clean.png` and `github_icon.png`.
6. Save the finished post as `public/blog/{{POST_SLUG}}.html`.
7. Save durable repo archive copies as `blogs/{{POST_SLUG}}.html` and `blogs/{{POST_SLUG}}.md`.
8. Add the post to `src/App.tsx` if it should appear in the React blog index.
9. Add a Vercel rewrite for `/blog/{{POST_SLUG}}` if it should have an extensionless route.
