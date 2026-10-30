import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[{op:`push`,val:-2},{op:`push`,val:0},{op:`push`,val:-3},{op:`getMin`},{op:`pop`},{op:`top`},{op:`getMin`}],o={push:e=>`push(${e})`,pop:()=>`pop()`,top:()=>`top()`,getMin:()=>`getMin()`};function s(e={}){let t=Array.isArray(e.ops)&&e.ops.length>0?e.ops.map(e=>({...e})):a.map(e=>({...e})),n=[],r=(e,r,a={})=>{n.push({phase:e,desc:r,ops:t,opIdx:null,main:i.slice(),mins:s.slice(),minPushed:!1,popped:null,minPopped:null,result:null,done:e===`done`,...a})},i=[],s=[];r(`init`,`设计一个栈，在 \`push\` / \`pop\` / \`top\` 之外还要支持 \`getMin\` —— 取栈内**最小元素**，且 \`getMin\` 必须是 \`O(1)\`。难点：栈只能看到栈顶，最小值可能埋在任意一层；每次现扫是 \`O(n)\`。思路：**最小值是历史，必须按层存** —— 开一个辅助栈，主栈每进一个元素，辅助栈同步记下"这一刻全栈的最小值"。于是辅助栈顶恒等于全栈最小值，\`getMin\` 直接读栈顶；\`pop\` 时两栈一起弹，**旧的最小值自动恢复**。操作序列：\`${t.map(e=>o[e.op](e.val)).join(` → `)}\`。`,{main:[],mins:[]});for(let e=0;e<t.length;e+=1){let n=t[e];if(n.op===`push`){let t=Number(n.val),a=s.length>0?s[s.length-1]:null,o=s.length===0||t<=a;i.push(t),o&&s.push(t);let c=s[s.length-1];r(`push`,`**\`push(${t})\`**：主栈压入 \`${t}\`。辅助栈判据 \`x <= 当前最小值\`${a===null?`（辅助栈为空）`:`（栈顶 \`${a}\`）`}：`+(o?`\`${t}\` ${a===null?`是第一个元素`:`不比当前最小值 \`${a}\` 大`} —— 压入辅助栈，记录"**${t} 入栈这一刻**，全栈最小值是 \`${c}\`"。`:`\`${t} > ${a}\`，它入栈后最小值没变 —— 辅助栈**不压**（留空档）。此刻全栈最小值仍是 \`${c}\`。`)+`主栈（底→顶）\`[${i.join(`, `)}]\`，辅助栈 \`[${s.join(`, `)}]\`。`,{opIdx:e,minPushed:o,result:null});continue}if(n.op===`pop`){if(i.length===0){r(`pop`,"**`pop()`**：栈已空，无操作。",{opIdx:e});continue}let t=i.pop(),n=null;s.length>0&&s[s.length-1]===t&&(n=s.pop());let a=s.length>0?s[s.length-1]:null;r(`pop`,`**\`pop()\`**：主栈弹出栈顶 \`${t}\`。`+(n===null?`\`${t}\` 不是当前最小值（辅助栈顶是 \`${s[s.length-1]}\`），辅助栈**不动** —— 它入栈时就没压过，弹它不影响最小值。`:`它**正是**辅助栈顶 \`${n}\`（说明它入栈时就是当时的最小值）—— 两栈同步弹出，栈里**恢复出更早的最小值 \`${a}\`** —— 这就是"按层存历史"的意义：pop 之后要回到过去，旧最小值必须本来就存着。`)+`主栈 \`[${i.join(`, `)}]\`，辅助栈 \`[${s.join(`, `)}]\`。`,{opIdx:e,popped:t,minPopped:n});continue}if(n.op===`top`){let t=i.length>0?i[i.length-1]:null;r(`top`,`**\`top()\`**：读主栈栈顶 \`${t}\`（空栈返回 \`null\`）。栈的本职工作，\`O(1)\`。`,{opIdx:e,result:t});continue}if(n.op===`getMin`){let t=s.length>0?s[s.length-1]:null;r(`getMin`,`**\`getMin()\` → \`${t}\`**：直接读辅助栈顶 —— \`O(1)\`。辅助栈顶恒等于 \`min(主栈全体)\`（不变量，见说明），所以这一步**不需要扫主栈**。`,{opIdx:e,result:t});continue}r(`push`,`未知操作 \`${n.op}\`，跳过。`,{opIdx:e})}let c=s.length>0?s[s.length-1]:null;return r(`done`,`七个操作走完：主栈 \`[${i.join(`, `)}]\`，辅助栈 \`[${s.join(`, `)}]\`，当前最小值 \`${c}\`。四个操作全 \`O(1)\`，代价是辅助栈的 \`O(n)\` 空间 —— 用空间换"记住历史"。两个要点：① 辅助栈存的是"**每一刻**的最小值"，不是"最小值本身"，所以 pop 能恢复过去；② 压入判据是 \`<=\`（相等也压）—— 用 \`<\` 会在重复最小值 pop 后提前弹空。`,{done:!0}),n}var c=`minstack-styles`,l=54,u=84,d=46,f=336,p=46,m=84,h=362,g=388,_=1250,v=`
.msv {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.msv__svg { width: 100%; height: auto; display: block; }

.msv-note {
  fill: var(--msv-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.msv-banner__box {
  fill: var(--msv-banner, #f4f3ef);
  stroke: var(--msv-line, #c3c9c2);
  stroke-width: 1.5;
}
.msv-banner__op {
  fill: var(--msv-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.msv-banner__ret {
  fill: var(--msv-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.msv-cell__box {
  fill: var(--msv-fill, #ffffff);
  stroke: var(--msv-line, #c3c9c2);
  stroke-width: 1.5;
}
.msv-cell__val {
  fill: var(--msv-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.msv-cell__sub {
  fill: var(--msv-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 栈顶（当前可读）：绿框 */
.msv-cell.is-top .msv-cell__box {
  stroke: var(--msv-ok, #3f6b57);
  stroke-width: 3;
}
.msv-cell.is-top .msv-cell__val { fill: var(--msv-ok, #3f6b57); }
/* 本帧新压入：金框 */
.msv-cell.is-fresh .msv-cell__box {
  fill: var(--msv-gold-fill, #fdf3e3);
  stroke: var(--msv-gold, #c2872f);
  stroke-width: 3;
}
.msv-cell.is-fresh .msv-cell__val { fill: var(--msv-gold, #c2872f); }
/* 本帧弹出：虚线幽灵（留在原高度上方，看得见"历史"） */
.msv-cell.is-ghost .msv-cell__box {
  fill: none;
  stroke: var(--msv-hot, #a45f45);
  stroke-dasharray: 4 3;
  stroke-width: 2.5;
}
.msv-cell.is-ghost .msv-cell__val { fill: var(--msv-hot, #a45f45); }
.msv-cell.is-ghost .msv-cell__sub { fill: var(--msv-hot, #a45f45); }
/* 辅助栈里被同步弹出的幽灵 */
.msv-cell.is-minghost .msv-cell__box {
  fill: none;
  stroke: var(--msv-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.5;
}
.msv-cell.is-minghost .msv-cell__val { fill: var(--msv-dim, #9aa39c); }

.msv-label {
  fill: var(--msv-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.msv-floor {
  stroke: var(--msv-line, #c3c9c2);
  stroke-width: 2;
}
.msv-arrow {
  stroke: var(--msv-hot, #a45f45);
  stroke-width: 2;
  fill: none;
}
.msv-arrow__head { fill: var(--msv-hot, #a45f45); stroke: none; }
.msv-arrow__text {
  fill: var(--msv-hot, #a45f45);
  font-size: 11.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.msv-phase__text {
  fill: var(--msv-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function y(){if(document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=v,document.head.appendChild(e)}function b(a,o={}){if(!a||a.dataset.minstackMounted===`1`)return{destroy(){}};a.dataset.minstackMounted=`1`,y();let v=s(o),b=o.autoplay!==!1,x=v[0].ops,S=r,C=document.createElement(`div`);C.className=`viz msv`;let w=document.createElement(`div`);w.className=`viz__stage`,C.appendChild(w);let T=Math.max(1,...v.map(e=>e.main.length)),E=Math.max(1,...v.map(e=>e.mins.length)),D=S(`svg`,{class:`viz__svg msv__svg`,viewBox:`0 0 660 412`,role:`img`,"aria-label":`最小栈 辅助栈推演动画`});w.appendChild(D);let O=S(`g`,{class:`msv-cells`}),k=S(`g`,{class:`msv-marks`});D.appendChild(O),D.appendChild(k);let A=S(`text`,{class:`msv-note`,x:26,y:l});A.textContent=`最小值是历史：辅助栈每层记「这一刻全栈的最小值」—— pop 后自动恢复过去`,k.appendChild(A),k.appendChild(S(`rect`,{class:`msv-banner__box`,x:26,y:u,width:608,height:d,rx:9}));let j=S(`text`,{class:`msv-banner__op`,x:44,y:107}),M=S(`text`,{class:`msv-banner__ret`,x:616,y:107});k.appendChild(j),k.appendChild(M),k.appendChild(S(`line`,{class:`msv-floor`,x1:220-m/2-10,y1:f,x2:272,y2:f})),k.appendChild(S(`line`,{class:`msv-floor`,x1:440-m/2-10,y1:f,x2:492,y2:f}));let N=S(`text`,{class:`msv-label`,x:220,y:h});N.textContent=`main 主栈`;let P=S(`text`,{class:`msv-label`,x:440,y:h});P.textContent=`mins 辅助栈`,k.appendChild(N),k.appendChild(P);let F=(e,t)=>{let n=[];for(let r=0;r<=t;r+=1){let t=S(`g`,{class:`msv-cell`}),i=f-(r+1)*52,a=S(`rect`,{class:`msv-cell__box`,x:e-m/2,y:i,width:m,height:p,rx:6});t.appendChild(a);let o=S(`text`,{class:`msv-cell__val`,x:e,y:i+p/2-5});t.appendChild(o);let s=S(`text`,{class:`msv-cell__sub`,x:e,y:i+p-9});t.appendChild(s),O.appendChild(t),n.push({g:t,val:o,sub:s})}return n},I=F(220,T),L=F(440,E),R=S(`g`,{class:`msv-sync`}),z=S(`line`,{class:`msv-arrow`,x1:268,y1:0,x2:440-m/2-14,y2:0}),B=S(`path`,{class:`msv-arrow__head`,d:``}),V=S(`text`,{class:`msv-arrow__text`,x:660/2,y:0});R.appendChild(z),R.appendChild(B),R.appendChild(V),k.appendChild(R);let H=S(`text`,{class:`msv-phase__text`,x:660/2,y:g});k.appendChild(H);let U=document.createElement(`p`);U.className=`viz__desc`,U.setAttribute(`aria-live`,`polite`);function W(e,t,n,r,i,a){e.forEach((e,o)=>{let s=[`msv-cell`];o<t.length?(e.val.textContent=String(t[o]),e.sub.textContent=o===0?`bottom`:`#${o}`,o===n&&s.push(`is-top`),o===r&&s.push(`is-fresh`)):o===i?(e.val.textContent=a,e.sub.textContent=`弹出`,s.push(`is-ghost`)):(e.val.textContent=``,e.sub.textContent=``,s.push(`is-minghost`)),e.g.setAttribute(`class`,s.join(` `))})}function G(t,n){if(!n)return;let r=n.main,i=n.mins,a=r.length-1,o=i.length-1,s=n.phase===`push`,c=n.phase===`pop`;if(W(I,r,a,s?a:-1,c?r.length:-1,c?String(n.popped):``),W(L,i,o,s&&n.minPushed?o:-1,c&&n.minPopped!==null?i.length:-1,c&&n.minPopped!==null?String(n.minPopped):``),s&&n.minPushed||c&&n.minPopped!==null){let e=f-(i.length+ +!s)*52+p/2;z.setAttribute(`y1`,e),z.setAttribute(`y2`,e),z.setAttribute(`x2`,440-m/2-10),B.setAttribute(`d`,`M ${440-m/2-4} ${e} L ${440-m/2-13} ${e-5} L ${440-m/2-13} ${e+5} Z`),V.setAttribute(`y`,e-12),V.textContent=s?`同步压入`:`同步弹出`,R.style.opacity=`1`}else R.style.opacity=`0`;let l=n.opIdx===null?null:x[n.opIdx];n.phase===`init`?(j.textContent=`最小栈：getMin 要求 O(1)`,M.textContent=``):n.phase===`done`?(j.textContent=`${x.length} 个操作完成`,M.textContent=`min=${i.length>0?i[i.length-1]:`∅`}`):l&&(j.textContent=l.op===`push`?`push(${l.val})`:`${l.op}()`,n.result!==null&&n.result!==void 0?M.textContent=`→ ${n.result}`:c?M.textContent=`弹 ${n.popped}${n.minPopped===null?``:` · 同步弹 min`}`:M.textContent=``),s?H.textContent=n.minPushed?`x <= 当前最小值 → 辅助栈同步压入，记录这一刻的历史`:`x > 当前最小值 → 辅助栈留空档，历史没变化`:c?H.textContent=n.minPopped===null?`弹出的不是最小值 → 辅助栈不动，最小值不变`:`弹出的是当前最小值 → 两栈同步弹，旧最小值自动恢复`:n.phase===`getMin`?H.textContent=`getMin = 读辅助栈顶 —— O(1)，不扫主栈`:n.phase===`top`?H.textContent=`top = 读主栈顶 —— 栈的本职工作`:n.phase===`init`?H.textContent=`栈只见栈顶，最小值却在任意一层 —— 所以按层存`:H.textContent=`四个操作全 O(1) —— 用辅助栈的 O(n) 空间换「记住历史」`,e(U,n.desc)}C.appendChild(U);let K=i();C.appendChild(K.root),a.textContent=``,a.appendChild(C),n();let q=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,J=t({steps:v,controls:K,intervalMs:_,onRender:G});J.jumpTo(Math.trunc(o.initialStep)||0);let Y=null;return b&&!q&&typeof IntersectionObserver==`function`&&(Y=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){Y.disconnect(),Y=null,J.play();return}},{threshold:.35}),Y.observe(C)),{destroy(){Y&&=(Y.disconnect(),null),J.destroy(),a.textContent=``,delete a.dataset.minstackMounted,document.getElementById(c)?.remove()}}}export{b as mountMinStack};