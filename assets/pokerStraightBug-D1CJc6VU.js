import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";import{n as a,r as o}from"./pokerStraightSteps-CKkj7boL.js";var s=[{key:`no-dup`,cards:[1,2,2,3,4],bugName:`不判重复`,bugCode:`只看 max(非王) - min(非王) < 5`,bugWhy:`非王牌跨度只有 3，判据看都不看重复就放行了。顺子是 5 个互不相同的数 —— 王能填「缺的数」，填不了「已有的数」，重复出现时再多王也无解。`},{key:`le5`,cards:[1,2,3,4,6],bugName:`判据写成 ≤ 5`,bugCode:`max(非王) - min(非王) <= 5`,bugWhy:`跨度正好 5，≤ 5 把它放了过去。5 张无王的牌要连续，跨度必须恰好是 4 —— 跨度 5 意味着中间差着一个数（这里是 5），没有王来补。`},{key:`joker-pairs`,cards:[0,0,1,2,6],bugName:`王也算进相邻对`,bugCode:`for i in 1..4: gap += nums[i] - nums[i-1] - 1`,bugWhy:`遍历从下标 1 开始，0 和 0 这对也被算了进去：0 - 0 - 1 = -1。两张王各贡献 -1 的负 gap，把 2 → 6 需要的 3 个洞抵成 1 个，2 张王「刚好够」—— 其实 3、4、5 三个数一张王都补不上。`}];function c(e){let t=e.filter(e=>e!==0);return t.length===0?!0:Math.max(...t)-Math.min(...t)<5}function l(e){let t=e.filter(e=>e!==0);return t.length===0?!0:Math.max(...t)-Math.min(...t)<=5}function u(e){let t=[...e].sort((e,t)=>e-t),n=t.filter(e=>e===0).length,r=0;for(let e=1;e<t.length;e+=1)r+=t[e]-t[e-1]-1;return r<=n}var d={"no-dup":c,le5:l,"joker-pairs":u},f=[[1,2,3,4,5],[0,0,1,2,5]];function p(){let e=[],t=(t,n)=>{e.push({phase:t,groupIndex:-1,group:null,done:t===`done`,desc:``,...n})};return t(`init`,{desc:`官方样例只有两组：[1,2,3,4,5] 和 [0,0,1,2,5]，都返回 true。下面三个错法在这两组样例上全部失声，各配一个最小反例 —— 注意三个错法的方向一致：把不是顺子的牌放过去。`}),s.forEach((e,n)=>{let r=[...e.cards].sort((e,t)=>e-t),i=r.filter(e=>e===0).length,s=r.filter(e=>e!==0),c=s.length>0?Math.max(...s)-Math.min(...s):0,l=o(e.cards),u=d[e.key],p=u(e.cards),m=f.every(e=>u(e)===o(e).result);t(`hand`,{groupIndex:n,group:{...e,sorted:r,zeros:i,rest:s,span:c,correct:l.result,correctReason:l.failReason===`dup`?`非王牌有重复`:`断档补不上`,bugVerdict:p,silent:m,pairGaps:e.key===`joker-pairs`?r.slice(1).map((e,t)=>e-r[t]-1):null},desc:`第 ${n+1} 组：${r.map(a).join(`、`)}。`+(i>0?`王 ${i} 张，非王 ${s.map(a).join(`、`)}（跨度 ${c}）。`:`无王，跨度 ${c}。`)+`错法「${e.bugName}」：${e.bugCode}。`}),t(`verdict`,{groupIndex:n,group:{...e,sorted:r,zeros:i,rest:s,span:c,correct:l.result,correctReason:l.failReason===`dup`?`非王牌有重复`:`断档补不上`,bugVerdict:p,silent:m,pairGaps:e.key===`joker-pairs`?r.slice(1).map((e,t)=>e-r[t]-1):null},desc:`正解：${l.result?`是顺子`:`不是顺子（${l.failReason===`dup`?`非王牌有重复`:`需要补 ${l.need} 个洞，王只有 ${i} 张`}）`}。错法「${e.bugName}」判成 ${p?`是顺子`:`不是顺子`} —— ${p===l.result?`这组碰巧一致`:`判错了`}。`+e.bugWhy+(m?`（两组官方样例在这个错法下都返回 true，抓不住它。）`:``)})}),t(`done`,{desc:`三个错法一个共同点：只盯着「跨度」，忘了顺子还有「不重复」和「王只补缺失」两条约束。测顺子题必备的三组反例：[1,2,2,3,4]（重复）、[1,2,3,4,6]（跨 5 无王）、[0,0,1,2,6]（王被负 gap 抵掉）。`}),e}var m=`p61b-styles`,h=1250,g=`
.p61b { display: flex; flex-direction: column; gap: 14px; }
.p61b__svg { width: 100%; height: auto; display: block; }

