import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";import{a,i as o,n as s,r as c,t as l}from"./cycleLayout-Bz44Tgir.js";var u=[1,2,3,4,5,6,7,8,9,10,11,12,13],d=4;function f(e={}){let t=Array.isArray(e.values)?e.values.slice():u.slice(),n=t.length,r=e.cycleStart===void 0?d:e.cycleStart,i=[],o=(e,t,n={})=>i.push({phase:e,desc:t,ptr1:null,ptr2:null,walked:0,remain1:0,remain2:0,passed2:!1,entry:null,meetAt:null,a:0,b:0,x:0,m:0,done:!1,...n});if(n===0)return o(`none`,"链表是空的，没有环，返回 `null`。",{done:!0}),i;let s=a({values:t,cycleStart:r}),c=s[s.length-1];if(!c.met)return o(`none`,"这条链表没有环（快指针已经走到末尾），所以 LC 142 直接返回 `null` —— 入口根本不存在。",{done:!0}),i;let l=c.cycle.start,f=c.cycle.length,p=c.slow,m=(p-l)%f,h=l+m,g=h/f,_=f-m,v=e=>Number.isInteger(e)&&e>=0&&e<n?String(t[e]):`∅`,y=e=>!Number.isInteger(e)||e>=n?null:e+1<n?e+1:l,b=l===_?`这里 a 恰好等于 b - x，所以两个指针会**同步**抵达入口。`:`注意 a = ${l} 而 b - x = ${_}，后者更小 —— ptr2 会先路过入口、绕回来之后才和 ptr1 碰上。同余式只管「差整数圈」，不管谁先到。`;if(o(`meet`,`第一阶段的终点：慢指针和快指针在节点 ${v(p)} 相遇。设入口是 ${v(l)}、直段长 \`a = ${l}\`、环长 \`b = ${f}\`、相遇点距入口 \`x = ${m}\`，那么 \`a + x = ${h} = ${g} × b\`，也就是 \`a ≡ b - x (mod b)\`。现在**把 ptr1 放回 head、ptr2 留在相遇点，两者都改成每步走 1 格**：ptr1 要走到入口差 **${l} 步**，ptr2 沿环走到入口差 **${_} 步**。${b}`,{ptr1:0,ptr2:p,walked:0,remain1:l,remain2:_,entry:l,meetAt:p,a:l,b:f,x:m,m:g}),l===0)return o(`found`,`**入口就是头节点 ${v(0)}。** 这里 a = 0，头节点本身就在环上 —— ptr1 一步都不用走，而相遇点也正好是入口（x = 0），所以两个指针一开始就重合。LC 142 返回这个节点。`,{ptr1:0,ptr2:p,walked:0,remain1:0,remain2:0,entry:0,meetAt:p,a:l,b:f,x:m,m:g,done:!0}),i;let x=0,S=p;for(let e=1;e<=l;e+=1){x=y(x),S=y(S);let t=l-e,n=_-e,r=n<0,a=r?(n%f+f)%f:n;if(x===S)return o(`found`,`**两个指针在节点 ${v(x)} 相遇 —— 这就是环的入口。** 从 head 走了 ${e} 步，从相遇点也走了 ${e} 步。回到那条同余式：a = ${l} 步到入口、b - x = ${_} 步也到入口，两者相差 ${g>1?`${g} 圈`:`零圈`}，所以它们必然在入口碰头。LC 142 返回这个节点。`,{ptr1:x,ptr2:S,walked:e,remain1:t,remain2:a,passed2:r,entry:l,meetAt:p,a:l,b:f,x:m,m:g,done:!0}),i;o(`walk`,`走了 ${e} 步。ptr1 到 ${v(x)}（离入口还差 **${t} 步**）、ptr2 到 ${v(S)}（离入口还差 **${a} 步**）。`+(r?`注意 ptr2 已经**越过**了入口，它要再绕一圈回来 —— 但同余式保证它绕回入口的那一刻，ptr1 也正好走到。`:`两个剩余步数**同步递减**，这是「两条路一样长」的直接体现。`),{ptr1:x,ptr2:S,walked:e,remain1:t,remain2:a,passed2:r,entry:l,meetAt:p,a:l,b:f,x:m,m:g})}return o(`found`,`走了 ${l} 步仍未同时落在入口，这不该发生 —— 请检查输入。`,{ptr1:x,ptr2:S,walked:l,entry:l,meetAt:p,a:l,b:f,x:m,m:g,done:!0}),i}var p=`cye-styles`,m=42,h=56,g=32,_=17,v=1250,y=`
.cye { --cye-p1: #2f6f4f; --cye-p2: #b4682c; }
html.theme-dark .cye { --cye-p1: #7fc3a4; --cye-p2: #e0a06a; }
.cye__svg { min-width: 520px; }

/* 相遇点：橙色虚线框，常驻 */
.cye-meet__box {
  fill: none;
  stroke: var(--cye-p2);
  stroke-width: 1.6;
  stroke-dasharray: 3 3;
  opacity: 0.85;
}

/* 尺寸线（直段那条） */
.cye-bar { transition: opacity 0.3s ease; }
.cye-bar.is-off { opacity: 0; }
.cye-bar__line { stroke: var(--cye-p1); stroke-width: 2; stroke-linecap: round; }
.cye-bar__tick { stroke: var(--cye-p1); stroke-width: 2; stroke-linecap: round; }

/* 环内那条弧 */
.cye-arc { transition: opacity 0.3s ease; }
.cye-arc.is-off { opacity: 0; }
.cye-arc__line {
  fill: none;
  stroke: var(--cye-p2);
  stroke-width: 2.2;
  stroke-dasharray: 7 4;
  stroke-linecap: round;
}
.cye-arc__head { fill: var(--cye-p2); }

/* 两个「还差几步」读数，配色和各自的指针一致 */
.cye-tag-bg { fill: var(--surface-muted, #ecefe8); }
.cye-tag {
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-variant-numeric: tabular-nums;
}
.cye-tag--p1 { fill: var(--cye-p1); }
.cye-tag--p2 { fill: var(--cye-p2); }

@media (prefers-reduced-motion: reduce) {
  .cye-bar, .cye-arc { transition: none; }
}
`;function b(){if(n(),c(),document.getElementById(p))return;let e=document.createElement(`style`);e.id=p,e.textContent=y,document.head.appendChild(e)}function x(e,t,n){let i=r(`g`,{class:`cyc-chip cyc-chip--${t}`});i.appendChild(r(`rect`,{class:`cyc-chip__box`,x:-32/2,y:-20/2,width:g,height:20}));let a=r(`text`,{class:`cyc-chip__text`,x:0,y:0});return a.textContent=n,i.appendChild(a),e.appendChild(i),i}function S(e,t){let n=r(`g`,{class:`cye-tag-group cye-tag-group--${t}`}),i=r(`rect`,{class:`cye-tag-bg`,x:-38,y:-10,width:76,height:20,rx:6}),a=r(`text`,{class:`cye-tag cye-tag--${t}`,x:0,y:0});return n.append(i,a),e.appendChild(n),{g:n,t:a,bg:i}}function C(n,a={}){if(!n||n.dataset.cyeMounted===`1`)return{destroy(){}};n.dataset.cyeMounted=`1`,b();let c=f(a),u=Array.isArray(a.values)&&a.values.length?a.values:[1,2,3,4,5,6,7,8,9,10,11,12,13],d=c[0],g=Number.isInteger(d.a)&&d.b>0?d.a:null,y=a.autoplay!==!1,C=document.createElement(`div`);C.className=`viz cye`;let w=document.createElement(`div`);w.className=`viz__stage`,C.appendChild(w);let T=r(`svg`,{class:`viz__svg cye__svg`,viewBox:`0 0 700 400`,role:`img`,"aria-label":`环形链表找入口推演动画`});w.appendChild(T);let E=l(T,{values:u,cycleStart:g});T.setAttribute(`viewBox`,`0 0 ${E.width} ${E.height}`),T.setAttribute(`width`,E.width),T.setAttribute(`height`,E.height);let D=E.at(E.a),O=null;if(Number.isInteger(d.meetAt)&&E.at(d.meetAt)){let e=E.at(d.meetAt),t=r(`g`,{class:`cye-meet`});t.appendChild(r(`rect`,{class:`cye-meet__box`,x:e.cx-46/2-6,y:e.cy-30/2-6,width:58,height:42,rx:12})),T.appendChild(t),O=t}let k=r(`g`,{class:`cye-bar`}),A=r(`path`,{class:`cye-bar__line`}),j=r(`path`,{class:`cye-bar__tick`}),M=r(`path`,{class:`cye-bar__tick`});k.append(A,j,M),T.appendChild(k);let N=S(T,`p1`),P=r(`g`,{class:`cye-arc`}),F=r(`path`,{class:`cye-arc__line`}),I=r(`path`,{class:`cye-arc__head`});P.append(F,I),T.appendChild(P);let L=S(T,`p2`),R=x(T,`p1`,`P1`),z=x(T,`p2`,`P2`);function B(e,t){return s(E.at(e),E,t,_)}let V=(e,t)=>{if(!t){e.style.opacity=`0`;return}e.style.opacity=`1`,e.setAttribute(`transform`,`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)})`)},H=document.createElement(`p`);H.className=`viz__desc`,H.setAttribute(`aria-live`,`polite`),C.appendChild(H);let U=i();C.appendChild(U.root),n.textContent=``,n.appendChild(C);let W=null;function G(t,n){let r=E.b,i=n.ptr1!==null&&n.ptr1===n.ptr2;E.nodes.forEach(e=>{let t=e.index===n.ptr1,r=e.index===n.ptr2;e.g.classList.toggle(`is-slow`,t&&!r),e.g.classList.toggle(`is-fast`,r&&!t),e.g.classList.toggle(`is-both`,t&&r)}),V(R,n.ptr1===null?null:B(n.ptr1,i?-1:0)),V(z,n.ptr2===null?null:B(n.ptr2,+!!i)),O&&(O.style.opacity=n.phase===`found`?`0.45`:`1`);let a=n.ptr1===null?null:E.at(n.ptr1),s=!!a&&n.remain1>0&&!!D;if(k.classList.toggle(`is-off`,!s),N.g.style.opacity=s?`1`:`0`,s){let e=E.rowY+h,t=a.cx,r=D.cx;A.setAttribute(`d`,`M ${t} ${e} L ${r} ${e}`),j.setAttribute(`d`,`M ${t} ${e-6} L ${t} ${e+6}`),M.setAttribute(`d`,`M ${r} ${e-6} L ${r} ${e+6}`),N.g.setAttribute(`transform`,`translate(${((t+r)/2).toFixed(1)} ${e})`),N.t.textContent=`还差 ${n.remain1} 步`}let c=n.ptr2===null?-1:E.ringKOf(n.ptr2),l=r>0&&c>=0&&n.remain2>0&&!n.passed2;if(P.classList.toggle(`is-off`,!l),L.g.style.opacity=l?`1`:`0`,l){let e=E.radius-m,t=o(c,r),i=o(c+n.remain2,r),a=i-t,s=t=>{let n=t*Math.PI/180;return{x:E.ringCenter.x+e*Math.cos(n),y:E.ringCenter.y+e*Math.sin(n)}},l=s(t),u=s(i);F.setAttribute(`d`,`M ${l.x.toFixed(1)} ${l.y.toFixed(1)} A ${e} ${e} 0 ${+(a>180)} 1 ${u.x.toFixed(1)} ${u.y.toFixed(1)}`);let d=i*Math.PI/180,f=-Math.sin(d),p=Math.cos(d);I.setAttribute(`d`,`M ${u.x} ${u.y} L ${u.x-f*9-p*5} ${u.y-p*9+f*5} L ${u.x-f*9+p*5} ${u.y-p*9-f*5} Z`);let h=(t+a/2)*Math.PI/180;L.g.setAttribute(`transform`,`translate(${(E.ringCenter.x+e*Math.cos(h)).toFixed(1)} ${(E.ringCenter.y+e*Math.sin(h)).toFixed(1)})`),L.t.textContent=`还差 ${n.remain2} 步`}e(H,n.desc)}let K=t({steps:c,controls:U,intervalMs:v,onRender:G});K.jumpTo(Math.trunc(a.initialStep)||0);let q=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return y&&!q&&typeof IntersectionObserver==`function`&&(W=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){W.disconnect(),W=null,K.play();return}},{threshold:.35}),W.observe(C)),{destroy(){W&&=(W.disconnect(),null),K.destroy(),n.textContent=``,delete n.dataset.cyeMounted,document.getElementById(p)?.remove()}}}export{C as default,C as mountCycleEntry};