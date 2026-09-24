import{A as e,C as t,D as n,E as r,R as i,S as a,b as o,c as s,d as c,dt as l,h as u,i as d,j as f,k as p,l as m,lt as h,m as g,p as _,s as v,t as y,u as b,ut as x,w as S,x as C,z as w}from"./_plugin-vue_export-helper-BK47PYcU.js";import{t as T}from"./client-DyaaoQco.js";import{f as E,p as D,v as O,y as k}from"./index-BNfFHeGv.js";import{i as A,n as j,t as M}from"./labels-H7OcNmBE.js";import{t as N}from"./article-DtQPNUJ2.js";function P(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function F(e){if(Array.isArray(e))return e}function I(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r,i,a,o,s=[],c=!0,l=!1;try{if(a=(n=n.call(e)).next,t!==0)for(;!(c=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);c=!0);}catch(e){l=!0,i=e}finally{try{if(!c&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(l)throw i}}return s}}function L(){throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function R(e,t){return F(e)||I(e,t)||z(e,t)||L()}function z(e,t){if(e){if(typeof e==`string`)return P(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?P(e,t):void 0}}var B=Object.entries,V=Object.setPrototypeOf,H=Object.isFrozen,ee=Object.getPrototypeOf,te=Object.getOwnPropertyDescriptor,U=Object.freeze,W=Object.seal,G=Object.create,ne=typeof Reflect<`u`&&Reflect,re=ne.apply,K=ne.construct;U||=function(e){return e},W||=function(e){return e},re||=function(e,t){var n=[...arguments].slice(2);return e.apply(t,n)},K||=function(e){return new e(...[...arguments].slice(1))};var ie=Se(Array.prototype.forEach),ae=Se(Array.prototype.lastIndexOf),oe=Se(Array.prototype.pop),se=Se(Array.prototype.push),ce=Se(Array.prototype.splice),le=Array.isArray,ue=Se(String.prototype.toLowerCase),de=Se(String.prototype.toString),fe=Se(String.prototype.match),pe=Se(String.prototype.replace),me=Se(String.prototype.indexOf),he=Se(String.prototype.trim),ge=Se(Number.prototype.toString),q=Se(Boolean.prototype.toString),_e=typeof BigInt>`u`?null:Se(BigInt.prototype.toString),J=typeof Symbol>`u`?null:Se(Symbol.prototype.toString),ve=Se(Object.prototype.hasOwnProperty),ye=Se(Object.prototype.toString),be=Se(RegExp.prototype.test),xe=Ce(TypeError);function Se(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);var n=[...arguments].slice(1);return re(e,t,n)}}function Ce(e){return function(){return K(e,[...arguments])}}function Y(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:ue;if(V&&V(e,null),!le(t))return e;let r=t.length;for(;r--;){let i=t[r];if(typeof i==`string`){let e=n(i);e!==i&&(H(t)||(t[r]=e),i=e)}e[i]=!0}return e}function we(e){for(let t=0;t<e.length;t++)ve(e,t)||(e[t]=null);return e}function Te(e){let t=G(null);for(let r of B(e)){var n=R(r,2);let i=n[0],a=n[1];ve(e,i)&&(le(a)?t[i]=we(a):a&&typeof a==`object`&&a.constructor===Object?t[i]=Te(a):t[i]=a)}return t}function Ee(e){switch(typeof e){case`string`:return e;case`number`:return ge(e);case`boolean`:return q(e);case`bigint`:return _e?_e(e):`0`;case`symbol`:return J?J(e):`Symbol()`;case`undefined`:return ye(e);case`function`:case`object`:{if(e===null)return ye(e);let t=e,n=De(t,`toString`);if(typeof n==`function`){let e=n(t);return typeof e==`string`?e:ye(e)}return ye(e)}default:return ye(e)}}function De(e,t){for(;e!==null;){let n=te(e,t);if(n){if(n.get)return Se(n.get);if(typeof n.value==`function`)return Se(n.value)}e=ee(e)}function n(){return null}return n}function Oe(e){try{return be(e,``),!0}catch{return!1}}var ke=U(`a.abbr.acronym.address.area.article.aside.audio.b.bdi.bdo.big.blink.blockquote.body.br.button.canvas.caption.center.cite.code.col.colgroup.content.data.datalist.dd.decorator.del.details.dfn.dialog.dir.div.dl.dt.element.em.fieldset.figcaption.figure.font.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.img.input.ins.kbd.label.legend.li.main.map.mark.marquee.menu.menuitem.meter.nav.nobr.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.section.select.shadow.slot.small.source.spacer.span.strike.strong.style.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.track.tt.u.ul.var.video.wbr`.split(`.`)),Ae=U(`svg.a.altglyph.altglyphdef.altglyphitem.animatecolor.animatemotion.animatetransform.circle.clippath.defs.desc.ellipse.enterkeyhint.exportparts.filter.font.g.glyph.glyphref.hkern.image.inputmode.line.lineargradient.marker.mask.metadata.mpath.part.path.pattern.polygon.polyline.radialgradient.rect.stop.style.switch.symbol.text.textpath.title.tref.tspan.view.vkern`.split(`.`)),je=U([`feBlend`,`feColorMatrix`,`feComponentTransfer`,`feComposite`,`feConvolveMatrix`,`feDiffuseLighting`,`feDisplacementMap`,`feDistantLight`,`feDropShadow`,`feFlood`,`feFuncA`,`feFuncB`,`feFuncG`,`feFuncR`,`feGaussianBlur`,`feImage`,`feMerge`,`feMergeNode`,`feMorphology`,`feOffset`,`fePointLight`,`feSpecularLighting`,`feSpotLight`,`feTile`,`feTurbulence`]),Me=U([`animate`,`color-profile`,`cursor`,`discard`,`font-face`,`font-face-format`,`font-face-name`,`font-face-src`,`font-face-uri`,`foreignobject`,`hatch`,`hatchpath`,`mesh`,`meshgradient`,`meshpatch`,`meshrow`,`missing-glyph`,`script`,`set`,`solidcolor`,`unknown`,`use`]),Ne=U(`math.menclose.merror.mfenced.mfrac.mglyph.mi.mlabeledtr.mmultiscripts.mn.mo.mover.mpadded.mphantom.mroot.mrow.ms.mspace.msqrt.mstyle.msub.msup.msubsup.mtable.mtd.mtext.mtr.munder.munderover.mprescripts`.split(`.`)),Pe=U([`maction`,`maligngroup`,`malignmark`,`mlongdiv`,`mscarries`,`mscarry`,`msgroup`,`mstack`,`msline`,`msrow`,`semantics`,`annotation`,`annotation-xml`,`mprescripts`,`none`]),Fe=U([`#text`]),Ie=U(`accept.action.align.alt.autocapitalize.autocomplete.autopictureinpicture.autoplay.background.bgcolor.border.capture.cellpadding.cellspacing.checked.cite.class.clear.color.cols.colspan.command.commandfor.controls.controlslist.coords.crossorigin.datetime.decoding.default.dir.disabled.disablepictureinpicture.disableremoteplayback.download.draggable.enctype.enterkeyhint.exportparts.face.for.headers.height.hidden.high.href.hreflang.id.inert.inputmode.integrity.ismap.kind.label.lang.list.loading.loop.low.max.maxlength.media.method.min.minlength.multiple.muted.name.nonce.noshade.novalidate.nowrap.open.optimum.part.pattern.placeholder.playsinline.popover.popovertarget.popovertargetaction.poster.preload.pubdate.radiogroup.readonly.rel.required.rev.reversed.role.rows.rowspan.spellcheck.scope.selected.shape.size.sizes.slot.span.srclang.start.src.srcset.step.style.summary.tabindex.title.translate.type.usemap.valign.value.width.wrap.xmlns`.split(`.`)),Le=U(`accent-height.accumulate.additive.alignment-baseline.amplitude.ascent.attributename.attributetype.azimuth.basefrequency.baseline-shift.begin.bias.by.class.clip.clippathunits.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.cx.cy.d.dx.dy.diffuseconstant.direction.display.divisor.dominant-baseline.dur.edgemode.elevation.end.exponent.fill.fill-opacity.fill-rule.filter.filterunits.flood-color.flood-opacity.font-family.font-size.font-size-adjust.font-stretch.font-style.font-variant.font-weight.fx.fy.g1.g2.glyph-name.glyphref.gradientunits.gradienttransform.height.href.id.image-rendering.in.in2.intercept.k.k1.k2.k3.k4.kerning.keypoints.keysplines.keytimes.lang.lengthadjust.letter-spacing.kernelmatrix.kernelunitlength.lighting-color.local.marker-end.marker-mid.marker-start.markerheight.markerunits.markerwidth.maskcontentunits.maskunits.max.mask.mask-type.media.method.mode.min.name.numoctaves.offset.operator.opacity.order.orient.orientation.origin.overflow.paint-order.path.pathlength.patterncontentunits.patterntransform.patternunits.points.preservealpha.preserveaspectratio.primitiveunits.r.rx.ry.radius.refx.refy.repeatcount.repeatdur.restart.result.rotate.scale.seed.shape-rendering.slope.specularconstant.specularexponent.spreadmethod.startoffset.stddeviation.stitchtiles.stop-color.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke.stroke-width.style.surfacescale.systemlanguage.tabindex.tablevalues.targetx.targety.transform.transform-origin.text-anchor.text-decoration.text-orientation.text-rendering.textlength.type.u1.u2.unicode.values.viewbox.visibility.version.vert-adv-y.vert-origin-x.vert-origin-y.width.word-spacing.wrap.writing-mode.xchannelselector.ychannelselector.x.x1.x2.xmlns.y.y1.y2.z.zoomandpan`.split(`.`)),Re=U(`accent.accentunder.align.bevelled.close.columnalign.columnlines.columnspacing.columnspan.denomalign.depth.dir.display.displaystyle.encoding.fence.frame.height.href.id.largeop.length.linethickness.lquote.lspace.mathbackground.mathcolor.mathsize.mathvariant.maxsize.minsize.movablelimits.notation.numalign.open.rowalign.rowlines.rowspacing.rowspan.rspace.rquote.scriptlevel.scriptminsize.scriptsizemultiplier.selection.separator.separators.stretchy.subscriptshift.supscriptshift.symmetric.voffset.width.xmlns`.split(`.`)),ze=U([`xlink:href`,`xml:id`,`xlink:title`,`xml:space`,`xmlns:xlink`]),Be=W(/{{[\w\W]*|^[\w\W]*}}/g),Ve=W(/<%[\w\W]*|^[\w\W]*%>/g),He=W(/\${[\w\W]*/g),Ue=W(/^data-[\-\w.\u00B7-\uFFFF]+$/),We=W(/^aria-[\-\w]+$/),Ge=W(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Ke=W(/^(?:\w+script|data):/i),qe=W(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Je=W(/^html$/i),Ye=W(/^[a-z][.\w]*(-[.\w]+)+$/i),Xe=W(/<[/\w!]/g),Ze=W(/<[/\w]/g),Qe=W(/<\/no(script|embed|frames)/i),$e=W(/\/>/i),et={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,processingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},tt=function(){return typeof window>`u`?null:window},nt=function(e,t){if(typeof e!=`object`||typeof e.createPolicy!=`function`)return null;let n=null,r=`data-tt-policy-suffix`;t&&t.hasAttribute(r)&&(n=t.getAttribute(r));let i=`dompurify`+(n?`#`+n:``);try{return e.createPolicy(i,{createHTML(e){return e},createScriptURL(e){return e}})}catch{return console.warn(`TrustedTypes policy `+i+` could not be created.`),null}},rt=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},it=function(e,t,n,r){return ve(e,t)&&le(e[t])?Y(r.base?Te(r.base):{},e[t],r.transform):n};function at(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:tt(),t=e=>at(e);if(t.version=`3.4.12`,t.removed=[],!e||!e.document||e.document.nodeType!==et.document||!e.Element)return t.isSupported=!1,t;let n=e.document,r=n,i=r.currentScript;e.DocumentFragment;let a=e.HTMLTemplateElement,o=e.Node,s=e.Element,c=e.NodeFilter;e.NamedNodeMap===void 0&&(e.NamedNodeMap||e.MozNamedAttrMap),e.HTMLFormElement;let l=e.DOMParser,u=e.trustedTypes,d=s.prototype,f=De(d,`cloneNode`),p=De(d,`remove`),m=De(d,`nextSibling`),h=De(d,`childNodes`),g=De(d,`parentNode`),_=De(d,`shadowRoot`),v=De(d,`attributes`),y=o&&o.prototype?De(o.prototype,`nodeType`):null,b=o&&o.prototype?De(o.prototype,`nodeName`):null;if(typeof a==`function`){let e=n.createElement(`template`);e.content&&e.content.ownerDocument&&(n=e.content.ownerDocument)}let x,S=``,C,w=!1,T=0,E=function(){if(T>0)throw xe(`A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.`)},D=function(e){E(),T++;try{return x.createHTML(e)}finally{T--}},O=function(e){E(),T++;try{return x.createScriptURL(e)}finally{T--}},k=function(){return w||=(C=nt(u,i),!0),C},A=n,j=A.implementation,M=A.createNodeIterator,N=A.createDocumentFragment,P=A.getElementsByTagName,F=r.importNode,I=rt();t.isSupported=typeof B==`function`&&typeof g==`function`&&j&&j.createHTMLDocument!==void 0;let L=Be,R=Ve,z=He,V=Ue,H=We,ee=Ke,te=qe,ne=Ye,re=Ge,K=null,ge=Y({},[...ke,...Ae,...je,...Ne,...Fe]),q=null,_e=Y({},[...Ie,...Le,...Re,...ze]),J=Object.seal(G(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),ye=null,Se=null,Ce=Object.seal(G(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),we=!0,ot=!0,st=!1,ct=!0,lt=!1,ut=!0,X=!1,dt=!1,ft=null,pt=null,mt=!1,Z=!1,Q=!1,ht=!1,gt=!0,_t=!1,vt=`user-content-`,yt=!0,bt=!1,xt={},St=null,Ct=Y({},`annotation-xml.audio.colgroup.desc.foreignobject.head.iframe.math.mi.mn.mo.ms.mtext.noembed.noframes.noscript.plaintext.script.selectedcontent.style.svg.template.thead.title.video.xmp`.split(`.`)),wt=null,Tt=Y({},[`audio`,`video`,`img`,`source`,`image`,`track`]),Et=null,Dt=Y({},[`alt`,`class`,`for`,`id`,`label`,`name`,`pattern`,`placeholder`,`role`,`summary`,`title`,`value`,`style`,`xmlns`]),Ot=`http://www.w3.org/1998/Math/MathML`,kt=`http://www.w3.org/2000/svg`,At=`http://www.w3.org/1999/xhtml`,jt=At,Mt=!1,Nt=null,Pt=Y({},[Ot,kt,At],de),Ft=U([`mi`,`mo`,`mn`,`ms`,`mtext`]),It=Y({},Ft),Lt=U([`annotation-xml`]),Rt=Y({},Lt),zt=Y({},[`title`,`style`,`font`,`a`,`script`]),Bt=null,Vt=[`application/xhtml+xml`,`text/html`],$=null,Ht=null,Ut=n.createElement(`form`),Wt=function(e){return e instanceof RegExp||e instanceof Function},Gt=function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(Ht&&Ht===e)return;(!e||typeof e!=`object`)&&(e={}),e=Te(e),Bt=Vt.indexOf(e.PARSER_MEDIA_TYPE)===-1?`text/html`:e.PARSER_MEDIA_TYPE,$=Bt===`application/xhtml+xml`?de:ue,K=it(e,`ALLOWED_TAGS`,ge,{transform:$}),q=it(e,`ALLOWED_ATTR`,_e,{transform:$}),Nt=it(e,`ALLOWED_NAMESPACES`,Pt,{transform:de}),Et=it(e,`ADD_URI_SAFE_ATTR`,Dt,{transform:$,base:Dt}),wt=it(e,`ADD_DATA_URI_TAGS`,Tt,{transform:$,base:Tt}),St=it(e,`FORBID_CONTENTS`,Ct,{transform:$}),ye=it(e,`FORBID_TAGS`,Te({}),{transform:$}),Se=it(e,`FORBID_ATTR`,Te({}),{transform:$}),xt=ve(e,`USE_PROFILES`)?e.USE_PROFILES&&typeof e.USE_PROFILES==`object`?Te(e.USE_PROFILES):e.USE_PROFILES:!1,we=e.ALLOW_ARIA_ATTR!==!1,ot=e.ALLOW_DATA_ATTR!==!1,st=e.ALLOW_UNKNOWN_PROTOCOLS||!1,ct=e.ALLOW_SELF_CLOSE_IN_ATTR!==!1,lt=e.SAFE_FOR_TEMPLATES||!1,ut=e.SAFE_FOR_XML!==!1,X=e.WHOLE_DOCUMENT||!1,Z=e.RETURN_DOM||!1,Q=e.RETURN_DOM_FRAGMENT||!1,ht=e.RETURN_TRUSTED_TYPE||!1,mt=e.FORCE_BODY||!1,gt=e.SANITIZE_DOM!==!1,_t=e.SANITIZE_NAMED_PROPS||!1,yt=e.KEEP_CONTENT!==!1,bt=e.IN_PLACE||!1,re=Oe(e.ALLOWED_URI_REGEXP)?e.ALLOWED_URI_REGEXP:Ge,jt=typeof e.NAMESPACE==`string`?e.NAMESPACE:At,It=ve(e,`MATHML_TEXT_INTEGRATION_POINTS`)&&e.MATHML_TEXT_INTEGRATION_POINTS&&typeof e.MATHML_TEXT_INTEGRATION_POINTS==`object`?Te(e.MATHML_TEXT_INTEGRATION_POINTS):Y({},Ft),Rt=ve(e,`HTML_INTEGRATION_POINTS`)&&e.HTML_INTEGRATION_POINTS&&typeof e.HTML_INTEGRATION_POINTS==`object`?Te(e.HTML_INTEGRATION_POINTS):Y({},Lt);let t=ve(e,`CUSTOM_ELEMENT_HANDLING`)&&e.CUSTOM_ELEMENT_HANDLING&&typeof e.CUSTOM_ELEMENT_HANDLING==`object`?Te(e.CUSTOM_ELEMENT_HANDLING):G(null);if(J=G(null),ve(t,`tagNameCheck`)&&Wt(t.tagNameCheck)&&(J.tagNameCheck=t.tagNameCheck),ve(t,`attributeNameCheck`)&&Wt(t.attributeNameCheck)&&(J.attributeNameCheck=t.attributeNameCheck),ve(t,`allowCustomizedBuiltInElements`)&&typeof t.allowCustomizedBuiltInElements==`boolean`&&(J.allowCustomizedBuiltInElements=t.allowCustomizedBuiltInElements),W(J),lt&&(ot=!1),Q&&(Z=!0),xt&&(K=Y({},Fe),q=G(null),xt.html===!0&&(Y(K,ke),Y(q,Ie)),xt.svg===!0&&(Y(K,Ae),Y(q,Le),Y(q,ze)),xt.svgFilters===!0&&(Y(K,je),Y(q,Le),Y(q,ze)),xt.mathMl===!0&&(Y(K,Ne),Y(q,Re),Y(q,ze))),Ce.tagCheck=null,Ce.attributeCheck=null,ve(e,`ADD_TAGS`)&&(typeof e.ADD_TAGS==`function`?Ce.tagCheck=e.ADD_TAGS:le(e.ADD_TAGS)&&(K===ge&&(K=Te(K)),Y(K,e.ADD_TAGS,$))),ve(e,`ADD_ATTR`)&&(typeof e.ADD_ATTR==`function`?Ce.attributeCheck=e.ADD_ATTR:le(e.ADD_ATTR)&&(q===_e&&(q=Te(q)),Y(q,e.ADD_ATTR,$))),ve(e,`ADD_URI_SAFE_ATTR`)&&le(e.ADD_URI_SAFE_ATTR)&&Y(Et,e.ADD_URI_SAFE_ATTR,$),ve(e,`FORBID_CONTENTS`)&&le(e.FORBID_CONTENTS)&&(St===Ct&&(St=Te(St)),Y(St,e.FORBID_CONTENTS,$)),ve(e,`ADD_FORBID_CONTENTS`)&&le(e.ADD_FORBID_CONTENTS)&&(St===Ct&&(St=Te(St)),Y(St,e.ADD_FORBID_CONTENTS,$)),yt&&(K[`#text`]=!0),X&&Y(K,[`html`,`head`,`body`]),K.table&&(Y(K,[`tbody`]),delete ye.tbody),e.TRUSTED_TYPES_POLICY){if(typeof e.TRUSTED_TYPES_POLICY.createHTML!=`function`)throw xe(`TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.`);if(typeof e.TRUSTED_TYPES_POLICY.createScriptURL!=`function`)throw xe(`TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.`);let t=x;x=e.TRUSTED_TYPES_POLICY;try{S=D(``)}catch(e){throw x=t,e}}else e.TRUSTED_TYPES_POLICY===null?(x=void 0,S=``):(x===void 0&&(x=k()),x&&typeof S==`string`&&(S=D(``)));U&&U(e),Ht=e},Kt=Y({},[...Ae,...je,...Me]),qt=Y({},[...Ne,...Pe]),Jt=function(e,t,n){return t.namespaceURI===At?e===`svg`:t.namespaceURI===Ot?e===`svg`&&(n===`annotation-xml`||It[n]):!!Kt[e]},Yt=function(e,t,n){return t.namespaceURI===At?e===`math`:t.namespaceURI===kt?e===`math`&&Rt[n]:!!qt[e]},Xt=function(e,t,n){return t.namespaceURI===kt&&!Rt[n]||t.namespaceURI===Ot&&!It[n]?!1:!qt[e]&&(zt[e]||!Kt[e])},Zt=function(e){let t=g(e);(!t||!t.tagName)&&(t={namespaceURI:jt,tagName:`template`});let n=ue(e.tagName),r=ue(t.tagName);return Nt[e.namespaceURI]?e.namespaceURI===kt?Jt(n,t,r):e.namespaceURI===Ot?Yt(n,t,r):e.namespaceURI===At?Xt(n,t,r):!!(Bt===`application/xhtml+xml`&&Nt[e.namespaceURI]):!1},Qt=function(e){se(t.removed,{element:e});try{g(e).removeChild(e)}catch{if(p(e),!g(e))throw xe(`a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place`)}},$t=function(e){nn(e);let t=h(e);if(t){let e=[];ie(t,t=>{se(e,t)}),ie(e,e=>{try{p(e)}catch{}})}let n=v(e);if(n)for(let t=n.length-1;t>=0;--t){let r=n[t],i=r&&r.name;if(typeof i==`string`)try{e.removeAttribute(i)}catch{}}},en=function(e,n){try{se(t.removed,{attribute:n.getAttributeNode(e),from:n})}catch{se(t.removed,{attribute:null,from:n})}if(n.removeAttribute(e),e===`is`)if(Z||Q)try{Qt(n)}catch{}else try{n.setAttribute(e,``)}catch{}},tn=function(e){let t=v(e);if(t)for(let n=t.length-1;n>=0;--n){let r=t[n],i=r&&r.name;if(!(typeof i!=`string`||q[$(i)]))try{e.removeAttribute(i)}catch{}}},nn=function(e){let t=[e];for(;t.length>0;){let e=t.pop();(y?y(e):e.nodeType)===et.element&&tn(e);let n=h(e);if(n)for(let e=n.length-1;e>=0;--e)t.push(n[e])}},rn=function(e){if(!ut)return;let t=[e];for(;t.length>0;){let e=t.pop(),n=y?y(e):e.nodeType;if(n===et.processingInstruction||n===et.comment&&be(Ze,e.data)){try{p(e)}catch{}continue}if(n===et.element){let t=e,n=$(b?b(e):e.nodeName);try{t.hasAttribute&&t.hasAttribute(`patchsrc`)&&t.removeAttribute(`patchsrc`),t.hasAttribute&&t.hasAttribute(`for`)&&n!==`label`&&n!==`output`&&t.removeAttribute(`for`)}catch{}}let r=h(e);if(r)for(let e=r.length-1;e>=0;--e)t.push(r[e])}},an=function(e){let t=null,r=null;if(mt)e=`<remove></remove>`+e;else{let t=fe(e,/^[\r\n\t ]+/);r=t&&t[0]}Bt===`application/xhtml+xml`&&jt===At&&(e=`<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>`+e+`</body></html>`);let i=x?D(e):e;if(jt===At)try{t=new l().parseFromString(i,Bt)}catch{}if(!t||!t.documentElement){t=j.createDocument(jt,`template`,null);try{t.documentElement.innerHTML=Mt?S:i}catch{}}let a=t.body||t.documentElement;return e&&r&&a.insertBefore(n.createTextNode(r),a.childNodes[0]||null),jt===At?P.call(t,X?`html`:`body`)[0]:X?t.documentElement:a},on=function(e){return M.call(e.ownerDocument||e,e,c.SHOW_ELEMENT|c.SHOW_COMMENT|c.SHOW_TEXT|c.SHOW_PROCESSING_INSTRUCTION|c.SHOW_CDATA_SECTION,null)},sn=function(e){return e=pe(e,L,` `),e=pe(e,R,` `),e=pe(e,z,` `),e},cn=function(e){e.normalize();let t=M.call(e.ownerDocument||e,e,c.SHOW_TEXT|c.SHOW_COMMENT|c.SHOW_CDATA_SECTION|c.SHOW_PROCESSING_INSTRUCTION,null),n=t.nextNode();for(;n;)n.data=sn(n.data),n=t.nextNode();let r=e.querySelectorAll?.call(e,`template`);r&&ie(r,e=>{un(e.content)&&cn(e.content)})},ln=function(e){let t=b?b(e):null;return typeof t!=`string`||$(t)!==`form`?!1:typeof e.nodeName!=`string`||typeof e.textContent!=`string`||typeof e.removeChild!=`function`||e.attributes!==v(e)||typeof e.removeAttribute!=`function`||typeof e.setAttribute!=`function`||typeof e.namespaceURI!=`string`||typeof e.insertBefore!=`function`||typeof e.hasChildNodes!=`function`||e.nodeType!==y(e)||e.childNodes!==h(e)},un=function(e){if(!y||typeof e!=`object`||!e)return!1;try{return y(e)===et.documentFragment}catch{return!1}},dn=function(e){if(!y||typeof e!=`object`||!e)return!1;try{return typeof y(e)==`number`}catch{return!1}};function fn(e,n,r){e.length!==0&&ie(e,e=>{e.call(t,n,r,Ht)})}let pn=function(e,t){return!!(ut&&e.hasChildNodes()&&!dn(e.firstElementChild)&&be(Xe,e.textContent)&&be(Xe,e.innerHTML)||ut&&e.namespaceURI===At&&t===`style`&&dn(e.firstElementChild)||e.nodeType===et.processingInstruction||ut&&e.nodeType===et.comment&&be(Ze,e.data))},mn=function(e,t){if(!ye[t]&&vn(t)&&(J.tagNameCheck instanceof RegExp&&be(J.tagNameCheck,t)||J.tagNameCheck instanceof Function&&J.tagNameCheck(t)))return!1;if(yt&&!St[t]){let t=g(e),n=h(e);if(n&&t){let r=n.length;for(let i=r-1;i>=0;--i){let r=bt?n[i]:f(n[i],!0);t.insertBefore(r,m(e))}}}return Qt(e),!0},hn=function(e,n){if(fn(I.beforeSanitizeElements,e,null),e!==n&&g(e)===null)return!0;if(ln(e))return Qt(e),!0;let r=$(b?b(e):e.nodeName);if(fn(I.uponSanitizeElement,e,{tagName:r,allowedTags:K}),e!==n&&g(e)===null)return!0;if(pn(e,r))return Qt(e),!0;if(ye[r]||!(Ce.tagCheck instanceof Function&&Ce.tagCheck(r))&&!K[r]){let t=mn(e,r);return t===!1&&fn(I.afterSanitizeElements,e,null),t}if((y?y(e):e.nodeType)===et.element&&!Zt(e)||(r===`noscript`||r===`noembed`||r===`noframes`)&&be(Qe,e.innerHTML))return Qt(e),!0;if(lt&&e.nodeType===et.text){let n=sn(e.textContent);e.textContent!==n&&(se(t.removed,{element:e.cloneNode()}),e.textContent=n)}return fn(I.afterSanitizeElements,e,null),!1},gn=function(e,t,r){if(Se[t]||ut&&t===`patchsrc`||ut&&t===`for`&&e!==`label`&&e!==`output`||gt&&(t===`id`||t===`name`)&&(r in n||r in Ut))return!1;let i=q[t]||Ce.attributeCheck instanceof Function&&Ce.attributeCheck(t,e);if(!(ot&&be(V,t))&&!(we&&be(H,t))){if(!i){if(!(vn(e)&&(J.tagNameCheck instanceof RegExp&&be(J.tagNameCheck,e)||J.tagNameCheck instanceof Function&&J.tagNameCheck(e))&&(J.attributeNameCheck instanceof RegExp&&be(J.attributeNameCheck,t)||J.attributeNameCheck instanceof Function&&J.attributeNameCheck(t,e))||t===`is`&&J.allowCustomizedBuiltInElements&&(J.tagNameCheck instanceof RegExp&&be(J.tagNameCheck,r)||J.tagNameCheck instanceof Function&&J.tagNameCheck(r))))return!1}else if(!Et[t]&&!be(re,pe(r,te,``))&&!((t===`src`||t===`xlink:href`||t===`href`)&&e!==`script`&&me(r,`data:`)===0&&wt[e])&&!(st&&!be(ee,pe(r,te,``)))&&r)return!1}return!0},_n=Y({},[`annotation-xml`,`color-profile`,`font-face`,`font-face-format`,`font-face-name`,`font-face-src`,`font-face-uri`,`missing-glyph`]),vn=function(e){return!_n[ue(e)]&&be(ne,e)},yn=function(e,t,n,r){if(x&&typeof u==`object`&&typeof u.getAttributeType==`function`&&!n)switch(u.getAttributeType(e,t)){case`TrustedHTML`:return D(r);case`TrustedScriptURL`:return O(r)}return r},bn=function(e,n,r,i){try{r?e.setAttributeNS(r,n,i):e.setAttribute(n,i),ln(e)?Qt(e):oe(t.removed)}catch{en(n,e)}},xn=function(e){fn(I.beforeSanitizeAttributes,e,null);let t=e.attributes;if(!t||ln(e))return;let n={attrName:``,attrValue:``,keepAttr:!0,allowedAttributes:q,forceKeepAttr:void 0},r=t.length,i=$(e.nodeName);for(;r--;){let a=t[r],o=a.name,s=a.namespaceURI,c=a.value,l=$(o),u=c,d=o===`value`?u:he(u);if(n.attrName=l,n.attrValue=d,n.keepAttr=!0,n.forceKeepAttr=void 0,fn(I.uponSanitizeAttribute,e,n),d=n.attrValue,_t&&(l===`id`||l===`name`)&&me(d,vt)!==0&&(en(o,e),d=vt+d),ut&&be(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,d)){en(o,e);continue}if(l===`attributename`&&fe(d,`href`)){en(o,e);continue}if(!n.forceKeepAttr){if(!n.keepAttr){en(o,e);continue}if(!ct&&be($e,d)){en(o,e);continue}if(lt&&(d=sn(d)),!gn(i,l,d)){en(o,e);continue}d=yn(i,l,s,d),d!==u&&bn(e,o,s,d)}}fn(I.afterSanitizeAttributes,e,null)},Sn=function(e){let t=null,n=on(e);for(fn(I.beforeSanitizeShadowDOM,e,null);t=n.nextNode();)if(fn(I.uponSanitizeShadowNode,t,null),hn(t,e),xn(t),un(t.content)&&Sn(t.content),(y?y(t):t.nodeType)===et.element){let e=_(t);un(e)&&(Cn(e),Sn(e))}fn(I.afterSanitizeShadowDOM,e,null)},Cn=function(e){let t=[{node:e,shadow:null}];for(;t.length>0;){let e=t.pop();if(e.shadow){Sn(e.shadow);continue}let n=e.node,r=(y?y(n):n.nodeType)===et.element,i=h(n);if(i)for(let e=i.length-1;e>=0;--e)t.push({node:i[e],shadow:null});if(r){let e=b?b(n):null;if(typeof e==`string`&&$(e)===`template`){let e=n.content;un(e)&&t.push({node:e,shadow:null})}}if(r){let e=_(n);un(e)&&t.push({node:null,shadow:e},{node:e,shadow:null})}}};return t.sanitize=function(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=null,a=null,o=null,s=null;if(Mt=!e,Mt&&(e=`<!-->`),typeof e!=`string`&&!dn(e)&&(e=Ee(e),typeof e!=`string`))throw xe(`dirty is not a string, aborting`);if(!t.isSupported)return e;dt?(K=ft,q=pt):Gt(n),(I.uponSanitizeElement.length>0||I.uponSanitizeAttribute.length>0)&&(K=Te(K)),I.uponSanitizeAttribute.length>0&&(q=Te(q)),t.removed=[];let c=bt&&typeof e!=`string`&&dn(e);if(c){rn(e);let t=b?b(e):e.nodeName;if(typeof t==`string`){let n=$(t);if(!K[n]||ye[n])throw $t(e),xe(`root node is forbidden and cannot be sanitized in-place`)}if(ln(e))throw $t(e),xe(`root node is clobbered and cannot be sanitized in-place`);try{Cn(e)}catch(t){throw $t(e),t}}else if(dn(e))i=an(`<!---->`),a=i.ownerDocument.importNode(e,!0),a.nodeType===et.element&&a.nodeName===`BODY`||a.nodeName===`HTML`?i=a:i.appendChild(a),Cn(a);else{if(!Z&&!lt&&!X&&e.indexOf(`<`)===-1)return x&&ht?D(e):e;if(i=an(e),!i)return Z?null:ht?S:``}i&&mt&&Qt(i.firstChild);let l=c?e:i,u=on(l);try{for(;o=u.nextNode();)hn(o,l),xn(o),un(o.content)&&Sn(o.content)}catch(n){throw c&&($t(e),ie(t.removed,e=>{e.element&&nn(e.element)})),n}if(c)return ie(t.removed,e=>{e.element&&nn(e.element)}),lt&&cn(e),e;if(Z){if(lt&&cn(i),Q)for(s=N.call(i.ownerDocument);i.firstChild;)s.appendChild(i.firstChild);else s=i;return(q.shadowroot||q.shadowrootmode)&&(s=F.call(r,s,!0)),s}let d=X?i.outerHTML:i.innerHTML;return X&&K[`!doctype`]&&i.ownerDocument&&i.ownerDocument.doctype&&i.ownerDocument.doctype.name&&be(Je,i.ownerDocument.doctype.name)&&(d=`<!DOCTYPE `+i.ownerDocument.doctype.name+`>
`+d),lt&&(d=sn(d)),x&&ht?D(d):d},t.setConfig=function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Gt(e),dt=!0,ft=K,pt=q},t.clearConfig=function(){Ht=null,dt=!1,ft=null,pt=null,x=C,S=``},t.isValidAttribute=function(e,t,n){Ht||Gt({});let r=$(e),i=$(t);return gn(r,i,n)},t.addHook=function(e,t){typeof t==`function`&&ve(I,e)&&se(I[e],t)},t.removeHook=function(e,t){if(ve(I,e)){if(t!==void 0){let n=ae(I[e],t);return n===-1?void 0:ce(I[e],n,1)[0]}return oe(I[e])}},t.removeHooks=function(e){ve(I,e)&&(I[e]=[])},t.removeAllHooks=function(){I=rt()},t}var ot=at();function st(e,t){let n=String(e??``),r=n.match(/^\s*<h1\b[^>]*>([\s\S]*?)<\/h1>\s*/i);if(!r)return n;let i=r[1].replace(/<[^>]*>/g,``).replace(/\s+/g,` `).trim(),a=String(t??``).replace(/\s+/g,` `).trim();return!a||i!==a?n:n.slice(r[0].length)}function ct(e){let t=e.length,n=Array.from({length:t},(e,n)=>n+1<t?n+1:null),r=[],i=null,a=t>0?0:null,o=null,s=(e,t)=>r.push({phase:e,desc:t,prev:i,curr:a,next:o,nextOf:[...n],done:!1}),c=t=>t===null?`∅`:String(e[t]);if(t===0)return s(`init`,"空链表。`head` 本身就是 ∅，直接返回 ∅ —— 这是必须单独处理的第一种边界。"),r[0].done=!0,r;for(s(`init`,`初始状态：\`prev\` 先站在 ∅（反转后头节点会变成尾节点，它的 \`next\` 必须指向空），\`curr\` 指向头节点 ${c(a)}。`);a!==null;)o=n[a],s(`read-next`,`① \`next = curr.next\`，先记住 ${c(o)}。这一步看着多余，其实是整个算法的命门：一旦 ② 把 \`curr\` 的指针掉头，通往后面节点的唯一线索就断了，所以必须提前存好。`),n[a]=i,s(`flip`,`② \`curr.next = prev\`，把 ${c(a)} 的箭头掉个头，指向 ${c(i)}。`+(i===null?` 因为 \`prev\` 还是 ∅，${c(a)} 就成了新的尾节点。`:``)),i=a,a=o,s(`advance`,a===null?`③ \`prev = curr\`，\`curr = next\` = ∅。curr 走出了链表，循环结束 —— 返回 \`prev\`（${c(i)}），它就是反转后的新头节点。`:`③ \`prev\` 和 \`curr\` 一起右移：\`prev\` 指向 ${c(i)}，\`curr\` 指向 ${c(a)}。准备处理下一个节点。`);return r[r.length-1].done=!0,r}var lt=`viz-chrome-styles`,ut=`http://www.w3.org/2000/svg`;function X(e,t){let n=document.createElementNS(ut,e);if(t)for(let e in t)n.setAttribute(e,t[e]);return n}function dt(e,t,n,r,i=`viz-arrow`){let a=X(`g`,{class:i}),o=r>0?t:e,s=r>0?e:t;return a.appendChild(X(`line`,{class:`${i}__line`,x1:s,y1:n,x2:o-r*9,y2:n})),a.appendChild(X(`path`,{class:`${i}__head`,d:`M ${o} ${n} L ${o-r*9} ${n-5.5} L ${o-r*9} ${n+5.5} Z`})),a}var ft=`
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
`;function pt(){if(document.getElementById(lt))return;let e=document.createElement(`style`);e.id=lt,e.textContent=ft,document.head.appendChild(e)}function mt(){document.getElementById(lt)?.remove()}function Z(e,t){e.textContent=``;let n=String(t??``),r=/(`[^`]*`|\*\*[^*]+\*\*)/g,i=0;for(let t of n.matchAll(r)){t.index>i&&e.appendChild(document.createTextNode(n.slice(i,t.index)));let r=t[0],a=r.startsWith("`"),o=document.createElement(a?`code`:`strong`);o.textContent=r.slice(a?1:2,a?-1:-2),e.appendChild(o),i=t.index+r.length}i<n.length&&e.appendChild(document.createTextNode(n.slice(i)))}function Q({playLabel:e=`播放`,pauseLabel:t=`暂停`}={}){let n=(e,t)=>{let n=document.createElement(`button`);return n.type=`button`,n.className=t?`viz__btn ${t}`:`viz__btn`,n.textContent=e,n},r=document.createElement(`div`);r.className=`viz__bar`;let i=n(`上一步`),a=n(e,`viz__btn--play`),o=n(`下一步`),s=n(`重置`),c=document.createElement(`span`);return c.className=`viz__count`,r.append(i,a,o,s,c),{root:r,prev:i,play:a,next:o,reset:s,count:c,setPlaying:n=>{a.textContent=n?t:e}}}function ht({steps:e,controls:t,intervalMs:n=1150,onRender:r}){let i=0,a=null,o=()=>{a&&=(clearInterval(a),null),t.setPlaying(!1)},s=()=>{r(i,e[i]),t.count.textContent=`第 ${i+1} / ${e.length} 步`,t.prev.disabled=i===0,t.next.disabled=i===e.length-1,t.reset.disabled=i===0&&!a},c=()=>{a||(i===e.length-1&&(i=0),t.setPlaying(!0),a=setInterval(()=>{if(i>=e.length-1){o(),s();return}i+=1,s()},n),s())},l=t=>{o(),i=Math.min(e.length-1,Math.max(0,i+t)),s()},u=()=>{o(),i=0,s()},d=t=>{o(),i=Math.min(e.length-1,Math.max(0,t)),s()},f={prev:()=>l(-1),next:()=>l(1),reset:u,play:()=>a?o():c()};return t.prev.addEventListener(`click`,f.prev),t.next.addEventListener(`click`,f.next),t.reset.addEventListener(`click`,f.reset),t.play.addEventListener(`click`,f.play),{render:s,play:c,stop:o,reset:u,jumpTo:d,destroy:()=>{o(),t.prev.removeEventListener(`click`,f.prev),t.next.removeEventListener(`click`,f.next),t.reset.removeEventListener(`click`,f.reset),t.play.removeEventListener(`click`,f.play)},get index(){return i}}}var gt=`llv-styles`,_t=72,vt=52,yt=44,bt=68,xt=96,St=122,Ct=48,wt=200,Tt=240,Et=62,Dt=26,Ot=276,kt=26,At=1150,jt=0,Mt=(e,t,n,r)=>dt(e,t,n,r,`llv-edge`),Nt=`
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
`;function Pt(){if(pt(),document.getElementById(gt))return;let e=document.createElement(`style`);e.id=gt,e.textContent=Nt,document.head.appendChild(e)}function Ft(e,t={}){if(!e||e.dataset.llvMounted===`1`)return{destroy(){}};e.dataset.llvMounted=`1`,Pt(),jt+=1;let n=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4,5],r=t.autoplay!==!1,i=ct(n),a=n.length,o=Array.from({length:a},(e,t)=>t+1<a?t+1:null),s=2*bt+a*_t+Math.max(0,a-1)*yt,c=e=>bt+e*116,l=e=>c(e)+_t/2,u=kt,d=s-kt,f=document.createElement(`div`);f.className=`viz llv`;let p=document.createElement(`div`);p.className=`viz__stage`,f.appendChild(p);let m=X(`svg`,{class:`viz__svg llv__svg`,viewBox:`0 0 ${s} ${Ot}`,role:`img`,"aria-label":`反转链表推演动画：${n.join(` → `)}`});p.appendChild(m);for(let e of[u,d]){m.appendChild(X(`circle`,{class:`llv-null__ring`,cx:e,cy:St,r:15}));let t=X(`text`,{class:`llv-null__text`,x:e,y:St});t.textContent=`∅`,m.appendChild(t)}let h=X(`line`,{class:`llv-tick`}),g=X(`line`,{class:`llv-tick`}),_=X(`line`,{class:`llv-tick`});m.append(h,g,_);let v=[];for(let e=0;e<a-1;e+=1){let t=c(e)+_t,n=c(e+1),r=Mt(t,n,St,1),i=Mt(t,n,St,-1);m.append(r,i),v.push({fwd:r,bwd:i})}let y=Mt(c(a-1)+_t,d-15,St,1),b=Mt(41,c(0),St,-1);m.append(y,b);let x=[];for(let e=0;e<a;e+=1){let t=X(`g`,{class:`llv-node`});t.appendChild(X(`rect`,{class:`llv-node__box`,x:c(e),y:xt,width:_t,height:vt,rx:9}));let r=X(`text`,{class:`llv-node__value`,x:l(e),y:St});r.textContent=String(n[e]),t.appendChild(r),m.appendChild(t),x.push(t)}function S(e,t){let n=X(`g`,{class:`llv-chip llv-chip--${e}`});n.appendChild(X(`rect`,{class:`llv-chip__box`,x:-62/2,y:-26/2,width:Et,height:Dt}));let r=X(`text`,{class:`llv-chip__text`,x:0,y:0});return r.textContent=t,n.appendChild(r),n}let C=S(`next`,`next`),w=S(`prev`,`prev`),T=S(`curr`,`curr`);m.append(C,w,T);let E=document.createElement(`p`);E.className=`viz__desc`,E.setAttribute(`aria-live`,`polite`),f.appendChild(E);let D=Q();f.appendChild(D.root),e.textContent=``,e.appendChild(f);let O=null;function k(e,t,n,r,i,a,o){e.style.transform=`translate(${n}px, ${r}px)`,e.style.opacity=i?`1`:`0`,i?(t.setAttribute(`x1`,n),t.setAttribute(`x2`,n),t.setAttribute(`y1`,a),t.setAttribute(`y2`,o),t.style.opacity=`0.65`):t.style.opacity=`0`}function A(e,t){for(let e=0;e<a;e+=1){let n=x[e];n.classList.toggle(`is-flipped`,t.nextOf[e]!==o[e]),n.classList.toggle(`is-curr`,t.curr===e),n.classList.toggle(`is-next`,t.next===e)}for(let e=0;e<a-1;e+=1){let n=t.nextOf[e]===e+1,r=t.nextOf[e+1]===e;v[e].fwd.classList.toggle(`is-on`,n),v[e].bwd.classList.toggle(`is-on`,r),v[e].bwd.classList.toggle(`is-flipped`,r)}let n=t.nextOf[a-1]===null,r=t.nextOf[0]===null;y.classList.toggle(`is-on`,n),b.classList.toggle(`is-on`,r),b.classList.toggle(`is-flipped`,r),k(w,g,t.prev===null?u:l(t.prev),wt,!0,wt-Dt/2,148),k(T,_,t.curr===null?d:l(t.curr),Tt,!0,Tt-Dt/2,148),k(C,h,t.next===null?d:l(t.next),Ct,t.phase!==`init`,61,xt),Z(E,t.desc)}let j=ht({steps:i,controls:D,intervalMs:At,onRender:A});j.jumpTo(Math.trunc(t.initialStep)||0);let M=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!M&&typeof IntersectionObserver==`function`&&(O=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){O.disconnect(),O=null,j.play();return}},{threshold:.35}),O.observe(f)),{destroy(){O&&=(O.disconnect(),null),j.destroy(),e.textContent=``,delete e.dataset.llvMounted,--jt,jt<=0&&(document.getElementById(gt)?.remove(),mt())}}}var It=e=>String(e);function Lt(e,t){let n=Array.isArray(e)?e:[],r=Array.isArray(t)?t:[],i=[],a=[],o=0,s=0,c=(e,t,c={})=>i.push({phase:e,desc:t,p1:o<n.length?o:null,p2:s<r.length?s:null,taken:a.map(e=>({...e})),rest:null,done:!1,...c}),l=(e,t)=>e===`a`?n[t]:r[t];if(n.length===0&&r.length===0)return c(`init`,`两条链表都是空的。哑结点后面什么都没有，返回 ∅。`),i[0].done=!0,i;if(n.length===0||r.length===0){let e=n.length===0?`A`:`B`,t=e===`A`?`B`:`A`;return c(`init`,`${e} 是空链表，那么「合并」就是原样返回 ${t}（${(t===`A`?n:r).map(It).join(`、`)}）—— 一个空链表和一个有序链表合并，结果就是那个有序链表本身。`),i[0].done=!0,i}for(c(`init`,`两个指针各站在自己链表的头部：\`p1\` 指向 A 的 ${It(n[0])}，\`p2\` 指向 B 的 ${It(r[0])}。结果链表先放一个**哑结点**当锚点 —— 它不是答案的一部分，只是为了让我们不必特判「第一个节点该接谁」，最后返回 \`dummy.next\` 就行。`);o<n.length&&s<r.length;){let e=n[o]<=r[s];c(`compare`,`比较 \`p1\` 的 ${It(n[o])} 和 \`p2\` 的 ${It(r[s])}：`+(e?`${It(n[o])} ≤ ${It(r[s])}，取 A 的 ${It(n[o])}。`+(n[o]===r[s]?`（相等时取哪边都行，习惯上取 A）`:``):`${It(r[s])} < ${It(n[o])}，取 B 的 ${It(r[s])}。`),{cursor:e?`a`:`b`}),e?(a.push({list:`a`,i:o}),o+=1):(a.push({list:`b`,i:s}),s+=1),c(`take`,`把 ${It(l(a[a.length-1].list,a[a.length-1].i))} 接到结果链表的尾部，然后 ${e?"`p1`":"`p2`"} 前移一格。`+(e&&o>=n.length?` A 走完了。`:``)+(!e&&s>=r.length?` B 走完了。`:``),{picked:e?`a`:`b`})}if(o<n.length||s<r.length){let e=o<n.length?`a`:`b`,t=o<n.length?o:s,i=(e===`a`?n.slice(o):r.slice(s)).map(It).join(`、`),l=e===`a`?n:r,u=o<n.length?o:null,d=s<r.length?s:null;for(let n=t;n<l.length;n+=1)a.push({list:e,i:n});e===`a`?o=n.length:s=r.length,c(`append-rest`,`${e===`a`?`B`:`A`} 已经走完了，${e===`a`?`A`:`B`} 剩下的 ${i} 全部原样接到结果尾部。**这是整道题最容易被忽略的一步**：两条链表各自都是有序的，所以剩下这段不需要再逐个比较，直接整段接上就对。`,{rest:{list:e,from:t},p1:u,p2:d})}return c(`done`,`两条链表都走完了。结果链表是 ${a.map(e=>It(l(e.list,e.i))).join(` → `)} —— 但别忘了开头那个哑结点，它不是答案的一部分，所以返回 \`dummy.next\`。`),i[i.length-1].done=!0,i}var Rt=`mtl-styles`,zt=60,Bt=44,Vt=94,$=84,Ht=40,Ut=130,Wt=218,Gt=214/2,Kt=38,qt=24,Jt=17,Yt=26,Xt=15,Zt=302,Qt=1150,$t=0,en=`
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
`;function tn(){if(pt(),document.getElementById(Rt))return;let e=document.createElement(`style`);e.id=Rt,e.textContent=en,document.head.appendChild(e)}function nn(e,t={}){if(!e||e.dataset.mtlMounted===`1`)return{destroy(){}};e.dataset.mtlMounted=`1`,tn(),$t+=1;let n=Array.isArray(t.listA)&&t.listA.length?t.listA:[1,2,4],r=Array.isArray(t.listB)&&t.listB.length?t.listB:[1,3,4],i=t.autoplay!==!1,a=Lt(n,r),o=a[a.length-1].taken,s=e=>e.list===`a`?n[e.i]:r[e.i],c=1+o.length,l=e=>$+e*Vt,u=e=>l(e)+zt/2,d=e=>e<=0?$:$+(e-1)*Vt+zt,f=e=>e<=0?$:d(e)+Yt,p=Math.max(d(n.length),d(r.length),d(c))+Yt+Xt+12,m=document.createElement(`div`);m.className=`viz mtl`;let h=document.createElement(`div`);h.className=`viz__stage`,m.appendChild(h);let g=X(`svg`,{class:`viz__svg mtl__svg`,viewBox:`0 0 ${p} ${Zt}`,role:`img`,"aria-label":`合并两个有序链表推演动画：${n.join(`、`)} 与 ${r.join(`、`)}`});h.appendChild(g);for(let[e,t]of[[`A`,62],[`B`,152],[`结果`,240]]){let n=X(`text`,{class:`mtl-row-label`,x:30,y:t});n.textContent=e,g.appendChild(n)}function _(e,t){g.appendChild(X(`circle`,{class:`mtl-dummy__box`,cx:e,cy:t,r:Xt}));let n=X(`text`,{class:`mtl-dummy__text`,x:e,y:t});n.textContent=`∅`,g.appendChild(n)}function v(e,t,n,r){let i=X(`g`,{class:r});return i.appendChild(X(`line`,{class:`mtl-edge__line`,x1:e,y1:n,x2:t-9,y2:n})),i.appendChild(X(`path`,{class:`mtl-edge__head`,d:`M ${t} ${n} L ${t-9} ${n-5.5} L ${t-9} ${n+5.5} Z`})),g.appendChild(i),i}function y(e,t){let n=t+Bt/2;for(let t=0;t<e-1;t+=1)v(l(t)+zt,l(t+1),n,`mtl-edge`);_(f(e),n),e>0&&v(d(e),f(e)-Xt,n,`mtl-edge`)}y(n.length,Ht),y(r.length,Ut);let b=[];for(let e=1;e<c;e+=1)b.push(v(l(e-1)+zt,l(e),240,`mtl-edge mtl-redge`));_(f(c),240);let x=v(d(c),f(c)-Xt,240,`mtl-edge mtl-redge`);function S(e,t,n,r){let i=X(`g`,{class:`mtl-node ${r}`});i.appendChild(X(`rect`,{class:`mtl-node__box`,x:l(t),y:n,width:zt,height:Bt,rx:9}));let a=X(`text`,{class:`mtl-node__value`,x:u(t),y:n+Bt/2});return a.textContent=String(e),i.appendChild(a),g.appendChild(i),i}let C=n.map((e,t)=>S(e,t,Ht,`mtl-node--a`)),w=r.map((e,t)=>S(e,t,Ut,`mtl-node--b`)),T=X(`g`,{class:`mtl-dummy`});T.appendChild(X(`rect`,{class:`mtl-dummy__box`,x:l(0),y:Wt,width:zt,height:Bt,rx:9}));let E=X(`text`,{class:`mtl-dummy__text`,x:u(0),y:240});E.textContent=`dummy`,T.appendChild(E),g.appendChild(T);let D=o.map((e,t)=>S(s(e),t+1,Wt,`mtl-rslot mtl-rslot--from-${e.list}`)),O=X(`g`,{class:`mtl-vs`});O.appendChild(X(`circle`,{class:`mtl-vs__ring`,cx:0,cy:0,r:13}));let k=X(`text`,{class:`mtl-vs__text`,x:0,y:0});k.textContent=`vs`,O.appendChild(k),g.appendChild(O);function A(e,t){let n=X(`g`,{class:`mtl-chip mtl-chip--${e}`});n.appendChild(X(`rect`,{class:`mtl-chip__box`,x:-38/2,y:-24/2,width:Kt,height:qt}));let r=X(`text`,{class:`mtl-chip__text`,x:0,y:0});return r.textContent=t,n.appendChild(r),g.appendChild(n),n}let j=A(`p1`,`p1`),M=A(`p2`,`p2`),N=A(`tail`,`tail`),P=document.createElement(`p`);P.className=`viz__desc`,P.setAttribute(`aria-live`,`polite`),m.appendChild(P);let F=Q();m.appendChild(F.root),e.textContent=``,e.appendChild(m);let I=null;function L(e,t,n){e.style.transform=`translate(${t}px, ${n}px)`}function R(e,t){let i=new Set(t.taken.map(e=>`${e.list}:${e.i}`));C.forEach((e,n)=>{e.classList.toggle(`is-taken`,i.has(`a:${n}`)),e.classList.toggle(`is-cand`,t.phase===`compare`&&t.p1===n),e.classList.toggle(`is-win`,t.phase===`compare`&&t.cursor===`a`&&t.p1===n),e.classList.toggle(`is-rest`,t.phase===`append-rest`&&t.rest?.list===`a`&&n>=t.rest.from)}),w.forEach((e,n)=>{e.classList.toggle(`is-taken`,i.has(`b:${n}`)),e.classList.toggle(`is-cand`,t.phase===`compare`&&t.p2===n),e.classList.toggle(`is-win`,t.phase===`compare`&&t.cursor===`b`&&t.p2===n),e.classList.toggle(`is-rest`,t.phase===`append-rest`&&t.rest?.list===`b`&&n>=t.rest.from)});let a=t.rest?(t.rest.list===`a`?n.length:r.length)-t.rest.from:0,o=t.phase===`take`?t.taken.length:t.phase===`append-rest`?t.taken.length-a+1:1/0;D.forEach((e,n)=>{let r=n+1,i=r<=t.taken.length;e.classList.toggle(`is-filled`,i),e.classList.toggle(`is-new`,i&&r>=o)}),b.forEach((e,n)=>e.classList.toggle(`is-on`,n+1<=t.taken.length)),x.classList.toggle(`is-on`,t.done);let s=t.phase===`compare`;if(O.classList.toggle(`is-on`,s),s){let e=(u(t.p1)+u(t.p2))/2;O.style.transform=`translate(${e}px, ${Gt}px)`}L(j,t.p1===null?f(n.length):u(t.p1),Ht-Jt),L(M,t.p2===null?f(r.length):u(t.p2),Ut-Jt),L(N,u(Math.min(t.taken.length,c-1)),279),Z(P,t.desc)}let z=ht({steps:a,controls:F,intervalMs:Qt,onRender:R});z.jumpTo(Math.trunc(t.initialStep)||0);let B=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return i&&!B&&typeof IntersectionObserver==`function`&&(I=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){I.disconnect(),I=null,z.play();return}},{threshold:.35}),I.observe(m)),{destroy(){I&&=(I.disconnect(),null),z.destroy(),e.textContent=``,delete e.dataset.mtlMounted,--$t,$t<=0&&(document.getElementById(Rt)?.remove(),mt())}}}var rn=e=>String.fromCharCode(65+e);function an(e){let t=(Array.isArray(e)?e:[]).map(e=>Array.isArray(e)?e.slice():[]),n=t.length,r=[],i=t.map(e=>e.length?0:null),a=[],o=[],s=(e,n)=>{let r=t[e.list][e.i],i=t[n.list][n.i];return r===i?e.list<n.list:r<i},c=e=>t[e.list][e.i],l=(e,t,n={})=>r.push({phase:e,desc:t,heap:o.map(e=>({...e})),cursors:i.slice(),taken:a.map(e=>({...e})),popped:null,pushed:null,moved:[],done:!1,...n});function u(e){let t=[];for(;e>0;){let n=e-1>>1;if(!s(o[e],o[n]))break;[o[e],o[n]]=[o[n],o[e]],t.push(e,n),e=n}return t}function d(e){let t=[];for(;;){let n=2*e+1,r=2*e+2,i=e;if(n<o.length&&s(o[n],o[i])&&(i=n),r<o.length&&s(o[r],o[i])&&(i=r),i===e)break;[o[e],o[i]]=[o[i],o[e]],t.push(e,i),e=i}return t}let f=[];for(let e=0;e<n;e+=1)i[e]!==null&&(o.push({list:e,i:0}),f=f.concat(u(o.length-1)));let p=t.filter(e=>e.length).length,m=t.reduce((e,t)=>e+t.length,0);if(o.length===0)return l(`init`,n===0?"`lists` 是个空数组，一条链表都没有，直接返回 ∅。":`${n} 条链表全是空的 —— 堆建起来是空的，直接返回 ∅。`,{moved:[],done:!0}),r;for(l(`init`,`把 ${p} 条链表的**头节点**放进小顶堆：${o.map(e=>`${rn(e.list)} 的 ${c(e)}`).join(`、`)}。注意**只放头部**，每条链表后面那些节点还在原地等 —— 堆里现在只有 ${o.length} 个元素，不是 ${m} 个。这是 O(N log K) 里那个 K 的来源。`,{moved:f});o.length;){let e=o[0],n=[],r=o.pop();o.length&&(o[0]=r,n.push(...d(0))),a.push({list:e.list,i:e.i});let s=e.list;i[s]=i[s]+1<t[s].length?i[s]+1:null;let f=null;i[s]!==null&&(f={list:s,i:i[s]},o.push(f),n.push(...u(o.length-1)));let p=f?`${rn(s)} 前移一格，新头 ${c(f)} 入堆，堆里还是 ${o.length} 个元素。`:`${rn(s)} 已经走完了，不再补位 —— 堆里只剩 ${o.length} 个元素。`;l(`take`,`堆顶是 ${c(e)}（来自 ${rn(s)}）。出堆 → 接到结果尾部 → ${p}`,{popped:{...e},pushed:f?{...f}:null,moved:n})}let h=a.map(e=>c(e)).join(` → `);return l(`done`,`堆空了，说明每个节点都被取走且只被取走了一次 —— 一共 ${a.length} 轮，每轮最多两次堆操作（出堆 + 入堆），每次 O(log K)，所以是 O(N log K)。结果链表是 ${h}；开头那个哑结点只是锚点，返回 \`dummy.next\`。`,{done:!0}),r}var on=`mkl-styles`,sn=52,cn=40,ln=74,un=58,dn=15,fn=26,pn=40,mn=22,hn=16,gn=66,_n=34,vn=36,yn=40,bn=28,xn=168,Sn=12,Cn=46,wn=22,Tn=56,En=180,Dn=1250,On=0,kn=[`l0`,`l1`,`l2`,`l3`,`l4`,`l5`],An=e=>`mkl-${kn[e%kn.length]}`,jn=`
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
`;function Mn(){if(pt(),document.getElementById(on))return;let e=document.createElement(`style`);e.id=on,e.textContent=jn,document.head.appendChild(e)}function Nn(e){let t=Math.floor(Math.log2(e+1));return{x:(e-(2**t-1)+.5)/2**t*xn,y:t*Cn}}function Pn(e,t={}){if(!e||e.dataset.mklMounted===`1`)return{destroy(){}};e.dataset.mklMounted=`1`,Mn(),On+=1;let n=Array.isArray(t.lists)&&t.lists.length?t.lists:[[1,4],[2,5],[3,6],[0,7]],r=t.autoplay!==!1,i=an(n),a=n.length,o=Math.max(1,a),s=n.reduce((e,t)=>Math.max(e,t.length),0),c=1+n.reduce((e,t)=>e+t.length,0),l=e=>un+e*ln,u=e=>l(e)+sn/2,d=e=>e<=0?un:un+(e-1)*ln+sn,f=e=>d(e)+fn,p=o*gn-(gn-cn),m=wn+(Math.floor(Math.log2(o))*Cn+bn),h=Math.max(p,m),g=_n+h+vn,_=g+cn+hn+20,v=f(s)+dn,y=v+Tn+En,b=f(c)+dn+12,x=Math.max(y+36,b),S=Math.round((x-y)/2),C=S+v+Tn,w=e=>C+Sn+Nn(e).x,T=e=>_n+Math.max(0,Math.round((h-m)/2))+wn+Nn(e).y,E=document.createElement(`div`);E.className=`viz mkl`;let D=document.createElement(`div`);D.className=`viz__stage`,E.appendChild(D);let O=X(`svg`,{class:`viz__svg mkl__svg`,viewBox:`0 0 ${x} ${_}`,role:`img`,"aria-label":`合并 ${a} 个升序链表的小顶堆推演动画`});D.appendChild(O);function k(e,t,n,r,i){let a=X(`g`,{class:i});return a.appendChild(X(`line`,{class:`mkl-edge__line`,x1:t,y1:r,x2:n-9,y2:r})),a.appendChild(X(`path`,{class:`mkl-edge__head`,d:`M ${n} ${r} L ${n-9} ${r-5.5} L ${n-9} ${r+5.5} Z`})),e.appendChild(a),a}function A(e,t,n){e.appendChild(X(`circle`,{class:`mkl-null__ring`,cx:t,cy:n,r:dn}));let r=X(`text`,{class:`mkl-null__text`,x:t,y:n});r.textContent=`∅`,e.appendChild(r)}function j(e,t,n,r,i){let a=X(`g`,{class:`mkl-node ${i}`});a.appendChild(X(`rect`,{class:`mkl-node__box`,x:n,y:r,width:sn,height:cn,rx:8}));let o=X(`text`,{class:`mkl-node__value`,x:n+sn/2,y:r+cn/2});return o.textContent=String(t),a.appendChild(o),e.appendChild(a),a}let M=n.map((e,t)=>{let n=_n+t*gn,r=n+cn/2,i=X(`g`,{class:`mkl-src ${An(t)}`}),a=X(`text`,{class:`mkl-row-label`,x:S+un/2-6,y:r});a.textContent=String.fromCharCode(65+t),i.appendChild(a);let o=e.map((e,t)=>j(i,e,S+un+t*ln,n,``));for(let t=0;t<e.length-1;t+=1)k(i,S+un+t*ln+sn,S+un+(t+1)*ln,r,``);return e.length>0&&k(i,S+d(e.length),S+f(e.length)-dn,r,``),A(i,S+f(e.length),r),O.appendChild(i),{g:i,labelEl:a,nodes:o,values:e}}),N=X(`g`,{class:`mkl-heap`});O.appendChild(N);let P=X(`text`,{class:`mkl-heap__caption`,x:C+Sn+xn/2,y:_n+Math.max(0,Math.round((h-m)/2))+wn/2});N.appendChild(P);let F=[];for(let e=1;e<o;e+=1){let t=e-1>>1,n=X(`g`,{class:`mkl-hedge`});n.appendChild(X(`line`,{class:`mkl-hedge__line`,x1:w(t),y1:T(t)+bn,x2:w(e),y2:T(e)})),N.appendChild(n),F.push({g:n,child:e})}let I=[];for(let e=0;e<o;e+=1){let t=X(`g`,{class:`mkl-hslot is-off`});t.appendChild(X(`rect`,{class:`mkl-hnode__box`,x:w(e)-yn/2,y:T(e),width:yn,height:bn,rx:7}));let n=X(`text`,{class:`mkl-hnode__value`,x:w(e),y:T(e)+bn/2});t.appendChild(n),N.appendChild(t),I.push({g:t,textEl:n})}let L=X(`text`,{class:`mkl-heap__root-tag`,x:w(0)+yn/2+24,y:T(0)+bn/2});L.textContent=`堆顶`,N.appendChild(L);let R=X(`g`,{class:`mkl-result`});O.appendChild(R);let z=g+cn/2,B=X(`text`,{class:`mkl-row-label`,x:26,y:z});B.textContent=`结果`,R.appendChild(B);let V=X(`g`,{class:`mkl-dummy`});V.appendChild(X(`rect`,{class:`mkl-dummy__box`,x:l(0),y:g,width:sn,height:cn,rx:8}));let H=X(`text`,{class:`mkl-dummy__text`,x:u(0),y:z});H.textContent=`dummy`,V.appendChild(H),R.appendChild(V);let ee=[];for(let e=1;e<c;e+=1)ee.push(k(R,l(e-1)+sn,l(e),z,`mkl-redge`));A(R,f(c),z);let te=k(R,d(c),f(c)-dn,z,`mkl-redge`),U=i[i.length-1].taken.map((e,t)=>j(R,n[e.list][e.i],l(t+1),g,`mkl-rslot ${An(e.list)}`)),W=X(`g`,{class:`mkl-chip mkl-chip--tail`});W.appendChild(X(`rect`,{class:`mkl-chip__box`,x:-40/2,y:-22/2,width:pn,height:mn}));let G=X(`text`,{class:`mkl-chip__text`,x:0,y:0});G.textContent=`tail`,W.appendChild(G),R.appendChild(W);let ne=document.createElement(`p`);ne.className=`viz__desc`,ne.setAttribute(`aria-live`,`polite`),E.appendChild(ne);let re=Q();E.appendChild(re.root),e.textContent=``,e.appendChild(E);let K=null;function ie(e,t){let r=t.heap.length,i=new Set(t.moved);M.forEach((e,n)=>{let r=t.cursors[n];e.g.classList.toggle(`is-dead`,r===null),e.labelEl.classList.toggle(`is-live`,r!==null),e.labelEl.classList.toggle(`is-dead`,r===null),e.nodes.forEach((e,t)=>{e.classList.toggle(`is-taken`,r===null||t<r),e.classList.toggle(`is-head`,r===t)})}),I.forEach((e,a)=>{if(a>=r){e.g.setAttribute(`class`,`mkl-hslot is-off`);return}let o=t.heap[a];e.textEl.textContent=String(n[o.list][o.i]),e.g.setAttribute(`class`,`mkl-hslot ${An(o.list)}${i.has(a)?` is-moved`:``}`+(a===0?` is-root`:``))}),F.forEach(e=>{e.g.style.display=e.child<r?``:`none`}),P.textContent=r===0?`堆：空了 —— 全部节点已取出`:`堆：只有 ${r} 个候选（每条链表当前的头部）`,L.classList.toggle(`is-off`,r===0);let a=t.phase===`take`?t.taken.length:1/0;U.forEach((e,n)=>{let r=n+1,i=r<=t.taken.length;e.classList.toggle(`is-filled`,i),e.classList.toggle(`is-new`,i&&r>=a)}),ee.forEach((e,n)=>e.classList.toggle(`is-on`,n+1<=t.taken.length)),te.classList.toggle(`is-on`,t.done);let o=Math.min(t.taken.length,c-1);W.style.transform=`translate(${u(o)}px, ${g+cn+hn}px)`,Z(ne,t.desc)}let ae=ht({steps:i,controls:re,intervalMs:Dn,onRender:ie});ae.jumpTo(Math.trunc(t.initialStep)||0);let oe=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!oe&&typeof IntersectionObserver==`function`&&(K=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){K.disconnect(),K=null,ae.play();return}},{threshold:.35}),K.observe(E)),{destroy(){K&&=(K.disconnect(),null),ae.destroy(),e.textContent=``,delete e.dataset.mklMounted,--On,On<=0&&(document.getElementById(on)?.remove(),mt())}}}function Fn(e,t){let n=[],r=0,i=0;for(;r<e.length&&i<t.length;)e[r]<=t[i]?(n.push(e[r]),r+=1):(n.push(t[i]),i+=1);for(;r<e.length;)n.push(e[r++]);for(;i<t.length;)n.push(t[i++]);return n}var In=e=>e.length?e.join(`、`):`∅`;function Ln(e){let t=(Array.isArray(e)?e:[]).map(e=>Array.isArray(e)?e.slice():[]),n=t.length,r=[],i=t.reduce((e,t)=>e+t.length,0),a=e=>e.map(e=>({lists:e.lists.map(e=>e.slice()),from:e.from?e.from.map(e=>[e[0],e[1]]):null}));if(n===0)return r.push({phase:`init`,desc:"`lists` 是个空数组，一条链表都没有，直接返回 ∅。",levels:[],activeLevel:-1,rounds:0,done:!0}),r;let o=[{lists:t.map(e=>e.slice()),from:null}];if(n===1)return r.push({phase:`init`,desc:`只有 1 条链表，**一次合并都不用做** —— 分治的轮数是 ⌈log₂1⌉ = 0，直接返回它自己（${In(t[0])}）。`,levels:a(o),activeLevel:0,rounds:0,done:!0}),r;r.push({phase:`init`,desc:`分治的起手：${n} 条链表一字排开，一共 ${i} 个节点。接下来每一轮**两两配对合并**，链表条数每次减半 —— ${n} → ${Math.ceil(n/2)} → … → 1，一共 ⌈log₂${n}⌉ = ${Math.ceil(Math.log2(n))} 轮。`,levels:a(o),activeLevel:0,rounds:0,done:!1});let s=t,c=0;for(;s.length>1;){let e=[],t=[];for(let n=0;n<s.length;n+=2)n+1<s.length?(e.push(Fn(s[n],s[n+1])),t.push([n,n+1])):(e.push(s[n].slice()),t.push([n,-1]));c+=1,o.push({lists:e,from:t});let n=s.length,i=e.length,l=t.reduce((e,[t,n])=>e+(n>=0?s[t].length+s[n].length:0),0),u=t.filter(e=>e[1]>=0).length,d=t.find(e=>e[1]<0);r.push({phase:`merge`,desc:`第 ${c} 轮：把 ${n} 条两两配对，做 ${u} 次「合并两个有序链表」，得到 ${i} 条。本轮被摸到的节点一共 ${l} 个，不超过 N —— 每轮都是 O(N) 的工作量。`+(d?`注意第 ${d[0]+1} 条这轮**轮空**了，原样进下一轮（不是丢掉）。`:`链表条数 ${n} → ${i}。`),levels:a(o),activeLevel:o.length-1,rounds:c,done:!1}),s=e}return r.push({phase:`done`,desc:`一共 ${c} 轮，每轮 O(N)，所以总时间是 **O(N log K)** —— 和最小堆同阶。结果链表是 ${In(s[0])}。分治的隐藏优势：它不需要堆，每一轮都是纯粹的指针比较，常数更小。`,levels:a(o),activeLevel:o.length-1,rounds:c,done:!0}),r}var Rn=`mkc-styles`,zn=44,Bn=36,Vn=18,Hn=38,Un=68,Wn=76,Gn=34,Kn=54,qn=30,Jn=1400,Yn=0,Xn=`
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
`;function Zn(){if(pt(),document.getElementById(Rn))return;let e=document.createElement(`style`);e.id=Rn,e.textContent=Xn,document.head.appendChild(e)}var Qn=e=>`mkc-lv${Math.min(e,4)}`;function $n(e,t={}){if(!e||e.dataset.mkcMounted===`1`)return{destroy(){}};e.dataset.mkcMounted=`1`,Zn(),Yn+=1;let n=Array.isArray(t.lists)&&t.lists.length?t.lists:[[7],[2],[5],[1],[8],[3],[6],[4]],r=t.autoplay!==!1,i=Ln(n),a=i[i.length-1].levels,o=a.map(e=>{let t=[],n=Un;for(let r of e.lists){let e=r.length?r.length*zn+(r.length-1)*Vn:qn;t.push({x:n,w:e,values:r}),n+=e+Hn}return{items:t,width:t.length?n-Hn:Un,top:Gn}});o.forEach((e,t)=>{e.top=Gn+t*Wn});let s=o.reduce((e,t)=>Math.max(e,t.width),Un)+Kn,c=Gn+(o.length-1)*Wn+Bn+26,l=(e,t)=>{let n=o[e].items[t];return n?n.x+n.w/2:Un},u=document.createElement(`div`);u.className=`viz mkc`;let d=document.createElement(`div`);d.className=`viz__stage`,u.appendChild(d);let f=X(`svg`,{class:`viz__svg mkc__svg`,viewBox:`0 0 ${s} ${c}`,role:`img`,"aria-label":`合并 ${n.length} 个升序链表的分治推演动画`});d.appendChild(f);let p=[];for(let e=1;e<o.length;e+=1)(a[e].from||[]).forEach((t,n)=>{let[r,i]=t,a=o[e-1].top+Bn,s=o[e].top,c=l(e,n),u=X(`g`,{class:`mkc-link ${Qn(e)}`});if(i<0)u.appendChild(X(`line`,{class:`mkc-link__line`,x1:l(e-1,r),y1:a,x2:c,y2:s}));else for(let t of[r,i]){let n=l(e-1,t);u.appendChild(X(`path`,{class:`mkc-link__line`,d:`M ${n} ${a} C ${n} ${a+22}, ${c} ${s-22}, ${c} ${s}`}))}f.appendChild(u),p.push({g:u,level:e})});let m=[];o.forEach((e,t)=>{let n=X(`g`,{class:`mkc-row ${Qn(t)}`}),r=e.top+Bn/2,i=X(`text`,{class:`mkc-row-label`,x:Un-16,y:r});i.textContent=t===0?`输入`:`第 ${t} 轮`,n.appendChild(i);let a=X(`text`,{class:`mkc-row-count`,x:e.width+14,y:r});a.textContent=`${e.items.length} 条`,n.appendChild(a);let o=[];e.items.forEach(t=>{if(!t.values.length){n.appendChild(X(`circle`,{class:`mkc-null__ring`,cx:t.x+qn/2,cy:r,r:11}));let e=X(`text`,{class:`mkc-null__text`,x:t.x+qn/2,y:r});e.textContent=`∅`,n.appendChild(e);return}t.values.forEach((i,a)=>{let s=t.x+a*62,c=X(`g`,{class:`mkc-node`});c.appendChild(X(`rect`,{class:`mkc-node__box`,x:s,y:e.top,width:zn,height:Bn,rx:7}));let l=X(`text`,{class:`mkc-node__value`,x:s+zn/2,y:r});l.textContent=String(i),c.appendChild(l),n.appendChild(c),o.push(c)})}),f.appendChild(n),m.push({g:n,nodes:o,countEl:a,level:t})});let h=document.createElement(`p`);h.className=`viz__desc`,h.setAttribute(`aria-live`,`polite`),u.appendChild(h);let g=Q();u.appendChild(g.root),e.textContent=``,e.appendChild(u);let _=null;function v(e,t){let n=t.levels.length;m.forEach(e=>{e.g.classList.toggle(`is-hidden`,e.level>=n),e.g.classList.toggle(`is-active`,e.level===t.activeLevel),e.nodes.forEach(n=>{n.classList.toggle(`is-new`,e.level===t.activeLevel&&t.phase!==`init`)}),e.level<n&&(e.countEl.textContent=`${t.levels[e.level].lists.length} 条`)}),p.forEach(e=>{e.g.classList.toggle(`is-hidden`,e.level>=n),e.g.classList.toggle(`is-on`,e.level===t.activeLevel)}),Z(h,t.desc)}let y=ht({steps:i,controls:g,intervalMs:Jn,onRender:v});y.jumpTo(Math.trunc(t.initialStep)||0);let b=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!b&&typeof IntersectionObserver==`function`&&(_=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){_.disconnect(),_=null,y.play();return}},{threshold:.35}),_.observe(u)),{destroy(){_&&=(_.disconnect(),null),y.destroy(),e.textContent=``,delete e.dataset.mkcMounted,--Yn,Yn<=0&&(document.getElementById(Rn)?.remove(),mt())}}}var er=[1,2,3,4,5,6,7,8,9,10,11,12,13],tr=4;function nr(e,t,n){return!Number.isInteger(e)||!Number.isInteger(t)||!Number.isInteger(n)||n<=0||e<t?null:(e-t)%n}function rr(e,t){let n=Math.abs(e),r=Math.abs(t);for(;r;)[n,r]=[r,n%r];return n}function ir(e={}){let t=Array.isArray(e.values)?e.values.slice():er.slice(),n=t.length,r=Number.isInteger(e.fastStep)&&e.fastStep>=1?e.fastStep:2,i=r-1,a=e.cycleStart===void 0?tr:e.cycleStart,o=Number.isInteger(a)&&a>=0&&a<n,s=o?a:null,c=o?n-s:0,l=o?{start:s,length:c}:null,u=[],d=(e,t,n={})=>u.push({phase:e,desc:t,slow:null,fast:null,gap:null,cycle:l?{...l}:null,fastStep:r,closing:i,steps:0,met:!1,done:!1,...n});if(n===0)return d(`end`,"链表是空的，连头节点都没有 —— 不存在环，返回 `false`。",{done:!0}),u;let f=e=>!Number.isInteger(e)||e>=n?null:e+1<n?e+1:o?s:null,p=e=>Number.isInteger(e)&&e>=0&&e<n?String(t[e]):`∅`,m=(e,t)=>{if(!o)return null;let n=nr(e,s,c),r=nr(t,s,c);return n===null||r===null?null:(n-r+c)%c},h=0,g=0,_=i<=0?`**两个指针速度一样，相对速度是 0** —— 它们会永远保持这个距离，不可能相遇。`:`快指针每步比慢指针多走 ${i} 格 —— 这个相对速度恒定不变，是后面一切的起点。`;if(d(`init`,`慢指针和快指针都站在头节点 ${p(0)}。快指针每步走 **${r} 格**、慢指针走 1 格，`+_,{slow:h,fast:g,steps:0}),i<=0)return d(`end`,`相对速度是 0，两指针永远同步前进，距离不会变 —— 不相遇。所以快指针**至少要走 2 步**，这是「一定相遇」的第一道门槛。`,{slow:h,fast:g,done:!0}),u;let v=2*n+8,y=`cap`;for(let e=1;e<=v;e+=1){let t=g;for(let e=0;e<r&&t!==null;e+=1)t=f(t);if(g=t,h=f(h),h===null&&g===null){y=`fell-off`;break}let n=m(h,g);if(h!==null&&h===g){let t=i===1?`相对速度是 1，所以「快指针沿环前进方向到慢指针的距离」每步**恰好减 1**；它是在模 ${c} 的意义下减 1 的，必然依次经过 ${c-1}、…、1、0 —— 所以**一定相遇**，慢指针进环后最多 ${c-1} 步。`:`相对速度是 ${i}，距离每步减 ${i}；它能减到 0，是因为慢指针进环那一刻的距离恰好是 gcd(${i}, ${c}) = ${rr(i,c)} 的倍数。`;return d(`met`,`两者在节点 ${p(h)} **相遇**。走了 ${e} 步，快指针比慢指针多走了 ${e*i} 格，正好是环长 ${c} 的整数倍 —— 这是相遇的代数原因。${t}`,{slow:h,fast:g,gap:n,steps:e,met:!0,done:!0}),u}if(g===null){y=`fell-off`;break}let a;a=n===null?o&&g>=s?`慢指针还在直段（第 ${h+1} 个节点），快指针已经进环了 —— 慢指针没进环之前，两者不可能相遇。`:`两者都还在直段，快指针只是领先慢指针 ${g-h} 格，距离还没有被环长约束住。`:`两者都在环上。快指针沿环前进方向到慢指针还差 **${n} 格**，比上一步少了 ${i} —— 只要相对速度是 1，这个数每步必然减 1。`,d(`move`,`慢指针到 ${p(h)}、快指针到 ${p(g)}。${a}`,{slow:h,fast:g,gap:n,steps:e})}return y===`fell-off`?(d(`end`,`快指针走到了链表末尾（\`fast\` 或 \`fast.next\` 是空）—— **这条链表没有环**，返回 \`false\`。一共走了 ${u.length} 步：没有环时快指针每步走 ${r} 格，最多 n / ${r} 步就出界，所以判环是 O(n) 时间、O(1) 空间。`,{slow:h,fast:g,done:!0}),u):(d(`end`,`走了 ${u.length} 步仍未相遇，已超过步数上限 ${v} —— 这是不该出现的情况，请检查输入（两指针同起点时，任何 fastStep ≥ 2 都必然相遇）。`,{slow:h,fast:g,gap:m(h,g),done:!0}),u)}var ar=`cyc-layout-styles`,or=20,sr=`
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
`;function cr(){if(document.getElementById(ar))return;let e=document.createElement(`style`);e.id=ar,e.textContent=sr,document.head.appendChild(e)}function lr(e){if(!Number.isInteger(e)||e<=1)return 80;let t=68/(2*Math.sin(Math.PI/e));return Math.max(80,Math.round(t))}function ur(e,t){return 180+360*e/t}function dr(e,t,n,r,i){let a=ur(e,t)*Math.PI/180;return{x:n+i*Math.cos(a),y:r+i*Math.sin(a)}}function fr(e,t,n=46,r=30){let i=Math.abs(e)<1e-6?1/0:n/2/Math.abs(e),a=Math.abs(t)<1e-6?1/0:r/2/Math.abs(t);return Math.min(i,a)}function pr(e,t,{head:n=8,dim:r=!1}={}){let i=t.x-e.x,a=t.y-e.y,o=Math.hypot(i,a)||1,s=i/o,c=a/o,l=fr(s,c),u=e.x+s*l,d=e.y+c*l,f=t.x-s*l,p=t.y-c*l,m=X(`g`,{class:r?`cyc-edge is-dim`:`cyc-edge`});m.appendChild(X(`line`,{class:`cyc-edge__line`,x1:u,y1:d,x2:f-s*n,y2:p-c*n}));let h=-c,g=s,_=5.5;return m.appendChild(X(`path`,{class:`cyc-edge__head`,d:`M ${f} ${p} L ${f-s*n+h*_} ${p-c*n+g*_} L ${f-s*n-h*_} ${p-c*n-g*_} Z`})),m}function mr(e,t,n,r,i=``){let a=X(`g`,{class:`cyc-node ${i}`.trim()});a.appendChild(X(`rect`,{class:`cyc-node__box`,x:n-46/2,y:r-30/2,width:46,height:30,rx:8}));let o=X(`text`,{class:`cyc-node__value`,x:n,y:r});return o.textContent=String(t),a.appendChild(o),e.appendChild(a),a}function hr(e,t,n){let r=X(`g`,{class:`cyc-null`});r.appendChild(X(`circle`,{class:`cyc-null__ring`,cx:t,cy:n,r:15}));let i=X(`text`,{class:`cyc-null__text`,x:t,y:n});return i.textContent=`∅`,r.appendChild(i),e.appendChild(r),r}function gr(e,t,n,r){let i=n>t?1:-1,a=X(`g`,{class:`cyc-edge`});return a.appendChild(X(`line`,{class:`cyc-edge__line`,x1:t,y1:r,x2:n-i*8,y2:r})),a.appendChild(X(`path`,{class:`cyc-edge__head`,d:`M ${n} ${r} L ${n-i*8} ${r-5.5} L ${n-i*8} ${r+5.5} Z`})),e.appendChild(a),a}function _r(e,t,n=0,r=15){if(!e)return null;let i;if(e.inRing&&e.index!==t.a){let n=e.cx-t.ringCenter.x,r=e.cy-t.ringCenter.y,a=Math.hypot(n,r)||1;i={x:n/a,y:r/a}}else i={x:0,y:1};let a={x:e.cx+i.x*30,y:e.cy+i.y*30};if(!n)return a;let o={x:-i.y,y:i.x};return{x:a.x+o.x*n*r,y:a.y+o.y*n*r}}function vr(e,{values:t,cycleStart:n}){let r=Array.isArray(t)?t:[],i=r.length,a=Number.isInteger(n)&&n>=0&&n<i,o=a?n:i,s=a?i-o:0,c=lr(s),l=c+30/2+52,u=24+(o>0?(o-1)*70+46+58:0),d=u+46/2+c,f=a?d+c+46/2+46:u+46/2+60,p=a?l+c+30/2+30+20/2+or:l+30/2+30+20/2+or,m=e=>e<o?{x:24+e*70+46/2,y:l}:dr(e-o,s,d,l,c),h=[];for(let e=0;e<i-1;e+=1)h.push(pr(m(e),m(e+1)));if(a)if(s===1){let e=m(o),t=X(`g`,{class:`cyc-edge`});t.appendChild(X(`path`,{class:`cyc-edge__line`,d:`M ${e.x} ${e.y-30/2} C ${e.x-30} ${e.y-30/2-34}, ${e.x+30} ${e.y-30/2-34}, ${e.x} ${e.y-30/2}`,fill:`none`})),t.appendChild(X(`path`,{class:`cyc-edge__head`,d:`M ${e.x} ${e.y-30/2} L ${e.x-7} ${e.y-30/2-13} L ${e.x+7} ${e.y-30/2-13} Z`})),h.push(t)}else h.push(pr(m(i-1),m(o)));for(let t of h)e.appendChild(t);let g=r.map((t,n)=>{let r=m(n);return{g:mr(e,t,r.x,r.y),cx:r.x,cy:r.y,index:n,inRing:a&&n>=o,ringK:a&&n>=o?n-o:-1}});if(a&&i>0){let t=m(o),n=X(`g`,{class:`cyc-entry`});n.appendChild(X(`rect`,{class:`cyc-entry__box`,x:t.x-46/2-5,y:t.y-30/2-5,width:56,height:40,rx:11}));let r=X(`text`,{class:`cyc-entry__tag`,x:t.x,y:t.y-30/2-16});r.textContent=`入口`,n.appendChild(r),e.appendChild(n)}let _=null;if(!a&&i>0){let t=m(i-1),n=t.x+46/2+30;gr(e,t.x+46/2,n-15,l),hr(e,n,l),_={x:n,y:l}}return{a:o,b:s,hasCycle:a,width:f,height:p,rowY:l,ringCenter:{x:d,y:l},radius:c,nullPos:_,nodes:g,ringKOf:e=>a&&e>=o?e-o:-1,at:e=>g[e]}}var yr=`cyd-styles`,br=42,xr=26,Sr=1150,Cr=`
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
`;function wr(){if(pt(),cr(),document.getElementById(yr))return;let e=document.createElement(`style`);e.id=yr,e.textContent=Cr,document.head.appendChild(e)}function Tr(e,t,n){let r=X(`g`,{class:`cyc-chip cyc-chip--${t}`});r.appendChild(X(`rect`,{class:`cyc-chip__box`,x:-26/2,y:-20/2,width:xr,height:20}));let i=X(`text`,{class:`cyc-chip__text`,x:0,y:0});return i.textContent=n,r.appendChild(i),e.appendChild(r),r}function Er(e,t={}){if(!e||e.dataset.cydMounted===`1`)return{destroy(){}};e.dataset.cydMounted=`1`,wr();let n=ir(t),r=n[0].cycle,i=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4,5,6,7,8,9,10,11,12,13],a=r?r.start:null,o=t.autoplay!==!1,s=document.createElement(`div`);s.className=`viz cyd`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=X(`svg`,{class:`viz__svg cyd__svg`,viewBox:`0 0 700 400`,role:`img`,"aria-label":`Floyd 判圈（龟兔赛跑）推演动画`});c.appendChild(l);let u=vr(l,{values:i,cycleStart:a});l.setAttribute(`viewBox`,`0 0 ${u.width} ${u.height}`),l.setAttribute(`width`,u.width),l.setAttribute(`height`,u.height);let d=X(`g`,{class:`cyd-arc is-off`}),f=X(`path`,{class:`cyd-arc__line`}),p=X(`path`,{class:`cyd-arc__head`}),m=X(`rect`,{class:`cyd-arc__tag-bg`,x:-30,y:-9,width:60,height:18,rx:6}),h=X(`text`,{class:`cyd-arc__tag`,x:0,y:0}),g=X(`g`,{class:`cyd-arc__tag-group`});g.append(m,h),d.append(f,p,g),l.appendChild(d);let _=Tr(l,`slow`,`慢`),v=Tr(l,`fast`,`快`);function y(e,t){return _r(u.at(e),u,t)}let b=(e,t)=>{if(!t){e.style.opacity=`0`;return}e.style.opacity=`1`,e.setAttribute(`transform`,`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)})`)},x=document.createElement(`p`);x.className=`viz__desc`,x.setAttribute(`aria-live`,`polite`),s.appendChild(x);let S=Q();s.appendChild(S.root),e.textContent=``,e.appendChild(s);let C=null;function w(e,t){let n=u.b,r=t.slow!==null&&t.slow===t.fast;u.nodes.forEach(e=>{let n=e.index===t.slow,r=e.index===t.fast;e.g.classList.toggle(`is-slow`,n&&!r),e.g.classList.toggle(`is-fast`,r&&!n),e.g.classList.toggle(`is-both`,n&&r)}),b(_,t.slow===null?null:y(t.slow,r?-1:0)),b(v,t.fast===null?null:y(t.fast,+!!r));let i=t.fast===null?-1:u.ringKOf(t.fast),a=t.slow===null?-1:u.ringKOf(t.slow),o=n>0&&i>=0&&a>=0&&t.gap!==null&&t.gap>0;if(d.classList.toggle(`is-off`,!o),o){let e=u.radius-br,r=(a-i+n)%n,o=ur(i,n),s=ur(i+r,n),c=s-o,l=t=>{let n=t*Math.PI/180;return{x:u.ringCenter.x+e*Math.cos(n),y:u.ringCenter.y+e*Math.sin(n)}},d=l(o),m=l(s),_=+(c>180);f.setAttribute(`d`,`M ${d.x.toFixed(1)} ${d.y.toFixed(1)} A ${e} ${e} 0 ${_} 1 ${m.x.toFixed(1)} ${m.y.toFixed(1)}`);let v=s*Math.PI/180,y=-Math.sin(v),b=Math.cos(v),x=-b,S=y;p.setAttribute(`d`,`M ${m.x} ${m.y} L ${m.x-y*9+x*5} ${m.y-b*9+S*5} L ${m.x-y*9-x*5} ${m.y-b*9-S*5} Z`);let C=(o+c/2)*Math.PI/180,w={x:u.ringCenter.x+e*Math.cos(C),y:u.ringCenter.y+e*Math.sin(C)};g.setAttribute(`transform`,`translate(${w.x.toFixed(1)} ${w.y.toFixed(1)})`),h.textContent=`${t.gap} 格`}Z(x,t.desc)}let T=ht({steps:n,controls:S,intervalMs:Sr,onRender:w});T.jumpTo(Math.trunc(t.initialStep)||0);let E=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return o&&!E&&typeof IntersectionObserver==`function`&&(C=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){C.disconnect(),C=null,T.play();return}},{threshold:.35}),C.observe(s)),{destroy(){C&&=(C.disconnect(),null),T.destroy(),e.textContent=``,delete e.dataset.cydMounted,document.getElementById(yr)?.remove()}}}var Dr=[1,2,3,4,5,6,7,8,9,10,11,12,13],Or=4;function kr(e={}){let t=Array.isArray(e.values)?e.values.slice():Dr.slice(),n=t.length,r=e.cycleStart===void 0?Or:e.cycleStart,i=[],a=(e,t,n={})=>i.push({phase:e,desc:t,ptr1:null,ptr2:null,walked:0,remain1:0,remain2:0,passed2:!1,entry:null,meetAt:null,a:0,b:0,x:0,m:0,done:!1,...n});if(n===0)return a(`none`,"链表是空的，没有环，返回 `null`。",{done:!0}),i;let o=ir({values:t,cycleStart:r}),s=o[o.length-1];if(!s.met)return a(`none`,"这条链表没有环（快指针已经走到末尾），所以 LC 142 直接返回 `null` —— 入口根本不存在。",{done:!0}),i;let c=s.cycle.start,l=s.cycle.length,u=s.slow,d=(u-c)%l,f=c+d,p=f/l,m=l-d,h=e=>Number.isInteger(e)&&e>=0&&e<n?String(t[e]):`∅`,g=e=>!Number.isInteger(e)||e>=n?null:e+1<n?e+1:c,_=c===m?`这里 a 恰好等于 b - x，所以两个指针会**同步**抵达入口。`:`注意 a = ${c} 而 b - x = ${m}，后者更小 —— ptr2 会先路过入口、绕回来之后才和 ptr1 碰上。同余式只管「差整数圈」，不管谁先到。`;if(a(`meet`,`第一阶段的终点：慢指针和快指针在节点 ${h(u)} 相遇。设入口是 ${h(c)}、直段长 \`a = ${c}\`、环长 \`b = ${l}\`、相遇点距入口 \`x = ${d}\`，那么 \`a + x = ${f} = ${p} × b\`，也就是 \`a ≡ b - x (mod b)\`。现在**把 ptr1 放回 head、ptr2 留在相遇点，两者都改成每步走 1 格**：ptr1 要走到入口差 **${c} 步**，ptr2 沿环走到入口差 **${m} 步**。${_}`,{ptr1:0,ptr2:u,walked:0,remain1:c,remain2:m,entry:c,meetAt:u,a:c,b:l,x:d,m:p}),c===0)return a(`found`,`**入口就是头节点 ${h(0)}。** 这里 a = 0，头节点本身就在环上 —— ptr1 一步都不用走，而相遇点也正好是入口（x = 0），所以两个指针一开始就重合。LC 142 返回这个节点。`,{ptr1:0,ptr2:u,walked:0,remain1:0,remain2:0,entry:0,meetAt:u,a:c,b:l,x:d,m:p,done:!0}),i;let v=0,y=u;for(let e=1;e<=c;e+=1){v=g(v),y=g(y);let t=c-e,n=m-e,r=n<0,o=r?(n%l+l)%l:n;if(v===y)return a(`found`,`**两个指针在节点 ${h(v)} 相遇 —— 这就是环的入口。** 从 head 走了 ${e} 步，从相遇点也走了 ${e} 步。回到那条同余式：a = ${c} 步到入口、b - x = ${m} 步也到入口，两者相差 ${p>1?`${p} 圈`:`零圈`}，所以它们必然在入口碰头。LC 142 返回这个节点。`,{ptr1:v,ptr2:y,walked:e,remain1:t,remain2:o,passed2:r,entry:c,meetAt:u,a:c,b:l,x:d,m:p,done:!0}),i;a(`walk`,`走了 ${e} 步。ptr1 到 ${h(v)}（离入口还差 **${t} 步**）、ptr2 到 ${h(y)}（离入口还差 **${o} 步**）。`+(r?`注意 ptr2 已经**越过**了入口，它要再绕一圈回来 —— 但同余式保证它绕回入口的那一刻，ptr1 也正好走到。`:`两个剩余步数**同步递减**，这是「两条路一样长」的直接体现。`),{ptr1:v,ptr2:y,walked:e,remain1:t,remain2:o,passed2:r,entry:c,meetAt:u,a:c,b:l,x:d,m:p})}return a(`found`,`走了 ${c} 步仍未同时落在入口，这不该发生 —— 请检查输入。`,{ptr1:v,ptr2:y,walked:c,entry:c,meetAt:u,a:c,b:l,x:d,m:p,done:!0}),i}var Ar=`cye-styles`,jr=42,Mr=56,Nr=32,Pr=17,Fr=1250,Ir=`
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
`;function Lr(){if(pt(),cr(),document.getElementById(Ar))return;let e=document.createElement(`style`);e.id=Ar,e.textContent=Ir,document.head.appendChild(e)}function Rr(e,t,n){let r=X(`g`,{class:`cyc-chip cyc-chip--${t}`});r.appendChild(X(`rect`,{class:`cyc-chip__box`,x:-32/2,y:-20/2,width:Nr,height:20}));let i=X(`text`,{class:`cyc-chip__text`,x:0,y:0});return i.textContent=n,r.appendChild(i),e.appendChild(r),r}function zr(e,t){let n=X(`g`,{class:`cye-tag-group cye-tag-group--${t}`}),r=X(`rect`,{class:`cye-tag-bg`,x:-38,y:-10,width:76,height:20,rx:6}),i=X(`text`,{class:`cye-tag cye-tag--${t}`,x:0,y:0});return n.append(r,i),e.appendChild(n),{g:n,t:i,bg:r}}function Br(e,t={}){if(!e||e.dataset.cyeMounted===`1`)return{destroy(){}};e.dataset.cyeMounted=`1`,Lr();let n=kr(t),r=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4,5,6,7,8,9,10,11,12,13],i=n[0],a=Number.isInteger(i.a)&&i.b>0?i.a:null,o=t.autoplay!==!1,s=document.createElement(`div`);s.className=`viz cye`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=X(`svg`,{class:`viz__svg cye__svg`,viewBox:`0 0 700 400`,role:`img`,"aria-label":`环形链表找入口推演动画`});c.appendChild(l);let u=vr(l,{values:r,cycleStart:a});l.setAttribute(`viewBox`,`0 0 ${u.width} ${u.height}`),l.setAttribute(`width`,u.width),l.setAttribute(`height`,u.height);let d=u.at(u.a),f=null;if(Number.isInteger(i.meetAt)&&u.at(i.meetAt)){let e=u.at(i.meetAt),t=X(`g`,{class:`cye-meet`});t.appendChild(X(`rect`,{class:`cye-meet__box`,x:e.cx-46/2-6,y:e.cy-30/2-6,width:58,height:42,rx:12})),l.appendChild(t),f=t}let p=X(`g`,{class:`cye-bar`}),m=X(`path`,{class:`cye-bar__line`}),h=X(`path`,{class:`cye-bar__tick`}),g=X(`path`,{class:`cye-bar__tick`});p.append(m,h,g),l.appendChild(p);let _=zr(l,`p1`),v=X(`g`,{class:`cye-arc`}),y=X(`path`,{class:`cye-arc__line`}),b=X(`path`,{class:`cye-arc__head`});v.append(y,b),l.appendChild(v);let x=zr(l,`p2`),S=Rr(l,`p1`,`P1`),C=Rr(l,`p2`,`P2`);function w(e,t){return _r(u.at(e),u,t,Pr)}let T=(e,t)=>{if(!t){e.style.opacity=`0`;return}e.style.opacity=`1`,e.setAttribute(`transform`,`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)})`)},E=document.createElement(`p`);E.className=`viz__desc`,E.setAttribute(`aria-live`,`polite`),s.appendChild(E);let D=Q();s.appendChild(D.root),e.textContent=``,e.appendChild(s);let O=null;function k(e,t){let n=u.b,r=t.ptr1!==null&&t.ptr1===t.ptr2;u.nodes.forEach(e=>{let n=e.index===t.ptr1,r=e.index===t.ptr2;e.g.classList.toggle(`is-slow`,n&&!r),e.g.classList.toggle(`is-fast`,r&&!n),e.g.classList.toggle(`is-both`,n&&r)}),T(S,t.ptr1===null?null:w(t.ptr1,r?-1:0)),T(C,t.ptr2===null?null:w(t.ptr2,+!!r)),f&&(f.style.opacity=t.phase===`found`?`0.45`:`1`);let i=t.ptr1===null?null:u.at(t.ptr1),a=!!i&&t.remain1>0&&!!d;if(p.classList.toggle(`is-off`,!a),_.g.style.opacity=a?`1`:`0`,a){let e=u.rowY+Mr,n=i.cx,r=d.cx;m.setAttribute(`d`,`M ${n} ${e} L ${r} ${e}`),h.setAttribute(`d`,`M ${n} ${e-6} L ${n} ${e+6}`),g.setAttribute(`d`,`M ${r} ${e-6} L ${r} ${e+6}`),_.g.setAttribute(`transform`,`translate(${((n+r)/2).toFixed(1)} ${e})`),_.t.textContent=`还差 ${t.remain1} 步`}let o=t.ptr2===null?-1:u.ringKOf(t.ptr2),s=n>0&&o>=0&&t.remain2>0&&!t.passed2;if(v.classList.toggle(`is-off`,!s),x.g.style.opacity=s?`1`:`0`,s){let e=u.radius-jr,r=ur(o,n),i=ur(o+t.remain2,n),a=i-r,s=t=>{let n=t*Math.PI/180;return{x:u.ringCenter.x+e*Math.cos(n),y:u.ringCenter.y+e*Math.sin(n)}},c=s(r),l=s(i);y.setAttribute(`d`,`M ${c.x.toFixed(1)} ${c.y.toFixed(1)} A ${e} ${e} 0 ${+(a>180)} 1 ${l.x.toFixed(1)} ${l.y.toFixed(1)}`);let d=i*Math.PI/180,f=-Math.sin(d),p=Math.cos(d);b.setAttribute(`d`,`M ${l.x} ${l.y} L ${l.x-f*9-p*5} ${l.y-p*9+f*5} L ${l.x-f*9+p*5} ${l.y-p*9-f*5} Z`);let m=(r+a/2)*Math.PI/180;x.g.setAttribute(`transform`,`translate(${(u.ringCenter.x+e*Math.cos(m)).toFixed(1)} ${(u.ringCenter.y+e*Math.sin(m)).toFixed(1)})`),x.t.textContent=`还差 ${t.remain2} 步`}Z(E,t.desc)}let A=ht({steps:n,controls:D,intervalMs:Fr,onRender:k});A.jumpTo(Math.trunc(t.initialStep)||0);let j=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return o&&!j&&typeof IntersectionObserver==`function`&&(O=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){O.disconnect(),O=null,A.play();return}},{threshold:.35}),O.observe(s)),{destroy(){O&&=(O.disconnect(),null),A.destroy(),e.textContent=``,delete e.dataset.cyeMounted,document.getElementById(Ar)?.remove()}}}function Vr(e,t){let n=e.length,r=Array.from({length:n+1},(e,t)=>t+1<=n?t+1:null),i=[],a=t=>t===null?`∅`:t===0?`dummy`:String(e[t-1]),o=(e,a,o={})=>i.push({phase:e,desc:a,fast:0,slow:0,gap:null,links:[...r],cutSlot:null,leadTotal:t+1,syncTotal:Math.max(0,n-t),done:!1,...o});if(n===0)return o(`init`,"空链表：没有可删的节点，返回 `∅` 即可。"),i[0].done=!0,i;o(`init`,"先接一个哑结点 `dummy`，`fast` 和 `slow` 都从它出发。有它在，「删头节点」就不再需要特判。");let s=0;for(let e=1;e<=t+1;e+=1){s=r[s];let n=s-0;o(`lead`,e===1?`① \`fast\` 先走：第 1 / ${t+1} 步，指向 ${a(s)}。约定是先走 **n+1 = ${t+1}** 步 —— 要定位的是待删节点的**前驱**，所以多退这一步。`:s===null?`① \`fast\` 第 ${e} / ${t+1} 步落到了 ∅ —— \`n\` 正好等于链长，要删的就是**头节点**。同步阶段将一步不走，\`slow\` 会留在 \`dummy\` 上。`:`① \`fast\` 继续走：第 ${e} / ${t+1} 步，指向 ${a(s)}。`+(e===t+1?`间隔锁死为 **n+1 = ${t+1}**， \`slow\` 从现在起一步不会再被落下。`:`\`slow\` 原地不动，间隔拉开到 ${n}。`),{fast:s,gap:s===null?null:n})}let c=0,l=0;for(;s!==null;){s=r[s],c=r[c],l+=1;let e=s===null;o(`sync`,e?`② \`fast\` 撞到了 ∅，停下。\`slow\` 停在 ${a(c)} —— 正是**倒数第 n+1 个**节点，待删节点 ${a(c+1)} 的**前驱**。`:`② 两个指针一起走（第 ${l} / ${n-t} 步）：\`fast\` 在 ${a(s)}，\`slow\` 在 ${a(c)}。间隔保持 ${s-c} 不变 —— 这就是循环不变量。`,{fast:s,slow:c,gap:e?null:s-c})}let u=c+1;return r[c]=r[u],o(`cut`,`③ \`slow.next = slow.next.next\`：${a(c)} 的箭头跨过 ${a(u)}，直接指向 ${a(r[c])}。节点 ${a(u)} 被摘掉 —— 注意它还在内存里，只是没人再引用它。`,{slow:c,cutSlot:u}),o(`done`,`④ 返回 \`dummy.next\`（**不是 head**——如果删的是头节点，head 已经不在链上了）。得到 ${e.filter((e,t)=>t!==u-1).map(String).join(` → `)}。全程只扫了**一趟**。`,{slow:c,cutSlot:u}),i[i.length-1].done=!0,i}var Hr=`rnth-styles`,Ur=64,Wr=50,Gr=42,Kr=48,qr=88,Jr=113,Yr=40,Xr=196,Zr=236,Qr=56,$r=26,ei=272,ti=26,ni=1150,ri=`
.rnth {
  --rnth-fast: var(--accent-secondary, #a45f45);
  --rnth-slow: var(--accent, #3f6b57);
  --rnth-edge: var(--text-secondary, #657168);
  --rnth-cut: #b3452e;
}
html.theme-dark .rnth {
  --rnth-fast: #e0a06a;
  --rnth-slow: #7fc3a4;
  --rnth-cut: #e07a5f;
}
.rnth__svg { min-width: 520px; }

.rnth-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.26s ease, fill 0.26s ease, opacity 0.26s ease;
}
.rnth-node--dummy .rnth-node__box { stroke-dasharray: 5 3; }
.rnth-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 19px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rnth-node--dummy .rnth-node__value { font-size: 14px; fill: var(--text-secondary, #657168); }
/* 被删节点：变灰、虚线、半透明 */
.rnth-node.is-cut .rnth-node__box {
  stroke: var(--text-secondary, #657168);
  stroke-dasharray: 5 3;
  opacity: 0.55;
}
.rnth-node.is-cut .rnth-node__value { opacity: 0.45; text-decoration: line-through; }

.rnth-edge { opacity: 0; transition: opacity 0.26s ease; }
.rnth-edge.is-on { opacity: 1; }
.rnth-edge__line { stroke: var(--rnth-edge); stroke-width: 1.8; stroke-linecap: round; }
.rnth-edge__head { fill: var(--rnth-edge); }

.rnth-arc { opacity: 0; transition: opacity 0.26s ease; }
.rnth-arc.is-on { opacity: 1; }
.rnth-arc__line {
  fill: none;
  stroke: var(--rnth-cut);
  stroke-width: 2.2;
  stroke-linecap: round;
}
.rnth-arc__head { fill: var(--rnth-cut); }

.rnth-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 3 3;
}
.rnth-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  text-anchor: middle;
  dominant-baseline: central;
}

/* 间隔标注线：双向箭头 + 中央标签 */
.rnth-gapline { opacity: 0; transition: opacity 0.26s ease; }
.rnth-gapline.is-on { opacity: 1; }
.rnth-gapline__line {
  stroke: var(--rnth-fast);
  stroke-width: 1.6;
  stroke-dasharray: 5 3;
}
.rnth-gapline__head { fill: var(--rnth-fast); }
.rnth-gapline__tag-bg { fill: var(--surface-muted, #ecefe8); }
.rnth-gapline__tag {
  fill: var(--rnth-fast);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rnth-tick {
  stroke: var(--text-secondary, #657168);
  stroke-width: 1;
  stroke-dasharray: 3 3;
  opacity: 0;
}
.rnth-chip { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; }
.rnth-chip__box { rx: 13; ry: 13; }
.rnth-chip__text {
  font-size: 12.5px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rnth-chip--fast .rnth-chip__box { fill: var(--rnth-fast); }
.rnth-chip--fast .rnth-chip__text { fill: #fff; }
.rnth-chip--slow .rnth-chip__box { fill: var(--rnth-slow); }
.rnth-chip--slow .rnth-chip__text { fill: #fff; }
@media (prefers-reduced-motion: reduce) {
  .rnth-chip, .rnth-edge, .rnth-arc, .rnth-gapline, .rnth-node__box { transition: none; }
}
`;function ii(){if(pt(),document.getElementById(Hr))return;let e=document.createElement(`style`);e.id=Hr,e.textContent=ri,document.head.appendChild(e)}function ai(e,t={}){if(!e||e.dataset.rnthMounted===`1`)return{destroy(){}};e.dataset.rnthMounted=`1`,ii();let n=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4,5],r=Math.min(Math.max(Math.trunc(t.n)||2,1),n.length),i=t.autoplay!==!1,a=Vr(n,r),o=n.length,s=o+1,c=2*Kr+s*Ur+(s-1)*Gr,l=e=>Kr+e*106,u=e=>l(e)+Ur/2,d=c-ti,f=document.createElement(`div`);f.className=`viz rnth`;let p=document.createElement(`div`);p.className=`viz__stage`,f.appendChild(p);let m=X(`svg`,{class:`viz__svg rnth__svg`,viewBox:`0 0 ${c} ${ei}`,role:`img`,"aria-label":`删除倒数第 ${r} 个节点推演动画：${n.join(` → `)}`});p.appendChild(m),m.appendChild(X(`circle`,{class:`rnth-null__ring`,cx:d,cy:Jr,r:15}));let h=X(`text`,{class:`rnth-null__text`,x:d,y:Jr});h.textContent=`∅`,m.appendChild(h);let g=X(`line`,{class:`rnth-tick`}),_=X(`line`,{class:`rnth-tick`});m.append(g,_);let v=[];for(let e=0;e<o;e+=1){let t=dt(l(e)+Ur,l(e+1),Jr,1,`rnth-edge`);m.appendChild(t),v.push(t)}let y=dt(l(o)+Ur,d-15,Jr,1,`rnth-edge`);m.appendChild(y);let b=X(`path`,{class:`rnth-arc__line`}),x=X(`path`,{class:`rnth-arc__head`}),S=X(`g`,{class:`rnth-arc`});S.append(b,x),m.appendChild(S);let C=[];for(let e=0;e<s;e+=1){let t=X(`g`,{class:`rnth-node${e===0?` rnth-node--dummy`:``}`});t.appendChild(X(`rect`,{class:`rnth-node__box`,x:l(e),y:qr,width:Ur,height:Wr,rx:9}));let r=X(`text`,{class:`rnth-node__value`,x:u(e),y:Jr});r.textContent=e===0?`dummy`:String(n[e-1]),t.appendChild(r),m.appendChild(t),C.push(t)}let w=X(`g`,{class:`rnth-gapline`}),T=X(`line`,{class:`rnth-gapline__line`}),E=X(`path`,{class:`rnth-gapline__head`}),D=X(`path`,{class:`rnth-gapline__head`}),O=X(`rect`,{class:`rnth-gapline__tag-bg`,x:-26,y:-9,width:52,height:18,rx:6}),k=X(`text`,{class:`rnth-gapline__tag`,x:0,y:0});w.append(T,E,D,O,k),m.appendChild(w);function A(e,t){let n=X(`g`,{class:`rnth-chip rnth-chip--${e}`});n.appendChild(X(`rect`,{class:`rnth-chip__box`,x:-56/2,y:-26/2,width:Qr,height:$r}));let r=X(`text`,{class:`rnth-chip__text`,x:0,y:0});return r.textContent=t,n}let j=A(`fast`,`fast`),M=A(`slow`,`slow`);m.append(j,M);let N=document.createElement(`p`);N.className=`viz__desc`,N.setAttribute(`aria-live`,`polite`),f.appendChild(N);let P=Q();f.appendChild(P.root),e.textContent=``,e.appendChild(f);let F=null,I=e=>e===null?d:u(e);function L(e,t,n,r){let i=I(n);e.style.transform=`translate(${i}px, ${r}px)`,e.style.opacity=`1`,t.setAttribute(`x1`,i),t.setAttribute(`x2`,i),t.setAttribute(`y1`,r-$r/2),t.setAttribute(`y2`,138),t.style.opacity=`0.65`}function R(e){let t=e.cutSlot;if(t===null||e.links[t-1]!==t+1){S.classList.remove(`is-on`);return}let n=l(t-1)+Ur,r=l(t+1),i=Jr,a=Jr,o=n+(r-n)*.3,s=n+(r-n)*.7;b.setAttribute(`d`,`M ${n} ${i} C ${o} ${i-44}, ${s} ${a-44}, ${r-8} ${a}`),x.setAttribute(`d`,`M ${r} ${a} L ${r-9} ${a-5.5} L ${r-9} 118.5 Z`),S.classList.add(`is-on`)}function z(e){let t=e.gap!==null&&e.gap>0&&e.fast!==null;if(w.classList.toggle(`is-on`,t),!t)return;let n=u(e.slow),r=u(e.fast);T.setAttribute(`x1`,n),T.setAttribute(`x2`,r),T.setAttribute(`y1`,Yr),T.setAttribute(`y2`,Yr),E.setAttribute(`d`,`M ${n} ${Yr} L ${n+7} ${Yr-4.5} L ${n+7} 44.5 Z`),D.setAttribute(`d`,`M ${r} ${Yr} L ${r-7} ${Yr-4.5} L ${r-7} 44.5 Z`),O.setAttribute(`x`,(n+r)/2-26),O.setAttribute(`y`,Yr-9),k.setAttribute(`x`,(n+r)/2),k.setAttribute(`y`,Yr),k.textContent=`间隔 ${e.gap}`}function B(e,t){for(let e=0;e<s;e+=1)C[e].classList.toggle(`is-cut`,t.cutSlot!==null&&e===t.cutSlot);for(let e=0;e<o;e+=1)v[e].classList.toggle(`is-on`,t.links[e]===e+1);y.classList.toggle(`is-on`,t.links[o]===null),R(t),z(t),t.fast===null?(j.style.transform=`translate(${d}px, ${Xr}px)`,j.style.opacity=`1`,g.style.opacity=`0`):L(j,g,t.fast,Xr),L(M,_,t.slow,Zr),Z(N,t.desc)}let V=ht({steps:a,controls:P,intervalMs:ni,onRender:B});V.jumpTo(Math.trunc(t.initialStep)||0);let H=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return i&&!H&&typeof IntersectionObserver==`function`&&(F=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){F.disconnect(),F=null,V.play();return}},{threshold:.35}),F.observe(f)),{destroy(){F&&=(F.disconnect(),null),V.destroy(),e.textContent=``,delete e.dataset.rnthMounted,document.getElementById(Hr)?.remove()}}}function oi(e){if(e<=0)return null;let t=0,n=1;for(;n<e&&n+1<e;)t+=1,n+=2;return t}function si(e,t){let n=[],r=e,i=new Set;for(;r!=null&&!i.has(r);)i.add(r),n.push(r),r=t[r];return n}function ci(e){let t=e.length,n=[];for(let r=0;r<Math.floor(t/2);r+=1)n.push(e[r],e[t-1-r]);return t%2==1&&n.push(e[Math.floor(t/2)]),n}function li(e){let t=e.length,n=Array.from({length:t},(e,n)=>n+1<t?n+1:null),r=t=>t===null?`∅`:String(e[t]),i=[],a=(e,t,r={})=>i.push({phase:e,stage:0,desc:t,links:[...n],merged:[],front:[],back:[],chips:[],cutEdge:null,done:!1,...r}),o=(e,t)=>si(e,n).filter(e=>!t.includes(e));if(t<=1)return a(`init`,t===0?`空链表，没什么可重排的。`:`只有一个节点，重排之后还是它自己 —— 直接返回。`,{front:si(0,n)}),i[0].done=!0,i;a(`init`,`目标：前半段顺序不变，后半段倒过来插进缝隙 —— 也就是要把 ${e.join(` → `)} 变成 ${ci(e).join(` → `)}。全程只改指针，一个值都不动。`,{front:si(0,n)});let s=oi(t),c=0,l=1,u=0;for(;l<t&&l+1<t;)c+=1,l+=2,u+=1,a(`mid`,`① 快慢指针找中点（第 ${u} 步）：\`fast\` 一次跨两格到 ${r(l<t?l:null)}，\`slow\` 一次挪一格到 ${r(c)}。`+(c===s?` \`fast\` 走不动了 —— \`slow\` 停在 **${r(c)}**，正是前半段的最后一个节点。`:``),{stage:1,front:si(0,n),chips:[{kind:`slow`,label:`slow`,slot:c},{kind:`fast`,label:`fast`,slot:l<t?l:null}]});let d=s+1;n[s]=null,a(`split`,`② **\`slow.next = None\`** —— 断开。这一步看着多余，其实是防环的命门：前半段的尾巴要是还搭在后半段上，第 ③ 步合并时指针会绕成环，链表再也走不到头。现在前段是 ${e.slice(0,s+1).map(String).join(` → `)}，后段是 ${e.slice(d).map(String).join(` → `)}。`,{stage:2,front:si(0,n),back:si(d,n),cutEdge:[s,d]});let f=null,p=d;for(;p!==null;){let e=n[p];n[p]=f;let t=p;f=p,p=e,a(`rev`,p===null?`反转最后一步：\`${r(t)}.next\` 指向 ${r(n[t])}，后半段变成 ${si(f,n).map(r).join(` → `)}。这是 LC 206 的逐字复刻，只是起点换成了 \`second\`。`:`反转后半段：\`${r(t)}.next\` 掉头指向 ${r(n[t])}，\`prev\` 前移到 ${r(f)}，\`curr\` 前移到 ${r(p)}。`,{stage:2,front:si(0,n),back:si(f,n).concat(si(p,n)),chips:[{kind:`prev`,label:`prev`,slot:f},{kind:`curr`,label:`curr`,slot:p}]})}let m=0,h=f,g=[];for(;h!==null;){let e=n[m],t=n[h];n[m]=h,g.push(m,h),a(`merge`,`③ \`first.next = second\`：\`${r(m)}\` 的箭头改指向 ${r(h)}，把后半段的头节点拽了上来。\`t1\`(\`${r(e)}\`) 和 \`t2\`(\`${r(t)}\`) 提前记住了两条链的下家 —— 改指针之前先把路记住，和反转链表里那个 \`nxt\` 是同一个道理。`,{stage:3,merged:[...g],front:o(e,g),back:o(t,g),chips:[{kind:`first`,label:`first`,slot:m},{kind:`second`,label:`second`,slot:h}]}),n[h]=e,a(`merge`,t===null?`③ \`second.next = t1\`：\`${r(h)}\` 接回 ${r(e)}。后半段用完了（\`second\` 变成 ∅），循环结束 —— 条件写的是 \`while second\`，因为后半段更短。`:`③ \`second.next = t1\`：\`${r(h)}\` 接回 ${r(e)}。两个指针各自前移：\`first\` → ${r(e)}，\`second\` → ${r(t)}。`,{stage:3,merged:[...g],front:o(e,g),back:o(t,g),chips:[{kind:`first`,label:`first`,slot:e},{kind:`second`,label:`second`,slot:t}]}),m=e,h=t}let _=si(0,n);return a(`done`,`重排完成：${_.map(r).join(` → `)}。**头节点还是原来的 ${r(0)}** —— 所以这题不需要返回新头，Java 的签名就是 \`void\`。`,{stage:3,merged:_}),i[i.length-1].done=!0,i}var ui=`rord-styles`,di=64,fi=48,pi=44,mi=44,hi=118,gi=218,_i=-26,vi=44,yi=58,bi=26,xi=62,Si=1250,Ci=[`① 找中点`,`② 断开并反转`,`③ 交替合并`],wi=`
.rord {
  --rord-node: var(--text-primary, #1f2a24);
  --rord-edge: var(--text-secondary, #657168);
  --rord-a: var(--accent, #3f6b57);
  --rord-b: var(--accent-secondary, #a45f45);
  --rord-done: var(--accent, #3f6b57);
}
html.theme-dark .rord {
  --rord-b: #e0a06a;
  --rord-a: #7fc3a4;
}
.rord__svg { min-width: 520px; }

.rord-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.24s ease;
}
.rord-node__value {
  fill: var(--rord-node);
  font-size: 18px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rord-node.is-merged .rord-node__box { stroke: var(--rord-done); stroke-width: 2; }

/* 节点整体位移：重排的"动感"全靠它 */
.rord-node { transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1); }

.rord-edge__line { stroke: var(--rord-edge); stroke-width: 1.8; stroke-linecap: round; fill: none; }
.rord-edge__head { fill: var(--rord-edge); }
.rord-edge--merged .rord-edge__line { stroke: var(--rord-done); }
.rord-edge--merged .rord-edge__head { fill: var(--rord-done); }
.rord-edge--cut .rord-edge__line {
  stroke: var(--rord-edge);
  stroke-dasharray: 4 4;
  opacity: 0.45;
}

.rord-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 3 3;
}
.rord-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  text-anchor: middle;
  dominant-baseline: central;
}

/* 顶部阶段条 */
.rord-stage__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.2;
  transition: fill 0.24s ease, stroke 0.24s ease;
}
.rord-stage__text {
  fill: var(--text-secondary, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  transition: fill 0.24s ease;
}
.rord-stage.is-on .rord-stage__box { fill: var(--rord-done); stroke: var(--rord-done); }
.rord-stage.is-on .rord-stage__text { fill: #fff; }

.rord-chip { transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; }
.rord-chip__box { rx: 13; ry: 13; }
.rord-chip__text {
  font-size: 12.5px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rord-chip--slow .rord-chip__box,
.rord-chip--prev .rord-chip__box,
.rord-chip--first .rord-chip__box { fill: var(--rord-a); }
.rord-chip--fast .rord-chip__box,
.rord-chip--curr .rord-chip__box,
.rord-chip--second .rord-chip__box { fill: var(--rord-b); }
.rord-chip__text { fill: #fff; }
@media (prefers-reduced-motion: reduce) {
  .rord-node, .rord-chip, .rord-stage__box, .rord-node__box { transition: none; }
}
`;function Ti(){if(pt(),document.getElementById(ui))return;let e=document.createElement(`style`);e.id=ui,e.textContent=wi,document.head.appendChild(e)}function Ei(e,t={}){if(!e||e.dataset.rordMounted===`1`)return{destroy(){}};e.dataset.rordMounted=`1`,Ti();let n=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4],r=t.autoplay!==!1,i=li(n),a=n.length,o=Math.max(a,1),s=e=>mi+e*108,c=2*mi+o*di+(o-1)*pi,l=c+xi,u=c+xi/2,d=e=>e+fi/2,f=document.createElement(`div`);f.className=`viz rord`;let p=document.createElement(`div`);p.className=`viz__stage`,f.appendChild(p);let m=X(`svg`,{class:`viz__svg rord__svg`,viewBox:`0 0 ${l} 322`,role:`img`,"aria-label":`重排链表推演动画：${n.join(` → `)}`});p.appendChild(m);let h=[],g=Math.min(150,(l-2*mi-32)/3),_=(l-(3*g+32))/2;Ci.forEach((e,t)=>{let n=X(`g`,{class:`rord-stage`}),r=_+t*(g+16);n.appendChild(X(`rect`,{class:`rord-stage__box`,x:r,y:vi-15,width:g,height:30,rx:15}));let i=X(`text`,{class:`rord-stage__text`,x:r+g/2,y:vi});i.textContent=e,n.appendChild(i),m.appendChild(n),h.push(n)}),m.appendChild(X(`circle`,{class:`rord-null__ring`,cx:u,cy:d(hi),r:15}));let v=X(`text`,{class:`rord-null__text`,x:u,y:d(hi)});v.textContent=`∅`,m.appendChild(v);let y=X(`g`,{class:`rord-edges`});m.appendChild(y);let b=[];for(let e=0;e<a;e+=1){let t=X(`g`,{class:`rord-node`});t.appendChild(X(`rect`,{class:`rord-node__box`,x:0,y:0,width:di,height:fi,rx:9}));let r=X(`text`,{class:`rord-node__value`,x:di/2,y:fi/2});r.textContent=String(n[e]),t.appendChild(r),m.appendChild(t),b.push(t)}function x(){let e=X(`g`,{class:`rord-chip`});e.appendChild(X(`rect`,{class:`rord-chip__box`,x:-58/2,y:-26/2,width:yi,height:bi}));let t=X(`text`,{class:`rord-chip__text`,x:0,y:0});return e.appendChild(t),{g:e,t}}let S=[x(),x()];S.forEach(e=>m.appendChild(e.g));let C=document.createElement(`p`);C.className=`viz__desc`,C.setAttribute(`aria-live`,`polite`),f.appendChild(C);let w=Q();f.appendChild(w.root),e.textContent=``,e.appendChild(f);let T=null;function E(e,t,n,r){let i=n[e],a=n[t],o=X(`g`,{class:`rord-edge ${r||``}`});if(i.y===a.y&&Math.abs(i.x-a.x)===108){let e=i.y+fi/2,t=i.x+di,n=a.x;o.appendChild(X(`line`,{class:`rord-edge__line`,x1:t+3,y1:e,x2:n-9,y2:e})),o.appendChild(X(`path`,{class:`rord-edge__head`,d:`M ${n} ${e} L ${n-9} ${e-5.5} L ${n-9} ${e+5.5} Z`}))}else{let e=i.y+fi,t=a.y+fi,n=i.x+di/2,r=a.x+di/2;o.appendChild(X(`path`,{class:`rord-edge__line`,d:`M ${n} ${e} C ${n} ${e+38}, ${r} ${t+38}, ${r} ${t+8}`})),o.appendChild(X(`path`,{class:`rord-edge__head`,d:`M ${r} ${t} L ${r-5.5} ${t+9} L ${r+5.5} ${t+9} Z`}))}y.appendChild(o)}function D(e,t){let n=Array(a).fill(null),r=[...t.merged,...t.front];r.forEach((e,t)=>{n[e]={x:s(t),y:hi}}),t.back.forEach((e,t)=>{n[e]={x:s(r.length+t),y:gi}});let i=r.length+t.back.length;for(let e=0;e<a;e+=1)n[e]||(n[e]={x:s(i),y:hi},i+=1);let o=new Set(t.merged);for(let e=0;e<a;e+=1){let t=n[e];b[e].setAttribute(`transform`,`translate(${t.x} ${t.y})`),b[e].classList.toggle(`is-merged`,o.has(e))}y.textContent=``;for(let e=0;e<a;e+=1){let r=t.links[e];r!=null&&(r<0||r>=a||E(e,r,n,t.phase===`merge`||t.phase===`done`?`rord-edge--merged`:``))}if(t.cutEdge){let[e,r]=t.cutEdge;if(n[e]&&n[r]){let t=X(`g`,{class:`rord-edge rord-edge--cut`}),i=n[e],a=n[r];t.appendChild(X(`line`,{class:`rord-edge__line`,x1:i.x+di,y1:i.y+fi/2,x2:a.x,y2:a.y+fi/2})),y.appendChild(t)}}h.forEach((e,n)=>e.classList.toggle(`is-on`,t.stage===n+1)),S.forEach((e,r)=>{let i=t.chips[r];if(!i){e.g.style.opacity=`0`;return}let a=i.slot===null?{x:u-di/2,y:hi}:n[i.slot];e.g.style.opacity=`1`,e.g.setAttribute(`class`,`rord-chip rord-chip--${i.kind}`),e.t.textContent=i.label,e.g.setAttribute(`transform`,`translate(${a.x+di/2} ${a.y+_i})`)}),Z(C,t.desc)}let O=ht({steps:i,controls:w,intervalMs:Si,onRender:D});O.jumpTo(Math.trunc(t.initialStep)||0);let k=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!k&&typeof IntersectionObserver==`function`&&(T=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){T.disconnect(),T=null,O.play();return}},{threshold:.35}),T.observe(f)),{destroy(){T&&=(T.disconnect(),null),O.destroy(),e.textContent=``,delete e.dataset.rordMounted,document.getElementById(ui)?.remove()}}}function Di(e,t){let n=[],r=e,i=new Set;for(;r!=null&&!i.has(r);)i.add(r),n.push(r),r=t[r];return n}function Oi(e){if(e<=0)return null;let t=0,n=0;for(;n<e&&n+1<e;)t+=1,n+=2;return t}function ki(e){let t=e.length;for(let n=0;n<Math.floor(t/2);n+=1)if(e[n]!==e[t-1-n])return!1;return!0}function Ai(e){let t=Oi(e);if(t===null)return[];let n=[];for(let r=0;e-1-r>=t;r+=1)n.push([r,e-1-r]);return n}function ji(e){let t=e.length,n=Array.from({length:t},(e,n)=>n+1<t?n+1:null),r=t=>t==null?`∅`:String(e[t]),i=[],a=(e,t,r={})=>i.push({phase:e,stage:0,desc:t,links:[...n],front:[],back:[],pairs:[],active:null,verdict:null,chips:[],done:!1,...r});if(t===0)return a(`init`,"空链表。正着读、反着读都是「什么都没有」—— **空链表也算回文**，返回 `true`。",{stage:0,done:!0,verdict:!0}),i;ki(e);let o=e.slice().reverse().join(` → `);if(a(`init`,`判断 ${e.join(` → `)} 是不是回文。核心一句话：**把后半段反转过来（${o}），它应该跟前半段逐位相同**。全程只改指针、只比值，不开数组。`,{front:Di(0,n)}),t===1)return a(`done`,"只有一个节点，正着读反着读都是它自己 —— **是回文**，返回 `true`。",{front:[0],stage:3,done:!0,verdict:!0}),i;let s=Oi(t),c=0,l=0,u=0;for(;l<t&&l+1<t;){c+=1,l+=2,u+=1;let e=l>=t;a(`mid`,`① \`fast\` 一次跨两格、\`slow\` 一次一格：第 ${u} 步后 \`slow\` 走到 ${r(c)}、\`fast\` 走到 ${r(l)}。`+(e?` \`fast\` 冲出链表了 —— \`slow\` 停在 ${r(c)} 上，**这就是后半段的开头**。`:``),{stage:1,front:Di(0,n),chips:[{kind:`slow`,label:`slow`,slot:c},{kind:`fast`,label:`fast`,slot:l<t?l:null}]})}let d=Array.from({length:s},(e,t)=>t),f=Array.from({length:t-s},(e,t)=>s+t),p=d.map(r).join(` → `);a(`split`,`② 后半段 ${f.map(r).join(` → `)} 整体下移一行，前半段是 ${p}。接下来反转下行 —— 反转完它从左到右读起来，应该跟上行一模一样。注意这里**不需要断开**：反转时中点 `+r(s)+" 的 `next` 会被置空，前半段的尾巴走到它自然就停了。",{stage:2,front:d,back:f,chips:[{kind:`curr`,label:`curr`,slot:s}]});let m=null,h=s,g=0;for(;h!==null;){let e=n[h];n[h]=m,m=h,h=e,g+=1;let t=[...Di(m,n),...h===null?[]:Di(h,n)];a(`rev`,`② 第 ${g} 个节点掉头：\`curr\` 的 \`next\` 改成 \`prev\`，也就是 ${r(m)} → ${r(n[m])}。`+(h===null?" 后半段反转完成，`prev` 站在新的段头（原来的尾节点）上。":` \`curr\` 前移到 ${r(h)}，剩下的还没处理。`),{stage:2,front:d,back:t,chips:[{kind:`prev`,label:`prev`,slot:m},...h===null?[]:[{kind:`curr`,label:`curr`,slot:h}]]})}let _=Di(t-1,n),v=[],y=Ai(t);for(let t=0;t<y.length;t+=1){let[n,o]=y[t],s=n===o,c=e[n]===e[o],l={f:n,b:o,ok:c};if(v.push(l),a(`cmp`,`③ 第 ${t+1} / ${y.length} 对：`+(s?`\`p1\` 和 \`p2\` 都走到了中点 ${r(n)} 上 —— **中点跟自己比，必然相等**，这一对是白送的。`:`\`p1\` 指向 ${r(n)}、\`p2\` 指向 ${r(o)}，${e[n]} ${c?`==`:`!=`} ${e[o]} —— `+(c?`相等，两个指针一起往前。`:"**不相等，直接返回 `false`**，后面几对不用比了。")),{stage:3,front:d,back:_,pairs:[...v],active:l,verdict:c?null:!1,done:!c,chips:s?[{kind:`p1`,label:`p1/p2`,slot:n}]:[{kind:`p1`,label:`p1`,slot:n},{kind:`p2`,label:`p2`,slot:o}]}),!c)return i}return a(`done`,`③ \`p2\` 走到 ∅，${y.length} 对全部相等 —— **${e.join(` → `)} 是回文链表**，返回 \`true\`。`,{stage:3,front:d,back:_,pairs:[...v],active:null,verdict:!0,done:!0}),i}var Mi=`palm-styles`,Ni=64,Pi=48,Fi=44,Ii=44,Li=118,Ri=236,zi=-26,Bi=44,Vi=58,Hi=26,Ui=62,Wi=350,Gi=1250,Ki=[`① 找中点`,`② 反转后半段`,`③ 逐对比较`],qi=`
.palm {
  --palm-node: var(--text-primary, #1f2a24);
  --palm-edge: var(--text-secondary, #657168);
  --palm-a: var(--accent, #3f6b57);
  --palm-b: var(--accent-secondary, #a45f45);
  --palm-ok: var(--accent, #3f6b57);
  --palm-bad: #c0392b;
}
html.theme-dark .palm {
  --palm-a: #7fc3a4;
  --palm-b: #e0a06a;
  --palm-bad: #ff8a7a;
}
.palm__svg { min-width: 520px; }

.palm-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.24s ease, fill 0.24s ease;
}
.palm-node__value {
  fill: var(--palm-node);
  font-size: 18px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.palm-node.is-paired .palm-node__box { stroke: var(--palm-ok); stroke-width: 2; }
.palm-node.is-active .palm-node__box { stroke: var(--palm-b); stroke-width: 2.5; }
.palm-node.is-bad .palm-node__box { stroke: var(--palm-bad); stroke-width: 2.5; }
.palm-node.is-bad .palm-node__value { fill: var(--palm-bad); }

/* 节点整体位移：反转的"翻面"效果全靠它 */
.palm-node { transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1); }

.palm-edge__line { stroke: var(--palm-edge); stroke-width: 1.8; stroke-linecap: round; fill: none; }
.palm-edge__head { fill: var(--palm-edge); }

.palm-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 3 3;
}
.palm-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  text-anchor: middle;
  dominant-baseline: central;
}

/* 配对竖线 + ✓ / ✗ */
.palm-pair__line { stroke: var(--palm-ok); stroke-width: 2.2; fill: none; stroke-linecap: round; }
.palm-pair.is-bad .palm-pair__line { stroke: var(--palm-bad); }
.palm-pair__disc { fill: var(--palm-ok); }
.palm-pair.is-bad .palm-pair__disc { fill: var(--palm-bad); }
.palm-pair__mark {
  fill: #fff;
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}
.palm-pair.is-on .palm-pair__line { stroke: var(--palm-b); }
.palm-pair.is-on .palm-pair__disc { fill: var(--palm-b); }

/* 顶部阶段条 */
.palm-stage__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.2;
  transition: fill 0.24s ease, stroke 0.24s ease;
}
.palm-stage__text {
  fill: var(--text-secondary, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  transition: fill 0.24s ease;
}
.palm-stage.is-on .palm-stage__box { fill: var(--palm-ok); stroke: var(--palm-ok); }
.palm-stage.is-on .palm-stage__text { fill: #fff; }

/* 底部判定横幅 */
.palm-verdict__box {
  fill: none;
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.2;
  transition: fill 0.24s ease, stroke 0.24s ease;
}
.palm-verdict__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  transition: fill 0.24s ease;
}
.palm-verdict.is-ok .palm-verdict__box { fill: var(--palm-ok); stroke: var(--palm-ok); }
.palm-verdict.is-ok .palm-verdict__text { fill: #fff; }
.palm-verdict.is-bad .palm-verdict__box { fill: var(--palm-bad); stroke: var(--palm-bad); }
.palm-verdict.is-bad .palm-verdict__text { fill: #fff; }

.palm-chip { transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; }
.palm-chip__box { rx: 13; ry: 13; }
.palm-chip__text {
  font-size: 12.5px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: #fff;
}
.palm-chip--slow .palm-chip__box,
.palm-chip--prev .palm-chip__box,
.palm-chip--p1 .palm-chip__box { fill: var(--palm-a); }
.palm-chip--fast .palm-chip__box,
.palm-chip--curr .palm-chip__box,
.palm-chip--p2 .palm-chip__box { fill: var(--palm-b); }
@media (prefers-reduced-motion: reduce) {
  .palm-node, .palm-chip, .palm-stage__box, .palm-node__box,
  .palm-verdict__box { transition: none; }
}
`;function Ji(){if(pt(),document.getElementById(Mi))return;let e=document.createElement(`style`);e.id=Mi,e.textContent=qi,document.head.appendChild(e)}function Yi(e,t={}){if(!e||e.dataset.palmMounted===`1`)return{destroy(){}};e.dataset.palmMounted=`1`,Ji();let n=Array.isArray(t.values)&&t.values.length?t.values:[1,2,2,1],r=t.autoplay!==!1,i=ji(n),a=n.length,o=Math.max(a,1),s=e=>Ii+e*108,c=2*Ii+o*Ni+(o-1)*Fi,l=c+Ui,u=c+Ui/2,d=e=>e+Pi/2,f=document.createElement(`div`);f.className=`viz palm`;let p=document.createElement(`div`);p.className=`viz__stage`,f.appendChild(p);let m=X(`svg`,{class:`viz__svg palm__svg`,viewBox:`0 0 ${l} 390`,role:`img`,"aria-label":`回文链表推演动画：${n.join(` → `)}`});p.appendChild(m);let h=[],g=Math.min(150,(l-2*Ii-32)/3),_=(l-(3*g+32))/2;Ki.forEach((e,t)=>{let n=X(`g`,{class:`palm-stage`}),r=_+t*(g+16);n.appendChild(X(`rect`,{class:`palm-stage__box`,x:r,y:Bi-15,width:g,height:30,rx:15}));let i=X(`text`,{class:`palm-stage__text`,x:r+g/2,y:Bi});i.textContent=e,n.appendChild(i),m.appendChild(n),h.push(n)}),m.appendChild(X(`circle`,{class:`palm-null__ring`,cx:u,cy:d(Li),r:15}));let v=X(`text`,{class:`palm-null__text`,x:u,y:d(Li)});v.textContent=`∅`,m.appendChild(v);let y=X(`g`,{class:`palm-pairs`});m.appendChild(y);let b=X(`g`,{class:`palm-edges`});m.appendChild(b);let x=[];for(let e=0;e<a;e+=1){let t=X(`g`,{class:`palm-node`});t.appendChild(X(`rect`,{class:`palm-node__box`,x:0,y:0,width:Ni,height:Pi,rx:9}));let r=X(`text`,{class:`palm-node__value`,x:Ni/2,y:Pi/2});r.textContent=String(n[e]),t.appendChild(r),m.appendChild(t),x.push(t)}function S(){let e=X(`g`,{class:`palm-chip`});e.appendChild(X(`rect`,{class:`palm-chip__box`,x:-58/2,y:-26/2,width:Vi,height:Hi}));let t=X(`text`,{class:`palm-chip__text`,x:0,y:0});return e.appendChild(t),{g:e,t}}let C=[S(),S()];C.forEach(e=>m.appendChild(e.g));let w=X(`g`,{class:`palm-verdict`}),T=X(`rect`,{class:`palm-verdict__box`,x:(l-190)/2,y:Wi-18,width:190,height:36,rx:18}),E=X(`text`,{class:`palm-verdict__text`,x:l/2,y:Wi});w.appendChild(T),w.appendChild(E),m.appendChild(w);let D=document.createElement(`p`);D.className=`viz__desc`,D.setAttribute(`aria-live`,`polite`),f.appendChild(D);let O=Q();f.appendChild(O.root),e.textContent=``,e.appendChild(f);let k=null;function A(e,t,n){let r=n[e],i=n[t],a=X(`g`,{class:`palm-edge`});if(r.y===i.y&&Math.abs(r.x-i.x)===108){let e=r.y+Pi/2,t=r.x+Ni,n=i.x;a.appendChild(X(`line`,{class:`palm-edge__line`,x1:t+3,y1:e,x2:n-9,y2:e})),a.appendChild(X(`path`,{class:`palm-edge__head`,d:`M ${n} ${e} L ${n-9} ${e-5.5} L ${n-9} ${e+5.5} Z`}))}else{let e=r.y+Pi,t=i.y+Pi,n=r.x+Ni/2,o=i.x+Ni/2;a.appendChild(X(`path`,{class:`palm-edge__line`,d:`M ${n} ${e} C ${n} ${e+38}, ${o} ${t+38}, ${o} ${t+8}`})),a.appendChild(X(`path`,{class:`palm-edge__head`,d:`M ${o} ${t} L ${o-5.5} ${t+9} L ${o+5.5} ${t+9} Z`}))}b.appendChild(a)}function j(e,t,n){let r=X(`g`,{class:`palm-pair ${e.ok?`is-ok`:`is-bad`} ${n?`is-on`:``}`});if(e.f===e.b){let n=t[e.f],i=n.x+Ni/2-18,a=n.y+Pi;r.appendChild(X(`path`,{class:`palm-pair__line`,d:`M ${i-14} ${a} C ${i-22} ${a+26}, ${i+22} ${a+26}, ${i+14} ${a}`})),M(r,i,a+26*.78,e.ok)}else{let n=t[e.f],i=t[e.b],a=n.x+Ni/2-18,o=n.y+Pi,s=i.y,c=(o+s)/2;r.appendChild(X(`line`,{class:`palm-pair__line`,x1:a,y1:o+10,x2:a,y2:c-11})),r.appendChild(X(`line`,{class:`palm-pair__line`,x1:a,y1:c+11,x2:a,y2:s-2})),M(r,a,c,e.ok)}y.appendChild(r)}function M(e,t,n,r){e.appendChild(X(`circle`,{class:`palm-pair__disc`,cx:t,cy:n,r:11}));let i=X(`text`,{class:`palm-pair__mark`,x:t,y:n});i.textContent=r?`✓`:`✗`,e.appendChild(i)}function N(e,t){let n=Array(a).fill(null);t.front.forEach((e,t)=>{n[e]={x:s(t),y:Li}}),t.back.forEach((e,t)=>{n[e]={x:s(t),y:Ri}});let r=Math.max(t.front.length,t.back.length);for(let e=0;e<a;e+=1)n[e]||(n[e]={x:s(r),y:Li},r+=1);let i=new Set;for(let e of t.pairs)i.add(e.f),i.add(e.b);let o=new Set;t.active&&(o.add(t.active.f),o.add(t.active.b));let c=new Set;t.active&&!t.active.ok&&(c.add(t.active.f),c.add(t.active.b));for(let e=0;e<a;e+=1){let t=n[e];x[e].setAttribute(`transform`,`translate(${t.x} ${t.y})`),x[e].classList.toggle(`is-paired`,i.has(e)),x[e].classList.toggle(`is-active`,o.has(e)),x[e].classList.toggle(`is-bad`,c.has(e))}y.textContent=``,t.pairs.forEach((e,r)=>{let i=t.active&&t.pairs.indexOf(t.active)===r;j(e,n,i)}),b.textContent=``;for(let e=0;e<a;e+=1){let r=t.links[e];r!=null&&(r<0||r>=a||A(e,r,n))}h.forEach((e,n)=>e.classList.toggle(`is-on`,t.stage===n+1)),w.setAttribute(`class`,`palm-verdict`);let l=`准备开始`;t.verdict===!0?(w.classList.add(`is-ok`),l=`✓ 是回文链表`):t.verdict===!1?(w.classList.add(`is-bad`),l=`✗ 不是回文链表`):t.phase===`cmp`?l=`比较中…`:t.phase===`split`||t.phase===`rev`?l=`反转中…`:t.phase===`mid`?l=`定位中点…`:t.phase===`init`&&(l=`待判定`),E.textContent=l,C.forEach((e,r)=>{let i=t.chips[r];if(!i){e.g.style.opacity=`0`;return}let a=i.slot===null?{x:u-Ni/2,y:Li}:n[i.slot],o=a.y===Ri&&i.slot!==null?a.y+Pi+14:a.y+zi;e.g.style.opacity=`1`,e.g.setAttribute(`class`,`palm-chip palm-chip--${i.kind}`),e.t.textContent=i.label,e.g.setAttribute(`transform`,`translate(${a.x+Ni/2} ${o})`)}),Z(D,t.desc)}let P=ht({steps:i,controls:O,intervalMs:Gi,onRender:N});P.jumpTo(Math.trunc(t.initialStep)||0);let F=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!F&&typeof IntersectionObserver==`function`&&(k=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){k.disconnect(),k=null,P.play();return}},{threshold:.35}),k.observe(f)),{destroy(){k&&=(k.disconnect(),null),P.destroy(),e.textContent=``,delete e.dataset.palmMounted,document.getElementById(Mi)?.remove()}}}function Xi(e,t){let n=new Set(t);for(let r of e){if(!n.has(r))continue;let i=e.indexOf(r),a=t.indexOf(r),o=0;for(;i+o<e.length&&a+o<t.length&&e[i+o]===t[a+o];)o+=1;if(i+o===e.length&&a+o===t.length)return r}return null}function Zi(e,t){let n=Xi(e,t);return n===null?0:e.length-e.indexOf(n)}function Qi(e,t){let n=Zi(e,t);return{a:e.length-n,b:t.length-n,c:n}}function $i(e={}){let t=Array.isArray(e.pool)&&e.pool.length?e.pool:[1,2,3,4,5,6,7],n=Array.isArray(e.pathA)?e.pathA:[0,1,2,3,4],r=Array.isArray(e.pathB)?e.pathB:[5,6,3,4],i={A:n,B:r},a=n.length,o=r.length,s=e=>e==null?`∅`:String(t[e]),c=Xi(n,r),{a:l,b:u,c:d}=Qi(n,r),f=[],p=(e,t,n={})=>f.push({phase:e,desc:t,onA:`A`,onB:`B`,iA:0,iB:0,fromA:null,fromB:null,jumpsA:!1,jumpsB:!1,shared:c!==null,equal:!1,meet:null,answer:c,done:!1,...n});if(a===0||o===0)return p(`none`,"有一条链表是空的 —— 空链表不可能有相交节点，直接返回 `null`。",{shared:!1,answer:null,done:!0}),f;p(`init`,`两条链表 A = ${n.map(s).join(` → `)}、B = ${r.map(s).join(` → `)}。`+(c===null?`它们**没有共享任何节点**（下面两个 4 只是值相同，不是同一个节点）。`:`从 ${s(c)} 开始它们**共享同一批节点**，后缀完全重合 —— 这就是"相交"在这个结构里的确切含义。`)+` 目标是找出那个**起始**节点，而且不许开哈希表。`,{onA:`A`,onB:`B`,iA:0,iB:0});let m={on:`A`,i:0},h={on:`B`,i:0},g=0,_=0,v=0,y=2*(a+o)+4,b=()=>({onA:m.on,iA:m.i,onB:h.on,iB:h.i});for(;g<=a+o&&v<y;){v+=1;let e=m.i>=i[m.on].length,t=h.i>=i[h.on].length;if(e&&t)break;if(e||t){let n=m.i>=i[m.on].length?i[m.on][i[m.on].length-1]:i[m.on][m.i],r=h.i>=i[h.on].length?i[h.on][i[h.on].length-1]:i[h.on][h.i],a=[];e&&a.push(`pA`),t&&a.push(`pB`);let o=a.map(e=>s(e===`pA`?n:r)).join(` 和 `);e&&(m={on:m.on===`A`?`B`:`A`,i:0},_+=1),t&&(h={on:h.on===`B`?`A`:`B`,i:0},_+=1);let c=s(i[m.on][m.i]),l=s(i[h.on][h.i]);p(`jump`,`**${a.join(` 和 `)} 走到了 ∅，搬到了对方链表的头上。** 它从 ${o} 的 \`next\` 直接跳到另一条链的第一个节点，于是 pA 在 ${c}、pB 在 ${l}。这一步是整套解法的关键：**pA 走完 A 就去走 B，pB 走完 B 就去走 A**，两条"游标自己走过的路"就此等长。`,{...b(),fromA:n,fromB:r,jumpsA:e,jumpsB:t,equal:i[m.on][m.i]===i[h.on][h.i]});continue}if(i[m.on][m.i]===i[h.on][h.i])break;let n=s(i[m.on][m.i]),r=s(i[h.on][h.i]);m.i+=1,h.i+=1,g+=1;let a=m.i>=i[m.on].length?`∅`:s(i[m.on][m.i]),o=h.i>=i[h.on].length?`∅`:s(i[h.on][h.i]);p(`walk`,`第 ${g} 步：pA 在 ${n}、pB 在 ${r}，**不是同一个节点**，一起前移一格 —— pA 到 ${a}、pB 到 ${o}。注意判断相交比的是**节点本身**，不是值：值相等不算数。`,{...b(),equal:i[m.on][m.i]===i[h.on][h.i]})}let x=m.i>=i[m.on].length,S=h.i>=i[h.on].length;if(!x&&!S&&i[m.on][m.i]===i[h.on][h.i]){let e=i[m.on][m.i];return p(`found`,`**两个游标同时落在节点 ${s(e)} 上 —— 这就是相交的起始节点。** pA 走了 A 的独有段 ${l} 步 + 公共段 ${d} 步 + B 的独有段 ${u} 步，pB 走了 B 的独有段 ${u} 步 + 公共段 ${d} 步 + A 的独有段 ${l} 步 ——两条路都是 \`a + b + c = ${l+u+d}\`，**路程相等，所以必然同时到达**。`,{...b(),equal:!0,meet:e,done:!0}),f}return p(`none`,`两个游标**同时走到了 ∅** —— 两条链表根本没有共享节点。各自都老老实实走完了"自己那条链 + 对方那条链"（各 ${l+u} 步），恰好手拉手一起掉出去。返回 \`null\`。`,{...b(),done:!0}),f}var ea=`ints-styles`,ta=62,na=46,ra=40,ia=46,aa=150,oa=286,sa=aa-62,ca=348,la=482/2,ua=52,da=24,fa=34,pa=30,ma=396,ha=44,ga=-34,_a=1250,va=`
.ints {
  --ints-node: var(--text-primary, #1f2a24);
  --ints-edge: var(--text-secondary, #657168);
  --ints-a: var(--accent, #3f6b57);
  --ints-b: var(--accent-secondary, #a45f45);
  --ints-ok: var(--accent, #3f6b57);
  --ints-bad: #c0392b;
}
html.theme-dark .ints {
  --ints-a: #7fc3a4;
  --ints-b: #e0a06a;
  --ints-bad: #ff8a7a;
}
.ints__svg { min-width: 560px; }

.ints-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.24s ease, stroke-width 0.24s ease, opacity 0.24s ease;
}
.ints-node__value {
  fill: var(--ints-node);
  font-size: 17px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 公共段节点：加粗描边，指出"这块是两条链共用的" */
.ints-node.is-shared .ints-node__box { stroke-dasharray: none; stroke-width: 1.5; }
.ints-node.is-shared .ints-node__value { font-weight: 700; }
/* 当前被游标指到的节点 */
.ints-node.is-cursor-a .ints-node__box { stroke: var(--ints-a); stroke-width: 2.5; }
.ints-node.is-cursor-b .ints-node__box { stroke: var(--ints-b); stroke-width: 2.5; }
.ints-node.is-meet .ints-node__box { stroke: var(--ints-ok); stroke-width: 3; fill: rgba(63, 107, 87, 0.08); }

/* 答案常驻标记（橙色虚线框） */
.ints-answer__box {
  fill: none;
  stroke: var(--ints-b);
  stroke-width: 2.2;
  stroke-dasharray: 6 4;
  opacity: 1;
}

.ints-edge__line { stroke: var(--ints-edge); stroke-width: 1.8; stroke-linecap: round; fill: none; }
.ints-edge__head { fill: var(--ints-edge); }
/* B 汇入公共段的斜边：用 B 的颜色区分"这撇是从 B 那边上来的" */
.ints-edge--b .ints-edge__line { stroke: var(--ints-b); }
.ints-edge--b .ints-edge__head { fill: var(--ints-b); }

/* chip 引线 */
.ints-lead { stroke-width: 1.4; opacity: 0.85; }
.ints-lead--a { stroke: var(--ints-a); }
.ints-lead--b { stroke: var(--ints-b); }

/* 换头弧线 */
.ints-hop { opacity: 0; transition: opacity 0.3s ease; }
.ints-hop.is-on { opacity: 1; }
.ints-hop__line {
  fill: none;
  stroke: var(--ints-b);
  stroke-width: 2.2;
  stroke-dasharray: 7 4;
  stroke-linecap: round;
}
.ints-hop--a .ints-hop__line { stroke: var(--ints-a); }
.ints-hop__head { fill: var(--ints-b); }
.ints-hop--a .ints-hop__head { fill: var(--ints-a); }
.ints-hop__tag-bg { fill: var(--surface-muted, #ecefe8); }
.ints-hop__tag {
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: var(--ints-b);
}
.ints-hop--a .ints-hop__tag { fill: var(--ints-a); }

/* 行标签 */
.ints-row__text {
  fill: var(--text-secondary, #657168);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ints-row__text--a { fill: var(--ints-a); }
.ints-row__text--b { fill: var(--ints-b); }

/* 顶部那句"公共段从这里开始"的标注 */
.ints-shared-note__text {
  fill: var(--text-secondary, #657168);
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: central;
}
.ints-shared-note__line { stroke: var(--text-secondary, #657168); stroke-width: 1; stroke-dasharray: 3 3; opacity: 0.7; }

.ints-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 3 3;
}
.ints-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'Segoe UI Symbol', 'DejaVu Sans', Arial, sans-serif;
}

/* 底部判定横幅 */
.ints-verdict__box {
  fill: none;
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.2;
  transition: fill 0.24s ease, stroke 0.24s ease;
}
.ints-verdict__text {
  fill: var(--text-secondary, #657168);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  transition: fill 0.24s ease;
}
.ints-verdict.is-ok .ints-verdict__box { fill: var(--ints-ok); stroke: var(--ints-ok); }
.ints-verdict.is-ok .ints-verdict__text { fill: #fff; }
.ints-verdict.is-bad .ints-verdict__box { fill: var(--ints-bad); stroke: var(--ints-bad); }
.ints-verdict.is-bad .ints-verdict__text { fill: #fff; }

.ints-chip { transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; }
.ints-chip__box { rx: 12; ry: 12; }
.ints-chip__text {
  font-size: 12px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: #fff;
}
.ints-chip--a .ints-chip__box { fill: var(--ints-a); }
.ints-chip--b .ints-chip__box { fill: var(--ints-b); }

@media (prefers-reduced-motion: reduce) {
  .ints-node__box, .ints-chip, .ints-verdict__box, .ints-hop { transition: none; }
}
`;function ya(){if(pt(),document.getElementById(ea))return;let e=document.createElement(`style`);e.id=ea,e.textContent=va,document.head.appendChild(e)}function ba(e,t={}){if(!e||e.dataset.intsMounted===`1`)return{destroy(){}};e.dataset.intsMounted=`1`,ya();let n=$i(t);n[0];let r=t.autoplay!==!1,i=Array.isArray(t.pool)&&t.pool.length?t.pool:[1,2,3,4,5,6,7],a=Array.isArray(t.pathA)?t.pathA:[0,1,2,3,4],o=Array.isArray(t.pathB)?t.pathB:[5,6,3,4],{a:s,b:c,c:l}=Qi(a,o),u=l>0?a.slice(s):[],d=new Set(u);s>0&&a[s-1],c>0&&o[c-1];let f=Math.max(a.length,o.length,1),p=pa,m=e=>76+e*102,h=2*ia+f*ta+(f-1)*ra,g=h+fa*2+pa*2,_=p+h+fa,v=s,y=e=>e+na/2;function b(e){let t=a.indexOf(e),n=o.indexOf(e);return t>=0&&d.has(e)?{x:m(v+(t-s)),y:aa,col:v+(t-s)}:t>=0&&n<0?{x:m(t),y:aa,col:t}:n>=0&&t<0?{x:m(n),y:oa,col:n}:t>=0?{x:m(t),y:aa,col:t}:{x:m(n),y:oa,col:n}}let x=document.createElement(`div`);x.className=`viz ints`;let S=document.createElement(`div`);S.className=`viz__stage`,x.appendChild(S);let C=X(`svg`,{class:`viz__svg ints__svg`,viewBox:`0 0 ${g} 440`,role:`img`,"aria-label":`相交链表推演动画`});S.appendChild(C);let w=X(`g`,{class:`ints-shared-note`}),T=X(`line`,{class:`ints-shared-note__line`}),E=X(`text`,{class:`ints-shared-note__text`,x:g/2,y:ha});w.append(T,E),C.appendChild(w);let D=[];for(let[e,t]of[[_,y(aa)],[_,y(oa)]]){C.appendChild(X(`circle`,{class:`ints-null__ring`,cx:e,cy:t,r:14}));let n=X(`text`,{class:`ints-null__text`,x:e,y:t});n.textContent=`∅`,C.appendChild(n),D.push({cx:e,cy:t})}let O=X(`g`,{class:`ints-edges`});C.appendChild(O);let k=X(`g`,{class:`ints-answer`}),A=X(`rect`,{class:`ints-answer__box`,x:0,y:0,width:76,height:60,rx:13});k.appendChild(A),C.appendChild(k);let j=new Map;for(let e of new Set([...a,...o])){let t=b(e),n=X(`g`,{class:`ints-node${d.has(e)?` is-shared`:``}`});n.setAttribute(`transform`,`translate(${t.x} ${t.y})`),n.appendChild(X(`rect`,{class:`ints-node__box`,x:0,y:0,width:ta,height:na,rx:9}));let r=X(`text`,{class:`ints-node__value`,x:ta/2,y:na/2});r.textContent=String(i[e]),n.appendChild(r),C.appendChild(n),j.set(e,n)}let M=[],N=(e,t)=>{for(let n=0;n<e.length-1;n+=1){let r=e[n],i=e[n+1],a=`${r}->${i}`;M.some(e=>e.key===a)||M.push({key:a,from:r,to:i,kind:t})}};N(a,`a`),N(o,`b`);let P=[];for(let e of M){let t=X(`g`,{class:`ints-edge ints-edge--${e.kind}`}),n=X(`path`,{class:`ints-edge__line`}),r=X(`path`,{class:`ints-edge__head`});t.append(n,r),O.appendChild(t),P.push({...e,g:t,line:n,head:r})}let F=[];{let e=X(`g`,{class:`ints-edge`}),t=X(`path`,{class:`ints-edge__line`}),n=X(`path`,{class:`ints-edge__head`});e.append(t,n),O.appendChild(e),F.push({g:e,line:t,head:n,slot:a[a.length-1],row:aa})}let I={};for(let e of[`a`,`b`]){let t=X(`g`,{class:`ints-hop ints-hop--${e}`}),n=X(`path`,{class:`ints-hop__line`}),r=X(`path`,{class:`ints-hop__head`}),i=X(`rect`,{class:`ints-hop__tag-bg`,x:-76,y:-9,width:152,height:18,rx:6}),a=X(`text`,{class:`ints-hop__tag`,x:0,y:0});t.append(n,r,i,a),C.appendChild(t),I[e]={g:t,line:n,head:r,tagBg:i,tag:a}}let L=[];if(s>0){let e=X(`text`,{class:`ints-row__text ints-row__text--a`,x:m(0)+ga,y:y(aa)});e.textContent=`A`,C.appendChild(e),L.push(e)}if(c>0){let e=X(`text`,{class:`ints-row__text ints-row__text--b`,x:m(0)+ga,y:y(oa)});e.textContent=`B`,C.appendChild(e),L.push(e)}function R(e,t){let n=X(`g`,{class:`ints-chip ints-chip--${e}`});n.appendChild(X(`rect`,{class:`ints-chip__box`,x:-52/2,y:-24/2,width:ua,height:da}));let r=X(`text`,{class:`ints-chip__text`,x:0,y:0});return r.textContent=t,n.appendChild(r),n}let z=R(`a`,`pA`),B=R(`b`,`pB`);C.append(z,B);let V=X(`line`,{class:`ints-lead ints-lead--a`}),H=X(`line`,{class:`ints-lead ints-lead--b`});O.append(V,H);let ee=X(`g`,{class:`ints-verdict`}),te=X(`rect`,{class:`ints-verdict__box`,x:(g-240)/2,y:ma-18,width:240,height:36,rx:18}),U=X(`text`,{class:`ints-verdict__text`,x:g/2,y:ma});ee.append(te,U),C.appendChild(ee);let W=document.createElement(`p`);W.className=`viz__desc`,W.setAttribute(`aria-live`,`polite`),x.appendChild(W);let G=Q();x.appendChild(G.root),e.textContent=``,e.appendChild(x);let ne=null;for(let e of P)re(e,b(e.from),b(e.to));{let e=F[0],t=b(e.slot),n=t.y+na/2,r=t.x+ta+3,i=_-14;e.line.setAttribute(`d`,`M ${r} ${n} L ${i-8} ${n}`),e.head.setAttribute(`d`,`M ${i} ${n} L ${i-9} ${n-5.5} L ${i-9} ${n+5.5} Z`)}function re(e,t,n){if(t.y===n.y){let r=t.y+na/2,i=t.x+ta,a=n.x;e.line.setAttribute(`d`,`M ${i+3} ${r} L ${a-9} ${r}`),e.head.setAttribute(`d`,`M ${a} ${r} L ${a-9} ${r-5.5} L ${a-9} ${r+5.5} Z`);return}let r=t.x+ta,i=t.y+na/2,a=n.x,o=n.y+na/2,s=r+3,c=a-9,l=Math.max(26,(c-s)*.45);e.line.setAttribute(`d`,`M ${s} ${i} C ${s+l} ${i}, ${c-l} ${o}, ${c} ${o}`),e.head.setAttribute(`d`,`M ${a} ${o} L ${a-9} ${o-5.5} L ${a-9} ${o+5.5} Z`)}function K(e,t,n){let r=I[e];if(r.g.classList.toggle(`is-on`,n),!n)return;let i=e===`a`?t.fromA:t.fromB,s=(e===`a`?t.onA:t.onB)===`A`?a:o;if(i==null)return;let c=b(i),l=b(s[0]),u=c.x+ta/2,d=e===`a`?c.y+na:c.y,f=l.x+ta/2,p=e===`a`?l.y:l.y+na,m=la;r.line.setAttribute(`d`,`M ${u} ${d} L ${u} ${m} L ${f} ${m} L ${f} ${p}`);let h=p<m;r.head.setAttribute(`d`,h?`M ${f} ${p} L ${f-5.5} ${p+9} L ${f+5.5} ${p+9} Z`:`M ${f} ${p} L ${f-5.5} ${p-9} L ${f+5.5} ${p-9} Z`);let g=(u+f)/2;r.tagBg.setAttribute(`x`,g-76),r.tagBg.setAttribute(`y`,m-9),r.tag.setAttribute(`x`,g),r.tag.setAttribute(`y`,m),r.tag.textContent=e===`a`?`pA 走完 A → 换到 B 的头`:`pB 走完 B → 换到 A 的头`}function ie(e,t){let n=t===`A`?e.onA:e.onB,r=t===`A`?e.iA:e.iB,i=n===`A`?a:o;if(r>=i.length){let e=n===`A`?aa:oa;return{x:_-ta/2,y:e,onNull:!0}}return{...b(i[r]),onNull:!1}}function ae(e,t){let n=(()=>{let e=t.onA===`A`?a:o;return t.iA>=e.length?null:e[t.iA]})(),r=(()=>{let e=t.onB===`A`?a:o;return t.iB>=e.length?null:e[t.iB]})();for(let[e,i]of j)i.classList.toggle(`is-cursor-a`,e===n),i.classList.toggle(`is-cursor-b`,e===r&&e!==n),i.classList.toggle(`is-meet`,t.meet!==null&&e===t.meet);if(t.answer!==null&&t.answer!==void 0){let e=b(t.answer);A.setAttribute(`x`,e.x-7),A.setAttribute(`y`,e.y-7),k.style.opacity=`1`}else k.style.opacity=`0`;if(t.answer!==null&&t.answer!==void 0&&l>0){let e=b(t.answer).x+ta/2;E.textContent=`公共段从这里开始（两条链共用这 ${l} 个节点）`,T.setAttribute(`x1`,e),T.setAttribute(`x2`,e),T.setAttribute(`y1`,55),T.setAttribute(`y2`,aa-12),w.style.opacity=`1`}else w.style.opacity=`0`;let s=ie(t,`A`),c=ie(t,`B`),u=n!==null&&n===r,d=s.onNull?aa:s.y,f=c.onNull?oa:c.y,p=d===oa?ca:sa,m=f===aa?sa:ca,h=u?p-14:p,g=u?m+14:m;z.setAttribute(`transform`,`translate(${s.x+ta/2} ${h})`),B.setAttribute(`transform`,`translate(${c.x+ta/2} ${g})`),z.style.opacity=`1`,B.style.opacity=`1`;let _=(e,t)=>{let n=e<t.y;return{x:t.x+ta/2,y1:n?e+da/2:e-da/2,y2:n?t.y-2:t.y+na+2}},v=_(h,s),y=_(g,c);V.setAttribute(`x1`,v.x),V.setAttribute(`x2`,v.x),V.setAttribute(`y1`,v.y1),V.setAttribute(`y2`,v.y2),H.setAttribute(`x1`,y.x),H.setAttribute(`x2`,y.x),H.setAttribute(`y1`,y.y1),H.setAttribute(`y2`,y.y2),K(`a`,t,t.phase===`jump`&&t.jumpsA),K(`b`,t,t.phase===`jump`&&t.jumpsB),ee.setAttribute(`class`,`ints-verdict`);let x=`准备开始`;t.phase===`found`?(ee.classList.add(`is-ok`),x=`✓ 相交于节点 ${i[t.meet]}`):t.phase===`none`?(ee.classList.add(`is-bad`),x=`✗ 两条链表不相交`):t.phase===`jump`?x=`换头中…`:t.phase===`walk`?x=`同步前进中…`:t.phase===`init`&&(x=`待判定`),U.textContent=x,Z(W,t.desc)}let oe=ht({steps:n,controls:G,intervalMs:_a,onRender:ae});oe.jumpTo(Math.trunc(t.initialStep)||0);let se=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!se&&typeof IntersectionObserver==`function`&&(ne=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){ne.disconnect(),ne=null,oe.play();return}},{threshold:.35}),ne.observe(x)),{destroy(){ne&&=(ne.disconnect(),null),oe.destroy(),e.textContent=``,delete e.dataset.intsMounted,document.getElementById(ea)?.remove()}}}var xa=-1;function Sa(e,t,n){if(!Array.isArray(t)||n<0||n>=t.length)return 0;let r=e[t[n]],i=1;for(;n+i<t.length&&e[t[n+i]]===r;)i+=1;return i}function Ca(e={}){let t=Array.isArray(e.pool)&&e.pool.length?e.pool:[1,2,3,3,4,4,5],n=Array.isArray(e.path)?e.path:[0,1,2,3,4,5,6],r=e.mode===`keep-one`?`keep-one`:`remove-all`,i=e=>e===xa||e==null?`dummy`:e>=n.length?`∅`:String(t[n[e]]),a=e=>e<0||e>=n.length?null:t[n[e]],o=e=>Sa(t,n,e),s=[],c=[];{let e=0;for(;e<n.length;){let t=o(e);if(t>1)if(r===`keep-one`){for(let n=e;n<e+t-1;n+=1)c.push(n);s.push(e+t-1)}else for(let n=e;n<e+t;n+=1)c.push(n);else s.push(e);e+=t}}let l=[],u=[],d=(e,t,n={})=>l.push({phase:e,desc:t,prev:xa,curr:0,dupStart:null,dupEnd:null,removed:[...u],removedNow:[],kept:[...s],mode:r,done:!1,...n});if(n.length===0)return d(`done`,"链表是空的 —— 没有节点可删，直接返回 `null`。",{curr:0,prev:xa,done:!0}),l;d(`init`,`链表 ${n.map((e,t)=>i(t)).join(` → `)} 已经**排好序**，所以重复的元素一定挨在一起。目标是**把所有出现过的重复值都删干净**（一个都不留），`+(r===`keep-one`?`不过这次用阿里变体的规则：**重复过的值留下一个**。`:`这就是本题（LC 82）的要求，注意跟"只留一个"不是一回事。`)+" 先在头上架一个 `dummy` 哨兵 —— 头节点自己也可能是重复段的一员。",{prev:xa,curr:0});let f=0;for(;f<n.length;){let e=o(f);if(e>1){let t=f,o=f+e,s=a(f);d(`dup-start`,`\`curr\` 在 ${i(f)}，它的值和下一个节点相同（都是 ${s}）——**发现一段重复，长度 ${e}**。\`prev\` 就此**停住不动**，因为一会儿要把整段一次摘掉，摘的动作得由 \`prev.next = curr\` 完成，prev 必须留在这一段的**前一个**位置。`,{prev:f-1<0?xa:f-1,curr:f,dupStart:t,dupEnd:o});for(let e=t;e<o;e+=1){let n=e+1<o;d(`skip`,`\`curr\` 从 ${i(e)} 往前一格到 ${i(e+1)}（值都是 ${a(e)}）——`+(n?` 后面**还有同值的节点**，重复段没走完，继续往前。`:` 这一步跨出了重复段。`)+" 全程 **`prev` 一动没动** —— 它守在重复段前面的那个节点上，等着被接上。",{prev:f-1<0?xa:f-1,curr:e+1,dupStart:t,dupEnd:o})}if(r===`keep-one`){let e=o-1;for(let n=t;n<e;n+=1)u.push(n);let n=Array.from({length:e-t},(e,n)=>t+n);d(`unlink`,`**阿里变体：留下一个。** 把重复段里的 ${t} 到 ${e-1} 号节点（值都是 ${s}）摘掉，只留最后一个 ${i(e)}。\`prev.next\` 指向 ${i(e)}。`,{prev:e,curr:o,dupStart:t,dupEnd:o,removedNow:n})}else{for(let e=t;e<o;e+=1)u.push(e);let r=Array.from({length:e},(e,n)=>t+n);d(`unlink`,`**整段摘掉。** \`prev.next = curr\` 一次接上 ${o<n.length?i(o):`∅`} —— 中间的 ${e} 个节点（值都是 ${s}）全被摘出链表，一个不留。这一步就是本题跟 LC 83 的分水岭：**LC 83 会留下一个，这里一个都不留。**`,{prev:f-1<0?xa:f-1,curr:o,dupStart:t,dupEnd:o,removedNow:r})}f=o;let c=r===`keep-one`?o-1:f-1;f<n.length&&d(`advance`,`刚才那一段处理完了：\`prev\` 现在停在 ${i(c)}，\`curr\` 落在 ${i(f)}。**只有确定 curr 不再是重复段成员时，prev 才跟着前进。**`,{prev:c,curr:f});continue}d(`scan`,`\`curr\` 在 ${i(f)}，它的值（${a(f)}）跟下一个${f+1<n.length?`（${i(f+1)}）`:`（没有下一个了）`} 不相同 —— 这个节点不属于任何重复段，**安全保留**。于是 \`prev\` 也前进一格，跟 \`curr\` 挨着一起往右走。`,{prev:f-1<0?xa:f-1,curr:f}),f+=1}let p=n.map((e,t)=>i(t)).join(` → `),m=s.map(e=>i(e)).join(` → `),h=c.length?c.map(e=>i(e)).join(`、`):`（无）`;return d(`done`,`\`curr\` 走到了 ∅，循环结束。返回 \`dummy.next\`。\n\n- 原链表：${p}\n- 结果：**${m||`（空）`}**\n- 被摘掉的节点：${h}\n\n`+(r===`keep-one`?`阿里变体的结果里，**重复过的值各留了一个**，没重复过的值原样保留。`:`**所有出现过的重复值都被删干净了** —— 这就是 LC 82 跟 LC 83 的区别。`)+" 全程只用了两根指针，额外空间 `O(1)`。",{prev:xa,curr:n.length,done:!0}),l}var wa=`rd2-styles`,Ta=0,Ea=62,Da=48,Oa=38,ka=44,Aa=150,ja=174,Ma=58,Na=24,Pa=Aa-62,Fa=264,Ia=Aa-34,La=8,Ra=46,za=372,Ba=46,Va=1150,Ha=`
.rd2 {
  --rd2-prev: var(--accent, #3f6b57);
  --rd2-curr: var(--accent-secondary, #a45f45);
  --rd2-edge: var(--text-secondary, #657168);
  --rd2-cut: #b3452e;
  --rd2-dup: #c8873f;
}
html.theme-dark .rd2 {
  --rd2-prev: #7fc3a4;
  --rd2-curr: #e0a06a;
  --rd2-cut: #e07a5f;
  --rd2-dup: #e8b06a;
}
.rd2__svg { min-width: 600px; }

.rd2-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.26s ease, fill 0.26s ease, opacity 0.26s ease;
}
/* dummy 是哨兵，内存里不存在 —— 画虚线 */
.rd2-node--dummy .rd2-node__box { stroke-dasharray: 5 4; }
.rd2-node--dummy .rd2-node__value { font-size: 13px; fill: var(--text-secondary, #657168); }
.rd2-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 18px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 被摘掉的节点：变灰 + 虚线 + 划掉 */
.rd2-node.is-cut .rd2-node__box {
  stroke: var(--text-secondary, #657168);
  stroke-dasharray: 5 3;
  opacity: 0.5;
}
.rd2-node.is-cut .rd2-node__value { opacity: 0.42; text-decoration: line-through; }
/* 正在被处理的重复段成员 */
.rd2-node.is-dup .rd2-node__box { stroke: var(--rd2-dup, #c8873f); stroke-width: 2.2; }
/* 游标落点 */
.rd2-node.is-prev .rd2-node__box { stroke: var(--rd2-prev, #3f6b57); stroke-width: 2.6; }
.rd2-node.is-curr .rd2-node__box { stroke: var(--rd2-curr, #a45f45); stroke-width: 2.6; }

/* 重复段整体外框 */
.rd2-dupframe { opacity: 0; transition: opacity 0.26s ease; }
.rd2-dupframe.is-on { opacity: 1; }
.rd2-dupframe__box {
  fill: rgba(200, 135, 63, 0.09);
  stroke: var(--rd2-dup, #c8873f);
  stroke-width: 2;
  stroke-dasharray: 6 4;
}
.rd2-dupframe__tag-bg { fill: var(--surface-muted, #ecefe8); }
.rd2-dupframe__tag {
  fill: var(--rd2-dup, #c8873f);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rd2-edge { opacity: 0; transition: opacity 0.26s ease; }
.rd2-edge.is-on { opacity: 1; }
.rd2-edge__line { stroke: var(--rd2-edge, #657168); stroke-width: 1.8; stroke-linecap: round; }
.rd2-edge__head { fill: var(--rd2-edge, #657168); }

/* 摘链弧线 */
.rd2-arc { opacity: 0; transition: opacity 0.26s ease; }
.rd2-arc.is-on { opacity: 1; }
.rd2-arc__line {
  fill: none;
  stroke: var(--rd2-cut, #b3452e);
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-dasharray: 7 4;
}
.rd2-arc__head { fill: var(--rd2-cut, #b3452e); }
.rd2-arc__tag-bg { fill: var(--surface-muted, #ecefe8); }
.rd2-arc__tag {
  fill: var(--rd2-cut, #b3452e);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rd2-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 3 3;
}
.rd2-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'Segoe UI Symbol', 'DejaVu Sans', Arial, sans-serif;
}

.rd2-note__text {
  fill: var(--text-secondary, #657168);
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: central;
}
.rd2-note__line {
  stroke: var(--text-secondary, #657168);
  stroke-width: 1;
  stroke-dasharray: 3 3;
  opacity: 0.7;
}

.rd2-chip { transition: transform 0.34s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; }
.rd2-chip__box { rx: 12; ry: 12; }
.rd2-chip__text {
  font-size: 12px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: #fff;
}
.rd2-chip--prev .rd2-chip__box { fill: var(--rd2-prev, #3f6b57); }
.rd2-chip--curr .rd2-chip__box { fill: var(--rd2-curr, #a45f45); }
.rd2-lead { stroke-width: 1.4; opacity: 0.85; }
.rd2-lead--prev { stroke: var(--rd2-prev, #3f6b57); }
.rd2-lead--curr { stroke: var(--rd2-curr, #a45f45); }

/* 底部判定横幅 */
.rd2-verdict__box {
  fill: none;
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.2;
  transition: fill 0.24s ease, stroke 0.24s ease;
}
.rd2-verdict__text {
  fill: var(--text-secondary, #657168);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  transition: fill 0.24s ease;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rd2-verdict.is-ok .rd2-verdict__box { fill: var(--rd2-prev, #3f6b57); stroke: var(--rd2-prev, #3f6b57); }
.rd2-verdict.is-ok .rd2-verdict__text { fill: #fff; }
.rd2-verdict.is-cut .rd2-verdict__box { fill: var(--rd2-cut, #b3452e); stroke: var(--rd2-cut, #b3452e); }
.rd2-verdict.is-cut .rd2-verdict__text { fill: #fff; }

@media (prefers-reduced-motion: reduce) {
  .rd2-node__box, .rd2-chip, .rd2-edge, .rd2-arc, .rd2-dupframe { transition: none; }
}
`;function Ua(){if(pt(),document.getElementById(wa))return;let e=document.createElement(`style`);e.id=wa,e.textContent=Ha,document.head.appendChild(e)}function Wa(e,t={}){if(!e||e.dataset.rd2Mounted===`1`)return{destroy(){}};e.dataset.rd2Mounted=`1`,Ua();let n=Ca(t),r=t.autoplay!==!1,i=Array.isArray(t.pool)&&t.pool.length?t.pool:[1,2,3,3,4,4,5],a=Array.isArray(t.path)?t.path:[0,1,2,3,4,5,6],o=t.mode===`keep-one`?`keep-one`:`remove-all`,s=a.length,c=s+1,l=e=>e<0?Ta:e+1,u=e=>e-1,d=2*ka+c*Ea+(c-1)*Oa,f=e=>ka+e*100,p=e=>f(e)+Ea/2,m=d-Ba,h=document.createElement(`div`);h.className=`viz rd2`;let g=document.createElement(`div`);g.className=`viz__stage`,h.appendChild(g);let _=X(`svg`,{class:`viz__svg rd2__svg`,viewBox:`0 0 ${d} 416`,role:`img`,"aria-label":`删除排序链表中重复元素的推演动画：${a.map(e=>i[e]).join(` → `)}`});g.appendChild(_);let v=X(`g`,{class:`rd2-note`}),y=X(`line`,{class:`rd2-note__line`}),b=X(`text`,{class:`rd2-note__text`,x:d/2,y:Ra});v.append(y,b),_.appendChild(v),_.appendChild(X(`circle`,{class:`rd2-null__ring`,cx:m,cy:ja,r:14}));let x=X(`text`,{class:`rd2-null__text`,x:m,y:ja});x.textContent=`∅`,_.appendChild(x);let S=X(`line`,{class:`rd2-lead rd2-lead--curr`}),C=X(`line`,{class:`rd2-lead rd2-lead--prev`});_.append(S,C);let w=X(`g`,{class:`rd2-edges`});_.appendChild(w);let T=[];function E(e){for(;T.length<=e;){let e=X(`g`,{class:`rd2-edge`}),t=X(`line`,{class:`rd2-edge__line`}),n=X(`path`,{class:`rd2-edge__head`});e.append(t,n),w.appendChild(e),T.push({g:e,line:t,head:n})}return T[e]}function D(e,t,n){let r=f(t)+Ea+3,i=f(n),a=ja;e.line.setAttribute(`x1`,r),e.line.setAttribute(`y1`,a),e.line.setAttribute(`x2`,i-9),e.line.setAttribute(`y2`,a),e.head.setAttribute(`d`,`M ${i} ${a} L ${i-9} ${a-5.5} L ${i-9} 179.5 Z`)}function O(e,t){let n=f(t)+Ea+3,r=m-14,i=ja;e.line.setAttribute(`x1`,n),e.line.setAttribute(`y1`,i),e.line.setAttribute(`x2`,r-9),e.line.setAttribute(`y2`,i),e.head.setAttribute(`d`,`M ${r} ${i} L ${r-9} ${i-5.5} L ${r-9} 179.5 Z`)}let k=X(`g`,{class:`rd2-arc`}),A=X(`path`,{class:`rd2-arc__line`}),j=X(`path`,{class:`rd2-arc__head`}),M=X(`rect`,{class:`rd2-arc__tag-bg`,x:-66,y:-9,width:132,height:18,rx:6}),N=X(`text`,{class:`rd2-arc__tag`,x:0,y:0});k.append(A,j,M,N),_.appendChild(k);let P=X(`g`,{class:`rd2-dupframe`}),F=X(`rect`,{class:`rd2-dupframe__box`,x:0,y:0,width:0,height:0,rx:14}),I=X(`rect`,{class:`rd2-dupframe__tag-bg`,x:-50,y:-9,width:100,height:18,rx:6}),L=X(`text`,{class:`rd2-dupframe__tag`,x:0,y:0});P.append(F,I,L),_.appendChild(P);let R=[];for(let e=0;e<c;e+=1){let t=X(`g`,{class:`rd2-node${e===Ta?` rd2-node--dummy`:``}`});t.appendChild(X(`rect`,{class:`rd2-node__box`,x:f(e),y:Aa,width:Ea,height:Da,rx:9}));let n=X(`text`,{class:`rd2-node__value`,x:p(e),y:ja});n.textContent=e===Ta?`dummy`:String(i[a[u(e)]]),t.appendChild(n),_.appendChild(t),R.push(t)}function z(e,t){let n=X(`g`,{class:`rd2-chip rd2-chip--${e}`});n.appendChild(X(`rect`,{class:`rd2-chip__box`,x:-58/2,y:-24/2,width:Ma,height:Na}));let r=X(`text`,{class:`rd2-chip__text`,x:0,y:0});return r.textContent=t,n.appendChild(r),n}let B=z(`curr`,`curr`),V=z(`prev`,`prev`);_.append(B,V);let H=X(`g`,{class:`rd2-verdict`}),ee=X(`rect`,{class:`rd2-verdict__box`,x:(d-264)/2,y:za-18,width:264,height:36,rx:18}),te=X(`text`,{class:`rd2-verdict__text`,x:d/2,y:za});H.append(ee,te),_.appendChild(H);let U=document.createElement(`p`);U.className=`viz__desc`,U.setAttribute(`aria-live`,`polite`),h.appendChild(U);let W=Q();h.appendChild(W.root),e.textContent=``,e.appendChild(h);let G=null,ne=e=>e>=s?{x:m,onNull:!0}:{x:p(l(e)),onNull:!1};function re(e){let t=new Set(e.removed),n=[];for(let e=0;e<s;e+=1)t.has(e)||n.push(e);let r=new Map,i=e.prev,a=e.curr;for(let e=0;e<n.length;e+=1){let t=n[e],i=e+1<n.length?n[e+1]:-1;r.set(l(t),i===-1?-1:l(i))}if(r.set(Ta,n.length?l(n[0]):-1),i>=-1){let e=i===-1?Ta:l(i),t=a>=s?-1:l(a);r.set(e,t)}for(let e of t)r.set(l(e),null);return r}function K(e){let t=(e.phase===`unlink`||e.phase===`advance`)&&e.removedNow.length>0;if(k.classList.toggle(`is-on`,t),!t)return;let n=e.prev===-1?Ta:l(e.prev),r=e.curr>=s?null:l(e.curr);if(r===null)return;let i=f(n)+Ea,a=f(r);if(a<=i)return;let o=i+(a-i)*.28,c=i+(a-i)*.72;A.setAttribute(`d`,`M ${i+3} ${ja} C ${o} ${ja-58}, ${c} ${ja-58}, ${a-9} ${ja}`),j.setAttribute(`d`,`M ${a} ${ja} L ${a-9} ${ja-5.5} L ${a-9} 179.5 Z`);let u=(i+a)/2;M.setAttribute(`x`,u-66),M.setAttribute(`y`,ja-58-9),N.setAttribute(`x`,u),N.setAttribute(`y`,ja-58),N.textContent=`prev.next = curr`}function ie(e,t){let n=new Set(t.removed),r=e=>t.dupStart!==null&&t.dupEnd!==null&&e>=t.dupStart&&e<t.dupEnd;for(let e=0;e<c;e+=1){if(e===Ta){R[e].classList.toggle(`is-prev`,t.prev===-1),R[e].classList.toggle(`is-curr`,!1);continue}let i=u(e);R[e].classList.toggle(`is-cut`,n.has(i)),R[e].classList.toggle(`is-dup`,r(i)&&!n.has(i)),R[e].classList.toggle(`is-prev`,t.prev===i),R[e].classList.toggle(`is-curr`,t.curr===i)}let s=re(t),d=0;for(let[e,t]of s){if(t===null)continue;let n=E(d);d+=1,n.g.classList.add(`is-on`),t===-1?O(n,e):D(n,e,t)}for(let e=d;e<T.length;e+=1)T[e].g.classList.remove(`is-on`);K(t);let m=t.dupStart!==null&&t.dupEnd!==null&&t.dupEnd>t.dupStart;if(P.classList.toggle(`is-on`,m),m){let e=l(t.dupStart),n=l(t.dupEnd-1);F.setAttribute(`x`,f(e)-La),F.setAttribute(`y`,Aa-La),F.setAttribute(`width`,f(n)+Ea-f(e)+La*2),F.setAttribute(`height`,64);let r=(f(e)+f(n)+Ea)/2,i=t.dupEnd-t.dupStart;L.textContent=`重复段 ${i} 个`,I.setAttribute(`x`,r-50),I.setAttribute(`y`,Ia-9),L.setAttribute(`x`,r),L.setAttribute(`y`,Ia)}let h=ne(t.curr),g=t.prev===-1?Ta:l(t.prev),_=p(g);if(B.setAttribute(`transform`,`translate(${h.x} ${Pa})`),V.setAttribute(`transform`,`translate(${_} ${Fa})`),B.style.opacity=`1`,V.style.opacity=`1`,S.setAttribute(`x1`,h.x),S.setAttribute(`x2`,h.x),S.setAttribute(`y1`,100),S.setAttribute(`y2`,Aa-2),C.setAttribute(`x1`,_),C.setAttribute(`x2`,_),C.setAttribute(`y1`,Fa-Na/2),C.setAttribute(`y2`,200),m){let e=p(l(t.dupEnd-1));b.textContent=`curr 冲进重复段，prev 原地等 —— 错位就是这么来的`,y.setAttribute(`x1`,e),y.setAttribute(`x2`,e),y.setAttribute(`y1`,57),y.setAttribute(`y2`,Ia-12),v.style.opacity=`1`}else v.style.opacity=`0`;H.setAttribute(`class`,`rd2-verdict`);let x=`准备开始`;if(t.phase===`done`){H.classList.add(`is-ok`);let e=t.kept.map(e=>i[a[e]]).join(` → `);x=e?`✓ ${e||`空`}`:`✓ 全部被删，返回空链表`}else t.phase===`unlink`?(H.classList.add(`is-cut`),x=o===`keep-one`?`摘掉多余的，留一个`:`整段摘掉，一个不留`):t.phase===`dup-start`?x=`发现重复段`:t.phase===`skip`?x=`curr 在重复段里往前冲…`:t.phase===`scan`||t.phase===`advance`?x=`两个指针一起前进`:t.phase===`init`&&(x=`架好 dummy 与 prev / curr`);te.textContent=x,Z(U,t.desc)}let ae=ht({steps:n,controls:W,intervalMs:Va,onRender:ie});ae.jumpTo(Math.trunc(t.initialStep)||0);let oe=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!oe&&typeof IntersectionObserver==`function`&&(G=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){G.disconnect(),G=null,ae.play();return}},{threshold:.35}),G.observe(h)),{destroy(){G&&=(G.disconnect(),null),ae.destroy(),e.textContent=``,delete e.dataset.rd2Mounted,document.getElementById(wa)?.remove()}}}function Ga(e){let t=Array.isArray(e)?e:[],n=[];if(t.length===0||t[0]===null||t[0]===void 0)return{nodes:n,root:-1};let r=new Map,i=[];for(let e=0;e<t.length;e+=1)t[e]===null||t[e]===void 0||(r.set(e,n.length),i.push(e),n.push({id:n.length,value:t[e],left:null,right:null,parent:-1,side:null,depth:0,col:0}));if(n.length===0)return{nodes:n,root:-1};for(let e of n){let a=i[e.id];for(let[i,o]of[[1,`L`],[2,`R`]]){let s=2*a+i;if(s>=t.length)continue;let c=r.get(s);c!==void 0&&(n[c].parent=e.id,n[c].side=o,n[c].depth=e.depth+1,o===`L`?e.left=c:e.right=c)}}let a=new Map;for(let e of n)a.has(e.depth)||a.set(e.depth,[]),a.get(e.depth).push(e.id);for(let e of a.values())e.sort((e,t)=>e-t),e.forEach((e,t)=>{n[e].col=t});return{nodes:n,root:0}}function Ka(e={}){let t=Array.isArray(e.values)?e.values:[3,9,20,null,null,15,7],n=e.mode===`zigzag`?`zigzag`:`plain`,{nodes:r,root:i}=Ga(t),a=e=>r[e].value,o=[],s=[],c=[],l=[],u=(e,t,r={})=>c.push({phase:e,desc:t,queue:[...l],levelIndex:-1,levelSize:0,consumed:0,current:null,enqueued:[],levelValues:[],results:o.map(e=>[...e]),rightView:[...s],mode:n,zigzagReversed:!1,done:!1,...r});if(i===-1)return u(`done`,"树是空的（`root` 是 `null`）—— 没有任何节点，直接返回空数组 `[]`。",{done:!0}),c;u(`init`,'把根节点 `3` 入队。**队列是 BFS 的全部内存** —— 它是一个"待处理却还没轮到"的缓冲区，而且天然按层排队：同一层的节点一定挨在一起，且比下一层先出队。 这正是层序遍历能"分层输出"的物理基础。',{enqueued:[i]}),l.push(i);let d=0;for(;l.length>0;){let e=l.length,t=n===`zigzag`&&d%2==1,i=[],c=e=>{t?i.unshift(e):i.push(e)};u(`enter`,`**进第 ${d} 层之前，先做一件最关键的事：把当前队列长度存下来。** 此刻队列里是 \`[${l.map(a).join(`, `)}]\`，所以 \`size = ${e}\` —— 这 ${e} 个节点就是第 ${d} 层的**全部成员**。 为什么要存：接下来的内层循环会一边出队、一边把左右孩子入队，队列长度是**一直在变的**。如果拿实时长度当循环条件，下一层的节点会立刻被卷进来，层就分不开了。`+(t?` 这是锯齿变体的奇数层 —— 顺序要**反过来**，所以这一层的值用头插收集。`:``),{levelIndex:d,levelSize:e,levelValues:[...i],zigzagReversed:t});for(let n=0;n<e;n+=1){let o=l.shift(),s=r[o],f=[];if(s.left!==void 0&&s.left!==null&&f.push(s.left),s.right!==void 0&&s.right!==null&&f.push(s.right),c(s.value),u(`consume`,`出队第 ${n+1} / ${e} 个节点：\`${s.value}\`。 把它记进第 ${d} 层的结果里`+(t?`（头插到前面，因为这一层要从右往左）`:``)+(f.length?`。 它有两个孩子要处理：${f.map(e=>`\`${a(e)}\``).join(` 和 `)} —— 下面一步入队。`:`。 它是叶子节点，没有孩子要入队 —— 队列少了一个、没补上。`)+` 已出队 ${n+1} 个，这一层还剩 ${e-n-1} 个，**出队的次数由进层时那个 \`size\` 决定，跟此刻队列多长无关。**`,{levelIndex:d,levelSize:e,consumed:n+1,current:o,levelValues:[...i],zigzagReversed:t}),f.length){for(let e of f)l.push(e);u(`enqueue`,`把 \`${s.value}\` 的${f.map(e=>` \`${a(e)}\``).join(` 和`)} 入队。**注意它们排到了队尾** —— 在同层还没处理完的节点后面，也就是第 ${d+1} 层的位置。 队列"同层在前、下层在后"的次序，就是分层这件事的全部玄机。`,{levelIndex:d,levelSize:e,consumed:n+1,current:o,enqueued:f,levelValues:[...i],zigzagReversed:t})}}o.push([...i]),s.push(i[i.length-1]),u(`close`,`第 ${d} 层的 ${e} 个节点全部出队，收工。 这一层的结果是 \`[${i.join(`, `)}]\``+(t?`（已按锯齿要求从右往左）`:``)+`。 此刻队列里是 \`[${l.map(a).join(`, `)}]\` —— `+(l.length?`正好是第 ${d+1} 层，下一轮的 \`size\` 就会等于 ${l.length}。`:`空了。`)+(n===`zigzag`?` 下一层的收集方向要**反过来**（锯齿的本质：只改值的方向，不改队列的方向）。`:``),{levelIndex:d,levelSize:e,consumed:e,levelValues:[...i],zigzagReversed:t}),d+=1}return u(`done`,`队列空了，遍历结束。返回 \`[${o.map(e=>`[${e.join(`, `)}]`).join(`, `)}]\`。\n\n- 一共 ${o.length} 层\n- 每层的节点数：${o.map(e=>e.length).join(`、`)}\n- 锯齿变体的结果：\`[${o.map((e,t)=>`[${(n===`zigzag`?e:t%2==1?[...e].reverse():e).join(`, `)}]`).join(`, `)}]\`\n- 右视图（每层最后一个）：\`[${s.join(`, `)}]\`\n\n**每个节点恰好入队一次、出队一次**，所以整个遍历是线性时间；队列里最多压着一层多的节点（最宽的那层 + 它的孩子），空间是 \`O(n)\`。`,{levelIndex:d,done:!0,levelValues:o[o.length-1]??[]}),c}var qa=`lvo-styles`,Ja=22,Ya=84,Xa=66,Za=56,Qa=54,$a=40,eo=110,to=30,no=1150,ro=`
.lvo {
  --lvo-node: var(--text-primary, #1f2a24);
  --lvo-edge: var(--text-secondary, #657168);
  --lvo-hot: var(--accent-secondary, #a45f45);
  --lvo-ok: var(--accent, #3f6b57);
  --lvo-queue: var(--accent, #3f6b57);
  --lvo-dim: #9aa39c;
}
html.theme-dark .lvo {
  --lvo-hot: #e0a06a;
  --lvo-ok: #7fc3a4;
  --lvo-queue: #7fc3a4;
  --lvo-dim: #6c766e;
}
.lvo__svg { min-width: 620px; }

/* ── 树 ───────────────────────────────────────────────────────────────── */
.lvo-edge__line { stroke: var(--lvo-edge, #657168); stroke-width: 1.6; fill: none; opacity: 0.75; }
.lvo-node__circle {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.24s ease, stroke-width 0.24s ease, fill 0.24s ease;
}
.lvo-node__value {
  fill: var(--lvo-node, #1f2a24);
  font-size: 16px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  transition: fill 0.24s ease;
}
/* 已经出过队（本轮之前的层）*/
.lvo-node.is-done .lvo-node__circle { stroke: var(--lvo-ok, #3f6b57); stroke-width: 1.8; fill: rgba(63, 107, 87, 0.07); }
.lvo-node.is-done .lvo-node__value { fill: var(--lvo-ok, #3f6b57); }
/* 正在被处理的那个节点 */
.lvo-node.is-current .lvo-node__circle {
  stroke: var(--lvo-hot, #a45f45);
  stroke-width: 3;
  fill: rgba(164, 95, 69, 0.13);
}
.lvo-node.is-current .lvo-node__value { fill: var(--lvo-hot, #a45f45); font-weight: 700; }
/* 这一层里还没出队的节点 */
.lvo-node.is-pending .lvo-node__circle { stroke: var(--lvo-queue, #3f6b57); stroke-width: 2.2; }
/* 刚入队的孩子 */
.lvo-node.is-fresh .lvo-node__circle {
  stroke: var(--lvo-queue, #3f6b57);
  stroke-width: 2.6;
  fill: rgba(63, 107, 87, 0.1);
}

/* 层标注（左侧 "第 0 层" 之类）*/
.lvo-layer__text {
  fill: var(--text-secondary, #657168);
  font-size: 12px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lvo-layer__line { stroke: var(--glass-border, #dce2da); stroke-width: 1; stroke-dasharray: 3 4; opacity: 0.8; }
.lvo-layer__text.is-active { fill: var(--lvo-hot, #a45f45); }
.lvo-layer__line.is-active { stroke: var(--lvo-hot, #a45f45); stroke-dasharray: none; opacity: 1; }

/* ── 队列 ─────────────────────────────────────────────────────────────── */
.lvo-q__label {
  fill: var(--text-secondary, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lvo-q__cell {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.24s ease, fill 0.24s ease, opacity 0.24s ease;
}
.lvo-q__value {
  fill: var(--lvo-node, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 属于"当前这一层"的格子 */
.lvo-q__cell.is-layer { stroke: var(--lvo-hot, #a45f45); stroke-width: 2.2; }
.lvo-q__value.is-layer { fill: var(--lvo-hot, #a45f45); }
/* 这一层里已经出过队的（画成淡出）*/
.lvo-q__cell.is-out { stroke: var(--lvo-dim, #9aa39c); opacity: 0.34; stroke-dasharray: 4 3; }
.lvo-q__value.is-out { fill: var(--lvo-dim, #9aa39c); opacity: 0.34; }
/* 刚入队的 */
.lvo-q__cell.is-fresh { stroke: var(--lvo-queue, #3f6b57); stroke-width: 2.4; fill: rgba(63, 107, 87, 0.1); }

/* 队首标记 */
.lvo-q__head {
  fill: var(--lvo-hot, #a45f45);
  font-size: 11px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lvo-q__headline { stroke: var(--lvo-hot, #a45f45); stroke-width: 1.4; }

/* "这一层 size = n" 的括号标注 */
.lvo-brace__line { stroke: var(--lvo-hot, #a45f45); stroke-width: 1.8; fill: none; }
.lvo-brace__text {
  fill: var(--lvo-hot, #a45f45);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lvo-brace { opacity: 0; transition: opacity 0.24s ease; }
.lvo-brace.is-on { opacity: 1; }

/* ── 结果累积 ─────────────────────────────────────────────────────────── */
.lvo-res__title {
  fill: var(--text-secondary, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lvo-res__text {
  fill: var(--lvo-node, #1f2a24);
  font-size: 14px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lvo-res__text.is-active { fill: var(--lvo-hot, #a45f45); }
.lvo-res__text.is-done { fill: var(--lvo-ok, #3f6b57); }

/* 空树提示 */
.lvo-empty__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  text-anchor: middle;
  dominant-baseline: central;
}

@media (prefers-reduced-motion: reduce) {
  .lvo-node__circle, .lvo-q__cell, .lvo-brace { transition: none; }
}
`;function io(){if(pt(),document.getElementById(qa))return;let e=document.createElement(`style`);e.id=qa,e.textContent=ro,document.head.appendChild(e)}function ao(e,t={}){if(!e||e.dataset.lvoMounted===`1`)return{destroy(){}};e.dataset.lvoMounted=`1`,io();let n=Ka(t),r=t.autoplay!==!1,{nodes:i,root:a}=Ga(Array.isArray(t.values)?t.values:[3,9,20,null,null,15,7]),o=e=>i[e].value,s=i.reduce((e,t)=>Math.max(e,t.depth),0),c=new Map;c.set(a,[]);for(let e of i)e.parent!==-1&&c.set(e.id,[...c.get(e.parent)??[],e.side]);let l=e=>56*2**Math.max(0,s-e),u=e=>{let t=0;for(let n of c.get(e.id)??[])t=t*2+ +(n===`R`);return(t+.5)*l(e.depth)},d=2**s*56,f=Math.max(620,96+d+80),p=(f-d)/2,m=Xa+s*Ya+Ja+Za,h=m+81+34,g=h+Math.max(1,s+1)*22+18,_=e=>{let t=i[e];return{x:p+u(t),y:Xa+t.depth*Ya}},v=e=>Xa+e*Ya,y=Math.max(1,...n.map(e=>e.queue.length),...n.map(e=>e.queue.length+e.enqueued.length)),b=e=>eo+e*64,x=document.createElement(`div`);x.className=`viz lvo`;let S=document.createElement(`div`);S.className=`viz__stage`,x.appendChild(S);let C=X(`svg`,{class:`viz__svg lvo__svg`,viewBox:`0 0 ${f} ${g}`,role:`img`,"aria-label":`层序遍历推演动画`});if(S.appendChild(C),a===-1){let t=X(`text`,{class:`lvo-empty__text`,x:f/2,y:g/2});return t.textContent=`空树 —— 直接返回 []`,C.appendChild(t),x.appendChild(w()),x.appendChild(Q().root),e.textContent=``,e.appendChild(x),{destroy(){e.textContent=``,delete e.dataset.lvoMounted,document.getElementById(qa)?.remove()}}}function w(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let T=[];for(let e=0;e<=s;e+=1){let t=v(e),n=X(`line`,{class:`lvo-layer__line`,x1:62,y1:t,x2:p+d+14,y2:t}),r=X(`text`,{class:`lvo-layer__text`,x:56,y:t});r.textContent=`第 ${e} 层`,C.append(n,r),T.push({line:n,t:r})}let E=X(`g`,{class:`lvo-edges`});C.appendChild(E);for(let e of i)for(let t of[e.left,e.right]){if(t==null)continue;let n=_(e.id),r=_(t),i=X(`line`,{class:`lvo-edge__line`,x1:n.x,y1:n.y+Ja,x2:r.x,y2:r.y-Ja});E.appendChild(i)}let D=new Map;for(let e of i){let t=_(e.id),n=X(`g`,{class:`lvo-node`});n.setAttribute(`transform`,`translate(${t.x} ${t.y})`),n.appendChild(X(`circle`,{class:`lvo-node__circle`,cx:0,cy:0,r:Ja}));let r=X(`text`,{class:`lvo-node__value`,x:0,y:0});r.textContent=String(e.value),n.appendChild(r),C.appendChild(n),D.set(e.id,n)}let O=X(`text`,{class:`lvo-q__label`,x:to,y:m+5});O.textContent=`queue`,C.appendChild(O);let k=[];for(let e=0;e<y;e+=1){let t=X(`g`,{class:`lvo-q__cell-g`});t.setAttribute(`transform`,`translate(${b(e)} ${m-$a/2})`);let n=X(`rect`,{class:`lvo-q__cell`,x:0,y:0,width:Qa,height:$a,rx:8}),r=X(`text`,{class:`lvo-q__value`,x:Qa/2,y:$a/2});t.append(n,r),C.appendChild(t),k.push({g:t,rect:n,t:r})}let A=X(`line`,{class:`lvo-q__headline`}),j=X(`text`,{class:`lvo-q__head`});j.textContent=`head`,C.append(A,j);let M=X(`g`,{class:`lvo-brace`}),N=X(`path`,{class:`lvo-brace__line`}),P=X(`text`,{class:`lvo-brace__text`});M.append(N,P),C.appendChild(M);let F=X(`text`,{class:`lvo-res__title`,x:to,y:h});F.textContent=`res`,C.appendChild(F);let I=[];for(let e=0;e<Math.max(1,s+1);e+=1){let t=X(`text`,{class:`lvo-res__text`,x:eo,y:h+e*22});C.appendChild(t),I.push(t)}let L=w();x.appendChild(L);let R=Q();x.appendChild(R.root),e.textContent=``,e.appendChild(x);let z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;function B(e,t){let n=new Set(t.queue),r=new Set(t.enqueued),a=Math.max(0,t.levelSize-t.consumed);for(let[e,a]of D){let o=i[e],s=t.current===e,c=r.has(e),l=t.levelIndex>=0&&o.depth<t.levelIndex&&!s,u=t.levelIndex>=0&&o.depth===t.levelIndex&&n.has(e)&&!c&&!s;a.classList.toggle(`is-done`,l),a.classList.toggle(`is-current`,s),a.classList.toggle(`is-pending`,u),a.classList.toggle(`is-fresh`,c)}if(T.forEach(({line:e,t:n},r)=>{let i=r===t.levelIndex;e.classList.toggle(`is-active`,i),n.classList.toggle(`is-active`,i)}),k.forEach((e,n)=>{let i=t.queue[n];if(i===void 0){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`,e.t.textContent=String(o(i));let s=r.has(i),c=t.levelIndex>=0&&t.phase!==`init`,l=c&&!s&&n>=a;e.rect.setAttribute(`class`,`lvo-q__cell${s?` is-fresh`:c?` is-layer`:``}${l?` is-out`:``}`),e.t.setAttribute(`class`,`lvo-q__value${s||c?` is-layer`:``}${l?` is-out`:``}`)}),t.queue.length){let e=b(0)+Qa/2;A.setAttribute(`x1`,e),A.setAttribute(`x2`,e),A.setAttribute(`y1`,m+34),A.setAttribute(`y2`,m+42),j.setAttribute(`x`,e),j.setAttribute(`y`,m+48),A.style.opacity=`1`,j.style.opacity=`1`}else A.style.opacity=`0`,j.style.opacity=`0`;if(t.levelIndex>=0&&t.levelSize>0&&t.phase!==`init`){let e=b(0)-5,n=b(t.levelSize-1)+Qa+5,r=m+68;N.setAttribute(`d`,`M ${e} ${r-7} L ${e} ${r} L ${n} ${r} L ${n} ${r-7}`),P.setAttribute(`x`,(e+n)/2),P.setAttribute(`y`,m+81),P.textContent=`这一层 size = ${t.levelSize}`,M.classList.add(`is-on`)}else M.classList.remove(`is-on`);I.forEach((e,n)=>{let r=t.results[n];if(!r){e.textContent=``,e.setAttribute(`class`,`lvo-res__text`);return}e.textContent=`[${r.join(`, `)}]`;let i=n===t.levelIndex&&t.phase===`close`;e.setAttribute(`class`,`lvo-res__text${i?` is-done`:` is-active`}`)}),Z(L,t.desc)}let V=ht({steps:n,controls:R,intervalMs:no,onRender:B});V.jumpTo(Math.trunc(t.initialStep)||0);let H=null;return r&&!z&&typeof IntersectionObserver==`function`&&(H=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){H.disconnect(),H=null,V.play();return}},{threshold:.35}),H.observe(x)),{destroy(){H&&=(H.disconnect(),null),V.destroy(),e.textContent=``,delete e.dataset.lvoMounted,document.getElementById(qa)?.remove()}}}function oo(e={}){let{nodes:t,root:n}=Ga(Array.isArray(e.values)?e.values:[3,5,1,6,2,0,8,null,null,7,4]);if(n===-1)return[{phase:`done`,desc:"**空树**，直接返回 `null`。",stack:[],current:null,returning:null,returnSource:`null`,memo:{},leftOf:{},rightOf:{},depth:-1,maxDepth:0,found:[],answer:null,done:!0}];let r=e=>e==null?null:t[e].value,i=new Map;for(let e of t)i.set(e.value,e.id);let a=e.p===void 0||e.p===null?i.get(6):i.get(e.p),o=e.q===void 0||e.q===null?i.get(4):i.get(e.q),s=Number.isInteger(e.maxFrames)?e.maxFrames:400,c=[],l={},u={},d={},f=[],p=null,m=0,h=0,g=e=>{if(e==null)return`null`;let t=r(e);return e===a?`${t}（p）`:e===o?`${t}（q）`:String(t)},_=e=>e==null?"`null`（这棵子树里一个都没找到）":e===a?`\`${r(e)}\` —— **这是 p 本身，向上当成"p 在这里"的标记**（它不是答案，只是信使）`:e===o?`\`${r(e)}\` —— **这是 q 本身，向上当成"q 在这里"的标记**`:`\`${r(e)}\` —— **这就是答案（LCA），继续向上冒就行了**`,v=(e,t,n={})=>{c.push({phase:e,desc:t,stack:y.map(e=>({id:e.id,stage:e.stage})),current:null,returning:null,returnSource:`null`,memo:{...l},leftOf:{...u},rightOf:{...d},depth:y.length-1,maxDepth:m,found:[...f],answer:p,done:e===`done`,...n})},y=[];for(v(`init`,`要找 \`${g(a)}\` 和 \`${g(o)}\` 的最近公共祖先。**用一个显式栈模拟递归**：每次调用 \`dfs(node)\` 就压栈，返回就出栈。栈底是根 \`${r(n)}\`，栈越深说明递归钻得越深。`,{current:n}),y.push({id:n,stage:`enter`,from:null});y.length>0&&(h+=1,!(h>s));){let e=y[y.length-1],n=t[e.id];if(m=Math.max(m,y.length-1),e.stage===`enter`){if(e.id===a||e.id===o){let t=e.id===a;l[e.id]=e.id,f.includes(e.id)||f.push(e.id),v(`hit`,`进入 \`${g(e.id)}\` —— **命中！**这就是 \`node is p or node is q\` 那一行。**命中就立刻返回，不再往下探它的子树**：如果另一个目标在它的子树里，那它自己就是答案（"一个节点也可以是它自己的祖先"）；如果不在，它也只是个"我在这儿"的标记。两种情况都只需要把**它自己**往上报。`,{current:e.id,returning:e.id,returnSource:t?`p`:`q`});let n=e.id;y.pop(),S(e,n);continue}if(n.left===null&&n.right===null){l[e.id]=null,v(`return`,`进入 \`${r(e.id)}\` —— **叶子节点，而且不是 p 也不是 q**。它的子树是空的，一个目标都没有，所以向父节点汇报 \`null\`。`,{current:e.id,returning:null,returnSource:`null`}),y.pop(),S(e,null);continue}if(n.left!==null){v(`recurse`,`进入 \`${r(e.id)}\` —— 它不是 p 也不是 q，**不能立刻下结论**，必须先把左右两棵子树都问一遍（这就是"后序"的含义）。先向左子树 \`${r(n.left)}\` 递归。`,{current:e.id}),e.stage=`left`,y.push({id:n.left,stage:`enter`,from:`L`});continue}v(`recurse`,`进入 \`${r(e.id)}\` —— 它不是 p 也不是 q，**必须先问子树**。它没有左孩子，直接转向右子树 \`${r(n.right)}\` 递归。`,{current:e.id}),u[e.id]=null,e.stage=`right`,y.push({id:n.right,stage:`enter`,from:`R`});continue}if(e.stage===`left`){if(n.right!==null){v(`recurse`,`\`${r(e.id)}\` 的左子树回来了，返回值是 ${_(u[e.id])}。**先把它记在手边，接着向右子树 \`${r(n.right)}\` 递归** —— 两边都问完，才能判断自己是不是那个分叉点。`,{current:e.id,returning:u[e.id]}),e.stage=`right`,y.push({id:n.right,stage:`enter`,from:`R`});continue}d[e.id]=null,e.stage=`decide`;continue}if(e.stage===`right`){e.stage=`decide`;continue}let i=u[e.id]===void 0?null:u[e.id],s=d[e.id]===void 0?null:d[e.id];v(`collect`,`\`${r(e.id)}\` 的左右子树都回来了：左 = ${_(i)}，右 = ${_(s)}。**现在到做判断的时候了。**`,{current:e.id});let c;if(i!==null&&s!==null)c=e.id,l[e.id]=e.id,p===null&&(p=e.id),v(`decide`,`**左右都非空 —— 两个目标刚好在 \`${r(e.id)}\` 这里分叉！**这是全树唯一一个"左边有一个、右边有一个"的节点，所以它就是最近公共祖先：返回自己 \`${r(e.id)}\`。（再往上的祖先虽然也同时包含 p 和 q，但都不是"最近"的了。）`,{current:e.id,returning:e.id,returnSource:`lca`});else if(i!==null||s!==null){c=i===null?s:i,l[e.id]=c;let t=p!==null&&c===p;v(`decide`,t?`只有一个非空（${i===null?`右`:`左`}边是 ${_(c)}），**这就是已经确定的答案，继续往上冒**。\`${r(e.id)}\` 只是路过，它虽然也同时是 p 和 q 的祖先，但不是"最近"的那个。`:`只有一个非空（${i===null?`右`:`左`}边是 ${_(c)}），说明两个目标**都在同一侧子树里**，\`${r(e.id)}\` 不是分叉点。如实把这唯一的返回值往上报 —— 这里**不改变它**，只负责传递。`,{current:e.id,returning:c,returnSource:t?`lca`:c===a?`p`:`q`})}else c=null,l[e.id]=null,v(`decide`,'左右都是 `null` —— 这棵子树里 p 和 q 一个都没有，向上汇报 `null`。父节点收到它，等于"这条分支可以忽略了"。',{current:e.id,returning:null,returnSource:`null`});y.pop(),S(e,c)}let b=l[n];p===null&&b!=null&&(p=b);let x=p===null?n:p;v(`done`,p===null?`递归结束，栈空了。**返回值一路冒到根，但没有任何节点出现"左右都非空"** —— 说明 p 和 q 不在一棵树上（在本题约束下不会发生）。`:`递归结束，栈空了。最终从根 \`${r(n)}\` 冒出来的返回值是 \`${r(x)}\`，它就是 \`${g(a)}\` 和 \`${g(o)}\` 的**最近公共祖先**。`,{current:x,returning:x,returnSource:`lca`,done:!0});function S(e,t){if(e.from===null)return;let n=y[y.length-1];n&&(e.from===`L`?u[n.id]=t:d[n.id]=t)}return c}var so=`lca-styles`,co=24,lo=82,uo=62,fo=58,po=26,mo=44,ho=30,go=214,_o=1250,vo=`
.lca {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.lca__svg { width: 100%; height: auto; display: block; }

/* ── 节点 ─────────────────────────────────────────────────────────────── */
.lca-node__circle {
  fill: var(--lca-fill, #ffffff);
  stroke: var(--lca-line, #9aa39c);
  stroke-width: 2;
}
.lca-node__value {
  fill: var(--lca-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 树上挂的"返回值"小标签 */
.lca-node__ret {
  fill: var(--lca-paper, #f4f2ec);
  stroke: var(--lca-line, #9aa39c);
  stroke-width: 1.5;
}
.lca-node__ret-text {
  fill: var(--lca-ink, #1f2a24);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lca-node__tag {
  fill: var(--lca-hot, #a45f45);
  font-size: 11px;
  font-weight: 700;
  text-anchor: middle;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lca-node.is-target .lca-node__circle { stroke: var(--lca-hit, #c2872f); stroke-width: 3; }
.lca-node.is-visit .lca-node__circle { stroke: var(--lca-hot, #a45f45); stroke-width: 3; }
.lca-node.is-found .lca-node__circle { fill: var(--lca-ok-fill, #eef5f1); stroke: var(--lca-ok, #3f6b57); stroke-width: 3; }
.lca-node.is-prune .lca-node__circle { stroke: var(--lca-dim, #b9b9b3); stroke-dasharray: 3 3; }
.lca-node.is-prune .lca-node__value { fill: var(--lca-dim, #b9b9b3); }

/* 分叉点的强调环 */
.lca-node__ring {
  fill: none;
  stroke: var(--lca-hot, #a45f45);
  stroke-width: 3;
  opacity: 0;
}
.lca-node.is-answer .lca-node__ring { opacity: 1; }

/* ── 边 ───────────────────────────────────────────────────────────────── */
.lca-edge { stroke: var(--lca-edge, #8b948c); stroke-width: 2; fill: none; }
.lca-edge.is-active { stroke: var(--lca-hot, #a45f45); stroke-width: 3; }
.lca-edge.is-prune { stroke: var(--lca-dim, #b9b9b3); stroke-dasharray: 4 4; }

/* ── 递归栈 ───────────────────────────────────────────────────────────── */
.lca-stack__title {
  fill: var(--lca-muted, #657168);
  font-size: 12px;
  font-weight: 700;
  text-anchor: start;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lca-frame__box {
  fill: var(--lca-frame-fill, #ffffff);
  stroke: var(--lca-line, #9aa39c);
  stroke-width: 1.5;
}
.lca-frame__text {
  fill: var(--lca-ink, #1f2a24);
  font-size: 11.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lca-frame.is-top .lca-frame__box { stroke: var(--lca-hot, #a45f45); stroke-width: 2.5; }
.lca-frame.is-top .lca-frame__text { fill: var(--lca-hot, #a45f45); font-weight: 700; }

/* ── 返回值传送带 ─────────────────────────────────────────────────────── */
.lca-flow__box {
  fill: var(--lca-ok-fill, #eef5f1);
  stroke: var(--lca-ok, #3f6b57);
  stroke-width: 2;
}
.lca-flow__text {
  fill: var(--lca-ok, #3f6b57);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lca-empty__text {
  fill: var(--lca-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function yo(){if(document.getElementById(so))return;let e=document.createElement(`style`);e.id=so,e.textContent=vo,document.head.appendChild(e)}function bo(e,t={}){if(!e||e.dataset.lcaMounted===`1`)return{destroy(){}};e.dataset.lcaMounted=`1`,yo();let n=oo(t),r=t.autoplay!==!1,{nodes:i,root:a}=Ga(Array.isArray(t.values)?t.values:[3,5,1,6,2,0,8,null,null,7,4]),o=e=>e==null||!i[e]?null:i[e].value,s=X,c=document.createElement(`div`);c.className=`viz lca`;let l=document.createElement(`div`);if(l.className=`viz__stage`,c.appendChild(l),a===-1){let t=s(`svg`,{class:`viz__svg lca__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`lca-empty__text`,x:620/2,y:120/2});return n.textContent=`空树 —— 直接返回 null`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),{destroy(){e.textContent=``,delete e.dataset.lcaMounted,document.getElementById(so)?.remove()}}}function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let d=i.reduce((e,t)=>Math.max(e,t.depth),0),f=new Map;f.set(a,[]);for(let e of i)e.parent!==-1&&f.set(e.id,[...f.get(e.parent)??[],e.side]);let p=e=>fo*2**Math.max(0,d-e),m=e=>{let t=0;for(let n of f.get(e.id)??[])t=t*2+ +(n===`R`);return(t+.5)*p(e.depth)},h=2**d*fo,g=Math.max(660,po+h+68),_=(g-h)/2,v=e=>uo+e*lo,y=e=>({x:_+m(i[e]),y:v(i[e].depth)}),b=uo+d*lo+co,x=Math.max(1,...n.map(e=>e.stack.length)),S=b+mo,C=S+x*40,w=C+22,T=w+34+26,E=po,D=go,O=s(`svg`,{class:`viz__svg lca__svg`,viewBox:`0 0 ${g} ${T}`,role:`img`,"aria-label":`最近公共祖先推演动画`});l.appendChild(O);let k=new Map;for(let e of i){if(e.parent===-1)continue;let t=y(e.parent),n=y(e.id),r=s(`path`,{class:`lca-edge`,d:`M ${t.x} ${t.y+co} L ${n.x} ${n.y-co}`});O.appendChild(r),k.set(e.id,r)}let A=[];for(let e of i){let t=y(e.id),n=s(`g`,{class:`lca-node`,transform:`translate(${t.x} ${t.y})`});n.appendChild(s(`circle`,{class:`lca-node__ring`,r:31})),n.appendChild(s(`circle`,{class:`lca-node__circle`,cx:0,cy:0,r:co}));let r=s(`text`,{class:`lca-node__value`,x:0,y:0});r.textContent=String(e.value),n.appendChild(r);let i=s(`g`,{class:`lca-node__retg`});i.appendChild(s(`rect`,{class:`lca-node__ret`,x:-26,y:-48,width:52,height:20,rx:6}));let a=s(`text`,{class:`lca-node__ret-text`,x:0,y:-38});i.appendChild(a),n.appendChild(i);let o=s(`text`,{class:`lca-node__tag`,x:0,y:39});n.appendChild(o),O.appendChild(n),A.push({g:n,retG:i,rt:a,tag:o,id:e.id})}let j=s(`text`,{class:`lca-stack__title`,x:E,y:S-12});j.textContent=`调用栈（栈底在下）`,O.appendChild(j);let M=[];for(let e=0;e<x;e+=1){let t=s(`g`,{class:`lca-frame`,transform:`translate(${E} ${C-(e+1)*40})`});t.appendChild(s(`rect`,{class:`lca-frame__box`,x:0,y:0,width:D,height:ho,rx:7}));let n=s(`text`,{class:`lca-frame__text`,x:12,y:ho/2});t.appendChild(n),O.appendChild(t),M.push({g:t,t:n})}let N=s(`rect`,{class:`lca-flow__box`,x:E,y:w,width:Math.min(560,g-E-24),height:34,rx:8});O.appendChild(N);let P=s(`text`,{class:`lca-flow__text`,x:E+Math.min(560,g-E-24)/2,y:w+34/2});O.appendChild(P);let F=u(),I=(e,t)=>Object.prototype.hasOwnProperty.call(e.memo,t);function L(e,t){if(!t)return;let n=t.stack.length?t.stack[t.stack.length-1].id:null;t.current;let r=new Set(t.stack.map(e=>e.id));for(let e of A){let{id:r,g:i,retG:a,rt:s,tag:c}=e,l=[`lca-node`];Array.isArray(t.found)&&t.found.includes(r)&&l.push(`is-target`);let u=I(t,r),d=u?t.memo[r]:void 0;u&&d===null?l.push(`is-prune`):u&&d!==null&&l.push(`is-found`),r===n&&l.push(`is-visit`),r===t.answer&&l.push(`is-answer`),i.setAttribute(`class`,l.join(` `)),u?(a.style.opacity=`1`,s.textContent=d===null?`null`:`${o(d)}`,s.setAttribute(`class`,`lca-node__ret-text`)):a.style.opacity=`0`;let f=r===t.pId,p=r===t.qId;c.textContent=f&&p?`=p=q`:f?`p`:p?`q`:``,c.style.opacity=f||p?`1`:`0`}for(let e of i){if(e.parent===-1)continue;let n=k.get(e.id),i=[`lca-edge`];r.has(e.id)&&r.has(e.parent)&&i.push(`is-active`),I(t,e.id)&&t.memo[e.id]===null&&i.push(`is-prune`),n.setAttribute(`class`,i.join(` `))}if(M.forEach((e,n)=>{let r=t.stack[n];if(!r){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`;let i=n===t.stack.length-1;e.g.setAttribute(`class`,`lca-frame${i?` is-top`:``}`);let a=r.stage===`enter`?`刚进入`:r.stage===`left`?`等右子树`:r.stage===`right`?`等返回值`:`做判断`;e.t.textContent=`${n} · dfs(${o(r.id)}) · ${a}`}),t.phase===`hit`||t.phase===`decide`||t.phase===`return`||t.phase===`done`){N.style.opacity=`1`,P.style.opacity=`1`;let e=t.returning;t.returnSource===`null`?P.textContent=t.phase===`done`?`递归结束：返回 null`:`返回 null（子树里什么都没找到）`:t.phase===`done`?P.textContent=`最终答案：${o(e)}`:t.returnSource===`lca`?P.textContent=`返回自己 ${o(e)}（这里就是分叉点）`:P.textContent=`向上返回 ${o(e)}（标记：${t.returnSource} 在这里）`}else N.style.opacity=`0.25`,P.style.opacity=`0.35`,P.textContent=`（这一帧还没有返回值）`;Z(F,t.desc)}c.appendChild(F);let R=Q();c.appendChild(R.root);let z=new Map;for(let e of i)z.set(e.value,e.id);let B=t.p===void 0||t.p===null?6:t.p,V=t.q===void 0||t.q===null?4:t.q,H=z.get(B),ee=z.get(V),te=n.map(e=>({...e,pId:H,qId:ee}));e.textContent=``,e.appendChild(c),pt();let U=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,W=ht({steps:te,controls:R,intervalMs:_o,onRender:L});W.jumpTo(Math.trunc(t.initialStep)||0);let G=null;return r&&!U&&typeof IntersectionObserver==`function`&&(G=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){G.disconnect(),G=null,W.play();return}},{threshold:.35}),G.observe(c)),{destroy(){G&&=(G.disconnect(),null),W.destroy(),e.textContent=``,delete e.dataset.lcaMounted,document.getElementById(so)?.remove()}}}function xo(e={}){let{nodes:t,root:n}=Ga(Array.isArray(e.values)?e.values:[-10,9,20,null,null,15,7]);if(n===-1)return[{phase:`done`,desc:`**空树** —— 题目保证路径至少包含一个节点，空树不在输入范围内。`,stack:[],current:null,leftGain:null,rightGain:null,rawLeft:null,rawRight:null,through:null,gain:null,gainOf:{},best:-1/0,bestNode:null,bestPath:[],depth:-1,maxDepth:0,pruned:[],done:!0}];let r=e=>e==null||t[e]===void 0?null:t[e].value,i=Number.isInteger(e.maxFrames)?e.maxFrames:400,a=[],o={},s={},c=[],l=-1/0,u=null,d=[],f=0,p=0,m=e=>{let n=e=>{let n=[],r=e;for(;r!=null&&t[r]!==void 0;){n.push(r);let e=t[r],i=e.left===null?null:s[e.left]??null,a=e.right===null?null:s[e.right]??null,o=i!==null&&i>0,c=a!==null&&a>0;if(!o&&!c)break;r=o&&c?i>=a?e.left:e.right:o?e.left:e.right}return n},r=t[e];if(!r)return[];let i=r.left===null||!((s[r.left]??0)>0)?[]:n(r.left),a=r.right===null||!((s[r.right]??0)>0)?[]:n(r.right);return[...i.reverse(),e,...a]},h=(e,t,n={})=>{a.push({phase:e,desc:t,stack:g.map(e=>({id:e.id,stage:e.stage})),current:null,leftGain:null,rightGain:null,rawLeft:null,rawRight:null,through:null,gain:null,gainOf:{...o},best:l,bestNode:u,bestPath:[...d],depth:g.length-1,maxDepth:f,pruned:[...c],done:e===`done`,...n})},g=[];for(h(`init`,`要找**最大路径和**。关键是要同时算两个不同的东西：① **向上汇报的单边贡献值** \`gain = val + max(左, 右)\`（一条胳膊，给父节点继续接）；② **以本节点为拱顶的完整路径** \`through = val + 左 + 右\`（两条胳膊，到此为止）来更新全局最优。**路径不能拐两次弯**，所以向上汇报时只能选一条胳膊 —— 这是本题全部难度的来源。另外 \`max(gain, 0)\` 会剪掉负贡献：负的胳膊接进来只会让和变小。栈底是根 \`${r(n)}\`。`,{current:n}),g.push({id:n,stage:`enter`,from:null});g.length>0&&(p+=1,!(p>i));){let e=g[g.length-1],n=t[e.id];if(f=Math.max(f,g.length-1),e.stage===`enter`){if(n.left===null&&n.right===null){o[e.id]=n.value,s[e.id]=n.value;let t=n.value,i=!1;t>l&&(l=t,u=e.id,d=m(e.id),i=!0),h(i?`update`:`leaf`,`进入 \`${r(e.id)}\` —— **叶子节点**，左右子树都不存在，两边贡献都是 \`0\`。所以以它为拱顶的路径和就是它自己：\`${t}\`；向上汇报的贡献值也是 \`${t}\`。`+(i?`**刷新了全局最优** → \`best = ${l}\`。`:`没超过当前的 \`best = ${l}\`，保持不动。`),{current:e.id,leftGain:0,rightGain:0,rawLeft:null,rawRight:null,through:t,gain:t}),g.pop();continue}if(n.left!==null){h(`recurse`,`进入 \`${r(e.id)}\` —— 它 **不能立刻下结论**：拱顶路径和要用到左右两边的贡献，所以必须**先把两棵子树都问一遍**（后序）。先向左子树 \`${r(n.left)}\` 递归。`,{current:e.id}),e.stage=`left`,g.push({id:n.left,stage:`enter`,from:`L`});continue}h(`recurse`,`进入 \`${r(e.id)}\` —— 它没有左孩子（左边贡献直接记 \`0\`），直接向右子树 \`${r(n.right)}\` 递归。`,{current:e.id}),e.stage=`right`,g.push({id:n.right,stage:`enter`,from:`R`});continue}if(e.stage===`left`){if(n.right!==null){let t=s[n.left],i=Math.max(t,0);h(`recurse`,`\`${r(e.id)}\` 的左子树回来了，原始返回值是 \`${t}\`。`+(t<0?`**它是负的 —— 剪掉！** \`max(${t}, 0) = 0\`，意思就是"这条路走进去只会更小，干脆不进去"。`:`它是非负的，保留：\`max(${t}, 0) = ${i}\`。`)+` 把左贡献 \`${i}\` 记在手边，接着向右子树 \`${r(n.right)}\` 递归。`,{current:e.id,leftGain:i,rawLeft:t}),e.stage=`right`,g.push({id:n.right,stage:`enter`,from:`R`});continue}e.stage=`decide`;continue}if(e.stage===`right`){e.stage=`decide`;continue}let i=n.left===null?null:s[n.left],a=n.right===null?null:s[n.right],p=Math.max(i===null?0:i,0),_=Math.max(a===null?0:a,0);h(`collect`,`\`${r(e.id)}\` 的左右子树都回来了：左 = \`${i===null?`（无）`:i}\` → 取 \`max(·, 0) = ${p}\`，右 = \`${a===null?`（无）`:a}\` → 取 \`max(·, 0) = ${_}\`。**现在要同时算两个量，别搞混。**`,{current:e.id,leftGain:p,rightGain:_,rawLeft:i,rawRight:a});let v=n.value+p+_,y=n.value+Math.max(p,_);o[e.id]=y,s[e.id]=y,i!==null&&i<0&&n.left!==null&&!c.includes(n.left)&&c.push(n.left),a!==null&&a<0&&n.right!==null&&!c.includes(n.right)&&c.push(n.right);let b=v>l;b&&(l=v,u=e.id,d=m(e.id));let x=i!==null&&i<0&&a!==null&&a<0?`两条胳膊都是负的、全被剪了`:i!==null&&i<0?`左胳膊是负的被剪了`:a!==null&&a<0?`右胳膊是负的被剪了`:`两条胳膊都留着`;h(b?`update`:`decide`,`**算拱顶路径（可以拐弯，两条胳膊都用）**：\`${r(e.id)} + ${p} + ${_} = ${v}\`（${x}）。`+(b?` **刷新了全局最优！** \`best\` 从 \`${l===v?`（旧值更小）`:``}\`更新为 \`${v}\` —— 这条路径以 \`${r(e.id)}\` 为最高点，不再往上接。`:` 没超过当前的 \`best = ${l}\`，保持不动。`)+` 同时**算向上汇报的贡献值（只能选一条胳膊）**：\`${r(e.id)} + max(${p}, ${_}) = ${y}\` —— 这个值交给父节点，父节点会在它那里再拐一次弯；如果这里两条胳膊都用掉，父节点再拐就**拐两次弯**了，不是一条路径。`,{current:e.id,leftGain:p,rightGain:_,rawLeft:i,rawRight:a,through:v,gain:y}),g.pop()}return h(`done`,`递归结束，栈空了。全局最优 **\`best = ${l}\`**，对应的路径以 \`${r(u)}\` 为最高点：\`${d.map(e=>r(e)).join(` → `)}\`。注意**它完全不经过根 \`${r(n)}\`** —— 题目说"路径不一定经过根节点"，而这棵树的根是 \`${r(n)}\`（负数），把根接进来只会让和变小，所以递归时根的 \`through\` 反而不是最大的。`+(l<0?" 另外 `best` 是负数 —— 说明全树都是负值，此时答案就是**最大的那个单节点**（路径至少含一个节点，不能返回空路径 0）。":``),{current:u,returnSource:`best`,through:l,gain:o[u],done:!0}),a}var So=`mps-styles`,Co=24,wo=96,To=76,Eo=58,Do=26,Oo=40,ko=46,Ao=1250,jo=`
.mps {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.mps__svg { width: 100%; height: auto; display: block; }

/* ── 节点 ─────────────────────────────────────────────────────────────── */
.mps-node__circle {
  fill: var(--mps-fill, #ffffff);
  stroke: var(--mps-line, #9aa39c);
  stroke-width: 2;
}
.mps-node__value {
  fill: var(--mps-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 节点上方挂的「贡献值」小标签 */
.mps-node__gain {
  fill: var(--mps-paper, #f4f2ec);
  stroke: var(--mps-line, #9aa39c);
  stroke-width: 1.5;
}
.mps-node__gain-text {
  fill: var(--mps-ink, #1f2a24);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 拱顶强调环 */
.mps-node__ring {
  fill: none;
  stroke: var(--mps-apex, #c2872f);
  stroke-width: 3.5;
  opacity: 0;
}

.mps-node.is-visit .mps-node__circle {
  stroke: var(--mps-hot, #a45f45);
  stroke-width: 3;
}
.mps-node.is-plus .mps-node__circle {
  fill: var(--mps-ok-fill, #eef5f1);
  stroke: var(--mps-ok, #3f6b57);
  stroke-width: 3;
}
.mps-node.is-zero .mps-node__circle {
  stroke: var(--mps-dim, #b9b9b3);
  stroke-dasharray: 3 3;
}
.mps-node.is-zero .mps-node__value {
  fill: var(--mps-dim, #b9b9b3);
}

/* 「在最优路径上」和「是拱顶」是两件事，必须分开画：
 * 最初把两者合并成同一个 class，结果终帧里 15 / 20 / 7 全戴上金圈，
 * 真正的拱顶 20 反而淹没在里面了。 */
.mps-node.is-onpath .mps-node__circle {
  fill: var(--mps-apex-fill, #fdf3e3);
  stroke: var(--mps-apex, #c2872f);
  stroke-width: 2.5;
}
.mps-node.is-apex .mps-node__ring { opacity: 1; }
.mps-node.is-apex .mps-node__circle {
  fill: var(--mps-apex-fill, #fdf3e3);
  stroke: var(--mps-apex, #c2872f);
  stroke-width: 3.5;
}

/* ── 边 ───────────────────────────────────────────────────────────────── */
.mps-edge { stroke: var(--mps-edge, #8b948c); stroke-width: 2; fill: none; }
/* 两端都在当前路径上 → 实心强调 */
.mps-edge.is-onpath {
  stroke: var(--mps-apex, #c2872f);
  stroke-width: 4;
}
.mps-edge.is-prune { stroke: var(--mps-dim, #b9b9b3); stroke-dasharray: 4 4; }

/* ── 最优路径横幅 ─────────────────────────────────────────────────────── */
.mps-banner__box {
  fill: var(--mps-apex-fill, #fdf3e3);
  stroke: var(--mps-apex, #c2872f);
  stroke-width: 2;
}
.mps-banner__label {
  fill: var(--mps-apex, #c2872f);
  font-size: 12px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mps-banner__value {
  fill: var(--mps-ink, #1f2a24);
  font-size: 20px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mps-banner__path {
  fill: var(--mps-muted, #657168);
  font-size: 12.5px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.mps-empty__text {
  fill: var(--mps-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function Mo(){if(document.getElementById(So))return;let e=document.createElement(`style`);e.id=So,e.textContent=jo,document.head.appendChild(e)}function No(e,t={}){if(!e||e.dataset.mpsMounted===`1`)return{destroy(){}};e.dataset.mpsMounted=`1`,Mo();let n=xo(t),r=t.autoplay!==!1,{nodes:i,root:a}=Ga(Array.isArray(t.values)?t.values:[-10,9,20,null,null,15,7]),o=e=>e==null||!i[e]?null:i[e].value,s=X,c=document.createElement(`div`);c.className=`viz mps`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(a===-1){let t=s(`svg`,{class:`viz__svg mps__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`mps-empty__text`,x:620/2,y:120/2});return n.textContent=`空树 —— 没有节点，路径和按 0 处理（LeetCode 保证至少一个节点）`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),{destroy(){e.textContent=``,delete e.dataset.mpsMounted,document.getElementById(So)?.remove()}}}let d=i.reduce((e,t)=>Math.max(e,t.depth),0),f=new Map;f.set(a,[]);for(let e of i)e.parent!==-1&&f.set(e.id,[...f.get(e.parent)??[],e.side]);let p=e=>Eo*2**Math.max(0,d-e),m=e=>{let t=0;for(let n of f.get(e.id)??[])t=t*2+ +(n===`R`);return(t+.5)*p(e.depth)},h=2**d*Eo,g=Math.max(660,Do+h+68),_=(g-h)/2,v=e=>To+e*wo,y=e=>({x:_+m(i[e]),y:v(i[e].depth)}),b=To+d*wo+Co+Oo,x=Math.min(600,g-Do*2),S=s(`svg`,{class:`viz__svg mps__svg`,viewBox:`0 0 ${g} ${b+ko+26}`,role:`img`,"aria-label":`二叉树最大路径和推演动画`});l.appendChild(S);let C=s(`g`,{class:`mps-edges`}),w=s(`g`,{class:`mps-nodes`}),T=s(`g`,{class:`mps-labels`});S.appendChild(C),S.appendChild(w),S.appendChild(T);let E=new Map;for(let e of i){if(e.parent===-1)continue;let t=y(e.parent),n=y(e.id),r=s(`path`,{class:`mps-edge`,d:`M ${t.x} ${t.y+Co} L ${n.x} ${n.y-Co}`});C.appendChild(r),E.set(e.id,r)}let D=e=>{if(e.parent===-1)return 0;let t=e.side===`L`?i[e.parent].right:i[e.parent].left;if(t==null)return 0;let n=Math.abs(y(e.id).x-y(t).x);if(n>=76)return 0;let r=(76-n)/2+4;return e.side===`L`?-r:r},O=[];for(let e of i){let t=y(e.id),n=s(`g`,{class:`mps-node`,transform:`translate(${t.x} ${t.y})`});n.appendChild(s(`circle`,{class:`mps-node__ring`,r:31})),n.appendChild(s(`circle`,{class:`mps-node__circle`,cx:0,cy:0,r:Co}));let r=s(`text`,{class:`mps-node__value`,x:0,y:0});r.textContent=String(e.value),n.appendChild(r),w.appendChild(n);let i=s(`g`,{class:`mps-node__gaing`,transform:`translate(${t.x+D(e)} ${t.y})`});i.appendChild(s(`rect`,{class:`mps-node__gain`,x:-32,y:-57,width:64,height:22,rx:7}));let a=s(`text`,{class:`mps-node__gain-text`,x:0,y:-46});i.appendChild(a),T.appendChild(i),O.push({g:n,gainG:i,gt:a,id:e.id})}let k=s(`g`,{class:`mps-banner`});k.appendChild(s(`rect`,{class:`mps-banner__box`,x:Do,y:b,width:x,height:ko,rx:9}));let A=s(`text`,{class:`mps-banner__label`,x:42,y:b+ko/2});A.textContent=`当前最优路径和`,k.appendChild(A);let j=s(`text`,{class:`mps-banner__value`,x:162,y:b+ko/2});k.appendChild(j);let M=s(`text`,{class:`mps-banner__path`,x:Do+x-16,y:b+ko/2});k.appendChild(M),S.appendChild(k);let N=u();function P(e,t){if(!t)return;let n=t.stack.length?t.stack[t.stack.length-1].id:null,r=new Set(t.bestPath??[]),a=new Set(t.pruned??[]),s=e=>Object.prototype.hasOwnProperty.call(t.gainOf,e);for(let e of O){let{id:i,g:o,gainG:c,gt:l}=e,u=[`mps-node`],d=s(i),f=d?t.gainOf[i]:null;d&&u.push(f>0?`is-plus`:`is-zero`),a.has(i)&&u.push(`is-zero`),i===n&&u.push(`is-visit`),r.has(i)&&u.push(`is-onpath`),i===t.bestNode&&u.push(`is-apex`),o.setAttribute(`class`,u.join(` `)),d?(c.style.opacity=`1`,l.textContent=`gain ${f}`):c.style.opacity=`0`}for(let e of i){if(e.parent===-1)continue;let n=E.get(e.id),i=[`mps-edge`];r.has(e.id)&&r.has(e.parent)&&i.push(`is-onpath`),s(e.id)&&t.gainOf[e.id]<=0&&i.push(`is-prune`),n.setAttribute(`class`,i.join(` `))}t.bestNode===null||!(t.bestPath??[]).length?(j.textContent=`—`,M.textContent=`还没算完任何一条路径`):(j.textContent=String(t.best),M.textContent=(t.bestPath??[]).map(e=>o(e)).join(` → `)),Z(N,t.desc)}c.appendChild(N);let F=Q();c.appendChild(F.root),e.textContent=``,e.appendChild(c),pt();let I=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,L=ht({steps:n,controls:F,intervalMs:Ao,onRender:P});L.jumpTo(Math.trunc(t.initialStep)||0);let R=null;return r&&!I&&typeof IntersectionObserver==`function`&&(R=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){R.disconnect(),R=null,L.play();return}},{threshold:.35}),R.observe(c)),{destroy(){R&&=(R.disconnect(),null),L.destroy(),e.textContent=``,delete e.dataset.mpsMounted,document.getElementById(So)?.remove()}}}function Po(e={}){let{nodes:t,root:n}=Ga(Array.isArray(e.values)?e.values:[3,9,20,null,null,15,7]);if(n===-1)return[{phase:`done`,desc:"**空树** —— 深度记 `0`。这是递归的出口条件，也是整道题的基线。",stack:[],current:null,leftH:null,rightH:null,height:null,heightOf:{},answer:0,depth:-1,maxDepthSeen:0,done:!0}];let r=e=>e==null||t[e]===void 0?null:t[e].value,i=Number.isInteger(e.maxFrames)?e.maxFrames:400,a=[],o={},s=null,c=0,l=0,u=[],d=(e,t,n={})=>{a.push({phase:e,desc:t,stack:u.map(e=>({id:e.id,stage:e.stage})),current:null,leftH:null,rightH:null,height:null,heightOf:{...o},answer:s,depth:u.length-1,maxDepthSeen:c,done:e===`done`,...n})};for(d(`init`,`要求**最大深度**，也就是"从根往下最多能走几层"。做法是**后序递归**：每个节点先问出左右子树各自的高度，再取较大的那个、**加 1**（加的这个 1 就是自己这一层）。注意那个 \`1\` 不能少 —— 它代表的正是"把自己算进去"。栈底是根 \`${r(n)}\`。`,{current:n}),u.push({id:n,stage:`enter`});u.length>0&&(l+=1,!(l>i));){let e=u[u.length-1],i=t[e.id];if(c=Math.max(c,u.length-1),e.stage===`enter`){if(i.left===null&&i.right===null){o[e.id]=1,e.id===n&&(s=1),d(`leaf`,`进入 \`${r(e.id)}\` —— **叶子节点**，左右子树都不存在。按定义空子树高度是 \`0\`，所以它自己的高度 = \`1 + max(0, 0) = 1\`。**叶子是整条递归链的起点** —— 高度就是从这里开始一层层往上冒的。`,{current:e.id,leftH:0,rightH:0,height:1}),u.pop();continue}let t=i.left!==null;d(`recurse`,`进入 \`${r(e.id)}\` —— 它 **还不能下结论**：自己的高度取决于子树的高度，所以必须**先下去问**。`+(t?`先向左子树 \`${r(i.left)}\` 递归。`:`它没有左孩子（左边高度直接记 \`0\`），直接向右子树 \`${r(i.right)}\` 递归。`),{current:e.id}),e.stage=t?`left`:`right`,u.push({id:t?i.left:i.right,stage:`enter`});continue}if(e.stage===`left`){if(i.right!==null){let t=o[i.left];d(`recurse`,`左子树 \`${r(i.left)}\` 回来了，报告高度 **\`${t}\`**。先把它记在手边，接着向右子树 \`${r(i.right)}\` 递归 —— **还没到算自己高度的时候**，因为 \`max\` 要两个数都拿到才敢取。`,{current:e.id,leftH:t}),e.stage=`right`,u.push({id:i.right,stage:`enter`});continue}e.stage=`decide`;continue}if(e.stage===`right`){e.stage=`decide`;continue}let a=i.left===null?0:o[i.left],l=i.right===null?0:o[i.right],f=1+Math.max(a,l);o[e.id]=f;let p=e.id===n;p&&(s=f);let m=a===l?`两边一样高，取哪个都行`:a>l?`右边 \`${l}\` 更矮，被淘汰（\`max\` 只要大的那个）`:`左边 \`${a}\` 更矮，被淘汰（\`max\` 只要大的那个）`;d(`compute`,`\`${r(e.id)}\` 的左右子树都回来了：左 **\`${a}\`**、右 **\`${l}\`**。算自己的高度：\`1 + max(${a}, ${l}) = ${f}\` —— **那个 \`1\` 是把自己这一层算上**，这是本题唯一容易漏的地方。（${m}。）`+(p?` **根算完了，答案就是它：\`${f}\`。** 注意在这之前，中间任何一帧都没有人能提前说出最终答案 —— 高度是从最深的叶子一层层冒上来的，必须等根拿到左右两个数才定得下来。`:` 把这个高度汇报给父节点。`),{current:e.id,leftH:a,rightH:l,height:f}),u.pop()}return d(`done`,`递归结束，栈空了。**最大深度 = \`${s}\`**。回头看整条链路：叶子报 \`1\` → 父节点 \`1 + max(…) \` → 一层层加 1 → 根报出最终答案。**每个节点只被访问一次**，所以是 O(n)。另外注意 104 全程**没有任何全局变量** —— 答案不是"一路取 max 攒出来的"，而是根那一次计算的返回值本身。（对比 LC 124 的 \`best\`：那个才是需要一路刷新的全局最优。）`,{current:n,height:s,done:!0}),a}var Fo=`md-styles`,Io=24,Lo=96,Ro=78,zo=26,Bo=40,Vo=52,Ho=1150,Uo=48,Wo=`
.md {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.md__svg { width: 100%; height: auto; display: block; }

/* ── 节点 ─────────────────────────────────────────────────────────────── */
.md-node__circle {
  fill: var(--md-fill, #ffffff);
  stroke: var(--md-line, #9aa39c);
  stroke-width: 2;
}
.md-node__value {
  fill: var(--md-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 节点正上方的高度标签：算完了才出现 */
.md-node__htag {
  fill: var(--md-paper, #f4f2ec);
  stroke: var(--md-line, #9aa39c);
  stroke-width: 1.5;
}
.md-node__htag-text {
  fill: var(--md-ink, #1f2a24);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 当前焦点节点的强调环 */
.md-node__ring {
  fill: none;
  stroke: var(--md-hot, #a45f45);
  stroke-width: 3.5;
  opacity: 0;
}

.md-node.is-done .md-node__circle {
  fill: var(--md-ok-fill, #eef5f1);
  stroke: var(--md-ok, #3f6b57);
  stroke-width: 2.5;
}
.md-node.is-done .md-node__htag {
  stroke: var(--md-ok, #3f6b57);
}
.md-node.is-done .md-node__htag-text {
  fill: var(--md-ok, #3f6b57);
}
.md-node.is-visit .md-node__circle {
  stroke: var(--md-hot, #a45f45);
  stroke-width: 3;
}
.md-node.is-visit .md-node__ring { opacity: 1; }
/* 这一帧刚刚算出高度的节点：标签换成暖色，强调"新冒出来的那个数" */
.md-node.is-fresh .md-node__htag {
  fill: var(--md-hot-fill, #fdf1ec);
  stroke: var(--md-hot, #a45f45);
  stroke-width: 2;
}
.md-node.is-fresh .md-node__htag-text {
  fill: var(--md-hot, #a45f45);
}

/* ── 边 ───────────────────────────────────────────────────────────────── */
.md-edge { stroke: var(--md-edge, #8b948c); stroke-width: 2; fill: none; }
/* 当前递归路径上的边（栈里相邻两帧之间） */
.md-edge.is-onstack {
  stroke: var(--md-hot, #a45f45);
  stroke-width: 3.5;
}

/* ── 结果横幅 ─────────────────────────────────────────────────────────── */
.md-banner__box {
  fill: var(--md-banner-fill, #f4f2ec);
  stroke: var(--md-line, #9aa39c);
  stroke-width: 1.5;
}
.md-banner__lead {
  fill: var(--md-ok, #3f6b57);
  font-size: 17px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.md-banner__answer-label {
  fill: var(--md-muted, #657168);
  font-size: 12px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.md-banner__answer {
  fill: var(--md-ink, #1f2a24);
  font-size: 24px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 根算完之前答案未知 —— 用灰色问号强调"还说不出来" */
.md-banner__answer.is-unknown {
  fill: var(--md-dim, #b9b9b3);
}

.md-empty__text {
  fill: var(--md-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function Go(){if(document.getElementById(Fo))return;let e=document.createElement(`style`);e.id=Fo,e.textContent=Wo,document.head.appendChild(e)}function Ko(e,t={}){if(!e||e.dataset.mdMounted===`1`)return{destroy(){}};e.dataset.mdMounted=`1`,Go();let n=Po(t),r=t.autoplay!==!1,{nodes:i,root:a}=Ga(Array.isArray(t.values)?t.values:[3,9,20,null,null,15,7]),o=e=>e==null||!i[e]?null:i[e].value,s=X,c=i.length,l=document.createElement(`div`);l.className=`viz md`;let u=document.createElement(`div`);u.className=`viz__stage`,l.appendChild(u);function d(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(a===-1){let t=s(`svg`,{class:`viz__svg md__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`md-empty__text`,x:620/2,y:120/2});return n.textContent=`空树 —— 深度记 0（这就是递归的出口条件）`,t.appendChild(n),u.appendChild(t),l.appendChild(d()),l.appendChild(Q().root),e.textContent=``,e.appendChild(l),{destroy(){e.textContent=``,delete e.dataset.mdMounted,document.getElementById(Fo)?.remove()}}}let f=i.reduce((e,t)=>Math.max(e,t.depth),0),p=Math.min(120,Math.max(58,Math.round(470/2**f))),m=new Map;m.set(a,[]);for(let e of i)e.parent!==-1&&m.set(e.id,[...m.get(e.parent)??[],e.side]);let h=e=>p*2**Math.max(0,f-e),g=e=>{let t=0;for(let n of m.get(e.id)??[])t=t*2+ +(n===`R`);return(t+.5)*h(e.depth)},_=2**f*p,v=Math.max(660,zo+_+68),y=(v-_)/2,b=e=>Ro+e*Lo,x=e=>({x:y+g(i[e]),y:b(i[e].depth)}),S=Ro+f*Lo+Io+Bo,C=Math.min(620,v-zo*2),w=s(`svg`,{class:`viz__svg md__svg`,viewBox:`0 0 ${v} ${S+Vo+26}`,role:`img`,"aria-label":`二叉树最大深度推演动画`});u.appendChild(w);let T=s(`g`,{class:`md-edges`}),E=s(`g`,{class:`md-nodes`}),D=s(`g`,{class:`md-labels`});w.appendChild(T),w.appendChild(E),w.appendChild(D);let O=new Map;for(let e of i){if(e.parent===-1)continue;let t=x(e.parent),n=x(e.id),r=s(`path`,{class:`md-edge`,d:`M ${t.x} ${t.y+Io} L ${n.x} ${n.y-Io}`});T.appendChild(r),O.set(e.id,r)}let k=e=>{if(e.parent===-1)return 0;let t=e.side===`L`?i[e.parent].right:i[e.parent].left;if(t==null)return 0;let n=Math.abs(x(e.id).x-x(t).x);if(n>=56)return 0;let r=(56-n)/2+3;return e.side===`L`?-r:r},A=[];for(let e of i){let t=x(e.id),n=s(`g`,{class:`md-node`,transform:`translate(${t.x} ${t.y})`});n.appendChild(s(`circle`,{class:`md-node__ring`,r:31})),n.appendChild(s(`circle`,{class:`md-node__circle`,cx:0,cy:0,r:Io}));let r=s(`text`,{class:`md-node__value`,x:0,y:0});r.textContent=String(e.value),n.appendChild(r),E.appendChild(n);let i=s(`g`,{class:`md-node__htag-g`,transform:`translate(${t.x+k(e)} ${t.y})`});i.appendChild(s(`rect`,{class:`md-node__htag`,x:-48/2,y:-56,width:Uo,height:22,rx:7}));let a=s(`text`,{class:`md-node__htag-text`,x:0,y:-45});i.appendChild(a),D.appendChild(i),A.push({g:n,gainG:i,gt:a,id:e.id})}let j=s(`g`,{class:`md-banner`});j.appendChild(s(`rect`,{class:`md-banner__box`,x:zo,y:S,width:C,height:Vo,rx:9}));let M=s(`text`,{class:`md-banner__lead`,x:42,y:S+Vo/2});j.appendChild(M);let N=s(`text`,{class:`md-banner__answer-label`,x:zo+C-74,y:S+Vo/2});N.textContent=`最大深度`,j.appendChild(N);let P=s(`text`,{class:`md-banner__answer`,x:zo+C-16,y:S+Vo/2});j.appendChild(P),w.appendChild(j);let F=d();function I(e,t){if(!t)return;let n=t.stack.length?t.stack[t.stack.length-1].id:null,r=t.current,s=e=>Object.prototype.hasOwnProperty.call(t.heightOf,e),c=new Set;for(let e=0;e+1<t.stack.length;e+=1)c.add(t.stack[e+1].id);let l=t.height===null?null:r;for(let e of A){let{id:r,g:i,gainG:a,gt:o}=e,c=[`md-node`],u=s(r);u&&c.push(`is-done`),r===n&&c.push(`is-visit`),r===l&&c.push(`is-fresh`),i.setAttribute(`class`,c.join(` `)),u?(a.style.opacity=`1`,o.textContent=`h=${t.heightOf[r]}`):a.style.opacity=`0`}for(let e of i)e.parent!==-1&&O.get(e.id).setAttribute(`class`,c.has(e.id)?`md-edge is-onstack`:`md-edge`);t.phase===`init`?M.textContent=`从根 ${o(a)} 开始，先下去问子树`:t.phase===`recurse`?M.textContent=t.leftH===null?`进入 ${o(r)}，继续往下问`:`左子树回报 h=${t.leftH}，继续问右边`:t.phase===`leaf`?M.textContent=`${o(r)} 是叶子 → h = 1 + max(0, 0) = 1`:t.phase===`compute`?M.textContent=`${o(r)}：1 + max(${t.leftH}, ${t.rightH}) = ${t.height}`:M.textContent=t.answer===0?`空树：深度记 0`:`根 ${o(a)} 报出 h=${t.answer} —— 这就是答案`;let u=t.answer;u===null?(P.textContent=`?`,P.setAttribute(`class`,`md-banner__answer is-unknown`)):(P.textContent=String(u),P.setAttribute(`class`,`md-banner__answer`)),Z(F,t.desc)}l.appendChild(F);let L=Q();l.appendChild(L.root),e.textContent=``,e.appendChild(l),pt();let R=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,z=ht({steps:n,controls:L,intervalMs:Ho,onRender:I});z.jumpTo(Math.trunc(t.initialStep)||0);let B=null;return r&&!R&&typeof IntersectionObserver==`function`&&(B=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){B.disconnect(),B=null,z.play();return}},{threshold:.35}),B.observe(l)),l.setAttribute(`aria-description`,`共 ${c} 个节点`),{destroy(){B&&=(B.disconnect(),null),z.destroy(),e.textContent=``,delete e.dataset.mdMounted,document.getElementById(Fo)?.remove()}}}function qo(e={}){let{nodes:t,root:n}=Ga(Array.isArray(e.values)?e.values:[4,2,7,1,3,6,9]);if(n===-1)return[{phase:`done`,desc:"**空树** —— 没什么可翻的，直接返回 `None`。",current:null,swapPair:null,swapped:[],sideOf:{},stack:[],depth:-1,done:!0}];let r=e=>e==null||t[e]===void 0?null:t[e].value,i=Number.isInteger(e.maxFrames)?e.maxFrames:400,a={};for(let e of t)e.parent!==-1&&(a[e.id]=e.side);let o=(e,n)=>{for(let r of t)if(r.parent===e&&a[r.id]===n)return r.id;return null},s=[],c=[],l=[],u=0,d=(e,t,n={})=>{s.push({phase:e,desc:t,current:null,swapPair:null,swapped:[...c],sideOf:{...a},stack:l.map(e=>({id:e.id})),depth:l.length-1,done:e===`done`,...n})},f=t.length;for(d(`init`,`翻转二叉树 —— **把每个节点的两个孩子交换一次**。关键要意识到：**交换和递归的先后顺序不影响结果**，因为每个节点是各自独立地换自己的两个孩子，谁先谁后都不干涉。所以前序（先换再递归）和后序（先递归再换）都对 —— 但**交换绝不能插在两个递归中间**，那样会让已经翻好的子树白翻一遍。这棵树一共 ${f} 个节点，我们从根 \`${r(n)}\` 开始，一层层往下换。`,{current:n}),l.push({id:n,stage:`enter`});l.length>0&&(u+=1,!(u>i));){let e=l[l.length-1];if(t[e.id],e.stage===`enter`){let t=o(e.id,`L`),n=o(e.id,`R`);if(t===null&&n===null){d(`leaf`,`\`${r(e.id)}\` 是**叶子节点**，两个孩子都是空的。交换两个 \`None\` 是**空操作** —— 所以叶子在这里直接返回。这也说明：**真正发生变化的只有非叶节点**。`,{current:e.id}),l.pop();continue}t!==null&&(a[t]=`R`),n!==null&&(a[n]=`L`),c.push(e.id),d(`swap`,`\`${r(e.id)}\` —— **交换它的两个孩子**：`+(t!==null&&n!==null?`\`${r(t)}\` 和 \`${r(n)}\` 互换位置。`:t===null?`原来只有右孩子 \`${r(n)}\`，换成左孩子（另一边仍是空）。`:`原来只有左孩子 \`${r(t)}\`，换成右孩子（另一边仍是空）。`)+` 这是这一帧**唯一**发生的事，别多做也别少做。`,{current:e.id,swapPair:[t,n]}),e.stage=`left`,n!==null&&l.push({id:n,stage:`enter`});continue}if(e.stage===`left`){let t=o(e.id,`R`);t===null?e.stage=`right`:(d(`descend`,`\`${r(e.id)}\` 的左子树已经翻完，回到它身上，接着递归进**右子树** \`${r(t)}\`。注意这个"右子树"其实是**交换前那个左孩子** —— 因为这一层的交换已经发生过了，角色的名字不能想当然。`,{current:e.id}),e.stage=`right`,l.push({id:t,stage:`enter`}));continue}l.pop()}return d(`done`,`递归结束，栈空了。**翻转完成** —— 一共交换了 \`${c.length}\` 个非叶节点的孩子。现在整棵树上，每个节点从根到它的路径都**逐位取反**过了：左变成了右、右变成了左，于是每一层都成了原来那一层的**镜像**。时间复杂度 O(n)（每个节点恰好访问一次），空间 O(h)（递归栈深 = 树高）。`,{current:n,done:!0}),s}var Jo=`it-styles`,Yo=24,Xo=88,Zo=76,Qo=34,$o=68,es=26,ts=42,ns=50,rs=1150,is=`
.it {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.it__svg { width: 100%; height: auto; display: block; }

/* ── 节点（位置每帧变，所以挂 transition）───────────────────────────── */
.it-node {
  transition: transform 420ms cubic-bezier(0.4, 0, 0.2, 1);
}
.it-node__circle {
  fill: var(--it-fill, #ffffff);
  stroke: var(--it-line, #9aa39c);
  stroke-width: 2;
  transition: fill 260ms ease, stroke 260ms ease;
}
.it-node__value {
  fill: var(--it-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 当前焦点节点的强调环 */
.it-node__ring {
  fill: none;
  stroke: var(--it-hot, #a45f45);
  stroke-width: 3.5;
  opacity: 0;
}
/* 已经被翻转过的节点 */
.it-node.is-done .it-node__circle {
  fill: var(--it-ok-fill, #eef5f1);
  stroke: var(--it-ok, #3f6b57);
  stroke-width: 2.5;
}
.it-node.is-visit .it-node__circle {
  stroke: var(--it-hot, #a45f45);
  stroke-width: 3;
}
.it-node.is-visit .it-node__ring { opacity: 1; }
/* 这一帧正在被互换的两个孩子 */
.it-node.is-swapping .it-node__circle {
  fill: var(--it-hot-fill, #fdf1ec);
  stroke: var(--it-hot, #a45f45);
  stroke-width: 3.5;
}

/* ── 边（每帧重算 d，所以也要 transition）──────────────────────────── */
.it-edge {
  stroke: var(--it-edge, #8b948c);
  stroke-width: 2;
  fill: none;
  transition: d 420ms cubic-bezier(0.4, 0, 0.2, 1);
}
.it-edge.is-onstack {
  stroke: var(--it-hot, #a45f45);
  stroke-width: 3;
}

/* ── 交换弧线 ─────────────────────────────────────────────────────────── */
.it-swap__arc {
  fill: none;
  stroke: var(--it-hot, #a45f45);
  stroke-width: 2.5;
  stroke-dasharray: 6 4;
}
.it-swap__head {
  fill: var(--it-hot, #a45f45);
}
.it-swap__mark {
  fill: var(--it-hot, #a45f45);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}

/* ── 状态横幅 ─────────────────────────────────────────────────────────── */
.it-banner__box {
  fill: var(--it-banner-fill, #f4f2ec);
  stroke: var(--it-line, #9aa39c);
  stroke-width: 1.5;
}
.it-banner__lead {
  fill: var(--it-hot, #a45f45);
  font-size: 16px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.it-banner__box.is-done {
  fill: var(--it-ok-fill, #eef5f1);
  stroke: var(--it-ok, #3f6b57);
  stroke-width: 2;
}
.it-banner__count {
  fill: var(--it-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.it-banner__count.is-done {
  fill: var(--it-ok, #3f6b57);
}

.it-empty__text {
  fill: var(--it-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function as(){if(document.getElementById(Jo))return;let e=document.createElement(`style`);e.id=Jo,e.textContent=is,document.head.appendChild(e)}function os(e,t={}){if(!e||e.dataset.itMounted===`1`)return{destroy(){}};e.dataset.itMounted=`1`,as();let n=qo(t),r=t.autoplay!==!1,{nodes:i,root:a}=Ga(Array.isArray(t.values)?t.values:[4,2,7,1,3,6,9]),o=e=>e==null||!i[e]?null:i[e].value,s=X,c=document.createElement(`div`);c.className=`viz it`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(a===-1){let t=s(`svg`,{class:`viz__svg it__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`it-empty__text`,x:620/2,y:120/2});return n.textContent=`空树 —— 没什么可翻的，直接返回 None`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),{destroy(){e.textContent=``,delete e.dataset.itMounted,document.getElementById(Jo)?.remove()}}}let d=i.reduce((e,t)=>Math.max(e,t.depth),0),f=Math.min(120,Math.max(58,Math.round(470/2**d))),p=e=>f*2**Math.max(0,d-e),m=2**d*f,h=Math.max(660,es+m+68),g=(h-m)/2,_=e=>Zo+e*Xo,v=(e,t)=>{let n=0,r=1,a=t;for(;i[a].parent!==-1;)e[a]===`R`&&(n+=r),r*=2,a=i[a].parent;return{x:g+(n+.5)*p(i[t].depth),y:_(i[t].depth)}},y=Zo+d*Xo+Yo+ts,b=Math.min(620,h-es*2),x=s(`svg`,{class:`viz__svg it__svg`,viewBox:`0 0 ${h} ${y+ns+26}`,role:`img`,"aria-label":`翻转二叉树推演动画`});l.appendChild(x);let S=s(`g`,{class:`it-edges`}),C=s(`g`,{class:`it-nodes`}),w=s(`g`,{class:`it-swap`});x.appendChild(S),x.appendChild(w),x.appendChild(C);let T=new Map;for(let e of i){if(e.parent===-1)continue;let t=s(`path`,{class:`it-edge`,d:`M 0 0 L 0 0`});S.appendChild(t),T.set(e.id,t)}let E=[];for(let e of i){let t=s(`g`,{class:`it-node`});t.appendChild(s(`circle`,{class:`it-node__ring`,r:31})),t.appendChild(s(`circle`,{class:`it-node__circle`,cx:0,cy:0,r:Yo}));let n=s(`text`,{class:`it-node__value`,x:0,y:0});n.textContent=String(e.value),t.appendChild(n),C.appendChild(t),E.push({g:t,value:e.value,id:e.id})}let D=s(`path`,{class:`it-swap__arc`,d:`M 0 0`}),O=s(`path`,{class:`it-swap__head`,d:`M 0 0`}),k=s(`path`,{class:`it-swap__head`,d:`M 0 0`}),A=s(`text`,{class:`it-swap__mark`,x:0,y:0});A.textContent=`⇄`,w.appendChild(D),w.appendChild(O),w.appendChild(k),w.appendChild(A);let j=s(`rect`,{class:`it-banner__box`,x:es,y,width:b,height:ns,rx:9});x.appendChild(j);let M=s(`text`,{class:`it-banner__lead`,x:42,y:y+ns/2});x.appendChild(M);let N=s(`text`,{class:`it-banner__count`,x:es+b-16,y:y+ns/2});x.appendChild(N);let P=u();function F(e,t){if(!t)return;let n=t.sideOf??{},r=e=>v(n,e),s=t.current,c=new Set(t.swapped??[]),l=t.swapPair??[],u=new Set(l.filter(e=>e!=null)),d=new Set;for(let e=0;e+1<t.stack.length;e+=1)d.add(t.stack[e+1].id);for(let e of E){let{id:n,g:i}=e,a=r(n);i.setAttribute(`transform`,`translate(${a.x} ${a.y})`);let o=[`it-node`];c.has(n)&&o.push(`is-done`),n===s&&t.phase!==`done`&&o.push(`is-visit`),u.has(n)&&o.push(`is-swapping`),i.setAttribute(`class`,o.join(` `))}for(let e of i){if(e.parent===-1)continue;let t=r(e.parent),n=r(e.id),i=T.get(e.id);i.setAttribute(`d`,`M ${t.x} ${t.y+Yo} L ${n.x} ${n.y-Yo}`),i.setAttribute(`class`,d.has(e.id)?`it-edge is-onstack`:`it-edge`)}let f=l.filter(e=>e!=null);if(t.phase===`swap`&&f.length===2){let e=r(f[0]),t=r(f[1]),n=e.y-Yo-Qo,i=(e.x+t.x)/2,a=e.y-Yo-$o;D.setAttribute(`d`,`M ${e.x} ${n} Q ${i} ${a} ${t.x} ${n}`),D.style.opacity=`1`,O.setAttribute(`d`,`M ${e.x} ${n} l 9 -4 l 0 8 z`),k.setAttribute(`d`,`M ${t.x} ${n} l -9 -4 l 0 8 z`),O.style.opacity=`1`,k.style.opacity=`1`,A.setAttribute(`x`,i),A.setAttribute(`y`,a-9),A.style.opacity=`1`}else D.style.opacity=`0`,O.style.opacity=`0`,k.style.opacity=`0`,A.style.opacity=`0`;let p=i.filter(e=>e.left!==null||e.right!==null).length;t.phase===`init`?M.textContent=`从根 ${o(a)} 开始，逐层交换两个孩子`:t.phase===`swap`?M.textContent=f.length===2?`交换 ${o(f[0])} 和 ${o(f[1])}`:`单侧孩子移位：${o(f[0]??f[1])}`:t.phase===`leaf`?M.textContent=`${o(s)} 是叶子，交换空操作 → 直接返回`:M.textContent=`继续递归进子树 ${o(s)}`,t.phase===`done`?(M.textContent=`翻转完成 —— 每个节点的路径都逐位取反过了`,j.setAttribute(`class`,`it-banner__box is-done`),N.setAttribute(`class`,`it-banner__count is-done`)):(j.setAttribute(`class`,`it-banner__box`),N.setAttribute(`class`,`it-banner__count`)),N.textContent=`已换 ${t.swapped.length}/${p} 个非叶节点`,Z(P,t.desc)}c.appendChild(P);let I=Q();c.appendChild(I.root),e.textContent=``,e.appendChild(c),pt();let L=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,R=ht({steps:n,controls:I,intervalMs:rs,onRender:F});R.jumpTo(Math.trunc(t.initialStep)||0);let z=null;return r&&!L&&typeof IntersectionObserver==`function`&&(z=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){z.disconnect(),z=null,R.play();return}},{threshold:.35}),z.observe(c)),{destroy(){z&&=(z.disconnect(),null),R.destroy(),e.textContent=``,delete e.dataset.itMounted,document.getElementById(Jo)?.remove()}}}function ss(e={}){let t=typeof e.values==`string`?e.values:`abcabcbb`,n=Array.from(t),r=n.length,i=Number.isInteger(e.maxSteps)?e.maxSteps:400,a={right:-1,left:0,prevLeft:null,ch:null,hitIdx:null,outsideWindow:!1,lastSeen:{},windowLen:0,ans:0,bestRange:null};if(r===0)return[{...a,phase:`done`,desc:"**空串** —— 一个字符都没有，最长无重复子串的长度是 `0`。",done:!0}];let o=[],s={},c=0,l=0,u=null,d=0,f=(e,t,n={})=>{o.push({phase:e,desc:t,right:-1,left:c,prevLeft:null,ch:null,hitIdx:null,outsideWindow:!1,lastSeen:{...s},windowLen:0,ans:l,bestRange:u?[...u]:null,done:e===`done`,...n})};f(`init`,`要在 \`${t}\`（${r} 个字符）里找**最长的不含重复字符的子串**。用**滑动窗口**：\`right\` 一路往右扩张，把字符一个个吃进窗口；一旦吃进来的字符**在窗口内已经出现过**，就让 \`left\` 跳到"那个旧位置 + 1"，把它挤出窗口。两个指针都只往右走，所以整体是 O(n)。维护一张表 \`lastSeen\`，记每个字符最后出现在哪 —— 这就是"一眼看出重不重复"的依据。`);for(let e=0;e<r&&(d+=1,!(d>i));e+=1){let t=n[e],r=s[t],i=r!==void 0&&r<c;if(r!==void 0&&r>=c){let n=c;c=r+1,s[t]=e;let i=e-c+1,a=i>l;a&&(l=i,u=[c,e]),f(`slide`,`\`right\` 走到 \`${e}\`，字符是 **\`${t}\`**。它上次出现在下标 \`${r}\`，**而这个位置还在窗口里**（\`${r} >= left = ${n}\`）—— 构成重复。于是 \`left\` 从 \`${n}\` 跳到 \`${r} + 1 = ${c}\`，把旧的 \`${t}\` 挤出窗口。注意 **\`left\` 只会往右跳，绝不会退回去** —— 这是滑动窗口正确性的根基。现在窗口是 \`[${c}, ${e}]\`，长度 \`${i}\``+(a?`，**刷新了答案 → \`ans = ${l}\`**。`:`，没超过当前的 \`ans = ${l}\`。`),{right:e,left:c,prevLeft:n,ch:t,hitIdx:r,windowLen:i});continue}s[t]=e;let a=e-c+1,o=a>l;o&&(l=a,u=[c,e]),f(`expand`,`\`right\` 走到 \`${e}\`，字符是 **\`${t}\`**。`+(i?`它**出现过**（下标 \`${r}\`），但那个位置**已经在窗口左边之外**了（\`${r} < left = ${c}\`）—— 它早就被挤出窗口，现在再遇到**不算重复**，所以 \`left\` 原地不动。**这一步就是"只看位置是否还在窗口内"这个判据的价值所在**：如果这里无脑写 \`left = ${r} + 1\`，左指针就会倒退回 \`${r+1}\`。`:`它还没在窗口里出现过，直接吃进来。`)+` 现在窗口是 \`[${c}, ${e}]\`，长度 **\`${a}\`**`+(o?`，**刷新了答案 → \`ans = ${l}\`**。`:`，没超过当前的 \`ans = ${l}\`。`),{right:e,left:c,ch:t,hitIdx:i?r:null,outsideWindow:i,windowLen:a})}let p=u?n.slice(u[0],u[1]+1).join(``):``;return f(`done`,`扫描结束。**答案 = \`${l}\`**，对应的窗口是 \`[${u?.[0]}, ${u?.[1]}]\`，内容 \`"${p}"\`。回头看整条链路：\`right\` 一共推进了 ${r} 次，\`left\` 也从头到尾**只往右走、从不后退**，两个指针加起来总移动量不超过 \`2n\` —— 所以是**严格的 O(n)**，而不是"外层枚举左端点 × 内层枚举右端点"的 O(n²)。空间是 O(min(n, 字符集大小))：\`lastSeen\` 每个不同字符只占一条。`,{left:c,right:r-1,windowLen:r-c,done:!0}),o}var cs=`ls-styles`,ls=54,us=52,ds=6,fs=136,ps=22,ms=196,hs=206,gs=9,_s=242,vs=282,ys=296,bs=46,xs=26,Ss=50,Cs=1150,ws=604,Ts=`
.ls {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.ls__svg { width: 100%; height: auto; display: block; }

/* ── 字符格子 ─────────────────────────────────────────────────────────── */
.ls-cell__box {
  fill: var(--ls-fill, #ffffff);
  stroke: var(--ls-line, #c3c9c2);
  stroke-width: 1.5;
}
.ls-cell__text {
  fill: var(--ls-ink, #1f2a24);
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 在窗口里 */
.ls-cell.is-in .ls-cell__box {
  fill: var(--ls-ok-fill, #eef5f1);
  stroke: var(--ls-ok, #3f6b57);
  stroke-width: 2;
}
/* 已经被 left 挤出窗口（还在右边等着被重新吃进来） */
.ls-cell.is-out .ls-cell__box {
  fill: var(--ls-dim-fill, #f2f2ef);
  stroke: var(--ls-dim, #c9cdc7);
}
.ls-cell.is-out .ls-cell__text {
  fill: var(--ls-dim, #b9b9b3);
}
/* 这一帧正在处理的字符 */
.ls-cell.is-cur .ls-cell__box {
  fill: var(--ls-hot-fill, #fdf1ec);
  stroke: var(--ls-hot, #a45f45);
  stroke-width: 3;
}
.ls-cell.is-cur .ls-cell__text {
  fill: var(--ls-hot, #a45f45);
}

/* ── 窗口条 ───────────────────────────────────────────────────────────── */
.ls-win__bar {
  fill: var(--ls-ok-fill, #eef5f1);
  stroke: var(--ls-ok, #3f6b57);
  stroke-width: 1.5;
}
.ls-win__best {
  stroke: var(--ls-gold, #c2872f);
  stroke-width: 3;
}
/* L / R 的引出线用和标签同色的实线 —— 初版和"最优窗口"共用金色虚线样式，
 * 结果两种线在画面上分不清谁是谁。 */
.ls-win__tick {
  stroke: var(--ls-hot, #a45f45);
  stroke-width: 1.5;
}
.ls-win__tick.is-r {
  stroke: var(--ls-ok, #3f6b57);
}
.ls-win__pin {
  fill: var(--ls-hot, #a45f45);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ls-win__pin.is-r {
  fill: var(--ls-ok, #3f6b57);
}
.ls-win__empty {
  fill: var(--ls-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── right 指针 ───────────────────────────────────────────────────────── */
.ls-rpin__tri {
  fill: var(--ls-hot, #a45f45);
}
.ls-rpin__text {
  fill: var(--ls-hot, #a45f45);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── lastSeen 表 ──────────────────────────────────────────────────────── */
.ls-table__title {
  fill: var(--ls-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ls-card__box {
  fill: var(--ls-fill, #ffffff);
  stroke: var(--ls-line, #c3c9c2);
  stroke-width: 1.5;
}
.ls-card__ch {
  fill: var(--ls-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ls-card__idx {
  fill: var(--ls-muted, #657168);
  font-size: 13px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 这一帧的字符对应的卡片 */
.ls-card.is-hit .ls-card__box {
  fill: var(--ls-hot-fill, #fdf1ec);
  stroke: var(--ls-hot, #a45f45);
  stroke-width: 2.5;
}
.ls-card.is-hit .ls-card__ch {
  fill: var(--ls-hot, #a45f45);
}
.ls-card.is-hit .ls-card__idx {
  fill: var(--ls-hot, #a45f45);
  font-weight: 700;
}
/* 被高亮的"旧位置"数字（讲清楚它就在这儿） */
.ls-card.is-hit .ls-card__idx.is-old {
  fill: var(--ls-gold, #c2872f);
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.ls-banner__box {
  fill: var(--ls-banner-fill, #f4f2ec);
  stroke: var(--ls-line, #c3c9c2);
  stroke-width: 1.5;
}
.ls-banner__lead {
  fill: var(--ls-ink, #1f2a24);
  font-size: 15px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ls-banner__label {
  fill: var(--ls-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ls-banner__ans {
  fill: var(--ls-ok, #3f6b57);
  font-size: 24px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.ls-empty__text {
  fill: var(--ls-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function Es(){if(document.getElementById(cs))return;let e=document.createElement(`style`);e.id=cs,e.textContent=Ts,document.head.appendChild(e)}function Ds(e,t={}){if(!e||e.dataset.lsMounted===`1`)return{destroy(){}};e.dataset.lsMounted=`1`,Es();let n=ss(t),r=t.autoplay!==!1,i=typeof t.values==`string`?t.values:`abcabcbb`,a=Array.from(i),o=a.length,s=X,c=document.createElement(`div`);c.className=`viz ls`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(o===0){let t=s(`svg`,{class:`viz__svg ls__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`ls-empty__text`,x:620/2,y:120/2});return n.textContent=`空串 —— 没有字符，答案是 0`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),{destroy(){e.textContent=``,delete e.dataset.lsMounted,document.getElementById(cs)?.remove()}}}let d=us,f=ds,p=17,m=o*d+(o-1)*f;if(m>ws){let e=ws/m;d=Math.max(20,Math.floor(d*e)),f=Math.max(3,Math.floor(f*e)),p=Math.max(11,Math.round(p*e))}let h=o*d+(o-1)*f,g=Math.max(660,xs*2+h+68),_=(g-h)/2,v=e=>_+e*(d+f),y=Math.min(620,g-xs*2),b=s(`svg`,{class:`viz__svg ls__svg`,viewBox:`0 0 ${g} 452`,role:`img`,"aria-label":`无重复字符的最长子串推演动画`});l.appendChild(b);let x=s(`g`,{class:`ls-bands`}),S=s(`g`,{class:`ls-cells`}),C=s(`g`,{class:`ls-marks`});b.appendChild(x),b.appendChild(S),b.appendChild(C);let w=s(`rect`,{class:`ls-win__bar`,x:0,y:hs,width:0,height:gs,rx:4});x.appendChild(w);let T=s(`line`,{class:`ls-win__best`,x1:0,y1:ms,x2:0,y2:ms});x.appendChild(T);let E=s(`text`,{class:`ls-win__pin`,x:0,y:_s}),D=s(`text`,{class:`ls-win__pin is-r`,x:0,y:_s}),O=s(`line`,{class:`ls-win__tick`,x1:0,y1:215,x2:0,y2:_s-8}),k=s(`line`,{class:`ls-win__tick is-r`,x1:0,y1:215,x2:0,y2:_s-8});C.appendChild(O),C.appendChild(k),C.appendChild(E),C.appendChild(D);let A=s(`text`,{class:`ls-win__empty`,x:xs,y:_s});A.textContent=`窗口还没开始滑动 —— 按播放看 right 怎么一步步往右吃字符`,C.appendChild(A);let j=s(`path`,{class:`ls-rpin__tri`,d:`M 0 0 L 0 0 L 0 0`}),M=s(`text`,{class:`ls-rpin__text`,x:0,y:0});M.textContent=`right`,C.appendChild(j),C.appendChild(M);let N=[];for(let e=0;e<o;e+=1){let t=v(e),n=s(`g`,{class:`ls-cell`});n.appendChild(s(`rect`,{class:`ls-cell__box`,x:t,y:fs,width:d,height:ls,rx:7}));let r=s(`text`,{class:`ls-cell__text`,x:t+d/2,y:163,style:`font-size:${p}px`});r.textContent=a[e],n.appendChild(r),S.appendChild(n),N.push({g:n,id:e})}let P=new Set(a).size,F=P>10?5:8,I=Math.max(28,Math.min(56,Math.floor((ws-(P-1)*F)/P))),L=(g-(P*I+(P-1)*F))/2,R=s(`text`,{class:`ls-table__title`,x:L,y:vs});R.textContent=`lastSeen：每个字符最后出现在哪个下标`,C.appendChild(R);let z=[];for(let e=0;e<P;e+=1){let t=L+e*(I+F),n=s(`g`,{class:`ls-card`});n.appendChild(s(`rect`,{class:`ls-card__box`,x:t,y:ys,width:I,height:bs,rx:7}));let r=s(`text`,{class:`ls-card__ch`,x:t+I/2,y:311});n.appendChild(r);let i=s(`text`,{class:`ls-card__idx`,x:t+I/2,y:329});n.appendChild(i),C.appendChild(n),z.push({g:n,chT:r,idxT:i,x:t})}let B=s(`g`,{class:`ls-banner`});B.appendChild(s(`rect`,{class:`ls-banner__box`,x:xs,y:376,width:y,height:Ss,rx:9}));let V=s(`text`,{class:`ls-banner__lead`,x:42,y:401});B.appendChild(V);let H=s(`text`,{class:`ls-banner__label`,x:xs+y-74,y:401});H.textContent=`ans`,B.appendChild(H);let ee=s(`text`,{class:`ls-banner__ans`,x:xs+y-16,y:401});B.appendChild(ee),b.appendChild(B);let te=u();function U(e,t){if(!t)return;let n=t.bestRange,r=t.phase===`done`&&n,s=r?n[0]:t.left,c=r?n[1]:t.right,l=t.lastSeen??{};for(let e of N){let{g:n,id:r}=e,i=[`ls-cell`];c>=0&&r>=s&&r<=c?i.push(`is-in`):(c>=0&&r<s||t.phase!==`init`)&&i.push(`is-out`),r===c&&i.push(`is-cur`),n.setAttribute(`class`,i.join(` `))}let u=c>=0;if(u){let e=v(s),t=v(c)+d;w.setAttribute(`x`,e),w.setAttribute(`width`,Math.max(4,t-e)),w.style.opacity=`1`;let n=v(s)+d/2,r=v(c)+d/2;O.setAttribute(`x1`,n),O.setAttribute(`x2`,n),E.setAttribute(`x`,n),O.style.opacity=`1`,E.style.opacity=`1`,s===c?(E.textContent=`L=R=${s}`,D.style.opacity=`0`,k.style.opacity=`0`):(E.textContent=`L=${s}`,k.setAttribute(`x1`,r),k.setAttribute(`x2`,r),D.setAttribute(`x`,r),D.textContent=`R=${c}`,D.style.opacity=`1`,k.style.opacity=`1`),A.style.opacity=`0`}else w.style.opacity=`0`,O.style.opacity=`0`,k.style.opacity=`0`,E.style.opacity=`0`,D.style.opacity=`0`,A.style.opacity=`1`;if(n?(T.setAttribute(`x1`,v(n[0])),T.setAttribute(`x2`,v(n[1])+d),T.style.opacity=`1`):T.style.opacity=`0`,u){let e=v(c)+d/2,t=fs-ps;j.setAttribute(`d`,`M ${e-6} ${t-10} L ${e+6} ${t-10} L ${e} ${t} z`),M.setAttribute(`x`,e),M.setAttribute(`y`,t-20),j.style.opacity=`1`,M.style.opacity=`1`}else j.style.opacity=`0`,M.style.opacity=`0`;let f=Object.keys(l),p=t.ch;if(z.forEach((e,n)=>{let r=f[n];if(r===void 0){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`,e.chT.textContent=r;let i=r===p&&t.phase!==`done`,a=i&&t.hitIdx!==null&&(t.phase===`slide`||t.outsideWindow===!0);e.idxT.textContent=String(a?t.hitIdx:l[r]),e.g.setAttribute(`class`,i?`ls-card is-hit`:`ls-card`),e.idxT.setAttribute(`class`,a?`ls-card__idx is-old`:`ls-card__idx`)}),t.phase===`init`)V.textContent=`字符串 "${i}"，共 ${o} 个字符`;else if(t.phase===`done`){let e=n?a.slice(n[0],n[1]+1).join(``):``;V.textContent=`最长无重复子串 "${e}"`}else{let e=a.slice(s,c+1).join(``);V.textContent=`窗口 [${s}, ${c}] = "${e}"  长度 ${t.windowLen}`}ee.textContent=String(t.ans),Z(te,t.desc)}c.appendChild(te);let W=Q();c.appendChild(W.root),e.textContent=``,e.appendChild(c),pt();let G=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,ne=ht({steps:n,controls:W,intervalMs:Cs,onRender:U});ne.jumpTo(Math.trunc(t.initialStep)||0);let re=null;return r&&!G&&typeof IntersectionObserver==`function`&&(re=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){re.disconnect(),re=null,ne.play();return}},{threshold:.35}),re.observe(c)),{destroy(){re&&=(re.disconnect(),null),ne.destroy(),e.textContent=``,delete e.dataset.lsMounted,document.getElementById(cs)?.remove()}}}var Os=[`innerHTML`],ks=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,As=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,js=`0.16.21`,Ms=`11.4.1`,Ns=y({__name:`MarkdownView`,props:{html:{type:String,default:``},title:{type:String,default:``}},setup(e){let t=e,n=w(null),r=v(()=>st(ot.sanitize(t.html,{ADD_ATTR:[`target`,`rel`],FORBID_TAGS:[`style`,`iframe`,`object`,`embed`,`form`],FORBID_ATTR:[`onerror`,`onload`,`onclick`]}),t.title));function i(e){e.classList.add(`copied`),e.innerHTML=As,setTimeout(()=>{e.classList.remove(`copied`),e.innerHTML=ks},2e3)}function s(){n.value&&n.value.querySelectorAll(`table`).forEach(e=>{if(e.parentElement?.classList.contains(`table-scroll`))return;let t=document.createElement(`div`);t.className=`table-scroll`,e.parentNode.insertBefore(t,e),t.appendChild(e)})}function l(){n.value&&n.value.querySelectorAll(`pre`).forEach(e=>{if(e.parentElement?.classList.contains(`code-block-wrapper`))return;let t=document.createElement(`div`);t.className=`code-block-wrapper`,e.parentNode.insertBefore(t,e),t.appendChild(e);let n=document.createElement(`button`);n.className=`copy-btn`,n.title=`复制代码`,n.innerHTML=ks,n.addEventListener(`click`,()=>{let t=(e.querySelector(`code`)||e).textContent||``;navigator.clipboard.writeText(t).then(()=>{i(n)}).catch(()=>{let e=document.createElement(`textarea`);e.value=t,e.style.position=`fixed`,e.style.opacity=`0`,document.body.appendChild(e),e.select(),document.execCommand(`copy`),document.body.removeChild(e),i(n)})}),t.appendChild(n)})}function u(e,t){return new Promise((n,r)=>{if(document.querySelector(`link[data-lib-href="${e}"]`))return n();let i=document.createElement(`link`);i.rel=`stylesheet`,i.href=e,i.integrity=t,i.crossOrigin=`anonymous`,i.dataset.libHref=e,i.onload=()=>n(),i.onerror=()=>r(Error(`Failed to load stylesheet `+e)),document.head.appendChild(i)})}function d(e,t){return new Promise((n,r)=>{if(document.querySelector(`script[data-lib-src="${e}"]`))return n();let i=document.createElement(`script`);i.src=e,i.integrity=t,i.crossOrigin=`anonymous`,i.dataset.libSrc=e,i.onload=()=>n(),i.onerror=()=>r(Error(`Failed to load script `+e)),document.head.appendChild(i)})}let f=null;async function m(){return f||=Promise.all([u(`https://cdn.jsdelivr.net/npm/katex@${js}/dist/katex.min.css`,`sha384-zh0CIslj+VczCZtlzBcjt5ppRcsAmDnRem7ESsYwWwg3m/OaJ2l4x7YBZl9Kxxib`),d(`https://cdn.jsdelivr.net/npm/katex@${js}/dist/katex.min.js`,`sha384-Rma6DA2IPUwhNxmrB/7S3Tno0YY7sFu9WSYMCuulLhIqYSGZ2gKCJWIqhBWqMQfh`)]).then(()=>window.katex),f}let h=null;async function g(){return h||=d(`https://cdn.jsdelivr.net/npm/mermaid@${Ms}/dist/mermaid.min.js`,`sha384-rbtjAdnIQE/aQJGEgXrVUlMibdfTSa4PQju4HDhN3sR2PmaKFzhEafuePsl9H/9I`).then(()=>window.mermaid),h}async function _(){if(!n.value)return;let e=n.value.querySelectorAll(`code.language-mermaid`);if(e.length)try{let t=await g();e.forEach(e=>{let n=e.closest(`pre`);if(!n||n.dataset.mermaidRendered)return;n.dataset.mermaidRendered=`1`;let r=document.createElement(`div`);r.className=`mermaid-container`,r.textContent=e.textContent,n.parentNode.replaceChild(r,n),t.run({nodes:[r]})})}catch(e){console.warn(`Mermaid failed to load/render:`,e?.message||e)}n.value.querySelectorAll(`img`).forEach(e=>{let t=e.getAttribute(`src`)||``;e.getAttribute(`alt`);let n=t.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);if(n){let t=document.createElement(`div`);t.className=`video-wrapper`,t.innerHTML=`<iframe src="https://www.youtube.com/embed/${n[1]}" frameborder="0" allowfullscreen></iframe>`,e.parentNode.replaceChild(t,e);return}let r=t.match(/bilibili\.com\/video\/(BV[\w]+)/);if(r){let t=document.createElement(`div`);t.className=`video-wrapper`,t.innerHTML=`<iframe src="https://player.bilibili.com/player.html?bvid=${r[1]}" frameborder="0" allowfullscreen></iframe>`,e.parentNode.replaceChild(t,e);return}});let t=/(\$\$[\s\S]+?\$\$|\$[^\s$](?:[^$]*[^\s$])?\$)/,r=document.createTreeWalker(n.value,NodeFilter.SHOW_TEXT),i=[],a;for(;a=r.nextNode();)!a.nodeValue||!t.test(a.nodeValue)||a.parentElement?.closest(`pre, code`)||i.push(a);if(i.length)try{let e=await m();for(let n of i){let r=document.createDocumentFragment();for(let i of n.nodeValue.split(t)){if(!i)continue;let t=i.startsWith(`$$`)&&i.endsWith(`$$`)&&i.length>3,n=!t&&i.startsWith(`$`)&&i.endsWith(`$`)&&i.length>2;if(!t&&!n){r.appendChild(document.createTextNode(i));continue}let a=i.slice(t?2:1,t?-2:-1),o=document.createElement(`span`);o.innerHTML=e.renderToString(a,{displayMode:t,throwOnError:!1}),r.appendChild(o)}n.parentNode.replaceChild(r,n)}}catch(e){console.warn(`KaTeX failed to load/render:`,e?.message||e)}}let y={"algo-viz--lc206":Ft,"algo-viz--lc21":nn,"algo-viz--lc23":Pn,"algo-viz--lc23dc":$n,"algo-viz--lc141":Er,"algo-viz--lc142":Br,"algo-viz--lc19":ai,"algo-viz--lc143":Ei,"algo-viz--lc234":Yi,"algo-viz--lc160":ba,"algo-viz--lc82":Wa,"algo-viz--lc102":ao,"algo-viz--lc236":bo,"algo-viz--lc124":No,"algo-viz--lc104":Ko,"algo-viz--lc226":os,"algo-viz--lc3":Ds},b=[];function x(){b.forEach(e=>{try{e?.destroy?.()}catch(e){console.warn(`Algo viz teardown failed:`,e?.message||e)}}),b=[]}function T(){n.value&&(x(),n.value.querySelectorAll(`.algo-viz`).forEach(e=>{let t=Object.keys(y).find(t=>e.classList.contains(t));if(t)try{b.push(y[t](e))}catch(e){console.warn(`Algo viz failed to mount:`,t,e?.message||e)}}))}return a(()=>{o(()=>{T(),_(),s(),l()})}),C(x),p(()=>t.html,()=>{o(()=>{T(),_(),s(),l()})}),(e,t)=>(S(),c(`div`,{ref_key:`bodyRef`,ref:n,class:`markdown-body`,innerHTML:r.value},null,8,Os))}},[[`__scopeId`,`data-v-88e9bcf7`]]);function Ps(e){return T.get(`/articles/${e}/comments/`)}function Fs(e,t){return T.post(`/articles/${e}/comments/`,t)}var Is={key:0,class:`form-title`},Ls={key:1,class:`form-title`},Rs={class:`form-field`},zs={key:0,class:`field-error`},Bs={class:`form-field`},Vs={key:0,class:`field-error`},Hs={class:`hp-field`,"aria-hidden":`true`},Us={class:`form-field`},Ws={key:0,class:`field-error`},Gs={key:0,class:`submit-error`},Ks={key:1,class:`submit-success`},qs={class:`form-actions`},Js=[`disabled`],Ys={key:0,class:`spinner`},Xs={key:1},Zs=y({__name:`CommentForm`,props:{articleSlug:{type:String,required:!0},parentId:{type:[Number,String],default:null}},emits:[`submitted`,`cancel`],setup(e,{emit:t}){let n=e,r=t,a=i({author_name:``,author_email:``,content:``,website:``}),o=i({author_name:``,author_email:``,content:``}),u=w(!1),d=w(null),p=w(!1);function m(){let e=!0;return o.author_name=``,o.author_email=``,o.content=``,a.author_name.trim()||(o.author_name=`请输入昵称`,e=!1),a.author_email.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.author_email)||(o.author_email=`邮箱格式不正确`,e=!1):(o.author_email=`请输入邮箱`,e=!1),a.content.trim()?a.content.trim().length<3&&(o.content=`评论内容至少3个字符`,e=!1):(o.content=`请输入评论内容`,e=!1),e}function g(e){o[e]&&(o[e]=``),d.value=null}async function _(){if(m()){u.value=!0,d.value=null;try{let e={author_name:a.author_name.trim(),author_email:a.author_email.trim(),content:a.content.trim(),website:a.website};n.parentId&&(e.parent=n.parentId),await Fs(n.articleSlug,e),p.value=!0,setTimeout(()=>{p.value=!1},3e3),r(`submitted`),a.author_name=``,a.author_email=``,a.content=``}catch(e){let t=e?.response?.data;if(typeof t==`object`&&t){let e=t;e.author_name&&(o.author_name=Array.isArray(e.author_name)?e.author_name[0]:e.author_name),e.author_email&&(o.author_email=Array.isArray(e.author_email)?e.author_email[0]:e.author_email),e.content&&(o.content=Array.isArray(e.content)?e.content[0]:e.content),e.detail&&(d.value=e.detail),e.non_field_errors&&(d.value=Array.isArray(e.non_field_errors)?e.non_field_errors[0]:e.non_field_errors)}else typeof t==`string`?d.value=t:d.value=e.message||`提交失败，请稍后重试`}finally{u.value=!1}}}return(t,n)=>(S(),c(`div`,{class:h([`comment-form`,{"reply-form":!!e.parentId}])},[e.parentId?(S(),c(`h4`,Is,`回复评论`)):(S(),c(`h4`,Ls,`发表评论`)),s(`form`,{onSubmit:k(_,[`prevent`]),class:`form-body`},[s(`div`,Rs,[f(s(`input`,{"onUpdate:modelValue":n[0]||=e=>a.author_name=e,type:`text`,placeholder:`昵称 *`,class:h([`form-input`,{"input-error":o.author_name}]),onInput:n[1]||=e=>g(`author_name`)},null,34),[[O,a.author_name]]),o.author_name?(S(),c(`p`,zs,l(o.author_name),1)):b(``,!0)]),s(`div`,Bs,[f(s(`input`,{"onUpdate:modelValue":n[2]||=e=>a.author_email=e,type:`email`,placeholder:`邮箱 *`,class:h([`form-input`,{"input-error":o.author_email}]),onInput:n[3]||=e=>g(`author_email`)},null,34),[[O,a.author_email]]),o.author_email?(S(),c(`p`,Vs,l(o.author_email),1)):b(``,!0)]),s(`div`,Hs,[f(s(`input`,{"onUpdate:modelValue":n[4]||=e=>a.website=e,type:`text`,tabindex:`-1`,autocomplete:`off`},null,512),[[O,a.website]])]),s(`div`,Us,[f(s(`textarea`,{"onUpdate:modelValue":n[5]||=e=>a.content=e,placeholder:`说点什么...`,rows:`4`,class:h([`form-textarea`,{"input-error":o.content}]),onInput:n[6]||=e=>g(`content`)},null,34),[[O,a.content]]),o.content?(S(),c(`p`,Ws,l(o.content),1)):b(``,!0)]),d.value?(S(),c(`p`,Gs,l(d.value),1)):b(``,!0),p.value?(S(),c(`p`,Ks,`评论已提交！`)):b(``,!0),s(`div`,qs,[e.parentId?(S(),c(`button`,{key:0,type:`button`,class:`cancel-btn`,onClick:n[7]||=e=>t.$emit(`cancel`)},` 取消回复 `)):b(``,!0),s(`button`,{type:`submit`,class:`submit-btn`,disabled:u.value},[u.value?(S(),c(`span`,Ys)):(S(),c(`span`,Xs,`提交`))],8,Js)])],32)],2))}},[[`__scopeId`,`data-v-49410be9`]]),Qs={class:`comment-list`},$s={class:`comments-title`},ec={key:0,class:`comments-count`},tc={key:0,class:`skeleton-comments`},nc={key:1,class:`empty-comments`},rc={key:2,class:`comments-tree`},ic={class:`comment-main`},ac={class:`comment-content`},oc={class:`comment-header`},sc={class:`comment-author`},cc={class:`comment-time`},lc={class:`comment-text`},uc=[`onClick`],dc={key:1,class:`replies`},fc={class:`comment-main`},pc={class:`comment-content`},mc={class:`comment-header`},hc={class:`comment-author`},gc={class:`comment-time`},_c={class:`comment-text`},vc=y({__name:`CommentList`,props:{articleSlug:{type:String,required:!0}},setup(e){let t=e,n=w([]),i=w(!0),o=w(null),u=v(()=>n.value.filter(e=>!e.parent));function f(e){o.value=o.value===e?null:e}async function p(){i.value=!0;try{let e=await Ps(t.articleSlug);n.value=e.data.results||e.data||[]}catch{n.value=[]}finally{i.value=!1}}function h(){o.value=null,p()}function y(e){if(!e)return``;let t=Date.now()-new Date(e).getTime(),n=Math.floor(t/6e4),r=Math.floor(t/36e5),i=Math.floor(t/864e5);return n<1?`刚刚`:n<60?`${n}分钟前`:r<24?`${r}小时前`:i<30?`${i}天前`:i<365?`${Math.floor(i/30)}个月前`:`${Math.floor(i/365)}年前`}function C(e){let t=[`#3f6b57`,`#a45f45`,`#8a6c3f`,`#637b68`,`#7b6757`,`#4f7477`,`#8a635f`,`#6b7250`,`#536b5d`,`#9b704e`,`#65706a`,`#7b6a83`];if(!e)return t[0];let n=0;for(let t=0;t<e.length;t++)n=e.charCodeAt(t)+((n<<5)-n);return t[Math.abs(n)%t.length]}return a(p),(t,a)=>(S(),c(`div`,Qs,[s(`h3`,$s,[a[1]||=g(` 评论 `,-1),n.value.length?(S(),c(`span`,ec,`(`+l(n.value.length)+`)`,1)):b(``,!0)]),i.value?(S(),c(`div`,tc,[(S(),c(d,null,r(3,e=>s(`div`,{key:e,class:`skeleton-comment`},[...a[2]||=[_(`<div class="skeleton-avatar" data-v-98dfce57></div><div class="skeleton-body" data-v-98dfce57><div class="skeleton-line w-30" data-v-98dfce57></div><div class="skeleton-line w-50" data-v-98dfce57></div><div class="skeleton-line w-80" data-v-98dfce57></div></div>`,2)]])),64))])):u.value.length?(S(),c(`div`,rc,[(S(!0),c(d,null,r(u.value,t=>(S(),c(`div`,{key:t.id,class:`comment-item`},[s(`div`,ic,[s(`div`,{class:`comment-avatar`,style:x({background:C(t.author_name)})},l(t.author_name?t.author_name.charAt(0).toUpperCase():`?`),5),s(`div`,ac,[s(`div`,oc,[s(`span`,sc,l(t.author_name),1),s(`span`,cc,l(y(t.created_at)),1)]),s(`p`,lc,l(t.content),1),s(`button`,{class:`reply-btn`,onClick:e=>f(t.id)},[...a[4]||=[s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`polyline`,{points:`9 17 4 12 9 7`}),s(`path`,{d:`M20 18v-2a4 4 0 0 0-4-4H4`})],-1),g(` 回复 `,-1)]],8,uc)])]),o.value===t.id?(S(),m(Zs,{key:0,"article-slug":e.articleSlug,"parent-id":t.id,onSubmitted:h,onCancel:a[0]||=e=>o.value=null,class:`reply-form-wrapper`},null,8,[`article-slug`,`parent-id`])):b(``,!0),t.replies&&t.replies.length?(S(),c(`div`,dc,[(S(!0),c(d,null,r(t.replies,e=>(S(),c(`div`,{key:e.id,class:`comment-item reply-item`},[s(`div`,fc,[s(`div`,{class:`comment-avatar comment-avatar-sm`,style:x({background:C(e.author_name)})},l(e.author_name?e.author_name.charAt(0).toUpperCase():`?`),5),s(`div`,pc,[s(`div`,mc,[s(`span`,hc,l(e.author_name),1),s(`span`,gc,l(y(e.created_at)),1)]),s(`p`,_c,l(e.content),1)])])]))),128))])):b(``,!0)]))),128))])):(S(),c(`div`,nc,[...a[3]||=[s(`svg`,{width:`40`,height:`40`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`1.5`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`path`,{d:`M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z`})],-1),s(`p`,null,`暂无评论，来说点什么吧`,-1)]]))]))}},[[`__scopeId`,`data-v-98dfce57`]]),yc={key:0,class:`toc-list-wrapper`},bc={class:`toc-list`},xc=[`href`,`title`,`onClick`],Sc={class:`toc-text`},Cc={key:1,class:`toc-empty-state`},wc=y({__name:`TocNav`,props:{html:{type:String,default:``}},setup(e){let t=e,n=w([]),i=w(null),u=null,f=[];function m(){if(!t.html){n.value=[];return}try{let e=new DOMParser().parseFromString(t.html,`text/html`),r=[];e.querySelectorAll(`h2, h3, h4`).forEach((e,t)=>{let n=e.id||`toc-heading-${t}`;r.push({id:n,tag:e.tagName.toLowerCase(),text:e.textContent||``})}),n.value=r}catch{n.value=[]}}function g(){if(!n.value.length)return;let e=document.querySelector(`.markdown-body`);e&&e.querySelectorAll(`h2, h3, h4`).forEach((e,t)=>{let r=n.value[t];r&&!e.id&&(e.id=r.id)})}function _(){u&&=(u.disconnect(),null),f=[],n.value.length&&(u=new IntersectionObserver(e=>{let t=e.filter(e=>e.isIntersecting);t.length?i.value=t[0].target.id:window.scrollY<100&&(i.value=n.value[0]?.id||null)},{rootMargin:`-80px 0px -60% 0px`,threshold:0}),o(()=>{n.value.forEach(e=>{let t=document.getElementById(e.id);t&&(u.observe(t),f.push(t))})}))}function v(e){let t=document.getElementById(e);t&&(t.scrollIntoView({behavior:`smooth`,block:`start`}),i.value=e)}return p(()=>t.html,()=>{m(),o(()=>{g(),_()})}),a(()=>{m(),o(()=>{g(),_()})}),C(()=>{u&&u.disconnect()}),(e,t)=>(S(),c(`nav`,{class:h([`toc-nav`,{"toc-empty":!n.value.length}])},[t[2]||=s(`h4`,{class:`toc-title`},`目录`,-1),n.value.length?(S(),c(`div`,yc,[s(`ul`,bc,[(S(!0),c(d,null,r(n.value,e=>(S(),c(`li`,{key:e.id,class:h([`toc-item`,[`toc-depth-${e.tag}`,{"toc-active":i.value===e.id}]])},[s(`a`,{href:`#`+e.id,class:`toc-link`,title:e.text,onClick:k(t=>v(e.id),[`prevent`])},[t[0]||=s(`span`,{class:`toc-dot`},null,-1),s(`span`,Sc,l(e.text),1)],8,xc)],2))),128))])])):(S(),c(`div`,Cc,[...t[1]||=[s(`p`,null,`无目录`,-1)]]))],2))}},[[`__scopeId`,`data-v-21d21cb1`]]),Tc={class:`share-buttons`},Ec={key:0,class:`copy-feedback`},Dc=y({__name:`ShareButtons`,props:{title:{type:String,default:``},url:{type:String,default:``}},setup(e){let t=e,n=w(!1);function r(){let e=encodeURIComponent(t.url||window.location.href),n=encodeURIComponent(t.title);window.open(`https://service.weibo.com/share/share.php?url=${e}&title=${n}`,`_blank`,`noopener,noreferrer,width=600,height=400`)}function i(){let e=encodeURIComponent(t.url||window.location.href),n=encodeURIComponent(t.title);window.open(`https://twitter.com/intent/tweet?url=${e}&text=${n}`,`_blank`,`noopener,noreferrer,width=600,height=400`)}function a(){alert(`请复制链接后在微信中粘贴发送`)}async function o(){try{await navigator.clipboard.writeText(t.url||window.location.href),n.value=!0,setTimeout(()=>n.value=!1,2e3)}catch{let e=document.createElement(`textarea`);e.value=t.url||window.location.href,document.body.appendChild(e),e.select(),document.execCommand(`copy`),document.body.removeChild(e),n.value=!0,setTimeout(()=>n.value=!1,2e3)}}return(e,t)=>(S(),c(`div`,Tc,[t[4]||=s(`span`,{class:`share-label`},`分享：`,-1),s(`button`,{class:`share-btn wechat`,title:`微信`,onClick:a},[...t[0]||=[s(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`},[s(`path`,{d:`M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.136 0 .241-.11.241-.245 0-.06-.024-.12-.04-.178l-.325-1.233a.49.49 0 0 1 .178-.554C23.028 18.48 24 16.82 24 14.98c0-3.21-2.931-5.952-7.062-6.122zm-2.18 2.769c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z`})],-1)]]),s(`button`,{class:`share-btn weibo`,title:`微博`,onClick:r},[...t[1]||=[s(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`},[s(`path`,{d:`M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zm-7.317-6.781c-1.059-.2-1.911.419-1.903 1.383.008.964.87 1.907 1.93 2.107 1.058.2 1.91-.419 1.903-1.383-.008-.964-.87-1.907-1.93-2.107zm2.13 3.68c-.563-.249-.754-.766-.428-1.153.326-.388 1.019-.523 1.58-.275.56.248.753.764.429 1.153-.326.386-1.018.524-1.581.275zm.992-3.808c-2.07-.028-4.538.537-7.344 2.641C-.405 17.1-.279 19.15.35 20.49c.528 1.123 1.494 1.773 2.43 2.144 4.878 1.935 10.857.606 13.679-1.35 2.934-2.035 4.033-4.771 3.157-7.165-.516-1.405-1.797-2.398-3.31-2.882l.06-.05c2.485-2.08 4.213-4.585 4.213-7.146 0-5.213-7.11-7.735-10.966-5.371-1.742 1.07-2.772 2.788-3.064 4.72.422-.12.865-.197 1.323-.23 3.271-.241 7.273.776 7.273 3.86 0 3.502-3.823 4.667-6.721 4.667-.89 0-1.785-.215-2.595-.598z`})],-1)]]),s(`button`,{class:`share-btn twitter`,title:`Twitter`,onClick:i},[...t[2]||=[s(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`},[s(`path`,{d:`M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z`})],-1)]]),s(`button`,{class:`share-btn copy`,title:`复制链接`,onClick:o},[...t[3]||=[s(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`path`,{d:`M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71`}),s(`path`,{d:`M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71`})],-1)]]),n.value?(S(),c(`span`,Ec,`已复制`)):b(``,!0)]))}},[[`__scopeId`,`data-v-857c6fb5`]]),Oc={key:0,class:`related-section`},kc={class:`related-grid`},Ac={key:0,class:`related-cover`},jc=[`src`,`alt`],Mc={class:`related-card-title`},Nc=y({__name:`RelatedArticles`,props:{articles:{type:Array,default:()=>[]}},setup(t){return(i,a)=>{let o=n(`router-link`);return t.articles.length?(S(),c(`section`,Oc,[a[0]||=s(`h3`,{class:`related-title`},`相关文章`,-1),s(`div`,kc,[(S(!0),c(d,null,r(t.articles,t=>(S(),m(o,{key:t.slug,to:`/article/`+t.slug,class:`related-card`},{default:e(()=>[t.cover_image?(S(),c(`div`,Ac,[s(`img`,{src:t.cover_image,alt:t.title,loading:`lazy`},null,8,jc)])):b(``,!0),s(`span`,Mc,l(t.title),1)]),_:2},1032,[`to`]))),128))])])):b(``,!0)}}},[[`__scopeId`,`data-v-e3d8298c`]]),Pc={class:`newsletter glass-card`},Fc=[`disabled`],Ic=[`disabled`],Lc={key:0},Rc={key:1},zc={key:2},Bc=y({__name:`NewsletterForm`,setup(e){let t=w(``),n=w(!1),r=w(!1),i=w(``),a=w(``);async function o(){if(t.value.trim()){n.value=!0,i.value=``;try{let e=await T.post(`/subscribe/`,{email:t.value.trim()});r.value=!0,i.value=e.data.detail||`订阅成功！`,a.value=`msg-success`}catch(e){let t=e?.response?.data?.error||e?.response?.data?.detail||`订阅失败`;i.value=typeof t==`string`?t:`订阅失败，请稍后重试`,a.value=`msg-error`}finally{n.value=!1}}}return(e,u)=>(S(),c(`div`,Pc,[u[1]||=_(`<h4 class="newsletter-title" data-v-54a32a66><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-54a32a66><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" data-v-54a32a66></path><polyline points="22,6 12,13 2,6" data-v-54a32a66></polyline></svg> 订阅更新 </h4><p class="newsletter-desc" data-v-54a32a66>新文章发布时，通过邮件通知你</p>`,2),s(`form`,{onSubmit:k(o,[`prevent`]),class:`newsletter-form`},[f(s(`input`,{"onUpdate:modelValue":u[0]||=e=>t.value=e,type:`email`,placeholder:`your@email.com`,class:`newsletter-input`,disabled:r.value,required:``},null,8,Fc),[[O,t.value]]),s(`button`,{type:`submit`,class:`newsletter-btn`,disabled:n.value||r.value},[n.value?(S(),c(`span`,Lc,`...`)):r.value?(S(),c(`span`,Rc,`✓`)):(S(),c(`span`,zc,`订阅`))],8,Ic)],32),i.value?(S(),c(`p`,{key:0,class:h(a.value)},l(i.value),3)):b(``,!0)]))}},[[`__scopeId`,`data-v-54a32a66`]]),Vc=`个人博客Blog`,Hc=`Zhou Jun 的个人博客 — 技术、编程、AI 与科学`;function Uc(e={}){let{title:t=Vc,description:n=Hc,image:r=``,url:i=window.location.href}=e,a=t===`个人博客Blog`?t:`${t} | ${Vc}`;document.title=a;let o=(e,t,n=!1)=>{if(!t)return;let r=n?`name`:`property`,i=document.querySelector(`meta[${r}="${e}"]`);i||(i=document.createElement(`meta`),i.setAttribute(r,e),document.head.appendChild(i)),i.setAttribute(`content`,t)};o(`description`,n,!0),o(`og:title`,a),o(`og:description`,n),o(`og:image`,r),o(`og:url`,i),o(`og:type`,`article`),o(`twitter:card`,r?`summary_large_image`:`summary`),o(`twitter:title`,a),o(`twitter:description`,n),o(`twitter:image`,r),((e,t)=>{if(!t)return;let n=document.querySelector(`link[rel="${e}"]`);n||(n=document.createElement(`link`),n.setAttribute(`rel`,e),document.head.appendChild(n)),n.setAttribute(`href`,t)})(`canonical`,i)}var Wc={title:Vc,description:Hc,image:``,url:``};function Gc(){Uc({...Wc,url:window.location.origin+`/`});let e=document.querySelector(`meta[property="og:type"]`);e&&e.setAttribute(`content`,`website`);let t=document.querySelector(`link[rel="canonical"]`);t&&t.setAttribute(`href`,window.location.origin+`/`)}function Kc(e){if(!e)return 1;let t=(e.match(/[一-鿿㐀-䶿]/g)||[]).length+(e.match(/[a-zA-Z]+/g)||[]).length;return Math.max(1,Math.ceil(t/250))}function qc(e){return e?e.replace(/```[\s\S]*?```/g,``).replace(/`[^`]*`/g,``).replace(/!\[.*?\]\(.*?\)/g,``).replace(/\[([^\]]*)\]\(.*?\)/g,`$1`).replace(/[#*>`~\-+|_:]/g,` `).replace(/\s+/g,` `).trim():``}var Jc={class:`page page-article-detail`},Yc={key:0,class:`detail-skeleton`},Xc={key:1,class:`error-state`},Zc={key:2,class:`detail-layout`},Qc={class:`detail-main`},$c={class:`article-header`},el={class:`article-title`},tl={class:`article-meta`},nl={class:`meta-item meta-author`},rl={class:`meta-item meta-date`},il={key:0,class:`meta-item meta-category neon-text-pink`},al={class:`meta-item meta-reading-time`},ol={class:`meta-item meta-views`},sl={key:0,class:`article-tags`},cl={key:0,class:`article-cover`},ll=[`src`,`alt`],ul={key:1,class:`article-nav`},dl={class:`nav-title`},fl={class:`nav-title`},pl={class:`article-actions`},ml=[`disabled`],hl={class:`comment-section`},gl={class:`detail-sidebar`},_l=y({__name:`ArticleDetail`,setup(i){let o=E();D();let f=N(),y=w(null),x=w(!0),C=w(null),O=w(null),k=w(0),P=0,F=v(()=>y.value?.created_at?new Date(y.value.created_at).toLocaleDateString(`zh-CN`,{year:`numeric`,month:`2-digit`,day:`2-digit`}):``),I=v(()=>M(y.value?.author)),L=v(()=>j(y.value?.category)),R=v(()=>{let e=y.value?.tags;return!e||!Array.isArray(e)?[]:e.map(A).filter(Boolean)}),z=w(!1),B=w(!1),V=v(()=>window.location.origin+o.fullPath),H=v(()=>y.value?y.value.reading_time?y.value.reading_time:Kc(qc(y.value.content||``)):1),ee=v(()=>y.value?JSON.stringify({"@context":`https://schema.org`,"@type":`Article`,headline:y.value.title,description:y.value.excerpt||``,image:y.value.cover_image||void 0,datePublished:y.value.created_at,dateModified:y.value.updated_at,author:{"@type":`Person`,name:`Zhou Jun`},publisher:{"@type":`Person`,name:`Zhou Jun`}}):``),te=null;p(ee,e=>{if(!e){te?.remove(),te=null;return}te||(te=document.createElement(`script`),te.type=`application/ld+json`,te.dataset.articleJsonLd=`1`,document.head.appendChild(te)),te.textContent=e},{immediate:!0});async function U(){if(!(z.value||B.value)){B.value=!0;try{let e=await T.post(`/articles/${y.value.slug}/like/`);y.value&&(y.value.likes_count=e.data.likes_count),z.value=!0}catch{}finally{B.value=!1}}}async function W(){let e=o.params.slug,t=++P;if(!e){C.value=`缺少文章标识`,O.value=null,x.value=!1;return}x.value=!0,C.value=null,O.value=null,y.value=null,z.value=!1;try{let n=f.getArticleBySlug(e);if(n){if(t!==P)return;y.value=n,x.value=!1,G();return}let r=await f.fetchArticleBySlug(e);if(t!==P)return;y.value=r,y.value?G():C.value=`文章不存在`}catch(e){if(t!==P)return;O.value=e?.response?.status??null,O.value===404?C.value=`文章不存在`:C.value=e?.response?.data?.detail||e.message||`加载文章失败`}finally{t===P&&(x.value=!1)}}function G(){y.value&&Uc({title:y.value.title,description:y.value.excerpt||``,image:y.value.cover_image||``,url:window.location.origin+o.fullPath})}return a(W),p(()=>o.params.slug,()=>{window.scrollTo({top:0,behavior:`instant`}),k.value++,W()}),t(()=>{Gc(),te?.remove(),te=null}),(t,i)=>{let a=n(`router-link`);return S(),c(`div`,Jc,[x.value?(S(),c(`div`,Yc,[...i[1]||=[_(`<div class="skeleton-header" data-v-c0862088><div class="skeleton-line w-80 skeleton-lg" data-v-c0862088></div><div class="skeleton-meta-row" data-v-c0862088><div class="skeleton-line w-20" data-v-c0862088></div><div class="skeleton-line w-15" data-v-c0862088></div><div class="skeleton-line w-10" data-v-c0862088></div></div></div><div class="skeleton-body" data-v-c0862088><div class="skeleton-line w-100" data-v-c0862088></div><div class="skeleton-line w-100" data-v-c0862088></div><div class="skeleton-line w-90" data-v-c0862088></div><div class="skeleton-line w-100" data-v-c0862088></div><div class="skeleton-line w-70" data-v-c0862088></div></div>`,2)]])):C.value?(S(),c(`div`,Xc,[i[3]||=s(`svg`,{width:`48`,height:`48`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`1.5`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`circle`,{cx:`12`,cy:`12`,r:`10`}),s(`line`,{x1:`12`,y1:`8`,x2:`12`,y2:`12`}),s(`line`,{x1:`12`,y1:`16`,x2:`12.01`,y2:`16`})],-1),s(`h2`,null,l(O.value===404?`文章不存在`:`加载失败`),1),s(`p`,null,l(C.value),1),u(a,{to:`/articles`,class:`back-link`},{default:e(()=>[...i[2]||=[g(`返回首页`,-1)]]),_:1})])):y.value?(S(),c(`div`,Zc,[s(`article`,Qc,[s(`header`,$c,[s(`h1`,el,l(y.value.title),1),s(`div`,tl,[s(`span`,nl,[i[4]||=s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`path`,{d:`M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2`}),s(`circle`,{cx:`12`,cy:`7`,r:`4`})],-1),g(` `+l(I.value),1)]),s(`span`,rl,[i[5]||=_(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-c0862088><rect x="3" y="4" width="18" height="18" rx="2" ry="2" data-v-c0862088></rect><line x1="16" y1="2" x2="16" y2="6" data-v-c0862088></line><line x1="8" y1="2" x2="8" y2="6" data-v-c0862088></line><line x1="3" y1="10" x2="21" y2="10" data-v-c0862088></line></svg>`,1),g(` `+l(F.value),1)]),y.value.category?(S(),c(`span`,il,[i[6]||=s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`path`,{d:`M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z`})],-1),g(` `+l(L.value),1)])):b(``,!0),s(`span`,al,[i[7]||=s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`circle`,{cx:`12`,cy:`12`,r:`10`}),s(`polyline`,{points:`12 6 12 12 16 14`})],-1),g(` 约 `+l(H.value)+` 分钟 `,1)]),s(`span`,ol,[i[8]||=s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`path`,{d:`M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z`}),s(`circle`,{cx:`12`,cy:`12`,r:`3`})],-1),g(` `+l(y.value.views_count||0),1)])]),R.value.length?(S(),c(`div`,sl,[(S(!0),c(d,null,r(R.value,(e,t)=>(S(),c(`span`,{key:t,class:`tag-pill`},l(e),1))),128))])):b(``,!0)]),y.value.cover_image?(S(),c(`div`,cl,[s(`img`,{src:y.value.cover_image,alt:y.value.title},null,8,ll)])):b(``,!0),u(Ns,{html:y.value.html_content||y.value.content||``,title:y.value.title},null,8,[`html`,`title`]),y.value.prev_article||y.value.next_article?(S(),c(`nav`,ul,[y.value.prev_article?(S(),m(a,{key:0,to:`/article/`+(y.value.prev_article.slug||y.value.prev_article),class:`nav-link prev-link`},{default:e(()=>[i[9]||=s(`span`,{class:`nav-direction`},[s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`polyline`,{points:`15 18 9 12 15 6`})]),g(` 上一篇 `)],-1),s(`span`,dl,l(y.value.prev_article.title||y.value.prev_article),1)]),_:1},8,[`to`])):b(``,!0),y.value.next_article?(S(),m(a,{key:1,to:`/article/`+(y.value.next_article.slug||y.value.next_article),class:`nav-link next-link`},{default:e(()=>[i[10]||=s(`span`,{class:`nav-direction`},[g(` 下一篇 `),s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`polyline`,{points:`9 18 15 12 9 6`})])],-1),s(`span`,fl,l(y.value.next_article.title||y.value.next_article),1)]),_:1},8,[`to`])):b(``,!0)])):b(``,!0),s(`div`,pl,[u(Dc,{title:y.value.title,url:V.value},null,8,[`title`,`url`]),s(`button`,{class:h([`like-btn`,{liked:z.value}]),disabled:B.value,onClick:U},[i[11]||=s(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`},[s(`path`,{d:`M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z`})],-1),s(`span`,null,l(y.value.likes_count||0),1)],10,ml)]),u(Nc,{articles:y.value.related_articles||[]},null,8,[`articles`]),u(Bc),s(`section`,hl,[(S(),m(vc,{"article-slug":y.value.slug,key:k.value},null,8,[`article-slug`])),u(Zs,{"article-slug":y.value.slug,onSubmitted:i[0]||=e=>k.value++},null,8,[`article-slug`])])]),s(`aside`,gl,[u(wc,{html:y.value.html_content||y.value.content||``},null,8,[`html`])])])):b(``,!0)])}}},[[`__scopeId`,`data-v-c0862088`]]);export{_l as default};