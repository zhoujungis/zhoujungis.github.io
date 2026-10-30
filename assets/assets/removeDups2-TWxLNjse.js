import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=-1;function o(e,t,n){if(!Array.isArray(t)||n<0||n>=t.length)return 0;let r=e[t[n]],i=1;for(;n+i<t.length&&e[t[n+i]]===r;)i+=1;return i}function s(e={}){let t=Array.isArray(e.pool)&&e.pool.length?e.pool:[1,2,3,3,4,4,5],n=Array.isArray(e.path)?e.path:[0,1,2,3,4,5,6],r=e.mode===`keep-one`?`keep-one`:`remove-all`,i=e=>e===a||e==null?`dummy`:e>=n.length?`∅`:String(t[n[e]]),s=e=>e<0||e>=n.length?null:t[n[e]],c=e=>o(t,n,e),l=[],u=[];{let e=0;for(;e<n.length;){let t=c(e);if(t>1)if(r===`keep-one`){for(let n=e;n<e+t-1;n+=1)u.push(n);l.push(e+t-1)}else for(let n=e;n<e+t;n+=1)u.push(n);else l.push(e);e+=t}}let d=[],f=[],p=(e,t,n={})=>d.push({phase:e,desc:t,prev:a,curr:0,dupStart:null,dupEnd:null,removed:[...f],removedNow:[],kept:[...l],mode:r,done:!1,...n});if(n.length===0)return p(`done`,"链表是空的 —— 没有节点可删，直接返回 `null`。",{curr:0,prev:a,done:!0}),d;p(`init`,`链表 ${n.map((e,t)=>i(t)).join(` → `)} 已经**排好序**，所以重复的元素一定挨在一起。目标是**把所有出现过的重复值都删干净**（一个都不留），`+(r===`keep-one`?`不过这次用阿里变体的规则：**重复过的值留下一个**。`:`这就是本题（LC 82）的要求，注意跟"只留一个"不是一回事。`)+" 先在头上架一个 `dummy` 哨兵 —— 头节点自己也可能是重复段的一员。",{prev:a,curr:0});let m=0;for(;m<n.length;){let e=c(m);if(e>1){let t=m,o=m+e,c=s(m);p(`dup-start`,`\`curr\` 在 ${i(m)}，它的值和下一个节点相同（都是 ${c}）——**发现一段重复，长度 ${e}**。\`prev\` 就此**停住不动**，因为一会儿要把整段一次摘掉，摘的动作得由 \`prev.next = curr\` 完成，prev 必须留在这一段的**前一个**位置。`,{prev:m-1<0?a:m-1,curr:m,dupStart:t,dupEnd:o});for(let e=t;e<o;e+=1){let n=e+1<o;p(`skip`,`\`curr\` 从 ${i(e)} 往前一格到 ${i(e+1)}（值都是 ${s(e)}）——`+(n?` 后面**还有同值的节点**，重复段没走完，继续往前。`:` 这一步跨出了重复段。`)+" 全程 **`prev` 一动没动** —— 它守在重复段前面的那个节点上，等着被接上。",{prev:m-1<0?a:m-1,curr:e+1,dupStart:t,dupEnd:o})}if(r===`keep-one`){let e=o-1;for(let n=t;n<e;n+=1)f.push(n);let n=Array.from({length:e-t},(e,n)=>t+n);p(`unlink`,`**阿里变体：留下一个。** 把重复段里的 ${t} 到 ${e-1} 号节点（值都是 ${c}）摘掉，只留最后一个 ${i(e)}。\`prev.next\` 指向 ${i(e)}。`,{prev:e,curr:o,dupStart:t,dupEnd:o,removedNow:n})}else{for(let e=t;e<o;e+=1)f.push(e);let r=Array.from({length:e},(e,n)=>t+n);p(`unlink`,`**整段摘掉。** \`prev.next = curr\` 一次接上 ${o<n.length?i(o):`∅`} —— 中间的 ${e} 个节点（值都是 ${c}）全被摘出链表，一个不留。这一步就是本题跟 LC 83 的分水岭：**LC 83 会留下一个，这里一个都不留。**`,{prev:m-1<0?a:m-1,curr:o,dupStart:t,dupEnd:o,removedNow:r})}m=o;let l=r===`keep-one`?o-1:m-1;m<n.length&&p(`advance`,`刚才那一段处理完了：\`prev\` 现在停在 ${i(l)}，\`curr\` 落在 ${i(m)}。**只有确定 curr 不再是重复段成员时，prev 才跟着前进。**`,{prev:l,curr:m});continue}p(`scan`,`\`curr\` 在 ${i(m)}，它的值（${s(m)}）跟下一个${m+1<n.length?`（${i(m+1)}）`:`（没有下一个了）`} 不相同 —— 这个节点不属于任何重复段，**安全保留**。于是 \`prev\` 也前进一格，跟 \`curr\` 挨着一起往右走。`,{prev:m-1<0?a:m-1,curr:m}),m+=1}let h=n.map((e,t)=>i(t)).join(` → `),ee=l.map(e=>i(e)).join(` → `),g=u.length?u.map(e=>i(e)).join(`、`):`（无）`;return p(`done`,`\`curr\` 走到了 ∅，循环结束。返回 \`dummy.next\`。\n\n- 原链表：${h}\n- 结果：**${ee||`（空）`}**\n- 被摘掉的节点：${g}\n\n`+(r===`keep-one`?`阿里变体的结果里，**重复过的值各留了一个**，没重复过的值原样保留。`:`**所有出现过的重复值都被删干净了** —— 这就是 LC 82 跟 LC 83 的区别。`)+" 全程只用了两根指针，额外空间 `O(1)`。",{prev:a,curr:n.length,done:!0}),d}var c=`rd2-styles`,l=0,u=62,d=48,f=38,p=44,m=150,h=174,ee=58,g=24,te=m-62,ne=264,_=m-34,v=8,re=46,ie=372,ae=46,oe=1150,y=`
.rd2 {
  --rd2-prev: var(--accent, #3f6b57);
  --rd2-curr: var(--accent-secondary, #a45f45);
  --rd2-edge: var(--text-secondary, #657168);
  --rd2-cut: #b3452e;
  --rd2-dup: #c8873f;
}
html.theme-dark .rd2 {
  --rd2-prev: #7fc3a4;
  --rd2-curr: #e0a06a;
  --rd2-cut: #e07a5f;
  --rd2-dup: #e8b06a;
}
.rd2__svg { min-width: 600px; }

.rd2-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.26s ease, fill 0.26s ease, opacity 0.26s ease;
}
/* dummy 是哨兵，内存里不存在 —— 画虚线 */
.rd2-node--dummy .rd2-node__box { stroke-dasharray: 5 4; }
.rd2-node--dummy .rd2-node__value { font-size: 13px; fill: var(--text-secondary, #657168); }
.rd2-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 18px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 被摘掉的节点：变灰 + 虚线 + 划掉 */
.rd2-node.is-cut .rd2-node__box {
  stroke: var(--text-secondary, #657168);
  stroke-dasharray: 5 3;
  opacity: 0.5;
}
.rd2-node.is-cut .rd2-node__value { opacity: 0.42; text-decoration: line-through; }
/* 正在被处理的重复段成员 */
.rd2-node.is-dup .rd2-node__box { stroke: var(--rd2-dup, #c8873f); stroke-width: 2.2; }
/* 游标落点 */
.rd2-node.is-prev .rd2-node__box { stroke: var(--rd2-prev, #3f6b57); stroke-width: 2.6; }
.rd2-node.is-curr .rd2-node__box { stroke: var(--rd2-curr, #a45f45); stroke-width: 2.6; }

/* 重复段整体外框 */
.rd2-dupframe { opacity: 0; transition: opacity 0.26s ease; }
.rd2-dupframe.is-on { opacity: 1; }
.rd2-dupframe__box {
  fill: rgba(200, 135, 63, 0.09);
  stroke: var(--rd2-dup, #c8873f);
  stroke-width: 2;
  stroke-dasharray: 6 4;
}
.rd2-dupframe__tag-bg { fill: var(--surface-muted, #ecefe8); }
.rd2-dupframe__tag {
  fill: var(--rd2-dup, #c8873f);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rd2-edge { opacity: 0; transition: opacity 0.26s ease; }
.rd2-edge.is-on { opacity: 1; }
.rd2-edge__line { stroke: var(--rd2-edge, #657168); stroke-width: 1.8; stroke-linecap: round; }
.rd2-edge__head { fill: var(--rd2-edge, #657168); }

/* 摘链弧线 */
.rd2-arc { opacity: 0; transition: opacity 0.26s ease; }
.rd2-arc.is-on { opacity: 1; }
.rd2-arc__line {
  fill: none;
  stroke: var(--rd2-cut, #b3452e);
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-dasharray: 7 4;
}
.rd2-arc__head { fill: var(--rd2-cut, #b3452e); }
.rd2-arc__tag-bg { fill: var(--surface-muted, #ecefe8); }
.rd2-arc__tag {
  fill: var(--rd2-cut, #b3452e);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rd2-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 3 3;
}
.rd2-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'Segoe UI Symbol', 'DejaVu Sans', Arial, sans-serif;
}

.rd2-note__text {
  fill: var(--text-secondary, #657168);
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: central;
}
.rd2-note__line {
  stroke: var(--text-secondary, #657168);
  stroke-width: 1;
  stroke-dasharray: 3 3;
  opacity: 0.7;
}

.rd2-chip { transition: transform 0.34s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; }
.rd2-chip__box { rx: 12; ry: 12; }
.rd2-chip__text {
  font-size: 12px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: #fff;
}
.rd2-chip--prev .rd2-chip__box { fill: var(--rd2-prev, #3f6b57); }
.rd2-chip--curr .rd2-chip__box { fill: var(--rd2-curr, #a45f45); }
.rd2-lead { stroke-width: 1.4; opacity: 0.85; }
.rd2-lead--prev { stroke: var(--rd2-prev, #3f6b57); }
.rd2-lead--curr { stroke: var(--rd2-curr, #a45f45); }

/* 底部判定横幅 */
.rd2-verdict__box {
  fill: none;
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.2;
  transition: fill 0.24s ease, stroke 0.24s ease;
}
.rd2-verdict__text {
  fill: var(--text-secondary, #657168);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  transition: fill 0.24s ease;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rd2-verdict.is-ok .rd2-verdict__box { fill: var(--rd2-prev, #3f6b57); stroke: var(--rd2-prev, #3f6b57); }
.rd2-verdict.is-ok .rd2-verdict__text { fill: #fff; }
.rd2-verdict.is-cut .rd2-verdict__box { fill: var(--rd2-cut, #b3452e); stroke: var(--rd2-cut, #b3452e); }
.rd2-verdict.is-cut .rd2-verdict__text { fill: #fff; }

@media (prefers-reduced-motion: reduce) {
  .rd2-node__box, .rd2-chip, .rd2-edge, .rd2-arc, .rd2-dupframe { transition: none; }
}
`;function se(){if(n(),document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=y,document.head.appendChild(e)}function b(n,a={}){if(!n||n.dataset.rd2Mounted===`1`)return{destroy(){}};n.dataset.rd2Mounted=`1`,se();let o=s(a),y=a.autoplay!==!1,b=Array.isArray(a.pool)&&a.pool.length?a.pool:[1,2,3,3,4,4,5],x=Array.isArray(a.path)?a.path:[0,1,2,3,4,5,6],ce=a.mode===`keep-one`?`keep-one`:`remove-all`,S=x.length,C=S+1,w=e=>e<0?l:e+1,le=e=>e-1,T=2*p+C*u+(C-1)*f,E=e=>p+e*100,D=e=>E(e)+u/2,O=T-ae,k=document.createElement(`div`);k.className=`viz rd2`;let A=document.createElement(`div`);A.className=`viz__stage`,k.appendChild(A);let j=r(`svg`,{class:`viz__svg rd2__svg`,viewBox:`0 0 ${T} 416`,role:`img`,"aria-label":`删除排序链表中重复元素的推演动画：${x.map(e=>b[e]).join(` → `)}`});A.appendChild(j);let M=r(`g`,{class:`rd2-note`}),N=r(`line`,{class:`rd2-note__line`}),P=r(`text`,{class:`rd2-note__text`,x:T/2,y:re});M.append(N,P),j.appendChild(M),j.appendChild(r(`circle`,{class:`rd2-null__ring`,cx:O,cy:h,r:14}));let ue=r(`text`,{class:`rd2-null__text`,x:O,y:h});ue.textContent=`∅`,j.appendChild(ue);let F=r(`line`,{class:`rd2-lead rd2-lead--curr`}),I=r(`line`,{class:`rd2-lead rd2-lead--prev`});j.append(F,I);let L=r(`g`,{class:`rd2-edges`});j.appendChild(L);let R=[];function de(e){for(;R.length<=e;){let e=r(`g`,{class:`rd2-edge`}),t=r(`line`,{class:`rd2-edge__line`}),n=r(`path`,{class:`rd2-edge__head`});e.append(t,n),L.appendChild(e),R.push({g:e,line:t,head:n})}return R[e]}function fe(e,t,n){let r=E(t)+u+3,i=E(n),a=h;e.line.setAttribute(`x1`,r),e.line.setAttribute(`y1`,a),e.line.setAttribute(`x2`,i-9),e.line.setAttribute(`y2`,a),e.head.setAttribute(`d`,`M ${i} ${a} L ${i-9} ${a-5.5} L ${i-9} 179.5 Z`)}function pe(e,t){let n=E(t)+u+3,r=O-14,i=h;e.line.setAttribute(`x1`,n),e.line.setAttribute(`y1`,i),e.line.setAttribute(`x2`,r-9),e.line.setAttribute(`y2`,i),e.head.setAttribute(`d`,`M ${r} ${i} L ${r-9} ${i-5.5} L ${r-9} 179.5 Z`)}let z=r(`g`,{class:`rd2-arc`}),B=r(`path`,{class:`rd2-arc__line`}),me=r(`path`,{class:`rd2-arc__head`}),V=r(`rect`,{class:`rd2-arc__tag-bg`,x:-66,y:-9,width:132,height:18,rx:6}),H=r(`text`,{class:`rd2-arc__tag`,x:0,y:0});z.append(B,me,V,H),j.appendChild(z);let U=r(`g`,{class:`rd2-dupframe`}),W=r(`rect`,{class:`rd2-dupframe__box`,x:0,y:0,width:0,height:0,rx:14}),G=r(`rect`,{class:`rd2-dupframe__tag-bg`,x:-50,y:-9,width:100,height:18,rx:6}),K=r(`text`,{class:`rd2-dupframe__tag`,x:0,y:0});U.append(W,G,K),j.appendChild(U);let q=[];for(let e=0;e<C;e+=1){let t=r(`g`,{class:`rd2-node${e===l?` rd2-node--dummy`:``}`});t.appendChild(r(`rect`,{class:`rd2-node__box`,x:E(e),y:m,width:u,height:d,rx:9}));let n=r(`text`,{class:`rd2-node__value`,x:D(e),y:h});n.textContent=e===l?`dummy`:String(b[x[le(e)]]),t.appendChild(n),j.appendChild(t),q.push(t)}function he(e,t){let n=r(`g`,{class:`rd2-chip rd2-chip--${e}`});n.appendChild(r(`rect`,{class:`rd2-chip__box`,x:-58/2,y:-24/2,width:ee,height:g}));let i=r(`text`,{class:`rd2-chip__text`,x:0,y:0});return i.textContent=t,n.appendChild(i),n}let J=he(`curr`,`curr`),Y=he(`prev`,`prev`);j.append(J,Y);let X=r(`g`,{class:`rd2-verdict`}),ge=r(`rect`,{class:`rd2-verdict__box`,x:(T-264)/2,y:ie-18,width:264,height:36,rx:18}),_e=r(`text`,{class:`rd2-verdict__text`,x:T/2,y:ie});X.append(ge,_e),j.appendChild(X);let Z=document.createElement(`p`);Z.className=`viz__desc`,Z.setAttribute(`aria-live`,`polite`),k.appendChild(Z);let ve=i();k.appendChild(ve.root),n.textContent=``,n.appendChild(k);let Q=null,ye=e=>e>=S?{x:O,onNull:!0}:{x:D(w(e)),onNull:!1};function be(e){let t=new Set(e.removed),n=[];for(let e=0;e<S;e+=1)t.has(e)||n.push(e);let r=new Map,i=e.prev,a=e.curr;for(let e=0;e<n.length;e+=1){let t=n[e],i=e+1<n.length?n[e+1]:-1;r.set(w(t),i===-1?-1:w(i))}if(r.set(l,n.length?w(n[0]):-1),i>=-1){let e=i===-1?l:w(i),t=a>=S?-1:w(a);r.set(e,t)}for(let e of t)r.set(w(e),null);return r}function xe(e){let t=(e.phase===`unlink`||e.phase===`advance`)&&e.removedNow.length>0;if(z.classList.toggle(`is-on`,t),!t)return;let n=e.prev===-1?l:w(e.prev),r=e.curr>=S?null:w(e.curr);if(r===null)return;let i=E(n)+u,a=E(r);if(a<=i)return;let o=i+(a-i)*.28,s=i+(a-i)*.72;B.setAttribute(`d`,`M ${i+3} ${h} C ${o} ${h-58}, ${s} ${h-58}, ${a-9} ${h}`),me.setAttribute(`d`,`M ${a} ${h} L ${a-9} ${h-5.5} L ${a-9} 179.5 Z`);let c=(i+a)/2;V.setAttribute(`x`,c-66),V.setAttribute(`y`,h-58-9),H.setAttribute(`x`,c),H.setAttribute(`y`,h-58),H.textContent=`prev.next = curr`}function Se(t,n){let r=new Set(n.removed),i=e=>n.dupStart!==null&&n.dupEnd!==null&&e>=n.dupStart&&e<n.dupEnd;for(let e=0;e<C;e+=1){if(e===l){q[e].classList.toggle(`is-prev`,n.prev===-1),q[e].classList.toggle(`is-curr`,!1);continue}let t=le(e);q[e].classList.toggle(`is-cut`,r.has(t)),q[e].classList.toggle(`is-dup`,i(t)&&!r.has(t)),q[e].classList.toggle(`is-prev`,n.prev===t),q[e].classList.toggle(`is-curr`,n.curr===t)}let a=be(n),o=0;for(let[e,t]of a){if(t===null)continue;let n=de(o);o+=1,n.g.classList.add(`is-on`),t===-1?pe(n,e):fe(n,e,t)}for(let e=o;e<R.length;e+=1)R[e].g.classList.remove(`is-on`);xe(n);let s=n.dupStart!==null&&n.dupEnd!==null&&n.dupEnd>n.dupStart;if(U.classList.toggle(`is-on`,s),s){let e=w(n.dupStart),t=w(n.dupEnd-1);W.setAttribute(`x`,E(e)-v),W.setAttribute(`y`,m-v),W.setAttribute(`width`,E(t)+u-E(e)+v*2),W.setAttribute(`height`,64);let r=(E(e)+E(t)+u)/2,i=n.dupEnd-n.dupStart;K.textContent=`重复段 ${i} 个`,G.setAttribute(`x`,r-50),G.setAttribute(`y`,_-9),K.setAttribute(`x`,r),K.setAttribute(`y`,_)}let c=ye(n.curr),d=n.prev===-1?l:w(n.prev),f=D(d);if(J.setAttribute(`transform`,`translate(${c.x} ${te})`),Y.setAttribute(`transform`,`translate(${f} ${ne})`),J.style.opacity=`1`,Y.style.opacity=`1`,F.setAttribute(`x1`,c.x),F.setAttribute(`x2`,c.x),F.setAttribute(`y1`,100),F.setAttribute(`y2`,m-2),I.setAttribute(`x1`,f),I.setAttribute(`x2`,f),I.setAttribute(`y1`,ne-g/2),I.setAttribute(`y2`,200),s){let e=D(w(n.dupEnd-1));P.textContent=`curr 冲进重复段，prev 原地等 —— 错位就是这么来的`,N.setAttribute(`x1`,e),N.setAttribute(`x2`,e),N.setAttribute(`y1`,57),N.setAttribute(`y2`,_-12),M.style.opacity=`1`}else M.style.opacity=`0`;X.setAttribute(`class`,`rd2-verdict`);let p=`准备开始`;if(n.phase===`done`){X.classList.add(`is-ok`);let e=n.kept.map(e=>b[x[e]]).join(` → `);p=e?`✓ ${e||`空`}`:`✓ 全部被删，返回空链表`}else n.phase===`unlink`?(X.classList.add(`is-cut`),p=ce===`keep-one`?`摘掉多余的，留一个`:`整段摘掉，一个不留`):n.phase===`dup-start`?p=`发现重复段`:n.phase===`skip`?p=`curr 在重复段里往前冲…`:n.phase===`scan`||n.phase===`advance`?p=`两个指针一起前进`:n.phase===`init`&&(p=`架好 dummy 与 prev / curr`);_e.textContent=p,e(Z,n.desc)}let $=t({steps:o,controls:ve,intervalMs:oe,onRender:Se});$.jumpTo(Math.trunc(a.initialStep)||0);let Ce=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return y&&!Ce&&typeof IntersectionObserver==`function`&&(Q=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){Q.disconnect(),Q=null,$.play();return}},{threshold:.35}),Q.observe(k)),{destroy(){Q&&=(Q.disconnect(),null),$.destroy(),n.textContent=``,delete n.dataset.rd2Mounted,document.getElementById(c)?.remove()}}}export{b as default,b as mountRemoveDups2};