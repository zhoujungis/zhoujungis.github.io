import{a as e,i as t,n,r,s as i,t as a}from"./widgetChrome-CsVdkvMb.js";var o=e=>String.fromCharCode(65+e);function s(e){let t=(Array.isArray(e)?e:[]).map(e=>Array.isArray(e)?e.slice():[]),n=t.length,r=[],i=t.map(e=>e.length?0:null),a=[],s=[],c=(e,n)=>{let r=t[e.list][e.i],i=t[n.list][n.i];return r===i?e.list<n.list:r<i},l=e=>t[e.list][e.i],u=(e,t,n={})=>r.push({phase:e,desc:t,heap:s.map(e=>({...e})),cursors:i.slice(),taken:a.map(e=>({...e})),popped:null,pushed:null,moved:[],done:!1,...n});function d(e){let t=[];for(;e>0;){let n=e-1>>1;if(!c(s[e],s[n]))break;[s[e],s[n]]=[s[n],s[e]],t.push(e,n),e=n}return t}function f(e){let t=[];for(;;){let n=2*e+1,r=2*e+2,i=e;if(n<s.length&&c(s[n],s[i])&&(i=n),r<s.length&&c(s[r],s[i])&&(i=r),i===e)break;[s[e],s[i]]=[s[i],s[e]],t.push(e,i),e=i}return t}let p=[];for(let e=0;e<n;e+=1)i[e]!==null&&(s.push({list:e,i:0}),p=p.concat(d(s.length-1)));let m=t.filter(e=>e.length).length,ee=t.reduce((e,t)=>e+t.length,0);if(s.length===0)return u(`init`,n===0?"`lists` 是个空数组，一条链表都没有，直接返回 ∅。":`${n} 条链表全是空的 —— 堆建起来是空的，直接返回 ∅。`,{moved:[],done:!0}),r;for(u(`init`,`把 ${m} 条链表的**头节点**放进小顶堆：${s.map(e=>`${o(e.list)} 的 ${l(e)}`).join(`、`)}。注意**只放头部**，每条链表后面那些节点还在原地等 —— 堆里现在只有 ${s.length} 个元素，不是 ${ee} 个。这是 O(N log K) 里那个 K 的来源。`,{moved:p});s.length;){let e=s[0],n=[],r=s.pop();s.length&&(s[0]=r,n.push(...f(0))),a.push({list:e.list,i:e.i});let c=e.list;i[c]=i[c]+1<t[c].length?i[c]+1:null;let p=null;i[c]!==null&&(p={list:c,i:i[c]},s.push(p),n.push(...d(s.length-1)));let m=p?`${o(c)} 前移一格，新头 ${l(p)} 入堆，堆里还是 ${s.length} 个元素。`:`${o(c)} 已经走完了，不再补位 —— 堆里只剩 ${s.length} 个元素。`;u(`take`,`堆顶是 ${l(e)}（来自 ${o(c)}）。出堆 → 接到结果尾部 → ${m}`,{popped:{...e},pushed:p?{...p}:null,moved:n})}let h=a.map(e=>l(e)).join(` → `);return u(`done`,`堆空了，说明每个节点都被取走且只被取走了一次 —— 一共 ${a.length} 轮，每轮最多两次堆操作（出堆 + 入堆），每次 O(log K)，所以是 O(N log K)。结果链表是 ${h}；开头那个哑结点只是锚点，返回 \`dummy.next\`。`,{done:!0}),r}var c=`mkl-styles`,l=52,u=40,d=74,f=58,p=15,m=26,ee=40,h=22,te=16,g=66,_=34,ne=36,v=40,y=28,re=168,ie=12,ae=46,b=22,oe=56,se=180,ce=1250,x=0,S=[`l0`,`l1`,`l2`,`l3`,`l4`,`l5`],C=e=>`mkl-${S[e%S.length]}`,le=`
/* 只有这块 SVG 的样式是 LC 23 专属的；容器 / 说明 / 控制条在外壳里
   （widgetChrome.js 的 .viz*），三个动画共用。 */
.mkl {
  --mkl-l0: #3f6b57;
  --mkl-l1: #a45f45;
  --mkl-l2: #3f5f8a;
  --mkl-l3: #7a5a9c;
  --mkl-l4: #8a6a2f;
  --mkl-l5: #2f7078;
  --mkl-edge: var(--text-secondary, #657168);
  --mkl-gold: #c89a46;
}
html.theme-dark .mkl {
  --mkl-l0: #8fb29c;
  --mkl-l1: #d18a6f;
  --mkl-l2: #8ab0d8;
  --mkl-l3: #b79ad6;
  --mkl-l4: #d9b063;
  --mkl-l5: #7fc3c8;
  --mkl-gold: #d9b063;
}
.mkl__svg { min-width: 560px; }

/* 每条链表一个色系：--c 是主色，--c-bg 是它的浅色底 */
.mkl-l0 { --c: var(--mkl-l0); --c-bg: rgba(63, 107, 87, 0.16); }
.mkl-l1 { --c: var(--mkl-l1); --c-bg: rgba(164, 95, 69, 0.16); }
.mkl-l2 { --c: var(--mkl-l2); --c-bg: rgba(63, 95, 138, 0.16); }
.mkl-l3 { --c: var(--mkl-l3); --c-bg: rgba(122, 90, 156, 0.16); }
.mkl-l4 { --c: var(--mkl-l4); --c-bg: rgba(138, 106, 47, 0.16); }
.mkl-l5 { --c: var(--mkl-l5); --c-bg: rgba(47, 112, 120, 0.16); }

.mkl-row-label {
  fill: var(--mkl-edge);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  transition: fill 0.26s ease, opacity 0.26s ease;
}
.mkl-row-label.is-live { fill: var(--c); }
.mkl-row-label.is-dead { opacity: 0.42; }

.mkl-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.26s ease, fill 0.26s ease, stroke-width 0.26s ease,
    opacity 0.26s ease;
}
.mkl-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  transition: opacity 0.26s ease;
}
/* 源链表：已取走的节点压暗；当前头部用本链表主色实线标出 */
.mkl-src.is-taken .mkl-node__box { opacity: 0.3; }
.mkl-src.is-taken .mkl-node__value { opacity: 0.4; }
.mkl-src.is-head .mkl-node__box {
  stroke: var(--c);
  stroke-width: 2.6;
  fill: var(--c-bg);
}

.mkl-edge__line { stroke: var(--mkl-edge); stroke-width: 1.8; stroke-linecap: round; }
.mkl-edge__head { fill: var(--mkl-edge); }
.mkl-redge { opacity: 0; transition: opacity 0.3s ease; }
.mkl-redge.is-on { opacity: 1; }

/* 行尾 ∅ */
.mkl-null__ring {
  fill: none;
  stroke: var(--mkl-edge);
  stroke-width: 1.4;
  stroke-dasharray: 4 3;
  transition: stroke 0.26s ease, opacity 0.26s ease;
}
.mkl-null__text {
  fill: var(--mkl-edge);
  font-size: 11px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  transition: fill 0.26s ease, opacity 0.26s ease;
}
/* 整条链表走完：行尾 ∅ 亮成本链表主色（加粗一点，细虚线在缩略尺寸下会糊成灰） */
.mkl-src.is-dead .mkl-null__ring { stroke: var(--c); stroke-width: 2.2; opacity: 1; }
.mkl-src.is-dead .mkl-null__text { fill: var(--c); opacity: 1; }
.mkl-src.is-dead .mkl-edge__line,
.mkl-src.is-dead .mkl-edge__head { opacity: 0.45; }

/* 哑结点：虚线框，明确它不是答案的一部分 */
.mkl-dummy__box {
  fill: none;
  stroke: var(--mkl-edge);
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
}
.mkl-dummy__text {
  fill: var(--mkl-edge);
  font-size: 10px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 堆 ───────────────────────────────────────────────────────────────── */
.mkl-heap__caption {
  fill: var(--text-secondary, #657168);
  font-size: 12px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
}
.mkl-hslot { transition: opacity 0.3s ease; }
.mkl-hslot.is-off { opacity: 0; }
.mkl-hnode__box {
  fill: var(--c-bg, rgba(101, 113, 104, 0.16));
  stroke: var(--c, #657168);
  stroke-width: 1.8;
  transition: stroke 0.26s ease, fill 0.26s ease, stroke-width 0.26s ease;
}
.mkl-hnode__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 本步动过的槽：加粗 + 着色，让「槽里换了个人」看得见 */
.mkl-hslot.is-moved .mkl-hnode__box { stroke-width: 3.6; }
.mkl-hslot.is-moved .mkl-hnode__value { fill: var(--c, #1f2a24); }
/* 堆顶：金边 + 一个「堆顶」小标 */
.mkl-hslot.is-root .mkl-hnode__box { stroke: var(--mkl-gold); stroke-width: 2.8; }
.mkl-heap__root-tag {
  fill: var(--mkl-gold);
  font-size: 10.5px;
  font-weight: 700;
  dominant-baseline: central;
  transition: opacity 0.3s ease;
}
.mkl-heap__root-tag.is-off { opacity: 0; }
.mkl-hedge__line { stroke: var(--mkl-edge); stroke-width: 1.5; stroke-linecap: round; }

/* 结果槽：出现前隐藏并下沉 10px，出现时上浮淡入 */
.mkl-rslot {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.mkl-rslot.is-filled { opacity: 1; transform: translateY(0); }
.mkl-rslot .mkl-node__box { fill: var(--c-bg); stroke: var(--c); }
.mkl-rslot.is-new .mkl-node__box { stroke-width: 2.8; }

.mkl-chip { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.mkl-chip__box { rx: 11; ry: 11; }
.mkl-chip__text {
  font-size: 11px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mkl-chip--tail .mkl-chip__box { fill: var(--mkl-gold); }
.mkl-chip--tail .mkl-chip__text { fill: #2a2113; }

@media (prefers-reduced-motion: reduce) {
  .mkl-chip, .mkl-rslot, .mkl-redge, .mkl-node__box, .mkl-node__value,
  .mkl-hnode__box, .mkl-hslot, .mkl-heap__root-tag, .mkl-null__ring, .mkl-row-label {
    transition: none;
  }
  .mkl-rslot { transform: none; }
}
`;function ue(){if(r(),document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=le,document.head.appendChild(e)}function de(e){let t=Math.floor(Math.log2(e+1));return{x:(e-(2**t-1)+.5)/2**t*re,y:t*ae}}function w(r,o={}){if(!r||r.dataset.mklMounted===`1`)return{destroy(){}};r.dataset.mklMounted=`1`,ue(),x+=1;let S=Array.isArray(o.lists)&&o.lists.length?o.lists:[[1,4],[2,5],[3,6],[0,7]],le=o.autoplay!==!1,w=s(S),fe=S.length,T=Math.max(1,fe),pe=S.reduce((e,t)=>Math.max(e,t.length),0),E=1+S.reduce((e,t)=>e+t.length,0),D=e=>f+e*d,me=e=>D(e)+l/2,O=e=>e<=0?f:f+(e-1)*d+l,k=e=>O(e)+m,he=T*g-(g-u),A=b+(Math.floor(Math.log2(T))*ae+y),j=Math.max(he,A),M=_+j+ne,ge=M+u+te+20,N=k(pe)+p,P=N+oe+se,_e=k(E)+p+12,F=Math.max(P+36,_e),I=Math.round((F-P)/2),L=I+N+oe,R=e=>L+ie+de(e).x,z=e=>_+Math.max(0,Math.round((j-A)/2))+b+de(e).y,B=document.createElement(`div`);B.className=`viz mkl`;let V=document.createElement(`div`);V.className=`viz__stage`,B.appendChild(V);let H=i(`svg`,{class:`viz__svg mkl__svg`,viewBox:`0 0 ${F} ${ge}`,role:`img`,"aria-label":`合并 ${fe} 个升序链表的小顶堆推演动画`});V.appendChild(H);function U(e,t,n,r,a){let o=i(`g`,{class:a});return o.appendChild(i(`line`,{class:`mkl-edge__line`,x1:t,y1:r,x2:n-9,y2:r})),o.appendChild(i(`path`,{class:`mkl-edge__head`,d:`M ${n} ${r} L ${n-9} ${r-5.5} L ${n-9} ${r+5.5} Z`})),e.appendChild(o),o}function ve(e,t,n){e.appendChild(i(`circle`,{class:`mkl-null__ring`,cx:t,cy:n,r:p}));let r=i(`text`,{class:`mkl-null__text`,x:t,y:n});r.textContent=`∅`,e.appendChild(r)}function ye(e,t,n,r,a){let o=i(`g`,{class:`mkl-node ${a}`});o.appendChild(i(`rect`,{class:`mkl-node__box`,x:n,y:r,width:l,height:u,rx:8}));let s=i(`text`,{class:`mkl-node__value`,x:n+l/2,y:r+u/2});return s.textContent=String(t),o.appendChild(s),e.appendChild(o),o}let be=S.map((e,t)=>{let n=_+t*g,r=n+u/2,a=i(`g`,{class:`mkl-src ${C(t)}`}),o=i(`text`,{class:`mkl-row-label`,x:I+f/2-6,y:r});o.textContent=String.fromCharCode(65+t),a.appendChild(o);let s=e.map((e,t)=>ye(a,e,I+f+t*d,n,``));for(let t=0;t<e.length-1;t+=1)U(a,I+f+t*d+l,I+f+(t+1)*d,r,``);return e.length>0&&U(a,I+O(e.length),I+k(e.length)-p,r,``),ve(a,I+k(e.length),r),H.appendChild(a),{g:a,labelEl:o,nodes:s,values:e}}),W=i(`g`,{class:`mkl-heap`});H.appendChild(W);let xe=i(`text`,{class:`mkl-heap__caption`,x:L+ie+re/2,y:_+Math.max(0,Math.round((j-A)/2))+b/2});W.appendChild(xe);let Se=[];for(let e=1;e<T;e+=1){let t=e-1>>1,n=i(`g`,{class:`mkl-hedge`});n.appendChild(i(`line`,{class:`mkl-hedge__line`,x1:R(t),y1:z(t)+y,x2:R(e),y2:z(e)})),W.appendChild(n),Se.push({g:n,child:e})}let Ce=[];for(let e=0;e<T;e+=1){let t=i(`g`,{class:`mkl-hslot is-off`});t.appendChild(i(`rect`,{class:`mkl-hnode__box`,x:R(e)-v/2,y:z(e),width:v,height:y,rx:7}));let n=i(`text`,{class:`mkl-hnode__value`,x:R(e),y:z(e)+y/2});t.appendChild(n),W.appendChild(t),Ce.push({g:t,textEl:n})}let G=i(`text`,{class:`mkl-heap__root-tag`,x:R(0)+v/2+24,y:z(0)+y/2});G.textContent=`堆顶`,W.appendChild(G);let K=i(`g`,{class:`mkl-result`});H.appendChild(K);let q=M+u/2,we=i(`text`,{class:`mkl-row-label`,x:26,y:q});we.textContent=`结果`,K.appendChild(we);let J=i(`g`,{class:`mkl-dummy`});J.appendChild(i(`rect`,{class:`mkl-dummy__box`,x:D(0),y:M,width:l,height:u,rx:8}));let Te=i(`text`,{class:`mkl-dummy__text`,x:me(0),y:q});Te.textContent=`dummy`,J.appendChild(Te),K.appendChild(J);let Ee=[];for(let e=1;e<E;e+=1)Ee.push(U(K,D(e-1)+l,D(e),q,`mkl-redge`));ve(K,k(E),q);let De=U(K,O(E),k(E)-p,q,`mkl-redge`),Oe=w[w.length-1].taken.map((e,t)=>ye(K,S[e.list][e.i],D(t+1),M,`mkl-rslot ${C(e.list)}`)),Y=i(`g`,{class:`mkl-chip mkl-chip--tail`});Y.appendChild(i(`rect`,{class:`mkl-chip__box`,x:-40/2,y:-22/2,width:ee,height:h}));let ke=i(`text`,{class:`mkl-chip__text`,x:0,y:0});ke.textContent=`tail`,Y.appendChild(ke),K.appendChild(Y);let X=document.createElement(`p`);X.className=`viz__desc`,X.setAttribute(`aria-live`,`polite`),B.appendChild(X);let Z=a();B.appendChild(Z.root),r.textContent=``,r.appendChild(B);let Q=null;function Ae(t,n){let r=n.heap.length,i=new Set(n.moved);be.forEach((e,t)=>{let r=n.cursors[t];e.g.classList.toggle(`is-dead`,r===null),e.labelEl.classList.toggle(`is-live`,r!==null),e.labelEl.classList.toggle(`is-dead`,r===null),e.nodes.forEach((e,t)=>{e.classList.toggle(`is-taken`,r===null||t<r),e.classList.toggle(`is-head`,r===t)})}),Ce.forEach((e,t)=>{if(t>=r){e.g.setAttribute(`class`,`mkl-hslot is-off`);return}let a=n.heap[t];e.textEl.textContent=String(S[a.list][a.i]),e.g.setAttribute(`class`,`mkl-hslot ${C(a.list)}${i.has(t)?` is-moved`:``}`+(t===0?` is-root`:``))}),Se.forEach(e=>{e.g.style.display=e.child<r?``:`none`}),xe.textContent=r===0?`堆：空了 —— 全部节点已取出`:`堆：只有 ${r} 个候选（每条链表当前的头部）`,G.classList.toggle(`is-off`,r===0);let a=n.phase===`take`?n.taken.length:1/0;Oe.forEach((e,t)=>{let r=t+1,i=r<=n.taken.length;e.classList.toggle(`is-filled`,i),e.classList.toggle(`is-new`,i&&r>=a)}),Ee.forEach((e,t)=>e.classList.toggle(`is-on`,t+1<=n.taken.length)),De.classList.toggle(`is-on`,n.done);let o=Math.min(n.taken.length,E-1);Y.style.transform=`translate(${me(o)}px, ${M+u+te}px)`,e(X,n.desc)}let $=n({steps:w,controls:Z,intervalMs:ce,onRender:Ae});$.jumpTo(Math.trunc(o.initialStep)||0);let je=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return le&&!je&&typeof IntersectionObserver==`function`&&(Q=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){Q.disconnect(),Q=null,$.play();return}},{threshold:.35}),Q.observe(B)),{destroy(){Q&&=(Q.disconnect(),null),$.destroy(),r.textContent=``,delete r.dataset.mklMounted,--x,x<=0&&(document.getElementById(c)?.remove(),t())}}}export{w as default,w as mountMergeKLists};