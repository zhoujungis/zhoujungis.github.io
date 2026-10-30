import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[1,2,5],o=11,s=1/0;function c(e={}){let t=(Array.isArray(e.coins)?e.coins:[]).filter(e=>Number.isInteger(e)&&e>0),n=Number.isInteger(e.amount)&&e.amount>=0?e.amount:o;return{coins:t.length>0?t:[...a],amount:n}}var l=e=>e===s?`∞`:String(e),u=e=>e===s?-1:e;function d(e={}){let{coins:t,amount:n}=c(e),r=[],i=Array(n+1).fill(s),a=Array(n+1).fill(s);i[0]=0,a[0]=0;let o=(e,o,s={})=>{r.push({phase:e,desc:o,coins:[...t],amount:n,coinIndex:-1,coin:null,step:0,a:-1,descA:-1,dpAsc:[...i],prevDpAsc:[...i],ascRead:null,ascValue:null,ascUpdated:!1,dpDesc:[...a],prevDpDesc:[...a],descRead:null,descValue:null,descUpdated:!1,ascResult:u(i[n]),descResult:u(a[n]),result:u(i[n]),done:e===`done`,...s})};o(`init`,`把 LC 322 写成背包：**外层面额、内层金额**。硬币 \`[${t.join(`, `)}]\`，目标 \`${n}\`。两块面板的方程**逐字相同**：\`dp[a] = min(dp[a], dp[a-c] + 1)\`；唯一的区别是内层金额的**遍历方向**。左：\`a\` 从 1 到 ${n} **正序**（本轮扫过的区间从左往右长）；右：\`a\` 从 ${n} 降到 1 **逆序**（往左长）。开局两边都是 \`dp[0] = 0\`、其余 **∞**（先假定凑不出）。每一帧同时推两格，盯住"来源格 \`dp[a-c]\` 读到的到底是本轮的新值还是上一轮的老值"。`);for(let e=0;e<t.length;e+=1){let r=t[e],s=[...a],c=[...s];for(let t=1;t<=n;t+=1){let u=t,d=n+1-t,f=[...i],p=[...a],m=null,h=null,g=!1,_=u-r;_>=0&&(m=f[_],h=m+1,h<f[u]&&(i[u]=h,g=!0));let v=null,y=null,b=!1,x=d-r;x>=0&&(v=s[x],y=v+1,y<c[d]&&(c[d]=y,b=!0)),a=s.map((e,t)=>t>=d?c[t]:e);let S=_<0?`\`${u} < ${r}\` 装不下，跳过`:`来源 \`dp[${_}] = ${l(m)}\` 是**本轮已经刷过的新值**，\`+1 = ${h}\` → ${g?`刷新成 **${i[u]}**`:`不优于现值 ${l(f[u])}`}`,C=x<0?`\`${d} < ${r}\` 装不下，跳过`:`来源 \`dp[${x}] = ${l(v)}\` 还是**本轮没碰过的旧值**，\`+1 = ${y}\` → ${b?`刷新成 **${a[d]}**`:`不优于现值 ${l(p[d])}`}`;o(`update`,`第 ${e+1} 枚硬币 \`c = ${r}\`，本轮第 ${t} 步。**正序（左）处理金额 ${u}**：${S}。**逆序（右）处理金额 ${d}**：${C}。同一行代码，唯一差别是左边的 \`dp[a-c]\` 属于"本轮已经扫过的区间"，右边的不属于 —— 于是左边能"再叠一枚 c"，右边不能。`,{coinIndex:e,coin:r,step:t,a:u,descA:d,prevDpAsc:f,ascRead:m,ascValue:h,ascUpdated:g,prevDpDesc:p,descRead:v,descValue:y,descUpdated:b})}}let d=u(i[n]),f=u(a[n]);return o(`done`,`终局：**正序 \`dp[${n}] = ${l(i[n])}\` → 答案 ${d}**（完全背包，硬币可复用）；逆序 \`dp[${n}] = ${l(a[n])}\` → ${f}（0-1 背包，每枚硬币最多一次）。`+(f===-1?`逆序不是"算得慢"，而是**题意被改掉了**：三枚硬币总面额 ${t.reduce((e,t)=>e+t,0)} < ${n}，每枚最多用一次永远凑不出。`:`逆序把每枚硬币都锁成一次，答案与正序不同 —— 同样的代码，换个方向就不是这道题了。`)+`记住这条分界线：**内层金额正序 = 完全背包**（322 对），**逆序 = 0-1 背包**（416 分割等和、1049 最后一块石头这类"每件用一次"的用逆序）。也能反过来记：正序读"同一轮已经写好的自己"，逆序读"上一轮留下的自己"。`,{done:!0,result:d}),r}var f=`coinorder-styles`,p=1/0,m=30,h=58,g=66,_=38,v=118,y=148,b=156,x=208,S=226,C=46,w=286,ee=54,te=358,ne=604,T=850,E=`
.cco { display: flex; flex-direction: column; gap: 14px; }
.cco__svg { width: 100%; height: auto; display: block; }

.cco-note {
  fill: var(--cco-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-note--r { text-anchor: end; }

.cco-title { font-size: 13px; font-weight: 800; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.cco-title--asc { fill: var(--cco-ok, #3f6b57); }
.cco-title--desc { fill: var(--cco-hot, #a45f45); }

.cco-cell__box {
  fill: var(--cco-fill, #ffffff); stroke: var(--cco-line, #c3c9c2); stroke-width: 1.5;
}
.cco-cell__val {
  fill: var(--cco-ink, #1f2a24); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-cell__idx {
  fill: var(--cco-dim, #9aa39c); font-size: 9px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-cell.is-unreach .cco-cell__val { fill: var(--cco-dim, #9aa39c); font-weight: 500; }
.cco-cell.is-unreach .cco-cell__box { stroke-dasharray: 3 3; }
.cco-cell.is-scanned .cco-cell__box { fill: var(--cco-scan, #f2f6f3); }
.cco-cell.is-from .cco-cell__box {
  fill: var(--cco-ok-fill, #eef5f1); stroke: var(--cco-ok, #3f6b57); stroke-width: 2.5;
}
.cco-cell.is-from .cco-cell__val { fill: var(--cco-ok, #3f6b57); }
.cco-cell.is-target .cco-cell__box {
  fill: var(--cco-gold-fill, #fdf3e3); stroke: var(--cco-gold, #c2872f); stroke-width: 3;
}
.cco-cell.is-target .cco-cell__val { fill: var(--cco-gold, #c2872f); }

.cco-cap {
  fill: var(--cco-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-cap--asc { fill: var(--cco-ok, #3f6b57); }
.cco-cap--desc { fill: var(--cco-hot, #a45f45); }

.cco-banner__box {
  fill: var(--cco-banner, #f4f3ef); stroke: var(--cco-line, #c3c9c2); stroke-width: 1.5;
}
.cco-banner__text {
  fill: var(--cco-ink, #1f2a24); font-size: 12.5px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-banner__text.is-ok { fill: var(--cco-ok, #3f6b57); }
.cco-banner__text.is-warn { fill: var(--cco-hot, #a45f45); }

.cco-panel__box {
  fill: var(--cco-fill, #ffffff); stroke: var(--cco-line, #c3c9c2); stroke-width: 1.5;
}
.cco-panel__label {
  fill: var(--cco-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-panel__num {
  fill: var(--cco-ink, #1f2a24); font-size: 19px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-panel__num.is-asc { fill: var(--cco-ok, #3f6b57); }
.cco-panel__num.is-desc { fill: var(--cco-hot, #a45f45); }
.cco-panel__num.is-dead { fill: var(--cco-dim, #9aa39c); }

.cco-phase__text {
  fill: var(--cco-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function D(){if(document.getElementById(f))return;let e=document.createElement(`style`);e.id=f,e.textContent=E,document.head.appendChild(e)}var O=e=>e===p?`∞`:String(e);function k(a,o={}){if(!a||a.dataset.coinorderMounted===`1`)return{destroy(){}};a.dataset.coinorderMounted=`1`,D();let s=d(o),c=o.autoplay!==!1,l=s[0].coins,u=s[0].amount,E=r,k=document.createElement(`div`);k.className=`viz cco`;let A=document.createElement(`div`);A.className=`viz__stage`,k.appendChild(A);let j=E(`svg`,{class:`viz__svg cco__svg`,viewBox:`0 0 660 380`,role:`img`,"aria-label":`零钱兑换 LC322 金额正序与逆序对照动画`});A.appendChild(j);let M=E(`g`,{}),N=E(`g`,{});j.appendChild(M),j.appendChild(N);let P=E(`text`,{class:`cco-note`,x:26,y:m});P.textContent=`同一行方程，只差内层金额的方向`,N.appendChild(P);let F=E(`text`,{class:`cco-note cco-note--r`,x:634,y:m});F.textContent=`硬币 [${l.join(`, `)}] · 目标 ${u}`,N.appendChild(F);let I=u+1,L=Math.min(46,Math.floor((ne-(I-1)*5)/Math.max(1,I))),R=(660-(I*L+(I-1)*5))/2,z=e=>{let t=[];for(let n=0;n<=u;n+=1){let r=R+n*(L+5),i=E(`g`,{class:`cco-cell`});i.appendChild(E(`rect`,{class:`cco-cell__box`,x:r,y:e,width:L,height:_,rx:5}));let a=E(`text`,{class:`cco-cell__val`,x:r+L/2,y:e+_/2-5});i.appendChild(a);let o=E(`text`,{class:`cco-cell__idx`,x:r+L/2,y:e+_/2+11});o.textContent=String(n),i.appendChild(o),M.appendChild(i),t.push({g:i,val:a,cx:r+L/2})}return t},B=E(`text`,{class:`cco-title cco-title--asc`,x:26,y:h});B.setAttribute(`text-anchor`,`start`),B.textContent=`正序 1 → ${u}　完全背包（硬币可复用）`;let V=E(`text`,{class:`cco-title cco-title--desc`,x:26,y});V.setAttribute(`text-anchor`,`start`),V.textContent=`逆序 ${u} → 1　0-1 背包（每枚最多一次）`,N.append(B,V);let re=z(g),ie=z(b),H=E(`text`,{class:`cco-cap cco-cap--asc`,x:660/2,y:v}),U=E(`text`,{class:`cco-cap cco-cap--desc`,x:660/2,y:x});N.append(H,U),N.appendChild(E(`rect`,{class:`cco-banner__box`,x:26,y:S,width:608,height:C,rx:9}));let W=E(`text`,{class:`cco-banner__text`,x:660/2,y:249});N.appendChild(W),N.appendChild(E(`rect`,{class:`cco-panel__box`,x:26,y:w,width:608,height:ee,rx:9}));let G=(e,t)=>{let n=E(`text`,{class:`cco-panel__label`,x:t,y:301});n.textContent=e;let r=E(`text`,{class:`cco-panel__num`,x:t,y:323});return N.append(n,r),r},ae=G(`coin`,660/2-175),oe=G(`本轮第几步`,660/2-45),K=G(`正序 dp[amount]`,425),q=G(`逆序 dp[amount]`,550),J=E(`text`,{class:`cco-phase__text`,x:660/2,y:te});N.appendChild(J);let Y=document.createElement(`p`);Y.className=`viz__desc`,Y.setAttribute(`aria-live`,`polite`);function X(e,t,n,r,i,a){e.forEach((e,o)=>{let s=[`cco-cell`];o===n?s.push(`is-target`):o===r?s.push(`is-from`):o>=i&&o<=a&&s.push(`is-scanned`),t[o]===p&&s.push(`is-unreach`),e.g.setAttribute(`class`,s.join(` `)),e.val.textContent=O(t[o])})}function se(t,n){if(!n)return;let r=n.phase===`update`,i=n.coin,a=r&&i!==null&&n.a-i>=0?n.a-i:null,o=r&&i!==null&&n.descA-i>=0?n.descA-i:null;if(X(re,n.dpAsc,r?n.a:-1,a,r?1:-1,r?n.a:-1),X(ie,n.dpDesc,r?n.descA:-1,o,r?n.descA:-1,r?u:-1),r?(H.textContent=`本轮已扫 1 → ${n.a}　dp[${n.a}] = ${O(n.dpAsc[n.a])}`,U.textContent=`本轮已扫 ${n.descA} → ${u}　dp[${n.descA}] = ${O(n.dpDesc[n.descA])}`):n.phase===`done`?(H.textContent=`终态 dp[${u}] = ${O(n.dpAsc[u])}`,U.textContent=`终态 dp[${u}] = ${O(n.dpDesc[u])}`):(H.textContent=`dp[0] = 0，其余 ∞`,U.textContent=`dp[0] = 0，其余 ∞`),r){let e=n.ascRead===null?`a=${n.a} 装不下`:`a=${n.a}: dp[${a}]+1 = ${O(n.ascValue)}${n.ascUpdated?` ✓`:``}`,t=n.descRead===null?`a=${n.descA} 装不下`:`a=${n.descA}: 旧 dp[${o}]+1 = ${O(n.descValue)}${n.descUpdated?` ✓`:``}`;W.textContent=`正序｜${e}　　逆序｜${t}`,W.setAttribute(`class`,`cco-banner__text`+(n.ascUpdated?` is-ok`:``))}else n.phase===`done`?(W.textContent=`正序 = ${n.result}　≠　逆序 = ${n.descResult} —— 方向一换，题意就变了`,W.setAttribute(`class`,`cco-banner__text`+(n.descResult===-1?` is-warn`:``))):(W.textContent=`dp[a] = min(dp[a], dp[a-c] + 1)　两边一字不差`,W.setAttribute(`class`,`cco-banner__text`));ae.textContent=i===null?`—`:String(i),oe.textContent=n.step===0?`—`:String(n.step),K.textContent=String(n.ascResult),K.setAttribute(`class`,`cco-panel__num`+(n.ascResult===-1?` is-dead`:` is-asc`)),q.textContent=String(n.descResult),q.setAttribute(`class`,`cco-panel__num`+(n.descResult===-1?` is-dead`:` is-desc`)),n.phase===`init`?J.textContent=`两块面板：外层面额、内层金额，只差遍历方向`:r?J.textContent=n.ascUpdated?`正序读到的是"本轮的新值"，于是能再叠一枚同一硬币`:`正序这一步没刷新；逆序读到的永远是"上一轮的老值"`:J.textContent=n.descResult===-1?`逆序把每枚硬币都锁成一次 —— 就不再是这道题了`:`正序 = 完全背包，是 LC 322 的正确方向`,e(Y,n.desc)}k.appendChild(Y);let Z=i();k.appendChild(Z.root),a.textContent=``,a.appendChild(k),n();let ce=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:s,controls:Z,intervalMs:T,onRender:se});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return c&&!ce&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(k)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.coinorderMounted,document.getElementById(f)?.remove()}}}export{k as mountCoinChangeOrder};