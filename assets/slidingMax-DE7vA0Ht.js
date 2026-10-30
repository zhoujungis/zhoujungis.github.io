import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[1,3,-1,-3,5,3,6,7],o=3;function s(e={}){let t=(Array.isArray(e.nums)?e.nums:a).slice(),n=t.length,r=Number.isInteger(e.k)&&e.k>0?e.k:o,i=[],s=(e,a,o={})=>{i.push({phase:e,desc:a,nums:t,n,k:r,i:null,l:null,r:null,expired:[],dropped:[],dq:[],maxVal:null,ans:[],done:e===`done`,...o})};if(n===0||r>n)return s(`done`,n===0?`数组为空 —— 没有窗口，返回空。`:`窗口大小 \`${r}\` 大于数组长度 \`${n}\` —— 无有效窗口，返回空。`,{done:!0}),i;s(`init`,`给了数组 \`[${t.join(`, `)}]\`（\`${n}\` 个）和窗口大小 \`k = ${r}\`，窗口从左往右滑，要每个窗口的最大值，要求**线性时间**。暴力每窗扫一遍是 \`O(n·k)\`；线性做法的关键是**队列里只留"还有机会当最大值"的候选**，且按值递减 —— 队首恒为当前窗口最大。判据：一个元素右边出现**不小于它**的新元素时，它就被**支配**了（新元素更大、还更晚离开窗口），可以**永久淘汰**。于是每来一个元素只维护两件事：**队尾淘汰（单调性，看值）**与**队首淘汰（出窗，看下标）** —— 队列存的是**下标**，下标才能判断还在不在窗里。`);let c=[],l=[];for(let e=0;e<n;e+=1){let n=Math.max(0,e-r+1),i=t[e],a=[];for(;c.length>0&&c[0]<n;)a.push(c.shift());let o=[];for(;c.length>0&&t[c[c.length-1]]<=i;)o.push(c.pop());c.push(e);let u=[];u.push(`**\`i = ${e}\`，值 \`${i}\`，窗口 \`[${n}, ${e}]\`**：`),a.length>0&&u.push(`队首 \`${a.map(e=>`${e}(${t[e]})`).join(`、`)}\` 已滑出窗口左端 \`${n}\` —— **出队（动作一：看下标）**。`),o.length>0&&u.push(`队尾 \`${o.map(e=>`${e}(${t[e]})`).join(`、`)}\` 都 \`<= ${i}\` —— **被 ${i} 支配，永久淘汰（动作二：看值）**：只要 \`${i}\` 还在窗里，它们永远轮不到当最大。`),a.length===0&&o.length===0&&u.push(`没有元素需要淘汰 —— 队列仍然严格递减、且都在窗内。`),u.push(`入队 \`${e}(${i})\`，队列（值）现在是 \`[${c.map(e=>t[e]).join(`, `)}]\`，队首 \`${c[0]}(${t[c[0]]})\` 就是当前最大的候选。`),s(`slide`,u.join(``),{i:e,l:n,r:e,expired:a,dropped:o,dq:c.slice(),maxVal:t[c[0]],ans:l.slice()}),e>=r-1&&(l.push(t[c[0]]),s(`record`,`窗口 \`[${n}, ${e}]\` 已经装满 \`${r}\` 个 —— **队首 \`${c[0]}(${t[c[0]]})\` 就是这一窗的最大值**，记入答案。（队列严格递减且在窗内，所以队首必然是最大 —— 不需要再扫一遍窗口。）目前答案 \`[${l.join(`, `)}]\`。`,{i:e,l:n,r:e,dq:c.slice(),maxVal:t[c[0]],ans:l.slice()}))}return s(`done`,`\`${n}\` 个元素扫完，答案 \`[${l.join(`, `)}]\`（共 \`${l.length}\` 个窗口）。回头看：每个元素**最多入队一次、出队一次** —— 均摊 \`O(1)\`，总时间 \`O(n)\`，空间 \`O(k)\`（队列最多存 k 个下标）。两个易错点：① 队列存**下标**而不是值（存值判不了"还在不在窗里"）；② 队首出窗要在**读答案之前**处理，否则会拿到早就滑出去的元素。`,{i:n-1,l:n-r,r:n-1,dq:c.slice(),ans:l.slice(),done:!0}),i}var c=`slmax-styles`,l=54,u=84,d=46,ee=156,te=168,ne=46,re=220,ie=250,ae=240,oe=44,se=294,ce=322,le=40,ue=386,f=26,p=604,de=1150,m=`
.slmax {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.slmax__svg { width: 100%; height: auto; display: block; }

.slmax-note {
  fill: var(--slmax-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.slmax-banner__box {
  fill: var(--slmax-banner, #f4f3ef);
  stroke: var(--slmax-line, #c3c9c2);
  stroke-width: 1.5;
}
.slmax-banner__seg {
  fill: var(--slmax-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.slmax-banner__ans {
  fill: var(--slmax-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.slmax-band {
  fill: var(--slmax-band, #e8dcc4);
}
.slmax-band__tag {
  fill: var(--slmax-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.slmax-cell__box {
  fill: var(--slmax-fill, #ffffff);
  stroke: var(--slmax-line, #c3c9c2);
  stroke-width: 1.5;
}
.slmax-cell__val {
  fill: var(--slmax-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.slmax-cell__idx {
  fill: var(--slmax-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.slmax-cell__sub {
  fill: var(--slmax-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 通道一（底色）：窗口内 / 队列内 */
.slmax-cell.is-window .slmax-cell__box { fill: var(--slmax-gold-fill, #fdf3e3); }
.slmax-cell.is-queue .slmax-cell__box { fill: var(--slmax-gold-fill, #fdf3e3); }
/* 通道二（边框）：当前 i / 被支配 / 已出窗 */
.slmax-cell.is-cur .slmax-cell__box {
  stroke: var(--slmax-hot, #a45f45);
  stroke-width: 3;
}
.slmax-cell.is-cur .slmax-cell__val { fill: var(--slmax-hot, #a45f45); }
.slmax-cell.is-dropped .slmax-cell__box {
  stroke: var(--slmax-hot, #a45f45);
  stroke-dasharray: 4 3;
  stroke-width: 2.5;
}
.slmax-cell.is-dropped .slmax-cell__val { fill: var(--slmax-dim, #9aa39c); }
.slmax-cell.is-left .slmax-cell__box {
  stroke: var(--slmax-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.2;
}
.slmax-cell.is-left .slmax-cell__val { fill: var(--slmax-dim, #9aa39c); }
.slmax-cell.is-front .slmax-cell__box {
  stroke: var(--slmax-ok, #3f6b57);
  stroke-width: 3;
}
.slmax-cell.is-front .slmax-cell__val { fill: var(--slmax-ok, #3f6b57); }
.slmax-cell.is-ans .slmax-cell__box {
  fill: var(--slmax-ok-fill, #eef5f1);
  stroke: var(--slmax-ok, #3f6b57);
  stroke-width: 2;
}
.slmax-cell.is-ans .slmax-cell__val { fill: var(--slmax-ok, #3f6b57); }
.slmax-cell.is-fresh .slmax-cell__box {
  fill: var(--slmax-gold-fill, #fdf3e3);
  stroke: var(--slmax-gold, #c2872f);
  stroke-width: 3;
}
.slmax-cell.is-fresh .slmax-cell__val { fill: var(--slmax-gold, #c2872f); }
.slmax-cell.is-ghost .slmax-cell__box {
  fill: none;
  stroke: var(--slmax-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.2;
}
.slmax-cell.is-ghost .slmax-cell__val { fill: var(--slmax-dim, #9aa39c); }

.slmax-label {
  fill: var(--slmax-muted, #657168);
  font-size: 12px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.slmax-front {
  fill: var(--slmax-ok, #3f6b57);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.slmax-phase__text {
  fill: var(--slmax-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function fe(){if(document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=m,document.head.appendChild(e)}function h(a,o={}){if(!a||a.dataset.slmaxMounted===`1`)return{destroy(){}};a.dataset.slmaxMounted=`1`,fe();let m=s(o),h=o.autoplay!==!1,g=m[0],_=g.nums,v=g.n,y=g.k,b=r,x=document.createElement(`div`);x.className=`viz slmax`;let S=document.createElement(`div`);S.className=`viz__stage`,x.appendChild(S);function pe(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(v===0||y>v){let e=b(`svg`,{class:`viz__svg slmax__svg`,viewBox:`0 0 620 120`,role:`img`}),t=b(`text`,{x:310,y:60,style:`fill: var(--slmax-muted, #657168); font-size: 14px; text-anchor: middle;`});return t.textContent=v===0?`数组为空 —— 没有窗口`:`窗口大小 ${y} 大于数组长度 ${v} —— 无有效窗口`,e.appendChild(t),S.appendChild(e),x.appendChild(pe()),x.appendChild(i().root),a.textContent=``,a.appendChild(x),n(),{destroy(){a.textContent=``,delete a.dataset.slmaxMounted,document.getElementById(c)?.remove()}}}let C=Math.max(1,m[m.length-1].ans.length),w=48;Math.max(v,C,y)*w+(Math.max(v,C,y)-1)*8>p&&(w=Math.max(24,Math.floor((p-(Math.max(v,C,y)-1)*8)/Math.max(v,C,y))));let me=v*w+(v-1)*8,he=C*w+(C-1)*8,T=y*w+(y-1)*8,E=Math.max(660,f*2+Math.max(me,he,T)),D=(E-me)/2,O=(E-he)/2,k=(E-T)/2,A=e=>D+e*(w+8)+w/2,j=e=>O+e*(w+8)+w/2,M=e=>k+e*(w+8)+w/2,ge=E-f*2,N=b(`svg`,{class:`viz__svg slmax__svg`,viewBox:`0 0 ${E} 410`,role:`img`,"aria-label":`滑动窗口最大值 单调队列推演动画`});S.appendChild(N);let P=b(`g`,{class:`slmax-bands`}),F=b(`g`,{class:`slmax-cells`}),I=b(`g`,{class:`slmax-marks`});N.appendChild(P),N.appendChild(F),N.appendChild(I);let L=b(`text`,{class:`slmax-note`,x:f,y:l});L.textContent=`单调队列：只留「还有机会当最大值」的候选，按值递减 —— 队首恒为最大`,I.appendChild(L),I.appendChild(b(`rect`,{class:`slmax-banner__box`,x:f,y:u,width:ge,height:d,rx:9}));let R=b(`text`,{class:`slmax-banner__seg`,x:44,y:107}),z=b(`text`,{class:`slmax-banner__seg`,x:176,y:107}),B=b(`text`,{class:`slmax-banner__ans`,x:E-f-18,y:107});I.appendChild(R),I.appendChild(z),I.appendChild(B);let V=[];for(let e=0;e<v;e+=1){let t=b(`g`,{class:`slmax-cell`}),n=b(`rect`,{class:`slmax-cell__box`,x:A(e)-w/2,y:te,width:w,height:ne,rx:6});t.appendChild(n);let r=b(`text`,{class:`slmax-cell__val`,x:A(e),y:191});r.textContent=String(_[e]),t.appendChild(r);let i=b(`text`,{class:`slmax-cell__idx`,x:A(e),y:ee});i.textContent=String(e),I.appendChild(i),F.appendChild(t),V.push({g:t,box:n,val:r})}let H=b(`rect`,{class:`slmax-band`,x:0,y:re,width:0,height:7,rx:3.5});P.appendChild(H);let U=b(`text`,{class:`slmax-band__tag`,x:0,y:238}),W=b(`text`,{class:`slmax-band__tag`,x:0,y:238});I.appendChild(U),I.appendChild(W);let G=b(`text`,{class:`slmax-label`,x:k-14,y:ie});G.textContent=`deque`,I.appendChild(G);let K=[];for(let e=0;e<y;e+=1){let t=b(`g`,{class:`slmax-cell`}),n=b(`rect`,{class:`slmax-cell__box`,x:M(e)-w/2,y:ae,width:w,height:oe,rx:6});t.appendChild(n);let r=b(`text`,{class:`slmax-cell__val`,x:M(e),y:257});t.appendChild(r);let i=b(`text`,{class:`slmax-cell__sub`,x:M(e),y:276});t.appendChild(i),F.appendChild(t),K.push({g:t,box:n,val:r,sub:i})}let q=b(`text`,{class:`slmax-front`,x:0,y:se});q.textContent=`front (max)`,I.appendChild(q);let J=b(`text`,{class:`slmax-label`,x:O-14,y:342});J.textContent=`ans`,I.appendChild(J);let Y=[];for(let e=0;e<C;e+=1){let t=b(`g`,{class:`slmax-cell`}),n=b(`rect`,{class:`slmax-cell__box`,x:j(e)-w/2,y:ce,width:w,height:le,rx:6});t.appendChild(n);let r=b(`text`,{class:`slmax-cell__val`,x:j(e),y:342});t.appendChild(r),F.appendChild(t),Y.push({g:t,box:n,val:r})}let X=b(`text`,{class:`slmax-phase__text`,x:E/2,y:ue});I.appendChild(X);let _e=pe();function ve(t,n){if(!n)return;let r=n.phase===`slide`,i=n.phase===`record`,a=n.phase===`done`,o=n.l??0,s=n.r??(a?v-1:0),c=new Set(n.dropped||[]),l=new Set(n.expired||[]);if(V.forEach((e,t)=>{let u=[`slmax-cell`];t>=o&&t<=s?u.push(`is-window`):o>0&&t<o&&u.push(`is-left`),(r||i)&&(c.has(t)?u.push(`is-dropped`):l.has(t)&&u.push(`is-left`),t===n.i&&!a&&u.push(`is-cur`)),e.g.setAttribute(`class`,u.join(` `))}),s>=o&&s<v){let e=D+o*(w+8),t=D+s*(w+8)+w;H.setAttribute(`x`,e),H.setAttribute(`width`,Math.max(4,t-e)),H.style.opacity=`1`,U.setAttribute(`x`,e+4),U.textContent=`L=${o}`,W.setAttribute(`x`,t-4),W.textContent=`R=${s}`,U.style.opacity=`1`,W.style.opacity=`1`}else H.style.opacity=`0`,U.style.opacity=`0`,W.style.opacity=`0`;let u=n.dq||[];K.forEach((e,t)=>{let n=[`slmax-cell`];if(t<u.length){let r=u[t];e.val.textContent=String(_[r]),e.sub.textContent=`#${r}`,n.push(`is-queue`),t===0&&n.push(`is-front`)}else e.val.textContent=``,e.sub.textContent=``,n.push(`is-ghost`);e.g.setAttribute(`class`,n.join(` `))}),u.length>0?(q.setAttribute(`x`,M(0)),q.style.opacity=`1`):q.style.opacity=`0`;let d=n.ans||[];if(Y.forEach((e,t)=>{let n=[`slmax-cell`];t<d.length?(e.val.textContent=String(d[t]),n.push(i&&t===d.length-1?`is-fresh`:`is-ans`)):(e.val.textContent=``,n.push(`is-ghost`)),e.g.setAttribute(`class`,n.join(` `))}),r||i){R.textContent=`i=${n.i} · 窗口 [${o}, ${s}]`;let e=[];r?(l.size>0&&e.push(`出窗 ${[...n.expired].map(e=>_[e]).join(`,`)}`),c.size>0&&e.push(`被支配 ${[...n.dropped].map(e=>_[e]).join(`,`)}`),e.push(`push ${_[n.i]}`)):e.push(`记录最大值 ${n.maxVal}`),z.textContent=e.join(` · `)}else n.phase===`init`?(R.textContent=`单调队列`,z.textContent=`队列只留还有机会的候选`):(R.textContent=`${v} 个元素扫完`,z.textContent=`${n.ans.length} 个窗口`);if(B.textContent=a?`[${n.ans.join(`,`)}]`:`max=${n.maxVal??`-`}`,r){let e=[];l.size>0&&e.push(`动作一：队首出窗（看下标）`),c.size>0&&e.push(`动作二：队尾被支配（看值）`),X.textContent=e.length>0?`${e.join(` + `)} —— 两个动作一个看下标一个看值，互不干扰`:`队列仍严格递减且都在窗内 —— 无需淘汰`}else i?X.textContent=`队首 ${n.maxVal} 就是这一窗的最大值（队列递减且在窗内，无需再扫）`:n.phase===`init`?X.textContent=`队列存下标 —— 下标才能判断"还在不在窗里"`:X.textContent=`每元素最多入队一次、出队一次 —— 均摊 O(1)，总 O(n) 时间 O(k) 空间`;e(_e,n.desc)}x.appendChild(_e);let Z=i();x.appendChild(Z.root),a.textContent=``,a.appendChild(x),n();let ye=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:m,controls:Z,intervalMs:de,onRender:ve});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return h&&!ye&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(x)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.slmaxMounted,document.getElementById(c)?.remove()}}}export{h as mountSlidingMax};