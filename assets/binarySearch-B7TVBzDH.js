import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[-1,0,3,5,9,12,15,20,26,31,38,44],o=31;function s(e={}){let t=Array.isArray(e.nums)&&e.nums.length>0?[...e.nums]:[...a],n=Number.isFinite(e.target)?e.target:o,r=[],i=0,s=t.length-1,c=-1,l=!1,u=(e,a,o={})=>{r.push({phase:e,desc:a,nums:[...t],target:n,left:i,right:s,prevLeft:i,prevRight:s,mid:null,value:null,cmp:null,action:null,eliminated:0,result:c,found:l,done:e===`done`,...o})};u(`init`,`有序数组 \`[${t.join(`, `)}]\`，找 \`target = ${n}\`。二分的本质不是"折半"，是**维持一条不变量**：若 target 在数组里，它的下标永远落在闭区间 \`[left, right]\` 内。开局区间是整段 \`[0, ${t.length-1}]\`。每轮探中点、把**不可能的一半**整段扔掉 —— 扔掉的前半句是"检查过 mid"，后半句是"边界必须跳过 mid"（\`left = mid + 1\` / \`right = mid - 1\`）。三条铁律配套闭区间这一个约定：\`while (left <= right)\`、\`mid = left + ((right - left) >> 1)\`、边界收缩带 ±1。`,{left:0,right:t.length-1,prevLeft:0,prevRight:t.length-1});let d=0;for(;i<=s&&d<64;){d+=1;let e=i,a=s,o=i+(s-i>>1),f=t[o],p=f<n?-1:+(f>n);if(p===0){l=!0,c=o,u(`probe`,`**第 ${r.length} 探**：\`mid = ${e} + ((${a} - ${e}) >> 1) = ${o}\`，\`nums[${o}] = ${f}\` **等于** target —— 结案！注意区间**不动**：命中即返回，二分查找（找特定值）在这一刻就结束了。全程只探了 ${r.length} 次 —— 每探一次砍掉一半，\`log₂(${t.length})\` 级别。`,{mid:o,value:f,cmp:p,action:`found`,eliminated:0});break}p<0?(i=o+1,u(`probe`,`**第 ${r.length} 探**：\`mid = ${e} + ((${a} - ${e}) >> 1) = ${o}\`，\`nums[${o}] = ${f} < ${n}\` —— 升序数组里 mid **左边（含 mid）**全部比 target 小，整段排除：\`left = mid + 1 = ${i}\`，\`right\` 不动。一次扔掉 ${o-e+1} 个元素，不变量"答案若在则必在 [left, right]"依然成立。`,{mid:o,value:f,cmp:p,action:`go_right`,eliminated:o-e+1,left:i,right:s,prevLeft:e,prevRight:a})):(s=o-1,u(`probe`,`**第 ${r.length} 探**：\`mid = ${e} + ((${a} - ${e}) >> 1) = ${o}\`，\`nums[${o}] = ${f} > ${n}\` —— mid **右边（含 mid）**全部比 target 大，整段排除：\`right = mid - 1 = ${s}\`，\`left\` 不动。一次扔掉 ${a-o+1} 个元素，搜索区间从 ${a-e+1} 缩到 ${s-i+1}。`,{mid:o,value:f,cmp:p,action:`go_left`,eliminated:a-o+1,left:i,right:s,prevLeft:e,prevRight:a}))}return u(`done`,l?`返回 **\`${c}\`**。复盘：${r.length-1} 次探测把 ${t.length} 个元素砍到命中 —— 每次比较都**排除一半**，这就是 \`O(log n)\` 的全部秘密。三条铁律回顾：① 闭区间 \`[left, right]\` 配 \`while (left <= right)\`；② \`mid = left + ((right - left) >> 1)\` 防爆 int；③ 收缩必带 ±1，mid 检查过不回头。`:`\`left = ${i} > right = ${s}\`，闭区间**空了** —— 不变量的逆否命题：若 target 在数组里它本该还在区间内，区间却已空，所以 target 必不在，返回 \`-1\`。注意 \`left === right + 1\` 恰好是闭区间为空的条件 —— 这就是 \`while (left <= right)\` 的由来。`,{done:!0,result:c,found:l,left:i,right:s}),r}var c=`binarysearch-styles`,l=34,u=62,d=76,f=42,p=132,m=148,h=168,ee=46,g=228,_=56,v=306,te=604,ne=1400,y=`
.bsv { display: flex; flex-direction: column; gap: 14px; }
.bsv__svg { width: 100%; height: auto; display: block; }

.bsv-note {
  fill: var(--bsv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bsv-note--r { text-anchor: end; }

.bsv-cell__box {
  fill: var(--bsv-fill, #ffffff); stroke: var(--bsv-line, #c3c9c2); stroke-width: 1.5;
}
.bsv-cell__val {
  fill: var(--bsv-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bsv-cell__idx {
  fill: var(--bsv-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.bsv-cell.is-out .bsv-cell__box { fill: var(--bsv-past, #eef0ec); stroke: var(--bsv-past-line, #d8ddd6); }
.bsv-cell.is-out .bsv-cell__val { fill: var(--bsv-dim, #9aa39c); }
.bsv-cell.is-mid .bsv-cell__box {
  fill: var(--bsv-gold-fill, #fdf3e3); stroke: var(--bsv-gold, #c2872f); stroke-width: 3;
}
.bsv-cell.is-mid .bsv-cell__val { fill: var(--bsv-gold, #c2872f); }
.bsv-cell.is-hit .bsv-cell__box {
  fill: var(--bsv-ok-fill, #eef5f1); stroke: var(--bsv-ok, #3f6b57); stroke-width: 3;
}
.bsv-cell.is-hit .bsv-cell__val { fill: var(--bsv-ok, #3f6b57); }

.bsv-ptr { font-size: 11px; font-weight: 700; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.bsv-ptr--l { fill: var(--bsv-ok, #3f6b57); }
.bsv-ptr--r { fill: var(--bsv-hot, #a45f45); }
.bsv-ptr--m { fill: var(--bsv-gold, #c2872f); }
.bsv-tri--l { fill: var(--bsv-ok, #3f6b57); }
.bsv-tri--r { fill: var(--bsv-hot, #a45f45); }
.bsv-tri--m { fill: var(--bsv-gold, #c2872f); }

.bsv-banner__box {
  fill: var(--bsv-banner, #f4f3ef); stroke: var(--bsv-line, #c3c9c2); stroke-width: 1.5;
}
.bsv-banner__text {
  fill: var(--bsv-hot, #a45f45); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bsv-banner__text.is-ok { fill: var(--bsv-ok, #3f6b57); }

.bsv-panel__box {
  fill: var(--bsv-fill, #ffffff); stroke: var(--bsv-line, #c3c9c2); stroke-width: 1.5;
}
.bsv-panel__label {
  fill: var(--bsv-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.bsv-panel__num {
  fill: var(--bsv-ink, #1f2a24); font-size: 19px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.bsv-panel__num.is-fresh { fill: var(--bsv-gold, #c2872f); }
.bsv-panel__num.is-final { fill: var(--bsv-ok, #3f6b57); }

.bsv-phase__text {
  fill: var(--bsv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function b(){if(document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=y,document.head.appendChild(e)}function x(a,o={}){if(!a||a.dataset.binarysearchMounted===`1`)return{destroy(){}};a.dataset.binarysearchMounted=`1`,b();let y=s(o),x=o.autoplay!==!1,S=y[0].nums,C=y[0].target,w=r,T=document.createElement(`div`);T.className=`viz bsv`;let E=document.createElement(`div`);E.className=`viz__stage`,T.appendChild(E);let D=w(`svg`,{class:`viz__svg bsv__svg`,viewBox:`0 0 660 328`,role:`img`,"aria-label":`二分查找 LC704 推演动画`});E.appendChild(D);let O=w(`g`,{}),k=w(`g`,{});D.appendChild(O),D.appendChild(k);let A=w(`text`,{class:`bsv-note`,x:26,y:l});A.textContent=`不变量：target 若在数组里，下标恒在 [left, right]`,k.appendChild(A);let j=w(`text`,{class:`bsv-note bsv-note--r`,x:634,y:l});j.textContent=`target = ${C}`,k.appendChild(j);let M=S.length,N=Math.min(46,Math.floor((te-(M-1)*4)/Math.max(1,M))),P=(660-(M*N+(M-1)*4))/2,F=S.map((e,t)=>{let n=P+t*(N+4),r=w(`g`,{class:`bsv-cell`});r.appendChild(w(`rect`,{class:`bsv-cell__box`,x:n,y:d,width:N,height:f,rx:6}));let i=w(`text`,{class:`bsv-cell__val`,x:n+N/2,y:92});i.textContent=String(e),r.appendChild(i);let a=w(`text`,{class:`bsv-cell__idx`,x:n+N/2,y:109});return a.textContent=String(t),r.appendChild(a),O.appendChild(r),{g:r,cx:n+N/2}}),I=w(`path`,{class:`bsv-tri bsv-tri--m`,d:``}),L=w(`text`,{class:`bsv-ptr bsv-ptr--m`,x:0,y:u});L.textContent=`mid`;let R=w(`path`,{class:`bsv-tri bsv-tri--l`,d:``}),z=w(`text`,{class:`bsv-ptr bsv-ptr--l`,x:0,y:m});z.textContent=`left`;let B=w(`path`,{class:`bsv-tri bsv-tri--r`,d:``}),V=w(`text`,{class:`bsv-ptr bsv-ptr--r`,x:0,y:m});V.textContent=`right`,k.append(I,L,R,z,B,V),k.appendChild(w(`rect`,{class:`bsv-banner__box`,x:26,y:h,width:608,height:ee,rx:9}));let H=w(`text`,{class:`bsv-banner__text`,x:660/2,y:191});k.appendChild(H),k.appendChild(w(`rect`,{class:`bsv-panel__box`,x:26,y:g,width:608,height:_,rx:9}));let U=(e,t)=>{let n=w(`text`,{class:`bsv-panel__label`,x:t,y:243});n.textContent=e;let r=w(`text`,{class:`bsv-panel__num`,x:t,y:265});return k.append(n,r),r},W=U(`left`,660/2-165),G=U(`right`,660/2-55),K=U(`区间大小`,385),q=U(`已排除`,495),J=w(`text`,{class:`bsv-phase__text`,x:660/2,y:v});k.appendChild(J);let Y=document.createElement(`p`);Y.className=`viz__desc`,Y.setAttribute(`aria-live`,`polite`);function X(t,n){if(!n)return;F.forEach((e,t)=>{let r=[`bsv-cell`];n.mid!==null&&t===n.mid?r.push(n.action===`found`?`is-hit`:`is-mid`):(t<n.left||t>n.right)&&r.push(`is-out`),e.g.setAttribute(`class`,r.join(` `))});let r=(e,t,n)=>n===`down`?`M ${e-6} ${t-8} L ${e+6} ${t-8} L ${e} ${t+1} Z`:`M ${e-6} ${t+8} L ${e+6} ${t+8} L ${e} ${t-1} Z`;if(n.mid!==null){let e=F[n.mid].cx;I.setAttribute(`d`,r(e,d-4,`down`)),L.setAttribute(`x`,e),I.style.opacity=`1`,L.style.opacity=`1`}else I.setAttribute(`d`,``),I.style.opacity=`0`,L.style.opacity=`0`;let i=n.left<M?F[n.left].cx:F[M-1].cx+N+4,a=n.right>=0?F[n.right].cx:F[0].cx-N-4;R.setAttribute(`d`,r(i,p,`up`)),z.setAttribute(`x`,i),B.setAttribute(`d`,r(a,p,`up`)),V.setAttribute(`x`,a);let o=n.left>n.right;if(z.textContent=o?`left>right`:`left`,V.textContent=`right`,n.phase===`probe`){let e=n.cmp<0?`<`:n.cmp>0?`>`:`=`,t=n.action===`found`?`命中 → 返回 ${n.mid}`:n.action===`go_right`?`left = mid + 1 = ${n.left}（排除 ${n.eliminated} 个）`:`right = mid - 1 = ${n.right}（排除 ${n.eliminated} 个）`;H.textContent=`nums[${n.mid}] = ${n.value} ${e} ${C}  →  ${t}`,H.setAttribute(`class`,`bsv-banner__text`+(n.action===`found`?` is-ok`:``))}else n.phase===`done`?(H.textContent=n.found?`返回下标 ${n.result}`:`区间空 → 返回 -1`,H.setAttribute(`class`,`bsv-banner__text`+(n.found?` is-ok`:``))):(H.textContent=`开局：整个数组都是嫌疑区 [0, ${M-1}]`,H.setAttribute(`class`,`bsv-banner__text`));W.textContent=String(n.left),G.textContent=String(n.right),W.setAttribute(`class`,`bsv-panel__num`+(n.action===`go_right`?` is-fresh`:``)),G.setAttribute(`class`,`bsv-panel__num`+(n.action===`go_left`?` is-fresh`:``)),K.textContent=String(Math.max(0,n.right-n.left+1));let s=0;for(let e=1;e<=t;e+=1)s+=y[e].eliminated||0;q.textContent=String(s),n.phase===`init`?J.textContent=`每轮砍一半，但绝不误伤不变量`:n.action===`go_right`?J.textContent=`nums[mid] < target → 左半（含 mid）整段出局`:n.action===`go_left`?J.textContent=`nums[mid] > target → 右半（含 mid）整段出局`:n.action===`found`?J.textContent=`找特定值：命中即返回`:J.textContent=`O(log n)：每探一次，嫌疑减半`,e(Y,n.desc)}T.appendChild(Y);let Z=i();T.appendChild(Z.root),a.textContent=``,a.appendChild(T),n();let re=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:y,controls:Z,intervalMs:ne,onRender:X});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return x&&!re&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(T)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.binarysearchMounted,document.getElementById(c)?.remove()}}}export{x as mountBinarySearch};