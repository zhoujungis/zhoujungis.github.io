import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[[1,1,0,0,0],[1,1,0,0,0],[0,0,1,0,0],[0,0,0,1,1]];function o(e={}){let t=(Array.isArray(e.grid)?e.grid:[]).filter(e=>Array.isArray(e)&&e.length>0).map(e=>e.map(e=>+(e===1||e===`1`)));return{grid:t.length>0&&t[0].length>0?t:a.map(e=>[...e])}}function s(e={}){let{grid:t}=o(e),n=t.length,r=t[0].length,i=(e,t)=>`${e},${t}`,a=new Map,s=e=>{let t=e;for(;a.get(t)!==t;)t=a.get(t);let n=e;for(;a.get(n)!==t;){let e=a.get(n);a.set(n,t),n=e}return t},c=[],l=(e,i,o={})=>{c.push({phase:e,desc:i,grid:t.map(e=>[...e]),m:n,n:r,parent:Object.fromEntries(a),count:0,cur:null,neighbor:null,merged:!1,done:e===`done`,...o})};l(`init`,'换一台机器：**并查集**。每块陆地先自成一个集合（`count += 1`），扫描时把它和**上方、左方**的陆地合并 —— 合并成功一次，连通块数 `count -= 1`。一行行推进，扫完时 `count` 就是岛屿数。全程**没有递归、没有栈**，不存在 DFS 那种"调用栈深过最长的岛"的问题。',{count:0});let u=0;for(let e=0;e<n;e+=1)for(let o=0;o<r;o+=1)if(t[e][o]===1){a.set(i(e,o),i(e,o)),u+=1,l(`add`,`扫到陆地 \`(${e}, ${o})\`：先让它**自成一个集合**（父指针指向自己），\`count = ${u}\`。接下来看它上方 \`(${e-1}, ${o})\`、左方 \`(${e}, ${o-1})\` 是否也是陆地。`,{count:u,cur:[e,o]});for(let[c,d]of[[e-1,o],[e,o-1]]){if(c<0||c>=n||d<0||d>=r||t[c][d]!==1)continue;let f=s(i(e,o)),p=s(i(c,d)),m=!1;f!==p&&(a.set(f,p),--u,m=!0),l(`union`,`与${c===e?`左方`:`上方`} \`(${c}, ${d})\` 合并：\`(${e}, ${o})\` 的根是 \`${f}\`、\`(${c}, ${d})\` 的根是 \`${p}\` —— `+(m?`**根不同**，把 \`${f}\` 挂到 \`${p}\` 下，连通块合并，\`count = ${u}\`。`:`**已经同根**（本就属于同一块），不重复合并。`)+'并查集用"根是否相同"天然去重，不需要额外的 `visited`。',{count:u,cur:[e,o],neighbor:[c,d],merged:m})}}return l(`done`,`扫描结束，返回 **${u}**。\`count\` 从 0 起：**每加一块陆地 +1、每次成功合并 -1**，最后剩下的就是连通块（岛屿）数。并查集的杀手锏不是这题本身，而是**动态加陆地**：若陆地一块块地出现（LC 305），染色法要从头重算，并查集却能**增量维护**答案。`,{count:u,done:!0}),c}var c=`islandsuf-styles`,l=28,u=30,d=74,f=40,p=300,m=334,h=74,g=76,_=162,v=90,y=292,b=40,x=360,S=1150,C=[`#79a892`,`#c2872f`,`#8aa0c0`,`#b08fb0`,`#a4b06a`,`#c08a8a`],w=`
.ufv { display: flex; flex-direction: column; gap: 14px; }
.ufv__svg { width: 100%; height: auto; display: block; }

.ufv-note {
  fill: var(--ufv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ufv-note--r { text-anchor: end; }

.ufv-lbl {
  fill: var(--ufv-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.ufv-cell__box { stroke: var(--ufv-line, #c3c9c2); stroke-width: 1.5; }
.ufv-cell--water .ufv-cell__box { fill: var(--ufv-water, #eef2ee); stroke: var(--ufv-line, #d8ded6); }
.ufv-cell.is-cur .ufv-cell__box { stroke: var(--ufv-gold, #c2872f); stroke-width: 3.5; }
.ufv-cell.is-nbr .ufv-cell__box { stroke: var(--ufv-ok, #3f6b57); stroke-width: 3; }
.ufv-cell__val {
  fill: var(--ufv-ink, #1f2a24); font-size: 9px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ufv-cell--water .ufv-cell__val { fill: var(--ufv-dim, #b3bbb3); }

.ufv-box {
  fill: var(--ufv-fill, #ffffff); stroke: var(--ufv-line, #c3c9c2); stroke-width: 1.5;
}
.ufv-count__label {
  fill: var(--ufv-muted, #657168); font-size: 11.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ufv-count__num {
  fill: var(--ufv-ok, #3f6b57); font-size: 30px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ufv-count__num.is-bumped { fill: var(--ufv-gold, #c2872f); }

.ufv-status__t {
  fill: var(--ufv-ink, #1f2a24); font-size: 12px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ufv-status__t.is-ok { fill: var(--ufv-ok, #3f6b57); font-weight: 700; }
.ufv-status__t.is-muted { fill: var(--ufv-muted, #657168); }

.ufv-caption {
  fill: var(--ufv-muted, #657168); font-size: 11px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.ufv-banner__box {
  fill: var(--ufv-banner, #f4f3ef); stroke: var(--ufv-line, #c3c9c2); stroke-width: 1.5;
}
.ufv-banner__text {
  fill: var(--ufv-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ufv-banner__text.is-ok { fill: var(--ufv-ok, #3f6b57); }

.ufv-phase__text {
  fill: var(--ufv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function T(){if(document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=w,document.head.appendChild(e)}function E(a,o={}){if(!a||a.dataset.islandsUfMounted===`1`)return{destroy(){}};a.dataset.islandsUfMounted=`1`,T();let w=s(o),E=o.autoplay!==!1,{grid:D,m:O,n:k}=w[0],A=r,j=document.createElement(`div`);j.className=`viz ufv`;let M=document.createElement(`div`);M.className=`viz__stage`,j.appendChild(M);let N=A(`svg`,{class:`viz__svg ufv__svg`,viewBox:`0 0 660 382`,role:`img`,"aria-label":`岛屿数量 LC200 并查集推演动画`});M.appendChild(N);let P=A(`g`,{}),F=A(`g`,{});N.append(P,F);let I=A(`text`,{class:`ufv-note`,x:26,y:l});I.textContent=`每块陆地自成集合，与上/左相邻陆地合并：合并一次 count−1`,F.appendChild(I);let L=A(`text`,{class:`ufv-note ufv-note--r`,x:634,y:l});L.textContent=`${O} × ${k} 网格`,F.appendChild(L);let R=[];for(let e=0;e<O;e+=1){let t=[];for(let n=0;n<k;n+=1){let r=u+n*46,i=d+e*46,a=A(`g`,{class:`ufv-cell`}),o=A(`rect`,{class:`ufv-cell__box`,x:r,y:i,width:f,height:f,rx:6}),s=A(`text`,{class:`ufv-cell__val`,x:r+f/2,y:i+f/2});a.append(o,s),P.appendChild(a),t.push({g:a,box:o,val:s})}R.push(t)}F.appendChild(A(`rect`,{class:`ufv-box`,x:p,y:h,width:m,height:g,rx:9}));let z=A(`text`,{class:`ufv-count__label`,x:467,y:92});z.textContent=`连通块数 count`;let B=A(`text`,{class:`ufv-count__num`,x:467,y:124});F.append(z,B),F.appendChild(A(`rect`,{class:`ufv-box`,x:p,y:_,width:m,height:v,rx:9}));let V=A(`text`,{class:`ufv-lbl`,x:312,y:180});V.textContent=`本步`,F.appendChild(V);let H=A(`text`,{class:`ufv-status__t`,x:312,y:206}),U=A(`text`,{class:`ufv-status__t`,x:312,y:230});F.append(H,U);let W=A(`text`,{class:`ufv-caption`,x:u,y:277});W.textContent=`同色的陆地 = 同一个根（同一座岛）；格子里是它当前的根坐标`,F.appendChild(W),F.appendChild(A(`rect`,{class:`ufv-banner__box`,x:26,y,width:608,height:b,rx:9}));let G=A(`text`,{class:`ufv-banner__text`,x:660/2,y:312});F.appendChild(G);let K=A(`text`,{class:`ufv-phase__text`,x:660/2,y:x});F.appendChild(K);let q=document.createElement(`p`);q.className=`viz__desc`,q.setAttribute(`aria-live`,`polite`);let J=(e,t)=>{let n=t;for(;e[n]!==void 0&&e[n]!==n;)n=e[n];return n};function Y(t,n){if(!n)return;let r=n.parent,i=new Map;for(let e=0;e<O;e+=1)for(let t=0;t<k;t+=1){let a=`${e},${t}`;if(n.grid[e][t]!==1||r[a]===void 0)continue;let o=J(r,a);i.has(o)||i.set(o,C[i.size%C.length])}let a=n.cur?`${n.cur[0]},${n.cur[1]}`:null,o=n.neighbor?`${n.neighbor[0]},${n.neighbor[1]}`:null;for(let e=0;e<O;e+=1)for(let t=0;t<k;t+=1){let s=R[e][t],c=n.grid[e][t]===1,l=`${e},${t}`,u=[`ufv-cell`];if(!c)u.push(`ufv-cell--water`),s.val.textContent=``,s.box.setAttribute(`fill`,``);else if(r[l]===void 0)s.box.setAttribute(`fill`,`#dbe7df`),s.val.textContent=``;else{let e=J(r,l);s.box.setAttribute(`fill`,i.get(e)||`#79a892`),s.val.textContent=e}o===`${e},${t}`&&u.push(`is-nbr`),a===`${e},${t}`&&u.push(`is-cur`),s.g.setAttribute(`class`,u.join(` `))}if(B.textContent=String(n.count),B.setAttribute(`class`,`ufv-count__num`+(n.phase===`add`?` is-bumped`:``)),n.phase===`init`)H.textContent=`parent = { }`,H.setAttribute(`class`,`ufv-status__t is-muted`),U.textContent=`每块陆地一个集合`,U.setAttribute(`class`,`ufv-status__t is-muted`);else if(n.phase===`add`)H.textContent=`新增集合 (${n.cur[0]},${n.cur[1]})`,H.setAttribute(`class`,`ufv-status__t is-ok`),U.textContent=`count += 1 → ${n.count}`,U.setAttribute(`class`,`ufv-status__t`);else if(n.phase===`union`){let e=J(r,`${n.cur[0]},${n.cur[1]}`),t=J(r,`${n.neighbor[0]},${n.neighbor[1]}`);H.textContent=`根 ${e}  vs  根 ${t}`,H.setAttribute(`class`,`ufv-status__t`),U.textContent=n.merged?`根不同 → 合并，count − 1 → ${n.count}`:`已同根 → 不合并`,U.setAttribute(`class`,`ufv-status__t`+(n.merged?` is-ok`:` is-muted`))}else H.textContent=`最终 count = ${n.count}`,H.setAttribute(`class`,`ufv-status__t is-ok`),U.textContent=`= 岛屿数`,U.setAttribute(`class`,`ufv-status__t is-muted`);n.phase===`init`?(G.textContent=`并查集：每块陆地一个集合，相邻陆地就合并`,G.setAttribute(`class`,`ufv-banner__text`)):n.phase===`add`?(G.textContent=`新增陆地 (${n.cur[0]}, ${n.cur[1]})　count = ${n.count}`,G.setAttribute(`class`,`ufv-banner__text`)):n.phase===`union`?(G.textContent=n.merged?`合并 (${n.cur[0]},${n.cur[1]}) + (${n.neighbor[0]},${n.neighbor[1]})　count = ${n.count}`:`(${n.cur[0]},${n.cur[1]}) 与 (${n.neighbor[0]},${n.neighbor[1]}) 已同根，跳过`,G.setAttribute(`class`,`ufv-banner__text`+(n.merged?` is-ok`:``))):(G.textContent=`答案 = ${n.count} 座岛（连通块数）`,G.setAttribute(`class`,`ufv-banner__text is-ok`)),n.phase===`init`?K.textContent=`无递归、无栈：并查集把"连通"变成"合并集合"`:n.phase===`add`?K.textContent=`每加一块陆地 count += 1，先假定它是一座孤岛`:n.phase===`union`?K.textContent=n.merged?`成功合并一次，连通块数 -1`:`根已相同 —— 并查集天然去重，不需要 visited`:K.textContent=`count = 陆地数 − 成功合并数；动态加陆地时（LC 305）可增量维护`,e(q,n.desc)}j.appendChild(q);let X=i();j.appendChild(X.root),a.textContent=``,a.appendChild(j),n();let Z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:w,controls:X,intervalMs:S,onRender:Y});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return E&&!Z&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(j)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.islandsUfMounted,document.getElementById(c)?.remove()}}}export{E as mountIslandsUf};