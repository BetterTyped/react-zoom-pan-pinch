import{M as i}from"./index-b6LqllKp.js";import{D as c}from"./DocTable-ibiNlqoc.js";import{j as n,a as t,F as l}from"./jsx-runtime-5BUNAZ9W.js";import{useMDXComponents as o}from"./index-_VGcpBFS.js";import"./iframe-bARXzOsO.js";import"../sb-preview/runtime.js";import"./index-4g5l5LRQ.js";import"./_commonjsHelpers-4gQjN7DL.js";import"./index-jmm5gWkb.js";import"./index-ogXoivrg.js";import"./index-MI7UZ4bI.js";import"./index-PPLHz8o0.js";import"./docs.module-E_vLxF47.js";function s(r){const e=Object.assign({h1:"h1",p:"p",strong:"strong",code:"code",h2:"h2",pre:"pre",ul:"ul",li:"li",h3:"h3"},o(),r.components);return t(l,{children:[n(i,{title:"Hooks/useTransformInit"}),`
`,n(e.h1,{id:"usetransforminit",children:"useTransformInit"}),`
`,t(e.p,{children:["Run a callback ",n(e.strong,{children:"once"})," when the ",n(e.code,{children:"TransformWrapper"}),` content and wrapper DOM
elements are ready. If the components are already mounted when the hook runs,
the callback fires immediately. Otherwise, it waits for the internal `,n(e.code,{children:"onInit"}),`
event.`]}),`
`,n(e.h2,{id:"signature",children:"Signature"}),`
`,n(e.pre,{children:n(e.code,{className:"language-ts",children:`function useTransformInit(
  callback: (state: ReactZoomPanPinchContextState) => void | (() => void),
): void
`})}),`
`,t(e.p,{children:[n(e.strong,{children:n(e.code,{children:"state"})})," contains:"]}),`
`,n(e.pre,{children:n(e.code,{className:"language-ts",children:`{
  state: { previousScale, scale, positionX, positionY };
  instance: ReactZoomPanPinchContext;
}
`})}),`
`,t(e.p,{children:["The callback can return a ",n(e.strong,{children:"cleanup function"})," that runs on unmount."]}),`
`,n(e.h2,{id:"when-to-use",children:"When to Use"}),`
`,t(e.ul,{children:[`
`,t(e.li,{children:[n(e.strong,{children:"Initial measurements"})," — read wrapper/content dimensions after mount"]}),`
`,t(e.li,{children:[n(e.strong,{children:"One-time setup"})," — configure external systems that depend on viewport size"]}),`
`,t(e.li,{children:[n(e.strong,{children:"Initial state logging"})," — record the starting transform values"]}),`
`]}),`
`,t(e.p,{children:["For reacting to ",n(e.strong,{children:"every"})," transform change, use ",n(e.code,{children:"useTransformEffect"}),` instead.
This hook fires only once.`]}),`
`,n(e.h2,{id:"examples",children:"Examples"}),`
`,n(e.h3,{id:"read-initial-dimensions",children:"Read Initial Dimensions"}),`
`,n(e.pre,{children:n(e.code,{className:"language-tsx",children:`import { useTransformInit } from "react-zoom-pan-pinch";

function Setup() {
  useTransformInit(({ instance }) => {
    const wrapper = instance.wrapperComponent;
    if (wrapper) {
      console.log("Viewport:", wrapper.offsetWidth, "x", wrapper.offsetHeight);
    }
  });

  return null;
}
`})}),`
`,n(e.h3,{id:"external-system-setup",children:"External System Setup"}),`
`,n(e.pre,{children:n(e.code,{className:"language-tsx",children:`function CanvasSetup() {
  useTransformInit(({ state, instance }) => {
    const canvas = initExternalCanvas({
      width: instance.wrapperComponent?.offsetWidth ?? 0,
      height: instance.wrapperComponent?.offsetHeight ?? 0,
      initialScale: state.scale,
    });

    return () => {
      canvas.destroy();
    };
  });

  return null;
}
`})}),`
`,n(e.h2,{id:"key-differences",children:"Key Differences"}),`
`,n(c,{columns:[{header:""},{header:"useTransformInit",style:"type"},{header:"useTransformEffect",style:"text"}],rows:[["Fires","Once (on mount)","On every transform change"],["Purpose","Setup / measurements","Ongoing side-effects"],["Deps","[] (captured once)","[callback, context]"]]}),`
`,n(e.h2,{id:"caveat",children:"Caveat"}),`
`,t(e.p,{children:["The dependency array is ",n(e.strong,{children:"empty"})," internally (",n(e.code,{children:"[]"}),`), so the callback is
captured once at mount time. If your callback references props or state that
change over time, those values will be stale. For dynamic callbacks, use
`,n(e.code,{children:"useTransformEffect"}),"."]}),`
`,n(e.h2,{id:"requirements",children:"Requirements"}),`
`,t(e.p,{children:["Must be called inside a descendant of ",n(e.code,{children:"TransformWrapper"}),"."]})]})}function d(r={}){const{wrapper:e}=Object.assign({},o(),r.components);return e?n(e,{...r,children:n(s,{...r})}):s(r)}const h=()=>{throw new Error("Docs-only story")};h.parameters={docsOnly:!0};const a={title:"Hooks/useTransformInit",tags:["stories-mdx"],includeStories:["__page"]};a.parameters=a.parameters||{};a.parameters.docs={...a.parameters.docs||{},page:d};const C=["__page"];export{C as __namedExportsOrder,h as __page,a as default};
