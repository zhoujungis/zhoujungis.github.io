import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=`191191`;function o(e,t){return e.charCodeAt(0)-48+(t.charCodeAt(0)-48)}function s(e,t){let n=[],r=e.map((e,t)=>t),i=null;for(;;){let a=[];for(let t=0;t+1<r.length;t+=1)o(e[r[t]],e[r[t+1]])===10&&a.push(t);let s=a.length===0;if(n.push({alive:r.slice(),removed:i,done:s,steps:n.length}),s)break;let c=t?a[0]:a[a.length-1];i=[r[c],r[c+1]],r=r.filter((e,t)=>t!==c&&t!==c+1)}return n}var c=(e,t)=>t.alive.map(t=>e[t]).join(``);function l(e={}){let t=typeof e.s==`string`?e.s:a,n=Array.from(t),r=n.length,i=s(n,!0),o=s(n,!1),l=[],u=(e,a,s={})=>{l.push({phase:e,desc:a,s:t,chars:n,n:r,turn:null,a:i[0],b:o[0],converged:null,result:null,done:e===`done`,...s})};u(`init`,`同一个串 \`${t}\`，两条路线并排跑：**A 每次消最左边那一对**，**B 每次消最右边那一对**。这两条路线一开始就分道扬镳（可消的对互相重叠 —— 比如开头的 \`191\`，先消左边的 \`1 9\` 还是先消右边的 \`9 1\`，剩下的形态不同）。题面能放心地问"最后剩下的串"，靠的就是两条路线**最后会撞在同一个地方**。`);let d=0,f=0;for(;d<i.length-1||f<o.length-1;){if(d<i.length-1){d+=1;let e=i[d],[t,r]=e.removed;u(`step`,`**路线 A**（消最左）：消掉 \`${n[t]}\`（下标 ${t}）和 \`${n[r]}\`（下标 ${r}）—— \`${n[t]} + ${n[r]} = 10\`。剩下的串是 \`${c(n,e)}\`。注意它出现的**位置**：被消掉的两个字符不在串尾，消完两边立刻接上。`,{turn:`A`,a:e,b:o[f]})}if(f<o.length-1){f+=1;let e=o[f],[t,r]=e.removed;u(`step`,`**路线 B**（消最右）：消掉 \`${n[t]}\`（下标 ${t}）和 \`${n[r]}\`（下标 ${r}）—— \`${n[t]} + ${n[r]} = 10\`。剩下的串是 \`${c(n,e)}\`。同一时刻 A 停在中途形态 \`${c(n,i[d])}\` —— **两条路线的中途形态并不一样**。`,{turn:`B`,a:i[d],b:e})}}let p=i[i.length-1],m=o[o.length-1],h=c(n,p),g=c(n,m),_=h===g;return u(`done`,_?`两条路线都消无可消了：**A 停在 \`${h}\`，B 停在 \`${g}\` —— 完全一样**。A 消了 \`${p.steps}\` 对、B 消了 \`${m.steps}\` 对，次数相同、终点相同。这不是巧合：每一步恰好删 2 个字符（终止），而唯一会互相干扰的形态是临界对 \`a b a\`（\`a + b = 10\`）—— 先消左边那对还是右边那对，剩下的都是 \`a\`。所以"最后剩下的串"没有歧义，"最短剩余长度"就是 \`${h.length}\`，栈模拟给的就是它。`:`两条路线停在了不同的串上：A = \`${h}\`、B = \`${g}\` —— 说明这个规则**不合流**，题目就得改成"求最短"的搜索问题了。`,{turn:null,a:p,b:m,converged:_,result:_?h:null,done:!0}),l}var u=`elimsum10order-styles`,d=28,f=38,p=6,m=150,h=634,g=84,_=192,v=26,y=276,b=52,x=1400,S=`
.evo {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.evo__svg { width: 100%; height: auto; display: block; }

.evo-note {
  fill: var(--evo-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.evo-row__label {
  fill: var(--evo-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.evo-row.is-turn .evo-row__label { fill: var(--evo-gold, #c2872f); }
.evo-row__summary {
  fill: var(--evo-ink, #1f2a24);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.evo-chip__box {
  fill: var(--evo-fill, #ffffff);
  stroke: var(--evo-line, #c3c9c2);
  stroke-width: 1.5;
}
.evo-chip__val {
  fill: var(--evo-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.evo-chip__idx {
  fill: var(--evo-dim, #9aa39c);
  font-size: 9.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 本帧被消掉：红虚线 */
.evo-chip.is-elim .evo-chip__box {
  fill: none;
  stroke: var(--evo-hot, #a45f45);
  stroke-dasharray: 4 3;
  stroke-width: 3;
}
.evo-chip.is-elim .evo-chip__val { fill: var(--evo-hot, #a45f45); }
/* 更早消掉：灰虚线 */
.evo-chip.is-gone .evo-chip__box {
  fill: none;
  stroke: var(--evo-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.5;
}
.evo-chip.is-gone .evo-chip__val { fill: var(--evo-dim, #9aa39c); }
.evo-chip.is-gone { opacity: 0.8; }
/* 终态还活着：绿框 */
.evo-chip.is-end .evo-chip__box {
  fill: var(--evo-ok-fill, #eef4ef);
  stroke: var(--evo-ok, #3f6b57);
  stroke-width: 3;
}
.evo-chip.is-end .evo-chip__val { fill: var(--evo-ok, #3f6b57); }

.evo-card__box {
  fill: var(--evo-banner, #f4f3ef);
  stroke: var(--evo-line, #c3c9c2);
  stroke-width: 1.5;
}
.evo-card__title {
  fill: var(--evo-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.evo-card__value {
  fill: var(--evo-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.evo-card__value.is-ok { fill: var(--evo-ok, #3f6b57); }
.evo-card__value.is-hot { fill: var(--evo-hot, #a45f45); }
`;function C(){if(document.getElementById(u))return;let e=document.createElement(`style`);e.id=u,e.textContent=S,document.head.appendChild(e)}var w=(e,t)=>t.alive.map(t=>e[t]).join(``);function T(a,o={}){if(!a||a.dataset.elimsum10OrderMounted===`1`)return{destroy(){}};a.dataset.elimsum10OrderMounted=`1`,C();let s=l(o),c=o.autoplay!==!1,S=s[0],T=S.chars,E=S.n,D=r,O=document.createElement(`div`);O.className=`viz evo`;let k=document.createElement(`div`);k.className=`viz__stage`,O.appendChild(k);let A=D(`svg`,{class:`viz__svg evo__svg`,viewBox:`0 0 660 344`,role:`img`,"aria-label":`相邻和为 10 消除 两种消法对比动画`});k.appendChild(A);let j=D(`text`,{class:`evo-note`,x:26,y:d});j.textContent=`同一个串、两种消法：A 每次消最左那一对，B 每次消最右那一对`,A.appendChild(j);let M=Math.min(34,Math.floor((h-m-(E-1)*p)/Math.max(1,E))),N=(e,t,n)=>{let r=D(`g`,{class:`evo-row ${n}`}),i=D(`text`,{class:`evo-row__label`,x:v,y:e+f/2});i.textContent=t,r.appendChild(i);let a=[];for(let t=0;t<E;t+=1){let n=D(`g`,{class:`evo-chip`}),i=m+t*(M+p);n.appendChild(D(`rect`,{class:`evo-chip__box`,x:i,y:e,width:M,height:f,rx:5}));let o=D(`text`,{class:`evo-chip__val`,x:i+M/2,y:e+f/2-5});o.textContent=T[t],n.appendChild(o);let s=D(`text`,{class:`evo-chip__idx`,x:i+M/2,y:e+f-9});s.textContent=String(t),n.appendChild(s),r.appendChild(n),a.push(n)}let o=D(`text`,{class:`evo-row__summary`,x:m,y:e+f+18});return r.appendChild(o),A.appendChild(r),{g:r,chips:a,summary:o}},P=N(g,`A 消最左`,`evo-row--a`),F=N(_,`B 消最右`,`evo-row--b`);A.appendChild(D(`rect`,{class:`evo-card__box`,x:26,y,width:608,height:b,rx:9}));let I=D(`text`,{class:`evo-card__title`,x:660/2,y:293}),L=D(`text`,{class:`evo-card__value`,x:660/2,y:313});A.appendChild(I),A.appendChild(L);let R=document.createElement(`p`);R.className=`viz__desc`,R.setAttribute(`aria-live`,`polite`);function z(e,t,n,r,i,a){let o=new Set(t.alive),s=new Set(n&&t.removed||[]);e.chips.forEach((e,t)=>{let n=[`evo-chip`];s.has(t)?n.push(`is-elim`):o.has(t)?i&&a&&n.push(`is-end`):n.push(`is-gone`),e.setAttribute(`class`,n.join(` `))}),e.g.setAttribute(`class`,`evo-row ${e===P?`evo-row--a`:`evo-row--b`}${r?` is-turn`:``}`),e.summary.textContent=`当前串 "${w(T,t)}" · 已消 ${t.steps} 对${t.done?` · 消无可消`:``}`}function B(t,n){if(!n)return;let r=n.phase===`done`,i=n.converged===!0;z(P,n.a,n.turn===`A`,n.turn===`A`,r,i),z(F,n.b,n.turn===`B`,n.turn===`B`,r,i),r?(I.textContent=i?`两条路线的终点`:`两条路线的终点（不相同 —— 规则不合流）`,L.textContent=i?`相同："${n.result}" —— 消除顺序不影响结果`:`A "${w(T,n.a)}" ≠ B "${w(T,n.b)}"`,L.setAttribute(`class`,`evo-card__value ${i?`is-ok`:`is-hot`}`)):(I.textContent=`本帧走的路线`,L.textContent=n.turn===`A`?`A：消最左边那一对`:`B：消最右边那一对`,L.setAttribute(`class`,`evo-card__value`)),e(R,n.desc)}O.appendChild(R);let V=i();O.appendChild(V.root),a.textContent=``,a.appendChild(O),n();let H=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,U=t({steps:s,controls:V,intervalMs:x,onRender:B});U.jumpTo(Math.trunc(o.initialStep)||0);let W=null;return c&&!H&&typeof IntersectionObserver==`function`&&(W=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){W.disconnect(),W=null,U.play();return}},{threshold:.35}),W.observe(O)),{destroy(){W&&=(W.disconnect(),null),U.destroy(),a.textContent=``,delete a.dataset.elimsum10OrderMounted,document.getElementById(u)?.remove()}}}export{T as mountEliminateSum10Order};