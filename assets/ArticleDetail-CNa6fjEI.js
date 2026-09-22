import{A as e,C as t,D as n,E as r,R as i,S as a,b as o,c as s,d as c,dt as l,h as u,i as d,j as f,k as p,l as m,lt as h,m as g,p as _,s as v,t as y,u as b,ut as x,w as S,x as C,z as w}from"./_plugin-vue_export-helper-BK47PYcU.js";import{t as T}from"./client-DyaaoQco.js";import{f as E,p as D,v as O,y as k}from"./index-B-XS-rcK.js";import{i as A,n as ee,t as te}from"./labels-H7OcNmBE.js";import{t as ne}from"./article-VOur4SiZ.js";function j(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function re(e){if(Array.isArray(e))return e}function M(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r,i,a,o,s=[],c=!0,l=!1;try{if(a=(n=n.call(e)).next,t!==0)for(;!(c=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);c=!0);}catch(e){l=!0,i=e}finally{try{if(!c&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(l)throw i}}return s}}function ie(){throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function N(e,t){return re(e)||M(e,t)||P(e,t)||ie()}function P(e,t){if(e){if(typeof e==`string`)return j(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?j(e,t):void 0}}var ae=Object.entries,oe=Object.setPrototypeOf,se=Object.isFrozen,ce=Object.getPrototypeOf,F=Object.getOwnPropertyDescriptor,I=Object.freeze,L=Object.seal,le=Object.create,ue=typeof Reflect<`u`&&Reflect,de=ue.apply,R=ue.construct;I||=function(e){return e},L||=function(e){return e},de||=function(e,t){var n=[...arguments].slice(2);return e.apply(t,n)},R||=function(e){return new e(...[...arguments].slice(1))};var fe=U(Array.prototype.forEach),pe=U(Array.prototype.lastIndexOf),me=U(Array.prototype.pop),he=U(Array.prototype.push),ge=U(Array.prototype.splice),_e=Array.isArray,ve=U(String.prototype.toLowerCase),ye=U(String.prototype.toString),be=U(String.prototype.match),xe=U(String.prototype.replace),Se=U(String.prototype.indexOf),Ce=U(String.prototype.trim),we=U(Number.prototype.toString),z=U(Boolean.prototype.toString),Te=typeof BigInt>`u`?null:U(BigInt.prototype.toString),B=typeof Symbol>`u`?null:U(Symbol.prototype.toString),V=U(Object.prototype.hasOwnProperty),Ee=U(Object.prototype.toString),H=U(RegExp.prototype.test),De=Oe(TypeError);function U(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);var n=[...arguments].slice(1);return de(e,t,n)}}function Oe(e){return function(){return R(e,[...arguments])}}function W(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:ve;if(oe&&oe(e,null),!_e(t))return e;let r=t.length;for(;r--;){let i=t[r];if(typeof i==`string`){let e=n(i);e!==i&&(se(t)||(t[r]=e),i=e)}e[i]=!0}return e}function ke(e){for(let t=0;t<e.length;t++)V(e,t)||(e[t]=null);return e}function G(e){let t=le(null);for(let r of ae(e)){var n=N(r,2);let i=n[0],a=n[1];V(e,i)&&(_e(a)?t[i]=ke(a):a&&typeof a==`object`&&a.constructor===Object?t[i]=G(a):t[i]=a)}return t}function Ae(e){switch(typeof e){case`string`:return e;case`number`:return we(e);case`boolean`:return z(e);case`bigint`:return Te?Te(e):`0`;case`symbol`:return B?B(e):`Symbol()`;case`undefined`:return Ee(e);case`function`:case`object`:{if(e===null)return Ee(e);let t=e,n=je(t,`toString`);if(typeof n==`function`){let e=n(t);return typeof e==`string`?e:Ee(e)}return Ee(e)}default:return Ee(e)}}function je(e,t){for(;e!==null;){let n=F(e,t);if(n){if(n.get)return U(n.get);if(typeof n.value==`function`)return U(n.value)}e=ce(e)}function n(){return null}return n}function Me(e){try{return H(e,``),!0}catch{return!1}}var Ne=I(`a.abbr.acronym.address.area.article.aside.audio.b.bdi.bdo.big.blink.blockquote.body.br.button.canvas.caption.center.cite.code.col.colgroup.content.data.datalist.dd.decorator.del.details.dfn.dialog.dir.div.dl.dt.element.em.fieldset.figcaption.figure.font.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.img.input.ins.kbd.label.legend.li.main.map.mark.marquee.menu.menuitem.meter.nav.nobr.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.section.select.shadow.slot.small.source.spacer.span.strike.strong.style.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.track.tt.u.ul.var.video.wbr`.split(`.`)),Pe=I(`svg.a.altglyph.altglyphdef.altglyphitem.animatecolor.animatemotion.animatetransform.circle.clippath.defs.desc.ellipse.enterkeyhint.exportparts.filter.font.g.glyph.glyphref.hkern.image.inputmode.line.lineargradient.marker.mask.metadata.mpath.part.path.pattern.polygon.polyline.radialgradient.rect.stop.style.switch.symbol.text.textpath.title.tref.tspan.view.vkern`.split(`.`)),Fe=I([`feBlend`,`feColorMatrix`,`feComponentTransfer`,`feComposite`,`feConvolveMatrix`,`feDiffuseLighting`,`feDisplacementMap`,`feDistantLight`,`feDropShadow`,`feFlood`,`feFuncA`,`feFuncB`,`feFuncG`,`feFuncR`,`feGaussianBlur`,`feImage`,`feMerge`,`feMergeNode`,`feMorphology`,`feOffset`,`fePointLight`,`feSpecularLighting`,`feSpotLight`,`feTile`,`feTurbulence`]),Ie=I([`animate`,`color-profile`,`cursor`,`discard`,`font-face`,`font-face-format`,`font-face-name`,`font-face-src`,`font-face-uri`,`foreignobject`,`hatch`,`hatchpath`,`mesh`,`meshgradient`,`meshpatch`,`meshrow`,`missing-glyph`,`script`,`set`,`solidcolor`,`unknown`,`use`]),Le=I(`math.menclose.merror.mfenced.mfrac.mglyph.mi.mlabeledtr.mmultiscripts.mn.mo.mover.mpadded.mphantom.mroot.mrow.ms.mspace.msqrt.mstyle.msub.msup.msubsup.mtable.mtd.mtext.mtr.munder.munderover.mprescripts`.split(`.`)),Re=I([`maction`,`maligngroup`,`malignmark`,`mlongdiv`,`mscarries`,`mscarry`,`msgroup`,`mstack`,`msline`,`msrow`,`semantics`,`annotation`,`annotation-xml`,`mprescripts`,`none`]),ze=I([`#text`]),Be=I(`accept.action.align.alt.autocapitalize.autocomplete.autopictureinpicture.autoplay.background.bgcolor.border.capture.cellpadding.cellspacing.checked.cite.class.clear.color.cols.colspan.command.commandfor.controls.controlslist.coords.crossorigin.datetime.decoding.default.dir.disabled.disablepictureinpicture.disableremoteplayback.download.draggable.enctype.enterkeyhint.exportparts.face.for.headers.height.hidden.high.href.hreflang.id.inert.inputmode.integrity.ismap.kind.label.lang.list.loading.loop.low.max.maxlength.media.method.min.minlength.multiple.muted.name.nonce.noshade.novalidate.nowrap.open.optimum.part.pattern.placeholder.playsinline.popover.popovertarget.popovertargetaction.poster.preload.pubdate.radiogroup.readonly.rel.required.rev.reversed.role.rows.rowspan.spellcheck.scope.selected.shape.size.sizes.slot.span.srclang.start.src.srcset.step.style.summary.tabindex.title.translate.type.usemap.valign.value.width.wrap.xmlns`.split(`.`)),Ve=I(`accent-height.accumulate.additive.alignment-baseline.amplitude.ascent.attributename.attributetype.azimuth.basefrequency.baseline-shift.begin.bias.by.class.clip.clippathunits.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.cx.cy.d.dx.dy.diffuseconstant.direction.display.divisor.dominant-baseline.dur.edgemode.elevation.end.exponent.fill.fill-opacity.fill-rule.filter.filterunits.flood-color.flood-opacity.font-family.font-size.font-size-adjust.font-stretch.font-style.font-variant.font-weight.fx.fy.g1.g2.glyph-name.glyphref.gradientunits.gradienttransform.height.href.id.image-rendering.in.in2.intercept.k.k1.k2.k3.k4.kerning.keypoints.keysplines.keytimes.lang.lengthadjust.letter-spacing.kernelmatrix.kernelunitlength.lighting-color.local.marker-end.marker-mid.marker-start.markerheight.markerunits.markerwidth.maskcontentunits.maskunits.max.mask.mask-type.media.method.mode.min.name.numoctaves.offset.operator.opacity.order.orient.orientation.origin.overflow.paint-order.path.pathlength.patterncontentunits.patterntransform.patternunits.points.preservealpha.preserveaspectratio.primitiveunits.r.rx.ry.radius.refx.refy.repeatcount.repeatdur.restart.result.rotate.scale.seed.shape-rendering.slope.specularconstant.specularexponent.spreadmethod.startoffset.stddeviation.stitchtiles.stop-color.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke.stroke-width.style.surfacescale.systemlanguage.tabindex.tablevalues.targetx.targety.transform.transform-origin.text-anchor.text-decoration.text-orientation.text-rendering.textlength.type.u1.u2.unicode.values.viewbox.visibility.version.vert-adv-y.vert-origin-x.vert-origin-y.width.word-spacing.wrap.writing-mode.xchannelselector.ychannelselector.x.x1.x2.xmlns.y.y1.y2.z.zoomandpan`.split(`.`)),He=I(`accent.accentunder.align.bevelled.close.columnalign.columnlines.columnspacing.columnspan.denomalign.depth.dir.display.displaystyle.encoding.fence.frame.height.href.id.largeop.length.linethickness.lquote.lspace.mathbackground.mathcolor.mathsize.mathvariant.maxsize.minsize.movablelimits.notation.numalign.open.rowalign.rowlines.rowspacing.rowspan.rspace.rquote.scriptlevel.scriptminsize.scriptsizemultiplier.selection.separator.separators.stretchy.subscriptshift.supscriptshift.symmetric.voffset.width.xmlns`.split(`.`)),Ue=I([`xlink:href`,`xml:id`,`xlink:title`,`xml:space`,`xmlns:xlink`]),We=L(/{{[\w\W]*|^[\w\W]*}}/g),Ge=L(/<%[\w\W]*|^[\w\W]*%>/g),Ke=L(/\${[\w\W]*/g),qe=L(/^data-[\-\w.\u00B7-\uFFFF]+$/),Je=L(/^aria-[\-\w]+$/),Ye=L(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Xe=L(/^(?:\w+script|data):/i),Ze=L(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Qe=L(/^html$/i),$e=L(/^[a-z][.\w]*(-[.\w]+)+$/i),et=L(/<[/\w!]/g),tt=L(/<[/\w]/g),nt=L(/<\/no(script|embed|frames)/i),rt=L(/\/>/i),K={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,processingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},it=function(){return typeof window>`u`?null:window},at=function(e,t){if(typeof e!=`object`||typeof e.createPolicy!=`function`)return null;let n=null,r=`data-tt-policy-suffix`;t&&t.hasAttribute(r)&&(n=t.getAttribute(r));let i=`dompurify`+(n?`#`+n:``);try{return e.createPolicy(i,{createHTML(e){return e},createScriptURL(e){return e}})}catch{return console.warn(`TrustedTypes policy `+i+` could not be created.`),null}},ot=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},st=function(e,t,n,r){return V(e,t)&&_e(e[t])?W(r.base?G(r.base):{},e[t],r.transform):n};function ct(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:it(),t=e=>ct(e);if(t.version=`3.4.12`,t.removed=[],!e||!e.document||e.document.nodeType!==K.document||!e.Element)return t.isSupported=!1,t;let n=e.document,r=n,i=r.currentScript;e.DocumentFragment;let a=e.HTMLTemplateElement,o=e.Node,s=e.Element,c=e.NodeFilter;e.NamedNodeMap===void 0&&(e.NamedNodeMap||e.MozNamedAttrMap),e.HTMLFormElement;let l=e.DOMParser,u=e.trustedTypes,d=s.prototype,f=je(d,`cloneNode`),p=je(d,`remove`),m=je(d,`nextSibling`),h=je(d,`childNodes`),g=je(d,`parentNode`),_=je(d,`shadowRoot`),v=je(d,`attributes`),y=o&&o.prototype?je(o.prototype,`nodeType`):null,b=o&&o.prototype?je(o.prototype,`nodeName`):null;if(typeof a==`function`){let e=n.createElement(`template`);e.content&&e.content.ownerDocument&&(n=e.content.ownerDocument)}let x,S=``,C,w=!1,T=0,E=function(){if(T>0)throw De(`A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.`)},D=function(e){E(),T++;try{return x.createHTML(e)}finally{T--}},O=function(e){E(),T++;try{return x.createScriptURL(e)}finally{T--}},k=function(){return w||=(C=at(u,i),!0),C},A=n,ee=A.implementation,te=A.createNodeIterator,ne=A.createDocumentFragment,j=A.getElementsByTagName,re=r.importNode,M=ot();t.isSupported=typeof ae==`function`&&typeof g==`function`&&ee&&ee.createHTMLDocument!==void 0;let ie=We,N=Ge,P=Ke,oe=qe,se=Je,ce=Xe,F=Ze,ue=$e,de=Ye,R=null,we=W({},[...Ne,...Pe,...Fe,...Le,...ze]),z=null,Te=W({},[...Be,...Ve,...He,...Ue]),B=Object.seal(le(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Ee=null,U=null,Oe=Object.seal(le(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),ke=!0,lt=!0,ut=!1,dt=!0,q=!1,ft=!0,J=!1,pt=!1,mt=null,ht=null,gt=!1,Y=!1,_t=!1,vt=!1,yt=!0,bt=!1,xt=`user-content-`,St=!0,Ct=!1,wt={},X=null,Tt=W({},`annotation-xml.audio.colgroup.desc.foreignobject.head.iframe.math.mi.mn.mo.ms.mtext.noembed.noframes.noscript.plaintext.script.selectedcontent.style.svg.template.thead.title.video.xmp`.split(`.`)),Et=null,Dt=W({},[`audio`,`video`,`img`,`source`,`image`,`track`]),Ot=null,kt=W({},[`alt`,`class`,`for`,`id`,`label`,`name`,`pattern`,`placeholder`,`role`,`summary`,`title`,`value`,`style`,`xmlns`]),At=`http://www.w3.org/1998/Math/MathML`,jt=`http://www.w3.org/2000/svg`,Mt=`http://www.w3.org/1999/xhtml`,Nt=Mt,Pt=!1,Ft=null,It=W({},[At,jt,Mt],ye),Lt=I([`mi`,`mo`,`mn`,`ms`,`mtext`]),Z=W({},Lt),Rt=I([`annotation-xml`]),zt=W({},Rt),Bt=W({},[`title`,`style`,`font`,`a`,`script`]),Vt=null,Ht=[`application/xhtml+xml`,`text/html`],Q=null,Ut=null,Wt=n.createElement(`form`),Gt=function(e){return e instanceof RegExp||e instanceof Function},Kt=function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(Ut&&Ut===e)return;(!e||typeof e!=`object`)&&(e={}),e=G(e),Vt=Ht.indexOf(e.PARSER_MEDIA_TYPE)===-1?`text/html`:e.PARSER_MEDIA_TYPE,Q=Vt===`application/xhtml+xml`?ye:ve,R=st(e,`ALLOWED_TAGS`,we,{transform:Q}),z=st(e,`ALLOWED_ATTR`,Te,{transform:Q}),Ft=st(e,`ALLOWED_NAMESPACES`,It,{transform:ye}),Ot=st(e,`ADD_URI_SAFE_ATTR`,kt,{transform:Q,base:kt}),Et=st(e,`ADD_DATA_URI_TAGS`,Dt,{transform:Q,base:Dt}),X=st(e,`FORBID_CONTENTS`,Tt,{transform:Q}),Ee=st(e,`FORBID_TAGS`,G({}),{transform:Q}),U=st(e,`FORBID_ATTR`,G({}),{transform:Q}),wt=V(e,`USE_PROFILES`)?e.USE_PROFILES&&typeof e.USE_PROFILES==`object`?G(e.USE_PROFILES):e.USE_PROFILES:!1,ke=e.ALLOW_ARIA_ATTR!==!1,lt=e.ALLOW_DATA_ATTR!==!1,ut=e.ALLOW_UNKNOWN_PROTOCOLS||!1,dt=e.ALLOW_SELF_CLOSE_IN_ATTR!==!1,q=e.SAFE_FOR_TEMPLATES||!1,ft=e.SAFE_FOR_XML!==!1,J=e.WHOLE_DOCUMENT||!1,Y=e.RETURN_DOM||!1,_t=e.RETURN_DOM_FRAGMENT||!1,vt=e.RETURN_TRUSTED_TYPE||!1,gt=e.FORCE_BODY||!1,yt=e.SANITIZE_DOM!==!1,bt=e.SANITIZE_NAMED_PROPS||!1,St=e.KEEP_CONTENT!==!1,Ct=e.IN_PLACE||!1,de=Me(e.ALLOWED_URI_REGEXP)?e.ALLOWED_URI_REGEXP:Ye,Nt=typeof e.NAMESPACE==`string`?e.NAMESPACE:Mt,Z=V(e,`MATHML_TEXT_INTEGRATION_POINTS`)&&e.MATHML_TEXT_INTEGRATION_POINTS&&typeof e.MATHML_TEXT_INTEGRATION_POINTS==`object`?G(e.MATHML_TEXT_INTEGRATION_POINTS):W({},Lt),zt=V(e,`HTML_INTEGRATION_POINTS`)&&e.HTML_INTEGRATION_POINTS&&typeof e.HTML_INTEGRATION_POINTS==`object`?G(e.HTML_INTEGRATION_POINTS):W({},Rt);let t=V(e,`CUSTOM_ELEMENT_HANDLING`)&&e.CUSTOM_ELEMENT_HANDLING&&typeof e.CUSTOM_ELEMENT_HANDLING==`object`?G(e.CUSTOM_ELEMENT_HANDLING):le(null);if(B=le(null),V(t,`tagNameCheck`)&&Gt(t.tagNameCheck)&&(B.tagNameCheck=t.tagNameCheck),V(t,`attributeNameCheck`)&&Gt(t.attributeNameCheck)&&(B.attributeNameCheck=t.attributeNameCheck),V(t,`allowCustomizedBuiltInElements`)&&typeof t.allowCustomizedBuiltInElements==`boolean`&&(B.allowCustomizedBuiltInElements=t.allowCustomizedBuiltInElements),L(B),q&&(lt=!1),_t&&(Y=!0),wt&&(R=W({},ze),z=le(null),wt.html===!0&&(W(R,Ne),W(z,Be)),wt.svg===!0&&(W(R,Pe),W(z,Ve),W(z,Ue)),wt.svgFilters===!0&&(W(R,Fe),W(z,Ve),W(z,Ue)),wt.mathMl===!0&&(W(R,Le),W(z,He),W(z,Ue))),Oe.tagCheck=null,Oe.attributeCheck=null,V(e,`ADD_TAGS`)&&(typeof e.ADD_TAGS==`function`?Oe.tagCheck=e.ADD_TAGS:_e(e.ADD_TAGS)&&(R===we&&(R=G(R)),W(R,e.ADD_TAGS,Q))),V(e,`ADD_ATTR`)&&(typeof e.ADD_ATTR==`function`?Oe.attributeCheck=e.ADD_ATTR:_e(e.ADD_ATTR)&&(z===Te&&(z=G(z)),W(z,e.ADD_ATTR,Q))),V(e,`ADD_URI_SAFE_ATTR`)&&_e(e.ADD_URI_SAFE_ATTR)&&W(Ot,e.ADD_URI_SAFE_ATTR,Q),V(e,`FORBID_CONTENTS`)&&_e(e.FORBID_CONTENTS)&&(X===Tt&&(X=G(X)),W(X,e.FORBID_CONTENTS,Q)),V(e,`ADD_FORBID_CONTENTS`)&&_e(e.ADD_FORBID_CONTENTS)&&(X===Tt&&(X=G(X)),W(X,e.ADD_FORBID_CONTENTS,Q)),St&&(R[`#text`]=!0),J&&W(R,[`html`,`head`,`body`]),R.table&&(W(R,[`tbody`]),delete Ee.tbody),e.TRUSTED_TYPES_POLICY){if(typeof e.TRUSTED_TYPES_POLICY.createHTML!=`function`)throw De(`TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.`);if(typeof e.TRUSTED_TYPES_POLICY.createScriptURL!=`function`)throw De(`TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.`);let t=x;x=e.TRUSTED_TYPES_POLICY;try{S=D(``)}catch(e){throw x=t,e}}else e.TRUSTED_TYPES_POLICY===null?(x=void 0,S=``):(x===void 0&&(x=k()),x&&typeof S==`string`&&(S=D(``)));I&&I(e),Ut=e},qt=W({},[...Pe,...Fe,...Ie]),Jt=W({},[...Le,...Re]),Yt=function(e,t,n){return t.namespaceURI===Mt?e===`svg`:t.namespaceURI===At?e===`svg`&&(n===`annotation-xml`||Z[n]):!!qt[e]},Xt=function(e,t,n){return t.namespaceURI===Mt?e===`math`:t.namespaceURI===jt?e===`math`&&zt[n]:!!Jt[e]},Zt=function(e,t,n){return t.namespaceURI===jt&&!zt[n]||t.namespaceURI===At&&!Z[n]?!1:!Jt[e]&&(Bt[e]||!qt[e])},Qt=function(e){let t=g(e);(!t||!t.tagName)&&(t={namespaceURI:Nt,tagName:`template`});let n=ve(e.tagName),r=ve(t.tagName);return Ft[e.namespaceURI]?e.namespaceURI===jt?Yt(n,t,r):e.namespaceURI===At?Xt(n,t,r):e.namespaceURI===Mt?Zt(n,t,r):!!(Vt===`application/xhtml+xml`&&Ft[e.namespaceURI]):!1},$t=function(e){he(t.removed,{element:e});try{g(e).removeChild(e)}catch{if(p(e),!g(e))throw De(`a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place`)}},en=function(e){rn(e);let t=h(e);if(t){let e=[];fe(t,t=>{he(e,t)}),fe(e,e=>{try{p(e)}catch{}})}let n=v(e);if(n)for(let t=n.length-1;t>=0;--t){let r=n[t],i=r&&r.name;if(typeof i==`string`)try{e.removeAttribute(i)}catch{}}},tn=function(e,n){try{he(t.removed,{attribute:n.getAttributeNode(e),from:n})}catch{he(t.removed,{attribute:null,from:n})}if(n.removeAttribute(e),e===`is`)if(Y||_t)try{$t(n)}catch{}else try{n.setAttribute(e,``)}catch{}},nn=function(e){let t=v(e);if(t)for(let n=t.length-1;n>=0;--n){let r=t[n],i=r&&r.name;if(!(typeof i!=`string`||z[Q(i)]))try{e.removeAttribute(i)}catch{}}},rn=function(e){let t=[e];for(;t.length>0;){let e=t.pop();(y?y(e):e.nodeType)===K.element&&nn(e);let n=h(e);if(n)for(let e=n.length-1;e>=0;--e)t.push(n[e])}},an=function(e){if(!ft)return;let t=[e];for(;t.length>0;){let e=t.pop(),n=y?y(e):e.nodeType;if(n===K.processingInstruction||n===K.comment&&H(tt,e.data)){try{p(e)}catch{}continue}if(n===K.element){let t=e,n=Q(b?b(e):e.nodeName);try{t.hasAttribute&&t.hasAttribute(`patchsrc`)&&t.removeAttribute(`patchsrc`),t.hasAttribute&&t.hasAttribute(`for`)&&n!==`label`&&n!==`output`&&t.removeAttribute(`for`)}catch{}}let r=h(e);if(r)for(let e=r.length-1;e>=0;--e)t.push(r[e])}},on=function(e){let t=null,r=null;if(gt)e=`<remove></remove>`+e;else{let t=be(e,/^[\r\n\t ]+/);r=t&&t[0]}Vt===`application/xhtml+xml`&&Nt===Mt&&(e=`<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>`+e+`</body></html>`);let i=x?D(e):e;if(Nt===Mt)try{t=new l().parseFromString(i,Vt)}catch{}if(!t||!t.documentElement){t=ee.createDocument(Nt,`template`,null);try{t.documentElement.innerHTML=Pt?S:i}catch{}}let a=t.body||t.documentElement;return e&&r&&a.insertBefore(n.createTextNode(r),a.childNodes[0]||null),Nt===Mt?j.call(t,J?`html`:`body`)[0]:J?t.documentElement:a},sn=function(e){return te.call(e.ownerDocument||e,e,c.SHOW_ELEMENT|c.SHOW_COMMENT|c.SHOW_TEXT|c.SHOW_PROCESSING_INSTRUCTION|c.SHOW_CDATA_SECTION,null)},cn=function(e){return e=xe(e,ie,` `),e=xe(e,N,` `),e=xe(e,P,` `),e},ln=function(e){e.normalize();let t=te.call(e.ownerDocument||e,e,c.SHOW_TEXT|c.SHOW_COMMENT|c.SHOW_CDATA_SECTION|c.SHOW_PROCESSING_INSTRUCTION,null),n=t.nextNode();for(;n;)n.data=cn(n.data),n=t.nextNode();let r=e.querySelectorAll?.call(e,`template`);r&&fe(r,e=>{$(e.content)&&ln(e.content)})},un=function(e){let t=b?b(e):null;return typeof t!=`string`||Q(t)!==`form`?!1:typeof e.nodeName!=`string`||typeof e.textContent!=`string`||typeof e.removeChild!=`function`||e.attributes!==v(e)||typeof e.removeAttribute!=`function`||typeof e.setAttribute!=`function`||typeof e.namespaceURI!=`string`||typeof e.insertBefore!=`function`||typeof e.hasChildNodes!=`function`||e.nodeType!==y(e)||e.childNodes!==h(e)},$=function(e){if(!y||typeof e!=`object`||!e)return!1;try{return y(e)===K.documentFragment}catch{return!1}},dn=function(e){if(!y||typeof e!=`object`||!e)return!1;try{return typeof y(e)==`number`}catch{return!1}};function fn(e,n,r){e.length!==0&&fe(e,e=>{e.call(t,n,r,Ut)})}let pn=function(e,t){return!!(ft&&e.hasChildNodes()&&!dn(e.firstElementChild)&&H(et,e.textContent)&&H(et,e.innerHTML)||ft&&e.namespaceURI===Mt&&t===`style`&&dn(e.firstElementChild)||e.nodeType===K.processingInstruction||ft&&e.nodeType===K.comment&&H(tt,e.data))},mn=function(e,t){if(!Ee[t]&&vn(t)&&(B.tagNameCheck instanceof RegExp&&H(B.tagNameCheck,t)||B.tagNameCheck instanceof Function&&B.tagNameCheck(t)))return!1;if(St&&!X[t]){let t=g(e),n=h(e);if(n&&t){let r=n.length;for(let i=r-1;i>=0;--i){let r=Ct?n[i]:f(n[i],!0);t.insertBefore(r,m(e))}}}return $t(e),!0},hn=function(e,n){if(fn(M.beforeSanitizeElements,e,null),e!==n&&g(e)===null)return!0;if(un(e))return $t(e),!0;let r=Q(b?b(e):e.nodeName);if(fn(M.uponSanitizeElement,e,{tagName:r,allowedTags:R}),e!==n&&g(e)===null)return!0;if(pn(e,r))return $t(e),!0;if(Ee[r]||!(Oe.tagCheck instanceof Function&&Oe.tagCheck(r))&&!R[r]){let t=mn(e,r);return t===!1&&fn(M.afterSanitizeElements,e,null),t}if((y?y(e):e.nodeType)===K.element&&!Qt(e)||(r===`noscript`||r===`noembed`||r===`noframes`)&&H(nt,e.innerHTML))return $t(e),!0;if(q&&e.nodeType===K.text){let n=cn(e.textContent);e.textContent!==n&&(he(t.removed,{element:e.cloneNode()}),e.textContent=n)}return fn(M.afterSanitizeElements,e,null),!1},gn=function(e,t,r){if(U[t]||ft&&t===`patchsrc`||ft&&t===`for`&&e!==`label`&&e!==`output`||yt&&(t===`id`||t===`name`)&&(r in n||r in Wt))return!1;let i=z[t]||Oe.attributeCheck instanceof Function&&Oe.attributeCheck(t,e);if(!(lt&&H(oe,t))&&!(ke&&H(se,t))){if(!i){if(!(vn(e)&&(B.tagNameCheck instanceof RegExp&&H(B.tagNameCheck,e)||B.tagNameCheck instanceof Function&&B.tagNameCheck(e))&&(B.attributeNameCheck instanceof RegExp&&H(B.attributeNameCheck,t)||B.attributeNameCheck instanceof Function&&B.attributeNameCheck(t,e))||t===`is`&&B.allowCustomizedBuiltInElements&&(B.tagNameCheck instanceof RegExp&&H(B.tagNameCheck,r)||B.tagNameCheck instanceof Function&&B.tagNameCheck(r))))return!1}else if(!Ot[t]&&!H(de,xe(r,F,``))&&!((t===`src`||t===`xlink:href`||t===`href`)&&e!==`script`&&Se(r,`data:`)===0&&Et[e])&&!(ut&&!H(ce,xe(r,F,``)))&&r)return!1}return!0},_n=W({},[`annotation-xml`,`color-profile`,`font-face`,`font-face-format`,`font-face-name`,`font-face-src`,`font-face-uri`,`missing-glyph`]),vn=function(e){return!_n[ve(e)]&&H(ue,e)},yn=function(e,t,n,r){if(x&&typeof u==`object`&&typeof u.getAttributeType==`function`&&!n)switch(u.getAttributeType(e,t)){case`TrustedHTML`:return D(r);case`TrustedScriptURL`:return O(r)}return r},bn=function(e,n,r,i){try{r?e.setAttributeNS(r,n,i):e.setAttribute(n,i),un(e)?$t(e):me(t.removed)}catch{tn(n,e)}},xn=function(e){fn(M.beforeSanitizeAttributes,e,null);let t=e.attributes;if(!t||un(e))return;let n={attrName:``,attrValue:``,keepAttr:!0,allowedAttributes:z,forceKeepAttr:void 0},r=t.length,i=Q(e.nodeName);for(;r--;){let a=t[r],o=a.name,s=a.namespaceURI,c=a.value,l=Q(o),u=c,d=o===`value`?u:Ce(u);if(n.attrName=l,n.attrValue=d,n.keepAttr=!0,n.forceKeepAttr=void 0,fn(M.uponSanitizeAttribute,e,n),d=n.attrValue,bt&&(l===`id`||l===`name`)&&Se(d,xt)!==0&&(tn(o,e),d=xt+d),ft&&H(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,d)){tn(o,e);continue}if(l===`attributename`&&be(d,`href`)){tn(o,e);continue}if(!n.forceKeepAttr){if(!n.keepAttr){tn(o,e);continue}if(!dt&&H(rt,d)){tn(o,e);continue}if(q&&(d=cn(d)),!gn(i,l,d)){tn(o,e);continue}d=yn(i,l,s,d),d!==u&&bn(e,o,s,d)}}fn(M.afterSanitizeAttributes,e,null)},Sn=function(e){let t=null,n=sn(e);for(fn(M.beforeSanitizeShadowDOM,e,null);t=n.nextNode();)if(fn(M.uponSanitizeShadowNode,t,null),hn(t,e),xn(t),$(t.content)&&Sn(t.content),(y?y(t):t.nodeType)===K.element){let e=_(t);$(e)&&(Cn(e),Sn(e))}fn(M.afterSanitizeShadowDOM,e,null)},Cn=function(e){let t=[{node:e,shadow:null}];for(;t.length>0;){let e=t.pop();if(e.shadow){Sn(e.shadow);continue}let n=e.node,r=(y?y(n):n.nodeType)===K.element,i=h(n);if(i)for(let e=i.length-1;e>=0;--e)t.push({node:i[e],shadow:null});if(r){let e=b?b(n):null;if(typeof e==`string`&&Q(e)===`template`){let e=n.content;$(e)&&t.push({node:e,shadow:null})}}if(r){let e=_(n);$(e)&&t.push({node:null,shadow:e},{node:e,shadow:null})}}};return t.sanitize=function(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=null,a=null,o=null,s=null;if(Pt=!e,Pt&&(e=`<!-->`),typeof e!=`string`&&!dn(e)&&(e=Ae(e),typeof e!=`string`))throw De(`dirty is not a string, aborting`);if(!t.isSupported)return e;pt?(R=mt,z=ht):Kt(n),(M.uponSanitizeElement.length>0||M.uponSanitizeAttribute.length>0)&&(R=G(R)),M.uponSanitizeAttribute.length>0&&(z=G(z)),t.removed=[];let c=Ct&&typeof e!=`string`&&dn(e);if(c){an(e);let t=b?b(e):e.nodeName;if(typeof t==`string`){let n=Q(t);if(!R[n]||Ee[n])throw en(e),De(`root node is forbidden and cannot be sanitized in-place`)}if(un(e))throw en(e),De(`root node is clobbered and cannot be sanitized in-place`);try{Cn(e)}catch(t){throw en(e),t}}else if(dn(e))i=on(`<!---->`),a=i.ownerDocument.importNode(e,!0),a.nodeType===K.element&&a.nodeName===`BODY`||a.nodeName===`HTML`?i=a:i.appendChild(a),Cn(a);else{if(!Y&&!q&&!J&&e.indexOf(`<`)===-1)return x&&vt?D(e):e;if(i=on(e),!i)return Y?null:vt?S:``}i&&gt&&$t(i.firstChild);let l=c?e:i,u=sn(l);try{for(;o=u.nextNode();)hn(o,l),xn(o),$(o.content)&&Sn(o.content)}catch(n){throw c&&(en(e),fe(t.removed,e=>{e.element&&rn(e.element)})),n}if(c)return fe(t.removed,e=>{e.element&&rn(e.element)}),q&&ln(e),e;if(Y){if(q&&ln(i),_t)for(s=ne.call(i.ownerDocument);i.firstChild;)s.appendChild(i.firstChild);else s=i;return(z.shadowroot||z.shadowrootmode)&&(s=re.call(r,s,!0)),s}let d=J?i.outerHTML:i.innerHTML;return J&&R[`!doctype`]&&i.ownerDocument&&i.ownerDocument.doctype&&i.ownerDocument.doctype.name&&H(Qe,i.ownerDocument.doctype.name)&&(d=`<!DOCTYPE `+i.ownerDocument.doctype.name+`>
`+d),q&&(d=cn(d)),x&&vt?D(d):d},t.setConfig=function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Kt(e),pt=!0,mt=R,ht=z},t.clearConfig=function(){Ut=null,pt=!1,mt=null,ht=null,x=C,S=``},t.isValidAttribute=function(e,t,n){Ut||Kt({});let r=Q(e),i=Q(t);return gn(r,i,n)},t.addHook=function(e,t){typeof t==`function`&&V(M,e)&&he(M[e],t)},t.removeHook=function(e,t){if(V(M,e)){if(t!==void 0){let n=pe(M[e],t);return n===-1?void 0:ge(M[e],n,1)[0]}return me(M[e])}},t.removeHooks=function(e){V(M,e)&&(M[e]=[])},t.removeAllHooks=function(){M=ot()},t}var lt=ct();function ut(e,t){let n=String(e??``),r=n.match(/^\s*<h1\b[^>]*>([\s\S]*?)<\/h1>\s*/i);if(!r)return n;let i=r[1].replace(/<[^>]*>/g,``).replace(/\s+/g,` `).trim(),a=String(t??``).replace(/\s+/g,` `).trim();return!a||i!==a?n:n.slice(r[0].length)}function dt(e){let t=e.length,n=Array.from({length:t},(e,n)=>n+1<t?n+1:null),r=[],i=null,a=t>0?0:null,o=null,s=(e,t)=>r.push({phase:e,desc:t,prev:i,curr:a,next:o,nextOf:[...n],done:!1}),c=t=>t===null?`∅`:String(e[t]);if(t===0)return s(`init`,"空链表。`head` 本身就是 ∅，直接返回 ∅ —— 这是必须单独处理的第一种边界。"),r[0].done=!0,r;for(s(`init`,`初始状态：\`prev\` 先站在 ∅（反转后头节点会变成尾节点，它的 \`next\` 必须指向空），\`curr\` 指向头节点 ${c(a)}。`);a!==null;)o=n[a],s(`read-next`,`① \`next = curr.next\`，先记住 ${c(o)}。这一步看着多余，其实是整个算法的命门：一旦 ② 把 \`curr\` 的指针掉头，通往后面节点的唯一线索就断了，所以必须提前存好。`),n[a]=i,s(`flip`,`② \`curr.next = prev\`，把 ${c(a)} 的箭头掉个头，指向 ${c(i)}。`+(i===null?` 因为 \`prev\` 还是 ∅，${c(a)} 就成了新的尾节点。`:``)),i=a,a=o,s(`advance`,a===null?`③ \`prev = curr\`，\`curr = next\` = ∅。curr 走出了链表，循环结束 —— 返回 \`prev\`（${c(i)}），它就是反转后的新头节点。`:`③ \`prev\` 和 \`curr\` 一起右移：\`prev\` 指向 ${c(i)}，\`curr\` 指向 ${c(a)}。准备处理下一个节点。`);return r[r.length-1].done=!0,r}var q=`viz-chrome-styles`,ft=`http://www.w3.org/2000/svg`;function J(e,t){let n=document.createElementNS(ft,e);if(t)for(let e in t)n.setAttribute(e,t[e]);return n}function pt(e,t,n,r,i=`viz-arrow`){let a=J(`g`,{class:i}),o=r>0?t:e,s=r>0?e:t;return a.appendChild(J(`line`,{class:`${i}__line`,x1:s,y1:n,x2:o-r*9,y2:n})),a.appendChild(J(`path`,{class:`${i}__head`,d:`M ${o} ${n} L ${o-r*9} ${n-5.5} L ${o-r*9} ${n+5.5} Z`})),a}var mt=`
.viz {
  margin: 1.6em 0;
  padding: 16px 16px 12px;
  background: var(--surface-muted, #ecefe8);
  border: 1px solid var(--glass-border, #dce2da);
  border-radius: 10px;
}
.viz__stage {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}
.viz__svg {
  display: block;
  width: 100%;
  height: auto;
  font-family: inherit;
}
.viz__desc {
  margin: 14px 0 0;
  padding: 0;
  min-height: 3.2em;
  color: var(--text-primary, #1f2a24);
  font-size: 0.9rem;
  line-height: 1.75;
}
.viz__desc code {
  padding: 1px 5px;
  background: rgba(101, 113, 104, 0.16);
  border-radius: 4px;
  font-size: 0.85em;
}
.viz__desc strong { color: var(--accent, #3f6b57); font-weight: 700; }
.viz__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--glass-border, #dce2da);
}
.viz__btn {
  padding: 7px 14px;
  color: var(--text-primary, #1f2a24);
  background: var(--surface, #fff);
  border: 1px solid var(--glass-border, #dce2da);
  border-radius: 7px;
  font-size: 0.82rem;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease;
}
.viz__btn:hover:not(:disabled) {
  color: var(--accent, #3f6b57);
  border-color: var(--accent, #3f6b57);
}
.viz__btn:disabled { opacity: 0.4; cursor: not-allowed; }
.viz__btn--play {
  color: #fff;
  background: var(--accent, #3f6b57);
  border-color: var(--accent, #3f6b57);
  font-weight: 600;
}
.viz__btn--play:hover:not(:disabled) { color: #fff; opacity: 0.88; }
.viz__count {
  margin-left: auto;
  color: var(--text-secondary, #657168);
  font-size: 0.78rem;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-variant-numeric: tabular-nums;
}
@media (max-width: 560px) {
  .viz { padding: 12px 10px 10px; }
  .viz__desc { font-size: 0.85rem; }
  .viz__count { width: 100%; margin-left: 0; text-align: right; }
}
@media (prefers-reduced-motion: reduce) {
  .viz__btn { transition: none; }
}
`;function ht(){if(document.getElementById(q))return;let e=document.createElement(`style`);e.id=q,e.textContent=mt,document.head.appendChild(e)}function gt(){document.getElementById(q)?.remove()}function Y(e,t){e.textContent=``;let n=String(t??``),r=/(`[^`]*`|\*\*[^*]+\*\*)/g,i=0;for(let t of n.matchAll(r)){t.index>i&&e.appendChild(document.createTextNode(n.slice(i,t.index)));let r=t[0],a=r.startsWith("`"),o=document.createElement(a?`code`:`strong`);o.textContent=r.slice(a?1:2,a?-1:-2),e.appendChild(o),i=t.index+r.length}i<n.length&&e.appendChild(document.createTextNode(n.slice(i)))}function _t({playLabel:e=`播放`,pauseLabel:t=`暂停`}={}){let n=(e,t)=>{let n=document.createElement(`button`);return n.type=`button`,n.className=t?`viz__btn ${t}`:`viz__btn`,n.textContent=e,n},r=document.createElement(`div`);r.className=`viz__bar`;let i=n(`上一步`),a=n(e,`viz__btn--play`),o=n(`下一步`),s=n(`重置`),c=document.createElement(`span`);return c.className=`viz__count`,r.append(i,a,o,s,c),{root:r,prev:i,play:a,next:o,reset:s,count:c,setPlaying:n=>{a.textContent=n?t:e}}}function vt({steps:e,controls:t,intervalMs:n=1150,onRender:r}){let i=0,a=null,o=()=>{a&&=(clearInterval(a),null),t.setPlaying(!1)},s=()=>{r(i,e[i]),t.count.textContent=`第 ${i+1} / ${e.length} 步`,t.prev.disabled=i===0,t.next.disabled=i===e.length-1,t.reset.disabled=i===0&&!a},c=()=>{a||(i===e.length-1&&(i=0),t.setPlaying(!0),a=setInterval(()=>{if(i>=e.length-1){o(),s();return}i+=1,s()},n),s())},l=t=>{o(),i=Math.min(e.length-1,Math.max(0,i+t)),s()},u=()=>{o(),i=0,s()},d=t=>{o(),i=Math.min(e.length-1,Math.max(0,t)),s()},f={prev:()=>l(-1),next:()=>l(1),reset:u,play:()=>a?o():c()};return t.prev.addEventListener(`click`,f.prev),t.next.addEventListener(`click`,f.next),t.reset.addEventListener(`click`,f.reset),t.play.addEventListener(`click`,f.play),{render:s,play:c,stop:o,reset:u,jumpTo:d,destroy:()=>{o(),t.prev.removeEventListener(`click`,f.prev),t.next.removeEventListener(`click`,f.next),t.reset.removeEventListener(`click`,f.reset),t.play.removeEventListener(`click`,f.play)},get index(){return i}}}var yt=`llv-styles`,bt=72,xt=52,St=44,Ct=68,wt=96,X=122,Tt=48,Et=200,Dt=240,Ot=62,kt=26,At=276,jt=26,Mt=1150,Nt=0,Pt=(e,t,n,r)=>pt(e,t,n,r,`llv-edge`),Ft=`
/* 只有这块 SVG 的样式是 LC 206 专属的；容器 / 说明 / 控制条在外壳里
   （widgetChrome.js 的 .viz*），两个动画共用。 */
.llv {
  --llv-prev: var(--accent, #3f6b57);
  --llv-curr: var(--accent-secondary, #a45f45);
  --llv-next: #c89a46;
  --llv-edge: var(--text-secondary, #657168);
}
html.theme-dark .llv {
  --llv-next: #d9b063;
}
.llv__svg { min-width: 460px; }
.llv-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.26s ease, stroke-width 0.26s ease, fill 0.26s ease;
}
.llv-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 19px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.llv-node.is-flipped .llv-node__box { stroke: var(--llv-prev); }
.llv-node.is-curr .llv-node__box {
  stroke: var(--llv-curr);
  stroke-width: 3;
}
.llv-node.is-next .llv-node__box { stroke: var(--llv-next); stroke-dasharray: 5 3; }
.llv-edge {
  opacity: 0;
  transition: opacity 0.26s ease;
}
.llv-edge.is-on { opacity: 1; }
.llv-edge__line {
  stroke: var(--llv-edge);
  stroke-width: 1.8;
  stroke-linecap: round;
}
.llv-edge__head { fill: var(--llv-edge); }
.llv-edge.is-flipped .llv-edge__line { stroke: var(--llv-prev); }
.llv-edge.is-flipped .llv-edge__head { fill: var(--llv-prev); }
.llv-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 3 3;
}
.llv-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  text-anchor: middle;
  dominant-baseline: central;
}
.llv-tick {
  stroke: var(--text-secondary, #657168);
  stroke-width: 1;
  stroke-dasharray: 3 3;
  opacity: 0.65;
}
.llv-chip { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; }
.llv-chip__box { rx: 13; ry: 13; }
.llv-chip__text {
  font-size: 12.5px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.llv-chip--prev .llv-chip__box { fill: var(--llv-prev); }
.llv-chip--prev .llv-chip__text { fill: #fff; }
.llv-chip--curr .llv-chip__box { fill: var(--llv-curr); }
.llv-chip--curr .llv-chip__text { fill: #fff; }
.llv-chip--next .llv-chip__box { fill: var(--llv-next); }
.llv-chip--next .llv-chip__text { fill: #2a2113; }
@media (prefers-reduced-motion: reduce) {
  .llv-chip, .llv-edge, .llv-node__box { transition: none; }
}
`;function It(){if(ht(),document.getElementById(yt))return;let e=document.createElement(`style`);e.id=yt,e.textContent=Ft,document.head.appendChild(e)}function Lt(e,t={}){if(!e||e.dataset.llvMounted===`1`)return{destroy(){}};e.dataset.llvMounted=`1`,It(),Nt+=1;let n=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4,5],r=t.autoplay!==!1,i=dt(n),a=n.length,o=Array.from({length:a},(e,t)=>t+1<a?t+1:null),s=2*Ct+a*bt+Math.max(0,a-1)*St,c=e=>Ct+e*116,l=e=>c(e)+bt/2,u=jt,d=s-jt,f=document.createElement(`div`);f.className=`viz llv`;let p=document.createElement(`div`);p.className=`viz__stage`,f.appendChild(p);let m=J(`svg`,{class:`viz__svg llv__svg`,viewBox:`0 0 ${s} ${At}`,role:`img`,"aria-label":`反转链表推演动画：${n.join(` → `)}`});p.appendChild(m);for(let e of[u,d]){m.appendChild(J(`circle`,{class:`llv-null__ring`,cx:e,cy:X,r:15}));let t=J(`text`,{class:`llv-null__text`,x:e,y:X});t.textContent=`∅`,m.appendChild(t)}let h=J(`line`,{class:`llv-tick`}),g=J(`line`,{class:`llv-tick`}),_=J(`line`,{class:`llv-tick`});m.append(h,g,_);let v=[];for(let e=0;e<a-1;e+=1){let t=c(e)+bt,n=c(e+1),r=Pt(t,n,X,1),i=Pt(t,n,X,-1);m.append(r,i),v.push({fwd:r,bwd:i})}let y=Pt(c(a-1)+bt,d-15,X,1),b=Pt(41,c(0),X,-1);m.append(y,b);let x=[];for(let e=0;e<a;e+=1){let t=J(`g`,{class:`llv-node`});t.appendChild(J(`rect`,{class:`llv-node__box`,x:c(e),y:wt,width:bt,height:xt,rx:9}));let r=J(`text`,{class:`llv-node__value`,x:l(e),y:X});r.textContent=String(n[e]),t.appendChild(r),m.appendChild(t),x.push(t)}function S(e,t){let n=J(`g`,{class:`llv-chip llv-chip--${e}`});n.appendChild(J(`rect`,{class:`llv-chip__box`,x:-62/2,y:-26/2,width:Ot,height:kt}));let r=J(`text`,{class:`llv-chip__text`,x:0,y:0});return r.textContent=t,n.appendChild(r),n}let C=S(`next`,`next`),w=S(`prev`,`prev`),T=S(`curr`,`curr`);m.append(C,w,T);let E=document.createElement(`p`);E.className=`viz__desc`,E.setAttribute(`aria-live`,`polite`),f.appendChild(E);let D=_t();f.appendChild(D.root),e.textContent=``,e.appendChild(f);let O=null;function k(e,t,n,r,i,a,o){e.style.transform=`translate(${n}px, ${r}px)`,e.style.opacity=i?`1`:`0`,i?(t.setAttribute(`x1`,n),t.setAttribute(`x2`,n),t.setAttribute(`y1`,a),t.setAttribute(`y2`,o),t.style.opacity=`0.65`):t.style.opacity=`0`}function A(e,t){for(let e=0;e<a;e+=1){let n=x[e];n.classList.toggle(`is-flipped`,t.nextOf[e]!==o[e]),n.classList.toggle(`is-curr`,t.curr===e),n.classList.toggle(`is-next`,t.next===e)}for(let e=0;e<a-1;e+=1){let n=t.nextOf[e]===e+1,r=t.nextOf[e+1]===e;v[e].fwd.classList.toggle(`is-on`,n),v[e].bwd.classList.toggle(`is-on`,r),v[e].bwd.classList.toggle(`is-flipped`,r)}let n=t.nextOf[a-1]===null,r=t.nextOf[0]===null;y.classList.toggle(`is-on`,n),b.classList.toggle(`is-on`,r),b.classList.toggle(`is-flipped`,r),k(w,g,t.prev===null?u:l(t.prev),Et,!0,Et-kt/2,148),k(T,_,t.curr===null?d:l(t.curr),Dt,!0,Dt-kt/2,148),k(C,h,t.next===null?d:l(t.next),Tt,t.phase!==`init`,61,wt),Y(E,t.desc)}let ee=vt({steps:i,controls:D,intervalMs:Mt,onRender:A});ee.jumpTo(Math.trunc(t.initialStep)||0);let te=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!te&&typeof IntersectionObserver==`function`&&(O=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){O.disconnect(),O=null,ee.play();return}},{threshold:.35}),O.observe(f)),{destroy(){O&&=(O.disconnect(),null),ee.destroy(),e.textContent=``,delete e.dataset.llvMounted,--Nt,Nt<=0&&(document.getElementById(yt)?.remove(),gt())}}}var Z=e=>String(e);function Rt(e,t){let n=Array.isArray(e)?e:[],r=Array.isArray(t)?t:[],i=[],a=[],o=0,s=0,c=(e,t,c={})=>i.push({phase:e,desc:t,p1:o<n.length?o:null,p2:s<r.length?s:null,taken:a.map(e=>({...e})),rest:null,done:!1,...c}),l=(e,t)=>e===`a`?n[t]:r[t];if(n.length===0&&r.length===0)return c(`init`,`两条链表都是空的。哑结点后面什么都没有，返回 ∅。`),i[0].done=!0,i;if(n.length===0||r.length===0){let e=n.length===0?`A`:`B`,t=e===`A`?`B`:`A`;return c(`init`,`${e} 是空链表，那么「合并」就是原样返回 ${t}（${(t===`A`?n:r).map(Z).join(`、`)}）—— 一个空链表和一个有序链表合并，结果就是那个有序链表本身。`),i[0].done=!0,i}for(c(`init`,`两个指针各站在自己链表的头部：\`p1\` 指向 A 的 ${Z(n[0])}，\`p2\` 指向 B 的 ${Z(r[0])}。结果链表先放一个**哑结点**当锚点 —— 它不是答案的一部分，只是为了让我们不必特判「第一个节点该接谁」，最后返回 \`dummy.next\` 就行。`);o<n.length&&s<r.length;){let e=n[o]<=r[s];c(`compare`,`比较 \`p1\` 的 ${Z(n[o])} 和 \`p2\` 的 ${Z(r[s])}：`+(e?`${Z(n[o])} ≤ ${Z(r[s])}，取 A 的 ${Z(n[o])}。`+(n[o]===r[s]?`（相等时取哪边都行，习惯上取 A）`:``):`${Z(r[s])} < ${Z(n[o])}，取 B 的 ${Z(r[s])}。`),{cursor:e?`a`:`b`}),e?(a.push({list:`a`,i:o}),o+=1):(a.push({list:`b`,i:s}),s+=1),c(`take`,`把 ${Z(l(a[a.length-1].list,a[a.length-1].i))} 接到结果链表的尾部，然后 ${e?"`p1`":"`p2`"} 前移一格。`+(e&&o>=n.length?` A 走完了。`:``)+(!e&&s>=r.length?` B 走完了。`:``),{picked:e?`a`:`b`})}if(o<n.length||s<r.length){let e=o<n.length?`a`:`b`,t=o<n.length?o:s,i=(e===`a`?n.slice(o):r.slice(s)).map(Z).join(`、`),l=e===`a`?n:r,u=o<n.length?o:null,d=s<r.length?s:null;for(let n=t;n<l.length;n+=1)a.push({list:e,i:n});e===`a`?o=n.length:s=r.length,c(`append-rest`,`${e===`a`?`B`:`A`} 已经走完了，${e===`a`?`A`:`B`} 剩下的 ${i} 全部原样接到结果尾部。**这是整道题最容易被忽略的一步**：两条链表各自都是有序的，所以剩下这段不需要再逐个比较，直接整段接上就对。`,{rest:{list:e,from:t},p1:u,p2:d})}return c(`done`,`两条链表都走完了。结果链表是 ${a.map(e=>Z(l(e.list,e.i))).join(` → `)} —— 但别忘了开头那个哑结点，它不是答案的一部分，所以返回 \`dummy.next\`。`),i[i.length-1].done=!0,i}var zt=`mtl-styles`,Bt=60,Vt=44,Ht=94,Q=84,Ut=40,Wt=130,Gt=218,Kt=214/2,qt=38,Jt=24,Yt=17,Xt=26,Zt=15,Qt=302,$t=1150,en=0,tn=`
/* 只有这块 SVG 的样式是 LC 21 专属的；容器 / 说明 / 控制条在外壳里
   （widgetChrome.js 的 .viz*），两个动画共用。 */
.mtl {
  --mtl-a: var(--accent, #3f6b57);
  --mtl-b: var(--accent-secondary, #a45f45);
  --mtl-edge: var(--text-secondary, #657168);
  --mtl-gold: #c89a46;
}
html.theme-dark .mtl {
  --mtl-gold: #d9b063;
}
.mtl__svg { min-width: 520px; }
.mtl-row-label {
  fill: var(--text-secondary, #657168);
  font-size: 14px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
}
.mtl-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.26s ease, fill 0.26s ease, stroke-width 0.26s ease;
}
.mtl-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 17px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  transition: opacity 0.26s ease;
}
/* compare：两个候选节点虚线高亮，赢的一边实线加粗 */
.mtl-node--a.is-cand .mtl-node__box { stroke: var(--mtl-a); stroke-dasharray: 5 3; stroke-width: 2; }
.mtl-node--b.is-cand .mtl-node__box { stroke: var(--mtl-b); stroke-dasharray: 5 3; stroke-width: 2; }
.mtl-node.is-win .mtl-node__box { stroke-width: 3; stroke-dasharray: none; }
/* take：节点被摘走 —— 按来源染色变淡 */
.mtl-node--a.is-taken .mtl-node__box { fill: rgba(63, 107, 87, 0.16); stroke: var(--mtl-a); }
.mtl-node--b.is-taken .mtl-node__box { fill: rgba(164, 95, 69, 0.16); stroke: var(--mtl-b); }
.mtl-node.is-taken .mtl-node__value { opacity: 0.55; }
/* append-rest：剩余段在源行里整体高亮（虚线绿 = 即将并入结果） */
.mtl-node.is-rest .mtl-node__box { stroke: var(--mtl-a); stroke-width: 2.5; stroke-dasharray: 6 3; }
.mtl-edge__line {
  stroke: var(--mtl-edge);
  stroke-width: 1.8;
  stroke-linecap: round;
}
.mtl-edge__head { fill: var(--mtl-edge); }
/* 结果行的箭头跟着节点出现 */
.mtl-redge { opacity: 0; transition: opacity 0.3s ease; }
.mtl-redge.is-on { opacity: 1; }
/* 哑结点：虚线框，明确它不是答案的一部分 */
.mtl-dummy__box {
  fill: none;
  stroke: var(--mtl-edge, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
}
.mtl-dummy__text {
  fill: var(--mtl-edge, #657168);
  font-size: 11px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 结果槽：出现前隐藏并下沉 10px，出现时上浮淡入 */
.mtl-rslot {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.mtl-rslot.is-filled { opacity: 1; transform: translateY(0); }
.mtl-rslot--from-a .mtl-node__box { fill: rgba(63, 107, 87, 0.16); stroke: var(--mtl-a); }
.mtl-rslot--from-b .mtl-node__box { fill: rgba(164, 95, 69, 0.16); stroke: var(--mtl-b); }
/* vs 徽章：位置也带过渡，从上一组候选滑到下一组 */
.mtl-vs {
  opacity: 0;
  transition: opacity 0.25s ease, transform 0.3s ease;
}
.mtl-vs.is-on { opacity: 1; }
.mtl-vs__ring { fill: var(--surface, #fff); stroke: var(--mtl-b); stroke-width: 1.5; }
.mtl-vs__text {
  fill: var(--mtl-b);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mtl-chip { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.mtl-chip__box { rx: 12; ry: 12; }
.mtl-chip__text {
  font-size: 11.5px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mtl-chip--p1 .mtl-chip__box { fill: var(--mtl-a); }
.mtl-chip--p1 .mtl-chip__text { fill: #fff; }
.mtl-chip--p2 .mtl-chip__box { fill: var(--mtl-b); }
.mtl-chip--p2 .mtl-chip__text { fill: #fff; }
.mtl-chip--tail .mtl-chip__box { fill: var(--mtl-gold); }
.mtl-chip--tail .mtl-chip__text { fill: #2a2113; }
@media (prefers-reduced-motion: reduce) {
  .mtl-chip, .mtl-vs, .mtl-rslot, .mtl-redge, .mtl-node__box, .mtl-node__value { transition: none; }
  .mtl-rslot { transform: none; }
}
`;function nn(){if(ht(),document.getElementById(zt))return;let e=document.createElement(`style`);e.id=zt,e.textContent=tn,document.head.appendChild(e)}function rn(e,t={}){if(!e||e.dataset.mtlMounted===`1`)return{destroy(){}};e.dataset.mtlMounted=`1`,nn(),en+=1;let n=Array.isArray(t.listA)&&t.listA.length?t.listA:[1,2,4],r=Array.isArray(t.listB)&&t.listB.length?t.listB:[1,3,4],i=t.autoplay!==!1,a=Rt(n,r),o=a[a.length-1].taken,s=e=>e.list===`a`?n[e.i]:r[e.i],c=1+o.length,l=e=>Q+e*Ht,u=e=>l(e)+Bt/2,d=e=>e<=0?Q:Q+(e-1)*Ht+Bt,f=e=>e<=0?Q:d(e)+Xt,p=Math.max(d(n.length),d(r.length),d(c))+Xt+Zt+12,m=document.createElement(`div`);m.className=`viz mtl`;let h=document.createElement(`div`);h.className=`viz__stage`,m.appendChild(h);let g=J(`svg`,{class:`viz__svg mtl__svg`,viewBox:`0 0 ${p} ${Qt}`,role:`img`,"aria-label":`合并两个有序链表推演动画：${n.join(`、`)} 与 ${r.join(`、`)}`});h.appendChild(g);for(let[e,t]of[[`A`,62],[`B`,152],[`结果`,240]]){let n=J(`text`,{class:`mtl-row-label`,x:30,y:t});n.textContent=e,g.appendChild(n)}function _(e,t){g.appendChild(J(`circle`,{class:`mtl-dummy__box`,cx:e,cy:t,r:Zt}));let n=J(`text`,{class:`mtl-dummy__text`,x:e,y:t});n.textContent=`∅`,g.appendChild(n)}function v(e,t,n,r){let i=J(`g`,{class:r});return i.appendChild(J(`line`,{class:`mtl-edge__line`,x1:e,y1:n,x2:t-9,y2:n})),i.appendChild(J(`path`,{class:`mtl-edge__head`,d:`M ${t} ${n} L ${t-9} ${n-5.5} L ${t-9} ${n+5.5} Z`})),g.appendChild(i),i}function y(e,t){let n=t+Vt/2;for(let t=0;t<e-1;t+=1)v(l(t)+Bt,l(t+1),n,`mtl-edge`);_(f(e),n),e>0&&v(d(e),f(e)-Zt,n,`mtl-edge`)}y(n.length,Ut),y(r.length,Wt);let b=[];for(let e=1;e<c;e+=1)b.push(v(l(e-1)+Bt,l(e),240,`mtl-edge mtl-redge`));_(f(c),240);let x=v(d(c),f(c)-Zt,240,`mtl-edge mtl-redge`);function S(e,t,n,r){let i=J(`g`,{class:`mtl-node ${r}`});i.appendChild(J(`rect`,{class:`mtl-node__box`,x:l(t),y:n,width:Bt,height:Vt,rx:9}));let a=J(`text`,{class:`mtl-node__value`,x:u(t),y:n+Vt/2});return a.textContent=String(e),i.appendChild(a),g.appendChild(i),i}let C=n.map((e,t)=>S(e,t,Ut,`mtl-node--a`)),w=r.map((e,t)=>S(e,t,Wt,`mtl-node--b`)),T=J(`g`,{class:`mtl-dummy`});T.appendChild(J(`rect`,{class:`mtl-dummy__box`,x:l(0),y:Gt,width:Bt,height:Vt,rx:9}));let E=J(`text`,{class:`mtl-dummy__text`,x:u(0),y:240});E.textContent=`dummy`,T.appendChild(E),g.appendChild(T);let D=o.map((e,t)=>S(s(e),t+1,Gt,`mtl-rslot mtl-rslot--from-${e.list}`)),O=J(`g`,{class:`mtl-vs`});O.appendChild(J(`circle`,{class:`mtl-vs__ring`,cx:0,cy:0,r:13}));let k=J(`text`,{class:`mtl-vs__text`,x:0,y:0});k.textContent=`vs`,O.appendChild(k),g.appendChild(O);function A(e,t){let n=J(`g`,{class:`mtl-chip mtl-chip--${e}`});n.appendChild(J(`rect`,{class:`mtl-chip__box`,x:-38/2,y:-24/2,width:qt,height:Jt}));let r=J(`text`,{class:`mtl-chip__text`,x:0,y:0});return r.textContent=t,n.appendChild(r),g.appendChild(n),n}let ee=A(`p1`,`p1`),te=A(`p2`,`p2`),ne=A(`tail`,`tail`),j=document.createElement(`p`);j.className=`viz__desc`,j.setAttribute(`aria-live`,`polite`),m.appendChild(j);let re=_t();m.appendChild(re.root),e.textContent=``,e.appendChild(m);let M=null;function ie(e,t,n){e.style.transform=`translate(${t}px, ${n}px)`}function N(e,t){let i=new Set(t.taken.map(e=>`${e.list}:${e.i}`));C.forEach((e,n)=>{e.classList.toggle(`is-taken`,i.has(`a:${n}`)),e.classList.toggle(`is-cand`,t.phase===`compare`&&t.p1===n),e.classList.toggle(`is-win`,t.phase===`compare`&&t.cursor===`a`&&t.p1===n),e.classList.toggle(`is-rest`,t.phase===`append-rest`&&t.rest?.list===`a`&&n>=t.rest.from)}),w.forEach((e,n)=>{e.classList.toggle(`is-taken`,i.has(`b:${n}`)),e.classList.toggle(`is-cand`,t.phase===`compare`&&t.p2===n),e.classList.toggle(`is-win`,t.phase===`compare`&&t.cursor===`b`&&t.p2===n),e.classList.toggle(`is-rest`,t.phase===`append-rest`&&t.rest?.list===`b`&&n>=t.rest.from)});let a=t.rest?(t.rest.list===`a`?n.length:r.length)-t.rest.from:0,o=t.phase===`take`?t.taken.length:t.phase===`append-rest`?t.taken.length-a+1:1/0;D.forEach((e,n)=>{let r=n+1,i=r<=t.taken.length;e.classList.toggle(`is-filled`,i),e.classList.toggle(`is-new`,i&&r>=o)}),b.forEach((e,n)=>e.classList.toggle(`is-on`,n+1<=t.taken.length)),x.classList.toggle(`is-on`,t.done);let s=t.phase===`compare`;if(O.classList.toggle(`is-on`,s),s){let e=(u(t.p1)+u(t.p2))/2;O.style.transform=`translate(${e}px, ${Kt}px)`}ie(ee,t.p1===null?f(n.length):u(t.p1),Ut-Yt),ie(te,t.p2===null?f(r.length):u(t.p2),Wt-Yt),ie(ne,u(Math.min(t.taken.length,c-1)),279),Y(j,t.desc)}let P=vt({steps:a,controls:re,intervalMs:$t,onRender:N});P.jumpTo(Math.trunc(t.initialStep)||0);let ae=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return i&&!ae&&typeof IntersectionObserver==`function`&&(M=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){M.disconnect(),M=null,P.play();return}},{threshold:.35}),M.observe(m)),{destroy(){M&&=(M.disconnect(),null),P.destroy(),e.textContent=``,delete e.dataset.mtlMounted,--en,en<=0&&(document.getElementById(zt)?.remove(),gt())}}}var an=e=>String.fromCharCode(65+e);function on(e){let t=(Array.isArray(e)?e:[]).map(e=>Array.isArray(e)?e.slice():[]),n=t.length,r=[],i=t.map(e=>e.length?0:null),a=[],o=[],s=(e,n)=>{let r=t[e.list][e.i],i=t[n.list][n.i];return r===i?e.list<n.list:r<i},c=e=>t[e.list][e.i],l=(e,t,n={})=>r.push({phase:e,desc:t,heap:o.map(e=>({...e})),cursors:i.slice(),taken:a.map(e=>({...e})),popped:null,pushed:null,moved:[],done:!1,...n});function u(e){let t=[];for(;e>0;){let n=e-1>>1;if(!s(o[e],o[n]))break;[o[e],o[n]]=[o[n],o[e]],t.push(e,n),e=n}return t}function d(e){let t=[];for(;;){let n=2*e+1,r=2*e+2,i=e;if(n<o.length&&s(o[n],o[i])&&(i=n),r<o.length&&s(o[r],o[i])&&(i=r),i===e)break;[o[e],o[i]]=[o[i],o[e]],t.push(e,i),e=i}return t}let f=[];for(let e=0;e<n;e+=1)i[e]!==null&&(o.push({list:e,i:0}),f=f.concat(u(o.length-1)));let p=t.filter(e=>e.length).length,m=t.reduce((e,t)=>e+t.length,0);if(o.length===0)return l(`init`,n===0?"`lists` 是个空数组，一条链表都没有，直接返回 ∅。":`${n} 条链表全是空的 —— 堆建起来是空的，直接返回 ∅。`,{moved:[],done:!0}),r;for(l(`init`,`把 ${p} 条链表的**头节点**放进小顶堆：${o.map(e=>`${an(e.list)} 的 ${c(e)}`).join(`、`)}。注意**只放头部**，每条链表后面那些节点还在原地等 —— 堆里现在只有 ${o.length} 个元素，不是 ${m} 个。这是 O(N log K) 里那个 K 的来源。`,{moved:f});o.length;){let e=o[0],n=[],r=o.pop();o.length&&(o[0]=r,n.push(...d(0))),a.push({list:e.list,i:e.i});let s=e.list;i[s]=i[s]+1<t[s].length?i[s]+1:null;let f=null;i[s]!==null&&(f={list:s,i:i[s]},o.push(f),n.push(...u(o.length-1)));let p=f?`${an(s)} 前移一格，新头 ${c(f)} 入堆，堆里还是 ${o.length} 个元素。`:`${an(s)} 已经走完了，不再补位 —— 堆里只剩 ${o.length} 个元素。`;l(`take`,`堆顶是 ${c(e)}（来自 ${an(s)}）。出堆 → 接到结果尾部 → ${p}`,{popped:{...e},pushed:f?{...f}:null,moved:n})}let h=a.map(e=>c(e)).join(` → `);return l(`done`,`堆空了，说明每个节点都被取走且只被取走了一次 —— 一共 ${a.length} 轮，每轮最多两次堆操作（出堆 + 入堆），每次 O(log K)，所以是 O(N log K)。结果链表是 ${h}；开头那个哑结点只是锚点，返回 \`dummy.next\`。`,{done:!0}),r}var sn=`mkl-styles`,cn=52,ln=40,un=74,$=58,dn=15,fn=26,pn=40,mn=22,hn=16,gn=66,_n=34,vn=36,yn=40,bn=28,xn=168,Sn=12,Cn=46,wn=22,Tn=56,En=180,Dn=1250,On=0,kn=[`l0`,`l1`,`l2`,`l3`,`l4`,`l5`],An=e=>`mkl-${kn[e%kn.length]}`,jn=`
/* 只有这块 SVG 的样式是 LC 23 专属的；容器 / 说明 / 控制条在外壳里
   （widgetChrome.js 的 .viz*），三个动画共用。 */
.mkl {
  --mkl-l0: #3f6b57;
  --mkl-l1: #a45f45;
  --mkl-l2: #3f5f8a;
  --mkl-l3: #7a5a9c;
  --mkl-l4: #8a6a2f;
  --mkl-l5: #2f7078;
  --mkl-edge: var(--text-secondary, #657168);
  --mkl-gold: #c89a46;
}
html.theme-dark .mkl {
  --mkl-l0: #8fb29c;
  --mkl-l1: #d18a6f;
  --mkl-l2: #8ab0d8;
  --mkl-l3: #b79ad6;
  --mkl-l4: #d9b063;
  --mkl-l5: #7fc3c8;
  --mkl-gold: #d9b063;
}
.mkl__svg { min-width: 560px; }

/* 每条链表一个色系：--c 是主色，--c-bg 是它的浅色底 */
.mkl-l0 { --c: var(--mkl-l0); --c-bg: rgba(63, 107, 87, 0.16); }
.mkl-l1 { --c: var(--mkl-l1); --c-bg: rgba(164, 95, 69, 0.16); }
.mkl-l2 { --c: var(--mkl-l2); --c-bg: rgba(63, 95, 138, 0.16); }
.mkl-l3 { --c: var(--mkl-l3); --c-bg: rgba(122, 90, 156, 0.16); }
.mkl-l4 { --c: var(--mkl-l4); --c-bg: rgba(138, 106, 47, 0.16); }
.mkl-l5 { --c: var(--mkl-l5); --c-bg: rgba(47, 112, 120, 0.16); }

.mkl-row-label {
  fill: var(--mkl-edge);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  transition: fill 0.26s ease, opacity 0.26s ease;
}
.mkl-row-label.is-live { fill: var(--c); }
.mkl-row-label.is-dead { opacity: 0.42; }

.mkl-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.26s ease, fill 0.26s ease, stroke-width 0.26s ease,
    opacity 0.26s ease;
}
.mkl-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  transition: opacity 0.26s ease;
}
/* 源链表：已取走的节点压暗；当前头部用本链表主色实线标出 */
.mkl-src.is-taken .mkl-node__box { opacity: 0.3; }
.mkl-src.is-taken .mkl-node__value { opacity: 0.4; }
.mkl-src.is-head .mkl-node__box {
  stroke: var(--c);
  stroke-width: 2.6;
  fill: var(--c-bg);
}

.mkl-edge__line { stroke: var(--mkl-edge); stroke-width: 1.8; stroke-linecap: round; }
.mkl-edge__head { fill: var(--mkl-edge); }
.mkl-redge { opacity: 0; transition: opacity 0.3s ease; }
.mkl-redge.is-on { opacity: 1; }

/* 行尾 ∅ */
.mkl-null__ring {
  fill: none;
  stroke: var(--mkl-edge);
  stroke-width: 1.4;
  stroke-dasharray: 4 3;
  transition: stroke 0.26s ease, opacity 0.26s ease;
}
.mkl-null__text {
  fill: var(--mkl-edge);
  font-size: 11px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  transition: fill 0.26s ease, opacity 0.26s ease;
}
/* 整条链表走完：行尾 ∅ 亮成本链表主色（加粗一点，细虚线在缩略尺寸下会糊成灰） */
.mkl-src.is-dead .mkl-null__ring { stroke: var(--c); stroke-width: 2.2; opacity: 1; }
.mkl-src.is-dead .mkl-null__text { fill: var(--c); opacity: 1; }
.mkl-src.is-dead .mkl-edge__line,
.mkl-src.is-dead .mkl-edge__head { opacity: 0.45; }

/* 哑结点：虚线框，明确它不是答案的一部分 */
.mkl-dummy__box {
  fill: none;
  stroke: var(--mkl-edge);
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
}
.mkl-dummy__text {
  fill: var(--mkl-edge);
  font-size: 10px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 堆 ───────────────────────────────────────────────────────────────── */
.mkl-heap__caption {
  fill: var(--text-secondary, #657168);
  font-size: 12px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
}
.mkl-hslot { transition: opacity 0.3s ease; }
.mkl-hslot.is-off { opacity: 0; }
.mkl-hnode__box {
  fill: var(--c-bg, rgba(101, 113, 104, 0.16));
  stroke: var(--c, #657168);
  stroke-width: 1.8;
  transition: stroke 0.26s ease, fill 0.26s ease, stroke-width 0.26s ease;
}
.mkl-hnode__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 本步动过的槽：加粗 + 着色，让「槽里换了个人」看得见 */
.mkl-hslot.is-moved .mkl-hnode__box { stroke-width: 3.6; }
.mkl-hslot.is-moved .mkl-hnode__value { fill: var(--c, #1f2a24); }
/* 堆顶：金边 + 一个「堆顶」小标 */
.mkl-hslot.is-root .mkl-hnode__box { stroke: var(--mkl-gold); stroke-width: 2.8; }
.mkl-heap__root-tag {
  fill: var(--mkl-gold);
  font-size: 10.5px;
  font-weight: 700;
  dominant-baseline: central;
  transition: opacity 0.3s ease;
}
.mkl-heap__root-tag.is-off { opacity: 0; }
.mkl-hedge__line { stroke: var(--mkl-edge); stroke-width: 1.5; stroke-linecap: round; }

/* 结果槽：出现前隐藏并下沉 10px，出现时上浮淡入 */
.mkl-rslot {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.mkl-rslot.is-filled { opacity: 1; transform: translateY(0); }
.mkl-rslot .mkl-node__box { fill: var(--c-bg); stroke: var(--c); }
.mkl-rslot.is-new .mkl-node__box { stroke-width: 2.8; }

.mkl-chip { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.mkl-chip__box { rx: 11; ry: 11; }
.mkl-chip__text {
  font-size: 11px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mkl-chip--tail .mkl-chip__box { fill: var(--mkl-gold); }
.mkl-chip--tail .mkl-chip__text { fill: #2a2113; }

@media (prefers-reduced-motion: reduce) {
  .mkl-chip, .mkl-rslot, .mkl-redge, .mkl-node__box, .mkl-node__value,
  .mkl-hnode__box, .mkl-hslot, .mkl-heap__root-tag, .mkl-null__ring, .mkl-row-label {
    transition: none;
  }
  .mkl-rslot { transform: none; }
}
`;function Mn(){if(ht(),document.getElementById(sn))return;let e=document.createElement(`style`);e.id=sn,e.textContent=jn,document.head.appendChild(e)}function Nn(e){let t=Math.floor(Math.log2(e+1));return{x:(e-(2**t-1)+.5)/2**t*xn,y:t*Cn}}function Pn(e,t={}){if(!e||e.dataset.mklMounted===`1`)return{destroy(){}};e.dataset.mklMounted=`1`,Mn(),On+=1;let n=Array.isArray(t.lists)&&t.lists.length?t.lists:[[1,4],[2,5],[3,6],[0,7]],r=t.autoplay!==!1,i=on(n),a=n.length,o=Math.max(1,a),s=n.reduce((e,t)=>Math.max(e,t.length),0),c=1+n.reduce((e,t)=>e+t.length,0),l=e=>$+e*un,u=e=>l(e)+cn/2,d=e=>e<=0?$:$+(e-1)*un+cn,f=e=>d(e)+fn,p=o*gn-(gn-ln),m=wn+(Math.floor(Math.log2(o))*Cn+bn),h=Math.max(p,m),g=_n+h+vn,_=g+ln+hn+20,v=f(s)+dn,y=v+Tn+En,b=f(c)+dn+12,x=Math.max(y+36,b),S=Math.round((x-y)/2),C=S+v+Tn,w=e=>C+Sn+Nn(e).x,T=e=>_n+Math.max(0,Math.round((h-m)/2))+wn+Nn(e).y,E=document.createElement(`div`);E.className=`viz mkl`;let D=document.createElement(`div`);D.className=`viz__stage`,E.appendChild(D);let O=J(`svg`,{class:`viz__svg mkl__svg`,viewBox:`0 0 ${x} ${_}`,role:`img`,"aria-label":`合并 ${a} 个升序链表的小顶堆推演动画`});D.appendChild(O);function k(e,t,n,r,i){let a=J(`g`,{class:i});return a.appendChild(J(`line`,{class:`mkl-edge__line`,x1:t,y1:r,x2:n-9,y2:r})),a.appendChild(J(`path`,{class:`mkl-edge__head`,d:`M ${n} ${r} L ${n-9} ${r-5.5} L ${n-9} ${r+5.5} Z`})),e.appendChild(a),a}function A(e,t,n){e.appendChild(J(`circle`,{class:`mkl-null__ring`,cx:t,cy:n,r:dn}));let r=J(`text`,{class:`mkl-null__text`,x:t,y:n});r.textContent=`∅`,e.appendChild(r)}function ee(e,t,n,r,i){let a=J(`g`,{class:`mkl-node ${i}`});a.appendChild(J(`rect`,{class:`mkl-node__box`,x:n,y:r,width:cn,height:ln,rx:8}));let o=J(`text`,{class:`mkl-node__value`,x:n+cn/2,y:r+ln/2});return o.textContent=String(t),a.appendChild(o),e.appendChild(a),a}let te=n.map((e,t)=>{let n=_n+t*gn,r=n+ln/2,i=J(`g`,{class:`mkl-src ${An(t)}`}),a=J(`text`,{class:`mkl-row-label`,x:S+$/2-6,y:r});a.textContent=String.fromCharCode(65+t),i.appendChild(a);let o=e.map((e,t)=>ee(i,e,S+$+t*un,n,``));for(let t=0;t<e.length-1;t+=1)k(i,S+$+t*un+cn,S+$+(t+1)*un,r,``);return e.length>0&&k(i,S+d(e.length),S+f(e.length)-dn,r,``),A(i,S+f(e.length),r),O.appendChild(i),{g:i,labelEl:a,nodes:o,values:e}}),ne=J(`g`,{class:`mkl-heap`});O.appendChild(ne);let j=J(`text`,{class:`mkl-heap__caption`,x:C+Sn+xn/2,y:_n+Math.max(0,Math.round((h-m)/2))+wn/2});ne.appendChild(j);let re=[];for(let e=1;e<o;e+=1){let t=e-1>>1,n=J(`g`,{class:`mkl-hedge`});n.appendChild(J(`line`,{class:`mkl-hedge__line`,x1:w(t),y1:T(t)+bn,x2:w(e),y2:T(e)})),ne.appendChild(n),re.push({g:n,child:e})}let M=[];for(let e=0;e<o;e+=1){let t=J(`g`,{class:`mkl-hslot is-off`});t.appendChild(J(`rect`,{class:`mkl-hnode__box`,x:w(e)-yn/2,y:T(e),width:yn,height:bn,rx:7}));let n=J(`text`,{class:`mkl-hnode__value`,x:w(e),y:T(e)+bn/2});t.appendChild(n),ne.appendChild(t),M.push({g:t,textEl:n})}let ie=J(`text`,{class:`mkl-heap__root-tag`,x:w(0)+yn/2+24,y:T(0)+bn/2});ie.textContent=`堆顶`,ne.appendChild(ie);let N=J(`g`,{class:`mkl-result`});O.appendChild(N);let P=g+ln/2,ae=J(`text`,{class:`mkl-row-label`,x:26,y:P});ae.textContent=`结果`,N.appendChild(ae);let oe=J(`g`,{class:`mkl-dummy`});oe.appendChild(J(`rect`,{class:`mkl-dummy__box`,x:l(0),y:g,width:cn,height:ln,rx:8}));let se=J(`text`,{class:`mkl-dummy__text`,x:u(0),y:P});se.textContent=`dummy`,oe.appendChild(se),N.appendChild(oe);let ce=[];for(let e=1;e<c;e+=1)ce.push(k(N,l(e-1)+cn,l(e),P,`mkl-redge`));A(N,f(c),P);let F=k(N,d(c),f(c)-dn,P,`mkl-redge`),I=i[i.length-1].taken.map((e,t)=>ee(N,n[e.list][e.i],l(t+1),g,`mkl-rslot ${An(e.list)}`)),L=J(`g`,{class:`mkl-chip mkl-chip--tail`});L.appendChild(J(`rect`,{class:`mkl-chip__box`,x:-40/2,y:-22/2,width:pn,height:mn}));let le=J(`text`,{class:`mkl-chip__text`,x:0,y:0});le.textContent=`tail`,L.appendChild(le),N.appendChild(L);let ue=document.createElement(`p`);ue.className=`viz__desc`,ue.setAttribute(`aria-live`,`polite`),E.appendChild(ue);let de=_t();E.appendChild(de.root),e.textContent=``,e.appendChild(E);let R=null;function fe(e,t){let r=t.heap.length,i=new Set(t.moved);te.forEach((e,n)=>{let r=t.cursors[n];e.g.classList.toggle(`is-dead`,r===null),e.labelEl.classList.toggle(`is-live`,r!==null),e.labelEl.classList.toggle(`is-dead`,r===null),e.nodes.forEach((e,t)=>{e.classList.toggle(`is-taken`,r===null||t<r),e.classList.toggle(`is-head`,r===t)})}),M.forEach((e,a)=>{if(a>=r){e.g.setAttribute(`class`,`mkl-hslot is-off`);return}let o=t.heap[a];e.textEl.textContent=String(n[o.list][o.i]),e.g.setAttribute(`class`,`mkl-hslot ${An(o.list)}${i.has(a)?` is-moved`:``}`+(a===0?` is-root`:``))}),re.forEach(e=>{e.g.style.display=e.child<r?``:`none`}),j.textContent=r===0?`堆：空了 —— 全部节点已取出`:`堆：只有 ${r} 个候选（每条链表当前的头部）`,ie.classList.toggle(`is-off`,r===0);let a=t.phase===`take`?t.taken.length:1/0;I.forEach((e,n)=>{let r=n+1,i=r<=t.taken.length;e.classList.toggle(`is-filled`,i),e.classList.toggle(`is-new`,i&&r>=a)}),ce.forEach((e,n)=>e.classList.toggle(`is-on`,n+1<=t.taken.length)),F.classList.toggle(`is-on`,t.done);let o=Math.min(t.taken.length,c-1);L.style.transform=`translate(${u(o)}px, ${g+ln+hn}px)`,Y(ue,t.desc)}let pe=vt({steps:i,controls:de,intervalMs:Dn,onRender:fe});pe.jumpTo(Math.trunc(t.initialStep)||0);let me=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!me&&typeof IntersectionObserver==`function`&&(R=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){R.disconnect(),R=null,pe.play();return}},{threshold:.35}),R.observe(E)),{destroy(){R&&=(R.disconnect(),null),pe.destroy(),e.textContent=``,delete e.dataset.mklMounted,--On,On<=0&&(document.getElementById(sn)?.remove(),gt())}}}function Fn(e,t){let n=[],r=0,i=0;for(;r<e.length&&i<t.length;)e[r]<=t[i]?(n.push(e[r]),r+=1):(n.push(t[i]),i+=1);for(;r<e.length;)n.push(e[r++]);for(;i<t.length;)n.push(t[i++]);return n}var In=e=>e.length?e.join(`、`):`∅`;function Ln(e){let t=(Array.isArray(e)?e:[]).map(e=>Array.isArray(e)?e.slice():[]),n=t.length,r=[],i=t.reduce((e,t)=>e+t.length,0),a=e=>e.map(e=>({lists:e.lists.map(e=>e.slice()),from:e.from?e.from.map(e=>[e[0],e[1]]):null}));if(n===0)return r.push({phase:`init`,desc:"`lists` 是个空数组，一条链表都没有，直接返回 ∅。",levels:[],activeLevel:-1,rounds:0,done:!0}),r;let o=[{lists:t.map(e=>e.slice()),from:null}];if(n===1)return r.push({phase:`init`,desc:`只有 1 条链表，**一次合并都不用做** —— 分治的轮数是 ⌈log₂1⌉ = 0，直接返回它自己（${In(t[0])}）。`,levels:a(o),activeLevel:0,rounds:0,done:!0}),r;r.push({phase:`init`,desc:`分治的起手：${n} 条链表一字排开，一共 ${i} 个节点。接下来每一轮**两两配对合并**，链表条数每次减半 —— ${n} → ${Math.ceil(n/2)} → … → 1，一共 ⌈log₂${n}⌉ = ${Math.ceil(Math.log2(n))} 轮。`,levels:a(o),activeLevel:0,rounds:0,done:!1});let s=t,c=0;for(;s.length>1;){let e=[],t=[];for(let n=0;n<s.length;n+=2)n+1<s.length?(e.push(Fn(s[n],s[n+1])),t.push([n,n+1])):(e.push(s[n].slice()),t.push([n,-1]));c+=1,o.push({lists:e,from:t});let n=s.length,i=e.length,l=t.reduce((e,[t,n])=>e+(n>=0?s[t].length+s[n].length:0),0),u=t.filter(e=>e[1]>=0).length,d=t.find(e=>e[1]<0);r.push({phase:`merge`,desc:`第 ${c} 轮：把 ${n} 条两两配对，做 ${u} 次「合并两个有序链表」，得到 ${i} 条。本轮被摸到的节点一共 ${l} 个，不超过 N —— 每轮都是 O(N) 的工作量。`+(d?`注意第 ${d[0]+1} 条这轮**轮空**了，原样进下一轮（不是丢掉）。`:`链表条数 ${n} → ${i}。`),levels:a(o),activeLevel:o.length-1,rounds:c,done:!1}),s=e}return r.push({phase:`done`,desc:`一共 ${c} 轮，每轮 O(N)，所以总时间是 **O(N log K)** —— 和最小堆同阶。结果链表是 ${In(s[0])}。分治的隐藏优势：它不需要堆，每一轮都是纯粹的指针比较，常数更小。`,levels:a(o),activeLevel:o.length-1,rounds:c,done:!0}),r}var Rn=`mkc-styles`,zn=44,Bn=36,Vn=18,Hn=38,Un=68,Wn=76,Gn=34,Kn=54,qn=30,Jn=1400,Yn=0,Xn=`
.mkc {
  --mkc-lv1: #3f6b57;
  --mkc-lv2: #a45f45;
  --mkc-lv3: #3f5f8a;
  --mkc-lv4: #7a5a9c;
  --mkc-edge: var(--text-secondary, #657168);
  --mkc-accent: var(--accent, #3f6b57);
}
html.theme-dark .mkc {
  --mkc-lv1: #8fb29c;
  --mkc-lv2: #d18a6f;
  --mkc-lv3: #8ab0d8;
  --mkc-lv4: #b79ad6;
}
.mkc__svg { min-width: 560px; }

/* 每一层一个色系：输入层是中性灰，之后逐轮换色，方便对着连线读 */
.mkc-lv0 { --c: var(--mkc-edge); --c-bg: transparent; }
.mkc-lv1 { --c: var(--mkc-lv1); --c-bg: rgba(63, 107, 87, 0.16); }
.mkc-lv2 { --c: var(--mkc-lv2); --c-bg: rgba(164, 95, 69, 0.16); }
.mkc-lv3 { --c: var(--mkc-lv3); --c-bg: rgba(63, 95, 138, 0.16); }
.mkc-lv4 { --c: var(--mkc-lv4); --c-bg: rgba(122, 90, 156, 0.16); }

.mkc-row-label {
  fill: var(--c, var(--mkc-edge));
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
}
.mkc-row-count {
  fill: var(--mkc-edge);
  font-size: 11.5px;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mkc-row.is-hidden { opacity: 0; }
.mkc-row { transition: opacity 0.32s ease; }
/* 本步刚出现的那一层：右侧「N 条」跟着层色亮起来 */
.mkc-row.is-active .mkc-row-count { fill: var(--c); font-weight: 700; }

.mkc-node__box {
  fill: var(--surface, #fff);
  stroke: var(--c, var(--glass-border, #dce2da));
  stroke-width: 1.6;
  transition: stroke 0.26s ease, fill 0.26s ease, stroke-width 0.26s ease;
}
.mkc-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 14px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mkc-lv0 .mkc-node__box { fill: var(--surface, #fff); }
.mkc-node { transition: opacity 0.3s ease; }
/* 刚合并出来的那一层：整层做一次入场（下沉淡入） */
.mkc-node.is-new {
  opacity: 0;
  animation: mkc-pop 0.36s ease forwards;
}
@keyframes mkc-pop {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 配对连线 */
.mkc-link__line {
  stroke: var(--mkc-edge);
  stroke-width: 1.4;
  fill: none;
  opacity: 0.35;
  transition: opacity 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease;
}
.mkc-link.is-on .mkc-link__line {
  stroke: var(--mkc-accent);
  stroke-width: 2;
  opacity: 0.85;
}
.mkc-link { transition: opacity 0.3s ease; }
.mkc-link.is-hidden { opacity: 0; }

.mkc-null__ring {
  fill: none;
  stroke: var(--mkc-edge);
  stroke-width: 1.3;
  stroke-dasharray: 4 3;
}
.mkc-null__text {
  fill: var(--mkc-edge);
  font-size: 10px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

@media (prefers-reduced-motion: reduce) {
  .mkc-node.is-new { animation: none; opacity: 1; }
  .mkc-row, .mkc-link, .mkc-link__line, .mkc-node__box { transition: none; }
}
`;function Zn(){if(ht(),document.getElementById(Rn))return;let e=document.createElement(`style`);e.id=Rn,e.textContent=Xn,document.head.appendChild(e)}var Qn=e=>`mkc-lv${Math.min(e,4)}`;function $n(e,t={}){if(!e||e.dataset.mkcMounted===`1`)return{destroy(){}};e.dataset.mkcMounted=`1`,Zn(),Yn+=1;let n=Array.isArray(t.lists)&&t.lists.length?t.lists:[[7],[2],[5],[1],[8],[3],[6],[4]],r=t.autoplay!==!1,i=Ln(n),a=i[i.length-1].levels,o=a.map(e=>{let t=[],n=Un;for(let r of e.lists){let e=r.length?r.length*zn+(r.length-1)*Vn:qn;t.push({x:n,w:e,values:r}),n+=e+Hn}return{items:t,width:t.length?n-Hn:Un,top:Gn}});o.forEach((e,t)=>{e.top=Gn+t*Wn});let s=o.reduce((e,t)=>Math.max(e,t.width),Un)+Kn,c=Gn+(o.length-1)*Wn+Bn+26,l=(e,t)=>{let n=o[e].items[t];return n?n.x+n.w/2:Un},u=document.createElement(`div`);u.className=`viz mkc`;let d=document.createElement(`div`);d.className=`viz__stage`,u.appendChild(d);let f=J(`svg`,{class:`viz__svg mkc__svg`,viewBox:`0 0 ${s} ${c}`,role:`img`,"aria-label":`合并 ${n.length} 个升序链表的分治推演动画`});d.appendChild(f);let p=[];for(let e=1;e<o.length;e+=1)(a[e].from||[]).forEach((t,n)=>{let[r,i]=t,a=o[e-1].top+Bn,s=o[e].top,c=l(e,n),u=J(`g`,{class:`mkc-link ${Qn(e)}`});if(i<0)u.appendChild(J(`line`,{class:`mkc-link__line`,x1:l(e-1,r),y1:a,x2:c,y2:s}));else for(let t of[r,i]){let n=l(e-1,t);u.appendChild(J(`path`,{class:`mkc-link__line`,d:`M ${n} ${a} C ${n} ${a+22}, ${c} ${s-22}, ${c} ${s}`}))}f.appendChild(u),p.push({g:u,level:e})});let m=[];o.forEach((e,t)=>{let n=J(`g`,{class:`mkc-row ${Qn(t)}`}),r=e.top+Bn/2,i=J(`text`,{class:`mkc-row-label`,x:Un-16,y:r});i.textContent=t===0?`输入`:`第 ${t} 轮`,n.appendChild(i);let a=J(`text`,{class:`mkc-row-count`,x:e.width+14,y:r});a.textContent=`${e.items.length} 条`,n.appendChild(a);let o=[];e.items.forEach(t=>{if(!t.values.length){n.appendChild(J(`circle`,{class:`mkc-null__ring`,cx:t.x+qn/2,cy:r,r:11}));let e=J(`text`,{class:`mkc-null__text`,x:t.x+qn/2,y:r});e.textContent=`∅`,n.appendChild(e);return}t.values.forEach((i,a)=>{let s=t.x+a*62,c=J(`g`,{class:`mkc-node`});c.appendChild(J(`rect`,{class:`mkc-node__box`,x:s,y:e.top,width:zn,height:Bn,rx:7}));let l=J(`text`,{class:`mkc-node__value`,x:s+zn/2,y:r});l.textContent=String(i),c.appendChild(l),n.appendChild(c),o.push(c)})}),f.appendChild(n),m.push({g:n,nodes:o,countEl:a,level:t})});let h=document.createElement(`p`);h.className=`viz__desc`,h.setAttribute(`aria-live`,`polite`),u.appendChild(h);let g=_t();u.appendChild(g.root),e.textContent=``,e.appendChild(u);let _=null;function v(e,t){let n=t.levels.length;m.forEach(e=>{e.g.classList.toggle(`is-hidden`,e.level>=n),e.g.classList.toggle(`is-active`,e.level===t.activeLevel),e.nodes.forEach(n=>{n.classList.toggle(`is-new`,e.level===t.activeLevel&&t.phase!==`init`)}),e.level<n&&(e.countEl.textContent=`${t.levels[e.level].lists.length} 条`)}),p.forEach(e=>{e.g.classList.toggle(`is-hidden`,e.level>=n),e.g.classList.toggle(`is-on`,e.level===t.activeLevel)}),Y(h,t.desc)}let y=vt({steps:i,controls:g,intervalMs:Jn,onRender:v});y.jumpTo(Math.trunc(t.initialStep)||0);let b=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!b&&typeof IntersectionObserver==`function`&&(_=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){_.disconnect(),_=null,y.play();return}},{threshold:.35}),_.observe(u)),{destroy(){_&&=(_.disconnect(),null),y.destroy(),e.textContent=``,delete e.dataset.mkcMounted,--Yn,Yn<=0&&(document.getElementById(Rn)?.remove(),gt())}}}var er=[1,2,3,4,5,6,7,8,9,10,11,12,13],tr=4;function nr(e,t,n){return!Number.isInteger(e)||!Number.isInteger(t)||!Number.isInteger(n)||n<=0||e<t?null:(e-t)%n}function rr(e,t){let n=Math.abs(e),r=Math.abs(t);for(;r;)[n,r]=[r,n%r];return n}function ir(e={}){let t=Array.isArray(e.values)?e.values.slice():er.slice(),n=t.length,r=Number.isInteger(e.fastStep)&&e.fastStep>=1?e.fastStep:2,i=r-1,a=e.cycleStart===void 0?tr:e.cycleStart,o=Number.isInteger(a)&&a>=0&&a<n,s=o?a:null,c=o?n-s:0,l=o?{start:s,length:c}:null,u=[],d=(e,t,n={})=>u.push({phase:e,desc:t,slow:null,fast:null,gap:null,cycle:l?{...l}:null,fastStep:r,closing:i,steps:0,met:!1,done:!1,...n});if(n===0)return d(`end`,"链表是空的，连头节点都没有 —— 不存在环，返回 `false`。",{done:!0}),u;let f=e=>!Number.isInteger(e)||e>=n?null:e+1<n?e+1:o?s:null,p=e=>Number.isInteger(e)&&e>=0&&e<n?String(t[e]):`∅`,m=(e,t)=>{if(!o)return null;let n=nr(e,s,c),r=nr(t,s,c);return n===null||r===null?null:(n-r+c)%c},h=0,g=0,_=i<=0?`**两个指针速度一样，相对速度是 0** —— 它们会永远保持这个距离，不可能相遇。`:`快指针每步比慢指针多走 ${i} 格 —— 这个相对速度恒定不变，是后面一切的起点。`;if(d(`init`,`慢指针和快指针都站在头节点 ${p(0)}。快指针每步走 **${r} 格**、慢指针走 1 格，`+_,{slow:h,fast:g,steps:0}),i<=0)return d(`end`,`相对速度是 0，两指针永远同步前进，距离不会变 —— 不相遇。所以快指针**至少要走 2 步**，这是「一定相遇」的第一道门槛。`,{slow:h,fast:g,done:!0}),u;let v=2*n+8,y=`cap`;for(let e=1;e<=v;e+=1){let t=g;for(let e=0;e<r&&t!==null;e+=1)t=f(t);if(g=t,h=f(h),h===null&&g===null){y=`fell-off`;break}let n=m(h,g);if(h!==null&&h===g){let t=i===1?`相对速度是 1，所以「快指针沿环前进方向到慢指针的距离」每步**恰好减 1**；它是在模 ${c} 的意义下减 1 的，必然依次经过 ${c-1}、…、1、0 —— 所以**一定相遇**，慢指针进环后最多 ${c-1} 步。`:`相对速度是 ${i}，距离每步减 ${i}；它能减到 0，是因为慢指针进环那一刻的距离恰好是 gcd(${i}, ${c}) = ${rr(i,c)} 的倍数。`;return d(`met`,`两者在节点 ${p(h)} **相遇**。走了 ${e} 步，快指针比慢指针多走了 ${e*i} 格，正好是环长 ${c} 的整数倍 —— 这是相遇的代数原因。${t}`,{slow:h,fast:g,gap:n,steps:e,met:!0,done:!0}),u}if(g===null){y=`fell-off`;break}let a;a=n===null?o&&g>=s?`慢指针还在直段（第 ${h+1} 个节点），快指针已经进环了 —— 慢指针没进环之前，两者不可能相遇。`:`两者都还在直段，快指针只是领先慢指针 ${g-h} 格，距离还没有被环长约束住。`:`两者都在环上。快指针沿环前进方向到慢指针还差 **${n} 格**，比上一步少了 ${i} —— 只要相对速度是 1，这个数每步必然减 1。`,d(`move`,`慢指针到 ${p(h)}、快指针到 ${p(g)}。${a}`,{slow:h,fast:g,gap:n,steps:e})}return y===`fell-off`?(d(`end`,`快指针走到了链表末尾（\`fast\` 或 \`fast.next\` 是空）—— **这条链表没有环**，返回 \`false\`。一共走了 ${u.length} 步：没有环时快指针每步走 ${r} 格，最多 n / ${r} 步就出界，所以判环是 O(n) 时间、O(1) 空间。`,{slow:h,fast:g,done:!0}),u):(d(`end`,`走了 ${u.length} 步仍未相遇，已超过步数上限 ${v} —— 这是不该出现的情况，请检查输入（两指针同起点时，任何 fastStep ≥ 2 都必然相遇）。`,{slow:h,fast:g,gap:m(h,g),done:!0}),u)}var ar=`cyc-layout-styles`,or=20,sr=`
.cyc-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.26s ease, fill 0.26s ease, stroke-width 0.26s ease,
    opacity 0.26s ease;
}
.cyc-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 14px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  transition: opacity 0.26s ease, fill 0.26s ease;
}
.cyc-edge__line { stroke: var(--text-secondary, #657168); stroke-width: 1.6; stroke-linecap: round; }
.cyc-edge__head { fill: var(--text-secondary, #657168); }
.cyc-edge { transition: opacity 0.26s ease; }
.cyc-edge.is-dim { opacity: 0.3; }

.cyc-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.6;
  stroke-dasharray: 4 3;
}
.cyc-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 11px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 入口标记：虚线外框 + 上方一个小标 */
.cyc-entry__box {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.4;
  stroke-dasharray: 5 4;
  opacity: 0.75;
}
.cyc-entry__tag {
  fill: var(--text-secondary, #657168);
  font-size: 10.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}

/* 指针所在节点的高亮。绿 = 慢 / ptr1，橙 = 快 / ptr2，两指针重合时用混合色。
   两个动画语义一致，所以放在共享样式里。 */
.cyc-node.is-slow .cyc-node__box {
  stroke: #2f6f4f;
  stroke-width: 2.6;
  fill: rgba(47, 111, 79, 0.16);
}
.cyc-node.is-fast .cyc-node__box {
  stroke: #b4682c;
  stroke-width: 2.6;
  fill: rgba(180, 104, 44, 0.16);
}
.cyc-node.is-both .cyc-node__box {
  stroke: #8a5a2b;
  stroke-width: 3.2;
  fill: rgba(138, 90, 43, 0.22);
}
.cyc-node.is-both .cyc-node__value { font-weight: 700; }
html.theme-dark .cyc-node.is-slow .cyc-node__box { stroke: #7fc3a4; }
html.theme-dark .cyc-node.is-fast .cyc-node__box { stroke: #e0a06a; }
html.theme-dark .cyc-node.is-both .cyc-node__box { stroke: #e8c08a; }

/* 指针徽标：单字，径向/垂直外移。两个字并排也只有 52 宽，不会压到邻居 */
.cyc-chip { transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.26s ease; }
.cyc-chip__box { rx: 9; ry: 9; }
.cyc-chip__text {
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}
.cyc-chip--slow .cyc-chip__box { fill: #2f6f4f; }
.cyc-chip--slow .cyc-chip__text { fill: #fff; }
.cyc-chip--fast .cyc-chip__box { fill: #b4682c; }
.cyc-chip--fast .cyc-chip__text { fill: #fff; }
.cyc-chip--p1 .cyc-chip__box { fill: #2f6f4f; }
.cyc-chip--p1 .cyc-chip__text { fill: #fff; }
.cyc-chip--p2 .cyc-chip__box { fill: #b4682c; }
.cyc-chip--p2 .cyc-chip__text { fill: #fff; }

@media (prefers-reduced-motion: reduce) {
  .cyc-node__box, .cyc-node__value, .cyc-edge, .cyc-chip { transition: none; }
}
`;function cr(){if(document.getElementById(ar))return;let e=document.createElement(`style`);e.id=ar,e.textContent=sr,document.head.appendChild(e)}function lr(e){if(!Number.isInteger(e)||e<=1)return 80;let t=68/(2*Math.sin(Math.PI/e));return Math.max(80,Math.round(t))}function ur(e,t){return 180+360*e/t}function dr(e,t,n,r,i){let a=ur(e,t)*Math.PI/180;return{x:n+i*Math.cos(a),y:r+i*Math.sin(a)}}function fr(e,t,n=46,r=30){let i=Math.abs(e)<1e-6?1/0:n/2/Math.abs(e),a=Math.abs(t)<1e-6?1/0:r/2/Math.abs(t);return Math.min(i,a)}function pr(e,t,{head:n=8,dim:r=!1}={}){let i=t.x-e.x,a=t.y-e.y,o=Math.hypot(i,a)||1,s=i/o,c=a/o,l=fr(s,c),u=e.x+s*l,d=e.y+c*l,f=t.x-s*l,p=t.y-c*l,m=J(`g`,{class:r?`cyc-edge is-dim`:`cyc-edge`});m.appendChild(J(`line`,{class:`cyc-edge__line`,x1:u,y1:d,x2:f-s*n,y2:p-c*n}));let h=-c,g=s,_=5.5;return m.appendChild(J(`path`,{class:`cyc-edge__head`,d:`M ${f} ${p} L ${f-s*n+h*_} ${p-c*n+g*_} L ${f-s*n-h*_} ${p-c*n-g*_} Z`})),m}function mr(e,t,n,r,i=``){let a=J(`g`,{class:`cyc-node ${i}`.trim()});a.appendChild(J(`rect`,{class:`cyc-node__box`,x:n-46/2,y:r-30/2,width:46,height:30,rx:8}));let o=J(`text`,{class:`cyc-node__value`,x:n,y:r});return o.textContent=String(t),a.appendChild(o),e.appendChild(a),a}function hr(e,t,n){let r=J(`g`,{class:`cyc-null`});r.appendChild(J(`circle`,{class:`cyc-null__ring`,cx:t,cy:n,r:15}));let i=J(`text`,{class:`cyc-null__text`,x:t,y:n});return i.textContent=`∅`,r.appendChild(i),e.appendChild(r),r}function gr(e,t,n,r){let i=n>t?1:-1,a=J(`g`,{class:`cyc-edge`});return a.appendChild(J(`line`,{class:`cyc-edge__line`,x1:t,y1:r,x2:n-i*8,y2:r})),a.appendChild(J(`path`,{class:`cyc-edge__head`,d:`M ${n} ${r} L ${n-i*8} ${r-5.5} L ${n-i*8} ${r+5.5} Z`})),e.appendChild(a),a}function _r(e,t,n=0,r=15){if(!e)return null;let i;if(e.inRing&&e.index!==t.a){let n=e.cx-t.ringCenter.x,r=e.cy-t.ringCenter.y,a=Math.hypot(n,r)||1;i={x:n/a,y:r/a}}else i={x:0,y:1};let a={x:e.cx+i.x*30,y:e.cy+i.y*30};if(!n)return a;let o={x:-i.y,y:i.x};return{x:a.x+o.x*n*r,y:a.y+o.y*n*r}}function vr(e,{values:t,cycleStart:n}){let r=Array.isArray(t)?t:[],i=r.length,a=Number.isInteger(n)&&n>=0&&n<i,o=a?n:i,s=a?i-o:0,c=lr(s),l=c+30/2+52,u=24+(o>0?(o-1)*70+46+58:0),d=u+46/2+c,f=a?d+c+46/2+46:u+46/2+60,p=a?l+c+30/2+30+20/2+or:l+30/2+30+20/2+or,m=e=>e<o?{x:24+e*70+46/2,y:l}:dr(e-o,s,d,l,c),h=[];for(let e=0;e<i-1;e+=1)h.push(pr(m(e),m(e+1)));if(a)if(s===1){let e=m(o),t=J(`g`,{class:`cyc-edge`});t.appendChild(J(`path`,{class:`cyc-edge__line`,d:`M ${e.x} ${e.y-30/2} C ${e.x-30} ${e.y-30/2-34}, ${e.x+30} ${e.y-30/2-34}, ${e.x} ${e.y-30/2}`,fill:`none`})),t.appendChild(J(`path`,{class:`cyc-edge__head`,d:`M ${e.x} ${e.y-30/2} L ${e.x-7} ${e.y-30/2-13} L ${e.x+7} ${e.y-30/2-13} Z`})),h.push(t)}else h.push(pr(m(i-1),m(o)));for(let t of h)e.appendChild(t);let g=r.map((t,n)=>{let r=m(n);return{g:mr(e,t,r.x,r.y),cx:r.x,cy:r.y,index:n,inRing:a&&n>=o,ringK:a&&n>=o?n-o:-1}});if(a&&i>0){let t=m(o),n=J(`g`,{class:`cyc-entry`});n.appendChild(J(`rect`,{class:`cyc-entry__box`,x:t.x-46/2-5,y:t.y-30/2-5,width:56,height:40,rx:11}));let r=J(`text`,{class:`cyc-entry__tag`,x:t.x,y:t.y-30/2-16});r.textContent=`入口`,n.appendChild(r),e.appendChild(n)}let _=null;if(!a&&i>0){let t=m(i-1),n=t.x+46/2+30;gr(e,t.x+46/2,n-15,l),hr(e,n,l),_={x:n,y:l}}return{a:o,b:s,hasCycle:a,width:f,height:p,rowY:l,ringCenter:{x:d,y:l},radius:c,nullPos:_,nodes:g,ringKOf:e=>a&&e>=o?e-o:-1,at:e=>g[e]}}var yr=`cyd-styles`,br=42,xr=26,Sr=1150,Cr=`
.cyd { --cyd-slow: #2f6f4f; --cyd-fast: #b4682c; }
html.theme-dark .cyd { --cyd-slow: #7fc3a4; --cyd-fast: #e0a06a; }
.cyd__svg { min-width: 520px; }

/* 距离弧：快指针沿环前进方向到慢指针的那段 */
.cyd-arc { transition: opacity 0.3s ease; }
.cyd-arc.is-off { opacity: 0; }
.cyd-arc__line {
  fill: none;
  stroke: var(--cyd-fast);
  stroke-width: 2.2;
  stroke-dasharray: 7 4;
  stroke-linecap: round;
}
.cyd-arc__head { fill: var(--cyd-fast); }
.cyd-arc__tag-bg { fill: var(--surface-muted, #ecefe8); }
.cyd-arc__tag {
  fill: var(--cyd-fast);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .cyd-arc { transition: none; }
}
`;function wr(){if(ht(),cr(),document.getElementById(yr))return;let e=document.createElement(`style`);e.id=yr,e.textContent=Cr,document.head.appendChild(e)}function Tr(e,t,n){let r=J(`g`,{class:`cyc-chip cyc-chip--${t}`});r.appendChild(J(`rect`,{class:`cyc-chip__box`,x:-26/2,y:-20/2,width:xr,height:20}));let i=J(`text`,{class:`cyc-chip__text`,x:0,y:0});return i.textContent=n,r.appendChild(i),e.appendChild(r),r}function Er(e,t={}){if(!e||e.dataset.cydMounted===`1`)return{destroy(){}};e.dataset.cydMounted=`1`,wr();let n=ir(t),r=n[0].cycle,i=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4,5,6,7,8,9,10,11,12,13],a=r?r.start:null,o=t.autoplay!==!1,s=document.createElement(`div`);s.className=`viz cyd`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=J(`svg`,{class:`viz__svg cyd__svg`,viewBox:`0 0 700 400`,role:`img`,"aria-label":`Floyd 判圈（龟兔赛跑）推演动画`});c.appendChild(l);let u=vr(l,{values:i,cycleStart:a});l.setAttribute(`viewBox`,`0 0 ${u.width} ${u.height}`),l.setAttribute(`width`,u.width),l.setAttribute(`height`,u.height);let d=J(`g`,{class:`cyd-arc is-off`}),f=J(`path`,{class:`cyd-arc__line`}),p=J(`path`,{class:`cyd-arc__head`}),m=J(`rect`,{class:`cyd-arc__tag-bg`,x:-30,y:-9,width:60,height:18,rx:6}),h=J(`text`,{class:`cyd-arc__tag`,x:0,y:0}),g=J(`g`,{class:`cyd-arc__tag-group`});g.append(m,h),d.append(f,p,g),l.appendChild(d);let _=Tr(l,`slow`,`慢`),v=Tr(l,`fast`,`快`);function y(e,t){return _r(u.at(e),u,t)}let b=(e,t)=>{if(!t){e.style.opacity=`0`;return}e.style.opacity=`1`,e.setAttribute(`transform`,`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)})`)},x=document.createElement(`p`);x.className=`viz__desc`,x.setAttribute(`aria-live`,`polite`),s.appendChild(x);let S=_t();s.appendChild(S.root),e.textContent=``,e.appendChild(s);let C=null;function w(e,t){let n=u.b,r=t.slow!==null&&t.slow===t.fast;u.nodes.forEach(e=>{let n=e.index===t.slow,r=e.index===t.fast;e.g.classList.toggle(`is-slow`,n&&!r),e.g.classList.toggle(`is-fast`,r&&!n),e.g.classList.toggle(`is-both`,n&&r)}),b(_,t.slow===null?null:y(t.slow,r?-1:0)),b(v,t.fast===null?null:y(t.fast,+!!r));let i=t.fast===null?-1:u.ringKOf(t.fast),a=t.slow===null?-1:u.ringKOf(t.slow),o=n>0&&i>=0&&a>=0&&t.gap!==null&&t.gap>0;if(d.classList.toggle(`is-off`,!o),o){let e=u.radius-br,r=(a-i+n)%n,o=ur(i,n),s=ur(i+r,n),c=s-o,l=t=>{let n=t*Math.PI/180;return{x:u.ringCenter.x+e*Math.cos(n),y:u.ringCenter.y+e*Math.sin(n)}},d=l(o),m=l(s),_=+(c>180);f.setAttribute(`d`,`M ${d.x.toFixed(1)} ${d.y.toFixed(1)} A ${e} ${e} 0 ${_} 1 ${m.x.toFixed(1)} ${m.y.toFixed(1)}`);let v=s*Math.PI/180,y=-Math.sin(v),b=Math.cos(v),x=-b,S=y;p.setAttribute(`d`,`M ${m.x} ${m.y} L ${m.x-y*9+x*5} ${m.y-b*9+S*5} L ${m.x-y*9-x*5} ${m.y-b*9-S*5} Z`);let C=(o+c/2)*Math.PI/180,w={x:u.ringCenter.x+e*Math.cos(C),y:u.ringCenter.y+e*Math.sin(C)};g.setAttribute(`transform`,`translate(${w.x.toFixed(1)} ${w.y.toFixed(1)})`),h.textContent=`${t.gap} 格`}Y(x,t.desc)}let T=vt({steps:n,controls:S,intervalMs:Sr,onRender:w});T.jumpTo(Math.trunc(t.initialStep)||0);let E=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return o&&!E&&typeof IntersectionObserver==`function`&&(C=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){C.disconnect(),C=null,T.play();return}},{threshold:.35}),C.observe(s)),{destroy(){C&&=(C.disconnect(),null),T.destroy(),e.textContent=``,delete e.dataset.cydMounted,document.getElementById(yr)?.remove()}}}var Dr=[1,2,3,4,5,6,7,8,9,10,11,12,13],Or=4;function kr(e={}){let t=Array.isArray(e.values)?e.values.slice():Dr.slice(),n=t.length,r=e.cycleStart===void 0?Or:e.cycleStart,i=[],a=(e,t,n={})=>i.push({phase:e,desc:t,ptr1:null,ptr2:null,walked:0,remain1:0,remain2:0,passed2:!1,entry:null,meetAt:null,a:0,b:0,x:0,m:0,done:!1,...n});if(n===0)return a(`none`,"链表是空的，没有环，返回 `null`。",{done:!0}),i;let o=ir({values:t,cycleStart:r}),s=o[o.length-1];if(!s.met)return a(`none`,"这条链表没有环（快指针已经走到末尾），所以 LC 142 直接返回 `null` —— 入口根本不存在。",{done:!0}),i;let c=s.cycle.start,l=s.cycle.length,u=s.slow,d=(u-c)%l,f=c+d,p=f/l,m=l-d,h=e=>Number.isInteger(e)&&e>=0&&e<n?String(t[e]):`∅`,g=e=>!Number.isInteger(e)||e>=n?null:e+1<n?e+1:c,_=c===m?`这里 a 恰好等于 b - x，所以两个指针会**同步**抵达入口。`:`注意 a = ${c} 而 b - x = ${m}，后者更小 —— ptr2 会先路过入口、绕回来之后才和 ptr1 碰上。同余式只管「差整数圈」，不管谁先到。`;if(a(`meet`,`第一阶段的终点：慢指针和快指针在节点 ${h(u)} 相遇。设入口是 ${h(c)}、直段长 \`a = ${c}\`、环长 \`b = ${l}\`、相遇点距入口 \`x = ${d}\`，那么 \`a + x = ${f} = ${p} × b\`，也就是 \`a ≡ b - x (mod b)\`。现在**把 ptr1 放回 head、ptr2 留在相遇点，两者都改成每步走 1 格**：ptr1 要走到入口差 **${c} 步**，ptr2 沿环走到入口差 **${m} 步**。${_}`,{ptr1:0,ptr2:u,walked:0,remain1:c,remain2:m,entry:c,meetAt:u,a:c,b:l,x:d,m:p}),c===0)return a(`found`,`**入口就是头节点 ${h(0)}。** 这里 a = 0，头节点本身就在环上 —— ptr1 一步都不用走，而相遇点也正好是入口（x = 0），所以两个指针一开始就重合。LC 142 返回这个节点。`,{ptr1:0,ptr2:u,walked:0,remain1:0,remain2:0,entry:0,meetAt:u,a:c,b:l,x:d,m:p,done:!0}),i;let v=0,y=u;for(let e=1;e<=c;e+=1){v=g(v),y=g(y);let t=c-e,n=m-e,r=n<0,o=r?(n%l+l)%l:n;if(v===y)return a(`found`,`**两个指针在节点 ${h(v)} 相遇 —— 这就是环的入口。** 从 head 走了 ${e} 步，从相遇点也走了 ${e} 步。回到那条同余式：a = ${c} 步到入口、b - x = ${m} 步也到入口，两者相差 ${p>1?`${p} 圈`:`零圈`}，所以它们必然在入口碰头。LC 142 返回这个节点。`,{ptr1:v,ptr2:y,walked:e,remain1:t,remain2:o,passed2:r,entry:c,meetAt:u,a:c,b:l,x:d,m:p,done:!0}),i;a(`walk`,`走了 ${e} 步。ptr1 到 ${h(v)}（离入口还差 **${t} 步**）、ptr2 到 ${h(y)}（离入口还差 **${o} 步**）。`+(r?`注意 ptr2 已经**越过**了入口，它要再绕一圈回来 —— 但同余式保证它绕回入口的那一刻，ptr1 也正好走到。`:`两个剩余步数**同步递减**，这是「两条路一样长」的直接体现。`),{ptr1:v,ptr2:y,walked:e,remain1:t,remain2:o,passed2:r,entry:c,meetAt:u,a:c,b:l,x:d,m:p})}return a(`found`,`走了 ${c} 步仍未同时落在入口，这不该发生 —— 请检查输入。`,{ptr1:v,ptr2:y,walked:c,entry:c,meetAt:u,a:c,b:l,x:d,m:p,done:!0}),i}var Ar=`cye-styles`,jr=42,Mr=56,Nr=32,Pr=17,Fr=1250,Ir=`
.cye { --cye-p1: #2f6f4f; --cye-p2: #b4682c; }
html.theme-dark .cye { --cye-p1: #7fc3a4; --cye-p2: #e0a06a; }
.cye__svg { min-width: 520px; }

/* 相遇点：橙色虚线框，常驻 */
.cye-meet__box {
  fill: none;
  stroke: var(--cye-p2);
  stroke-width: 1.6;
  stroke-dasharray: 3 3;
  opacity: 0.85;
}

/* 尺寸线（直段那条） */
.cye-bar { transition: opacity 0.3s ease; }
.cye-bar.is-off { opacity: 0; }
.cye-bar__line { stroke: var(--cye-p1); stroke-width: 2; stroke-linecap: round; }
.cye-bar__tick { stroke: var(--cye-p1); stroke-width: 2; stroke-linecap: round; }

/* 环内那条弧 */
.cye-arc { transition: opacity 0.3s ease; }
.cye-arc.is-off { opacity: 0; }
.cye-arc__line {
  fill: none;
  stroke: var(--cye-p2);
  stroke-width: 2.2;
  stroke-dasharray: 7 4;
  stroke-linecap: round;
}
.cye-arc__head { fill: var(--cye-p2); }

/* 两个「还差几步」读数，配色和各自的指针一致 */
.cye-tag-bg { fill: var(--surface-muted, #ecefe8); }
.cye-tag {
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-variant-numeric: tabular-nums;
}
.cye-tag--p1 { fill: var(--cye-p1); }
.cye-tag--p2 { fill: var(--cye-p2); }

@media (prefers-reduced-motion: reduce) {
  .cye-bar, .cye-arc { transition: none; }
}
`;function Lr(){if(ht(),cr(),document.getElementById(Ar))return;let e=document.createElement(`style`);e.id=Ar,e.textContent=Ir,document.head.appendChild(e)}function Rr(e,t,n){let r=J(`g`,{class:`cyc-chip cyc-chip--${t}`});r.appendChild(J(`rect`,{class:`cyc-chip__box`,x:-32/2,y:-20/2,width:Nr,height:20}));let i=J(`text`,{class:`cyc-chip__text`,x:0,y:0});return i.textContent=n,r.appendChild(i),e.appendChild(r),r}function zr(e,t){let n=J(`g`,{class:`cye-tag-group cye-tag-group--${t}`}),r=J(`rect`,{class:`cye-tag-bg`,x:-38,y:-10,width:76,height:20,rx:6}),i=J(`text`,{class:`cye-tag cye-tag--${t}`,x:0,y:0});return n.append(r,i),e.appendChild(n),{g:n,t:i,bg:r}}function Br(e,t={}){if(!e||e.dataset.cyeMounted===`1`)return{destroy(){}};e.dataset.cyeMounted=`1`,Lr();let n=kr(t),r=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4,5,6,7,8,9,10,11,12,13],i=n[0],a=Number.isInteger(i.a)&&i.b>0?i.a:null,o=t.autoplay!==!1,s=document.createElement(`div`);s.className=`viz cye`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=J(`svg`,{class:`viz__svg cye__svg`,viewBox:`0 0 700 400`,role:`img`,"aria-label":`环形链表找入口推演动画`});c.appendChild(l);let u=vr(l,{values:r,cycleStart:a});l.setAttribute(`viewBox`,`0 0 ${u.width} ${u.height}`),l.setAttribute(`width`,u.width),l.setAttribute(`height`,u.height);let d=u.at(u.a),f=null;if(Number.isInteger(i.meetAt)&&u.at(i.meetAt)){let e=u.at(i.meetAt),t=J(`g`,{class:`cye-meet`});t.appendChild(J(`rect`,{class:`cye-meet__box`,x:e.cx-46/2-6,y:e.cy-30/2-6,width:58,height:42,rx:12})),l.appendChild(t),f=t}let p=J(`g`,{class:`cye-bar`}),m=J(`path`,{class:`cye-bar__line`}),h=J(`path`,{class:`cye-bar__tick`}),g=J(`path`,{class:`cye-bar__tick`});p.append(m,h,g),l.appendChild(p);let _=zr(l,`p1`),v=J(`g`,{class:`cye-arc`}),y=J(`path`,{class:`cye-arc__line`}),b=J(`path`,{class:`cye-arc__head`});v.append(y,b),l.appendChild(v);let x=zr(l,`p2`),S=Rr(l,`p1`,`P1`),C=Rr(l,`p2`,`P2`);function w(e,t){return _r(u.at(e),u,t,Pr)}let T=(e,t)=>{if(!t){e.style.opacity=`0`;return}e.style.opacity=`1`,e.setAttribute(`transform`,`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)})`)},E=document.createElement(`p`);E.className=`viz__desc`,E.setAttribute(`aria-live`,`polite`),s.appendChild(E);let D=_t();s.appendChild(D.root),e.textContent=``,e.appendChild(s);let O=null;function k(e,t){let n=u.b,r=t.ptr1!==null&&t.ptr1===t.ptr2;u.nodes.forEach(e=>{let n=e.index===t.ptr1,r=e.index===t.ptr2;e.g.classList.toggle(`is-slow`,n&&!r),e.g.classList.toggle(`is-fast`,r&&!n),e.g.classList.toggle(`is-both`,n&&r)}),T(S,t.ptr1===null?null:w(t.ptr1,r?-1:0)),T(C,t.ptr2===null?null:w(t.ptr2,+!!r)),f&&(f.style.opacity=t.phase===`found`?`0.45`:`1`);let i=t.ptr1===null?null:u.at(t.ptr1),a=!!i&&t.remain1>0&&!!d;if(p.classList.toggle(`is-off`,!a),_.g.style.opacity=a?`1`:`0`,a){let e=u.rowY+Mr,n=i.cx,r=d.cx;m.setAttribute(`d`,`M ${n} ${e} L ${r} ${e}`),h.setAttribute(`d`,`M ${n} ${e-6} L ${n} ${e+6}`),g.setAttribute(`d`,`M ${r} ${e-6} L ${r} ${e+6}`),_.g.setAttribute(`transform`,`translate(${((n+r)/2).toFixed(1)} ${e})`),_.t.textContent=`还差 ${t.remain1} 步`}let o=t.ptr2===null?-1:u.ringKOf(t.ptr2),s=n>0&&o>=0&&t.remain2>0&&!t.passed2;if(v.classList.toggle(`is-off`,!s),x.g.style.opacity=s?`1`:`0`,s){let e=u.radius-jr,r=ur(o,n),i=ur(o+t.remain2,n),a=i-r,s=t=>{let n=t*Math.PI/180;return{x:u.ringCenter.x+e*Math.cos(n),y:u.ringCenter.y+e*Math.sin(n)}},c=s(r),l=s(i);y.setAttribute(`d`,`M ${c.x.toFixed(1)} ${c.y.toFixed(1)} A ${e} ${e} 0 ${+(a>180)} 1 ${l.x.toFixed(1)} ${l.y.toFixed(1)}`);let d=i*Math.PI/180,f=-Math.sin(d),p=Math.cos(d);b.setAttribute(`d`,`M ${l.x} ${l.y} L ${l.x-f*9-p*5} ${l.y-p*9+f*5} L ${l.x-f*9+p*5} ${l.y-p*9-f*5} Z`);let m=(r+a/2)*Math.PI/180;x.g.setAttribute(`transform`,`translate(${(u.ringCenter.x+e*Math.cos(m)).toFixed(1)} ${(u.ringCenter.y+e*Math.sin(m)).toFixed(1)})`),x.t.textContent=`还差 ${t.remain2} 步`}Y(E,t.desc)}let A=vt({steps:n,controls:D,intervalMs:Fr,onRender:k});A.jumpTo(Math.trunc(t.initialStep)||0);let ee=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return o&&!ee&&typeof IntersectionObserver==`function`&&(O=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){O.disconnect(),O=null,A.play();return}},{threshold:.35}),O.observe(s)),{destroy(){O&&=(O.disconnect(),null),A.destroy(),e.textContent=``,delete e.dataset.cyeMounted,document.getElementById(Ar)?.remove()}}}var Vr=[`innerHTML`],Hr=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,Ur=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,Wr=`0.16.21`,Gr=`11.4.1`,Kr=y({__name:`MarkdownView`,props:{html:{type:String,default:``},title:{type:String,default:``}},setup(e){let t=e,n=w(null),r=v(()=>ut(lt.sanitize(t.html,{ADD_ATTR:[`target`,`rel`],FORBID_TAGS:[`style`,`iframe`,`object`,`embed`,`form`],FORBID_ATTR:[`onerror`,`onload`,`onclick`]}),t.title));function i(e){e.classList.add(`copied`),e.innerHTML=Ur,setTimeout(()=>{e.classList.remove(`copied`),e.innerHTML=Hr},2e3)}function s(){n.value&&n.value.querySelectorAll(`table`).forEach(e=>{if(e.parentElement?.classList.contains(`table-scroll`))return;let t=document.createElement(`div`);t.className=`table-scroll`,e.parentNode.insertBefore(t,e),t.appendChild(e)})}function l(){n.value&&n.value.querySelectorAll(`pre`).forEach(e=>{if(e.parentElement?.classList.contains(`code-block-wrapper`))return;let t=document.createElement(`div`);t.className=`code-block-wrapper`,e.parentNode.insertBefore(t,e),t.appendChild(e);let n=document.createElement(`button`);n.className=`copy-btn`,n.title=`复制代码`,n.innerHTML=Hr,n.addEventListener(`click`,()=>{let t=(e.querySelector(`code`)||e).textContent||``;navigator.clipboard.writeText(t).then(()=>{i(n)}).catch(()=>{let e=document.createElement(`textarea`);e.value=t,e.style.position=`fixed`,e.style.opacity=`0`,document.body.appendChild(e),e.select(),document.execCommand(`copy`),document.body.removeChild(e),i(n)})}),t.appendChild(n)})}function u(e,t){return new Promise((n,r)=>{if(document.querySelector(`link[data-lib-href="${e}"]`))return n();let i=document.createElement(`link`);i.rel=`stylesheet`,i.href=e,i.integrity=t,i.crossOrigin=`anonymous`,i.dataset.libHref=e,i.onload=()=>n(),i.onerror=()=>r(Error(`Failed to load stylesheet `+e)),document.head.appendChild(i)})}function d(e,t){return new Promise((n,r)=>{if(document.querySelector(`script[data-lib-src="${e}"]`))return n();let i=document.createElement(`script`);i.src=e,i.integrity=t,i.crossOrigin=`anonymous`,i.dataset.libSrc=e,i.onload=()=>n(),i.onerror=()=>r(Error(`Failed to load script `+e)),document.head.appendChild(i)})}let f=null;async function m(){return f||=Promise.all([u(`https://cdn.jsdelivr.net/npm/katex@${Wr}/dist/katex.min.css`,`sha384-zh0CIslj+VczCZtlzBcjt5ppRcsAmDnRem7ESsYwWwg3m/OaJ2l4x7YBZl9Kxxib`),d(`https://cdn.jsdelivr.net/npm/katex@${Wr}/dist/katex.min.js`,`sha384-Rma6DA2IPUwhNxmrB/7S3Tno0YY7sFu9WSYMCuulLhIqYSGZ2gKCJWIqhBWqMQfh`)]).then(()=>window.katex),f}let h=null;async function g(){return h||=d(`https://cdn.jsdelivr.net/npm/mermaid@${Gr}/dist/mermaid.min.js`,`sha384-rbtjAdnIQE/aQJGEgXrVUlMibdfTSa4PQju4HDhN3sR2PmaKFzhEafuePsl9H/9I`).then(()=>window.mermaid),h}async function _(){if(!n.value)return;let e=n.value.querySelectorAll(`code.language-mermaid`);if(e.length)try{let t=await g();e.forEach(e=>{let n=e.closest(`pre`);if(!n||n.dataset.mermaidRendered)return;n.dataset.mermaidRendered=`1`;let r=document.createElement(`div`);r.className=`mermaid-container`,r.textContent=e.textContent,n.parentNode.replaceChild(r,n),t.run({nodes:[r]})})}catch(e){console.warn(`Mermaid failed to load/render:`,e?.message||e)}n.value.querySelectorAll(`img`).forEach(e=>{let t=e.getAttribute(`src`)||``;e.getAttribute(`alt`);let n=t.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);if(n){let t=document.createElement(`div`);t.className=`video-wrapper`,t.innerHTML=`<iframe src="https://www.youtube.com/embed/${n[1]}" frameborder="0" allowfullscreen></iframe>`,e.parentNode.replaceChild(t,e);return}let r=t.match(/bilibili\.com\/video\/(BV[\w]+)/);if(r){let t=document.createElement(`div`);t.className=`video-wrapper`,t.innerHTML=`<iframe src="https://player.bilibili.com/player.html?bvid=${r[1]}" frameborder="0" allowfullscreen></iframe>`,e.parentNode.replaceChild(t,e);return}});let t=/(\$\$[\s\S]+?\$\$|\$[^\s$](?:[^$]*[^\s$])?\$)/,r=document.createTreeWalker(n.value,NodeFilter.SHOW_TEXT),i=[],a;for(;a=r.nextNode();)!a.nodeValue||!t.test(a.nodeValue)||a.parentElement?.closest(`pre, code`)||i.push(a);if(i.length)try{let e=await m();for(let n of i){let r=document.createDocumentFragment();for(let i of n.nodeValue.split(t)){if(!i)continue;let t=i.startsWith(`$$`)&&i.endsWith(`$$`)&&i.length>3,n=!t&&i.startsWith(`$`)&&i.endsWith(`$`)&&i.length>2;if(!t&&!n){r.appendChild(document.createTextNode(i));continue}let a=i.slice(t?2:1,t?-2:-1),o=document.createElement(`span`);o.innerHTML=e.renderToString(a,{displayMode:t,throwOnError:!1}),r.appendChild(o)}n.parentNode.replaceChild(r,n)}}catch(e){console.warn(`KaTeX failed to load/render:`,e?.message||e)}}let y={"algo-viz--lc206":Lt,"algo-viz--lc21":rn,"algo-viz--lc23":Pn,"algo-viz--lc23dc":$n,"algo-viz--lc141":Er,"algo-viz--lc142":Br},b=[];function x(){b.forEach(e=>{try{e?.destroy?.()}catch(e){console.warn(`Algo viz teardown failed:`,e?.message||e)}}),b=[]}function T(){n.value&&(x(),n.value.querySelectorAll(`.algo-viz`).forEach(e=>{let t=Object.keys(y).find(t=>e.classList.contains(t));if(t)try{b.push(y[t](e))}catch(e){console.warn(`Algo viz failed to mount:`,t,e?.message||e)}}))}return a(()=>{o(()=>{T(),_(),s(),l()})}),C(x),p(()=>t.html,()=>{o(()=>{T(),_(),s(),l()})}),(e,t)=>(S(),c(`div`,{ref_key:`bodyRef`,ref:n,class:`markdown-body`,innerHTML:r.value},null,8,Vr))}},[[`__scopeId`,`data-v-7a5c6cab`]]);function qr(e){return T.get(`/articles/${e}/comments/`)}function Jr(e,t){return T.post(`/articles/${e}/comments/`,t)}var Yr={key:0,class:`form-title`},Xr={key:1,class:`form-title`},Zr={class:`form-field`},Qr={key:0,class:`field-error`},$r={class:`form-field`},ei={key:0,class:`field-error`},ti={class:`hp-field`,"aria-hidden":`true`},ni={class:`form-field`},ri={key:0,class:`field-error`},ii={key:0,class:`submit-error`},ai={key:1,class:`submit-success`},oi={class:`form-actions`},si=[`disabled`],ci={key:0,class:`spinner`},li={key:1},ui=y({__name:`CommentForm`,props:{articleSlug:{type:String,required:!0},parentId:{type:[Number,String],default:null}},emits:[`submitted`,`cancel`],setup(e,{emit:t}){let n=e,r=t,a=i({author_name:``,author_email:``,content:``,website:``}),o=i({author_name:``,author_email:``,content:``}),u=w(!1),d=w(null),p=w(!1);function m(){let e=!0;return o.author_name=``,o.author_email=``,o.content=``,a.author_name.trim()||(o.author_name=`请输入昵称`,e=!1),a.author_email.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.author_email)||(o.author_email=`邮箱格式不正确`,e=!1):(o.author_email=`请输入邮箱`,e=!1),a.content.trim()?a.content.trim().length<3&&(o.content=`评论内容至少3个字符`,e=!1):(o.content=`请输入评论内容`,e=!1),e}function g(e){o[e]&&(o[e]=``),d.value=null}async function _(){if(m()){u.value=!0,d.value=null;try{let e={author_name:a.author_name.trim(),author_email:a.author_email.trim(),content:a.content.trim(),website:a.website};n.parentId&&(e.parent=n.parentId),await Jr(n.articleSlug,e),p.value=!0,setTimeout(()=>{p.value=!1},3e3),r(`submitted`),a.author_name=``,a.author_email=``,a.content=``}catch(e){let t=e?.response?.data;if(typeof t==`object`&&t){let e=t;e.author_name&&(o.author_name=Array.isArray(e.author_name)?e.author_name[0]:e.author_name),e.author_email&&(o.author_email=Array.isArray(e.author_email)?e.author_email[0]:e.author_email),e.content&&(o.content=Array.isArray(e.content)?e.content[0]:e.content),e.detail&&(d.value=e.detail),e.non_field_errors&&(d.value=Array.isArray(e.non_field_errors)?e.non_field_errors[0]:e.non_field_errors)}else typeof t==`string`?d.value=t:d.value=e.message||`提交失败，请稍后重试`}finally{u.value=!1}}}return(t,n)=>(S(),c(`div`,{class:h([`comment-form`,{"reply-form":!!e.parentId}])},[e.parentId?(S(),c(`h4`,Yr,`回复评论`)):(S(),c(`h4`,Xr,`发表评论`)),s(`form`,{onSubmit:k(_,[`prevent`]),class:`form-body`},[s(`div`,Zr,[f(s(`input`,{"onUpdate:modelValue":n[0]||=e=>a.author_name=e,type:`text`,placeholder:`昵称 *`,class:h([`form-input`,{"input-error":o.author_name}]),onInput:n[1]||=e=>g(`author_name`)},null,34),[[O,a.author_name]]),o.author_name?(S(),c(`p`,Qr,l(o.author_name),1)):b(``,!0)]),s(`div`,$r,[f(s(`input`,{"onUpdate:modelValue":n[2]||=e=>a.author_email=e,type:`email`,placeholder:`邮箱 *`,class:h([`form-input`,{"input-error":o.author_email}]),onInput:n[3]||=e=>g(`author_email`)},null,34),[[O,a.author_email]]),o.author_email?(S(),c(`p`,ei,l(o.author_email),1)):b(``,!0)]),s(`div`,ti,[f(s(`input`,{"onUpdate:modelValue":n[4]||=e=>a.website=e,type:`text`,tabindex:`-1`,autocomplete:`off`},null,512),[[O,a.website]])]),s(`div`,ni,[f(s(`textarea`,{"onUpdate:modelValue":n[5]||=e=>a.content=e,placeholder:`说点什么...`,rows:`4`,class:h([`form-textarea`,{"input-error":o.content}]),onInput:n[6]||=e=>g(`content`)},null,34),[[O,a.content]]),o.content?(S(),c(`p`,ri,l(o.content),1)):b(``,!0)]),d.value?(S(),c(`p`,ii,l(d.value),1)):b(``,!0),p.value?(S(),c(`p`,ai,`评论已提交！`)):b(``,!0),s(`div`,oi,[e.parentId?(S(),c(`button`,{key:0,type:`button`,class:`cancel-btn`,onClick:n[7]||=e=>t.$emit(`cancel`)},` 取消回复 `)):b(``,!0),s(`button`,{type:`submit`,class:`submit-btn`,disabled:u.value},[u.value?(S(),c(`span`,ci)):(S(),c(`span`,li,`提交`))],8,si)])],32)],2))}},[[`__scopeId`,`data-v-49410be9`]]),di={class:`comment-list`},fi={class:`comments-title`},pi={key:0,class:`comments-count`},mi={key:0,class:`skeleton-comments`},hi={key:1,class:`empty-comments`},gi={key:2,class:`comments-tree`},_i={class:`comment-main`},vi={class:`comment-content`},yi={class:`comment-header`},bi={class:`comment-author`},xi={class:`comment-time`},Si={class:`comment-text`},Ci=[`onClick`],wi={key:1,class:`replies`},Ti={class:`comment-main`},Ei={class:`comment-content`},Di={class:`comment-header`},Oi={class:`comment-author`},ki={class:`comment-time`},Ai={class:`comment-text`},ji=y({__name:`CommentList`,props:{articleSlug:{type:String,required:!0}},setup(e){let t=e,n=w([]),i=w(!0),o=w(null),u=v(()=>n.value.filter(e=>!e.parent));function f(e){o.value=o.value===e?null:e}async function p(){i.value=!0;try{let e=await qr(t.articleSlug);n.value=e.data.results||e.data||[]}catch{n.value=[]}finally{i.value=!1}}function h(){o.value=null,p()}function y(e){if(!e)return``;let t=Date.now()-new Date(e).getTime(),n=Math.floor(t/6e4),r=Math.floor(t/36e5),i=Math.floor(t/864e5);return n<1?`刚刚`:n<60?`${n}分钟前`:r<24?`${r}小时前`:i<30?`${i}天前`:i<365?`${Math.floor(i/30)}个月前`:`${Math.floor(i/365)}年前`}function C(e){let t=[`#3f6b57`,`#a45f45`,`#8a6c3f`,`#637b68`,`#7b6757`,`#4f7477`,`#8a635f`,`#6b7250`,`#536b5d`,`#9b704e`,`#65706a`,`#7b6a83`];if(!e)return t[0];let n=0;for(let t=0;t<e.length;t++)n=e.charCodeAt(t)+((n<<5)-n);return t[Math.abs(n)%t.length]}return a(p),(t,a)=>(S(),c(`div`,di,[s(`h3`,fi,[a[1]||=g(` 评论 `,-1),n.value.length?(S(),c(`span`,pi,`(`+l(n.value.length)+`)`,1)):b(``,!0)]),i.value?(S(),c(`div`,mi,[(S(),c(d,null,r(3,e=>s(`div`,{key:e,class:`skeleton-comment`},[...a[2]||=[_(`<div class="skeleton-avatar" data-v-98dfce57></div><div class="skeleton-body" data-v-98dfce57><div class="skeleton-line w-30" data-v-98dfce57></div><div class="skeleton-line w-50" data-v-98dfce57></div><div class="skeleton-line w-80" data-v-98dfce57></div></div>`,2)]])),64))])):u.value.length?(S(),c(`div`,gi,[(S(!0),c(d,null,r(u.value,t=>(S(),c(`div`,{key:t.id,class:`comment-item`},[s(`div`,_i,[s(`div`,{class:`comment-avatar`,style:x({background:C(t.author_name)})},l(t.author_name?t.author_name.charAt(0).toUpperCase():`?`),5),s(`div`,vi,[s(`div`,yi,[s(`span`,bi,l(t.author_name),1),s(`span`,xi,l(y(t.created_at)),1)]),s(`p`,Si,l(t.content),1),s(`button`,{class:`reply-btn`,onClick:e=>f(t.id)},[...a[4]||=[s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`polyline`,{points:`9 17 4 12 9 7`}),s(`path`,{d:`M20 18v-2a4 4 0 0 0-4-4H4`})],-1),g(` 回复 `,-1)]],8,Ci)])]),o.value===t.id?(S(),m(ui,{key:0,"article-slug":e.articleSlug,"parent-id":t.id,onSubmitted:h,onCancel:a[0]||=e=>o.value=null,class:`reply-form-wrapper`},null,8,[`article-slug`,`parent-id`])):b(``,!0),t.replies&&t.replies.length?(S(),c(`div`,wi,[(S(!0),c(d,null,r(t.replies,e=>(S(),c(`div`,{key:e.id,class:`comment-item reply-item`},[s(`div`,Ti,[s(`div`,{class:`comment-avatar comment-avatar-sm`,style:x({background:C(e.author_name)})},l(e.author_name?e.author_name.charAt(0).toUpperCase():`?`),5),s(`div`,Ei,[s(`div`,Di,[s(`span`,Oi,l(e.author_name),1),s(`span`,ki,l(y(e.created_at)),1)]),s(`p`,Ai,l(e.content),1)])])]))),128))])):b(``,!0)]))),128))])):(S(),c(`div`,hi,[...a[3]||=[s(`svg`,{width:`40`,height:`40`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`1.5`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`path`,{d:`M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z`})],-1),s(`p`,null,`暂无评论，来说点什么吧`,-1)]]))]))}},[[`__scopeId`,`data-v-98dfce57`]]),Mi={key:0,class:`toc-list-wrapper`},Ni={class:`toc-list`},Pi=[`href`,`title`,`onClick`],Fi={class:`toc-text`},Ii={key:1,class:`toc-empty-state`},Li=y({__name:`TocNav`,props:{html:{type:String,default:``}},setup(e){let t=e,n=w([]),i=w(null),u=null,f=[];function m(){if(!t.html){n.value=[];return}try{let e=new DOMParser().parseFromString(t.html,`text/html`),r=[];e.querySelectorAll(`h2, h3, h4`).forEach((e,t)=>{let n=e.id||`toc-heading-${t}`;r.push({id:n,tag:e.tagName.toLowerCase(),text:e.textContent||``})}),n.value=r}catch{n.value=[]}}function g(){if(!n.value.length)return;let e=document.querySelector(`.markdown-body`);e&&e.querySelectorAll(`h2, h3, h4`).forEach((e,t)=>{let r=n.value[t];r&&!e.id&&(e.id=r.id)})}function _(){u&&=(u.disconnect(),null),f=[],n.value.length&&(u=new IntersectionObserver(e=>{let t=e.filter(e=>e.isIntersecting);t.length?i.value=t[0].target.id:window.scrollY<100&&(i.value=n.value[0]?.id||null)},{rootMargin:`-80px 0px -60% 0px`,threshold:0}),o(()=>{n.value.forEach(e=>{let t=document.getElementById(e.id);t&&(u.observe(t),f.push(t))})}))}function v(e){let t=document.getElementById(e);t&&(t.scrollIntoView({behavior:`smooth`,block:`start`}),i.value=e)}return p(()=>t.html,()=>{m(),o(()=>{g(),_()})}),a(()=>{m(),o(()=>{g(),_()})}),C(()=>{u&&u.disconnect()}),(e,t)=>(S(),c(`nav`,{class:h([`toc-nav`,{"toc-empty":!n.value.length}])},[t[2]||=s(`h4`,{class:`toc-title`},`目录`,-1),n.value.length?(S(),c(`div`,Mi,[s(`ul`,Ni,[(S(!0),c(d,null,r(n.value,e=>(S(),c(`li`,{key:e.id,class:h([`toc-item`,[`toc-depth-${e.tag}`,{"toc-active":i.value===e.id}]])},[s(`a`,{href:`#`+e.id,class:`toc-link`,title:e.text,onClick:k(t=>v(e.id),[`prevent`])},[t[0]||=s(`span`,{class:`toc-dot`},null,-1),s(`span`,Fi,l(e.text),1)],8,Pi)],2))),128))])])):(S(),c(`div`,Ii,[...t[1]||=[s(`p`,null,`无目录`,-1)]]))],2))}},[[`__scopeId`,`data-v-21d21cb1`]]),Ri={class:`share-buttons`},zi={key:0,class:`copy-feedback`},Bi=y({__name:`ShareButtons`,props:{title:{type:String,default:``},url:{type:String,default:``}},setup(e){let t=e,n=w(!1);function r(){let e=encodeURIComponent(t.url||window.location.href),n=encodeURIComponent(t.title);window.open(`https://service.weibo.com/share/share.php?url=${e}&title=${n}`,`_blank`,`noopener,noreferrer,width=600,height=400`)}function i(){let e=encodeURIComponent(t.url||window.location.href),n=encodeURIComponent(t.title);window.open(`https://twitter.com/intent/tweet?url=${e}&text=${n}`,`_blank`,`noopener,noreferrer,width=600,height=400`)}function a(){alert(`请复制链接后在微信中粘贴发送`)}async function o(){try{await navigator.clipboard.writeText(t.url||window.location.href),n.value=!0,setTimeout(()=>n.value=!1,2e3)}catch{let e=document.createElement(`textarea`);e.value=t.url||window.location.href,document.body.appendChild(e),e.select(),document.execCommand(`copy`),document.body.removeChild(e),n.value=!0,setTimeout(()=>n.value=!1,2e3)}}return(e,t)=>(S(),c(`div`,Ri,[t[4]||=s(`span`,{class:`share-label`},`分享：`,-1),s(`button`,{class:`share-btn wechat`,title:`微信`,onClick:a},[...t[0]||=[s(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`},[s(`path`,{d:`M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.136 0 .241-.11.241-.245 0-.06-.024-.12-.04-.178l-.325-1.233a.49.49 0 0 1 .178-.554C23.028 18.48 24 16.82 24 14.98c0-3.21-2.931-5.952-7.062-6.122zm-2.18 2.769c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z`})],-1)]]),s(`button`,{class:`share-btn weibo`,title:`微博`,onClick:r},[...t[1]||=[s(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`},[s(`path`,{d:`M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zm-7.317-6.781c-1.059-.2-1.911.419-1.903 1.383.008.964.87 1.907 1.93 2.107 1.058.2 1.91-.419 1.903-1.383-.008-.964-.87-1.907-1.93-2.107zm2.13 3.68c-.563-.249-.754-.766-.428-1.153.326-.388 1.019-.523 1.58-.275.56.248.753.764.429 1.153-.326.386-1.018.524-1.581.275zm.992-3.808c-2.07-.028-4.538.537-7.344 2.641C-.405 17.1-.279 19.15.35 20.49c.528 1.123 1.494 1.773 2.43 2.144 4.878 1.935 10.857.606 13.679-1.35 2.934-2.035 4.033-4.771 3.157-7.165-.516-1.405-1.797-2.398-3.31-2.882l.06-.05c2.485-2.08 4.213-4.585 4.213-7.146 0-5.213-7.11-7.735-10.966-5.371-1.742 1.07-2.772 2.788-3.064 4.72.422-.12.865-.197 1.323-.23 3.271-.241 7.273.776 7.273 3.86 0 3.502-3.823 4.667-6.721 4.667-.89 0-1.785-.215-2.595-.598z`})],-1)]]),s(`button`,{class:`share-btn twitter`,title:`Twitter`,onClick:i},[...t[2]||=[s(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`},[s(`path`,{d:`M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z`})],-1)]]),s(`button`,{class:`share-btn copy`,title:`复制链接`,onClick:o},[...t[3]||=[s(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`path`,{d:`M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71`}),s(`path`,{d:`M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71`})],-1)]]),n.value?(S(),c(`span`,zi,`已复制`)):b(``,!0)]))}},[[`__scopeId`,`data-v-857c6fb5`]]),Vi={key:0,class:`related-section`},Hi={class:`related-grid`},Ui={key:0,class:`related-cover`},Wi=[`src`,`alt`],Gi={class:`related-card-title`},Ki=y({__name:`RelatedArticles`,props:{articles:{type:Array,default:()=>[]}},setup(t){return(i,a)=>{let o=n(`router-link`);return t.articles.length?(S(),c(`section`,Vi,[a[0]||=s(`h3`,{class:`related-title`},`相关文章`,-1),s(`div`,Hi,[(S(!0),c(d,null,r(t.articles,t=>(S(),m(o,{key:t.slug,to:`/article/`+t.slug,class:`related-card`},{default:e(()=>[t.cover_image?(S(),c(`div`,Ui,[s(`img`,{src:t.cover_image,alt:t.title,loading:`lazy`},null,8,Wi)])):b(``,!0),s(`span`,Gi,l(t.title),1)]),_:2},1032,[`to`]))),128))])])):b(``,!0)}}},[[`__scopeId`,`data-v-e3d8298c`]]),qi={class:`newsletter glass-card`},Ji=[`disabled`],Yi=[`disabled`],Xi={key:0},Zi={key:1},Qi={key:2},$i=y({__name:`NewsletterForm`,setup(e){let t=w(``),n=w(!1),r=w(!1),i=w(``),a=w(``);async function o(){if(t.value.trim()){n.value=!0,i.value=``;try{let e=await T.post(`/subscribe/`,{email:t.value.trim()});r.value=!0,i.value=e.data.detail||`订阅成功！`,a.value=`msg-success`}catch(e){let t=e?.response?.data?.error||e?.response?.data?.detail||`订阅失败`;i.value=typeof t==`string`?t:`订阅失败，请稍后重试`,a.value=`msg-error`}finally{n.value=!1}}}return(e,u)=>(S(),c(`div`,qi,[u[1]||=_(`<h4 class="newsletter-title" data-v-54a32a66><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-54a32a66><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" data-v-54a32a66></path><polyline points="22,6 12,13 2,6" data-v-54a32a66></polyline></svg> 订阅更新 </h4><p class="newsletter-desc" data-v-54a32a66>新文章发布时，通过邮件通知你</p>`,2),s(`form`,{onSubmit:k(o,[`prevent`]),class:`newsletter-form`},[f(s(`input`,{"onUpdate:modelValue":u[0]||=e=>t.value=e,type:`email`,placeholder:`your@email.com`,class:`newsletter-input`,disabled:r.value,required:``},null,8,Ji),[[O,t.value]]),s(`button`,{type:`submit`,class:`newsletter-btn`,disabled:n.value||r.value},[n.value?(S(),c(`span`,Xi,`...`)):r.value?(S(),c(`span`,Zi,`✓`)):(S(),c(`span`,Qi,`订阅`))],8,Yi)],32),i.value?(S(),c(`p`,{key:0,class:h(a.value)},l(i.value),3)):b(``,!0)]))}},[[`__scopeId`,`data-v-54a32a66`]]),ea=`个人博客Blog`,ta=`Zhou Jun 的个人博客 — 技术、编程、AI 与科学`;function na(e={}){let{title:t=ea,description:n=ta,image:r=``,url:i=window.location.href}=e,a=t===`个人博客Blog`?t:`${t} | ${ea}`;document.title=a;let o=(e,t,n=!1)=>{if(!t)return;let r=n?`name`:`property`,i=document.querySelector(`meta[${r}="${e}"]`);i||(i=document.createElement(`meta`),i.setAttribute(r,e),document.head.appendChild(i)),i.setAttribute(`content`,t)};o(`description`,n,!0),o(`og:title`,a),o(`og:description`,n),o(`og:image`,r),o(`og:url`,i),o(`og:type`,`article`),o(`twitter:card`,r?`summary_large_image`:`summary`),o(`twitter:title`,a),o(`twitter:description`,n),o(`twitter:image`,r),((e,t)=>{if(!t)return;let n=document.querySelector(`link[rel="${e}"]`);n||(n=document.createElement(`link`),n.setAttribute(`rel`,e),document.head.appendChild(n)),n.setAttribute(`href`,t)})(`canonical`,i)}var ra={title:ea,description:ta,image:``,url:``};function ia(){na({...ra,url:window.location.origin+`/`});let e=document.querySelector(`meta[property="og:type"]`);e&&e.setAttribute(`content`,`website`);let t=document.querySelector(`link[rel="canonical"]`);t&&t.setAttribute(`href`,window.location.origin+`/`)}function aa(e){if(!e)return 1;let t=(e.match(/[一-鿿㐀-䶿]/g)||[]).length+(e.match(/[a-zA-Z]+/g)||[]).length;return Math.max(1,Math.ceil(t/250))}function oa(e){return e?e.replace(/```[\s\S]*?```/g,``).replace(/`[^`]*`/g,``).replace(/!\[.*?\]\(.*?\)/g,``).replace(/\[([^\]]*)\]\(.*?\)/g,`$1`).replace(/[#*>`~\-+|_:]/g,` `).replace(/\s+/g,` `).trim():``}var sa={class:`page page-article-detail`},ca={key:0,class:`detail-skeleton`},la={key:1,class:`error-state`},ua={key:2,class:`detail-layout`},da={class:`detail-main`},fa={class:`article-header`},pa={class:`article-title`},ma={class:`article-meta`},ha={class:`meta-item meta-author`},ga={class:`meta-item meta-date`},_a={key:0,class:`meta-item meta-category neon-text-pink`},va={class:`meta-item meta-reading-time`},ya={class:`meta-item meta-views`},ba={key:0,class:`article-tags`},xa={key:0,class:`article-cover`},Sa=[`src`,`alt`],Ca={key:1,class:`article-nav`},wa={class:`nav-title`},Ta={class:`nav-title`},Ea={class:`article-actions`},Da=[`disabled`],Oa={class:`comment-section`},ka={class:`detail-sidebar`},Aa=y({__name:`ArticleDetail`,setup(i){let o=E();D();let f=ne(),y=w(null),x=w(!0),C=w(null),O=w(null),k=w(0),j=0,re=v(()=>y.value?.created_at?new Date(y.value.created_at).toLocaleDateString(`zh-CN`,{year:`numeric`,month:`2-digit`,day:`2-digit`}):``),M=v(()=>te(y.value?.author)),ie=v(()=>ee(y.value?.category)),N=v(()=>{let e=y.value?.tags;return!e||!Array.isArray(e)?[]:e.map(A).filter(Boolean)}),P=w(!1),ae=w(!1),oe=v(()=>window.location.origin+o.fullPath),se=v(()=>y.value?y.value.reading_time?y.value.reading_time:aa(oa(y.value.content||``)):1),ce=v(()=>y.value?JSON.stringify({"@context":`https://schema.org`,"@type":`Article`,headline:y.value.title,description:y.value.excerpt||``,image:y.value.cover_image||void 0,datePublished:y.value.created_at,dateModified:y.value.updated_at,author:{"@type":`Person`,name:`Zhou Jun`},publisher:{"@type":`Person`,name:`Zhou Jun`}}):``),F=null;p(ce,e=>{if(!e){F?.remove(),F=null;return}F||(F=document.createElement(`script`),F.type=`application/ld+json`,F.dataset.articleJsonLd=`1`,document.head.appendChild(F)),F.textContent=e},{immediate:!0});async function I(){if(!(P.value||ae.value)){ae.value=!0;try{let e=await T.post(`/articles/${y.value.slug}/like/`);y.value&&(y.value.likes_count=e.data.likes_count),P.value=!0}catch{}finally{ae.value=!1}}}async function L(){let e=o.params.slug,t=++j;if(!e){C.value=`缺少文章标识`,O.value=null,x.value=!1;return}x.value=!0,C.value=null,O.value=null,y.value=null,P.value=!1;try{let n=f.getArticleBySlug(e);if(n){if(t!==j)return;y.value=n,x.value=!1,le();return}let r=await f.fetchArticleBySlug(e);if(t!==j)return;y.value=r,y.value?le():C.value=`文章不存在`}catch(e){if(t!==j)return;O.value=e?.response?.status??null,O.value===404?C.value=`文章不存在`:C.value=e?.response?.data?.detail||e.message||`加载文章失败`}finally{t===j&&(x.value=!1)}}function le(){y.value&&na({title:y.value.title,description:y.value.excerpt||``,image:y.value.cover_image||``,url:window.location.origin+o.fullPath})}return a(L),p(()=>o.params.slug,()=>{window.scrollTo({top:0,behavior:`instant`}),k.value++,L()}),t(()=>{ia(),F?.remove(),F=null}),(t,i)=>{let a=n(`router-link`);return S(),c(`div`,sa,[x.value?(S(),c(`div`,ca,[...i[1]||=[_(`<div class="skeleton-header" data-v-c0862088><div class="skeleton-line w-80 skeleton-lg" data-v-c0862088></div><div class="skeleton-meta-row" data-v-c0862088><div class="skeleton-line w-20" data-v-c0862088></div><div class="skeleton-line w-15" data-v-c0862088></div><div class="skeleton-line w-10" data-v-c0862088></div></div></div><div class="skeleton-body" data-v-c0862088><div class="skeleton-line w-100" data-v-c0862088></div><div class="skeleton-line w-100" data-v-c0862088></div><div class="skeleton-line w-90" data-v-c0862088></div><div class="skeleton-line w-100" data-v-c0862088></div><div class="skeleton-line w-70" data-v-c0862088></div></div>`,2)]])):C.value?(S(),c(`div`,la,[i[3]||=s(`svg`,{width:`48`,height:`48`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`1.5`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`circle`,{cx:`12`,cy:`12`,r:`10`}),s(`line`,{x1:`12`,y1:`8`,x2:`12`,y2:`12`}),s(`line`,{x1:`12`,y1:`16`,x2:`12.01`,y2:`16`})],-1),s(`h2`,null,l(O.value===404?`文章不存在`:`加载失败`),1),s(`p`,null,l(C.value),1),u(a,{to:`/articles`,class:`back-link`},{default:e(()=>[...i[2]||=[g(`返回首页`,-1)]]),_:1})])):y.value?(S(),c(`div`,ua,[s(`article`,da,[s(`header`,fa,[s(`h1`,pa,l(y.value.title),1),s(`div`,ma,[s(`span`,ha,[i[4]||=s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`path`,{d:`M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2`}),s(`circle`,{cx:`12`,cy:`7`,r:`4`})],-1),g(` `+l(M.value),1)]),s(`span`,ga,[i[5]||=_(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-c0862088><rect x="3" y="4" width="18" height="18" rx="2" ry="2" data-v-c0862088></rect><line x1="16" y1="2" x2="16" y2="6" data-v-c0862088></line><line x1="8" y1="2" x2="8" y2="6" data-v-c0862088></line><line x1="3" y1="10" x2="21" y2="10" data-v-c0862088></line></svg>`,1),g(` `+l(re.value),1)]),y.value.category?(S(),c(`span`,_a,[i[6]||=s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`path`,{d:`M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z`})],-1),g(` `+l(ie.value),1)])):b(``,!0),s(`span`,va,[i[7]||=s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`circle`,{cx:`12`,cy:`12`,r:`10`}),s(`polyline`,{points:`12 6 12 12 16 14`})],-1),g(` 约 `+l(se.value)+` 分钟 `,1)]),s(`span`,ya,[i[8]||=s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`path`,{d:`M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z`}),s(`circle`,{cx:`12`,cy:`12`,r:`3`})],-1),g(` `+l(y.value.views_count||0),1)])]),N.value.length?(S(),c(`div`,ba,[(S(!0),c(d,null,r(N.value,(e,t)=>(S(),c(`span`,{key:t,class:`tag-pill`},l(e),1))),128))])):b(``,!0)]),y.value.cover_image?(S(),c(`div`,xa,[s(`img`,{src:y.value.cover_image,alt:y.value.title},null,8,Sa)])):b(``,!0),u(Kr,{html:y.value.html_content||y.value.content||``,title:y.value.title},null,8,[`html`,`title`]),y.value.prev_article||y.value.next_article?(S(),c(`nav`,Ca,[y.value.prev_article?(S(),m(a,{key:0,to:`/article/`+(y.value.prev_article.slug||y.value.prev_article),class:`nav-link prev-link`},{default:e(()=>[i[9]||=s(`span`,{class:`nav-direction`},[s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`polyline`,{points:`15 18 9 12 15 6`})]),g(` 上一篇 `)],-1),s(`span`,wa,l(y.value.prev_article.title||y.value.prev_article),1)]),_:1},8,[`to`])):b(``,!0),y.value.next_article?(S(),m(a,{key:1,to:`/article/`+(y.value.next_article.slug||y.value.next_article),class:`nav-link next-link`},{default:e(()=>[i[10]||=s(`span`,{class:`nav-direction`},[g(` 下一篇 `),s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`polyline`,{points:`9 18 15 12 9 6`})])],-1),s(`span`,Ta,l(y.value.next_article.title||y.value.next_article),1)]),_:1},8,[`to`])):b(``,!0)])):b(``,!0),s(`div`,Ea,[u(Bi,{title:y.value.title,url:oe.value},null,8,[`title`,`url`]),s(`button`,{class:h([`like-btn`,{liked:P.value}]),disabled:ae.value,onClick:I},[i[11]||=s(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`},[s(`path`,{d:`M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z`})],-1),s(`span`,null,l(y.value.likes_count||0),1)],10,Da)]),u(Ki,{articles:y.value.related_articles||[]},null,8,[`articles`]),u($i),s(`section`,Oa,[(S(),m(ji,{"article-slug":y.value.slug,key:k.value},null,8,[`article-slug`])),u(ui,{"article-slug":y.value.slug,onSubmitted:i[0]||=e=>k.value++},null,8,[`article-slug`])])]),s(`aside`,ka,[u(Li,{html:y.value.html_content||y.value.content||``},null,8,[`html`])])])):b(``,!0)])}}},[[`__scopeId`,`data-v-c0862088`]]);export{Aa as default};