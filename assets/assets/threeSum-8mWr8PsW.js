import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[-1,0,1,2,-1,-4];function o(e={}){let t=Array.isArray(e.nums)?e.nums:a,n=[...t].sort((e,t)=>e-t),r=n.length,i=Number.isInteger(e.maxSteps)?e.maxSteps:400,o={i:-1,l:-1,r:-1,sum:null,sumL:null,sumR:null,lFrom:null,rFrom:null,dedupL:null,dedupR:null,hit:null,results:[],roundOver:!1};if(r<3)return[{...o,arr:[...n],original:[...t],phase:`done`,desc:`数组只有 \`${r}\` 个数，**凑不出三个**，直接返回空列表。题目虽然不会这么给，但状态机要有安静的出口。`,roundOver:!0,done:!0}];let s=[],c=[],l=0,u=e=>`[${e.join(`, `)}]`,d=()=>c.length===0?`[]`:`[${c.map(u).join(`, `)}]`,f=e=>e<0?`(${e})`:`${e}`,p=(e,r,i={})=>{s.push({...o,arr:[...n],original:[...t],results:c.map(e=>[...e]),phase:e,desc:r,done:e===`done`,...i})},m=0,h=0,g=0,_=`outer`;for(p(`init`,`要在 \`${u(t)}\` 里找出**所有**和为 \`0\` 的三元组，而且结果里**不能有重复**。暴力枚举三个下标是 \`O(n³)\`；直接照搬"两数之和"那套哈希表也不好使 —— 哈希能找出和为 0 的组合，但它回答不了"这一组是不是早就出现过了"，去重无处下手。标准路线只有一条：**先排序，再固定一个数，用双指针夹逼另外两个**。排序后数组是 \`${u(n)}\`。这里要点破一个误解：**排序的收益不是"查找更快"**（这题压根没有查找），而是**让相同的数挨在一起** —— 后面两处去重全靠这一点才写得出来。`);l<i;){if(l+=1,_===`outer`){if(m>=r-2)break;let e=n[m];if(e>0){p(`prune`,`\`i = ${m}\`，\`nums[${m}] = ${e} > 0\`。数组已经是升序的，\`i\` 后面的数只会**更大** —— 三个正数加起来不可能等于 \`0\`。所以这里直接 \`break\`，外层循环整体结束，不用再往后看了。`,{i:m});break}if(m>0&&n[m]===n[m-1]){p(`skip-i`,`\`i = ${m}\`，\`nums[${m}] = ${e}\` 和上一轮的 \`nums[${m-1}] = ${n[m-1]}\` **完全相同**。上一轮已经把"以 \`${e}\` 为最小数"的所有三元组找完了，这一轮只会把同样的答案**原样再找一遍**。所以**直接跳过整个内层循环**（\`continue\`）—— 这是第一处去重，注意它的形态是"**事前跳过**"：内层还没开始跑，就知道它毫无意义。另外判断条件里的 \`i > 0\` 不能省：\`i = 0\` 时 \`nums[i - 1]\` 会绕到数组末尾（Python 的负索引特性），比的根本不是"前一个"。`,{i:m,roundOver:!0}),m+=1;continue}h=m+1,g=r-1,p(`pick-i`,`外层固定 \`i = ${m}\`，\`nums[${m}] = ${e}\` —— 它就是这一轮三元组里**最小的那个数**。左指针 \`l = ${h}\`、右指针 \`r = ${g}\`，接下来要在 \`nums[${h}..${g}]\` 里找两个数，使它们的和刚好等于 \`${-e}\`（这样再加上 \`${e}\` 就是 \`0\`）。`,{i:m,l:h,r:g}),_=`inner`;continue}if(_===`inner`){if(h>=g){m+=1,_=`outer`;continue}let e=h,t=g,r=n[m]+n[e]+n[t],i=`\`nums[${m}] + nums[${e}] + nums[${t}]\` = \`${f(n[m])} + ${f(n[e])} + ${f(n[t])} = ${r}\`，`;if(r<0){h+=1,p(`squeeze`,i+"**和太小了**。`i` 已经固定、`r` 又是当前能取到的最大值，唯一能做的就是**把 `l` 往右挪一格**，去够一个更大的数。"+(h>=g?` 挪完 \`l = ${h}\` 已经碰到 \`r\` —— **这一轮结束**。`:``),{i:m,l:h,r:g,sum:r,sumL:e,sumR:t,lFrom:e,roundOver:h>=g});continue}if(r>0){--g,p(`squeeze`,i+"**和太大了**。`i` 已经固定、`l` 又是当前能取到的最小数，唯一能做的就是**把 `r` 往左挪一格**，去够一个更小的数。"+(h>=g?` 挪完 \`r = ${g}\` 已经碰到 \`l\` —— **这一轮结束**。`:``),{i:m,l:h,r:g,sum:r,sumL:e,sumR:t,rFrom:t,roundOver:h>=g});continue}let a=[n[m],n[h],n[g]];c.push(a),p(`hit`,i+` **正好是 \`0\` —— 命中！** 记录一组 \`${u(a)}\`。但别急着移动指针：\`l\` 的右边、\`r\` 的左边，可能还贴着**和它们一模一样的值**，用那些位置当指针会产出和 \`${u(a)}\` 完全相同的三元组。所以下一步必须先**去重**，再各向内走一格。`,{i:m,l:h,r:g,sum:0,sumL:h,sumR:g,hit:a}),_=`dedup`;continue}let e=h,t=g;for(;h<g&&n[h]===n[h+1];)h+=1;for(;h<g&&n[g]===n[g-1];)--g;let i=h===e?null:{from:e,to:h},a=g===t?null:{from:g,to:t};h+=1,--g;let o=[];i?o.push(`\`l\` 从 \`${e}\` 一路跳到 \`${h}\` —— \`nums[${e}..${h}]\` 是同一个值 \`${n[e]}\`，换哪个当下标都是同一个答案。`):o.push(`\`l\` 右边是 \`nums[${e+1}] = ${n[e+1]}\`，和 \`nums[${e}] = ${n[e]}\` 不同，不需要跳。`),a?o.push(`\`r\` 从 \`${t}\` 一路退到 \`${g}\` —— \`nums[${g}..${t}]\` 是同一个值 \`${n[t]}\`。`):o.push(`\`r\` 左边是 \`nums[${t-1}] = ${n[t-1]}\`，和 \`nums[${t}] = ${n[t]}\` 不同，不需要跳。`),p(`dedup`,`**第二处去重**：`+o.join(``)+` 然后左右各向内走一格，\`l = ${h}\`、\`r = ${g}\`。`+(h>=g?" 此时 `l` 和 `r` 已经交叉 —— **这一轮结束**，`i` 前进一格。":``)+` 这处去重的形态和上一处相反：它是"**事后跳过**" —— 必须先把答案记下来，才知道该从哪个位置开始跳。`,{i:m,l:h,r:g,lFrom:e,rFrom:t,dedupL:i,dedupR:a,roundOver:h>=g}),_=`inner`}let v=c.length;return p(`done`,(v===0?"扫描结束，**没有任何**三元组的和为 `0`，返回空列表。":`扫描结束。答案 = \`${d()}\`，一共 **${v} 组**，且两两不重复。`)+` 回头看这趟是怎么走完的：外层 \`i\` 从 \`0\` 推进到 \`${Math.min(m,r-3)}\`，每一轮里 \`l\` 和 \`r\` 从两端往中间夹、两者合计最多走 \`n\` 步，所以内层是 \`O(n)\`，乘上外层就是 **\`O(n²)\`**；再加上开头那次排序 \`O(n log n)\`，总量级仍然是 \`O(n²)\`。空间 \`O(1)\`（不计结果本身）。对比暴力三重循环的 \`O(n³)\`：**多花一个 \`O(n log n)\` 的排序，把内层从 \`O(n²)\` 压到 \`O(n)\`，这笔买卖非常划算**。而且排序顺带把"去重"变成了两处 \`O(1)\` 的值比较 —— **相同的数挨在一起，跳过重复就退化成"跟前一个比一比"。**`,{i:Math.min(m,r-1),l:h,r:g,roundOver:!0,done:!0}),s}var s=`tz-styles`,c=56,l=76,u=8,d=66,f=128,p=196,m=234,h=22,g=54,_=284,v=48,y=358,b=368,ee=40,x=26,te=604,ne=1180,S=`
.tz {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.tz__svg { width: 100%; height: auto; display: block; }

/* ── 顶部小字 ─────────────────────────────────────────────────────────── */
.tz-note {
  fill: var(--tz-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 数组格子 ─────────────────────────────────────────────────────────── */
.tz-cell__box {
  fill: var(--tz-fill, #ffffff);
  stroke: var(--tz-line, #c3c9c2);
  stroke-width: 1.5;
}
.tz-cell__value {
  fill: var(--tz-ink, #1f2a24);
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.tz-cell__ring {
  fill: none;
  stroke: var(--tz-gold, #c2872f);
  stroke-width: 2;
  opacity: 0;
}
/* 外层锚点 i */
.tz-cell.is-i .tz-cell__box {
  fill: var(--tz-hot-fill, #fdf1ec);
  stroke: var(--tz-hot, #a45f45);
  stroke-width: 3;
}
.tz-cell.is-i .tz-cell__value { fill: var(--tz-hot, #a45f45); }
/* 左指针 L */
.tz-cell.is-l .tz-cell__box {
  fill: var(--tz-ok-fill, #eef5f1);
  stroke: var(--tz-ok, #3f6b57);
  stroke-width: 3;
}
.tz-cell.is-l .tz-cell__value { fill: var(--tz-ok, #3f6b57); }
/* 右指针 R */
.tz-cell.is-r .tz-cell__box {
  fill: var(--tz-cool-fill, #eef1f7);
  stroke: var(--tz-cool, #4a5f8a);
  stroke-width: 3;
}
.tz-cell.is-r .tz-cell__value { fill: var(--tz-cool, #4a5f8a); }
/* 本帧命中的三个数（金色 + 外环）—— 注意和上面的"指针状态"分开，见坑 L */
.tz-cell.is-hit .tz-cell__box {
  fill: var(--tz-gold-fill, #fdf6e8);
  stroke: var(--tz-gold, #c2872f);
  stroke-width: 3;
}
.tz-cell.is-hit .tz-cell__value { fill: var(--tz-gold, #c2872f); }
.tz-cell.is-hit .tz-cell__ring { opacity: 1; }
/* 被去重跳过的格子（虚化） */
.tz-cell.is-dup .tz-cell__box {
  fill: var(--tz-dim-fill, #f4f3ef);
  stroke: var(--tz-dim, #b9b9b3);
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
}
.tz-cell.is-dup .tz-cell__value { fill: var(--tz-dim, #b9b9b3); }

/* ── 指针标签 ─────────────────────────────────────────────────────────── */
.tz-pin__tag {
  fill: var(--tz-hot, #a45f45);
}
.tz-pin__tag.is-l { fill: var(--tz-ok, #3f6b57); }
.tz-pin__tag.is-r { fill: var(--tz-cool, #4a5f8a); }
.tz-pin__text {
  fill: var(--tz-paper, #ffffff);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.tz-pin__tick {
  stroke: var(--tz-hot, #a45f45);
  stroke-width: 2;
}
.tz-pin__tick.is-l { stroke: var(--tz-ok, #3f6b57); }
.tz-pin__tick.is-r { stroke: var(--tz-cool, #4a5f8a); }

/* ── 三数之和横幅 ─────────────────────────────────────────────────────── */
.tz-banner__box {
  fill: var(--tz-banner-fill, #f4f2ec);
  stroke: var(--tz-line, #c3c9c2);
  stroke-width: 1.5;
}
.tz-banner__box.is-neg { fill: var(--tz-ok-fill, #eef5f1); stroke: var(--tz-ok, #3f6b57); }
.tz-banner__box.is-pos { fill: var(--tz-cool-fill, #eef1f7); stroke: var(--tz-cool, #4a5f8a); }
.tz-banner__box.is-zero { fill: var(--tz-gold-fill, #fdf6e8); stroke: var(--tz-gold, #c2872f); stroke-width: 2; }
.tz-banner__expr {
  fill: var(--tz-ink, #1f2a24);
  font-size: 16px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.tz-banner__verdict {
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: var(--tz-ink, #1f2a24);
}
.tz-banner__verdict.is-neg { fill: var(--tz-ok, #3f6b57); }
.tz-banner__verdict.is-pos { fill: var(--tz-cool, #4a5f8a); }
.tz-banner__verdict.is-zero { fill: var(--tz-gold, #c2872f); }

/* ── 结果 chips ───────────────────────────────────────────────────────── */
.tz-list__title {
  fill: var(--tz-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.tz-chip__box {
  fill: var(--tz-gold-fill, #fdf6e8);
  stroke: var(--tz-gold, #c2872f);
  stroke-width: 1.5;
}
.tz-chip__text {
  fill: var(--tz-gold, #c2872f);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.tz-list__empty {
  fill: var(--tz-dim, #b9b9b3);
  font-size: 13.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.tz-empty__text {
  fill: var(--tz-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function re(){if(document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=S,document.head.appendChild(e)}var C=e=>e<0?`(${e})`:`${e}`;function w(a,S={}){if(!a||a.dataset.tzMounted===`1`)return{destroy(){}};a.dataset.tzMounted=`1`,re();let w=o(S),ie=S.autoplay!==!1,T=w[0].arr,ae=w[0].original,E=T.length,D=r,O=document.createElement(`div`);O.className=`viz tz`;let k=document.createElement(`div`);k.className=`viz__stage`,O.appendChild(k);function oe(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(E<3){let e=D(`svg`,{class:`viz__svg tz__svg`,viewBox:`0 0 620 120`,role:`img`}),t=D(`text`,{class:`tz-empty__text`,x:620/2,y:120/2});return t.textContent=`数组只有 ${E} 个数，凑不出三元组`,e.appendChild(t),k.appendChild(e),O.appendChild(oe()),O.appendChild(i().root),a.textContent=``,a.appendChild(O),{destroy(){a.textContent=``,delete a.dataset.tzMounted,document.getElementById(s)?.remove()}}}let A=l,j=u,se=E*A+(E-1)*j;if(se>te){let e=te/se;A=Math.max(26,Math.floor(A*e)),j=Math.max(3,Math.floor(j*e))}let ce=T.reduce((e,t)=>Math.max(e,String(t).length),1),le=Math.max(11,Math.min(20,Math.floor((A-12)/Math.max(ce,3))+6)),ue=E*A+(E-1)*j,M=Math.max(660,x*2+ue),de=(M-ue)/2,fe=e=>de+e*(A+j),N=e=>fe(e)+A/2,pe=M-x*2,P=D(`svg`,{class:`viz__svg tz__svg`,viewBox:`0 0 ${M} 430`,role:`img`,"aria-label":`三数之和推演动画`});k.appendChild(P);let me=D(`g`,{class:`tz-notes`}),F=D(`g`,{class:`tz-cells`}),I=D(`g`,{class:`tz-marks`});P.appendChild(me),P.appendChild(F),P.appendChild(I);let L=D(`text`,{class:`tz-note`,x,y:d});L.textContent=`原数组 [${ae.join(`, `)}] · 已排序 → [${T.join(`, `)}]`,me.appendChild(L);let R=[];for(let e=0;e<E;e+=1){let t=fe(e),n=D(`g`,{class:`tz-cell`});n.appendChild(D(`rect`,{class:`tz-cell__ring`,x:t-5,y:f-5,width:A+10,height:66,rx:11})),n.appendChild(D(`rect`,{class:`tz-cell__box`,x:t,y:f,width:A,height:c,rx:8}));let r=D(`text`,{class:`tz-cell__value`,x:N(e),y:156,style:`font-size:${le}px`});r.textContent=String(T[e]),n.appendChild(r),F.appendChild(n),R.push({g:n,id:e})}function z(e){let t=D(`line`,{class:`tz-pin__tick ${e}`,x1:0,y1:0,x2:0,y2:0}),n=D(`rect`,{class:`tz-pin__tag ${e}`,x:0,y:0,width:g,height:h,rx:6}),r=D(`text`,{class:`tz-pin__text`,x:0,y:0});return I.appendChild(t),I.appendChild(n),I.appendChild(r),{tick:t,tag:n,text:r}}let B=D(`path`,{class:`tz-pin__tag`,d:`M 0 0 L 0 0 L 0 0`}),V=D(`rect`,{class:`tz-pin__tag`,x:0,y:0,width:g,height:h,rx:6}),H=D(`text`,{class:`tz-pin__text`,x:0,y:0});I.appendChild(B),I.appendChild(V),I.appendChild(H);let U=z(`is-l`),W=z(`is-r`),he=D(`rect`,{class:`tz-banner__box`,x,y:_,width:pe,height:v,rx:9}),G=D(`text`,{class:`tz-banner__expr`,x:42,y:308}),K=D(`text`,{class:`tz-banner__verdict`,x:x+pe-16,y:308});I.appendChild(he),I.appendChild(G),I.appendChild(K);let ge=D(`text`,{class:`tz-list__title`,x,y});I.appendChild(ge);let q=D(`text`,{class:`tz-list__empty`,x,y:388});q.textContent=`（还没有找到任何一组）`,I.appendChild(q);let _e=w.flatMap(e=>e.results).reduce((e,t)=>Math.max(e,`[${t.join(`, `)}]`.length),0),J=Math.min(150,Math.max(74,Math.round(_e*15*.62)+26)),Y=Math.max(1,Math.floor(614/(J+10))),ve=[];for(let e=0;e<Y;e+=1){let t=x+e*(J+10),n=D(`g`,{class:`tz-chip`});n.appendChild(D(`rect`,{class:`tz-chip__box`,x:t,y:b,width:J,height:ee,rx:8}));let r=D(`text`,{class:`tz-chip__text`,x:t+J/2,y:388,style:`font-size:15px`});n.appendChild(r),I.appendChild(n),ve.push({g:n,t:r})}let X=D(`text`,{class:`tz-list__empty`,x:x+Y*(J+10),y:388});I.appendChild(X);let Z=oe();function ye(t,n){if(!n)return;let r=n.i,i=n.l,a=n.r,o=n.phase,s=o===`done`,c=i>=0&&i===a,l=new Set;o===`hit`&&n.sumL!==null&&(l.add(n.i),l.add(n.sumL),l.add(n.sumR));let u=new Set;if(n.dedupL)for(let e=n.dedupL.from;e<=n.dedupL.to;e+=1)u.add(e);if(n.dedupR)for(let e=n.dedupR.from;e<=n.dedupR.to;e+=1)u.add(e);let d=o===`skip-i`?n.i:null;for(let e of R){let{g:t,id:n}=e;if(s){t.setAttribute(`class`,`tz-cell`);continue}let o=[`tz-cell`];(u.has(n)||n===d)&&o.push(`is-dup`),l.has(n)&&o.push(`is-hit`),n===i&&i>=0&&o.push(`is-l`),n===a&&a>=0&&!c&&o.push(`is-r`),n===r&&r>=0&&n!==d&&o.push(`is-i`),t.setAttribute(`class`,o.join(` `))}if(!s&&r>=0&&r<E){let e=N(r),t=f-2,n=t-11;B.setAttribute(`d`,`M ${e-7} ${n} L ${e+7} ${n} L ${e} ${t} z`),B.style.opacity=`1`,V.setAttribute(`x`,e-g/2),V.setAttribute(`y`,n-h-5),H.setAttribute(`x`,e),H.setAttribute(`y`,n-h/2-5),H.textContent=`i=${r}`,V.style.opacity=`1`,H.style.opacity=`1`}else B.style.opacity=`0`,V.style.opacity=`0`,H.style.opacity=`0`;let _=(e,t,n,r)=>{if(t<0||t>=E){e.tick.style.opacity=`0`,e.tag.style.opacity=`0`,e.text.style.opacity=`0`;return}let i=N(t);e.tick.setAttribute(`x1`,i),e.tick.setAttribute(`x2`,i),e.tick.setAttribute(`y1`,187),e.tick.setAttribute(`y2`,n-3),e.tick.style.opacity=`1`,e.tag.setAttribute(`x`,i-g/2),e.tag.setAttribute(`y`,n),e.text.setAttribute(`x`,i),e.text.setAttribute(`y`,n+h/2),e.text.textContent=`${r}=${t}`,e.tag.style.opacity=`1`,e.text.style.opacity=`1`};s?(_(U,-1,p,`L`),_(W,-1,m,`R`)):c?(_(U,i,p,`L=R`),_(W,-1,m,`R`)):(_(U,i,p,`L`),_(W,a,m,`R`));let v=`tz-banner__box`,y=`tz-banner__verdict`;n.sum===null?(G.textContent=o===`init`?`等待开始 · 共 ${E} 个数`:o===`pick-i`?`固定 nums[${r}] = ${T[r]}，在 [${i}..${a}] 里找和为 ${-T[r]} 的两个数`:o===`skip-i`?`nums[${r}] = ${T[r]} 与上一轮同值 —— 整轮跳过`:o===`prune`?`nums[${r}] = ${T[r]} > 0 —— 外层提前结束`:n.results.length===0?`没有和为 0 的三元组`:`结束 · 共 ${n.results.length} 组答案`,K.textContent=o===`pick-i`?`双指针夹逼`:o===`done`?`${n.results.length} 组`:``):(G.textContent=`${C(T[r])} + ${C(T[n.sumL])} + ${C(T[n.sumR])} = ${n.sum}`,n.sum<0?(v+=` is-neg`,y+=` is-neg`,K.textContent=`< 0 · 左指针右移`):n.sum>0?(v+=` is-pos`,y+=` is-pos`,K.textContent=`> 0 · 右指针左移`):(v+=` is-zero`,y+=` is-zero`,K.textContent=`= 0 · 命中`)),he.setAttribute(`class`,v),K.setAttribute(`class`,y);let b=n.results;ge.textContent=`已收集的三元组（${b.length} 组）`,q.style.opacity=b.length===0?`1`:`0`,ve.forEach((e,t)=>{let n=b[t];if(n===void 0){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`,e.t.textContent=`[${n.join(`, `)}]`}),b.length>Y?(X.textContent=`+${b.length-Y}`,X.style.opacity=`1`):X.style.opacity=`0`,e(Z,n.desc)}O.appendChild(Z);let be=i();O.appendChild(be.root),a.textContent=``,a.appendChild(O),n();let xe=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:w,controls:be,intervalMs:ne,onRender:ye});Q.jumpTo(Math.trunc(S.initialStep)||0);let $=null;return ie&&!xe&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(O)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.tzMounted,document.getElementById(s)?.remove()}}}export{w as mountThreeSum};