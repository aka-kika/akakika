# Rituals

## Post Metadata

- **Slug:** `rituals`
- **Title:** Rituals
- **Description:** A quiet macOS menu bar app for repeatable personal checklist rituals.
- **Category:** App
- **Month/year:** June 2026
- **Publish date:** June 1, 2026
- **Read time:** 4 min read
- **Canonical URL:** https://akakika.com/blog/rituals
- **CTA URL:** https://github.com/aka-kika/rituals/releases
- **Landing page URL:** https://akakika.com
- **GitHub repo URL:** https://github.com/aka-kika/rituals

## Hero

Deck:

> A quiet macOS menu bar app for repeatable personal checklist rituals. Built to reduce working-memory load without becoming a productivity system.

## Tool Shelf

Shelf label: `Stack`

Shelf summary: `SwiftUI · local-first · menu bar · no backend`

| Slot | Icon | Name | Role |
| --- | --- | --- | --- |
| 1 | apple_icon.png | macOS | Platform |
| 2 | swiftui_icon.png | SwiftUI | Frontend |
| 3 | settings_app_icon.png | UserDefaults | Storage |
| 4 | code_app_icon.png | Codex | Dev AI |

## Opening

Rituals is a small macOS menu bar app for repeatable personal checklists. It is for the moments when I already know the kind of work I am doing, but do not want to rebuild the sequence from memory again. Starting a project, ending a session, preparing a release, cleaning a folder: these are patterns. Rituals keeps the pattern nearby.

The tool is small on purpose. It is not a task manager, project manager, dashboard, tracker, or productivity platform. It is simply a quiet place where rituals live so I do not have to hold them in my head.

## 01: The Friction

The annoying part is not always the work itself. Often the hard part is remembering the shape around the work. What do I always forget before I start? What needs to be checked before I stop? What belongs in the release pass? What is the next clean step after an interruption? For ADHD, this kind of surrounding structure can eat more energy than the task. Rituals tries to take that structure out of working memory and put it somewhere quiet.

- What do I always forget before I start?
- What needs to be checked before I stop?
- What is the next clean step after an interruption?

## 02: The Idea

Rituals treats a checklist as a small pipeline. You click the menu bar icon, choose the stage you are in, and the steps appear inline in the popover. One ritual at a time. No dashboard. No current project. No score. Daily use stays in the menu bar. Editing lives in a separate window, so changing the structure feels intentional.

Pull quote:

> The useful version was not the one with the most structure. It was the one that stayed small enough to trust.

### What It Does

Rituals ships with polished default checklists for common work transitions. Each ritual is a Markdown file that defines sections and steps. At runtime, the app loads these templates and keeps your checked state and collapsed sections saved locally with `UserDefaults` and `AppStorage`.

1. **Menu Bar Popover** — the daily surface. Pick a ritual, check steps inline, collapse sections, and move on.
2. **Editor Window** — the structural surface. Add, remove, or reorder rituals, sections, and steps. Choose icons and section colors.
3. **Export** — save your rituals as JSON or Markdown for backup, sharing, or version control.

## CTA

- **Title:** Try Rituals
- **Copy:** A tiny macOS menu bar app for repeatable checklist rituals, built to reduce working-memory load without becoming a productivity system.
- **Label:** Download →
- **URL:** https://github.com/aka-kika/rituals/releases

## Project Links

- **Label:** Project Links
- **Landing page label:** Landing Page
- **Landing page URL:** https://akakika.com
- **GitHub label:** GitHub Repo
- **GitHub repo URL:** https://github.com/aka-kika/rituals

## 03: What I Learned

A checklist app can become noisy very quickly. The useful version was not the one with the most structure. It was the one that stayed small enough to trust: one menu bar icon, one selected ritual, one calm list of steps. The bigger design move was removing things: no dashboard, no current project, no progress math, no productivity theater. The best part is not what it does. It is what it refuses to do.

## Notes

- Status: draft
- Tags: app, project, macos, workflow, tiny-tool, adhd, local-first
