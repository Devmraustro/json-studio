# Architecture

Notes on how JSON Studio is put together.

## Overview

Client-side only SPA. No backend, no database, no SSR, no external API. All JSON processing uses the browser's native `JSON.parse` and `JSON.stringify`.

## Layers

```
UI (App, Editor, Toolbar, StatusBar, Settings)
        ↓  user events
State (useJsonEditor)
        ↓  calls
Processing (parser, formatter, minifier)
        ↓  uses
Native engine (JSON.parse / JSON.stringify)
```

Dependencies flow downward only. Each layer is unit-testable in isolation.

- **UI** — renders state, captures input, holds no business logic.
- **Hook** — single source of truth, orchestrates the processing modules.
- **Processing** — pure functions, string in → structured result out.
- **Native engine** — the browser's `JSON` object.

## Processing layer

`parser.ts` wraps `JSON.parse` and returns a `ParseResult` with `ok`, `data`, `error`, `line`, `column`. We catch `SyntaxError` so callers never see an exception, and extract line/column when the engine provides them.

`formatter.ts` parses first, then calls `JSON.stringify(data, null, indentation)`. Parsing first guarantees the output is valid JSON.

`minifier.ts` is the same shape, but calls `JSON.stringify(data)` with no indentation argument.

Three modules instead of one because each has a single responsibility and a single test file. The cost is negligible; the readability gain is real.

## State layer

`useJsonEditor` exposes `{ state, setInput, setIndentation, format, minify, validate, loadSample, clear, reset }`. Actions return `void`; components fire actions and read state. No global state library — `useState` + `useCallback` is enough for the MVP.

## UI layer

- `App.tsx` — composes the hook and the four child components.
- `Toolbar.tsx` — presentational, receives callbacks.
- `Settings.tsx` — segmented control for indentation.
- `Editor.tsx` — two textareas. Owns copy and download because they depend on the output value.
- `StatusBar.tsx` — presentational, reads status, message, line, column, metrics.

Textareas (not CodeMirror) to keep the bundle small. CodeMirror is a planned enhancement.

## Design system

All tokens live in `:root` in `global.css`. The palette:

| Token      | Hex       | Use                          |
| ---------- | --------- | ---------------------------- |
| Background | `#FFFFFF` | Page                         |
| Surface    | `#F5F5F5` | Output pane, status bar fill |
| Text       | `#171717` | Body                         |
| Border     | `#E5E5E5` | All borders                  |
| Accent     | `#2563EB` | Primary actions, focus ring  |
| Success    | `#16A34A` | Valid state                  |
| Error      | `#DC2626` | Invalid state                |

Dark mode will be a media query that overrides tokens — no component changes needed.

## Testing

| Layer        | Tool                            | What we test                          |
| ------------ | ------------------------------- | ------------------------------------- |
| Processing   | Vitest                          | Pure functions, edge cases, RFC 8259  |
| UI           | Vitest + React Testing Library  | Behaviour, accessibility, flows       |
| E2E (planned)| Playwright                      | Critical journeys on the deployed demo|

Test philosophy: assert on behaviour, not implementation.

## Build & tooling

Vite for dev and bundling (fast cold start, small config). TypeScript strict mode plus `noUncheckedIndexedAccess` and `noImplicitReturns`. ESLint for imports, unused vars, and React Hooks rules. Vitest for its Vite-native integration.

## Deployment

`npm run build` → static assets in `dist/`. Any static host works (GitHub Pages, Vercel, Netlify, Cloudflare Pages). No server runtime required.

## Future

- CodeMirror for syntax highlighting and line numbers — lives in `Editor.tsx`, doesn't touch the processing layer.
- JSON tree viewer — new component + new transform under `features/json/`.
- JSON diff — new `features/diff/` folder.
- Dark mode — pure CSS token overrides.
- Keyboard shortcuts — `hooks/useShortcuts.ts` calling existing actions.

The layering is intentionally set up so each of these can land without rewriting existing modules.
