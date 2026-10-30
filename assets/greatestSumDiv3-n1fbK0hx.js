import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[3,6,5,1,8];function o(e={}){let t=(Array.isArray(e.nums)?e.nums:[]).filter(e=>Number.isInteger(e));return{nums:t.length>0?t:[...a]}}function s(e,t){return e.map((e,t)=>({v:e,i:t,m:(e%3+3)%3})).filter(e=>e.m===t).sort((e,t)=>e.v-t.v||e.i-t.i)}function c(e={}){let{nums:t}=o(e),n=t.length,r=t.map(e=>(e%3+3)%3),i=t.reduce((e,t)=>e+t,0),a=(i%3+3)%3,c=s(t,0),l=s(t,1),u=s(t,2),d=c.map(e=>e.v),f=l.map(e=>e.v),p=u.map(e=>e.v),m=c.map(e=>e.i),h=l.map(e=>e.i),g=u.map(e=>e.i),_=a===1?l:a===2?u:[],v=a===1?u:a===2?l:[],y=a!==0&&_.length>=1?_[0].v:null,b=y===null?[]:[_[0].i],x=a!==0&&v.length>=2?v[0].v+v[1].v:null,S=x===null?[]:[v[0].i,v[1].i],C=`none`,w=null;a===0?(C=`none`,w=0):y===null&&x===null?(C=`none`,w=null):y!==null&&(x===null||y<=x)?(C=`one`,w=y):(C=`two`,w=x);let T=a===0?i:w===null?0:i-w,E=[],D=(e,o,s={})=>{E.push({phase:e,desc:o,nums:[...t],n,idx:-1,runningSum:i,rems:[...r],total:i,r:a,m0:[...d],m1:[...f],m2:[...p],m0i:[...m],m1i:[...h],m2i:[...g],candOne:y,candOneIdx:[...b],candTwo:x,candTwoIdx:[...S],active:null,chosen:C,drop:w,result:T,done:e===`done`,...s})};D(`init`,`数组 \`[${t.join(`, `)}]\`，求一个**子集**使其和能被 3 整除且最大。注意是**任意个**元素（不是"恰好三个"）—— 约束只有"和 ≡ 0 (mod 3)"。因为元素全为**正数**，\`sum(nums) = ${i}\` 是所有子集和的**上界**：想被 3 整除，唯一手段是**扔掉最少的一小撮**，让剩下的和回到 \`≡ 0\`。先求和，再看它对 3 的余数 \`r = ${i} % 3\`。`,{idx:-1,runningSum:0});let O=0;for(let e=0;e<n;e+=1){O+=t[e];let r=e===n-1,o=(O%3+3)%3;D(`sum`,`把 \`nums[${e}]\`（= ${t[e]}）加进来：当前和 \`${O}\`，对 3 的余数 \`${o}\`。`+(r?`加完全部元素，\`total = ${i}\`、余数 \`r = ${a}\`。`:`继续累加，最后再统一看余数。`),{idx:e,runningSum:O})}if(D(`bucket`,`按**余数**分三桶：\`m0 = [${d.join(`, `)}]\`（余 0，永远不扔）、\`m1 = [${f.join(`, `)}]\`、\`m2 = [${p.join(`, `)}]\`，每桶**升序**。`+(a===0?`\`r = 0\`：\`${i}\` 本身就被 3 整除 —— **全选即最优**，根本不用动桶。`:`\`r = ${a}\`：需要在 \`m${a===1?1:2}\`、\`m${a===1?2:1}\` 里削掉一小撮来修正余数。`)),a!==0){let e=a,t=3-a;D(`candidate`,`候选 A：削**一个余 ${e}**（\`m${e}\` 里最小的那个）—— `+(y===null?`但 \`m${e}\` 是空的，这条路走不通，代价记作 \`∞\`。`:`代价 \`${y}\`（取该桶最小的一个）。`),{active:`one`}),D(`candidate`,`候选 B：削**两个余 ${t}**（\`2 + 2 ≡ 1\`、\`1 + 1 ≡ 2\`，所以两个 \`余 ${t}\` 恰好修正余数）—— `+(x===null?`但 \`m${t}\` 不足两个元素，凑不出两个，代价记作 \`∞\`。`:`取该桶最小的两个，代价 \`${x}\`。`),{active:`two`})}let k=a===0?`不需要削任何元素`:w===null?`两种候选都凑不齐（\`m${a}\` 为空、\`m${3-a}\` 不足两个）`:C===`one`?`候选 A 更小：削一个余 ${a}，代价 \`${w}\``:`候选 B 更小：削两个余 ${3-a}，代价 \`${w}\``;return D(`done`,a===0?`返回 **${i}**：\`total = ${i}\` 已被 3 整除，全选就是答案。记住判据 \`r == 0\` 先短路，别去动桶。`:w===null?`返回 **0**：没有任何子集能被 3 整除，只能选**空集**（和为 0）。`:`返回 **${T}**：${k}，于是 \`${i} − ${w} = ${T}\`。保留的元素和 ${T} 恰好 \`≡ 0 (mod 3)\`。复盘：余数世界里 \`1+1≡2\`、\`2+2≡1\`、\`1+2≡0\` —— 三个同类抵消、一混合白扔、多削只会更亏，所以最小代价必是「最小的一个 \`m${a}\`」或「最小的两个 \`m${3-a}\`」。`,{done:!0}),E}var l=`greatestsumdiv3-styles`,u=28,d=52,f=60,p=44,m=132,h=38,g=258,_=58,v=330,y=40,b=384,x=50,S=452,C=604,w=1200,T=`
.gsv { display: flex; flex-direction: column; gap: 14px; }
.gsv__svg { width: 100%; height: auto; display: block; }

.gsv-note {
  fill: var(--gsv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-note--r { text-anchor: end; }

.gsv-lbl {
  fill: var(--gsv-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.gsv-cell__box {
  fill: var(--gsv-fill, #ffffff); stroke: var(--gsv-line, #c3c9c2); stroke-width: 1.5;
}
.gsv-cell__val {
  fill: var(--gsv-ink, #1f2a24); font-size: 15px; font-weight: 800;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-cell__sub {
  fill: var(--gsv-dim, #9aa39c); font-size: 9.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-cell.is-cur .gsv-cell__box {
  fill: var(--gsv-gold-fill, #fdf3e3); stroke: var(--gsv-gold, #c2872f); stroke-width: 3;
}
.gsv-cell.is-cur .gsv-cell__val { fill: var(--gsv-gold, #c2872f); }
.gsv-cell.is-dropped .gsv-cell__box {
  fill: var(--gsv-past, #eef0ec); stroke: var(--gsv-line, #c3c9c2);
  stroke-dasharray: 4 3; stroke-width: 1.5;
}
.gsv-cell.is-dropped .gsv-cell__val { fill: var(--gsv-dim, #9aa39c); text-decoration: line-through; }

.gsv-bucket__row { opacity: 1; transition: opacity 0.2s ease; }
.gsv-bucket.is-ahead { opacity: 0.28; }
.gsv-chip__box {
  fill: var(--gsv-fill, #ffffff); stroke: var(--gsv-line, #c3c9c2); stroke-width: 1.5;
}
.gsv-chip__val {
  fill: var(--gsv-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-bucket.is-hot .gsv-chip__box { stroke: var(--gsv-ok, #3f6b57); stroke-width: 2; }
.gsv-bucket.is-hot .gsv-lbl { fill: var(--gsv-ok, #3f6b57); font-weight: 700; }
.gsv-chip.is-pick .gsv-chip__box {
  fill: var(--gsv-gold-fill, #fdf3e3); stroke: var(--gsv-gold, #c2872f); stroke-width: 3;
}
.gsv-chip.is-pick .gsv-chip__val { fill: var(--gsv-gold, #c2872f); }

.gsv-card__box {
  fill: var(--gsv-fill, #ffffff); stroke: var(--gsv-line, #c3c9c2); stroke-width: 1.5;
}
.gsv-card.is-active .gsv-card__box { stroke: var(--gsv-ok, #3f6b57); stroke-width: 2.5; }
.gsv-card.is-win .gsv-card__box {
  fill: var(--gsv-gold-fill, #fdf3e3); stroke: var(--gsv-gold, #c2872f); stroke-width: 3;
}
.gsv-card__title {
  fill: var(--gsv-muted, #657168); font-size: 12px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-card.is-win .gsv-card__title { fill: var(--gsv-gold, #c2872f); font-weight: 700; }
.gsv-card__num {
  fill: var(--gsv-ink, #1f2a24); font-size: 22px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-card.is-win .gsv-card__num { fill: var(--gsv-gold, #c2872f); }
.gsv-card__num.is-dead { fill: var(--gsv-dim, #9aa39c); font-weight: 500; }

.gsv-banner__box {
  fill: var(--gsv-banner, #f4f3ef); stroke: var(--gsv-line, #c3c9c2); stroke-width: 1.5;
}
.gsv-banner__text {
  fill: var(--gsv-hot, #a45f45); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-banner__text.is-ok { fill: var(--gsv-ok, #3f6b57); }

.gsv-panel__box {
  fill: var(--gsv-fill, #ffffff); stroke: var(--gsv-line, #c3c9c2); stroke-width: 1.5;
}
.gsv-panel__label {
  fill: var(--gsv-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-panel__num {
  fill: var(--gsv-ink, #1f2a24); font-size: 18px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-panel__num.is-ok { fill: var(--gsv-ok, #3f6b57); }
.gsv-panel__num.is-fresh { fill: var(--gsv-gold, #c2872f); }
.gsv-panel__num.is-dead { fill: var(--gsv-dim, #9aa39c); }

.gsv-phase__text {
  fill: var(--gsv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function E(){if(document.getElementById(l))return;let e=document.createElement(`style`);e.id=l,e.textContent=T,document.head.appendChild(e)}var D=e=>e==null?`∞`:String(e);function O(a,o={}){if(!a||a.dataset.gsdiv3Mounted===`1`)return{destroy(){}};a.dataset.gsdiv3Mounted=`1`,E();let s=c(o),T=o.autoplay!==!1,{nums:O}=s[0],k=O.length,A=r,j=document.createElement(`div`);j.className=`viz gsv`;let M=document.createElement(`div`);M.className=`viz__stage`,j.appendChild(M);let N=A(`svg`,{class:`viz__svg gsv__svg`,viewBox:`0 0 660 474`,role:`img`,"aria-label":`可被三整除的最大和 LC1262 贪心推演动画`});M.appendChild(N);let P=A(`g`,{}),F=A(`g`,{});N.append(P,F);let I=A(`text`,{class:`gsv-note`,x:26,y:u});I.textContent=`先全选：sum 是上界，只减不增`,F.appendChild(I);let L=A(`text`,{class:`gsv-note gsv-note--r`,x:634,y:u});L.textContent=`nums = [${O.join(`, `)}] · 目标和 ≡ 0 (mod 3)`,F.appendChild(L);let R=A(`text`,{class:`gsv-lbl`,x:26,y:d});R.textContent=`nums（每格下方是对 3 的余数）`,F.appendChild(R);let z=Math.min(56,Math.floor((C-(k-1)*8)/k)),ee=(660-(k*z+(k-1)*8))/2,te=O.map((e,t)=>{let n=ee+t*(z+8),r=A(`g`,{class:`gsv-cell`});r.appendChild(A(`rect`,{class:`gsv-cell__box`,x:n,y:f,width:z,height:p,rx:6}));let i=A(`text`,{class:`gsv-cell__val`,x:n+z/2,y:76});i.textContent=String(e),r.appendChild(i);let a=A(`text`,{class:`gsv-cell__sub`,x:n+z/2,y:95});return a.textContent=`≡${(e%3+3)%3}`,r.appendChild(a),P.appendChild(r),{g:r,box:r.firstChild}}),B=[0,1,2].map(e=>{let t=m+e*h,n=A(`g`,{class:`gsv-bucket`}),r=A(`text`,{class:`gsv-lbl`,x:26,y:t+h/2});return n.appendChild(r),F.appendChild(n),{g:n,lbl:r,y:t,chips:[]}}),ne=Math.floor((C-102)/40);for(let e of[0,1,2]){let t=B[e],n=Math.min(ne,10);for(let e=0;e<n;e+=1){let n=128+e*40,r=A(`g`,{class:`gsv-chip`});r.appendChild(A(`rect`,{class:`gsv-chip__box`,x:n,y:t.y+(h-26)/2,width:34,height:26,rx:5}));let i=A(`text`,{class:`gsv-chip__val`,x:n+34/2,y:t.y+h/2});r.appendChild(i),t.g.appendChild(r),t.chips.push({g:r,val:i,x:n})}}let V=(C-24)/2,H=[26,340],U=[0,1].map(e=>{let t=A(`g`,{class:`gsv-card`});t.appendChild(A(`rect`,{class:`gsv-card__box`,x:H[e],y:g,width:V,height:_,rx:9}));let n=A(`text`,{class:`gsv-card__title`,x:H[e]+V/2,y:275}),r=A(`text`,{class:`gsv-card__num`,x:H[e]+V/2,y:298});return t.append(n,r),F.appendChild(t),{g:t,title:n,num:r}});F.appendChild(A(`rect`,{class:`gsv-banner__box`,x:26,y:v,width:608,height:y,rx:9}));let W=A(`text`,{class:`gsv-banner__text`,x:660/2,y:350});F.appendChild(W),F.appendChild(A(`rect`,{class:`gsv-panel__box`,x:26,y:b,width:608,height:x,rx:9}));let G=(e,t)=>{let n=A(`text`,{class:`gsv-panel__label`,x:t,y:398});n.textContent=e;let r=A(`text`,{class:`gsv-panel__num`,x:t,y:419});return F.append(n,r),r},re=G(`S = sum`,660/2-190),K=G(`r = S % 3`,660/2-65),ie=G(`代价 drop`,395),q=G(`答案`,520),J=A(`text`,{class:`gsv-phase__text`,x:660/2,y:S});F.appendChild(J);let Y=document.createElement(`p`);Y.className=`viz__desc`,Y.setAttribute(`aria-live`,`polite`);let X=e=>[e.m0,e.m1,e.m2],ae=e=>[e.m0i,e.m1i,e.m2i];function oe(t,n){if(!n)return;let r=n.phase===`bucket`||n.phase===`candidate`||n.phase===`done`,i=n.phase===`done`,a=n.r,o=new Set;if(i&&n.chosen===`one`)for(let e of n.candOneIdx)o.add(e);if(i&&n.chosen===`two`)for(let e of n.candTwoIdx)o.add(e);te.forEach((e,t)=>{let r=[`gsv-cell`];n.phase===`sum`&&t===n.idx&&r.push(`is-cur`),o.has(t)&&r.push(`is-dropped`),e.g.setAttribute(`class`,r.join(` `))});let s=n.phase===`candidate`?n.active===`one`?a:3-a:i&&n.chosen===`one`?a:i&&n.chosen===`two`?3-a:-1,c=new Set(i&&n.chosen===`one`?n.candOneIdx:i&&n.chosen===`two`?n.candTwoIdx:n.phase===`candidate`&&n.active===`one`?n.candOneIdx:n.phase===`candidate`&&n.active===`two`?n.candTwoIdx:[]),l=X(n),u=ae(n);if(B.forEach((e,t)=>{let n=[`gsv-bucket`];r?t===s&&n.push(`is-hot`):n.push(`is-ahead`),e.g.setAttribute(`class`,n.join(` `)),e.lbl.textContent=`m${t} 余${t}`,e.chips.forEach((e,n)=>{let r=n<l[t].length;e.g.style.display=r?``:`none`,r&&(e.val.textContent=String(l[t][n]),e.g.setAttribute(`class`,`gsv-chip`+(u[t][n]!==void 0&&c.has(u[t][n])?` is-pick`:``)))})}),a===0)U.forEach(e=>{e.g.style.display=`none`});else{U.forEach(e=>{e.g.style.display=``});let e=[{title:`削一个 m${a}`,val:n.candOne,kind:`one`},{title:`削两个 m${3-a}`,val:n.candTwo,kind:`two`}];U.forEach((t,r)=>{let o=e[r],s=[`gsv-card`];n.phase===`candidate`&&n.active===o.kind&&s.push(`is-active`),i&&n.chosen===o.kind&&s.push(`is-win`),t.g.setAttribute(`class`,s.join(` `)),t.title.textContent=a===0?``:o.title,t.num.textContent=D(o.val),t.num.setAttribute(`class`,`gsv-card__num`+(o.val===null?` is-dead`:``))})}n.phase===`init`?(W.textContent=`S = sum(nums)　r = S % 3`,W.setAttribute(`class`,`gsv-banner__text`)):n.phase===`sum`?(W.textContent=`S = ${n.runningSum}　（继续累加，最后再看 r）`,W.setAttribute(`class`,`gsv-banner__text`)):n.phase===`bucket`?(W.textContent=a===0?`S = ${n.total}, r = 0 → 全选即最优`:`S = ${n.total}, r = ${a} → 需要削掉一小撮修正`,W.setAttribute(`class`,`gsv-banner__text`+(a===0?` is-ok`:``))):n.phase===`candidate`?(W.textContent=`min(候选 A = ${D(n.candOne)}, 候选 B = ${D(n.candTwo)})`,W.setAttribute(`class`,`gsv-banner__text`)):(W.textContent=a===0?`答案 = S = ${n.total}`:n.drop===null?`答案 = 0（无可行子集，只能选空集）`:`答案 = ${n.total} − ${n.drop} = ${n.result}`,W.setAttribute(`class`,`gsv-banner__text`+(a===0||n.drop!==null?` is-ok`:``))),re.textContent=String(n.phase===`sum`?n.runningSum:n.total),K.textContent=r?String(a):`—`,K.setAttribute(`class`,`gsv-panel__num`+(r&&a===0?` is-ok`:r?` is-fresh`:``)),ie.textContent=r?a===0?`0`:D(n.drop):`—`,q.textContent=i?String(n.result):`—`,q.setAttribute(`class`,`gsv-panel__num`+(i?n.result>0?` is-ok`:` is-dead`:``)),n.phase===`init`?J.textContent=`元素全为正 → sum 是上界 → 只减不增`:n.phase===`sum`?J.textContent=`先把总和 S 攒出来，再看它对 3 的余数`:n.phase===`bucket`?J.textContent=a===0?`r = 0，一步到位：S 本身就被 3 整除`:`余 0 的不扔；只在 m${a} 与 m${3-a} 上动刀`:n.phase===`candidate`?J.textContent=n.active===`one`?`候选 A：取 m${a} 最小的一个`:`候选 B：取 m${3-a} 最小的两个`:J.textContent=a===0?`全选即答案，一个元素都不用扔`:n.drop===null?`两种候选都凑不齐 → 空集，返回 0`:`每桶只取最小的一个/两个：越靠后的元素越亏，轮不到`,e(Y,n.desc)}j.appendChild(Y);let Z=i();j.appendChild(Z.root),a.textContent=``,a.appendChild(j),n();let se=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:s,controls:Z,intervalMs:w,onRender:oe});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return T&&!se&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(j)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.gsdiv3Mounted,document.getElementById(l)?.remove()}}}export{O as mountGreatestSumDiv3};