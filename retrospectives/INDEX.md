# 🧠 Knowledge & Error Index (Token Optimized)

> **Protocol**: Do not read this entire directory. Read this INDEX first, then only read the specific file related to your task.

## 🏗️ Architecture & Standards (Arch)
- [Database Schema Unification](arch/schema-unification.md) - SSOT for DB types, avoiding redundancy.
- [Blob Storage Performance](arch/blob-performance.md) - Handling large binary data (Base64 vs Blob).
- [Single Source of Truth](arch/ssot-assets.md) - Unifying Constants and Logo definitions.

## 🎨 Frontend & UI (Frontend)
- [Tailwind v4 Upgrade](frontend/tailwind-v4.md) - Syntax changes (@import) causing style loss.
- [TypeScript Inference](frontend/typescript-inference.md) - Concat vs Spread for Union Types.
- [Vue Component Refactor](frontend/vue-refactor.md) - ConfigPanel optimization & Composables.
- [Mermaid Parsing](frontend/mermaid-syntax.md) - Special char handling in Mermaid.

## 🛠️ Build & Tooling (Build)
- [Vite PWA & PNPM](build/vite-pwa.md) - Dependency ghosting (workbox-window) & Lockfile conflicts.

## ⚙️ Ops & Shell (Ops)
- [Skill Deployment Sync](ops/skill-sync.md) - .codex local config sync issues.
- [Playwright Scaffold](ops/playwright-scaffold.md) - Avoiding CLI flags, using temp script execution.
- [Safe File Writing](ops/safe-file-write.md) - Avoiding heredoc for complex text (long text safety).

## 📜 Meta Rules (Rules)
- [Interaction Norms](rules/interaction.md) - Theme priority & "Save to Brain" logic.
