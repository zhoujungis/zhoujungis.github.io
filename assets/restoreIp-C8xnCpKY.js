import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=`25525511135`;function o(e={}){let t=typeof e.s==`string`&&e.s.length>0?e.s:a,n=Array.from(t),r=n.length,i=[],o=(e,a,o={})=>{i.push({phase:e,desc:a,s:t,chars:n,n:r,path:[],pos:0,segLen:null,trySeg:null,verdict:null,ans:[],done:e===`done`,...o})};o(`init`,`给了只含数字的串 \`${t}\`（\`${r}\` 位）。复原 IP = 切成 4 段、中间插 3 个点：每段 1-3 位、数值 0-255、无前导零（\`"0"\` 合法、\`"01"\` 非法）。等价于在 \`${r-1}\` 个缝隙里选 3 个切点 —— 搜索空间天生有界（\`C(${r-1}, 3)\`）。回溯每层切一段：尝试切 1 / 2 / 3 位，**剪枝分两层** —— 段合法性（前导零、\`>255\`）与可行性（剩余位数 \`[segs, segs × 3]\` 才走得通）。`);let s=[],c=(e,n,i)=>{let a=4-i.length;if(e+n>r)return{verdict:`length`,seg:null,detail:`末尾不够切 ${n} 位`};let o=t.slice(e,e+n);if(o.length>1&&o[0]===`0`)return{verdict:`lead-zero`,seg:o,detail:`"${o}" 有前导零（"0" 合法，"0…" 非法）`};if(Number(o)>255)return{verdict:`range`,seg:o,detail:`${o} > 255`};let s=r-e-n,c=a-1;return c>0?s<c||s>c*3?{verdict:`length`,seg:o,detail:s<c?`剩余 ${s} 位 < 剩余 ${c} 段最少需要的 ${c} 位`:`剩余 ${s} 位 > 剩余 ${c} 段最多能装 ${c*3} 位`}:{verdict:`ok`,seg:o,detail:`段合法且剩余 ${s} 位可装进 ${c} 段，深入`}:s===0?{verdict:`answer`,seg:o,detail:`第 4 段恰好用完全部剩余位 —— 收下一个答案`}:{verdict:`length`,seg:o,detail:`第 4 段切完还剩 ${s} 位没进任何段 —— 4 段必须恰好用完全部 ${r} 位`}},l=(e,t)=>{if(t.length!==4)for(let n of[1,2,3]){let{verdict:i,seg:a,detail:u}=c(e,n,t);if(i===`answer`){let e=[...t,a];s.push(e.join(`.`))}4-t.length;let d=[];d.push(`**切第 \`${t.length+1}\` 段（试 ${n} 位）：**`),d.push(a===null?`末尾只剩 \`${r-e}\` 位，不够切。`:`试切 \`"${a}"\``),i===`ok`?d.push(` —— ${u}。`):i===`answer`?d.push(` —— ${u}：**"${[...t,a].join(`.`)}"**。`):i===`length`?d.push(` —— 剪：${u}（可行性 —— 整棵子树都不可行，这条分支到此为止）。`):(i===`lead-zero`||i===`range`)&&d.push(` —— 剪：${u}。`),i===`ok`&&d.push(`回溯后继续试 ${n<3?`切 ${n+1} 位`:`下一条分支`}。`),o(`try`,d.join(``),{path:t.slice(),pos:e,segLen:n,trySeg:a,verdict:i,ans:s.slice()}),i===`ok`?l(e+n,[...t,a]):i===`answer`&&o(`answer`,`第 \`${s.length}\` 个答案：**"${s[s.length-1]}"**。回溯继续找。`,{path:[...t,a],pos:e+n,segLen:n,trySeg:a,verdict:`answer`,ans:s.slice()})}};return r>=4&&r<=12?l(0,[]):o(`try`,`长度 \`${r}\` 不在 \`[4, 12]\` 内（4 段至少 4 位、至多 12 位）—— 直接无解，连搜都不用搜。`,{pos:0,segLen:null,trySeg:null,verdict:`length`}),o(`done`,s.length>0?`搜索结束，共 **${s.length} 个答案**：${s.map(e=>`"${e}"`).join(`、`)}。整棵树最多 3^4 = 81 条路径、只有 4 层 —— 回溯在这里是常数级的；可行性剪枝把 "段合法但走不通" 的分支（如第一段切 \`"2"\`）在层顶就砍掉。`:`搜索结束，**没有答案**（长度 ${r} 无法切成 4 个合法段）。`,{ans:s.slice(),done:!0}),i}var s=`rip-styles`,c=54,l=84,u=46,d=176,ee=46,te=164,f=234,p=272,m=296,h=24,g=344,_=26,v=604,ne=1150,y=`
.rip {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.rip__svg { width: 100%; height: auto; display: block; }

.rip-note {
  fill: var(--rip-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rip-banner__box {
  fill: var(--rip-banner, #f4f3ef);
  stroke: var(--rip-line, #c3c9c2);
  stroke-width: 1.5;
}
.rip-banner__seg {
  fill: var(--rip-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rip-banner__ans {
  fill: var(--rip-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rip-cell__box {
  fill: var(--rip-fill, #ffffff);
  stroke: var(--rip-line, #c3c9c2);
  stroke-width: 1.5;
}
.rip-cell__box.is-dashed {
  fill: none;
  stroke: var(--rip-dim, #9aa39c);
  stroke-dasharray: 4 4;
  stroke-width: 1.2;
}
.rip-cell__val {
  fill: var(--rip-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rip-cell__idx {
  fill: var(--rip-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 通道一（底色）：try 段 ok → 淡金；剪 → 灰 */
.rip-cell.is-try-ok .rip-cell__box { fill: var(--rip-gold-fill, #fdf3e3); }
.rip-cell.is-try-ok .rip-cell__val { fill: var(--rip-hot, #a45f45); }
.rip-cell.is-try-bad .rip-cell__box {
  fill: none;
  stroke: var(--rip-dim, #9aa39c);
  stroke-dasharray: 4 4;
  stroke-width: 1.2;
}
.rip-cell.is-try-bad .rip-cell__val { fill: var(--rip-dim, #9aa39c); }
/* done：全部正常白格 */

.rip-div-fixed {
  stroke: var(--rip-hot, #a45f45);
  stroke-width: 3;
  stroke-linecap: round;
}
.rip-div-try {
  stroke: var(--rip-dim, #9aa39c);
  stroke-width: 2;
  stroke-dasharray: 4 3;
}

.rip-ans__title {
  fill: var(--rip-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rip-ans__row {
  fill: var(--rip-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rip-ans__row.is-fresh { fill: var(--rip-gold, #c2872f); font-weight: 700; }
.rip-ans__empty {
  fill: var(--rip-dim, #9aa39c);
  font-size: 13px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rip-phase__text {
  fill: var(--rip-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function b(){if(document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=y,document.head.appendChild(e)}function x(a,y={}){if(!a||a.dataset.ripMounted===`1`)return{destroy(){}};a.dataset.ripMounted=`1`,b();let x=o(y),S=y.autoplay!==!1,C=x[0],re=C.chars,w=C.n,T=r,E=document.createElement(`div`);E.className=`viz rip`;let D=document.createElement(`div`);D.className=`viz__stage`,E.appendChild(D);function ie(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let O=46;w*O+(w-1)*8>v&&(O=Math.max(22,Math.floor((v-(w-1)*8)/w)));let k=w*O+(w-1)*8,A=Math.max(660,_*2+k),j=(A-k)/2,M=e=>j+e*(O+8)+O/2,N=e=>j+(e+1)*(O+8)-8/2,P=A-_*2,F=Math.max(1,...x.map(e=>e.ans.length)),I=m+(F-1)*h-(p-16)+8,L=T(`svg`,{class:`viz__svg rip__svg`,viewBox:`0 0 ${A} ${Math.max(368,296+I)}`,role:`img`,"aria-label":`复原 IP 地址 分段回溯推演动画`});D.appendChild(L);let R=T(`g`,{class:`rip-cells`}),z=T(`g`,{class:`rip-marks`});L.appendChild(R),L.appendChild(z);let B=T(`text`,{class:`rip-note`,x:_,y:c});B.textContent=`分段回溯：每段切 1-3 位，剪枝两层 —— 段合法性（前导零 / >255）+ 可行性（剩余位数）`,z.appendChild(B),z.appendChild(T(`rect`,{class:`rip-banner__box`,x:_,y:l,width:P,height:u,rx:9}));let V=T(`text`,{class:`rip-banner__seg`,x:44,y:107}),H=T(`text`,{class:`rip-banner__seg`,x:201,y:107}),U=T(`text`,{class:`rip-banner__ans`,x:A-_-18,y:107});z.appendChild(V),z.appendChild(H),z.appendChild(U);let W=[];for(let e=0;e<w;e+=1){let t=T(`g`,{class:`rip-cell`}),n=T(`rect`,{class:`rip-cell__box`,x:M(e)-O/2,y:d,width:O,height:ee,rx:6});t.appendChild(n);let r=T(`text`,{class:`rip-cell__val`,x:M(e),y:199});r.textContent=re[e],t.appendChild(r);let i=T(`text`,{class:`rip-cell__idx`,x:M(e),y:d-8});i.textContent=String(e),z.appendChild(i),R.appendChild(t),W.push({g:t,box:n,val:r})}let G=[];for(let e=0;e<w-1;e+=1){let t=T(`line`,{class:`rip-div-fixed`,x1:N(e),y1:te,x2:N(e),y2:f});t.style.opacity=`0`,z.appendChild(t),G.push(t)}let K=T(`text`,{class:`rip-ans__title`,x:_,y:p});K.textContent=`answers`,z.appendChild(K);let q=[];for(let e=0;e<F;e+=1){let t=T(`text`,{class:`rip-ans__row`,x:A/2,y:m+e*h});t.style.opacity=`0`,z.appendChild(t),q.push(t)}let J=T(`text`,{class:`rip-ans__empty`,x:A/2,y:m});J.textContent=`（还没有答案 —— 切满 4 段且恰好用完全部数字才会收下）`,z.appendChild(J);let Y=T(`text`,{class:`rip-phase__text`,x:A/2,y:g});z.appendChild(Y);let X=ie();function ae(t,n){if(!n)return;let r=n.phase===`done`,i=n.phase===`try`,a=n.phase===`answer`;G.forEach((e,t)=>{let r=t+1;n.path.slice(0,-0).length;let o=0,s=!1;for(let e of n.path)if(o+=e.length,o===r){s=!0;break}let c=(i||a)&&n.trySeg!==null&&n.pos===r,l=(i||a)&&n.trySeg!==null&&n.pos+n.trySeg.length===r;s?(e.setAttribute(`class`,`rip-div-fixed`),e.style.opacity=`1`):c||l?(e.setAttribute(`class`,`rip-div-try`),e.style.opacity=`1`):e.style.opacity=`0`});let o=n.pos,s=n.trySeg===null?-1:n.pos+n.trySeg.length-1;W.forEach((e,t)=>{let r=[`rip-cell`];e.box.classList.remove(`is-dashed`),i&&t>=o&&t<=s&&r.push(n.verdict===`ok`||n.verdict===`answer`?`is-try-ok`:`is-try-bad`),e.g.setAttribute(`class`,r.join(` `))});let c=n.ans;c.length===0?J.style.opacity=`1`:J.style.opacity=`0`,q.forEach((e,t)=>{t<c.length?(e.textContent=`"${c[t]}"`,e.setAttribute(`class`,`rip-ans__row`+(a&&t===c.length-1?` is-fresh`:``)),e.style.opacity=`1`):e.style.opacity=`0`});let l=n.path.length+1;if(i||a){V.textContent=`切第 ${a?4:l} 段`;let e=n.verdict,t=e===`ok`?`合法，深入`:e===`answer`?`收下答案`:e===`lead-zero`?`前导零`:e===`range`?`超出 255`:`长度不可行`;H.textContent=n.trySeg===null?`末尾只剩 ${n.n-n.pos} 位，不够切 ${n.segLen} 位`:`try "${n.trySeg}" → ${t}`}else n.phase===`init`?(V.textContent=`分段回溯`,H.textContent=`在缝隙里选 3 个切点（每段 1-3 位）`):(V.textContent=`搜索结束`,H.textContent=`${n.ans.length} 个答案`);if(U.textContent=r?`${n.ans.length} 个`:`${n.ans.length} 个答案`,i||a){let e=n.path.length>0?n.path.join(`.`):`(空)`,t=i&&n.trySeg!==null?` + 尝试 "${n.trySeg}"`:``;Y.textContent=`path: ${e}${t} · pos=${n.pos} · 剩余 ${n.n-n.pos} 位`}else n.phase===`init`?Y.textContent=`长度不在 [4, 12] 直接无解；每层最多 3 个分支、只有 4 层`:Y.textContent=`可行性剪枝：剩余 segs 段时，剩余位数必须落在 [segs, segs × 3]`;e(X,n.desc)}E.appendChild(X);let Z=i();E.appendChild(Z.root),a.textContent=``,a.appendChild(E),n();let oe=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:x,controls:Z,intervalMs:ne,onRender:ae});Q.jumpTo(Math.trunc(y.initialStep)||0);let $=null;return S&&!oe&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(E)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.ripMounted,document.getElementById(s)?.remove()}}}export{x as mountRestoreIp};