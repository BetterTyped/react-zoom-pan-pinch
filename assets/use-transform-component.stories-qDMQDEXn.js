import{M as i}from"./index-KmnHMH_U.js";import{D as c}from"./DocTable-ibiNlqoc.js";import{j as n,a as r,F as d}from"./jsx-runtime-5BUNAZ9W.js";import{useMDXComponents as a}from"./index-_VGcpBFS.js";import"./iframe-EbPgrFct.js";import"../sb-preview/runtime.js";import"./index-4g5l5LRQ.js";import"./_commonjsHelpers-4gQjN7DL.js";import"./index-jmm5gWkb.js";import"./index-ogXoivrg.js";import"./index-MI7UZ4bI.js";import"./index-PPLHz8o0.js";import"./docs.module-E_vLxF47.js";function s(t){const e=Object.assign({h1:"h1",p:"p",strong:"strong",h2:"h2",pre:"pre",code:"code",ul:"ul",li:"li",h3:"h3"},a(),t.components);return r(d,{children:[n(i,{title:"Hooks/useTransformComponent"}),`
`,n(e.h1,{id:"usetransformcomponent",children:"useTransformComponent"}),`
`,r(e.p,{children:["Subscribe to every transform change and ",n(e.strong,{children:"return a value"}),` — typically JSX —
that updates in real time. This hook is the primary way to build UI that
reflects the current zoom, pan, or scale state without manual event wiring.`]}),`
`,n(e.h2,{id:"signature",children:"Signature"}),`
`,n(e.pre,{children:n(e.code,{className:"language-ts",children:`function useTransformComponent<T>(
  callback: (state: ReactZoomPanPinchContextState) => T,
): T
`})}),`
`,r(e.p,{children:[n(e.strong,{children:n(e.code,{children:"state"})})," contains:"]}),`
`,n(e.pre,{children:n(e.code,{className:"language-ts",children:`{
  state: {
    previousScale: number;
    scale: number;
    positionX: number;
    positionY: number;
  };
  instance: ReactZoomPanPinchContext;
}
`})}),`
`,n(e.h2,{id:"how-it-works",children:"How It Works"}),`
`,r(e.p,{children:["Internally, ",n(e.code,{children:"useTransformComponent"})," subscribes to the library's ",n(e.code,{children:"onChange"}),`
event and calls your callback on every transform update. The return value is
stored in React state (`,n(e.code,{children:"useState"}),`), so the consuming component re-renders
whenever the transform changes.`]}),`
`,n(e.h2,{id:"when-to-use",children:"When to Use"}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[n(e.strong,{children:"Scale badges"})," — show the current zoom level (",n(e.code,{children:"state.scale"}),")"]}),`
`,r(e.li,{children:[n(e.strong,{children:"Coordinate displays"})," — show positionX / positionY"]}),`
`,r(e.li,{children:[n(e.strong,{children:"Conditional rendering"})," — show/hide elements based on zoom level"]}),`
`,r(e.li,{children:["Any UI element that should ",n(e.strong,{children:"visually update"})," on every transform tick"]}),`
`]}),`
`,n(e.h2,{id:"examples",children:"Examples"}),`
`,n(e.h3,{id:"scale-indicator",children:"Scale Indicator"}),`
`,n(e.pre,{children:n(e.code,{className:"language-tsx",children:`function ScaleBadge() {
  return useTransformComponent(({ state }) => (
    <div className="badge">{state.scale.toFixed(2)}x</div>
  ));
}
`})}),`
`,n(e.h3,{id:"zoom-percentage",children:"Zoom Percentage"}),`
`,n(e.pre,{children:n(e.code,{className:"language-tsx",children:`function ZoomPercent() {
  return useTransformComponent(({ state }) => (
    <span>{Math.round(state.scale * 100)}%</span>
  ));
}
`})}),`
`,n(e.h3,{id:"coordinates",children:"Coordinates"}),`
`,n(e.pre,{children:n(e.code,{className:"language-tsx",children:`function Coords() {
  return useTransformComponent(({ state }) => (
    <div>
      X: {state.positionX.toFixed(0)}, Y: {state.positionY.toFixed(0)}
    </div>
  ));
}
`})}),`
`,n(e.h2,{id:"performance",children:"Performance"}),`
`,r(e.p,{children:["The callback fires on ",n(e.strong,{children:"every"}),` transform event — every mouse move during a
pan, every wheel tick, every pinch frame. Keep the callback lightweight.
Avoid expensive computations or large JSX trees inside it. If you only need
to run side-effects (not render UI), use `,n(e.code,{children:"useTransformEffect"})," instead."]}),`
`,n(e.h2,{id:"vs-other-hooks",children:"vs Other Hooks"}),`
`,n(c,{columns:[{header:"Hook",style:"name"},{header:"Purpose",style:"type"},{header:"Re-renders?",style:"text"}],rows:[["useTransformComponent","Render UI from state","Yes"],["useTransformEffect","Side-effects on change","No"],["useControls","Trigger actions","No"],["useTransformContext","Raw instance access","No"]]}),`
`,n(e.h2,{id:"requirements",children:"Requirements"}),`
`,r(e.p,{children:["Must be called inside a descendant of ",n(e.code,{children:"TransformWrapper"}),"."]})]})}function l(t={}){const{wrapper:e}=Object.assign({},a(),t.components);return e?n(e,{...t,children:n(s,{...t})}):s(t)}const h=()=>{throw new Error("Docs-only story")};h.parameters={docsOnly:!0};const o={title:"Hooks/useTransformComponent",tags:["stories-mdx"],includeStories:["__page"]};o.parameters=o.parameters||{};o.parameters.docs={...o.parameters.docs||{},page:l};const S=["__page"];export{S as __namedExportsOrder,h as __page,o as default};
