import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[23,7,45,12,45,8,33,12,19,5,45,27,12,9,33,16,41,3],o=10;function s(e){if(!Array.isArray(e)||e.length===0)return a.slice();let t=e.map(e=>Number(e));return t.every(e=>Number.isFinite(e))&&t.length<=24?t:a.slice()}function c(e={}){let t=s(e.nums),n=Number.isInteger(e.k)&&e.k>0&&e.k<=t.length?e.k:Math.min(o,t.length),r=e.dedupe===!0,i=t.length,a=[],c=new Set,l=new Set,u=[],d=[],f={idx:-1,val:null,action:null},p=(e,o)=>{d.push({phase:e,idx:f.idx,val:f.val,action:f.action,heap:a.slice(),siftPath:[],rejected:u.slice(),rejectedCount:u.length,nums:t.slice(),n:i,k:n,dedupe:r,distinct:l.size,solvable:a.length===n,answer:a.length===n?a[0]:null,done:!1,desc:``,...o})},m=e=>{let t=e,n=[t];for(;t>0;){let e=t-1>>1;if(a[e]<=a[t])break;let r=a[e];a[e]=a[t],a[t]=r,t=e,n.push(t)}return n},h=e=>{let t=e,n=[t];for(;;){let e=2*t+1,r=e+1,i=t;if(e<a.length&&a[e]<a[i]&&(i=e),r<a.length&&a[r]<a[i]&&(i=r),i===t)break;let o=a[i];a[i]=a[t],a[t]=o,t=i,n.push(t)}return n};p(`init`,{desc:`${i} 个元素里找第 ${n} 大${r?`（去重口径）`:`（不去重口径）`}。做法是维护一个只有 ${n} 个位置的最小堆：堆顶永远是「当前第 ${n} 大」。比堆顶小的直接丢，比堆顶大的挤掉堆顶再往下调整。`});for(let e=0;e<i;e+=1){let i=t[e];if(f={idx:e,val:i},l.add(i),r&&c.has(i)){f.action=`dup`,u.push(i),p(`reject`,{desc:`${i} 已经在堆里了 —— 去重口径下重复值只算一次，直接丢弃。这也是为什么去重版要额外记一个「堆里有哪些值」的集合：只靠「大于堆顶」判断，会把堆顶换成两个相同的值。`});continue}if(a.length<n){f.action=`fill`,a.push(i),c.add(i);let e=m(a.length-1);p(`fill`,{siftPath:e,desc:`堆还没满（${a.length}/${n}），${i} 直接入堆，向上调整到位置 ${e[e.length-1]}。当前堆顶 = ${a[0]}。`});continue}if(i>a[0]){f.action=`accept`,c.delete(a[0]),c.add(i);let e=a[0];a[0]=i;let t=h(0);p(`accept`,{siftPath:t,desc:`${i} > 堆顶 ${e} —— 挤掉它，${i} 坐到堆顶后向下调整到位置 ${t[t.length-1]}。新堆顶 = ${a[0]}（这就是新的第 ${n} 大）。`});continue}f.action=`reject`,u.push(i),p(`reject`,{desc:`${i} <= 堆顶 ${a[0]} —— 连前 ${n} 大都进不去，直接丢掉，堆不动。`})}let g=a.slice().sort((e,t)=>e-t),_=a.length===n;return p(`done`,{action:null,answer:_?a[0]:null,finalHeap:g,desc:_?`扫完 ${i} 个元素，堆里留下最大的 ${n} 个${r?`（去重后）`:``}：(${g.slice().reverse().join(`, `)})。堆顶 ${a[0]} 就是第 ${n} 大。`+(r?`同一组数据按不去重口径算是另一个数 —— 差别全在口径。`:`改回去重口径，同一组数据的答案会变小 —— 见第二个动画。`)+` 时间 O(n log ${n})、空间 O(${n})。`:`扫完 ${i} 个元素，堆里只有 ${a.length} 个值，凑不齐 ${n} 个${r?`（全体只有 ${l.size} 个不同值）`:``} —— 本题无解，应抛异常。`}),d}var l=`kth-styles`,u=780,d=`
.kth { display: flex; flex-direction: column; gap: 14px; }
.kth__svg { width: 100%; height: auto; display: block; }

.kth-note {
  fill: var(--kth-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.kth-banner__box {
  fill: var(--kth-banner, #f4f3ef);
  stroke: var(--kth-line, #c3c9c2);
  stroke-width: 1.5;
}
.kth-banner__seg {
  fill: var(--kth-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.kth-banner__val {
  fill: var(--kth-gold, #c2872f);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ---- 输入行 ---- */
.kth-cell__box {
  fill: var(--kth-fill, #ffffff);
  stroke: var(--kth-line, #c3c9c2);
  stroke-width: 1.5;
}
.kth-cell__val {
  fill: var(--kth-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 三态互斥，在 JS 里选好，不交给层叠顺序（坑 V） */
.kth-cell.is-ghost .kth-cell__box { fill: none; stroke-dasharray: 3 3; stroke-width: 1.2; }
.kth-cell.is-ghost .kth-cell__val { fill: var(--kth-dim, #9aa39c); }
.kth-cell.is-out .kth-cell__box { fill: var(--kth-dim-fill, #f6f5f1); stroke: var(--kth-dim, #9aa39c); }
.kth-cell.is-out .kth-cell__val { fill: var(--kth-dim, #9aa39c); }
.kth-cell.is-cur .kth-cell__box { stroke: var(--kth-hot, #a45f45); stroke-width: 3; }
.kth-cell.is-cur .kth-cell__val { fill: var(--kth-hot, #a45f45); }
.kth-cell.is-in .kth-cell__box { fill: var(--kth-ok-fill, #eef5f1); stroke: var(--kth-ok, #3f6b57); stroke-width: 2; }
.kth-cell.is-in .kth-cell__val { fill: var(--kth-ok, #3f6b57); }

/* ---- 堆行 ---- */
.kth-heap__box {
  fill: var(--kth-fill, #ffffff);
  stroke: var(--kth-ok, #3f6b57);
  stroke-width: 2;
}
.kth-heap__val {
  fill: var(--kth-ok, #3f6b57);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.kth-heap__idx {
  fill: var(--kth-dim, #9aa39c);
  font-size: 9.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 堆顶 = 当前第 K 大 */
.kth-heap.is-top .kth-heap__box {
  fill: var(--kth-gold-fill, #fdf3e3);
  stroke: var(--kth-gold, #c2872f);
  stroke-width: 3;
}
.kth-heap.is-top .kth-heap__val { fill: var(--kth-gold, #c2872f); }
/* sift 路径 */
.kth-heap.is-sift .kth-heap__box { stroke: var(--kth-hot, #a45f45); stroke-width: 3; }
.kth-heap.is-sift .kth-heap__val { fill: var(--kth-hot, #a45f45); }
.kth-heap.is-ghost .kth-heap__box { fill: none; stroke-dasharray: 3 3; stroke-width: 1.2; }
.kth-heap.is-ghost .kth-heap__val { fill: none; }
.kth-heap.is-ghost .kth-heap__idx { fill: none; }

.kth-label {
  fill: var(--kth-muted, #657168);
  font-size: 12px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.kth-hint {
  fill: var(--kth-muted, #657168);
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.kth-hint.is-hot { fill: var(--kth-hot, #a45f45); }

.kth-ans__box {
  fill: var(--kth-gold-fill, #fdf3e3);
  stroke: var(--kth-gold, #c2872f);
  stroke-width: 2.5;
  opacity: 0;
}
.kth-ans__box.is-on { opacity: 1; }
.kth-ans__box.is-none { fill: var(--kth-dim-fill, #f6f5f1); stroke: var(--kth-dim, #9aa39c); }
.kth-ans__text {
  fill: var(--kth-gold, #c2872f);
  font-size: 15.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.kth-ans__text.is-on { opacity: 1; }
.kth-ans__text.is-none { fill: var(--kth-muted, #657168); }

.kth-phase__text {
  fill: var(--kth-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function f(){if(document.getElementById(l))return;let e=document.createElement(`style`);e.id=l,e.textContent=d,document.head.appendChild(e)}function p(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function m(a,o,s,d){if(!a||a.dataset[d]===`1`)return{destroy(){}};a.dataset[d]=`1`,f();let m=c({...o,dedupe:s}),h=m[0],{n:g,k:_}=h,v=g>16?3:5,y=Math.max(16,Math.min(30,(590-(g-1)*v)/g)),b=(680-(g*y+(g-1)*v))/2,x=e=>b+e*(y+v)+y/2,S=Math.max(24,Math.min(46,(550-(_-1)*6)/_)),C=(680-(_*S+(_-1)*6))/2,w=e=>C+e*(S+6)+S/2,T=r,E=T(`svg`,{class:`viz__svg kth__svg`,viewBox:`0 0 680 384`,role:`img`,"aria-label":`第 K 大 最小堆扫描动画`}),D=T(`g`,{class:`kth-marks`}),O=T(`g`,{class:`kth-cells`});E.appendChild(D),E.appendChild(O);let k=T(`text`,{class:`kth-note`,x:30,y:22});k.textContent=s?`去重口径：distinct 值里第 ${_} 大 —— 重复值只算一次`:`不去重口径：降序排列后第 ${_} 个（下标 ${_-1}）`,D.appendChild(k),D.appendChild(T(`rect`,{class:`kth-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let A=T(`text`,{class:`kth-banner__seg`,x:46,y:58}),j=T(`text`,{class:`kth-banner__seg`,x:196,y:58}),M=T(`text`,{class:`kth-banner__val`,x:634,y:58});D.appendChild(A),D.appendChild(j),D.appendChild(M);let N=T(`text`,{class:`kth-label`,x:b-12,y:143});N.textContent=`输入`,D.appendChild(N);let P=T(`text`,{class:`kth-label`,x:C-12,y:244});P.textContent=`堆`,D.appendChild(P);let F=[];for(let e=0;e<g;e+=1){let t=T(`g`,{class:`kth-cell`});t.appendChild(T(`rect`,{class:`kth-cell__box`,x:x(e)-y/2,y:118,width:y,height:50,rx:5}));let n=T(`text`,{class:`kth-cell__val`,x:x(e),y:143});n.textContent=String(h.nums[e]),t.appendChild(n),O.appendChild(t),F.push({g:t,val:n})}let I=[];for(let e=0;e<_;e+=1){let t=T(`g`,{class:`kth-heap`});t.appendChild(T(`rect`,{class:`kth-heap__box`,x:w(e)-S/2,y:218,width:S,height:52,rx:6}));let n=T(`text`,{class:`kth-heap__val`,x:w(e),y:238}),r=T(`text`,{class:`kth-heap__idx`,x:w(e),y:259});r.textContent=`#${e}`,t.appendChild(n),t.appendChild(r),O.appendChild(t),I.push({g:t,val:n})}let L=T(`text`,{class:`kth-hint`,x:680/2,y:296});D.appendChild(L);let R=T(`rect`,{class:`kth-ans__box`,x:60,y:320,width:560,height:38,rx:10}),z=T(`text`,{class:`kth-ans__text`,x:680/2,y:339});D.appendChild(R),D.appendChild(z);let B=T(`text`,{class:`kth-phase__text`,x:680/2,y:362});D.appendChild(B);let V={fill:`入堆（堆还没满）`,accept:`挤掉堆顶，换它`,reject:`小于堆顶，丢弃`,dup:`重复值，丢弃`};function H(t,n){if(!n)return;let{phase:r,idx:i,val:a,action:o,heap:c,siftPath:l,rejected:u,solvable:d,answer:f}=n,p=r===`done`,m=r===`reject`,v=new Set(l);F.forEach((e,t)=>{let n=[`kth-cell`];t>i?n.push(`is-ghost`):m&&t===i?n.push(`is-out`):t===i&&!p?n.push(`is-cur`):u.includes(h.nums[t])&&t<i?n.push(`is-out`):n.push(`is-in`),e.g.setAttribute(`class`,n.join(` `))}),I.forEach((e,t)=>{let n=[`kth-heap`];t>=c.length?n.push(`is-ghost`):(t===0&&n.push(`is-top`),v.has(t)&&n.push(`is-sift`)),e.g.setAttribute(`class`,n.join(` `)),e.val.textContent=t<c.length?String(c[t]):``}),L.textContent=p?``:`堆顶 = ${c.length?c[0]:`-`}（当前第 ${_} 大） · 已丢弃 ${u.length} 个`,L.setAttribute(`class`,`kth-hint ${r===`accept`?`is-hot`:``}`),R.setAttribute(`class`,`kth-ans__box ${p?d?`is-on`:`is-on is-none`:``}`),z.setAttribute(`class`,`kth-ans__text ${p?d?`is-on`:`is-on is-none`:``}`),z.textContent=p?d?`第 ${_} 大${s?`（去重）`:``} = ${f}`:`只有 ${c.length} 个不同值，凑不齐第 ${_} 大 —— 无解`:``,r===`init`?(A.textContent=`准备`,j.textContent=`size-${_} 最小堆`,M.textContent=`n = ${g}`):p?(A.textContent=`扫完`,j.textContent=d?`堆顶就是答案`:`无解`,M.textContent=d?String(f):`null`):(A.textContent=`第 ${i+1} 个`,j.textContent=V[o]||``,M.textContent=`${a} vs 堆顶 ${c.length>=_?c[0]:`-`}`),B.textContent=p?`每个元素最多进出堆一次：均摊 O(n log ${_})，k 固定时就是 O(n)；空间只用一个 size-${_} 的堆。`:r===`accept`?`大于堆顶才替换 —— 堆里始终是「到目前位置最大的 ${_} 个」，所以扫完堆顶就是第 ${_} 大。`:r===`reject`?`小于等于堆顶，连前 ${_} 大都进不去 —— 这是堆比排序省时间的地方：大部分元素被 O(1) 丢掉。`:`堆没满时直接入堆并向上调整；满了之后才需要比较。`,e(U,n.desc)}let U=p(),W=document.createElement(`div`);W.className=`viz kth`;let G=document.createElement(`div`);G.className=`viz__stage`,G.appendChild(E),W.appendChild(G),W.appendChild(U);let K=i();W.appendChild(K.root),a.textContent=``,a.appendChild(W),n();let q=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,J=t({steps:m,controls:K,intervalMs:u,onRender:H});J.jumpTo(Math.trunc(o.initialStep)||0);let Y=null;return o.autoplay!==!1&&!q&&typeof IntersectionObserver==`function`&&(Y=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){Y.disconnect(),Y=null,J.play();return}},{threshold:.35}),Y.observe(W)),{destroy(){Y&&=(Y.disconnect(),null),J.destroy(),a.textContent=``,delete a.dataset[d],document.getElementById(l)?.remove()}}}function h(e,t={}){return m(e,t,!1,`kthMounted`)}function g(e,t={}){return m(e,t,!0,`kthDupMounted`)}export{h as mountKthLarge,g as mountKthLargeDup};