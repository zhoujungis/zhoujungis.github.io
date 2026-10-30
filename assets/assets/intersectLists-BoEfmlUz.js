import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";function a(e,t){let n=new Set(t);for(let r of e){if(!n.has(r))continue;let i=e.indexOf(r),a=t.indexOf(r),o=0;for(;i+o<e.length&&a+o<t.length&&e[i+o]===t[a+o];)o+=1;if(i+o===e.length&&a+o===t.length)return r}return null}function o(e,t){let n=a(e,t);return n===null?0:e.length-e.indexOf(n)}function s(e,t){let n=o(e,t);return{a:e.length-n,b:t.length-n,c:n}}function c(e={}){let t=Array.isArray(e.pool)&&e.pool.length?e.pool:[1,2,3,4,5,6,7],n=Array.isArray(e.pathA)?e.pathA:[0,1,2,3,4],r=Array.isArray(e.pathB)?e.pathB:[5,6,3,4],i={A:n,B:r},o=n.length,c=r.length,l=e=>e==null?`∅`:String(t[e]),u=a(n,r),{a:d,b:f,c:p}=s(n,r),m=[],h=(e,t,n={})=>m.push({phase:e,desc:t,onA:`A`,onB:`B`,iA:0,iB:0,fromA:null,fromB:null,jumpsA:!1,jumpsB:!1,shared:u!==null,equal:!1,meet:null,answer:u,done:!1,...n});if(o===0||c===0)return h(`none`,"有一条链表是空的 —— 空链表不可能有相交节点，直接返回 `null`。",{shared:!1,answer:null,done:!0}),m;h(`init`,`两条链表 A = ${n.map(l).join(` → `)}、B = ${r.map(l).join(` → `)}。`+(u===null?`它们**没有共享任何节点**（下面两个 4 只是值相同，不是同一个节点）。`:`从 ${l(u)} 开始它们**共享同一批节点**，后缀完全重合 —— 这就是"相交"在这个结构里的确切含义。`)+` 目标是找出那个**起始**节点，而且不许开哈希表。`,{onA:`A`,onB:`B`,iA:0,iB:0});let g={on:`A`,i:0},_={on:`B`,i:0},v=0,y=0,b=0,x=2*(o+c)+4,S=()=>({onA:g.on,iA:g.i,onB:_.on,iB:_.i});for(;v<=o+c&&b<x;){b+=1;let e=g.i>=i[g.on].length,t=_.i>=i[_.on].length;if(e&&t)break;if(e||t){let n=g.i>=i[g.on].length?i[g.on][i[g.on].length-1]:i[g.on][g.i],r=_.i>=i[_.on].length?i[_.on][i[_.on].length-1]:i[_.on][_.i],a=[];e&&a.push(`pA`),t&&a.push(`pB`);let o=a.map(e=>l(e===`pA`?n:r)).join(` 和 `);e&&(g={on:g.on===`A`?`B`:`A`,i:0},y+=1),t&&(_={on:_.on===`B`?`A`:`B`,i:0},y+=1);let s=l(i[g.on][g.i]),c=l(i[_.on][_.i]);h(`jump`,`**${a.join(` 和 `)} 走到了 ∅，搬到了对方链表的头上。** 它从 ${o} 的 \`next\` 直接跳到另一条链的第一个节点，于是 pA 在 ${s}、pB 在 ${c}。这一步是整套解法的关键：**pA 走完 A 就去走 B，pB 走完 B 就去走 A**，两条"游标自己走过的路"就此等长。`,{...S(),fromA:n,fromB:r,jumpsA:e,jumpsB:t,equal:i[g.on][g.i]===i[_.on][_.i]});continue}if(i[g.on][g.i]===i[_.on][_.i])break;let n=l(i[g.on][g.i]),r=l(i[_.on][_.i]);g.i+=1,_.i+=1,v+=1;let a=g.i>=i[g.on].length?`∅`:l(i[g.on][g.i]),o=_.i>=i[_.on].length?`∅`:l(i[_.on][_.i]);h(`walk`,`第 ${v} 步：pA 在 ${n}、pB 在 ${r}，**不是同一个节点**，一起前移一格 —— pA 到 ${a}、pB 到 ${o}。注意判断相交比的是**节点本身**，不是值：值相等不算数。`,{...S(),equal:i[g.on][g.i]===i[_.on][_.i]})}let C=g.i>=i[g.on].length,w=_.i>=i[_.on].length;if(!C&&!w&&i[g.on][g.i]===i[_.on][_.i]){let e=i[g.on][g.i];return h(`found`,`**两个游标同时落在节点 ${l(e)} 上 —— 这就是相交的起始节点。** pA 走了 A 的独有段 ${d} 步 + 公共段 ${p} 步 + B 的独有段 ${f} 步，pB 走了 B 的独有段 ${f} 步 + 公共段 ${p} 步 + A 的独有段 ${d} 步 ——两条路都是 \`a + b + c = ${d+f+p}\`，**路程相等，所以必然同时到达**。`,{...S(),equal:!0,meet:e,done:!0}),m}return h(`none`,`两个游标**同时走到了 ∅** —— 两条链表根本没有共享节点。各自都老老实实走完了"自己那条链 + 对方那条链"（各 ${d+f} 步），恰好手拉手一起掉出去。返回 \`null\`。`,{...S(),done:!0}),m}var l=`ints-styles`,u=62,d=46,f=40,p=46,m=150,h=286,g=m-62,_=348,v=482/2,y=52,b=24,x=34,S=30,C=396,w=44,ee=-34,te=1250,ne=`
.ints {
  --ints-node: var(--text-primary, #1f2a24);
  --ints-edge: var(--text-secondary, #657168);
  --ints-a: var(--accent, #3f6b57);
  --ints-b: var(--accent-secondary, #a45f45);
  --ints-ok: var(--accent, #3f6b57);
  --ints-bad: #c0392b;
}
html.theme-dark .ints {
  --ints-a: #7fc3a4;
  --ints-b: #e0a06a;
  --ints-bad: #ff8a7a;
}
.ints__svg { min-width: 560px; }

.ints-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.24s ease, stroke-width 0.24s ease, opacity 0.24s ease;
}
.ints-node__value {
  fill: var(--ints-node);
  font-size: 17px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 公共段节点：加粗描边，指出"这块是两条链共用的" */
.ints-node.is-shared .ints-node__box { stroke-dasharray: none; stroke-width: 1.5; }
.ints-node.is-shared .ints-node__value { font-weight: 700; }
/* 当前被游标指到的节点 */
.ints-node.is-cursor-a .ints-node__box { stroke: var(--ints-a); stroke-width: 2.5; }
.ints-node.is-cursor-b .ints-node__box { stroke: var(--ints-b); stroke-width: 2.5; }
.ints-node.is-meet .ints-node__box { stroke: var(--ints-ok); stroke-width: 3; fill: rgba(63, 107, 87, 0.08); }

/* 答案常驻标记（橙色虚线框） */
.ints-answer__box {
  fill: none;
  stroke: var(--ints-b);
  stroke-width: 2.2;
  stroke-dasharray: 6 4;
  opacity: 1;
}

.ints-edge__line { stroke: var(--ints-edge); stroke-width: 1.8; stroke-linecap: round; fill: none; }
.ints-edge__head { fill: var(--ints-edge); }
/* B 汇入公共段的斜边：用 B 的颜色区分"这撇是从 B 那边上来的" */
.ints-edge--b .ints-edge__line { stroke: var(--ints-b); }
.ints-edge--b .ints-edge__head { fill: var(--ints-b); }

/* chip 引线 */
.ints-lead { stroke-width: 1.4; opacity: 0.85; }
.ints-lead--a { stroke: var(--ints-a); }
.ints-lead--b { stroke: var(--ints-b); }

/* 换头弧线 */
.ints-hop { opacity: 0; transition: opacity 0.3s ease; }
.ints-hop.is-on { opacity: 1; }
.ints-hop__line {
  fill: none;
  stroke: var(--ints-b);
  stroke-width: 2.2;
  stroke-dasharray: 7 4;
  stroke-linecap: round;
}
.ints-hop--a .ints-hop__line { stroke: var(--ints-a); }
.ints-hop__head { fill: var(--ints-b); }
.ints-hop--a .ints-hop__head { fill: var(--ints-a); }
.ints-hop__tag-bg { fill: var(--surface-muted, #ecefe8); }
.ints-hop__tag {
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: var(--ints-b);
}
.ints-hop--a .ints-hop__tag { fill: var(--ints-a); }

/* 行标签 */
.ints-row__text {
  fill: var(--text-secondary, #657168);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ints-row__text--a { fill: var(--ints-a); }
.ints-row__text--b { fill: var(--ints-b); }

/* 顶部那句"公共段从这里开始"的标注 */
.ints-shared-note__text {
  fill: var(--text-secondary, #657168);
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: central;
}
.ints-shared-note__line { stroke: var(--text-secondary, #657168); stroke-width: 1; stroke-dasharray: 3 3; opacity: 0.7; }

.ints-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 3 3;
}
.ints-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'Segoe UI Symbol', 'DejaVu Sans', Arial, sans-serif;
}

/* 底部判定横幅 */
.ints-verdict__box {
  fill: none;
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.2;
  transition: fill 0.24s ease, stroke 0.24s ease;
}
.ints-verdict__text {
  fill: var(--text-secondary, #657168);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  transition: fill 0.24s ease;
}
.ints-verdict.is-ok .ints-verdict__box { fill: var(--ints-ok); stroke: var(--ints-ok); }
.ints-verdict.is-ok .ints-verdict__text { fill: #fff; }
.ints-verdict.is-bad .ints-verdict__box { fill: var(--ints-bad); stroke: var(--ints-bad); }
.ints-verdict.is-bad .ints-verdict__text { fill: #fff; }

.ints-chip { transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; }
.ints-chip__box { rx: 12; ry: 12; }
.ints-chip__text {
  font-size: 12px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: #fff;
}
.ints-chip--a .ints-chip__box { fill: var(--ints-a); }
.ints-chip--b .ints-chip__box { fill: var(--ints-b); }

@media (prefers-reduced-motion: reduce) {
  .ints-node__box, .ints-chip, .ints-verdict__box, .ints-hop { transition: none; }
}
`;function re(){if(n(),document.getElementById(l))return;let e=document.createElement(`style`);e.id=l,e.textContent=ne,document.head.appendChild(e)}function T(n,a={}){if(!n||n.dataset.intsMounted===`1`)return{destroy(){}};n.dataset.intsMounted=`1`,re();let o=c(a);o[0];let ne=a.autoplay!==!1,T=Array.isArray(a.pool)&&a.pool.length?a.pool:[1,2,3,4,5,6,7],E=Array.isArray(a.pathA)?a.pathA:[0,1,2,3,4],D=Array.isArray(a.pathB)?a.pathB:[5,6,3,4],{a:O,b:k,c:A}=s(E,D),ie=A>0?E.slice(O):[],ae=new Set(ie);O>0&&E[O-1],k>0&&D[k-1];let oe=Math.max(E.length,D.length,1),se=S,j=e=>76+e*102,ce=2*p+oe*u+(oe-1)*f,M=ce+x*2+S*2,N=se+ce+x,le=O,P=e=>e+d/2;function F(e){let t=E.indexOf(e),n=D.indexOf(e);return t>=0&&ae.has(e)?{x:j(le+(t-O)),y:m,col:le+(t-O)}:t>=0&&n<0?{x:j(t),y:m,col:t}:n>=0&&t<0?{x:j(n),y:h,col:n}:t>=0?{x:j(t),y:m,col:t}:{x:j(n),y:h,col:n}}let I=document.createElement(`div`);I.className=`viz ints`;let L=document.createElement(`div`);L.className=`viz__stage`,I.appendChild(L);let R=r(`svg`,{class:`viz__svg ints__svg`,viewBox:`0 0 ${M} 440`,role:`img`,"aria-label":`相交链表推演动画`});L.appendChild(R);let z=r(`g`,{class:`ints-shared-note`}),B=r(`line`,{class:`ints-shared-note__line`}),ue=r(`text`,{class:`ints-shared-note__text`,x:M/2,y:w});z.append(B,ue),R.appendChild(z);let de=[];for(let[e,t]of[[N,P(m)],[N,P(h)]]){R.appendChild(r(`circle`,{class:`ints-null__ring`,cx:e,cy:t,r:14}));let n=r(`text`,{class:`ints-null__text`,x:e,y:t});n.textContent=`∅`,R.appendChild(n),de.push({cx:e,cy:t})}let V=r(`g`,{class:`ints-edges`});R.appendChild(V);let H=r(`g`,{class:`ints-answer`}),U=r(`rect`,{class:`ints-answer__box`,x:0,y:0,width:76,height:60,rx:13});H.appendChild(U),R.appendChild(H);let fe=new Map;for(let e of new Set([...E,...D])){let t=F(e),n=r(`g`,{class:`ints-node${ae.has(e)?` is-shared`:``}`});n.setAttribute(`transform`,`translate(${t.x} ${t.y})`),n.appendChild(r(`rect`,{class:`ints-node__box`,x:0,y:0,width:u,height:d,rx:9}));let i=r(`text`,{class:`ints-node__value`,x:u/2,y:d/2});i.textContent=String(T[e]),n.appendChild(i),R.appendChild(n),fe.set(e,n)}let W=[],pe=(e,t)=>{for(let n=0;n<e.length-1;n+=1){let r=e[n],i=e[n+1],a=`${r}->${i}`;W.some(e=>e.key===a)||W.push({key:a,from:r,to:i,kind:t})}};pe(E,`a`),pe(D,`b`);let me=[];for(let e of W){let t=r(`g`,{class:`ints-edge ints-edge--${e.kind}`}),n=r(`path`,{class:`ints-edge__line`}),i=r(`path`,{class:`ints-edge__head`});t.append(n,i),V.appendChild(t),me.push({...e,g:t,line:n,head:i})}let he=[];{let e=r(`g`,{class:`ints-edge`}),t=r(`path`,{class:`ints-edge__line`}),n=r(`path`,{class:`ints-edge__head`});e.append(t,n),V.appendChild(e),he.push({g:e,line:t,head:n,slot:E[E.length-1],row:m})}let ge={};for(let e of[`a`,`b`]){let t=r(`g`,{class:`ints-hop ints-hop--${e}`}),n=r(`path`,{class:`ints-hop__line`}),i=r(`path`,{class:`ints-hop__head`}),a=r(`rect`,{class:`ints-hop__tag-bg`,x:-76,y:-9,width:152,height:18,rx:6}),o=r(`text`,{class:`ints-hop__tag`,x:0,y:0});t.append(n,i,a,o),R.appendChild(t),ge[e]={g:t,line:n,head:i,tagBg:a,tag:o}}let G=[];if(O>0){let e=r(`text`,{class:`ints-row__text ints-row__text--a`,x:j(0)+ee,y:P(m)});e.textContent=`A`,R.appendChild(e),G.push(e)}if(k>0){let e=r(`text`,{class:`ints-row__text ints-row__text--b`,x:j(0)+ee,y:P(h)});e.textContent=`B`,R.appendChild(e),G.push(e)}function _e(e,t){let n=r(`g`,{class:`ints-chip ints-chip--${e}`});n.appendChild(r(`rect`,{class:`ints-chip__box`,x:-52/2,y:-24/2,width:y,height:b}));let i=r(`text`,{class:`ints-chip__text`,x:0,y:0});return i.textContent=t,n.appendChild(i),n}let K=_e(`a`,`pA`),q=_e(`b`,`pB`);R.append(K,q);let J=r(`line`,{class:`ints-lead ints-lead--a`}),Y=r(`line`,{class:`ints-lead ints-lead--b`});V.append(J,Y);let X=r(`g`,{class:`ints-verdict`}),ve=r(`rect`,{class:`ints-verdict__box`,x:(M-240)/2,y:C-18,width:240,height:36,rx:18}),ye=r(`text`,{class:`ints-verdict__text`,x:M/2,y:C});X.append(ve,ye),R.appendChild(X);let Z=document.createElement(`p`);Z.className=`viz__desc`,Z.setAttribute(`aria-live`,`polite`),I.appendChild(Z);let be=i();I.appendChild(be.root),n.textContent=``,n.appendChild(I);let Q=null;for(let e of me)xe(e,F(e.from),F(e.to));{let e=he[0],t=F(e.slot),n=t.y+d/2,r=t.x+u+3,i=N-14;e.line.setAttribute(`d`,`M ${r} ${n} L ${i-8} ${n}`),e.head.setAttribute(`d`,`M ${i} ${n} L ${i-9} ${n-5.5} L ${i-9} ${n+5.5} Z`)}function xe(e,t,n){if(t.y===n.y){let r=t.y+d/2,i=t.x+u,a=n.x;e.line.setAttribute(`d`,`M ${i+3} ${r} L ${a-9} ${r}`),e.head.setAttribute(`d`,`M ${a} ${r} L ${a-9} ${r-5.5} L ${a-9} ${r+5.5} Z`);return}let r=t.x+u,i=t.y+d/2,a=n.x,o=n.y+d/2,s=r+3,c=a-9,l=Math.max(26,(c-s)*.45);e.line.setAttribute(`d`,`M ${s} ${i} C ${s+l} ${i}, ${c-l} ${o}, ${c} ${o}`),e.head.setAttribute(`d`,`M ${a} ${o} L ${a-9} ${o-5.5} L ${a-9} ${o+5.5} Z`)}function Se(e,t,n){let r=ge[e];if(r.g.classList.toggle(`is-on`,n),!n)return;let i=e===`a`?t.fromA:t.fromB,a=(e===`a`?t.onA:t.onB)===`A`?E:D;if(i==null)return;let o=F(i),s=F(a[0]),c=o.x+u/2,l=e===`a`?o.y+d:o.y,f=s.x+u/2,p=e===`a`?s.y:s.y+d,m=v;r.line.setAttribute(`d`,`M ${c} ${l} L ${c} ${m} L ${f} ${m} L ${f} ${p}`);let h=p<m;r.head.setAttribute(`d`,h?`M ${f} ${p} L ${f-5.5} ${p+9} L ${f+5.5} ${p+9} Z`:`M ${f} ${p} L ${f-5.5} ${p-9} L ${f+5.5} ${p-9} Z`);let g=(c+f)/2;r.tagBg.setAttribute(`x`,g-76),r.tagBg.setAttribute(`y`,m-9),r.tag.setAttribute(`x`,g),r.tag.setAttribute(`y`,m),r.tag.textContent=e===`a`?`pA 走完 A → 换到 B 的头`:`pB 走完 B → 换到 A 的头`}function Ce(e,t){let n=t===`A`?e.onA:e.onB,r=t===`A`?e.iA:e.iB,i=n===`A`?E:D;if(r>=i.length){let e=n===`A`?m:h;return{x:N-u/2,y:e,onNull:!0}}return{...F(i[r]),onNull:!1}}function we(t,n){let r=(()=>{let e=n.onA===`A`?E:D;return n.iA>=e.length?null:e[n.iA]})(),i=(()=>{let e=n.onB===`A`?E:D;return n.iB>=e.length?null:e[n.iB]})();for(let[e,t]of fe)t.classList.toggle(`is-cursor-a`,e===r),t.classList.toggle(`is-cursor-b`,e===i&&e!==r),t.classList.toggle(`is-meet`,n.meet!==null&&e===n.meet);if(n.answer!==null&&n.answer!==void 0){let e=F(n.answer);U.setAttribute(`x`,e.x-7),U.setAttribute(`y`,e.y-7),H.style.opacity=`1`}else H.style.opacity=`0`;if(n.answer!==null&&n.answer!==void 0&&A>0){let e=F(n.answer).x+u/2;ue.textContent=`公共段从这里开始（两条链共用这 ${A} 个节点）`,B.setAttribute(`x1`,e),B.setAttribute(`x2`,e),B.setAttribute(`y1`,55),B.setAttribute(`y2`,m-12),z.style.opacity=`1`}else z.style.opacity=`0`;let a=Ce(n,`A`),o=Ce(n,`B`),s=r!==null&&r===i,c=a.onNull?m:a.y,l=o.onNull?h:o.y,f=c===h?_:g,p=l===m?g:_,v=s?f-14:f,y=s?p+14:p;K.setAttribute(`transform`,`translate(${a.x+u/2} ${v})`),q.setAttribute(`transform`,`translate(${o.x+u/2} ${y})`),K.style.opacity=`1`,q.style.opacity=`1`;let x=(e,t)=>{let n=e<t.y;return{x:t.x+u/2,y1:n?e+b/2:e-b/2,y2:n?t.y-2:t.y+d+2}},S=x(v,a),C=x(y,o);J.setAttribute(`x1`,S.x),J.setAttribute(`x2`,S.x),J.setAttribute(`y1`,S.y1),J.setAttribute(`y2`,S.y2),Y.setAttribute(`x1`,C.x),Y.setAttribute(`x2`,C.x),Y.setAttribute(`y1`,C.y1),Y.setAttribute(`y2`,C.y2),Se(`a`,n,n.phase===`jump`&&n.jumpsA),Se(`b`,n,n.phase===`jump`&&n.jumpsB),X.setAttribute(`class`,`ints-verdict`);let w=`准备开始`;n.phase===`found`?(X.classList.add(`is-ok`),w=`✓ 相交于节点 ${T[n.meet]}`):n.phase===`none`?(X.classList.add(`is-bad`),w=`✗ 两条链表不相交`):n.phase===`jump`?w=`换头中…`:n.phase===`walk`?w=`同步前进中…`:n.phase===`init`&&(w=`待判定`),ye.textContent=w,e(Z,n.desc)}let $=t({steps:o,controls:be,intervalMs:te,onRender:we});$.jumpTo(Math.trunc(a.initialStep)||0);let Te=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return ne&&!Te&&typeof IntersectionObserver==`function`&&(Q=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){Q.disconnect(),Q=null,$.play();return}},{threshold:.35}),Q.observe(I)),{destroy(){Q&&=(Q.disconnect(),null),$.destroy(),n.textContent=``,delete n.dataset.intsMounted,document.getElementById(l)?.remove()}}}export{T as default,T as mountIntersectLists};