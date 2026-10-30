import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";import{n as a}from"./levelOrderSteps-Cc0Lk2yX.js";function o(e={}){let{nodes:t,root:n}=a(Array.isArray(e.values)?e.values:[4,2,7,1,3,6,9]);if(n===-1)return[{phase:`done`,desc:"**空树** —— 没什么可翻的，直接返回 `None`。",current:null,swapPair:null,swapped:[],sideOf:{},stack:[],depth:-1,done:!0}];let r=e=>e==null||t[e]===void 0?null:t[e].value,i=Number.isInteger(e.maxFrames)?e.maxFrames:400,o={};for(let e of t)e.parent!==-1&&(o[e.id]=e.side);let s=(e,n)=>{for(let r of t)if(r.parent===e&&o[r.id]===n)return r.id;return null},c=[],l=[],u=[],d=0,f=(e,t,n={})=>{c.push({phase:e,desc:t,current:null,swapPair:null,swapped:[...l],sideOf:{...o},stack:u.map(e=>({id:e.id})),depth:u.length-1,done:e===`done`,...n})},p=t.length;for(f(`init`,`翻转二叉树 —— **把每个节点的两个孩子交换一次**。关键要意识到：**交换和递归的先后顺序不影响结果**，因为每个节点是各自独立地换自己的两个孩子，谁先谁后都不干涉。所以前序（先换再递归）和后序（先递归再换）都对 —— 但**交换绝不能插在两个递归中间**，那样会让已经翻好的子树白翻一遍。这棵树一共 ${p} 个节点，我们从根 \`${r(n)}\` 开始，一层层往下换。`,{current:n}),u.push({id:n,stage:`enter`});u.length>0&&(d+=1,!(d>i));){let e=u[u.length-1];if(t[e.id],e.stage===`enter`){let t=s(e.id,`L`),n=s(e.id,`R`);if(t===null&&n===null){f(`leaf`,`\`${r(e.id)}\` 是**叶子节点**，两个孩子都是空的。交换两个 \`None\` 是**空操作** —— 所以叶子在这里直接返回。这也说明：**真正发生变化的只有非叶节点**。`,{current:e.id}),u.pop();continue}t!==null&&(o[t]=`R`),n!==null&&(o[n]=`L`),l.push(e.id),f(`swap`,`\`${r(e.id)}\` —— **交换它的两个孩子**：`+(t!==null&&n!==null?`\`${r(t)}\` 和 \`${r(n)}\` 互换位置。`:t===null?`原来只有右孩子 \`${r(n)}\`，换成左孩子（另一边仍是空）。`:`原来只有左孩子 \`${r(t)}\`，换成右孩子（另一边仍是空）。`)+` 这是这一帧**唯一**发生的事，别多做也别少做。`,{current:e.id,swapPair:[t,n]}),e.stage=`left`,n!==null&&u.push({id:n,stage:`enter`});continue}if(e.stage===`left`){let t=s(e.id,`R`);t===null?e.stage=`right`:(f(`descend`,`\`${r(e.id)}\` 的左子树已经翻完，回到它身上，接着递归进**右子树** \`${r(t)}\`。注意这个"右子树"其实是**交换前那个左孩子** —— 因为这一层的交换已经发生过了，角色的名字不能想当然。`,{current:e.id}),e.stage=`right`,u.push({id:t,stage:`enter`}));continue}u.pop()}return f(`done`,`递归结束，栈空了。**翻转完成** —— 一共交换了 \`${l.length}\` 个非叶节点的孩子。现在整棵树上，每个节点从根到它的路径都**逐位取反**过了：左变成了右、右变成了左，于是每一层都成了原来那一层的**镜像**。时间复杂度 O(n)（每个节点恰好访问一次），空间 O(h)（递归栈深 = 树高）。`,{current:n,done:!0}),c}var s=`it-styles`,c=24,l=88,u=76,d=34,f=68,p=26,m=42,h=50,g=1150,_=`
.it {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.it__svg { width: 100%; height: auto; display: block; }

/* ── 节点（位置每帧变，所以挂 transition）───────────────────────────── */
.it-node {
  transition: transform 420ms cubic-bezier(0.4, 0, 0.2, 1);
}
.it-node__circle {
  fill: var(--it-fill, #ffffff);
  stroke: var(--it-line, #9aa39c);
  stroke-width: 2;
  transition: fill 260ms ease, stroke 260ms ease;
}
.it-node__value {
  fill: var(--it-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 当前焦点节点的强调环 */
.it-node__ring {
  fill: none;
  stroke: var(--it-hot, #a45f45);
  stroke-width: 3.5;
  opacity: 0;
}
/* 已经被翻转过的节点 */
.it-node.is-done .it-node__circle {
  fill: var(--it-ok-fill, #eef5f1);
  stroke: var(--it-ok, #3f6b57);
  stroke-width: 2.5;
}
.it-node.is-visit .it-node__circle {
  stroke: var(--it-hot, #a45f45);
  stroke-width: 3;
}
.it-node.is-visit .it-node__ring { opacity: 1; }
/* 这一帧正在被互换的两个孩子 */
.it-node.is-swapping .it-node__circle {
  fill: var(--it-hot-fill, #fdf1ec);
  stroke: var(--it-hot, #a45f45);
  stroke-width: 3.5;
}

/* ── 边（每帧重算 d，所以也要 transition）──────────────────────────── */
.it-edge {
  stroke: var(--it-edge, #8b948c);
  stroke-width: 2;
  fill: none;
  transition: d 420ms cubic-bezier(0.4, 0, 0.2, 1);
}
.it-edge.is-onstack {
  stroke: var(--it-hot, #a45f45);
  stroke-width: 3;
}

/* ── 交换弧线 ─────────────────────────────────────────────────────────── */
.it-swap__arc {
  fill: none;
  stroke: var(--it-hot, #a45f45);
  stroke-width: 2.5;
  stroke-dasharray: 6 4;
}
.it-swap__head {
  fill: var(--it-hot, #a45f45);
}
.it-swap__mark {
  fill: var(--it-hot, #a45f45);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}

/* ── 状态横幅 ─────────────────────────────────────────────────────────── */
.it-banner__box {
  fill: var(--it-banner-fill, #f4f2ec);
  stroke: var(--it-line, #9aa39c);
  stroke-width: 1.5;
}
.it-banner__lead {
  fill: var(--it-hot, #a45f45);
  font-size: 16px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.it-banner__box.is-done {
  fill: var(--it-ok-fill, #eef5f1);
  stroke: var(--it-ok, #3f6b57);
  stroke-width: 2;
}
.it-banner__count {
  fill: var(--it-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.it-banner__count.is-done {
  fill: var(--it-ok, #3f6b57);
}

.it-empty__text {
  fill: var(--it-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function v(){if(document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=_,document.head.appendChild(e)}function y(_,y={}){if(!_||_.dataset.itMounted===`1`)return{destroy(){}};_.dataset.itMounted=`1`,v();let b=o(y),ee=y.autoplay!==!1,{nodes:x,root:S}=a(Array.isArray(y.values)?y.values:[4,2,7,1,3,6,9]),C=e=>e==null||!x[e]?null:x[e].value,w=r,T=document.createElement(`div`);T.className=`viz it`;let E=document.createElement(`div`);E.className=`viz__stage`,T.appendChild(E);function D(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(S===-1){let e=w(`svg`,{class:`viz__svg it__svg`,viewBox:`0 0 620 120`,role:`img`}),t=w(`text`,{class:`it-empty__text`,x:620/2,y:120/2});return t.textContent=`空树 —— 没什么可翻的，直接返回 None`,e.appendChild(t),E.appendChild(e),T.appendChild(D()),T.appendChild(i().root),_.textContent=``,_.appendChild(T),{destroy(){_.textContent=``,delete _.dataset.itMounted,document.getElementById(s)?.remove()}}}let O=x.reduce((e,t)=>Math.max(e,t.depth),0),k=Math.min(120,Math.max(58,Math.round(470/2**O))),te=e=>k*2**Math.max(0,O-e),A=2**O*k,j=Math.max(660,p+A+68),M=(j-A)/2,N=e=>u+e*l,P=(e,t)=>{let n=0,r=1,i=t;for(;x[i].parent!==-1;)e[i]===`R`&&(n+=r),r*=2,i=x[i].parent;return{x:M+(n+.5)*te(x[t].depth),y:N(x[t].depth)}},F=u+O*l+c+m,I=Math.min(620,j-p*2),L=w(`svg`,{class:`viz__svg it__svg`,viewBox:`0 0 ${j} ${F+h+26}`,role:`img`,"aria-label":`翻转二叉树推演动画`});E.appendChild(L);let R=w(`g`,{class:`it-edges`}),z=w(`g`,{class:`it-nodes`}),B=w(`g`,{class:`it-swap`});L.appendChild(R),L.appendChild(B),L.appendChild(z);let V=new Map;for(let e of x){if(e.parent===-1)continue;let t=w(`path`,{class:`it-edge`,d:`M 0 0 L 0 0`});R.appendChild(t),V.set(e.id,t)}let H=[];for(let e of x){let t=w(`g`,{class:`it-node`});t.appendChild(w(`circle`,{class:`it-node__ring`,r:31})),t.appendChild(w(`circle`,{class:`it-node__circle`,cx:0,cy:0,r:c}));let n=w(`text`,{class:`it-node__value`,x:0,y:0});n.textContent=String(e.value),t.appendChild(n),z.appendChild(t),H.push({g:t,value:e.value,id:e.id})}let U=w(`path`,{class:`it-swap__arc`,d:`M 0 0`}),W=w(`path`,{class:`it-swap__head`,d:`M 0 0`}),G=w(`path`,{class:`it-swap__head`,d:`M 0 0`}),K=w(`text`,{class:`it-swap__mark`,x:0,y:0});K.textContent=`⇄`,B.appendChild(U),B.appendChild(W),B.appendChild(G),B.appendChild(K);let q=w(`rect`,{class:`it-banner__box`,x:p,y:F,width:I,height:h,rx:9});L.appendChild(q);let J=w(`text`,{class:`it-banner__lead`,x:42,y:F+h/2});L.appendChild(J);let Y=w(`text`,{class:`it-banner__count`,x:p+I-16,y:F+h/2});L.appendChild(Y);let X=D();function ne(t,n){if(!n)return;let r=n.sideOf??{},i=e=>P(r,e),a=n.current,o=new Set(n.swapped??[]),s=n.swapPair??[],l=new Set(s.filter(e=>e!=null)),u=new Set;for(let e=0;e+1<n.stack.length;e+=1)u.add(n.stack[e+1].id);for(let e of H){let{id:t,g:r}=e,s=i(t);r.setAttribute(`transform`,`translate(${s.x} ${s.y})`);let c=[`it-node`];o.has(t)&&c.push(`is-done`),t===a&&n.phase!==`done`&&c.push(`is-visit`),l.has(t)&&c.push(`is-swapping`),r.setAttribute(`class`,c.join(` `))}for(let e of x){if(e.parent===-1)continue;let t=i(e.parent),n=i(e.id),r=V.get(e.id);r.setAttribute(`d`,`M ${t.x} ${t.y+c} L ${n.x} ${n.y-c}`),r.setAttribute(`class`,u.has(e.id)?`it-edge is-onstack`:`it-edge`)}let p=s.filter(e=>e!=null);if(n.phase===`swap`&&p.length===2){let e=i(p[0]),t=i(p[1]),n=e.y-c-d,r=(e.x+t.x)/2,a=e.y-c-f;U.setAttribute(`d`,`M ${e.x} ${n} Q ${r} ${a} ${t.x} ${n}`),U.style.opacity=`1`,W.setAttribute(`d`,`M ${e.x} ${n} l 9 -4 l 0 8 z`),G.setAttribute(`d`,`M ${t.x} ${n} l -9 -4 l 0 8 z`),W.style.opacity=`1`,G.style.opacity=`1`,K.setAttribute(`x`,r),K.setAttribute(`y`,a-9),K.style.opacity=`1`}else U.style.opacity=`0`,W.style.opacity=`0`,G.style.opacity=`0`,K.style.opacity=`0`;let m=x.filter(e=>e.left!==null||e.right!==null).length;n.phase===`init`?J.textContent=`从根 ${C(S)} 开始，逐层交换两个孩子`:n.phase===`swap`?J.textContent=p.length===2?`交换 ${C(p[0])} 和 ${C(p[1])}`:`单侧孩子移位：${C(p[0]??p[1])}`:n.phase===`leaf`?J.textContent=`${C(a)} 是叶子，交换空操作 → 直接返回`:J.textContent=`继续递归进子树 ${C(a)}`,n.phase===`done`?(J.textContent=`翻转完成 —— 每个节点的路径都逐位取反过了`,q.setAttribute(`class`,`it-banner__box is-done`),Y.setAttribute(`class`,`it-banner__count is-done`)):(q.setAttribute(`class`,`it-banner__box`),Y.setAttribute(`class`,`it-banner__count`)),Y.textContent=`已换 ${n.swapped.length}/${m} 个非叶节点`,e(X,n.desc)}T.appendChild(X);let Z=i();T.appendChild(Z.root),_.textContent=``,_.appendChild(T),n();let re=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:b,controls:Z,intervalMs:g,onRender:ne});Q.jumpTo(Math.trunc(y.initialStep)||0);let $=null;return ee&&!re&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(T)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),_.textContent=``,delete _.dataset.itMounted,document.getElementById(s)?.remove()}}}export{y as mountInvertTree};