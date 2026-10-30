import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[[1,3],[2,6],[8,10],[15,18]];function o(e={}){let t=Array.isArray(e.intervals)?e.intervals:a,n=[],r=(e,r,i={})=>{n.push({phase:e,desc:r,intervals:t.map(e=>e.slice()),sorted:[],idx:null,curStart:null,curEnd:null,result:[],cmp:null,done:e===`done`,...i})};if(t.length===0)return r(`done`,`输入是空的，直接返回空数组。`),n;let i=t.map(e=>e.slice()).sort((e,t)=>e[0]-t[0]||e[1]-t[1]);r(`init`,`给了 \`${t.length}\` 个区间：\`[${t.map(e=>`[${e[0]},${e[1]}]`).join(`, `)}]\`。暴力做法是两两比较有没有重叠，\`O(n²)\`；但这题有一个决定性的预处理：**先按左端点排序**。排好序之后有一个性质 —— 新区间的 start 是当前最大的，它如果连当前合并区间的 end 都够不着，就更够不着更早的区间（它们的 end 都被当前合并区间罩着），所以**每个区间只需要和"当前合并区间"比一次**，重叠的候选从 \`O(n²)\` 对坍缩成线性个。另外记住一个语义：**端点相触算重叠**，\`[1,4]\` 和 \`[4,5]\` 要合成 \`[1,5]\`。`),r(`sort`,`按左端点排序完成：\`[${i.map(e=>`[${e[0]},${e[1]}]`).join(`, `)}]\`。这一步 \`O(n log n)\` 是整个算法的瓶颈 —— 之后的合并扫描是严格的 O(n)。扫描规则只有一句：看当前区间的 start 是否 \`<=\` 当前合并区间的 end，够得着就延伸，够不着就收段、新开。`,{sorted:i.map(e=>e.slice())});let o=null,s=null,c=[];for(let e=0;e<i.length;e+=1){let[t,n]=i[e];if(o===null){o=t,s=n,r(`start`,`第一段 \`[${t},${n}]\` 直接成为当前合并区间 \`[${o},${s}]\`。接下来每个区间只问一句话：**你的 start 够得着我的 end 吗？**`,{idx:e,curStart:o,curEnd:s,sorted:i.map(e=>e.slice())});continue}t<=s?(s=Math.max(s,n),r(`extend`,`\`[${t},${n}]\` 的 start \`${t} <= ${s}\`（当前合并区间的 end）—— **够得着，延伸**。当前合并区间变成 \`[${o},${s}]\`。`+(n>s||n===s?`延伸取 \`max(旧 end, ${n})\` —— 注意不能直接覆盖：新区间可能整体被当前区间罩住（比如 \`[2,3]\` 配 \`[1,6]\`）。`:``),{idx:e,curStart:o,curEnd:s,cmp:`overlap`,sorted:i.map(e=>e.slice())})):(c.push([o,s]),o=t,s=n,r(`close`,`\`[${t},${n}]\` 的 start \`${t} > ${s}\` —— **够不着，收段**。把 \`[${c[c.length-1][0]},${c[c.length-1][1]}]\` 收进结果（它再也不可能被延伸了 —— 后面区间的 start 只会更大），当前合并区间换成 \`[${t},${n}]\`。`,{idx:e,curStart:o,curEnd:s,cmp:`gap`,sorted:i.map(e=>e.slice()),result:c.map(e=>e.slice())}))}return c.push([o,s]),r(`done`,`扫描结束，把最后一段 \`[${o},${s}]\` 也收进去。**答案 = [${c.map(e=>`[${e[0]},${e[1]}]`).join(`, `)}]**，共 \`${c.length}\` 段。回头看这趟：排序 \`O(n log n)\` + 扫描 \`O(n)\`，每个区间只和"当前合并区间"比了一次。还有一个工程细节：结果里的区间必须是**新造的数组** —— 要是把输入区间的引用塞进结果再改它的 end，调用方的原数据就被污染了。`,{idx:i.length-1,curStart:o,curEnd:s,result:c.map(e=>e.slice()),sorted:i.map(e=>e.slice())}),n}var s=`mi-styles`,c=54,l=84,u=46,d=152,f=34,p=8,m=34,h=40,g=26,_=1250,v=`
.mi {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.mi__svg { width: 100%; height: auto; display: block; }

.mi-note {
  fill: var(--mi-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.mi-banner__box {
  fill: var(--mi-banner, #f4f3ef);
  stroke: var(--mi-line, #c3c9c2);
  stroke-width: 1.5;
}
.mi-banner__seg {
  fill: var(--mi-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mi-banner__ans {
  fill: var(--mi-gold, #c2872f);
  font-size: 18px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 数轴 ─────────────────────────────────────────────────────────────── */
.mi-axis__line { stroke: var(--mi-line, #c3c9c2); stroke-width: 1.5; }
.mi-axis__tick { stroke: var(--mi-line, #c3c9c2); stroke-width: 1; }
.mi-axis__num {
  fill: var(--mi-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 区间条 ───────────────────────────────────────────────────────────── */
.mi-bar { rx: 8; }
.mi-bar__box {
  fill: var(--mi-fill, #ffffff);
  stroke: var(--mi-line, #c3c9c2);
  stroke-width: 1.5;
}
.mi-bar__text {
  fill: var(--mi-ink, #1f2a24);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mi-bar__label {
  fill: var(--mi-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 通道一（底色）：已收进结果的段 */
.mi-bar.is-done .mi-bar__box {
  fill: var(--mi-ok-fill, #eef5f1);
  stroke: var(--mi-ok, #3f6b57);
  stroke-width: 2;
}
.mi-bar.is-done .mi-bar__text { fill: var(--mi-ok, #3f6b57); }
/* 通道一（底色）：当前合并区间 */
.mi-bar.is-cur .mi-bar__box {
  fill: var(--mi-gold-fill, #fdf3e3);
}
/* 通道二（边框）：本帧正在处理的行 */
.mi-bar.is-active .mi-bar__box {
  stroke: var(--mi-hot, #a45f45);
  stroke-width: 3;
}

/* ── 结果区 ───────────────────────────────────────────────────────────── */
.mi-result__label {
  fill: var(--mi-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mi-result__cur {
  fill: var(--mi-gold-fill, #fdf3e3);
  stroke: var(--mi-gold, #c2872f);
  stroke-width: 2.5;
}
.mi-result__seg {
  fill: var(--mi-ok, #3f6b57);
  opacity: 0.9;
}

.mi-empty__text {
  fill: var(--mi-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function y(){if(document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=v,document.head.appendChild(e)}function b(a,v={}){if(!a||a.dataset.miMounted===`1`)return{destroy(){}};a.dataset.miMounted=`1`,y();let b=o(v),x=v.autoplay!==!1,S=r,C=document.createElement(`div`);C.className=`viz mi`;let w=document.createElement(`div`);w.className=`viz__stage`,C.appendChild(w);function T(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(b[0].intervals.length===0){let e=S(`svg`,{class:`viz__svg mi__svg`,viewBox:`0 0 620 120`,role:`img`}),t=S(`text`,{class:`mi-empty__text`,x:620/2,y:120/2});return t.textContent=`空输入 —— 直接返回空数组`,e.appendChild(t),w.appendChild(e),C.appendChild(T()),C.appendChild(i().root),a.textContent=``,a.appendChild(C),n(),{destroy(){a.textContent=``,delete a.dataset.miMounted,document.getElementById(s)?.remove()}}}let E=b[0].sorted.length?b[0].sorted.flat():b[0].intervals.flat(),D=Math.max(...E,1),O=Math.min(...E,0),k=542-g,A=e=>118+(e-O)/(D-O||1)*k,j=Math.max(b[0].sorted.length,b[0].intervals.length,1),M=176+(j*42+p)+m,N=M+16,P=S(`svg`,{class:`viz__svg mi__svg`,viewBox:`0 0 660 ${N+h+40}`,role:`img`,"aria-label":`合并区间 推演动画`});w.appendChild(P);let F=S(`g`,{class:`mi-bars`}),I=S(`g`,{class:`mi-marks`});P.appendChild(F),P.appendChild(I);let L=S(`text`,{class:`mi-note`,x:g,y:c});L.textContent=`按左端点排序后，每个区间只和「当前合并区间」比一次`,I.appendChild(L),I.appendChild(S(`rect`,{class:`mi-banner__box`,x:g,y:l,width:660-g*2,height:u,rx:9}));let R=S(`text`,{class:`mi-banner__seg`,x:44,y:107}),z=S(`text`,{class:`mi-banner__seg`,x:266,y:107}),B=S(`text`,{class:`mi-banner__ans`,x:660-g-18,y:107});I.appendChild(R),I.appendChild(z),I.appendChild(B);let V=S(`line`,{class:`mi-axis__line`,x1:118,y1:d,x2:634,y2:d});I.appendChild(V);let H=D-O<=12?1:D-O<=30?2:5;for(let e=Math.ceil(O);e<=D;e+=H){let t=A(e);I.appendChild(S(`line`,{class:`mi-axis__tick`,x1:t,y1:d-4,x2:t,y2:156}));let n=S(`text`,{class:`mi-axis__num`,x:t,y:d-14});n.textContent=String(e),I.appendChild(n)}let U=[];for(let e=0;e<j;e+=1){let t=176+e*42,n=S(`g`,{class:`mi-bar`}),r=S(`text`,{class:`mi-bar__label`,x:g,y:t+f/2});n.appendChild(r);let i=S(`rect`,{class:`mi-bar__box`,x:0,y:t,width:10,height:f,rx:8});n.appendChild(i);let a=S(`text`,{class:`mi-bar__text`,x:0,y:t+f/2});n.appendChild(a),F.appendChild(n),U.push({g:n,label:r,box:i,text:a,y:t})}let W=S(`text`,{class:`mi-result__label`,x:g,y:M});I.appendChild(W);let G=S(`rect`,{class:`mi-result__cur`,x:0,y:N,width:0,height:h,rx:8});I.appendChild(G);let K=[];for(let e=0;e<j;e+=1){let e=S(`rect`,{class:`mi-result__seg`,x:0,y:N,width:0,height:h,rx:8});I.appendChild(e),K.push(e)}let q=T();function J(t,n){if(!n)return;let{sorted:r,result:i}=n,a=n.phase,o=a===`done`,s=n.curStart!==null&&!o,c=a===`init`?n.intervals:r;if(U.forEach((e,t)=>{let r=c[t];if(!r){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`;let[i,a]=r;e.label.textContent=`[${i},${a}]`;let s=A(i),l=A(a);e.box.setAttribute(`x`,s),e.box.setAttribute(`width`,Math.max(8,l-s)),e.text.setAttribute(`x`,(s+l)/2),e.text.textContent=`${i} - ${a}`;let u=[`mi-bar`];t<=(n.idx??-1)&&!o&&u.push(`is-done`),t===n.idx&&!o&&u.push(`is-active`),e.g.setAttribute(`class`,u.join(` `))}),K.forEach((e,t)=>{let n=i[t];if(!n){e.style.opacity=`0`;return}e.style.opacity=`1`;let r=A(n[0]),a=A(n[1]);e.setAttribute(`x`,r),e.setAttribute(`width`,Math.max(6,a-r))}),W.textContent=`结果（已收 ${i.length} 段）`,s){let e=A(n.curStart),t=A(n.curEnd);G.setAttribute(`x`,e),G.setAttribute(`width`,Math.max(6,t-e)),G.style.opacity=`1`}else G.style.opacity=`0`;R.textContent=s?`当前 [${n.curStart}, ${n.curEnd}]`:`当前 -`,a===`init`?z.textContent=`先按左端点排序`:a===`sort`?z.textContent=`排序完成，开始扫描`:a===`start`?z.textContent=`第一段直接入座`:a===`extend`?z.textContent=`${n.sorted[n.idx][0]} <= ${n.curEnd} → 延伸（max 保底）`:a===`close`?z.textContent=`${n.sorted[n.idx][0]} > ${n.curEnd} → 收段、新开`:z.textContent=`最后一段收进结果`,B.textContent=o?`${n.result.length} 段`:`结果 ${n.result.length} 段`,e(q,n.desc)}C.appendChild(q);let Y=i();C.appendChild(Y.root),a.textContent=``,a.appendChild(C),n();let X=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Z=t({steps:b,controls:Y,intervalMs:_,onRender:J});Z.jumpTo(Math.trunc(v.initialStep)||0);let Q=null;return x&&!X&&typeof IntersectionObserver==`function`&&(Q=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){Q.disconnect(),Q=null,Z.play();return}},{threshold:.35}),Q.observe(C)),{destroy(){Q&&=(Q.disconnect(),null),Z.destroy(),a.textContent=``,delete a.dataset.miMounted,document.getElementById(s)?.remove()}}}export{b as mountMergeIntervals};