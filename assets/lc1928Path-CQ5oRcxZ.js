import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[5,1,2,20,20,3],o=[[0,1,2],[1,2,2],[2,5,2],[0,3,1],[3,4,1],[4,5,1]],s=5,c=1/0;function l(e={}){let t=Array.isArray(e.fees)&&e.fees.length>=2?e.fees:void 0,n=Array.isArray(t)?t.map(e=>typeof e==`number`&&Number.isFinite(e)&&e>=0?Math.trunc(e):0):[...a],r=n.length,i=Array.isArray(e.edges)?e.edges:[],c=[];for(let e of i){if(!Array.isArray(e)||e.length<3)continue;let[t,n,i]=e;!Number.isInteger(t)||!Number.isInteger(n)||!Number.isInteger(i)||t<0||t>=r||n<0||n>=r||t===n||i<1||c.push([t,n,i])}let l=o.filter(([e,t])=>e<r&&t<r).map(e=>[...e]),u=Number.isInteger(e.maxTime)&&e.maxTime>=1?e.maxTime:s;return{n:r,fees:n,edges:c.length>0?c:l,maxTime:u}}function u(e,t,n){let r=null;for(let[i,a,o]of e)(i===t&&a===n||i===n&&a===t)&&(r===null||o<r)&&(r=o);return r}function d(e,t){let n=[0];for(let r=1;r<t.length;r+=1){let i=u(e,t[r-1],t[r]);if(i===null)return null;n.push(n[r-1]+i)}return n}function f(e,t,n,r){let i=Array.from({length:e},()=>[]);for(let[e,t,r]of n)i[e].push({to:t,time:r}),i[t].push({to:e,time:r});let a=Array(e).fill(c),o=Array(e).fill(-1),s=Array(e).fill(!1);a[0]=t[0];for(let n=0;n<e;n+=1){let n=-1;for(let t=0;t<e;t+=1)s[t]||a[t]===c||(n===-1||a[t]<a[n])&&(n=t);if(n===-1)break;s[n]=!0;for(let{to:e}of i[n]){if(s[e])continue;let r=a[n]+t[e];r<a[e]&&(a[e]=r,o[e]=n)}}if(a[r]===c)return null;let l=[];for(let e=r;e!==-1;e=o[e])l.push(e);return l.reverse(),l[0]===0?{cities:l,fee:a[r]}:null}function p(e,t,n,r){let i=e-1,a=Array.from({length:e},()=>[]);for(let[e,t,r]of n)a[e].push({to:t,time:r}),a[t].push({to:e,time:r});let o=Array.from({length:r+1},()=>Array(e).fill(c)),s=Array.from({length:r+1},()=>Array(e).fill(null));o[0][0]=t[0];let l=c,u=-1;for(let n=0;n<=r;n+=1)for(let d=0;d<e;d+=1)if(o[n][d]!==c)for(let{to:e,time:c}of a[d]){let a=n+c;if(a>r)continue;let f=o[n][d]+t[e];f<o[a][e]&&(o[a][e]=f,s[a][e]={t:n,v:d},e===i&&f<l&&(l=f,u=a))}if(l===c)return{fee:c,chain:[],bestT:-1};let d=[],f=u,p=i,m=[{t:f,v:p}],h=r+2;for(;!(f===0&&p===0)&&h>0;){let e=s[f][p];if(!e)break;m.push({t:e.t,v:e.v}),f=e.t,p=e.v,--h}return m.reverse(),d.push(...m),{fee:l,chain:d,bestT:u}}function m(e={}){let{n:t,fees:n,edges:r,maxTime:i}=l(e),a=t-1,o=f(t,n,r,a),s=p(t,n,r,i),c=o?(()=>{let e=d(r,o.cities);return e?{cities:[...o.cities],arriveAt:e,fee:o.fee,totalTime:e[e.length-1],valid:e[e.length-1]<=i,found:!0}:null})():null,u=s.chain.length>0?{cities:s.chain.map(e=>e.v),arriveAt:s.chain.map(e=>e.t),fee:s.fee,totalTime:s.chain[s.chain.length-1].t,chain:s.chain.map(e=>({...e}))}:null,m=u?u.fee:-1,h=u?String(u.fee):`-1`,g=[],_=(e,o,s={})=>{g.push({phase:e,desc:o,n:t,maxTime:i,fees:[...n],edges:r.map(e=>[...e]),target:a,cheap:c?{cities:[...c.cities],arriveAt:[...c.arriveAt],fee:c.fee,totalTime:c.totalTime,valid:c.valid,found:!0}:null,best:u?{cities:[...u.cities],arriveAt:[...u.arriveAt],fee:u.fee,totalTime:u.totalTime,chain:u.chain.map(e=>({...e}))}:null,answer:m,cursor:-1,revealedStates:0,done:e===`done`,...s})};if(_(`init`,`动画一把分层图 \`dp[t][v]\` 填好了。这一遍回答两件事：**(1) 只图便宜会怎样** —— 完全不看时间、只按通行费找最便宜的路，它会走哪条、要花多久？**(2) 守住 maxTime = ${i} 的最优路是哪条** —— 然后从最优终点状态沿**前驱表**回退，把城市序列与每个到达时刻一并还原出来。注意 dp 表本身只记了**花费**，路藏在 \`prev[arr][u] = (t, v)\` 里："我在 t' 时刻、城市 u，是从哪个状态走过来的"。`),c&&_(`cheap`,c.valid?`先看**无视时间窗**的贪心：只按通行费找最便宜的路，得到 \`${c.cities.join(` → `)}\`，通行费 \`${c.fee}\`、耗时 **${c.totalTime}** —— 恰好 \`≤ maxTime = ${i}\`，所以这一条**本身就是可行解**（这说明本题里"最便宜"和"来得及"这回碰巧不冲突）。`:`先看**无视时间窗**的贪心：只按通行费找最便宜的路，得到 \`${c.cities.join(` → `)}\`，通行费只要 \`${c.fee}\` —— 比后面那条便宜得多。可它要花 **${c.totalTime}** 分钟，\`${c.totalTime} > maxTime = ${i}\`，**超时，直接作废**。这就是本题的命门：**便宜 ≠ 来得及**。如果只用一个一维的 \`dp[v]\`（到 v 的最少花费），就会把这条便宜路记成"到终点的最优解"，把时间这一维整个漏掉 —— 于是得到错误的答案。`,{cheap:c}),u){_(`best`,`再看**守住时间窗**的最优路：在 \`t ≤ ${i}\` 的所有状态里，\`dp[t][${a}]\` 的最小值出现在 **\`(t = ${u.totalTime}, 城市 ${a})\`**，价值 \`${u.fee}\`。从它沿前驱回退，得到的城市序列是 \`${u.cities.join(` → `)}\`，到达时刻 \`${u.arriveAt.join(`, `)}\`，共 **${u.totalTime}** 分钟。`+(c&&!c.valid?`对照上面那条：它贵得多（\`${u.fee}\` vs \`${c.fee}\`），却是**唯一来得及**的 —— 时间窗一卡，"最便宜"就必须让位给"刚好赶得上"。`:`它比贪心那条不可能更便宜（\`${u.fee} ≤ ${c?c.fee:u.fee}\`），因为它在"守时"的基础上还要最省。`),{best:u});for(let e=u.chain.length-1;e>=0;--e){let t=u.chain[e],r=e>0?u.chain[e-1]:null;_(`back`,(e===u.chain.length-1?`回退的起点是终点状态 \`(t = ${t.t}, 城市 ${t.v})\` —— 也就是 \`dp[${t.t}][${t.v}] = ${u.fee}\` 那一格。`:`回退到状态 \`(t = ${t.t}, 城市 ${t.v})\`。`)+(r?`它的前驱是 \`(t = ${r.t}, 城市 ${r.v})\`：也就是说，是在 **t = ${r.t}** 从城市 ${r.v} 走了一条耗时 **${t.t-r.t}** 的边过来的（\`${t.t-r.t} = ${t.t} - ${r.t}\`）。`:`它是链的源头 \`(0, 0)\` —— \`dp[0][0] = fees[0] = ${n[0]}\`，起点也要付自己的通行费。到达 \`(0, 0)\` 就退完了。`),{cursor:e,revealedStates:u.chain.length-e})}}return _(`done`,(u?`还原完毕：\`${u.cities.join(` → `)}\`，到达时刻 \`${u.arriveAt.join(`, `)}\`，总时间 \`${u.totalTime} ≤ ${i}\`，通行费 \`${u.cities.map(e=>n[e]).join(` + `)} = ${u.fee}\`。回头看两层对照：**隐藏时间的贪心**给出 \`${c?`${c.fee}（超时 ${c.totalTime}）`:`无`}\`，**守住时间窗的答案**是 \`${h}\` —— 一维 dp 会把前者当成答案，而分层图（把时刻并进状态）才拿得到后者。路不是 dp 值直接给的，是从**前驱表**一段段退回来的。`:`扫描完所有时刻，\`dp[t][${a}]\` 在 \`t ≤ ${i}\` 内始终是 \`∞\`：**没有可行路**。此时不管贪心那条便宜路多便宜，只要它超时，答案就是 \`-1\` —— **可行性与最优性是两个问题**：先要"走得通且不超时"，才谈得上"最便宜"。`)+'这也正是 **LC 1928** 与 **LC 743**（网络延迟时间）、**LC 1631**（最小体力消耗路径）那类"最短路"的分界：它们的代价维度可以直接相加比较，而这里**时间是一个硬约束**，所以状态 `(t, v)` 必须二维展开。',{done:!0,cursor:0,revealedStates:u?u.chain.length:0}),g}var h=`lc1928path-styles`,g=1150,_=680,v=26,y=22,b=176,x=288,S=50,C=358,w=368,T=38,E=424,D=44,ee=502,O=`
.lv8p { display: flex; flex-direction: column; gap: 14px; }
.lv8p__svg { width: 100%; height: auto; display: block; }

.lv8p-note {
  fill: var(--lv8p-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-note--r { text-anchor: end; }
.lv8p-lbl {
  fill: var(--lv8p-muted, #657168); font-size: 11.5px;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lv8p-edge { stroke: var(--lv8p-line, #c3c9c2); stroke-width: 2; fill: none; }
.lv8p-arrow { fill: var(--lv8p-line, #c3c9c2); stroke: none; }
.lv8p-path { stroke-width: 4; fill: none; opacity: 0; stroke-linecap: round; }
.lv8p-path.is-cheap { stroke: var(--lv8p-hot, #a45f45); }
.lv8p-path.is-best { stroke: var(--lv8p-ok, #3f6b57); }
.lv8p-path.is-on { opacity: 1; }
.lv8p-wt {
  fill: var(--lv8p-muted, #657168); font-size: 10px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lv8p-node__circle { stroke: var(--lv8p-line, #b9c1b8); stroke-width: 2; fill: var(--lv8p-fill, #ffffff); }
.lv8p-node__num {
  fill: var(--lv8p-ink, #1f2a24); font-size: 17px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-node__fee {
  fill: var(--lv8p-dim, #9aa39c); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-node.is-src .lv8p-node__circle { stroke: var(--lv8p-gold, #c2872f); stroke-width: 3.5; }
.lv8p-node.is-cheap .lv8p-node__circle { fill: #f6e6e0; stroke: var(--lv8p-hot, #a45f45); stroke-width: 3; }
.lv8p-node.is-best .lv8p-node__circle { fill: var(--lv8p-ok-fill, #eef5f1); stroke: var(--lv8p-ok, #3f6b57); stroke-width: 3; }
.lv8p-node.is-tail .lv8p-node__circle { stroke: var(--lv8p-gold, #c2872f); stroke-width: 3.5; }

.lv8p-card__box {
  fill: var(--lv8p-banner, #f4f3ef); stroke: var(--lv8p-line, #c3c9c2); stroke-width: 1.5;
}
.lv8p-card.is-hot .lv8p-card__box { stroke: var(--lv8p-hot, #a45f45); stroke-width: 2.4; }
.lv8p-card.is-ok .lv8p-card__box { stroke: var(--lv8p-ok, #3f6b57); stroke-width: 2.4; }
.lv8p-card.is-dim { opacity: 0.5; }
.lv8p-card__title {
  fill: var(--lv8p-muted, #657168); font-size: 11px; font-weight: 700;
  text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-card__main {
  fill: var(--lv8p-ink, #1f2a24); font-size: 12.5px; font-weight: 700;
  text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-card__verdict {
  font-size: 12.5px; font-weight: 800; text-anchor: end; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-card__verdict.is-hot { fill: var(--lv8p-hot, #a45f45); }
.lv8p-card__verdict.is-ok { fill: var(--lv8p-ok, #3f6b57); }
.lv8p-card__verdict.is-dead { fill: var(--lv8p-dim, #9aa39c); }

.lv8p-chip__box { fill: var(--lv8p-fill, #ffffff); stroke: var(--lv8p-line, #c3c9c2); stroke-width: 1.6; }
.lv8p-chip__t {
  fill: var(--lv8p-dim, #9aa39c); font-size: 9.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-chip__v {
  fill: var(--lv8p-ink, #1f2a24); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-chip.is-revealed .lv8p-chip__box { fill: var(--lv8p-ok-fill, #eef5f1); stroke: var(--lv8p-ok, #3f6b57); }
.lv8p-chip.is-revealed .lv8p-chip__v { fill: var(--lv8p-ok, #3f6b57); }
.lv8p-chip.is-cur .lv8p-chip__box { stroke: var(--lv8p-gold, #c2872f); stroke-width: 3; }
.lv8p-chip.is-cur .lv8p-chip__v { fill: var(--lv8p-gold, #c2872f); }
.lv8p-chip.is-hidden { opacity: 0; }

.lv8p-link__line { stroke: var(--lv8p-ok, #3f6b57); stroke-width: 1.6; stroke-dasharray: 3 3; }
.lv8p-link__head { fill: var(--lv8p-ok, #3f6b57); }

.lv8p-banner__box {
  fill: var(--lv8p-banner, #f4f3ef); stroke: var(--lv8p-line, #c3c9c2); stroke-width: 1.5;
}
.lv8p-banner__text {
  fill: var(--lv8p-hot, #a45f45); font-size: 13.5px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-banner__text.is-ok { fill: var(--lv8p-ok, #3f6b57); }

.lv8p-phase__text {
  fill: var(--lv8p-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function te(){if(document.getElementById(h))return;let e=document.createElement(`style`);e.id=h,e.textContent=O,document.head.appendChild(e)}function ne(e,t){let n=Array.from({length:e},()=>[]);for(let[e,r]of t)n[e].push(r),n[r].push(e);let r=Array(e).fill(-1);r[0]=0;let i=[0];for(let e=0;e<i.length;e+=1){let t=i[e];for(let e of n[t])r[e]===-1&&(r[e]=r[t]+1,i.push(e))}let a=0,o=1,s=new Map;for(let t=0;t<e;t+=1)r[t]===-1&&(r[t]=-2);for(let t=0;t<e;t+=1)r[t]>=0&&r[t]>a&&(a=r[t]);for(let t=0;t<e;t+=1)r[t]===-2&&(r[t]=a+1);for(let t=0;t<e;t+=1)s.has(r[t])||s.set(r[t],[]),s.get(r[t]).push(t);for(let e of s.values())o=Math.max(o,e.length);let c=Math.min(170,Math.floor((_-140)/Math.max(1,a))),l=Math.min(80,Math.floor((b-40)/Math.max(1,o-1))),u=Array(e);for(let[e,t]of s)t.sort((e,t)=>e-t),t.forEach((n,r)=>{u[n]={x:_/2+(e-a/2)*c,y:b+(r-(t.length-1)/2)*l}});return u}function k(e,t,n){let r=t.x-e.x,i=t.y-e.y,a=Math.hypot(r,i)||1,o=r/a,s=i/a,c=e.x+o*n,l=e.y+s*n,u=t.x-o*(n+1),d=t.y-s*(n+1),f=-s,p=o,m=u-o*9,h=d-s*9;return{x1:c,y1:l,x2:u,y2:d,head:`${u.toFixed(1)},${d.toFixed(1)} ${(m+f*5).toFixed(1)},${(h+p*5).toFixed(1)} ${(m-f*5).toFixed(1)},${(h-p*5).toFixed(1)}`}}function A(a,o={}){if(!a||a.dataset.lc1928PathMounted===`1`)return{destroy(){}};a.dataset.lc1928PathMounted=`1`,te();let s=m(o),{n:c,maxTime:l,fees:u,edges:d,target:f}=s[0],p=r,b=document.createElement(`div`);b.className=`viz lv8p`;let O=document.createElement(`div`);O.className=`viz__stage`,b.appendChild(O);let A=p(`svg`,{class:`viz__svg lv8p__svg`,viewBox:`0 0 ${_} 524`,role:`img`,"aria-label":`规定时间内到达终点的最小花费 LC1928 便宜路与守时路对照动画`}),j=p(`g`,{}),M=p(`g`,{}),N=p(`g`,{}),P=p(`g`,{});A.append(j,M,N,P),O.appendChild(A);let F=p(`text`,{class:`lv8p-note`,x:26,y});F.textContent=`同一张图：只图便宜的路 vs 守住 maxTime 的路 —— 便宜 ≠ 来得及`,P.appendChild(F);let I=p(`text`,{class:`lv8p-note lv8p-note--r`,x:_-26,y});I.textContent=`maxTime = ${l} · 终点 = 城市 ${f}`,P.appendChild(I);let L=ne(c,d);for(let[e,t,n]of d){let r=k(L[e],L[t],v);j.appendChild(p(`line`,{class:`lv8p-edge`,x1:r.x1,y1:r.y1,x2:r.x2,y2:r.y2})),j.appendChild(p(`polygon`,{class:`lv8p-arrow`,points:r.head}));let i=(L[e].x+L[t].x)/2,a=(L[e].y+L[t].y)/2,o=p(`text`,{class:`lv8p-wt`,x:i.toFixed(1),y:(a-7).toFixed(1)});o.textContent=`${n}分`,P.appendChild(o)}let R={cheap:[],best:[]};for(let e of[`cheap`,`best`])for(let[t,n]of d){let r=k(L[t],L[n],v),i=p(`line`,{class:`lv8p-path is-${e}`,x1:r.x1,y1:r.y1,x2:r.x2,y2:r.y2});M.appendChild(i),R[e].push({el:i,a:t,b:n})}let z=[];for(let e=0;e<c;e+=1){let{x:t,y:n}=L[e],r=p(`g`,{class:`lv8p-node`});r.appendChild(p(`circle`,{class:`lv8p-node__circle`,cx:t,cy:n,r:v}));let i=p(`text`,{class:`lv8p-node__num`,x:t,y:n});i.textContent=String(e),r.appendChild(i),N.appendChild(r);let a=p(`text`,{class:`lv8p-node__fee`,x:t,y:n+v+13});a.textContent=`费 ${u[e]}`,P.appendChild(a),z.push({g:r})}let B=(_-52-14)/2,V=(e,t)=>{let n=p(`g`,{class:`lv8p-card is-${t}`});n.appendChild(p(`rect`,{class:`lv8p-card__box`,x:e,y:x,width:B,height:S,rx:9}));let r=p(`text`,{class:`lv8p-card__title`,x:e+14,y:304}),i=p(`text`,{class:`lv8p-card__main`,x:e+14,y:323}),a=p(`text`,{class:`lv8p-card__verdict`,x:e+B-14,y:304});return n.append(r,i,a),P.appendChild(n),{g:n,title:r,main:i,verdict:a}},H=V(26,`hot`),U=V(347,`ok`);H.title.textContent=`只图便宜 · 不看时间`,U.title.textContent=`守时间窗 · 最优`;let W=p(`text`,{class:`lv8p-lbl`,x:26,y:C});W.textContent=`状态链（沿前驱表从终点往回退）`,P.appendChild(W);let G=Math.min(84,Math.floor((_-52-152)/6)),K=[];for(let e=0;e<20;e+=1){let t=26+e*87,n=p(`g`,{class:`lv8p-chip is-hidden`});n.appendChild(p(`rect`,{class:`lv8p-chip__box`,x:t,y:w,width:G,height:T,rx:7}));let r=p(`text`,{class:`lv8p-chip__t`,x:t+G/2,y:379}),i=p(`text`,{class:`lv8p-chip__v`,x:t+G/2,y:394});n.append(r,i),P.appendChild(n),K.push({g:n,tv:r,vv:i})}let q=[];for(let e=0;e<19;e+=1){let t=26+e*87,n=t+G,r=p(`g`,{});r.appendChild(p(`line`,{class:`lv8p-link__line`,x1:n.toFixed(1),y1:387,x2:(t+G+8).toFixed(1),y2:387}));let i=t+G+8;r.appendChild(p(`polygon`,{class:`lv8p-link__head`,points:`${i.toFixed(1)},387 ${(i-6).toFixed(1)},${383.4.toFixed(1)} ${(i-6).toFixed(1)},${390.6.toFixed(1)}`})),r.style.display=`none`,P.appendChild(r),q.push(r)}P.appendChild(p(`rect`,{class:`lv8p-banner__box`,x:26,y:E,width:_-52,height:D,rx:9}));let J=p(`text`,{class:`lv8p-banner__text`,x:_/2,y:446});P.appendChild(J);let Y=p(`text`,{class:`lv8p-phase__text`,x:_/2,y:ee});P.appendChild(Y);let X=document.createElement(`p`);X.className=`viz__desc`,X.setAttribute(`aria-live`,`polite`);function re(t,n){if(!n)return;let{phase:r,cheap:i,best:a,answer:o,cursor:s,revealedStates:c}=n,u=r!==`init`&&i,d=(r===`best`||r===`back`||r===`done`)&&a;for(let e of[`cheap`,`best`]){let t=e===`cheap`?i?.cities:a?.cities,n=e===`cheap`?u:d,r=[];if(n&&t)for(let e=0;e<t.length-1;e+=1)r.push([t[e],t[e+1]]);R[e].forEach(({el:t,a:n,b:i})=>{let a=r.some(([e,t])=>e===n&&t===i||e===i&&t===n);t.setAttribute(`class`,`lv8p-path is-${e}${a?` is-on`:``}`)})}let p=new Set(u?i.cities:[]),m=new Set(d?a.cities:[]);z.forEach((e,t)=>{let n=[`lv8p-node`];t===0&&n.push(`is-src`),t===f&&n.push(`is-tail`),m.has(t)?n.push(`is-best`):p.has(t)&&n.push(`is-cheap`),e.g.setAttribute(`class`,n.join(` `))});let h=(e,t,n,r)=>{if(e.g.setAttribute(`class`,`lv8p-card is-${r}${n?``:` is-dim`}`),!t){e.main.textContent=`—`,e.verdict.textContent=``,e.verdict.setAttribute(`class`,`lv8p-card__verdict`);return}e.main.textContent=`${t.cities.join(` → `)} · 费 ${t.fee} · ${t.totalTime}分`,r===`hot`?(e.verdict.textContent=t.valid?`来得及`:`超时 ${t.totalTime} > ${l}`,e.verdict.setAttribute(`class`,`lv8p-card__verdict ${t.valid?`is-ok`:`is-hot`}`)):(e.verdict.textContent=`最优`,e.verdict.setAttribute(`class`,`lv8p-card__verdict is-ok`))};h(H,i,u,`hot`),h(U,a,d,`ok`);let g=a?a.chain:[],_=Math.max(0,c);K.forEach((e,t)=>{if(t>=g.length){e.g.setAttribute(`class`,`lv8p-chip is-hidden`);return}let n=[`lv8p-chip`];t<_?(n.push(`is-revealed`),e.tv.textContent=`t = ${g[t].t}`,e.vv.textContent=`城市 ${g[t].v}`):(e.tv.textContent=`?`,e.vv.textContent=`?`),s>=0&&t===s&&n.push(`is-cur`),e.g.setAttribute(`class`,n.join(` `))}),q.forEach((e,t)=>{let n=t+1<g.length&&t+1<_;e.style.display=n?``:`none`}),r===`init`?(J.textContent=`先不守时间：只按通行费找最便宜的路，看看它会超时多少`,J.setAttribute(`class`,`lv8p-banner__text`)):r===`cheap`?(J.textContent=i?`贪心路 ${i.cities.join(` → `)}　费 ${i.fee}　耗时 ${i.totalTime} ${i.valid?`≤`:`>`} ${l}`:`只按通行费也走不到终点`,J.setAttribute(`class`,`lv8p-banner__text`+(i&&i.valid?` is-ok`:``))):r===`best`?(J.textContent=`守时最优 ${a.cities.join(` → `)}　费 ${a.fee}　耗时 ${a.totalTime} ≤ ${l}`,J.setAttribute(`class`,`lv8p-banner__text is-ok`)):r===`back`?(J.textContent=`回溯状态链：还剩 ${g.length-_} 步退回 (0, 0)`,J.setAttribute(`class`,`lv8p-banner__text is-ok`)):(J.textContent=o===-1?`时间窗内没有可行路 → 返回 -1`:`答案 = ${o}（守时间窗的最小通行费）`,J.setAttribute(`class`,`lv8p-banner__text`+(o===-1?``:` is-ok`))),r===`init`?Y.textContent=`一维 dp[v] 只记"到 v 的最少花费"，会把"第几时刻到的"整个丢掉`:r===`cheap`?Y.textContent=i&&i.valid?`这条便宜路恰好没超时 —— 但这只是运气，本题里两件事通常冲突`:`便宜路超时作废 —— 若只看花费，一维 dp 会把它错当成答案`:r===`best`?Y.textContent="把时刻并进状态后，`(t, v)` 二维展开才拿得到第一条来得及的路":r===`back`?Y.textContent=`路不在 dp 值里，藏在 prev[arr][u] = (t, v)：一段一段问"我从哪来"`:Y.textContent=`可行性（来得及）与最优性（最便宜）是两问：先过时间窗，才谈最省`,e(X,n.desc)}b.appendChild(X);let Z=i();b.appendChild(Z.root),a.textContent=``,a.appendChild(b),n();let ie=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:s,controls:Z,intervalMs:g,onRender:re});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return o.autoplay!==!1&&!ie&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(b)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.lc1928PathMounted,document.getElementById(h)?.remove()}}}export{A as mountLc1928Path};