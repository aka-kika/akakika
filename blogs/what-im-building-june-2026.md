# What I'm Building — June 2026

**Category:** macOS Development  
**Date:** June 1, 2026  
**Author:** Kika (Nica Loren)  
**Read time:** 5 min  
**Canonical URL:** https://akakika.com/blog/what-im-building-june-2026

---

## Deck

A behind-the-scenes look at my current projects — **Jade**, **Reshelf**, and the AI-first workflow stack I'm building for people who think in systems.

---

## Current Stack

| Tool | Role |
|---|---|
| **Jade** | Project-aware terminal multiplexer |
| **Reshelf** | Open source catalog manager |
| **PiecesOS** | Long-term memory engine |
| **Cursor** | AI agent IDE |

*SwiftUI · Rust · TypeScript · AI-native*

---

## Opening

Every few months I step back and look at what I'm actually building. Not the roadmap, not the someday-maybe list — the things that are alive right now, with real commits, real frustration, and real breakthroughs. Here's what's on my bench in June 2026.

I'm deep in what I call the "project-awareness" layer — the space between your code editor and your terminal where context gets lost. When you jump between 5 active repos, 3 runbooks, and a dozen AI conversations, you need systems that remember what you were doing. Not you. The system.

---

## 01: Jade — Terminal Meets Project Context

I forked my own cmux project into **Jade** — a terminal multiplexer that knows which project you're in, what branch you're on, which ports are running, and whether you have unread notifications. The sidebar doesn't just list windows. It surfaces *attention*.

- **Project-aware sidebar** — metadata (branch, ports, unread count) lives inside each project's card, not floating somewhere else
- **Notification rings** — panes glow when they need your attention; jump-to-unread with a keystroke
- **AI provider integrations** — OpenAI, Anthropic, Gemini, GitHub Copilot, all wired through a unified completion service with keychain-secured API keys

---

## 02: How the Workflow Actually Works

I build in tight loops with Cursor agents and my own Pieces OS memory system. Every session gets logged. Every decision gets documented. Here's the loop:

1. **Capture context with Pieces OS** — screenshots, clipboard, browser history, and audio transcriptions feed into long-term memory. When I pick up a project after 3 days, I ask: "What was I doing?" and get a real answer.
2. **Handoff files between agents** — I maintain structured handoff documents (PROJECT_CATCH_UP.md, handoff logs) so Cursor agents can resume work without me re-explaining the architecture every time.
3. **Git discipline with Obsidian integration** — project logs auto-sync to Obsidian. Session summaries, todo lists, and notes live in Markdown, not locked inside an app. The system is local-first and future-proof.

---

## CTA

> **See the Code**
> 
> Most of these projects are private repos, but the patterns and workflow philosophy are public.
> 
> → [GitHub Profile](https://github.com/aka-kika)

---

## Project Links

- 🏠 **Landing Page:** https://akakika.com — Open the live page
- 🐙 **GitHub Repo:** https://github.com/aka-kika — Read the source

---

## 03: The Reshelf Ecosystem

Beyond the terminal tools, I'm building **Reshelf** — an open-source catalog manager that helps you curate, track, and deploy projects from a single dashboard. It's the missing piece between "I found this cool repo" and "I actually understand what it does and whether it fits my stack."

The latest version adds workflow pins — manually add any public GitHub repo or local project folder to your workspace lanes. No auth required. Just name, notes, and context. Stored locally. Your catalog, your rules.

---

## 04: The Philosophy Behind It All

I'm not building apps. I'm building *memory systems*. Every tool I make follows the same principle: **the system should remember so I can forget.** Not in a lazy way — in a focused way. Cognitive offload is the only way to operate at the scale of ideas I want to explore.

The stack is SwiftUI for native macOS, Rust for performance-critical backends, TypeScript for web layers, and AI (local + cloud) as a first-class citizen, not a bolt-on feature. Every project has MCP servers, memory integration, and handoff protocols.

If you're building something similar — or just curious about how AI-native development actually works day-to-day — [reach out](mailto:hi@akakika.com). I love talking shop with people who think in systems too.

---

*© KIKA 2026 / PERSONAL SOFTWARE LAB*  
*BUILT WITH AI AND TOO MUCH CURIOSITY.*
