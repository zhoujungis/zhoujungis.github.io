import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[[2,1,1],[1,1,0],[0,1,1]],o=[[-1,0],[0,1],[1,0],[0,-1]];function s(e={}){let t=(Array.isArray(e.grid)?e.grid:[]).filter(e=>Array.isArray(e)&&e.length>0).map(e=>e.map(e=>e===2||e===`2`?2:+(e===1||e===`1`)));return{grid:t.length>0&&t[0].length>0?t:a.map(e=>[...e])}}function c(e={}){let{grid:t}=s(e),n=t.length,r=t[0].length,i=t.map(e=>[...e]),a=[],c=[],l=0;for(let e=0;e<n;e+=1)for(let t=0;t<r;t+=1)i[e][t]===2?(a.push([e,t]),c.push([e,t])):i[e][t]===1&&(l+=1);let u=[],d=0,f=e=>`(${e[0]}, ${e[1]})`,p=(e,t,o={})=>{u.push({phase:e,desc:t,grid:i.map(e=>[...e]),m:n,n:r,minute:d,fresh:l,queue:c.map(e=>[...e]),layer:[],processed:[],newlyRotted:[],sources:a.map(e=>[...e]),answer:null,done:e===`done`,...o})};for(p(`init`,`**多源 BFS**：初始就把**所有**腐烂橘子 \`${a.map(f).join(`、`)}\` 一起入队 —— 它们都是第 0 分钟的「源」，往外扩散的每一圈都同时出发。现在 minute = 0，还有 ${l} 个新鲜橘子。（只把其中一个源入队是本题第一大坑：分钟数会算大甚至算错。）`);c.length>0&&l>0;){let e=c.splice(0,c.length);p(`layer`,`第 ${d+1} 分钟开始：本层要处理的是队列里这 ${e.length} 个格子 \`${e.map(f).join(`、`)}\` —— 它们是上一分钟刚腐烂的那批。**先整层弹出、再统一扩散**，这样同一分钟内的格子不会互相「插队」影响。`,{layer:e.map(e=>[...e]),queue:e.map(e=>[...e])});let t=[];for(let[a,s]of e)for(let[e,u]of o){let o=a+e,d=s+u;o<0||o>=n||d<0||d>=r||i[o][d]===1&&(i[o][d]=2,--l,t.push([o,d]),c.push([o,d]))}d+=1,p(`rot`,`扩散完毕：本层 ${e.length} 个格子把四周的${t.length>0?` \`${t.map(f).join(`、`)}\` `:`新鲜橘子都`}变成腐烂`+(t.length>0?`（**入队即标记**，同一格不会被两个邻居重复腐烂）；`:`（没有新腐烂的格子）—— 队列只剩这一批，下一分钟就没得扩散了；`)+`minute = ${d}，fresh = ${l}。`,{layer:e.map(e=>[...e]),processed:e.map(e=>[...e]),newlyRotted:t.map(e=>[...e])})}return l===0?p(`done`,`所有新鲜橘子都被腐烂光了：**返回 ${d}**。要点：分钟数在「整层扩散完」之后才 +1（不是每弹一个格子都加），而且最后一轮扩散若把 fresh 清零就直接结束 —— 答案就是当前 minute。`,{answer:d}):p(`done`,`队列枯竭但还有 ${l} 个新鲜橘子：它们被空格（\`0\`）隔开，永远烂不到 —— **返回 -1**。要点：-1 的判据是「BFS 结束后 fresh 仍大于 0」，不是「队列空了」本身。`,{answer:-1}),u}var l=`rotorange-styles`,u=28,d=34,f=76,p=46,m=214,h=412,ee=76,g=76,_=162,v=50,y=222,b=90,x=248,S=326,C=40,te=392,ne=1150,w=`
.rov { display: flex; flex-direction: column; gap: 14px; }
.rov__svg { width: 100%; height: auto; display: block; }

.rov-note {
  fill: var(--rov-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-note--r { text-anchor: end; }

.rov-lbl {
  fill: var(--rov-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.rov-cell__box { stroke: var(--rov-line, #c3c9c2); stroke-width: 1.5; }
.rov-cell--empty .rov-cell__box { fill: var(--rov-empty, #eef2ee); stroke: var(--rov-line, #d8ded6); }
.rov-cell--fresh .rov-cell__box { fill: var(--rov-fresh, #77a58c); }
.rov-cell--rot .rov-cell__box { fill: var(--rov-rot, #c2872f); }
.rov-cell.is-layer .rov-cell__box { stroke: var(--rov-gold, #8a5a1c); stroke-width: 3.5; }
.rov-cell.is-new .rov-cell__box {
  fill: var(--rov-new-fill, #f6ecd8); stroke: var(--rov-ok, #3f6b57); stroke-width: 3.5;
}
.rov-cell.is-processed .rov-cell__box { stroke: var(--rov-dim, #9aa39c); stroke-width: 2.5; }
.rov-cell__val {
  fill: var(--rov-ink, #1f2a24); font-size: 15px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-cell--empty .rov-cell__val { fill: var(--rov-dim, #b3bbb3); font-weight: 500; }
.rov-cell--rot .rov-cell__val { fill: var(--rov-rot-ink, #3d2a0e); }
.rov-src { fill: var(--rov-src, #a45f45); }

.rov-box {
  fill: var(--rov-fill, #ffffff); stroke: var(--rov-line, #c3c9c2); stroke-width: 1.5;
}
.rov-min__label {
  fill: var(--rov-muted, #657168); font-size: 11.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-min__num {
  fill: var(--rov-ink, #1f2a24); font-size: 30px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-min__num.is-running { fill: var(--rov-gold, #c2872f); }
.rov-min__num.is-neg { fill: var(--rov-hot, #a45f45); }

.rov-fresh__t {
  fill: var(--rov-ink, #1f2a24); font-size: 13px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-fresh__t.is-zero { fill: var(--rov-ok, #3f6b57); font-weight: 700; }
.rov-fresh__num { font-weight: 800; }

.rov-chip__box { fill: var(--rov-fill, #ffffff); stroke: var(--rov-line, #c3c9c2); stroke-width: 1.5; }
.rov-chip__val {
  fill: var(--rov-ink, #1f2a24); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-chip.is-front .rov-chip__box { fill: var(--rov-gold-fill, #fdf3e3); stroke: var(--rov-gold, #c2872f); stroke-width: 2.5; }
.rov-chip.is-front .rov-chip__val { fill: var(--rov-gold, #c2872f); font-weight: 700; }
.rov-queue__empty {
  fill: var(--rov-dim, #9aa39c); font-size: 12px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.rov-swatch { stroke: var(--rov-line, #c3c9c2); stroke-width: 1.5; }
.rov-legend { fill: var(--rov-muted, #657168); font-size: 11px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.rov-banner__box {
  fill: var(--rov-banner, #f4f3ef); stroke: var(--rov-line, #c3c9c2); stroke-width: 1.5;
}
.rov-banner__text {
  fill: var(--rov-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-banner__text.is-ok { fill: var(--rov-ok, #3f6b57); }

.rov-phase__text {
  fill: var(--rov-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function T(){if(document.getElementById(l))return;let e=document.createElement(`style`);e.id=l,e.textContent=w,document.head.appendChild(e)}function E(a,o={}){if(!a||a.dataset.rotOrangeMounted===`1`)return{destroy(){}};a.dataset.rotOrangeMounted=`1`,T();let s=c(o),w=o.autoplay!==!1,{grid:E,m:D,n:O,sources:k}=s[0],A=r,j=document.createElement(`div`);j.className=`viz rov`;let M=document.createElement(`div`);M.className=`viz__stage`,j.appendChild(M);let N=A(`svg`,{class:`viz__svg rov__svg`,viewBox:`0 0 660 414`,role:`img`,"aria-label":`腐烂的橘子 LC994 多源 BFS 推演动画`});M.appendChild(N);let P=A(`g`,{}),F=A(`g`,{});N.append(P,F);let I=A(`text`,{class:`rov-note`,x:26,y:u});I.textContent=`所有腐烂橘子同时入队，每分钟向外扩一圈（多源 BFS）`,F.appendChild(I);let L=A(`text`,{class:`rov-note rov-note--r`,x:634,y:u});L.textContent=`${D} × ${O} 网格`,F.appendChild(L);let re=new Set(k.map(e=>`${e[0]},${e[1]}`)),R=[];for(let e=0;e<D;e+=1){let t=[];for(let n=0;n<O;n+=1){let r=d+n*54,i=f+e*54,a=A(`g`,{class:`rov-cell`});a.appendChild(A(`rect`,{class:`rov-cell__box`,x:r,y:i,width:p,height:p,rx:7}));let o=A(`text`,{class:`rov-cell__val`,x:r+p/2,y:i+p/2});a.appendChild(o),re.has(`${e},${n}`)&&a.appendChild(A(`circle`,{class:`rov-src`,cx:r+10,cy:i+10,r:4})),P.appendChild(a),t.push({g:a,val:o})}R.push(t)}F.appendChild(A(`rect`,{class:`rov-box`,x:m,y:ee,width:h,height:g,rx:9}));let z=A(`text`,{class:`rov-min__label`,x:420,y:94});z.textContent=`分钟 minute`;let B=A(`text`,{class:`rov-min__num`,x:420,y:126});F.append(z,B),F.appendChild(A(`rect`,{class:`rov-box`,x:m,y:_,width:h,height:v,rx:9}));let V=A(`text`,{class:`rov-fresh__t`,x:230,y:187});F.appendChild(V),F.appendChild(A(`rect`,{class:`rov-box`,x:m,y,width:h,height:b,rx:9}));let H=A(`text`,{class:`rov-lbl`,x:226,y:238});F.appendChild(H);let U=A(`text`,{class:`rov-queue__empty`,x:420,y:275});U.textContent=`（队列空）`,F.appendChild(U);let W=[];for(let e=0;e<10;e+=1){let t=226+e%5*72,n=252+Math.floor(e/5)*32,r=A(`g`,{class:`rov-chip`});r.appendChild(A(`rect`,{class:`rov-chip__box`,x:t,y:n,width:64,height:24,rx:5}));let i=A(`text`,{class:`rov-chip__val`,x:t+64/2,y:n+24/2});r.appendChild(i),F.appendChild(r),W.push({g:r,val:i})}let G=[{fill:`#77a58c`,text:`新鲜`},{fill:`#c2872f`,text:`腐烂`},{fill:`#eef2ee`,text:`空`}],K=d;for(let e of G){F.appendChild(A(`rect`,{class:`rov-swatch`,x:K,y:x,width:18,height:18,rx:4,fill:e.fill}));let t=A(`text`,{class:`rov-legend`,x:K+24,y:257});t.textContent=e.text,F.appendChild(t),K+=24+e.text.length*13+20}F.appendChild(A(`circle`,{class:`rov-src`,cx:42,cy:274,r:4}));let q=A(`text`,{class:`rov-legend`,x:58,y:283});q.textContent=`圆点 = 初始腐烂（源）`,F.appendChild(q),F.appendChild(A(`rect`,{class:`rov-banner__box`,x:26,y:S,width:608,height:C,rx:9}));let J=A(`text`,{class:`rov-banner__text`,x:660/2,y:346});F.appendChild(J);let Y=A(`text`,{class:`rov-phase__text`,x:660/2,y:te});F.appendChild(Y);let X=document.createElement(`p`);X.className=`viz__desc`,X.setAttribute(`aria-live`,`polite`);function ie(t,n){if(!n)return;let r=new Set(n.layer.map(e=>`${e[0]},${e[1]}`)),i=new Set(n.newlyRotted.map(e=>`${e[0]},${e[1]}`)),a=new Set(n.processed.map(e=>`${e[0]},${e[1]}`));R.forEach((e,t)=>{e.forEach((e,o)=>{let s=`${t},${o}`,c=n.grid[t][o],l=[`rov-cell`,c===0?`rov-cell--empty`:c===1?`rov-cell--fresh`:`rov-cell--rot`];n.phase===`layer`&&r.has(s)&&l.push(`is-layer`),n.phase===`rot`&&a.has(s)&&l.push(`is-processed`),n.phase===`rot`&&i.has(s)&&l.push(`is-new`),e.g.setAttribute(`class`,l.join(` `)),e.val.textContent=String(c)})});let o=n.minute,s=!1;n.phase===`layer`?(o=n.minute+1,s=!0):n.phase===`done`&&n.answer===-1?o=`−1`:n.phase===`done`&&(o=n.answer),B.textContent=String(o),B.setAttribute(`class`,`rov-min__num`+(n.phase===`done`&&n.answer===-1?` is-neg`:s?` is-running`:``)),V.textContent=`剩余新鲜 fresh = ${n.fresh}`,V.setAttribute(`class`,`rov-fresh__t`+(n.fresh===0?` is-zero`:``));let c=n.queue;H.textContent=`队列（待扩散）· 长度 ${c.length}`,U.style.display=c.length===0?``:`none`;let l=Math.min(c.length,W.length);W.forEach((e,t)=>{if(t>=l){e.g.style.display=`none`;return}e.g.style.display=``;let r=c[t];e.val.textContent=`(${r[0]},${r[1]})`;let i=n.phase===`layer`&&t===0;e.g.setAttribute(`class`,`rov-chip`+(i?` is-front`:``))}),n.phase===`init`?(J.textContent=`多源 BFS：所有腐烂橘子一起入队，第 0 分钟`,J.setAttribute(`class`,`rov-banner__text`)):n.phase===`layer`?(J.textContent=`第 ${n.minute+1} 分钟：本层 ${n.layer.length} 个格子同时扩散`,J.setAttribute(`class`,`rov-banner__text`)):n.phase===`rot`?(J.textContent=n.newlyRotted.length>0?`第 ${n.minute} 分钟：新腐烂 ${n.newlyRotted.length} 个 · fresh = ${n.fresh}`:`第 ${n.minute} 分钟：无新腐烂 —— 队列即将断流`,J.setAttribute(`class`,`rov-banner__text`+(n.fresh===0?` is-ok`:``))):n.answer===-1?(J.textContent=`返回 −1：还有 ${n.fresh} 个新鲜橘子够不到`,J.setAttribute(`class`,`rov-banner__text`)):(J.textContent=`答案 = ${n.answer} 分钟`,J.setAttribute(`class`,`rov-banner__text is-ok`)),n.phase===`init`?Y.textContent=`初始就把「所有」腐烂橘子入队 —— 它们是第 0 分钟同时出发的多个源`:n.phase===`layer`?Y.textContent=`整层弹出、统一扩散：同一分钟内的格子互不插队`:n.phase===`rot`?Y.textContent=`入队即标记（变 2 并立刻入队），每个格子最多腐烂一次`:n.answer===-1?Y.textContent=`−1 的判据：BFS 结束后 fresh 仍大于 0，而不是「队列空了」本身`:Y.textContent=`分钟数在整层扩散完后才 +1；fresh 清零就直接结束`,e(X,n.desc)}j.appendChild(X);let Z=i();j.appendChild(Z.root),a.textContent=``,a.appendChild(j),n();let ae=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:s,controls:Z,intervalMs:ne,onRender:ie});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return w&&!ae&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(j)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.rotOrangeMounted,document.getElementById(l)?.remove()}}}export{E as mountRotOrange};