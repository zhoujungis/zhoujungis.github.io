import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[10,9,2,5,3,7,101,18];function o(e={}){let t=(Array.isArray(e.nums)?e.nums:a).slice(),n=t.length,r=[],i=(e,i,a={})=>{r.push({phase:e,desc:i,nums:t,n,i:null,j:null,ok:!1,better:!1,dp:[],parent:[],cands:[],best:null,bestJ:null,settled:0,answer:0,bestEnd:null,done:e===`done`,...a})};if(n===0)return i(`done`,"数组为空 —— 没有任何子序列，答案是 `0`。",{done:!0}),r;i(`init`,`给了数组 \`[${t.join(`, `)}]\`，要**最长严格递增子序列**的长度。注意「子序列」不是「子数组」：元素可以跳着挑，只要保持原来的先后顺序 —— 这一点正是难度的全部来源。破局的办法是给状态**加一个锚**：\`dp[i]\` 表示**以 \`nums[i]\` 结尾**的最长递增子序列长度。锚一加上，问题就从「整段怎么挑」退化成「我接在谁后面」：\`dp[i] = 1 + max(dp[j])\`，其中 \`j < i\` 且 \`nums[j] < nums[i]\`；接不上就单独成串，取 \`1\`。最后答案是**整个 \`dp\` 数组的最大值**，不是 \`dp[n - 1]\`。`);let o=Array(n).fill(1),s=Array(n).fill(-1),c=0,l=null;for(let e=0;e<n;e+=1){let n=t[e],r=1,a=-1,u=[];o[e]=1,s[e]=-1;for(let d=0;d<e;d+=1){let f=t[d],p=f<n;p&&u.push(d);let m=p&&o[d]+1>r,h=[`回看 \`j = ${d}\`（值 \`${f}\`）：`];if(!p)h.push(`\`${f} >= ${n}\` —— **接不上**：递增序列里下一个数必须严格更大。`);else if(m){let t=r;r=o[d]+1,a=d,h.push(`\`${f} < ${n}\` 能接，而且 \`dp[${d}] + 1 = ${o[d]} + 1 = ${r}\`，**比当前最好成绩 \`${t}\` 更长** —— 刷新：\`dp[${e}] = ${r}\`，最优前驱 \`parent[${e}] = ${d}\`。`)}else h.push(`\`${f} < ${n}\` 能接，但 \`dp[${d}] + 1 = ${o[d]+1} <= ${r}\`，**不如下面那条链长**，不刷新。`);m&&(o[e]=r,s[e]=a),h.push(`本轮能接的前驱有 \`${u.length}\` 个 \`[${u.join(`, `)}]\`，此刻 \`dp[${e}] = ${r}\`。`),i(`scan`,h.join(``),{i:e,j:d,ok:p,better:m,dp:o.slice(),parent:s.slice(),cands:u.slice(),best:r,bestJ:a,settled:e,answer:c,bestEnd:l})}o[e]=r,s[e]=a;let d=c;r>c&&(c=r,l=e),i(`settle`,`\`i = ${e}\`（值 \`${n}\`）这一轮扫完、定型：`+(a>=0?`最优前驱是 \`j = ${a}\`（值 \`${t[a]}\`，\`dp = ${o[a]}\`），所以 \`dp[${e}] = ${r}\` —— 就是把 \`${n}\` 接在 \`j = ${a}\` 那条链的尾巴上。`:`前面没有任何比 \`${n}\` 小的元素，接不上任何人，只能自己单独成串：\`dp[${e}] = 1\`。`)+(r>d?`**全局最长刷新到 \`${c}\`**（链的末端是 \`i = ${l}\`）。`:`全局最长仍然是 \`${c}\`，没有被刷新。`),{i:e,dp:o.slice(),parent:s.slice(),cands:u.slice(),best:r,bestJ:a,settled:e+1,answer:c,bestEnd:l})}return i(`done`,`\`${n}\` 个位置全部定型：\`dp = [${o.join(`, `)}]\`。答案是**整个 \`dp\` 的最大值** \`${c}\`，出现在 \`i = ${l}\`（值 \`${t[l]}\`）—— **不是 \`dp[${n-1}] = ${o[n-1]}\`**，这是本题第一大坑，而官方样例恰好让两者相等。金框那条就是一条最长递增子序列，长度 \`${c}\`。复杂度：每个 \`i\` 都要往回看一遍，时间 \`O(n^2)\`；\`dp\` 和 \`parent\` 各 \`O(n)\` 空间。想压到 \`O(n log n)\`，得换一套记账方式 —— 看下一个动画。`,{i:n-1,dp:o.slice(),parent:s.slice(),settled:n,answer:c,bestEnd:l,done:!0}),r}var s=`lisdp-styles`,c=26,l=44,u=44,d=112,f=124,p=52,m=200,h=212,g=34,ee=260,te=32,_=316,v=30,y=604,ne=950,b=`
.lisdp {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.lisdp__svg { width: 100%; height: auto; display: block; }

.lisdp-note {
  fill: var(--lisdp-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lisdp-banner__box {
  fill: var(--lisdp-banner, #f4f3ef);
  stroke: var(--lisdp-line, #c3c9c2);
  stroke-width: 1.5;
}
.lisdp-banner__seg {
  fill: var(--lisdp-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisdp-banner__val {
  fill: var(--lisdp-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lisdp-cell__box {
  fill: var(--lisdp-fill, #ffffff);
  stroke: var(--lisdp-line, #c3c9c2);
  stroke-width: 1.5;
}
.lisdp-cell__val {
  fill: var(--lisdp-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisdp-cell__sub {
  fill: var(--lisdp-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ---- 通道一：底色（可接 / 链上）。is-chain 写在后面，同权重时覆盖 is-cand ---- */
.lisdp-cell.is-cand .lisdp-cell__box { fill: var(--lisdp-ok-fill, #eef5f1); }
.lisdp-cell.is-chain .lisdp-cell__box { fill: var(--lisdp-gold-fill, #fdf3e3); }
/* ---- 通道二：边框 ---- */
.lisdp-cell.is-cur .lisdp-cell__box {
  stroke: var(--lisdp-hot, #a45f45);
  stroke-width: 3;
}
.lisdp-cell.is-cur .lisdp-cell__val { fill: var(--lisdp-hot, #a45f45); }
.lisdp-cell.is-better .lisdp-cell__box {
  stroke: var(--lisdp-gold, #c2872f);
  stroke-width: 3;
}
.lisdp-cell.is-better .lisdp-cell__val { fill: var(--lisdp-gold, #c2872f); }
.lisdp-cell.is-dead .lisdp-cell__box {
  stroke: var(--lisdp-dim, #9aa39c);
  stroke-dasharray: 4 3;
  stroke-width: 2;
}
.lisdp-cell.is-dead .lisdp-cell__val { fill: var(--lisdp-dim, #9aa39c); }
.lisdp-cell.is-scan .lisdp-cell__box {
  stroke: var(--lisdp-ok, #3f6b57);
  stroke-width: 2.5;
}
.lisdp-cell.is-scan .lisdp-cell__val { fill: var(--lisdp-ok, #3f6b57); }
.lisdp-cell.is-ghost .lisdp-cell__box {
  fill: none;
  stroke: var(--lisdp-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.2;
}
.lisdp-cell.is-ghost .lisdp-cell__val { fill: var(--lisdp-dim, #9aa39c); }
.lisdp-cell.is-growing .lisdp-cell__box {
  fill: var(--lisdp-gold-fill, #fdf3e3);
  stroke: var(--lisdp-hot, #a45f45);
  stroke-dasharray: 5 3;
  stroke-width: 2.5;
}
.lisdp-cell.is-growing .lisdp-cell__val { fill: var(--lisdp-hot, #a45f45); }
.lisdp-cell.is-fresh .lisdp-cell__box {
  fill: var(--lisdp-gold-fill, #fdf3e3);
  stroke: var(--lisdp-gold, #c2872f);
  stroke-width: 3;
}
.lisdp-cell.is-fresh .lisdp-cell__val { fill: var(--lisdp-gold, #c2872f); }

.lisdp-ring {
  fill: none;
  stroke: var(--lisdp-gold, #c2872f);
  stroke-width: 2;
  stroke-dasharray: 5 4;
  opacity: 0;
}
.lisdp-ring.is-on { opacity: 1; }

.lisdp-badge__box {
  fill: var(--lisdp-hot, #a45f45);
  opacity: 0;
}
.lisdp-badge__box.is-on { opacity: 1; }
.lisdp-badge__text {
  fill: #ffffff;
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.lisdp-badge__text.is-on { opacity: 1; }

.lisdp-label {
  fill: var(--lisdp-muted, #657168);
  font-size: 12px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lisdp-ans__box {
  fill: var(--lisdp-banner, #f4f3ef);
  stroke: var(--lisdp-line, #c3c9c2);
  stroke-width: 1.5;
}
.lisdp-ans__box.is-hot {
  fill: var(--lisdp-gold-fill, #fdf3e3);
  stroke: var(--lisdp-gold, #c2872f);
  stroke-width: 2;
}
.lisdp-ans__text {
  fill: var(--lisdp-ink, #1f2a24);
  font-size: 14px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisdp-ans__text.is-hot { fill: var(--lisdp-gold, #c2872f); }

.lisdp-phase__text {
  fill: var(--lisdp-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function re(){if(document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=b,document.head.appendChild(e)}function ie(e,t){let n=new Set;if(t==null||t<0)return n;let r=t,i=0;for(;r>=0&&i<128;)n.add(r),r=e.parent&&e.parent[r]!==void 0?e.parent[r]:-1,i+=1;return n}function x(a,b={}){if(!a||a.dataset.lisdpMounted===`1`)return{destroy(){}};a.dataset.lisdpMounted=`1`,re();let x=o(b),ae=b.autoplay!==!1,S=x[0],C=S.nums,w=S.n,T=r,E=document.createElement(`div`);E.className=`viz lisdp`;let D=document.createElement(`div`);D.className=`viz__stage`,E.appendChild(D);let O=()=>{let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e};if(w===0){let e=T(`svg`,{class:`viz__svg lisdp__svg`,viewBox:`0 0 620 120`,role:`img`}),t=T(`text`,{x:310,y:60,style:`fill: var(--lisdp-muted, #657168); font-size: 14px; text-anchor: middle;`});return t.textContent=`数组为空 —— 没有子序列，答案是 0`,e.appendChild(t),D.appendChild(e),E.appendChild(O()),E.appendChild(i().root),a.textContent=``,a.appendChild(E),n(),{destroy(){a.textContent=``,delete a.dataset.lisdpMounted,document.getElementById(s)?.remove()}}}let k=56;w*k+(w-1)*8>y&&(k=Math.max(24,Math.floor((y-(w-1)*8)/w)));let A=w*k+(w-1)*8,j=Math.max(660,v*2+A),M=(j-A)/2,N=e=>M+e*(k+8)+k/2,oe=j-v*2,P=T(`svg`,{class:`viz__svg lisdp__svg`,viewBox:`0 0 ${j} 338`,role:`img`,"aria-label":`最长递增子序列 动态规划推演动画`});D.appendChild(P);let F=T(`g`,{class:`lisdp-marks`}),I=T(`g`,{class:`lisdp-cells`}),se=T(`g`,{class:`lisdp-labels`});P.appendChild(F),P.appendChild(I),P.appendChild(se);let L=T(`text`,{class:`lisdp-note`,x:v,y:c});L.textContent=`dp[i] = 以 nums[i] 结尾的最长递增子序列长度 —— 答案是整个 dp 的最大值`,F.appendChild(L),F.appendChild(T(`rect`,{class:`lisdp-banner__box`,x:v,y:l,width:oe,height:u,rx:9}));let R=T(`text`,{class:`lisdp-banner__seg`,x:48,y:66}),z=T(`text`,{class:`lisdp-banner__seg`,x:240,y:66}),B=T(`text`,{class:`lisdp-banner__val`,x:j-v-18,y:66});F.appendChild(R),F.appendChild(z),F.appendChild(B);let V=T(`text`,{class:`lisdp-label`,x:M-14,y:150});V.textContent=`nums`,F.appendChild(V);let H=T(`text`,{class:`lisdp-label`,x:M-14,y:229});H.textContent=`dp`,F.appendChild(H);let U=[];for(let e=0;e<w;e+=1){let t=T(`g`,{class:`lisdp-cell`});t.appendChild(T(`rect`,{class:`lisdp-cell__box`,x:N(e)-k/2,y:f,width:k,height:p,rx:6}));let n=T(`text`,{class:`lisdp-cell__val`,x:N(e),y:143});n.textContent=String(C[e]),t.appendChild(n);let r=T(`text`,{class:`lisdp-cell__sub`,x:N(e),y:165});r.textContent=`#${e}`,t.appendChild(r),I.appendChild(t),U.push({g:t})}let W=[];for(let e=0;e<w;e+=1){let t=T(`g`,{class:`lisdp-cell`});t.appendChild(T(`rect`,{class:`lisdp-cell__box`,x:N(e)-k/2,y:h,width:k,height:g,rx:6}));let n=T(`text`,{class:`lisdp-cell__val`,x:N(e),y:229});t.appendChild(n),I.appendChild(t),W.push({g:t,val:n})}let G=[];for(let e=0;e<w;e+=1){let t=T(`rect`,{class:`lisdp-ring`,x:N(e)-k/2-5,y:f-5,width:k+10,height:62,rx:9});F.appendChild(t),G.push(t)}let K=(e,t)=>{let n=T(`g`,{class:`lisdp-badge`}),r=T(`rect`,{class:`lisdp-badge__box`,x:N(0)-10,y:t-9,width:20,height:18,rx:5}),i=T(`text`,{class:`lisdp-badge__text`,x:N(0),y:t});return i.textContent=e,n.appendChild(r),n.appendChild(i),F.appendChild(n),{g:n,box:r,text:i}},ce=K(`i`,d),le=K(`j`,m),q=T(`rect`,{class:`lisdp-ans__box`,x:M,y:ee,width:A,height:te,rx:8});F.appendChild(q);let J=T(`text`,{class:`lisdp-ans__text`,x:M+A/2,y:276});F.appendChild(J);let Y=T(`text`,{class:`lisdp-phase__text`,x:j/2,y:_});F.appendChild(Y);let X=O();function ue(t,n){if(!n)return;let r=n.phase,i=r===`scan`,a=r===`settle`,o=r===`done`,s=n.i,c=n.j,l=n.cands||[],u=new Set(l),d=ie(n,o?n.bestEnd:s),f=n.answer;U.forEach((e,t)=>{let r=[`lisdp-cell`];d.has(t)&&r.push(`is-chain`),u.has(t)&&r.push(`is-cand`),s!==null&&!o&&t===s?r.push(`is-cur`):i&&t===c&&r.push(n.ok?`is-scan`:`is-dead`),!o&&n.bestJ!==null&&n.bestJ>=0&&t===n.bestJ&&t!==s&&r.push(`is-better`),e.g.setAttribute(`class`,r.join(` `))});let p=n.settled||0;W.forEach((e,t)=>{let r=[`lisdp-cell`];s!==null&&t===s&&p===s?(r.push(`is-growing`),e.val.textContent=String(n.best??``)):t<p?(e.val.textContent=String(n.dp[t]),a&&t===s?r.push(`is-fresh`):d.has(t)&&r.push(`is-chain`)):(e.val.textContent=``,r.push(`is-ghost`)),e.g.setAttribute(`class`,r.join(` `))});let m=!o&&n.bestJ!==null&&n.bestJ>=0&&s!==null&&n.bestJ<s;G.forEach((e,t)=>{e.classList.toggle(`is-on`,m&&t===n.bestJ)});let h=(e,t,n)=>{e.box.classList.toggle(`is-on`,n),e.text.classList.toggle(`is-on`,n),n&&(e.box.setAttribute(`x`,N(t)-10),e.text.setAttribute(`x`,N(t)))};h(ce,s??0,s!==null&&!o),h(le,c??0,i&&c!==null),J.textContent=`目前最长递增子序列长度 = ${f}`;let g=f>(t>0?x[t-1].answer:0);if(q.classList.toggle(`is-hot`,g||o),J.classList.toggle(`is-hot`,g||o),i||a){if(R.textContent=`i = ${s} · 值 ${C[s]}`,i){let e=[`看 j = ${c}`];n.ok?n.better?e.push(`接上 dp[${c}] → ${n.best}`):e.push(`接上不如当前`):e.push(`${C[c]} 接不上`),z.textContent=e.join(` · `)}else z.textContent=n.bestJ>=0?`定型 dp[${s}] = ${n.best}（前驱 j = ${n.bestJ}）`:`定型 dp[${s}] = 1（单独成串）`;B.textContent=a?`dp[${s}] = ${n.dp[s]}`:`dp[${s}] = ${n.best}`}else o?(R.textContent=`${w} 个位置全部定型`,z.textContent=`答案是 max(dp)，不是 dp[n-1]`,B.textContent=`答案 = ${f}`):(R.textContent=`第一次接触？`,z.textContent=`dp[i] = 以 nums[i] 结尾的最长递增`,B.textContent=`答案是 max(dp)`);i?n.ok?n.better?Y.textContent=`dp[${c}] + 1 = ${n.best} 更长 —— dp[${s}] 刷新，最优前驱记成 j = ${c}`:Y.textContent=`dp[${c}] + 1 = ${n.dp[c]+1} 不比当前好 —— 保持不动，继续往回看`:Y.textContent=`nums[${c}] >= nums[${s}] —— 递增要求严格更大，这个 j 接不上`:a?Y.textContent=n.bestJ>=0?`dp[${s}] 定型为 ${n.best}：把 ${C[s]} 接在 j = ${n.bestJ} 那条链尾巴上`:`dp[${s}] 定型为 1：前面没有更小的元素，只能自己单独成串`:o?Y.textContent=`时间 O(n^2)、空间 O(n) —— 想更快，要把「以 i 结尾」换成「按长度记账」`:Y.textContent=`dp[i] 的「以 i 结尾」是锚 —— 有了它，才能只知道「我接在谁后面」`,e(X,n.desc)}E.appendChild(X);let Z=i();E.appendChild(Z.root),a.textContent=``,a.appendChild(E),n();let de=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:x,controls:Z,intervalMs:ne,onRender:ue});Q.jumpTo(Math.trunc(b.initialStep)||0);let $=null;return ae&&!de&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(E)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.lisdpMounted,document.getElementById(s)?.remove()}}}export{x as mountLisDp};