import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[7,1,5,3,6,4];function o(e={}){let t=Array.isArray(e.prices)&&e.prices.length>0?[...e.prices]:[...a],n=[],r=t[0],i=0,o=(e,a,o={})=>{n.push({phase:e,desc:a,prices:[...t],day:0,price:null,prevPrice:null,minPrice:r,prevMin:r,candidate:null,best:i,prevBest:i,updated:null,result:i,done:e===`done`,...o})};o(`init`,`价格序列 \`[${t.join(`, `)}]\`。只许**买卖一次**（先买后卖），求最大利润。暴力枚举所有 (买, 卖) 对是 \`O(n²)\`；一维扫描只需两个变量：\`minPrice\` = **截至昨天**的历史最低价（我手里最便宜的那笔买入），\`best\` = 历史最大的"今天卖出"利润。开局第 0 天：\`minPrice = ${t[0]}\`，还没卖过，\`best = 0\`。每天两件事、**顺序固定**：先按今天的价格卖一把，再把今天并入历史最低价 —— 反了就变成"今天买今天卖"。`,{day:0,minPrice:t[0],prevMin:t[0],best:0,prevBest:0});for(let e=1;e<t.length;e+=1){let n=t[e],a=t[e-1],s=r,c=i,l=n-s,u=Math.max(c,l),d=Math.min(s,n),f=u>c?`best`:d<s?`minPrice`:`none`;i=u,r=d;let p;p=f===`best`?`**第 ${e} 天** \`price = ${n}\`：先卖一把 —— \`candidate = ${n} - ${s} = ${l}\`，\`best = max(${c}, ${l}) = ${i}\` **刷新**！历史最低价仍是 \`${s}\`（今天比它贵，不更新）。注意 candidate 用的是**更新前**的 minPrice —— 先卖后记，顺序即题意。`:f===`minPrice`?`**第 ${e} 天** \`price = ${n}\`：卖一把 \`candidate = ${n} - ${s} = ${l} ≤ ${c}\`，best 不动；但今天比历史最低价还便宜，\`minPrice = ${r}\` **刷新** —— 它在等未来某一天把这笔"便宜买入"卖出去。全程最低价是不断**下台阶**的。`:`**第 ${e} 天** \`price = ${n}\`：\`candidate = ${n} - ${s} = ${l} ≤ best = ${i}\`，且 \`price ≥ minPrice\` 也不刷新历史最低 —— 两变量**原地不动**。大多数日子都是这种"路过帧"：扫描的常态是不动，动的那几帧才是答案的来路。`,o(`scan`,p,{day:e,price:n,prevPrice:a,minPrice:r,prevMin:s,candidate:l,best:i,prevBest:c,updated:f})}return o(`done`,`返回 **\`${i}\`**。复盘：${t.length-1} 次路过，best 只在上坡日刷新、minPrice 只在下台阶日刷新 —— 两个单调变量把 O(n²) 的对枚举压成 O(n)。若全程下跌，candidate 恒为负，best 停在 0（语义 = **干脆不买**，这也是 121 的合法答案）。记住这两个变量的含义：minPrice 是"最便宜的昨天"，best 是"最赚的卖出日"。`,{done:!0,result:i,day:t.length-1}),n}var s=`stocki-styles`,c=34,l=62,u=76,d=42,f=132,p=148,m=168,h=46,g=228,_=56,v=306,ee=604,y=1500,b=`
.siv { display: flex; flex-direction: column; gap: 14px; }
.siv__svg { width: 100%; height: auto; display: block; }

.siv-note {
  fill: var(--siv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.siv-note--r { text-anchor: end; }

.siv-cell__box {
  fill: var(--siv-fill, #ffffff); stroke: var(--siv-line, #c3c9c2); stroke-width: 1.5;
}
.siv-cell__val {
  fill: var(--siv-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.siv-cell__idx {
  fill: var(--siv-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.siv-cell.is-past .siv-cell__box { fill: var(--siv-past, #eef0ec); }
.siv-cell.is-min .siv-cell__box {
  fill: var(--siv-ok-fill, #eef5f1); stroke: var(--siv-ok, #3f6b57); stroke-width: 3;
}
.siv-cell.is-min .siv-cell__val { fill: var(--siv-ok, #3f6b57); }
.siv-cell.is-today .siv-cell__box {
  fill: var(--siv-gold-fill, #fdf3e3); stroke: var(--siv-gold, #c2872f); stroke-width: 3;
}
.siv-cell.is-today .siv-cell__val { fill: var(--siv-gold, #c2872f); }
.siv-cell.is-min.is-today .siv-cell__box {
  fill: var(--siv-gold-fill, #fdf3e3);
  stroke: var(--siv-gold, #c2872f); stroke-width: 3;
}

.siv-ptr { font-size: 11px; font-weight: 700; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.siv-ptr--m { fill: var(--siv-ok, #3f6b57); }
.siv-ptr--t { fill: var(--siv-gold, #c2872f); }
.siv-tri--m { fill: var(--siv-ok, #3f6b57); }
.siv-tri--t { fill: var(--siv-gold, #c2872f); }

.siv-banner__box {
  fill: var(--siv-banner, #f4f3ef); stroke: var(--siv-line, #c3c9c2); stroke-width: 1.5;
}
.siv-banner__text {
  fill: var(--siv-hot, #a45f45); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.siv-banner__text.is-ok { fill: var(--siv-ok, #3f6b57); }

.siv-panel__box {
  fill: var(--siv-fill, #ffffff); stroke: var(--siv-line, #c3c9c2); stroke-width: 1.5;
}
.siv-panel__label {
  fill: var(--siv-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.siv-panel__num {
  fill: var(--siv-ink, #1f2a24); font-size: 19px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.siv-panel__num.is-fresh { fill: var(--siv-gold, #c2872f); }
.siv-panel__num.is-final { fill: var(--siv-ok, #3f6b57); }

.siv-phase__text {
  fill: var(--siv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function x(){if(document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=b,document.head.appendChild(e)}function S(a,b={}){if(!a||a.dataset.stockiMounted===`1`)return{destroy(){}};a.dataset.stockiMounted=`1`,x();let S=o(b),C=b.autoplay!==!1,w=S[0].prices,T=r,E=document.createElement(`div`);E.className=`viz siv`;let D=document.createElement(`div`);D.className=`viz__stage`,E.appendChild(D);let O=T(`svg`,{class:`viz__svg siv__svg`,viewBox:`0 0 660 328`,role:`img`,"aria-label":`买卖股票最佳时机 I LC121 推演动画`});D.appendChild(O);let k=T(`g`,{}),A=T(`g`,{});O.appendChild(k),O.appendChild(A);let j=T(`text`,{class:`siv-note`,x:26,y:c});j.textContent=`先卖一把，再记最低价 —— 顺序即题意`,A.appendChild(j);let M=T(`text`,{class:`siv-note siv-note--r`,x:634,y:c});M.textContent=`只许买卖一次`,A.appendChild(M);let N=w.length,P=Math.min(64,Math.floor((ee-(N-1)*6)/Math.max(1,N))),F=(660-(N*P+(N-1)*6))/2,I=e=>{let t=0;for(let n=1;n<=(e.phase===`done`?N-1:e.day);n+=1)w[n]<w[t]&&(t=n);return t},L=w.map((e,t)=>{let n=F+t*(P+6),r=T(`g`,{class:`siv-cell`});r.appendChild(T(`rect`,{class:`siv-cell__box`,x:n,y:u,width:P,height:d,rx:6}));let i=T(`text`,{class:`siv-cell__val`,x:n+P/2,y:92});i.textContent=String(e),r.appendChild(i);let a=T(`text`,{class:`siv-cell__idx`,x:n+P/2,y:109});return a.textContent=String(t),r.appendChild(a),k.appendChild(r),{g:r,cx:n+P/2}}),R=T(`path`,{class:`siv-tri siv-tri--t`,d:``}),z=T(`text`,{class:`siv-ptr siv-ptr--t`,x:0,y:l});z.textContent=`today`;let B=T(`path`,{class:`siv-tri siv-tri--m`,d:``}),V=T(`text`,{class:`siv-ptr siv-ptr--m`,x:0,y:p});V.textContent=`min`,A.append(R,z,B,V),A.appendChild(T(`rect`,{class:`siv-banner__box`,x:26,y:m,width:608,height:h,rx:9}));let H=T(`text`,{class:`siv-banner__text`,x:660/2,y:191});A.appendChild(H),A.appendChild(T(`rect`,{class:`siv-panel__box`,x:26,y:g,width:608,height:_,rx:9}));let U=(e,t)=>{let n=T(`text`,{class:`siv-panel__label`,x:t,y:243});n.textContent=e;let r=T(`text`,{class:`siv-panel__num`,x:t,y:265});return A.append(n,r),r},W=U(`minPrice`,660/2-145),G=U(`candidate`,660/2-48),K=U(`best`,378),q=U(`day`,475),J=T(`text`,{class:`siv-phase__text`,x:660/2,y:v});A.appendChild(J);let Y=document.createElement(`p`);Y.className=`viz__desc`,Y.setAttribute(`aria-live`,`polite`);function X(t,n){if(!n)return;let r=I(n),i=n.phase===`done`?-1:n.day;L.forEach((e,t)=>{let a=[`siv-cell`];t===i?a.push(`is-today`):t===r?a.push(`is-min`):n.phase!==`init`&&t<n.day&&a.push(`is-past`),e.g.setAttribute(`class`,a.join(` `))});let a=(e,t,n)=>n===`down`?`M ${e-6} ${t-8} L ${e+6} ${t-8} L ${e} ${t+1} Z`:`M ${e-6} ${t+8} L ${e+6} ${t+8} L ${e} ${t-1} Z`;if(i>=0){let e=L[i].cx;R.setAttribute(`d`,a(e,u-4,`down`)),z.setAttribute(`x`,e),R.style.opacity=`1`,z.style.opacity=`1`}else R.setAttribute(`d`,``),R.style.opacity=`0`,z.style.opacity=`0`;let o=L[r].cx;if(B.setAttribute(`d`,a(o,f,`up`)),V.setAttribute(`x`,o),n.phase===`scan`){let e=n.candidate>n.prevBest?`>`:n.candidate<n.prevBest?`<`:`=`,t=n.updated===`best`?`best 刷新 → ${n.best}`:n.updated===`minPrice`?`minPrice 下台阶`:`两变量不动（路过）`;H.textContent=`卖一把：${n.price} - ${n.prevMin} = ${n.candidate} ${e} best ${n.prevBest}  →  ${t}`,H.setAttribute(`class`,`siv-banner__text`+(n.updated===`best`?` is-ok`:``))}else n.phase===`done`?(H.textContent=`最大利润 = ${n.result}（minPrice 等来的那次上坡）`,H.setAttribute(`class`,`siv-banner__text is-ok`)):(H.textContent=`开局：minPrice = ${n.minPrice}，best = 0（还没卖过）`,H.setAttribute(`class`,`siv-banner__text`));W.textContent=String(n.minPrice),W.setAttribute(`class`,`siv-panel__num`+(n.updated===`minPrice`?` is-fresh`:``)),G.textContent=n.candidate===null?`—`:String(n.candidate),G.setAttribute(`class`,`siv-panel__num`+(n.phase===`scan`?` is-fresh`:``)),K.textContent=String(n.best),K.setAttribute(`class`,`siv-panel__num`+(n.phase===`done`?` is-final`:n.updated===`best`?` is-fresh`:``)),q.textContent=String(n.day),n.phase===`init`?J.textContent=`每天两件事：先卖一把，再记最低价`:n.updated===`best`?J.textContent=`上坡日：candidate 超过 best，刷新`:n.updated===`minPrice`?J.textContent=`下台阶日：更便宜的买入机会出现`:n.phase===`done`?J.textContent=`O(n)：两个单调变量吃掉 O(n²) 枚举`:J.textContent=`路过日：既不上坡也不破底，什么都不动`,e(Y,n.desc)}E.appendChild(Y);let Z=i();E.appendChild(Z.root),a.textContent=``,a.appendChild(E),n();let te=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:S,controls:Z,intervalMs:y,onRender:X});Q.jumpTo(Math.trunc(b.initialStep)||0);let $=null;return C&&!te&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(E)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.stockiMounted,document.getElementById(s)?.remove()}}}export{S as mountStockI};