import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=`55128921`;function o(e,t){return e.charCodeAt(0)-48+(t.charCodeAt(0)-48)}function s(e={}){let t=typeof e.s==`string`?e.s:a,n=Array.from(t),r=n.length,i=[],s=(e,a,o={})=>{i.push({phase:e,desc:a,s:t,chars:n,n:r,i:null,ch:null,topIdx:null,topCh:null,stack:[],eliminated:null,gone:[],pops:0,result:null,done:e===`done`,...o})};s(`init`,`给了数字串 \`${t}\`（\`${r}\` 个字符）。规则：**相邻两数之和为 10 就可以消除**，消除后两边接在一起继续检查。\`1~9\` 里每个数字只有**一个**补数（\`d\` 配 \`10-d\`，\`5\` 配自己），所以新数字只需要看栈顶：互补就一起消失，否则入栈。栈里存的就是**当前串约化后的形态** —— 题面那句"两边接在一起"，本质就是"弹掉栈顶"，不用真的去拼接字符串。下面从 \`s[0]\` 开始逐位扫描。`);let c=[],l=[],u=0;for(let e=0;e<r;e+=1){let t=n[e],r=c.length>0?c[c.length-1]:null,i=r===null?null:n[r];if(r!==null&&o(i,t)===10){c.pop(),l.push(r,e),u+=1;let a=c.length>0?n[c[c.length-1]]:null;s(`pop`,`\`s[${e}] = "${t}"\`：栈顶是 \`"${i}"\`（下标 ${r}）—— \`${i} + ${t} = 10\`，**两个一起消失**。`+(a===null?`弹出后栈空了 —— 左边已经没有任何没消掉的数字。`:`弹出后新的栈顶是 \`"${a}"\` —— 这就是"两边接在一起"：下标 ${r} 被消掉后，它左边的数字直接跟后面的字符相邻了，**栈自动完成这件事**。`),{i:e,ch:t,topIdx:r,topCh:i,stack:c.slice(),eliminated:[r,e],gone:l.slice(),pops:u});continue}c.push(e);let a=i===null?null:o(i,t);s(`push`,i===null?`\`s[${e}] = "${t}"\`：栈空 —— 左边没有还没消掉的数字跟它配，**入栈**。`:`\`s[${e}] = "${t}"\`：栈顶 \`"${i}"\`（下标 ${r}）—— \`${i} + ${t} = ${a}\`（≠ 10），消不掉，\`"${t}"\` **入栈**，成为新的栈顶。`,{i:e,ch:t,topIdx:r,topCh:i,stack:c.slice(),gone:l.slice(),pops:u})}let d=c.map(e=>n[e]).join(``);return s(`done`,`\`${r}\` 个字符扫完，栈里剩下 \`${d}\`（长度 \`${r} - 2 × ${u} = ${d.length}\`）：一共消掉 \`${u}\` 对。剩下的串里**没有任何相邻互补对**，已经消无可消（不可约形）。而且这个结果是**唯一**的 —— 不管按什么顺序消，都会停在这里（临界对 \`a b a\` 两种消法都剩 \`a\`，加上每步必减 2 的终止性）。所以"最短剩余长度"就是 \`${d.length}\`，不用搜索。`,{i:r>0?r-1:null,ch:r>0?n[r-1]:null,stack:c.slice(),gone:l.slice(),pops:u,result:d,done:!0}),i}var c=`elimsum10-styles`,l=30,u=52,d=46,f=112,p=38,m=8,h=336,g=88,_=6,v=150,y=290,b=170,x=344,S=150,C=362,ee=388,w=1250,T=`
.elv {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.elv__svg { width: 100%; height: auto; display: block; }

.elv-note {
  fill: var(--elv-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.elv-banner__box {
  fill: var(--elv-banner, #f4f3ef);
  stroke: var(--elv-line, #c3c9c2);
  stroke-width: 1.5;
}
.elv-banner__op {
  fill: var(--elv-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.elv-banner__ret {
  fill: var(--elv-gold, #c2872f);
  font-size: 15px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 输入串的格子 */
.elv-chip__box {
  fill: var(--elv-fill, #ffffff);
  stroke: var(--elv-line, #c3c9c2);
  stroke-width: 1.5;
}
.elv-chip__val {
  fill: var(--elv-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.elv-chip__idx {
  fill: var(--elv-dim, #9aa39c);
  font-size: 9.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 当前扫到的字符：金框 */
.elv-chip.is-cur .elv-chip__box {
  fill: var(--elv-gold-fill, #fdf3e3);
  stroke: var(--elv-gold, #c2872f);
  stroke-width: 3;
}
.elv-chip.is-cur .elv-chip__val { fill: var(--elv-gold, #c2872f); }
/* 栈顶（左边最后一个还在的数字）：绿框 */
.elv-chip.is-top .elv-chip__box {
  stroke: var(--elv-ok, #3f6b57);
  stroke-width: 3;
}
.elv-chip.is-top .elv-chip__val { fill: var(--elv-ok, #3f6b57); }
/* 已被消掉：灰虚线 */
.elv-chip.is-gone .elv-chip__box {
  fill: none;
  stroke: var(--elv-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.5;
}
.elv-chip.is-gone .elv-chip__val { fill: var(--elv-dim, #9aa39c); }
/* 本帧被消掉：红虚线 */
.elv-chip.is-elim .elv-chip__box {
  fill: none;
  stroke: var(--elv-hot, #a45f45);
  stroke-dasharray: 4 3;
  stroke-width: 3;
}
.elv-chip.is-elim .elv-chip__val { fill: var(--elv-hot, #a45f45); }
.elv-chip.is-dim { opacity: 0.55; }

/* 栈格 */
.elv-cell__box {
  fill: var(--elv-fill, #ffffff);
  stroke: var(--elv-line, #c3c9c2);
  stroke-width: 1.5;
}
.elv-cell__val {
  fill: var(--elv-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.elv-cell__sub {
  fill: var(--elv-dim, #9aa39c);
  font-size: 10px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.elv-cell.is-top .elv-cell__box {
  stroke: var(--elv-ok, #3f6b57);
  stroke-width: 3;
}
.elv-cell.is-top .elv-cell__val { fill: var(--elv-ok, #3f6b57); }
.elv-cell.is-fresh .elv-cell__box {
  fill: var(--elv-gold-fill, #fdf3e3);
  stroke: var(--elv-gold, #c2872f);
  stroke-width: 3;
}
.elv-cell.is-fresh .elv-cell__val { fill: var(--elv-gold, #c2872f); }
.elv-cell.is-ghost .elv-cell__box {
  fill: none;
  stroke: var(--elv-hot, #a45f45);
  stroke-dasharray: 4 3;
  stroke-width: 2.5;
}
.elv-cell.is-ghost .elv-cell__val { fill: var(--elv-hot, #a45f45); }
.elv-cell.is-ghost .elv-cell__sub { fill: var(--elv-hot, #a45f45); }
.elv-cell.is-empty .elv-cell__box {
  fill: none;
  stroke: var(--elv-line, #c3c9c2);
  stroke-dasharray: 2 4;
  stroke-width: 1;
}

.elv-panel__box {
  fill: var(--elv-banner, #f4f3ef);
  stroke: var(--elv-line, #c3c9c2);
  stroke-width: 1.5;
}
.elv-panel__label {
  fill: var(--elv-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.elv-panel__value {
  fill: var(--elv-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.elv-panel__value.is-ok { fill: var(--elv-ok, #3f6b57); }
.elv-panel__value.is-hot { fill: var(--elv-hot, #a45f45); }

.elv-label {
  fill: var(--elv-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.elv-floor {
  stroke: var(--elv-line, #c3c9c2);
  stroke-width: 2;
}
.elv-phase__text {
  fill: var(--elv-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function E(){if(document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=T,document.head.appendChild(e)}function D(a,o={}){if(!a||a.dataset.elimsum10Mounted===`1`)return{destroy(){}};a.dataset.elimsum10Mounted=`1`,E();let T=s(o),D=o.autoplay!==!1,O=T[0],k=O.chars,A=O.n,j=r,M=document.createElement(`div`);M.className=`viz elv`;let N=document.createElement(`div`);N.className=`viz__stage`,M.appendChild(N);let P=Math.max(1,...T.map(e=>e.stack.length))+1,F=Math.min(46,Math.floor((h-b-(P-1)*_)/P)),I=j(`svg`,{class:`viz__svg elv__svg`,viewBox:`0 0 660 412`,role:`img`,"aria-label":`相邻和为 10 消除 栈模拟动画`});N.appendChild(I);let L=j(`g`,{class:`elv-strip`}),R=j(`g`,{class:`elv-cells`}),z=j(`g`,{class:`elv-marks`});I.appendChild(R),I.appendChild(L),I.appendChild(z);let B=j(`text`,{class:`elv-note`,x:26,y:l});B.textContent=`补数配对：1↔9  2↔8  3↔7  4↔6  5↔5 —— 栈顶和新数字互补就一起消失`,z.appendChild(B),z.appendChild(j(`rect`,{class:`elv-banner__box`,x:26,y:u,width:608,height:d,rx:9}));let V=j(`text`,{class:`elv-banner__op`,x:44,y:75}),H=j(`text`,{class:`elv-banner__ret`,x:616,y:75});z.appendChild(V),z.appendChild(H);let te=A*p+Math.max(0,A-1)*m,U=Math.max(26,(660-te)/2),W=k.map((e,t)=>{let n=U+t*46,r=j(`g`,{class:`elv-chip`});r.appendChild(j(`rect`,{class:`elv-chip__box`,x:n,y:f,width:p,height:p,rx:6}));let i=j(`text`,{class:`elv-chip__val`,x:n+p/2,y:127}),a=j(`text`,{class:`elv-chip__idx`,x:n+p/2,y:142});return a.textContent=String(t),r.appendChild(i),r.appendChild(a),L.appendChild(r),{g:r,val:i}}),G=[];for(let e=0;e<P;e+=1){let t=j(`g`,{class:`elv-cell`}),n=h-(e+1)*F-e*_;t.appendChild(j(`rect`,{class:`elv-cell__box`,x:v-g/2,y:n,width:g,height:F,rx:6}));let r=j(`text`,{class:`elv-cell__val`,x:v,y:n+F/2-5}),i=j(`text`,{class:`elv-cell__sub`,x:v,y:n+F-9});t.appendChild(r),t.appendChild(i),R.appendChild(t),G.push({g:t,val:r,sub:i})}z.appendChild(j(`line`,{class:`elv-floor`,x1:v-g/2-10,y1:h,x2:204,y2:h}));let K=j(`text`,{class:`elv-label`,x:v,y:C});K.textContent=`栈（底 → 顶）`,z.appendChild(K),z.appendChild(j(`rect`,{class:`elv-panel__box`,x:y,y:b,width:x,height:S,rx:10}));let q=[{label:`本帧判定`,y:210,key:`verdict`},{label:`已消对数`,y:246,key:`pops`},{label:`剩余长度`,y:282,key:`len`}].map(e=>{let t=j(`text`,{class:`elv-panel__label`,x:308,y:e.y});t.textContent=e.label;let n=j(`text`,{class:`elv-panel__value`,x:616,y:e.y});return z.appendChild(t),z.appendChild(n),{...e,value:n}}),J=j(`text`,{class:`elv-phase__text`,x:660/2,y:ee});z.appendChild(J);let Y=document.createElement(`p`);Y.className=`viz__desc`,Y.setAttribute(`aria-live`,`polite`);function X(t,n){if(!n)return;let r=new Set(n.gone),i=new Set(n.eliminated||[]),a=n.stack.length>0?n.stack[n.stack.length-1]:null,o=n.phase===`done`;W.forEach((e,t)=>{let s=[`elv-chip`];o&&s.push(`is-dim`),r.has(t)&&s.push(`is-gone`),a===t&&!o&&s.push(`is-top`),n.i===t&&!o&&s.push(`is-cur`),i.has(t)&&s.push(`is-elim`),e.g.setAttribute(`class`,s.join(` `)),e.val.textContent=k[t]});let s=n.stack;if(G.forEach((e,t)=>{let r=[`elv-cell`];t<s.length?(e.val.textContent=k[s[t]],e.sub.textContent=t===0?`#${s[t]} 底`:`#${s[t]}`,t===s.length-1&&!o&&r.push(`is-top`),n.phase===`push`&&t===s.length-1&&r.push(`is-fresh`)):n.phase===`pop`&&t===s.length?(e.val.textContent=n.topCh,e.sub.textContent=`弹出`,r.push(`is-ghost`)):(e.val.textContent=``,e.sub.textContent=``,r.push(`is-empty`)),e.g.setAttribute(`class`,r.join(` `))}),n.phase===`init`)V.textContent=`相邻和为 10 就消除：栈顶互补就弹出`,H.textContent=`${A} 个字符`;else if(o)V.textContent=`${A} 个字符扫完`,H.textContent=`结果 "${n.result}"`;else{V.textContent=`s[${n.i}] = "${n.ch}"`;let e=n.topCh===null?null:Number(n.topCh)+Number(n.ch);n.phase===`pop`?H.textContent=`${n.topCh} + ${n.ch} = 10 → 消`:H.textContent=n.topCh===null?`栈空 → 入栈`:`${n.topCh} + ${n.ch} = ${e} ≠ 10 → 入栈`}let c=n.topCh===null?null:Number(n.topCh)+Number(n.ch);q[0].value.textContent=o?`"${n.result}"`:n.phase===`pop`?`${n.topCh} + ${n.ch} = 10`:n.topCh===null?`栈空`:`${n.topCh} + ${n.ch} = ${c}`,q[0].value.setAttribute(`class`,`elv-panel__value ${n.phase===`pop`?`is-hot`:o?`is-ok`:``}`),q[1].value.textContent=String(n.pops),q[2].value.textContent=String(s.length),n.phase===`init`?J.textContent=`每个数字只有一个补数 —— 这是"结果唯一"的根源`:n.phase===`pop`?J.textContent=`两个一起消失；弹出后新栈顶就是"左边接过来的数字"`:n.phase===`push`?J.textContent=`消不掉 → 入栈，成为新的栈顶（一个数字最多消一个栈顶）`:J.textContent=`结果不可约、且与消除顺序无关 —— 所以"最短长度"就是 ${n.result.length}`,e(Y,n.desc)}M.appendChild(Y);let Z=i();M.appendChild(Z.root),a.textContent=``,a.appendChild(M),n();let ne=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:T,controls:Z,intervalMs:w,onRender:X});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return D&&!ne&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(M)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.elimsum10Mounted,document.getElementById(c)?.remove()}}}export{D as mountEliminateSum10};