import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";import{n as a,t as o}from"./courseLayout-BCdN7X-Z.js";var s=4,c=[[1,0],[2,0],[3,1],[3,2]];function l(e={}){let t=Number.isInteger(e.numCourses)?e.numCourses:s,n=t>=0?t:s;return{numCourses:n,prerequisites:(Array.isArray(e.prerequisites)?e.prerequisites:c).filter(e=>Array.isArray(e)&&e.length===2&&Number.isInteger(e[0])&&Number.isInteger(e[1])&&e[0]>=0&&e[0]<n&&e[1]>=0&&e[1]<n).map(e=>[e[0],e[1]])}}function u(e={}){let{numCourses:t,prerequisites:n}=l(e),r=n.map(([e,t])=>[t,e]),i=Array.from({length:t},()=>[]),a=Array(t).fill(0);for(let[e,t]of r)i[e].push(t),a[t]+=1;for(let e of i)e.sort((e,t)=>e-t);let o=[],s=[],c=[],u=new Set,d=(e,n,i={})=>{o.push({phase:e,desc:n,numCourses:t,edges:r.map(e=>[...e]),indegree:[...a],queue:[...s],order:[...c],cur:null,relaxed:[],enqueued:[],stuck:[],answer:null,done:e===`done`,...i})};for(let e=0;e<t;e+=1)a[e]===0&&(s.push(e),u.add(e));for(d(`init`,`把 prerequisites 的 \`[a, b]\` 读成有向边 **b → a**（修 a 之前必须先修 b），先算出入度表：入度 = 它有多少门**没修的先修课**。入度为 0 的课没有任何前置，可以立刻开修 —— 第 0 层起点是 \`{${s.join(`, `)}}\`，全部入队。**入度为 0 的课永远可以第一个修**，这是 Kahn 的全部起点。`);s.length>0;){let e=s.shift();c.push(e);let t=[],n=[];for(let r of i[e])--a[r],t.push([r,a[r]]),a[r]===0&&!u.has(r)&&(s.push(r),u.add(r),n.push(r));d(`pop`,`修完第 \`${c.length}\` 门课 \`${e}\`：它的后继 `+(t.length>0?`${t.map(([e,t])=>`\`${e}\`(入度→${t})`).join(`、`)}`+(n.length>0?`，其中 \`${n.join(`、`)}\` 入度减到 0，可以开修了 →`:`，都还有前置没修 →`)+`入队 \`{${s.join(`, `)||`空`}}\`。`:`（没有后继），队列 \`{${s.join(`, `)||`空`}}\`。`)+`\`order = [${c.join(`, `)}]\`。`,{cur:e,relaxed:t,enqueued:n})}let f=c.length===t,p=[];for(let e=0;e<t;e+=1)c.includes(e)||p.push(e);return f?d(`done`,`队列空、且**出队数量 ${c.length} == numCourses ${t}**：没有课被卡住，说明图里没有环，**返回 true**；而 \`[${c.join(`, `)}]\` 本身就是一个合法修课顺序 —— 210 的答案（任意一个拓扑序都合法）。`,{answer:{possible:!0,order:[...c]},stuck:p}):d(`done`,`队列提前枯竭：只修完了 ${c.length} / ${t} 门课，剩下的 \`{${p.join(`, `)}}\` 有前置没修完 —— 它们**互相等待**（在环里）或被环卡住，**返回 false**。判据：**出队数量 == numCourses**，不是「队列空了」。`,{answer:{possible:!1,order:[...c]},stuck:p}),o}var d=`courseschedule-styles`,f=28,p=240,m=288,h=326,g=40,_=392,v=1150,y=`
.csv { display: flex; flex-direction: column; gap: 14px; }
.csv__svg { width: 100%; height: auto; display: block; }

