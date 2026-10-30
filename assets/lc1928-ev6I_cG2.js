import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[5,1,2,20,20,3],o=[[0,1,2],[1,2,2],[2,5,2],[0,3,1],[3,4,1],[4,5,1]],s=5,c=1/0;function l(e={}){let t=Array.isArray(e.fees)&&e.fees.length>=2?e.fees:e.fees===void 0?void 0:e.fees,n;n=Array.isArray(t)&&t.length>=2?t.map(e=>typeof e==`number`&&Number.isFinite(e)&&e>=0?Math.trunc(e):0):[...a];let r=n.length,i=Array.isArray(e.edges)?e.edges:[],c=[];for(let e of i){if(!Array.isArray(e)||e.length<3)continue;let[t,n,i]=e;!Number.isInteger(t)||!Number.isInteger(n)||!Number.isInteger(i)||t<0||t>=r||n<0||n>=r||t===n||i<1||c.push([t,n,i])}let l=o.filter(([e,t])=>e<r&&t<r).map(e=>[...e]),u=Number.isInteger(e.maxTime)&&e.maxTime>=1?e.maxTime:s;return{n:r,fees:n,edges:c.length>0?c:l,maxTime:u}}function u(e={}){let{n:t,fees:n,edges:r,maxTime:i}=l(e),a=t-1,o=Array.from({length:t},()=>[]);r.forEach(([e,t,n])=>{o[e].push({to:t,time:n}),o[t].push({to:e,time:n})});let s=Array.from({length:i+1},()=>Array(t).fill(c)),u=Array.from({length:i+1},()=>Array(t).fill(null));s[0][0]=n[0];let d=a===0?n[0]:c,f=a===0?0:-1,p=0,m=[],h=e=>e.map(e=>e.slice()),g=(e,o,l={})=>{m.push({phase:e,desc:o,n:t,maxTime:i,fees:[...n],edges:r.map(e=>[...e]),target:a,t:-1,v:-1,u:-1,et:0,arr:-1,from:c,cand:c,old:c,improved:!1,prevDp:h(s),dp:h(s),best:d,bestT:f,cutCount:p,answer:d===c?-1:d,chain:[],cities:[],done:e===`done`,...l})};g(`init`,`给 ${t} 座城市（\`0..${a}\`）、无向边 ${r.map(([e,t,n])=>`\`${e}—${t}(${n})\``).join(`、`)}，以及每座城市的通行费 \`[${n.join(`, `)}]\`。每条边**只有时间、没有花费**；每**经过**一座城市要付一次它的通行费，**含起点与终点**。问从 \`0\` 走到 \`${a}\`、总时间 **≤ maxTime = ${i}** 时，最少要付多少通行费。定义分层图的格子 \`dp[t][v]\` = **恰好在时刻 \`t\` 到达城市 \`v\`** 的最小通行费：底座 \`dp[0][0] = fees[0] = ${n[0]}\`（起点也要付），其余全是 \`∞\`。按 \`t\` **正序**逐层向外松弛所有边 —— 已经知道"t 时刻在 v、花了多少"，再走一条耗时 \`et\` 的边到 \`u\`，就要多付 \`u\` 的通行费：\`dp[t + et][u] = min( dp[t + et][u], dp[t][v] + fees[u] )\`。答案取 \`min over t ≤ ${i} of dp[t][${a}]\`（都到不了就是 -1）。还有一条：\`arr = t + et > maxTime\` 的松弛**直接剪掉、不进入后续层** —— 时间只能往前走、不会回头，迟到就是迟到（动画里这些被剪掉的松弛不进帧，只累加到统计面板的"已剪枝"计数上）。**为什么非要二维**：一维的 \`dp[v]\` 只记"到 v 的最少花费"，会忘掉"是第几时刻到的" —— 而时间不能被压缩，"便宜但超时"和"贵但达标"是两条不能互相顶替的路。`);for(let e=0;e<=i;e+=1)for(let r=0;r<t;r+=1)if(s[e][r]!==c)for(let{to:t,time:l}of o[r]){let o=e+l,m=s[e][r],_=m+n[t];if(o>i){p+=1;continue}let v=s[o][t],y=_<v,b=h(s);y&&(s[o][t]=_,u[o][t]={t:e,v:r},t===a&&_<d&&(d=_,f=o));let x=v===c?`∞（这一格从没到过）`:`\`${v}\``;g(`relax`,y?`城市 **${r}** 在 **t = ${e}** 的花费是 \`${m}\`。走边 \`${r} → ${t}\`（耗 **${l}** 分钟）在 **t' = ${o}** 到达城市 **${t}**，加上它的通行费 \`fees[${t}] = ${n[t]}\` 得 \`${m} + ${n[t]} = ${_}\`。原来这一格是 ${x}，**${_} < ${v===c?`∞`:v}**，于是刷新成 \`${_}\``+(t===a?`，同时把当前答案压到 \`${d}\`（**min over t of dp[t][${a}]** 又降了一档）。`:`。`):`城市 **${r}** 在 **t = ${e}** 的花费是 \`${m}\`。走边 \`${r} → ${t}\`（耗 **${l}** 分钟）在 **t' = ${o}** 到达城市 **${t}**，算得 \`${m} + ${n[t]} = ${_}\`，但这一格已经是 ${x}、**不比我更差**。这一趟走得更晚还更贵，作废，格子保持原值。`,{t:e,v:r,u:t,et:l,arr:o,from:m,cand:_,old:v,improved:y,prevDp:b})}let _=[];if(f>=0&&s[f][a]!==c){let e=f,t=a,n=[{t:e,v:t}],r=i+2;for(;!(e===0&&t===0)&&r>0;){let i=u[e][t];if(!i)break;n.push({t:i.t,v:i.v}),e=i.t,t=i.v,--r}n.reverse(),_.push(...n)}let v=_.map(e=>e.v);return g(`done`,(d===c?`扫描完所有时刻，\`dp[t][${a}]\` 在 \`t ≤ ${i}\` 内始终是 \`∞\` —— **返回 -1**：在时间窗内根本走不到终点。注意这不是"最贵"的问题，是"无解"。`:`返回 **${d}**：在 \`t ≤ ${i}\` 里，\`dp[t][${a}]\` 的最小值出现在 \`t = ${f}\`，值 \`${d}\`。沿前驱表从 \`(${f}, ${a})\` 回溯到 \`(0, 0)\`，状态链 \`${_.map(e=>`(${e.t},${e.v})`).join(` → `)}\`，城市序列 \`${v.join(` → `)}\`，途中共付 \`${n[v[0]]}${v.slice(1).map(e=>` + ${n[e]}`).join(``)} = ${d}\` 的通行费。`)+'回头对照 LC 322 零钱兑换：那里 `dp[x]` 是**一维**的（凑出金额 x 的最少枚数），因为"枚数"可以无限累加、彼此同质；而这里**时间是一个不能压缩的维度**，"什么时候到"决定了"还能不能赶上截止"，所以状态必须把时刻一并带上 —— 这正是**分层图**与普通最短路的区别。',{chain:_,cities:v,done:!0}),m}var d=`lc1928-styles`,f=1e3,p=680,m=62,h=22,g=52,_=66,v=76,y=38,b=8,x=8,S=44,C=58,w=`
.lv8 { display: flex; flex-direction: column; gap: 14px; }
.lv8__svg { width: 100%; height: auto; display: block; }

.lv8-note {
  fill: var(--lv8-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-note--r { text-anchor: end; }

.lv8-lbl {
  fill: var(--lv8-muted, #657168); font-size: 11.5px;
  text-anchor: end; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-corner {
  fill: var(--lv8-dim, #9aa39c); font-size: 10.5px;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-hd1 {
  fill: var(--lv8-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-hd2 {
  fill: var(--lv8-dim, #9aa39c); font-size: 10px;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-hd1.is-tgt { fill: var(--lv8-gold, #c2872f); }
.lv8-hd2.is-tgt { fill: var(--lv8-gold, #c2872f); }

.lv8-band { fill: var(--lv8-gold-fill, #fdf3e3); opacity: 0.62; }

.lv8-cell__box {
  fill: var(--lv8-fill, #ffffff);
  stroke: var(--lv8-line, #c3c9c2);
  stroke-width: 1.5;
}
.lv8-cell__val {
  fill: var(--lv8-ink, #1f2a24);
  font-weight: 700; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 还没到达的格子：虚线 + 灰 ∞ */
.lv8-cell.is-inf .lv8-cell__box {
  fill: var(--lv8-dim-fill, #f6f5f1);
  stroke-dasharray: 4 3;
}
.lv8-cell.is-inf .lv8-cell__val { fill: var(--lv8-dim, #9aa39c); font-weight: 500; }
/* 已到达：白底实值 */
.lv8-cell.is-val .lv8-cell__box { fill: var(--lv8-ok-fill, #eef5f1); stroke: var(--lv8-ok, #3f6b57); }
.lv8-cell.is-val .lv8-cell__val { fill: var(--lv8-ok, #3f6b57); }
/* 底座 dp[0][0] */
.lv8-cell.is-base .lv8-cell__box { stroke: var(--lv8-gold, #c2872f); stroke-width: 3; }
/* 本帧的源格 */
.lv8-cell.is-cur .lv8-cell__box { stroke: var(--lv8-hot, #a45f45); stroke-width: 3.4; }
/* 本帧刷新的目标格 */
.lv8-cell.is-fresh .lv8-cell__box {
  fill: var(--lv8-gold-fill, #fdf3e3);
  stroke: var(--lv8-gold, #c2872f);
  stroke-width: 3.4;
}
.lv8-cell.is-fresh .lv8-cell__val { fill: var(--lv8-gold, #c2872f); }
/* 本帧看了但没改进的目标格 */
.lv8-cell.is-dup .lv8-cell__box { stroke: var(--lv8-hot, #a45f45); stroke-width: 2.4; stroke-dasharray: 4 3; }
/* done 帧回溯出的最优链 */
.lv8-cell.is-chain .lv8-cell__box { fill: var(--lv8-gold-fill, #fdf3e3); stroke: var(--lv8-gold, #c2872f); stroke-width: 2.4; }
.lv8-cell.is-chain .lv8-cell__val { fill: var(--lv8-gold, #c2872f); }

.lv8-edge__line {
  stroke: var(--lv8-hot, #a45f45); stroke-width: 2; fill: none;
  stroke-dasharray: 5 4;
}
.lv8-edge__head { fill: var(--lv8-hot, #a45f45); }

.lv8-ring {
  fill: none; stroke: var(--lv8-gold, #c2872f); stroke-width: 2.4;
  stroke-dasharray: 5 4; opacity: 0;
}
.lv8-ring.is-on { opacity: 1; }

.lv8-banner__box {
  fill: var(--lv8-banner, #f4f3ef);
  stroke: var(--lv8-line, #c3c9c2);
  stroke-width: 1.5;
}
.lv8-banner__text {
  fill: var(--lv8-hot, #a45f45); font-size: 13.5px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-banner__text.is-ok { fill: var(--lv8-ok, #3f6b57); }
.lv8-banner__text.is-gold { fill: var(--lv8-gold, #c2872f); }

.lv8-panel__box {
  fill: var(--lv8-fill, #ffffff);
  stroke: var(--lv8-line, #c3c9c2);
  stroke-width: 1.5;
}
.lv8-panel__label {
  fill: var(--lv8-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-panel__num {
  fill: var(--lv8-ink, #1f2a24); font-size: 16px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-panel__num.is-gold { fill: var(--lv8-gold, #c2872f); }
.lv8-panel__num.is-ok { fill: var(--lv8-ok, #3f6b57); }
.lv8-panel__num.is-dead { fill: var(--lv8-dim, #9aa39c); }

.lv8-phase__text {
  fill: var(--lv8-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function ee(){if(document.getElementById(d))return;let e=document.createElement(`style`);e.id=d,e.textContent=w,document.head.appendChild(e)}var te=e=>e===1/0?`∞`:String(e);function T(a,o={}){if(!a||a.dataset.lc1928Mounted===`1`)return{destroy(){}};a.dataset.lc1928Mounted=`1`,ee();let s=u(o),{n:c,maxTime:l,fees:w,target:T}=s[0],E=l+1,D=r,O=document.createElement(`div`);O.className=`viz lv8`;let k=document.createElement(`div`);k.className=`viz__stage`,O.appendChild(k);let ne=p-m-26,A=Math.min(84,Math.floor((ne-(c-1)*x)/c)),re=m+(ne-(c*A+(c-1)*x))/2,j=e=>re+e*(A+x),M=e=>v+e*46,N=E*y+(E-1)*b,P=v+N+16,F=P+S+14,I=F+C+18,ie=I+22,ae=Math.max(10,Math.min(16,Math.round(A/7.2))),L=D(`svg`,{class:`viz__svg lv8__svg`,viewBox:`0 0 ${p} ${ie}`,role:`img`,"aria-label":`规定时间内到达终点的最小花费 LC1928 分层图推演动画`}),oe=D(`g`,{}),R=D(`g`,{}),z=D(`g`,{});L.append(oe,R,z),k.appendChild(L);let B=D(`text`,{class:`lv8-note`,x:26,y:h});B.textContent=`dp[t][v] = 恰好在时刻 t 到达城市 v 的最小通行费`,z.appendChild(B);let V=D(`text`,{class:`lv8-note lv8-note--r`,x:p-26,y:h});V.textContent=`${c} 座城市 · maxTime = ${l}`,z.appendChild(V),oe.appendChild(D(`rect`,{class:`lv8-band`,x:j(T)-3,y:v-4,width:A+6,height:N+8,rx:9}));let H=D(`text`,{class:`lv8-corner`,x:m-16,y:g});H.textContent=`t \\ v`,z.appendChild(H);for(let e=0;e<c;e+=1){let t=e===T,n=D(`text`,{class:`lv8-hd1${t?` is-tgt`:``}`,x:j(e)+A/2,y:g});n.textContent=`城市 ${e}`;let r=D(`text`,{class:`lv8-hd2${t?` is-tgt`:``}`,x:j(e)+A/2,y:_});r.textContent=`费 ${w[e]}`,z.append(n,r)}for(let e=0;e<E;e+=1){let t=D(`text`,{class:`lv8-lbl`,x:m,y:M(e)+y/2});t.textContent=`t = ${e}`,z.appendChild(t)}let U=[];for(let e=0;e<E;e+=1){let t=[];for(let n=0;n<c;n+=1){let r=D(`g`,{class:`lv8-cell`});r.appendChild(D(`rect`,{class:`lv8-cell__box`,x:j(n),y:M(e),width:A,height:y,rx:6}));let i=D(`text`,{class:`lv8-cell__val`,x:j(n)+A/2,y:M(e)+y/2,style:`font-size: ${ae}px`});r.appendChild(i),R.appendChild(r),t.push({g:r,val:i})}U.push(t)}let W=D(`g`,{}),G=D(`path`,{class:`lv8-edge__line`,d:``}),K=D(`polygon`,{class:`lv8-edge__head`,points:``});W.append(G,K),W.style.display=`none`,z.appendChild(W);let q=D(`rect`,{class:`lv8-ring`,x:0,y:0,width:A+10,height:48,rx:9});z.appendChild(q),z.appendChild(D(`rect`,{class:`lv8-banner__box`,x:26,y:P,width:p-52,height:S,rx:9}));let J=D(`text`,{class:`lv8-banner__text`,x:p/2,y:P+S/2});z.appendChild(J),z.appendChild(D(`rect`,{class:`lv8-panel__box`,x:26,y:F,width:p-52,height:C,rx:9}));let Y=(e,t)=>{let n=p/2+(t-4/2)*116,r=D(`text`,{class:`lv8-panel__label`,x:n,y:F+16});r.textContent=e;let i=D(`text`,{class:`lv8-panel__num`,x:n,y:F+40});return z.append(r,i),i},se=Y(`t`,0),ce=Y(`v → u`,1),le=Y(`from → cand`,2),ue=Y(`已剪枝`,3),de=Y(`答案`,4),X=D(`text`,{class:`lv8-phase__text`,x:p/2,y:I});z.appendChild(X);let Z=document.createElement(`p`);Z.className=`viz__desc`,Z.setAttribute(`aria-live`,`polite`);function fe(t,n){if(!n)return;let{phase:r,dp:i,t:a,v:o,u:s,arr:c,from:u,cand:d,improved:f,cutCount:p,best:m,bestT:h,answer:g,chain:_}=n,v=r===`relax`,b=r===`done`,x=new Set((b?_:[]).map(e=>`${e.t}:${e.v}`));if(U.forEach((e,t)=>{e.forEach((e,n)=>{let r=i[t][n],l=[`lv8-cell`];r===1/0?l.push(`is-inf`):l.push(`is-val`),t===0&&n===0&&l.push(`is-base`),v&&t===a&&n===o&&l.push(`is-cur`),v&&t===c&&n===s&&l.push(f?`is-fresh`:`is-dup`),x.has(`${t}:${n}`)&&l.push(`is-chain`),e.g.setAttribute(`class`,l.join(` `)),e.val.textContent=te(r)})}),v){let e=j(o)+A/2,t=M(a)+y,n=j(s)+A/2,r=M(c)-1,i=r-t;G.setAttribute(`d`,`M ${e.toFixed(1)} ${t.toFixed(1)} C ${e.toFixed(1)} ${(t+i*.45).toFixed(1)}, ${n.toFixed(1)} ${(r-i*.45).toFixed(1)}, ${n.toFixed(1)} ${(r-9).toFixed(1)}`),K.setAttribute(`points`,`${n.toFixed(1)},${r.toFixed(1)} ${(n-5.5).toFixed(1)},${(r-9).toFixed(1)} ${(n+5.5).toFixed(1)},${(r-9).toFixed(1)}`),W.style.display=``}else W.style.display=`none`;h>=0&&i[h][T]!==1/0?(q.setAttribute(`x`,String(j(T)-5)),q.setAttribute(`y`,String(M(h)-5)),q.setAttribute(`class`,`lv8-ring is-on`)):q.setAttribute(`class`,`lv8-ring`),v?(J.textContent=`dp[${c}][${s}] = min( dp[${c}][${s}] , dp[${a}][${o}] + fees[${s}] ) = min( ${n.old===1/0?`∞`:n.old} , ${u} + ${w[s]} ) = ${te(i[c][s])}`,J.setAttribute(`class`,`lv8-banner__text`+(f?` is-gold`:``))):b?(J.textContent=g===-1?`答案 -1：t ≤ ${l} 内 dp[t][${T}] 始终是 ∞`:`答案 = ${g}：dp[${h}][${T}] = ${g}（t ≤ ${l} 中的最小值）`,J.setAttribute(`class`,`lv8-banner__text`+(g===-1?``:` is-ok`))):(J.textContent=`dp[0][0] = fees[0] = ${w[0]}，其余全是 ∞　→ 按 t 正序逐层松弛所有边`,J.setAttribute(`class`,`lv8-banner__text`)),se.textContent=v?String(a):b?`—`:`0`,se.setAttribute(`class`,`lv8-panel__num`),ce.textContent=v?`${o} → ${s}`:`—`,ce.setAttribute(`class`,`lv8-panel__num`),le.textContent=v?`${u} → ${d}`:`—`,le.setAttribute(`class`,`lv8-panel__num`+(v?` is-gold`:``)),ue.textContent=String(p),ue.setAttribute(`class`,`lv8-panel__num`+(p>0?` is-dead`:``)),de.textContent=String(g),de.setAttribute(`class`,`lv8-panel__num`+(b?g===-1?` is-dead`:` is-ok`:m===1/0?` is-dead`:``)),r===`init`?X.textContent=`底座只有一格：dp[0][0] = fees[0]（起点也要付自己的通行费）`:v?X.textContent=f?`更便宜 → 刷新 dp[${c}][${s}] = ${d}${s===T?`，并把答案压到 `+m:``}`:`这一趟更晚也更贵（${d} ≥ ${n.old===1/0?`∞`:n.old}），作废，格子保持原值`:g===-1?X.textContent=`时间窗内到不了终点 —— 不是"最贵"，是"无解"，返回 -1`:X.textContent=`答案不在 dp[0][n-1]，而是 min over t ≤ maxTime of dp[t][n-1]`,e(Z,n.desc)}O.appendChild(Z);let pe=i();O.appendChild(pe.root),a.textContent=``,a.appendChild(O),n();let me=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:s,controls:pe,intervalMs:f,onRender:fe});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return o.autoplay!==!1&&!me&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(O)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.lc1928Mounted,document.getElementById(d)?.remove()}}}export{T as mountLc1928};