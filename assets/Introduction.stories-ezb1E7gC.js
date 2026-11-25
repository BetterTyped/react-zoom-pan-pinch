import{M as A}from"./index-HjzZOkaY.js";import{a as e,j as t,F as T}from"./jsx-runtime-_ye5kA25.js";import{r as u,R as I}from"./index-4g5l5LRQ.js";import{useMDXComponents as z}from"./index-_VGcpBFS.js";import"./iframe-hBcVGuNS.js";import"../sb-preview/runtime.js";import"./_commonjsHelpers-4gQjN7DL.js";import"./index-jmm5gWkb.js";import"./index-ogXoivrg.js";import"./index-MI7UZ4bI.js";import"./index-PPLHz8o0.js";const M="https://cdn.jsdelivr.net/gh/prc5/sponsors@main/feed/v1/sponsors.json",g="react-zoom-pan-pinch",x="React Zoom Pan Pinch",O=["microsoft"],h=r=>!O.includes(r.toLowerCase()),N=r=>({...r,partners:r.partners.filter(n=>h(n.id)),sponsors:r.sponsors.filter(n=>h(n.login)),pastSponsors:r.pastSponsors.filter(n=>h(n.login))}),P=r=>{var o;if(!r||typeof r!="object")return!1;const n=r;return n.version===1&&Array.isArray(n.partners)&&Array.isArray(n.sponsors)&&Array.isArray(n.pastSponsors)&&typeof((o=n.links)==null?void 0:o.sponsor)=="string"},j=(r,n)=>{try{const o=new URL(r);return Object.entries({ref:g,utm_source:g,utm_medium:"referral",utm_campaign:n}).forEach(([i,a])=>{o.searchParams.has(i)||o.searchParams.set(i,a)}),o.toString()}catch{return r}},v=2,E=r=>{const n=r.partners.filter(a=>a.projects==="all"||a.projects.includes(g)),o=n.filter(a=>a.tier==="platinum"),c=n.filter(a=>a.tier==="house"),i=r.sponsors.length===0;return{featured:[...o,...c].slice(0,v),tiles:n.filter(a=>a.tier==="gold"||a.tier==="silver"),openSlot:o.length<v,backers:i?r.pastSponsors:r.sponsors,backersArePast:i,privateCount:i?r.privateSponsors.past:r.privateSponsors.active}},D=1,F="2026-11-23T15:47:04.425Z",L={sponsor:"https://github.com/sponsors/prc5",partner:"https://github.com/sponsors/prc5"},q=[{id:"platinum",name:"Platinum",monthlyDollars:1600},{id:"gold",name:"Gold",monthlyDollars:800},{id:"silver",name:"Silver",monthlyDollars:400},{id:"backer",name:"Backer",monthlyDollars:200},{id:"supporter",name:"Supporter",monthlyDollars:100},{id:"fan",name:"Fan",monthlyDollars:10},{id:"donor",name:"Donor",monthlyDollars:0}],W=[{id:"microsoft",name:"Microsoft",tagline:"Open source at Microsoft",url:"https://opensource.microsoft.com/",logo:"https://cdn.jsdelivr.net/gh/prc5/sponsors@main/assets/partners/microsoft.svg",tier:"platinum",accent:"#00a4ef",projects:"all"},{id:"hype-stack",name:"Hype Stack",tagline:"Ship your SaaS on a production-ready stack",url:"https://www.hype-stack.dev/",logo:"https://cdn.jsdelivr.net/gh/prc5/sponsors@main/assets/partners/hype-stack.png",tier:"house",accent:"#f97316",projects:"all"}],B=[],U=[{login:"kerns",name:"David Kerns",kind:"user",avatarUrl:"https://avatars.githubusercontent.com/u/20254?u=bd24334936920dbc553f8ad4e0cc5fc11a17ff13&v=4&s=160",url:"http://kerns.dk/",github:"https://github.com/kerns",tier:null},{login:"juanmoncada",name:"Juan",kind:"user",avatarUrl:"https://avatars.githubusercontent.com/u/3822114?u=95a4c7dabb81662b7b7fc82e0112daf4087b9b89&v=4&s=160",url:"https://github.com/juanmoncada",github:"https://github.com/juanmoncada",tier:null},{login:"okanji",name:"Oamar Kanji",kind:"user",avatarUrl:"https://avatars.githubusercontent.com/u/30703259?u=6e299112c49e532e32a9f1031fde3ae3820b6053&v=4&s=160",url:"https://github.com/okanji",github:"https://github.com/okanji",tier:null},{login:"piotrfonte",name:"Pio",kind:"user",avatarUrl:"https://avatars.githubusercontent.com/u/377206?u=570a615b736dce682f2961a940e5bf4e06503782&v=4&s=160",url:"https://piotrfonte.com/",github:"https://github.com/piotrfonte",tier:null},{login:"simjinseok",name:"심진석",kind:"user",avatarUrl:"https://avatars.githubusercontent.com/u/42757954?u=d9478303eefe4f1c44eabc9220e613e73fc9c6c9&v=4&s=160",url:"https://simjinseok.com/",github:"https://github.com/simjinseok",tier:null}],H={active:0,past:1},C={version:D,generatedAt:F,links:L,tiers:q,partners:W,sponsors:B,pastSponsors:U,privateSponsors:H};if(!P(C))throw new Error("sponsors.snapshot.json is not a v1 sponsors feed");const k=N(C);let _=null;const Z=()=>(_??(_=fetch(M,{cache:"no-cache"}).then(r=>r.ok?r.json():null).then(r=>P(r)?r:null).catch(()=>null)),_),V=()=>{const[r,n]=u.useState(k);return u.useEffect(()=>{let o=!0;return Z().then(c=>{o&&c&&c.generatedAt>k.generatedAt&&n(N(c))}),()=>{o=!1}},[]),r},K=()=>{const r=V();return u.useMemo(()=>({feed:r,...E(r)}),[r])},X=()=>e("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:e("path",{d:"M7 17 17 7M8 7h9v9"})}),$=()=>e("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:e("path",{d:"M12 5v14M5 12h14"})}),m=({partner:r,size:n,className:o})=>{const[c,i]=I.useState(!1);return c?e("span",{className:"bt-sp-initial","aria-hidden":"true",children:r.name.charAt(0)}):e("img",{src:r.logo,alt:"",width:n,height:n,loading:"lazy",className:o,onError:()=>i(!0)})},J=4,R=r=>r.accent?{"--bt-sp-accent":r.accent}:{},Y=({partner:r})=>t("a",{className:"bt-sp-card",href:j(r.url,"docs-rail"),target:"_blank",rel:"noopener noreferrer",style:R(r),"data-tier":r.tier,children:[e("span",{className:"bt-sp-logo",children:e(m,{partner:r,size:40})}),t("span",{className:"bt-sp-copy",children:[e("strong",{children:r.name}),e("span",{children:r.tagline})]}),e("span",{className:"bt-sp-go",children:e(X,{})})]}),G=({partner:r})=>t("a",{className:"bt-sp-tile",href:j(r.url,"docs-rail"),target:"_blank",rel:"noopener noreferrer",title:`${r.name} - ${r.tagline}`,style:R(r),children:[e(m,{partner:r,size:20}),e("span",{children:r.name})]}),Q=({href:r})=>t("a",{className:"bt-sp-slot",href:r,target:"_blank",rel:"noopener noreferrer",children:[e("span",{className:"bt-sp-slot-plus",children:e($,{})}),t("span",{className:"bt-sp-copy",children:[e("strong",{children:"Your logo here"}),t("span",{children:["Shown on every ",x," docs page"]})]})]}),S=r=>r.kind==="organization"&&(r.tier==="platinum"||r.tier==="gold"),f=({backers:r,privateCount:n,max:o=8})=>{const c=r.filter(S),i=r.filter(s=>!S(s)),a=i.slice(0,o),l=i.length-a.length+n;return t("div",{className:"bt-sp-backers",children:[c.map(s=>t("a",{className:"bt-sp-named",href:s.url,target:"_blank",rel:"noopener noreferrer",title:s.name,children:[e("img",{src:s.avatarUrl,alt:"",width:22,height:22,loading:"lazy"}),e("span",{children:s.name})]},s.login)),(a.length>0||l>0)&&t("div",{className:"bt-sp-faces",children:[a.map(s=>e("a",{href:s.url,target:"_blank",rel:"noopener noreferrer",title:s.name,"aria-label":s.name,children:e("img",{src:s.avatarUrl,alt:"",width:28,height:28,loading:"lazy"})},s.login)),l>0&&t("span",{className:"bt-sp-more",title:`${l} more, some of them private`,children:["+",l]})]})]})},b=({variant:r="rail",theme:n})=>{const{feed:o,featured:c,tiles:i,openSlot:a,backers:l,backersArePast:s,privateCount:y}=K();return t("section",{className:"bt-sp-rail","data-variant":r,"data-bt-sp-theme":n,"aria-label":"Partners and sponsors",children:[t("div",{className:"bt-sp-head",children:[e("span",{children:"Partners"}),e("a",{href:o.links.partner,target:"_blank",rel:"noopener noreferrer",children:"Become one"})]}),t("div",{className:"bt-sp-stack",children:[c.map(p=>e(Y,{partner:p},p.id)),i.length>0&&e("div",{className:"bt-sp-tiles",children:i.slice(0,r==="rail"?J:void 0).map(p=>e(G,{partner:p},p.id))}),a&&e(Q,{href:o.links.partner})]}),(l.length>0||y>0)&&t(T,{children:[t("div",{className:"bt-sp-head",children:[e("span",{children:s?"Past sponsors":"Sponsors"}),e("a",{href:o.links.sponsor,target:"_blank",rel:"noopener noreferrer",children:"Sponsor"})]}),e(f,{backers:l,privateCount:y,max:6})]})]})};try{m.displayName="PartnerLogo",m.__docgenInfo={description:"The partner's logo, or their initial when the image does not load.",displayName:"PartnerLogo",props:{partner:{defaultValue:null,description:"",name:"partner",required:!0,type:{name:"FeedPartner"}},size:{defaultValue:null,description:"",name:"size",required:!0,type:{name:"number"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}try{f.displayName="Backers",f.__docgenInfo={description:"",displayName:"Backers",props:{backers:{defaultValue:null,description:"",name:"backers",required:!0,type:{name:"FeedSponsor[]"}},privateCount:{defaultValue:null,description:"",name:"privateCount",required:!0,type:{name:"number"}},max:{defaultValue:{value:"8"},description:"",name:"max",required:!1,type:{name:"number"}}}}}catch{}try{b.displayName="SponsorRail",b.__docgenInfo={description:"",displayName:"SponsorRail",props:{variant:{defaultValue:{value:"rail"},description:"`rail` stacks everything for a narrow column, `wide` lays the partners out side by side.",name:"variant",required:!1,type:{name:"enum",value:[{value:'"rail"'},{value:'"wide"'}]}},theme:{defaultValue:null,description:"Forces a colour scheme where the page does not set `data-theme` on `html`.",name:"theme",required:!1,type:{name:"enum",value:[{value:'"light"'},{value:'"dark"'}]}}}}}catch{}function w(r){const n=Object.assign({h1:"h1",blockquote:"blockquote",p:"p",h2:"h2",ul:"ul",li:"li",strong:"strong",code:"code",pre:"pre",a:"a"},z(),r.components);return t(T,{children:[e(A,{title:"Docs/Introduction"}),`
`,e(n.h1,{id:"react-zoom-pan-pinch",children:"React Zoom Pan Pinch"}),`
`,t("p",{children:[e("a",{href:"https://bettertyped.com/",children:e("img",{src:"https://custom-icon-badges.demolab.com/static/v1?label=&message=BetterTyped&color=333&logo=BT"})}),e("a",{href:"https://www.npmjs.com/package/react-zoom-pan-pinch",children:e("img",{src:"https://custom-icon-badges.demolab.com/npm/v/react-zoom-pan-pinch.svg?logo=npm&color=e22121"})}),e("a",{href:"https://github.com/prc5/react-zoom-pan-pinch",children:e("img",{src:"https://custom-icon-badges.demolab.com/github/stars/prc5/react-zoom-pan-pinch?logo=star"})}),e("a",{href:"https://github.com/prc5/react-zoom-pan-pinch/blob/main/License.md",children:e("img",{src:"https://custom-icon-badges.demolab.com/github/license/prc5/react-zoom-pan-pinch?logo=law&color=yellow"})}),e("a",{href:"https://www.npmjs.com/package/react-zoom-pan-pinch",children:e("img",{src:"https://custom-icon-badges.demolab.com/npm/dm/react-zoom-pan-pinch?logoColor=fff&logo=trending-up"})}),e("a",{href:"https://www.npmjs.com/package/react-zoom-pan-pinch",children:e("img",{src:"https://custom-icon-badges.demolab.com/bundlephobia/minzip/react-zoom-pan-pinch?color=E10098&logo=package"})}),e("a",{href:"https://github.com/prc5/react-zoom-pan-pinch",children:e("img",{src:"https://custom-icon-badges.demolab.com/badge/typescript-%23007ACC.svg?logo=typescript&logoColor=white"})})]}),`
`,t(n.blockquote,{children:[`
`,e(n.p,{children:`Super fast and light React library for zooming, panning, and pinching HTML
elements with ease.`}),`
`]}),`
`,e(n.h2,{id:"key-features",children:"Key Features"}),`
`,t(n.ul,{children:[`
`,t(n.li,{children:[e(n.strong,{children:"Fast and lightweight"})," — no external dependencies"]}),`
`,t(n.li,{children:[e(n.strong,{children:"Touch, trackpad, and mouse"})," — full gesture support across devices"]}),`
`,t(n.li,{children:[e(n.strong,{children:"Render props and hooks"})," — flexible API for any component architecture"]}),`
`,t(n.li,{children:[e(n.strong,{children:"Highly customizable"})," — animations, bounds, velocity, padding, and more"]}),`
`,t(n.li,{children:[e(n.strong,{children:"Advanced components"})," — ",e(n.code,{children:"KeepScale"}),", ",e(n.code,{children:"MiniMap"}),", and programmatic controls"]}),`
`]}),`
`,e(n.h2,{id:"installation",children:"Installation"}),`
`,e(n.pre,{children:e(n.code,{className:"language-bash",children:`npm install react-zoom-pan-pinch
`})}),`
`,e(n.p,{children:"or"}),`
`,e(n.pre,{children:e(n.code,{className:"language-bash",children:`yarn add react-zoom-pan-pinch
`})}),`
`,e(n.h2,{id:"quick-start",children:"Quick Start"}),`
`,t(n.p,{children:["The simplest setup — wrap any content with ",e(n.code,{children:"TransformWrapper"}),` and
`,e(n.code,{children:"TransformComponent"}),":"]}),`
`,e(n.pre,{children:e(n.code,{className:"language-tsx",children:`import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const App = () => (
  <TransformWrapper>
    <TransformComponent>
      <img src="image.jpg" alt="Zoomable" />
    </TransformComponent>
  </TransformWrapper>
);
`})}),`
`,e(n.h2,{id:"with-controls-render-props",children:"With Controls (Render Props)"}),`
`,e(n.p,{children:"Access zoom/pan handlers through render props:"}),`
`,e(n.pre,{children:e(n.code,{className:"language-tsx",children:`import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const App = () => (
  <TransformWrapper initialScale={1} initialPositionX={200} initialPositionY={100}>
    {({ zoomIn, zoomOut, resetTransform }) => (
      <>
        <div className="tools">
          <button onClick={() => zoomIn()}>+</button>
          <button onClick={() => zoomOut()}>-</button>
          <button onClick={() => resetTransform()}>x</button>
        </div>
        <TransformComponent>
          <img src="image.jpg" alt="Zoomable" />
        </TransformComponent>
      </>
    )}
  </TransformWrapper>
);
`})}),`
`,e(n.h2,{id:"with-ref-and-zoomtoelement",children:"With Ref and zoomToElement"}),`
`,e(n.p,{children:"Use a ref for imperative access outside of render props:"}),`
`,e(n.pre,{children:e(n.code,{className:"language-tsx",children:`import { useRef } from "react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

const App = () => {
  const ref = useRef<ReactZoomPanPinchRef | null>(null);

  const focusImage = () => {
    ref.current?.zoomToElement("imgExample");
  };

  return (
    <TransformWrapper ref={ref}>
      {({ zoomIn, zoomOut, resetTransform }) => (
        <>
          <button onClick={() => zoomIn()}>+</button>
          <button onClick={() => zoomOut()}>-</button>
          <button onClick={() => resetTransform()}>x</button>
          <TransformComponent>
            <img src="image.jpg" alt="Zoomable" id="imgExample" />
            <div onClick={focusImage}>Focus image</div>
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};
`})}),`
`,e(n.h2,{id:"more-from-bettertyped",children:"More from BetterTyped"}),`
`,e(n.p,{children:"Do you like this library? Here is what else we build and maintain:"}),`
`,t(n.ul,{children:[`
`,t(n.li,{children:[e(n.a,{href:"https://www.hype-stack.dev/?utm_medium=referral&utm_source=react-zoom-pan-pinch&utm_campaign=storybook",target:"_blank",rel:"nofollow noopener noreferrer",children:"Hype Stack"}),` — a full-stack TypeScript template with
installable feature packs, so you can ship a SaaS in days instead of months.`]}),`
`,t(n.li,{children:[e(n.a,{href:"https://hyperfetch.bettertyped.com",target:"_blank",rel:"nofollow noopener noreferrer",children:"HyperFetch"}),` — type-safe data fetching
and realtime for any framework.`]}),`
`,t(n.li,{children:[e(n.a,{href:"https://bettertyped.com",target:"_blank",rel:"nofollow noopener noreferrer",children:"BetterTyped"}),` — the open source collective behind
these projects.`]}),`
`]}),`
`,e(n.h2,{id:"partners-and-sponsors",children:"Partners and sponsors"}),`
`,e(n.p,{children:`React Zoom Pan Pinch is MIT licensed and maintained in the open. These teams and
people keep it going.`}),`
`,e(b,{variant:"wide",theme:"light"}),`
`,e(n.h2,{id:"license",children:"License"}),`
`,t(n.p,{children:["MIT © ",e(n.a,{href:"https://github.com/prc5",target:"_blank",rel:"nofollow noopener noreferrer",children:"prc5"})]})]})}function ee(r={}){const{wrapper:n}=Object.assign({},z(),r.components);return n?e(n,{...r,children:e(w,{...r})}):w(r)}const ne=()=>{throw new Error("Docs-only story")};ne.parameters={docsOnly:!0};const d={title:"Docs/Introduction",tags:["stories-mdx"],includeStories:["__page"]};d.parameters=d.parameters||{};d.parameters.docs={...d.parameters.docs||{},page:ee};const he=["__page"];export{he as __namedExportsOrder,ne as __page,d as default};
