try{
(()=>{var e=__REACT__,{Children:V,Component:Y,Fragment:J,Profiler:W,PureComponent:Z,StrictMode:X,Suspense:$,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:q,cloneElement:Q,createContext:R,createElement:ee,createFactory:te,createRef:re,forwardRef:se,isValidElement:ae,lazy:oe,memo:ne,useCallback:ie,useContext:le,useDebugValue:pe,useEffect:d,useImperativeHandle:de,useLayoutEffect:he,useMemo:C,useReducer:ce,useRef:ue,useState:h,version:me}=__REACT__;var Se=__STORYBOOK_API__,{ActiveTabs:ke,Consumer:ve,ManagerContext:ye,Provider:_e,addons:u,combineParameters:we,controlOrMetaKey:Pe,controlOrMetaSymbol:Te,eventMatchesShortcut:Oe,eventToShortcut:Ce,isMacLike:Fe,isShortcutTaken:je,keyToSymbol:Ae,merge:Ee,mockChannel:Ne,optionOrAltSymbol:Me,shortcutMatchesShortcut:Le,shortcutToHumanString:ze,types:f,useAddonState:Ie,useArgTypes:De,useArgs:Ue,useChannel:Be,useGlobalTypes:He,useGlobals:Ge,useParameter:Ke,useSharedState:Ve,useStoryPrepared:Ye,useStorybookApi:Je,useStorybookState:We}=__STORYBOOK_API__;var Qe=__STORYBOOK_THEMING__,{CacheProvider:Re,ClassNames:et,Global:tt,ThemeProvider:rt,background:st,color:at,convert:ot,create:nt,createCache:it,createGlobal:lt,createReset:pt,css:dt,darken:ht,ensure:ct,ignoreSsrWarning:ut,isPropValid:mt,jsx:gt,keyframes:ft,lighten:bt,styled:xt,themes:St,typography:kt,useTheme:b,withTheme:vt}=__STORYBOOK_THEMING__;var x="https://cdn.jsdelivr.net/gh/prc5/sponsors@main/feed/v1/sponsors.json",c="react-zoom-pan-pinch";var m=t=>{if(!t||typeof t!="object")return!1;let r=t;return r.version===1&&Array.isArray(r.partners)&&Array.isArray(r.sponsors)&&Array.isArray(r.pastSponsors)&&typeof r.links?.sponsor=="string"},S=(t,r)=>{try{let s=new URL(t);return Object.entries({ref:c,utm_source:c,utm_medium:"referral",utm_campaign:r}).forEach(([l,p])=>{s.searchParams.has(l)||s.searchParams.set(l,p)}),s.toString()}catch{return t}};var g={version:1,generatedAt:"2026-11-23T14:27:02.767Z",links:{sponsor:"https://github.com/sponsors/prc5",partner:"https://github.com/sponsors/prc5"},tiers:[{id:"platinum",name:"Platinum",monthlyDollars:1600},{id:"gold",name:"Gold",monthlyDollars:800},{id:"silver",name:"Silver",monthlyDollars:400},{id:"backer",name:"Backer",monthlyDollars:200},{id:"supporter",name:"Supporter",monthlyDollars:100},{id:"fan",name:"Fan",monthlyDollars:10},{id:"donor",name:"Donor",monthlyDollars:0}],partners:[{id:"hype-stack",name:"Hype Stack",tagline:"Ship your SaaS on a production-ready stack",url:"https://www.hype-stack.dev/",logo:"https://cdn.jsdelivr.net/gh/prc5/sponsors@main/assets/partners/hype-stack.png",tier:"house",accent:"#f97316",projects:"all"}],sponsors:[],pastSponsors:[{login:"microsoft",name:"Microsoft",kind:"organization",avatarUrl:"https://avatars.githubusercontent.com/u/6154722?v=4&s=160",url:"https://opensource.microsoft.com/",github:"https://github.com/microsoft",tier:"platinum"},{login:"kerns",name:"David Kerns",kind:"user",avatarUrl:"https://avatars.githubusercontent.com/u/20254?u=bd24334936920dbc553f8ad4e0cc5fc11a17ff13&v=4&s=160",url:"http://kerns.dk/",github:"https://github.com/kerns",tier:null},{login:"juanmoncada",name:"Juan",kind:"user",avatarUrl:"https://avatars.githubusercontent.com/u/3822114?u=95a4c7dabb81662b7b7fc82e0112daf4087b9b89&v=4&s=160",url:"https://github.com/juanmoncada",github:"https://github.com/juanmoncada",tier:null},{login:"okanji",name:"Oamar Kanji",kind:"user",avatarUrl:"https://avatars.githubusercontent.com/u/30703259?u=6e299112c49e532e32a9f1031fde3ae3820b6053&v=4&s=160",url:"https://github.com/okanji",github:"https://github.com/okanji",tier:null},{login:"piotrfonte",name:"Pio",kind:"user",avatarUrl:"https://avatars.githubusercontent.com/u/377206?u=570a615b736dce682f2961a940e5bf4e06503782&v=4&s=160",url:"https://piotrfonte.com/",github:"https://github.com/piotrfonte",tier:null},{login:"simjinseok",name:"\uC2EC\uC9C4\uC11D",kind:"user",avatarUrl:"https://avatars.githubusercontent.com/u/42757954?u=d9478303eefe4f1c44eabc9220e613e73fc9c6c9&v=4&s=160",url:"https://simjinseok.com/",github:"https://github.com/simjinseok",tier:null}],privateSponsors:{active:0,past:1}};if(!m(g))throw new Error("sponsors.snapshot.json is not a v1 sponsors feed");var k=g,v=null,j=()=>(v??=fetch(x,{cache:"no-cache"}).then(t=>t.ok?t.json():null).then(t=>m(t)?t:null).catch(()=>null),v),y=()=>{let[t,r]=h(k);return d(()=>{let s=!0;return j().then(a=>{s&&a&&a.generatedAt>k.generatedAt&&r(a)}),()=>{s=!1}},[]),t};var A="https://www.hype-stack.dev/?ref=react-zoom-pan-pinch&utm_source=react-zoom-pan-pinch&utm_medium=referral&utm_campaign=storybook-sidebar",E=`
.hs-ad {
  --hs: oklch(0.68 0.2 50);
  --hs-bg: #ffffff;
  --hs-ink: #0a0a0a;
  --hs-dim: #5e5e66;
  --hs-line: rgb(0 0 0 / 0.14);
  display: grid;
  padding: 8px 8px 14px;
  border: 1px solid var(--hs-line);
  border-radius: 18px;
  background: var(--hs-bg);
  box-shadow: 0 26px 60px -34px color-mix(in oklch, var(--hs) 75%, transparent);
  color: var(--hs-ink);
  line-height: 1.4;
  text-align: left;
  text-decoration: none;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.hs-ad[data-base="dark"] {
  --hs-bg: #0d0d10;
  --hs-ink: #ffffff;
  --hs-dim: #a3a3ad;
  --hs-line: rgb(255 255 255 / 0.14);
}
.hs-ad:hover {
  border-color: color-mix(in oklch, var(--hs) 60%, var(--hs-line));
  box-shadow: 0 30px 64px -30px color-mix(in oklch, var(--hs) 90%, transparent);
  transform: translateY(-2px);
}
.hs-ad > :not(.hs-ad-art) { margin-inline: 10px; }
.hs-ad-art {
  position: relative;
  display: block;
  aspect-ratio: 9 / 5;
  margin-bottom: 14px;
  overflow: hidden;
  border-radius: 11px;
  background: #0a0c13;
}
.hs-ad-art::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.1);
}
.hs-ad-art img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
.hs-ad:hover .hs-ad-art img { transform: scale(1.07); }
.hs-ad-art[data-logo] {
  display: grid;
  place-items: center;
  background: radial-gradient(120% 120% at 100% 0%, color-mix(in oklch, var(--hs) 35%, #0a0c13), #0a0c13 70%);
}
.hs-ad-art[data-logo] img { width: 34%; height: auto; aspect-ratio: 1; border-radius: 18%; object-fit: contain; }
.hs-ad-label {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--hs);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.hs-ad-label svg { flex: none; width: 13px; height: 13px; fill: var(--hs); stroke: none; }
.hs-ad strong {
  margin-top: 8px;
  color: var(--hs-ink);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
}
.hs-ad strong b { display: block; color: var(--hs); font-weight: inherit; }
.hs-ad-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 12px;
  color: var(--hs-dim);
  font-size: 13px;
}
.hs-ad-price b { color: var(--hs-ink); font-size: 22px; font-weight: 700; letter-spacing: -0.03em; }
.hs-ad-go {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 42px;
  margin-top: 10px;
  border-radius: 10px;
  background: linear-gradient(180deg, color-mix(in oklch, var(--hs) 88%, #fff), var(--hs));
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.28), 0 10px 22px -10px var(--hs);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  text-shadow: 0 1px 0 rgb(0 0 0 / 0.14);
  transition: filter 0.2s;
}
.hs-ad:hover .hs-ad-go { filter: brightness(1.07); }
.hs-ad-go svg {
  flex: none;
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.2s;
}
.hs-ad:hover .hs-ad-go svg { transform: translateX(3px); }
.hs-ad-box { position: relative; margin-top: 12px; }
.hs-ad-box .hs-ad { margin-top: 0; }
.hs-ad-close {
  position: absolute;
  top: -8px;
  right: -4px;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: #0a0a0a;
  box-shadow: 0 0 0 1px rgb(255 255 255 / 0.2);
  color: #fff;
  cursor: pointer;
}
.hs-ad-close svg { width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 2.6; stroke-linecap: round; }
/* Shrunk: the label, the headline and an orange arrow to go there. The cross turns the card into this. */
.hs-ad[data-small] {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 2px 10px;
  padding: 9px 9px 9px 4px;
  border-radius: 14px;
}
.hs-ad[data-small] .hs-ad-art,
.hs-ad[data-small] .hs-ad-price { display: none; }
.hs-ad[data-small] .hs-ad-label { font-size: 10px; letter-spacing: 0.06em; white-space: nowrap; }
.hs-ad[data-small] strong { grid-column: 1; margin-top: 0; font-size: 14px; }
.hs-ad[data-small] strong b { display: inline; }
.hs-ad[data-small] .hs-ad-go { grid-column: 2; grid-row: 1 / span 2; width: 40px; height: 40px; margin: 0; }
.hs-ad[data-small] .hs-ad-go span { display: none; }
.hs-ad[data-small] .hs-ad-go svg { width: 17px; height: 17px; }
@media (max-height: 760px) {
  .hs-ad:not([data-small]) .hs-ad-art { display: none; }
  .hs-ad:not([data-small]) { padding-top: 14px; }
}
`,_="react-zoom-pan-pinch:storybook:hype-card";function N(){try{return window.sessionStorage.getItem(_)!==null}catch{return!1}}function M(){let[t,r]=h(N);return d(()=>{if(t)try{window.sessionStorage.setItem(_,"1")}catch{}},[t]),[t,()=>r(!0)]}var w=()=>e.createElement("svg",{viewBox:"0 0 24 24","aria-hidden":!0},e.createElement("path",{d:"M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"})),P=()=>e.createElement("svg",{viewBox:"0 0 24 24","aria-hidden":!0},e.createElement("path",{d:"M5 12h14M13 6l6 6-6 6"}));function T({href:t,name:r,accent:s,children:a}){let l=b(),[p,O]=M();return e.createElement("div",{className:"hs-ad-box"},e.createElement("style",null,E),e.createElement("a",{className:"hs-ad","data-base":l.base,"data-small":p?"":void 0,href:t,target:"_blank",rel:"noopener","aria-label":r,style:s?{"--hs":s}:void 0},a),p?null:e.createElement("button",{type:"button",className:"hs-ad-close",onClick:O,"aria-label":`Shrink the ${r} card`},e.createElement("svg",{viewBox:"0 0 24 24","aria-hidden":!0},e.createElement("path",{d:"M6 6l12 12M18 6 6 18"}))))}function L(){return e.createElement(T,{href:A,name:"Build your SaaS on Hype Stack"},e.createElement("span",{className:"hs-ad-art","aria-hidden":!0},e.createElement("img",{src:"./hype-stack-apps.jpg",alt:"",width:720,height:400})),e.createElement("span",{className:"hs-ad-label"},e.createElement(w,null),"From Hype Stack"),e.createElement("strong",null,"Build your SaaS on ",e.createElement("b",null,"Hype Stack")),e.createElement("span",{className:"hs-ad-price"},e.createElement("b",null,"Free")," MIT template"),e.createElement("span",{className:"hs-ad-go"},e.createElement("span",null,"Explore the stack"),e.createElement(P,null)))}function z({partner:t}){return e.createElement(T,{href:S(t.url,"storybook-sidebar"),name:t.name,accent:t.accent},e.createElement("span",{className:"hs-ad-art","data-logo":!0,"aria-hidden":!0},e.createElement("img",{src:t.logo,alt:"",width:96,height:96})),e.createElement("span",{className:"hs-ad-label"},e.createElement(w,null),"Partner"),e.createElement("strong",null,e.createElement("b",null,t.name)),e.createElement("span",{className:"hs-ad-price"},t.tagline),e.createElement("span",{className:"hs-ad-go"},e.createElement("span",null,"Visit ",t.name),e.createElement(P,null)))}function I(){let r=y().partners.find(s=>s.tier==="platinum"&&(s.projects==="all"||s.projects.includes(c)));return r?e.createElement(z,{partner:r}):e.createElement(L,null)}u.register("hype-stack/card",()=>{u.add("hype-stack/card/sidebar",{type:f.experimental_SIDEBAR_BOTTOM,render:()=>e.createElement(I,null)})});})();
}catch(e){ console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e); }
