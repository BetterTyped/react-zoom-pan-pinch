import{M as g,C as u,b,A as f}from"./index-LuEhI9vN.js";import{T as a,n as v,M as y,C as w,a as x,b as s}from"./focus-chips-_HbBQNok.js";import{j as e,a as o,F as l}from"./jsx-runtime-5BUNAZ9W.js";import{v as M}from"./viewer.styles-W8oHtTnJ.js";import{useMDXComponents as p}from"./index-_VGcpBFS.js";import"./iframe-4d48n7Dn.js";import"../sb-preview/runtime.js";import"./index-4g5l5LRQ.js";import"./_commonjsHelpers-4gQjN7DL.js";import"./index-jmm5gWkb.js";import"./index-ogXoivrg.js";import"./index-MI7UZ4bI.js";import"./index-PPLHz8o0.js";import"./animations.constants-cwQ5oA34.js";const C={borderRadius:4,border:"2px solid rgba(147, 197, 253, 0.95)",boxShadow:["0 0 0 1px rgba(255,255,255,0.22) inset","0 0 14px rgba(125,211,252,0.45)","0 0 28px rgba(56,189,248,0.22)"].join(", ")},d=()=>o("div",{style:{padding:32},children:[e("h2",{style:{margin:"0 0 16px",fontSize:18,fontWeight:700,color:"rgba(255,255,255,0.9)",fontFamily:"system-ui, -apple-system, sans-serif"},children:"Scrollable Document"}),[1,2,3].map(i=>o("div",{style:{marginBottom:16,padding:"16px 20px",borderRadius:10,background:"rgba(255,255,255,0.03)",borderLeft:`3px solid ${["#667eea","#43e97b","#f093fb"][i-1]}`},children:[o("span",{style:{fontSize:12,fontWeight:700,color:["#667eea","#43e97b","#f093fb"][i-1],fontFamily:"system-ui, -apple-system, sans-serif"},children:["Section ",i]}),e("p",{style:{margin:"8px 0 0",fontSize:13,lineHeight:1.6,color:"rgba(255,255,255,0.5)",fontFamily:"system-ui, -apple-system, sans-serif"},children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."})]},i))]}),r=i=>e("div",{style:{fontFamily:"system-ui, -apple-system, sans-serif",paddingTop:70},children:e(a,{...v(i),wrapperStyle:{width:"500px",height:"500px",maxWidth:"80vw",maxHeight:"75vh"},contentStyle:{width:"500px",height:"500px"},children:n=>o(l,{children:[e("div",{style:{position:"absolute",zIndex:5,top:25,right:25,borderRadius:6,overflow:"hidden",background:"linear-gradient(145deg, rgba(15, 23, 42, 0.92), rgba(10, 10, 24, 0.95))",backdropFilter:"blur(14px) saturate(1.4)",WebkitBackdropFilter:"blur(14px) saturate(1.4)",border:"1px solid rgba(255,255,255,0.12)",boxShadow:"0 4px 24px rgba(0,0,0,0.45), 0 0 0 0.5px rgba(255,255,255,0.06) inset"},children:e(y,{width:168,height:126,zoomable:!0,maskColor:"rgba(6, 10, 20, 0.82)",previewStyle:C,borderColor:"rgba(147, 197, 253, 0.95)",children:e(d,{})})}),e(w,{...n}),e(x,{wrapperStyle:M,children:e(d,{})})]})})});try{r.displayName="Template",r.__docgenInfo={description:"",displayName:"Template",props:{}}}catch{}function c(i){const n=Object.assign({h1:"h1",p:"p",strong:"strong",code:"code",h2:"h2",ul:"ul",li:"li"},p(),i.components);return o(l,{children:[e(g,{title:"Components/Mini Map",component:a,argTypes:s}),`
`,e(n.h1,{id:"mini-map",children:"Mini Map"}),`
`,o(n.p,{children:["A ",e(n.strong,{children:"miniature overview"}),` that mirrors the main content and highlights the
currently visible viewport. The `,e(n.code,{children:"MiniMap"}),` component renders a scaled-down
duplicate of the content in a floating panel — useful for large canvases,
documents, or maps where spatial awareness matters.`]}),`
`,e(u,{children:e(b,{name:"Mini Map",children:m=>e(r,{...m})})}),`
`,e(n.h2,{id:"interaction",children:"Interaction"}),`
`,e(n.p,{children:"The mini map behaves like the one in React Flow:"}),`
`,o(n.ul,{children:[`
`,o(n.li,{children:[e(n.strong,{children:"Drag anywhere"}),` on the map to grab the viewport indicator. It follows the
pointer (mouse or touch) 1:1 — pressing the map never jumps the view.
`,e(n.code,{children:"inversePan"})," flips the direction so the drag moves the content instead."]}),`
`,o(n.li,{children:[e(n.strong,{children:"Wheel"})," over the map zooms the main view around its centre when ",e(n.code,{children:"zoomable"}),`
is on (`,e(n.code,{children:"zoomStep"})," per notch)."]}),`
`,o(n.li,{children:[e(n.strong,{children:"Click / tap"})," without moving fires ",e(n.code,{children:"onClick(event, position)"}),` with the point
in content coordinates — pair it with `,e(n.code,{children:"zoomToPoint"})," for click-to-zoom."]}),`
`,o(n.li,{children:[`The map always shows the union of the content and the current viewport (plus
`,e(n.code,{children:"offsetScale"}),` padding), so the indicator stays visible even when the view is
panned or zoomed past the content.`]}),`
`]}),`
`,e(n.h2,{id:"minimap-props",children:"MiniMap props"}),`
`,o(n.p,{children:[`| Prop                                | Default              | Description                                                         |
| ----------------------------------- | -------------------- | ------------------------------------------------------------------- |
| `,e(n.code,{children:"width"})," / ",e(n.code,{children:"height"}),"                  | ",e(n.code,{children:"200"})," / ",e(n.code,{children:"200"}),`        | Size of the mini map box in px.                                     |
| `,e(n.code,{children:"panning"}),"                           | ",e(n.code,{children:"true"}),`               | Drag to move the viewport.                                          |
| `,e(n.code,{children:"inversePan"}),"                        | ",e(n.code,{children:"false"}),`              | Drag moves the content instead of the indicator.                    |
| `,e(n.code,{children:"zoomable"}),"                          | ",e(n.code,{children:"false"}),`              | Wheel over the map zooms the main view.                             |
| `,e(n.code,{children:"zoomStep"}),"                          | ",e(n.code,{children:"0.2"}),`                | Scale increment per wheel notch.                                    |
| `,e(n.code,{children:"offsetScale"}),"                       | ",e(n.code,{children:"5"}),`                  | Padding around the mapped area (mini map px at map scale).          |
| `,e(n.code,{children:"maskColor"}),"                         | ",e(n.code,{children:"rgba(0, 0, 0, 0.2)"})," | Colour of the overlay outside the viewport (",e(n.code,{children:".rzpp-minimap-mask"}),`).  |
| `,e(n.code,{children:"borderColor"}),"                       | ",e(n.code,{children:"red"}),`                | Border colour of the viewport indicator.                            |
| `,e(n.code,{children:"previewStyle"})," / ",e(n.code,{children:"previewClassName"})," | —                    | Customise the indicator (",e(n.code,{children:".rzpp-minimap-preview"}),`).                  |
| `,e(n.code,{children:"wrapperClassName"}),"                  | —                    | Extra class for the scaled content clone (",e(n.code,{children:".rzpp-minimap-wrapper"}),`). |
| `,e(n.code,{children:"onClick"}),"                           | —                    | ",e(n.code,{children:"(event, { x, y })"})," for a click or tap that did not drag.           |"]}),`
`,o(n.p,{children:["Any other ",e(n.code,{children:"div"})," attribute (",e(n.code,{children:"style"}),", ",e(n.code,{children:"className"}),", ",e(n.code,{children:"aria-*"}),`) is spread onto the
`,e(n.code,{children:".rzpp-mini-map"})," container."]}),`
`,e(n.h2,{id:"component-api",children:"Component API"}),`
`,e(f,{story:"Mini Map"})]})}function S(i={}){const{wrapper:n}=Object.assign({},p(),i.components);return n?e(n,{...i,children:e(c,{...i})}):c(i)}const h=i=>e(r,{...i});h.storyName="Mini Map";h.parameters={storySource:{source:"args => <Template {...args} />"}};const t={title:"Components/Mini Map",component:a,argTypes:s,tags:["stories-mdx"],includeStories:["miniMap"]};t.parameters=t.parameters||{};t.parameters.docs={...t.parameters.docs||{},page:S};const L=["miniMap"];export{L as __namedExportsOrder,t as default,h as miniMap};
