import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=1304,o=[`个位`,`十位`,`百位`,`千位`,`万位`,`十万位`,`百万位`,`千万位`,`亿位`,`十亿位`];function s(e={}){let t=Number.isInteger(e.n)&&e.n>=0&&e.n<=999999?e.n:a,n=String(t).split(``).map(Number),r=n.length,i=[],s=[],c=0,l={posIndex:-1,weight:0,higher:0,cur:0,lower:0,branch:null,contribution:null},u=(e,a)=>{s.push({phase:e,n:t,digits:n,posCount:r,posIndex:l.posIndex,posName:l.posIndex>=0?o[l.posIndex]:``,weight:l.weight,higher:l.higher,cur:l.cur,lower:l.lower,branch:l.branch,contribution:l.contribution,positions:i.map(e=>({...e})),total:c,done:e===`done`,desc:``,...a})};u(`init`,{desc:`统计 1 ~ ${t} 里数字 1 出现的总次数。n 共 ${r} 个数位，这套公式只扫 ${r} 轮，和逐个数字检查完全不是一个量级。做法：把每个数位单独拿出来数，某一位上 1 的个数只由「高于它的部分、当前位、低于它的部分」三件套决定。`});for(let e=0;e<r;e+=1){let n=10**e;if(n>t)break;let r=Math.floor(t/(n*10)),a=Math.floor(t/n)%10,s=t%n;l={posIndex:e,weight:n,higher:r,cur:a,lower:s,branch:null,contribution:null},u(`split`,{desc:`第 ${e+1} 个数位（${o[e]}，权值 ${n}）拆三件套：高于它的部分 ${r}，当前位 ${a}，低于它的部分 ${s}。`});let d=a===0?`zero`:a===1?`one`:`many`,f=d===`zero`?r*n:d===`one`?r*n+s+1:(r+1)*n;c+=f,i.push({posIndex:e,posName:o[e],weight:n,higher:r,cur:a,lower:s,branch:d,contribution:f}),l={posIndex:e,weight:n,higher:r,cur:a,lower:s,branch:d,contribution:f},u(`contribute`,{desc:`${d===`zero`?`当前位是 0：${o[e]}上每 ${n*10} 个数连出 ${n} 个 1，${r} 个完整大块给出 ${r*n} 个；当前块还没走到 1 那一截，一个不多给。`:d===`one`?`当前位是 1：正好踩在 1 那一截的起点。${r} 个完整大块给出 ${r*n} 个；当前块里从 1 开始一路数到 ${s}，又多出 ${s+1} 个。`:`当前位是 ${a}：1 那一截已经整个走完。${r} 个完整大块给出 ${r*n} 个；当前块也满额，再拿 ${n} 个。`}这一位合计 ${f}，累计 ${c}。`})}return u(`done`,{posIndex:-1,posName:``,weight:0,higher:0,cur:0,lower:0,branch:null,contribution:null,desc:i.length===0?`1 ~ 0 里一个整数都没有，答案就是 0 —— 公式同样适用，只是循环一次都不进。`:`${r} 个数位全部扫完：${i.map(e=>e.contribution).join(` + `)} = ${c}。这就是 1 ~ ${t} 中数字 1 出现的总次数。时间是 O(数位个数)，也就是 O(log n)：n 换成 21 亿也只要 10 轮。`}),s}var c=`d1-styles`,l=950,u=`
.d1 { display: flex; flex-direction: column; gap: 14px; }
.d1__svg { width: 100%; height: auto; display: block; }

.d1-note {
  fill: var(--d1-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.d1-banner__box {
  fill: var(--d1-banner, #f4f3ef);
  stroke: var(--d1-line, #c3c9c2);
  stroke-width: 1.5;
}
.d1-banner__seg {
  fill: var(--d1-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.d1-banner__val {
  fill: var(--d1-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-seclabel {
  fill: var(--d1-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}

/* ---- 数位条 ---- */
.d1-cell__box {
  fill: var(--d1-fill, #ffffff);
  stroke: var(--d1-line, #c3c9c2);
  stroke-width: 1.5;
}
.d1-cell__val {
  fill: var(--d1-ink, #1f2a24);
  font-size: 23px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-posname {
  fill: var(--d1-muted, #657168);
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1-weight {
  fill: var(--d1-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
}
/* 三段配色走 fill/stroke 两个通道（坑 V）：属于哪一段看填充，是不是当前位看描边 */
.d1-cell.is-hi .d1-cell__box { fill: var(--d1-hi-fill, #e9f0f6); stroke: var(--d1-hi, #3d6a8f); }
.d1-cell.is-hi .d1-cell__val { fill: var(--d1-hi, #3d6a8f); }
.d1-cell.is-low .d1-cell__box { fill: var(--d1-low-fill, #eaf3ee); stroke: var(--d1-low, #3f6b57); }
.d1-cell.is-low .d1-cell__val { fill: var(--d1-low, #3f6b57); }
.d1-cell.is-cur .d1-cell__box { fill: var(--d1-cur-fill, #f8ece5); stroke: var(--d1-cur, #a45f45); stroke-width: 3.2; }
.d1-cell.is-cur .d1-cell__val { fill: var(--d1-cur, #a45f45); }
.d1-cell.is-cur .d1-posname { fill: var(--d1-cur, #a45f45); font-weight: 700; }
.d1-cell.is-cur .d1-weight { fill: var(--d1-cur, #a45f45); }
.d1-cell.is-idle .d1-cell__val { fill: var(--d1-dim, #9aa39c); }

/* ---- 拆分等式 ---- */
/* 等号行含 × 和中文（权值），不能用 Consolas —— 走继承字体，逐字形回退 */
.d1-eq {
  fill: var(--d1-ink, #1f2a24);
  font-size: 14.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1-eq.is-generic { opacity: 0.55; }
.d1-eq .eq-hi { fill: var(--d1-hi, #3d6a8f); font-weight: 700; }
.d1-eq .eq-cur { fill: var(--d1-cur, #a45f45); font-weight: 700; }
.d1-eq .eq-low { fill: var(--d1-low, #3f6b57); font-weight: 700; }

/* ---- 三件套卡片 ---- */
.d1-card__box {
  fill: var(--d1-fill, #ffffff);
  stroke: var(--d1-line, #c3c9c2);
  stroke-width: 1.5;
}
.d1-card__label {
  fill: var(--d1-muted, #657168);
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1-card__val {
  fill: var(--d1-ink, #1f2a24);
  font-size: 21px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-card.is-hi .d1-card__box { stroke: var(--d1-hi, #3d6a8f); stroke-width: 2.2; }
.d1-card.is-hi .d1-card__val { fill: var(--d1-hi, #3d6a8f); }
.d1-card.is-cur .d1-card__box { stroke: var(--d1-cur, #a45f45); stroke-width: 2.6; fill: var(--d1-cur-fill, #f8ece5); }
.d1-card.is-cur .d1-card__val { fill: var(--d1-cur, #a45f45); }
.d1-card.is-low .d1-card__box { stroke: var(--d1-low, #3f6b57); stroke-width: 2.2; }
.d1-card.is-low .d1-card__val { fill: var(--d1-low, #3f6b57); }
.d1-card.is-idle .d1-card__box { stroke-dasharray: 4 4; }
.d1-card.is-idle .d1-card__val { fill: var(--d1-dim, #9aa39c); font-weight: 400; }

/* ---- 三分支表 ---- */
.d1-branch__box {
  fill: var(--d1-fill, #ffffff);
  stroke: var(--d1-line, #c3c9c2);
  stroke-width: 1.2;
}
.d1-branch__cond {
  fill: var(--d1-muted, #657168);
  font-size: 13px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-branch__formula {
  fill: var(--d1-ink, #1f2a24);
  font-size: 13.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.d1-branch__res {
  fill: var(--d1-dim, #9aa39c);
  font-size: 14px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-branch.is-on .d1-branch__box {
  fill: var(--d1-gold-fill, #fdf3e3);
  stroke: var(--d1-gold, #c2872f);
  stroke-width: 2.4;
}
.d1-branch.is-on .d1-branch__cond { fill: var(--d1-gold, #c2872f); }
.d1-branch.is-on .d1-branch__formula { font-weight: 700; }
.d1-branch.is-on .d1-branch__res { fill: var(--d1-gold, #c2872f); font-size: 15px; }

/* ---- 累计 chips ---- */
.d1-chip__box {
  fill: var(--d1-fill, #ffffff);
  stroke: var(--d1-line, #c3c9c2);
  stroke-width: 1.4;
}
.d1-chip__top {
  fill: var(--d1-muted, #657168);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1-chip__val {
  fill: var(--d1-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-chip.is-new .d1-chip__box { stroke: var(--d1-gold, #c2872f); stroke-width: 2.4; }
.d1-chip.is-new .d1-chip__val { fill: var(--d1-gold, #c2872f); }
.d1-chip.is-off { opacity: 0; }
.d1-total__box {
  fill: var(--d1-fill, #ffffff);
  stroke: var(--d1-line, #c3c9c2);
  stroke-width: 1.4;
}
.d1-total__label {
  fill: var(--d1-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1-total__val {
  fill: var(--d1-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-total.is-on .d1-total__box { fill: var(--d1-gold-fill, #fdf3e3); stroke: var(--d1-gold, #c2872f); stroke-width: 2.6; }
.d1-total.is-on .d1-total__label { fill: var(--d1-gold, #c2872f); }
.d1-total.is-on .d1-total__val { fill: var(--d1-gold, #c2872f); }

.d1-phasetext {
  fill: var(--d1-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
`;function d(){if(document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=u,document.head.appendChild(e)}function f(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}var p=680,ee=20,te=36,ne=40,re=98,ie=108,ae=48,oe=171,se=186,ce=214,le=232,m=56,h=310,ue=320,g=30,_=442,v=46,y=514,b=532,x=72,de=18,fe=[{key:`zero`,cond:`cur = 0`,formula:`higher × weight`},{key:`one`,cond:`cur = 1`,formula:`higher × weight + lower + 1`},{key:`many`,cond:`cur > 1`,formula:`(higher + 1) × weight`}],S={zero:`cur = 0，不满一个整块`,one:`cur = 1，踩在 1 那一截的起点`,many:`cur > 1，1 那一截已走完`};function C(a,o={}){if(!a||a.dataset.d1Mounted===`1`)return{destroy(){}};a.dataset.d1Mounted=`1`,d();let u=s(o),{n:C,digits:pe,posCount:w}=u[0],T=r,E=T(`svg`,{class:`viz__svg d1__svg`,viewBox:`0 0 ${p} ${b}`,role:`img`,"aria-label":`1 到 n 中数字 1 出现次数 逐数位统计动画`}),D=T(`g`,{class:`d1-cells`}),O=T(`g`,{class:`d1-marks`});E.appendChild(D),E.appendChild(O);let k=T(`text`,{class:`d1-note`,x:30,y:ee});k.textContent=`n = ${C} · 共 ${w} 个数位 · 从个位开始，一位一位地数`,O.appendChild(k),O.appendChild(T(`rect`,{class:`d1-banner__box`,x:30,y:te,width:p-60,height:ne,rx:9}));let A=T(`text`,{class:`d1-banner__seg`,x:46,y:56}),j=T(`text`,{class:`d1-banner__seg`,x:236,y:56}),M=T(`text`,{class:`d1-banner__val`,x:p-46,y:56});O.append(A,j,M);let N=T(`text`,{class:`d1-seclabel`,x:30,y:re});N.textContent=`n 按位拆开（橙 = 当前位，蓝 = 高于它，绿 = 低于它）`,O.appendChild(N);let me=(p-(w*x+(w-1)*de))/2,P=[];for(let e=0;e<w;e+=1){let t=w-1-e,n=me+e*90+x/2,r=T(`g`,{class:`d1-cell`});r.appendChild(T(`rect`,{class:`d1-cell__box`,x:n-x/2,y:ie,width:x,height:ae,rx:7}));let i=T(`text`,{class:`d1-cell__val`,x:n,y:132});i.textContent=String(pe[e]);let a=T(`text`,{class:`d1-posname`,x:n,y:oe});a.textContent=[`个位`,`十位`,`百位`,`千位`,`万位`,`十万位`,`百万位`,`千万位`,`亿位`,`十亿位`][t];let o=T(`text`,{class:`d1-weight`,x:n,y:se});o.textContent=`权值 ${10**t}`,r.append(i,a,o),D.appendChild(r),P.push({g:r,name:a,weight:o})}let F=T(`text`,{class:`d1-eq`,x:p/2,y:ce});O.appendChild(F);let I=(e,t)=>{let n=T(`tspan`,t?{class:t}:null);return n.textContent=e,n},L=e=>{if(F.textContent=``,e.weight>0)F.appendChild(I(`${e.n} = `)),F.appendChild(I(`${e.higher}`,`eq-hi`)),F.appendChild(I(` × ${e.weight*10} + `)),F.appendChild(I(`${e.cur}`,`eq-cur`)),F.appendChild(I(` × ${e.weight} + `)),F.appendChild(I(`${e.lower}`,`eq-low`));else{F.textContent=``,F.appendChild(I(`n = higher × (权值 × 10) + cur × 权值 + lower`)),F.setAttribute(`class`,`d1-eq is-generic`);return}F.setAttribute(`class`,`d1-eq`)},R=(p-580)/2,he=[{key:`hi`,label:`高于它的部分 higher`,field:`higher`},{key:`cur`,label:`当前位 cur`,field:`cur`},{key:`low`,label:`低于它的部分 lower`,field:`lower`}].map((e,t)=>{let n=R+t*202,r=T(`g`,{class:`d1-card`});r.appendChild(T(`rect`,{class:`d1-card__box`,x:n,y:le,width:176,height:m,rx:8}));let i=T(`text`,{class:`d1-card__label`,x:n+176/2,y:249});i.textContent=e.label;let a=T(`text`,{class:`d1-card__val`,x:n+176/2,y:271});return r.append(i,a),D.appendChild(r),{g:r,val:a,def:e}}),z=T(`text`,{class:`d1-seclabel`,x:30,y:h});z.textContent=`三种情况，对号入座`,O.appendChild(z);let ge=fe.map((e,t)=>{let n=ue+t*36,r=T(`g`,{class:`d1-branch`});r.appendChild(T(`rect`,{class:`d1-branch__box`,x:30,y:n,width:p-60,height:g,rx:7}));let i=T(`text`,{class:`d1-branch__cond`,x:46,y:n+g/2});i.textContent=e.cond;let a=T(`text`,{class:`d1-branch__formula`,x:140,y:n+g/2});a.textContent=e.formula;let o=T(`text`,{class:`d1-branch__res`,x:p-46,y:n+g/2});return r.append(i,a,o),D.appendChild(r),{g:r,res:o,def:e}}),B=Math.max(64,Math.min(120,(p-60-116-16-(w-1)*10)/w)),V=[];for(let e=0;e<w;e+=1){let t=30+e*(B+10),n=T(`g`,{class:`d1-chip is-off`});n.appendChild(T(`rect`,{class:`d1-chip__box`,x:t,y:_,width:B,height:v,rx:8}));let r=T(`text`,{class:`d1-chip__top`,x:t+B/2,y:456}),i=T(`text`,{class:`d1-chip__val`,x:t+B/2,y:474});n.append(r,i),D.appendChild(n),V.push({g:n,top:r,val:i})}let H=30+w*(B+10)-10+16,U=T(`g`,{class:`d1-total`});U.appendChild(T(`rect`,{class:`d1-total__box`,x:H,y:_,width:116,height:v,rx:8}));let W=T(`text`,{class:`d1-total__label`,x:H+116/2,y:457});W.textContent=`合计`;let G=T(`text`,{class:`d1-total__val`,x:H+116/2,y:475});U.append(W,G),D.appendChild(U);let K=T(`text`,{class:`d1-phasetext`,x:p/2,y});O.appendChild(K);let q={init:`每一位单独数：这一位上 1 的个数，只由「高于它、当前位、低于它」三个值决定。`,split:`higher 框住当前位之上，lower 框住当前位之下 —— 它们决定当前位能看见多少。`,zero:`cur = 0：当前块连 1 那一截的边都没碰到，只拿完整大块那份。`,one:`cur = 1：当前块正好从 1 开始，一路数到 lower，共 lower + 1 个。`,many:`cur > 1：1 那一截整个落在当前块内，当前块也按满额算。`,done:`时间是 O(数位个数)，也就是 O(log n)：n 从 1304 换成 21 亿，只是从 4 轮变成 10 轮。`},_e=e=>e.branch===`zero`?`${e.higher} × ${e.weight} = ${e.contribution}`:e.branch===`one`?`${e.higher} × ${e.weight} + ${e.lower} + 1 = ${e.contribution}`:`(${e.higher} + 1) × ${e.weight} = ${e.contribution}`;function ve(t,n){if(!n)return;let{phase:r,posCount:i,posIndex:a,weight:o}=n,s=o>0,c=s?i-1-a:-1;P.forEach((e,t)=>{let n=[`d1-cell`];s?t===c?n.push(`is-cur`):t<c?n.push(`is-hi`):n.push(`is-low`):n.push(`is-idle`),e.g.setAttribute(`class`,n.join(` `))}),L(n),he.forEach(({g:e,val:t,def:r})=>{let i=[`d1-card`];s?i.push(`is-${r.key}`):i.push(`is-idle`),e.setAttribute(`class`,i.join(` `)),t.textContent=s?String(n[r.field]):`–`}),ge.forEach(({g:e,res:t,def:i})=>{let a=r===`contribute`&&n.branch===i.key;e.setAttribute(`class`,`d1-branch ${a?`is-on`:``}`),t.textContent=a?_e(n):``}),V.forEach((e,t)=>{let i=n.positions[t],a=[`d1-chip`];i?r===`contribute`&&t===n.positions.length-1&&a.push(`is-new`):a.push(`is-off`),e.g.setAttribute(`class`,a.join(` `)),i&&(e.top.textContent=`${i.posName} × ${i.weight}`,e.val.textContent=String(i.contribution))}),U.setAttribute(`class`,`d1-total ${r===`done`?`is-on`:``}`),G.textContent=String(n.total),r===`init`?(A.textContent=`准备`,j.textContent=`逐位扫描，从个位开始`,M.textContent=`n = ${C}`):r===`done`?(A.textContent=`${i} 位全部扫完`,j.textContent=`合计`,M.textContent=String(n.total)):(A.textContent=`${n.posName} · 权值 ${o}`,j.textContent=r===`split`?`拆三件套`:S[n.branch],M.textContent=r===`split`?`?`:String(n.contribution)),K.textContent=q[r]||q[n.branch]||``,e(J,n.desc)}let J=f(),Y=document.createElement(`div`);Y.className=`viz d1`;let X=document.createElement(`div`);X.className=`viz__stage`,X.appendChild(E),Y.appendChild(X),Y.appendChild(J);let Z=i();Y.appendChild(Z.root),a.textContent=``,a.appendChild(Y),n();let ye=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:u,controls:Z,intervalMs:l,onRender:ve});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return o.autoplay!==!1&&!ye&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(Y)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.d1Mounted,document.getElementById(c)?.remove()}}}export{C as mountDigitOne};