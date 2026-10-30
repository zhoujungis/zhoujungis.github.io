import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[1,1,1,2,2,3],o=2;function s(e={}){let t=Array.isArray(e.nums)?e.nums:a,n=t.length,r=Number.isInteger(e.k)?e.k:o,i=Math.min(Math.max(r,1),Math.max(n,1)),s=[],c={},l=Array.from({length:n+1},()=>[]),u=[],d=(e,r,a={})=>{s.push({phase:e,desc:r,nums:t,n,k:i,freq:{...c},buckets:l.map(e=>e.slice()),cur:null,curFreq:null,bucketIdx:null,collectIdx:null,ans:u.slice(),collected:u.length,done:e===`done`,...a})};if(n===0)return d(`done`,`数组是空的，没有高频元素可取。`),s;d(`init`,`给了 \`${n}\` 个数 \`[${t.join(`, `)}]\`，要返回**出现频率前 \`${i}\` 高的元素**，而且题目卡死了复杂度：**必须优于 O(n log n)** —— 也就是不允许"哈希计数完再整体排序"这种偷懒写法。思路分三步：先一遍扫描数出每个值出现的**频率**（O(n)）；再按频率把值**分进桶里**（频率天然在 \`[1, ${n}]\` 之间，直接当数组下标用，不用比较）；最后**从高频端往低频端收集**，收满 \`${i}\` 个停。全程没有一次两两比较，总计 O(n)。`);let f=[];for(let e of t)c[e]===void 0?(c[e]=1,f.push(e)):c[e]+=1;for(let e of f)d(`count`,`数完了：值 \`${e}\` 出现了 **\`${c[e]}\` 次**。一张哈希表从左到右扫一遍就够，每个值 O(1)，这一步 \`${t.length}\` 个数共 O(n)。接下来所有的功夫都花在"怎么按频率挑前 \`${i}\` 个"上。`,{cur:e,curFreq:c[e]});for(let e of f){let t=c[e];l[t].push(e),d(`bucket`,`把 \`${e}\` 放进**下标为 \`${t}\` 的桶** —— 频率是多少，就进哪个桶。这一步是桶排序的灵魂：一个元素最多出现 \`${n}\` 次，所以频率天然落在 \`[1, ${n}]\` 里，**键的值域就是数组的下标范围**，建 \`${n+1}\` 个桶直接丢，一次比较都不用做。对比小根堆方案：堆每插一个元素要 \`O(log k)\`，这里每个元素是实打实的 \`O(1)\`。`,{cur:e,curFreq:t,bucketIdx:t})}for(let e=n;e>=1&&!(u.length>=i);--e){if(l[e].length===0){d(`collect`,`桶 \`${e}\` 是**空的** —— 没有值恰好出现 \`${e}\` 次，跳过，继续往左。收集指针从最右端（频率 \`${n}\`）一路往左扫，这就是"从高频到低频"的字面意思。`,{collectIdx:e});continue}for(let t of l[e])if(u.length>=i||(u.push(t),d(`collect`,`桶 \`${e}\` 里有值 \`${t}\`（出现了 \`${e}\` 次），收进答案。已收集 \`${u.length}/${i}\`${u.length>=i?` —— **收满了，停**。`:`，还没够，继续往左扫。`}题目保证答案唯一，所以桶内顺序不影响结果。`,{collectIdx:e,cur:t,curFreq:e}),u.length>=i))break}return d(`done`,`结束。**前 \`${i}\` 个高频元素 = [${u.join(`, `)}]**。回头看这三步：计数 O(n)、入桶 O(n)、收集最多扫 \`${n}\` 个桶也是 O(n) —— **总计 O(n)**，比题目划的红线 O(n log n) 还低。代价是那 \`${n+1}\` 个桶的 **O(n) 额外空间**，以及一个小前提：**频率是整数、且范围已知**（这题天然满足）。如果频率范围没这种保证（比如要按"距离"挑前 k 个），桶就没了，那才轮到堆或快速选择出场。`),s}var c=`bk-styles`,l=54,u=84,d=46,f=150,ee=40,te=214,p=252,ne=62,re=332,m=26,h=604,g=40,_=5,ie=1250,v=`
.bk {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.bk__svg { width: 100%; height: auto; display: block; }

.bk-note {
  fill: var(--bk-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.bk-banner__box {
  fill: var(--bk-banner, #f4f3ef);
  stroke: var(--bk-line, #c3c9c2);
  stroke-width: 1.5;
}
.bk-banner__seg {
  fill: var(--bk-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bk-banner__ans {
  fill: var(--bk-gold, #c2872f);
  font-size: 18px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 频率卡片 ─────────────────────────────────────────────────────────── */
.bk-freq__box {
  fill: var(--bk-fill, #ffffff);
  stroke: var(--bk-line, #c3c9c2);
  stroke-width: 1.5;
}
.bk-freq__text {
  fill: var(--bk-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bk-freq.is-lit .bk-freq__box {
  fill: var(--bk-gold-fill, #fdf3e3);
  stroke: var(--bk-gold, #c2872f);
  stroke-width: 2;
}
.bk-freq.is-lit .bk-freq__text { fill: var(--bk-gold, #c2872f); }

/* ── 桶 ───────────────────────────────────────────────────────────────── */
.bk-bucket__box {
  fill: var(--bk-fill, #ffffff);
  stroke: var(--bk-line, #c3c9c2);
  stroke-width: 1.5;
}
.bk-bucket__f {
  fill: var(--bk-muted, #657168);
  font-size: 11.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bk-bucket__items {
  fill: var(--bk-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 通道一（底色）：空桶 */
.bk-bucket.is-empty .bk-bucket__box {
  fill: var(--bk-dim-fill, #f0efea);
  stroke-dasharray: 4 3;
}
.bk-bucket.is-empty .bk-bucket__items { fill: var(--bk-dim, #b9b9b3); }
/* 通道一（底色）：本帧刚放入的桶 */
.bk-bucket.is-new .bk-bucket__box {
  fill: var(--bk-gold-fill, #fdf3e3);
  stroke: var(--bk-gold, #c2872f);
  stroke-width: 2;
}
.bk-bucket.is-new .bk-bucket__items { fill: var(--bk-gold, #c2872f); }
/* 通道一（底色）：已经从这只桶收过答案 */
.bk-bucket.is-collected .bk-bucket__box {
  fill: var(--bk-ok-fill, #eef5f1);
  stroke: var(--bk-ok, #3f6b57);
  stroke-width: 2;
}
.bk-bucket.is-collected .bk-bucket__items { fill: var(--bk-ok, #3f6b57); }
/* 通道二（边框）：收集指针所在 */
.bk-bucket.is-scanned .bk-bucket__box {
  stroke: var(--bk-hot, #a45f45);
  stroke-width: 3;
}

/* ── 收集指针 ─────────────────────────────────────────────────────────── */
.bk-collect__tag { fill: var(--bk-hot, #a45f45); }
.bk-collect__tri { fill: var(--bk-hot, #a45f45); }
.bk-collect__text {
  fill: var(--bk-paper, #ffffff);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 答案格 ───────────────────────────────────────────────────────────── */
.bk-ans__box {
  fill: var(--bk-fill, #ffffff);
  stroke: var(--bk-line, #c3c9c2);
  stroke-width: 1.5;
}
.bk-ans__text {
  fill: var(--bk-gold, #c2872f);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bk-ans__label {
  fill: var(--bk-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bk-ans.is-filled .bk-ans__box {
  fill: var(--bk-ok-fill, #eef5f1);
  stroke: var(--bk-ok, #3f6b57);
  stroke-width: 2;
}

.bk-empty__text {
  fill: var(--bk-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function ae(){if(document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=v,document.head.appendChild(e)}function y(a,o={}){if(!a||a.dataset.bkMounted===`1`)return{destroy(){}};a.dataset.bkMounted=`1`,ae();let v=s(o),y=o.autoplay!==!1,b=v[0].nums,x=b.length,S=r,C=document.createElement(`div`);C.className=`viz bk`;let w=document.createElement(`div`);w.className=`viz__stage`,C.appendChild(w);function T(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(x===0){let e=S(`svg`,{class:`viz__svg bk__svg`,viewBox:`0 0 620 120`,role:`img`}),t=S(`text`,{class:`bk-empty__text`,x:620/2,y:120/2});return t.textContent=`空数组 —— 没有高频元素可取`,e.appendChild(t),w.appendChild(e),C.appendChild(T()),C.appendChild(i().root),a.textContent=``,a.appendChild(C),n(),{destroy(){a.textContent=``,delete a.dataset.bkMounted,document.getElementById(c)?.remove()}}}let E=[],D=new Set;for(let e of b)D.has(e)||(D.add(e),E.push(e));let O=x+1,k=52;O*k+(O-1)*_>h&&(k=Math.max(g,Math.floor((h-(O-1)*_)/O)));let A=O*k+(O-1)*_,j=Math.max(660,m*2+A),oe=(j-A)/2,M=e=>oe+e*(k+_),N=e=>M(e)+k/2,P=j-m*2,F=S(`svg`,{class:`viz__svg bk__svg`,viewBox:`0 0 ${j} 370`,role:`img`,"aria-label":`前 K 个高频元素 桶排序推演动画`});w.appendChild(F);let I=S(`g`,{class:`bk-cells`}),L=S(`g`,{class:`bk-marks`});F.appendChild(I),F.appendChild(L);let R=S(`text`,{class:`bk-note`,x:m,y:l});R.textContent=`频率天然落在 [1, n] —— 用频率当桶下标，排序就免费了`,L.appendChild(R),L.appendChild(S(`rect`,{class:`bk-banner__box`,x:m,y:u,width:P,height:d,rx:9}));let z=S(`text`,{class:`bk-banner__seg`,x:44,y:107}),B=S(`text`,{class:`bk-banner__seg`,x:236,y:107}),V=S(`text`,{class:`bk-banner__ans`,x:m+P-18,y:107});L.appendChild(z),L.appendChild(B),L.appendChild(V);let H=Math.min(72,Math.max(46,Math.floor((A-(E.length-1)*8)/Math.max(E.length,1)))),se=(j-(E.length*H+(E.length-1)*8))/2,ce=E.map((e,t)=>{let n=S(`g`,{class:`bk-freq`}),r=se+t*(H+8);n.appendChild(S(`rect`,{class:`bk-freq__box`,x:r,y:f,width:H,height:ee,rx:6}));let i=S(`text`,{class:`bk-freq__text`,x:r+H/2,y:170});return n.appendChild(i),I.appendChild(n),{g:n,t:i,v:e}}),U=[];for(let e=0;e<=x;e+=1){let t=M(e),n=S(`g`,{class:`bk-bucket`});n.appendChild(S(`rect`,{class:`bk-bucket__box`,x:t,y:p,width:k,height:ne,rx:6}));let r=S(`text`,{class:`bk-bucket__f`,x:N(e),y:266});r.textContent=`f=${e}`,n.appendChild(r);let i=S(`text`,{class:`bk-bucket__items`,x:N(e),y:292});n.appendChild(i),I.appendChild(n),U.push({g:n,items:i,f:e})}let W=S(`path`,{class:`bk-collect__tri`,d:`M 0 0 L 0 0 L 0 0`}),G=S(`rect`,{class:`bk-collect__tag`,x:0,y:te,width:54,height:22,rx:6}),K=S(`text`,{class:`bk-collect__text`,x:0,y:225});L.appendChild(W),L.appendChild(G),L.appendChild(K);let q=v[0].k,le=(j-(q*44+(q-1)*10))/2,J=S(`text`,{class:`bk-ans__label`,x:m,y:350});J.textContent=`答案（收满 ${q} 个停）`,L.appendChild(J);let Y=[];for(let e=0;e<q;e+=1){let t=S(`g`,{class:`bk-ans`}),n=le+e*54;t.appendChild(S(`rect`,{class:`bk-ans__box`,x:n,y:re,width:44,height:36,rx:6}));let r=S(`text`,{class:`bk-ans__text`,x:n+44/2,y:350});t.appendChild(r),L.appendChild(t),Y.push({g:t,t:r})}let X=T();function ue(t,n){if(!n)return;let r=n.phase,{buckets:i,freq:a,ans:o}=n;for(let e of ce){let t=a[e.v]!==void 0;e.t.textContent=t?`${e.v} x ${a[e.v]}`:`${e.v} x ?`,e.g.setAttribute(`class`,t?`bk-freq is-lit`:`bk-freq`)}let s=new Set;for(let e of o)s.add(a[e]);for(let e of U){let t=e.f,a=i[t];e.items.textContent=a.length?a.join(`,`):``;let o=[`bk-bucket`];a.length===0&&o.push(`is-empty`),s.has(t)&&o.push(`is-collected`),r===`bucket`&&n.bucketIdx===t&&o.push(`is-new`),r===`collect`&&n.collectIdx===t&&o.push(`is-scanned`),e.g.setAttribute(`class`,o.join(` `))}if(r===`collect`&&n.collectIdx!==null){let e=N(n.collectIdx),t=p-2;W.setAttribute(`d`,`M ${e-7} ${t-12} L ${e+7} ${t-12} L ${e} ${t} z`),G.setAttribute(`x`,e-27),K.setAttribute(`x`,e),K.textContent=`f=${n.collectIdx}`,W.style.opacity=`1`,G.style.opacity=`1`,K.style.opacity=`1`}else W.style.opacity=`0`,G.style.opacity=`0`,K.style.opacity=`0`;for(let e=0;e<Y.length;e+=1){let t=e<o.length;Y[e].t.textContent=t?String(o[e]):`?`,Y[e].g.setAttribute(`class`,t?`bk-ans is-filled`:`bk-ans`)}z.textContent=`前 ${n.k} 高频 · 已收 ${n.collected}/${n.k}`,r===`count`?B.textContent=`计数：${n.cur} 出现 ${n.curFreq} 次`:r===`bucket`?B.textContent=`${n.cur} 进桶 f=${n.bucketIdx}`:r===`collect`?B.textContent=n.cur===null?`桶 f=${n.collectIdx} 是空的，跳过`:`收集 f=${n.collectIdx} 里的 ${n.cur}`:r===`init`?B.textContent=`哈希计数 → 按频率入桶 → 从右往左收`:B.textContent=`收满了`,V.textContent=o.length>=n.k?`答案 [${o.join(`, `)}]`:`答案 ?`,e(X,n.desc)}C.appendChild(X);let Z=i();C.appendChild(Z.root),a.textContent=``,a.appendChild(C),n();let de=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:v,controls:Z,intervalMs:ie,onRender:ue});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return y&&!de&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(C)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.bkMounted,document.getElementById(c)?.remove()}}}export{y as mountBucketTopK};