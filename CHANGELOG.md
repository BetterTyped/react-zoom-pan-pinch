# CHANGELOG

## Version: 3.0.0

- Removed render props performance issues. I've removed state from render props,
  now if we want to listen to it's changes we need to use useTransformEffect
  hook
- Created helper hooks for handling controls, transform state and context
  without performance issues with rerendering
- Added KeepScale, MiniMap components
- Added documentation about new hooks
- New readme
- Semantic release

## Version: 2.1.3

##### Published: 24.07.2021

1. Alignment animation size changes:

- "padding" size is not longer calculated based on the wrapper size - it's now
  represented by pixels
- you can set separate "padding" values for X and Y

2. Storybook docs fix - prevented to log every action callback since it was
   killing performance
