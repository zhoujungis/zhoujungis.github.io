import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=`{[()]}`,o={"(":`)`,"[":`]`,"{":`}`},s=new Set(Object.keys(o));function c(e={}){let t=typeof e.s==`string`?e.s:a,n=Array.from(t),r=n.length,i=[],c=(e,a,o={})=>{i.push({phase:e,desc:a,s:t,chars:n,n:r,i:null,ch:null,stack:[],expect:null,popped:null,verdict:null,done:e===`done`,...o})};c(`init`,`给了括号串 \`${t}\`（\`${r}\` 个字符）。判断左括号是否被**正确类型**的右括号闭合、且嵌套不乱。括号的结构决定了**最近打开的必须先关闭** —— 后开先闭就是 LIFO，所以栈不是"想到用栈"，而是"括号天然就是栈"。做法：遇左括号入栈（记下我在等什么），遇右括号就问栈顶"你是不是我等的那个"。失败有三种：类型不匹配（\`"(]"\`）、右括号没人接（\`"())"\`，栈已空）、左括号没闭合（\`"(()"\`，栈有剩）。`);let l=[];for(let e=0;e<r;e+=1){let t=n[e];if(s.has(t)){l.push(t),c(`push`,`\`s[${e}] = "${t}"\` 是左括号 —— **入栈**，记下"我在等 \`"${o[t]}"\`"。栈顶现在是 \`${t}\`，它是**最内层尚未闭合**的那个 —— 下一个右括号必须先跟它配。`,{i:e,ch:t,stack:l.slice(),expect:null});continue}if(l.length===0)return c(`unmatched`,`\`s[${e}] = "${t}"\` 是右括号，但**栈是空的** —— 前面没有左括号在等它。（失败模式二：右括号没人接，如 \`"())"\` 的最后一个 \`)\`。）即刻判无效，不用再看后面的字符。`,{i:e,ch:t,stack:l.slice(),expect:null,verdict:`unmatched`}),c(`done`,`**无效**：\`s[${e}] = "${t}"\` 找不到匹配的左括号。三种失败模式里的第二种 —— 右括号来时栈已空。`,{i:e,ch:t,stack:l.slice(),verdict:`unmatched`,done:!0}),i;let r=l[l.length-1],a=o[r];if(a===t)l.pop(),c(`match`,`\`s[${e}] = "${t}"\` 是右括号 —— 栈顶 \`"${r}"\` 等的就是 \`"${a}"\`，**配对成功，出栈**。`+(l.length>0?`新的栈顶是 \`"${l[l.length-1]}"\` —— 它成为"最内层尚未闭合"的那个。`:`栈空了 —— 目前为止全部闭合。`),{i:e,ch:t,stack:l.slice(),expect:a,popped:r});else return c(`mismatch`,`\`s[${e}] = "${t}"\` 是右括号，它要的是 \`"${t}"\`，但栈顶 \`"${r}"\` 等的是 \`"${a}"\` —— **类型不匹配**（失败模式一，如 \`"([)]"\` 里 \`)\` 撞上 \`[\`）。即刻判无效。`,{i:e,ch:t,stack:l.slice(),expect:a,popped:null,verdict:`mismatch`}),c(`done`,`**无效**：\`s[${e}] = "${t}"\` 与栈顶 \`"${r}"\` 类型不匹配（栈顶在等 \`"${a}"\`）。`,{i:e,ch:t,stack:l.slice(),expect:a,verdict:`mismatch`,done:!0}),i}return l.length>0?(c(`done`,`\`${r}\` 个字符扫完了，但**栈里还留着** \`${l.map(e=>`"${e}"`).join(`、`)}\` —— 失败模式三：左括号没闭合（如 \`"(()"\` 剩下的那个 \`(\`）。栈非空即无效 —— 这是最容易漏的一处检查。`,{i:r-1,stack:l.slice(),verdict:`leftover`,done:!0}),i):(c(`done`,`\`${r}\` 个字符扫完，**栈也恰好空了** —— 每个左括号都被正确类型的右括号按后进先出的顺序闭合。**有效**。`,{i:r-1,stack:l.slice(),verdict:`valid`,done:!0}),i)}var l=`brk-styles`,u=54,ee=84,d=46,te=158,f=170,p=46,m=256,h=316,g=256,_=342,v=26,y=604,ne=1150,b=`
.brk {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.brk__svg { width: 100%; height: auto; display: block; }

.brk-note {
  fill: var(--brk-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.brk-banner__box {
  fill: var(--brk-banner, #f4f3ef);
  stroke: var(--brk-line, #c3c9c2);
  stroke-width: 1.5;
}
.brk-banner__seg {
  fill: var(--brk-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.brk-banner__ans {
  fill: var(--brk-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.brk-banner__ans.is-bad { fill: var(--brk-bad, #b3452e); }

.brk-cell__box {
  fill: var(--brk-fill, #ffffff);
  stroke: var(--brk-line, #c3c9c2);
  stroke-width: 1.5;
}
.brk-cell__val {
  fill: var(--brk-ink, #1f2a24);
  font-size: 18px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.brk-cell__idx {
  fill: var(--brk-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 通道一（底色）：栈内 */
.brk-cell.is-instack .brk-cell__box { fill: var(--brk-gold-fill, #fdf3e3); }
/* 通道二（边框）：当前字符 / 成功 / 失败 */
.brk-cell.is-cur .brk-cell__box {
  stroke: var(--brk-hot, #a45f45);
  stroke-width: 3;
}
.brk-cell.is-cur .brk-cell__val { fill: var(--brk-hot, #a45f45); }
.brk-cell.is-ok .brk-cell__box {
  fill: var(--brk-ok-fill, #eef5f1);
  stroke: var(--brk-ok, #3f6b57);
  stroke-width: 2.5;
}
.brk-cell.is-ok .brk-cell__val { fill: var(--brk-ok, #3f6b57); }
.brk-cell.is-bad .brk-cell__box {
  fill: var(--brk-bad-fill, #fbe9e5);
  stroke: var(--brk-bad, #b3452e);
  stroke-width: 2.5;
}
.brk-cell.is-bad .brk-cell__val { fill: var(--brk-bad, #b3452e); }
.brk-cell.is-dim .brk-cell__box {
  stroke: var(--brk-dim, #9aa39c);
  stroke-dasharray: 4 4;
  stroke-width: 1.2;
}
.brk-cell.is-dim .brk-cell__val { fill: var(--brk-dim, #9aa39c); }

.brk-label {
  fill: var(--brk-muted, #657168);
  font-size: 12px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.brk-topmark {
  fill: var(--brk-hot, #a45f45);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.brk-popmark {
  fill: var(--brk-ok, #3f6b57);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.brk-phase__text {
  fill: var(--brk-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function re(){if(document.getElementById(l))return;let e=document.createElement(`style`);e.id=l,e.textContent=b,document.head.appendChild(e)}function x(a,o={}){if(!a||a.dataset.brkMounted===`1`)return{destroy(){}};a.dataset.brkMounted=`1`,re();let s=c(o),b=o.autoplay!==!1,x=s[0],ie=x.chars,S=x.n,C=r,w=document.createElement(`div`);w.className=`viz brk`;let T=document.createElement(`div`);T.className=`viz__stage`,w.appendChild(T);function E(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let D=48;S*D+(S-1)*8>y&&(D=Math.max(24,Math.floor((y-(S-1)*8)/S)));let O=S*D+(S-1)*8,k=(S+1)*D+S*8,A=Math.max(660,v*2+Math.max(O,k)),j=(A-O)/2,M=(A-k)/2+D/2,N=e=>j+e*(D+8)+D/2,P=e=>M+e*(D+8),F=A-v*2,I=C(`svg`,{class:`viz__svg brk__svg`,viewBox:`0 0 ${A} 366`,role:`img`,"aria-label":`有效的括号 栈推演动画`});T.appendChild(I);let L=C(`g`,{class:`brk-cells`}),R=C(`g`,{class:`brk-marks`});I.appendChild(L),I.appendChild(R);let z=C(`text`,{class:`brk-note`,x:v,y:u});z.textContent=`括号天然是栈：最近打开的必须先关闭 —— 左括号入栈，右括号问栈顶`,R.appendChild(z),R.appendChild(C(`rect`,{class:`brk-banner__box`,x:v,y:ee,width:F,height:d,rx:9}));let B=C(`text`,{class:`brk-banner__seg`,x:44,y:107}),V=C(`text`,{class:`brk-banner__seg`,x:156,y:107}),H=C(`text`,{class:`brk-banner__ans`,x:A-v-18,y:107});R.appendChild(B),R.appendChild(V),R.appendChild(H);let U=[];for(let e=0;e<S;e+=1){let t=C(`g`,{class:`brk-cell`}),n=C(`rect`,{class:`brk-cell__box`,x:N(e)-D/2,y:f,width:D,height:p,rx:6});t.appendChild(n);let r=C(`text`,{class:`brk-cell__val`,x:N(e),y:193});r.textContent=ie[e],t.appendChild(r);let i=C(`text`,{class:`brk-cell__idx`,x:N(e),y:te});i.textContent=String(e),R.appendChild(i),L.appendChild(t),U.push({g:t,box:n,val:r})}let W=C(`text`,{class:`brk-label`,x:M-14,y:279});W.textContent=`stack`,R.appendChild(W);let G=[];for(let e=0;e<S;e+=1){let t=C(`g`,{class:`brk-cell`}),n=C(`rect`,{class:`brk-cell__box`,x:P(e)-D/2,y:m,width:D,height:p,rx:6});t.appendChild(n);let r=C(`text`,{class:`brk-cell__val`,x:P(e),y:279});t.appendChild(r),L.appendChild(t),G.push({g:t,box:n,val:r})}let K=(()=>{let e=C(`g`,{class:`brk-cell`}),t=C(`rect`,{class:`brk-cell__box`,x:P(S)-D/2,y:g,width:D,height:p,rx:6});e.appendChild(t);let n=C(`text`,{class:`brk-cell__val`,x:P(S),y:279});return e.appendChild(n),L.appendChild(e),{g:e,box:t,val:n}})(),q=C(`text`,{class:`brk-popmark`,x:P(S),y:g-12});q.textContent=`popped`,R.appendChild(q);let J=C(`text`,{class:`brk-topmark`,x:0,y:h});J.textContent=`top`,R.appendChild(J);let Y=C(`text`,{class:`brk-phase__text`,x:A/2,y:_});R.appendChild(Y);let X=E();function ae(t,n){if(!n)return;let r=n.phase===`done`,i=n.verdict;if(U.forEach((e,t)=>{let a=[`brk-cell`];n.i!==null&&t===n.i&&n.phase!==`done`?n.phase===`match`?a.push(`is-ok`):n.phase===`mismatch`||n.phase===`unmatched`?a.push(`is-bad`):a.push(`is-cur`):r&&i===`valid`?a.push(`is-ok`):n.i!==null&&t>n.i&&a.push(`is-dim`),e.g.setAttribute(`class`,a.join(` `))}),G.forEach((e,t)=>{let a=[`brk-cell`];t<n.stack.length?(a.push(`is-instack`),e.val.textContent=n.stack[t],t===n.stack.length-1&&(n.phase===`mismatch`||r&&i===`leftover`?a.push(`is-bad`):r&&i===`valid`&&a.push(`is-ok`))):(a.push(`is-dim`),e.val.textContent=``),e.g.setAttribute(`class`,a.join(` `))}),n.phase===`match`&&n.popped!==null){let e=P(n.stack.length);K.box.setAttribute(`x`,e-D/2),K.val.setAttribute(`x`,e),q.setAttribute(`x`,e),K.val.textContent=n.popped,K.g.setAttribute(`class`,`brk-cell is-ok`),q.style.opacity=`1`}else K.val.textContent=``,K.g.setAttribute(`class`,`brk-cell is-dim`),q.style.opacity=`0`;n.stack.length>0?(J.setAttribute(`x`,P(n.stack.length-1)),J.style.opacity=`1`):J.style.opacity=`0`,n.phase===`push`?(B.textContent=`s[${n.i}] = "${n.ch}"`,V.textContent=`左括号 → push（记下我在等什么）`):n.phase===`match`?(B.textContent=`s[${n.i}] = "${n.ch}"`,V.textContent=`栈顶 "${n.popped}" 配对成功 → pop`):n.phase===`mismatch`?(B.textContent=`s[${n.i}] = "${n.ch}"`,V.textContent=`栈顶 "${n.stack[n.stack.length-1]}" 在等 "${n.expect}" —— 不匹配`):n.phase===`unmatched`?(B.textContent=`s[${n.i}] = "${n.ch}"`,V.textContent=`栈是空的，没人接这个右括号`):n.phase===`init`?(B.textContent=`栈解法`,V.textContent=`左括号入栈 · 右括号问栈顶`):(B.textContent=`${n.n} 个字符扫完`,V.textContent=i===`valid`?`栈恰好为空`:i===`leftover`?`栈里还留着左括号`:`提前判无效`),r?(H.textContent=i===`valid`?`true（有效）`:i===`leftover`?`false（左括号未闭合）`:i===`mismatch`?`false（类型不匹配）`:`false（右括号无人接）`,H.setAttribute(`class`,`brk-banner__ans`+(i===`valid`?``:` is-bad`))):(H.textContent=`stack: ${n.stack.length} 层`,H.setAttribute(`class`,`brk-banner__ans`)),r?Y.textContent=n.stack.length>0?`剩余未闭合：${n.stack.map(e=>`"${e}"`).join(` `)} —— 栈非空即无效`:`三种失败模式都没触发 + 栈为空 = 有效`:n.phase===`match`?Y.textContent=`配对 "${n.popped}" + "${n.ch}" 出栈 · 栈深 ${n.stack.length}`:n.phase===`push`?Y.textContent=`入栈 "${n.ch}" · 栈顶 = 最内层尚未闭合的那个`:Y.textContent=`后开先闭 = LIFO —— 括号的结构本身就是栈`,e(X,n.desc)}w.appendChild(X);let Z=i();w.appendChild(Z.root),a.textContent=``,a.appendChild(w),n();let oe=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:s,controls:Z,intervalMs:ne,onRender:ae});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return b&&!oe&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(w)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.brkMounted,document.getElementById(l)?.remove()}}}export{x as mountBrackets};