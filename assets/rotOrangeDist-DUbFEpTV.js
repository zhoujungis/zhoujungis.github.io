import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[[2,1,1],[1,1,0],[0,1,1]],o=[[-1,0],[0,1],[1,0],[0,-1]];function s(e={}){let t=(Array.isArray(e.grid)?e.grid:[]).filter(e=>Array.isArray(e)&&e.length>0).map(e=>e.map(e=>e===2||e===`2`?2:+(e===1||e===`1`)));return{grid:t.length>0&&t[0].length>0?t:a.map(e=>[...e])}}function c(e={}){let{grid:t}=s(e),n=t.length,r=t[0].length,i=t.map(e=>[...e]),a=Array.from({length:n},()=>Array(r).fill(null)),c=[],l=[],u=0;for(let e=0;e<n;e+=1)for(let t=0;t<r;t+=1)i[e][t]===2?(c.push([e,t]),a[e][t]=0,l.push([e,t])):i[e][t]===1&&(u+=1);let d=[],f=0,p=0,m=e=>`(${e[0]}, ${e[1]})`,h=(e,t,o={})=>{d.push({phase:e,desc:t,grid:i.map(e=>[...e]),m:n,n:r,stamp:a.map(e=>[...e]),fresh:u,minute:f,stamped:[],sources:c.map(e=>[...e]),maxStamp:p,answer:null,done:e===`done`,...o})};for(h(`init`,c.length>0?`换一种记账：不数「第几分钟」，而是直接给每个格子盖**腐烂时刻**的章 —— 源格子 \`${c.map(m).join(`、`)}\` 的时刻是 **0**，其余格子等着被 BFS 第一次访问时盖章。这个章的值就是**到最近源的距离**：全场最大时间戳就是答案（fresh 清零时）。`:`网格里没有腐烂橘子：没有源也就没有任何格子能被盖章。`+(u===0?`（也没有新鲜橘子，答案是 0。）`:`还有 ${u} 个新鲜橘子永远烂不掉。`));l.length>0&&u>0;){f+=1;let e=[],t=[];for(let[s,c]of l)for(let[l,d]of o){let o=s+l,p=c+d;o<0||o>=n||p<0||p>=r||i[o][p]===1&&(i[o][p]=2,a[o][p]=f,--u,t.push([o,p]),e.push([o,p]))}if(t.length===0)break;p=f,l=e,h(`stamp`,`第 ${f} 分钟：给 \`${t.map(m).join(`、`)}\` 盖上 **${f}** —— 它们离最近的源正好 ${f} 步。**第一次访问即定章、之后不再改**，这正是 BFS「先到的一定最近」的性质。`,{stamped:t.map(e=>[...e])})}let g=u===0?p:-1;return g===-1?h(`done`,`BFS 结束，还有 ${u} 个新鲜橘子始终没被盖章（被空格隔开）：**返回 -1**。若换成先算「所有源的距离场」，这道题还藏着一条判据：**答案 = fresh 清零时的最大时间戳**；若最大时间戳还算不出来就有剩余，直接 -1。`,{answer:g}):h(`done`,`全场盖章完毕：**答案 = 最大时间戳 = ${g}**。注意最后一分钟不需要「再空转一轮」—— fresh 清零时的时间戳就是答案；源本身的 0 不参与取 max（答案是「最后一块被感染的格子」的时刻）。`,{answer:g}),d}var l=`rotorangedist-styles`,u=28,d=34,f=76,p=46,m=214,h=412,g=76,ee=76,_=162,v=50,y=222,b=90,x=248,S=326,C=40,w=392,T=1150,E=`
.rod { display: flex; flex-direction: column; gap: 14px; }
.rod__svg { width: 100%; height: auto; display: block; }

.rod-note {
  fill: var(--rod-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-note--r { text-anchor: end; }

.rod-lbl {
  fill: var(--rod-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.rod-cell__box { stroke: var(--rod-line, #c3c9c2); stroke-width: 1.5; }
.rod-cell--blank .rod-cell__box { fill: var(--rod-blank, #eef2ee); stroke: var(--rod-line, #d8ded6); }
.rod-cell--wait .rod-cell__box { fill: var(--rod-wait, #77a58c); }
.rod-cell--stamped .rod-cell__box { fill: var(--rod-stamped, #c2872f); }
.rod-cell.is-new .rod-cell__box {
  fill: var(--rod-new-fill, #f6ecd8); stroke: var(--rod-ok, #3f6b57); stroke-width: 3.5;
}
.rod-cell__val {
  fill: var(--rod-ink, #1f2a24); font-size: 15px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-cell--blank .rod-cell__val { fill: var(--rod-dim, #b3bbb3); font-weight: 500; }
.rod-cell--wait .rod-cell__val { fill: var(--rod-wait-ink, #24402f); }
.rod-cell--stamped .rod-cell__val { fill: var(--rod-stamped-ink, #3d2a0e); }
.rod-cell.is-new .rod-cell__val { fill: var(--rod-gold, #8a5a1c); }
.rod-src { fill: var(--rod-src, #a45f45); }

.rod-box {
  fill: var(--rod-fill, #ffffff); stroke: var(--rod-line, #c3c9c2); stroke-width: 1.5;
}
.rod-min__label {
  fill: var(--rod-muted, #657168); font-size: 11.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-min__num {
  fill: var(--rod-ink, #1f2a24); font-size: 30px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-min__num.is-running { fill: var(--rod-gold, #c2872f); }
.rod-min__num.is-neg { fill: var(--rod-hot, #a45f45); }

.rod-max__t {
  fill: var(--rod-ink, #1f2a24); font-size: 13px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-max__t.is-ok { fill: var(--rod-ok, #3f6b57); font-weight: 700; }
.rod-max__num { font-weight: 800; }

.rod-chip__box { fill: var(--rod-fill, #ffffff); stroke: var(--rod-line, #c3c9c2); stroke-width: 1.5; }
.rod-chip__val {
  fill: var(--rod-ink, #1f2a24); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-chip.is-new .rod-chip__box { fill: var(--rod-new-fill, #f6ecd8); stroke: var(--rod-ok, #3f6b57); stroke-width: 2.5; }
.rod-chip.is-new .rod-chip__val { fill: var(--rod-ok, #3f6b57); font-weight: 700; }
.rod-stamp__empty {
  fill: var(--rod-dim, #9aa39c); font-size: 12px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.rod-swatch { stroke: var(--rod-line, #c3c9c2); stroke-width: 1.5; }
.rod-legend { fill: var(--rod-muted, #657168); font-size: 11px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.rod-banner__box {
  fill: var(--rod-banner, #f4f3ef); stroke: var(--rod-line, #c3c9c2); stroke-width: 1.5;
}
.rod-banner__text {
  fill: var(--rod-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-banner__text.is-ok { fill: var(--rod-ok, #3f6b57); }

.rod-phase__text {
  fill: var(--rod-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function te(){if(document.getElementById(l))return;let e=document.createElement(`style`);e.id=l,e.textContent=E,document.head.appendChild(e)}function ne(a,o={}){if(!a||a.dataset.rotOrangeDistMounted===`1`)return{destroy(){}};a.dataset.rotOrangeDistMounted=`1`,te();let s=c(o),E=o.autoplay!==!1,{grid:ne,m:D,n:O,sources:k}=s[0],A=r,j=document.createElement(`div`);j.className=`viz rod`;let M=document.createElement(`div`);M.className=`viz__stage`,j.appendChild(M);let N=A(`svg`,{class:`viz__svg rod__svg`,viewBox:`0 0 660 414`,role:`img`,"aria-label":`腐烂的橘子 LC994 时间戳距离场推演动画`});M.appendChild(N);let P=A(`g`,{}),F=A(`g`,{});N.append(P,F);let I=A(`text`,{class:`rod-note`,x:26,y:u});I.textContent=`每个格子盖「腐烂时刻」的章：数值 = 到最近源的距离`,F.appendChild(I);let L=A(`text`,{class:`rod-note rod-note--r`,x:634,y:u});L.textContent=`${D} × ${O} 网格`,F.appendChild(L);let re=new Set(k.map(e=>`${e[0]},${e[1]}`)),R=[];for(let e=0;e<D;e+=1){let t=[];for(let n=0;n<O;n+=1){let r=d+n*54,i=f+e*54,a=A(`g`,{class:`rod-cell`});a.appendChild(A(`rect`,{class:`rod-cell__box`,x:r,y:i,width:p,height:p,rx:7}));let o=A(`text`,{class:`rod-cell__val`,x:r+p/2,y:i+p/2});a.appendChild(o),re.has(`${e},${n}`)&&a.appendChild(A(`circle`,{class:`rod-src`,cx:r+10,cy:i+10,r:4})),P.appendChild(a),t.push({g:a,val:o})}R.push(t)}F.appendChild(A(`rect`,{class:`rod-box`,x:m,y:g,width:h,height:ee,rx:9}));let z=A(`text`,{class:`rod-min__label`,x:420,y:94});z.textContent=`盖章分钟 minute`;let B=A(`text`,{class:`rod-min__num`,x:420,y:126});F.append(z,B),F.appendChild(A(`rect`,{class:`rod-box`,x:m,y:_,width:h,height:v,rx:9}));let V=A(`text`,{class:`rod-max__t`,x:230,y:187});F.appendChild(V),F.appendChild(A(`rect`,{class:`rod-box`,x:m,y,width:h,height:b,rx:9}));let H=A(`text`,{class:`rod-lbl`,x:226,y:238});F.appendChild(H);let U=A(`text`,{class:`rod-stamp__empty`,x:420,y:275});U.textContent=`（本轮没有新盖章）`,F.appendChild(U);let W=[];for(let e=0;e<10;e+=1){let t=226+e%5*72,n=252+Math.floor(e/5)*32,r=A(`g`,{class:`rod-chip`});r.appendChild(A(`rect`,{class:`rod-chip__box`,x:t,y:n,width:64,height:24,rx:5}));let i=A(`text`,{class:`rod-chip__val`,x:t+64/2,y:n+24/2});r.appendChild(i),F.appendChild(r),W.push({g:r,val:i})}let G=[{fill:`#c2872f`,text:`已盖章`},{fill:`#77a58c`,text:`待盖`},{fill:`#eef2ee`,text:`空`}],K=d;for(let e of G){F.appendChild(A(`rect`,{class:`rod-swatch`,x:K,y:x,width:18,height:18,rx:4,fill:e.fill}));let t=A(`text`,{class:`rod-legend`,x:K+24,y:257});t.textContent=e.text,F.appendChild(t),K+=24+e.text.length*13+12}F.appendChild(A(`circle`,{class:`rod-src`,cx:42,cy:274,r:4}));let q=A(`text`,{class:`rod-legend`,x:58,y:283});q.textContent=`圆点 = 源（章 = 0）`,F.appendChild(q),F.appendChild(A(`rect`,{class:`rod-banner__box`,x:26,y:S,width:608,height:C,rx:9}));let J=A(`text`,{class:`rod-banner__text`,x:660/2,y:346});F.appendChild(J);let Y=A(`text`,{class:`rod-phase__text`,x:660/2,y:w});F.appendChild(Y);let X=document.createElement(`p`);X.className=`viz__desc`,X.setAttribute(`aria-live`,`polite`);function ie(t,n){if(!n)return;let r=new Set(n.stamped.map(e=>`${e[0]},${e[1]}`));R.forEach((e,t)=>{e.forEach((e,i)=>{let a=`${t},${i}`,o=n.grid[t][i],s=n.stamp[t][i],c=[`rod-cell`];o===0?(c.push(`rod-cell--blank`),e.val.textContent=``):s===null?(c.push(`rod-cell--wait`),e.val.textContent=`—`):(c.push(`rod-cell--stamped`),e.val.textContent=String(s)),n.phase===`stamp`&&r.has(a)&&c.push(`is-new`),e.g.setAttribute(`class`,c.join(` `))})});let i=n.minute,a=!1;n.phase===`stamp`?a=!0:n.phase===`done`&&n.answer===-1?i=`−1`:n.phase===`done`&&(i=n.answer),B.textContent=String(i),B.setAttribute(`class`,`rod-min__num`+(n.phase===`done`&&n.answer===-1?` is-neg`:a?` is-running`:``)),V.textContent=`最大时间戳 max(stamp) = ${n.maxStamp} · 剩余新鲜 fresh = ${n.fresh}`,V.setAttribute(`class`,`rod-max__t`+(n.fresh===0?` is-ok`:``));let o=n.stamped;H.textContent=`本轮盖章（第 ${n.minute} 分钟）· ${o.length} 个`,U.style.display=n.phase===`stamp`?`none`:``;let s=Math.min(o.length,W.length);W.forEach((e,t)=>{if(t>=s){e.g.style.display=`none`;return}e.g.style.display=``;let r=o[t];e.val.textContent=`(${r[0]},${r[1]}) → ${n.minute}`,e.g.setAttribute(`class`,`rod-chip is-new`)}),n.phase===`init`?(J.textContent=`源盖章 0；其余格子由 BFS 第一次访问时盖章`,J.setAttribute(`class`,`rod-banner__text`)):n.phase===`stamp`?(J.textContent=`第 ${n.minute} 分钟：给 ${n.stamped.length} 个格子盖上 ${n.minute}`,J.setAttribute(`class`,`rod-banner__text`+(n.fresh===0?` is-ok`:``))):n.answer===-1?(J.textContent=`返回 −1：有新鲜橘子始终没盖上章（够不到）`,J.setAttribute(`class`,`rod-banner__text`)):(J.textContent=`答案 = 最大时间戳 = ${n.answer}`,J.setAttribute(`class`,`rod-banner__text is-ok`)),n.phase===`init`?Y.textContent=`时间戳 = 到最近源的距离 —— 这就是多源 BFS 的不变量`:n.phase===`stamp`?Y.textContent=`第一次访问即定章、之后不再改（BFS 先到的一定最近）`:n.answer===-1?Y.textContent=`还有格子盖不上章 → fresh 不为 0 → 返回 −1`:Y.textContent=`答案 = fresh 清零时的最大时间戳；源自己的 0 不参与取 max`,e(X,n.desc)}j.appendChild(X);let Z=i();j.appendChild(Z.root),a.textContent=``,a.appendChild(j),n();let ae=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:s,controls:Z,intervalMs:T,onRender:ie});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return E&&!ae&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(j)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.rotOrangeDistMounted,document.getElementById(l)?.remove()}}}export{ne as mountRotOrangeDist};