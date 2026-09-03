import{M as g,C as u,b as f,A as v}from"./index-QEScgtQ2.js";import{n as x,T as c,C as k,a as w,b as h}from"./focus-chips-lgu7I7kL.js";import{j as n,a as r,F as m}from"./jsx-runtime-5BUNAZ9W.js";import{r as T}from"./index-4g5l5LRQ.js";import{v as C}from"./viewer.styles-W8oHtTnJ.js";import{useMDXComponents as d}from"./index-_VGcpBFS.js";import"./iframe-wzH_3sFU.js";import"../sb-preview/runtime.js";import"./_commonjsHelpers-4gQjN7DL.js";import"./index-jmm5gWkb.js";import"./index-ogXoivrg.js";import"./index-MI7UZ4bI.js";import"./index-PPLHz8o0.js";import"./animations.constants-cwQ5oA34.js";const S="/react-zoom-pan-pinch/assets/map-J8476w4v.jpg",z='Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',B=[["← ↑ → ↓","pan"],["+ / −","zoom"],["0","reset"]];function N({focused:o}){return r("div",{style:{position:"absolute",left:16,bottom:16,zIndex:10,display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:10,background:"rgba(10, 10, 18, 0.78)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:`1px solid ${o?"rgba(99, 102, 241, 0.9)":"rgba(255,255,255,0.1)"}`,color:"rgba(255,255,255,0.8)",fontSize:11,fontFamily:z,pointerEvents:"none",transition:"border-color 120ms ease"},children:[n("span",{style:{fontWeight:700,opacity:o?1:.6},children:o?"Keyboard active":"Click the map to focus"}),B.map(([e,t])=>r("span",{style:{display:"inline-flex",gap:5},children:[n("kbd",{style:{padding:"1px 6px",borderRadius:4,background:"rgba(255,255,255,0.12)",fontFamily:"inherit",fontSize:11},children:e}),n("span",{style:{opacity:.6},children:t})]},e))]})}const s=o=>{const e=x(o),[t,l]=T.useState(!1);return n(c,{...e,keyboard:{disabled:!1,panStep:80,zoomStep:.5},minScale:.5,maxScale:6,centerOnInit:!0,children:a=>r(m,{children:[n(k,{...a,extraButtons:[{label:"←",onClick:()=>a.panBy(80,0)},{label:"↑",onClick:()=>a.panBy(0,80)},{label:"↓",onClick:()=>a.panBy(0,-80)},{label:"→",onClick:()=>a.panBy(-80,0)}]}),n(N,{focused:t}),n(w,{wrapperStyle:{...C,width:"100%",height:"100%",outline:t?"2px solid rgba(99, 102, 241, 0.9)":"none",outlineOffset:-2},wrapperProps:{onFocus:()=>l(!0),onBlur:()=>l(!1),"aria-label":"Map viewer. Use arrow keys to pan, plus and minus to zoom, zero to reset."},children:n("img",{alt:"City map",src:S,style:{display:"block",width:1200}})})]})})};try{s.displayName="Example",s.__docgenInfo={description:"Opt-in keyboard navigation. The wrapper becomes focusable; while it (or\nanything inside it) has focus, arrows pan, +/- zoom and 0 resets. The\ntoolbar's direction buttons use the same `panBy` control the keys do.",displayName:"Example",props:{}}}catch{}const b=o=>{const e=Object.assign({div:"div"},d());return n(e.div,{style:{width:"100%",maxWidth:640,height:"min(420px, 52vh)",margin:"0 auto",boxSizing:"border-box",position:"relative"},children:n(s,{...o})})};function p(o){const e=Object.assign({h1:"h1",p:"p",strong:"strong",code:"code",pre:"pre",ul:"ul",li:"li",h2:"h2"},d(),o.components);return r(m,{children:[n(g,{title:"Basic/Keyboard Navigation",component:c,argTypes:h}),`
`,n(e.h1,{id:"keyboard-navigation",children:"Keyboard Navigation"}),`
`,r(e.p,{children:["Pan and zoom ",n(e.strong,{children:"without a pointer"}),`. Keyboard navigation is opt-in: enable it
with the `,n(e.code,{children:"keyboard"})," prop and the wrapper becomes focusable (",n(e.code,{children:"tabIndex={0}"}),`,
unless your `,n(e.code,{children:"wrapperProps"}),` set one). While the wrapper — or anything inside
it — has focus:`]}),`
`,r(e.p,{children:[`| Keys      | Action                                   |
| --------- | ---------------------------------------- |
| `,n(e.code,{children:"← ↑ → ↓"})," | pan by ",n(e.code,{children:"keyboard.panStep"}),` pixels (50)    |
| `,n(e.code,{children:"+"})," / ",n(e.code,{children:"="})," | zoom in by ",n(e.code,{children:"keyboard.zoomStep"}),` (0.25)    |
| `,n(e.code,{children:"-"})," / ",n(e.code,{children:"_"})," | zoom out by ",n(e.code,{children:"keyboard.zoomStep"}),`          |
| `,n(e.code,{children:"0"}),"       | reset the transform                      |"]}),`
`,n(e.pre,{children:n(e.code,{className:"language-tsx",children:`<TransformWrapper keyboard={{ disabled: false, panStep: 80, zoomStep: 0.5 }}>
  <TransformComponent>…</TransformComponent>
</TransformWrapper>
`})}),`
`,r(e.p,{children:["Try it: ",n(e.strong,{children:"click the map"}),`, then use the arrow keys. The hint in the corner
lights up while the viewer has focus.`]}),`
`,n(e.p,{children:"What is deliberately left alone:"}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[n(e.strong,{children:"Modifier combos"})," (",n(e.code,{children:"Cmd/Ctrl + 0"}),", ",n(e.code,{children:"Cmd/Ctrl + -"}),", ",n(e.code,{children:"Alt + …"}),`) so browser
shortcuts keep working.`]}),`
`,r(e.li,{children:[n(e.strong,{children:"Editable targets"})," — typing into an ",n(e.code,{children:"<input>"})," or a ",n(e.code,{children:"contenteditable"}),`
region inside the content never moves the canvas.`]}),`
`,r(e.li,{children:["Anything matching ",n(e.code,{children:"keyboard.excluded"})," (class or tag names)."]}),`
`]}),`
`,r(e.p,{children:["Arrow steps respect ",n(e.code,{children:"panning.lockAxisX"})," / ",n(e.code,{children:"lockAxisY"}),` and the pan bounds, and
animate with `,n(e.code,{children:"keyboard.animationTime"})," (100 ms by default)."]}),`
`,r(e.h2,{id:"direction-buttons-panby",children:["Direction buttons: ",n(e.code,{children:"panBy"})]}),`
`,r(e.p,{children:["The keys are built on the ",n(e.code,{children:"panBy(deltaX, deltaY, animationTime?, animationType?)"}),`
control, which is also what the toolbar's arrow buttons call. Positive `,n(e.code,{children:"x"}),`
moves the content right — the same convention as `,n(e.code,{children:"setTransform"}),":"]}),`
`,n(e.pre,{children:n(e.code,{className:"language-ts",children:`const { panBy } = useControls();
panBy(80, 0); // reveal content on the left
panBy(0, -80); // reveal content below
`})}),`
`,r(e.p,{children:[n(e.code,{children:"panBy"})," is clamped to the bounds when ",n(e.code,{children:"limitToBounds"}),` is on, fires the panning
callbacks, and returns a promise that resolves when the animation finishes.`]}),`
`,n(u,{children:n(f,{name:"Keyboard Navigation",children:t=>n(b,{...t})})}),`
`,n(e.h2,{id:"component-api",children:"Component API"}),`
`,n(v,{story:"Keyboard Navigation"})]})}function _(o={}){const{wrapper:e}=Object.assign({},d(),o.components);return e?n(e,{...o,children:n(p,{...o})}):p(o)}const y=o=>n(b,{...o});y.storyName="Keyboard Navigation";y.parameters={storySource:{source:"args => <Template {...args} />"}};const i={title:"Basic/Keyboard Navigation",component:c,argTypes:h,tags:["stories-mdx"],includeStories:["keyboardNavigation"]};i.parameters=i.parameters||{};i.parameters.docs={...i.parameters.docs||{},page:_};const U=["Template","keyboardNavigation"];export{b as Template,U as __namedExportsOrder,i as default,y as keyboardNavigation};
