import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[1,2,5],o=11,s=1/0;function c(e={}){let t=(Array.isArray(e.coins)?e.coins:[]).filter(e=>Number.isInteger(e)&&e>0),n=Number.isInteger(e.amount)&&e.amount>=0?e.amount:o;return{coins:t.length>0?t:[...a],amount:n}}var l=e=>e===s?`∞`:String(e);function u(e={}){let{coins:t,amount:n}=c(e),r=[],i=Array(n+1).fill(s);i[0]=0;let a=Array(n+1).fill(null),o=(e,a,o={})=>{r.push({phase:e,desc:a,coins:[...t],amount:n,a:-1,dp:[...i],prevDp:[...i],trials:[],best:null,fromCoin:null,sourceIdx:null,traceIdx:-1,traceCoin:null,picked:[],combination:[],result:i[n]===s?-1:i[n],done:e===`done`,...o})};o(`init`,`硬币面额 \`[${t.join(`, `)}]\`，目标金额 \`${n}\`，每种硬币**数量不限**，求最少枚数。定义 \`dp[x]\` = 凑出金额 \`x\` 的**最少硬币枚数**：边界 \`dp[0] = 0\`（零元一枚都不用），其余全部初始化成 **∞** —— 先假定凑不出，凑得出再往下降。递推式 \`dp[x] = min( dp[x-c] + 1 )\`：把每枚硬币当作"最后一枚"试一遍，看剩下的 \`x-c\` 最少要几枚、再补上这一枚。金额 \`x\` 从 1 到 ${n} **正序**推进，算 \`dp[x]\` 时用到的 \`dp[x-c]\`（下标更小）早已就绪 —— 这正是"硬币可以重复用"的开关。`);for(let e=1;e<=n;e+=1){let n=[...i],r=[],c=s,u=null;for(let i of t){let t=e-i;if(t<0){r.push({coin:i,idx:-1,prev:null,value:s,ok:!1,reachable:!1});continue}let a=n[t],o=a+1,l=o<c;l&&(c=o,u=i),r.push({coin:i,idx:t,prev:a,value:o,ok:l,reachable:a!==s})}i[e]=c,a[e]=u;let d=r.map(t=>t.idx<0?`\`${t.coin}\` 比 ${e} 大，跳过`:t.prev===s?`\`${t.coin}\`：dp[${t.idx}] = ∞ 此路不通`:`\`${t.coin}\`：dp[${t.idx}] + 1 = ${t.prev} + 1 = ${t.value}${t.ok?` ✓`:``}`).join(`；`),f=u===null?null:e-u;o(`fill`,`金额 **${e}**：逐个试硬币 —— ${d}。`+(u===null?`三种试法全不可达，\`dp[${e}] = ∞\`（此刻还凑不出）。`:`最小是 ${c}（最后一枚用 \`${u}\`，来源 \`dp[${f}] = ${l(n[f])}\`），\`dp[${e}] = ${c}\`。`)+`注意比较用的是**更新前**的 dp，且来源格 \`${f??`—`}\` 下标更小、**可能已经用过这枚硬币** —— 无限复用就发生在这一步。`,{a:e,prevDp:n,trials:r,best:c,fromCoin:u,sourceIdx:f})}let u=i[n]!==s,d=[],f=[n];if(u&&n>0){let e=n;for(;e>0;){let t=a[e],n=e-t;d.push(t),f.push(n),o(`trace`,`**回溯**：\`dp[${e}] = ${l(i[e])}\`，取到它的最后一枚是 \`${t}\`，于是跳到 \`dp[${n}] = ${l(i[n])}\`（${l(i[e])} = ${l(i[n])} + 1）。已锁定的硬币：${d.map(e=>`\`${e}\``).join(` + `)}。只记枚数还原不出组合，靠的就是这张 \`chosen\` 前驱表。`,{a:e,traceIdx:e,traceCoin:t,sourceIdx:n,picked:[...d]}),e=n}}let p=[...d].reverse();return o(`done`,u?n===0?`返回 **0**：金额为 0，一枚都不用凑。`:`返回 **${i[n]}**：组合 \`${p.join(` + `)} = ${n}\`，共 ${p.length} 枚。回溯链 \`${f.join(` → `)}\`。复盘：\`dp[x]\` 只在正序推进下才允许"自己再叠一枚自己"，这是完全背包与 0-1 背包的**唯一**分界线（见动画 2）。`:`返回 **-1**：\`dp[${n}] = ∞\`，任何硬币组合都凑不出 ${n}。注意 ∞ 在比较里会一路"沉底"—— 只有真正可达的路径才有机会刷新它。`,{a:-1,combination:p,picked:[...d],done:!0}),r}var d=`coinchange-styles`,f=1/0,p=30,ee=56,te=44,ne=108,m=120,h=48,g=184,_=44,v=242,y=54,b=316,x=604,S=1350,C=`
.ccv { display: flex; flex-direction: column; gap: 14px; }
.ccv__svg { width: 100%; height: auto; display: block; }

.ccv-note {
  fill: var(--ccv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-note--r { text-anchor: end; }

.ccv-cell__box {
  fill: var(--ccv-fill, #ffffff); stroke: var(--ccv-line, #c3c9c2); stroke-width: 1.5;
}
.ccv-cell__val {
  fill: var(--ccv-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-cell__idx {
  fill: var(--ccv-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-cell.is-past .ccv-cell__box { fill: var(--ccv-past, #eef0ec); }
.ccv-cell.is-unreach .ccv-cell__val { fill: var(--ccv-dim, #9aa39c); font-weight: 500; }
.ccv-cell.is-unreach .ccv-cell__box { stroke-dasharray: 3 3; }
.ccv-cell.is-source .ccv-cell__box {
  fill: var(--ccv-ok-fill, #eef5f1); stroke: var(--ccv-ok, #3f6b57); stroke-width: 3;
}
.ccv-cell.is-source .ccv-cell__val { fill: var(--ccv-ok, #3f6b57); }
.ccv-cell.is-target .ccv-cell__box {
  fill: var(--ccv-gold-fill, #fdf3e3); stroke: var(--ccv-gold, #c2872f); stroke-width: 3;
}
.ccv-cell.is-target .ccv-cell__val { fill: var(--ccv-gold, #c2872f); }
.ccv-cell.is-locked .ccv-cell__box {
  fill: var(--ccv-ok-fill, #eef5f1); stroke: var(--ccv-ok, #3f6b57); stroke-width: 2.5;
}
.ccv-cell.is-locked .ccv-cell__val { fill: var(--ccv-ok, #3f6b57); }

.ccv-arc { fill: none; stroke: var(--ccv-ok, #3f6b57); stroke-width: 2; opacity: 0.85; }
.ccv-arc__head { fill: var(--ccv-ok, #3f6b57); opacity: 0.85; }

.ccv-trial__box {
  fill: var(--ccv-fill, #ffffff); stroke: var(--ccv-line, #c3c9c2); stroke-width: 1.5;
}
.ccv-trial.is-win .ccv-trial__box { stroke: var(--ccv-gold, #c2872f); stroke-width: 3;
  fill: var(--ccv-gold-fill, #fdf3e3); }
.ccv-trial.is-dead .ccv-trial__box { stroke-dasharray: 3 3; fill: var(--ccv-past, #eef0ec); }
.ccv-trial__coin {
  fill: var(--ccv-ink, #1f2a24); font-size: 16px; font-weight: 800;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-trial.is-win .ccv-trial__coin { fill: var(--ccv-gold, #c2872f); }
.ccv-trial__expr {
  fill: var(--ccv-muted, #657168); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-trial.is-win .ccv-trial__expr { fill: var(--ccv-gold, #c2872f); font-weight: 700; }
.ccv-trial__cap {
  fill: var(--ccv-dim, #9aa39c); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.ccv-banner__box {
  fill: var(--ccv-banner, #f4f3ef); stroke: var(--ccv-line, #c3c9c2); stroke-width: 1.5;
}
.ccv-banner__text {
  fill: var(--ccv-hot, #a45f45); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-banner__text.is-ok { fill: var(--ccv-ok, #3f6b57); }

.ccv-panel__box {
  fill: var(--ccv-fill, #ffffff); stroke: var(--ccv-line, #c3c9c2); stroke-width: 1.5;
}
.ccv-panel__label {
  fill: var(--ccv-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-panel__num {
  fill: var(--ccv-ink, #1f2a24); font-size: 19px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-panel__num.is-fresh { fill: var(--ccv-gold, #c2872f); }
.ccv-panel__num.is-final { fill: var(--ccv-ok, #3f6b57); }
.ccv-panel__num.is-dead { fill: var(--ccv-dim, #9aa39c); }

.ccv-phase__text {
  fill: var(--ccv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function w(){if(document.getElementById(d))return;let e=document.createElement(`style`);e.id=d,e.textContent=C,document.head.appendChild(e)}var T=e=>e===f?`∞`:String(e);function E(a,o={}){if(!a||a.dataset.coinchangeMounted===`1`)return{destroy(){}};a.dataset.coinchangeMounted=`1`,w();let s=u(o),c=o.autoplay!==!1,l=s[0].coins,C=s[0].amount,E=r,D=document.createElement(`div`);D.className=`viz ccv`;let O=document.createElement(`div`);O.className=`viz__stage`,D.appendChild(O);let k=E(`svg`,{class:`viz__svg ccv__svg`,viewBox:`0 0 660 338`,role:`img`,"aria-label":`零钱兑换 LC322 推演动画`});O.appendChild(k);let A=E(`g`,{}),j=E(`g`,{});k.appendChild(A),k.appendChild(j);let M=E(`text`,{class:`ccv-note`,x:26,y:p});M.textContent=`正序推进金额：来源格下标更小、可能已用过这枚硬币`,j.appendChild(M);let N=E(`text`,{class:`ccv-note ccv-note--r`,x:634,y:p});N.textContent=`硬币 [${l.join(`, `)}] · 目标 ${C}`,j.appendChild(N);let P=C+1,F=Math.min(52,Math.floor((x-(P-1)*5)/Math.max(1,P))),I=(660-(P*F+(P-1)*5))/2,L=[];for(let e=0;e<=C;e+=1){let t=I+e*(F+5),n=E(`g`,{class:`ccv-cell`});n.appendChild(E(`rect`,{class:`ccv-cell__box`,x:t,y:ee,width:F,height:te,rx:6}));let r=E(`text`,{class:`ccv-cell__val`,x:t+F/2,y:72});n.appendChild(r);let i=E(`text`,{class:`ccv-cell__idx`,x:t+F/2,y:91});i.textContent=String(e),n.appendChild(i),A.appendChild(n),L.push({g:n,val:r,cx:t+F/2,x:t})}let R=E(`path`,{class:`ccv-arc`,d:``}),z=E(`path`,{class:`ccv-arc__head`,d:``});j.append(R,z);let B=E(`text`,{class:`ccv-trial__cap`,x:26,y:m-2});B.setAttribute(`text-anchor`,`start`),j.appendChild(B);let V=l.length,H=Math.min(160,Math.floor((x-(V-1)*10)/Math.max(1,V))),U=(660-(V*H+(V-1)*10))/2,W=l.map((e,t)=>{let n=U+t*(H+10),r=E(`g`,{class:`ccv-trial`});r.appendChild(E(`rect`,{class:`ccv-trial__box`,x:n,y:m,width:H,height:h,rx:7}));let i=E(`text`,{class:`ccv-trial__coin`,x:n+H/2,y:136});i.textContent=String(e),r.appendChild(i);let a=E(`text`,{class:`ccv-trial__expr`,x:n+H/2,y:154});return r.appendChild(a),j.appendChild(r),{g:r,coin:i,expr:a}});j.appendChild(E(`rect`,{class:`ccv-banner__box`,x:26,y:g,width:608,height:_,rx:9}));let G=E(`text`,{class:`ccv-banner__text`,x:660/2,y:206});j.appendChild(G),j.appendChild(E(`rect`,{class:`ccv-panel__box`,x:26,y:v,width:608,height:y,rx:9}));let K=(e,t)=>{let n=E(`text`,{class:`ccv-panel__label`,x:t,y:257});n.textContent=e;let r=E(`text`,{class:`ccv-panel__num`,x:t,y:279});return j.append(n,r),r},re=K(`金额 a`,660/2-190),q=K(`dp[a]`,660/2-65),ie=K(`fromCoin`,395),J=K(`result`,520),Y=E(`text`,{class:`ccv-phase__text`,x:660/2,y:b});j.appendChild(Y);let X=document.createElement(`p`);X.className=`viz__desc`,X.setAttribute(`aria-live`,`polite`);function ae(t,n){if(!n)return;let r=new Set;if(n.phase===`trace`){let e=C;for(let t of n.picked)r.add(e),e-=t;r.add(0)}if(L.forEach((e,t)=>{let i=[`ccv-cell`],a=t===n.a,o=n.sourceIdx!==null&&t===n.sourceIdx;a?i.push(`is-target`):o?i.push(`is-source`):n.phase===`trace`&&r.has(t)?i.push(`is-locked`):n.phase===`fill`&&t<n.a&&i.push(`is-past`),n.dp[t]===f&&i.push(`is-unreach`),e.g.setAttribute(`class`,i.join(` `)),e.val.textContent=T(n.dp[t])}),n.sourceIdx!==null&&n.sourceIdx!==n.a){let e=L[n.sourceIdx].cx,t=L[n.a].cx;R.setAttribute(`d`,`M ${e} 100 Q ${(e+t)/2} ${ne} ${t} 101`);let r=t>e?-1:1;z.setAttribute(`d`,`M ${t} 101 L ${t+r*6} 95 L ${t-r*6} 95 Z`)}else R.setAttribute(`d`,``),z.setAttribute(`d`,``);if(n.phase===`fill`?(B.textContent=`试每一枚当"最后一枚"：`,W.forEach((e,t)=>{let r=n.trials[t];e.g.style.display=``,e.g.setAttribute(`class`,`ccv-trial`+(r.ok?` is-win`:r.idx<0||!r.reachable?` is-dead`:``)),e.coin.textContent=String(r.coin),e.expr.textContent=r.idx<0?`${r.coin} > ${n.a} 跳过`:`dp[${r.idx}]+1 = ${T(r.value)}`})):n.phase===`trace`?(B.textContent=`前驱链已锁定：`,W.forEach((e,t)=>{let r=n.picked[t];if(r===void 0){e.g.style.display=`none`;return}e.g.style.display=``,e.g.setAttribute(`class`,`ccv-trial is-win`),e.coin.textContent=String(r),e.expr.textContent=`第 ${t+1} 枚`})):(B.textContent=``,W.forEach(e=>{e.g.style.display=`none`})),n.phase===`fill`){let e=n.trials.filter(e=>e.idx>=0).map(e=>`dp[${e.idx}]+1=${T(e.value)}`);G.textContent=`dp[${n.a}] = min(${e.join(`, `)}) = ${T(n.dp[n.a])}`,G.setAttribute(`class`,`ccv-banner__text`+(n.fromCoin===null?``:` is-ok`))}else n.phase===`trace`?(G.textContent=`回溯：dp[${n.a}] = dp[${n.sourceIdx}] + 1 = ${T(n.dp[n.sourceIdx])} + 1 = ${T(n.dp[n.a])}`,G.setAttribute(`class`,`ccv-banner__text is-ok`)):n.phase===`done`?(G.textContent=n.result===-1?`答案 = -1：dp[${C}] = ∞，任何组合都凑不出`:`答案 = ${n.result}：${n.combination.join(` + `)} = ${C}`,G.setAttribute(`class`,`ccv-banner__text`+(n.result===-1?``:` is-ok`))):(G.textContent=`开局：dp[0] = 0，其余全是 ∞`,G.setAttribute(`class`,`ccv-banner__text`));re.textContent=n.a<0?`—`:String(n.a),q.textContent=n.a<0?T(n.dp[C]):T(n.dp[n.a]),q.setAttribute(`class`,`ccv-panel__num`+(n.a>=0&&n.dp[n.a]!==f?` is-fresh`:``)+(n.a>=0&&n.dp[n.a]===f?` is-dead`:``)+(n.phase===`done`&&n.result!==-1?` is-final`:``)),ie.textContent=n.phase===`fill`?n.fromCoin===null?`—`:String(n.fromCoin):n.traceCoin===null?`—`:String(n.traceCoin),J.textContent=String(n.result),J.setAttribute(`class`,`ccv-panel__num`+(n.phase===`done`?n.result===-1?` is-dead`:` is-final`:``)),n.phase===`init`?Y.textContent=`dp[x] = 凑出金额 x 的最少硬币枚数`:n.phase===`fill`?Y.textContent=n.fromCoin===null?`这枚金额此刻还凑不出 → 保持 ∞`:`dp[${n.a}] 由硬币 ${n.fromCoin} 从 dp[${n.sourceIdx}] 转移而来`:n.phase===`trace`?Y.textContent=`顺 chosen 前驱表走回 dp[0]，路径就是最优组合`:Y.textContent=n.result===-1?`∞ 在 min 里一路沉底，最后原样返回`:`只记枚数还原不出组合 —— 前驱表才带得回硬币`,e(X,n.desc)}D.appendChild(X);let Z=i();D.appendChild(Z.root),a.textContent=``,a.appendChild(D),n();let oe=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:s,controls:Z,intervalMs:S,onRender:ae});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return c&&!oe&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(D)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.coinchangeMounted,document.getElementById(d)?.remove()}}}export{E as mountCoinChange};