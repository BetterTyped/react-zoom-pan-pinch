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
| zoomInStep              |    3    |         Number |
| zoomOutStep             |    2    |         Number |
| dbClickStep             |    5    |         Number |
| pinchSensitivity        |   0.6   |         Number |
| positionX               |    0    |         Number |
| positionY               |    0    |         Number |
| scale                   |    1    |         Number |
| maxScale                |    8    | Number or null |
| minScale                |   0.5   | Number or null |
| wheelAnimationSpeed     |    0    |         Number |
| zoomAnimationSpeed      |   200   |         Number |
| pinchAnimationSpeed     |    0    |         Number |
| panAnimationSpeed       |    0    |         Number |
| resetAnimationSpeed     |    0    |         Number |
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
| onWheelStart            |  null   |       Function |
| onWheel                 |  null   |       Function |
| onWheelStop             |  null   |       Function |
| onPanningStart          |  null   |       Function |
| onPanning               |  null   |       Function |
| onPanningStop           |  null   |       Function |
| onPinchingStart         |  null   |       Function |
| onPinching              |  null   |       Function |
| onPinchingStop          |  null   |       Function |

## Values returned from TransformWrapper component

| Value                                     | Description                                                                 |      Type      |
| :---------------------------------------- | :-------------------------------------------------------------------------- | :------------: |
| sensitivity                               | Wheel zoom sensitivity                                                      |     Number     |
| zoomInStep                                | handleZoomIn function zoom sensitivity                                      |     Number     |
| zoomOutStep                               | handleZoomOut function zoom sensitivity                                     |     Number     |
| dbClickStep                               | Double click zoom sensitivity                                               |     Number     |
| pinchSensitivity                          | Pinching zoom sensitivity                                                   |     Number     |
| positionX                                 | Pixel value of x position                                                   |     Number     |
| positionY                                 | Pixel value of y position                                                   |     Number     |
| scale                                     | Scale value                                                                 |     Number     |
| maxScale                                  | Max scale value                                                             |     Number     |
| minScale                                  | Min scale value                                                             |     Number     |
| wheelAnimationSpeed                       | Animation speed of wheel zooming                                            |     Number     |
| zoomAnimationSpeed                        | Animation speed of control buttons zooming                                  |     Number     |
| pinchAnimationSpeed                       | Animation speed of pinch zooming                                            |     Number     |
| panAnimationSpeed                         | Animation speed of panning                                                  |     Number     |
| resetAnimationSpeed                       | Animation speed of panning                                                  |     Number     |
| maxPositionX                              | Max position x                                                              | Number or null |
| minPositionX                              | Min position x                                                              | Number or null |
| maxPositionY                              | Max position y                                                              | Number or null |
| minPositionY                              | Min position y                                                              | Number or null |
| limitToBounds                             | Limit zooming and panning to wrapper boundaries                             |    Boolean     |
| disabled                                  | Disables all functionality                                                  |    Boolean     |
| zoomingEnabled                            | Enables zooming                                                             |    Boolean     |
| panningEnabled                            | Enables panning                                                             |    Boolean     |
| pinchEnabled                              | Enables pinching                                                            |    Boolean     |
| dbClickEnabled                            | Enables double click                                                        |    Boolean     |
| transformEnabled                          | Enables component transformation in x and y axis                            |    Boolean     |
| enableZoomedOutPanning                    | Enables panning when zoom is lower than 1                                   |    Boolean     |
| lastPositionZoomEnabled                   | Enables zoom buttons to scale in/out to the last wheel mouse event position |    Boolean     |
| previousScale                             | Previous scale value                                                        |     Number     |
| setScale(scale)                           | Sets scale                                                                  |     Number     |
| setPositionX(positionX)                   | Sets position x                                                             |     Number     |
| setPositionY(positionY)                   | Sets position y                                                             |     Number     |
| zoomIn()                                  | Zooming in function, used for controls button                               |      ---       |
| zoomOut()                                 | Zooming out function, used for controls button                              |      ---       |
| setTransform(positionX, positionY, scale) | Sets transformations of content                                             | Number or null |
| resetTransform(animationTime)             | Reset transformations to the initial values                                 |     Number     |

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
