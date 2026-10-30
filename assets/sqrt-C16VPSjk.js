import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=8;function o(e={}){let t=Number.isInteger(e.x)&&e.x>=0?e.x:a,n=[],r=0,i=t,o=0,s=(e,a,s={})=>{n.push({phase:e,desc:a,x:t,lo:r,hi:i,prevLo:r,prevHi:i,mid:null,sq:null,le:null,action:null,ans:o,prevAns:o,done:e===`done`,...s})};s(`init`,`求 \`√${t}\` 的整数部分。69 没有数组 —— 但**整数区间 \`[0, ${t}]\` 就是那个有序数组**：定义谓词 \`P(k) = (k * k <= ${t})\`，k 越大 k² 越大，P 必是"前真后假"：\`true true … true | false … false\`。算术平方根 = **最后一个 true 的下标** —— 这是"边界二分"，和 704 的"命中二分"只差一个动作：P(mid) 成立时**不收工**，记下 \`ans = mid\` 当候选，然后 \`lo = mid + 1\` 继续向右找更大的。`,{lo:0,hi:t,prevLo:0,prevHi:t,ans:0,prevAns:0});let c=0;for(;r<=i&&c<64;){c+=1;let e=r,a=i,l=o,u=r+(i-r>>1),d=u*u,f=d<=t;f?(o=u,r=u+1,s(`probe`,`**第 ${n.length} 探**：\`mid = ${e} + ((${a} - ${e}) >> 1) = ${u}\`，\`mid² = ${d} <= ${t}\` —— 谓词成立。但这是**边界**不是命中：mid 右边可能还有更大的合法 k，所以**记候选** \`ans = ${u}\`，\`lo = mid + 1 = ${r}\` **继续向右**。这就是 69 与 704 的分岔口：704 相等即返回，69 成立仍不停。`,{mid:u,sq:d,le:f,action:`record_right`,lo:r,hi:i,prevLo:e,prevHi:a,ans:o,prevAns:l})):(i=u-1,s(`probe`,`**第 ${n.length} 探**：\`mid = ${e} + ((${a} - ${e}) >> 1) = ${u}\`，\`mid² = ${d} > ${t}\` —— 谓词不成立，mid 及右边全是 false，整段排除：\`hi = mid - 1 = ${i}\`，\`ans = ${o}\` 不动。真解被压进 \`[${o}, ${i}]\`，每探一次候选区间减半。`,{mid:u,sq:d,le:f,action:`go_left`,lo:r,hi:i,prevLo:e,prevHi:a,ans:o,prevAns:l}))}return s(`done`,`\`lo = ${r} > hi = ${i}\`，区间空 —— 最后一个记下的候选就是答案：**\`⌊√${t}⌋ = ${o}\`**（校验：\`${o}² = ${o*o} <= ${t}\` 且 \`(${o} + 1)² = ${(o+1)*(o+1)} > ${t}\`）。复盘模板：和 704 同一套闭区间三件套，只把"命中返回"换成"成立记候选再向右" —— **答案不在数组里，答案在谓词的边界上**。`,{done:!0,lo:r,hi:i,ans:o,prevAns:o}),n}var s=`sqrt-styles`,c=34,l=62,u=76,d=52,f=142,p=158,m=178,ee=46,h=238,g=56,_=316,v=604,y=1400,b=`
.sqv { display: flex; flex-direction: column; gap: 14px; }
.sqv__svg { width: 100%; height: auto; display: block; }

.sqv-note {
  fill: var(--sqv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sqv-note--r { text-anchor: end; }

.sqv-cell__box {
  fill: var(--sqv-true-fill, #eef5f1); stroke: var(--sqv-line, #c3c9c2); stroke-width: 1.5;
}
.sqv-cell__val {
  fill: var(--sqv-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sqv-cell__sub {
  fill: var(--sqv-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sqv-cell.is-false .sqv-cell__box { fill: var(--sqv-past, #eef0ec); stroke: var(--sqv-past-line, #d8ddd6); }
.sqv-cell.is-false .sqv-cell__val { fill: var(--sqv-dim, #9aa39c); }
.sqv-cell.is-out .sqv-cell__box { stroke-dasharray: 3 3; }
.sqv-cell.is-mid .sqv-cell__box {
  fill: var(--sqv-gold-fill, #fdf3e3); stroke: var(--sqv-gold, #c2872f); stroke-width: 3;
}
.sqv-cell.is-mid .sqv-cell__val { fill: var(--sqv-gold, #c2872f); }
.sqv-cell.is-ans .sqv-cell__box { stroke: var(--sqv-ok, #3f6b57); stroke-width: 3; }

.sqv-ptr { font-size: 11px; font-weight: 700; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.sqv-ptr--l { fill: var(--sqv-ok, #3f6b57); }
.sqv-ptr--r { fill: var(--sqv-hot, #a45f45); }
.sqv-ptr--m { fill: var(--sqv-gold, #c2872f); }
.sqv-tri--l { fill: var(--sqv-ok, #3f6b57); }
.sqv-tri--r { fill: var(--sqv-hot, #a45f45); }
.sqv-tri--m { fill: var(--sqv-gold, #c2872f); }

.sqv-banner__box {
  fill: var(--sqv-banner, #f4f3ef); stroke: var(--sqv-line, #c3c9c2); stroke-width: 1.5;
}
.sqv-banner__text {
  fill: var(--sqv-hot, #a45f45); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sqv-banner__text.is-ok { fill: var(--sqv-ok, #3f6b57); }

.sqv-panel__box {
  fill: var(--sqv-fill, #ffffff); stroke: var(--sqv-line, #c3c9c2); stroke-width: 1.5;
}
.sqv-panel__label {
  fill: var(--sqv-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sqv-panel__num {
  fill: var(--sqv-ink, #1f2a24); font-size: 19px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sqv-panel__num.is-fresh { fill: var(--sqv-gold, #c2872f); }
.sqv-panel__num.is-final { fill: var(--sqv-ok, #3f6b57); }
.sqv-panel__note {
  fill: var(--sqv-muted, #657168); font-size: 12px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.sqv-phase__text {
  fill: var(--sqv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function x(){if(document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=b,document.head.appendChild(e)}function S(a,b={}){if(!a||a.dataset.sqrtMounted===`1`)return{destroy(){}};a.dataset.sqrtMounted=`1`,x();let S=o(b),C=b.autoplay!==!1,w=S[0].x,T=r,E=document.createElement(`div`);E.className=`viz sqv`;let D=document.createElement(`div`);D.className=`viz__stage`,E.appendChild(D);let O=T(`svg`,{class:`viz__svg sqv__svg`,viewBox:`0 0 660 338`,role:`img`,"aria-label":`x 的平方根 LC69 推演动画`});D.appendChild(O);let k=T(`g`,{}),A=T(`g`,{});O.appendChild(k),O.appendChild(A);let j=T(`text`,{class:`sqv-note`,x:26,y:c});j.textContent=`谓词 P(k) = k² <= x：前真后假，求最后一个真`,A.appendChild(j);let M=T(`text`,{class:`sqv-note sqv-note--r`,x:634,y:c});M.textContent=`x = ${w}`,A.appendChild(M);let N=w+1,P=Math.min(52,Math.floor((v-(N-1)*4)/Math.max(1,N))),F=(660-(N*P+(N-1)*4))/2,I=[];for(let e=0;e<=w;e+=1){let t=F+e*(P+4),n=T(`g`,{class:`sqv-cell`});n.appendChild(T(`rect`,{class:`sqv-cell__box`,x:t,y:u,width:P,height:d,rx:6}));let r=T(`text`,{class:`sqv-cell__val`,x:t+P/2,y:93});r.textContent=String(e),n.appendChild(r);let i=T(`text`,{class:`sqv-cell__sub`,x:t+P/2,y:113});i.textContent=`${e*e<=999?e*e:`…`}`,n.appendChild(i);let a=T(`text`,{class:`sqv-cell__sub`,x:t+P/2,y:124});a.textContent=`k²`,n.appendChild(a),k.appendChild(n),I.push({g:n,cx:t+P/2})}let L=T(`path`,{class:`sqv-tri sqv-tri--m`,d:``}),R=T(`text`,{class:`sqv-ptr sqv-ptr--m`,x:0,y:l});R.textContent=`mid`;let z=T(`path`,{class:`sqv-tri sqv-tri--l`,d:``}),B=T(`text`,{class:`sqv-ptr sqv-ptr--l`,x:0,y:p});B.textContent=`lo`;let V=T(`path`,{class:`sqv-tri sqv-tri--r`,d:``}),H=T(`text`,{class:`sqv-ptr sqv-ptr--r`,x:0,y:p});H.textContent=`hi`,A.append(L,R,z,B,V,H),A.appendChild(T(`rect`,{class:`sqv-banner__box`,x:26,y:m,width:608,height:ee,rx:9}));let U=T(`text`,{class:`sqv-banner__text`,x:660/2,y:201});A.appendChild(U),A.appendChild(T(`rect`,{class:`sqv-panel__box`,x:26,y:h,width:608,height:g,rx:9}));let W=(e,t)=>{let n=T(`text`,{class:`sqv-panel__label`,x:t,y:253});n.textContent=e;let r=T(`text`,{class:`sqv-panel__num`,x:t,y:275});return A.append(n,r),r},G=W(`lo`,660/2-180),K=W(`hi`,660/2-60),q=W(`ans（候选）`,390),J=T(`text`,{class:`sqv-panel__note`,x:525,y:275});A.append(J);let Y=T(`text`,{class:`sqv-phase__text`,x:660/2,y:_});A.appendChild(Y);let X=document.createElement(`p`);X.className=`viz__desc`,X.setAttribute(`aria-live`,`polite`);function te(t,n){if(!n)return;I.forEach((e,t)=>{let r=[`sqv-cell`],i=n.mid!==null&&t===n.mid;t*t>w&&r.push(`is-false`),(t<n.lo||t>n.hi)&&!i&&r.push(`is-out`),i?r.push(`is-mid`):t===n.ans&&n.ans*n.ans<=w&&r.push(`is-ans`),e.g.setAttribute(`class`,r.join(` `))});let r=(e,t,n)=>n===`down`?`M ${e-6} ${t-8} L ${e+6} ${t-8} L ${e} ${t+1} Z`:`M ${e-6} ${t+8} L ${e+6} ${t+8} L ${e} ${t-1} Z`;if(n.mid!==null){let e=I[n.mid].cx;L.setAttribute(`d`,r(e,u-4,`down`)),R.setAttribute(`x`,e),L.style.opacity=`1`,R.style.opacity=`1`}else L.setAttribute(`d`,``),L.style.opacity=`0`,R.style.opacity=`0`;let i=n.lo<=w?I[n.lo].cx:I[w].cx+P+4,a=n.hi>=0?I[n.hi].cx:I[0].cx-P-4;if(z.setAttribute(`d`,r(i,f,`up`)),B.setAttribute(`x`,i),V.setAttribute(`d`,r(a,f,`up`)),H.setAttribute(`x`,a),B.textContent=n.lo>n.hi?`lo>hi`:`lo`,n.phase===`probe`){let e=n.le?`<=`:`>`,t=n.le?`记 ans = ${n.mid}，lo = ${n.lo} 继续向右`:`hi = ${n.hi}（mid 及右边全 false）`;U.textContent=`${n.mid}² = ${n.sq} ${e} ${w}  →  ${t}`,U.setAttribute(`class`,`sqv-banner__text`+(n.le?` is-ok`:``))}else n.phase===`done`?(U.textContent=`区间空 → ⌊√${w}⌋ = ${n.ans}`,U.setAttribute(`class`,`sqv-banner__text is-ok`)):(U.textContent=`候选区间 [0, ${w}]：绿色=满足 k²<=${w}，灰色=不满足`,U.setAttribute(`class`,`sqv-banner__text`));G.textContent=String(n.lo),K.textContent=String(n.hi),G.setAttribute(`class`,`sqv-panel__num`+(n.action===`record_right`?` is-fresh`:``)),K.setAttribute(`class`,`sqv-panel__num`+(n.action===`go_left`?` is-fresh`:``)),q.textContent=String(n.ans),q.setAttribute(`class`,`sqv-panel__num`+(n.done?` is-final`:n.action===`record_right`?` is-fresh`:``)),J.textContent=`校验 ${n.ans}² = ${n.ans*n.ans} <= ${w}，(${n.ans}+1)² = ${(n.ans+1)*(n.ans+1)} > ${w}？`,n.phase===`init`?Y.textContent=`答案不在数组里，答案在谓词的边界上`:n.action===`record_right`?Y.textContent=`成立不收工：记候选，继续向右找更大的`:n.action===`go_left`?Y.textContent=`不成立：mid 及右边整段出局`:Y.textContent=`区间空 → ans 即最后一个真 = ⌊√x⌋`,e(X,n.desc)}E.appendChild(X);let Z=i();E.appendChild(Z.root),a.textContent=``,a.appendChild(E),n();let ne=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:S,controls:Z,intervalMs:y,onRender:te});Q.jumpTo(Math.trunc(b.initialStep)||0);let $=null;return C&&!ne&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(E)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.sqrtMounted,document.getElementById(s)?.remove()}}}export{S as mountSqrt};