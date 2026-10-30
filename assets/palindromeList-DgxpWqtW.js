import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";function a(e,t){let n=[],r=e,i=new Set;for(;r!=null&&!i.has(r);)i.add(r),n.push(r),r=t[r];return n}function o(e){if(e<=0)return null;let t=0,n=0;for(;n<e&&n+1<e;)t+=1,n+=2;return t}function s(e){let t=e.length;for(let n=0;n<Math.floor(t/2);n+=1)if(e[n]!==e[t-1-n])return!1;return!0}function c(e){let t=o(e);if(t===null)return[];let n=[];for(let r=0;e-1-r>=t;r+=1)n.push([r,e-1-r]);return n}function l(e){let t=e.length,n=Array.from({length:t},(e,n)=>n+1<t?n+1:null),r=t=>t==null?`∅`:String(e[t]),i=[],l=(e,t,r={})=>i.push({phase:e,stage:0,desc:t,links:[...n],front:[],back:[],pairs:[],active:null,verdict:null,chips:[],done:!1,...r});if(t===0)return l(`init`,"空链表。正着读、反着读都是「什么都没有」—— **空链表也算回文**，返回 `true`。",{stage:0,done:!0,verdict:!0}),i;s(e);let u=e.slice().reverse().join(` → `);if(l(`init`,`判断 ${e.join(` → `)} 是不是回文。核心一句话：**把后半段反转过来（${u}），它应该跟前半段逐位相同**。全程只改指针、只比值，不开数组。`,{front:a(0,n)}),t===1)return l(`done`,"只有一个节点，正着读反着读都是它自己 —— **是回文**，返回 `true`。",{front:[0],stage:3,done:!0,verdict:!0}),i;let d=o(t),f=0,p=0,m=0;for(;p<t&&p+1<t;){f+=1,p+=2,m+=1;let e=p>=t;l(`mid`,`① \`fast\` 一次跨两格、\`slow\` 一次一格：第 ${m} 步后 \`slow\` 走到 ${r(f)}、\`fast\` 走到 ${r(p)}。`+(e?` \`fast\` 冲出链表了 —— \`slow\` 停在 ${r(f)} 上，**这就是后半段的开头**。`:``),{stage:1,front:a(0,n),chips:[{kind:`slow`,label:`slow`,slot:f},{kind:`fast`,label:`fast`,slot:p<t?p:null}]})}let h=Array.from({length:d},(e,t)=>t),g=Array.from({length:t-d},(e,t)=>d+t),_=h.map(r).join(` → `);l(`split`,`② 后半段 ${g.map(r).join(` → `)} 整体下移一行，前半段是 ${_}。接下来反转下行 —— 反转完它从左到右读起来，应该跟上行一模一样。注意这里**不需要断开**：反转时中点 `+r(d)+" 的 `next` 会被置空，前半段的尾巴走到它自然就停了。",{stage:2,front:h,back:g,chips:[{kind:`curr`,label:`curr`,slot:d}]});let v=null,y=d,b=0;for(;y!==null;){let e=n[y];n[y]=v,v=y,y=e,b+=1;let t=[...a(v,n),...y===null?[]:a(y,n)];l(`rev`,`② 第 ${b} 个节点掉头：\`curr\` 的 \`next\` 改成 \`prev\`，也就是 ${r(v)} → ${r(n[v])}。`+(y===null?" 后半段反转完成，`prev` 站在新的段头（原来的尾节点）上。":` \`curr\` 前移到 ${r(y)}，剩下的还没处理。`),{stage:2,front:h,back:t,chips:[{kind:`prev`,label:`prev`,slot:v},...y===null?[]:[{kind:`curr`,label:`curr`,slot:y}]]})}let x=a(t-1,n),S=[],C=c(t);for(let t=0;t<C.length;t+=1){let[n,a]=C[t],o=n===a,s=e[n]===e[a],c={f:n,b:a,ok:s};if(S.push(c),l(`cmp`,`③ 第 ${t+1} / ${C.length} 对：`+(o?`\`p1\` 和 \`p2\` 都走到了中点 ${r(n)} 上 —— **中点跟自己比，必然相等**，这一对是白送的。`:`\`p1\` 指向 ${r(n)}、\`p2\` 指向 ${r(a)}，${e[n]} ${s?`==`:`!=`} ${e[a]} —— `+(s?`相等，两个指针一起往前。`:"**不相等，直接返回 `false`**，后面几对不用比了。")),{stage:3,front:h,back:x,pairs:[...S],active:c,verdict:s?null:!1,done:!s,chips:o?[{kind:`p1`,label:`p1/p2`,slot:n}]:[{kind:`p1`,label:`p1`,slot:n},{kind:`p2`,label:`p2`,slot:a}]}),!s)return i}return l(`done`,`③ \`p2\` 走到 ∅，${C.length} 对全部相等 —— **${e.join(` → `)} 是回文链表**，返回 \`true\`。`,{stage:3,front:h,back:x,pairs:[...S],active:null,verdict:!0,done:!0}),i}var u=`palm-styles`,d=64,f=48,p=44,m=44,h=118,g=236,_=-26,v=44,y=58,b=26,x=62,S=350,C=1250,w=[`① 找中点`,`② 反转后半段`,`③ 逐对比较`],T=`
.palm {
  --palm-node: var(--text-primary, #1f2a24);
  --palm-edge: var(--text-secondary, #657168);
  --palm-a: var(--accent, #3f6b57);
  --palm-b: var(--accent-secondary, #a45f45);
  --palm-ok: var(--accent, #3f6b57);
  --palm-bad: #c0392b;
}
html.theme-dark .palm {
  --palm-a: #7fc3a4;
  --palm-b: #e0a06a;
  --palm-bad: #ff8a7a;
}
.palm__svg { min-width: 520px; }

.palm-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.24s ease, fill 0.24s ease;
}
.palm-node__value {
  fill: var(--palm-node);
  font-size: 18px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.palm-node.is-paired .palm-node__box { stroke: var(--palm-ok); stroke-width: 2; }
.palm-node.is-active .palm-node__box { stroke: var(--palm-b); stroke-width: 2.5; }
.palm-node.is-bad .palm-node__box { stroke: var(--palm-bad); stroke-width: 2.5; }
.palm-node.is-bad .palm-node__value { fill: var(--palm-bad); }

/* 节点整体位移：反转的"翻面"效果全靠它 */
.palm-node { transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1); }

.palm-edge__line { stroke: var(--palm-edge); stroke-width: 1.8; stroke-linecap: round; fill: none; }
.palm-edge__head { fill: var(--palm-edge); }

.palm-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 3 3;
}
.palm-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  text-anchor: middle;
  dominant-baseline: central;
}

/* 配对竖线 + ✓ / ✗ */
.palm-pair__line { stroke: var(--palm-ok); stroke-width: 2.2; fill: none; stroke-linecap: round; }
.palm-pair.is-bad .palm-pair__line { stroke: var(--palm-bad); }
.palm-pair__disc { fill: var(--palm-ok); }
.palm-pair.is-bad .palm-pair__disc { fill: var(--palm-bad); }
.palm-pair__mark {
  fill: #fff;
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}
.palm-pair.is-on .palm-pair__line { stroke: var(--palm-b); }
.palm-pair.is-on .palm-pair__disc { fill: var(--palm-b); }

/* 顶部阶段条 */
.palm-stage__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.2;
  transition: fill 0.24s ease, stroke 0.24s ease;
}
.palm-stage__text {
  fill: var(--text-secondary, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  transition: fill 0.24s ease;
}
.palm-stage.is-on .palm-stage__box { fill: var(--palm-ok); stroke: var(--palm-ok); }
.palm-stage.is-on .palm-stage__text { fill: #fff; }

/* 底部判定横幅 */
.palm-verdict__box {
  fill: none;
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.2;
  transition: fill 0.24s ease, stroke 0.24s ease;
}
.palm-verdict__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  transition: fill 0.24s ease;
}
.palm-verdict.is-ok .palm-verdict__box { fill: var(--palm-ok); stroke: var(--palm-ok); }
.palm-verdict.is-ok .palm-verdict__text { fill: #fff; }
.palm-verdict.is-bad .palm-verdict__box { fill: var(--palm-bad); stroke: var(--palm-bad); }
.palm-verdict.is-bad .palm-verdict__text { fill: #fff; }

.palm-chip { transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; }
.palm-chip__box { rx: 13; ry: 13; }
.palm-chip__text {
  font-size: 12.5px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: #fff;
}
.palm-chip--slow .palm-chip__box,
.palm-chip--prev .palm-chip__box,
.palm-chip--p1 .palm-chip__box { fill: var(--palm-a); }
.palm-chip--fast .palm-chip__box,
.palm-chip--curr .palm-chip__box,
.palm-chip--p2 .palm-chip__box { fill: var(--palm-b); }
@media (prefers-reduced-motion: reduce) {
  .palm-node, .palm-chip, .palm-stage__box, .palm-node__box,
  .palm-verdict__box { transition: none; }
}
`;function E(){if(n(),document.getElementById(u))return;let e=document.createElement(`style`);e.id=u,e.textContent=T,document.head.appendChild(e)}function D(n,a={}){if(!n||n.dataset.palmMounted===`1`)return{destroy(){}};n.dataset.palmMounted=`1`,E();let o=Array.isArray(a.values)&&a.values.length?a.values:[1,2,2,1],s=a.autoplay!==!1,c=l(o),T=o.length,D=Math.max(T,1),O=e=>m+e*108,k=2*m+D*d+(D-1)*p,A=k+x,j=k+x/2,M=e=>e+f/2,N=document.createElement(`div`);N.className=`viz palm`;let P=document.createElement(`div`);P.className=`viz__stage`,N.appendChild(P);let F=r(`svg`,{class:`viz__svg palm__svg`,viewBox:`0 0 ${A} 390`,role:`img`,"aria-label":`回文链表推演动画：${o.join(` → `)}`});P.appendChild(F);let I=[],L=Math.min(150,(A-2*m-32)/3),R=(A-(3*L+32))/2;w.forEach((e,t)=>{let n=r(`g`,{class:`palm-stage`}),i=R+t*(L+16);n.appendChild(r(`rect`,{class:`palm-stage__box`,x:i,y:v-15,width:L,height:30,rx:15}));let a=r(`text`,{class:`palm-stage__text`,x:i+L/2,y:v});a.textContent=e,n.appendChild(a),F.appendChild(n),I.push(n)}),F.appendChild(r(`circle`,{class:`palm-null__ring`,cx:j,cy:M(h),r:15}));let z=r(`text`,{class:`palm-null__text`,x:j,y:M(h)});z.textContent=`∅`,F.appendChild(z);let B=r(`g`,{class:`palm-pairs`});F.appendChild(B);let V=r(`g`,{class:`palm-edges`});F.appendChild(V);let H=[];for(let e=0;e<T;e+=1){let t=r(`g`,{class:`palm-node`});t.appendChild(r(`rect`,{class:`palm-node__box`,x:0,y:0,width:d,height:f,rx:9}));let n=r(`text`,{class:`palm-node__value`,x:d/2,y:f/2});n.textContent=String(o[e]),t.appendChild(n),F.appendChild(t),H.push(t)}function U(){let e=r(`g`,{class:`palm-chip`});e.appendChild(r(`rect`,{class:`palm-chip__box`,x:-58/2,y:-26/2,width:y,height:b}));let t=r(`text`,{class:`palm-chip__text`,x:0,y:0});return e.appendChild(t),{g:e,t}}let W=[U(),U()];W.forEach(e=>F.appendChild(e.g));let G=r(`g`,{class:`palm-verdict`}),K=r(`rect`,{class:`palm-verdict__box`,x:(A-190)/2,y:S-18,width:190,height:36,rx:18}),q=r(`text`,{class:`palm-verdict__text`,x:A/2,y:S});G.appendChild(K),G.appendChild(q),F.appendChild(G);let J=document.createElement(`p`);J.className=`viz__desc`,J.setAttribute(`aria-live`,`polite`),N.appendChild(J);let Y=i();N.appendChild(Y.root),n.textContent=``,n.appendChild(N);let X=null;function Z(e,t,n){let i=n[e],a=n[t],o=r(`g`,{class:`palm-edge`});if(i.y===a.y&&Math.abs(i.x-a.x)===108){let e=i.y+f/2,t=i.x+d,n=a.x;o.appendChild(r(`line`,{class:`palm-edge__line`,x1:t+3,y1:e,x2:n-9,y2:e})),o.appendChild(r(`path`,{class:`palm-edge__head`,d:`M ${n} ${e} L ${n-9} ${e-5.5} L ${n-9} ${e+5.5} Z`}))}else{let e=i.y+f,t=a.y+f,n=i.x+d/2,s=a.x+d/2;o.appendChild(r(`path`,{class:`palm-edge__line`,d:`M ${n} ${e} C ${n} ${e+38}, ${s} ${t+38}, ${s} ${t+8}`})),o.appendChild(r(`path`,{class:`palm-edge__head`,d:`M ${s} ${t} L ${s-5.5} ${t+9} L ${s+5.5} ${t+9} Z`}))}V.appendChild(o)}function ee(e,t,n){let i=r(`g`,{class:`palm-pair ${e.ok?`is-ok`:`is-bad`} ${n?`is-on`:``}`});if(e.f===e.b){let n=t[e.f],a=n.x+d/2-18,o=n.y+f;i.appendChild(r(`path`,{class:`palm-pair__line`,d:`M ${a-14} ${o} C ${a-22} ${o+26}, ${a+22} ${o+26}, ${a+14} ${o}`})),Q(i,a,o+26*.78,e.ok)}else{let n=t[e.f],a=t[e.b],o=n.x+d/2-18,s=n.y+f,c=a.y,l=(s+c)/2;i.appendChild(r(`line`,{class:`palm-pair__line`,x1:o,y1:s+10,x2:o,y2:l-11})),i.appendChild(r(`line`,{class:`palm-pair__line`,x1:o,y1:l+11,x2:o,y2:c-2})),Q(i,o,l,e.ok)}B.appendChild(i)}function Q(e,t,n,i){e.appendChild(r(`circle`,{class:`palm-pair__disc`,cx:t,cy:n,r:11}));let a=r(`text`,{class:`palm-pair__mark`,x:t,y:n});a.textContent=i?`✓`:`✗`,e.appendChild(a)}function te(t,n){let r=Array(T).fill(null);n.front.forEach((e,t)=>{r[e]={x:O(t),y:h}}),n.back.forEach((e,t)=>{r[e]={x:O(t),y:g}});let i=Math.max(n.front.length,n.back.length);for(let e=0;e<T;e+=1)r[e]||(r[e]={x:O(i),y:h},i+=1);let a=new Set;for(let e of n.pairs)a.add(e.f),a.add(e.b);let o=new Set;n.active&&(o.add(n.active.f),o.add(n.active.b));let s=new Set;n.active&&!n.active.ok&&(s.add(n.active.f),s.add(n.active.b));for(let e=0;e<T;e+=1){let t=r[e];H[e].setAttribute(`transform`,`translate(${t.x} ${t.y})`),H[e].classList.toggle(`is-paired`,a.has(e)),H[e].classList.toggle(`is-active`,o.has(e)),H[e].classList.toggle(`is-bad`,s.has(e))}B.textContent=``,n.pairs.forEach((e,t)=>{let i=n.active&&n.pairs.indexOf(n.active)===t;ee(e,r,i)}),V.textContent=``;for(let e=0;e<T;e+=1){let t=n.links[e];t!=null&&(t<0||t>=T||Z(e,t,r))}I.forEach((e,t)=>e.classList.toggle(`is-on`,n.stage===t+1)),G.setAttribute(`class`,`palm-verdict`);let c=`准备开始`;n.verdict===!0?(G.classList.add(`is-ok`),c=`✓ 是回文链表`):n.verdict===!1?(G.classList.add(`is-bad`),c=`✗ 不是回文链表`):n.phase===`cmp`?c=`比较中…`:n.phase===`split`||n.phase===`rev`?c=`反转中…`:n.phase===`mid`?c=`定位中点…`:n.phase===`init`&&(c=`待判定`),q.textContent=c,W.forEach((e,t)=>{let i=n.chips[t];if(!i){e.g.style.opacity=`0`;return}let a=i.slot===null?{x:j-d/2,y:h}:r[i.slot],o=a.y===g&&i.slot!==null?a.y+f+14:a.y+_;e.g.style.opacity=`1`,e.g.setAttribute(`class`,`palm-chip palm-chip--${i.kind}`),e.t.textContent=i.label,e.g.setAttribute(`transform`,`translate(${a.x+d/2} ${o})`)}),e(J,n.desc)}let $=t({steps:c,controls:Y,intervalMs:C,onRender:te});$.jumpTo(Math.trunc(a.initialStep)||0);let ne=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return s&&!ne&&typeof IntersectionObserver==`function`&&(X=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){X.disconnect(),X=null,$.play();return}},{threshold:.35}),X.observe(N)),{destroy(){X&&=(X.disconnect(),null),$.destroy(),n.textContent=``,delete n.dataset.palmMounted,document.getElementById(u)?.remove()}}}export{D as default,D as mountPalindromeList};