import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";function a(e={}){let t=Array.isArray(e.nums)?e.nums:[2,7,11,15],n=Number.isInteger(e.target)?e.target:9,r=t.length,i=Number.isInteger(e.maxSteps)?e.maxSteps:400,a={i:-1,x:null,need:null,hitIdx:null,seen:{},answer:null};if(r===0)return[{...a,phase:`done`,desc:`**空数组** —— 没有任何元素，凑不出两个数。题目保证有解，所以这不会发生，但状态机要有安静的出口。`,done:!0}];let o=[],s={},c=null,l=0,u=e=>Object.prototype.hasOwnProperty.call(s,e),d=()=>Object.keys(s).length===0?`{}`:`{${Object.entries(s).map(([e,t])=>`${e}→${t}`).join(`, `)}}`,f=(e,t,n={})=>{o.push({phase:e,desc:t,i:-1,x:null,need:null,hitIdx:null,seen:{...s},answer:c?[...c]:null,done:e===`done`,...n})};f(`init`,`要在 \`[${t.join(`, `)}]\` 里找出**两个数**，使它们的和等于 \`target = ${n}\`，返回它们的**下标**。暴力做法是"选一个 i 再往后试每个 j"，O(n²)。换个方向想：**站在 i 的位置，问一句"我需要的那个数 \`${n} - x\`，之前出现过吗？"** ——那就在遍历时顺手用一张表记下"见过的值和它的下标"。**顺序很关键：先查表，再把自己登记进去**（原因见后面第 3 轮）。`);for(let e=0;e<r&&(l+=1,!(l>i));e+=1){let r=t[e],i=n-r,a=u(i),o=a?s[i]:null;if(a){c=[o,e],f(`hit`,`\`i = ${e}\`，当前元素 \`x = ${r}\`。我想要的那个数是 \`${n} - ${r} = ${i}\`。**去表里查一下 —— 找到了！** \`${i}\` 在下标 \`${o}\`（表里当时是 \`${d()}\`）。于是 \`nums[${o}] + nums[${e}] = ${i} + ${r} = ${n}\` ✓。注意 \`${o} < ${e}\` —— **命中位置一定在当前元素左边**，因为查表发生在"把自己放进去"之前，表里根本还没有自己。这正是"同一元素不能重复使用"这条约束被自动满足的原因。`,{i:e,x:r,need:i,hitIdx:o});break}f(`miss`,`\`i = ${e}\`，当前元素 \`x = ${r}\`。我想要的那个数是 \`${n} - ${r} = ${i}\`。**去表里查一下 —— 没有。**`+(Object.keys(s).length===0?`表此刻还是空的（前面没有任何元素），所以必然查不到。`:`表里现在装的是 \`${d()}\`，没有 \`${i}\`。`)+` 那就**再把自己登记进去**，供后面的元素来查。`,{i:e,x:r,need:i}),s[r]=e,f(`put`,`把 \`${r} → ${e}\` 存进表，表变成 \`${d()}\`。**注意这一步必须在"查表"之后** —— 如果反过来先登记自己，当 \`target = 2 × x\` 时就会查到**自己**，返回一个 \`[i, i]\` 这种把同一个位置用了两次的假答案。（文章第三节用 \`[3, 3]\` 配 \`target = 6\` 演了这件事。）`,{i:e,x:r,need:i})}if(c){let[e,r]=c;f(`verify`,`验证一遍：\`nums[${e}] + nums[${r}] = ${t[e]} + ${t[r]} = ${t[e]+t[r]}\`，正好等于 \`target = ${n}\` ✓。返回 **\`[${e}, ${r}]\`**。整个过程只扫了一遍数组，每个元素做 O(1) 的查表 + 登记 —— 所以是 **O(n) 时间**、**O(n) 空间**（最坏情况整张表都要装下来）。`,{i:r,x:t[r]})}return f(`done`,c?`**答案 = \`[${c[0]}, ${c[1]}]\`**。回头看这题的两句关键代码：\`if need in seen\` 和 \`seen[x] = i\` —— **先查再存，顺序不能反。** 它一次就同时解决了两件事："用哈希把查找降到 O(1)"和"保证不重复使用同一个元素"。另外提醒一句：题目给的前提是"**只存在一个有效答案**"，所以这里可以命中就立刻返回；如果要求**所有**满足条件的下标对，就不能提前 return，而且表里要存"值 → 下标列表"。`:`扫描结束，**没有找到**任何一对和为 \`${n}\` 的数。（题目保证有解，所以这不会发生在合法输入上。）`,{i:r-1,x:t[r-1],done:!0}),o}var o=`ts-styles`,s=56,c=76,l=8,u=130,d=20,f=214,ee=272,te=288,p=48,m=26,ne=52,re=1400,h=604,g=`
.ts {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.ts__svg { width: 100%; height: auto; display: block; }

/* ── 数组格子 ─────────────────────────────────────────────────────────── */
.ts-cell__box {
  fill: var(--ts-fill, #ffffff);
  stroke: var(--ts-line, #c3c9c2);
  stroke-width: 1.5;
}
.ts-cell__value {
  fill: var(--ts-ink, #1f2a24);
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ts-cell__idx {
  fill: var(--ts-muted, #657168);
  font-size: 13px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 已经登记进哈希表 */
.ts-cell.is-seen .ts-cell__box {
  fill: var(--ts-ok-fill, #eef5f1);
  stroke: var(--ts-ok, #3f6b57);
  stroke-width: 1.5;
}
/* 当前正在处理的元素 */
.ts-cell.is-cur .ts-cell__box {
  fill: var(--ts-hot-fill, #fdf1ec);
  stroke: var(--ts-hot, #a45f45);
  stroke-width: 3;
}
.ts-cell.is-cur .ts-cell__value {
  fill: var(--ts-hot, #a45f45);
}
/* 答案的两个元素 */
.ts-cell.is-answer .ts-cell__box {
  fill: var(--ts-gold-fill, #fdf6e8);
  stroke: var(--ts-gold, #c2872f);
  stroke-width: 3;
}
.ts-cell.is-answer .ts-cell__value {
  fill: var(--ts-gold, #c2872f);
}
.ts-cell__ring {
  fill: none;
  stroke: var(--ts-gold, #c2872f);
  stroke-width: 2;
  opacity: 0;
}
.ts-cell.is-answer .ts-cell__ring { opacity: 1; }

/* ── i 指针 ───────────────────────────────────────────────────────────── */
.ts-ipin__tri { fill: var(--ts-hot, #a45f45); }
.ts-ipin__text {
  fill: var(--ts-hot, #a45f45);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 答案连线 ─────────────────────────────────────────────────────────── */
.ts-arc {
  fill: none;
  stroke: var(--ts-gold, #c2872f);
  stroke-width: 2.5;
  stroke-dasharray: 6 4;
}

/* ── 哈希表 ───────────────────────────────────────────────────────────── */
.ts-table__title {
  fill: var(--ts-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ts-card__box {
  fill: var(--ts-fill, #ffffff);
  stroke: var(--ts-line, #c3c9c2);
  stroke-width: 1.5;
}
.ts-card__key {
  fill: var(--ts-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ts-card__val {
  fill: var(--ts-muted, #657168);
  font-size: 13px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 这一帧刚存进去的那张卡 */
.ts-card.is-new .ts-card__box {
  fill: var(--ts-ok-fill, #eef5f1);
  stroke: var(--ts-ok, #3f6b57);
  stroke-width: 2.5;
}
.ts-card.is-new .ts-card__key { fill: var(--ts-ok, #3f6b57); }
/* 被查中的那张卡 */
.ts-card.is-hit .ts-card__box {
  fill: var(--ts-gold-fill, #fdf6e8);
  stroke: var(--ts-gold, #c2872f);
  stroke-width: 3;
}
.ts-card.is-hit .ts-card__key { fill: var(--ts-gold, #c2872f); }
.ts-card.is-hit .ts-card__val {
  fill: var(--ts-gold, #c2872f);
  font-weight: 700;
}
.ts-table__empty {
  fill: var(--ts-dim, #b9b9b3);
  font-size: 13px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.ts-banner__box {
  fill: var(--ts-banner-fill, #f4f2ec);
  stroke: var(--ts-line, #c3c9c2);
  stroke-width: 1.5;
}
.ts-banner__box.is-answer {
  fill: var(--ts-gold-fill, #fdf6e8);
  stroke: var(--ts-gold, #c2872f);
  stroke-width: 2;
}
.ts-banner__lead {
  fill: var(--ts-ink, #1f2a24);
  font-size: 15.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ts-banner__label {
  fill: var(--ts-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ts-banner__ans {
  fill: var(--ts-gold, #c2872f);
  font-size: 21px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.ts-empty__text {
  fill: var(--ts-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function ie(){if(document.getElementById(o))return;let e=document.createElement(`style`);e.id=o,e.textContent=g,document.head.appendChild(e)}function _(g,_={}){if(!g||g.dataset.tsMounted===`1`)return{destroy(){}};g.dataset.tsMounted=`1`,ie();let ae=a(_),oe=_.autoplay!==!1,v=Array.isArray(_.nums)?_.nums:[2,7,11,15],y=Number.isInteger(_.target)?_.target:9,b=v.length,x=r,S=document.createElement(`div`);S.className=`viz ts`;let C=document.createElement(`div`);C.className=`viz__stage`,S.appendChild(C);function w(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(b===0){let e=x(`svg`,{class:`viz__svg ts__svg`,viewBox:`0 0 620 120`,role:`img`}),t=x(`text`,{class:`ts-empty__text`,x:620/2,y:120/2});return t.textContent=`空数组 —— 凑不出两个数`,e.appendChild(t),C.appendChild(e),S.appendChild(w()),S.appendChild(i().root),g.textContent=``,g.appendChild(S),{destroy(){g.textContent=``,delete g.dataset.tsMounted,document.getElementById(o)?.remove()}}}let T=c,E=l,D=20,O=b*T+(b-1)*E;if(O>h){let e=h/O;T=Math.max(28,Math.floor(T*e)),E=Math.max(4,Math.floor(E*e)),D=Math.max(12,Math.round(D*e))}let k=b*T+(b-1)*E,A=Math.max(660,m*2+k+68),se=(A-k)/2,j=e=>se+e*(T+E),M=Math.min(620,A-m*2),N=x(`svg`,{class:`viz__svg ts__svg`,viewBox:`0 0 ${A} 450`,role:`img`,"aria-label":`两数之和推演动画`});C.appendChild(N);let P=x(`g`,{class:`ts-arcs`}),F=x(`g`,{class:`ts-cells`}),I=x(`g`,{class:`ts-marks`});N.appendChild(P),N.appendChild(F),N.appendChild(I);let L=x(`path`,{class:`ts-arc`,d:`M 0 0`});P.appendChild(L);let R=[];for(let e=0;e<b;e+=1){let t=j(e),n=x(`g`,{class:`ts-cell`});n.appendChild(x(`rect`,{class:`ts-cell__ring`,x:t-5,y:u-5,width:T+10,height:66,rx:11})),n.appendChild(x(`rect`,{class:`ts-cell__box`,x:t,y:u,width:T,height:s,rx:8}));let r=x(`text`,{class:`ts-cell__value`,x:t+T/2,y:158,style:`font-size:${D}px`});r.textContent=String(v[e]),n.appendChild(r);let i=x(`text`,{class:`ts-cell__idx`,x:t+T/2,y:202});i.textContent=String(e),n.appendChild(i),F.appendChild(n),R.push({g:n,id:e})}let z=x(`path`,{class:`ts-ipin__tri`,d:`M 0 0 L 0 0 L 0 0`}),B=x(`text`,{class:`ts-ipin__text`,x:0,y:0});B.textContent=`i`,I.appendChild(z),I.appendChild(B);let V=x(`text`,{class:`ts-table__title`,x:m,y:ee});V.textContent=`seen：见过的值 → 它的下标`,I.appendChild(V);let H=x(`text`,{class:`ts-table__empty`,x:m,y:312});H.textContent=`（表还是空的）`,I.appendChild(H);let U=b>8?6:10,W=Math.max(40,Math.min(74,Math.floor((h-(Math.max(1,b)-1)*U)/Math.max(1,b)))),G=[];for(let e=0;e<b;e+=1){let t=m+e*(W+U),n=x(`g`,{class:`ts-card`});n.appendChild(x(`rect`,{class:`ts-card__box`,x:t,y:te,width:W,height:p,rx:8}));let r=x(`text`,{class:`ts-card__key`,x:t+W/2,y:305});n.appendChild(r);let i=x(`text`,{class:`ts-card__val`,x:t+W/2,y:323});n.appendChild(i),I.appendChild(n),G.push({g:n,k:r,val:i})}let K=x(`rect`,{class:`ts-banner__box`,x:m,y:372,width:M,height:ne,rx:9});N.appendChild(K);let q=x(`text`,{class:`ts-banner__lead`,x:42,y:398});N.appendChild(q);let J=x(`text`,{class:`ts-banner__label`,x:m+M-84,y:398});J.textContent=`答案下标`,N.appendChild(J);let Y=x(`text`,{class:`ts-banner__ans`,x:m+M-16,y:398});Y.textContent=`—`,N.appendChild(Y);let X=w();function ce(t,n){if(!n)return;let r=n.seen??{},i=n.answer,a=n.i,o=new Set(i?[i[0],i[1]]:[]),s=new Set(Object.keys(r).map(Number));for(let e of R){let{g:t,id:r}=e,i=[`ts-cell`];s.has(v[r])&&i.push(`is-seen`),r===a&&n.phase!==`done`&&i.push(`is-cur`),o.has(r)&&i.push(`is-answer`),t.setAttribute(`class`,i.join(` `))}if(a>=0&&a<b&&n.phase!==`done`){let e=j(a)+T/2,t=u-d;z.setAttribute(`d`,`M ${e-6} ${t-10} L ${e+6} ${t-10} L ${e} ${t} z`),B.setAttribute(`x`,e),B.setAttribute(`y`,t-20),B.textContent=`i=${a}`,z.style.opacity=`1`,B.style.opacity=`1`}else z.style.opacity=`0`,B.style.opacity=`0`;if(i){let e=j(i[0])+T/2,t=j(i[1])+T/2,n=(e+t)/2;L.setAttribute(`d`,`M ${e} ${f} Q ${n} 240 ${t} ${f}`),L.style.opacity=`1`}else L.style.opacity=`0`;let c=Object.entries(r);c.length===0?H.style.opacity=`1`:H.style.opacity=`0`,G.forEach((e,t)=>{let r=c[t];if(r===void 0){e.g.style.opacity=`0`;return}let[i,a]=r;e.g.style.opacity=`1`,e.k.textContent=i,e.val.textContent=`↓${a}`;let o=n.phase===`put`&&Number(i)===n.x&&a===n.i,s=n.hitIdx!==null&&Number(a)===n.hitIdx&&n.phase===`hit`;e.g.setAttribute(`class`,`ts-card${s?` is-hit`:o?` is-new`:``}`)}),K.setAttribute(`class`,i?`ts-banner__box is-answer`:`ts-banner__box`),Y.textContent=i?`[${i[0]}, ${i[1]}]`:`—`,n.phase===`init`?q.textContent=`nums = [${v.join(`, `)}]，target = ${y}`:n.phase===`miss`?q.textContent=`需要 ${y} - ${n.x} = ${n.need}，查表：没有`:n.phase===`put`?q.textContent=`把 ${n.x} → ${n.i} 登记进表`:n.phase===`hit`?q.textContent=`需要 ${y} - ${n.x} = ${n.need}，查表：命中下标 ${n.hitIdx}`:n.phase===`verify`?q.textContent=`验证 ${v[i[0]]} + ${v[i[1]]} = ${y} ✓`:q.textContent=i?`完成：nums[${i[0]}] + nums[${i[1]}] = ${y}`:`没有找到任何一对`,e(X,n.desc)}S.appendChild(X);let Z=i();S.appendChild(Z.root),g.textContent=``,g.appendChild(S),n();let le=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:ae,controls:Z,intervalMs:re,onRender:ce});Q.jumpTo(Math.trunc(_.initialStep)||0);let $=null;return oe&&!le&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(S)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),g.textContent=``,delete g.dataset.tsMounted,document.getElementById(o)?.remove()}}}export{_ as mountTwoSum};