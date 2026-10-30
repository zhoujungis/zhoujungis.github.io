import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=47,o=[`个位`,`十位`,`百位`,`千位`,`万位`,`十万位`,`百万位`,`千万位`,`亿位`,`十亿位`];function s(e={}){let t=e.n,n=Number.isInteger(t)&&t>=10&&t<=99?t:a,r=String(n).length,i=[],s=[],c=0,l={posIndex:-1,weight:0,cycle:0,fullBlocks:0,runLen:0,positionTotal:0,highlighted:[]},u=(e,t)=>{i.push({phase:e,n,cols:10,posCount:r,posIndex:l.posIndex,posName:l.posIndex>=0?o[l.posIndex]:``,weight:l.weight,cycle:l.cycle,fullBlocks:l.fullBlocks,runLen:l.runLen,positionTotal:l.positionTotal,highlighted:l.highlighted.slice(),positions:s.map(e=>({...e})),total:c,done:e===`done`,desc:``,...t})},d=e=>{let t=[];for(let r=0;r<=n;r+=1)Math.floor(r/e)%10==1&&t.push(r);return t};u(`init`,{desc:`换个角度：先别管公式，看看 1 在数轴上长什么样。下面是 0 ~ ${n}，一个数位一个数位地看过去。0 本身没有 1，放进来只是让每一行凑整。`});for(let e=0;e<r;e+=1){let t=10**e,r=t*10,i=Math.floor(n/r),a=n%r,f=Math.max(0,Math.min(a-t+1,t)),p=i*t+f,m=d(t);l={posIndex:e,weight:t,cycle:r,fullBlocks:i,runLen:f,positionTotal:p,highlighted:m},u(`pattern`,{desc:`看${o[e]}：每 ${r} 个数一个循环，每个循环里${o[e]}为 1 的恰好 ${t} 个`+(t>1?`，而且是连成一片的（${m[0]} ~ ${m[m.length-1]}）`:`，是个孤零零的散点`)+`。`}),c+=p,s.push({posIndex:e,posName:o[e],weight:t,cycle:r,fullBlocks:i,runLen:f,positionTotal:p}),u(`count`,{desc:`${o[e]}账本：0 ~ ${n} 里有 ${i} 个完整循环，每个贡献 ${t} 个 → ${i*t}；剩下的零头 ${i*r} ~ ${n} 里，1 那一截${f>0?`数出 ${f} 个`:`还没开始`}。${o[e]}合计 ${p}。`})}return u(`done`,{posIndex:-1,posName:``,weight:0,cycle:0,fullBlocks:0,runLen:0,positionTotal:0,highlighted:[],desc:`合计 ${c}。「完整循环数 × 每循环贡献 + 零头里那一截」—— 这就是公式的原型。把它翻译成代码，就是下一个动画里的 higher / cur / lower 三件套。`}),i}var c=`d1b-styles`,l=1050,u=`
.d1b { display: flex; flex-direction: column; gap: 14px; }
.d1b__svg { width: 100%; height: auto; display: block; }

.d1b-note {
  fill: var(--d1b-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.d1b-banner__box {
  fill: var(--d1b-banner, #f4f3ef);
  stroke: var(--d1b-line, #c3c9c2);
  stroke-width: 1.5;
}
.d1b-banner__seg {
  fill: var(--d1b-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.d1b-banner__val {
  fill: var(--d1b-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1b-seclabel {
  fill: var(--d1b-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}

/* ---- 数字网格 ---- */
.d1b-cell__box {
  fill: var(--d1b-fill, #ffffff);
  stroke: var(--d1b-line, #c3c9c2);
  stroke-width: 1.2;
}
.d1b-cell__val {
  fill: var(--d1b-ink, #1f2a24);
  font-size: 13px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1b-cell.is-one .d1b-cell__box {
  fill: var(--d1b-gold-fill, #fdf3e3);
  stroke: var(--d1b-gold, #c2872f);
  stroke-width: 2.2;
}
.d1b-cell.is-one .d1b-cell__val { fill: var(--d1b-gold, #c2872f); font-weight: 700; }
.d1b-cell.is-zero .d1b-cell__val { fill: var(--d1b-dim, #9aa39c); }

/* ---- 账本面板 ---- */
.d1b-ledger__box {
  fill: var(--d1b-fill, #ffffff);
  stroke: var(--d1b-line, #c3c9c2);
  stroke-width: 1.5;
}
.d1b-ledger__title {
  fill: var(--d1b-ink, #1f2a24);
  font-size: 13.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.d1b-ledger__line {
  fill: var(--d1b-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.d1b-ledger__sum {
  fill: var(--d1b-gold, #c2872f);
  font-size: 14px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.d1b-ledger.is-idle .d1b-ledger__line { fill: var(--d1b-dim, #9aa39c); }

/* ---- 累计 chips + 合计 ---- */
.d1b-chip__box {
  fill: var(--d1b-fill, #ffffff);
  stroke: var(--d1b-line, #c3c9c2);
  stroke-width: 1.4;
}
.d1b-chip__top {
  fill: var(--d1b-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1b-chip__val {
  fill: var(--d1b-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1b-chip.is-new .d1b-chip__box { stroke: var(--d1b-gold, #c2872f); stroke-width: 2.4; }
.d1b-chip.is-new .d1b-chip__val { fill: var(--d1b-gold, #c2872f); }
.d1b-chip.is-off { opacity: 0; }
.d1b-total__box {
  fill: var(--d1b-fill, #ffffff);
  stroke: var(--d1b-line, #c3c9c2);
  stroke-width: 1.4;
}
.d1b-total__label {
  fill: var(--d1b-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1b-total__val {
  fill: var(--d1b-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1b-total.is-on .d1b-total__box { fill: var(--d1b-gold-fill, #fdf3e3); stroke: var(--d1b-gold, #c2872f); stroke-width: 2.6; }
.d1b-total.is-on .d1b-total__label { fill: var(--d1b-gold, #c2872f); }
.d1b-total.is-on .d1b-total__val { fill: var(--d1b-gold, #c2872f); }

.d1b-phasetext {
  fill: var(--d1b-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
`,d=680,f=20,p=36,m=40,ee=96,h=106,g=44,_=32,te=8,v=10,ne=22,y=100,re=16,b=46;function ie(){if(document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=u,document.head.appendChild(e)}function ae(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function x(a,o={}){if(!a||a.dataset.d1bMounted===`1`)return{destroy(){}};a.dataset.d1bMounted=`1`,ie();let u=s(o),{n:x,posCount:S}=u[0],oe=Math.ceil((x+1)/v),se=oe*_+(oe-1)*te,ce=(d-494)/2,C=h+se+ne,w=C+y+re,T=w+b+26,le=T+18,E=r,D=E(`svg`,{class:`viz__svg d1b__svg`,viewBox:`0 0 ${d} ${le}`,role:`img`,"aria-label":`1 到 n 中数字 1 出现次数 数轴周期块动画`}),O=E(`g`,{class:`d1b-cells`}),k=E(`g`,{class:`d1b-marks`});D.appendChild(O),D.appendChild(k);let A=E(`text`,{class:`d1b-note`,x:30,y:f});A.textContent=`数轴视角：0 ~ ${x}，看 1 长什么样（烫金 = 当前数位为 1）`,k.appendChild(A),k.appendChild(E(`rect`,{class:`d1b-banner__box`,x:30,y:p,width:d-60,height:m,rx:9}));let j=E(`text`,{class:`d1b-banner__seg`,x:46,y:56}),M=E(`text`,{class:`d1b-banner__seg`,x:236,y:56}),N=E(`text`,{class:`d1b-banner__val`,x:d-46,y:56});k.append(j,M,N);let P=E(`text`,{class:`d1b-seclabel`,x:30,y:ee});P.textContent=`0 ~ ${x}（每行 10 个，0 没有 1，永远不高亮）`,k.appendChild(P);let F=[];for(let e=0;e<=x;e+=1){let t=Math.floor(e/v),n=ce+e%v*50,r=h+t*40,i=E(`g`,{class:`d1b-cell`});i.appendChild(E(`rect`,{class:`d1b-cell__box`,x:n,y:r,width:g,height:_,rx:6}));let a=E(`text`,{class:`d1b-cell__val`,x:n+g/2,y:r+_/2});a.textContent=String(e),i.appendChild(a),O.appendChild(i),F.push({g:i,v:e})}k.appendChild(E(`rect`,{class:`d1b-ledger__box`,x:30,y:C,width:d-60,height:y,rx:9}));let I=E(`g`,{class:`d1b-ledger`}),L=E(`text`,{class:`d1b-ledger__title`,x:46,y:C+22}),R=E(`text`,{class:`d1b-ledger__line`,x:46,y:C+46}),z=E(`text`,{class:`d1b-ledger__line`,x:46,y:C+68}),B=E(`text`,{class:`d1b-ledger__sum`,x:46,y:C+88});I.append(L,R,z,B),k.appendChild(I);let V=(d-(S*120+(S-1)*12+16+150))/2,H=[];for(let e=0;e<S;e+=1){let t=V+e*132,n=E(`g`,{class:`d1b-chip is-off`});n.appendChild(E(`rect`,{class:`d1b-chip__box`,x:t,y:w,width:120,height:b,rx:8}));let r=E(`text`,{class:`d1b-chip__top`,x:t+120/2,y:w+14}),i=E(`text`,{class:`d1b-chip__val`,x:t+120/2,y:w+32});n.append(r,i),O.appendChild(n),H.push({g:n,top:r,val:i})}let U=V+S*132-12+16,W=E(`g`,{class:`d1b-total`});W.appendChild(E(`rect`,{class:`d1b-total__box`,x:U,y:w,width:150,height:b,rx:8}));let G=E(`text`,{class:`d1b-total__label`,x:U+150/2,y:w+15});G.textContent=`合计`;let K=E(`text`,{class:`d1b-total__val`,x:U+150/2,y:w+33});W.append(G,K),O.appendChild(W);let q=E(`text`,{class:`d1b-phasetext`,x:d/2,y:T});k.appendChild(q);function ue(t,n){if(!n)return;let{phase:r,posName:i,weight:a,cycle:o,fullBlocks:s,runLen:c,positionTotal:l,total:u}=n,d=new Set(n.highlighted);if(F.forEach(({g:e,v:t})=>{let n=[`d1b-cell`];d.has(t)?n.push(`is-one`):t===0&&n.push(`is-zero`),e.setAttribute(`class`,n.join(` `))}),I.setAttribute(`class`,`d1b-ledger ${r===`count`?``:`is-idle`}`),r===`count`){L.textContent=`${i}账本`,R.textContent=`完整循环：${s} 个 × 每个 ${a} 个 = ${s*a}`;let e=s*o;z.textContent=c>0?c===a?`零头 ${e} ~ ${x}：1 那一截整块都在，数出 ${c} 个`:`零头 ${e} ~ ${x}：数出 ${c} 个`:`零头 ${e} ~ ${x}：还没走到 1 那一截`,B.textContent=`${i}合计 = ${l}`}else r===`done`?(L.textContent=`总账本`,R.textContent=n.positions.map(e=>`${e.posName} ${e.positionTotal}`).join(` + `),z.textContent=`0 ~ ${x} 里每一个数字 1 都数到了，没有遗漏也没有重复。`,B.textContent=`合计 = ${u}`):(L.textContent=`账本`,R.textContent=`先把当前数位为 1 的格子看出来（烫金），再记账。`,z.textContent=``,B.textContent=``);H.forEach((e,t)=>{let i=n.positions[t],a=[`d1b-chip`];i?r===`count`&&t===n.positions.length-1&&a.push(`is-new`):a.push(`is-off`),e.g.setAttribute(`class`,a.join(` `)),i&&(e.top.textContent=i.posName,e.val.textContent=String(i.positionTotal))}),W.setAttribute(`class`,`d1b-total ${r===`done`?`is-on`:``}`),K.textContent=String(u),r===`init`?(j.textContent=`准备`,M.textContent=`先看分布，再记账`,N.textContent=`0 ~ ${x}`):r===`done`?(j.textContent=`${S} 位全部看完`,M.textContent=`合计`,N.textContent=String(u)):(j.textContent=`${i} · 每 ${o} 个数一次`,M.textContent=r===`pattern`?`看分布`:`记账本`,N.textContent=r===`pattern`?`?`:String(l)),q.textContent=r===`init`?`0 本身没有 1，放进来只是让每一行凑整 —— 它永远不高亮。`:r===`pattern`?a===1?`个位：每 10 个数循环一次，一个循环里个位是 1 的只有 1 个 —— 所以是散点。`:`${i}：每 ${o} 个数循环一次，一个循环里有连续 ${a} 个数的${i}是 1 —— 所以是整块。`:r===`count`?`每个数位的账本都是同一句话：完整循环数 × 每循环贡献 + 零头里那一截。`:`把这句话翻译成代码，就是下一个动画里的 higher / cur / lower 三件套。`,e(J,n.desc)}let J=ae(),Y=document.createElement(`div`);Y.className=`viz d1b`;let X=document.createElement(`div`);X.className=`viz__stage`,X.appendChild(D),Y.appendChild(X),Y.appendChild(J);let Z=i();Y.appendChild(Z.root),a.textContent=``,a.appendChild(Y),n();let de=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:u,controls:Z,intervalMs:l,onRender:ue});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return o.autoplay!==!1&&!de&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(Y)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.d1bMounted,document.getElementById(c)?.remove()}}}export{x as mountDigitOneBlock};