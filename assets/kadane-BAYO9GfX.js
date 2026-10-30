import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[-2,1,-3,4,-1,2,1,-5,4];function o(e={}){let t=Array.isArray(e.nums)?e.nums:a,n=t.length,r=Number.isInteger(e.maxSteps)?e.maxSteps:400,i={nums:[...t],i:-1,x:null,cur:0,best:0,start:0,end:0,bestStart:0,bestEnd:0,reset:!1,dropped:null,improved:!1};if(n===0)return[{...i,phase:`done`,desc:"**空数组** —— 一个元素都没有，凑不出子数组。题目保证 `n >= 1`，但状态机要有安静的出口。",done:!0}];let o=[],s=t[0],c=t[0],l=0,u=0,d=0,f=0,p=0,m=(e,t,n={})=>{o.push({...i,i:u,cur:s,best:c,start:l,end:u,bestStart:d,bestEnd:f,phase:e,desc:t,done:e===`done`,...n})};m(`init`,`要在 \`[${t.join(`, `)}]\` 里找一个**连续**的子数组，让它的和最大。子数组至少要含一个元素，所以答案**不可能是 0**（全负数时答案是那个最大的负数）。暴力枚举所有起点终点是 \`O(n²)\`（用前缀和能把内层降到 O(1)，但外层还是 n² 个组合）。Kadane 的想法是：**从左到右扫，只维护一个量 —— 「以当前位置结尾的最大子数组和」**，记做 \`cur\`。扫到 \`x\` 时只有两种选择：① 接在当前这段后面 → \`cur + x\`；② 从 \`x\` 自己重新开始 → \`x\`。取更大的那个：\`cur = max(x, cur + x)\`。**这一句从头到尾只在问一件事：带上前面那段，是赚了还是亏了？**如果 \`cur < 0\`，那么 \`cur + x < x\` —— 前面那段是**负资产**，接上只会更差，不如从 \`x\` 重新开始。全程再用一个 \`best\` 记录 \`cur\` 的历史最大值，扫完就是答案。先从 \`nums[0] = ${t[0]}\` 起步：\`cur = best = ${t[0]}\`。`,{x:t[0]});for(let e=1;e<n&&(p+=1,!(p>r));e+=1){let n=t[e];u=e;let r=s,i=c;if(s<0){let t=l;s=n,l=e;let a=s>c;a&&(c=s,d=l,f=e),m(`restart`,`\`i = ${e}\`，\`nums[${e}] = ${n}\`。当前这段的和 \`cur = ${r}\` —— **它是负的**。带上一段负数只会让总和变小：\`(${r}) + ${n} = ${r+n}\`，还不如 \`${n}\` 自己。所以**把前面整段扔掉，从 \`${e}\` 重新开始**：\`cur = ${n}\`，当前子数组收缩成 \`[${n}]\`（起点重设为 \`${e}\`）。`+(a?` 再看全局：\`${n} > ${i}\`，**刷新最优** —— \`best = ${c}\`，最优区间记成 \`nums[${d}..${f}]\`。`:` 再看全局：\`${n}\` 没能超过历史最好的 \`${i}\`，\`best\` 保持 \`${c}\`。`),{i:e,x:n,reset:!0,improved:a,dropped:{from:t,to:e-1}})}else{s+=n;let t=s>c;t&&(c=s,d=l,f=e),m(`extend`,`\`i = ${e}\`，\`nums[${e}] = ${n}\`。当前这段的和 \`cur = ${r}\` 是**非负的** —— 带上它总不亏：\`${r} + ${n} = ${s}\`，比 \`${n}\` 自己更大。所以**接上去**：\`cur = ${s}\`，当前子数组变成 \`nums[${l}..${e}]\`。`+(t?` 再看全局：\`${s} > ${i}\`，**刷新最优** —— \`best = ${c}\`，最优区间记成 \`nums[${d}..${f}]\`。`:` 再看全局：\`${s}\` 没超过历史最好的 \`${i}\`，\`best\` 保持 \`${c}\`。`),{i:e,x:n,improved:t})}}let h=t.slice(d,f+1).join(`, `);return m(`done`,`扫描结束。**答案 = \`${c}\`**，对应的子数组是 \`nums[${d}..${f}]\` = \`[${h}]\`。 回头看这趟做了什么：每个元素**只被看过一次**，每次只做两次比较 —— 所以是 **\`O(n)\` 时间、\`O(1)\` 空间**。这已经是理论下界了：至少得把每个元素看一遍，不可能比 \`O(n)\` 更快。而那句 \`cur = max(x, cur + x)\` 从头到尾只在问一件事：**我前面那段，是资产还是负资产？**负的就扔掉重起，正的就一起带上 —— 就这一条规则，把 \`O(n²)\` 压成了 \`O(n)\`。`,{i:n-1,x:t[n-1],done:!0}),o}var s=`kd-styles`,c=54,l=84,u=46,d=142,f=180,p=16,m=202,h=52,ee=58,g=6,_=260,te=276,ne=298,v=26,re=604,ie=1250,y=`
.kd {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.kd__svg { width: 100%; height: auto; display: block; }

.kd-note {
  fill: var(--kd-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 当前子数组色带 ───────────────────────────────────────────────────── */
.kd-band {
  fill: var(--kd-ok, #3f6b57);
  opacity: 0.85;
}
.kd-band__end { stroke: var(--kd-ok, #3f6b57); stroke-width: 2.5; }

/* ── 格子 ─────────────────────────────────────────────────────────────── */
.kd-cell__box {
  fill: var(--kd-fill, #ffffff);
  stroke: var(--kd-line, #c3c9c2);
  stroke-width: 1.5;
}
.kd-cell__value {
  fill: var(--kd-ink, #1f2a24);
  font-size: 18px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 通道一（底色）：在当前子数组里 */
.kd-cell.is-inwin .kd-cell__box {
  fill: var(--kd-ok-fill, #eef5f1);
}
/* 通道二（边框）：最优区间内 —— 金色 */
.kd-cell.is-inbest .kd-cell__box {
  stroke: var(--kd-gold, #c2872f);
  stroke-width: 2.5;
}
/* 通道二（边框）：当前 i —— 橙色，优先级高于最优金色 */
.kd-cell.is-cur .kd-cell__box {
  stroke: var(--kd-hot, #a45f45);
  stroke-width: 3;
}
.kd-cell.is-cur .kd-cell__value { fill: var(--kd-hot, #a45f45); }
/* 被丢弃的那一段：整格灰虚线（放最后，整体覆盖） */
.kd-cell.is-dropped .kd-cell__box {
  fill: var(--kd-dim-fill, #f4f3ef);
  stroke: var(--kd-dim, #b9b9b3);
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
}
.kd-cell.is-dropped .kd-cell__value { fill: var(--kd-dim, #b9b9b3); }

/* ── 最优区间线 ───────────────────────────────────────────────────────── */
.kd-best__line { stroke: var(--kd-gold, #c2872f); stroke-width: 2.5; }
.kd-best__tick { stroke: var(--kd-gold, #c2872f); stroke-width: 2; }
.kd-best__text {
  fill: var(--kd-gold, #c2872f);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── i 指针 ───────────────────────────────────────────────────────────── */
.kd-i__tri { fill: var(--kd-hot, #a45f45); }
.kd-i__tag { fill: var(--kd-hot, #a45f45); }
.kd-i__text {
  fill: var(--kd-paper, #ffffff);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.kd-idx {
  fill: var(--kd-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.kd-banner__box {
  fill: var(--kd-banner-fill, #f4f2ec);
  stroke: var(--kd-line, #c3c9c2);
  stroke-width: 1.5;
}
.kd-banner__seg {
  fill: var(--kd-muted, #657168);
  font-size: 13.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.kd-banner__best {
  fill: var(--kd-gold, #c2872f);
  font-size: 19px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.kd-empty__text {
  fill: var(--kd-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function ae(){if(document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=y,document.head.appendChild(e)}function b(a,y={}){if(!a||a.dataset.kdMounted===`1`)return{destroy(){}};a.dataset.kdMounted=`1`,ae();let b=o(y),oe=y.autoplay!==!1,x=b[0].nums,S=x.length,C=r,w=document.createElement(`div`);w.className=`viz kd`;let T=document.createElement(`div`);T.className=`viz__stage`,w.appendChild(T);function E(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(S===0){let e=C(`svg`,{class:`viz__svg kd__svg`,viewBox:`0 0 620 120`,role:`img`}),t=C(`text`,{class:`kd-empty__text`,x:620/2,y:120/2});return t.textContent=`空数组 —— 凑不出子数组`,e.appendChild(t),T.appendChild(e),w.appendChild(E()),w.appendChild(i().root),a.textContent=``,a.appendChild(w),{destroy(){a.textContent=``,delete a.dataset.kdMounted,document.getElementById(s)?.remove()}}}let D=ee;S*D+(S-1)*g>re&&(D=Math.max(14,Math.floor((re-(S-1)*g)/S)));let se=S*D+(S-1)*g,O=Math.max(660,v*2+se),ce=(O-se)/2,k=e=>ce+e*(D+g),A=e=>k(e)+D/2,j=O-v*2,M=C(`svg`,{class:`viz__svg kd__svg`,viewBox:`0 0 ${O} 320`,role:`img`,"aria-label":`最大子数组和 Kadane 推演动画`});T.appendChild(M);let N=C(`g`,{class:`kd-bands`}),P=C(`g`,{class:`kd-cells`}),F=C(`g`,{class:`kd-bests`}),I=C(`g`,{class:`kd-marks`});M.appendChild(N),M.appendChild(P),M.appendChild(F),M.appendChild(I);let L=C(`text`,{class:`kd-note`,x:v,y:c});L.textContent=`cur = max(x, cur + x) —— 每步只问一句：带上前面那段，是赚了还是亏了`,I.appendChild(L),I.appendChild(C(`rect`,{class:`kd-banner__box`,x:v,y:l,width:j,height:u,rx:9}));let R=C(`text`,{class:`kd-banner__seg`,x:44,y:107}),z=C(`text`,{class:`kd-banner__seg`,x:196,y:107}),B=C(`text`,{class:`kd-banner__best`,x:v+j-18,y:107});I.appendChild(R),I.appendChild(z),I.appendChild(B);let V=C(`rect`,{class:`kd-band`,x:0,y:f,width:0,height:p,rx:4}),H=C(`line`,{class:`kd-band__end`,x1:0,y1:f-4,x2:0,y2:200}),U=C(`line`,{class:`kd-band__end`,x1:0,y1:f-4,x2:0,y2:200});N.appendChild(V),N.appendChild(H),N.appendChild(U);let W=[];for(let e=0;e<S;e+=1){let t=k(e),n=C(`g`,{class:`kd-cell`});n.appendChild(C(`rect`,{class:`kd-cell__box`,x:t,y:m,width:D,height:h,rx:6}));let r=C(`text`,{class:`kd-cell__value`,x:A(e),y:228});r.textContent=String(x[e]),n.appendChild(r),P.appendChild(n),W.push({g:n,id:e})}for(let e=0;e<S;e+=1){let t=C(`text`,{class:`kd-idx`,x:A(e),y:te});t.textContent=String(e),I.appendChild(t)}let G=C(`line`,{class:`kd-best__line`,x1:0,y1:_,x2:0,y2:_}),K=C(`line`,{class:`kd-best__tick`,x1:0,y1:256,x2:0,y2:_}),q=C(`line`,{class:`kd-best__tick`,x1:0,y1:256,x2:0,y2:_}),J=C(`text`,{class:`kd-best__text`,x:0,y:ne});F.appendChild(G),F.appendChild(K),F.appendChild(q),F.appendChild(J);let Y=C(`path`,{class:`kd-i__tri`,d:`M 0 0 L 0 0 L 0 0`}),X=C(`rect`,{class:`kd-i__tag`,x:0,y:d,width:54,height:22,rx:6}),Z=C(`text`,{class:`kd-i__text`,x:0,y:153});I.appendChild(Y),I.appendChild(X),I.appendChild(Z);let le=E();function ue(t,n){if(!n)return;let r=n.i,i=n.phase===`done`,a=new Set;for(let e=n.start;e<=n.end;e+=1)a.add(e);let o=new Set;for(let e=n.bestStart;e<=n.bestEnd;e+=1)o.add(e);let s=new Set;if(!i&&n.dropped)for(let e=n.dropped.from;e<=n.dropped.to;e+=1)s.add(e);for(let e of W){let{g:t,id:n}=e,c=[`kd-cell`];s.has(n)?c.push(`is-dropped`):(a.has(n)&&c.push(`is-inwin`),o.has(n)&&c.push(`is-inbest`),!i&&n===r&&c.push(`is-cur`)),t.setAttribute(`class`,c.join(` `))}if(i||n.end<n.start)V.style.opacity=`0`,H.style.opacity=`0`,U.style.opacity=`0`;else{let e=k(n.start),t=k(n.end)+D;V.setAttribute(`x`,e),V.setAttribute(`width`,Math.max(2,t-e)),V.style.opacity=`1`,H.setAttribute(`x1`,e),H.setAttribute(`x2`,e),U.setAttribute(`x1`,t),U.setAttribute(`x2`,t),H.style.opacity=`1`,U.style.opacity=`1`}let c=k(n.bestStart),l=k(n.bestEnd)+D;if(K.setAttribute(`x1`,c),K.setAttribute(`x2`,c),q.setAttribute(`x1`,l),q.setAttribute(`x2`,l),G.setAttribute(`x1`,c),G.setAttribute(`x2`,l),J.setAttribute(`x`,(c+l)/2),J.textContent=`最优 nums[${n.bestStart}..${n.bestEnd}] · 和 ${n.best}`,!i&&r>=0&&r<S){let e=A(r),t=m-6;Y.setAttribute(`d`,`M ${e-7} ${t-11} L ${e+7} ${t-11} L ${e} ${t} z`),Y.style.opacity=`1`,X.setAttribute(`x`,e-27),Z.setAttribute(`x`,e),Z.textContent=`i=${r}`,X.style.opacity=`1`,Z.style.opacity=`1`}else Y.style.opacity=`0`,X.style.opacity=`0`,Z.style.opacity=`0`;R.textContent=`cur = ${n.cur}（当前这段）`,z.textContent=`best = ${n.best}`,B.textContent=i?`答案 ${n.best}`:`最优 ${n.best}`,e(le,n.desc)}w.appendChild(le);let de=i();w.appendChild(de.root),a.textContent=``,a.appendChild(w),n();let fe=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:b,controls:de,intervalMs:ie,onRender:ue});Q.jumpTo(Math.trunc(y.initialStep)||0);let $=null;return oe&&!fe&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(w)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.kdMounted,document.getElementById(s)?.remove()}}}export{b as mountKadane};