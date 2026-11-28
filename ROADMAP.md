# Roadmap

This document tracks the past, current, and future development of JSON Studio. Versions follow [Semantic Versioning](https://semver.org/).

Status legend: ✅ Done · 🚧 In Progress · 📋 Planned · 💡 Idea

---

## v1.0 — MVP (Current Release)

**Status:** ✅ Released · **Date:** 2026-11-25 · **Tag:** `v1.0.0`

### Core Engine
- ✅ `parseJson` with structured `ParseResult` (ok / data / error / line / column)
- ✅ `formatJson` with configurable indentation (2 / 4 spaces)
- ✅ `minifyJson` with whitespace removal
- ✅ `isValidJson` convenience predicate
- ✅ Strict RFC 8259 compliance (rejects comments, trailing commas, single quotes)

### User Interface
- ✅ Two-pane editor (input / output) with controlled textareas
- ✅ Toolbar: Format, Minify, Validate, Sample, Clear
- ✅ Settings: segmented indentation control (2 / 4 spaces)
- ✅ StatusBar: live status, error message with line/column, byte metrics
- ✅ Copy to clipboard (with `execCommand` fallback)
- ✅ Download as `.json` file
- ✅ Sample JSON loader
- ✅ Responsive layout (desktop + mobile)

### Design System
- ✅ Professional Minimalist palette (white / grey / blue accent)
- ✅ CSS custom properties for all tokens
- ✅ Mono font for code, sans-serif for UI
- ✅ Focus rings for accessibility
- ✅ Light mode

### Engineering
- ✅ React 18 + TypeScript 5 (strict mode + `noUncheckedIndexedAccess`)
- ✅ Vite 5 build setup
- ✅ Vitest 2 + React Testing Library (64 tests)
- ✅ ESLint with zero warnings
- ✅ GitHub Actions CI (lint → typecheck → test → build)
- ✅ MIT license, README, CONTRIBUTING, SECURITY, architecture docs

### Privacy & Security
- ✅ 100% client-side processing
- ✅ No backend, no network calls, no analytics
- ✅ No `localStorage` / `IndexedDB` / cookies
- ✅ React-escaped rendering (no `innerHTML`)

---

## v1.1 — UX Polish & Resilience

**Status:** 📋 Planned · **Target:** Q1 2027

### Editor Improvements
- 📋 Drag-and-drop `.json` file onto the input pane
- 📋 Paste from clipboard directly (auto-detect large content)
- 📋 Line numbers in the input pane
- 📋 Word-wrap toggle for long lines
- 📋 Tab key inserts spaces inside the textarea (instead of changing focus)

### Error Handling
- 📋 Highlight the offending character with a red caret in the input
- 📋 Show a snippet of the broken line in the status bar
- 📋 Detect and report duplicate object keys as a warning

### Accessibility
- 📋 Full keyboard navigation (Tab order, focus visible)
- 📋 ARIA live region announcements on status change
- 📋 High-contrast mode audit (WCAG AA)
- 📋 Screen reader testing (NVDA + VoiceOver)

### Internationalisation
- 📋 Extract all user-facing strings into a single locale file
- 📋 English + Arabic initial locales
- 📋 RTL layout support for Arabic

---

## v1.2 — Developer Productivity

**Status:** 📋 Planned · **Target:** Q2 2027

### Syntax Highlighting
- 📋 Replace plain textarea with [CodeMirror 6](https://codemirror.net/)
- 📋 JSON syntax highlighting (keys, strings, numbers, booleans, null)
- 📋 Bracket matching and auto-closing
- 📋 Search inside the editor (Ctrl+F)

### JSON Tree Viewer
- 📋 Collapsible tree view alongside the text output
- 📋 Click a node to highlight its source range
- 📋 Path bar showing the current selection's JSON pointer (e.g. `$.users[0].name`)
- 📋 "Copy path" action on each node

### Keyboard Shortcuts
- 📋 `Ctrl+Shift+F` — Format
- 📋 `Ctrl+Shift+M` — Minify
- 📋 `Ctrl+Shift+V` — Validate
- 📋 `Ctrl+Shift+S` — Sample
- 📋 `Ctrl+Shift+C` — Copy output
- 📋 `Ctrl+Shift+D` — Download
- 📋 `Ctrl+Shift+K` — Clear
- 📋 Shortcut cheatsheet modal (`?` to open)

---

## v1.3 — Compare & Convert

**Status:** 📋 Planned · **Target:** Q2 2027

### JSON Diff
- 📋 Side-by-side diff view (left vs right JSON)
- 📋 Inline additions / deletions / modifications highlighted
- 📋 Path-level summary: "5 keys added, 2 changed, 1 removed"
- 📋 Ignore-key option (e.g. skip `timestamp` fields)

### JSON → CSV
- 📋 Flatten arrays of homogeneous objects into a CSV table
- 📋 Handle nested objects with dot-notation headers (`address.city`)
- 📋 Preview before download
- 📋 Configurable delimiter (comma / semicolon / tab)

### JSON → YAML / YAML → JSON
- 📋 Two-way conversion using a bundled parser
- 📋 Preserve key order (no sorting)

### JSON → TypeScript Types
- 📋 Generate `interface` declarations from a JSON sample
- 📋 Optional `type` vs `interface` output
- 📋 Handle union types when array items differ

---

## v1.4 — Power Tools

**Status:** 💡 Idea · **Target:** Q3 2027

### JSON Path Query
- 💡 Execute [JSONPath](https://goessner.net/articles/JsonPath/) queries against the input
- 💡 Live result preview as you type the query
- 💡 Highlight matched nodes in the tree viewer
- 💡 Save recent queries in session memory

### JSON Schema Validation
- 💡 Paste or upload a JSON Schema (draft 2020-12)
- 💡 Validate the input against the schema
- 💡 Report all violations with paths and messages
- 💡 Generate a stub schema from a sample JSON

### Sort & Transform
- 💡 Sort object keys alphabetically (recursive option)
- 💡 Flatten nested objects into dot-notation
- 💡 Unflatten dot-notation back into nested objects
- 💡 Pick / omit keys by name
- 💡 Convert all string values to a specific encoding (base64, URL)

### JSON Statistics
- 💡 Total bytes, keys, array items, max depth
- 💡 Key frequency table (which keys appear most often)
- 💡 Type distribution chart (objects / arrays / strings / numbers / null)

---

## v2.0 — Beyond JSON

**Status:** 💡 Idea · **Target:** Q4 2027

### Multi-Format Studio
- 💡 Rebrand as **Data Studio** — one toolkit for multiple formats
- 💡 XML formatter + validator
- 💡 TOML reader
- 💡 CSV ↔ JSON two-way converter
- 💡 Markdown table ↔ JSON

### Workspace
- 💡 Multiple tabs (each tab = one document)
- 💡 Session restore (offer, not force — privacy-first)
- 💡 Export workspace as a `.zip` of files
- 💡 Optional passphrase-encrypted local storage (off by default)

### Plugin System
- 💡 User-defined transforms via a small JS sandbox
- 💡 Plugin manifest format (`plugin.json`)
- 💡 Community plugin registry (static, no backend)

### Dark Mode
- 💡 System-preference-driven (`prefers-color-scheme`)
- 💡 Manual toggle with persistence (off by default — privacy)
- 💡 Token overrides only; no component changes

---

## Long-Term Principles (Never Compromise)

These principles guide every version. They are non-negotiable:

1. **Privacy first.** No backend, no network calls for data processing, no analytics. Ever.
2. **Client-side only.** The app must remain a static bundle. No server runtime.
3. **No tracking.** No cookies, no fingerprinting, no third-party scripts.
4. **Accessibility is a feature.** Every release must pass keyboard + screen reader checks.
5. **Small bundle.** Adding a feature that doubles the bundle size requires justification.
6. **Tests are mandatory.** Every new code path ships with tests.
7. **MIT license.** The project stays permissive and open-source.
8. **No accounts.** The app never asks for sign-up or login.

---

## How to Contribute to the Roadmap

- Open an issue with the `roadmap` label to propose a new feature.
- Up-vote existing issues with 👍 — we use reactions to gauge demand.
- Pull requests that implement a `📋 Planned` item are very welcome. Please link the issue and reference this document.

---

## Versioning Policy

- **Patch** (`1.0.x`): bug fixes, no behaviour change.
- **Minor** (`1.x.0`): new features, backwards-compatible.
- **Major** (`x.0.0`): breaking changes. Reserved for v2.0 and beyond.

Pre-release versions use the `-alpha.N` / `-beta.N` / `-rc.N` suffixes.
