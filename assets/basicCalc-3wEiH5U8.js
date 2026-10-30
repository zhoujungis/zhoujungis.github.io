import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=`1 + 2 - (3 + 4) - 5`;function o(e){let t=[],n=0;for(;n<e.length;){let r=e[n];if(r===` `){n+=1;continue}if(r>=`0`&&r<=`9`){let r=n;for(;r<e.length&&e[r]>=`0`&&e[r]<=`9`;)r+=1;t.push(e.slice(n,r)),n=r;continue}t.push(r),n+=1}return t}function s(e={}){let t=typeof e.expr==`string`&&e.expr.trim()!==``?e.expr:a,n=o(t),r=[],i=0,s=1,c=[],l=(e,a,o={})=>{r.push({phase:e,desc:a,expr:t,tokens:n,pos:null,token:null,result:i,prev:i,sign:s,stack:c.map(e=>({...e})),value:null,contribution:null,pushed:null,popped:null,inner:null,done:e===`done`,...o})};l(`init`,`表达式 \`${t}\` 只含数字、\`+\`、\`-\`、括号 —— **没有优先级要处理**（加减同级、左结合）。所以不用双栈、不用调度场：一个累计值 \`result\`、一个符号 \`sign\` 从左到右扫就够。唯一的麻烦是**括号**：\`-\`(3+4)\` 里整个括号要**乘以前面的负号**并回外层。办法：看到 \`(\` 就把「**外层累计值 + 括号外符号**」这对上下文压栈、进括号重启累加器；看到 \`)\` 弹栈合并 \`result = 外层result + 外层sign * 括号内值\`。这就是 LC 20 的括号配对长了算术能力 —— 栈照旧存"没闭合的上一层"，只是那层从"等哪个右括号"升级成"等一个数值"。`,{result:0,prev:0,sign:1,stack:[]});for(let e=0;e<n.length;e+=1){let t=n[e];if(t>=`0`&&t<=`9`){let n=Number(t),r=s*n,a=i;i+=r,l(`number`,`**\`${t}\`**：数字带着当前符号入账 —— \`result += sign * ${n}\` = \`${a}\` + \`${r}\` = \`${i}\`。同级左结合意味着数字**没有资格等待**：符号已定，立刻结算进累计值。`,{pos:e,token:t,prev:a,value:n,contribution:r});continue}if(t===`+`||t===`-`){s=t===`+`?1:-1,l(`sign`,`**\`${t}\`**：只是给**下一个数字**登记符号 \`sign = ${s}\`，累计值不动（\`${i}\`）。加减同级，所以这个符号不需要和任何"栈顶运算符"比优先级 —— 直接覆盖即可。`,{pos:e,token:t});continue}if(t===`(`){let n={result:i,sign:s};c.push({result:i,sign:s});let r=i;i=0,s=1,l(`open`,`**\`(\`**：进入新括号层。把上下文 \`{result: ${n.result}, sign: ${n.sign>0?`+1`:`-1`}}\` 压栈 —— 记的是"**外层已累计多少**"和"**这个括号整体该乘什么符号**"。然后重启一个干净的累加器：\`result = 0\`、\`sign = +1\`。`,{pos:e,token:t,prev:r,pushed:n});continue}if(t===`)`){let n=i,r=c.pop(),a=i;i=r.result+r.sign*n,l(`close`,`**\`)\`**：括号内算完，\`inner = ${n}\`。弹栈合并：\`result = ${r.result} + (${r.sign>0?`+`:`-`}1) * ${n} = ${i}\` —— 括号作为一个**整体数值**、乘上括号外的符号，并回外层累计值。一层上下文就此闭合。`,{pos:e,token:t,prev:a,inner:n,popped:r});continue}l(`sign`,`未知 token \`${t}\`，跳过。`,{pos:e,token:t})}return l(`done`,`扫完：\`${t}\` = **\`${i}\`**。全程只有一个累计值 + 一个符号，栈仅在括号进出时动 —— 空间 \`O(括号嵌套深度)\`，时间 \`O(n)\`。两个要点：① 加减同级左结合，数字来一个结一个，**不需要运算符栈**；② 栈存的不是中间结果本身，是"**外层欠账**"：外层累计 + 括号符号，闭合时一并清算。`,{done:!0}),r}var c=`basiccalc-styles`,l=40,u=62,d=34,f=42,p=4,m=108,ee=132,h=64,g=336,_=40,v=168,y=360,b=386,x=1250,S=`
.bcv { display: flex; flex-direction: column; gap: 14px; }
.bcv__svg { width: 100%; height: auto; display: block; }

.bcv-note {
  fill: var(--bcv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-tok__box {
  fill: var(--bcv-fill, #ffffff);
  stroke: var(--bcv-line, #c3c9c2); stroke-width: 1.5;
}
.bcv-tok__val {
  fill: var(--bcv-ink, #1f2a24);
  font-size: 15px; font-weight: 700; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-tok.is-past .bcv-tok__box { fill: var(--bcv-past, #eef0ec); stroke: var(--bcv-past-line, #d8ddd6); }
.bcv-tok.is-past .bcv-tok__val { fill: var(--bcv-dim, #9aa39c); }
.bcv-tok.is-now .bcv-tok__box {
  fill: var(--bcv-gold-fill, #fdf3e3); stroke: var(--bcv-gold, #c2872f); stroke-width: 3;
}
.bcv-tok.is-now .bcv-tok__val { fill: var(--bcv-gold, #c2872f); }
.bcv-pointer { fill: var(--bcv-gold, #c2872f); }

.bcv-panel__box {
  fill: var(--bcv-banner, #f4f3ef); stroke: var(--bcv-line, #c3c9c2); stroke-width: 1.5;
}
.bcv-panel__label {
  fill: var(--bcv-muted, #657168); font-size: 12px; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-panel__num {
  fill: var(--bcv-ink, #1f2a24); font-size: 24px; font-weight: 800;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-panel__num.is-fresh { fill: var(--bcv-gold, #c2872f); }
.bcv-panel__num.is-final { fill: var(--bcv-ok, #3f6b57); }
.bcv-panel__op {
  fill: var(--bcv-dim, #9aa39c); font-size: 16px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-panel__formula {
  fill: var(--bcv-hot, #a45f45); font-size: 12.5px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.bcv-cell__box {
  fill: var(--bcv-fill, #ffffff); stroke: var(--bcv-line, #c3c9c2); stroke-width: 1.5;
}
.bcv-cell__val {
  fill: var(--bcv-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-cell.is-top .bcv-cell__box { stroke: var(--bcv-ok, #3f6b57); stroke-width: 3; }
.bcv-cell.is-fresh .bcv-cell__box {
  fill: var(--bcv-gold-fill, #fdf3e3); stroke: var(--bcv-gold, #c2872f); stroke-width: 3;
}
.bcv-cell.is-fresh .bcv-cell__val { fill: var(--bcv-gold, #c2872f); }
.bcv-cell.is-ghost .bcv-cell__box {
  fill: none; stroke: var(--bcv-hot, #a45f45); stroke-dasharray: 4 3; stroke-width: 2.5;
}
.bcv-cell.is-ghost .bcv-cell__val { fill: var(--bcv-hot, #a45f45); }

.bcv-label {
  fill: var(--bcv-muted, #657168); font-size: 12.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-floor { stroke: var(--bcv-line, #c3c9c2); stroke-width: 2; }
.bcv-phase__text {
  fill: var(--bcv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function C(){if(document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=S,document.head.appendChild(e)}var w=e=>e>0?`+1`:`-1`;function T(a,o={}){if(!a||a.dataset.basiccalcMounted===`1`)return{destroy(){}};a.dataset.basiccalcMounted=`1`,C();let S=s(o),T=o.autoplay!==!1,E=S[0].tokens,D=r,O=document.createElement(`div`);O.className=`viz bcv`;let k=document.createElement(`div`);k.className=`viz__stage`,O.appendChild(k);let A=D(`svg`,{class:`viz__svg bcv__svg`,viewBox:`0 0 660 408`,role:`img`,"aria-label":`基本计算器 LC224 推演动画`});k.appendChild(A);let j=D(`g`,{}),M=D(`g`,{}),N=D(`g`,{});A.appendChild(j),A.appendChild(M),A.appendChild(N);let P=D(`text`,{class:`bcv-note`,x:26,y:l});P.textContent=`栈存的不是数字，是「外层欠账」：括号前的累计值 + 括号的符号`,N.appendChild(P);let F=E.length*46-p,I=Math.max(26,(660-F)/2),L=E.map((e,t)=>{let n=I+t*46,r=D(`g`,{class:`bcv-tok`});r.appendChild(D(`rect`,{class:`bcv-tok__box`,x:n,y:u,width:f,height:d,rx:6}));let i=D(`text`,{class:`bcv-tok__val`,x:n+f/2,y:79});return i.textContent=e,r.appendChild(i),j.appendChild(r),{g:r,x:n}}),R=D(`path`,{class:`bcv-pointer`,d:``});N.appendChild(R),N.appendChild(D(`rect`,{class:`bcv-panel__box`,x:26,y:ee,width:608,height:h,rx:9}));let z=D(`text`,{class:`bcv-panel__label`,x:130,y:148});z.textContent=`sign（下一个数字的符号）`;let B=D(`text`,{class:`bcv-panel__num`,x:130,y:172}),V=D(`text`,{class:`bcv-panel__op`,x:232,y:172});V.textContent=`result =`;let H=D(`text`,{class:`bcv-panel__num`,x:320,y:172}),U=D(`text`,{class:`bcv-panel__formula`,x:440,y:172});N.append(z,B,V,H,U);let W=Math.max(1,...S.map(e=>e.stack.length));N.appendChild(D(`line`,{class:`bcv-floor`,x1:330-v/2-10,y1:g,x2:424,y2:g}));let G=D(`text`,{class:`bcv-label`,x:330,y});G.textContent=`括号上下文栈 {外层result, 括号sign}`,N.appendChild(G);let K=[];for(let e=0;e<=W;e+=1){let t=D(`g`,{class:`bcv-cell`}),n=g-(e+1)*46;t.appendChild(D(`rect`,{class:`bcv-cell__box`,x:330-v/2,y:n,width:v,height:_,rx:6}));let r=D(`text`,{class:`bcv-cell__val`,x:330,y:n+_/2});t.appendChild(r),M.appendChild(t),K.push({g:t,val:r})}let q=D(`text`,{class:`bcv-phase__text`,x:660/2,y:b});N.appendChild(q);let J=document.createElement(`p`);J.className=`viz__desc`,J.setAttribute(`aria-live`,`polite`);function Y(t,n){if(!n)return;if(L.forEach((e,t)=>{let r=[`bcv-tok`];n.pos===null?n.done&&r.push(`is-past`):t<n.pos?r.push(`is-past`):t===n.pos&&r.push(`is-now`),e.g.setAttribute(`class`,r.join(` `))}),n.pos!==null){let e=L[n.pos].x+f/2;R.setAttribute(`d`,`M ${e} ${m-6} L ${e-6} 111 L ${e+6} 111 Z`),R.style.opacity=`1`}else R.style.opacity=`0`;B.textContent=w(n.sign),H.textContent=String(n.result);let r=n.phase===`number`,i=n.phase===`close`,a=n.phase===`sign`;H.setAttribute(`class`,`bcv-panel__num`+(n.done?` is-final`:r||i?` is-fresh`:``)),B.setAttribute(`class`,`bcv-panel__num`+(a?` is-fresh`:``)),r?U.textContent=`${n.prev} + ${w(n.sign)} * ${n.value} = ${n.result}`:i?U.textContent=`${n.popped.result} + ${w(n.popped.sign)} * (${n.inner}) = ${n.result}`:U.textContent=``;let o=n.stack,s=o.length-1,c=n.phase===`open`;K.forEach((e,t)=>{let r=[`bcv-cell`];t<o.length?(e.val.textContent=`result=${o[t].result}  sign=${w(o[t].sign)}`,t===s&&r.push(`is-top`),c&&t===s&&r.push(`is-fresh`)):i&&t===o.length?(e.val.textContent=`result=${n.popped.result}  sign=${w(n.popped.sign)}  弹出合并`,r.push(`is-ghost`)):e.val.textContent=``,e.g.setAttribute(`class`,r.join(` `))}),n.phase===`init`?q.textContent=`加减同级左结合：数字来一个结一个，不需要运算符栈`:r?q.textContent=`数字没有资格等待 —— 符号已定，立刻结算`:a?q.textContent=`运算符只登记符号，不动累计值`:c?q.textContent=`压栈「外层欠账」，进括号重启累加器`:i?q.textContent=`括号塌缩成一个数，乘上括号外的符号并回外层`:q.textContent=`时间 O(n)，空间 O(括号嵌套深度)`,e(J,n.desc)}O.appendChild(J);let X=i();O.appendChild(X.root),a.textContent=``,a.appendChild(O),n();let Z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:S,controls:X,intervalMs:x,onRender:Y});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return T&&!Z&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(O)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.basiccalcMounted,document.getElementById(c)?.remove()}}}export{T as mountBasicCalc};