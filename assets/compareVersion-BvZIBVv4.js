import{a as e,n as t,r as n,s as r,t as i}from"./widgetChrome-CsVdkvMb.js";var a=`1.02.3`,o=`1.2.10`;function s(e){let t=0;for(;t<e.length-1&&e[t]===`0`;)t+=1;return e.slice(t)}function c(e,t){return e.length===t.length?e===t?0:e<t?-1:1:e.length<t.length?-1:1}function l(e={}){let t=typeof e.version1==`string`&&e.version1.length>0?e.version1:a,n=typeof e.version2==`string`&&e.version2.length>0?e.version2:o,r=t.split(`.`),i=n.split(`.`),l=Math.max(r.length,i.length),u=[],d=(e,t,n={})=>{u.push({phase:e,desc:t,rev1:r,rev2:i,col:-1,raw1:null,raw2:null,val1:``,val2:``,isPad1:!1,isPad2:!1,verdict:``,result:null,done:e===`done`,...n})};d(`init`,`给了两个版本号：\`${t}\` 和 \`${n}\`。按 \`.\` 切成修订号数组：\`[${r.map(e=>`"${e}"`).join(`, `)}]\` 和 \`[${i.map(e=>`"${e}"`).join(`, `)}]\`。比较规则把所有情况归到同一条铁轨：**先把每个修订号归一化（剥前导零，缺失视为 0），再逐列比较，**第一列分出胜负就短路返回。归一化后「比数值」有个漂亮的事实：**先比长度、等长再比字典序** —— 剥完前导零的数字串更长的一定更大，全程不用转数字，天然免疫超长修订号的 \`parseInt\` 精度陷阱。`);for(let e=0;e<l;e+=1){let a=e<r.length,o=e<i.length,l=a?r[e]:null,f=o?i[e]:null,p=s(a?l:`0`),m=s(o?f:`0`),h=c(p,m),g=h===0?`equal`:h<0?`less`:`greater`,_=[];if(_.push(`**第 \`${e+1}\` 列**：`),_.push(a?`\`${l}\``:"`0`（补零，v1 修订号已用完）"),_.push(` vs `),_.push(o?`\`${f}\``:"`0`（补零，v2 修订号已用完）"),l!==null&&l!==p||f!==null&&f!==m||!a||!o){let e=[];e.push(a?`"${l}" → "${p}"`:null),e.push(o?`"${f}" → "${m}"`:null);let t=e.filter(Boolean).join(` 与 `);_.push(` —— 剥前导零归一化：${t}。`)}else _.push(` —— 本列无需剥零。`);if(p.length!==m.length&&_.push(`比长度：\`${p.length}\` vs \`${m.length}\` —— **长的一定大**（剥完前导零没有前导零）。`),g===`equal`?_.push(`**等长且逐字符相同 → 数值相等**，进下一列。`):g===`less`?_.push(`**\`${p}\` < \`${m}\`，第一列分出胜负，短路返回 \`-1\`。**`+(p.length===m.length?`注意不是字符比较：字符序里 \`${p[0]}\` 可能大于 \`${m[0]}\`，等长时字符序才恰好等于数值序。`:`字符比较会在这里翻车：字符序看首字符，数值看位数。`)):_.push(`**\`${p}\` > \`${m}\`，第一列分出胜负，短路返回 \`1\`。**`+(p.length===m.length?`等长逐字符比较，字符序 = 数值序。`:`比长度就分出了：位数多的大。`)),d(`compare`,_.join(``),{col:e,raw1:l,raw2:f,val1:p,val2:m,isPad1:!a,isPad2:!o,verdict:g}),g!==`equal`){let r=g===`less`?-1:1;return d(`done`,`第 \`${e+1}\` 列分出胜负，后面的列不用看（短路）。**返回 \`${r}\`**：\`${t}\` ${r<0?`<`:`>`} \`${n}\`。`,{col:e,result:r,verdict:g}),u}}return d(`done`,`所有列都相等（包括补零列）。**返回 \`0\`**：\`${t}\` 与 \`${n}\` 版本号相等 —— \`"1.01"\` 与 \`"1.001"\`、\`"1.0"\` 与 \`"1.0.0"\` 都在这条路上归为相等。`,{col:l-1,result:0,verdict:`equal`}),u}var u=`cmpver-styles`,d=54,f=84,p=46,m=156,h=176,g=46,_=238,v=314,y=26,b=1350,x=`
.cmpver {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.cmpver__svg { width: 100%; height: auto; display: block; }

.cmpver-note {
  fill: var(--cmpver-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.cmpver-banner__box {
  fill: var(--cmpver-banner, #f4f3ef);
  stroke: var(--cmpver-line, #c3c9c2);
  stroke-width: 1.5;
}
.cmpver-banner__seg {
  fill: var(--cmpver-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.cmpver-banner__ans {
  fill: var(--cmpver-gold, #c2872f);
  font-size: 18px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.cmpver-cell__box {
  fill: var(--cmpver-fill, #ffffff);
  stroke: var(--cmpver-line, #c3c9c2);
  stroke-width: 1.5;
}
.cmpver-cell__box.is-dashed {
  fill: none;
  stroke: var(--cmpver-dim, #9aa39c);
  stroke-dasharray: 4 4;
  stroke-width: 1.2;
}
.cmpver-cell__val {
  fill: var(--cmpver-ink, #1f2a24);
  font-size: 15.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.cmpver-cell__val.is-zero { fill: var(--cmpver-dim, #9aa39c); }
.cmpver-cell__idx {
  fill: var(--cmpver-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 通道一（底色）：当前比较列（equal 时） */
.cmpver-cell.is-active .cmpver-cell__box { fill: var(--cmpver-gold-fill, #fdf3e3); }
/* 通道二（边框）：本列分出胜负 */
.cmpver-cell.is-hot .cmpver-cell__box {
  stroke: var(--cmpver-hot, #a45f45);
  stroke-width: 3;
}
.cmpver-cell.is-hot .cmpver-cell__val { fill: var(--cmpver-hot, #a45f45); }
/* done 帧：裁决列就位 */
.cmpver-cell.is-done .cmpver-cell__box {
  fill: var(--cmpver-ok-fill, #eef5f1);
  stroke: var(--cmpver-ok, #3f6b57);
  stroke-width: 2;
}
.cmpver-cell.is-done .cmpver-cell__val { fill: var(--cmpver-ok, #3f6b57); }

.cmpver-phase__text {
  fill: var(--cmpver-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function S(){if(document.getElementById(u))return;let e=document.createElement(`style`);e.id=u,e.textContent=x,document.head.appendChild(e)}function C(a,o={}){if(!a||a.dataset.cmpverMounted===`1`)return{destroy(){}};a.dataset.cmpverMounted=`1`,S();let s=l(o),c=o.autoplay!==!1,x=s[0],C=x.rev1,w=x.rev2,T=Math.max(C.length,w.length),E=r,D=document.createElement(`div`);D.className=`viz cmpver`;let O=document.createElement(`div`);O.className=`viz__stage`,D.appendChild(O);function k(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let A=Math.max(...C.map(e=>e.length),...w.map(e=>e.length),2),j=Math.min(76,Math.max(46,A*13+20)),M=T*j+(T-1)*8,N=Math.max(660,y*2+M),P=(N-M)/2,F=e=>P+e*(j+8)+j/2,I=N-y*2,L=E(`svg`,{class:`viz__svg cmpver__svg`,viewBox:`0 0 ${N} 338`,role:`img`,"aria-label":`比较版本号 逐列比较推演动画`});O.appendChild(L);let R=E(`g`,{class:`cmpver-cells`}),z=E(`g`,{class:`cmpver-marks`});L.appendChild(R),L.appendChild(z);let B=E(`text`,{class:`cmpver-note`,x:y,y:d});B.textContent=`归一化后逐列比较：剥前导零 + 缺失补 0，先比长度再比字典序`,z.appendChild(B),z.appendChild(E(`rect`,{class:`cmpver-banner__box`,x:y,y:f,width:I,height:p,rx:9}));let V=E(`text`,{class:`cmpver-banner__seg`,x:44,y:107}),H=E(`text`,{class:`cmpver-banner__seg`,x:176,y:107}),U=E(`text`,{class:`cmpver-banner__ans`,x:N-y-18,y:107});z.appendChild(V),z.appendChild(H),z.appendChild(U);let W=(e,t)=>{let n=E(`text`,{x:P-14,y:e,style:`fill: var(--cmpver-muted, #657168); font-size: 12px; text-anchor: end; dominant-baseline: central; font-family: Consolas, monospace;`});n.textContent=t,z.appendChild(n)};function G(e,t,n){let r=[];for(let t=0;t<T;t+=1){let n=E(`g`,{class:`cmpver-cell`}),i=E(`rect`,{class:`cmpver-cell__box`,x:F(t)-j/2,y:e,width:j,height:g,rx:6});n.appendChild(i);let a=E(`text`,{class:`cmpver-cell__val`,x:F(t),y:e+g/2});n.appendChild(a),R.appendChild(n),r.push({g:n,box:i,val:a,c:t})}for(let e=0;e<T;e+=1){let t=E(`text`,{class:`cmpver-cell__idx`,x:F(e),y:m});t.textContent=String(e),z.appendChild(t)}return r}let K=G(h,C,C.length),q=G(_,w,w.length);W(199,`v1`),W(261,`v2`);let J=E(`text`,{class:`cmpver-phase__text`,x:N/2,y:v});z.appendChild(J);let Y=k();function X(t,n){if(!n)return;let r=n.phase===`done`,i=n.phase===`compare`,a=(e,t,a,o)=>{e.forEach(e=>{let s=e.c,c=s<a,l=[`cmpver-cell`];e.val.classList.remove(`is-zero`),e.box.classList.remove(`is-dashed`),c?(e.val.textContent=t[s],i&&s===n.col&&l.push(n.verdict===`equal`?`is-active`:`is-hot`),r&&s===n.col&&l.push(`is-done`)):(e.box.classList.add(`is-dashed`),i&&s===n.col&&o?(e.val.textContent=`0`,e.val.classList.add(`is-zero`),l.push(n.verdict===`equal`?`is-active`:`is-hot`)):e.val.textContent=``),e.g.setAttribute(`class`,l.join(` `))})};if(a(K,C,C.length,n.isPad1),a(q,w,w.length,n.isPad2),i){V.textContent=`第 ${n.col+1}/${T} 列`;let e=n.isPad1?`0(补)`:`"${n.raw1}" → ${n.val1}`,t=n.isPad2?`0(补)`:`"${n.raw2}" → ${n.val2}`,r=n.verdict===`equal`?`=`:n.verdict===`less`?`<`:`>`;H.textContent=`${e}  ${r}  ${t}`}else n.phase===`init`?(V.textContent=`按 . 切开`,H.textContent=`逐列归一化比较`):(V.textContent=`${T} 列比较完`,H.textContent=n.result===0?`全部相等`:`第 ${n.col+1} 列分出胜负`);U.textContent=r?`return ${n.result}`:`"${C.join(`.`)}" vs "${w.join(`.`)}"`,i?J.textContent=n.verdict===`equal`?`第 ${n.col+1} 列相等，进下一列（短路：一旦分出胜负立即返回）`:`第 ${n.col+1} 列分出胜负 → return ${n.verdict===`less`?-1:1}`:n.phase===`init`?J.textContent=`剥前导零（"0002" → "2"，全零 → "0"）· 缺失修订号视为 0`:J.textContent=`归一化比较：先比长度（长的一定大），等长再比字典序`,e(Y,n.desc)}D.appendChild(Y);let Z=i();D.appendChild(Z.root),a.textContent=``,a.appendChild(D),n();let ee=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,Q=t({steps:s,controls:Z,intervalMs:b,onRender:X});Q.jumpTo(Math.trunc(o.initialStep)||0);let $=null;return c&&!ee&&typeof IntersectionObserver==`function`&&($=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){$.disconnect(),$=null,Q.play();return}},{threshold:.35}),$.observe(D)),{destroy(){$&&=($.disconnect(),null),Q.destroy(),a.textContent=``,delete a.dataset.cmpverMounted,document.getElementById(u)?.remove()}}}export{C as mountCompareVersion};