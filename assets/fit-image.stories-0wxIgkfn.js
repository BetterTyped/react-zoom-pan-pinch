import{M as g,C as f,b as u,A as w}from"./index-xmQ6lgSn.js";import{n as b,T as s,C as y,a as T,u as v,b as d}from"./focus-chips-_HbBQNok.js";import{j as e,a as i,F as m}from"./jsx-runtime-5BUNAZ9W.js";import{v as x}from"./viewer.styles-W8oHtTnJ.js";import"./index-4g5l5LRQ.js";import{b as S}from"./big-image-2Ccd3iGk.js";import{useMDXComponents as c}from"./index-_VGcpBFS.js";import"./iframe-fKJQgA4O.js";import"../sb-preview/runtime.js";import"./_commonjsHelpers-4gQjN7DL.js";import"./index-jmm5gWkb.js";import"./index-ogXoivrg.js";import"./index-MI7UZ4bI.js";import"./index-PPLHz8o0.js";import"./animations.constants-cwQ5oA34.js";function I(){return v(({state:n})=>i("div",{style:{position:"absolute",bottom:16,right:16,zIndex:10,padding:"5px 12px",borderRadius:8,background:"rgba(10, 10, 18, 0.78)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.7)",fontSize:11,fontWeight:600,fontFamily:"system-ui, -apple-system, sans-serif",letterSpacing:"0.02em",userSelect:"none",pointerEvents:"none"},children:[Math.round(n.scale*100),"%"]}))}const a=n=>{const t=b(n);return e(s,{...t,fitOnInit:!0,minScale:.05,maxScale:8,centerZoomedOut:!0,children:o=>i(m,{children:[e(y,{...o,extraButtons:[{label:"Fit",onClick:()=>o.fitToView()},{label:"Cover",onClick:()=>o.fitToView({mode:"cover"})},{label:"1:1",onClick:()=>o.centerView(1)}]}),e(I,{}),e(T,{wrapperStyle:{...x,width:"100%",height:"100%"},children:e("img",{alt:"Aerial cityscape, fitted to the viewport on load",src:S,style:{display:"block"}})})]})})};try{a.displayName="Example",a.__docgenInfo={description:"A photo much larger than its viewport. `fitOnInit` shows the whole image on\nthe first paint (and again once the image has loaded and reports its size),\nwhile the buttons switch between the fit modes at runtime with `fitToView`.",displayName:"Example",props:{}}}catch{}const h=n=>{const t=Object.assign({div:"div"},c());return e(t.div,{style:{width:"100%",maxWidth:640,height:"min(420px, 52vh)",margin:"0 auto",boxSizing:"border-box",position:"relative"},children:e(a,{...n})})};function l(n){const t=Object.assign({h1:"h1",p:"p",strong:"strong",code:"code",pre:"pre",ul:"ul",li:"li",h2:"h2"},c(),n.components);return i(m,{children:[e(g,{title:"Basic/Fit Image",component:s,argTypes:d}),`
`,e(t.h1,{id:"fit-image",children:"Fit Image"}),`
`,i(t.p,{children:["Show a ",e(t.strong,{children:"large image fitted to its viewport"}),` on the first paint, without
measuring anything yourself. The image here is several times bigger than the
frame; `,e(t.code,{children:"fitOnInit"})," scales it down so the whole photo is visible and centred."]}),`
`,e(t.pre,{children:e(t.code,{className:"language-tsx",children:`<TransformWrapper fitOnInit minScale={0.05}>
  <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
    <img src={photo} alt="…" />
  </TransformComponent>
</TransformWrapper>
`})}),`
`,e(t.p,{children:"Two details matter:"}),`
`,i(t.ul,{children:[`
`,i(t.li,{children:[e(t.strong,{children:e(t.code,{children:"minScale"})})," — the default ",e(t.code,{children:"minScale"})," of ",e(t.code,{children:"1"}),` never shrinks content, so a
fit that has to zoom out needs a lower limit. Pick the smallest scale you
want to allow; the fit is clamped to `,e(t.code,{children:"minScale"}),"/",e(t.code,{children:"maxScale"}),` like every other
zoom.`]}),`
`,i(t.li,{children:[e(t.strong,{children:"Late-sized content"})," — an ",e(t.code,{children:"<img>"})," has no size until it loads. ",e(t.code,{children:"fitOnInit"}),`
waits for it and applies the layout again once the image reports its
dimensions, so there is no flash of a wrongly-scaled image.`]}),`
`]}),`
`,i(t.p,{children:[e(t.code,{children:"fitOnInit"})," accepts ",e(t.code,{children:"true"})," (same as ",e(t.code,{children:'"contain"'}),`: the whole image is visible) or
`,e(t.code,{children:'"cover"'}),` (the image fills the frame and the overflow is cropped).
`,e(t.code,{children:"resetTransform"})," returns to the fitted layout instead of ",e(t.code,{children:"initialScale"}),"."]}),`
`,i(t.h2,{id:"at-runtime-fittoview",children:["At runtime: ",e(t.code,{children:"fitToView"})]}),`
`,e(t.p,{children:"The extra buttons in the toolbar call the matching control:"}),`
`,e(t.pre,{children:e(t.code,{className:"language-ts",children:`const { fitToView, centerView } = useControls();

fitToView(); // contain (default)
fitToView({ mode: "cover" }); // fill the viewport
fitToView({ maxScale: 2, animationTime: 400 }); // never upscale past 2x
centerView(1); // original size (1:1), centred
`})}),`
`,i(t.p,{children:[e(t.code,{children:"fitToView"})," returns a promise that resolves when the animation has finished."]}),`
`,e(f,{children:e(u,{name:"Fit Image",children:o=>e(h,{...o})})}),`
`,e(t.h2,{id:"component-api",children:"Component API"}),`
`,e(w,{story:"Fit Image"})]})}function C(n={}){const{wrapper:t}=Object.assign({},c(),n.components);return t?e(t,{...n,children:e(l,{...n})}):l(n)}const p=n=>e(h,{...n});p.storyName="Fit Image";p.parameters={storySource:{source:"args => <Template {...args} />"}};const r={title:"Basic/Fit Image",component:s,argTypes:d,tags:["stories-mdx"],includeStories:["fitImage"]};r.parameters=r.parameters||{};r.parameters.docs={...r.parameters.docs||{},page:C};const L=["Template","fitImage"];export{h as Template,L as __namedExportsOrder,r as default,p as fitImage};
