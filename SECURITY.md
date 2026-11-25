# Security Policy

## Overview

JSON Studio is a client-side only web app. All JSON processing happens in the browser — no data is sent to a server.

## Supported versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Privacy stance

- No backend — the app has no server component.
- No network calls for JSON processing — `fetch`, `XMLHttpRequest`, and similar APIs are not used to send user data anywhere.
- No automatic persistence — the editor does not write to `localStorage`, `IndexedDB`, or cookies.
- No analytics or tracking — no third-party scripts, no fingerprinting.
- Safe rendering — JSON output is rendered through React's escaping, not `innerHTML`.

## What this means

When you paste JSON:

1. The string stays in memory in the tab.
2. It's parsed with native `JSON.parse`. Failures are caught and shown as plain text in the status bar.
3. The result is rendered in a read-only textarea.
4. Closing the tab discards the data.

## What we don't claim

JSON Studio does not provide absolute security:

- The browser, installed extensions, or compromised device software could still observe in-memory data.
- If you load the app over an insecure connection or from an untrusted mirror, the assets could be tampered with. Use the official deployment.
- Downloaded files are subject to whatever protections your OS and storage provide.

For sensitive data, follow your organisation's policy.

## Reporting a vulnerability

1. Don't open a public issue.
2. Email the maintainer (replace with the maintainer's actual contact before publishing).
3. Include a description, repro steps, and impact.

We'll acknowledge within 72 hours and aim for a fix or mitigation within 14 days for high-severity issues.

## For contributors

- Never commit secrets, API keys, or credentials.
- Never add a network call that sends user JSON externally.
- Never use `innerHTML` or `dangerouslySetInnerHTML` for JSON content.
- Never add a third-party script that loads external resources.
- Always validate at the boundary (`parseJson` is the boundary).
- Always catch errors and surface a safe message.

## Dependencies

Keep them minimal. Every new dependency must justify its inclusion. Prefer permissive licenses and active maintenance. Run `npm audit` before release.
