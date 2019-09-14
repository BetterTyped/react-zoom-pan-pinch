# react-zoom-pan-pinch

[![NPM](https://img.shields.io/npm/v/react-zoom-pan-pinch.svg)](https://www.npmjs.com/package/react-zoom-pan-pinch) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-zoom-pan-pinch) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Package Quality](https://npm.packagequality.com/shield/react-zoom-pan-pinch.svg)](https://packagequality.com/#?package=react-zoom-pan-pinch) ![NPM](https://img.shields.io/npm/l/react-zoom-pan-pinch) ![npm](https://img.shields.io/npm/dm/react-zoom-pan-pinch) ![GitHub stars](https://img.shields.io/github/stars/prc5/react-zoom-pan-pinch?style=social)

> Super fast and light react npm package for zooming, panning and pinching html elements in easy way

## Features

- :rocket: Lightning fast and easy to use
- :factory: Super light, fully made by me
- :gem: Mobile gestures, touchpad gestures and desktop mouse events support
- :gift: Powerful context usage, which gives you a lot of freedom
- :wrench: Highly customizable
- :crown: Lots of animations and cool stuff

## DEMO

[DEMO EXAMPLE](https://prc5.github.io/react-zoom-pan-pinch/)

## Install

```bash
npm install --save react-zoom-pan-pinch
```

or

```bash
yarn add react-zoom-pan-pinch
```

## Usage

```jsx
import React, { Component } from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

class Example extends Component {
  render() {
    return (
      <TransformWrapper defaultScale={1} defaultPositionX={200} defaultPositionY={100}>
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

## Props of TransformWrapper

| Props                   | Default  |           Type |
| :---------------------- | :------: | -------------: |
| limitToBounds           |   true   |        Boolean |
| limitToWrapperBounds    |  false   |        Boolean |
| disabled                |  false   |        Boolean |
| transformEnabled        |   true   |        Boolean |
| positionX               |    0     |         Number |
| positionY               |    0     |         Number |
| maxPositionX            |   null   | Number or null |
| minPositionX            |   null   | Number or null |
| maxPositionY            |   null   | Number or null |
| minPositionY            |   null   | Number or null |
| zoomingEnabled          |   true   |        Boolean |
| scale                   |    1     |         Number |
| maxScale                |    8     | Number or null |
| minScale                |    1     | Number or null |
| previousScale           |    1     |         Number |
| enableWheel             |   true   |        Boolean |
| enableTouchPadPinch     |   true   |        Boolean |
| wheelStep               |    4     |         Number |
| pinchEnabled            |   true   |        Boolean |
| pinchSensitivity        |    1     |         Number |
| panningEnabled          |   true   |        Boolean |
| lockAxisX               |  false   |        Boolean |
| lockAxisY               |  false   |        Boolean |
| enableVelocity          |   true   |        Boolean |
| velocityTimeBasedOnMove |   true   |        Boolean |
| minVelocity             |   1.6    |         Number |
| minVelocityScale        |    1     |         Number |
| velocityAnimationSpeed  |   1800   |         Number |
| velocitySensitivity     |    1     |         Number |
| dbClickMode             | "zoomIn" |         String |
| dbClickStep             |    40    |         Number |
| zoomInStep              |    40    |         Number |
| zoomOutStep             |    40    |         Number |
| zoomInAnimationSpeed    |   200    |         Number |
| zoomOutAnimationSpeed   |   200    |         Number |
| dbClickAnimationSpeed   |   200    |         Number |
| resetAnimationSpeed     |   200    |         Number |
| onWheelStart            |   null   |       Function |
| onWheel                 |   null   |       Function |
| onWheelStop             |   null   |       Function |
| onPanningStart          |   null   |       Function |
| onPanning               |   null   |       Function |
| onPanningStop           |   null   |       Function |
| onPinchingStart         |   null   |       Function |
| onPinching              |   null   |       Function |
| onPinchingStop          |   null   |       Function |
| onZoomChange            |   null   |       Function |

## Values returned from TransformWrapper component

| Value                                     | Description                                                                                            |      Type      |
| :---------------------------------------- | :----------------------------------------------------------------------------------------------------- | :------------: |
| minVelocity                               | Minimum mouse velocity which will be animated after panning is done                                    |     Number     |
| minVelocityScale                          | Velocity will be disabled if value is equal or lower than given value                                  |     Number     |
| velocityTimeBasedOnMove                   | Velocity duration is based on the mouse move - the longer the movement, the longer the animation lasts |    Boolean     |
| limitToWrapperBounds                      | Enables panning when zoom is lower than 1, and limit it to the wrapper bounds                          |    Boolean     |
| limitToBounds                             | Limit zooming and panning to wrapper boundaries                                                        |    Boolean     |
| setScale(scale)                           | Sets scale                                                                                             |     Number     |
| setPositionX(positionX)                   | Sets position x                                                                                        |     Number     |
| setPositionY(positionY)                   | Sets position y                                                                                        |     Number     |
| zoomIn()                                  | Zooming in function, used for controls button                                                          |      ---       |
| zoomOut()                                 | Zooming out function, used for controls button                                                         |      ---       |
| setTransform(positionX, positionY, scale) | Sets transformations of content                                                                        | Number or null |
| resetTransform()                          | Reset transformations to the initial values                                                            |     Number     |
| dbClickMode                               | Available modes: "zoomIn", "zoomOut", "reset"                                                          |     String     |

## License

MIT © [prc5](https://github.com/prc5)
