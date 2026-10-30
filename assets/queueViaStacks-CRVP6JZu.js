import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[{op:`push`,val:1},{op:`push`,val:2},{op:`push`,val:3},{op:`pop`},{op:`peek`},{op:`pop`},{op:`push`,val:4},{op:`pop`},{op:`pop`}],o={push:e=>`push(${e})`,pop:()=>`pop()`,peek:()=>`peek()`,empty:()=>`empty()`};function s(e={}){let t=Array.isArray(e.ops)&&e.ops.length>0?e.ops.map(e=>({...e})):a.map(e=>({...e})),n=[],r=[],i=[],s=[],c=0,l=(e,a,o={})=>{n.push({phase:e,desc:a,ops:t,opIdx:null,inn:r.slice(),out:i.slice(),moved:null,result:null,queueOut:s.slice(),transfers:c,done:e===`done`,...o})};l(`init`,`用两个栈实现队列：支持 \`push\` / \`pop\` / \`peek\`，要求 FIFO。栈是 LIFO，方向正好相反 —— 但"相反"翻**两次**就是原样：进 \`in\` 栈倒一次，整摞翻进 \`out\` 栈再倒一次，\`out\` 顶就是最早来的。正确性的钉子：**只有 \`out\` 空了才搬运** —— 搬一半的顺序是坏的。操作序列：\`${t.map(e=>o[e.op](e.val)).join(` → `)}\`。`);for(let e=0;e<t.length;e+=1){let n=t[e];if(n.op===`push`){let t=Number(n.val);r.push(t),l(`push`,`**\`push(${t})\`**：直接压进 \`in\` 栈顶 —— \`O(1)\`，\`out\` 不动。此时 \`in\`（底→顶）\`[${r.join(`, `)}]\`，\`out\` \`[${i.join(`, `)}]\`。`+(i.length>0?`注意 \`out\` 里还留着旧的 \`${i.join(`、`)}\` —— 它们**先于** ${t} 入队，必须等 \`out\` 清空才轮到新元素，所以现在**绝不能搬**。`:"（`out` 为空，新元素排在队尾。）"),{opIdx:e});continue}if(n.op===`pop`||n.op===`peek`){let t=n.op===`pop`;if(r.length===0&&i.length===0){l(t?`pop`:`peek`,`**\`${n.op}()\`**：队列已空，返回 \`null\`。`,{opIdx:e,result:null});continue}if(i.length===0)for(l(`transfer`,`**\`${n.op}()\`** 要取队首，但 \`out\` 空了 —— 触发搬运：把 \`in\` 整摞 \`[${r.join(`, `)}]\`（顶在右）逐个弹出、压进 \`out\`。翻完之后 \`out\` 顶就是**最早入队**的元素 —— 两次反转，方向转正。`,{opIdx:e});r.length>0;){let t=r.pop();i.push(t),c+=1,l(`transfer`,`搬运：\`in\` 弹出 \`${t}\` → 压入 \`out\`。此刻 \`in\` \`[${r.join(`, `)}]\`，\`out\` \`[${i.join(`, `)}]\`（顶 = \`${i[i.length-1]}\` = 队首）。这是 \`${t}\` 一生**唯一一次**搬运。`,{opIdx:e,moved:t})}let a=i[i.length-1];t&&(i.pop(),s.push(a)),l(t?`pop`:`peek`,`**\`${n.op}()\` → \`${a}\`**：${t?`\`out\` 弹出栈顶 \`${a}\`，记入出队序列 \`[${s.join(`, `)}]\``:`读 \`out\` 栈顶 \`${a}\`，**不弹出** —— 它就是队首`}。`+(i.length>0?` \`out\` 还剩 \`[${i.join(`, `)}]\`（顶 \`${i[i.length-1]}\` 是下一个队首）—— 消费只动 \`out\`，\`in\` 里新来的元素**插不了队**。`:" `out` 空了 —— 下次 `pop` 再触发搬运（或队列真的空了）。")+" 单次 `O(1)`（搬运已提前付掉）。",{opIdx:e,result:a});continue}if(n.op===`empty`){l(`pop`,`**\`empty()\` → \`${r.length===0&&i.length===0}\`**：两栈皆空即队列空。`,{opIdx:e});continue}l(`push`,`未知操作 \`${n.op}\`，跳过。`,{opIdx:e})}let u=t.filter(e=>e.op===`push`).map(e=>e.val).join(`,`);return l(`done`,`${t.length} 个操作走完，出队序列 \`[${s.join(`, `)}]\` —— 正好是入队顺序 \`${u}\`，FIFO 成立。账本：\`${s.length}\` 次 pop 总共只搬了 \`${c}\` 次 —— 每个元素**一生最多被搬一次**，所以 \`n\` 次操作总花费 \`O(n)\`，**均摊 \`O(1)\`**（单次最坏 \`O(n)\`：那一次恰好触发搬运）。两个钉子：① 搬运必须**整摞**翻，且只在 \`out\` 空时发生；② \`pop\`/\`peek\` 只动 \`out\` —— 旧的一摞没消费完，新的一摞绝不插队。`,{done:!0}),n}var c=`qstacks-styles`,l=54,u=84,d=46,f=322,p=44,m=78,h=346,g=372,_=40,ee=440,v=1050,y=`
.qsv {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.qsv__svg { width: 100%; height: auto; display: block; }

.qsv-note {
  fill: var(--qsv-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.qsv-banner__box {
  fill: var(--qsv-banner, #f4f3ef);
  stroke: var(--qsv-line, #c3c9c2);
  stroke-width: 1.5;
}
.qsv-banner__op {
  fill: var(--qsv-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.qsv-banner__ret {
  fill: var(--qsv-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.qsv-cell__box {
  fill: var(--qsv-fill, #ffffff);
  stroke: var(--qsv-line, #c3c9c2);
  stroke-width: 1.5;
}
.qsv-cell__val {
  fill: var(--qsv-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.qsv-cell__sub {
  fill: var(--qsv-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.qsv-cell.is-top .qsv-cell__box {
  stroke: var(--qsv-ok, #3f6b57);
  stroke-width: 3;
}
.qsv-cell.is-top .qsv-cell__val { fill: var(--qsv-ok, #3f6b57); }
.qsv-cell.is-fresh .qsv-cell__box {
  fill: var(--qsv-gold-fill, #fdf3e3);
  stroke: var(--qsv-gold, #c2872f);
  stroke-width: 3;
}
.qsv-cell.is-fresh .qsv-cell__val { fill: var(--qsv-gold, #c2872f); }
.qsv-cell.is-ghost .qsv-cell__box {
  fill: none;
  stroke: var(--qsv-hot, #a45f45);
  stroke-dasharray: 4 3;
  stroke-width: 2.5;
}
.qsv-cell.is-ghost .qsv-cell__val { fill: var(--qsv-hot, #a45f45); }
.qsv-cell.is-ghost .qsv-cell__sub { fill: var(--qsv-hot, #a45f45); }
.qsv-cell.is-empty .qsv-cell__box {
  fill: none;
  stroke: var(--qsv-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.2;
}
.qsv-cell.is-outq .qsv-cell__box {
  fill: var(--qsv-ok-fill, #eef5f1);
  stroke: var(--qsv-ok, #3f6b57);
  stroke-width: 2;
}
.qsv-cell.is-outq .qsv-cell__val { fill: var(--qsv-ok, #3f6b57); }
.qsv-cell.is-freshq .qsv-cell__box {
  fill: var(--qsv-gold-fill, #fdf3e3);
  stroke: var(--qsv-gold, #c2872f);
  stroke-width: 3;
}
.qsv-cell.is-freshq .qsv-cell__val { fill: var(--qsv-gold, #c2872f); }

.qsv-label {
  fill: var(--qsv-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.qsv-floor {
  stroke: var(--qsv-line, #c3c9c2);
  stroke-width: 2;
}
.qsv-arrow {
  stroke: var(--qsv-hot, #a45f45);
  stroke-width: 2;
  fill: none;
}
.qsv-arrow__head { fill: var(--qsv-hot, #a45f45); stroke: none; }
.qsv-arrow__text {
  fill: var(--qsv-hot, #a45f45);
  font-size: 11.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.qsv-phase__text {
  fill: var(--qsv-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function te(){if(document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=y,document.head.appendChild(e)}function b(a,o={}){if(!a||a.dataset.qstacksMounted===`1`)return{destroy(){}};a.dataset.qstacksMounted=`1`,te();let y=s(o),b=o.autoplay!==!1,x=y[0],S=x.ops,C=r,w=document.createElement(`div`);w.className=`viz qsv`;let T=document.createElement(`div`);T.className=`viz__stage`,w.appendChild(T);let E=Math.max(1,...y.map(e=>e.inn.length)),D=Math.max(1,...y.map(e=>e.out.length)),O=Math.max(1,x.queueOut.length,...y.map(e=>e.queueOut.length)),k=C(`svg`,{class:`viz__svg qsv__svg`,viewBox:`0 0 660 464`,role:`img`,"aria-label":`用栈实现队列 双栈推演动画`});T.appendChild(k);let A=C(`g`,{class:`qsv-cells`}),j=C(`g`,{class:`qsv-marks`});k.appendChild(A),k.appendChild(j);let M=C(`text`,{class:`qsv-note`,x:26,y:l});M.textContent=`两次反转 = 正序：进 in 倒一次，整摞翻进 out 再倒一次 —— out 顶就是队首`,j.appendChild(M),j.appendChild(C(`rect`,{class:`qsv-banner__box`,x:26,y:u,width:608,height:d,rx:9}));let N=C(`text`,{class:`qsv-banner__op`,x:44,y:107}),P=C(`text`,{class:`qsv-banner__ret`,x:616,y:107});j.appendChild(N),j.appendChild(P),j.appendChild(C(`line`,{class:`qsv-floor`,x1:210-m/2-10,y1:f,x2:259,y2:f})),j.appendChild(C(`line`,{class:`qsv-floor`,x1:450-m/2-10,y1:f,x2:499,y2:f}));let F=C(`text`,{class:`qsv-label`,x:210,y:h});F.textContent=`in 栈（进队）`;let I=C(`text`,{class:`qsv-label`,x:450,y:h});I.textContent=`out 栈（出队）`,j.appendChild(F),j.appendChild(I);let L=(e,t)=>{let n=[];for(let r=0;r<=t;r+=1){let t=C(`g`,{class:`qsv-cell`}),i=f-(r+1)*50,a=C(`rect`,{class:`qsv-cell__box`,x:e-m/2,y:i,width:m,height:p,rx:6});t.appendChild(a);let o=C(`text`,{class:`qsv-cell__val`,x:e,y:i+p/2-5});t.appendChild(o);let s=C(`text`,{class:`qsv-cell__sub`,x:e,y:i+p-9});t.appendChild(s),A.appendChild(t),n.push({g:t,val:o,sub:s})}return n},R=L(210,E),z=L(450,D),B=C(`g`,{class:`qsv-transfer`}),V=C(`line`,{class:`qsv-arrow`,x1:0,y1:0,x2:0,y2:0}),H=C(`path`,{class:`qsv-arrow__head`,d:``}),U=C(`text`,{class:`qsv-arrow__text`,x:660/2,y:0});B.appendChild(V),B.appendChild(H),B.appendChild(U),j.appendChild(B);let W=C(`text`,{class:`qsv-label`,x:40,y:392});W.textContent=`出队`,j.appendChild(W);let G=[],K=660/2-(O*54+(O-1)*6)/2;for(let e=0;e<O;e+=1){let t=C(`g`,{class:`qsv-cell`}),n=K+e*60,r=C(`rect`,{class:`qsv-cell__box`,x:n,y:g,width:54,height:_,rx:6});t.appendChild(r);let i=C(`text`,{class:`qsv-cell__val`,x:n+54/2,y:392});t.appendChild(i),A.appendChild(t),G.push({g:t,val:i})}let q=C(`text`,{class:`qsv-phase__text`,x:660/2,y:ee});j.appendChild(q);let J=document.createElement(`p`);J.className=`viz__desc`,J.setAttribute(`aria-live`,`polite`);function Y(e,t,n,r,i,a){e.forEach((e,o)=>{let s=[`qsv-cell`];o<t.length?(e.val.textContent=String(t[o]),e.sub.textContent=o===0?`bottom`:`#${o}`,o===n&&s.push(`is-top`),o===r&&s.push(`is-fresh`)):o===i?(e.val.textContent=a,e.sub.textContent=`弹出`,s.push(`is-ghost`)):(e.val.textContent=``,e.sub.textContent=``,s.push(`is-empty`)),e.g.setAttribute(`class`,s.join(` `))})}function X(t,n){if(!n)return;let r=n.inn,i=n.out,a=n.phase===`transfer`,o=a&&n.moved!==null,s=a&&n.moved===null,c=n.phase===`pop`,l=n.phase===`peek`;if(Y(R,r,r.length-1,n.phase===`push`?r.length-1:-1,o?r.length:-1,o?String(n.moved):``),Y(z,i,i.length-1,o?i.length-1:-1,-1,``),a){let e=o?f-i.length*50+p/2:f-(r.length+1)*50+p/2;V.setAttribute(`x1`,255),V.setAttribute(`y1`,e),V.setAttribute(`x2`,450-m/2-10),V.setAttribute(`y2`,e),H.setAttribute(`d`,`M ${450-m/2-4} ${e} L ${450-m/2-13} ${e-5} L ${450-m/2-13} ${e+5} Z`),U.setAttribute(`y`,e-12),U.textContent=o?`in 顶 → out 顶`:`整摞翻！`,B.style.opacity=`1`}else B.style.opacity=`0`;let u=n.queueOut;G.forEach((e,t)=>{let r=[`qsv-cell`];t<u.length?(e.val.textContent=String(u[t]),r.push(c&&n.result!==null&&t===u.length-1?`is-freshq`:`is-outq`)):(e.val.textContent=``,r.push(`is-empty`)),e.g.setAttribute(`class`,r.join(` `))});let d=n.opIdx===null?null:S[n.opIdx];n.phase===`init`?(N.textContent=`双栈队列：栈 LIFO 翻两次 = FIFO`,P.textContent=``):n.phase===`done`?(N.textContent=`${S.length} 个操作完成 · 共搬运 ${n.transfers} 次`,P.textContent=`[${n.queueOut.join(`,`)}]`):d&&(N.textContent=d.op===`push`?`push(${d.val})`:`${d.op}()`,s?P.textContent=`out 空 → 触发搬运`:o?P.textContent=`翻 ${n.moved}`:c||l?P.textContent=`→ ${n.result}`:P.textContent=``),n.phase===`push`?q.textContent=n.out.length>0?`push 只进 in —— out 还有存货，绝不搬运（旧元素没消费完）`:`push 只进 in，O(1) —— out 空，新元素排在队尾`:s?q.textContent=`out 空了才搬运 —— 且必须整摞翻，搬一半的顺序是坏的`:o?q.textContent=`in 顶弹出、压入 out 顶 —— 每个元素一生最多搬这一次`:c||l?q.textContent=l?`peek 只读 out 顶不弹出 —— 队首就是 out 顶`:`pop 只动 out —— 旧的一摞没消费完，新的一摞绝不插队`:n.phase===`init`?q.textContent=`进 in 倒一次，翻进 out 再倒一次 —— 方向转正`:q.textContent=`出队序列 = 入队序列 —— FIFO 成立；n 次操作 O(n)，均摊 O(1)`,e(J,n.desc)}w.appendChild(J);let Z=i();w.appendChild(Z.root),a.textContent=``,a.appendChild(w),n();let ne=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:y,controls:Z,intervalMs:v,onRender:X});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return b&&!ne&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(w)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.qstacksMounted,document.getElementById(c)?.remove()}}}export{b as mountQueueViaStacks};