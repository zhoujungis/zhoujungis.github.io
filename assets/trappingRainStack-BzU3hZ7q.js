import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[0,1,0,2,1,0,1,3,2,1,2,1];function o(e={}){let t=Array.isArray(e.height)?e.height:a,n=t.length,r=Number.isInteger(e.maxSteps)?e.maxSteps:400,i={height:[...t],water:Array(n).fill(0),i:-1,stack:[],bottom:null,leftBound:null,rightBound:null,width:null,layerH:null,level:null,gained:0,total:0};if(n<3)return[{...i,phase:`done`,desc:`只有 \`${n}\` 根柱子 —— 少于三根就围不出凹槽，**接不住任何水**，答案是 \`0\`。`,done:!0}];let o=[],s=Array(n).fill(0),c=[],l=0,u=0,d=(e,t,n={})=>{o.push({...i,water:[...s],stack:[...c],total:l,phase:e,desc:t,done:e===`done`,...n})};d(`init`,`还是这排柱子 \`[${t.join(`, `)}]\`，但**换一种切法**。前面两种解法（暴力 / 动态规划 / 双指针）都是**竖着切**：站在位置 \`i\` 上问"我头顶能存多少水"，一次算完一整列。单调栈是**横着切**：不问每一列，而是**找到一个凹槽就结算一整层**。做法是：用一个栈存**下标**，并让这些下标对应的高度**单调递减**。一旦遇到一根**比栈顶更高**的柱子，就说明凹槽的右边界出现了 —— 栈顶那个是槽底，弹出后的新栈顶是左边界，当前这根是右边界，于是可以算这一层：\`宽 = 右边界 - 左边界 - 1\`，\`高 = min(左边界高, 右边界高) - 槽底高\`，\`水量 += 宽 × 高\`。**这个视角最直观的差别是：同一个位置的水可能被分几次加上**（一次一层）。官方例里下标 5 那 2 单位的水就是这么来的 —— 留意它。`);for(let e=0;e<n&&(u+=1,!(u>r));e+=1){let n=t[e];for(;c.length>0&&n>t[c[c.length-1]];){let r=c.pop(),i=t[r];if(c.length===0){d(`settle`,`\`i = ${e}\`，\`height[${e}] = ${n}\` **>** 栈顶 \`height[${r}] = ${i}\` —— 右边界出现了。弹出槽底 \`${r}\`，可此时栈**空了** —— **只有右边界、没有左边界，围不出凹槽**，这一层结算为 \`0\`。（这就是代码里 \`if not stack: break\` 那一行的意思。）`,{i:e,bottom:r,gained:0,width:0,layerH:0,level:0});break}let a=c[c.length-1],o=t[a],u=Math.min(n,o),f=u-i,p=e-a-1;if(f>0)for(let n=a+1;n<e;n+=1)s[n]=Math.max(s[n],u-t[n]);let m=p*f;l+=m,d(`settle`,`\`i = ${e}\`，\`height[${e}] = ${n}\` **>** 栈顶 \`height[${r}] = ${i}\` —— 右边界出现了。弹出槽底 \`${r}\`（高度 \`${i}\`）；弹出后的新栈顶 \`${a}\`（高度 \`${o}\`）就是**左边界**，当前这根 \`${e}\`（高度 \`${n}\`）是**右边界**。这一层的水位由两边**较矮的那根**决定：\`min(${n}, ${o}) = ${u}\`。于是 \`高 = ${u} - ${i} = ${f}\`，\`宽 = ${e} - ${a} - 1 = ${p}\`，水量 += \`${p} × ${f} = ${m}\`。`,{i:e,bottom:r,leftBound:a,rightBound:e,width:p,layerH:f,level:u,gained:m})}c.push(e),d(`push`,`\`i = ${e}\`，\`height[${e}] = ${n}\`。`+(c.length>1?`它不高于栈顶 \`height[${c[c.length-2]}] = ${t[c[c.length-2]]}\`，栈内高度保持**递减**，直接压入。`:`栈是空的，直接压入。`)+` 栈 = \`[${c.join(`, `)}]\`。`,{i:e})}let f=s.map((e,t)=>e>0?t:-1).filter(e=>e>=0);return d(`done`,(l===0?`扫描结束，**一滴水都接不住**。`:`扫描结束。**答案 = \`${l}\`** 单位的水，落在下标 \`[${f.join(`, `)}]\` 这几格上。`)+' 和双指针那边的答案**一模一样** —— 它们只是**切法不同**：双指针是竖着切（一次算完一整列），单调栈是横着切（一次填满一层）。回头看下标 5 那格：它的 `2` 单位水是**分两次**加上的 —— `i = 6` 时加了 1 层，`i = 7` 时又加了 1 层。这就是"按层累加"最硬的证据。复杂度：每个下标**恰好入栈一次、出栈一次**，`while` 的总执行次数不超过 `n` —— 所以是 `O(n)` 时间、**`O(n)` 空间**（栈最坏能装下全部下标）。',{i:n-1,done:!0}),o}var s=`trs-styles`,c=54,l=88,u=46,d=158,f=320,p=46,m=3,ee=14,te=336,ne=20,re=362,ie=376,ae=34,oe=34,h=4,g=26,_=604,se=1100,v=`
.trs {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.trs__svg { width: 100%; height: auto; display: block; }

.trs-note {
  fill: var(--trs-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.trs-ground { stroke: var(--trs-line-strong, #9aa39c); stroke-width: 2; }

/* ── 柱子 ─────────────────────────────────────────────────────────────── */
.trs-bar__box {
  fill: var(--trs-bar-fill, #efece4);
  stroke: var(--trs-line, #c3c9c2);
  stroke-width: 1.5;
}
.trs-bar__h {
  fill: var(--trs-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 已接住的水（常态蓝色） */
.trs-bar__water {
  fill: var(--trs-water, #7fa8c9);
  stroke: var(--trs-water-line, #4a7fa8);
  stroke-width: 1.5;
}
/* ⚠️ 本帧**新增**的那一层：淡金填充 + 金色实线边框。
   初版用 rgba 半透明 + 虚线 —— 虚线在视觉语言里是"被排除/禁用"，
   而这里恰恰是"本帧刚加上的水"，语义完全反了；半透明叠在已有的蓝色水上
   又会混成一种说不清的灰。改成实线 + 不透明淡金，和水（蓝）一眼分开。 */
.trs-layer {
  fill: var(--trs-layer-fill, #fdeecb);
  stroke: var(--trs-gold, #c2872f);
  stroke-width: 2.5;
}
/* 扫描下标 i 指向的柱子 */
.trs-bar.is-scan .trs-bar__box {
  fill: var(--trs-hot-fill, #fdf1ec);
  stroke: var(--trs-hot, #a45f45);
  stroke-width: 3;
}
.trs-bar.is-scan .trs-bar__h { fill: var(--trs-hot, #a45f45); }

/* 扫描指针：柱子上方朝下的三角 */
.trs-scan__tri { fill: var(--trs-hot, #a45f45); }
.trs-scan__text {
  fill: var(--trs-hot, #a45f45);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.trs-idx {
  fill: var(--trs-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 栈 ───────────────────────────────────────────────────────────────── */
.trs-stack__title {
  fill: var(--trs-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trs-slot__box {
  fill: var(--trs-fill, #ffffff);
  stroke: var(--trs-line, #c3c9c2);
  stroke-width: 1.5;
}
.trs-slot__idx {
  fill: var(--trs-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trs-slot__h {
  fill: var(--trs-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 栈顶那一格 */
.trs-slot.is-top .trs-slot__box {
  fill: var(--trs-gold-fill, #fdf6e8);
  stroke: var(--trs-gold, #c2872f);
  stroke-width: 2.5;
}
.trs-slot.is-top .trs-slot__idx { fill: var(--trs-gold, #c2872f); }
.trs-stack__empty {
  fill: var(--trs-dim, #b9b9b3);
  font-size: 13px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.trs-banner__box {
  fill: var(--trs-banner-fill, #f4f2ec);
  stroke: var(--trs-line, #c3c9c2);
  stroke-width: 1.5;
}
.trs-banner__seg {
  fill: var(--trs-muted, #657168);
  font-size: 13.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trs-banner__label {
  fill: var(--trs-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trs-banner__ans {
  fill: var(--trs-water-line, #4a7fa8);
  font-size: 21px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.trs-empty__text {
  fill: var(--trs-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function ce(){if(document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=v,document.head.appendChild(e)}function y(a,v={}){if(!a||a.dataset.trsMounted===`1`)return{destroy(){}};a.dataset.trsMounted=`1`,ce();let y=o(v),le=v.autoplay!==!1,b=y[0].height,x=b.length,S=r,C=document.createElement(`div`);C.className=`viz trs`;let w=document.createElement(`div`);w.className=`viz__stage`,C.appendChild(w);function T(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(x<3){let e=S(`svg`,{class:`viz__svg trs__svg`,viewBox:`0 0 620 120`,role:`img`}),t=S(`text`,{class:`trs-empty__text`,x:620/2,y:120/2});return t.textContent=`只有 ${x} 根柱子，围不出凹槽，接不住水`,e.appendChild(t),w.appendChild(e),C.appendChild(T()),C.appendChild(i().root),a.textContent=``,a.appendChild(C),{destroy(){a.textContent=``,delete a.dataset.trsMounted,document.getElementById(s)?.remove()}}}let E=p;x*E+(x-1)*m>_&&(E=Math.max(8,Math.floor((_-(x-1)*m)/x)));let D=x*E+(x-1)*m,O=Math.max(660,g*2+D),k=(O-D)/2,A=e=>k+e*(E+m),j=e=>A(e)+E/2,ue=Math.max(...b),M=d/Math.max(ue,1),N=e=>f-e*M,P=ae;x*P+(x-1)*h>_&&(P=Math.max(14,Math.floor((_-(x-1)*h)/x)));let de=(O-(x*P+(x-1)*h))/2,F=O-g*2,I=S(`svg`,{class:`viz__svg trs__svg`,viewBox:`0 0 ${O} 430`,role:`img`,"aria-label":`接雨水单调栈推演动画`});w.appendChild(I);let L=S(`g`,{class:`trs-waters`}),R=S(`g`,{class:`trs-bars`}),z=S(`g`,{class:`trs-layers`}),B=S(`g`,{class:`trs-marks`});I.appendChild(L),I.appendChild(R),I.appendChild(z),I.appendChild(B);let V=S(`text`,{class:`trs-note`,x:g,y:c});V.textContent=`横着切：栈内高度递减，遇到更高的柱子就结算一层`,B.appendChild(V),B.appendChild(S(`line`,{class:`trs-ground`,x1:k-10,y1:f,x2:k+D+10,y2:f}));let H=[];for(let e=0;e<x;e+=1){let t=A(e),n=S(`g`,{class:`trs-bar`});n.appendChild(S(`rect`,{class:`trs-bar__box`,x:t,y:N(b[e]),width:E,height:Math.max(2,b[e]*M),rx:3}));let r=S(`text`,{class:`trs-bar__h`,x:j(e),y:f-ee});r.textContent=String(b[e]),n.appendChild(r),R.appendChild(n);let i=S(`rect`,{class:`trs-bar__water`,x:t,y:N(b[e]),width:E,height:0,rx:2});L.appendChild(i),H.push({g:n,w:i,id:e})}let U=S(`rect`,{class:`trs-layer`,x:0,y:0,width:0,height:0,rx:2});z.appendChild(U);for(let e=0;e<x;e+=1){let t=S(`text`,{class:`trs-idx`,x:j(e),y:te});t.textContent=String(e),B.appendChild(t)}let W=S(`path`,{class:`trs-scan__tri`,d:`M 0 0 L 0 0 L 0 0`}),G=S(`text`,{class:`trs-scan__text`,x:0,y:0});B.appendChild(W),B.appendChild(G);let K=S(`text`,{class:`trs-stack__title`,x:g,y:re});K.textContent=`栈（左 = 栈底，右 = 栈顶）· 只存下标`,B.appendChild(K);let q=S(`text`,{class:`trs-stack__empty`,x:de,y:393});q.textContent=`（栈是空的）`,B.appendChild(q);let J=[];for(let e=0;e<x;e+=1){let t=de+e*(P+h),n=S(`g`,{class:`trs-slot`});n.appendChild(S(`rect`,{class:`trs-slot__box`,x:t,y:ie,width:P,height:oe,rx:5}));let r=S(`text`,{class:`trs-slot__idx`,x:t+P/2,y:389});n.appendChild(r);let i=S(`text`,{class:`trs-slot__h`,x:t+P/2,y:402});n.appendChild(i),B.appendChild(n),J.push({g:n,idxT:r,hT:i})}B.appendChild(S(`rect`,{class:`trs-banner__box`,x:g,y:l,width:F,height:u,rx:9}));let Y=S(`text`,{class:`trs-banner__seg`,x:44,y:111});B.appendChild(Y);let X=S(`text`,{class:`trs-banner__label`,x:g+F-68,y:111});X.textContent=`累计水量`,B.appendChild(X);let Z=S(`text`,{class:`trs-banner__ans`,x:g+F-18,y:111});Z.textContent=`0`,B.appendChild(Z);let fe=T();function pe(t,n){if(!n)return;let r=n.stack??[],i=n.i,a=n.water,o=n.phase===`done`;for(let e of H){let{g:t,w:n,id:r}=e,s=a[r];s>0?(n.setAttribute(`y`,N(b[r]+s)),n.setAttribute(`height`,s*M),n.style.opacity=`1`):(n.style.opacity=`0`,n.setAttribute(`height`,0));let c=[`trs-bar`];!o&&r===i&&c.push(`is-scan`),t.setAttribute(`class`,c.join(` `))}if(!o&&n.phase===`settle`&&n.leftBound!==null&&n.layerH>0){let e=A(n.leftBound+1),t=A(n.rightBound-1)+E,r=N(n.level),i=N(b[n.bottom]);U.setAttribute(`x`,e),U.setAttribute(`y`,r),U.setAttribute(`width`,Math.max(2,t-e)),U.setAttribute(`height`,Math.max(2,i-r)),U.style.opacity=`1`}else U.style.opacity=`0`;if(!o&&i>=0&&i<x){let e=j(i),t=N(b[i])-6;W.setAttribute(`d`,`M ${e-7} ${t-11} L ${e+7} ${t-11} L ${e} ${t} z`),G.setAttribute(`x`,e),G.setAttribute(`y`,t-ne),G.textContent=`i=${i}`,W.style.opacity=`1`,G.style.opacity=`1`}else W.style.opacity=`0`,G.style.opacity=`0`;q.style.opacity=r.length===0?`1`:`0`,J.forEach((e,t)=>{let n=r[t];if(n===void 0){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`,e.idxT.textContent=String(n),e.hT.textContent=`h=${b[n]}`,e.g.setAttribute(`class`,t===r.length-1?`trs-slot is-top`:`trs-slot`)}),o?Y.textContent=`结束 · 共 ${n.total} 单位`:n.phase===`settle`&&n.leftBound!==null?Y.textContent=`槽底 ${n.bottom}(h=${b[n.bottom]}) · 边界 [${n.leftBound}, ${n.rightBound}] · ${n.width}×${n.layerH} = +${n.gained}`:n.phase===`settle`?Y.textContent=`弹出 ${n.bottom}，栈空 —— 没有左边界，这一层为 0`:n.phase===`push`?Y.textContent=`压入 ${i}（h=${b[i]}）`:Y.textContent=`等待开始 · 遇到更高的柱子就结算一层`,Z.textContent=String(n.total),e(fe,n.desc)}C.appendChild(fe);let me=i();C.appendChild(me.root),a.textContent=``,a.appendChild(C),n();let he=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:y,controls:me,intervalMs:se,onRender:pe});Q.jumpTo(Math.trunc(v.initialStep)||0);let $=null;return le&&!he&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(C)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.trsMounted,document.getElementById(s)?.remove()}}}export{y as mountTrappingRainStack};