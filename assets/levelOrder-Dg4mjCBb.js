import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";import{n as a,t as o}from"./levelOrderSteps-Cc0Lk2yX.js";var s=`lvo-styles`,c=22,l=84,u=66,d=56,f=54,p=40,m=110,h=30,ee=1150,g=`
.lvo {
  --lvo-node: var(--text-primary, #1f2a24);
  --lvo-edge: var(--text-secondary, #657168);
  --lvo-hot: var(--accent-secondary, #a45f45);
  --lvo-ok: var(--accent, #3f6b57);
  --lvo-queue: var(--accent, #3f6b57);
  --lvo-dim: #9aa39c;
}
html.theme-dark .lvo {
  --lvo-hot: #e0a06a;
  --lvo-ok: #7fc3a4;
  --lvo-queue: #7fc3a4;
  --lvo-dim: #6c766e;
}
.lvo__svg { min-width: 620px; }

/* ── 树 ───────────────────────────────────────────────────────────────── */
.lvo-edge__line { stroke: var(--lvo-edge, #657168); stroke-width: 1.6; fill: none; opacity: 0.75; }
.lvo-node__circle {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.24s ease, stroke-width 0.24s ease, fill 0.24s ease;
}
.lvo-node__value {
  fill: var(--lvo-node, #1f2a24);
  font-size: 16px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  transition: fill 0.24s ease;
}
/* 已经出过队（本轮之前的层）*/
.lvo-node.is-done .lvo-node__circle { stroke: var(--lvo-ok, #3f6b57); stroke-width: 1.8; fill: rgba(63, 107, 87, 0.07); }
.lvo-node.is-done .lvo-node__value { fill: var(--lvo-ok, #3f6b57); }
/* 正在被处理的那个节点 */
.lvo-node.is-current .lvo-node__circle {
  stroke: var(--lvo-hot, #a45f45);
  stroke-width: 3;
  fill: rgba(164, 95, 69, 0.13);
}
.lvo-node.is-current .lvo-node__value { fill: var(--lvo-hot, #a45f45); font-weight: 700; }
/* 这一层里还没出队的节点 */
.lvo-node.is-pending .lvo-node__circle { stroke: var(--lvo-queue, #3f6b57); stroke-width: 2.2; }
/* 刚入队的孩子 */
.lvo-node.is-fresh .lvo-node__circle {
  stroke: var(--lvo-queue, #3f6b57);
  stroke-width: 2.6;
  fill: rgba(63, 107, 87, 0.1);
}

/* 层标注（左侧 "第 0 层" 之类）*/
.lvo-layer__text {
  fill: var(--text-secondary, #657168);
  font-size: 12px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lvo-layer__line { stroke: var(--glass-border, #dce2da); stroke-width: 1; stroke-dasharray: 3 4; opacity: 0.8; }
.lvo-layer__text.is-active { fill: var(--lvo-hot, #a45f45); }
.lvo-layer__line.is-active { stroke: var(--lvo-hot, #a45f45); stroke-dasharray: none; opacity: 1; }

/* ── 队列 ─────────────────────────────────────────────────────────────── */
.lvo-q__label {
  fill: var(--text-secondary, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lvo-q__cell {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.24s ease, fill 0.24s ease, opacity 0.24s ease;
}
.lvo-q__value {
  fill: var(--lvo-node, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 属于"当前这一层"的格子 */
.lvo-q__cell.is-layer { stroke: var(--lvo-hot, #a45f45); stroke-width: 2.2; }
.lvo-q__value.is-layer { fill: var(--lvo-hot, #a45f45); }
/* 这一层里已经出过队的（画成淡出）*/
.lvo-q__cell.is-out { stroke: var(--lvo-dim, #9aa39c); opacity: 0.34; stroke-dasharray: 4 3; }
.lvo-q__value.is-out { fill: var(--lvo-dim, #9aa39c); opacity: 0.34; }
/* 刚入队的 */
.lvo-q__cell.is-fresh { stroke: var(--lvo-queue, #3f6b57); stroke-width: 2.4; fill: rgba(63, 107, 87, 0.1); }

/* 队首标记 */
.lvo-q__head {
  fill: var(--lvo-hot, #a45f45);
  font-size: 11px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lvo-q__headline { stroke: var(--lvo-hot, #a45f45); stroke-width: 1.4; }

/* "这一层 size = n" 的括号标注 */
.lvo-brace__line { stroke: var(--lvo-hot, #a45f45); stroke-width: 1.8; fill: none; }
.lvo-brace__text {
  fill: var(--lvo-hot, #a45f45);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lvo-brace { opacity: 0; transition: opacity 0.24s ease; }
.lvo-brace.is-on { opacity: 1; }

/* ── 结果累积 ─────────────────────────────────────────────────────────── */
.lvo-res__title {
  fill: var(--text-secondary, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lvo-res__text {
  fill: var(--lvo-node, #1f2a24);
  font-size: 14px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lvo-res__text.is-active { fill: var(--lvo-hot, #a45f45); }
.lvo-res__text.is-done { fill: var(--lvo-ok, #3f6b57); }

/* 空树提示 */
.lvo-empty__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  text-anchor: middle;
  dominant-baseline: central;
}

@media (prefers-reduced-motion: reduce) {
  .lvo-node__circle, .lvo-q__cell, .lvo-brace { transition: none; }
}
`;function te(){if(n(),document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=g,document.head.appendChild(e)}function _(n,g={}){if(!n||n.dataset.lvoMounted===`1`)return{destroy(){}};n.dataset.lvoMounted=`1`,te();let _=o(g),v=g.autoplay!==!1,{nodes:y,root:b}=a(Array.isArray(g.values)?g.values:[3,9,20,null,null,15,7]),x=e=>y[e].value,S=y.reduce((e,t)=>Math.max(e,t.depth),0),C=new Map;C.set(b,[]);for(let e of y)e.parent!==-1&&C.set(e.id,[...C.get(e.parent)??[],e.side]);let ne=e=>56*2**Math.max(0,S-e),re=e=>{let t=0;for(let n of C.get(e.id)??[])t=t*2+ +(n===`R`);return(t+.5)*ne(e.depth)},w=2**S*56,T=Math.max(620,96+w+80),E=(T-w)/2,D=u+S*l+c+d,O=D+81+34,k=O+Math.max(1,S+1)*22+18,A=e=>{let t=y[e];return{x:E+re(t),y:u+t.depth*l}},j=e=>u+e*l,M=Math.max(1,..._.map(e=>e.queue.length),..._.map(e=>e.queue.length+e.enqueued.length)),N=e=>m+e*64,P=document.createElement(`div`);P.className=`viz lvo`;let F=document.createElement(`div`);F.className=`viz__stage`,P.appendChild(F);let I=r(`svg`,{class:`viz__svg lvo__svg`,viewBox:`0 0 ${T} ${k}`,role:`img`,"aria-label":`层序遍历推演动画`});if(F.appendChild(I),b===-1){let e=r(`text`,{class:`lvo-empty__text`,x:T/2,y:k/2});return e.textContent=`空树 —— 直接返回 []`,I.appendChild(e),P.appendChild(L()),P.appendChild(i().root),n.textContent=``,n.appendChild(P),{destroy(){n.textContent=``,delete n.dataset.lvoMounted,document.getElementById(s)?.remove()}}}function L(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let R=[];for(let e=0;e<=S;e+=1){let t=j(e),n=r(`line`,{class:`lvo-layer__line`,x1:62,y1:t,x2:E+w+14,y2:t}),i=r(`text`,{class:`lvo-layer__text`,x:56,y:t});i.textContent=`第 ${e} 层`,I.append(n,i),R.push({line:n,t:i})}let z=r(`g`,{class:`lvo-edges`});I.appendChild(z);for(let e of y)for(let t of[e.left,e.right]){if(t==null)continue;let n=A(e.id),i=A(t),a=r(`line`,{class:`lvo-edge__line`,x1:n.x,y1:n.y+c,x2:i.x,y2:i.y-c});z.appendChild(a)}let B=new Map;for(let e of y){let t=A(e.id),n=r(`g`,{class:`lvo-node`});n.setAttribute(`transform`,`translate(${t.x} ${t.y})`),n.appendChild(r(`circle`,{class:`lvo-node__circle`,cx:0,cy:0,r:c}));let i=r(`text`,{class:`lvo-node__value`,x:0,y:0});i.textContent=String(e.value),n.appendChild(i),I.appendChild(n),B.set(e.id,n)}let V=r(`text`,{class:`lvo-q__label`,x:h,y:D+5});V.textContent=`queue`,I.appendChild(V);let H=[];for(let e=0;e<M;e+=1){let t=r(`g`,{class:`lvo-q__cell-g`});t.setAttribute(`transform`,`translate(${N(e)} ${D-p/2})`);let n=r(`rect`,{class:`lvo-q__cell`,x:0,y:0,width:f,height:p,rx:8}),i=r(`text`,{class:`lvo-q__value`,x:f/2,y:p/2});t.append(n,i),I.appendChild(t),H.push({g:t,rect:n,t:i})}let U=r(`line`,{class:`lvo-q__headline`}),W=r(`text`,{class:`lvo-q__head`});W.textContent=`head`,I.append(U,W);let G=r(`g`,{class:`lvo-brace`}),K=r(`path`,{class:`lvo-brace__line`}),q=r(`text`,{class:`lvo-brace__text`});G.append(K,q),I.appendChild(G);let J=r(`text`,{class:`lvo-res__title`,x:h,y:O});J.textContent=`res`,I.appendChild(J);let Y=[];for(let e=0;e<Math.max(1,S+1);e+=1){let t=r(`text`,{class:`lvo-res__text`,x:m,y:O+e*22});I.appendChild(t),Y.push(t)}let X=L();P.appendChild(X);let Z=i();P.appendChild(Z.root),n.textContent=``,n.appendChild(P);let ie=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;function ae(t,n){let r=new Set(n.queue),i=new Set(n.enqueued),a=Math.max(0,n.levelSize-n.consumed);for(let[e,t]of B){let a=y[e],o=n.current===e,s=i.has(e),c=n.levelIndex>=0&&a.depth<n.levelIndex&&!o,l=n.levelIndex>=0&&a.depth===n.levelIndex&&r.has(e)&&!s&&!o;t.classList.toggle(`is-done`,c),t.classList.toggle(`is-current`,o),t.classList.toggle(`is-pending`,l),t.classList.toggle(`is-fresh`,s)}if(R.forEach(({line:e,t},r)=>{let i=r===n.levelIndex;e.classList.toggle(`is-active`,i),t.classList.toggle(`is-active`,i)}),H.forEach((e,t)=>{let r=n.queue[t];if(r===void 0){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`,e.t.textContent=String(x(r));let o=i.has(r),s=n.levelIndex>=0&&n.phase!==`init`,c=s&&!o&&t>=a;e.rect.setAttribute(`class`,`lvo-q__cell${o?` is-fresh`:s?` is-layer`:``}${c?` is-out`:``}`),e.t.setAttribute(`class`,`lvo-q__value${o||s?` is-layer`:``}${c?` is-out`:``}`)}),n.queue.length){let e=N(0)+f/2;U.setAttribute(`x1`,e),U.setAttribute(`x2`,e),U.setAttribute(`y1`,D+34),U.setAttribute(`y2`,D+42),W.setAttribute(`x`,e),W.setAttribute(`y`,D+48),U.style.opacity=`1`,W.style.opacity=`1`}else U.style.opacity=`0`,W.style.opacity=`0`;if(n.levelIndex>=0&&n.levelSize>0&&n.phase!==`init`){let e=N(0)-5,t=N(n.levelSize-1)+f+5,r=D+68;K.setAttribute(`d`,`M ${e} ${r-7} L ${e} ${r} L ${t} ${r} L ${t} ${r-7}`),q.setAttribute(`x`,(e+t)/2),q.setAttribute(`y`,D+81),q.textContent=`这一层 size = ${n.levelSize}`,G.classList.add(`is-on`)}else G.classList.remove(`is-on`);Y.forEach((e,t)=>{let r=n.results[t];if(!r){e.textContent=``,e.setAttribute(`class`,`lvo-res__text`);return}e.textContent=`[${r.join(`, `)}]`;let i=t===n.levelIndex&&n.phase===`close`;e.setAttribute(`class`,`lvo-res__text${i?` is-done`:` is-active`}`)}),e(X,n.desc)}let Q=t({steps:_,controls:Z,intervalMs:ee,onRender:ae});Q.jumpTo(Math.trunc(g.initialStep)||0);let $=null;return v&&!ie&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(P)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),n.textContent=``,delete n.dataset.lvoMounted,document.getElementById(s)?.remove()}}}export{_ as default,_ as mountLevelOrder};