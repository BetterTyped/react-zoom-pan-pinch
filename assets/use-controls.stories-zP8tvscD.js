import{M as a}from"./index-KmnHMH_U.js";import{j as e,a as o,F as c}from"./jsx-runtime-5BUNAZ9W.js";import{useMDXComponents as s}from"./index-_VGcpBFS.js";import"./iframe-EbPgrFct.js";import"../sb-preview/runtime.js";import"./index-4g5l5LRQ.js";import"./_commonjsHelpers-4gQjN7DL.js";import"./index-jmm5gWkb.js";import"./index-ogXoivrg.js";import"./index-MI7UZ4bI.js";import"./index-PPLHz8o0.js";function i(r){const n=Object.assign({h1:"h1",p:"p",strong:"strong",code:"code",h2:"h2",pre:"pre",ul:"ul",li:"li"},s(),r.components);return o(c,{children:[e(a,{title:"Hooks/useControls"}),`
`,e(n.h1,{id:"usecontrols",children:"useControls"}),`
`,o(n.p,{children:["Access the ",e(n.strong,{children:"transform handlers"})," from any component inside ",e(n.code,{children:"TransformWrapper"}),`
— no render props needed. Returns the same API you get from render props:
`,e(n.code,{children:"zoomIn"}),", ",e(n.code,{children:"zoomOut"}),", ",e(n.code,{children:"resetTransform"}),", ",e(n.code,{children:"centerView"}),", ",e(n.code,{children:"zoomToElement"}),`, and
`,e(n.code,{children:"setTransform"}),", plus the raw ",e(n.code,{children:"instance"})," ref."]}),`
`,e(n.h2,{id:"signature",children:"Signature"}),`
`,e(n.pre,{children:e(n.code,{className:"language-ts",children:`function useControls(): ReactZoomPanPinchContentRef
`})}),`
`,e(n.h2,{id:"return-value",children:"Return Value"}),`
`,e(n.pre,{children:e(n.code,{className:"language-ts",children:`{
  instance: ReactZoomPanPinchContext;  // raw library instance
  zoomIn: (step?, animationTime?, animationName?) => void;
  zoomOut: (step?, animationTime?, animationName?) => void;
  resetTransform: (animationTime?, animationName?) => void;
  centerView: (scale?, animationTime?, animationName?) => void;
  zoomToElement: (node, scale?, animationTime?, animationName?) => void;
  setTransform: (x, y, scale, animationTime?, animationName?) => void;
}
`})}),`
`,e(n.h2,{id:"when-to-use",children:"When to Use"}),`
`,o(n.ul,{children:[`
`,o(n.li,{children:["Building a ",e(n.strong,{children:"toolbar or control panel"})," separate from the content area"]}),`
`,o(n.li,{children:["Triggering zoom/pan from ",e(n.strong,{children:"buttons, menus, or keyboard shortcuts"})]}),`
`,o(n.li,{children:["Any descendant component that needs to ",e(n.strong,{children:"control"})," the transform but not read its state"]}),`
`]}),`
`,o(n.p,{children:["For reading transform state reactively, use ",e(n.code,{children:"useTransformComponent"}),` or
`,e(n.code,{children:"useTransformEffect"})," instead."]}),`
`,e(n.h2,{id:"example",children:"Example"}),`
`,e(n.pre,{children:e(n.code,{className:"language-tsx",children:`import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useControls } from "react-zoom-pan-pinch";

function Toolbar() {
  const { zoomIn, zoomOut, resetTransform, centerView } = useControls();

  return (
    <div className="toolbar">
      <button onClick={() => zoomIn()}>Zoom In</button>
      <button onClick={() => zoomOut()}>Zoom Out</button>
      <button onClick={() => resetTransform()}>Reset</button>
      <button onClick={() => centerView()}>Center</button>
    </div>
  );
}

function App() {
  return (
    <TransformWrapper>
      <Toolbar />
      <TransformComponent>
        <img src="map.jpg" alt="Map" />
      </TransformComponent>
    </TransformWrapper>
  );
}
`})}),`
`,e(n.h2,{id:"vs-render-props",children:"vs Render Props"}),`
`,o(n.p,{children:["Render props work well for simple cases, but ",e(n.code,{children:"useControls"})," is cleaner when:"]}),`
`,o(n.ul,{children:[`
`,o(n.li,{children:["The controls live in a ",e(n.strong,{children:"deeply nested"})," or ",e(n.strong,{children:"separate"})," component"]}),`
`,o(n.li,{children:["You need transform actions in a ",e(n.strong,{children:"custom hook"})]}),`
`,o(n.li,{children:["You want to avoid ",e(n.strong,{children:"prop drilling"})," through multiple layers"]}),`
`]}),`
`,o(n.p,{children:["Both patterns provide the same underlying API — ",e(n.code,{children:"useControls"}),` is just syntactic
sugar over `,e(n.code,{children:"useTransformContext"})," + ",e(n.code,{children:"getControls"}),"."]}),`
`,e(n.h2,{id:"requirements",children:"Requirements"}),`
`,o(n.p,{children:["Must be called inside a component that is a ",e(n.strong,{children:"descendant"}),` of
`,e(n.code,{children:"TransformWrapper"}),". Throws an error if used outside the transform context."]})]})}function d(r={}){const{wrapper:n}=Object.assign({},s(),r.components);return n?e(n,{...r,children:e(i,{...r})}):i(r)}const l=()=>{throw new Error("Docs-only story")};l.parameters={docsOnly:!0};const t={title:"Hooks/useControls",tags:["stories-mdx"],includeStories:["__page"]};t.parameters=t.parameters||{};t.parameters.docs={...t.parameters.docs||{},page:d};const y=["__page"];export{y as __namedExportsOrder,l as __page,t as default};
