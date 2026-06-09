# Project Instructions

This repository is the KIKA site for `akakika.com`.

## Production Routing

- Production Vercel project: `akakika-v2`.
- Production domains: `akakika.com` and `www.akakika.com`.
- `/brand` belongs to this site and is served from `public/brand/`.
- UNDRDR is a separate site at `https://undrdr.com/`.
- Keep `/undrdr`, `/undrdr/`, and `/undrdr/:path*` as permanent redirects to `https://undrdr.com/`.
- Do not re-add local `/undrdr` rewrites, `dist/undrdr` build copies, or `akakika.com/undrdr` sitemap entries.

## Deploy Safety

- Before every production deploy, run `git status --short --branch` and confirm the checked-out branch and latest commit are the intended production source.
- Deploy only from a clean worktree after committing the exact changes being shipped.
- If another branch has the desired change, merge or cherry-pick it onto the production branch first. Do not deploy a divergent branch over production unless the divergence has been reviewed.
- After deploy, verify the live domain with `curl -I https://akakika.com` and route checks for `/brand` and `/undrdr`.

## Documentation Rules

- Before every commit, check whether the change affects project behavior, deploy flow, public content, routes, templates, cleanup rules, or agent instructions.
- Update the relevant docs in the same commit when they are affected: `README.md` for project/deploy/workflow notes, `CHANGELOG.md` for user-facing site changes, and `AGENTS.md` for agent/process rules.
- If no docs need changing for a commit, mention that explicitly in the final summary.

## Screenshot Rules

- Do not save screenshots or browser QA captures in the project root.
- Put browser and Playwright captures in `screenshots/browser-qa/YYYY-MM-DD/`.
- Put design/reference screenshots in `screenshots/reference/<area>/`.
- Keep generated Playwright logs and accessibility snapshots in `.playwright-mcp/`; they are local QA artifacts.
- Do not put shipping site assets in `screenshots/`. Assets used by the app belong under `public/`.

## Cleanup Rules

- Before moving a file, check whether it is referenced by code, HTML, config, or docs.
- Do not delete user files during cleanup unless explicitly asked.
- Keep root focused on app source/config: `src/`, `public/`, package files, Vite/TS/Vercel config, and docs.
