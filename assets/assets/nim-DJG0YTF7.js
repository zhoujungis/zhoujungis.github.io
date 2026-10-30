import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=[3,4,5];function o(e){if(!Array.isArray(e)||e.length===0)return a.slice();let t=e.map(e=>Number(e));return t.every(e=>Number.isInteger(e)&&e>=0)?t:a.slice()}function s(e,t){if(t===0)return null;let n=0;for(let e=0;e<31;e+=1)t>>e&1&&(n=e);for(let r=0;r<e.length;r+=1)if(e[r]>>n&1)return{idx:r,bit:n,newVal:e[r]^t};return null}function c(e={}){let t=o(e.piles),n=t.length,r=[],i=(e,i)=>{r.push({phase:e,piles:t.slice(),n,run:null,x:null,move:null,result:null,resultXor:null,answer:null,done:!1,desc:``,...i})};i(`init`,{desc:`开局 ${n} 堆：(${t.join(`, `)})。轮流从某一堆取任意正数个，拿到最后一个石子的人胜。判断先手能不能必胜，靠的不是搜索，是一个数：把所有堆异或起来。`});let a=0;for(let e=0;e<n;e+=1)a^=t[e],i(`xor`,{i:e,run:a,x:e===n-1?a:null,desc:`异或第 ${e+1} 堆：${t[e]}（二进制 ${t[e].toString(2).padStart(4,`0`)}），累计异或 = ${a}。`});let c=a;if(c===0)return i(`done`,{x:0,answer:!1,resultXor:0,done:!0,desc:`异或结果是 0 —— 这是必败态。后手只要每一步都照着镜像走（你动哪堆，他就把那堆改成让异或回到 0），先手无论怎么取，异或都会重新变成非 0。所以先手必败。`}),r;let l=s(t,c);i(`pick`,{x:c,move:l,desc:`异或结果 x = ${c}（二进制 ${c.toString(2)}）。制胜一步的找法：取 x 的最高置位 bit ${l.bit}，找一堆在这一位上为 1 的石子 —— 第 ${l.idx+1} 堆（${t[l.idx]}）就是。把它改成 ${t[l.idx]} ^ ${c} = ${l.newVal}。`});let u=t.slice();u[l.idx]=l.newVal;let d=u.reduce((e,t)=>e^t,0);return i(`take`,{x:c,move:l,result:u,resultXor:d,desc:`从第 ${l.idx+1} 堆取走 ${t[l.idx]-l.newVal} 个，剩下 ${l.newVal} 个。新局面 (${u.join(`, `)}) 的异或 = ${d} —— 必败态交到后手手里。这就是「后手怎么走都赢不了」的数学表述。`}),i(`done`,{x:c,move:l,result:u,resultXor:d,answer:!0,done:!0,desc:`先手必胜。整个论证只有两句话：异或非 0 时存在一步走到异或为 0 的局面；而异或为 0 时任何一步都会走到异或非 0。循环归纳，必胜。`}),r}var l=`nim-styles`,u=`
.nim { display: flex; flex-direction: column; gap: 14px; }
.nim__svg { width: 100%; height: auto; display: block; }

.nim-note {
  fill: var(--nim-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.nim-banner__box {
  fill: var(--nim-banner, #f4f3ef);
  stroke: var(--nim-line, #c3c9c2);
  stroke-width: 1.5;
}
.nim-banner__seg {
  fill: var(--nim-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.nim-banner__val {
  fill: var(--nim-gold, #c2872f);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.nim-pile__box {
  fill: var(--nim-fill, #ffffff);
  stroke: var(--nim-line, #c3c9c2);
  stroke-width: 1.5;
}
.nim-pile__val {
  fill: var(--nim-ink, #1f2a24);
  font-size: 24px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.nim-pile__bin {
  fill: var(--nim-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.nim-pile.is-ghost .nim-pile__box { fill: none; stroke-dasharray: 3 3; }
.nim-pile.is-ghost .nim-pile__val { fill: none; }
.nim-pile.is-ghost .nim-pile__bin { fill: none; }
.nim-pile.is-target .nim-pile__box {
  stroke: var(--nim-gold, #c2872f);
  stroke-width: 3.5;
  fill: var(--nim-gold-fill, #fdf3e3);
}
.nim-pile.is-target .nim-pile__val { fill: var(--nim-gold, #c2872f); }
.nim-pile.is-done .nim-pile__box {
  stroke: var(--nim-ok, #3f6b57);
  stroke-width: 2.5;
  fill: var(--nim-ok-fill, #eef5f1);
}
.nim-pile.is-done .nim-pile__val { fill: var(--nim-ok, #3f6b57); }

.nim-run__box {
  fill: var(--nim-banner, #f4f3ef);
  stroke: var(--nim-line, #c3c9c2);
  stroke-width: 1.2;
}
.nim-run__val {
  fill: var(--nim-ok, #3f6b57);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.nim-run.is-zero .nim-run__val { fill: var(--nim-bad, #b3452e); }
.nim-run.is-off .nim-run__box { fill: none; stroke-dasharray: 3 3; }
.nim-run.is-off .nim-run__val { fill: none; }

.nim-move__box {
  fill: var(--nim-gold-fill, #fdf3e3);
  stroke: var(--nim-gold, #c2872f);
  stroke-width: 2;
}
.nim-move__text {
  fill: var(--nim-ink, #1f2a24);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.nim-move__text.is-bad { fill: var(--nim-bad, #b3452e); }
.nim-move.is-off { opacity: 0; }

.nim-ans__box {
  fill: var(--nim-ok-fill, #eef5f1);
  stroke: var(--nim-ok, #3f6b57);
  stroke-width: 2.5;
}
.nim-ans__text {
  fill: var(--nim-ok, #3f6b57);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.nim-ans.is-lose .nim-ans__box {
  fill: var(--nim-bad-fill, #f9ece8);
  stroke: var(--nim-bad, #b3452e);
}
.nim-ans.is-lose .nim-ans__text { fill: var(--nim-bad, #b3452e); }

.nim-phase__text {
  fill: var(--nim-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function d(){if(document.getElementById(l))return;let e=document.createElement(`style`);e.id=l,e.textContent=u,document.head.appendChild(e)}function f(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function p(a,o={}){if(!a||a.dataset.nimMounted===`1`)return{destroy(){}};a.dataset.nimMounted=`1`,d();let s=c(o),{n:u,piles:p}=s[0],m=Math.max(56,Math.min(132,(560-(u-1)*12)/u)),h=(680-(u*m+(u-1)*12))/2,g=e=>h+e*(m+12)+m/2,_=r,v=_(`svg`,{class:`viz__svg nim__svg`,viewBox:`0 0 680 414`,role:`img`,"aria-label":`Nim 博弈 先手必胜判定动画`}),y=_(`g`,{class:`nim-marks`}),b=_(`g`,{class:`nim-cells`});v.appendChild(y),v.appendChild(b);let x=_(`text`,{class:`nim-note`,x:30,y:22});x.textContent=`Nim 博弈：把所有堆异或起来 —— 非 0 先手必胜，0 先手必败`,y.appendChild(x),y.appendChild(_(`rect`,{class:`nim-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let S=_(`text`,{class:`nim-banner__seg`,x:46,y:58}),C=_(`text`,{class:`nim-banner__seg`,x:196,y:58}),w=_(`text`,{class:`nim-banner__val`,x:634,y:58});y.appendChild(S),y.appendChild(C),y.appendChild(w);let T=_(`text`,{class:`nim-note`,x:h-14,y:151});T.textContent=`各堆`,y.appendChild(T);let E=[];for(let e=0;e<u;e+=1){let t=_(`g`,{class:`nim-pile`});t.appendChild(_(`rect`,{class:`nim-pile__box`,x:g(e)-m/2,y:116,width:m,height:70,rx:8}));let n=_(`text`,{class:`nim-pile__val`,x:g(e),y:144});n.textContent=String(p[e]);let r=_(`text`,{class:`nim-pile__bin`,x:g(e),y:172});r.textContent=p[e].toString(2).padStart(4,`0`),t.appendChild(n),t.appendChild(r),b.appendChild(t),E.push({g:t,val:n,bin:r})}let D=_(`text`,{class:`nim-note`,x:h-14,y:226});D.textContent=`累计异或`,y.appendChild(D);let O=[];for(let e=0;e<u;e+=1){let t=_(`g`,{class:`nim-run is-off`});t.appendChild(_(`rect`,{class:`nim-run__box`,x:g(e)-m/2,y:208,width:m,height:36,rx:7}));let n=_(`text`,{class:`nim-run__val`,x:g(e),y:226});t.appendChild(n),b.appendChild(t),O.push({g:t,val:n})}let k=_(`rect`,{class:`nim-move__box nim-move`,x:60,y:262,width:560,height:52,rx:10}),A=_(`text`,{class:`nim-move__text`,x:680/2,y:288});y.appendChild(k),y.appendChild(A);let j=_(`rect`,{class:`nim-ans__box`,x:60,y:338,width:560,height:38,rx:10}),M=_(`text`,{class:`nim-ans__text`,x:680/2,y:357});y.appendChild(j),y.appendChild(M);let N=_(`text`,{class:`nim-phase__text`,x:680/2,y:392});y.appendChild(N);function P(t,n){if(!n)return;let{phase:r,x:i,move:a,result:o,answer:c}=n,l=r===`done`;E.forEach((e,t)=>{let n=[`nim-pile`];a&&t===a.idx&&(r===`pick`||r===`take`||l)&&n.push(`is-target`),o&&(r===`take`||l)&&n.push(`is-done`),e.g.setAttribute(`class`,n.join(` `)),e.val.textContent=o&&(r===`take`||l)&&t===a.idx?String(o[t]):String(p[t]),e.bin.textContent=(o&&(r===`take`||l)?o:p)[t].toString(2).padStart(4,`0`)}),O.forEach((e,t)=>{let a=[`nim-run`];(r===`xor`?t<=n.i:r!==`init`)?(a.push(`is-on`),e.val.textContent=String(s[t+1].run)):(a.push(`is-off`),e.val.textContent=``),t===u-1&&i!==null&&i===0&&a.push(`is-zero`),e.g.setAttribute(`class`,a.join(` `))}),a?(k.classList.remove(`is-off`),A.classList.remove(`is-off`),A.textContent=r===`take`||l?`制胜一手：第 ${a.idx+1} 堆 ${p[a.idx]} 个 取走 ${p[a.idx]-a.newVal} 个 -> 剩 ${a.newVal} 个，异或回到 0`:`制胜一手：取 x 的最高位 bit ${a.bit}，第 ${a.idx+1} 堆 ${p[a.idx]} 改成 ${a.newVal}`,A.setAttribute(`class`,`nim-move__text`)):(k.classList.add(`is-off`),A.classList.add(`is-off`),A.textContent=``);let d=c===!0;M.textContent=l?d?`先手必胜 —— 异或 ${i} 非 0，一定有一手把局面变成必败态`:`先手必败 —— 异或为 0，后手镜像应战即可`:``,j.setAttribute(`class`,`nim-ans__box ${l&&!d?`is-lose`:``}`),M.setAttribute(`class`,`nim-ans__text ${l&&!d?`is-lose`:``}`),r===`init`?(S.textContent=`开局`,C.textContent=`${u} 堆石子`,w.textContent=`(${p.join(`, `)})`):r===`xor`?(S.textContent=`异或第 ${n.i+1} 堆`,C.textContent=`${p[n.i]} = ${p[n.i].toString(2)}`,w.textContent=`累计 = ${n.run}`):r===`pick`?(S.textContent=`x = ${i}`,C.textContent=`最高置位 bit ${a.bit}`,w.textContent=`改第 ${a.idx+1} 堆`):r===`take`?(S.textContent=`取石子`,C.textContent=`第 ${a.idx+1} 堆 -> ${a.newVal}`,w.textContent=`异或 = 0`):(S.textContent=`结论`,C.textContent=d?`先手必胜`:`先手必败`,w.textContent=d?`x = ${i}`:`x = 0`),N.textContent=l?d?`异或非 0 -> 有制胜一手；异或为 0 -> 任何一步都送给对手非 0。归纳即得 Bouton 定理。`:`后手的策略：每次把先手刚动过的那堆，改成让全场异或回到 0。`:r===`xor`?`异或的妙处：它把 N 堆压成一个数，而「能不能一步走到 0」只看这一个数。`:`制胜一手的找法是构造性的 —— 不是搜索，是直接算。`,e(F,n.desc)}let F=f(),I=document.createElement(`div`);I.className=`viz nim`;let L=document.createElement(`div`);L.className=`viz__stage`,L.appendChild(v),I.appendChild(L),I.appendChild(F);let R=i();I.appendChild(R.root),a.textContent=``,a.appendChild(I),n();let z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,B=t({steps:s,controls:R,intervalMs:900,onRender:P});B.jumpTo(Math.trunc(o.initialStep)||0);let V=null;return o.autoplay!==!1&&!z&&typeof IntersectionObserver==`function`&&(V=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){V.disconnect(),V=null,B.play();return}},{threshold:.35}),V.observe(I)),{destroy(){V&&=(V.disconnect(),null),B.destroy(),a.textContent=``,delete a.dataset.nimMounted,document.getElementById(l)?.remove()}}}function m(e,t={}){return p(e,t)}export{m as mountNim};