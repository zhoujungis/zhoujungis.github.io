import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[[1,1,0,0,0],[1,1,0,0,0],[0,0,1,0,0],[0,0,0,1,1]],o=[[-1,0],[0,1],[1,0],[0,-1]];function s(e={}){let t=(Array.isArray(e.grid)?e.grid:[]).filter(e=>Array.isArray(e)&&e.length>0).map(e=>e.map(e=>+(e===1||e===`1`)));return{grid:t.length>0&&t[0].length>0?t:a.map(e=>[...e])}}function c(e={}){let{grid:t}=s(e),n=t.length,r=t[0].length,i=Array.from({length:n},()=>Array(r).fill(!1)),a=[],c=(e,o,s={})=>{a.push({phase:e,desc:o,grid:t.map(e=>[...e]),m:n,n:r,visited:i.map(e=>[...e]),count:0,cur:null,frontier:[],pushed:[],depth:0,done:e===`done`,...s})},l=e=>`(${e[0]}, ${e[1]})`;c(`init`,`网格 ${n}×${r}，\`'1'\` 是陆地、\`'0'\` 是水；只有**上下左右**相邻算连通，斜着不算。数岛屿 = 数**连通块**：扫描全网格，遇到一块**未被访问的陆地**就 \`count += 1\`，再用一次染色把与它相连的整座岛全部标记。这里用**显式栈**做 DFS：seed 帧把新岛起点入栈并计数，pop 帧弹出一块、把它四周未访问的陆地标记后压栈。`,{count:0});let u=0;for(let e=0;e<n;e+=1)for(let a=0;a<r;a+=1){if(t[e][a]!==1||i[e][a])continue;u+=1,i[e][a]=!0;let s=[[e,a]];for(c(`seed`,`扫描到 \`(${e}, ${a})\`：是陆地且**未被访问** → 这是一座新岛，\`count = ${u}\`。把起点压栈，开始染色（栈深度 = 1，正对应递归版的第一层调用）。`,{count:u,cur:[e,a],frontier:s.map(e=>[...e]),pushed:[[e,a]],depth:s.length});s.length>0;){let[e,a]=s.pop(),d=[];for(let[c,l]of o){let o=e+c,u=a+l;o<0||o>=n||u<0||u>=r||t[o][u]!==1||i[o][u]||(i[o][u]=!0,s.push([o,u]),d.push([o,u]))}c(`pop`,`弹出栈顶 \`(${e}, ${a})\`，检查它上下左右四邻：`+(d.length>0?`其中 ${d.map(l).join(`、`)} 是未访问的陆地 → **标记并入栈**（染进同一座岛）。`:`都没能压入新格子（水 / 已访问 / 出界）—— 这一步就走到头了。`)+`当前栈：${s.length?s.map(l).join(` `):`空`}，栈深度 \`${s.length}\`。`,{count:u,cur:[e,a],frontier:s.map(e=>[...e]),pushed:d,depth:s.length})}}return c(`done`,`扫描结束，返回 **${u}**。每座岛在**第一次**碰到它时被计数一次（seed），之后同一座岛的所有陆地都在染色中被标记、再扫到就跳过 —— 这就是"每座岛只 +1 一次"的保证。注意整个过程用**显式栈**：把它换成递归调用，栈深度最坏可达连通块大小（\`O(m·n)\`），蛇形长岛会 \`RecursionError\` / \`StackOverflowError\` —— 这正是要防的爆栈。`,{count:u,done:!0}),a}var l=`islands-styles`,u=28,d=30,f=74,p=40,m=300,h=334,g=74,_=76,v=162,y=90,b=268,x=292,S=40,C=360,w=1150,T=`
.giv { display: flex; flex-direction: column; gap: 14px; }
.giv__svg { width: 100%; height: auto; display: block; }

.giv-note {
  fill: var(--giv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.giv-note--r { text-anchor: end; }

.giv-lbl {
  fill: var(--giv-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.giv-cell__box { stroke: var(--giv-line, #c3c9c2); stroke-width: 1.5; }
.giv-cell--land .giv-cell__box { fill: var(--giv-land, #79a892); }
.giv-cell--water .giv-cell__box { fill: var(--giv-water, #eef2ee); stroke: var(--giv-line, #d8ded6); }
.giv-cell--seen .giv-cell__box { fill: var(--giv-seen, #c7cfc8); }
.giv-cell.is-pushed .giv-cell__box { stroke: var(--giv-ok, #3f6b57); stroke-width: 3; }
.giv-cell.is-cur .giv-cell__box { stroke: var(--giv-gold, #c2872f); stroke-width: 3.5; }
.giv-cell__val {
  fill: var(--giv-ink, #1f2a24); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.giv-cell--water .giv-cell__val { fill: var(--giv-dim, #aab2ab); font-weight: 500; }

.giv-box {
  fill: var(--giv-fill, #ffffff); stroke: var(--giv-line, #c3c9c2); stroke-width: 1.5;
}
.giv-count__label {
  fill: var(--giv-muted, #657168); font-size: 11.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.giv-count__num {
  fill: var(--giv-ok, #3f6b57); font-size: 30px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.giv-count__num.is-bumped { fill: var(--giv-gold, #c2872f); }

.giv-chip__box { fill: var(--giv-fill, #ffffff); stroke: var(--giv-line, #c3c9c2); stroke-width: 1.5; }
.giv-chip.is-top .giv-chip__box {
  fill: var(--giv-gold-fill, #fdf3e3); stroke: var(--giv-gold, #c2872f); stroke-width: 2.5;
}
.giv-chip__val {
  fill: var(--giv-ink, #1f2a24); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.giv-chip.is-top .giv-chip__val { fill: var(--giv-gold, #c2872f); font-weight: 700; }
.giv-stack__empty {
  fill: var(--giv-dim, #9aa39c); font-size: 12px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.giv-swatch { stroke: var(--giv-line, #c3c9c2); stroke-width: 1.5; }
.giv-legend { fill: var(--giv-muted, #657168); font-size: 11px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.giv-banner__box {
  fill: var(--giv-banner, #f4f3ef); stroke: var(--giv-line, #c3c9c2); stroke-width: 1.5;
}
.giv-banner__text {
  fill: var(--giv-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.giv-banner__text.is-ok { fill: var(--giv-ok, #3f6b57); }

.giv-phase__text {
  fill: var(--giv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function E(){if(document.getElementById(l))return;let e=document.createElement(`style`);e.id=l,e.textContent=T,document.head.appendChild(e)}function D(a,o={}){if(!a||a.dataset.islandsMounted===`1`)return{destroy(){}};a.dataset.islandsMounted=`1`,E();let s=c(o),T=o.autoplay!==!1,{grid:D,m:O,n:k}=s[0],A=r,j=document.createElement(`div`);j.className=`viz giv`;let M=document.createElement(`div`);M.className=`viz__stage`,j.appendChild(M);let N=A(`svg`,{class:`viz__svg giv__svg`,viewBox:`0 0 660 382`,role:`img`,"aria-label":`岛屿数量 LC200 染色推演动画`});M.appendChild(N);let P=A(`g`,{}),F=A(`g`,{});N.append(P,F);let I=A(`text`,{class:`giv-note`,x:26,y:u});I.textContent=`扫描网格，遇到未访问的陆地就 +1 并染色（显式栈）`,F.appendChild(I);let L=A(`text`,{class:`giv-note giv-note--r`,x:634,y:u});L.textContent=`${O} × ${k} 网格`,F.appendChild(L);let R=[];for(let e=0;e<O;e+=1){let t=[];for(let n=0;n<k;n+=1){let r=d+n*46,i=f+e*46,a=A(`g`,{class:`giv-cell`});a.appendChild(A(`rect`,{class:`giv-cell__box`,x:r,y:i,width:p,height:p,rx:6}));let o=A(`text`,{class:`giv-cell__val`,x:r+p/2,y:i+p/2});a.appendChild(o),P.appendChild(a),t.push({g:a,val:o})}R.push(t)}F.appendChild(A(`rect`,{class:`giv-box`,x:m,y:g,width:h,height:_,rx:9}));let z=A(`text`,{class:`giv-count__label`,x:467,y:92});z.textContent=`岛屿数 count`;let B=A(`text`,{class:`giv-count__num`,x:467,y:124});F.append(z,B),F.appendChild(A(`rect`,{class:`giv-box`,x:m,y:v,width:h,height:y,rx:9}));let V=A(`text`,{class:`giv-lbl`,x:312,y:178});F.appendChild(V);let H=A(`text`,{class:`giv-stack__empty`,x:467,y:215});H.textContent=`（栈空）`,F.appendChild(H);let U=[];for(let e=0;e<4;e+=1){let t=310+e*68,n=A(`g`,{class:`giv-chip`});n.appendChild(A(`rect`,{class:`giv-chip__box`,x:t,y:216,width:60,height:24,rx:5}));let r=A(`text`,{class:`giv-chip__val`,x:t+60/2,y:228});n.appendChild(r),F.appendChild(n),U.push({g:n,val:r})}let W=[{fill:`#79a892`,text:`陆地`},{fill:`#c7cfc8`,text:`已访问`},{fill:`#eef2ee`,text:`水`}],G=d;for(let e of W){F.appendChild(A(`rect`,{class:`giv-swatch`,x:G,y:b,width:18,height:18,rx:4,fill:e.fill}));let t=A(`text`,{class:`giv-legend`,x:G+24,y:277});t.textContent=e.text,F.appendChild(t),G+=24+e.text.length*13+20}F.appendChild(A(`rect`,{class:`giv-banner__box`,x:26,y:x,width:608,height:S,rx:9}));let K=A(`text`,{class:`giv-banner__text`,x:660/2,y:312});F.appendChild(K);let q=A(`text`,{class:`giv-phase__text`,x:660/2,y:C});F.appendChild(q);let J=document.createElement(`p`);J.className=`viz__desc`,J.setAttribute(`aria-live`,`polite`);function Y(t,n){if(!n)return;let r=n.cur?`${n.cur[0]},${n.cur[1]}`:null,i=new Set(n.pushed.map(e=>`${e[0]},${e[1]}`));R.forEach((e,t)=>{e.forEach((e,a)=>{let o=[`giv-cell`];o.push(n.grid[t][a]===1?`giv-cell--land`:`giv-cell--water`),n.visited[t][a]&&o.push(`giv-cell--seen`),i.has(`${t},${a}`)&&o.push(`is-pushed`),r===`${t},${a}`&&o.push(`is-cur`),e.g.setAttribute(`class`,o.join(` `)),e.val.textContent=String(n.grid[t][a])})}),B.textContent=String(n.count),B.setAttribute(`class`,`giv-count__num`+(n.phase===`seed`?` is-bumped`:``));let a=n.frontier;V.textContent=`显式栈（底 → 顶）· 深度 ${n.depth}`,H.style.display=a.length===0?``:`none`;let o=Math.min(a.length,4);U.forEach((e,t)=>{if(t>=o){e.g.style.display=`none`;return}e.g.style.display=``;let n=a[t];e.val.textContent=`(${n[0]},${n[1]})`;let r=t===o-1&&a.length===o;e.g.setAttribute(`class`,`giv-chip`+(r?` is-top`:``))}),n.phase===`init`?(K.textContent=`数岛屿 = 数连通块　遇到新陆地：count += 1 再染色`,K.setAttribute(`class`,`giv-banner__text`)):n.phase===`seed`?(K.textContent=`新岛：(${n.cur[0]}, ${n.cur[1]}) → count = ${n.count}`,K.setAttribute(`class`,`giv-banner__text is-ok`)):n.phase===`pop`?(K.textContent=`弹出 (${n.cur[0]}, ${n.cur[1]})`+(n.pushed.length?`　压入 ${n.pushed.map(e=>`(${e[0]},${e[1]})`).join(` `)}`:`　无新入栈`),K.setAttribute(`class`,`giv-banner__text`)):(K.textContent=`答案 = ${n.count} 座岛`,K.setAttribute(`class`,`giv-banner__text is-ok`)),n.phase===`init`?q.textContent=`只对「未访问的陆地」计数；水和已访问的陆地直接跳过`:n.phase===`seed`?q.textContent=`seed：一座岛只在此刻 +1，之后它的陆地都会被染色`:n.phase===`pop`?q.textContent=`pop：弹栈顶、把四邻未访问的陆地标记并压栈（栈深度 = 递归版深度）`:q.textContent=`每座岛只 +1 一次；递归版在此处最坏占 O(m·n) 调用栈 → 会爆栈`,e(J,n.desc)}j.appendChild(J);let X=i();j.appendChild(X.root),a.textContent=``,a.appendChild(j),n();let Z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:s,controls:X,intervalMs:w,onRender:Y});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return T&&!Z&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(j)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.islandsMounted,document.getElementById(l)?.remove()}}}export{D as mountIslands};