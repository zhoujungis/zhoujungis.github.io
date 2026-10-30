import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=`abcdef`,o=`abcdxf`;function s(e,t){return typeof e==`string`&&typeof t==`string`&&e.length>0&&t.length>0&&e.length<=8&&t.length<=8&&/^[a-z]+$/.test(e)&&/^[a-z]+$/.test(t)}function c(e={}){let t=s(e.s,e.t)?e.s:a,n=s(e.s,e.t)?e.t:o,r=t.length,i=n.length,c=[],l=(e,a)=>{c.push({phase:e,s:t,t:n,n:r,m:i,i:0,cell:null,filled:0,best:0,done:e===`done`,desc:``,...a})};l(`init`,{desc:`s = ${t}，t = ${n}，各 ${r} 个字符。求允许至多一处不等的最长公共连续子串。表格两行状态：f 是全程相等的干净后缀，g 是至多一处不等的后缀。关键只有一条 —— 不等的时候，g 只能从 f 接过额度再 +1。`});let u=Array.from({length:r+1},()=>Array(i+1).fill(0)),d=Array.from({length:r+1},()=>Array(i+1).fill(0)),f=0;for(let e=1;e<=r;e+=1){for(let r=1;r<=i;r+=1){let i=t[e-1]===n[r-1],a=u[e-1][r-1],o=d[e-1][r-1];i?(u[e][r]=a+1,d[e][r]=o+1):(u[e][r]=0,d[e][r]=Math.max(a+1,1)),d[e][r]>f&&(f=d[e][r])}let r=Math.min(e,i),a=t[e-1]===n[r-1],o=d[e-1][r-1],s={j:r,f:u[e][r],g:d[e][r],fDiag:u[e-1][r-1],gDiag:o,equal:a,rule:a?`s[${e-1}]=${t[e-1]} 与 t[${r-1}]=${n[r-1]} 相等：g = g 左上 + 1 = ${o} + 1 = ${d[e][r]}，不消耗额度`:`s[${e-1}]=${t[e-1]} 与 t[${r-1}]=${n[r-1]} 不等：f 断成 0，g = f 左上 + 1 = ${u[e-1][r-1]} + 1 = ${d[e][r]}`+(o+1===d[e][r]?``:`（若误用 g 左上 + 1 会得到 ${o+1}，虚高）`)};l(`row`,{i:e,cell:s,filled:e,best:f,desc:`第 ${e} 行填完：${Array.from({length:i},(t,n)=>d[e][n+1]).join(`、`)}。`+s.rule})}return l(`done`,{i:r,filled:r,best:f,desc:`扫完整张表，最大的 g 值是 ${f}：${t} 与 ${n} 只有 e/x 这一处不同，所以 6 个字符整体就算一段带 1 处错的公共连续子串。整题 O(n × m) 时间、O(n × m) 空间（滚动数组可压到 O(min(n, m))）。`}),c}var l=`lc1-styles`,u=1300,d=`
.lc1 { display: flex; flex-direction: column; gap: 14px; }
.lc1__svg { width: 100%; height: auto; display: block; }

.lc1-note {
  fill: var(--lc1-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.lc1-banner__box {
  fill: var(--lc1-banner, #f4f3ef);
  stroke: var(--lc1-line, #c3c9c2);
  stroke-width: 1.5;
}
.lc1-banner__seg {
  fill: var(--lc1-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.lc1-banner__val {
  fill: var(--lc1-gold, #c2872f);
  font-size: 16px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ---- 字符条 ---- */
.lc1-ch__box {
  fill: var(--lc1-fill, #ffffff);
  stroke: var(--lc1-line, #c3c9c2);
  stroke-width: 1.3;
}
.lc1-ch__v {
  fill: var(--lc1-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc1-ch.is-s .lc1-ch__box { stroke: var(--lc1-hi, #3d6a8f); }
.lc1-ch.is-s .lc1-ch__v { fill: var(--lc1-hi, #3d6a8f); }
.lc1-ch.is-t .lc1-ch__box { stroke: var(--lc1-low, #3f6b57); }
.lc1-ch.is-t .lc1-ch__v { fill: var(--lc1-low, #3f6b57); }
.lc1-ch.is-cur .lc1-ch__box {
  fill: var(--lc1-cur-fill, #f8ece5);
  stroke: var(--lc1-cur, #a45f45);
  stroke-width: 2.6;
}
.lc1-ch.is-cur .lc1-ch__v { fill: var(--lc1-cur, #a45f45); }
.lc1-slabel {
  fill: var(--lc1-dim, #9aa39c);
  font-size: 11px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ---- DP 表格 ---- */
.lc1-cell__box {
  fill: var(--lc1-fill, #ffffff);
  stroke: var(--lc1-line, #c3c9c2);
  stroke-width: 1.1;
}
.lc1-cell__g {
  fill: var(--lc1-dim, #9aa39c);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc1-cell__f {
  fill: var(--lc1-line, #c3c9c2);
  font-size: 9.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc1-cell.is-filled .lc1-cell__g { fill: var(--lc1-ink, #1f2a24); }
.lc1-cell.is-filled .lc1-cell__f { fill: var(--lc1-muted, #657168); }
/* 顺序即优先级：is-row（当前行浅底） < is-best（最优格绿） < is-cur（讲解格金） */
.lc1-cell.is-row .lc1-cell__box { fill: var(--lc1-banner, #f4f3ef); }
.lc1-cell.is-best .lc1-cell__box {
  fill: var(--lc1-green-fill, #eaf3ee);
  stroke: var(--lc1-green, #3f6b57);
  stroke-width: 1.8;
}
.lc1-cell.is-best .lc1-cell__g { fill: var(--lc1-green, #3f6b57); }
.lc1-cell.is-cur .lc1-cell__box {
  fill: var(--lc1-gold-fill, #fdf3e3);
  stroke: var(--lc1-gold, #c2872f);
  stroke-width: 2.8;
}
.lc1-cell.is-cur .lc1-cell__g { fill: var(--lc1-gold, #c2872f); font-size: 17px; }
.lc1-cell.is-off .lc1-cell__box { stroke-dasharray: 2 3; }

.lc1-head {
  fill: var(--lc1-muted, #657168);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc1-legend {
  fill: var(--lc1-muted, #657168);
  font-size: 11px;
  text-anchor: start;
  dominant-baseline: central;
}

/* ---- 规则面板 ---- */
.lc1-rule__box {
  fill: var(--lc1-fill, #ffffff);
  stroke: var(--lc1-line, #c3c9c2);
  stroke-width: 1.4;
}
.lc1-rule.is-on .lc1-rule__box {
  fill: var(--lc1-gold-fill, #fdf3e3);
  stroke: var(--lc1-gold, #c2872f);
  stroke-width: 2.4;
}
.lc1-rule__head {
  fill: var(--lc1-muted, #657168);
  font-size: 11.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.lc1-rule.is-on .lc1-rule__head { fill: var(--lc1-gold, #c2872f); font-weight: 700; }
.lc1-rule__eq {
  fill: var(--lc1-ink, #1f2a24);
  font-size: 13px;
  text-anchor: start;
  dominant-baseline: central;
}
.lc1-rule__warn {
  fill: var(--lc1-red, #b3452f);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}
.lc1-rule__warn.is-off { opacity: 0; }

.lc1-phasetext {
  fill: var(--lc1-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
`;function f(){if(document.getElementById(l))return;let e=document.createElement(`style`);e.id=l,e.textContent=d,document.head.appendChild(e)}function p(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}var m=680,h=20,g=36,_=40,ee=100,v=26,te=172,y=72,b=32,x=396,S=62,C=484,ne=502;function w(a,o={}){if(!a||a.dataset.lc1Mounted===`1`)return{destroy(){}};a.dataset.lc1Mounted=`1`,f();let s=c(o),{s:d,t:w,n:T,m:E}=s[0],D=r,O=D(`svg`,{class:`viz__svg lc1__svg`,viewBox:`0 0 ${m} ${ne}`,role:`img`,"aria-label":`允许一处错误的最长公共连续子串：双状态 DP 动画`}),k=D(`g`,{class:`lc1-cells`}),A=D(`g`,{class:`lc1-marks`});O.appendChild(k),O.appendChild(A);let j=D(`text`,{class:`lc1-note`,x:30,y:h});j.textContent=`s = ${d} · t = ${w} · 大数字 = g（至多一处不等） · 左上小数字 = f（全程相等）`,A.appendChild(j),A.appendChild(D(`rect`,{class:`lc1-banner__box`,x:30,y:g,width:m-60,height:_,rx:9}));let M=D(`text`,{class:`lc1-banner__seg`,x:46,y:56}),N=D(`text`,{class:`lc1-banner__seg`,x:190,y:56}),P=D(`text`,{class:`lc1-banner__val`,x:m-46,y:56});A.append(M,N,P);let F=(m-y*(E+1))/2,I=e=>F+e*y,L=D(`text`,{class:`lc1-slabel`,x:F-8,y:113});L.textContent=`s`;let R=D(`text`,{class:`lc1-slabel`,x:F-8,y:147});R.textContent=`t`,A.append(L,R);let z=[];for(let e=1;e<=E;e+=1)for(let[t,n,r]of[[0,d,`is-s`],[1,w,`is-t`]]){let i=ee+t*34,a=D(`g`,{class:`lc1-ch ${r}`});a.appendChild(D(`rect`,{class:`lc1-ch__box`,x:I(e)+8,y:i,width:y-16,height:v,rx:6}));let o=D(`text`,{class:`lc1-ch__v`,x:I(e)+y/2,y:i+v/2});o.textContent=n[e-1],a.appendChild(o),k.appendChild(a),z.push({g:a,j:e,row:t})}for(let e=1;e<=E;e+=1){let t=D(`text`,{class:`lc1-head`,x:I(e)+y/2,y:161});t.textContent=`t${e-1}`,A.appendChild(t)}let B=[];for(let e=1;e<=T;e+=1){let t=te+(e-1)*b,n=D(`text`,{class:`lc1-head`,x:F-8,y:t+b/2});n.textContent=`s${e-1}`,A.appendChild(n);for(let n=1;n<=E;n+=1){let r=I(n),i=D(`g`,{class:`lc1-cell is-off`});i.appendChild(D(`rect`,{class:`lc1-cell__box`,x:r,y:t,width:y,height:b,rx:5}));let a=D(`text`,{class:`lc1-cell__g`,x:r+y/2,y:t+b/2+1}),o=D(`text`,{class:`lc1-cell__f`,x:r+5,y:t+10});i.append(a,o),k.appendChild(i),B.push({g:i,gv:a,fv:o,i:e,j:n})}}let V=D(`g`,{class:`lc1-rule`});V.appendChild(D(`rect`,{class:`lc1-rule__box`,x:30,y:x,width:m-60,height:S,rx:9}));let H=D(`text`,{class:`lc1-rule__head`,x:48,y:413}),U=D(`text`,{class:`lc1-rule__eq`,x:48,y:433}),W=D(`text`,{class:`lc1-rule__warn`,x:48,y:449});V.append(H,U,W),k.appendChild(V);let G=D(`text`,{class:`lc1-phasetext`,x:m/2,y:C});A.appendChild(G);let K={init:`「连续」= 子串：对齐时只能沿对角线一格一格走，不能像普通 LCS 那样跳格。`,row:`每格算两遍：f 记干净后缀，g 记至多一处不等的后缀。答案取全表最大的 g。`,done:`答案 = 全表最大的 g。时间 O(n × m)，滚动数组可压到 O(min(n, m)) 空间。`};function q(t,n){if(!n)return;let r=n.phase===`row`?n.cell:null,i=r?n.i:-1,a=r?r.j:-1;z.forEach(({g:e,j:t,row:n})=>{let o=[`lc1-ch`,n===0?`is-s`:`is-t`];r&&(t===a||n===0&&t===i||n===1&&t===a)&&o.push(`is-cur`),e.setAttribute(`class`,o.join(` `))});let o=null;if(n.phase!==`init`){let e=Array.from({length:T+1},()=>Array(E+1).fill(0)),t=Array.from({length:T+1},()=>Array(E+1).fill(0));for(let r=1;r<=Math.min(T,n.filled);r+=1)for(let n=1;n<=E;n+=1)d[r-1]===w[n-1]?(e[r][n]=e[r-1][n-1]+1,t[r][n]=t[r-1][n-1]+1):(e[r][n]=0,t[r][n]=Math.max(e[r-1][n-1]+1,1)),t[r][n]>0&&(!o||t[r][n]>t[o[0]][o[1]])&&(o=[r,n]);B.forEach(({gv:n,fv:r,i,j:a})=>{n.textContent=String(t[i][a]),r.textContent=String(e[i][a])})}if(B.forEach(({g:e,i:t,j:r})=>{let s=t<=n.filled,c=i===t,l=c&&a===r,u=s&&o&&o[0]===t&&o[1]===r,d=[`lc1-cell`];s?(d.push(`is-filled`),c&&d.push(`is-row`),u&&d.push(`is-best`)):d.push(`is-off`),l&&d.push(`is-cur`),e.setAttribute(`class`,d.join(` `))}),r){V.setAttribute(`class`,`lc1-rule is-on`),H.textContent=`第 ${n.i} 行 · 讲解格 (${n.i}, ${r.j})：s[${n.i-1}]=${d[n.i-1]} 对 t[${r.j-1}]=${w[r.j-1]}`,U.textContent=r.equal?`相等 → f = ${r.fDiag} + 1 = ${r.f}，g = g 左上 ${r.gDiag} + 1 = ${r.g}（不消耗额度）`:`不等 → f 断成 0，g = f 左上 ${r.fDiag} + 1 = ${r.g}（额度只能从 f 接）`;let e=!r.equal&&r.gDiag+1!==r.g;W.setAttribute(`class`,`lc1-rule__warn ${e?``:`is-off`}`),W.textContent=e?`若误用 g 左上 + 1 = ${r.gDiag+1}，答案虚高`:``}else V.setAttribute(`class`,`lc1-rule`),H.textContent=n.phase===`done`?`全表扫完：最大 g = ${n.best}`:`转移规则`,U.textContent=n.phase===`done`?`答案取全表最大的 g —— 至多一处不等的最长公共连续子串`:`相等：f/g 都沿对角 +1；不等：f 归 0，g = f 左上 + 1`,W.setAttribute(`class`,`lc1-rule__warn is-off`);n.phase===`init`?(M.textContent=`准备`,N.textContent=`两行状态 f / g`,P.textContent=`${T} × ${E}`):n.phase===`done`?(M.textContent=`扫完整表`,N.textContent=`最大 g`,P.textContent=String(n.best)):(M.textContent=`第 ${n.i} / ${T} 行`,N.textContent=r.equal?`对角续上`:`不等 · 断 f 接 g`,P.textContent=`best ${n.best}`),G.textContent=K[n.phase]||``,e(J,n.desc)}let J=p(),Y=document.createElement(`div`);Y.className=`viz lc1`;let X=document.createElement(`div`);X.className=`viz__stage`,X.appendChild(O),Y.appendChild(X),Y.appendChild(J);let Z=i();Y.appendChild(Z.root),a.textContent=``,a.appendChild(Y),n();let re=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:s,controls:Z,intervalMs:u,onRender:q});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return o.autoplay!==!1&&!re&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(Y)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.lc1Mounted,document.getElementById(l)?.remove()}}}export{w as mountLcs1};