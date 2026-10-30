import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=`applepenapple`,o=[`apple`,`pen`];function s(e={}){let t=typeof e.s==`string`&&e.s.length>0?e.s:a,n=Array.isArray(e.words)?e.words:[],r=[...new Set(n.filter(e=>typeof e==`string`&&e.length>0))];return{s:t,words:r.length>0?r:[...o]}}function c(e={}){let{s:t,words:n}=s(e),r=t.length,i=n.reduce((e,t)=>Math.max(e,t.length),0),a=new Set(n),o=[],c=Array(r+1).fill(!1);c[0]=!0;let l=Array(r+1).fill(null),u=(e,a,s={})=>{o.push({phase:e,desc:a,s:t,words:[...n],n:r,maxLen:i,i:-1,j:-1,seg:``,dpJ:!1,inDict:!1,skipped:0,lo:0,hi:-1,hit:!1,dp:[...c],prevDp:[...c],cut:[...l],result:c[r],segments:[],done:e===`done`,...s})};u(`init`,`给字符串 \`s = "${t}"\`（${r} 个字符）和字典 \`[${n.map(e=>`"${e}"`).join(`, `)}]\`，判断整个 s 能否由字典里的词**整段拼接**而成（词可以重复使用）。定义 \`dp[i]\` = s 的**前 i 个字符**能否拼出：底座 \`dp[0] = true\`（空串天然拼得出），其余先全部 \`false\`。递推 \`dp[i] = OR( dp[j] && s[j:i] ∈ dict )\` —— 语义是**枚举"最后一个词"**：最后一段取 \`s[j:i]\`，只要它本身是词、且它前面的 \`s[0:j]\` 拼得出（\`dp[j] = true\`），\`dp[i]\` 就成立。字典里最长的词是 ${i} 个字符，所以切分点只看窗口 \`j ∈ [i - ${i}, i - 1]\`：更靠左的 j 会让"最后一个词"长度超过 maxLen，不可能命中。任何一个 j 命中，\`dp[i]\` 立刻置 true 并停止扫描（**命中即短路**）。`);for(let e=1;e<=r;e+=1){let n=Math.max(0,e-i),r=e-1,o=0,s=0,d=!1;for(let f=n;f<=r;f+=1){if(!c[f]){o+=1;continue}let p=[...c],m=t.slice(f,e),h=a.has(m);h&&(c[e]=!0,l[e]=f,d=!0),s+=1;let g=n>0?`窗口左端 \`${n} = ${e} - ${i}\`：最后一词最长 ${i}，更靠左的 j 连长度都对不上，不必看。`:``,_=o>0?`先跳过 ${o} 个 \`dp[j] = false\` 的切分点 —— 前一段自己都拼不出来，后面接什么词都白搭。`:``;if(u(`probe`,`前缀 **${e}**（即 \`s\` 的前 ${e} 个字符 \`"${t.slice(0,e)}"\`），窗口 \`j ∈ [${n}, ${r}]\`。`+_+`盯住 \`j = ${f}\`：\`dp[${f}] = true\`（\`"${t.slice(0,f)}"\` 已拼得出），再查最后一段 \`s[${f}:${e}] = "${m}"\` —— `+(h?`**在字典里**，于是 \`dp[${e}] = true\`。命中即短路，本格剩下的切分点不用再试了。`:`不在字典里，这个切分点作废，接着试下一个 j。`)+g,{i:e,j:f,seg:m,dpJ:p[f],inDict:h,skipped:o,lo:n,hi:r,hit:d,prevDp:p}),d)break}s===0&&u(`probe`,`前缀 **${e}**，窗口 \`j ∈ [${n}, ${r}]\` 里 ${o} 个切分点的 \`dp[j]\` 全是 \`false\` —— 前一段自己就拼不出来，后面接什么词都白搭，\`dp[${e}] = false\`。注意 \`dp\` 是**布尔可达性**：没人能走到 \`i\`，这一格就一直是 false，不像 LC 322 那样还有"先设成 ∞、等路径来刷新"的余地。`,{i:e,j:-1,skipped:o,lo:n,hi:r,hit:!1})}let d=c[r],f=[],p=[r];if(d){let e=r;for(;e>0;){let n=l[e];f.push(t.slice(n,e)),p.push(n),e=n}f.reverse()}let m=f.length!==new Set(f).size;return u(`done`,(d?`返回 **true**：\`dp[${r}] = true\`，整个串拼得出来。顺 \`cut\` 表回溯出切分点链 \`${p.join(` → `)}\`，即 \`${f.join(` | `)}\`（${f.length} 段）。`+(m?`注意 \`${f.find((e,t)=>f.indexOf(e)!==t)}\` 用了不止一次 —— **词可重复使用**正是"完全背包"的语义，跟 LC 322 里硬币无限复用是同一件事。`:'每一段都在字典里，每段起点处 `dp[j]` 都是 true（所以 `dp` 表同时也是一张"可达位置"的清单）。'):`返回 **false**：\`dp[${r}] = false\`，无论怎么切都有一段不在字典里。注意 \`dp[i]\` 是**布尔或**：只要有一条通路能走到 i 就够，不必去数"有几种切法"。`)+`这也就是 139 与 322 的分工 —— 322 求**最少枚数**（min），139 求**能否到达**（OR）。`,{segments:f,chain:p,done:!0}),o}var l=`wordbreak-styles`,u=28,d=48,f=58,p=40,m=116,h=124,g=38,_=176,ee=44,te=234,ne=54,v=310,y=604,b=1250,x=`
.wbv { display: flex; flex-direction: column; gap: 14px; }
.wbv__svg { width: 100%; height: auto; display: block; }

.wbv-note {
  fill: var(--wbv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-note--r { text-anchor: end; }

.wbv-lbl {
  fill: var(--wbv-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.wbv-band { fill: var(--wbv-band, #eef1ec); opacity: 0.9; }

.wbv-cell__box {
  fill: var(--wbv-fill, #ffffff); stroke: var(--wbv-line, #c3c9c2); stroke-width: 1.5;
}
.wbv-cell__val {
  fill: var(--wbv-ink, #1f2a24); font-size: 15px; font-weight: 800;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-cell__idx {
  fill: var(--wbv-dim, #9aa39c); font-size: 9px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-cell.is-true .wbv-cell__box {
  fill: var(--wbv-ok-fill, #eef5f1); stroke: var(--wbv-ok, #3f6b57); stroke-width: 2;
}
.wbv-cell.is-true .wbv-cell__val { fill: var(--wbv-ok, #3f6b57); }
.wbv-cell.is-dead .wbv-cell__box { fill: var(--wbv-past, #eef0ec); }
.wbv-cell.is-dead .wbv-cell__val { fill: var(--wbv-dim, #9aa39c); font-weight: 500; }
.wbv-cell.is-ahead .wbv-cell__box { fill: var(--wbv-fill, #ffffff); stroke-dasharray: 3 3; }
.wbv-cell.is-ahead .wbv-cell__val { fill: var(--wbv-dim, #9aa39c); font-weight: 500; }
.wbv-cell.is-from .wbv-cell__box {
  fill: var(--wbv-ok-fill, #eef5f1); stroke: var(--wbv-ok, #3f6b57); stroke-width: 3;
}
.wbv-cell.is-from .wbv-cell__val { fill: var(--wbv-ok, #3f6b57); }
.wbv-cell.is-target .wbv-cell__box {
  fill: var(--wbv-gold-fill, #fdf3e3); stroke: var(--wbv-gold, #c2872f); stroke-width: 3;
}
.wbv-cell.is-target .wbv-cell__val { fill: var(--wbv-gold, #c2872f); }
.wbv-cell.is-hit .wbv-cell__box { stroke: var(--wbv-gold, #c2872f); }

.wbv-ch {
  fill: var(--wbv-fill, #ffffff); stroke: var(--wbv-line, #c3c9c2); stroke-width: 1.5;
}
.wbv-ch__val {
  fill: var(--wbv-ink, #1f2a24); font-size: 16px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-ch.is-prefix { fill: var(--wbv-ok-fill, #eef5f1); }
.wbv-ch.is-prefix + .wbv-ch__val { fill: var(--wbv-ok, #3f6b57); }
.wbv-ch.is-ahead { fill: var(--wbv-past, #eef0ec); stroke-dasharray: 3 3; }
.wbv-ch.is-ahead + .wbv-ch__val { fill: var(--wbv-dim, #9aa39c); }
.wbv-ch.is-word {
  fill: var(--wbv-gold-fill, #fdf3e3); stroke: var(--wbv-gold, #c2872f); stroke-width: 3;
}
.wbv-ch.is-word + .wbv-ch__val { fill: var(--wbv-gold, #c2872f); }

.wbv-cut { stroke: var(--wbv-gold, #c2872f); stroke-width: 1.6; stroke-dasharray: 4 3; opacity: 0.8; }

.wbv-banner__box {
  fill: var(--wbv-banner, #f4f3ef); stroke: var(--wbv-line, #c3c9c2); stroke-width: 1.5;
}
.wbv-banner__text {
  fill: var(--wbv-hot, #a45f45); font-size: 13.5px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-banner__text.is-ok { fill: var(--wbv-ok, #3f6b57); }

.wbv-panel__box {
  fill: var(--wbv-fill, #ffffff); stroke: var(--wbv-line, #c3c9c2); stroke-width: 1.5;
}
.wbv-panel__label {
  fill: var(--wbv-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-panel__num {
  fill: var(--wbv-ink, #1f2a24); font-size: 17px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-panel__num.is-ok { fill: var(--wbv-ok, #3f6b57); }
.wbv-panel__num.is-dead { fill: var(--wbv-dim, #9aa39c); }
.wbv-panel__num.is-fresh { fill: var(--wbv-gold, #c2872f); }

.wbv-phase__text {
  fill: var(--wbv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function S(){if(document.getElementById(l))return;let e=document.createElement(`style`);e.id=l,e.textContent=x,document.head.appendChild(e)}function C(a,o={}){if(!a||a.dataset.wordbreakMounted===`1`)return{destroy(){}};a.dataset.wordbreakMounted=`1`,S();let s=c(o),x=o.autoplay!==!1,{s:C,words:re,n:w,maxLen:ie}=s[0],T=r,E=document.createElement(`div`);E.className=`viz wbv`;let D=document.createElement(`div`);D.className=`viz__stage`,E.appendChild(D);let O=T(`svg`,{class:`viz__svg wbv__svg`,viewBox:`0 0 660 332`,role:`img`,"aria-label":`单词拆分 LC139 推演动画`});D.appendChild(O);let k=T(`g`,{}),A=T(`g`,{}),j=T(`g`,{});O.append(k,A,j);let M=T(`text`,{class:`wbv-note`,x:26,y:u});M.textContent=`枚举"最后一个词"：s[j:i] 在字典里，且 dp[j] 为真`,j.appendChild(M);let N=T(`text`,{class:`wbv-note wbv-note--r`,x:634,y:u});N.textContent=`s = "${C}" · 字典 [${re.map(e=>`"${e}"`).join(`, `)}]`,j.appendChild(N);let P=w+1,F=Math.min(46,Math.floor((y-(P-1)*5)/P)),I=(660-(P*F+(P-1)*5))/2,L=e=>I+e*(F+5),ae=e=>I+(e+.5)*(F+5),R=T(`rect`,{class:`wbv-band`,x:0,y:f-5,width:0,height:50,rx:8});k.appendChild(R);let z=T(`text`,{class:`wbv-lbl`,x:26,y:d});z.textContent=`dp[i] = s 的前 i 个字符能不能拼出（0 = 空串）`,j.appendChild(z);let B=[];for(let e=0;e<=w;e+=1){let t=L(e),n=T(`g`,{class:`wbv-cell`});n.appendChild(T(`rect`,{class:`wbv-cell__box`,x:t,y:f,width:F,height:p,rx:6}));let r=T(`text`,{class:`wbv-cell__val`,x:t+F/2,y:73});n.appendChild(r);let i=T(`text`,{class:`wbv-cell__idx`,x:t+F/2,y:90});i.textContent=String(e),n.appendChild(i),A.appendChild(n),B.push({g:n,val:r})}let V=T(`text`,{class:`wbv-lbl`,x:26,y:m});V.textContent=`s 的字符：候选最后一段 s[j:i] 从边界 j 跨到 i`,j.appendChild(V);let oe=C.split(``).map((e,t)=>{let n=ae(t),r=T(`g`,{}),i=T(`rect`,{class:`wbv-ch`,x:n,y:h,width:F,height:g,rx:6}),a=T(`text`,{class:`wbv-ch__val`,x:n+F/2,y:143});return a.textContent=e,r.append(i,a),A.appendChild(r),{box:i,val:a}}),H=T(`line`,{class:`wbv-cut`,x1:0,y1:f-5,x2:0,y2:167});j.appendChild(H),j.appendChild(T(`rect`,{class:`wbv-banner__box`,x:26,y:_,width:608,height:ee,rx:9}));let U=T(`text`,{class:`wbv-banner__text`,x:660/2,y:198});j.appendChild(U),j.appendChild(T(`rect`,{class:`wbv-panel__box`,x:26,y:te,width:608,height:ne,rx:9}));let W=(e,t)=>{let n=T(`text`,{class:`wbv-panel__label`,x:t,y:249});n.textContent=e;let r=T(`text`,{class:`wbv-panel__num`,x:t,y:271});return j.append(n,r),r},G=W(`i`,660/2-230),K=W(`j`,660/2-115),se=W(`跳过 dp[j]=false`,660/2),q=W(`s[j:i]`,445),J=W(`结果`,560),Y=T(`text`,{class:`wbv-phase__text`,x:660/2,y:v});j.appendChild(Y);let X=document.createElement(`p`);X.className=`viz__desc`,X.setAttribute(`aria-live`,`polite`);function ce(t,n){if(!n)return;let r=n.phase===`probe`,i=r&&n.j>=0,a=n.i;r&&n.hi>=n.lo?(R.setAttribute(`x`,String(L(n.lo)-3)),R.setAttribute(`width`,String(L(n.hi)+F-(L(n.lo)-3)))):R.setAttribute(`width`,`0`),B.forEach((e,t)=>{let o=[`wbv-cell`];i&&t===n.j?o.push(`is-from`):r&&t===a?(o.push(`is-target`),n.hit&&o.push(`is-hit`)):!r||t<a?o.push(n.dp[t]?`is-true`:`is-dead`):o.push(`is-ahead`),e.g.setAttribute(`class`,o.join(` `)),e.val.textContent=n.dp[t]?`T`:`F`}),oe.forEach((e,t)=>{let r=`wbv-ch`;i&&t>=n.j&&t<a?r+=` is-word`:n.phase===`done`&&n.result||a>=0&&t<a?r+=` is-prefix`:r+=` is-ahead`,e.box.setAttribute(`class`,r)}),a>=0?(H.setAttribute(`x1`,String(L(a)+F/2)),H.setAttribute(`x2`,String(L(a)+F/2)),H.setAttribute(`opacity`,`0.8`)):H.setAttribute(`opacity`,`0`),i?(U.textContent=`dp[${a}] = dp[${n.j}] && s[${n.j}:${a}] ∈ dict = ${n.dpJ?`true`:`false`} && ${n.inDict?`true`:`false`} = ${n.hit?`true`:`false`}`,U.setAttribute(`class`,`wbv-banner__text`+(n.hit?` is-ok`:``))):r?(U.textContent=`窗口 j ∈ [${n.lo}, ${n.hi}] 内 dp[j] 全为 false → dp[${a}] = false`,U.setAttribute(`class`,`wbv-banner__text`)):n.phase===`done`?(U.textContent=n.result?`答案 true：${n.segments.join(` | `)}`:`答案 false：dp[${w}] 始终为 false`,U.setAttribute(`class`,`wbv-banner__text`+(n.result?` is-ok`:``))):(U.textContent=`dp[i] = OR( dp[j] && s[j:i] ∈ dict )　dp[0] = true`,U.setAttribute(`class`,`wbv-banner__text`)),G.textContent=a<0?`—`:String(a),K.textContent=i?String(n.j):`—`,se.textContent=r?String(n.skipped):`—`,q.textContent=i?`"${n.seg}"`:`—`,q.setAttribute(`class`,`wbv-panel__num`+(i&&n.inDict?` is-fresh`:``)),J.textContent=String(n.result),J.setAttribute(`class`,`wbv-panel__num`+(n.phase===`done`?n.result?` is-ok`:` is-dead`:``)),n.phase===`init`?Y.textContent=`dp[0] = true 是唯一底座；其余从 false 开始被"命中"翻上来`:r?Y.textContent=n.hit?`命中即短路：dp[${a}] 已为 true，本格剩下的切分点不再试`:i?`这个切分点不成立，继续试下一个 j`:`前一段自己都拼不出来，这一格只能停在 false`:Y.textContent=n.result?`每个 true 的 dp[i] 背后都连着一条完整的切分链`:`布尔或全 false：没有任何一条通路能走到 n`,e(X,n.desc)}E.appendChild(X);let Z=i();E.appendChild(Z.root),a.textContent=``,a.appendChild(E),n();let le=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:s,controls:Z,intervalMs:b,onRender:ce});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return x&&!le&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(E)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.wordbreakMounted,document.getElementById(l)?.remove()}}}export{C as mountWordBreak};