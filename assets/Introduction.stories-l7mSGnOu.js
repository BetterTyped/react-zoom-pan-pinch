import{M as i}from"./index-K2eeIKJi.js";import{j as n,a as e,F as s}from"./jsx-runtime-5BUNAZ9W.js";import{useMDXComponents as c}from"./index-_VGcpBFS.js";import"./iframe-V8WOByp9.js";import"../sb-preview/runtime.js";import"./index-4g5l5LRQ.js";import"./_commonjsHelpers-4gQjN7DL.js";import"./index-jmm5gWkb.js";import"./index-ogXoivrg.js";import"./index-MI7UZ4bI.js";import"./index-PPLHz8o0.js";function a(r){const o=Object.assign({h1:"h1",blockquote:"blockquote",p:"p",h2:"h2",ul:"ul",li:"li",strong:"strong",code:"code",pre:"pre",a:"a"},c(),r.components);return e(s,{children:[n(i,{title:"Docs/Introduction"}),`
`,n(o.h1,{id:"react-zoom-pan-pinch",children:"React Zoom Pan Pinch"}),`
`,e("p",{children:[n("a",{href:"https://bettertyped.com/",children:n("img",{src:"https://custom-icon-badges.demolab.com/static/v1?label=&message=BetterTyped&color=333&logo=BT"})}),n("a",{href:"https://www.npmjs.com/package/react-zoom-pan-pinch",children:n("img",{src:"https://custom-icon-badges.demolab.com/npm/v/react-zoom-pan-pinch.svg?logo=npm&color=e22121"})}),n("a",{href:"https://github.com/prc5/react-zoom-pan-pinch",children:n("img",{src:"https://custom-icon-badges.demolab.com/github/stars/prc5/react-zoom-pan-pinch?logo=star"})}),n("a",{href:"https://github.com/prc5/react-zoom-pan-pinch/blob/main/License.md",children:n("img",{src:"https://custom-icon-badges.demolab.com/github/license/prc5/react-zoom-pan-pinch?logo=law&color=yellow"})}),n("a",{href:"https://www.npmjs.com/package/react-zoom-pan-pinch",children:n("img",{src:"https://custom-icon-badges.demolab.com/npm/dm/react-zoom-pan-pinch?logoColor=fff&logo=trending-up"})}),n("a",{href:"https://www.npmjs.com/package/react-zoom-pan-pinch",children:n("img",{src:"https://custom-icon-badges.demolab.com/bundlephobia/minzip/react-zoom-pan-pinch?color=E10098&logo=package"})}),n("a",{href:"https://github.com/prc5/react-zoom-pan-pinch",children:n("img",{src:"https://custom-icon-badges.demolab.com/badge/typescript-%23007ACC.svg?logo=typescript&logoColor=white"})})]}),`
`,e(o.blockquote,{children:[`
`,n(o.p,{children:`Super fast and light React library for zooming, panning, and pinching HTML
elements with ease.`}),`
`]}),`
`,n(o.h2,{id:"key-features",children:"Key Features"}),`
`,e(o.ul,{children:[`
`,e(o.li,{children:[n(o.strong,{children:"Fast and lightweight"})," — no external dependencies"]}),`
`,e(o.li,{children:[n(o.strong,{children:"Touch, trackpad, and mouse"})," — full gesture support across devices"]}),`
`,e(o.li,{children:[n(o.strong,{children:"Render props and hooks"})," — flexible API for any component architecture"]}),`
`,e(o.li,{children:[n(o.strong,{children:"Highly customizable"})," — animations, bounds, velocity, padding, and more"]}),`
`,e(o.li,{children:[n(o.strong,{children:"Advanced components"})," — ",n(o.code,{children:"KeepScale"}),", ",n(o.code,{children:"MiniMap"}),", and programmatic controls"]}),`
`]}),`
`,n(o.h2,{id:"installation",children:"Installation"}),`
`,n(o.pre,{children:n(o.code,{className:"language-bash",children:`npm install react-zoom-pan-pinch
`})}),`
`,n(o.p,{children:"or"}),`
`,n(o.pre,{children:n(o.code,{className:"language-bash",children:`yarn add react-zoom-pan-pinch
`})}),`
`,n(o.h2,{id:"quick-start",children:"Quick Start"}),`
`,e(o.p,{children:["The simplest setup — wrap any content with ",n(o.code,{children:"TransformWrapper"}),` and
`,n(o.code,{children:"TransformComponent"}),":"]}),`
`,n(o.pre,{children:n(o.code,{className:"language-tsx",children:`import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const App = () => (
  <TransformWrapper>
    <TransformComponent>
      <img src="image.jpg" alt="Zoomable" />
    </TransformComponent>
  </TransformWrapper>
);
`})}),`
`,n(o.h2,{id:"with-controls-render-props",children:"With Controls (Render Props)"}),`
`,n(o.p,{children:"Access zoom/pan handlers through render props:"}),`
`,n(o.pre,{children:n(o.code,{className:"language-tsx",children:`import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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
`,n(o.h2,{id:"with-ref-and-zoomtoelement",children:"With Ref and zoomToElement"}),`
`,n(o.p,{children:"Use a ref for imperative access outside of render props:"}),`
`,n(o.pre,{children:n(o.code,{className:"language-tsx",children:`import { useRef } from "react";
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
`,n(o.h2,{id:"license",children:"License"}),`
`,e(o.p,{children:["MIT © ",n(o.a,{href:"https://github.com/prc5",target:"_blank",rel:"nofollow noopener noreferrer",children:"prc5"})]})]})}function p(r={}){const{wrapper:o}=Object.assign({},c(),r.components);return o?n(o,{...r,children:n(a,{...r})}):a(r)}const m=()=>{throw new Error("Docs-only story")};m.parameters={docsOnly:!0};const t={title:"Docs/Introduction",tags:["stories-mdx"],includeStories:["__page"]};t.parameters=t.parameters||{};t.parameters.docs={...t.parameters.docs||{},page:p};const k=["__page"];export{k as __namedExportsOrder,m as __page,t as default};
