import{M as b,C,b as _}from"./index-XEjfwhug.js";import{n as z,T as m,a as M,b as w}from"./focus-chips-q9HUVyNB.js";import{j as o,a as e,F as R}from"./jsx-runtime-_ye5kA25.js";import{r as u}from"./index-4g5l5LRQ.js";import{v as Z}from"./viewer.styles-W8oHtTnJ.js";import{e as N}from"./map-KmvjPZvL.js";import{useMDXComponents as p}from"./index-_VGcpBFS.js";import"./iframe-yFX3J1QF.js";import"../sb-preview/runtime.js";import"./_commonjsHelpers-4gQjN7DL.js";import"./index-jmm5gWkb.js";import"./index-ogXoivrg.js";import"./index-MI7UZ4bI.js";import"./index-PPLHz8o0.js";import"./animations.constants-I8GQzgvH.js";const j='Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',f=.5,g=6,c=r=>{const n=z(r),a=u.useRef(null),[d,T]=u.useState(1),x=s=>{const t=a.current,h=t==null?void 0:t.instance.wrapperComponent;if(!t||!h)return;const i=h.getBoundingClientRect();t.zoomToPoint(s,i.left+i.width/2,i.top+i.height/2,0)};return o("div",{style:{display:"flex",flexDirection:"column",gap:12},children:[o("div",{style:{display:"flex",alignItems:"center",gap:12,color:"#64748b",fontFamily:j,fontSize:12,fontWeight:600},children:[e("span",{"aria-hidden":!0,children:"Zoom"}),e("input",{"aria-label":"Zoom",type:"range",min:f,max:g,step:.01,value:d,onChange:s=>x(Number(s.target.value)),style:{flex:1}}),o("output",{style:{width:48,textAlign:"right"},children:[Math.round(d*100),"%"]})]}),e(m,{...n,ref:a,minScale:f,maxScale:g,onTransform:(s,t)=>T(t.scale),children:e(M,{wrapperStyle:{...Z,width:"100%",height:420},children:e("img",{alt:"City map",src:N,style:{display:"block",width:1200}})})})]})};try{c.displayName="Example",c.__docgenInfo={description:`Two-way sync between the viewer and a slider kept in React state (#366).
The library owns the transform; React only mirrors it:

- viewer → slider: \`onTransform\` reports every change (wheel, pinch,
  double click, buttons) and the slider value follows.
- slider → viewer: \`zoomToPoint\` zooms around the middle of the viewport,
  so the slider zooms where you are looking instead of jumping to a corner.

Nothing re-renders the content per frame, and gestures never fight a
controlled prop.`,displayName:"Example",props:{}}}catch{}const S=r=>{const n=Object.assign({div:"div"},p());return e(n.div,{style:{width:"100%",maxWidth:640,margin:"0 auto"},children:e(c,{...r})})};function y(r){const n=Object.assign({h1:"h1",p:"p",pre:"pre",code:"code",ul:"ul",li:"li",strong:"strong"},p(),r.components);return o(R,{children:[e(b,{title:"Basic/Zoom Slider",component:m,argTypes:w}),`
`,e(n.h1,{id:"zoom-slider",children:"Zoom Slider"}),`
`,e(n.p,{children:`Sync the zoom with your own UI — a slider, a percentage field, a value in a
store. The library keeps the transform; your state only mirrors it, in both
directions:`}),`
`,e(n.pre,{children:e(n.code,{className:"language-tsx",children:`const ref = useRef<ReactZoomPanPinchRef>(null);
const [scale, setScale] = useState(1);

<input
  type="range"
  min={0.5}
  max={6}
  step={0.01}
  value={scale}
  onChange={(event) => {
    const rect = ref.current!.instance.wrapperComponent!.getBoundingClientRect();
    // Zoom around the middle of the viewport, without animation.
    ref.current!.zoomToPoint(
      Number(event.target.value),
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      0,
    );
  }}
/>

<TransformWrapper
  ref={ref}
  minScale={0.5}
  maxScale={6}
  onTransform={(_, state) => setScale(state.scale)}
>
  <TransformComponent>…</TransformComponent>
</TransformWrapper>;
`})}),`
`,o(n.ul,{children:[`
`,o(n.li,{children:[e(n.strong,{children:"Viewer → your state:"})," ",e(n.code,{children:"onTransform"}),` fires for every change — wheel,
pinch, double click, buttons — so the slider follows gestures.`]}),`
`,o(n.li,{children:[e(n.strong,{children:"Your state → viewer:"})," call a control (",e(n.code,{children:"zoomToPoint"}),", ",e(n.code,{children:"setTransform"}),`,
`,e(n.code,{children:"centerView"}),`) instead of passing the value back as a prop. Gestures run at
60 fps without re-rendering your tree, and nothing fights a controlled prop
mid-animation.`]}),`
`]}),`
`,e(C,{children:e(_,{name:"Zoom Slider",children:a=>e(S,{...a})})})]})}function k(r={}){const{wrapper:n}=Object.assign({},p(),r.components);return n?e(n,{...r,children:e(y,{...r})}):y(r)}const v=r=>e(S,{...r});v.storyName="Zoom Slider";v.parameters={storySource:{source:"args => <Template {...args} />"}};const l={title:"Basic/Zoom Slider",component:m,argTypes:w,tags:["stories-mdx"],includeStories:["zoomSlider"]};l.parameters=l.parameters||{};l.parameters.docs={...l.parameters.docs||{},page:k};const q=["Template","zoomSlider"];export{S as Template,q as __namedExportsOrder,l as default,v as zoomSlider};
