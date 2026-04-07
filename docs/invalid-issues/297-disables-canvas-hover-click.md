# #297 — react zoom pan pinch disables my canvas hover and click

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/297
- **Category:** question

## Reason

The user reports that integrating with react-img-mapper causes canvas hover and click events to stop working. This is an integration concern between the two libraries' event handling, not a bug in react-zoom-pan-pinch. Canvas event coordination with overlaid pointer listeners is an application-level responsibility.
