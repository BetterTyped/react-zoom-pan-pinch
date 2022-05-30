# @pronestor/react-zoom-pan-pinch

This is a fork of
[react-zoom-pan-pinch](https://github.com/prc5/react-zoom-pan-pinch) created in
order to fix
[the issue with build errors because of missing source files](https://github.com/prc5/react-zoom-pan-pinch/issues/265).

## Features

Super fast and light react npm package for zooming, panning and pinching html
elements in easy way.

- :rocket: Fast and easy to use
- :factory: Light, without external dependencies
- :gem: Mobile gestures, touch gestures and desktop mouse events support
- :gift: Powerful context usage, which gives you a lot of freedom
- :wrench: Highly customizable
- :crown: Animations and Utils to create own tools

## Install

```bash
yarn add @pronestor/react-zoom-pan-pinch
```

or

```bash
npm install --save @pronestor/react-zoom-pan-pinch
```

## Usage

```jsx
import {
  TransformWrapper,
  TransformComponent,
} from "@pronestor/react-zoom-pan-pinch";

export const Example = () => (
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

export const Example = () => (
  <TransformWrapper
    initialScale={1}
    initialPositionX={200}
    initialPositionY={100}
  >
    {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
      <>
        <div className="tools">
          <button onClick={() => zoomIn()}>+</button>
          <button onClick={() => zoomOut()}>-</button>
          <button onClick={() => resetTransform()}>x</button>
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
