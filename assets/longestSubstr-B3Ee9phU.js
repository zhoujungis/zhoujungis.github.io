import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";function a(e={}){let t=typeof e.values==`string`?e.values:`abcabcbb`,n=Array.from(t),r=n.length,i=Number.isInteger(e.maxSteps)?e.maxSteps:400,a={right:-1,left:0,prevLeft:null,ch:null,hitIdx:null,outsideWindow:!1,lastSeen:{},windowLen:0,ans:0,bestRange:null};if(r===0)return[{...a,phase:`done`,desc:"**空串** —— 一个字符都没有，最长无重复子串的长度是 `0`。",done:!0}];let o=[],s={},c=0,l=0,u=null,d=0,f=(e,t,n={})=>{o.push({phase:e,desc:t,right:-1,left:c,prevLeft:null,ch:null,hitIdx:null,outsideWindow:!1,lastSeen:{...s},windowLen:0,ans:l,bestRange:u?[...u]:null,done:e===`done`,...n})};f(`init`,`要在 \`${t}\`（${r} 个字符）里找**最长的不含重复字符的子串**。用**滑动窗口**：\`right\` 一路往右扩张，把字符一个个吃进窗口；一旦吃进来的字符**在窗口内已经出现过**，就让 \`left\` 跳到"那个旧位置 + 1"，把它挤出窗口。两个指针都只往右走，所以整体是 O(n)。维护一张表 \`lastSeen\`，记每个字符最后出现在哪 —— 这就是"一眼看出重不重复"的依据。`);for(let e=0;e<r&&(d+=1,!(d>i));e+=1){let t=n[e],r=s[t],i=r!==void 0&&r<c;if(r!==void 0&&r>=c){let n=c;c=r+1,s[t]=e;let i=e-c+1,a=i>l;a&&(l=i,u=[c,e]),f(`slide`,`\`right\` 走到 \`${e}\`，字符是 **\`${t}\`**。它上次出现在下标 \`${r}\`，**而这个位置还在窗口里**（\`${r} >= left = ${n}\`）—— 构成重复。于是 \`left\` 从 \`${n}\` 跳到 \`${r} + 1 = ${c}\`，把旧的 \`${t}\` 挤出窗口。注意 **\`left\` 只会往右跳，绝不会退回去** —— 这是滑动窗口正确性的根基。现在窗口是 \`[${c}, ${e}]\`，长度 \`${i}\``+(a?`，**刷新了答案 → \`ans = ${l}\`**。`:`，没超过当前的 \`ans = ${l}\`。`),{right:e,left:c,prevLeft:n,ch:t,hitIdx:r,windowLen:i});continue}s[t]=e;let a=e-c+1,o=a>l;o&&(l=a,u=[c,e]),f(`expand`,`\`right\` 走到 \`${e}\`，字符是 **\`${t}\`**。`+(i?`它**出现过**（下标 \`${r}\`），但那个位置**已经在窗口左边之外**了（\`${r} < left = ${c}\`）—— 它早就被挤出窗口，现在再遇到**不算重复**，所以 \`left\` 原地不动。**这一步就是"只看位置是否还在窗口内"这个判据的价值所在**：如果这里无脑写 \`left = ${r} + 1\`，左指针就会倒退回 \`${r+1}\`。`:`它还没在窗口里出现过，直接吃进来。`)+` 现在窗口是 \`[${c}, ${e}]\`，长度 **\`${a}\`**`+(o?`，**刷新了答案 → \`ans = ${l}\`**。`:`，没超过当前的 \`ans = ${l}\`。`),{right:e,left:c,ch:t,hitIdx:i?r:null,outsideWindow:i,windowLen:a})}let p=u?n.slice(u[0],u[1]+1).join(``):``;return f(`done`,`扫描结束。**答案 = \`${l}\`**，对应的窗口是 \`[${u?.[0]}, ${u?.[1]}]\`，内容 \`"${p}"\`。回头看整条链路：\`right\` 一共推进了 ${r} 次，\`left\` 也从头到尾**只往右走、从不后退**，两个指针加起来总移动量不超过 \`2n\` —— 所以是**严格的 O(n)**，而不是"外层枚举左端点 × 内层枚举右端点"的 O(n²)。空间是 O(min(n, 字符集大小))：\`lastSeen\` 每个不同字符只占一条。`,{left:c,right:r-1,windowLen:r-c,done:!0}),o}var o=`ls-styles`,s=54,c=52,l=6,u=136,d=22,f=196,p=206,ee=9,m=242,te=282,ne=296,re=46,h=26,ie=50,ae=1150,g=604,_=`
.ls {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.ls__svg { width: 100%; height: auto; display: block; }

/* ── 字符格子 ─────────────────────────────────────────────────────────── */
.ls-cell__box {
  fill: var(--ls-fill, #ffffff);
  stroke: var(--ls-line, #c3c9c2);
  stroke-width: 1.5;
}
.ls-cell__text {
  fill: var(--ls-ink, #1f2a24);
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 在窗口里 */
.ls-cell.is-in .ls-cell__box {
  fill: var(--ls-ok-fill, #eef5f1);
  stroke: var(--ls-ok, #3f6b57);
  stroke-width: 2;
}
/* 已经被 left 挤出窗口（还在右边等着被重新吃进来） */
.ls-cell.is-out .ls-cell__box {
  fill: var(--ls-dim-fill, #f2f2ef);
  stroke: var(--ls-dim, #c9cdc7);
}
.ls-cell.is-out .ls-cell__text {
  fill: var(--ls-dim, #b9b9b3);
}
/* 这一帧正在处理的字符 */
.ls-cell.is-cur .ls-cell__box {
  fill: var(--ls-hot-fill, #fdf1ec);
  stroke: var(--ls-hot, #a45f45);
  stroke-width: 3;
}
.ls-cell.is-cur .ls-cell__text {
  fill: var(--ls-hot, #a45f45);
}

/* ── 窗口条 ───────────────────────────────────────────────────────────── */
.ls-win__bar {
  fill: var(--ls-ok-fill, #eef5f1);
  stroke: var(--ls-ok, #3f6b57);
  stroke-width: 1.5;
}
.ls-win__best {
  stroke: var(--ls-gold, #c2872f);
  stroke-width: 3;
}
/* L / R 的引出线用和标签同色的实线 —— 初版和"最优窗口"共用金色虚线样式，
 * 结果两种线在画面上分不清谁是谁。 */
.ls-win__tick {
  stroke: var(--ls-hot, #a45f45);
  stroke-width: 1.5;
}
.ls-win__tick.is-r {
  stroke: var(--ls-ok, #3f6b57);
}
.ls-win__pin {
  fill: var(--ls-hot, #a45f45);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ls-win__pin.is-r {
  fill: var(--ls-ok, #3f6b57);
}
.ls-win__empty {
  fill: var(--ls-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── right 指针 ───────────────────────────────────────────────────────── */
.ls-rpin__tri {
  fill: var(--ls-hot, #a45f45);
}
.ls-rpin__text {
  fill: var(--ls-hot, #a45f45);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── lastSeen 表 ──────────────────────────────────────────────────────── */
.ls-table__title {
  fill: var(--ls-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ls-card__box {
  fill: var(--ls-fill, #ffffff);
  stroke: var(--ls-line, #c3c9c2);
  stroke-width: 1.5;
}
.ls-card__ch {
  fill: var(--ls-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ls-card__idx {
  fill: var(--ls-muted, #657168);
  font-size: 13px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 这一帧的字符对应的卡片 */
.ls-card.is-hit .ls-card__box {
  fill: var(--ls-hot-fill, #fdf1ec);
  stroke: var(--ls-hot, #a45f45);
  stroke-width: 2.5;
}
.ls-card.is-hit .ls-card__ch {
  fill: var(--ls-hot, #a45f45);
}
.ls-card.is-hit .ls-card__idx {
  fill: var(--ls-hot, #a45f45);
  font-weight: 700;
}
/* 被高亮的"旧位置"数字（讲清楚它就在这儿） */
.ls-card.is-hit .ls-card__idx.is-old {
  fill: var(--ls-gold, #c2872f);
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.ls-banner__box {
  fill: var(--ls-banner-fill, #f4f2ec);
  stroke: var(--ls-line, #c3c9c2);
  stroke-width: 1.5;
}
.ls-banner__lead {
  fill: var(--ls-ink, #1f2a24);
  font-size: 15px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ls-banner__label {
  fill: var(--ls-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ls-banner__ans {
  fill: var(--ls-ok, #3f6b57);
  font-size: 24px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.ls-empty__text {
  fill: var(--ls-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function oe(){if(document.getElementById(o))return;let e=document.createElement(`style`);e.id=o,e.textContent=_,document.head.appendChild(e)}function v(_,v={}){if(!_||_.dataset.lsMounted===`1`)return{destroy(){}};_.dataset.lsMounted=`1`,oe();let se=a(v),ce=v.autoplay!==!1,y=typeof v.values==`string`?v.values:`abcabcbb`,b=Array.from(y),x=b.length,S=r,C=document.createElement(`div`);C.className=`viz ls`;let w=document.createElement(`div`);w.className=`viz__stage`,C.appendChild(w);function le(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(x===0){let e=S(`svg`,{class:`viz__svg ls__svg`,viewBox:`0 0 620 120`,role:`img`}),t=S(`text`,{class:`ls-empty__text`,x:620/2,y:120/2});return t.textContent=`空串 —— 没有字符，答案是 0`,e.appendChild(t),w.appendChild(e),C.appendChild(le()),C.appendChild(i().root),_.textContent=``,_.appendChild(C),{destroy(){_.textContent=``,delete _.dataset.lsMounted,document.getElementById(o)?.remove()}}}let T=c,E=l,D=17,O=x*T+(x-1)*E;if(O>g){let e=g/O;T=Math.max(20,Math.floor(T*e)),E=Math.max(3,Math.floor(E*e)),D=Math.max(11,Math.round(D*e))}let k=x*T+(x-1)*E,A=Math.max(660,h*2+k+68),ue=(A-k)/2,j=e=>ue+e*(T+E),M=Math.min(620,A-h*2),N=S(`svg`,{class:`viz__svg ls__svg`,viewBox:`0 0 ${A} 452`,role:`img`,"aria-label":`无重复字符的最长子串推演动画`});w.appendChild(N);let P=S(`g`,{class:`ls-bands`}),F=S(`g`,{class:`ls-cells`}),I=S(`g`,{class:`ls-marks`});N.appendChild(P),N.appendChild(F),N.appendChild(I);let L=S(`rect`,{class:`ls-win__bar`,x:0,y:p,width:0,height:ee,rx:4});P.appendChild(L);let R=S(`line`,{class:`ls-win__best`,x1:0,y1:f,x2:0,y2:f});P.appendChild(R);let z=S(`text`,{class:`ls-win__pin`,x:0,y:m}),B=S(`text`,{class:`ls-win__pin is-r`,x:0,y:m}),V=S(`line`,{class:`ls-win__tick`,x1:0,y1:215,x2:0,y2:m-8}),H=S(`line`,{class:`ls-win__tick is-r`,x1:0,y1:215,x2:0,y2:m-8});I.appendChild(V),I.appendChild(H),I.appendChild(z),I.appendChild(B);let U=S(`text`,{class:`ls-win__empty`,x:h,y:m});U.textContent=`窗口还没开始滑动 —— 按播放看 right 怎么一步步往右吃字符`,I.appendChild(U);let W=S(`path`,{class:`ls-rpin__tri`,d:`M 0 0 L 0 0 L 0 0`}),G=S(`text`,{class:`ls-rpin__text`,x:0,y:0});G.textContent=`right`,I.appendChild(W),I.appendChild(G);let K=[];for(let e=0;e<x;e+=1){let t=j(e),n=S(`g`,{class:`ls-cell`});n.appendChild(S(`rect`,{class:`ls-cell__box`,x:t,y:u,width:T,height:s,rx:7}));let r=S(`text`,{class:`ls-cell__text`,x:t+T/2,y:163,style:`font-size:${D}px`});r.textContent=b[e],n.appendChild(r),F.appendChild(n),K.push({g:n,id:e})}let q=new Set(b).size,J=q>10?5:8,Y=Math.max(28,Math.min(56,Math.floor((g-(q-1)*J)/q))),de=(A-(q*Y+(q-1)*J))/2,fe=S(`text`,{class:`ls-table__title`,x:de,y:te});fe.textContent=`lastSeen：每个字符最后出现在哪个下标`,I.appendChild(fe);let pe=[];for(let e=0;e<q;e+=1){let t=de+e*(Y+J),n=S(`g`,{class:`ls-card`});n.appendChild(S(`rect`,{class:`ls-card__box`,x:t,y:ne,width:Y,height:re,rx:7}));let r=S(`text`,{class:`ls-card__ch`,x:t+Y/2,y:311});n.appendChild(r);let i=S(`text`,{class:`ls-card__idx`,x:t+Y/2,y:329});n.appendChild(i),I.appendChild(n),pe.push({g:n,chT:r,idxT:i,x:t})}let X=S(`g`,{class:`ls-banner`});X.appendChild(S(`rect`,{class:`ls-banner__box`,x:h,y:376,width:M,height:ie,rx:9}));let Z=S(`text`,{class:`ls-banner__lead`,x:42,y:401});X.appendChild(Z);let me=S(`text`,{class:`ls-banner__label`,x:h+M-74,y:401});me.textContent=`ans`,X.appendChild(me);let he=S(`text`,{class:`ls-banner__ans`,x:h+M-16,y:401});X.appendChild(he),N.appendChild(X);let ge=le();function _e(t,n){if(!n)return;let r=n.bestRange,i=n.phase===`done`&&r,a=i?r[0]:n.left,o=i?r[1]:n.right,s=n.lastSeen??{};for(let e of K){let{g:t,id:r}=e,i=[`ls-cell`];o>=0&&r>=a&&r<=o?i.push(`is-in`):(o>=0&&r<a||n.phase!==`init`)&&i.push(`is-out`),r===o&&i.push(`is-cur`),t.setAttribute(`class`,i.join(` `))}let c=o>=0;if(c){let e=j(a),t=j(o)+T;L.setAttribute(`x`,e),L.setAttribute(`width`,Math.max(4,t-e)),L.style.opacity=`1`;let n=j(a)+T/2,r=j(o)+T/2;V.setAttribute(`x1`,n),V.setAttribute(`x2`,n),z.setAttribute(`x`,n),V.style.opacity=`1`,z.style.opacity=`1`,a===o?(z.textContent=`L=R=${a}`,B.style.opacity=`0`,H.style.opacity=`0`):(z.textContent=`L=${a}`,H.setAttribute(`x1`,r),H.setAttribute(`x2`,r),B.setAttribute(`x`,r),B.textContent=`R=${o}`,B.style.opacity=`1`,H.style.opacity=`1`),U.style.opacity=`0`}else L.style.opacity=`0`,V.style.opacity=`0`,H.style.opacity=`0`,z.style.opacity=`0`,B.style.opacity=`0`,U.style.opacity=`1`;if(r?(R.setAttribute(`x1`,j(r[0])),R.setAttribute(`x2`,j(r[1])+T),R.style.opacity=`1`):R.style.opacity=`0`,c){let e=j(o)+T/2,t=u-d;W.setAttribute(`d`,`M ${e-6} ${t-10} L ${e+6} ${t-10} L ${e} ${t} z`),G.setAttribute(`x`,e),G.setAttribute(`y`,t-20),W.style.opacity=`1`,G.style.opacity=`1`}else W.style.opacity=`0`,G.style.opacity=`0`;let l=Object.keys(s),f=n.ch;if(pe.forEach((e,t)=>{let r=l[t];if(r===void 0){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`,e.chT.textContent=r;let i=r===f&&n.phase!==`done`,a=i&&n.hitIdx!==null&&(n.phase===`slide`||n.outsideWindow===!0);e.idxT.textContent=String(a?n.hitIdx:s[r]),e.g.setAttribute(`class`,i?`ls-card is-hit`:`ls-card`),e.idxT.setAttribute(`class`,a?`ls-card__idx is-old`:`ls-card__idx`)}),n.phase===`init`)Z.textContent=`字符串 "${y}"，共 ${x} 个字符`;else if(n.phase===`done`){let e=r?b.slice(r[0],r[1]+1).join(``):``;Z.textContent=`最长无重复子串 "${e}"`}else{let e=b.slice(a,o+1).join(``);Z.textContent=`窗口 [${a}, ${o}] = "${e}"  长度 ${n.windowLen}`}he.textContent=String(n.ans),e(ge,n.desc)}C.appendChild(ge);let ve=i();C.appendChild(ve.root),_.textContent=``,_.appendChild(C),n();let ye=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:se,controls:ve,intervalMs:ae,onRender:_e});Q.jumpTo(Math.trunc(v.initialStep)||0);let $=null;return ce&&!ye&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(C)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),_.textContent=``,delete _.dataset.lsMounted,document.getElementById(o)?.remove()}}}export{v as mountLongestSubstr};