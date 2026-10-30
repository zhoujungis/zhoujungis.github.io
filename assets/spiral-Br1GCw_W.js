import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a={rdlu:[`right`,`down`,`left`,`up`],drul:[`down`,`right`,`up`,`left`]},o={right:`向右`,down:`向下`,left:`向左`,up:`向上`};function s(e,t){return Number.isInteger(e)&&e>0&&e<=8?e:t}function c(e={}){let t=s(e.rows,3),n=s(e.cols,3),r=e.mode===`drul`?`drul`:`rdlu`,i=Array.from({length:t},()=>Array(n).fill(0)),c=[],l=t*n,u=0,d=t-1,f=0,p=n-1,m=1,h=(e,a,o,s)=>{c.push({phase:e,mode:r,rows:t,cols:n,grid:i.map(e=>e.slice()),cur:a?{...a}:null,dir:o,value:null,filled:m-1,total:l,bounds:{top:u,bottom:d,left:f,right:p},answer:null,done:!1,desc:``,...s})};h(`init`,null,null,{desc:`${t} x ${n} 的矩阵，从 1 开始按「${a[r].map(e=>o[e]).join(`、`)}」的顺序螺旋填入。每一格填一次，共 ${l} 个数 —— 所以时间下界就是 O(${t} x ${n})。`});let g=(e,t,n,r)=>{i[e][t]=m,h(`fill`,{r:e,c:t},n,{value:m,bounds:r,desc:`第 ${m} 个数填在 (${e}, ${t})，方向${o[n]}。本圈边界：上 ${r.top} / 下 ${r.bottom} / 左 ${r.left} / 右 ${r.right}。`}),m+=1};for(;u<=d&&f<=p;){let e={top:u,bottom:d,left:f,right:p};if(r===`rdlu`){for(let t=f;t<=p;t+=1)g(u,t,`right`,e);u+=1;for(let t=u;t<=d;t+=1)g(t,p,`down`,e);if(--p,u<=d){for(let t=p;t>=f;--t)g(d,t,`left`,e);--d}if(f<=p){for(let t=d;t>=u;--t)g(t,f,`up`,e);f+=1}}else{for(let t=u;t<=d;t+=1)g(t,f,`down`,e);f+=1;for(let t=f;t<=p;t+=1)g(d,t,`right`,e);if(--d,f<=p){for(let t=d;t>=u;--t)g(t,p,`up`,e);--p}if(u<=d){for(let t=p;t>=f;--t)g(u,t,`left`,e);u+=1}}}return h(`done`,null,null,{filled:l,answer:i,done:!0,desc:`填完了。一共 ${l} 格、${l} 次写入，时间 O(${t} x ${n})、额外空间 O(1)（输出数组不算）—— 已经触到下限，因为输出本身就是 ${l} 个数。`}),c}var l=`spiral-styles`,u=760,d=`
.spiral { display: flex; flex-direction: column; gap: 14px; }
.spiral__svg { width: 100%; height: auto; display: block; }

.spiral-note {
  fill: var(--spiral-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.spiral-banner__box {
  fill: var(--spiral-banner, #f4f3ef);
  stroke: var(--spiral-line, #c3c9c2);
  stroke-width: 1.5;
}
.spiral-banner__seg {
  fill: var(--spiral-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.spiral-banner__val {
  fill: var(--spiral-gold, #c2872f);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ---- 网格 ---- */
.spiral-cell__box {
  fill: var(--spiral-fill, #ffffff);
  stroke: var(--spiral-line, #c3c9c2);
  stroke-width: 1.5;
}
.spiral-cell__val {
  fill: var(--spiral-ink, #1f2a24);
  font-size: 20px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.spiral-cell.is-ghost .spiral-cell__box { fill: none; stroke-dasharray: 3 3; stroke-width: 1.2; }
.spiral-cell.is-ghost .spiral-cell__val { fill: none; }
.spiral-cell.is-fresh .spiral-cell__box {
  fill: var(--spiral-gold-fill, #fdf3e3);
  stroke: var(--spiral-gold, #c2872f);
  stroke-width: 3;
}
.spiral-cell.is-fresh .spiral-cell__val { fill: var(--spiral-gold, #c2872f); }
.spiral-cell.is-cur .spiral-cell__box { stroke: var(--spiral-hot, #a45f45); stroke-width: 3.5; }
.spiral-cell.is-cur .spiral-cell__val { fill: var(--spiral-hot, #a45f45); }

/* 本圈边界虚线框 */
.spiral-ring {
  fill: none;
  stroke: var(--spiral-ok, #3f6b57);
  stroke-width: 2;
  stroke-dasharray: 6 4;
  opacity: 0;
}
.spiral-ring.is-on { opacity: 0.85; }

/* 方向箭头 */
.spiral-arrow {
  fill: var(--spiral-hot, #a45f45);
  opacity: 0;
}
.spiral-arrow.is-on { opacity: 1; }

/* ---- 右侧面板 ---- */
.spiral-panel__box {
  fill: var(--spiral-banner, #f4f3ef);
  stroke: var(--spiral-line, #c3c9c2);
  stroke-width: 1.5;
}
.spiral-panel__title {
  fill: var(--spiral-muted, #657168);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.spiral-panel__row {
  fill: var(--spiral-ink, #1f2a24);
  font-size: 13.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.spiral-dir {
  fill: var(--spiral-fill, #ffffff);
  stroke: var(--spiral-line, #c3c9c2);
  stroke-width: 1.5;
}
.spiral-dir__text {
  fill: var(--spiral-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.spiral-dir.is-cur .spiral-dir__box {
  fill: var(--spiral-hot, #a45f45);
  stroke: var(--spiral-hot, #a45f45);
}
.spiral-dir.is-cur .spiral-dir__text { fill: #ffffff; }
.spiral-dir.is-done .spiral-dir__box { fill: var(--spiral-ok-fill, #eef5f1); }
.spiral-dir.is-done .spiral-dir__text { fill: var(--spiral-ok, #3f6b57); }

.spiral-ans__box {
  fill: var(--spiral-ok-fill, #eef5f1);
  stroke: var(--spiral-ok, #3f6b57);
  stroke-width: 2.5;
  opacity: 0;
}
.spiral-ans__box.is-on { opacity: 1; }
.spiral-ans__text {
  fill: var(--spiral-ok, #3f6b57);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.spiral-ans__text.is-on { opacity: 1; }
.spiral-phase__text {
  fill: var(--spiral-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function f(){if(document.getElementById(l))return;let e=document.createElement(`style`);e.id=l,e.textContent=d,document.head.appendChild(e)}function p(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function m(s,d,m,h){if(!s||s.dataset[h]===`1`)return{destroy(){}};s.dataset[h]=`1`,f();let g=c({...d,mode:m}),{rows:_,cols:v}=g[0],y=Math.max(20,Math.min(88,(356-(v-1)*8)/v,(296-(_-1)*8)/_)),ee=v*y+(v-1)*8,b=_*y+(_-1)*8,x=46+Math.max(0,(356-ee)/2),S=112+Math.max(0,(296-b)/2),C=e=>x+e*(y+8)+y/2,w=e=>S+e*(y+8)+y/2,te=S+b,T=Math.max(te,408)+46,E=T+22,D=r,O=D(`svg`,{class:`viz__svg spiral__svg`,viewBox:`0 0 680 ${E}`,role:`img`,"aria-label":`螺旋填数推演动画`}),k=D(`g`,{class:`spiral-rings`}),A=D(`g`,{class:`spiral-cells`}),j=D(`g`,{class:`spiral-top`});O.appendChild(k),O.appendChild(A),O.appendChild(j);let M=D(`text`,{class:`spiral-note`,x:30,y:22});M.textContent=`方向顺序：${a[m].map(e=>o[e]).join(` -> `)}`,j.appendChild(M),j.appendChild(D(`rect`,{class:`spiral-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let N=D(`text`,{class:`spiral-banner__seg`,x:46,y:58}),P=D(`text`,{class:`spiral-banner__seg`,x:176,y:58}),F=D(`text`,{class:`spiral-banner__val`,x:634,y:58});j.appendChild(N),j.appendChild(P),j.appendChild(F);let I=D(`rect`,{class:`spiral-ring`,x:0,y:0,width:0,height:0,rx:6});k.appendChild(I);let L=[];for(let e=0;e<_;e+=1){let t=[];for(let n=0;n<v;n+=1){let r=D(`g`,{class:`spiral-cell`});r.appendChild(D(`rect`,{class:`spiral-cell__box`,x:C(n)-y/2,y:w(e)-y/2,width:y,height:y,rx:6}));let i=D(`text`,{class:`spiral-cell__val`,x:C(n),y:w(e)});r.appendChild(i),A.appendChild(r),t.push({g:r,val:i})}L.push(t)}let R=D(`path`,{class:`spiral-arrow`,d:``});j.appendChild(R);let ne=(e,t)=>{let{r:n,c:r}=t,i=C(r),a=w(n),o=y/2+9,s;s=e===`right`?`${i+o},${a} ${i+o-7},${a-7} ${i+o-7},${a+7}`:e===`left`?`${i-o},${a} ${i-o+7},${a-7} ${i-o+7},${a+7}`:e===`down`?`${i},${a+o} ${i-7},${a+o-7} ${i+7},${a+o-7}`:`${i},${a-o} ${i-7},${a-o+7} ${i+7},${a-o+7}`,R.setAttribute(`d`,`M ${s} Z`),R.classList.add(`is-on`)},re=D(`rect`,{class:`spiral-panel__box`,x:432,y:112,width:218,height:232,rx:10});j.appendChild(re);let z=D(`text`,{class:`spiral-panel__title`,x:446,y:130});z.textContent=`方向序列（本轮循环）`,j.appendChild(z);let B={};a[m].forEach((e,t)=>{let n=446+t%2*94,r=144+Math.floor(t/2)*40,i=D(`g`,{class:`spiral-dir`});i.appendChild(D(`rect`,{class:`spiral-dir__box`,x:n,y:r,width:84,height:30,rx:7}));let a=D(`text`,{class:`spiral-dir__text`,x:n+84/2,y:r+30/2});a.textContent=o[e],i.appendChild(a),j.appendChild(i),B[e]={g:i,t:a}});let V=D(`text`,{class:`spiral-panel__row`,x:446,y:240}),H=D(`text`,{class:`spiral-panel__row`,x:446,y:264}),U=D(`text`,{class:`spiral-panel__row`,x:446,y:288}),W=D(`text`,{class:`spiral-panel__row`,x:446,y:312});j.appendChild(V),j.appendChild(H),j.appendChild(U),j.appendChild(W);let G=D(`rect`,{class:`spiral-ans__box`,x:432,y:358,width:218,height:38,rx:10}),K=D(`text`,{class:`spiral-ans__text`,x:541,y:377});j.appendChild(G),j.appendChild(K);let q=D(`text`,{class:`spiral-phase__text`,x:680/2,y:T});j.appendChild(q);function ie(t,n){if(!n)return;let{phase:r,cur:i,dir:a,grid:s,bounds:c,filled:l,total:u}=n,d=r===`done`,f=r===`fill`;if(L.forEach((e,t)=>{e.forEach((e,n)=>{let r=[`spiral-cell`];s[t][n]===0?r.push(`is-ghost`):f&&i&&i.r===t&&i.c===n&&r.push(`is-cur`),e.g.setAttribute(`class`,r.join(` `)),e.val.textContent=s[t][n]===0?``:String(s[t][n])})}),f||r===`init`){let e=c;e.top<=e.bottom&&e.left<=e.right&&(I.classList.add(`is-on`),I.setAttribute(`x`,C(e.left)-y/2-5),I.setAttribute(`y`,w(e.top)-y/2-5),I.setAttribute(`width`,(e.right-e.left)*(y+8)+y+10),I.setAttribute(`height`,(e.bottom-e.top)*(y+8)+y+10))}else I.classList.remove(`is-on`);f&&a?ne(a,i):R.classList.remove(`is-on`);for(let e of Object.keys(B)){let t=[`spiral-dir`];f&&e===a?t.push(`is-cur`):d&&t.push(`is-done`),B[e].g.setAttribute(`class`,t.join(` `))}V.textContent=f?`方向：${o[a]}`:`方向：待开始`,H.textContent=`已填 ${l} / ${u}`,U.textContent=`上 ${c.top}  下 ${c.bottom}`,W.textContent=`左 ${c.left}  右 ${c.right}`,K.textContent=d?`完成：${u} 格全部填满`:``,G.setAttribute(`class`,`spiral-ans__box ${d?`is-on`:``}`),K.setAttribute(`class`,`spiral-ans__text ${d?`is-on`:``}`),r===`init`?(N.textContent=`开局`,P.textContent=`${_} x ${v} 矩阵，从 1 开始`,F.textContent=`方向序列见右`):f?(N.textContent=`第 ${n.value} 个数`,P.textContent=`填在 (${i.r}, ${i.c}) · ${o[a]}`,F.textContent=`${l} / ${u}`):(N.textContent=`填完`,P.textContent=`${u} 次写入，无重复无遗漏`,F.textContent=`O(${_} x ${v})`),q.textContent=d?`四边界收缩：每圈走完把对应边界内推一格；第三、四条边的守卫是防非方阵重复的关键。`:f?`当前格 (${i.r}, ${i.c})。撞到未填区域的边缘就按方向序列转向 —— 四个方向循环一轮就是一圈。`:`每一格只填一次，所以 O(M x N) 就是下限；边界收缩法额外空间 O(1)。`,e(J,n.desc)}let J=p(),Y=document.createElement(`div`);Y.className=`viz spiral`;let X=document.createElement(`div`);X.className=`viz__stage`,X.appendChild(O),Y.appendChild(X),Y.appendChild(J);let Z=i();Y.appendChild(Z.root),s.textContent=``,s.appendChild(Y),n();let ae=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:g,controls:Z,intervalMs:u,onRender:ie});Q.jumpTo(Math.trunc(d.initialStep)||0);let $=null;return d.autoplay!==!1&&!ae&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(Y)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),s.textContent=``,delete s.dataset[h],document.getElementById(l)?.remove()}}}function h(e,t={}){return m(e,t,`rdlu`,`spiralMounted`)}function g(e,t={}){return m(e,t,`drul`,`spiralCcwMounted`)}export{h as mountSpiral,g as mountSpiralCcw};