import{s as e}from"./widgetChrome-CsVdkvMb.js";var t=[1,2,3,4,5,6,7,8,9,10,11,12,13],n=4;function r(e,t,n){return!Number.isInteger(e)||!Number.isInteger(t)||!Number.isInteger(n)||n<=0||e<t?null:(e-t)%n}function i(e,t){let n=Math.abs(e),r=Math.abs(t);for(;r;)[n,r]=[r,n%r];return n}function a(e={}){let a=Array.isArray(e.values)?e.values.slice():t.slice(),o=a.length,s=Number.isInteger(e.fastStep)&&e.fastStep>=1?e.fastStep:2,c=s-1,l=e.cycleStart===void 0?n:e.cycleStart,u=Number.isInteger(l)&&l>=0&&l<o,d=u?l:null,f=u?o-d:0,p=u?{start:d,length:f}:null,m=[],h=(e,t,n={})=>m.push({phase:e,desc:t,slow:null,fast:null,gap:null,cycle:p?{...p}:null,fastStep:s,closing:c,steps:0,met:!1,done:!1,...n});if(o===0)return h(`end`,"链表是空的，连头节点都没有 —— 不存在环，返回 `false`。",{done:!0}),m;let g=e=>!Number.isInteger(e)||e>=o?null:e+1<o?e+1:u?d:null,_=e=>Number.isInteger(e)&&e>=0&&e<o?String(a[e]):`∅`,v=(e,t)=>{if(!u)return null;let n=r(e,d,f),i=r(t,d,f);return n===null||i===null?null:(n-i+f)%f},y=0,b=0,x=c<=0?`**两个指针速度一样，相对速度是 0** —— 它们会永远保持这个距离，不可能相遇。`:`快指针每步比慢指针多走 ${c} 格 —— 这个相对速度恒定不变，是后面一切的起点。`;if(h(`init`,`慢指针和快指针都站在头节点 ${_(0)}。快指针每步走 **${s} 格**、慢指针走 1 格，`+x,{slow:y,fast:b,steps:0}),c<=0)return h(`end`,`相对速度是 0，两指针永远同步前进，距离不会变 —— 不相遇。所以快指针**至少要走 2 步**，这是「一定相遇」的第一道门槛。`,{slow:y,fast:b,done:!0}),m;let S=2*o+8,C=`cap`;for(let e=1;e<=S;e+=1){let t=b;for(let e=0;e<s&&t!==null;e+=1)t=g(t);if(b=t,y=g(y),y===null&&b===null){C=`fell-off`;break}let n=v(y,b);if(y!==null&&y===b){let t=c===1?`相对速度是 1，所以「快指针沿环前进方向到慢指针的距离」每步**恰好减 1**；它是在模 ${f} 的意义下减 1 的，必然依次经过 ${f-1}、…、1、0 —— 所以**一定相遇**，慢指针进环后最多 ${f-1} 步。`:`相对速度是 ${c}，距离每步减 ${c}；它能减到 0，是因为慢指针进环那一刻的距离恰好是 gcd(${c}, ${f}) = ${i(c,f)} 的倍数。`;return h(`met`,`两者在节点 ${_(y)} **相遇**。走了 ${e} 步，快指针比慢指针多走了 ${e*c} 格，正好是环长 ${f} 的整数倍 —— 这是相遇的代数原因。${t}`,{slow:y,fast:b,gap:n,steps:e,met:!0,done:!0}),m}if(b===null){C=`fell-off`;break}let r;r=n===null?u&&b>=d?`慢指针还在直段（第 ${y+1} 个节点），快指针已经进环了 —— 慢指针没进环之前，两者不可能相遇。`:`两者都还在直段，快指针只是领先慢指针 ${b-y} 格，距离还没有被环长约束住。`:`两者都在环上。快指针沿环前进方向到慢指针还差 **${n} 格**，比上一步少了 ${c} —— 只要相对速度是 1，这个数每步必然减 1。`,h(`move`,`慢指针到 ${_(y)}、快指针到 ${_(b)}。${r}`,{slow:y,fast:b,gap:n,steps:e})}return C===`fell-off`?(h(`end`,`快指针走到了链表末尾（\`fast\` 或 \`fast.next\` 是空）—— **这条链表没有环**，返回 \`false\`。一共走了 ${m.length} 步：没有环时快指针每步走 ${s} 格，最多 n / ${s} 步就出界，所以判环是 O(n) 时间、O(1) 空间。`,{slow:y,fast:b,done:!0}),m):(h(`end`,`走了 ${m.length} 步仍未相遇，已超过步数上限 ${S} —— 这是不该出现的情况，请检查输入（两指针同起点时，任何 fastStep ≥ 2 都必然相遇）。`,{slow:y,fast:b,gap:v(y,b),done:!0}),m)}var o=`cyc-layout-styles`,s=20,c=`
.cyc-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.26s ease, fill 0.26s ease, stroke-width 0.26s ease,
    opacity 0.26s ease;
}
.cyc-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 14px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  transition: opacity 0.26s ease, fill 0.26s ease;
}
.cyc-edge__line { stroke: var(--text-secondary, #657168); stroke-width: 1.6; stroke-linecap: round; }
.cyc-edge__head { fill: var(--text-secondary, #657168); }
.cyc-edge { transition: opacity 0.26s ease; }
.cyc-edge.is-dim { opacity: 0.3; }

.cyc-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.6;
  stroke-dasharray: 4 3;
}
.cyc-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 11px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 入口标记：虚线外框 + 上方一个小标 */
.cyc-entry__box {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.4;
  stroke-dasharray: 5 4;
  opacity: 0.75;
}
.cyc-entry__tag {
  fill: var(--text-secondary, #657168);
  font-size: 10.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}

/* 指针所在节点的高亮。绿 = 慢 / ptr1，橙 = 快 / ptr2，两指针重合时用混合色。
   两个动画语义一致，所以放在共享样式里。 */
.cyc-node.is-slow .cyc-node__box {
  stroke: #2f6f4f;
  stroke-width: 2.6;
  fill: rgba(47, 111, 79, 0.16);
}
.cyc-node.is-fast .cyc-node__box {
  stroke: #b4682c;
  stroke-width: 2.6;
  fill: rgba(180, 104, 44, 0.16);
}
.cyc-node.is-both .cyc-node__box {
  stroke: #8a5a2b;
  stroke-width: 3.2;
  fill: rgba(138, 90, 43, 0.22);
}
.cyc-node.is-both .cyc-node__value { font-weight: 700; }
html.theme-dark .cyc-node.is-slow .cyc-node__box { stroke: #7fc3a4; }
html.theme-dark .cyc-node.is-fast .cyc-node__box { stroke: #e0a06a; }
html.theme-dark .cyc-node.is-both .cyc-node__box { stroke: #e8c08a; }

/* 指针徽标：单字，径向/垂直外移。两个字并排也只有 52 宽，不会压到邻居 */
.cyc-chip { transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.26s ease; }
.cyc-chip__box { rx: 9; ry: 9; }
.cyc-chip__text {
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}
.cyc-chip--slow .cyc-chip__box { fill: #2f6f4f; }
.cyc-chip--slow .cyc-chip__text { fill: #fff; }
.cyc-chip--fast .cyc-chip__box { fill: #b4682c; }
.cyc-chip--fast .cyc-chip__text { fill: #fff; }
.cyc-chip--p1 .cyc-chip__box { fill: #2f6f4f; }
.cyc-chip--p1 .cyc-chip__text { fill: #fff; }
.cyc-chip--p2 .cyc-chip__box { fill: #b4682c; }
.cyc-chip--p2 .cyc-chip__text { fill: #fff; }

@media (prefers-reduced-motion: reduce) {
  .cyc-node__box, .cyc-node__value, .cyc-edge, .cyc-chip { transition: none; }
}
`;function l(){if(document.getElementById(o))return;let e=document.createElement(`style`);e.id=o,e.textContent=c,document.head.appendChild(e)}function u(e){if(!Number.isInteger(e)||e<=1)return 80;let t=68/(2*Math.sin(Math.PI/e));return Math.max(80,Math.round(t))}function d(e,t){return 180+360*e/t}function f(e,t,n,r,i){let a=d(e,t)*Math.PI/180;return{x:n+i*Math.cos(a),y:r+i*Math.sin(a)}}function p(e,t,n=46,r=30){let i=Math.abs(e)<1e-6?1/0:n/2/Math.abs(e),a=Math.abs(t)<1e-6?1/0:r/2/Math.abs(t);return Math.min(i,a)}function m(t,n,{head:r=8,dim:i=!1}={}){let a=n.x-t.x,o=n.y-t.y,s=Math.hypot(a,o)||1,c=a/s,l=o/s,u=p(c,l),d=t.x+c*u,f=t.y+l*u,m=n.x-c*u,h=n.y-l*u,g=e(`g`,{class:i?`cyc-edge is-dim`:`cyc-edge`});g.appendChild(e(`line`,{class:`cyc-edge__line`,x1:d,y1:f,x2:m-c*r,y2:h-l*r}));let _=-l,v=c,y=5.5;return g.appendChild(e(`path`,{class:`cyc-edge__head`,d:`M ${m} ${h} L ${m-c*r+_*y} ${h-l*r+v*y} L ${m-c*r-_*y} ${h-l*r-v*y} Z`})),g}function h(t,n,r,i,a=``){let o=e(`g`,{class:`cyc-node ${a}`.trim()});o.appendChild(e(`rect`,{class:`cyc-node__box`,x:r-46/2,y:i-30/2,width:46,height:30,rx:8}));let s=e(`text`,{class:`cyc-node__value`,x:r,y:i});return s.textContent=String(n),o.appendChild(s),t.appendChild(o),o}function g(t,n,r){let i=e(`g`,{class:`cyc-null`});i.appendChild(e(`circle`,{class:`cyc-null__ring`,cx:n,cy:r,r:15}));let a=e(`text`,{class:`cyc-null__text`,x:n,y:r});return a.textContent=`∅`,i.appendChild(a),t.appendChild(i),i}function _(t,n,r,i){let a=r>n?1:-1,o=e(`g`,{class:`cyc-edge`});return o.appendChild(e(`line`,{class:`cyc-edge__line`,x1:n,y1:i,x2:r-a*8,y2:i})),o.appendChild(e(`path`,{class:`cyc-edge__head`,d:`M ${r} ${i} L ${r-a*8} ${i-5.5} L ${r-a*8} ${i+5.5} Z`})),t.appendChild(o),o}function v(e,t,n=0,r=15){if(!e)return null;let i;if(e.inRing&&e.index!==t.a){let n=e.cx-t.ringCenter.x,r=e.cy-t.ringCenter.y,a=Math.hypot(n,r)||1;i={x:n/a,y:r/a}}else i={x:0,y:1};let a={x:e.cx+i.x*30,y:e.cy+i.y*30};if(!n)return a;let o={x:-i.y,y:i.x};return{x:a.x+o.x*n*r,y:a.y+o.y*n*r}}function y(t,{values:n,cycleStart:r}){let i=Array.isArray(n)?n:[],a=i.length,o=Number.isInteger(r)&&r>=0&&r<a,c=o?r:a,l=o?a-c:0,d=u(l),p=d+30/2+52,v=24+(c>0?(c-1)*70+46+58:0),y=v+46/2+d,b=o?y+d+46/2+46:v+46/2+60,x=o?p+d+30/2+30+20/2+s:p+30/2+30+20/2+s,S=e=>e<c?{x:24+e*70+46/2,y:p}:f(e-c,l,y,p,d),C=[];for(let e=0;e<a-1;e+=1)C.push(m(S(e),S(e+1)));if(o)if(l===1){let t=S(c),n=e(`g`,{class:`cyc-edge`});n.appendChild(e(`path`,{class:`cyc-edge__line`,d:`M ${t.x} ${t.y-30/2} C ${t.x-30} ${t.y-30/2-34}, ${t.x+30} ${t.y-30/2-34}, ${t.x} ${t.y-30/2}`,fill:`none`})),n.appendChild(e(`path`,{class:`cyc-edge__head`,d:`M ${t.x} ${t.y-30/2} L ${t.x-7} ${t.y-30/2-13} L ${t.x+7} ${t.y-30/2-13} Z`})),C.push(n)}else C.push(m(S(a-1),S(c)));for(let e of C)t.appendChild(e);let w=i.map((e,n)=>{let r=S(n);return{g:h(t,e,r.x,r.y),cx:r.x,cy:r.y,index:n,inRing:o&&n>=c,ringK:o&&n>=c?n-c:-1}});if(o&&a>0){let n=S(c),r=e(`g`,{class:`cyc-entry`});r.appendChild(e(`rect`,{class:`cyc-entry__box`,x:n.x-46/2-5,y:n.y-30/2-5,width:56,height:40,rx:11}));let i=e(`text`,{class:`cyc-entry__tag`,x:n.x,y:n.y-30/2-16});i.textContent=`入口`,r.appendChild(i),t.appendChild(r)}let T=null;if(!o&&a>0){let e=S(a-1),n=e.x+46/2+30;_(t,e.x+46/2,n-15,p),g(t,n,p),T={x:n,y:p}}return{a:c,b:l,hasCycle:o,width:b,height:x,rowY:p,ringCenter:{x:y,y:p},radius:d,nullPos:T,nodes:w,ringKOf:e=>o&&e>=c?e-c:-1,at:e=>w[e]}}export{a,d as i,v as n,l as r,y as t};