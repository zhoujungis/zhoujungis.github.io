import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=`2*(5+5*2)/3+(6/2+8)`,o={"+":1,"-":1,"*":2,"/":2};function s(e){let t=[],n=0;for(;n<e.length;){let r=e[n];if(r===` `){n+=1;continue}if(r>=`0`&&r<=`9`){let r=n;for(;r<e.length&&e[r]>=`0`&&e[r]<=`9`;)r+=1;t.push(e.slice(n,r)),n=r;continue}t.push(r),n+=1}return t}function c(e,t){let n=t.pop(),r=e.pop(),i=e.pop(),a;return a=n===`+`?i+r:n===`-`?i-r:n===`*`?i*r:Math.trunc(i/r),e.push(a),{a:i,op:n,b:r,res:a}}function l(e={}){let t=typeof e.expr==`string`&&e.expr.trim()!==``?e.expr:a,n=s(t),r=[],i=[],l=[],u=(e,a,o={})=>{r.push({phase:e,desc:a,expr:t,tokens:n,pos:null,token:null,nums:i.slice(),ops:l.slice(),value:null,pushedOp:null,applies:[],parenPopped:!1,result:null,done:e===`done`,...o})},d=e=>`${e.a} ${e.op} ${e.b} = ${e.res}`;u(`init`,`表达式 \`${t}\` 在 224 之上加了 \`*\` \`/\` —— **优先级不再统一**，\`2+3*4\` 的 \`+\` 不能急着算，得**等右边乘法结账**。来一个结一个失效，就需要 Dijkstra 的**双栈调度场**：\`nums\` 存操作数、\`ops\` 存运算符（\`(\` 也进 ops 当挡板）。唯一纪律：新运算符来临，把栈顶所有**优先级 >= 它**的都弹出结算（\`>=\` 顺带保证同级左结合），再压自己。于是 \`ops\` 里**每层括号内部**从底到顶优先级严格递增 —— 这条不变量就是算法骨架。除法一律 \`Math.trunc\` **向零截断**。`,{nums:[],ops:[]});for(let e=0;e<n.length;e+=1){let t=n[e];if(t>=`0`&&t<=`9`){let n=Number(t);i.push(n),u(`number`,`**\`${t}\`**：数字直接进 \`nums\`（栈顶 \`${i[i.length-1]}\`）。数字永远不主动结算 —— **什么时候算，是运算符的事**。`,{pos:e,token:t,value:n});continue}if(t===`(`){l.push(`(`),u(`open`,"**`(`**：压进 `ops` 当**挡板** —— 它不比优先级、不参与结算，作用只有一个：让后面进来的运算符在它面前停下，把括号内圈成独立小天地。",{pos:e,token:t});continue}if(t===`)`){let n=[];for(;l.length>0&&l[l.length-1]!==`(`;)n.push(c(i,l));l.pop(),u(`close`,`**\`)\`**：一路结算到挡板为止：${n.map(d).join(`，`)}。再把 \`(\` 弹掉 —— 括号内已塌缩成 \`nums\` 顶上的**一个数**，回到外层，继续受外层运算符的优先级纪律管。`,{pos:e,token:t,applies:n,parenPopped:!0});continue}let r=[];for(;l.length>0&&l[l.length-1]!==`(`&&o[l[l.length-1]]>=o[t];)r.push(c(i,l));l.push(t),u(`operator`,`**\`${t}\`**：先看栈顶 —— `+(r.length>0?`优先级 \`>= ${t}\` 的先结账：${r.map(d).join(`，`)}；`:"没有可结算的（栈空、或遇 `(` 挡板、或栈顶优先级更低）；")+`然后 \`'${t}'\` 压入 \`ops\`。`+(r.length>0?`高优先级的先走，\`${t}\` 排队 —— 这就是"优先级"在栈里的样子。`:`\`${t}\` 在等它的右操作数（或更晚的更高优先级）。`),{pos:e,token:t,applies:r,pushedOp:t})}let f=[];for(;l.length>0;)f.push(c(i,l));u(`flush`,`**扫完收尾**：\`ops\` 里剩的运算符从栈顶到底依次结算：${f.map(d).join(`，`)}。栈形不变量（从底到顶优先级严格递增）保证"从顶到底结算"这个顺序**恰好就是正确的运算顺序** —— 低优先级的本来就沉在栈底，轮到最后。`,{applies:f});let p=i.length===1?i[0]:null;return u(`done`,`\`${t}\` = **\`${p}\`**。双栈各司其职：\`nums\` 只进不出地攒操作数、被结算时才吐结果；\`ops\` 靠**优先级比较**决定谁先结账。三个记忆锚点：① 结算判据 \`栈顶优先级 >= 新运算符\`（\`>=\` = 左结合）；② \`(\` 是挡板、\`)\` 结算到挡板；③ 除法 \`Math.trunc\` 向零截断，\`floor\` 在负数上是坑。`,{result:p,done:!0}),r}var u=`calciii-styles`,d=40,f=58,p=28,m=29,h=2,g=97,ee=116,_=38,v=352,y=38,b=128,x=376,S=398,C=1150,w=`
.c3v { display: flex; flex-direction: column; gap: 14px; }
.c3v__svg { width: 100%; height: auto; display: block; }

.c3v-note {
  fill: var(--c3v-muted, #657168); font-size: 12.5px; text-anchor: start;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.c3v-tok__box {
  fill: var(--c3v-fill, #ffffff); stroke: var(--c3v-line, #c3c9c2); stroke-width: 1.5;
}
.c3v-tok__val {
  fill: var(--c3v-ink, #1f2a24); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.c3v-tok.is-past .c3v-tok__box { fill: var(--c3v-past, #eef0ec); stroke: var(--c3v-past-line, #d8ddd6); }
.c3v-tok.is-past .c3v-tok__val { fill: var(--c3v-dim, #9aa39c); }
.c3v-tok.is-now .c3v-tok__box {
  fill: var(--c3v-gold-fill, #fdf3e3); stroke: var(--c3v-gold, #c2872f); stroke-width: 3;
}
.c3v-tok.is-now .c3v-tok__val { fill: var(--c3v-gold, #c2872f); }
.c3v-pointer { fill: var(--c3v-gold, #c2872f); }

.c3v-ban__box {
  fill: var(--c3v-banner, #f4f3ef); stroke: var(--c3v-line, #c3c9c2); stroke-width: 1.5;
}
.c3v-ban__text {
  fill: var(--c3v-hot, #a45f45); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.c3v-cell__box {
  fill: var(--c3v-fill, #ffffff); stroke: var(--c3v-line, #c3c9c2); stroke-width: 1.5;
}
.c3v-cell__val {
  fill: var(--c3v-ink, #1f2a24); font-size: 15px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.c3v-cell__sub {
  fill: var(--c3v-dim, #9aa39c); font-size: 9.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.c3v-cell.is-top .c3v-cell__box { stroke: var(--c3v-ok, #3f6b57); stroke-width: 3; }
.c3v-cell.is-top .c3v-cell__val { fill: var(--c3v-ok, #3f6b57); }
.c3v-cell.is-fresh .c3v-cell__box {
  fill: var(--c3v-gold-fill, #fdf3e3); stroke: var(--c3v-gold, #c2872f); stroke-width: 3;
}
.c3v-cell.is-fresh .c3v-cell__val { fill: var(--c3v-gold, #c2872f); }
.c3v-cell.is-ghost .c3v-cell__box {
  fill: none; stroke: var(--c3v-hot, #a45f45); stroke-dasharray: 4 3; stroke-width: 2.5;
}
.c3v-cell.is-ghost .c3v-cell__val { fill: var(--c3v-hot, #a45f45); }
.c3v-cell.is-ghost .c3v-cell__sub { fill: var(--c3v-hot, #a45f45); }
.c3v-cell.is-final .c3v-cell__box { stroke: var(--c3v-ok, #3f6b57); stroke-width: 3.5; }

.c3v-label {
  fill: var(--c3v-muted, #657168); font-size: 12.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.c3v-floor { stroke: var(--c3v-line, #c3c9c2); stroke-width: 2; }
.c3v-phase__text {
  fill: var(--c3v-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function T(){if(document.getElementById(u))return;let e=document.createElement(`style`);e.id=u,e.textContent=w,document.head.appendChild(e)}function E(a,o={}){if(!a||a.dataset.calciiiMounted===`1`)return{destroy(){}};a.dataset.calciiiMounted=`1`,T();let s=l(o),c=o.autoplay!==!1,w=s[0].tokens,E=r,D=document.createElement(`div`);D.className=`viz c3v`;let O=document.createElement(`div`);O.className=`viz__stage`,D.appendChild(O);let k=E(`svg`,{class:`viz__svg c3v__svg`,viewBox:`0 0 660 420`,role:`img`,"aria-label":`基本计算器 III LC772 双栈调度场动画`});O.appendChild(k);let A=E(`g`,{}),j=E(`g`,{}),M=E(`g`,{});k.appendChild(A),k.appendChild(j),k.appendChild(M);let N=E(`text`,{class:`c3v-note`,x:26,y:d});N.textContent=`新运算符来临：栈顶优先级 >= 它的先结账（>= 即左结合），再压自己`,M.appendChild(N);let P=w.length*31-h,F=Math.max(16,(660-P)/2),I=w.map((e,t)=>{let n=F+t*31,r=E(`g`,{class:`c3v-tok`});r.appendChild(E(`rect`,{class:`c3v-tok__box`,x:n,y:f,width:m,height:p,rx:5}));let i=E(`text`,{class:`c3v-tok__val`,x:n+m/2,y:72});return i.textContent=e,r.appendChild(i),A.appendChild(r),{g:r,x:n}}),L=E(`path`,{class:`c3v-pointer`,d:``});M.appendChild(L),M.appendChild(E(`rect`,{class:`c3v-ban__box`,x:26,y:ee,width:608,height:_,rx:8}));let R=E(`text`,{class:`c3v-ban__text`,x:660/2,y:135});M.appendChild(R);let z=Math.max(1,...s.map(e=>e.nums.length)),B=Math.max(1,...s.map(e=>e.ops.length));M.appendChild(E(`line`,{class:`c3v-floor`,x1:180-b/2-8,y1:v,x2:252,y2:v})),M.appendChild(E(`line`,{class:`c3v-floor`,x1:480-b/2-8,y1:v,x2:552,y2:v}));let V=E(`text`,{class:`c3v-label`,x:180,y:x});V.textContent=`nums 数值栈`;let H=E(`text`,{class:`c3v-label`,x:480,y:x});H.textContent=`ops 运算符栈（含挡板）`,M.append(V,H);let U=(e,t)=>{let n=[];for(let r=0;r<=t;r+=1){let t=E(`g`,{class:`c3v-cell`}),i=v-(r+1)*43;t.appendChild(E(`rect`,{class:`c3v-cell__box`,x:e-b/2,y:i,width:b,height:y,rx:6}));let a=E(`text`,{class:`c3v-cell__val`,x:e,y:i+y/2-4});t.appendChild(a);let o=E(`text`,{class:`c3v-cell__sub`,x:e,y:i+y-8});t.appendChild(o),j.appendChild(t),n.push({g:t,val:a,sub:o})}return n},W=U(180,z),G=U(480,B),K=E(`text`,{class:`c3v-phase__text`,x:660/2,y:S});M.appendChild(K);let q=document.createElement(`p`);q.className=`viz__desc`,q.setAttribute(`aria-live`,`polite`);function J(e,t,n,r,i,a){let o=t.length-1;e.forEach((e,s)=>{let c=[`c3v-cell`];s<t.length?(e.val.textContent=String(t[s]),e.sub.textContent=s===0?`bottom`:`#${s}`,s===o&&c.push(`is-top`),s===n&&c.push(`is-fresh`),s===a&&c.push(`is-final`)):s===r?(e.val.textContent=i,e.sub.textContent=`结算/弹出`,c.push(`is-ghost`)):(e.val.textContent=``,e.sub.textContent=``),e.g.setAttribute(`class`,c.join(` `))})}function Y(t,n){if(!n)return;if(I.forEach((e,t)=>{let r=[`c3v-tok`];n.pos===null?(n.done||n.phase===`flush`)&&r.push(`is-past`):t<n.pos?r.push(`is-past`):t===n.pos&&r.push(`is-now`),e.g.setAttribute(`class`,r.join(` `))}),n.pos!==null){let e=I[n.pos].x+m/2;L.setAttribute(`d`,`M ${e} ${g-6} L ${e-6} 100 L ${e+6} 100 Z`),L.style.opacity=`1`}else L.style.opacity=`0`;n.applies.length>0?R.textContent=`结算：`+n.applies.map(e=>`${e.a} ${e.op} ${e.b} = ${e.res}`).join(`  →  `):n.phase===`init`?R.textContent=`nums 攒操作数 · ops 靠优先级决定谁先结账`:n.phase===`done`?R.textContent=`答案：${n.result}`:R.textContent=`本帧无结算 —— 继续攒`;let r=n.phase===`number`,i=n.phase===`operator`,a=n.applies.length>0,o=n.phase===`done`,s=r||a?n.nums.length-1:-1;J(W,n.nums,s,-1,``,o?0:-1);let c=n.phase===`close`?`(`:a?n.applies.at(-1).op:null;J(G,n.ops,i?n.ops.length-1:-1,a||n.phase===`close`?n.ops.length:-1,c??``,-1),n.phase===`init`?K.textContent=`优先级不统一 → "来一个结一个"失效 → 双栈调度场`:r?K.textContent=`数字只进 nums：什么时候算，是运算符的事`:n.phase===`open`?K.textContent=`'(' 压进 ops 当挡板 —— 后面的运算符在它面前停下`:n.phase===`close`?K.textContent=`')' 结算到挡板：括号塌缩成 nums 顶上的一个数`:n.phase===`flush`?K.textContent=`栈形不变量保证：从顶到底结算 === 正确运算顺序`:i?K.textContent=a?`高优先级的先走，我排队`:`栈顶优先级更低（或被挡板挡住）→ 直接压栈等待`:K.textContent=`时间 O(n)，空间 O(n) —— 双栈各存各的`,e(q,n.desc)}D.appendChild(q);let X=i();D.appendChild(X.root),a.textContent=``,a.appendChild(D),n();let Z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:s,controls:X,intervalMs:C,onRender:Y});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return c&&!Z&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(D)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.calciiiMounted,document.getElementById(u)?.remove()}}}export{E as mountCalcIII};