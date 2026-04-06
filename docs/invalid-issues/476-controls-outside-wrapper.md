# #476 — How can I use controls outside the TransformWrapper?

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/476
- **Category:** question

## Reason

The user is asking how to access zoom/pan controls from components that are not descendants of TransformWrapper. This is answerable via the ref API (`useRef` on TransformWrapper), which exposes all control methods externally. It is a usage question, not a bug or missing feature.
