import{a as e,i as t,n,r,s as i,t as a}from"./widgetChrome-CsVdkvMb.js";var o=e=>String(e);function s(e,t){let n=Array.isArray(e)?e:[],r=Array.isArray(t)?t:[],i=[],a=[],s=0,c=0,l=(e,t,o={})=>i.push({phase:e,desc:t,p1:s<n.length?s:null,p2:c<r.length?c:null,taken:a.map(e=>({...e})),rest:null,done:!1,...o}),u=(e,t)=>e===`a`?n[t]:r[t];if(n.length===0&&r.length===0)return l(`init`,`两条链表都是空的。哑结点后面什么都没有，返回 ∅。`),i[0].done=!0,i;if(n.length===0||r.length===0){let e=n.length===0?`A`:`B`,t=e===`A`?`B`:`A`;return l(`init`,`${e} 是空链表，那么「合并」就是原样返回 ${t}（${(t===`A`?n:r).map(o).join(`、`)}）—— 一个空链表和一个有序链表合并，结果就是那个有序链表本身。`),i[0].done=!0,i}for(l(`init`,`两个指针各站在自己链表的头部：\`p1\` 指向 A 的 ${o(n[0])}，\`p2\` 指向 B 的 ${o(r[0])}。结果链表先放一个**哑结点**当锚点 —— 它不是答案的一部分，只是为了让我们不必特判「第一个节点该接谁」，最后返回 \`dummy.next\` 就行。`);s<n.length&&c<r.length;){let e=n[s]<=r[c];l(`compare`,`比较 \`p1\` 的 ${o(n[s])} 和 \`p2\` 的 ${o(r[c])}：`+(e?`${o(n[s])} ≤ ${o(r[c])}，取 A 的 ${o(n[s])}。`+(n[s]===r[c]?`（相等时取哪边都行，习惯上取 A）`:``):`${o(r[c])} < ${o(n[s])}，取 B 的 ${o(r[c])}。`),{cursor:e?`a`:`b`}),e?(a.push({list:`a`,i:s}),s+=1):(a.push({list:`b`,i:c}),c+=1),l(`take`,`把 ${o(u(a[a.length-1].list,a[a.length-1].i))} 接到结果链表的尾部，然后 ${e?"`p1`":"`p2`"} 前移一格。`+(e&&s>=n.length?` A 走完了。`:``)+(!e&&c>=r.length?` B 走完了。`:``),{picked:e?`a`:`b`})}if(s<n.length||c<r.length){let e=s<n.length?`a`:`b`,t=s<n.length?s:c,i=(e===`a`?n.slice(s):r.slice(c)).map(o).join(`、`),u=e===`a`?n:r,d=s<n.length?s:null,f=c<r.length?c:null;for(let n=t;n<u.length;n+=1)a.push({list:e,i:n});e===`a`?s=n.length:c=r.length,l(`append-rest`,`${e===`a`?`B`:`A`} 已经走完了，${e===`a`?`A`:`B`} 剩下的 ${i} 全部原样接到结果尾部。**这是整道题最容易被忽略的一步**：两条链表各自都是有序的，所以剩下这段不需要再逐个比较，直接整段接上就对。`,{rest:{list:e,from:t},p1:d,p2:f})}return l(`done`,`两条链表都走完了。结果链表是 ${a.map(e=>o(u(e.list,e.i))).join(` → `)} —— 但别忘了开头那个哑结点，它不是答案的一部分，所以返回 \`dummy.next\`。`),i[i.length-1].done=!0,i}var c=`mtl-styles`,l=60,u=44,d=94,f=84,p=40,m=130,h=218,g=214/2,_=38,v=24,y=17,b=26,x=15,ee=302,S=1150,C=0,w=`
/* 只有这块 SVG 的样式是 LC 21 专属的；容器 / 说明 / 控制条在外壳里
   （widgetChrome.js 的 .viz*），两个动画共用。 */
.mtl {
  --mtl-a: var(--accent, #3f6b57);
  --mtl-b: var(--accent-secondary, #a45f45);
  --mtl-edge: var(--text-secondary, #657168);
  --mtl-gold: #c89a46;
}
html.theme-dark .mtl {
  --mtl-gold: #d9b063;
}
.mtl__svg { min-width: 520px; }
.mtl-row-label {
  fill: var(--text-secondary, #657168);
  font-size: 14px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
}
.mtl-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.26s ease, fill 0.26s ease, stroke-width 0.26s ease;
}
.mtl-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 17px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  transition: opacity 0.26s ease;
}
/* compare：两个候选节点虚线高亮，赢的一边实线加粗 */
.mtl-node--a.is-cand .mtl-node__box { stroke: var(--mtl-a); stroke-dasharray: 5 3; stroke-width: 2; }
.mtl-node--b.is-cand .mtl-node__box { stroke: var(--mtl-b); stroke-dasharray: 5 3; stroke-width: 2; }
.mtl-node.is-win .mtl-node__box { stroke-width: 3; stroke-dasharray: none; }
/* take：节点被摘走 —— 按来源染色变淡 */
.mtl-node--a.is-taken .mtl-node__box { fill: rgba(63, 107, 87, 0.16); stroke: var(--mtl-a); }
.mtl-node--b.is-taken .mtl-node__box { fill: rgba(164, 95, 69, 0.16); stroke: var(--mtl-b); }
.mtl-node.is-taken .mtl-node__value { opacity: 0.55; }
/* append-rest：剩余段在源行里整体高亮（虚线绿 = 即将并入结果） */
.mtl-node.is-rest .mtl-node__box { stroke: var(--mtl-a); stroke-width: 2.5; stroke-dasharray: 6 3; }
.mtl-edge__line {
  stroke: var(--mtl-edge);
  stroke-width: 1.8;
  stroke-linecap: round;
}
.mtl-edge__head { fill: var(--mtl-edge); }
/* 结果行的箭头跟着节点出现 */
.mtl-redge { opacity: 0; transition: opacity 0.3s ease; }
.mtl-redge.is-on { opacity: 1; }
/* 哑结点：虚线框，明确它不是答案的一部分 */
.mtl-dummy__box {
  fill: none;
  stroke: var(--mtl-edge, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
}
.mtl-dummy__text {
  fill: var(--mtl-edge, #657168);
  font-size: 11px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 结果槽：出现前隐藏并下沉 10px，出现时上浮淡入 */
.mtl-rslot {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.mtl-rslot.is-filled { opacity: 1; transform: translateY(0); }
.mtl-rslot--from-a .mtl-node__box { fill: rgba(63, 107, 87, 0.16); stroke: var(--mtl-a); }
.mtl-rslot--from-b .mtl-node__box { fill: rgba(164, 95, 69, 0.16); stroke: var(--mtl-b); }
/* vs 徽章：位置也带过渡，从上一组候选滑到下一组 */
.mtl-vs {
  opacity: 0;
  transition: opacity 0.25s ease, transform 0.3s ease;
}
.mtl-vs.is-on { opacity: 1; }
.mtl-vs__ring { fill: var(--surface, #fff); stroke: var(--mtl-b); stroke-width: 1.5; }
.mtl-vs__text {
  fill: var(--mtl-b);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mtl-chip { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.mtl-chip__box { rx: 12; ry: 12; }
.mtl-chip__text {
  font-size: 11.5px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mtl-chip--p1 .mtl-chip__box { fill: var(--mtl-a); }
.mtl-chip--p1 .mtl-chip__text { fill: #fff; }
.mtl-chip--p2 .mtl-chip__box { fill: var(--mtl-b); }
.mtl-chip--p2 .mtl-chip__text { fill: #fff; }
.mtl-chip--tail .mtl-chip__box { fill: var(--mtl-gold); }
.mtl-chip--tail .mtl-chip__text { fill: #2a2113; }
@media (prefers-reduced-motion: reduce) {
  .mtl-chip, .mtl-vs, .mtl-rslot, .mtl-redge, .mtl-node__box, .mtl-node__value { transition: none; }
  .mtl-rslot { transform: none; }
}
`;function te(){if(r(),document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=w,document.head.appendChild(e)}function T(r,o={}){if(!r||r.dataset.mtlMounted===`1`)return{destroy(){}};r.dataset.mtlMounted=`1`,te(),C+=1;let w=Array.isArray(o.listA)&&o.listA.length?o.listA:[1,2,4],T=Array.isArray(o.listB)&&o.listB.length?o.listB:[1,3,4],ne=o.autoplay!==!1,E=s(w,T),D=E[E.length-1].taken,O=e=>e.list===`a`?w[e.i]:T[e.i],k=1+D.length,A=e=>f+e*d,j=e=>A(e)+l/2,M=e=>e<=0?f:f+(e-1)*d+l,N=e=>e<=0?f:M(e)+b,re=Math.max(M(w.length),M(T.length),M(k))+b+x+12,P=document.createElement(`div`);P.className=`viz mtl`;let F=document.createElement(`div`);F.className=`viz__stage`,P.appendChild(F);let I=i(`svg`,{class:`viz__svg mtl__svg`,viewBox:`0 0 ${re} ${ee}`,role:`img`,"aria-label":`合并两个有序链表推演动画：${w.join(`、`)} 与 ${T.join(`、`)}`});F.appendChild(I);for(let[e,t]of[[`A`,62],[`B`,152],[`结果`,240]]){let n=i(`text`,{class:`mtl-row-label`,x:30,y:t});n.textContent=e,I.appendChild(n)}function L(e,t){I.appendChild(i(`circle`,{class:`mtl-dummy__box`,cx:e,cy:t,r:x}));let n=i(`text`,{class:`mtl-dummy__text`,x:e,y:t});n.textContent=`∅`,I.appendChild(n)}function R(e,t,n,r){let a=i(`g`,{class:r});return a.appendChild(i(`line`,{class:`mtl-edge__line`,x1:e,y1:n,x2:t-9,y2:n})),a.appendChild(i(`path`,{class:`mtl-edge__head`,d:`M ${t} ${n} L ${t-9} ${n-5.5} L ${t-9} ${n+5.5} Z`})),I.appendChild(a),a}function z(e,t){let n=t+u/2;for(let t=0;t<e-1;t+=1)R(A(t)+l,A(t+1),n,`mtl-edge`);L(N(e),n),e>0&&R(M(e),N(e)-x,n,`mtl-edge`)}z(w.length,p),z(T.length,m);let B=[];for(let e=1;e<k;e+=1)B.push(R(A(e-1)+l,A(e),240,`mtl-edge mtl-redge`));L(N(k),240);let V=R(M(k),N(k)-x,240,`mtl-edge mtl-redge`);function H(e,t,n,r){let a=i(`g`,{class:`mtl-node ${r}`});a.appendChild(i(`rect`,{class:`mtl-node__box`,x:A(t),y:n,width:l,height:u,rx:9}));let o=i(`text`,{class:`mtl-node__value`,x:j(t),y:n+u/2});return o.textContent=String(e),a.appendChild(o),I.appendChild(a),a}let U=w.map((e,t)=>H(e,t,p,`mtl-node--a`)),ie=T.map((e,t)=>H(e,t,m,`mtl-node--b`)),W=i(`g`,{class:`mtl-dummy`});W.appendChild(i(`rect`,{class:`mtl-dummy__box`,x:A(0),y:h,width:l,height:u,rx:9}));let G=i(`text`,{class:`mtl-dummy__text`,x:j(0),y:240});G.textContent=`dummy`,W.appendChild(G),I.appendChild(W);let ae=D.map((e,t)=>H(O(e),t+1,h,`mtl-rslot mtl-rslot--from-${e.list}`)),K=i(`g`,{class:`mtl-vs`});K.appendChild(i(`circle`,{class:`mtl-vs__ring`,cx:0,cy:0,r:13}));let q=i(`text`,{class:`mtl-vs__text`,x:0,y:0});q.textContent=`vs`,K.appendChild(q),I.appendChild(K);function J(e,t){let n=i(`g`,{class:`mtl-chip mtl-chip--${e}`});n.appendChild(i(`rect`,{class:`mtl-chip__box`,x:-38/2,y:-24/2,width:_,height:v}));let r=i(`text`,{class:`mtl-chip__text`,x:0,y:0});return r.textContent=t,n.appendChild(r),I.appendChild(n),n}let oe=J(`p1`,`p1`),se=J(`p2`,`p2`),ce=J(`tail`,`tail`),Y=document.createElement(`p`);Y.className=`viz__desc`,Y.setAttribute(`aria-live`,`polite`),P.appendChild(Y);let X=a();P.appendChild(X.root),r.textContent=``,r.appendChild(P);let Z=null;function Q(e,t,n){e.style.transform=`translate(${t}px, ${n}px)`}function le(t,n){let r=new Set(n.taken.map(e=>`${e.list}:${e.i}`));U.forEach((e,t)=>{e.classList.toggle(`is-taken`,r.has(`a:${t}`)),e.classList.toggle(`is-cand`,n.phase===`compare`&&n.p1===t),e.classList.toggle(`is-win`,n.phase===`compare`&&n.cursor===`a`&&n.p1===t),e.classList.toggle(`is-rest`,n.phase===`append-rest`&&n.rest?.list===`a`&&t>=n.rest.from)}),ie.forEach((e,t)=>{e.classList.toggle(`is-taken`,r.has(`b:${t}`)),e.classList.toggle(`is-cand`,n.phase===`compare`&&n.p2===t),e.classList.toggle(`is-win`,n.phase===`compare`&&n.cursor===`b`&&n.p2===t),e.classList.toggle(`is-rest`,n.phase===`append-rest`&&n.rest?.list===`b`&&t>=n.rest.from)});let i=n.rest?(n.rest.list===`a`?w.length:T.length)-n.rest.from:0,a=n.phase===`take`?n.taken.length:n.phase===`append-rest`?n.taken.length-i+1:1/0;ae.forEach((e,t)=>{let r=t+1,i=r<=n.taken.length;e.classList.toggle(`is-filled`,i),e.classList.toggle(`is-new`,i&&r>=a)}),B.forEach((e,t)=>e.classList.toggle(`is-on`,t+1<=n.taken.length)),V.classList.toggle(`is-on`,n.done);let o=n.phase===`compare`;if(K.classList.toggle(`is-on`,o),o){let e=(j(n.p1)+j(n.p2))/2;K.style.transform=`translate(${e}px, ${g}px)`}Q(oe,n.p1===null?N(w.length):j(n.p1),p-y),Q(se,n.p2===null?N(T.length):j(n.p2),m-y),Q(ce,j(Math.min(n.taken.length,k-1)),279),e(Y,n.desc)}let $=n({steps:E,controls:X,intervalMs:S,onRender:le});$.jumpTo(Math.trunc(o.initialStep)||0);let ue=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return ne&&!ue&&typeof IntersectionObserver==`function`&&(Z=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){Z.disconnect(),Z=null,$.play();return}},{threshold:.35}),Z.observe(P)),{destroy(){Z&&=(Z.disconnect(),null),$.destroy(),r.textContent=``,delete r.dataset.mtlMounted,--C,C<=0&&(document.getElementById(c)?.remove(),t())}}}export{T as default,T as mountMergeTwoLists};