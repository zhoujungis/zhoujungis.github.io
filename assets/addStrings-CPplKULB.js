import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=`456`,o=`77`;function s(e={}){let t=typeof e.num1==`string`&&e.num1.length>0?e.num1:a,n=typeof e.num2==`string`&&e.num2.length>0?e.num2:o,r=[],i=(e,i,a={})=>{r.push({phase:e,desc:i,num1:t,num2:n,col:-1,i:null,j:null,digitA:0,digitB:0,zeroA:!1,zeroB:!1,carryIn:0,sum:0,out:0,carryOut:0,resLow:[],maxLen:Math.max(t.length,n.length),done:e===`done`,...a})};i(`init`,`给了两个字符串形式的非负整数：\`${t}\` 和 \`${n}\`。题目禁止转整数、也没有大数类型 —— 这不是刁难，而是**排除法**：把「先转数字再算」的捷径全部排除，剩下的就是**小学列竖式** —— 从个位起，每一位算「两位数字 + 低位进位」，写下个位、把进位带上去。双指针 \`i\`、\`j\` 从两个串的**末尾**（个位）出发，指针不断左移对齐数位；循环条件是**三连 or**：\`i >= 0 || j >= 0 || carry > 0\` —— 前两个管「还有数位没加」，carry 管「最后还有进位要长出一位」。`);let s=t.length-1,l=n.length-1,u=0,d=[],f=Math.max(t.length,n.length),p=0;for(;s>=0||l>=0||u>0;){p+=1;let e=f-p,r=s>=0?t.charCodeAt(s)-48:0,a=l>=0?n.charCodeAt(l)-48:0,o=s<0,m=l<0,h=r+a+u,g=h%10,_=+(h>=10);d.push(g);let v=c(e,f),y=[];y.push(`**${v}（第 \`${p}\` 列）**：`),y.push(o?"`0`（补零，num1 已走完）":`\`${r}\``),y.push(` + `),y.push(m?"`0`（补零，num2 已走完）":`\`${a}\``),y.push(` + 进位 \`${u}\` = \`${h}\``),h>=10?y.push(` —— 满十进一：**写下 \`${g}\`，进位 \`${_}\` 带上一位**。`):y.push(` —— 不满十：**写下 \`${g}\`，进位归 \`${_}\`**。`),y.push(s-1>=0||l-1>=0||_>0?`指针左移：\`i → ${s-1}\`，\`j → ${l-1}\`。`:`两串都走完、进位也是 0 —— 循环终止。`),i(`digit`,y.join(``),{col:e,i:s,j:l,digitA:r,digitB:a,zeroA:o,zeroB:m,carryIn:u,sum:h,out:g,carryOut:_,resLow:d.slice()}),--s,--l,u=_}let m=d.slice().reverse().join(``);return i(`done`,`所有列处理完，进位 \`0\`，循环停。结果低位在前（push 顺序就是从个位往高位），**reverse 后 join 成字符串：答案 = "${m}"**。回头看整个流程：每列只有一次「加-写-进」决策，时间 \`O(max(m, n))\`，除结果串外**额外空间 O(1)**。三个坑对照：一侧走完要**补 0** 而不是跳过；循环条件**漏掉 carry** 会丢最高位（\`"999" + "1"\` 会得 \`"000"\`）；结果用 \`push\` + 末尾 \`reverse\`，别用 \`unshift\` 头插（每帧 O(n)，整体 O(n^2)）。`,{col:-1,i:-1,j:-1,resLow:d.slice(),result:m,carryOut:0}),r}function c(e,t){let n=t-1-e,r=[`个位`,`十位`,`百位`,`千位`];return n<r.length?r[n]:`10^${n} 位`}var l=`addstr-styles`,u=54,d=84,f=46,p=150,m=162,h=184,g=194,_=46,v=252,y=274,ee=284,b=346,te=360,ne=424,re=450,x=26,S=604,ie=1300,C=`
.addstr {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.addstr__svg { width: 100%; height: auto; display: block; }

.addstr-note {
  fill: var(--addstr-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.addstr-banner__box {
  fill: var(--addstr-banner, #f4f3ef);
  stroke: var(--addstr-line, #c3c9c2);
  stroke-width: 1.5;
}
.addstr-banner__seg {
  fill: var(--addstr-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.addstr-banner__ans {
  fill: var(--addstr-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.addstr-carry {
  fill: var(--addstr-hot, #a45f45);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.addstr-cell__box {
  fill: var(--addstr-fill, #ffffff);
  stroke: var(--addstr-line, #c3c9c2);
  stroke-width: 1.5;
}
.addstr-cell__box.is-dashed {
  fill: none;
  stroke: var(--addstr-dim, #9aa39c);
  stroke-dasharray: 4 4;
  stroke-width: 1.2;
}
.addstr-cell__val {
  fill: var(--addstr-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.addstr-cell__val.is-zero { fill: var(--addstr-dim, #9aa39c); }
.addstr-cell__idx {
  fill: var(--addstr-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 通道一（底色）：当前处理列 */
.addstr-cell.is-active .addstr-cell__box { fill: var(--addstr-gold-fill, #fdf3e3); }
/* 通道二（边框）：结果行最新写出的格子 */
.addstr-cell.is-fresh .addstr-cell__box {
  stroke: var(--addstr-hot, #a45f45);
  stroke-width: 3;
}
.addstr-cell.is-fresh .addstr-cell__val { fill: var(--addstr-hot, #a45f45); }
/* done 帧：结果整体就位 */
.addstr-cell.is-done .addstr-cell__box {
  fill: var(--addstr-ok-fill, #eef5f1);
  stroke: var(--addstr-ok, #3f6b57);
  stroke-width: 2;
}
.addstr-cell.is-done .addstr-cell__val { fill: var(--addstr-ok, #3f6b57); }

.addstr-rule {
  stroke: var(--addstr-ink, #1f2a24);
  stroke-width: 2;
}

.addstr-pin__tag { fill: var(--addstr-hot, #a45f45); }
.addstr-pin__tri { fill: var(--addstr-hot, #a45f45); }
.addstr-pin__text {
  fill: var(--addstr-paper, #ffffff);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.addstr-phase__text {
  fill: var(--addstr-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function ae(){if(document.getElementById(l))return;let e=document.createElement(`style`);e.id=l,e.textContent=C,document.head.appendChild(e)}function w(a,o={}){if(!a||a.dataset.addstrMounted===`1`)return{destroy(){}};a.dataset.addstrMounted=`1`,ae();let c=s(o),C=o.autoplay!==!1,w=c[0],T=w.num1,E=w.num2,D=w.maxLen,O=r,k=document.createElement(`div`);k.className=`viz addstr`;let A=document.createElement(`div`);A.className=`viz__stage`,k.appendChild(A);function oe(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let j=58;(D+1)*j+D*6>S&&(j=Math.max(26,Math.floor((S-D*6)/(D+1))));let M=(D+1)*j+D*6,se=D*j+(D-1)*6,N=Math.max(660,x*2+M),P=N-x,F=P-M,ce=P-se,I=e=>ce+e*(j+6)+j/2,L=e=>F+e*(j+6)+j/2,le=N-x*2,R=O(`svg`,{class:`viz__svg addstr__svg`,viewBox:`0 0 ${N} 474`,role:`img`,"aria-label":`字符串相加 竖式加法推演动画`});A.appendChild(R);let z=O(`g`,{class:`addstr-cells`}),B=O(`g`,{class:`addstr-marks`});R.appendChild(z),R.appendChild(B);let V=O(`text`,{class:`addstr-note`,x,y:u});V.textContent=`竖式加法：从个位起，每位算「两位数字 + 低位进位」，写下个位、进位带上`,B.appendChild(V),B.appendChild(O(`rect`,{class:`addstr-banner__box`,x,y:d,width:le,height:f,rx:9}));let H=O(`text`,{class:`addstr-banner__seg`,x:44,y:107}),U=O(`text`,{class:`addstr-banner__seg`,x:236,y:107}),W=O(`text`,{class:`addstr-banner__ans`,x:N-x-18,y:107});B.appendChild(H),B.appendChild(U),B.appendChild(W);let G=(e,t)=>{let n=O(`text`,{x:F-14,y:e,style:`fill: var(--addstr-muted, #657168); font-size: 12px; text-anchor: end; dominant-baseline: central; font-family: Consolas, monospace;`});n.textContent=t,B.appendChild(n)},K=[];for(let e=0;e<D;e+=1){let t=O(`text`,{class:`addstr-carry`,x:I(e),y:p});t.style.opacity=`0`,B.appendChild(t),K.push(t)}function q(e,t){let n=[];for(let r=0;r<t;r+=1){let t=O(`g`,{class:`addstr-cell`}),i=O(`rect`,{class:`addstr-cell__box`,x:I(r)-j/2,y:e,width:j,height:_,rx:6});t.appendChild(i);let a=O(`text`,{class:`addstr-cell__val`,x:I(r),y:e+_/2});t.appendChild(a),z.appendChild(t),n.push({g:t,box:i,val:a})}return n}let ue=q(g,D),de=q(ee,D),fe=O(`line`,{class:`addstr-rule`,x1:F,y1:b,x2:P,y2:b});B.appendChild(fe);let J=[];for(let e=0;e<=D;e+=1){let t=O(`g`,{class:`addstr-cell`}),n=O(`rect`,{class:`addstr-cell__box`,x:L(e)-j/2,y:te,width:j,height:_,rx:6});t.appendChild(n);let r=O(`text`,{class:`addstr-cell__val`,x:L(e),y:383});t.appendChild(r),z.appendChild(t),J.push({g:t,box:n,val:r})}for(let e=1;e<=D;e+=1){let t=O(`text`,{class:`addstr-cell__idx`,x:L(e),y:ne});t.textContent=String(e-1),B.appendChild(t)}function Y(e,t){let n=O(`g`,{class:`addstr-pin`}),r=O(`rect`,{class:`addstr-pin__tag`,x:0,y:e,width:34,height:20,rx:5}),i=O(`path`,{class:`addstr-pin__tri`,d:`M 0 0 L 0 0 L 0 0`}),a=O(`text`,{class:`addstr-pin__text`,x:0,y:e+10});return n.appendChild(r),n.appendChild(i),n.appendChild(a),B.appendChild(n),{g:n,tag:r,tri:i,text:a}}let pe=Y(m,h),me=Y(v,y),X=O(`text`,{class:`addstr-phase__text`,x:N/2,y:re});B.appendChild(X),G(217,`num1`),G(307,`num2`),G(383,`res`);let Z=oe();function he(t,n){if(!n)return;let r=n.phase===`done`,i=n.phase===`digit`;K.forEach((e,t)=>{let r=i&&n.carryOut>0&&t===n.col-1;e.textContent=`1`,e.style.opacity=r?`1`:`0`});let a=(e,t,r,a)=>{let o=t.length;e.forEach((e,r)=>{let s=r>=D-o,c=[`addstr-cell`];e.val.classList.remove(`is-zero`),s?(e.box.classList.remove(`is-dashed`),e.val.textContent=t[r-(D-o)],i&&r===n.col&&c.push(`is-active`)):(e.box.classList.add(`is-dashed`),i&&a&&r===n.col?(e.val.textContent=`0`,e.val.classList.add(`is-zero`)):e.val.textContent=``),e.g.setAttribute(`class`,c.join(` `))})};a(ue,T,n.i,i&&n.zeroA),a(de,E,n.j,i&&n.zeroB);let o=n.resLow.length;J.forEach((e,t)=>{let a=[`addstr-cell`];if(e.val.classList.remove(`is-zero`),e.box.classList.remove(`is-dashed`),r){let r=D-t;r<o?(e.val.textContent=String(n.resLow[r]),a.push(`is-done`)):(e.box.classList.add(`is-dashed`),e.val.textContent=``)}else if(i){let r=D-t;r<o?(e.val.textContent=String(n.resLow[r]),r===o-1&&a.push(`is-fresh`)):(e.box.classList.add(`is-dashed`),e.val.textContent=``)}else e.box.classList.add(`is-dashed`),e.val.textContent=``;e.g.setAttribute(`class`,a.join(` `))});let s=(e,t,n,r,a,o)=>{let s=t+(D-n);if(i&&t>=0&&s>=0&&s<D){let t=I(s);e.tag.setAttribute(`x`,t-17),e.tri.setAttribute(`d`,`M ${t-6} ${a} L ${t+6} ${a} L ${t} ${a+9} z`),e.text.setAttribute(`x`,t),e.text.textContent=o,e.g.style.opacity=`1`}else e.g.style.opacity=`0`};if(s(pe,n.i,T.length,m,h,`i`),s(me,n.j,E.length,v,y,`j`),i?H.textContent=`第 ${D-n.col}/${D} 位 · ${(e=>{let t=D-1-e;return[`个位`,`十位`,`百位`,`千位`][t]||`10^${t} 位`})(n.col)}`:n.phase===`init`?H.textContent=`竖式对齐`:H.textContent=`${D} 列处理完`,i){let e=n.zeroA?`0+`:`${n.digitA}+`,t=n.zeroB?`0+`:`${n.digitB}+`;U.textContent=`${e}${t}${n.carryIn}=${n.sum} → 写 ${n.out} 进 ${n.carryOut}`}else n.phase===`init`?U.textContent=`双指针从个位出发`:U.textContent=`进位 0 · 终止`;W.textContent=r?`"${n.result}"`:`"${T}" + "${E}"`,i?X.textContent=`已写 ${n.resLow.length} 位 · i=${n.i} j=${n.j} carry=${n.carryOut}`:n.phase===`init`?X.textContent=`循环条件 i >= 0 || j >= 0 || carry > 0`:X.textContent=`答案 = reverse(resLow).join("") · O(max(m,n)) 时间 O(1) 空间`,e(Z,n.desc)}k.appendChild(Z);let ge=i();k.appendChild(ge.root),a.textContent=``,a.appendChild(k),n();let _e=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:c,controls:ge,intervalMs:ie,onRender:he});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return C&&!_e&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(k)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.addstrMounted,document.getElementById(l)?.remove()}}}export{w as mountAddStrings};