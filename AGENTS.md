# Project Instructions

This repository is the KIKA site for `akakika.com`.

## Screenshot Rules

- Do not save screenshots or browser QA captures in the project root.
- Put browser and Playwright captures in `screenshots/browser-qa/YYYY-MM-DD/`.
- Put design/reference screenshots in `screenshots/reference/<area>/`.
- Use descriptive lowercase names, for example `apps-desktop-after-card-update.png`.
- Keep generated Playwright logs and accessibility snapshots in `.playwright-mcp/`; they are local QA artifacts.
- Do not put shipping site assets in `screenshots/`. Assets used by the app belong under `public/`.
- Screenshot binaries under `screenshots/` are ignored by Git by default. Force-add only intentional reference assets.

## Cleanup Rules

- Before moving a file, check whether it is referenced by code, HTML, config, or docs.
- Do not delete user files during cleanup unless explicitly asked.
- Keep root focused on app source/config: `src/`, `public/`, `templates/`, package files, Vite/TS/Vercel config, and docs.
