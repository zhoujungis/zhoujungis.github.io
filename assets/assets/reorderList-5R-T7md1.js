import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";function a(e){if(e<=0)return null;let t=0,n=1;for(;n<e&&n+1<e;)t+=1,n+=2;return t}function o(e,t){let n=[],r=e,i=new Set;for(;r!=null&&!i.has(r);)i.add(r),n.push(r),r=t[r];return n}function s(e){let t=e.length,n=[];for(let r=0;r<Math.floor(t/2);r+=1)n.push(e[r],e[t-1-r]);return t%2==1&&n.push(e[Math.floor(t/2)]),n}function c(e){let t=e.length,n=Array.from({length:t},(e,n)=>n+1<t?n+1:null),r=t=>t===null?`∅`:String(e[t]),i=[],c=(e,t,r={})=>i.push({phase:e,stage:0,desc:t,links:[...n],merged:[],front:[],back:[],chips:[],cutEdge:null,done:!1,...r}),l=(e,t)=>o(e,n).filter(e=>!t.includes(e));if(t<=1)return c(`init`,t===0?`空链表，没什么可重排的。`:`只有一个节点，重排之后还是它自己 —— 直接返回。`,{front:o(0,n)}),i[0].done=!0,i;c(`init`,`目标：前半段顺序不变，后半段倒过来插进缝隙 —— 也就是要把 ${e.join(` → `)} 变成 ${s(e).join(` → `)}。全程只改指针，一个值都不动。`,{front:o(0,n)});let u=a(t),d=0,f=1,p=0;for(;f<t&&f+1<t;)d+=1,f+=2,p+=1,c(`mid`,`① 快慢指针找中点（第 ${p} 步）：\`fast\` 一次跨两格到 ${r(f<t?f:null)}，\`slow\` 一次挪一格到 ${r(d)}。`+(d===u?` \`fast\` 走不动了 —— \`slow\` 停在 **${r(d)}**，正是前半段的最后一个节点。`:``),{stage:1,front:o(0,n),chips:[{kind:`slow`,label:`slow`,slot:d},{kind:`fast`,label:`fast`,slot:f<t?f:null}]});let m=u+1;n[u]=null,c(`split`,`② **\`slow.next = None\`** —— 断开。这一步看着多余，其实是防环的命门：前半段的尾巴要是还搭在后半段上，第 ③ 步合并时指针会绕成环，链表再也走不到头。现在前段是 ${e.slice(0,u+1).map(String).join(` → `)}，后段是 ${e.slice(m).map(String).join(` → `)}。`,{stage:2,front:o(0,n),back:o(m,n),cutEdge:[u,m]});let h=null,g=m;for(;g!==null;){let e=n[g];n[g]=h;let t=g;h=g,g=e,c(`rev`,g===null?`反转最后一步：\`${r(t)}.next\` 指向 ${r(n[t])}，后半段变成 ${o(h,n).map(r).join(` → `)}。这是 LC 206 的逐字复刻，只是起点换成了 \`second\`。`:`反转后半段：\`${r(t)}.next\` 掉头指向 ${r(n[t])}，\`prev\` 前移到 ${r(h)}，\`curr\` 前移到 ${r(g)}。`,{stage:2,front:o(0,n),back:o(h,n).concat(o(g,n)),chips:[{kind:`prev`,label:`prev`,slot:h},{kind:`curr`,label:`curr`,slot:g}]})}let _=0,v=h,y=[];for(;v!==null;){let e=n[_],t=n[v];n[_]=v,y.push(_,v),c(`merge`,`③ \`first.next = second\`：\`${r(_)}\` 的箭头改指向 ${r(v)}，把后半段的头节点拽了上来。\`t1\`(\`${r(e)}\`) 和 \`t2\`(\`${r(t)}\`) 提前记住了两条链的下家 —— 改指针之前先把路记住，和反转链表里那个 \`nxt\` 是同一个道理。`,{stage:3,merged:[...y],front:l(e,y),back:l(t,y),chips:[{kind:`first`,label:`first`,slot:_},{kind:`second`,label:`second`,slot:v}]}),n[v]=e,c(`merge`,t===null?`③ \`second.next = t1\`：\`${r(v)}\` 接回 ${r(e)}。后半段用完了（\`second\` 变成 ∅），循环结束 —— 条件写的是 \`while second\`，因为后半段更短。`:`③ \`second.next = t1\`：\`${r(v)}\` 接回 ${r(e)}。两个指针各自前移：\`first\` → ${r(e)}，\`second\` → ${r(t)}。`,{stage:3,merged:[...y],front:l(e,y),back:l(t,y),chips:[{kind:`first`,label:`first`,slot:e},{kind:`second`,label:`second`,slot:t}]}),_=e,v=t}let b=o(0,n);return c(`done`,`重排完成：${b.map(r).join(` → `)}。**头节点还是原来的 ${r(0)}** —— 所以这题不需要返回新头，Java 的签名就是 \`void\`。`,{stage:3,merged:b}),i[i.length-1].done=!0,i}var l=`rord-styles`,u=64,d=48,f=44,p=44,m=118,h=218,g=-26,_=44,v=58,y=26,b=62,x=1250,S=[`① 找中点`,`② 断开并反转`,`③ 交替合并`],C=`
.rord {
  --rord-node: var(--text-primary, #1f2a24);
  --rord-edge: var(--text-secondary, #657168);
  --rord-a: var(--accent, #3f6b57);
  --rord-b: var(--accent-secondary, #a45f45);
  --rord-done: var(--accent, #3f6b57);
}
html.theme-dark .rord {
  --rord-b: #e0a06a;
  --rord-a: #7fc3a4;
}
.rord__svg { min-width: 520px; }

.rord-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.24s ease;
}
.rord-node__value {
  fill: var(--rord-node);
  font-size: 18px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rord-node.is-merged .rord-node__box { stroke: var(--rord-done); stroke-width: 2; }

/* 节点整体位移：重排的"动感"全靠它 */
.rord-node { transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1); }

.rord-edge__line { stroke: var(--rord-edge); stroke-width: 1.8; stroke-linecap: round; fill: none; }
.rord-edge__head { fill: var(--rord-edge); }
.rord-edge--merged .rord-edge__line { stroke: var(--rord-done); }
.rord-edge--merged .rord-edge__head { fill: var(--rord-done); }
.rord-edge--cut .rord-edge__line {
  stroke: var(--rord-edge);
  stroke-dasharray: 4 4;
  opacity: 0.45;
}

.rord-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 3 3;
}
.rord-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  text-anchor: middle;
  dominant-baseline: central;
}

/* 顶部阶段条 */
.rord-stage__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.2;
  transition: fill 0.24s ease, stroke 0.24s ease;
}
.rord-stage__text {
  fill: var(--text-secondary, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  transition: fill 0.24s ease;
}
.rord-stage.is-on .rord-stage__box { fill: var(--rord-done); stroke: var(--rord-done); }
.rord-stage.is-on .rord-stage__text { fill: #fff; }

.rord-chip { transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; }
.rord-chip__box { rx: 13; ry: 13; }
.rord-chip__text {
  font-size: 12.5px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rord-chip--slow .rord-chip__box,
.rord-chip--prev .rord-chip__box,
.rord-chip--first .rord-chip__box { fill: var(--rord-a); }
.rord-chip--fast .rord-chip__box,
.rord-chip--curr .rord-chip__box,
.rord-chip--second .rord-chip__box { fill: var(--rord-b); }
.rord-chip__text { fill: #fff; }
@media (prefers-reduced-motion: reduce) {
  .rord-node, .rord-chip, .rord-stage__box, .rord-node__box { transition: none; }
}
`;function w(){if(n(),document.getElementById(l))return;let e=document.createElement(`style`);e.id=l,e.textContent=C,document.head.appendChild(e)}function T(n,a={}){if(!n||n.dataset.rordMounted===`1`)return{destroy(){}};n.dataset.rordMounted=`1`,w();let o=Array.isArray(a.values)&&a.values.length?a.values:[1,2,3,4],s=a.autoplay!==!1,C=c(o),T=o.length,E=Math.max(T,1),D=e=>p+e*108,O=2*p+E*u+(E-1)*f,k=O+b,A=O+b/2,j=e=>e+d/2,M=document.createElement(`div`);M.className=`viz rord`;let N=document.createElement(`div`);N.className=`viz__stage`,M.appendChild(N);let P=r(`svg`,{class:`viz__svg rord__svg`,viewBox:`0 0 ${k} 322`,role:`img`,"aria-label":`重排链表推演动画：${o.join(` → `)}`});N.appendChild(P);let F=[],I=Math.min(150,(k-2*p-32)/3),L=(k-(3*I+32))/2;S.forEach((e,t)=>{let n=r(`g`,{class:`rord-stage`}),i=L+t*(I+16);n.appendChild(r(`rect`,{class:`rord-stage__box`,x:i,y:_-15,width:I,height:30,rx:15}));let a=r(`text`,{class:`rord-stage__text`,x:i+I/2,y:_});a.textContent=e,n.appendChild(a),P.appendChild(n),F.push(n)}),P.appendChild(r(`circle`,{class:`rord-null__ring`,cx:A,cy:j(m),r:15}));let R=r(`text`,{class:`rord-null__text`,x:A,y:j(m)});R.textContent=`∅`,P.appendChild(R);let z=r(`g`,{class:`rord-edges`});P.appendChild(z);let B=[];for(let e=0;e<T;e+=1){let t=r(`g`,{class:`rord-node`});t.appendChild(r(`rect`,{class:`rord-node__box`,x:0,y:0,width:u,height:d,rx:9}));let n=r(`text`,{class:`rord-node__value`,x:u/2,y:d/2});n.textContent=String(o[e]),t.appendChild(n),P.appendChild(t),B.push(t)}function V(){let e=r(`g`,{class:`rord-chip`});e.appendChild(r(`rect`,{class:`rord-chip__box`,x:-58/2,y:-26/2,width:v,height:y}));let t=r(`text`,{class:`rord-chip__text`,x:0,y:0});return e.appendChild(t),{g:e,t}}let H=[V(),V()];H.forEach(e=>P.appendChild(e.g));let U=document.createElement(`p`);U.className=`viz__desc`,U.setAttribute(`aria-live`,`polite`),M.appendChild(U);let W=i();M.appendChild(W.root),n.textContent=``,n.appendChild(M);let G=null;function K(e,t,n,i){let a=n[e],o=n[t],s=r(`g`,{class:`rord-edge ${i||``}`});if(a.y===o.y&&Math.abs(a.x-o.x)===108){let e=a.y+d/2,t=a.x+u,n=o.x;s.appendChild(r(`line`,{class:`rord-edge__line`,x1:t+3,y1:e,x2:n-9,y2:e})),s.appendChild(r(`path`,{class:`rord-edge__head`,d:`M ${n} ${e} L ${n-9} ${e-5.5} L ${n-9} ${e+5.5} Z`}))}else{let e=a.y+d,t=o.y+d,n=a.x+u/2,i=o.x+u/2;s.appendChild(r(`path`,{class:`rord-edge__line`,d:`M ${n} ${e} C ${n} ${e+38}, ${i} ${t+38}, ${i} ${t+8}`})),s.appendChild(r(`path`,{class:`rord-edge__head`,d:`M ${i} ${t} L ${i-5.5} ${t+9} L ${i+5.5} ${t+9} Z`}))}z.appendChild(s)}function q(t,n){let i=Array(T).fill(null),a=[...n.merged,...n.front];a.forEach((e,t)=>{i[e]={x:D(t),y:m}}),n.back.forEach((e,t)=>{i[e]={x:D(a.length+t),y:h}});let o=a.length+n.back.length;for(let e=0;e<T;e+=1)i[e]||(i[e]={x:D(o),y:m},o+=1);let s=new Set(n.merged);for(let e=0;e<T;e+=1){let t=i[e];B[e].setAttribute(`transform`,`translate(${t.x} ${t.y})`),B[e].classList.toggle(`is-merged`,s.has(e))}z.textContent=``;for(let e=0;e<T;e+=1){let t=n.links[e];t!=null&&(t<0||t>=T||K(e,t,i,n.phase===`merge`||n.phase===`done`?`rord-edge--merged`:``))}if(n.cutEdge){let[e,t]=n.cutEdge;if(i[e]&&i[t]){let n=r(`g`,{class:`rord-edge rord-edge--cut`}),a=i[e],o=i[t];n.appendChild(r(`line`,{class:`rord-edge__line`,x1:a.x+u,y1:a.y+d/2,x2:o.x,y2:o.y+d/2})),z.appendChild(n)}}F.forEach((e,t)=>e.classList.toggle(`is-on`,n.stage===t+1)),H.forEach((e,t)=>{let r=n.chips[t];if(!r){e.g.style.opacity=`0`;return}let a=r.slot===null?{x:A-u/2,y:m}:i[r.slot];e.g.style.opacity=`1`,e.g.setAttribute(`class`,`rord-chip rord-chip--${r.kind}`),e.t.textContent=r.label,e.g.setAttribute(`transform`,`translate(${a.x+u/2} ${a.y+g})`)}),e(U,n.desc)}let J=t({steps:C,controls:W,intervalMs:x,onRender:q});J.jumpTo(Math.trunc(a.initialStep)||0);let Y=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return s&&!Y&&typeof IntersectionObserver==`function`&&(G=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){G.disconnect(),G=null,J.play();return}},{threshold:.35}),G.observe(M)),{destroy(){G&&=(G.disconnect(),null),J.destroy(),n.textContent=``,delete n.dataset.rordMounted,document.getElementById(l)?.remove()}}}export{T as default,T as mountReorderList};