import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[3,6,5,1,8],o=-1/0;function s(e={}){let t=(Array.isArray(e.nums)?e.nums:[]).filter(e=>Number.isInteger(e));return{nums:t.length>0?t:[...a]}}function c(e={}){let{nums:t}=s(e),n=t.length,r=[],i=[0,o,o],a=(e,a,o={})=>{r.push({phase:e,desc:a,nums:[...t],n,i:-1,x:0,rem:0,dp:[...i],prevDp:[...i],transitions:[],result:i[0],done:e===`done`,...o})};a(`init`,'换一台机器：**三格滚动 dp**。定义 `dp[j]` = 当前已扫描的前缀里，子集和 `≡ j (mod 3)` 的**最大和**（j ∈ {0, 1, 2}）。初值 `dp = [0, −∞, −∞]`：空集的和是 0、余 0；余 1、余 2 暂时不可达，给 `−∞`。对每个元素 `x`，先**快照** `old = dp`，再枚举旧状态 `j`：`dp[(j + x%3) % 3] = max(dp[...], old[j] + x)`。**先快照再写**是 0-1 背包的"每件只用一次"——不拷贝的话，同一个 `x` 会被用两遍。');for(let e=0;e<n;e+=1){let n=t[e],r=(n%3+3)%3,s=[...i],c=[];for(let e=0;e<3;e+=1){if(s[e]===o)continue;let t=(e+r)%3,a=s[e]+n,l=a>i[t];l&&(i[t]=a),c.push({from:e,to:t,prev:s[e],value:a,ok:l})}let u=c.map(e=>`\`dp[${e.from}]\`(=${l(e.prev)}) + ${n} → \`dp[${e.to}]\` = ${e.value}${e.ok?` ✓`:`（没刷新）`}`).join(`；`);a(`fill`,`处理 \`nums[${e}] = ${n}\`（余 ${r}）：逐个试旧状态 —— ${u}。本轮只有 \`to\` 指向的那几格可能被刷新：加法 \`(j + ${r}) % 3\` 是**双射**，不同的 \`j\` 落在不同的 \`to\` 上，互不打架。当前 \`dp = [${i.map(l).join(`, `)}]\`。注意读的是**快照 \`old\`**，所以这个元素只被用了一次。`,{i:e,x:n,rem:r,prevDp:s,transitions:c})}return a(`done`,`返回 **${i[0]}**（\`dp[0]\`）。最终 \`dp = [${i.map(l).join(`, `)}]\` —— 余 1、余 2 那两格是**中间产物**：它们留着，是为了后面还能被别的数"救"回到余 0。与贪心对照：贪心靠"元素全为正 + 削最小"，dp 不依赖正负，且同样 \`O(n)\` / \`O(1)\`。`,{done:!0}),r}function l(e){return e===o?`−∞`:String(e)}var u=`greatestsumdiv3dp-styles`,d=28,f=54,ee=62,p=44,m=128,h=138,g=58,_=214,v=240,te=40,y=294,b=50,x=362,ne=1250,S=`
.gdv { display: flex; flex-direction: column; gap: 14px; }
.gdv__svg { width: 100%; height: auto; display: block; }

.gdv-note {
  fill: var(--gdv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.gdv-note--r { text-anchor: end; }

.gdv-lbl {
  fill: var(--gdv-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.gdv-elem__box {
  fill: var(--gdv-gold-fill, #fdf3e3); stroke: var(--gdv-gold, #c2872f); stroke-width: 3;
}
.gdv-elem__val {
  fill: var(--gdv-gold, #c2872f); font-size: 18px; font-weight: 800;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.gdv-elem__sub {
  fill: var(--gdv-gold, #c2872f); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.gdv-cell__box {
  fill: var(--gdv-fill, #ffffff); stroke: var(--gdv-line, #c3c9c2); stroke-width: 1.5;
}
.gdv-cell__idx {
  fill: var(--gdv-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gdv-cell__val {
  fill: var(--gdv-ink, #1f2a24); font-size: 20px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gdv-cell.is-unreach .gdv-cell__box { stroke-dasharray: 3 3; fill: var(--gdv-past, #eef0ec); }
.gdv-cell.is-unreach .gdv-cell__val { fill: var(--gdv-dim, #9aa39c); font-weight: 500; }
.gdv-cell.is-source .gdv-cell__box {
  fill: var(--gdv-ok-fill, #eef5f1); stroke: var(--gdv-ok, #3f6b57); stroke-width: 3;
}
.gdv-cell.is-source .gdv-cell__val { fill: var(--gdv-ok, #3f6b57); }
.gdv-cell.is-target .gdv-cell__box { stroke: var(--gdv-ok, #3f6b57); stroke-width: 2.5; }
.gdv-cell.is-updated .gdv-cell__box {
  fill: var(--gdv-gold-fill, #fdf3e3); stroke: var(--gdv-gold, #c2872f); stroke-width: 3;
}
.gdv-cell.is-updated .gdv-cell__val { fill: var(--gdv-gold, #c2872f); }

.gdv-arc { fill: none; stroke: var(--gdv-ok, #3f6b57); stroke-width: 2; opacity: 0.85; }
.gdv-arc.is-dead { stroke: var(--gdv-dim, #9aa39c); stroke-dasharray: 4 3; opacity: 0.7; }
.gdv-arc__head { fill: var(--gdv-ok, #3f6b57); opacity: 0.85; }
.gdv-arc__head.is-dead { fill: var(--gdv-dim, #9aa39c); opacity: 0.7; }

.gdv-banner__box {
  fill: var(--gdv-banner, #f4f3ef); stroke: var(--gdv-line, #c3c9c2); stroke-width: 1.5;
}
.gdv-banner__text {
  fill: var(--gdv-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.gdv-banner__text.is-ok { fill: var(--gdv-ok, #3f6b57); }

.gdv-panel__box {
  fill: var(--gdv-fill, #ffffff); stroke: var(--gdv-line, #c3c9c2); stroke-width: 1.5;
}
.gdv-panel__label {
  fill: var(--gdv-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gdv-panel__num {
  fill: var(--gdv-ink, #1f2a24); font-size: 18px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gdv-panel__num.is-ok { fill: var(--gdv-ok, #3f6b57); }
.gdv-panel__num.is-fresh { fill: var(--gdv-gold, #c2872f); }

.gdv-phase__text {
  fill: var(--gdv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function C(){if(document.getElementById(u))return;let e=document.createElement(`style`);e.id=u,e.textContent=S,document.head.appendChild(e)}var w=e=>e===-1/0||e==null?`−∞`:String(e);function T(a,o={}){if(!a||a.dataset.gsdiv3dpMounted===`1`)return{destroy(){}};a.dataset.gsdiv3dpMounted=`1`,C();let s=c(o),l=o.autoplay!==!1,{nums:S}=s[0],T=r,E=document.createElement(`div`);E.className=`viz gdv`;let D=document.createElement(`div`);D.className=`viz__stage`,E.appendChild(D);let O=T(`svg`,{class:`viz__svg gdv__svg`,viewBox:`0 0 660 384`,role:`img`,"aria-label":`可被三整除的最大和 LC1262 取模 dp 推演动画`});D.appendChild(O);let k=T(`g`,{}),A=T(`g`,{});O.append(k,A);let j=T(`text`,{class:`gdv-note`,x:26,y:d});j.textContent=`dp[j] = 子集和 ≡ j (mod 3) 的最大和；每件只用一次（先快照 old）`,A.appendChild(j);let M=T(`text`,{class:`gdv-note gdv-note--r`,x:634,y:d});M.textContent=`nums = [${S.join(`, `)}]`,A.appendChild(M);let N=T(`text`,{class:`gdv-lbl`,x:26,y:f});N.textContent=`当前元素`,A.appendChild(N);let P=T(`g`,{});P.appendChild(T(`rect`,{class:`gdv-elem__box`,x:282,y:ee,width:96,height:p,rx:8}));let F=T(`text`,{class:`gdv-elem__val`,x:330,y:78}),I=T(`text`,{class:`gdv-elem__sub`,x:330,y:97});P.append(F,I),A.appendChild(P);let L=T(`text`,{class:`gdv-lbl`,x:26,y:m});L.textContent=`dp 三格（余 0 / 余 1 / 余 2）`,A.appendChild(L);let R=e=>66+e*184,z=e=>R(e)+160/2,B=[0,1,2].map(e=>{let t=R(e),n=T(`g`,{class:`gdv-cell`});n.appendChild(T(`rect`,{class:`gdv-cell__box`,x:t,y:h,width:160,height:g,rx:8}));let r=T(`text`,{class:`gdv-cell__idx`,x:t+160/2,y:154});r.textContent=`dp[${e}]　余 ${e}`;let i=T(`text`,{class:`gdv-cell__val`,x:t+160/2,y:175});return n.append(r,i),k.appendChild(n),{g:n,val:i}}),V=T(`g`,{});O.appendChild(V);let H=[0,1,2].map(()=>{let e=T(`g`,{}),t=T(`path`,{class:`gdv-arc`,d:``}),n=T(`path`,{class:`gdv-arc__head`,d:``});return e.append(t,n),V.appendChild(e),{g:e,path:t,head:n}});A.appendChild(T(`rect`,{class:`gdv-banner__box`,x:26,y:v,width:608,height:te,rx:9}));let U=T(`text`,{class:`gdv-banner__text`,x:660/2,y:260});A.appendChild(U),A.appendChild(T(`rect`,{class:`gdv-panel__box`,x:26,y,width:608,height:b,rx:9}));let W=(e,t)=>{let n=T(`text`,{class:`gdv-panel__label`,x:t,y:308});n.textContent=e;let r=T(`text`,{class:`gdv-panel__num`,x:t,y:329});return A.append(n,r),r},G=W(`i`,660/2-190),K=W(`x`,660/2-65),q=W(`x % 3`,395),J=W(`答案 dp[0]`,520),Y=T(`text`,{class:`gdv-phase__text`,x:660/2,y:x});A.appendChild(Y);let X=document.createElement(`p`);X.className=`viz__desc`,X.setAttribute(`aria-live`,`polite`);function re(t,n){if(!n)return;let r=n.phase===`fill`,i=r?n.transitions:[],a=new Set(i.map(e=>e.from)),o=new Set(i.map(e=>e.to)),s=new Set(i.filter(e=>e.ok).map(e=>e.to));if(P.style.display=r?``:`none`,r&&(F.textContent=String(n.x),I.textContent=`≡${n.rem}`),B.forEach((e,t)=>{let r=[`gdv-cell`];s.has(t)?r.push(`is-updated`):a.has(t)?r.push(`is-source`):o.has(t)&&r.push(`is-target`),n.dp[t]===-1/0&&r.push(`is-unreach`),e.g.setAttribute(`class`,r.join(` `)),e.val.textContent=w(n.dp[t])}),H.forEach((e,t)=>{let n=i[t];if(!n){e.g.style.display=`none`;return}e.g.style.display=``;let r=z(n.from),a=z(n.to),o=n.from===n.to?228:_;e.path.setAttribute(`d`,`M ${r} 196 Q ${(r+a)/2} ${o} ${a} 197`);let s=a>r?-1:1;e.head.setAttribute(`d`,`M ${a} 197 L ${a+s*6} 187 L ${a-s*6} 187 Z`);let c=!n.ok;e.path.setAttribute(`class`,`gdv-arc`+(c?` is-dead`:``)),e.head.setAttribute(`class`,`gdv-arc__head`+(c?` is-dead`:``))}),n.phase===`init`?(U.textContent=`dp = [0, −∞, −∞]　dp[j] = 子集和 ≡ j (mod 3) 的最大和`,U.setAttribute(`class`,`gdv-banner__text`)):r?(U.textContent=`dp[(j + ${n.rem}) % 3] = max(dp[...], old[j] + ${n.x})　快照 old = [${n.prevDp.map(w).join(`, `)}]`,U.setAttribute(`class`,`gdv-banner__text`)):(U.textContent=`答案 = dp[0] = ${n.result}`,U.setAttribute(`class`,`gdv-banner__text is-ok`)),G.textContent=r?String(n.i):`—`,K.textContent=r?String(n.x):`—`,q.textContent=r?String(n.rem):`—`,J.textContent=String(n.result),J.setAttribute(`class`,`gdv-panel__num`+(n.phase===`done`?` is-ok`:r&&s.has(0)?` is-fresh`:``)),n.phase===`init`)Y.textContent=`三格状态：dp[0]=0 是底座，余 1 / 余 2 先留 −∞`;else if(r){let e=i.filter(e=>e.ok).length;Y.textContent=e>0?`本元素刷新了 ${e} 个状态；更新的格子描金`:`本元素没能刷新任何状态（候选都没超过旧值）`}else Y.textContent=`余 1 / 余 2 是中间产物，被后面的数"救"回余 0`;e(X,n.desc)}E.appendChild(X);let Z=i();E.appendChild(Z.root),a.textContent=``,a.appendChild(E),n();let ie=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:s,controls:Z,intervalMs:ne,onRender:re});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return l&&!ie&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(E)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.gsdiv3dpMounted,document.getElementById(u)?.remove()}}}export{T as mountGreatestSumDiv3Dp};