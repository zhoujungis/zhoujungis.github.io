import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";function a(e={}){let t=Number.isInteger(e.from)&&e.from>=2?e.from:7,n=t*t;return{from:t,to:Number.isInteger(e.to)&&e.to>=2&&e.to<=n?e.to:10,size:n}}function o(e,t){let n=e*e,r=Math.floor(n/t)*t,i=[];for(let n=0;n<e;n+=1){let a=[];for(let i=0;i<e;i+=1){let o=n*e+i+1,s=o<=r;a.push({value:o,accepted:s,output:s?(o-1)%t+1:null})}i.push(a)}return{size:n,acceptLimit:r,perOutput:r/t,board:i}}function s(e={}){let{from:t,to:n,size:r}=a(e),{acceptLimit:i,perOutput:s,board:c}=o(t,n),l=[],u=(e,a,o)=>{let u=Array(n).fill(0);for(let e=0;e<t;e+=1)for(let n=0;n<t;n+=1){let t=c[e][n];t.output!==null&&t.output<=o&&(u[t.output-1]+=1)}l.push({phase:e,desc:a,from:t,to:n,size:r,acceptLimit:i,perOutput:s,revealed:o,counts:u,done:e===`done`})};u(`init`,`证明的目标：**每个输出 1..${n} 的概率恰好是 1/${n}**。盘面上是 ${t} × ${t} = ${r} 个等概率状态（每个格子是 (a, b) 掷出的一对值，概率都是 1/${r}）。接受区是 1..${i}（绿色底），被拒绝的是 ${i+1}..${r}（灰色）。下面按输出 1..${n} 逐组点亮它们的光源格。`,0);for(let e=1;e<=n;e+=1)u(`reveal`,`输出 \`${e}\` 对应哪些状态？解 \`(v-1) % ${n} + 1 = ${e}\` 且 \`v ≤ ${i}\`：恰好 **${s} 个**（v = ${Array.from({length:s},(t,r)=>e+r*n).join(`, `)}）。点亮它们 —— 记住这个数：**每个输出都是 ${s} 个**，一个不多一个不少。`,e);return u(`done`,`${n} 组全部点亮：接受区共 ${i} 格被**均分**给 ${n} 个输出，每组恰好 ${s} 格；中间 0 格重叠、0 格遗漏。于是给定「接受」：\`P(输出 = k | 接受) = ${s}/${i} = 1/${n}\`，**均匀性得证**。拒绝的 ${r-i} 格（灰色）会触发重掷 —— 重掷与上一轮独立，「第一次落进接受区」的那一轮仍然服从同样的分布，所以拒绝不影响均匀，只影响期望次数。`,n),l}var c=`rand10uniform-styles`,l=28,u=30,d=76,f=40,p=350,m=392,h=40,g=456,_=1150,v=[`#79a892`,`#c2872f`,`#8aa0c0`,`#b08fb0`,`#a4b06a`,`#c08a8a`,`#7fa7a0`,`#c7a76a`,`#9aa3c7`,`#b3a08a`],y=`
.rdp { display: flex; flex-direction: column; gap: 14px; }
.rdp__svg { width: 100%; height: auto; display: block; }

