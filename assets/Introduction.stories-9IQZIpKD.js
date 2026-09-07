import{M as i}from"./index-D0lW3ntg.js";import{j as n,a as o,F as s}from"./jsx-runtime-5BUNAZ9W.js";import{useMDXComponents as c}from"./index-_VGcpBFS.js";import"./iframe-T617e1LN.js";import"../sb-preview/runtime.js";import"./index-4g5l5LRQ.js";import"./_commonjsHelpers-4gQjN7DL.js";import"./index-jmm5gWkb.js";import"./index-ogXoivrg.js";import"./index-MI7UZ4bI.js";import"./index-PPLHz8o0.js";function a(r){const e=Object.assign({h1:"h1",blockquote:"blockquote",p:"p",h2:"h2",ul:"ul",li:"li",strong:"strong",code:"code",pre:"pre",a:"a"},c(),r.components);return o(s,{children:[n(i,{title:"Docs/Introduction"}),`
`,n(e.h1,{id:"react-zoom-pan-pinch",children:"React Zoom Pan Pinch"}),`
`,o("p",{children:[n("a",{href:"https://bettertyped.com/",children:n("img",{src:"https://custom-icon-badges.demolab.com/static/v1?label=&message=BetterTyped&color=333&logo=BT"})}),n("a",{href:"https://www.npmjs.com/package/react-zoom-pan-pinch",children:n("img",{src:"https://custom-icon-badges.demolab.com/npm/v/react-zoom-pan-pinch.svg?logo=npm&color=e22121"})}),n("a",{href:"https://github.com/prc5/react-zoom-pan-pinch",children:n("img",{src:"https://custom-icon-badges.demolab.com/github/stars/prc5/react-zoom-pan-pinch?logo=star"})}),n("a",{href:"https://github.com/prc5/react-zoom-pan-pinch/blob/main/License.md",children:n("img",{src:"https://custom-icon-badges.demolab.com/github/license/prc5/react-zoom-pan-pinch?logo=law&color=yellow"})}),n("a",{href:"https://www.npmjs.com/package/react-zoom-pan-pinch",children:n("img",{src:"https://custom-icon-badges.demolab.com/npm/dm/react-zoom-pan-pinch?logoColor=fff&logo=trending-up"})}),n("a",{href:"https://www.npmjs.com/package/react-zoom-pan-pinch",children:n("img",{src:"https://custom-icon-badges.demolab.com/bundlephobia/minzip/react-zoom-pan-pinch?color=E10098&logo=package"})}),n("a",{href:"https://github.com/prc5/react-zoom-pan-pinch",children:n("img",{src:"https://custom-icon-badges.demolab.com/badge/typescript-%23007ACC.svg?logo=typescript&logoColor=white"})})]}),`
`,o(e.blockquote,{children:[`
`,n(e.p,{children:`Super fast and light React library for zooming, panning, and pinching HTML
elements with ease.`}),`
`]}),`
`,n(e.h2,{id:"key-features",children:"Key Features"}),`
`,o(e.ul,{children:[`
`,o(e.li,{children:[n(e.strong,{children:"Fast and lightweight"})," — no external dependencies"]}),`
`,o(e.li,{children:[n(e.strong,{children:"Touch, trackpad, and mouse"})," — full gesture support across devices"]}),`
`,o(e.li,{children:[n(e.strong,{children:"Render props and hooks"})," — flexible API for any component architecture"]}),`
`,o(e.li,{children:[n(e.strong,{children:"Highly customizable"})," — animations, bounds, velocity, padding, and more"]}),`
`,o(e.li,{children:[n(e.strong,{children:"Advanced components"})," — ",n(e.code,{children:"KeepScale"}),", ",n(e.code,{children:"MiniMap"}),", and programmatic controls"]}),`
`]}),`
`,n(e.h2,{id:"installation",children:"Installation"}),`
`,n(e.pre,{children:n(e.code,{className:"language-bash",children:`npm install react-zoom-pan-pinch
`})}),`
`,n(e.p,{children:"or"}),`
`,n(e.pre,{children:n(e.code,{className:"language-bash",children:`yarn add react-zoom-pan-pinch
`})}),`
`,n(e.h2,{id:"quick-start",children:"Quick Start"}),`
`,o(e.p,{children:["The simplest setup — wrap any content with ",n(e.code,{children:"TransformWrapper"}),` and
`,n(e.code,{children:"TransformComponent"}),":"]}),`
`,n(e.pre,{children:n(e.code,{className:"language-tsx",children:`import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const App = () => (
  <TransformWrapper>
    <TransformComponent>
      <img src="image.jpg" alt="Zoomable" />
    </TransformComponent>
  </TransformWrapper>
);
`})}),`
`,n(e.h2,{id:"with-controls-render-props",children:"With Controls (Render Props)"}),`
`,n(e.p,{children:"Access zoom/pan handlers through render props:"}),`
`,n(e.pre,{children:n(e.code,{className:"language-tsx",children:`import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const App = () => (
  <TransformWrapper initialScale={1} initialPositionX={200} initialPositionY={100}>
    {({ zoomIn, zoomOut, resetTransform }) => (
      <>
        <div className="tools">
          <button onClick={() => zoomIn()}>+</button>
          <button onClick={() => zoomOut()}>-</button>
          <button onClick={() => resetTransform()}>x</button>
        </div>
        <TransformComponent>
          <img src="image.jpg" alt="Zoomable" />
        </TransformComponent>
      </>
    )}
  </TransformWrapper>
);
`})}),`
`,n(e.h2,{id:"with-ref-and-zoomtoelement",children:"With Ref and zoomToElement"}),`
`,n(e.p,{children:"Use a ref for imperative access outside of render props:"}),`
`,n(e.pre,{children:n(e.code,{className:"language-tsx",children:`import { useRef } from "react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

const App = () => {
  const ref = useRef<ReactZoomPanPinchRef | null>(null);

  const focusImage = () => {
    ref.current?.zoomToElement("imgExample");
  };

  return (
    <TransformWrapper ref={ref}>
      {({ zoomIn, zoomOut, resetTransform }) => (
        <>
          <button onClick={() => zoomIn()}>+</button>
          <button onClick={() => zoomOut()}>-</button>
          <button onClick={() => resetTransform()}>x</button>
          <TransformComponent>
            <img src="image.jpg" alt="Zoomable" id="imgExample" />
            <div onClick={focusImage}>Focus image</div>
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};
`})}),`
`,n(e.h2,{id:"more-from-bettertyped",children:"More from BetterTyped"}),`
`,n(e.p,{children:"Do you like this library? Here is what else we build and maintain:"}),`
`,o(e.ul,{children:[`
`,o(e.li,{children:[n(e.a,{href:"https://hype-stack.dev",target:"_blank",rel:"nofollow noopener noreferrer",children:"Hype Stack"}),` — a full-stack TypeScript template with
installable feature packs, so you can ship a SaaS in days instead of months.`]}),`
`,o(e.li,{children:[n(e.a,{href:"https://hyperfetch.bettertyped.com",target:"_blank",rel:"nofollow noopener noreferrer",children:"HyperFetch"}),` — type-safe data fetching
and realtime for any framework.`]}),`
`,o(e.li,{children:[n(e.a,{href:"https://bettertyped.com",target:"_blank",rel:"nofollow noopener noreferrer",children:"BetterTyped"}),` — the open source collective behind
these projects.`]}),`
`]}),`
`,n(e.h2,{id:"license",children:"License"}),`
`,o(e.p,{children:["MIT © ",n(e.a,{href:"https://github.com/prc5",target:"_blank",rel:"nofollow noopener noreferrer",children:"prc5"})]})]})}function p(r={}){const{wrapper:e}=Object.assign({},c(),r.components);return e?n(e,{...r,children:n(a,{...r})}):a(r)}const l=()=>{throw new Error("Docs-only story")};l.parameters={docsOnly:!0};const t={title:"Docs/Introduction",tags:["stories-mdx"],includeStories:["__page"]};t.parameters=t.parameters||{};t.parameters.docs={...t.parameters.docs||{},page:p};const w=["__page"];export{w as __namedExportsOrder,l as __page,t as default};
