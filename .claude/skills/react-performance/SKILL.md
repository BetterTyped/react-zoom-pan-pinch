---
name: react-performance
description:
  React and DOM performance rules for this library's components and hooks —
  re-renders, effects, refs, event listeners, layout thrashing, SVG. Use when
  writing or reviewing code in src/components or src/hooks, adding a hook or
  callback, touching event listeners, or chasing jank or extra renders.
---

# React performance for react-zoom-pan-pinch

Vercel's React best-practices rules, filtered to what matters for a gesture
library. The full set (much of it about Next.js servers, data fetching and
bundles) is in `.agents/skills/vercel-react-best-practices/`. Read only the rule
files that match what you are changing.

## First, the library's own model

Gestures write `transform` straight to the content element. They never re-render
React per frame (see `.cursor/rules/library-context.mdc`). Keep it that way.
Anything that subscribes to the transform (`useTransformEffect`,
`useTransformComponent`, MiniMap) must read it without re-rendering the
wrapper's subtree.

## Rules worth reading

All paths are under `.agents/skills/vercel-react-best-practices/rules/`.

**Re-renders and state** — hooks, `TransformWrapper` and context consumers:

- `rerender-use-ref-transient-values.md`: per-frame values go in refs, not state
- `rerender-defer-reads.md`, `rerender-derived-state.md`,
  `rerender-derived-state-no-effect.md`
- `rerender-dependencies.md`, `rerender-functional-setstate.md`,
  `rerender-lazy-state-init.md`
- `rerender-memo.md`, `rerender-memo-with-default-value.md`,
  `rerender-simple-expression-in-memo.md`
- `rerender-no-inline-components.md`, `rerender-split-combined-hooks.md`
- `rerender-move-effect-to-event.md`: interaction logic belongs in event
  handlers

**Callbacks and listeners** — props like `onPanning`, and document/window
listeners:

- `advanced-event-handler-refs.md`: keep the latest callback in a ref so
  listeners register once
- `advanced-init-once.md`, `advanced-effect-event-deps.md`
- `client-event-listeners.md`, `client-passive-event-listeners.md`. Wheel and
  touch listeners that call `preventDefault` must stay non-passive.

**Hot paths** — code that runs on every pointer move or animation frame:

- `js-batch-dom-css.md`: read layout (`getBoundingClientRect`, `offsetWidth`)
  before writing styles
- `js-cache-property-access.md`, `js-early-exit.md`,
  `js-cache-function-results.md`

**Rendering** — MiniMap SVG, stories:

- `rendering-svg-precision.md`, `rendering-animate-svg-wrapper.md`,
  `rendering-hoist-jsx.md`, `rendering-conditional-render.md`

## Compatibility

`react` and `react-dom` peers are `*`, so library code must not depend on React
19-only APIs (`useEffectEvent`, `<Activity>`, `use`). It can use them only
behind a fallback. Stories and tests can use whatever the dev dependency
supports.
