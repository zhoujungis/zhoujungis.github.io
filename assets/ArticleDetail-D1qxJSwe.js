import{A as e,C as t,D as n,E as r,R as i,S as a,b as o,c as s,d as c,dt as l,h as u,i as d,j as f,k as p,l as m,lt as h,m as g,p as _,s as v,t as y,u as b,ut as x,w as S,x as C,z as w}from"./_plugin-vue_export-helper-BK47PYcU.js";import{t as T}from"./client-DyaaoQco.js";import{f as E,p as D,v as O,y as k}from"./index-Dxj6jNLE.js";import{i as A,n as j,t as M}from"./labels-H7OcNmBE.js";import{t as N}from"./article-Crs4baYW.js";function P(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function F(e){if(Array.isArray(e))return e}function I(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r,i,a,o,s=[],c=!0,l=!1;try{if(a=(n=n.call(e)).next,t!==0)for(;!(c=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);c=!0);}catch(e){l=!0,i=e}finally{try{if(!c&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(l)throw i}}return s}}function L(){throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function R(e,t){return F(e)||I(e,t)||z(e,t)||L()}function z(e,t){if(e){if(typeof e==`string`)return P(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?P(e,t):void 0}}var B=Object.entries,V=Object.setPrototypeOf,H=Object.isFrozen,U=Object.getPrototypeOf,ee=Object.getOwnPropertyDescriptor,W=Object.freeze,G=Object.seal,K=Object.create,te=typeof Reflect<`u`&&Reflect,ne=te.apply,q=te.construct;W||=function(e){return e},G||=function(e){return e},ne||=function(e,t){var n=[...arguments].slice(2);return e.apply(t,n)},q||=function(e){return new e(...[...arguments].slice(1))};var re=Ce(Array.prototype.forEach),ie=Ce(Array.prototype.lastIndexOf),ae=Ce(Array.prototype.pop),oe=Ce(Array.prototype.push),se=Ce(Array.prototype.splice),ce=Array.isArray,le=Ce(String.prototype.toLowerCase),ue=Ce(String.prototype.toString),de=Ce(String.prototype.match),fe=Ce(String.prototype.replace),pe=Ce(String.prototype.indexOf),me=Ce(String.prototype.trim),he=Ce(Number.prototype.toString),ge=Ce(Boolean.prototype.toString),_e=typeof BigInt>`u`?null:Ce(BigInt.prototype.toString),ve=typeof Symbol>`u`?null:Ce(Symbol.prototype.toString),ye=Ce(Object.prototype.hasOwnProperty),be=Ce(Object.prototype.toString),xe=Ce(RegExp.prototype.test),Se=we(TypeError);function Ce(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);var n=[...arguments].slice(1);return ne(e,t,n)}}function we(e){return function(){return q(e,[...arguments])}}function J(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:le;if(V&&V(e,null),!ce(t))return e;let r=t.length;for(;r--;){let i=t[r];if(typeof i==`string`){let e=n(i);e!==i&&(H(t)||(t[r]=e),i=e)}e[i]=!0}return e}function Te(e){for(let t=0;t<e.length;t++)ye(e,t)||(e[t]=null);return e}function Ee(e){let t=K(null);for(let r of B(e)){var n=R(r,2);let i=n[0],a=n[1];ye(e,i)&&(ce(a)?t[i]=Te(a):a&&typeof a==`object`&&a.constructor===Object?t[i]=Ee(a):t[i]=a)}return t}function De(e){switch(typeof e){case`string`:return e;case`number`:return he(e);case`boolean`:return ge(e);case`bigint`:return _e?_e(e):`0`;case`symbol`:return ve?ve(e):`Symbol()`;case`undefined`:return be(e);case`function`:case`object`:{if(e===null)return be(e);let t=e,n=Oe(t,`toString`);if(typeof n==`function`){let e=n(t);return typeof e==`string`?e:be(e)}return be(e)}default:return be(e)}}function Oe(e,t){for(;e!==null;){let n=ee(e,t);if(n){if(n.get)return Ce(n.get);if(typeof n.value==`function`)return Ce(n.value)}e=U(e)}function n(){return null}return n}function ke(e){try{return xe(e,``),!0}catch{return!1}}var Ae=W(`a.abbr.acronym.address.area.article.aside.audio.b.bdi.bdo.big.blink.blockquote.body.br.button.canvas.caption.center.cite.code.col.colgroup.content.data.datalist.dd.decorator.del.details.dfn.dialog.dir.div.dl.dt.element.em.fieldset.figcaption.figure.font.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.img.input.ins.kbd.label.legend.li.main.map.mark.marquee.menu.menuitem.meter.nav.nobr.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.section.select.shadow.slot.small.source.spacer.span.strike.strong.style.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.track.tt.u.ul.var.video.wbr`.split(`.`)),je=W(`svg.a.altglyph.altglyphdef.altglyphitem.animatecolor.animatemotion.animatetransform.circle.clippath.defs.desc.ellipse.enterkeyhint.exportparts.filter.font.g.glyph.glyphref.hkern.image.inputmode.line.lineargradient.marker.mask.metadata.mpath.part.path.pattern.polygon.polyline.radialgradient.rect.stop.style.switch.symbol.text.textpath.title.tref.tspan.view.vkern`.split(`.`)),Me=W([`feBlend`,`feColorMatrix`,`feComponentTransfer`,`feComposite`,`feConvolveMatrix`,`feDiffuseLighting`,`feDisplacementMap`,`feDistantLight`,`feDropShadow`,`feFlood`,`feFuncA`,`feFuncB`,`feFuncG`,`feFuncR`,`feGaussianBlur`,`feImage`,`feMerge`,`feMergeNode`,`feMorphology`,`feOffset`,`fePointLight`,`feSpecularLighting`,`feSpotLight`,`feTile`,`feTurbulence`]),Ne=W([`animate`,`color-profile`,`cursor`,`discard`,`font-face`,`font-face-format`,`font-face-name`,`font-face-src`,`font-face-uri`,`foreignobject`,`hatch`,`hatchpath`,`mesh`,`meshgradient`,`meshpatch`,`meshrow`,`missing-glyph`,`script`,`set`,`solidcolor`,`unknown`,`use`]),Pe=W(`math.menclose.merror.mfenced.mfrac.mglyph.mi.mlabeledtr.mmultiscripts.mn.mo.mover.mpadded.mphantom.mroot.mrow.ms.mspace.msqrt.mstyle.msub.msup.msubsup.mtable.mtd.mtext.mtr.munder.munderover.mprescripts`.split(`.`)),Fe=W([`maction`,`maligngroup`,`malignmark`,`mlongdiv`,`mscarries`,`mscarry`,`msgroup`,`mstack`,`msline`,`msrow`,`semantics`,`annotation`,`annotation-xml`,`mprescripts`,`none`]),Ie=W([`#text`]),Le=W(`accept.action.align.alt.autocapitalize.autocomplete.autopictureinpicture.autoplay.background.bgcolor.border.capture.cellpadding.cellspacing.checked.cite.class.clear.color.cols.colspan.command.commandfor.controls.controlslist.coords.crossorigin.datetime.decoding.default.dir.disabled.disablepictureinpicture.disableremoteplayback.download.draggable.enctype.enterkeyhint.exportparts.face.for.headers.height.hidden.high.href.hreflang.id.inert.inputmode.integrity.ismap.kind.label.lang.list.loading.loop.low.max.maxlength.media.method.min.minlength.multiple.muted.name.nonce.noshade.novalidate.nowrap.open.optimum.part.pattern.placeholder.playsinline.popover.popovertarget.popovertargetaction.poster.preload.pubdate.radiogroup.readonly.rel.required.rev.reversed.role.rows.rowspan.spellcheck.scope.selected.shape.size.sizes.slot.span.srclang.start.src.srcset.step.style.summary.tabindex.title.translate.type.usemap.valign.value.width.wrap.xmlns`.split(`.`)),Re=W(`accent-height.accumulate.additive.alignment-baseline.amplitude.ascent.attributename.attributetype.azimuth.basefrequency.baseline-shift.begin.bias.by.class.clip.clippathunits.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.cx.cy.d.dx.dy.diffuseconstant.direction.display.divisor.dominant-baseline.dur.edgemode.elevation.end.exponent.fill.fill-opacity.fill-rule.filter.filterunits.flood-color.flood-opacity.font-family.font-size.font-size-adjust.font-stretch.font-style.font-variant.font-weight.fx.fy.g1.g2.glyph-name.glyphref.gradientunits.gradienttransform.height.href.id.image-rendering.in.in2.intercept.k.k1.k2.k3.k4.kerning.keypoints.keysplines.keytimes.lang.lengthadjust.letter-spacing.kernelmatrix.kernelunitlength.lighting-color.local.marker-end.marker-mid.marker-start.markerheight.markerunits.markerwidth.maskcontentunits.maskunits.max.mask.mask-type.media.method.mode.min.name.numoctaves.offset.operator.opacity.order.orient.orientation.origin.overflow.paint-order.path.pathlength.patterncontentunits.patterntransform.patternunits.points.preservealpha.preserveaspectratio.primitiveunits.r.rx.ry.radius.refx.refy.repeatcount.repeatdur.restart.result.rotate.scale.seed.shape-rendering.slope.specularconstant.specularexponent.spreadmethod.startoffset.stddeviation.stitchtiles.stop-color.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke.stroke-width.style.surfacescale.systemlanguage.tabindex.tablevalues.targetx.targety.transform.transform-origin.text-anchor.text-decoration.text-orientation.text-rendering.textlength.type.u1.u2.unicode.values.viewbox.visibility.version.vert-adv-y.vert-origin-x.vert-origin-y.width.word-spacing.wrap.writing-mode.xchannelselector.ychannelselector.x.x1.x2.xmlns.y.y1.y2.z.zoomandpan`.split(`.`)),ze=W(`accent.accentunder.align.bevelled.close.columnalign.columnlines.columnspacing.columnspan.denomalign.depth.dir.display.displaystyle.encoding.fence.frame.height.href.id.largeop.length.linethickness.lquote.lspace.mathbackground.mathcolor.mathsize.mathvariant.maxsize.minsize.movablelimits.notation.numalign.open.rowalign.rowlines.rowspacing.rowspan.rspace.rquote.scriptlevel.scriptminsize.scriptsizemultiplier.selection.separator.separators.stretchy.subscriptshift.supscriptshift.symmetric.voffset.width.xmlns`.split(`.`)),Be=W([`xlink:href`,`xml:id`,`xlink:title`,`xml:space`,`xmlns:xlink`]),Ve=G(/{{[\w\W]*|^[\w\W]*}}/g),He=G(/<%[\w\W]*|^[\w\W]*%>/g),Ue=G(/\${[\w\W]*/g),We=G(/^data-[\-\w.\u00B7-\uFFFF]+$/),Ge=G(/^aria-[\-\w]+$/),Ke=G(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),qe=G(/^(?:\w+script|data):/i),Je=G(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Ye=G(/^html$/i),Xe=G(/^[a-z][.\w]*(-[.\w]+)+$/i),Ze=G(/<[/\w!]/g),Qe=G(/<[/\w]/g),$e=G(/<\/no(script|embed|frames)/i),et=G(/\/>/i),tt={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,processingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},nt=function(){return typeof window>`u`?null:window},rt=function(e,t){if(typeof e!=`object`||typeof e.createPolicy!=`function`)return null;let n=null,r=`data-tt-policy-suffix`;t&&t.hasAttribute(r)&&(n=t.getAttribute(r));let i=`dompurify`+(n?`#`+n:``);try{return e.createPolicy(i,{createHTML(e){return e},createScriptURL(e){return e}})}catch{return console.warn(`TrustedTypes policy `+i+` could not be created.`),null}},it=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},at=function(e,t,n,r){return ye(e,t)&&ce(e[t])?J(r.base?Ee(r.base):{},e[t],r.transform):n};function ot(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:nt(),t=e=>ot(e);if(t.version=`3.4.12`,t.removed=[],!e||!e.document||e.document.nodeType!==tt.document||!e.Element)return t.isSupported=!1,t;let n=e.document,r=n,i=r.currentScript;e.DocumentFragment;let a=e.HTMLTemplateElement,o=e.Node,s=e.Element,c=e.NodeFilter;e.NamedNodeMap===void 0&&(e.NamedNodeMap||e.MozNamedAttrMap),e.HTMLFormElement;let l=e.DOMParser,u=e.trustedTypes,d=s.prototype,f=Oe(d,`cloneNode`),p=Oe(d,`remove`),m=Oe(d,`nextSibling`),h=Oe(d,`childNodes`),g=Oe(d,`parentNode`),_=Oe(d,`shadowRoot`),v=Oe(d,`attributes`),y=o&&o.prototype?Oe(o.prototype,`nodeType`):null,b=o&&o.prototype?Oe(o.prototype,`nodeName`):null;if(typeof a==`function`){let e=n.createElement(`template`);e.content&&e.content.ownerDocument&&(n=e.content.ownerDocument)}let x,S=``,C,w=!1,T=0,E=function(){if(T>0)throw Se(`A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.`)},D=function(e){E(),T++;try{return x.createHTML(e)}finally{T--}},O=function(e){E(),T++;try{return x.createScriptURL(e)}finally{T--}},k=function(){return w||=(C=rt(u,i),!0),C},A=n,j=A.implementation,M=A.createNodeIterator,N=A.createDocumentFragment,P=A.getElementsByTagName,F=r.importNode,I=it();t.isSupported=typeof B==`function`&&typeof g==`function`&&j&&j.createHTMLDocument!==void 0;let L=Ve,R=He,z=Ue,V=We,H=Ge,U=qe,ee=Je,te=Xe,ne=Ke,q=null,he=J({},[...Ae,...je,...Me,...Pe,...Ie]),ge=null,_e=J({},[...Le,...Re,...ze,...Be]),ve=Object.seal(K(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),be=null,Ce=null,we=Object.seal(K(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),Te=!0,st=!0,ct=!1,lt=!0,ut=!1,dt=!0,Y=!1,ft=!1,pt=null,X=null,mt=!1,Z=!1,Q=!1,$=!1,ht=!0,gt=!1,_t=`user-content-`,vt=!0,yt=!1,bt={},xt=null,St=J({},`annotation-xml.audio.colgroup.desc.foreignobject.head.iframe.math.mi.mn.mo.ms.mtext.noembed.noframes.noscript.plaintext.script.selectedcontent.style.svg.template.thead.title.video.xmp`.split(`.`)),Ct=null,wt=J({},[`audio`,`video`,`img`,`source`,`image`,`track`]),Tt=null,Et=J({},[`alt`,`class`,`for`,`id`,`label`,`name`,`pattern`,`placeholder`,`role`,`summary`,`title`,`value`,`style`,`xmlns`]),Dt=`http://www.w3.org/1998/Math/MathML`,Ot=`http://www.w3.org/2000/svg`,kt=`http://www.w3.org/1999/xhtml`,At=kt,jt=!1,Mt=null,Nt=J({},[Dt,Ot,kt],ue),Pt=W([`mi`,`mo`,`mn`,`ms`,`mtext`]),Ft=J({},Pt),It=W([`annotation-xml`]),Lt=J({},It),Rt=J({},[`title`,`style`,`font`,`a`,`script`]),zt=null,Bt=[`application/xhtml+xml`,`text/html`],Vt=null,Ht=null,Ut=n.createElement(`form`),Wt=function(e){return e instanceof RegExp||e instanceof Function},Gt=function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(Ht&&Ht===e)return;(!e||typeof e!=`object`)&&(e={}),e=Ee(e),zt=Bt.indexOf(e.PARSER_MEDIA_TYPE)===-1?`text/html`:e.PARSER_MEDIA_TYPE,Vt=zt===`application/xhtml+xml`?ue:le,q=at(e,`ALLOWED_TAGS`,he,{transform:Vt}),ge=at(e,`ALLOWED_ATTR`,_e,{transform:Vt}),Mt=at(e,`ALLOWED_NAMESPACES`,Nt,{transform:ue}),Tt=at(e,`ADD_URI_SAFE_ATTR`,Et,{transform:Vt,base:Et}),Ct=at(e,`ADD_DATA_URI_TAGS`,wt,{transform:Vt,base:wt}),xt=at(e,`FORBID_CONTENTS`,St,{transform:Vt}),be=at(e,`FORBID_TAGS`,Ee({}),{transform:Vt}),Ce=at(e,`FORBID_ATTR`,Ee({}),{transform:Vt}),bt=ye(e,`USE_PROFILES`)?e.USE_PROFILES&&typeof e.USE_PROFILES==`object`?Ee(e.USE_PROFILES):e.USE_PROFILES:!1,Te=e.ALLOW_ARIA_ATTR!==!1,st=e.ALLOW_DATA_ATTR!==!1,ct=e.ALLOW_UNKNOWN_PROTOCOLS||!1,lt=e.ALLOW_SELF_CLOSE_IN_ATTR!==!1,ut=e.SAFE_FOR_TEMPLATES||!1,dt=e.SAFE_FOR_XML!==!1,Y=e.WHOLE_DOCUMENT||!1,Z=e.RETURN_DOM||!1,Q=e.RETURN_DOM_FRAGMENT||!1,$=e.RETURN_TRUSTED_TYPE||!1,mt=e.FORCE_BODY||!1,ht=e.SANITIZE_DOM!==!1,gt=e.SANITIZE_NAMED_PROPS||!1,vt=e.KEEP_CONTENT!==!1,yt=e.IN_PLACE||!1,ne=ke(e.ALLOWED_URI_REGEXP)?e.ALLOWED_URI_REGEXP:Ke,At=typeof e.NAMESPACE==`string`?e.NAMESPACE:kt,Ft=ye(e,`MATHML_TEXT_INTEGRATION_POINTS`)&&e.MATHML_TEXT_INTEGRATION_POINTS&&typeof e.MATHML_TEXT_INTEGRATION_POINTS==`object`?Ee(e.MATHML_TEXT_INTEGRATION_POINTS):J({},Pt),Lt=ye(e,`HTML_INTEGRATION_POINTS`)&&e.HTML_INTEGRATION_POINTS&&typeof e.HTML_INTEGRATION_POINTS==`object`?Ee(e.HTML_INTEGRATION_POINTS):J({},It);let t=ye(e,`CUSTOM_ELEMENT_HANDLING`)&&e.CUSTOM_ELEMENT_HANDLING&&typeof e.CUSTOM_ELEMENT_HANDLING==`object`?Ee(e.CUSTOM_ELEMENT_HANDLING):K(null);if(ve=K(null),ye(t,`tagNameCheck`)&&Wt(t.tagNameCheck)&&(ve.tagNameCheck=t.tagNameCheck),ye(t,`attributeNameCheck`)&&Wt(t.attributeNameCheck)&&(ve.attributeNameCheck=t.attributeNameCheck),ye(t,`allowCustomizedBuiltInElements`)&&typeof t.allowCustomizedBuiltInElements==`boolean`&&(ve.allowCustomizedBuiltInElements=t.allowCustomizedBuiltInElements),G(ve),ut&&(st=!1),Q&&(Z=!0),bt&&(q=J({},Ie),ge=K(null),bt.html===!0&&(J(q,Ae),J(ge,Le)),bt.svg===!0&&(J(q,je),J(ge,Re),J(ge,Be)),bt.svgFilters===!0&&(J(q,Me),J(ge,Re),J(ge,Be)),bt.mathMl===!0&&(J(q,Pe),J(ge,ze),J(ge,Be))),we.tagCheck=null,we.attributeCheck=null,ye(e,`ADD_TAGS`)&&(typeof e.ADD_TAGS==`function`?we.tagCheck=e.ADD_TAGS:ce(e.ADD_TAGS)&&(q===he&&(q=Ee(q)),J(q,e.ADD_TAGS,Vt))),ye(e,`ADD_ATTR`)&&(typeof e.ADD_ATTR==`function`?we.attributeCheck=e.ADD_ATTR:ce(e.ADD_ATTR)&&(ge===_e&&(ge=Ee(ge)),J(ge,e.ADD_ATTR,Vt))),ye(e,`ADD_URI_SAFE_ATTR`)&&ce(e.ADD_URI_SAFE_ATTR)&&J(Tt,e.ADD_URI_SAFE_ATTR,Vt),ye(e,`FORBID_CONTENTS`)&&ce(e.FORBID_CONTENTS)&&(xt===St&&(xt=Ee(xt)),J(xt,e.FORBID_CONTENTS,Vt)),ye(e,`ADD_FORBID_CONTENTS`)&&ce(e.ADD_FORBID_CONTENTS)&&(xt===St&&(xt=Ee(xt)),J(xt,e.ADD_FORBID_CONTENTS,Vt)),vt&&(q[`#text`]=!0),Y&&J(q,[`html`,`head`,`body`]),q.table&&(J(q,[`tbody`]),delete be.tbody),e.TRUSTED_TYPES_POLICY){if(typeof e.TRUSTED_TYPES_POLICY.createHTML!=`function`)throw Se(`TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.`);if(typeof e.TRUSTED_TYPES_POLICY.createScriptURL!=`function`)throw Se(`TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.`);let t=x;x=e.TRUSTED_TYPES_POLICY;try{S=D(``)}catch(e){throw x=t,e}}else e.TRUSTED_TYPES_POLICY===null?(x=void 0,S=``):(x===void 0&&(x=k()),x&&typeof S==`string`&&(S=D(``)));W&&W(e),Ht=e},Kt=J({},[...je,...Me,...Ne]),qt=J({},[...Pe,...Fe]),Jt=function(e,t,n){return t.namespaceURI===kt?e===`svg`:t.namespaceURI===Dt?e===`svg`&&(n===`annotation-xml`||Ft[n]):!!Kt[e]},Yt=function(e,t,n){return t.namespaceURI===kt?e===`math`:t.namespaceURI===Ot?e===`math`&&Lt[n]:!!qt[e]},Xt=function(e,t,n){return t.namespaceURI===Ot&&!Lt[n]||t.namespaceURI===Dt&&!Ft[n]?!1:!qt[e]&&(Rt[e]||!Kt[e])},Zt=function(e){let t=g(e);(!t||!t.tagName)&&(t={namespaceURI:At,tagName:`template`});let n=le(e.tagName),r=le(t.tagName);return Mt[e.namespaceURI]?e.namespaceURI===Ot?Jt(n,t,r):e.namespaceURI===Dt?Yt(n,t,r):e.namespaceURI===kt?Xt(n,t,r):!!(zt===`application/xhtml+xml`&&Mt[e.namespaceURI]):!1},Qt=function(e){oe(t.removed,{element:e});try{g(e).removeChild(e)}catch{if(p(e),!g(e))throw Se(`a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place`)}},$t=function(e){nn(e);let t=h(e);if(t){let e=[];re(t,t=>{oe(e,t)}),re(e,e=>{try{p(e)}catch{}})}let n=v(e);if(n)for(let t=n.length-1;t>=0;--t){let r=n[t],i=r&&r.name;if(typeof i==`string`)try{e.removeAttribute(i)}catch{}}},en=function(e,n){try{oe(t.removed,{attribute:n.getAttributeNode(e),from:n})}catch{oe(t.removed,{attribute:null,from:n})}if(n.removeAttribute(e),e===`is`)if(Z||Q)try{Qt(n)}catch{}else try{n.setAttribute(e,``)}catch{}},tn=function(e){let t=v(e);if(t)for(let n=t.length-1;n>=0;--n){let r=t[n],i=r&&r.name;if(!(typeof i!=`string`||ge[Vt(i)]))try{e.removeAttribute(i)}catch{}}},nn=function(e){let t=[e];for(;t.length>0;){let e=t.pop();(y?y(e):e.nodeType)===tt.element&&tn(e);let n=h(e);if(n)for(let e=n.length-1;e>=0;--e)t.push(n[e])}},rn=function(e){if(!dt)return;let t=[e];for(;t.length>0;){let e=t.pop(),n=y?y(e):e.nodeType;if(n===tt.processingInstruction||n===tt.comment&&xe(Qe,e.data)){try{p(e)}catch{}continue}if(n===tt.element){let t=e,n=Vt(b?b(e):e.nodeName);try{t.hasAttribute&&t.hasAttribute(`patchsrc`)&&t.removeAttribute(`patchsrc`),t.hasAttribute&&t.hasAttribute(`for`)&&n!==`label`&&n!==`output`&&t.removeAttribute(`for`)}catch{}}let r=h(e);if(r)for(let e=r.length-1;e>=0;--e)t.push(r[e])}},an=function(e){let t=null,r=null;if(mt)e=`<remove></remove>`+e;else{let t=de(e,/^[\r\n\t ]+/);r=t&&t[0]}zt===`application/xhtml+xml`&&At===kt&&(e=`<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>`+e+`</body></html>`);let i=x?D(e):e;if(At===kt)try{t=new l().parseFromString(i,zt)}catch{}if(!t||!t.documentElement){t=j.createDocument(At,`template`,null);try{t.documentElement.innerHTML=jt?S:i}catch{}}let a=t.body||t.documentElement;return e&&r&&a.insertBefore(n.createTextNode(r),a.childNodes[0]||null),At===kt?P.call(t,Y?`html`:`body`)[0]:Y?t.documentElement:a},on=function(e){return M.call(e.ownerDocument||e,e,c.SHOW_ELEMENT|c.SHOW_COMMENT|c.SHOW_TEXT|c.SHOW_PROCESSING_INSTRUCTION|c.SHOW_CDATA_SECTION,null)},sn=function(e){return e=fe(e,L,` `),e=fe(e,R,` `),e=fe(e,z,` `),e},cn=function(e){e.normalize();let t=M.call(e.ownerDocument||e,e,c.SHOW_TEXT|c.SHOW_COMMENT|c.SHOW_CDATA_SECTION|c.SHOW_PROCESSING_INSTRUCTION,null),n=t.nextNode();for(;n;)n.data=sn(n.data),n=t.nextNode();let r=e.querySelectorAll?.call(e,`template`);r&&re(r,e=>{un(e.content)&&cn(e.content)})},ln=function(e){let t=b?b(e):null;return typeof t!=`string`||Vt(t)!==`form`?!1:typeof e.nodeName!=`string`||typeof e.textContent!=`string`||typeof e.removeChild!=`function`||e.attributes!==v(e)||typeof e.removeAttribute!=`function`||typeof e.setAttribute!=`function`||typeof e.namespaceURI!=`string`||typeof e.insertBefore!=`function`||typeof e.hasChildNodes!=`function`||e.nodeType!==y(e)||e.childNodes!==h(e)},un=function(e){if(!y||typeof e!=`object`||!e)return!1;try{return y(e)===tt.documentFragment}catch{return!1}},dn=function(e){if(!y||typeof e!=`object`||!e)return!1;try{return typeof y(e)==`number`}catch{return!1}};function fn(e,n,r){e.length!==0&&re(e,e=>{e.call(t,n,r,Ht)})}let pn=function(e,t){return!!(dt&&e.hasChildNodes()&&!dn(e.firstElementChild)&&xe(Ze,e.textContent)&&xe(Ze,e.innerHTML)||dt&&e.namespaceURI===kt&&t===`style`&&dn(e.firstElementChild)||e.nodeType===tt.processingInstruction||dt&&e.nodeType===tt.comment&&xe(Qe,e.data))},mn=function(e,t){if(!be[t]&&vn(t)&&(ve.tagNameCheck instanceof RegExp&&xe(ve.tagNameCheck,t)||ve.tagNameCheck instanceof Function&&ve.tagNameCheck(t)))return!1;if(vt&&!xt[t]){let t=g(e),n=h(e);if(n&&t){let r=n.length;for(let i=r-1;i>=0;--i){let r=yt?n[i]:f(n[i],!0);t.insertBefore(r,m(e))}}}return Qt(e),!0},hn=function(e,n){if(fn(I.beforeSanitizeElements,e,null),e!==n&&g(e)===null)return!0;if(ln(e))return Qt(e),!0;let r=Vt(b?b(e):e.nodeName);if(fn(I.uponSanitizeElement,e,{tagName:r,allowedTags:q}),e!==n&&g(e)===null)return!0;if(pn(e,r))return Qt(e),!0;if(be[r]||!(we.tagCheck instanceof Function&&we.tagCheck(r))&&!q[r]){let t=mn(e,r);return t===!1&&fn(I.afterSanitizeElements,e,null),t}if((y?y(e):e.nodeType)===tt.element&&!Zt(e)||(r===`noscript`||r===`noembed`||r===`noframes`)&&xe($e,e.innerHTML))return Qt(e),!0;if(ut&&e.nodeType===tt.text){let n=sn(e.textContent);e.textContent!==n&&(oe(t.removed,{element:e.cloneNode()}),e.textContent=n)}return fn(I.afterSanitizeElements,e,null),!1},gn=function(e,t,r){if(Ce[t]||dt&&t===`patchsrc`||dt&&t===`for`&&e!==`label`&&e!==`output`||ht&&(t===`id`||t===`name`)&&(r in n||r in Ut))return!1;let i=ge[t]||we.attributeCheck instanceof Function&&we.attributeCheck(t,e);if(!(st&&xe(V,t))&&!(Te&&xe(H,t))){if(!i){if(!(vn(e)&&(ve.tagNameCheck instanceof RegExp&&xe(ve.tagNameCheck,e)||ve.tagNameCheck instanceof Function&&ve.tagNameCheck(e))&&(ve.attributeNameCheck instanceof RegExp&&xe(ve.attributeNameCheck,t)||ve.attributeNameCheck instanceof Function&&ve.attributeNameCheck(t,e))||t===`is`&&ve.allowCustomizedBuiltInElements&&(ve.tagNameCheck instanceof RegExp&&xe(ve.tagNameCheck,r)||ve.tagNameCheck instanceof Function&&ve.tagNameCheck(r))))return!1}else if(!Tt[t]&&!xe(ne,fe(r,ee,``))&&!((t===`src`||t===`xlink:href`||t===`href`)&&e!==`script`&&pe(r,`data:`)===0&&Ct[e])&&!(ct&&!xe(U,fe(r,ee,``)))&&r)return!1}return!0},_n=J({},[`annotation-xml`,`color-profile`,`font-face`,`font-face-format`,`font-face-name`,`font-face-src`,`font-face-uri`,`missing-glyph`]),vn=function(e){return!_n[le(e)]&&xe(te,e)},yn=function(e,t,n,r){if(x&&typeof u==`object`&&typeof u.getAttributeType==`function`&&!n)switch(u.getAttributeType(e,t)){case`TrustedHTML`:return D(r);case`TrustedScriptURL`:return O(r)}return r},bn=function(e,n,r,i){try{r?e.setAttributeNS(r,n,i):e.setAttribute(n,i),ln(e)?Qt(e):ae(t.removed)}catch{en(n,e)}},xn=function(e){fn(I.beforeSanitizeAttributes,e,null);let t=e.attributes;if(!t||ln(e))return;let n={attrName:``,attrValue:``,keepAttr:!0,allowedAttributes:ge,forceKeepAttr:void 0},r=t.length,i=Vt(e.nodeName);for(;r--;){let a=t[r],o=a.name,s=a.namespaceURI,c=a.value,l=Vt(o),u=c,d=o===`value`?u:me(u);if(n.attrName=l,n.attrValue=d,n.keepAttr=!0,n.forceKeepAttr=void 0,fn(I.uponSanitizeAttribute,e,n),d=n.attrValue,gt&&(l===`id`||l===`name`)&&pe(d,_t)!==0&&(en(o,e),d=_t+d),dt&&xe(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,d)){en(o,e);continue}if(l===`attributename`&&de(d,`href`)){en(o,e);continue}if(!n.forceKeepAttr){if(!n.keepAttr){en(o,e);continue}if(!lt&&xe(et,d)){en(o,e);continue}if(ut&&(d=sn(d)),!gn(i,l,d)){en(o,e);continue}d=yn(i,l,s,d),d!==u&&bn(e,o,s,d)}}fn(I.afterSanitizeAttributes,e,null)},Sn=function(e){let t=null,n=on(e);for(fn(I.beforeSanitizeShadowDOM,e,null);t=n.nextNode();)if(fn(I.uponSanitizeShadowNode,t,null),hn(t,e),xn(t),un(t.content)&&Sn(t.content),(y?y(t):t.nodeType)===tt.element){let e=_(t);un(e)&&(Cn(e),Sn(e))}fn(I.afterSanitizeShadowDOM,e,null)},Cn=function(e){let t=[{node:e,shadow:null}];for(;t.length>0;){let e=t.pop();if(e.shadow){Sn(e.shadow);continue}let n=e.node,r=(y?y(n):n.nodeType)===tt.element,i=h(n);if(i)for(let e=i.length-1;e>=0;--e)t.push({node:i[e],shadow:null});if(r){let e=b?b(n):null;if(typeof e==`string`&&Vt(e)===`template`){let e=n.content;un(e)&&t.push({node:e,shadow:null})}}if(r){let e=_(n);un(e)&&t.push({node:null,shadow:e},{node:e,shadow:null})}}};return t.sanitize=function(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=null,a=null,o=null,s=null;if(jt=!e,jt&&(e=`<!-->`),typeof e!=`string`&&!dn(e)&&(e=De(e),typeof e!=`string`))throw Se(`dirty is not a string, aborting`);if(!t.isSupported)return e;ft?(q=pt,ge=X):Gt(n),(I.uponSanitizeElement.length>0||I.uponSanitizeAttribute.length>0)&&(q=Ee(q)),I.uponSanitizeAttribute.length>0&&(ge=Ee(ge)),t.removed=[];let c=yt&&typeof e!=`string`&&dn(e);if(c){rn(e);let t=b?b(e):e.nodeName;if(typeof t==`string`){let n=Vt(t);if(!q[n]||be[n])throw $t(e),Se(`root node is forbidden and cannot be sanitized in-place`)}if(ln(e))throw $t(e),Se(`root node is clobbered and cannot be sanitized in-place`);try{Cn(e)}catch(t){throw $t(e),t}}else if(dn(e))i=an(`<!---->`),a=i.ownerDocument.importNode(e,!0),a.nodeType===tt.element&&a.nodeName===`BODY`||a.nodeName===`HTML`?i=a:i.appendChild(a),Cn(a);else{if(!Z&&!ut&&!Y&&e.indexOf(`<`)===-1)return x&&$?D(e):e;if(i=an(e),!i)return Z?null:$?S:``}i&&mt&&Qt(i.firstChild);let l=c?e:i,u=on(l);try{for(;o=u.nextNode();)hn(o,l),xn(o),un(o.content)&&Sn(o.content)}catch(n){throw c&&($t(e),re(t.removed,e=>{e.element&&nn(e.element)})),n}if(c)return re(t.removed,e=>{e.element&&nn(e.element)}),ut&&cn(e),e;if(Z){if(ut&&cn(i),Q)for(s=N.call(i.ownerDocument);i.firstChild;)s.appendChild(i.firstChild);else s=i;return(ge.shadowroot||ge.shadowrootmode)&&(s=F.call(r,s,!0)),s}let d=Y?i.outerHTML:i.innerHTML;return Y&&q[`!doctype`]&&i.ownerDocument&&i.ownerDocument.doctype&&i.ownerDocument.doctype.name&&xe(Ye,i.ownerDocument.doctype.name)&&(d=`<!DOCTYPE `+i.ownerDocument.doctype.name+`>
`+d),ut&&(d=sn(d)),x&&$?D(d):d},t.setConfig=function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Gt(e),ft=!0,pt=q,X=ge},t.clearConfig=function(){Ht=null,ft=!1,pt=null,X=null,x=C,S=``},t.isValidAttribute=function(e,t,n){Ht||Gt({});let r=Vt(e),i=Vt(t);return gn(r,i,n)},t.addHook=function(e,t){typeof t==`function`&&ye(I,e)&&oe(I[e],t)},t.removeHook=function(e,t){if(ye(I,e)){if(t!==void 0){let n=ie(I[e],t);return n===-1?void 0:se(I[e],n,1)[0]}return ae(I[e])}},t.removeHooks=function(e){ye(I,e)&&(I[e]=[])},t.removeAllHooks=function(){I=it()},t}var st=ot();function ct(e,t){let n=String(e??``),r=n.match(/^\s*<h1\b[^>]*>([\s\S]*?)<\/h1>\s*/i);if(!r)return n;let i=r[1].replace(/<[^>]*>/g,``).replace(/\s+/g,` `).trim(),a=String(t??``).replace(/\s+/g,` `).trim();return!a||i!==a?n:n.slice(r[0].length)}function lt(e){let t=e.length,n=Array.from({length:t},(e,n)=>n+1<t?n+1:null),r=[],i=null,a=t>0?0:null,o=null,s=(e,t)=>r.push({phase:e,desc:t,prev:i,curr:a,next:o,nextOf:[...n],done:!1}),c=t=>t===null?`∅`:String(e[t]);if(t===0)return s(`init`,"空链表。`head` 本身就是 ∅，直接返回 ∅ —— 这是必须单独处理的第一种边界。"),r[0].done=!0,r;for(s(`init`,`初始状态：\`prev\` 先站在 ∅（反转后头节点会变成尾节点，它的 \`next\` 必须指向空），\`curr\` 指向头节点 ${c(a)}。`);a!==null;)o=n[a],s(`read-next`,`① \`next = curr.next\`，先记住 ${c(o)}。这一步看着多余，其实是整个算法的命门：一旦 ② 把 \`curr\` 的指针掉头，通往后面节点的唯一线索就断了，所以必须提前存好。`),n[a]=i,s(`flip`,`② \`curr.next = prev\`，把 ${c(a)} 的箭头掉个头，指向 ${c(i)}。`+(i===null?` 因为 \`prev\` 还是 ∅，${c(a)} 就成了新的尾节点。`:``)),i=a,a=o,s(`advance`,a===null?`③ \`prev = curr\`，\`curr = next\` = ∅。curr 走出了链表，循环结束 —— 返回 \`prev\`（${c(i)}），它就是反转后的新头节点。`:`③ \`prev\` 和 \`curr\` 一起右移：\`prev\` 指向 ${c(i)}，\`curr\` 指向 ${c(a)}。准备处理下一个节点。`);return r[r.length-1].done=!0,r}var ut=`viz-chrome-styles`,dt=`http://www.w3.org/2000/svg`;function Y(e,t){let n=document.createElementNS(dt,e);if(t)for(let e in t)n.setAttribute(e,t[e]);return n}function ft(e,t,n,r,i=`viz-arrow`){let a=Y(`g`,{class:i}),o=r>0?t:e,s=r>0?e:t;return a.appendChild(Y(`line`,{class:`${i}__line`,x1:s,y1:n,x2:o-r*9,y2:n})),a.appendChild(Y(`path`,{class:`${i}__head`,d:`M ${o} ${n} L ${o-r*9} ${n-5.5} L ${o-r*9} ${n+5.5} Z`})),a}var pt=`
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
`;function X(){if(document.getElementById(ut))return;let e=document.createElement(`style`);e.id=ut,e.textContent=pt,document.head.appendChild(e)}function mt(){document.getElementById(ut)?.remove()}function Z(e,t){e.textContent=``;let n=String(t??``),r=/(`[^`]*`|\*\*[^*]+\*\*)/g,i=0;for(let t of n.matchAll(r)){t.index>i&&e.appendChild(document.createTextNode(n.slice(i,t.index)));let r=t[0],a=r.startsWith("`"),o=document.createElement(a?`code`:`strong`);o.textContent=r.slice(a?1:2,a?-1:-2),e.appendChild(o),i=t.index+r.length}i<n.length&&e.appendChild(document.createTextNode(n.slice(i)))}function Q({playLabel:e=`播放`,pauseLabel:t=`暂停`}={}){let n=(e,t)=>{let n=document.createElement(`button`);return n.type=`button`,n.className=t?`viz__btn ${t}`:`viz__btn`,n.textContent=e,n},r=document.createElement(`div`);r.className=`viz__bar`;let i=n(`上一步`),a=n(e,`viz__btn--play`),o=n(`下一步`),s=n(`重置`),c=document.createElement(`span`);return c.className=`viz__count`,r.append(i,a,o,s,c),{root:r,prev:i,play:a,next:o,reset:s,count:c,setPlaying:n=>{a.textContent=n?t:e}}}function $({steps:e,controls:t,intervalMs:n=1150,onRender:r}){let i=0,a=null,o=()=>{a&&=(clearInterval(a),null),t.setPlaying(!1)},s=()=>{r(i,e[i]),t.count.textContent=`第 ${i+1} / ${e.length} 步`,t.prev.disabled=i===0,t.next.disabled=i===e.length-1,t.reset.disabled=i===0&&!a},c=()=>{a||(i===e.length-1&&(i=0),t.setPlaying(!0),a=setInterval(()=>{if(i>=e.length-1){o(),s();return}i+=1,s()},n),s())},l=t=>{o(),i=Math.min(e.length-1,Math.max(0,i+t)),s()},u=()=>{o(),i=0,s()},d=t=>{o(),i=Math.min(e.length-1,Math.max(0,t)),s()},f={prev:()=>l(-1),next:()=>l(1),reset:u,play:()=>a?o():c()};return t.prev.addEventListener(`click`,f.prev),t.next.addEventListener(`click`,f.next),t.reset.addEventListener(`click`,f.reset),t.play.addEventListener(`click`,f.play),{render:s,play:c,stop:o,reset:u,jumpTo:d,destroy:()=>{o(),t.prev.removeEventListener(`click`,f.prev),t.next.removeEventListener(`click`,f.next),t.reset.removeEventListener(`click`,f.reset),t.play.removeEventListener(`click`,f.play)},get index(){return i}}}var ht=`llv-styles`,gt=72,_t=52,vt=44,yt=68,bt=96,xt=122,St=48,Ct=200,wt=240,Tt=62,Et=26,Dt=276,Ot=26,kt=1150,At=0,jt=(e,t,n,r)=>ft(e,t,n,r,`llv-edge`),Mt=`
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
`;function Nt(){if(X(),document.getElementById(ht))return;let e=document.createElement(`style`);e.id=ht,e.textContent=Mt,document.head.appendChild(e)}function Pt(e,t={}){if(!e||e.dataset.llvMounted===`1`)return{destroy(){}};e.dataset.llvMounted=`1`,Nt(),At+=1;let n=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4,5],r=t.autoplay!==!1,i=lt(n),a=n.length,o=Array.from({length:a},(e,t)=>t+1<a?t+1:null),s=2*yt+a*gt+Math.max(0,a-1)*vt,c=e=>yt+e*116,l=e=>c(e)+gt/2,u=Ot,d=s-Ot,f=document.createElement(`div`);f.className=`viz llv`;let p=document.createElement(`div`);p.className=`viz__stage`,f.appendChild(p);let m=Y(`svg`,{class:`viz__svg llv__svg`,viewBox:`0 0 ${s} ${Dt}`,role:`img`,"aria-label":`反转链表推演动画：${n.join(` → `)}`});p.appendChild(m);for(let e of[u,d]){m.appendChild(Y(`circle`,{class:`llv-null__ring`,cx:e,cy:xt,r:15}));let t=Y(`text`,{class:`llv-null__text`,x:e,y:xt});t.textContent=`∅`,m.appendChild(t)}let h=Y(`line`,{class:`llv-tick`}),g=Y(`line`,{class:`llv-tick`}),_=Y(`line`,{class:`llv-tick`});m.append(h,g,_);let v=[];for(let e=0;e<a-1;e+=1){let t=c(e)+gt,n=c(e+1),r=jt(t,n,xt,1),i=jt(t,n,xt,-1);m.append(r,i),v.push({fwd:r,bwd:i})}let y=jt(c(a-1)+gt,d-15,xt,1),b=jt(41,c(0),xt,-1);m.append(y,b);let x=[];for(let e=0;e<a;e+=1){let t=Y(`g`,{class:`llv-node`});t.appendChild(Y(`rect`,{class:`llv-node__box`,x:c(e),y:bt,width:gt,height:_t,rx:9}));let r=Y(`text`,{class:`llv-node__value`,x:l(e),y:xt});r.textContent=String(n[e]),t.appendChild(r),m.appendChild(t),x.push(t)}function S(e,t){let n=Y(`g`,{class:`llv-chip llv-chip--${e}`});n.appendChild(Y(`rect`,{class:`llv-chip__box`,x:-62/2,y:-26/2,width:Tt,height:Et}));let r=Y(`text`,{class:`llv-chip__text`,x:0,y:0});return r.textContent=t,n.appendChild(r),n}let C=S(`next`,`next`),w=S(`prev`,`prev`),T=S(`curr`,`curr`);m.append(C,w,T);let E=document.createElement(`p`);E.className=`viz__desc`,E.setAttribute(`aria-live`,`polite`),f.appendChild(E);let D=Q();f.appendChild(D.root),e.textContent=``,e.appendChild(f);let O=null;function k(e,t,n,r,i,a,o){e.style.transform=`translate(${n}px, ${r}px)`,e.style.opacity=i?`1`:`0`,i?(t.setAttribute(`x1`,n),t.setAttribute(`x2`,n),t.setAttribute(`y1`,a),t.setAttribute(`y2`,o),t.style.opacity=`0.65`):t.style.opacity=`0`}function A(e,t){for(let e=0;e<a;e+=1){let n=x[e];n.classList.toggle(`is-flipped`,t.nextOf[e]!==o[e]),n.classList.toggle(`is-curr`,t.curr===e),n.classList.toggle(`is-next`,t.next===e)}for(let e=0;e<a-1;e+=1){let n=t.nextOf[e]===e+1,r=t.nextOf[e+1]===e;v[e].fwd.classList.toggle(`is-on`,n),v[e].bwd.classList.toggle(`is-on`,r),v[e].bwd.classList.toggle(`is-flipped`,r)}let n=t.nextOf[a-1]===null,r=t.nextOf[0]===null;y.classList.toggle(`is-on`,n),b.classList.toggle(`is-on`,r),b.classList.toggle(`is-flipped`,r),k(w,g,t.prev===null?u:l(t.prev),Ct,!0,Ct-Et/2,148),k(T,_,t.curr===null?d:l(t.curr),wt,!0,wt-Et/2,148),k(C,h,t.next===null?d:l(t.next),St,t.phase!==`init`,61,bt),Z(E,t.desc)}let j=$({steps:i,controls:D,intervalMs:kt,onRender:A});j.jumpTo(Math.trunc(t.initialStep)||0);let M=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!M&&typeof IntersectionObserver==`function`&&(O=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){O.disconnect(),O=null,j.play();return}},{threshold:.35}),O.observe(f)),{destroy(){O&&=(O.disconnect(),null),j.destroy(),e.textContent=``,delete e.dataset.llvMounted,--At,At<=0&&(document.getElementById(ht)?.remove(),mt())}}}var Ft=e=>String(e);function It(e,t){let n=Array.isArray(e)?e:[],r=Array.isArray(t)?t:[],i=[],a=[],o=0,s=0,c=(e,t,c={})=>i.push({phase:e,desc:t,p1:o<n.length?o:null,p2:s<r.length?s:null,taken:a.map(e=>({...e})),rest:null,done:!1,...c}),l=(e,t)=>e===`a`?n[t]:r[t];if(n.length===0&&r.length===0)return c(`init`,`两条链表都是空的。哑结点后面什么都没有，返回 ∅。`),i[0].done=!0,i;if(n.length===0||r.length===0){let e=n.length===0?`A`:`B`,t=e===`A`?`B`:`A`;return c(`init`,`${e} 是空链表，那么「合并」就是原样返回 ${t}（${(t===`A`?n:r).map(Ft).join(`、`)}）—— 一个空链表和一个有序链表合并，结果就是那个有序链表本身。`),i[0].done=!0,i}for(c(`init`,`两个指针各站在自己链表的头部：\`p1\` 指向 A 的 ${Ft(n[0])}，\`p2\` 指向 B 的 ${Ft(r[0])}。结果链表先放一个**哑结点**当锚点 —— 它不是答案的一部分，只是为了让我们不必特判「第一个节点该接谁」，最后返回 \`dummy.next\` 就行。`);o<n.length&&s<r.length;){let e=n[o]<=r[s];c(`compare`,`比较 \`p1\` 的 ${Ft(n[o])} 和 \`p2\` 的 ${Ft(r[s])}：`+(e?`${Ft(n[o])} ≤ ${Ft(r[s])}，取 A 的 ${Ft(n[o])}。`+(n[o]===r[s]?`（相等时取哪边都行，习惯上取 A）`:``):`${Ft(r[s])} < ${Ft(n[o])}，取 B 的 ${Ft(r[s])}。`),{cursor:e?`a`:`b`}),e?(a.push({list:`a`,i:o}),o+=1):(a.push({list:`b`,i:s}),s+=1),c(`take`,`把 ${Ft(l(a[a.length-1].list,a[a.length-1].i))} 接到结果链表的尾部，然后 ${e?"`p1`":"`p2`"} 前移一格。`+(e&&o>=n.length?` A 走完了。`:``)+(!e&&s>=r.length?` B 走完了。`:``),{picked:e?`a`:`b`})}if(o<n.length||s<r.length){let e=o<n.length?`a`:`b`,t=o<n.length?o:s,i=(e===`a`?n.slice(o):r.slice(s)).map(Ft).join(`、`),l=e===`a`?n:r,u=o<n.length?o:null,d=s<r.length?s:null;for(let n=t;n<l.length;n+=1)a.push({list:e,i:n});e===`a`?o=n.length:s=r.length,c(`append-rest`,`${e===`a`?`B`:`A`} 已经走完了，${e===`a`?`A`:`B`} 剩下的 ${i} 全部原样接到结果尾部。**这是整道题最容易被忽略的一步**：两条链表各自都是有序的，所以剩下这段不需要再逐个比较，直接整段接上就对。`,{rest:{list:e,from:t},p1:u,p2:d})}return c(`done`,`两条链表都走完了。结果链表是 ${a.map(e=>Ft(l(e.list,e.i))).join(` → `)} —— 但别忘了开头那个哑结点，它不是答案的一部分，所以返回 \`dummy.next\`。`),i[i.length-1].done=!0,i}var Lt=`mtl-styles`,Rt=60,zt=44,Bt=94,Vt=84,Ht=40,Ut=130,Wt=218,Gt=214/2,Kt=38,qt=24,Jt=17,Yt=26,Xt=15,Zt=302,Qt=1150,$t=0,en=`
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
`;function tn(){if(X(),document.getElementById(Lt))return;let e=document.createElement(`style`);e.id=Lt,e.textContent=en,document.head.appendChild(e)}function nn(e,t={}){if(!e||e.dataset.mtlMounted===`1`)return{destroy(){}};e.dataset.mtlMounted=`1`,tn(),$t+=1;let n=Array.isArray(t.listA)&&t.listA.length?t.listA:[1,2,4],r=Array.isArray(t.listB)&&t.listB.length?t.listB:[1,3,4],i=t.autoplay!==!1,a=It(n,r),o=a[a.length-1].taken,s=e=>e.list===`a`?n[e.i]:r[e.i],c=1+o.length,l=e=>Vt+e*Bt,u=e=>l(e)+Rt/2,d=e=>e<=0?Vt:Vt+(e-1)*Bt+Rt,f=e=>e<=0?Vt:d(e)+Yt,p=Math.max(d(n.length),d(r.length),d(c))+Yt+Xt+12,m=document.createElement(`div`);m.className=`viz mtl`;let h=document.createElement(`div`);h.className=`viz__stage`,m.appendChild(h);let g=Y(`svg`,{class:`viz__svg mtl__svg`,viewBox:`0 0 ${p} ${Zt}`,role:`img`,"aria-label":`合并两个有序链表推演动画：${n.join(`、`)} 与 ${r.join(`、`)}`});h.appendChild(g);for(let[e,t]of[[`A`,62],[`B`,152],[`结果`,240]]){let n=Y(`text`,{class:`mtl-row-label`,x:30,y:t});n.textContent=e,g.appendChild(n)}function _(e,t){g.appendChild(Y(`circle`,{class:`mtl-dummy__box`,cx:e,cy:t,r:Xt}));let n=Y(`text`,{class:`mtl-dummy__text`,x:e,y:t});n.textContent=`∅`,g.appendChild(n)}function v(e,t,n,r){let i=Y(`g`,{class:r});return i.appendChild(Y(`line`,{class:`mtl-edge__line`,x1:e,y1:n,x2:t-9,y2:n})),i.appendChild(Y(`path`,{class:`mtl-edge__head`,d:`M ${t} ${n} L ${t-9} ${n-5.5} L ${t-9} ${n+5.5} Z`})),g.appendChild(i),i}function y(e,t){let n=t+zt/2;for(let t=0;t<e-1;t+=1)v(l(t)+Rt,l(t+1),n,`mtl-edge`);_(f(e),n),e>0&&v(d(e),f(e)-Xt,n,`mtl-edge`)}y(n.length,Ht),y(r.length,Ut);let b=[];for(let e=1;e<c;e+=1)b.push(v(l(e-1)+Rt,l(e),240,`mtl-edge mtl-redge`));_(f(c),240);let x=v(d(c),f(c)-Xt,240,`mtl-edge mtl-redge`);function S(e,t,n,r){let i=Y(`g`,{class:`mtl-node ${r}`});i.appendChild(Y(`rect`,{class:`mtl-node__box`,x:l(t),y:n,width:Rt,height:zt,rx:9}));let a=Y(`text`,{class:`mtl-node__value`,x:u(t),y:n+zt/2});return a.textContent=String(e),i.appendChild(a),g.appendChild(i),i}let C=n.map((e,t)=>S(e,t,Ht,`mtl-node--a`)),w=r.map((e,t)=>S(e,t,Ut,`mtl-node--b`)),T=Y(`g`,{class:`mtl-dummy`});T.appendChild(Y(`rect`,{class:`mtl-dummy__box`,x:l(0),y:Wt,width:Rt,height:zt,rx:9}));let E=Y(`text`,{class:`mtl-dummy__text`,x:u(0),y:240});E.textContent=`dummy`,T.appendChild(E),g.appendChild(T);let D=o.map((e,t)=>S(s(e),t+1,Wt,`mtl-rslot mtl-rslot--from-${e.list}`)),O=Y(`g`,{class:`mtl-vs`});O.appendChild(Y(`circle`,{class:`mtl-vs__ring`,cx:0,cy:0,r:13}));let k=Y(`text`,{class:`mtl-vs__text`,x:0,y:0});k.textContent=`vs`,O.appendChild(k),g.appendChild(O);function A(e,t){let n=Y(`g`,{class:`mtl-chip mtl-chip--${e}`});n.appendChild(Y(`rect`,{class:`mtl-chip__box`,x:-38/2,y:-24/2,width:Kt,height:qt}));let r=Y(`text`,{class:`mtl-chip__text`,x:0,y:0});return r.textContent=t,n.appendChild(r),g.appendChild(n),n}let j=A(`p1`,`p1`),M=A(`p2`,`p2`),N=A(`tail`,`tail`),P=document.createElement(`p`);P.className=`viz__desc`,P.setAttribute(`aria-live`,`polite`),m.appendChild(P);let F=Q();m.appendChild(F.root),e.textContent=``,e.appendChild(m);let I=null;function L(e,t,n){e.style.transform=`translate(${t}px, ${n}px)`}function R(e,t){let i=new Set(t.taken.map(e=>`${e.list}:${e.i}`));C.forEach((e,n)=>{e.classList.toggle(`is-taken`,i.has(`a:${n}`)),e.classList.toggle(`is-cand`,t.phase===`compare`&&t.p1===n),e.classList.toggle(`is-win`,t.phase===`compare`&&t.cursor===`a`&&t.p1===n),e.classList.toggle(`is-rest`,t.phase===`append-rest`&&t.rest?.list===`a`&&n>=t.rest.from)}),w.forEach((e,n)=>{e.classList.toggle(`is-taken`,i.has(`b:${n}`)),e.classList.toggle(`is-cand`,t.phase===`compare`&&t.p2===n),e.classList.toggle(`is-win`,t.phase===`compare`&&t.cursor===`b`&&t.p2===n),e.classList.toggle(`is-rest`,t.phase===`append-rest`&&t.rest?.list===`b`&&n>=t.rest.from)});let a=t.rest?(t.rest.list===`a`?n.length:r.length)-t.rest.from:0,o=t.phase===`take`?t.taken.length:t.phase===`append-rest`?t.taken.length-a+1:1/0;D.forEach((e,n)=>{let r=n+1,i=r<=t.taken.length;e.classList.toggle(`is-filled`,i),e.classList.toggle(`is-new`,i&&r>=o)}),b.forEach((e,n)=>e.classList.toggle(`is-on`,n+1<=t.taken.length)),x.classList.toggle(`is-on`,t.done);let s=t.phase===`compare`;if(O.classList.toggle(`is-on`,s),s){let e=(u(t.p1)+u(t.p2))/2;O.style.transform=`translate(${e}px, ${Gt}px)`}L(j,t.p1===null?f(n.length):u(t.p1),Ht-Jt),L(M,t.p2===null?f(r.length):u(t.p2),Ut-Jt),L(N,u(Math.min(t.taken.length,c-1)),279),Z(P,t.desc)}let z=$({steps:a,controls:F,intervalMs:Qt,onRender:R});z.jumpTo(Math.trunc(t.initialStep)||0);let B=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return i&&!B&&typeof IntersectionObserver==`function`&&(I=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){I.disconnect(),I=null,z.play();return}},{threshold:.35}),I.observe(m)),{destroy(){I&&=(I.disconnect(),null),z.destroy(),e.textContent=``,delete e.dataset.mtlMounted,--$t,$t<=0&&(document.getElementById(Lt)?.remove(),mt())}}}var rn=e=>String.fromCharCode(65+e);function an(e){let t=(Array.isArray(e)?e:[]).map(e=>Array.isArray(e)?e.slice():[]),n=t.length,r=[],i=t.map(e=>e.length?0:null),a=[],o=[],s=(e,n)=>{let r=t[e.list][e.i],i=t[n.list][n.i];return r===i?e.list<n.list:r<i},c=e=>t[e.list][e.i],l=(e,t,n={})=>r.push({phase:e,desc:t,heap:o.map(e=>({...e})),cursors:i.slice(),taken:a.map(e=>({...e})),popped:null,pushed:null,moved:[],done:!1,...n});function u(e){let t=[];for(;e>0;){let n=e-1>>1;if(!s(o[e],o[n]))break;[o[e],o[n]]=[o[n],o[e]],t.push(e,n),e=n}return t}function d(e){let t=[];for(;;){let n=2*e+1,r=2*e+2,i=e;if(n<o.length&&s(o[n],o[i])&&(i=n),r<o.length&&s(o[r],o[i])&&(i=r),i===e)break;[o[e],o[i]]=[o[i],o[e]],t.push(e,i),e=i}return t}let f=[];for(let e=0;e<n;e+=1)i[e]!==null&&(o.push({list:e,i:0}),f=f.concat(u(o.length-1)));let p=t.filter(e=>e.length).length,m=t.reduce((e,t)=>e+t.length,0);if(o.length===0)return l(`init`,n===0?"`lists` 是个空数组，一条链表都没有，直接返回 ∅。":`${n} 条链表全是空的 —— 堆建起来是空的，直接返回 ∅。`,{moved:[],done:!0}),r;for(l(`init`,`把 ${p} 条链表的**头节点**放进小顶堆：${o.map(e=>`${rn(e.list)} 的 ${c(e)}`).join(`、`)}。注意**只放头部**，每条链表后面那些节点还在原地等 —— 堆里现在只有 ${o.length} 个元素，不是 ${m} 个。这是 O(N log K) 里那个 K 的来源。`,{moved:f});o.length;){let e=o[0],n=[],r=o.pop();o.length&&(o[0]=r,n.push(...d(0))),a.push({list:e.list,i:e.i});let s=e.list;i[s]=i[s]+1<t[s].length?i[s]+1:null;let f=null;i[s]!==null&&(f={list:s,i:i[s]},o.push(f),n.push(...u(o.length-1)));let p=f?`${rn(s)} 前移一格，新头 ${c(f)} 入堆，堆里还是 ${o.length} 个元素。`:`${rn(s)} 已经走完了，不再补位 —— 堆里只剩 ${o.length} 个元素。`;l(`take`,`堆顶是 ${c(e)}（来自 ${rn(s)}）。出堆 → 接到结果尾部 → ${p}`,{popped:{...e},pushed:f?{...f}:null,moved:n})}let h=a.map(e=>c(e)).join(` → `);return l(`done`,`堆空了，说明每个节点都被取走且只被取走了一次 —— 一共 ${a.length} 轮，每轮最多两次堆操作（出堆 + 入堆），每次 O(log K)，所以是 O(N log K)。结果链表是 ${h}；开头那个哑结点只是锚点，返回 \`dummy.next\`。`,{done:!0}),r}var on=`mkl-styles`,sn=52,cn=40,ln=74,un=58,dn=15,fn=26,pn=40,mn=22,hn=16,gn=66,_n=34,vn=36,yn=40,bn=28,xn=168,Sn=12,Cn=46,wn=22,Tn=56,En=180,Dn=1250,On=0,kn=[`l0`,`l1`,`l2`,`l3`,`l4`,`l5`],An=e=>`mkl-${kn[e%kn.length]}`,jn=`
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
`;function Mn(){if(X(),document.getElementById(on))return;let e=document.createElement(`style`);e.id=on,e.textContent=jn,document.head.appendChild(e)}function Nn(e){let t=Math.floor(Math.log2(e+1));return{x:(e-(2**t-1)+.5)/2**t*xn,y:t*Cn}}function Pn(e,t={}){if(!e||e.dataset.mklMounted===`1`)return{destroy(){}};e.dataset.mklMounted=`1`,Mn(),On+=1;let n=Array.isArray(t.lists)&&t.lists.length?t.lists:[[1,4],[2,5],[3,6],[0,7]],r=t.autoplay!==!1,i=an(n),a=n.length,o=Math.max(1,a),s=n.reduce((e,t)=>Math.max(e,t.length),0),c=1+n.reduce((e,t)=>e+t.length,0),l=e=>un+e*ln,u=e=>l(e)+sn/2,d=e=>e<=0?un:un+(e-1)*ln+sn,f=e=>d(e)+fn,p=o*gn-(gn-cn),m=wn+(Math.floor(Math.log2(o))*Cn+bn),h=Math.max(p,m),g=_n+h+vn,_=g+cn+hn+20,v=f(s)+dn,y=v+Tn+En,b=f(c)+dn+12,x=Math.max(y+36,b),S=Math.round((x-y)/2),C=S+v+Tn,w=e=>C+Sn+Nn(e).x,T=e=>_n+Math.max(0,Math.round((h-m)/2))+wn+Nn(e).y,E=document.createElement(`div`);E.className=`viz mkl`;let D=document.createElement(`div`);D.className=`viz__stage`,E.appendChild(D);let O=Y(`svg`,{class:`viz__svg mkl__svg`,viewBox:`0 0 ${x} ${_}`,role:`img`,"aria-label":`合并 ${a} 个升序链表的小顶堆推演动画`});D.appendChild(O);function k(e,t,n,r,i){let a=Y(`g`,{class:i});return a.appendChild(Y(`line`,{class:`mkl-edge__line`,x1:t,y1:r,x2:n-9,y2:r})),a.appendChild(Y(`path`,{class:`mkl-edge__head`,d:`M ${n} ${r} L ${n-9} ${r-5.5} L ${n-9} ${r+5.5} Z`})),e.appendChild(a),a}function A(e,t,n){e.appendChild(Y(`circle`,{class:`mkl-null__ring`,cx:t,cy:n,r:dn}));let r=Y(`text`,{class:`mkl-null__text`,x:t,y:n});r.textContent=`∅`,e.appendChild(r)}function j(e,t,n,r,i){let a=Y(`g`,{class:`mkl-node ${i}`});a.appendChild(Y(`rect`,{class:`mkl-node__box`,x:n,y:r,width:sn,height:cn,rx:8}));let o=Y(`text`,{class:`mkl-node__value`,x:n+sn/2,y:r+cn/2});return o.textContent=String(t),a.appendChild(o),e.appendChild(a),a}let M=n.map((e,t)=>{let n=_n+t*gn,r=n+cn/2,i=Y(`g`,{class:`mkl-src ${An(t)}`}),a=Y(`text`,{class:`mkl-row-label`,x:S+un/2-6,y:r});a.textContent=String.fromCharCode(65+t),i.appendChild(a);let o=e.map((e,t)=>j(i,e,S+un+t*ln,n,``));for(let t=0;t<e.length-1;t+=1)k(i,S+un+t*ln+sn,S+un+(t+1)*ln,r,``);return e.length>0&&k(i,S+d(e.length),S+f(e.length)-dn,r,``),A(i,S+f(e.length),r),O.appendChild(i),{g:i,labelEl:a,nodes:o,values:e}}),N=Y(`g`,{class:`mkl-heap`});O.appendChild(N);let P=Y(`text`,{class:`mkl-heap__caption`,x:C+Sn+xn/2,y:_n+Math.max(0,Math.round((h-m)/2))+wn/2});N.appendChild(P);let F=[];for(let e=1;e<o;e+=1){let t=e-1>>1,n=Y(`g`,{class:`mkl-hedge`});n.appendChild(Y(`line`,{class:`mkl-hedge__line`,x1:w(t),y1:T(t)+bn,x2:w(e),y2:T(e)})),N.appendChild(n),F.push({g:n,child:e})}let I=[];for(let e=0;e<o;e+=1){let t=Y(`g`,{class:`mkl-hslot is-off`});t.appendChild(Y(`rect`,{class:`mkl-hnode__box`,x:w(e)-yn/2,y:T(e),width:yn,height:bn,rx:7}));let n=Y(`text`,{class:`mkl-hnode__value`,x:w(e),y:T(e)+bn/2});t.appendChild(n),N.appendChild(t),I.push({g:t,textEl:n})}let L=Y(`text`,{class:`mkl-heap__root-tag`,x:w(0)+yn/2+24,y:T(0)+bn/2});L.textContent=`堆顶`,N.appendChild(L);let R=Y(`g`,{class:`mkl-result`});O.appendChild(R);let z=g+cn/2,B=Y(`text`,{class:`mkl-row-label`,x:26,y:z});B.textContent=`结果`,R.appendChild(B);let V=Y(`g`,{class:`mkl-dummy`});V.appendChild(Y(`rect`,{class:`mkl-dummy__box`,x:l(0),y:g,width:sn,height:cn,rx:8}));let H=Y(`text`,{class:`mkl-dummy__text`,x:u(0),y:z});H.textContent=`dummy`,V.appendChild(H),R.appendChild(V);let U=[];for(let e=1;e<c;e+=1)U.push(k(R,l(e-1)+sn,l(e),z,`mkl-redge`));A(R,f(c),z);let ee=k(R,d(c),f(c)-dn,z,`mkl-redge`),W=i[i.length-1].taken.map((e,t)=>j(R,n[e.list][e.i],l(t+1),g,`mkl-rslot ${An(e.list)}`)),G=Y(`g`,{class:`mkl-chip mkl-chip--tail`});G.appendChild(Y(`rect`,{class:`mkl-chip__box`,x:-40/2,y:-22/2,width:pn,height:mn}));let K=Y(`text`,{class:`mkl-chip__text`,x:0,y:0});K.textContent=`tail`,G.appendChild(K),R.appendChild(G);let te=document.createElement(`p`);te.className=`viz__desc`,te.setAttribute(`aria-live`,`polite`),E.appendChild(te);let ne=Q();E.appendChild(ne.root),e.textContent=``,e.appendChild(E);let q=null;function re(e,t){let r=t.heap.length,i=new Set(t.moved);M.forEach((e,n)=>{let r=t.cursors[n];e.g.classList.toggle(`is-dead`,r===null),e.labelEl.classList.toggle(`is-live`,r!==null),e.labelEl.classList.toggle(`is-dead`,r===null),e.nodes.forEach((e,t)=>{e.classList.toggle(`is-taken`,r===null||t<r),e.classList.toggle(`is-head`,r===t)})}),I.forEach((e,a)=>{if(a>=r){e.g.setAttribute(`class`,`mkl-hslot is-off`);return}let o=t.heap[a];e.textEl.textContent=String(n[o.list][o.i]),e.g.setAttribute(`class`,`mkl-hslot ${An(o.list)}${i.has(a)?` is-moved`:``}`+(a===0?` is-root`:``))}),F.forEach(e=>{e.g.style.display=e.child<r?``:`none`}),P.textContent=r===0?`堆：空了 —— 全部节点已取出`:`堆：只有 ${r} 个候选（每条链表当前的头部）`,L.classList.toggle(`is-off`,r===0);let a=t.phase===`take`?t.taken.length:1/0;W.forEach((e,n)=>{let r=n+1,i=r<=t.taken.length;e.classList.toggle(`is-filled`,i),e.classList.toggle(`is-new`,i&&r>=a)}),U.forEach((e,n)=>e.classList.toggle(`is-on`,n+1<=t.taken.length)),ee.classList.toggle(`is-on`,t.done);let o=Math.min(t.taken.length,c-1);G.style.transform=`translate(${u(o)}px, ${g+cn+hn}px)`,Z(te,t.desc)}let ie=$({steps:i,controls:ne,intervalMs:Dn,onRender:re});ie.jumpTo(Math.trunc(t.initialStep)||0);let ae=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!ae&&typeof IntersectionObserver==`function`&&(q=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){q.disconnect(),q=null,ie.play();return}},{threshold:.35}),q.observe(E)),{destroy(){q&&=(q.disconnect(),null),ie.destroy(),e.textContent=``,delete e.dataset.mklMounted,--On,On<=0&&(document.getElementById(on)?.remove(),mt())}}}function Fn(e,t){let n=[],r=0,i=0;for(;r<e.length&&i<t.length;)e[r]<=t[i]?(n.push(e[r]),r+=1):(n.push(t[i]),i+=1);for(;r<e.length;)n.push(e[r++]);for(;i<t.length;)n.push(t[i++]);return n}var In=e=>e.length?e.join(`、`):`∅`;function Ln(e){let t=(Array.isArray(e)?e:[]).map(e=>Array.isArray(e)?e.slice():[]),n=t.length,r=[],i=t.reduce((e,t)=>e+t.length,0),a=e=>e.map(e=>({lists:e.lists.map(e=>e.slice()),from:e.from?e.from.map(e=>[e[0],e[1]]):null}));if(n===0)return r.push({phase:`init`,desc:"`lists` 是个空数组，一条链表都没有，直接返回 ∅。",levels:[],activeLevel:-1,rounds:0,done:!0}),r;let o=[{lists:t.map(e=>e.slice()),from:null}];if(n===1)return r.push({phase:`init`,desc:`只有 1 条链表，**一次合并都不用做** —— 分治的轮数是 ⌈log₂1⌉ = 0，直接返回它自己（${In(t[0])}）。`,levels:a(o),activeLevel:0,rounds:0,done:!0}),r;r.push({phase:`init`,desc:`分治的起手：${n} 条链表一字排开，一共 ${i} 个节点。接下来每一轮**两两配对合并**，链表条数每次减半 —— ${n} → ${Math.ceil(n/2)} → … → 1，一共 ⌈log₂${n}⌉ = ${Math.ceil(Math.log2(n))} 轮。`,levels:a(o),activeLevel:0,rounds:0,done:!1});let s=t,c=0;for(;s.length>1;){let e=[],t=[];for(let n=0;n<s.length;n+=2)n+1<s.length?(e.push(Fn(s[n],s[n+1])),t.push([n,n+1])):(e.push(s[n].slice()),t.push([n,-1]));c+=1,o.push({lists:e,from:t});let n=s.length,i=e.length,l=t.reduce((e,[t,n])=>e+(n>=0?s[t].length+s[n].length:0),0),u=t.filter(e=>e[1]>=0).length,d=t.find(e=>e[1]<0);r.push({phase:`merge`,desc:`第 ${c} 轮：把 ${n} 条两两配对，做 ${u} 次「合并两个有序链表」，得到 ${i} 条。本轮被摸到的节点一共 ${l} 个，不超过 N —— 每轮都是 O(N) 的工作量。`+(d?`注意第 ${d[0]+1} 条这轮**轮空**了，原样进下一轮（不是丢掉）。`:`链表条数 ${n} → ${i}。`),levels:a(o),activeLevel:o.length-1,rounds:c,done:!1}),s=e}return r.push({phase:`done`,desc:`一共 ${c} 轮，每轮 O(N)，所以总时间是 **O(N log K)** —— 和最小堆同阶。结果链表是 ${In(s[0])}。分治的隐藏优势：它不需要堆，每一轮都是纯粹的指针比较，常数更小。`,levels:a(o),activeLevel:o.length-1,rounds:c,done:!0}),r}var Rn=`mkc-styles`,zn=44,Bn=36,Vn=18,Hn=38,Un=68,Wn=76,Gn=34,Kn=54,qn=30,Jn=1400,Yn=0,Xn=`
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
`;function Zn(){if(X(),document.getElementById(Rn))return;let e=document.createElement(`style`);e.id=Rn,e.textContent=Xn,document.head.appendChild(e)}var Qn=e=>`mkc-lv${Math.min(e,4)}`;function $n(e,t={}){if(!e||e.dataset.mkcMounted===`1`)return{destroy(){}};e.dataset.mkcMounted=`1`,Zn(),Yn+=1;let n=Array.isArray(t.lists)&&t.lists.length?t.lists:[[7],[2],[5],[1],[8],[3],[6],[4]],r=t.autoplay!==!1,i=Ln(n),a=i[i.length-1].levels,o=a.map(e=>{let t=[],n=Un;for(let r of e.lists){let e=r.length?r.length*zn+(r.length-1)*Vn:qn;t.push({x:n,w:e,values:r}),n+=e+Hn}return{items:t,width:t.length?n-Hn:Un,top:Gn}});o.forEach((e,t)=>{e.top=Gn+t*Wn});let s=o.reduce((e,t)=>Math.max(e,t.width),Un)+Kn,c=Gn+(o.length-1)*Wn+Bn+26,l=(e,t)=>{let n=o[e].items[t];return n?n.x+n.w/2:Un},u=document.createElement(`div`);u.className=`viz mkc`;let d=document.createElement(`div`);d.className=`viz__stage`,u.appendChild(d);let f=Y(`svg`,{class:`viz__svg mkc__svg`,viewBox:`0 0 ${s} ${c}`,role:`img`,"aria-label":`合并 ${n.length} 个升序链表的分治推演动画`});d.appendChild(f);let p=[];for(let e=1;e<o.length;e+=1)(a[e].from||[]).forEach((t,n)=>{let[r,i]=t,a=o[e-1].top+Bn,s=o[e].top,c=l(e,n),u=Y(`g`,{class:`mkc-link ${Qn(e)}`});if(i<0)u.appendChild(Y(`line`,{class:`mkc-link__line`,x1:l(e-1,r),y1:a,x2:c,y2:s}));else for(let t of[r,i]){let n=l(e-1,t);u.appendChild(Y(`path`,{class:`mkc-link__line`,d:`M ${n} ${a} C ${n} ${a+22}, ${c} ${s-22}, ${c} ${s}`}))}f.appendChild(u),p.push({g:u,level:e})});let m=[];o.forEach((e,t)=>{let n=Y(`g`,{class:`mkc-row ${Qn(t)}`}),r=e.top+Bn/2,i=Y(`text`,{class:`mkc-row-label`,x:Un-16,y:r});i.textContent=t===0?`输入`:`第 ${t} 轮`,n.appendChild(i);let a=Y(`text`,{class:`mkc-row-count`,x:e.width+14,y:r});a.textContent=`${e.items.length} 条`,n.appendChild(a);let o=[];e.items.forEach(t=>{if(!t.values.length){n.appendChild(Y(`circle`,{class:`mkc-null__ring`,cx:t.x+qn/2,cy:r,r:11}));let e=Y(`text`,{class:`mkc-null__text`,x:t.x+qn/2,y:r});e.textContent=`∅`,n.appendChild(e);return}t.values.forEach((i,a)=>{let s=t.x+a*62,c=Y(`g`,{class:`mkc-node`});c.appendChild(Y(`rect`,{class:`mkc-node__box`,x:s,y:e.top,width:zn,height:Bn,rx:7}));let l=Y(`text`,{class:`mkc-node__value`,x:s+zn/2,y:r});l.textContent=String(i),c.appendChild(l),n.appendChild(c),o.push(c)})}),f.appendChild(n),m.push({g:n,nodes:o,countEl:a,level:t})});let h=document.createElement(`p`);h.className=`viz__desc`,h.setAttribute(`aria-live`,`polite`),u.appendChild(h);let g=Q();u.appendChild(g.root),e.textContent=``,e.appendChild(u);let _=null;function v(e,t){let n=t.levels.length;m.forEach(e=>{e.g.classList.toggle(`is-hidden`,e.level>=n),e.g.classList.toggle(`is-active`,e.level===t.activeLevel),e.nodes.forEach(n=>{n.classList.toggle(`is-new`,e.level===t.activeLevel&&t.phase!==`init`)}),e.level<n&&(e.countEl.textContent=`${t.levels[e.level].lists.length} 条`)}),p.forEach(e=>{e.g.classList.toggle(`is-hidden`,e.level>=n),e.g.classList.toggle(`is-on`,e.level===t.activeLevel)}),Z(h,t.desc)}let y=$({steps:i,controls:g,intervalMs:Jn,onRender:v});y.jumpTo(Math.trunc(t.initialStep)||0);let b=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!b&&typeof IntersectionObserver==`function`&&(_=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){_.disconnect(),_=null,y.play();return}},{threshold:.35}),_.observe(u)),{destroy(){_&&=(_.disconnect(),null),y.destroy(),e.textContent=``,delete e.dataset.mkcMounted,--Yn,Yn<=0&&(document.getElementById(Rn)?.remove(),mt())}}}var er=[1,2,3,4,5,6,7,8,9,10,11,12,13],tr=4;function nr(e,t,n){return!Number.isInteger(e)||!Number.isInteger(t)||!Number.isInteger(n)||n<=0||e<t?null:(e-t)%n}function rr(e,t){let n=Math.abs(e),r=Math.abs(t);for(;r;)[n,r]=[r,n%r];return n}function ir(e={}){let t=Array.isArray(e.values)?e.values.slice():er.slice(),n=t.length,r=Number.isInteger(e.fastStep)&&e.fastStep>=1?e.fastStep:2,i=r-1,a=e.cycleStart===void 0?tr:e.cycleStart,o=Number.isInteger(a)&&a>=0&&a<n,s=o?a:null,c=o?n-s:0,l=o?{start:s,length:c}:null,u=[],d=(e,t,n={})=>u.push({phase:e,desc:t,slow:null,fast:null,gap:null,cycle:l?{...l}:null,fastStep:r,closing:i,steps:0,met:!1,done:!1,...n});if(n===0)return d(`end`,"链表是空的，连头节点都没有 —— 不存在环，返回 `false`。",{done:!0}),u;let f=e=>!Number.isInteger(e)||e>=n?null:e+1<n?e+1:o?s:null,p=e=>Number.isInteger(e)&&e>=0&&e<n?String(t[e]):`∅`,m=(e,t)=>{if(!o)return null;let n=nr(e,s,c),r=nr(t,s,c);return n===null||r===null?null:(n-r+c)%c},h=0,g=0,_=i<=0?`**两个指针速度一样，相对速度是 0** —— 它们会永远保持这个距离，不可能相遇。`:`快指针每步比慢指针多走 ${i} 格 —— 这个相对速度恒定不变，是后面一切的起点。`;if(d(`init`,`慢指针和快指针都站在头节点 ${p(0)}。快指针每步走 **${r} 格**、慢指针走 1 格，`+_,{slow:h,fast:g,steps:0}),i<=0)return d(`end`,`相对速度是 0，两指针永远同步前进，距离不会变 —— 不相遇。所以快指针**至少要走 2 步**，这是「一定相遇」的第一道门槛。`,{slow:h,fast:g,done:!0}),u;let v=2*n+8,y=`cap`;for(let e=1;e<=v;e+=1){let t=g;for(let e=0;e<r&&t!==null;e+=1)t=f(t);if(g=t,h=f(h),h===null&&g===null){y=`fell-off`;break}let n=m(h,g);if(h!==null&&h===g){let t=i===1?`相对速度是 1，所以「快指针沿环前进方向到慢指针的距离」每步**恰好减 1**；它是在模 ${c} 的意义下减 1 的，必然依次经过 ${c-1}、…、1、0 —— 所以**一定相遇**，慢指针进环后最多 ${c-1} 步。`:`相对速度是 ${i}，距离每步减 ${i}；它能减到 0，是因为慢指针进环那一刻的距离恰好是 gcd(${i}, ${c}) = ${rr(i,c)} 的倍数。`;return d(`met`,`两者在节点 ${p(h)} **相遇**。走了 ${e} 步，快指针比慢指针多走了 ${e*i} 格，正好是环长 ${c} 的整数倍 —— 这是相遇的代数原因。${t}`,{slow:h,fast:g,gap:n,steps:e,met:!0,done:!0}),u}if(g===null){y=`fell-off`;break}let a;a=n===null?o&&g>=s?`慢指针还在直段（第 ${h+1} 个节点），快指针已经进环了 —— 慢指针没进环之前，两者不可能相遇。`:`两者都还在直段，快指针只是领先慢指针 ${g-h} 格，距离还没有被环长约束住。`:`两者都在环上。快指针沿环前进方向到慢指针还差 **${n} 格**，比上一步少了 ${i} —— 只要相对速度是 1，这个数每步必然减 1。`,d(`move`,`慢指针到 ${p(h)}、快指针到 ${p(g)}。${a}`,{slow:h,fast:g,gap:n,steps:e})}return y===`fell-off`?(d(`end`,`快指针走到了链表末尾（\`fast\` 或 \`fast.next\` 是空）—— **这条链表没有环**，返回 \`false\`。一共走了 ${u.length} 步：没有环时快指针每步走 ${r} 格，最多 n / ${r} 步就出界，所以判环是 O(n) 时间、O(1) 空间。`,{slow:h,fast:g,done:!0}),u):(d(`end`,`走了 ${u.length} 步仍未相遇，已超过步数上限 ${v} —— 这是不该出现的情况，请检查输入（两指针同起点时，任何 fastStep ≥ 2 都必然相遇）。`,{slow:h,fast:g,gap:m(h,g),done:!0}),u)}var ar=`cyc-layout-styles`,or=20,sr=`
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
`;function cr(){if(document.getElementById(ar))return;let e=document.createElement(`style`);e.id=ar,e.textContent=sr,document.head.appendChild(e)}function lr(e){if(!Number.isInteger(e)||e<=1)return 80;let t=68/(2*Math.sin(Math.PI/e));return Math.max(80,Math.round(t))}function ur(e,t){return 180+360*e/t}function dr(e,t,n,r,i){let a=ur(e,t)*Math.PI/180;return{x:n+i*Math.cos(a),y:r+i*Math.sin(a)}}function fr(e,t,n=46,r=30){let i=Math.abs(e)<1e-6?1/0:n/2/Math.abs(e),a=Math.abs(t)<1e-6?1/0:r/2/Math.abs(t);return Math.min(i,a)}function pr(e,t,{head:n=8,dim:r=!1}={}){let i=t.x-e.x,a=t.y-e.y,o=Math.hypot(i,a)||1,s=i/o,c=a/o,l=fr(s,c),u=e.x+s*l,d=e.y+c*l,f=t.x-s*l,p=t.y-c*l,m=Y(`g`,{class:r?`cyc-edge is-dim`:`cyc-edge`});m.appendChild(Y(`line`,{class:`cyc-edge__line`,x1:u,y1:d,x2:f-s*n,y2:p-c*n}));let h=-c,g=s,_=5.5;return m.appendChild(Y(`path`,{class:`cyc-edge__head`,d:`M ${f} ${p} L ${f-s*n+h*_} ${p-c*n+g*_} L ${f-s*n-h*_} ${p-c*n-g*_} Z`})),m}function mr(e,t,n,r,i=``){let a=Y(`g`,{class:`cyc-node ${i}`.trim()});a.appendChild(Y(`rect`,{class:`cyc-node__box`,x:n-46/2,y:r-30/2,width:46,height:30,rx:8}));let o=Y(`text`,{class:`cyc-node__value`,x:n,y:r});return o.textContent=String(t),a.appendChild(o),e.appendChild(a),a}function hr(e,t,n){let r=Y(`g`,{class:`cyc-null`});r.appendChild(Y(`circle`,{class:`cyc-null__ring`,cx:t,cy:n,r:15}));let i=Y(`text`,{class:`cyc-null__text`,x:t,y:n});return i.textContent=`∅`,r.appendChild(i),e.appendChild(r),r}function gr(e,t,n,r){let i=n>t?1:-1,a=Y(`g`,{class:`cyc-edge`});return a.appendChild(Y(`line`,{class:`cyc-edge__line`,x1:t,y1:r,x2:n-i*8,y2:r})),a.appendChild(Y(`path`,{class:`cyc-edge__head`,d:`M ${n} ${r} L ${n-i*8} ${r-5.5} L ${n-i*8} ${r+5.5} Z`})),e.appendChild(a),a}function _r(e,t,n=0,r=15){if(!e)return null;let i;if(e.inRing&&e.index!==t.a){let n=e.cx-t.ringCenter.x,r=e.cy-t.ringCenter.y,a=Math.hypot(n,r)||1;i={x:n/a,y:r/a}}else i={x:0,y:1};let a={x:e.cx+i.x*30,y:e.cy+i.y*30};if(!n)return a;let o={x:-i.y,y:i.x};return{x:a.x+o.x*n*r,y:a.y+o.y*n*r}}function vr(e,{values:t,cycleStart:n}){let r=Array.isArray(t)?t:[],i=r.length,a=Number.isInteger(n)&&n>=0&&n<i,o=a?n:i,s=a?i-o:0,c=lr(s),l=c+30/2+52,u=24+(o>0?(o-1)*70+46+58:0),d=u+46/2+c,f=a?d+c+46/2+46:u+46/2+60,p=a?l+c+30/2+30+20/2+or:l+30/2+30+20/2+or,m=e=>e<o?{x:24+e*70+46/2,y:l}:dr(e-o,s,d,l,c),h=[];for(let e=0;e<i-1;e+=1)h.push(pr(m(e),m(e+1)));if(a)if(s===1){let e=m(o),t=Y(`g`,{class:`cyc-edge`});t.appendChild(Y(`path`,{class:`cyc-edge__line`,d:`M ${e.x} ${e.y-30/2} C ${e.x-30} ${e.y-30/2-34}, ${e.x+30} ${e.y-30/2-34}, ${e.x} ${e.y-30/2}`,fill:`none`})),t.appendChild(Y(`path`,{class:`cyc-edge__head`,d:`M ${e.x} ${e.y-30/2} L ${e.x-7} ${e.y-30/2-13} L ${e.x+7} ${e.y-30/2-13} Z`})),h.push(t)}else h.push(pr(m(i-1),m(o)));for(let t of h)e.appendChild(t);let g=r.map((t,n)=>{let r=m(n);return{g:mr(e,t,r.x,r.y),cx:r.x,cy:r.y,index:n,inRing:a&&n>=o,ringK:a&&n>=o?n-o:-1}});if(a&&i>0){let t=m(o),n=Y(`g`,{class:`cyc-entry`});n.appendChild(Y(`rect`,{class:`cyc-entry__box`,x:t.x-46/2-5,y:t.y-30/2-5,width:56,height:40,rx:11}));let r=Y(`text`,{class:`cyc-entry__tag`,x:t.x,y:t.y-30/2-16});r.textContent=`入口`,n.appendChild(r),e.appendChild(n)}let _=null;if(!a&&i>0){let t=m(i-1),n=t.x+46/2+30;gr(e,t.x+46/2,n-15,l),hr(e,n,l),_={x:n,y:l}}return{a:o,b:s,hasCycle:a,width:f,height:p,rowY:l,ringCenter:{x:d,y:l},radius:c,nullPos:_,nodes:g,ringKOf:e=>a&&e>=o?e-o:-1,at:e=>g[e]}}var yr=`cyd-styles`,br=42,xr=26,Sr=1150,Cr=`
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
`;function wr(){if(X(),cr(),document.getElementById(yr))return;let e=document.createElement(`style`);e.id=yr,e.textContent=Cr,document.head.appendChild(e)}function Tr(e,t,n){let r=Y(`g`,{class:`cyc-chip cyc-chip--${t}`});r.appendChild(Y(`rect`,{class:`cyc-chip__box`,x:-26/2,y:-20/2,width:xr,height:20}));let i=Y(`text`,{class:`cyc-chip__text`,x:0,y:0});return i.textContent=n,r.appendChild(i),e.appendChild(r),r}function Er(e,t={}){if(!e||e.dataset.cydMounted===`1`)return{destroy(){}};e.dataset.cydMounted=`1`,wr();let n=ir(t),r=n[0].cycle,i=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4,5,6,7,8,9,10,11,12,13],a=r?r.start:null,o=t.autoplay!==!1,s=document.createElement(`div`);s.className=`viz cyd`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=Y(`svg`,{class:`viz__svg cyd__svg`,viewBox:`0 0 700 400`,role:`img`,"aria-label":`Floyd 判圈（龟兔赛跑）推演动画`});c.appendChild(l);let u=vr(l,{values:i,cycleStart:a});l.setAttribute(`viewBox`,`0 0 ${u.width} ${u.height}`),l.setAttribute(`width`,u.width),l.setAttribute(`height`,u.height);let d=Y(`g`,{class:`cyd-arc is-off`}),f=Y(`path`,{class:`cyd-arc__line`}),p=Y(`path`,{class:`cyd-arc__head`}),m=Y(`rect`,{class:`cyd-arc__tag-bg`,x:-30,y:-9,width:60,height:18,rx:6}),h=Y(`text`,{class:`cyd-arc__tag`,x:0,y:0}),g=Y(`g`,{class:`cyd-arc__tag-group`});g.append(m,h),d.append(f,p,g),l.appendChild(d);let _=Tr(l,`slow`,`慢`),v=Tr(l,`fast`,`快`);function y(e,t){return _r(u.at(e),u,t)}let b=(e,t)=>{if(!t){e.style.opacity=`0`;return}e.style.opacity=`1`,e.setAttribute(`transform`,`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)})`)},x=document.createElement(`p`);x.className=`viz__desc`,x.setAttribute(`aria-live`,`polite`),s.appendChild(x);let S=Q();s.appendChild(S.root),e.textContent=``,e.appendChild(s);let C=null;function w(e,t){let n=u.b,r=t.slow!==null&&t.slow===t.fast;u.nodes.forEach(e=>{let n=e.index===t.slow,r=e.index===t.fast;e.g.classList.toggle(`is-slow`,n&&!r),e.g.classList.toggle(`is-fast`,r&&!n),e.g.classList.toggle(`is-both`,n&&r)}),b(_,t.slow===null?null:y(t.slow,r?-1:0)),b(v,t.fast===null?null:y(t.fast,+!!r));let i=t.fast===null?-1:u.ringKOf(t.fast),a=t.slow===null?-1:u.ringKOf(t.slow),o=n>0&&i>=0&&a>=0&&t.gap!==null&&t.gap>0;if(d.classList.toggle(`is-off`,!o),o){let e=u.radius-br,r=(a-i+n)%n,o=ur(i,n),s=ur(i+r,n),c=s-o,l=t=>{let n=t*Math.PI/180;return{x:u.ringCenter.x+e*Math.cos(n),y:u.ringCenter.y+e*Math.sin(n)}},d=l(o),m=l(s),_=+(c>180);f.setAttribute(`d`,`M ${d.x.toFixed(1)} ${d.y.toFixed(1)} A ${e} ${e} 0 ${_} 1 ${m.x.toFixed(1)} ${m.y.toFixed(1)}`);let v=s*Math.PI/180,y=-Math.sin(v),b=Math.cos(v),x=-b,S=y;p.setAttribute(`d`,`M ${m.x} ${m.y} L ${m.x-y*9+x*5} ${m.y-b*9+S*5} L ${m.x-y*9-x*5} ${m.y-b*9-S*5} Z`);let C=(o+c/2)*Math.PI/180,w={x:u.ringCenter.x+e*Math.cos(C),y:u.ringCenter.y+e*Math.sin(C)};g.setAttribute(`transform`,`translate(${w.x.toFixed(1)} ${w.y.toFixed(1)})`),h.textContent=`${t.gap} 格`}Z(x,t.desc)}let T=$({steps:n,controls:S,intervalMs:Sr,onRender:w});T.jumpTo(Math.trunc(t.initialStep)||0);let E=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return o&&!E&&typeof IntersectionObserver==`function`&&(C=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){C.disconnect(),C=null,T.play();return}},{threshold:.35}),C.observe(s)),{destroy(){C&&=(C.disconnect(),null),T.destroy(),e.textContent=``,delete e.dataset.cydMounted,document.getElementById(yr)?.remove()}}}var Dr=[1,2,3,4,5,6,7,8,9,10,11,12,13],Or=4;function kr(e={}){let t=Array.isArray(e.values)?e.values.slice():Dr.slice(),n=t.length,r=e.cycleStart===void 0?Or:e.cycleStart,i=[],a=(e,t,n={})=>i.push({phase:e,desc:t,ptr1:null,ptr2:null,walked:0,remain1:0,remain2:0,passed2:!1,entry:null,meetAt:null,a:0,b:0,x:0,m:0,done:!1,...n});if(n===0)return a(`none`,"链表是空的，没有环，返回 `null`。",{done:!0}),i;let o=ir({values:t,cycleStart:r}),s=o[o.length-1];if(!s.met)return a(`none`,"这条链表没有环（快指针已经走到末尾），所以 LC 142 直接返回 `null` —— 入口根本不存在。",{done:!0}),i;let c=s.cycle.start,l=s.cycle.length,u=s.slow,d=(u-c)%l,f=c+d,p=f/l,m=l-d,h=e=>Number.isInteger(e)&&e>=0&&e<n?String(t[e]):`∅`,g=e=>!Number.isInteger(e)||e>=n?null:e+1<n?e+1:c,_=c===m?`这里 a 恰好等于 b - x，所以两个指针会**同步**抵达入口。`:`注意 a = ${c} 而 b - x = ${m}，后者更小 —— ptr2 会先路过入口、绕回来之后才和 ptr1 碰上。同余式只管「差整数圈」，不管谁先到。`;if(a(`meet`,`第一阶段的终点：慢指针和快指针在节点 ${h(u)} 相遇。设入口是 ${h(c)}、直段长 \`a = ${c}\`、环长 \`b = ${l}\`、相遇点距入口 \`x = ${d}\`，那么 \`a + x = ${f} = ${p} × b\`，也就是 \`a ≡ b - x (mod b)\`。现在**把 ptr1 放回 head、ptr2 留在相遇点，两者都改成每步走 1 格**：ptr1 要走到入口差 **${c} 步**，ptr2 沿环走到入口差 **${m} 步**。${_}`,{ptr1:0,ptr2:u,walked:0,remain1:c,remain2:m,entry:c,meetAt:u,a:c,b:l,x:d,m:p}),c===0)return a(`found`,`**入口就是头节点 ${h(0)}。** 这里 a = 0，头节点本身就在环上 —— ptr1 一步都不用走，而相遇点也正好是入口（x = 0），所以两个指针一开始就重合。LC 142 返回这个节点。`,{ptr1:0,ptr2:u,walked:0,remain1:0,remain2:0,entry:0,meetAt:u,a:c,b:l,x:d,m:p,done:!0}),i;let v=0,y=u;for(let e=1;e<=c;e+=1){v=g(v),y=g(y);let t=c-e,n=m-e,r=n<0,o=r?(n%l+l)%l:n;if(v===y)return a(`found`,`**两个指针在节点 ${h(v)} 相遇 —— 这就是环的入口。** 从 head 走了 ${e} 步，从相遇点也走了 ${e} 步。回到那条同余式：a = ${c} 步到入口、b - x = ${m} 步也到入口，两者相差 ${p>1?`${p} 圈`:`零圈`}，所以它们必然在入口碰头。LC 142 返回这个节点。`,{ptr1:v,ptr2:y,walked:e,remain1:t,remain2:o,passed2:r,entry:c,meetAt:u,a:c,b:l,x:d,m:p,done:!0}),i;a(`walk`,`走了 ${e} 步。ptr1 到 ${h(v)}（离入口还差 **${t} 步**）、ptr2 到 ${h(y)}（离入口还差 **${o} 步**）。`+(r?`注意 ptr2 已经**越过**了入口，它要再绕一圈回来 —— 但同余式保证它绕回入口的那一刻，ptr1 也正好走到。`:`两个剩余步数**同步递减**，这是「两条路一样长」的直接体现。`),{ptr1:v,ptr2:y,walked:e,remain1:t,remain2:o,passed2:r,entry:c,meetAt:u,a:c,b:l,x:d,m:p})}return a(`found`,`走了 ${c} 步仍未同时落在入口，这不该发生 —— 请检查输入。`,{ptr1:v,ptr2:y,walked:c,entry:c,meetAt:u,a:c,b:l,x:d,m:p,done:!0}),i}var Ar=`cye-styles`,jr=42,Mr=56,Nr=32,Pr=17,Fr=1250,Ir=`
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
`;function Lr(){if(X(),cr(),document.getElementById(Ar))return;let e=document.createElement(`style`);e.id=Ar,e.textContent=Ir,document.head.appendChild(e)}function Rr(e,t,n){let r=Y(`g`,{class:`cyc-chip cyc-chip--${t}`});r.appendChild(Y(`rect`,{class:`cyc-chip__box`,x:-32/2,y:-20/2,width:Nr,height:20}));let i=Y(`text`,{class:`cyc-chip__text`,x:0,y:0});return i.textContent=n,r.appendChild(i),e.appendChild(r),r}function zr(e,t){let n=Y(`g`,{class:`cye-tag-group cye-tag-group--${t}`}),r=Y(`rect`,{class:`cye-tag-bg`,x:-38,y:-10,width:76,height:20,rx:6}),i=Y(`text`,{class:`cye-tag cye-tag--${t}`,x:0,y:0});return n.append(r,i),e.appendChild(n),{g:n,t:i,bg:r}}function Br(e,t={}){if(!e||e.dataset.cyeMounted===`1`)return{destroy(){}};e.dataset.cyeMounted=`1`,Lr();let n=kr(t),r=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4,5,6,7,8,9,10,11,12,13],i=n[0],a=Number.isInteger(i.a)&&i.b>0?i.a:null,o=t.autoplay!==!1,s=document.createElement(`div`);s.className=`viz cye`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=Y(`svg`,{class:`viz__svg cye__svg`,viewBox:`0 0 700 400`,role:`img`,"aria-label":`环形链表找入口推演动画`});c.appendChild(l);let u=vr(l,{values:r,cycleStart:a});l.setAttribute(`viewBox`,`0 0 ${u.width} ${u.height}`),l.setAttribute(`width`,u.width),l.setAttribute(`height`,u.height);let d=u.at(u.a),f=null;if(Number.isInteger(i.meetAt)&&u.at(i.meetAt)){let e=u.at(i.meetAt),t=Y(`g`,{class:`cye-meet`});t.appendChild(Y(`rect`,{class:`cye-meet__box`,x:e.cx-46/2-6,y:e.cy-30/2-6,width:58,height:42,rx:12})),l.appendChild(t),f=t}let p=Y(`g`,{class:`cye-bar`}),m=Y(`path`,{class:`cye-bar__line`}),h=Y(`path`,{class:`cye-bar__tick`}),g=Y(`path`,{class:`cye-bar__tick`});p.append(m,h,g),l.appendChild(p);let _=zr(l,`p1`),v=Y(`g`,{class:`cye-arc`}),y=Y(`path`,{class:`cye-arc__line`}),b=Y(`path`,{class:`cye-arc__head`});v.append(y,b),l.appendChild(v);let x=zr(l,`p2`),S=Rr(l,`p1`,`P1`),C=Rr(l,`p2`,`P2`);function w(e,t){return _r(u.at(e),u,t,Pr)}let T=(e,t)=>{if(!t){e.style.opacity=`0`;return}e.style.opacity=`1`,e.setAttribute(`transform`,`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)})`)},E=document.createElement(`p`);E.className=`viz__desc`,E.setAttribute(`aria-live`,`polite`),s.appendChild(E);let D=Q();s.appendChild(D.root),e.textContent=``,e.appendChild(s);let O=null;function k(e,t){let n=u.b,r=t.ptr1!==null&&t.ptr1===t.ptr2;u.nodes.forEach(e=>{let n=e.index===t.ptr1,r=e.index===t.ptr2;e.g.classList.toggle(`is-slow`,n&&!r),e.g.classList.toggle(`is-fast`,r&&!n),e.g.classList.toggle(`is-both`,n&&r)}),T(S,t.ptr1===null?null:w(t.ptr1,r?-1:0)),T(C,t.ptr2===null?null:w(t.ptr2,+!!r)),f&&(f.style.opacity=t.phase===`found`?`0.45`:`1`);let i=t.ptr1===null?null:u.at(t.ptr1),a=!!i&&t.remain1>0&&!!d;if(p.classList.toggle(`is-off`,!a),_.g.style.opacity=a?`1`:`0`,a){let e=u.rowY+Mr,n=i.cx,r=d.cx;m.setAttribute(`d`,`M ${n} ${e} L ${r} ${e}`),h.setAttribute(`d`,`M ${n} ${e-6} L ${n} ${e+6}`),g.setAttribute(`d`,`M ${r} ${e-6} L ${r} ${e+6}`),_.g.setAttribute(`transform`,`translate(${((n+r)/2).toFixed(1)} ${e})`),_.t.textContent=`还差 ${t.remain1} 步`}let o=t.ptr2===null?-1:u.ringKOf(t.ptr2),s=n>0&&o>=0&&t.remain2>0&&!t.passed2;if(v.classList.toggle(`is-off`,!s),x.g.style.opacity=s?`1`:`0`,s){let e=u.radius-jr,r=ur(o,n),i=ur(o+t.remain2,n),a=i-r,s=t=>{let n=t*Math.PI/180;return{x:u.ringCenter.x+e*Math.cos(n),y:u.ringCenter.y+e*Math.sin(n)}},c=s(r),l=s(i);y.setAttribute(`d`,`M ${c.x.toFixed(1)} ${c.y.toFixed(1)} A ${e} ${e} 0 ${+(a>180)} 1 ${l.x.toFixed(1)} ${l.y.toFixed(1)}`);let d=i*Math.PI/180,f=-Math.sin(d),p=Math.cos(d);b.setAttribute(`d`,`M ${l.x} ${l.y} L ${l.x-f*9-p*5} ${l.y-p*9+f*5} L ${l.x-f*9+p*5} ${l.y-p*9-f*5} Z`);let m=(r+a/2)*Math.PI/180;x.g.setAttribute(`transform`,`translate(${(u.ringCenter.x+e*Math.cos(m)).toFixed(1)} ${(u.ringCenter.y+e*Math.sin(m)).toFixed(1)})`),x.t.textContent=`还差 ${t.remain2} 步`}Z(E,t.desc)}let A=$({steps:n,controls:D,intervalMs:Fr,onRender:k});A.jumpTo(Math.trunc(t.initialStep)||0);let j=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return o&&!j&&typeof IntersectionObserver==`function`&&(O=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){O.disconnect(),O=null,A.play();return}},{threshold:.35}),O.observe(s)),{destroy(){O&&=(O.disconnect(),null),A.destroy(),e.textContent=``,delete e.dataset.cyeMounted,document.getElementById(Ar)?.remove()}}}function Vr(e,t){let n=e.length,r=Array.from({length:n+1},(e,t)=>t+1<=n?t+1:null),i=[],a=t=>t===null?`∅`:t===0?`dummy`:String(e[t-1]),o=(e,a,o={})=>i.push({phase:e,desc:a,fast:0,slow:0,gap:null,links:[...r],cutSlot:null,leadTotal:t+1,syncTotal:Math.max(0,n-t),done:!1,...o});if(n===0)return o(`init`,"空链表：没有可删的节点，返回 `∅` 即可。"),i[0].done=!0,i;o(`init`,"先接一个哑结点 `dummy`，`fast` 和 `slow` 都从它出发。有它在，「删头节点」就不再需要特判。");let s=0;for(let e=1;e<=t+1;e+=1){s=r[s];let n=s-0;o(`lead`,e===1?`① \`fast\` 先走：第 1 / ${t+1} 步，指向 ${a(s)}。约定是先走 **n+1 = ${t+1}** 步 —— 要定位的是待删节点的**前驱**，所以多退这一步。`:s===null?`① \`fast\` 第 ${e} / ${t+1} 步落到了 ∅ —— \`n\` 正好等于链长，要删的就是**头节点**。同步阶段将一步不走，\`slow\` 会留在 \`dummy\` 上。`:`① \`fast\` 继续走：第 ${e} / ${t+1} 步，指向 ${a(s)}。`+(e===t+1?`间隔锁死为 **n+1 = ${t+1}**， \`slow\` 从现在起一步不会再被落下。`:`\`slow\` 原地不动，间隔拉开到 ${n}。`),{fast:s,gap:s===null?null:n})}let c=0,l=0;for(;s!==null;){s=r[s],c=r[c],l+=1;let e=s===null;o(`sync`,e?`② \`fast\` 撞到了 ∅，停下。\`slow\` 停在 ${a(c)} —— 正是**倒数第 n+1 个**节点，待删节点 ${a(c+1)} 的**前驱**。`:`② 两个指针一起走（第 ${l} / ${n-t} 步）：\`fast\` 在 ${a(s)}，\`slow\` 在 ${a(c)}。间隔保持 ${s-c} 不变 —— 这就是循环不变量。`,{fast:s,slow:c,gap:e?null:s-c})}let u=c+1;return r[c]=r[u],o(`cut`,`③ \`slow.next = slow.next.next\`：${a(c)} 的箭头跨过 ${a(u)}，直接指向 ${a(r[c])}。节点 ${a(u)} 被摘掉 —— 注意它还在内存里，只是没人再引用它。`,{slow:c,cutSlot:u}),o(`done`,`④ 返回 \`dummy.next\`（**不是 head**——如果删的是头节点，head 已经不在链上了）。得到 ${e.filter((e,t)=>t!==u-1).map(String).join(` → `)}。全程只扫了**一趟**。`,{slow:c,cutSlot:u}),i[i.length-1].done=!0,i}var Hr=`rnth-styles`,Ur=64,Wr=50,Gr=42,Kr=48,qr=88,Jr=113,Yr=40,Xr=196,Zr=236,Qr=56,$r=26,ei=272,ti=26,ni=1150,ri=`
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
`;function ii(){if(X(),document.getElementById(Hr))return;let e=document.createElement(`style`);e.id=Hr,e.textContent=ri,document.head.appendChild(e)}function ai(e,t={}){if(!e||e.dataset.rnthMounted===`1`)return{destroy(){}};e.dataset.rnthMounted=`1`,ii();let n=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4,5],r=Math.min(Math.max(Math.trunc(t.n)||2,1),n.length),i=t.autoplay!==!1,a=Vr(n,r),o=n.length,s=o+1,c=2*Kr+s*Ur+(s-1)*Gr,l=e=>Kr+e*106,u=e=>l(e)+Ur/2,d=c-ti,f=document.createElement(`div`);f.className=`viz rnth`;let p=document.createElement(`div`);p.className=`viz__stage`,f.appendChild(p);let m=Y(`svg`,{class:`viz__svg rnth__svg`,viewBox:`0 0 ${c} ${ei}`,role:`img`,"aria-label":`删除倒数第 ${r} 个节点推演动画：${n.join(` → `)}`});p.appendChild(m),m.appendChild(Y(`circle`,{class:`rnth-null__ring`,cx:d,cy:Jr,r:15}));let h=Y(`text`,{class:`rnth-null__text`,x:d,y:Jr});h.textContent=`∅`,m.appendChild(h);let g=Y(`line`,{class:`rnth-tick`}),_=Y(`line`,{class:`rnth-tick`});m.append(g,_);let v=[];for(let e=0;e<o;e+=1){let t=ft(l(e)+Ur,l(e+1),Jr,1,`rnth-edge`);m.appendChild(t),v.push(t)}let y=ft(l(o)+Ur,d-15,Jr,1,`rnth-edge`);m.appendChild(y);let b=Y(`path`,{class:`rnth-arc__line`}),x=Y(`path`,{class:`rnth-arc__head`}),S=Y(`g`,{class:`rnth-arc`});S.append(b,x),m.appendChild(S);let C=[];for(let e=0;e<s;e+=1){let t=Y(`g`,{class:`rnth-node${e===0?` rnth-node--dummy`:``}`});t.appendChild(Y(`rect`,{class:`rnth-node__box`,x:l(e),y:qr,width:Ur,height:Wr,rx:9}));let r=Y(`text`,{class:`rnth-node__value`,x:u(e),y:Jr});r.textContent=e===0?`dummy`:String(n[e-1]),t.appendChild(r),m.appendChild(t),C.push(t)}let w=Y(`g`,{class:`rnth-gapline`}),T=Y(`line`,{class:`rnth-gapline__line`}),E=Y(`path`,{class:`rnth-gapline__head`}),D=Y(`path`,{class:`rnth-gapline__head`}),O=Y(`rect`,{class:`rnth-gapline__tag-bg`,x:-26,y:-9,width:52,height:18,rx:6}),k=Y(`text`,{class:`rnth-gapline__tag`,x:0,y:0});w.append(T,E,D,O,k),m.appendChild(w);function A(e,t){let n=Y(`g`,{class:`rnth-chip rnth-chip--${e}`});n.appendChild(Y(`rect`,{class:`rnth-chip__box`,x:-56/2,y:-26/2,width:Qr,height:$r}));let r=Y(`text`,{class:`rnth-chip__text`,x:0,y:0});return r.textContent=t,n}let j=A(`fast`,`fast`),M=A(`slow`,`slow`);m.append(j,M);let N=document.createElement(`p`);N.className=`viz__desc`,N.setAttribute(`aria-live`,`polite`),f.appendChild(N);let P=Q();f.appendChild(P.root),e.textContent=``,e.appendChild(f);let F=null,I=e=>e===null?d:u(e);function L(e,t,n,r){let i=I(n);e.style.transform=`translate(${i}px, ${r}px)`,e.style.opacity=`1`,t.setAttribute(`x1`,i),t.setAttribute(`x2`,i),t.setAttribute(`y1`,r-$r/2),t.setAttribute(`y2`,138),t.style.opacity=`0.65`}function R(e){let t=e.cutSlot;if(t===null||e.links[t-1]!==t+1){S.classList.remove(`is-on`);return}let n=l(t-1)+Ur,r=l(t+1),i=Jr,a=Jr,o=n+(r-n)*.3,s=n+(r-n)*.7;b.setAttribute(`d`,`M ${n} ${i} C ${o} ${i-44}, ${s} ${a-44}, ${r-8} ${a}`),x.setAttribute(`d`,`M ${r} ${a} L ${r-9} ${a-5.5} L ${r-9} 118.5 Z`),S.classList.add(`is-on`)}function z(e){let t=e.gap!==null&&e.gap>0&&e.fast!==null;if(w.classList.toggle(`is-on`,t),!t)return;let n=u(e.slow),r=u(e.fast);T.setAttribute(`x1`,n),T.setAttribute(`x2`,r),T.setAttribute(`y1`,Yr),T.setAttribute(`y2`,Yr),E.setAttribute(`d`,`M ${n} ${Yr} L ${n+7} ${Yr-4.5} L ${n+7} 44.5 Z`),D.setAttribute(`d`,`M ${r} ${Yr} L ${r-7} ${Yr-4.5} L ${r-7} 44.5 Z`),O.setAttribute(`x`,(n+r)/2-26),O.setAttribute(`y`,Yr-9),k.setAttribute(`x`,(n+r)/2),k.setAttribute(`y`,Yr),k.textContent=`间隔 ${e.gap}`}function B(e,t){for(let e=0;e<s;e+=1)C[e].classList.toggle(`is-cut`,t.cutSlot!==null&&e===t.cutSlot);for(let e=0;e<o;e+=1)v[e].classList.toggle(`is-on`,t.links[e]===e+1);y.classList.toggle(`is-on`,t.links[o]===null),R(t),z(t),t.fast===null?(j.style.transform=`translate(${d}px, ${Xr}px)`,j.style.opacity=`1`,g.style.opacity=`0`):L(j,g,t.fast,Xr),L(M,_,t.slow,Zr),Z(N,t.desc)}let V=$({steps:a,controls:P,intervalMs:ni,onRender:B});V.jumpTo(Math.trunc(t.initialStep)||0);let H=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return i&&!H&&typeof IntersectionObserver==`function`&&(F=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){F.disconnect(),F=null,V.play();return}},{threshold:.35}),F.observe(f)),{destroy(){F&&=(F.disconnect(),null),V.destroy(),e.textContent=``,delete e.dataset.rnthMounted,document.getElementById(Hr)?.remove()}}}function oi(e){if(e<=0)return null;let t=0,n=1;for(;n<e&&n+1<e;)t+=1,n+=2;return t}function si(e,t){let n=[],r=e,i=new Set;for(;r!=null&&!i.has(r);)i.add(r),n.push(r),r=t[r];return n}function ci(e){let t=e.length,n=[];for(let r=0;r<Math.floor(t/2);r+=1)n.push(e[r],e[t-1-r]);return t%2==1&&n.push(e[Math.floor(t/2)]),n}function li(e){let t=e.length,n=Array.from({length:t},(e,n)=>n+1<t?n+1:null),r=t=>t===null?`∅`:String(e[t]),i=[],a=(e,t,r={})=>i.push({phase:e,stage:0,desc:t,links:[...n],merged:[],front:[],back:[],chips:[],cutEdge:null,done:!1,...r}),o=(e,t)=>si(e,n).filter(e=>!t.includes(e));if(t<=1)return a(`init`,t===0?`空链表，没什么可重排的。`:`只有一个节点，重排之后还是它自己 —— 直接返回。`,{front:si(0,n)}),i[0].done=!0,i;a(`init`,`目标：前半段顺序不变，后半段倒过来插进缝隙 —— 也就是要把 ${e.join(` → `)} 变成 ${ci(e).join(` → `)}。全程只改指针，一个值都不动。`,{front:si(0,n)});let s=oi(t),c=0,l=1,u=0;for(;l<t&&l+1<t;)c+=1,l+=2,u+=1,a(`mid`,`① 快慢指针找中点（第 ${u} 步）：\`fast\` 一次跨两格到 ${r(l<t?l:null)}，\`slow\` 一次挪一格到 ${r(c)}。`+(c===s?` \`fast\` 走不动了 —— \`slow\` 停在 **${r(c)}**，正是前半段的最后一个节点。`:``),{stage:1,front:si(0,n),chips:[{kind:`slow`,label:`slow`,slot:c},{kind:`fast`,label:`fast`,slot:l<t?l:null}]});let d=s+1;n[s]=null,a(`split`,`② **\`slow.next = None\`** —— 断开。这一步看着多余，其实是防环的命门：前半段的尾巴要是还搭在后半段上，第 ③ 步合并时指针会绕成环，链表再也走不到头。现在前段是 ${e.slice(0,s+1).map(String).join(` → `)}，后段是 ${e.slice(d).map(String).join(` → `)}。`,{stage:2,front:si(0,n),back:si(d,n),cutEdge:[s,d]});let f=null,p=d;for(;p!==null;){let e=n[p];n[p]=f;let t=p;f=p,p=e,a(`rev`,p===null?`反转最后一步：\`${r(t)}.next\` 指向 ${r(n[t])}，后半段变成 ${si(f,n).map(r).join(` → `)}。这是 LC 206 的逐字复刻，只是起点换成了 \`second\`。`:`反转后半段：\`${r(t)}.next\` 掉头指向 ${r(n[t])}，\`prev\` 前移到 ${r(f)}，\`curr\` 前移到 ${r(p)}。`,{stage:2,front:si(0,n),back:si(f,n).concat(si(p,n)),chips:[{kind:`prev`,label:`prev`,slot:f},{kind:`curr`,label:`curr`,slot:p}]})}let m=0,h=f,g=[];for(;h!==null;){let e=n[m],t=n[h];n[m]=h,g.push(m,h),a(`merge`,`③ \`first.next = second\`：\`${r(m)}\` 的箭头改指向 ${r(h)}，把后半段的头节点拽了上来。\`t1\`(\`${r(e)}\`) 和 \`t2\`(\`${r(t)}\`) 提前记住了两条链的下家 —— 改指针之前先把路记住，和反转链表里那个 \`nxt\` 是同一个道理。`,{stage:3,merged:[...g],front:o(e,g),back:o(t,g),chips:[{kind:`first`,label:`first`,slot:m},{kind:`second`,label:`second`,slot:h}]}),n[h]=e,a(`merge`,t===null?`③ \`second.next = t1\`：\`${r(h)}\` 接回 ${r(e)}。后半段用完了（\`second\` 变成 ∅），循环结束 —— 条件写的是 \`while second\`，因为后半段更短。`:`③ \`second.next = t1\`：\`${r(h)}\` 接回 ${r(e)}。两个指针各自前移：\`first\` → ${r(e)}，\`second\` → ${r(t)}。`,{stage:3,merged:[...g],front:o(e,g),back:o(t,g),chips:[{kind:`first`,label:`first`,slot:e},{kind:`second`,label:`second`,slot:t}]}),m=e,h=t}let _=si(0,n);return a(`done`,`重排完成：${_.map(r).join(` → `)}。**头节点还是原来的 ${r(0)}** —— 所以这题不需要返回新头，Java 的签名就是 \`void\`。`,{stage:3,merged:_}),i[i.length-1].done=!0,i}var ui=`rord-styles`,di=64,fi=48,pi=44,mi=44,hi=118,gi=218,_i=-26,vi=44,yi=58,bi=26,xi=62,Si=1250,Ci=[`① 找中点`,`② 断开并反转`,`③ 交替合并`],wi=`
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
`;function Ti(){if(X(),document.getElementById(ui))return;let e=document.createElement(`style`);e.id=ui,e.textContent=wi,document.head.appendChild(e)}function Ei(e,t={}){if(!e||e.dataset.rordMounted===`1`)return{destroy(){}};e.dataset.rordMounted=`1`,Ti();let n=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4],r=t.autoplay!==!1,i=li(n),a=n.length,o=Math.max(a,1),s=e=>mi+e*108,c=2*mi+o*di+(o-1)*pi,l=c+xi,u=c+xi/2,d=e=>e+fi/2,f=document.createElement(`div`);f.className=`viz rord`;let p=document.createElement(`div`);p.className=`viz__stage`,f.appendChild(p);let m=Y(`svg`,{class:`viz__svg rord__svg`,viewBox:`0 0 ${l} 322`,role:`img`,"aria-label":`重排链表推演动画：${n.join(` → `)}`});p.appendChild(m);let h=[],g=Math.min(150,(l-2*mi-32)/3),_=(l-(3*g+32))/2;Ci.forEach((e,t)=>{let n=Y(`g`,{class:`rord-stage`}),r=_+t*(g+16);n.appendChild(Y(`rect`,{class:`rord-stage__box`,x:r,y:vi-15,width:g,height:30,rx:15}));let i=Y(`text`,{class:`rord-stage__text`,x:r+g/2,y:vi});i.textContent=e,n.appendChild(i),m.appendChild(n),h.push(n)}),m.appendChild(Y(`circle`,{class:`rord-null__ring`,cx:u,cy:d(hi),r:15}));let v=Y(`text`,{class:`rord-null__text`,x:u,y:d(hi)});v.textContent=`∅`,m.appendChild(v);let y=Y(`g`,{class:`rord-edges`});m.appendChild(y);let b=[];for(let e=0;e<a;e+=1){let t=Y(`g`,{class:`rord-node`});t.appendChild(Y(`rect`,{class:`rord-node__box`,x:0,y:0,width:di,height:fi,rx:9}));let r=Y(`text`,{class:`rord-node__value`,x:di/2,y:fi/2});r.textContent=String(n[e]),t.appendChild(r),m.appendChild(t),b.push(t)}function x(){let e=Y(`g`,{class:`rord-chip`});e.appendChild(Y(`rect`,{class:`rord-chip__box`,x:-58/2,y:-26/2,width:yi,height:bi}));let t=Y(`text`,{class:`rord-chip__text`,x:0,y:0});return e.appendChild(t),{g:e,t}}let S=[x(),x()];S.forEach(e=>m.appendChild(e.g));let C=document.createElement(`p`);C.className=`viz__desc`,C.setAttribute(`aria-live`,`polite`),f.appendChild(C);let w=Q();f.appendChild(w.root),e.textContent=``,e.appendChild(f);let T=null;function E(e,t,n,r){let i=n[e],a=n[t],o=Y(`g`,{class:`rord-edge ${r||``}`});if(i.y===a.y&&Math.abs(i.x-a.x)===108){let e=i.y+fi/2,t=i.x+di,n=a.x;o.appendChild(Y(`line`,{class:`rord-edge__line`,x1:t+3,y1:e,x2:n-9,y2:e})),o.appendChild(Y(`path`,{class:`rord-edge__head`,d:`M ${n} ${e} L ${n-9} ${e-5.5} L ${n-9} ${e+5.5} Z`}))}else{let e=i.y+fi,t=a.y+fi,n=i.x+di/2,r=a.x+di/2;o.appendChild(Y(`path`,{class:`rord-edge__line`,d:`M ${n} ${e} C ${n} ${e+38}, ${r} ${t+38}, ${r} ${t+8}`})),o.appendChild(Y(`path`,{class:`rord-edge__head`,d:`M ${r} ${t} L ${r-5.5} ${t+9} L ${r+5.5} ${t+9} Z`}))}y.appendChild(o)}function D(e,t){let n=Array(a).fill(null),r=[...t.merged,...t.front];r.forEach((e,t)=>{n[e]={x:s(t),y:hi}}),t.back.forEach((e,t)=>{n[e]={x:s(r.length+t),y:gi}});let i=r.length+t.back.length;for(let e=0;e<a;e+=1)n[e]||(n[e]={x:s(i),y:hi},i+=1);let o=new Set(t.merged);for(let e=0;e<a;e+=1){let t=n[e];b[e].setAttribute(`transform`,`translate(${t.x} ${t.y})`),b[e].classList.toggle(`is-merged`,o.has(e))}y.textContent=``;for(let e=0;e<a;e+=1){let r=t.links[e];r!=null&&(r<0||r>=a||E(e,r,n,t.phase===`merge`||t.phase===`done`?`rord-edge--merged`:``))}if(t.cutEdge){let[e,r]=t.cutEdge;if(n[e]&&n[r]){let t=Y(`g`,{class:`rord-edge rord-edge--cut`}),i=n[e],a=n[r];t.appendChild(Y(`line`,{class:`rord-edge__line`,x1:i.x+di,y1:i.y+fi/2,x2:a.x,y2:a.y+fi/2})),y.appendChild(t)}}h.forEach((e,n)=>e.classList.toggle(`is-on`,t.stage===n+1)),S.forEach((e,r)=>{let i=t.chips[r];if(!i){e.g.style.opacity=`0`;return}let a=i.slot===null?{x:u-di/2,y:hi}:n[i.slot];e.g.style.opacity=`1`,e.g.setAttribute(`class`,`rord-chip rord-chip--${i.kind}`),e.t.textContent=i.label,e.g.setAttribute(`transform`,`translate(${a.x+di/2} ${a.y+_i})`)}),Z(C,t.desc)}let O=$({steps:i,controls:w,intervalMs:Si,onRender:D});O.jumpTo(Math.trunc(t.initialStep)||0);let k=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!k&&typeof IntersectionObserver==`function`&&(T=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){T.disconnect(),T=null,O.play();return}},{threshold:.35}),T.observe(f)),{destroy(){T&&=(T.disconnect(),null),O.destroy(),e.textContent=``,delete e.dataset.rordMounted,document.getElementById(ui)?.remove()}}}function Di(e,t){let n=[],r=e,i=new Set;for(;r!=null&&!i.has(r);)i.add(r),n.push(r),r=t[r];return n}function Oi(e){if(e<=0)return null;let t=0,n=0;for(;n<e&&n+1<e;)t+=1,n+=2;return t}function ki(e){let t=e.length;for(let n=0;n<Math.floor(t/2);n+=1)if(e[n]!==e[t-1-n])return!1;return!0}function Ai(e){let t=Oi(e);if(t===null)return[];let n=[];for(let r=0;e-1-r>=t;r+=1)n.push([r,e-1-r]);return n}function ji(e){let t=e.length,n=Array.from({length:t},(e,n)=>n+1<t?n+1:null),r=t=>t==null?`∅`:String(e[t]),i=[],a=(e,t,r={})=>i.push({phase:e,stage:0,desc:t,links:[...n],front:[],back:[],pairs:[],active:null,verdict:null,chips:[],done:!1,...r});if(t===0)return a(`init`,"空链表。正着读、反着读都是「什么都没有」—— **空链表也算回文**，返回 `true`。",{stage:0,done:!0,verdict:!0}),i;ki(e);let o=e.slice().reverse().join(` → `);if(a(`init`,`判断 ${e.join(` → `)} 是不是回文。核心一句话：**把后半段反转过来（${o}），它应该跟前半段逐位相同**。全程只改指针、只比值，不开数组。`,{front:Di(0,n)}),t===1)return a(`done`,"只有一个节点，正着读反着读都是它自己 —— **是回文**，返回 `true`。",{front:[0],stage:3,done:!0,verdict:!0}),i;let s=Oi(t),c=0,l=0,u=0;for(;l<t&&l+1<t;){c+=1,l+=2,u+=1;let e=l>=t;a(`mid`,`① \`fast\` 一次跨两格、\`slow\` 一次一格：第 ${u} 步后 \`slow\` 走到 ${r(c)}、\`fast\` 走到 ${r(l)}。`+(e?` \`fast\` 冲出链表了 —— \`slow\` 停在 ${r(c)} 上，**这就是后半段的开头**。`:``),{stage:1,front:Di(0,n),chips:[{kind:`slow`,label:`slow`,slot:c},{kind:`fast`,label:`fast`,slot:l<t?l:null}]})}let d=Array.from({length:s},(e,t)=>t),f=Array.from({length:t-s},(e,t)=>s+t),p=d.map(r).join(` → `);a(`split`,`② 后半段 ${f.map(r).join(` → `)} 整体下移一行，前半段是 ${p}。接下来反转下行 —— 反转完它从左到右读起来，应该跟上行一模一样。注意这里**不需要断开**：反转时中点 `+r(s)+" 的 `next` 会被置空，前半段的尾巴走到它自然就停了。",{stage:2,front:d,back:f,chips:[{kind:`curr`,label:`curr`,slot:s}]});let m=null,h=s,g=0;for(;h!==null;){let e=n[h];n[h]=m,m=h,h=e,g+=1;let t=[...Di(m,n),...h===null?[]:Di(h,n)];a(`rev`,`② 第 ${g} 个节点掉头：\`curr\` 的 \`next\` 改成 \`prev\`，也就是 ${r(m)} → ${r(n[m])}。`+(h===null?" 后半段反转完成，`prev` 站在新的段头（原来的尾节点）上。":` \`curr\` 前移到 ${r(h)}，剩下的还没处理。`),{stage:2,front:d,back:t,chips:[{kind:`prev`,label:`prev`,slot:m},...h===null?[]:[{kind:`curr`,label:`curr`,slot:h}]]})}let _=Di(t-1,n),v=[],y=Ai(t);for(let t=0;t<y.length;t+=1){let[n,o]=y[t],s=n===o,c=e[n]===e[o],l={f:n,b:o,ok:c};if(v.push(l),a(`cmp`,`③ 第 ${t+1} / ${y.length} 对：`+(s?`\`p1\` 和 \`p2\` 都走到了中点 ${r(n)} 上 —— **中点跟自己比，必然相等**，这一对是白送的。`:`\`p1\` 指向 ${r(n)}、\`p2\` 指向 ${r(o)}，${e[n]} ${c?`==`:`!=`} ${e[o]} —— `+(c?`相等，两个指针一起往前。`:"**不相等，直接返回 `false`**，后面几对不用比了。")),{stage:3,front:d,back:_,pairs:[...v],active:l,verdict:c?null:!1,done:!c,chips:s?[{kind:`p1`,label:`p1/p2`,slot:n}]:[{kind:`p1`,label:`p1`,slot:n},{kind:`p2`,label:`p2`,slot:o}]}),!c)return i}return a(`done`,`③ \`p2\` 走到 ∅，${y.length} 对全部相等 —— **${e.join(` → `)} 是回文链表**，返回 \`true\`。`,{stage:3,front:d,back:_,pairs:[...v],active:null,verdict:!0,done:!0}),i}var Mi=`palm-styles`,Ni=64,Pi=48,Fi=44,Ii=44,Li=118,Ri=236,zi=-26,Bi=44,Vi=58,Hi=26,Ui=62,Wi=350,Gi=1250,Ki=[`① 找中点`,`② 反转后半段`,`③ 逐对比较`],qi=`
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
`;function Ji(){if(X(),document.getElementById(Mi))return;let e=document.createElement(`style`);e.id=Mi,e.textContent=qi,document.head.appendChild(e)}function Yi(e,t={}){if(!e||e.dataset.palmMounted===`1`)return{destroy(){}};e.dataset.palmMounted=`1`,Ji();let n=Array.isArray(t.values)&&t.values.length?t.values:[1,2,2,1],r=t.autoplay!==!1,i=ji(n),a=n.length,o=Math.max(a,1),s=e=>Ii+e*108,c=2*Ii+o*Ni+(o-1)*Fi,l=c+Ui,u=c+Ui/2,d=e=>e+Pi/2,f=document.createElement(`div`);f.className=`viz palm`;let p=document.createElement(`div`);p.className=`viz__stage`,f.appendChild(p);let m=Y(`svg`,{class:`viz__svg palm__svg`,viewBox:`0 0 ${l} 390`,role:`img`,"aria-label":`回文链表推演动画：${n.join(` → `)}`});p.appendChild(m);let h=[],g=Math.min(150,(l-2*Ii-32)/3),_=(l-(3*g+32))/2;Ki.forEach((e,t)=>{let n=Y(`g`,{class:`palm-stage`}),r=_+t*(g+16);n.appendChild(Y(`rect`,{class:`palm-stage__box`,x:r,y:Bi-15,width:g,height:30,rx:15}));let i=Y(`text`,{class:`palm-stage__text`,x:r+g/2,y:Bi});i.textContent=e,n.appendChild(i),m.appendChild(n),h.push(n)}),m.appendChild(Y(`circle`,{class:`palm-null__ring`,cx:u,cy:d(Li),r:15}));let v=Y(`text`,{class:`palm-null__text`,x:u,y:d(Li)});v.textContent=`∅`,m.appendChild(v);let y=Y(`g`,{class:`palm-pairs`});m.appendChild(y);let b=Y(`g`,{class:`palm-edges`});m.appendChild(b);let x=[];for(let e=0;e<a;e+=1){let t=Y(`g`,{class:`palm-node`});t.appendChild(Y(`rect`,{class:`palm-node__box`,x:0,y:0,width:Ni,height:Pi,rx:9}));let r=Y(`text`,{class:`palm-node__value`,x:Ni/2,y:Pi/2});r.textContent=String(n[e]),t.appendChild(r),m.appendChild(t),x.push(t)}function S(){let e=Y(`g`,{class:`palm-chip`});e.appendChild(Y(`rect`,{class:`palm-chip__box`,x:-58/2,y:-26/2,width:Vi,height:Hi}));let t=Y(`text`,{class:`palm-chip__text`,x:0,y:0});return e.appendChild(t),{g:e,t}}let C=[S(),S()];C.forEach(e=>m.appendChild(e.g));let w=Y(`g`,{class:`palm-verdict`}),T=Y(`rect`,{class:`palm-verdict__box`,x:(l-190)/2,y:Wi-18,width:190,height:36,rx:18}),E=Y(`text`,{class:`palm-verdict__text`,x:l/2,y:Wi});w.appendChild(T),w.appendChild(E),m.appendChild(w);let D=document.createElement(`p`);D.className=`viz__desc`,D.setAttribute(`aria-live`,`polite`),f.appendChild(D);let O=Q();f.appendChild(O.root),e.textContent=``,e.appendChild(f);let k=null;function A(e,t,n){let r=n[e],i=n[t],a=Y(`g`,{class:`palm-edge`});if(r.y===i.y&&Math.abs(r.x-i.x)===108){let e=r.y+Pi/2,t=r.x+Ni,n=i.x;a.appendChild(Y(`line`,{class:`palm-edge__line`,x1:t+3,y1:e,x2:n-9,y2:e})),a.appendChild(Y(`path`,{class:`palm-edge__head`,d:`M ${n} ${e} L ${n-9} ${e-5.5} L ${n-9} ${e+5.5} Z`}))}else{let e=r.y+Pi,t=i.y+Pi,n=r.x+Ni/2,o=i.x+Ni/2;a.appendChild(Y(`path`,{class:`palm-edge__line`,d:`M ${n} ${e} C ${n} ${e+38}, ${o} ${t+38}, ${o} ${t+8}`})),a.appendChild(Y(`path`,{class:`palm-edge__head`,d:`M ${o} ${t} L ${o-5.5} ${t+9} L ${o+5.5} ${t+9} Z`}))}b.appendChild(a)}function j(e,t,n){let r=Y(`g`,{class:`palm-pair ${e.ok?`is-ok`:`is-bad`} ${n?`is-on`:``}`});if(e.f===e.b){let n=t[e.f],i=n.x+Ni/2-18,a=n.y+Pi;r.appendChild(Y(`path`,{class:`palm-pair__line`,d:`M ${i-14} ${a} C ${i-22} ${a+26}, ${i+22} ${a+26}, ${i+14} ${a}`})),M(r,i,a+26*.78,e.ok)}else{let n=t[e.f],i=t[e.b],a=n.x+Ni/2-18,o=n.y+Pi,s=i.y,c=(o+s)/2;r.appendChild(Y(`line`,{class:`palm-pair__line`,x1:a,y1:o+10,x2:a,y2:c-11})),r.appendChild(Y(`line`,{class:`palm-pair__line`,x1:a,y1:c+11,x2:a,y2:s-2})),M(r,a,c,e.ok)}y.appendChild(r)}function M(e,t,n,r){e.appendChild(Y(`circle`,{class:`palm-pair__disc`,cx:t,cy:n,r:11}));let i=Y(`text`,{class:`palm-pair__mark`,x:t,y:n});i.textContent=r?`✓`:`✗`,e.appendChild(i)}function N(e,t){let n=Array(a).fill(null);t.front.forEach((e,t)=>{n[e]={x:s(t),y:Li}}),t.back.forEach((e,t)=>{n[e]={x:s(t),y:Ri}});let r=Math.max(t.front.length,t.back.length);for(let e=0;e<a;e+=1)n[e]||(n[e]={x:s(r),y:Li},r+=1);let i=new Set;for(let e of t.pairs)i.add(e.f),i.add(e.b);let o=new Set;t.active&&(o.add(t.active.f),o.add(t.active.b));let c=new Set;t.active&&!t.active.ok&&(c.add(t.active.f),c.add(t.active.b));for(let e=0;e<a;e+=1){let t=n[e];x[e].setAttribute(`transform`,`translate(${t.x} ${t.y})`),x[e].classList.toggle(`is-paired`,i.has(e)),x[e].classList.toggle(`is-active`,o.has(e)),x[e].classList.toggle(`is-bad`,c.has(e))}y.textContent=``,t.pairs.forEach((e,r)=>{let i=t.active&&t.pairs.indexOf(t.active)===r;j(e,n,i)}),b.textContent=``;for(let e=0;e<a;e+=1){let r=t.links[e];r!=null&&(r<0||r>=a||A(e,r,n))}h.forEach((e,n)=>e.classList.toggle(`is-on`,t.stage===n+1)),w.setAttribute(`class`,`palm-verdict`);let l=`准备开始`;t.verdict===!0?(w.classList.add(`is-ok`),l=`✓ 是回文链表`):t.verdict===!1?(w.classList.add(`is-bad`),l=`✗ 不是回文链表`):t.phase===`cmp`?l=`比较中…`:t.phase===`split`||t.phase===`rev`?l=`反转中…`:t.phase===`mid`?l=`定位中点…`:t.phase===`init`&&(l=`待判定`),E.textContent=l,C.forEach((e,r)=>{let i=t.chips[r];if(!i){e.g.style.opacity=`0`;return}let a=i.slot===null?{x:u-Ni/2,y:Li}:n[i.slot],o=a.y===Ri&&i.slot!==null?a.y+Pi+14:a.y+zi;e.g.style.opacity=`1`,e.g.setAttribute(`class`,`palm-chip palm-chip--${i.kind}`),e.t.textContent=i.label,e.g.setAttribute(`transform`,`translate(${a.x+Ni/2} ${o})`)}),Z(D,t.desc)}let P=$({steps:i,controls:O,intervalMs:Gi,onRender:N});P.jumpTo(Math.trunc(t.initialStep)||0);let F=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!F&&typeof IntersectionObserver==`function`&&(k=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){k.disconnect(),k=null,P.play();return}},{threshold:.35}),k.observe(f)),{destroy(){k&&=(k.disconnect(),null),P.destroy(),e.textContent=``,delete e.dataset.palmMounted,document.getElementById(Mi)?.remove()}}}function Xi(e,t){let n=new Set(t);for(let r of e){if(!n.has(r))continue;let i=e.indexOf(r),a=t.indexOf(r),o=0;for(;i+o<e.length&&a+o<t.length&&e[i+o]===t[a+o];)o+=1;if(i+o===e.length&&a+o===t.length)return r}return null}function Zi(e,t){let n=Xi(e,t);return n===null?0:e.length-e.indexOf(n)}function Qi(e,t){let n=Zi(e,t);return{a:e.length-n,b:t.length-n,c:n}}function $i(e={}){let t=Array.isArray(e.pool)&&e.pool.length?e.pool:[1,2,3,4,5,6,7],n=Array.isArray(e.pathA)?e.pathA:[0,1,2,3,4],r=Array.isArray(e.pathB)?e.pathB:[5,6,3,4],i={A:n,B:r},a=n.length,o=r.length,s=e=>e==null?`∅`:String(t[e]),c=Xi(n,r),{a:l,b:u,c:d}=Qi(n,r),f=[],p=(e,t,n={})=>f.push({phase:e,desc:t,onA:`A`,onB:`B`,iA:0,iB:0,fromA:null,fromB:null,jumpsA:!1,jumpsB:!1,shared:c!==null,equal:!1,meet:null,answer:c,done:!1,...n});if(a===0||o===0)return p(`none`,"有一条链表是空的 —— 空链表不可能有相交节点，直接返回 `null`。",{shared:!1,answer:null,done:!0}),f;p(`init`,`两条链表 A = ${n.map(s).join(` → `)}、B = ${r.map(s).join(` → `)}。`+(c===null?`它们**没有共享任何节点**（下面两个 4 只是值相同，不是同一个节点）。`:`从 ${s(c)} 开始它们**共享同一批节点**，后缀完全重合 —— 这就是"相交"在这个结构里的确切含义。`)+` 目标是找出那个**起始**节点，而且不许开哈希表。`,{onA:`A`,onB:`B`,iA:0,iB:0});let m={on:`A`,i:0},h={on:`B`,i:0},g=0,_=0,v=0,y=2*(a+o)+4,b=()=>({onA:m.on,iA:m.i,onB:h.on,iB:h.i});for(;g<=a+o&&v<y;){v+=1;let e=m.i>=i[m.on].length,t=h.i>=i[h.on].length;if(e&&t)break;if(e||t){let n=m.i>=i[m.on].length?i[m.on][i[m.on].length-1]:i[m.on][m.i],r=h.i>=i[h.on].length?i[h.on][i[h.on].length-1]:i[h.on][h.i],a=[];e&&a.push(`pA`),t&&a.push(`pB`);let o=a.map(e=>s(e===`pA`?n:r)).join(` 和 `);e&&(m={on:m.on===`A`?`B`:`A`,i:0},_+=1),t&&(h={on:h.on===`B`?`A`:`B`,i:0},_+=1);let c=s(i[m.on][m.i]),l=s(i[h.on][h.i]);p(`jump`,`**${a.join(` 和 `)} 走到了 ∅，搬到了对方链表的头上。** 它从 ${o} 的 \`next\` 直接跳到另一条链的第一个节点，于是 pA 在 ${c}、pB 在 ${l}。这一步是整套解法的关键：**pA 走完 A 就去走 B，pB 走完 B 就去走 A**，两条"游标自己走过的路"就此等长。`,{...b(),fromA:n,fromB:r,jumpsA:e,jumpsB:t,equal:i[m.on][m.i]===i[h.on][h.i]});continue}if(i[m.on][m.i]===i[h.on][h.i])break;let n=s(i[m.on][m.i]),r=s(i[h.on][h.i]);m.i+=1,h.i+=1,g+=1;let a=m.i>=i[m.on].length?`∅`:s(i[m.on][m.i]),o=h.i>=i[h.on].length?`∅`:s(i[h.on][h.i]);p(`walk`,`第 ${g} 步：pA 在 ${n}、pB 在 ${r}，**不是同一个节点**，一起前移一格 —— pA 到 ${a}、pB 到 ${o}。注意判断相交比的是**节点本身**，不是值：值相等不算数。`,{...b(),equal:i[m.on][m.i]===i[h.on][h.i]})}let x=m.i>=i[m.on].length,S=h.i>=i[h.on].length;if(!x&&!S&&i[m.on][m.i]===i[h.on][h.i]){let e=i[m.on][m.i];return p(`found`,`**两个游标同时落在节点 ${s(e)} 上 —— 这就是相交的起始节点。** pA 走了 A 的独有段 ${l} 步 + 公共段 ${d} 步 + B 的独有段 ${u} 步，pB 走了 B 的独有段 ${u} 步 + 公共段 ${d} 步 + A 的独有段 ${l} 步 ——两条路都是 \`a + b + c = ${l+u+d}\`，**路程相等，所以必然同时到达**。`,{...b(),equal:!0,meet:e,done:!0}),f}return p(`none`,`两个游标**同时走到了 ∅** —— 两条链表根本没有共享节点。各自都老老实实走完了"自己那条链 + 对方那条链"（各 ${l+u} 步），恰好手拉手一起掉出去。返回 \`null\`。`,{...b(),done:!0}),f}var ea=`ints-styles`,ta=62,na=46,ra=40,ia=46,aa=150,oa=286,sa=aa-62,ca=348,la=482/2,ua=52,da=24,fa=34,pa=30,ma=396,ha=44,ga=-34,_a=1250,va=`
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
`;function ya(){if(X(),document.getElementById(ea))return;let e=document.createElement(`style`);e.id=ea,e.textContent=va,document.head.appendChild(e)}function ba(e,t={}){if(!e||e.dataset.intsMounted===`1`)return{destroy(){}};e.dataset.intsMounted=`1`,ya();let n=$i(t);n[0];let r=t.autoplay!==!1,i=Array.isArray(t.pool)&&t.pool.length?t.pool:[1,2,3,4,5,6,7],a=Array.isArray(t.pathA)?t.pathA:[0,1,2,3,4],o=Array.isArray(t.pathB)?t.pathB:[5,6,3,4],{a:s,b:c,c:l}=Qi(a,o),u=l>0?a.slice(s):[],d=new Set(u);s>0&&a[s-1],c>0&&o[c-1];let f=Math.max(a.length,o.length,1),p=pa,m=e=>76+e*102,h=2*ia+f*ta+(f-1)*ra,g=h+fa*2+pa*2,_=p+h+fa,v=s,y=e=>e+na/2;function b(e){let t=a.indexOf(e),n=o.indexOf(e);return t>=0&&d.has(e)?{x:m(v+(t-s)),y:aa,col:v+(t-s)}:t>=0&&n<0?{x:m(t),y:aa,col:t}:n>=0&&t<0?{x:m(n),y:oa,col:n}:t>=0?{x:m(t),y:aa,col:t}:{x:m(n),y:oa,col:n}}let x=document.createElement(`div`);x.className=`viz ints`;let S=document.createElement(`div`);S.className=`viz__stage`,x.appendChild(S);let C=Y(`svg`,{class:`viz__svg ints__svg`,viewBox:`0 0 ${g} 440`,role:`img`,"aria-label":`相交链表推演动画`});S.appendChild(C);let w=Y(`g`,{class:`ints-shared-note`}),T=Y(`line`,{class:`ints-shared-note__line`}),E=Y(`text`,{class:`ints-shared-note__text`,x:g/2,y:ha});w.append(T,E),C.appendChild(w);let D=[];for(let[e,t]of[[_,y(aa)],[_,y(oa)]]){C.appendChild(Y(`circle`,{class:`ints-null__ring`,cx:e,cy:t,r:14}));let n=Y(`text`,{class:`ints-null__text`,x:e,y:t});n.textContent=`∅`,C.appendChild(n),D.push({cx:e,cy:t})}let O=Y(`g`,{class:`ints-edges`});C.appendChild(O);let k=Y(`g`,{class:`ints-answer`}),A=Y(`rect`,{class:`ints-answer__box`,x:0,y:0,width:76,height:60,rx:13});k.appendChild(A),C.appendChild(k);let j=new Map;for(let e of new Set([...a,...o])){let t=b(e),n=Y(`g`,{class:`ints-node${d.has(e)?` is-shared`:``}`});n.setAttribute(`transform`,`translate(${t.x} ${t.y})`),n.appendChild(Y(`rect`,{class:`ints-node__box`,x:0,y:0,width:ta,height:na,rx:9}));let r=Y(`text`,{class:`ints-node__value`,x:ta/2,y:na/2});r.textContent=String(i[e]),n.appendChild(r),C.appendChild(n),j.set(e,n)}let M=[],N=(e,t)=>{for(let n=0;n<e.length-1;n+=1){let r=e[n],i=e[n+1],a=`${r}->${i}`;M.some(e=>e.key===a)||M.push({key:a,from:r,to:i,kind:t})}};N(a,`a`),N(o,`b`);let P=[];for(let e of M){let t=Y(`g`,{class:`ints-edge ints-edge--${e.kind}`}),n=Y(`path`,{class:`ints-edge__line`}),r=Y(`path`,{class:`ints-edge__head`});t.append(n,r),O.appendChild(t),P.push({...e,g:t,line:n,head:r})}let F=[];{let e=Y(`g`,{class:`ints-edge`}),t=Y(`path`,{class:`ints-edge__line`}),n=Y(`path`,{class:`ints-edge__head`});e.append(t,n),O.appendChild(e),F.push({g:e,line:t,head:n,slot:a[a.length-1],row:aa})}let I={};for(let e of[`a`,`b`]){let t=Y(`g`,{class:`ints-hop ints-hop--${e}`}),n=Y(`path`,{class:`ints-hop__line`}),r=Y(`path`,{class:`ints-hop__head`}),i=Y(`rect`,{class:`ints-hop__tag-bg`,x:-76,y:-9,width:152,height:18,rx:6}),a=Y(`text`,{class:`ints-hop__tag`,x:0,y:0});t.append(n,r,i,a),C.appendChild(t),I[e]={g:t,line:n,head:r,tagBg:i,tag:a}}let L=[];if(s>0){let e=Y(`text`,{class:`ints-row__text ints-row__text--a`,x:m(0)+ga,y:y(aa)});e.textContent=`A`,C.appendChild(e),L.push(e)}if(c>0){let e=Y(`text`,{class:`ints-row__text ints-row__text--b`,x:m(0)+ga,y:y(oa)});e.textContent=`B`,C.appendChild(e),L.push(e)}function R(e,t){let n=Y(`g`,{class:`ints-chip ints-chip--${e}`});n.appendChild(Y(`rect`,{class:`ints-chip__box`,x:-52/2,y:-24/2,width:ua,height:da}));let r=Y(`text`,{class:`ints-chip__text`,x:0,y:0});return r.textContent=t,n.appendChild(r),n}let z=R(`a`,`pA`),B=R(`b`,`pB`);C.append(z,B);let V=Y(`line`,{class:`ints-lead ints-lead--a`}),H=Y(`line`,{class:`ints-lead ints-lead--b`});O.append(V,H);let U=Y(`g`,{class:`ints-verdict`}),ee=Y(`rect`,{class:`ints-verdict__box`,x:(g-240)/2,y:ma-18,width:240,height:36,rx:18}),W=Y(`text`,{class:`ints-verdict__text`,x:g/2,y:ma});U.append(ee,W),C.appendChild(U);let G=document.createElement(`p`);G.className=`viz__desc`,G.setAttribute(`aria-live`,`polite`),x.appendChild(G);let K=Q();x.appendChild(K.root),e.textContent=``,e.appendChild(x);let te=null;for(let e of P)ne(e,b(e.from),b(e.to));{let e=F[0],t=b(e.slot),n=t.y+na/2,r=t.x+ta+3,i=_-14;e.line.setAttribute(`d`,`M ${r} ${n} L ${i-8} ${n}`),e.head.setAttribute(`d`,`M ${i} ${n} L ${i-9} ${n-5.5} L ${i-9} ${n+5.5} Z`)}function ne(e,t,n){if(t.y===n.y){let r=t.y+na/2,i=t.x+ta,a=n.x;e.line.setAttribute(`d`,`M ${i+3} ${r} L ${a-9} ${r}`),e.head.setAttribute(`d`,`M ${a} ${r} L ${a-9} ${r-5.5} L ${a-9} ${r+5.5} Z`);return}let r=t.x+ta,i=t.y+na/2,a=n.x,o=n.y+na/2,s=r+3,c=a-9,l=Math.max(26,(c-s)*.45);e.line.setAttribute(`d`,`M ${s} ${i} C ${s+l} ${i}, ${c-l} ${o}, ${c} ${o}`),e.head.setAttribute(`d`,`M ${a} ${o} L ${a-9} ${o-5.5} L ${a-9} ${o+5.5} Z`)}function q(e,t,n){let r=I[e];if(r.g.classList.toggle(`is-on`,n),!n)return;let i=e===`a`?t.fromA:t.fromB,s=(e===`a`?t.onA:t.onB)===`A`?a:o;if(i==null)return;let c=b(i),l=b(s[0]),u=c.x+ta/2,d=e===`a`?c.y+na:c.y,f=l.x+ta/2,p=e===`a`?l.y:l.y+na,m=la;r.line.setAttribute(`d`,`M ${u} ${d} L ${u} ${m} L ${f} ${m} L ${f} ${p}`);let h=p<m;r.head.setAttribute(`d`,h?`M ${f} ${p} L ${f-5.5} ${p+9} L ${f+5.5} ${p+9} Z`:`M ${f} ${p} L ${f-5.5} ${p-9} L ${f+5.5} ${p-9} Z`);let g=(u+f)/2;r.tagBg.setAttribute(`x`,g-76),r.tagBg.setAttribute(`y`,m-9),r.tag.setAttribute(`x`,g),r.tag.setAttribute(`y`,m),r.tag.textContent=e===`a`?`pA 走完 A → 换到 B 的头`:`pB 走完 B → 换到 A 的头`}function re(e,t){let n=t===`A`?e.onA:e.onB,r=t===`A`?e.iA:e.iB,i=n===`A`?a:o;if(r>=i.length){let e=n===`A`?aa:oa;return{x:_-ta/2,y:e,onNull:!0}}return{...b(i[r]),onNull:!1}}function ie(e,t){let n=(()=>{let e=t.onA===`A`?a:o;return t.iA>=e.length?null:e[t.iA]})(),r=(()=>{let e=t.onB===`A`?a:o;return t.iB>=e.length?null:e[t.iB]})();for(let[e,i]of j)i.classList.toggle(`is-cursor-a`,e===n),i.classList.toggle(`is-cursor-b`,e===r&&e!==n),i.classList.toggle(`is-meet`,t.meet!==null&&e===t.meet);if(t.answer!==null&&t.answer!==void 0){let e=b(t.answer);A.setAttribute(`x`,e.x-7),A.setAttribute(`y`,e.y-7),k.style.opacity=`1`}else k.style.opacity=`0`;if(t.answer!==null&&t.answer!==void 0&&l>0){let e=b(t.answer).x+ta/2;E.textContent=`公共段从这里开始（两条链共用这 ${l} 个节点）`,T.setAttribute(`x1`,e),T.setAttribute(`x2`,e),T.setAttribute(`y1`,55),T.setAttribute(`y2`,aa-12),w.style.opacity=`1`}else w.style.opacity=`0`;let s=re(t,`A`),c=re(t,`B`),u=n!==null&&n===r,d=s.onNull?aa:s.y,f=c.onNull?oa:c.y,p=d===oa?ca:sa,m=f===aa?sa:ca,h=u?p-14:p,g=u?m+14:m;z.setAttribute(`transform`,`translate(${s.x+ta/2} ${h})`),B.setAttribute(`transform`,`translate(${c.x+ta/2} ${g})`),z.style.opacity=`1`,B.style.opacity=`1`;let _=(e,t)=>{let n=e<t.y;return{x:t.x+ta/2,y1:n?e+da/2:e-da/2,y2:n?t.y-2:t.y+na+2}},v=_(h,s),y=_(g,c);V.setAttribute(`x1`,v.x),V.setAttribute(`x2`,v.x),V.setAttribute(`y1`,v.y1),V.setAttribute(`y2`,v.y2),H.setAttribute(`x1`,y.x),H.setAttribute(`x2`,y.x),H.setAttribute(`y1`,y.y1),H.setAttribute(`y2`,y.y2),q(`a`,t,t.phase===`jump`&&t.jumpsA),q(`b`,t,t.phase===`jump`&&t.jumpsB),U.setAttribute(`class`,`ints-verdict`);let x=`准备开始`;t.phase===`found`?(U.classList.add(`is-ok`),x=`✓ 相交于节点 ${i[t.meet]}`):t.phase===`none`?(U.classList.add(`is-bad`),x=`✗ 两条链表不相交`):t.phase===`jump`?x=`换头中…`:t.phase===`walk`?x=`同步前进中…`:t.phase===`init`&&(x=`待判定`),W.textContent=x,Z(G,t.desc)}let ae=$({steps:n,controls:K,intervalMs:_a,onRender:ie});ae.jumpTo(Math.trunc(t.initialStep)||0);let oe=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!oe&&typeof IntersectionObserver==`function`&&(te=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){te.disconnect(),te=null,ae.play();return}},{threshold:.35}),te.observe(x)),{destroy(){te&&=(te.disconnect(),null),ae.destroy(),e.textContent=``,delete e.dataset.intsMounted,document.getElementById(ea)?.remove()}}}var xa=-1;function Sa(e,t,n){if(!Array.isArray(t)||n<0||n>=t.length)return 0;let r=e[t[n]],i=1;for(;n+i<t.length&&e[t[n+i]]===r;)i+=1;return i}function Ca(e={}){let t=Array.isArray(e.pool)&&e.pool.length?e.pool:[1,2,3,3,4,4,5],n=Array.isArray(e.path)?e.path:[0,1,2,3,4,5,6],r=e.mode===`keep-one`?`keep-one`:`remove-all`,i=e=>e===xa||e==null?`dummy`:e>=n.length?`∅`:String(t[n[e]]),a=e=>e<0||e>=n.length?null:t[n[e]],o=e=>Sa(t,n,e),s=[],c=[];{let e=0;for(;e<n.length;){let t=o(e);if(t>1)if(r===`keep-one`){for(let n=e;n<e+t-1;n+=1)c.push(n);s.push(e+t-1)}else for(let n=e;n<e+t;n+=1)c.push(n);else s.push(e);e+=t}}let l=[],u=[],d=(e,t,n={})=>l.push({phase:e,desc:t,prev:xa,curr:0,dupStart:null,dupEnd:null,removed:[...u],removedNow:[],kept:[...s],mode:r,done:!1,...n});if(n.length===0)return d(`done`,"链表是空的 —— 没有节点可删，直接返回 `null`。",{curr:0,prev:xa,done:!0}),l;d(`init`,`链表 ${n.map((e,t)=>i(t)).join(` → `)} 已经**排好序**，所以重复的元素一定挨在一起。目标是**把所有出现过的重复值都删干净**（一个都不留），`+(r===`keep-one`?`不过这次用阿里变体的规则：**重复过的值留下一个**。`:`这就是本题（LC 82）的要求，注意跟"只留一个"不是一回事。`)+" 先在头上架一个 `dummy` 哨兵 —— 头节点自己也可能是重复段的一员。",{prev:xa,curr:0});let f=0;for(;f<n.length;){let e=o(f);if(e>1){let t=f,o=f+e,s=a(f);d(`dup-start`,`\`curr\` 在 ${i(f)}，它的值和下一个节点相同（都是 ${s}）——**发现一段重复，长度 ${e}**。\`prev\` 就此**停住不动**，因为一会儿要把整段一次摘掉，摘的动作得由 \`prev.next = curr\` 完成，prev 必须留在这一段的**前一个**位置。`,{prev:f-1<0?xa:f-1,curr:f,dupStart:t,dupEnd:o});for(let e=t;e<o;e+=1){let n=e+1<o;d(`skip`,`\`curr\` 从 ${i(e)} 往前一格到 ${i(e+1)}（值都是 ${a(e)}）——`+(n?` 后面**还有同值的节点**，重复段没走完，继续往前。`:` 这一步跨出了重复段。`)+" 全程 **`prev` 一动没动** —— 它守在重复段前面的那个节点上，等着被接上。",{prev:f-1<0?xa:f-1,curr:e+1,dupStart:t,dupEnd:o})}if(r===`keep-one`){let e=o-1;for(let n=t;n<e;n+=1)u.push(n);let n=Array.from({length:e-t},(e,n)=>t+n);d(`unlink`,`**阿里变体：留下一个。** 把重复段里的 ${t} 到 ${e-1} 号节点（值都是 ${s}）摘掉，只留最后一个 ${i(e)}。\`prev.next\` 指向 ${i(e)}。`,{prev:e,curr:o,dupStart:t,dupEnd:o,removedNow:n})}else{for(let e=t;e<o;e+=1)u.push(e);let r=Array.from({length:e},(e,n)=>t+n);d(`unlink`,`**整段摘掉。** \`prev.next = curr\` 一次接上 ${o<n.length?i(o):`∅`} —— 中间的 ${e} 个节点（值都是 ${s}）全被摘出链表，一个不留。这一步就是本题跟 LC 83 的分水岭：**LC 83 会留下一个，这里一个都不留。**`,{prev:f-1<0?xa:f-1,curr:o,dupStart:t,dupEnd:o,removedNow:r})}f=o;let c=r===`keep-one`?o-1:f-1;f<n.length&&d(`advance`,`刚才那一段处理完了：\`prev\` 现在停在 ${i(c)}，\`curr\` 落在 ${i(f)}。**只有确定 curr 不再是重复段成员时，prev 才跟着前进。**`,{prev:c,curr:f});continue}d(`scan`,`\`curr\` 在 ${i(f)}，它的值（${a(f)}）跟下一个${f+1<n.length?`（${i(f+1)}）`:`（没有下一个了）`} 不相同 —— 这个节点不属于任何重复段，**安全保留**。于是 \`prev\` 也前进一格，跟 \`curr\` 挨着一起往右走。`,{prev:f-1<0?xa:f-1,curr:f}),f+=1}let p=n.map((e,t)=>i(t)).join(` → `),m=s.map(e=>i(e)).join(` → `),h=c.length?c.map(e=>i(e)).join(`、`):`（无）`;return d(`done`,`\`curr\` 走到了 ∅，循环结束。返回 \`dummy.next\`。\n\n- 原链表：${p}\n- 结果：**${m||`（空）`}**\n- 被摘掉的节点：${h}\n\n`+(r===`keep-one`?`阿里变体的结果里，**重复过的值各留了一个**，没重复过的值原样保留。`:`**所有出现过的重复值都被删干净了** —— 这就是 LC 82 跟 LC 83 的区别。`)+" 全程只用了两根指针，额外空间 `O(1)`。",{prev:xa,curr:n.length,done:!0}),l}var wa=`rd2-styles`,Ta=0,Ea=62,Da=48,Oa=38,ka=44,Aa=150,ja=174,Ma=58,Na=24,Pa=Aa-62,Fa=264,Ia=Aa-34,La=8,Ra=46,za=372,Ba=46,Va=1150,Ha=`
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
`;function Ua(){if(X(),document.getElementById(wa))return;let e=document.createElement(`style`);e.id=wa,e.textContent=Ha,document.head.appendChild(e)}function Wa(e,t={}){if(!e||e.dataset.rd2Mounted===`1`)return{destroy(){}};e.dataset.rd2Mounted=`1`,Ua();let n=Ca(t),r=t.autoplay!==!1,i=Array.isArray(t.pool)&&t.pool.length?t.pool:[1,2,3,3,4,4,5],a=Array.isArray(t.path)?t.path:[0,1,2,3,4,5,6],o=t.mode===`keep-one`?`keep-one`:`remove-all`,s=a.length,c=s+1,l=e=>e<0?Ta:e+1,u=e=>e-1,d=2*ka+c*Ea+(c-1)*Oa,f=e=>ka+e*100,p=e=>f(e)+Ea/2,m=d-Ba,h=document.createElement(`div`);h.className=`viz rd2`;let g=document.createElement(`div`);g.className=`viz__stage`,h.appendChild(g);let _=Y(`svg`,{class:`viz__svg rd2__svg`,viewBox:`0 0 ${d} 416`,role:`img`,"aria-label":`删除排序链表中重复元素的推演动画：${a.map(e=>i[e]).join(` → `)}`});g.appendChild(_);let v=Y(`g`,{class:`rd2-note`}),y=Y(`line`,{class:`rd2-note__line`}),b=Y(`text`,{class:`rd2-note__text`,x:d/2,y:Ra});v.append(y,b),_.appendChild(v),_.appendChild(Y(`circle`,{class:`rd2-null__ring`,cx:m,cy:ja,r:14}));let x=Y(`text`,{class:`rd2-null__text`,x:m,y:ja});x.textContent=`∅`,_.appendChild(x);let S=Y(`line`,{class:`rd2-lead rd2-lead--curr`}),C=Y(`line`,{class:`rd2-lead rd2-lead--prev`});_.append(S,C);let w=Y(`g`,{class:`rd2-edges`});_.appendChild(w);let T=[];function E(e){for(;T.length<=e;){let e=Y(`g`,{class:`rd2-edge`}),t=Y(`line`,{class:`rd2-edge__line`}),n=Y(`path`,{class:`rd2-edge__head`});e.append(t,n),w.appendChild(e),T.push({g:e,line:t,head:n})}return T[e]}function D(e,t,n){let r=f(t)+Ea+3,i=f(n),a=ja;e.line.setAttribute(`x1`,r),e.line.setAttribute(`y1`,a),e.line.setAttribute(`x2`,i-9),e.line.setAttribute(`y2`,a),e.head.setAttribute(`d`,`M ${i} ${a} L ${i-9} ${a-5.5} L ${i-9} 179.5 Z`)}function O(e,t){let n=f(t)+Ea+3,r=m-14,i=ja;e.line.setAttribute(`x1`,n),e.line.setAttribute(`y1`,i),e.line.setAttribute(`x2`,r-9),e.line.setAttribute(`y2`,i),e.head.setAttribute(`d`,`M ${r} ${i} L ${r-9} ${i-5.5} L ${r-9} 179.5 Z`)}let k=Y(`g`,{class:`rd2-arc`}),A=Y(`path`,{class:`rd2-arc__line`}),j=Y(`path`,{class:`rd2-arc__head`}),M=Y(`rect`,{class:`rd2-arc__tag-bg`,x:-66,y:-9,width:132,height:18,rx:6}),N=Y(`text`,{class:`rd2-arc__tag`,x:0,y:0});k.append(A,j,M,N),_.appendChild(k);let P=Y(`g`,{class:`rd2-dupframe`}),F=Y(`rect`,{class:`rd2-dupframe__box`,x:0,y:0,width:0,height:0,rx:14}),I=Y(`rect`,{class:`rd2-dupframe__tag-bg`,x:-50,y:-9,width:100,height:18,rx:6}),L=Y(`text`,{class:`rd2-dupframe__tag`,x:0,y:0});P.append(F,I,L),_.appendChild(P);let R=[];for(let e=0;e<c;e+=1){let t=Y(`g`,{class:`rd2-node${e===Ta?` rd2-node--dummy`:``}`});t.appendChild(Y(`rect`,{class:`rd2-node__box`,x:f(e),y:Aa,width:Ea,height:Da,rx:9}));let n=Y(`text`,{class:`rd2-node__value`,x:p(e),y:ja});n.textContent=e===Ta?`dummy`:String(i[a[u(e)]]),t.appendChild(n),_.appendChild(t),R.push(t)}function z(e,t){let n=Y(`g`,{class:`rd2-chip rd2-chip--${e}`});n.appendChild(Y(`rect`,{class:`rd2-chip__box`,x:-58/2,y:-24/2,width:Ma,height:Na}));let r=Y(`text`,{class:`rd2-chip__text`,x:0,y:0});return r.textContent=t,n.appendChild(r),n}let B=z(`curr`,`curr`),V=z(`prev`,`prev`);_.append(B,V);let H=Y(`g`,{class:`rd2-verdict`}),U=Y(`rect`,{class:`rd2-verdict__box`,x:(d-264)/2,y:za-18,width:264,height:36,rx:18}),ee=Y(`text`,{class:`rd2-verdict__text`,x:d/2,y:za});H.append(U,ee),_.appendChild(H);let W=document.createElement(`p`);W.className=`viz__desc`,W.setAttribute(`aria-live`,`polite`),h.appendChild(W);let G=Q();h.appendChild(G.root),e.textContent=``,e.appendChild(h);let K=null,te=e=>e>=s?{x:m,onNull:!0}:{x:p(l(e)),onNull:!1};function ne(e){let t=new Set(e.removed),n=[];for(let e=0;e<s;e+=1)t.has(e)||n.push(e);let r=new Map,i=e.prev,a=e.curr;for(let e=0;e<n.length;e+=1){let t=n[e],i=e+1<n.length?n[e+1]:-1;r.set(l(t),i===-1?-1:l(i))}if(r.set(Ta,n.length?l(n[0]):-1),i>=-1){let e=i===-1?Ta:l(i),t=a>=s?-1:l(a);r.set(e,t)}for(let e of t)r.set(l(e),null);return r}function q(e){let t=(e.phase===`unlink`||e.phase===`advance`)&&e.removedNow.length>0;if(k.classList.toggle(`is-on`,t),!t)return;let n=e.prev===-1?Ta:l(e.prev),r=e.curr>=s?null:l(e.curr);if(r===null)return;let i=f(n)+Ea,a=f(r);if(a<=i)return;let o=i+(a-i)*.28,c=i+(a-i)*.72;A.setAttribute(`d`,`M ${i+3} ${ja} C ${o} ${ja-58}, ${c} ${ja-58}, ${a-9} ${ja}`),j.setAttribute(`d`,`M ${a} ${ja} L ${a-9} ${ja-5.5} L ${a-9} 179.5 Z`);let u=(i+a)/2;M.setAttribute(`x`,u-66),M.setAttribute(`y`,ja-58-9),N.setAttribute(`x`,u),N.setAttribute(`y`,ja-58),N.textContent=`prev.next = curr`}function re(e,t){let n=new Set(t.removed),r=e=>t.dupStart!==null&&t.dupEnd!==null&&e>=t.dupStart&&e<t.dupEnd;for(let e=0;e<c;e+=1){if(e===Ta){R[e].classList.toggle(`is-prev`,t.prev===-1),R[e].classList.toggle(`is-curr`,!1);continue}let i=u(e);R[e].classList.toggle(`is-cut`,n.has(i)),R[e].classList.toggle(`is-dup`,r(i)&&!n.has(i)),R[e].classList.toggle(`is-prev`,t.prev===i),R[e].classList.toggle(`is-curr`,t.curr===i)}let s=ne(t),d=0;for(let[e,t]of s){if(t===null)continue;let n=E(d);d+=1,n.g.classList.add(`is-on`),t===-1?O(n,e):D(n,e,t)}for(let e=d;e<T.length;e+=1)T[e].g.classList.remove(`is-on`);q(t);let m=t.dupStart!==null&&t.dupEnd!==null&&t.dupEnd>t.dupStart;if(P.classList.toggle(`is-on`,m),m){let e=l(t.dupStart),n=l(t.dupEnd-1);F.setAttribute(`x`,f(e)-La),F.setAttribute(`y`,Aa-La),F.setAttribute(`width`,f(n)+Ea-f(e)+La*2),F.setAttribute(`height`,64);let r=(f(e)+f(n)+Ea)/2,i=t.dupEnd-t.dupStart;L.textContent=`重复段 ${i} 个`,I.setAttribute(`x`,r-50),I.setAttribute(`y`,Ia-9),L.setAttribute(`x`,r),L.setAttribute(`y`,Ia)}let h=te(t.curr),g=t.prev===-1?Ta:l(t.prev),_=p(g);if(B.setAttribute(`transform`,`translate(${h.x} ${Pa})`),V.setAttribute(`transform`,`translate(${_} ${Fa})`),B.style.opacity=`1`,V.style.opacity=`1`,S.setAttribute(`x1`,h.x),S.setAttribute(`x2`,h.x),S.setAttribute(`y1`,100),S.setAttribute(`y2`,Aa-2),C.setAttribute(`x1`,_),C.setAttribute(`x2`,_),C.setAttribute(`y1`,Fa-Na/2),C.setAttribute(`y2`,200),m){let e=p(l(t.dupEnd-1));b.textContent=`curr 冲进重复段，prev 原地等 —— 错位就是这么来的`,y.setAttribute(`x1`,e),y.setAttribute(`x2`,e),y.setAttribute(`y1`,57),y.setAttribute(`y2`,Ia-12),v.style.opacity=`1`}else v.style.opacity=`0`;H.setAttribute(`class`,`rd2-verdict`);let x=`准备开始`;if(t.phase===`done`){H.classList.add(`is-ok`);let e=t.kept.map(e=>i[a[e]]).join(` → `);x=e?`✓ ${e||`空`}`:`✓ 全部被删，返回空链表`}else t.phase===`unlink`?(H.classList.add(`is-cut`),x=o===`keep-one`?`摘掉多余的，留一个`:`整段摘掉，一个不留`):t.phase===`dup-start`?x=`发现重复段`:t.phase===`skip`?x=`curr 在重复段里往前冲…`:t.phase===`scan`||t.phase===`advance`?x=`两个指针一起前进`:t.phase===`init`&&(x=`架好 dummy 与 prev / curr`);ee.textContent=x,Z(W,t.desc)}let ie=$({steps:n,controls:G,intervalMs:Va,onRender:re});ie.jumpTo(Math.trunc(t.initialStep)||0);let ae=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!ae&&typeof IntersectionObserver==`function`&&(K=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){K.disconnect(),K=null,ie.play();return}},{threshold:.35}),K.observe(h)),{destroy(){K&&=(K.disconnect(),null),ie.destroy(),e.textContent=``,delete e.dataset.rd2Mounted,document.getElementById(wa)?.remove()}}}function Ga(e){let t=Array.isArray(e)?e:[],n=[];if(t.length===0||t[0]===null||t[0]===void 0)return{nodes:n,root:-1};let r=new Map,i=[];for(let e=0;e<t.length;e+=1)t[e]===null||t[e]===void 0||(r.set(e,n.length),i.push(e),n.push({id:n.length,value:t[e],left:null,right:null,parent:-1,side:null,depth:0,col:0}));if(n.length===0)return{nodes:n,root:-1};for(let e of n){let a=i[e.id];for(let[i,o]of[[1,`L`],[2,`R`]]){let s=2*a+i;if(s>=t.length)continue;let c=r.get(s);c!==void 0&&(n[c].parent=e.id,n[c].side=o,n[c].depth=e.depth+1,o===`L`?e.left=c:e.right=c)}}let a=new Map;for(let e of n)a.has(e.depth)||a.set(e.depth,[]),a.get(e.depth).push(e.id);for(let e of a.values())e.sort((e,t)=>e-t),e.forEach((e,t)=>{n[e].col=t});return{nodes:n,root:0}}function Ka(e={}){let t=Array.isArray(e.values)?e.values:[3,9,20,null,null,15,7],n=e.mode===`zigzag`?`zigzag`:`plain`,{nodes:r,root:i}=Ga(t),a=e=>r[e].value,o=[],s=[],c=[],l=[],u=(e,t,r={})=>c.push({phase:e,desc:t,queue:[...l],levelIndex:-1,levelSize:0,consumed:0,current:null,enqueued:[],levelValues:[],results:o.map(e=>[...e]),rightView:[...s],mode:n,zigzagReversed:!1,done:!1,...r});if(i===-1)return u(`done`,"树是空的（`root` 是 `null`）—— 没有任何节点，直接返回空数组 `[]`。",{done:!0}),c;u(`init`,'把根节点 `3` 入队。**队列是 BFS 的全部内存** —— 它是一个"待处理却还没轮到"的缓冲区，而且天然按层排队：同一层的节点一定挨在一起，且比下一层先出队。 这正是层序遍历能"分层输出"的物理基础。',{enqueued:[i]}),l.push(i);let d=0;for(;l.length>0;){let e=l.length,t=n===`zigzag`&&d%2==1,i=[],c=e=>{t?i.unshift(e):i.push(e)};u(`enter`,`**进第 ${d} 层之前，先做一件最关键的事：把当前队列长度存下来。** 此刻队列里是 \`[${l.map(a).join(`, `)}]\`，所以 \`size = ${e}\` —— 这 ${e} 个节点就是第 ${d} 层的**全部成员**。 为什么要存：接下来的内层循环会一边出队、一边把左右孩子入队，队列长度是**一直在变的**。如果拿实时长度当循环条件，下一层的节点会立刻被卷进来，层就分不开了。`+(t?` 这是锯齿变体的奇数层 —— 顺序要**反过来**，所以这一层的值用头插收集。`:``),{levelIndex:d,levelSize:e,levelValues:[...i],zigzagReversed:t});for(let n=0;n<e;n+=1){let o=l.shift(),s=r[o],f=[];if(s.left!==void 0&&s.left!==null&&f.push(s.left),s.right!==void 0&&s.right!==null&&f.push(s.right),c(s.value),u(`consume`,`出队第 ${n+1} / ${e} 个节点：\`${s.value}\`。 把它记进第 ${d} 层的结果里`+(t?`（头插到前面，因为这一层要从右往左）`:``)+(f.length?`。 它有两个孩子要处理：${f.map(e=>`\`${a(e)}\``).join(` 和 `)} —— 下面一步入队。`:`。 它是叶子节点，没有孩子要入队 —— 队列少了一个、没补上。`)+` 已出队 ${n+1} 个，这一层还剩 ${e-n-1} 个，**出队的次数由进层时那个 \`size\` 决定，跟此刻队列多长无关。**`,{levelIndex:d,levelSize:e,consumed:n+1,current:o,levelValues:[...i],zigzagReversed:t}),f.length){for(let e of f)l.push(e);u(`enqueue`,`把 \`${s.value}\` 的${f.map(e=>` \`${a(e)}\``).join(` 和`)} 入队。**注意它们排到了队尾** —— 在同层还没处理完的节点后面，也就是第 ${d+1} 层的位置。 队列"同层在前、下层在后"的次序，就是分层这件事的全部玄机。`,{levelIndex:d,levelSize:e,consumed:n+1,current:o,enqueued:f,levelValues:[...i],zigzagReversed:t})}}o.push([...i]),s.push(i[i.length-1]),u(`close`,`第 ${d} 层的 ${e} 个节点全部出队，收工。 这一层的结果是 \`[${i.join(`, `)}]\``+(t?`（已按锯齿要求从右往左）`:``)+`。 此刻队列里是 \`[${l.map(a).join(`, `)}]\` —— `+(l.length?`正好是第 ${d+1} 层，下一轮的 \`size\` 就会等于 ${l.length}。`:`空了。`)+(n===`zigzag`?` 下一层的收集方向要**反过来**（锯齿的本质：只改值的方向，不改队列的方向）。`:``),{levelIndex:d,levelSize:e,consumed:e,levelValues:[...i],zigzagReversed:t}),d+=1}return u(`done`,`队列空了，遍历结束。返回 \`[${o.map(e=>`[${e.join(`, `)}]`).join(`, `)}]\`。\n\n- 一共 ${o.length} 层\n- 每层的节点数：${o.map(e=>e.length).join(`、`)}\n- 锯齿变体的结果：\`[${o.map((e,t)=>`[${(n===`zigzag`?e:t%2==1?[...e].reverse():e).join(`, `)}]`).join(`, `)}]\`\n- 右视图（每层最后一个）：\`[${s.join(`, `)}]\`\n\n**每个节点恰好入队一次、出队一次**，所以整个遍历是线性时间；队列里最多压着一层多的节点（最宽的那层 + 它的孩子），空间是 \`O(n)\`。`,{levelIndex:d,done:!0,levelValues:o[o.length-1]??[]}),c}var qa=`lvo-styles`,Ja=22,Ya=84,Xa=66,Za=56,Qa=54,$a=40,eo=110,to=30,no=1150,ro=`
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
`;function io(){if(X(),document.getElementById(qa))return;let e=document.createElement(`style`);e.id=qa,e.textContent=ro,document.head.appendChild(e)}function ao(e,t={}){if(!e||e.dataset.lvoMounted===`1`)return{destroy(){}};e.dataset.lvoMounted=`1`,io();let n=Ka(t),r=t.autoplay!==!1,{nodes:i,root:a}=Ga(Array.isArray(t.values)?t.values:[3,9,20,null,null,15,7]),o=e=>i[e].value,s=i.reduce((e,t)=>Math.max(e,t.depth),0),c=new Map;c.set(a,[]);for(let e of i)e.parent!==-1&&c.set(e.id,[...c.get(e.parent)??[],e.side]);let l=e=>56*2**Math.max(0,s-e),u=e=>{let t=0;for(let n of c.get(e.id)??[])t=t*2+ +(n===`R`);return(t+.5)*l(e.depth)},d=2**s*56,f=Math.max(620,96+d+80),p=(f-d)/2,m=Xa+s*Ya+Ja+Za,h=m+81+34,g=h+Math.max(1,s+1)*22+18,_=e=>{let t=i[e];return{x:p+u(t),y:Xa+t.depth*Ya}},v=e=>Xa+e*Ya,y=Math.max(1,...n.map(e=>e.queue.length),...n.map(e=>e.queue.length+e.enqueued.length)),b=e=>eo+e*64,x=document.createElement(`div`);x.className=`viz lvo`;let S=document.createElement(`div`);S.className=`viz__stage`,x.appendChild(S);let C=Y(`svg`,{class:`viz__svg lvo__svg`,viewBox:`0 0 ${f} ${g}`,role:`img`,"aria-label":`层序遍历推演动画`});if(S.appendChild(C),a===-1){let t=Y(`text`,{class:`lvo-empty__text`,x:f/2,y:g/2});return t.textContent=`空树 —— 直接返回 []`,C.appendChild(t),x.appendChild(w()),x.appendChild(Q().root),e.textContent=``,e.appendChild(x),{destroy(){e.textContent=``,delete e.dataset.lvoMounted,document.getElementById(qa)?.remove()}}}function w(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let T=[];for(let e=0;e<=s;e+=1){let t=v(e),n=Y(`line`,{class:`lvo-layer__line`,x1:62,y1:t,x2:p+d+14,y2:t}),r=Y(`text`,{class:`lvo-layer__text`,x:56,y:t});r.textContent=`第 ${e} 层`,C.append(n,r),T.push({line:n,t:r})}let E=Y(`g`,{class:`lvo-edges`});C.appendChild(E);for(let e of i)for(let t of[e.left,e.right]){if(t==null)continue;let n=_(e.id),r=_(t),i=Y(`line`,{class:`lvo-edge__line`,x1:n.x,y1:n.y+Ja,x2:r.x,y2:r.y-Ja});E.appendChild(i)}let D=new Map;for(let e of i){let t=_(e.id),n=Y(`g`,{class:`lvo-node`});n.setAttribute(`transform`,`translate(${t.x} ${t.y})`),n.appendChild(Y(`circle`,{class:`lvo-node__circle`,cx:0,cy:0,r:Ja}));let r=Y(`text`,{class:`lvo-node__value`,x:0,y:0});r.textContent=String(e.value),n.appendChild(r),C.appendChild(n),D.set(e.id,n)}let O=Y(`text`,{class:`lvo-q__label`,x:to,y:m+5});O.textContent=`queue`,C.appendChild(O);let k=[];for(let e=0;e<y;e+=1){let t=Y(`g`,{class:`lvo-q__cell-g`});t.setAttribute(`transform`,`translate(${b(e)} ${m-$a/2})`);let n=Y(`rect`,{class:`lvo-q__cell`,x:0,y:0,width:Qa,height:$a,rx:8}),r=Y(`text`,{class:`lvo-q__value`,x:Qa/2,y:$a/2});t.append(n,r),C.appendChild(t),k.push({g:t,rect:n,t:r})}let A=Y(`line`,{class:`lvo-q__headline`}),j=Y(`text`,{class:`lvo-q__head`});j.textContent=`head`,C.append(A,j);let M=Y(`g`,{class:`lvo-brace`}),N=Y(`path`,{class:`lvo-brace__line`}),P=Y(`text`,{class:`lvo-brace__text`});M.append(N,P),C.appendChild(M);let F=Y(`text`,{class:`lvo-res__title`,x:to,y:h});F.textContent=`res`,C.appendChild(F);let I=[];for(let e=0;e<Math.max(1,s+1);e+=1){let t=Y(`text`,{class:`lvo-res__text`,x:eo,y:h+e*22});C.appendChild(t),I.push(t)}let L=w();x.appendChild(L);let R=Q();x.appendChild(R.root),e.textContent=``,e.appendChild(x);let z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;function B(e,t){let n=new Set(t.queue),r=new Set(t.enqueued),a=Math.max(0,t.levelSize-t.consumed);for(let[e,a]of D){let o=i[e],s=t.current===e,c=r.has(e),l=t.levelIndex>=0&&o.depth<t.levelIndex&&!s,u=t.levelIndex>=0&&o.depth===t.levelIndex&&n.has(e)&&!c&&!s;a.classList.toggle(`is-done`,l),a.classList.toggle(`is-current`,s),a.classList.toggle(`is-pending`,u),a.classList.toggle(`is-fresh`,c)}if(T.forEach(({line:e,t:n},r)=>{let i=r===t.levelIndex;e.classList.toggle(`is-active`,i),n.classList.toggle(`is-active`,i)}),k.forEach((e,n)=>{let i=t.queue[n];if(i===void 0){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`,e.t.textContent=String(o(i));let s=r.has(i),c=t.levelIndex>=0&&t.phase!==`init`,l=c&&!s&&n>=a;e.rect.setAttribute(`class`,`lvo-q__cell${s?` is-fresh`:c?` is-layer`:``}${l?` is-out`:``}`),e.t.setAttribute(`class`,`lvo-q__value${s||c?` is-layer`:``}${l?` is-out`:``}`)}),t.queue.length){let e=b(0)+Qa/2;A.setAttribute(`x1`,e),A.setAttribute(`x2`,e),A.setAttribute(`y1`,m+34),A.setAttribute(`y2`,m+42),j.setAttribute(`x`,e),j.setAttribute(`y`,m+48),A.style.opacity=`1`,j.style.opacity=`1`}else A.style.opacity=`0`,j.style.opacity=`0`;if(t.levelIndex>=0&&t.levelSize>0&&t.phase!==`init`){let e=b(0)-5,n=b(t.levelSize-1)+Qa+5,r=m+68;N.setAttribute(`d`,`M ${e} ${r-7} L ${e} ${r} L ${n} ${r} L ${n} ${r-7}`),P.setAttribute(`x`,(e+n)/2),P.setAttribute(`y`,m+81),P.textContent=`这一层 size = ${t.levelSize}`,M.classList.add(`is-on`)}else M.classList.remove(`is-on`);I.forEach((e,n)=>{let r=t.results[n];if(!r){e.textContent=``,e.setAttribute(`class`,`lvo-res__text`);return}e.textContent=`[${r.join(`, `)}]`;let i=n===t.levelIndex&&t.phase===`close`;e.setAttribute(`class`,`lvo-res__text${i?` is-done`:` is-active`}`)}),Z(L,t.desc)}let V=$({steps:n,controls:R,intervalMs:no,onRender:B});V.jumpTo(Math.trunc(t.initialStep)||0);let H=null;return r&&!z&&typeof IntersectionObserver==`function`&&(H=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){H.disconnect(),H=null,V.play();return}},{threshold:.35}),H.observe(x)),{destroy(){H&&=(H.disconnect(),null),V.destroy(),e.textContent=``,delete e.dataset.lvoMounted,document.getElementById(qa)?.remove()}}}function oo(e={}){let{nodes:t,root:n}=Ga(Array.isArray(e.values)?e.values:[3,5,1,6,2,0,8,null,null,7,4]);if(n===-1)return[{phase:`done`,desc:"**空树**，直接返回 `null`。",stack:[],current:null,returning:null,returnSource:`null`,memo:{},leftOf:{},rightOf:{},depth:-1,maxDepth:0,found:[],answer:null,done:!0}];let r=e=>e==null?null:t[e].value,i=new Map;for(let e of t)i.set(e.value,e.id);let a=e.p===void 0||e.p===null?i.get(6):i.get(e.p),o=e.q===void 0||e.q===null?i.get(4):i.get(e.q),s=Number.isInteger(e.maxFrames)?e.maxFrames:400,c=[],l={},u={},d={},f=[],p=null,m=0,h=0,g=e=>{if(e==null)return`null`;let t=r(e);return e===a?`${t}（p）`:e===o?`${t}（q）`:String(t)},_=e=>e==null?"`null`（这棵子树里一个都没找到）":e===a?`\`${r(e)}\` —— **这是 p 本身，向上当成"p 在这里"的标记**（它不是答案，只是信使）`:e===o?`\`${r(e)}\` —— **这是 q 本身，向上当成"q 在这里"的标记**`:`\`${r(e)}\` —— **这就是答案（LCA），继续向上冒就行了**`,v=(e,t,n={})=>{c.push({phase:e,desc:t,stack:y.map(e=>({id:e.id,stage:e.stage})),current:null,returning:null,returnSource:`null`,memo:{...l},leftOf:{...u},rightOf:{...d},depth:y.length-1,maxDepth:m,found:[...f],answer:p,done:e===`done`,...n})},y=[];for(v(`init`,`要找 \`${g(a)}\` 和 \`${g(o)}\` 的最近公共祖先。**用一个显式栈模拟递归**：每次调用 \`dfs(node)\` 就压栈，返回就出栈。栈底是根 \`${r(n)}\`，栈越深说明递归钻得越深。`,{current:n}),y.push({id:n,stage:`enter`,from:null});y.length>0&&(h+=1,!(h>s));){let e=y[y.length-1],n=t[e.id];if(m=Math.max(m,y.length-1),e.stage===`enter`){if(e.id===a||e.id===o){let t=e.id===a;l[e.id]=e.id,f.includes(e.id)||f.push(e.id),v(`hit`,`进入 \`${g(e.id)}\` —— **命中！**这就是 \`node is p or node is q\` 那一行。**命中就立刻返回，不再往下探它的子树**：如果另一个目标在它的子树里，那它自己就是答案（"一个节点也可以是它自己的祖先"）；如果不在，它也只是个"我在这儿"的标记。两种情况都只需要把**它自己**往上报。`,{current:e.id,returning:e.id,returnSource:t?`p`:`q`});let n=e.id;y.pop(),S(e,n);continue}if(n.left===null&&n.right===null){l[e.id]=null,v(`return`,`进入 \`${r(e.id)}\` —— **叶子节点，而且不是 p 也不是 q**。它的子树是空的，一个目标都没有，所以向父节点汇报 \`null\`。`,{current:e.id,returning:null,returnSource:`null`}),y.pop(),S(e,null);continue}if(n.left!==null){v(`recurse`,`进入 \`${r(e.id)}\` —— 它不是 p 也不是 q，**不能立刻下结论**，必须先把左右两棵子树都问一遍（这就是"后序"的含义）。先向左子树 \`${r(n.left)}\` 递归。`,{current:e.id}),e.stage=`left`,y.push({id:n.left,stage:`enter`,from:`L`});continue}v(`recurse`,`进入 \`${r(e.id)}\` —— 它不是 p 也不是 q，**必须先问子树**。它没有左孩子，直接转向右子树 \`${r(n.right)}\` 递归。`,{current:e.id}),u[e.id]=null,e.stage=`right`,y.push({id:n.right,stage:`enter`,from:`R`});continue}if(e.stage===`left`){if(n.right!==null){v(`recurse`,`\`${r(e.id)}\` 的左子树回来了，返回值是 ${_(u[e.id])}。**先把它记在手边，接着向右子树 \`${r(n.right)}\` 递归** —— 两边都问完，才能判断自己是不是那个分叉点。`,{current:e.id,returning:u[e.id]}),e.stage=`right`,y.push({id:n.right,stage:`enter`,from:`R`});continue}d[e.id]=null,e.stage=`decide`;continue}if(e.stage===`right`){e.stage=`decide`;continue}let i=u[e.id]===void 0?null:u[e.id],s=d[e.id]===void 0?null:d[e.id];v(`collect`,`\`${r(e.id)}\` 的左右子树都回来了：左 = ${_(i)}，右 = ${_(s)}。**现在到做判断的时候了。**`,{current:e.id});let c;if(i!==null&&s!==null)c=e.id,l[e.id]=e.id,p===null&&(p=e.id),v(`decide`,`**左右都非空 —— 两个目标刚好在 \`${r(e.id)}\` 这里分叉！**这是全树唯一一个"左边有一个、右边有一个"的节点，所以它就是最近公共祖先：返回自己 \`${r(e.id)}\`。（再往上的祖先虽然也同时包含 p 和 q，但都不是"最近"的了。）`,{current:e.id,returning:e.id,returnSource:`lca`});else if(i!==null||s!==null){c=i===null?s:i,l[e.id]=c;let t=p!==null&&c===p;v(`decide`,t?`只有一个非空（${i===null?`右`:`左`}边是 ${_(c)}），**这就是已经确定的答案，继续往上冒**。\`${r(e.id)}\` 只是路过，它虽然也同时是 p 和 q 的祖先，但不是"最近"的那个。`:`只有一个非空（${i===null?`右`:`左`}边是 ${_(c)}），说明两个目标**都在同一侧子树里**，\`${r(e.id)}\` 不是分叉点。如实把这唯一的返回值往上报 —— 这里**不改变它**，只负责传递。`,{current:e.id,returning:c,returnSource:t?`lca`:c===a?`p`:`q`})}else c=null,l[e.id]=null,v(`decide`,'左右都是 `null` —— 这棵子树里 p 和 q 一个都没有，向上汇报 `null`。父节点收到它，等于"这条分支可以忽略了"。',{current:e.id,returning:null,returnSource:`null`});y.pop(),S(e,c)}let b=l[n];p===null&&b!=null&&(p=b);let x=p===null?n:p;v(`done`,p===null?`递归结束，栈空了。**返回值一路冒到根，但没有任何节点出现"左右都非空"** —— 说明 p 和 q 不在一棵树上（在本题约束下不会发生）。`:`递归结束，栈空了。最终从根 \`${r(n)}\` 冒出来的返回值是 \`${r(x)}\`，它就是 \`${g(a)}\` 和 \`${g(o)}\` 的**最近公共祖先**。`,{current:x,returning:x,returnSource:`lca`,done:!0});function S(e,t){if(e.from===null)return;let n=y[y.length-1];n&&(e.from===`L`?u[n.id]=t:d[n.id]=t)}return c}var so=`lca-styles`,co=24,lo=82,uo=62,fo=58,po=26,mo=44,ho=30,go=214,_o=1250,vo=`
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
`;function yo(){if(document.getElementById(so))return;let e=document.createElement(`style`);e.id=so,e.textContent=vo,document.head.appendChild(e)}function bo(e,t={}){if(!e||e.dataset.lcaMounted===`1`)return{destroy(){}};e.dataset.lcaMounted=`1`,yo();let n=oo(t),r=t.autoplay!==!1,{nodes:i,root:a}=Ga(Array.isArray(t.values)?t.values:[3,5,1,6,2,0,8,null,null,7,4]),o=e=>e==null||!i[e]?null:i[e].value,s=Y,c=document.createElement(`div`);c.className=`viz lca`;let l=document.createElement(`div`);if(l.className=`viz__stage`,c.appendChild(l),a===-1){let t=s(`svg`,{class:`viz__svg lca__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`lca-empty__text`,x:620/2,y:120/2});return n.textContent=`空树 —— 直接返回 null`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),{destroy(){e.textContent=``,delete e.dataset.lcaMounted,document.getElementById(so)?.remove()}}}function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let d=i.reduce((e,t)=>Math.max(e,t.depth),0),f=new Map;f.set(a,[]);for(let e of i)e.parent!==-1&&f.set(e.id,[...f.get(e.parent)??[],e.side]);let p=e=>fo*2**Math.max(0,d-e),m=e=>{let t=0;for(let n of f.get(e.id)??[])t=t*2+ +(n===`R`);return(t+.5)*p(e.depth)},h=2**d*fo,g=Math.max(660,po+h+68),_=(g-h)/2,v=e=>uo+e*lo,y=e=>({x:_+m(i[e]),y:v(i[e].depth)}),b=uo+d*lo+co,x=Math.max(1,...n.map(e=>e.stack.length)),S=b+mo,C=S+x*40,w=C+22,T=w+34+26,E=po,D=go,O=s(`svg`,{class:`viz__svg lca__svg`,viewBox:`0 0 ${g} ${T}`,role:`img`,"aria-label":`最近公共祖先推演动画`});l.appendChild(O);let k=new Map;for(let e of i){if(e.parent===-1)continue;let t=y(e.parent),n=y(e.id),r=s(`path`,{class:`lca-edge`,d:`M ${t.x} ${t.y+co} L ${n.x} ${n.y-co}`});O.appendChild(r),k.set(e.id,r)}let A=[];for(let e of i){let t=y(e.id),n=s(`g`,{class:`lca-node`,transform:`translate(${t.x} ${t.y})`});n.appendChild(s(`circle`,{class:`lca-node__ring`,r:31})),n.appendChild(s(`circle`,{class:`lca-node__circle`,cx:0,cy:0,r:co}));let r=s(`text`,{class:`lca-node__value`,x:0,y:0});r.textContent=String(e.value),n.appendChild(r);let i=s(`g`,{class:`lca-node__retg`});i.appendChild(s(`rect`,{class:`lca-node__ret`,x:-26,y:-48,width:52,height:20,rx:6}));let a=s(`text`,{class:`lca-node__ret-text`,x:0,y:-38});i.appendChild(a),n.appendChild(i);let o=s(`text`,{class:`lca-node__tag`,x:0,y:39});n.appendChild(o),O.appendChild(n),A.push({g:n,retG:i,rt:a,tag:o,id:e.id})}let j=s(`text`,{class:`lca-stack__title`,x:E,y:S-12});j.textContent=`调用栈（栈底在下）`,O.appendChild(j);let M=[];for(let e=0;e<x;e+=1){let t=s(`g`,{class:`lca-frame`,transform:`translate(${E} ${C-(e+1)*40})`});t.appendChild(s(`rect`,{class:`lca-frame__box`,x:0,y:0,width:D,height:ho,rx:7}));let n=s(`text`,{class:`lca-frame__text`,x:12,y:ho/2});t.appendChild(n),O.appendChild(t),M.push({g:t,t:n})}let N=s(`rect`,{class:`lca-flow__box`,x:E,y:w,width:Math.min(560,g-E-24),height:34,rx:8});O.appendChild(N);let P=s(`text`,{class:`lca-flow__text`,x:E+Math.min(560,g-E-24)/2,y:w+34/2});O.appendChild(P);let F=u(),I=(e,t)=>Object.prototype.hasOwnProperty.call(e.memo,t);function L(e,t){if(!t)return;let n=t.stack.length?t.stack[t.stack.length-1].id:null;t.current;let r=new Set(t.stack.map(e=>e.id));for(let e of A){let{id:r,g:i,retG:a,rt:s,tag:c}=e,l=[`lca-node`];Array.isArray(t.found)&&t.found.includes(r)&&l.push(`is-target`);let u=I(t,r),d=u?t.memo[r]:void 0;u&&d===null?l.push(`is-prune`):u&&d!==null&&l.push(`is-found`),r===n&&l.push(`is-visit`),r===t.answer&&l.push(`is-answer`),i.setAttribute(`class`,l.join(` `)),u?(a.style.opacity=`1`,s.textContent=d===null?`null`:`${o(d)}`,s.setAttribute(`class`,`lca-node__ret-text`)):a.style.opacity=`0`;let f=r===t.pId,p=r===t.qId;c.textContent=f&&p?`=p=q`:f?`p`:p?`q`:``,c.style.opacity=f||p?`1`:`0`}for(let e of i){if(e.parent===-1)continue;let n=k.get(e.id),i=[`lca-edge`];r.has(e.id)&&r.has(e.parent)&&i.push(`is-active`),I(t,e.id)&&t.memo[e.id]===null&&i.push(`is-prune`),n.setAttribute(`class`,i.join(` `))}if(M.forEach((e,n)=>{let r=t.stack[n];if(!r){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`;let i=n===t.stack.length-1;e.g.setAttribute(`class`,`lca-frame${i?` is-top`:``}`);let a=r.stage===`enter`?`刚进入`:r.stage===`left`?`等右子树`:r.stage===`right`?`等返回值`:`做判断`;e.t.textContent=`${n} · dfs(${o(r.id)}) · ${a}`}),t.phase===`hit`||t.phase===`decide`||t.phase===`return`||t.phase===`done`){N.style.opacity=`1`,P.style.opacity=`1`;let e=t.returning;t.returnSource===`null`?P.textContent=t.phase===`done`?`递归结束：返回 null`:`返回 null（子树里什么都没找到）`:t.phase===`done`?P.textContent=`最终答案：${o(e)}`:t.returnSource===`lca`?P.textContent=`返回自己 ${o(e)}（这里就是分叉点）`:P.textContent=`向上返回 ${o(e)}（标记：${t.returnSource} 在这里）`}else N.style.opacity=`0.25`,P.style.opacity=`0.35`,P.textContent=`（这一帧还没有返回值）`;Z(F,t.desc)}c.appendChild(F);let R=Q();c.appendChild(R.root);let z=new Map;for(let e of i)z.set(e.value,e.id);let B=t.p===void 0||t.p===null?6:t.p,V=t.q===void 0||t.q===null?4:t.q,H=z.get(B),U=z.get(V),ee=n.map(e=>({...e,pId:H,qId:U}));e.textContent=``,e.appendChild(c),X();let W=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,G=$({steps:ee,controls:R,intervalMs:_o,onRender:L});G.jumpTo(Math.trunc(t.initialStep)||0);let K=null;return r&&!W&&typeof IntersectionObserver==`function`&&(K=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){K.disconnect(),K=null,G.play();return}},{threshold:.35}),K.observe(c)),{destroy(){K&&=(K.disconnect(),null),G.destroy(),e.textContent=``,delete e.dataset.lcaMounted,document.getElementById(so)?.remove()}}}function xo(e={}){let{nodes:t,root:n}=Ga(Array.isArray(e.values)?e.values:[-10,9,20,null,null,15,7]);if(n===-1)return[{phase:`done`,desc:`**空树** —— 题目保证路径至少包含一个节点，空树不在输入范围内。`,stack:[],current:null,leftGain:null,rightGain:null,rawLeft:null,rawRight:null,through:null,gain:null,gainOf:{},best:-1/0,bestNode:null,bestPath:[],depth:-1,maxDepth:0,pruned:[],done:!0}];let r=e=>e==null||t[e]===void 0?null:t[e].value,i=Number.isInteger(e.maxFrames)?e.maxFrames:400,a=[],o={},s={},c=[],l=-1/0,u=null,d=[],f=0,p=0,m=e=>{let n=e=>{let n=[],r=e;for(;r!=null&&t[r]!==void 0;){n.push(r);let e=t[r],i=e.left===null?null:s[e.left]??null,a=e.right===null?null:s[e.right]??null,o=i!==null&&i>0,c=a!==null&&a>0;if(!o&&!c)break;r=o&&c?i>=a?e.left:e.right:o?e.left:e.right}return n},r=t[e];if(!r)return[];let i=r.left===null||!((s[r.left]??0)>0)?[]:n(r.left),a=r.right===null||!((s[r.right]??0)>0)?[]:n(r.right);return[...i.reverse(),e,...a]},h=(e,t,n={})=>{a.push({phase:e,desc:t,stack:g.map(e=>({id:e.id,stage:e.stage})),current:null,leftGain:null,rightGain:null,rawLeft:null,rawRight:null,through:null,gain:null,gainOf:{...o},best:l,bestNode:u,bestPath:[...d],depth:g.length-1,maxDepth:f,pruned:[...c],done:e===`done`,...n})},g=[];for(h(`init`,`要找**最大路径和**。关键是要同时算两个不同的东西：① **向上汇报的单边贡献值** \`gain = val + max(左, 右)\`（一条胳膊，给父节点继续接）；② **以本节点为拱顶的完整路径** \`through = val + 左 + 右\`（两条胳膊，到此为止）来更新全局最优。**路径不能拐两次弯**，所以向上汇报时只能选一条胳膊 —— 这是本题全部难度的来源。另外 \`max(gain, 0)\` 会剪掉负贡献：负的胳膊接进来只会让和变小。栈底是根 \`${r(n)}\`。`,{current:n}),g.push({id:n,stage:`enter`,from:null});g.length>0&&(p+=1,!(p>i));){let e=g[g.length-1],n=t[e.id];if(f=Math.max(f,g.length-1),e.stage===`enter`){if(n.left===null&&n.right===null){o[e.id]=n.value,s[e.id]=n.value;let t=n.value,i=!1;t>l&&(l=t,u=e.id,d=m(e.id),i=!0),h(i?`update`:`leaf`,`进入 \`${r(e.id)}\` —— **叶子节点**，左右子树都不存在，两边贡献都是 \`0\`。所以以它为拱顶的路径和就是它自己：\`${t}\`；向上汇报的贡献值也是 \`${t}\`。`+(i?`**刷新了全局最优** → \`best = ${l}\`。`:`没超过当前的 \`best = ${l}\`，保持不动。`),{current:e.id,leftGain:0,rightGain:0,rawLeft:null,rawRight:null,through:t,gain:t}),g.pop();continue}if(n.left!==null){h(`recurse`,`进入 \`${r(e.id)}\` —— 它 **不能立刻下结论**：拱顶路径和要用到左右两边的贡献，所以必须**先把两棵子树都问一遍**（后序）。先向左子树 \`${r(n.left)}\` 递归。`,{current:e.id}),e.stage=`left`,g.push({id:n.left,stage:`enter`,from:`L`});continue}h(`recurse`,`进入 \`${r(e.id)}\` —— 它没有左孩子（左边贡献直接记 \`0\`），直接向右子树 \`${r(n.right)}\` 递归。`,{current:e.id}),e.stage=`right`,g.push({id:n.right,stage:`enter`,from:`R`});continue}if(e.stage===`left`){if(n.right!==null){let t=s[n.left],i=Math.max(t,0);h(`recurse`,`\`${r(e.id)}\` 的左子树回来了，原始返回值是 \`${t}\`。`+(t<0?`**它是负的 —— 剪掉！** \`max(${t}, 0) = 0\`，意思就是"这条路走进去只会更小，干脆不进去"。`:`它是非负的，保留：\`max(${t}, 0) = ${i}\`。`)+` 把左贡献 \`${i}\` 记在手边，接着向右子树 \`${r(n.right)}\` 递归。`,{current:e.id,leftGain:i,rawLeft:t}),e.stage=`right`,g.push({id:n.right,stage:`enter`,from:`R`});continue}e.stage=`decide`;continue}if(e.stage===`right`){e.stage=`decide`;continue}let i=n.left===null?null:s[n.left],a=n.right===null?null:s[n.right],p=Math.max(i===null?0:i,0),_=Math.max(a===null?0:a,0);h(`collect`,`\`${r(e.id)}\` 的左右子树都回来了：左 = \`${i===null?`（无）`:i}\` → 取 \`max(·, 0) = ${p}\`，右 = \`${a===null?`（无）`:a}\` → 取 \`max(·, 0) = ${_}\`。**现在要同时算两个量，别搞混。**`,{current:e.id,leftGain:p,rightGain:_,rawLeft:i,rawRight:a});let v=n.value+p+_,y=n.value+Math.max(p,_);o[e.id]=y,s[e.id]=y,i!==null&&i<0&&n.left!==null&&!c.includes(n.left)&&c.push(n.left),a!==null&&a<0&&n.right!==null&&!c.includes(n.right)&&c.push(n.right);let b=v>l;b&&(l=v,u=e.id,d=m(e.id));let x=i!==null&&i<0&&a!==null&&a<0?`两条胳膊都是负的、全被剪了`:i!==null&&i<0?`左胳膊是负的被剪了`:a!==null&&a<0?`右胳膊是负的被剪了`:`两条胳膊都留着`;h(b?`update`:`decide`,`**算拱顶路径（可以拐弯，两条胳膊都用）**：\`${r(e.id)} + ${p} + ${_} = ${v}\`（${x}）。`+(b?` **刷新了全局最优！** \`best\` 从 \`${l===v?`（旧值更小）`:``}\`更新为 \`${v}\` —— 这条路径以 \`${r(e.id)}\` 为最高点，不再往上接。`:` 没超过当前的 \`best = ${l}\`，保持不动。`)+` 同时**算向上汇报的贡献值（只能选一条胳膊）**：\`${r(e.id)} + max(${p}, ${_}) = ${y}\` —— 这个值交给父节点，父节点会在它那里再拐一次弯；如果这里两条胳膊都用掉，父节点再拐就**拐两次弯**了，不是一条路径。`,{current:e.id,leftGain:p,rightGain:_,rawLeft:i,rawRight:a,through:v,gain:y}),g.pop()}return h(`done`,`递归结束，栈空了。全局最优 **\`best = ${l}\`**，对应的路径以 \`${r(u)}\` 为最高点：\`${d.map(e=>r(e)).join(` → `)}\`。注意**它完全不经过根 \`${r(n)}\`** —— 题目说"路径不一定经过根节点"，而这棵树的根是 \`${r(n)}\`（负数），把根接进来只会让和变小，所以递归时根的 \`through\` 反而不是最大的。`+(l<0?" 另外 `best` 是负数 —— 说明全树都是负值，此时答案就是**最大的那个单节点**（路径至少含一个节点，不能返回空路径 0）。":``),{current:u,returnSource:`best`,through:l,gain:o[u],done:!0}),a}var So=`mps-styles`,Co=24,wo=96,To=76,Eo=58,Do=26,Oo=40,ko=46,Ao=1250,jo=`
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
`;function Mo(){if(document.getElementById(So))return;let e=document.createElement(`style`);e.id=So,e.textContent=jo,document.head.appendChild(e)}function No(e,t={}){if(!e||e.dataset.mpsMounted===`1`)return{destroy(){}};e.dataset.mpsMounted=`1`,Mo();let n=xo(t),r=t.autoplay!==!1,{nodes:i,root:a}=Ga(Array.isArray(t.values)?t.values:[-10,9,20,null,null,15,7]),o=e=>e==null||!i[e]?null:i[e].value,s=Y,c=document.createElement(`div`);c.className=`viz mps`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(a===-1){let t=s(`svg`,{class:`viz__svg mps__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`mps-empty__text`,x:620/2,y:120/2});return n.textContent=`空树 —— 没有节点，路径和按 0 处理（LeetCode 保证至少一个节点）`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),{destroy(){e.textContent=``,delete e.dataset.mpsMounted,document.getElementById(So)?.remove()}}}let d=i.reduce((e,t)=>Math.max(e,t.depth),0),f=new Map;f.set(a,[]);for(let e of i)e.parent!==-1&&f.set(e.id,[...f.get(e.parent)??[],e.side]);let p=e=>Eo*2**Math.max(0,d-e),m=e=>{let t=0;for(let n of f.get(e.id)??[])t=t*2+ +(n===`R`);return(t+.5)*p(e.depth)},h=2**d*Eo,g=Math.max(660,Do+h+68),_=(g-h)/2,v=e=>To+e*wo,y=e=>({x:_+m(i[e]),y:v(i[e].depth)}),b=To+d*wo+Co+Oo,x=Math.min(600,g-Do*2),S=s(`svg`,{class:`viz__svg mps__svg`,viewBox:`0 0 ${g} ${b+ko+26}`,role:`img`,"aria-label":`二叉树最大路径和推演动画`});l.appendChild(S);let C=s(`g`,{class:`mps-edges`}),w=s(`g`,{class:`mps-nodes`}),T=s(`g`,{class:`mps-labels`});S.appendChild(C),S.appendChild(w),S.appendChild(T);let E=new Map;for(let e of i){if(e.parent===-1)continue;let t=y(e.parent),n=y(e.id),r=s(`path`,{class:`mps-edge`,d:`M ${t.x} ${t.y+Co} L ${n.x} ${n.y-Co}`});C.appendChild(r),E.set(e.id,r)}let D=e=>{if(e.parent===-1)return 0;let t=e.side===`L`?i[e.parent].right:i[e.parent].left;if(t==null)return 0;let n=Math.abs(y(e.id).x-y(t).x);if(n>=76)return 0;let r=(76-n)/2+4;return e.side===`L`?-r:r},O=[];for(let e of i){let t=y(e.id),n=s(`g`,{class:`mps-node`,transform:`translate(${t.x} ${t.y})`});n.appendChild(s(`circle`,{class:`mps-node__ring`,r:31})),n.appendChild(s(`circle`,{class:`mps-node__circle`,cx:0,cy:0,r:Co}));let r=s(`text`,{class:`mps-node__value`,x:0,y:0});r.textContent=String(e.value),n.appendChild(r),w.appendChild(n);let i=s(`g`,{class:`mps-node__gaing`,transform:`translate(${t.x+D(e)} ${t.y})`});i.appendChild(s(`rect`,{class:`mps-node__gain`,x:-32,y:-57,width:64,height:22,rx:7}));let a=s(`text`,{class:`mps-node__gain-text`,x:0,y:-46});i.appendChild(a),T.appendChild(i),O.push({g:n,gainG:i,gt:a,id:e.id})}let k=s(`g`,{class:`mps-banner`});k.appendChild(s(`rect`,{class:`mps-banner__box`,x:Do,y:b,width:x,height:ko,rx:9}));let A=s(`text`,{class:`mps-banner__label`,x:42,y:b+ko/2});A.textContent=`当前最优路径和`,k.appendChild(A);let j=s(`text`,{class:`mps-banner__value`,x:162,y:b+ko/2});k.appendChild(j);let M=s(`text`,{class:`mps-banner__path`,x:Do+x-16,y:b+ko/2});k.appendChild(M),S.appendChild(k);let N=u();function P(e,t){if(!t)return;let n=t.stack.length?t.stack[t.stack.length-1].id:null,r=new Set(t.bestPath??[]),a=new Set(t.pruned??[]),s=e=>Object.prototype.hasOwnProperty.call(t.gainOf,e);for(let e of O){let{id:i,g:o,gainG:c,gt:l}=e,u=[`mps-node`],d=s(i),f=d?t.gainOf[i]:null;d&&u.push(f>0?`is-plus`:`is-zero`),a.has(i)&&u.push(`is-zero`),i===n&&u.push(`is-visit`),r.has(i)&&u.push(`is-onpath`),i===t.bestNode&&u.push(`is-apex`),o.setAttribute(`class`,u.join(` `)),d?(c.style.opacity=`1`,l.textContent=`gain ${f}`):c.style.opacity=`0`}for(let e of i){if(e.parent===-1)continue;let n=E.get(e.id),i=[`mps-edge`];r.has(e.id)&&r.has(e.parent)&&i.push(`is-onpath`),s(e.id)&&t.gainOf[e.id]<=0&&i.push(`is-prune`),n.setAttribute(`class`,i.join(` `))}t.bestNode===null||!(t.bestPath??[]).length?(j.textContent=`—`,M.textContent=`还没算完任何一条路径`):(j.textContent=String(t.best),M.textContent=(t.bestPath??[]).map(e=>o(e)).join(` → `)),Z(N,t.desc)}c.appendChild(N);let F=Q();c.appendChild(F.root),e.textContent=``,e.appendChild(c),X();let I=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,L=$({steps:n,controls:F,intervalMs:Ao,onRender:P});L.jumpTo(Math.trunc(t.initialStep)||0);let R=null;return r&&!I&&typeof IntersectionObserver==`function`&&(R=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){R.disconnect(),R=null,L.play();return}},{threshold:.35}),R.observe(c)),{destroy(){R&&=(R.disconnect(),null),L.destroy(),e.textContent=``,delete e.dataset.mpsMounted,document.getElementById(So)?.remove()}}}function Po(e={}){let{nodes:t,root:n}=Ga(Array.isArray(e.values)?e.values:[3,9,20,null,null,15,7]);if(n===-1)return[{phase:`done`,desc:"**空树** —— 深度记 `0`。这是递归的出口条件，也是整道题的基线。",stack:[],current:null,leftH:null,rightH:null,height:null,heightOf:{},answer:0,depth:-1,maxDepthSeen:0,done:!0}];let r=e=>e==null||t[e]===void 0?null:t[e].value,i=Number.isInteger(e.maxFrames)?e.maxFrames:400,a=[],o={},s=null,c=0,l=0,u=[],d=(e,t,n={})=>{a.push({phase:e,desc:t,stack:u.map(e=>({id:e.id,stage:e.stage})),current:null,leftH:null,rightH:null,height:null,heightOf:{...o},answer:s,depth:u.length-1,maxDepthSeen:c,done:e===`done`,...n})};for(d(`init`,`要求**最大深度**，也就是"从根往下最多能走几层"。做法是**后序递归**：每个节点先问出左右子树各自的高度，再取较大的那个、**加 1**（加的这个 1 就是自己这一层）。注意那个 \`1\` 不能少 —— 它代表的正是"把自己算进去"。栈底是根 \`${r(n)}\`。`,{current:n}),u.push({id:n,stage:`enter`});u.length>0&&(l+=1,!(l>i));){let e=u[u.length-1],i=t[e.id];if(c=Math.max(c,u.length-1),e.stage===`enter`){if(i.left===null&&i.right===null){o[e.id]=1,e.id===n&&(s=1),d(`leaf`,`进入 \`${r(e.id)}\` —— **叶子节点**，左右子树都不存在。按定义空子树高度是 \`0\`，所以它自己的高度 = \`1 + max(0, 0) = 1\`。**叶子是整条递归链的起点** —— 高度就是从这里开始一层层往上冒的。`,{current:e.id,leftH:0,rightH:0,height:1}),u.pop();continue}let t=i.left!==null;d(`recurse`,`进入 \`${r(e.id)}\` —— 它 **还不能下结论**：自己的高度取决于子树的高度，所以必须**先下去问**。`+(t?`先向左子树 \`${r(i.left)}\` 递归。`:`它没有左孩子（左边高度直接记 \`0\`），直接向右子树 \`${r(i.right)}\` 递归。`),{current:e.id}),e.stage=t?`left`:`right`,u.push({id:t?i.left:i.right,stage:`enter`});continue}if(e.stage===`left`){if(i.right!==null){let t=o[i.left];d(`recurse`,`左子树 \`${r(i.left)}\` 回来了，报告高度 **\`${t}\`**。先把它记在手边，接着向右子树 \`${r(i.right)}\` 递归 —— **还没到算自己高度的时候**，因为 \`max\` 要两个数都拿到才敢取。`,{current:e.id,leftH:t}),e.stage=`right`,u.push({id:i.right,stage:`enter`});continue}e.stage=`decide`;continue}if(e.stage===`right`){e.stage=`decide`;continue}let a=i.left===null?0:o[i.left],l=i.right===null?0:o[i.right],f=1+Math.max(a,l);o[e.id]=f;let p=e.id===n;p&&(s=f);let m=a===l?`两边一样高，取哪个都行`:a>l?`右边 \`${l}\` 更矮，被淘汰（\`max\` 只要大的那个）`:`左边 \`${a}\` 更矮，被淘汰（\`max\` 只要大的那个）`;d(`compute`,`\`${r(e.id)}\` 的左右子树都回来了：左 **\`${a}\`**、右 **\`${l}\`**。算自己的高度：\`1 + max(${a}, ${l}) = ${f}\` —— **那个 \`1\` 是把自己这一层算上**，这是本题唯一容易漏的地方。（${m}。）`+(p?` **根算完了，答案就是它：\`${f}\`。** 注意在这之前，中间任何一帧都没有人能提前说出最终答案 —— 高度是从最深的叶子一层层冒上来的，必须等根拿到左右两个数才定得下来。`:` 把这个高度汇报给父节点。`),{current:e.id,leftH:a,rightH:l,height:f}),u.pop()}return d(`done`,`递归结束，栈空了。**最大深度 = \`${s}\`**。回头看整条链路：叶子报 \`1\` → 父节点 \`1 + max(…) \` → 一层层加 1 → 根报出最终答案。**每个节点只被访问一次**，所以是 O(n)。另外注意 104 全程**没有任何全局变量** —— 答案不是"一路取 max 攒出来的"，而是根那一次计算的返回值本身。（对比 LC 124 的 \`best\`：那个才是需要一路刷新的全局最优。）`,{current:n,height:s,done:!0}),a}var Fo=`md-styles`,Io=24,Lo=96,Ro=78,zo=26,Bo=40,Vo=52,Ho=1150,Uo=48,Wo=`
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
`;function Go(){if(document.getElementById(Fo))return;let e=document.createElement(`style`);e.id=Fo,e.textContent=Wo,document.head.appendChild(e)}function Ko(e,t={}){if(!e||e.dataset.mdMounted===`1`)return{destroy(){}};e.dataset.mdMounted=`1`,Go();let n=Po(t),r=t.autoplay!==!1,{nodes:i,root:a}=Ga(Array.isArray(t.values)?t.values:[3,9,20,null,null,15,7]),o=e=>e==null||!i[e]?null:i[e].value,s=Y,c=i.length,l=document.createElement(`div`);l.className=`viz md`;let u=document.createElement(`div`);u.className=`viz__stage`,l.appendChild(u);function d(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(a===-1){let t=s(`svg`,{class:`viz__svg md__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`md-empty__text`,x:620/2,y:120/2});return n.textContent=`空树 —— 深度记 0（这就是递归的出口条件）`,t.appendChild(n),u.appendChild(t),l.appendChild(d()),l.appendChild(Q().root),e.textContent=``,e.appendChild(l),{destroy(){e.textContent=``,delete e.dataset.mdMounted,document.getElementById(Fo)?.remove()}}}let f=i.reduce((e,t)=>Math.max(e,t.depth),0),p=Math.min(120,Math.max(58,Math.round(470/2**f))),m=new Map;m.set(a,[]);for(let e of i)e.parent!==-1&&m.set(e.id,[...m.get(e.parent)??[],e.side]);let h=e=>p*2**Math.max(0,f-e),g=e=>{let t=0;for(let n of m.get(e.id)??[])t=t*2+ +(n===`R`);return(t+.5)*h(e.depth)},_=2**f*p,v=Math.max(660,zo+_+68),y=(v-_)/2,b=e=>Ro+e*Lo,x=e=>({x:y+g(i[e]),y:b(i[e].depth)}),S=Ro+f*Lo+Io+Bo,C=Math.min(620,v-zo*2),w=s(`svg`,{class:`viz__svg md__svg`,viewBox:`0 0 ${v} ${S+Vo+26}`,role:`img`,"aria-label":`二叉树最大深度推演动画`});u.appendChild(w);let T=s(`g`,{class:`md-edges`}),E=s(`g`,{class:`md-nodes`}),D=s(`g`,{class:`md-labels`});w.appendChild(T),w.appendChild(E),w.appendChild(D);let O=new Map;for(let e of i){if(e.parent===-1)continue;let t=x(e.parent),n=x(e.id),r=s(`path`,{class:`md-edge`,d:`M ${t.x} ${t.y+Io} L ${n.x} ${n.y-Io}`});T.appendChild(r),O.set(e.id,r)}let k=e=>{if(e.parent===-1)return 0;let t=e.side===`L`?i[e.parent].right:i[e.parent].left;if(t==null)return 0;let n=Math.abs(x(e.id).x-x(t).x);if(n>=56)return 0;let r=(56-n)/2+3;return e.side===`L`?-r:r},A=[];for(let e of i){let t=x(e.id),n=s(`g`,{class:`md-node`,transform:`translate(${t.x} ${t.y})`});n.appendChild(s(`circle`,{class:`md-node__ring`,r:31})),n.appendChild(s(`circle`,{class:`md-node__circle`,cx:0,cy:0,r:Io}));let r=s(`text`,{class:`md-node__value`,x:0,y:0});r.textContent=String(e.value),n.appendChild(r),E.appendChild(n);let i=s(`g`,{class:`md-node__htag-g`,transform:`translate(${t.x+k(e)} ${t.y})`});i.appendChild(s(`rect`,{class:`md-node__htag`,x:-48/2,y:-56,width:Uo,height:22,rx:7}));let a=s(`text`,{class:`md-node__htag-text`,x:0,y:-45});i.appendChild(a),D.appendChild(i),A.push({g:n,gainG:i,gt:a,id:e.id})}let j=s(`g`,{class:`md-banner`});j.appendChild(s(`rect`,{class:`md-banner__box`,x:zo,y:S,width:C,height:Vo,rx:9}));let M=s(`text`,{class:`md-banner__lead`,x:42,y:S+Vo/2});j.appendChild(M);let N=s(`text`,{class:`md-banner__answer-label`,x:zo+C-74,y:S+Vo/2});N.textContent=`最大深度`,j.appendChild(N);let P=s(`text`,{class:`md-banner__answer`,x:zo+C-16,y:S+Vo/2});j.appendChild(P),w.appendChild(j);let F=d();function I(e,t){if(!t)return;let n=t.stack.length?t.stack[t.stack.length-1].id:null,r=t.current,s=e=>Object.prototype.hasOwnProperty.call(t.heightOf,e),c=new Set;for(let e=0;e+1<t.stack.length;e+=1)c.add(t.stack[e+1].id);let l=t.height===null?null:r;for(let e of A){let{id:r,g:i,gainG:a,gt:o}=e,c=[`md-node`],u=s(r);u&&c.push(`is-done`),r===n&&c.push(`is-visit`),r===l&&c.push(`is-fresh`),i.setAttribute(`class`,c.join(` `)),u?(a.style.opacity=`1`,o.textContent=`h=${t.heightOf[r]}`):a.style.opacity=`0`}for(let e of i)e.parent!==-1&&O.get(e.id).setAttribute(`class`,c.has(e.id)?`md-edge is-onstack`:`md-edge`);t.phase===`init`?M.textContent=`从根 ${o(a)} 开始，先下去问子树`:t.phase===`recurse`?M.textContent=t.leftH===null?`进入 ${o(r)}，继续往下问`:`左子树回报 h=${t.leftH}，继续问右边`:t.phase===`leaf`?M.textContent=`${o(r)} 是叶子 → h = 1 + max(0, 0) = 1`:t.phase===`compute`?M.textContent=`${o(r)}：1 + max(${t.leftH}, ${t.rightH}) = ${t.height}`:M.textContent=t.answer===0?`空树：深度记 0`:`根 ${o(a)} 报出 h=${t.answer} —— 这就是答案`;let u=t.answer;u===null?(P.textContent=`?`,P.setAttribute(`class`,`md-banner__answer is-unknown`)):(P.textContent=String(u),P.setAttribute(`class`,`md-banner__answer`)),Z(F,t.desc)}l.appendChild(F);let L=Q();l.appendChild(L.root),e.textContent=``,e.appendChild(l),X();let R=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,z=$({steps:n,controls:L,intervalMs:Ho,onRender:I});z.jumpTo(Math.trunc(t.initialStep)||0);let B=null;return r&&!R&&typeof IntersectionObserver==`function`&&(B=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){B.disconnect(),B=null,z.play();return}},{threshold:.35}),B.observe(l)),l.setAttribute(`aria-description`,`共 ${c} 个节点`),{destroy(){B&&=(B.disconnect(),null),z.destroy(),e.textContent=``,delete e.dataset.mdMounted,document.getElementById(Fo)?.remove()}}}function qo(e={}){let{nodes:t,root:n}=Ga(Array.isArray(e.values)?e.values:[4,2,7,1,3,6,9]);if(n===-1)return[{phase:`done`,desc:"**空树** —— 没什么可翻的，直接返回 `None`。",current:null,swapPair:null,swapped:[],sideOf:{},stack:[],depth:-1,done:!0}];let r=e=>e==null||t[e]===void 0?null:t[e].value,i=Number.isInteger(e.maxFrames)?e.maxFrames:400,a={};for(let e of t)e.parent!==-1&&(a[e.id]=e.side);let o=(e,n)=>{for(let r of t)if(r.parent===e&&a[r.id]===n)return r.id;return null},s=[],c=[],l=[],u=0,d=(e,t,n={})=>{s.push({phase:e,desc:t,current:null,swapPair:null,swapped:[...c],sideOf:{...a},stack:l.map(e=>({id:e.id})),depth:l.length-1,done:e===`done`,...n})},f=t.length;for(d(`init`,`翻转二叉树 —— **把每个节点的两个孩子交换一次**。关键要意识到：**交换和递归的先后顺序不影响结果**，因为每个节点是各自独立地换自己的两个孩子，谁先谁后都不干涉。所以前序（先换再递归）和后序（先递归再换）都对 —— 但**交换绝不能插在两个递归中间**，那样会让已经翻好的子树白翻一遍。这棵树一共 ${f} 个节点，我们从根 \`${r(n)}\` 开始，一层层往下换。`,{current:n}),l.push({id:n,stage:`enter`});l.length>0&&(u+=1,!(u>i));){let e=l[l.length-1];if(t[e.id],e.stage===`enter`){let t=o(e.id,`L`),n=o(e.id,`R`);if(t===null&&n===null){d(`leaf`,`\`${r(e.id)}\` 是**叶子节点**，两个孩子都是空的。交换两个 \`None\` 是**空操作** —— 所以叶子在这里直接返回。这也说明：**真正发生变化的只有非叶节点**。`,{current:e.id}),l.pop();continue}t!==null&&(a[t]=`R`),n!==null&&(a[n]=`L`),c.push(e.id),d(`swap`,`\`${r(e.id)}\` —— **交换它的两个孩子**：`+(t!==null&&n!==null?`\`${r(t)}\` 和 \`${r(n)}\` 互换位置。`:t===null?`原来只有右孩子 \`${r(n)}\`，换成左孩子（另一边仍是空）。`:`原来只有左孩子 \`${r(t)}\`，换成右孩子（另一边仍是空）。`)+` 这是这一帧**唯一**发生的事，别多做也别少做。`,{current:e.id,swapPair:[t,n]}),e.stage=`left`,n!==null&&l.push({id:n,stage:`enter`});continue}if(e.stage===`left`){let t=o(e.id,`R`);t===null?e.stage=`right`:(d(`descend`,`\`${r(e.id)}\` 的左子树已经翻完，回到它身上，接着递归进**右子树** \`${r(t)}\`。注意这个"右子树"其实是**交换前那个左孩子** —— 因为这一层的交换已经发生过了，角色的名字不能想当然。`,{current:e.id}),e.stage=`right`,l.push({id:t,stage:`enter`}));continue}l.pop()}return d(`done`,`递归结束，栈空了。**翻转完成** —— 一共交换了 \`${c.length}\` 个非叶节点的孩子。现在整棵树上，每个节点从根到它的路径都**逐位取反**过了：左变成了右、右变成了左，于是每一层都成了原来那一层的**镜像**。时间复杂度 O(n)（每个节点恰好访问一次），空间 O(h)（递归栈深 = 树高）。`,{current:n,done:!0}),s}var Jo=`it-styles`,Yo=24,Xo=88,Zo=76,Qo=34,$o=68,es=26,ts=42,ns=50,rs=1150,is=`
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
`;function as(){if(document.getElementById(Jo))return;let e=document.createElement(`style`);e.id=Jo,e.textContent=is,document.head.appendChild(e)}function os(e,t={}){if(!e||e.dataset.itMounted===`1`)return{destroy(){}};e.dataset.itMounted=`1`,as();let n=qo(t),r=t.autoplay!==!1,{nodes:i,root:a}=Ga(Array.isArray(t.values)?t.values:[4,2,7,1,3,6,9]),o=e=>e==null||!i[e]?null:i[e].value,s=Y,c=document.createElement(`div`);c.className=`viz it`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(a===-1){let t=s(`svg`,{class:`viz__svg it__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`it-empty__text`,x:620/2,y:120/2});return n.textContent=`空树 —— 没什么可翻的，直接返回 None`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),{destroy(){e.textContent=``,delete e.dataset.itMounted,document.getElementById(Jo)?.remove()}}}let d=i.reduce((e,t)=>Math.max(e,t.depth),0),f=Math.min(120,Math.max(58,Math.round(470/2**d))),p=e=>f*2**Math.max(0,d-e),m=2**d*f,h=Math.max(660,es+m+68),g=(h-m)/2,_=e=>Zo+e*Xo,v=(e,t)=>{let n=0,r=1,a=t;for(;i[a].parent!==-1;)e[a]===`R`&&(n+=r),r*=2,a=i[a].parent;return{x:g+(n+.5)*p(i[t].depth),y:_(i[t].depth)}},y=Zo+d*Xo+Yo+ts,b=Math.min(620,h-es*2),x=s(`svg`,{class:`viz__svg it__svg`,viewBox:`0 0 ${h} ${y+ns+26}`,role:`img`,"aria-label":`翻转二叉树推演动画`});l.appendChild(x);let S=s(`g`,{class:`it-edges`}),C=s(`g`,{class:`it-nodes`}),w=s(`g`,{class:`it-swap`});x.appendChild(S),x.appendChild(w),x.appendChild(C);let T=new Map;for(let e of i){if(e.parent===-1)continue;let t=s(`path`,{class:`it-edge`,d:`M 0 0 L 0 0`});S.appendChild(t),T.set(e.id,t)}let E=[];for(let e of i){let t=s(`g`,{class:`it-node`});t.appendChild(s(`circle`,{class:`it-node__ring`,r:31})),t.appendChild(s(`circle`,{class:`it-node__circle`,cx:0,cy:0,r:Yo}));let n=s(`text`,{class:`it-node__value`,x:0,y:0});n.textContent=String(e.value),t.appendChild(n),C.appendChild(t),E.push({g:t,value:e.value,id:e.id})}let D=s(`path`,{class:`it-swap__arc`,d:`M 0 0`}),O=s(`path`,{class:`it-swap__head`,d:`M 0 0`}),k=s(`path`,{class:`it-swap__head`,d:`M 0 0`}),A=s(`text`,{class:`it-swap__mark`,x:0,y:0});A.textContent=`⇄`,w.appendChild(D),w.appendChild(O),w.appendChild(k),w.appendChild(A);let j=s(`rect`,{class:`it-banner__box`,x:es,y,width:b,height:ns,rx:9});x.appendChild(j);let M=s(`text`,{class:`it-banner__lead`,x:42,y:y+ns/2});x.appendChild(M);let N=s(`text`,{class:`it-banner__count`,x:es+b-16,y:y+ns/2});x.appendChild(N);let P=u();function F(e,t){if(!t)return;let n=t.sideOf??{},r=e=>v(n,e),s=t.current,c=new Set(t.swapped??[]),l=t.swapPair??[],u=new Set(l.filter(e=>e!=null)),d=new Set;for(let e=0;e+1<t.stack.length;e+=1)d.add(t.stack[e+1].id);for(let e of E){let{id:n,g:i}=e,a=r(n);i.setAttribute(`transform`,`translate(${a.x} ${a.y})`);let o=[`it-node`];c.has(n)&&o.push(`is-done`),n===s&&t.phase!==`done`&&o.push(`is-visit`),u.has(n)&&o.push(`is-swapping`),i.setAttribute(`class`,o.join(` `))}for(let e of i){if(e.parent===-1)continue;let t=r(e.parent),n=r(e.id),i=T.get(e.id);i.setAttribute(`d`,`M ${t.x} ${t.y+Yo} L ${n.x} ${n.y-Yo}`),i.setAttribute(`class`,d.has(e.id)?`it-edge is-onstack`:`it-edge`)}let f=l.filter(e=>e!=null);if(t.phase===`swap`&&f.length===2){let e=r(f[0]),t=r(f[1]),n=e.y-Yo-Qo,i=(e.x+t.x)/2,a=e.y-Yo-$o;D.setAttribute(`d`,`M ${e.x} ${n} Q ${i} ${a} ${t.x} ${n}`),D.style.opacity=`1`,O.setAttribute(`d`,`M ${e.x} ${n} l 9 -4 l 0 8 z`),k.setAttribute(`d`,`M ${t.x} ${n} l -9 -4 l 0 8 z`),O.style.opacity=`1`,k.style.opacity=`1`,A.setAttribute(`x`,i),A.setAttribute(`y`,a-9),A.style.opacity=`1`}else D.style.opacity=`0`,O.style.opacity=`0`,k.style.opacity=`0`,A.style.opacity=`0`;let p=i.filter(e=>e.left!==null||e.right!==null).length;t.phase===`init`?M.textContent=`从根 ${o(a)} 开始，逐层交换两个孩子`:t.phase===`swap`?M.textContent=f.length===2?`交换 ${o(f[0])} 和 ${o(f[1])}`:`单侧孩子移位：${o(f[0]??f[1])}`:t.phase===`leaf`?M.textContent=`${o(s)} 是叶子，交换空操作 → 直接返回`:M.textContent=`继续递归进子树 ${o(s)}`,t.phase===`done`?(M.textContent=`翻转完成 —— 每个节点的路径都逐位取反过了`,j.setAttribute(`class`,`it-banner__box is-done`),N.setAttribute(`class`,`it-banner__count is-done`)):(j.setAttribute(`class`,`it-banner__box`),N.setAttribute(`class`,`it-banner__count`)),N.textContent=`已换 ${t.swapped.length}/${p} 个非叶节点`,Z(P,t.desc)}c.appendChild(P);let I=Q();c.appendChild(I.root),e.textContent=``,e.appendChild(c),X();let L=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,R=$({steps:n,controls:I,intervalMs:rs,onRender:F});R.jumpTo(Math.trunc(t.initialStep)||0);let z=null;return r&&!L&&typeof IntersectionObserver==`function`&&(z=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){z.disconnect(),z=null,R.play();return}},{threshold:.35}),z.observe(c)),{destroy(){z&&=(z.disconnect(),null),R.destroy(),e.textContent=``,delete e.dataset.itMounted,document.getElementById(Jo)?.remove()}}}function ss(e={}){let t=typeof e.values==`string`?e.values:`abcabcbb`,n=Array.from(t),r=n.length,i=Number.isInteger(e.maxSteps)?e.maxSteps:400,a={right:-1,left:0,prevLeft:null,ch:null,hitIdx:null,outsideWindow:!1,lastSeen:{},windowLen:0,ans:0,bestRange:null};if(r===0)return[{...a,phase:`done`,desc:"**空串** —— 一个字符都没有，最长无重复子串的长度是 `0`。",done:!0}];let o=[],s={},c=0,l=0,u=null,d=0,f=(e,t,n={})=>{o.push({phase:e,desc:t,right:-1,left:c,prevLeft:null,ch:null,hitIdx:null,outsideWindow:!1,lastSeen:{...s},windowLen:0,ans:l,bestRange:u?[...u]:null,done:e===`done`,...n})};f(`init`,`要在 \`${t}\`（${r} 个字符）里找**最长的不含重复字符的子串**。用**滑动窗口**：\`right\` 一路往右扩张，把字符一个个吃进窗口；一旦吃进来的字符**在窗口内已经出现过**，就让 \`left\` 跳到"那个旧位置 + 1"，把它挤出窗口。两个指针都只往右走，所以整体是 O(n)。维护一张表 \`lastSeen\`，记每个字符最后出现在哪 —— 这就是"一眼看出重不重复"的依据。`);for(let e=0;e<r&&(d+=1,!(d>i));e+=1){let t=n[e],r=s[t],i=r!==void 0&&r<c;if(r!==void 0&&r>=c){let n=c;c=r+1,s[t]=e;let i=e-c+1,a=i>l;a&&(l=i,u=[c,e]),f(`slide`,`\`right\` 走到 \`${e}\`，字符是 **\`${t}\`**。它上次出现在下标 \`${r}\`，**而这个位置还在窗口里**（\`${r} >= left = ${n}\`）—— 构成重复。于是 \`left\` 从 \`${n}\` 跳到 \`${r} + 1 = ${c}\`，把旧的 \`${t}\` 挤出窗口。注意 **\`left\` 只会往右跳，绝不会退回去** —— 这是滑动窗口正确性的根基。现在窗口是 \`[${c}, ${e}]\`，长度 \`${i}\``+(a?`，**刷新了答案 → \`ans = ${l}\`**。`:`，没超过当前的 \`ans = ${l}\`。`),{right:e,left:c,prevLeft:n,ch:t,hitIdx:r,windowLen:i});continue}s[t]=e;let a=e-c+1,o=a>l;o&&(l=a,u=[c,e]),f(`expand`,`\`right\` 走到 \`${e}\`，字符是 **\`${t}\`**。`+(i?`它**出现过**（下标 \`${r}\`），但那个位置**已经在窗口左边之外**了（\`${r} < left = ${c}\`）—— 它早就被挤出窗口，现在再遇到**不算重复**，所以 \`left\` 原地不动。**这一步就是"只看位置是否还在窗口内"这个判据的价值所在**：如果这里无脑写 \`left = ${r} + 1\`，左指针就会倒退回 \`${r+1}\`。`:`它还没在窗口里出现过，直接吃进来。`)+` 现在窗口是 \`[${c}, ${e}]\`，长度 **\`${a}\`**`+(o?`，**刷新了答案 → \`ans = ${l}\`**。`:`，没超过当前的 \`ans = ${l}\`。`),{right:e,left:c,ch:t,hitIdx:i?r:null,outsideWindow:i,windowLen:a})}let p=u?n.slice(u[0],u[1]+1).join(``):``;return f(`done`,`扫描结束。**答案 = \`${l}\`**，对应的窗口是 \`[${u?.[0]}, ${u?.[1]}]\`，内容 \`"${p}"\`。回头看整条链路：\`right\` 一共推进了 ${r} 次，\`left\` 也从头到尾**只往右走、从不后退**，两个指针加起来总移动量不超过 \`2n\` —— 所以是**严格的 O(n)**，而不是"外层枚举左端点 × 内层枚举右端点"的 O(n²)。空间是 O(min(n, 字符集大小))：\`lastSeen\` 每个不同字符只占一条。`,{left:c,right:r-1,windowLen:r-c,done:!0}),o}var cs=`ls-styles`,ls=54,us=52,ds=6,fs=136,ps=22,ms=196,hs=206,gs=9,_s=242,vs=282,ys=296,bs=46,xs=26,Ss=50,Cs=1150,ws=604,Ts=`
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
`;function Es(){if(document.getElementById(cs))return;let e=document.createElement(`style`);e.id=cs,e.textContent=Ts,document.head.appendChild(e)}function Ds(e,t={}){if(!e||e.dataset.lsMounted===`1`)return{destroy(){}};e.dataset.lsMounted=`1`,Es();let n=ss(t),r=t.autoplay!==!1,i=typeof t.values==`string`?t.values:`abcabcbb`,a=Array.from(i),o=a.length,s=Y,c=document.createElement(`div`);c.className=`viz ls`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(o===0){let t=s(`svg`,{class:`viz__svg ls__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`ls-empty__text`,x:620/2,y:120/2});return n.textContent=`空串 —— 没有字符，答案是 0`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),{destroy(){e.textContent=``,delete e.dataset.lsMounted,document.getElementById(cs)?.remove()}}}let d=us,f=ds,p=17,m=o*d+(o-1)*f;if(m>ws){let e=ws/m;d=Math.max(20,Math.floor(d*e)),f=Math.max(3,Math.floor(f*e)),p=Math.max(11,Math.round(p*e))}let h=o*d+(o-1)*f,g=Math.max(660,xs*2+h+68),_=(g-h)/2,v=e=>_+e*(d+f),y=Math.min(620,g-xs*2),b=s(`svg`,{class:`viz__svg ls__svg`,viewBox:`0 0 ${g} 452`,role:`img`,"aria-label":`无重复字符的最长子串推演动画`});l.appendChild(b);let x=s(`g`,{class:`ls-bands`}),S=s(`g`,{class:`ls-cells`}),C=s(`g`,{class:`ls-marks`});b.appendChild(x),b.appendChild(S),b.appendChild(C);let w=s(`rect`,{class:`ls-win__bar`,x:0,y:hs,width:0,height:gs,rx:4});x.appendChild(w);let T=s(`line`,{class:`ls-win__best`,x1:0,y1:ms,x2:0,y2:ms});x.appendChild(T);let E=s(`text`,{class:`ls-win__pin`,x:0,y:_s}),D=s(`text`,{class:`ls-win__pin is-r`,x:0,y:_s}),O=s(`line`,{class:`ls-win__tick`,x1:0,y1:215,x2:0,y2:_s-8}),k=s(`line`,{class:`ls-win__tick is-r`,x1:0,y1:215,x2:0,y2:_s-8});C.appendChild(O),C.appendChild(k),C.appendChild(E),C.appendChild(D);let A=s(`text`,{class:`ls-win__empty`,x:xs,y:_s});A.textContent=`窗口还没开始滑动 —— 按播放看 right 怎么一步步往右吃字符`,C.appendChild(A);let j=s(`path`,{class:`ls-rpin__tri`,d:`M 0 0 L 0 0 L 0 0`}),M=s(`text`,{class:`ls-rpin__text`,x:0,y:0});M.textContent=`right`,C.appendChild(j),C.appendChild(M);let N=[];for(let e=0;e<o;e+=1){let t=v(e),n=s(`g`,{class:`ls-cell`});n.appendChild(s(`rect`,{class:`ls-cell__box`,x:t,y:fs,width:d,height:ls,rx:7}));let r=s(`text`,{class:`ls-cell__text`,x:t+d/2,y:163,style:`font-size:${p}px`});r.textContent=a[e],n.appendChild(r),S.appendChild(n),N.push({g:n,id:e})}let P=new Set(a).size,F=P>10?5:8,I=Math.max(28,Math.min(56,Math.floor((ws-(P-1)*F)/P))),L=(g-(P*I+(P-1)*F))/2,R=s(`text`,{class:`ls-table__title`,x:L,y:vs});R.textContent=`lastSeen：每个字符最后出现在哪个下标`,C.appendChild(R);let z=[];for(let e=0;e<P;e+=1){let t=L+e*(I+F),n=s(`g`,{class:`ls-card`});n.appendChild(s(`rect`,{class:`ls-card__box`,x:t,y:ys,width:I,height:bs,rx:7}));let r=s(`text`,{class:`ls-card__ch`,x:t+I/2,y:311});n.appendChild(r);let i=s(`text`,{class:`ls-card__idx`,x:t+I/2,y:329});n.appendChild(i),C.appendChild(n),z.push({g:n,chT:r,idxT:i,x:t})}let B=s(`g`,{class:`ls-banner`});B.appendChild(s(`rect`,{class:`ls-banner__box`,x:xs,y:376,width:y,height:Ss,rx:9}));let V=s(`text`,{class:`ls-banner__lead`,x:42,y:401});B.appendChild(V);let H=s(`text`,{class:`ls-banner__label`,x:xs+y-74,y:401});H.textContent=`ans`,B.appendChild(H);let U=s(`text`,{class:`ls-banner__ans`,x:xs+y-16,y:401});B.appendChild(U),b.appendChild(B);let ee=u();function W(e,t){if(!t)return;let n=t.bestRange,r=t.phase===`done`&&n,s=r?n[0]:t.left,c=r?n[1]:t.right,l=t.lastSeen??{};for(let e of N){let{g:n,id:r}=e,i=[`ls-cell`];c>=0&&r>=s&&r<=c?i.push(`is-in`):(c>=0&&r<s||t.phase!==`init`)&&i.push(`is-out`),r===c&&i.push(`is-cur`),n.setAttribute(`class`,i.join(` `))}let u=c>=0;if(u){let e=v(s),t=v(c)+d;w.setAttribute(`x`,e),w.setAttribute(`width`,Math.max(4,t-e)),w.style.opacity=`1`;let n=v(s)+d/2,r=v(c)+d/2;O.setAttribute(`x1`,n),O.setAttribute(`x2`,n),E.setAttribute(`x`,n),O.style.opacity=`1`,E.style.opacity=`1`,s===c?(E.textContent=`L=R=${s}`,D.style.opacity=`0`,k.style.opacity=`0`):(E.textContent=`L=${s}`,k.setAttribute(`x1`,r),k.setAttribute(`x2`,r),D.setAttribute(`x`,r),D.textContent=`R=${c}`,D.style.opacity=`1`,k.style.opacity=`1`),A.style.opacity=`0`}else w.style.opacity=`0`,O.style.opacity=`0`,k.style.opacity=`0`,E.style.opacity=`0`,D.style.opacity=`0`,A.style.opacity=`1`;if(n?(T.setAttribute(`x1`,v(n[0])),T.setAttribute(`x2`,v(n[1])+d),T.style.opacity=`1`):T.style.opacity=`0`,u){let e=v(c)+d/2,t=fs-ps;j.setAttribute(`d`,`M ${e-6} ${t-10} L ${e+6} ${t-10} L ${e} ${t} z`),M.setAttribute(`x`,e),M.setAttribute(`y`,t-20),j.style.opacity=`1`,M.style.opacity=`1`}else j.style.opacity=`0`,M.style.opacity=`0`;let f=Object.keys(l),p=t.ch;if(z.forEach((e,n)=>{let r=f[n];if(r===void 0){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`,e.chT.textContent=r;let i=r===p&&t.phase!==`done`,a=i&&t.hitIdx!==null&&(t.phase===`slide`||t.outsideWindow===!0);e.idxT.textContent=String(a?t.hitIdx:l[r]),e.g.setAttribute(`class`,i?`ls-card is-hit`:`ls-card`),e.idxT.setAttribute(`class`,a?`ls-card__idx is-old`:`ls-card__idx`)}),t.phase===`init`)V.textContent=`字符串 "${i}"，共 ${o} 个字符`;else if(t.phase===`done`){let e=n?a.slice(n[0],n[1]+1).join(``):``;V.textContent=`最长无重复子串 "${e}"`}else{let e=a.slice(s,c+1).join(``);V.textContent=`窗口 [${s}, ${c}] = "${e}"  长度 ${t.windowLen}`}U.textContent=String(t.ans),Z(ee,t.desc)}c.appendChild(ee);let G=Q();c.appendChild(G.root),e.textContent=``,e.appendChild(c),X();let K=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,te=$({steps:n,controls:G,intervalMs:Cs,onRender:W});te.jumpTo(Math.trunc(t.initialStep)||0);let ne=null;return r&&!K&&typeof IntersectionObserver==`function`&&(ne=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){ne.disconnect(),ne=null,te.play();return}},{threshold:.35}),ne.observe(c)),{destroy(){ne&&=(ne.disconnect(),null),te.destroy(),e.textContent=``,delete e.dataset.lsMounted,document.getElementById(cs)?.remove()}}}function Os(e={}){let t=Array.isArray(e.nums)?e.nums:[2,7,11,15],n=Number.isInteger(e.target)?e.target:9,r=t.length,i=Number.isInteger(e.maxSteps)?e.maxSteps:400,a={i:-1,x:null,need:null,hitIdx:null,seen:{},answer:null};if(r===0)return[{...a,phase:`done`,desc:`**空数组** —— 没有任何元素，凑不出两个数。题目保证有解，所以这不会发生，但状态机要有安静的出口。`,done:!0}];let o=[],s={},c=null,l=0,u=e=>Object.prototype.hasOwnProperty.call(s,e),d=()=>Object.keys(s).length===0?`{}`:`{${Object.entries(s).map(([e,t])=>`${e}→${t}`).join(`, `)}}`,f=(e,t,n={})=>{o.push({phase:e,desc:t,i:-1,x:null,need:null,hitIdx:null,seen:{...s},answer:c?[...c]:null,done:e===`done`,...n})};f(`init`,`要在 \`[${t.join(`, `)}]\` 里找出**两个数**，使它们的和等于 \`target = ${n}\`，返回它们的**下标**。暴力做法是"选一个 i 再往后试每个 j"，O(n²)。换个方向想：**站在 i 的位置，问一句"我需要的那个数 \`${n} - x\`，之前出现过吗？"** ——那就在遍历时顺手用一张表记下"见过的值和它的下标"。**顺序很关键：先查表，再把自己登记进去**（原因见后面第 3 轮）。`);for(let e=0;e<r&&(l+=1,!(l>i));e+=1){let r=t[e],i=n-r,a=u(i),o=a?s[i]:null;if(a){c=[o,e],f(`hit`,`\`i = ${e}\`，当前元素 \`x = ${r}\`。我想要的那个数是 \`${n} - ${r} = ${i}\`。**去表里查一下 —— 找到了！** \`${i}\` 在下标 \`${o}\`（表里当时是 \`${d()}\`）。于是 \`nums[${o}] + nums[${e}] = ${i} + ${r} = ${n}\` ✓。注意 \`${o} < ${e}\` —— **命中位置一定在当前元素左边**，因为查表发生在"把自己放进去"之前，表里根本还没有自己。这正是"同一元素不能重复使用"这条约束被自动满足的原因。`,{i:e,x:r,need:i,hitIdx:o});break}f(`miss`,`\`i = ${e}\`，当前元素 \`x = ${r}\`。我想要的那个数是 \`${n} - ${r} = ${i}\`。**去表里查一下 —— 没有。**`+(Object.keys(s).length===0?`表此刻还是空的（前面没有任何元素），所以必然查不到。`:`表里现在装的是 \`${d()}\`，没有 \`${i}\`。`)+` 那就**再把自己登记进去**，供后面的元素来查。`,{i:e,x:r,need:i}),s[r]=e,f(`put`,`把 \`${r} → ${e}\` 存进表，表变成 \`${d()}\`。**注意这一步必须在"查表"之后** —— 如果反过来先登记自己，当 \`target = 2 × x\` 时就会查到**自己**，返回一个 \`[i, i]\` 这种把同一个位置用了两次的假答案。（文章第三节用 \`[3, 3]\` 配 \`target = 6\` 演了这件事。）`,{i:e,x:r,need:i})}if(c){let[e,r]=c;f(`verify`,`验证一遍：\`nums[${e}] + nums[${r}] = ${t[e]} + ${t[r]} = ${t[e]+t[r]}\`，正好等于 \`target = ${n}\` ✓。返回 **\`[${e}, ${r}]\`**。整个过程只扫了一遍数组，每个元素做 O(1) 的查表 + 登记 —— 所以是 **O(n) 时间**、**O(n) 空间**（最坏情况整张表都要装下来）。`,{i:r,x:t[r]})}return f(`done`,c?`**答案 = \`[${c[0]}, ${c[1]}]\`**。回头看这题的两句关键代码：\`if need in seen\` 和 \`seen[x] = i\` —— **先查再存，顺序不能反。** 它一次就同时解决了两件事："用哈希把查找降到 O(1)"和"保证不重复使用同一个元素"。另外提醒一句：题目给的前提是"**只存在一个有效答案**"，所以这里可以命中就立刻返回；如果要求**所有**满足条件的下标对，就不能提前 return，而且表里要存"值 → 下标列表"。`:`扫描结束，**没有找到**任何一对和为 \`${n}\` 的数。（题目保证有解，所以这不会发生在合法输入上。）`,{i:r-1,x:t[r-1],done:!0}),o}var ks=`ts-styles`,As=56,js=76,Ms=8,Ns=130,Ps=20,Fs=214,Is=272,Ls=288,Rs=48,zs=26,Bs=52,Vs=1400,Hs=604,Us=`
.ts {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.ts__svg { width: 100%; height: auto; display: block; }

/* ── 数组格子 ─────────────────────────────────────────────────────────── */
.ts-cell__box {
  fill: var(--ts-fill, #ffffff);
  stroke: var(--ts-line, #c3c9c2);
  stroke-width: 1.5;
}
.ts-cell__value {
  fill: var(--ts-ink, #1f2a24);
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ts-cell__idx {
  fill: var(--ts-muted, #657168);
  font-size: 13px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 已经登记进哈希表 */
.ts-cell.is-seen .ts-cell__box {
  fill: var(--ts-ok-fill, #eef5f1);
  stroke: var(--ts-ok, #3f6b57);
  stroke-width: 1.5;
}
/* 当前正在处理的元素 */
.ts-cell.is-cur .ts-cell__box {
  fill: var(--ts-hot-fill, #fdf1ec);
  stroke: var(--ts-hot, #a45f45);
  stroke-width: 3;
}
.ts-cell.is-cur .ts-cell__value {
  fill: var(--ts-hot, #a45f45);
}
/* 答案的两个元素 */
.ts-cell.is-answer .ts-cell__box {
  fill: var(--ts-gold-fill, #fdf6e8);
  stroke: var(--ts-gold, #c2872f);
  stroke-width: 3;
}
.ts-cell.is-answer .ts-cell__value {
  fill: var(--ts-gold, #c2872f);
}
.ts-cell__ring {
  fill: none;
  stroke: var(--ts-gold, #c2872f);
  stroke-width: 2;
  opacity: 0;
}
.ts-cell.is-answer .ts-cell__ring { opacity: 1; }

/* ── i 指针 ───────────────────────────────────────────────────────────── */
.ts-ipin__tri { fill: var(--ts-hot, #a45f45); }
.ts-ipin__text {
  fill: var(--ts-hot, #a45f45);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 答案连线 ─────────────────────────────────────────────────────────── */
.ts-arc {
  fill: none;
  stroke: var(--ts-gold, #c2872f);
  stroke-width: 2.5;
  stroke-dasharray: 6 4;
}

/* ── 哈希表 ───────────────────────────────────────────────────────────── */
.ts-table__title {
  fill: var(--ts-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ts-card__box {
  fill: var(--ts-fill, #ffffff);
  stroke: var(--ts-line, #c3c9c2);
  stroke-width: 1.5;
}
.ts-card__key {
  fill: var(--ts-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ts-card__val {
  fill: var(--ts-muted, #657168);
  font-size: 13px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 这一帧刚存进去的那张卡 */
.ts-card.is-new .ts-card__box {
  fill: var(--ts-ok-fill, #eef5f1);
  stroke: var(--ts-ok, #3f6b57);
  stroke-width: 2.5;
}
.ts-card.is-new .ts-card__key { fill: var(--ts-ok, #3f6b57); }
/* 被查中的那张卡 */
.ts-card.is-hit .ts-card__box {
  fill: var(--ts-gold-fill, #fdf6e8);
  stroke: var(--ts-gold, #c2872f);
  stroke-width: 3;
}
.ts-card.is-hit .ts-card__key { fill: var(--ts-gold, #c2872f); }
.ts-card.is-hit .ts-card__val {
  fill: var(--ts-gold, #c2872f);
  font-weight: 700;
}
.ts-table__empty {
  fill: var(--ts-dim, #b9b9b3);
  font-size: 13px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.ts-banner__box {
  fill: var(--ts-banner-fill, #f4f2ec);
  stroke: var(--ts-line, #c3c9c2);
  stroke-width: 1.5;
}
.ts-banner__box.is-answer {
  fill: var(--ts-gold-fill, #fdf6e8);
  stroke: var(--ts-gold, #c2872f);
  stroke-width: 2;
}
.ts-banner__lead {
  fill: var(--ts-ink, #1f2a24);
  font-size: 15.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ts-banner__label {
  fill: var(--ts-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ts-banner__ans {
  fill: var(--ts-gold, #c2872f);
  font-size: 21px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.ts-empty__text {
  fill: var(--ts-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function Ws(){if(document.getElementById(ks))return;let e=document.createElement(`style`);e.id=ks,e.textContent=Us,document.head.appendChild(e)}function Gs(e,t={}){if(!e||e.dataset.tsMounted===`1`)return{destroy(){}};e.dataset.tsMounted=`1`,Ws();let n=Os(t),r=t.autoplay!==!1,i=Array.isArray(t.nums)?t.nums:[2,7,11,15],a=Number.isInteger(t.target)?t.target:9,o=i.length,s=Y,c=document.createElement(`div`);c.className=`viz ts`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(o===0){let t=s(`svg`,{class:`viz__svg ts__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`ts-empty__text`,x:620/2,y:120/2});return n.textContent=`空数组 —— 凑不出两个数`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),{destroy(){e.textContent=``,delete e.dataset.tsMounted,document.getElementById(ks)?.remove()}}}let d=js,f=Ms,p=20,m=o*d+(o-1)*f;if(m>Hs){let e=Hs/m;d=Math.max(28,Math.floor(d*e)),f=Math.max(4,Math.floor(f*e)),p=Math.max(12,Math.round(p*e))}let h=o*d+(o-1)*f,g=Math.max(660,zs*2+h+68),_=(g-h)/2,v=e=>_+e*(d+f),y=Math.min(620,g-zs*2),b=s(`svg`,{class:`viz__svg ts__svg`,viewBox:`0 0 ${g} 450`,role:`img`,"aria-label":`两数之和推演动画`});l.appendChild(b);let x=s(`g`,{class:`ts-arcs`}),S=s(`g`,{class:`ts-cells`}),C=s(`g`,{class:`ts-marks`});b.appendChild(x),b.appendChild(S),b.appendChild(C);let w=s(`path`,{class:`ts-arc`,d:`M 0 0`});x.appendChild(w);let T=[];for(let e=0;e<o;e+=1){let t=v(e),n=s(`g`,{class:`ts-cell`});n.appendChild(s(`rect`,{class:`ts-cell__ring`,x:t-5,y:Ns-5,width:d+10,height:66,rx:11})),n.appendChild(s(`rect`,{class:`ts-cell__box`,x:t,y:Ns,width:d,height:As,rx:8}));let r=s(`text`,{class:`ts-cell__value`,x:t+d/2,y:158,style:`font-size:${p}px`});r.textContent=String(i[e]),n.appendChild(r);let a=s(`text`,{class:`ts-cell__idx`,x:t+d/2,y:202});a.textContent=String(e),n.appendChild(a),S.appendChild(n),T.push({g:n,id:e})}let E=s(`path`,{class:`ts-ipin__tri`,d:`M 0 0 L 0 0 L 0 0`}),D=s(`text`,{class:`ts-ipin__text`,x:0,y:0});D.textContent=`i`,C.appendChild(E),C.appendChild(D);let O=s(`text`,{class:`ts-table__title`,x:zs,y:Is});O.textContent=`seen：见过的值 → 它的下标`,C.appendChild(O);let k=s(`text`,{class:`ts-table__empty`,x:zs,y:312});k.textContent=`（表还是空的）`,C.appendChild(k);let A=o>8?6:10,j=Math.max(40,Math.min(74,Math.floor((Hs-(Math.max(1,o)-1)*A)/Math.max(1,o)))),M=[];for(let e=0;e<o;e+=1){let t=zs+e*(j+A),n=s(`g`,{class:`ts-card`});n.appendChild(s(`rect`,{class:`ts-card__box`,x:t,y:Ls,width:j,height:Rs,rx:8}));let r=s(`text`,{class:`ts-card__key`,x:t+j/2,y:305});n.appendChild(r);let i=s(`text`,{class:`ts-card__val`,x:t+j/2,y:323});n.appendChild(i),C.appendChild(n),M.push({g:n,k:r,val:i})}let N=s(`rect`,{class:`ts-banner__box`,x:zs,y:372,width:y,height:Bs,rx:9});b.appendChild(N);let P=s(`text`,{class:`ts-banner__lead`,x:42,y:398});b.appendChild(P);let F=s(`text`,{class:`ts-banner__label`,x:zs+y-84,y:398});F.textContent=`答案下标`,b.appendChild(F);let I=s(`text`,{class:`ts-banner__ans`,x:zs+y-16,y:398});I.textContent=`—`,b.appendChild(I);let L=u();function R(e,t){if(!t)return;let n=t.seen??{},r=t.answer,s=t.i,c=new Set(r?[r[0],r[1]]:[]),l=new Set(Object.keys(n).map(Number));for(let e of T){let{g:n,id:r}=e,a=[`ts-cell`];l.has(i[r])&&a.push(`is-seen`),r===s&&t.phase!==`done`&&a.push(`is-cur`),c.has(r)&&a.push(`is-answer`),n.setAttribute(`class`,a.join(` `))}if(s>=0&&s<o&&t.phase!==`done`){let e=v(s)+d/2,t=Ns-Ps;E.setAttribute(`d`,`M ${e-6} ${t-10} L ${e+6} ${t-10} L ${e} ${t} z`),D.setAttribute(`x`,e),D.setAttribute(`y`,t-20),D.textContent=`i=${s}`,E.style.opacity=`1`,D.style.opacity=`1`}else E.style.opacity=`0`,D.style.opacity=`0`;if(r){let e=v(r[0])+d/2,t=v(r[1])+d/2,n=(e+t)/2;w.setAttribute(`d`,`M ${e} ${Fs} Q ${n} 240 ${t} ${Fs}`),w.style.opacity=`1`}else w.style.opacity=`0`;let u=Object.entries(n);u.length===0?k.style.opacity=`1`:k.style.opacity=`0`,M.forEach((e,n)=>{let r=u[n];if(r===void 0){e.g.style.opacity=`0`;return}let[i,a]=r;e.g.style.opacity=`1`,e.k.textContent=i,e.val.textContent=`↓${a}`;let o=t.phase===`put`&&Number(i)===t.x&&a===t.i,s=t.hitIdx!==null&&Number(a)===t.hitIdx&&t.phase===`hit`;e.g.setAttribute(`class`,`ts-card${s?` is-hit`:o?` is-new`:``}`)}),N.setAttribute(`class`,r?`ts-banner__box is-answer`:`ts-banner__box`),I.textContent=r?`[${r[0]}, ${r[1]}]`:`—`,t.phase===`init`?P.textContent=`nums = [${i.join(`, `)}]，target = ${a}`:t.phase===`miss`?P.textContent=`需要 ${a} - ${t.x} = ${t.need}，查表：没有`:t.phase===`put`?P.textContent=`把 ${t.x} → ${t.i} 登记进表`:t.phase===`hit`?P.textContent=`需要 ${a} - ${t.x} = ${t.need}，查表：命中下标 ${t.hitIdx}`:t.phase===`verify`?P.textContent=`验证 ${i[r[0]]} + ${i[r[1]]} = ${a} ✓`:P.textContent=r?`完成：nums[${r[0]}] + nums[${r[1]}] = ${a}`:`没有找到任何一对`,Z(L,t.desc)}c.appendChild(L);let z=Q();c.appendChild(z.root),e.textContent=``,e.appendChild(c),X();let B=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,V=$({steps:n,controls:z,intervalMs:Vs,onRender:R});V.jumpTo(Math.trunc(t.initialStep)||0);let H=null;return r&&!B&&typeof IntersectionObserver==`function`&&(H=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){H.disconnect(),H=null,V.play();return}},{threshold:.35}),H.observe(c)),{destroy(){H&&=(H.disconnect(),null),V.destroy(),e.textContent=``,delete e.dataset.tsMounted,document.getElementById(ks)?.remove()}}}var Ks=[-1,0,1,2,-1,-4];function qs(e={}){let t=Array.isArray(e.nums)?e.nums:Ks,n=[...t].sort((e,t)=>e-t),r=n.length,i=Number.isInteger(e.maxSteps)?e.maxSteps:400,a={i:-1,l:-1,r:-1,sum:null,sumL:null,sumR:null,lFrom:null,rFrom:null,dedupL:null,dedupR:null,hit:null,results:[],roundOver:!1};if(r<3)return[{...a,arr:[...n],original:[...t],phase:`done`,desc:`数组只有 \`${r}\` 个数，**凑不出三个**，直接返回空列表。题目虽然不会这么给，但状态机要有安静的出口。`,roundOver:!0,done:!0}];let o=[],s=[],c=0,l=e=>`[${e.join(`, `)}]`,u=()=>s.length===0?`[]`:`[${s.map(l).join(`, `)}]`,d=e=>e<0?`(${e})`:`${e}`,f=(e,r,i={})=>{o.push({...a,arr:[...n],original:[...t],results:s.map(e=>[...e]),phase:e,desc:r,done:e===`done`,...i})},p=0,m=0,h=0,g=`outer`;for(f(`init`,`要在 \`${l(t)}\` 里找出**所有**和为 \`0\` 的三元组，而且结果里**不能有重复**。暴力枚举三个下标是 \`O(n³)\`；直接照搬"两数之和"那套哈希表也不好使 —— 哈希能找出和为 0 的组合，但它回答不了"这一组是不是早就出现过了"，去重无处下手。标准路线只有一条：**先排序，再固定一个数，用双指针夹逼另外两个**。排序后数组是 \`${l(n)}\`。这里要点破一个误解：**排序的收益不是"查找更快"**（这题压根没有查找），而是**让相同的数挨在一起** —— 后面两处去重全靠这一点才写得出来。`);c<i;){if(c+=1,g===`outer`){if(p>=r-2)break;let e=n[p];if(e>0){f(`prune`,`\`i = ${p}\`，\`nums[${p}] = ${e} > 0\`。数组已经是升序的，\`i\` 后面的数只会**更大** —— 三个正数加起来不可能等于 \`0\`。所以这里直接 \`break\`，外层循环整体结束，不用再往后看了。`,{i:p});break}if(p>0&&n[p]===n[p-1]){f(`skip-i`,`\`i = ${p}\`，\`nums[${p}] = ${e}\` 和上一轮的 \`nums[${p-1}] = ${n[p-1]}\` **完全相同**。上一轮已经把"以 \`${e}\` 为最小数"的所有三元组找完了，这一轮只会把同样的答案**原样再找一遍**。所以**直接跳过整个内层循环**（\`continue\`）—— 这是第一处去重，注意它的形态是"**事前跳过**"：内层还没开始跑，就知道它毫无意义。另外判断条件里的 \`i > 0\` 不能省：\`i = 0\` 时 \`nums[i - 1]\` 会绕到数组末尾（Python 的负索引特性），比的根本不是"前一个"。`,{i:p,roundOver:!0}),p+=1;continue}m=p+1,h=r-1,f(`pick-i`,`外层固定 \`i = ${p}\`，\`nums[${p}] = ${e}\` —— 它就是这一轮三元组里**最小的那个数**。左指针 \`l = ${m}\`、右指针 \`r = ${h}\`，接下来要在 \`nums[${m}..${h}]\` 里找两个数，使它们的和刚好等于 \`${-e}\`（这样再加上 \`${e}\` 就是 \`0\`）。`,{i:p,l:m,r:h}),g=`inner`;continue}if(g===`inner`){if(m>=h){p+=1,g=`outer`;continue}let e=m,t=h,r=n[p]+n[e]+n[t],i=`\`nums[${p}] + nums[${e}] + nums[${t}]\` = \`${d(n[p])} + ${d(n[e])} + ${d(n[t])} = ${r}\`，`;if(r<0){m+=1,f(`squeeze`,i+"**和太小了**。`i` 已经固定、`r` 又是当前能取到的最大值，唯一能做的就是**把 `l` 往右挪一格**，去够一个更大的数。"+(m>=h?` 挪完 \`l = ${m}\` 已经碰到 \`r\` —— **这一轮结束**。`:``),{i:p,l:m,r:h,sum:r,sumL:e,sumR:t,lFrom:e,roundOver:m>=h});continue}if(r>0){--h,f(`squeeze`,i+"**和太大了**。`i` 已经固定、`l` 又是当前能取到的最小数，唯一能做的就是**把 `r` 往左挪一格**，去够一个更小的数。"+(m>=h?` 挪完 \`r = ${h}\` 已经碰到 \`l\` —— **这一轮结束**。`:``),{i:p,l:m,r:h,sum:r,sumL:e,sumR:t,rFrom:t,roundOver:m>=h});continue}let a=[n[p],n[m],n[h]];s.push(a),f(`hit`,i+` **正好是 \`0\` —— 命中！** 记录一组 \`${l(a)}\`。但别急着移动指针：\`l\` 的右边、\`r\` 的左边，可能还贴着**和它们一模一样的值**，用那些位置当指针会产出和 \`${l(a)}\` 完全相同的三元组。所以下一步必须先**去重**，再各向内走一格。`,{i:p,l:m,r:h,sum:0,sumL:m,sumR:h,hit:a}),g=`dedup`;continue}let e=m,t=h;for(;m<h&&n[m]===n[m+1];)m+=1;for(;m<h&&n[h]===n[h-1];)--h;let i=m===e?null:{from:e,to:m},a=h===t?null:{from:h,to:t};m+=1,--h;let o=[];i?o.push(`\`l\` 从 \`${e}\` 一路跳到 \`${m}\` —— \`nums[${e}..${m}]\` 是同一个值 \`${n[e]}\`，换哪个当下标都是同一个答案。`):o.push(`\`l\` 右边是 \`nums[${e+1}] = ${n[e+1]}\`，和 \`nums[${e}] = ${n[e]}\` 不同，不需要跳。`),a?o.push(`\`r\` 从 \`${t}\` 一路退到 \`${h}\` —— \`nums[${h}..${t}]\` 是同一个值 \`${n[t]}\`。`):o.push(`\`r\` 左边是 \`nums[${t-1}] = ${n[t-1]}\`，和 \`nums[${t}] = ${n[t]}\` 不同，不需要跳。`),f(`dedup`,`**第二处去重**：`+o.join(``)+` 然后左右各向内走一格，\`l = ${m}\`、\`r = ${h}\`。`+(m>=h?" 此时 `l` 和 `r` 已经交叉 —— **这一轮结束**，`i` 前进一格。":``)+` 这处去重的形态和上一处相反：它是"**事后跳过**" —— 必须先把答案记下来，才知道该从哪个位置开始跳。`,{i:p,l:m,r:h,lFrom:e,rFrom:t,dedupL:i,dedupR:a,roundOver:m>=h}),g=`inner`}let _=s.length;return f(`done`,(_===0?"扫描结束，**没有任何**三元组的和为 `0`，返回空列表。":`扫描结束。答案 = \`${u()}\`，一共 **${_} 组**，且两两不重复。`)+` 回头看这趟是怎么走完的：外层 \`i\` 从 \`0\` 推进到 \`${Math.min(p,r-3)}\`，每一轮里 \`l\` 和 \`r\` 从两端往中间夹、两者合计最多走 \`n\` 步，所以内层是 \`O(n)\`，乘上外层就是 **\`O(n²)\`**；再加上开头那次排序 \`O(n log n)\`，总量级仍然是 \`O(n²)\`。空间 \`O(1)\`（不计结果本身）。对比暴力三重循环的 \`O(n³)\`：**多花一个 \`O(n log n)\` 的排序，把内层从 \`O(n²)\` 压到 \`O(n)\`，这笔买卖非常划算**。而且排序顺带把"去重"变成了两处 \`O(1)\` 的值比较 —— **相同的数挨在一起，跳过重复就退化成"跟前一个比一比"。**`,{i:Math.min(p,r-1),l:m,r:h,roundOver:!0,done:!0}),o}var Js=`tz-styles`,Ys=56,Xs=76,Zs=8,Qs=66,$s=128,ec=196,tc=234,nc=22,rc=54,ic=284,ac=48,oc=358,sc=368,cc=40,lc=26,uc=604,dc=1180,fc=`
.tz {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.tz__svg { width: 100%; height: auto; display: block; }

/* ── 顶部小字 ─────────────────────────────────────────────────────────── */
.tz-note {
  fill: var(--tz-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 数组格子 ─────────────────────────────────────────────────────────── */
.tz-cell__box {
  fill: var(--tz-fill, #ffffff);
  stroke: var(--tz-line, #c3c9c2);
  stroke-width: 1.5;
}
.tz-cell__value {
  fill: var(--tz-ink, #1f2a24);
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.tz-cell__ring {
  fill: none;
  stroke: var(--tz-gold, #c2872f);
  stroke-width: 2;
  opacity: 0;
}
/* 外层锚点 i */
.tz-cell.is-i .tz-cell__box {
  fill: var(--tz-hot-fill, #fdf1ec);
  stroke: var(--tz-hot, #a45f45);
  stroke-width: 3;
}
.tz-cell.is-i .tz-cell__value { fill: var(--tz-hot, #a45f45); }
/* 左指针 L */
.tz-cell.is-l .tz-cell__box {
  fill: var(--tz-ok-fill, #eef5f1);
  stroke: var(--tz-ok, #3f6b57);
  stroke-width: 3;
}
.tz-cell.is-l .tz-cell__value { fill: var(--tz-ok, #3f6b57); }
/* 右指针 R */
.tz-cell.is-r .tz-cell__box {
  fill: var(--tz-cool-fill, #eef1f7);
  stroke: var(--tz-cool, #4a5f8a);
  stroke-width: 3;
}
.tz-cell.is-r .tz-cell__value { fill: var(--tz-cool, #4a5f8a); }
/* 本帧命中的三个数（金色 + 外环）—— 注意和上面的"指针状态"分开，见坑 L */
.tz-cell.is-hit .tz-cell__box {
  fill: var(--tz-gold-fill, #fdf6e8);
  stroke: var(--tz-gold, #c2872f);
  stroke-width: 3;
}
.tz-cell.is-hit .tz-cell__value { fill: var(--tz-gold, #c2872f); }
.tz-cell.is-hit .tz-cell__ring { opacity: 1; }
/* 被去重跳过的格子（虚化） */
.tz-cell.is-dup .tz-cell__box {
  fill: var(--tz-dim-fill, #f4f3ef);
  stroke: var(--tz-dim, #b9b9b3);
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
}
.tz-cell.is-dup .tz-cell__value { fill: var(--tz-dim, #b9b9b3); }

/* ── 指针标签 ─────────────────────────────────────────────────────────── */
.tz-pin__tag {
  fill: var(--tz-hot, #a45f45);
}
.tz-pin__tag.is-l { fill: var(--tz-ok, #3f6b57); }
.tz-pin__tag.is-r { fill: var(--tz-cool, #4a5f8a); }
.tz-pin__text {
  fill: var(--tz-paper, #ffffff);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.tz-pin__tick {
  stroke: var(--tz-hot, #a45f45);
  stroke-width: 2;
}
.tz-pin__tick.is-l { stroke: var(--tz-ok, #3f6b57); }
.tz-pin__tick.is-r { stroke: var(--tz-cool, #4a5f8a); }

/* ── 三数之和横幅 ─────────────────────────────────────────────────────── */
.tz-banner__box {
  fill: var(--tz-banner-fill, #f4f2ec);
  stroke: var(--tz-line, #c3c9c2);
  stroke-width: 1.5;
}
.tz-banner__box.is-neg { fill: var(--tz-ok-fill, #eef5f1); stroke: var(--tz-ok, #3f6b57); }
.tz-banner__box.is-pos { fill: var(--tz-cool-fill, #eef1f7); stroke: var(--tz-cool, #4a5f8a); }
.tz-banner__box.is-zero { fill: var(--tz-gold-fill, #fdf6e8); stroke: var(--tz-gold, #c2872f); stroke-width: 2; }
.tz-banner__expr {
  fill: var(--tz-ink, #1f2a24);
  font-size: 16px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.tz-banner__verdict {
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: var(--tz-ink, #1f2a24);
}
.tz-banner__verdict.is-neg { fill: var(--tz-ok, #3f6b57); }
.tz-banner__verdict.is-pos { fill: var(--tz-cool, #4a5f8a); }
.tz-banner__verdict.is-zero { fill: var(--tz-gold, #c2872f); }

/* ── 结果 chips ───────────────────────────────────────────────────────── */
.tz-list__title {
  fill: var(--tz-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.tz-chip__box {
  fill: var(--tz-gold-fill, #fdf6e8);
  stroke: var(--tz-gold, #c2872f);
  stroke-width: 1.5;
}
.tz-chip__text {
  fill: var(--tz-gold, #c2872f);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.tz-list__empty {
  fill: var(--tz-dim, #b9b9b3);
  font-size: 13.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.tz-empty__text {
  fill: var(--tz-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function pc(){if(document.getElementById(Js))return;let e=document.createElement(`style`);e.id=Js,e.textContent=fc,document.head.appendChild(e)}var mc=e=>e<0?`(${e})`:`${e}`;function hc(e,t={}){if(!e||e.dataset.tzMounted===`1`)return{destroy(){}};e.dataset.tzMounted=`1`,pc();let n=qs(t),r=t.autoplay!==!1,i=n[0].arr,a=n[0].original,o=i.length,s=Y,c=document.createElement(`div`);c.className=`viz tz`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(o<3){let t=s(`svg`,{class:`viz__svg tz__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`tz-empty__text`,x:620/2,y:120/2});return n.textContent=`数组只有 ${o} 个数，凑不出三元组`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),{destroy(){e.textContent=``,delete e.dataset.tzMounted,document.getElementById(Js)?.remove()}}}let d=Xs,f=Zs,p=o*d+(o-1)*f;if(p>uc){let e=uc/p;d=Math.max(26,Math.floor(d*e)),f=Math.max(3,Math.floor(f*e))}let m=i.reduce((e,t)=>Math.max(e,String(t).length),1),h=Math.max(11,Math.min(20,Math.floor((d-12)/Math.max(m,3))+6)),g=o*d+(o-1)*f,_=Math.max(660,lc*2+g),v=(_-g)/2,y=e=>v+e*(d+f),b=e=>y(e)+d/2,x=_-lc*2,S=s(`svg`,{class:`viz__svg tz__svg`,viewBox:`0 0 ${_} 430`,role:`img`,"aria-label":`三数之和推演动画`});l.appendChild(S);let C=s(`g`,{class:`tz-notes`}),w=s(`g`,{class:`tz-cells`}),T=s(`g`,{class:`tz-marks`});S.appendChild(C),S.appendChild(w),S.appendChild(T);let E=s(`text`,{class:`tz-note`,x:lc,y:Qs});E.textContent=`原数组 [${a.join(`, `)}] · 已排序 → [${i.join(`, `)}]`,C.appendChild(E);let D=[];for(let e=0;e<o;e+=1){let t=y(e),n=s(`g`,{class:`tz-cell`});n.appendChild(s(`rect`,{class:`tz-cell__ring`,x:t-5,y:$s-5,width:d+10,height:66,rx:11})),n.appendChild(s(`rect`,{class:`tz-cell__box`,x:t,y:$s,width:d,height:Ys,rx:8}));let r=s(`text`,{class:`tz-cell__value`,x:b(e),y:156,style:`font-size:${h}px`});r.textContent=String(i[e]),n.appendChild(r),w.appendChild(n),D.push({g:n,id:e})}function O(e){let t=s(`line`,{class:`tz-pin__tick ${e}`,x1:0,y1:0,x2:0,y2:0}),n=s(`rect`,{class:`tz-pin__tag ${e}`,x:0,y:0,width:rc,height:nc,rx:6}),r=s(`text`,{class:`tz-pin__text`,x:0,y:0});return T.appendChild(t),T.appendChild(n),T.appendChild(r),{tick:t,tag:n,text:r}}let k=s(`path`,{class:`tz-pin__tag`,d:`M 0 0 L 0 0 L 0 0`}),A=s(`rect`,{class:`tz-pin__tag`,x:0,y:0,width:rc,height:nc,rx:6}),j=s(`text`,{class:`tz-pin__text`,x:0,y:0});T.appendChild(k),T.appendChild(A),T.appendChild(j);let M=O(`is-l`),N=O(`is-r`),P=s(`rect`,{class:`tz-banner__box`,x:lc,y:ic,width:x,height:ac,rx:9}),F=s(`text`,{class:`tz-banner__expr`,x:42,y:308}),I=s(`text`,{class:`tz-banner__verdict`,x:lc+x-16,y:308});T.appendChild(P),T.appendChild(F),T.appendChild(I);let L=s(`text`,{class:`tz-list__title`,x:lc,y:oc});T.appendChild(L);let R=s(`text`,{class:`tz-list__empty`,x:lc,y:388});R.textContent=`（还没有找到任何一组）`,T.appendChild(R);let z=n.flatMap(e=>e.results).reduce((e,t)=>Math.max(e,`[${t.join(`, `)}]`.length),0),B=Math.min(150,Math.max(74,Math.round(z*15*.62)+26)),V=Math.max(1,Math.floor(614/(B+10))),H=[];for(let e=0;e<V;e+=1){let t=lc+e*(B+10),n=s(`g`,{class:`tz-chip`});n.appendChild(s(`rect`,{class:`tz-chip__box`,x:t,y:sc,width:B,height:cc,rx:8}));let r=s(`text`,{class:`tz-chip__text`,x:t+B/2,y:388,style:`font-size:15px`});n.appendChild(r),T.appendChild(n),H.push({g:n,t:r})}let U=s(`text`,{class:`tz-list__empty`,x:lc+V*(B+10),y:388});T.appendChild(U);let ee=u();function W(e,t){if(!t)return;let n=t.i,r=t.l,a=t.r,s=t.phase,c=s===`done`,l=r>=0&&r===a,u=new Set;s===`hit`&&t.sumL!==null&&(u.add(t.i),u.add(t.sumL),u.add(t.sumR));let d=new Set;if(t.dedupL)for(let e=t.dedupL.from;e<=t.dedupL.to;e+=1)d.add(e);if(t.dedupR)for(let e=t.dedupR.from;e<=t.dedupR.to;e+=1)d.add(e);let f=s===`skip-i`?t.i:null;for(let e of D){let{g:t,id:i}=e;if(c){t.setAttribute(`class`,`tz-cell`);continue}let o=[`tz-cell`];(d.has(i)||i===f)&&o.push(`is-dup`),u.has(i)&&o.push(`is-hit`),i===r&&r>=0&&o.push(`is-l`),i===a&&a>=0&&!l&&o.push(`is-r`),i===n&&n>=0&&i!==f&&o.push(`is-i`),t.setAttribute(`class`,o.join(` `))}if(!c&&n>=0&&n<o){let e=b(n),t=$s-2,r=t-11;k.setAttribute(`d`,`M ${e-7} ${r} L ${e+7} ${r} L ${e} ${t} z`),k.style.opacity=`1`,A.setAttribute(`x`,e-rc/2),A.setAttribute(`y`,r-nc-5),j.setAttribute(`x`,e),j.setAttribute(`y`,r-nc/2-5),j.textContent=`i=${n}`,A.style.opacity=`1`,j.style.opacity=`1`}else k.style.opacity=`0`,A.style.opacity=`0`,j.style.opacity=`0`;let p=(e,t,n,r)=>{if(t<0||t>=o){e.tick.style.opacity=`0`,e.tag.style.opacity=`0`,e.text.style.opacity=`0`;return}let i=b(t);e.tick.setAttribute(`x1`,i),e.tick.setAttribute(`x2`,i),e.tick.setAttribute(`y1`,187),e.tick.setAttribute(`y2`,n-3),e.tick.style.opacity=`1`,e.tag.setAttribute(`x`,i-rc/2),e.tag.setAttribute(`y`,n),e.text.setAttribute(`x`,i),e.text.setAttribute(`y`,n+nc/2),e.text.textContent=`${r}=${t}`,e.tag.style.opacity=`1`,e.text.style.opacity=`1`};c?(p(M,-1,ec,`L`),p(N,-1,tc,`R`)):l?(p(M,r,ec,`L=R`),p(N,-1,tc,`R`)):(p(M,r,ec,`L`),p(N,a,tc,`R`));let m=`tz-banner__box`,h=`tz-banner__verdict`;t.sum===null?(F.textContent=s===`init`?`等待开始 · 共 ${o} 个数`:s===`pick-i`?`固定 nums[${n}] = ${i[n]}，在 [${r}..${a}] 里找和为 ${-i[n]} 的两个数`:s===`skip-i`?`nums[${n}] = ${i[n]} 与上一轮同值 —— 整轮跳过`:s===`prune`?`nums[${n}] = ${i[n]} > 0 —— 外层提前结束`:t.results.length===0?`没有和为 0 的三元组`:`结束 · 共 ${t.results.length} 组答案`,I.textContent=s===`pick-i`?`双指针夹逼`:s===`done`?`${t.results.length} 组`:``):(F.textContent=`${mc(i[n])} + ${mc(i[t.sumL])} + ${mc(i[t.sumR])} = ${t.sum}`,t.sum<0?(m+=` is-neg`,h+=` is-neg`,I.textContent=`< 0 · 左指针右移`):t.sum>0?(m+=` is-pos`,h+=` is-pos`,I.textContent=`> 0 · 右指针左移`):(m+=` is-zero`,h+=` is-zero`,I.textContent=`= 0 · 命中`)),P.setAttribute(`class`,m),I.setAttribute(`class`,h);let g=t.results;L.textContent=`已收集的三元组（${g.length} 组）`,R.style.opacity=g.length===0?`1`:`0`,H.forEach((e,t)=>{let n=g[t];if(n===void 0){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`,e.t.textContent=`[${n.join(`, `)}]`}),g.length>V?(U.textContent=`+${g.length-V}`,U.style.opacity=`1`):U.style.opacity=`0`,Z(ee,t.desc)}c.appendChild(ee);let G=Q();c.appendChild(G.root),e.textContent=``,e.appendChild(c),X();let K=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,te=$({steps:n,controls:G,intervalMs:dc,onRender:W});te.jumpTo(Math.trunc(t.initialStep)||0);let ne=null;return r&&!K&&typeof IntersectionObserver==`function`&&(ne=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){ne.disconnect(),ne=null,te.play();return}},{threshold:.35}),ne.observe(c)),{destroy(){ne&&=(ne.disconnect(),null),te.destroy(),e.textContent=``,delete e.dataset.tzMounted,document.getElementById(Js)?.remove()}}}var gc=[0,1,0,2,1,0,1,3,2,1,2,1];function _c(e={}){let t=Array.isArray(e.height)?e.height:gc,n=t.length,r=Number.isInteger(e.maxSteps)?e.maxSteps:400,i={height:[...t],water:Array(n).fill(0),l:0,r:n-1,leftMax:0,rightMax:0,side:null,idx:null,gained:0,total:0};if(n<3)return[{...i,r:n===0?-1:n-1,phase:`done`,desc:`只有 \`${n}\` 根柱子 —— 少于三根就围不出凹槽，**接不住任何水**，答案是 \`0\`。`,done:!0}];let a=[],o=Array(n).fill(0),s=0,c=n-1,l=0,u=0,d=0,f=0,p=(e,t,n={})=>{a.push({...i,water:[...o],l:s,r:c,leftMax:l,rightMax:u,total:d,phase:e,desc:t,done:e===`done`,...n})};for(p(`init`,`给出了 \`${n}\` 根柱子的高度图 \`[${t.join(`, `)}]\`。先想清楚一件事：**位置 \`i\` 能存多少水，只取决于它左边最高的柱子和右边最高的柱子** —— 水会从矮的那一边漏出去，能留住的高度是两者的**短板**，也就是 \`water[i] = max(0, min(左最高, 右最高) - height[i])\`。所以整题其实只在问一句话：**每个位置的"左右最高"分别是多少？** 后面四种解法的全部区别，就是"怎么拿到这两个数"。双指针的做法是：**两端各派一个指针往中间夹**，一边走一边记录"这一侧到目前为止见过的最高"（\`leftMax\` 和 \`rightMax\`），**谁矮就先结算谁**。`);s<c&&(f+=1,!(f>r));){let e=t[s],n=t[c];if(e<n){let t=l;l=Math.max(l,e);let r=l-e;d+=r,o[s]=r,p(`settle-l`,`\`l = ${s}\`、\`r = ${c}\`。比较两端：\`height[${s}] = ${e}\` **<** \`height[${c}] = ${n}\` —— **左端更矮，结算左边这一格**。为什么敢现在就定它的水位？因为 \`${s}\` 的右边至少有一根高度 \`>= ${n}\` 的柱子（就是 \`r\` 自己那根），而 \`${n} > ${e}\` —— 它的"右侧最高"一定严格大于它自己的高度，**右边不可能成为短板**；真正决定水位的只可能是左侧，而 \`leftMax\` 是我们一路扫过来已经确切知道的数。结算：\`leftMax = max(${t}, ${e}) = ${l}\`，这一格的水 = \`${l} - ${e} = ${r}\``+(r===0?`（**它是目前左边最高的柱子**，自己就是边界，存不住水）。`:`。`),{side:`l`,idx:s,gained:r,leftMax:l,total:d}),s+=1}else{let t=u;u=Math.max(u,n);let r=u-n;d+=r,o[c]=r,p(`settle-r`,`\`l = ${s}\`、\`r = ${c}\`。比较两端：\`height[${s}] = ${e}\` **>=** \`height[${c}] = ${n}\` —— **右端更矮（或一样高），结算右边这一格**。道理是对称的：\`${c}\` 的左边至少有一根高度 \`>= ${e}\` 的柱子（就是 \`l\` 自己那根），而 \`${e} >= ${n}\` —— 它的"左侧最高"不会成为短板，水位只能由右侧决定，而 \`rightMax\` 是我们从右扫过来已经确切知道的数。结算：\`rightMax = max(${t}, ${n}) = ${u}\`，这一格的水 = \`${u} - ${n} = ${r}\``+(r===0?`（**它是目前右边最高的柱子**，自己就是边界，存不住水）。`:`。`),{side:`r`,idx:c,gained:r,rightMax:u,total:d}),--c}}let m=o.map((e,t)=>e>0?t:-1).filter(e=>e>=0);return p(`done`,(d===0?`扫描结束，**一滴水都接不住**（没有形成任何凹槽）。`:`扫描结束。**答案 = \`${d}\`** 单位的水，落在下标 \`[${m.join(`, `)}]\` 这几格上。`)+' 回头看这趟：`l` 和 `r` 从两端往中间走，**每一次只动一个指针，两个指针合计最多走 `n` 步** —— 所以是 `O(n)` 时间。全程只用了 `l`、`r`、`leftMax`、`rightMax`、`ans` 五个变量 —— **`O(1)` 空间**，比动态规划那两个数组的版本还省。它为什么能省掉那两个数组？因为**它根本不需要知道"每个位置的两侧最高"** —— 它只在"较矮的那一端"结算，而那一端的水位恰好已经确定。',{side:null,idx:null,gained:0,done:!0}),a}var vc=`trw-styles`,yc=54,bc=88,xc=46,Sc=158,Cc=320,wc=46,Tc=3,Ec=14,Dc=336,Oc=352,kc=380,Ac=22,jc=54,Mc=26,Nc=604,Pc=1250,Fc=`
.trw {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.trw__svg { width: 100%; height: auto; display: block; }

/* ── 顶部小字 ─────────────────────────────────────────────────────────── */
.trw-note {
  fill: var(--trw-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 地面 ─────────────────────────────────────────────────────────────── */
.trw-ground { stroke: var(--trw-line-strong, #9aa39c); stroke-width: 2; }

/* ── 柱子 ─────────────────────────────────────────────────────────────── */
.trw-bar__box {
  fill: var(--trw-bar-fill, #efece4);
  stroke: var(--trw-line, #c3c9c2);
  stroke-width: 1.5;
}
.trw-bar__h {
  fill: var(--trw-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 水：画在柱子头顶 */
.trw-bar__water {
  fill: var(--trw-water, #7fa8c9);
  stroke: var(--trw-water-line, #4a7fa8);
  stroke-width: 1.5;
}
/* 本帧刚结算的那一格（金色粗边 + 外环）—— 和指针状态分开，见坑 L */
.trw-bar.is-cur .trw-bar__box {
  fill: var(--trw-gold-fill, #fdf6e8);
  stroke: var(--trw-gold, #c2872f);
  stroke-width: 3;
}
.trw-bar.is-cur .trw-bar__h { fill: var(--trw-gold, #c2872f); }
.trw-bar__ring {
  fill: none;
  stroke: var(--trw-gold, #c2872f);
  stroke-width: 2;
  opacity: 0;
}
.trw-bar.is-cur .trw-bar__ring { opacity: 1; }

/* ── 指针 ─────────────────────────────────────────────────────────────── */
.trw-pin__tag { fill: var(--trw-ok, #3f6b57); }
.trw-pin__tag.is-r { fill: var(--trw-cool, #4a5f8a); }
.trw-pin__text {
  fill: var(--trw-paper, #ffffff);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trw-pin__tick { stroke: var(--trw-ok, #3f6b57); stroke-width: 2; }
.trw-pin__tick.is-r { stroke: var(--trw-cool, #4a5f8a); }

/* ── 下标 ─────────────────────────────────────────────────────────────── */
.trw-idx {
  fill: var(--trw-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.trw-banner__box {
  fill: var(--trw-banner-fill, #f4f2ec);
  stroke: var(--trw-line, #c3c9c2);
  stroke-width: 1.5;
}
.trw-banner__seg {
  fill: var(--trw-muted, #657168);
  font-size: 13.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trw-banner__label {
  fill: var(--trw-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trw-banner__ans {
  fill: var(--trw-water-line, #4a7fa8);
  font-size: 21px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.trw-empty__text {
  fill: var(--trw-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function Ic(){if(document.getElementById(vc))return;let e=document.createElement(`style`);e.id=vc,e.textContent=Fc,document.head.appendChild(e)}function Lc(e,t={}){if(!e||e.dataset.trwMounted===`1`)return{destroy(){}};e.dataset.trwMounted=`1`,Ic();let n=_c(t),r=t.autoplay!==!1,i=n[0].height,a=i.length,o=Y,s=document.createElement(`div`);s.className=`viz trw`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);function l(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(a<3){let t=o(`svg`,{class:`viz__svg trw__svg`,viewBox:`0 0 620 120`,role:`img`}),n=o(`text`,{class:`trw-empty__text`,x:620/2,y:120/2});return n.textContent=`只有 ${a} 根柱子，围不出凹槽，接不住水`,t.appendChild(n),c.appendChild(t),s.appendChild(l()),s.appendChild(Q().root),e.textContent=``,e.appendChild(s),{destroy(){e.textContent=``,delete e.dataset.trwMounted,document.getElementById(vc)?.remove()}}}let u=wc;a*u+(a-1)*Tc>Nc&&(u=Math.max(8,Math.floor((Nc-(a-1)*Tc)/a)));let d=a*u+(a-1)*Tc,f=Math.max(660,Mc*2+d),p=(f-d)/2,m=e=>p+e*(u+Tc),h=e=>m(e)+u/2,g=Math.max(...i),_=Sc/Math.max(g,1),v=e=>Cc-e*_,y=f-Mc*2,b=o(`svg`,{class:`viz__svg trw__svg`,viewBox:`0 0 ${f} 422`,role:`img`,"aria-label":`接雨水双指针推演动画`});c.appendChild(b);let x=o(`g`,{class:`trw-waters`}),S=o(`g`,{class:`trw-bars`}),C=o(`g`,{class:`trw-marks`});b.appendChild(x),b.appendChild(S),b.appendChild(C);let w=o(`text`,{class:`trw-note`,x:Mc,y:yc});w.textContent=`每格的水 = max(0, min(左最高, 右最高) - 自身高度) · 谁矮先结算谁`,C.appendChild(w);let T=o(`line`,{class:`trw-ground`,x1:p-10,y1:Cc,x2:p+d+10,y2:Cc});C.appendChild(T);let E=[];for(let e=0;e<a;e+=1){let t=m(e),n=o(`g`,{class:`trw-bar`});n.appendChild(o(`rect`,{class:`trw-bar__ring`,x:t-4,y:v(i[e])-4,width:u+8,height:Math.max(6,i[e]*_+8),rx:5})),n.appendChild(o(`rect`,{class:`trw-bar__box`,x:t,y:v(i[e]),width:u,height:Math.max(2,i[e]*_),rx:3}));let r=o(`text`,{class:`trw-bar__h`,x:h(e),y:Cc-Ec});r.textContent=String(i[e]),n.appendChild(r),S.appendChild(n);let a=o(`rect`,{class:`trw-bar__water`,x:t,y:v(i[e]),width:u,height:0,rx:2});x.appendChild(a),E.push({g:n,w:a,id:e})}for(let e=0;e<a;e+=1){let t=o(`text`,{class:`trw-idx`,x:h(e),y:Dc});t.textContent=String(e),C.appendChild(t)}function D(e){let t=o(`line`,{class:`trw-pin__tick ${e}`,x1:0,y1:0,x2:0,y2:0}),n=o(`rect`,{class:`trw-pin__tag ${e}`,x:0,y:0,width:jc,height:Ac,rx:6}),r=o(`text`,{class:`trw-pin__text`,x:0,y:0});return C.appendChild(t),C.appendChild(n),C.appendChild(r),{tick:t,tag:n,text:r}}let O=D(`is-l`),k=D(`is-r`),A=o(`rect`,{class:`trw-banner__box`,x:Mc,y:bc,width:y,height:xc,rx:9});C.appendChild(A);let j=o(`text`,{class:`trw-banner__seg`,x:44,y:111}),M=o(`text`,{class:`trw-banner__seg`,x:196,y:111});C.appendChild(j),C.appendChild(M);let N=o(`text`,{class:`trw-banner__label`,x:Mc+y-68,y:111});N.textContent=`累计水量`,C.appendChild(N);let P=o(`text`,{class:`trw-banner__ans`,x:Mc+y-18,y:111});P.textContent=`0`,C.appendChild(P);let F=l();function I(e,t){if(!t)return;let n=t.l,r=t.r,o=t.idx,s=t.water,c=t.phase===`done`;for(let e of E){let{g:t,w:n,id:r}=e,a=s[r];if(a>0){let e=v(i[r]+a);n.setAttribute(`y`,e),n.setAttribute(`height`,a*_),n.style.opacity=`1`}else n.style.opacity=`0`,n.setAttribute(`height`,0);let l=[`trw-bar`];!c&&r===o&&l.push(`is-cur`),t.setAttribute(`class`,l.join(` `))}let l=(e,t,i,o)=>{if(c||t<0||t>=a){e.tick.style.opacity=`0`,e.tag.style.opacity=`0`,e.text.style.opacity=`0`;return}let s=h(t);e.tick.setAttribute(`x1`,s),e.tick.setAttribute(`x2`,s),e.tick.setAttribute(`y1`,324),e.tick.setAttribute(`y2`,i-3),e.tick.style.opacity=`1`,e.tag.setAttribute(`x`,s-jc/2),e.tag.setAttribute(`y`,i),e.text.setAttribute(`x`,s),e.text.setAttribute(`y`,i+Ac/2),e.text.textContent=n===r?`${o===`L`?`L=R`:`R`}=${t}`:`${o}=${t}`,e.tag.style.opacity=`1`,e.text.style.opacity=`1`};n===r?(l(O,n,Oc,`L`),k.tick.style.opacity=`0`,k.tag.style.opacity=`0`,k.text.style.opacity=`0`):(l(O,n,Oc,`L`),l(k,r,kc,`R`)),j.textContent=`leftMax = ${t.leftMax}`,M.textContent=`rightMax = ${t.rightMax}`,P.textContent=String(t.total),Z(F,t.desc)}s.appendChild(F);let L=Q();s.appendChild(L.root),e.textContent=``,e.appendChild(s),X();let R=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,z=$({steps:n,controls:L,intervalMs:Pc,onRender:I});z.jumpTo(Math.trunc(t.initialStep)||0);let B=null;return r&&!R&&typeof IntersectionObserver==`function`&&(B=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){B.disconnect(),B=null,z.play();return}},{threshold:.35}),B.observe(s)),{destroy(){B&&=(B.disconnect(),null),z.destroy(),e.textContent=``,delete e.dataset.trwMounted,document.getElementById(vc)?.remove()}}}var Rc=[0,1,0,2,1,0,1,3,2,1,2,1];function zc(e={}){let t=Array.isArray(e.height)?e.height:Rc,n=t.length,r=Number.isInteger(e.maxSteps)?e.maxSteps:400,i={height:[...t],water:Array(n).fill(0),i:-1,stack:[],bottom:null,leftBound:null,rightBound:null,width:null,layerH:null,level:null,gained:0,total:0};if(n<3)return[{...i,phase:`done`,desc:`只有 \`${n}\` 根柱子 —— 少于三根就围不出凹槽，**接不住任何水**，答案是 \`0\`。`,done:!0}];let a=[],o=Array(n).fill(0),s=[],c=0,l=0,u=(e,t,n={})=>{a.push({...i,water:[...o],stack:[...s],total:c,phase:e,desc:t,done:e===`done`,...n})};u(`init`,`还是这排柱子 \`[${t.join(`, `)}]\`，但**换一种切法**。前面两种解法（暴力 / 动态规划 / 双指针）都是**竖着切**：站在位置 \`i\` 上问"我头顶能存多少水"，一次算完一整列。单调栈是**横着切**：不问每一列，而是**找到一个凹槽就结算一整层**。做法是：用一个栈存**下标**，并让这些下标对应的高度**单调递减**。一旦遇到一根**比栈顶更高**的柱子，就说明凹槽的右边界出现了 —— 栈顶那个是槽底，弹出后的新栈顶是左边界，当前这根是右边界，于是可以算这一层：\`宽 = 右边界 - 左边界 - 1\`，\`高 = min(左边界高, 右边界高) - 槽底高\`，\`水量 += 宽 × 高\`。**这个视角最直观的差别是：同一个位置的水可能被分几次加上**（一次一层）。官方例里下标 5 那 2 单位的水就是这么来的 —— 留意它。`);for(let e=0;e<n&&(l+=1,!(l>r));e+=1){let n=t[e];for(;s.length>0&&n>t[s[s.length-1]];){let r=s.pop(),i=t[r];if(s.length===0){u(`settle`,`\`i = ${e}\`，\`height[${e}] = ${n}\` **>** 栈顶 \`height[${r}] = ${i}\` —— 右边界出现了。弹出槽底 \`${r}\`，可此时栈**空了** —— **只有右边界、没有左边界，围不出凹槽**，这一层结算为 \`0\`。（这就是代码里 \`if not stack: break\` 那一行的意思。）`,{i:e,bottom:r,gained:0,width:0,layerH:0,level:0});break}let a=s[s.length-1],l=t[a],d=Math.min(n,l),f=d-i,p=e-a-1;if(f>0)for(let n=a+1;n<e;n+=1)o[n]=Math.max(o[n],d-t[n]);let m=p*f;c+=m,u(`settle`,`\`i = ${e}\`，\`height[${e}] = ${n}\` **>** 栈顶 \`height[${r}] = ${i}\` —— 右边界出现了。弹出槽底 \`${r}\`（高度 \`${i}\`）；弹出后的新栈顶 \`${a}\`（高度 \`${l}\`）就是**左边界**，当前这根 \`${e}\`（高度 \`${n}\`）是**右边界**。这一层的水位由两边**较矮的那根**决定：\`min(${n}, ${l}) = ${d}\`。于是 \`高 = ${d} - ${i} = ${f}\`，\`宽 = ${e} - ${a} - 1 = ${p}\`，水量 += \`${p} × ${f} = ${m}\`。`,{i:e,bottom:r,leftBound:a,rightBound:e,width:p,layerH:f,level:d,gained:m})}s.push(e),u(`push`,`\`i = ${e}\`，\`height[${e}] = ${n}\`。`+(s.length>1?`它不高于栈顶 \`height[${s[s.length-2]}] = ${t[s[s.length-2]]}\`，栈内高度保持**递减**，直接压入。`:`栈是空的，直接压入。`)+` 栈 = \`[${s.join(`, `)}]\`。`,{i:e})}let d=o.map((e,t)=>e>0?t:-1).filter(e=>e>=0);return u(`done`,(c===0?`扫描结束，**一滴水都接不住**。`:`扫描结束。**答案 = \`${c}\`** 单位的水，落在下标 \`[${d.join(`, `)}]\` 这几格上。`)+' 和双指针那边的答案**一模一样** —— 它们只是**切法不同**：双指针是竖着切（一次算完一整列），单调栈是横着切（一次填满一层）。回头看下标 5 那格：它的 `2` 单位水是**分两次**加上的 —— `i = 6` 时加了 1 层，`i = 7` 时又加了 1 层。这就是"按层累加"最硬的证据。复杂度：每个下标**恰好入栈一次、出栈一次**，`while` 的总执行次数不超过 `n` —— 所以是 `O(n)` 时间、**`O(n)` 空间**（栈最坏能装下全部下标）。',{i:n-1,done:!0}),a}var Bc=`trs-styles`,Vc=54,Hc=88,Uc=46,Wc=158,Gc=320,Kc=46,qc=3,Jc=14,Yc=336,Xc=20,Zc=362,Qc=376,$c=34,el=34,tl=4,nl=26,rl=604,il=1100,al=`
.trs {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.trs__svg { width: 100%; height: auto; display: block; }

.trs-note {
  fill: var(--trs-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.trs-ground { stroke: var(--trs-line-strong, #9aa39c); stroke-width: 2; }

/* ── 柱子 ─────────────────────────────────────────────────────────────── */
.trs-bar__box {
  fill: var(--trs-bar-fill, #efece4);
  stroke: var(--trs-line, #c3c9c2);
  stroke-width: 1.5;
}
.trs-bar__h {
  fill: var(--trs-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 已接住的水（常态蓝色） */
.trs-bar__water {
  fill: var(--trs-water, #7fa8c9);
  stroke: var(--trs-water-line, #4a7fa8);
  stroke-width: 1.5;
}
/* ⚠️ 本帧**新增**的那一层：淡金填充 + 金色实线边框。
   初版用 rgba 半透明 + 虚线 —— 虚线在视觉语言里是"被排除/禁用"，
   而这里恰恰是"本帧刚加上的水"，语义完全反了；半透明叠在已有的蓝色水上
   又会混成一种说不清的灰。改成实线 + 不透明淡金，和水（蓝）一眼分开。 */
.trs-layer {
  fill: var(--trs-layer-fill, #fdeecb);
  stroke: var(--trs-gold, #c2872f);
  stroke-width: 2.5;
}
/* 扫描下标 i 指向的柱子 */
.trs-bar.is-scan .trs-bar__box {
  fill: var(--trs-hot-fill, #fdf1ec);
  stroke: var(--trs-hot, #a45f45);
  stroke-width: 3;
}
.trs-bar.is-scan .trs-bar__h { fill: var(--trs-hot, #a45f45); }

/* 扫描指针：柱子上方朝下的三角 */
.trs-scan__tri { fill: var(--trs-hot, #a45f45); }
.trs-scan__text {
  fill: var(--trs-hot, #a45f45);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.trs-idx {
  fill: var(--trs-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 栈 ───────────────────────────────────────────────────────────────── */
.trs-stack__title {
  fill: var(--trs-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trs-slot__box {
  fill: var(--trs-fill, #ffffff);
  stroke: var(--trs-line, #c3c9c2);
  stroke-width: 1.5;
}
.trs-slot__idx {
  fill: var(--trs-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trs-slot__h {
  fill: var(--trs-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 栈顶那一格 */
.trs-slot.is-top .trs-slot__box {
  fill: var(--trs-gold-fill, #fdf6e8);
  stroke: var(--trs-gold, #c2872f);
  stroke-width: 2.5;
}
.trs-slot.is-top .trs-slot__idx { fill: var(--trs-gold, #c2872f); }
.trs-stack__empty {
  fill: var(--trs-dim, #b9b9b3);
  font-size: 13px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.trs-banner__box {
  fill: var(--trs-banner-fill, #f4f2ec);
  stroke: var(--trs-line, #c3c9c2);
  stroke-width: 1.5;
}
.trs-banner__seg {
  fill: var(--trs-muted, #657168);
  font-size: 13.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trs-banner__label {
  fill: var(--trs-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trs-banner__ans {
  fill: var(--trs-water-line, #4a7fa8);
  font-size: 21px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.trs-empty__text {
  fill: var(--trs-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function ol(){if(document.getElementById(Bc))return;let e=document.createElement(`style`);e.id=Bc,e.textContent=al,document.head.appendChild(e)}function sl(e,t={}){if(!e||e.dataset.trsMounted===`1`)return{destroy(){}};e.dataset.trsMounted=`1`,ol();let n=zc(t),r=t.autoplay!==!1,i=n[0].height,a=i.length,o=Y,s=document.createElement(`div`);s.className=`viz trs`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);function l(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(a<3){let t=o(`svg`,{class:`viz__svg trs__svg`,viewBox:`0 0 620 120`,role:`img`}),n=o(`text`,{class:`trs-empty__text`,x:620/2,y:120/2});return n.textContent=`只有 ${a} 根柱子，围不出凹槽，接不住水`,t.appendChild(n),c.appendChild(t),s.appendChild(l()),s.appendChild(Q().root),e.textContent=``,e.appendChild(s),{destroy(){e.textContent=``,delete e.dataset.trsMounted,document.getElementById(Bc)?.remove()}}}let u=Kc;a*u+(a-1)*qc>rl&&(u=Math.max(8,Math.floor((rl-(a-1)*qc)/a)));let d=a*u+(a-1)*qc,f=Math.max(660,nl*2+d),p=(f-d)/2,m=e=>p+e*(u+qc),h=e=>m(e)+u/2,g=Math.max(...i),_=Wc/Math.max(g,1),v=e=>Gc-e*_,y=$c;a*y+(a-1)*tl>rl&&(y=Math.max(14,Math.floor((rl-(a-1)*tl)/a)));let b=(f-(a*y+(a-1)*tl))/2,x=f-nl*2,S=o(`svg`,{class:`viz__svg trs__svg`,viewBox:`0 0 ${f} 430`,role:`img`,"aria-label":`接雨水单调栈推演动画`});c.appendChild(S);let C=o(`g`,{class:`trs-waters`}),w=o(`g`,{class:`trs-bars`}),T=o(`g`,{class:`trs-layers`}),E=o(`g`,{class:`trs-marks`});S.appendChild(C),S.appendChild(w),S.appendChild(T),S.appendChild(E);let D=o(`text`,{class:`trs-note`,x:nl,y:Vc});D.textContent=`横着切：栈内高度递减，遇到更高的柱子就结算一层`,E.appendChild(D),E.appendChild(o(`line`,{class:`trs-ground`,x1:p-10,y1:Gc,x2:p+d+10,y2:Gc}));let O=[];for(let e=0;e<a;e+=1){let t=m(e),n=o(`g`,{class:`trs-bar`});n.appendChild(o(`rect`,{class:`trs-bar__box`,x:t,y:v(i[e]),width:u,height:Math.max(2,i[e]*_),rx:3}));let r=o(`text`,{class:`trs-bar__h`,x:h(e),y:Gc-Jc});r.textContent=String(i[e]),n.appendChild(r),w.appendChild(n);let a=o(`rect`,{class:`trs-bar__water`,x:t,y:v(i[e]),width:u,height:0,rx:2});C.appendChild(a),O.push({g:n,w:a,id:e})}let k=o(`rect`,{class:`trs-layer`,x:0,y:0,width:0,height:0,rx:2});T.appendChild(k);for(let e=0;e<a;e+=1){let t=o(`text`,{class:`trs-idx`,x:h(e),y:Yc});t.textContent=String(e),E.appendChild(t)}let A=o(`path`,{class:`trs-scan__tri`,d:`M 0 0 L 0 0 L 0 0`}),j=o(`text`,{class:`trs-scan__text`,x:0,y:0});E.appendChild(A),E.appendChild(j);let M=o(`text`,{class:`trs-stack__title`,x:nl,y:Zc});M.textContent=`栈（左 = 栈底，右 = 栈顶）· 只存下标`,E.appendChild(M);let N=o(`text`,{class:`trs-stack__empty`,x:b,y:393});N.textContent=`（栈是空的）`,E.appendChild(N);let P=[];for(let e=0;e<a;e+=1){let t=b+e*(y+tl),n=o(`g`,{class:`trs-slot`});n.appendChild(o(`rect`,{class:`trs-slot__box`,x:t,y:Qc,width:y,height:el,rx:5}));let r=o(`text`,{class:`trs-slot__idx`,x:t+y/2,y:389});n.appendChild(r);let i=o(`text`,{class:`trs-slot__h`,x:t+y/2,y:402});n.appendChild(i),E.appendChild(n),P.push({g:n,idxT:r,hT:i})}E.appendChild(o(`rect`,{class:`trs-banner__box`,x:nl,y:Hc,width:x,height:Uc,rx:9}));let F=o(`text`,{class:`trs-banner__seg`,x:44,y:111});E.appendChild(F);let I=o(`text`,{class:`trs-banner__label`,x:nl+x-68,y:111});I.textContent=`累计水量`,E.appendChild(I);let L=o(`text`,{class:`trs-banner__ans`,x:nl+x-18,y:111});L.textContent=`0`,E.appendChild(L);let R=l();function z(e,t){if(!t)return;let n=t.stack??[],r=t.i,o=t.water,s=t.phase===`done`;for(let e of O){let{g:t,w:n,id:a}=e,c=o[a];c>0?(n.setAttribute(`y`,v(i[a]+c)),n.setAttribute(`height`,c*_),n.style.opacity=`1`):(n.style.opacity=`0`,n.setAttribute(`height`,0));let l=[`trs-bar`];!s&&a===r&&l.push(`is-scan`),t.setAttribute(`class`,l.join(` `))}if(!s&&t.phase===`settle`&&t.leftBound!==null&&t.layerH>0){let e=m(t.leftBound+1),n=m(t.rightBound-1)+u,r=v(t.level),a=v(i[t.bottom]);k.setAttribute(`x`,e),k.setAttribute(`y`,r),k.setAttribute(`width`,Math.max(2,n-e)),k.setAttribute(`height`,Math.max(2,a-r)),k.style.opacity=`1`}else k.style.opacity=`0`;if(!s&&r>=0&&r<a){let e=h(r),t=v(i[r])-6;A.setAttribute(`d`,`M ${e-7} ${t-11} L ${e+7} ${t-11} L ${e} ${t} z`),j.setAttribute(`x`,e),j.setAttribute(`y`,t-Xc),j.textContent=`i=${r}`,A.style.opacity=`1`,j.style.opacity=`1`}else A.style.opacity=`0`,j.style.opacity=`0`;N.style.opacity=n.length===0?`1`:`0`,P.forEach((e,t)=>{let r=n[t];if(r===void 0){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`,e.idxT.textContent=String(r),e.hT.textContent=`h=${i[r]}`,e.g.setAttribute(`class`,t===n.length-1?`trs-slot is-top`:`trs-slot`)}),s?F.textContent=`结束 · 共 ${t.total} 单位`:t.phase===`settle`&&t.leftBound!==null?F.textContent=`槽底 ${t.bottom}(h=${i[t.bottom]}) · 边界 [${t.leftBound}, ${t.rightBound}] · ${t.width}×${t.layerH} = +${t.gained}`:t.phase===`settle`?F.textContent=`弹出 ${t.bottom}，栈空 —— 没有左边界，这一层为 0`:t.phase===`push`?F.textContent=`压入 ${r}（h=${i[r]}）`:F.textContent=`等待开始 · 遇到更高的柱子就结算一层`,L.textContent=String(t.total),Z(R,t.desc)}s.appendChild(R);let B=Q();s.appendChild(B.root),e.textContent=``,e.appendChild(s),X();let V=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,H=$({steps:n,controls:B,intervalMs:il,onRender:z});H.jumpTo(Math.trunc(t.initialStep)||0);let U=null;return r&&!V&&typeof IntersectionObserver==`function`&&(U=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){U.disconnect(),U=null,H.play();return}},{threshold:.35}),U.observe(s)),{destroy(){U&&=(U.disconnect(),null),H.destroy(),e.textContent=``,delete e.dataset.trsMounted,document.getElementById(Bc)?.remove()}}}var cl=[-2,1,-3,4,-1,2,1,-5,4];function ll(e={}){let t=Array.isArray(e.nums)?e.nums:cl,n=t.length,r=Number.isInteger(e.maxSteps)?e.maxSteps:400,i={nums:[...t],i:-1,x:null,cur:0,best:0,start:0,end:0,bestStart:0,bestEnd:0,reset:!1,dropped:null,improved:!1};if(n===0)return[{...i,phase:`done`,desc:"**空数组** —— 一个元素都没有，凑不出子数组。题目保证 `n >= 1`，但状态机要有安静的出口。",done:!0}];let a=[],o=t[0],s=t[0],c=0,l=0,u=0,d=0,f=0,p=(e,t,n={})=>{a.push({...i,i:l,cur:o,best:s,start:c,end:l,bestStart:u,bestEnd:d,phase:e,desc:t,done:e===`done`,...n})};p(`init`,`要在 \`[${t.join(`, `)}]\` 里找一个**连续**的子数组，让它的和最大。子数组至少要含一个元素，所以答案**不可能是 0**（全负数时答案是那个最大的负数）。暴力枚举所有起点终点是 \`O(n²)\`（用前缀和能把内层降到 O(1)，但外层还是 n² 个组合）。Kadane 的想法是：**从左到右扫，只维护一个量 —— 「以当前位置结尾的最大子数组和」**，记做 \`cur\`。扫到 \`x\` 时只有两种选择：① 接在当前这段后面 → \`cur + x\`；② 从 \`x\` 自己重新开始 → \`x\`。取更大的那个：\`cur = max(x, cur + x)\`。**这一句从头到尾只在问一件事：带上前面那段，是赚了还是亏了？**如果 \`cur < 0\`，那么 \`cur + x < x\` —— 前面那段是**负资产**，接上只会更差，不如从 \`x\` 重新开始。全程再用一个 \`best\` 记录 \`cur\` 的历史最大值，扫完就是答案。先从 \`nums[0] = ${t[0]}\` 起步：\`cur = best = ${t[0]}\`。`,{x:t[0]});for(let e=1;e<n&&(f+=1,!(f>r));e+=1){let n=t[e];l=e;let r=o,i=s;if(o<0){let t=c;o=n,c=e;let a=o>s;a&&(s=o,u=c,d=e),p(`restart`,`\`i = ${e}\`，\`nums[${e}] = ${n}\`。当前这段的和 \`cur = ${r}\` —— **它是负的**。带上一段负数只会让总和变小：\`(${r}) + ${n} = ${r+n}\`，还不如 \`${n}\` 自己。所以**把前面整段扔掉，从 \`${e}\` 重新开始**：\`cur = ${n}\`，当前子数组收缩成 \`[${n}]\`（起点重设为 \`${e}\`）。`+(a?` 再看全局：\`${n} > ${i}\`，**刷新最优** —— \`best = ${s}\`，最优区间记成 \`nums[${u}..${d}]\`。`:` 再看全局：\`${n}\` 没能超过历史最好的 \`${i}\`，\`best\` 保持 \`${s}\`。`),{i:e,x:n,reset:!0,improved:a,dropped:{from:t,to:e-1}})}else{o+=n;let t=o>s;t&&(s=o,u=c,d=e),p(`extend`,`\`i = ${e}\`，\`nums[${e}] = ${n}\`。当前这段的和 \`cur = ${r}\` 是**非负的** —— 带上它总不亏：\`${r} + ${n} = ${o}\`，比 \`${n}\` 自己更大。所以**接上去**：\`cur = ${o}\`，当前子数组变成 \`nums[${c}..${e}]\`。`+(t?` 再看全局：\`${o} > ${i}\`，**刷新最优** —— \`best = ${s}\`，最优区间记成 \`nums[${u}..${d}]\`。`:` 再看全局：\`${o}\` 没超过历史最好的 \`${i}\`，\`best\` 保持 \`${s}\`。`),{i:e,x:n,improved:t})}}let m=t.slice(u,d+1).join(`, `);return p(`done`,`扫描结束。**答案 = \`${s}\`**，对应的子数组是 \`nums[${u}..${d}]\` = \`[${m}]\`。 回头看这趟做了什么：每个元素**只被看过一次**，每次只做两次比较 —— 所以是 **\`O(n)\` 时间、\`O(1)\` 空间**。这已经是理论下界了：至少得把每个元素看一遍，不可能比 \`O(n)\` 更快。而那句 \`cur = max(x, cur + x)\` 从头到尾只在问一件事：**我前面那段，是资产还是负资产？**负的就扔掉重起，正的就一起带上 —— 就这一条规则，把 \`O(n²)\` 压成了 \`O(n)\`。`,{i:n-1,x:t[n-1],done:!0}),a}var ul=`kd-styles`,dl=54,fl=84,pl=46,ml=142,hl=180,gl=16,_l=202,vl=52,yl=58,bl=6,xl=260,Sl=276,Cl=298,wl=26,Tl=604,El=1250,Dl=`
.kd {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.kd__svg { width: 100%; height: auto; display: block; }

.kd-note {
  fill: var(--kd-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 当前子数组色带 ───────────────────────────────────────────────────── */
.kd-band {
  fill: var(--kd-ok, #3f6b57);
  opacity: 0.85;
}
.kd-band__end { stroke: var(--kd-ok, #3f6b57); stroke-width: 2.5; }

/* ── 格子 ─────────────────────────────────────────────────────────────── */
.kd-cell__box {
  fill: var(--kd-fill, #ffffff);
  stroke: var(--kd-line, #c3c9c2);
  stroke-width: 1.5;
}
.kd-cell__value {
  fill: var(--kd-ink, #1f2a24);
  font-size: 18px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 通道一（底色）：在当前子数组里 */
.kd-cell.is-inwin .kd-cell__box {
  fill: var(--kd-ok-fill, #eef5f1);
}
/* 通道二（边框）：最优区间内 —— 金色 */
.kd-cell.is-inbest .kd-cell__box {
  stroke: var(--kd-gold, #c2872f);
  stroke-width: 2.5;
}
/* 通道二（边框）：当前 i —— 橙色，优先级高于最优金色 */
.kd-cell.is-cur .kd-cell__box {
  stroke: var(--kd-hot, #a45f45);
  stroke-width: 3;
}
.kd-cell.is-cur .kd-cell__value { fill: var(--kd-hot, #a45f45); }
/* 被丢弃的那一段：整格灰虚线（放最后，整体覆盖） */
.kd-cell.is-dropped .kd-cell__box {
  fill: var(--kd-dim-fill, #f4f3ef);
  stroke: var(--kd-dim, #b9b9b3);
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
}
.kd-cell.is-dropped .kd-cell__value { fill: var(--kd-dim, #b9b9b3); }

/* ── 最优区间线 ───────────────────────────────────────────────────────── */
.kd-best__line { stroke: var(--kd-gold, #c2872f); stroke-width: 2.5; }
.kd-best__tick { stroke: var(--kd-gold, #c2872f); stroke-width: 2; }
.kd-best__text {
  fill: var(--kd-gold, #c2872f);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── i 指针 ───────────────────────────────────────────────────────────── */
.kd-i__tri { fill: var(--kd-hot, #a45f45); }
.kd-i__tag { fill: var(--kd-hot, #a45f45); }
.kd-i__text {
  fill: var(--kd-paper, #ffffff);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.kd-idx {
  fill: var(--kd-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.kd-banner__box {
  fill: var(--kd-banner-fill, #f4f2ec);
  stroke: var(--kd-line, #c3c9c2);
  stroke-width: 1.5;
}
.kd-banner__seg {
  fill: var(--kd-muted, #657168);
  font-size: 13.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.kd-banner__best {
  fill: var(--kd-gold, #c2872f);
  font-size: 19px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.kd-empty__text {
  fill: var(--kd-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function Ol(){if(document.getElementById(ul))return;let e=document.createElement(`style`);e.id=ul,e.textContent=Dl,document.head.appendChild(e)}function kl(e,t={}){if(!e||e.dataset.kdMounted===`1`)return{destroy(){}};e.dataset.kdMounted=`1`,Ol();let n=ll(t),r=t.autoplay!==!1,i=n[0].nums,a=i.length,o=Y,s=document.createElement(`div`);s.className=`viz kd`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);function l(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(a===0){let t=o(`svg`,{class:`viz__svg kd__svg`,viewBox:`0 0 620 120`,role:`img`}),n=o(`text`,{class:`kd-empty__text`,x:620/2,y:120/2});return n.textContent=`空数组 —— 凑不出子数组`,t.appendChild(n),c.appendChild(t),s.appendChild(l()),s.appendChild(Q().root),e.textContent=``,e.appendChild(s),{destroy(){e.textContent=``,delete e.dataset.kdMounted,document.getElementById(ul)?.remove()}}}let u=yl;a*u+(a-1)*bl>Tl&&(u=Math.max(14,Math.floor((Tl-(a-1)*bl)/a)));let d=a*u+(a-1)*bl,f=Math.max(660,wl*2+d),p=(f-d)/2,m=e=>p+e*(u+bl),h=e=>m(e)+u/2,g=f-wl*2,_=o(`svg`,{class:`viz__svg kd__svg`,viewBox:`0 0 ${f} 320`,role:`img`,"aria-label":`最大子数组和 Kadane 推演动画`});c.appendChild(_);let v=o(`g`,{class:`kd-bands`}),y=o(`g`,{class:`kd-cells`}),b=o(`g`,{class:`kd-bests`}),x=o(`g`,{class:`kd-marks`});_.appendChild(v),_.appendChild(y),_.appendChild(b),_.appendChild(x);let S=o(`text`,{class:`kd-note`,x:wl,y:dl});S.textContent=`cur = max(x, cur + x) —— 每步只问一句：带上前面那段，是赚了还是亏了`,x.appendChild(S),x.appendChild(o(`rect`,{class:`kd-banner__box`,x:wl,y:fl,width:g,height:pl,rx:9}));let C=o(`text`,{class:`kd-banner__seg`,x:44,y:107}),w=o(`text`,{class:`kd-banner__seg`,x:196,y:107}),T=o(`text`,{class:`kd-banner__best`,x:wl+g-18,y:107});x.appendChild(C),x.appendChild(w),x.appendChild(T);let E=o(`rect`,{class:`kd-band`,x:0,y:hl,width:0,height:gl,rx:4}),D=o(`line`,{class:`kd-band__end`,x1:0,y1:hl-4,x2:0,y2:200}),O=o(`line`,{class:`kd-band__end`,x1:0,y1:hl-4,x2:0,y2:200});v.appendChild(E),v.appendChild(D),v.appendChild(O);let k=[];for(let e=0;e<a;e+=1){let t=m(e),n=o(`g`,{class:`kd-cell`});n.appendChild(o(`rect`,{class:`kd-cell__box`,x:t,y:_l,width:u,height:vl,rx:6}));let r=o(`text`,{class:`kd-cell__value`,x:h(e),y:228});r.textContent=String(i[e]),n.appendChild(r),y.appendChild(n),k.push({g:n,id:e})}for(let e=0;e<a;e+=1){let t=o(`text`,{class:`kd-idx`,x:h(e),y:Sl});t.textContent=String(e),x.appendChild(t)}let A=o(`line`,{class:`kd-best__line`,x1:0,y1:xl,x2:0,y2:xl}),j=o(`line`,{class:`kd-best__tick`,x1:0,y1:256,x2:0,y2:xl}),M=o(`line`,{class:`kd-best__tick`,x1:0,y1:256,x2:0,y2:xl}),N=o(`text`,{class:`kd-best__text`,x:0,y:Cl});b.appendChild(A),b.appendChild(j),b.appendChild(M),b.appendChild(N);let P=o(`path`,{class:`kd-i__tri`,d:`M 0 0 L 0 0 L 0 0`}),F=o(`rect`,{class:`kd-i__tag`,x:0,y:ml,width:54,height:22,rx:6}),I=o(`text`,{class:`kd-i__text`,x:0,y:153});x.appendChild(P),x.appendChild(F),x.appendChild(I);let L=l();function R(e,t){if(!t)return;let n=t.i,r=t.phase===`done`,i=new Set;for(let e=t.start;e<=t.end;e+=1)i.add(e);let o=new Set;for(let e=t.bestStart;e<=t.bestEnd;e+=1)o.add(e);let s=new Set;if(!r&&t.dropped)for(let e=t.dropped.from;e<=t.dropped.to;e+=1)s.add(e);for(let e of k){let{g:t,id:a}=e,c=[`kd-cell`];s.has(a)?c.push(`is-dropped`):(i.has(a)&&c.push(`is-inwin`),o.has(a)&&c.push(`is-inbest`),!r&&a===n&&c.push(`is-cur`)),t.setAttribute(`class`,c.join(` `))}if(r||t.end<t.start)E.style.opacity=`0`,D.style.opacity=`0`,O.style.opacity=`0`;else{let e=m(t.start),n=m(t.end)+u;E.setAttribute(`x`,e),E.setAttribute(`width`,Math.max(2,n-e)),E.style.opacity=`1`,D.setAttribute(`x1`,e),D.setAttribute(`x2`,e),O.setAttribute(`x1`,n),O.setAttribute(`x2`,n),D.style.opacity=`1`,O.style.opacity=`1`}let c=m(t.bestStart),l=m(t.bestEnd)+u;if(j.setAttribute(`x1`,c),j.setAttribute(`x2`,c),M.setAttribute(`x1`,l),M.setAttribute(`x2`,l),A.setAttribute(`x1`,c),A.setAttribute(`x2`,l),N.setAttribute(`x`,(c+l)/2),N.textContent=`最优 nums[${t.bestStart}..${t.bestEnd}] · 和 ${t.best}`,!r&&n>=0&&n<a){let e=h(n),t=_l-6;P.setAttribute(`d`,`M ${e-7} ${t-11} L ${e+7} ${t-11} L ${e} ${t} z`),P.style.opacity=`1`,F.setAttribute(`x`,e-27),I.setAttribute(`x`,e),I.textContent=`i=${n}`,F.style.opacity=`1`,I.style.opacity=`1`}else P.style.opacity=`0`,F.style.opacity=`0`,I.style.opacity=`0`;C.textContent=`cur = ${t.cur}（当前这段）`,w.textContent=`best = ${t.best}`,T.textContent=r?`答案 ${t.best}`:`最优 ${t.best}`,Z(L,t.desc)}s.appendChild(L);let z=Q();s.appendChild(z.root),e.textContent=``,e.appendChild(s),X();let B=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,V=$({steps:n,controls:z,intervalMs:El,onRender:R});V.jumpTo(Math.trunc(t.initialStep)||0);let H=null;return r&&!B&&typeof IntersectionObserver==`function`&&(H=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){H.disconnect(),H=null,V.play();return}},{threshold:.35}),H.observe(s)),{destroy(){H&&=(H.disconnect(),null),V.destroy(),e.textContent=``,delete e.dataset.kdMounted,document.getElementById(ul)?.remove()}}}var Al=[3,2,1,5,6,4],jl=2;function Ml(e){let t=e>>>0||12345;return()=>(t=t*1103515245+12345&2147483647,t/2147483647)}function Nl(e={}){let t=(Array.isArray(e.nums)?e.nums:Al).slice(),n=t.length,r=Number.isInteger(e.k)?e.k:jl,i=Math.min(Math.max(r,1),Math.max(n,1)),a=Number.isInteger(e.maxSteps)?e.maxSteps:400,o=e.pivot===`random`?`random`:`last`,s=Ml(Number.isInteger(e.seed)?e.seed:20240928),c=[],l=n-i,u=0,d=n-1,f=0,p=null,m=null,h=null,g=null,_=null,v=null,y=(e,r,a={})=>{c.push({phase:e,desc:r,arr:t.slice(),n,k:i,target:l,left:u,right:d,pivotValue:h,pivotIdx:g,i:_,j:v,swapPair:null,cmp:null,found:p,foundIdx:m,round:f,done:e===`done`,...a})};if(n===0)return y(`done`,`数组是空的，没有第 k 大。`),c;y(`init`,`给了 \`${n}\` 个数 \`[${t.join(`, `)}]\`，要找**第 \`${i}\` 大**。先把这句话翻译成下标：升序排好之后，第 \`${i}\` 大就是**倒数第 \`${i}\` 个**，也就是升序下标 \`n - k = ${n} - ${i} = ${l}\`。所以题目等价于：**找出升序第 \`${l}\` 位（0 基）的那个数**。这个换算是最容易写错的地方 —— 写成 \`k - 1\` 的话，找的就变成第 \`${i}\` **小**了。另外先约定一件事：「第 k 大」是**排序后的第 k 个位置**，不是「第 k 个不同的值」 —— 重复元素各占各的位置。`);let b=0;for(;u<=d&&b<a;){if(b+=1,f+=1,u===d){p=t[u],m=u,g=u;break}let e=d;if(o===`random`){e=u+Math.floor(s()*(d-u+1));let n=t[e];t[e]=t[d],t[d]=n,e=d}for(h=t[d],g=d,_=u,v=null,y(`pick`,`**第 \`${f}\` 轮分区**，当前搜索区间 \`[${u}, ${d}]\`。`+(o===`random`?`随机挑一个位置、把它换到区间最右端当枢轴 —— 随机化是为了避免"有序输入 + 固定取末尾"退化成 O(n²)。`:`取区间最右端的 \`${h}\` 当枢轴（pivot）。`)+`这一趟扫描只做一件事：把区间里**小于等于 \`${h}\` 的都挪到左边**。游标 \`i\` 指向"小于等于区"的下一个空位，游标 \`j\` 从左往右扫。`),v=u;v<d&&!(b>=a);v+=1){b+=1;let e=t[v];if(e<=h){let n=_,r=v,i=t[n];t[n]=t[r],t[r]=i;let a=n!==r;_+=1,y(`scan`,`\`j = ${v}\`：\`arr[${v}] = ${e}\` **<= \`${h}\`**，归入左边。`+(a?`交换 \`${n}\` 与 \`${r}\` 两格，\`${e}\` 被换到下标 \`${n}\`。`:"它本来就在 `i` 指向的位置上，不用换。")+` \`i\` 前进到 \`${_}\`，"小于等于区"扩大一格。`,{swapPair:[n,r],cmp:`le`})}else y(`scan`,`\`j = ${v}\`：\`arr[${v}] = ${e}\` **> \`${h}\`**，**不动** —— 它属于右边那一堆。\`j\` 继续前进，\`i\` 留在下标 \`${_}\` 等着下一个"小个子"。`,{cmp:`gt`})}let r=_,c=d,x=t[r];if(t[r]=t[c],t[c]=x,g=_,v=null,y(`place`,`扫描结束。此时 \`i\` 正好指向"大于区"的第一个位置，把枢轴 \`${h}\` 换到这里 —— 交换 \`i = ${r}\` 与 \`right = ${c}\`，数组变成 \`[${t.join(`, `)}]\` （区间内部分）。**枢轴就此落在下标 \`${g}\`**：它左边全 \`<= ${h}\`，右边全 \`> ${h}\`。这个位置就是它的**最终排名** —— 整个数组升序排好后它就在这一位。`,{swapPair:[r,c]}),g===l){p=t[g],m=g,y(`found`,`枢轴 \`${h}\` 落在下标 \`${g}\`，**正好是目标位 \`n - k = ${l}\`** —— 它就是第 \`${i}\` 大。此时它左边 \`${g}\` 个元素都不比它大，右边 \`${n-g-1}\` 个元素都不比它小，排名确凿，不用再比了。`);break}if(g<l){let e=u;u=g+1,y(`narrow`,`枢轴落在 \`${g}\`，目标位是 \`${l}\`。\`${g} < ${l}\` —— **答案在枢轴右边**。左边那 \`${g-e+1}\` 个（含枢轴自己）排名都比目标位靠前，全部淘汰，以后一眼都不看。区间收缩成 \`[${u}, ${d}]\`。**这就是省时间的全部秘密**：快排要递归两边，快速选择只进一边。`)}else{let e=d;d=g-1,y(`narrow`,`枢轴落在 \`${g}\`，目标位是 \`${l}\`。\`${g} > ${l}\` —— **答案在枢轴左边**。右边那 \`${e-g+1}\` 个（含枢轴自己）排名都比目标位靠后，全部淘汰。区间收缩成 \`[${u}, ${d}]\`。`)}h=null,_=null}return y(`done`,p===null?`达到步数上限 \`${a}\`，提前收尾（正常输入不会走到这里）。`:`结束。**第 \`${i}\` 大 = \`${p}\`**，它在升序数组里的位置是下标 \`${m}\`。回头看这趟：一共只做了 \`${f}\` 轮分区，每轮扫描当前区间一次就把一半左右的候选淘汰掉，总工作量是 \`n + n/2 + n/4 + … ≈ 2n\` —— 所以是**平均 O(n)** 时间，而且全程只在原数组上交换，**O(1) 额外空间**。但别忘了那两个字是"平均"：最坏情况（比如有序数组配固定取末尾的枢轴）每轮只砍掉 1 个，会退化成 O(n²)。`),c}var Pl=`qs-styles`,Fl=54,Il=84,Ll=46,Rl=152,zl=198,Bl=56,Vl=272,Hl=304,Ul=322,Wl=58,Gl=6,Kl=26,ql=604,Jl=1250,Yl=`
.qs {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.qs__svg { width: 100%; height: auto; display: block; }

.qs-note {
  fill: var(--qs-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.qs-banner__box {
  fill: var(--qs-banner, #f4f3ef);
  stroke: var(--qs-line, #c3c9c2);
  stroke-width: 1.5;
}
.qs-banner__seg {
  fill: var(--qs-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.qs-banner__ans {
  fill: var(--qs-gold, #c2872f);
  font-size: 19px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 格子 ─────────────────────────────────────────────────────────────── */
.qs-cell__box {
  fill: var(--qs-fill, #ffffff);
  stroke: var(--qs-line, #c3c9c2);
  stroke-width: 1.5;
}
.qs-cell__value {
  fill: var(--qs-ink, #1f2a24);
  font-size: 18px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.qs-cell__idx {
  fill: var(--qs-dim, #9aa39c);
  font-size: 11.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 通道一（底色）：已被淘汰出搜索区间 */
.qs-cell.is-outside .qs-cell__box {
  fill: var(--qs-dim-fill, #f0efea);
  stroke: var(--qs-line, #c3c9c2);
  stroke-dasharray: 4 3;
}
.qs-cell.is-outside .qs-cell__value { fill: var(--qs-dim, #9aa39c); }
.qs-cell.is-outside .qs-cell__idx { fill: var(--qs-dim, #9aa39c); }

/* 通道一（底色）：枢轴左边的"<= 区" */
.qs-cell.is-lezone .qs-cell__box {
  fill: var(--qs-ok-fill, #eef5f1);
}
/* 通道一（底色）：枢轴所在格 */
.qs-cell.is-pivot .qs-cell__box {
  fill: var(--qs-gold-fill, #fdf3e3);
}
.qs-cell.is-pivot .qs-cell__value { fill: var(--qs-gold, #c2872f); }

/* 通道二（边框）：本帧正在交换的两格 */
.qs-cell.is-swap .qs-cell__box {
  stroke: var(--qs-hot, #a45f45);
  stroke-width: 3;
}
.qs-cell.is-swap .qs-cell__value { fill: var(--qs-hot, #a45f45); }

/* 通道二（边框）：命中的答案格 */
.qs-cell.is-found .qs-cell__box {
  stroke: var(--qs-gold, #c2872f);
  stroke-width: 3.5;
}
.qs-cell.is-found .qs-cell__value { fill: var(--qs-gold, #c2872f); }

/* ── i / j 游标 ───────────────────────────────────────────────────────── */
.qs-i__tag { fill: var(--qs-ok, #3f6b57); }
.qs-i__tri { fill: var(--qs-ok, #3f6b57); }
.qs-i__text {
  fill: var(--qs-paper, #ffffff);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.qs-j__tag { fill: var(--qs-hot, #a45f45); }
.qs-j__tri { fill: var(--qs-hot, #a45f45); }
.qs-j__text {
  fill: var(--qs-paper, #ffffff);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 目标位标记 ───────────────────────────────────────────────────────── */
.qs-target__line {
  stroke: var(--qs-gold, #c2872f);
  stroke-width: 2;
  stroke-dasharray: 5 3;
}
.qs-target__tri { fill: var(--qs-gold, #c2872f); }
.qs-target__text {
  fill: var(--qs-gold, #c2872f);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.qs-empty__text {
  fill: var(--qs-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function Xl(){if(document.getElementById(Pl))return;let e=document.createElement(`style`);e.id=Pl,e.textContent=Yl,document.head.appendChild(e)}function Zl(e,t={}){if(!e||e.dataset.qsMounted===`1`)return{destroy(){}};e.dataset.qsMounted=`1`,Xl();let n=Nl(t),r=t.autoplay!==!1,i=n[0].arr.length,a=Y,o=document.createElement(`div`);o.className=`viz qs`;let s=document.createElement(`div`);s.className=`viz__stage`,o.appendChild(s);function c(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(i===0){let t=a(`svg`,{class:`viz__svg qs__svg`,viewBox:`0 0 620 120`,role:`img`}),n=a(`text`,{class:`qs-empty__text`,x:620/2,y:120/2});return n.textContent=`空数组 —— 没有第 k 大`,t.appendChild(n),s.appendChild(t),o.appendChild(c()),o.appendChild(Q().root),e.textContent=``,e.appendChild(o),X(),{destroy(){e.textContent=``,delete e.dataset.qsMounted,document.getElementById(Pl)?.remove()}}}let l=Wl;i*l+(i-1)*Gl>ql&&(l=Math.max(16,Math.floor((ql-(i-1)*Gl)/i)));let u=i*l+(i-1)*Gl,d=Math.max(660,Kl*2+u),f=(d-u)/2,p=e=>f+e*(l+Gl),m=e=>p(e)+l/2,h=d-Kl*2,g=a(`svg`,{class:`viz__svg qs__svg`,viewBox:`0 0 ${d} 344`,role:`img`,"aria-label":`第 K 大元素 快速选择推演动画`});s.appendChild(g);let _=a(`g`,{class:`qs-cells`}),v=a(`g`,{class:`qs-marks`});g.appendChild(_),g.appendChild(v);let y=a(`text`,{class:`qs-note`,x:Kl,y:Fl});y.textContent=`第 k 大 = 升序第 n-k 位 —— 快速选择只递归一边，所以是 O(n) 不是 O(n log n)`,v.appendChild(y),v.appendChild(a(`rect`,{class:`qs-banner__box`,x:Kl,y:Il,width:h,height:Ll,rx:9}));let b=a(`text`,{class:`qs-banner__seg`,x:44,y:107}),x=a(`text`,{class:`qs-banner__seg`,x:226,y:107}),S=a(`text`,{class:`qs-banner__seg`,x:406,y:107}),C=a(`text`,{class:`qs-banner__ans`,x:Kl+h-18,y:107});v.appendChild(b),v.appendChild(x),v.appendChild(S),v.appendChild(C);let w=[];for(let e=0;e<i;e+=1){let t=p(e),n=a(`g`,{class:`qs-cell`});n.appendChild(a(`rect`,{class:`qs-cell__box`,x:t,y:zl,width:l,height:Bl,rx:6}));let r=a(`text`,{class:`qs-cell__value`,x:m(e),y:220});n.appendChild(r);let i=a(`text`,{class:`qs-cell__idx`,x:m(e),y:240});i.textContent=String(e),n.appendChild(i),_.appendChild(n),w.push({g:n,v:r,id:e})}let T=a(`path`,{class:`qs-i__tri`,d:`M 0 0 L 0 0 L 0 0`}),E=a(`rect`,{class:`qs-i__tag`,x:0,y:Rl,width:54,height:22,rx:6}),D=a(`text`,{class:`qs-i__text`,x:0,y:163});v.appendChild(T),v.appendChild(E),v.appendChild(D);let O=a(`path`,{class:`qs-j__tri`,d:`M 0 0 L 0 0 L 0 0`}),k=a(`rect`,{class:`qs-j__tag`,x:0,y:Vl,width:54,height:22,rx:6}),A=a(`text`,{class:`qs-j__text`,x:0,y:283});v.appendChild(O),v.appendChild(k),v.appendChild(A);let j=a(`line`,{class:`qs-target__line`,x1:0,y1:256,x2:0,y2:Hl}),M=a(`path`,{class:`qs-target__tri`,d:`M 0 0 L 0 0 L 0 0`}),N=a(`text`,{class:`qs-target__text`,x:0,y:Ul});v.appendChild(j),v.appendChild(M),v.appendChild(N);let P=c();function F(e,t){if(!t)return;let{arr:n,left:r,right:a,target:o,k:s,round:c}=t,l=t.phase,u=l===`done`,d=t.found,f=new Set;l===`scan`&&t.swapPair&&t.swapPair[0]!==t.swapPair[1]&&(f.add(t.swapPair[0]),f.add(t.swapPair[1]));for(let e of w){let i=e.id;e.v.textContent=String(n[i]);let o=[`qs-cell`];i<r||i>a?o.push(`is-outside`):t.i!==null&&i<t.i&&i>=r&&o.push(`is-lezone`),t.pivotIdx!==null&&i===t.pivotIdx&&t.pivotValue!==null&&o.push(`is-pivot`),f.has(i)&&o.push(`is-swap`),d!==null&&i===t.foundIdx&&o.push(`is-found`),e.g.setAttribute(`class`,o.join(` `))}if(!u&&t.i!==null&&t.i>=0&&t.i<i){let e=m(t.i),n=zl-6;T.setAttribute(`d`,`M ${e-7} ${n-14} L ${e+7} ${n-14} L ${e} ${n} z`),E.setAttribute(`x`,e-27),D.setAttribute(`x`,e),D.textContent=`i=${t.i}`,T.style.opacity=`1`,E.style.opacity=`1`,D.style.opacity=`1`}else T.style.opacity=`0`,E.style.opacity=`0`,D.style.opacity=`0`;if(!u&&t.j!==null&&t.j>=0&&t.j<i){let e=m(t.j);O.setAttribute(`d`,`M ${e-7} 270 L ${e+7} 270 L ${e} 256 z`),k.setAttribute(`x`,e-27),A.setAttribute(`x`,e),A.textContent=`j=${t.j}`,O.style.opacity=`1`,k.style.opacity=`1`,A.style.opacity=`1`}else O.style.opacity=`0`,k.style.opacity=`0`,A.style.opacity=`0`;let p=m(o);j.setAttribute(`x1`,p),j.setAttribute(`x2`,p),M.setAttribute(`d`,`M ${p-7} ${Hl-12} L ${p+7} ${Hl-12} L ${p} ${Hl} z`),N.setAttribute(`x`,p),N.textContent=`目标位 ${o}`,b.textContent=`第 ${s} 大 · 目标位 ${o}`,x.textContent=c>0?`第 ${c} 轮 · 区间 [${r}, ${a}]`:`区间 [${r}, ${a}]`,d===null?l===`scan`&&t.swapPair&&t.swapPair[0]!==t.swapPair[1]?S.textContent=`swap(${t.swapPair[0]}, ${t.swapPair[1]})`:t.pivotValue===null?S.textContent=``:S.textContent=`枢轴 ${t.pivotValue}`:S.textContent=`枢轴归位 ${t.pivotIdx}`,C.textContent=d===null?`答案 ?`:`答案 ${d}`,Z(P,t.desc)}o.appendChild(P);let I=Q();o.appendChild(I.root),e.textContent=``,e.appendChild(o),X();let L=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,R=$({steps:n,controls:I,intervalMs:Jl,onRender:F});R.jumpTo(Math.trunc(t.initialStep)||0);let z=null;return r&&!L&&typeof IntersectionObserver==`function`&&(z=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){z.disconnect(),z=null,R.play();return}},{threshold:.35}),z.observe(o)),{destroy(){z&&=(z.disconnect(),null),R.destroy(),e.textContent=``,delete e.dataset.qsMounted,document.getElementById(Pl)?.remove()}}}var Ql=[1,1,1,2,2,3],$l=2;function eu(e={}){let t=Array.isArray(e.nums)?e.nums:Ql,n=t.length,r=Number.isInteger(e.k)?e.k:$l,i=Math.min(Math.max(r,1),Math.max(n,1)),a=[],o={},s=Array.from({length:n+1},()=>[]),c=[],l=(e,r,l={})=>{a.push({phase:e,desc:r,nums:t,n,k:i,freq:{...o},buckets:s.map(e=>e.slice()),cur:null,curFreq:null,bucketIdx:null,collectIdx:null,ans:c.slice(),collected:c.length,done:e===`done`,...l})};if(n===0)return l(`done`,`数组是空的，没有高频元素可取。`),a;l(`init`,`给了 \`${n}\` 个数 \`[${t.join(`, `)}]\`，要返回**出现频率前 \`${i}\` 高的元素**，而且题目卡死了复杂度：**必须优于 O(n log n)** —— 也就是不允许"哈希计数完再整体排序"这种偷懒写法。思路分三步：先一遍扫描数出每个值出现的**频率**（O(n)）；再按频率把值**分进桶里**（频率天然在 \`[1, ${n}]\` 之间，直接当数组下标用，不用比较）；最后**从高频端往低频端收集**，收满 \`${i}\` 个停。全程没有一次两两比较，总计 O(n)。`);let u=[];for(let e of t)o[e]===void 0?(o[e]=1,u.push(e)):o[e]+=1;for(let e of u)l(`count`,`数完了：值 \`${e}\` 出现了 **\`${o[e]}\` 次**。一张哈希表从左到右扫一遍就够，每个值 O(1)，这一步 \`${t.length}\` 个数共 O(n)。接下来所有的功夫都花在"怎么按频率挑前 \`${i}\` 个"上。`,{cur:e,curFreq:o[e]});for(let e of u){let t=o[e];s[t].push(e),l(`bucket`,`把 \`${e}\` 放进**下标为 \`${t}\` 的桶** —— 频率是多少，就进哪个桶。这一步是桶排序的灵魂：一个元素最多出现 \`${n}\` 次，所以频率天然落在 \`[1, ${n}]\` 里，**键的值域就是数组的下标范围**，建 \`${n+1}\` 个桶直接丢，一次比较都不用做。对比小根堆方案：堆每插一个元素要 \`O(log k)\`，这里每个元素是实打实的 \`O(1)\`。`,{cur:e,curFreq:t,bucketIdx:t})}for(let e=n;e>=1&&!(c.length>=i);--e){if(s[e].length===0){l(`collect`,`桶 \`${e}\` 是**空的** —— 没有值恰好出现 \`${e}\` 次，跳过，继续往左。收集指针从最右端（频率 \`${n}\`）一路往左扫，这就是"从高频到低频"的字面意思。`,{collectIdx:e});continue}for(let t of s[e])if(c.length>=i||(c.push(t),l(`collect`,`桶 \`${e}\` 里有值 \`${t}\`（出现了 \`${e}\` 次），收进答案。已收集 \`${c.length}/${i}\`${c.length>=i?` —— **收满了，停**。`:`，还没够，继续往左扫。`}题目保证答案唯一，所以桶内顺序不影响结果。`,{collectIdx:e,cur:t,curFreq:e}),c.length>=i))break}return l(`done`,`结束。**前 \`${i}\` 个高频元素 = [${c.join(`, `)}]**。回头看这三步：计数 O(n)、入桶 O(n)、收集最多扫 \`${n}\` 个桶也是 O(n) —— **总计 O(n)**，比题目划的红线 O(n log n) 还低。代价是那 \`${n+1}\` 个桶的 **O(n) 额外空间**，以及一个小前提：**频率是整数、且范围已知**（这题天然满足）。如果频率范围没这种保证（比如要按"距离"挑前 k 个），桶就没了，那才轮到堆或快速选择出场。`),a}var tu=`bk-styles`,nu=54,ru=84,iu=46,au=150,ou=40,su=214,cu=252,lu=62,uu=332,du=26,fu=604,pu=40,mu=5,hu=1250,gu=`
.bk {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.bk__svg { width: 100%; height: auto; display: block; }

.bk-note {
  fill: var(--bk-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.bk-banner__box {
  fill: var(--bk-banner, #f4f3ef);
  stroke: var(--bk-line, #c3c9c2);
  stroke-width: 1.5;
}
.bk-banner__seg {
  fill: var(--bk-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bk-banner__ans {
  fill: var(--bk-gold, #c2872f);
  font-size: 18px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 频率卡片 ─────────────────────────────────────────────────────────── */
.bk-freq__box {
  fill: var(--bk-fill, #ffffff);
  stroke: var(--bk-line, #c3c9c2);
  stroke-width: 1.5;
}
.bk-freq__text {
  fill: var(--bk-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bk-freq.is-lit .bk-freq__box {
  fill: var(--bk-gold-fill, #fdf3e3);
  stroke: var(--bk-gold, #c2872f);
  stroke-width: 2;
}
.bk-freq.is-lit .bk-freq__text { fill: var(--bk-gold, #c2872f); }

/* ── 桶 ───────────────────────────────────────────────────────────────── */
.bk-bucket__box {
  fill: var(--bk-fill, #ffffff);
  stroke: var(--bk-line, #c3c9c2);
  stroke-width: 1.5;
}
.bk-bucket__f {
  fill: var(--bk-muted, #657168);
  font-size: 11.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bk-bucket__items {
  fill: var(--bk-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 通道一（底色）：空桶 */
.bk-bucket.is-empty .bk-bucket__box {
  fill: var(--bk-dim-fill, #f0efea);
  stroke-dasharray: 4 3;
}
.bk-bucket.is-empty .bk-bucket__items { fill: var(--bk-dim, #b9b9b3); }
/* 通道一（底色）：本帧刚放入的桶 */
.bk-bucket.is-new .bk-bucket__box {
  fill: var(--bk-gold-fill, #fdf3e3);
  stroke: var(--bk-gold, #c2872f);
  stroke-width: 2;
}
.bk-bucket.is-new .bk-bucket__items { fill: var(--bk-gold, #c2872f); }
/* 通道一（底色）：已经从这只桶收过答案 */
.bk-bucket.is-collected .bk-bucket__box {
  fill: var(--bk-ok-fill, #eef5f1);
  stroke: var(--bk-ok, #3f6b57);
  stroke-width: 2;
}
.bk-bucket.is-collected .bk-bucket__items { fill: var(--bk-ok, #3f6b57); }
/* 通道二（边框）：收集指针所在 */
.bk-bucket.is-scanned .bk-bucket__box {
  stroke: var(--bk-hot, #a45f45);
  stroke-width: 3;
}

/* ── 收集指针 ─────────────────────────────────────────────────────────── */
.bk-collect__tag { fill: var(--bk-hot, #a45f45); }
.bk-collect__tri { fill: var(--bk-hot, #a45f45); }
.bk-collect__text {
  fill: var(--bk-paper, #ffffff);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 答案格 ───────────────────────────────────────────────────────────── */
.bk-ans__box {
  fill: var(--bk-fill, #ffffff);
  stroke: var(--bk-line, #c3c9c2);
  stroke-width: 1.5;
}
.bk-ans__text {
  fill: var(--bk-gold, #c2872f);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bk-ans__label {
  fill: var(--bk-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bk-ans.is-filled .bk-ans__box {
  fill: var(--bk-ok-fill, #eef5f1);
  stroke: var(--bk-ok, #3f6b57);
  stroke-width: 2;
}

.bk-empty__text {
  fill: var(--bk-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function _u(){if(document.getElementById(tu))return;let e=document.createElement(`style`);e.id=tu,e.textContent=gu,document.head.appendChild(e)}function vu(e,t={}){if(!e||e.dataset.bkMounted===`1`)return{destroy(){}};e.dataset.bkMounted=`1`,_u();let n=eu(t),r=t.autoplay!==!1,i=n[0].nums,a=i.length,o=Y,s=document.createElement(`div`);s.className=`viz bk`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);function l(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(a===0){let t=o(`svg`,{class:`viz__svg bk__svg`,viewBox:`0 0 620 120`,role:`img`}),n=o(`text`,{class:`bk-empty__text`,x:620/2,y:120/2});return n.textContent=`空数组 —— 没有高频元素可取`,t.appendChild(n),c.appendChild(t),s.appendChild(l()),s.appendChild(Q().root),e.textContent=``,e.appendChild(s),X(),{destroy(){e.textContent=``,delete e.dataset.bkMounted,document.getElementById(tu)?.remove()}}}let u=[],d=new Set;for(let e of i)d.has(e)||(d.add(e),u.push(e));let f=a+1,p=52;f*p+(f-1)*mu>fu&&(p=Math.max(pu,Math.floor((fu-(f-1)*mu)/f)));let m=f*p+(f-1)*mu,h=Math.max(660,du*2+m),g=(h-m)/2,_=e=>g+e*(p+mu),v=e=>_(e)+p/2,y=h-du*2,b=o(`svg`,{class:`viz__svg bk__svg`,viewBox:`0 0 ${h} 370`,role:`img`,"aria-label":`前 K 个高频元素 桶排序推演动画`});c.appendChild(b);let x=o(`g`,{class:`bk-cells`}),S=o(`g`,{class:`bk-marks`});b.appendChild(x),b.appendChild(S);let C=o(`text`,{class:`bk-note`,x:du,y:nu});C.textContent=`频率天然落在 [1, n] —— 用频率当桶下标，排序就免费了`,S.appendChild(C),S.appendChild(o(`rect`,{class:`bk-banner__box`,x:du,y:ru,width:y,height:iu,rx:9}));let w=o(`text`,{class:`bk-banner__seg`,x:44,y:107}),T=o(`text`,{class:`bk-banner__seg`,x:236,y:107}),E=o(`text`,{class:`bk-banner__ans`,x:du+y-18,y:107});S.appendChild(w),S.appendChild(T),S.appendChild(E);let D=Math.min(72,Math.max(46,Math.floor((m-(u.length-1)*8)/Math.max(u.length,1)))),O=(h-(u.length*D+(u.length-1)*8))/2,k=u.map((e,t)=>{let n=o(`g`,{class:`bk-freq`}),r=O+t*(D+8);n.appendChild(o(`rect`,{class:`bk-freq__box`,x:r,y:au,width:D,height:ou,rx:6}));let i=o(`text`,{class:`bk-freq__text`,x:r+D/2,y:170});return n.appendChild(i),x.appendChild(n),{g:n,t:i,v:e}}),A=[];for(let e=0;e<=a;e+=1){let t=_(e),n=o(`g`,{class:`bk-bucket`});n.appendChild(o(`rect`,{class:`bk-bucket__box`,x:t,y:cu,width:p,height:lu,rx:6}));let r=o(`text`,{class:`bk-bucket__f`,x:v(e),y:266});r.textContent=`f=${e}`,n.appendChild(r);let i=o(`text`,{class:`bk-bucket__items`,x:v(e),y:292});n.appendChild(i),x.appendChild(n),A.push({g:n,items:i,f:e})}let j=o(`path`,{class:`bk-collect__tri`,d:`M 0 0 L 0 0 L 0 0`}),M=o(`rect`,{class:`bk-collect__tag`,x:0,y:su,width:54,height:22,rx:6}),N=o(`text`,{class:`bk-collect__text`,x:0,y:225});S.appendChild(j),S.appendChild(M),S.appendChild(N);let P=n[0].k,F=(h-(P*44+(P-1)*10))/2,I=o(`text`,{class:`bk-ans__label`,x:du,y:350});I.textContent=`答案（收满 ${P} 个停）`,S.appendChild(I);let L=[];for(let e=0;e<P;e+=1){let t=o(`g`,{class:`bk-ans`}),n=F+e*54;t.appendChild(o(`rect`,{class:`bk-ans__box`,x:n,y:uu,width:44,height:36,rx:6}));let r=o(`text`,{class:`bk-ans__text`,x:n+44/2,y:350});t.appendChild(r),S.appendChild(t),L.push({g:t,t:r})}let R=l();function z(e,t){if(!t)return;let n=t.phase,{buckets:r,freq:i,ans:a}=t;for(let e of k){let t=i[e.v]!==void 0;e.t.textContent=t?`${e.v} x ${i[e.v]}`:`${e.v} x ?`,e.g.setAttribute(`class`,t?`bk-freq is-lit`:`bk-freq`)}let o=new Set;for(let e of a)o.add(i[e]);for(let e of A){let i=e.f,a=r[i];e.items.textContent=a.length?a.join(`,`):``;let s=[`bk-bucket`];a.length===0&&s.push(`is-empty`),o.has(i)&&s.push(`is-collected`),n===`bucket`&&t.bucketIdx===i&&s.push(`is-new`),n===`collect`&&t.collectIdx===i&&s.push(`is-scanned`),e.g.setAttribute(`class`,s.join(` `))}if(n===`collect`&&t.collectIdx!==null){let e=v(t.collectIdx),n=cu-2;j.setAttribute(`d`,`M ${e-7} ${n-12} L ${e+7} ${n-12} L ${e} ${n} z`),M.setAttribute(`x`,e-27),N.setAttribute(`x`,e),N.textContent=`f=${t.collectIdx}`,j.style.opacity=`1`,M.style.opacity=`1`,N.style.opacity=`1`}else j.style.opacity=`0`,M.style.opacity=`0`,N.style.opacity=`0`;for(let e=0;e<L.length;e+=1){let t=e<a.length;L[e].t.textContent=t?String(a[e]):`?`,L[e].g.setAttribute(`class`,t?`bk-ans is-filled`:`bk-ans`)}w.textContent=`前 ${t.k} 高频 · 已收 ${t.collected}/${t.k}`,n===`count`?T.textContent=`计数：${t.cur} 出现 ${t.curFreq} 次`:n===`bucket`?T.textContent=`${t.cur} 进桶 f=${t.bucketIdx}`:n===`collect`?T.textContent=t.cur===null?`桶 f=${t.collectIdx} 是空的，跳过`:`收集 f=${t.collectIdx} 里的 ${t.cur}`:n===`init`?T.textContent=`哈希计数 → 按频率入桶 → 从右往左收`:T.textContent=`收满了`,E.textContent=a.length>=t.k?`答案 [${a.join(`, `)}]`:`答案 ?`,Z(R,t.desc)}s.appendChild(R);let B=Q();s.appendChild(B.root),e.textContent=``,e.appendChild(s),X();let V=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,H=$({steps:n,controls:B,intervalMs:hu,onRender:z});H.jumpTo(Math.trunc(t.initialStep)||0);let U=null;return r&&!V&&typeof IntersectionObserver==`function`&&(U=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){U.disconnect(),U=null,H.play();return}},{threshold:.35}),U.observe(s)),{destroy(){U&&=(U.disconnect(),null),H.destroy(),e.textContent=``,delete e.dataset.bkMounted,document.getElementById(tu)?.remove()}}}var yu=[[1,3],[2,6],[8,10],[15,18]];function bu(e={}){let t=Array.isArray(e.intervals)?e.intervals:yu,n=[],r=(e,r,i={})=>{n.push({phase:e,desc:r,intervals:t.map(e=>e.slice()),sorted:[],idx:null,curStart:null,curEnd:null,result:[],cmp:null,done:e===`done`,...i})};if(t.length===0)return r(`done`,`输入是空的，直接返回空数组。`),n;let i=t.map(e=>e.slice()).sort((e,t)=>e[0]-t[0]||e[1]-t[1]);r(`init`,`给了 \`${t.length}\` 个区间：\`[${t.map(e=>`[${e[0]},${e[1]}]`).join(`, `)}]\`。暴力做法是两两比较有没有重叠，\`O(n²)\`；但这题有一个决定性的预处理：**先按左端点排序**。排好序之后有一个性质 —— 新区间的 start 是当前最大的，它如果连当前合并区间的 end 都够不着，就更够不着更早的区间（它们的 end 都被当前合并区间罩着），所以**每个区间只需要和"当前合并区间"比一次**，重叠的候选从 \`O(n²)\` 对坍缩成线性个。另外记住一个语义：**端点相触算重叠**，\`[1,4]\` 和 \`[4,5]\` 要合成 \`[1,5]\`。`),r(`sort`,`按左端点排序完成：\`[${i.map(e=>`[${e[0]},${e[1]}]`).join(`, `)}]\`。这一步 \`O(n log n)\` 是整个算法的瓶颈 —— 之后的合并扫描是严格的 O(n)。扫描规则只有一句：看当前区间的 start 是否 \`<=\` 当前合并区间的 end，够得着就延伸，够不着就收段、新开。`,{sorted:i.map(e=>e.slice())});let a=null,o=null,s=[];for(let e=0;e<i.length;e+=1){let[t,n]=i[e];if(a===null){a=t,o=n,r(`start`,`第一段 \`[${t},${n}]\` 直接成为当前合并区间 \`[${a},${o}]\`。接下来每个区间只问一句话：**你的 start 够得着我的 end 吗？**`,{idx:e,curStart:a,curEnd:o,sorted:i.map(e=>e.slice())});continue}t<=o?(o=Math.max(o,n),r(`extend`,`\`[${t},${n}]\` 的 start \`${t} <= ${o}\`（当前合并区间的 end）—— **够得着，延伸**。当前合并区间变成 \`[${a},${o}]\`。`+(n>o||n===o?`延伸取 \`max(旧 end, ${n})\` —— 注意不能直接覆盖：新区间可能整体被当前区间罩住（比如 \`[2,3]\` 配 \`[1,6]\`）。`:``),{idx:e,curStart:a,curEnd:o,cmp:`overlap`,sorted:i.map(e=>e.slice())})):(s.push([a,o]),a=t,o=n,r(`close`,`\`[${t},${n}]\` 的 start \`${t} > ${o}\` —— **够不着，收段**。把 \`[${s[s.length-1][0]},${s[s.length-1][1]}]\` 收进结果（它再也不可能被延伸了 —— 后面区间的 start 只会更大），当前合并区间换成 \`[${t},${n}]\`。`,{idx:e,curStart:a,curEnd:o,cmp:`gap`,sorted:i.map(e=>e.slice()),result:s.map(e=>e.slice())}))}return s.push([a,o]),r(`done`,`扫描结束，把最后一段 \`[${a},${o}]\` 也收进去。**答案 = [${s.map(e=>`[${e[0]},${e[1]}]`).join(`, `)}]**，共 \`${s.length}\` 段。回头看这趟：排序 \`O(n log n)\` + 扫描 \`O(n)\`，每个区间只和"当前合并区间"比了一次。还有一个工程细节：结果里的区间必须是**新造的数组** —— 要是把输入区间的引用塞进结果再改它的 end，调用方的原数据就被污染了。`,{idx:i.length-1,curStart:a,curEnd:o,result:s.map(e=>e.slice()),sorted:i.map(e=>e.slice())}),n}var xu=`mi-styles`,Su=54,Cu=84,wu=46,Tu=152,Eu=34,Du=8,Ou=34,ku=40,Au=26,ju=1250,Mu=`
.mi {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.mi__svg { width: 100%; height: auto; display: block; }

.mi-note {
  fill: var(--mi-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.mi-banner__box {
  fill: var(--mi-banner, #f4f3ef);
  stroke: var(--mi-line, #c3c9c2);
  stroke-width: 1.5;
}
.mi-banner__seg {
  fill: var(--mi-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mi-banner__ans {
  fill: var(--mi-gold, #c2872f);
  font-size: 18px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 数轴 ─────────────────────────────────────────────────────────────── */
.mi-axis__line { stroke: var(--mi-line, #c3c9c2); stroke-width: 1.5; }
.mi-axis__tick { stroke: var(--mi-line, #c3c9c2); stroke-width: 1; }
.mi-axis__num {
  fill: var(--mi-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 区间条 ───────────────────────────────────────────────────────────── */
.mi-bar { rx: 8; }
.mi-bar__box {
  fill: var(--mi-fill, #ffffff);
  stroke: var(--mi-line, #c3c9c2);
  stroke-width: 1.5;
}
.mi-bar__text {
  fill: var(--mi-ink, #1f2a24);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mi-bar__label {
  fill: var(--mi-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 通道一（底色）：已收进结果的段 */
.mi-bar.is-done .mi-bar__box {
  fill: var(--mi-ok-fill, #eef5f1);
  stroke: var(--mi-ok, #3f6b57);
  stroke-width: 2;
}
.mi-bar.is-done .mi-bar__text { fill: var(--mi-ok, #3f6b57); }
/* 通道一（底色）：当前合并区间 */
.mi-bar.is-cur .mi-bar__box {
  fill: var(--mi-gold-fill, #fdf3e3);
}
/* 通道二（边框）：本帧正在处理的行 */
.mi-bar.is-active .mi-bar__box {
  stroke: var(--mi-hot, #a45f45);
  stroke-width: 3;
}

/* ── 结果区 ───────────────────────────────────────────────────────────── */
.mi-result__label {
  fill: var(--mi-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mi-result__cur {
  fill: var(--mi-gold-fill, #fdf3e3);
  stroke: var(--mi-gold, #c2872f);
  stroke-width: 2.5;
}
.mi-result__seg {
  fill: var(--mi-ok, #3f6b57);
  opacity: 0.9;
}

.mi-empty__text {
  fill: var(--mi-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function Nu(){if(document.getElementById(xu))return;let e=document.createElement(`style`);e.id=xu,e.textContent=Mu,document.head.appendChild(e)}function Pu(e,t={}){if(!e||e.dataset.miMounted===`1`)return{destroy(){}};e.dataset.miMounted=`1`,Nu();let n=bu(t),r=t.autoplay!==!1,i=Y,a=document.createElement(`div`);a.className=`viz mi`;let o=document.createElement(`div`);o.className=`viz__stage`,a.appendChild(o);function s(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(n[0].intervals.length===0){let t=i(`svg`,{class:`viz__svg mi__svg`,viewBox:`0 0 620 120`,role:`img`}),n=i(`text`,{class:`mi-empty__text`,x:620/2,y:120/2});return n.textContent=`空输入 —— 直接返回空数组`,t.appendChild(n),o.appendChild(t),a.appendChild(s()),a.appendChild(Q().root),e.textContent=``,e.appendChild(a),X(),{destroy(){e.textContent=``,delete e.dataset.miMounted,document.getElementById(xu)?.remove()}}}let c=n[0].sorted.length?n[0].sorted.flat():n[0].intervals.flat(),l=Math.max(...c,1),u=Math.min(...c,0),d=542-Au,f=e=>118+(e-u)/(l-u||1)*d,p=Math.max(n[0].sorted.length,n[0].intervals.length,1),m=176+(p*42+Du)+Ou,h=m+16,g=i(`svg`,{class:`viz__svg mi__svg`,viewBox:`0 0 660 ${h+ku+40}`,role:`img`,"aria-label":`合并区间 推演动画`});o.appendChild(g);let _=i(`g`,{class:`mi-bars`}),v=i(`g`,{class:`mi-marks`});g.appendChild(_),g.appendChild(v);let y=i(`text`,{class:`mi-note`,x:Au,y:Su});y.textContent=`按左端点排序后，每个区间只和「当前合并区间」比一次`,v.appendChild(y),v.appendChild(i(`rect`,{class:`mi-banner__box`,x:Au,y:Cu,width:660-Au*2,height:wu,rx:9}));let b=i(`text`,{class:`mi-banner__seg`,x:44,y:107}),x=i(`text`,{class:`mi-banner__seg`,x:266,y:107}),S=i(`text`,{class:`mi-banner__ans`,x:660-Au-18,y:107});v.appendChild(b),v.appendChild(x),v.appendChild(S);let C=i(`line`,{class:`mi-axis__line`,x1:118,y1:Tu,x2:634,y2:Tu});v.appendChild(C);let w=l-u<=12?1:l-u<=30?2:5;for(let e=Math.ceil(u);e<=l;e+=w){let t=f(e);v.appendChild(i(`line`,{class:`mi-axis__tick`,x1:t,y1:Tu-4,x2:t,y2:156}));let n=i(`text`,{class:`mi-axis__num`,x:t,y:Tu-14});n.textContent=String(e),v.appendChild(n)}let T=[];for(let e=0;e<p;e+=1){let t=176+e*42,n=i(`g`,{class:`mi-bar`}),r=i(`text`,{class:`mi-bar__label`,x:Au,y:t+Eu/2});n.appendChild(r);let a=i(`rect`,{class:`mi-bar__box`,x:0,y:t,width:10,height:Eu,rx:8});n.appendChild(a);let o=i(`text`,{class:`mi-bar__text`,x:0,y:t+Eu/2});n.appendChild(o),_.appendChild(n),T.push({g:n,label:r,box:a,text:o,y:t})}let E=i(`text`,{class:`mi-result__label`,x:Au,y:m});v.appendChild(E);let D=i(`rect`,{class:`mi-result__cur`,x:0,y:h,width:0,height:ku,rx:8});v.appendChild(D);let O=[];for(let e=0;e<p;e+=1){let e=i(`rect`,{class:`mi-result__seg`,x:0,y:h,width:0,height:ku,rx:8});v.appendChild(e),O.push(e)}let k=s();function A(e,t){if(!t)return;let{sorted:n,result:r}=t,i=t.phase,a=i===`done`,o=t.curStart!==null&&!a,s=i===`init`?t.intervals:n;if(T.forEach((e,n)=>{let r=s[n];if(!r){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`;let[i,o]=r;e.label.textContent=`[${i},${o}]`;let c=f(i),l=f(o);e.box.setAttribute(`x`,c),e.box.setAttribute(`width`,Math.max(8,l-c)),e.text.setAttribute(`x`,(c+l)/2),e.text.textContent=`${i} - ${o}`;let u=[`mi-bar`];n<=(t.idx??-1)&&!a&&u.push(`is-done`),n===t.idx&&!a&&u.push(`is-active`),e.g.setAttribute(`class`,u.join(` `))}),O.forEach((e,t)=>{let n=r[t];if(!n){e.style.opacity=`0`;return}e.style.opacity=`1`;let i=f(n[0]),a=f(n[1]);e.setAttribute(`x`,i),e.setAttribute(`width`,Math.max(6,a-i))}),E.textContent=`结果（已收 ${r.length} 段）`,o){let e=f(t.curStart),n=f(t.curEnd);D.setAttribute(`x`,e),D.setAttribute(`width`,Math.max(6,n-e)),D.style.opacity=`1`}else D.style.opacity=`0`;b.textContent=o?`当前 [${t.curStart}, ${t.curEnd}]`:`当前 -`,i===`init`?x.textContent=`先按左端点排序`:i===`sort`?x.textContent=`排序完成，开始扫描`:i===`start`?x.textContent=`第一段直接入座`:i===`extend`?x.textContent=`${t.sorted[t.idx][0]} <= ${t.curEnd} → 延伸（max 保底）`:i===`close`?x.textContent=`${t.sorted[t.idx][0]} > ${t.curEnd} → 收段、新开`:x.textContent=`最后一段收进结果`,S.textContent=a?`${t.result.length} 段`:`结果 ${t.result.length} 段`,Z(k,t.desc)}a.appendChild(k);let j=Q();a.appendChild(j.root),e.textContent=``,e.appendChild(a),X();let M=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,N=$({steps:n,controls:j,intervalMs:ju,onRender:A});N.jumpTo(Math.trunc(t.initialStep)||0);let P=null;return r&&!M&&typeof IntersectionObserver==`function`&&(P=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){P.disconnect(),P=null,N.play();return}},{threshold:.35}),P.observe(a)),{destroy(){P&&=(P.disconnect(),null),N.destroy(),e.textContent=``,delete e.dataset.miMounted,document.getElementById(xu)?.remove()}}}var Fu=[4,5,6,7,0,1,2],Iu=0;function Lu(e={}){let t=(Array.isArray(e.nums)?e.nums:Fu).slice(),n=t.length,r=Number.isInteger(e.target)?e.target:Iu,i=[],a=(e,n,a={})=>{i.push({phase:e,desc:n,nums:t,target:r,l:null,r:null,live:null,mid:null,midVal:null,ordered:null,range:null,foundIdx:null,done:e===`done`,...a})};if(n===0)return a(`done`,`输入是空的，返回 -1。`,{foundIdx:-1}),i;a(`init`,`在旋转数组 \`[${t.join(`, `)}]\` 里搜 \`${r}\`，要求 \`O(log n)\` —— 不能先旋转回来再搜。旋转数组的馈赠是：**mid 把区间切成的两半里，至少有一半完全有序**。所以每一步三连问：mid 是不是答案？哪一半有序？target 在有序的那半的值域里吗？在 → 进有序半；不在 → 目标只可能在另一半。`);let o=0,s=n-1,c=0;for(;o<=s&&c<100;){c+=1;let e=o,n=s,l=Math.floor((e+n)/2),u=t[l];if(u===r)return a(`probe`,`\`mid = ${l}\`，\`nums[${l}] = ${u}\` —— **正好是 target，命中**。`,{l:e,r:n,live:[e,n],mid:l,midVal:u,foundIdx:l}),a(`done`,`**target ${r} 的下标 = ${l}**。这趟每一步都是"判有序半 → 查值域 → 进对的那半"，\`O(log n)\`，和普通二分一样的复杂度 —— 旋转只是把"哪半有序"换了个位置，判断框架一个字没变。`,{l:e,r:n,live:[e,n],mid:l,midVal:u,foundIdx:l}),i;t[e]<=u?r>=t[e]&&r<u?(s=l-1,a(`probe`,`\`mid = ${l}\`（值 \`${u}\`，不是 target）。\`nums[l] = ${t[e]} <= nums[mid]\` —— **左半 \`[${e}, ${l}]\` 有序**，值域 \`[${t[e]}, ${u})\`。target \`${r}\` 在值域内 → 进左半 → \`r = ${l-1}\`。`,{l:e,r:n,live:[e,l-1],mid:l,midVal:u,ordered:`left`,range:[t[e],u]})):(o=l+1,a(`probe`,`\`mid = ${l}\`（值 \`${u}\`，不是 target）。\`nums[l] = ${t[e]} <= nums[mid]\` —— **左半有序**，值域 \`[${t[e]}, ${u})\`。target \`${r}\` 不在值域内 → 它只可能在**右半**（哪怕右半是断崖那侧）→ \`l = ${l+1}\`。`,{l:e,r:n,live:[l+1,n],mid:l,midVal:u,ordered:`left`,range:[t[e],u]})):r>u&&r<=t[n]?(o=l+1,a(`probe`,`\`mid = ${l}\`（值 \`${u}\`，不是 target）。\`nums[l] = ${t[e]} > nums[mid]\` —— **右半 \`[${l}, ${n}]\` 有序**，值域 \`(${u}, ${t[n]}]\`。target \`${r}\` 在值域内 → 进右半 → \`l = ${l+1}\`。`,{l:e,r:n,live:[l+1,n],mid:l,midVal:u,ordered:`right`,range:[u,t[n]]})):(s=l-1,a(`probe`,`\`mid = ${l}\`（值 \`${u}\`，不是 target）。\`nums[l] = ${t[e]} > nums[mid]\` —— **右半有序**，值域 \`(${u}, ${t[n]}]\`。target \`${r}\` 不在值域内 → 只可能在左半 → \`r = ${l-1}\`。`,{l:e,r:n,live:[e,l-1],mid:l,midVal:u,ordered:`right`,range:[u,t[n]]}))}return a(`done`,c>=100?`异常退出（步数上限），正常输入不会走到这里。`:`\`l > r\`，区间空了 —— **target \`${r}\` 不在数组里，返回 -1**。注意这趟每一步的"哪半有序"判断都没有出过错：二分在旋转数组上依然是对的，只要每一步都确认"要去的那半真的包含答案"。`,{l:o,r:s,live:[o,s],foundIdx:-1}),i}var Ru=`rsearch-styles`,zu=54,Bu=84,Vu=46,Hu=158,Uu=178,Wu=130,Gu=26,Ku=604,qu=1250,Ju=`
.rsearch {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.rsearch__svg { width: 100%; height: auto; display: block; }

.rsearch-note {
  fill: var(--rs-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rsearch-banner__box {
  fill: var(--rs-banner, #f4f3ef);
  stroke: var(--rs-line, #c3c9c2);
  stroke-width: 1.5;
}
.rsearch-banner__seg {
  fill: var(--rs-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rsearch-banner__ans {
  fill: var(--rs-gold, #c2872f);
  font-size: 18px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rsearch-banner__ans.is-miss {
  fill: var(--rs-hot, #a45f45);
}

.rsearch-cell__box {
  fill: var(--rs-fill, #ffffff);
  stroke: var(--rs-line, #c3c9c2);
  stroke-width: 1.5;
}
.rsearch-cell__val {
  fill: var(--rs-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rsearch-cell__idx {
  fill: var(--rs-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rsearch-cell.is-out .rsearch-cell__box {
  fill: var(--rs-dim-fill, #f0efea);
  stroke-dasharray: 4 3;
}
.rsearch-cell.is-out .rsearch-cell__val { fill: var(--rs-dim, #b9b9b3); }
/* 有序半：淡金底（通道一） */
.rsearch-cell.is-ordered .rsearch-cell__box { fill: var(--rs-gold-fill, #fdf3e3); }

.rsearch-pin--l { fill: var(--rs-ok, #3f6b57); }
.rsearch-pin--m { fill: var(--rs-hot, #a45f45); }
.rsearch-pin--r { fill: var(--rs-cmp, #5a7ea6); }
.rsearch-pin__tag { fill: inherit; }
.rsearch-pin__text {
  fill: var(--rs-paper, #ffffff);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* target 水平虚线 */
.rsearch-target__line {
  stroke: var(--rs-gold, #c2872f);
  stroke-width: 1.5;
  stroke-dasharray: 6 4;
}
.rsearch-target__text {
  fill: var(--rs-gold, #c2872f);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rsearch-hit__ring {
  fill: none;
  stroke: var(--rs-gold, #c2872f);
  stroke-width: 3;
}
.rsearch-hit__text {
  fill: var(--rs-gold, #c2872f);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rsearch-empty__text {
  fill: var(--rs-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function Yu(){if(document.getElementById(Ru))return;let e=document.createElement(`style`);e.id=Ru,e.textContent=Ju,document.head.appendChild(e)}function Xu(e,t={}){if(!e||e.dataset.rsMounted===`1`)return{destroy(){}};e.dataset.rsMounted=`1`,Yu();let n=Lu(t),r=t.autoplay!==!1,i=n[0].nums,a=n[0].target,o=i.length,s=Y,c=document.createElement(`div`);c.className=`viz rsearch`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(o===0){let t=s(`svg`,{class:`viz__svg rsearch__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`rsearch-empty__text`,x:310,y:60});return n.textContent=`空输入 —— 返回 -1`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),X(),{destroy(){e.textContent=``,delete e.dataset.rsMounted,document.getElementById(Ru)?.remove()}}}let d=58;o*d+(o-1)*6>Ku&&(d=Math.max(20,Math.floor((Ku-(o-1)*6)/o)));let f=o*d+(o-1)*6,p=Math.max(660,Gu*2+f),m=(p-f)/2,h=e=>m+e*(d+6)+d/2,g=Wu/Math.max(...i,a),_=e=>336-e*g,v=p-Gu*2,y=s(`svg`,{class:`viz__svg rsearch__svg`,viewBox:`0 0 ${p} 372`,role:`img`,"aria-label":`搜索旋转排序数组 推演动画`});l.appendChild(y);let b=s(`g`,{class:`rsearch-cells`}),x=s(`g`,{class:`rsearch-marks`});y.appendChild(b),y.appendChild(x);let S=s(`text`,{class:`rsearch-note`,x:Gu,y:zu});S.textContent=`mid 把区间切两半，至少一半有序 —— 在有序半查值域，就知道 target 在哪边`,x.appendChild(S),x.appendChild(s(`rect`,{class:`rsearch-banner__box`,x:Gu,y:Bu,width:v,height:Vu,rx:9}));let C=s(`text`,{class:`rsearch-banner__seg`,x:44,y:107}),w=s(`text`,{class:`rsearch-banner__seg`,x:266,y:107}),T=s(`text`,{class:`rsearch-banner__ans`,x:p-Gu-18,y:107});x.appendChild(C),x.appendChild(w),x.appendChild(T);let E=[];for(let e=0;e<o;e+=1){let t=s(`g`,{class:`rsearch-cell`}),n=Math.max(14,i[e]*g),r=s(`rect`,{class:`rsearch-cell__box`,x:h(e)-d/2,y:336-n,width:d,height:n,rx:5});t.appendChild(r);let a=s(`text`,{class:`rsearch-cell__val`,x:h(e),y:336-n+14});a.textContent=String(i[e]),t.appendChild(a);let o=s(`text`,{class:`rsearch-cell__idx`,x:h(e),y:364});o.textContent=String(e),t.appendChild(o),b.appendChild(t),E.push({g:t})}let D={};for(let e of[`l`,`m`,`r`]){let t=s(`g`,{class:`rsearch-pin rsearch-pin--${e}`}),n=s(`rect`,{class:`rsearch-pin__tag`,x:0,y:Hu,width:22,height:20,rx:5}),r=s(`path`,{class:`rsearch-pin__tag`,d:`M 0 0 L 0 0 L 0 0`}),i=s(`text`,{class:`rsearch-pin__text`,x:0,y:168});i.textContent=e,t.appendChild(n),t.appendChild(r),t.appendChild(i),x.appendChild(t),D[e]={g:t,tag:n,tri:r,text:i}}let O=s(`line`,{class:`rsearch-target__line`,x1:m-10,y1:0,x2:m+f+10,y2:0}),k=s(`text`,{class:`rsearch-target__text`,x:0,y:0});k.textContent=`target = ${a}`,x.appendChild(O),x.appendChild(k);let A=s(`circle`,{class:`rsearch-hit__ring`,cx:0,cy:0,r:0}),j=s(`text`,{class:`rsearch-hit__text`,x:0,y:0});x.appendChild(A),x.appendChild(j);let M=u();function N(e,t){if(!t)return;let n=t.phase===`done`,r=t.live??(t.l===null?null:[t.l,t.r]),s=new Set;if(t.ordered===`left`&&t.mid!==null)for(let e=t.l;e<=t.mid;e+=1)s.add(e);else if(t.ordered===`right`&&t.mid!==null)for(let e=t.mid;e<=t.r;e+=1)s.add(e);E.forEach((e,t)=>{let n=[`rsearch-cell`];r&&(t<r[0]||t>r[1])?n.push(`is-out`):s.has(t)&&n.push(`is-ordered`),e.g.setAttribute(`class`,n.join(` `))});let c=(e,t)=>{let n=D[e];if(t==null||t<0||t>=o){n.g.style.opacity=`0`;return}let r=h(t);n.tag.setAttribute(`x`,r-11),n.tri.setAttribute(`d`,`M ${r-6} ${Uu} L ${r+6} ${Uu} L ${r} 187 z`),n.text.setAttribute(`x`,r),n.g.style.opacity=`1`};c(`l`,t.l),c(`m`,n?null:t.mid),c(`r`,n?null:t.r);let l=_(a);if(O.setAttribute(`y1`,l),O.setAttribute(`y2`,l),k.setAttribute(`x`,m+f+12),k.setAttribute(`y`,l),t.foundIdx!==null&&t.foundIdx>=0){let e=h(t.foundIdx),n=Math.max(14,i[t.foundIdx]*g);A.setAttribute(`cx`,e),A.setAttribute(`cy`,336-n/2),A.setAttribute(`r`,Math.max(16,d/2+6)),j.setAttribute(`x`,e),j.setAttribute(`y`,336-n-22),j.textContent=`下标 ${t.foundIdx}`,A.style.opacity=`1`,j.style.opacity=`1`}else A.style.opacity=`0`,j.style.opacity=`0`;C.textContent=r?`存活区间 [${r[0]}, ${r[1]}]`:`存活区间 -`,t.phase===`init`?w.textContent=`在 ${t.nums.length} 个数里找 target = ${a}`:t.ordered===`left`?w.textContent=`左半 [${t.l}, ${t.mid}] 有序，值域 [${t.range[0]}, ${t.range[1]})`:t.ordered===`right`?w.textContent=`右半 [${t.mid}, ${t.r}] 有序，值域 (${t.range[0]}, ${t.range[1]}]`:n&&t.foundIdx!==null&&t.foundIdx>=0?w.textContent=`命中`:n?w.textContent=`区间空了，不存在`:w.textContent=``;let u=n&&(t.foundIdx===null||t.foundIdx<0);T.textContent=u?`-1`:t.foundIdx!==null&&t.foundIdx>=0?`下标 ${t.foundIdx}`:`?`,T.setAttribute(`class`,u?`rsearch-banner__ans is-miss`:`rsearch-banner__ans`),Z(M,t.desc)}c.appendChild(M);let P=Q();c.appendChild(P.root),e.textContent=``,e.appendChild(c),X();let F=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,I=$({steps:n,controls:P,intervalMs:qu,onRender:N});I.jumpTo(Math.trunc(t.initialStep)||0);let L=null;return r&&!F&&typeof IntersectionObserver==`function`&&(L=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){L.disconnect(),L=null,I.play();return}},{threshold:.35}),L.observe(c)),{destroy(){L&&=(L.disconnect(),null),I.destroy(),e.textContent=``,delete e.dataset.rsMounted,document.getElementById(Ru)?.remove()}}}var Zu=[4,5,6,7,0,1,2];function Qu(e={}){let t=(Array.isArray(e.nums)?e.nums:Zu).slice(),n=t.length,r=[],i=(e,n,i={})=>{r.push({phase:e,desc:n,nums:t,l:null,r:null,live:null,mid:null,midVal:null,rightVal:null,cmp:null,minIdx:null,done:e===`done`,...i})};if(n===0)return i(`done`,`输入是空的，没有最小值。`),r;i(`init`,`旋转数组 \`[${t.join(`, `)}]\`：把一段递增数组从中间切开、两段换个位置 —— 它因此变成**两段各自上升的折线，中间一道断崖**，最小值就站在断崖右侧那段的起点上。二分的每一步只问一个问题：**\`nums[mid]\` 和 \`nums[r]\` 谁大？** \`nums[mid] > nums[r]\` 说明 mid 站在断崖左边（第一段上），最小值在它右边；\`nums[mid] < nums[r]\` 说明 mid 已经在第二段上，最小值在 \`[l, mid]\` 里 —— mid 自己可能就是答案，所以左边界的收缩是 \`r = mid\` 而不是 \`r = mid - 1\`。`);let a=0,o=n-1,s=0;for(;a<o&&s<100;){s+=1;let e=a,n=o,r=Math.floor((e+n)/2),c=t[r],l=t[n];c>l?(a=r+1,i(`probe`,`\`mid = ${r}\`，\`nums[${r}] = ${c} > nums[${n}] = ${l}\` —— mid 站在**断崖左边的第一段**上（它比末尾还大，说明它右边一定跨过了断崖、有更小的数），最小值在 \`[${r+1}, ${n}]\`，mid 自己被淘汰 → \`l = ${r+1}\`。`,{l:e,r:n,live:[a,o],mid:r,midVal:c,rightVal:l,cmp:`>`})):(o=r,i(`probe`,`\`mid = ${r}\`，\`nums[${r}] = ${c} < nums[${n}] = ${l}\` —— mid 已经站在**断崖右边的第二段**上（或者断崖就是 mid 本身），最小值在 \`[${e}, ${r}]\` 里。注意 **mid 可能就是最小值，不能丢** → \`r = ${r}\`（不是 mid-1）。`,{l:e,r:n,live:[a,o],mid:r,midVal:c,rightVal:l,cmp:`<`}))}let c=a;return i(`done`,a===o?`\`l\` 和 \`r\` 相遇在下标 \`${a}\` —— **最小值 = \`nums[${a}] = ${t[a]}\`**。回头看这趟：每一步只用一次比较，就把一半的候选**确定性地**淘汰掉，\`O(log n)\`。数组没旋转时同样成立：mid 永远 < right，一直往左缩，最后停在 nums[0] —— 退化成"找头"，但复杂度不变。`:`异常退出（步数上限），正常输入不会走到这里。`,{l:a,r:o,live:[a,o],mid:a,midVal:t[a],rightVal:t[o],minIdx:c,cmp:null}),r}var $u=`rmin-styles`,ed=54,td=84,nd=46,rd=158,id=178,ad=130,od=26,sd=604,cd=1250,ld=`
.rmin {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.rmin__svg { width: 100%; height: auto; display: block; }

.rmin-note {
  fill: var(--rmin-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rmin-banner__box {
  fill: var(--rmin-banner, #f4f3ef);
  stroke: var(--rmin-line, #c3c9c2);
  stroke-width: 1.5;
}
.rmin-banner__seg {
  fill: var(--rmin-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rmin-banner__ans {
  fill: var(--rmin-gold, #c2872f);
  font-size: 18px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rmin-cell__box {
  fill: var(--rmin-fill, #ffffff);
  stroke: var(--rmin-line, #c3c9c2);
  stroke-width: 1.5;
}
.rmin-cell__val {
  fill: var(--rmin-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rmin-cell__idx {
  fill: var(--rmin-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 存活区外的柱子灰化 */
.rmin-cell.is-out .rmin-cell__box {
  fill: var(--rmin-dim-fill, #f0efea);
  stroke-dasharray: 4 3;
}
.rmin-cell.is-out .rmin-cell__val { fill: var(--rmin-dim, #b9b9b3); }
/* mid 比较基准的柱子给个淡金底 */
.rmin-cell.is-base .rmin-cell__box { fill: var(--rmin-gold-fill, #fdf3e3); }

/* 指针 */
.rmin-pin--l { fill: var(--rmin-ok, #3f6b57); }
.rmin-pin--m { fill: var(--rmin-hot, #a45f45); }
.rmin-pin--r { fill: var(--rmin-cmp, #5a7ea6); }
.rmin-pin__tag { fill: inherit; }
.rmin-pin__text {
  fill: var(--rmin-paper, #ffffff);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 最小值金环 */
.rmin-min__ring {
  fill: none;
  stroke: var(--rmin-gold, #c2872f);
  stroke-width: 3;
}
.rmin-min__text {
  fill: var(--rmin-gold, #c2872f);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rmin-empty__text {
  fill: var(--rmin-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function ud(){if(document.getElementById($u))return;let e=document.createElement(`style`);e.id=$u,e.textContent=ld,document.head.appendChild(e)}function dd(e,t={}){if(!e||e.dataset.rminMounted===`1`)return{destroy(){}};e.dataset.rminMounted=`1`,ud();let n=Qu(t),r=t.autoplay!==!1,i=n[0].nums,a=i.length,o=Y,s=document.createElement(`div`);s.className=`viz rmin`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);function l(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(a===0){let t=o(`svg`,{class:`viz__svg rmin__svg`,viewBox:`0 0 620 120`,role:`img`}),n=o(`text`,{class:`rmin-empty__text`,x:310,y:60});return n.textContent=`空输入 —— 没有最小值`,t.appendChild(n),c.appendChild(t),s.appendChild(l()),s.appendChild(Q().root),e.textContent=``,e.appendChild(s),X(),{destroy(){e.textContent=``,delete e.dataset.rminMounted,document.getElementById($u)?.remove()}}}let u=58;a*u+(a-1)*6>sd&&(u=Math.max(20,Math.floor((sd-(a-1)*6)/a)));let d=a*u+(a-1)*6,f=Math.max(660,od*2+d),p=(f-d)/2,m=e=>p+e*(u+6)+u/2,h=ad/Math.max(...i),g=e=>Math.max(14,e*h),_=f-od*2,v=o(`svg`,{class:`viz__svg rmin__svg`,viewBox:`0 0 ${f} 372`,role:`img`,"aria-label":`寻找旋转排序数组中的最小值 推演动画`});c.appendChild(v);let y=o(`g`,{class:`rmin-cells`}),b=o(`g`,{class:`rmin-marks`});v.appendChild(y),v.appendChild(b);let x=o(`text`,{class:`rmin-note`,x:od,y:ed});x.textContent=`只问一句：nums[mid] 和 nums[right] 谁大 —— 断崖在哪边，最小值就在哪边`,b.appendChild(x),b.appendChild(o(`rect`,{class:`rmin-banner__box`,x:od,y:td,width:_,height:nd,rx:9}));let S=o(`text`,{class:`rmin-banner__seg`,x:44,y:107}),C=o(`text`,{class:`rmin-banner__seg`,x:256,y:107}),w=o(`text`,{class:`rmin-banner__ans`,x:f-od-18,y:107});b.appendChild(S),b.appendChild(C),b.appendChild(w);let T=[];for(let e=0;e<a;e+=1){let t=o(`g`,{class:`rmin-cell`}),n=g(i[e]),r=o(`rect`,{class:`rmin-cell__box`,x:m(e)-u/2,y:336-n,width:u,height:n,rx:5});t.appendChild(r);let a=o(`text`,{class:`rmin-cell__val`,x:m(e),y:336-n+14});a.textContent=String(i[e]),t.appendChild(a);let s=o(`text`,{class:`rmin-cell__idx`,x:m(e),y:364});s.textContent=String(e),t.appendChild(s),y.appendChild(t),T.push({g:t})}let E={};for(let e of[`l`,`m`,`r`]){let t=o(`g`,{class:`rmin-pin rmin-pin--${e}`}),n=o(`rect`,{class:`rmin-pin__tag`,x:0,y:rd,width:22,height:20,rx:5}),r=o(`path`,{class:`rmin-pin__tag`,d:`M 0 0 L 0 0 L 0 0`}),i=o(`text`,{class:`rmin-pin__text`,x:0,y:168});i.textContent=e,t.appendChild(n),t.appendChild(r),t.appendChild(i),b.appendChild(t),E[e]={g:t,tag:n,tri:r,text:i}}let D=o(`circle`,{class:`rmin-min__ring`,cx:0,cy:0,r:0}),O=o(`text`,{class:`rmin-min__text`,x:0,y:0});b.appendChild(D),b.appendChild(O);let k=l();function A(e,t){if(!t)return;let n=t.phase===`done`,r=t.live??(t.l===null?null:[t.l,t.r]);T.forEach((e,i)=>{let a=[`rmin-cell`];r&&(i<r[0]||i>r[1])&&a.push(`is-out`),!n&&t.r!==null&&i===t.r&&a.push(`is-base`),e.g.setAttribute(`class`,a.join(` `))});let o=e=>m(e),s=(e,t)=>{let n=E[e];if(t==null||t<0||t>=a){n.g.style.opacity=`0`;return}let r=o(t);n.tag.setAttribute(`x`,r-11),n.tri.setAttribute(`d`,`M ${r-6} ${id} L ${r+6} ${id} L ${r} 187 z`),n.text.setAttribute(`x`,r),n.g.style.opacity=`1`};if(s(`l`,t.l),s(`m`,n?null:t.mid),s(`r`,n?null:t.r),n&&t.minIdx!==null){let e=m(t.minIdx),n=g(i[t.minIdx]);D.setAttribute(`cx`,e),D.setAttribute(`cy`,336-n/2),D.setAttribute(`r`,Math.max(16,u/2+6)),O.setAttribute(`x`,e),O.setAttribute(`y`,336-n-22),O.textContent=`min = ${i[t.minIdx]}`,D.style.opacity=`1`,O.style.opacity=`1`}else D.style.opacity=`0`,O.style.opacity=`0`;S.textContent=r?`存活区间 [${r[0]}, ${r[1]}]`:`存活区间 -`,t.phase===`init`?C.textContent=`mid 和 nums[right] 比：断崖在哪边，最小值就在哪边`:t.cmp===`>`?C.textContent=`${t.midVal} > ${t.rightVal} → mid 在第一段，去右边`:t.cmp===`<`?C.textContent=`${t.midVal} < ${t.rightVal} → mid 在第二段，r = mid`:n?C.textContent=`l 与 r 相遇`:C.textContent=``,w.textContent=n&&t.minIdx!==null?`min ${t.nums[t.minIdx]}`:`min ?`,Z(k,t.desc)}s.appendChild(k);let j=Q();s.appendChild(j.root),e.textContent=``,e.appendChild(s),X();let M=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,N=$({steps:n,controls:j,intervalMs:cd,onRender:A});N.jumpTo(Math.trunc(t.initialStep)||0);let P=null;return r&&!M&&typeof IntersectionObserver==`function`&&(P=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){P.disconnect(),P=null,N.play();return}},{threshold:.35}),P.observe(s)),{destroy(){P&&=(P.disconnect(),null),N.destroy(),e.textContent=``,delete e.dataset.rminMounted,document.getElementById($u)?.remove()}}}var fd=[1,2,3,4,5,6,7],pd=3;function md(e={}){let t=(Array.isArray(e.nums)?e.nums:fd).slice(),n=t.length,r=Number.isInteger(e.k)?e.k:pd,i=n>0?(r%n+n)%n:0,a=[],o=(e,r,o={})=>{a.push({phase:e,desc:r,arr:t.slice(),n,k:i,round:0,roundName:``,flipRange:null,i:null,j:null,swapsDone:0,done:e===`done`,...o})};if(n===0)return o(`done`,`输入是空的，没有可轮转的元素。`),a;if(o(`init`,`给了 \`${n}\` 个数 \`[${t.join(`, `)}]\`，向右轮转 \`${r}\` 位。先取模：\`k = ${r} mod ${n} = ${i}\`（轮转 n 位等于没转，k 可能比 n 大）。`+(i===0?`取模后 k = 0 —— 数组不变，直接结束。`:`要求的进阶是 **O(1) 额外空间**，排除"再开一个数组按位搬运"，剩下的是**三次原地翻转**：① 整体翻转；② 翻转前 k 个；③ 翻转后 n-k 个。原理一句话：**轮转 = 两段交换左右位置**，整体翻转让两段就位（内部顺序全倒），再各自翻回来 —— 反转是自己的逆运算，两次反转让内部顺序复原。`)),i===0)return o(`done`,`取模后 \`k = 0\`，数组不变：\`[${t.join(`, `)}]\`。顺带一个语言坑：Python 切片写法 \`nums[-k:] + nums[:-k]\` 在 k=0 时会炸 —— \`-0\` 就是 \`0\`，\`nums[-0:]\` 是**整个数组**，结果变成"数组接上自己"。所以切片法必须先取模、再特判 k=0（或写 \`nums[n-k:]\`）。`),a;let s=[{a:0,b:n-1,name:`整体翻转`},{a:0,b:i-1,name:`翻转前 k`},{a:i,b:n-1,name:`翻转后 n-k`}],c=0;for(let{a:e,b:n,name:r}of s){c+=1;let i=0,a=e,s=n;for(;a<s;){let l=t[a];t[a]=t[s],t[s]=l,i+=1,o(`flip`,`**第 \`${c}\` 次（${r}，区间 \`[${e}, ${n}]\`）**：交换 \`i = ${a}\` 与 \`j = ${s}\` —— \`${t[s]}\` 和 \`${t[a]}\` 换位（swap 后），数组变成 \`[${t.join(`, `)}]\`。双指针向中间收拢：\`i → ${a+1}\`，\`j → ${s-1}\`。`+(a+1<s-1?` 还有交换要做。`:a+1===s-1?` 还剩中间一对。`:` 本轮翻转完成。`),{round:c,roundName:r,flipRange:[e,n],i:a,j:s,swapsDone:i}),a+=1,--s}i===0&&o(`flip`,`**第 \`${c}\` 次（${r}，区间 \`[${e}, ${n}]\`）**：区间长度不足 2，不需要交换（k = 1 时"前 k 个"就是单元素，天然有序）。`,{round:c,roundName:r,flipRange:[e,n],i:null,j:null,swapsDone:0})}return o(`done`,`三次翻转完成。**答案 = [${t.join(`, `)}]**。回头看这三步：每一步都只做**原地交换**，总共 ${c} 轮、每轮扫描一半区间，时间 \`O(n)\`，**额外空间 O(1)** —— 这就是题目进阶要的答案。对照另一种 O(1) 解法"环状替换"（从 0 出发按 \`(i + k) mod n\` 跳环，需要数 gcd 圈），三次翻转不需要任何数论，好写好记 —— 面试首选。`,{arr:t.slice(),round:3,roundName:`完成`,done:!0}),a}var hd=`rot-styles`,gd=54,_d=84,vd=46,yd=152,bd=172,xd=194,Sd=52,Cd=262,wd=286,Td=26,Ed=604,Dd=1250,Od=`
.rot {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.rot__svg { width: 100%; height: auto; display: block; }

.rot-note {
  fill: var(--rot-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rot-banner__box {
  fill: var(--rot-banner, #f4f3ef);
  stroke: var(--rot-line, #c3c9c2);
  stroke-width: 1.5;
}
.rot-banner__seg {
  fill: var(--rot-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rot-banner__ans {
  fill: var(--rot-gold, #c2872f);
  font-size: 18px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rot-cell__box {
  fill: var(--rot-fill, #ffffff);
  stroke: var(--rot-line, #c3c9c2);
  stroke-width: 1.5;
}
.rot-cell__val {
  fill: var(--rot-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rot-cell__idx {
  fill: var(--rot-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 通道一（底色）：当前翻转区间 */
.rot-cell.is-flipping .rot-cell__box { fill: var(--rot-gold-fill, #fdf3e3); }
/* 通道二（边框）：本帧交换的两格 */
.rot-cell.is-swap .rot-cell__box {
  stroke: var(--rot-hot, #a45f45);
  stroke-width: 3;
}
.rot-cell.is-swap .rot-cell__val { fill: var(--rot-hot, #a45f45); }
/* done 帧：全部就位 */
.rot-cell.is-done .rot-cell__box {
  fill: var(--rot-ok-fill, #eef5f1);
  stroke: var(--rot-ok, #3f6b57);
  stroke-width: 2;
}
.rot-cell.is-done .rot-cell__val { fill: var(--rot-ok, #3f6b57); }

.rot-pin__tag { fill: var(--rot-hot, #a45f45); }
.rot-pin__tri { fill: var(--rot-hot, #a45f45); }
.rot-pin__text {
  fill: var(--rot-paper, #ffffff);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rot-phase__text {
  fill: var(--rot-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rot-empty__text {
  fill: var(--rot-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`;function kd(){if(document.getElementById(hd))return;let e=document.createElement(`style`);e.id=hd,e.textContent=Od,document.head.appendChild(e)}function Ad(e,t={}){if(!e||e.dataset.rotMounted===`1`)return{destroy(){}};e.dataset.rotMounted=`1`,kd();let n=md(t),r=t.autoplay!==!1,i=n[0].arr.length,a=Y,o=document.createElement(`div`);o.className=`viz rot`;let s=document.createElement(`div`);s.className=`viz__stage`,o.appendChild(s);function c(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(i===0){let t=a(`svg`,{class:`viz__svg rot__svg`,viewBox:`0 0 620 120`,role:`img`}),n=a(`text`,{class:`rot-empty__text`,x:310,y:60});return n.textContent=`空输入 —— 没有可轮转的元素`,t.appendChild(n),s.appendChild(t),o.appendChild(c()),o.appendChild(Q().root),e.textContent=``,e.appendChild(o),X(),{destroy(){e.textContent=``,delete e.dataset.rotMounted,document.getElementById(hd)?.remove()}}}let l=58;i*l+(i-1)*6>Ed&&(l=Math.max(20,Math.floor((Ed-(i-1)*6)/i)));let u=i*l+(i-1)*6,d=Math.max(660,Td*2+u),f=(d-u)/2,p=e=>f+e*(l+6)+l/2,m=d-Td*2,h=a(`svg`,{class:`viz__svg rot__svg`,viewBox:`0 0 ${d} 310`,role:`img`,"aria-label":`轮转数组 三次翻转推演动画`});s.appendChild(h);let g=a(`g`,{class:`rot-cells`}),_=a(`g`,{class:`rot-marks`});h.appendChild(g),h.appendChild(_);let v=a(`text`,{class:`rot-note`,x:Td,y:gd});v.textContent=`轮转 = 两段交换位置：整体翻转让两段就位，再各自翻回内部顺序`,_.appendChild(v),_.appendChild(a(`rect`,{class:`rot-banner__box`,x:Td,y:_d,width:m,height:vd,rx:9}));let y=a(`text`,{class:`rot-banner__seg`,x:44,y:107}),b=a(`text`,{class:`rot-banner__seg`,x:276,y:107}),x=a(`text`,{class:`rot-banner__ans`,x:d-Td-18,y:107});_.appendChild(y),_.appendChild(b),_.appendChild(x);let S=[];for(let e=0;e<i;e+=1){let t=a(`g`,{class:`rot-cell`}),n=a(`rect`,{class:`rot-cell__box`,x:p(e)-l/2,y:xd,width:l,height:Sd,rx:6});t.appendChild(n);let r=a(`text`,{class:`rot-cell__val`,x:p(e),y:220});t.appendChild(r);let i=a(`text`,{class:`rot-cell__idx`,x:p(e),y:Cd});i.textContent=String(e),t.appendChild(i),g.appendChild(t),S.push({g:t,box:n,val:r})}let C=a(`g`,{class:`rot-pin`}),w=a(`rect`,{class:`rot-pin__tag`,x:0,y:yd,width:30,height:20,rx:5}),T=a(`path`,{class:`rot-pin__tri`,d:`M 0 0 L 0 0 L 0 0`}),E=a(`text`,{class:`rot-pin__text`,x:0,y:162});C.appendChild(w),C.appendChild(T),C.appendChild(E),_.appendChild(C);let D=a(`text`,{class:`rot-phase__text`,x:d/2,y:wd});_.appendChild(D);let O=c();function k(e,t){if(!t)return;let{arr:n,k:r,n:i}=t,a=t.phase===`done`,o=new Set;t.phase===`flip`&&t.i!==null&&(o.add(t.i),o.add(t.j));let s=t.flipRange;if(S.forEach((e,t)=>{e.val.textContent=String(n[t]);let r=[`rot-cell`];a?r.push(`is-done`):s&&t>=s[0]&&t<=s[1]&&r.push(`is-flipping`),o.has(t)&&r.push(`is-swap`),e.g.setAttribute(`class`,r.join(` `))}),t.phase===`flip`&&t.i!==null){let e=p(t.i);w.setAttribute(`x`,e-15),T.setAttribute(`d`,`M ${e-6} ${bd} L ${e+6} ${bd} L ${e} 181 z`),E.setAttribute(`x`,e),E.textContent=`i=${t.i}`,C.style.opacity=`1`}else C.style.opacity=`0`;y.textContent=t.round>0?`第 ${t.round}/3 次 · ${t.roundName}`:`k = ${r}（mod ${i}）`,t.phase===`init`?b.textContent=`取模 → 三次原地翻转`:t.phase===`flip`&&t.i!==null?b.textContent=`swap(${t.i}, ${t.j})`:t.phase===`flip`?b.textContent=`区间长度不足 2，跳过`:b.textContent=`三次翻转完成`,x.textContent=a?`[${n.join(`,`)}]`:`${i} 个数 · 轮转 ${r} 位`;let c=[`整体`,`前 k`,`后 n-k`].map((e,n)=>{let r=a||t.round>n||t.round===n+1&&t.phase===`flip`&&t.i===null,i=t.round===n+1&&t.phase===`flip`;return`${r?`[x]`:i?`[>]`:`[ ]`} ${e}`});D.textContent=c.join(`   `),Z(O,t.desc)}o.appendChild(O);let A=Q();o.appendChild(A.root),e.textContent=``,e.appendChild(o),X();let j=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,M=$({steps:n,controls:A,intervalMs:Dd,onRender:k});M.jumpTo(Math.trunc(t.initialStep)||0);let N=null;return r&&!j&&typeof IntersectionObserver==`function`&&(N=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){N.disconnect(),N=null,M.play();return}},{threshold:.35}),N.observe(o)),{destroy(){N&&=(N.disconnect(),null),M.destroy(),e.textContent=``,delete e.dataset.rotMounted,document.getElementById(hd)?.remove()}}}var jd=`456`,Md=`77`;function Nd(e={}){let t=typeof e.num1==`string`&&e.num1.length>0?e.num1:jd,n=typeof e.num2==`string`&&e.num2.length>0?e.num2:Md,r=[],i=(e,i,a={})=>{r.push({phase:e,desc:i,num1:t,num2:n,col:-1,i:null,j:null,digitA:0,digitB:0,zeroA:!1,zeroB:!1,carryIn:0,sum:0,out:0,carryOut:0,resLow:[],maxLen:Math.max(t.length,n.length),done:e===`done`,...a})};i(`init`,`给了两个字符串形式的非负整数：\`${t}\` 和 \`${n}\`。题目禁止转整数、也没有大数类型 —— 这不是刁难，而是**排除法**：把「先转数字再算」的捷径全部排除，剩下的就是**小学列竖式** —— 从个位起，每一位算「两位数字 + 低位进位」，写下个位、把进位带上去。双指针 \`i\`、\`j\` 从两个串的**末尾**（个位）出发，指针不断左移对齐数位；循环条件是**三连 or**：\`i >= 0 || j >= 0 || carry > 0\` —— 前两个管「还有数位没加」，carry 管「最后还有进位要长出一位」。`);let a=t.length-1,o=n.length-1,s=0,c=[],l=Math.max(t.length,n.length),u=0;for(;a>=0||o>=0||s>0;){u+=1;let e=l-u,r=a>=0?t.charCodeAt(a)-48:0,d=o>=0?n.charCodeAt(o)-48:0,f=a<0,p=o<0,m=r+d+s,h=m%10,g=+(m>=10);c.push(h);let _=Pd(e,l),v=[];v.push(`**${_}（第 \`${u}\` 列）**：`),v.push(f?"`0`（补零，num1 已走完）":`\`${r}\``),v.push(` + `),v.push(p?"`0`（补零，num2 已走完）":`\`${d}\``),v.push(` + 进位 \`${s}\` = \`${m}\``),m>=10?v.push(` —— 满十进一：**写下 \`${h}\`，进位 \`${g}\` 带上一位**。`):v.push(` —— 不满十：**写下 \`${h}\`，进位归 \`${g}\`**。`),v.push(a-1>=0||o-1>=0||g>0?`指针左移：\`i → ${a-1}\`，\`j → ${o-1}\`。`:`两串都走完、进位也是 0 —— 循环终止。`),i(`digit`,v.join(``),{col:e,i:a,j:o,digitA:r,digitB:d,zeroA:f,zeroB:p,carryIn:s,sum:m,out:h,carryOut:g,resLow:c.slice()}),--a,--o,s=g}let d=c.slice().reverse().join(``);return i(`done`,`所有列处理完，进位 \`0\`，循环停。结果低位在前（push 顺序就是从个位往高位），**reverse 后 join 成字符串：答案 = "${d}"**。回头看整个流程：每列只有一次「加-写-进」决策，时间 \`O(max(m, n))\`，除结果串外**额外空间 O(1)**。三个坑对照：一侧走完要**补 0** 而不是跳过；循环条件**漏掉 carry** 会丢最高位（\`"999" + "1"\` 会得 \`"000"\`）；结果用 \`push\` + 末尾 \`reverse\`，别用 \`unshift\` 头插（每帧 O(n)，整体 O(n^2)）。`,{col:-1,i:-1,j:-1,resLow:c.slice(),result:d,carryOut:0}),r}function Pd(e,t){let n=t-1-e,r=[`个位`,`十位`,`百位`,`千位`];return n<r.length?r[n]:`10^${n} 位`}var Fd=`addstr-styles`,Id=54,Ld=84,Rd=46,zd=150,Bd=162,Vd=184,Hd=194,Ud=46,Wd=252,Gd=274,Kd=284,qd=346,Jd=360,Yd=424,Xd=450,Zd=26,Qd=604,$d=1300,ef=`
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
`;function tf(){if(document.getElementById(Fd))return;let e=document.createElement(`style`);e.id=Fd,e.textContent=ef,document.head.appendChild(e)}function nf(e,t={}){if(!e||e.dataset.addstrMounted===`1`)return{destroy(){}};e.dataset.addstrMounted=`1`,tf();let n=Nd(t),r=t.autoplay!==!1,i=n[0],a=i.num1,o=i.num2,s=i.maxLen,c=Y,l=document.createElement(`div`);l.className=`viz addstr`;let u=document.createElement(`div`);u.className=`viz__stage`,l.appendChild(u);function d(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let f=58;(s+1)*f+s*6>Qd&&(f=Math.max(26,Math.floor((Qd-s*6)/(s+1))));let p=(s+1)*f+s*6,m=s*f+(s-1)*6,h=Math.max(660,Zd*2+p),g=h-Zd,_=g-p,v=g-m,y=e=>v+e*(f+6)+f/2,b=e=>_+e*(f+6)+f/2,x=h-Zd*2,S=c(`svg`,{class:`viz__svg addstr__svg`,viewBox:`0 0 ${h} 474`,role:`img`,"aria-label":`字符串相加 竖式加法推演动画`});u.appendChild(S);let C=c(`g`,{class:`addstr-cells`}),w=c(`g`,{class:`addstr-marks`});S.appendChild(C),S.appendChild(w);let T=c(`text`,{class:`addstr-note`,x:Zd,y:Id});T.textContent=`竖式加法：从个位起，每位算「两位数字 + 低位进位」，写下个位、进位带上`,w.appendChild(T),w.appendChild(c(`rect`,{class:`addstr-banner__box`,x:Zd,y:Ld,width:x,height:Rd,rx:9}));let E=c(`text`,{class:`addstr-banner__seg`,x:44,y:107}),D=c(`text`,{class:`addstr-banner__seg`,x:236,y:107}),O=c(`text`,{class:`addstr-banner__ans`,x:h-Zd-18,y:107});w.appendChild(E),w.appendChild(D),w.appendChild(O);let k=(e,t)=>{let n=c(`text`,{x:_-14,y:e,style:`fill: var(--addstr-muted, #657168); font-size: 12px; text-anchor: end; dominant-baseline: central; font-family: Consolas, monospace;`});n.textContent=t,w.appendChild(n)},A=[];for(let e=0;e<s;e+=1){let t=c(`text`,{class:`addstr-carry`,x:y(e),y:zd});t.style.opacity=`0`,w.appendChild(t),A.push(t)}function j(e,t){let n=[];for(let r=0;r<t;r+=1){let t=c(`g`,{class:`addstr-cell`}),i=c(`rect`,{class:`addstr-cell__box`,x:y(r)-f/2,y:e,width:f,height:Ud,rx:6});t.appendChild(i);let a=c(`text`,{class:`addstr-cell__val`,x:y(r),y:e+Ud/2});t.appendChild(a),C.appendChild(t),n.push({g:t,box:i,val:a})}return n}let M=j(Hd,s),N=j(Kd,s),P=c(`line`,{class:`addstr-rule`,x1:_,y1:qd,x2:g,y2:qd});w.appendChild(P);let F=[];for(let e=0;e<=s;e+=1){let t=c(`g`,{class:`addstr-cell`}),n=c(`rect`,{class:`addstr-cell__box`,x:b(e)-f/2,y:Jd,width:f,height:Ud,rx:6});t.appendChild(n);let r=c(`text`,{class:`addstr-cell__val`,x:b(e),y:383});t.appendChild(r),C.appendChild(t),F.push({g:t,box:n,val:r})}for(let e=1;e<=s;e+=1){let t=c(`text`,{class:`addstr-cell__idx`,x:b(e),y:Yd});t.textContent=String(e-1),w.appendChild(t)}function I(e,t){let n=c(`g`,{class:`addstr-pin`}),r=c(`rect`,{class:`addstr-pin__tag`,x:0,y:e,width:34,height:20,rx:5}),i=c(`path`,{class:`addstr-pin__tri`,d:`M 0 0 L 0 0 L 0 0`}),a=c(`text`,{class:`addstr-pin__text`,x:0,y:e+10});return n.appendChild(r),n.appendChild(i),n.appendChild(a),w.appendChild(n),{g:n,tag:r,tri:i,text:a}}let L=I(Bd,Vd),R=I(Wd,Gd),z=c(`text`,{class:`addstr-phase__text`,x:h/2,y:Xd});w.appendChild(z),k(217,`num1`),k(307,`num2`),k(383,`res`);let B=d();function V(e,t){if(!t)return;let n=t.phase===`done`,r=t.phase===`digit`;A.forEach((e,n)=>{let i=r&&t.carryOut>0&&n===t.col-1;e.textContent=`1`,e.style.opacity=i?`1`:`0`});let i=(e,n,i,a)=>{let o=n.length;e.forEach((e,i)=>{let c=i>=s-o,l=[`addstr-cell`];e.val.classList.remove(`is-zero`),c?(e.box.classList.remove(`is-dashed`),e.val.textContent=n[i-(s-o)],r&&i===t.col&&l.push(`is-active`)):(e.box.classList.add(`is-dashed`),r&&a&&i===t.col?(e.val.textContent=`0`,e.val.classList.add(`is-zero`)):e.val.textContent=``),e.g.setAttribute(`class`,l.join(` `))})};i(M,a,t.i,r&&t.zeroA),i(N,o,t.j,r&&t.zeroB);let c=t.resLow.length;F.forEach((e,i)=>{let a=[`addstr-cell`];if(e.val.classList.remove(`is-zero`),e.box.classList.remove(`is-dashed`),n){let n=s-i;n<c?(e.val.textContent=String(t.resLow[n]),a.push(`is-done`)):(e.box.classList.add(`is-dashed`),e.val.textContent=``)}else if(r){let n=s-i;n<c?(e.val.textContent=String(t.resLow[n]),n===c-1&&a.push(`is-fresh`)):(e.box.classList.add(`is-dashed`),e.val.textContent=``)}else e.box.classList.add(`is-dashed`),e.val.textContent=``;e.g.setAttribute(`class`,a.join(` `))});let l=(e,t,n,i,a,o)=>{let c=t+(s-n);if(r&&t>=0&&c>=0&&c<s){let t=y(c);e.tag.setAttribute(`x`,t-17),e.tri.setAttribute(`d`,`M ${t-6} ${a} L ${t+6} ${a} L ${t} ${a+9} z`),e.text.setAttribute(`x`,t),e.text.textContent=o,e.g.style.opacity=`1`}else e.g.style.opacity=`0`};if(l(L,t.i,a.length,Bd,Vd,`i`),l(R,t.j,o.length,Wd,Gd,`j`),r?E.textContent=`第 ${s-t.col}/${s} 位 · ${(e=>{let t=s-1-e;return[`个位`,`十位`,`百位`,`千位`][t]||`10^${t} 位`})(t.col)}`:t.phase===`init`?E.textContent=`竖式对齐`:E.textContent=`${s} 列处理完`,r){let e=t.zeroA?`0+`:`${t.digitA}+`,n=t.zeroB?`0+`:`${t.digitB}+`;D.textContent=`${e}${n}${t.carryIn}=${t.sum} → 写 ${t.out} 进 ${t.carryOut}`}else t.phase===`init`?D.textContent=`双指针从个位出发`:D.textContent=`进位 0 · 终止`;O.textContent=n?`"${t.result}"`:`"${a}" + "${o}"`,r?z.textContent=`已写 ${t.resLow.length} 位 · i=${t.i} j=${t.j} carry=${t.carryOut}`:t.phase===`init`?z.textContent=`循环条件 i >= 0 || j >= 0 || carry > 0`:z.textContent=`答案 = reverse(resLow).join("") · O(max(m,n)) 时间 O(1) 空间`,Z(B,t.desc)}l.appendChild(B);let H=Q();l.appendChild(H.root),e.textContent=``,e.appendChild(l),X();let U=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,ee=$({steps:n,controls:H,intervalMs:$d,onRender:V});ee.jumpTo(Math.trunc(t.initialStep)||0);let W=null;return r&&!U&&typeof IntersectionObserver==`function`&&(W=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){W.disconnect(),W=null,ee.play();return}},{threshold:.35}),W.observe(l)),{destroy(){W&&=(W.disconnect(),null),ee.destroy(),e.textContent=``,delete e.dataset.addstrMounted,document.getElementById(Fd)?.remove()}}}var rf=`1.02.3`,af=`1.2.10`;function of(e){let t=0;for(;t<e.length-1&&e[t]===`0`;)t+=1;return e.slice(t)}function sf(e,t){return e.length===t.length?e===t?0:e<t?-1:1:e.length<t.length?-1:1}function cf(e={}){let t=typeof e.version1==`string`&&e.version1.length>0?e.version1:rf,n=typeof e.version2==`string`&&e.version2.length>0?e.version2:af,r=t.split(`.`),i=n.split(`.`),a=Math.max(r.length,i.length),o=[],s=(e,t,n={})=>{o.push({phase:e,desc:t,rev1:r,rev2:i,col:-1,raw1:null,raw2:null,val1:``,val2:``,isPad1:!1,isPad2:!1,verdict:``,result:null,done:e===`done`,...n})};s(`init`,`给了两个版本号：\`${t}\` 和 \`${n}\`。按 \`.\` 切成修订号数组：\`[${r.map(e=>`"${e}"`).join(`, `)}]\` 和 \`[${i.map(e=>`"${e}"`).join(`, `)}]\`。比较规则把所有情况归到同一条铁轨：**先把每个修订号归一化（剥前导零，缺失视为 0），再逐列比较，**第一列分出胜负就短路返回。归一化后「比数值」有个漂亮的事实：**先比长度、等长再比字典序** —— 剥完前导零的数字串更长的一定更大，全程不用转数字，天然免疫超长修订号的 \`parseInt\` 精度陷阱。`);for(let e=0;e<a;e+=1){let a=e<r.length,c=e<i.length,l=a?r[e]:null,u=c?i[e]:null,d=of(a?l:`0`),f=of(c?u:`0`),p=sf(d,f),m=p===0?`equal`:p<0?`less`:`greater`,h=[];if(h.push(`**第 \`${e+1}\` 列**：`),h.push(a?`\`${l}\``:"`0`（补零，v1 修订号已用完）"),h.push(` vs `),h.push(c?`\`${u}\``:"`0`（补零，v2 修订号已用完）"),l!==null&&l!==d||u!==null&&u!==f||!a||!c){let e=[];e.push(a?`"${l}" → "${d}"`:null),e.push(c?`"${u}" → "${f}"`:null);let t=e.filter(Boolean).join(` 与 `);h.push(` —— 剥前导零归一化：${t}。`)}else h.push(` —— 本列无需剥零。`);if(d.length!==f.length&&h.push(`比长度：\`${d.length}\` vs \`${f.length}\` —— **长的一定大**（剥完前导零没有前导零）。`),m===`equal`?h.push(`**等长且逐字符相同 → 数值相等**，进下一列。`):m===`less`?h.push(`**\`${d}\` < \`${f}\`，第一列分出胜负，短路返回 \`-1\`。**`+(d.length===f.length?`注意不是字符比较：字符序里 \`${d[0]}\` 可能大于 \`${f[0]}\`，等长时字符序才恰好等于数值序。`:`字符比较会在这里翻车：字符序看首字符，数值看位数。`)):h.push(`**\`${d}\` > \`${f}\`，第一列分出胜负，短路返回 \`1\`。**`+(d.length===f.length?`等长逐字符比较，字符序 = 数值序。`:`比长度就分出了：位数多的大。`)),s(`compare`,h.join(``),{col:e,raw1:l,raw2:u,val1:d,val2:f,isPad1:!a,isPad2:!c,verdict:m}),m!==`equal`){let r=m===`less`?-1:1;return s(`done`,`第 \`${e+1}\` 列分出胜负，后面的列不用看（短路）。**返回 \`${r}\`**：\`${t}\` ${r<0?`<`:`>`} \`${n}\`。`,{col:e,result:r,verdict:m}),o}}return s(`done`,`所有列都相等（包括补零列）。**返回 \`0\`**：\`${t}\` 与 \`${n}\` 版本号相等 —— \`"1.01"\` 与 \`"1.001"\`、\`"1.0"\` 与 \`"1.0.0"\` 都在这条路上归为相等。`,{col:a-1,result:0,verdict:`equal`}),o}var lf=`cmpver-styles`,uf=54,df=84,ff=46,pf=156,mf=176,hf=46,gf=238,_f=314,vf=26,yf=1350,bf=`
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
`;function xf(){if(document.getElementById(lf))return;let e=document.createElement(`style`);e.id=lf,e.textContent=bf,document.head.appendChild(e)}function Sf(e,t={}){if(!e||e.dataset.cmpverMounted===`1`)return{destroy(){}};e.dataset.cmpverMounted=`1`,xf();let n=cf(t),r=t.autoplay!==!1,i=n[0],a=i.rev1,o=i.rev2,s=Math.max(a.length,o.length),c=Y,l=document.createElement(`div`);l.className=`viz cmpver`;let u=document.createElement(`div`);u.className=`viz__stage`,l.appendChild(u);function d(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let f=Math.max(...a.map(e=>e.length),...o.map(e=>e.length),2),p=Math.min(76,Math.max(46,f*13+20)),m=s*p+(s-1)*8,h=Math.max(660,vf*2+m),g=(h-m)/2,_=e=>g+e*(p+8)+p/2,v=h-vf*2,y=c(`svg`,{class:`viz__svg cmpver__svg`,viewBox:`0 0 ${h} 338`,role:`img`,"aria-label":`比较版本号 逐列比较推演动画`});u.appendChild(y);let b=c(`g`,{class:`cmpver-cells`}),x=c(`g`,{class:`cmpver-marks`});y.appendChild(b),y.appendChild(x);let S=c(`text`,{class:`cmpver-note`,x:vf,y:uf});S.textContent=`归一化后逐列比较：剥前导零 + 缺失补 0，先比长度再比字典序`,x.appendChild(S),x.appendChild(c(`rect`,{class:`cmpver-banner__box`,x:vf,y:df,width:v,height:ff,rx:9}));let C=c(`text`,{class:`cmpver-banner__seg`,x:44,y:107}),w=c(`text`,{class:`cmpver-banner__seg`,x:176,y:107}),T=c(`text`,{class:`cmpver-banner__ans`,x:h-vf-18,y:107});x.appendChild(C),x.appendChild(w),x.appendChild(T);let E=(e,t)=>{let n=c(`text`,{x:g-14,y:e,style:`fill: var(--cmpver-muted, #657168); font-size: 12px; text-anchor: end; dominant-baseline: central; font-family: Consolas, monospace;`});n.textContent=t,x.appendChild(n)};function D(e,t,n){let r=[];for(let t=0;t<s;t+=1){let n=c(`g`,{class:`cmpver-cell`}),i=c(`rect`,{class:`cmpver-cell__box`,x:_(t)-p/2,y:e,width:p,height:hf,rx:6});n.appendChild(i);let a=c(`text`,{class:`cmpver-cell__val`,x:_(t),y:e+hf/2});n.appendChild(a),b.appendChild(n),r.push({g:n,box:i,val:a,c:t})}for(let e=0;e<s;e+=1){let t=c(`text`,{class:`cmpver-cell__idx`,x:_(e),y:pf});t.textContent=String(e),x.appendChild(t)}return r}let O=D(mf,a,a.length),k=D(gf,o,o.length);E(199,`v1`),E(261,`v2`);let A=c(`text`,{class:`cmpver-phase__text`,x:h/2,y:_f});x.appendChild(A);let j=d();function M(e,t){if(!t)return;let n=t.phase===`done`,r=t.phase===`compare`,i=(e,i,a,o)=>{e.forEach(e=>{let s=e.c,c=s<a,l=[`cmpver-cell`];e.val.classList.remove(`is-zero`),e.box.classList.remove(`is-dashed`),c?(e.val.textContent=i[s],r&&s===t.col&&l.push(t.verdict===`equal`?`is-active`:`is-hot`),n&&s===t.col&&l.push(`is-done`)):(e.box.classList.add(`is-dashed`),r&&s===t.col&&o?(e.val.textContent=`0`,e.val.classList.add(`is-zero`),l.push(t.verdict===`equal`?`is-active`:`is-hot`)):e.val.textContent=``),e.g.setAttribute(`class`,l.join(` `))})};if(i(O,a,a.length,t.isPad1),i(k,o,o.length,t.isPad2),r){C.textContent=`第 ${t.col+1}/${s} 列`;let e=t.isPad1?`0(补)`:`"${t.raw1}" → ${t.val1}`,n=t.isPad2?`0(补)`:`"${t.raw2}" → ${t.val2}`,r=t.verdict===`equal`?`=`:t.verdict===`less`?`<`:`>`;w.textContent=`${e}  ${r}  ${n}`}else t.phase===`init`?(C.textContent=`按 . 切开`,w.textContent=`逐列归一化比较`):(C.textContent=`${s} 列比较完`,w.textContent=t.result===0?`全部相等`:`第 ${t.col+1} 列分出胜负`);T.textContent=n?`return ${t.result}`:`"${a.join(`.`)}" vs "${o.join(`.`)}"`,r?A.textContent=t.verdict===`equal`?`第 ${t.col+1} 列相等，进下一列（短路：一旦分出胜负立即返回）`:`第 ${t.col+1} 列分出胜负 → return ${t.verdict===`less`?-1:1}`:t.phase===`init`?A.textContent=`剥前导零（"0002" → "2"，全零 → "0"）· 缺失修订号视为 0`:A.textContent=`归一化比较：先比长度（长的一定大），等长再比字典序`,Z(j,t.desc)}l.appendChild(j);let N=Q();l.appendChild(N.root),e.textContent=``,e.appendChild(l),X();let P=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,F=$({steps:n,controls:N,intervalMs:yf,onRender:M});F.jumpTo(Math.trunc(t.initialStep)||0);let I=null;return r&&!P&&typeof IntersectionObserver==`function`&&(I=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){I.disconnect(),I=null,F.play();return}},{threshold:.35}),I.observe(l)),{destroy(){I&&=(I.disconnect(),null),F.destroy(),e.textContent=``,delete e.dataset.cmpverMounted,document.getElementById(lf)?.remove()}}}var Cf=`babad`;function wf(e={}){let t=typeof e.s==`string`&&e.s.length>0?e.s:Cf,n=Array.from(t),r=n.length,i=n,a=[],o=(e,t,i={})=>{a.push({phase:e,desc:t,chars:n,n:r,centerIdx:-1,centerType:null,ci:null,l:null,r:null,len:0,pal:null,bestL:null,bestR:null,bestLen:0,bestUpdated:!1,done:e===`done`,...i})};o(`init`,`给了字符串 \`${t}\`（\`${r}\` 个字符）。求最长回文子串。枚举所有子串要 \`O(n^2)\` 个、每个验回文又要 \`O(n)\` —— \`O(n^3)\` 起步。换个角度：**回文是关于中心对称的，枚举中心就够了** —— 中心只有 **\`2n-1 = ${2*r-1}\` 个**：\`${r}\` 个字符中心（管奇数回文，如 \`"bab"\`）+ \`${r-1}\` 个间隙中心（管偶数回文，如 \`"abba"\`）。每个中心向两边扩展到不能再扩，总时间 \`O(n^2)\`，**空间 O(1)**。下面按「字符 0 · 间隙 0 · 字符 1 · 间隙 1 · …」交错的顺序扫过所有中心。`);let s=null,c=null,l=0,u=0,d=(e,t)=>{let a=null,d=null;if(e===`char`)for(a=t,d=t;a>0&&d<r-1&&i[a-1]===i[d+1];)--a,d+=1;else if(i[t]===i[t+1])for(a=t,d=t+1;a>0&&d<r-1&&i[a-1]===i[d+1];)--a,d+=1;let f=a===null?0:d-a+1,p=a===null?null:n.slice(a,d+1).join(``),m=f>l;m&&(s=a,c=d,l=f);let h=e===`char`?`\`s[${t}]\``:`\`s[${t}]|s[${t+1}]\` 之间`,g=[];g.push(`**中心 \`${u+1}/${2*r-1}\`（${e===`char`?`字符中心`:`间隙中心`} ${h}）**：`),a===null?g.push(e===`gap`?`两侧字符 \`${i[t]}\` ≠ \`${i[t+1]}\`，连最小的偶数回文都构不成 —— 长度 0，跳过。`:`扩展结果就是它自己，长度 1。`):g.push(`向两边扩展到 \`[${a}, ${d}]\`，回文 **"${p}"**，长度 \`${f}\``+(m?` —— **超过当前最优（原 \`${l}\`），更新最优**。`:`，不超过当前最优（\`${l}\`），最优保持。`)),o(`center`,g.join(``),{centerIdx:u,centerType:e,ci:t,l:a,r:d,len:f,pal:p,bestL:s,bestR:c,bestLen:l,bestUpdated:m}),u+=1};for(let e=0;e<r;e+=1)d(`char`,e),e<r-1&&d(`gap`,e);return o(`done`,`\`${2*r-1}\` 个中心全部扫完，最优回文 **"${n.slice(s,c+1).join(``)}"**（\`[${s}, ${c}]\`，长度 \`${l}\`）。回头看：每个中心只向两边扫一次，总时间 \`O(n^2)\`、**空间 O(1)** —— 比 DP 的 \`O(n^2)\` 空间省一个量级。两个提醒：间隙中心（偶数回文）是最容易漏的，\`"abba"\`、\`"cbbd"\` 全靠它们；同长度时先到先得（\`"babad"\` 的 \`"bab"\` 先于 \`"aba"\` 出现）。`,{centerIdx:2*r-1,bestL:s,bestR:c,bestLen:l,done:!0}),a}var Tf=`longpal-styles`,Ef=54,Df=84,Of=46,kf=176,Af=50,jf=262,Mf=284,Nf=318,Pf=26,Ff=604,If=1250,Lf=`
.longpal {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.longpal__svg { width: 100%; height: auto; display: block; }

.longpal-note {
  fill: var(--longpal-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.longpal-banner__box {
  fill: var(--longpal-banner, #f4f3ef);
  stroke: var(--longpal-line, #c3c9c2);
  stroke-width: 1.5;
}
.longpal-banner__seg {
  fill: var(--longpal-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.longpal-banner__ans {
  fill: var(--longpal-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.longpal-cell__box {
  fill: var(--longpal-fill, #ffffff);
  stroke: var(--longpal-line, #c3c9c2);
  stroke-width: 1.5;
}
.longpal-cell__box.is-dashed {
  fill: none;
  stroke: var(--longpal-dim, #9aa39c);
  stroke-dasharray: 4 4;
  stroke-width: 1.2;
}
.longpal-cell__val {
  fill: var(--longpal-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.longpal-cell__idx {
  fill: var(--longpal-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 通道一（底色）：当前中心扩展出的回文区间 */
.longpal-cell.is-span .longpal-cell__box { fill: var(--longpal-gold-fill, #fdf3e3); }
/* 通道二（边框）：当前中心（字符中心格）/ 最优区间（done） */
.longpal-cell.is-center .longpal-cell__box {
  stroke: var(--longpal-hot, #a45f45);
  stroke-width: 3;
}
.longpal-cell.is-best-done .longpal-cell__box {
  fill: var(--longpal-ok-fill, #eef5f1);
  stroke: var(--longpal-ok, #3f6b57);
  stroke-width: 2.5;
}

.longpal-gapline {
  stroke: var(--longpal-hot, #a45f45);
  stroke-width: 2.5;
  stroke-dasharray: 5 4;
}

.longpal-bestline {
  stroke: var(--longpal-gold, #c2872f);
  stroke-width: 3.5;
  stroke-linecap: round;
}
.longpal-besttext {
  fill: var(--longpal-gold, #c2872f);
  font-size: 13.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.longpal-phase__text {
  fill: var(--longpal-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function Rf(){if(document.getElementById(Tf))return;let e=document.createElement(`style`);e.id=Tf,e.textContent=Lf,document.head.appendChild(e)}function zf(e,t={}){if(!e||e.dataset.longpalMounted===`1`)return{destroy(){}};e.dataset.longpalMounted=`1`,Rf();let n=wf(t),r=t.autoplay!==!1,i=n[0],a=i.chars,o=i.n,s=Y,c=document.createElement(`div`);c.className=`viz longpal`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let d=52;o*d+(o-1)*8>Ff&&(d=Math.max(24,Math.floor((Ff-(o-1)*8)/o)));let f=o*d+(o-1)*8,p=Math.max(660,Pf*2+f),m=(p-f)/2,h=e=>m+e*(d+8)+d/2,g=e=>m+(e+1)*(d+8)-8/2,_=p-Pf*2,v=s(`svg`,{class:`viz__svg longpal__svg`,viewBox:`0 0 ${p} 342`,role:`img`,"aria-label":`最长回文子串 中心扩展推演动画`});l.appendChild(v);let y=s(`g`,{class:`longpal-cells`}),b=s(`g`,{class:`longpal-marks`});v.appendChild(y),v.appendChild(b);let x=s(`text`,{class:`longpal-note`,x:Pf,y:Ef});x.textContent=`中心扩展：枚举 2n-1 个中心（字符 + 间隙），向两边扩展到不能再扩`,b.appendChild(x),b.appendChild(s(`rect`,{class:`longpal-banner__box`,x:Pf,y:Df,width:_,height:Of,rx:9}));let S=s(`text`,{class:`longpal-banner__seg`,x:44,y:107}),C=s(`text`,{class:`longpal-banner__seg`,x:216,y:107}),w=s(`text`,{class:`longpal-banner__ans`,x:p-Pf-18,y:107});b.appendChild(S),b.appendChild(C),b.appendChild(w);let T=[];for(let e=0;e<o;e+=1){let t=s(`g`,{class:`longpal-cell`}),n=s(`rect`,{class:`longpal-cell__box`,x:h(e)-d/2,y:kf,width:d,height:Af,rx:6});t.appendChild(n);let r=s(`text`,{class:`longpal-cell__val`,x:h(e),y:201});r.textContent=a[e],t.appendChild(r);let i=s(`text`,{class:`longpal-cell__idx`,x:h(e),y:kf-8});i.textContent=String(e),b.appendChild(i),y.appendChild(t),T.push({g:t,box:n,val:r})}let E=[];for(let e=0;e<o-1;e+=1){let t=s(`line`,{class:`longpal-gapline`,x1:g(e),y1:kf-8,x2:g(e),y2:234});t.style.opacity=`0`,b.appendChild(t),E.push(t)}let D=s(`line`,{class:`longpal-bestline`,x1:0,y1:jf,x2:0,y2:jf}),O=s(`text`,{class:`longpal-besttext`,x:p/2,y:Mf});D.style.opacity=`0`,O.style.opacity=`0`,b.appendChild(D),b.appendChild(O);let k=s(`text`,{class:`longpal-phase__text`,x:p/2,y:Nf});b.appendChild(k);let A=u();function j(e,t){if(!t)return;let n=t.phase===`done`,r=t.phase===`center`;if(E.forEach((e,n)=>{let i=r&&t.centerType===`gap`&&t.ci===n;e.style.opacity=i?`1`:`0`}),T.forEach((e,i)=>{let a=[`longpal-cell`];e.box.classList.remove(`is-dashed`),r&&(t.l!==null&&i>=t.l&&i<=t.r&&a.push(`is-span`),t.centerType===`char`&&i===t.ci&&a.push(`is-center`)),n&&t.bestL!==null&&i>=t.bestL&&i<=t.bestR&&a.push(`is-best-done`),e.g.setAttribute(`class`,a.join(` `))}),t.bestL!==null){let e=m+t.bestL*(d+8),n=m+t.bestR*(d+8)+d;D.setAttribute(`x1`,e),D.setAttribute(`x2`,n),D.style.opacity=`1`,O.textContent=`best: "${t.chars.slice(t.bestL,t.bestR+1).join(``)}" (len ${t.bestLen})`,O.setAttribute(`x`,(e+n)/2),O.style.opacity=`1`}else D.style.opacity=`0`,O.style.opacity=`0`;r?(S.textContent=`中心 ${t.centerIdx+1}/${2*o-1}`,t.l===null?C.textContent=`s[${t.ci}] ≠ s[${t.ci+1}] → 长度 0`:C.textContent=`expand(${t.centerType===`char`?t.ci:`${t.ci},${t.ci+1}`}) → [${t.l}, ${t.r}] "${t.pal}"${t.bestUpdated?` ← 更新`:``}`):t.phase===`init`?(S.textContent=`中心扩展`,C.textContent=`${2*o-1} 个中心交错枚举`):(S.textContent=`${2*o-1} 个中心扫完`,C.textContent=`最优 [${t.bestL}, ${t.bestR}]`),w.textContent=n?`"${t.chars.slice(t.bestL,t.bestR+1).join(``)}"`:`"${a.join(``)}"`,r?k.textContent=t.len>0?`该中心最长回文 len=${t.len} · best=${t.bestLen}`:`偶数回文靠间隙中心 —— 漏了它们就漏了 "abba"`:t.phase===`init`?k.textContent=`字符中心管奇数回文（"bab"）· 间隙中心管偶数回文（"abba"）`:k.textContent=`O(n^2) 时间 · O(1) 空间 —— DP 是 O(n^2) 空间，Manacher 是 O(n) 但难写`,Z(A,t.desc)}c.appendChild(A);let M=Q();c.appendChild(M.root),e.textContent=``,e.appendChild(c),X();let N=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,P=$({steps:n,controls:M,intervalMs:If,onRender:j});P.jumpTo(Math.trunc(t.initialStep)||0);let F=null;return r&&!N&&typeof IntersectionObserver==`function`&&(F=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){F.disconnect(),F=null,P.play();return}},{threshold:.35}),F.observe(c)),{destroy(){F&&=(F.disconnect(),null),P.destroy(),e.textContent=``,delete e.dataset.longpalMounted,document.getElementById(Tf)?.remove()}}}var Bf=`25525511135`;function Vf(e={}){let t=typeof e.s==`string`&&e.s.length>0?e.s:Bf,n=Array.from(t),r=n.length,i=[],a=(e,a,o={})=>{i.push({phase:e,desc:a,s:t,chars:n,n:r,path:[],pos:0,segLen:null,trySeg:null,verdict:null,ans:[],done:e===`done`,...o})};a(`init`,`给了只含数字的串 \`${t}\`（\`${r}\` 位）。复原 IP = 切成 4 段、中间插 3 个点：每段 1-3 位、数值 0-255、无前导零（\`"0"\` 合法、\`"01"\` 非法）。等价于在 \`${r-1}\` 个缝隙里选 3 个切点 —— 搜索空间天生有界（\`C(${r-1}, 3)\`）。回溯每层切一段：尝试切 1 / 2 / 3 位，**剪枝分两层** —— 段合法性（前导零、\`>255\`）与可行性（剩余位数 \`[segs, segs × 3]\` 才走得通）。`);let o=[],s=(e,n,i)=>{let a=4-i.length;if(e+n>r)return{verdict:`length`,seg:null,detail:`末尾不够切 ${n} 位`};let o=t.slice(e,e+n);if(o.length>1&&o[0]===`0`)return{verdict:`lead-zero`,seg:o,detail:`"${o}" 有前导零（"0" 合法，"0…" 非法）`};if(Number(o)>255)return{verdict:`range`,seg:o,detail:`${o} > 255`};let s=r-e-n,c=a-1;return c>0?s<c||s>c*3?{verdict:`length`,seg:o,detail:s<c?`剩余 ${s} 位 < 剩余 ${c} 段最少需要的 ${c} 位`:`剩余 ${s} 位 > 剩余 ${c} 段最多能装 ${c*3} 位`}:{verdict:`ok`,seg:o,detail:`段合法且剩余 ${s} 位可装进 ${c} 段，深入`}:s===0?{verdict:`answer`,seg:o,detail:`第 4 段恰好用完全部剩余位 —— 收下一个答案`}:{verdict:`length`,seg:o,detail:`第 4 段切完还剩 ${s} 位没进任何段 —— 4 段必须恰好用完全部 ${r} 位`}},c=(e,t)=>{if(t.length!==4)for(let n of[1,2,3]){let{verdict:i,seg:l,detail:u}=s(e,n,t);if(i===`answer`){let e=[...t,l];o.push(e.join(`.`))}4-t.length;let d=[];d.push(`**切第 \`${t.length+1}\` 段（试 ${n} 位）：**`),d.push(l===null?`末尾只剩 \`${r-e}\` 位，不够切。`:`试切 \`"${l}"\``),i===`ok`?d.push(` —— ${u}。`):i===`answer`?d.push(` —— ${u}：**"${[...t,l].join(`.`)}"**。`):i===`length`?d.push(` —— 剪：${u}（可行性 —— 整棵子树都不可行，这条分支到此为止）。`):(i===`lead-zero`||i===`range`)&&d.push(` —— 剪：${u}。`),i===`ok`&&d.push(`回溯后继续试 ${n<3?`切 ${n+1} 位`:`下一条分支`}。`),a(`try`,d.join(``),{path:t.slice(),pos:e,segLen:n,trySeg:l,verdict:i,ans:o.slice()}),i===`ok`?c(e+n,[...t,l]):i===`answer`&&a(`answer`,`第 \`${o.length}\` 个答案：**"${o[o.length-1]}"**。回溯继续找。`,{path:[...t,l],pos:e+n,segLen:n,trySeg:l,verdict:`answer`,ans:o.slice()})}};return r>=4&&r<=12?c(0,[]):a(`try`,`长度 \`${r}\` 不在 \`[4, 12]\` 内（4 段至少 4 位、至多 12 位）—— 直接无解，连搜都不用搜。`,{pos:0,segLen:null,trySeg:null,verdict:`length`}),a(`done`,o.length>0?`搜索结束，共 **${o.length} 个答案**：${o.map(e=>`"${e}"`).join(`、`)}。整棵树最多 3^4 = 81 条路径、只有 4 层 —— 回溯在这里是常数级的；可行性剪枝把 "段合法但走不通" 的分支（如第一段切 \`"2"\`）在层顶就砍掉。`:`搜索结束，**没有答案**（长度 ${r} 无法切成 4 个合法段）。`,{ans:o.slice(),done:!0}),i}var Hf=`rip-styles`,Uf=54,Wf=84,Gf=46,Kf=176,qf=46,Jf=164,Yf=234,Xf=272,Zf=296,Qf=24,$f=344,ep=26,tp=604,np=1150,rp=`
.rip {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.rip__svg { width: 100%; height: auto; display: block; }

.rip-note {
  fill: var(--rip-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rip-banner__box {
  fill: var(--rip-banner, #f4f3ef);
  stroke: var(--rip-line, #c3c9c2);
  stroke-width: 1.5;
}
.rip-banner__seg {
  fill: var(--rip-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rip-banner__ans {
  fill: var(--rip-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rip-cell__box {
  fill: var(--rip-fill, #ffffff);
  stroke: var(--rip-line, #c3c9c2);
  stroke-width: 1.5;
}
.rip-cell__box.is-dashed {
  fill: none;
  stroke: var(--rip-dim, #9aa39c);
  stroke-dasharray: 4 4;
  stroke-width: 1.2;
}
.rip-cell__val {
  fill: var(--rip-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rip-cell__idx {
  fill: var(--rip-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 通道一（底色）：try 段 ok → 淡金；剪 → 灰 */
.rip-cell.is-try-ok .rip-cell__box { fill: var(--rip-gold-fill, #fdf3e3); }
.rip-cell.is-try-ok .rip-cell__val { fill: var(--rip-hot, #a45f45); }
.rip-cell.is-try-bad .rip-cell__box {
  fill: none;
  stroke: var(--rip-dim, #9aa39c);
  stroke-dasharray: 4 4;
  stroke-width: 1.2;
}
.rip-cell.is-try-bad .rip-cell__val { fill: var(--rip-dim, #9aa39c); }
/* done：全部正常白格 */

.rip-div-fixed {
  stroke: var(--rip-hot, #a45f45);
  stroke-width: 3;
  stroke-linecap: round;
}
.rip-div-try {
  stroke: var(--rip-dim, #9aa39c);
  stroke-width: 2;
  stroke-dasharray: 4 3;
}

.rip-ans__title {
  fill: var(--rip-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rip-ans__row {
  fill: var(--rip-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rip-ans__row.is-fresh { fill: var(--rip-gold, #c2872f); font-weight: 700; }
.rip-ans__empty {
  fill: var(--rip-dim, #9aa39c);
  font-size: 13px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rip-phase__text {
  fill: var(--rip-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function ip(){if(document.getElementById(Hf))return;let e=document.createElement(`style`);e.id=Hf,e.textContent=rp,document.head.appendChild(e)}function ap(e,t={}){if(!e||e.dataset.ripMounted===`1`)return{destroy(){}};e.dataset.ripMounted=`1`,ip();let n=Vf(t),r=t.autoplay!==!1,i=n[0],a=i.chars,o=i.n,s=Y,c=document.createElement(`div`);c.className=`viz rip`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let d=46;o*d+(o-1)*8>tp&&(d=Math.max(22,Math.floor((tp-(o-1)*8)/o)));let f=o*d+(o-1)*8,p=Math.max(660,ep*2+f),m=(p-f)/2,h=e=>m+e*(d+8)+d/2,g=e=>m+(e+1)*(d+8)-8/2,_=p-ep*2,v=Math.max(1,...n.map(e=>e.ans.length)),y=Zf+(v-1)*Qf-(Xf-16)+8,b=s(`svg`,{class:`viz__svg rip__svg`,viewBox:`0 0 ${p} ${Math.max(368,296+y)}`,role:`img`,"aria-label":`复原 IP 地址 分段回溯推演动画`});l.appendChild(b);let x=s(`g`,{class:`rip-cells`}),S=s(`g`,{class:`rip-marks`});b.appendChild(x),b.appendChild(S);let C=s(`text`,{class:`rip-note`,x:ep,y:Uf});C.textContent=`分段回溯：每段切 1-3 位，剪枝两层 —— 段合法性（前导零 / >255）+ 可行性（剩余位数）`,S.appendChild(C),S.appendChild(s(`rect`,{class:`rip-banner__box`,x:ep,y:Wf,width:_,height:Gf,rx:9}));let w=s(`text`,{class:`rip-banner__seg`,x:44,y:107}),T=s(`text`,{class:`rip-banner__seg`,x:201,y:107}),E=s(`text`,{class:`rip-banner__ans`,x:p-ep-18,y:107});S.appendChild(w),S.appendChild(T),S.appendChild(E);let D=[];for(let e=0;e<o;e+=1){let t=s(`g`,{class:`rip-cell`}),n=s(`rect`,{class:`rip-cell__box`,x:h(e)-d/2,y:Kf,width:d,height:qf,rx:6});t.appendChild(n);let r=s(`text`,{class:`rip-cell__val`,x:h(e),y:199});r.textContent=a[e],t.appendChild(r);let i=s(`text`,{class:`rip-cell__idx`,x:h(e),y:Kf-8});i.textContent=String(e),S.appendChild(i),x.appendChild(t),D.push({g:t,box:n,val:r})}let O=[];for(let e=0;e<o-1;e+=1){let t=s(`line`,{class:`rip-div-fixed`,x1:g(e),y1:Jf,x2:g(e),y2:Yf});t.style.opacity=`0`,S.appendChild(t),O.push(t)}let k=s(`text`,{class:`rip-ans__title`,x:ep,y:Xf});k.textContent=`answers`,S.appendChild(k);let A=[];for(let e=0;e<v;e+=1){let t=s(`text`,{class:`rip-ans__row`,x:p/2,y:Zf+e*Qf});t.style.opacity=`0`,S.appendChild(t),A.push(t)}let j=s(`text`,{class:`rip-ans__empty`,x:p/2,y:Zf});j.textContent=`（还没有答案 —— 切满 4 段且恰好用完全部数字才会收下）`,S.appendChild(j);let M=s(`text`,{class:`rip-phase__text`,x:p/2,y:$f});S.appendChild(M);let N=u();function P(e,t){if(!t)return;let n=t.phase===`done`,r=t.phase===`try`,i=t.phase===`answer`;O.forEach((e,n)=>{let a=n+1;t.path.slice(0,-0).length;let o=0,s=!1;for(let e of t.path)if(o+=e.length,o===a){s=!0;break}let c=(r||i)&&t.trySeg!==null&&t.pos===a,l=(r||i)&&t.trySeg!==null&&t.pos+t.trySeg.length===a;s?(e.setAttribute(`class`,`rip-div-fixed`),e.style.opacity=`1`):c||l?(e.setAttribute(`class`,`rip-div-try`),e.style.opacity=`1`):e.style.opacity=`0`});let a=t.pos,o=t.trySeg===null?-1:t.pos+t.trySeg.length-1;D.forEach((e,n)=>{let i=[`rip-cell`];e.box.classList.remove(`is-dashed`),r&&n>=a&&n<=o&&i.push(t.verdict===`ok`||t.verdict===`answer`?`is-try-ok`:`is-try-bad`),e.g.setAttribute(`class`,i.join(` `))});let s=t.ans;s.length===0?j.style.opacity=`1`:j.style.opacity=`0`,A.forEach((e,t)=>{t<s.length?(e.textContent=`"${s[t]}"`,e.setAttribute(`class`,`rip-ans__row`+(i&&t===s.length-1?` is-fresh`:``)),e.style.opacity=`1`):e.style.opacity=`0`});let c=t.path.length+1;if(r||i){w.textContent=`切第 ${i?4:c} 段`;let e=t.verdict,n=e===`ok`?`合法，深入`:e===`answer`?`收下答案`:e===`lead-zero`?`前导零`:e===`range`?`超出 255`:`长度不可行`;T.textContent=t.trySeg===null?`末尾只剩 ${t.n-t.pos} 位，不够切 ${t.segLen} 位`:`try "${t.trySeg}" → ${n}`}else t.phase===`init`?(w.textContent=`分段回溯`,T.textContent=`在缝隙里选 3 个切点（每段 1-3 位）`):(w.textContent=`搜索结束`,T.textContent=`${t.ans.length} 个答案`);if(E.textContent=n?`${t.ans.length} 个`:`${t.ans.length} 个答案`,r||i){let e=t.path.length>0?t.path.join(`.`):`(空)`,n=r&&t.trySeg!==null?` + 尝试 "${t.trySeg}"`:``;M.textContent=`path: ${e}${n} · pos=${t.pos} · 剩余 ${t.n-t.pos} 位`}else t.phase===`init`?M.textContent=`长度不在 [4, 12] 直接无解；每层最多 3 个分支、只有 4 层`:M.textContent=`可行性剪枝：剩余 segs 段时，剩余位数必须落在 [segs, segs × 3]`;Z(N,t.desc)}c.appendChild(N);let F=Q();c.appendChild(F.root),e.textContent=``,e.appendChild(c),X();let I=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,L=$({steps:n,controls:F,intervalMs:np,onRender:P});L.jumpTo(Math.trunc(t.initialStep)||0);let R=null;return r&&!I&&typeof IntersectionObserver==`function`&&(R=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){R.disconnect(),R=null,L.play();return}},{threshold:.35}),R.observe(c)),{destroy(){R&&=(R.disconnect(),null),L.destroy(),e.textContent=``,delete e.dataset.ripMounted,document.getElementById(Hf)?.remove()}}}var op=`{[()]}`,sp={"(":`)`,"[":`]`,"{":`}`},cp=new Set(Object.keys(sp));function lp(e={}){let t=typeof e.s==`string`?e.s:op,n=Array.from(t),r=n.length,i=[],a=(e,a,o={})=>{i.push({phase:e,desc:a,s:t,chars:n,n:r,i:null,ch:null,stack:[],expect:null,popped:null,verdict:null,done:e===`done`,...o})};a(`init`,`给了括号串 \`${t}\`（\`${r}\` 个字符）。判断左括号是否被**正确类型**的右括号闭合、且嵌套不乱。括号的结构决定了**最近打开的必须先关闭** —— 后开先闭就是 LIFO，所以栈不是"想到用栈"，而是"括号天然就是栈"。做法：遇左括号入栈（记下我在等什么），遇右括号就问栈顶"你是不是我等的那个"。失败有三种：类型不匹配（\`"(]"\`）、右括号没人接（\`"())"\`，栈已空）、左括号没闭合（\`"(()"\`，栈有剩）。`);let o=[];for(let e=0;e<r;e+=1){let t=n[e];if(cp.has(t)){o.push(t),a(`push`,`\`s[${e}] = "${t}"\` 是左括号 —— **入栈**，记下"我在等 \`"${sp[t]}"\`"。栈顶现在是 \`${t}\`，它是**最内层尚未闭合**的那个 —— 下一个右括号必须先跟它配。`,{i:e,ch:t,stack:o.slice(),expect:null});continue}if(o.length===0)return a(`unmatched`,`\`s[${e}] = "${t}"\` 是右括号，但**栈是空的** —— 前面没有左括号在等它。（失败模式二：右括号没人接，如 \`"())"\` 的最后一个 \`)\`。）即刻判无效，不用再看后面的字符。`,{i:e,ch:t,stack:o.slice(),expect:null,verdict:`unmatched`}),a(`done`,`**无效**：\`s[${e}] = "${t}"\` 找不到匹配的左括号。三种失败模式里的第二种 —— 右括号来时栈已空。`,{i:e,ch:t,stack:o.slice(),verdict:`unmatched`,done:!0}),i;let r=o[o.length-1],s=sp[r];if(s===t)o.pop(),a(`match`,`\`s[${e}] = "${t}"\` 是右括号 —— 栈顶 \`"${r}"\` 等的就是 \`"${s}"\`，**配对成功，出栈**。`+(o.length>0?`新的栈顶是 \`"${o[o.length-1]}"\` —— 它成为"最内层尚未闭合"的那个。`:`栈空了 —— 目前为止全部闭合。`),{i:e,ch:t,stack:o.slice(),expect:s,popped:r});else return a(`mismatch`,`\`s[${e}] = "${t}"\` 是右括号，它要的是 \`"${t}"\`，但栈顶 \`"${r}"\` 等的是 \`"${s}"\` —— **类型不匹配**（失败模式一，如 \`"([)]"\` 里 \`)\` 撞上 \`[\`）。即刻判无效。`,{i:e,ch:t,stack:o.slice(),expect:s,popped:null,verdict:`mismatch`}),a(`done`,`**无效**：\`s[${e}] = "${t}"\` 与栈顶 \`"${r}"\` 类型不匹配（栈顶在等 \`"${s}"\`）。`,{i:e,ch:t,stack:o.slice(),expect:s,verdict:`mismatch`,done:!0}),i}return o.length>0?(a(`done`,`\`${r}\` 个字符扫完了，但**栈里还留着** \`${o.map(e=>`"${e}"`).join(`、`)}\` —— 失败模式三：左括号没闭合（如 \`"(()"\` 剩下的那个 \`(\`）。栈非空即无效 —— 这是最容易漏的一处检查。`,{i:r-1,stack:o.slice(),verdict:`leftover`,done:!0}),i):(a(`done`,`\`${r}\` 个字符扫完，**栈也恰好空了** —— 每个左括号都被正确类型的右括号按后进先出的顺序闭合。**有效**。`,{i:r-1,stack:o.slice(),verdict:`valid`,done:!0}),i)}var up=`brk-styles`,dp=54,fp=84,pp=46,mp=158,hp=170,gp=46,_p=256,vp=316,yp=256,bp=342,xp=26,Sp=604,Cp=1150,wp=`
.brk {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.brk__svg { width: 100%; height: auto; display: block; }

.brk-note {
  fill: var(--brk-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.brk-banner__box {
  fill: var(--brk-banner, #f4f3ef);
  stroke: var(--brk-line, #c3c9c2);
  stroke-width: 1.5;
}
.brk-banner__seg {
  fill: var(--brk-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.brk-banner__ans {
  fill: var(--brk-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.brk-banner__ans.is-bad { fill: var(--brk-bad, #b3452e); }

.brk-cell__box {
  fill: var(--brk-fill, #ffffff);
  stroke: var(--brk-line, #c3c9c2);
  stroke-width: 1.5;
}
.brk-cell__val {
  fill: var(--brk-ink, #1f2a24);
  font-size: 18px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.brk-cell__idx {
  fill: var(--brk-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 通道一（底色）：栈内 */
.brk-cell.is-instack .brk-cell__box { fill: var(--brk-gold-fill, #fdf3e3); }
/* 通道二（边框）：当前字符 / 成功 / 失败 */
.brk-cell.is-cur .brk-cell__box {
  stroke: var(--brk-hot, #a45f45);
  stroke-width: 3;
}
.brk-cell.is-cur .brk-cell__val { fill: var(--brk-hot, #a45f45); }
.brk-cell.is-ok .brk-cell__box {
  fill: var(--brk-ok-fill, #eef5f1);
  stroke: var(--brk-ok, #3f6b57);
  stroke-width: 2.5;
}
.brk-cell.is-ok .brk-cell__val { fill: var(--brk-ok, #3f6b57); }
.brk-cell.is-bad .brk-cell__box {
  fill: var(--brk-bad-fill, #fbe9e5);
  stroke: var(--brk-bad, #b3452e);
  stroke-width: 2.5;
}
.brk-cell.is-bad .brk-cell__val { fill: var(--brk-bad, #b3452e); }
.brk-cell.is-dim .brk-cell__box {
  stroke: var(--brk-dim, #9aa39c);
  stroke-dasharray: 4 4;
  stroke-width: 1.2;
}
.brk-cell.is-dim .brk-cell__val { fill: var(--brk-dim, #9aa39c); }

.brk-label {
  fill: var(--brk-muted, #657168);
  font-size: 12px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.brk-topmark {
  fill: var(--brk-hot, #a45f45);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.brk-popmark {
  fill: var(--brk-ok, #3f6b57);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.brk-phase__text {
  fill: var(--brk-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function Tp(){if(document.getElementById(up))return;let e=document.createElement(`style`);e.id=up,e.textContent=wp,document.head.appendChild(e)}function Ep(e,t={}){if(!e||e.dataset.brkMounted===`1`)return{destroy(){}};e.dataset.brkMounted=`1`,Tp();let n=lp(t),r=t.autoplay!==!1,i=n[0],a=i.chars,o=i.n,s=Y,c=document.createElement(`div`);c.className=`viz brk`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let d=48;o*d+(o-1)*8>Sp&&(d=Math.max(24,Math.floor((Sp-(o-1)*8)/o)));let f=o*d+(o-1)*8,p=(o+1)*d+o*8,m=Math.max(660,xp*2+Math.max(f,p)),h=(m-f)/2,g=(m-p)/2+d/2,_=e=>h+e*(d+8)+d/2,v=e=>g+e*(d+8),y=m-xp*2,b=s(`svg`,{class:`viz__svg brk__svg`,viewBox:`0 0 ${m} 366`,role:`img`,"aria-label":`有效的括号 栈推演动画`});l.appendChild(b);let x=s(`g`,{class:`brk-cells`}),S=s(`g`,{class:`brk-marks`});b.appendChild(x),b.appendChild(S);let C=s(`text`,{class:`brk-note`,x:xp,y:dp});C.textContent=`括号天然是栈：最近打开的必须先关闭 —— 左括号入栈，右括号问栈顶`,S.appendChild(C),S.appendChild(s(`rect`,{class:`brk-banner__box`,x:xp,y:fp,width:y,height:pp,rx:9}));let w=s(`text`,{class:`brk-banner__seg`,x:44,y:107}),T=s(`text`,{class:`brk-banner__seg`,x:156,y:107}),E=s(`text`,{class:`brk-banner__ans`,x:m-xp-18,y:107});S.appendChild(w),S.appendChild(T),S.appendChild(E);let D=[];for(let e=0;e<o;e+=1){let t=s(`g`,{class:`brk-cell`}),n=s(`rect`,{class:`brk-cell__box`,x:_(e)-d/2,y:hp,width:d,height:gp,rx:6});t.appendChild(n);let r=s(`text`,{class:`brk-cell__val`,x:_(e),y:193});r.textContent=a[e],t.appendChild(r);let i=s(`text`,{class:`brk-cell__idx`,x:_(e),y:mp});i.textContent=String(e),S.appendChild(i),x.appendChild(t),D.push({g:t,box:n,val:r})}let O=s(`text`,{class:`brk-label`,x:g-14,y:279});O.textContent=`stack`,S.appendChild(O);let k=[];for(let e=0;e<o;e+=1){let t=s(`g`,{class:`brk-cell`}),n=s(`rect`,{class:`brk-cell__box`,x:v(e)-d/2,y:_p,width:d,height:gp,rx:6});t.appendChild(n);let r=s(`text`,{class:`brk-cell__val`,x:v(e),y:279});t.appendChild(r),x.appendChild(t),k.push({g:t,box:n,val:r})}let A=(()=>{let e=s(`g`,{class:`brk-cell`}),t=s(`rect`,{class:`brk-cell__box`,x:v(o)-d/2,y:yp,width:d,height:gp,rx:6});e.appendChild(t);let n=s(`text`,{class:`brk-cell__val`,x:v(o),y:279});return e.appendChild(n),x.appendChild(e),{g:e,box:t,val:n}})(),j=s(`text`,{class:`brk-popmark`,x:v(o),y:yp-12});j.textContent=`popped`,S.appendChild(j);let M=s(`text`,{class:`brk-topmark`,x:0,y:vp});M.textContent=`top`,S.appendChild(M);let N=s(`text`,{class:`brk-phase__text`,x:m/2,y:bp});S.appendChild(N);let P=u();function F(e,t){if(!t)return;let n=t.phase===`done`,r=t.verdict;if(D.forEach((e,i)=>{let a=[`brk-cell`];t.i!==null&&i===t.i&&t.phase!==`done`?t.phase===`match`?a.push(`is-ok`):t.phase===`mismatch`||t.phase===`unmatched`?a.push(`is-bad`):a.push(`is-cur`):n&&r===`valid`?a.push(`is-ok`):t.i!==null&&i>t.i&&a.push(`is-dim`),e.g.setAttribute(`class`,a.join(` `))}),k.forEach((e,i)=>{let a=[`brk-cell`];i<t.stack.length?(a.push(`is-instack`),e.val.textContent=t.stack[i],i===t.stack.length-1&&(t.phase===`mismatch`||n&&r===`leftover`?a.push(`is-bad`):n&&r===`valid`&&a.push(`is-ok`))):(a.push(`is-dim`),e.val.textContent=``),e.g.setAttribute(`class`,a.join(` `))}),t.phase===`match`&&t.popped!==null){let e=v(t.stack.length);A.box.setAttribute(`x`,e-d/2),A.val.setAttribute(`x`,e),j.setAttribute(`x`,e),A.val.textContent=t.popped,A.g.setAttribute(`class`,`brk-cell is-ok`),j.style.opacity=`1`}else A.val.textContent=``,A.g.setAttribute(`class`,`brk-cell is-dim`),j.style.opacity=`0`;t.stack.length>0?(M.setAttribute(`x`,v(t.stack.length-1)),M.style.opacity=`1`):M.style.opacity=`0`,t.phase===`push`?(w.textContent=`s[${t.i}] = "${t.ch}"`,T.textContent=`左括号 → push（记下我在等什么）`):t.phase===`match`?(w.textContent=`s[${t.i}] = "${t.ch}"`,T.textContent=`栈顶 "${t.popped}" 配对成功 → pop`):t.phase===`mismatch`?(w.textContent=`s[${t.i}] = "${t.ch}"`,T.textContent=`栈顶 "${t.stack[t.stack.length-1]}" 在等 "${t.expect}" —— 不匹配`):t.phase===`unmatched`?(w.textContent=`s[${t.i}] = "${t.ch}"`,T.textContent=`栈是空的，没人接这个右括号`):t.phase===`init`?(w.textContent=`栈解法`,T.textContent=`左括号入栈 · 右括号问栈顶`):(w.textContent=`${t.n} 个字符扫完`,T.textContent=r===`valid`?`栈恰好为空`:r===`leftover`?`栈里还留着左括号`:`提前判无效`),n?(E.textContent=r===`valid`?`true（有效）`:r===`leftover`?`false（左括号未闭合）`:r===`mismatch`?`false（类型不匹配）`:`false（右括号无人接）`,E.setAttribute(`class`,`brk-banner__ans`+(r===`valid`?``:` is-bad`))):(E.textContent=`stack: ${t.stack.length} 层`,E.setAttribute(`class`,`brk-banner__ans`)),n?N.textContent=t.stack.length>0?`剩余未闭合：${t.stack.map(e=>`"${e}"`).join(` `)} —— 栈非空即无效`:`三种失败模式都没触发 + 栈为空 = 有效`:t.phase===`match`?N.textContent=`配对 "${t.popped}" + "${t.ch}" 出栈 · 栈深 ${t.stack.length}`:t.phase===`push`?N.textContent=`入栈 "${t.ch}" · 栈顶 = 最内层尚未闭合的那个`:N.textContent=`后开先闭 = LIFO —— 括号的结构本身就是栈`,Z(P,t.desc)}c.appendChild(P);let I=Q();c.appendChild(I.root),e.textContent=``,e.appendChild(c),X();let L=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,R=$({steps:n,controls:I,intervalMs:Cp,onRender:F});R.jumpTo(Math.trunc(t.initialStep)||0);let z=null;return r&&!L&&typeof IntersectionObserver==`function`&&(z=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){z.disconnect(),z=null,R.play();return}},{threshold:.35}),z.observe(c)),{destroy(){z&&=(z.disconnect(),null),R.destroy(),e.textContent=``,delete e.dataset.brkMounted,document.getElementById(up)?.remove()}}}var Dp=[1,3,-1,-3,5,3,6,7],Op=3;function kp(e={}){let t=(Array.isArray(e.nums)?e.nums:Dp).slice(),n=t.length,r=Number.isInteger(e.k)&&e.k>0?e.k:Op,i=[],a=(e,a,o={})=>{i.push({phase:e,desc:a,nums:t,n,k:r,i:null,l:null,r:null,expired:[],dropped:[],dq:[],maxVal:null,ans:[],done:e===`done`,...o})};if(n===0||r>n)return a(`done`,n===0?`数组为空 —— 没有窗口，返回空。`:`窗口大小 \`${r}\` 大于数组长度 \`${n}\` —— 无有效窗口，返回空。`,{done:!0}),i;a(`init`,`给了数组 \`[${t.join(`, `)}]\`（\`${n}\` 个）和窗口大小 \`k = ${r}\`，窗口从左往右滑，要每个窗口的最大值，要求**线性时间**。暴力每窗扫一遍是 \`O(n·k)\`；线性做法的关键是**队列里只留"还有机会当最大值"的候选**，且按值递减 —— 队首恒为当前窗口最大。判据：一个元素右边出现**不小于它**的新元素时，它就被**支配**了（新元素更大、还更晚离开窗口），可以**永久淘汰**。于是每来一个元素只维护两件事：**队尾淘汰（单调性，看值）**与**队首淘汰（出窗，看下标）** —— 队列存的是**下标**，下标才能判断还在不在窗里。`);let o=[],s=[];for(let e=0;e<n;e+=1){let n=Math.max(0,e-r+1),i=t[e],c=[];for(;o.length>0&&o[0]<n;)c.push(o.shift());let l=[];for(;o.length>0&&t[o[o.length-1]]<=i;)l.push(o.pop());o.push(e);let u=[];u.push(`**\`i = ${e}\`，值 \`${i}\`，窗口 \`[${n}, ${e}]\`**：`),c.length>0&&u.push(`队首 \`${c.map(e=>`${e}(${t[e]})`).join(`、`)}\` 已滑出窗口左端 \`${n}\` —— **出队（动作一：看下标）**。`),l.length>0&&u.push(`队尾 \`${l.map(e=>`${e}(${t[e]})`).join(`、`)}\` 都 \`<= ${i}\` —— **被 ${i} 支配，永久淘汰（动作二：看值）**：只要 \`${i}\` 还在窗里，它们永远轮不到当最大。`),c.length===0&&l.length===0&&u.push(`没有元素需要淘汰 —— 队列仍然严格递减、且都在窗内。`),u.push(`入队 \`${e}(${i})\`，队列（值）现在是 \`[${o.map(e=>t[e]).join(`, `)}]\`，队首 \`${o[0]}(${t[o[0]]})\` 就是当前最大的候选。`),a(`slide`,u.join(``),{i:e,l:n,r:e,expired:c,dropped:l,dq:o.slice(),maxVal:t[o[0]],ans:s.slice()}),e>=r-1&&(s.push(t[o[0]]),a(`record`,`窗口 \`[${n}, ${e}]\` 已经装满 \`${r}\` 个 —— **队首 \`${o[0]}(${t[o[0]]})\` 就是这一窗的最大值**，记入答案。（队列严格递减且在窗内，所以队首必然是最大 —— 不需要再扫一遍窗口。）目前答案 \`[${s.join(`, `)}]\`。`,{i:e,l:n,r:e,dq:o.slice(),maxVal:t[o[0]],ans:s.slice()}))}return a(`done`,`\`${n}\` 个元素扫完，答案 \`[${s.join(`, `)}]\`（共 \`${s.length}\` 个窗口）。回头看：每个元素**最多入队一次、出队一次** —— 均摊 \`O(1)\`，总时间 \`O(n)\`，空间 \`O(k)\`（队列最多存 k 个下标）。两个易错点：① 队列存**下标**而不是值（存值判不了"还在不在窗里"）；② 队首出窗要在**读答案之前**处理，否则会拿到早就滑出去的元素。`,{i:n-1,l:n-r,r:n-1,dq:o.slice(),ans:s.slice(),done:!0}),i}var Ap=`slmax-styles`,jp=54,Mp=84,Np=46,Pp=156,Fp=168,Ip=46,Lp=220,Rp=250,zp=240,Bp=44,Vp=294,Hp=322,Up=40,Wp=386,Gp=26,Kp=604,qp=1150,Jp=`
.slmax {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.slmax__svg { width: 100%; height: auto; display: block; }

.slmax-note {
  fill: var(--slmax-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.slmax-banner__box {
  fill: var(--slmax-banner, #f4f3ef);
  stroke: var(--slmax-line, #c3c9c2);
  stroke-width: 1.5;
}
.slmax-banner__seg {
  fill: var(--slmax-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.slmax-banner__ans {
  fill: var(--slmax-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.slmax-band {
  fill: var(--slmax-band, #e8dcc4);
}
.slmax-band__tag {
  fill: var(--slmax-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.slmax-cell__box {
  fill: var(--slmax-fill, #ffffff);
  stroke: var(--slmax-line, #c3c9c2);
  stroke-width: 1.5;
}
.slmax-cell__val {
  fill: var(--slmax-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.slmax-cell__idx {
  fill: var(--slmax-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.slmax-cell__sub {
  fill: var(--slmax-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 通道一（底色）：窗口内 / 队列内 */
.slmax-cell.is-window .slmax-cell__box { fill: var(--slmax-gold-fill, #fdf3e3); }
.slmax-cell.is-queue .slmax-cell__box { fill: var(--slmax-gold-fill, #fdf3e3); }
/* 通道二（边框）：当前 i / 被支配 / 已出窗 */
.slmax-cell.is-cur .slmax-cell__box {
  stroke: var(--slmax-hot, #a45f45);
  stroke-width: 3;
}
.slmax-cell.is-cur .slmax-cell__val { fill: var(--slmax-hot, #a45f45); }
.slmax-cell.is-dropped .slmax-cell__box {
  stroke: var(--slmax-hot, #a45f45);
  stroke-dasharray: 4 3;
  stroke-width: 2.5;
}
.slmax-cell.is-dropped .slmax-cell__val { fill: var(--slmax-dim, #9aa39c); }
.slmax-cell.is-left .slmax-cell__box {
  stroke: var(--slmax-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.2;
}
.slmax-cell.is-left .slmax-cell__val { fill: var(--slmax-dim, #9aa39c); }
.slmax-cell.is-front .slmax-cell__box {
  stroke: var(--slmax-ok, #3f6b57);
  stroke-width: 3;
}
.slmax-cell.is-front .slmax-cell__val { fill: var(--slmax-ok, #3f6b57); }
.slmax-cell.is-ans .slmax-cell__box {
  fill: var(--slmax-ok-fill, #eef5f1);
  stroke: var(--slmax-ok, #3f6b57);
  stroke-width: 2;
}
.slmax-cell.is-ans .slmax-cell__val { fill: var(--slmax-ok, #3f6b57); }
.slmax-cell.is-fresh .slmax-cell__box {
  fill: var(--slmax-gold-fill, #fdf3e3);
  stroke: var(--slmax-gold, #c2872f);
  stroke-width: 3;
}
.slmax-cell.is-fresh .slmax-cell__val { fill: var(--slmax-gold, #c2872f); }
.slmax-cell.is-ghost .slmax-cell__box {
  fill: none;
  stroke: var(--slmax-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.2;
}
.slmax-cell.is-ghost .slmax-cell__val { fill: var(--slmax-dim, #9aa39c); }

.slmax-label {
  fill: var(--slmax-muted, #657168);
  font-size: 12px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.slmax-front {
  fill: var(--slmax-ok, #3f6b57);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.slmax-phase__text {
  fill: var(--slmax-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function Yp(){if(document.getElementById(Ap))return;let e=document.createElement(`style`);e.id=Ap,e.textContent=Jp,document.head.appendChild(e)}function Xp(e,t={}){if(!e||e.dataset.slmaxMounted===`1`)return{destroy(){}};e.dataset.slmaxMounted=`1`,Yp();let n=kp(t),r=t.autoplay!==!1,i=n[0],a=i.nums,o=i.n,s=i.k,c=Y,l=document.createElement(`div`);l.className=`viz slmax`;let u=document.createElement(`div`);u.className=`viz__stage`,l.appendChild(u);function d(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(o===0||s>o){let t=c(`svg`,{class:`viz__svg slmax__svg`,viewBox:`0 0 620 120`,role:`img`}),n=c(`text`,{x:310,y:60,style:`fill: var(--slmax-muted, #657168); font-size: 14px; text-anchor: middle;`});return n.textContent=o===0?`数组为空 —— 没有窗口`:`窗口大小 ${s} 大于数组长度 ${o} —— 无有效窗口`,t.appendChild(n),u.appendChild(t),l.appendChild(d()),l.appendChild(Q().root),e.textContent=``,e.appendChild(l),X(),{destroy(){e.textContent=``,delete e.dataset.slmaxMounted,document.getElementById(Ap)?.remove()}}}let f=Math.max(1,n[n.length-1].ans.length),p=48;Math.max(o,f,s)*p+(Math.max(o,f,s)-1)*8>Kp&&(p=Math.max(24,Math.floor((Kp-(Math.max(o,f,s)-1)*8)/Math.max(o,f,s))));let m=o*p+(o-1)*8,h=f*p+(f-1)*8,g=s*p+(s-1)*8,_=Math.max(660,Gp*2+Math.max(m,h,g)),v=(_-m)/2,y=(_-h)/2,b=(_-g)/2,x=e=>v+e*(p+8)+p/2,S=e=>y+e*(p+8)+p/2,C=e=>b+e*(p+8)+p/2,w=_-Gp*2,T=c(`svg`,{class:`viz__svg slmax__svg`,viewBox:`0 0 ${_} 410`,role:`img`,"aria-label":`滑动窗口最大值 单调队列推演动画`});u.appendChild(T);let E=c(`g`,{class:`slmax-bands`}),D=c(`g`,{class:`slmax-cells`}),O=c(`g`,{class:`slmax-marks`});T.appendChild(E),T.appendChild(D),T.appendChild(O);let k=c(`text`,{class:`slmax-note`,x:Gp,y:jp});k.textContent=`单调队列：只留「还有机会当最大值」的候选，按值递减 —— 队首恒为最大`,O.appendChild(k),O.appendChild(c(`rect`,{class:`slmax-banner__box`,x:Gp,y:Mp,width:w,height:Np,rx:9}));let A=c(`text`,{class:`slmax-banner__seg`,x:44,y:107}),j=c(`text`,{class:`slmax-banner__seg`,x:176,y:107}),M=c(`text`,{class:`slmax-banner__ans`,x:_-Gp-18,y:107});O.appendChild(A),O.appendChild(j),O.appendChild(M);let N=[];for(let e=0;e<o;e+=1){let t=c(`g`,{class:`slmax-cell`}),n=c(`rect`,{class:`slmax-cell__box`,x:x(e)-p/2,y:Fp,width:p,height:Ip,rx:6});t.appendChild(n);let r=c(`text`,{class:`slmax-cell__val`,x:x(e),y:191});r.textContent=String(a[e]),t.appendChild(r);let i=c(`text`,{class:`slmax-cell__idx`,x:x(e),y:Pp});i.textContent=String(e),O.appendChild(i),D.appendChild(t),N.push({g:t,box:n,val:r})}let P=c(`rect`,{class:`slmax-band`,x:0,y:Lp,width:0,height:7,rx:3.5});E.appendChild(P);let F=c(`text`,{class:`slmax-band__tag`,x:0,y:238}),I=c(`text`,{class:`slmax-band__tag`,x:0,y:238});O.appendChild(F),O.appendChild(I);let L=c(`text`,{class:`slmax-label`,x:b-14,y:Rp});L.textContent=`deque`,O.appendChild(L);let R=[];for(let e=0;e<s;e+=1){let t=c(`g`,{class:`slmax-cell`}),n=c(`rect`,{class:`slmax-cell__box`,x:C(e)-p/2,y:zp,width:p,height:Bp,rx:6});t.appendChild(n);let r=c(`text`,{class:`slmax-cell__val`,x:C(e),y:257});t.appendChild(r);let i=c(`text`,{class:`slmax-cell__sub`,x:C(e),y:276});t.appendChild(i),D.appendChild(t),R.push({g:t,box:n,val:r,sub:i})}let z=c(`text`,{class:`slmax-front`,x:0,y:Vp});z.textContent=`front (max)`,O.appendChild(z);let B=c(`text`,{class:`slmax-label`,x:y-14,y:342});B.textContent=`ans`,O.appendChild(B);let V=[];for(let e=0;e<f;e+=1){let t=c(`g`,{class:`slmax-cell`}),n=c(`rect`,{class:`slmax-cell__box`,x:S(e)-p/2,y:Hp,width:p,height:Up,rx:6});t.appendChild(n);let r=c(`text`,{class:`slmax-cell__val`,x:S(e),y:342});t.appendChild(r),D.appendChild(t),V.push({g:t,box:n,val:r})}let H=c(`text`,{class:`slmax-phase__text`,x:_/2,y:Wp});O.appendChild(H);let U=d();function ee(e,t){if(!t)return;let n=t.phase===`slide`,r=t.phase===`record`,i=t.phase===`done`,s=t.l??0,c=t.r??(i?o-1:0),l=new Set(t.dropped||[]),u=new Set(t.expired||[]);if(N.forEach((e,a)=>{let o=[`slmax-cell`];a>=s&&a<=c?o.push(`is-window`):s>0&&a<s&&o.push(`is-left`),(n||r)&&(l.has(a)?o.push(`is-dropped`):u.has(a)&&o.push(`is-left`),a===t.i&&!i&&o.push(`is-cur`)),e.g.setAttribute(`class`,o.join(` `))}),c>=s&&c<o){let e=v+s*(p+8),t=v+c*(p+8)+p;P.setAttribute(`x`,e),P.setAttribute(`width`,Math.max(4,t-e)),P.style.opacity=`1`,F.setAttribute(`x`,e+4),F.textContent=`L=${s}`,I.setAttribute(`x`,t-4),I.textContent=`R=${c}`,F.style.opacity=`1`,I.style.opacity=`1`}else P.style.opacity=`0`,F.style.opacity=`0`,I.style.opacity=`0`;let d=t.dq||[];R.forEach((e,t)=>{let n=[`slmax-cell`];if(t<d.length){let r=d[t];e.val.textContent=String(a[r]),e.sub.textContent=`#${r}`,n.push(`is-queue`),t===0&&n.push(`is-front`)}else e.val.textContent=``,e.sub.textContent=``,n.push(`is-ghost`);e.g.setAttribute(`class`,n.join(` `))}),d.length>0?(z.setAttribute(`x`,C(0)),z.style.opacity=`1`):z.style.opacity=`0`;let f=t.ans||[];if(V.forEach((e,t)=>{let n=[`slmax-cell`];t<f.length?(e.val.textContent=String(f[t]),n.push(r&&t===f.length-1?`is-fresh`:`is-ans`)):(e.val.textContent=``,n.push(`is-ghost`)),e.g.setAttribute(`class`,n.join(` `))}),n||r){A.textContent=`i=${t.i} · 窗口 [${s}, ${c}]`;let e=[];n?(u.size>0&&e.push(`出窗 ${[...t.expired].map(e=>a[e]).join(`,`)}`),l.size>0&&e.push(`被支配 ${[...t.dropped].map(e=>a[e]).join(`,`)}`),e.push(`push ${a[t.i]}`)):e.push(`记录最大值 ${t.maxVal}`),j.textContent=e.join(` · `)}else t.phase===`init`?(A.textContent=`单调队列`,j.textContent=`队列只留还有机会的候选`):(A.textContent=`${o} 个元素扫完`,j.textContent=`${t.ans.length} 个窗口`);if(M.textContent=i?`[${t.ans.join(`,`)}]`:`max=${t.maxVal??`-`}`,n){let e=[];u.size>0&&e.push(`动作一：队首出窗（看下标）`),l.size>0&&e.push(`动作二：队尾被支配（看值）`),H.textContent=e.length>0?`${e.join(` + `)} —— 两个动作一个看下标一个看值，互不干扰`:`队列仍严格递减且都在窗内 —— 无需淘汰`}else r?H.textContent=`队首 ${t.maxVal} 就是这一窗的最大值（队列递减且在窗内，无需再扫）`:t.phase===`init`?H.textContent=`队列存下标 —— 下标才能判断"还在不在窗里"`:H.textContent=`每元素最多入队一次、出队一次 —— 均摊 O(1)，总 O(n) 时间 O(k) 空间`;Z(U,t.desc)}l.appendChild(U);let W=Q();l.appendChild(W.root),e.textContent=``,e.appendChild(l),X();let G=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,K=$({steps:n,controls:W,intervalMs:qp,onRender:ee});K.jumpTo(Math.trunc(t.initialStep)||0);let te=null;return r&&!G&&typeof IntersectionObserver==`function`&&(te=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){te.disconnect(),te=null,K.play();return}},{threshold:.35}),te.observe(l)),{destroy(){te&&=(te.disconnect(),null),K.destroy(),e.textContent=``,delete e.dataset.slmaxMounted,document.getElementById(Ap)?.remove()}}}var Zp=[10,9,2,5,3,7,101,18];function Qp(e={}){let t=(Array.isArray(e.nums)?e.nums:Zp).slice(),n=t.length,r=[],i=(e,i,a={})=>{r.push({phase:e,desc:i,nums:t,n,i:null,j:null,ok:!1,better:!1,dp:[],parent:[],cands:[],best:null,bestJ:null,settled:0,answer:0,bestEnd:null,done:e===`done`,...a})};if(n===0)return i(`done`,"数组为空 —— 没有任何子序列，答案是 `0`。",{done:!0}),r;i(`init`,`给了数组 \`[${t.join(`, `)}]\`，要**最长严格递增子序列**的长度。注意「子序列」不是「子数组」：元素可以跳着挑，只要保持原来的先后顺序 —— 这一点正是难度的全部来源。破局的办法是给状态**加一个锚**：\`dp[i]\` 表示**以 \`nums[i]\` 结尾**的最长递增子序列长度。锚一加上，问题就从「整段怎么挑」退化成「我接在谁后面」：\`dp[i] = 1 + max(dp[j])\`，其中 \`j < i\` 且 \`nums[j] < nums[i]\`；接不上就单独成串，取 \`1\`。最后答案是**整个 \`dp\` 数组的最大值**，不是 \`dp[n - 1]\`。`);let a=Array(n).fill(1),o=Array(n).fill(-1),s=0,c=null;for(let e=0;e<n;e+=1){let n=t[e],r=1,l=-1,u=[];a[e]=1,o[e]=-1;for(let d=0;d<e;d+=1){let f=t[d],p=f<n;p&&u.push(d);let m=p&&a[d]+1>r,h=[`回看 \`j = ${d}\`（值 \`${f}\`）：`];if(!p)h.push(`\`${f} >= ${n}\` —— **接不上**：递增序列里下一个数必须严格更大。`);else if(m){let t=r;r=a[d]+1,l=d,h.push(`\`${f} < ${n}\` 能接，而且 \`dp[${d}] + 1 = ${a[d]} + 1 = ${r}\`，**比当前最好成绩 \`${t}\` 更长** —— 刷新：\`dp[${e}] = ${r}\`，最优前驱 \`parent[${e}] = ${d}\`。`)}else h.push(`\`${f} < ${n}\` 能接，但 \`dp[${d}] + 1 = ${a[d]+1} <= ${r}\`，**不如下面那条链长**，不刷新。`);m&&(a[e]=r,o[e]=l),h.push(`本轮能接的前驱有 \`${u.length}\` 个 \`[${u.join(`, `)}]\`，此刻 \`dp[${e}] = ${r}\`。`),i(`scan`,h.join(``),{i:e,j:d,ok:p,better:m,dp:a.slice(),parent:o.slice(),cands:u.slice(),best:r,bestJ:l,settled:e,answer:s,bestEnd:c})}a[e]=r,o[e]=l;let d=s;r>s&&(s=r,c=e),i(`settle`,`\`i = ${e}\`（值 \`${n}\`）这一轮扫完、定型：`+(l>=0?`最优前驱是 \`j = ${l}\`（值 \`${t[l]}\`，\`dp = ${a[l]}\`），所以 \`dp[${e}] = ${r}\` —— 就是把 \`${n}\` 接在 \`j = ${l}\` 那条链的尾巴上。`:`前面没有任何比 \`${n}\` 小的元素，接不上任何人，只能自己单独成串：\`dp[${e}] = 1\`。`)+(r>d?`**全局最长刷新到 \`${s}\`**（链的末端是 \`i = ${c}\`）。`:`全局最长仍然是 \`${s}\`，没有被刷新。`),{i:e,dp:a.slice(),parent:o.slice(),cands:u.slice(),best:r,bestJ:l,settled:e+1,answer:s,bestEnd:c})}return i(`done`,`\`${n}\` 个位置全部定型：\`dp = [${a.join(`, `)}]\`。答案是**整个 \`dp\` 的最大值** \`${s}\`，出现在 \`i = ${c}\`（值 \`${t[c]}\`）—— **不是 \`dp[${n-1}] = ${a[n-1]}\`**，这是本题第一大坑，而官方样例恰好让两者相等。金框那条就是一条最长递增子序列，长度 \`${s}\`。复杂度：每个 \`i\` 都要往回看一遍，时间 \`O(n^2)\`；\`dp\` 和 \`parent\` 各 \`O(n)\` 空间。想压到 \`O(n log n)\`，得换一套记账方式 —— 看下一个动画。`,{i:n-1,dp:a.slice(),parent:o.slice(),settled:n,answer:s,bestEnd:c,done:!0}),r}var $p=`lisdp-styles`,em=26,tm=44,nm=44,rm=112,im=124,am=52,om=200,sm=212,cm=34,lm=260,um=32,dm=316,fm=30,pm=604,mm=950,hm=`
.lisdp {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.lisdp__svg { width: 100%; height: auto; display: block; }

.lisdp-note {
  fill: var(--lisdp-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lisdp-banner__box {
  fill: var(--lisdp-banner, #f4f3ef);
  stroke: var(--lisdp-line, #c3c9c2);
  stroke-width: 1.5;
}
.lisdp-banner__seg {
  fill: var(--lisdp-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisdp-banner__val {
  fill: var(--lisdp-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lisdp-cell__box {
  fill: var(--lisdp-fill, #ffffff);
  stroke: var(--lisdp-line, #c3c9c2);
  stroke-width: 1.5;
}
.lisdp-cell__val {
  fill: var(--lisdp-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisdp-cell__sub {
  fill: var(--lisdp-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ---- 通道一：底色（可接 / 链上）。is-chain 写在后面，同权重时覆盖 is-cand ---- */
.lisdp-cell.is-cand .lisdp-cell__box { fill: var(--lisdp-ok-fill, #eef5f1); }
.lisdp-cell.is-chain .lisdp-cell__box { fill: var(--lisdp-gold-fill, #fdf3e3); }
/* ---- 通道二：边框 ---- */
.lisdp-cell.is-cur .lisdp-cell__box {
  stroke: var(--lisdp-hot, #a45f45);
  stroke-width: 3;
}
.lisdp-cell.is-cur .lisdp-cell__val { fill: var(--lisdp-hot, #a45f45); }
.lisdp-cell.is-better .lisdp-cell__box {
  stroke: var(--lisdp-gold, #c2872f);
  stroke-width: 3;
}
.lisdp-cell.is-better .lisdp-cell__val { fill: var(--lisdp-gold, #c2872f); }
.lisdp-cell.is-dead .lisdp-cell__box {
  stroke: var(--lisdp-dim, #9aa39c);
  stroke-dasharray: 4 3;
  stroke-width: 2;
}
.lisdp-cell.is-dead .lisdp-cell__val { fill: var(--lisdp-dim, #9aa39c); }
.lisdp-cell.is-scan .lisdp-cell__box {
  stroke: var(--lisdp-ok, #3f6b57);
  stroke-width: 2.5;
}
.lisdp-cell.is-scan .lisdp-cell__val { fill: var(--lisdp-ok, #3f6b57); }
.lisdp-cell.is-ghost .lisdp-cell__box {
  fill: none;
  stroke: var(--lisdp-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.2;
}
.lisdp-cell.is-ghost .lisdp-cell__val { fill: var(--lisdp-dim, #9aa39c); }
.lisdp-cell.is-growing .lisdp-cell__box {
  fill: var(--lisdp-gold-fill, #fdf3e3);
  stroke: var(--lisdp-hot, #a45f45);
  stroke-dasharray: 5 3;
  stroke-width: 2.5;
}
.lisdp-cell.is-growing .lisdp-cell__val { fill: var(--lisdp-hot, #a45f45); }
.lisdp-cell.is-fresh .lisdp-cell__box {
  fill: var(--lisdp-gold-fill, #fdf3e3);
  stroke: var(--lisdp-gold, #c2872f);
  stroke-width: 3;
}
.lisdp-cell.is-fresh .lisdp-cell__val { fill: var(--lisdp-gold, #c2872f); }

.lisdp-ring {
  fill: none;
  stroke: var(--lisdp-gold, #c2872f);
  stroke-width: 2;
  stroke-dasharray: 5 4;
  opacity: 0;
}
.lisdp-ring.is-on { opacity: 1; }

.lisdp-badge__box {
  fill: var(--lisdp-hot, #a45f45);
  opacity: 0;
}
.lisdp-badge__box.is-on { opacity: 1; }
.lisdp-badge__text {
  fill: #ffffff;
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.lisdp-badge__text.is-on { opacity: 1; }

.lisdp-label {
  fill: var(--lisdp-muted, #657168);
  font-size: 12px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lisdp-ans__box {
  fill: var(--lisdp-banner, #f4f3ef);
  stroke: var(--lisdp-line, #c3c9c2);
  stroke-width: 1.5;
}
.lisdp-ans__box.is-hot {
  fill: var(--lisdp-gold-fill, #fdf3e3);
  stroke: var(--lisdp-gold, #c2872f);
  stroke-width: 2;
}
.lisdp-ans__text {
  fill: var(--lisdp-ink, #1f2a24);
  font-size: 14px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisdp-ans__text.is-hot { fill: var(--lisdp-gold, #c2872f); }

.lisdp-phase__text {
  fill: var(--lisdp-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function gm(){if(document.getElementById($p))return;let e=document.createElement(`style`);e.id=$p,e.textContent=hm,document.head.appendChild(e)}function _m(e,t){let n=new Set;if(t==null||t<0)return n;let r=t,i=0;for(;r>=0&&i<128;)n.add(r),r=e.parent&&e.parent[r]!==void 0?e.parent[r]:-1,i+=1;return n}function vm(e,t={}){if(!e||e.dataset.lisdpMounted===`1`)return{destroy(){}};e.dataset.lisdpMounted=`1`,gm();let n=Qp(t),r=t.autoplay!==!1,i=n[0],a=i.nums,o=i.n,s=Y,c=document.createElement(`div`);c.className=`viz lisdp`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);let u=()=>{let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e};if(o===0){let t=s(`svg`,{class:`viz__svg lisdp__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{x:310,y:60,style:`fill: var(--lisdp-muted, #657168); font-size: 14px; text-anchor: middle;`});return n.textContent=`数组为空 —— 没有子序列，答案是 0`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),X(),{destroy(){e.textContent=``,delete e.dataset.lisdpMounted,document.getElementById($p)?.remove()}}}let d=56;o*d+(o-1)*8>pm&&(d=Math.max(24,Math.floor((pm-(o-1)*8)/o)));let f=o*d+(o-1)*8,p=Math.max(660,fm*2+f),m=(p-f)/2,h=e=>m+e*(d+8)+d/2,g=p-fm*2,_=s(`svg`,{class:`viz__svg lisdp__svg`,viewBox:`0 0 ${p} 338`,role:`img`,"aria-label":`最长递增子序列 动态规划推演动画`});l.appendChild(_);let v=s(`g`,{class:`lisdp-marks`}),y=s(`g`,{class:`lisdp-cells`}),b=s(`g`,{class:`lisdp-labels`});_.appendChild(v),_.appendChild(y),_.appendChild(b);let x=s(`text`,{class:`lisdp-note`,x:fm,y:em});x.textContent=`dp[i] = 以 nums[i] 结尾的最长递增子序列长度 —— 答案是整个 dp 的最大值`,v.appendChild(x),v.appendChild(s(`rect`,{class:`lisdp-banner__box`,x:fm,y:tm,width:g,height:nm,rx:9}));let S=s(`text`,{class:`lisdp-banner__seg`,x:48,y:66}),C=s(`text`,{class:`lisdp-banner__seg`,x:240,y:66}),w=s(`text`,{class:`lisdp-banner__val`,x:p-fm-18,y:66});v.appendChild(S),v.appendChild(C),v.appendChild(w);let T=s(`text`,{class:`lisdp-label`,x:m-14,y:150});T.textContent=`nums`,v.appendChild(T);let E=s(`text`,{class:`lisdp-label`,x:m-14,y:229});E.textContent=`dp`,v.appendChild(E);let D=[];for(let e=0;e<o;e+=1){let t=s(`g`,{class:`lisdp-cell`});t.appendChild(s(`rect`,{class:`lisdp-cell__box`,x:h(e)-d/2,y:im,width:d,height:am,rx:6}));let n=s(`text`,{class:`lisdp-cell__val`,x:h(e),y:143});n.textContent=String(a[e]),t.appendChild(n);let r=s(`text`,{class:`lisdp-cell__sub`,x:h(e),y:165});r.textContent=`#${e}`,t.appendChild(r),y.appendChild(t),D.push({g:t})}let O=[];for(let e=0;e<o;e+=1){let t=s(`g`,{class:`lisdp-cell`});t.appendChild(s(`rect`,{class:`lisdp-cell__box`,x:h(e)-d/2,y:sm,width:d,height:cm,rx:6}));let n=s(`text`,{class:`lisdp-cell__val`,x:h(e),y:229});t.appendChild(n),y.appendChild(t),O.push({g:t,val:n})}let k=[];for(let e=0;e<o;e+=1){let t=s(`rect`,{class:`lisdp-ring`,x:h(e)-d/2-5,y:im-5,width:d+10,height:62,rx:9});v.appendChild(t),k.push(t)}let A=(e,t)=>{let n=s(`g`,{class:`lisdp-badge`}),r=s(`rect`,{class:`lisdp-badge__box`,x:h(0)-10,y:t-9,width:20,height:18,rx:5}),i=s(`text`,{class:`lisdp-badge__text`,x:h(0),y:t});return i.textContent=e,n.appendChild(r),n.appendChild(i),v.appendChild(n),{g:n,box:r,text:i}},j=A(`i`,rm),M=A(`j`,om),N=s(`rect`,{class:`lisdp-ans__box`,x:m,y:lm,width:f,height:um,rx:8});v.appendChild(N);let P=s(`text`,{class:`lisdp-ans__text`,x:m+f/2,y:276});v.appendChild(P);let F=s(`text`,{class:`lisdp-phase__text`,x:p/2,y:dm});v.appendChild(F);let I=u();function L(e,t){if(!t)return;let r=t.phase,i=r===`scan`,s=r===`settle`,c=r===`done`,l=t.i,u=t.j,d=t.cands||[],f=new Set(d),p=_m(t,c?t.bestEnd:l),m=t.answer;D.forEach((e,n)=>{let r=[`lisdp-cell`];p.has(n)&&r.push(`is-chain`),f.has(n)&&r.push(`is-cand`),l!==null&&!c&&n===l?r.push(`is-cur`):i&&n===u&&r.push(t.ok?`is-scan`:`is-dead`),!c&&t.bestJ!==null&&t.bestJ>=0&&n===t.bestJ&&n!==l&&r.push(`is-better`),e.g.setAttribute(`class`,r.join(` `))});let g=t.settled||0;O.forEach((e,n)=>{let r=[`lisdp-cell`];l!==null&&n===l&&g===l?(r.push(`is-growing`),e.val.textContent=String(t.best??``)):n<g?(e.val.textContent=String(t.dp[n]),s&&n===l?r.push(`is-fresh`):p.has(n)&&r.push(`is-chain`)):(e.val.textContent=``,r.push(`is-ghost`)),e.g.setAttribute(`class`,r.join(` `))});let _=!c&&t.bestJ!==null&&t.bestJ>=0&&l!==null&&t.bestJ<l;k.forEach((e,n)=>{e.classList.toggle(`is-on`,_&&n===t.bestJ)});let v=(e,t,n)=>{e.box.classList.toggle(`is-on`,n),e.text.classList.toggle(`is-on`,n),n&&(e.box.setAttribute(`x`,h(t)-10),e.text.setAttribute(`x`,h(t)))};v(j,l??0,l!==null&&!c),v(M,u??0,i&&u!==null),P.textContent=`目前最长递增子序列长度 = ${m}`;let y=m>(e>0?n[e-1].answer:0);if(N.classList.toggle(`is-hot`,y||c),P.classList.toggle(`is-hot`,y||c),i||s){if(S.textContent=`i = ${l} · 值 ${a[l]}`,i){let e=[`看 j = ${u}`];t.ok?t.better?e.push(`接上 dp[${u}] → ${t.best}`):e.push(`接上不如当前`):e.push(`${a[u]} 接不上`),C.textContent=e.join(` · `)}else C.textContent=t.bestJ>=0?`定型 dp[${l}] = ${t.best}（前驱 j = ${t.bestJ}）`:`定型 dp[${l}] = 1（单独成串）`;w.textContent=s?`dp[${l}] = ${t.dp[l]}`:`dp[${l}] = ${t.best}`}else c?(S.textContent=`${o} 个位置全部定型`,C.textContent=`答案是 max(dp)，不是 dp[n-1]`,w.textContent=`答案 = ${m}`):(S.textContent=`第一次接触？`,C.textContent=`dp[i] = 以 nums[i] 结尾的最长递增`,w.textContent=`答案是 max(dp)`);i?t.ok?t.better?F.textContent=`dp[${u}] + 1 = ${t.best} 更长 —— dp[${l}] 刷新，最优前驱记成 j = ${u}`:F.textContent=`dp[${u}] + 1 = ${t.dp[u]+1} 不比当前好 —— 保持不动，继续往回看`:F.textContent=`nums[${u}] >= nums[${l}] —— 递增要求严格更大，这个 j 接不上`:s?F.textContent=t.bestJ>=0?`dp[${l}] 定型为 ${t.best}：把 ${a[l]} 接在 j = ${t.bestJ} 那条链尾巴上`:`dp[${l}] 定型为 1：前面没有更小的元素，只能自己单独成串`:c?F.textContent=`时间 O(n^2)、空间 O(n) —— 想更快，要把「以 i 结尾」换成「按长度记账」`:F.textContent=`dp[i] 的「以 i 结尾」是锚 —— 有了它，才能只知道「我接在谁后面」`,Z(I,t.desc)}c.appendChild(I);let R=Q();c.appendChild(R.root),e.textContent=``,e.appendChild(c),X();let z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,B=$({steps:n,controls:R,intervalMs:mm,onRender:L});B.jumpTo(Math.trunc(t.initialStep)||0);let V=null;return r&&!z&&typeof IntersectionObserver==`function`&&(V=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){V.disconnect(),V=null,B.play();return}},{threshold:.35}),V.observe(c)),{destroy(){V&&=(V.disconnect(),null),B.destroy(),e.textContent=``,delete e.dataset.lisdpMounted,document.getElementById($p)?.remove()}}}var ym=[10,9,2,5,3,7,101,18];function bm(e={}){let t=(Array.isArray(e.nums)?e.nums:ym).slice(),n=t.length,r=[],i=(e,i,a={})=>{r.push({phase:e,desc:i,nums:t,n,i:null,x:null,tails:[],lo:null,hi:null,mid:null,goRight:null,pos:null,kind:null,prevVal:null,answer:0,done:e===`done`,...a})};if(n===0)return i(`done`,"数组为空 —— 没有任何子序列，答案是 `0`。",{done:!0}),r;i(`init`,`同一个数组 \`[${t.join(`, `)}]\`，这次要在 \`O(n log n)\` 里做完。上一版按「以 \`i\` 结尾」记账，结尾有 \`n\` 种可能，没法二分；这一版换一个锚 —— **按下标（也就是长度）记账**：\`tails[len]\` 表示**所有长度为 \`len + 1\` 的递增子序列里，末尾元素的最小值**。这个定义自带一个漂亮性质：**\`tails\` 本身严格递增**。于是每来一个 \`x\`，只要在 \`tails\` 里找**第一个 \`>= x\` 的位置**：找到了就把它换成 \`x\`（同长度下末尾更小，对后面更有利），没找到就**追加**、长度加一。**答案就是 \`tails\` 的长度。**`);let a=[];for(let e=0;e<n;e+=1){let n=t[e],r=0,o=a.length;for(;r<o;){let t=r+o>>1,s=a[t]<n;i(`bisect`,`\`i = ${e}\`（值 \`${n}\`）在 \`tails = [${a.join(`, `)}]\` 里二分，找**第一个 \`>= ${n}\` 的位置**。当前区间 \`[${r}, ${o})\`，探针 \`mid = ${t}\`：\`tails[${t}] = ${a[t]}\` —— `+(s?`\`${a[t]} < ${n}\`，这个位置**不是**答案，往右收：\`lo = ${t+1}\`。`:`\`${a[t]} >= ${n}\`，这个位置**可能就是**答案，且左边也可能有，往左收：\`hi = ${t}\`。`),{i:e,x:n,tails:a.slice(),lo:r,hi:o,mid:t,goRight:s,answer:a.length}),s?r=t+1:o=t}let s=r,c=s<a.length?`replace`:`append`,l=null;c===`replace`?(l=a[s],a[s]=n):a.push(n),i(`place`,c===`replace`?`二分收敛：区间收缩到空，\`pos = ${s}\`。\`tails[${s}] = ${l}\` 是**第一个 \`>= ${n}\` 的位置**，把它换成 \`${n}\` —— 长度 \`${s+1}\` 这一档的末尾值从 \`${l}\` 降到 \`${n}\`，**同长度下末尾更小，对后面接数更有利**。长度不变：答案仍是 \`${a.length}\`。注意：\`tails\` 里的 **\`${l}\` 被覆盖掉了**，它并不代表「原序列里 \`${l}\` 被删了」—— tails 只是登记表。`:`二分收敛：区间收缩到空，\`pos = ${s}\`，正好是 \`tails\` 的末尾之外 —— 说明 \`${n}\` 比当前所有末尾都大，可以**追加**。长度 \`${s}\` 变 \`${s+1}\`，**答案涨到 \`${a.length}\`**。`,{i:e,x:n,tails:a.slice(),lo:s,hi:s,mid:null,pos:s,kind:c,prevVal:l,answer:a.length})}return i(`done`,`\`${n}\` 个元素处理完，\`tails = [${a.join(`, `)}]\`，**答案 = 长度 = ${a.length}**。三点必须记住：① \`tails\` **不是**那条最长递增子序列 —— 它只是「每个长度下的最小末尾」登记表，位置会被后来的更小值覆盖（你可以回放看看金框那几步），但**长度一定是正确答案**；② 每个元素只做一次二分，时间 \`O(n log n)\`，\`tails\` 最多 \`O(n)\` 空间；③ 求「最长不减」子序列时二分换成 \`bisect_right\`（找第一个 \`> x\` 的位置），否则相等元素会被误替换。`,{i:n-1,tails:a.slice(),answer:a.length,done:!0}),r}var xm=`lisbin-styles`,Sm=26,Cm=42,wm=44,Tm=108,Em=122,Dm=48,Om=190,km=204,Am=48,jm=268,Mm=289,Nm=306,Pm=324,Fm=32,Im=380,Lm=30,Rm=604,zm=1e3,Bm=`
.lisbin {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.lisbin__svg { width: 100%; height: auto; display: block; }

.lisbin-note {
  fill: var(--lisbin-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lisbin-banner__box {
  fill: var(--lisbin-banner, #f4f3ef);
  stroke: var(--lisbin-line, #c3c9c2);
  stroke-width: 1.5;
}
.lisbin-banner__seg {
  fill: var(--lisbin-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisbin-banner__val {
  fill: var(--lisbin-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lisbin-cell__box {
  fill: var(--lisbin-fill, #ffffff);
  stroke: var(--lisbin-line, #c3c9c2);
  stroke-width: 1.5;
}
.lisbin-cell__val {
  fill: var(--lisbin-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisbin-cell__sub {
  fill: var(--lisbin-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisbin-cell__old {
  fill: var(--lisbin-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.lisbin-cell__old.is-on { opacity: 1; }
.lisbin-oldline {
  stroke: var(--lisbin-dim, #9aa39c);
  stroke-width: 1.2;
  opacity: 0;
}
.lisbin-oldline.is-on { opacity: 1; }

/* ---- 通道一：底色（搜索区间内 / 区间外） ---- */
.lisbin-cell.is-range .lisbin-cell__box { fill: var(--lisbin-ok-fill, #eef5f1); }
.lisbin-cell.is-out .lisbin-cell__box { fill: var(--lisbin-banner, #f4f3ef); }
.lisbin-cell.is-out .lisbin-cell__val { fill: var(--lisbin-dim, #9aa39c); }
/* ---- 通道二：边框 ---- */
.lisbin-cell.is-mid .lisbin-cell__box {
  stroke: var(--lisbin-hot, #a45f45);
  stroke-width: 3;
}
.lisbin-cell.is-mid .lisbin-cell__val { fill: var(--lisbin-hot, #a45f45); }
.lisbin-cell.is-pos .lisbin-cell__box {
  stroke: var(--lisbin-gold, #c2872f);
  stroke-width: 3;
}
.lisbin-cell.is-pos .lisbin-cell__val { fill: var(--lisbin-gold, #c2872f); }
.lisbin-cell.is-cur .lisbin-cell__box {
  stroke: var(--lisbin-hot, #a45f45);
  stroke-width: 3;
}
.lisbin-cell.is-cur .lisbin-cell__val { fill: var(--lisbin-hot, #a45f45); }
.lisbin-cell.is-fresh .lisbin-cell__box {
  fill: var(--lisbin-gold-fill, #fdf3e3);
  stroke: var(--lisbin-gold, #c2872f);
  stroke-width: 3;
}
.lisbin-cell.is-fresh .lisbin-cell__val { fill: var(--lisbin-gold, #c2872f); }
.lisbin-cell.is-ghost .lisbin-cell__box {
  fill: none;
  stroke: var(--lisbin-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.2;
}

.lisbin-badge__box {
  fill: var(--lisbin-hot, #a45f45);
  opacity: 0;
}
.lisbin-badge__box.is-on { opacity: 1; }
.lisbin-badge__box.is-gold { fill: var(--lisbin-gold, #c2872f); }
.lisbin-badge__text {
  fill: #ffffff;
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.lisbin-badge__text.is-on { opacity: 1; }

.lisbin-range-line {
  stroke: var(--lisbin-ok, #3f6b57);
  stroke-width: 2;
  opacity: 0;
}
.lisbin-range-line.is-on { opacity: 1; }

.lisbin-label {
  fill: var(--lisbin-muted, #657168);
  font-size: 12px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisbin-info {
  fill: var(--lisbin-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lisbin-ans__box {
  fill: var(--lisbin-banner, #f4f3ef);
  stroke: var(--lisbin-line, #c3c9c2);
  stroke-width: 1.5;
}
.lisbin-ans__box.is-hot {
  fill: var(--lisbin-gold-fill, #fdf3e3);
  stroke: var(--lisbin-gold, #c2872f);
  stroke-width: 2;
}
.lisbin-ans__text {
  fill: var(--lisbin-ink, #1f2a24);
  font-size: 14px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisbin-ans__text.is-hot { fill: var(--lisbin-gold, #c2872f); }

.lisbin-phase__text {
  fill: var(--lisbin-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function Vm(){if(document.getElementById(xm))return;let e=document.createElement(`style`);e.id=xm,e.textContent=Bm,document.head.appendChild(e)}function Hm(e,t={}){if(!e||e.dataset.lisbinMounted===`1`)return{destroy(){}};e.dataset.lisbinMounted=`1`,Vm();let n=bm(t),r=t.autoplay!==!1,i=n[0],a=i.nums,o=i.n,s=Y,c=document.createElement(`div`);c.className=`viz lisbin`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);let u=()=>{let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e};if(o===0){let t=s(`svg`,{class:`viz__svg lisbin__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{x:310,y:60,style:`fill: var(--lisbin-muted, #657168); font-size: 14px; text-anchor: middle;`});return n.textContent=`数组为空 —— 没有子序列，答案是 0`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),X(),{destroy(){e.textContent=``,delete e.dataset.lisbinMounted,document.getElementById(xm)?.remove()}}}let d=56;o*d+(o-1)*8>Rm&&(d=Math.max(24,Math.floor((Rm-(o-1)*8)/o)));let f=o*d+(o-1)*8,p=Math.max(660,Lm*2+f),m=(p-f)/2,h=e=>m+e*(d+8)+d/2,g=p-Lm*2,_=s(`svg`,{class:`viz__svg lisbin__svg`,viewBox:`0 0 ${p} 402`,role:`img`,"aria-label":`最长递增子序列 二分 + tails 推演动画`});l.appendChild(_);let v=s(`g`,{class:`lisbin-marks`}),y=s(`g`,{class:`lisbin-cells`}),b=s(`g`,{class:`lisbin-labels`});_.appendChild(v),_.appendChild(y),_.appendChild(b);let x=s(`text`,{class:`lisbin-note`,x:Lm,y:Sm});x.textContent=`tails[len] = 长度为 len+1 的递增子序列里最小的末尾值 —— 答案就是 tails 的长度`,v.appendChild(x),v.appendChild(s(`rect`,{class:`lisbin-banner__box`,x:Lm,y:Cm,width:g,height:wm,rx:9}));let S=s(`text`,{class:`lisbin-banner__seg`,x:48,y:64}),C=s(`text`,{class:`lisbin-banner__seg`,x:230,y:64}),w=s(`text`,{class:`lisbin-banner__val`,x:p-Lm-18,y:64});v.appendChild(S),v.appendChild(C),v.appendChild(w);let T=s(`text`,{class:`lisbin-label`,x:m-14,y:146});T.textContent=`nums`,v.appendChild(T);let E=s(`text`,{class:`lisbin-label`,x:m-14,y:223});E.textContent=`tails`,v.appendChild(E);let D=[];for(let e=0;e<o;e+=1){let t=s(`g`,{class:`lisbin-cell`});t.appendChild(s(`rect`,{class:`lisbin-cell__box`,x:h(e)-d/2,y:Em,width:d,height:Dm,rx:6}));let n=s(`text`,{class:`lisbin-cell__val`,x:h(e),y:140});n.textContent=String(a[e]),t.appendChild(n);let r=s(`text`,{class:`lisbin-cell__sub`,x:h(e),y:160});r.textContent=`#${e}`,t.appendChild(r),y.appendChild(t),D.push({g:t})}let O=[];for(let e=0;e<o;e+=1){let t=s(`g`,{class:`lisbin-cell`});t.appendChild(s(`rect`,{class:`lisbin-cell__box`,x:h(e)-d/2,y:km,width:d,height:Am,rx:6}));let n=s(`text`,{class:`lisbin-cell__val`,x:h(e),y:222});t.appendChild(n);let r=s(`text`,{class:`lisbin-cell__sub`,x:h(e),y:242});t.appendChild(r),y.appendChild(t),O.push({g:t,val:n,sub:r})}let k=[];for(let e=0;e<o;e+=1){let t=s(`text`,{class:`lisbin-cell__old`,x:h(e),y:Om}),n=s(`line`,{class:`lisbin-oldline`,x1:h(e)-26,y1:Om,x2:h(e)+26,y2:Om});b.appendChild(t),b.appendChild(n),k.push({t,line:n})}let A=s(`line`,{class:`lisbin-range-line`,x1:m,y1:Mm,x2:m,y2:Mm}),j=s(`line`,{class:`lisbin-range-line`,x1:m,y1:Mm-6,x2:m,y2:295}),M=s(`line`,{class:`lisbin-range-line`,x1:m,y1:Mm-6,x2:m,y2:295});v.appendChild(A),v.appendChild(j),v.appendChild(M);let N=s(`g`,{class:`lisbin-badge`}),P=s(`rect`,{class:`lisbin-badge__box`,x:h(0)-18,y:jm-9,width:36,height:18,rx:5}),F=s(`text`,{class:`lisbin-badge__text`,x:h(0),y:jm});N.appendChild(P),N.appendChild(F),v.appendChild(N);let I=s(`g`,{class:`lisbin-badge`}),L=s(`rect`,{class:`lisbin-badge__box`,x:h(0)-10,y:Tm-9,width:20,height:18,rx:5}),R=s(`text`,{class:`lisbin-badge__text`,x:h(0),y:Tm});R.textContent=`i`,I.appendChild(L),I.appendChild(R),v.appendChild(I);let z=s(`text`,{class:`lisbin-info`,x:m,y:Nm});v.appendChild(z);let B=s(`rect`,{class:`lisbin-ans__box`,x:m,y:Pm,width:f,height:Fm,rx:8});v.appendChild(B);let V=s(`text`,{class:`lisbin-ans__text`,x:m+f/2,y:340});v.appendChild(V);let H=s(`text`,{class:`lisbin-phase__text`,x:p/2,y:Im});v.appendChild(H);let U=u();function ee(e,t){if(!t)return;let r=t.phase,i=r===`bisect`,a=r===`place`,s=r===`done`,c=t.i,l=t.tails||[],u=t.answer,f=t.lo,p=t.hi,m=t.mid,g=t.pos;D.forEach((e,t)=>{let n=[`lisbin-cell`];c!==null&&!s&&t===c&&n.push(`is-cur`),e.g.setAttribute(`class`,n.join(` `))});let _=e=>i?e>=f&&e<p?`is-range`:`is-out`:a?e===g?`is-range`:`is-out`:null;O.forEach((e,n)=>{let r=[`lisbin-cell`];if(n<l.length){e.val.textContent=String(l[n]),e.sub.textContent=`len ${n}`;let o=_(n);o&&r.push(o),i&&n===m&&r.push(`is-mid`),a&&n===g&&r.push(t.kind===`append`?`is-fresh`:`is-pos`)}else e.val.textContent=``,e.sub.textContent=``,r.push(`is-ghost`);e.g.setAttribute(`class`,r.join(` `))}),k.forEach((e,n)=>{let r=a&&t.kind===`replace`&&n===g&&t.prevVal!==null;if(e.t.classList.toggle(`is-on`,r),e.line.classList.toggle(`is-on`,r),r){e.t.textContent=`原 ${t.prevVal}`;let r=String(t.prevVal).length*7+16;e.line.setAttribute(`x1`,h(n)-r/2),e.line.setAttribute(`x2`,h(n)+r/2)}});let v=i&&p>f;if(A.classList.toggle(`is-on`,v),j.classList.toggle(`is-on`,v),M.classList.toggle(`is-on`,v),v){let e=h(f)-d/2,t=h(p-1)+d/2;A.setAttribute(`x1`,e),A.setAttribute(`x2`,t),j.setAttribute(`x1`,e),j.setAttribute(`x2`,e),M.setAttribute(`x1`,t),M.setAttribute(`x2`,t)}let y=i?m!==null:a;if(P.classList.toggle(`is-on`,y),F.classList.toggle(`is-on`,y),P.classList.toggle(`is-gold`,a),y){let e=i?m:g;F.textContent=i?`mid`:`pos`,P.setAttribute(`x`,h(e)-18),F.setAttribute(`x`,h(e))}let b=c!==null&&!s;L.classList.toggle(`is-on`,b),R.classList.toggle(`is-on`,b),b&&(L.setAttribute(`x`,h(c)-10),R.setAttribute(`x`,h(c))),i?z.textContent=`搜索区间 [${f}, ${p}) · mid = ${m} · 找第一个 >= ${t.x} 的位置`:a?z.textContent=t.kind===`replace`?`pos = ${g} · 替换 tails[${g}]：${t.prevVal} → ${t.x}（长度不变）`:`pos = ${g} · 追加 ${t.x}：长度 ${g} → ${g+1}`:z.textContent=``,V.textContent=`目前最长递增子序列长度 = ${u}`;let x=u>(e>0?n[e-1].answer:0);B.classList.toggle(`is-hot`,x||s),V.classList.toggle(`is-hot`,x||s),i||a?(S.textContent=`i = ${c} · 值 ${t.x}`,i?C.textContent=`二分：tails[${m}] = ${l[m]} ${t.goRight?`<`:`>=`} ${t.x}`:t.kind===`replace`?C.textContent=`${t.prevVal} 换成 ${t.x} —— 末尾更小`:C.textContent=`比所有末尾都大 —— 追加`,w.textContent=`tails 长度 = ${u}`):s?(S.textContent=`${o} 个元素处理完`,C.textContent=`tails 只是登记表，长度才是答案`,w.textContent=`答案 = ${u}`):(S.textContent=`换一套记账`,C.textContent=`tails[len] = 该长度下最小的末尾`,w.textContent=`答案 = tails 长度`),i?H.textContent=t.goRight?`tails[${m}] = ${l[m]} 太小，不可能成为「第一个 >= ${t.x}」的位置 —— 往右收`:`tails[${m}] = ${l[m]} 已经够大，而且左边也许有 —— 往左收`:a?H.textContent=t.kind===`replace`?`替换让「长度 ${g+1} 这一档」的末尾从 ${t.prevVal} 降到 ${t.x} —— 后面更容易接上`:`追加让答案从 ${g} 涨到 ${g+1} —— 这是唯一能让答案变大的动作`:s?H.textContent=`时间 O(n log n)、空间 O(n) —— 每个元素只做一次二分`:H.textContent=`tails 严格递增 —— 这个性质正是能二分的前提`,Z(U,t.desc)}c.appendChild(U);let W=Q();c.appendChild(W.root),e.textContent=``,e.appendChild(c),X();let G=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,K=$({steps:n,controls:W,intervalMs:zm,onRender:ee});K.jumpTo(Math.trunc(t.initialStep)||0);let te=null;return r&&!G&&typeof IntersectionObserver==`function`&&(te=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){te.disconnect(),te=null,K.play();return}},{threshold:.35}),te.observe(c)),{destroy(){te&&=(te.disconnect(),null),K.destroy(),e.textContent=``,delete e.dataset.lisbinMounted,document.getElementById(xm)?.remove()}}}var Um=`horse`,Wm=`ros`,Gm={match:`相同（不付钱）`,replace:`替换`,delete:`删除`,insert:`插入`};function Km(e,t){return Array.from(typeof e==`string`?e:t)}function qm(e,t,n,r,i){let a=e[n-1],o=t[r-1];if(i.match)return`a 的 「${a}」 和 b 的 「${o}」 一样 —— 这一对不用付钱，直接抄对角 dp[${n-1}][${r-1}] = ${i.diag}。另外两个邻居连看都不用看：它们各自至少要再收 1，永远赢不了。`;let s=[`替换：对角 ${i.diag} + 1 = ${i.diag+1}`,`删除：上方 ${i.up} + 1 = ${i.up+1}`,`插入：左方 ${i.left} + 1 = ${i.left+1}`],c=`最小的是${Gm[i.op]}，所以 dp[${n}][${r}] = ${i.value}。`;if(i.ties.length>1){let e=i.ties.map(e=>Gm[e]).join(` / `);c+=`（有 ${i.ties.length} 个方向并列最小：${e} —— 数值上一模一样，只有把操作序列打出来时才分得出高下。）`}return`a 的 「${a}」 对 b 的 「${o}」 不相同，三种收尾取最小：${s.join(`；`)}。${c}`}function Jm(e={}){let t=Km(e.word1,Um),n=Km(e.word2,Wm),r=t.length,i=n.length,a=[];for(let e=0;e<=r;e+=1)a.push(Array(i+1).fill(0));let o=[];for(let e=0;e<=i;e+=1)o.push(e);let s=[],c=(e,c,l,u)=>{s.push({phase:e,i:c,j:l,word1:t,word2:n,m:r,n:i,dp:a.map(e=>e.slice()),buf:o.slice(),bufBefore:null,charA:c!==null&&c>0?t[c-1]:null,charB:l!==null&&l>0?n[l-1]:null,op:null,ties:[],match:!1,diag:null,up:null,left:null,value:null,saved:null,answer:null,done:!1,desc:``,...u})};for(let e=0;e<=i;e+=1)a[0][e]=e;c(`init`,null,null,{desc:`先把第 0 行填成 0 … ${i}：空串变成 b 的前 j 个字符，只能一个字符一个字符地插入，代价恰好是 j。这一行不是凑数用的，它就是「前缀型 dp」的语义本身。滚动数组的初值就是这个第 0 行。`});for(let e=1;e<=r;e+=1){let r=o.slice(),s=a[e-1][0];a[e][0]=e,o[0]=e,c(`col`,e,0,{bufBefore:r,saved:s,diag:s,value:e,desc:`第 ${e} 行先补左边界：a 的前 ${e} 个字符要变成空串，只能全删掉，所以 dp[${e}][0] = ${e}。顺手把上一行的 dp[${e-1}][0] = ${s} 存进 prev —— 它是这一行第一格的对角，等下一格要用。`});for(let r=1;r<=i;r+=1){let i=o.slice(),l=o[r],u=a[e-1][r-1],d=a[e-1][r],f=a[e][r-1],p=t[e-1]===n[r-1],m=Math.min(u,d,f),h=[];u===m&&h.push(`replace`),d===m&&h.push(`delete`),f===m&&h.push(`insert`);let g=p?`match`:h[0],_=p?u:m+1;a[e][r]=_,o[r]=_,c(`cell`,e,r,{bufBefore:i,saved:s,diag:u,up:d,left:f,value:_,op:g,ties:h,match:p,desc:qm(t,n,e,r,{match:p,op:g,diag:u,up:d,left:f,value:_,ties:h})}),s=l}}return c(`done`,r,i,{value:a[r][i],answer:a[r][i],done:!0,desc:`右下角 dp[${r}][${i}] = ${a[r][i]} 就是答案：a 整个变成 b 最少要 ${a[r][i]} 步。注意只有右下角这一个格子是答案 —— 第一行是「空串长成 b」，第一列是「a 缩成空串」，它们只是把边界说清楚。`+(i>0?`另外：滚动数组跑到最后，buf 只留下最后一行，答案还是 buf[${i}] = ${a[r][i]}。`:``)}),s}var Ym=`editdist-styles`,Xm=880,Zm={match:`相同`,replace:`替换`,delete:`删除`,insert:`插入`},Qm={match:`ok`,replace:`sub`,delete:`del`,insert:`ins`},$m={replace:`is-sub`,delete:`is-del`,insert:`is-ins`},eh=e=>$m[e]||`is-sub`,th=`
.ed { display: flex; flex-direction: column; gap: 14px; }
.ed__svg { width: 100%; height: auto; display: block; }

.ed-note {
  fill: var(--ed-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.ed-banner__box {
  fill: var(--ed-banner, #f4f3ef);
  stroke: var(--ed-line, #c3c9c2);
  stroke-width: 1.5;
}
.ed-banner__seg {
  fill: var(--ed-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-banner__val {
  fill: var(--ed-gold, #c2872f);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.ed-hdr__text {
  fill: var(--ed-ink, #1f2a24);
  font-size: 14px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-hdr__idx {
  fill: var(--ed-dim, #9aa39c);
  font-size: 10px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-colhdr__text {
  fill: var(--ed-ink, #1f2a24);
  font-size: 13.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-colhdr__idx {
  fill: var(--ed-dim, #9aa39c);
  font-size: 9.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.ed-cell__box {
  fill: var(--ed-fill, #ffffff);
  stroke: var(--ed-line, #c3c9c2);
  stroke-width: 1.5;
}
.ed-cell__val {
  fill: var(--ed-ink, #1f2a24);
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-cell__op {
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-cell__op.is-sub { fill: var(--ed-diag, #c2872f); }
.ed-cell__op.is-del { fill: var(--ed-up, #3f6b57); }
.ed-cell__op.is-ins { fill: var(--ed-left, #a45f45); }
.ed-cell__op.is-ok { fill: var(--ed-ok, #3f6b57); }

/* ---- 通道一：底色（边界 / 本帧要填的格子） ---- */
.ed-cell.is-boundary .ed-cell__box {
  fill: var(--ed-dim-fill, #f6f5f1);
  stroke-dasharray: 4 3;
}
.ed-cell.is-boundary .ed-cell__val { fill: var(--ed-muted, #657168); }
/* 还没轮到的格子 */
.ed-cell.is-ghost .ed-cell__box {
  fill: none;
  stroke-dasharray: 3 3;
  stroke-width: 1.2;
}
.ed-cell.is-ghost .ed-cell__val { fill: var(--ed-dim, #9aa39c); }
/* 通道二：边框 —— 以下是本帧的主角与三个邻居，写在边界规则之后 = 故意覆盖 */
.ed-cell.is-cur .ed-cell__box {
  stroke: var(--ed-hot, #a45f45);
  stroke-width: 3;
}
.ed-cell.is-fresh .ed-cell__box {
  fill: var(--ed-gold-fill, #fdf3e3);
  stroke: var(--ed-gold, #c2872f);
  stroke-width: 3;
}
.ed-cell.is-match .ed-cell__box {
  fill: var(--ed-ok-fill, #eef5f1);
  stroke: var(--ed-ok, #3f6b57);
  stroke-width: 3;
}
/* 三个邻居按三种操作分色（本动画的语法） */
.ed-cell.is-nb-diag .ed-cell__box { stroke: var(--ed-diag, #c2872f); stroke-width: 2.5; }
.ed-cell.is-nb-up .ed-cell__box { stroke: var(--ed-up, #3f6b57); stroke-width: 2.5; }
.ed-cell.is-nb-left .ed-cell__box { stroke: var(--ed-left, #a45f45); stroke-width: 2.5; }
/* 胜出的那一项：再加粗 + 外环 */
.ed-cell.is-best .ed-cell__box { stroke-width: 4; }
/* 相同字符时，上方/左方完全不用看 */
.ed-cell.is-off { opacity: 0.4; }

.ed-ring {
  fill: none;
  stroke: var(--ed-gold, #c2872f);
  stroke-width: 2;
  stroke-dasharray: 5 4;
  opacity: 0;
}
.ed-ring.is-on { opacity: 1; }

.ed-legend__text {
  fill: var(--ed-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-phase__text {
  fill: var(--ed-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ---------- 画法二：滚动数组 ---------- */
.ed2-cell__box {
  fill: var(--ed-fill, #ffffff);
  stroke: var(--ed-line, #c3c9c2);
  stroke-width: 1.2;
}
.ed2-cell__val {
  fill: var(--ed-ink, #1f2a24);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed2-cell.is-blank .ed2-cell__box { fill: none; stroke-dasharray: 3 3; stroke-width: 1; }
.ed2-cell.is-blank .ed2-cell__val { fill: none; }
.ed2-cell.is-gone { opacity: 0.2; }
/* 上一行里已经被覆盖掉的部分 */
.ed2-cell.is-wiped { opacity: 0.4; }
.ed2-cell.is-wiped .ed2-cell__box { stroke-dasharray: 3 3; }
/* 对角是本画法的主角：虽然已被覆盖，也要从灰堆里跳出来（写在 is-wiped 之后 = 故意覆盖透明度） */
.ed2-cell.is-diag { opacity: 0.92; }
/* 还活在数组里的部分：上一行没被覆盖的 + 本行已写入的 */
.ed2-cell.is-alive .ed2-cell__box { fill: var(--ed-gold-fill, #fdf3e3); }
.ed2-cell.is-new .ed2-cell__box { fill: var(--ed-ok-fill, #eef5f1); }
/* 被覆盖掉的那一格就是对角 —— 本画法的主角 */
.ed2-cell.is-diag .ed2-cell__box { stroke: var(--ed-diag, #c2872f); stroke-width: 2.4; }
.ed2-cell.is-cur .ed2-cell__box { stroke: var(--ed-hot, #a45f45); stroke-width: 2.8; }

.ed2-buf__box {
  fill: var(--ed-fill, #ffffff);
  stroke: var(--ed-line, #c3c9c2);
  stroke-width: 1.5;
}
.ed2-buf__val {
  fill: var(--ed-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed2-buf__idx {
  fill: var(--ed-dim, #9aa39c);
  font-size: 10px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed2-buf.is-old .ed2-buf__box { fill: var(--ed-dim-fill, #f6f5f1); }
.ed2-buf.is-old .ed2-buf__val { fill: var(--ed-muted, #657168); }
.ed2-buf.is-new .ed2-buf__box { fill: var(--ed-ok-fill, #eef5f1); }
.ed2-buf.is-cur .ed2-buf__box { stroke: var(--ed-hot, #a45f45); stroke-width: 3; }

.ed2-tag {
  font-size: 11px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed2-tag.is-left { fill: var(--ed-left, #a45f45); }
.ed2-tag.is-up { fill: var(--ed-up, #3f6b57); }

.ed2-term__box {
  fill: var(--ed-banner, #f4f3ef);
  stroke: var(--ed-line, #c3c9c2);
  stroke-width: 1.4;
}
.ed2-term__box.is-sub { stroke: var(--ed-line, #c3c9c2); }
.ed2-term__main {
  fill: var(--ed-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed2-term__tag {
  font-size: 12px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed2-term__tag.is-sub { fill: var(--ed-diag, #c2872f); }
.ed2-term__tag.is-del { fill: var(--ed-up, #3f6b57); }
.ed2-term__tag.is-ins { fill: var(--ed-left, #a45f45); }
.ed2-term__note {
  fill: var(--ed-muted, #657168);
  font-size: 10.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular, Consolas, monospace';
}
/* 本帧取值范围里的那一项 */
.ed2-term.is-best .ed2-term__box { fill: var(--ed-gold-fill, #fdf3e3); }
.ed2-term.is-best.is-sub .ed2-term__box { stroke: var(--ed-diag, #c2872f); stroke-width: 2; }
.ed2-term.is-best.is-del .ed2-term__box { stroke: var(--ed-up, #3f6b57); stroke-width: 2; }
.ed2-term.is-best.is-ins .ed2-term__box { stroke: var(--ed-left, #a45f45); stroke-width: 2; }
/* 真正被选中的那一项（打平时可能有多项都最小） */
.ed2-term.is-pick .ed2-term__box { stroke-width: 3.4; }
.ed2-term.is-off { opacity: 0.42; }
.ed2-term.is-hidden { opacity: 0; }
`;function nh(){if(document.getElementById(Ym))return;let e=document.createElement(`style`);e.id=Ym,e.textContent=th,document.head.appendChild(e)}function rh(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function ih(e,t,n){return(r,i)=>e===`init`?r===0:e===`done`||r<t?!0:r===t?i<=n:!1}function ah(e,t,n,r){return Math.max(n,Math.min(r,Math.round(e/t)))}function oh(e,t=12,n=7){let r=0;for(let i of e)r+=/[\u3000-\u303f\u4e00-\u9fff\uff00-\uffef]/.test(i)?t:n;return r}function sh(e){return e.match||e.op===`replace`?[e.i-1,e.j-1]:e.op===`delete`?[e.i-1,e.j]:e.op===`insert`?[e.i,e.j-1]:null}function ch(e,t){let{m:n,n:r,word1:i,word2:a}=e[0],o=n+1,s=r+1,c=118;s*c+(s-1)*6>520&&(c=Math.max(26,Math.floor((520-(s-1)*6)/s)));let l=38;o*l+(o-1)*5>300&&(l=Math.max(18,Math.floor((300-(o-1)*5)/o)));let u=s*c+(s-1)*6,d=120+(o*l+(o-1)*5)+20,f=d+30,p=f+22,m=Math.max(68,(680-u)/2+8),h=e=>m+e*(c+6),g=e=>120+e*(l+5),_=ah(c,7.5,9,15),v=ah(l,4.2,7,9),y=l>=34,b=Y,x=b(`svg`,{class:`viz__svg ed__svg`,viewBox:`0 0 680 ${p}`,role:`img`,"aria-label":`编辑距离 二维动态规划推演动画`}),S=b(`g`,{class:`ed-marks`}),C=b(`g`,{class:`ed-cells`});x.appendChild(S),x.appendChild(C);let w=b(`text`,{class:`ed-note`,x:30,y:22});w.textContent=`dp[i][j] = a 的前 i 个字符 变成 b 的前 j 个字符 的最少操作数`,S.appendChild(w),S.appendChild(b(`rect`,{class:`ed-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let T=b(`text`,{class:`ed-banner__seg`,x:46,y:58}),E=b(`text`,{class:`ed-banner__seg`,x:218,y:58}),D=b(`text`,{class:`ed-banner__val`,x:634,y:58});S.appendChild(T),S.appendChild(E),S.appendChild(D);for(let e=0;e<=r;e+=1){let t=b(`text`,{class:`ed-colhdr__text`,x:h(e)+c/2,y:98});t.textContent=e===0?`""`:a[e-1];let n=b(`text`,{class:`ed-colhdr__idx`,x:h(e)+c/2,y:112});n.textContent=e===0?`j=0`:`j=${e}`,S.appendChild(t),S.appendChild(n)}for(let e=0;e<=n;e+=1){let t=b(`text`,{class:`ed-hdr__text`,x:m-16,y:g(e)+l/2});t.textContent=e===0?`""`:i[e-1];let n=b(`text`,{class:`ed-hdr__idx`,x:m-44,y:g(e)+l/2});n.textContent=e===0?`i=0`:`i=${e}`,S.appendChild(t),S.appendChild(n)}let O=[];for(let e=0;e<=n;e+=1){let t=[];for(let n=0;n<=r;n+=1){let r=b(`g`,{class:`ed-cell`});r.appendChild(b(`rect`,{class:`ed-cell__box`,x:h(n),y:g(e),width:c,height:l,rx:6}));let i=b(`text`,{class:`ed-cell__val`,x:h(n)+c/2,y:y?g(e)+l/2-6:g(e)+l/2,style:`font-size: ${_}px`});r.appendChild(i);let a=b(`text`,{class:`ed-cell__op`,x:h(n)+c/2,y:g(e)+l-9,style:`font-size: ${v}px`});y&&r.appendChild(a),C.appendChild(r),t.push({g:r,val:i,op:a})}O.push(t)}let k=b(`rect`,{class:`ed-ring`,x:0,y:0,width:c+10,height:l+10,rx:9});S.appendChild(k);let A=[{color:`--ed-diag, #c2872f`,text:`替换 = 对角`},{color:`--ed-up, #3f6b57`,text:`删除 = 上方`},{color:`--ed-left, #a45f45`,text:`插入 = 左方`}],j=(680-(A.reduce((e,t)=>e+17+oh(t.text)+34,0)-34))/2;for(let e of A){S.appendChild(b(`rect`,{x:j,y:d-5.5,width:11,height:11,rx:3,style:`fill: none; stroke: var(${e.color}); stroke-width: 2.5;`}));let t=b(`text`,{class:`ed-legend__text`,x:j+17,y:d});t.textContent=e.text,S.appendChild(t),j+=17+oh(e.text)+34}let M=b(`text`,{class:`ed-phase__text`,x:680/2,y:f});S.appendChild(M);function N(e,n){if(!n)return;let{phase:r,i,j:a,m:o,n:s,dp:c}=n,l=r===`done`,u=r===`cell`,d=ih(r,i,a),f=u?sh(n):null;O.forEach((e,t)=>{e.forEach((e,p)=>{let m=[`ed-cell`],h=d(t,p);if(h?(t===0||p===0)&&m.push(`is-boundary`):m.push(`is-ghost`),r===`init`&&t===0?m.push(`is-fresh`):r===`col`&&t===i&&p===0?m.push(`is-cur`):u&&t===i&&p===a?m.push(n.match?`is-match`:`is-fresh`):l&&t===o&&p===s&&m.push(`is-fresh`),u){let e=t===i-1&&p===a-1,r=t===i-1&&p===a,o=t===i&&p===a-1;e?m.push(`is-nb-diag`):r?m.push(`is-nb-up`):o&&m.push(`is-nb-left`),n.match&&(r||o)&&m.push(`is-off`),f&&f[0]===t&&f[1]===p&&m.push(`is-best`)}if(e.g.setAttribute(`class`,m.join(` `)),e.val.textContent=h?String(c[t][p]):``,y){let r=u&&t===i&&p===a;e.op.textContent=r&&Qm[n.op]||``,e.op.setAttribute(`class`,`ed-cell__op ${r?eh(n.op):``}`)}})}),f?(k.classList.add(`is-on`),k.setAttribute(`x`,h(f[1])-5),k.setAttribute(`y`,g(f[0])-5)):k.classList.remove(`is-on`),r===`init`?(T.textContent=`第 0 行`,E.textContent=`空串长成 b 的前 j 个字符`,D.textContent=`dp[0][j] = j`):r===`col`?(T.textContent=`i = ${i} · 第 0 列`,E.textContent=`a 的前 ${i} 个字符 缩成空串`,D.textContent=`dp[${i}][0] = ${i}`):u?(T.textContent=`i = ${i} · j = ${a}`,E.textContent=n.match?`'${n.charA}' = '${n.charB}' -> 抄对角`:`'${n.charA}' 对 '${n.charB}' -> 取${Zm[n.op]}`,D.textContent=`dp[${i}][${a}] = ${n.value}`):(T.textContent=`右下角那一格`,E.textContent=`dp[${o}][${s}] 就是答案`,D.textContent=`答案 = ${n.answer}`),r===`init`?M.textContent=`第 0 行 / 第 0 列不是算出来的，是语义规定的：空串变成 j 个字符 = 插入 j 次。`:r===`col`?M.textContent=`第 ${i} 行先把左边界补上 —— a 的前 ${i} 个字符要缩成空串，代价就是 ${i}。`:u?M.textContent=n.match?`对角 dp[${i-1}][${a-1}] = ${n.diag} 直接抄，不收钱 —— 另外两个邻居至少大 1，不用看。`:`对角 ${n.diag}+1 / 上方 ${n.up}+1 / 左方 ${n.left}+1 —— 取${Zm[n.op]}，dp[${i}][${a}] = ${n.value}。`:M.textContent=`时间 O(m·n)、空间 O(m·n) —— 追问多半接着来：能不能只留一行？`,Z(t,n.desc)}return{svgRoot:x,paint:N}}function lh(e,t){let{m:n,n:r,word1:i,word2:a,buf:o}=e[0],s=n+1,c=r+1,l=62;c*l+(c-1)*4>304&&(l=Math.max(20,Math.floor((304-(c-1)*4)/c)));let u=24;s*u+(s-1)*4>192&&(u=Math.max(13,Math.floor((192-(s-1)*4)/s)));let d=118+(s*u+(s-1)*4)+46,f=d+48+16,p=d+48+40,m=p+22,h=e=>78+e*(l+4),g=e=>118+e*(u+4),_=e=>78+e*(l+4),v=Y,y=v(`svg`,{class:`viz__svg ed__svg`,viewBox:`0 0 680 ${m}`,role:`img`,"aria-label":`编辑距离 滚动数组 O(n) 空间推演动画`}),b=v(`g`,{class:`ed2-marks`}),x=v(`g`,{class:`ed2-cells`}),S=v(`g`,{class:`ed2-panel`}),C=v(`g`,{class:`ed2-bufs`});y.appendChild(b),y.appendChild(x),y.appendChild(S),y.appendChild(C);let w=v(`text`,{class:`ed-note`,x:30,y:22});w.textContent=`同一张表，但只需要留一行 —— 每个格子只依赖「上一行」和「本行左邻」，唯一被覆盖掉的就是对角。`,b.appendChild(w),b.appendChild(v(`rect`,{class:`ed-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let T=v(`text`,{class:`ed-banner__seg`,x:46,y:58}),E=v(`text`,{class:`ed-banner__seg`,x:218,y:58}),D=v(`text`,{class:`ed-banner__val`,x:634,y:58});b.appendChild(T),b.appendChild(E),b.appendChild(D);for(let e=0;e<=r;e+=1){let t=v(`text`,{class:`ed-colhdr__text`,x:h(e)+l/2,y:106});t.textContent=e===0?`""`:a[e-1],b.appendChild(t)}for(let e=0;e<=n;e+=1){let t=v(`text`,{class:`ed-hdr__text`,x:64,y:g(e)+u/2});t.textContent=e===0?`""`:i[e-1],b.appendChild(t)}let O=[];for(let e=0;e<=n;e+=1){let t=[];for(let n=0;n<=r;n+=1){let r=v(`g`,{class:`ed2-cell`});r.appendChild(v(`rect`,{class:`ed2-cell__box`,x:h(n),y:g(e),width:l,height:u,rx:4}));let i=v(`text`,{class:`ed2-cell__val`,x:h(n)+l/2,y:g(e)+u/2});r.appendChild(i),x.appendChild(r),t.push({g:r,val:i})}O.push(t)}let k=[{op:`replace`,tag:`替换`},{op:`delete`,tag:`删除`},{op:`insert`,tag:`插入`}];k.forEach((e,t)=>{let n=118+t*57,r=v(`g`,{class:`ed2-term ${eh(e.op)}`}),i=v(`rect`,{class:`ed2-term__box`,x:356,y:n,width:294,height:46,rx:8}),a=v(`text`,{class:`ed2-term__main`,x:370,y:n+17}),o=v(`text`,{class:`ed2-term__tag ${eh(e.op)}`,x:636,y:n+17});o.textContent=e.tag;let s=v(`text`,{class:`ed2-term__note`,x:370,y:n+34});r.appendChild(i),r.appendChild(a),r.appendChild(o),r.appendChild(s),S.appendChild(r),e.g=r,e.main=a,e.noteT=s});let A=[];for(let e=0;e<=r;e+=1){let t=v(`g`,{class:`ed2-buf is-old`});t.appendChild(v(`rect`,{class:`ed2-buf__box`,x:_(e),y:d,width:l,height:48,rx:6}));let n=v(`text`,{class:`ed2-buf__val`,x:_(e)+l/2,y:d+48/2-6});t.appendChild(n);let r=v(`text`,{class:`ed2-buf__idx`,x:_(e)+l/2,y:d+48-11});r.textContent=`#${e}`,t.appendChild(r),C.appendChild(t),A.push({g:t,val:n})}let j=v(`text`,{class:`ed-note`,x:78,y:d-14});j.textContent=`buf —— 只留一行（长度 n+1 = ${r+1}）`,b.appendChild(j);let M=v(`text`,{class:`ed2-tag is-left`,x:0,y:f,opacity:0});M.textContent=`左方`;let N=v(`text`,{class:`ed2-tag is-up`,x:0,y:f,opacity:0});N.textContent=`上方`,b.appendChild(M),b.appendChild(N),b.appendChild(v(`rect`,{class:`ed2-term__box`,x:356,y:d,width:294,height:48,rx:8}));let P=v(`text`,{class:`ed2-term__main`,x:370,y:d+18}),F=v(`text`,{class:`ed2-term__note`,x:370,y:d+35});b.appendChild(P),b.appendChild(F);let I=v(`text`,{class:`ed-phase__text`,x:680/2,y:p});b.appendChild(I);function L(e,t){k.forEach((n,r)=>{n.g.setAttribute(`class`,r===0?`ed2-term ${eh(n.op)} is-best is-pick`:`ed2-term is-hidden`),r===0&&(n.main.textContent=e,n.noteT.textContent=t)})}function R(e,n){if(!n)return;let{phase:r,i,j:a,m:s,n:c,dp:u,buf:d}=n,f=r===`done`,p=r===`cell`,m=ih(r,i,a);if(O.forEach((e,t)=>{e.forEach((e,n)=>{let o=[`ed2-cell`],c=m(t,n),l=`blank`;c&&(l=r===`init`?`alive`:f?t===s?`alive`:`gone`:t<i?t<i-1?`gone`:n<a?`wiped`:`alive`:`new`),l!==`blank`&&o.push(`is-${l}`),p&&t===i-1&&n===a-1&&o.push(`is-diag`),(p||r===`col`)&&t===i&&n===a&&o.push(`is-cur`),e.g.setAttribute(`class`,o.join(` `)),e.val.textContent=c?String(u[t][n]):``})}),A.forEach((e,t)=>{let n=[`ed2-buf`];f||r===`init`?n.push(f?`is-new`:`is-old`):n.push(t<=a?`is-new`:`is-old`),p&&t===a&&n.push(`is-cur`),e.g.setAttribute(`class`,n.join(` `)),e.val.textContent=String(d[t])}),p?(M.setAttribute(`x`,_(a-1)+l/2),N.setAttribute(`x`,_(a)+l/2),M.setAttribute(`opacity`,`1`),N.setAttribute(`opacity`,`1`)):(M.setAttribute(`opacity`,`0`),N.setAttribute(`opacity`,`0`)),p){let e={replace:n.diag,delete:n.up,insert:n.left},t={replace:`dp[${i-1}][${a-1}]`,delete:`dp[${i-1}][${a}]`,insert:`dp[${i}][${a-1}]`},r={replace:n.match?`字符相同 —— 就是它`:`旧值已被覆盖，靠 prev 留了一份`,delete:n.match?`不用看（至少大 1）`:`写之前还躺在 buf[j] 里`,insert:n.match?`不用看（至少大 1）`:`本行刚写进 buf[j-1]`};for(let i of k){let a=n.match?i.op===`replace`:n.ties.includes(i.op),o=[`ed2-term`,eh(i.op)];a&&o.push(`is-best`),a&&i.op===n.op&&o.push(`is-pick`),n.match&&i.op!==`replace`&&o.push(`is-off`),i.g.setAttribute(`class`,o.join(` `)),i.main.textContent=`${t[i.op]} = ${e[i.op]}`,i.noteT.textContent=r[i.op]}P.textContent=`prev = ${n.saved}`,F.textContent=`上一行的对角，数组里那一格已经被覆盖`}else r===`init`?(L(`buf 初值 = [${o.join(`, `)}]`,`第 0 行直接当 buf 的初值 —— 不用算`),P.textContent=`prev 还没意义`,F.textContent=`第一行开始时才从 buf[0] 取出来`):r===`col`?(L(`buf[0] 改成 ${i}`,`dp[${i-1}][0] = ${n.saved} 先被取出来存进 prev`),P.textContent=`prev = ${n.saved}`,F.textContent=`第一格的对角已经拿到手了`):(L(`buf[${c}] = ${n.answer}`,`整个表只用了 n+1 个格子`),P.textContent=`答案 = buf[${c}]`,F.textContent=`左上那一角被丢掉了，答案还是对的`);r===`init`?(T.textContent=`第 0 行`,E.textContent=`直接就是 buf 的初值`,D.textContent=`buf = [${o.join(`, `)}]`):r===`col`?(T.textContent=`i = ${i} · 第 0 列`,E.textContent=`buf[0] 更新，旧的先存进 prev`,D.textContent=`buf[0] = ${i}`):p?(T.textContent=`i = ${i} · j = ${a}`,E.textContent=n.match?`'${n.charA}' 相同 -> 用 prev`:`取${Zm[n.op]} -> ${n.value}`,D.textContent=`buf[${a}] = ${n.value}`):(T.textContent=`跑完了`,E.textContent=`buf 就是最后一行`,D.textContent=`答案 = ${n.answer}`),r===`init`?I.textContent=`滚动数组的初值就是第 0 行 —— 空间从 m·n 个格子直接砍到 n+1 个。`:r===`col`?I.textContent=`每行开头都有一个坑：buf[0] 要先备份给 prev，改完就再也取不到旧值了。`:p?I.textContent=n.match?`对角 dp[${i-1}][${a-1}] 已经不在数组里了 —— prev = ${n.saved} 就是它。`:`上方在本行 buf[${a}] 里、左方是刚写的 buf[${a-1}] —— 只有对角必须靠 prev。`:I.textContent=`结论：只要推进顺序是「一行一行从左往右」，n+1 个格子就够 —— 答案还是 buf[n]。`,Z(t,n.desc)}return{svgRoot:y,paint:R}}function uh(e,t,n){if(!e||e.dataset.edMounted===`1`)return{destroy(){}};e.dataset.edMounted=`1`,nh();let r=Jm(t),i=r[0],a=document.createElement(`div`);a.className=`viz ed`;let o=document.createElement(`div`);o.className=`viz__stage`,a.appendChild(o);let s=rh();if(i.m===0&&i.n===0){let t=Y,n=t(`svg`,{class:`viz__svg ed__svg`,viewBox:`0 0 620 120`,role:`img`}),r=t(`text`,{x:310,y:60,style:`fill: var(--ed-muted, #657168); font-size: 14px; text-anchor: middle;`});return r.textContent=`两个都是空串 —— 一个操作都不用做，答案是 0`,n.appendChild(r),o.appendChild(n),a.appendChild(s),a.appendChild(Q().root),e.textContent=``,e.appendChild(a),X(),{destroy(){e.textContent=``,delete e.dataset.edMounted,document.getElementById(Ym)?.remove()}}}let c=n===`grid`?ch(r,s):lh(r,s);o.appendChild(c.svgRoot),a.appendChild(s);let l=Q();a.appendChild(l.root),e.textContent=``,e.appendChild(a),X();let u=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,d=$({steps:r,controls:l,intervalMs:Xm,onRender:(e,t)=>c.paint(e,t)});d.jumpTo(Math.trunc(t.initialStep)||0);let f=null;return t.autoplay!==!1&&!u&&typeof IntersectionObserver==`function`&&(f=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){f.disconnect(),f=null,d.play();return}},{threshold:.35}),f.observe(a)),{destroy(){f&&=(f.disconnect(),null),d.destroy(),e.textContent=``,delete e.dataset.edMounted,document.getElementById(Ym)?.remove()}}}function dh(e,t={}){return uh(e,t,`grid`)}function fh(e,t={}){return uh(e,t,`roll`)}var ph=10,mh=2147483647;function hh(e,t,n){let r=t[e-1],i=t[e-2],a=r+i,o=``;return n!==null&&a>n&&(o=` 注意：${a} 已经超过 int32 上限 ${n} —— 从这一阶起，Java 的 int 先于算法爆掉。`),`dp[${e}] = dp[${e-1}] + dp[${e-2}] = ${r} + ${i} = ${a}。前一类以 1 阶收尾、后一类以 2 阶收尾，互斥且完备，所以直接相加。${o}`}function gh(e={}){let t=Number.isInteger(e.n)&&e.n>=0?e.n:ph,n=e.int32Limit===null||e.int32Limit===void 0?null:Number(e.int32Limit)||mh,r=Array(t+1).fill(0);r[0]=1,t>=1&&(r[1]=1);let i=[],a=(e,a,o,s)=>{i.push({phase:e,i:a,from:o,n:t,limit:n,dp:r.slice(),value:null,over:!1,lastOk:null,answer:null,done:!1,desc:``,...s})};a(`init`,null,null,{desc:`dp[0] = 1：站在地面不动也算一种走法 —— 递推的起点；dp[1] = 1：只能迈一步。接下来每一阶的走法数，都只由它前面两阶决定。`});for(let e=2;e<=t;e+=1){a(`from1`,e,e-1,{desc:`到第 ${e} 阶的最后一步是「从第 ${e-1} 阶迈 1 阶」—— 这类走法数恰好等于到第 ${e-1} 阶的走法数：dp[${e-1}] = ${r[e-1]}。`}),a(`from2`,e,e-2,{desc:`另一类最后一步是「从第 ${e-2} 阶迈 2 阶」—— dp[${e-2}] = ${r[e-2]} 种。按最后一步分类：两类互斥（一步不可能既是 1 又是 2）、又覆盖所有可能，可以相加。`}),r[e]=r[e-1]+r[e-2];let t=n!==null&&r[e]>n;a(`settle`,e,null,{value:r[e],over:t,desc:hh(e,r,n)})}let o=null;if(n!==null)for(let e=0;e<=t;e+=1)r[e]<=n&&(o=e);return a(`done`,t,null,{value:r[t],answer:r[t],over:n!==null&&r[t]>n,lastOk:o,done:!0,desc:n===null?` 到第 ${t} 阶共有 ${r[t]} 种走法 —— 答案就是 dp[${t}]，它正是斐波那契数。`:` ways(${t}) = ${r[t]}。int32 在第 ${o===null?`-`:o+1} 阶就装不下了，int64 也只能撑到第 91 阶 —— 美团追问「n=80」真正考的是类型，不是算法。`}),i}var _h=`climb-styles`,vh=`
.climb { display: flex; flex-direction: column; gap: 14px; }
.climb__svg { width: 100%; height: auto; display: block; }

.climb-note {
  fill: var(--climb-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.climb-banner__box {
  fill: var(--climb-banner, #f4f3ef);
  stroke: var(--climb-line, #c3c9c2);
  stroke-width: 1.5;
}
.climb-banner__seg {
  fill: var(--climb-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climb-banner__val {
  fill: var(--climb-gold, #c2872f);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climb-banner__val.is-bad { fill: var(--climb-bad, #b3452e); }

.climb-cell__box {
  fill: var(--climb-fill, #ffffff);
  stroke: var(--climb-line, #c3c9c2);
  stroke-width: 1.5;
}
.climb-cell__val {
  fill: var(--climb-ink, #1f2a24);
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climb-cell__idx {
  fill: var(--climb-dim, #9aa39c);
  font-size: 9.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climb-cell.is-ghost .climb-cell__box { fill: none; stroke-dasharray: 3 3; stroke-width: 1.2; }
.climb-cell.is-ghost .climb-cell__val { fill: none; }
.climb-cell.is-cur .climb-cell__box { stroke: var(--climb-hot, #a45f45); stroke-width: 3; }
.climb-cell.is-fresh .climb-cell__box {
  fill: var(--climb-gold-fill, #fdf3e3);
  stroke: var(--climb-gold, #c2872f);
  stroke-width: 3;
}
.climb-cell.is-fresh .climb-cell__val { fill: var(--climb-gold, #c2872f); }
.climb-cell.is-over .climb-cell__box {
  fill: var(--climb-bad-fill, #f9ece8);
  stroke: var(--climb-bad, #b3452e);
  stroke-width: 2.5;
}
.climb-cell.is-over .climb-cell__val { fill: var(--climb-bad, #b3452e); }

.climb-arc {
  fill: none;
  stroke-width: 2.5;
  opacity: 0;
}
.climb-arc.is-on { opacity: 1; }
.climb-arc.is-one { stroke: var(--climb-ok, #3f6b57); }
.climb-arc.is-two { stroke: var(--climb-hot, #a45f45); }
.climb-arc__label {
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.climb-arc__label.is-on { opacity: 1; }
.climb-arc__label.is-one { fill: var(--climb-ok, #3f6b57); }
.climb-arc__label.is-two { fill: var(--climb-hot, #a45f45); }

.climb-sum {
  fill: var(--climb-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climb-sum.is-hot { fill: var(--climb-gold, #c2872f); }

.climb-limit {
  stroke: var(--climb-bad, #b3452e);
  stroke-width: 2;
  stroke-dasharray: 5 4;
}
.climb-limit__label {
  fill: var(--climb-bad, #b3452e);
  font-size: 12px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climb-readout {
  font-size: 21px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: var(--climb-ok, #3f6b57);
}
.climb-readout.is-bad { fill: var(--climb-bad, #b3452e); }
.climb-readout-sub {
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: var(--climb-muted, #657168);
}
.climb-readout-sub.is-bad { fill: var(--climb-bad, #b3452e); }

.climb-phase__text {
  fill: var(--climb-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function yh(){if(document.getElementById(_h))return;let e=document.createElement(`style`);e.id=_h,e.textContent=vh,document.head.appendChild(e)}function bh(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function xh(e,t,n,r,i,a,o){e.appendChild(n);let s=Q();e.appendChild(s.root),t.textContent=``,t.appendChild(e),X();let c=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,l=$({steps:r,controls:s,intervalMs:a.intervalMs||880,onRender:(e,t)=>i(e,t)});l.jumpTo(Math.trunc(a.initialStep)||0);let u=null;return a.autoplay!==!1&&!c&&typeof IntersectionObserver==`function`&&(u=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){u.disconnect(),u=null,l.play();return}},{threshold:.35}),u.observe(e)),{destroy(){u&&=(u.disconnect(),null),l.destroy(),t.textContent=``,delete t.dataset[o],document.getElementById(_h)?.remove()}}}function Sh(e,t){let{n}=e[0],r=n+1,i=48;r*i+(r-1)*6>624&&(i=Math.max(22,Math.floor((624-(r-1)*6)/r)));let a=r>12?4:6,o=(680-(r*i+(r-1)*a))/2,s=Math.max(9,Math.min(17,Math.round(i/3.4))),c=i>=34,l=e=>o+e*(i+a)+i/2,u=Y,d=u(`svg`,{class:`viz__svg climb__svg`,viewBox:`0 0 680 334`,role:`img`,"aria-label":`爬楼梯 动态规划填表动画`}),f=u(`g`,{class:`climb-marks`}),p=u(`g`,{class:`climb-cells`});d.appendChild(f),d.appendChild(p);let m=u(`text`,{class:`climb-note`,x:30,y:22});m.textContent=`dp[i] = dp[i-1] + dp[i-2] —— 最后一步只有「迈 1 阶」「迈 2 阶」两种来路`,f.appendChild(m),f.appendChild(u(`rect`,{class:`climb-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let h=u(`text`,{class:`climb-banner__seg`,x:46,y:58}),g=u(`text`,{class:`climb-banner__seg`,x:190,y:58}),_=u(`text`,{class:`climb-banner__val`,x:634,y:58});f.appendChild(h),f.appendChild(g),f.appendChild(_);let v=[];for(let e=0;e<=n;e+=1){let t=u(`g`,{class:`climb-cell`});t.appendChild(u(`rect`,{class:`climb-cell__box`,x:l(e)-i/2,y:128,width:i,height:56,rx:6}));let n=u(`text`,{class:`climb-cell__val`,x:l(e),y:c?150:156,style:`font-size: ${s}px`});if(t.appendChild(n),c){let n=u(`text`,{class:`climb-cell__idx`,x:l(e),y:173});n.textContent=`#${e}`,t.appendChild(n)}p.appendChild(t),v.push({g:t,val:n})}let y=(e,t,n,r)=>{let i=u(`path`,{class:`climb-arc ${e}`,d:``}),a=u(`text`,{class:`climb-arc__label ${e}`,x:0,y:0});return a.textContent=t,f.appendChild(i),f.appendChild(a),{path:i,label:a,draw(e,t){let o=l(e),s=l(t);i.setAttribute(`d`,`M ${o} 188 Q ${(o+s)/2} ${188+n*2} ${s} 188`),a.setAttribute(`x`,(o+s)/2),a.setAttribute(`y`,188+n+r)}}},b=y(`is-one`,``,26,8),x=y(`is-two`,``,62,8),S=u(`text`,{class:`climb-sum`,x:680/2,y:280});f.appendChild(S);let C=u(`text`,{class:`climb-phase__text`,x:680/2,y:312});f.appendChild(C);function w(e,n){if(!n)return;let{phase:r,i,from:a,dp:o,n:s}=n,c=r===`done`,l=r===`settle`;v.forEach((e,t)=>{let n=[`climb-cell`],u=r===`init`?t<=Math.min(1,s):c?!0:t<=i-1;u||n.push(`is-ghost`),l&&t===i?n.push(`is-fresh`):(r===`from1`||r===`from2`)&&t===i?n.push(`is-cur`):c&&t===s&&n.push(`is-fresh`),r===`from1`&&t===a&&n.push(`is-cur`),r===`from2`&&t===a&&n.push(`is-cur`),e.g.setAttribute(`class`,n.join(` `)),e.val.textContent=u?String(o[t]):``});let u=r===`from1`||r===`from2`||l,d=r===`from2`||l;b.path.classList.toggle(`is-on`,u),b.label.classList.toggle(`is-on`,u),x.path.classList.toggle(`is-on`,d),x.label.classList.toggle(`is-on`,d),u&&(b.draw(i-1,i),b.label.textContent=`迈 1 阶 · 带来 dp[${i-1}] = ${o[i-1]}`),d&&(x.draw(i-2,i),x.label.textContent=`迈 2 阶 · 带来 dp[${i-2}] = ${o[i-2]}`),S.textContent=l||c?`两类互斥且完备 -> 相加：dp[${i}] = ${o[i-1]} + ${o[i-2]} = ${o[i]}`:`按「最后一步的迈法」分类 —— 互斥且完备，所以是加法原理`,S.classList.toggle(`is-hot`,l||c),r===`init`?(h.textContent=`起点`,g.textContent=`dp[0] = 1（不动也算一种）· dp[1] = 1`,_.textContent=``):r===`from1`?(h.textContent=`第 ${i} 阶`,g.textContent=`来路一：从第 `+(i-1)+` 阶迈 1 阶`,_.textContent=`dp[${i-1}] = ${o[i-1]}`):r===`from2`?(h.textContent=`第 ${i} 阶`,g.textContent=`来路二：从第 `+(i-2)+` 阶迈 2 阶`,_.textContent=`dp[${i-2}] = ${o[i-2]}`):l?(h.textContent=`第 ${i} 阶`,g.textContent=`两类相加`,_.textContent=`dp[${i}] = ${o[i]}`):(h.textContent=`${s} 阶楼梯`,g.textContent=`每一阶都只由前两阶决定`,_.textContent=`答案 = ${n.answer}`),C.textContent=c?`dp[n] 就是斐波那契数 —— ways(n) = Fib(n+1)。想知道 O(log n) 的算法，用矩阵快速幂。`:l?`dp[${i}] 定型。注意 dp[i] 之前的值再也不会被用到两次以上 —— 每个格子只算一次。`:`「无后效性」：第 ${i} 阶之后的走法不会改变前面的计数 —— 所以可以从左往右一路填。`,Z(t,n.desc)}return{svgRoot:d,paint:w}}function Ch(e,t){let{n,limit:r}=e[0],i=n+1,a=Math.max(5,Math.floor((608-(i-1)*2)/i)),o=(680-(i*a+(i-1)*2))/2,s=e=>o+e*(a+2)+a/2,c=Y,l=c(`svg`,{class:`viz__svg climb__svg`,viewBox:`0 0 680 314`,role:`img`,"aria-label":`爬楼梯 int32 溢出演示动画`}),u=c(`g`,{class:`climb-marks`}),d=c(`g`,{class:`climb-cells`});l.appendChild(u),l.appendChild(d);let f=c(`text`,{class:`climb-note`,x:30,y:22});f.textContent=`每一格是一阶楼梯的走法数 —— 颜色 = 这个数装不装得进 int32`,u.appendChild(f),u.appendChild(c(`rect`,{class:`climb-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let p=c(`text`,{class:`climb-banner__seg`,x:46,y:58}),m=c(`text`,{class:`climb-banner__seg`,x:168,y:58}),h=c(`text`,{class:`climb-banner__val`,x:634,y:58});u.appendChild(p),u.appendChild(m),u.appendChild(h);let g=[];for(let e=0;e<=n;e+=1){let t=c(`g`,{class:`climb-cell`});t.appendChild(c(`rect`,{class:`climb-cell__box`,x:s(e)-a/2,y:118,width:a,height:34,rx:2})),d.appendChild(t),g.push({g:t})}let _=e[e.length-1].dp,v=0;for(let e=0;e<=n;e+=1)_[e]<=r&&(v=e);let y=o+(v+1)*(a+2)-2/2;u.appendChild(c(`line`,{class:`climb-limit`,x1:y,y1:106,x2:y,y2:162}));let b=c(`text`,{class:`climb-limit__label`,x:y-8,y:94});b.textContent=`int32 上限 ${r} —— 左边装得下，右边爆`,u.appendChild(b);let x=c(`text`,{class:`climb-readout`,x:680/2,y:208});u.appendChild(x);let S=c(`text`,{class:`climb-readout-sub`,x:680/2,y:240});u.appendChild(S);let C=c(`text`,{class:`climb-phase__text`,x:680/2,y:292});u.appendChild(C);function w(e,i){if(!i)return;let{phase:a,i:o,dp:s}=i,c=a===`done`;g.forEach((e,t)=>{let i=[`climb-cell`];(a===`init`?t<=1:t<=(c?n:o-1))?i.push(s[t]>r?`is-over`:`is-fresh`):i.push(`is-ghost`),e.g.setAttribute(`class`,i.join(` `))});let l=c?n:o,u=s[l],d=u>r;x.textContent=`ways(${l}) = ${u}`,x.setAttribute(`class`,`climb-readout ${d?`is-bad`:``}`),S.textContent=d?`> int32 上限 ${r} —— Java 的 int 在这一阶就已经是负数了`:`<= int32 上限 ${r}，还装得下`,S.setAttribute(`class`,`climb-readout-sub ${d?`is-bad`:``}`),a===`init`?(p.textContent=`起点`,m.textContent=`ways(0)=1 · ways(1)=1`,h.textContent=``):c?(p.textContent=`${n} 阶`,m.textContent=`int64 也只能撑到 ways(91)`,h.textContent=`ways(${n}) = ${u}`):(p.textContent=`第 ${l} 阶`,m.textContent=d?`装不下了`:`还能装下`,h.textContent=`ways(${l}) = ${u}`),h.setAttribute(`class`,`climb-banner__val ${d?`is-bad`:``}`),C.textContent=c?`int64 撑到 ways(91)；ways(92) 就爆 —— JS 的 Number 更早，ways(78) 起丢整数精度。`:`增长是乘性的（约 1.618 倍每阶）—— 类型宽度是线性的，追不上。`,Z(t,i.desc)}return{svgRoot:l,paint:w}}function wh(e,t,n,r){if(!e||e.dataset[r]===`1`)return{destroy(){}};e.dataset[r]=`1`,yh();let i=gh(t),a=document.createElement(`div`);a.className=`viz climb`;let o=document.createElement(`div`);o.className=`viz__stage`,a.appendChild(o);let s=bh(),c=n===`fill`?Sh(i,s):Ch(i,s);return o.appendChild(c.svgRoot),xh(a,e,s,i,(e,t)=>c.paint(e,t),t,r)}function Th(e,t={}){return wh(e,t,`fill`,`climbMounted`)}function Eh(e,t={}){return wh(e,{n:50,int32Limit:2147483647,...t},`overflow`,`climbOverMounted`)}var Dh=6;function Oh(e={}){let t=Number.isInteger(e.n)&&e.n>=2?e.n:Dh,n=[],r=new Map,i=0,a=(e,t,o)=>{let s=r.get(e)||0;r.set(e,s+1);let c=e<2;c&&(i+=1),n.push({idx:n.length,value:e,depth:t,path:o,dup:s>0,leaf:c,ord:s,distinct:r.size}),e>=2&&(a(e-1,t+1,o+`L`),a(e-2,t+1,o+`R`))};a(t,0,``);let o=[],s=0;for(let e of n)e.dup&&(s+=1),o.push({phase:`call`,n:t,node:e,revealed:n.slice(0,e.idx+1),stackPath:e.path,calls:e.idx+1,dupCalls:s,distinct:e.distinct,answer:null,done:!1,desc:``});o.push({phase:`done`,n:t,node:null,revealed:n.slice(),stackPath:``,calls:n.length,dupCalls:s,distinct:r.size,leaves:i,answer:null,done:!0,desc:``});for(let e=0;e<o.length;e+=1){let a=o[e];if(a.phase===`done`){a.desc=`整棵递归树 ${n.length} 个节点、${i} 个叶子（叶子数 = ways(${t})）。其中只有 ${r.size} 个不同的 k —— f(2) 被从头算了 ${r.get(2)||0} 次，f(0) ${r.get(0)||0} 次。记忆化之后，同样的信息只需要 ${t+1} 个格子、${t+1} 次加法。`;continue}let{value:s,depth:c,dup:l,idx:u,ord:d}=a.node;a.desc=l?`第 ${u+1} 次调用 f(${s}) —— 这是第 ${d+1} 次算它，前 ${d} 次全白算：它下面挂着一整棵相同的子树，每次都要重长一遍。`:`第 ${u+1} 次调用 f(${s})（深度 ${c}）。`+(s>=2?`它要先等 f(${s-1}) 和 f(${s-2}) 回来。`:`叶子：直接返回 1。`)}return o}var kh=`climbrec-styles`,Ah=620,jh=`
.climbrec { display: flex; flex-direction: column; gap: 14px; }
.climbrec__svg { width: 100%; height: auto; display: block; }

.climbrec-note {
  fill: var(--climbrec-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.climbrec-banner__box {
  fill: var(--climbrec-banner, #f4f3ef);
  stroke: var(--climbrec-line, #c3c9c2);
  stroke-width: 1.5;
}
.climbrec-banner__seg {
  fill: var(--climbrec-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climbrec-banner__val {
  fill: var(--climbrec-bad, #b3452e);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.climbrec-edge {
  stroke: var(--climbrec-line, #c3c9c2);
  stroke-width: 1.5;
  fill: none;
}
.climbrec-edge.is-on { stroke: var(--climbrec-dim2, #aab3ab); }

.climbrec-node__circle {
  fill: var(--climbrec-fill, #ffffff);
  stroke: var(--climbrec-line, #c3c9c2);
  stroke-width: 1.5;
  opacity: 0;
}
.climbrec-node__text {
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.climbrec-node.is-on .climbrec-node__circle { opacity: 1; }
.climbrec-node.is-on .climbrec-node__text { opacity: 1; }
/* 首次出现的值：绿 */
.climbrec-node.is-new .climbrec-node__circle {
  stroke: var(--climbrec-ok, #3f6b57);
  fill: var(--climbrec-ok-fill, #eef5f1);
}
.climbrec-node.is-new .climbrec-node__text { fill: var(--climbrec-ok, #3f6b57); }
/* 重复子问题：红 —— 这张图的主角 */
.climbrec-node.is-dup .climbrec-node__circle {
  stroke: var(--climbrec-bad, #b3452e);
  stroke-width: 2.5;
  fill: var(--climbrec-bad-fill, #f9ece8);
}
.climbrec-node.is-dup .climbrec-node__text { fill: var(--climbrec-bad, #b3452e); }
/* 本帧的主角：橙 + 外环（外环挂在 labelLayer，不在节点的 g 里，所以用 .is-on 单独控制） */
.climbrec-node.is-cur .climbrec-node__circle { stroke: var(--climbrec-hot, #a45f45); stroke-width: 3.5; }
.climbrec-node__ring {
  opacity: 0;
  fill: none;
  stroke: var(--climbrec-hot, #a45f45);
  stroke-width: 2;
  stroke-dasharray: 4 3;
}
.climbrec-node__ring.is-on { opacity: 1; }

.climbrec-stats {
  fill: var(--climbrec-ink, #1f2a24);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.climbrec-stack {
  fill: var(--climbrec-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.climbrec-phase__text {
  fill: var(--climbrec-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function Mh(){if(document.getElementById(kh))return;let e=document.createElement(`style`);e.id=kh,e.textContent=jh,document.head.appendChild(e)}function Nh(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function Ph(e){let t=[],n=0,r=(e,i,a)=>{let o=t.length;return t.push({idx:o,value:e,depth:i,parent:a,x:0,y:0,col:null}),e>=2?(r(e-1,i+1,o),r(e-2,i+1,o)):(t[o].col=n,n+=1),o};r(e,0,-1);let i=e=>{let n=t[e];if(n.col!==null)return n.col;let r=t.filter(t=>t.parent===e);return n.col=(i(r[0].idx)+i(r[1].idx))/2,n.col};i(0);let a=n,o=Math.max(30,Math.min(48,620/a)),s=Math.min(70,340/Math.max(1,Math.max(...t.map(e=>e.depth)))),c=Math.max(11,Math.min(17,o/2.9));for(let e of t)e.x=30+e.col*o+o/2,e.y=108+e.depth*s;return{nodes:t,W:680,R:c,treeBottom:108+Math.max(...t.map(e=>e.depth))*s+c,leafCount:a,LEAF_STEP:o}}function Fh(e,t={}){if(!e||e.dataset.climbRecMounted===`1`)return{destroy(){}};e.dataset.climbRecMounted=`1`,Mh();let n=Oh(t),r=n[0],i=Ph(r.n),a=new Map(i.nodes.map(e=>[e.idx,e])),o=i.W,s=i.treeBottom+34,c=s+26,l=c+30,u=l+22,d=document.createElement(`div`);d.className=`viz climbrec`;let f=document.createElement(`div`);f.className=`viz__stage`,d.appendChild(f);let p=Nh(),m=Y,h=m(`svg`,{class:`viz__svg climbrec__svg`,viewBox:`0 0 ${o} ${u}`,role:`img`,"aria-label":`爬楼梯 朴素递归树展开动画`}),g=m(`g`,{class:`climbrec-edges`}),_=m(`g`,{class:`climbrec-nodes`}),v=m(`g`,{class:`climbrec-labels`});h.appendChild(g),h.appendChild(_),h.appendChild(v),f.appendChild(h);let y=m(`text`,{class:`climbrec-note`,x:30,y:22});y.textContent=`f(k) = f(k-1) + f(k-2)，不带记忆化 —— 前序 DFS 的真实执行顺序`,v.appendChild(y),v.appendChild(m(`rect`,{class:`climbrec-banner__box`,x:30,y:38,width:o-60,height:40,rx:9}));let b=m(`text`,{class:`climbrec-banner__seg`,x:46,y:58}),x=m(`text`,{class:`climbrec-banner__seg`,x:176,y:58}),S=m(`text`,{class:`climbrec-banner__val`,x:o-46,y:58});v.appendChild(b),v.appendChild(x),v.appendChild(S);let C=i.nodes.map(e=>{let t=m(`path`,{class:`climbrec-edge`,d:``});return g.appendChild(t),t}),w=i.nodes.map(e=>{let t=m(`g`,{class:`climbrec-node`}),n=m(`circle`,{class:`climbrec-node__circle`,cx:e.x,cy:e.y,r:i.R}),r=m(`text`,{class:`climbrec-node__text`,x:e.x,y:e.y,style:`font-size: ${Math.round(i.R*1.15)}px`});r.textContent=String(e.value);let a=m(`circle`,{class:`climbrec-node__ring`,cx:e.x,cy:e.y,r:i.R+5});return t.appendChild(n),t.appendChild(r),_.appendChild(t),a.remove(),v.appendChild(a),{g:t,circle:n,text:r,ring:a}}),T=m(`text`,{class:`climbrec-stats`,x:o/2,y:s});v.appendChild(T);let E=m(`text`,{class:`climbrec-stack`,x:30,y:c});v.appendChild(E);let D=m(`text`,{class:`climbrec-phase__text`,x:o/2,y:l});v.appendChild(D);function O(e,t){if(!t)return;let n=t.phase===`done`,o=t.node;C.forEach((e,n)=>{let r=i.nodes[n],o=r.parent>=0&&t.revealed.length>r.parent,s=t.revealed.length>n;if(e.classList.toggle(`is-on`,o&&s),o&&s){let t=a.get(r.parent);e.setAttribute(`d`,`M ${t.x} ${t.y+i.R} L ${r.x} ${r.y-i.R}`)}}),w.forEach((e,n)=>{let r=t.revealed.length>n,i=[`climbrec-node`];if(r){i.push(`is-on`);let e=t.revealed[n];i.push(e.dup?`is-dup`:`is-new`),o&&n===o.idx&&i.push(`is-cur`)}e.g.setAttribute(`class`,i.join(` `)),e.ring.classList.remove(`is-on`)}),o&&w[o.idx].ring.classList.add(`is-on`);let s=T;if(s.textContent=`已调用 ${t.calls} 次，其中重复 ${t.dupCalls} 次，不同的 k 只有 ${t.distinct} 个`,o){let e=[r.n],t=r.n;for(let n of o.path)t+=n===`L`?-1:-2,e.push(t);E.textContent=`调用栈：${e.join(` -> `)}`,E.setAttribute(`opacity`,`1`)}else E.setAttribute(`opacity`,`0`);n?(b.textContent=`f(${r.n}) 展开`,x.textContent=`${t.calls} 个节点里只有 ${t.distinct} 个不同的 k`,S.textContent=`重复 ${t.dupCalls} 次`):(b.textContent=`第 ${t.calls} 次调用`,x.textContent=o&&o.dup?`f(${o.value}) 是重复子问题`:`f(${o?o.value:``}) 第一次出现`,S.textContent=`重复 ${t.dupCalls} 次`),D.textContent=n?`加一个 memo 数组，同样的信息只需要 n+1 个格子 —— 这就是从 2^n 到 O(n) 的全部内容。`:`每棵重复的子树都要从头重长一遍 —— 计数是乘性的，这就是 2^n 的来源。`,Z(p,t.desc)}d.appendChild(p);let k=Q();d.appendChild(k.root),e.textContent=``,e.appendChild(d),X();let A=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,j=$({steps:n,controls:k,intervalMs:Ah,onRender:(e,t)=>O(e,t)});j.jumpTo(Math.trunc(t.initialStep)||0);let M=null;return t.autoplay!==!1&&!A&&typeof IntersectionObserver==`function`&&(M=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){M.disconnect(),M=null,j.play();return}},{threshold:.35}),M.observe(d)),{destroy(){M&&=(M.disconnect(),null),j.destroy(),e.textContent=``,delete e.dataset.climbRecMounted,document.getElementById(kh)?.remove()}}}function Ih(e,t={}){return Fh(e,t)}var Lh=[{op:`push`,val:-2},{op:`push`,val:0},{op:`push`,val:-3},{op:`getMin`},{op:`pop`},{op:`top`},{op:`getMin`}],Rh={push:e=>`push(${e})`,pop:()=>`pop()`,top:()=>`top()`,getMin:()=>`getMin()`};function zh(e={}){let t=Array.isArray(e.ops)&&e.ops.length>0?e.ops.map(e=>({...e})):Lh.map(e=>({...e})),n=[],r=(e,r,o={})=>{n.push({phase:e,desc:r,ops:t,opIdx:null,main:i.slice(),mins:a.slice(),minPushed:!1,popped:null,minPopped:null,result:null,done:e===`done`,...o})},i=[],a=[];r(`init`,`设计一个栈，在 \`push\` / \`pop\` / \`top\` 之外还要支持 \`getMin\` —— 取栈内**最小元素**，且 \`getMin\` 必须是 \`O(1)\`。难点：栈只能看到栈顶，最小值可能埋在任意一层；每次现扫是 \`O(n)\`。思路：**最小值是历史，必须按层存** —— 开一个辅助栈，主栈每进一个元素，辅助栈同步记下"这一刻全栈的最小值"。于是辅助栈顶恒等于全栈最小值，\`getMin\` 直接读栈顶；\`pop\` 时两栈一起弹，**旧的最小值自动恢复**。操作序列：\`${t.map(e=>Rh[e.op](e.val)).join(` → `)}\`。`,{main:[],mins:[]});for(let e=0;e<t.length;e+=1){let n=t[e];if(n.op===`push`){let t=Number(n.val),o=a.length>0?a[a.length-1]:null,s=a.length===0||t<=o;i.push(t),s&&a.push(t);let c=a[a.length-1];r(`push`,`**\`push(${t})\`**：主栈压入 \`${t}\`。辅助栈判据 \`x <= 当前最小值\`${o===null?`（辅助栈为空）`:`（栈顶 \`${o}\`）`}：`+(s?`\`${t}\` ${o===null?`是第一个元素`:`不比当前最小值 \`${o}\` 大`} —— 压入辅助栈，记录"**${t} 入栈这一刻**，全栈最小值是 \`${c}\`"。`:`\`${t} > ${o}\`，它入栈后最小值没变 —— 辅助栈**不压**（留空档）。此刻全栈最小值仍是 \`${c}\`。`)+`主栈（底→顶）\`[${i.join(`, `)}]\`，辅助栈 \`[${a.join(`, `)}]\`。`,{opIdx:e,minPushed:s,result:null});continue}if(n.op===`pop`){if(i.length===0){r(`pop`,"**`pop()`**：栈已空，无操作。",{opIdx:e});continue}let t=i.pop(),n=null;a.length>0&&a[a.length-1]===t&&(n=a.pop());let o=a.length>0?a[a.length-1]:null;r(`pop`,`**\`pop()\`**：主栈弹出栈顶 \`${t}\`。`+(n===null?`\`${t}\` 不是当前最小值（辅助栈顶是 \`${a[a.length-1]}\`），辅助栈**不动** —— 它入栈时就没压过，弹它不影响最小值。`:`它**正是**辅助栈顶 \`${n}\`（说明它入栈时就是当时的最小值）—— 两栈同步弹出，栈里**恢复出更早的最小值 \`${o}\`** —— 这就是"按层存历史"的意义：pop 之后要回到过去，旧最小值必须本来就存着。`)+`主栈 \`[${i.join(`, `)}]\`，辅助栈 \`[${a.join(`, `)}]\`。`,{opIdx:e,popped:t,minPopped:n});continue}if(n.op===`top`){let t=i.length>0?i[i.length-1]:null;r(`top`,`**\`top()\`**：读主栈栈顶 \`${t}\`（空栈返回 \`null\`）。栈的本职工作，\`O(1)\`。`,{opIdx:e,result:t});continue}if(n.op===`getMin`){let t=a.length>0?a[a.length-1]:null;r(`getMin`,`**\`getMin()\` → \`${t}\`**：直接读辅助栈顶 —— \`O(1)\`。辅助栈顶恒等于 \`min(主栈全体)\`（不变量，见说明），所以这一步**不需要扫主栈**。`,{opIdx:e,result:t});continue}r(`push`,`未知操作 \`${n.op}\`，跳过。`,{opIdx:e})}let o=a.length>0?a[a.length-1]:null;return r(`done`,`七个操作走完：主栈 \`[${i.join(`, `)}]\`，辅助栈 \`[${a.join(`, `)}]\`，当前最小值 \`${o}\`。四个操作全 \`O(1)\`，代价是辅助栈的 \`O(n)\` 空间 —— 用空间换"记住历史"。两个要点：① 辅助栈存的是"**每一刻**的最小值"，不是"最小值本身"，所以 pop 能恢复过去；② 压入判据是 \`<=\`（相等也压）—— 用 \`<\` 会在重复最小值 pop 后提前弹空。`,{done:!0}),n}var Bh=`minstack-styles`,Vh=54,Hh=84,Uh=46,Wh=336,Gh=46,Kh=84,qh=362,Jh=388,Yh=1250,Xh=`
.msv {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.msv__svg { width: 100%; height: auto; display: block; }

.msv-note {
  fill: var(--msv-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.msv-banner__box {
  fill: var(--msv-banner, #f4f3ef);
  stroke: var(--msv-line, #c3c9c2);
  stroke-width: 1.5;
}
.msv-banner__op {
  fill: var(--msv-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.msv-banner__ret {
  fill: var(--msv-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.msv-cell__box {
  fill: var(--msv-fill, #ffffff);
  stroke: var(--msv-line, #c3c9c2);
  stroke-width: 1.5;
}
.msv-cell__val {
  fill: var(--msv-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.msv-cell__sub {
  fill: var(--msv-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 栈顶（当前可读）：绿框 */
.msv-cell.is-top .msv-cell__box {
  stroke: var(--msv-ok, #3f6b57);
  stroke-width: 3;
}
.msv-cell.is-top .msv-cell__val { fill: var(--msv-ok, #3f6b57); }
/* 本帧新压入：金框 */
.msv-cell.is-fresh .msv-cell__box {
  fill: var(--msv-gold-fill, #fdf3e3);
  stroke: var(--msv-gold, #c2872f);
  stroke-width: 3;
}
.msv-cell.is-fresh .msv-cell__val { fill: var(--msv-gold, #c2872f); }
/* 本帧弹出：虚线幽灵（留在原高度上方，看得见"历史"） */
.msv-cell.is-ghost .msv-cell__box {
  fill: none;
  stroke: var(--msv-hot, #a45f45);
  stroke-dasharray: 4 3;
  stroke-width: 2.5;
}
.msv-cell.is-ghost .msv-cell__val { fill: var(--msv-hot, #a45f45); }
.msv-cell.is-ghost .msv-cell__sub { fill: var(--msv-hot, #a45f45); }
/* 辅助栈里被同步弹出的幽灵 */
.msv-cell.is-minghost .msv-cell__box {
  fill: none;
  stroke: var(--msv-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.5;
}
.msv-cell.is-minghost .msv-cell__val { fill: var(--msv-dim, #9aa39c); }

.msv-label {
  fill: var(--msv-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.msv-floor {
  stroke: var(--msv-line, #c3c9c2);
  stroke-width: 2;
}
.msv-arrow {
  stroke: var(--msv-hot, #a45f45);
  stroke-width: 2;
  fill: none;
}
.msv-arrow__head { fill: var(--msv-hot, #a45f45); stroke: none; }
.msv-arrow__text {
  fill: var(--msv-hot, #a45f45);
  font-size: 11.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.msv-phase__text {
  fill: var(--msv-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function Zh(){if(document.getElementById(Bh))return;let e=document.createElement(`style`);e.id=Bh,e.textContent=Xh,document.head.appendChild(e)}function Qh(e,t={}){if(!e||e.dataset.minstackMounted===`1`)return{destroy(){}};e.dataset.minstackMounted=`1`,Zh();let n=zh(t),r=t.autoplay!==!1,i=n[0].ops,a=Y,o=document.createElement(`div`);o.className=`viz msv`;let s=document.createElement(`div`);s.className=`viz__stage`,o.appendChild(s);let c=Math.max(1,...n.map(e=>e.main.length)),l=Math.max(1,...n.map(e=>e.mins.length)),u=a(`svg`,{class:`viz__svg msv__svg`,viewBox:`0 0 660 412`,role:`img`,"aria-label":`最小栈 辅助栈推演动画`});s.appendChild(u);let d=a(`g`,{class:`msv-cells`}),f=a(`g`,{class:`msv-marks`});u.appendChild(d),u.appendChild(f);let p=a(`text`,{class:`msv-note`,x:26,y:Vh});p.textContent=`最小值是历史：辅助栈每层记「这一刻全栈的最小值」—— pop 后自动恢复过去`,f.appendChild(p),f.appendChild(a(`rect`,{class:`msv-banner__box`,x:26,y:Hh,width:608,height:Uh,rx:9}));let m=a(`text`,{class:`msv-banner__op`,x:44,y:107}),h=a(`text`,{class:`msv-banner__ret`,x:616,y:107});f.appendChild(m),f.appendChild(h),f.appendChild(a(`line`,{class:`msv-floor`,x1:220-Kh/2-10,y1:Wh,x2:272,y2:Wh})),f.appendChild(a(`line`,{class:`msv-floor`,x1:440-Kh/2-10,y1:Wh,x2:492,y2:Wh}));let g=a(`text`,{class:`msv-label`,x:220,y:qh});g.textContent=`main 主栈`;let _=a(`text`,{class:`msv-label`,x:440,y:qh});_.textContent=`mins 辅助栈`,f.appendChild(g),f.appendChild(_);let v=(e,t)=>{let n=[];for(let r=0;r<=t;r+=1){let t=a(`g`,{class:`msv-cell`}),i=Wh-(r+1)*52,o=a(`rect`,{class:`msv-cell__box`,x:e-Kh/2,y:i,width:Kh,height:Gh,rx:6});t.appendChild(o);let s=a(`text`,{class:`msv-cell__val`,x:e,y:i+Gh/2-5});t.appendChild(s);let c=a(`text`,{class:`msv-cell__sub`,x:e,y:i+Gh-9});t.appendChild(c),d.appendChild(t),n.push({g:t,val:s,sub:c})}return n},y=v(220,c),b=v(440,l),x=a(`g`,{class:`msv-sync`}),S=a(`line`,{class:`msv-arrow`,x1:268,y1:0,x2:440-Kh/2-14,y2:0}),C=a(`path`,{class:`msv-arrow__head`,d:``}),w=a(`text`,{class:`msv-arrow__text`,x:660/2,y:0});x.appendChild(S),x.appendChild(C),x.appendChild(w),f.appendChild(x);let T=a(`text`,{class:`msv-phase__text`,x:660/2,y:Jh});f.appendChild(T);let E=document.createElement(`p`);E.className=`viz__desc`,E.setAttribute(`aria-live`,`polite`);function D(e,t,n,r,i,a){e.forEach((e,o)=>{let s=[`msv-cell`];o<t.length?(e.val.textContent=String(t[o]),e.sub.textContent=o===0?`bottom`:`#${o}`,o===n&&s.push(`is-top`),o===r&&s.push(`is-fresh`)):o===i?(e.val.textContent=a,e.sub.textContent=`弹出`,s.push(`is-ghost`)):(e.val.textContent=``,e.sub.textContent=``,s.push(`is-minghost`)),e.g.setAttribute(`class`,s.join(` `))})}function O(e,t){if(!t)return;let n=t.main,r=t.mins,a=n.length-1,o=r.length-1,s=t.phase===`push`,c=t.phase===`pop`;if(D(y,n,a,s?a:-1,c?n.length:-1,c?String(t.popped):``),D(b,r,o,s&&t.minPushed?o:-1,c&&t.minPopped!==null?r.length:-1,c&&t.minPopped!==null?String(t.minPopped):``),s&&t.minPushed||c&&t.minPopped!==null){let e=Wh-(r.length+ +!s)*52+Gh/2;S.setAttribute(`y1`,e),S.setAttribute(`y2`,e),S.setAttribute(`x2`,440-Kh/2-10),C.setAttribute(`d`,`M ${440-Kh/2-4} ${e} L ${440-Kh/2-13} ${e-5} L ${440-Kh/2-13} ${e+5} Z`),w.setAttribute(`y`,e-12),w.textContent=s?`同步压入`:`同步弹出`,x.style.opacity=`1`}else x.style.opacity=`0`;let l=t.opIdx===null?null:i[t.opIdx];t.phase===`init`?(m.textContent=`最小栈：getMin 要求 O(1)`,h.textContent=``):t.phase===`done`?(m.textContent=`${i.length} 个操作完成`,h.textContent=`min=${r.length>0?r[r.length-1]:`∅`}`):l&&(m.textContent=l.op===`push`?`push(${l.val})`:`${l.op}()`,t.result!==null&&t.result!==void 0?h.textContent=`→ ${t.result}`:c?h.textContent=`弹 ${t.popped}${t.minPopped===null?``:` · 同步弹 min`}`:h.textContent=``),s?T.textContent=t.minPushed?`x <= 当前最小值 → 辅助栈同步压入，记录这一刻的历史`:`x > 当前最小值 → 辅助栈留空档，历史没变化`:c?T.textContent=t.minPopped===null?`弹出的不是最小值 → 辅助栈不动，最小值不变`:`弹出的是当前最小值 → 两栈同步弹，旧最小值自动恢复`:t.phase===`getMin`?T.textContent=`getMin = 读辅助栈顶 —— O(1)，不扫主栈`:t.phase===`top`?T.textContent=`top = 读主栈顶 —— 栈的本职工作`:t.phase===`init`?T.textContent=`栈只见栈顶，最小值却在任意一层 —— 所以按层存`:T.textContent=`四个操作全 O(1) —— 用辅助栈的 O(n) 空间换「记住历史」`,Z(E,t.desc)}o.appendChild(E);let k=Q();o.appendChild(k.root),e.textContent=``,e.appendChild(o),X();let A=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,j=$({steps:n,controls:k,intervalMs:Yh,onRender:O});j.jumpTo(Math.trunc(t.initialStep)||0);let M=null;return r&&!A&&typeof IntersectionObserver==`function`&&(M=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){M.disconnect(),M=null,j.play();return}},{threshold:.35}),M.observe(o)),{destroy(){M&&=(M.disconnect(),null),j.destroy(),e.textContent=``,delete e.dataset.minstackMounted,document.getElementById(Bh)?.remove()}}}var $h=[{op:`push`,val:1},{op:`push`,val:2},{op:`push`,val:3},{op:`pop`},{op:`peek`},{op:`pop`},{op:`push`,val:4},{op:`pop`},{op:`pop`}],eg={push:e=>`push(${e})`,pop:()=>`pop()`,peek:()=>`peek()`,empty:()=>`empty()`};function tg(e={}){let t=Array.isArray(e.ops)&&e.ops.length>0?e.ops.map(e=>({...e})):$h.map(e=>({...e})),n=[],r=[],i=[],a=[],o=0,s=(e,s,c={})=>{n.push({phase:e,desc:s,ops:t,opIdx:null,inn:r.slice(),out:i.slice(),moved:null,result:null,queueOut:a.slice(),transfers:o,done:e===`done`,...c})};s(`init`,`用两个栈实现队列：支持 \`push\` / \`pop\` / \`peek\`，要求 FIFO。栈是 LIFO，方向正好相反 —— 但"相反"翻**两次**就是原样：进 \`in\` 栈倒一次，整摞翻进 \`out\` 栈再倒一次，\`out\` 顶就是最早来的。正确性的钉子：**只有 \`out\` 空了才搬运** —— 搬一半的顺序是坏的。操作序列：\`${t.map(e=>eg[e.op](e.val)).join(` → `)}\`。`);for(let e=0;e<t.length;e+=1){let n=t[e];if(n.op===`push`){let t=Number(n.val);r.push(t),s(`push`,`**\`push(${t})\`**：直接压进 \`in\` 栈顶 —— \`O(1)\`，\`out\` 不动。此时 \`in\`（底→顶）\`[${r.join(`, `)}]\`，\`out\` \`[${i.join(`, `)}]\`。`+(i.length>0?`注意 \`out\` 里还留着旧的 \`${i.join(`、`)}\` —— 它们**先于** ${t} 入队，必须等 \`out\` 清空才轮到新元素，所以现在**绝不能搬**。`:"（`out` 为空，新元素排在队尾。）"),{opIdx:e});continue}if(n.op===`pop`||n.op===`peek`){let t=n.op===`pop`;if(r.length===0&&i.length===0){s(t?`pop`:`peek`,`**\`${n.op}()\`**：队列已空，返回 \`null\`。`,{opIdx:e,result:null});continue}if(i.length===0)for(s(`transfer`,`**\`${n.op}()\`** 要取队首，但 \`out\` 空了 —— 触发搬运：把 \`in\` 整摞 \`[${r.join(`, `)}]\`（顶在右）逐个弹出、压进 \`out\`。翻完之后 \`out\` 顶就是**最早入队**的元素 —— 两次反转，方向转正。`,{opIdx:e});r.length>0;){let t=r.pop();i.push(t),o+=1,s(`transfer`,`搬运：\`in\` 弹出 \`${t}\` → 压入 \`out\`。此刻 \`in\` \`[${r.join(`, `)}]\`，\`out\` \`[${i.join(`, `)}]\`（顶 = \`${i[i.length-1]}\` = 队首）。这是 \`${t}\` 一生**唯一一次**搬运。`,{opIdx:e,moved:t})}let c=i[i.length-1];t&&(i.pop(),a.push(c)),s(t?`pop`:`peek`,`**\`${n.op}()\` → \`${c}\`**：${t?`\`out\` 弹出栈顶 \`${c}\`，记入出队序列 \`[${a.join(`, `)}]\``:`读 \`out\` 栈顶 \`${c}\`，**不弹出** —— 它就是队首`}。`+(i.length>0?` \`out\` 还剩 \`[${i.join(`, `)}]\`（顶 \`${i[i.length-1]}\` 是下一个队首）—— 消费只动 \`out\`，\`in\` 里新来的元素**插不了队**。`:" `out` 空了 —— 下次 `pop` 再触发搬运（或队列真的空了）。")+" 单次 `O(1)`（搬运已提前付掉）。",{opIdx:e,result:c});continue}if(n.op===`empty`){s(`pop`,`**\`empty()\` → \`${r.length===0&&i.length===0}\`**：两栈皆空即队列空。`,{opIdx:e});continue}s(`push`,`未知操作 \`${n.op}\`，跳过。`,{opIdx:e})}let c=t.filter(e=>e.op===`push`).map(e=>e.val).join(`,`);return s(`done`,`${t.length} 个操作走完，出队序列 \`[${a.join(`, `)}]\` —— 正好是入队顺序 \`${c}\`，FIFO 成立。账本：\`${a.length}\` 次 pop 总共只搬了 \`${o}\` 次 —— 每个元素**一生最多被搬一次**，所以 \`n\` 次操作总花费 \`O(n)\`，**均摊 \`O(1)\`**（单次最坏 \`O(n)\`：那一次恰好触发搬运）。两个钉子：① 搬运必须**整摞**翻，且只在 \`out\` 空时发生；② \`pop\`/\`peek\` 只动 \`out\` —— 旧的一摞没消费完，新的一摞绝不插队。`,{done:!0}),n}var ng=`qstacks-styles`,rg=54,ig=84,ag=46,og=322,sg=44,cg=78,lg=346,ug=372,dg=40,fg=440,pg=1050,mg=`
.qsv {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.qsv__svg { width: 100%; height: auto; display: block; }

.qsv-note {
  fill: var(--qsv-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.qsv-banner__box {
  fill: var(--qsv-banner, #f4f3ef);
  stroke: var(--qsv-line, #c3c9c2);
  stroke-width: 1.5;
}
.qsv-banner__op {
  fill: var(--qsv-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.qsv-banner__ret {
  fill: var(--qsv-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.qsv-cell__box {
  fill: var(--qsv-fill, #ffffff);
  stroke: var(--qsv-line, #c3c9c2);
  stroke-width: 1.5;
}
.qsv-cell__val {
  fill: var(--qsv-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.qsv-cell__sub {
  fill: var(--qsv-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.qsv-cell.is-top .qsv-cell__box {
  stroke: var(--qsv-ok, #3f6b57);
  stroke-width: 3;
}
.qsv-cell.is-top .qsv-cell__val { fill: var(--qsv-ok, #3f6b57); }
.qsv-cell.is-fresh .qsv-cell__box {
  fill: var(--qsv-gold-fill, #fdf3e3);
  stroke: var(--qsv-gold, #c2872f);
  stroke-width: 3;
}
.qsv-cell.is-fresh .qsv-cell__val { fill: var(--qsv-gold, #c2872f); }
.qsv-cell.is-ghost .qsv-cell__box {
  fill: none;
  stroke: var(--qsv-hot, #a45f45);
  stroke-dasharray: 4 3;
  stroke-width: 2.5;
}
.qsv-cell.is-ghost .qsv-cell__val { fill: var(--qsv-hot, #a45f45); }
.qsv-cell.is-ghost .qsv-cell__sub { fill: var(--qsv-hot, #a45f45); }
.qsv-cell.is-empty .qsv-cell__box {
  fill: none;
  stroke: var(--qsv-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.2;
}
.qsv-cell.is-outq .qsv-cell__box {
  fill: var(--qsv-ok-fill, #eef5f1);
  stroke: var(--qsv-ok, #3f6b57);
  stroke-width: 2;
}
.qsv-cell.is-outq .qsv-cell__val { fill: var(--qsv-ok, #3f6b57); }
.qsv-cell.is-freshq .qsv-cell__box {
  fill: var(--qsv-gold-fill, #fdf3e3);
  stroke: var(--qsv-gold, #c2872f);
  stroke-width: 3;
}
.qsv-cell.is-freshq .qsv-cell__val { fill: var(--qsv-gold, #c2872f); }

.qsv-label {
  fill: var(--qsv-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.qsv-floor {
  stroke: var(--qsv-line, #c3c9c2);
  stroke-width: 2;
}
.qsv-arrow {
  stroke: var(--qsv-hot, #a45f45);
  stroke-width: 2;
  fill: none;
}
.qsv-arrow__head { fill: var(--qsv-hot, #a45f45); stroke: none; }
.qsv-arrow__text {
  fill: var(--qsv-hot, #a45f45);
  font-size: 11.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.qsv-phase__text {
  fill: var(--qsv-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function hg(){if(document.getElementById(ng))return;let e=document.createElement(`style`);e.id=ng,e.textContent=mg,document.head.appendChild(e)}function gg(e,t={}){if(!e||e.dataset.qstacksMounted===`1`)return{destroy(){}};e.dataset.qstacksMounted=`1`,hg();let n=tg(t),r=t.autoplay!==!1,i=n[0],a=i.ops,o=Y,s=document.createElement(`div`);s.className=`viz qsv`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=Math.max(1,...n.map(e=>e.inn.length)),u=Math.max(1,...n.map(e=>e.out.length)),d=Math.max(1,i.queueOut.length,...n.map(e=>e.queueOut.length)),f=o(`svg`,{class:`viz__svg qsv__svg`,viewBox:`0 0 660 464`,role:`img`,"aria-label":`用栈实现队列 双栈推演动画`});c.appendChild(f);let p=o(`g`,{class:`qsv-cells`}),m=o(`g`,{class:`qsv-marks`});f.appendChild(p),f.appendChild(m);let h=o(`text`,{class:`qsv-note`,x:26,y:rg});h.textContent=`两次反转 = 正序：进 in 倒一次，整摞翻进 out 再倒一次 —— out 顶就是队首`,m.appendChild(h),m.appendChild(o(`rect`,{class:`qsv-banner__box`,x:26,y:ig,width:608,height:ag,rx:9}));let g=o(`text`,{class:`qsv-banner__op`,x:44,y:107}),_=o(`text`,{class:`qsv-banner__ret`,x:616,y:107});m.appendChild(g),m.appendChild(_),m.appendChild(o(`line`,{class:`qsv-floor`,x1:210-cg/2-10,y1:og,x2:259,y2:og})),m.appendChild(o(`line`,{class:`qsv-floor`,x1:450-cg/2-10,y1:og,x2:499,y2:og}));let v=o(`text`,{class:`qsv-label`,x:210,y:lg});v.textContent=`in 栈（进队）`;let y=o(`text`,{class:`qsv-label`,x:450,y:lg});y.textContent=`out 栈（出队）`,m.appendChild(v),m.appendChild(y);let b=(e,t)=>{let n=[];for(let r=0;r<=t;r+=1){let t=o(`g`,{class:`qsv-cell`}),i=og-(r+1)*50,a=o(`rect`,{class:`qsv-cell__box`,x:e-cg/2,y:i,width:cg,height:sg,rx:6});t.appendChild(a);let s=o(`text`,{class:`qsv-cell__val`,x:e,y:i+sg/2-5});t.appendChild(s);let c=o(`text`,{class:`qsv-cell__sub`,x:e,y:i+sg-9});t.appendChild(c),p.appendChild(t),n.push({g:t,val:s,sub:c})}return n},x=b(210,l),S=b(450,u),C=o(`g`,{class:`qsv-transfer`}),w=o(`line`,{class:`qsv-arrow`,x1:0,y1:0,x2:0,y2:0}),T=o(`path`,{class:`qsv-arrow__head`,d:``}),E=o(`text`,{class:`qsv-arrow__text`,x:660/2,y:0});C.appendChild(w),C.appendChild(T),C.appendChild(E),m.appendChild(C);let D=o(`text`,{class:`qsv-label`,x:40,y:392});D.textContent=`出队`,m.appendChild(D);let O=[],k=660/2-(d*54+(d-1)*6)/2;for(let e=0;e<d;e+=1){let t=o(`g`,{class:`qsv-cell`}),n=k+e*60,r=o(`rect`,{class:`qsv-cell__box`,x:n,y:ug,width:54,height:dg,rx:6});t.appendChild(r);let i=o(`text`,{class:`qsv-cell__val`,x:n+54/2,y:392});t.appendChild(i),p.appendChild(t),O.push({g:t,val:i})}let A=o(`text`,{class:`qsv-phase__text`,x:660/2,y:fg});m.appendChild(A);let j=document.createElement(`p`);j.className=`viz__desc`,j.setAttribute(`aria-live`,`polite`);function M(e,t,n,r,i,a){e.forEach((e,o)=>{let s=[`qsv-cell`];o<t.length?(e.val.textContent=String(t[o]),e.sub.textContent=o===0?`bottom`:`#${o}`,o===n&&s.push(`is-top`),o===r&&s.push(`is-fresh`)):o===i?(e.val.textContent=a,e.sub.textContent=`弹出`,s.push(`is-ghost`)):(e.val.textContent=``,e.sub.textContent=``,s.push(`is-empty`)),e.g.setAttribute(`class`,s.join(` `))})}function N(e,t){if(!t)return;let n=t.inn,r=t.out,i=t.phase===`transfer`,o=i&&t.moved!==null,s=i&&t.moved===null,c=t.phase===`pop`,l=t.phase===`peek`;if(M(x,n,n.length-1,t.phase===`push`?n.length-1:-1,o?n.length:-1,o?String(t.moved):``),M(S,r,r.length-1,o?r.length-1:-1,-1,``),i){let e=o?og-r.length*50+sg/2:og-(n.length+1)*50+sg/2;w.setAttribute(`x1`,255),w.setAttribute(`y1`,e),w.setAttribute(`x2`,450-cg/2-10),w.setAttribute(`y2`,e),T.setAttribute(`d`,`M ${450-cg/2-4} ${e} L ${450-cg/2-13} ${e-5} L ${450-cg/2-13} ${e+5} Z`),E.setAttribute(`y`,e-12),E.textContent=o?`in 顶 → out 顶`:`整摞翻！`,C.style.opacity=`1`}else C.style.opacity=`0`;let u=t.queueOut;O.forEach((e,n)=>{let r=[`qsv-cell`];n<u.length?(e.val.textContent=String(u[n]),r.push(c&&t.result!==null&&n===u.length-1?`is-freshq`:`is-outq`)):(e.val.textContent=``,r.push(`is-empty`)),e.g.setAttribute(`class`,r.join(` `))});let d=t.opIdx===null?null:a[t.opIdx];t.phase===`init`?(g.textContent=`双栈队列：栈 LIFO 翻两次 = FIFO`,_.textContent=``):t.phase===`done`?(g.textContent=`${a.length} 个操作完成 · 共搬运 ${t.transfers} 次`,_.textContent=`[${t.queueOut.join(`,`)}]`):d&&(g.textContent=d.op===`push`?`push(${d.val})`:`${d.op}()`,s?_.textContent=`out 空 → 触发搬运`:o?_.textContent=`翻 ${t.moved}`:c||l?_.textContent=`→ ${t.result}`:_.textContent=``),t.phase===`push`?A.textContent=t.out.length>0?`push 只进 in —— out 还有存货，绝不搬运（旧元素没消费完）`:`push 只进 in，O(1) —— out 空，新元素排在队尾`:s?A.textContent=`out 空了才搬运 —— 且必须整摞翻，搬一半的顺序是坏的`:o?A.textContent=`in 顶弹出、压入 out 顶 —— 每个元素一生最多搬这一次`:c||l?A.textContent=l?`peek 只读 out 顶不弹出 —— 队首就是 out 顶`:`pop 只动 out —— 旧的一摞没消费完，新的一摞绝不插队`:t.phase===`init`?A.textContent=`进 in 倒一次，翻进 out 再倒一次 —— 方向转正`:A.textContent=`出队序列 = 入队序列 —— FIFO 成立；n 次操作 O(n)，均摊 O(1)`,Z(j,t.desc)}s.appendChild(j);let P=Q();s.appendChild(P.root),e.textContent=``,e.appendChild(s),X();let F=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,I=$({steps:n,controls:P,intervalMs:pg,onRender:N});I.jumpTo(Math.trunc(t.initialStep)||0);let L=null;return r&&!F&&typeof IntersectionObserver==`function`&&(L=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){L.disconnect(),L=null,I.play();return}},{threshold:.35}),L.observe(s)),{destroy(){L&&=(L.disconnect(),null),I.destroy(),e.textContent=``,delete e.dataset.qstacksMounted,document.getElementById(ng)?.remove()}}}var _g=`1 + 2 - (3 + 4) - 5`;function vg(e){let t=[],n=0;for(;n<e.length;){let r=e[n];if(r===` `){n+=1;continue}if(r>=`0`&&r<=`9`){let r=n;for(;r<e.length&&e[r]>=`0`&&e[r]<=`9`;)r+=1;t.push(e.slice(n,r)),n=r;continue}t.push(r),n+=1}return t}function yg(e={}){let t=typeof e.expr==`string`&&e.expr.trim()!==``?e.expr:_g,n=vg(t),r=[],i=0,a=1,o=[],s=(e,s,c={})=>{r.push({phase:e,desc:s,expr:t,tokens:n,pos:null,token:null,result:i,prev:i,sign:a,stack:o.map(e=>({...e})),value:null,contribution:null,pushed:null,popped:null,inner:null,done:e===`done`,...c})};s(`init`,`表达式 \`${t}\` 只含数字、\`+\`、\`-\`、括号 —— **没有优先级要处理**（加减同级、左结合）。所以不用双栈、不用调度场：一个累计值 \`result\`、一个符号 \`sign\` 从左到右扫就够。唯一的麻烦是**括号**：\`-\`(3+4)\` 里整个括号要**乘以前面的负号**并回外层。办法：看到 \`(\` 就把「**外层累计值 + 括号外符号**」这对上下文压栈、进括号重启累加器；看到 \`)\` 弹栈合并 \`result = 外层result + 外层sign * 括号内值\`。这就是 LC 20 的括号配对长了算术能力 —— 栈照旧存"没闭合的上一层"，只是那层从"等哪个右括号"升级成"等一个数值"。`,{result:0,prev:0,sign:1,stack:[]});for(let e=0;e<n.length;e+=1){let t=n[e];if(t>=`0`&&t<=`9`){let n=Number(t),r=a*n,o=i;i+=r,s(`number`,`**\`${t}\`**：数字带着当前符号入账 —— \`result += sign * ${n}\` = \`${o}\` + \`${r}\` = \`${i}\`。同级左结合意味着数字**没有资格等待**：符号已定，立刻结算进累计值。`,{pos:e,token:t,prev:o,value:n,contribution:r});continue}if(t===`+`||t===`-`){a=t===`+`?1:-1,s(`sign`,`**\`${t}\`**：只是给**下一个数字**登记符号 \`sign = ${a}\`，累计值不动（\`${i}\`）。加减同级，所以这个符号不需要和任何"栈顶运算符"比优先级 —— 直接覆盖即可。`,{pos:e,token:t});continue}if(t===`(`){let n={result:i,sign:a};o.push({result:i,sign:a});let r=i;i=0,a=1,s(`open`,`**\`(\`**：进入新括号层。把上下文 \`{result: ${n.result}, sign: ${n.sign>0?`+1`:`-1`}}\` 压栈 —— 记的是"**外层已累计多少**"和"**这个括号整体该乘什么符号**"。然后重启一个干净的累加器：\`result = 0\`、\`sign = +1\`。`,{pos:e,token:t,prev:r,pushed:n});continue}if(t===`)`){let n=i,r=o.pop(),a=i;i=r.result+r.sign*n,s(`close`,`**\`)\`**：括号内算完，\`inner = ${n}\`。弹栈合并：\`result = ${r.result} + (${r.sign>0?`+`:`-`}1) * ${n} = ${i}\` —— 括号作为一个**整体数值**、乘上括号外的符号，并回外层累计值。一层上下文就此闭合。`,{pos:e,token:t,prev:a,inner:n,popped:r});continue}s(`sign`,`未知 token \`${t}\`，跳过。`,{pos:e,token:t})}return s(`done`,`扫完：\`${t}\` = **\`${i}\`**。全程只有一个累计值 + 一个符号，栈仅在括号进出时动 —— 空间 \`O(括号嵌套深度)\`，时间 \`O(n)\`。两个要点：① 加减同级左结合，数字来一个结一个，**不需要运算符栈**；② 栈存的不是中间结果本身，是"**外层欠账**"：外层累计 + 括号符号，闭合时一并清算。`,{done:!0}),r}var bg=`basiccalc-styles`,xg=40,Sg=62,Cg=34,wg=42,Tg=4,Eg=108,Dg=132,Og=64,kg=336,Ag=40,jg=168,Mg=360,Ng=386,Pg=1250,Fg=`
.bcv { display: flex; flex-direction: column; gap: 14px; }
.bcv__svg { width: 100%; height: auto; display: block; }

.bcv-note {
  fill: var(--bcv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-tok__box {
  fill: var(--bcv-fill, #ffffff);
  stroke: var(--bcv-line, #c3c9c2); stroke-width: 1.5;
}
.bcv-tok__val {
  fill: var(--bcv-ink, #1f2a24);
  font-size: 15px; font-weight: 700; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-tok.is-past .bcv-tok__box { fill: var(--bcv-past, #eef0ec); stroke: var(--bcv-past-line, #d8ddd6); }
.bcv-tok.is-past .bcv-tok__val { fill: var(--bcv-dim, #9aa39c); }
.bcv-tok.is-now .bcv-tok__box {
  fill: var(--bcv-gold-fill, #fdf3e3); stroke: var(--bcv-gold, #c2872f); stroke-width: 3;
}
.bcv-tok.is-now .bcv-tok__val { fill: var(--bcv-gold, #c2872f); }
.bcv-pointer { fill: var(--bcv-gold, #c2872f); }

.bcv-panel__box {
  fill: var(--bcv-banner, #f4f3ef); stroke: var(--bcv-line, #c3c9c2); stroke-width: 1.5;
}
.bcv-panel__label {
  fill: var(--bcv-muted, #657168); font-size: 12px; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-panel__num {
  fill: var(--bcv-ink, #1f2a24); font-size: 24px; font-weight: 800;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-panel__num.is-fresh { fill: var(--bcv-gold, #c2872f); }
.bcv-panel__num.is-final { fill: var(--bcv-ok, #3f6b57); }
.bcv-panel__op {
  fill: var(--bcv-dim, #9aa39c); font-size: 16px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-panel__formula {
  fill: var(--bcv-hot, #a45f45); font-size: 12.5px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.bcv-cell__box {
  fill: var(--bcv-fill, #ffffff); stroke: var(--bcv-line, #c3c9c2); stroke-width: 1.5;
}
.bcv-cell__val {
  fill: var(--bcv-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-cell.is-top .bcv-cell__box { stroke: var(--bcv-ok, #3f6b57); stroke-width: 3; }
.bcv-cell.is-fresh .bcv-cell__box {
  fill: var(--bcv-gold-fill, #fdf3e3); stroke: var(--bcv-gold, #c2872f); stroke-width: 3;
}
.bcv-cell.is-fresh .bcv-cell__val { fill: var(--bcv-gold, #c2872f); }
.bcv-cell.is-ghost .bcv-cell__box {
  fill: none; stroke: var(--bcv-hot, #a45f45); stroke-dasharray: 4 3; stroke-width: 2.5;
}
.bcv-cell.is-ghost .bcv-cell__val { fill: var(--bcv-hot, #a45f45); }

.bcv-label {
  fill: var(--bcv-muted, #657168); font-size: 12.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-floor { stroke: var(--bcv-line, #c3c9c2); stroke-width: 2; }
.bcv-phase__text {
  fill: var(--bcv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function Ig(){if(document.getElementById(bg))return;let e=document.createElement(`style`);e.id=bg,e.textContent=Fg,document.head.appendChild(e)}var Lg=e=>e>0?`+1`:`-1`;function Rg(e,t={}){if(!e||e.dataset.basiccalcMounted===`1`)return{destroy(){}};e.dataset.basiccalcMounted=`1`,Ig();let n=yg(t),r=t.autoplay!==!1,i=n[0].tokens,a=Y,o=document.createElement(`div`);o.className=`viz bcv`;let s=document.createElement(`div`);s.className=`viz__stage`,o.appendChild(s);let c=a(`svg`,{class:`viz__svg bcv__svg`,viewBox:`0 0 660 408`,role:`img`,"aria-label":`基本计算器 LC224 推演动画`});s.appendChild(c);let l=a(`g`,{}),u=a(`g`,{}),d=a(`g`,{});c.appendChild(l),c.appendChild(u),c.appendChild(d);let f=a(`text`,{class:`bcv-note`,x:26,y:xg});f.textContent=`栈存的不是数字，是「外层欠账」：括号前的累计值 + 括号的符号`,d.appendChild(f);let p=i.length*46-Tg,m=Math.max(26,(660-p)/2),h=i.map((e,t)=>{let n=m+t*46,r=a(`g`,{class:`bcv-tok`});r.appendChild(a(`rect`,{class:`bcv-tok__box`,x:n,y:Sg,width:wg,height:Cg,rx:6}));let i=a(`text`,{class:`bcv-tok__val`,x:n+wg/2,y:79});return i.textContent=e,r.appendChild(i),l.appendChild(r),{g:r,x:n}}),g=a(`path`,{class:`bcv-pointer`,d:``});d.appendChild(g),d.appendChild(a(`rect`,{class:`bcv-panel__box`,x:26,y:Dg,width:608,height:Og,rx:9}));let _=a(`text`,{class:`bcv-panel__label`,x:130,y:148});_.textContent=`sign（下一个数字的符号）`;let v=a(`text`,{class:`bcv-panel__num`,x:130,y:172}),y=a(`text`,{class:`bcv-panel__op`,x:232,y:172});y.textContent=`result =`;let b=a(`text`,{class:`bcv-panel__num`,x:320,y:172}),x=a(`text`,{class:`bcv-panel__formula`,x:440,y:172});d.append(_,v,y,b,x);let S=Math.max(1,...n.map(e=>e.stack.length));d.appendChild(a(`line`,{class:`bcv-floor`,x1:330-jg/2-10,y1:kg,x2:424,y2:kg}));let C=a(`text`,{class:`bcv-label`,x:330,y:Mg});C.textContent=`括号上下文栈 {外层result, 括号sign}`,d.appendChild(C);let w=[];for(let e=0;e<=S;e+=1){let t=a(`g`,{class:`bcv-cell`}),n=kg-(e+1)*46;t.appendChild(a(`rect`,{class:`bcv-cell__box`,x:330-jg/2,y:n,width:jg,height:Ag,rx:6}));let r=a(`text`,{class:`bcv-cell__val`,x:330,y:n+Ag/2});t.appendChild(r),u.appendChild(t),w.push({g:t,val:r})}let T=a(`text`,{class:`bcv-phase__text`,x:660/2,y:Ng});d.appendChild(T);let E=document.createElement(`p`);E.className=`viz__desc`,E.setAttribute(`aria-live`,`polite`);function D(e,t){if(!t)return;if(h.forEach((e,n)=>{let r=[`bcv-tok`];t.pos===null?t.done&&r.push(`is-past`):n<t.pos?r.push(`is-past`):n===t.pos&&r.push(`is-now`),e.g.setAttribute(`class`,r.join(` `))}),t.pos!==null){let e=h[t.pos].x+wg/2;g.setAttribute(`d`,`M ${e} ${Eg-6} L ${e-6} 111 L ${e+6} 111 Z`),g.style.opacity=`1`}else g.style.opacity=`0`;v.textContent=Lg(t.sign),b.textContent=String(t.result);let n=t.phase===`number`,r=t.phase===`close`,i=t.phase===`sign`;b.setAttribute(`class`,`bcv-panel__num`+(t.done?` is-final`:n||r?` is-fresh`:``)),v.setAttribute(`class`,`bcv-panel__num`+(i?` is-fresh`:``)),n?x.textContent=`${t.prev} + ${Lg(t.sign)} * ${t.value} = ${t.result}`:r?x.textContent=`${t.popped.result} + ${Lg(t.popped.sign)} * (${t.inner}) = ${t.result}`:x.textContent=``;let a=t.stack,o=a.length-1,s=t.phase===`open`;w.forEach((e,n)=>{let i=[`bcv-cell`];n<a.length?(e.val.textContent=`result=${a[n].result}  sign=${Lg(a[n].sign)}`,n===o&&i.push(`is-top`),s&&n===o&&i.push(`is-fresh`)):r&&n===a.length?(e.val.textContent=`result=${t.popped.result}  sign=${Lg(t.popped.sign)}  弹出合并`,i.push(`is-ghost`)):e.val.textContent=``,e.g.setAttribute(`class`,i.join(` `))}),t.phase===`init`?T.textContent=`加减同级左结合：数字来一个结一个，不需要运算符栈`:n?T.textContent=`数字没有资格等待 —— 符号已定，立刻结算`:i?T.textContent=`运算符只登记符号，不动累计值`:s?T.textContent=`压栈「外层欠账」，进括号重启累加器`:r?T.textContent=`括号塌缩成一个数，乘上括号外的符号并回外层`:T.textContent=`时间 O(n)，空间 O(括号嵌套深度)`,Z(E,t.desc)}o.appendChild(E);let O=Q();o.appendChild(O.root),e.textContent=``,e.appendChild(o),X();let k=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,A=$({steps:n,controls:O,intervalMs:Pg,onRender:D});A.jumpTo(Math.trunc(t.initialStep)||0);let j=null;return r&&!k&&typeof IntersectionObserver==`function`&&(j=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){j.disconnect(),j=null,A.play();return}},{threshold:.35}),j.observe(o)),{destroy(){j&&=(j.disconnect(),null),A.destroy(),e.textContent=``,delete e.dataset.basiccalcMounted,document.getElementById(bg)?.remove()}}}var zg=`2*(5+5*2)/3+(6/2+8)`,Bg={"+":1,"-":1,"*":2,"/":2};function Vg(e){let t=[],n=0;for(;n<e.length;){let r=e[n];if(r===` `){n+=1;continue}if(r>=`0`&&r<=`9`){let r=n;for(;r<e.length&&e[r]>=`0`&&e[r]<=`9`;)r+=1;t.push(e.slice(n,r)),n=r;continue}t.push(r),n+=1}return t}function Hg(e,t){let n=t.pop(),r=e.pop(),i=e.pop(),a;return a=n===`+`?i+r:n===`-`?i-r:n===`*`?i*r:Math.trunc(i/r),e.push(a),{a:i,op:n,b:r,res:a}}function Ug(e={}){let t=typeof e.expr==`string`&&e.expr.trim()!==``?e.expr:zg,n=Vg(t),r=[],i=[],a=[],o=(e,o,s={})=>{r.push({phase:e,desc:o,expr:t,tokens:n,pos:null,token:null,nums:i.slice(),ops:a.slice(),value:null,pushedOp:null,applies:[],parenPopped:!1,result:null,done:e===`done`,...s})},s=e=>`${e.a} ${e.op} ${e.b} = ${e.res}`;o(`init`,`表达式 \`${t}\` 在 224 之上加了 \`*\` \`/\` —— **优先级不再统一**，\`2+3*4\` 的 \`+\` 不能急着算，得**等右边乘法结账**。来一个结一个失效，就需要 Dijkstra 的**双栈调度场**：\`nums\` 存操作数、\`ops\` 存运算符（\`(\` 也进 ops 当挡板）。唯一纪律：新运算符来临，把栈顶所有**优先级 >= 它**的都弹出结算（\`>=\` 顺带保证同级左结合），再压自己。于是 \`ops\` 里**每层括号内部**从底到顶优先级严格递增 —— 这条不变量就是算法骨架。除法一律 \`Math.trunc\` **向零截断**。`,{nums:[],ops:[]});for(let e=0;e<n.length;e+=1){let t=n[e];if(t>=`0`&&t<=`9`){let n=Number(t);i.push(n),o(`number`,`**\`${t}\`**：数字直接进 \`nums\`（栈顶 \`${i[i.length-1]}\`）。数字永远不主动结算 —— **什么时候算，是运算符的事**。`,{pos:e,token:t,value:n});continue}if(t===`(`){a.push(`(`),o(`open`,"**`(`**：压进 `ops` 当**挡板** —— 它不比优先级、不参与结算，作用只有一个：让后面进来的运算符在它面前停下，把括号内圈成独立小天地。",{pos:e,token:t});continue}if(t===`)`){let n=[];for(;a.length>0&&a[a.length-1]!==`(`;)n.push(Hg(i,a));a.pop(),o(`close`,`**\`)\`**：一路结算到挡板为止：${n.map(s).join(`，`)}。再把 \`(\` 弹掉 —— 括号内已塌缩成 \`nums\` 顶上的**一个数**，回到外层，继续受外层运算符的优先级纪律管。`,{pos:e,token:t,applies:n,parenPopped:!0});continue}let r=[];for(;a.length>0&&a[a.length-1]!==`(`&&Bg[a[a.length-1]]>=Bg[t];)r.push(Hg(i,a));a.push(t),o(`operator`,`**\`${t}\`**：先看栈顶 —— `+(r.length>0?`优先级 \`>= ${t}\` 的先结账：${r.map(s).join(`，`)}；`:"没有可结算的（栈空、或遇 `(` 挡板、或栈顶优先级更低）；")+`然后 \`'${t}'\` 压入 \`ops\`。`+(r.length>0?`高优先级的先走，\`${t}\` 排队 —— 这就是"优先级"在栈里的样子。`:`\`${t}\` 在等它的右操作数（或更晚的更高优先级）。`),{pos:e,token:t,applies:r,pushedOp:t})}let c=[];for(;a.length>0;)c.push(Hg(i,a));o(`flush`,`**扫完收尾**：\`ops\` 里剩的运算符从栈顶到底依次结算：${c.map(s).join(`，`)}。栈形不变量（从底到顶优先级严格递增）保证"从顶到底结算"这个顺序**恰好就是正确的运算顺序** —— 低优先级的本来就沉在栈底，轮到最后。`,{applies:c});let l=i.length===1?i[0]:null;return o(`done`,`\`${t}\` = **\`${l}\`**。双栈各司其职：\`nums\` 只进不出地攒操作数、被结算时才吐结果；\`ops\` 靠**优先级比较**决定谁先结账。三个记忆锚点：① 结算判据 \`栈顶优先级 >= 新运算符\`（\`>=\` = 左结合）；② \`(\` 是挡板、\`)\` 结算到挡板；③ 除法 \`Math.trunc\` 向零截断，\`floor\` 在负数上是坑。`,{result:l,done:!0}),r}var Wg=`calciii-styles`,Gg=40,Kg=58,qg=28,Jg=29,Yg=2,Xg=97,Zg=116,Qg=38,$g=352,e_=38,t_=128,n_=376,r_=398,i_=1150,a_=`
.c3v { display: flex; flex-direction: column; gap: 14px; }
.c3v__svg { width: 100%; height: auto; display: block; }

.c3v-note {
  fill: var(--c3v-muted, #657168); font-size: 12.5px; text-anchor: start;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.c3v-tok__box {
  fill: var(--c3v-fill, #ffffff); stroke: var(--c3v-line, #c3c9c2); stroke-width: 1.5;
}
.c3v-tok__val {
  fill: var(--c3v-ink, #1f2a24); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.c3v-tok.is-past .c3v-tok__box { fill: var(--c3v-past, #eef0ec); stroke: var(--c3v-past-line, #d8ddd6); }
.c3v-tok.is-past .c3v-tok__val { fill: var(--c3v-dim, #9aa39c); }
.c3v-tok.is-now .c3v-tok__box {
  fill: var(--c3v-gold-fill, #fdf3e3); stroke: var(--c3v-gold, #c2872f); stroke-width: 3;
}
.c3v-tok.is-now .c3v-tok__val { fill: var(--c3v-gold, #c2872f); }
.c3v-pointer { fill: var(--c3v-gold, #c2872f); }

.c3v-ban__box {
  fill: var(--c3v-banner, #f4f3ef); stroke: var(--c3v-line, #c3c9c2); stroke-width: 1.5;
}
.c3v-ban__text {
  fill: var(--c3v-hot, #a45f45); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.c3v-cell__box {
  fill: var(--c3v-fill, #ffffff); stroke: var(--c3v-line, #c3c9c2); stroke-width: 1.5;
}
.c3v-cell__val {
  fill: var(--c3v-ink, #1f2a24); font-size: 15px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.c3v-cell__sub {
  fill: var(--c3v-dim, #9aa39c); font-size: 9.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.c3v-cell.is-top .c3v-cell__box { stroke: var(--c3v-ok, #3f6b57); stroke-width: 3; }
.c3v-cell.is-top .c3v-cell__val { fill: var(--c3v-ok, #3f6b57); }
.c3v-cell.is-fresh .c3v-cell__box {
  fill: var(--c3v-gold-fill, #fdf3e3); stroke: var(--c3v-gold, #c2872f); stroke-width: 3;
}
.c3v-cell.is-fresh .c3v-cell__val { fill: var(--c3v-gold, #c2872f); }
.c3v-cell.is-ghost .c3v-cell__box {
  fill: none; stroke: var(--c3v-hot, #a45f45); stroke-dasharray: 4 3; stroke-width: 2.5;
}
.c3v-cell.is-ghost .c3v-cell__val { fill: var(--c3v-hot, #a45f45); }
.c3v-cell.is-ghost .c3v-cell__sub { fill: var(--c3v-hot, #a45f45); }
.c3v-cell.is-final .c3v-cell__box { stroke: var(--c3v-ok, #3f6b57); stroke-width: 3.5; }

.c3v-label {
  fill: var(--c3v-muted, #657168); font-size: 12.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.c3v-floor { stroke: var(--c3v-line, #c3c9c2); stroke-width: 2; }
.c3v-phase__text {
  fill: var(--c3v-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function o_(){if(document.getElementById(Wg))return;let e=document.createElement(`style`);e.id=Wg,e.textContent=a_,document.head.appendChild(e)}function s_(e,t={}){if(!e||e.dataset.calciiiMounted===`1`)return{destroy(){}};e.dataset.calciiiMounted=`1`,o_();let n=Ug(t),r=t.autoplay!==!1,i=n[0].tokens,a=Y,o=document.createElement(`div`);o.className=`viz c3v`;let s=document.createElement(`div`);s.className=`viz__stage`,o.appendChild(s);let c=a(`svg`,{class:`viz__svg c3v__svg`,viewBox:`0 0 660 420`,role:`img`,"aria-label":`基本计算器 III LC772 双栈调度场动画`});s.appendChild(c);let l=a(`g`,{}),u=a(`g`,{}),d=a(`g`,{});c.appendChild(l),c.appendChild(u),c.appendChild(d);let f=a(`text`,{class:`c3v-note`,x:26,y:Gg});f.textContent=`新运算符来临：栈顶优先级 >= 它的先结账（>= 即左结合），再压自己`,d.appendChild(f);let p=i.length*31-Yg,m=Math.max(16,(660-p)/2),h=i.map((e,t)=>{let n=m+t*31,r=a(`g`,{class:`c3v-tok`});r.appendChild(a(`rect`,{class:`c3v-tok__box`,x:n,y:Kg,width:Jg,height:qg,rx:5}));let i=a(`text`,{class:`c3v-tok__val`,x:n+Jg/2,y:72});return i.textContent=e,r.appendChild(i),l.appendChild(r),{g:r,x:n}}),g=a(`path`,{class:`c3v-pointer`,d:``});d.appendChild(g),d.appendChild(a(`rect`,{class:`c3v-ban__box`,x:26,y:Zg,width:608,height:Qg,rx:8}));let _=a(`text`,{class:`c3v-ban__text`,x:660/2,y:135});d.appendChild(_);let v=Math.max(1,...n.map(e=>e.nums.length)),y=Math.max(1,...n.map(e=>e.ops.length));d.appendChild(a(`line`,{class:`c3v-floor`,x1:180-t_/2-8,y1:$g,x2:252,y2:$g})),d.appendChild(a(`line`,{class:`c3v-floor`,x1:480-t_/2-8,y1:$g,x2:552,y2:$g}));let b=a(`text`,{class:`c3v-label`,x:180,y:n_});b.textContent=`nums 数值栈`;let x=a(`text`,{class:`c3v-label`,x:480,y:n_});x.textContent=`ops 运算符栈（含挡板）`,d.append(b,x);let S=(e,t)=>{let n=[];for(let r=0;r<=t;r+=1){let t=a(`g`,{class:`c3v-cell`}),i=$g-(r+1)*43;t.appendChild(a(`rect`,{class:`c3v-cell__box`,x:e-t_/2,y:i,width:t_,height:e_,rx:6}));let o=a(`text`,{class:`c3v-cell__val`,x:e,y:i+e_/2-4});t.appendChild(o);let s=a(`text`,{class:`c3v-cell__sub`,x:e,y:i+e_-8});t.appendChild(s),u.appendChild(t),n.push({g:t,val:o,sub:s})}return n},C=S(180,v),w=S(480,y),T=a(`text`,{class:`c3v-phase__text`,x:660/2,y:r_});d.appendChild(T);let E=document.createElement(`p`);E.className=`viz__desc`,E.setAttribute(`aria-live`,`polite`);function D(e,t,n,r,i,a){let o=t.length-1;e.forEach((e,s)=>{let c=[`c3v-cell`];s<t.length?(e.val.textContent=String(t[s]),e.sub.textContent=s===0?`bottom`:`#${s}`,s===o&&c.push(`is-top`),s===n&&c.push(`is-fresh`),s===a&&c.push(`is-final`)):s===r?(e.val.textContent=i,e.sub.textContent=`结算/弹出`,c.push(`is-ghost`)):(e.val.textContent=``,e.sub.textContent=``),e.g.setAttribute(`class`,c.join(` `))})}function O(e,t){if(!t)return;if(h.forEach((e,n)=>{let r=[`c3v-tok`];t.pos===null?(t.done||t.phase===`flush`)&&r.push(`is-past`):n<t.pos?r.push(`is-past`):n===t.pos&&r.push(`is-now`),e.g.setAttribute(`class`,r.join(` `))}),t.pos!==null){let e=h[t.pos].x+Jg/2;g.setAttribute(`d`,`M ${e} ${Xg-6} L ${e-6} 100 L ${e+6} 100 Z`),g.style.opacity=`1`}else g.style.opacity=`0`;t.applies.length>0?_.textContent=`结算：`+t.applies.map(e=>`${e.a} ${e.op} ${e.b} = ${e.res}`).join(`  →  `):t.phase===`init`?_.textContent=`nums 攒操作数 · ops 靠优先级决定谁先结账`:t.phase===`done`?_.textContent=`答案：${t.result}`:_.textContent=`本帧无结算 —— 继续攒`;let n=t.phase===`number`,r=t.phase===`operator`,i=t.applies.length>0,a=t.phase===`done`,o=n||i?t.nums.length-1:-1;D(C,t.nums,o,-1,``,a?0:-1);let s=t.phase===`close`?`(`:i?t.applies.at(-1).op:null;D(w,t.ops,r?t.ops.length-1:-1,i||t.phase===`close`?t.ops.length:-1,s??``,-1),t.phase===`init`?T.textContent=`优先级不统一 → "来一个结一个"失效 → 双栈调度场`:n?T.textContent=`数字只进 nums：什么时候算，是运算符的事`:t.phase===`open`?T.textContent=`'(' 压进 ops 当挡板 —— 后面的运算符在它面前停下`:t.phase===`close`?T.textContent=`')' 结算到挡板：括号塌缩成 nums 顶上的一个数`:t.phase===`flush`?T.textContent=`栈形不变量保证：从顶到底结算 === 正确运算顺序`:r?T.textContent=i?`高优先级的先走，我排队`:`栈顶优先级更低（或被挡板挡住）→ 直接压栈等待`:T.textContent=`时间 O(n)，空间 O(n) —— 双栈各存各的`,Z(E,t.desc)}o.appendChild(E);let k=Q();o.appendChild(k.root),e.textContent=``,e.appendChild(o),X();let A=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,j=$({steps:n,controls:k,intervalMs:i_,onRender:O});j.jumpTo(Math.trunc(t.initialStep)||0);let M=null;return r&&!A&&typeof IntersectionObserver==`function`&&(M=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){M.disconnect(),M=null,j.play();return}},{threshold:.35}),M.observe(o)),{destroy(){M&&=(M.disconnect(),null),j.destroy(),e.textContent=``,delete e.dataset.calciiiMounted,document.getElementById(Wg)?.remove()}}}var c_=[-1,0,3,5,9,12,15,20,26,31,38,44],l_=31;function u_(e={}){let t=Array.isArray(e.nums)&&e.nums.length>0?[...e.nums]:[...c_],n=Number.isFinite(e.target)?e.target:l_,r=[],i=0,a=t.length-1,o=-1,s=!1,c=(e,c,l={})=>{r.push({phase:e,desc:c,nums:[...t],target:n,left:i,right:a,prevLeft:i,prevRight:a,mid:null,value:null,cmp:null,action:null,eliminated:0,result:o,found:s,done:e===`done`,...l})};c(`init`,`有序数组 \`[${t.join(`, `)}]\`，找 \`target = ${n}\`。二分的本质不是"折半"，是**维持一条不变量**：若 target 在数组里，它的下标永远落在闭区间 \`[left, right]\` 内。开局区间是整段 \`[0, ${t.length-1}]\`。每轮探中点、把**不可能的一半**整段扔掉 —— 扔掉的前半句是"检查过 mid"，后半句是"边界必须跳过 mid"（\`left = mid + 1\` / \`right = mid - 1\`）。三条铁律配套闭区间这一个约定：\`while (left <= right)\`、\`mid = left + ((right - left) >> 1)\`、边界收缩带 ±1。`,{left:0,right:t.length-1,prevLeft:0,prevRight:t.length-1});let l=0;for(;i<=a&&l<64;){l+=1;let e=i,u=a,d=i+(a-i>>1),f=t[d],p=f<n?-1:+(f>n);if(p===0){s=!0,o=d,c(`probe`,`**第 ${r.length} 探**：\`mid = ${e} + ((${u} - ${e}) >> 1) = ${d}\`，\`nums[${d}] = ${f}\` **等于** target —— 结案！注意区间**不动**：命中即返回，二分查找（找特定值）在这一刻就结束了。全程只探了 ${r.length} 次 —— 每探一次砍掉一半，\`log₂(${t.length})\` 级别。`,{mid:d,value:f,cmp:p,action:`found`,eliminated:0});break}p<0?(i=d+1,c(`probe`,`**第 ${r.length} 探**：\`mid = ${e} + ((${u} - ${e}) >> 1) = ${d}\`，\`nums[${d}] = ${f} < ${n}\` —— 升序数组里 mid **左边（含 mid）**全部比 target 小，整段排除：\`left = mid + 1 = ${i}\`，\`right\` 不动。一次扔掉 ${d-e+1} 个元素，不变量"答案若在则必在 [left, right]"依然成立。`,{mid:d,value:f,cmp:p,action:`go_right`,eliminated:d-e+1,left:i,right:a,prevLeft:e,prevRight:u})):(a=d-1,c(`probe`,`**第 ${r.length} 探**：\`mid = ${e} + ((${u} - ${e}) >> 1) = ${d}\`，\`nums[${d}] = ${f} > ${n}\` —— mid **右边（含 mid）**全部比 target 大，整段排除：\`right = mid - 1 = ${a}\`，\`left\` 不动。一次扔掉 ${u-d+1} 个元素，搜索区间从 ${u-e+1} 缩到 ${a-i+1}。`,{mid:d,value:f,cmp:p,action:`go_left`,eliminated:u-d+1,left:i,right:a,prevLeft:e,prevRight:u}))}return c(`done`,s?`返回 **\`${o}\`**。复盘：${r.length-1} 次探测把 ${t.length} 个元素砍到命中 —— 每次比较都**排除一半**，这就是 \`O(log n)\` 的全部秘密。三条铁律回顾：① 闭区间 \`[left, right]\` 配 \`while (left <= right)\`；② \`mid = left + ((right - left) >> 1)\` 防爆 int；③ 收缩必带 ±1，mid 检查过不回头。`:`\`left = ${i} > right = ${a}\`，闭区间**空了** —— 不变量的逆否命题：若 target 在数组里它本该还在区间内，区间却已空，所以 target 必不在，返回 \`-1\`。注意 \`left === right + 1\` 恰好是闭区间为空的条件 —— 这就是 \`while (left <= right)\` 的由来。`,{done:!0,result:o,found:s,left:i,right:a}),r}var d_=`binarysearch-styles`,f_=34,p_=62,m_=76,h_=42,g_=132,__=148,v_=168,y_=46,b_=228,x_=56,S_=306,C_=604,w_=1400,T_=`
.bsv { display: flex; flex-direction: column; gap: 14px; }
.bsv__svg { width: 100%; height: auto; display: block; }

.bsv-note {
  fill: var(--bsv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bsv-note--r { text-anchor: end; }

.bsv-cell__box {
  fill: var(--bsv-fill, #ffffff); stroke: var(--bsv-line, #c3c9c2); stroke-width: 1.5;
}
.bsv-cell__val {
  fill: var(--bsv-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bsv-cell__idx {
  fill: var(--bsv-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.bsv-cell.is-out .bsv-cell__box { fill: var(--bsv-past, #eef0ec); stroke: var(--bsv-past-line, #d8ddd6); }
.bsv-cell.is-out .bsv-cell__val { fill: var(--bsv-dim, #9aa39c); }
.bsv-cell.is-mid .bsv-cell__box {
  fill: var(--bsv-gold-fill, #fdf3e3); stroke: var(--bsv-gold, #c2872f); stroke-width: 3;
}
.bsv-cell.is-mid .bsv-cell__val { fill: var(--bsv-gold, #c2872f); }
.bsv-cell.is-hit .bsv-cell__box {
  fill: var(--bsv-ok-fill, #eef5f1); stroke: var(--bsv-ok, #3f6b57); stroke-width: 3;
}
.bsv-cell.is-hit .bsv-cell__val { fill: var(--bsv-ok, #3f6b57); }

.bsv-ptr { font-size: 11px; font-weight: 700; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.bsv-ptr--l { fill: var(--bsv-ok, #3f6b57); }
.bsv-ptr--r { fill: var(--bsv-hot, #a45f45); }
.bsv-ptr--m { fill: var(--bsv-gold, #c2872f); }
.bsv-tri--l { fill: var(--bsv-ok, #3f6b57); }
.bsv-tri--r { fill: var(--bsv-hot, #a45f45); }
.bsv-tri--m { fill: var(--bsv-gold, #c2872f); }

.bsv-banner__box {
  fill: var(--bsv-banner, #f4f3ef); stroke: var(--bsv-line, #c3c9c2); stroke-width: 1.5;
}
.bsv-banner__text {
  fill: var(--bsv-hot, #a45f45); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bsv-banner__text.is-ok { fill: var(--bsv-ok, #3f6b57); }

.bsv-panel__box {
  fill: var(--bsv-fill, #ffffff); stroke: var(--bsv-line, #c3c9c2); stroke-width: 1.5;
}
.bsv-panel__label {
  fill: var(--bsv-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.bsv-panel__num {
  fill: var(--bsv-ink, #1f2a24); font-size: 19px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.bsv-panel__num.is-fresh { fill: var(--bsv-gold, #c2872f); }
.bsv-panel__num.is-final { fill: var(--bsv-ok, #3f6b57); }

.bsv-phase__text {
  fill: var(--bsv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function E_(){if(document.getElementById(d_))return;let e=document.createElement(`style`);e.id=d_,e.textContent=T_,document.head.appendChild(e)}function D_(e,t={}){if(!e||e.dataset.binarysearchMounted===`1`)return{destroy(){}};e.dataset.binarysearchMounted=`1`,E_();let n=u_(t),r=t.autoplay!==!1,i=n[0].nums,a=n[0].target,o=Y,s=document.createElement(`div`);s.className=`viz bsv`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=o(`svg`,{class:`viz__svg bsv__svg`,viewBox:`0 0 660 328`,role:`img`,"aria-label":`二分查找 LC704 推演动画`});c.appendChild(l);let u=o(`g`,{}),d=o(`g`,{});l.appendChild(u),l.appendChild(d);let f=o(`text`,{class:`bsv-note`,x:26,y:f_});f.textContent=`不变量：target 若在数组里，下标恒在 [left, right]`,d.appendChild(f);let p=o(`text`,{class:`bsv-note bsv-note--r`,x:634,y:f_});p.textContent=`target = ${a}`,d.appendChild(p);let m=i.length,h=Math.min(46,Math.floor((C_-(m-1)*4)/Math.max(1,m))),g=(660-(m*h+(m-1)*4))/2,_=i.map((e,t)=>{let n=g+t*(h+4),r=o(`g`,{class:`bsv-cell`});r.appendChild(o(`rect`,{class:`bsv-cell__box`,x:n,y:m_,width:h,height:h_,rx:6}));let i=o(`text`,{class:`bsv-cell__val`,x:n+h/2,y:92});i.textContent=String(e),r.appendChild(i);let a=o(`text`,{class:`bsv-cell__idx`,x:n+h/2,y:109});return a.textContent=String(t),r.appendChild(a),u.appendChild(r),{g:r,cx:n+h/2}}),v=o(`path`,{class:`bsv-tri bsv-tri--m`,d:``}),y=o(`text`,{class:`bsv-ptr bsv-ptr--m`,x:0,y:p_});y.textContent=`mid`;let b=o(`path`,{class:`bsv-tri bsv-tri--l`,d:``}),x=o(`text`,{class:`bsv-ptr bsv-ptr--l`,x:0,y:__});x.textContent=`left`;let S=o(`path`,{class:`bsv-tri bsv-tri--r`,d:``}),C=o(`text`,{class:`bsv-ptr bsv-ptr--r`,x:0,y:__});C.textContent=`right`,d.append(v,y,b,x,S,C),d.appendChild(o(`rect`,{class:`bsv-banner__box`,x:26,y:v_,width:608,height:y_,rx:9}));let w=o(`text`,{class:`bsv-banner__text`,x:660/2,y:191});d.appendChild(w),d.appendChild(o(`rect`,{class:`bsv-panel__box`,x:26,y:b_,width:608,height:x_,rx:9}));let T=(e,t)=>{let n=o(`text`,{class:`bsv-panel__label`,x:t,y:243});n.textContent=e;let r=o(`text`,{class:`bsv-panel__num`,x:t,y:265});return d.append(n,r),r},E=T(`left`,660/2-165),D=T(`right`,660/2-55),O=T(`区间大小`,385),k=T(`已排除`,495),A=o(`text`,{class:`bsv-phase__text`,x:660/2,y:S_});d.appendChild(A);let j=document.createElement(`p`);j.className=`viz__desc`,j.setAttribute(`aria-live`,`polite`);function M(e,t){if(!t)return;_.forEach((e,n)=>{let r=[`bsv-cell`];t.mid!==null&&n===t.mid?r.push(t.action===`found`?`is-hit`:`is-mid`):(n<t.left||n>t.right)&&r.push(`is-out`),e.g.setAttribute(`class`,r.join(` `))});let r=(e,t,n)=>n===`down`?`M ${e-6} ${t-8} L ${e+6} ${t-8} L ${e} ${t+1} Z`:`M ${e-6} ${t+8} L ${e+6} ${t+8} L ${e} ${t-1} Z`;if(t.mid!==null){let e=_[t.mid].cx;v.setAttribute(`d`,r(e,m_-4,`down`)),y.setAttribute(`x`,e),v.style.opacity=`1`,y.style.opacity=`1`}else v.setAttribute(`d`,``),v.style.opacity=`0`,y.style.opacity=`0`;let i=t.left<m?_[t.left].cx:_[m-1].cx+h+4,o=t.right>=0?_[t.right].cx:_[0].cx-h-4;b.setAttribute(`d`,r(i,g_,`up`)),x.setAttribute(`x`,i),S.setAttribute(`d`,r(o,g_,`up`)),C.setAttribute(`x`,o);let s=t.left>t.right;if(x.textContent=s?`left>right`:`left`,C.textContent=`right`,t.phase===`probe`){let e=t.cmp<0?`<`:t.cmp>0?`>`:`=`,n=t.action===`found`?`命中 → 返回 ${t.mid}`:t.action===`go_right`?`left = mid + 1 = ${t.left}（排除 ${t.eliminated} 个）`:`right = mid - 1 = ${t.right}（排除 ${t.eliminated} 个）`;w.textContent=`nums[${t.mid}] = ${t.value} ${e} ${a}  →  ${n}`,w.setAttribute(`class`,`bsv-banner__text`+(t.action===`found`?` is-ok`:``))}else t.phase===`done`?(w.textContent=t.found?`返回下标 ${t.result}`:`区间空 → 返回 -1`,w.setAttribute(`class`,`bsv-banner__text`+(t.found?` is-ok`:``))):(w.textContent=`开局：整个数组都是嫌疑区 [0, ${m-1}]`,w.setAttribute(`class`,`bsv-banner__text`));E.textContent=String(t.left),D.textContent=String(t.right),E.setAttribute(`class`,`bsv-panel__num`+(t.action===`go_right`?` is-fresh`:``)),D.setAttribute(`class`,`bsv-panel__num`+(t.action===`go_left`?` is-fresh`:``)),O.textContent=String(Math.max(0,t.right-t.left+1));let c=0;for(let t=1;t<=e;t+=1)c+=n[t].eliminated||0;k.textContent=String(c),t.phase===`init`?A.textContent=`每轮砍一半，但绝不误伤不变量`:t.action===`go_right`?A.textContent=`nums[mid] < target → 左半（含 mid）整段出局`:t.action===`go_left`?A.textContent=`nums[mid] > target → 右半（含 mid）整段出局`:t.action===`found`?A.textContent=`找特定值：命中即返回`:A.textContent=`O(log n)：每探一次，嫌疑减半`,Z(j,t.desc)}s.appendChild(j);let N=Q();s.appendChild(N.root),e.textContent=``,e.appendChild(s),X();let P=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,F=$({steps:n,controls:N,intervalMs:w_,onRender:M});F.jumpTo(Math.trunc(t.initialStep)||0);let I=null;return r&&!P&&typeof IntersectionObserver==`function`&&(I=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){I.disconnect(),I=null,F.play();return}},{threshold:.35}),I.observe(s)),{destroy(){I&&=(I.disconnect(),null),F.destroy(),e.textContent=``,delete e.dataset.binarysearchMounted,document.getElementById(d_)?.remove()}}}var O_=8;function k_(e={}){let t=Number.isInteger(e.x)&&e.x>=0?e.x:O_,n=[],r=0,i=t,a=0,o=(e,o,s={})=>{n.push({phase:e,desc:o,x:t,lo:r,hi:i,prevLo:r,prevHi:i,mid:null,sq:null,le:null,action:null,ans:a,prevAns:a,done:e===`done`,...s})};o(`init`,`求 \`√${t}\` 的整数部分。69 没有数组 —— 但**整数区间 \`[0, ${t}]\` 就是那个有序数组**：定义谓词 \`P(k) = (k * k <= ${t})\`，k 越大 k² 越大，P 必是"前真后假"：\`true true … true | false … false\`。算术平方根 = **最后一个 true 的下标** —— 这是"边界二分"，和 704 的"命中二分"只差一个动作：P(mid) 成立时**不收工**，记下 \`ans = mid\` 当候选，然后 \`lo = mid + 1\` 继续向右找更大的。`,{lo:0,hi:t,prevLo:0,prevHi:t,ans:0,prevAns:0});let s=0;for(;r<=i&&s<64;){s+=1;let e=r,c=i,l=a,u=r+(i-r>>1),d=u*u,f=d<=t;f?(a=u,r=u+1,o(`probe`,`**第 ${n.length} 探**：\`mid = ${e} + ((${c} - ${e}) >> 1) = ${u}\`，\`mid² = ${d} <= ${t}\` —— 谓词成立。但这是**边界**不是命中：mid 右边可能还有更大的合法 k，所以**记候选** \`ans = ${u}\`，\`lo = mid + 1 = ${r}\` **继续向右**。这就是 69 与 704 的分岔口：704 相等即返回，69 成立仍不停。`,{mid:u,sq:d,le:f,action:`record_right`,lo:r,hi:i,prevLo:e,prevHi:c,ans:a,prevAns:l})):(i=u-1,o(`probe`,`**第 ${n.length} 探**：\`mid = ${e} + ((${c} - ${e}) >> 1) = ${u}\`，\`mid² = ${d} > ${t}\` —— 谓词不成立，mid 及右边全是 false，整段排除：\`hi = mid - 1 = ${i}\`，\`ans = ${a}\` 不动。真解被压进 \`[${a}, ${i}]\`，每探一次候选区间减半。`,{mid:u,sq:d,le:f,action:`go_left`,lo:r,hi:i,prevLo:e,prevHi:c,ans:a,prevAns:l}))}return o(`done`,`\`lo = ${r} > hi = ${i}\`，区间空 —— 最后一个记下的候选就是答案：**\`⌊√${t}⌋ = ${a}\`**（校验：\`${a}² = ${a*a} <= ${t}\` 且 \`(${a} + 1)² = ${(a+1)*(a+1)} > ${t}\`）。复盘模板：和 704 同一套闭区间三件套，只把"命中返回"换成"成立记候选再向右" —— **答案不在数组里，答案在谓词的边界上**。`,{done:!0,lo:r,hi:i,ans:a,prevAns:a}),n}var A_=`sqrt-styles`,j_=34,M_=62,N_=76,P_=52,F_=142,I_=158,L_=178,R_=46,z_=238,B_=56,V_=316,H_=604,U_=1400,W_=`
.sqv { display: flex; flex-direction: column; gap: 14px; }
.sqv__svg { width: 100%; height: auto; display: block; }

.sqv-note {
  fill: var(--sqv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sqv-note--r { text-anchor: end; }

.sqv-cell__box {
  fill: var(--sqv-true-fill, #eef5f1); stroke: var(--sqv-line, #c3c9c2); stroke-width: 1.5;
}
.sqv-cell__val {
  fill: var(--sqv-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sqv-cell__sub {
  fill: var(--sqv-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sqv-cell.is-false .sqv-cell__box { fill: var(--sqv-past, #eef0ec); stroke: var(--sqv-past-line, #d8ddd6); }
.sqv-cell.is-false .sqv-cell__val { fill: var(--sqv-dim, #9aa39c); }
.sqv-cell.is-out .sqv-cell__box { stroke-dasharray: 3 3; }
.sqv-cell.is-mid .sqv-cell__box {
  fill: var(--sqv-gold-fill, #fdf3e3); stroke: var(--sqv-gold, #c2872f); stroke-width: 3;
}
.sqv-cell.is-mid .sqv-cell__val { fill: var(--sqv-gold, #c2872f); }
.sqv-cell.is-ans .sqv-cell__box { stroke: var(--sqv-ok, #3f6b57); stroke-width: 3; }

.sqv-ptr { font-size: 11px; font-weight: 700; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.sqv-ptr--l { fill: var(--sqv-ok, #3f6b57); }
.sqv-ptr--r { fill: var(--sqv-hot, #a45f45); }
.sqv-ptr--m { fill: var(--sqv-gold, #c2872f); }
.sqv-tri--l { fill: var(--sqv-ok, #3f6b57); }
.sqv-tri--r { fill: var(--sqv-hot, #a45f45); }
.sqv-tri--m { fill: var(--sqv-gold, #c2872f); }

.sqv-banner__box {
  fill: var(--sqv-banner, #f4f3ef); stroke: var(--sqv-line, #c3c9c2); stroke-width: 1.5;
}
.sqv-banner__text {
  fill: var(--sqv-hot, #a45f45); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sqv-banner__text.is-ok { fill: var(--sqv-ok, #3f6b57); }

.sqv-panel__box {
  fill: var(--sqv-fill, #ffffff); stroke: var(--sqv-line, #c3c9c2); stroke-width: 1.5;
}
.sqv-panel__label {
  fill: var(--sqv-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sqv-panel__num {
  fill: var(--sqv-ink, #1f2a24); font-size: 19px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sqv-panel__num.is-fresh { fill: var(--sqv-gold, #c2872f); }
.sqv-panel__num.is-final { fill: var(--sqv-ok, #3f6b57); }
.sqv-panel__note {
  fill: var(--sqv-muted, #657168); font-size: 12px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.sqv-phase__text {
  fill: var(--sqv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function G_(){if(document.getElementById(A_))return;let e=document.createElement(`style`);e.id=A_,e.textContent=W_,document.head.appendChild(e)}function K_(e,t={}){if(!e||e.dataset.sqrtMounted===`1`)return{destroy(){}};e.dataset.sqrtMounted=`1`,G_();let n=k_(t),r=t.autoplay!==!1,i=n[0].x,a=Y,o=document.createElement(`div`);o.className=`viz sqv`;let s=document.createElement(`div`);s.className=`viz__stage`,o.appendChild(s);let c=a(`svg`,{class:`viz__svg sqv__svg`,viewBox:`0 0 660 338`,role:`img`,"aria-label":`x 的平方根 LC69 推演动画`});s.appendChild(c);let l=a(`g`,{}),u=a(`g`,{});c.appendChild(l),c.appendChild(u);let d=a(`text`,{class:`sqv-note`,x:26,y:j_});d.textContent=`谓词 P(k) = k² <= x：前真后假，求最后一个真`,u.appendChild(d);let f=a(`text`,{class:`sqv-note sqv-note--r`,x:634,y:j_});f.textContent=`x = ${i}`,u.appendChild(f);let p=i+1,m=Math.min(52,Math.floor((H_-(p-1)*4)/Math.max(1,p))),h=(660-(p*m+(p-1)*4))/2,g=[];for(let e=0;e<=i;e+=1){let t=h+e*(m+4),n=a(`g`,{class:`sqv-cell`});n.appendChild(a(`rect`,{class:`sqv-cell__box`,x:t,y:N_,width:m,height:P_,rx:6}));let r=a(`text`,{class:`sqv-cell__val`,x:t+m/2,y:93});r.textContent=String(e),n.appendChild(r);let i=a(`text`,{class:`sqv-cell__sub`,x:t+m/2,y:113});i.textContent=`${e*e<=999?e*e:`…`}`,n.appendChild(i);let o=a(`text`,{class:`sqv-cell__sub`,x:t+m/2,y:124});o.textContent=`k²`,n.appendChild(o),l.appendChild(n),g.push({g:n,cx:t+m/2})}let _=a(`path`,{class:`sqv-tri sqv-tri--m`,d:``}),v=a(`text`,{class:`sqv-ptr sqv-ptr--m`,x:0,y:M_});v.textContent=`mid`;let y=a(`path`,{class:`sqv-tri sqv-tri--l`,d:``}),b=a(`text`,{class:`sqv-ptr sqv-ptr--l`,x:0,y:I_});b.textContent=`lo`;let x=a(`path`,{class:`sqv-tri sqv-tri--r`,d:``}),S=a(`text`,{class:`sqv-ptr sqv-ptr--r`,x:0,y:I_});S.textContent=`hi`,u.append(_,v,y,b,x,S),u.appendChild(a(`rect`,{class:`sqv-banner__box`,x:26,y:L_,width:608,height:R_,rx:9}));let C=a(`text`,{class:`sqv-banner__text`,x:660/2,y:201});u.appendChild(C),u.appendChild(a(`rect`,{class:`sqv-panel__box`,x:26,y:z_,width:608,height:B_,rx:9}));let w=(e,t)=>{let n=a(`text`,{class:`sqv-panel__label`,x:t,y:253});n.textContent=e;let r=a(`text`,{class:`sqv-panel__num`,x:t,y:275});return u.append(n,r),r},T=w(`lo`,660/2-180),E=w(`hi`,660/2-60),D=w(`ans（候选）`,390),O=a(`text`,{class:`sqv-panel__note`,x:525,y:275});u.append(O);let k=a(`text`,{class:`sqv-phase__text`,x:660/2,y:V_});u.appendChild(k);let A=document.createElement(`p`);A.className=`viz__desc`,A.setAttribute(`aria-live`,`polite`);function j(e,t){if(!t)return;g.forEach((e,n)=>{let r=[`sqv-cell`],a=t.mid!==null&&n===t.mid;n*n>i&&r.push(`is-false`),(n<t.lo||n>t.hi)&&!a&&r.push(`is-out`),a?r.push(`is-mid`):n===t.ans&&t.ans*t.ans<=i&&r.push(`is-ans`),e.g.setAttribute(`class`,r.join(` `))});let n=(e,t,n)=>n===`down`?`M ${e-6} ${t-8} L ${e+6} ${t-8} L ${e} ${t+1} Z`:`M ${e-6} ${t+8} L ${e+6} ${t+8} L ${e} ${t-1} Z`;if(t.mid!==null){let e=g[t.mid].cx;_.setAttribute(`d`,n(e,N_-4,`down`)),v.setAttribute(`x`,e),_.style.opacity=`1`,v.style.opacity=`1`}else _.setAttribute(`d`,``),_.style.opacity=`0`,v.style.opacity=`0`;let r=t.lo<=i?g[t.lo].cx:g[i].cx+m+4,a=t.hi>=0?g[t.hi].cx:g[0].cx-m-4;if(y.setAttribute(`d`,n(r,F_,`up`)),b.setAttribute(`x`,r),x.setAttribute(`d`,n(a,F_,`up`)),S.setAttribute(`x`,a),b.textContent=t.lo>t.hi?`lo>hi`:`lo`,t.phase===`probe`){let e=t.le?`<=`:`>`,n=t.le?`记 ans = ${t.mid}，lo = ${t.lo} 继续向右`:`hi = ${t.hi}（mid 及右边全 false）`;C.textContent=`${t.mid}² = ${t.sq} ${e} ${i}  →  ${n}`,C.setAttribute(`class`,`sqv-banner__text`+(t.le?` is-ok`:``))}else t.phase===`done`?(C.textContent=`区间空 → ⌊√${i}⌋ = ${t.ans}`,C.setAttribute(`class`,`sqv-banner__text is-ok`)):(C.textContent=`候选区间 [0, ${i}]：绿色=满足 k²<=${i}，灰色=不满足`,C.setAttribute(`class`,`sqv-banner__text`));T.textContent=String(t.lo),E.textContent=String(t.hi),T.setAttribute(`class`,`sqv-panel__num`+(t.action===`record_right`?` is-fresh`:``)),E.setAttribute(`class`,`sqv-panel__num`+(t.action===`go_left`?` is-fresh`:``)),D.textContent=String(t.ans),D.setAttribute(`class`,`sqv-panel__num`+(t.done?` is-final`:t.action===`record_right`?` is-fresh`:``)),O.textContent=`校验 ${t.ans}² = ${t.ans*t.ans} <= ${i}，(${t.ans}+1)² = ${(t.ans+1)*(t.ans+1)} > ${i}？`,t.phase===`init`?k.textContent=`答案不在数组里，答案在谓词的边界上`:t.action===`record_right`?k.textContent=`成立不收工：记候选，继续向右找更大的`:t.action===`go_left`?k.textContent=`不成立：mid 及右边整段出局`:k.textContent=`区间空 → ans 即最后一个真 = ⌊√x⌋`,Z(A,t.desc)}o.appendChild(A);let M=Q();o.appendChild(M.root),e.textContent=``,e.appendChild(o),X();let N=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,P=$({steps:n,controls:M,intervalMs:U_,onRender:j});P.jumpTo(Math.trunc(t.initialStep)||0);let F=null;return r&&!N&&typeof IntersectionObserver==`function`&&(F=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){F.disconnect(),F=null,P.play();return}},{threshold:.35}),F.observe(o)),{destroy(){F&&=(F.disconnect(),null),P.destroy(),e.textContent=``,delete e.dataset.sqrtMounted,document.getElementById(A_)?.remove()}}}var q_=[7,1,5,3,6,4];function J_(e={}){let t=Array.isArray(e.prices)&&e.prices.length>0?[...e.prices]:[...q_],n=[],r=t[0],i=0,a=(e,a,o={})=>{n.push({phase:e,desc:a,prices:[...t],day:0,price:null,prevPrice:null,minPrice:r,prevMin:r,candidate:null,best:i,prevBest:i,updated:null,result:i,done:e===`done`,...o})};a(`init`,`价格序列 \`[${t.join(`, `)}]\`。只许**买卖一次**（先买后卖），求最大利润。暴力枚举所有 (买, 卖) 对是 \`O(n²)\`；一维扫描只需两个变量：\`minPrice\` = **截至昨天**的历史最低价（我手里最便宜的那笔买入），\`best\` = 历史最大的"今天卖出"利润。开局第 0 天：\`minPrice = ${t[0]}\`，还没卖过，\`best = 0\`。每天两件事、**顺序固定**：先按今天的价格卖一把，再把今天并入历史最低价 —— 反了就变成"今天买今天卖"。`,{day:0,minPrice:t[0],prevMin:t[0],best:0,prevBest:0});for(let e=1;e<t.length;e+=1){let n=t[e],o=t[e-1],s=r,c=i,l=n-s,u=Math.max(c,l),d=Math.min(s,n),f=u>c?`best`:d<s?`minPrice`:`none`;i=u,r=d;let p;p=f===`best`?`**第 ${e} 天** \`price = ${n}\`：先卖一把 —— \`candidate = ${n} - ${s} = ${l}\`，\`best = max(${c}, ${l}) = ${i}\` **刷新**！历史最低价仍是 \`${s}\`（今天比它贵，不更新）。注意 candidate 用的是**更新前**的 minPrice —— 先卖后记，顺序即题意。`:f===`minPrice`?`**第 ${e} 天** \`price = ${n}\`：卖一把 \`candidate = ${n} - ${s} = ${l} ≤ ${c}\`，best 不动；但今天比历史最低价还便宜，\`minPrice = ${r}\` **刷新** —— 它在等未来某一天把这笔"便宜买入"卖出去。全程最低价是不断**下台阶**的。`:`**第 ${e} 天** \`price = ${n}\`：\`candidate = ${n} - ${s} = ${l} ≤ best = ${i}\`，且 \`price ≥ minPrice\` 也不刷新历史最低 —— 两变量**原地不动**。大多数日子都是这种"路过帧"：扫描的常态是不动，动的那几帧才是答案的来路。`,a(`scan`,p,{day:e,price:n,prevPrice:o,minPrice:r,prevMin:s,candidate:l,best:i,prevBest:c,updated:f})}return a(`done`,`返回 **\`${i}\`**。复盘：${t.length-1} 次路过，best 只在上坡日刷新、minPrice 只在下台阶日刷新 —— 两个单调变量把 O(n²) 的对枚举压成 O(n)。若全程下跌，candidate 恒为负，best 停在 0（语义 = **干脆不买**，这也是 121 的合法答案）。记住这两个变量的含义：minPrice 是"最便宜的昨天"，best 是"最赚的卖出日"。`,{done:!0,result:i,day:t.length-1}),n}var Y_=`stocki-styles`,X_=34,Z_=62,Q_=76,$_=42,ev=132,tv=148,nv=168,rv=46,iv=228,av=56,ov=306,sv=604,cv=1500,lv=`
.siv { display: flex; flex-direction: column; gap: 14px; }
.siv__svg { width: 100%; height: auto; display: block; }

.siv-note {
  fill: var(--siv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.siv-note--r { text-anchor: end; }

.siv-cell__box {
  fill: var(--siv-fill, #ffffff); stroke: var(--siv-line, #c3c9c2); stroke-width: 1.5;
}
.siv-cell__val {
  fill: var(--siv-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.siv-cell__idx {
  fill: var(--siv-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.siv-cell.is-past .siv-cell__box { fill: var(--siv-past, #eef0ec); }
.siv-cell.is-min .siv-cell__box {
  fill: var(--siv-ok-fill, #eef5f1); stroke: var(--siv-ok, #3f6b57); stroke-width: 3;
}
.siv-cell.is-min .siv-cell__val { fill: var(--siv-ok, #3f6b57); }
.siv-cell.is-today .siv-cell__box {
  fill: var(--siv-gold-fill, #fdf3e3); stroke: var(--siv-gold, #c2872f); stroke-width: 3;
}
.siv-cell.is-today .siv-cell__val { fill: var(--siv-gold, #c2872f); }
.siv-cell.is-min.is-today .siv-cell__box {
  fill: var(--siv-gold-fill, #fdf3e3);
  stroke: var(--siv-gold, #c2872f); stroke-width: 3;
}

.siv-ptr { font-size: 11px; font-weight: 700; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.siv-ptr--m { fill: var(--siv-ok, #3f6b57); }
.siv-ptr--t { fill: var(--siv-gold, #c2872f); }
.siv-tri--m { fill: var(--siv-ok, #3f6b57); }
.siv-tri--t { fill: var(--siv-gold, #c2872f); }

.siv-banner__box {
  fill: var(--siv-banner, #f4f3ef); stroke: var(--siv-line, #c3c9c2); stroke-width: 1.5;
}
.siv-banner__text {
  fill: var(--siv-hot, #a45f45); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.siv-banner__text.is-ok { fill: var(--siv-ok, #3f6b57); }

.siv-panel__box {
  fill: var(--siv-fill, #ffffff); stroke: var(--siv-line, #c3c9c2); stroke-width: 1.5;
}
.siv-panel__label {
  fill: var(--siv-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.siv-panel__num {
  fill: var(--siv-ink, #1f2a24); font-size: 19px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.siv-panel__num.is-fresh { fill: var(--siv-gold, #c2872f); }
.siv-panel__num.is-final { fill: var(--siv-ok, #3f6b57); }

.siv-phase__text {
  fill: var(--siv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function uv(){if(document.getElementById(Y_))return;let e=document.createElement(`style`);e.id=Y_,e.textContent=lv,document.head.appendChild(e)}function dv(e,t={}){if(!e||e.dataset.stockiMounted===`1`)return{destroy(){}};e.dataset.stockiMounted=`1`,uv();let n=J_(t),r=t.autoplay!==!1,i=n[0].prices,a=Y,o=document.createElement(`div`);o.className=`viz siv`;let s=document.createElement(`div`);s.className=`viz__stage`,o.appendChild(s);let c=a(`svg`,{class:`viz__svg siv__svg`,viewBox:`0 0 660 328`,role:`img`,"aria-label":`买卖股票最佳时机 I LC121 推演动画`});s.appendChild(c);let l=a(`g`,{}),u=a(`g`,{});c.appendChild(l),c.appendChild(u);let d=a(`text`,{class:`siv-note`,x:26,y:X_});d.textContent=`先卖一把，再记最低价 —— 顺序即题意`,u.appendChild(d);let f=a(`text`,{class:`siv-note siv-note--r`,x:634,y:X_});f.textContent=`只许买卖一次`,u.appendChild(f);let p=i.length,m=Math.min(64,Math.floor((sv-(p-1)*6)/Math.max(1,p))),h=(660-(p*m+(p-1)*6))/2,g=e=>{let t=0;for(let n=1;n<=(e.phase===`done`?p-1:e.day);n+=1)i[n]<i[t]&&(t=n);return t},_=i.map((e,t)=>{let n=h+t*(m+6),r=a(`g`,{class:`siv-cell`});r.appendChild(a(`rect`,{class:`siv-cell__box`,x:n,y:Q_,width:m,height:$_,rx:6}));let i=a(`text`,{class:`siv-cell__val`,x:n+m/2,y:92});i.textContent=String(e),r.appendChild(i);let o=a(`text`,{class:`siv-cell__idx`,x:n+m/2,y:109});return o.textContent=String(t),r.appendChild(o),l.appendChild(r),{g:r,cx:n+m/2}}),v=a(`path`,{class:`siv-tri siv-tri--t`,d:``}),y=a(`text`,{class:`siv-ptr siv-ptr--t`,x:0,y:Z_});y.textContent=`today`;let b=a(`path`,{class:`siv-tri siv-tri--m`,d:``}),x=a(`text`,{class:`siv-ptr siv-ptr--m`,x:0,y:tv});x.textContent=`min`,u.append(v,y,b,x),u.appendChild(a(`rect`,{class:`siv-banner__box`,x:26,y:nv,width:608,height:rv,rx:9}));let S=a(`text`,{class:`siv-banner__text`,x:660/2,y:191});u.appendChild(S),u.appendChild(a(`rect`,{class:`siv-panel__box`,x:26,y:iv,width:608,height:av,rx:9}));let C=(e,t)=>{let n=a(`text`,{class:`siv-panel__label`,x:t,y:243});n.textContent=e;let r=a(`text`,{class:`siv-panel__num`,x:t,y:265});return u.append(n,r),r},w=C(`minPrice`,660/2-145),T=C(`candidate`,660/2-48),E=C(`best`,378),D=C(`day`,475),O=a(`text`,{class:`siv-phase__text`,x:660/2,y:ov});u.appendChild(O);let k=document.createElement(`p`);k.className=`viz__desc`,k.setAttribute(`aria-live`,`polite`);function A(e,t){if(!t)return;let n=g(t),r=t.phase===`done`?-1:t.day;_.forEach((e,i)=>{let a=[`siv-cell`];i===r?a.push(`is-today`):i===n?a.push(`is-min`):t.phase!==`init`&&i<t.day&&a.push(`is-past`),e.g.setAttribute(`class`,a.join(` `))});let i=(e,t,n)=>n===`down`?`M ${e-6} ${t-8} L ${e+6} ${t-8} L ${e} ${t+1} Z`:`M ${e-6} ${t+8} L ${e+6} ${t+8} L ${e} ${t-1} Z`;if(r>=0){let e=_[r].cx;v.setAttribute(`d`,i(e,Q_-4,`down`)),y.setAttribute(`x`,e),v.style.opacity=`1`,y.style.opacity=`1`}else v.setAttribute(`d`,``),v.style.opacity=`0`,y.style.opacity=`0`;let a=_[n].cx;if(b.setAttribute(`d`,i(a,ev,`up`)),x.setAttribute(`x`,a),t.phase===`scan`){let e=t.candidate>t.prevBest?`>`:t.candidate<t.prevBest?`<`:`=`,n=t.updated===`best`?`best 刷新 → ${t.best}`:t.updated===`minPrice`?`minPrice 下台阶`:`两变量不动（路过）`;S.textContent=`卖一把：${t.price} - ${t.prevMin} = ${t.candidate} ${e} best ${t.prevBest}  →  ${n}`,S.setAttribute(`class`,`siv-banner__text`+(t.updated===`best`?` is-ok`:``))}else t.phase===`done`?(S.textContent=`最大利润 = ${t.result}（minPrice 等来的那次上坡）`,S.setAttribute(`class`,`siv-banner__text is-ok`)):(S.textContent=`开局：minPrice = ${t.minPrice}，best = 0（还没卖过）`,S.setAttribute(`class`,`siv-banner__text`));w.textContent=String(t.minPrice),w.setAttribute(`class`,`siv-panel__num`+(t.updated===`minPrice`?` is-fresh`:``)),T.textContent=t.candidate===null?`—`:String(t.candidate),T.setAttribute(`class`,`siv-panel__num`+(t.phase===`scan`?` is-fresh`:``)),E.textContent=String(t.best),E.setAttribute(`class`,`siv-panel__num`+(t.phase===`done`?` is-final`:t.updated===`best`?` is-fresh`:``)),D.textContent=String(t.day),t.phase===`init`?O.textContent=`每天两件事：先卖一把，再记最低价`:t.updated===`best`?O.textContent=`上坡日：candidate 超过 best，刷新`:t.updated===`minPrice`?O.textContent=`下台阶日：更便宜的买入机会出现`:t.phase===`done`?O.textContent=`O(n)：两个单调变量吃掉 O(n²) 枚举`:O.textContent=`路过日：既不上坡也不破底，什么都不动`,Z(k,t.desc)}o.appendChild(k);let j=Q();o.appendChild(j.root),e.textContent=``,e.appendChild(o),X();let M=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,N=$({steps:n,controls:j,intervalMs:cv,onRender:A});N.jumpTo(Math.trunc(t.initialStep)||0);let P=null;return r&&!M&&typeof IntersectionObserver==`function`&&(P=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){P.disconnect(),P=null,N.play();return}},{threshold:.35}),P.observe(o)),{destroy(){P&&=(P.disconnect(),null),N.destroy(),e.textContent=``,delete e.dataset.stockiMounted,document.getElementById(Y_)?.remove()}}}var fv=[7,1,5,3,6,4];function pv(e={}){let t=Array.isArray(e.prices)&&e.prices.length>0?[...e.prices]:[...fv],n=[],r=0,i=-t[0],a=0,o=(e,o,s={})=>{n.push({phase:e,desc:o,prices:[...t],day:0,price:null,prevPrice:null,diff:null,take:null,greedy:a,prevGreedy:a,cash:r,hold:i,prevCash:r,prevHold:i,sellValue:null,buyValue:null,cashFrom:null,holdFrom:null,result:r,done:e===`done`,...s})};o(`init`,`价格序列 \`[${t.join(`, `)}]\`。可**无限次**买卖（先买后卖、同时最多持一股），求最大利润。每天收盘只有两种状态：\`cash\` = 空仓的最大利润，\`hold\` = 持股的最大利润。开局第 0 天：要么什么都没干 \`cash = 0\`，要么以 \`prices[0] = ${t[0]}\` 建仓 \`hold = -${t[0]}\`（负利润 —— 钱变成票了）。贪心侧同步开局：还没有任何差，\`greedy = 0\`。`,{day:0,cash:0,hold:-t[0],prevCash:0,prevHold:-t[0],greedy:0,prevGreedy:0});for(let e=1;e<t.length;e+=1){let n=t[e],s=t[e-1],c=r,l=i,u=a,d=n-s,f=d>0,p=l+n,m=c-n,h=Math.max(c,p),g=Math.max(l,m),_=u+(f?d:0);r=h,i=g,a=_;let v=p>c?`sell`:`keep`,y=m>l?`buy`:`keep`;o(`scan`,`**第 ${e} 天** \`price = ${n}\`，差值 \`diff = ${n} - ${s} = ${d>0?`+`:``}${d}\`。`+(f?`上坡 → 贪心**吃下**这段：\`greedy = ${u} + ${d} = ${a}\`。`:`下坡 → 贪心**跳过**（不持仓躲过去）：\`greedy\` 保持 ${a}。`)+` DP 侧两条转移同时打分：\`cash = max(空仓不动 ${c}, 今天卖 ${l} + ${n} = ${p}) = ${r}\`；\`hold = max(持股不动 ${l}, 今天买 ${c} - ${n} = ${m}) = ${i}\`。注意 hold 用的 buyValue 是**更新前**的 cash —— 卖和买不能在同一天既变现又建仓（先卖后买等价于"换仓"，题意允许）。看面板：\`greedy\` 与 \`cash\` **逐帧相等** —— 贪心就是这台状态机在"每天必做决定"下的投影。`,{day:e,price:n,prevPrice:s,diff:d,take:f,greedy:a,prevGreedy:u,cash:r,hold:i,prevCash:c,prevHold:l,sellValue:p,buyValue:m,cashFrom:v,holdFrom:y})}return o(`done`,`终态取 **\`cash = ${r}\`**（答案必在空仓侧 —— 持股未变现不算利润）。复盘：正差之和 = ${a}，与 cash 全程逐帧相等，两条路一个终点。等价操作是把每段上坡拆成独立交易：${t.slice(1).map((e,n)=>({d:n+1,diff:e-t[n]})).filter(e=>e.diff>0).map(e=>`第 ${e.d-1}→${e.d} 天 +${e.diff}`).join(`，`)||`（全程无上坡）`}。冷冻期 309 给 cash 加一支"昨天刚卖"、手续费 714 在卖的那支减 fee、限两笔 123 把 cash/hold 复制成四变量 —— 方程一改，机器照跑。`,{done:!0,result:r,day:t.length-1}),n}var mv=`stockii-styles`,hv=34,gv=72,_v=42,vv=129,yv=148,bv=58,xv=224,Sv=46,Cv=286,wv=56,Tv=364,Ev=604,Dv=1600,Ov=`
.sv2 { display: flex; flex-direction: column; gap: 14px; }
.sv2__svg { width: 100%; height: auto; display: block; }

.sv2-note {
  fill: var(--sv2-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-note--r { text-anchor: end; }

.sv2-cell__box {
  fill: var(--sv2-fill, #ffffff); stroke: var(--sv2-line, #c3c9c2); stroke-width: 1.5;
}
.sv2-cell__val {
  fill: var(--sv2-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-cell__idx {
  fill: var(--sv2-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-cell.is-past .sv2-cell__box { fill: var(--sv2-past, #eef0ec); }
.sv2-cell.is-today .sv2-cell__box {
  fill: var(--sv2-gold-fill, #fdf3e3); stroke: var(--sv2-gold, #c2872f); stroke-width: 3;
}
.sv2-cell.is-today .sv2-cell__val { fill: var(--sv2-gold, #c2872f); }

.sv2-diff {
  font-size: 11px; font-weight: 700; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-diff.is-up { fill: var(--sv2-ok, #3f6b57); }
.sv2-diff.is-down { fill: var(--sv2-dim, #9aa39c); }
.sv2-diff.is-live { font-size: 13px; }

.sv2-state__box {
  fill: var(--sv2-fill, #ffffff); stroke: var(--sv2-line, #c3c9c2); stroke-width: 1.5;
}
.sv2-state__box.is-win { stroke: var(--sv2-gold, #c2872f); stroke-width: 3; }
.sv2-state__label {
  fill: var(--sv2-muted, #657168); font-size: 11.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-state__num {
  fill: var(--sv2-ink, #1f2a24); font-size: 24px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-state__num.is-final { fill: var(--sv2-ok, #3f6b57); }

.sv2-banner__box {
  fill: var(--sv2-banner, #f4f3ef); stroke: var(--sv2-line, #c3c9c2); stroke-width: 1.5;
}
.sv2-banner__text {
  fill: var(--sv2-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-banner__text.is-ok { fill: var(--sv2-ok, #3f6b57); }

.sv2-panel__box {
  fill: var(--sv2-fill, #ffffff); stroke: var(--sv2-line, #c3c9c2); stroke-width: 1.5;
}
.sv2-panel__label {
  fill: var(--sv2-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-panel__num {
  fill: var(--sv2-ink, #1f2a24); font-size: 19px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-panel__num.is-fresh { fill: var(--sv2-gold, #c2872f); }

.sv2-phase__text {
  fill: var(--sv2-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function kv(){if(document.getElementById(mv))return;let e=document.createElement(`style`);e.id=mv,e.textContent=Ov,document.head.appendChild(e)}function Av(e,t={}){if(!e||e.dataset.stockiiMounted===`1`)return{destroy(){}};e.dataset.stockiiMounted=`1`,kv();let n=pv(t),r=t.autoplay!==!1,i=n[0].prices,a=Y,o=document.createElement(`div`);o.className=`viz sv2`;let s=document.createElement(`div`);s.className=`viz__stage`,o.appendChild(s);let c=a(`svg`,{class:`viz__svg sv2__svg`,viewBox:`0 0 660 386`,role:`img`,"aria-label":`买卖股票最佳时机 II LC122 推演动画`});s.appendChild(c);let l=a(`g`,{}),u=a(`g`,{});c.appendChild(l),c.appendChild(u);let d=a(`text`,{class:`sv2-note`,x:26,y:hv});d.textContent=`贪心吃正差 ≡ 状态机 cash/hold —— 盯住两列逐帧相等`,u.appendChild(d);let f=a(`text`,{class:`sv2-note sv2-note--r`,x:634,y:hv});f.textContent=`可无限次买卖`,u.appendChild(f);let p=i.length,m=Math.min(64,Math.floor((Ev-(p-1)*6)/Math.max(1,p))),h=(660-(p*m+(p-1)*6))/2,g=i.map((e,t)=>{let n=h+t*(m+6),r=a(`g`,{class:`sv2-cell`});r.appendChild(a(`rect`,{class:`sv2-cell__box`,x:n,y:gv,width:m,height:_v,rx:6}));let i=a(`text`,{class:`sv2-cell__val`,x:n+m/2,y:88});i.textContent=String(e),r.appendChild(i);let o=a(`text`,{class:`sv2-cell__idx`,x:n+m/2,y:105});return o.textContent=String(t),r.appendChild(o),l.appendChild(r),{g:r,cx:n+m/2,x:n}}),_=[];for(let e=1;e<p;e+=1){let t=a(`text`,{class:`sv2-diff`,x:g[e-1].x+m+6/2,y:vv});u.appendChild(t),_.push(t)}let v=a(`rect`,{class:`sv2-state__box`,x:120/2,y:yv,width:250,height:bv,rx:10}),y=a(`rect`,{class:`sv2-state__box`,x:350,y:yv,width:250,height:bv,rx:10}),b=a(`text`,{class:`sv2-state__label`,x:185,y:162});b.textContent=`cash（空仓最大利润）`;let x=a(`text`,{class:`sv2-state__label`,x:475,y:162});x.textContent=`hold（持股最大利润）`;let S=a(`text`,{class:`sv2-state__num`,x:185,y:186}),C=a(`text`,{class:`sv2-state__num`,x:475,y:186});u.append(v,y,b,x,S,C),u.appendChild(a(`rect`,{class:`sv2-banner__box`,x:26,y:xv,width:608,height:Sv,rx:9}));let w=a(`text`,{class:`sv2-banner__text`,x:660/2,y:247});u.appendChild(w),u.appendChild(a(`rect`,{class:`sv2-panel__box`,x:26,y:Cv,width:608,height:wv,rx:9}));let T=(e,t)=>{let n=a(`text`,{class:`sv2-panel__label`,x:t,y:301});n.textContent=e;let r=a(`text`,{class:`sv2-panel__num`,x:t,y:323});return u.append(n,r),r},E=T(`diff`,660/2-165),D=T(`greedy`,660/2-55),O=T(`cash`,385),k=T(`hold`,495),A=a(`text`,{class:`sv2-phase__text`,x:660/2,y:Tv});u.appendChild(A);let j=document.createElement(`p`);j.className=`viz__desc`,j.setAttribute(`aria-live`,`polite`);function M(e,t){if(!t)return;let n=t.phase===`done`?-1:t.day;g.forEach((e,r)=>{let i=[`sv2-cell`];r===n?i.push(`is-today`):t.phase!==`init`&&r<t.day&&i.push(`is-past`),e.g.setAttribute(`class`,i.join(` `))});for(let e=1;e<p;e+=1){let n=_[e-1];if(t.phase===`init`||e>t.day){n.textContent=``;continue}let r=i[e]-i[e-1],a=r>0,o=t.phase===`scan`&&e===t.day;n.textContent=`${a?`+`:``}${r}`,n.setAttribute(`class`,`sv2-diff ${a?`is-up`:`is-down`}`+(o?` is-live`:``))}S.textContent=String(t.cash),C.textContent=String(t.hold),v.setAttribute(`class`,`sv2-state__box`+(t.cashFrom===`sell`?` is-win`:``)),y.setAttribute(`class`,`sv2-state__box`+(t.holdFrom===`buy`?` is-win`:``)),S.setAttribute(`class`,`sv2-state__num`+(t.phase===`done`?` is-final`:``)),C.setAttribute(`class`,`sv2-state__num`),t.phase===`scan`?(w.textContent=`cash = max(${t.prevCash}, ${t.prevHold}+${t.price}=${t.sellValue}) = ${t.cash}   hold = max(${t.prevHold}, ${t.prevCash}-${t.price}=${t.buyValue}) = ${t.hold}`,w.setAttribute(`class`,`sv2-banner__text`+(t.cash>t.prevCash?` is-ok`:``))):t.phase===`done`?(w.textContent=`答案 = cash = ${t.result}（终态必须空仓；hold=${t.hold} 是"如果死拿"）`,w.setAttribute(`class`,`sv2-banner__text is-ok`)):(w.textContent=`开局：cash = 0（空仓）  hold = ${t.hold}（第 0 天建仓，钱变票）`,w.setAttribute(`class`,`sv2-banner__text`)),E.textContent=t.diff===null?`—`:`${t.diff>0?`+`:``}${t.diff}`,E.setAttribute(`class`,`sv2-panel__num`+(t.phase===`scan`?` is-fresh`:``)),D.textContent=String(t.greedy),D.setAttribute(`class`,`sv2-panel__num`+(t.take?` is-fresh`:``)),O.textContent=String(t.cash),k.textContent=String(t.hold),t.phase===`init`?A.textContent=`每天收盘：要么空仓 cash，要么持股 hold`:t.take?A.textContent=`上坡：贪心吃下 +差，DP 侧 cash 由"今天卖"刷新`:t.phase===`done`?A.textContent=`greedy 与 cash 全程逐帧相等 —— 贪心 ≡ 状态机`:A.textContent=`下坡：贪心跳过，DP 侧 hold 由"低位补仓"刷新`,Z(j,t.desc)}o.appendChild(j);let N=Q();o.appendChild(N.root),e.textContent=``,e.appendChild(o),X();let P=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,F=$({steps:n,controls:N,intervalMs:Dv,onRender:M});F.jumpTo(Math.trunc(t.initialStep)||0);let I=null;return r&&!P&&typeof IntersectionObserver==`function`&&(I=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){I.disconnect(),I=null,F.play();return}},{threshold:.35}),I.observe(o)),{destroy(){I&&=(I.disconnect(),null),F.destroy(),e.textContent=``,delete e.dataset.stockiiMounted,document.getElementById(mv)?.remove()}}}var jv=[1,2,5],Mv=11,Nv=1/0;function Pv(e={}){let t=(Array.isArray(e.coins)?e.coins:[]).filter(e=>Number.isInteger(e)&&e>0),n=Number.isInteger(e.amount)&&e.amount>=0?e.amount:Mv;return{coins:t.length>0?t:[...jv],amount:n}}var Fv=e=>e===Nv?`∞`:String(e);function Iv(e={}){let{coins:t,amount:n}=Pv(e),r=[],i=Array(n+1).fill(Nv);i[0]=0;let a=Array(n+1).fill(null),o=(e,a,o={})=>{r.push({phase:e,desc:a,coins:[...t],amount:n,a:-1,dp:[...i],prevDp:[...i],trials:[],best:null,fromCoin:null,sourceIdx:null,traceIdx:-1,traceCoin:null,picked:[],combination:[],result:i[n]===Nv?-1:i[n],done:e===`done`,...o})};o(`init`,`硬币面额 \`[${t.join(`, `)}]\`，目标金额 \`${n}\`，每种硬币**数量不限**，求最少枚数。定义 \`dp[x]\` = 凑出金额 \`x\` 的**最少硬币枚数**：边界 \`dp[0] = 0\`（零元一枚都不用），其余全部初始化成 **∞** —— 先假定凑不出，凑得出再往下降。递推式 \`dp[x] = min( dp[x-c] + 1 )\`：把每枚硬币当作"最后一枚"试一遍，看剩下的 \`x-c\` 最少要几枚、再补上这一枚。金额 \`x\` 从 1 到 ${n} **正序**推进，算 \`dp[x]\` 时用到的 \`dp[x-c]\`（下标更小）早已就绪 —— 这正是"硬币可以重复用"的开关。`);for(let e=1;e<=n;e+=1){let n=[...i],r=[],s=Nv,c=null;for(let i of t){let t=e-i;if(t<0){r.push({coin:i,idx:-1,prev:null,value:Nv,ok:!1,reachable:!1});continue}let a=n[t],o=a+1,l=o<s;l&&(s=o,c=i),r.push({coin:i,idx:t,prev:a,value:o,ok:l,reachable:a!==Nv})}i[e]=s,a[e]=c;let l=r.map(t=>t.idx<0?`\`${t.coin}\` 比 ${e} 大，跳过`:t.prev===Nv?`\`${t.coin}\`：dp[${t.idx}] = ∞ 此路不通`:`\`${t.coin}\`：dp[${t.idx}] + 1 = ${t.prev} + 1 = ${t.value}${t.ok?` ✓`:``}`).join(`；`),u=c===null?null:e-c;o(`fill`,`金额 **${e}**：逐个试硬币 —— ${l}。`+(c===null?`三种试法全不可达，\`dp[${e}] = ∞\`（此刻还凑不出）。`:`最小是 ${s}（最后一枚用 \`${c}\`，来源 \`dp[${u}] = ${Fv(n[u])}\`），\`dp[${e}] = ${s}\`。`)+`注意比较用的是**更新前**的 dp，且来源格 \`${u??`—`}\` 下标更小、**可能已经用过这枚硬币** —— 无限复用就发生在这一步。`,{a:e,prevDp:n,trials:r,best:s,fromCoin:c,sourceIdx:u})}let s=i[n]!==Nv,c=[],l=[n];if(s&&n>0){let e=n;for(;e>0;){let t=a[e],n=e-t;c.push(t),l.push(n),o(`trace`,`**回溯**：\`dp[${e}] = ${Fv(i[e])}\`，取到它的最后一枚是 \`${t}\`，于是跳到 \`dp[${n}] = ${Fv(i[n])}\`（${Fv(i[e])} = ${Fv(i[n])} + 1）。已锁定的硬币：${c.map(e=>`\`${e}\``).join(` + `)}。只记枚数还原不出组合，靠的就是这张 \`chosen\` 前驱表。`,{a:e,traceIdx:e,traceCoin:t,sourceIdx:n,picked:[...c]}),e=n}}let u=[...c].reverse();return o(`done`,s?n===0?`返回 **0**：金额为 0，一枚都不用凑。`:`返回 **${i[n]}**：组合 \`${u.join(` + `)} = ${n}\`，共 ${u.length} 枚。回溯链 \`${l.join(` → `)}\`。复盘：\`dp[x]\` 只在正序推进下才允许"自己再叠一枚自己"，这是完全背包与 0-1 背包的**唯一**分界线（见动画 2）。`:`返回 **-1**：\`dp[${n}] = ∞\`，任何硬币组合都凑不出 ${n}。注意 ∞ 在比较里会一路"沉底"—— 只有真正可达的路径才有机会刷新它。`,{a:-1,combination:u,picked:[...c],done:!0}),r}var Lv=`coinchange-styles`,Rv=1/0,zv=30,Bv=56,Vv=44,Hv=108,Uv=120,Wv=48,Gv=184,Kv=44,qv=242,Jv=54,Yv=316,Xv=604,Zv=1350,Qv=`
.ccv { display: flex; flex-direction: column; gap: 14px; }
.ccv__svg { width: 100%; height: auto; display: block; }

.ccv-note {
  fill: var(--ccv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-note--r { text-anchor: end; }

.ccv-cell__box {
  fill: var(--ccv-fill, #ffffff); stroke: var(--ccv-line, #c3c9c2); stroke-width: 1.5;
}
.ccv-cell__val {
  fill: var(--ccv-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-cell__idx {
  fill: var(--ccv-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-cell.is-past .ccv-cell__box { fill: var(--ccv-past, #eef0ec); }
.ccv-cell.is-unreach .ccv-cell__val { fill: var(--ccv-dim, #9aa39c); font-weight: 500; }
.ccv-cell.is-unreach .ccv-cell__box { stroke-dasharray: 3 3; }
.ccv-cell.is-source .ccv-cell__box {
  fill: var(--ccv-ok-fill, #eef5f1); stroke: var(--ccv-ok, #3f6b57); stroke-width: 3;
}
.ccv-cell.is-source .ccv-cell__val { fill: var(--ccv-ok, #3f6b57); }
.ccv-cell.is-target .ccv-cell__box {
  fill: var(--ccv-gold-fill, #fdf3e3); stroke: var(--ccv-gold, #c2872f); stroke-width: 3;
}
.ccv-cell.is-target .ccv-cell__val { fill: var(--ccv-gold, #c2872f); }
.ccv-cell.is-locked .ccv-cell__box {
  fill: var(--ccv-ok-fill, #eef5f1); stroke: var(--ccv-ok, #3f6b57); stroke-width: 2.5;
}
.ccv-cell.is-locked .ccv-cell__val { fill: var(--ccv-ok, #3f6b57); }

.ccv-arc { fill: none; stroke: var(--ccv-ok, #3f6b57); stroke-width: 2; opacity: 0.85; }
.ccv-arc__head { fill: var(--ccv-ok, #3f6b57); opacity: 0.85; }

.ccv-trial__box {
  fill: var(--ccv-fill, #ffffff); stroke: var(--ccv-line, #c3c9c2); stroke-width: 1.5;
}
.ccv-trial.is-win .ccv-trial__box { stroke: var(--ccv-gold, #c2872f); stroke-width: 3;
  fill: var(--ccv-gold-fill, #fdf3e3); }
.ccv-trial.is-dead .ccv-trial__box { stroke-dasharray: 3 3; fill: var(--ccv-past, #eef0ec); }
.ccv-trial__coin {
  fill: var(--ccv-ink, #1f2a24); font-size: 16px; font-weight: 800;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-trial.is-win .ccv-trial__coin { fill: var(--ccv-gold, #c2872f); }
.ccv-trial__expr {
  fill: var(--ccv-muted, #657168); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-trial.is-win .ccv-trial__expr { fill: var(--ccv-gold, #c2872f); font-weight: 700; }
.ccv-trial__cap {
  fill: var(--ccv-dim, #9aa39c); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.ccv-banner__box {
  fill: var(--ccv-banner, #f4f3ef); stroke: var(--ccv-line, #c3c9c2); stroke-width: 1.5;
}
.ccv-banner__text {
  fill: var(--ccv-hot, #a45f45); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-banner__text.is-ok { fill: var(--ccv-ok, #3f6b57); }

.ccv-panel__box {
  fill: var(--ccv-fill, #ffffff); stroke: var(--ccv-line, #c3c9c2); stroke-width: 1.5;
}
.ccv-panel__label {
  fill: var(--ccv-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-panel__num {
  fill: var(--ccv-ink, #1f2a24); font-size: 19px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-panel__num.is-fresh { fill: var(--ccv-gold, #c2872f); }
.ccv-panel__num.is-final { fill: var(--ccv-ok, #3f6b57); }
.ccv-panel__num.is-dead { fill: var(--ccv-dim, #9aa39c); }

.ccv-phase__text {
  fill: var(--ccv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function $v(){if(document.getElementById(Lv))return;let e=document.createElement(`style`);e.id=Lv,e.textContent=Qv,document.head.appendChild(e)}var ey=e=>e===Rv?`∞`:String(e);function ty(e,t={}){if(!e||e.dataset.coinchangeMounted===`1`)return{destroy(){}};e.dataset.coinchangeMounted=`1`,$v();let n=Iv(t),r=t.autoplay!==!1,i=n[0].coins,a=n[0].amount,o=Y,s=document.createElement(`div`);s.className=`viz ccv`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=o(`svg`,{class:`viz__svg ccv__svg`,viewBox:`0 0 660 338`,role:`img`,"aria-label":`零钱兑换 LC322 推演动画`});c.appendChild(l);let u=o(`g`,{}),d=o(`g`,{});l.appendChild(u),l.appendChild(d);let f=o(`text`,{class:`ccv-note`,x:26,y:zv});f.textContent=`正序推进金额：来源格下标更小、可能已用过这枚硬币`,d.appendChild(f);let p=o(`text`,{class:`ccv-note ccv-note--r`,x:634,y:zv});p.textContent=`硬币 [${i.join(`, `)}] · 目标 ${a}`,d.appendChild(p);let m=a+1,h=Math.min(52,Math.floor((Xv-(m-1)*5)/Math.max(1,m))),g=(660-(m*h+(m-1)*5))/2,_=[];for(let e=0;e<=a;e+=1){let t=g+e*(h+5),n=o(`g`,{class:`ccv-cell`});n.appendChild(o(`rect`,{class:`ccv-cell__box`,x:t,y:Bv,width:h,height:Vv,rx:6}));let r=o(`text`,{class:`ccv-cell__val`,x:t+h/2,y:72});n.appendChild(r);let i=o(`text`,{class:`ccv-cell__idx`,x:t+h/2,y:91});i.textContent=String(e),n.appendChild(i),u.appendChild(n),_.push({g:n,val:r,cx:t+h/2,x:t})}let v=o(`path`,{class:`ccv-arc`,d:``}),y=o(`path`,{class:`ccv-arc__head`,d:``});d.append(v,y);let b=o(`text`,{class:`ccv-trial__cap`,x:26,y:Uv-2});b.setAttribute(`text-anchor`,`start`),d.appendChild(b);let x=i.length,S=Math.min(160,Math.floor((Xv-(x-1)*10)/Math.max(1,x))),C=(660-(x*S+(x-1)*10))/2,w=i.map((e,t)=>{let n=C+t*(S+10),r=o(`g`,{class:`ccv-trial`});r.appendChild(o(`rect`,{class:`ccv-trial__box`,x:n,y:Uv,width:S,height:Wv,rx:7}));let i=o(`text`,{class:`ccv-trial__coin`,x:n+S/2,y:136});i.textContent=String(e),r.appendChild(i);let a=o(`text`,{class:`ccv-trial__expr`,x:n+S/2,y:154});return r.appendChild(a),d.appendChild(r),{g:r,coin:i,expr:a}});d.appendChild(o(`rect`,{class:`ccv-banner__box`,x:26,y:Gv,width:608,height:Kv,rx:9}));let T=o(`text`,{class:`ccv-banner__text`,x:660/2,y:206});d.appendChild(T),d.appendChild(o(`rect`,{class:`ccv-panel__box`,x:26,y:qv,width:608,height:Jv,rx:9}));let E=(e,t)=>{let n=o(`text`,{class:`ccv-panel__label`,x:t,y:257});n.textContent=e;let r=o(`text`,{class:`ccv-panel__num`,x:t,y:279});return d.append(n,r),r},D=E(`金额 a`,660/2-190),O=E(`dp[a]`,660/2-65),k=E(`fromCoin`,395),A=E(`result`,520),j=o(`text`,{class:`ccv-phase__text`,x:660/2,y:Yv});d.appendChild(j);let M=document.createElement(`p`);M.className=`viz__desc`,M.setAttribute(`aria-live`,`polite`);function N(e,t){if(!t)return;let n=new Set;if(t.phase===`trace`){let e=a;for(let r of t.picked)n.add(e),e-=r;n.add(0)}if(_.forEach((e,r)=>{let i=[`ccv-cell`],a=r===t.a,o=t.sourceIdx!==null&&r===t.sourceIdx;a?i.push(`is-target`):o?i.push(`is-source`):t.phase===`trace`&&n.has(r)?i.push(`is-locked`):t.phase===`fill`&&r<t.a&&i.push(`is-past`),t.dp[r]===Rv&&i.push(`is-unreach`),e.g.setAttribute(`class`,i.join(` `)),e.val.textContent=ey(t.dp[r])}),t.sourceIdx!==null&&t.sourceIdx!==t.a){let e=_[t.sourceIdx].cx,n=_[t.a].cx;v.setAttribute(`d`,`M ${e} 100 Q ${(e+n)/2} ${Hv} ${n} 101`);let r=n>e?-1:1;y.setAttribute(`d`,`M ${n} 101 L ${n+r*6} 95 L ${n-r*6} 95 Z`)}else v.setAttribute(`d`,``),y.setAttribute(`d`,``);if(t.phase===`fill`?(b.textContent=`试每一枚当"最后一枚"：`,w.forEach((e,n)=>{let r=t.trials[n];e.g.style.display=``,e.g.setAttribute(`class`,`ccv-trial`+(r.ok?` is-win`:r.idx<0||!r.reachable?` is-dead`:``)),e.coin.textContent=String(r.coin),e.expr.textContent=r.idx<0?`${r.coin} > ${t.a} 跳过`:`dp[${r.idx}]+1 = ${ey(r.value)}`})):t.phase===`trace`?(b.textContent=`前驱链已锁定：`,w.forEach((e,n)=>{let r=t.picked[n];if(r===void 0){e.g.style.display=`none`;return}e.g.style.display=``,e.g.setAttribute(`class`,`ccv-trial is-win`),e.coin.textContent=String(r),e.expr.textContent=`第 ${n+1} 枚`})):(b.textContent=``,w.forEach(e=>{e.g.style.display=`none`})),t.phase===`fill`){let e=t.trials.filter(e=>e.idx>=0).map(e=>`dp[${e.idx}]+1=${ey(e.value)}`);T.textContent=`dp[${t.a}] = min(${e.join(`, `)}) = ${ey(t.dp[t.a])}`,T.setAttribute(`class`,`ccv-banner__text`+(t.fromCoin===null?``:` is-ok`))}else t.phase===`trace`?(T.textContent=`回溯：dp[${t.a}] = dp[${t.sourceIdx}] + 1 = ${ey(t.dp[t.sourceIdx])} + 1 = ${ey(t.dp[t.a])}`,T.setAttribute(`class`,`ccv-banner__text is-ok`)):t.phase===`done`?(T.textContent=t.result===-1?`答案 = -1：dp[${a}] = ∞，任何组合都凑不出`:`答案 = ${t.result}：${t.combination.join(` + `)} = ${a}`,T.setAttribute(`class`,`ccv-banner__text`+(t.result===-1?``:` is-ok`))):(T.textContent=`开局：dp[0] = 0，其余全是 ∞`,T.setAttribute(`class`,`ccv-banner__text`));D.textContent=t.a<0?`—`:String(t.a),O.textContent=t.a<0?ey(t.dp[a]):ey(t.dp[t.a]),O.setAttribute(`class`,`ccv-panel__num`+(t.a>=0&&t.dp[t.a]!==Rv?` is-fresh`:``)+(t.a>=0&&t.dp[t.a]===Rv?` is-dead`:``)+(t.phase===`done`&&t.result!==-1?` is-final`:``)),k.textContent=t.phase===`fill`?t.fromCoin===null?`—`:String(t.fromCoin):t.traceCoin===null?`—`:String(t.traceCoin),A.textContent=String(t.result),A.setAttribute(`class`,`ccv-panel__num`+(t.phase===`done`?t.result===-1?` is-dead`:` is-final`:``)),t.phase===`init`?j.textContent=`dp[x] = 凑出金额 x 的最少硬币枚数`:t.phase===`fill`?j.textContent=t.fromCoin===null?`这枚金额此刻还凑不出 → 保持 ∞`:`dp[${t.a}] 由硬币 ${t.fromCoin} 从 dp[${t.sourceIdx}] 转移而来`:t.phase===`trace`?j.textContent=`顺 chosen 前驱表走回 dp[0]，路径就是最优组合`:j.textContent=t.result===-1?`∞ 在 min 里一路沉底，最后原样返回`:`只记枚数还原不出组合 —— 前驱表才带得回硬币`,Z(M,t.desc)}s.appendChild(M);let P=Q();s.appendChild(P.root),e.textContent=``,e.appendChild(s),X();let F=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,I=$({steps:n,controls:P,intervalMs:Zv,onRender:N});I.jumpTo(Math.trunc(t.initialStep)||0);let L=null;return r&&!F&&typeof IntersectionObserver==`function`&&(L=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){L.disconnect(),L=null,I.play();return}},{threshold:.35}),L.observe(s)),{destroy(){L&&=(L.disconnect(),null),I.destroy(),e.textContent=``,delete e.dataset.coinchangeMounted,document.getElementById(Lv)?.remove()}}}var ny=[1,2,5],ry=11,iy=1/0;function ay(e={}){let t=(Array.isArray(e.coins)?e.coins:[]).filter(e=>Number.isInteger(e)&&e>0),n=Number.isInteger(e.amount)&&e.amount>=0?e.amount:ry;return{coins:t.length>0?t:[...ny],amount:n}}var oy=e=>e===iy?`∞`:String(e),sy=e=>e===iy?-1:e;function cy(e={}){let{coins:t,amount:n}=ay(e),r=[],i=Array(n+1).fill(iy),a=Array(n+1).fill(iy);i[0]=0,a[0]=0;let o=(e,o,s={})=>{r.push({phase:e,desc:o,coins:[...t],amount:n,coinIndex:-1,coin:null,step:0,a:-1,descA:-1,dpAsc:[...i],prevDpAsc:[...i],ascRead:null,ascValue:null,ascUpdated:!1,dpDesc:[...a],prevDpDesc:[...a],descRead:null,descValue:null,descUpdated:!1,ascResult:sy(i[n]),descResult:sy(a[n]),result:sy(i[n]),done:e===`done`,...s})};o(`init`,`把 LC 322 写成背包：**外层面额、内层金额**。硬币 \`[${t.join(`, `)}]\`，目标 \`${n}\`。两块面板的方程**逐字相同**：\`dp[a] = min(dp[a], dp[a-c] + 1)\`；唯一的区别是内层金额的**遍历方向**。左：\`a\` 从 1 到 ${n} **正序**（本轮扫过的区间从左往右长）；右：\`a\` 从 ${n} 降到 1 **逆序**（往左长）。开局两边都是 \`dp[0] = 0\`、其余 **∞**（先假定凑不出）。每一帧同时推两格，盯住"来源格 \`dp[a-c]\` 读到的到底是本轮的新值还是上一轮的老值"。`);for(let e=0;e<t.length;e+=1){let r=t[e],s=[...a],c=[...s];for(let t=1;t<=n;t+=1){let l=t,u=n+1-t,d=[...i],f=[...a],p=null,m=null,h=!1,g=l-r;g>=0&&(p=d[g],m=p+1,m<d[l]&&(i[l]=m,h=!0));let _=null,v=null,y=!1,b=u-r;b>=0&&(_=s[b],v=_+1,v<c[u]&&(c[u]=v,y=!0)),a=s.map((e,t)=>t>=u?c[t]:e);let x=g<0?`\`${l} < ${r}\` 装不下，跳过`:`来源 \`dp[${g}] = ${oy(p)}\` 是**本轮已经刷过的新值**，\`+1 = ${m}\` → ${h?`刷新成 **${i[l]}**`:`不优于现值 ${oy(d[l])}`}`,S=b<0?`\`${u} < ${r}\` 装不下，跳过`:`来源 \`dp[${b}] = ${oy(_)}\` 还是**本轮没碰过的旧值**，\`+1 = ${v}\` → ${y?`刷新成 **${a[u]}**`:`不优于现值 ${oy(f[u])}`}`;o(`update`,`第 ${e+1} 枚硬币 \`c = ${r}\`，本轮第 ${t} 步。**正序（左）处理金额 ${l}**：${x}。**逆序（右）处理金额 ${u}**：${S}。同一行代码，唯一差别是左边的 \`dp[a-c]\` 属于"本轮已经扫过的区间"，右边的不属于 —— 于是左边能"再叠一枚 c"，右边不能。`,{coinIndex:e,coin:r,step:t,a:l,descA:u,prevDpAsc:d,ascRead:p,ascValue:m,ascUpdated:h,prevDpDesc:f,descRead:_,descValue:v,descUpdated:y})}}let s=sy(i[n]),c=sy(a[n]);return o(`done`,`终局：**正序 \`dp[${n}] = ${oy(i[n])}\` → 答案 ${s}**（完全背包，硬币可复用）；逆序 \`dp[${n}] = ${oy(a[n])}\` → ${c}（0-1 背包，每枚硬币最多一次）。`+(c===-1?`逆序不是"算得慢"，而是**题意被改掉了**：三枚硬币总面额 ${t.reduce((e,t)=>e+t,0)} < ${n}，每枚最多用一次永远凑不出。`:`逆序把每枚硬币都锁成一次，答案与正序不同 —— 同样的代码，换个方向就不是这道题了。`)+`记住这条分界线：**内层金额正序 = 完全背包**（322 对），**逆序 = 0-1 背包**（416 分割等和、1049 最后一块石头这类"每件用一次"的用逆序）。也能反过来记：正序读"同一轮已经写好的自己"，逆序读"上一轮留下的自己"。`,{done:!0,result:s}),r}var ly=`coinorder-styles`,uy=1/0,dy=30,fy=58,py=66,my=38,hy=118,gy=148,_y=156,vy=208,yy=226,by=46,xy=286,Sy=54,Cy=358,wy=604,Ty=850,Ey=`
.cco { display: flex; flex-direction: column; gap: 14px; }
.cco__svg { width: 100%; height: auto; display: block; }

.cco-note {
  fill: var(--cco-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-note--r { text-anchor: end; }

.cco-title { font-size: 13px; font-weight: 800; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.cco-title--asc { fill: var(--cco-ok, #3f6b57); }
.cco-title--desc { fill: var(--cco-hot, #a45f45); }

.cco-cell__box {
  fill: var(--cco-fill, #ffffff); stroke: var(--cco-line, #c3c9c2); stroke-width: 1.5;
}
.cco-cell__val {
  fill: var(--cco-ink, #1f2a24); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-cell__idx {
  fill: var(--cco-dim, #9aa39c); font-size: 9px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-cell.is-unreach .cco-cell__val { fill: var(--cco-dim, #9aa39c); font-weight: 500; }
.cco-cell.is-unreach .cco-cell__box { stroke-dasharray: 3 3; }
.cco-cell.is-scanned .cco-cell__box { fill: var(--cco-scan, #f2f6f3); }
.cco-cell.is-from .cco-cell__box {
  fill: var(--cco-ok-fill, #eef5f1); stroke: var(--cco-ok, #3f6b57); stroke-width: 2.5;
}
.cco-cell.is-from .cco-cell__val { fill: var(--cco-ok, #3f6b57); }
.cco-cell.is-target .cco-cell__box {
  fill: var(--cco-gold-fill, #fdf3e3); stroke: var(--cco-gold, #c2872f); stroke-width: 3;
}
.cco-cell.is-target .cco-cell__val { fill: var(--cco-gold, #c2872f); }

.cco-cap {
  fill: var(--cco-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-cap--asc { fill: var(--cco-ok, #3f6b57); }
.cco-cap--desc { fill: var(--cco-hot, #a45f45); }

.cco-banner__box {
  fill: var(--cco-banner, #f4f3ef); stroke: var(--cco-line, #c3c9c2); stroke-width: 1.5;
}
.cco-banner__text {
  fill: var(--cco-ink, #1f2a24); font-size: 12.5px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-banner__text.is-ok { fill: var(--cco-ok, #3f6b57); }
.cco-banner__text.is-warn { fill: var(--cco-hot, #a45f45); }

.cco-panel__box {
  fill: var(--cco-fill, #ffffff); stroke: var(--cco-line, #c3c9c2); stroke-width: 1.5;
}
.cco-panel__label {
  fill: var(--cco-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-panel__num {
  fill: var(--cco-ink, #1f2a24); font-size: 19px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-panel__num.is-asc { fill: var(--cco-ok, #3f6b57); }
.cco-panel__num.is-desc { fill: var(--cco-hot, #a45f45); }
.cco-panel__num.is-dead { fill: var(--cco-dim, #9aa39c); }

.cco-phase__text {
  fill: var(--cco-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function Dy(){if(document.getElementById(ly))return;let e=document.createElement(`style`);e.id=ly,e.textContent=Ey,document.head.appendChild(e)}var Oy=e=>e===uy?`∞`:String(e);function ky(e,t={}){if(!e||e.dataset.coinorderMounted===`1`)return{destroy(){}};e.dataset.coinorderMounted=`1`,Dy();let n=cy(t),r=t.autoplay!==!1,i=n[0].coins,a=n[0].amount,o=Y,s=document.createElement(`div`);s.className=`viz cco`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=o(`svg`,{class:`viz__svg cco__svg`,viewBox:`0 0 660 380`,role:`img`,"aria-label":`零钱兑换 LC322 金额正序与逆序对照动画`});c.appendChild(l);let u=o(`g`,{}),d=o(`g`,{});l.appendChild(u),l.appendChild(d);let f=o(`text`,{class:`cco-note`,x:26,y:dy});f.textContent=`同一行方程，只差内层金额的方向`,d.appendChild(f);let p=o(`text`,{class:`cco-note cco-note--r`,x:634,y:dy});p.textContent=`硬币 [${i.join(`, `)}] · 目标 ${a}`,d.appendChild(p);let m=a+1,h=Math.min(46,Math.floor((wy-(m-1)*5)/Math.max(1,m))),g=(660-(m*h+(m-1)*5))/2,_=e=>{let t=[];for(let n=0;n<=a;n+=1){let r=g+n*(h+5),i=o(`g`,{class:`cco-cell`});i.appendChild(o(`rect`,{class:`cco-cell__box`,x:r,y:e,width:h,height:my,rx:5}));let a=o(`text`,{class:`cco-cell__val`,x:r+h/2,y:e+my/2-5});i.appendChild(a);let s=o(`text`,{class:`cco-cell__idx`,x:r+h/2,y:e+my/2+11});s.textContent=String(n),i.appendChild(s),u.appendChild(i),t.push({g:i,val:a,cx:r+h/2})}return t},v=o(`text`,{class:`cco-title cco-title--asc`,x:26,y:fy});v.setAttribute(`text-anchor`,`start`),v.textContent=`正序 1 → ${a}　完全背包（硬币可复用）`;let y=o(`text`,{class:`cco-title cco-title--desc`,x:26,y:gy});y.setAttribute(`text-anchor`,`start`),y.textContent=`逆序 ${a} → 1　0-1 背包（每枚最多一次）`,d.append(v,y);let b=_(py),x=_(_y),S=o(`text`,{class:`cco-cap cco-cap--asc`,x:660/2,y:hy}),C=o(`text`,{class:`cco-cap cco-cap--desc`,x:660/2,y:vy});d.append(S,C),d.appendChild(o(`rect`,{class:`cco-banner__box`,x:26,y:yy,width:608,height:by,rx:9}));let w=o(`text`,{class:`cco-banner__text`,x:660/2,y:249});d.appendChild(w),d.appendChild(o(`rect`,{class:`cco-panel__box`,x:26,y:xy,width:608,height:Sy,rx:9}));let T=(e,t)=>{let n=o(`text`,{class:`cco-panel__label`,x:t,y:301});n.textContent=e;let r=o(`text`,{class:`cco-panel__num`,x:t,y:323});return d.append(n,r),r},E=T(`coin`,660/2-175),D=T(`本轮第几步`,660/2-45),O=T(`正序 dp[amount]`,425),k=T(`逆序 dp[amount]`,550),A=o(`text`,{class:`cco-phase__text`,x:660/2,y:Cy});d.appendChild(A);let j=document.createElement(`p`);j.className=`viz__desc`,j.setAttribute(`aria-live`,`polite`);function M(e,t,n,r,i,a){e.forEach((e,o)=>{let s=[`cco-cell`];o===n?s.push(`is-target`):o===r?s.push(`is-from`):o>=i&&o<=a&&s.push(`is-scanned`),t[o]===uy&&s.push(`is-unreach`),e.g.setAttribute(`class`,s.join(` `)),e.val.textContent=Oy(t[o])})}function N(e,t){if(!t)return;let n=t.phase===`update`,r=t.coin,i=n&&r!==null&&t.a-r>=0?t.a-r:null,o=n&&r!==null&&t.descA-r>=0?t.descA-r:null;if(M(b,t.dpAsc,n?t.a:-1,i,n?1:-1,n?t.a:-1),M(x,t.dpDesc,n?t.descA:-1,o,n?t.descA:-1,n?a:-1),n?(S.textContent=`本轮已扫 1 → ${t.a}　dp[${t.a}] = ${Oy(t.dpAsc[t.a])}`,C.textContent=`本轮已扫 ${t.descA} → ${a}　dp[${t.descA}] = ${Oy(t.dpDesc[t.descA])}`):t.phase===`done`?(S.textContent=`终态 dp[${a}] = ${Oy(t.dpAsc[a])}`,C.textContent=`终态 dp[${a}] = ${Oy(t.dpDesc[a])}`):(S.textContent=`dp[0] = 0，其余 ∞`,C.textContent=`dp[0] = 0，其余 ∞`),n){let e=t.ascRead===null?`a=${t.a} 装不下`:`a=${t.a}: dp[${i}]+1 = ${Oy(t.ascValue)}${t.ascUpdated?` ✓`:``}`,n=t.descRead===null?`a=${t.descA} 装不下`:`a=${t.descA}: 旧 dp[${o}]+1 = ${Oy(t.descValue)}${t.descUpdated?` ✓`:``}`;w.textContent=`正序｜${e}　　逆序｜${n}`,w.setAttribute(`class`,`cco-banner__text`+(t.ascUpdated?` is-ok`:``))}else t.phase===`done`?(w.textContent=`正序 = ${t.result}　≠　逆序 = ${t.descResult} —— 方向一换，题意就变了`,w.setAttribute(`class`,`cco-banner__text`+(t.descResult===-1?` is-warn`:``))):(w.textContent=`dp[a] = min(dp[a], dp[a-c] + 1)　两边一字不差`,w.setAttribute(`class`,`cco-banner__text`));E.textContent=r===null?`—`:String(r),D.textContent=t.step===0?`—`:String(t.step),O.textContent=String(t.ascResult),O.setAttribute(`class`,`cco-panel__num`+(t.ascResult===-1?` is-dead`:` is-asc`)),k.textContent=String(t.descResult),k.setAttribute(`class`,`cco-panel__num`+(t.descResult===-1?` is-dead`:` is-desc`)),t.phase===`init`?A.textContent=`两块面板：外层面额、内层金额，只差遍历方向`:n?A.textContent=t.ascUpdated?`正序读到的是"本轮的新值"，于是能再叠一枚同一硬币`:`正序这一步没刷新；逆序读到的永远是"上一轮的老值"`:A.textContent=t.descResult===-1?`逆序把每枚硬币都锁成一次 —— 就不再是这道题了`:`正序 = 完全背包，是 LC 322 的正确方向`,Z(j,t.desc)}s.appendChild(j);let P=Q();s.appendChild(P.root),e.textContent=``,e.appendChild(s),X();let F=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,I=$({steps:n,controls:P,intervalMs:Ty,onRender:N});I.jumpTo(Math.trunc(t.initialStep)||0);let L=null;return r&&!F&&typeof IntersectionObserver==`function`&&(L=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){L.disconnect(),L=null,I.play();return}},{threshold:.35}),L.observe(s)),{destroy(){L&&=(L.disconnect(),null),I.destroy(),e.textContent=``,delete e.dataset.coinorderMounted,document.getElementById(ly)?.remove()}}}var Ay=`applepenapple`,jy=[`apple`,`pen`];function My(e={}){let t=typeof e.s==`string`&&e.s.length>0?e.s:Ay,n=Array.isArray(e.words)?e.words:[],r=[...new Set(n.filter(e=>typeof e==`string`&&e.length>0))];return{s:t,words:r.length>0?r:[...jy]}}function Ny(e={}){let{s:t,words:n}=My(e),r=t.length,i=n.reduce((e,t)=>Math.max(e,t.length),0),a=new Set(n),o=[],s=Array(r+1).fill(!1);s[0]=!0;let c=Array(r+1).fill(null),l=(e,a,l={})=>{o.push({phase:e,desc:a,s:t,words:[...n],n:r,maxLen:i,i:-1,j:-1,seg:``,dpJ:!1,inDict:!1,skipped:0,lo:0,hi:-1,hit:!1,dp:[...s],prevDp:[...s],cut:[...c],result:s[r],segments:[],done:e===`done`,...l})};l(`init`,`给字符串 \`s = "${t}"\`（${r} 个字符）和字典 \`[${n.map(e=>`"${e}"`).join(`, `)}]\`，判断整个 s 能否由字典里的词**整段拼接**而成（词可以重复使用）。定义 \`dp[i]\` = s 的**前 i 个字符**能否拼出：底座 \`dp[0] = true\`（空串天然拼得出），其余先全部 \`false\`。递推 \`dp[i] = OR( dp[j] && s[j:i] ∈ dict )\` —— 语义是**枚举"最后一个词"**：最后一段取 \`s[j:i]\`，只要它本身是词、且它前面的 \`s[0:j]\` 拼得出（\`dp[j] = true\`），\`dp[i]\` 就成立。字典里最长的词是 ${i} 个字符，所以切分点只看窗口 \`j ∈ [i - ${i}, i - 1]\`：更靠左的 j 会让"最后一个词"长度超过 maxLen，不可能命中。任何一个 j 命中，\`dp[i]\` 立刻置 true 并停止扫描（**命中即短路**）。`);for(let e=1;e<=r;e+=1){let n=Math.max(0,e-i),r=e-1,o=0,u=0,d=!1;for(let f=n;f<=r;f+=1){if(!s[f]){o+=1;continue}let p=[...s],m=t.slice(f,e),h=a.has(m);h&&(s[e]=!0,c[e]=f,d=!0),u+=1;let g=n>0?`窗口左端 \`${n} = ${e} - ${i}\`：最后一词最长 ${i}，更靠左的 j 连长度都对不上，不必看。`:``,_=o>0?`先跳过 ${o} 个 \`dp[j] = false\` 的切分点 —— 前一段自己都拼不出来，后面接什么词都白搭。`:``;if(l(`probe`,`前缀 **${e}**（即 \`s\` 的前 ${e} 个字符 \`"${t.slice(0,e)}"\`），窗口 \`j ∈ [${n}, ${r}]\`。`+_+`盯住 \`j = ${f}\`：\`dp[${f}] = true\`（\`"${t.slice(0,f)}"\` 已拼得出），再查最后一段 \`s[${f}:${e}] = "${m}"\` —— `+(h?`**在字典里**，于是 \`dp[${e}] = true\`。命中即短路，本格剩下的切分点不用再试了。`:`不在字典里，这个切分点作废，接着试下一个 j。`)+g,{i:e,j:f,seg:m,dpJ:p[f],inDict:h,skipped:o,lo:n,hi:r,hit:d,prevDp:p}),d)break}u===0&&l(`probe`,`前缀 **${e}**，窗口 \`j ∈ [${n}, ${r}]\` 里 ${o} 个切分点的 \`dp[j]\` 全是 \`false\` —— 前一段自己就拼不出来，后面接什么词都白搭，\`dp[${e}] = false\`。注意 \`dp\` 是**布尔可达性**：没人能走到 \`i\`，这一格就一直是 false，不像 LC 322 那样还有"先设成 ∞、等路径来刷新"的余地。`,{i:e,j:-1,skipped:o,lo:n,hi:r,hit:!1})}let u=s[r],d=[],f=[r];if(u){let e=r;for(;e>0;){let n=c[e];d.push(t.slice(n,e)),f.push(n),e=n}d.reverse()}let p=d.length!==new Set(d).size;return l(`done`,(u?`返回 **true**：\`dp[${r}] = true\`，整个串拼得出来。顺 \`cut\` 表回溯出切分点链 \`${f.join(` → `)}\`，即 \`${d.join(` | `)}\`（${d.length} 段）。`+(p?`注意 \`${d.find((e,t)=>d.indexOf(e)!==t)}\` 用了不止一次 —— **词可重复使用**正是"完全背包"的语义，跟 LC 322 里硬币无限复用是同一件事。`:'每一段都在字典里，每段起点处 `dp[j]` 都是 true（所以 `dp` 表同时也是一张"可达位置"的清单）。'):`返回 **false**：\`dp[${r}] = false\`，无论怎么切都有一段不在字典里。注意 \`dp[i]\` 是**布尔或**：只要有一条通路能走到 i 就够，不必去数"有几种切法"。`)+`这也就是 139 与 322 的分工 —— 322 求**最少枚数**（min），139 求**能否到达**（OR）。`,{segments:d,chain:f,done:!0}),o}var Py=`wordbreak-styles`,Fy=28,Iy=48,Ly=58,Ry=40,zy=116,By=124,Vy=38,Hy=176,Uy=44,Wy=234,Gy=54,Ky=310,qy=604,Jy=1250,Yy=`
.wbv { display: flex; flex-direction: column; gap: 14px; }
.wbv__svg { width: 100%; height: auto; display: block; }

.wbv-note {
  fill: var(--wbv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-note--r { text-anchor: end; }

.wbv-lbl {
  fill: var(--wbv-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.wbv-band { fill: var(--wbv-band, #eef1ec); opacity: 0.9; }

.wbv-cell__box {
  fill: var(--wbv-fill, #ffffff); stroke: var(--wbv-line, #c3c9c2); stroke-width: 1.5;
}
.wbv-cell__val {
  fill: var(--wbv-ink, #1f2a24); font-size: 15px; font-weight: 800;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-cell__idx {
  fill: var(--wbv-dim, #9aa39c); font-size: 9px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-cell.is-true .wbv-cell__box {
  fill: var(--wbv-ok-fill, #eef5f1); stroke: var(--wbv-ok, #3f6b57); stroke-width: 2;
}
.wbv-cell.is-true .wbv-cell__val { fill: var(--wbv-ok, #3f6b57); }
.wbv-cell.is-dead .wbv-cell__box { fill: var(--wbv-past, #eef0ec); }
.wbv-cell.is-dead .wbv-cell__val { fill: var(--wbv-dim, #9aa39c); font-weight: 500; }
.wbv-cell.is-ahead .wbv-cell__box { fill: var(--wbv-fill, #ffffff); stroke-dasharray: 3 3; }
.wbv-cell.is-ahead .wbv-cell__val { fill: var(--wbv-dim, #9aa39c); font-weight: 500; }
.wbv-cell.is-from .wbv-cell__box {
  fill: var(--wbv-ok-fill, #eef5f1); stroke: var(--wbv-ok, #3f6b57); stroke-width: 3;
}
.wbv-cell.is-from .wbv-cell__val { fill: var(--wbv-ok, #3f6b57); }
.wbv-cell.is-target .wbv-cell__box {
  fill: var(--wbv-gold-fill, #fdf3e3); stroke: var(--wbv-gold, #c2872f); stroke-width: 3;
}
.wbv-cell.is-target .wbv-cell__val { fill: var(--wbv-gold, #c2872f); }
.wbv-cell.is-hit .wbv-cell__box { stroke: var(--wbv-gold, #c2872f); }

.wbv-ch {
  fill: var(--wbv-fill, #ffffff); stroke: var(--wbv-line, #c3c9c2); stroke-width: 1.5;
}
.wbv-ch__val {
  fill: var(--wbv-ink, #1f2a24); font-size: 16px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-ch.is-prefix { fill: var(--wbv-ok-fill, #eef5f1); }
.wbv-ch.is-prefix + .wbv-ch__val { fill: var(--wbv-ok, #3f6b57); }
.wbv-ch.is-ahead { fill: var(--wbv-past, #eef0ec); stroke-dasharray: 3 3; }
.wbv-ch.is-ahead + .wbv-ch__val { fill: var(--wbv-dim, #9aa39c); }
.wbv-ch.is-word {
  fill: var(--wbv-gold-fill, #fdf3e3); stroke: var(--wbv-gold, #c2872f); stroke-width: 3;
}
.wbv-ch.is-word + .wbv-ch__val { fill: var(--wbv-gold, #c2872f); }

.wbv-cut { stroke: var(--wbv-gold, #c2872f); stroke-width: 1.6; stroke-dasharray: 4 3; opacity: 0.8; }

.wbv-banner__box {
  fill: var(--wbv-banner, #f4f3ef); stroke: var(--wbv-line, #c3c9c2); stroke-width: 1.5;
}
.wbv-banner__text {
  fill: var(--wbv-hot, #a45f45); font-size: 13.5px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-banner__text.is-ok { fill: var(--wbv-ok, #3f6b57); }

.wbv-panel__box {
  fill: var(--wbv-fill, #ffffff); stroke: var(--wbv-line, #c3c9c2); stroke-width: 1.5;
}
.wbv-panel__label {
  fill: var(--wbv-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-panel__num {
  fill: var(--wbv-ink, #1f2a24); font-size: 17px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-panel__num.is-ok { fill: var(--wbv-ok, #3f6b57); }
.wbv-panel__num.is-dead { fill: var(--wbv-dim, #9aa39c); }
.wbv-panel__num.is-fresh { fill: var(--wbv-gold, #c2872f); }

.wbv-phase__text {
  fill: var(--wbv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function Xy(){if(document.getElementById(Py))return;let e=document.createElement(`style`);e.id=Py,e.textContent=Yy,document.head.appendChild(e)}function Zy(e,t={}){if(!e||e.dataset.wordbreakMounted===`1`)return{destroy(){}};e.dataset.wordbreakMounted=`1`,Xy();let n=Ny(t),r=t.autoplay!==!1,{s:i,words:a,n:o,maxLen:s}=n[0],c=Y,l=document.createElement(`div`);l.className=`viz wbv`;let u=document.createElement(`div`);u.className=`viz__stage`,l.appendChild(u);let d=c(`svg`,{class:`viz__svg wbv__svg`,viewBox:`0 0 660 332`,role:`img`,"aria-label":`单词拆分 LC139 推演动画`});u.appendChild(d);let f=c(`g`,{}),p=c(`g`,{}),m=c(`g`,{});d.append(f,p,m);let h=c(`text`,{class:`wbv-note`,x:26,y:Fy});h.textContent=`枚举"最后一个词"：s[j:i] 在字典里，且 dp[j] 为真`,m.appendChild(h);let g=c(`text`,{class:`wbv-note wbv-note--r`,x:634,y:Fy});g.textContent=`s = "${i}" · 字典 [${a.map(e=>`"${e}"`).join(`, `)}]`,m.appendChild(g);let _=o+1,v=Math.min(46,Math.floor((qy-(_-1)*5)/_)),y=(660-(_*v+(_-1)*5))/2,b=e=>y+e*(v+5),x=e=>y+(e+.5)*(v+5),S=c(`rect`,{class:`wbv-band`,x:0,y:Ly-5,width:0,height:50,rx:8});f.appendChild(S);let C=c(`text`,{class:`wbv-lbl`,x:26,y:Iy});C.textContent=`dp[i] = s 的前 i 个字符能不能拼出（0 = 空串）`,m.appendChild(C);let w=[];for(let e=0;e<=o;e+=1){let t=b(e),n=c(`g`,{class:`wbv-cell`});n.appendChild(c(`rect`,{class:`wbv-cell__box`,x:t,y:Ly,width:v,height:Ry,rx:6}));let r=c(`text`,{class:`wbv-cell__val`,x:t+v/2,y:73});n.appendChild(r);let i=c(`text`,{class:`wbv-cell__idx`,x:t+v/2,y:90});i.textContent=String(e),n.appendChild(i),p.appendChild(n),w.push({g:n,val:r})}let T=c(`text`,{class:`wbv-lbl`,x:26,y:zy});T.textContent=`s 的字符：候选最后一段 s[j:i] 从边界 j 跨到 i`,m.appendChild(T);let E=i.split(``).map((e,t)=>{let n=x(t),r=c(`g`,{}),i=c(`rect`,{class:`wbv-ch`,x:n,y:By,width:v,height:Vy,rx:6}),a=c(`text`,{class:`wbv-ch__val`,x:n+v/2,y:143});return a.textContent=e,r.append(i,a),p.appendChild(r),{box:i,val:a}}),D=c(`line`,{class:`wbv-cut`,x1:0,y1:Ly-5,x2:0,y2:167});m.appendChild(D),m.appendChild(c(`rect`,{class:`wbv-banner__box`,x:26,y:Hy,width:608,height:Uy,rx:9}));let O=c(`text`,{class:`wbv-banner__text`,x:660/2,y:198});m.appendChild(O),m.appendChild(c(`rect`,{class:`wbv-panel__box`,x:26,y:Wy,width:608,height:Gy,rx:9}));let k=(e,t)=>{let n=c(`text`,{class:`wbv-panel__label`,x:t,y:249});n.textContent=e;let r=c(`text`,{class:`wbv-panel__num`,x:t,y:271});return m.append(n,r),r},A=k(`i`,660/2-230),j=k(`j`,660/2-115),M=k(`跳过 dp[j]=false`,660/2),N=k(`s[j:i]`,445),P=k(`结果`,560),F=c(`text`,{class:`wbv-phase__text`,x:660/2,y:Ky});m.appendChild(F);let I=document.createElement(`p`);I.className=`viz__desc`,I.setAttribute(`aria-live`,`polite`);function L(e,t){if(!t)return;let n=t.phase===`probe`,r=n&&t.j>=0,i=t.i;n&&t.hi>=t.lo?(S.setAttribute(`x`,String(b(t.lo)-3)),S.setAttribute(`width`,String(b(t.hi)+v-(b(t.lo)-3)))):S.setAttribute(`width`,`0`),w.forEach((e,a)=>{let o=[`wbv-cell`];r&&a===t.j?o.push(`is-from`):n&&a===i?(o.push(`is-target`),t.hit&&o.push(`is-hit`)):!n||a<i?o.push(t.dp[a]?`is-true`:`is-dead`):o.push(`is-ahead`),e.g.setAttribute(`class`,o.join(` `)),e.val.textContent=t.dp[a]?`T`:`F`}),E.forEach((e,n)=>{let a=`wbv-ch`;r&&n>=t.j&&n<i?a+=` is-word`:t.phase===`done`&&t.result||i>=0&&n<i?a+=` is-prefix`:a+=` is-ahead`,e.box.setAttribute(`class`,a)}),i>=0?(D.setAttribute(`x1`,String(b(i)+v/2)),D.setAttribute(`x2`,String(b(i)+v/2)),D.setAttribute(`opacity`,`0.8`)):D.setAttribute(`opacity`,`0`),r?(O.textContent=`dp[${i}] = dp[${t.j}] && s[${t.j}:${i}] ∈ dict = ${t.dpJ?`true`:`false`} && ${t.inDict?`true`:`false`} = ${t.hit?`true`:`false`}`,O.setAttribute(`class`,`wbv-banner__text`+(t.hit?` is-ok`:``))):n?(O.textContent=`窗口 j ∈ [${t.lo}, ${t.hi}] 内 dp[j] 全为 false → dp[${i}] = false`,O.setAttribute(`class`,`wbv-banner__text`)):t.phase===`done`?(O.textContent=t.result?`答案 true：${t.segments.join(` | `)}`:`答案 false：dp[${o}] 始终为 false`,O.setAttribute(`class`,`wbv-banner__text`+(t.result?` is-ok`:``))):(O.textContent=`dp[i] = OR( dp[j] && s[j:i] ∈ dict )　dp[0] = true`,O.setAttribute(`class`,`wbv-banner__text`)),A.textContent=i<0?`—`:String(i),j.textContent=r?String(t.j):`—`,M.textContent=n?String(t.skipped):`—`,N.textContent=r?`"${t.seg}"`:`—`,N.setAttribute(`class`,`wbv-panel__num`+(r&&t.inDict?` is-fresh`:``)),P.textContent=String(t.result),P.setAttribute(`class`,`wbv-panel__num`+(t.phase===`done`?t.result?` is-ok`:` is-dead`:``)),t.phase===`init`?F.textContent=`dp[0] = true 是唯一底座；其余从 false 开始被"命中"翻上来`:n?F.textContent=t.hit?`命中即短路：dp[${i}] 已为 true，本格剩下的切分点不再试`:r?`这个切分点不成立，继续试下一个 j`:`前一段自己都拼不出来，这一格只能停在 false`:F.textContent=t.result?`每个 true 的 dp[i] 背后都连着一条完整的切分链`:`布尔或全 false：没有任何一条通路能走到 n`,Z(I,t.desc)}l.appendChild(I);let R=Q();l.appendChild(R.root),e.textContent=``,e.appendChild(l),X();let z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,B=$({steps:n,controls:R,intervalMs:Jy,onRender:L});B.jumpTo(Math.trunc(t.initialStep)||0);let V=null;return r&&!z&&typeof IntersectionObserver==`function`&&(V=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){V.disconnect(),V=null,B.play();return}},{threshold:.35}),V.observe(l)),{destroy(){V&&=(V.disconnect(),null),B.destroy(),e.textContent=``,delete e.dataset.wordbreakMounted,document.getElementById(Py)?.remove()}}}var Qy=`applepenapple`,$y=[`apple`,`pen`];function eb(e={}){let t=typeof e.s==`string`&&e.s.length>0?e.s:Qy,n=Array.isArray(e.words)?e.words:[],r=[...new Set(n.filter(e=>typeof e==`string`&&e.length>0))];return{s:t,words:r.length>0?r:[...$y]}}function tb(e={}){let{s:t,words:n}=eb(e),r=t.length,i=n.reduce((e,t)=>Math.max(e,t.length),0),a=new Set(n),o=Array(r+1).fill(!1);o[0]=!0;for(let e=1;e<=r;e+=1){let n=Math.max(0,e-i);for(let r=n;r<e;r+=1)if(o[r]&&a.has(t.slice(r,e))){o[e]=!0;break}}let s=[],c=[],l=[r],u=r,d=o[r],f=(e,a,u={})=>{s.push({phase:e,desc:a,s:t,words:[...n],n:r,maxLen:i,pos:-1,j:-1,seg:``,dpJ:!1,inDict:!1,hit:!1,lo:0,hi:-1,dp:[...o],locked:c.map(e=>({...e})),segments:[],chain:[...l],result:d,done:e===`done`,...u})};for(f(`init`,`先把 dp 表算出来（与动画一同一台机器）：\`dp[i] = OR( dp[j] && s[j:i] ∈ dict )\`，底座 \`dp[0] = true\`，窗口 \`j ∈ [i - ${i}, i - 1]\`（\`maxLen = ${i}\`）。\`s = "${t}"\`（${r} 个字符），字典 \`[${n.map(e=>`"${e}"`).join(`, `)}]\`，\`dp[${r}] = ${d}\`。这一遍不看"怎么填表"，而看**"表算好之后，怎么把 s 真的切成词"** —— dp 只回答了"能不能"，它没有记住"怎么切"。做法是从右往左走：在位置 \`pos\` 找一个切分点 \`j\`，使 \`dp[j] = true\` 且 \`s[j:pos]\` 在字典里，那 \`s[j:pos]\` 就可以当**最后一个词**，然后把 \`pos\` 挪到 \`j\` 继续往左 —— 走到 \`pos = 0\` 就切完了。扫描方向是 \`j\` 从 \`pos - 1\` 递减（最后一段**从短到长**）。`);u>0;){let e=Math.max(0,u-i),n=u-1,r=!1;for(let s=n;s>=e;--s){let d=t.slice(s,u),p=o[s],m=a.has(d),h=p&&m,g=e>0?`窗口左端 \`${e} = ${u} - ${i}\`：再往左的最后一段就超过 ${i} 个字符了。`:``;if(h){c.push({start:s,end:u,word:d}),c.sort((e,t)=>e.start-t.start),l.push(s);let t=s;f(`scan`,`右端 \`pos = ${u}\`：从 \`j = ${n}\` 往左试，到 \`j = ${s}\` **命中** —— \`dp[${s}] = true\`、\`s[${s}:${u}] = "${d}"\` 在字典里。于是最后一段锁定为 \`"${d}"\`，把 \`pos\` 挪到 \`${t}\`，继续往左找剩下的前缀。`+g,{pos:u,j:s,seg:d,dpJ:p,inDict:m,hit:!0,lo:e,hi:n}),u=t,r=!0;break}f(`scan`,`右端 \`pos = ${u}\`，试 \`j = ${s}\`：候选最后一段 \`s[${s}:${u}] = "${d}"\` —— `+(p?`\`dp[${s}] = true\`（前缀拼得出）没问题，但 \`"${d}"\` 不在字典里，这条路作废。`:`\`dp[${s}] = false\` —— 前缀 \`"${t.slice(0,s)}"\` 自己就拼不出来，后面接什么词都没用，跳过。`)+g,{pos:u,j:s,seg:d,dpJ:p,inDict:m,hit:!1,lo:e,hi:n})}if(!r)break}let p=c.map(e=>e.word);return f(`done`,(d?`切完：\`${p.join(` | `)}\`（${p.length} 段），切分点链 \`${l.join(` → `)}\`。整个过程**没有额外的 cut 表** —— \`dp\` 表本身就是"每个位置能不能拼出"的完整信息：只要 \`dp[j] = true\` 且 \`s[j:pos]\` 是词，这一段就一定接得上。把"找到一个就停"换成"DFS 枚举所有 j"、再配记忆化，就是 LC 140 单词拆分 II 的标准解。`:`\`dp[${r}] = false\`：从 \`pos = ${r}\` 往左一个能接上的 j 都没有，整串切不开。回溯的前提是 \`dp[${r}] = true\` —— dp 为 false 时连第一步都迈不出去。`)+'回头对照：动画一是**填表**（枚举"最后一个词"、正序推进），动画二是**读表**（从 n 往回切）—— 同一张 `dp`，一个负责"能不能"，一个负责"怎么切"。',{done:!0,segments:p,chain:[...l]}),s}var nb=`wordbreakseg-styles`,rb=28,ib=46,ab=54,ob=34,sb=104,cb=112,lb=46,ub=172,db=186,fb=44,pb=244,mb=54,hb=320,gb=604,_b=1250,vb=`
.wbs { display: flex; flex-direction: column; gap: 14px; }
.wbs__svg { width: 100%; height: auto; display: block; }

.wbs-note {
  fill: var(--wbs-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-note--r { text-anchor: end; }
.wbs-lbl {
  fill: var(--wbs-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-seg {
  fill: var(--wbs-ok, #3f6b57); font-size: 11px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.wbs-cell__box {
  fill: var(--wbs-fill, #ffffff); stroke: var(--wbs-line, #c3c9c2); stroke-width: 1.5;
}
.wbs-cell__val {
  fill: var(--wbs-ink, #1f2a24); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-cell__idx {
  fill: var(--wbs-dim, #9aa39c); font-size: 9px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-cell.is-true .wbs-cell__box { fill: var(--wbs-ok-fill, #eef5f1); stroke: var(--wbs-ok, #3f6b57); stroke-width: 2; }
.wbs-cell.is-true .wbs-cell__val { fill: var(--wbs-ok, #3f6b57); }
.wbs-cell.is-dead .wbs-cell__val { fill: var(--wbs-dim, #9aa39c); font-weight: 500; }
.wbs-cell.is-target .wbs-cell__box {
  fill: var(--wbs-gold-fill, #fdf3e3); stroke: var(--wbs-gold, #c2872f); stroke-width: 3;
}
.wbs-cell.is-target .wbs-cell__val { fill: var(--wbs-gold, #c2872f); }
.wbs-cell.is-from .wbs-cell__box {
  fill: var(--wbs-ok-fill, #eef5f1); stroke: var(--wbs-ok, #3f6b57); stroke-width: 3;
}
.wbs-cell.is-from .wbs-cell__val { fill: var(--wbs-ok, #3f6b57); }

.wbs-ch {
  fill: var(--wbs-fill, #ffffff); stroke: var(--wbs-line, #c3c9c2); stroke-width: 1.5;
}
.wbs-ch__val {
  fill: var(--wbs-ink, #1f2a24); font-size: 17px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-ch.is-ahead { fill: var(--wbs-past, #eef0ec); stroke-dasharray: 3 3; }
.wbs-ch.is-ahead + .wbs-ch__val { fill: var(--wbs-dim, #9aa39c); }
.wbs-ch.is-try {
  fill: var(--wbs-try, #f6f2ea); stroke: var(--wbs-muted, #657168); stroke-width: 1.5;
  stroke-dasharray: 4 3;
}
.wbs-ch.is-try + .wbs-ch__val { fill: var(--wbs-muted, #657168); }
.wbs-ch.is-locked { fill: var(--wbs-ok-fill, #eef5f1); stroke: var(--wbs-ok, #3f6b57); stroke-width: 2; }
.wbs-ch.is-locked + .wbs-ch__val { fill: var(--wbs-ok, #3f6b57); }
.wbs-ch.is-word { fill: var(--wbs-gold-fill, #fdf3e3); stroke: var(--wbs-gold, #c2872f); stroke-width: 3; }
.wbs-ch.is-word + .wbs-ch__val { fill: var(--wbs-gold, #c2872f); }

.wbs-cursor { stroke: var(--wbs-gold, #c2872f); stroke-width: 2; }
.wbs-cursor__cap {
  fill: var(--wbs-gold, #c2872f); font-size: 11px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.wbs-banner__box {
  fill: var(--wbs-banner, #f4f3ef); stroke: var(--wbs-line, #c3c9c2); stroke-width: 1.5;
}
.wbs-banner__text {
  fill: var(--wbs-hot, #a45f45); font-size: 13.5px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-banner__text.is-ok { fill: var(--wbs-ok, #3f6b57); }

.wbs-panel__box {
  fill: var(--wbs-fill, #ffffff); stroke: var(--wbs-line, #c3c9c2); stroke-width: 1.5;
}
.wbs-panel__label {
  fill: var(--wbs-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-panel__num {
  fill: var(--wbs-ink, #1f2a24); font-size: 17px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-panel__num.is-ok { fill: var(--wbs-ok, #3f6b57); }
.wbs-panel__num.is-dead { fill: var(--wbs-dim, #9aa39c); }
.wbs-panel__num.is-fresh { fill: var(--wbs-gold, #c2872f); }

.wbs-phase__text {
  fill: var(--wbs-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function yb(){if(document.getElementById(nb))return;let e=document.createElement(`style`);e.id=nb,e.textContent=vb,document.head.appendChild(e)}function bb(e,t={}){if(!e||e.dataset.wordbreaksegMounted===`1`)return{destroy(){}};e.dataset.wordbreaksegMounted=`1`,yb();let n=tb(t),r=t.autoplay!==!1,{s:i,words:a,n:o}=n[0],s=Y,c=document.createElement(`div`);c.className=`viz wbs`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);let u=s(`svg`,{class:`viz__svg wbs__svg`,viewBox:`0 0 660 342`,role:`img`,"aria-label":`单词拆分 LC139 切分还原动画`});l.appendChild(u);let d=s(`g`,{}),f=s(`g`,{});u.append(d,f);let p=s(`text`,{class:`wbs-note`,x:26,y:rb});p.textContent=`dp 只回答"能不能"；从 n 往左走，才把 s 切成词`,f.appendChild(p);let m=s(`text`,{class:`wbs-note wbs-note--r`,x:634,y:rb});m.textContent=`s = "${i}" · 字典 [${a.map(e=>`"${e}"`).join(`, `)}]`,f.appendChild(m);let h=o+1,g=Math.min(46,Math.floor((gb-(h-1)*5)/h)),_=(660-(h*g+(h-1)*5))/2,v=e=>_+e*(g+5),y=e=>_+(e+.5)*(g+5),b=s(`text`,{class:`wbs-lbl`,x:26,y:ib});b.textContent=`算好的 dp 表（T = 这一段前缀拼得出）`,f.appendChild(b);let x=[];for(let e=0;e<=o;e+=1){let t=v(e),n=s(`g`,{class:`wbs-cell`});n.appendChild(s(`rect`,{class:`wbs-cell__box`,x:t,y:ab,width:g,height:ob,rx:5}));let r=s(`text`,{class:`wbs-cell__val`,x:t+g/2,y:68});n.appendChild(r);let i=s(`text`,{class:`wbs-cell__idx`,x:t+g/2,y:82});i.textContent=String(e),n.appendChild(i),d.appendChild(n),x.push({g:n,val:r})}let S=s(`text`,{class:`wbs-lbl`,x:26,y:sb});S.textContent=`把 s 逐段切出来：绿 = 已锁定，金 = 正在试，虚线 = 还没切到`,f.appendChild(S);let C=i.split(``).map((e,t)=>{let n=y(t),r=s(`g`,{}),i=s(`rect`,{class:`wbs-ch`,x:n,y:cb,width:g,height:lb,rx:6}),a=s(`text`,{class:`wbs-ch__val`,x:n+g/2,y:135});return a.textContent=e,r.append(i,a),d.appendChild(r),{box:i}}),w=i.split(``).map(()=>{let e=s(`text`,{class:`wbs-seg`,x:0,y:ub});return f.appendChild(e),e}),T=s(`line`,{class:`wbs-cursor`,x1:0,y1:ab,x2:0,y2:162}),E=s(`text`,{class:`wbs-cursor__cap`,x:0,y:174});f.append(T,E),f.appendChild(s(`rect`,{class:`wbs-banner__box`,x:26,y:db,width:608,height:fb,rx:9}));let D=s(`text`,{class:`wbs-banner__text`,x:660/2,y:208});f.appendChild(D),f.appendChild(s(`rect`,{class:`wbs-panel__box`,x:26,y:pb,width:608,height:mb,rx:9}));let O=(e,t)=>{let n=s(`text`,{class:`wbs-panel__label`,x:t,y:259});n.textContent=e;let r=s(`text`,{class:`wbs-panel__num`,x:t,y:281});return f.append(n,r),r},k=O(`pos`,660/2-230),A=O(`j`,660/2-115),j=O(`dp[j]`,660/2),M=O(`s[j:pos]`,445),N=O(`结果`,560),P=s(`text`,{class:`wbs-phase__text`,x:660/2,y:hb});f.appendChild(P);let F=document.createElement(`p`);F.className=`viz__desc`,F.setAttribute(`aria-live`,`polite`);function I(e,t){if(!t)return;let n=t.phase===`scan`,r=t.pos,i=t.j,a=n&&t.hit?{start:i,end:r}:null;x.forEach((e,a)=>{let o=[`wbs-cell`];n&&a===i?o.push(`is-from`):n&&a===r&&o.push(`is-target`),o.push(t.dp[a]?`is-true`:`is-dead`),e.g.setAttribute(`class`,o.join(` `)),e.val.textContent=t.dp[a]?`T`:`F`});let s=e=>t.locked.some(t=>e>=t.start&&e<t.end);C.forEach((e,t)=>{let o=`wbs-ch`;a&&t>=a.start&&t<a.end?o+=` is-word`:s(t)?o+=` is-locked`:n&&t>=i&&t<r?o+=` is-try`:o+=` is-ahead`,e.box.setAttribute(`class`,o)});let c=[...t.locked].sort((e,t)=>e.start-t.start);if(w.forEach((e,t)=>{let n=c[t];if(!n){e.textContent=``;return}let r=y(n.start),i=y(n.end-1)+g;e.setAttribute(`x`,String((r+i)/2)),e.textContent=`"${n.word}"`}),r>=0){let e=v(r)+g/2;T.setAttribute(`x1`,String(e)),T.setAttribute(`x2`,String(e)),T.setAttribute(`opacity`,`1`),E.setAttribute(`x`,String(e)),E.textContent=`pos=${r}`,E.setAttribute(`opacity`,`1`)}else T.setAttribute(`opacity`,`0`),E.setAttribute(`opacity`,`0`);n?(D.textContent=`dp[${i}] = ${t.dpJ?`true`:`false`} && s[${i}:${r}] = "${t.seg}" ${t.inDict?`∈`:`∉`} dict → ${t.hit?`锁定这一段`:`作废`}`,D.setAttribute(`class`,`wbs-banner__text`+(t.hit?` is-ok`:``))):t.phase===`done`?(D.textContent=t.result?`切分：${t.segments.join(` | `)}`:`返回 false：dp[${o}] 始终为 false`,D.setAttribute(`class`,`wbs-banner__text`+(t.result?` is-ok`:``))):(D.textContent=`dp[i] = OR( dp[j] && s[j:i] ∈ dict )　dp[${o}] = true`,D.setAttribute(`class`,`wbs-banner__text is-ok`)),k.textContent=r<0?`—`:String(r),A.textContent=n?String(i):`—`,j.textContent=n?t.dpJ?`true`:`false`:`—`,j.setAttribute(`class`,`wbs-panel__num`+(n?t.dpJ?` is-ok`:` is-dead`:``)),M.textContent=n?`"${t.seg}"`:`—`,M.setAttribute(`class`,`wbs-panel__num`+(n&&t.inDict?` is-fresh`:``)),N.textContent=String(t.result),N.setAttribute(`class`,`wbs-panel__num`+(t.phase===`done`?t.result?` is-ok`:` is-dead`:``)),t.phase===`init`?P.textContent=`dp 表已经算好；现在从 n 往左，一段一段把 s 切出来`:n?P.textContent=t.hit?`命中：这一段就是最后一个词，把 pos 左移到它的起点`:`这一段接不上（词不在字典里，或前缀 dp[j] 为假）`:P.textContent=t.result?`dp 表 + 贪心回溯就够切出一条合法方案；要枚举所有方案就是 LC 140`:`dp[n] 为 false，从最后一步就迈不出去`,Z(F,t.desc)}c.appendChild(F);let L=Q();c.appendChild(L.root),e.textContent=``,e.appendChild(c),X();let R=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,z=$({steps:n,controls:L,intervalMs:_b,onRender:I});z.jumpTo(Math.trunc(t.initialStep)||0);let B=null;return r&&!R&&typeof IntersectionObserver==`function`&&(B=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){B.disconnect(),B=null,z.play();return}},{threshold:.35}),B.observe(c)),{destroy(){B&&=(B.disconnect(),null),z.destroy(),e.textContent=``,delete e.dataset.wordbreaksegMounted,document.getElementById(nb)?.remove()}}}var xb=[`innerHTML`],Sb=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,Cb=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,wb=`0.16.21`,Tb=`11.4.1`,Eb=y({__name:`MarkdownView`,props:{html:{type:String,default:``},title:{type:String,default:``}},setup(e){let t=e,n=w(null),r=v(()=>ct(st.sanitize(t.html,{ADD_ATTR:[`target`,`rel`],FORBID_TAGS:[`style`,`iframe`,`object`,`embed`,`form`],FORBID_ATTR:[`onerror`,`onload`,`onclick`]}),t.title));function i(e){e.classList.add(`copied`),e.innerHTML=Cb,setTimeout(()=>{e.classList.remove(`copied`),e.innerHTML=Sb},2e3)}function s(){n.value&&n.value.querySelectorAll(`table`).forEach(e=>{if(e.parentElement?.classList.contains(`table-scroll`))return;let t=document.createElement(`div`);t.className=`table-scroll`,e.parentNode.insertBefore(t,e),t.appendChild(e)})}function l(){n.value&&n.value.querySelectorAll(`pre`).forEach(e=>{if(e.parentElement?.classList.contains(`code-block-wrapper`))return;let t=document.createElement(`div`);t.className=`code-block-wrapper`,e.parentNode.insertBefore(t,e),t.appendChild(e);let n=document.createElement(`button`);n.className=`copy-btn`,n.title=`复制代码`,n.innerHTML=Sb,n.addEventListener(`click`,()=>{let t=(e.querySelector(`code`)||e).textContent||``;navigator.clipboard.writeText(t).then(()=>{i(n)}).catch(()=>{let e=document.createElement(`textarea`);e.value=t,e.style.position=`fixed`,e.style.opacity=`0`,document.body.appendChild(e),e.select(),document.execCommand(`copy`),document.body.removeChild(e),i(n)})}),t.appendChild(n)})}function u(e,t){return new Promise((n,r)=>{if(document.querySelector(`link[data-lib-href="${e}"]`))return n();let i=document.createElement(`link`);i.rel=`stylesheet`,i.href=e,i.integrity=t,i.crossOrigin=`anonymous`,i.dataset.libHref=e,i.onload=()=>n(),i.onerror=()=>r(Error(`Failed to load stylesheet `+e)),document.head.appendChild(i)})}function d(e,t){return new Promise((n,r)=>{if(document.querySelector(`script[data-lib-src="${e}"]`))return n();let i=document.createElement(`script`);i.src=e,i.integrity=t,i.crossOrigin=`anonymous`,i.dataset.libSrc=e,i.onload=()=>n(),i.onerror=()=>r(Error(`Failed to load script `+e)),document.head.appendChild(i)})}let f=null;async function m(){return f||=Promise.all([u(`https://cdn.jsdelivr.net/npm/katex@${wb}/dist/katex.min.css`,`sha384-zh0CIslj+VczCZtlzBcjt5ppRcsAmDnRem7ESsYwWwg3m/OaJ2l4x7YBZl9Kxxib`),d(`https://cdn.jsdelivr.net/npm/katex@${wb}/dist/katex.min.js`,`sha384-Rma6DA2IPUwhNxmrB/7S3Tno0YY7sFu9WSYMCuulLhIqYSGZ2gKCJWIqhBWqMQfh`)]).then(()=>window.katex),f}let h=null;async function g(){return h||=d(`https://cdn.jsdelivr.net/npm/mermaid@${Tb}/dist/mermaid.min.js`,`sha384-rbtjAdnIQE/aQJGEgXrVUlMibdfTSa4PQju4HDhN3sR2PmaKFzhEafuePsl9H/9I`).then(()=>window.mermaid),h}async function _(){if(!n.value)return;let e=n.value.querySelectorAll(`code.language-mermaid`);if(e.length)try{let t=await g();e.forEach(e=>{let n=e.closest(`pre`);if(!n||n.dataset.mermaidRendered)return;n.dataset.mermaidRendered=`1`;let r=document.createElement(`div`);r.className=`mermaid-container`,r.textContent=e.textContent,n.parentNode.replaceChild(r,n),t.run({nodes:[r]})})}catch(e){console.warn(`Mermaid failed to load/render:`,e?.message||e)}n.value.querySelectorAll(`img`).forEach(e=>{let t=e.getAttribute(`src`)||``;e.getAttribute(`alt`);let n=t.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);if(n){let t=document.createElement(`div`);t.className=`video-wrapper`,t.innerHTML=`<iframe src="https://www.youtube.com/embed/${n[1]}" frameborder="0" allowfullscreen></iframe>`,e.parentNode.replaceChild(t,e);return}let r=t.match(/bilibili\.com\/video\/(BV[\w]+)/);if(r){let t=document.createElement(`div`);t.className=`video-wrapper`,t.innerHTML=`<iframe src="https://player.bilibili.com/player.html?bvid=${r[1]}" frameborder="0" allowfullscreen></iframe>`,e.parentNode.replaceChild(t,e);return}});let t=/(\$\$[\s\S]+?\$\$|\$[^\s$](?:[^$]*[^\s$])?\$)/,r=document.createTreeWalker(n.value,NodeFilter.SHOW_TEXT),i=[],a;for(;a=r.nextNode();)!a.nodeValue||!t.test(a.nodeValue)||a.parentElement?.closest(`pre, code`)||i.push(a);if(i.length)try{let e=await m();for(let n of i){let r=document.createDocumentFragment();for(let i of n.nodeValue.split(t)){if(!i)continue;let t=i.startsWith(`$$`)&&i.endsWith(`$$`)&&i.length>3,n=!t&&i.startsWith(`$`)&&i.endsWith(`$`)&&i.length>2;if(!t&&!n){r.appendChild(document.createTextNode(i));continue}let a=i.slice(t?2:1,t?-2:-1),o=document.createElement(`span`);o.innerHTML=e.renderToString(a,{displayMode:t,throwOnError:!1}),r.appendChild(o)}n.parentNode.replaceChild(r,n)}}catch(e){console.warn(`KaTeX failed to load/render:`,e?.message||e)}}let y={"algo-viz--lc206":Pt,"algo-viz--lc21":nn,"algo-viz--lc23":Pn,"algo-viz--lc23dc":$n,"algo-viz--lc141":Er,"algo-viz--lc142":Br,"algo-viz--lc19":ai,"algo-viz--lc143":Ei,"algo-viz--lc234":Yi,"algo-viz--lc160":ba,"algo-viz--lc82":Wa,"algo-viz--lc102":ao,"algo-viz--lc236":bo,"algo-viz--lc124":No,"algo-viz--lc104":Ko,"algo-viz--lc226":os,"algo-viz--lc3":Ds,"algo-viz--lc1":Gs,"algo-viz--lc15":hc,"algo-viz--lc42":Lc,"algo-viz--lc42stack":sl,"algo-viz--lc53":kl,"algo-viz--lc215":Zl,"algo-viz--lc347":vu,"algo-viz--lc56":Pu,"algo-viz--lc33":Xu,"algo-viz--lc153":dd,"algo-viz--lc189":Ad,"algo-viz--lc415":nf,"algo-viz--lc165":Sf,"algo-viz--lc5":zf,"algo-viz--lc93":ap,"algo-viz--lc20":Ep,"algo-viz--lc239":Xp,"algo-viz--lc300dp":vm,"algo-viz--lc300binary":Hm,"algo-viz--lc72":dh,"algo-viz--lc72roll":fh,"algo-viz--lc70":Th,"algo-viz--lc70over":Eh,"algo-viz--lc70rec":Ih,"algo-viz--lc155":Qh,"algo-viz--lc232":gg,"algo-viz--lc224":Rg,"algo-viz--lc772":s_,"algo-viz--lc704":D_,"algo-viz--lc69":K_,"algo-viz--lc121":dv,"algo-viz--lc122":Av,"algo-viz--lc322":ty,"algo-viz--lc322order":ky,"algo-viz--lc139":Zy,"algo-viz--lc139seg":bb},b=[];function x(){b.forEach(e=>{try{e?.destroy?.()}catch(e){console.warn(`Algo viz teardown failed:`,e?.message||e)}}),b=[]}function T(){n.value&&(x(),n.value.querySelectorAll(`.algo-viz`).forEach(e=>{let t=Object.keys(y).find(t=>e.classList.contains(t));if(t)try{b.push(y[t](e))}catch(e){console.warn(`Algo viz failed to mount:`,t,e?.message||e)}}))}return a(()=>{o(()=>{T(),_(),s(),l()})}),C(x),p(()=>t.html,()=>{o(()=>{T(),_(),s(),l()})}),(e,t)=>(S(),c(`div`,{ref_key:`bodyRef`,ref:n,class:`markdown-body`,innerHTML:r.value},null,8,xb))}},[[`__scopeId`,`data-v-b50b13cb`]]);function Db(e){return T.get(`/articles/${e}/comments/`)}function Ob(e,t){return T.post(`/articles/${e}/comments/`,t)}var kb={key:0,class:`form-title`},Ab={key:1,class:`form-title`},jb={class:`form-field`},Mb={key:0,class:`field-error`},Nb={class:`form-field`},Pb={key:0,class:`field-error`},Fb={class:`hp-field`,"aria-hidden":`true`},Ib={class:`form-field`},Lb={key:0,class:`field-error`},Rb={key:0,class:`submit-error`},zb={key:1,class:`submit-success`},Bb={class:`form-actions`},Vb=[`disabled`],Hb={key:0,class:`spinner`},Ub={key:1},Wb=y({__name:`CommentForm`,props:{articleSlug:{type:String,required:!0},parentId:{type:[Number,String],default:null}},emits:[`submitted`,`cancel`],setup(e,{emit:t}){let n=e,r=t,a=i({author_name:``,author_email:``,content:``,website:``}),o=i({author_name:``,author_email:``,content:``}),u=w(!1),d=w(null),p=w(!1);function m(){let e=!0;return o.author_name=``,o.author_email=``,o.content=``,a.author_name.trim()||(o.author_name=`请输入昵称`,e=!1),a.author_email.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.author_email)||(o.author_email=`邮箱格式不正确`,e=!1):(o.author_email=`请输入邮箱`,e=!1),a.content.trim()?a.content.trim().length<3&&(o.content=`评论内容至少3个字符`,e=!1):(o.content=`请输入评论内容`,e=!1),e}function g(e){o[e]&&(o[e]=``),d.value=null}async function _(){if(m()){u.value=!0,d.value=null;try{let e={author_name:a.author_name.trim(),author_email:a.author_email.trim(),content:a.content.trim(),website:a.website};n.parentId&&(e.parent=n.parentId),await Ob(n.articleSlug,e),p.value=!0,setTimeout(()=>{p.value=!1},3e3),r(`submitted`),a.author_name=``,a.author_email=``,a.content=``}catch(e){let t=e?.response?.data;if(typeof t==`object`&&t){let e=t;e.author_name&&(o.author_name=Array.isArray(e.author_name)?e.author_name[0]:e.author_name),e.author_email&&(o.author_email=Array.isArray(e.author_email)?e.author_email[0]:e.author_email),e.content&&(o.content=Array.isArray(e.content)?e.content[0]:e.content),e.detail&&(d.value=e.detail),e.non_field_errors&&(d.value=Array.isArray(e.non_field_errors)?e.non_field_errors[0]:e.non_field_errors)}else typeof t==`string`?d.value=t:d.value=e.message||`提交失败，请稍后重试`}finally{u.value=!1}}}return(t,n)=>(S(),c(`div`,{class:h([`comment-form`,{"reply-form":!!e.parentId}])},[e.parentId?(S(),c(`h4`,kb,`回复评论`)):(S(),c(`h4`,Ab,`发表评论`)),s(`form`,{onSubmit:k(_,[`prevent`]),class:`form-body`},[s(`div`,jb,[f(s(`input`,{"onUpdate:modelValue":n[0]||=e=>a.author_name=e,type:`text`,placeholder:`昵称 *`,class:h([`form-input`,{"input-error":o.author_name}]),onInput:n[1]||=e=>g(`author_name`)},null,34),[[O,a.author_name]]),o.author_name?(S(),c(`p`,Mb,l(o.author_name),1)):b(``,!0)]),s(`div`,Nb,[f(s(`input`,{"onUpdate:modelValue":n[2]||=e=>a.author_email=e,type:`email`,placeholder:`邮箱 *`,class:h([`form-input`,{"input-error":o.author_email}]),onInput:n[3]||=e=>g(`author_email`)},null,34),[[O,a.author_email]]),o.author_email?(S(),c(`p`,Pb,l(o.author_email),1)):b(``,!0)]),s(`div`,Fb,[f(s(`input`,{"onUpdate:modelValue":n[4]||=e=>a.website=e,type:`text`,tabindex:`-1`,autocomplete:`off`},null,512),[[O,a.website]])]),s(`div`,Ib,[f(s(`textarea`,{"onUpdate:modelValue":n[5]||=e=>a.content=e,placeholder:`说点什么...`,rows:`4`,class:h([`form-textarea`,{"input-error":o.content}]),onInput:n[6]||=e=>g(`content`)},null,34),[[O,a.content]]),o.content?(S(),c(`p`,Lb,l(o.content),1)):b(``,!0)]),d.value?(S(),c(`p`,Rb,l(d.value),1)):b(``,!0),p.value?(S(),c(`p`,zb,`评论已提交！`)):b(``,!0),s(`div`,Bb,[e.parentId?(S(),c(`button`,{key:0,type:`button`,class:`cancel-btn`,onClick:n[7]||=e=>t.$emit(`cancel`)},` 取消回复 `)):b(``,!0),s(`button`,{type:`submit`,class:`submit-btn`,disabled:u.value},[u.value?(S(),c(`span`,Hb)):(S(),c(`span`,Ub,`提交`))],8,Vb)])],32)],2))}},[[`__scopeId`,`data-v-49410be9`]]),Gb={class:`comment-list`},Kb={class:`comments-title`},qb={key:0,class:`comments-count`},Jb={key:0,class:`skeleton-comments`},Yb={key:1,class:`empty-comments`},Xb={key:2,class:`comments-tree`},Zb={class:`comment-main`},Qb={class:`comment-content`},$b={class:`comment-header`},ex={class:`comment-author`},tx={class:`comment-time`},nx={class:`comment-text`},rx=[`onClick`],ix={key:1,class:`replies`},ax={class:`comment-main`},ox={class:`comment-content`},sx={class:`comment-header`},cx={class:`comment-author`},lx={class:`comment-time`},ux={class:`comment-text`},dx=y({__name:`CommentList`,props:{articleSlug:{type:String,required:!0}},setup(e){let t=e,n=w([]),i=w(!0),o=w(null),u=v(()=>n.value.filter(e=>!e.parent));function f(e){o.value=o.value===e?null:e}async function p(){i.value=!0;try{let e=await Db(t.articleSlug);n.value=e.data.results||e.data||[]}catch{n.value=[]}finally{i.value=!1}}function h(){o.value=null,p()}function y(e){if(!e)return``;let t=Date.now()-new Date(e).getTime(),n=Math.floor(t/6e4),r=Math.floor(t/36e5),i=Math.floor(t/864e5);return n<1?`刚刚`:n<60?`${n}分钟前`:r<24?`${r}小时前`:i<30?`${i}天前`:i<365?`${Math.floor(i/30)}个月前`:`${Math.floor(i/365)}年前`}function C(e){let t=[`#3f6b57`,`#a45f45`,`#8a6c3f`,`#637b68`,`#7b6757`,`#4f7477`,`#8a635f`,`#6b7250`,`#536b5d`,`#9b704e`,`#65706a`,`#7b6a83`];if(!e)return t[0];let n=0;for(let t=0;t<e.length;t++)n=e.charCodeAt(t)+((n<<5)-n);return t[Math.abs(n)%t.length]}return a(p),(t,a)=>(S(),c(`div`,Gb,[s(`h3`,Kb,[a[1]||=g(` 评论 `,-1),n.value.length?(S(),c(`span`,qb,`(`+l(n.value.length)+`)`,1)):b(``,!0)]),i.value?(S(),c(`div`,Jb,[(S(),c(d,null,r(3,e=>s(`div`,{key:e,class:`skeleton-comment`},[...a[2]||=[_(`<div class="skeleton-avatar" data-v-98dfce57></div><div class="skeleton-body" data-v-98dfce57><div class="skeleton-line w-30" data-v-98dfce57></div><div class="skeleton-line w-50" data-v-98dfce57></div><div class="skeleton-line w-80" data-v-98dfce57></div></div>`,2)]])),64))])):u.value.length?(S(),c(`div`,Xb,[(S(!0),c(d,null,r(u.value,t=>(S(),c(`div`,{key:t.id,class:`comment-item`},[s(`div`,Zb,[s(`div`,{class:`comment-avatar`,style:x({background:C(t.author_name)})},l(t.author_name?t.author_name.charAt(0).toUpperCase():`?`),5),s(`div`,Qb,[s(`div`,$b,[s(`span`,ex,l(t.author_name),1),s(`span`,tx,l(y(t.created_at)),1)]),s(`p`,nx,l(t.content),1),s(`button`,{class:`reply-btn`,onClick:e=>f(t.id)},[...a[4]||=[s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`polyline`,{points:`9 17 4 12 9 7`}),s(`path`,{d:`M20 18v-2a4 4 0 0 0-4-4H4`})],-1),g(` 回复 `,-1)]],8,rx)])]),o.value===t.id?(S(),m(Wb,{key:0,"article-slug":e.articleSlug,"parent-id":t.id,onSubmitted:h,onCancel:a[0]||=e=>o.value=null,class:`reply-form-wrapper`},null,8,[`article-slug`,`parent-id`])):b(``,!0),t.replies&&t.replies.length?(S(),c(`div`,ix,[(S(!0),c(d,null,r(t.replies,e=>(S(),c(`div`,{key:e.id,class:`comment-item reply-item`},[s(`div`,ax,[s(`div`,{class:`comment-avatar comment-avatar-sm`,style:x({background:C(e.author_name)})},l(e.author_name?e.author_name.charAt(0).toUpperCase():`?`),5),s(`div`,ox,[s(`div`,sx,[s(`span`,cx,l(e.author_name),1),s(`span`,lx,l(y(e.created_at)),1)]),s(`p`,ux,l(e.content),1)])])]))),128))])):b(``,!0)]))),128))])):(S(),c(`div`,Yb,[...a[3]||=[s(`svg`,{width:`40`,height:`40`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`1.5`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`path`,{d:`M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z`})],-1),s(`p`,null,`暂无评论，来说点什么吧`,-1)]]))]))}},[[`__scopeId`,`data-v-98dfce57`]]),fx={key:0,class:`toc-list-wrapper`},px={class:`toc-list`},mx=[`href`,`title`,`onClick`],hx={class:`toc-text`},gx={key:1,class:`toc-empty-state`},_x=y({__name:`TocNav`,props:{html:{type:String,default:``}},setup(e){let t=e,n=w([]),i=w(null),u=null,f=[];function m(){if(!t.html){n.value=[];return}try{let e=new DOMParser().parseFromString(t.html,`text/html`),r=[];e.querySelectorAll(`h2, h3, h4`).forEach((e,t)=>{let n=e.id||`toc-heading-${t}`;r.push({id:n,tag:e.tagName.toLowerCase(),text:e.textContent||``})}),n.value=r}catch{n.value=[]}}function g(){if(!n.value.length)return;let e=document.querySelector(`.markdown-body`);e&&e.querySelectorAll(`h2, h3, h4`).forEach((e,t)=>{let r=n.value[t];r&&!e.id&&(e.id=r.id)})}function _(){u&&=(u.disconnect(),null),f=[],n.value.length&&(u=new IntersectionObserver(e=>{let t=e.filter(e=>e.isIntersecting);t.length?i.value=t[0].target.id:window.scrollY<100&&(i.value=n.value[0]?.id||null)},{rootMargin:`-80px 0px -60% 0px`,threshold:0}),o(()=>{n.value.forEach(e=>{let t=document.getElementById(e.id);t&&(u.observe(t),f.push(t))})}))}function v(e){let t=document.getElementById(e);t&&(t.scrollIntoView({behavior:`smooth`,block:`start`}),i.value=e)}return p(()=>t.html,()=>{m(),o(()=>{g(),_()})}),a(()=>{m(),o(()=>{g(),_()})}),C(()=>{u&&u.disconnect()}),(e,t)=>(S(),c(`nav`,{class:h([`toc-nav`,{"toc-empty":!n.value.length}])},[t[2]||=s(`h4`,{class:`toc-title`},`目录`,-1),n.value.length?(S(),c(`div`,fx,[s(`ul`,px,[(S(!0),c(d,null,r(n.value,e=>(S(),c(`li`,{key:e.id,class:h([`toc-item`,[`toc-depth-${e.tag}`,{"toc-active":i.value===e.id}]])},[s(`a`,{href:`#`+e.id,class:`toc-link`,title:e.text,onClick:k(t=>v(e.id),[`prevent`])},[t[0]||=s(`span`,{class:`toc-dot`},null,-1),s(`span`,hx,l(e.text),1)],8,mx)],2))),128))])])):(S(),c(`div`,gx,[...t[1]||=[s(`p`,null,`无目录`,-1)]]))],2))}},[[`__scopeId`,`data-v-21d21cb1`]]),vx={class:`share-buttons`},yx={key:0,class:`copy-feedback`},bx=y({__name:`ShareButtons`,props:{title:{type:String,default:``},url:{type:String,default:``}},setup(e){let t=e,n=w(!1);function r(){let e=encodeURIComponent(t.url||window.location.href),n=encodeURIComponent(t.title);window.open(`https://service.weibo.com/share/share.php?url=${e}&title=${n}`,`_blank`,`noopener,noreferrer,width=600,height=400`)}function i(){let e=encodeURIComponent(t.url||window.location.href),n=encodeURIComponent(t.title);window.open(`https://twitter.com/intent/tweet?url=${e}&text=${n}`,`_blank`,`noopener,noreferrer,width=600,height=400`)}function a(){alert(`请复制链接后在微信中粘贴发送`)}async function o(){try{await navigator.clipboard.writeText(t.url||window.location.href),n.value=!0,setTimeout(()=>n.value=!1,2e3)}catch{let e=document.createElement(`textarea`);e.value=t.url||window.location.href,document.body.appendChild(e),e.select(),document.execCommand(`copy`),document.body.removeChild(e),n.value=!0,setTimeout(()=>n.value=!1,2e3)}}return(e,t)=>(S(),c(`div`,vx,[t[4]||=s(`span`,{class:`share-label`},`分享：`,-1),s(`button`,{class:`share-btn wechat`,title:`微信`,onClick:a},[...t[0]||=[s(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`},[s(`path`,{d:`M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.136 0 .241-.11.241-.245 0-.06-.024-.12-.04-.178l-.325-1.233a.49.49 0 0 1 .178-.554C23.028 18.48 24 16.82 24 14.98c0-3.21-2.931-5.952-7.062-6.122zm-2.18 2.769c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z`})],-1)]]),s(`button`,{class:`share-btn weibo`,title:`微博`,onClick:r},[...t[1]||=[s(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`},[s(`path`,{d:`M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zm-7.317-6.781c-1.059-.2-1.911.419-1.903 1.383.008.964.87 1.907 1.93 2.107 1.058.2 1.91-.419 1.903-1.383-.008-.964-.87-1.907-1.93-2.107zm2.13 3.68c-.563-.249-.754-.766-.428-1.153.326-.388 1.019-.523 1.58-.275.56.248.753.764.429 1.153-.326.386-1.018.524-1.581.275zm.992-3.808c-2.07-.028-4.538.537-7.344 2.641C-.405 17.1-.279 19.15.35 20.49c.528 1.123 1.494 1.773 2.43 2.144 4.878 1.935 10.857.606 13.679-1.35 2.934-2.035 4.033-4.771 3.157-7.165-.516-1.405-1.797-2.398-3.31-2.882l.06-.05c2.485-2.08 4.213-4.585 4.213-7.146 0-5.213-7.11-7.735-10.966-5.371-1.742 1.07-2.772 2.788-3.064 4.72.422-.12.865-.197 1.323-.23 3.271-.241 7.273.776 7.273 3.86 0 3.502-3.823 4.667-6.721 4.667-.89 0-1.785-.215-2.595-.598z`})],-1)]]),s(`button`,{class:`share-btn twitter`,title:`Twitter`,onClick:i},[...t[2]||=[s(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`},[s(`path`,{d:`M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z`})],-1)]]),s(`button`,{class:`share-btn copy`,title:`复制链接`,onClick:o},[...t[3]||=[s(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`path`,{d:`M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71`}),s(`path`,{d:`M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71`})],-1)]]),n.value?(S(),c(`span`,yx,`已复制`)):b(``,!0)]))}},[[`__scopeId`,`data-v-857c6fb5`]]),xx={key:0,class:`related-section`},Sx={class:`related-grid`},Cx={key:0,class:`related-cover`},wx=[`src`,`alt`],Tx={class:`related-card-title`},Ex=y({__name:`RelatedArticles`,props:{articles:{type:Array,default:()=>[]}},setup(t){return(i,a)=>{let o=n(`router-link`);return t.articles.length?(S(),c(`section`,xx,[a[0]||=s(`h3`,{class:`related-title`},`相关文章`,-1),s(`div`,Sx,[(S(!0),c(d,null,r(t.articles,t=>(S(),m(o,{key:t.slug,to:`/article/`+t.slug,class:`related-card`},{default:e(()=>[t.cover_image?(S(),c(`div`,Cx,[s(`img`,{src:t.cover_image,alt:t.title,loading:`lazy`},null,8,wx)])):b(``,!0),s(`span`,Tx,l(t.title),1)]),_:2},1032,[`to`]))),128))])])):b(``,!0)}}},[[`__scopeId`,`data-v-e3d8298c`]]),Dx={class:`newsletter glass-card`},Ox=[`disabled`],kx=[`disabled`],Ax={key:0},jx={key:1},Mx={key:2},Nx=y({__name:`NewsletterForm`,setup(e){let t=w(``),n=w(!1),r=w(!1),i=w(``),a=w(``);async function o(){if(t.value.trim()){n.value=!0,i.value=``;try{let e=await T.post(`/subscribe/`,{email:t.value.trim()});r.value=!0,i.value=e.data.detail||`订阅成功！`,a.value=`msg-success`}catch(e){let t=e?.response?.data?.error||e?.response?.data?.detail||`订阅失败`;i.value=typeof t==`string`?t:`订阅失败，请稍后重试`,a.value=`msg-error`}finally{n.value=!1}}}return(e,u)=>(S(),c(`div`,Dx,[u[1]||=_(`<h4 class="newsletter-title" data-v-54a32a66><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-54a32a66><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" data-v-54a32a66></path><polyline points="22,6 12,13 2,6" data-v-54a32a66></polyline></svg> 订阅更新 </h4><p class="newsletter-desc" data-v-54a32a66>新文章发布时，通过邮件通知你</p>`,2),s(`form`,{onSubmit:k(o,[`prevent`]),class:`newsletter-form`},[f(s(`input`,{"onUpdate:modelValue":u[0]||=e=>t.value=e,type:`email`,placeholder:`your@email.com`,class:`newsletter-input`,disabled:r.value,required:``},null,8,Ox),[[O,t.value]]),s(`button`,{type:`submit`,class:`newsletter-btn`,disabled:n.value||r.value},[n.value?(S(),c(`span`,Ax,`...`)):r.value?(S(),c(`span`,jx,`✓`)):(S(),c(`span`,Mx,`订阅`))],8,kx)],32),i.value?(S(),c(`p`,{key:0,class:h(a.value)},l(i.value),3)):b(``,!0)]))}},[[`__scopeId`,`data-v-54a32a66`]]),Px=`个人博客Blog`,Fx=`Zhou Jun 的个人博客 — 技术、编程、AI 与科学`;function Ix(e={}){let{title:t=Px,description:n=Fx,image:r=``,url:i=window.location.href}=e,a=t===`个人博客Blog`?t:`${t} | ${Px}`;document.title=a;let o=(e,t,n=!1)=>{if(!t)return;let r=n?`name`:`property`,i=document.querySelector(`meta[${r}="${e}"]`);i||(i=document.createElement(`meta`),i.setAttribute(r,e),document.head.appendChild(i)),i.setAttribute(`content`,t)};o(`description`,n,!0),o(`og:title`,a),o(`og:description`,n),o(`og:image`,r),o(`og:url`,i),o(`og:type`,`article`),o(`twitter:card`,r?`summary_large_image`:`summary`),o(`twitter:title`,a),o(`twitter:description`,n),o(`twitter:image`,r),((e,t)=>{if(!t)return;let n=document.querySelector(`link[rel="${e}"]`);n||(n=document.createElement(`link`),n.setAttribute(`rel`,e),document.head.appendChild(n)),n.setAttribute(`href`,t)})(`canonical`,i)}var Lx={title:Px,description:Fx,image:``,url:``};function Rx(){Ix({...Lx,url:window.location.origin+`/`});let e=document.querySelector(`meta[property="og:type"]`);e&&e.setAttribute(`content`,`website`);let t=document.querySelector(`link[rel="canonical"]`);t&&t.setAttribute(`href`,window.location.origin+`/`)}function zx(e){if(!e)return 1;let t=(e.match(/[一-鿿㐀-䶿]/g)||[]).length+(e.match(/[a-zA-Z]+/g)||[]).length;return Math.max(1,Math.ceil(t/250))}function Bx(e){return e?e.replace(/```[\s\S]*?```/g,``).replace(/`[^`]*`/g,``).replace(/!\[.*?\]\(.*?\)/g,``).replace(/\[([^\]]*)\]\(.*?\)/g,`$1`).replace(/[#*>`~\-+|_:]/g,` `).replace(/\s+/g,` `).trim():``}var Vx={class:`page page-article-detail`},Hx={key:0,class:`detail-skeleton`},Ux={key:1,class:`error-state`},Wx={key:2,class:`detail-layout`},Gx={class:`detail-main`},Kx={class:`article-header`},qx={class:`article-title`},Jx={class:`article-meta`},Yx={class:`meta-item meta-author`},Xx={class:`meta-item meta-date`},Zx={key:0,class:`meta-item meta-category neon-text-pink`},Qx={class:`meta-item meta-reading-time`},$x={class:`meta-item meta-views`},eS={key:0,class:`article-tags`},tS={key:0,class:`article-cover`},nS=[`src`,`alt`],rS={key:1,class:`article-nav`},iS={class:`nav-title`},aS={class:`nav-title`},oS={class:`article-actions`},sS=[`disabled`],cS={class:`comment-section`},lS={class:`detail-sidebar`},uS=y({__name:`ArticleDetail`,setup(i){let o=E();D();let f=N(),y=w(null),x=w(!0),C=w(null),O=w(null),k=w(0),P=0,F=v(()=>y.value?.created_at?new Date(y.value.created_at).toLocaleDateString(`zh-CN`,{year:`numeric`,month:`2-digit`,day:`2-digit`}):``),I=v(()=>M(y.value?.author)),L=v(()=>j(y.value?.category)),R=v(()=>{let e=y.value?.tags;return!e||!Array.isArray(e)?[]:e.map(A).filter(Boolean)}),z=w(!1),B=w(!1),V=v(()=>window.location.origin+o.fullPath),H=v(()=>y.value?y.value.reading_time?y.value.reading_time:zx(Bx(y.value.content||``)):1),U=v(()=>y.value?JSON.stringify({"@context":`https://schema.org`,"@type":`Article`,headline:y.value.title,description:y.value.excerpt||``,image:y.value.cover_image||void 0,datePublished:y.value.created_at,dateModified:y.value.updated_at,author:{"@type":`Person`,name:`Zhou Jun`},publisher:{"@type":`Person`,name:`Zhou Jun`}}):``),ee=null;p(U,e=>{if(!e){ee?.remove(),ee=null;return}ee||(ee=document.createElement(`script`),ee.type=`application/ld+json`,ee.dataset.articleJsonLd=`1`,document.head.appendChild(ee)),ee.textContent=e},{immediate:!0});async function W(){if(!(z.value||B.value)){B.value=!0;try{let e=await T.post(`/articles/${y.value.slug}/like/`);y.value&&(y.value.likes_count=e.data.likes_count),z.value=!0}catch{}finally{B.value=!1}}}async function G(){let e=o.params.slug,t=++P;if(!e){C.value=`缺少文章标识`,O.value=null,x.value=!1;return}x.value=!0,C.value=null,O.value=null,y.value=null,z.value=!1;try{let n=f.getArticleBySlug(e);if(n){if(t!==P)return;y.value=n,x.value=!1,K();return}let r=await f.fetchArticleBySlug(e);if(t!==P)return;y.value=r,y.value?K():C.value=`文章不存在`}catch(e){if(t!==P)return;O.value=e?.response?.status??null,O.value===404?C.value=`文章不存在`:C.value=e?.response?.data?.detail||e.message||`加载文章失败`}finally{t===P&&(x.value=!1)}}function K(){y.value&&Ix({title:y.value.title,description:y.value.excerpt||``,image:y.value.cover_image||``,url:window.location.origin+o.fullPath})}return a(G),p(()=>o.params.slug,()=>{window.scrollTo({top:0,behavior:`instant`}),k.value++,G()}),t(()=>{Rx(),ee?.remove(),ee=null}),(t,i)=>{let a=n(`router-link`);return S(),c(`div`,Vx,[x.value?(S(),c(`div`,Hx,[...i[1]||=[_(`<div class="skeleton-header" data-v-c0862088><div class="skeleton-line w-80 skeleton-lg" data-v-c0862088></div><div class="skeleton-meta-row" data-v-c0862088><div class="skeleton-line w-20" data-v-c0862088></div><div class="skeleton-line w-15" data-v-c0862088></div><div class="skeleton-line w-10" data-v-c0862088></div></div></div><div class="skeleton-body" data-v-c0862088><div class="skeleton-line w-100" data-v-c0862088></div><div class="skeleton-line w-100" data-v-c0862088></div><div class="skeleton-line w-90" data-v-c0862088></div><div class="skeleton-line w-100" data-v-c0862088></div><div class="skeleton-line w-70" data-v-c0862088></div></div>`,2)]])):C.value?(S(),c(`div`,Ux,[i[3]||=s(`svg`,{width:`48`,height:`48`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`1.5`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`circle`,{cx:`12`,cy:`12`,r:`10`}),s(`line`,{x1:`12`,y1:`8`,x2:`12`,y2:`12`}),s(`line`,{x1:`12`,y1:`16`,x2:`12.01`,y2:`16`})],-1),s(`h2`,null,l(O.value===404?`文章不存在`:`加载失败`),1),s(`p`,null,l(C.value),1),u(a,{to:`/articles`,class:`back-link`},{default:e(()=>[...i[2]||=[g(`返回首页`,-1)]]),_:1})])):y.value?(S(),c(`div`,Wx,[s(`article`,Gx,[s(`header`,Kx,[s(`h1`,qx,l(y.value.title),1),s(`div`,Jx,[s(`span`,Yx,[i[4]||=s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`path`,{d:`M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2`}),s(`circle`,{cx:`12`,cy:`7`,r:`4`})],-1),g(` `+l(I.value),1)]),s(`span`,Xx,[i[5]||=_(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-c0862088><rect x="3" y="4" width="18" height="18" rx="2" ry="2" data-v-c0862088></rect><line x1="16" y1="2" x2="16" y2="6" data-v-c0862088></line><line x1="8" y1="2" x2="8" y2="6" data-v-c0862088></line><line x1="3" y1="10" x2="21" y2="10" data-v-c0862088></line></svg>`,1),g(` `+l(F.value),1)]),y.value.category?(S(),c(`span`,Zx,[i[6]||=s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`path`,{d:`M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z`})],-1),g(` `+l(L.value),1)])):b(``,!0),s(`span`,Qx,[i[7]||=s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`circle`,{cx:`12`,cy:`12`,r:`10`}),s(`polyline`,{points:`12 6 12 12 16 14`})],-1),g(` 约 `+l(H.value)+` 分钟 `,1)]),s(`span`,$x,[i[8]||=s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`path`,{d:`M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z`}),s(`circle`,{cx:`12`,cy:`12`,r:`3`})],-1),g(` `+l(y.value.views_count||0),1)])]),R.value.length?(S(),c(`div`,eS,[(S(!0),c(d,null,r(R.value,(e,t)=>(S(),c(`span`,{key:t,class:`tag-pill`},l(e),1))),128))])):b(``,!0)]),y.value.cover_image?(S(),c(`div`,tS,[s(`img`,{src:y.value.cover_image,alt:y.value.title},null,8,nS)])):b(``,!0),u(Eb,{html:y.value.html_content||y.value.content||``,title:y.value.title},null,8,[`html`,`title`]),y.value.prev_article||y.value.next_article?(S(),c(`nav`,rS,[y.value.prev_article?(S(),m(a,{key:0,to:`/article/`+(y.value.prev_article.slug||y.value.prev_article),class:`nav-link prev-link`},{default:e(()=>[i[9]||=s(`span`,{class:`nav-direction`},[s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`polyline`,{points:`15 18 9 12 15 6`})]),g(` 上一篇 `)],-1),s(`span`,iS,l(y.value.prev_article.title||y.value.prev_article),1)]),_:1},8,[`to`])):b(``,!0),y.value.next_article?(S(),m(a,{key:1,to:`/article/`+(y.value.next_article.slug||y.value.next_article),class:`nav-link next-link`},{default:e(()=>[i[10]||=s(`span`,{class:`nav-direction`},[g(` 下一篇 `),s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`polyline`,{points:`9 18 15 12 9 6`})])],-1),s(`span`,aS,l(y.value.next_article.title||y.value.next_article),1)]),_:1},8,[`to`])):b(``,!0)])):b(``,!0),s(`div`,oS,[u(bx,{title:y.value.title,url:V.value},null,8,[`title`,`url`]),s(`button`,{class:h([`like-btn`,{liked:z.value}]),disabled:B.value,onClick:W},[i[11]||=s(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`},[s(`path`,{d:`M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z`})],-1),s(`span`,null,l(y.value.likes_count||0),1)],10,sS)]),u(Ex,{articles:y.value.related_articles||[]},null,8,[`articles`]),u(Nx),s(`section`,cS,[(S(),m(dx,{"article-slug":y.value.slug,key:k.value},null,8,[`article-slug`])),u(Wb,{"article-slug":y.value.slug,onSubmitted:i[0]||=e=>k.value++},null,8,[`article-slug`])])]),s(`aside`,lS,[u(_x,{html:y.value.html_content||y.value.content||``},null,8,[`html`])])])):b(``,!0)])}}},[[`__scopeId`,`data-v-c0862088`]]);export{uS as default};