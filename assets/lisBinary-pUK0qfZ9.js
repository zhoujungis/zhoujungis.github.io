import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[10,9,2,5,3,7,101,18];function o(e={}){let t=(Array.isArray(e.nums)?e.nums:a).slice(),n=t.length,r=[],i=(e,i,a={})=>{r.push({phase:e,desc:i,nums:t,n,i:null,x:null,tails:[],lo:null,hi:null,mid:null,goRight:null,pos:null,kind:null,prevVal:null,answer:0,done:e===`done`,...a})};if(n===0)return i(`done`,"数组为空 —— 没有任何子序列，答案是 `0`。",{done:!0}),r;i(`init`,`同一个数组 \`[${t.join(`, `)}]\`，这次要在 \`O(n log n)\` 里做完。上一版按「以 \`i\` 结尾」记账，结尾有 \`n\` 种可能，没法二分；这一版换一个锚 —— **按下标（也就是长度）记账**：\`tails[len]\` 表示**所有长度为 \`len + 1\` 的递增子序列里，末尾元素的最小值**。这个定义自带一个漂亮性质：**\`tails\` 本身严格递增**。于是每来一个 \`x\`，只要在 \`tails\` 里找**第一个 \`>= x\` 的位置**：找到了就把它换成 \`x\`（同长度下末尾更小，对后面更有利），没找到就**追加**、长度加一。**答案就是 \`tails\` 的长度。**`);let o=[];for(let e=0;e<n;e+=1){let n=t[e],r=0,a=o.length;for(;r<a;){let t=r+a>>1,s=o[t]<n;i(`bisect`,`\`i = ${e}\`（值 \`${n}\`）在 \`tails = [${o.join(`, `)}]\` 里二分，找**第一个 \`>= ${n}\` 的位置**。当前区间 \`[${r}, ${a})\`，探针 \`mid = ${t}\`：\`tails[${t}] = ${o[t]}\` —— `+(s?`\`${o[t]} < ${n}\`，这个位置**不是**答案，往右收：\`lo = ${t+1}\`。`:`\`${o[t]} >= ${n}\`，这个位置**可能就是**答案，且左边也可能有，往左收：\`hi = ${t}\`。`),{i:e,x:n,tails:o.slice(),lo:r,hi:a,mid:t,goRight:s,answer:o.length}),s?r=t+1:a=t}let s=r,c=s<o.length?`replace`:`append`,l=null;c===`replace`?(l=o[s],o[s]=n):o.push(n),i(`place`,c===`replace`?`二分收敛：区间收缩到空，\`pos = ${s}\`。\`tails[${s}] = ${l}\` 是**第一个 \`>= ${n}\` 的位置**，把它换成 \`${n}\` —— 长度 \`${s+1}\` 这一档的末尾值从 \`${l}\` 降到 \`${n}\`，**同长度下末尾更小，对后面接数更有利**。长度不变：答案仍是 \`${o.length}\`。注意：\`tails\` 里的 **\`${l}\` 被覆盖掉了**，它并不代表「原序列里 \`${l}\` 被删了」—— tails 只是登记表。`:`二分收敛：区间收缩到空，\`pos = ${s}\`，正好是 \`tails\` 的末尾之外 —— 说明 \`${n}\` 比当前所有末尾都大，可以**追加**。长度 \`${s}\` 变 \`${s+1}\`，**答案涨到 \`${o.length}\`**。`,{i:e,x:n,tails:o.slice(),lo:s,hi:s,mid:null,pos:s,kind:c,prevVal:l,answer:o.length})}return i(`done`,`\`${n}\` 个元素处理完，\`tails = [${o.join(`, `)}]\`，**答案 = 长度 = ${o.length}**。三点必须记住：① \`tails\` **不是**那条最长递增子序列 —— 它只是「每个长度下的最小末尾」登记表，位置会被后来的更小值覆盖（你可以回放看看金框那几步），但**长度一定是正确答案**；② 每个元素只做一次二分，时间 \`O(n log n)\`，\`tails\` 最多 \`O(n)\` 空间；③ 求「最长不减」子序列时二分换成 \`bisect_right\`（找第一个 \`> x\` 的位置），否则相等元素会被误替换。`,{i:n-1,tails:o.slice(),answer:o.length,done:!0}),r}var s=`lisbin-styles`,c=26,l=42,u=44,d=108,f=122,p=48,m=190,h=204,g=48,_=268,v=289,ee=306,te=324,ne=32,re=380,y=30,ie=604,ae=1e3,b=`
.lisbin {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.lisbin__svg { width: 100%; height: auto; display: block; }

.lisbin-note {
  fill: var(--lisbin-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lisbin-banner__box {
  fill: var(--lisbin-banner, #f4f3ef);
  stroke: var(--lisbin-line, #c3c9c2);
  stroke-width: 1.5;
}
.lisbin-banner__seg {
  fill: var(--lisbin-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisbin-banner__val {
  fill: var(--lisbin-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lisbin-cell__box {
  fill: var(--lisbin-fill, #ffffff);
  stroke: var(--lisbin-line, #c3c9c2);
  stroke-width: 1.5;
}
.lisbin-cell__val {
  fill: var(--lisbin-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisbin-cell__sub {
  fill: var(--lisbin-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisbin-cell__old {
  fill: var(--lisbin-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.lisbin-cell__old.is-on { opacity: 1; }
.lisbin-oldline {
  stroke: var(--lisbin-dim, #9aa39c);
  stroke-width: 1.2;
  opacity: 0;
}
.lisbin-oldline.is-on { opacity: 1; }

/* ---- 通道一：底色（搜索区间内 / 区间外） ---- */
.lisbin-cell.is-range .lisbin-cell__box { fill: var(--lisbin-ok-fill, #eef5f1); }
.lisbin-cell.is-out .lisbin-cell__box { fill: var(--lisbin-banner, #f4f3ef); }
.lisbin-cell.is-out .lisbin-cell__val { fill: var(--lisbin-dim, #9aa39c); }
/* ---- 通道二：边框 ---- */
.lisbin-cell.is-mid .lisbin-cell__box {
  stroke: var(--lisbin-hot, #a45f45);
  stroke-width: 3;
}
.lisbin-cell.is-mid .lisbin-cell__val { fill: var(--lisbin-hot, #a45f45); }
.lisbin-cell.is-pos .lisbin-cell__box {
  stroke: var(--lisbin-gold, #c2872f);
  stroke-width: 3;
}
.lisbin-cell.is-pos .lisbin-cell__val { fill: var(--lisbin-gold, #c2872f); }
.lisbin-cell.is-cur .lisbin-cell__box {
  stroke: var(--lisbin-hot, #a45f45);
  stroke-width: 3;
}
.lisbin-cell.is-cur .lisbin-cell__val { fill: var(--lisbin-hot, #a45f45); }
.lisbin-cell.is-fresh .lisbin-cell__box {
  fill: var(--lisbin-gold-fill, #fdf3e3);
  stroke: var(--lisbin-gold, #c2872f);
  stroke-width: 3;
}
.lisbin-cell.is-fresh .lisbin-cell__val { fill: var(--lisbin-gold, #c2872f); }
.lisbin-cell.is-ghost .lisbin-cell__box {
  fill: none;
  stroke: var(--lisbin-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.2;
}

.lisbin-badge__box {
  fill: var(--lisbin-hot, #a45f45);
  opacity: 0;
}
.lisbin-badge__box.is-on { opacity: 1; }
.lisbin-badge__box.is-gold { fill: var(--lisbin-gold, #c2872f); }
.lisbin-badge__text {
  fill: #ffffff;
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.lisbin-badge__text.is-on { opacity: 1; }

.lisbin-range-line {
  stroke: var(--lisbin-ok, #3f6b57);
  stroke-width: 2;
  opacity: 0;
}
.lisbin-range-line.is-on { opacity: 1; }

.lisbin-label {
  fill: var(--lisbin-muted, #657168);
  font-size: 12px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisbin-info {
  fill: var(--lisbin-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lisbin-ans__box {
  fill: var(--lisbin-banner, #f4f3ef);
  stroke: var(--lisbin-line, #c3c9c2);
  stroke-width: 1.5;
}
.lisbin-ans__box.is-hot {
  fill: var(--lisbin-gold-fill, #fdf3e3);
  stroke: var(--lisbin-gold, #c2872f);
  stroke-width: 2;
}
.lisbin-ans__text {
  fill: var(--lisbin-ink, #1f2a24);
  font-size: 14px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisbin-ans__text.is-hot { fill: var(--lisbin-gold, #c2872f); }

.lisbin-phase__text {
  fill: var(--lisbin-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function oe(){if(document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=b,document.head.appendChild(e)}function x(a,b={}){if(!a||a.dataset.lisbinMounted===`1`)return{destroy(){}};a.dataset.lisbinMounted=`1`,oe();let x=o(b),se=b.autoplay!==!1,S=x[0],ce=S.nums,C=S.n,w=r,T=document.createElement(`div`);T.className=`viz lisbin`;let E=document.createElement(`div`);E.className=`viz__stage`,T.appendChild(E);let le=()=>{let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e};if(C===0){let e=w(`svg`,{class:`viz__svg lisbin__svg`,viewBox:`0 0 620 120`,role:`img`}),t=w(`text`,{x:310,y:60,style:`fill: var(--lisbin-muted, #657168); font-size: 14px; text-anchor: middle;`});return t.textContent=`数组为空 —— 没有子序列，答案是 0`,e.appendChild(t),E.appendChild(e),T.appendChild(le()),T.appendChild(i().root),a.textContent=``,a.appendChild(T),n(),{destroy(){a.textContent=``,delete a.dataset.lisbinMounted,document.getElementById(s)?.remove()}}}let D=56;C*D+(C-1)*8>ie&&(D=Math.max(24,Math.floor((ie-(C-1)*8)/C)));let O=C*D+(C-1)*8,k=Math.max(660,y*2+O),A=(k-O)/2,j=e=>A+e*(D+8)+D/2,ue=k-y*2,M=w(`svg`,{class:`viz__svg lisbin__svg`,viewBox:`0 0 ${k} 402`,role:`img`,"aria-label":`最长递增子序列 二分 + tails 推演动画`});E.appendChild(M);let N=w(`g`,{class:`lisbin-marks`}),P=w(`g`,{class:`lisbin-cells`}),F=w(`g`,{class:`lisbin-labels`});M.appendChild(N),M.appendChild(P),M.appendChild(F);let I=w(`text`,{class:`lisbin-note`,x:y,y:c});I.textContent=`tails[len] = 长度为 len+1 的递增子序列里最小的末尾值 —— 答案就是 tails 的长度`,N.appendChild(I),N.appendChild(w(`rect`,{class:`lisbin-banner__box`,x:y,y:l,width:ue,height:u,rx:9}));let L=w(`text`,{class:`lisbin-banner__seg`,x:48,y:64}),R=w(`text`,{class:`lisbin-banner__seg`,x:230,y:64}),z=w(`text`,{class:`lisbin-banner__val`,x:k-y-18,y:64});N.appendChild(L),N.appendChild(R),N.appendChild(z);let de=w(`text`,{class:`lisbin-label`,x:A-14,y:146});de.textContent=`nums`,N.appendChild(de);let fe=w(`text`,{class:`lisbin-label`,x:A-14,y:223});fe.textContent=`tails`,N.appendChild(fe);let pe=[];for(let e=0;e<C;e+=1){let t=w(`g`,{class:`lisbin-cell`});t.appendChild(w(`rect`,{class:`lisbin-cell__box`,x:j(e)-D/2,y:f,width:D,height:p,rx:6}));let n=w(`text`,{class:`lisbin-cell__val`,x:j(e),y:140});n.textContent=String(ce[e]),t.appendChild(n);let r=w(`text`,{class:`lisbin-cell__sub`,x:j(e),y:160});r.textContent=`#${e}`,t.appendChild(r),P.appendChild(t),pe.push({g:t})}let me=[];for(let e=0;e<C;e+=1){let t=w(`g`,{class:`lisbin-cell`});t.appendChild(w(`rect`,{class:`lisbin-cell__box`,x:j(e)-D/2,y:h,width:D,height:g,rx:6}));let n=w(`text`,{class:`lisbin-cell__val`,x:j(e),y:222});t.appendChild(n);let r=w(`text`,{class:`lisbin-cell__sub`,x:j(e),y:242});t.appendChild(r),P.appendChild(t),me.push({g:t,val:n,sub:r})}let he=[];for(let e=0;e<C;e+=1){let t=w(`text`,{class:`lisbin-cell__old`,x:j(e),y:m}),n=w(`line`,{class:`lisbin-oldline`,x1:j(e)-26,y1:m,x2:j(e)+26,y2:m});F.appendChild(t),F.appendChild(n),he.push({t,line:n})}let B=w(`line`,{class:`lisbin-range-line`,x1:A,y1:v,x2:A,y2:v}),V=w(`line`,{class:`lisbin-range-line`,x1:A,y1:v-6,x2:A,y2:295}),H=w(`line`,{class:`lisbin-range-line`,x1:A,y1:v-6,x2:A,y2:295});N.appendChild(B),N.appendChild(V),N.appendChild(H);let U=w(`g`,{class:`lisbin-badge`}),W=w(`rect`,{class:`lisbin-badge__box`,x:j(0)-18,y:_-9,width:36,height:18,rx:5}),G=w(`text`,{class:`lisbin-badge__text`,x:j(0),y:_});U.appendChild(W),U.appendChild(G),N.appendChild(U);let K=w(`g`,{class:`lisbin-badge`}),q=w(`rect`,{class:`lisbin-badge__box`,x:j(0)-10,y:d-9,width:20,height:18,rx:5}),J=w(`text`,{class:`lisbin-badge__text`,x:j(0),y:d});J.textContent=`i`,K.appendChild(q),K.appendChild(J),N.appendChild(K);let Y=w(`text`,{class:`lisbin-info`,x:A,y:ee});N.appendChild(Y);let ge=w(`rect`,{class:`lisbin-ans__box`,x:A,y:te,width:O,height:ne,rx:8});N.appendChild(ge);let X=w(`text`,{class:`lisbin-ans__text`,x:A+O/2,y:340});N.appendChild(X);let Z=w(`text`,{class:`lisbin-phase__text`,x:k/2,y:re});N.appendChild(Z);let _e=le();function ve(t,n){if(!n)return;let r=n.phase,i=r===`bisect`,a=r===`place`,o=r===`done`,s=n.i,c=n.tails||[],l=n.answer,u=n.lo,d=n.hi,f=n.mid,p=n.pos;pe.forEach((e,t)=>{let n=[`lisbin-cell`];s!==null&&!o&&t===s&&n.push(`is-cur`),e.g.setAttribute(`class`,n.join(` `))});let m=e=>i?e>=u&&e<d?`is-range`:`is-out`:a?e===p?`is-range`:`is-out`:null;me.forEach((e,t)=>{let r=[`lisbin-cell`];if(t<c.length){e.val.textContent=String(c[t]),e.sub.textContent=`len ${t}`;let o=m(t);o&&r.push(o),i&&t===f&&r.push(`is-mid`),a&&t===p&&r.push(n.kind===`append`?`is-fresh`:`is-pos`)}else e.val.textContent=``,e.sub.textContent=``,r.push(`is-ghost`);e.g.setAttribute(`class`,r.join(` `))}),he.forEach((e,t)=>{let r=a&&n.kind===`replace`&&t===p&&n.prevVal!==null;if(e.t.classList.toggle(`is-on`,r),e.line.classList.toggle(`is-on`,r),r){e.t.textContent=`原 ${n.prevVal}`;let r=String(n.prevVal).length*7+16;e.line.setAttribute(`x1`,j(t)-r/2),e.line.setAttribute(`x2`,j(t)+r/2)}});let h=i&&d>u;if(B.classList.toggle(`is-on`,h),V.classList.toggle(`is-on`,h),H.classList.toggle(`is-on`,h),h){let e=j(u)-D/2,t=j(d-1)+D/2;B.setAttribute(`x1`,e),B.setAttribute(`x2`,t),V.setAttribute(`x1`,e),V.setAttribute(`x2`,e),H.setAttribute(`x1`,t),H.setAttribute(`x2`,t)}let g=i?f!==null:a;if(W.classList.toggle(`is-on`,g),G.classList.toggle(`is-on`,g),W.classList.toggle(`is-gold`,a),g){let e=i?f:p;G.textContent=i?`mid`:`pos`,W.setAttribute(`x`,j(e)-18),G.setAttribute(`x`,j(e))}let _=s!==null&&!o;q.classList.toggle(`is-on`,_),J.classList.toggle(`is-on`,_),_&&(q.setAttribute(`x`,j(s)-10),J.setAttribute(`x`,j(s))),i?Y.textContent=`搜索区间 [${u}, ${d}) · mid = ${f} · 找第一个 >= ${n.x} 的位置`:a?Y.textContent=n.kind===`replace`?`pos = ${p} · 替换 tails[${p}]：${n.prevVal} → ${n.x}（长度不变）`:`pos = ${p} · 追加 ${n.x}：长度 ${p} → ${p+1}`:Y.textContent=``,X.textContent=`目前最长递增子序列长度 = ${l}`;let v=l>(t>0?x[t-1].answer:0);ge.classList.toggle(`is-hot`,v||o),X.classList.toggle(`is-hot`,v||o),i||a?(L.textContent=`i = ${s} · 值 ${n.x}`,i?R.textContent=`二分：tails[${f}] = ${c[f]} ${n.goRight?`<`:`>=`} ${n.x}`:n.kind===`replace`?R.textContent=`${n.prevVal} 换成 ${n.x} —— 末尾更小`:R.textContent=`比所有末尾都大 —— 追加`,z.textContent=`tails 长度 = ${l}`):o?(L.textContent=`${C} 个元素处理完`,R.textContent=`tails 只是登记表，长度才是答案`,z.textContent=`答案 = ${l}`):(L.textContent=`换一套记账`,R.textContent=`tails[len] = 该长度下最小的末尾`,z.textContent=`答案 = tails 长度`),i?Z.textContent=n.goRight?`tails[${f}] = ${c[f]} 太小，不可能成为「第一个 >= ${n.x}」的位置 —— 往右收`:`tails[${f}] = ${c[f]} 已经够大，而且左边也许有 —— 往左收`:a?Z.textContent=n.kind===`replace`?`替换让「长度 ${p+1} 这一档」的末尾从 ${n.prevVal} 降到 ${n.x} —— 后面更容易接上`:`追加让答案从 ${p} 涨到 ${p+1} —— 这是唯一能让答案变大的动作`:o?Z.textContent=`时间 O(n log n)、空间 O(n) —— 每个元素只做一次二分`:Z.textContent=`tails 严格递增 —— 这个性质正是能二分的前提`,e(_e,n.desc)}T.appendChild(_e);let ye=i();T.appendChild(ye.root),a.textContent=``,a.appendChild(T),n();let be=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:x,controls:ye,intervalMs:ae,onRender:ve});Q.jumpTo(Math.trunc(b.initialStep)||0);let $=null;return se&&!be&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(T)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.lisbinMounted,document.getElementById(s)?.remove()}}}export{x as mountLisBinary};