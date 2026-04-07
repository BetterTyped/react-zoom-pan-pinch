import{M as c}from"./index-b6LqllKp.js";import{D as i}from"./DocTable-ibiNlqoc.js";import{j as n,a as t,F as l}from"./jsx-runtime-5BUNAZ9W.js";import{useMDXComponents as o}from"./index-_VGcpBFS.js";import"./iframe-bARXzOsO.js";import"../sb-preview/runtime.js";import"./index-4g5l5LRQ.js";import"./_commonjsHelpers-4gQjN7DL.js";import"./index-jmm5gWkb.js";import"./index-ogXoivrg.js";import"./index-MI7UZ4bI.js";import"./index-PPLHz8o0.js";import"./docs.module-E_vLxF47.js";function s(r){const e=Object.assign({h1:"h1",p:"p",strong:"strong",code:"code",h2:"h2",pre:"pre",ul:"ul",li:"li",h3:"h3"},o(),r.components);return t(l,{children:[n(c,{title:"Hooks/useTransformEffect"}),`
`,n(e.h1,{id:"usetransformeffect",children:"useTransformEffect"}),`
`,t(e.p,{children:["Run a ",n(e.strong,{children:"side-effect"}),` on every transform change — without triggering React
re-renders. Think of it as `,n(e.code,{children:"useEffect"}),` for transform state: your callback
fires on every pan, zoom, or pinch event, and can optionally return a cleanup
function.`]}),`
`,n(e.h2,{id:"signature",children:"Signature"}),`
`,n(e.pre,{children:n(e.code,{className:"language-ts",children:`function useTransformEffect(
  callback: (state: ReactZoomPanPinchContextState) => void | (() => void),
): void
`})}),`
`,t(e.p,{children:[n(e.strong,{children:n(e.code,{children:"state"})})," contains:"]}),`
`,n(e.pre,{children:n(e.code,{className:"language-ts",children:`{
  state: { previousScale, scale, positionX, positionY };
  instance: ReactZoomPanPinchContext;
}
`})}),`
`,t(e.p,{children:["The callback can return a ",n(e.strong,{children:"cleanup function"}),` that runs before the next
invocation and on unmount — the same pattern as `,n(e.code,{children:"useEffect"}),"."]}),`
`,n(e.h2,{id:"when-to-use",children:"When to Use"}),`
`,t(e.ul,{children:[`
`,t(e.li,{children:[n(e.strong,{children:"Analytics"})," — log zoom events or viewport positions"]}),`
`,t(e.li,{children:[n(e.strong,{children:"URL sync"})," — update query parameters with the current viewport"]}),`
`,t(e.li,{children:[n(e.strong,{children:"External state"})," — push transform data to a store (Redux, Zustand, etc.)"]}),`
`,t(e.li,{children:[n(e.strong,{children:"DOM mutations"})," — update a canvas overlay or external tooltip positions"]}),`
`,t(e.li,{children:[n(e.strong,{children:"Debounced saves"})," — persist viewport state after interaction stops"]}),`
`]}),`
`,t(e.p,{children:[`For rendering UI that updates with transform state, use
`,n(e.code,{children:"useTransformComponent"})," instead — it manages React state and re-renders for you."]}),`
`,n(e.h2,{id:"examples",children:"Examples"}),`
`,n(e.h3,{id:"sync-to-url",children:"Sync to URL"}),`
`,n(e.pre,{children:n(e.code,{className:"language-tsx",children:`import { useTransformEffect } from "react-zoom-pan-pinch";

function ViewportSync() {
  useTransformEffect(({ state }) => {
    const params = new URLSearchParams(window.location.search);
    params.set("x", String(Math.round(state.positionX)));
    params.set("y", String(Math.round(state.positionY)));
    params.set("s", state.scale.toFixed(2));
    window.history.replaceState(null, "", \`?\${params}\`);
  });

  return null;
}
`})}),`
`,n(e.h3,{id:"analytics-logging",children:"Analytics Logging"}),`
`,n(e.pre,{children:n(e.code,{className:"language-tsx",children:`function ZoomAnalytics() {
  useTransformEffect(({ state }) => {
    if (state.scale !== state.previousScale) {
      analytics.track("zoom_changed", { scale: state.scale });
    }
  });

  return null;
}
`})}),`
`,n(e.h3,{id:"cleanup-pattern",children:"Cleanup Pattern"}),`
`,n(e.pre,{children:n(e.code,{className:"language-tsx",children:`function Overlay() {
  useTransformEffect(({ state }) => {
    const overlay = document.getElementById("canvas-overlay");
    overlay?.style.setProperty("--scale", String(state.scale));

    return () => {
      overlay?.style.removeProperty("--scale");
    };
  });

  return null;
}
`})}),`
`,n(e.h2,{id:"key-differences",children:"Key Differences"}),`
`,n(i,{columns:[{header:""},{header:"useTransformEffect",style:"type"},{header:"useTransformComponent",style:"text"}],rows:[["Purpose","Side-effects","Render UI"],["Returns","void","T (your callback's return)"],["Re-renders?","No","Yes"],["Use case","Logging, syncing, DOM","Badges, labels, indicators"]]}),`
`,n(e.h2,{id:"requirements",children:"Requirements"}),`
`,t(e.p,{children:["Must be called inside a descendant of ",n(e.code,{children:"TransformWrapper"}),"."]})]})}function d(r={}){const{wrapper:e}=Object.assign({},o(),r.components);return e?n(e,{...r,children:n(s,{...r})}):s(r)}const h=()=>{throw new Error("Docs-only story")};h.parameters={docsOnly:!0};const a={title:"Hooks/useTransformEffect",tags:["stories-mdx"],includeStories:["__page"]};a.parameters=a.parameters||{};a.parameters.docs={...a.parameters.docs||{},page:d};const M=["__page"];export{M as __namedExportsOrder,h as __page,a as default};
