import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=`abababacaba`,o=`abacaba`;function s(e){let t=e.length,n=Array(t).fill(0),r=0;for(let i=1;i<t;i+=1){for(;r>0&&e[i]!==e[r];)r=n[r-1];e[i]===e[r]&&(r+=1),n[i]=r}return n}function c(e={}){return{text:typeof e.text==`string`&&e.text.length>=1?e.text:a,p:typeof e.p==`string`&&e.p.length>=1?e.p:o}}function l(e,t){let n=e.length,r=t.length,i=0;for(let a=0;a+r<=n;a+=1){let n=0;for(;n<r&&(i+=1,e[a+n]===t[n]);)n+=1;if(n===r)break}return i}function u(e={}){let{text:t,p:n}=c(e),r=n.length,i=t.length,a=s(n),o=l(t,n),u=[],d=0,f=0,p=0,m=!1,h=-1,g=(e,s,c={})=>{u.push({phase:e,desc:s,text:t,p:n,n:r,m:i,next:a.slice(),i:-1,jBefore:d,jAfter:d,tch:``,pch:``,match:!1,matched:d,found:m,index:h,kmpComparisons:f,bruteComparisons:o,done:e===`done`,...c})};g(`init`,`主串 text = "${t}"（${i} 个字符），模式串 p = "${n}"（${r} 个字符），借用动画一算好的 \`next = [${a.join(`,`)}]\`。匹配时把 \`j\` 当作「已匹配的模式串前缀长度」：\`text[i]\` 与 \`p[j]\` 相等就 \`j += 1\`，一旦 \`j == n\` 就命中；不等且 \`j > 0\` 时 **主串指针 i 一动不动**，只把 \`j\` 退到 \`next[j-1]\` 接着比。这正是 next 数组的用武之地 —— 暴力匹配会在每个失配处从 \`i - j + 1\` 重新开始，而 KMP 把 \`i\` 领着一路向前、永不回头。`);outer:for(let e=0;e<i;e+=1){let i=!1;for(;d>0;){let r=t[e],o=n[d],s=r===o;f+=1;let c=d,l=s?d+1:d;if(g(`compare`,`比较 \`text[${e}] = '${r}'\` 与 \`p[${c}] = '${o}'\`：**${s?`相等`:`不等`}**。`+(s?`已匹配的模式串前缀长到 ${l}。`:`不等 —— 但 \`i\` 不动，把 \`j\` 退到 \`next[${c-1}] = ${a[c-1]}\` 接着比。`),{i:e,jBefore:c,jAfter:l,tch:r,pch:o,match:s,matched:l}),s){d=l,i=!0;break}let u=a[c-1];p+=1,g(`retreat`,`回退：\`j\` 从 ${c} 跳到 \`next[${c-1}] = ${u}\`。**主串指针 \`i\` 一动不动**，只换了个更短的候选前缀，继续和同一个 \`text[${e}]\` 比 —— 已匹配的那段 \`p[0..${c-1}]\` 里本就藏着长度 ${u} 的相等前后缀，不用重比。`,{i:e,jBefore:c,jAfter:u,tch:r,pch:o,match:!1,matched:u}),d=u}if(!i){let r=t[e],a=n[0],o=r===a;f+=1;let s=+!!o;g(`compare`,`\`j = 0\`：直接拿 \`text[${e}] = '${r}'\` 与 \`p[0] = '${a}'\` 比，**${o?`相等`:`不等`}**。`+(o?`起步了，已匹配前缀长到 1。`:"`j` 停在 0，看主串的下一个字符。"),{i:e,jBefore:0,jAfter:s,tch:r,pch:a,match:o,matched:s}),d=s,o&&(i=!0)}if(d===r){m=!0,h=e-r+1,g(`found`,`\`j == n = ${r}\` —— **命中！** 起点下标 = \`i - n + 1 = ${e} - ${r} + 1 = ${h}\`。这一段的模式串与 \`text[${h}..${e}] = "${t.slice(h,e+1)}"\` 逐字相等。回头数代价：KMP 只比了 ${f} 次，暴力要 ${o} 次 —— 差别就出在命中前，暴力在 \`s = 0, 1, 2, 3\` 每个起点都要**从头重比**。`,{i:e,jBefore:r-1,jAfter:r,tch:t[e],pch:n[r-1],match:!0,matched:r});break outer}}return m?g(`done`,`返回 **${h}**：模式串 \`p\` 在主串里第一次出现于下标 ${h}。KMP 的 \`O(n + m)\` 来自 **主串指针永不回头**：整个匹配过程中 \`i\` 只往前走 m 步，\`j\` 的回退总量也不超过它的前进总量，所以总比较次数是线性的 —— 这正是 next 数组买来的东西。（本例 KMP ${f} 次 vs 暴力 ${o} 次。）`,{i:-1,jBefore:r,jAfter:r,matched:r,done:!0}):g(`done`,"主串扫描完，`j` 始终没到 `n` —— **没找到模式串**，返回 `-1`。",{i:-1,jBefore:d,jAfter:d,matched:d,done:!0}),u}var d=`kmp-match-styles`,f=1e3,p=680,m=22,h=44,g=52,_=44,v=114,y=44,b=171,x=188,ee=206,S=234,C=44,te=292,ne=58,re=368,ie=390,w=`
.lk2 { display: flex; flex-direction: column; gap: 14px; }
.lk2__svg { width: 100%; height: auto; display: block; }

.lk2-note {
  fill: var(--lk2-muted, #657168); font-size: 12.5px; text-anchor: start;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-note--r { text-anchor: end; }
.lk2-side {
  fill: var(--lk2-dim, #9aa39c); font-size: 11px; text-anchor: end;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-idx {
  fill: var(--lk2-dim, #9aa39c); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.lk2-cell__box {
  fill: var(--lk2-fill, #ffffff); stroke: var(--lk2-line, #c3c9c2); stroke-width: 1.6;
}
.lk2-cell__ch {
  fill: var(--lk2-ink, #1f2a24); font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-cell.is-window .lk2-cell__box { fill: var(--lk2-ok-fill, #eef5f1); stroke: var(--lk2-ok, #3f6b57); }
.lk2-cell.is-window .lk2-cell__ch { fill: var(--lk2-ok, #3f6b57); }
.lk2-cell.is-hot .lk2-cell__box { stroke: var(--lk2-hot, #a45f45); stroke-width: 3.2; }
.lk2-cell.is-hot .lk2-cell__ch { fill: var(--lk2-hot, #a45f45); }
.lk2-cell.is-match .lk2-cell__box { fill: var(--lk2-ok-fill, #eef5f1); stroke: var(--lk2-ok, #3f6b57); stroke-width: 3.2; }
.lk2-cell.is-match .lk2-cell__ch { fill: var(--lk2-ok, #3f6b57); }
.lk2-cell.is-gap .lk2-cell__box { fill: var(--lk2-muted-fill, #f7f6f2); stroke: var(--lk2-line, #c3c9c2); stroke-dasharray: 4 3; }
.lk2-cell.is-found .lk2-cell__box { fill: var(--lk2-gold-fill, #fdf3e3); stroke: var(--lk2-gold, #c2872f); stroke-width: 3.2; }
.lk2-cell.is-found .lk2-cell__ch { fill: var(--lk2-gold, #c2872f); }

.lk2-pcell__box {
  fill: var(--lk2-fill, #ffffff); stroke: var(--lk2-line, #c3c9c2); stroke-width: 1.6;
}
.lk2-pcell__ch {
  fill: var(--lk2-ink, #1f2a24); font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-pcell.is-window .lk2-pcell__box { fill: var(--lk2-ok-fill, #eef5f1); stroke: var(--lk2-ok, #3f6b57); }
.lk2-pcell.is-window .lk2-pcell__ch { fill: var(--lk2-ok, #3f6b57); }
.lk2-pcell.is-hot .lk2-pcell__box { stroke: var(--lk2-hot, #a45f45); stroke-width: 3.2; }
.lk2-pcell.is-hot .lk2-pcell__ch { fill: var(--lk2-hot, #a45f45); }
.lk2-pcell.is-to .lk2-pcell__box { stroke: var(--lk2-ok, #3f6b57); stroke-width: 3.2; }
.lk2-pcell.is-to .lk2-pcell__ch { fill: var(--lk2-ok, #3f6b57); }
.lk2-pcell.is-match .lk2-pcell__box { fill: var(--lk2-ok-fill, #eef5f1); stroke: var(--lk2-ok, #3f6b57); stroke-width: 3.2; }
.lk2-pcell.is-match .lk2-pcell__ch { fill: var(--lk2-ok, #3f6b57); }
.lk2-pcell.is-found .lk2-pcell__box { fill: var(--lk2-gold-fill, #fdf3e3); stroke: var(--lk2-gold, #c2872f); stroke-width: 3.2; }
.lk2-pcell.is-found .lk2-pcell__ch { fill: var(--lk2-gold, #c2872f); }

.lk2-chip__dot { fill: var(--lk2-fill, #ffffff); stroke: var(--lk2-chrome, #657168); stroke-width: 1.6; }
.lk2-chip__t { fill: var(--lk2-chrome, #657168); font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.lk2-chip--i .lk2-chip__dot { stroke: var(--lk2-hot, #a45f45); }
.lk2-chip--i .lk2-chip__t { fill: var(--lk2-hot, #a45f45); }
.lk2-chip--j .lk2-chip__dot { stroke: var(--lk2-gold, #c2872f); }
.lk2-chip--j .lk2-chip__t { fill: var(--lk2-gold, #c2872f); }
.lk2-chip--jt .lk2-chip__dot { stroke: var(--lk2-ok, #3f6b57); }
.lk2-chip--jt .lk2-chip__t { fill: var(--lk2-ok, #3f6b57); }

.lk2-link { stroke: var(--lk2-hot, #a45f45); stroke-width: 2; fill: none; stroke-dasharray: 5 4; }

.lk2-banner__box { fill: var(--lk2-banner, #f4f3ef); stroke: var(--lk2-line, #c3c9c2); stroke-width: 1.5; }
.lk2-banner__text {
  fill: var(--lk2-hot, #a45f45); font-size: 13.5px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-banner__text.is-ok { fill: var(--lk2-ok, #3f6b57); }
.lk2-banner__text.is-gold { fill: var(--lk2-gold, #c2872f); }

.lk2-panel__box { fill: var(--lk2-fill, #ffffff); stroke: var(--lk2-line, #c3c9c2); stroke-width: 1.5; }
.lk2-panel__label {
  fill: var(--lk2-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-panel__num {
  fill: var(--lk2-ink, #1f2a24); font-size: 16px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-panel__num.is-gold { fill: var(--lk2-gold, #c2872f); }
.lk2-panel__num.is-ok { fill: var(--lk2-ok, #3f6b57); }
.lk2-panel__num.is-dead { fill: var(--lk2-dim, #9aa39c); }

.lk2-phase__text {
  fill: var(--lk2-muted, #657168); font-size: 13px; font-weight: 600; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function ae(){if(document.getElementById(d))return;let e=document.createElement(`style`);e.id=d,e.textContent=w,document.head.appendChild(e)}function T(a,o={}){if(!a||a.dataset.kmpMatchMounted===`1`)return{destroy(){}};a.dataset.kmpMatchMounted=`1`,ae();let s=u(o),{text:c,p:l,n:w,m:T}=s[0],E=r,D=document.createElement(`div`);D.className=`viz lk2`;let O=document.createElement(`div`);O.className=`viz__stage`,D.appendChild(O);let k=Math.min(42,Math.floor((p-56-(T-1)*6)/T)),A=(p-(T*k+(T-1)*6))/2,j=k+6,M=e=>A+e*j,N=e=>M(e)+k/2,P=Math.max(13,Math.min(20,Math.round(k/2.2))),oe=E(`svg`,{class:`viz__svg lk2__svg`,viewBox:`0 0 ${p} ${ie}`,role:`img`,"aria-label":`KMP 字符串匹配推演动画`}),se=E(`g`,{}),ce=E(`g`,{}),le=E(`g`,{}),F=E(`g`,{});oe.append(se,ce,le,F),O.appendChild(oe);let I=E(`text`,{class:`lk2-note`,x:26,y:m});I.textContent=`KMP：text[i] 与 p[j] 比，失配只回退 j，i 永不回头`,F.appendChild(I);let L=E(`text`,{class:`lk2-note lk2-note--r`,x:p-26,y:m});L.textContent=`text = "${c}" · p = "${l}"`,F.appendChild(L);let R=(e,t)=>{let n=E(`text`,{class:`lk2-side`,x:A-12,y:t});n.textContent=e,F.appendChild(n)};R(`text`,74),R(`p`,136);let z=[];for(let e=0;e<T;e+=1){let t=E(`text`,{class:`lk2-idx`,x:N(e),y:h});t.textContent=String(e),F.appendChild(t);let n=E(`g`,{class:`lk2-cell`});n.appendChild(E(`rect`,{class:`lk2-cell__box`,x:M(e),y:g,width:k,height:_,rx:6}));let r=E(`text`,{class:`lk2-cell__ch`,x:N(e),y:74,style:`font-size: ${P}px`});r.textContent=c[e],n.appendChild(r),se.appendChild(n),z.push({g:n,ch:r})}let B=[];for(let e=0;e<w;e+=1){let t=E(`g`,{class:`lk2-pcell`});t.appendChild(E(`rect`,{class:`lk2-pcell__box`,x:M(e),y:v,width:k,height:y,rx:6}));let n=E(`text`,{class:`lk2-pcell__ch`,x:M(e)+k/2,y:136,style:`font-size: ${P}px`});n.textContent=l[e],t.appendChild(n);let r=E(`text`,{class:`lk2-idx`,x:M(e)+k/2,y:b});r.textContent=String(e),t.appendChild(r),ce.appendChild(t),B.push({g:t,ch:n})}let V=e=>{let t=E(`g`,{class:`lk2-chip ${e}`});t.appendChild(E(`circle`,{class:`lk2-chip__dot`,cx:0,cy:0,r:10}));let n=E(`text`,{class:`lk2-chip__t`,x:0,y:0,style:`font-size: 12px`});return t.append(n),F.appendChild(t),{g:t,t:n}},H=V(`lk2-chip--i`);H.t.textContent=`i`;let U=V(`lk2-chip--j`);U.t.textContent=`j`;let W=V(`lk2-chip--jt`);W.t.textContent=`j`;let G=(e,t,n)=>e.g.setAttribute(`transform`,`translate(${t.toFixed(1)}, ${n})`),K=E(`path`,{class:`lk2-link`,d:``});le.appendChild(K),F.appendChild(E(`rect`,{class:`lk2-banner__box`,x:26,y:S,width:p-52,height:C,rx:9}));let q=E(`text`,{class:`lk2-banner__text`,x:p/2,y:256});F.appendChild(q),F.appendChild(E(`rect`,{class:`lk2-panel__box`,x:26,y:te,width:p-52,height:ne,rx:9}));let J=(e,t)=>{let n=p/2+(t-4/2)*116,r=E(`text`,{class:`lk2-panel__label`,x:n,y:308});r.textContent=e;let i=E(`text`,{class:`lk2-panel__num`,x:n,y:332});return F.append(r,i),i},Y=J(`i`,0),ue=J(`j`,1),de=J(`KMP 比较`,2),fe=J(`暴力 比较`,3),pe=J(`命中下标`,4),X=E(`text`,{class:`lk2-phase__text`,x:p/2,y:re});F.appendChild(X);let Z=document.createElement(`p`);Z.className=`viz__desc`,Z.setAttribute(`aria-live`,`polite`);function me(t,n){if(!n)return;let{phase:r,i,jBefore:a,jAfter:o,match:s,matched:c,found:l,index:u,kmpComparisons:d,bruteComparisons:f}=n,p=r===`compare`,m=r===`retreat`,h=r===`found`||r===`done`&&l,g=r===`init`,_=r===`done`,v=e=>{let t=e;return t<0&&(t=0),T>=w&&t+w>T&&(t=T-w),t},y,b;h?(y=w,b=v(u)):i>=0?(y=a,b=v(i-a)):(y=0,b=v(0));let S=b*j;B.forEach(e=>e.g.setAttribute(`transform`,`translate(${S.toFixed(1)}, 0)`)),z.forEach((e,t)=>{let n=[`lk2-cell`];y>0&&t>=b&&t<=b+y-1&&n.push(`is-window`),(p||m)&&t===i&&n.push(`is-hot`),p&&s&&t===i&&n.push(`is-match`),h&&t>=u&&t<=u+w-1&&n.push(`is-found`),e.g.setAttribute(`class`,n.join(` `))}),B.forEach((e,t)=>{let n=[`lk2-pcell`];y>0&&t<=y-1&&n.push(`is-window`),(p||m)&&t===a&&n.push(`is-hot`),p&&s&&t===a&&n.push(`is-match`),m&&t===o&&n.push(`is-to`),h&&n.push(`is-found`),e.g.setAttribute(`class`,n.join(` `))});let C=i>=0;if(H.g.style.display=C?``:`none`,C&&G(H,N(i),x),p||m)if(U.g.style.display=``,G(U,N(b+a),ee),m){W.g.style.display=``,G(W,N(b+o),x);let e=N(b+a),t=N(b+o);K.setAttribute(`d`,`M ${e.toFixed(1)} ${136 .toFixed(1)} Q ${((e+t)/2).toFixed(1)} ${162 .toFixed(1)} ${t.toFixed(1)} ${136 .toFixed(1)}`),K.style.display=``}else W.g.style.display=`none`,K.style.display=`none`;else U.g.style.display=`none`,W.g.style.display=`none`,K.style.display=`none`;g?(q.textContent=`在 text 里找 p：先从上一张动画借来 next 表`,q.setAttribute(`class`,`lk2-banner__text`)):p?(q.textContent=`text[${i}] = '${n.tch}'  vs  p[${a}] = '${n.pch}'   →   ${s?`相等 ✓`:`不等 ✗`}`,q.setAttribute(`class`,`lk2-banner__text`+(s?` is-ok`:``))):m?(q.textContent=`不等   →   j = next[${a-1}] = ${o}（i 不动）`,q.setAttribute(`class`,`lk2-banner__text`)):h?(q.textContent=`命中！起点 index = i - n + 1 = ${u}`,q.setAttribute(`class`,`lk2-banner__text is-gold`)):(q.textContent=l?`返回 ${u}：p 首次出现于下标 ${u}`:`未找到 → 返回 -1`,q.setAttribute(`class`,`lk2-banner__text`+(l?` is-ok`:``))),Y.textContent=g||_&&!l?`—`:i>=0?String(i):`—`,Y.setAttribute(`class`,`lk2-panel__num`),ue.textContent=String(c),ue.setAttribute(`class`,`lk2-panel__num`+(c>0?` is-gold`:``)),de.textContent=String(d),de.setAttribute(`class`,`lk2-panel__num`+(_?` is-ok`:``)),fe.textContent=String(f),fe.setAttribute(`class`,`lk2-panel__num is-dead`),pe.textContent=u>=0?String(u):`—`,pe.setAttribute(`class`,`lk2-panel__num`+(_?l?` is-ok`:` is-dead`:u>=0?` is-gold`:``)),g?X.textContent=`j = 已匹配的模式串前缀长度；i = 主串游标`:p?X.textContent=s?`相等 → j 前进，i 下一格`:`不等 → i 不动，只回退 j`:m?X.textContent=`j = next[j-1]：主串指针 i 不回退 —— 这就是 KMP 快的原因`:h?X.textContent=`j == n → 命中，起点 = i - n + 1`:X.textContent=l?`主串指针永不回头 → 总比较 O(n + m)`:`扫完未命中 → 返回 -1`,e(Z,n.desc)}D.appendChild(Z);let he=i();D.appendChild(he.root),a.textContent=``,a.appendChild(D),n();let ge=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:s,controls:he,intervalMs:f,onRender:me});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return o.autoplay!==!1&&!ge&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(D)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.kmpMatchMounted,document.getElementById(d)?.remove()}}}export{T as mountKmpMatch};