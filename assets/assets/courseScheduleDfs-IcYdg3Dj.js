import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";import{n as a,t as o}from"./courseLayout-BCdN7X-Z.js";var s=4,c=[[1,0],[2,0],[3,1],[3,2]];function l(e={}){let t=Number.isInteger(e.numCourses)?e.numCourses:s,n=t>=0?t:s;return{numCourses:n,prerequisites:(Array.isArray(e.prerequisites)?e.prerequisites:c).filter(e=>Array.isArray(e)&&e.length===2&&Number.isInteger(e[0])&&Number.isInteger(e[1])&&e[0]>=0&&e[0]<n&&e[1]>=0&&e[1]<n).map(e=>[e[0],e[1]])}}function u(e={}){let{numCourses:t,prerequisites:n}=l(e),r=n.map(([e,t])=>[t,e]),i=Array.from({length:t},()=>[]);for(let[e,t]of r)i[e].push(t);for(let e of i)e.sort((e,t)=>e-t);let a=[],o=Array(t).fill(0),s=[],c=[],u=(e,n,i={})=>{a.push({phase:e,desc:n,numCourses:t,edges:r.map(e=>[...e]),color:[...o],stack:[...s],post:[...c],cur:null,target:null,answer:null,done:e===`done`,...i})};u(`init`,`DFS 三色标记：**白** = 没碰过、**灰** = 正在递归栈里（还没探完它的邻居）、**黑** = 已确认安全。沿边往下走：碰到**白**就入栈变灰继续；碰到**灰**，说明边指回了当前递归栈里的节点 —— **有环**；碰到**黑**直接跳过（它的路已经验过安全）。一门课**变黑时**追加到后序列表，**后序反转就是拓扑序**。`);let d=null;outer:for(let e=0;e<t;e+=1){if(o[e]!==0)continue;o[e]=1,s.push(e),u(`enter`,`出发：课程 \`${e}\` 白 → 灰，压入递归栈 \`[${s.join(`, `)}]\` —— 开始探测它的后继（先修课指向后修课）。`,{cur:e});let t=[{node:e,idx:0}];for(;t.length>0;){let e=t[t.length-1],n=e.node,r=i[n];if(e.idx<r.length){let i=r[e.idx];if(e.idx+=1,o[i]===1){d={from:n,to:i},u(`cycle`,`探到课程 \`${n}\` 的后继 \`${i}\` —— 它是**灰色**、还在递归栈里 \`[${s.join(`, `)}]\`：边 \`${n} → ${i}\` 指回了祖先，**环被抓住**（课程 ${i} → … → ${n} → ${i}）。有环 = 有课永远修不完 → 返回 **false**。`,{cur:n,target:i});break outer}o[i]===0&&(o[i]=1,s.push(i),t.push({node:i,idx:0}),u(`enter`,`课程 \`${n}\` 的后继 \`${i}\` 是白色的：白 → 灰，压栈 \`[${s.join(`, `)}]\`，继续往下探。`,{cur:i}))}else t.pop(),s.pop(),o[n]=2,c.push(n),u(`finish`,`课程 \`${n}\` 的邻居全部处理完：灰 → 黑，弹栈（栈 = \`[${s.join(`, `)||`空`}]\`），追加后序 \`[${c.join(`, `)}]\` —— 它的所有**后继**都已排在它后面。`,{cur:n})}}if(d)u(`done`,`发现过环（\`${d.from} → ${d.to}\` 的灰色回边）：**返回 false**，不存在任何修课顺序。三色法的判环口径：**只要出现过灰色回边，就有环** —— 黑色邻居不算（那是另一条安全的路汇合）。`,{answer:{possible:!1,order:[]},cur:d.from,target:d.to});else{let e=[...c].reverse();u(`done`,`所有课程都变黑，没有灰色回边 → **返回 true**；后序 \`[${c.join(`, `)}]\` 反转得到 \`[${e.join(`, `)}]\` —— 一个合法修课顺序（210 的答案）。注意：它是**后序的反转**，不是后序本身 —— 后序最后才轮到「所有后继都安全的起点」。`,{answer:{possible:!0,order:e}})}return a}var d=`coursescheduledfs-styles`,f=28,p=240,m=288,h=326,g=40,_=392,v=1150,y=`
.cdf { display: flex; flex-direction: column; gap: 14px; }
.cdf__svg { width: 100%; height: auto; display: block; }

