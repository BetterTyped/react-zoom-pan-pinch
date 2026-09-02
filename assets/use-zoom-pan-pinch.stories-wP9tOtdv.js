import{M as a}from"./index-pmtXLxT4.js";import{j as n,a as r,F as s}from"./jsx-runtime-5BUNAZ9W.js";import{useMDXComponents as i}from"./index-_VGcpBFS.js";import"./iframe-oTSDbOUR.js";import"../sb-preview/runtime.js";import"./index-4g5l5LRQ.js";import"./_commonjsHelpers-4gQjN7DL.js";import"./index-jmm5gWkb.js";import"./index-ogXoivrg.js";import"./index-MI7UZ4bI.js";import"./index-PPLHz8o0.js";function c(o){const e=Object.assign({h1:"h1",p:"p",strong:"strong",code:"code",h2:"h2",pre:"pre",ul:"ul",li:"li"},i(),o.components);return r(s,{children:[n(a,{title:"Hooks/useZoomPanPinch"}),`
`,n(e.h1,{id:"usezoompanpinch",children:"useZoomPanPinch"}),`
`,r(e.p,{children:["The ",n(e.strong,{children:"headless"}),` hook. It gives you the full zoom / pan / pinch engine without
`,n(e.code,{children:"TransformWrapper"})," and ",n(e.code,{children:"TransformComponent"}),`, so you can attach the behaviour to
your own markup — a plain `,n(e.code,{children:"div"}),", a ",n(e.code,{children:"canvas"}),` wrapper, an existing layout you
cannot restructure.`]}),`
`,n(e.h2,{id:"signature",children:"Signature"}),`
`,n(e.pre,{children:n(e.code,{className:"language-ts",children:`function useZoomPanPinch(props?: ReactZoomPanPinchProps): {
  wrapperRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  instance: React.MutableRefObject<ZoomPanPinch>;
  useTransform: (callback: (data: {
    scale: number;
    positionX: number;
    positionY: number;
    previousScale: number;
    ref: ReactZoomPanPinchRef;
  }) => void) => void;
}
`})}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[n(e.strong,{children:n(e.code,{children:"wrapperRef"})}),` — attach to the element that clips the content and receives
the gestures.`]}),`
`,r(e.li,{children:[n(e.strong,{children:n(e.code,{children:"contentRef"})}),` — attach to the element that gets transformed. The hook
writes `,n(e.code,{children:"style.transform"})," on it directly."]}),`
`,r(e.li,{children:[n(e.strong,{children:n(e.code,{children:"instance"})})," — the underlying engine. ",n(e.code,{children:"instance.current.state"}),` holds the
transform; controls are available through
`,n(e.code,{children:"getControls(instance.current)"})," or by reading ",n(e.code,{children:"instance.current"}),` directly
(`,n(e.code,{children:"setTransform"}),", ",n(e.code,{children:"zoomIn"}),", ",n(e.code,{children:"zoomToElement"}),", …)."]}),`
`,r(e.li,{children:[n(e.strong,{children:n(e.code,{children:"useTransform"})}),` — register a callback that runs on every transform
change, without re-rendering.`]}),`
`]}),`
`,r(e.p,{children:["All ",n(e.code,{children:"TransformWrapper"})," props (",n(e.code,{children:"minScale"}),", ",n(e.code,{children:"wheel"}),", ",n(e.code,{children:"panning"}),", ",n(e.code,{children:"limitToBounds"}),`,
…) are accepted and behave the same.`]}),`
`,n(e.h2,{id:"example",children:"Example"}),`
`,n(e.pre,{children:n(e.code,{className:"language-tsx",children:`import { useZoomPanPinch, getControls } from "react-zoom-pan-pinch";

function Canvas() {
  const { wrapperRef, contentRef, instance, useTransform } = useZoomPanPinch({
    minScale: 0.5,
    maxScale: 4,
    wheel: { step: 0.1 },
  });

  useTransform(({ scale }) => {
    document.title = \`\${Math.round(scale * 100)}%\`;
  });

  return (
    <>
      <button onClick={() => getControls(instance.current).zoomIn()}>+</button>
      <div ref={wrapperRef} style={{ width: 600, height: 400, overflow: "hidden" }}>
        <div ref={contentRef} style={{ width: 1200, height: 800, transformOrigin: "0 0" }}>
          …
        </div>
      </div>
    </>
  );
}
`})}),`
`,n(e.h2,{id:"notes",children:"Notes"}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:["You own the styling: give the wrapper ",n(e.code,{children:"overflow: hidden"}),` (or whatever
clipping you want) and the content `,n(e.code,{children:"transform-origin: 0 0"}),"."]}),`
`,n(e.li,{children:"The engine mounts in a layout effect and cleans up on unmount."}),`
`,r(e.li,{children:["Prefer ",n(e.code,{children:"TransformWrapper"})," + ",n(e.code,{children:"TransformComponent"}),` when you do not need custom
markup — they wire the same instance with sensible defaults and expose the
context hooks (`,n(e.code,{children:"useControls"}),", ",n(e.code,{children:"useTransformEffect"}),", …)."]}),`
`]})]})}function d(o={}){const{wrapper:e}=Object.assign({},i(),o.components);return e?n(e,{...o,children:n(c,{...o})}):c(o)}const l=()=>{throw new Error("Docs-only story")};l.parameters={docsOnly:!0};const t={title:"Hooks/useZoomPanPinch",tags:["stories-mdx"],includeStories:["__page"]};t.parameters=t.parameters||{};t.parameters.docs={...t.parameters.docs||{},page:d};const T=["__page"];export{T as __namedExportsOrder,l as __page,t as default};
