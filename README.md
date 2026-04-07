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

## 🏢 Using this library in production?

If your application depends on react-zoom-pan-pinch, I offer paid support to
help you resolve issues quickly and avoid blocking releases.

#### Sources

- [Demo](https://bettertyped.github.io/react-zoom-pan-pinch/?path=/story/basic-image--image)
- [Docs](https://bettertyped.github.io/react-zoom-pan-pinch/?path=/docs/docs-props--docs)

<p align="center">
	<a href="https://github.com/sponsors/prc5?tier=platinum">
		<picture>
			<img width="830" src="https://raw.githubusercontent.com/prc5/sponsors/main/assets/Platinum.png" alt="Premium sponsor banner"/>
		</picture>
	</a>
</p>

<p align="center">
	<a href="https://github.com/sponsors/prc5?tier=Platinum">
		<picture>
			<img width="830" src="https://raw.githubusercontent.com/prc5/sponsors/main/packages/platinum/sponsorkit/sponsors.svg" alt="Premium sponsor banner"/>
		</picture>
	</a>
</p>

## Key Features

- 🚀 Fast and easy to use
- 🏭 Light, without external dependencies
- 💎 Mobile gestures, touchpad gestures and desktop mouse events support
- 🎁 Powerful context usage, which gives you a lot of freedom
- 🔧 Highly customizable
- 👑 Animations and Utils to create own tools
- 🔮 Advanced hooks and components

## Try other BetterTyped projects

Do you like this library? Here is another **BetterTyped** project — the whole
preview below is a single link to GitHub.

<div align="center">
  <a href="https://github.com/BetterTyped/hyper-fetch">
    <table>
      <tr>
        <td align="center" valign="middle" width="140">
          <img
            src="./.github/assets/hyper-fetch.svg"
            width="112"
            alt="Hyper Fetch logo"
          />
        </td>
        <td align="left" valign="middle">
          <h3>⚡ Hyper Fetch</h3>
          <p>
          Fetching and realtime data exchange framework.
          </p>
          <b>View on GitHub →</b>
        </td>
      </tr>
    </table>
  </a>
</div>

---

## Installation

```bash
npm install --save react-zoom-pan-pinch
or
yarn add react-zoom-pan-pinch
```

<p align="center">
	<a href="https://github.com/sponsors/prc5?tier=Gold">
		<picture>
			<img width="830" src="https://raw.githubusercontent.com/prc5/sponsors/main/assets/Gold.png" alt="Premium sponsor banner"/>
		</picture>
	</a>
</p>

<p align="center">
	<a href="https://github.com/sponsors/prc5?tier=gold">
		<picture>
			<img width="830" src="https://raw.githubusercontent.com/prc5/sponsors/main/packages/gold/sponsorkit/sponsors.svg" alt="Premium sponsor banner"/>
		</picture>
	</a>
</p>

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
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="tools">
      <button type="button" onClick={() => zoomIn()}>
        +
      </button>
      <button type="button" onClick={() => zoomOut()}>
        -
      </button>
      <button type="button" onClick={() => resetTransform()}>
        x
      </button>
    </div>
  );
};

const Example = () => {
  return (
    <TransformWrapper
      initialScale={1}
      initialPositionX={200}
      initialPositionY={100}
    >
      <Controls />
      <TransformComponent>
        <img src="image.jpg" alt="test" />
        <div>Example text</div>
      </TransformComponent>
    </TransformWrapper>
  );
};
```

<p align="center">
	<a href="https://github.com/sponsors/prc5?tier=Silver">
		<picture>
			<img width="830" src="https://raw.githubusercontent.com/prc5/sponsors/main/assets/Silver.png" alt="Premium sponsor banner" />
		</picture>
	</a>
</p>

<p align="center">
	<a href="https://github.com/sponsors/prc5?tier=Silver">
		<picture>
			<img width="830" src="https://raw.githubusercontent.com/prc5/sponsors/main/packages/silver/sponsorkit/sponsors.svg" alt="Premium sponsor banner" />
		</picture>
	</a>
</p>

## License

MIT © [prc5](https://github.com/prc5)

## Help me keep working on this project ❤️

- [Become a Sponsor on GitHub](https://github.com/sponsors/prc5)

## 💖 Our sponsors

<p align="center">
	<a href="https://github.com/sponsors/prc5">
		<img src="https://raw.githubusercontent.com/prc5/sponsors/main/packages/other/sponsorkit/sponsors.svg?raw=true" alt="My Sponsors" />
	</a>
</p>

## 🏢 Commercial Support

If you're using this library in production, I offer paid support:

- Priority issue resolution
- Help with debugging production issues
- Direct contact with the maintainer

Plans start at $400/month.

📩 Contact: maciekpyrc@gmail.com
