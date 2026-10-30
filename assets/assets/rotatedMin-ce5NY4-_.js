import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[4,5,6,7,0,1,2];function o(e={}){let t=(Array.isArray(e.nums)?e.nums:a).slice(),n=t.length,r=[],i=(e,n,i={})=>{r.push({phase:e,desc:n,nums:t,l:null,r:null,live:null,mid:null,midVal:null,rightVal:null,cmp:null,minIdx:null,done:e===`done`,...i})};if(n===0)return i(`done`,`输入是空的，没有最小值。`),r;i(`init`,`旋转数组 \`[${t.join(`, `)}]\`：把一段递增数组从中间切开、两段换个位置 —— 它因此变成**两段各自上升的折线，中间一道断崖**，最小值就站在断崖右侧那段的起点上。二分的每一步只问一个问题：**\`nums[mid]\` 和 \`nums[r]\` 谁大？** \`nums[mid] > nums[r]\` 说明 mid 站在断崖左边（第一段上），最小值在它右边；\`nums[mid] < nums[r]\` 说明 mid 已经在第二段上，最小值在 \`[l, mid]\` 里 —— mid 自己可能就是答案，所以左边界的收缩是 \`r = mid\` 而不是 \`r = mid - 1\`。`);let o=0,s=n-1,c=0;for(;o<s&&c<100;){c+=1;let e=o,n=s,r=Math.floor((e+n)/2),a=t[r],l=t[n];a>l?(o=r+1,i(`probe`,`\`mid = ${r}\`，\`nums[${r}] = ${a} > nums[${n}] = ${l}\` —— mid 站在**断崖左边的第一段**上（它比末尾还大，说明它右边一定跨过了断崖、有更小的数），最小值在 \`[${r+1}, ${n}]\`，mid 自己被淘汰 → \`l = ${r+1}\`。`,{l:e,r:n,live:[o,s],mid:r,midVal:a,rightVal:l,cmp:`>`})):(s=r,i(`probe`,`\`mid = ${r}\`，\`nums[${r}] = ${a} < nums[${n}] = ${l}\` —— mid 已经站在**断崖右边的第二段**上（或者断崖就是 mid 本身），最小值在 \`[${e}, ${r}]\` 里。注意 **mid 可能就是最小值，不能丢** → \`r = ${r}\`（不是 mid-1）。`,{l:e,r:n,live:[o,s],mid:r,midVal:a,rightVal:l,cmp:`<`}))}let l=o;return i(`done`,o===s?`\`l\` 和 \`r\` 相遇在下标 \`${o}\` —— **最小值 = \`nums[${o}] = ${t[o]}\`**。回头看这趟：每一步只用一次比较，就把一半的候选**确定性地**淘汰掉，\`O(log n)\`。数组没旋转时同样成立：mid 永远 < right，一直往左缩，最后停在 nums[0] —— 退化成"找头"，但复杂度不变。`:`异常退出（步数上限），正常输入不会走到这里。`,{l:o,r:s,live:[o,s],mid:o,midVal:t[o],rightVal:t[s],minIdx:l,cmp:null}),r}var s=`rmin-styles`,c=54,l=84,u=46,d=158,f=178,p=130,m=26,h=604,g=1250,_=`
.rmin {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.rmin__svg { width: 100%; height: auto; display: block; }

.rmin-note {
  fill: var(--rmin-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rmin-banner__box {
  fill: var(--rmin-banner, #f4f3ef);
  stroke: var(--rmin-line, #c3c9c2);
  stroke-width: 1.5;
}
.rmin-banner__seg {
  fill: var(--rmin-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rmin-banner__ans {
  fill: var(--rmin-gold, #c2872f);
  font-size: 18px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rmin-cell__box {
  fill: var(--rmin-fill, #ffffff);
  stroke: var(--rmin-line, #c3c9c2);
  stroke-width: 1.5;
}
.rmin-cell__val {
  fill: var(--rmin-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rmin-cell__idx {
  fill: var(--rmin-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 存活区外的柱子灰化 */
.rmin-cell.is-out .rmin-cell__box {
  fill: var(--rmin-dim-fill, #f0efea);
  stroke-dasharray: 4 3;
}
.rmin-cell.is-out .rmin-cell__val { fill: var(--rmin-dim, #b9b9b3); }
/* mid 比较基准的柱子给个淡金底 */
.rmin-cell.is-base .rmin-cell__box { fill: var(--rmin-gold-fill, #fdf3e3); }

/* 指针 */
.rmin-pin--l { fill: var(--rmin-ok, #3f6b57); }
.rmin-pin--m { fill: var(--rmin-hot, #a45f45); }
.rmin-pin--r { fill: var(--rmin-cmp, #5a7ea6); }
.rmin-pin__tag { fill: inherit; }
.rmin-pin__text {
  fill: var(--rmin-paper, #ffffff);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 最小值金环 */
.rmin-min__ring {
  fill: none;
  stroke: var(--rmin-gold, #c2872f);
  stroke-width: 3;
}
.rmin-min__text {
  fill: var(--rmin-gold, #c2872f);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rmin-empty__text {
  fill: var(--rmin-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function v(){if(document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=_,document.head.appendChild(e)}function y(a,_={}){if(!a||a.dataset.rminMounted===`1`)return{destroy(){}};a.dataset.rminMounted=`1`,v();let y=o(_),b=_.autoplay!==!1,x=y[0].nums,S=x.length,C=r,w=document.createElement(`div`);w.className=`viz rmin`;let T=document.createElement(`div`);T.className=`viz__stage`,w.appendChild(T);function E(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(S===0){let e=C(`svg`,{class:`viz__svg rmin__svg`,viewBox:`0 0 620 120`,role:`img`}),t=C(`text`,{class:`rmin-empty__text`,x:310,y:60});return t.textContent=`空输入 —— 没有最小值`,e.appendChild(t),T.appendChild(e),w.appendChild(E()),w.appendChild(i().root),a.textContent=``,a.appendChild(w),n(),{destroy(){a.textContent=``,delete a.dataset.rminMounted,document.getElementById(s)?.remove()}}}let D=58;S*D+(S-1)*6>h&&(D=Math.max(20,Math.floor((h-(S-1)*6)/S)));let O=S*D+(S-1)*6,k=Math.max(660,m*2+O),A=(k-O)/2,j=e=>A+e*(D+6)+D/2,M=p/Math.max(...x),N=e=>Math.max(14,e*M),P=k-m*2,F=C(`svg`,{class:`viz__svg rmin__svg`,viewBox:`0 0 ${k} 372`,role:`img`,"aria-label":`寻找旋转排序数组中的最小值 推演动画`});T.appendChild(F);let I=C(`g`,{class:`rmin-cells`}),L=C(`g`,{class:`rmin-marks`});F.appendChild(I),F.appendChild(L);let R=C(`text`,{class:`rmin-note`,x:m,y:c});R.textContent=`只问一句：nums[mid] 和 nums[right] 谁大 —— 断崖在哪边，最小值就在哪边`,L.appendChild(R),L.appendChild(C(`rect`,{class:`rmin-banner__box`,x:m,y:l,width:P,height:u,rx:9}));let z=C(`text`,{class:`rmin-banner__seg`,x:44,y:107}),B=C(`text`,{class:`rmin-banner__seg`,x:256,y:107}),V=C(`text`,{class:`rmin-banner__ans`,x:k-m-18,y:107});L.appendChild(z),L.appendChild(B),L.appendChild(V);let H=[];for(let e=0;e<S;e+=1){let t=C(`g`,{class:`rmin-cell`}),n=N(x[e]),r=C(`rect`,{class:`rmin-cell__box`,x:j(e)-D/2,y:336-n,width:D,height:n,rx:5});t.appendChild(r);let i=C(`text`,{class:`rmin-cell__val`,x:j(e),y:336-n+14});i.textContent=String(x[e]),t.appendChild(i);let a=C(`text`,{class:`rmin-cell__idx`,x:j(e),y:364});a.textContent=String(e),t.appendChild(a),I.appendChild(t),H.push({g:t})}let U={};for(let e of[`l`,`m`,`r`]){let t=C(`g`,{class:`rmin-pin rmin-pin--${e}`}),n=C(`rect`,{class:`rmin-pin__tag`,x:0,y:d,width:22,height:20,rx:5}),r=C(`path`,{class:`rmin-pin__tag`,d:`M 0 0 L 0 0 L 0 0`}),i=C(`text`,{class:`rmin-pin__text`,x:0,y:168});i.textContent=e,t.appendChild(n),t.appendChild(r),t.appendChild(i),L.appendChild(t),U[e]={g:t,tag:n,tri:r,text:i}}let W=C(`circle`,{class:`rmin-min__ring`,cx:0,cy:0,r:0}),G=C(`text`,{class:`rmin-min__text`,x:0,y:0});L.appendChild(W),L.appendChild(G);let K=E();function q(t,n){if(!n)return;let r=n.phase===`done`,i=n.live??(n.l===null?null:[n.l,n.r]);H.forEach((e,t)=>{let a=[`rmin-cell`];i&&(t<i[0]||t>i[1])&&a.push(`is-out`),!r&&n.r!==null&&t===n.r&&a.push(`is-base`),e.g.setAttribute(`class`,a.join(` `))});let a=e=>j(e),o=(e,t)=>{let n=U[e];if(t==null||t<0||t>=S){n.g.style.opacity=`0`;return}let r=a(t);n.tag.setAttribute(`x`,r-11),n.tri.setAttribute(`d`,`M ${r-6} ${f} L ${r+6} ${f} L ${r} 187 z`),n.text.setAttribute(`x`,r),n.g.style.opacity=`1`};if(o(`l`,n.l),o(`m`,r?null:n.mid),o(`r`,r?null:n.r),r&&n.minIdx!==null){let e=j(n.minIdx),t=N(x[n.minIdx]);W.setAttribute(`cx`,e),W.setAttribute(`cy`,336-t/2),W.setAttribute(`r`,Math.max(16,D/2+6)),G.setAttribute(`x`,e),G.setAttribute(`y`,336-t-22),G.textContent=`min = ${x[n.minIdx]}`,W.style.opacity=`1`,G.style.opacity=`1`}else W.style.opacity=`0`,G.style.opacity=`0`;z.textContent=i?`存活区间 [${i[0]}, ${i[1]}]`:`存活区间 -`,n.phase===`init`?B.textContent=`mid 和 nums[right] 比：断崖在哪边，最小值就在哪边`:n.cmp===`>`?B.textContent=`${n.midVal} > ${n.rightVal} → mid 在第一段，去右边`:n.cmp===`<`?B.textContent=`${n.midVal} < ${n.rightVal} → mid 在第二段，r = mid`:r?B.textContent=`l 与 r 相遇`:B.textContent=``,V.textContent=r&&n.minIdx!==null?`min ${n.nums[n.minIdx]}`:`min ?`,e(K,n.desc)}w.appendChild(K);let J=i();w.appendChild(J.root),a.textContent=``,a.appendChild(w),n();let Y=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,X=t({steps:y,controls:J,intervalMs:g,onRender:q});X.jumpTo(Math.trunc(_.initialStep)||0);let Z=null;return b&&!Y&&typeof IntersectionObserver==`function`&&(Z=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){Z.disconnect(),Z=null,X.play();return}},{threshold:.35}),Z.observe(w)),{destroy(){Z&&=(Z.disconnect(),null),X.destroy(),a.textContent=``,delete a.dataset.rminMounted,document.getElementById(s)?.remove()}}}export{y as mountRotatedMin};