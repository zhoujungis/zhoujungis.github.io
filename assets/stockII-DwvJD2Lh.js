import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[7,1,5,3,6,4];function o(e={}){let t=Array.isArray(e.prices)&&e.prices.length>0?[...e.prices]:[...a],n=[],r=0,i=-t[0],o=0,s=(e,a,s={})=>{n.push({phase:e,desc:a,prices:[...t],day:0,price:null,prevPrice:null,diff:null,take:null,greedy:o,prevGreedy:o,cash:r,hold:i,prevCash:r,prevHold:i,sellValue:null,buyValue:null,cashFrom:null,holdFrom:null,result:r,done:e===`done`,...s})};s(`init`,`价格序列 \`[${t.join(`, `)}]\`。可**无限次**买卖（先买后卖、同时最多持一股），求最大利润。每天收盘只有两种状态：\`cash\` = 空仓的最大利润，\`hold\` = 持股的最大利润。开局第 0 天：要么什么都没干 \`cash = 0\`，要么以 \`prices[0] = ${t[0]}\` 建仓 \`hold = -${t[0]}\`（负利润 —— 钱变成票了）。贪心侧同步开局：还没有任何差，\`greedy = 0\`。`,{day:0,cash:0,hold:-t[0],prevCash:0,prevHold:-t[0],greedy:0,prevGreedy:0});for(let e=1;e<t.length;e+=1){let n=t[e],a=t[e-1],c=r,l=i,u=o,d=n-a,f=d>0,p=l+n,m=c-n,h=Math.max(c,p),g=Math.max(l,m),_=u+(f?d:0);r=h,i=g,o=_;let v=p>c?`sell`:`keep`,y=m>l?`buy`:`keep`;s(`scan`,`**第 ${e} 天** \`price = ${n}\`，差值 \`diff = ${n} - ${a} = ${d>0?`+`:``}${d}\`。`+(f?`上坡 → 贪心**吃下**这段：\`greedy = ${u} + ${d} = ${o}\`。`:`下坡 → 贪心**跳过**（不持仓躲过去）：\`greedy\` 保持 ${o}。`)+` DP 侧两条转移同时打分：\`cash = max(空仓不动 ${c}, 今天卖 ${l} + ${n} = ${p}) = ${r}\`；\`hold = max(持股不动 ${l}, 今天买 ${c} - ${n} = ${m}) = ${i}\`。注意 hold 用的 buyValue 是**更新前**的 cash —— 卖和买不能在同一天既变现又建仓（先卖后买等价于"换仓"，题意允许）。看面板：\`greedy\` 与 \`cash\` **逐帧相等** —— 贪心就是这台状态机在"每天必做决定"下的投影。`,{day:e,price:n,prevPrice:a,diff:d,take:f,greedy:o,prevGreedy:u,cash:r,hold:i,prevCash:c,prevHold:l,sellValue:p,buyValue:m,cashFrom:v,holdFrom:y})}return s(`done`,`终态取 **\`cash = ${r}\`**（答案必在空仓侧 —— 持股未变现不算利润）。复盘：正差之和 = ${o}，与 cash 全程逐帧相等，两条路一个终点。等价操作是把每段上坡拆成独立交易：${t.slice(1).map((e,n)=>({d:n+1,diff:e-t[n]})).filter(e=>e.diff>0).map(e=>`第 ${e.d-1}→${e.d} 天 +${e.diff}`).join(`，`)||`（全程无上坡）`}。冷冻期 309 给 cash 加一支"昨天刚卖"、手续费 714 在卖的那支减 fee、限两笔 123 把 cash/hold 复制成四变量 —— 方程一改，机器照跑。`,{done:!0,result:r,day:t.length-1}),n}var s=`stockii-styles`,c=34,l=72,u=42,d=129,f=148,p=58,m=224,h=46,g=286,_=56,v=364,y=604,b=1600,x=`
.sv2 { display: flex; flex-direction: column; gap: 14px; }
.sv2__svg { width: 100%; height: auto; display: block; }

.sv2-note {
  fill: var(--sv2-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-note--r { text-anchor: end; }

.sv2-cell__box {
  fill: var(--sv2-fill, #ffffff); stroke: var(--sv2-line, #c3c9c2); stroke-width: 1.5;
}
.sv2-cell__val {
  fill: var(--sv2-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-cell__idx {
  fill: var(--sv2-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-cell.is-past .sv2-cell__box { fill: var(--sv2-past, #eef0ec); }
.sv2-cell.is-today .sv2-cell__box {
  fill: var(--sv2-gold-fill, #fdf3e3); stroke: var(--sv2-gold, #c2872f); stroke-width: 3;
}
.sv2-cell.is-today .sv2-cell__val { fill: var(--sv2-gold, #c2872f); }

.sv2-diff {
  font-size: 11px; font-weight: 700; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-diff.is-up { fill: var(--sv2-ok, #3f6b57); }
.sv2-diff.is-down { fill: var(--sv2-dim, #9aa39c); }
.sv2-diff.is-live { font-size: 13px; }

.sv2-state__box {
  fill: var(--sv2-fill, #ffffff); stroke: var(--sv2-line, #c3c9c2); stroke-width: 1.5;
}
.sv2-state__box.is-win { stroke: var(--sv2-gold, #c2872f); stroke-width: 3; }
.sv2-state__label {
  fill: var(--sv2-muted, #657168); font-size: 11.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-state__num {
  fill: var(--sv2-ink, #1f2a24); font-size: 24px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-state__num.is-final { fill: var(--sv2-ok, #3f6b57); }

.sv2-banner__box {
  fill: var(--sv2-banner, #f4f3ef); stroke: var(--sv2-line, #c3c9c2); stroke-width: 1.5;
}
.sv2-banner__text {
  fill: var(--sv2-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-banner__text.is-ok { fill: var(--sv2-ok, #3f6b57); }

.sv2-panel__box {
  fill: var(--sv2-fill, #ffffff); stroke: var(--sv2-line, #c3c9c2); stroke-width: 1.5;
}
.sv2-panel__label {
  fill: var(--sv2-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-panel__num {
  fill: var(--sv2-ink, #1f2a24); font-size: 19px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-panel__num.is-fresh { fill: var(--sv2-gold, #c2872f); }

.sv2-phase__text {
  fill: var(--sv2-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function S(){if(document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=x,document.head.appendChild(e)}function C(a,x={}){if(!a||a.dataset.stockiiMounted===`1`)return{destroy(){}};a.dataset.stockiiMounted=`1`,S();let C=o(x),w=x.autoplay!==!1,T=C[0].prices,E=r,D=document.createElement(`div`);D.className=`viz sv2`;let O=document.createElement(`div`);O.className=`viz__stage`,D.appendChild(O);let k=E(`svg`,{class:`viz__svg sv2__svg`,viewBox:`0 0 660 386`,role:`img`,"aria-label":`买卖股票最佳时机 II LC122 推演动画`});O.appendChild(k);let A=E(`g`,{}),j=E(`g`,{});k.appendChild(A),k.appendChild(j);let M=E(`text`,{class:`sv2-note`,x:26,y:c});M.textContent=`贪心吃正差 ≡ 状态机 cash/hold —— 盯住两列逐帧相等`,j.appendChild(M);let N=E(`text`,{class:`sv2-note sv2-note--r`,x:634,y:c});N.textContent=`可无限次买卖`,j.appendChild(N);let P=T.length,F=Math.min(64,Math.floor((y-(P-1)*6)/Math.max(1,P))),I=(660-(P*F+(P-1)*6))/2,L=T.map((e,t)=>{let n=I+t*(F+6),r=E(`g`,{class:`sv2-cell`});r.appendChild(E(`rect`,{class:`sv2-cell__box`,x:n,y:l,width:F,height:u,rx:6}));let i=E(`text`,{class:`sv2-cell__val`,x:n+F/2,y:88});i.textContent=String(e),r.appendChild(i);let a=E(`text`,{class:`sv2-cell__idx`,x:n+F/2,y:105});return a.textContent=String(t),r.appendChild(a),A.appendChild(r),{g:r,cx:n+F/2,x:n}}),R=[];for(let e=1;e<P;e+=1){let t=E(`text`,{class:`sv2-diff`,x:L[e-1].x+F+6/2,y:d});j.appendChild(t),R.push(t)}let z=E(`rect`,{class:`sv2-state__box`,x:120/2,y:f,width:250,height:p,rx:10}),B=E(`rect`,{class:`sv2-state__box`,x:350,y:f,width:250,height:p,rx:10}),V=E(`text`,{class:`sv2-state__label`,x:185,y:162});V.textContent=`cash（空仓最大利润）`;let H=E(`text`,{class:`sv2-state__label`,x:475,y:162});H.textContent=`hold（持股最大利润）`;let U=E(`text`,{class:`sv2-state__num`,x:185,y:186}),W=E(`text`,{class:`sv2-state__num`,x:475,y:186});j.append(z,B,V,H,U,W),j.appendChild(E(`rect`,{class:`sv2-banner__box`,x:26,y:m,width:608,height:h,rx:9}));let G=E(`text`,{class:`sv2-banner__text`,x:660/2,y:247});j.appendChild(G),j.appendChild(E(`rect`,{class:`sv2-panel__box`,x:26,y:g,width:608,height:_,rx:9}));let K=(e,t)=>{let n=E(`text`,{class:`sv2-panel__label`,x:t,y:301});n.textContent=e;let r=E(`text`,{class:`sv2-panel__num`,x:t,y:323});return j.append(n,r),r},q=K(`diff`,660/2-165),J=K(`greedy`,660/2-55),ee=K(`cash`,385),te=K(`hold`,495),Y=E(`text`,{class:`sv2-phase__text`,x:660/2,y:v});j.appendChild(Y);let X=document.createElement(`p`);X.className=`viz__desc`,X.setAttribute(`aria-live`,`polite`);function ne(t,n){if(!n)return;let r=n.phase===`done`?-1:n.day;L.forEach((e,t)=>{let i=[`sv2-cell`];t===r?i.push(`is-today`):n.phase!==`init`&&t<n.day&&i.push(`is-past`),e.g.setAttribute(`class`,i.join(` `))});for(let e=1;e<P;e+=1){let t=R[e-1];if(n.phase===`init`||e>n.day){t.textContent=``;continue}let r=T[e]-T[e-1],i=r>0,a=n.phase===`scan`&&e===n.day;t.textContent=`${i?`+`:``}${r}`,t.setAttribute(`class`,`sv2-diff ${i?`is-up`:`is-down`}`+(a?` is-live`:``))}U.textContent=String(n.cash),W.textContent=String(n.hold),z.setAttribute(`class`,`sv2-state__box`+(n.cashFrom===`sell`?` is-win`:``)),B.setAttribute(`class`,`sv2-state__box`+(n.holdFrom===`buy`?` is-win`:``)),U.setAttribute(`class`,`sv2-state__num`+(n.phase===`done`?` is-final`:``)),W.setAttribute(`class`,`sv2-state__num`),n.phase===`scan`?(G.textContent=`cash = max(${n.prevCash}, ${n.prevHold}+${n.price}=${n.sellValue}) = ${n.cash}   hold = max(${n.prevHold}, ${n.prevCash}-${n.price}=${n.buyValue}) = ${n.hold}`,G.setAttribute(`class`,`sv2-banner__text`+(n.cash>n.prevCash?` is-ok`:``))):n.phase===`done`?(G.textContent=`答案 = cash = ${n.result}（终态必须空仓；hold=${n.hold} 是"如果死拿"）`,G.setAttribute(`class`,`sv2-banner__text is-ok`)):(G.textContent=`开局：cash = 0（空仓）  hold = ${n.hold}（第 0 天建仓，钱变票）`,G.setAttribute(`class`,`sv2-banner__text`)),q.textContent=n.diff===null?`—`:`${n.diff>0?`+`:``}${n.diff}`,q.setAttribute(`class`,`sv2-panel__num`+(n.phase===`scan`?` is-fresh`:``)),J.textContent=String(n.greedy),J.setAttribute(`class`,`sv2-panel__num`+(n.take?` is-fresh`:``)),ee.textContent=String(n.cash),te.textContent=String(n.hold),n.phase===`init`?Y.textContent=`每天收盘：要么空仓 cash，要么持股 hold`:n.take?Y.textContent=`上坡：贪心吃下 +差，DP 侧 cash 由"今天卖"刷新`:n.phase===`done`?Y.textContent=`greedy 与 cash 全程逐帧相等 —— 贪心 ≡ 状态机`:Y.textContent=`下坡：贪心跳过，DP 侧 hold 由"低位补仓"刷新`,e(X,n.desc)}D.appendChild(X);let Z=i();D.appendChild(Z.root),a.textContent=``,a.appendChild(D),n();let re=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:C,controls:Z,intervalMs:b,onRender:ne});Q.jumpTo(Math.trunc(x.initialStep)||0);let $=null;return w&&!re&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(D)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.stockiiMounted,document.getElementById(s)?.remove()}}}export{C as mountStockII};