.csv-note {
  fill: var(--csv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.csv-note--r { text-anchor: end; }

.csv-lbl {
  fill: var(--csv-muted, #657168); font-size: 11.5px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.csv-edge { stroke: var(--csv-line, #c3c9c2); stroke-width: 2; fill: none; }
.csv-arrow { fill: var(--csv-line, #c3c9c2); stroke: none; }
.csv-edge.is-relaxing { stroke: var(--csv-gold, #c2872f); stroke-width: 2.5; }
.csv-arrow.is-relaxing { fill: var(--csv-gold, #c2872f); }

.csv-node__circle { stroke: var(--csv-line, #b9c1b8); stroke-width: 2; fill: var(--csv-fill, #ffffff); }
.csv-node--done .csv-node__circle { fill: var(--csv-done, #79a892); stroke: var(--csv-done-stroke, #3f6b57); }
.csv-node--queued .csv-node__circle { fill: var(--csv-queued, #fdf3e3); stroke: var(--csv-gold, #c2872f); }
.csv-node--cur .csv-node__circle { stroke: var(--csv-gold, #c2872f); stroke-width: 3.5; }
.csv-node--stuck .csv-node__circle { stroke: var(--csv-hot, #a45f45); stroke-width: 3.5; }
.csv-node__num {
  fill: var(--csv-ink, #1f2a24); font-size: 17px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.csv-node--done .csv-node__num { fill: #ffffff; }
.csv-node--queued .csv-node__num { fill: var(--csv-gold, #c2872f); }

.csv-badge__circle {
  fill: var(--csv-fill, #ffffff); stroke: var(--csv-line, #b9c1b8); stroke-width: 1.5;
}
.csv-badge--zero .csv-badge__circle { stroke: var(--csv-ok, #3f6b57); stroke-width: 2.5; }
.csv-badge--hot .csv-badge__circle { fill: var(--csv-gold-fill, #fdf3e3); stroke: var(--csv-gold, #c2872f); stroke-width: 2.5; }
.csv-badge__num {
  fill: var(--csv-ink, #1f2a24); font-size: 11px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.csv-badge--zero .csv-badge__num { fill: var(--csv-ok, #3f6b57); }
.csv-badge--hot .csv-badge__num { fill: var(--csv-gold, #c2872f); }

.csv-chip__box { fill: var(--csv-fill, #ffffff); stroke: var(--csv-line, #c3c9c2); stroke-width: 1.5; }
.csv-chip__val {
  fill: var(--csv-ink, #1f2a24); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.csv-chip.is-front .csv-chip__box { fill: var(--csv-gold-fill, #fdf3e3); stroke: var(--csv-gold, #c2872f); stroke-width: 2.5; }
.csv-chip.is-front .csv-chip__val { fill: var(--csv-gold, #c2872f); }
.csv-chip.is-done .csv-chip__box { fill: var(--csv-ok-fill, #eef5f1); stroke: var(--csv-ok, #3f6b57); stroke-width: 2; }
.csv-chip.is-done .csv-chip__val { fill: var(--csv-ok, #3f6b57); }
.csv-empty {
  fill: var(--csv-dim, #9aa39c); font-size: 12px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.csv-banner__box {
  fill: var(--csv-banner, #f4f3ef); stroke: var(--csv-line, #c3c9c2); stroke-width: 1.5;
}
.csv-banner__text {
  fill: var(--csv-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.csv-banner__text.is-ok { fill: var(--csv-ok, #3f6b57); }

.csv-phase__text {
  fill: var(--csv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function b(){if(document.getElementById(d))return;let e=document.createElement(`style`);e.id=d,e.textContent=y,document.head.appendChild(e)}function x(s,c={}){if(!s||s.dataset.courseScheduleMounted===`1`)return{destroy(){}};s.dataset.courseScheduleMounted=`1`,b();let l=u(c),y=c.autoplay!==!1,{numCourses:x,edges:S}=l[0],C=r,w=document.createElement(`div`);w.className=`viz csv`;let T=document.createElement(`div`);T.className=`viz__stage`,w.appendChild(T);let E=C(`svg`,{class:`viz__svg csv__svg`,viewBox:`0 0 660 414`,role:`img`,"aria-label":`课程表 LC207 Kahn 拓扑排序推演动画`});T.appendChild(E);let D=C(`g`,{}),O=C(`g`,{}),k=C(`g`,{});E.append(D,O,k);let A=C(`text`,{class:`csv-note`,x:26,y:f});A.textContent=`入度表 + 队列：0 入度的课开修，修完就松开它的后继（角标 = 当前入度）`,k.appendChild(A);let j=C(`text`,{class:`csv-note csv-note--r`,x:634,y:f});j.textContent=`${x} 门课 · ${S.length} 条边`,k.appendChild(j);let{positions:M}=a(x,S),N=S.map(([e,t])=>{let n=o(M[e],M[t],24),r=C(`line`,{class:`csv-edge`,x1:n.x1,y1:n.y1,x2:n.x2,y2:n.y2}),i=C(`polygon`,{class:`csv-arrow`,points:n.head});return D.append(r,i),{line:r,head:i,from:e}}),P=[];for(let e=0;e<x;e+=1){let{x:t,y:n}=M[e],r=C(`g`,{class:`csv-node`});r.appendChild(C(`circle`,{class:`csv-node__circle`,cx:t,cy:n,r:24}));let i=C(`text`,{class:`csv-node__num`,x:t,y:n});i.textContent=String(e),r.appendChild(i),O.appendChild(r);let a=C(`g`,{class:`csv-badge`});a.appendChild(C(`circle`,{class:`csv-badge__circle`,cx:t+19,cy:n-19,r:11}));let o=C(`text`,{class:`csv-badge__num`,x:t+19,y:n-19});a.appendChild(o),k.appendChild(a),P.push({g:r,badgeG:a,badgeNum:o})}let F=C(`text`,{class:`csv-lbl`,x:26,y:253});F.textContent=`队列 queue`;let I=C(`text`,{class:`csv-lbl`,x:26,y:301});I.textContent=`顺序 order`,k.append(F,I);let L=C(`text`,{class:`csv-empty`,x:148,y:253});L.textContent=`（空 —— 没有 0 入度的课了）`,k.appendChild(L);let R=[],z=[];for(let e=0;e<16;e+=1){let t=148+e*40,n=C(`g`,{class:`csv-chip`});n.appendChild(C(`rect`,{class:`csv-chip__box`,x:t,y:p,width:34,height:26,rx:6}));let r=C(`text`,{class:`csv-chip__val`,x:t+34/2,y:253});n.appendChild(r),k.appendChild(n),R.push({g:n,val:r});let i=C(`g`,{class:`csv-chip is-done`});i.appendChild(C(`rect`,{class:`csv-chip__box`,x:t,y:m,width:34,height:26,rx:6}));let a=C(`text`,{class:`csv-chip__val`,x:t+34/2,y:301});i.appendChild(a),k.appendChild(i),z.push({g:i,val:a})}k.appendChild(C(`rect`,{class:`csv-banner__box`,x:26,y:h,width:608,height:g,rx:9}));let B=C(`text`,{class:`csv-banner__text`,x:660/2,y:346});k.appendChild(B);let V=C(`text`,{class:`csv-phase__text`,x:660/2,y:_});k.appendChild(V);let H=document.createElement(`p`);H.className=`viz__desc`,H.setAttribute(`aria-live`,`polite`);function U(t,n){if(!n)return;let r=new Set(n.queue),i=new Set(n.order),a=new Set(n.stuck),o=new Set(n.relaxed.map(([e])=>e));N.forEach(({line:e,head:t,from:r})=>{let i=n.phase===`pop`&&n.cur===r?` is-relaxing`:``;e.setAttribute(`class`,`csv-edge${i}`),t.setAttribute(`class`,`csv-arrow${i}`)}),P.forEach((e,t)=>{let s=[`csv-node`];i.has(t)?s.push(`csv-node--done`):r.has(t)&&s.push(`csv-node--queued`),n.phase===`pop`&&n.cur===t&&s.push(`csv-node--cur`),n.phase===`done`&&a.has(t)&&s.push(`csv-node--stuck`),e.g.setAttribute(`class`,s.join(` `)),e.badgeNum.textContent=String(n.indegree[t]);let c=[`csv-badge`];n.indegree[t]===0&&c.push(`csv-badge--zero`),o.has(t)&&c.push(`csv-badge--hot`),e.badgeG.setAttribute(`class`,c.join(` `))});let s=n.queue;L.style.display=s.length===0?``:`none`;let c=Math.min(s.length,R.length);R.forEach((e,t)=>{if(t>=c){e.g.style.display=`none`;return}e.g.style.display=``,e.val.textContent=String(s[t]),e.g.setAttribute(`class`,`csv-chip`+(t===0?` is-front`:``))});let l=Math.min(n.order.length,z.length);if(z.forEach((e,t)=>{if(t>=l){e.g.style.display=`none`;return}e.g.style.display=``,e.val.textContent=String(n.order[t]),e.g.setAttribute(`class`,`csv-chip is-done`)}),n.phase===`init`)B.textContent=`全部 0 入度的课入队：{${n.queue.join(`, `)}}`,B.setAttribute(`class`,`csv-banner__text`);else if(n.phase===`pop`){let e=n.relaxed.length?`，后继 ${n.relaxed.map(([e,t])=>`${e}(${t})`).join(`、`)}`:``;B.textContent=`修完第 ${n.order.length} 门：课程 ${n.cur}${e}`+(n.enqueued.length?`　→ 入队 {${n.enqueued.join(`, `)}}`:``),B.setAttribute(`class`,`csv-banner__text`)}else n.answer?.possible?(B.textContent=`答案 = [${n.answer.order.join(`, `)}]（合法拓扑序）`,B.setAttribute(`class`,`csv-banner__text is-ok`)):(B.textContent=`返回 false：课程 {${n.stuck.join(`, `)}} 互相等待，修不完`,B.setAttribute(`class`,`csv-banner__text`));n.phase===`init`?V.textContent=`入度 = 还有几门「没修的先修课」；0 入度 = 现在就能修`:n.phase===`pop`?V.textContent=`取出一门课 → 它的后继入度 −1，减到 0 的立刻入队`:n.answer?.possible?V.textContent=`出队数量 == 课程数 ⇔ 没有环 ⇔ 能修完所有课`:V.textContent=`出队数量 < 课程数：剩下的课在环里（或等环），返回 false`,e(H,n.desc)}w.appendChild(H);let W=i();w.appendChild(W.root),s.textContent=``,s.appendChild(w),n();let G=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,K=t({steps:l,controls:W,intervalMs:v,onRender:U});K.jumpTo(Math.trunc(c.initialStep)||0);let q=null;return y&&!G&&typeof IntersectionObserver==`function`&&(q=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){q.disconnect(),q=null,K.play();return}},{threshold:.35}),q.observe(w)),{destroy(){q&&=(q.disconnect(),null),K.destroy(),s.textContent=``,delete s.dataset.courseScheduleMounted,document.getElementById(d)?.remove()}}}export{x as mountCourseSchedule};