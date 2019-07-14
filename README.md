# react-easy-image-zoom-pan

> Zoom and pan html elements in easy way

[![NPM](https://img.shields.io/npm/v/react-easy-image-zoom-pan.svg)](https://www.npmjs.com/package/react-easy-image-zoom-pan) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-easy-image-zoom-pan
```

or

```bash
yarn add react-easy-image-zoom-pan
```

## Usage

```jsx
import React, { Component } from "react";

import MyComponent from "react-easy-image-zoom-pan";

class Example extends Component {
  render() {
    return (
      <TransformWrapper>
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <React.Fragment>
            <div className="tools">
              <button onClick={zoomIn}>+</button>
              <button onClick={zoomOut}>-</button>
              <button onClick={resetTransform}>x</button>
            </div>
            <TransformComponent>
              <img src="image.jpg" alt="test" />
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
    );
  }
}
```

## License

MIT © [prc5](https://github.com/prc5)
