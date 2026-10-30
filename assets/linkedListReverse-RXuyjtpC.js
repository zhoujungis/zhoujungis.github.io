import{a as e,i as t,n,o as r,r as i,s as a,t as o}from"./widgetChrome-CsVdkvMb.js";function s(e){let t=e.length,n=Array.from({length:t},(e,n)=>n+1<t?n+1:null),r=[],i=null,a=t>0?0:null,o=null,s=(e,t)=>r.push({phase:e,desc:t,prev:i,curr:a,next:o,nextOf:[...n],done:!1}),c=t=>t===null?`∅`:String(e[t]);if(t===0)return s(`init`,"空链表。`head` 本身就是 ∅，直接返回 ∅ —— 这是必须单独处理的第一种边界。"),r[0].done=!0,r;for(s(`init`,`初始状态：\`prev\` 先站在 ∅（反转后头节点会变成尾节点，它的 \`next\` 必须指向空），\`curr\` 指向头节点 ${c(a)}。`);a!==null;)o=n[a],s(`read-next`,`① \`next = curr.next\`，先记住 ${c(o)}。这一步看着多余，其实是整个算法的命门：一旦 ② 把 \`curr\` 的指针掉头，通往后面节点的唯一线索就断了，所以必须提前存好。`),n[a]=i,s(`flip`,`② \`curr.next = prev\`，把 ${c(a)} 的箭头掉个头，指向 ${c(i)}。`+(i===null?` 因为 \`prev\` 还是 ∅，${c(a)} 就成了新的尾节点。`:``)),i=a,a=o,s(`advance`,a===null?`③ \`prev = curr\`，\`curr = next\` = ∅。curr 走出了链表，循环结束 —— 返回 \`prev\`（${c(i)}），它就是反转后的新头节点。`:`③ \`prev\` 和 \`curr\` 一起右移：\`prev\` 指向 ${c(i)}，\`curr\` 指向 ${c(a)}。准备处理下一个节点。`);return r[r.length-1].done=!0,r}var c=`llv-styles`,l=72,u=52,d=44,f=68,p=96,m=122,h=48,g=200,_=240,v=62,y=26,b=276,x=26,S=1150,C=0,w=(e,t,n,i)=>r(e,t,n,i,`llv-edge`),T=`
/* 只有这块 SVG 的样式是 LC 206 专属的；容器 / 说明 / 控制条在外壳里
   （widgetChrome.js 的 .viz*），两个动画共用。 */
.llv {
  --llv-prev: var(--accent, #3f6b57);
  --llv-curr: var(--accent-secondary, #a45f45);
  --llv-next: #c89a46;
  --llv-edge: var(--text-secondary, #657168);
}
html.theme-dark .llv {
  --llv-next: #d9b063;
}
.llv__svg { min-width: 460px; }
.llv-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.26s ease, stroke-width 0.26s ease, fill 0.26s ease;
}
.llv-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 19px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.llv-node.is-flipped .llv-node__box { stroke: var(--llv-prev); }
.llv-node.is-curr .llv-node__box {
  stroke: var(--llv-curr);
  stroke-width: 3;
}
.llv-node.is-next .llv-node__box { stroke: var(--llv-next); stroke-dasharray: 5 3; }
.llv-edge {
  opacity: 0;
  transition: opacity 0.26s ease;
}
.llv-edge.is-on { opacity: 1; }
.llv-edge__line {
  stroke: var(--llv-edge);
  stroke-width: 1.8;
  stroke-linecap: round;
}
.llv-edge__head { fill: var(--llv-edge); }
.llv-edge.is-flipped .llv-edge__line { stroke: var(--llv-prev); }
.llv-edge.is-flipped .llv-edge__head { fill: var(--llv-prev); }
.llv-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 3 3;
}
.llv-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  text-anchor: middle;
  dominant-baseline: central;
}
.llv-tick {
  stroke: var(--text-secondary, #657168);
  stroke-width: 1;
  stroke-dasharray: 3 3;
  opacity: 0.65;
}
.llv-chip { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; }
.llv-chip__box { rx: 13; ry: 13; }
.llv-chip__text {
  font-size: 12.5px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.llv-chip--prev .llv-chip__box { fill: var(--llv-prev); }
.llv-chip--prev .llv-chip__text { fill: #fff; }
.llv-chip--curr .llv-chip__box { fill: var(--llv-curr); }
.llv-chip--curr .llv-chip__text { fill: #fff; }
.llv-chip--next .llv-chip__box { fill: var(--llv-next); }
.llv-chip--next .llv-chip__text { fill: #2a2113; }
@media (prefers-reduced-motion: reduce) {
  .llv-chip, .llv-edge, .llv-node__box { transition: none; }
}
`;function E(){if(i(),document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=T,document.head.appendChild(e)}function D(r,i={}){if(!r||r.dataset.llvMounted===`1`)return{destroy(){}};r.dataset.llvMounted=`1`,E(),C+=1;let T=Array.isArray(i.values)&&i.values.length?i.values:[1,2,3,4,5],D=i.autoplay!==!1,O=s(T),k=T.length,ee=Array.from({length:k},(e,t)=>t+1<k?t+1:null),A=2*f+k*l+Math.max(0,k-1)*d,j=e=>f+e*116,M=e=>j(e)+l/2,N=x,P=A-x,F=document.createElement(`div`);F.className=`viz llv`;let I=document.createElement(`div`);I.className=`viz__stage`,F.appendChild(I);let L=a(`svg`,{class:`viz__svg llv__svg`,viewBox:`0 0 ${A} ${b}`,role:`img`,"aria-label":`反转链表推演动画：${T.join(` → `)}`});I.appendChild(L);for(let e of[N,P]){L.appendChild(a(`circle`,{class:`llv-null__ring`,cx:e,cy:m,r:15}));let t=a(`text`,{class:`llv-null__text`,x:e,y:m});t.textContent=`∅`,L.appendChild(t)}let R=a(`line`,{class:`llv-tick`}),z=a(`line`,{class:`llv-tick`}),B=a(`line`,{class:`llv-tick`});L.append(R,z,B);let V=[];for(let e=0;e<k-1;e+=1){let t=j(e)+l,n=j(e+1),r=w(t,n,m,1),i=w(t,n,m,-1);L.append(r,i),V.push({fwd:r,bwd:i})}let H=w(j(k-1)+l,P-15,m,1),U=w(41,j(0),m,-1);L.append(H,U);let W=[];for(let e=0;e<k;e+=1){let t=a(`g`,{class:`llv-node`});t.appendChild(a(`rect`,{class:`llv-node__box`,x:j(e),y:p,width:l,height:u,rx:9}));let n=a(`text`,{class:`llv-node__value`,x:M(e),y:m});n.textContent=String(T[e]),t.appendChild(n),L.appendChild(t),W.push(t)}function G(e,t){let n=a(`g`,{class:`llv-chip llv-chip--${e}`});n.appendChild(a(`rect`,{class:`llv-chip__box`,x:-62/2,y:-26/2,width:v,height:y}));let r=a(`text`,{class:`llv-chip__text`,x:0,y:0});return r.textContent=t,n.appendChild(r),n}let K=G(`next`,`next`),q=G(`prev`,`prev`),J=G(`curr`,`curr`);L.append(K,q,J);let Y=document.createElement(`p`);Y.className=`viz__desc`,Y.setAttribute(`aria-live`,`polite`),F.appendChild(Y);let X=o();F.appendChild(X.root),r.textContent=``,r.appendChild(F);let Z=null;function Q(e,t,n,r,i,a,o){e.style.transform=`translate(${n}px, ${r}px)`,e.style.opacity=i?`1`:`0`,i?(t.setAttribute(`x1`,n),t.setAttribute(`x2`,n),t.setAttribute(`y1`,a),t.setAttribute(`y2`,o),t.style.opacity=`0.65`):t.style.opacity=`0`}function te(t,n){for(let e=0;e<k;e+=1){let t=W[e];t.classList.toggle(`is-flipped`,n.nextOf[e]!==ee[e]),t.classList.toggle(`is-curr`,n.curr===e),t.classList.toggle(`is-next`,n.next===e)}for(let e=0;e<k-1;e+=1){let t=n.nextOf[e]===e+1,r=n.nextOf[e+1]===e;V[e].fwd.classList.toggle(`is-on`,t),V[e].bwd.classList.toggle(`is-on`,r),V[e].bwd.classList.toggle(`is-flipped`,r)}let r=n.nextOf[k-1]===null,i=n.nextOf[0]===null;H.classList.toggle(`is-on`,r),U.classList.toggle(`is-on`,i),U.classList.toggle(`is-flipped`,i),Q(q,z,n.prev===null?N:M(n.prev),g,!0,g-y/2,148),Q(J,B,n.curr===null?P:M(n.curr),_,!0,_-y/2,148),Q(K,R,n.next===null?P:M(n.next),h,n.phase!==`init`,61,p),e(Y,n.desc)}let $=n({steps:O,controls:X,intervalMs:S,onRender:te});$.jumpTo(Math.trunc(i.initialStep)||0);let ne=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return D&&!ne&&typeof IntersectionObserver==`function`&&(Z=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){Z.disconnect(),Z=null,$.play();return}},{threshold:.35}),Z.observe(F)),{destroy(){Z&&=(Z.disconnect(),null),$.destroy(),r.textContent=``,delete r.dataset.llvMounted,--C,C<=0&&(document.getElementById(c)?.remove(),t())}}}export{D as default,D as mountLinkedListReverse};