import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";import{n as a}from"./levelOrderSteps-Cc0Lk2yX.js";function o(e={}){let{nodes:t,root:n}=a(Array.isArray(e.values)?e.values:[3,5,1,6,2,0,8,null,null,7,4]);if(n===-1)return[{phase:`done`,desc:"**空树**，直接返回 `null`。",stack:[],current:null,returning:null,returnSource:`null`,memo:{},leftOf:{},rightOf:{},depth:-1,maxDepth:0,found:[],answer:null,done:!0}];let r=e=>e==null?null:t[e].value,i=new Map;for(let e of t)i.set(e.value,e.id);let o=e.p===void 0||e.p===null?i.get(6):i.get(e.p),s=e.q===void 0||e.q===null?i.get(4):i.get(e.q),c=Number.isInteger(e.maxFrames)?e.maxFrames:400,l=[],u={},d={},f={},p=[],m=null,h=0,g=0,_=e=>{if(e==null)return`null`;let t=r(e);return e===o?`${t}（p）`:e===s?`${t}（q）`:String(t)},v=e=>e==null?"`null`（这棵子树里一个都没找到）":e===o?`\`${r(e)}\` —— **这是 p 本身，向上当成"p 在这里"的标记**（它不是答案，只是信使）`:e===s?`\`${r(e)}\` —— **这是 q 本身，向上当成"q 在这里"的标记**`:`\`${r(e)}\` —— **这就是答案（LCA），继续向上冒就行了**`,y=(e,t,n={})=>{l.push({phase:e,desc:t,stack:b.map(e=>({id:e.id,stage:e.stage})),current:null,returning:null,returnSource:`null`,memo:{...u},leftOf:{...d},rightOf:{...f},depth:b.length-1,maxDepth:h,found:[...p],answer:m,done:e===`done`,...n})},b=[];for(y(`init`,`要找 \`${_(o)}\` 和 \`${_(s)}\` 的最近公共祖先。**用一个显式栈模拟递归**：每次调用 \`dfs(node)\` 就压栈，返回就出栈。栈底是根 \`${r(n)}\`，栈越深说明递归钻得越深。`,{current:n}),b.push({id:n,stage:`enter`,from:null});b.length>0&&(g+=1,!(g>c));){let e=b[b.length-1],n=t[e.id];if(h=Math.max(h,b.length-1),e.stage===`enter`){if(e.id===o||e.id===s){let t=e.id===o;u[e.id]=e.id,p.includes(e.id)||p.push(e.id),y(`hit`,`进入 \`${_(e.id)}\` —— **命中！**这就是 \`node is p or node is q\` 那一行。**命中就立刻返回，不再往下探它的子树**：如果另一个目标在它的子树里，那它自己就是答案（"一个节点也可以是它自己的祖先"）；如果不在，它也只是个"我在这儿"的标记。两种情况都只需要把**它自己**往上报。`,{current:e.id,returning:e.id,returnSource:t?`p`:`q`});let n=e.id;b.pop(),C(e,n);continue}if(n.left===null&&n.right===null){u[e.id]=null,y(`return`,`进入 \`${r(e.id)}\` —— **叶子节点，而且不是 p 也不是 q**。它的子树是空的，一个目标都没有，所以向父节点汇报 \`null\`。`,{current:e.id,returning:null,returnSource:`null`}),b.pop(),C(e,null);continue}if(n.left!==null){y(`recurse`,`进入 \`${r(e.id)}\` —— 它不是 p 也不是 q，**不能立刻下结论**，必须先把左右两棵子树都问一遍（这就是"后序"的含义）。先向左子树 \`${r(n.left)}\` 递归。`,{current:e.id}),e.stage=`left`,b.push({id:n.left,stage:`enter`,from:`L`});continue}y(`recurse`,`进入 \`${r(e.id)}\` —— 它不是 p 也不是 q，**必须先问子树**。它没有左孩子，直接转向右子树 \`${r(n.right)}\` 递归。`,{current:e.id}),d[e.id]=null,e.stage=`right`,b.push({id:n.right,stage:`enter`,from:`R`});continue}if(e.stage===`left`){if(n.right!==null){y(`recurse`,`\`${r(e.id)}\` 的左子树回来了，返回值是 ${v(d[e.id])}。**先把它记在手边，接着向右子树 \`${r(n.right)}\` 递归** —— 两边都问完，才能判断自己是不是那个分叉点。`,{current:e.id,returning:d[e.id]}),e.stage=`right`,b.push({id:n.right,stage:`enter`,from:`R`});continue}f[e.id]=null,e.stage=`decide`;continue}if(e.stage===`right`){e.stage=`decide`;continue}let i=d[e.id]===void 0?null:d[e.id],a=f[e.id]===void 0?null:f[e.id];y(`collect`,`\`${r(e.id)}\` 的左右子树都回来了：左 = ${v(i)}，右 = ${v(a)}。**现在到做判断的时候了。**`,{current:e.id});let c;if(i!==null&&a!==null)c=e.id,u[e.id]=e.id,m===null&&(m=e.id),y(`decide`,`**左右都非空 —— 两个目标刚好在 \`${r(e.id)}\` 这里分叉！**这是全树唯一一个"左边有一个、右边有一个"的节点，所以它就是最近公共祖先：返回自己 \`${r(e.id)}\`。（再往上的祖先虽然也同时包含 p 和 q，但都不是"最近"的了。）`,{current:e.id,returning:e.id,returnSource:`lca`});else if(i!==null||a!==null){c=i===null?a:i,u[e.id]=c;let t=m!==null&&c===m;y(`decide`,t?`只有一个非空（${i===null?`右`:`左`}边是 ${v(c)}），**这就是已经确定的答案，继续往上冒**。\`${r(e.id)}\` 只是路过，它虽然也同时是 p 和 q 的祖先，但不是"最近"的那个。`:`只有一个非空（${i===null?`右`:`左`}边是 ${v(c)}），说明两个目标**都在同一侧子树里**，\`${r(e.id)}\` 不是分叉点。如实把这唯一的返回值往上报 —— 这里**不改变它**，只负责传递。`,{current:e.id,returning:c,returnSource:t?`lca`:c===o?`p`:`q`})}else c=null,u[e.id]=null,y(`decide`,'左右都是 `null` —— 这棵子树里 p 和 q 一个都没有，向上汇报 `null`。父节点收到它，等于"这条分支可以忽略了"。',{current:e.id,returning:null,returnSource:`null`});b.pop(),C(e,c)}let x=u[n];m===null&&x!=null&&(m=x);let S=m===null?n:m;y(`done`,m===null?`递归结束，栈空了。**返回值一路冒到根，但没有任何节点出现"左右都非空"** —— 说明 p 和 q 不在一棵树上（在本题约束下不会发生）。`:`递归结束，栈空了。最终从根 \`${r(n)}\` 冒出来的返回值是 \`${r(S)}\`，它就是 \`${_(o)}\` 和 \`${_(s)}\` 的**最近公共祖先**。`,{current:S,returning:S,returnSource:`lca`,done:!0});function C(e,t){if(e.from===null)return;let n=b[b.length-1];n&&(e.from===`L`?d[n.id]=t:f[n.id]=t)}return l}var s=`lca-styles`,c=24,l=82,u=62,d=58,f=26,p=44,m=30,h=214,g=1250,_=`
.lca {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.lca__svg { width: 100%; height: auto; display: block; }

/* ── 节点 ─────────────────────────────────────────────────────────────── */
.lca-node__circle {
  fill: var(--lca-fill, #ffffff);
  stroke: var(--lca-line, #9aa39c);
  stroke-width: 2;
}
.lca-node__value {
  fill: var(--lca-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 树上挂的"返回值"小标签 */
.lca-node__ret {
  fill: var(--lca-paper, #f4f2ec);
  stroke: var(--lca-line, #9aa39c);
  stroke-width: 1.5;
}
.lca-node__ret-text {
  fill: var(--lca-ink, #1f2a24);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lca-node__tag {
  fill: var(--lca-hot, #a45f45);
  font-size: 11px;
  font-weight: 700;
  text-anchor: middle;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lca-node.is-target .lca-node__circle { stroke: var(--lca-hit, #c2872f); stroke-width: 3; }
.lca-node.is-visit .lca-node__circle { stroke: var(--lca-hot, #a45f45); stroke-width: 3; }
.lca-node.is-found .lca-node__circle { fill: var(--lca-ok-fill, #eef5f1); stroke: var(--lca-ok, #3f6b57); stroke-width: 3; }
.lca-node.is-prune .lca-node__circle { stroke: var(--lca-dim, #b9b9b3); stroke-dasharray: 3 3; }
.lca-node.is-prune .lca-node__value { fill: var(--lca-dim, #b9b9b3); }

/* 分叉点的强调环 */
.lca-node__ring {
  fill: none;
  stroke: var(--lca-hot, #a45f45);
  stroke-width: 3;
  opacity: 0;
}
.lca-node.is-answer .lca-node__ring { opacity: 1; }

/* ── 边 ───────────────────────────────────────────────────────────────── */
.lca-edge { stroke: var(--lca-edge, #8b948c); stroke-width: 2; fill: none; }
.lca-edge.is-active { stroke: var(--lca-hot, #a45f45); stroke-width: 3; }
.lca-edge.is-prune { stroke: var(--lca-dim, #b9b9b3); stroke-dasharray: 4 4; }

/* ── 递归栈 ───────────────────────────────────────────────────────────── */
.lca-stack__title {
  fill: var(--lca-muted, #657168);
  font-size: 12px;
  font-weight: 700;
  text-anchor: start;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lca-frame__box {
  fill: var(--lca-frame-fill, #ffffff);
  stroke: var(--lca-line, #9aa39c);
  stroke-width: 1.5;
}
.lca-frame__text {
  fill: var(--lca-ink, #1f2a24);
  font-size: 11.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lca-frame.is-top .lca-frame__box { stroke: var(--lca-hot, #a45f45); stroke-width: 2.5; }
.lca-frame.is-top .lca-frame__text { fill: var(--lca-hot, #a45f45); font-weight: 700; }

/* ── 返回值传送带 ─────────────────────────────────────────────────────── */
.lca-flow__box {
  fill: var(--lca-ok-fill, #eef5f1);
  stroke: var(--lca-ok, #3f6b57);
  stroke-width: 2;
}
.lca-flow__text {
  fill: var(--lca-ok, #3f6b57);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lca-empty__text {
  fill: var(--lca-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function v(){if(document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=_,document.head.appendChild(e)}function y(_,y={}){if(!_||_.dataset.lcaMounted===`1`)return{destroy(){}};_.dataset.lcaMounted=`1`,v();let b=o(y),x=y.autoplay!==!1,{nodes:S,root:C}=a(Array.isArray(y.values)?y.values:[3,5,1,6,2,0,8,null,null,7,4]),w=e=>e==null||!S[e]?null:S[e].value,T=r,E=document.createElement(`div`);E.className=`viz lca`;let D=document.createElement(`div`);if(D.className=`viz__stage`,E.appendChild(D),C===-1){let e=T(`svg`,{class:`viz__svg lca__svg`,viewBox:`0 0 620 120`,role:`img`}),t=T(`text`,{class:`lca-empty__text`,x:620/2,y:120/2});return t.textContent=`空树 —— 直接返回 null`,e.appendChild(t),D.appendChild(e),E.appendChild(O()),E.appendChild(i().root),_.textContent=``,_.appendChild(E),{destroy(){_.textContent=``,delete _.dataset.lcaMounted,document.getElementById(s)?.remove()}}}function O(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let k=S.reduce((e,t)=>Math.max(e,t.depth),0),A=new Map;A.set(C,[]);for(let e of S)e.parent!==-1&&A.set(e.id,[...A.get(e.parent)??[],e.side]);let ee=e=>d*2**Math.max(0,k-e),j=e=>{let t=0;for(let n of A.get(e.id)??[])t=t*2+ +(n===`R`);return(t+.5)*ee(e.depth)},M=2**k*d,N=Math.max(660,f+M+68),te=(N-M)/2,ne=e=>u+e*l,P=e=>({x:te+j(S[e]),y:ne(S[e].depth)}),re=u+k*l+c,F=Math.max(1,...b.map(e=>e.stack.length)),I=re+p,L=I+F*40,R=L+22,ie=R+34+26,z=f,ae=h,B=T(`svg`,{class:`viz__svg lca__svg`,viewBox:`0 0 ${N} ${ie}`,role:`img`,"aria-label":`最近公共祖先推演动画`});D.appendChild(B);let V=new Map;for(let e of S){if(e.parent===-1)continue;let t=P(e.parent),n=P(e.id),r=T(`path`,{class:`lca-edge`,d:`M ${t.x} ${t.y+c} L ${n.x} ${n.y-c}`});B.appendChild(r),V.set(e.id,r)}let H=[];for(let e of S){let t=P(e.id),n=T(`g`,{class:`lca-node`,transform:`translate(${t.x} ${t.y})`});n.appendChild(T(`circle`,{class:`lca-node__ring`,r:31})),n.appendChild(T(`circle`,{class:`lca-node__circle`,cx:0,cy:0,r:c}));let r=T(`text`,{class:`lca-node__value`,x:0,y:0});r.textContent=String(e.value),n.appendChild(r);let i=T(`g`,{class:`lca-node__retg`});i.appendChild(T(`rect`,{class:`lca-node__ret`,x:-26,y:-48,width:52,height:20,rx:6}));let a=T(`text`,{class:`lca-node__ret-text`,x:0,y:-38});i.appendChild(a),n.appendChild(i);let o=T(`text`,{class:`lca-node__tag`,x:0,y:39});n.appendChild(o),B.appendChild(n),H.push({g:n,retG:i,rt:a,tag:o,id:e.id})}let U=T(`text`,{class:`lca-stack__title`,x:z,y:I-12});U.textContent=`调用栈（栈底在下）`,B.appendChild(U);let W=[];for(let e=0;e<F;e+=1){let t=T(`g`,{class:`lca-frame`,transform:`translate(${z} ${L-(e+1)*40})`});t.appendChild(T(`rect`,{class:`lca-frame__box`,x:0,y:0,width:ae,height:m,rx:7}));let n=T(`text`,{class:`lca-frame__text`,x:12,y:m/2});t.appendChild(n),B.appendChild(t),W.push({g:t,t:n})}let G=T(`rect`,{class:`lca-flow__box`,x:z,y:R,width:Math.min(560,N-z-24),height:34,rx:8});B.appendChild(G);let K=T(`text`,{class:`lca-flow__text`,x:z+Math.min(560,N-z-24)/2,y:R+34/2});B.appendChild(K);let q=O(),J=(e,t)=>Object.prototype.hasOwnProperty.call(e.memo,t);function oe(t,n){if(!n)return;let r=n.stack.length?n.stack[n.stack.length-1].id:null;n.current;let i=new Set(n.stack.map(e=>e.id));for(let e of H){let{id:t,g:i,retG:a,rt:o,tag:s}=e,c=[`lca-node`];Array.isArray(n.found)&&n.found.includes(t)&&c.push(`is-target`);let l=J(n,t),u=l?n.memo[t]:void 0;l&&u===null?c.push(`is-prune`):l&&u!==null&&c.push(`is-found`),t===r&&c.push(`is-visit`),t===n.answer&&c.push(`is-answer`),i.setAttribute(`class`,c.join(` `)),l?(a.style.opacity=`1`,o.textContent=u===null?`null`:`${w(u)}`,o.setAttribute(`class`,`lca-node__ret-text`)):a.style.opacity=`0`;let d=t===n.pId,f=t===n.qId;s.textContent=d&&f?`=p=q`:d?`p`:f?`q`:``,s.style.opacity=d||f?`1`:`0`}for(let e of S){if(e.parent===-1)continue;let t=V.get(e.id),r=[`lca-edge`];i.has(e.id)&&i.has(e.parent)&&r.push(`is-active`),J(n,e.id)&&n.memo[e.id]===null&&r.push(`is-prune`),t.setAttribute(`class`,r.join(` `))}if(W.forEach((e,t)=>{let r=n.stack[t];if(!r){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`;let i=t===n.stack.length-1;e.g.setAttribute(`class`,`lca-frame${i?` is-top`:``}`);let a=r.stage===`enter`?`刚进入`:r.stage===`left`?`等右子树`:r.stage===`right`?`等返回值`:`做判断`;e.t.textContent=`${t} · dfs(${w(r.id)}) · ${a}`}),n.phase===`hit`||n.phase===`decide`||n.phase===`return`||n.phase===`done`){G.style.opacity=`1`,K.style.opacity=`1`;let e=n.returning;n.returnSource===`null`?K.textContent=n.phase===`done`?`递归结束：返回 null`:`返回 null（子树里什么都没找到）`:n.phase===`done`?K.textContent=`最终答案：${w(e)}`:n.returnSource===`lca`?K.textContent=`返回自己 ${w(e)}（这里就是分叉点）`:K.textContent=`向上返回 ${w(e)}（标记：${n.returnSource} 在这里）`}else G.style.opacity=`0.25`,K.style.opacity=`0.35`,K.textContent=`（这一帧还没有返回值）`;e(q,n.desc)}E.appendChild(q);let Y=i();E.appendChild(Y.root);let X=new Map;for(let e of S)X.set(e.value,e.id);let se=y.p===void 0||y.p===null?6:y.p,ce=y.q===void 0||y.q===null?4:y.q,le=X.get(se),ue=X.get(ce),de=b.map(e=>({...e,pId:le,qId:ue}));_.textContent=``,_.appendChild(E),n();let Z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:de,controls:Y,intervalMs:g,onRender:oe});Q.jumpTo(Math.trunc(y.initialStep)||0);let $=null;return x&&!Z&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(E)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),_.textContent=``,delete _.dataset.lcaMounted,document.getElementById(s)?.remove()}}}export{y as mountLca};