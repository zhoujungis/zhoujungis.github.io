import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=`abacaba`;function o(e={}){let t=typeof e.p==`string`&&e.p.length>=1?e.p:a;return{p:t,n:t.length}}function s(e={}){let{p:t,n}=o(e),r=Array(n).fill(0),i=0,a=0,s=0,c=1,l=[],u=(e,o,u={})=>{l.push({phase:e,desc:o,p:t,n,i:-1,jBefore:i,jAfter:i,chI:``,chJ:``,match:!1,prevNext:r.slice(),next:r.slice(),retreats:a,comparisons:s,knownCount:c,done:e===`done`,...u})};u(`init`,`p = "${t}"（${n} 个字符）。定义：\`next[i]\` = \`p[0..i]\` 这个子串的**最长相等真前后缀**长度 —— 「真」指不含子串本身，所以 \`next[0] = 0\` **恒成立**。求法一句话：**自己跟自己匹配**。 维护 \`j\` = 已匹配的前缀长度（也是下一个要和 \`p[i]\` 比的 p 下标），从 \`i = 1\` 起：先 \`while j > 0 且 p[i] != p[j]\` 就 \`j = next[j-1]\` 回退，再 \`if p[i] == p[j]\` 就 \`j += 1\`，最后 \`next[i] = j\`。另有把首项记作 \`-1\` 的定义（严蔚敏《数据结构》），与本文的关系是 \`B = [-1] + A[0..n-2]\` —— **面试先确认用哪种**，本文默认前者（前缀函数）。`);for(let e=1;e<n;e+=1){let o=!1;for(;i>0;){let n=t[e],c=t[i],l=n===c;if(s+=1,u(`compare`,`比较 \`p[${e}] = '${n}'\` 与 \`p[${i}] = '${c}'\`：**${l?`相等`:`不等`}**。进入比较前有一步不变量：\`p[0..${i-1}]\` 与 \`p[${e-i}..${e-1}]\` **逐字相等** —— \`j\` 正是「当前最长的、能接下去的前缀」的长度。`,{i:e,jBefore:i,jAfter:i,chI:n,chJ:c,match:l}),l){o=!0;break}let d=i,f=r[d-1];a+=1,u(`retreat`,`\`p[${e}]\` 与 \`p[${d}]\` 对不上，把 \`j\` 从 ${d} 回退到 \`next[${d-1}] = ${f}\`。**回退不是退步**：它换的是「更短但仍接得上的前后缀」，靠的正是 \`next[j-1]\` 记着 \`p[0..${d-1}]\` 自身的最长相等前后缀（长度 ${f}）。`,{i:e,jBefore:d,jAfter:f,chI:t[e],chJ:t[d],match:!1}),i=f}if(!o){let n=t[e],r=t[0],i=n===r;s+=1,u(`compare`,`比较 \`p[${e}] = '${n}'\` 与 \`p[0] = '${r}'\`：**${i?`相等`:`不等`}**。`+(i?`前缀可以再长一位。`:`而 \`j\` 已是 0，没有更短的候选可退 —— 只能 \`next[${e}] = 0\`。`),{i:e,jBefore:0,jAfter:0,chI:n,chJ:r,match:i}),i&&(o=!0)}let l=i,d=o?i+1:i,f=r.slice();r[e]=d,i=d,c=e+1,u(`assign`,`定下 \`next[${e}] = ${d}\`，\`j\` 更新为 ${d}`+(o?"（比较相等，`j` 前进一位）":"（比较不等且 `j` 已是 0，停在 0）")+(e+1<n?`。下一步 \`i\` 走到 ${e+1}。`:`。`),{i:e,jBefore:l,jAfter:d,chI:t[e],chJ:t[l],match:o,prevNext:f,next:r.slice(),knownCount:c})}let d=[-1,...r.slice(0,Math.max(0,n-1))];return u(`done`,`循环走完，**next = [${r.join(`,`)}]**（p = "${t}"）。每个 \`next[i]\` 都等于 \`p[0..i]\` 的最长相等真前后缀长度。把首项记作 \`-1\` 的那种定义（严蔚敏版）写作 \`[${d.join(`,`)}]\`，与本文只差一次整体移位。求 next 是 **O(n)**：\`j\` 每次最多自增 1、回退总量不超过自增总量，均摊线性。拿到 next 之后，用它做 KMP 匹配也是 \`O(n + m)\`。`,{i:-1,jBefore:i,jAfter:i,knownCount:n,done:!0}),l}var c=`kmp-styles`,l=1e3,u=680,d=22,f=44,p=52,m=46,h=113,g=131,ee=152,_=42,v=216,y=44,b=274,te=58,x=350,S=372,C=`
.lk { display: flex; flex-direction: column; gap: 14px; }
.lk__svg { width: 100%; height: auto; display: block; }

.lk-note {
  fill: var(--lk-muted, #657168); font-size: 12.5px; text-anchor: start;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-note--r { text-anchor: end; }
.lk-side {
  fill: var(--lk-dim, #9aa39c); font-size: 11px; text-anchor: end;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-idx {
  fill: var(--lk-dim, #9aa39c); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.lk-cell__box {
  fill: var(--lk-fill, #ffffff);
  stroke: var(--lk-line, #c3c9c2);
  stroke-width: 1.6;
}
.lk-cell__ch {
  fill: var(--lk-ink, #1f2a24); font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-cell.is-window .lk-cell__box { fill: var(--lk-ok-fill, #eef5f1); stroke: var(--lk-ok, #3f6b57); }
.lk-cell.is-window .lk-cell__ch { fill: var(--lk-ok, #3f6b57); }
.lk-cell.is-hot .lk-cell__box { stroke: var(--lk-hot, #a45f45); stroke-width: 3.2; }
.lk-cell.is-hot .lk-cell__ch { fill: var(--lk-hot, #a45f45); }
.lk-cell.is-match .lk-cell__box { fill: var(--lk-ok-fill, #eef5f1); stroke: var(--lk-ok, #3f6b57); }
.lk-cell.is-match .lk-cell__ch { fill: var(--lk-ok, #3f6b57); }

.lk-ncell__box {
  fill: var(--lk-muted-fill, #f7f6f2);
  stroke: var(--lk-line, #c3c9c2); stroke-width: 1.5;
}
.lk-ncell__val {
  fill: var(--lk-ink, #1f2a24); font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-ncell.is-unknown .lk-ncell__box { stroke-dasharray: 4 3; }
.lk-ncell.is-unknown .lk-ncell__val { fill: var(--lk-dim, #9aa39c); font-weight: 500; }
.lk-ncell.is-known .lk-ncell__box { fill: var(--lk-ok-fill, #eef5f1); stroke: var(--lk-ok, #3f6b57); }
.lk-ncell.is-known .lk-ncell__val { fill: var(--lk-ok, #3f6b57); }
.lk-ncell.is-newi .lk-ncell__box { fill: var(--lk-gold-fill, #fdf3e3); stroke: var(--lk-gold, #c2872f); stroke-width: 3.2; }
.lk-ncell.is-newi .lk-ncell__val { fill: var(--lk-gold, #c2872f); }
.lk-ncell.is-src .lk-ncell__box { stroke: var(--lk-hot, #a45f45); stroke-width: 3; }

.lk-chip__dot { fill: var(--lk-fill, #ffffff); stroke: var(--lk-chrome, #657168); stroke-width: 1.6; }
.lk-chip__t { fill: var(--lk-chrome, #657168); font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.lk-chip--i .lk-chip__dot { stroke: var(--lk-hot, #a45f45); }
.lk-chip--i .lk-chip__t { fill: var(--lk-hot, #a45f45); }
.lk-chip--j .lk-chip__dot { stroke: var(--lk-gold, #c2872f); }
.lk-chip--j .lk-chip__t { fill: var(--lk-gold, #c2872f); }
.lk-chip--jt .lk-chip__dot { stroke: var(--lk-ok, #3f6b57); }
.lk-chip--jt .lk-chip__t { fill: var(--lk-ok, #3f6b57); }

.lk-link { stroke: var(--lk-hot, #a45f45); stroke-width: 2; fill: none; stroke-dasharray: 5 4; }

.lk-banner__box {
  fill: var(--lk-banner, #f4f3ef); stroke: var(--lk-line, #c3c9c2); stroke-width: 1.5;
}
.lk-banner__text {
  fill: var(--lk-hot, #a45f45); font-size: 13.5px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-banner__text.is-ok { fill: var(--lk-ok, #3f6b57); }
.lk-banner__text.is-gold { fill: var(--lk-gold, #c2872f); }

.lk-panel__box { fill: var(--lk-fill, #ffffff); stroke: var(--lk-line, #c3c9c2); stroke-width: 1.5; }
.lk-panel__label {
  fill: var(--lk-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-panel__num {
  fill: var(--lk-ink, #1f2a24); font-size: 16px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-panel__num.is-gold { fill: var(--lk-gold, #c2872f); }
.lk-panel__num.is-ok { fill: var(--lk-ok, #3f6b57); }
.lk-panel__num.is-small { font-size: 12.5px; }

.lk-phase__text {
  fill: var(--lk-muted, #657168); font-size: 13px; font-weight: 600; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function w(){if(document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=C,document.head.appendChild(e)}function T(a,o={}){if(!a||a.dataset.kmpMounted===`1`)return{destroy(){}};a.dataset.kmpMounted=`1`,w();let C=s(o),{p:T,n:E}=C[0],D=r,O=document.createElement(`div`);O.className=`viz lk`;let k=document.createElement(`div`);k.className=`viz__stage`,O.appendChild(k);let A=Math.min(64,Math.floor((u-56-(E-1)*8)/E)),ne=(u-(E*A+(E-1)*8))/2,j=e=>ne+e*(A+8),M=e=>j(e)+A/2,re=Math.max(15,Math.min(24,Math.round(A/2.3))),ie=Math.max(12,Math.min(17,Math.round(A/3.2))),N=D(`svg`,{class:`viz__svg lk__svg`,viewBox:`0 0 ${u} ${S}`,role:`img`,"aria-label":`KMP 求 next 数组推演动画`}),P=D(`g`,{}),F=D(`g`,{}),I=D(`g`,{});N.append(P,F,I),k.appendChild(N);let L=D(`text`,{class:`lk-note`,x:26,y:d});L.textContent=`next[i] = p[0..i] 的最长相等真前后缀的长度`,I.appendChild(L);let R=D(`text`,{class:`lk-note lk-note--r`,x:u-26,y:d});R.textContent=`p = "${T}" · n = ${E}`,I.appendChild(R);let z=(e,t)=>{let n=D(`text`,{class:`lk-side`,x:ne-12,y:t});n.textContent=e,I.appendChild(n)};z(`p`,75),z(`next`,173);let B=[];for(let e=0;e<E;e+=1){let t=D(`text`,{class:`lk-idx`,x:M(e),y:f});t.textContent=String(e),I.appendChild(t);let n=D(`g`,{class:`lk-cell`});n.appendChild(D(`rect`,{class:`lk-cell__box`,x:j(e),y:p,width:A,height:m,rx:6}));let r=D(`text`,{class:`lk-cell__ch`,x:M(e),y:75,style:`font-size: ${re}px`});r.textContent=T[e],n.appendChild(r),P.appendChild(n),B.push({g:n,ch:r})}let V=[];for(let e=0;e<E;e+=1){let t=D(`g`,{class:`lk-ncell`});t.appendChild(D(`rect`,{class:`lk-ncell__box`,x:j(e),y:ee,width:A,height:_,rx:6}));let n=D(`text`,{class:`lk-ncell__val`,x:M(e),y:173,style:`font-size: ${ie}px`});t.appendChild(n),P.appendChild(t),V.push({g:t,val:n})}let H=e=>{let t=D(`g`,{class:`lk-chip ${e}`});t.appendChild(D(`circle`,{class:`lk-chip__dot`,cx:0,cy:0,r:10}));let n=D(`text`,{class:`lk-chip__t`,x:0,y:0,style:`font-size: 12px`});return t.append(n),I.appendChild(t),{g:t,t:n}},U=H(`lk-chip--i`);U.t.textContent=`i`;let W=H(`lk-chip--j`);W.t.textContent=`j`;let G=H(`lk-chip--jt`);G.t.textContent=`j`;let K=(e,t,n)=>e.g.setAttribute(`transform`,`translate(${t.toFixed(1)}, ${n})`),q=D(`path`,{class:`lk-link`,d:``});F.appendChild(q),I.appendChild(D(`rect`,{class:`lk-banner__box`,x:26,y:v,width:u-52,height:y,rx:9}));let J=D(`text`,{class:`lk-banner__text`,x:u/2,y:238});I.appendChild(J),I.appendChild(D(`rect`,{class:`lk-panel__box`,x:26,y:b,width:u-52,height:te,rx:9}));let Y=(e,t)=>{let n=u/2+(t-4/2)*116,r=D(`text`,{class:`lk-panel__label`,x:n,y:290});r.textContent=e;let i=D(`text`,{class:`lk-panel__num`,x:n,y:314});return I.append(r,i),i},ae=Y(`i`,0),oe=Y(`j`,1),se=Y(`比较次数`,2),ce=Y(`回退次数`,3),le=Y(`已定 next`,4),X=D(`text`,{class:`lk-phase__text`,x:u/2,y:x});I.appendChild(X);let Z=document.createElement(`p`);Z.className=`viz__desc`,Z.setAttribute(`aria-live`,`polite`);function ue(t,n){if(!n)return;let{phase:r,i,jBefore:a,jAfter:o,match:s,next:c,retreats:l,comparisons:u,knownCount:d}=n,f=r===`compare`,p=r===`retreat`,m=r===`assign`,_=r===`init`,v=r===`done`,y=0,b=-1;f||p?(y=a,b=i):m&&(y=o,b=i);let te=y-1,x=b>=0?b-y:-1,S=b>=0?b-1:-2,C=e=>y>0&&e>=0&&e<=te||y>0&&e>=x&&e<=S;B.forEach((e,t)=>{let n=[`lk-cell`];C(t)&&n.push(`is-window`),(f||m)&&t===i&&n.push(`is-hot`),f&&t===a&&n.push(`is-hot`),p&&t===a&&n.push(`is-hot`),f&&s&&t===a&&n.push(`is-match`),f&&s&&t===i&&n.push(`is-match`),e.g.setAttribute(`class`,n.join(` `))}),V.forEach((e,t)=>{let n=t<d,r=[`lk-ncell`,n?`is-known`:`is-unknown`];m&&t===i&&r.push(`is-newi`),p&&t===a-1&&r.push(`is-src`),e.g.setAttribute(`class`,r.join(` `)),e.val.textContent=n?String(c[t]):`·`});let w=i>=0;if(U.g.style.display=w?``:`none`,w&&K(U,M(i),h),f||p?(W.g.style.display=``,K(W,M(a),g)):W.g.style.display=`none`,p){G.g.style.display=``,K(G,M(o),h);let e=M(a),t=M(a-1),n=ee;q.setAttribute(`d`,`M ${e.toFixed(1)} ${98 .toFixed(1)} C ${e.toFixed(1)} ${120 .toFixed(1)}, ${t.toFixed(1)} ${(n-22).toFixed(1)}, ${t.toFixed(1)} ${n.toFixed(1)}`),q.style.display=``}else G.g.style.display=`none`,q.style.display=`none`;m&&(W.g.style.display=``,K(W,M(o),g)),_?(J.textContent=`next[0] = 0（定义）· j = 0 —— 从 i = 1 起「自己跟自己」比`,J.setAttribute(`class`,`lk-banner__text`)):f?(J.textContent=`p[${i}] = '${n.chI}'  vs  p[${a}] = '${n.chJ}'   →   ${s?`相等 ✓`:`不等 ✗`}`,J.setAttribute(`class`,`lk-banner__text`+(s?` is-ok`:``))):p?(J.textContent=`p[${i}] ≠ p[${a}]   →   j = next[${a-1}] = ${o}（回退）`,J.setAttribute(`class`,`lk-banner__text`)):m?(J.textContent=`next[${i}]  =  ${o}`,J.setAttribute(`class`,`lk-banner__text is-gold`)):(J.textContent=`next = [${c.join(`, `)}]`,J.setAttribute(`class`,`lk-banner__text is-ok`)),ae.textContent=_||v?`—`:String(i),ae.setAttribute(`class`,`lk-panel__num`),oe.textContent=String(o),oe.setAttribute(`class`,`lk-panel__num`+(o>0?` is-gold`:``)),se.textContent=String(u),se.setAttribute(`class`,`lk-panel__num`),ce.textContent=String(l),ce.setAttribute(`class`,`lk-panel__num`+(l>0?` is-gold`:``)),le.textContent=`${d} / ${E}`,le.setAttribute(`class`,`lk-panel__num is-small`+(d===E?` is-ok`:``)),_?X.textContent=`next[0] = 0 是定义、不用算；i 从 1 开始，j 从 0 开始`:f?X.textContent=s?`相等 → 前缀再长一位，j 前进`:`不等 → 该回退了（换个更短、但接得上的候选）`:p?X.textContent=`j 退到 next[j-1]：回退换的是候选前缀，不是丢掉已匹配部分`:m?X.textContent=`next[i] = j 落定；j 就是新的「已匹配前缀长度」`:X.textContent=`答案就是这张 next 表 —— 全算完，O(n)`,e(Z,n.desc)}O.appendChild(Z);let de=i();O.appendChild(de.root),a.textContent=``,a.appendChild(O),n();let fe=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:C,controls:de,intervalMs:l,onRender:ue});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return o.autoplay!==!1&&!fe&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(O)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.kmpMounted,document.getElementById(c)?.remove()}}}export{T as mountKmp};