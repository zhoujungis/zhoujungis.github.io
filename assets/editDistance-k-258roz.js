import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=`horse`,o=`ros`,s={match:`相同（不付钱）`,replace:`替换`,delete:`删除`,insert:`插入`};function c(e,t){return Array.from(typeof e==`string`?e:t)}function l(e,t,n,r,i){let a=e[n-1],o=t[r-1];if(i.match)return`a 的 「${a}」 和 b 的 「${o}」 一样 —— 这一对不用付钱，直接抄对角 dp[${n-1}][${r-1}] = ${i.diag}。另外两个邻居连看都不用看：它们各自至少要再收 1，永远赢不了。`;let c=[`替换：对角 ${i.diag} + 1 = ${i.diag+1}`,`删除：上方 ${i.up} + 1 = ${i.up+1}`,`插入：左方 ${i.left} + 1 = ${i.left+1}`],l=`最小的是${s[i.op]}，所以 dp[${n}][${r}] = ${i.value}。`;if(i.ties.length>1){let e=i.ties.map(e=>s[e]).join(` / `);l+=`（有 ${i.ties.length} 个方向并列最小：${e} —— 数值上一模一样，只有把操作序列打出来时才分得出高下。）`}return`a 的 「${a}」 对 b 的 「${o}」 不相同，三种收尾取最小：${c.join(`；`)}。${l}`}function u(e={}){let t=c(e.word1,a),n=c(e.word2,o),r=t.length,i=n.length,s=[];for(let e=0;e<=r;e+=1)s.push(Array(i+1).fill(0));let u=[];for(let e=0;e<=i;e+=1)u.push(e);let d=[],f=(e,a,o,c)=>{d.push({phase:e,i:a,j:o,word1:t,word2:n,m:r,n:i,dp:s.map(e=>e.slice()),buf:u.slice(),bufBefore:null,charA:a!==null&&a>0?t[a-1]:null,charB:o!==null&&o>0?n[o-1]:null,op:null,ties:[],match:!1,diag:null,up:null,left:null,value:null,saved:null,answer:null,done:!1,desc:``,...c})};for(let e=0;e<=i;e+=1)s[0][e]=e;f(`init`,null,null,{desc:`先把第 0 行填成 0 … ${i}：空串变成 b 的前 j 个字符，只能一个字符一个字符地插入，代价恰好是 j。这一行不是凑数用的，它就是「前缀型 dp」的语义本身。滚动数组的初值就是这个第 0 行。`});for(let e=1;e<=r;e+=1){let r=u.slice(),a=s[e-1][0];s[e][0]=e,u[0]=e,f(`col`,e,0,{bufBefore:r,saved:a,diag:a,value:e,desc:`第 ${e} 行先补左边界：a 的前 ${e} 个字符要变成空串，只能全删掉，所以 dp[${e}][0] = ${e}。顺手把上一行的 dp[${e-1}][0] = ${a} 存进 prev —— 它是这一行第一格的对角，等下一格要用。`});for(let r=1;r<=i;r+=1){let i=u.slice(),o=u[r],c=s[e-1][r-1],d=s[e-1][r],p=s[e][r-1],m=t[e-1]===n[r-1],h=Math.min(c,d,p),g=[];c===h&&g.push(`replace`),d===h&&g.push(`delete`),p===h&&g.push(`insert`);let _=m?`match`:g[0],v=m?c:h+1;s[e][r]=v,u[r]=v,f(`cell`,e,r,{bufBefore:i,saved:a,diag:c,up:d,left:p,value:v,op:_,ties:g,match:m,desc:l(t,n,e,r,{match:m,op:_,diag:c,up:d,left:p,value:v,ties:g})}),a=o}}return f(`done`,r,i,{value:s[r][i],answer:s[r][i],done:!0,desc:`右下角 dp[${r}][${i}] = ${s[r][i]} 就是答案：a 整个变成 b 最少要 ${s[r][i]} 步。注意只有右下角这一个格子是答案 —— 第一行是「空串长成 b」，第一列是「a 缩成空串」，它们只是把边界说清楚。`+(i>0?`另外：滚动数组跑到最后，buf 只留下最后一行，答案还是 buf[${i}] = ${s[r][i]}。`:``)}),d}var d=`editdist-styles`,f=880,p={match:`相同`,replace:`替换`,delete:`删除`,insert:`插入`},m={match:`ok`,replace:`sub`,delete:`del`,insert:`ins`},h={replace:`is-sub`,delete:`is-del`,insert:`is-ins`},g=e=>h[e]||`is-sub`,_=`
.ed { display: flex; flex-direction: column; gap: 14px; }
.ed__svg { width: 100%; height: auto; display: block; }

.ed-note {
  fill: var(--ed-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.ed-banner__box {
  fill: var(--ed-banner, #f4f3ef);
  stroke: var(--ed-line, #c3c9c2);
  stroke-width: 1.5;
}
.ed-banner__seg {
  fill: var(--ed-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-banner__val {
  fill: var(--ed-gold, #c2872f);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.ed-hdr__text {
  fill: var(--ed-ink, #1f2a24);
  font-size: 14px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-hdr__idx {
  fill: var(--ed-dim, #9aa39c);
  font-size: 10px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-colhdr__text {
  fill: var(--ed-ink, #1f2a24);
  font-size: 13.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-colhdr__idx {
  fill: var(--ed-dim, #9aa39c);
  font-size: 9.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.ed-cell__box {
  fill: var(--ed-fill, #ffffff);
  stroke: var(--ed-line, #c3c9c2);
  stroke-width: 1.5;
}
.ed-cell__val {
  fill: var(--ed-ink, #1f2a24);
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-cell__op {
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-cell__op.is-sub { fill: var(--ed-diag, #c2872f); }
.ed-cell__op.is-del { fill: var(--ed-up, #3f6b57); }
.ed-cell__op.is-ins { fill: var(--ed-left, #a45f45); }
.ed-cell__op.is-ok { fill: var(--ed-ok, #3f6b57); }

/* ---- 通道一：底色（边界 / 本帧要填的格子） ---- */
.ed-cell.is-boundary .ed-cell__box {
  fill: var(--ed-dim-fill, #f6f5f1);
  stroke-dasharray: 4 3;
}
.ed-cell.is-boundary .ed-cell__val { fill: var(--ed-muted, #657168); }
/* 还没轮到的格子 */
.ed-cell.is-ghost .ed-cell__box {
  fill: none;
  stroke-dasharray: 3 3;
  stroke-width: 1.2;
}
.ed-cell.is-ghost .ed-cell__val { fill: var(--ed-dim, #9aa39c); }
/* 通道二：边框 —— 以下是本帧的主角与三个邻居，写在边界规则之后 = 故意覆盖 */
.ed-cell.is-cur .ed-cell__box {
  stroke: var(--ed-hot, #a45f45);
  stroke-width: 3;
}
.ed-cell.is-fresh .ed-cell__box {
  fill: var(--ed-gold-fill, #fdf3e3);
  stroke: var(--ed-gold, #c2872f);
  stroke-width: 3;
}
.ed-cell.is-match .ed-cell__box {
  fill: var(--ed-ok-fill, #eef5f1);
  stroke: var(--ed-ok, #3f6b57);
  stroke-width: 3;
}
/* 三个邻居按三种操作分色（本动画的语法） */
.ed-cell.is-nb-diag .ed-cell__box { stroke: var(--ed-diag, #c2872f); stroke-width: 2.5; }
.ed-cell.is-nb-up .ed-cell__box { stroke: var(--ed-up, #3f6b57); stroke-width: 2.5; }
.ed-cell.is-nb-left .ed-cell__box { stroke: var(--ed-left, #a45f45); stroke-width: 2.5; }
/* 胜出的那一项：再加粗 + 外环 */
.ed-cell.is-best .ed-cell__box { stroke-width: 4; }
/* 相同字符时，上方/左方完全不用看 */
.ed-cell.is-off { opacity: 0.4; }

.ed-ring {
  fill: none;
  stroke: var(--ed-gold, #c2872f);
  stroke-width: 2;
  stroke-dasharray: 5 4;
  opacity: 0;
}
.ed-ring.is-on { opacity: 1; }

.ed-legend__text {
  fill: var(--ed-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-phase__text {
  fill: var(--ed-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ---------- 画法二：滚动数组 ---------- */
.ed2-cell__box {
  fill: var(--ed-fill, #ffffff);
  stroke: var(--ed-line, #c3c9c2);
  stroke-width: 1.2;
}
.ed2-cell__val {
  fill: var(--ed-ink, #1f2a24);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed2-cell.is-blank .ed2-cell__box { fill: none; stroke-dasharray: 3 3; stroke-width: 1; }
.ed2-cell.is-blank .ed2-cell__val { fill: none; }
.ed2-cell.is-gone { opacity: 0.2; }
/* 上一行里已经被覆盖掉的部分 */
.ed2-cell.is-wiped { opacity: 0.4; }
.ed2-cell.is-wiped .ed2-cell__box { stroke-dasharray: 3 3; }
/* 对角是本画法的主角：虽然已被覆盖，也要从灰堆里跳出来（写在 is-wiped 之后 = 故意覆盖透明度） */
.ed2-cell.is-diag { opacity: 0.92; }
/* 还活在数组里的部分：上一行没被覆盖的 + 本行已写入的 */
.ed2-cell.is-alive .ed2-cell__box { fill: var(--ed-gold-fill, #fdf3e3); }
.ed2-cell.is-new .ed2-cell__box { fill: var(--ed-ok-fill, #eef5f1); }
/* 被覆盖掉的那一格就是对角 —— 本画法的主角 */
.ed2-cell.is-diag .ed2-cell__box { stroke: var(--ed-diag, #c2872f); stroke-width: 2.4; }
.ed2-cell.is-cur .ed2-cell__box { stroke: var(--ed-hot, #a45f45); stroke-width: 2.8; }

.ed2-buf__box {
  fill: var(--ed-fill, #ffffff);
  stroke: var(--ed-line, #c3c9c2);
  stroke-width: 1.5;
}
.ed2-buf__val {
  fill: var(--ed-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed2-buf__idx {
  fill: var(--ed-dim, #9aa39c);
  font-size: 10px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed2-buf.is-old .ed2-buf__box { fill: var(--ed-dim-fill, #f6f5f1); }
.ed2-buf.is-old .ed2-buf__val { fill: var(--ed-muted, #657168); }
.ed2-buf.is-new .ed2-buf__box { fill: var(--ed-ok-fill, #eef5f1); }
.ed2-buf.is-cur .ed2-buf__box { stroke: var(--ed-hot, #a45f45); stroke-width: 3; }

.ed2-tag {
  font-size: 11px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed2-tag.is-left { fill: var(--ed-left, #a45f45); }
.ed2-tag.is-up { fill: var(--ed-up, #3f6b57); }

.ed2-term__box {
  fill: var(--ed-banner, #f4f3ef);
  stroke: var(--ed-line, #c3c9c2);
  stroke-width: 1.4;
}
.ed2-term__box.is-sub { stroke: var(--ed-line, #c3c9c2); }
.ed2-term__main {
  fill: var(--ed-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed2-term__tag {
  font-size: 12px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed2-term__tag.is-sub { fill: var(--ed-diag, #c2872f); }
.ed2-term__tag.is-del { fill: var(--ed-up, #3f6b57); }
.ed2-term__tag.is-ins { fill: var(--ed-left, #a45f45); }
.ed2-term__note {
  fill: var(--ed-muted, #657168);
  font-size: 10.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular, Consolas, monospace';
}
/* 本帧取值范围里的那一项 */
.ed2-term.is-best .ed2-term__box { fill: var(--ed-gold-fill, #fdf3e3); }
.ed2-term.is-best.is-sub .ed2-term__box { stroke: var(--ed-diag, #c2872f); stroke-width: 2; }
.ed2-term.is-best.is-del .ed2-term__box { stroke: var(--ed-up, #3f6b57); stroke-width: 2; }
.ed2-term.is-best.is-ins .ed2-term__box { stroke: var(--ed-left, #a45f45); stroke-width: 2; }
/* 真正被选中的那一项（打平时可能有多项都最小） */
.ed2-term.is-pick .ed2-term__box { stroke-width: 3.4; }
.ed2-term.is-off { opacity: 0.42; }
.ed2-term.is-hidden { opacity: 0; }
`;function v(){if(document.getElementById(d))return;let e=document.createElement(`style`);e.id=d,e.textContent=_,document.head.appendChild(e)}function y(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function b(e,t,n){return(r,i)=>e===`init`?r===0:e===`done`||r<t?!0:r===t?i<=n:!1}function x(e,t,n,r){return Math.max(n,Math.min(r,Math.round(e/t)))}function S(e,t=12,n=7){let r=0;for(let i of e)r+=/[\u3000-\u303f\u4e00-\u9fff\uff00-\uffef]/.test(i)?t:n;return r}function C(e){return e.match||e.op===`replace`?[e.i-1,e.j-1]:e.op===`delete`?[e.i-1,e.j]:e.op===`insert`?[e.i,e.j-1]:null}function w(t,n){let{m:i,n:a,word1:o,word2:s}=t[0],c=i+1,l=a+1,u=118;l*u+(l-1)*6>520&&(u=Math.max(26,Math.floor((520-(l-1)*6)/l)));let d=38;c*d+(c-1)*5>300&&(d=Math.max(18,Math.floor((300-(c-1)*5)/c)));let f=l*u+(l-1)*6,h=120+(c*d+(c-1)*5)+20,_=h+30,v=_+22,y=Math.max(68,(680-f)/2+8),w=e=>y+e*(u+6),T=e=>120+e*(d+5),E=x(u,7.5,9,15),D=x(d,4.2,7,9),O=d>=34,k=r,A=k(`svg`,{class:`viz__svg ed__svg`,viewBox:`0 0 680 ${v}`,role:`img`,"aria-label":`编辑距离 二维动态规划推演动画`}),j=k(`g`,{class:`ed-marks`}),M=k(`g`,{class:`ed-cells`});A.appendChild(j),A.appendChild(M);let N=k(`text`,{class:`ed-note`,x:30,y:22});N.textContent=`dp[i][j] = a 的前 i 个字符 变成 b 的前 j 个字符 的最少操作数`,j.appendChild(N),j.appendChild(k(`rect`,{class:`ed-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let P=k(`text`,{class:`ed-banner__seg`,x:46,y:58}),F=k(`text`,{class:`ed-banner__seg`,x:218,y:58}),I=k(`text`,{class:`ed-banner__val`,x:634,y:58});j.appendChild(P),j.appendChild(F),j.appendChild(I);for(let e=0;e<=a;e+=1){let t=k(`text`,{class:`ed-colhdr__text`,x:w(e)+u/2,y:98});t.textContent=e===0?`""`:s[e-1];let n=k(`text`,{class:`ed-colhdr__idx`,x:w(e)+u/2,y:112});n.textContent=e===0?`j=0`:`j=${e}`,j.appendChild(t),j.appendChild(n)}for(let e=0;e<=i;e+=1){let t=k(`text`,{class:`ed-hdr__text`,x:y-16,y:T(e)+d/2});t.textContent=e===0?`""`:o[e-1];let n=k(`text`,{class:`ed-hdr__idx`,x:y-44,y:T(e)+d/2});n.textContent=e===0?`i=0`:`i=${e}`,j.appendChild(t),j.appendChild(n)}let L=[];for(let e=0;e<=i;e+=1){let t=[];for(let n=0;n<=a;n+=1){let r=k(`g`,{class:`ed-cell`});r.appendChild(k(`rect`,{class:`ed-cell__box`,x:w(n),y:T(e),width:u,height:d,rx:6}));let i=k(`text`,{class:`ed-cell__val`,x:w(n)+u/2,y:O?T(e)+d/2-6:T(e)+d/2,style:`font-size: ${E}px`});r.appendChild(i);let a=k(`text`,{class:`ed-cell__op`,x:w(n)+u/2,y:T(e)+d-9,style:`font-size: ${D}px`});O&&r.appendChild(a),M.appendChild(r),t.push({g:r,val:i,op:a})}L.push(t)}let R=k(`rect`,{class:`ed-ring`,x:0,y:0,width:u+10,height:d+10,rx:9});j.appendChild(R);let z=[{color:`--ed-diag, #c2872f`,text:`替换 = 对角`},{color:`--ed-up, #3f6b57`,text:`删除 = 上方`},{color:`--ed-left, #a45f45`,text:`插入 = 左方`}],B=(680-(z.reduce((e,t)=>e+17+S(t.text)+34,0)-34))/2;for(let e of z){j.appendChild(k(`rect`,{x:B,y:h-5.5,width:11,height:11,rx:3,style:`fill: none; stroke: var(${e.color}); stroke-width: 2.5;`}));let t=k(`text`,{class:`ed-legend__text`,x:B+17,y:h});t.textContent=e.text,j.appendChild(t),B+=17+S(e.text)+34}let V=k(`text`,{class:`ed-phase__text`,x:680/2,y:_});j.appendChild(V);function H(t,r){if(!r)return;let{phase:i,i:a,j:o,m:s,n:c,dp:l}=r,u=i===`done`,d=i===`cell`,f=b(i,a,o),h=d?C(r):null;L.forEach((e,t)=>{e.forEach((e,n)=>{let p=[`ed-cell`],_=f(t,n);if(_?(t===0||n===0)&&p.push(`is-boundary`):p.push(`is-ghost`),i===`init`&&t===0?p.push(`is-fresh`):i===`col`&&t===a&&n===0?p.push(`is-cur`):d&&t===a&&n===o?p.push(r.match?`is-match`:`is-fresh`):u&&t===s&&n===c&&p.push(`is-fresh`),d){let e=t===a-1&&n===o-1,i=t===a-1&&n===o,s=t===a&&n===o-1;e?p.push(`is-nb-diag`):i?p.push(`is-nb-up`):s&&p.push(`is-nb-left`),r.match&&(i||s)&&p.push(`is-off`),h&&h[0]===t&&h[1]===n&&p.push(`is-best`)}if(e.g.setAttribute(`class`,p.join(` `)),e.val.textContent=_?String(l[t][n]):``,O){let i=d&&t===a&&n===o;e.op.textContent=i&&m[r.op]||``,e.op.setAttribute(`class`,`ed-cell__op ${i?g(r.op):``}`)}})}),h?(R.classList.add(`is-on`),R.setAttribute(`x`,w(h[1])-5),R.setAttribute(`y`,T(h[0])-5)):R.classList.remove(`is-on`),i===`init`?(P.textContent=`第 0 行`,F.textContent=`空串长成 b 的前 j 个字符`,I.textContent=`dp[0][j] = j`):i===`col`?(P.textContent=`i = ${a} · 第 0 列`,F.textContent=`a 的前 ${a} 个字符 缩成空串`,I.textContent=`dp[${a}][0] = ${a}`):d?(P.textContent=`i = ${a} · j = ${o}`,F.textContent=r.match?`'${r.charA}' = '${r.charB}' -> 抄对角`:`'${r.charA}' 对 '${r.charB}' -> 取${p[r.op]}`,I.textContent=`dp[${a}][${o}] = ${r.value}`):(P.textContent=`右下角那一格`,F.textContent=`dp[${s}][${c}] 就是答案`,I.textContent=`答案 = ${r.answer}`),i===`init`?V.textContent=`第 0 行 / 第 0 列不是算出来的，是语义规定的：空串变成 j 个字符 = 插入 j 次。`:i===`col`?V.textContent=`第 ${a} 行先把左边界补上 —— a 的前 ${a} 个字符要缩成空串，代价就是 ${a}。`:d?V.textContent=r.match?`对角 dp[${a-1}][${o-1}] = ${r.diag} 直接抄，不收钱 —— 另外两个邻居至少大 1，不用看。`:`对角 ${r.diag}+1 / 上方 ${r.up}+1 / 左方 ${r.left}+1 —— 取${p[r.op]}，dp[${a}][${o}] = ${r.value}。`:V.textContent=`时间 O(m·n)、空间 O(m·n) —— 追问多半接着来：能不能只留一行？`,e(n,r.desc)}return{svgRoot:A,paint:H}}function T(t,n){let{m:i,n:a,word1:o,word2:s,buf:c}=t[0],l=i+1,u=a+1,d=62;u*d+(u-1)*4>304&&(d=Math.max(20,Math.floor((304-(u-1)*4)/u)));let f=24;l*f+(l-1)*4>192&&(f=Math.max(13,Math.floor((192-(l-1)*4)/l)));let m=118+(l*f+(l-1)*4)+46,h=m+48+16,_=m+48+40,v=_+22,y=e=>78+e*(d+4),x=e=>118+e*(f+4),S=e=>78+e*(d+4),C=r,w=C(`svg`,{class:`viz__svg ed__svg`,viewBox:`0 0 680 ${v}`,role:`img`,"aria-label":`编辑距离 滚动数组 O(n) 空间推演动画`}),T=C(`g`,{class:`ed2-marks`}),E=C(`g`,{class:`ed2-cells`}),D=C(`g`,{class:`ed2-panel`}),O=C(`g`,{class:`ed2-bufs`});w.appendChild(T),w.appendChild(E),w.appendChild(D),w.appendChild(O);let k=C(`text`,{class:`ed-note`,x:30,y:22});k.textContent=`同一张表，但只需要留一行 —— 每个格子只依赖「上一行」和「本行左邻」，唯一被覆盖掉的就是对角。`,T.appendChild(k),T.appendChild(C(`rect`,{class:`ed-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let A=C(`text`,{class:`ed-banner__seg`,x:46,y:58}),j=C(`text`,{class:`ed-banner__seg`,x:218,y:58}),M=C(`text`,{class:`ed-banner__val`,x:634,y:58});T.appendChild(A),T.appendChild(j),T.appendChild(M);for(let e=0;e<=a;e+=1){let t=C(`text`,{class:`ed-colhdr__text`,x:y(e)+d/2,y:106});t.textContent=e===0?`""`:s[e-1],T.appendChild(t)}for(let e=0;e<=i;e+=1){let t=C(`text`,{class:`ed-hdr__text`,x:64,y:x(e)+f/2});t.textContent=e===0?`""`:o[e-1],T.appendChild(t)}let N=[];for(let e=0;e<=i;e+=1){let t=[];for(let n=0;n<=a;n+=1){let r=C(`g`,{class:`ed2-cell`});r.appendChild(C(`rect`,{class:`ed2-cell__box`,x:y(n),y:x(e),width:d,height:f,rx:4}));let i=C(`text`,{class:`ed2-cell__val`,x:y(n)+d/2,y:x(e)+f/2});r.appendChild(i),E.appendChild(r),t.push({g:r,val:i})}N.push(t)}let P=[{op:`replace`,tag:`替换`},{op:`delete`,tag:`删除`},{op:`insert`,tag:`插入`}];P.forEach((e,t)=>{let n=118+t*57,r=C(`g`,{class:`ed2-term ${g(e.op)}`}),i=C(`rect`,{class:`ed2-term__box`,x:356,y:n,width:294,height:46,rx:8}),a=C(`text`,{class:`ed2-term__main`,x:370,y:n+17}),o=C(`text`,{class:`ed2-term__tag ${g(e.op)}`,x:636,y:n+17});o.textContent=e.tag;let s=C(`text`,{class:`ed2-term__note`,x:370,y:n+34});r.appendChild(i),r.appendChild(a),r.appendChild(o),r.appendChild(s),D.appendChild(r),e.g=r,e.main=a,e.noteT=s});let F=[];for(let e=0;e<=a;e+=1){let t=C(`g`,{class:`ed2-buf is-old`});t.appendChild(C(`rect`,{class:`ed2-buf__box`,x:S(e),y:m,width:d,height:48,rx:6}));let n=C(`text`,{class:`ed2-buf__val`,x:S(e)+d/2,y:m+48/2-6});t.appendChild(n);let r=C(`text`,{class:`ed2-buf__idx`,x:S(e)+d/2,y:m+48-11});r.textContent=`#${e}`,t.appendChild(r),O.appendChild(t),F.push({g:t,val:n})}let I=C(`text`,{class:`ed-note`,x:78,y:m-14});I.textContent=`buf —— 只留一行（长度 n+1 = ${a+1}）`,T.appendChild(I);let L=C(`text`,{class:`ed2-tag is-left`,x:0,y:h,opacity:0});L.textContent=`左方`;let R=C(`text`,{class:`ed2-tag is-up`,x:0,y:h,opacity:0});R.textContent=`上方`,T.appendChild(L),T.appendChild(R),T.appendChild(C(`rect`,{class:`ed2-term__box`,x:356,y:m,width:294,height:48,rx:8}));let z=C(`text`,{class:`ed2-term__main`,x:370,y:m+18}),B=C(`text`,{class:`ed2-term__note`,x:370,y:m+35});T.appendChild(z),T.appendChild(B);let V=C(`text`,{class:`ed-phase__text`,x:680/2,y:_});T.appendChild(V);function H(e,t){P.forEach((n,r)=>{n.g.setAttribute(`class`,r===0?`ed2-term ${g(n.op)} is-best is-pick`:`ed2-term is-hidden`),r===0&&(n.main.textContent=e,n.noteT.textContent=t)})}function U(t,r){if(!r)return;let{phase:i,i:a,j:o,m:s,n:l,dp:u,buf:f}=r,m=i===`done`,h=i===`cell`,_=b(i,a,o);if(N.forEach((e,t)=>{e.forEach((e,n)=>{let r=[`ed2-cell`],c=_(t,n),l=`blank`;c&&(l=i===`init`?`alive`:m?t===s?`alive`:`gone`:t<a?t<a-1?`gone`:n<o?`wiped`:`alive`:`new`),l!==`blank`&&r.push(`is-${l}`),h&&t===a-1&&n===o-1&&r.push(`is-diag`),(h||i===`col`)&&t===a&&n===o&&r.push(`is-cur`),e.g.setAttribute(`class`,r.join(` `)),e.val.textContent=c?String(u[t][n]):``})}),F.forEach((e,t)=>{let n=[`ed2-buf`];m||i===`init`?n.push(m?`is-new`:`is-old`):n.push(t<=o?`is-new`:`is-old`),h&&t===o&&n.push(`is-cur`),e.g.setAttribute(`class`,n.join(` `)),e.val.textContent=String(f[t])}),h?(L.setAttribute(`x`,S(o-1)+d/2),R.setAttribute(`x`,S(o)+d/2),L.setAttribute(`opacity`,`1`),R.setAttribute(`opacity`,`1`)):(L.setAttribute(`opacity`,`0`),R.setAttribute(`opacity`,`0`)),h){let e={replace:r.diag,delete:r.up,insert:r.left},t={replace:`dp[${a-1}][${o-1}]`,delete:`dp[${a-1}][${o}]`,insert:`dp[${a}][${o-1}]`},n={replace:r.match?`字符相同 —— 就是它`:`旧值已被覆盖，靠 prev 留了一份`,delete:r.match?`不用看（至少大 1）`:`写之前还躺在 buf[j] 里`,insert:r.match?`不用看（至少大 1）`:`本行刚写进 buf[j-1]`};for(let i of P){let a=r.match?i.op===`replace`:r.ties.includes(i.op),o=[`ed2-term`,g(i.op)];a&&o.push(`is-best`),a&&i.op===r.op&&o.push(`is-pick`),r.match&&i.op!==`replace`&&o.push(`is-off`),i.g.setAttribute(`class`,o.join(` `)),i.main.textContent=`${t[i.op]} = ${e[i.op]}`,i.noteT.textContent=n[i.op]}z.textContent=`prev = ${r.saved}`,B.textContent=`上一行的对角，数组里那一格已经被覆盖`}else i===`init`?(H(`buf 初值 = [${c.join(`, `)}]`,`第 0 行直接当 buf 的初值 —— 不用算`),z.textContent=`prev 还没意义`,B.textContent=`第一行开始时才从 buf[0] 取出来`):i===`col`?(H(`buf[0] 改成 ${a}`,`dp[${a-1}][0] = ${r.saved} 先被取出来存进 prev`),z.textContent=`prev = ${r.saved}`,B.textContent=`第一格的对角已经拿到手了`):(H(`buf[${l}] = ${r.answer}`,`整个表只用了 n+1 个格子`),z.textContent=`答案 = buf[${l}]`,B.textContent=`左上那一角被丢掉了，答案还是对的`);i===`init`?(A.textContent=`第 0 行`,j.textContent=`直接就是 buf 的初值`,M.textContent=`buf = [${c.join(`, `)}]`):i===`col`?(A.textContent=`i = ${a} · 第 0 列`,j.textContent=`buf[0] 更新，旧的先存进 prev`,M.textContent=`buf[0] = ${a}`):h?(A.textContent=`i = ${a} · j = ${o}`,j.textContent=r.match?`'${r.charA}' 相同 -> 用 prev`:`取${p[r.op]} -> ${r.value}`,M.textContent=`buf[${o}] = ${r.value}`):(A.textContent=`跑完了`,j.textContent=`buf 就是最后一行`,M.textContent=`答案 = ${r.answer}`),i===`init`?V.textContent=`滚动数组的初值就是第 0 行 —— 空间从 m·n 个格子直接砍到 n+1 个。`:i===`col`?V.textContent=`每行开头都有一个坑：buf[0] 要先备份给 prev，改完就再也取不到旧值了。`:h?V.textContent=r.match?`对角 dp[${a-1}][${o-1}] 已经不在数组里了 —— prev = ${r.saved} 就是它。`:`上方在本行 buf[${o}] 里、左方是刚写的 buf[${o-1}] —— 只有对角必须靠 prev。`:V.textContent=`结论：只要推进顺序是「一行一行从左往右」，n+1 个格子就够 —— 答案还是 buf[n]。`,e(n,r.desc)}return{svgRoot:w,paint:U}}function E(e,a,o){if(!e||e.dataset.edMounted===`1`)return{destroy(){}};e.dataset.edMounted=`1`,v();let s=u(a),c=s[0],l=document.createElement(`div`);l.className=`viz ed`;let p=document.createElement(`div`);p.className=`viz__stage`,l.appendChild(p);let m=y();if(c.m===0&&c.n===0){let t=r,a=t(`svg`,{class:`viz__svg ed__svg`,viewBox:`0 0 620 120`,role:`img`}),o=t(`text`,{x:310,y:60,style:`fill: var(--ed-muted, #657168); font-size: 14px; text-anchor: middle;`});return o.textContent=`两个都是空串 —— 一个操作都不用做，答案是 0`,a.appendChild(o),p.appendChild(a),l.appendChild(m),l.appendChild(i().root),e.textContent=``,e.appendChild(l),n(),{destroy(){e.textContent=``,delete e.dataset.edMounted,document.getElementById(d)?.remove()}}}let h=o===`grid`?w(s,m):T(s,m);p.appendChild(h.svgRoot),l.appendChild(m);let g=i();l.appendChild(g.root),e.textContent=``,e.appendChild(l),n();let _=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,b=t({steps:s,controls:g,intervalMs:f,onRender:(e,t)=>h.paint(e,t)});b.jumpTo(Math.trunc(a.initialStep)||0);let x=null;return a.autoplay!==!1&&!_&&typeof IntersectionObserver==`function`&&(x=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){x.disconnect(),x=null,b.play();return}},{threshold:.35}),x.observe(l)),{destroy(){x&&=(x.disconnect(),null),b.destroy(),e.textContent=``,delete e.dataset.edMounted,document.getElementById(d)?.remove()}}}function D(e,t={}){return E(e,t,`grid`)}function O(e,t={}){return E(e,t,`roll`)}export{D as mountEditDistGrid,O as mountEditDistRoll};