.p61b-note {
  fill: var(--p61b-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-banner__box {
  fill: var(--p61b-banner, #f4f3ef);
  stroke: var(--p61b-line, #c3c9c2);
  stroke-width: 1.5;
}
.p61b-banner__seg {
  fill: var(--p61b-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-banner__val {
  fill: var(--p61b-gold, #c2872f);
  font-size: 15px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
}

/* ---- 反例行 ---- */
.p61b-row__box {
  fill: var(--p61b-fill, #ffffff);
  stroke: var(--p61b-line, #c3c9c2);
  stroke-width: 1.3;
}
.p61b-row__label {
  fill: var(--p61b-ink, #1f2a24);
  font-size: 13.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-row__bannerum {
  fill: var(--p61b-gold, #c2872f);
  font-size: 12px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-row.is-cur .p61b-row__box {
  stroke: var(--p61b-gold, #c2872f);
  stroke-width: 2.4;
}
.p61b-row.is-dim { opacity: 0.45; }

/* 迷你牌 */
.p61b-card__box {
  fill: var(--p61b-fill, #ffffff);
  stroke: var(--p61b-line, #c3c9c2);
  stroke-width: 1.4;
}
.p61b-card__val {
  fill: var(--p61b-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}
.p61b-card.is-joker .p61b-card__box {
  fill: var(--p61b-gold-fill, #fdf3e3);
  stroke: var(--p61b-gold, #c2872f);
  stroke-width: 2;
}
.p61b-card.is-joker .p61b-card__val { fill: var(--p61b-gold, #c2872f); }
.p61b-card.is-dup .p61b-card__box {
  stroke: var(--p61b-red, #b3452f);
  stroke-width: 2.4;
}
.p61b-card.is-dup .p61b-card__val { fill: var(--p61b-red, #b3452f); }

/* 判定丸 */
.p61b-pill__box {
  fill: var(--p61b-fill, #ffffff);
  stroke: var(--p61b-line, #c3c9c2);
  stroke-width: 1.4;
}
.p61b-pill__head {
  fill: var(--p61b-muted, #657168);
  font-size: 11px;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-pill__main {
  fill: var(--p61b-dim, #9aa39c);
  font-size: 14.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-pill__sub {
  fill: var(--p61b-muted, #657168);
  font-size: 11.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-pill.is-no .p61b-pill__box {
  fill: var(--p61b-red-fill, #f9ece8);
  stroke: var(--p61b-red, #b3452f);
  stroke-width: 2.2;
}
.p61b-pill.is-no .p61b-pill__main { fill: var(--p61b-red, #b3452f); }
.p61b-pill.is-yes .p61b-pill__box {
  fill: var(--p61b-green-fill, #eaf3ee);
  stroke: var(--p61b-green, #3f6b57);
  stroke-width: 2.2;
}
.p61b-pill.is-yes .p61b-pill__main { fill: var(--p61b-green, #3f6b57); }
.p61b-pill.is-wrong .p61b-pill__box {
  fill: var(--p61b-green-fill, #eaf3ee);
  stroke: var(--p61b-red, #b3452f);
  stroke-width: 2.2;
  stroke-dasharray: 5 3;
}
.p61b-pill.is-wrong .p61b-pill__main { fill: var(--p61b-green, #3f6b57); }
.p61b-pill.is-wrong .p61b-pill__head { fill: var(--p61b-red, #b3452f); font-weight: 700; }
.p61b-pill.is-pending { opacity: 0.5; }
.p61b-pill.is-pending .p61b-pill__main { fill: var(--p61b-dim, #9aa39c); font-weight: 400; }

.p61b-why {
  fill: var(--p61b-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}

.p61b-phasetext {
  fill: var(--p61b-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
`;function _(){if(document.getElementById(m))return;let e=document.createElement(`style`);e.id=m,e.textContent=g,document.head.appendChild(e)}function v(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}var y=680,b=20,x=36,S=40,C=96,w=134,T=520,E=544,D=50,O=42,k=150,A=56,j=[[`错在只问「跨度够不够小」，忘了问「有没有重复」。顺子是 5 个互不相同的数 ——`,`王能填缺失的数，填不了已经出现过的数，重复出现时再多王也无解。`],[`错在把边界写宽了。5 张无王的牌要连续，跨度必须恰好是 4；写成 ≤ 5，`,`跨度 5 的牌（中间差着一个数）就被放了进去，而手里一张王都没有。`],[`错在遍历的起点。从下标 1 开始会把「王-王」这对也算成相邻对：0 - 0 - 1 = -1，`,`两张王贡献 -2 的负 gap，把真正的洞抵掉了 —— 需要补 3 个洞，账上却只有 1 个。`]];function M(o,s={}){if(!o||o.dataset.p61bMounted===`1`)return{destroy(){}};o.dataset.p61bMounted=`1`,_();let c=p(),l=c.filter(e=>e.phase===`hand`).map(e=>e.group),u=l.length,d=r,f=d(`svg`,{class:`viz__svg p61b__svg`,viewBox:`0 0 ${y} ${E}`,role:`img`,"aria-label":`扑克牌顺子三个经典错误与正解对照动画`}),g=d(`g`,{class:`p61b-cells`}),M=d(`g`,{class:`p61b-marks`});f.appendChild(g),f.appendChild(M);let N=d(`text`,{class:`p61b-note`,x:30,y:b});N.textContent=`两组官方样例 [1,2,3,4,5] 与 [0,0,1,2,5] 在三个错法下全部返回 true —— 一声不响`,M.appendChild(N),M.appendChild(d(`rect`,{class:`p61b-banner__box`,x:30,y:x,width:y-60,height:S,rx:9}));let P=d(`text`,{class:`p61b-banner__seg`,x:46,y:56}),F=d(`text`,{class:`p61b-banner__seg`,x:190,y:56}),I=d(`text`,{class:`p61b-banner__val`,x:y-46,y:56});M.append(P,F,I);let L=l.map((e,t)=>{let n=C+t*w,r=d(`g`,{class:`p61b-row is-dim`});r.appendChild(d(`rect`,{class:`p61b-row__box`,x:22,y:n,width:y-44,height:w-12,rx:10}));let i=d(`text`,{class:`p61b-row__label`,x:36,y:n+18});i.textContent=`反例 ${t+1}：`;let o=d(`tspan`,{class:`p61b-row__bannerum`});o.textContent=` ${e.cards.map(a).join(`, `)}`,i.appendChild(o);let s=d(`tspan`,{class:`p61b-row__bannerum`});s.textContent=`  · 错法「${e.bugName}」`,i.appendChild(s),r.appendChild(i),e.sorted.forEach((e,t)=>{let i=36+t*58,o=d(`g`,{class:`p61b-card${e===0?` is-joker`:``}`});o.appendChild(d(`rect`,{class:`p61b-card__box`,x:i,y:n+30,width:D,height:O,rx:6}));let s=d(`text`,{class:`p61b-card__val`,x:i+D/2,y:n+30+O/2});s.textContent=a(e),o.appendChild(s),r.appendChild(o)});let c=(e,t,i,a,o)=>{let s=d(`g`,{class:`p61b-pill is-pending`});s.appendChild(d(`rect`,{class:`p61b-pill__box`,x:e,y:n+30,width:k,height:A,rx:8}));let c=d(`text`,{class:`p61b-pill__head`,x:e+10,y:n+42});c.textContent=t;let l=d(`text`,{class:`p61b-pill__main`,x:e+10,y:n+60});l.textContent=i;let u=d(`text`,{class:`p61b-pill__sub`,x:e+10,y:n+76});return u.textContent=a,s.append(c,l,u),r.appendChild(s),{g:s,h:c,m:l,s:u}},l=c(348,`正解`,`?`,``,``),u=c(508,`错法 · ${e.bugName}`,`?`,``,``);return j[t].forEach((e,t)=>{let i=d(`text`,{class:`p61b-why`,x:36,y:n+100+t*17});i.textContent=e,r.appendChild(i)}),g.appendChild(r),{g:r,correctPill:l,bugPill:u,label:i}}),R=d(`text`,{class:`p61b-phasetext`,x:y/2,y:T});M.appendChild(R);function z(t,n){if(n){if(L.forEach((e,t)=>{let r=l[t],i=n.groupIndex===t,a=[`p61b-row`];i?a.push(`is-cur`):a.push(`is-dim`),e.g.setAttribute(`class`,a.join(` `));let o=n.phase===`done`?!0:n.phase===`verdict`?t<=n.groupIndex:t<n.groupIndex,s=e.correctPill,c=e.bugPill;if(o){s.g.setAttribute(`class`,`p61b-pill ${r.correct?`is-yes`:`is-no`}`),s.m.textContent=r.correct?`✓ 是顺子`:`✗ 不是顺子`,s.s.textContent=r.correctReason;let e=r.bugVerdict!==r.correct;c.g.setAttribute(`class`,`p61b-pill ${e?`is-wrong`:r.bugVerdict?`is-yes`:`is-no`}`),c.m.textContent=r.bugVerdict?`✓ 判成顺子`:`✗ 判成不是`,c.s.textContent=e?`判错了 ✗`:`碰巧一致`}else n.phase===`hand`&&i?(s.g.setAttribute(`class`,`p61b-pill`),s.m.textContent=`正解怎么判？`,s.s.textContent=``,c.g.setAttribute(`class`,`p61b-pill`),c.m.textContent=`错法怎么判？`,c.s.textContent=``):(s.g.setAttribute(`class`,`p61b-pill is-pending`),s.m.textContent=`?`,s.s.textContent=``,c.g.setAttribute(`class`,`p61b-pill is-pending`),c.m.textContent=`?`,c.s.textContent=``)}),n.phase===`init`)P.textContent=`三个错法`,F.textContent=`官方样例全部失声`,I.textContent=`各配一个最小反例`;else if(n.phase===`done`)P.textContent=`共性`,F.textContent=`只盯跨度，忘了不重复和王只补缺失`,I.textContent=`方向一致：放水`;else{let e=n.group;P.textContent=`反例 ${n.groupIndex+1}/${u}`,F.textContent=n.phase===`hand`?`${e.bugCode}`:`正解 vs 错法`,I.textContent=n.phase===`hand`?`先看牌`:e.silent?`样例抓不住`:``}R.textContent=n.phase===`init`?`下面三组牌，正解全部判「不是顺子」，三个错法全部判「是顺子」—— 而且官方样例一个都抓不到。`:n.phase===`done`?`测顺子题，这三组反例 [1,2,2,3,4] / [1,2,3,4,6] / [0,0,1,2,6] 应当常备 —— 每一个都精准打在一条被忽略的约束上。`:``,e(B,n.desc)}}let B=v(),V=document.createElement(`div`);V.className=`viz p61b`;let H=document.createElement(`div`);H.className=`viz__stage`,H.appendChild(f),V.appendChild(H),V.appendChild(B);let U=i();V.appendChild(U.root),o.textContent=``,o.appendChild(V),n();let W=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,G=t({steps:c,controls:U,intervalMs:h,onRender:z});G.jumpTo(Math.trunc(s.initialStep)||0);let K=null;return!W&&typeof IntersectionObserver==`function`&&(K=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){K.disconnect(),K=null,G.play();return}},{threshold:.35}),K.observe(V)),{destroy(){K&&=(K.disconnect(),null),G.destroy(),o.textContent=``,delete o.dataset.p61bMounted,document.getElementById(m)?.remove()}}}export{M as mountPokerStraightBug};