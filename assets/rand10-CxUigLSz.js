import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[4,7,7,6,1,3,2,5,6,1,5,2];function o(e={}){let t=Number.isInteger(e.from)&&e.from>=2?e.from:7,n=t*t,r=Number.isInteger(e.to)&&e.to>=2&&e.to<=n?e.to:10,i=Array.isArray(e.rolls)?e.rolls:null,o=a;if(i&&i.length>=2){let e=i.filter(e=>Number.isInteger(e)&&e>=1&&e<=t);o=e.length>=2?e:a}return{from:t,to:r,size:n,rolls:o.slice(0,o.length-o.length%2)}}function s(e={}){let{from:t,to:n,size:r,rolls:i}=o(e),a=Math.floor(r/n)*n,s=a/n,c=2*r/a,l=[],u=[],d=0,f=0,p=0,m=(e,i,o={})=>{l.push({phase:e,desc:i,from:t,to:n,size:r,acceptLimit:a,perOutput:s,expect:c,a:null,b:null,cellValue:null,output:null,outputs:[...u],calls:d,rejects:f,attempts:p,done:e===`done`,...o})};m(`init`,`目标：用 \`rand${t}()\` 造出 \`rand${n}()\`。一次只有 ${t} 个等概率状态，凑不出 ${n} 份均分 —— 但**两次独立的 \`rand${t}()\`** 有 ${t} × ${t} = ${r} 个等概率状态（乘积空间）。取 \`v = (a-1) × ${t} + b\` 得到 1..${r} 的均匀整数；${r} 里能整整除 ${n} 的最大块是 ${a} = ${s} × ${n} —— **v ≤ ${a} 接受、v > ${a} 拒绝重掷**（拒绝率 ${r-a}/${r}）。`);for(let e=0;e+1<i.length;e+=2){let o=i[e],c=i[e+1],l=(o-1)*t+c;if(p+=1,d+=2,m(`roll`,`第 ${p} 次尝试：掷出 \`a = ${o}\`、\`b = ${c}\` → \`v = (${o}-1) × ${t} + ${c} = ${l}\`，落在 ${t}×${t} 状态表的第 \`${l}\` 格。${l} 与 ${a} 的大小，决定这次接受还是拒绝。`,{a:o,b:c,cellValue:l}),l<=a){let e=(l-1)%n+1;u.push(e),m(`accept`,`\`v = ${l} ≤ ${a}\`：**接受**，输出 \`(v-1) % ${n} + 1 = ${e}\`。结果均匀的原因：每个输出 1..${n} 恰好对应 ${s} 个状态（${a} = ${s} × ${n}），所有状态等概率，所以给定「接受」时每个输出的条件概率都是 ${s}/${a} = 1/${n}。`,{a:o,b:c,cellValue:l,output:e})}else f+=1,m(`reject`,`\`v = ${l} > ${a}\`：**拒绝**，这次的两个 rand${t}() 作废，**整组重掷**。不要心疼这 ${r-a}/${r} 的浪费 —— 拒绝不破坏均匀性：重掷是独立的，「第一次落进接受区」的那一轮，条件分布依然是均匀的。`,{a:o,b:c,cellValue:l})}return m(`done`,`脚本跑完：输出序列 \`[${u.join(`, `)}]\`，共调用 ${d} 次 rand${t}()（${p} 轮尝试，拒绝 ${f} 次）。理论值：每轮 2 次调用、接受率 ${a}/${r}，**期望调用次数 = 2 × ${r}/${a} = ${c.toFixed(2)} 次**；信息论下界是 log(${n}) / log(${t}) ≈ ${(Math.log(n)/Math.log(t)).toFixed(2)} 次 —— 拒绝法离它还有距离，进阶写法会把被拒绝状态「回收」进下一轮。`),l}var c=`rand10-styles`,l=28,u=30,d=76,f=40,p=350,m=284,h=392,g=40,_=456,v=1150,y=`
.rdv { display: flex; flex-direction: column; gap: 14px; }
.rdv__svg { width: 100%; height: auto; display: block; }

.rdv-note {
  fill: var(--rdv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rdv-note--r { text-anchor: end; }
.rdv-lbl { fill: var(--rdv-muted, #657168); font-size: 11.5px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.rdv-cell__box { stroke: var(--rdv-line, #d8ded6); stroke-width: 1; }
.rdv-cell--accept .rdv-cell__box { fill: var(--rdv-accept, #e7f2ea); }
.rdv-cell--reject .rdv-cell__box { fill: var(--rdv-reject, #f7ece8); }
.rdv-cell.is-hit .rdv-cell__box { stroke: var(--rdv-gold, #c2872f); stroke-width: 3; fill: var(--rdv-hit, #fdf3e3); }
.rdv-cell.is-rejected .rdv-cell__box { stroke: var(--rdv-hot, #a45f45); stroke-width: 3; }
.rdv-cell__num {
  fill: var(--rdv-ink, #4a544c); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rdv-cell.is-hit .rdv-cell__num { fill: var(--rdv-gold, #c2872f); font-weight: 700; }
.rdv-cell.is-rejected .rdv-cell__num { fill: var(--rdv-hot, #a45f45); font-weight: 700; }
.rdv-idx { fill: var(--rdv-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }

.rdv-box { fill: var(--rdv-fill, #ffffff); stroke: var(--rdv-line, #c3c9c2); stroke-width: 1.5; }
.rdv-die__lbl { fill: var(--rdv-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.rdv-die__val {
  fill: var(--rdv-ink, #1f2a24); font-size: 26px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rdv-die__val.is-live { fill: var(--rdv-gold, #c2872f); }

.rdv-formula { fill: var(--rdv-ink, #1f2a24); font-size: 13px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.rdv-verdict { font-size: 15px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.rdv-verdict.is-ok { fill: var(--rdv-ok, #3f6b57); }
.rdv-verdict.is-no { fill: var(--rdv-hot, #a45f45); }
.rdv-verdict.is-idle { fill: var(--rdv-dim, #9aa39c); }

.rdv-chip__box { fill: var(--rdv-fill, #ffffff); stroke: var(--rdv-line, #c3c9c2); stroke-width: 1.5; }
.rdv-chip__val { fill: var(--rdv-ink, #1f2a24); font-size: 12px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.rdv-chip.is-out .rdv-chip__box { fill: var(--rdv-ok-fill, #eef5f1); stroke: var(--rdv-ok, #3f6b57); stroke-width: 2; }
.rdv-chip.is-out .rdv-chip__val { fill: var(--rdv-ok, #3f6b57); }
.rdv-chip.is-latest .rdv-chip__box { fill: var(--rdv-gold-fill, #fdf3e3); stroke: var(--rdv-gold, #c2872f); stroke-width: 2.5; }
.rdv-chip.is-latest .rdv-chip__val { fill: var(--rdv-gold, #c2872f); }

.rdv-count { fill: var(--rdv-muted, #657168); font-size: 12px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.rdv-count b { font-weight: 700; }

.rdv-banner__box { fill: var(--rdv-banner, #f4f3ef); stroke: var(--rdv-line, #c3c9c2); stroke-width: 1.5; }
.rdv-banner__text { fill: var(--rdv-hot, #a45f45); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.rdv-banner__text.is-ok { fill: var(--rdv-ok, #3f6b57); }

.rdv-phase__text { fill: var(--rdv-muted, #657168); font-size: 13px; font-weight: 600; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
`;function b(){if(document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=y,document.head.appendChild(e)}function x(a,o={}){if(!a||a.dataset.rand10Mounted===`1`)return{destroy(){}};a.dataset.rand10Mounted=`1`,b();let y=s(o),x=o.autoplay!==!1,{from:S,to:C,size:w,acceptLimit:T}=y[0],E=r,D=document.createElement(`div`);D.className=`viz rdv`;let O=document.createElement(`div`);O.className=`viz__stage`,D.appendChild(O);let k=E(`svg`,{class:`viz__svg rdv__svg`,viewBox:`0 0 660 478`,role:`img`,"aria-label":`Rand7 实现 Rand10 LC470 拒绝采样推演动画`});O.appendChild(k);let A=E(`g`,{}),j=E(`g`,{});k.append(A,j);let M=E(`text`,{class:`rdv-note`,x:26,y:l});M.textContent=`两次 rand${S}() 凑成 ${w} 个等概率状态：v ≤ ${T} 接受，否则整组重掷`,j.appendChild(M);let N=E(`text`,{class:`rdv-note rdv-note--r`,x:634,y:l});N.textContent=`rand${S}() → rand${C}()`,j.appendChild(N);let P=[];for(let e=0;e<S;e+=1){let t=[];for(let n=0;n<S;n+=1){let r=u+n*44,i=d+e*44,a=e*S+n+1,o=E(`g`,{class:`rdv-cell`});o.appendChild(E(`rect`,{class:`rdv-cell__box`,x:r,y:i,width:f,height:f,rx:5}));let s=E(`text`,{class:`rdv-cell__num`,x:r+f/2,y:i+f/2});s.textContent=String(a),o.appendChild(s),A.appendChild(o),t.push({g:o})}P.push(t)}for(let e=0;e<S;e+=1){let t=u+e*44+f/2,n=d+e*44+f/2,r=E(`text`,{class:`rdv-idx`,x:t,y:d-14});r.textContent=String(e+1);let i=E(`text`,{class:`rdv-idx`,x:u-14,y:n});i.textContent=String(e+1),j.append(r,i)}let F=E(`text`,{class:`rdv-lbl`,x:u-14,y:d-32,"text-anchor":`middle`});F.textContent=`a`;let I=E(`text`,{class:`rdv-lbl`,x:182,y:d-32});I.textContent=`b →`,j.append(F,I),j.appendChild(E(`rect`,{class:`rdv-box`,x:p,y:d,width:134,height:62,rx:9})),j.appendChild(E(`rect`,{class:`rdv-box`,x:500,y:d,width:134,height:62,rx:9}));let L=E(`text`,{class:`rdv-die__lbl`,x:417,y:90});L.textContent=`rand${S}() → a`;let R=E(`text`,{class:`rdv-die__lbl`,x:567,y:90});R.textContent=`rand${S}() → b`;let z=E(`text`,{class:`rdv-die__val`,x:417,y:116}),B=E(`text`,{class:`rdv-die__val`,x:567,y:116});j.append(L,R,z,B),j.appendChild(E(`rect`,{class:`rdv-box`,x:p,y:154,width:m,height:40,rx:8}));let V=E(`text`,{class:`rdv-formula`,x:492,y:174});j.appendChild(V),j.appendChild(E(`rect`,{class:`rdv-box`,x:p,y:204,width:m,height:40,rx:8}));let H=E(`text`,{class:`rdv-verdict is-idle`,x:492,y:224});j.appendChild(H);let U=E(`text`,{class:`rdv-lbl`,x:p,y:272});U.textContent=`rand10() 输出序列`,j.appendChild(U);let W=[];for(let e=0;e<8;e+=1){let t=p+e*40,n=E(`g`,{class:`rdv-chip`});n.appendChild(E(`rect`,{class:`rdv-chip__box`,x:t,y:284,width:34,height:26,rx:6}));let r=E(`text`,{class:`rdv-chip__val`,x:t+34/2,y:297});n.appendChild(r),j.appendChild(n),W.push({g:n,t:r})}let G=E(`text`,{class:`rdv-count`,x:p,y:344});j.appendChild(G),j.appendChild(E(`rect`,{class:`rdv-banner__box`,x:26,y:h,width:608,height:g,rx:9}));let K=E(`text`,{class:`rdv-banner__text`,x:660/2,y:412});j.appendChild(K);let q=E(`text`,{class:`rdv-phase__text`,x:660/2,y:_});j.appendChild(q);let J=document.createElement(`p`);J.className=`viz__desc`,J.setAttribute(`aria-live`,`polite`);function Y(t,n){if(!n)return;let r=n.a===null?-1:n.a-1,i=n.b===null?-1:n.b-1,a=n.cellValue;P.forEach((e,t)=>{e.forEach((e,a)=>{let o=[`rdv-cell`,t*S+a+1<=T?`rdv-cell--accept`:`rdv-cell--reject`];t===r&&a===i&&(o.push(`is-hit`),n.phase===`reject`&&o.push(`is-rejected`)),e.g.setAttribute(`class`,o.join(` `))})}),z.textContent=n.a===null?`—`:String(n.a),B.textContent=n.b===null?`—`:String(n.b),z.setAttribute(`class`,`rdv-die__val`+(n.a===null?``:` is-live`)),B.setAttribute(`class`,`rdv-die__val`+(n.b===null?``:` is-live`)),V.textContent=a===null?`v = (a−1) × ${S} + b`:`v = (${n.a}−1) × ${S} + ${n.b} = ${a}`,n.phase===`accept`?(H.textContent=`v = ${a} ≤ ${T} → 接受`,H.setAttribute(`class`,`rdv-verdict is-ok`)):n.phase===`reject`?(H.textContent=`v = ${a} > ${T} → 拒绝，整组重掷`,H.setAttribute(`class`,`rdv-verdict is-no`)):n.phase===`roll`?(H.textContent=`等定夺…`,H.setAttribute(`class`,`rdv-verdict is-idle`)):(H.textContent=`—`,H.setAttribute(`class`,`rdv-verdict is-idle`));let o=n.outputs.slice(-W.length);W.forEach((e,t)=>{if(t>=o.length){e.g.style.display=`none`;return}e.g.style.display=``,e.t.textContent=String(o[t]);let n=t===o.length-1;e.g.setAttribute(`class`,`rdv-chip is-out`+(n?` is-latest`:``))}),G.textContent=`调用 ${n.calls} 次 · 拒绝 ${n.rejects} 次 · 期望 ${n.expect.toFixed(2)} 次`,n.phase===`init`?(K.textContent=`49 个等概率状态：1..${T} 绿色接受区、${T+1}..${w} 红色拒绝区`,K.setAttribute(`class`,`rdv-banner__text`)):n.phase===`roll`?(K.textContent=`第 ${n.attempts} 次尝试：a = ${n.a}，b = ${n.b}`,K.setAttribute(`class`,`rdv-banner__text`)):n.phase===`accept`?(K.textContent=`接受 → 输出 ${n.output}（(v−1) % ${C} + 1）`,K.setAttribute(`class`,`rdv-banner__text is-ok`)):n.phase===`reject`?(K.textContent=`拒绝 v = ${n.cellValue} —— 不产出，重掷`,K.setAttribute(`class`,`rdv-banner__text`)):(K.textContent=`完成：输出 [${n.outputs.join(`, `)}]，共调用 ${n.calls} 次`,K.setAttribute(`class`,`rdv-banner__text is-ok`)),n.phase===`init`?q.textContent=`一次 rand${S}() 只有 ${S} 个状态，两次独立才有 ${w} 个等概率状态`:n.phase===`roll`?q.textContent=`先算 v = (a−1)×7+b：把二维的 (a,b) 拍平成一维的 1..49`:n.phase===`accept`?q.textContent=`每个输出恰好 4 个来源状态（40 = 4 × 10），所以均匀`:n.phase===`reject`?q.textContent=`拒绝不破坏均匀：重掷独立同分布，条件分布不变`:q.textContent=`期望 = 2 × 49/40 = 2.45 次；信息论下界约 1.18 次`,e(J,n.desc)}D.appendChild(J);let X=i();D.appendChild(X.root),a.textContent=``,a.appendChild(D),n();let Z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:y,controls:X,intervalMs:v,onRender:Y});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return x&&!Z&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(D)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.rand10Mounted,document.getElementById(c)?.remove()}}}export{x as mountRand10};