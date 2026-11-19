# react-zoom-pan-pinch

Project rules live in `.cursor/rules/` and are shared by Cursor and Claude Code.
The always-on rules are imported below. Read the scoped ones when their trigger
applies.

## Always on

- @.cursor/rules/library-context.mdc
- @.cursor/rules/commit-conventions.mdc
- @.cursor/rules/testing.mdc
- @.cursor/rules/testing-workflow.mdc
- @.cursor/rules/verification.mdc
- @.cursor/rules/decisions.mdc

## Read when it applies

| When                                                | Read                                                                                |
| --------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Diagnosing or fixing any bug, failure or regression | `.cursor/rules/debugging.mdc`                                                       |
| Editing anything under `src/`                       | `.cursor/rules/library-changes-consult-docs.mdc`, `.cursor/rules/module-design.mdc` |
| Writing or changing tests under `__tests__/`        | `.cursor/rules/testing-regressions.mdc`                                             |
| Triaging GitHub issues or editing `docs/`           | `.cursor/rules/github-issues-triage.mdc`                                            |
| Components, hooks, listeners, re-renders, jank      | the `react-performance` skill (`.claude/skills/react-performance/`)                 |

## Commands

- `yarn test` — the full Jest suite. Use `yarn test <path>` for a single spec,
  never `npx jest`.
- `yarn typecheck` — run tsc.
- `yarn eslint <files> --fix` — lint the files you touched. `yarn lint`
  auto-fixes the whole repo.
- `yarn storybook` — Storybook on port 6006. `.claude/launch.json` starts it for
  the preview pane.
- `yarn build` — the Rollup library build.
