# @pronestor/react-zoom-pan-pinch

This is a fork of
[react-zoom-pan-pinch](https://github.com/prc5/react-zoom-pan-pinch) created in
order to fix
[the issue with build errors because of missing source files](https://github.com/prc5/react-zoom-pan-pinch/issues/265).

[![NPM](https://img.shields.io/npm/v/react-zoom-pan-pinch.svg)](https://www.npmjs.com/package/react-zoom-pan-pinch)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-zoom-pan-pinch)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![NPM](https://img.shields.io/npm/l/react-zoom-pan-pinch)
![npm](https://img.shields.io/npm/dm/react-zoom-pan-pinch)

> Super fast and light react npm package for zooming, panning and pinching html
> elements in easy way

- [Demo](https://prc5.github.io/react-zoom-pan-pinch/?path=/story/examples-big-image--big-image)
- [Docs](https://prc5.github.io/react-zoom-pan-pinch/?path=/story/docs-props--page)

## Features

- :rocket: Fast and easy to use
- :factory: Light, without external dependencies
- :gem: Mobile gestures, touchpad gestures and desktop mouse events support
- :gift: Powerful context usage, which gives you a lot of freedom
- :wrench: Highly customizable
- :crown: Animations and Utils to create own tools

## Install

```bash
npm install --save @pronestor/react-zoom-pan-pinch
```

or

```bash
yarn add @pronestor/react-zoom-pan-pinch
```

## Usage

```jsx
import React, { Component } from "react";

import {
  TransformWrapper,
  TransformComponent,
} from "@pronestor/react-zoom-pan-pinch";

class Example extends Component {
  render() {
    return (
      <TransformWrapper>
        <TransformComponent>
          <img src="image.jpg" alt="test" />
        </TransformComponent>
      </TransformWrapper>
    );
  }
}
```

or

```jsx
import React, { Component } from "react";

import {
  TransformWrapper,
  TransformComponent,
} from "@pronestor/react-zoom-pan-pinch";

class Example extends Component {
  render() {
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
  }
}
```

## License

MIT © [Pronestor](https://github.com/proNestorAps)
