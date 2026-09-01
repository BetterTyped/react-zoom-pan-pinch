# Open Issues Inventory

Regenerated: 2026-09-01 from the GitHub REST API (previous pass: 2026-04-06)
Repository: https://github.com/BetterTyped/react-zoom-pan-pinch
Total open issues: 95 (145 in April; 52 of those closed since, #559 opened and closed, 2 new: #558, #582)

Every open issue was re-read against the v4.0.7 code and rated. Ratings live in
the `## Rating (2026-09-01)` section of each doc; this file is the index.

## Rating legend

| Verdict | Meaning |
|---------|---------|
| Fix | Confirmed bug, worth fixing |
| Build | Feature worth building |
| Discuss | Needs a product/API decision before work starts |
| Close: shipped | Already possible in v4 — close with a pointer to the prop/API |
| Close: fixed | Fixed on master or in a published release — close |
| Close: dupe | Duplicate — close and link the primary |
| Close: not worth | Out of scope or no library change possible — close |
| Close: no repro | Insufficient information, no activity — close |
| Keep: meta | Community/roadmap thread — stays open |

## Counts

| Verdict | Issues |
|---------|--------|
| Fix | 4 |
| Build | 8 |
| Discuss | 14 |
| Close: shipped | 19 |
| Close: fixed | 7 |
| Close: dupe | 16 |
| Close: not worth | 17 |
| Close: no repro | 8 |
| Keep: meta | 2 |

**67 of the 95 were closed on GitHub on 2026-09-01** (each with a comment giving the
reason; see the close list). 28 remain open: 4 Fix, 8 Build, 14 Discuss, 2 meta.

## Fixed in the 2026-09-01 easy-wins pass (unreleased until the next semantic-release)

| # | Change |
|---|--------|
| 582 | Wheel events inside the 100–160 ms alignment window are no longer dropped |
| 214 | Programmatic controls return completion promises |
| 329 | `useZoomPanPinch` exported and documented |
| 353 | `zoomToPoint(scale, clientX, clientY)` control |
| 378 | `clientToContent` / `contentToClient` helpers |
| 388 | `zoomToElement` accepts several targets |
| 515 | `zoomToElement` options object with `minScale`/`maxScale` |
| 371 | Inline `transform-origin` + root-node id lookup (partial) |

## Work list (Fix / Build / Discuss)

| # | Verdict | Priority | Title | Action |
|---|---------|----------|-------|--------|
| 582 | Fix → **Fixed on master** | high | Wheel input dropped when it arrives 100-160ms after the prev | Fix in `handleWheelZoom`/`handleWheelStart`: cancel the running alignment animation (or key the cancel guard to `wheelAnimationTimer`), and skip `handleAlignToBounds` when the target equals the current state. Add a fake-timer regression spec for gaps of 90/120/150 ms. |
| 290 | Fix | medium | Broken when using portal windows on Mac - Chrome | Review and merge PR #552 (panning in additional window) with a spec; then close #290 and #537. |
| 371 | Fix → **Partially addressed on master** | medium | Support Use Under Shadow DOM | Inline the critical styles (`transform-origin: 0 0`, `position`, `overflow`, `user-select`) as style attributes, or inject the stylesheet into `wrapperComponent.getRootNode()` when it is a ShadowRoot. Resolve event targets through `composedPath()`. Add a jsdom spec that mounts inside `attachShadow`. |
| 467 | Fix | medium | Unable to Copy content | Scope `user-select: none` to an active gesture (toggle a class while `isPanning`/pinching), or add a `panning.allowTextSelection` prop. Until then answer with the `text-selection` story pattern (`panning.excluded` + `userSelect: text`). |
| 214 | Build → **Shipped on master** | high | Fire events or callbacks at zoomIn, zoomToElement etc...? | Give `zoomIn/zoomOut/setTransform/resetTransform/centerView/zoomToElement` a completion signal: return a Promise resolved when `animate` finishes (or accept an `onComplete`). `animate` currently has no end hook. |
| 252 | Build | high | Auto fit large images on init | Add a first-class fit: `initialScale="fit"` (or `fitOnInit`) plus a `fitToView()` control. Today the workaround is `zoomToElement(contentEl, undefined, 0)` from `onInit`/image `onload`. |
| 254 | Build | medium | Use keyboard keys for panning | Roadmap item 5. Add `keyboard={{ disabled, panStep, zoomStep }}` on the wrapper (arrows pan, +/- zoom, 0 reset) and a public `panBy(dx, dy)` control that #527 can use for buttons. |
| 329 | Build → **Shipped on master** | medium | Add hook to allow zoom-pan-pinch without predefined componen | `useZoomPanPinch` exists in src/hooks and is covered by hooks.spec, but it is not exported from the package. Sign off on the API (`wrapperRef`, `contentRef`, `instance`, `useTransform`), export it from `src/hooks/index.ts` and document it. |
| 388 | Build → **Shipped on master** | medium | Zoom to multiple elements | Accept `HTMLElement \| HTMLElement[] \| string \| string[]` in `zoomToElement` and fit the union rect. The reporter offered a PR; a contributor bumped it 2026-08-19. |
| 353 | Build → **Shipped on master** | low | Zoom in on click to mouse position | Export the internal `handleZoomToPoint` as a `zoomToPoint(x, y, scale)` control. Single-click wiring stays in userland (it conflicts with pan-click). |
| 378 | Build → **Shipped on master** | low | How to get the mouse position | Add one helper, e.g. `instance.clientToContent(clientX, clientY)` returning content-space coordinates, and a docs recipe. Closes #378, #472 and the #297 follow-up. |
| 515 | Build → **Shipped on master** | low | zoomToElement with max/min scale support | Add an options object to `zoomToElement` (`{ maxScale, minScale }`) so the auto-fit scale can be capped without passing an explicit scale. |
| 366 | Discuss | high | Controlling zoom state via shared state | Controlled-component mode (`scale`/`positionX`/`positionY` + `onChange`) is a real architectural change. Decide whether v4 wants it or whether `setTransform` + `useTransformEffect` is the supported two-way pattern. |
| 280 | Discuss | medium | Mobile - Virtual keyboard overlap behaviour | Decide whether to handle focus-driven scroll of the wrapper: listen to `scroll` on the wrapper, fold `scrollLeft/scrollTop` into the transform and reset them to 0. Needs a real-device check before and after. |
| 385 | Discuss | medium | Cannot pan within iframe on mobile devices | Pick one: (a) document the overlay workaround (`pointer-events: none` on the iframe while a gesture is active, or a transparent capture layer), or (b) ship a `TransformIFrameComponent` as asked in the #348 thread. Cannot be fixed inside the core: events inside an iframe never reach the parent document. |
| 403 | Discuss | medium | CSP/Nonce Support? | Strict CSP blocks the runtime-injected `<style>` from rollup-plugin-postcss. Options: ship `dist/styles.css` and let consumers import it, or move the handful of critical rules inline. Decide together with #371. |
| 454 | Discuss | medium | Scroll bar panning support | 15 reactions. Decide between a `Scrollbars` companion component built on `useTransformEffect` (recommended, opt-in) and native scroll integration (rejected: the core is transform-based). Covers #317, #430, #436. |
| 509 | Discuss | medium | Don't prevent events for panning when image has reached the  | Decide whether touch panning should stop calling `preventDefault` when the content is already at the bound in the gesture direction, so the page can scroll (scroll chaining). Real mobile UX need; needs a device pass. |
| 125 | Discuss | low | How do I get double click to toggle zoom all-the-way out/all | Decide the semantics of `doubleClick.mode: 'toggle'`: today it zooms in by `step` at scale 1 and out by `step` otherwise. PR #548 wants it relative to `initialScale`; the reporter wanted min↔max. Pick one, then close. |
| 326 | Discuss | low | Add the Controls component | Decide whether to export the Storybook `Controls` (src/stories/utils/controls.utils.tsx) as a headless component. Styling opinions are the blocker; a headless variant with render props would avoid them. |
| 349 | Discuss | low | Allow to use `'left' \| 'center' \| 'right'` and `'top' \| ' | Decide whether `initialPositionX/Y` should accept `'left' \| 'center' \| 'right'` / `'top' \| 'center' \| 'bottom'`. `centerOnInit` already covers the common case. |
| 421 | Discuss | low | Reverse Zoom Behavior? | Decide whether a `wheel.reversed` flag is worth the API surface. Implementation is one sign flip in `getDelta`. |
| 452 | Discuss | low | How to disable the click event when drag & drop | Decide whether to expose a drag-vs-click signal (e.g. `instance.isPanning` in `onClick`, or a `panning.clickThreshold`). A docs recipe may be enough. Covers #519. |
| 500 | Discuss | low | Customize the wheelPanning behaviour. | Decide whether `trackPadPanning` needs a `sensitivity`/`speed` option. Axis lock, velocity and activation keys already exist. PR #518 (shift key → horizontal wheel pan) is in the same area. |
| 536 | Discuss | low | Mini map click zoom in | Click already pans the MiniMap; decide whether click should also zoom (opinionated). Lean close. |
| 543 | Discuss | low | Zoom with scroll wheel while panning | `isWheelAllowed` deliberately returns false while `isPanning`. Enabling wheel zoom mid-drag changes the pan anchor maths. Lean close unless a use case appears. |

## Clusters (dedupe)

| Cluster | Primary | Duplicates / related |
|---------|---------|----------------------|
| `click-vs-drag` | #452 | #519 |
| `coordinates` | #378 | #297, #472 |
| `docs-links` | #417 | #422 |
| `fit-to-view` | #252, #525 | #376, #530 |
| `focus-scroll` | #280 | #477 |
| `iframe-children` | #385 | #528 |
| `keyboard-a11y` | #254 | #527 |
| `linear-step` | #256 | #532 |
| `minimap` | #502, #536 | — |
| `native-scrollbars` | #454 | #317, #430, #436 |
| `portal-window` | #290 | #537 |
| `render-performance` | #401 | #440, #526 |
| `styles-delivery` | #371, #403 | #444 |
| `wheel-to-pan` | #113, #500 | #370, #441 |

## Close list (all closed on GitHub 2026-09-01)

| # | Reason | Rationale |
|---|--------|-------------------------|
| 113 | shipped | Close with the recipe: `wheel={{ wheelDisabled: true }}` + `trackPadPanning={{ disabled: false }}` gives two-finger pan while ctrl+wheel (trackpad pinch) still zooms. Add the recipe to the docs if it is not there. |
| 226 | shipped | Close: `autoAlignment.sizeX` / `sizeY`. |
| 229 | shipped | Close: `minPositionX/maxPositionX/minPositionY/maxPositionY` are respected since the #250/#478 fix. Mention PR #541 (`maxBounds`) only if a stricter mode is wanted. |
| 237 | not worth | Close: image loading state is userland React. |
| 238 | not worth | Close: LQIP is an image-pipeline concern. |
| 245 | shipped | Close: `centerZoomedOut` + `centerOnInit`. |
| 253 | dupe | Close: double-click fires `onZoom*` since the #369 fix. |
| 256 | fixed | Close: zoomIn/zoomOut steps are linear and symmetric since 76fa606. |
| 268 | shipped | Close: `panning.excluded` plus draggable/form subtrees are excluded since 2827939. |
| 272 | shipped | Close: `panning.allowLeftClickPan / allowMiddleClickPan / allowRightClickPan`. |
| 275 | shipped | Close: with `smooth: false` the wheel step is an exact additive increment (`scale + delta * step`), so 1.0 → 1.5 → 2.0 is reproducible. |
| 276 | shipped | Close: `centerView(scale, animationTime, animationType)` zooms about the centre. |
| 297 | not worth | Close: integration with react-img-mapper. The 2025-01 follow-up asks for click coordinates, which belongs to #378. |
| 313 | no repro | Close: not reproducible, no follow-up since 2022. |
| 317 | dupe | Close and point to #454. |
| 328 | shipped | Close: `limitToBounds={false}` + `<TransformComponent infinite>` + the Miro example is the unlimited mode. |
| 354 | not worth | Close: `onZoom` receives `state.previousScale`, so direction is `scale < previousScale`. |
| 357 | no repro | Close: no reproduction, no activity since 2023. |
| 358 | no repro | Close: no repro for `<area>` clicks. |
| 362 | shipped | Close: `onTransform` / `useTransformEffect` expose `scale`. |
| 368 | not worth | Close: out of scope, the library is React DOM only. |
| 370 | dupe | Close as duplicate of #113 (shipped). |
| 374 | no repro | Close: no repro; likely a source-resolution/viewport issue. |
| 376 | dupe | Close as duplicate of #252. |
| 377 | no repro | Close: bounds are derived from the content size with `limitToBounds`; ask for a repro if it recurs. |
| 384 | shipped | Close: `pinch.allowPanning` pans while pinching. |
| 397 | not worth | Close: FluentUI modal integration question. |
| 400 | not worth | Close: expected with pointer listeners on the image. |
| 401 | not worth | Close with a link to a short performance guide (Virtualize component, `will-change` trade-offs, rasterising huge SVGs to tiles). No library change. |
| 407 | shipped | Close: `panning.excluded`. |
| 411 | not worth | Close: inline SVG components work; `svg-zoom-to-element` story shows it. |
| 412 | shipped | Close: `wrapperStyle={{ overflow: 'visible' }}` / `contentStyle` on `TransformComponent`. |
| 417 | fixed | Close: docs redeployed (f55a402) and README links fixed (f4b5d9e). |
| 422 | dupe | Close as duplicate of #417 (fixed). |
| 430 | not worth | Close; point to #454 for the scrollbar discussion. |
| 435 | fixed | Close: the v4 Storybook has a MiniMap docs page and example. |
| 436 | dupe | Close and point to #454. |
| 440 | not worth | Close with the same performance guide as #401. |
| 441 | dupe | Close as duplicate of #113 (shipped). |
| 442 | shipped | Close: `useControls()` returns `instance` and `state`; for reactive reads use `useTransformEffect`/`useTransformContext`; the ref exposes `instance.state`. |
| 444 | dupe | Close as duplicate of #371. |
| 445 | not worth | Close: see the `image-responsive` example. |
| 458 | not worth | Close: rotation changes the bounds maths fundamentally and is out of scope for this library. |
| 459 | no repro | Close: empty body. |
| 466 | fixed | Close: README banners were rebuilt in 2026. |
| 469 | no repro | Close: template placeholders only. |
| 470 | fixed | Close: v4 rewrote the docs and Storybook (5a8599c, f2a7d20). |
| 472 | dupe | Close as duplicate of #378. |
| 473 | not worth | Close: swapping finger counts contradicts every platform convention. |
| 474 | no repro | Close: Safari 15 compositing artefact, no repro. |
| 476 | shipped | Close: the `TransformWrapper` ref exposes every control. |
| 477 | dupe | Close as duplicate of #280 (same fix). |
| 496 | shipped | Close: `zoomToElement(node, scale, animationTime, animationType, offsetX, offsetY)` since PR #535, published in v4. |
| 502 | shipped | Close: `MiniMap` `panning` (default `true`) navigates on click and drag. |
| 506 | fixed | Close as fixed: reporters confirm 3.7.0 fixed it (2025-02, 2025-05) and v4 carries the fix. |
| 519 | dupe | Close as duplicate of #452. |
| 521 | shipped | Close: `TransformComponent` takes `wrapperClass`, `contentClass`, `wrapperStyle`, `contentStyle`, `wrapperProps`, `contentProps`. `TransformWrapper` renders no DOM. |
| 525 | shipped | Close: `centerView(1)` (or `setTransform(x, y, 1)`) shows the content at 1:1. Could become a `zoomToScale` alias when #252 lands. |
| 526 | not worth | Close with the same performance guide as #401. |
| 527 | dupe | Close as part of #254: a `panBy(dx, dy)` control covers directional buttons. Until then `setTransform(positionX ± n, positionY, scale)` works (see the 2025-03 comment). |
| 528 | dupe | Close as duplicate of #385. |
| 530 | dupe | Close as duplicate of #252. |
| 532 | dupe | Close as duplicate of #256 (fixed). |
| 537 | dupe | Close as duplicate of #290 once PR #552 lands. |
| 549 | fixed | Close as fixed: v4.0.4–v4.0.7 were published to npm on 2026-08-03 and 2026-09-01 via OIDC trusted publishing. |
| 550 | not worth | Close: browsers expose no find-in-page event to hook into. |
| 558 | not worth | Close: `vite` is a devDependency for Storybook only and is not shipped in the package. Merge dependabot PR #571 (vite 6.4.3) as housekeeping. |

## All open issues

| # | Title | Type | Verdict | Priority | Cluster | Dupe | 👍 | 💬 | Doc |
|---|-------|------|---------|----------|---------|------|----|----|-----|
| 113 | Cannot pan with 2-finger gesture when using mac | feature | Close: shipped | — | wheel-to-pan | — | 22 | 12 | [113-two-finger-pan-mac.md](feature-requests/113-two-finger-pan-mac.md) |
| 125 | How do I get double click to toggle zoom all-the-way out/all-the-wa... | feature | Discuss | low | — | — | 12 | 4 | [125-double-click-toggle-zoom.md](feature-requests/125-double-click-toggle-zoom.md) |
| 214 | Fire events or callbacks at zoomIn, zoomToElement etc...? | feature | Build → Shipped on master | high | — | — | 16 | 6 | [214-callbacks-zoom-animation-end.md](feature-requests/214-callbacks-zoom-animation-end.md) |
| 226 | AlignmentAnimation.size separate for every direction | invalid | Close: shipped | — | — | — | 0 | 0 | [226-alignment-animation-size-per-direction.md](invalid-issues/226-alignment-animation-size-per-direction.md) |
| 229 | Boundaries for panning | feature | Close: shipped | — | — | — | 0 | 0 | [229-boundaries-for-panning.md](feature-requests/229-boundaries-for-panning.md) |
| 237 | How to add an image loader ? | invalid | Close: not worth | — | — | — | 1 | 1 | [237-how-to-add-image-loader.md](invalid-issues/237-how-to-add-image-loader.md) |
| 238 | Feature request: support of LQIP (Low Quality Images Placeholder) | invalid | Close: not worth | — | — | — | 0 | 0 | [238-support-lqip.md](invalid-issues/238-support-lqip.md) |
| 245 | Can I make TransformWrapper fit to Top and Bottom of TransformCompo... | invalid | Close: shipped | — | — | — | 3 | 0 | [245-fit-to-top-and-bottom.md](invalid-issues/245-fit-to-top-and-bottom.md) |
| 252 | Auto fit large images on init | feature | Build | high | fit-to-view | — | 22 | 2 | [252-auto-fit-images-init.md](feature-requests/252-auto-fit-images-init.md) |
| 253 | on double click is there any callback method | invalid | Close: dupe | — | — | → #369 | 7 | 1 | [253-double-click-callback.md](invalid-issues/253-double-click-callback.md) |
| 254 | Use keyboard keys for panning | feature | Build | medium | keyboard-a11y | — | 0 | 0 | [254-keyboard-keys-panning.md](feature-requests/254-keyboard-keys-panning.md) |
| 256 | Step for zoom in and zoom out not equal | invalid | Close: fixed | — | linear-step | — | 0 | 0 | [256-zoom-step-not-equal.md](invalid-issues/256-zoom-step-not-equal.md) |
| 268 | disableOnTarget pan property | invalid | Close: shipped | — | — | — | 3 | 0 | [268-disable-on-target-pan.md](invalid-issues/268-disable-on-target-pan.md) |
| 272 | Disable panning on specific mouse buttons? | feature | Close: shipped | — | — | — | 4 | 1 | [272-disable-panning-mouse-buttons.md](feature-requests/272-disable-panning-mouse-buttons.md) |
| 275 | wheel step is not accurate | feature | Close: shipped | — | — | — | 1 | 2 | [275-wheel-step-accuracy.md](feature-requests/275-wheel-step-accuracy.md) |
| 276 | Zoom on center using  setTransform | feature | Close: shipped | — | — | — | 7 | 9 | [276-zoom-center-set-transform.md](feature-requests/276-zoom-center-set-transform.md) |
| 280 | Mobile - Virtual keyboard overlap behaviour | bugs | Discuss | medium | focus-scroll | — | 2 | 2 | [280-mobile-virtual-keyboard-overlap.md](bugs/280-mobile-virtual-keyboard-overlap.md) |
| 290 | Broken when using portal windows on Mac - Chrome | bugs | Fix | medium | portal-window | — | 0 | 1 | [290-portal-window-broken.md](bugs/290-portal-window-broken.md) |
| 297 | react zoom pan pinch disables my canvas hover and click | invalid | Close: not worth | — | coordinates | → #378 | 3 | 2 | [297-disables-canvas-hover-click.md](invalid-issues/297-disables-canvas-hover-click.md) |
| 313 | CSS issues on zooming and duplicating tab | bugs | Close: no repro | — | — | — | 0 | 0 | [313-css-zoom-duplicate-tab.md](bugs/313-css-zoom-duplicate-tab.md) |
| 317 | scroll bar adjustment | invalid | Close: dupe | — | native-scrollbars | → #454 | 2 | 0 | [317-scroll-bar-adjustment.md](invalid-issues/317-scroll-bar-adjustment.md) |
| 326 | Add the Controls component | feature | Discuss | low | — | — | 0 | 0 | [326-controls-component.md](feature-requests/326-controls-component.md) |
| 328 | Unlimited mode | feature | Close: shipped | — | — | — | 0 | 0 | [328-unlimited-mode.md](feature-requests/328-unlimited-mode.md) |
| 329 | Add hook to allow zoom-pan-pinch without predefined components | feature | Build → Shipped on master | medium | — | — | 2 | 0 | [329-hook-without-components.md](feature-requests/329-hook-without-components.md) |
| 348 | Roadmap | invalid | Keep: meta | — | — | — | 10 | 7 | [348-roadmap.md](invalid-issues/348-roadmap.md) |
| 349 | Allow to use `'left' \| 'center' \| 'right'` and `'top' \| 'center'... | feature | Discuss | low | — | — | 1 | 4 | [349-position-values-left-center-right.md](feature-requests/349-position-values-left-center-right.md) |
| 353 | Zoom in on click to mouse position | feature | Build → Shipped on master | low | — | — | 0 | 4 | [353-zoom-click-mouse-position.md](feature-requests/353-zoom-click-mouse-position.md) |
| 354 | onZoomOut event | feature | Close: not worth | — | — | — | 0 | 2 | [354-on-zoom-out-event.md](feature-requests/354-on-zoom-out-event.md) |
| 357 | Placing elements on top of each other, and window resizing problem. | feature | Close: no repro | — | — | — | 1 | 0 | [357-element-positioning-resize.md](feature-requests/357-element-positioning-resize.md) |
| 358 | OnClick doesnt work inside <area> | invalid | Close: no repro | — | — | — | 0 | 0 | [358-onclick-area-element.md](invalid-issues/358-onclick-area-element.md) |
| 362 | Question | invalid | Close: shipped | — | — | — | 0 | 4 | [362-question-zoom-percentage.md](invalid-issues/362-question-zoom-percentage.md) |
| 366 | Controlling zoom state via shared state | feature | Discuss | high | — | — | 0 | 2 | [366-controlling-zoom-shared-state.md](feature-requests/366-controlling-zoom-shared-state.md) |
| 368 | React Native Support | feature | Close: not worth | — | — | — | 3 | 1 | [368-react-native-support.md](feature-requests/368-react-native-support.md) |
| 370 | Override wheel action from zoom to pan | feature | Close: dupe | — | wheel-to-pan | → #113 | 4 | 3 | [370-override-wheel-to-pan.md](feature-requests/370-override-wheel-to-pan.md) |
| 371 | Support Use Under Shadow DOM | feature | Fix → Partially addressed on master | medium | styles-delivery | — | 4 | 4 | [371-shadow-dom-support.md](feature-requests/371-shadow-dom-support.md) |
| 374 | Image appears blurry or low quality on iphone brwosers | invalid | Close: no repro | — | — | — | 2 | 3 | [374-blurry-image-iphone.md](invalid-issues/374-blurry-image-iphone.md) |
| 376 | Fit to screen | feature | Close: dupe | — | fit-to-view | → #252 | 0 | 6 | [376-fit-to-screen.md](feature-requests/376-fit-to-screen.md) |
| 377 | limit the panning to the size of the image, not the screen. | feature | Close: no repro | — | — | — | 0 | 6 | [377-limit-panning-image-size.md](feature-requests/377-limit-panning-image-size.md) |
| 378 | How to get the mouse position | invalid | Build → Shipped on master | low | coordinates | — | 0 | 2 | [378-how-to-get-mouse-position.md](invalid-issues/378-how-to-get-mouse-position.md) |
| 384 | Multiple simultaneous gestures, two-finger pan (e.g. panning while ... | feature | Close: shipped | — | — | — | 8 | 3 | [384-simultaneous-gestures.md](feature-requests/384-simultaneous-gestures.md) |
| 385 | Cannot pan within iframe on mobile devices | bugs | Discuss | medium | iframe-children | — | 0 | 0 | [385-cannot-pan-iframe-mobile.md](bugs/385-cannot-pan-iframe-mobile.md) |
| 388 | Zoom to multiple elements | feature | Build → Shipped on master | medium | — | — | 0 | 5 | [388-zoom-to-multiple-elements.md](feature-requests/388-zoom-to-multiple-elements.md) |
| 397 | Need Help - React-Zoom-Pan-Pinch+FluentUI Modal Pop Up | invalid | Close: not worth | — | — | — | 0 | 1 | [397-fluentui-modal-help.md](invalid-issues/397-fluentui-modal-help.md) |
| 400 | Open Image in new tab not working. | invalid | Close: not worth | — | — | — | 0 | 0 | [400-open-image-new-tab.md](invalid-issues/400-open-image-new-tab.md) |
| 401 | Initial Lag with Animation in Large SVG | bugs | Close: not worth | — | render-performance | — | 1 | 0 | [401-initial-lag-large-svg.md](bugs/401-initial-lag-large-svg.md) |
| 403 | CSP/Nonce Support? | feature | Discuss | medium | styles-delivery | — | 2 | 5 | [403-csp-nonce-support.md](feature-requests/403-csp-nonce-support.md) |
| 407 | How to disable panning for all nested elements? | invalid | Close: shipped | — | — | — | 7 | 1 | [407-disable-panning-nested-elements.md](invalid-issues/407-disable-panning-nested-elements.md) |
| 411 | Can I use this with an SVG as a React Component? | invalid | Close: not worth | — | — | — | 0 | 1 | [411-use-with-svg-component.md](invalid-issues/411-use-with-svg-component.md) |
| 412 | Make overflow adjustable | feature | Close: shipped | — | — | — | 0 | 0 | [412-make-overflow-adjustable.md](feature-requests/412-make-overflow-adjustable.md) |
| 415 | 👋 Who's using React Zoom Pan Pinch? | invalid | Keep: meta | — | — | — | 0 | 16 | [415-whos-using.md](invalid-issues/415-whos-using.md) |
| 417 | The docs and preview web link is broken | invalid | Close: fixed | — | docs-links | — | 0 | 2 | [417-docs-preview-link-broken.md](invalid-issues/417-docs-preview-link-broken.md) |
| 421 | Reverse Zoom Behavior? | feature | Discuss | low | — | — | 2 | 0 | [421-reverse-zoom-behavior.md](feature-requests/421-reverse-zoom-behavior.md) |
| 422 | Broken link for documentation and demos | invalid | Close: dupe | — | docs-links | → #417 | 3 | 1 | [422-broken-link-docs-demos.md](invalid-issues/422-broken-link-docs-demos.md) |
| 430 | Scrollbar thumb moves to inconvenient position when zooming | bugs | Close: not worth | — | native-scrollbars | → #454 | 0 | 1 | [430-scrollbar-thumb-position-zoom.md](bugs/430-scrollbar-thumb-position-zoom.md) |
| 435 | Documentation for mini map | invalid | Close: fixed | — | — | — | 1 | 1 | [435-documentation-for-mini-map.md](invalid-issues/435-documentation-for-mini-map.md) |
| 436 | Is it possible to connect panning to a scroll event? | feature | Close: dupe | — | native-scrollbars | → #454 | 1 | 2 | [436-panning-scroll-event.md](feature-requests/436-panning-scroll-event.md) |
| 440 | Laggy when zooming in big images | bugs | Close: not worth | — | render-performance | → #401 | 6 | 4 | [440-laggy-zooming-big-images.md](bugs/440-laggy-zooming-big-images.md) |
| 441 | Pan with scroll | feature | Close: dupe | — | wheel-to-pan | → #113 | 3 | 1 | [441-pan-with-scroll.md](feature-requests/441-pan-with-scroll.md) |
| 442 | Expose state variables in useControls hook and on transformWrapper ... | feature | Close: shipped | — | — | — | 3 | 1 | [442-expose-state-use-controls.md](feature-requests/442-expose-state-use-controls.md) |
| 444 | Styles are not applied to react-zoom-pan-pinch inside a shadow-DOM ... | bugs | Close: dupe | — | styles-delivery | → #371 | 2 | 0 | [444-styles-not-applied-shadow-dom.md](bugs/444-styles-not-applied-shadow-dom.md) |
| 445 | Responsive Image Code | invalid | Close: not worth | — | — | — | 0 | 2 | [445-responsive-image-code.md](invalid-issues/445-responsive-image-code.md) |
| 452 | How to disable the click event when drag & drop | invalid | Discuss | low | click-vs-drag | — | 1 | 5 | [452-disable-click-on-drag.md](invalid-issues/452-disable-click-on-drag.md) |
| 454 | Scroll bar panning support | feature | Discuss | medium | native-scrollbars | — | 15 | 0 | [454-scroll-bar-panning-support.md](feature-requests/454-scroll-bar-panning-support.md) |
| 458 | Is there any way to do rotate in this library? | invalid | Close: not worth | — | — | — | 5 | 5 | [458-rotate-support.md](invalid-issues/458-rotate-support.md) |
| 459 | how to disable panning while transformation in react-zoom-pan-pinch... | invalid | Close: no repro | — | — | — | 0 | 0 | [459-disable-panning-while-transformation.md](invalid-issues/459-disable-panning-while-transformation.md) |
| 466 | Sponser banners in README.md not displaying | invalid | Close: fixed | — | — | — | 0 | 0 | [466-sponsor-banners-not-displaying.md](invalid-issues/466-sponsor-banners-not-displaying.md) |
| 467 | Unable to Copy content | bugs | Fix | medium | — | — | 0 | 0 | [467-unable-to-copy-content.md](bugs/467-unable-to-copy-content.md) |
| 469 | Pinching is not working as smooth | invalid | Close: no repro | — | — | — | 0 | 0 | [469-pinching-not-smooth.md](invalid-issues/469-pinching-not-smooth.md) |
| 470 | Better examples and documentation | invalid | Close: fixed | — | — | — | 15 | 1 | [470-better-examples-documentation.md](invalid-issues/470-better-examples-documentation.md) |
| 472 | How i get clicked x, y coordinates in react-zoom-pan-pinch canvas? | invalid | Close: dupe | — | coordinates | → #378 | 0 | 1 | [472-get-clicked-coordinates.md](invalid-issues/472-get-clicked-coordinates.md) |
| 473 | Is there a way of switching 2-fingers gesture (zoom) and 1-finger (... | feature | Close: not worth | — | — | — | 0 | 0 | [473-switch-finger-gestures.md](feature-requests/473-switch-finger-gestures.md) |
| 474 | Some residue when zoom in and out on Safari 15 | invalid | Close: no repro | — | — | — | 1 | 0 | [474-residue-safari-zoom.md](invalid-issues/474-residue-safari-zoom.md) |
| 476 | How can I use controls outside the <TransformWrapper /> | invalid | Close: shipped | — | — | — | 0 | 1 | [476-controls-outside-wrapper.md](invalid-issues/476-controls-outside-wrapper.md) |
| 477 | Focus input trigger transformContentComponent to scroll to show foc... | bugs | Close: dupe | — | focus-scroll | → #280 | 2 | 1 | [477-focus-input-scroll-state.md](bugs/477-focus-input-scroll-state.md) |
| 496 | Feature Request: zoomToElement with offset | feature | Close: shipped | — | — | — | 5 | 2 | [496-zoom-to-element-offset.md](feature-requests/496-zoom-to-element-offset.md) |
| 500 | Customize the wheelPanning behaviour. | feature | Discuss | low | wheel-to-pan | — | 0 | 0 | [500-customize-wheel-panning.md](feature-requests/500-customize-wheel-panning.md) |
| 502 | Add two way interaction for MiniMap | feature | Close: shipped | — | minimap | — | 3 | 1 | [502-minimap-two-way-interaction.md](feature-requests/502-minimap-two-way-interaction.md) |
| 506 | Pinch does not work on latest version 3.6.1 | bugs | Close: fixed | — | — | — | 12 | 9 | [506-pinch-not-working-v361.md](bugs/506-pinch-not-working-v361.md) |
| 509 | Don't prevent events for panning when image has reached the boundary | feature | Discuss | medium | — | — | 6 | 2 | [509-dont-prevent-events-boundary.md](feature-requests/509-dont-prevent-events-boundary.md) |
| 515 | zoomToElement with max/min scale support | feature | Build → Shipped on master | low | — | — | 1 | 1 | [515-zoom-to-element-max-min-scale.md](feature-requests/515-zoom-to-element-max-min-scale.md) |
| 519 | [help] How to prevent click event propagation when clicking on an i... | invalid | Close: dupe | — | click-vs-drag | → #452 | 0 | 0 | [519-prevent-click-propagation.md](invalid-issues/519-prevent-click-propagation.md) |
| 521 | Allow to pass style/className to TransformWrapper & TransformComponent | feature | Close: shipped | — | — | — | 3 | 3 | [521-style-classname-components.md](feature-requests/521-style-classname-components.md) |
| 525 | Option to View Image at Original Size | feature | Close: shipped | — | fit-to-view | — | 1 | 0 | [525-view-image-original-size.md](feature-requests/525-view-image-original-size.md) |
| 526 | Low performance SVG zoom on mobile device (android) | bugs | Close: not worth | — | render-performance | → #401 | 0 | 1 | [526-low-performance-svg-mobile.md](bugs/526-low-performance-svg-mobile.md) |
| 527 | Controls to move left/right/up/down | feature | Close: dupe | — | keyboard-a11y | → #254 | 1 | 1 | [527-controls-move-directions.md](feature-requests/527-controls-move-directions.md) |
| 528 | Cannot pinch-zoom with iframe child inside of `TransformComponent` | bugs | Close: dupe | — | iframe-children | → #385 | 2 | 2 | [385-cannot-pan-iframe-mobile.md](bugs/385-cannot-pan-iframe-mobile.md) |
| 530 | Fit to container on init | feature | Close: dupe | — | fit-to-view | → #252 | 2 | 4 | [530-fit-to-container-init.md](feature-requests/530-fit-to-container-init.md) |
| 532 | How to have the same +/- scaling step range using useControls  (Zoo... | invalid | Close: dupe | — | linear-step | → #256 | 0 | 0 | [532-same-scaling-step-range.md](invalid-issues/532-same-scaling-step-range.md) |
| 536 | Mini map click zoom in | feature | Discuss | low | minimap | — | 0 | 0 | [536-minimap-click-zoom.md](feature-requests/536-minimap-click-zoom.md) |
| 537 | Panning does not work in external window | bugs | Close: dupe | — | portal-window | → #290 | 0 | 0 | [290-portal-window-broken.md](bugs/290-portal-window-broken.md) |
| 543 | Zoom with scroll wheel while panning | feature | Discuss | low | — | — | 0 | 0 | [543-wheel-zoom-while-panning.md](feature-requests/543-wheel-zoom-while-panning.md) |
| 549 | NPM Package publish workflow failing | bugs | Close: fixed | — | — | — | 1 | 0 | [549-npm-publish-workflow-failing.md](bugs/549-npm-publish-workflow-failing.md) |
| 550 | Support for browser text search(cmd/ctrl + f) when using panning | feature | Close: not worth | — | — | — | 0 | 0 | [550-browser-text-search-panning.md](feature-requests/550-browser-text-search-panning.md) |
| 558 | Vulnerability in react-zoom-pan-pinch project | invalid | Close: not worth | — | — | — | 0 | 0 | [558-vite-dev-dependency-cve.md](invalid-issues/558-vite-dev-dependency-cve.md) |
| 582 | Wheel input dropped when it arrives 100-160ms after the previous wh... | bugs | Fix → Fixed on master | high | — | — | 0 | 0 | [582-wheel-dropped-during-alignment-animation.md](bugs/582-wheel-dropped-during-alignment-animation.md) |

## Closed since the April inventory

Closed on GitHub between 2026-04-06 and 2026-09-01. Their docs stay in `docs/bugs`
(with the September verification log) and `docs/invalid-issues`.

| # | Title | Closed |
|---|-------|--------|
| 112 | Chrome renders improperly due to fit-content setting of Width and Heig | 2026-09-01 |
| 168 | pan left and right while zoomed in on magic mouse | 2026-04-07 |
| 241 | Unable to zoom out on double click | 2026-04-07 |
| 250 | min/max position props appear to do nothing | 2026-04-07 |
| 259 | The listenner method of Zoom do not work when I execute zoomIn and zoo | 2026-04-07 |
| 283 | ZoomToElement is buggy | 2026-09-01 |
| 286 | resetTransform doesn't reset back to initial position | 2026-04-07 |
| 305 | Double click does not trigger onZoom/onZoomStart/onZoomStop | 2026-04-07 |
| 316 | Panning gets stuck at some point until I go to scroll | 2026-09-01 |
| 323 | wheel.activationKeys not working | 2026-04-07 |
| 343 | zoomToElement doesnt zoom to correctly | 2026-09-01 |
| 363 | Panning velocity doesn't work if scale is <=1 | 2026-04-07 |
| 364 | Inconsistent zooming behaviour on windows resizing | 2026-04-07 |
| 369 | zoomIn(), zoomOut(), resetTransform() do not trigger onZoom/onZoomStar | 2026-04-07 |
| 392 | 'centerOnInit' not working properly | 2026-04-07 |
| 396 | limitToBounds property does't work for touchpad | 2026-04-07 |
| 404 | Do not recognize touchpad wheel actions, iOS trackpad | 2026-04-07 |
| 406 | Strange behaviour of zoom-in | 2026-04-07 |
| 408 | Double clicking to zoom, in quick succession causes the element to pan | 2026-04-07 |
| 418 | Step option for pinch does not seem to work | 2026-09-01 |
| 423 | pinch and pan | 2026-04-07 |
| 427 | setState above TransformWrapper causes cleanup of mousedown | 2026-04-07 |
| 431 | scale calculation is not fixed 3.3.0 | 2026-04-07 |
| 432 | Problems with onPanning option | 2026-04-07 |
| 433 | re:limitToBounds on resize | 2026-09-01 |
| 434 | Scrolling in mobile | 2026-09-01 |
| 437 | How to make content inside TransformComponent editable using contented | 2026-09-01 |
| 438 | minScale bound not work correctly when zoom out with ctrl | 2026-04-07 |
| 439 | Image initial position calculation incorrect when browser cache is dis | 2026-09-01 |
| 443 | onPanning event is not fired when panning is caused by velocity and no | 2026-09-01 |
| 460 | Unable to use drag and drop functionality inside of TransformWrapper | 2026-09-01 |
| 462 | Centering issue | 2026-09-01 |
| 463 | centerZoomedOut falg is not working (disable center is not working) | 2026-04-07 |
| 478 | Position props maxPosition & minPosition are ignored when calculating  | 2026-04-07 |
| 479 | TransformWrapper and TransformComponent have 0 width and height, insid | 2026-04-07 |
| 483 | Incorrect position on first render of the elements in the view | 2026-04-07 |
| 487 | Zoom doesn't work properly on mobile when both fingers touch the scree | 2026-04-07 |
| 495 | wheel step prop doesnt work | 2026-04-07 |
| 498 | Pinch issue on touchpad | 2026-04-07 |
| 508 | Cannot disable zoom animation | 2026-09-01 |
| 513 | can't zoom in SVG on mobile devices | 2026-04-07 |
| 516 | "Components are not mounted" error if TransformComponent render is del | 2026-04-07 |
| 522 | not work | 2026-04-07 |
| 524 | Unable to scroll up When zoomed In on PDF | 2026-04-07 |
| 529 | Source maps contain the links to the absent `src` folder | 2026-09-01 |
| 538 | Ignored attempt to cancel a touchmove event with cancelable=false due  | 2026-04-08 |
| 540 | Zoom To Element Example Crashes Webpage | 2026-09-01 |
| 542 | Source map warnings due to missing TypeScript files in published packa | 2026-09-01 |
| 544 | Textarea input field is not editable | 2026-06-27 |
| 545 | zoomIn(step) overshoots defined scale when smooth: true is enabled | 2026-09-01 |
| 547 | cannot pinching with panning excluded option | 2026-04-07 |
| 553 | Inconsistent ref API: `ref.current.state` vs `ref.current.instance.tra | 2026-04-07 |
| 559 | Pin Annotation doesn't work | 2026-04-30 |

## Open pull requests worth looking at

| PR | Relates to | Note |
|----|------------|------|
| #552 | #290, #537 | Panning in an additional window — the missing half of the portal fix |
| #548 | #125 | Double-click toggle relative to `initialScale` |
| #541 | #229 | Optional `maxBounds` for stricter position limits |
| #518 | #500, #113 | Shift key → horizontal wheel pan |
| #571 | #558 | Dependabot bump of `vite` to 6.4.3 (dev only) |
| #494, #520, #534, #551 | — | Older fixes; check against the v4 regression suite before merging |
| #572 | — | "SVG viewer" feature PR; scope unclear |
