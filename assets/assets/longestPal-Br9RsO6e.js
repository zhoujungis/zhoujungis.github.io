import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=`babad`;function o(e={}){let t=typeof e.s==`string`&&e.s.length>0?e.s:a,n=Array.from(t),r=n.length,i=n,o=[],s=(e,t,i={})=>{o.push({phase:e,desc:t,chars:n,n:r,centerIdx:-1,centerType:null,ci:null,l:null,r:null,len:0,pal:null,bestL:null,bestR:null,bestLen:0,bestUpdated:!1,done:e===`done`,...i})};s(`init`,`给了字符串 \`${t}\`（\`${r}\` 个字符）。求最长回文子串。枚举所有子串要 \`O(n^2)\` 个、每个验回文又要 \`O(n)\` —— \`O(n^3)\` 起步。换个角度：**回文是关于中心对称的，枚举中心就够了** —— 中心只有 **\`2n-1 = ${2*r-1}\` 个**：\`${r}\` 个字符中心（管奇数回文，如 \`"bab"\`）+ \`${r-1}\` 个间隙中心（管偶数回文，如 \`"abba"\`）。每个中心向两边扩展到不能再扩，总时间 \`O(n^2)\`，**空间 O(1)**。下面按「字符 0 · 间隙 0 · 字符 1 · 间隙 1 · …」交错的顺序扫过所有中心。`);let c=null,l=null,u=0,d=0,f=(e,t)=>{let a=null,o=null;if(e===`char`)for(a=t,o=t;a>0&&o<r-1&&i[a-1]===i[o+1];)--a,o+=1;else if(i[t]===i[t+1])for(a=t,o=t+1;a>0&&o<r-1&&i[a-1]===i[o+1];)--a,o+=1;let f=a===null?0:o-a+1,p=a===null?null:n.slice(a,o+1).join(``),m=f>u;m&&(c=a,l=o,u=f);let h=e===`char`?`\`s[${t}]\``:`\`s[${t}]|s[${t+1}]\` 之间`,g=[];g.push(`**中心 \`${d+1}/${2*r-1}\`（${e===`char`?`字符中心`:`间隙中心`} ${h}）**：`),a===null?g.push(e===`gap`?`两侧字符 \`${i[t]}\` ≠ \`${i[t+1]}\`，连最小的偶数回文都构不成 —— 长度 0，跳过。`:`扩展结果就是它自己，长度 1。`):g.push(`向两边扩展到 \`[${a}, ${o}]\`，回文 **"${p}"**，长度 \`${f}\``+(m?` —— **超过当前最优（原 \`${u}\`），更新最优**。`:`，不超过当前最优（\`${u}\`），最优保持。`)),s(`center`,g.join(``),{centerIdx:d,centerType:e,ci:t,l:a,r:o,len:f,pal:p,bestL:c,bestR:l,bestLen:u,bestUpdated:m}),d+=1};for(let e=0;e<r;e+=1)f(`char`,e),e<r-1&&f(`gap`,e);return s(`done`,`\`${2*r-1}\` 个中心全部扫完，最优回文 **"${n.slice(c,l+1).join(``)}"**（\`[${c}, ${l}]\`，长度 \`${u}\`）。回头看：每个中心只向两边扫一次，总时间 \`O(n^2)\`、**空间 O(1)** —— 比 DP 的 \`O(n^2)\` 空间省一个量级。两个提醒：间隙中心（偶数回文）是最容易漏的，\`"abba"\`、\`"cbbd"\` 全靠它们；同长度时先到先得（\`"babad"\` 的 \`"bab"\` 先于 \`"aba"\` 出现）。`,{centerIdx:2*r-1,bestL:c,bestR:l,bestLen:u,done:!0}),o}var s=`longpal-styles`,c=54,l=84,u=46,d=176,f=50,p=262,m=284,h=318,g=26,_=604,v=1250,y=`
.longpal {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.longpal__svg { width: 100%; height: auto; display: block; }

.longpal-note {
  fill: var(--longpal-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.longpal-banner__box {
  fill: var(--longpal-banner, #f4f3ef);
  stroke: var(--longpal-line, #c3c9c2);
  stroke-width: 1.5;
}
.longpal-banner__seg {
  fill: var(--longpal-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.longpal-banner__ans {
  fill: var(--longpal-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.longpal-cell__box {
  fill: var(--longpal-fill, #ffffff);
  stroke: var(--longpal-line, #c3c9c2);
  stroke-width: 1.5;
}
.longpal-cell__box.is-dashed {
  fill: none;
  stroke: var(--longpal-dim, #9aa39c);
  stroke-dasharray: 4 4;
  stroke-width: 1.2;
}
.longpal-cell__val {
  fill: var(--longpal-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.longpal-cell__idx {
  fill: var(--longpal-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 通道一（底色）：当前中心扩展出的回文区间 */
.longpal-cell.is-span .longpal-cell__box { fill: var(--longpal-gold-fill, #fdf3e3); }
/* 通道二（边框）：当前中心（字符中心格）/ 最优区间（done） */
.longpal-cell.is-center .longpal-cell__box {
  stroke: var(--longpal-hot, #a45f45);
  stroke-width: 3;
}
.longpal-cell.is-best-done .longpal-cell__box {
  fill: var(--longpal-ok-fill, #eef5f1);
  stroke: var(--longpal-ok, #3f6b57);
  stroke-width: 2.5;
}

.longpal-gapline {
  stroke: var(--longpal-hot, #a45f45);
  stroke-width: 2.5;
  stroke-dasharray: 5 4;
}

.longpal-bestline {
  stroke: var(--longpal-gold, #c2872f);
  stroke-width: 3.5;
  stroke-linecap: round;
}
.longpal-besttext {
  fill: var(--longpal-gold, #c2872f);
  font-size: 13.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.longpal-phase__text {
  fill: var(--longpal-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function b(){if(document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=y,document.head.appendChild(e)}function x(a,y={}){if(!a||a.dataset.longpalMounted===`1`)return{destroy(){}};a.dataset.longpalMounted=`1`,b();let x=o(y),S=y.autoplay!==!1,C=x[0],w=C.chars,T=C.n,E=r,D=document.createElement(`div`);D.className=`viz longpal`;let O=document.createElement(`div`);O.className=`viz__stage`,D.appendChild(O);function k(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let A=52;T*A+(T-1)*8>_&&(A=Math.max(24,Math.floor((_-(T-1)*8)/T)));let j=T*A+(T-1)*8,M=Math.max(660,g*2+j),N=(M-j)/2,P=e=>N+e*(A+8)+A/2,F=e=>N+(e+1)*(A+8)-8/2,I=M-g*2,L=E(`svg`,{class:`viz__svg longpal__svg`,viewBox:`0 0 ${M} 342`,role:`img`,"aria-label":`最长回文子串 中心扩展推演动画`});O.appendChild(L);let R=E(`g`,{class:`longpal-cells`}),z=E(`g`,{class:`longpal-marks`});L.appendChild(R),L.appendChild(z);let B=E(`text`,{class:`longpal-note`,x:g,y:c});B.textContent=`中心扩展：枚举 2n-1 个中心（字符 + 间隙），向两边扩展到不能再扩`,z.appendChild(B),z.appendChild(E(`rect`,{class:`longpal-banner__box`,x:g,y:l,width:I,height:u,rx:9}));let V=E(`text`,{class:`longpal-banner__seg`,x:44,y:107}),H=E(`text`,{class:`longpal-banner__seg`,x:216,y:107}),U=E(`text`,{class:`longpal-banner__ans`,x:M-g-18,y:107});z.appendChild(V),z.appendChild(H),z.appendChild(U);let W=[];for(let e=0;e<T;e+=1){let t=E(`g`,{class:`longpal-cell`}),n=E(`rect`,{class:`longpal-cell__box`,x:P(e)-A/2,y:d,width:A,height:f,rx:6});t.appendChild(n);let r=E(`text`,{class:`longpal-cell__val`,x:P(e),y:201});r.textContent=w[e],t.appendChild(r);let i=E(`text`,{class:`longpal-cell__idx`,x:P(e),y:d-8});i.textContent=String(e),z.appendChild(i),R.appendChild(t),W.push({g:t,box:n,val:r})}let G=[];for(let e=0;e<T-1;e+=1){let t=E(`line`,{class:`longpal-gapline`,x1:F(e),y1:d-8,x2:F(e),y2:234});t.style.opacity=`0`,z.appendChild(t),G.push(t)}let K=E(`line`,{class:`longpal-bestline`,x1:0,y1:p,x2:0,y2:p}),q=E(`text`,{class:`longpal-besttext`,x:M/2,y:m});K.style.opacity=`0`,q.style.opacity=`0`,z.appendChild(K),z.appendChild(q);let J=E(`text`,{class:`longpal-phase__text`,x:M/2,y:h});z.appendChild(J);let Y=k();function X(t,n){if(!n)return;let r=n.phase===`done`,i=n.phase===`center`;if(G.forEach((e,t)=>{let r=i&&n.centerType===`gap`&&n.ci===t;e.style.opacity=r?`1`:`0`}),W.forEach((e,t)=>{let a=[`longpal-cell`];e.box.classList.remove(`is-dashed`),i&&(n.l!==null&&t>=n.l&&t<=n.r&&a.push(`is-span`),n.centerType===`char`&&t===n.ci&&a.push(`is-center`)),r&&n.bestL!==null&&t>=n.bestL&&t<=n.bestR&&a.push(`is-best-done`),e.g.setAttribute(`class`,a.join(` `))}),n.bestL!==null){let e=N+n.bestL*(A+8),t=N+n.bestR*(A+8)+A;K.setAttribute(`x1`,e),K.setAttribute(`x2`,t),K.style.opacity=`1`,q.textContent=`best: "${n.chars.slice(n.bestL,n.bestR+1).join(``)}" (len ${n.bestLen})`,q.setAttribute(`x`,(e+t)/2),q.style.opacity=`1`}else K.style.opacity=`0`,q.style.opacity=`0`;i?(V.textContent=`中心 ${n.centerIdx+1}/${2*T-1}`,n.l===null?H.textContent=`s[${n.ci}] ≠ s[${n.ci+1}] → 长度 0`:H.textContent=`expand(${n.centerType===`char`?n.ci:`${n.ci},${n.ci+1}`}) → [${n.l}, ${n.r}] "${n.pal}"${n.bestUpdated?` ← 更新`:``}`):n.phase===`init`?(V.textContent=`中心扩展`,H.textContent=`${2*T-1} 个中心交错枚举`):(V.textContent=`${2*T-1} 个中心扫完`,H.textContent=`最优 [${n.bestL}, ${n.bestR}]`),U.textContent=r?`"${n.chars.slice(n.bestL,n.bestR+1).join(``)}"`:`"${w.join(``)}"`,i?J.textContent=n.len>0?`该中心最长回文 len=${n.len} · best=${n.bestLen}`:`偶数回文靠间隙中心 —— 漏了它们就漏了 "abba"`:n.phase===`init`?J.textContent=`字符中心管奇数回文（"bab"）· 间隙中心管偶数回文（"abba"）`:J.textContent=`O(n^2) 时间 · O(1) 空间 —— DP 是 O(n^2) 空间，Manacher 是 O(n) 但难写`,e(Y,n.desc)}D.appendChild(Y);let Z=i();D.appendChild(Z.root),a.textContent=``,a.appendChild(D),n();let ee=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:x,controls:Z,intervalMs:v,onRender:X});Q.jumpTo(Math.trunc(y.initialStep)||0);let $=null;return S&&!ee&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(D)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.longpalMounted,document.getElementById(s)?.remove()}}}export{x as mountLongestPal};