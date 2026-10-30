import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=10,o=2147483647;function s(e,t,n){let r=t[e-1],i=t[e-2],a=r+i,o=``;return n!==null&&a>n&&(o=` 注意：${a} 已经超过 int32 上限 ${n} —— 从这一阶起，Java 的 int 先于算法爆掉。`),`dp[${e}] = dp[${e-1}] + dp[${e-2}] = ${r} + ${i} = ${a}。前一类以 1 阶收尾、后一类以 2 阶收尾，互斥且完备，所以直接相加。${o}`}function c(e={}){let t=Number.isInteger(e.n)&&e.n>=0?e.n:a,n=e.int32Limit===null||e.int32Limit===void 0?null:Number(e.int32Limit)||o,r=Array(t+1).fill(0);r[0]=1,t>=1&&(r[1]=1);let i=[],c=(e,a,o,s)=>{i.push({phase:e,i:a,from:o,n:t,limit:n,dp:r.slice(),value:null,over:!1,lastOk:null,answer:null,done:!1,desc:``,...s})};c(`init`,null,null,{desc:`dp[0] = 1：站在地面不动也算一种走法 —— 递推的起点；dp[1] = 1：只能迈一步。接下来每一阶的走法数，都只由它前面两阶决定。`});for(let e=2;e<=t;e+=1){c(`from1`,e,e-1,{desc:`到第 ${e} 阶的最后一步是「从第 ${e-1} 阶迈 1 阶」—— 这类走法数恰好等于到第 ${e-1} 阶的走法数：dp[${e-1}] = ${r[e-1]}。`}),c(`from2`,e,e-2,{desc:`另一类最后一步是「从第 ${e-2} 阶迈 2 阶」—— dp[${e-2}] = ${r[e-2]} 种。按最后一步分类：两类互斥（一步不可能既是 1 又是 2）、又覆盖所有可能，可以相加。`}),r[e]=r[e-1]+r[e-2];let t=n!==null&&r[e]>n;c(`settle`,e,null,{value:r[e],over:t,desc:s(e,r,n)})}let l=null;if(n!==null)for(let e=0;e<=t;e+=1)r[e]<=n&&(l=e);return c(`done`,t,null,{value:r[t],answer:r[t],over:n!==null&&r[t]>n,lastOk:l,done:!0,desc:n===null?` 到第 ${t} 阶共有 ${r[t]} 种走法 —— 答案就是 dp[${t}]，它正是斐波那契数。`:` ways(${t}) = ${r[t]}。int32 在第 ${l===null?`-`:l+1} 阶就装不下了，int64 也只能撑到第 91 阶 —— 美团追问「n=80」真正考的是类型，不是算法。`}),i}var l=`climb-styles`,u=`
.climb { display: flex; flex-direction: column; gap: 14px; }
.climb__svg { width: 100%; height: auto; display: block; }

.climb-note {
  fill: var(--climb-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.climb-banner__box {
  fill: var(--climb-banner, #f4f3ef);
  stroke: var(--climb-line, #c3c9c2);
  stroke-width: 1.5;
}
.climb-banner__seg {
  fill: var(--climb-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climb-banner__val {
  fill: var(--climb-gold, #c2872f);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climb-banner__val.is-bad { fill: var(--climb-bad, #b3452e); }

.climb-cell__box {
  fill: var(--climb-fill, #ffffff);
  stroke: var(--climb-line, #c3c9c2);
  stroke-width: 1.5;
}
.climb-cell__val {
  fill: var(--climb-ink, #1f2a24);
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climb-cell__idx {
  fill: var(--climb-dim, #9aa39c);
  font-size: 9.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climb-cell.is-ghost .climb-cell__box { fill: none; stroke-dasharray: 3 3; stroke-width: 1.2; }
.climb-cell.is-ghost .climb-cell__val { fill: none; }
.climb-cell.is-cur .climb-cell__box { stroke: var(--climb-hot, #a45f45); stroke-width: 3; }
.climb-cell.is-fresh .climb-cell__box {
  fill: var(--climb-gold-fill, #fdf3e3);
  stroke: var(--climb-gold, #c2872f);
  stroke-width: 3;
}
.climb-cell.is-fresh .climb-cell__val { fill: var(--climb-gold, #c2872f); }
.climb-cell.is-over .climb-cell__box {
  fill: var(--climb-bad-fill, #f9ece8);
  stroke: var(--climb-bad, #b3452e);
  stroke-width: 2.5;
}
.climb-cell.is-over .climb-cell__val { fill: var(--climb-bad, #b3452e); }

.climb-arc {
  fill: none;
  stroke-width: 2.5;
  opacity: 0;
}
.climb-arc.is-on { opacity: 1; }
.climb-arc.is-one { stroke: var(--climb-ok, #3f6b57); }
.climb-arc.is-two { stroke: var(--climb-hot, #a45f45); }
.climb-arc__label {
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.climb-arc__label.is-on { opacity: 1; }
.climb-arc__label.is-one { fill: var(--climb-ok, #3f6b57); }
.climb-arc__label.is-two { fill: var(--climb-hot, #a45f45); }

.climb-sum {
  fill: var(--climb-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climb-sum.is-hot { fill: var(--climb-gold, #c2872f); }

.climb-limit {
  stroke: var(--climb-bad, #b3452e);
  stroke-width: 2;
  stroke-dasharray: 5 4;
}
.climb-limit__label {
  fill: var(--climb-bad, #b3452e);
  font-size: 12px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climb-readout {
  font-size: 21px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: var(--climb-ok, #3f6b57);
}
.climb-readout.is-bad { fill: var(--climb-bad, #b3452e); }
.climb-readout-sub {
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: var(--climb-muted, #657168);
}
.climb-readout-sub.is-bad { fill: var(--climb-bad, #b3452e); }

.climb-phase__text {
  fill: var(--climb-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function d(){if(document.getElementById(l))return;let e=document.createElement(`style`);e.id=l,e.textContent=u,document.head.appendChild(e)}function f(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function p(e,r,a,o,s,c,u){e.appendChild(a);let d=i();e.appendChild(d.root),r.textContent=``,r.appendChild(e),n();let f=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,p=t({steps:o,controls:d,intervalMs:c.intervalMs||880,onRender:(e,t)=>s(e,t)});p.jumpTo(Math.trunc(c.initialStep)||0);let m=null;return c.autoplay!==!1&&!f&&typeof IntersectionObserver==`function`&&(m=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){m.disconnect(),m=null,p.play();return}},{threshold:.35}),m.observe(e)),{destroy(){m&&=(m.disconnect(),null),p.destroy(),r.textContent=``,delete r.dataset[u],document.getElementById(l)?.remove()}}}function m(t,n){let{n:i}=t[0],a=i+1,o=48;a*o+(a-1)*6>624&&(o=Math.max(22,Math.floor((624-(a-1)*6)/a)));let s=a>12?4:6,c=(680-(a*o+(a-1)*s))/2,l=Math.max(9,Math.min(17,Math.round(o/3.4))),u=o>=34,d=e=>c+e*(o+s)+o/2,f=r,p=f(`svg`,{class:`viz__svg climb__svg`,viewBox:`0 0 680 334`,role:`img`,"aria-label":`爬楼梯 动态规划填表动画`}),m=f(`g`,{class:`climb-marks`}),h=f(`g`,{class:`climb-cells`});p.appendChild(m),p.appendChild(h);let g=f(`text`,{class:`climb-note`,x:30,y:22});g.textContent=`dp[i] = dp[i-1] + dp[i-2] —— 最后一步只有「迈 1 阶」「迈 2 阶」两种来路`,m.appendChild(g),m.appendChild(f(`rect`,{class:`climb-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let _=f(`text`,{class:`climb-banner__seg`,x:46,y:58}),v=f(`text`,{class:`climb-banner__seg`,x:190,y:58}),y=f(`text`,{class:`climb-banner__val`,x:634,y:58});m.appendChild(_),m.appendChild(v),m.appendChild(y);let b=[];for(let e=0;e<=i;e+=1){let t=f(`g`,{class:`climb-cell`});t.appendChild(f(`rect`,{class:`climb-cell__box`,x:d(e)-o/2,y:128,width:o,height:56,rx:6}));let n=f(`text`,{class:`climb-cell__val`,x:d(e),y:u?150:156,style:`font-size: ${l}px`});if(t.appendChild(n),u){let n=f(`text`,{class:`climb-cell__idx`,x:d(e),y:173});n.textContent=`#${e}`,t.appendChild(n)}h.appendChild(t),b.push({g:t,val:n})}let x=(e,t,n,r)=>{let i=f(`path`,{class:`climb-arc ${e}`,d:``}),a=f(`text`,{class:`climb-arc__label ${e}`,x:0,y:0});return a.textContent=t,m.appendChild(i),m.appendChild(a),{path:i,label:a,draw(e,t){let o=d(e),s=d(t);i.setAttribute(`d`,`M ${o} 188 Q ${(o+s)/2} ${188+n*2} ${s} 188`),a.setAttribute(`x`,(o+s)/2),a.setAttribute(`y`,188+n+r)}}},S=x(`is-one`,``,26,8),C=x(`is-two`,``,62,8),w=f(`text`,{class:`climb-sum`,x:680/2,y:280});m.appendChild(w);let T=f(`text`,{class:`climb-phase__text`,x:680/2,y:312});m.appendChild(T);function E(t,r){if(!r)return;let{phase:i,i:a,from:o,dp:s,n:c}=r,l=i===`done`,u=i===`settle`;b.forEach((e,t)=>{let n=[`climb-cell`],r=i===`init`?t<=Math.min(1,c):l?!0:t<=a-1;r||n.push(`is-ghost`),u&&t===a?n.push(`is-fresh`):(i===`from1`||i===`from2`)&&t===a?n.push(`is-cur`):l&&t===c&&n.push(`is-fresh`),i===`from1`&&t===o&&n.push(`is-cur`),i===`from2`&&t===o&&n.push(`is-cur`),e.g.setAttribute(`class`,n.join(` `)),e.val.textContent=r?String(s[t]):``});let d=i===`from1`||i===`from2`||u,f=i===`from2`||u;S.path.classList.toggle(`is-on`,d),S.label.classList.toggle(`is-on`,d),C.path.classList.toggle(`is-on`,f),C.label.classList.toggle(`is-on`,f),d&&(S.draw(a-1,a),S.label.textContent=`迈 1 阶 · 带来 dp[${a-1}] = ${s[a-1]}`),f&&(C.draw(a-2,a),C.label.textContent=`迈 2 阶 · 带来 dp[${a-2}] = ${s[a-2]}`),w.textContent=u||l?`两类互斥且完备 -> 相加：dp[${a}] = ${s[a-1]} + ${s[a-2]} = ${s[a]}`:`按「最后一步的迈法」分类 —— 互斥且完备，所以是加法原理`,w.classList.toggle(`is-hot`,u||l),i===`init`?(_.textContent=`起点`,v.textContent=`dp[0] = 1（不动也算一种）· dp[1] = 1`,y.textContent=``):i===`from1`?(_.textContent=`第 ${a} 阶`,v.textContent=`来路一：从第 `+(a-1)+` 阶迈 1 阶`,y.textContent=`dp[${a-1}] = ${s[a-1]}`):i===`from2`?(_.textContent=`第 ${a} 阶`,v.textContent=`来路二：从第 `+(a-2)+` 阶迈 2 阶`,y.textContent=`dp[${a-2}] = ${s[a-2]}`):u?(_.textContent=`第 ${a} 阶`,v.textContent=`两类相加`,y.textContent=`dp[${a}] = ${s[a]}`):(_.textContent=`${c} 阶楼梯`,v.textContent=`每一阶都只由前两阶决定`,y.textContent=`答案 = ${r.answer}`),T.textContent=l?`dp[n] 就是斐波那契数 —— ways(n) = Fib(n+1)。想知道 O(log n) 的算法，用矩阵快速幂。`:u?`dp[${a}] 定型。注意 dp[i] 之前的值再也不会被用到两次以上 —— 每个格子只算一次。`:`「无后效性」：第 ${a} 阶之后的走法不会改变前面的计数 —— 所以可以从左往右一路填。`,e(n,r.desc)}return{svgRoot:p,paint:E}}function h(t,n){let{n:i,limit:a}=t[0],o=i+1,s=Math.max(5,Math.floor((608-(o-1)*2)/o)),c=(680-(o*s+(o-1)*2))/2,l=e=>c+e*(s+2)+s/2,u=r,d=u(`svg`,{class:`viz__svg climb__svg`,viewBox:`0 0 680 314`,role:`img`,"aria-label":`爬楼梯 int32 溢出演示动画`}),f=u(`g`,{class:`climb-marks`}),p=u(`g`,{class:`climb-cells`});d.appendChild(f),d.appendChild(p);let m=u(`text`,{class:`climb-note`,x:30,y:22});m.textContent=`每一格是一阶楼梯的走法数 —— 颜色 = 这个数装不装得进 int32`,f.appendChild(m),f.appendChild(u(`rect`,{class:`climb-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let h=u(`text`,{class:`climb-banner__seg`,x:46,y:58}),g=u(`text`,{class:`climb-banner__seg`,x:168,y:58}),_=u(`text`,{class:`climb-banner__val`,x:634,y:58});f.appendChild(h),f.appendChild(g),f.appendChild(_);let v=[];for(let e=0;e<=i;e+=1){let t=u(`g`,{class:`climb-cell`});t.appendChild(u(`rect`,{class:`climb-cell__box`,x:l(e)-s/2,y:118,width:s,height:34,rx:2})),p.appendChild(t),v.push({g:t})}let y=t[t.length-1].dp,b=0;for(let e=0;e<=i;e+=1)y[e]<=a&&(b=e);let x=c+(b+1)*(s+2)-2/2;f.appendChild(u(`line`,{class:`climb-limit`,x1:x,y1:106,x2:x,y2:162}));let S=u(`text`,{class:`climb-limit__label`,x:x-8,y:94});S.textContent=`int32 上限 ${a} —— 左边装得下，右边爆`,f.appendChild(S);let C=u(`text`,{class:`climb-readout`,x:680/2,y:208});f.appendChild(C);let w=u(`text`,{class:`climb-readout-sub`,x:680/2,y:240});f.appendChild(w);let T=u(`text`,{class:`climb-phase__text`,x:680/2,y:292});f.appendChild(T);function E(t,r){if(!r)return;let{phase:o,i:s,dp:c}=r,l=o===`done`;v.forEach((e,t)=>{let n=[`climb-cell`];(o===`init`?t<=1:t<=(l?i:s-1))?n.push(c[t]>a?`is-over`:`is-fresh`):n.push(`is-ghost`),e.g.setAttribute(`class`,n.join(` `))});let u=l?i:s,d=c[u],f=d>a;C.textContent=`ways(${u}) = ${d}`,C.setAttribute(`class`,`climb-readout ${f?`is-bad`:``}`),w.textContent=f?`> int32 上限 ${a} —— Java 的 int 在这一阶就已经是负数了`:`<= int32 上限 ${a}，还装得下`,w.setAttribute(`class`,`climb-readout-sub ${f?`is-bad`:``}`),o===`init`?(h.textContent=`起点`,g.textContent=`ways(0)=1 · ways(1)=1`,_.textContent=``):l?(h.textContent=`${i} 阶`,g.textContent=`int64 也只能撑到 ways(91)`,_.textContent=`ways(${i}) = ${d}`):(h.textContent=`第 ${u} 阶`,g.textContent=f?`装不下了`:`还能装下`,_.textContent=`ways(${u}) = ${d}`),_.setAttribute(`class`,`climb-banner__val ${f?`is-bad`:``}`),T.textContent=l?`int64 撑到 ways(91)；ways(92) 就爆 —— JS 的 Number 更早，ways(78) 起丢整数精度。`:`增长是乘性的（约 1.618 倍每阶）—— 类型宽度是线性的，追不上。`,e(n,r.desc)}return{svgRoot:d,paint:E}}function g(e,t,n,r){if(!e||e.dataset[r]===`1`)return{destroy(){}};e.dataset[r]=`1`,d();let i=c(t),a=document.createElement(`div`);a.className=`viz climb`;let o=document.createElement(`div`);o.className=`viz__stage`,a.appendChild(o);let s=f(),l=n===`fill`?m(i,s):h(i,s);return o.appendChild(l.svgRoot),p(a,e,s,i,(e,t)=>l.paint(e,t),t,r)}function _(e,t={}){return g(e,t,`fill`,`climbMounted`)}function v(e,t={}){return g(e,{n:50,int32Limit:2147483647,...t},`overflow`,`climbOverMounted`)}export{_ as mountClimb,v as mountClimbOverflow};