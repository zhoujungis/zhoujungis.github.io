import{a as e,i as t,n,r,s as i,t as a}from"./widgetChrome-CsVdkvMb.js";function o(e,t){let n=[],r=0,i=0;for(;r<e.length&&i<t.length;)e[r]<=t[i]?(n.push(e[r]),r+=1):(n.push(t[i]),i+=1);for(;r<e.length;)n.push(e[r++]);for(;i<t.length;)n.push(t[i++]);return n}var s=e=>e.length?e.join(`、`):`∅`;function c(e){let t=(Array.isArray(e)?e:[]).map(e=>Array.isArray(e)?e.slice():[]),n=t.length,r=[],i=t.reduce((e,t)=>e+t.length,0),a=e=>e.map(e=>({lists:e.lists.map(e=>e.slice()),from:e.from?e.from.map(e=>[e[0],e[1]]):null}));if(n===0)return r.push({phase:`init`,desc:"`lists` 是个空数组，一条链表都没有，直接返回 ∅。",levels:[],activeLevel:-1,rounds:0,done:!0}),r;let c=[{lists:t.map(e=>e.slice()),from:null}];if(n===1)return r.push({phase:`init`,desc:`只有 1 条链表，**一次合并都不用做** —— 分治的轮数是 ⌈log₂1⌉ = 0，直接返回它自己（${s(t[0])}）。`,levels:a(c),activeLevel:0,rounds:0,done:!0}),r;r.push({phase:`init`,desc:`分治的起手：${n} 条链表一字排开，一共 ${i} 个节点。接下来每一轮**两两配对合并**，链表条数每次减半 —— ${n} → ${Math.ceil(n/2)} → … → 1，一共 ⌈log₂${n}⌉ = ${Math.ceil(Math.log2(n))} 轮。`,levels:a(c),activeLevel:0,rounds:0,done:!1});let l=t,u=0;for(;l.length>1;){let e=[],t=[];for(let n=0;n<l.length;n+=2)n+1<l.length?(e.push(o(l[n],l[n+1])),t.push([n,n+1])):(e.push(l[n].slice()),t.push([n,-1]));u+=1,c.push({lists:e,from:t});let n=l.length,i=e.length,s=t.reduce((e,[t,n])=>e+(n>=0?l[t].length+l[n].length:0),0),d=t.filter(e=>e[1]>=0).length,f=t.find(e=>e[1]<0);r.push({phase:`merge`,desc:`第 ${u} 轮：把 ${n} 条两两配对，做 ${d} 次「合并两个有序链表」，得到 ${i} 条。本轮被摸到的节点一共 ${s} 个，不超过 N —— 每轮都是 O(N) 的工作量。`+(f?`注意第 ${f[0]+1} 条这轮**轮空**了，原样进下一轮（不是丢掉）。`:`链表条数 ${n} → ${i}。`),levels:a(c),activeLevel:c.length-1,rounds:u,done:!1}),l=e}return r.push({phase:`done`,desc:`一共 ${u} 轮，每轮 O(N)，所以总时间是 **O(N log K)** —— 和最小堆同阶。结果链表是 ${s(l[0])}。分治的隐藏优势：它不需要堆，每一轮都是纯粹的指针比较，常数更小。`,levels:a(c),activeLevel:c.length-1,rounds:u,done:!0}),r}var l=`mkc-styles`,u=44,d=36,f=18,p=38,m=68,h=76,g=34,_=54,v=30,y=1400,b=0,x=`
.mkc {
  --mkc-lv1: #3f6b57;
  --mkc-lv2: #a45f45;
  --mkc-lv3: #3f5f8a;
  --mkc-lv4: #7a5a9c;
  --mkc-edge: var(--text-secondary, #657168);
  --mkc-accent: var(--accent, #3f6b57);
}
html.theme-dark .mkc {
  --mkc-lv1: #8fb29c;
  --mkc-lv2: #d18a6f;
  --mkc-lv3: #8ab0d8;
  --mkc-lv4: #b79ad6;
}
.mkc__svg { min-width: 560px; }

/* 每一层一个色系：输入层是中性灰，之后逐轮换色，方便对着连线读 */
.mkc-lv0 { --c: var(--mkc-edge); --c-bg: transparent; }
.mkc-lv1 { --c: var(--mkc-lv1); --c-bg: rgba(63, 107, 87, 0.16); }
.mkc-lv2 { --c: var(--mkc-lv2); --c-bg: rgba(164, 95, 69, 0.16); }
.mkc-lv3 { --c: var(--mkc-lv3); --c-bg: rgba(63, 95, 138, 0.16); }
.mkc-lv4 { --c: var(--mkc-lv4); --c-bg: rgba(122, 90, 156, 0.16); }

.mkc-row-label {
  fill: var(--c, var(--mkc-edge));
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
}
.mkc-row-count {
  fill: var(--mkc-edge);
  font-size: 11.5px;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mkc-row.is-hidden { opacity: 0; }
.mkc-row { transition: opacity 0.32s ease; }
/* 本步刚出现的那一层：右侧「N 条」跟着层色亮起来 */
.mkc-row.is-active .mkc-row-count { fill: var(--c); font-weight: 700; }

.mkc-node__box {
  fill: var(--surface, #fff);
  stroke: var(--c, var(--glass-border, #dce2da));
  stroke-width: 1.6;
  transition: stroke 0.26s ease, fill 0.26s ease, stroke-width 0.26s ease;
}
.mkc-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 14px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mkc-lv0 .mkc-node__box { fill: var(--surface, #fff); }
.mkc-node { transition: opacity 0.3s ease; }
/* 刚合并出来的那一层：整层做一次入场（下沉淡入） */
.mkc-node.is-new {
  opacity: 0;
  animation: mkc-pop 0.36s ease forwards;
}
@keyframes mkc-pop {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 配对连线 */
.mkc-link__line {
  stroke: var(--mkc-edge);
  stroke-width: 1.4;
  fill: none;
  opacity: 0.35;
  transition: opacity 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease;
}
.mkc-link.is-on .mkc-link__line {
  stroke: var(--mkc-accent);
  stroke-width: 2;
  opacity: 0.85;
}
.mkc-link { transition: opacity 0.3s ease; }
.mkc-link.is-hidden { opacity: 0; }

.mkc-null__ring {
  fill: none;
  stroke: var(--mkc-edge);
  stroke-width: 1.3;
  stroke-dasharray: 4 3;
}
.mkc-null__text {
  fill: var(--mkc-edge);
  font-size: 10px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

@media (prefers-reduced-motion: reduce) {
  .mkc-node.is-new { animation: none; opacity: 1; }
  .mkc-row, .mkc-link, .mkc-link__line, .mkc-node__box { transition: none; }
}
`;function S(){if(r(),document.getElementById(l))return;let e=document.createElement(`style`);e.id=l,e.textContent=x,document.head.appendChild(e)}var C=e=>`mkc-lv${Math.min(e,4)}`;function w(r,o={}){if(!r||r.dataset.mkcMounted===`1`)return{destroy(){}};r.dataset.mkcMounted=`1`,S(),b+=1;let s=Array.isArray(o.lists)&&o.lists.length?o.lists:[[7],[2],[5],[1],[8],[3],[6],[4]],x=o.autoplay!==!1,w=c(s),T=w[w.length-1].levels,E=T.map(e=>{let t=[],n=m;for(let r of e.lists){let e=r.length?r.length*u+(r.length-1)*f:v;t.push({x:n,w:e,values:r}),n+=e+p}return{items:t,width:t.length?n-p:m,top:g}});E.forEach((e,t)=>{e.top=g+t*h});let D=E.reduce((e,t)=>Math.max(e,t.width),m)+_,O=g+(E.length-1)*h+d+26,k=(e,t)=>{let n=E[e].items[t];return n?n.x+n.w/2:m},A=document.createElement(`div`);A.className=`viz mkc`;let j=document.createElement(`div`);j.className=`viz__stage`,A.appendChild(j);let M=i(`svg`,{class:`viz__svg mkc__svg`,viewBox:`0 0 ${D} ${O}`,role:`img`,"aria-label":`合并 ${s.length} 个升序链表的分治推演动画`});j.appendChild(M);let N=[];for(let e=1;e<E.length;e+=1)(T[e].from||[]).forEach((t,n)=>{let[r,a]=t,o=E[e-1].top+d,s=E[e].top,c=k(e,n),l=i(`g`,{class:`mkc-link ${C(e)}`});if(a<0)l.appendChild(i(`line`,{class:`mkc-link__line`,x1:k(e-1,r),y1:o,x2:c,y2:s}));else for(let t of[r,a]){let n=k(e-1,t);l.appendChild(i(`path`,{class:`mkc-link__line`,d:`M ${n} ${o} C ${n} ${o+22}, ${c} ${s-22}, ${c} ${s}`}))}M.appendChild(l),N.push({g:l,level:e})});let P=[];E.forEach((e,t)=>{let n=i(`g`,{class:`mkc-row ${C(t)}`}),r=e.top+d/2,a=i(`text`,{class:`mkc-row-label`,x:m-16,y:r});a.textContent=t===0?`输入`:`第 ${t} 轮`,n.appendChild(a);let o=i(`text`,{class:`mkc-row-count`,x:e.width+14,y:r});o.textContent=`${e.items.length} 条`,n.appendChild(o);let s=[];e.items.forEach(t=>{if(!t.values.length){n.appendChild(i(`circle`,{class:`mkc-null__ring`,cx:t.x+v/2,cy:r,r:11}));let e=i(`text`,{class:`mkc-null__text`,x:t.x+v/2,y:r});e.textContent=`∅`,n.appendChild(e);return}t.values.forEach((a,o)=>{let c=t.x+o*62,l=i(`g`,{class:`mkc-node`});l.appendChild(i(`rect`,{class:`mkc-node__box`,x:c,y:e.top,width:u,height:d,rx:7}));let f=i(`text`,{class:`mkc-node__value`,x:c+u/2,y:r});f.textContent=String(a),l.appendChild(f),n.appendChild(l),s.push(l)})}),M.appendChild(n),P.push({g:n,nodes:s,countEl:o,level:t})});let F=document.createElement(`p`);F.className=`viz__desc`,F.setAttribute(`aria-live`,`polite`),A.appendChild(F);let I=a();A.appendChild(I.root),r.textContent=``,r.appendChild(A);let L=null;function R(t,n){let r=n.levels.length;P.forEach(e=>{e.g.classList.toggle(`is-hidden`,e.level>=r),e.g.classList.toggle(`is-active`,e.level===n.activeLevel),e.nodes.forEach(t=>{t.classList.toggle(`is-new`,e.level===n.activeLevel&&n.phase!==`init`)}),e.level<r&&(e.countEl.textContent=`${n.levels[e.level].lists.length} 条`)}),N.forEach(e=>{e.g.classList.toggle(`is-hidden`,e.level>=r),e.g.classList.toggle(`is-on`,e.level===n.activeLevel)}),e(F,n.desc)}let z=n({steps:w,controls:I,intervalMs:y,onRender:R});z.jumpTo(Math.trunc(o.initialStep)||0);let B=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return x&&!B&&typeof IntersectionObserver==`function`&&(L=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){L.disconnect(),L=null,z.play();return}},{threshold:.35}),L.observe(A)),{destroy(){L&&=(L.disconnect(),null),z.destroy(),r.textContent=``,delete r.dataset.mkcMounted,--b,b<=0&&(document.getElementById(l)?.remove(),t())}}}export{w as default,w as mountMergeKDCLists};