.cdf-note {
  fill: var(--cdf-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.cdf-note--r { text-anchor: end; }

.cdf-lbl {
  fill: var(--cdf-muted, #657168); font-size: 11.5px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.cdf-edge { stroke: var(--cdf-line, #c3c9c2); stroke-width: 2; fill: none; }
.cdf-arrow { fill: var(--cdf-line, #c3c9c2); stroke: none; }
.cdf-edge.is-cycle { stroke: var(--cdf-hot, #a45f45); stroke-width: 3.5; }
.cdf-arrow.is-cycle { fill: var(--cdf-hot, #a45f45); }

.cdf-node__circle { stroke: var(--cdf-line, #b9c1b8); stroke-width: 2; fill: var(--cdf-white-fill, #ffffff); }
.cdf-node--gray .cdf-node__circle { fill: var(--cdf-gray, #98a29a); stroke: var(--cdf-gray-stroke, #657168); }
.cdf-node--black .cdf-node__circle { fill: var(--cdf-ink, #1f2a24); stroke: var(--cdf-ink, #1f2a24); }
.cdf-node--cur .cdf-node__circle { stroke: var(--cdf-gold, #c2872f); stroke-width: 3.5; }
.cdf-node--cycle .cdf-node__circle { stroke: var(--cdf-hot, #a45f45); stroke-width: 3.5; }
.cdf-node__num {
  fill: var(--cdf-ink, #1f2a24); font-size: 17px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.cdf-node--gray .cdf-node__num, .cdf-node--black .cdf-node__num { fill: #ffffff; }

.cdf-chip__box { fill: var(--cdf-fill, #ffffff); stroke: var(--cdf-line, #c3c9c2); stroke-width: 1.5; }
.cdf-chip__val {
  fill: var(--cdf-ink, #1f2a24); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.cdf-chip.is-gray .cdf-chip__box { fill: var(--cdf-gray, #98a29a); stroke: var(--cdf-gray-stroke, #657168); stroke-width: 2; }
.cdf-chip.is-gray .cdf-chip__val { fill: #ffffff; }
.cdf-chip.is-post .cdf-chip__box { fill: var(--cdf-ok-fill, #eef5f1); stroke: var(--cdf-ok, #3f6b57); stroke-width: 2; }
.cdf-chip.is-post .cdf-chip__val { fill: var(--cdf-ok, #3f6b57); }
.cdf-chip.is-rev .cdf-chip__box { fill: var(--cdf-gold-fill, #fdf3e3); stroke: var(--cdf-gold, #c2872f); stroke-width: 2; }
.cdf-chip.is-rev .cdf-chip__val { fill: var(--cdf-gold, #c2872f); }
.cdf-empty {
  fill: var(--cdf-dim, #9aa39c); font-size: 12px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.cdf-banner__box {
  fill: var(--cdf-banner, #f4f3ef); stroke: var(--cdf-line, #c3c9c2); stroke-width: 1.5;
}
.cdf-banner__text {
  fill: var(--cdf-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.cdf-banner__text.is-ok { fill: var(--cdf-ok, #3f6b57); }

.cdf-phase__text {
  fill: var(--cdf-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function b(){if(document.getElementById(d))return;let e=document.createElement(`style`);e.id=d,e.textContent=y,document.head.appendChild(e)}function x(s,c={}){if(!s||s.dataset.courseScheduleDfsMounted===`1`)return{destroy(){}};s.dataset.courseScheduleDfsMounted=`1`,b();let l=u(c),y=c.autoplay!==!1,{numCourses:x,edges:S}=l[0],C=r,w=document.createElement(`div`);w.className=`viz cdf`;let T=document.createElement(`div`);T.className=`viz__stage`,w.appendChild(T);let E=C(`svg`,{class:`viz__svg cdf__svg`,viewBox:`0 0 660 414`,role:`img`,"aria-label":`课程表 LC207 DFS 三色标记推演动画`});T.appendChild(E);let D=C(`g`,{}),O=C(`g`,{}),k=C(`g`,{});E.append(D,O,k);let A=C(`text`,{class:`cdf-note`,x:26,y:f});A.textContent=`白 = 没访问 · 灰 = 递归栈里 · 黑 = 已确认安全（灰色回边 = 环）`,k.appendChild(A);let j=C(`text`,{class:`cdf-note cdf-note--r`,x:634,y:f});j.textContent=`${x} 门课 · ${S.length} 条边`,k.appendChild(j);let{positions:M}=a(x,S),N=S.map(([e,t])=>{let n=o(M[e],M[t],24),r=C(`line`,{class:`cdf-edge`,x1:n.x1,y1:n.y1,x2:n.x2,y2:n.y2}),i=C(`polygon`,{class:`cdf-arrow`,points:n.head});return D.append(r,i),{line:r,head:i,from:e,to:t}}),P=[];for(let e=0;e<x;e+=1){let{x:t,y:n}=M[e],r=C(`g`,{class:`cdf-node`});r.appendChild(C(`circle`,{class:`cdf-node__circle`,cx:t,cy:n,r:24}));let i=C(`text`,{class:`cdf-node__num`,x:t,y:n});i.textContent=String(e),r.appendChild(i),O.appendChild(r),P.push(r)}let F=C(`text`,{class:`cdf-lbl`,x:26,y:253});F.textContent=`递归栈 stack`;let I=C(`text`,{class:`cdf-lbl`,x:26,y:301});I.textContent=`后序 post`,k.append(F,I);let L=C(`text`,{class:`cdf-empty`,x:148,y:253});L.textContent=`（空）`,k.appendChild(L);let R=[],z=[];for(let e=0;e<16;e+=1){let t=148+e*40,n=C(`g`,{class:`cdf-chip is-gray`});n.appendChild(C(`rect`,{class:`cdf-chip__box`,x:t,y:p,width:34,height:26,rx:6}));let r=C(`text`,{class:`cdf-chip__val`,x:t+34/2,y:253});n.appendChild(r),k.appendChild(n),R.push({g:n,val:r});let i=C(`g`,{class:`cdf-chip is-post`});i.appendChild(C(`rect`,{class:`cdf-chip__box`,x:t,y:m,width:34,height:26,rx:6}));let a=C(`text`,{class:`cdf-chip__val`,x:t+34/2,y:301});i.appendChild(a),k.appendChild(i),z.push({g:i,val:a})}k.appendChild(C(`rect`,{class:`cdf-banner__box`,x:26,y:h,width:608,height:g,rx:9}));let B=C(`text`,{class:`cdf-banner__text`,x:660/2,y:346});k.appendChild(B);let V=C(`text`,{class:`cdf-phase__text`,x:660/2,y:_});k.appendChild(V);let H=document.createElement(`p`);H.className=`viz__desc`,H.setAttribute(`aria-live`,`polite`);function U(t,n){if(!n)return;new Set(n.stack),N.forEach(({line:e,head:t,from:r,to:i})=>{let a=n.phase===`cycle`&&n.cur===r&&n.target===i?` is-cycle`:``;e.setAttribute(`class`,`cdf-edge${a}`),t.setAttribute(`class`,`cdf-arrow${a}`)}),P.forEach((e,t)=>{let r=[`cdf-node`];n.color[t]===1?r.push(`cdf-node--gray`):n.color[t]===2&&r.push(`cdf-node--black`),(n.phase===`enter`||n.phase===`finish`)&&n.cur===t&&r.push(`cdf-node--cur`),n.phase===`cycle`&&(n.cur===t||n.target===t)&&r.push(`cdf-node--cycle`),n.phase===`done`&&n.target===t&&r.push(`cdf-node--cycle`),e.setAttribute(`class`,r.join(` `))});let r=n.stack;L.style.display=r.length===0?``:`none`;let i=Math.min(r.length,R.length);R.forEach((e,t)=>{if(t>=i){e.g.style.display=`none`;return}e.g.style.display=``,e.val.textContent=String(r[t]),e.g.setAttribute(`class`,`cdf-chip is-gray`+(t===i-1?` is-rev`:``))});let a=n.post,o=Math.min(a.length,z.length);z.forEach((e,t)=>{if(t>=o){e.g.style.display=`none`;return}e.g.style.display=``,e.val.textContent=String(a[t]),e.g.setAttribute(`class`,`cdf-chip is-post`)}),n.phase===`init`?(B.textContent=`全白出发：碰到白 → 变灰压栈；碰到灰 → 环`,B.setAttribute(`class`,`cdf-banner__text`)):n.phase===`enter`?(B.textContent=`课程 ${n.cur} 白 → 灰，压栈（深度 ${n.stack.length}）`,B.setAttribute(`class`,`cdf-banner__text`)):n.phase===`finish`?(B.textContent=`课程 ${n.cur} 灰 → 黑，追加后序 → post = [${n.post.join(`, `)}]`,B.setAttribute(`class`,`cdf-banner__text`)):n.phase===`cycle`?(B.textContent=`发现灰色回边：${n.cur} → ${n.target}（${n.target} 还在递归栈里）= 有环`,B.setAttribute(`class`,`cdf-banner__text`)):n.answer?.possible?(B.textContent=`后序反转 = [${n.answer.order.join(`, `)}]（合法拓扑序）`,B.setAttribute(`class`,`cdf-banner__text is-ok`)):(B.textContent=`返回 false：出现过灰色回边，存在环`,B.setAttribute(`class`,`cdf-banner__text`)),n.phase===`init`?V.textContent=`灰 = 还没有探完邻居的节点；灰边 = 指回递归栈 = 环`:n.phase===`enter`?V.textContent=`白 → 灰：开始探索这门课的后继`:n.phase===`finish`?V.textContent=`灰 → 黑：后继全部安全，追加后序（反转即拓扑序）`:n.phase===`cycle`?V.textContent=`灰色回边 = 环 —— 与 Kahn 的「出队数量 < 课程数」是同一件事`:n.answer?.possible?V.textContent=`黑色邻居只跳过（另一条安全的路），只有灰色回边才算环`:V.textContent=`有环 ⇒ 不存在拓扑序 ⇒ 返回 false`,e(H,n.desc)}w.appendChild(H);let W=i();w.appendChild(W.root),s.textContent=``,s.appendChild(w),n();let G=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,K=t({steps:l,controls:W,intervalMs:v,onRender:U});K.jumpTo(Math.trunc(c.initialStep)||0);let q=null;return y&&!G&&typeof IntersectionObserver==`function`&&(q=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){q.disconnect(),q=null,K.play();return}},{threshold:.35}),q.observe(w)),{destroy(){q&&=(q.disconnect(),null),K.destroy(),s.textContent=``,delete s.dataset.courseScheduleDfsMounted,document.getElementById(d)?.remove()}}}export{x as mountCourseScheduleDfs};