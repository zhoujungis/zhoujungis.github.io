import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";import{n as a,t as o}from"./pokerStraightSteps-CKkj7boL.js";var s=`p61-styles`,c=1050,l=`
.p61 { display: flex; flex-direction: column; gap: 14px; }
.p61__svg { width: 100%; height: auto; display: block; }

.p61-note {
  fill: var(--p61-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.p61-banner__box {
  fill: var(--p61-banner, #f4f3ef);
  stroke: var(--p61-line, #c3c9c2);
  stroke-width: 1.5;
}
.p61-banner__seg {
  fill: var(--p61-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.p61-banner__val {
  fill: var(--p61-gold, #c2872f);
  font-size: 16px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
}
.p61-seclabel {
  fill: var(--p61-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}

/* ---- 牌面 ---- */
.p61-card__box {
  fill: var(--p61-fill, #ffffff);
  stroke: var(--p61-line, #c3c9c2);
  stroke-width: 1.5;
}
.p61-card__val {
  fill: var(--p61-ink, #1f2a24);
  font-size: 25px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}
.p61-card__sub {
  fill: var(--p61-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.p61-card.is-joker .p61-card__box {
  fill: var(--p61-gold-fill, #fdf3e3);
  stroke: var(--p61-gold, #c2872f);
  stroke-width: 2.4;
}
.p61-card.is-joker .p61-card__val { fill: var(--p61-gold, #c2872f); }
.p61-card.is-joker .p61-card__sub { fill: var(--p61-gold, #c2872f); }
.p61-card.is-cur .p61-card__box {
  stroke: var(--p61-cur, #a45f45);
  stroke-width: 3.2;
}
.p61-card.is-cur .p61-card__val { fill: var(--p61-cur, #a45f45); }
.p61-card.is-dup .p61-card__box {
  stroke: var(--p61-red, #b3452f);
  stroke-width: 3.2;
}
.p61-card.is-dup .p61-card__val { fill: var(--p61-red, #b3452f); }
.p61-card.is-dim .p61-card__box { stroke-dasharray: 4 4; }
.p61-card.is-dim .p61-card__val { fill: var(--p61-dim, #9aa39c); font-weight: 400; }

/* 相邻对之间的连接弧（当前对） */
.p61-pairlink {
  fill: none;
  stroke: var(--p61-cur, #a45f45);
  stroke-width: 2;
  stroke-dasharray: 5 4;
}

/* ---- 相邻对账本 chip ---- */
.p61-gap__box {
  fill: var(--p61-fill, #ffffff);
  stroke: var(--p61-line, #c3c9c2);
  stroke-width: 1.3;
}
.p61-gap__text {
  fill: var(--p61-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.p61-gap.is-pending .p61-gap__box { stroke-dasharray: 4 4; }
.p61-gap.is-pending .p61-gap__text { fill: var(--p61-dim, #9aa39c); }
.p61-gap.is-cur .p61-gap__box {
  fill: var(--p61-gold-fill, #fdf3e3);
  stroke: var(--p61-gold, #c2872f);
  stroke-width: 2.4;
}
.p61-gap.is-cur .p61-gap__text { fill: var(--p61-gold, #c2872f); font-weight: 700; }
.p61-gap.is-tight .p61-gap__box { stroke: var(--p61-green, #3f6b57); }
.p61-gap.is-tight .p61-gap__text { fill: var(--p61-green, #3f6b57); }
.p61-gap.is-filled .p61-gap__box {
  fill: var(--p61-gold-fill, #fdf3e3);
  stroke: var(--p61-gold, #c2872f);
}
.p61-gap.is-filled .p61-gap__text { fill: var(--p61-gold, #c2872f); }
.p61-gap.is-bad .p61-gap__box {
  fill: var(--p61-red-fill, #f9ece8);
  stroke: var(--p61-red, #b3452f);
  stroke-width: 2.2;
}
.p61-gap.is-bad .p61-gap__text { fill: var(--p61-red, #b3452f); font-weight: 700; }

/* ---- 拼出的顺子 ---- */
.p61-slot__box {
  fill: var(--p61-fill, #ffffff);
  stroke: var(--p61-green, #3f6b57);
  stroke-width: 1.8;
}
.p61-slot__val {
  fill: var(--p61-green, #3f6b57);
  font-size: 19px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}
.p61-slot__mark {
  fill: var(--p61-gold, #c2872f);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.p61-slot.is-joker .p61-slot__box {
  fill: var(--p61-gold-fill, #fdf3e3);
  stroke: var(--p61-gold, #c2872f);
  stroke-width: 2.4;
}
.p61-slot.is-joker .p61-slot__val { fill: var(--p61-gold, #c2872f); }
.p61-slot.is-hole .p61-slot__box {
  fill: var(--p61-red-fill, #f9ece8);
  stroke: var(--p61-red, #b3452f);
  stroke-dasharray: 4 4;
}
.p61-slot.is-hole .p61-slot__val { fill: var(--p61-red, #b3452f); }
.p61-slot.is-empty { opacity: 0; }

/* ---- 判定 ---- */
.p61-verdict__box {
  fill: var(--p61-fill, #ffffff);
  stroke: var(--p61-line, #c3c9c2);
  stroke-width: 1.5;
}
.p61-verdict__label {
  fill: var(--p61-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}
.p61-verdict__main {
  fill: var(--p61-dim, #9aa39c);
  font-size: 21px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.p61-verdict__sub {
  fill: var(--p61-muted, #657168);
  font-size: 13px;
  text-anchor: end;
  dominant-baseline: central;
}
.p61-verdict.is-yes .p61-verdict__box {
  fill: var(--p61-green-fill, #eaf3ee);
  stroke: var(--p61-green, #3f6b57);
  stroke-width: 2.6;
}
.p61-verdict.is-yes .p61-verdict__main { fill: var(--p61-green, #3f6b57); }
.p61-verdict.is-no .p61-verdict__box {
  fill: var(--p61-red-fill, #f9ece8);
  stroke: var(--p61-red, #b3452f);
  stroke-width: 2.6;
}
.p61-verdict.is-no .p61-verdict__main { fill: var(--p61-red, #b3452f); }

.p61-phasetext {
  fill: var(--p61-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
`;function u(){if(document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=l,document.head.appendChild(e)}function ee(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}var d=680,te=20,f=36,ne=40,re=98,p=108,m=92,ie=62,ae=214,oe=224,se=42,h=288,g=298,ce=46,le=372,ue=54,de=456,_=474,fe={tight:e=>`差 1 · 天然连续`,filled:e=>`差 ${e.gap} · 缺 ${e.gap-1} 个 · 王补`,short:e=>`差 ${e.gap} · 缺 ${e.gap-1} 个 · 王不够`,dup:()=>`重复 · 无解`};function v(l,v={}){if(!l||l.dataset.p61Mounted===`1`)return{destroy(){}};l.dataset.p61Mounted=`1`,u();let y=o(v),b=y[0],{sorted:x,zeros:S,rest:C}=b,w=r,T=w(`svg`,{class:`viz__svg p61__svg`,viewBox:`0 0 ${d} ${_}`,role:`img`,"aria-label":`扑克牌顺子判断动画：排序、数大小王、逐对补洞`}),E=w(`g`,{class:`p61-cells`}),D=w(`g`,{class:`p61-marks`});T.appendChild(E),T.appendChild(D);let O=w(`text`,{class:`p61-note`,x:30,y:te});O.textContent=`输入 ${b.input.map(a).join(`、`)} · 0 = 大小王可当任意牌 · 5 张连续即顺子`,D.appendChild(O),D.appendChild(w(`rect`,{class:`p61-banner__box`,x:30,y:f,width:d-60,height:ne,rx:9}));let k=w(`text`,{class:`p61-banner__seg`,x:46,y:56}),A=w(`text`,{class:`p61-banner__seg`,x:168,y:56}),j=w(`text`,{class:`p61-banner__val`,x:d-46,y:56});D.append(k,A,j);let M=w(`text`,{class:`p61-seclabel`,x:30,y:re});M.textContent=`排序后：王浮到最前，非王牌升序（橙框 = 当前检查的相邻对）`,D.appendChild(M);let N=(d-516)/2,pe=x.map((e,t)=>{let n=N+t*106,r=w(`g`,{class:`p61-card`});r.appendChild(w(`rect`,{class:`p61-card__box`,x:n,y:p,width:m,height:ie,rx:8}));let i=w(`text`,{class:`p61-card__val`,x:n+m/2,y:133});i.textContent=a(e);let o=w(`text`,{class:`p61-card__sub`,x:n+m/2,y:155});return o.textContent=e===0?`大小王 · 0`:`牌面 ${e}`,r.append(i,o),E.appendChild(r),{g:r,c:e,i:t}}),P=w(`path`,{class:`p61-pairlink`});D.appendChild(P);let F=w(`text`,{class:`p61-seclabel`,x:30,y:ae});F.textContent=`相邻非王牌逐对检查：差多少、要不要动用王`,D.appendChild(F);let I=[];for(let e=0;e<C.length-1;e+=1)I.push({index:I.length,a:C[e],b:C[e+1],gap:C[e+1]-C[e]});let L=I.length>0?Math.min(200,(d-60-(I.length-1)*12)/I.length):200,R=(d-(I.length*L+(I.length-1)*12))/2,z=I.map(e=>{let t=R+e.index*(L+12),n=w(`g`,{class:`p61-gap is-pending`});n.appendChild(w(`rect`,{class:`p61-gap__box`,x:t,y:oe,width:L,height:se,rx:8}));let r=w(`text`,{class:`p61-gap__text`,x:t+L/2,y:245});r.textContent=`${a(e.a)} → ${a(e.b)}`;let i=w(`text`,{class:`p61-gap__text`,x:t+L/2,y:261});return n.append(r,i),E.appendChild(n),{g:n,text:r,text2:i,def:e}}),B=w(`text`,{class:`p61-seclabel`,x:30,y:h});B.textContent=`已经接上的连续段（烫金 = 王补出来的数）`,D.appendChild(B);let V=Math.min(56,(d-100)/13),H=[];for(let e=0;e<13;e+=1){let e=w(`g`,{class:`p61-slot is-empty`});e.appendChild(w(`rect`,{class:`p61-slot__box`,y:g,width:V,height:ce,rx:7}));let t=w(`text`,{class:`p61-slot__val`,y:315}),n=w(`text`,{class:`p61-slot__mark`,y:335});e.append(t,n),E.appendChild(e),H.push({g:e,val:t,mark:n})}let U=w(`g`,{class:`p61-verdict`});U.appendChild(w(`rect`,{class:`p61-verdict__box`,x:30,y:le,width:d-60,height:ue,rx:10}));let W=w(`text`,{class:`p61-verdict__label`,x:48,y:389});W.textContent=`判定`;let G=w(`text`,{class:`p61-verdict__main`,x:48,y:408}),K=w(`text`,{class:`p61-verdict__sub`,x:d-48,y:399});U.append(W,G,K),E.appendChild(U);let q=w(`text`,{class:`p61-phasetext`,x:d/2,y:de});D.appendChild(q);let me={init:`顺子 = 5 个互不相同的连续数。排序之后，判断塌缩成「相邻差多少、王够不够补」。`,sort:`王（0）小于所有牌面，排序后自动排到最前 —— 后面只关心非王牌之间的相邻差。`,jokers:`每张王就是一次「任意填」。断档出现时填一张，王用完还不够就不是顺子。`,gap:`相邻差 1 天然连续；差 N 就要拿 N-1 张王补中间的洞；差 0 是重复，王救不了。`,done:`时间 O(1)（5 张牌排序是常数级），空间 O(1) —— 但这题的分数全在边界和 bug 防范上。`},he=e=>{if(e.phase===`init`)return[`准备`,`5 张牌，先排序`,`${b.input.map(a).join(` `)}`];if(e.phase===`sort`)return[`排序`,`王浮到最前，非王升序`,x.map(a).join(` `)];if(e.phase===`jokers`)return[`数王`,S>0?`每张王 = 一次任意填`:`没有王，必须严丝合缝`,`王 × ${S}`];if(e.phase===`gap`){let t=e.checked[e.checked.length-1],n=t?t.kind:`tight`;return[`检查相邻对`,n===`dup`?`${a(t.a)} 和 ${a(t.b)} 重复`:n===`tight`?`${a(t.a)}→${a(t.b)} 差 1，连续`:n===`filled`?`${a(t.a)}→${a(t.b)} 缺 ${t.gap-1} 个，王补`:`${a(t.a)}→${a(t.b)} 缺 ${t.gap-1} 个，王只剩 ${e.remaining}`,`王剩 ${e.remaining}`]}return[`判定`,e.result?`是顺子`:`不是顺子`,e.result?`拼出 ${e.segment?e.segment.filled.map(e=>a(e.value)).join(`-`):``}`:e.failReason===`dup`?`有重复`:`王不够`]};function ge(t,n){if(!n)return;let r=n.phase===`gap`?n.checked[n.checked.length-1]:null,i=r&&r.kind===`dup`?r:null;if(pe.forEach(e=>{let t=[`p61-card`];e.c===0&&t.push(`is-joker`),i&&(e.c===i.a||e.c===i.b)?t.push(`is-dup`):r&&(e.c===r.a||e.c===r.b)&&t.push(`is-cur`),e.g.setAttribute(`class`,t.join(` `))}),r&&r.kind!==`dup`){let e=x.indexOf(r.a),t=x.indexOf(r.b),n=N+e*106+m/2,i=N+t*106+m/2,a=p-14;P.setAttribute(`d`,`M ${n} ${p-4} Q ${(n+i)/2} ${a-14} ${i} ${p-4}`),P.style.opacity=`1`}else P.style.opacity=`0`;z.forEach(({g:e,text:t,text2:r,def:i})=>{let o=n.checked.find(e=>e.index===i.index),s=n.phase===`gap`&&n.pairIndex===i.index,c=`p61-gap`;o?c+=` is-${o.kind}`:s?c+=` is-cur`:c+=` is-pending`,e.setAttribute(`class`,c),o?(t.textContent=`${a(i.a)} → ${a(i.b)}`,r.textContent=fe[o.kind](o)):(t.textContent=`${a(i.a)} → ${a(i.b)}`,r.textContent=s?`检查中…`:`差 ${i.gap}`)});let o=n.segment;H.forEach((e,t)=>{if(!o||t>=o.filled.length){e.g.setAttribute(`class`,`p61-slot is-empty`);return}let n=o.filled[t],r=[`p61-slot`,n.byJoker?`is-joker`:``].join(` `).trim();e.g.setAttribute(`class`,r);let i=o.filled.length,s=(d-(i*V+(i-1)*8))/2+t*52.61538461538461;e.g.querySelector(`.p61-slot__box`).setAttribute(`x`,s),e.val.setAttribute(`x`,s+V/2),e.mark.setAttribute(`x`,s+V/2),e.val.textContent=a(n.value),e.mark.textContent=n.byJoker?`王补`:``});let s=[`p61-verdict`];n.phase===`done`&&s.push(n.result?`is-yes`:`is-no`),U.setAttribute(`class`,s.join(` `)),n.phase===`done`?(G.textContent=n.result?`是顺子`:`不是顺子`,K.textContent=n.result?`补 ${n.need} 个洞 · 王用 ${S-n.remaining}/${S} 张`:n.failReason===`dup`?`非王牌有重复`:`需补 ${n.need} 个洞 · 王只有 ${S} 张`):(G.textContent=n.failReason?`不是顺子`:`检查中…`,K.textContent=`王还剩 ${n.remaining} 张 · 已接上 ${o?o.filled.length:0} 张`);let[c,l,u]=he(n);k.textContent=c,A.textContent=l,j.textContent=u,q.textContent=me[n.phase]||``,e(J,n.desc)}let J=ee(),Y=document.createElement(`div`);Y.className=`viz p61`;let X=document.createElement(`div`);X.className=`viz__stage`,X.appendChild(T),Y.appendChild(X),Y.appendChild(J);let Z=i();Y.appendChild(Z.root),l.textContent=``,l.appendChild(Y),n();let _e=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:y,controls:Z,intervalMs:c,onRender:ge});Q.jumpTo(Math.trunc(v.initialStep)||0);let $=null;return v.autoplay!==!1&&!_e&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(Y)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),l.textContent=``,delete l.dataset.p61Mounted,document.getElementById(s)?.remove()}}}export{v as mountPokerStraight};