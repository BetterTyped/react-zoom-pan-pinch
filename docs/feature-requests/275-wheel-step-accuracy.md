# #275 — wheel step is not accurate

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/275
- **Reported by:** @netanelvaknin
- **Created:** 2022-01-26
- **Deduped issues:** none
- **Area:** zoom

## Summary

The `wheel.step` value doesn't produce accurate, rounded scale increments. Users expect predictable scale stops (e.g. 1.0 → 1.5 → 2.0) but instead get floating-point drift, making UI indicators and snap points unreliable.

## Status log

| Date | Entry |
|------|-------|
| — | _open_ |
