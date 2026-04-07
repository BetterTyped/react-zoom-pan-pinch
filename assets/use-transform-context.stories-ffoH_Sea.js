import{M as a}from"./index-KmnHMH_U.js";import{D as c}from"./DocTable-ibiNlqoc.js";import{j as n,a as r,F as l}from"./jsx-runtime-5BUNAZ9W.js";import{useMDXComponents as i}from"./index-_VGcpBFS.js";import"./iframe-EbPgrFct.js";import"../sb-preview/runtime.js";import"./index-4g5l5LRQ.js";import"./_commonjsHelpers-4gQjN7DL.js";import"./index-jmm5gWkb.js";import"./index-ogXoivrg.js";import"./index-MI7UZ4bI.js";import"./index-PPLHz8o0.js";import"./docs.module-E_vLxF47.js";function s(t){const e=Object.assign({h1:"h1",p:"p",strong:"strong",code:"code",h2:"h2",pre:"pre",ul:"ul",li:"li"},i(),t.components);return r(l,{children:[n(a,{title:"Hooks/useTransformContext"}),`
`,n(e.h1,{id:"usetransformcontext",children:"useTransformContext"}),`
`,r(e.p,{children:["The ",n(e.strong,{children:"lowest-level"})," hook — returns the raw library context (the ",n(e.code,{children:"ZoomPanPinch"}),`
instance). All other hooks (`,n(e.code,{children:"useControls"}),", ",n(e.code,{children:"useTransformComponent"}),`,
`,n(e.code,{children:"useTransformEffect"}),", ",n(e.code,{children:"useTransformInit"}),") are built on top of this one."]}),`
`,n(e.h2,{id:"signature",children:"Signature"}),`
`,n(e.pre,{children:n(e.code,{className:"language-ts",children:`function useTransformContext(): ReactZoomPanPinchContext
`})}),`
`,n(e.h2,{id:"return-value",children:"Return Value"}),`
`,n(e.p,{children:"The returned context object provides:"}),`
`,n(c,{columns:[{header:"Property",style:"name"},{header:"Type",style:"type"},{header:"Description",style:"text"}],rows:[["state","{ scale, positionX, positionY, previousScale }","Current mutable transform state"],["setup","object","Resolved configuration (minScale, maxScale, etc.)"],["wrapperComponent","HTMLDivElement | null","The wrapper DOM element"],["contentComponent","HTMLDivElement | null","The content DOM element"],["onChange","(callback) => unsubscribe","Subscribe to transform changes"],["onInit","(callback) => unsubscribe","Subscribe to initialization"]]}),`
`,n(e.h2,{id:"when-to-use",children:"When to Use"}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[n(e.strong,{children:"Building custom hooks"})," on top of the library internals"]}),`
`,r(e.li,{children:[n(e.strong,{children:"Direct DOM access"})," to wrapper/content elements for measurements"]}),`
`,r(e.li,{children:[n(e.strong,{children:"Advanced integrations"}),` that need the raw instance (e.g., syncing with
external renderers like Canvas or WebGL)`]}),`
`]}),`
`,r(e.p,{children:["Most applications should use ",n(e.code,{children:"useControls"}),` (for actions) or
`,n(e.code,{children:"useTransformComponent"})," (for reactive state) instead."]}),`
`,n(e.h2,{id:"example--custom-scale-logger",children:"Example — Custom Scale Logger"}),`
`,n(e.pre,{children:n(e.code,{className:"language-tsx",children:`import { useEffect } from "react";
import { useTransformContext } from "react-zoom-pan-pinch";

function useLogScale() {
  const ctx = useTransformContext();

  useEffect(() => {
    const unsub = ctx.onChange((ref) => {
      console.log("Scale:", ref.instance.state.scale);
    });
    return unsub;
  }, [ctx]);
}
`})}),`
`,n(e.h2,{id:"example--wrapper-dimensions",children:"Example — Wrapper Dimensions"}),`
`,n(e.pre,{children:n(e.code,{className:"language-tsx",children:`function useWrapperSize() {
  const ctx = useTransformContext();
  const wrapper = ctx.wrapperComponent;

  if (!wrapper) return { width: 0, height: 0 };
  return {
    width: wrapper.offsetWidth,
    height: wrapper.offsetHeight,
  };
}
`})}),`
`,n(e.h2,{id:"error-handling",children:"Error Handling"}),`
`,r(e.p,{children:["Throws if called outside of ",n(e.code,{children:"TransformWrapper"}),":"]}),`
`,n(e.pre,{children:n(e.code,{children:`Error: Transform context must be placed inside TransformWrapper
`})}),`
`,n(e.h2,{id:"requirements",children:"Requirements"}),`
`,r(e.p,{children:["Must be called inside a descendant of ",n(e.code,{children:"TransformWrapper"}),"."]})]})}function d(t={}){const{wrapper:e}=Object.assign({},i(),t.components);return e?n(e,{...t,children:n(s,{...t})}):s(t)}const p=()=>{throw new Error("Docs-only story")};p.parameters={docsOnly:!0};const o={title:"Hooks/useTransformContext",tags:["stories-mdx"],includeStories:["__page"]};o.parameters=o.parameters||{};o.parameters.docs={...o.parameters.docs||{},page:d};const E=["__page"];export{E as __namedExportsOrder,p as __page,o as default};
