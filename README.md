# react-zoom-pan-pinch

[![NPM](https://img.shields.io/npm/v/react-zoom-pan-pinch.svg)](https://www.npmjs.com/package/react-zoom-pan-pinch)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-zoom-pan-pinch)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![NPM](https://img.shields.io/npm/l/react-zoom-pan-pinch)
![npm](https://img.shields.io/npm/dm/react-zoom-pan-pinch)
![GitHub stars](https://img.shields.io/github/stars/prc5/react-zoom-pan-pinch?style=social)

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
- :crown: Animations and many options

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

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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
              <button onClick={zoomIn}>+</button>
              <button onClick={zoomOut}>-</button>
              <button onClick={resetTransform}>x</button>
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

MIT © [prc5](https://github.com/prc5)

## Contributors ✨

Thanks goes to these wonderful people
([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://maciejpyrc.pl"><img src="https://avatars3.githubusercontent.com/u/20928302?v=4" width="80px;" alt=""/><br /><sub><b>Maciej Pyrc</b></sub></a><br /><a href="https://github.com/prc5/react-zoom-pan-pinch/pulls?q=is%3Apr+reviewed-by%3Aprc5" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/prc5/react-zoom-pan-pinch/commits?author=prc5" title="Code">💻</a> <a href="#infra-prc5" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-prc5" title="Maintenance">🚧</a> <a href="#example-prc5" title="Examples">💡</a> <a href="#question-prc5" title="Answering Questions">💬</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the
[all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind welcome!

```

```
