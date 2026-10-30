import{a as e,n as t,o as n,r,s as i,t as a}from"./widgetChrome-CsVdkvMb.js";function o(e,t){let n=e.length,r=Array.from({length:n+1},(e,t)=>t+1<=n?t+1:null),i=[],a=t=>t===null?`∅`:t===0?`dummy`:String(e[t-1]),o=(e,a,o={})=>i.push({phase:e,desc:a,fast:0,slow:0,gap:null,links:[...r],cutSlot:null,leadTotal:t+1,syncTotal:Math.max(0,n-t),done:!1,...o});if(n===0)return o(`init`,"空链表：没有可删的节点，返回 `∅` 即可。"),i[0].done=!0,i;o(`init`,"先接一个哑结点 `dummy`，`fast` 和 `slow` 都从它出发。有它在，「删头节点」就不再需要特判。");let s=0;for(let e=1;e<=t+1;e+=1){s=r[s];let n=s-0;o(`lead`,e===1?`① \`fast\` 先走：第 1 / ${t+1} 步，指向 ${a(s)}。约定是先走 **n+1 = ${t+1}** 步 —— 要定位的是待删节点的**前驱**，所以多退这一步。`:s===null?`① \`fast\` 第 ${e} / ${t+1} 步落到了 ∅ —— \`n\` 正好等于链长，要删的就是**头节点**。同步阶段将一步不走，\`slow\` 会留在 \`dummy\` 上。`:`① \`fast\` 继续走：第 ${e} / ${t+1} 步，指向 ${a(s)}。`+(e===t+1?`间隔锁死为 **n+1 = ${t+1}**， \`slow\` 从现在起一步不会再被落下。`:`\`slow\` 原地不动，间隔拉开到 ${n}。`),{fast:s,gap:s===null?null:n})}let c=0,l=0;for(;s!==null;){s=r[s],c=r[c],l+=1;let e=s===null;o(`sync`,e?`② \`fast\` 撞到了 ∅，停下。\`slow\` 停在 ${a(c)} —— 正是**倒数第 n+1 个**节点，待删节点 ${a(c+1)} 的**前驱**。`:`② 两个指针一起走（第 ${l} / ${n-t} 步）：\`fast\` 在 ${a(s)}，\`slow\` 在 ${a(c)}。间隔保持 ${s-c} 不变 —— 这就是循环不变量。`,{fast:s,slow:c,gap:e?null:s-c})}let u=c+1;return r[c]=r[u],o(`cut`,`③ \`slow.next = slow.next.next\`：${a(c)} 的箭头跨过 ${a(u)}，直接指向 ${a(r[c])}。节点 ${a(u)} 被摘掉 —— 注意它还在内存里，只是没人再引用它。`,{slow:c,cutSlot:u}),o(`done`,`④ 返回 \`dummy.next\`（**不是 head**——如果删的是头节点，head 已经不在链上了）。得到 ${e.filter((e,t)=>t!==u-1).map(String).join(` → `)}。全程只扫了**一趟**。`,{slow:c,cutSlot:u}),i[i.length-1].done=!0,i}var s=`rnth-styles`,c=64,l=50,u=42,d=48,ee=88,f=113,p=40,m=196,te=236,ne=56,h=26,re=272,g=26,_=1150,v=`
.rnth {
  --rnth-fast: var(--accent-secondary, #a45f45);
  --rnth-slow: var(--accent, #3f6b57);
  --rnth-edge: var(--text-secondary, #657168);
  --rnth-cut: #b3452e;
}
html.theme-dark .rnth {
  --rnth-fast: #e0a06a;
  --rnth-slow: #7fc3a4;
  --rnth-cut: #e07a5f;
}
.rnth__svg { min-width: 520px; }

.rnth-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.26s ease, fill 0.26s ease, opacity 0.26s ease;
}
.rnth-node--dummy .rnth-node__box { stroke-dasharray: 5 3; }
.rnth-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 19px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rnth-node--dummy .rnth-node__value { font-size: 14px; fill: var(--text-secondary, #657168); }
/* 被删节点：变灰、虚线、半透明 */
.rnth-node.is-cut .rnth-node__box {
  stroke: var(--text-secondary, #657168);
  stroke-dasharray: 5 3;
  opacity: 0.55;
}
.rnth-node.is-cut .rnth-node__value { opacity: 0.45; text-decoration: line-through; }

.rnth-edge { opacity: 0; transition: opacity 0.26s ease; }
.rnth-edge.is-on { opacity: 1; }
.rnth-edge__line { stroke: var(--rnth-edge); stroke-width: 1.8; stroke-linecap: round; }
.rnth-edge__head { fill: var(--rnth-edge); }

.rnth-arc { opacity: 0; transition: opacity 0.26s ease; }
.rnth-arc.is-on { opacity: 1; }
.rnth-arc__line {
  fill: none;
  stroke: var(--rnth-cut);
  stroke-width: 2.2;
  stroke-linecap: round;
}
.rnth-arc__head { fill: var(--rnth-cut); }

.rnth-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 3 3;
}
.rnth-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  text-anchor: middle;
  dominant-baseline: central;
}

/* 间隔标注线：双向箭头 + 中央标签 */
.rnth-gapline { opacity: 0; transition: opacity 0.26s ease; }
.rnth-gapline.is-on { opacity: 1; }
.rnth-gapline__line {
  stroke: var(--rnth-fast);
  stroke-width: 1.6;
  stroke-dasharray: 5 3;
}
.rnth-gapline__head { fill: var(--rnth-fast); }
.rnth-gapline__tag-bg { fill: var(--surface-muted, #ecefe8); }
.rnth-gapline__tag {
  fill: var(--rnth-fast);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rnth-tick {
  stroke: var(--text-secondary, #657168);
  stroke-width: 1;
  stroke-dasharray: 3 3;
  opacity: 0;
}
.rnth-chip { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; }
.rnth-chip__box { rx: 13; ry: 13; }
.rnth-chip__text {
  font-size: 12.5px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rnth-chip--fast .rnth-chip__box { fill: var(--rnth-fast); }
.rnth-chip--fast .rnth-chip__text { fill: #fff; }
.rnth-chip--slow .rnth-chip__box { fill: var(--rnth-slow); }
.rnth-chip--slow .rnth-chip__text { fill: #fff; }
@media (prefers-reduced-motion: reduce) {
  .rnth-chip, .rnth-edge, .rnth-arc, .rnth-gapline, .rnth-node__box { transition: none; }
}
`;function y(){if(r(),document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=v,document.head.appendChild(e)}function b(r,v={}){if(!r||r.dataset.rnthMounted===`1`)return{destroy(){}};r.dataset.rnthMounted=`1`,y();let b=Array.isArray(v.values)&&v.values.length?v.values:[1,2,3,4,5],x=Math.min(Math.max(Math.trunc(v.n)||2,1),b.length),ie=v.autoplay!==!1,ae=o(b,x),S=b.length,C=S+1,w=2*d+C*c+(C-1)*u,T=e=>d+e*106,E=e=>T(e)+c/2,D=w-g,O=document.createElement(`div`);O.className=`viz rnth`;let k=document.createElement(`div`);k.className=`viz__stage`,O.appendChild(k);let A=i(`svg`,{class:`viz__svg rnth__svg`,viewBox:`0 0 ${w} ${re}`,role:`img`,"aria-label":`删除倒数第 ${x} 个节点推演动画：${b.join(` → `)}`});k.appendChild(A),A.appendChild(i(`circle`,{class:`rnth-null__ring`,cx:D,cy:f,r:15}));let j=i(`text`,{class:`rnth-null__text`,x:D,y:f});j.textContent=`∅`,A.appendChild(j);let M=i(`line`,{class:`rnth-tick`}),N=i(`line`,{class:`rnth-tick`});A.append(M,N);let P=[];for(let e=0;e<S;e+=1){let t=n(T(e)+c,T(e+1),f,1,`rnth-edge`);A.appendChild(t),P.push(t)}let F=n(T(S)+c,D-15,f,1,`rnth-edge`);A.appendChild(F);let I=i(`path`,{class:`rnth-arc__line`}),L=i(`path`,{class:`rnth-arc__head`}),R=i(`g`,{class:`rnth-arc`});R.append(I,L),A.appendChild(R);let z=[];for(let e=0;e<C;e+=1){let t=i(`g`,{class:`rnth-node${e===0?` rnth-node--dummy`:``}`});t.appendChild(i(`rect`,{class:`rnth-node__box`,x:T(e),y:ee,width:c,height:l,rx:9}));let n=i(`text`,{class:`rnth-node__value`,x:E(e),y:f});n.textContent=e===0?`dummy`:String(b[e-1]),t.appendChild(n),A.appendChild(t),z.push(t)}let B=i(`g`,{class:`rnth-gapline`}),V=i(`line`,{class:`rnth-gapline__line`}),H=i(`path`,{class:`rnth-gapline__head`}),U=i(`path`,{class:`rnth-gapline__head`}),W=i(`rect`,{class:`rnth-gapline__tag-bg`,x:-26,y:-9,width:52,height:18,rx:6}),G=i(`text`,{class:`rnth-gapline__tag`,x:0,y:0});B.append(V,H,U,W,G),A.appendChild(B);function K(e,t){let n=i(`g`,{class:`rnth-chip rnth-chip--${e}`});n.appendChild(i(`rect`,{class:`rnth-chip__box`,x:-56/2,y:-26/2,width:ne,height:h}));let r=i(`text`,{class:`rnth-chip__text`,x:0,y:0});return r.textContent=t,n}let q=K(`fast`,`fast`),J=K(`slow`,`slow`);A.append(q,J);let Y=document.createElement(`p`);Y.className=`viz__desc`,Y.setAttribute(`aria-live`,`polite`),O.appendChild(Y);let X=a();O.appendChild(X.root),r.textContent=``,r.appendChild(O);let Z=null,oe=e=>e===null?D:E(e);function Q(e,t,n,r){let i=oe(n);e.style.transform=`translate(${i}px, ${r}px)`,e.style.opacity=`1`,t.setAttribute(`x1`,i),t.setAttribute(`x2`,i),t.setAttribute(`y1`,r-h/2),t.setAttribute(`y2`,138),t.style.opacity=`0.65`}function se(e){let t=e.cutSlot;if(t===null||e.links[t-1]!==t+1){R.classList.remove(`is-on`);return}let n=T(t-1)+c,r=T(t+1),i=f,a=f,o=n+(r-n)*.3,s=n+(r-n)*.7;I.setAttribute(`d`,`M ${n} ${i} C ${o} ${i-44}, ${s} ${a-44}, ${r-8} ${a}`),L.setAttribute(`d`,`M ${r} ${a} L ${r-9} ${a-5.5} L ${r-9} 118.5 Z`),R.classList.add(`is-on`)}function ce(e){let t=e.gap!==null&&e.gap>0&&e.fast!==null;if(B.classList.toggle(`is-on`,t),!t)return;let n=E(e.slow),r=E(e.fast);V.setAttribute(`x1`,n),V.setAttribute(`x2`,r),V.setAttribute(`y1`,p),V.setAttribute(`y2`,p),H.setAttribute(`d`,`M ${n} ${p} L ${n+7} ${p-4.5} L ${n+7} 44.5 Z`),U.setAttribute(`d`,`M ${r} ${p} L ${r-7} ${p-4.5} L ${r-7} 44.5 Z`),W.setAttribute(`x`,(n+r)/2-26),W.setAttribute(`y`,p-9),G.setAttribute(`x`,(n+r)/2),G.setAttribute(`y`,p),G.textContent=`间隔 ${e.gap}`}function le(t,n){for(let e=0;e<C;e+=1)z[e].classList.toggle(`is-cut`,n.cutSlot!==null&&e===n.cutSlot);for(let e=0;e<S;e+=1)P[e].classList.toggle(`is-on`,n.links[e]===e+1);F.classList.toggle(`is-on`,n.links[S]===null),se(n),ce(n),n.fast===null?(q.style.transform=`translate(${D}px, ${m}px)`,q.style.opacity=`1`,M.style.opacity=`0`):Q(q,M,n.fast,m),Q(J,N,n.slow,te),e(Y,n.desc)}let $=t({steps:ae,controls:X,intervalMs:_,onRender:le});$.jumpTo(Math.trunc(v.initialStep)||0);let ue=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return ie&&!ue&&typeof IntersectionObserver==`function`&&(Z=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){Z.disconnect(),Z=null,$.play();return}},{threshold:.35}),Z.observe(O)),{destroy(){Z&&=(Z.disconnect(),null),$.destroy(),r.textContent=``,delete r.dataset.rnthMounted,document.getElementById(s)?.remove()}}}export{b as default,b as mountRemoveNthFromEnd};