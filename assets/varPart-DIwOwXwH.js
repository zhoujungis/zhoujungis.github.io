import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[2,8,3,9,4,7];function o(e){if(!Array.isArray(e)||e.length<2)return a.slice();let t=e.map(e=>Number(e));return t.every(e=>Number.isFinite(e))&&t.length>=2&&t.length<=24?t:a.slice()}function s(e){let t=[0],n=[0];for(let r of e)t.push(t[t.length-1]+r),n.push(n[n.length-1]+r*r);return{s1:t,s2:n}}function c(e,t,n,r){let i=r-n;if(i<=0)return{len:0,mean:0,var:0};let a=t.s1[r]-t.s1[n],o=t.s2[r]-t.s2[n];return{len:i,mean:a/i,var:Math.max(0,o/i-a/i*(a/i))}}function l(e){return Number.isInteger(e)?String(e):e.toFixed(2)}function u(e={}){let t=o(e.seq),n=t.length,r=s(t),i=[],a=-1,u=-1/0,d=(e,r,o)=>{i.push({phase:e,i:r,seq:t.slice(),n,meanL:null,varL:null,meanR:null,varR:null,total:null,best:u,bestI:a,answer:null,done:!1,desc:``,...o})},f=c(t,r,0,n);d(`init`,null,{desc:`序列 (${t.join(`, `)})，切成 2 段，使两段方差之和最大。先记住两个工具：一阶前缀和给区间和，二阶前缀和给区间平方和 —— 两者一减，均值与方差都是 O(1)。`});for(let e=1;e<n;e+=1){let i=c(t,r,0,e),o=c(t,r,e,n),s=i.var+o.var;s>u&&(u=s,a=e),d(`scan`,e,{meanL:i.mean,varL:i.var,meanR:o.mean,varR:o.var,total:s,desc:`切点 ${e}：左边 (${t.slice(0,e).join(`, `)}) 均值 ${l(i.mean)}、方差 ${l(i.var)}；右边 (${t.slice(e).join(`, `)}) 均值 ${l(o.mean)}、方差 ${l(o.var)}；合计 ${l(s)}${s===u&&e===a?` —— 目前最优`:``}。`})}return d(`done`,null,{best:u,bestI:a,answer:u,done:!0,desc:`最优切点 = ${a}，两段方差和 = ${l(u)}。对比一下：不切（k = 1）时方差只有 ${l(f.var)} —— **切成两段反而更大**，因为两段的均值（${l(c(t,r,0,a).mean)} 与 ${l(c(t,r,a,n).mean)}）差得远，各自的离散被单独放大了。切成 k 段就是把这个扫描叠 k 层：dp[i][j] = max_{k} dp[k][j-1] + var(k+1..i)。`}),i}var d=`varpart-styles`,f=`
.varpart { display: flex; flex-direction: column; gap: 14px; }
.varpart__svg { width: 100%; height: auto; display: block; }

.varpart-note {
  fill: var(--varpart-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.varpart-banner__box {
  fill: var(--varpart-banner, #f4f3ef);
  stroke: var(--varpart-line, #c3c9c2);
  stroke-width: 1.5;
}
.varpart-banner__seg {
  fill: var(--varpart-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.varpart-banner__val {
  fill: var(--varpart-gold, #c2872f);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.varpart-axis { stroke: var(--varpart-line, #c3c9c2); stroke-width: 1.5; }
.varpart-bar { fill: var(--varpart-dim, #9aa39c); }
.varpart-bar.is-left { fill: var(--varpart-ok, #3f6b57); }
.varpart-bar.is-right { fill: var(--varpart-hot, #a45f45); }
.varpart-bar__val {
  fill: var(--varpart-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.varpart-mean {
  stroke-width: 2.5;
  stroke-dasharray: 6 4;
  opacity: 0;
}
.varpart-mean.is-on { opacity: 1; }
.varpart-mean.is-left { stroke: var(--varpart-ok, #3f6b57); }
.varpart-mean.is-right { stroke: var(--varpart-hot, #a45f45); }
.varpart-mean__label {
  font-size: 11px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
  /* 标签会压在比均值高的柱子上 —— 白描边保证可读 */
  paint-order: stroke;
  stroke: var(--varpart-page, #ffffff);
  stroke-width: 4px;
  stroke-linejoin: round;
}
.varpart-mean__label.is-on { opacity: 1; }
.varpart-mean__label.is-left { fill: var(--varpart-ok, #3f6b57); }
.varpart-mean__label.is-right { fill: var(--varpart-hot, #a45f45); }

.varpart-cut { stroke: var(--varpart-gold, #c2872f); stroke-width: 2.5; stroke-dasharray: 5 4; opacity: 0; }
.varpart-cut.is-on { opacity: 1; }
.varpart-cut__label {
  fill: var(--varpart-gold, #c2872f);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.varpart-cut__label.is-on { opacity: 1; }

.varpart-stat__box {
  fill: var(--varpart-fill, #ffffff);
  stroke: var(--varpart-line, #c3c9c2);
  stroke-width: 1.5;
}
.varpart-stat__text {
  fill: var(--varpart-ink, #1f2a24);
  font-size: 13.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.varpart-stat__text.is-left { fill: var(--varpart-ok, #3f6b57); }
.varpart-stat__text.is-right { fill: var(--varpart-hot, #a45f45); }
.varpart-stat.is-best .varpart-stat__box {
  stroke: var(--varpart-gold, #c2872f);
  stroke-width: 3;
  fill: var(--varpart-gold-fill, #fdf3e3);
}
.varpart-stat.is-best .varpart-stat__text { fill: var(--varpart-gold, #c2872f); }
.varpart-stat.is-off { opacity: 0.35; }

.varpart-phase__text {
  fill: var(--varpart-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function p(){if(document.getElementById(d))return;let e=document.createElement(`style`);e.id=d,e.textContent=f,document.head.appendChild(e)}function m(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function h(a,o={}){if(!a||a.dataset.varpartMounted===`1`)return{destroy(){}};a.dataset.varpartMounted=`1`,p();let s=u(o),{n:c,seq:l}=s[0],f=Math.max(...l.map(e=>Math.abs(e))),h=f===0?1:128/f,g=Math.max(20,Math.min(64,(540-(c-1)*12)/c)),_=c*g+(c-1)*12,v=(680-_)/2,y=e=>v+e*(g+12),b=e=>y(e)+g/2,x=r,S=x(`svg`,{class:`viz__svg varpart__svg`,viewBox:`0 0 680 390`,role:`img`,"aria-label":`序列切分方差和最大 扫描动画`}),C=x(`g`,{class:`varpart-marks`}),w=x(`g`,{class:`varpart-cells`}),T=x(`g`,{class:`varpart-top`});S.appendChild(C),S.appendChild(w),S.appendChild(T);let E=x(`text`,{class:`varpart-note`,x:30,y:22});E.textContent=`切成 2 段使方差和最大：枚举切点，一阶/二阶前缀和 O(1) 算每段方差`,C.appendChild(E),C.appendChild(x(`rect`,{class:`varpart-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let D=x(`text`,{class:`varpart-banner__seg`,x:46,y:58}),O=x(`text`,{class:`varpart-banner__seg`,x:186,y:58}),k=x(`text`,{class:`varpart-banner__val`,x:634,y:58});C.appendChild(D),C.appendChild(O),C.appendChild(k),C.appendChild(x(`line`,{class:`varpart-axis`,x1:v-16,y1:248,x2:v+_+16,y2:248}));let A=[];for(let e=0;e<c;e+=1){let t=Math.max(2,Math.abs(l[e])*h),n=l[e]>=0?248-t:248,r=x(`g`,{});r.appendChild(x(`rect`,{class:`varpart-bar`,x:y(e),y:n,width:g,height:t,rx:3}));let i=x(`text`,{class:`varpart-bar__val`,x:b(e),y:n-11});i.textContent=String(l[e]),r.appendChild(i),w.appendChild(r),A.push({g:r,rect:r.firstChild,val:i})}let j=x(`line`,{class:`varpart-mean is-left`,x1:0,y1:0,x2:0,y2:0}),M=x(`line`,{class:`varpart-mean is-right`,x1:0,y1:0,x2:0,y2:0}),N=e=>{let t=x(`text`,{class:`varpart-mean__label ${e}`,x:0,y:0,fill:`none`,stroke:`#ffffff`,"stroke-width":4,"stroke-linejoin":`round`}),n=x(`text`,{class:`varpart-mean__label ${e}`,x:0,y:0});return T.appendChild(t),T.appendChild(n),{halo:t,text:n}},P=N(`is-left`),F=N(`is-right`),I=x(`line`,{class:`varpart-cut`,x1:0,y1:106,x2:0,y2:248}),L=x(`text`,{class:`varpart-cut__label`,x:0,y:96});C.appendChild(j),C.appendChild(M),C.appendChild(I),C.appendChild(L);let R=(e,t)=>{let n=x(`g`,{class:`varpart-stat ${t}`});n.appendChild(x(`rect`,{class:`varpart-stat__box`,x:e,y:292,width:168,height:42,rx:9}));let r=x(`text`,{class:`varpart-stat__text ${t}`,x:e+168/2,y:313});return n.appendChild(r),C.appendChild(n),{g:n,t:r}},z=R(68,`is-left`),B=R(256,`is-right`),V=R(444,``),H=x(`text`,{class:`varpart-phase__text`,x:680/2,y:368});C.appendChild(H);function U(t,n){if(!n)return;let{phase:r,i}=n,a=r===`done`;if(r===`scan`||a){let e=a?n.bestI:i,t=y(e)-6,r=y(e)+g+6,o=e=>248-e*h,u=a?s[n.bestI].meanL:n.meanL,d=a?s[n.bestI].meanR:n.meanR;A.forEach((t,n)=>{let r=[];n<e?r.push(`is-left`):n>=e&&r.push(`is-right`),t.rect.setAttribute(`class`,`varpart-bar ${r.join(` `)}`)}),j.setAttribute(`x1`,v-8),j.setAttribute(`x2`,t),j.setAttribute(`y1`,o(u)),j.setAttribute(`y2`,o(u)),j.classList.add(`is-on`),M.setAttribute(`x1`,r),M.setAttribute(`x2`,v+_+8),M.setAttribute(`y1`,o(d)),M.setAttribute(`y2`,o(d)),M.classList.add(`is-on`);let f=(e,t)=>{let n=e;for(let r=e;r<t;r+=1)l[r]>l[n]&&(n=r);return n};P.halo.setAttribute(`x`,b(f(0,e))),P.halo.setAttribute(`y`,o(u)-13),P.halo.textContent=`左段均值 ${u.toFixed(2)}`,P.halo.classList.add(`is-on`),P.text.setAttribute(`x`,b(f(0,e))),P.text.setAttribute(`y`,o(u)-13),P.text.textContent=`左段均值 ${u.toFixed(2)}`,P.text.classList.add(`is-on`),F.halo.setAttribute(`x`,b(f(e,c))),F.halo.setAttribute(`y`,o(d)-13),F.halo.textContent=`右段均值 ${d.toFixed(2)}`,F.halo.classList.add(`is-on`),F.text.setAttribute(`x`,b(f(e,c))),F.text.setAttribute(`y`,o(d)-13),F.text.textContent=`右段均值 ${d.toFixed(2)}`,F.text.classList.add(`is-on`),I.setAttribute(`x1`,y(e)-6),I.setAttribute(`x2`,y(e)-6),I.classList.add(`is-on`),L.setAttribute(`x`,y(e)-6),L.textContent=`切点 ${e}`,L.classList.add(`is-on`);let p=a?s[n.bestI].varL:n.varL,m=a?s[n.bestI].varR:n.varR,x=a?n.best:n.total;z.t.textContent=`左段方差 ${p.toFixed(2)}`,B.t.textContent=`右段方差 ${m.toFixed(2)}`,V.t.textContent=`合计 ${x.toFixed(2)}`;let S=a||n.bestI===n.i&&n.total===n.best;V.g.setAttribute(`class`,`varpart-stat ${S?`is-best`:``}`),z.g.setAttribute(`class`,`varpart-stat is-left`),B.g.setAttribute(`class`,`varpart-stat is-right`)}else A.forEach(e=>e.rect.setAttribute(`class`,`varpart-bar`)),j.classList.remove(`is-on`),M.classList.remove(`is-on`),P.halo.classList.remove(`is-on`),P.text.classList.remove(`is-on`),F.halo.classList.remove(`is-on`),F.text.classList.remove(`is-on`),I.classList.remove(`is-on`),L.classList.remove(`is-on`),z.t.textContent=``,B.t.textContent=``,V.t.textContent=``;r===`init`?(D.textContent=`序列`,O.textContent=`切成 2 段`,k.textContent=`(${l.join(`, `)})`):r===`scan`?(D.textContent=`切点 ${i}`,O.textContent=`左 ${n.meanL.toFixed(2)} / 右 ${n.meanR.toFixed(2)}`,k.textContent=`合计 ${n.total.toFixed(2)}`):(D.textContent=`最优切点 ${n.bestI}`,O.textContent=`两段方差和最大`,k.textContent=n.best.toFixed(2)),H.textContent=a?`切成 k 段就是把这个扫描叠 k 层：dp[i][j] = max_{k} dp[k][j-1] + var(k+1..i)，总复杂度 O(n^2 k)。`:`均值线拉得越开、各段内部越散，两段方差和越大 —— 所以最优切点常常不在「看起来最该切」的地方。`,e(W,n.desc)}let W=m(),G=document.createElement(`div`);G.className=`viz varpart`;let K=document.createElement(`div`);K.className=`viz__stage`,K.appendChild(S),G.appendChild(K),G.appendChild(W);let q=i();G.appendChild(q.root),a.textContent=``,a.appendChild(G),n();let J=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Y=t({steps:s,controls:q,intervalMs:900,onRender:U});Y.jumpTo(Math.trunc(o.initialStep)||0);let X=null;return o.autoplay!==!1&&!J&&typeof IntersectionObserver==`function`&&(X=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){X.disconnect(),X=null,Y.play();return}},{threshold:.35}),X.observe(G)),{destroy(){X&&=(X.disconnect(),null),Y.destroy(),a.textContent=``,delete a.dataset.varpartMounted,document.getElementById(d)?.remove()}}}function g(e,t={}){return h(e,t)}export{g as mountVarPart};