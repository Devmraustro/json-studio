# Contributing

Thanks for taking the time to contribute.

## Workflow

1. Open an issue first for non-trivial changes.
2. Fork, branch off `main` (`feat/short-description`, `fix/...`, `docs/...`).
3. Make focused commits.
4. Run the checks locally:
   ```bash
   npm run typecheck
   npm run lint
   npm test
   npm run build
   ```
5. Open a PR referencing the issue.

## Commit messages

Conventional Commits:

```
feat(formatter): support tab indentation
fix(parser): report correct column for nested errors
docs(readme): add deployment section
```

Keep the summary under 72 chars.

## Code style

- TypeScript strict mode is on — don't disable it locally.
- Named exports only.
- Functions small and single-purpose.
- No `any` without a comment; use `unknown` and narrow.
- Prefer composition over inheritance.
- No premature abstraction.

## Testing

- Every new code path needs a test.
- Use `describe`/`it` with behaviour-focused names.
- Prefer `userEvent` over `fireEvent`.
- jsdom doesn't ship `URL.createObjectURL` or `navigator.clipboard` — stub them (see `tests/editor.test.tsx`).

## PR checklist

- [ ] Issue referenced
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes with no warnings
- [ ] `npm test` passes
- [ ] `npm run build` succeeds
- [ ] Tests added for new behaviour
- [ ] README/docs updated if behaviour changed
- [ ] No secrets in the diff

## Bugs

Open an issue with: clear title, repro steps, expected vs actual, browser/OS, minimal JSON sample if applicable. Don't include sensitive data.

## Enhancements

Open an issue with: the problem, the proposed solution, alternatives considered, and whether you're willing to implement it.