.rdp-note {
  fill: var(--rdp-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rdp-note--r { text-anchor: end; }
.rdp-lbl { fill: var(--rdp-muted, #657168); font-size: 11.5px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.rdp-cell__box { stroke: var(--rdp-line, #d8ded6); stroke-width: 1; }
.rdp-cell--reject .rdp-cell__box { fill: var(--rdp-reject, #e9e6e1); }
.rdp-cell--pending .rdp-cell__box { fill: var(--rdp-pending, #f6f7f4); }
.rdp-cell.is-live .rdp-cell__box { stroke: var(--rdp-gold, #c2872f); stroke-width: 2.5; }
.rdp-cell__num {
  fill: var(--rdp-dim, #b3bbb3); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rdp-cell.is-colored .rdp-cell__num { fill: #ffffff; font-weight: 700; }
.rdp-cell--reject .rdp-cell__num { fill: var(--rdp-dim, #a8b0a8); }
.rdp-idx { fill: var(--rdp-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }

.rdp-legend__box { fill: var(--rdp-fill, #ffffff); stroke: var(--rdp-line, #c3c9c2); stroke-width: 1.5; }
.rdp-legend__box.is-on { stroke-width: 2.5; }
.rdp-legend__t { font-size: 11.5px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.rdp-legend__count { font-size: 11.5px; font-weight: 700; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.rdp-note2 { fill: var(--rdp-muted, #657168); font-size: 12px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.rdp-note2 b { font-weight: 700; fill: var(--rdp-ink, #1f2a24); }

.rdp-banner__box { fill: var(--rdp-banner, #f4f3ef); stroke: var(--rdp-line, #c3c9c2); stroke-width: 1.5; }
.rdp-banner__text { fill: var(--rdp-hot, #a45f45); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.rdp-banner__text.is-ok { fill: var(--rdp-ok, #3f6b57); }

.rdp-phase__text { fill: var(--rdp-muted, #657168); font-size: 13px; font-weight: 600; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
`;function b(){if(document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=y,document.head.appendChild(e)}function x(a,y={}){if(!a||a.dataset.rand10UniformMounted===`1`)return{destroy(){}};a.dataset.rand10UniformMounted=`1`,b();let x=s(y),S=y.autoplay!==!1,{from:C,to:w,size:T,acceptLimit:E,perOutput:D}=x[0],{board:O}=o(C,w),k=r,A=document.createElement(`div`);A.className=`viz rdp`;let j=document.createElement(`div`);j.className=`viz__stage`,A.appendChild(j);let M=k(`svg`,{class:`viz__svg rdp__svg`,viewBox:`0 0 660 478`,role:`img`,"aria-label":`Rand10 均匀性证明推演动画`});j.appendChild(M);let N=k(`g`,{}),P=k(`g`,{});M.append(N,P);let F=k(`text`,{class:`rdp-note`,x:26,y:l});F.textContent=`${T} 格等概率（各 1/${T}）；被接受的 ${E} 格恰好均分给 ${w} 个输出`,P.appendChild(F);let I=k(`text`,{class:`rdp-note rdp-note--r`,x:634,y:l});I.textContent=`每组 ${D} 格`,P.appendChild(I);let L=[];for(let e=0;e<C;e+=1){let t=[];for(let n=0;n<C;n+=1){let r=u+n*44,i=d+e*44,a=k(`g`,{class:`rdp-cell`}),o=k(`rect`,{class:`rdp-cell__box`,x:r,y:i,width:f,height:f,rx:5}),s=k(`text`,{class:`rdp-cell__num`,x:r+f/2,y:i+f/2});s.textContent=String(O[e][n].value),a.append(o,s),N.appendChild(a),t.push({g:a,box:o})}L.push(t)}for(let e=0;e<C;e+=1){let t=k(`text`,{class:`rdp-idx`,x:u+e*44+f/2,y:d-14});t.textContent=String(e+1);let n=k(`text`,{class:`rdp-idx`,x:u-14,y:d+e*44+f/2});n.textContent=String(e+1),P.append(t,n)}let R=k(`text`,{class:`rdp-lbl`,x:p,y:d-14});R.textContent=`每个输出的前像（来源状态）`,P.appendChild(R);let z=Math.ceil(w/2),B=[];for(let e=1;e<=w;e+=1){let t=e%2==1?0:1,n=Math.floor((e-1)/2),r=p+t*150,i=d+n*32,a=k(`g`,{class:`rdp-legend`}),o=k(`rect`,{class:`rdp-legend__box`,x:r,y:i,width:134,height:26,rx:6}),s=k(`text`,{class:`rdp-legend__t`,x:r+12,y:i+26/2}),c=k(`text`,{class:`rdp-legend__count`,x:r+134-12,y:i+26/2,"text-anchor":`end`});a.append(o,s,c),P.appendChild(a),B.push({g:a,box:o,t:s,count:c})}let V=k(`text`,{class:`rdp-note2`,x:p,y:d+z*32+26}),H=k(`text`,{class:`rdp-note2`,x:p,y:d+z*32+50});P.append(V,H),P.appendChild(k(`rect`,{class:`rdp-banner__box`,x:26,y:m,width:608,height:h,rx:9}));let U=k(`text`,{class:`rdp-banner__text`,x:660/2,y:412});P.appendChild(U);let W=k(`text`,{class:`rdp-phase__text`,x:660/2,y:g});P.appendChild(W);let G=document.createElement(`p`);G.className=`viz__desc`,G.setAttribute(`aria-live`,`polite`);function K(t,n){if(!n)return;let r=n.revealed;L.forEach((e,t)=>{e.forEach((e,n)=>{let i=O[t][n],a=[`rdp-cell`];if(!i.accepted){a.push(`rdp-cell--reject`),e.g.setAttribute(`class`,a.join(` `)),e.box.setAttribute(`fill`,``);return}i.output!==null&&i.output<=r?(a.push(`is-colored`),e.box.setAttribute(`fill`,v[(i.output-1)%v.length]),i.output===r&&a.push(`is-live`)):(a.push(`rdp-cell--pending`),e.box.setAttribute(`fill`,``)),e.g.setAttribute(`class`,a.join(` `))})}),B.forEach((e,t)=>{let i=t+1,a=i<=r,o=v[(i-1)%v.length];e.box.setAttribute(`class`,`rdp-legend__box`+(a?` is-on`:``)),e.box.style.fill=a?o:``,e.box.style.stroke=a?o:``,e.t.style.fill=a?`#ffffff`:`#9aa39c`,e.count.style.fill=a?`#ffffff`:`#9aa39c`,e.t.textContent=`输出 ${i}`,e.count.textContent=`×${n.counts[t]}`});let i=n.counts.reduce((e,t)=>e+t,0);V.textContent=`已点亮 ${i}/${E} 格；每组恰好 ${D} 格`,H.textContent=`拒绝 ${T-E} 格 → 重掷，不影响分布`,n.phase===`init`?(U.textContent=`全暗：${T} 个等概率状态，${E} 个会被接受（接下来按输出逐组点亮）`,U.setAttribute(`class`,`rdp-banner__text`)):n.phase===`reveal`?(U.textContent=`点亮输出 ${r} 的 ${D} 个来源状态`,U.setAttribute(`class`,`rdp-banner__text is-ok`)):(U.textContent=`${E} 格 ÷ ${w} 组 = 每组 ${D} 格，零重叠零遗漏 → 均匀性得证`,U.setAttribute(`class`,`rdp-banner__text is-ok`)),n.phase===`init`?W.textContent=`证明的关键：不是「看起来均匀」，而是「每组格子数严格相等」`:n.phase===`reveal`?W.textContent=`解 (v−1) % 10 + 1 = k 且 v ≤ 40 —— 每组恰好 4 个解`:W.textContent=`拒绝只影响期望次数，不影响条件分布：重掷独立同分布`,e(G,n.desc)}A.appendChild(G);let q=i();A.appendChild(q.root),a.textContent=``,a.appendChild(A),n();let J=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Y=t({steps:x,controls:q,intervalMs:_,onRender:K});Y.jumpTo(Math.trunc(y.initialStep)||0);let X=null;return S&&!J&&typeof IntersectionObserver==`function`&&(X=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){X.disconnect(),X=null,Y.play();return}},{threshold:.35}),X.observe(A)),{destroy(){X&&=(X.disconnect(),null),Y.destroy(),a.textContent=``,delete a.dataset.rand10UniformMounted,document.getElementById(c)?.remove()}}}export{x as mountRand10Uniform};