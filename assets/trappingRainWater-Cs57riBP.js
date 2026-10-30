import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[0,1,0,2,1,0,1,3,2,1,2,1];function o(e={}){let t=Array.isArray(e.height)?e.height:a,n=t.length,r=Number.isInteger(e.maxSteps)?e.maxSteps:400,i={height:[...t],water:Array(n).fill(0),l:0,r:n-1,leftMax:0,rightMax:0,side:null,idx:null,gained:0,total:0};if(n<3)return[{...i,r:n===0?-1:n-1,phase:`done`,desc:`只有 \`${n}\` 根柱子 —— 少于三根就围不出凹槽，**接不住任何水**，答案是 \`0\`。`,done:!0}];let o=[],s=Array(n).fill(0),c=0,l=n-1,u=0,d=0,f=0,p=0,m=(e,t,n={})=>{o.push({...i,water:[...s],l:c,r:l,leftMax:u,rightMax:d,total:f,phase:e,desc:t,done:e===`done`,...n})};for(m(`init`,`给出了 \`${n}\` 根柱子的高度图 \`[${t.join(`, `)}]\`。先想清楚一件事：**位置 \`i\` 能存多少水，只取决于它左边最高的柱子和右边最高的柱子** —— 水会从矮的那一边漏出去，能留住的高度是两者的**短板**，也就是 \`water[i] = max(0, min(左最高, 右最高) - height[i])\`。所以整题其实只在问一句话：**每个位置的"左右最高"分别是多少？** 后面四种解法的全部区别，就是"怎么拿到这两个数"。双指针的做法是：**两端各派一个指针往中间夹**，一边走一边记录"这一侧到目前为止见过的最高"（\`leftMax\` 和 \`rightMax\`），**谁矮就先结算谁**。`);c<l&&(p+=1,!(p>r));){let e=t[c],n=t[l];if(e<n){let t=u;u=Math.max(u,e);let r=u-e;f+=r,s[c]=r,m(`settle-l`,`\`l = ${c}\`、\`r = ${l}\`。比较两端：\`height[${c}] = ${e}\` **<** \`height[${l}] = ${n}\` —— **左端更矮，结算左边这一格**。为什么敢现在就定它的水位？因为 \`${c}\` 的右边至少有一根高度 \`>= ${n}\` 的柱子（就是 \`r\` 自己那根），而 \`${n} > ${e}\` —— 它的"右侧最高"一定严格大于它自己的高度，**右边不可能成为短板**；真正决定水位的只可能是左侧，而 \`leftMax\` 是我们一路扫过来已经确切知道的数。结算：\`leftMax = max(${t}, ${e}) = ${u}\`，这一格的水 = \`${u} - ${e} = ${r}\``+(r===0?`（**它是目前左边最高的柱子**，自己就是边界，存不住水）。`:`。`),{side:`l`,idx:c,gained:r,leftMax:u,total:f}),c+=1}else{let t=d;d=Math.max(d,n);let r=d-n;f+=r,s[l]=r,m(`settle-r`,`\`l = ${c}\`、\`r = ${l}\`。比较两端：\`height[${c}] = ${e}\` **>=** \`height[${l}] = ${n}\` —— **右端更矮（或一样高），结算右边这一格**。道理是对称的：\`${l}\` 的左边至少有一根高度 \`>= ${e}\` 的柱子（就是 \`l\` 自己那根），而 \`${e} >= ${n}\` —— 它的"左侧最高"不会成为短板，水位只能由右侧决定，而 \`rightMax\` 是我们从右扫过来已经确切知道的数。结算：\`rightMax = max(${t}, ${n}) = ${d}\`，这一格的水 = \`${d} - ${n} = ${r}\``+(r===0?`（**它是目前右边最高的柱子**，自己就是边界，存不住水）。`:`。`),{side:`r`,idx:l,gained:r,rightMax:d,total:f}),--l}}let h=s.map((e,t)=>e>0?t:-1).filter(e=>e>=0);return m(`done`,(f===0?`扫描结束，**一滴水都接不住**（没有形成任何凹槽）。`:`扫描结束。**答案 = \`${f}\`** 单位的水，落在下标 \`[${h.join(`, `)}]\` 这几格上。`)+' 回头看这趟：`l` 和 `r` 从两端往中间走，**每一次只动一个指针，两个指针合计最多走 `n` 步** —— 所以是 `O(n)` 时间。全程只用了 `l`、`r`、`leftMax`、`rightMax`、`ans` 五个变量 —— **`O(1)` 空间**，比动态规划那两个数组的版本还省。它为什么能省掉那两个数组？因为**它根本不需要知道"每个位置的两侧最高"** —— 它只在"较矮的那一端"结算，而那一端的水位恰好已经确定。',{side:null,idx:null,gained:0,done:!0}),o}var s=`trw-styles`,c=54,l=88,u=46,d=158,f=320,p=46,m=3,h=14,ee=336,g=352,te=380,_=22,v=54,y=26,b=604,ne=1250,x=`
.trw {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.trw__svg { width: 100%; height: auto; display: block; }

/* ── 顶部小字 ─────────────────────────────────────────────────────────── */
.trw-note {
  fill: var(--trw-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 地面 ─────────────────────────────────────────────────────────────── */
.trw-ground { stroke: var(--trw-line-strong, #9aa39c); stroke-width: 2; }

/* ── 柱子 ─────────────────────────────────────────────────────────────── */
.trw-bar__box {
  fill: var(--trw-bar-fill, #efece4);
  stroke: var(--trw-line, #c3c9c2);
  stroke-width: 1.5;
}
.trw-bar__h {
  fill: var(--trw-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 水：画在柱子头顶 */
.trw-bar__water {
  fill: var(--trw-water, #7fa8c9);
  stroke: var(--trw-water-line, #4a7fa8);
  stroke-width: 1.5;
}
/* 本帧刚结算的那一格（金色粗边 + 外环）—— 和指针状态分开，见坑 L */
.trw-bar.is-cur .trw-bar__box {
  fill: var(--trw-gold-fill, #fdf6e8);
  stroke: var(--trw-gold, #c2872f);
  stroke-width: 3;
}
.trw-bar.is-cur .trw-bar__h { fill: var(--trw-gold, #c2872f); }
.trw-bar__ring {
  fill: none;
  stroke: var(--trw-gold, #c2872f);
  stroke-width: 2;
  opacity: 0;
}
.trw-bar.is-cur .trw-bar__ring { opacity: 1; }

/* ── 指针 ─────────────────────────────────────────────────────────────── */
.trw-pin__tag { fill: var(--trw-ok, #3f6b57); }
.trw-pin__tag.is-r { fill: var(--trw-cool, #4a5f8a); }
.trw-pin__text {
  fill: var(--trw-paper, #ffffff);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trw-pin__tick { stroke: var(--trw-ok, #3f6b57); stroke-width: 2; }
.trw-pin__tick.is-r { stroke: var(--trw-cool, #4a5f8a); }

/* ── 下标 ─────────────────────────────────────────────────────────────── */
.trw-idx {
  fill: var(--trw-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.trw-banner__box {
  fill: var(--trw-banner-fill, #f4f2ec);
  stroke: var(--trw-line, #c3c9c2);
  stroke-width: 1.5;
}
.trw-banner__seg {
  fill: var(--trw-muted, #657168);
  font-size: 13.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trw-banner__label {
  fill: var(--trw-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trw-banner__ans {
  fill: var(--trw-water-line, #4a7fa8);
  font-size: 21px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.trw-empty__text {
  fill: var(--trw-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function re(){if(document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=x,document.head.appendChild(e)}function S(a,x={}){if(!a||a.dataset.trwMounted===`1`)return{destroy(){}};a.dataset.trwMounted=`1`,re();let S=o(x),ie=x.autoplay!==!1,C=S[0].height,w=C.length,T=r,E=document.createElement(`div`);E.className=`viz trw`;let D=document.createElement(`div`);D.className=`viz__stage`,E.appendChild(D);function O(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(w<3){let e=T(`svg`,{class:`viz__svg trw__svg`,viewBox:`0 0 620 120`,role:`img`}),t=T(`text`,{class:`trw-empty__text`,x:620/2,y:120/2});return t.textContent=`只有 ${w} 根柱子，围不出凹槽，接不住水`,e.appendChild(t),D.appendChild(e),E.appendChild(O()),E.appendChild(i().root),a.textContent=``,a.appendChild(E),{destroy(){a.textContent=``,delete a.dataset.trwMounted,document.getElementById(s)?.remove()}}}let k=p;w*k+(w-1)*m>b&&(k=Math.max(8,Math.floor((b-(w-1)*m)/w)));let A=w*k+(w-1)*m,j=Math.max(660,y*2+A),M=(j-A)/2,ae=e=>M+e*(k+m),N=e=>ae(e)+k/2,oe=Math.max(...C),P=d/Math.max(oe,1),F=e=>f-e*P,I=j-y*2,L=T(`svg`,{class:`viz__svg trw__svg`,viewBox:`0 0 ${j} 422`,role:`img`,"aria-label":`接雨水双指针推演动画`});D.appendChild(L);let R=T(`g`,{class:`trw-waters`}),z=T(`g`,{class:`trw-bars`}),B=T(`g`,{class:`trw-marks`});L.appendChild(R),L.appendChild(z),L.appendChild(B);let V=T(`text`,{class:`trw-note`,x:y,y:c});V.textContent=`每格的水 = max(0, min(左最高, 右最高) - 自身高度) · 谁矮先结算谁`,B.appendChild(V);let se=T(`line`,{class:`trw-ground`,x1:M-10,y1:f,x2:M+A+10,y2:f});B.appendChild(se);let H=[];for(let e=0;e<w;e+=1){let t=ae(e),n=T(`g`,{class:`trw-bar`});n.appendChild(T(`rect`,{class:`trw-bar__ring`,x:t-4,y:F(C[e])-4,width:k+8,height:Math.max(6,C[e]*P+8),rx:5})),n.appendChild(T(`rect`,{class:`trw-bar__box`,x:t,y:F(C[e]),width:k,height:Math.max(2,C[e]*P),rx:3}));let r=T(`text`,{class:`trw-bar__h`,x:N(e),y:f-h});r.textContent=String(C[e]),n.appendChild(r),z.appendChild(n);let i=T(`rect`,{class:`trw-bar__water`,x:t,y:F(C[e]),width:k,height:0,rx:2});R.appendChild(i),H.push({g:n,w:i,id:e})}for(let e=0;e<w;e+=1){let t=T(`text`,{class:`trw-idx`,x:N(e),y:ee});t.textContent=String(e),B.appendChild(t)}function U(e){let t=T(`line`,{class:`trw-pin__tick ${e}`,x1:0,y1:0,x2:0,y2:0}),n=T(`rect`,{class:`trw-pin__tag ${e}`,x:0,y:0,width:v,height:_,rx:6}),r=T(`text`,{class:`trw-pin__text`,x:0,y:0});return B.appendChild(t),B.appendChild(n),B.appendChild(r),{tick:t,tag:n,text:r}}let W=U(`is-l`),G=U(`is-r`),ce=T(`rect`,{class:`trw-banner__box`,x:y,y:l,width:I,height:u,rx:9});B.appendChild(ce);let K=T(`text`,{class:`trw-banner__seg`,x:44,y:111}),q=T(`text`,{class:`trw-banner__seg`,x:196,y:111});B.appendChild(K),B.appendChild(q);let J=T(`text`,{class:`trw-banner__label`,x:y+I-68,y:111});J.textContent=`累计水量`,B.appendChild(J);let Y=T(`text`,{class:`trw-banner__ans`,x:y+I-18,y:111});Y.textContent=`0`,B.appendChild(Y);let X=O();function le(t,n){if(!n)return;let r=n.l,i=n.r,a=n.idx,o=n.water,s=n.phase===`done`;for(let e of H){let{g:t,w:n,id:r}=e,i=o[r];if(i>0){let e=F(C[r]+i);n.setAttribute(`y`,e),n.setAttribute(`height`,i*P),n.style.opacity=`1`}else n.style.opacity=`0`,n.setAttribute(`height`,0);let c=[`trw-bar`];!s&&r===a&&c.push(`is-cur`),t.setAttribute(`class`,c.join(` `))}let c=(e,t,n,a)=>{if(s||t<0||t>=w){e.tick.style.opacity=`0`,e.tag.style.opacity=`0`,e.text.style.opacity=`0`;return}let o=N(t);e.tick.setAttribute(`x1`,o),e.tick.setAttribute(`x2`,o),e.tick.setAttribute(`y1`,324),e.tick.setAttribute(`y2`,n-3),e.tick.style.opacity=`1`,e.tag.setAttribute(`x`,o-v/2),e.tag.setAttribute(`y`,n),e.text.setAttribute(`x`,o),e.text.setAttribute(`y`,n+_/2),e.text.textContent=r===i?`${a===`L`?`L=R`:`R`}=${t}`:`${a}=${t}`,e.tag.style.opacity=`1`,e.text.style.opacity=`1`};r===i?(c(W,r,g,`L`),G.tick.style.opacity=`0`,G.tag.style.opacity=`0`,G.text.style.opacity=`0`):(c(W,r,g,`L`),c(G,i,te,`R`)),K.textContent=`leftMax = ${n.leftMax}`,q.textContent=`rightMax = ${n.rightMax}`,Y.textContent=String(n.total),e(X,n.desc)}E.appendChild(X);let Z=i();E.appendChild(Z.root),a.textContent=``,a.appendChild(E),n();let ue=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:S,controls:Z,intervalMs:ne,onRender:le});Q.jumpTo(Math.trunc(x.initialStep)||0);let $=null;return ie&&!ue&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(E)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.trwMounted,document.getElementById(s)?.remove()}}}export{S as mountTrappingRainWater};