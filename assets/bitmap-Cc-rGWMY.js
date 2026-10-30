import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[37,12,37,5,63,42],o=64;function s(e={}){let t=Array.isArray(e.input)&&e.input.length>0&&e.input.every(e=>Number.isInteger(e)&&e>=0&&e<o)?e.input.slice():a.slice(),n=[],r=[],i=[],s=(e,a)=>{n.push({phase:e,input:t,size:o,value:null,word:0,bit:0,already:!1,placed:r.slice(),skipped:i.slice(),distinct:r.slice().sort((e,t)=>e-t),done:e===`done`,desc:``,...a})};return s(`init`,{desc:`输入 ${t.length} 个整数：${t.join(`、`)}，值域 0 ~ ${o-1}。位图的做法：开一片连续的内存，值域里每个整数对应 1 bit —— 出现过就把那 1 bit 置 1。重复的数再到来时那一位已经是 1，天然去重；最后按 bit 下标从小到大扫一遍，输出就是有序去重序列。`}),t.forEach((e,t)=>{let n=e>>5,a=e&31,o=r.includes(e);s(`locate`,{value:e,word:n,bit:a,already:o,desc:`第 ${t+1} 个数 ${e}：算它落在哪 —— word = ${e} >> 5 = ${n}（第 ${n} 个字，每字装 32 个数），bit = ${e} & 31 = ${a}（字内第 ${a} 位）。换算成人话：${e} = ${n} × 32 + ${a}。`}),o?(i.push(e),s(`act`,{value:e,word:n,bit:a,already:!0,desc:`这一位已经是 1 —— ${e} 之前出现过，直接跳过。这就是位图去重：不需要哈希表、不需要比较，看一眼 bit 就够。`})):(r.push(e),s(`act`,{value:e,word:n,bit:a,already:!1,desc:`这一位还是 0 —— 新数。执行置位：words[${n}] |= 1 << ${a}。注意是 |=（按位或）：只翻本位，同字其他位原样不动；写成 = 会把整个字冲掉。已放入 ${r.length} 个。`}))}),s(`done`,{value:null,desc:`扫描全位图（0 到 ${o-1} 逐位看）：置了 1 的位依次是 ${r.slice().sort((e,t)=>e-t).join(`、`)}。${t.length} 个输入去重后剩 ${r.length} 个，且天然有序 —— 这就是「10 亿个数排序去重」的全部魔法：值域 10^9 时位图只要 119 MiB，而原数组是 4 GB。`}),n}var c=`bm-styles`,l=900,u=`
.bm { display: flex; flex-direction: column; gap: 14px; }
.bm__svg { width: 100%; height: auto; display: block; }

.bm-note {
  fill: var(--bm-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.bm-banner__box {
  fill: var(--bm-banner, #f4f3ef);
  stroke: var(--bm-line, #c3c9c2);
  stroke-width: 1.5;
}
.bm-banner__seg {
  fill: var(--bm-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.bm-banner__val {
  fill: var(--bm-gold, #c2872f);
  font-size: 16px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bm-seclabel {
  fill: var(--bm-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}

/* ---- 位图阵列 ---- */
.bm-wordlabel {
  fill: var(--bm-muted, #657168);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
}
.bm-ruler {
  fill: var(--bm-dim, #9aa39c);
  font-size: 10px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bm-cell__box {
  fill: var(--bm-fill, #ffffff);
  stroke: var(--bm-line, #c3c9c2);
  stroke-width: 1;
}
.bm-cell.is-on .bm-cell__box {
  fill: var(--bm-green-fill, #eaf3ee);
  stroke: var(--bm-green, #3f6b57);
}
.bm-cell.is-cur .bm-cell__box {
  fill: var(--bm-cur-fill, #f8ece5);
  stroke: var(--bm-cur, #a45f45);
  stroke-width: 2.6;
}
.bm-cell.is-skip .bm-cell__box {
  fill: var(--bm-gold-fill, #fdf3e3);
  stroke: var(--bm-gold, #c2872f);
  stroke-width: 2.2;
}
.bm-cell.is-empty .bm-cell__box { stroke-dasharray: 2 2; }

/* ---- 定位等式 ---- */
/* 含 × 和中文（字/位），不能用 Consolas —— 走继承字体 */
.bm-eq {
  fill: var(--bm-ink, #1f2a24);
  font-size: 14.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.bm-eq .eq-v { fill: var(--bm-cur, #a45f45); font-weight: 700; }
.bm-eq .eq-w { fill: var(--bm-hi, #3d6a8f); font-weight: 700; }
.bm-eq .eq-b { fill: var(--bm-green, #3f6b57); font-weight: 700; }
.bm-eq.is-generic { opacity: 0.55; }

/* ---- 输出 chips ---- */
.bm-chip__box {
  fill: var(--bm-fill, #ffffff);
  stroke: var(--bm-line, #c3c9c2);
  stroke-width: 1.4;
}
.bm-chip__val {
  fill: var(--bm-green, #3f6b57);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bm-chip.is-new .bm-chip__box {
  stroke: var(--bm-gold, #c2872f);
  stroke-width: 2.4;
}
.bm-chip.is-new .bm-chip__val { fill: var(--bm-gold, #c2872f); }
.bm-chip.is-off { opacity: 0; }

/* ---- 判定 ---- */
.bm-verdict__box {
  fill: var(--bm-fill, #ffffff);
  stroke: var(--bm-line, #c3c9c2);
  stroke-width: 1.5;
}
.bm-verdict__label {
  fill: var(--bm-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}
.bm-verdict__main {
  fill: var(--bm-dim, #9aa39c);
  font-size: 19px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.bm-verdict__sub {
  fill: var(--bm-muted, #657168);
  font-size: 12.5px;
  text-anchor: end;
  dominant-baseline: central;
}
.bm-verdict.is-on .bm-verdict__box {
  fill: var(--bm-green-fill, #eaf3ee);
  stroke: var(--bm-green, #3f6b57);
  stroke-width: 2.6;
}
.bm-verdict.is-on .bm-verdict__main { fill: var(--bm-green, #3f6b57); }

.bm-phasetext {
  fill: var(--bm-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
`;function ee(){if(document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=u,document.head.appendChild(e)}function te(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}var d=680,f=20,ne=36,p=40,re=100,m=26,h=[112,144],g=17,_=64,v=186,y=216,b=250,x=260,S=34,C=336,ie=50,ae=424,w=442,T=64,E=2;function D(a,o={}){if(!a||a.dataset.bmMounted===`1`)return{destroy(){}};a.dataset.bmMounted=`1`,ee();let u=s(o),D=u[0],O=r,k=O(`svg`,{class:`viz__svg bm__svg`,viewBox:`0 0 ${d} ${w}`,role:`img`,"aria-label":`位图排序去重动画：置位、判重、扫描输出`}),A=O(`g`,{class:`bm-cells`}),j=O(`g`,{class:`bm-marks`});k.appendChild(A),k.appendChild(j);let M=O(`text`,{class:`bm-note`,x:30,y:f});M.textContent=`输入 ${D.input.length} 个整数（${D.input.join(`、`)}）· 值域 0 ~ ${T-1} · 每个整数只占 1 bit`,j.appendChild(M),j.appendChild(O(`rect`,{class:`bm-banner__box`,x:30,y:ne,width:d-60,height:p,rx:9}));let N=O(`text`,{class:`bm-banner__seg`,x:46,y:56}),P=O(`text`,{class:`bm-banner__seg`,x:150,y:56}),F=O(`text`,{class:`bm-banner__val`,x:d-46,y:56});j.append(N,P,F);let I=O(`text`,{class:`bm-seclabel`,x:30,y:re});I.textContent=`位图：${E} 个字 × 32 位（绿 = 已置位，橙 = 当前位，金 = 命中重复）`,j.appendChild(I);let L=[];for(let e=0;e<T;e+=1){let t=e>>5,n=_+(e&31)*19,r=h[t],i=O(`g`,{class:`bm-cell is-empty`});i.appendChild(O(`rect`,{class:`bm-cell__box`,x:n,y:r,width:g,height:m,rx:3})),A.appendChild(i),L.push({g:i,v:e})}for(let e=0;e<E;e+=1){let t=O(`text`,{class:`bm-wordlabel`,x:_-8,y:h[e]+m/2});t.textContent=`字 ${e}`,j.appendChild(t)}for(let e=0;e<32;e+=4){let t=O(`text`,{class:`bm-ruler`,x:_+e*19+g/2,y:v});t.textContent=String(e),j.appendChild(t)}let R=O(`text`,{class:`bm-eq`,x:d/2,y});j.appendChild(R);let z=(e,t)=>{let n=O(`tspan`,t?{class:t}:null);return n.textContent=e,n},B=e=>{R.textContent=``,e.value===null?(R.appendChild(z(`v = word × 32 + bit —— 置位 words[word] |= 1 << bit`)),R.setAttribute(`class`,`bm-eq is-generic`)):(R.appendChild(z(`${e.value} = `)),R.appendChild(z(`${e.word}`,`eq-w`)),R.appendChild(z(` × 32 + `)),R.appendChild(z(`${e.bit}`,`eq-b`)),e.phase===`act`&&(R.appendChild(z(`   ·   words[${e.word}] ${e.already?`>>`:`|=`} `)),R.appendChild(z(`1 << ${e.bit}`,`eq-b`))),R.setAttribute(`class`,`bm-eq`))},V=O(`text`,{class:`bm-seclabel`,x:30,y:b});V.textContent=`已置位的值（扫描位图即得，天然升序）`,j.appendChild(V);let H=[];for(let e=0;e<12;e+=1){let t=30+e%6*62,n=x+Math.floor(e/6)*42,r=O(`g`,{class:`bm-chip is-off`});r.appendChild(O(`rect`,{class:`bm-chip__box`,x:t,y:n,width:52,height:S,rx:7}));let i=O(`text`,{class:`bm-chip__val`,x:t+52/2,y:n+S/2});r.appendChild(i),A.appendChild(r),H.push({g:r,val:i})}let U=O(`g`,{class:`bm-verdict`});U.appendChild(O(`rect`,{class:`bm-verdict__box`,x:30,y:C,width:d-60,height:ie,rx:10}));let W=O(`text`,{class:`bm-verdict__label`,x:48,y:352});W.textContent=`进度`;let G=O(`text`,{class:`bm-verdict__main`,x:48,y:370}),K=O(`text`,{class:`bm-verdict__sub`,x:d-48,y:361});U.append(W,G,K),A.appendChild(U);let q=O(`text`,{class:`bm-phasetext`,x:d/2,y:ae});j.appendChild(q);let oe={init:`整数有界 → 每个整数 1 bit。数据量再大，位图的大小只由值域决定。`,locate:`word = v >> 5 定第几个字，bit = v & 31 定字内第几位 —— v = word × 32 + bit。`,act:`|= 只翻本位；写成 = 会冲掉整个字。位是 1 说明来过，跳过即去重。`,done:`按 bit 下标从小到大扫一遍，输出天然有序 —— 排序和去重都不需要额外操作。`};function se(t,n){if(!n)return;let r=n.value;L.forEach(({g:e,v:t})=>{let i=[`bm-cell`],a=n.placed.includes(t);t===r&&n.phase!==`done`?i.push(n.already?`is-skip`:`is-cur`):a?i.push(`is-on`):i.push(`is-empty`),e.setAttribute(`class`,i.join(` `))}),B(n);let i=n.distinct;H.forEach((e,t)=>{if(t>=i.length){e.g.setAttribute(`class`,`bm-chip is-off`);return}let a=n.phase===`act`&&!n.already&&i[t]===r;e.g.setAttribute(`class`,`bm-chip ${a?`is-new`:``}`),e.val.textContent=String(i[t])}),n.phase===`done`?(U.setAttribute(`class`,`bm-verdict is-on`),W.textContent=`扫描完成`,G.textContent=`${n.input.length} 个输入 → ${n.placed.length} 个 distinct`,K.textContent=`跳过 ${n.skipped.length} 个重复`):(U.setAttribute(`class`,`bm-verdict`),W.textContent=`进度`,G.textContent=`已置位 ${n.placed.length} · 已跳过 ${n.skipped.length}`,K.textContent=`共 ${n.input.length} 个输入`),n.phase===`init`?(N.textContent=`准备`,P.textContent=`开一片全 0 的位图`,F.textContent=`${T} bit`):n.phase===`done`?(N.textContent=`扫描输出`,P.textContent=`按 bit 下标从小到大`,F.textContent=`${n.placed.length} 个`):n.phase===`locate`?(N.textContent=`定位 ${n.value}`,P.textContent=`word = ${n.value} >> 5`,F.textContent=`bit = ${n.value} & 31`):(N.textContent=`${n.already?`跳过`:`置位`} ${n.value}`,P.textContent=n.already?`这一位已经是 1`:`words[${n.word}] |= 1 << ${n.bit}`,F.textContent=n.already?`重复`:`第 ${n.bit} 位`),q.textContent=oe[n.phase]||``,e(J,n.desc)}let J=te(),Y=document.createElement(`div`);Y.className=`viz bm`;let X=document.createElement(`div`);X.className=`viz__stage`,X.appendChild(k),Y.appendChild(X),Y.appendChild(J);let Z=i();Y.appendChild(Z.root),a.textContent=``,a.appendChild(Y),n();let ce=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:u,controls:Z,intervalMs:l,onRender:se});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return o.autoplay!==!1&&!ce&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(Y)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.bmMounted,document.getElementById(c)?.remove()}}}export{D as mountBitmap};