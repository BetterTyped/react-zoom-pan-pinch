# @pronestor/react-zoom-pan-pinch

Super fast and light react Node.js package for zooming, panning and pinching html elements in easy way.

This is a fork of [react-zoom-pan-pinch](https://github.com/prc5/react-zoom-pan-pinch) created in order to fix [the issue with build errors because of missing source files](https://github.com/prc5/react-zoom-pan-pinch/issues/265).

## Installation

```shell
yarn add @pronestor/react-zoom-pan-pinch
```

or

```shell
npm install --save @pronestor/react-zoom-pan-pinch
```

## Documentation

[Storybook for `@pronestor/react-zoom-pan-pinch`](https://pronestoraps.github.io/react-zoom-pan-pinch/).

## Usage

```jsx
import {
  TransformWrapper,
  TransformComponent,
} from "@pronestor/react-zoom-pan-pinch";

export const SimpleExample = () => (
  <TransformWrapper>
    <TransformComponent>
      <img src="image.jpg" alt="test" />
    </TransformComponent>
  </TransformWrapper>
);
```

or

```jsx
import {
  TransformWrapper,
  TransformComponent,
} from "@pronestor/react-zoom-pan-pinch";

export const ExampleWithZoomControls = () => (
  <TransformWrapper
    initialScale={1}
    initialPositionX={200}
    initialPositionY={100}
  >
    {({ zoomIn, zoomOut, ...rest }) => (
      <>
        <div className="tools">
          <button onClick={() => zoomIn()}>+</button>
          <button onClick={() => zoomOut()}>-</button>
        </div>
        <TransformComponent>
          <img src="image.jpg" alt="test" />
          <div>Example text</div>
        </TransformComponent>
      </>
    )}
  </TransformWrapper>
);
```

## License

MIT © [Pronestor](https://github.com/proNestorAps)
