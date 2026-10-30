import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";import{n as a}from"./levelOrderSteps-Cc0Lk2yX.js";function o(e={}){let{nodes:t,root:n}=a(Array.isArray(e.values)?e.values:[-10,9,20,null,null,15,7]);if(n===-1)return[{phase:`done`,desc:`**空树** —— 题目保证路径至少包含一个节点，空树不在输入范围内。`,stack:[],current:null,leftGain:null,rightGain:null,rawLeft:null,rawRight:null,through:null,gain:null,gainOf:{},best:-1/0,bestNode:null,bestPath:[],depth:-1,maxDepth:0,pruned:[],done:!0}];let r=e=>e==null||t[e]===void 0?null:t[e].value,i=Number.isInteger(e.maxFrames)?e.maxFrames:400,o=[],s={},c={},l=[],u=-1/0,d=null,f=[],p=0,m=0,h=e=>{let n=e=>{let n=[],r=e;for(;r!=null&&t[r]!==void 0;){n.push(r);let e=t[r],i=e.left===null?null:c[e.left]??null,a=e.right===null?null:c[e.right]??null,o=i!==null&&i>0,s=a!==null&&a>0;if(!o&&!s)break;r=o&&s?i>=a?e.left:e.right:o?e.left:e.right}return n},r=t[e];if(!r)return[];let i=r.left===null||!((c[r.left]??0)>0)?[]:n(r.left),a=r.right===null||!((c[r.right]??0)>0)?[]:n(r.right);return[...i.reverse(),e,...a]},g=(e,t,n={})=>{o.push({phase:e,desc:t,stack:_.map(e=>({id:e.id,stage:e.stage})),current:null,leftGain:null,rightGain:null,rawLeft:null,rawRight:null,through:null,gain:null,gainOf:{...s},best:u,bestNode:d,bestPath:[...f],depth:_.length-1,maxDepth:p,pruned:[...l],done:e===`done`,...n})},_=[];for(g(`init`,`要找**最大路径和**。关键是要同时算两个不同的东西：① **向上汇报的单边贡献值** \`gain = val + max(左, 右)\`（一条胳膊，给父节点继续接）；② **以本节点为拱顶的完整路径** \`through = val + 左 + 右\`（两条胳膊，到此为止）来更新全局最优。**路径不能拐两次弯**，所以向上汇报时只能选一条胳膊 —— 这是本题全部难度的来源。另外 \`max(gain, 0)\` 会剪掉负贡献：负的胳膊接进来只会让和变小。栈底是根 \`${r(n)}\`。`,{current:n}),_.push({id:n,stage:`enter`,from:null});_.length>0&&(m+=1,!(m>i));){let e=_[_.length-1],n=t[e.id];if(p=Math.max(p,_.length-1),e.stage===`enter`){if(n.left===null&&n.right===null){s[e.id]=n.value,c[e.id]=n.value;let t=n.value,i=!1;t>u&&(u=t,d=e.id,f=h(e.id),i=!0),g(i?`update`:`leaf`,`进入 \`${r(e.id)}\` —— **叶子节点**，左右子树都不存在，两边贡献都是 \`0\`。所以以它为拱顶的路径和就是它自己：\`${t}\`；向上汇报的贡献值也是 \`${t}\`。`+(i?`**刷新了全局最优** → \`best = ${u}\`。`:`没超过当前的 \`best = ${u}\`，保持不动。`),{current:e.id,leftGain:0,rightGain:0,rawLeft:null,rawRight:null,through:t,gain:t}),_.pop();continue}if(n.left!==null){g(`recurse`,`进入 \`${r(e.id)}\` —— 它 **不能立刻下结论**：拱顶路径和要用到左右两边的贡献，所以必须**先把两棵子树都问一遍**（后序）。先向左子树 \`${r(n.left)}\` 递归。`,{current:e.id}),e.stage=`left`,_.push({id:n.left,stage:`enter`,from:`L`});continue}g(`recurse`,`进入 \`${r(e.id)}\` —— 它没有左孩子（左边贡献直接记 \`0\`），直接向右子树 \`${r(n.right)}\` 递归。`,{current:e.id}),e.stage=`right`,_.push({id:n.right,stage:`enter`,from:`R`});continue}if(e.stage===`left`){if(n.right!==null){let t=c[n.left],i=Math.max(t,0);g(`recurse`,`\`${r(e.id)}\` 的左子树回来了，原始返回值是 \`${t}\`。`+(t<0?`**它是负的 —— 剪掉！** \`max(${t}, 0) = 0\`，意思就是"这条路走进去只会更小，干脆不进去"。`:`它是非负的，保留：\`max(${t}, 0) = ${i}\`。`)+` 把左贡献 \`${i}\` 记在手边，接着向右子树 \`${r(n.right)}\` 递归。`,{current:e.id,leftGain:i,rawLeft:t}),e.stage=`right`,_.push({id:n.right,stage:`enter`,from:`R`});continue}e.stage=`decide`;continue}if(e.stage===`right`){e.stage=`decide`;continue}let i=n.left===null?null:c[n.left],a=n.right===null?null:c[n.right],o=Math.max(i===null?0:i,0),m=Math.max(a===null?0:a,0);g(`collect`,`\`${r(e.id)}\` 的左右子树都回来了：左 = \`${i===null?`（无）`:i}\` → 取 \`max(·, 0) = ${o}\`，右 = \`${a===null?`（无）`:a}\` → 取 \`max(·, 0) = ${m}\`。**现在要同时算两个量，别搞混。**`,{current:e.id,leftGain:o,rightGain:m,rawLeft:i,rawRight:a});let v=n.value+o+m,y=n.value+Math.max(o,m);s[e.id]=y,c[e.id]=y,i!==null&&i<0&&n.left!==null&&!l.includes(n.left)&&l.push(n.left),a!==null&&a<0&&n.right!==null&&!l.includes(n.right)&&l.push(n.right);let b=v>u;b&&(u=v,d=e.id,f=h(e.id));let x=i!==null&&i<0&&a!==null&&a<0?`两条胳膊都是负的、全被剪了`:i!==null&&i<0?`左胳膊是负的被剪了`:a!==null&&a<0?`右胳膊是负的被剪了`:`两条胳膊都留着`;g(b?`update`:`decide`,`**算拱顶路径（可以拐弯，两条胳膊都用）**：\`${r(e.id)} + ${o} + ${m} = ${v}\`（${x}）。`+(b?` **刷新了全局最优！** \`best\` 从 \`${u===v?`（旧值更小）`:``}\`更新为 \`${v}\` —— 这条路径以 \`${r(e.id)}\` 为最高点，不再往上接。`:` 没超过当前的 \`best = ${u}\`，保持不动。`)+` 同时**算向上汇报的贡献值（只能选一条胳膊）**：\`${r(e.id)} + max(${o}, ${m}) = ${y}\` —— 这个值交给父节点，父节点会在它那里再拐一次弯；如果这里两条胳膊都用掉，父节点再拐就**拐两次弯**了，不是一条路径。`,{current:e.id,leftGain:o,rightGain:m,rawLeft:i,rawRight:a,through:v,gain:y}),_.pop()}return g(`done`,`递归结束，栈空了。全局最优 **\`best = ${u}\`**，对应的路径以 \`${r(d)}\` 为最高点：\`${f.map(e=>r(e)).join(` → `)}\`。注意**它完全不经过根 \`${r(n)}\`** —— 题目说"路径不一定经过根节点"，而这棵树的根是 \`${r(n)}\`（负数），把根接进来只会让和变小，所以递归时根的 \`through\` 反而不是最大的。`+(u<0?" 另外 `best` 是负数 —— 说明全树都是负值，此时答案就是**最大的那个单节点**（路径至少含一个节点，不能返回空路径 0）。":``),{current:d,returnSource:`best`,through:u,gain:s[d],done:!0}),o}var s=`mps-styles`,c=24,l=96,u=76,d=58,f=26,p=40,m=46,h=1250,g=`
.mps {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.mps__svg { width: 100%; height: auto; display: block; }

/* ── 节点 ─────────────────────────────────────────────────────────────── */
.mps-node__circle {
  fill: var(--mps-fill, #ffffff);
  stroke: var(--mps-line, #9aa39c);
  stroke-width: 2;
}
.mps-node__value {
  fill: var(--mps-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 节点上方挂的「贡献值」小标签 */
.mps-node__gain {
  fill: var(--mps-paper, #f4f2ec);
  stroke: var(--mps-line, #9aa39c);
  stroke-width: 1.5;
}
.mps-node__gain-text {
  fill: var(--mps-ink, #1f2a24);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 拱顶强调环 */
.mps-node__ring {
  fill: none;
  stroke: var(--mps-apex, #c2872f);
  stroke-width: 3.5;
  opacity: 0;
}

.mps-node.is-visit .mps-node__circle {
  stroke: var(--mps-hot, #a45f45);
  stroke-width: 3;
}
.mps-node.is-plus .mps-node__circle {
  fill: var(--mps-ok-fill, #eef5f1);
  stroke: var(--mps-ok, #3f6b57);
  stroke-width: 3;
}
.mps-node.is-zero .mps-node__circle {
  stroke: var(--mps-dim, #b9b9b3);
  stroke-dasharray: 3 3;
}
.mps-node.is-zero .mps-node__value {
  fill: var(--mps-dim, #b9b9b3);
}

/* 「在最优路径上」和「是拱顶」是两件事，必须分开画：
 * 最初把两者合并成同一个 class，结果终帧里 15 / 20 / 7 全戴上金圈，
 * 真正的拱顶 20 反而淹没在里面了。 */
.mps-node.is-onpath .mps-node__circle {
  fill: var(--mps-apex-fill, #fdf3e3);
  stroke: var(--mps-apex, #c2872f);
  stroke-width: 2.5;
}
.mps-node.is-apex .mps-node__ring { opacity: 1; }
.mps-node.is-apex .mps-node__circle {
  fill: var(--mps-apex-fill, #fdf3e3);
  stroke: var(--mps-apex, #c2872f);
  stroke-width: 3.5;
}

/* ── 边 ───────────────────────────────────────────────────────────────── */
.mps-edge { stroke: var(--mps-edge, #8b948c); stroke-width: 2; fill: none; }
/* 两端都在当前路径上 → 实心强调 */
.mps-edge.is-onpath {
  stroke: var(--mps-apex, #c2872f);
  stroke-width: 4;
}
.mps-edge.is-prune { stroke: var(--mps-dim, #b9b9b3); stroke-dasharray: 4 4; }

/* ── 最优路径横幅 ─────────────────────────────────────────────────────── */
.mps-banner__box {
  fill: var(--mps-apex-fill, #fdf3e3);
  stroke: var(--mps-apex, #c2872f);
  stroke-width: 2;
}
.mps-banner__label {
  fill: var(--mps-apex, #c2872f);
  font-size: 12px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mps-banner__value {
  fill: var(--mps-ink, #1f2a24);
  font-size: 20px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mps-banner__path {
  fill: var(--mps-muted, #657168);
  font-size: 12.5px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.mps-empty__text {
  fill: var(--mps-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function _(){if(document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=g,document.head.appendChild(e)}function v(g,v={}){if(!g||g.dataset.mpsMounted===`1`)return{destroy(){}};g.dataset.mpsMounted=`1`,_();let y=o(v),b=v.autoplay!==!1,{nodes:x,root:S}=a(Array.isArray(v.values)?v.values:[-10,9,20,null,null,15,7]),C=e=>e==null||!x[e]?null:x[e].value,w=r,T=document.createElement(`div`);T.className=`viz mps`;let E=document.createElement(`div`);E.className=`viz__stage`,T.appendChild(E);function D(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(S===-1){let e=w(`svg`,{class:`viz__svg mps__svg`,viewBox:`0 0 620 120`,role:`img`}),t=w(`text`,{class:`mps-empty__text`,x:620/2,y:120/2});return t.textContent=`空树 —— 没有节点，路径和按 0 处理（LeetCode 保证至少一个节点）`,e.appendChild(t),E.appendChild(e),T.appendChild(D()),T.appendChild(i().root),g.textContent=``,g.appendChild(T),{destroy(){g.textContent=``,delete g.dataset.mpsMounted,document.getElementById(s)?.remove()}}}let O=x.reduce((e,t)=>Math.max(e,t.depth),0),k=new Map;k.set(S,[]);for(let e of x)e.parent!==-1&&k.set(e.id,[...k.get(e.parent)??[],e.side]);let ee=e=>d*2**Math.max(0,O-e),A=e=>{let t=0;for(let n of k.get(e.id)??[])t=t*2+ +(n===`R`);return(t+.5)*ee(e.depth)},j=2**O*d,M=Math.max(660,f+j+68),N=(M-j)/2,P=e=>u+e*l,F=e=>({x:N+A(x[e]),y:P(x[e].depth)}),I=u+O*l+c+p,L=Math.min(600,M-f*2),R=w(`svg`,{class:`viz__svg mps__svg`,viewBox:`0 0 ${M} ${I+m+26}`,role:`img`,"aria-label":`二叉树最大路径和推演动画`});E.appendChild(R);let z=w(`g`,{class:`mps-edges`}),B=w(`g`,{class:`mps-nodes`}),V=w(`g`,{class:`mps-labels`});R.appendChild(z),R.appendChild(B),R.appendChild(V);let H=new Map;for(let e of x){if(e.parent===-1)continue;let t=F(e.parent),n=F(e.id),r=w(`path`,{class:`mps-edge`,d:`M ${t.x} ${t.y+c} L ${n.x} ${n.y-c}`});z.appendChild(r),H.set(e.id,r)}let U=e=>{if(e.parent===-1)return 0;let t=e.side===`L`?x[e.parent].right:x[e.parent].left;if(t==null)return 0;let n=Math.abs(F(e.id).x-F(t).x);if(n>=76)return 0;let r=(76-n)/2+4;return e.side===`L`?-r:r},W=[];for(let e of x){let t=F(e.id),n=w(`g`,{class:`mps-node`,transform:`translate(${t.x} ${t.y})`});n.appendChild(w(`circle`,{class:`mps-node__ring`,r:31})),n.appendChild(w(`circle`,{class:`mps-node__circle`,cx:0,cy:0,r:c}));let r=w(`text`,{class:`mps-node__value`,x:0,y:0});r.textContent=String(e.value),n.appendChild(r),B.appendChild(n);let i=w(`g`,{class:`mps-node__gaing`,transform:`translate(${t.x+U(e)} ${t.y})`});i.appendChild(w(`rect`,{class:`mps-node__gain`,x:-32,y:-57,width:64,height:22,rx:7}));let a=w(`text`,{class:`mps-node__gain-text`,x:0,y:-46});i.appendChild(a),V.appendChild(i),W.push({g:n,gainG:i,gt:a,id:e.id})}let G=w(`g`,{class:`mps-banner`});G.appendChild(w(`rect`,{class:`mps-banner__box`,x:f,y:I,width:L,height:m,rx:9}));let K=w(`text`,{class:`mps-banner__label`,x:42,y:I+m/2});K.textContent=`当前最优路径和`,G.appendChild(K);let q=w(`text`,{class:`mps-banner__value`,x:162,y:I+m/2});G.appendChild(q);let J=w(`text`,{class:`mps-banner__path`,x:f+L-16,y:I+m/2});G.appendChild(J),R.appendChild(G);let Y=D();function X(t,n){if(!n)return;let r=n.stack.length?n.stack[n.stack.length-1].id:null,i=new Set(n.bestPath??[]),a=new Set(n.pruned??[]),o=e=>Object.prototype.hasOwnProperty.call(n.gainOf,e);for(let e of W){let{id:t,g:s,gainG:c,gt:l}=e,u=[`mps-node`],d=o(t),f=d?n.gainOf[t]:null;d&&u.push(f>0?`is-plus`:`is-zero`),a.has(t)&&u.push(`is-zero`),t===r&&u.push(`is-visit`),i.has(t)&&u.push(`is-onpath`),t===n.bestNode&&u.push(`is-apex`),s.setAttribute(`class`,u.join(` `)),d?(c.style.opacity=`1`,l.textContent=`gain ${f}`):c.style.opacity=`0`}for(let e of x){if(e.parent===-1)continue;let t=H.get(e.id),r=[`mps-edge`];i.has(e.id)&&i.has(e.parent)&&r.push(`is-onpath`),o(e.id)&&n.gainOf[e.id]<=0&&r.push(`is-prune`),t.setAttribute(`class`,r.join(` `))}n.bestNode===null||!(n.bestPath??[]).length?(q.textContent=`—`,J.textContent=`还没算完任何一条路径`):(q.textContent=String(n.best),J.textContent=(n.bestPath??[]).map(e=>C(e)).join(` → `)),e(Y,n.desc)}T.appendChild(Y);let Z=i();T.appendChild(Z.root),g.textContent=``,g.appendChild(T),n();let te=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:y,controls:Z,intervalMs:h,onRender:X});Q.jumpTo(Math.trunc(v.initialStep)||0);let $=null;return b&&!te&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(T)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),g.textContent=``,delete g.dataset.mpsMounted,document.getElementById(s)?.remove()}}}export{v as mountMaxPathSum};