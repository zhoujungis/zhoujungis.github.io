import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";import{n as a}from"./levelOrderSteps-Cc0Lk2yX.js";function o(e={}){let{nodes:t,root:n}=a(Array.isArray(e.values)?e.values:[3,9,20,null,null,15,7]);if(n===-1)return[{phase:`done`,desc:"**空树** —— 深度记 `0`。这是递归的出口条件，也是整道题的基线。",stack:[],current:null,leftH:null,rightH:null,height:null,heightOf:{},answer:0,depth:-1,maxDepthSeen:0,done:!0}];let r=e=>e==null||t[e]===void 0?null:t[e].value,i=Number.isInteger(e.maxFrames)?e.maxFrames:400,o=[],s={},c=null,l=0,u=0,d=[],f=(e,t,n={})=>{o.push({phase:e,desc:t,stack:d.map(e=>({id:e.id,stage:e.stage})),current:null,leftH:null,rightH:null,height:null,heightOf:{...s},answer:c,depth:d.length-1,maxDepthSeen:l,done:e===`done`,...n})};for(f(`init`,`要求**最大深度**，也就是"从根往下最多能走几层"。做法是**后序递归**：每个节点先问出左右子树各自的高度，再取较大的那个、**加 1**（加的这个 1 就是自己这一层）。注意那个 \`1\` 不能少 —— 它代表的正是"把自己算进去"。栈底是根 \`${r(n)}\`。`,{current:n}),d.push({id:n,stage:`enter`});d.length>0&&(u+=1,!(u>i));){let e=d[d.length-1],i=t[e.id];if(l=Math.max(l,d.length-1),e.stage===`enter`){if(i.left===null&&i.right===null){s[e.id]=1,e.id===n&&(c=1),f(`leaf`,`进入 \`${r(e.id)}\` —— **叶子节点**，左右子树都不存在。按定义空子树高度是 \`0\`，所以它自己的高度 = \`1 + max(0, 0) = 1\`。**叶子是整条递归链的起点** —— 高度就是从这里开始一层层往上冒的。`,{current:e.id,leftH:0,rightH:0,height:1}),d.pop();continue}let t=i.left!==null;f(`recurse`,`进入 \`${r(e.id)}\` —— 它 **还不能下结论**：自己的高度取决于子树的高度，所以必须**先下去问**。`+(t?`先向左子树 \`${r(i.left)}\` 递归。`:`它没有左孩子（左边高度直接记 \`0\`），直接向右子树 \`${r(i.right)}\` 递归。`),{current:e.id}),e.stage=t?`left`:`right`,d.push({id:t?i.left:i.right,stage:`enter`});continue}if(e.stage===`left`){if(i.right!==null){let t=s[i.left];f(`recurse`,`左子树 \`${r(i.left)}\` 回来了，报告高度 **\`${t}\`**。先把它记在手边，接着向右子树 \`${r(i.right)}\` 递归 —— **还没到算自己高度的时候**，因为 \`max\` 要两个数都拿到才敢取。`,{current:e.id,leftH:t}),e.stage=`right`,d.push({id:i.right,stage:`enter`});continue}e.stage=`decide`;continue}if(e.stage===`right`){e.stage=`decide`;continue}let a=i.left===null?0:s[i.left],o=i.right===null?0:s[i.right],u=1+Math.max(a,o);s[e.id]=u;let p=e.id===n;p&&(c=u);let m=a===o?`两边一样高，取哪个都行`:a>o?`右边 \`${o}\` 更矮，被淘汰（\`max\` 只要大的那个）`:`左边 \`${a}\` 更矮，被淘汰（\`max\` 只要大的那个）`;f(`compute`,`\`${r(e.id)}\` 的左右子树都回来了：左 **\`${a}\`**、右 **\`${o}\`**。算自己的高度：\`1 + max(${a}, ${o}) = ${u}\` —— **那个 \`1\` 是把自己这一层算上**，这是本题唯一容易漏的地方。（${m}。）`+(p?` **根算完了，答案就是它：\`${u}\`。** 注意在这之前，中间任何一帧都没有人能提前说出最终答案 —— 高度是从最深的叶子一层层冒上来的，必须等根拿到左右两个数才定得下来。`:` 把这个高度汇报给父节点。`),{current:e.id,leftH:a,rightH:o,height:u}),d.pop()}return f(`done`,`递归结束，栈空了。**最大深度 = \`${c}\`**。回头看整条链路：叶子报 \`1\` → 父节点 \`1 + max(…) \` → 一层层加 1 → 根报出最终答案。**每个节点只被访问一次**，所以是 O(n)。另外注意 104 全程**没有任何全局变量** —— 答案不是"一路取 max 攒出来的"，而是根那一次计算的返回值本身。（对比 LC 124 的 \`best\`：那个才是需要一路刷新的全局最优。）`,{current:n,height:c,done:!0}),o}var s=`md-styles`,c=24,l=96,u=78,d=26,f=40,p=52,m=1150,h=48,g=`
.md {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.md__svg { width: 100%; height: auto; display: block; }

/* ── 节点 ─────────────────────────────────────────────────────────────── */
.md-node__circle {
  fill: var(--md-fill, #ffffff);
  stroke: var(--md-line, #9aa39c);
  stroke-width: 2;
}
.md-node__value {
  fill: var(--md-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 节点正上方的高度标签：算完了才出现 */
.md-node__htag {
  fill: var(--md-paper, #f4f2ec);
  stroke: var(--md-line, #9aa39c);
  stroke-width: 1.5;
}
.md-node__htag-text {
  fill: var(--md-ink, #1f2a24);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 当前焦点节点的强调环 */
.md-node__ring {
  fill: none;
  stroke: var(--md-hot, #a45f45);
  stroke-width: 3.5;
  opacity: 0;
}

.md-node.is-done .md-node__circle {
  fill: var(--md-ok-fill, #eef5f1);
  stroke: var(--md-ok, #3f6b57);
  stroke-width: 2.5;
}
.md-node.is-done .md-node__htag {
  stroke: var(--md-ok, #3f6b57);
}
.md-node.is-done .md-node__htag-text {
  fill: var(--md-ok, #3f6b57);
}
.md-node.is-visit .md-node__circle {
  stroke: var(--md-hot, #a45f45);
  stroke-width: 3;
}
.md-node.is-visit .md-node__ring { opacity: 1; }
/* 这一帧刚刚算出高度的节点：标签换成暖色，强调"新冒出来的那个数" */
.md-node.is-fresh .md-node__htag {
  fill: var(--md-hot-fill, #fdf1ec);
  stroke: var(--md-hot, #a45f45);
  stroke-width: 2;
}
.md-node.is-fresh .md-node__htag-text {
  fill: var(--md-hot, #a45f45);
}

/* ── 边 ───────────────────────────────────────────────────────────────── */
.md-edge { stroke: var(--md-edge, #8b948c); stroke-width: 2; fill: none; }
/* 当前递归路径上的边（栈里相邻两帧之间） */
.md-edge.is-onstack {
  stroke: var(--md-hot, #a45f45);
  stroke-width: 3.5;
}

/* ── 结果横幅 ─────────────────────────────────────────────────────────── */
.md-banner__box {
  fill: var(--md-banner-fill, #f4f2ec);
  stroke: var(--md-line, #9aa39c);
  stroke-width: 1.5;
}
.md-banner__lead {
  fill: var(--md-ok, #3f6b57);
  font-size: 17px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.md-banner__answer-label {
  fill: var(--md-muted, #657168);
  font-size: 12px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.md-banner__answer {
  fill: var(--md-ink, #1f2a24);
  font-size: 24px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 根算完之前答案未知 —— 用灰色问号强调"还说不出来" */
.md-banner__answer.is-unknown {
  fill: var(--md-dim, #b9b9b3);
}

.md-empty__text {
  fill: var(--md-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function ee(){if(document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=g,document.head.appendChild(e)}function _(g,_={}){if(!g||g.dataset.mdMounted===`1`)return{destroy(){}};g.dataset.mdMounted=`1`,ee();let v=o(_),y=_.autoplay!==!1,{nodes:b,root:x}=a(Array.isArray(_.values)?_.values:[3,9,20,null,null,15,7]),S=e=>e==null||!b[e]?null:b[e].value,C=r,w=b.length,T=document.createElement(`div`);T.className=`viz md`;let E=document.createElement(`div`);E.className=`viz__stage`,T.appendChild(E);function D(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(x===-1){let e=C(`svg`,{class:`viz__svg md__svg`,viewBox:`0 0 620 120`,role:`img`}),t=C(`text`,{class:`md-empty__text`,x:620/2,y:120/2});return t.textContent=`空树 —— 深度记 0（这就是递归的出口条件）`,e.appendChild(t),E.appendChild(e),T.appendChild(D()),T.appendChild(i().root),g.textContent=``,g.appendChild(T),{destroy(){g.textContent=``,delete g.dataset.mdMounted,document.getElementById(s)?.remove()}}}let O=b.reduce((e,t)=>Math.max(e,t.depth),0),k=Math.min(120,Math.max(58,Math.round(470/2**O))),A=new Map;A.set(x,[]);for(let e of b)e.parent!==-1&&A.set(e.id,[...A.get(e.parent)??[],e.side]);let j=e=>k*2**Math.max(0,O-e),te=e=>{let t=0;for(let n of A.get(e.id)??[])t=t*2+ +(n===`R`);return(t+.5)*j(e.depth)},M=2**O*k,N=Math.max(660,d+M+68),P=(N-M)/2,F=e=>u+e*l,I=e=>({x:P+te(b[e]),y:F(b[e].depth)}),L=u+O*l+c+f,R=Math.min(620,N-d*2),z=C(`svg`,{class:`viz__svg md__svg`,viewBox:`0 0 ${N} ${L+p+26}`,role:`img`,"aria-label":`二叉树最大深度推演动画`});E.appendChild(z);let B=C(`g`,{class:`md-edges`}),V=C(`g`,{class:`md-nodes`}),H=C(`g`,{class:`md-labels`});z.appendChild(B),z.appendChild(V),z.appendChild(H);let U=new Map;for(let e of b){if(e.parent===-1)continue;let t=I(e.parent),n=I(e.id),r=C(`path`,{class:`md-edge`,d:`M ${t.x} ${t.y+c} L ${n.x} ${n.y-c}`});B.appendChild(r),U.set(e.id,r)}let W=e=>{if(e.parent===-1)return 0;let t=e.side===`L`?b[e.parent].right:b[e.parent].left;if(t==null)return 0;let n=Math.abs(I(e.id).x-I(t).x);if(n>=56)return 0;let r=(56-n)/2+3;return e.side===`L`?-r:r},G=[];for(let e of b){let t=I(e.id),n=C(`g`,{class:`md-node`,transform:`translate(${t.x} ${t.y})`});n.appendChild(C(`circle`,{class:`md-node__ring`,r:31})),n.appendChild(C(`circle`,{class:`md-node__circle`,cx:0,cy:0,r:c}));let r=C(`text`,{class:`md-node__value`,x:0,y:0});r.textContent=String(e.value),n.appendChild(r),V.appendChild(n);let i=C(`g`,{class:`md-node__htag-g`,transform:`translate(${t.x+W(e)} ${t.y})`});i.appendChild(C(`rect`,{class:`md-node__htag`,x:-48/2,y:-56,width:h,height:22,rx:7}));let a=C(`text`,{class:`md-node__htag-text`,x:0,y:-45});i.appendChild(a),H.appendChild(i),G.push({g:n,gainG:i,gt:a,id:e.id})}let K=C(`g`,{class:`md-banner`});K.appendChild(C(`rect`,{class:`md-banner__box`,x:d,y:L,width:R,height:p,rx:9}));let q=C(`text`,{class:`md-banner__lead`,x:42,y:L+p/2});K.appendChild(q);let J=C(`text`,{class:`md-banner__answer-label`,x:d+R-74,y:L+p/2});J.textContent=`最大深度`,K.appendChild(J);let Y=C(`text`,{class:`md-banner__answer`,x:d+R-16,y:L+p/2});K.appendChild(Y),z.appendChild(K);let X=D();function ne(t,n){if(!n)return;let r=n.stack.length?n.stack[n.stack.length-1].id:null,i=n.current,a=e=>Object.prototype.hasOwnProperty.call(n.heightOf,e),o=new Set;for(let e=0;e+1<n.stack.length;e+=1)o.add(n.stack[e+1].id);let s=n.height===null?null:i;for(let e of G){let{id:t,g:i,gainG:o,gt:c}=e,l=[`md-node`],u=a(t);u&&l.push(`is-done`),t===r&&l.push(`is-visit`),t===s&&l.push(`is-fresh`),i.setAttribute(`class`,l.join(` `)),u?(o.style.opacity=`1`,c.textContent=`h=${n.heightOf[t]}`):o.style.opacity=`0`}for(let e of b)e.parent!==-1&&U.get(e.id).setAttribute(`class`,o.has(e.id)?`md-edge is-onstack`:`md-edge`);n.phase===`init`?q.textContent=`从根 ${S(x)} 开始，先下去问子树`:n.phase===`recurse`?q.textContent=n.leftH===null?`进入 ${S(i)}，继续往下问`:`左子树回报 h=${n.leftH}，继续问右边`:n.phase===`leaf`?q.textContent=`${S(i)} 是叶子 → h = 1 + max(0, 0) = 1`:n.phase===`compute`?q.textContent=`${S(i)}：1 + max(${n.leftH}, ${n.rightH}) = ${n.height}`:q.textContent=n.answer===0?`空树：深度记 0`:`根 ${S(x)} 报出 h=${n.answer} —— 这就是答案`;let c=n.answer;c===null?(Y.textContent=`?`,Y.setAttribute(`class`,`md-banner__answer is-unknown`)):(Y.textContent=String(c),Y.setAttribute(`class`,`md-banner__answer`)),e(X,n.desc)}T.appendChild(X);let Z=i();T.appendChild(Z.root),g.textContent=``,g.appendChild(T),n();let re=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:v,controls:Z,intervalMs:m,onRender:ne});Q.jumpTo(Math.trunc(_.initialStep)||0);let $=null;return y&&!re&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(T)),T.setAttribute(`aria-description`,`共 ${w} 个节点`),{destroy(){$&&=($.disconnect(),null),Q.destroy(),g.textContent=``,delete g.dataset.mdMounted,document.getElementById(s)?.remove()}}}export{_ as mountMaxDepth};