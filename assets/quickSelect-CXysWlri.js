import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[3,2,1,5,6,4],o=2;function s(e){let t=e>>>0||12345;return()=>(t=t*1103515245+12345&2147483647,t/2147483647)}function c(e={}){let t=(Array.isArray(e.nums)?e.nums:a).slice(),n=t.length,r=Number.isInteger(e.k)?e.k:o,i=Math.min(Math.max(r,1),Math.max(n,1)),c=Number.isInteger(e.maxSteps)?e.maxSteps:400,l=e.pivot===`random`?`random`:`last`,u=s(Number.isInteger(e.seed)?e.seed:20240928),d=[],f=n-i,p=0,m=n-1,h=0,g=null,_=null,v=null,y=null,b=null,x=null,S=(e,r,a={})=>{d.push({phase:e,desc:r,arr:t.slice(),n,k:i,target:f,left:p,right:m,pivotValue:v,pivotIdx:y,i:b,j:x,swapPair:null,cmp:null,found:g,foundIdx:_,round:h,done:e===`done`,...a})};if(n===0)return S(`done`,`数组是空的，没有第 k 大。`),d;S(`init`,`给了 \`${n}\` 个数 \`[${t.join(`, `)}]\`，要找**第 \`${i}\` 大**。先把这句话翻译成下标：升序排好之后，第 \`${i}\` 大就是**倒数第 \`${i}\` 个**，也就是升序下标 \`n - k = ${n} - ${i} = ${f}\`。所以题目等价于：**找出升序第 \`${f}\` 位（0 基）的那个数**。这个换算是最容易写错的地方 —— 写成 \`k - 1\` 的话，找的就变成第 \`${i}\` **小**了。另外先约定一件事：「第 k 大」是**排序后的第 k 个位置**，不是「第 k 个不同的值」 —— 重复元素各占各的位置。`);let C=0;for(;p<=m&&C<c;){if(C+=1,h+=1,p===m){g=t[p],_=p,y=p;break}let e=m;if(l===`random`){e=p+Math.floor(u()*(m-p+1));let n=t[e];t[e]=t[m],t[m]=n,e=m}for(v=t[m],y=m,b=p,x=null,S(`pick`,`**第 \`${h}\` 轮分区**，当前搜索区间 \`[${p}, ${m}]\`。`+(l===`random`?`随机挑一个位置、把它换到区间最右端当枢轴 —— 随机化是为了避免"有序输入 + 固定取末尾"退化成 O(n²)。`:`取区间最右端的 \`${v}\` 当枢轴（pivot）。`)+`这一趟扫描只做一件事：把区间里**小于等于 \`${v}\` 的都挪到左边**。游标 \`i\` 指向"小于等于区"的下一个空位，游标 \`j\` 从左往右扫。`),x=p;x<m&&!(C>=c);x+=1){C+=1;let e=t[x];if(e<=v){let n=b,r=x,i=t[n];t[n]=t[r],t[r]=i;let a=n!==r;b+=1,S(`scan`,`\`j = ${x}\`：\`arr[${x}] = ${e}\` **<= \`${v}\`**，归入左边。`+(a?`交换 \`${n}\` 与 \`${r}\` 两格，\`${e}\` 被换到下标 \`${n}\`。`:"它本来就在 `i` 指向的位置上，不用换。")+` \`i\` 前进到 \`${b}\`，"小于等于区"扩大一格。`,{swapPair:[n,r],cmp:`le`})}else S(`scan`,`\`j = ${x}\`：\`arr[${x}] = ${e}\` **> \`${v}\`**，**不动** —— 它属于右边那一堆。\`j\` 继续前进，\`i\` 留在下标 \`${b}\` 等着下一个"小个子"。`,{cmp:`gt`})}let r=b,a=m,o=t[r];if(t[r]=t[a],t[a]=o,y=b,x=null,S(`place`,`扫描结束。此时 \`i\` 正好指向"大于区"的第一个位置，把枢轴 \`${v}\` 换到这里 —— 交换 \`i = ${r}\` 与 \`right = ${a}\`，数组变成 \`[${t.join(`, `)}]\` （区间内部分）。**枢轴就此落在下标 \`${y}\`**：它左边全 \`<= ${v}\`，右边全 \`> ${v}\`。这个位置就是它的**最终排名** —— 整个数组升序排好后它就在这一位。`,{swapPair:[r,a]}),y===f){g=t[y],_=y,S(`found`,`枢轴 \`${v}\` 落在下标 \`${y}\`，**正好是目标位 \`n - k = ${f}\`** —— 它就是第 \`${i}\` 大。此时它左边 \`${y}\` 个元素都不比它大，右边 \`${n-y-1}\` 个元素都不比它小，排名确凿，不用再比了。`);break}if(y<f){let e=p;p=y+1,S(`narrow`,`枢轴落在 \`${y}\`，目标位是 \`${f}\`。\`${y} < ${f}\` —— **答案在枢轴右边**。左边那 \`${y-e+1}\` 个（含枢轴自己）排名都比目标位靠前，全部淘汰，以后一眼都不看。区间收缩成 \`[${p}, ${m}]\`。**这就是省时间的全部秘密**：快排要递归两边，快速选择只进一边。`)}else{let e=m;m=y-1,S(`narrow`,`枢轴落在 \`${y}\`，目标位是 \`${f}\`。\`${y} > ${f}\` —— **答案在枢轴左边**。右边那 \`${e-y+1}\` 个（含枢轴自己）排名都比目标位靠后，全部淘汰。区间收缩成 \`[${p}, ${m}]\`。`)}v=null,b=null}return S(`done`,g===null?`达到步数上限 \`${c}\`，提前收尾（正常输入不会走到这里）。`:`结束。**第 \`${i}\` 大 = \`${g}\`**，它在升序数组里的位置是下标 \`${_}\`。回头看这趟：一共只做了 \`${h}\` 轮分区，每轮扫描当前区间一次就把一半左右的候选淘汰掉，总工作量是 \`n + n/2 + n/4 + … ≈ 2n\` —— 所以是**平均 O(n)** 时间，而且全程只在原数组上交换，**O(1) 额外空间**。但别忘了那两个字是"平均"：最坏情况（比如有序数组配固定取末尾的枢轴）每轮只砍掉 1 个，会退化成 O(n²)。`),d}var l=`qs-styles`,u=54,d=84,f=46,p=152,m=198,h=56,g=272,_=304,v=322,y=58,b=6,x=26,S=604,C=1250,w=`
.qs {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.qs__svg { width: 100%; height: auto; display: block; }

.qs-note {
  fill: var(--qs-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.qs-banner__box {
  fill: var(--qs-banner, #f4f3ef);
  stroke: var(--qs-line, #c3c9c2);
  stroke-width: 1.5;
}
.qs-banner__seg {
  fill: var(--qs-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.qs-banner__ans {
  fill: var(--qs-gold, #c2872f);
  font-size: 19px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 格子 ─────────────────────────────────────────────────────────────── */
.qs-cell__box {
  fill: var(--qs-fill, #ffffff);
  stroke: var(--qs-line, #c3c9c2);
  stroke-width: 1.5;
}
.qs-cell__value {
  fill: var(--qs-ink, #1f2a24);
  font-size: 18px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.qs-cell__idx {
  fill: var(--qs-dim, #9aa39c);
  font-size: 11.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 通道一（底色）：已被淘汰出搜索区间 */
.qs-cell.is-outside .qs-cell__box {
  fill: var(--qs-dim-fill, #f0efea);
  stroke: var(--qs-line, #c3c9c2);
  stroke-dasharray: 4 3;
}
.qs-cell.is-outside .qs-cell__value { fill: var(--qs-dim, #9aa39c); }
.qs-cell.is-outside .qs-cell__idx { fill: var(--qs-dim, #9aa39c); }

/* 通道一（底色）：枢轴左边的"<= 区" */
.qs-cell.is-lezone .qs-cell__box {
  fill: var(--qs-ok-fill, #eef5f1);
}
/* 通道一（底色）：枢轴所在格 */
.qs-cell.is-pivot .qs-cell__box {
  fill: var(--qs-gold-fill, #fdf3e3);
}
.qs-cell.is-pivot .qs-cell__value { fill: var(--qs-gold, #c2872f); }

/* 通道二（边框）：本帧正在交换的两格 */
.qs-cell.is-swap .qs-cell__box {
  stroke: var(--qs-hot, #a45f45);
  stroke-width: 3;
}
.qs-cell.is-swap .qs-cell__value { fill: var(--qs-hot, #a45f45); }

/* 通道二（边框）：命中的答案格 */
.qs-cell.is-found .qs-cell__box {
  stroke: var(--qs-gold, #c2872f);
  stroke-width: 3.5;
}
.qs-cell.is-found .qs-cell__value { fill: var(--qs-gold, #c2872f); }

/* ── i / j 游标 ───────────────────────────────────────────────────────── */
.qs-i__tag { fill: var(--qs-ok, #3f6b57); }
.qs-i__tri { fill: var(--qs-ok, #3f6b57); }
.qs-i__text {
  fill: var(--qs-paper, #ffffff);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.qs-j__tag { fill: var(--qs-hot, #a45f45); }
.qs-j__tri { fill: var(--qs-hot, #a45f45); }
.qs-j__text {
  fill: var(--qs-paper, #ffffff);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 目标位标记 ───────────────────────────────────────────────────────── */
.qs-target__line {
  stroke: var(--qs-gold, #c2872f);
  stroke-width: 2;
  stroke-dasharray: 5 3;
}
.qs-target__tri { fill: var(--qs-gold, #c2872f); }
.qs-target__text {
  fill: var(--qs-gold, #c2872f);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.qs-empty__text {
  fill: var(--qs-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function ee(){if(document.getElementById(l))return;let e=document.createElement(`style`);e.id=l,e.textContent=w,document.head.appendChild(e)}function T(a,o={}){if(!a||a.dataset.qsMounted===`1`)return{destroy(){}};a.dataset.qsMounted=`1`,ee();let s=c(o),w=o.autoplay!==!1,T=s[0].arr.length,E=r,D=document.createElement(`div`);D.className=`viz qs`;let O=document.createElement(`div`);O.className=`viz__stage`,D.appendChild(O);function k(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(T===0){let e=E(`svg`,{class:`viz__svg qs__svg`,viewBox:`0 0 620 120`,role:`img`}),t=E(`text`,{class:`qs-empty__text`,x:620/2,y:120/2});return t.textContent=`空数组 —— 没有第 k 大`,e.appendChild(t),O.appendChild(e),D.appendChild(k()),D.appendChild(i().root),a.textContent=``,a.appendChild(D),n(),{destroy(){a.textContent=``,delete a.dataset.qsMounted,document.getElementById(l)?.remove()}}}let A=y;T*A+(T-1)*b>S&&(A=Math.max(16,Math.floor((S-(T-1)*b)/T)));let j=T*A+(T-1)*b,M=Math.max(660,x*2+j),te=(M-j)/2,N=e=>te+e*(A+b),P=e=>N(e)+A/2,F=M-x*2,I=E(`svg`,{class:`viz__svg qs__svg`,viewBox:`0 0 ${M} 344`,role:`img`,"aria-label":`第 K 大元素 快速选择推演动画`});O.appendChild(I);let L=E(`g`,{class:`qs-cells`}),R=E(`g`,{class:`qs-marks`});I.appendChild(L),I.appendChild(R);let z=E(`text`,{class:`qs-note`,x,y:u});z.textContent=`第 k 大 = 升序第 n-k 位 —— 快速选择只递归一边，所以是 O(n) 不是 O(n log n)`,R.appendChild(z),R.appendChild(E(`rect`,{class:`qs-banner__box`,x,y:d,width:F,height:f,rx:9}));let ne=E(`text`,{class:`qs-banner__seg`,x:44,y:107}),re=E(`text`,{class:`qs-banner__seg`,x:226,y:107}),B=E(`text`,{class:`qs-banner__seg`,x:406,y:107}),V=E(`text`,{class:`qs-banner__ans`,x:x+F-18,y:107});R.appendChild(ne),R.appendChild(re),R.appendChild(B),R.appendChild(V);let H=[];for(let e=0;e<T;e+=1){let t=N(e),n=E(`g`,{class:`qs-cell`});n.appendChild(E(`rect`,{class:`qs-cell__box`,x:t,y:m,width:A,height:h,rx:6}));let r=E(`text`,{class:`qs-cell__value`,x:P(e),y:220});n.appendChild(r);let i=E(`text`,{class:`qs-cell__idx`,x:P(e),y:240});i.textContent=String(e),n.appendChild(i),L.appendChild(n),H.push({g:n,v:r,id:e})}let U=E(`path`,{class:`qs-i__tri`,d:`M 0 0 L 0 0 L 0 0`}),W=E(`rect`,{class:`qs-i__tag`,x:0,y:p,width:54,height:22,rx:6}),G=E(`text`,{class:`qs-i__text`,x:0,y:163});R.appendChild(U),R.appendChild(W),R.appendChild(G);let K=E(`path`,{class:`qs-j__tri`,d:`M 0 0 L 0 0 L 0 0`}),q=E(`rect`,{class:`qs-j__tag`,x:0,y:g,width:54,height:22,rx:6}),J=E(`text`,{class:`qs-j__text`,x:0,y:283});R.appendChild(K),R.appendChild(q),R.appendChild(J);let Y=E(`line`,{class:`qs-target__line`,x1:0,y1:256,x2:0,y2:_}),X=E(`path`,{class:`qs-target__tri`,d:`M 0 0 L 0 0 L 0 0`}),Z=E(`text`,{class:`qs-target__text`,x:0,y:v});R.appendChild(Y),R.appendChild(X),R.appendChild(Z);let ie=k();function ae(t,n){if(!n)return;let{arr:r,left:i,right:a,target:o,k:s,round:c}=n,l=n.phase,u=l===`done`,d=n.found,f=new Set;l===`scan`&&n.swapPair&&n.swapPair[0]!==n.swapPair[1]&&(f.add(n.swapPair[0]),f.add(n.swapPair[1]));for(let e of H){let t=e.id;e.v.textContent=String(r[t]);let o=[`qs-cell`];t<i||t>a?o.push(`is-outside`):n.i!==null&&t<n.i&&t>=i&&o.push(`is-lezone`),n.pivotIdx!==null&&t===n.pivotIdx&&n.pivotValue!==null&&o.push(`is-pivot`),f.has(t)&&o.push(`is-swap`),d!==null&&t===n.foundIdx&&o.push(`is-found`),e.g.setAttribute(`class`,o.join(` `))}if(!u&&n.i!==null&&n.i>=0&&n.i<T){let e=P(n.i),t=m-6;U.setAttribute(`d`,`M ${e-7} ${t-14} L ${e+7} ${t-14} L ${e} ${t} z`),W.setAttribute(`x`,e-27),G.setAttribute(`x`,e),G.textContent=`i=${n.i}`,U.style.opacity=`1`,W.style.opacity=`1`,G.style.opacity=`1`}else U.style.opacity=`0`,W.style.opacity=`0`,G.style.opacity=`0`;if(!u&&n.j!==null&&n.j>=0&&n.j<T){let e=P(n.j);K.setAttribute(`d`,`M ${e-7} 270 L ${e+7} 270 L ${e} 256 z`),q.setAttribute(`x`,e-27),J.setAttribute(`x`,e),J.textContent=`j=${n.j}`,K.style.opacity=`1`,q.style.opacity=`1`,J.style.opacity=`1`}else K.style.opacity=`0`,q.style.opacity=`0`,J.style.opacity=`0`;let p=P(o);Y.setAttribute(`x1`,p),Y.setAttribute(`x2`,p),X.setAttribute(`d`,`M ${p-7} ${_-12} L ${p+7} ${_-12} L ${p} ${_} z`),Z.setAttribute(`x`,p),Z.textContent=`目标位 ${o}`,ne.textContent=`第 ${s} 大 · 目标位 ${o}`,re.textContent=c>0?`第 ${c} 轮 · 区间 [${i}, ${a}]`:`区间 [${i}, ${a}]`,d===null?l===`scan`&&n.swapPair&&n.swapPair[0]!==n.swapPair[1]?B.textContent=`swap(${n.swapPair[0]}, ${n.swapPair[1]})`:n.pivotValue===null?B.textContent=``:B.textContent=`枢轴 ${n.pivotValue}`:B.textContent=`枢轴归位 ${n.pivotIdx}`,V.textContent=d===null?`答案 ?`:`答案 ${d}`,e(ie,n.desc)}D.appendChild(ie);let oe=i();D.appendChild(oe.root),a.textContent=``,a.appendChild(D),n();let se=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:s,controls:oe,intervalMs:C,onRender:ae});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return w&&!se&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(D)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.qsMounted,document.getElementById(l)?.remove()}}}export{T as mountQuickSelect};