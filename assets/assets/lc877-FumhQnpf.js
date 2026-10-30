import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[5,3,4,5];function o(e){if(!Array.isArray(e)||e.length===0)return a.slice();let t=e.map(e=>Number(e));return t.every(e=>Number.isInteger(e)&&e>0)?t:a.slice()}function s(e={}){let t=o(e.piles),n=t.length,r=[],i=0,a=0;for(let e=0;e<n;e+=1)e%2==0?a+=t[e]:i+=t[e];let s=a>=i?`even`:`odd`,c=s===`even`?`left`:`right`,l=s===`even`?0:1,u=[],d=0,f=n-1,p=0,m=0,h=0;for(;d<=f;){let e;e=p===0?d%2===l?`left`:`right`:d===f?`left`:t[f]>t[d]?`right`:`left`;let n=e===`left`?d:f,r=t[n];p===0?(m+=r,u.push({who:`alex`,end:e,idx:n,val:r,alex:m,lee:h}),e===`left`?d+=1:--f):(h+=r,u.push({who:`lee`,end:e,idx:n,val:r,alex:m,lee:h}),e===`left`?d+=1:--f),p=1-p}let g=(e,o)=>{r.push({phase:e,piles:t.slice(),n,oddSum:i,evenSum:a,target:s,firstEnd:c,moves:[],alex:0,lee:0,answer:null,done:!1,desc:``,...o})};g(`init`,{desc:`一排 ${n} 堆石子，两人轮流只能从头部或尾部取一整堆，Alex 先手，堆数是偶数。问 Alex 有没有必胜策略。答案是必胜，而且不需要算 DP —— 开局站一次队就定了。`}),g(`parity`,{desc:`按原始下标分两队：偶数位 ${t.filter((e,t)=>t%2==0).join(` + `)} = ${a}，奇数位 ${t.filter((e,t)=>t%2==1).join(` + `)} = ${i}。Alex 取左端，之后就只能拿偶数位；取右端就只能拿奇数位 —— 所以取大的那一队（${s===`even`?`偶数位`:`奇数位`}），第一步取${c===`left`?`左`:`右`}端来锁定。`});for(let e=0;e<u.length;e+=1){let t=u[e];g(`take`,{moves:u.slice(0,e+1),alex:t.alex,lee:t.lee,desc:`${t.who===`alex`?`Alex`:`Lee`} 从${t.end===`left`?`左`:`右`}端取走 ${t.val}（原下标 ${t.idx}，${t.idx%2==0?`偶数位`:`奇数位`}）。比分 Alex ${t.alex} : ${t.lee} Lee。`+(t.who===`lee`?`注意 Lee 不管怎么取，剩下的两端都还是 Alex 锁定那一队的下标。`:`这一步把 Alex 锁死在${s===`even`?`偶数位`:`奇数位`}这一队。`)})}return g(`done`,{moves:u.slice(),alex:u[u.length-1].alex,lee:u[u.length-1].lee,answer:!0,done:!0,desc:`终局 Alex ${m} : ${h} Lee —— 先手必胜。关键不在算得准，而在**开局就放弃一半的石子**：堆数为偶数时，先手第一次取哪一端，就把自己钉死在一条奇偶带上，选和大的那条即可。堆数为奇数时这个 trick 失效，必须老老实实上区间 DP。`}),r}var c=`lc877-styles`,l=`
.lc877 { display: flex; flex-direction: column; gap: 14px; }
.lc877__svg { width: 100%; height: auto; display: block; }

.lc877-note {
  fill: var(--lc877-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc877-banner__box {
  fill: var(--lc877-banner, #f4f3ef);
  stroke: var(--lc877-line, #c3c9c2);
  stroke-width: 1.5;
}
.lc877-banner__seg {
  fill: var(--lc877-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc877-banner__val {
  fill: var(--lc877-gold, #c2872f);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lc877-pile__box {
  fill: var(--lc877-fill, #ffffff);
  stroke: var(--lc877-line, #c3c9c2);
  stroke-width: 1.5;
}
.lc877-pile__val {
  font-size: 24px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: var(--lc877-ink, #1f2a24);
}
.lc877-pile__idx {
  fill: var(--lc877-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 通道一：底色 = 奇偶站队 */
.lc877-pile.is-even .lc877-pile__box { fill: var(--lc877-ok-fill, #eef5f1); }
.lc877-pile.is-odd .lc877-pile__box { fill: var(--lc877-gold-fill, #fdf3e3); }
.lc877-pile.is-even .lc877-pile__val { fill: var(--lc877-ok, #3f6b57); }
.lc877-pile.is-odd .lc877-pile__val { fill: var(--lc877-hot, #a45f45); }
/* 通道二：取走后退化成虚线壳 */
.lc877-pile.is-taken .lc877-pile__box { fill: none; stroke-dasharray: 3 3; }
.lc877-pile.is-taken .lc877-pile__val { fill: none; }
.lc877-pile.is-taken .lc877-pile__idx { fill: none; }
.lc877-pile__mark {
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: none;
}
.lc877-pile__mark.is-on.is-alex { fill: var(--lc877-ok, #3f6b57); }
.lc877-pile__mark.is-on.is-lee { fill: var(--lc877-hot, #a45f45); }

.lc877-chip__box {
  fill: var(--lc877-fill, #ffffff);
  stroke: var(--lc877-line, #c3c9c2);
  stroke-width: 1.5;
}
.lc877-chip__text {
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: var(--lc877-muted, #657168);
}
.lc877-chip.is-win .lc877-chip__box {
  stroke: var(--lc877-gold, #c2872f);
  stroke-width: 3;
  fill: var(--lc877-gold-fill, #fdf3e3);
}
.lc877-chip.is-win .lc877-chip__text { fill: var(--lc877-gold, #c2872f); }

.lc877-score__box {
  fill: var(--lc877-banner, #f4f3ef);
  stroke: var(--lc877-line, #c3c9c2);
  stroke-width: 1.5;
}
.lc877-score__text {
  fill: var(--lc877-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc877-score__text.is-alex { fill: var(--lc877-ok, #3f6b57); }

.lc877-ans__box {
  fill: var(--lc877-ok-fill, #eef5f1);
  stroke: var(--lc877-ok, #3f6b57);
  stroke-width: 2.5;
}
.lc877-ans__text {
  fill: var(--lc877-ok, #3f6b57);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc877-phase__text {
  fill: var(--lc877-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function u(){if(document.getElementById(c))return;let e=document.createElement(`style`);e.id=c,e.textContent=l,document.head.appendChild(e)}function d(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function f(a,o={}){if(!a||a.dataset.lc877Mounted===`1`)return{destroy(){}};a.dataset.lc877Mounted=`1`,u();let l=s(o),{n:f,piles:p}=l[0],m=Math.max(64,Math.min(124,(560-(f-1)*14)/f)),h=(680-(f*m+(f-1)*14))/2,g=e=>h+e*(m+14)+m/2,_=r,v=_(`svg`,{class:`viz__svg lc877__svg`,viewBox:`0 0 680 402`,role:`img`,"aria-label":`石子游戏 奇偶位站队动画`}),y=_(`g`,{class:`lc877-marks`}),b=_(`g`,{class:`lc877-cells`});v.appendChild(y),v.appendChild(b);let x=_(`text`,{class:`lc877-note`,x:30,y:22});x.textContent=`偶数堆时先手必胜：开局按原始下标的奇偶站队，取和大的那一队`,y.appendChild(x),y.appendChild(_(`rect`,{class:`lc877-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let S=_(`text`,{class:`lc877-banner__seg`,x:46,y:58}),C=_(`text`,{class:`lc877-banner__seg`,x:176,y:58}),w=_(`text`,{class:`lc877-banner__val`,x:634,y:58});y.appendChild(S),y.appendChild(C),y.appendChild(w);let T=[];for(let e=0;e<f;e+=1){let t=_(`g`,{class:`lc877-pile ${e%2==0?`is-even`:`is-odd`}`});t.appendChild(_(`rect`,{class:`lc877-pile__box`,x:g(e)-m/2,y:118,width:m,height:68,rx:8}));let n=_(`text`,{class:`lc877-pile__val`,x:g(e),y:146});n.textContent=String(p[e]);let r=_(`text`,{class:`lc877-pile__idx`,x:g(e),y:172});r.textContent=`#${e} ${e%2==0?`偶`:`奇`}`;let i=_(`text`,{class:`lc877-pile__mark`,x:g(e),y:172});t.appendChild(n),t.appendChild(r),t.appendChild(i),b.appendChild(t),T.push({g:t,val:n,idx:r,mark:i})}let E=(e,t,n)=>{let r=_(`g`,{class:`lc877-chip ${n?`is-win`:``}`});r.appendChild(_(`rect`,{class:`lc877-chip__box`,x:e,y:212,width:190,height:40,rx:9}));let i=_(`text`,{class:`lc877-chip__text`,x:e+190/2,y:232});return i.textContent=t,r.appendChild(i),y.appendChild(r),{g:r,t:i}},D=E(135,``,!1),O=E(355,``,!1),k=_(`rect`,{class:`lc877-score__box`,x:60,y:274,width:560,height:36,rx:10}),A=_(`text`,{class:`lc877-score__text`,x:680/2,y:292});y.appendChild(k),y.appendChild(A);let j=_(`rect`,{class:`lc877-ans__box`,x:60,y:332,width:560,height:38,rx:10}),M=_(`text`,{class:`lc877-ans__text`,x:680/2,y:351});y.appendChild(j),y.appendChild(M);let N=_(`text`,{class:`lc877-phase__text`,x:680/2,y:380});y.appendChild(N);function P(t,n){if(!n)return;let{phase:r,moves:i,alex:a,lee:o,evenSum:s,oddSum:c,target:l}=n,u=r===`done`,d=r!==`init`,m=new Map;for(let e of i)m.set(e.idx,e);if(T.forEach((e,t)=>{let n=[`lc877-pile ${t%2==0?`is-even`:`is-odd`}`],r=m.get(t);r?(n.push(`is-taken`),e.mark.textContent=r.who===`alex`?`A ${r.val}`:`L ${r.val}`,e.mark.setAttribute(`class`,`lc877-pile__mark is-on ${r.who===`alex`?`is-alex`:`is-lee`}`)):(e.mark.textContent=``,e.mark.setAttribute(`class`,`lc877-pile__mark`)),e.g.setAttribute(`class`,n.join(` `))}),D.g.setAttribute(`opacity`,d?`1`:`0`),O.g.setAttribute(`opacity`,d?`1`:`0`),D.t.textContent=`偶数位和 = ${s}`,O.t.textContent=`奇数位和 = ${c}`,D.g.setAttribute(`class`,`lc877-chip ${l===`even`?`is-win`:``}`),O.g.setAttribute(`class`,`lc877-chip ${l===`odd`?`is-win`:``}`),A.textContent=i.length?`Alex ${a}  :  ${o} Lee`:`Alex 先手 —— 还没开局`,M.textContent=u?`先手必胜 —— Alex ${a} : ${o} Lee`:``,j.setAttribute(`class`,`lc877-ans__box`),M.setAttribute(`class`,`lc877-ans__text`),r===`init`)S.textContent=`开局`,C.textContent=`${f} 堆（偶数）`,w.textContent=`(${p.join(`, `)})`;else if(r===`parity`)S.textContent=`站队`,C.textContent=`Alex 锁定${l===`even`?`偶数位`:`奇数位`}`,w.textContent=`第一步取${l===`even`?`左`:`右`}端`;else if(r===`take`){let e=i[i.length-1];S.textContent=`${e.who===`alex`?`Alex`:`Lee`} 取${e.end===`left`?`左`:`右`}端`,C.textContent=`原下标 ${e.idx}（${e.idx%2==0?`偶`:`奇`}）`,w.textContent=`拿到 ${e.val}`}else S.textContent=`终局`,C.textContent=`Alex ${a} : ${o} Lee`,w.textContent=`先手必胜`;N.textContent=u?`堆数为偶数时这个 trick 必胜；堆数是奇数时两端奇偶不同，必须老老实实上区间 DP。`:r===`parity`?`取左端 -> 只能拿原始偶数位；取右端 -> 只能拿奇数位。所以第一次取哪一端，就是选队。`:`Lee 取走一端后，剩下两端必然一个是 Alex 队的下标、一个不是 —— Alex 永远有得选。`,e(F,n.desc)}let F=d(),I=document.createElement(`div`);I.className=`viz lc877`;let L=document.createElement(`div`);L.className=`viz__stage`,L.appendChild(v),I.appendChild(L),I.appendChild(F);let R=i();I.appendChild(R.root),a.textContent=``,a.appendChild(I),n();let z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,B=t({steps:l,controls:R,intervalMs:900,onRender:P});B.jumpTo(Math.trunc(o.initialStep)||0);let V=null;return o.autoplay!==!1&&!z&&typeof IntersectionObserver==`function`&&(V=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){V.disconnect(),V=null,B.play();return}},{threshold:.35}),V.observe(I)),{destroy(){V&&=(V.disconnect(),null),B.destroy(),a.textContent=``,delete a.dataset.lc877Mounted,document.getElementById(c)?.remove()}}}function p(e,t={}){return f(e,t)}export{p as mountLc877};