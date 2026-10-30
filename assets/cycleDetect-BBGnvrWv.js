import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";import{a,i as o,n as s,r as c,t as l}from"./cycleLayout-Bz44Tgir.js";var u=`cyd-styles`,d=42,f=26,p=1150,m=`
.cyd { --cyd-slow: #2f6f4f; --cyd-fast: #b4682c; }
html.theme-dark .cyd { --cyd-slow: #7fc3a4; --cyd-fast: #e0a06a; }
.cyd__svg { min-width: 520px; }

/* 距离弧：快指针沿环前进方向到慢指针的那段 */
.cyd-arc { transition: opacity 0.3s ease; }
.cyd-arc.is-off { opacity: 0; }
.cyd-arc__line {
  fill: none;
  stroke: var(--cyd-fast);
  stroke-width: 2.2;
  stroke-dasharray: 7 4;
  stroke-linecap: round;
}
.cyd-arc__head { fill: var(--cyd-fast); }
.cyd-arc__tag-bg { fill: var(--surface-muted, #ecefe8); }
.cyd-arc__tag {
  fill: var(--cyd-fast);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .cyd-arc { transition: none; }
}
`;function h(){if(n(),c(),document.getElementById(u))return;let e=document.createElement(`style`);e.id=u,e.textContent=m,document.head.appendChild(e)}function g(e,t,n){let i=r(`g`,{class:`cyc-chip cyc-chip--${t}`});i.appendChild(r(`rect`,{class:`cyc-chip__box`,x:-26/2,y:-20/2,width:f,height:20}));let a=r(`text`,{class:`cyc-chip__text`,x:0,y:0});return a.textContent=n,i.appendChild(a),e.appendChild(i),i}function _(n,c={}){if(!n||n.dataset.cydMounted===`1`)return{destroy(){}};n.dataset.cydMounted=`1`,h();let f=a(c),m=f[0].cycle,_=Array.isArray(c.values)&&c.values.length?c.values:[1,2,3,4,5,6,7,8,9,10,11,12,13],v=m?m.start:null,y=c.autoplay!==!1,b=document.createElement(`div`);b.className=`viz cyd`;let x=document.createElement(`div`);x.className=`viz__stage`,b.appendChild(x);let S=r(`svg`,{class:`viz__svg cyd__svg`,viewBox:`0 0 700 400`,role:`img`,"aria-label":`Floyd 判圈（龟兔赛跑）推演动画`});x.appendChild(S);let C=l(S,{values:_,cycleStart:v});S.setAttribute(`viewBox`,`0 0 ${C.width} ${C.height}`),S.setAttribute(`width`,C.width),S.setAttribute(`height`,C.height);let w=r(`g`,{class:`cyd-arc is-off`}),T=r(`path`,{class:`cyd-arc__line`}),E=r(`path`,{class:`cyd-arc__head`}),D=r(`rect`,{class:`cyd-arc__tag-bg`,x:-30,y:-9,width:60,height:18,rx:6}),O=r(`text`,{class:`cyd-arc__tag`,x:0,y:0}),k=r(`g`,{class:`cyd-arc__tag-group`});k.append(D,O),w.append(T,E,k),S.appendChild(w);let A=g(S,`slow`,`慢`),j=g(S,`fast`,`快`);function M(e,t){return s(C.at(e),C,t)}let N=(e,t)=>{if(!t){e.style.opacity=`0`;return}e.style.opacity=`1`,e.setAttribute(`transform`,`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)})`)},P=document.createElement(`p`);P.className=`viz__desc`,P.setAttribute(`aria-live`,`polite`),b.appendChild(P);let F=i();b.appendChild(F.root),n.textContent=``,n.appendChild(b);let I=null;function L(t,n){let r=C.b,i=n.slow!==null&&n.slow===n.fast;C.nodes.forEach(e=>{let t=e.index===n.slow,r=e.index===n.fast;e.g.classList.toggle(`is-slow`,t&&!r),e.g.classList.toggle(`is-fast`,r&&!t),e.g.classList.toggle(`is-both`,t&&r)}),N(A,n.slow===null?null:M(n.slow,i?-1:0)),N(j,n.fast===null?null:M(n.fast,+!!i));let a=n.fast===null?-1:C.ringKOf(n.fast),s=n.slow===null?-1:C.ringKOf(n.slow),c=r>0&&a>=0&&s>=0&&n.gap!==null&&n.gap>0;if(w.classList.toggle(`is-off`,!c),c){let e=C.radius-d,t=(s-a+r)%r,i=o(a,r),c=o(a+t,r),l=c-i,u=t=>{let n=t*Math.PI/180;return{x:C.ringCenter.x+e*Math.cos(n),y:C.ringCenter.y+e*Math.sin(n)}},f=u(i),p=u(c),m=+(l>180);T.setAttribute(`d`,`M ${f.x.toFixed(1)} ${f.y.toFixed(1)} A ${e} ${e} 0 ${m} 1 ${p.x.toFixed(1)} ${p.y.toFixed(1)}`);let h=c*Math.PI/180,g=-Math.sin(h),_=Math.cos(h),v=-_,y=g;E.setAttribute(`d`,`M ${p.x} ${p.y} L ${p.x-g*9+v*5} ${p.y-_*9+y*5} L ${p.x-g*9-v*5} ${p.y-_*9-y*5} Z`);let b=(i+l/2)*Math.PI/180,x={x:C.ringCenter.x+e*Math.cos(b),y:C.ringCenter.y+e*Math.sin(b)};k.setAttribute(`transform`,`translate(${x.x.toFixed(1)} ${x.y.toFixed(1)})`),O.textContent=`${n.gap} 格`}e(P,n.desc)}let R=t({steps:f,controls:F,intervalMs:p,onRender:L});R.jumpTo(Math.trunc(c.initialStep)||0);let z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return y&&!z&&typeof IntersectionObserver==`function`&&(I=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){I.disconnect(),I=null,R.play();return}},{threshold:.35}),I.observe(b)),{destroy(){I&&=(I.disconnect(),null),R.destroy(),n.textContent=``,delete n.dataset.cydMounted,document.getElementById(u)?.remove()}}}export{_ as default,_ as mountCycleDetect};