import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=6;function o(e={}){let t=Number.isInteger(e.n)&&e.n>=2?e.n:a,n=[],r=new Map,i=0,o=(e,t,a)=>{let s=r.get(e)||0;r.set(e,s+1);let c=e<2;c&&(i+=1),n.push({idx:n.length,value:e,depth:t,path:a,dup:s>0,leaf:c,ord:s,distinct:r.size}),e>=2&&(o(e-1,t+1,a+`L`),o(e-2,t+1,a+`R`))};o(t,0,``);let s=[],c=0;for(let e of n)e.dup&&(c+=1),s.push({phase:`call`,n:t,node:e,revealed:n.slice(0,e.idx+1),stackPath:e.path,calls:e.idx+1,dupCalls:c,distinct:e.distinct,answer:null,done:!1,desc:``});s.push({phase:`done`,n:t,node:null,revealed:n.slice(),stackPath:``,calls:n.length,dupCalls:c,distinct:r.size,leaves:i,answer:null,done:!0,desc:``});for(let e=0;e<s.length;e+=1){let a=s[e];if(a.phase===`done`){a.desc=`整棵递归树 ${n.length} 个节点、${i} 个叶子（叶子数 = ways(${t})）。其中只有 ${r.size} 个不同的 k —— f(2) 被从头算了 ${r.get(2)||0} 次，f(0) ${r.get(0)||0} 次。记忆化之后，同样的信息只需要 ${t+1} 个格子、${t+1} 次加法。`;continue}let{value:o,depth:c,dup:l,idx:u,ord:d}=a.node;a.desc=l?`第 ${u+1} 次调用 f(${o}) —— 这是第 ${d+1} 次算它，前 ${d} 次全白算：它下面挂着一整棵相同的子树，每次都要重长一遍。`:`第 ${u+1} 次调用 f(${o})（深度 ${c}）。`+(o>=2?`它要先等 f(${o-1}) 和 f(${o-2}) 回来。`:`叶子：直接返回 1。`)}return s}var s=`climbrec-styles`,c=620,l=`
.climbrec { display: flex; flex-direction: column; gap: 14px; }
.climbrec__svg { width: 100%; height: auto; display: block; }

.climbrec-note {
  fill: var(--climbrec-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.climbrec-banner__box {
  fill: var(--climbrec-banner, #f4f3ef);
  stroke: var(--climbrec-line, #c3c9c2);
  stroke-width: 1.5;
}
.climbrec-banner__seg {
  fill: var(--climbrec-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climbrec-banner__val {
  fill: var(--climbrec-bad, #b3452e);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.climbrec-edge {
  stroke: var(--climbrec-line, #c3c9c2);
  stroke-width: 1.5;
  fill: none;
}
.climbrec-edge.is-on { stroke: var(--climbrec-dim2, #aab3ab); }

.climbrec-node__circle {
  fill: var(--climbrec-fill, #ffffff);
  stroke: var(--climbrec-line, #c3c9c2);
  stroke-width: 1.5;
  opacity: 0;
}
.climbrec-node__text {
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.climbrec-node.is-on .climbrec-node__circle { opacity: 1; }
.climbrec-node.is-on .climbrec-node__text { opacity: 1; }
/* 首次出现的值：绿 */
.climbrec-node.is-new .climbrec-node__circle {
  stroke: var(--climbrec-ok, #3f6b57);
  fill: var(--climbrec-ok-fill, #eef5f1);
}
.climbrec-node.is-new .climbrec-node__text { fill: var(--climbrec-ok, #3f6b57); }
/* 重复子问题：红 —— 这张图的主角 */
.climbrec-node.is-dup .climbrec-node__circle {
  stroke: var(--climbrec-bad, #b3452e);
  stroke-width: 2.5;
  fill: var(--climbrec-bad-fill, #f9ece8);
}
.climbrec-node.is-dup .climbrec-node__text { fill: var(--climbrec-bad, #b3452e); }
/* 本帧的主角：橙 + 外环（外环挂在 labelLayer，不在节点的 g 里，所以用 .is-on 单独控制） */
.climbrec-node.is-cur .climbrec-node__circle { stroke: var(--climbrec-hot, #a45f45); stroke-width: 3.5; }
.climbrec-node__ring {
  opacity: 0;
  fill: none;
  stroke: var(--climbrec-hot, #a45f45);
  stroke-width: 2;
  stroke-dasharray: 4 3;
}
.climbrec-node__ring.is-on { opacity: 1; }

.climbrec-stats {
  fill: var(--climbrec-ink, #1f2a24);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.climbrec-stack {
  fill: var(--climbrec-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.climbrec-phase__text {
  fill: var(--climbrec-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function u(){if(document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=l,document.head.appendChild(e)}function d(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function f(e){let t=[],n=0,r=(e,i,a)=>{let o=t.length;return t.push({idx:o,value:e,depth:i,parent:a,x:0,y:0,col:null}),e>=2?(r(e-1,i+1,o),r(e-2,i+1,o)):(t[o].col=n,n+=1),o};r(e,0,-1);let i=e=>{let n=t[e];if(n.col!==null)return n.col;let r=t.filter(t=>t.parent===e);return n.col=(i(r[0].idx)+i(r[1].idx))/2,n.col};i(0);let a=n,o=Math.max(30,Math.min(48,620/a)),s=Math.min(70,340/Math.max(1,Math.max(...t.map(e=>e.depth)))),c=Math.max(11,Math.min(17,o/2.9));for(let e of t)e.x=30+e.col*o+o/2,e.y=108+e.depth*s;return{nodes:t,W:680,R:c,treeBottom:108+Math.max(...t.map(e=>e.depth))*s+c,leafCount:a,LEAF_STEP:o}}function p(a,l={}){if(!a||a.dataset.climbRecMounted===`1`)return{destroy(){}};a.dataset.climbRecMounted=`1`,u();let p=o(l),m=p[0],h=f(m.n),g=new Map(h.nodes.map(e=>[e.idx,e])),_=h.W,v=h.treeBottom+34,y=v+26,b=y+30,x=b+22,S=document.createElement(`div`);S.className=`viz climbrec`;let C=document.createElement(`div`);C.className=`viz__stage`,S.appendChild(C);let w=d(),T=r,E=T(`svg`,{class:`viz__svg climbrec__svg`,viewBox:`0 0 ${_} ${x}`,role:`img`,"aria-label":`爬楼梯 朴素递归树展开动画`}),D=T(`g`,{class:`climbrec-edges`}),O=T(`g`,{class:`climbrec-nodes`}),k=T(`g`,{class:`climbrec-labels`});E.appendChild(D),E.appendChild(O),E.appendChild(k),C.appendChild(E);let A=T(`text`,{class:`climbrec-note`,x:30,y:22});A.textContent=`f(k) = f(k-1) + f(k-2)，不带记忆化 —— 前序 DFS 的真实执行顺序`,k.appendChild(A),k.appendChild(T(`rect`,{class:`climbrec-banner__box`,x:30,y:38,width:_-60,height:40,rx:9}));let j=T(`text`,{class:`climbrec-banner__seg`,x:46,y:58}),M=T(`text`,{class:`climbrec-banner__seg`,x:176,y:58}),N=T(`text`,{class:`climbrec-banner__val`,x:_-46,y:58});k.appendChild(j),k.appendChild(M),k.appendChild(N);let P=h.nodes.map(e=>{let t=T(`path`,{class:`climbrec-edge`,d:``});return D.appendChild(t),t}),F=h.nodes.map(e=>{let t=T(`g`,{class:`climbrec-node`}),n=T(`circle`,{class:`climbrec-node__circle`,cx:e.x,cy:e.y,r:h.R}),r=T(`text`,{class:`climbrec-node__text`,x:e.x,y:e.y,style:`font-size: ${Math.round(h.R*1.15)}px`});r.textContent=String(e.value);let i=T(`circle`,{class:`climbrec-node__ring`,cx:e.x,cy:e.y,r:h.R+5});return t.appendChild(n),t.appendChild(r),O.appendChild(t),i.remove(),k.appendChild(i),{g:t,circle:n,text:r,ring:i}}),I=T(`text`,{class:`climbrec-stats`,x:_/2,y:v});k.appendChild(I);let L=T(`text`,{class:`climbrec-stack`,x:30,y});k.appendChild(L);let R=T(`text`,{class:`climbrec-phase__text`,x:_/2,y:b});k.appendChild(R);function z(t,n){if(!n)return;let r=n.phase===`done`,i=n.node;P.forEach((e,t)=>{let r=h.nodes[t],i=r.parent>=0&&n.revealed.length>r.parent,a=n.revealed.length>t;if(e.classList.toggle(`is-on`,i&&a),i&&a){let t=g.get(r.parent);e.setAttribute(`d`,`M ${t.x} ${t.y+h.R} L ${r.x} ${r.y-h.R}`)}}),F.forEach((e,t)=>{let r=n.revealed.length>t,a=[`climbrec-node`];if(r){a.push(`is-on`);let e=n.revealed[t];a.push(e.dup?`is-dup`:`is-new`),i&&t===i.idx&&a.push(`is-cur`)}e.g.setAttribute(`class`,a.join(` `)),e.ring.classList.remove(`is-on`)}),i&&F[i.idx].ring.classList.add(`is-on`);let a=I;if(a.textContent=`已调用 ${n.calls} 次，其中重复 ${n.dupCalls} 次，不同的 k 只有 ${n.distinct} 个`,i){let e=[m.n],t=m.n;for(let n of i.path)t+=n===`L`?-1:-2,e.push(t);L.textContent=`调用栈：${e.join(` -> `)}`,L.setAttribute(`opacity`,`1`)}else L.setAttribute(`opacity`,`0`);r?(j.textContent=`f(${m.n}) 展开`,M.textContent=`${n.calls} 个节点里只有 ${n.distinct} 个不同的 k`,N.textContent=`重复 ${n.dupCalls} 次`):(j.textContent=`第 ${n.calls} 次调用`,M.textContent=i&&i.dup?`f(${i.value}) 是重复子问题`:`f(${i?i.value:``}) 第一次出现`,N.textContent=`重复 ${n.dupCalls} 次`),R.textContent=r?`加一个 memo 数组，同样的信息只需要 n+1 个格子 —— 这就是从 2^n 到 O(n) 的全部内容。`:`每棵重复的子树都要从头重长一遍 —— 计数是乘性的，这就是 2^n 的来源。`,e(w,n.desc)}S.appendChild(w);let B=i();S.appendChild(B.root),a.textContent=``,a.appendChild(S),n();let V=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,H=t({steps:p,controls:B,intervalMs:c,onRender:(e,t)=>z(e,t)});H.jumpTo(Math.trunc(l.initialStep)||0);let U=null;return l.autoplay!==!1&&!V&&typeof IntersectionObserver==`function`&&(U=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){U.disconnect(),U=null,H.play();return}},{threshold:.35}),U.observe(S)),{destroy(){U&&=(U.disconnect(),null),H.destroy(),a.textContent=``,delete a.dataset.climbRecMounted,document.getElementById(s)?.remove()}}}function m(e,t={}){return p(e,t)}export{m as mountClimbRec};