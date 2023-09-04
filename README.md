# 🖼 React Zoom Pan Pinch

> Super fast and light react npm package for zooming, panning and pinching html
> elements in easy way

<p>
  <a href="https://bettertyped.com/">
    <img src="https://custom-icon-badges.demolab.com/static/v1?label=&message=BetterTyped&color=333&logo=BT" />
  </a>
  <a href="https://www.npmjs.com/package/react-zoom-pan-pinch">
    <img src="https://custom-icon-badges.demolab.com/npm/v/react-zoom-pan-pinch.svg?logo=npm&color=e22121"/>
  </a>
  <a href="https://github.com/prc5/react-zoom-pan-pinch">
    <img src="https://custom-icon-badges.demolab.com/github/stars/prc5/react-zoom-pan-pinch?logo=star" />
  </a>
  <a href="https://github.com/prc5/react-zoom-pan-pinch/blob/main/License.md">
    <img src="https://custom-icon-badges.demolab.com/github/license/prc5/react-zoom-pan-pinch?logo=law&color=yellow" />
  </a>
  <a href="https://github.com/semantic-release/semantic-release">
    <img src="https://custom-icon-badges.demolab.com/badge/semver-commitzen-e10079?logo=semantic-release&color=e76f51" />
  </a>
  <a href="https://www.npmjs.com/package/react-zoom-pan-pinch">
    <img src="https://custom-icon-badges.demolab.com/npm/dm/react-zoom-pan-pinch?logoColor=fff&logo=trending-up" />
  </a>
  <a href="https://www.npmjs.com/package/react-zoom-pan-pinch">
    <img src="https://custom-icon-badges.demolab.com/bundlephobia/minzip/react-zoom-pan-pinch?color=E10098&logo=package" />
  </a>
  <a href="https://github.com/prc5/react-zoom-pan-pinch">
    <img src="https://custom-icon-badges.demolab.com/badge/typescript-%23007ACC.svg?logo=typescript&logoColor=white" />
  </a>
  <a href="https://hits.sh/github.com/prc5/react-zoom-pan-pinch/">
    <img src="https://hits.sh/github.com/prc5/react-zoom-pan-pinch.svg?color=64BC4B&logo=bookmeter" />
  </a>
  <a href="https://twitter.com/maciej_pyrc">
    <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/maciej_pyrc?label=Follow%20&style=social"/>
  </a>
</p>

Do you like this library? Try out other projects
**[⚡Hyper Fetch](https://github.com/BetterTyped/hyper-fetch)**

#### Sources

- [Demo](https://BetterTyped.github.io/react-zoom-pan-pinch/?path=/story/examples-big-image--big-image)
- [Docs](https://BetterTyped.github.io/react-zoom-pan-pinch/?path=/story/docs-props--page)

## Key Features

- 🚀 Fast and easy to use
- 🏭 Light, without external dependencies
- 💎 Mobile gestures, touchpad gestures and desktop mouse events support
- 🎁 Powerful context usage, which gives you a lot of freedom
- 🔧 Highly customizable
- 👑 Animations and Utils to create own tools
- 🔮 Advanced hooks and components

## Help me keep working on this project ❤️

- [Become a Sponsor on GitHub](https://github.com/sponsors/prc5)

---

## Installation

```bash
npm install --save react-zoom-pan-pinch
or
yarn add react-zoom-pan-pinch
```

## Examples

```jsx
import React, { Component } from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const Example = () => {
  return (
    <TransformWrapper>
      <TransformComponent>
        <img src="image.jpg" alt="test" />
      </TransformComponent>
    </TransformWrapper>
  );
};
```

or

```jsx
import React, { Component } from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const Example = () => {
  return (
    <TransformWrapper
      initialScale={1}
      initialPositionX={200}
      initialPositionY={100}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <React.Fragment>
          <div className="tools">
            <button onClick={() => zoomIn()}>+</button>
            <button onClick={() => zoomOut()}>-</button>
            <button onClick={() => resetTransform()}>x</button>
          </div>
          <TransformComponent>
            <img src="image.jpg" alt="test" />
            <div>Example text</div>
          </TransformComponent>
        </React.Fragment>
      )}
    </TransformWrapper>
  );
};
```

or

```tsx
import React, { useRef } from "react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

const Controls = ({ zoomIn, zoomOut, resetTransform }) => (
  <>
    <button onClick={() => zoomIn()}>+</button>
    <button onClick={() => zoomOut()}>-</button>
    <button onClick={() => resetTransform()}>x</button>
  </>
);

const Component = () => {
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

  const zoomToImage = () => {
    if (transformComponentRef.current) {
      const { zoomToElement } = transformComponentRef.current;
      zoomToElement("imgExample");
    }
  };

  return (
    <TransformWrapper
      initialScale={1}
      initialPositionX={200}
      initialPositionY={100}
      ref={transformComponentRef}
    >
      {(utils) => (
        <React.Fragment>
          <Controls {...utils} />
          <TransformComponent>
            <img src="image.jpg" alt="test" id="imgExample" />
            <div onClick={zoomToImage}>Example text</div>
          </TransformComponent>
        </React.Fragment>
      )}
    </TransformWrapper>
  );
};
```

## License

MIT © [prc5](https://github.com/prc5)
