try{
(()=>{var e=__REACT__,{Children:b,Component:u,Fragment:_,Profiler:y,PureComponent:k,StrictMode:v,Suspense:S,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:T,cloneElement:w,createContext:O,createElement:C,createFactory:E,createRef:M,forwardRef:z,isValidElement:A,lazy:L,memo:N,useCallback:I,useContext:P,useDebugValue:B,useEffect:H,useImperativeHandle:G,useLayoutEffect:K,useMemo:Y,useReducer:F,useRef:j,useState:D,version:V}=__REACT__;var q=__STORYBOOK_API__,{ActiveTabs:J,Consumer:Q,ManagerContext:Z,Provider:$,addons:t,combineParameters:ee,controlOrMetaKey:ae,controlOrMetaSymbol:re,eventMatchesShortcut:se,eventToShortcut:te,isMacLike:oe,isShortcutTaken:ne,keyToSymbol:ie,merge:he,mockChannel:le,optionOrAltSymbol:pe,shortcutMatchesShortcut:de,shortcutToHumanString:ce,types:o,useAddonState:me,useArgTypes:ge,useArgs:xe,useChannel:fe,useGlobalTypes:be,useGlobals:ue,useParameter:_e,useSharedState:ye,useStoryPrepared:ke,useStorybookApi:ve,useStorybookState:Se}=__STORYBOOK_API__;var Ee=__STORYBOOK_THEMING__,{CacheProvider:Me,ClassNames:ze,Global:Ae,ThemeProvider:Le,background:Ne,color:Ie,convert:Pe,create:Be,createCache:He,createGlobal:Ge,createReset:Ke,css:Ye,darken:Fe,ensure:je,ignoreSsrWarning:De,isPropValid:Ve,jsx:Ue,keyframes:We,lighten:Re,styled:Xe,themes:qe,typography:Je,useTheme:n,withTheme:Qe}=__STORYBOOK_THEMING__;var h="https://www.hype-stack.dev/?ref=react-zoom-pan-pinch&utm_source=react-zoom-pan-pinch&utm_medium=referral&utm_campaign=storybook-sidebar",l=`
.hs-ad {
  --hs: oklch(0.68 0.2 50);
  --hs-bg: #ffffff;
  --hs-ink: #0a0a0a;
  --hs-dim: #5e5e66;
  --hs-line: rgb(0 0 0 / 0.14);
  display: grid;
  margin-top: 12px;
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
.hs-ad-label svg { flex: none; width: 13px; height: 13px; fill: var(--hs); }
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
.hs-ad-go i { font-style: normal; transition: transform 0.2s; }
.hs-ad:hover .hs-ad-go i { transform: translateX(3px); }
@media (max-height: 760px) {
  .hs-ad-art { display: none; }
  .hs-ad { padding-top: 14px; }
}
`;function p(){let i=n();return e.createElement(e.Fragment,null,e.createElement("style",null,l),e.createElement("a",{className:"hs-ad","data-base":i.base,href:h,target:"_blank",rel:"noopener","aria-label":"Build your SaaS on Hype Stack"},e.createElement("span",{className:"hs-ad-art","aria-hidden":!0},e.createElement("img",{src:"./hype-stack-apps.jpg",alt:"",width:720,height:400})),e.createElement("span",{className:"hs-ad-label"},e.createElement("svg",{viewBox:"0 0 24 24","aria-hidden":!0},e.createElement("path",{d:"M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"})),"From Hype Stack"),e.createElement("strong",null,"Build your SaaS on ",e.createElement("b",null,"Hype Stack")),e.createElement("span",{className:"hs-ad-price"},e.createElement("b",null,"Free")," MIT template"),e.createElement("span",{className:"hs-ad-go"},"Explore the stack",e.createElement("i",{"aria-hidden":!0},"\u203A"))))}t.register("hype-stack/card",()=>{t.add("hype-stack/card/sidebar",{type:o.experimental_SIDEBAR_BOTTOM,render:()=>e.createElement(p,null)})});})();
}catch(e){ console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e); }
