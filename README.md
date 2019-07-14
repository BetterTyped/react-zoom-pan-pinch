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

## Props returned from TransformWrapper component

| Props | Description | Default | Type |
| :---- | :---------: | :-----: | ---: |


```javascript
| sensitivity   | "Wheel zoom sensitivity"     |  0.4   | Number      |
| zoomInSensitivity   | "handleZoomIn function zoom sensitivity"     |  0.9   | Number      |
| zoomOutSensitivity   | "handleZoomOut function zoom sensitivity"     |  0.9   | Number      |
| dbSensitivity   | "Double click zoom sensitivity"     |  0.6   | Number      |
| pinchSensitivity   | "Pinching zoom sensitivity"     |  0.6   | Number      |
| positionX    | "Pixel value of x position of TransformComponent"       | 0      | Number      |
| positionY    | "Pixel value of y position of TransformComponent"       | 0      | Number      |
| scale     | "TransformComponent scale value"        | 1      | Number   |
| maxScale     | "TransformComponent max scale value"        | 4      | Number   |
| minScale     | "TransformComponent min scale value"        | 0.8      | Number   |
| maxPositionX     | "TransformComponent max position x"        | null     | Number "or" null  |
| minPositionX     | "TransformComponent min position x"        | null      | Number "or" null   |
| maxPositionY     | "TransformComponent max position y"        | null     | Number "or" null  |
| minPositionY     | "TransformComponent min position y"        | null      | Number "or" null   |
| limitToBounds  | "Limit zooming and panning to wrapper boundaries"   | true   | Boolean   |
| disable  | "Disables all functionality"   | false   | Boolean   |
| zoomingEnabled  | "Enables zooming"   | true   | Boolean   |
| panningEnabled  | "Enables panning"   | true   | Boolean   |
| pinchEnabled  | "Enables pinching"   | true   | Boolean   |
| dbClickEnabled  | "Enables double click"   | true   | Boolean   |
| transformEnabled  | "Enables component transformation in x and y axis"   | true   | Boolean   |
| enableZoomedOutPanning  | "Enables panning when zoom is lower than 1"   | false   | Boolean   |
| setScale(scale)  | "Sets scale"    | ""   | Number   |
| setPositionX(positionX)  | "Sets position x"    | ""   | Number   |
| setPositionY(positionY)  | "Sets position y"    | ""   | Number   |
| zoomIn()  | "Zooming in"    | ""   | ""   |
| zoomOut()  | "Zooming out"    | ""   | ""   |
| setTransform(positionX, positionY, scale)  | "Set transformations"    | ""   | Number "or" null   |
| resetTransform()  | "Reset transformations to the initial values"    | ""   | ""   |

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
              <div>Some text</div>
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
