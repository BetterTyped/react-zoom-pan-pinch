![GitHub Logo](/logo/logo_cropped.png)

# react-zoom-pan-pinch

> Super fast and light react npm package for zooming, panning and pinching html elements in easy way

[![NPM](https://img.shields.io/npm/v/react-zoom-pan-pinch.svg)](https://www.npmjs.com/package/react-zoom-pan-pinch) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## DEMO

[DEMO](https://prc5.github.io/react-zoom-pan-pinch/)

## Install

```bash
npm install --save react-zoom-pan-pinch
```

or

```bash
yarn add react-zoom-pan-pinch
```

## Props of TransformWrapper

| Props                   | Default |           Type |
| :---------------------- | :-----: | -------------: |
| sensitivity             |   0.4   |         Number |
| zoomInSensitivity       |    2    |         Number |
| zoomOutSensitivity      |    2    |         Number |
| dbClickSensitivity      |    3    |         Number |
| pinchSensitivity        |   0.6   |         Number |
| positionX               |    0    |         Number |
| positionY               |    0    |         Number |
| scale                   |    1    |         Number |
| maxScale                |    4    | Number or null |
| minScale                |   0.8   | Number or null |
| maxPositionX            |  null   | Number or null |
| minPositionX            |  null   | Number or null |
| maxPositionY            |  null   | Number or null |
| minPositionY            |  null   | Number or null |
| limitToBounds           |  true   |        Boolean |
| disabled                |  false  |        Boolean |
| zoomingEnabled          |  true   |        Boolean |
| panningEnabled          |  true   |        Boolean |
| pinchEnabled            |  true   |        Boolean |
| dbClickEnabled          |  true   |        Boolean |
| transformEnabled        |  true   |        Boolean |
| enableZoomedOutPanning  |  false  |        Boolean |
| lastPositionZoomEnabled |  false  |        Boolean |
| enableZoomThrottling    |  false  |        Boolean |

## Values returned from TransformWrapper component

| Value                                     | Description                                                                 |   Default   |           Type |
| :---------------------------------------- | :-------------------------------------------------------------------------- | :---------: | -------------: |
| sensitivity                               | Wheel zoom sensitivity                                                      |     0.4     |         Number |
| zoomInSensitivity                         | handleZoomIn function zoom sensitivity                                      |      5      |         Number |
| zoomOutSensitivity                        | handleZoomOut function zoom sensitivity                                     |      5      |         Number |
| dbClickSensitivity                        | Double click zoom sensitivity                                               |      7      |         Number |
| pinchSensitivity                          | Pinching zoom sensitivity                                                   |     0.6     |         Number |
| positionX                                 | Pixel value of x position                                                   |      0      |         Number |
| positionY                                 | Pixel value of y position                                                   |      0      |         Number |
| scale                                     | Scale value                                                                 |      1      |         Number |
| maxScale                                  | Max scale value                                                             |      4      |         Number |
| minScale                                  | Min scale value                                                             |     0.8     |         Number |
| maxPositionX                              | Max position x                                                              |    null     | Number or null |
| minPositionX                              | Min position x                                                              |    null     | Number or null |
| maxPositionY                              | Max position y                                                              |    null     | Number or null |
| minPositionY                              | Min position y                                                              |    null     | Number or null |
| limitToBounds                             | Limit zooming and panning to wrapper boundaries                             |    true     |        Boolean |
| disabled                                  | Disables all functionality                                                  |    false    |        Boolean |
| zoomingEnabled                            | Enables zooming                                                             |    true     |        Boolean |
| panningEnabled                            | Enables panning                                                             |    true     |        Boolean |
| pinchEnabled                              | Enables pinching                                                            |    true     |        Boolean |
| dbClickEnabled                            | Enables double click                                                        |    true     |        Boolean |
| transformEnabled                          | Enables component transformation in x and y axis                            |    true     |        Boolean |
| enableZoomedOutPanning                    | Enables panning when zoom is lower than 1                                   |    false    |        Boolean |
| lastPositionZoomEnabled                   | Enables zoom buttons to scale in/out to the last wheel mouse event position |    false    |        Boolean |
| previousScale                             | Previous scale value                                                        | scale value |         Number |
| setScale(scale)                           | Sets scale                                                                  |             |         Number |
| setPositionX(positionX)                   | Sets position x                                                             |             |         Number |
| setPositionY(positionY)                   | Sets position y                                                             |             |         Number |
| zoomIn()                                  | Zooming in                                                                  |             |                |
| zoomOut()                                 | Zooming out                                                                 |             |                |
| setTransform(positionX, positionY, scale) | Sets transformations of content                                             |             | Number or null |
| resetTransform()                          | Reset transformations to the initial values                                 |             |             "" |

## Usage

```jsx
import React, { Component } from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

class Example extends Component {
  render() {
    return (
      <TransformWrapper scale={1} positionX={200} positionY={100}>
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

or

```jsx
import React, { Component } from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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

## License

MIT © [prc5](https://github.com/prc5)
