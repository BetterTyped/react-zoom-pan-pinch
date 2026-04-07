# #280 — Virtual keyboard desynchronizes transform state

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/280
- **Reported by:** @PiotrTecza
- **Created:** 2022-02-17
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** pan

## Summary

On iOS Safari and Android Chrome, when a text input inside TransformComponent gains focus, the virtual keyboard pushes content up but the transform state is not updated, causing misaligned pan coordinates.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

- **N/A** — mobile virtual keyboard viewport shift; requires device testing.
