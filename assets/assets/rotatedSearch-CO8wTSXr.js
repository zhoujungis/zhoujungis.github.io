import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[4,5,6,7,0,1,2],o=0;function s(e={}){let t=(Array.isArray(e.nums)?e.nums:a).slice(),n=t.length,r=Number.isInteger(e.target)?e.target:o,i=[],s=(e,n,a={})=>{i.push({phase:e,desc:n,nums:t,target:r,l:null,r:null,live:null,mid:null,midVal:null,ordered:null,range:null,foundIdx:null,done:e===`done`,...a})};if(n===0)return s(`done`,`输入是空的，返回 -1。`,{foundIdx:-1}),i;s(`init`,`在旋转数组 \`[${t.join(`, `)}]\` 里搜 \`${r}\`，要求 \`O(log n)\` —— 不能先旋转回来再搜。旋转数组的馈赠是：**mid 把区间切成的两半里，至少有一半完全有序**。所以每一步三连问：mid 是不是答案？哪一半有序？target 在有序的那半的值域里吗？在 → 进有序半；不在 → 目标只可能在另一半。`);let c=0,l=n-1,u=0;for(;c<=l&&u<100;){u+=1;let e=c,n=l,a=Math.floor((e+n)/2),o=t[a];if(o===r)return s(`probe`,`\`mid = ${a}\`，\`nums[${a}] = ${o}\` —— **正好是 target，命中**。`,{l:e,r:n,live:[e,n],mid:a,midVal:o,foundIdx:a}),s(`done`,`**target ${r} 的下标 = ${a}**。这趟每一步都是"判有序半 → 查值域 → 进对的那半"，\`O(log n)\`，和普通二分一样的复杂度 —— 旋转只是把"哪半有序"换了个位置，判断框架一个字没变。`,{l:e,r:n,live:[e,n],mid:a,midVal:o,foundIdx:a}),i;t[e]<=o?r>=t[e]&&r<o?(l=a-1,s(`probe`,`\`mid = ${a}\`（值 \`${o}\`，不是 target）。\`nums[l] = ${t[e]} <= nums[mid]\` —— **左半 \`[${e}, ${a}]\` 有序**，值域 \`[${t[e]}, ${o})\`。target \`${r}\` 在值域内 → 进左半 → \`r = ${a-1}\`。`,{l:e,r:n,live:[e,a-1],mid:a,midVal:o,ordered:`left`,range:[t[e],o]})):(c=a+1,s(`probe`,`\`mid = ${a}\`（值 \`${o}\`，不是 target）。\`nums[l] = ${t[e]} <= nums[mid]\` —— **左半有序**，值域 \`[${t[e]}, ${o})\`。target \`${r}\` 不在值域内 → 它只可能在**右半**（哪怕右半是断崖那侧）→ \`l = ${a+1}\`。`,{l:e,r:n,live:[a+1,n],mid:a,midVal:o,ordered:`left`,range:[t[e],o]})):r>o&&r<=t[n]?(c=a+1,s(`probe`,`\`mid = ${a}\`（值 \`${o}\`，不是 target）。\`nums[l] = ${t[e]} > nums[mid]\` —— **右半 \`[${a}, ${n}]\` 有序**，值域 \`(${o}, ${t[n]}]\`。target \`${r}\` 在值域内 → 进右半 → \`l = ${a+1}\`。`,{l:e,r:n,live:[a+1,n],mid:a,midVal:o,ordered:`right`,range:[o,t[n]]})):(l=a-1,s(`probe`,`\`mid = ${a}\`（值 \`${o}\`，不是 target）。\`nums[l] = ${t[e]} > nums[mid]\` —— **右半有序**，值域 \`(${o}, ${t[n]}]\`。target \`${r}\` 不在值域内 → 只可能在左半 → \`r = ${a-1}\`。`,{l:e,r:n,live:[e,a-1],mid:a,midVal:o,ordered:`right`,range:[o,t[n]]}))}return s(`done`,u>=100?`异常退出（步数上限），正常输入不会走到这里。`:`\`l > r\`，区间空了 —— **target \`${r}\` 不在数组里，返回 -1**。注意这趟每一步的"哪半有序"判断都没有出过错：二分在旋转数组上依然是对的，只要每一步都确认"要去的那半真的包含答案"。`,{l:c,r:l,live:[c,l],foundIdx:-1}),i}var c=`rsearch-styles`,l=54,u=84,d=46,f=158,p=178,m=130,h=26,g=604,_=1250,v=`
.rsearch {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.rsearch__svg { width: 100%; height: auto; display: block; }

.rsearch-note {
  fill: var(--rs-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rsearch-banner__box {
  fill: var(--rs-banner, #f4f3ef);
  stroke: var(--rs-line, #c3c9c2);
  stroke-width: 1.5;
}
.rsearch-banner__seg {
  fill: var(--rs-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rsearch-banner__ans {
  fill: var(--rs-gold, #c2872f);
  font-size: 18px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rsearch-banner__ans.is-miss {
  fill: var(--rs-hot, #a45f45);
}

.rsearch-cell__box {
  fill: var(--rs-fill, #ffffff);
  stroke: var(--rs-line, #c3c9c2);
  stroke-width: 1.5;
}
.rsearch-cell__val {
  fill: var(--rs-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rsearch-cell__idx {
  fill: var(--rs-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rsearch-cell.is-out .rsearch-cell__box {
  fill: var(--rs-dim-fill, #f0efea);
  stroke-dasharray: 4 3;
}
.rsearch-cell.is-out .rsearch-cell__val { fill: var(--rs-dim, #b9b9b3); }
/* 有序半：淡金底（通道一） */
.rsearch-cell.is-ordered .rsearch-cell__box { fill: var(--rs-gold-fill, #fdf3e3); }

.rsearch-pin--l { fill: var(--rs-ok, #3f6b57); }
.rsearch-pin--m { fill: var(--rs-hot, #a45f45); }
.rsearch-pin--r { fill: var(--rs-cmp, #5a7ea6); }
.rsearch-pin__tag { fill: inherit; }
.rsearch-pin__text {
  fill: var(--rs-paper, #ffffff);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* target 水平虚线 */
.rsearch-target__line {
  stroke: var(--rs-gold, #c2872f);
  stroke-width: 1.5;
  stroke-dasharray: 6 4;
}
.rsearch-target__text {
  fill: var(--rs-gold, #c2872f);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rsearch-hit__ring {
  fill: none;
  stroke: var(--rs-gold, #c2872f);
  stroke-width: 3;
}
.rsearch-hit__text {
  fill: var(--rs-gold, #c2872f);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rsearch-empty__text {
  fill: var(--rs-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function y(){if(document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=v,document.head.appendChild(e)}function b(a,o={}){if(!a||a.dataset.rsMounted===`1`)return{destroy(){}};a.dataset.rsMounted=`1`,y();let v=s(o),b=o.autoplay!==!1,x=v[0].nums,S=v[0].target,C=x.length,w=r,T=document.createElement(`div`);T.className=`viz rsearch`;let E=document.createElement(`div`);E.className=`viz__stage`,T.appendChild(E);function D(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(C===0){let e=w(`svg`,{class:`viz__svg rsearch__svg`,viewBox:`0 0 620 120`,role:`img`}),t=w(`text`,{class:`rsearch-empty__text`,x:310,y:60});return t.textContent=`空输入 —— 返回 -1`,e.appendChild(t),E.appendChild(e),T.appendChild(D()),T.appendChild(i().root),a.textContent=``,a.appendChild(T),n(),{destroy(){a.textContent=``,delete a.dataset.rsMounted,document.getElementById(c)?.remove()}}}let O=58;C*O+(C-1)*6>g&&(O=Math.max(20,Math.floor((g-(C-1)*6)/C)));let k=C*O+(C-1)*6,A=Math.max(660,h*2+k),j=(A-k)/2,M=e=>j+e*(O+6)+O/2,N=m/Math.max(...x,S),P=e=>336-e*N,F=A-h*2,I=w(`svg`,{class:`viz__svg rsearch__svg`,viewBox:`0 0 ${A} 372`,role:`img`,"aria-label":`搜索旋转排序数组 推演动画`});E.appendChild(I);let L=w(`g`,{class:`rsearch-cells`}),R=w(`g`,{class:`rsearch-marks`});I.appendChild(L),I.appendChild(R);let z=w(`text`,{class:`rsearch-note`,x:h,y:l});z.textContent=`mid 把区间切两半，至少一半有序 —— 在有序半查值域，就知道 target 在哪边`,R.appendChild(z),R.appendChild(w(`rect`,{class:`rsearch-banner__box`,x:h,y:u,width:F,height:d,rx:9}));let B=w(`text`,{class:`rsearch-banner__seg`,x:44,y:107}),V=w(`text`,{class:`rsearch-banner__seg`,x:266,y:107}),H=w(`text`,{class:`rsearch-banner__ans`,x:A-h-18,y:107});R.appendChild(B),R.appendChild(V),R.appendChild(H);let U=[];for(let e=0;e<C;e+=1){let t=w(`g`,{class:`rsearch-cell`}),n=Math.max(14,x[e]*N),r=w(`rect`,{class:`rsearch-cell__box`,x:M(e)-O/2,y:336-n,width:O,height:n,rx:5});t.appendChild(r);let i=w(`text`,{class:`rsearch-cell__val`,x:M(e),y:336-n+14});i.textContent=String(x[e]),t.appendChild(i);let a=w(`text`,{class:`rsearch-cell__idx`,x:M(e),y:364});a.textContent=String(e),t.appendChild(a),L.appendChild(t),U.push({g:t})}let W={};for(let e of[`l`,`m`,`r`]){let t=w(`g`,{class:`rsearch-pin rsearch-pin--${e}`}),n=w(`rect`,{class:`rsearch-pin__tag`,x:0,y:f,width:22,height:20,rx:5}),r=w(`path`,{class:`rsearch-pin__tag`,d:`M 0 0 L 0 0 L 0 0`}),i=w(`text`,{class:`rsearch-pin__text`,x:0,y:168});i.textContent=e,t.appendChild(n),t.appendChild(r),t.appendChild(i),R.appendChild(t),W[e]={g:t,tag:n,tri:r,text:i}}let G=w(`line`,{class:`rsearch-target__line`,x1:j-10,y1:0,x2:j+k+10,y2:0}),K=w(`text`,{class:`rsearch-target__text`,x:0,y:0});K.textContent=`target = ${S}`,R.appendChild(G),R.appendChild(K);let q=w(`circle`,{class:`rsearch-hit__ring`,cx:0,cy:0,r:0}),J=w(`text`,{class:`rsearch-hit__text`,x:0,y:0});R.appendChild(q),R.appendChild(J);let Y=D();function X(t,n){if(!n)return;let r=n.phase===`done`,i=n.live??(n.l===null?null:[n.l,n.r]),a=new Set;if(n.ordered===`left`&&n.mid!==null)for(let e=n.l;e<=n.mid;e+=1)a.add(e);else if(n.ordered===`right`&&n.mid!==null)for(let e=n.mid;e<=n.r;e+=1)a.add(e);U.forEach((e,t)=>{let n=[`rsearch-cell`];i&&(t<i[0]||t>i[1])?n.push(`is-out`):a.has(t)&&n.push(`is-ordered`),e.g.setAttribute(`class`,n.join(` `))});let o=(e,t)=>{let n=W[e];if(t==null||t<0||t>=C){n.g.style.opacity=`0`;return}let r=M(t);n.tag.setAttribute(`x`,r-11),n.tri.setAttribute(`d`,`M ${r-6} ${p} L ${r+6} ${p} L ${r} 187 z`),n.text.setAttribute(`x`,r),n.g.style.opacity=`1`};o(`l`,n.l),o(`m`,r?null:n.mid),o(`r`,r?null:n.r);let s=P(S);if(G.setAttribute(`y1`,s),G.setAttribute(`y2`,s),K.setAttribute(`x`,j+k+12),K.setAttribute(`y`,s),n.foundIdx!==null&&n.foundIdx>=0){let e=M(n.foundIdx),t=Math.max(14,x[n.foundIdx]*N);q.setAttribute(`cx`,e),q.setAttribute(`cy`,336-t/2),q.setAttribute(`r`,Math.max(16,O/2+6)),J.setAttribute(`x`,e),J.setAttribute(`y`,336-t-22),J.textContent=`下标 ${n.foundIdx}`,q.style.opacity=`1`,J.style.opacity=`1`}else q.style.opacity=`0`,J.style.opacity=`0`;B.textContent=i?`存活区间 [${i[0]}, ${i[1]}]`:`存活区间 -`,n.phase===`init`?V.textContent=`在 ${n.nums.length} 个数里找 target = ${S}`:n.ordered===`left`?V.textContent=`左半 [${n.l}, ${n.mid}] 有序，值域 [${n.range[0]}, ${n.range[1]})`:n.ordered===`right`?V.textContent=`右半 [${n.mid}, ${n.r}] 有序，值域 (${n.range[0]}, ${n.range[1]}]`:r&&n.foundIdx!==null&&n.foundIdx>=0?V.textContent=`命中`:r?V.textContent=`区间空了，不存在`:V.textContent=``;let c=r&&(n.foundIdx===null||n.foundIdx<0);H.textContent=c?`-1`:n.foundIdx!==null&&n.foundIdx>=0?`下标 ${n.foundIdx}`:`?`,H.setAttribute(`class`,c?`rsearch-banner__ans is-miss`:`rsearch-banner__ans`),e(Y,n.desc)}T.appendChild(Y);let Z=i();T.appendChild(Z.root),a.textContent=``,a.appendChild(T),n();let ee=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:v,controls:Z,intervalMs:_,onRender:X});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return b&&!ee&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(T)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.rsMounted,document.getElementById(c)?.remove()}}}export{b as mountRotatedSearch};