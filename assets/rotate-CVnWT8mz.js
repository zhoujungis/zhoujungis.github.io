import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[1,2,3,4,5,6,7],o=3;function s(e={}){let t=(Array.isArray(e.nums)?e.nums:a).slice(),n=t.length,r=Number.isInteger(e.k)?e.k:o,i=n>0?(r%n+n)%n:0,s=[],c=(e,r,a={})=>{s.push({phase:e,desc:r,arr:t.slice(),n,k:i,round:0,roundName:``,flipRange:null,i:null,j:null,swapsDone:0,done:e===`done`,...a})};if(n===0)return c(`done`,`输入是空的，没有可轮转的元素。`),s;if(c(`init`,`给了 \`${n}\` 个数 \`[${t.join(`, `)}]\`，向右轮转 \`${r}\` 位。先取模：\`k = ${r} mod ${n} = ${i}\`（轮转 n 位等于没转，k 可能比 n 大）。`+(i===0?`取模后 k = 0 —— 数组不变，直接结束。`:`要求的进阶是 **O(1) 额外空间**，排除"再开一个数组按位搬运"，剩下的是**三次原地翻转**：① 整体翻转；② 翻转前 k 个；③ 翻转后 n-k 个。原理一句话：**轮转 = 两段交换左右位置**，整体翻转让两段就位（内部顺序全倒），再各自翻回来 —— 反转是自己的逆运算，两次反转让内部顺序复原。`)),i===0)return c(`done`,`取模后 \`k = 0\`，数组不变：\`[${t.join(`, `)}]\`。顺带一个语言坑：Python 切片写法 \`nums[-k:] + nums[:-k]\` 在 k=0 时会炸 —— \`-0\` 就是 \`0\`，\`nums[-0:]\` 是**整个数组**，结果变成"数组接上自己"。所以切片法必须先取模、再特判 k=0（或写 \`nums[n-k:]\`）。`),s;let l=[{a:0,b:n-1,name:`整体翻转`},{a:0,b:i-1,name:`翻转前 k`},{a:i,b:n-1,name:`翻转后 n-k`}],u=0;for(let{a:e,b:n,name:r}of l){u+=1;let i=0,a=e,o=n;for(;a<o;){let s=t[a];t[a]=t[o],t[o]=s,i+=1,c(`flip`,`**第 \`${u}\` 次（${r}，区间 \`[${e}, ${n}]\`）**：交换 \`i = ${a}\` 与 \`j = ${o}\` —— \`${t[o]}\` 和 \`${t[a]}\` 换位（swap 后），数组变成 \`[${t.join(`, `)}]\`。双指针向中间收拢：\`i → ${a+1}\`，\`j → ${o-1}\`。`+(a+1<o-1?` 还有交换要做。`:a+1===o-1?` 还剩中间一对。`:` 本轮翻转完成。`),{round:u,roundName:r,flipRange:[e,n],i:a,j:o,swapsDone:i}),a+=1,--o}i===0&&c(`flip`,`**第 \`${u}\` 次（${r}，区间 \`[${e}, ${n}]\`）**：区间长度不足 2，不需要交换（k = 1 时"前 k 个"就是单元素，天然有序）。`,{round:u,roundName:r,flipRange:[e,n],i:null,j:null,swapsDone:0})}return c(`done`,`三次翻转完成。**答案 = [${t.join(`, `)}]**。回头看这三步：每一步都只做**原地交换**，总共 ${u} 轮、每轮扫描一半区间，时间 \`O(n)\`，**额外空间 O(1)** —— 这就是题目进阶要的答案。对照另一种 O(1) 解法"环状替换"（从 0 出发按 \`(i + k) mod n\` 跳环，需要数 gcd 圈），三次翻转不需要任何数论，好写好记 —— 面试首选。`,{arr:t.slice(),round:3,roundName:`完成`,done:!0}),s}var c=`rot-styles`,l=54,u=84,d=46,f=152,p=172,m=194,h=52,g=262,_=286,v=26,y=604,b=1250,x=`
.rot {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.rot__svg { width: 100%; height: auto; display: block; }

.rot-note {
  fill: var(--rot-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rot-banner__box {
  fill: var(--rot-banner, #f4f3ef);
  stroke: var(--rot-line, #c3c9c2);
  stroke-width: 1.5;
}
.rot-banner__seg {
  fill: var(--rot-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rot-banner__ans {
  fill: var(--rot-gold, #c2872f);
  font-size: 18px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rot-cell__box {
  fill: var(--rot-fill, #ffffff);
  stroke: var(--rot-line, #c3c9c2);
  stroke-width: 1.5;
}
.rot-cell__val {
  fill: var(--rot-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rot-cell__idx {
  fill: var(--rot-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 通道一（底色）：当前翻转区间 */
.rot-cell.is-flipping .rot-cell__box { fill: var(--rot-gold-fill, #fdf3e3); }
/* 通道二（边框）：本帧交换的两格 */
.rot-cell.is-swap .rot-cell__box {
  stroke: var(--rot-hot, #a45f45);
  stroke-width: 3;
}
.rot-cell.is-swap .rot-cell__val { fill: var(--rot-hot, #a45f45); }
/* done 帧：全部就位 */
.rot-cell.is-done .rot-cell__box {
  fill: var(--rot-ok-fill, #eef5f1);
  stroke: var(--rot-ok, #3f6b57);
  stroke-width: 2;
}
.rot-cell.is-done .rot-cell__val { fill: var(--rot-ok, #3f6b57); }

.rot-pin__tag { fill: var(--rot-hot, #a45f45); }
.rot-pin__tri { fill: var(--rot-hot, #a45f45); }
.rot-pin__text {
  fill: var(--rot-paper, #ffffff);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rot-phase__text {
  fill: var(--rot-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rot-empty__text {
  fill: var(--rot-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function S(){if(document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=x,document.head.appendChild(e)}function C(a,o={}){if(!a||a.dataset.rotMounted===`1`)return{destroy(){}};a.dataset.rotMounted=`1`,S();let x=s(o),C=o.autoplay!==!1,w=x[0].arr.length,T=r,E=document.createElement(`div`);E.className=`viz rot`;let D=document.createElement(`div`);D.className=`viz__stage`,E.appendChild(D);function O(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(w===0){let e=T(`svg`,{class:`viz__svg rot__svg`,viewBox:`0 0 620 120`,role:`img`}),t=T(`text`,{class:`rot-empty__text`,x:310,y:60});return t.textContent=`空输入 —— 没有可轮转的元素`,e.appendChild(t),D.appendChild(e),E.appendChild(O()),E.appendChild(i().root),a.textContent=``,a.appendChild(E),n(),{destroy(){a.textContent=``,delete a.dataset.rotMounted,document.getElementById(c)?.remove()}}}let k=58;w*k+(w-1)*6>y&&(k=Math.max(20,Math.floor((y-(w-1)*6)/w)));let A=w*k+(w-1)*6,j=Math.max(660,v*2+A),M=(j-A)/2,N=e=>M+e*(k+6)+k/2,P=j-v*2,F=T(`svg`,{class:`viz__svg rot__svg`,viewBox:`0 0 ${j} 310`,role:`img`,"aria-label":`轮转数组 三次翻转推演动画`});D.appendChild(F);let I=T(`g`,{class:`rot-cells`}),L=T(`g`,{class:`rot-marks`});F.appendChild(I),F.appendChild(L);let R=T(`text`,{class:`rot-note`,x:v,y:l});R.textContent=`轮转 = 两段交换位置：整体翻转让两段就位，再各自翻回内部顺序`,L.appendChild(R),L.appendChild(T(`rect`,{class:`rot-banner__box`,x:v,y:u,width:P,height:d,rx:9}));let z=T(`text`,{class:`rot-banner__seg`,x:44,y:107}),B=T(`text`,{class:`rot-banner__seg`,x:276,y:107}),V=T(`text`,{class:`rot-banner__ans`,x:j-v-18,y:107});L.appendChild(z),L.appendChild(B),L.appendChild(V);let H=[];for(let e=0;e<w;e+=1){let t=T(`g`,{class:`rot-cell`}),n=T(`rect`,{class:`rot-cell__box`,x:N(e)-k/2,y:m,width:k,height:h,rx:6});t.appendChild(n);let r=T(`text`,{class:`rot-cell__val`,x:N(e),y:220});t.appendChild(r);let i=T(`text`,{class:`rot-cell__idx`,x:N(e),y:g});i.textContent=String(e),t.appendChild(i),I.appendChild(t),H.push({g:t,box:n,val:r})}let U=T(`g`,{class:`rot-pin`}),W=T(`rect`,{class:`rot-pin__tag`,x:0,y:f,width:30,height:20,rx:5}),G=T(`path`,{class:`rot-pin__tri`,d:`M 0 0 L 0 0 L 0 0`}),K=T(`text`,{class:`rot-pin__text`,x:0,y:162});U.appendChild(W),U.appendChild(G),U.appendChild(K),L.appendChild(U);let q=T(`text`,{class:`rot-phase__text`,x:j/2,y:_});L.appendChild(q);let J=O();function Y(t,n){if(!n)return;let{arr:r,k:i,n:a}=n,o=n.phase===`done`,s=new Set;n.phase===`flip`&&n.i!==null&&(s.add(n.i),s.add(n.j));let c=n.flipRange;if(H.forEach((e,t)=>{e.val.textContent=String(r[t]);let n=[`rot-cell`];o?n.push(`is-done`):c&&t>=c[0]&&t<=c[1]&&n.push(`is-flipping`),s.has(t)&&n.push(`is-swap`),e.g.setAttribute(`class`,n.join(` `))}),n.phase===`flip`&&n.i!==null){let e=N(n.i);W.setAttribute(`x`,e-15),G.setAttribute(`d`,`M ${e-6} ${p} L ${e+6} ${p} L ${e} 181 z`),K.setAttribute(`x`,e),K.textContent=`i=${n.i}`,U.style.opacity=`1`}else U.style.opacity=`0`;z.textContent=n.round>0?`第 ${n.round}/3 次 · ${n.roundName}`:`k = ${i}（mod ${a}）`,n.phase===`init`?B.textContent=`取模 → 三次原地翻转`:n.phase===`flip`&&n.i!==null?B.textContent=`swap(${n.i}, ${n.j})`:n.phase===`flip`?B.textContent=`区间长度不足 2，跳过`:B.textContent=`三次翻转完成`,V.textContent=o?`[${r.join(`,`)}]`:`${a} 个数 · 轮转 ${i} 位`;let l=[`整体`,`前 k`,`后 n-k`].map((e,t)=>{let r=o||n.round>t||n.round===t+1&&n.phase===`flip`&&n.i===null,i=n.round===t+1&&n.phase===`flip`;return`${r?`[x]`:i?`[>]`:`[ ]`} ${e}`});q.textContent=l.join(`   `),e(J,n.desc)}E.appendChild(J);let X=i();E.appendChild(X.root),a.textContent=``,a.appendChild(E),n();let Z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:x,controls:X,intervalMs:b,onRender:Y});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return C&&!Z&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(E)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.rotMounted,document.getElementById(c)?.remove()}}}export{C as mountRotate};