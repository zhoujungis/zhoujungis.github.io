import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=`applepenapple`,o=[`apple`,`pen`];function s(e={}){let t=typeof e.s==`string`&&e.s.length>0?e.s:a,n=Array.isArray(e.words)?e.words:[],r=[...new Set(n.filter(e=>typeof e==`string`&&e.length>0))];return{s:t,words:r.length>0?r:[...o]}}function c(e={}){let{s:t,words:n}=s(e),r=t.length,i=n.reduce((e,t)=>Math.max(e,t.length),0),a=new Set(n),o=Array(r+1).fill(!1);o[0]=!0;for(let e=1;e<=r;e+=1){let n=Math.max(0,e-i);for(let r=n;r<e;r+=1)if(o[r]&&a.has(t.slice(r,e))){o[e]=!0;break}}let c=[],l=[],u=[r],d=r,f=o[r],p=(e,a,s={})=>{c.push({phase:e,desc:a,s:t,words:[...n],n:r,maxLen:i,pos:-1,j:-1,seg:``,dpJ:!1,inDict:!1,hit:!1,lo:0,hi:-1,dp:[...o],locked:l.map(e=>({...e})),segments:[],chain:[...u],result:f,done:e===`done`,...s})};for(p(`init`,`先把 dp 表算出来（与动画一同一台机器）：\`dp[i] = OR( dp[j] && s[j:i] ∈ dict )\`，底座 \`dp[0] = true\`，窗口 \`j ∈ [i - ${i}, i - 1]\`（\`maxLen = ${i}\`）。\`s = "${t}"\`（${r} 个字符），字典 \`[${n.map(e=>`"${e}"`).join(`, `)}]\`，\`dp[${r}] = ${f}\`。这一遍不看"怎么填表"，而看**"表算好之后，怎么把 s 真的切成词"** —— dp 只回答了"能不能"，它没有记住"怎么切"。做法是从右往左走：在位置 \`pos\` 找一个切分点 \`j\`，使 \`dp[j] = true\` 且 \`s[j:pos]\` 在字典里，那 \`s[j:pos]\` 就可以当**最后一个词**，然后把 \`pos\` 挪到 \`j\` 继续往左 —— 走到 \`pos = 0\` 就切完了。扫描方向是 \`j\` 从 \`pos - 1\` 递减（最后一段**从短到长**）。`);d>0;){let e=Math.max(0,d-i),n=d-1,r=!1;for(let s=n;s>=e;--s){let c=t.slice(s,d),f=o[s],m=a.has(c),h=f&&m,g=e>0?`窗口左端 \`${e} = ${d} - ${i}\`：再往左的最后一段就超过 ${i} 个字符了。`:``;if(h){l.push({start:s,end:d,word:c}),l.sort((e,t)=>e.start-t.start),u.push(s);let t=s;p(`scan`,`右端 \`pos = ${d}\`：从 \`j = ${n}\` 往左试，到 \`j = ${s}\` **命中** —— \`dp[${s}] = true\`、\`s[${s}:${d}] = "${c}"\` 在字典里。于是最后一段锁定为 \`"${c}"\`，把 \`pos\` 挪到 \`${t}\`，继续往左找剩下的前缀。`+g,{pos:d,j:s,seg:c,dpJ:f,inDict:m,hit:!0,lo:e,hi:n}),d=t,r=!0;break}p(`scan`,`右端 \`pos = ${d}\`，试 \`j = ${s}\`：候选最后一段 \`s[${s}:${d}] = "${c}"\` —— `+(f?`\`dp[${s}] = true\`（前缀拼得出）没问题，但 \`"${c}"\` 不在字典里，这条路作废。`:`\`dp[${s}] = false\` —— 前缀 \`"${t.slice(0,s)}"\` 自己就拼不出来，后面接什么词都没用，跳过。`)+g,{pos:d,j:s,seg:c,dpJ:f,inDict:m,hit:!1,lo:e,hi:n})}if(!r)break}let m=l.map(e=>e.word);return p(`done`,(f?`切完：\`${m.join(` | `)}\`（${m.length} 段），切分点链 \`${u.join(` → `)}\`。整个过程**没有额外的 cut 表** —— \`dp\` 表本身就是"每个位置能不能拼出"的完整信息：只要 \`dp[j] = true\` 且 \`s[j:pos]\` 是词，这一段就一定接得上。把"找到一个就停"换成"DFS 枚举所有 j"、再配记忆化，就是 LC 140 单词拆分 II 的标准解。`:`\`dp[${r}] = false\`：从 \`pos = ${r}\` 往左一个能接上的 j 都没有，整串切不开。回溯的前提是 \`dp[${r}] = true\` —— dp 为 false 时连第一步都迈不出去。`)+'回头对照：动画一是**填表**（枚举"最后一个词"、正序推进），动画二是**读表**（从 n 往回切）—— 同一张 `dp`，一个负责"能不能"，一个负责"怎么切"。',{done:!0,segments:m,chain:[...u]}),c}var l=`wordbreakseg-styles`,u=28,d=46,f=54,p=34,m=104,h=112,g=46,ee=172,_=186,te=44,ne=244,v=54,re=320,ie=604,ae=1250,y=`
.wbs { display: flex; flex-direction: column; gap: 14px; }
.wbs__svg { width: 100%; height: auto; display: block; }

.wbs-note {
  fill: var(--wbs-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-note--r { text-anchor: end; }
.wbs-lbl {
  fill: var(--wbs-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-seg {
  fill: var(--wbs-ok, #3f6b57); font-size: 11px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.wbs-cell__box {
  fill: var(--wbs-fill, #ffffff); stroke: var(--wbs-line, #c3c9c2); stroke-width: 1.5;
}
.wbs-cell__val {
  fill: var(--wbs-ink, #1f2a24); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-cell__idx {
  fill: var(--wbs-dim, #9aa39c); font-size: 9px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-cell.is-true .wbs-cell__box { fill: var(--wbs-ok-fill, #eef5f1); stroke: var(--wbs-ok, #3f6b57); stroke-width: 2; }
.wbs-cell.is-true .wbs-cell__val { fill: var(--wbs-ok, #3f6b57); }
.wbs-cell.is-dead .wbs-cell__val { fill: var(--wbs-dim, #9aa39c); font-weight: 500; }
.wbs-cell.is-target .wbs-cell__box {
  fill: var(--wbs-gold-fill, #fdf3e3); stroke: var(--wbs-gold, #c2872f); stroke-width: 3;
}
.wbs-cell.is-target .wbs-cell__val { fill: var(--wbs-gold, #c2872f); }
.wbs-cell.is-from .wbs-cell__box {
  fill: var(--wbs-ok-fill, #eef5f1); stroke: var(--wbs-ok, #3f6b57); stroke-width: 3;
}
.wbs-cell.is-from .wbs-cell__val { fill: var(--wbs-ok, #3f6b57); }

.wbs-ch {
  fill: var(--wbs-fill, #ffffff); stroke: var(--wbs-line, #c3c9c2); stroke-width: 1.5;
}
.wbs-ch__val {
  fill: var(--wbs-ink, #1f2a24); font-size: 17px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-ch.is-ahead { fill: var(--wbs-past, #eef0ec); stroke-dasharray: 3 3; }
.wbs-ch.is-ahead + .wbs-ch__val { fill: var(--wbs-dim, #9aa39c); }
.wbs-ch.is-try {
  fill: var(--wbs-try, #f6f2ea); stroke: var(--wbs-muted, #657168); stroke-width: 1.5;
  stroke-dasharray: 4 3;
}
.wbs-ch.is-try + .wbs-ch__val { fill: var(--wbs-muted, #657168); }
.wbs-ch.is-locked { fill: var(--wbs-ok-fill, #eef5f1); stroke: var(--wbs-ok, #3f6b57); stroke-width: 2; }
.wbs-ch.is-locked + .wbs-ch__val { fill: var(--wbs-ok, #3f6b57); }
.wbs-ch.is-word { fill: var(--wbs-gold-fill, #fdf3e3); stroke: var(--wbs-gold, #c2872f); stroke-width: 3; }
.wbs-ch.is-word + .wbs-ch__val { fill: var(--wbs-gold, #c2872f); }

.wbs-cursor { stroke: var(--wbs-gold, #c2872f); stroke-width: 2; }
.wbs-cursor__cap {
  fill: var(--wbs-gold, #c2872f); font-size: 11px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.wbs-banner__box {
  fill: var(--wbs-banner, #f4f3ef); stroke: var(--wbs-line, #c3c9c2); stroke-width: 1.5;
}
.wbs-banner__text {
  fill: var(--wbs-hot, #a45f45); font-size: 13.5px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-banner__text.is-ok { fill: var(--wbs-ok, #3f6b57); }

.wbs-panel__box {
  fill: var(--wbs-fill, #ffffff); stroke: var(--wbs-line, #c3c9c2); stroke-width: 1.5;
}
.wbs-panel__label {
  fill: var(--wbs-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-panel__num {
  fill: var(--wbs-ink, #1f2a24); font-size: 17px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-panel__num.is-ok { fill: var(--wbs-ok, #3f6b57); }
.wbs-panel__num.is-dead { fill: var(--wbs-dim, #9aa39c); }
.wbs-panel__num.is-fresh { fill: var(--wbs-gold, #c2872f); }

.wbs-phase__text {
  fill: var(--wbs-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function b(){if(document.getElementById(l))return;let e=document.createElement(`style`);e.id=l,e.textContent=y,document.head.appendChild(e)}function x(a,o={}){if(!a||a.dataset.wordbreaksegMounted===`1`)return{destroy(){}};a.dataset.wordbreaksegMounted=`1`,b();let s=c(o),y=o.autoplay!==!1,{s:x,words:oe,n:S}=s[0],C=r,w=document.createElement(`div`);w.className=`viz wbs`;let T=document.createElement(`div`);T.className=`viz__stage`,w.appendChild(T);let E=C(`svg`,{class:`viz__svg wbs__svg`,viewBox:`0 0 660 342`,role:`img`,"aria-label":`单词拆分 LC139 切分还原动画`});T.appendChild(E);let D=C(`g`,{}),O=C(`g`,{});E.append(D,O);let k=C(`text`,{class:`wbs-note`,x:26,y:u});k.textContent=`dp 只回答"能不能"；从 n 往左走，才把 s 切成词`,O.appendChild(k);let A=C(`text`,{class:`wbs-note wbs-note--r`,x:634,y:u});A.textContent=`s = "${x}" · 字典 [${oe.map(e=>`"${e}"`).join(`, `)}]`,O.appendChild(A);let j=S+1,M=Math.min(46,Math.floor((ie-(j-1)*5)/j)),N=(660-(j*M+(j-1)*5))/2,P=e=>N+e*(M+5),F=e=>N+(e+.5)*(M+5),I=C(`text`,{class:`wbs-lbl`,x:26,y:d});I.textContent=`算好的 dp 表（T = 这一段前缀拼得出）`,O.appendChild(I);let L=[];for(let e=0;e<=S;e+=1){let t=P(e),n=C(`g`,{class:`wbs-cell`});n.appendChild(C(`rect`,{class:`wbs-cell__box`,x:t,y:f,width:M,height:p,rx:5}));let r=C(`text`,{class:`wbs-cell__val`,x:t+M/2,y:68});n.appendChild(r);let i=C(`text`,{class:`wbs-cell__idx`,x:t+M/2,y:82});i.textContent=String(e),n.appendChild(i),D.appendChild(n),L.push({g:n,val:r})}let R=C(`text`,{class:`wbs-lbl`,x:26,y:m});R.textContent=`把 s 逐段切出来：绿 = 已锁定，金 = 正在试，虚线 = 还没切到`,O.appendChild(R);let z=x.split(``).map((e,t)=>{let n=F(t),r=C(`g`,{}),i=C(`rect`,{class:`wbs-ch`,x:n,y:h,width:M,height:g,rx:6}),a=C(`text`,{class:`wbs-ch__val`,x:n+M/2,y:135});return a.textContent=e,r.append(i,a),D.appendChild(r),{box:i}}),se=x.split(``).map(()=>{let e=C(`text`,{class:`wbs-seg`,x:0,y:ee});return O.appendChild(e),e}),B=C(`line`,{class:`wbs-cursor`,x1:0,y1:f,x2:0,y2:162}),V=C(`text`,{class:`wbs-cursor__cap`,x:0,y:174});O.append(B,V),O.appendChild(C(`rect`,{class:`wbs-banner__box`,x:26,y:_,width:608,height:te,rx:9}));let H=C(`text`,{class:`wbs-banner__text`,x:660/2,y:208});O.appendChild(H),O.appendChild(C(`rect`,{class:`wbs-panel__box`,x:26,y:ne,width:608,height:v,rx:9}));let U=(e,t)=>{let n=C(`text`,{class:`wbs-panel__label`,x:t,y:259});n.textContent=e;let r=C(`text`,{class:`wbs-panel__num`,x:t,y:281});return O.append(n,r),r},W=U(`pos`,660/2-230),G=U(`j`,660/2-115),K=U(`dp[j]`,660/2),q=U(`s[j:pos]`,445),J=U(`结果`,560),Y=C(`text`,{class:`wbs-phase__text`,x:660/2,y:re});O.appendChild(Y);let X=document.createElement(`p`);X.className=`viz__desc`,X.setAttribute(`aria-live`,`polite`);function ce(t,n){if(!n)return;let r=n.phase===`scan`,i=n.pos,a=n.j,o=r&&n.hit?{start:a,end:i}:null;L.forEach((e,t)=>{let o=[`wbs-cell`];r&&t===a?o.push(`is-from`):r&&t===i&&o.push(`is-target`),o.push(n.dp[t]?`is-true`:`is-dead`),e.g.setAttribute(`class`,o.join(` `)),e.val.textContent=n.dp[t]?`T`:`F`});let s=e=>n.locked.some(t=>e>=t.start&&e<t.end);z.forEach((e,t)=>{let n=`wbs-ch`;o&&t>=o.start&&t<o.end?n+=` is-word`:s(t)?n+=` is-locked`:r&&t>=a&&t<i?n+=` is-try`:n+=` is-ahead`,e.box.setAttribute(`class`,n)});let c=[...n.locked].sort((e,t)=>e.start-t.start);if(se.forEach((e,t)=>{let n=c[t];if(!n){e.textContent=``;return}let r=F(n.start),i=F(n.end-1)+M;e.setAttribute(`x`,String((r+i)/2)),e.textContent=`"${n.word}"`}),i>=0){let e=P(i)+M/2;B.setAttribute(`x1`,String(e)),B.setAttribute(`x2`,String(e)),B.setAttribute(`opacity`,`1`),V.setAttribute(`x`,String(e)),V.textContent=`pos=${i}`,V.setAttribute(`opacity`,`1`)}else B.setAttribute(`opacity`,`0`),V.setAttribute(`opacity`,`0`);r?(H.textContent=`dp[${a}] = ${n.dpJ?`true`:`false`} && s[${a}:${i}] = "${n.seg}" ${n.inDict?`∈`:`∉`} dict → ${n.hit?`锁定这一段`:`作废`}`,H.setAttribute(`class`,`wbs-banner__text`+(n.hit?` is-ok`:``))):n.phase===`done`?(H.textContent=n.result?`切分：${n.segments.join(` | `)}`:`返回 false：dp[${S}] 始终为 false`,H.setAttribute(`class`,`wbs-banner__text`+(n.result?` is-ok`:``))):(H.textContent=`dp[i] = OR( dp[j] && s[j:i] ∈ dict )　dp[${S}] = true`,H.setAttribute(`class`,`wbs-banner__text is-ok`)),W.textContent=i<0?`—`:String(i),G.textContent=r?String(a):`—`,K.textContent=r?n.dpJ?`true`:`false`:`—`,K.setAttribute(`class`,`wbs-panel__num`+(r?n.dpJ?` is-ok`:` is-dead`:``)),q.textContent=r?`"${n.seg}"`:`—`,q.setAttribute(`class`,`wbs-panel__num`+(r&&n.inDict?` is-fresh`:``)),J.textContent=String(n.result),J.setAttribute(`class`,`wbs-panel__num`+(n.phase===`done`?n.result?` is-ok`:` is-dead`:``)),n.phase===`init`?Y.textContent=`dp 表已经算好；现在从 n 往左，一段一段把 s 切出来`:r?Y.textContent=n.hit?`命中：这一段就是最后一个词，把 pos 左移到它的起点`:`这一段接不上（词不在字典里，或前缀 dp[j] 为假）`:Y.textContent=n.result?`dp 表 + 贪心回溯就够切出一条合法方案；要枚举所有方案就是 LC 140`:`dp[n] 为 false，从最后一步就迈不出去`,e(X,n.desc)}w.appendChild(X);let Z=i();w.appendChild(Z.root),a.textContent=``,a.appendChild(w),n();let le=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:s,controls:Z,intervalMs:ae,onRender:ce});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return y&&!le&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(w)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.wordbreaksegMounted,document.getElementById(l)?.remove()}}}export{x as mountWordBreakSeg};