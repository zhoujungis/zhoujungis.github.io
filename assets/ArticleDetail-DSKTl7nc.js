import{A as e,B as t,C as n,D as r,M as i,O as a,S as o,T as s,c,d as l,dt as u,ft as d,h as f,i as p,j as m,l as h,m as g,p as _,s as v,t as y,u as b,ut as x,w as S,x as C,z as w}from"./_plugin-vue_export-helper-YRtCl6lT.js";import{t as T}from"./client-DyaaoQco.js";import{b as E,d as D,h as O,m as k,t as A,x as j}from"./index-Dmbf9Kvx.js";import{i as M,n as N,t as P}from"./labels-d5CYMb5M.js";import{t as F}from"./article-5CsAvdDH.js";function I(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function L(e){if(Array.isArray(e))return e}function R(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r,i,a,o,s=[],c=!0,l=!1;try{if(a=(n=n.call(e)).next,t!==0)for(;!(c=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);c=!0);}catch(e){l=!0,i=e}finally{try{if(!c&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(l)throw i}}return s}}function z(){throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function B(e,t){return L(e)||R(e,t)||V(e,t)||z()}function V(e,t){if(e){if(typeof e==`string`)return I(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?I(e,t):void 0}}var H=Object.entries,U=Object.setPrototypeOf,ee=Object.isFrozen,te=Object.getPrototypeOf,W=Object.getOwnPropertyDescriptor,G=Object.freeze,K=Object.seal,ne=Object.create,q=typeof Reflect<`u`&&Reflect,re=q.apply,ie=q.construct;G||=function(e){return e},K||=function(e){return e},re||=function(e,t){var n=[...arguments].slice(2);return e.apply(t,n)},ie||=function(e){return new e(...[...arguments].slice(1))};var ae=Te(Array.prototype.forEach),oe=Te(Array.prototype.lastIndexOf),se=Te(Array.prototype.pop),ce=Te(Array.prototype.push),le=Te(Array.prototype.splice),ue=Array.isArray,de=Te(String.prototype.toLowerCase),fe=Te(String.prototype.toString),pe=Te(String.prototype.match),me=Te(String.prototype.replace),he=Te(String.prototype.indexOf),ge=Te(String.prototype.trim),_e=Te(Number.prototype.toString),ve=Te(Boolean.prototype.toString),ye=typeof BigInt>`u`?null:Te(BigInt.prototype.toString),be=typeof Symbol>`u`?null:Te(Symbol.prototype.toString),xe=Te(Object.prototype.hasOwnProperty),Se=Te(Object.prototype.toString),Ce=Te(RegExp.prototype.test),we=Ee(TypeError);function Te(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);var n=[...arguments].slice(1);return re(e,t,n)}}function Ee(e){return function(){return ie(e,[...arguments])}}function J(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:de;if(U&&U(e,null),!ue(t))return e;let r=t.length;for(;r--;){let i=t[r];if(typeof i==`string`){let e=n(i);e!==i&&(ee(t)||(t[r]=e),i=e)}e[i]=!0}return e}function De(e){for(let t=0;t<e.length;t++)xe(e,t)||(e[t]=null);return e}function Oe(e){let t=ne(null);for(let r of H(e)){var n=B(r,2);let i=n[0],a=n[1];xe(e,i)&&(ue(a)?t[i]=De(a):a&&typeof a==`object`&&a.constructor===Object?t[i]=Oe(a):t[i]=a)}return t}function ke(e){switch(typeof e){case`string`:return e;case`number`:return _e(e);case`boolean`:return ve(e);case`bigint`:return ye?ye(e):`0`;case`symbol`:return be?be(e):`Symbol()`;case`undefined`:return Se(e);case`function`:case`object`:{if(e===null)return Se(e);let t=e,n=Ae(t,`toString`);if(typeof n==`function`){let e=n(t);return typeof e==`string`?e:Se(e)}return Se(e)}default:return Se(e)}}function Ae(e,t){for(;e!==null;){let n=W(e,t);if(n){if(n.get)return Te(n.get);if(typeof n.value==`function`)return Te(n.value)}e=te(e)}function n(){return null}return n}function je(e){try{return Ce(e,``),!0}catch{return!1}}var Me=G(`a.abbr.acronym.address.area.article.aside.audio.b.bdi.bdo.big.blink.blockquote.body.br.button.canvas.caption.center.cite.code.col.colgroup.content.data.datalist.dd.decorator.del.details.dfn.dialog.dir.div.dl.dt.element.em.fieldset.figcaption.figure.font.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.img.input.ins.kbd.label.legend.li.main.map.mark.marquee.menu.menuitem.meter.nav.nobr.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.section.select.shadow.slot.small.source.spacer.span.strike.strong.style.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.track.tt.u.ul.var.video.wbr`.split(`.`)),Ne=G(`svg.a.altglyph.altglyphdef.altglyphitem.animatecolor.animatemotion.animatetransform.circle.clippath.defs.desc.ellipse.enterkeyhint.exportparts.filter.font.g.glyph.glyphref.hkern.image.inputmode.line.lineargradient.marker.mask.metadata.mpath.part.path.pattern.polygon.polyline.radialgradient.rect.stop.style.switch.symbol.text.textpath.title.tref.tspan.view.vkern`.split(`.`)),Pe=G([`feBlend`,`feColorMatrix`,`feComponentTransfer`,`feComposite`,`feConvolveMatrix`,`feDiffuseLighting`,`feDisplacementMap`,`feDistantLight`,`feDropShadow`,`feFlood`,`feFuncA`,`feFuncB`,`feFuncG`,`feFuncR`,`feGaussianBlur`,`feImage`,`feMerge`,`feMergeNode`,`feMorphology`,`feOffset`,`fePointLight`,`feSpecularLighting`,`feSpotLight`,`feTile`,`feTurbulence`]),Fe=G([`animate`,`color-profile`,`cursor`,`discard`,`font-face`,`font-face-format`,`font-face-name`,`font-face-src`,`font-face-uri`,`foreignobject`,`hatch`,`hatchpath`,`mesh`,`meshgradient`,`meshpatch`,`meshrow`,`missing-glyph`,`script`,`set`,`solidcolor`,`unknown`,`use`]),Ie=G(`math.menclose.merror.mfenced.mfrac.mglyph.mi.mlabeledtr.mmultiscripts.mn.mo.mover.mpadded.mphantom.mroot.mrow.ms.mspace.msqrt.mstyle.msub.msup.msubsup.mtable.mtd.mtext.mtr.munder.munderover.mprescripts`.split(`.`)),Le=G([`maction`,`maligngroup`,`malignmark`,`mlongdiv`,`mscarries`,`mscarry`,`msgroup`,`mstack`,`msline`,`msrow`,`semantics`,`annotation`,`annotation-xml`,`mprescripts`,`none`]),Re=G([`#text`]),ze=G(`accept.action.align.alt.autocapitalize.autocomplete.autopictureinpicture.autoplay.background.bgcolor.border.capture.cellpadding.cellspacing.checked.cite.class.clear.color.cols.colspan.command.commandfor.controls.controlslist.coords.crossorigin.datetime.decoding.default.dir.disabled.disablepictureinpicture.disableremoteplayback.download.draggable.enctype.enterkeyhint.exportparts.face.for.headers.height.hidden.high.href.hreflang.id.inert.inputmode.integrity.ismap.kind.label.lang.list.loading.loop.low.max.maxlength.media.method.min.minlength.multiple.muted.name.nonce.noshade.novalidate.nowrap.open.optimum.part.pattern.placeholder.playsinline.popover.popovertarget.popovertargetaction.poster.preload.pubdate.radiogroup.readonly.rel.required.rev.reversed.role.rows.rowspan.spellcheck.scope.selected.shape.size.sizes.slot.span.srclang.start.src.srcset.step.style.summary.tabindex.title.translate.type.usemap.valign.value.width.wrap.xmlns`.split(`.`)),Be=G(`accent-height.accumulate.additive.alignment-baseline.amplitude.ascent.attributename.attributetype.azimuth.basefrequency.baseline-shift.begin.bias.by.class.clip.clippathunits.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.cx.cy.d.dx.dy.diffuseconstant.direction.display.divisor.dominant-baseline.dur.edgemode.elevation.end.exponent.fill.fill-opacity.fill-rule.filter.filterunits.flood-color.flood-opacity.font-family.font-size.font-size-adjust.font-stretch.font-style.font-variant.font-weight.fx.fy.g1.g2.glyph-name.glyphref.gradientunits.gradienttransform.height.href.id.image-rendering.in.in2.intercept.k.k1.k2.k3.k4.kerning.keypoints.keysplines.keytimes.lang.lengthadjust.letter-spacing.kernelmatrix.kernelunitlength.lighting-color.local.marker-end.marker-mid.marker-start.markerheight.markerunits.markerwidth.maskcontentunits.maskunits.max.mask.mask-type.media.method.mode.min.name.numoctaves.offset.operator.opacity.order.orient.orientation.origin.overflow.paint-order.path.pathlength.patterncontentunits.patterntransform.patternunits.points.preservealpha.preserveaspectratio.primitiveunits.r.rx.ry.radius.refx.refy.repeatcount.repeatdur.restart.result.rotate.scale.seed.shape-rendering.slope.specularconstant.specularexponent.spreadmethod.startoffset.stddeviation.stitchtiles.stop-color.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke.stroke-width.style.surfacescale.systemlanguage.tabindex.tablevalues.targetx.targety.transform.transform-origin.text-anchor.text-decoration.text-orientation.text-rendering.textlength.type.u1.u2.unicode.values.viewbox.visibility.version.vert-adv-y.vert-origin-x.vert-origin-y.width.word-spacing.wrap.writing-mode.xchannelselector.ychannelselector.x.x1.x2.xmlns.y.y1.y2.z.zoomandpan`.split(`.`)),Ve=G(`accent.accentunder.align.bevelled.close.columnalign.columnlines.columnspacing.columnspan.denomalign.depth.dir.display.displaystyle.encoding.fence.frame.height.href.id.largeop.length.linethickness.lquote.lspace.mathbackground.mathcolor.mathsize.mathvariant.maxsize.minsize.movablelimits.notation.numalign.open.rowalign.rowlines.rowspacing.rowspan.rspace.rquote.scriptlevel.scriptminsize.scriptsizemultiplier.selection.separator.separators.stretchy.subscriptshift.supscriptshift.symmetric.voffset.width.xmlns`.split(`.`)),He=G([`xlink:href`,`xml:id`,`xlink:title`,`xml:space`,`xmlns:xlink`]),Ue=K(/{{[\w\W]*|^[\w\W]*}}/g),We=K(/<%[\w\W]*|^[\w\W]*%>/g),Ge=K(/\${[\w\W]*/g),Ke=K(/^data-[\-\w.\u00B7-\uFFFF]+$/),qe=K(/^aria-[\-\w]+$/),Je=K(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Ye=K(/^(?:\w+script|data):/i),Xe=K(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Ze=K(/^html$/i),Qe=K(/^[a-z][.\w]*(-[.\w]+)+$/i),$e=K(/<[/\w!]/g),et=K(/<[/\w]/g),tt=K(/<\/no(script|embed|frames)/i),nt=K(/\/>/i),rt={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,processingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},it=function(){return typeof window>`u`?null:window},at=function(e,t){if(typeof e!=`object`||typeof e.createPolicy!=`function`)return null;let n=null,r=`data-tt-policy-suffix`;t&&t.hasAttribute(r)&&(n=t.getAttribute(r));let i=`dompurify`+(n?`#`+n:``);try{return e.createPolicy(i,{createHTML(e){return e},createScriptURL(e){return e}})}catch{return console.warn(`TrustedTypes policy `+i+` could not be created.`),null}},ot=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},st=function(e,t,n,r){return xe(e,t)&&ue(e[t])?J(r.base?Oe(r.base):{},e[t],r.transform):n};function ct(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:it(),t=e=>ct(e);if(t.version=`3.4.12`,t.removed=[],!e||!e.document||e.document.nodeType!==rt.document||!e.Element)return t.isSupported=!1,t;let n=e.document,r=n,i=r.currentScript;e.DocumentFragment;let a=e.HTMLTemplateElement,o=e.Node,s=e.Element,c=e.NodeFilter;e.NamedNodeMap===void 0&&(e.NamedNodeMap||e.MozNamedAttrMap),e.HTMLFormElement;let l=e.DOMParser,u=e.trustedTypes,d=s.prototype,f=Ae(d,`cloneNode`),p=Ae(d,`remove`),m=Ae(d,`nextSibling`),h=Ae(d,`childNodes`),g=Ae(d,`parentNode`),_=Ae(d,`shadowRoot`),v=Ae(d,`attributes`),y=o&&o.prototype?Ae(o.prototype,`nodeType`):null,b=o&&o.prototype?Ae(o.prototype,`nodeName`):null;if(typeof a==`function`){let e=n.createElement(`template`);e.content&&e.content.ownerDocument&&(n=e.content.ownerDocument)}let x,S=``,C,w=!1,T=0,E=function(){if(T>0)throw we(`A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.`)},D=function(e){E(),T++;try{return x.createHTML(e)}finally{T--}},O=function(e){E(),T++;try{return x.createScriptURL(e)}finally{T--}},k=function(){return w||=(C=at(u,i),!0),C},A=n,j=A.implementation,M=A.createNodeIterator,N=A.createDocumentFragment,P=A.getElementsByTagName,F=r.importNode,I=ot();t.isSupported=typeof H==`function`&&typeof g==`function`&&j&&j.createHTMLDocument!==void 0;let L=Ue,R=We,z=Ge,B=Ke,V=qe,U=Ye,ee=Xe,te=Qe,W=Je,q=null,re=J({},[...Me,...Ne,...Pe,...Ie,...Re]),ie=null,_e=J({},[...ze,...Be,...Ve,...He]),ve=Object.seal(ne(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),ye=null,be=null,Se=Object.seal(ne(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),Te=!0,Ee=!0,De=!1,lt=!0,ut=!1,dt=!0,ft=!1,pt=!1,Y=null,mt=null,ht=!1,X=!1,gt=!1,Z=!1,Q=!0,$=!1,_t=`user-content-`,vt=!0,yt=!1,bt={},xt=null,St=J({},`annotation-xml.audio.colgroup.desc.foreignobject.head.iframe.math.mi.mn.mo.ms.mtext.noembed.noframes.noscript.plaintext.script.selectedcontent.style.svg.template.thead.title.video.xmp`.split(`.`)),Ct=null,wt=J({},[`audio`,`video`,`img`,`source`,`image`,`track`]),Tt=null,Et=J({},[`alt`,`class`,`for`,`id`,`label`,`name`,`pattern`,`placeholder`,`role`,`summary`,`title`,`value`,`style`,`xmlns`]),Dt=`http://www.w3.org/1998/Math/MathML`,Ot=`http://www.w3.org/2000/svg`,kt=`http://www.w3.org/1999/xhtml`,At=kt,jt=!1,Mt=null,Nt=J({},[Dt,Ot,kt],fe),Pt=G([`mi`,`mo`,`mn`,`ms`,`mtext`]),Ft=J({},Pt),It=G([`annotation-xml`]),Lt=J({},It),Rt=J({},[`title`,`style`,`font`,`a`,`script`]),zt=null,Bt=[`application/xhtml+xml`,`text/html`],Vt=null,Ht=null,Ut=n.createElement(`form`),Wt=function(e){return e instanceof RegExp||e instanceof Function},Gt=function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(Ht&&Ht===e)return;(!e||typeof e!=`object`)&&(e={}),e=Oe(e),zt=Bt.indexOf(e.PARSER_MEDIA_TYPE)===-1?`text/html`:e.PARSER_MEDIA_TYPE,Vt=zt===`application/xhtml+xml`?fe:de,q=st(e,`ALLOWED_TAGS`,re,{transform:Vt}),ie=st(e,`ALLOWED_ATTR`,_e,{transform:Vt}),Mt=st(e,`ALLOWED_NAMESPACES`,Nt,{transform:fe}),Tt=st(e,`ADD_URI_SAFE_ATTR`,Et,{transform:Vt,base:Et}),Ct=st(e,`ADD_DATA_URI_TAGS`,wt,{transform:Vt,base:wt}),xt=st(e,`FORBID_CONTENTS`,St,{transform:Vt}),ye=st(e,`FORBID_TAGS`,Oe({}),{transform:Vt}),be=st(e,`FORBID_ATTR`,Oe({}),{transform:Vt}),bt=xe(e,`USE_PROFILES`)?e.USE_PROFILES&&typeof e.USE_PROFILES==`object`?Oe(e.USE_PROFILES):e.USE_PROFILES:!1,Te=e.ALLOW_ARIA_ATTR!==!1,Ee=e.ALLOW_DATA_ATTR!==!1,De=e.ALLOW_UNKNOWN_PROTOCOLS||!1,lt=e.ALLOW_SELF_CLOSE_IN_ATTR!==!1,ut=e.SAFE_FOR_TEMPLATES||!1,dt=e.SAFE_FOR_XML!==!1,ft=e.WHOLE_DOCUMENT||!1,X=e.RETURN_DOM||!1,gt=e.RETURN_DOM_FRAGMENT||!1,Z=e.RETURN_TRUSTED_TYPE||!1,ht=e.FORCE_BODY||!1,Q=e.SANITIZE_DOM!==!1,$=e.SANITIZE_NAMED_PROPS||!1,vt=e.KEEP_CONTENT!==!1,yt=e.IN_PLACE||!1,W=je(e.ALLOWED_URI_REGEXP)?e.ALLOWED_URI_REGEXP:Je,At=typeof e.NAMESPACE==`string`?e.NAMESPACE:kt,Ft=xe(e,`MATHML_TEXT_INTEGRATION_POINTS`)&&e.MATHML_TEXT_INTEGRATION_POINTS&&typeof e.MATHML_TEXT_INTEGRATION_POINTS==`object`?Oe(e.MATHML_TEXT_INTEGRATION_POINTS):J({},Pt),Lt=xe(e,`HTML_INTEGRATION_POINTS`)&&e.HTML_INTEGRATION_POINTS&&typeof e.HTML_INTEGRATION_POINTS==`object`?Oe(e.HTML_INTEGRATION_POINTS):J({},It);let t=xe(e,`CUSTOM_ELEMENT_HANDLING`)&&e.CUSTOM_ELEMENT_HANDLING&&typeof e.CUSTOM_ELEMENT_HANDLING==`object`?Oe(e.CUSTOM_ELEMENT_HANDLING):ne(null);if(ve=ne(null),xe(t,`tagNameCheck`)&&Wt(t.tagNameCheck)&&(ve.tagNameCheck=t.tagNameCheck),xe(t,`attributeNameCheck`)&&Wt(t.attributeNameCheck)&&(ve.attributeNameCheck=t.attributeNameCheck),xe(t,`allowCustomizedBuiltInElements`)&&typeof t.allowCustomizedBuiltInElements==`boolean`&&(ve.allowCustomizedBuiltInElements=t.allowCustomizedBuiltInElements),K(ve),ut&&(Ee=!1),gt&&(X=!0),bt&&(q=J({},Re),ie=ne(null),bt.html===!0&&(J(q,Me),J(ie,ze)),bt.svg===!0&&(J(q,Ne),J(ie,Be),J(ie,He)),bt.svgFilters===!0&&(J(q,Pe),J(ie,Be),J(ie,He)),bt.mathMl===!0&&(J(q,Ie),J(ie,Ve),J(ie,He))),Se.tagCheck=null,Se.attributeCheck=null,xe(e,`ADD_TAGS`)&&(typeof e.ADD_TAGS==`function`?Se.tagCheck=e.ADD_TAGS:ue(e.ADD_TAGS)&&(q===re&&(q=Oe(q)),J(q,e.ADD_TAGS,Vt))),xe(e,`ADD_ATTR`)&&(typeof e.ADD_ATTR==`function`?Se.attributeCheck=e.ADD_ATTR:ue(e.ADD_ATTR)&&(ie===_e&&(ie=Oe(ie)),J(ie,e.ADD_ATTR,Vt))),xe(e,`ADD_URI_SAFE_ATTR`)&&ue(e.ADD_URI_SAFE_ATTR)&&J(Tt,e.ADD_URI_SAFE_ATTR,Vt),xe(e,`FORBID_CONTENTS`)&&ue(e.FORBID_CONTENTS)&&(xt===St&&(xt=Oe(xt)),J(xt,e.FORBID_CONTENTS,Vt)),xe(e,`ADD_FORBID_CONTENTS`)&&ue(e.ADD_FORBID_CONTENTS)&&(xt===St&&(xt=Oe(xt)),J(xt,e.ADD_FORBID_CONTENTS,Vt)),vt&&(q[`#text`]=!0),ft&&J(q,[`html`,`head`,`body`]),q.table&&(J(q,[`tbody`]),delete ye.tbody),e.TRUSTED_TYPES_POLICY){if(typeof e.TRUSTED_TYPES_POLICY.createHTML!=`function`)throw we(`TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.`);if(typeof e.TRUSTED_TYPES_POLICY.createScriptURL!=`function`)throw we(`TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.`);let t=x;x=e.TRUSTED_TYPES_POLICY;try{S=D(``)}catch(e){throw x=t,e}}else e.TRUSTED_TYPES_POLICY===null?(x=void 0,S=``):(x===void 0&&(x=k()),x&&typeof S==`string`&&(S=D(``)));G&&G(e),Ht=e},Kt=J({},[...Ne,...Pe,...Fe]),qt=J({},[...Ie,...Le]),Jt=function(e,t,n){return t.namespaceURI===kt?e===`svg`:t.namespaceURI===Dt?e===`svg`&&(n===`annotation-xml`||Ft[n]):!!Kt[e]},Yt=function(e,t,n){return t.namespaceURI===kt?e===`math`:t.namespaceURI===Ot?e===`math`&&Lt[n]:!!qt[e]},Xt=function(e,t,n){return t.namespaceURI===Ot&&!Lt[n]||t.namespaceURI===Dt&&!Ft[n]?!1:!qt[e]&&(Rt[e]||!Kt[e])},Zt=function(e){let t=g(e);(!t||!t.tagName)&&(t={namespaceURI:At,tagName:`template`});let n=de(e.tagName),r=de(t.tagName);return Mt[e.namespaceURI]?e.namespaceURI===Ot?Jt(n,t,r):e.namespaceURI===Dt?Yt(n,t,r):e.namespaceURI===kt?Xt(n,t,r):!!(zt===`application/xhtml+xml`&&Mt[e.namespaceURI]):!1},Qt=function(e){ce(t.removed,{element:e});try{g(e).removeChild(e)}catch{if(p(e),!g(e))throw we(`a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place`)}},$t=function(e){nn(e);let t=h(e);if(t){let e=[];ae(t,t=>{ce(e,t)}),ae(e,e=>{try{p(e)}catch{}})}let n=v(e);if(n)for(let t=n.length-1;t>=0;--t){let r=n[t],i=r&&r.name;if(typeof i==`string`)try{e.removeAttribute(i)}catch{}}},en=function(e,n){try{ce(t.removed,{attribute:n.getAttributeNode(e),from:n})}catch{ce(t.removed,{attribute:null,from:n})}if(n.removeAttribute(e),e===`is`)if(X||gt)try{Qt(n)}catch{}else try{n.setAttribute(e,``)}catch{}},tn=function(e){let t=v(e);if(t)for(let n=t.length-1;n>=0;--n){let r=t[n],i=r&&r.name;if(!(typeof i!=`string`||ie[Vt(i)]))try{e.removeAttribute(i)}catch{}}},nn=function(e){let t=[e];for(;t.length>0;){let e=t.pop();(y?y(e):e.nodeType)===rt.element&&tn(e);let n=h(e);if(n)for(let e=n.length-1;e>=0;--e)t.push(n[e])}},rn=function(e){if(!dt)return;let t=[e];for(;t.length>0;){let e=t.pop(),n=y?y(e):e.nodeType;if(n===rt.processingInstruction||n===rt.comment&&Ce(et,e.data)){try{p(e)}catch{}continue}if(n===rt.element){let t=e,n=Vt(b?b(e):e.nodeName);try{t.hasAttribute&&t.hasAttribute(`patchsrc`)&&t.removeAttribute(`patchsrc`),t.hasAttribute&&t.hasAttribute(`for`)&&n!==`label`&&n!==`output`&&t.removeAttribute(`for`)}catch{}}let r=h(e);if(r)for(let e=r.length-1;e>=0;--e)t.push(r[e])}},an=function(e){let t=null,r=null;if(ht)e=`<remove></remove>`+e;else{let t=pe(e,/^[\r\n\t ]+/);r=t&&t[0]}zt===`application/xhtml+xml`&&At===kt&&(e=`<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>`+e+`</body></html>`);let i=x?D(e):e;if(At===kt)try{t=new l().parseFromString(i,zt)}catch{}if(!t||!t.documentElement){t=j.createDocument(At,`template`,null);try{t.documentElement.innerHTML=jt?S:i}catch{}}let a=t.body||t.documentElement;return e&&r&&a.insertBefore(n.createTextNode(r),a.childNodes[0]||null),At===kt?P.call(t,ft?`html`:`body`)[0]:ft?t.documentElement:a},on=function(e){return M.call(e.ownerDocument||e,e,c.SHOW_ELEMENT|c.SHOW_COMMENT|c.SHOW_TEXT|c.SHOW_PROCESSING_INSTRUCTION|c.SHOW_CDATA_SECTION,null)},sn=function(e){return e=me(e,L,` `),e=me(e,R,` `),e=me(e,z,` `),e},cn=function(e){e.normalize();let t=M.call(e.ownerDocument||e,e,c.SHOW_TEXT|c.SHOW_COMMENT|c.SHOW_CDATA_SECTION|c.SHOW_PROCESSING_INSTRUCTION,null),n=t.nextNode();for(;n;)n.data=sn(n.data),n=t.nextNode();let r=e.querySelectorAll?.call(e,`template`);r&&ae(r,e=>{un(e.content)&&cn(e.content)})},ln=function(e){let t=b?b(e):null;return typeof t!=`string`||Vt(t)!==`form`?!1:typeof e.nodeName!=`string`||typeof e.textContent!=`string`||typeof e.removeChild!=`function`||e.attributes!==v(e)||typeof e.removeAttribute!=`function`||typeof e.setAttribute!=`function`||typeof e.namespaceURI!=`string`||typeof e.insertBefore!=`function`||typeof e.hasChildNodes!=`function`||e.nodeType!==y(e)||e.childNodes!==h(e)},un=function(e){if(!y||typeof e!=`object`||!e)return!1;try{return y(e)===rt.documentFragment}catch{return!1}},dn=function(e){if(!y||typeof e!=`object`||!e)return!1;try{return typeof y(e)==`number`}catch{return!1}};function fn(e,n,r){e.length!==0&&ae(e,e=>{e.call(t,n,r,Ht)})}let pn=function(e,t){return!!(dt&&e.hasChildNodes()&&!dn(e.firstElementChild)&&Ce($e,e.textContent)&&Ce($e,e.innerHTML)||dt&&e.namespaceURI===kt&&t===`style`&&dn(e.firstElementChild)||e.nodeType===rt.processingInstruction||dt&&e.nodeType===rt.comment&&Ce(et,e.data))},mn=function(e,t){if(!ye[t]&&vn(t)&&(ve.tagNameCheck instanceof RegExp&&Ce(ve.tagNameCheck,t)||ve.tagNameCheck instanceof Function&&ve.tagNameCheck(t)))return!1;if(vt&&!xt[t]){let t=g(e),n=h(e);if(n&&t){let r=n.length;for(let i=r-1;i>=0;--i){let r=yt?n[i]:f(n[i],!0);t.insertBefore(r,m(e))}}}return Qt(e),!0},hn=function(e,n){if(fn(I.beforeSanitizeElements,e,null),e!==n&&g(e)===null)return!0;if(ln(e))return Qt(e),!0;let r=Vt(b?b(e):e.nodeName);if(fn(I.uponSanitizeElement,e,{tagName:r,allowedTags:q}),e!==n&&g(e)===null)return!0;if(pn(e,r))return Qt(e),!0;if(ye[r]||!(Se.tagCheck instanceof Function&&Se.tagCheck(r))&&!q[r]){let t=mn(e,r);return t===!1&&fn(I.afterSanitizeElements,e,null),t}if((y?y(e):e.nodeType)===rt.element&&!Zt(e)||(r===`noscript`||r===`noembed`||r===`noframes`)&&Ce(tt,e.innerHTML))return Qt(e),!0;if(ut&&e.nodeType===rt.text){let n=sn(e.textContent);e.textContent!==n&&(ce(t.removed,{element:e.cloneNode()}),e.textContent=n)}return fn(I.afterSanitizeElements,e,null),!1},gn=function(e,t,r){if(be[t]||dt&&t===`patchsrc`||dt&&t===`for`&&e!==`label`&&e!==`output`||Q&&(t===`id`||t===`name`)&&(r in n||r in Ut))return!1;let i=ie[t]||Se.attributeCheck instanceof Function&&Se.attributeCheck(t,e);if(!(Ee&&Ce(B,t))&&!(Te&&Ce(V,t))){if(!i){if(!(vn(e)&&(ve.tagNameCheck instanceof RegExp&&Ce(ve.tagNameCheck,e)||ve.tagNameCheck instanceof Function&&ve.tagNameCheck(e))&&(ve.attributeNameCheck instanceof RegExp&&Ce(ve.attributeNameCheck,t)||ve.attributeNameCheck instanceof Function&&ve.attributeNameCheck(t,e))||t===`is`&&ve.allowCustomizedBuiltInElements&&(ve.tagNameCheck instanceof RegExp&&Ce(ve.tagNameCheck,r)||ve.tagNameCheck instanceof Function&&ve.tagNameCheck(r))))return!1}else if(!Tt[t]&&!Ce(W,me(r,ee,``))&&!((t===`src`||t===`xlink:href`||t===`href`)&&e!==`script`&&he(r,`data:`)===0&&Ct[e])&&!(De&&!Ce(U,me(r,ee,``)))&&r)return!1}return!0},_n=J({},[`annotation-xml`,`color-profile`,`font-face`,`font-face-format`,`font-face-name`,`font-face-src`,`font-face-uri`,`missing-glyph`]),vn=function(e){return!_n[de(e)]&&Ce(te,e)},yn=function(e,t,n,r){if(x&&typeof u==`object`&&typeof u.getAttributeType==`function`&&!n)switch(u.getAttributeType(e,t)){case`TrustedHTML`:return D(r);case`TrustedScriptURL`:return O(r)}return r},bn=function(e,n,r,i){try{r?e.setAttributeNS(r,n,i):e.setAttribute(n,i),ln(e)?Qt(e):se(t.removed)}catch{en(n,e)}},xn=function(e){fn(I.beforeSanitizeAttributes,e,null);let t=e.attributes;if(!t||ln(e))return;let n={attrName:``,attrValue:``,keepAttr:!0,allowedAttributes:ie,forceKeepAttr:void 0},r=t.length,i=Vt(e.nodeName);for(;r--;){let a=t[r],o=a.name,s=a.namespaceURI,c=a.value,l=Vt(o),u=c,d=o===`value`?u:ge(u);if(n.attrName=l,n.attrValue=d,n.keepAttr=!0,n.forceKeepAttr=void 0,fn(I.uponSanitizeAttribute,e,n),d=n.attrValue,$&&(l===`id`||l===`name`)&&he(d,_t)!==0&&(en(o,e),d=_t+d),dt&&Ce(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,d)){en(o,e);continue}if(l===`attributename`&&pe(d,`href`)){en(o,e);continue}if(!n.forceKeepAttr){if(!n.keepAttr){en(o,e);continue}if(!lt&&Ce(nt,d)){en(o,e);continue}if(ut&&(d=sn(d)),!gn(i,l,d)){en(o,e);continue}d=yn(i,l,s,d),d!==u&&bn(e,o,s,d)}}fn(I.afterSanitizeAttributes,e,null)},Sn=function(e){let t=null,n=on(e);for(fn(I.beforeSanitizeShadowDOM,e,null);t=n.nextNode();)if(fn(I.uponSanitizeShadowNode,t,null),hn(t,e),xn(t),un(t.content)&&Sn(t.content),(y?y(t):t.nodeType)===rt.element){let e=_(t);un(e)&&(Cn(e),Sn(e))}fn(I.afterSanitizeShadowDOM,e,null)},Cn=function(e){let t=[{node:e,shadow:null}];for(;t.length>0;){let e=t.pop();if(e.shadow){Sn(e.shadow);continue}let n=e.node,r=(y?y(n):n.nodeType)===rt.element,i=h(n);if(i)for(let e=i.length-1;e>=0;--e)t.push({node:i[e],shadow:null});if(r){let e=b?b(n):null;if(typeof e==`string`&&Vt(e)===`template`){let e=n.content;un(e)&&t.push({node:e,shadow:null})}}if(r){let e=_(n);un(e)&&t.push({node:null,shadow:e},{node:e,shadow:null})}}};return t.sanitize=function(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=null,a=null,o=null,s=null;if(jt=!e,jt&&(e=`<!-->`),typeof e!=`string`&&!dn(e)&&(e=ke(e),typeof e!=`string`))throw we(`dirty is not a string, aborting`);if(!t.isSupported)return e;pt?(q=Y,ie=mt):Gt(n),(I.uponSanitizeElement.length>0||I.uponSanitizeAttribute.length>0)&&(q=Oe(q)),I.uponSanitizeAttribute.length>0&&(ie=Oe(ie)),t.removed=[];let c=yt&&typeof e!=`string`&&dn(e);if(c){rn(e);let t=b?b(e):e.nodeName;if(typeof t==`string`){let n=Vt(t);if(!q[n]||ye[n])throw $t(e),we(`root node is forbidden and cannot be sanitized in-place`)}if(ln(e))throw $t(e),we(`root node is clobbered and cannot be sanitized in-place`);try{Cn(e)}catch(t){throw $t(e),t}}else if(dn(e))i=an(`<!---->`),a=i.ownerDocument.importNode(e,!0),a.nodeType===rt.element&&a.nodeName===`BODY`||a.nodeName===`HTML`?i=a:i.appendChild(a),Cn(a);else{if(!X&&!ut&&!ft&&e.indexOf(`<`)===-1)return x&&Z?D(e):e;if(i=an(e),!i)return X?null:Z?S:``}i&&ht&&Qt(i.firstChild);let l=c?e:i,u=on(l);try{for(;o=u.nextNode();)hn(o,l),xn(o),un(o.content)&&Sn(o.content)}catch(n){throw c&&($t(e),ae(t.removed,e=>{e.element&&nn(e.element)})),n}if(c)return ae(t.removed,e=>{e.element&&nn(e.element)}),ut&&cn(e),e;if(X){if(ut&&cn(i),gt)for(s=N.call(i.ownerDocument);i.firstChild;)s.appendChild(i.firstChild);else s=i;return(ie.shadowroot||ie.shadowrootmode)&&(s=F.call(r,s,!0)),s}let d=ft?i.outerHTML:i.innerHTML;return ft&&q[`!doctype`]&&i.ownerDocument&&i.ownerDocument.doctype&&i.ownerDocument.doctype.name&&Ce(Ze,i.ownerDocument.doctype.name)&&(d=`<!DOCTYPE `+i.ownerDocument.doctype.name+`>
`+d),ut&&(d=sn(d)),x&&Z?D(d):d},t.setConfig=function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Gt(e),pt=!0,Y=q,mt=ie},t.clearConfig=function(){Ht=null,pt=!1,Y=null,mt=null,x=C,S=``},t.isValidAttribute=function(e,t,n){Ht||Gt({});let r=Vt(e),i=Vt(t);return gn(r,i,n)},t.addHook=function(e,t){typeof t==`function`&&xe(I,e)&&ce(I[e],t)},t.removeHook=function(e,t){if(xe(I,e)){if(t!==void 0){let n=oe(I[e],t);return n===-1?void 0:le(I[e],n,1)[0]}return se(I[e])}},t.removeHooks=function(e){xe(I,e)&&(I[e]=[])},t.removeAllHooks=function(){I=ot()},t}var lt=ct();function ut(e,t){let n=String(e??``),r=n.match(/^\s*<h1\b[^>]*>([\s\S]*?)<\/h1>\s*/i);if(!r)return n;let i=r[1].replace(/<[^>]*>/g,``).replace(/\s+/g,` `).trim(),a=String(t??``).replace(/\s+/g,` `).trim();return!a||i!==a?n:n.slice(r[0].length)}function dt(e){let t=e.length,n=Array.from({length:t},(e,n)=>n+1<t?n+1:null),r=[],i=null,a=t>0?0:null,o=null,s=(e,t)=>r.push({phase:e,desc:t,prev:i,curr:a,next:o,nextOf:[...n],done:!1}),c=t=>t===null?`∅`:String(e[t]);if(t===0)return s(`init`,"空链表。`head` 本身就是 ∅，直接返回 ∅ —— 这是必须单独处理的第一种边界。"),r[0].done=!0,r;for(s(`init`,`初始状态：\`prev\` 先站在 ∅（反转后头节点会变成尾节点，它的 \`next\` 必须指向空），\`curr\` 指向头节点 ${c(a)}。`);a!==null;)o=n[a],s(`read-next`,`① \`next = curr.next\`，先记住 ${c(o)}。这一步看着多余，其实是整个算法的命门：一旦 ② 把 \`curr\` 的指针掉头，通往后面节点的唯一线索就断了，所以必须提前存好。`),n[a]=i,s(`flip`,`② \`curr.next = prev\`，把 ${c(a)} 的箭头掉个头，指向 ${c(i)}。`+(i===null?` 因为 \`prev\` 还是 ∅，${c(a)} 就成了新的尾节点。`:``)),i=a,a=o,s(`advance`,a===null?`③ \`prev = curr\`，\`curr = next\` = ∅。curr 走出了链表，循环结束 —— 返回 \`prev\`（${c(i)}），它就是反转后的新头节点。`:`③ \`prev\` 和 \`curr\` 一起右移：\`prev\` 指向 ${c(i)}，\`curr\` 指向 ${c(a)}。准备处理下一个节点。`);return r[r.length-1].done=!0,r}var ft=`viz-chrome-styles`,pt=`http://www.w3.org/2000/svg`;function Y(e,t){let n=document.createElementNS(pt,e);if(t)for(let e in t)n.setAttribute(e,t[e]);return n}function mt(e,t,n,r,i=`viz-arrow`){let a=Y(`g`,{class:i}),o=r>0?t:e,s=r>0?e:t;return a.appendChild(Y(`line`,{class:`${i}__line`,x1:s,y1:n,x2:o-r*9,y2:n})),a.appendChild(Y(`path`,{class:`${i}__head`,d:`M ${o} ${n} L ${o-r*9} ${n-5.5} L ${o-r*9} ${n+5.5} Z`})),a}var ht=`
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
/* 手机上不再把图缩到看不清。绝大多数动画的 viewBox 宽 660（LC 470 的 49 格
   状态表也是 660×478），而 390px 视口下正文栏只剩 ~342px —— width:100% 会把
   整张图压到 ~0.52×，格内 11px 的数字实际只有 ~5.7px。给一个最小宽度，让它
   保持设计尺寸、由 .viz__stage 的 overflow-x 横向滚动（旁边 12 个 renderer
   本来就有各自的 min-width，级联谁赢都可接受）。 */
@media (max-width: 767px) {
  .viz__svg { min-width: 560px; }
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
`;function X(){if(document.getElementById(ft))return;let e=document.createElement(`style`);e.id=ft,e.textContent=ht,document.head.appendChild(e)}function gt(){document.getElementById(ft)?.remove()}function Z(e,t){e.textContent=``;let n=String(t??``),r=/(`[^`]*`|\*\*[^*]+\*\*)/g,i=0;for(let t of n.matchAll(r)){t.index>i&&e.appendChild(document.createTextNode(n.slice(i,t.index)));let r=t[0],a=r.startsWith("`"),o=document.createElement(a?`code`:`strong`);o.textContent=r.slice(a?1:2,a?-1:-2),e.appendChild(o),i=t.index+r.length}i<n.length&&e.appendChild(document.createTextNode(n.slice(i)))}function Q({playLabel:e=`播放`,pauseLabel:t=`暂停`}={}){let n=(e,t)=>{let n=document.createElement(`button`);return n.type=`button`,n.className=t?`viz__btn ${t}`:`viz__btn`,n.textContent=e,n},r=document.createElement(`div`);r.className=`viz__bar`;let i=n(`上一步`),a=n(e,`viz__btn--play`),o=n(`下一步`),s=n(`重置`),c=document.createElement(`span`);return c.className=`viz__count`,r.append(i,a,o,s,c),{root:r,prev:i,play:a,next:o,reset:s,count:c,setPlaying:n=>{a.textContent=n?t:e}}}function $({steps:e,controls:t,intervalMs:n=1150,onRender:r}){let i=0,a=null,o=()=>{a&&=(clearInterval(a),null),t.setPlaying(!1)},s=()=>{r(i,e[i]),t.count.textContent=`第 ${i+1} / ${e.length} 步`,t.prev.disabled=i===0,t.next.disabled=i===e.length-1,t.reset.disabled=i===0&&!a},c=()=>{a||(i===e.length-1&&(i=0),t.setPlaying(!0),a=setInterval(()=>{if(i>=e.length-1){o(),s();return}i+=1,s()},n),s())},l=t=>{o(),i=Math.min(e.length-1,Math.max(0,i+t)),s()},u=()=>{o(),i=0,s()},d=t=>{o(),i=Math.min(e.length-1,Math.max(0,t)),s()},f={prev:()=>l(-1),next:()=>l(1),reset:u,play:()=>a?o():c()};return t.prev.addEventListener(`click`,f.prev),t.next.addEventListener(`click`,f.next),t.reset.addEventListener(`click`,f.reset),t.play.addEventListener(`click`,f.play),{render:s,play:c,stop:o,reset:u,jumpTo:d,destroy:()=>{o(),t.prev.removeEventListener(`click`,f.prev),t.next.removeEventListener(`click`,f.next),t.reset.removeEventListener(`click`,f.reset),t.play.removeEventListener(`click`,f.play)},get index(){return i}}}var _t=`llv-styles`,vt=72,yt=52,bt=44,xt=68,St=96,Ct=122,wt=48,Tt=200,Et=240,Dt=62,Ot=26,kt=276,At=26,jt=1150,Mt=0,Nt=(e,t,n,r)=>mt(e,t,n,r,`llv-edge`),Pt=`
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
`;function Ft(){if(X(),document.getElementById(_t))return;let e=document.createElement(`style`);e.id=_t,e.textContent=Pt,document.head.appendChild(e)}function It(e,t={}){if(!e||e.dataset.llvMounted===`1`)return{destroy(){}};e.dataset.llvMounted=`1`,Ft(),Mt+=1;let n=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4,5],r=t.autoplay!==!1,i=dt(n),a=n.length,o=Array.from({length:a},(e,t)=>t+1<a?t+1:null),s=2*xt+a*vt+Math.max(0,a-1)*bt,c=e=>xt+e*116,l=e=>c(e)+vt/2,u=At,d=s-At,f=document.createElement(`div`);f.className=`viz llv`;let p=document.createElement(`div`);p.className=`viz__stage`,f.appendChild(p);let m=Y(`svg`,{class:`viz__svg llv__svg`,viewBox:`0 0 ${s} ${kt}`,role:`img`,"aria-label":`反转链表推演动画：${n.join(` → `)}`});p.appendChild(m);for(let e of[u,d]){m.appendChild(Y(`circle`,{class:`llv-null__ring`,cx:e,cy:Ct,r:15}));let t=Y(`text`,{class:`llv-null__text`,x:e,y:Ct});t.textContent=`∅`,m.appendChild(t)}let h=Y(`line`,{class:`llv-tick`}),g=Y(`line`,{class:`llv-tick`}),_=Y(`line`,{class:`llv-tick`});m.append(h,g,_);let v=[];for(let e=0;e<a-1;e+=1){let t=c(e)+vt,n=c(e+1),r=Nt(t,n,Ct,1),i=Nt(t,n,Ct,-1);m.append(r,i),v.push({fwd:r,bwd:i})}let y=Nt(c(a-1)+vt,d-15,Ct,1),b=Nt(41,c(0),Ct,-1);m.append(y,b);let x=[];for(let e=0;e<a;e+=1){let t=Y(`g`,{class:`llv-node`});t.appendChild(Y(`rect`,{class:`llv-node__box`,x:c(e),y:St,width:vt,height:yt,rx:9}));let r=Y(`text`,{class:`llv-node__value`,x:l(e),y:Ct});r.textContent=String(n[e]),t.appendChild(r),m.appendChild(t),x.push(t)}function S(e,t){let n=Y(`g`,{class:`llv-chip llv-chip--${e}`});n.appendChild(Y(`rect`,{class:`llv-chip__box`,x:-62/2,y:-26/2,width:Dt,height:Ot}));let r=Y(`text`,{class:`llv-chip__text`,x:0,y:0});return r.textContent=t,n.appendChild(r),n}let C=S(`next`,`next`),w=S(`prev`,`prev`),T=S(`curr`,`curr`);m.append(C,w,T);let E=document.createElement(`p`);E.className=`viz__desc`,E.setAttribute(`aria-live`,`polite`),f.appendChild(E);let D=Q();f.appendChild(D.root),e.textContent=``,e.appendChild(f);let O=null;function k(e,t,n,r,i,a,o){e.style.transform=`translate(${n}px, ${r}px)`,e.style.opacity=i?`1`:`0`,i?(t.setAttribute(`x1`,n),t.setAttribute(`x2`,n),t.setAttribute(`y1`,a),t.setAttribute(`y2`,o),t.style.opacity=`0.65`):t.style.opacity=`0`}function A(e,t){for(let e=0;e<a;e+=1){let n=x[e];n.classList.toggle(`is-flipped`,t.nextOf[e]!==o[e]),n.classList.toggle(`is-curr`,t.curr===e),n.classList.toggle(`is-next`,t.next===e)}for(let e=0;e<a-1;e+=1){let n=t.nextOf[e]===e+1,r=t.nextOf[e+1]===e;v[e].fwd.classList.toggle(`is-on`,n),v[e].bwd.classList.toggle(`is-on`,r),v[e].bwd.classList.toggle(`is-flipped`,r)}let n=t.nextOf[a-1]===null,r=t.nextOf[0]===null;y.classList.toggle(`is-on`,n),b.classList.toggle(`is-on`,r),b.classList.toggle(`is-flipped`,r),k(w,g,t.prev===null?u:l(t.prev),Tt,!0,Tt-Ot/2,148),k(T,_,t.curr===null?d:l(t.curr),Et,!0,Et-Ot/2,148),k(C,h,t.next===null?d:l(t.next),wt,t.phase!==`init`,61,St),Z(E,t.desc)}let j=$({steps:i,controls:D,intervalMs:jt,onRender:A});j.jumpTo(Math.trunc(t.initialStep)||0);let M=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!M&&typeof IntersectionObserver==`function`&&(O=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){O.disconnect(),O=null,j.play();return}},{threshold:.35}),O.observe(f)),{destroy(){O&&=(O.disconnect(),null),j.destroy(),e.textContent=``,delete e.dataset.llvMounted,--Mt,Mt<=0&&(document.getElementById(_t)?.remove(),gt())}}}var Lt=e=>String(e);function Rt(e,t){let n=Array.isArray(e)?e:[],r=Array.isArray(t)?t:[],i=[],a=[],o=0,s=0,c=(e,t,c={})=>i.push({phase:e,desc:t,p1:o<n.length?o:null,p2:s<r.length?s:null,taken:a.map(e=>({...e})),rest:null,done:!1,...c}),l=(e,t)=>e===`a`?n[t]:r[t];if(n.length===0&&r.length===0)return c(`init`,`两条链表都是空的。哑结点后面什么都没有，返回 ∅。`),i[0].done=!0,i;if(n.length===0||r.length===0){let e=n.length===0?`A`:`B`,t=e===`A`?`B`:`A`;return c(`init`,`${e} 是空链表，那么「合并」就是原样返回 ${t}（${(t===`A`?n:r).map(Lt).join(`、`)}）—— 一个空链表和一个有序链表合并，结果就是那个有序链表本身。`),i[0].done=!0,i}for(c(`init`,`两个指针各站在自己链表的头部：\`p1\` 指向 A 的 ${Lt(n[0])}，\`p2\` 指向 B 的 ${Lt(r[0])}。结果链表先放一个**哑结点**当锚点 —— 它不是答案的一部分，只是为了让我们不必特判「第一个节点该接谁」，最后返回 \`dummy.next\` 就行。`);o<n.length&&s<r.length;){let e=n[o]<=r[s];c(`compare`,`比较 \`p1\` 的 ${Lt(n[o])} 和 \`p2\` 的 ${Lt(r[s])}：`+(e?`${Lt(n[o])} ≤ ${Lt(r[s])}，取 A 的 ${Lt(n[o])}。`+(n[o]===r[s]?`（相等时取哪边都行，习惯上取 A）`:``):`${Lt(r[s])} < ${Lt(n[o])}，取 B 的 ${Lt(r[s])}。`),{cursor:e?`a`:`b`}),e?(a.push({list:`a`,i:o}),o+=1):(a.push({list:`b`,i:s}),s+=1),c(`take`,`把 ${Lt(l(a[a.length-1].list,a[a.length-1].i))} 接到结果链表的尾部，然后 ${e?"`p1`":"`p2`"} 前移一格。`+(e&&o>=n.length?` A 走完了。`:``)+(!e&&s>=r.length?` B 走完了。`:``),{picked:e?`a`:`b`})}if(o<n.length||s<r.length){let e=o<n.length?`a`:`b`,t=o<n.length?o:s,i=(e===`a`?n.slice(o):r.slice(s)).map(Lt).join(`、`),l=e===`a`?n:r,u=o<n.length?o:null,d=s<r.length?s:null;for(let n=t;n<l.length;n+=1)a.push({list:e,i:n});e===`a`?o=n.length:s=r.length,c(`append-rest`,`${e===`a`?`B`:`A`} 已经走完了，${e===`a`?`A`:`B`} 剩下的 ${i} 全部原样接到结果尾部。**这是整道题最容易被忽略的一步**：两条链表各自都是有序的，所以剩下这段不需要再逐个比较，直接整段接上就对。`,{rest:{list:e,from:t},p1:u,p2:d})}return c(`done`,`两条链表都走完了。结果链表是 ${a.map(e=>Lt(l(e.list,e.i))).join(` → `)} —— 但别忘了开头那个哑结点，它不是答案的一部分，所以返回 \`dummy.next\`。`),i[i.length-1].done=!0,i}var zt=`mtl-styles`,Bt=60,Vt=44,Ht=94,Ut=84,Wt=40,Gt=130,Kt=218,qt=214/2,Jt=38,Yt=24,Xt=17,Zt=26,Qt=15,$t=302,en=1150,tn=0,nn=`
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
`;function rn(){if(X(),document.getElementById(zt))return;let e=document.createElement(`style`);e.id=zt,e.textContent=nn,document.head.appendChild(e)}function an(e,t={}){if(!e||e.dataset.mtlMounted===`1`)return{destroy(){}};e.dataset.mtlMounted=`1`,rn(),tn+=1;let n=Array.isArray(t.listA)&&t.listA.length?t.listA:[1,2,4],r=Array.isArray(t.listB)&&t.listB.length?t.listB:[1,3,4],i=t.autoplay!==!1,a=Rt(n,r),o=a[a.length-1].taken,s=e=>e.list===`a`?n[e.i]:r[e.i],c=1+o.length,l=e=>Ut+e*Ht,u=e=>l(e)+Bt/2,d=e=>e<=0?Ut:Ut+(e-1)*Ht+Bt,f=e=>e<=0?Ut:d(e)+Zt,p=Math.max(d(n.length),d(r.length),d(c))+Zt+Qt+12,m=document.createElement(`div`);m.className=`viz mtl`;let h=document.createElement(`div`);h.className=`viz__stage`,m.appendChild(h);let g=Y(`svg`,{class:`viz__svg mtl__svg`,viewBox:`0 0 ${p} ${$t}`,role:`img`,"aria-label":`合并两个有序链表推演动画：${n.join(`、`)} 与 ${r.join(`、`)}`});h.appendChild(g);for(let[e,t]of[[`A`,62],[`B`,152],[`结果`,240]]){let n=Y(`text`,{class:`mtl-row-label`,x:30,y:t});n.textContent=e,g.appendChild(n)}function _(e,t){g.appendChild(Y(`circle`,{class:`mtl-dummy__box`,cx:e,cy:t,r:Qt}));let n=Y(`text`,{class:`mtl-dummy__text`,x:e,y:t});n.textContent=`∅`,g.appendChild(n)}function v(e,t,n,r){let i=Y(`g`,{class:r});return i.appendChild(Y(`line`,{class:`mtl-edge__line`,x1:e,y1:n,x2:t-9,y2:n})),i.appendChild(Y(`path`,{class:`mtl-edge__head`,d:`M ${t} ${n} L ${t-9} ${n-5.5} L ${t-9} ${n+5.5} Z`})),g.appendChild(i),i}function y(e,t){let n=t+Vt/2;for(let t=0;t<e-1;t+=1)v(l(t)+Bt,l(t+1),n,`mtl-edge`);_(f(e),n),e>0&&v(d(e),f(e)-Qt,n,`mtl-edge`)}y(n.length,Wt),y(r.length,Gt);let b=[];for(let e=1;e<c;e+=1)b.push(v(l(e-1)+Bt,l(e),240,`mtl-edge mtl-redge`));_(f(c),240);let x=v(d(c),f(c)-Qt,240,`mtl-edge mtl-redge`);function S(e,t,n,r){let i=Y(`g`,{class:`mtl-node ${r}`});i.appendChild(Y(`rect`,{class:`mtl-node__box`,x:l(t),y:n,width:Bt,height:Vt,rx:9}));let a=Y(`text`,{class:`mtl-node__value`,x:u(t),y:n+Vt/2});return a.textContent=String(e),i.appendChild(a),g.appendChild(i),i}let C=n.map((e,t)=>S(e,t,Wt,`mtl-node--a`)),w=r.map((e,t)=>S(e,t,Gt,`mtl-node--b`)),T=Y(`g`,{class:`mtl-dummy`});T.appendChild(Y(`rect`,{class:`mtl-dummy__box`,x:l(0),y:Kt,width:Bt,height:Vt,rx:9}));let E=Y(`text`,{class:`mtl-dummy__text`,x:u(0),y:240});E.textContent=`dummy`,T.appendChild(E),g.appendChild(T);let D=o.map((e,t)=>S(s(e),t+1,Kt,`mtl-rslot mtl-rslot--from-${e.list}`)),O=Y(`g`,{class:`mtl-vs`});O.appendChild(Y(`circle`,{class:`mtl-vs__ring`,cx:0,cy:0,r:13}));let k=Y(`text`,{class:`mtl-vs__text`,x:0,y:0});k.textContent=`vs`,O.appendChild(k),g.appendChild(O);function A(e,t){let n=Y(`g`,{class:`mtl-chip mtl-chip--${e}`});n.appendChild(Y(`rect`,{class:`mtl-chip__box`,x:-38/2,y:-24/2,width:Jt,height:Yt}));let r=Y(`text`,{class:`mtl-chip__text`,x:0,y:0});return r.textContent=t,n.appendChild(r),g.appendChild(n),n}let j=A(`p1`,`p1`),M=A(`p2`,`p2`),N=A(`tail`,`tail`),P=document.createElement(`p`);P.className=`viz__desc`,P.setAttribute(`aria-live`,`polite`),m.appendChild(P);let F=Q();m.appendChild(F.root),e.textContent=``,e.appendChild(m);let I=null;function L(e,t,n){e.style.transform=`translate(${t}px, ${n}px)`}function R(e,t){let i=new Set(t.taken.map(e=>`${e.list}:${e.i}`));C.forEach((e,n)=>{e.classList.toggle(`is-taken`,i.has(`a:${n}`)),e.classList.toggle(`is-cand`,t.phase===`compare`&&t.p1===n),e.classList.toggle(`is-win`,t.phase===`compare`&&t.cursor===`a`&&t.p1===n),e.classList.toggle(`is-rest`,t.phase===`append-rest`&&t.rest?.list===`a`&&n>=t.rest.from)}),w.forEach((e,n)=>{e.classList.toggle(`is-taken`,i.has(`b:${n}`)),e.classList.toggle(`is-cand`,t.phase===`compare`&&t.p2===n),e.classList.toggle(`is-win`,t.phase===`compare`&&t.cursor===`b`&&t.p2===n),e.classList.toggle(`is-rest`,t.phase===`append-rest`&&t.rest?.list===`b`&&n>=t.rest.from)});let a=t.rest?(t.rest.list===`a`?n.length:r.length)-t.rest.from:0,o=t.phase===`take`?t.taken.length:t.phase===`append-rest`?t.taken.length-a+1:1/0;D.forEach((e,n)=>{let r=n+1,i=r<=t.taken.length;e.classList.toggle(`is-filled`,i),e.classList.toggle(`is-new`,i&&r>=o)}),b.forEach((e,n)=>e.classList.toggle(`is-on`,n+1<=t.taken.length)),x.classList.toggle(`is-on`,t.done);let s=t.phase===`compare`;if(O.classList.toggle(`is-on`,s),s){let e=(u(t.p1)+u(t.p2))/2;O.style.transform=`translate(${e}px, ${qt}px)`}L(j,t.p1===null?f(n.length):u(t.p1),Wt-Xt),L(M,t.p2===null?f(r.length):u(t.p2),Gt-Xt),L(N,u(Math.min(t.taken.length,c-1)),279),Z(P,t.desc)}let z=$({steps:a,controls:F,intervalMs:en,onRender:R});z.jumpTo(Math.trunc(t.initialStep)||0);let B=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return i&&!B&&typeof IntersectionObserver==`function`&&(I=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){I.disconnect(),I=null,z.play();return}},{threshold:.35}),I.observe(m)),{destroy(){I&&=(I.disconnect(),null),z.destroy(),e.textContent=``,delete e.dataset.mtlMounted,--tn,tn<=0&&(document.getElementById(zt)?.remove(),gt())}}}var on=e=>String.fromCharCode(65+e);function sn(e){let t=(Array.isArray(e)?e:[]).map(e=>Array.isArray(e)?e.slice():[]),n=t.length,r=[],i=t.map(e=>e.length?0:null),a=[],o=[],s=(e,n)=>{let r=t[e.list][e.i],i=t[n.list][n.i];return r===i?e.list<n.list:r<i},c=e=>t[e.list][e.i],l=(e,t,n={})=>r.push({phase:e,desc:t,heap:o.map(e=>({...e})),cursors:i.slice(),taken:a.map(e=>({...e})),popped:null,pushed:null,moved:[],done:!1,...n});function u(e){let t=[];for(;e>0;){let n=e-1>>1;if(!s(o[e],o[n]))break;[o[e],o[n]]=[o[n],o[e]],t.push(e,n),e=n}return t}function d(e){let t=[];for(;;){let n=2*e+1,r=2*e+2,i=e;if(n<o.length&&s(o[n],o[i])&&(i=n),r<o.length&&s(o[r],o[i])&&(i=r),i===e)break;[o[e],o[i]]=[o[i],o[e]],t.push(e,i),e=i}return t}let f=[];for(let e=0;e<n;e+=1)i[e]!==null&&(o.push({list:e,i:0}),f=f.concat(u(o.length-1)));let p=t.filter(e=>e.length).length,m=t.reduce((e,t)=>e+t.length,0);if(o.length===0)return l(`init`,n===0?"`lists` 是个空数组，一条链表都没有，直接返回 ∅。":`${n} 条链表全是空的 —— 堆建起来是空的，直接返回 ∅。`,{moved:[],done:!0}),r;for(l(`init`,`把 ${p} 条链表的**头节点**放进小顶堆：${o.map(e=>`${on(e.list)} 的 ${c(e)}`).join(`、`)}。注意**只放头部**，每条链表后面那些节点还在原地等 —— 堆里现在只有 ${o.length} 个元素，不是 ${m} 个。这是 O(N log K) 里那个 K 的来源。`,{moved:f});o.length;){let e=o[0],n=[],r=o.pop();o.length&&(o[0]=r,n.push(...d(0))),a.push({list:e.list,i:e.i});let s=e.list;i[s]=i[s]+1<t[s].length?i[s]+1:null;let f=null;i[s]!==null&&(f={list:s,i:i[s]},o.push(f),n.push(...u(o.length-1)));let p=f?`${on(s)} 前移一格，新头 ${c(f)} 入堆，堆里还是 ${o.length} 个元素。`:`${on(s)} 已经走完了，不再补位 —— 堆里只剩 ${o.length} 个元素。`;l(`take`,`堆顶是 ${c(e)}（来自 ${on(s)}）。出堆 → 接到结果尾部 → ${p}`,{popped:{...e},pushed:f?{...f}:null,moved:n})}let h=a.map(e=>c(e)).join(` → `);return l(`done`,`堆空了，说明每个节点都被取走且只被取走了一次 —— 一共 ${a.length} 轮，每轮最多两次堆操作（出堆 + 入堆），每次 O(log K)，所以是 O(N log K)。结果链表是 ${h}；开头那个哑结点只是锚点，返回 \`dummy.next\`。`,{done:!0}),r}var cn=`mkl-styles`,ln=52,un=40,dn=74,fn=58,pn=15,mn=26,hn=40,gn=22,_n=16,vn=66,yn=34,bn=36,xn=40,Sn=28,Cn=168,wn=12,Tn=46,En=22,Dn=56,On=180,kn=1250,An=0,jn=[`l0`,`l1`,`l2`,`l3`,`l4`,`l5`],Mn=e=>`mkl-${jn[e%jn.length]}`,Nn=`
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
`;function Pn(){if(X(),document.getElementById(cn))return;let e=document.createElement(`style`);e.id=cn,e.textContent=Nn,document.head.appendChild(e)}function Fn(e){let t=Math.floor(Math.log2(e+1));return{x:(e-(2**t-1)+.5)/2**t*Cn,y:t*Tn}}function In(e,t={}){if(!e||e.dataset.mklMounted===`1`)return{destroy(){}};e.dataset.mklMounted=`1`,Pn(),An+=1;let n=Array.isArray(t.lists)&&t.lists.length?t.lists:[[1,4],[2,5],[3,6],[0,7]],r=t.autoplay!==!1,i=sn(n),a=n.length,o=Math.max(1,a),s=n.reduce((e,t)=>Math.max(e,t.length),0),c=1+n.reduce((e,t)=>e+t.length,0),l=e=>fn+e*dn,u=e=>l(e)+ln/2,d=e=>e<=0?fn:fn+(e-1)*dn+ln,f=e=>d(e)+mn,p=o*vn-(vn-un),m=En+(Math.floor(Math.log2(o))*Tn+Sn),h=Math.max(p,m),g=yn+h+bn,_=g+un+_n+20,v=f(s)+pn,y=v+Dn+On,b=f(c)+pn+12,x=Math.max(y+36,b),S=Math.round((x-y)/2),C=S+v+Dn,w=e=>C+wn+Fn(e).x,T=e=>yn+Math.max(0,Math.round((h-m)/2))+En+Fn(e).y,E=document.createElement(`div`);E.className=`viz mkl`;let D=document.createElement(`div`);D.className=`viz__stage`,E.appendChild(D);let O=Y(`svg`,{class:`viz__svg mkl__svg`,viewBox:`0 0 ${x} ${_}`,role:`img`,"aria-label":`合并 ${a} 个升序链表的小顶堆推演动画`});D.appendChild(O);function k(e,t,n,r,i){let a=Y(`g`,{class:i});return a.appendChild(Y(`line`,{class:`mkl-edge__line`,x1:t,y1:r,x2:n-9,y2:r})),a.appendChild(Y(`path`,{class:`mkl-edge__head`,d:`M ${n} ${r} L ${n-9} ${r-5.5} L ${n-9} ${r+5.5} Z`})),e.appendChild(a),a}function A(e,t,n){e.appendChild(Y(`circle`,{class:`mkl-null__ring`,cx:t,cy:n,r:pn}));let r=Y(`text`,{class:`mkl-null__text`,x:t,y:n});r.textContent=`∅`,e.appendChild(r)}function j(e,t,n,r,i){let a=Y(`g`,{class:`mkl-node ${i}`});a.appendChild(Y(`rect`,{class:`mkl-node__box`,x:n,y:r,width:ln,height:un,rx:8}));let o=Y(`text`,{class:`mkl-node__value`,x:n+ln/2,y:r+un/2});return o.textContent=String(t),a.appendChild(o),e.appendChild(a),a}let M=n.map((e,t)=>{let n=yn+t*vn,r=n+un/2,i=Y(`g`,{class:`mkl-src ${Mn(t)}`}),a=Y(`text`,{class:`mkl-row-label`,x:S+fn/2-6,y:r});a.textContent=String.fromCharCode(65+t),i.appendChild(a);let o=e.map((e,t)=>j(i,e,S+fn+t*dn,n,``));for(let t=0;t<e.length-1;t+=1)k(i,S+fn+t*dn+ln,S+fn+(t+1)*dn,r,``);return e.length>0&&k(i,S+d(e.length),S+f(e.length)-pn,r,``),A(i,S+f(e.length),r),O.appendChild(i),{g:i,labelEl:a,nodes:o,values:e}}),N=Y(`g`,{class:`mkl-heap`});O.appendChild(N);let P=Y(`text`,{class:`mkl-heap__caption`,x:C+wn+Cn/2,y:yn+Math.max(0,Math.round((h-m)/2))+En/2});N.appendChild(P);let F=[];for(let e=1;e<o;e+=1){let t=e-1>>1,n=Y(`g`,{class:`mkl-hedge`});n.appendChild(Y(`line`,{class:`mkl-hedge__line`,x1:w(t),y1:T(t)+Sn,x2:w(e),y2:T(e)})),N.appendChild(n),F.push({g:n,child:e})}let I=[];for(let e=0;e<o;e+=1){let t=Y(`g`,{class:`mkl-hslot is-off`});t.appendChild(Y(`rect`,{class:`mkl-hnode__box`,x:w(e)-xn/2,y:T(e),width:xn,height:Sn,rx:7}));let n=Y(`text`,{class:`mkl-hnode__value`,x:w(e),y:T(e)+Sn/2});t.appendChild(n),N.appendChild(t),I.push({g:t,textEl:n})}let L=Y(`text`,{class:`mkl-heap__root-tag`,x:w(0)+xn/2+24,y:T(0)+Sn/2});L.textContent=`堆顶`,N.appendChild(L);let R=Y(`g`,{class:`mkl-result`});O.appendChild(R);let z=g+un/2,B=Y(`text`,{class:`mkl-row-label`,x:26,y:z});B.textContent=`结果`,R.appendChild(B);let V=Y(`g`,{class:`mkl-dummy`});V.appendChild(Y(`rect`,{class:`mkl-dummy__box`,x:l(0),y:g,width:ln,height:un,rx:8}));let H=Y(`text`,{class:`mkl-dummy__text`,x:u(0),y:z});H.textContent=`dummy`,V.appendChild(H),R.appendChild(V);let U=[];for(let e=1;e<c;e+=1)U.push(k(R,l(e-1)+ln,l(e),z,`mkl-redge`));A(R,f(c),z);let ee=k(R,d(c),f(c)-pn,z,`mkl-redge`),te=i[i.length-1].taken.map((e,t)=>j(R,n[e.list][e.i],l(t+1),g,`mkl-rslot ${Mn(e.list)}`)),W=Y(`g`,{class:`mkl-chip mkl-chip--tail`});W.appendChild(Y(`rect`,{class:`mkl-chip__box`,x:-40/2,y:-22/2,width:hn,height:gn}));let G=Y(`text`,{class:`mkl-chip__text`,x:0,y:0});G.textContent=`tail`,W.appendChild(G),R.appendChild(W);let K=document.createElement(`p`);K.className=`viz__desc`,K.setAttribute(`aria-live`,`polite`),E.appendChild(K);let ne=Q();E.appendChild(ne.root),e.textContent=``,e.appendChild(E);let q=null;function re(e,t){let r=t.heap.length,i=new Set(t.moved);M.forEach((e,n)=>{let r=t.cursors[n];e.g.classList.toggle(`is-dead`,r===null),e.labelEl.classList.toggle(`is-live`,r!==null),e.labelEl.classList.toggle(`is-dead`,r===null),e.nodes.forEach((e,t)=>{e.classList.toggle(`is-taken`,r===null||t<r),e.classList.toggle(`is-head`,r===t)})}),I.forEach((e,a)=>{if(a>=r){e.g.setAttribute(`class`,`mkl-hslot is-off`);return}let o=t.heap[a];e.textEl.textContent=String(n[o.list][o.i]),e.g.setAttribute(`class`,`mkl-hslot ${Mn(o.list)}${i.has(a)?` is-moved`:``}`+(a===0?` is-root`:``))}),F.forEach(e=>{e.g.style.display=e.child<r?``:`none`}),P.textContent=r===0?`堆：空了 —— 全部节点已取出`:`堆：只有 ${r} 个候选（每条链表当前的头部）`,L.classList.toggle(`is-off`,r===0);let a=t.phase===`take`?t.taken.length:1/0;te.forEach((e,n)=>{let r=n+1,i=r<=t.taken.length;e.classList.toggle(`is-filled`,i),e.classList.toggle(`is-new`,i&&r>=a)}),U.forEach((e,n)=>e.classList.toggle(`is-on`,n+1<=t.taken.length)),ee.classList.toggle(`is-on`,t.done);let o=Math.min(t.taken.length,c-1);W.style.transform=`translate(${u(o)}px, ${g+un+_n}px)`,Z(K,t.desc)}let ie=$({steps:i,controls:ne,intervalMs:kn,onRender:re});ie.jumpTo(Math.trunc(t.initialStep)||0);let ae=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!ae&&typeof IntersectionObserver==`function`&&(q=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){q.disconnect(),q=null,ie.play();return}},{threshold:.35}),q.observe(E)),{destroy(){q&&=(q.disconnect(),null),ie.destroy(),e.textContent=``,delete e.dataset.mklMounted,--An,An<=0&&(document.getElementById(cn)?.remove(),gt())}}}function Ln(e,t){let n=[],r=0,i=0;for(;r<e.length&&i<t.length;)e[r]<=t[i]?(n.push(e[r]),r+=1):(n.push(t[i]),i+=1);for(;r<e.length;)n.push(e[r++]);for(;i<t.length;)n.push(t[i++]);return n}var Rn=e=>e.length?e.join(`、`):`∅`;function zn(e){let t=(Array.isArray(e)?e:[]).map(e=>Array.isArray(e)?e.slice():[]),n=t.length,r=[],i=t.reduce((e,t)=>e+t.length,0),a=e=>e.map(e=>({lists:e.lists.map(e=>e.slice()),from:e.from?e.from.map(e=>[e[0],e[1]]):null}));if(n===0)return r.push({phase:`init`,desc:"`lists` 是个空数组，一条链表都没有，直接返回 ∅。",levels:[],activeLevel:-1,rounds:0,done:!0}),r;let o=[{lists:t.map(e=>e.slice()),from:null}];if(n===1)return r.push({phase:`init`,desc:`只有 1 条链表，**一次合并都不用做** —— 分治的轮数是 ⌈log₂1⌉ = 0，直接返回它自己（${Rn(t[0])}）。`,levels:a(o),activeLevel:0,rounds:0,done:!0}),r;r.push({phase:`init`,desc:`分治的起手：${n} 条链表一字排开，一共 ${i} 个节点。接下来每一轮**两两配对合并**，链表条数每次减半 —— ${n} → ${Math.ceil(n/2)} → … → 1，一共 ⌈log₂${n}⌉ = ${Math.ceil(Math.log2(n))} 轮。`,levels:a(o),activeLevel:0,rounds:0,done:!1});let s=t,c=0;for(;s.length>1;){let e=[],t=[];for(let n=0;n<s.length;n+=2)n+1<s.length?(e.push(Ln(s[n],s[n+1])),t.push([n,n+1])):(e.push(s[n].slice()),t.push([n,-1]));c+=1,o.push({lists:e,from:t});let n=s.length,i=e.length,l=t.reduce((e,[t,n])=>e+(n>=0?s[t].length+s[n].length:0),0),u=t.filter(e=>e[1]>=0).length,d=t.find(e=>e[1]<0);r.push({phase:`merge`,desc:`第 ${c} 轮：把 ${n} 条两两配对，做 ${u} 次「合并两个有序链表」，得到 ${i} 条。本轮被摸到的节点一共 ${l} 个，不超过 N —— 每轮都是 O(N) 的工作量。`+(d?`注意第 ${d[0]+1} 条这轮**轮空**了，原样进下一轮（不是丢掉）。`:`链表条数 ${n} → ${i}。`),levels:a(o),activeLevel:o.length-1,rounds:c,done:!1}),s=e}return r.push({phase:`done`,desc:`一共 ${c} 轮，每轮 O(N)，所以总时间是 **O(N log K)** —— 和最小堆同阶。结果链表是 ${Rn(s[0])}。分治的隐藏优势：它不需要堆，每一轮都是纯粹的指针比较，常数更小。`,levels:a(o),activeLevel:o.length-1,rounds:c,done:!0}),r}var Bn=`mkc-styles`,Vn=44,Hn=36,Un=18,Wn=38,Gn=68,Kn=76,qn=34,Jn=54,Yn=30,Xn=1400,Zn=0,Qn=`
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
`;function $n(){if(X(),document.getElementById(Bn))return;let e=document.createElement(`style`);e.id=Bn,e.textContent=Qn,document.head.appendChild(e)}var er=e=>`mkc-lv${Math.min(e,4)}`;function tr(e,t={}){if(!e||e.dataset.mkcMounted===`1`)return{destroy(){}};e.dataset.mkcMounted=`1`,$n(),Zn+=1;let n=Array.isArray(t.lists)&&t.lists.length?t.lists:[[7],[2],[5],[1],[8],[3],[6],[4]],r=t.autoplay!==!1,i=zn(n),a=i[i.length-1].levels,o=a.map(e=>{let t=[],n=Gn;for(let r of e.lists){let e=r.length?r.length*Vn+(r.length-1)*Un:Yn;t.push({x:n,w:e,values:r}),n+=e+Wn}return{items:t,width:t.length?n-Wn:Gn,top:qn}});o.forEach((e,t)=>{e.top=qn+t*Kn});let s=o.reduce((e,t)=>Math.max(e,t.width),Gn)+Jn,c=qn+(o.length-1)*Kn+Hn+26,l=(e,t)=>{let n=o[e].items[t];return n?n.x+n.w/2:Gn},u=document.createElement(`div`);u.className=`viz mkc`;let d=document.createElement(`div`);d.className=`viz__stage`,u.appendChild(d);let f=Y(`svg`,{class:`viz__svg mkc__svg`,viewBox:`0 0 ${s} ${c}`,role:`img`,"aria-label":`合并 ${n.length} 个升序链表的分治推演动画`});d.appendChild(f);let p=[];for(let e=1;e<o.length;e+=1)(a[e].from||[]).forEach((t,n)=>{let[r,i]=t,a=o[e-1].top+Hn,s=o[e].top,c=l(e,n),u=Y(`g`,{class:`mkc-link ${er(e)}`});if(i<0)u.appendChild(Y(`line`,{class:`mkc-link__line`,x1:l(e-1,r),y1:a,x2:c,y2:s}));else for(let t of[r,i]){let n=l(e-1,t);u.appendChild(Y(`path`,{class:`mkc-link__line`,d:`M ${n} ${a} C ${n} ${a+22}, ${c} ${s-22}, ${c} ${s}`}))}f.appendChild(u),p.push({g:u,level:e})});let m=[];o.forEach((e,t)=>{let n=Y(`g`,{class:`mkc-row ${er(t)}`}),r=e.top+Hn/2,i=Y(`text`,{class:`mkc-row-label`,x:Gn-16,y:r});i.textContent=t===0?`输入`:`第 ${t} 轮`,n.appendChild(i);let a=Y(`text`,{class:`mkc-row-count`,x:e.width+14,y:r});a.textContent=`${e.items.length} 条`,n.appendChild(a);let o=[];e.items.forEach(t=>{if(!t.values.length){n.appendChild(Y(`circle`,{class:`mkc-null__ring`,cx:t.x+Yn/2,cy:r,r:11}));let e=Y(`text`,{class:`mkc-null__text`,x:t.x+Yn/2,y:r});e.textContent=`∅`,n.appendChild(e);return}t.values.forEach((i,a)=>{let s=t.x+a*62,c=Y(`g`,{class:`mkc-node`});c.appendChild(Y(`rect`,{class:`mkc-node__box`,x:s,y:e.top,width:Vn,height:Hn,rx:7}));let l=Y(`text`,{class:`mkc-node__value`,x:s+Vn/2,y:r});l.textContent=String(i),c.appendChild(l),n.appendChild(c),o.push(c)})}),f.appendChild(n),m.push({g:n,nodes:o,countEl:a,level:t})});let h=document.createElement(`p`);h.className=`viz__desc`,h.setAttribute(`aria-live`,`polite`),u.appendChild(h);let g=Q();u.appendChild(g.root),e.textContent=``,e.appendChild(u);let _=null;function v(e,t){let n=t.levels.length;m.forEach(e=>{e.g.classList.toggle(`is-hidden`,e.level>=n),e.g.classList.toggle(`is-active`,e.level===t.activeLevel),e.nodes.forEach(n=>{n.classList.toggle(`is-new`,e.level===t.activeLevel&&t.phase!==`init`)}),e.level<n&&(e.countEl.textContent=`${t.levels[e.level].lists.length} 条`)}),p.forEach(e=>{e.g.classList.toggle(`is-hidden`,e.level>=n),e.g.classList.toggle(`is-on`,e.level===t.activeLevel)}),Z(h,t.desc)}let y=$({steps:i,controls:g,intervalMs:Xn,onRender:v});y.jumpTo(Math.trunc(t.initialStep)||0);let b=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!b&&typeof IntersectionObserver==`function`&&(_=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){_.disconnect(),_=null,y.play();return}},{threshold:.35}),_.observe(u)),{destroy(){_&&=(_.disconnect(),null),y.destroy(),e.textContent=``,delete e.dataset.mkcMounted,--Zn,Zn<=0&&(document.getElementById(Bn)?.remove(),gt())}}}var nr=[1,2,3,4,5,6,7,8,9,10,11,12,13],rr=4;function ir(e,t,n){return!Number.isInteger(e)||!Number.isInteger(t)||!Number.isInteger(n)||n<=0||e<t?null:(e-t)%n}function ar(e,t){let n=Math.abs(e),r=Math.abs(t);for(;r;)[n,r]=[r,n%r];return n}function or(e={}){let t=Array.isArray(e.values)?e.values.slice():nr.slice(),n=t.length,r=Number.isInteger(e.fastStep)&&e.fastStep>=1?e.fastStep:2,i=r-1,a=e.cycleStart===void 0?rr:e.cycleStart,o=Number.isInteger(a)&&a>=0&&a<n,s=o?a:null,c=o?n-s:0,l=o?{start:s,length:c}:null,u=[],d=(e,t,n={})=>u.push({phase:e,desc:t,slow:null,fast:null,gap:null,cycle:l?{...l}:null,fastStep:r,closing:i,steps:0,met:!1,done:!1,...n});if(n===0)return d(`end`,"链表是空的，连头节点都没有 —— 不存在环，返回 `false`。",{done:!0}),u;let f=e=>!Number.isInteger(e)||e>=n?null:e+1<n?e+1:o?s:null,p=e=>Number.isInteger(e)&&e>=0&&e<n?String(t[e]):`∅`,m=(e,t)=>{if(!o)return null;let n=ir(e,s,c),r=ir(t,s,c);return n===null||r===null?null:(n-r+c)%c},h=0,g=0,_=i<=0?`**两个指针速度一样，相对速度是 0** —— 它们会永远保持这个距离，不可能相遇。`:`快指针每步比慢指针多走 ${i} 格 —— 这个相对速度恒定不变，是后面一切的起点。`;if(d(`init`,`慢指针和快指针都站在头节点 ${p(0)}。快指针每步走 **${r} 格**、慢指针走 1 格，`+_,{slow:h,fast:g,steps:0}),i<=0)return d(`end`,`相对速度是 0，两指针永远同步前进，距离不会变 —— 不相遇。所以快指针**至少要走 2 步**，这是「一定相遇」的第一道门槛。`,{slow:h,fast:g,done:!0}),u;let v=2*n+8,y=`cap`;for(let e=1;e<=v;e+=1){let t=g;for(let e=0;e<r&&t!==null;e+=1)t=f(t);if(g=t,h=f(h),h===null&&g===null){y=`fell-off`;break}let n=m(h,g);if(h!==null&&h===g){let t=i===1?`相对速度是 1，所以「快指针沿环前进方向到慢指针的距离」每步**恰好减 1**；它是在模 ${c} 的意义下减 1 的，必然依次经过 ${c-1}、…、1、0 —— 所以**一定相遇**，慢指针进环后最多 ${c-1} 步。`:`相对速度是 ${i}，距离每步减 ${i}；它能减到 0，是因为慢指针进环那一刻的距离恰好是 gcd(${i}, ${c}) = ${ar(i,c)} 的倍数。`;return d(`met`,`两者在节点 ${p(h)} **相遇**。走了 ${e} 步，快指针比慢指针多走了 ${e*i} 格，正好是环长 ${c} 的整数倍 —— 这是相遇的代数原因。${t}`,{slow:h,fast:g,gap:n,steps:e,met:!0,done:!0}),u}if(g===null){y=`fell-off`;break}let a;a=n===null?o&&g>=s?`慢指针还在直段（第 ${h+1} 个节点），快指针已经进环了 —— 慢指针没进环之前，两者不可能相遇。`:`两者都还在直段，快指针只是领先慢指针 ${g-h} 格，距离还没有被环长约束住。`:`两者都在环上。快指针沿环前进方向到慢指针还差 **${n} 格**，比上一步少了 ${i} —— 只要相对速度是 1，这个数每步必然减 1。`,d(`move`,`慢指针到 ${p(h)}、快指针到 ${p(g)}。${a}`,{slow:h,fast:g,gap:n,steps:e})}return y===`fell-off`?(d(`end`,`快指针走到了链表末尾（\`fast\` 或 \`fast.next\` 是空）—— **这条链表没有环**，返回 \`false\`。一共走了 ${u.length} 步：没有环时快指针每步走 ${r} 格，最多 n / ${r} 步就出界，所以判环是 O(n) 时间、O(1) 空间。`,{slow:h,fast:g,done:!0}),u):(d(`end`,`走了 ${u.length} 步仍未相遇，已超过步数上限 ${v} —— 这是不该出现的情况，请检查输入（两指针同起点时，任何 fastStep ≥ 2 都必然相遇）。`,{slow:h,fast:g,gap:m(h,g),done:!0}),u)}var sr=`cyc-layout-styles`,cr=20,lr=`
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
`;function ur(){if(document.getElementById(sr))return;let e=document.createElement(`style`);e.id=sr,e.textContent=lr,document.head.appendChild(e)}function dr(e){if(!Number.isInteger(e)||e<=1)return 80;let t=68/(2*Math.sin(Math.PI/e));return Math.max(80,Math.round(t))}function fr(e,t){return 180+360*e/t}function pr(e,t,n,r,i){let a=fr(e,t)*Math.PI/180;return{x:n+i*Math.cos(a),y:r+i*Math.sin(a)}}function mr(e,t,n=46,r=30){let i=Math.abs(e)<1e-6?1/0:n/2/Math.abs(e),a=Math.abs(t)<1e-6?1/0:r/2/Math.abs(t);return Math.min(i,a)}function hr(e,t,{head:n=8,dim:r=!1}={}){let i=t.x-e.x,a=t.y-e.y,o=Math.hypot(i,a)||1,s=i/o,c=a/o,l=mr(s,c),u=e.x+s*l,d=e.y+c*l,f=t.x-s*l,p=t.y-c*l,m=Y(`g`,{class:r?`cyc-edge is-dim`:`cyc-edge`});m.appendChild(Y(`line`,{class:`cyc-edge__line`,x1:u,y1:d,x2:f-s*n,y2:p-c*n}));let h=-c,g=s,_=5.5;return m.appendChild(Y(`path`,{class:`cyc-edge__head`,d:`M ${f} ${p} L ${f-s*n+h*_} ${p-c*n+g*_} L ${f-s*n-h*_} ${p-c*n-g*_} Z`})),m}function gr(e,t,n,r,i=``){let a=Y(`g`,{class:`cyc-node ${i}`.trim()});a.appendChild(Y(`rect`,{class:`cyc-node__box`,x:n-46/2,y:r-30/2,width:46,height:30,rx:8}));let o=Y(`text`,{class:`cyc-node__value`,x:n,y:r});return o.textContent=String(t),a.appendChild(o),e.appendChild(a),a}function _r(e,t,n){let r=Y(`g`,{class:`cyc-null`});r.appendChild(Y(`circle`,{class:`cyc-null__ring`,cx:t,cy:n,r:15}));let i=Y(`text`,{class:`cyc-null__text`,x:t,y:n});return i.textContent=`∅`,r.appendChild(i),e.appendChild(r),r}function vr(e,t,n,r){let i=n>t?1:-1,a=Y(`g`,{class:`cyc-edge`});return a.appendChild(Y(`line`,{class:`cyc-edge__line`,x1:t,y1:r,x2:n-i*8,y2:r})),a.appendChild(Y(`path`,{class:`cyc-edge__head`,d:`M ${n} ${r} L ${n-i*8} ${r-5.5} L ${n-i*8} ${r+5.5} Z`})),e.appendChild(a),a}function yr(e,t,n=0,r=15){if(!e)return null;let i;if(e.inRing&&e.index!==t.a){let n=e.cx-t.ringCenter.x,r=e.cy-t.ringCenter.y,a=Math.hypot(n,r)||1;i={x:n/a,y:r/a}}else i={x:0,y:1};let a={x:e.cx+i.x*30,y:e.cy+i.y*30};if(!n)return a;let o={x:-i.y,y:i.x};return{x:a.x+o.x*n*r,y:a.y+o.y*n*r}}function br(e,{values:t,cycleStart:n}){let r=Array.isArray(t)?t:[],i=r.length,a=Number.isInteger(n)&&n>=0&&n<i,o=a?n:i,s=a?i-o:0,c=dr(s),l=c+30/2+52,u=24+(o>0?(o-1)*70+46+58:0),d=u+46/2+c,f=a?d+c+46/2+46:u+46/2+60,p=a?l+c+30/2+30+20/2+cr:l+30/2+30+20/2+cr,m=e=>e<o?{x:24+e*70+46/2,y:l}:pr(e-o,s,d,l,c),h=[];for(let e=0;e<i-1;e+=1)h.push(hr(m(e),m(e+1)));if(a)if(s===1){let e=m(o),t=Y(`g`,{class:`cyc-edge`});t.appendChild(Y(`path`,{class:`cyc-edge__line`,d:`M ${e.x} ${e.y-30/2} C ${e.x-30} ${e.y-30/2-34}, ${e.x+30} ${e.y-30/2-34}, ${e.x} ${e.y-30/2}`,fill:`none`})),t.appendChild(Y(`path`,{class:`cyc-edge__head`,d:`M ${e.x} ${e.y-30/2} L ${e.x-7} ${e.y-30/2-13} L ${e.x+7} ${e.y-30/2-13} Z`})),h.push(t)}else h.push(hr(m(i-1),m(o)));for(let t of h)e.appendChild(t);let g=r.map((t,n)=>{let r=m(n);return{g:gr(e,t,r.x,r.y),cx:r.x,cy:r.y,index:n,inRing:a&&n>=o,ringK:a&&n>=o?n-o:-1}});if(a&&i>0){let t=m(o),n=Y(`g`,{class:`cyc-entry`});n.appendChild(Y(`rect`,{class:`cyc-entry__box`,x:t.x-46/2-5,y:t.y-30/2-5,width:56,height:40,rx:11}));let r=Y(`text`,{class:`cyc-entry__tag`,x:t.x,y:t.y-30/2-16});r.textContent=`入口`,n.appendChild(r),e.appendChild(n)}let _=null;if(!a&&i>0){let t=m(i-1),n=t.x+46/2+30;vr(e,t.x+46/2,n-15,l),_r(e,n,l),_={x:n,y:l}}return{a:o,b:s,hasCycle:a,width:f,height:p,rowY:l,ringCenter:{x:d,y:l},radius:c,nullPos:_,nodes:g,ringKOf:e=>a&&e>=o?e-o:-1,at:e=>g[e]}}var xr=`cyd-styles`,Sr=42,Cr=26,wr=1150,Tr=`
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
`;function Er(){if(X(),ur(),document.getElementById(xr))return;let e=document.createElement(`style`);e.id=xr,e.textContent=Tr,document.head.appendChild(e)}function Dr(e,t,n){let r=Y(`g`,{class:`cyc-chip cyc-chip--${t}`});r.appendChild(Y(`rect`,{class:`cyc-chip__box`,x:-26/2,y:-20/2,width:Cr,height:20}));let i=Y(`text`,{class:`cyc-chip__text`,x:0,y:0});return i.textContent=n,r.appendChild(i),e.appendChild(r),r}function Or(e,t={}){if(!e||e.dataset.cydMounted===`1`)return{destroy(){}};e.dataset.cydMounted=`1`,Er();let n=or(t),r=n[0].cycle,i=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4,5,6,7,8,9,10,11,12,13],a=r?r.start:null,o=t.autoplay!==!1,s=document.createElement(`div`);s.className=`viz cyd`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=Y(`svg`,{class:`viz__svg cyd__svg`,viewBox:`0 0 700 400`,role:`img`,"aria-label":`Floyd 判圈（龟兔赛跑）推演动画`});c.appendChild(l);let u=br(l,{values:i,cycleStart:a});l.setAttribute(`viewBox`,`0 0 ${u.width} ${u.height}`),l.setAttribute(`width`,u.width),l.setAttribute(`height`,u.height);let d=Y(`g`,{class:`cyd-arc is-off`}),f=Y(`path`,{class:`cyd-arc__line`}),p=Y(`path`,{class:`cyd-arc__head`}),m=Y(`rect`,{class:`cyd-arc__tag-bg`,x:-30,y:-9,width:60,height:18,rx:6}),h=Y(`text`,{class:`cyd-arc__tag`,x:0,y:0}),g=Y(`g`,{class:`cyd-arc__tag-group`});g.append(m,h),d.append(f,p,g),l.appendChild(d);let _=Dr(l,`slow`,`慢`),v=Dr(l,`fast`,`快`);function y(e,t){return yr(u.at(e),u,t)}let b=(e,t)=>{if(!t){e.style.opacity=`0`;return}e.style.opacity=`1`,e.setAttribute(`transform`,`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)})`)},x=document.createElement(`p`);x.className=`viz__desc`,x.setAttribute(`aria-live`,`polite`),s.appendChild(x);let S=Q();s.appendChild(S.root),e.textContent=``,e.appendChild(s);let C=null;function w(e,t){let n=u.b,r=t.slow!==null&&t.slow===t.fast;u.nodes.forEach(e=>{let n=e.index===t.slow,r=e.index===t.fast;e.g.classList.toggle(`is-slow`,n&&!r),e.g.classList.toggle(`is-fast`,r&&!n),e.g.classList.toggle(`is-both`,n&&r)}),b(_,t.slow===null?null:y(t.slow,r?-1:0)),b(v,t.fast===null?null:y(t.fast,+!!r));let i=t.fast===null?-1:u.ringKOf(t.fast),a=t.slow===null?-1:u.ringKOf(t.slow),o=n>0&&i>=0&&a>=0&&t.gap!==null&&t.gap>0;if(d.classList.toggle(`is-off`,!o),o){let e=u.radius-Sr,r=(a-i+n)%n,o=fr(i,n),s=fr(i+r,n),c=s-o,l=t=>{let n=t*Math.PI/180;return{x:u.ringCenter.x+e*Math.cos(n),y:u.ringCenter.y+e*Math.sin(n)}},d=l(o),m=l(s),_=+(c>180);f.setAttribute(`d`,`M ${d.x.toFixed(1)} ${d.y.toFixed(1)} A ${e} ${e} 0 ${_} 1 ${m.x.toFixed(1)} ${m.y.toFixed(1)}`);let v=s*Math.PI/180,y=-Math.sin(v),b=Math.cos(v),x=-b,S=y;p.setAttribute(`d`,`M ${m.x} ${m.y} L ${m.x-y*9+x*5} ${m.y-b*9+S*5} L ${m.x-y*9-x*5} ${m.y-b*9-S*5} Z`);let C=(o+c/2)*Math.PI/180,w={x:u.ringCenter.x+e*Math.cos(C),y:u.ringCenter.y+e*Math.sin(C)};g.setAttribute(`transform`,`translate(${w.x.toFixed(1)} ${w.y.toFixed(1)})`),h.textContent=`${t.gap} 格`}Z(x,t.desc)}let T=$({steps:n,controls:S,intervalMs:wr,onRender:w});T.jumpTo(Math.trunc(t.initialStep)||0);let E=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return o&&!E&&typeof IntersectionObserver==`function`&&(C=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){C.disconnect(),C=null,T.play();return}},{threshold:.35}),C.observe(s)),{destroy(){C&&=(C.disconnect(),null),T.destroy(),e.textContent=``,delete e.dataset.cydMounted,document.getElementById(xr)?.remove()}}}var kr=[1,2,3,4,5,6,7,8,9,10,11,12,13],Ar=4;function jr(e={}){let t=Array.isArray(e.values)?e.values.slice():kr.slice(),n=t.length,r=e.cycleStart===void 0?Ar:e.cycleStart,i=[],a=(e,t,n={})=>i.push({phase:e,desc:t,ptr1:null,ptr2:null,walked:0,remain1:0,remain2:0,passed2:!1,entry:null,meetAt:null,a:0,b:0,x:0,m:0,done:!1,...n});if(n===0)return a(`none`,"链表是空的，没有环，返回 `null`。",{done:!0}),i;let o=or({values:t,cycleStart:r}),s=o[o.length-1];if(!s.met)return a(`none`,"这条链表没有环（快指针已经走到末尾），所以 LC 142 直接返回 `null` —— 入口根本不存在。",{done:!0}),i;let c=s.cycle.start,l=s.cycle.length,u=s.slow,d=(u-c)%l,f=c+d,p=f/l,m=l-d,h=e=>Number.isInteger(e)&&e>=0&&e<n?String(t[e]):`∅`,g=e=>!Number.isInteger(e)||e>=n?null:e+1<n?e+1:c,_=c===m?`这里 a 恰好等于 b - x，所以两个指针会**同步**抵达入口。`:`注意 a = ${c} 而 b - x = ${m}，后者更小 —— ptr2 会先路过入口、绕回来之后才和 ptr1 碰上。同余式只管「差整数圈」，不管谁先到。`;if(a(`meet`,`第一阶段的终点：慢指针和快指针在节点 ${h(u)} 相遇。设入口是 ${h(c)}、直段长 \`a = ${c}\`、环长 \`b = ${l}\`、相遇点距入口 \`x = ${d}\`，那么 \`a + x = ${f} = ${p} × b\`，也就是 \`a ≡ b - x (mod b)\`。现在**把 ptr1 放回 head、ptr2 留在相遇点，两者都改成每步走 1 格**：ptr1 要走到入口差 **${c} 步**，ptr2 沿环走到入口差 **${m} 步**。${_}`,{ptr1:0,ptr2:u,walked:0,remain1:c,remain2:m,entry:c,meetAt:u,a:c,b:l,x:d,m:p}),c===0)return a(`found`,`**入口就是头节点 ${h(0)}。** 这里 a = 0，头节点本身就在环上 —— ptr1 一步都不用走，而相遇点也正好是入口（x = 0），所以两个指针一开始就重合。LC 142 返回这个节点。`,{ptr1:0,ptr2:u,walked:0,remain1:0,remain2:0,entry:0,meetAt:u,a:c,b:l,x:d,m:p,done:!0}),i;let v=0,y=u;for(let e=1;e<=c;e+=1){v=g(v),y=g(y);let t=c-e,n=m-e,r=n<0,o=r?(n%l+l)%l:n;if(v===y)return a(`found`,`**两个指针在节点 ${h(v)} 相遇 —— 这就是环的入口。** 从 head 走了 ${e} 步，从相遇点也走了 ${e} 步。回到那条同余式：a = ${c} 步到入口、b - x = ${m} 步也到入口，两者相差 ${p>1?`${p} 圈`:`零圈`}，所以它们必然在入口碰头。LC 142 返回这个节点。`,{ptr1:v,ptr2:y,walked:e,remain1:t,remain2:o,passed2:r,entry:c,meetAt:u,a:c,b:l,x:d,m:p,done:!0}),i;a(`walk`,`走了 ${e} 步。ptr1 到 ${h(v)}（离入口还差 **${t} 步**）、ptr2 到 ${h(y)}（离入口还差 **${o} 步**）。`+(r?`注意 ptr2 已经**越过**了入口，它要再绕一圈回来 —— 但同余式保证它绕回入口的那一刻，ptr1 也正好走到。`:`两个剩余步数**同步递减**，这是「两条路一样长」的直接体现。`),{ptr1:v,ptr2:y,walked:e,remain1:t,remain2:o,passed2:r,entry:c,meetAt:u,a:c,b:l,x:d,m:p})}return a(`found`,`走了 ${c} 步仍未同时落在入口，这不该发生 —— 请检查输入。`,{ptr1:v,ptr2:y,walked:c,entry:c,meetAt:u,a:c,b:l,x:d,m:p,done:!0}),i}var Mr=`cye-styles`,Nr=42,Pr=56,Fr=32,Ir=17,Lr=1250,Rr=`
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
`;function zr(){if(X(),ur(),document.getElementById(Mr))return;let e=document.createElement(`style`);e.id=Mr,e.textContent=Rr,document.head.appendChild(e)}function Br(e,t,n){let r=Y(`g`,{class:`cyc-chip cyc-chip--${t}`});r.appendChild(Y(`rect`,{class:`cyc-chip__box`,x:-32/2,y:-20/2,width:Fr,height:20}));let i=Y(`text`,{class:`cyc-chip__text`,x:0,y:0});return i.textContent=n,r.appendChild(i),e.appendChild(r),r}function Vr(e,t){let n=Y(`g`,{class:`cye-tag-group cye-tag-group--${t}`}),r=Y(`rect`,{class:`cye-tag-bg`,x:-38,y:-10,width:76,height:20,rx:6}),i=Y(`text`,{class:`cye-tag cye-tag--${t}`,x:0,y:0});return n.append(r,i),e.appendChild(n),{g:n,t:i,bg:r}}function Hr(e,t={}){if(!e||e.dataset.cyeMounted===`1`)return{destroy(){}};e.dataset.cyeMounted=`1`,zr();let n=jr(t),r=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4,5,6,7,8,9,10,11,12,13],i=n[0],a=Number.isInteger(i.a)&&i.b>0?i.a:null,o=t.autoplay!==!1,s=document.createElement(`div`);s.className=`viz cye`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=Y(`svg`,{class:`viz__svg cye__svg`,viewBox:`0 0 700 400`,role:`img`,"aria-label":`环形链表找入口推演动画`});c.appendChild(l);let u=br(l,{values:r,cycleStart:a});l.setAttribute(`viewBox`,`0 0 ${u.width} ${u.height}`),l.setAttribute(`width`,u.width),l.setAttribute(`height`,u.height);let d=u.at(u.a),f=null;if(Number.isInteger(i.meetAt)&&u.at(i.meetAt)){let e=u.at(i.meetAt),t=Y(`g`,{class:`cye-meet`});t.appendChild(Y(`rect`,{class:`cye-meet__box`,x:e.cx-46/2-6,y:e.cy-30/2-6,width:58,height:42,rx:12})),l.appendChild(t),f=t}let p=Y(`g`,{class:`cye-bar`}),m=Y(`path`,{class:`cye-bar__line`}),h=Y(`path`,{class:`cye-bar__tick`}),g=Y(`path`,{class:`cye-bar__tick`});p.append(m,h,g),l.appendChild(p);let _=Vr(l,`p1`),v=Y(`g`,{class:`cye-arc`}),y=Y(`path`,{class:`cye-arc__line`}),b=Y(`path`,{class:`cye-arc__head`});v.append(y,b),l.appendChild(v);let x=Vr(l,`p2`),S=Br(l,`p1`,`P1`),C=Br(l,`p2`,`P2`);function w(e,t){return yr(u.at(e),u,t,Ir)}let T=(e,t)=>{if(!t){e.style.opacity=`0`;return}e.style.opacity=`1`,e.setAttribute(`transform`,`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)})`)},E=document.createElement(`p`);E.className=`viz__desc`,E.setAttribute(`aria-live`,`polite`),s.appendChild(E);let D=Q();s.appendChild(D.root),e.textContent=``,e.appendChild(s);let O=null;function k(e,t){let n=u.b,r=t.ptr1!==null&&t.ptr1===t.ptr2;u.nodes.forEach(e=>{let n=e.index===t.ptr1,r=e.index===t.ptr2;e.g.classList.toggle(`is-slow`,n&&!r),e.g.classList.toggle(`is-fast`,r&&!n),e.g.classList.toggle(`is-both`,n&&r)}),T(S,t.ptr1===null?null:w(t.ptr1,r?-1:0)),T(C,t.ptr2===null?null:w(t.ptr2,+!!r)),f&&(f.style.opacity=t.phase===`found`?`0.45`:`1`);let i=t.ptr1===null?null:u.at(t.ptr1),a=!!i&&t.remain1>0&&!!d;if(p.classList.toggle(`is-off`,!a),_.g.style.opacity=a?`1`:`0`,a){let e=u.rowY+Pr,n=i.cx,r=d.cx;m.setAttribute(`d`,`M ${n} ${e} L ${r} ${e}`),h.setAttribute(`d`,`M ${n} ${e-6} L ${n} ${e+6}`),g.setAttribute(`d`,`M ${r} ${e-6} L ${r} ${e+6}`),_.g.setAttribute(`transform`,`translate(${((n+r)/2).toFixed(1)} ${e})`),_.t.textContent=`还差 ${t.remain1} 步`}let o=t.ptr2===null?-1:u.ringKOf(t.ptr2),s=n>0&&o>=0&&t.remain2>0&&!t.passed2;if(v.classList.toggle(`is-off`,!s),x.g.style.opacity=s?`1`:`0`,s){let e=u.radius-Nr,r=fr(o,n),i=fr(o+t.remain2,n),a=i-r,s=t=>{let n=t*Math.PI/180;return{x:u.ringCenter.x+e*Math.cos(n),y:u.ringCenter.y+e*Math.sin(n)}},c=s(r),l=s(i);y.setAttribute(`d`,`M ${c.x.toFixed(1)} ${c.y.toFixed(1)} A ${e} ${e} 0 ${+(a>180)} 1 ${l.x.toFixed(1)} ${l.y.toFixed(1)}`);let d=i*Math.PI/180,f=-Math.sin(d),p=Math.cos(d);b.setAttribute(`d`,`M ${l.x} ${l.y} L ${l.x-f*9-p*5} ${l.y-p*9+f*5} L ${l.x-f*9+p*5} ${l.y-p*9-f*5} Z`);let m=(r+a/2)*Math.PI/180;x.g.setAttribute(`transform`,`translate(${(u.ringCenter.x+e*Math.cos(m)).toFixed(1)} ${(u.ringCenter.y+e*Math.sin(m)).toFixed(1)})`),x.t.textContent=`还差 ${t.remain2} 步`}Z(E,t.desc)}let A=$({steps:n,controls:D,intervalMs:Lr,onRender:k});A.jumpTo(Math.trunc(t.initialStep)||0);let j=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return o&&!j&&typeof IntersectionObserver==`function`&&(O=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){O.disconnect(),O=null,A.play();return}},{threshold:.35}),O.observe(s)),{destroy(){O&&=(O.disconnect(),null),A.destroy(),e.textContent=``,delete e.dataset.cyeMounted,document.getElementById(Mr)?.remove()}}}function Ur(e,t){let n=e.length,r=Array.from({length:n+1},(e,t)=>t+1<=n?t+1:null),i=[],a=t=>t===null?`∅`:t===0?`dummy`:String(e[t-1]),o=(e,a,o={})=>i.push({phase:e,desc:a,fast:0,slow:0,gap:null,links:[...r],cutSlot:null,leadTotal:t+1,syncTotal:Math.max(0,n-t),done:!1,...o});if(n===0)return o(`init`,"空链表：没有可删的节点，返回 `∅` 即可。"),i[0].done=!0,i;o(`init`,"先接一个哑结点 `dummy`，`fast` 和 `slow` 都从它出发。有它在，「删头节点」就不再需要特判。");let s=0;for(let e=1;e<=t+1;e+=1){s=r[s];let n=s-0;o(`lead`,e===1?`① \`fast\` 先走：第 1 / ${t+1} 步，指向 ${a(s)}。约定是先走 **n+1 = ${t+1}** 步 —— 要定位的是待删节点的**前驱**，所以多退这一步。`:s===null?`① \`fast\` 第 ${e} / ${t+1} 步落到了 ∅ —— \`n\` 正好等于链长，要删的就是**头节点**。同步阶段将一步不走，\`slow\` 会留在 \`dummy\` 上。`:`① \`fast\` 继续走：第 ${e} / ${t+1} 步，指向 ${a(s)}。`+(e===t+1?`间隔锁死为 **n+1 = ${t+1}**， \`slow\` 从现在起一步不会再被落下。`:`\`slow\` 原地不动，间隔拉开到 ${n}。`),{fast:s,gap:s===null?null:n})}let c=0,l=0;for(;s!==null;){s=r[s],c=r[c],l+=1;let e=s===null;o(`sync`,e?`② \`fast\` 撞到了 ∅，停下。\`slow\` 停在 ${a(c)} —— 正是**倒数第 n+1 个**节点，待删节点 ${a(c+1)} 的**前驱**。`:`② 两个指针一起走（第 ${l} / ${n-t} 步）：\`fast\` 在 ${a(s)}，\`slow\` 在 ${a(c)}。间隔保持 ${s-c} 不变 —— 这就是循环不变量。`,{fast:s,slow:c,gap:e?null:s-c})}let u=c+1;return r[c]=r[u],o(`cut`,`③ \`slow.next = slow.next.next\`：${a(c)} 的箭头跨过 ${a(u)}，直接指向 ${a(r[c])}。节点 ${a(u)} 被摘掉 —— 注意它还在内存里，只是没人再引用它。`,{slow:c,cutSlot:u}),o(`done`,`④ 返回 \`dummy.next\`（**不是 head**——如果删的是头节点，head 已经不在链上了）。得到 ${e.filter((e,t)=>t!==u-1).map(String).join(` → `)}。全程只扫了**一趟**。`,{slow:c,cutSlot:u}),i[i.length-1].done=!0,i}var Wr=`rnth-styles`,Gr=64,Kr=50,qr=42,Jr=48,Yr=88,Xr=113,Zr=40,Qr=196,$r=236,ei=56,ti=26,ni=272,ri=26,ii=1150,ai=`
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
`;function oi(){if(X(),document.getElementById(Wr))return;let e=document.createElement(`style`);e.id=Wr,e.textContent=ai,document.head.appendChild(e)}function si(e,t={}){if(!e||e.dataset.rnthMounted===`1`)return{destroy(){}};e.dataset.rnthMounted=`1`,oi();let n=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4,5],r=Math.min(Math.max(Math.trunc(t.n)||2,1),n.length),i=t.autoplay!==!1,a=Ur(n,r),o=n.length,s=o+1,c=2*Jr+s*Gr+(s-1)*qr,l=e=>Jr+e*106,u=e=>l(e)+Gr/2,d=c-ri,f=document.createElement(`div`);f.className=`viz rnth`;let p=document.createElement(`div`);p.className=`viz__stage`,f.appendChild(p);let m=Y(`svg`,{class:`viz__svg rnth__svg`,viewBox:`0 0 ${c} ${ni}`,role:`img`,"aria-label":`删除倒数第 ${r} 个节点推演动画：${n.join(` → `)}`});p.appendChild(m),m.appendChild(Y(`circle`,{class:`rnth-null__ring`,cx:d,cy:Xr,r:15}));let h=Y(`text`,{class:`rnth-null__text`,x:d,y:Xr});h.textContent=`∅`,m.appendChild(h);let g=Y(`line`,{class:`rnth-tick`}),_=Y(`line`,{class:`rnth-tick`});m.append(g,_);let v=[];for(let e=0;e<o;e+=1){let t=mt(l(e)+Gr,l(e+1),Xr,1,`rnth-edge`);m.appendChild(t),v.push(t)}let y=mt(l(o)+Gr,d-15,Xr,1,`rnth-edge`);m.appendChild(y);let b=Y(`path`,{class:`rnth-arc__line`}),x=Y(`path`,{class:`rnth-arc__head`}),S=Y(`g`,{class:`rnth-arc`});S.append(b,x),m.appendChild(S);let C=[];for(let e=0;e<s;e+=1){let t=Y(`g`,{class:`rnth-node${e===0?` rnth-node--dummy`:``}`});t.appendChild(Y(`rect`,{class:`rnth-node__box`,x:l(e),y:Yr,width:Gr,height:Kr,rx:9}));let r=Y(`text`,{class:`rnth-node__value`,x:u(e),y:Xr});r.textContent=e===0?`dummy`:String(n[e-1]),t.appendChild(r),m.appendChild(t),C.push(t)}let w=Y(`g`,{class:`rnth-gapline`}),T=Y(`line`,{class:`rnth-gapline__line`}),E=Y(`path`,{class:`rnth-gapline__head`}),D=Y(`path`,{class:`rnth-gapline__head`}),O=Y(`rect`,{class:`rnth-gapline__tag-bg`,x:-26,y:-9,width:52,height:18,rx:6}),k=Y(`text`,{class:`rnth-gapline__tag`,x:0,y:0});w.append(T,E,D,O,k),m.appendChild(w);function A(e,t){let n=Y(`g`,{class:`rnth-chip rnth-chip--${e}`});n.appendChild(Y(`rect`,{class:`rnth-chip__box`,x:-56/2,y:-26/2,width:ei,height:ti}));let r=Y(`text`,{class:`rnth-chip__text`,x:0,y:0});return r.textContent=t,n}let j=A(`fast`,`fast`),M=A(`slow`,`slow`);m.append(j,M);let N=document.createElement(`p`);N.className=`viz__desc`,N.setAttribute(`aria-live`,`polite`),f.appendChild(N);let P=Q();f.appendChild(P.root),e.textContent=``,e.appendChild(f);let F=null,I=e=>e===null?d:u(e);function L(e,t,n,r){let i=I(n);e.style.transform=`translate(${i}px, ${r}px)`,e.style.opacity=`1`,t.setAttribute(`x1`,i),t.setAttribute(`x2`,i),t.setAttribute(`y1`,r-ti/2),t.setAttribute(`y2`,138),t.style.opacity=`0.65`}function R(e){let t=e.cutSlot;if(t===null||e.links[t-1]!==t+1){S.classList.remove(`is-on`);return}let n=l(t-1)+Gr,r=l(t+1),i=Xr,a=Xr,o=n+(r-n)*.3,s=n+(r-n)*.7;b.setAttribute(`d`,`M ${n} ${i} C ${o} ${i-44}, ${s} ${a-44}, ${r-8} ${a}`),x.setAttribute(`d`,`M ${r} ${a} L ${r-9} ${a-5.5} L ${r-9} 118.5 Z`),S.classList.add(`is-on`)}function z(e){let t=e.gap!==null&&e.gap>0&&e.fast!==null;if(w.classList.toggle(`is-on`,t),!t)return;let n=u(e.slow),r=u(e.fast);T.setAttribute(`x1`,n),T.setAttribute(`x2`,r),T.setAttribute(`y1`,Zr),T.setAttribute(`y2`,Zr),E.setAttribute(`d`,`M ${n} ${Zr} L ${n+7} ${Zr-4.5} L ${n+7} 44.5 Z`),D.setAttribute(`d`,`M ${r} ${Zr} L ${r-7} ${Zr-4.5} L ${r-7} 44.5 Z`),O.setAttribute(`x`,(n+r)/2-26),O.setAttribute(`y`,Zr-9),k.setAttribute(`x`,(n+r)/2),k.setAttribute(`y`,Zr),k.textContent=`间隔 ${e.gap}`}function B(e,t){for(let e=0;e<s;e+=1)C[e].classList.toggle(`is-cut`,t.cutSlot!==null&&e===t.cutSlot);for(let e=0;e<o;e+=1)v[e].classList.toggle(`is-on`,t.links[e]===e+1);y.classList.toggle(`is-on`,t.links[o]===null),R(t),z(t),t.fast===null?(j.style.transform=`translate(${d}px, ${Qr}px)`,j.style.opacity=`1`,g.style.opacity=`0`):L(j,g,t.fast,Qr),L(M,_,t.slow,$r),Z(N,t.desc)}let V=$({steps:a,controls:P,intervalMs:ii,onRender:B});V.jumpTo(Math.trunc(t.initialStep)||0);let H=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return i&&!H&&typeof IntersectionObserver==`function`&&(F=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){F.disconnect(),F=null,V.play();return}},{threshold:.35}),F.observe(f)),{destroy(){F&&=(F.disconnect(),null),V.destroy(),e.textContent=``,delete e.dataset.rnthMounted,document.getElementById(Wr)?.remove()}}}function ci(e){if(e<=0)return null;let t=0,n=1;for(;n<e&&n+1<e;)t+=1,n+=2;return t}function li(e,t){let n=[],r=e,i=new Set;for(;r!=null&&!i.has(r);)i.add(r),n.push(r),r=t[r];return n}function ui(e){let t=e.length,n=[];for(let r=0;r<Math.floor(t/2);r+=1)n.push(e[r],e[t-1-r]);return t%2==1&&n.push(e[Math.floor(t/2)]),n}function di(e){let t=e.length,n=Array.from({length:t},(e,n)=>n+1<t?n+1:null),r=t=>t===null?`∅`:String(e[t]),i=[],a=(e,t,r={})=>i.push({phase:e,stage:0,desc:t,links:[...n],merged:[],front:[],back:[],chips:[],cutEdge:null,done:!1,...r}),o=(e,t)=>li(e,n).filter(e=>!t.includes(e));if(t<=1)return a(`init`,t===0?`空链表，没什么可重排的。`:`只有一个节点，重排之后还是它自己 —— 直接返回。`,{front:li(0,n)}),i[0].done=!0,i;a(`init`,`目标：前半段顺序不变，后半段倒过来插进缝隙 —— 也就是要把 ${e.join(` → `)} 变成 ${ui(e).join(` → `)}。全程只改指针，一个值都不动。`,{front:li(0,n)});let s=ci(t),c=0,l=1,u=0;for(;l<t&&l+1<t;)c+=1,l+=2,u+=1,a(`mid`,`① 快慢指针找中点（第 ${u} 步）：\`fast\` 一次跨两格到 ${r(l<t?l:null)}，\`slow\` 一次挪一格到 ${r(c)}。`+(c===s?` \`fast\` 走不动了 —— \`slow\` 停在 **${r(c)}**，正是前半段的最后一个节点。`:``),{stage:1,front:li(0,n),chips:[{kind:`slow`,label:`slow`,slot:c},{kind:`fast`,label:`fast`,slot:l<t?l:null}]});let d=s+1;n[s]=null,a(`split`,`② **\`slow.next = None\`** —— 断开。这一步看着多余，其实是防环的命门：前半段的尾巴要是还搭在后半段上，第 ③ 步合并时指针会绕成环，链表再也走不到头。现在前段是 ${e.slice(0,s+1).map(String).join(` → `)}，后段是 ${e.slice(d).map(String).join(` → `)}。`,{stage:2,front:li(0,n),back:li(d,n),cutEdge:[s,d]});let f=null,p=d;for(;p!==null;){let e=n[p];n[p]=f;let t=p;f=p,p=e,a(`rev`,p===null?`反转最后一步：\`${r(t)}.next\` 指向 ${r(n[t])}，后半段变成 ${li(f,n).map(r).join(` → `)}。这是 LC 206 的逐字复刻，只是起点换成了 \`second\`。`:`反转后半段：\`${r(t)}.next\` 掉头指向 ${r(n[t])}，\`prev\` 前移到 ${r(f)}，\`curr\` 前移到 ${r(p)}。`,{stage:2,front:li(0,n),back:li(f,n).concat(li(p,n)),chips:[{kind:`prev`,label:`prev`,slot:f},{kind:`curr`,label:`curr`,slot:p}]})}let m=0,h=f,g=[];for(;h!==null;){let e=n[m],t=n[h];n[m]=h,g.push(m,h),a(`merge`,`③ \`first.next = second\`：\`${r(m)}\` 的箭头改指向 ${r(h)}，把后半段的头节点拽了上来。\`t1\`(\`${r(e)}\`) 和 \`t2\`(\`${r(t)}\`) 提前记住了两条链的下家 —— 改指针之前先把路记住，和反转链表里那个 \`nxt\` 是同一个道理。`,{stage:3,merged:[...g],front:o(e,g),back:o(t,g),chips:[{kind:`first`,label:`first`,slot:m},{kind:`second`,label:`second`,slot:h}]}),n[h]=e,a(`merge`,t===null?`③ \`second.next = t1\`：\`${r(h)}\` 接回 ${r(e)}。后半段用完了（\`second\` 变成 ∅），循环结束 —— 条件写的是 \`while second\`，因为后半段更短。`:`③ \`second.next = t1\`：\`${r(h)}\` 接回 ${r(e)}。两个指针各自前移：\`first\` → ${r(e)}，\`second\` → ${r(t)}。`,{stage:3,merged:[...g],front:o(e,g),back:o(t,g),chips:[{kind:`first`,label:`first`,slot:e},{kind:`second`,label:`second`,slot:t}]}),m=e,h=t}let _=li(0,n);return a(`done`,`重排完成：${_.map(r).join(` → `)}。**头节点还是原来的 ${r(0)}** —— 所以这题不需要返回新头，Java 的签名就是 \`void\`。`,{stage:3,merged:_}),i[i.length-1].done=!0,i}var fi=`rord-styles`,pi=64,mi=48,hi=44,gi=44,_i=118,vi=218,yi=-26,bi=44,xi=58,Si=26,Ci=62,wi=1250,Ti=[`① 找中点`,`② 断开并反转`,`③ 交替合并`],Ei=`
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
`;function Di(){if(X(),document.getElementById(fi))return;let e=document.createElement(`style`);e.id=fi,e.textContent=Ei,document.head.appendChild(e)}function Oi(e,t={}){if(!e||e.dataset.rordMounted===`1`)return{destroy(){}};e.dataset.rordMounted=`1`,Di();let n=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4],r=t.autoplay!==!1,i=di(n),a=n.length,o=Math.max(a,1),s=e=>gi+e*108,c=2*gi+o*pi+(o-1)*hi,l=c+Ci,u=c+Ci/2,d=e=>e+mi/2,f=document.createElement(`div`);f.className=`viz rord`;let p=document.createElement(`div`);p.className=`viz__stage`,f.appendChild(p);let m=Y(`svg`,{class:`viz__svg rord__svg`,viewBox:`0 0 ${l} 322`,role:`img`,"aria-label":`重排链表推演动画：${n.join(` → `)}`});p.appendChild(m);let h=[],g=Math.min(150,(l-2*gi-32)/3),_=(l-(3*g+32))/2;Ti.forEach((e,t)=>{let n=Y(`g`,{class:`rord-stage`}),r=_+t*(g+16);n.appendChild(Y(`rect`,{class:`rord-stage__box`,x:r,y:bi-15,width:g,height:30,rx:15}));let i=Y(`text`,{class:`rord-stage__text`,x:r+g/2,y:bi});i.textContent=e,n.appendChild(i),m.appendChild(n),h.push(n)}),m.appendChild(Y(`circle`,{class:`rord-null__ring`,cx:u,cy:d(_i),r:15}));let v=Y(`text`,{class:`rord-null__text`,x:u,y:d(_i)});v.textContent=`∅`,m.appendChild(v);let y=Y(`g`,{class:`rord-edges`});m.appendChild(y);let b=[];for(let e=0;e<a;e+=1){let t=Y(`g`,{class:`rord-node`});t.appendChild(Y(`rect`,{class:`rord-node__box`,x:0,y:0,width:pi,height:mi,rx:9}));let r=Y(`text`,{class:`rord-node__value`,x:pi/2,y:mi/2});r.textContent=String(n[e]),t.appendChild(r),m.appendChild(t),b.push(t)}function x(){let e=Y(`g`,{class:`rord-chip`});e.appendChild(Y(`rect`,{class:`rord-chip__box`,x:-58/2,y:-26/2,width:xi,height:Si}));let t=Y(`text`,{class:`rord-chip__text`,x:0,y:0});return e.appendChild(t),{g:e,t}}let S=[x(),x()];S.forEach(e=>m.appendChild(e.g));let C=document.createElement(`p`);C.className=`viz__desc`,C.setAttribute(`aria-live`,`polite`),f.appendChild(C);let w=Q();f.appendChild(w.root),e.textContent=``,e.appendChild(f);let T=null;function E(e,t,n,r){let i=n[e],a=n[t],o=Y(`g`,{class:`rord-edge ${r||``}`});if(i.y===a.y&&Math.abs(i.x-a.x)===108){let e=i.y+mi/2,t=i.x+pi,n=a.x;o.appendChild(Y(`line`,{class:`rord-edge__line`,x1:t+3,y1:e,x2:n-9,y2:e})),o.appendChild(Y(`path`,{class:`rord-edge__head`,d:`M ${n} ${e} L ${n-9} ${e-5.5} L ${n-9} ${e+5.5} Z`}))}else{let e=i.y+mi,t=a.y+mi,n=i.x+pi/2,r=a.x+pi/2;o.appendChild(Y(`path`,{class:`rord-edge__line`,d:`M ${n} ${e} C ${n} ${e+38}, ${r} ${t+38}, ${r} ${t+8}`})),o.appendChild(Y(`path`,{class:`rord-edge__head`,d:`M ${r} ${t} L ${r-5.5} ${t+9} L ${r+5.5} ${t+9} Z`}))}y.appendChild(o)}function D(e,t){let n=Array(a).fill(null),r=[...t.merged,...t.front];r.forEach((e,t)=>{n[e]={x:s(t),y:_i}}),t.back.forEach((e,t)=>{n[e]={x:s(r.length+t),y:vi}});let i=r.length+t.back.length;for(let e=0;e<a;e+=1)n[e]||(n[e]={x:s(i),y:_i},i+=1);let o=new Set(t.merged);for(let e=0;e<a;e+=1){let t=n[e];b[e].setAttribute(`transform`,`translate(${t.x} ${t.y})`),b[e].classList.toggle(`is-merged`,o.has(e))}y.textContent=``;for(let e=0;e<a;e+=1){let r=t.links[e];r!=null&&(r<0||r>=a||E(e,r,n,t.phase===`merge`||t.phase===`done`?`rord-edge--merged`:``))}if(t.cutEdge){let[e,r]=t.cutEdge;if(n[e]&&n[r]){let t=Y(`g`,{class:`rord-edge rord-edge--cut`}),i=n[e],a=n[r];t.appendChild(Y(`line`,{class:`rord-edge__line`,x1:i.x+pi,y1:i.y+mi/2,x2:a.x,y2:a.y+mi/2})),y.appendChild(t)}}h.forEach((e,n)=>e.classList.toggle(`is-on`,t.stage===n+1)),S.forEach((e,r)=>{let i=t.chips[r];if(!i){e.g.style.opacity=`0`;return}let a=i.slot===null?{x:u-pi/2,y:_i}:n[i.slot];e.g.style.opacity=`1`,e.g.setAttribute(`class`,`rord-chip rord-chip--${i.kind}`),e.t.textContent=i.label,e.g.setAttribute(`transform`,`translate(${a.x+pi/2} ${a.y+yi})`)}),Z(C,t.desc)}let O=$({steps:i,controls:w,intervalMs:wi,onRender:D});O.jumpTo(Math.trunc(t.initialStep)||0);let k=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!k&&typeof IntersectionObserver==`function`&&(T=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){T.disconnect(),T=null,O.play();return}},{threshold:.35}),T.observe(f)),{destroy(){T&&=(T.disconnect(),null),O.destroy(),e.textContent=``,delete e.dataset.rordMounted,document.getElementById(fi)?.remove()}}}function ki(e,t){let n=[],r=e,i=new Set;for(;r!=null&&!i.has(r);)i.add(r),n.push(r),r=t[r];return n}function Ai(e){if(e<=0)return null;let t=0,n=0;for(;n<e&&n+1<e;)t+=1,n+=2;return t}function ji(e){let t=e.length;for(let n=0;n<Math.floor(t/2);n+=1)if(e[n]!==e[t-1-n])return!1;return!0}function Mi(e){let t=Ai(e);if(t===null)return[];let n=[];for(let r=0;e-1-r>=t;r+=1)n.push([r,e-1-r]);return n}function Ni(e){let t=e.length,n=Array.from({length:t},(e,n)=>n+1<t?n+1:null),r=t=>t==null?`∅`:String(e[t]),i=[],a=(e,t,r={})=>i.push({phase:e,stage:0,desc:t,links:[...n],front:[],back:[],pairs:[],active:null,verdict:null,chips:[],done:!1,...r});if(t===0)return a(`init`,"空链表。正着读、反着读都是「什么都没有」—— **空链表也算回文**，返回 `true`。",{stage:0,done:!0,verdict:!0}),i;ji(e);let o=e.slice().reverse().join(` → `);if(a(`init`,`判断 ${e.join(` → `)} 是不是回文。核心一句话：**把后半段反转过来（${o}），它应该跟前半段逐位相同**。全程只改指针、只比值，不开数组。`,{front:ki(0,n)}),t===1)return a(`done`,"只有一个节点，正着读反着读都是它自己 —— **是回文**，返回 `true`。",{front:[0],stage:3,done:!0,verdict:!0}),i;let s=Ai(t),c=0,l=0,u=0;for(;l<t&&l+1<t;){c+=1,l+=2,u+=1;let e=l>=t;a(`mid`,`① \`fast\` 一次跨两格、\`slow\` 一次一格：第 ${u} 步后 \`slow\` 走到 ${r(c)}、\`fast\` 走到 ${r(l)}。`+(e?` \`fast\` 冲出链表了 —— \`slow\` 停在 ${r(c)} 上，**这就是后半段的开头**。`:``),{stage:1,front:ki(0,n),chips:[{kind:`slow`,label:`slow`,slot:c},{kind:`fast`,label:`fast`,slot:l<t?l:null}]})}let d=Array.from({length:s},(e,t)=>t),f=Array.from({length:t-s},(e,t)=>s+t),p=d.map(r).join(` → `);a(`split`,`② 后半段 ${f.map(r).join(` → `)} 整体下移一行，前半段是 ${p}。接下来反转下行 —— 反转完它从左到右读起来，应该跟上行一模一样。注意这里**不需要断开**：反转时中点 `+r(s)+" 的 `next` 会被置空，前半段的尾巴走到它自然就停了。",{stage:2,front:d,back:f,chips:[{kind:`curr`,label:`curr`,slot:s}]});let m=null,h=s,g=0;for(;h!==null;){let e=n[h];n[h]=m,m=h,h=e,g+=1;let t=[...ki(m,n),...h===null?[]:ki(h,n)];a(`rev`,`② 第 ${g} 个节点掉头：\`curr\` 的 \`next\` 改成 \`prev\`，也就是 ${r(m)} → ${r(n[m])}。`+(h===null?" 后半段反转完成，`prev` 站在新的段头（原来的尾节点）上。":` \`curr\` 前移到 ${r(h)}，剩下的还没处理。`),{stage:2,front:d,back:t,chips:[{kind:`prev`,label:`prev`,slot:m},...h===null?[]:[{kind:`curr`,label:`curr`,slot:h}]]})}let _=ki(t-1,n),v=[],y=Mi(t);for(let t=0;t<y.length;t+=1){let[n,o]=y[t],s=n===o,c=e[n]===e[o],l={f:n,b:o,ok:c};if(v.push(l),a(`cmp`,`③ 第 ${t+1} / ${y.length} 对：`+(s?`\`p1\` 和 \`p2\` 都走到了中点 ${r(n)} 上 —— **中点跟自己比，必然相等**，这一对是白送的。`:`\`p1\` 指向 ${r(n)}、\`p2\` 指向 ${r(o)}，${e[n]} ${c?`==`:`!=`} ${e[o]} —— `+(c?`相等，两个指针一起往前。`:"**不相等，直接返回 `false`**，后面几对不用比了。")),{stage:3,front:d,back:_,pairs:[...v],active:l,verdict:c?null:!1,done:!c,chips:s?[{kind:`p1`,label:`p1/p2`,slot:n}]:[{kind:`p1`,label:`p1`,slot:n},{kind:`p2`,label:`p2`,slot:o}]}),!c)return i}return a(`done`,`③ \`p2\` 走到 ∅，${y.length} 对全部相等 —— **${e.join(` → `)} 是回文链表**，返回 \`true\`。`,{stage:3,front:d,back:_,pairs:[...v],active:null,verdict:!0,done:!0}),i}var Pi=`palm-styles`,Fi=64,Ii=48,Li=44,Ri=44,zi=118,Bi=236,Vi=-26,Hi=44,Ui=58,Wi=26,Gi=62,Ki=350,qi=1250,Ji=[`① 找中点`,`② 反转后半段`,`③ 逐对比较`],Yi=`
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
`;function Xi(){if(X(),document.getElementById(Pi))return;let e=document.createElement(`style`);e.id=Pi,e.textContent=Yi,document.head.appendChild(e)}function Zi(e,t={}){if(!e||e.dataset.palmMounted===`1`)return{destroy(){}};e.dataset.palmMounted=`1`,Xi();let n=Array.isArray(t.values)&&t.values.length?t.values:[1,2,2,1],r=t.autoplay!==!1,i=Ni(n),a=n.length,o=Math.max(a,1),s=e=>Ri+e*108,c=2*Ri+o*Fi+(o-1)*Li,l=c+Gi,u=c+Gi/2,d=e=>e+Ii/2,f=document.createElement(`div`);f.className=`viz palm`;let p=document.createElement(`div`);p.className=`viz__stage`,f.appendChild(p);let m=Y(`svg`,{class:`viz__svg palm__svg`,viewBox:`0 0 ${l} 390`,role:`img`,"aria-label":`回文链表推演动画：${n.join(` → `)}`});p.appendChild(m);let h=[],g=Math.min(150,(l-2*Ri-32)/3),_=(l-(3*g+32))/2;Ji.forEach((e,t)=>{let n=Y(`g`,{class:`palm-stage`}),r=_+t*(g+16);n.appendChild(Y(`rect`,{class:`palm-stage__box`,x:r,y:Hi-15,width:g,height:30,rx:15}));let i=Y(`text`,{class:`palm-stage__text`,x:r+g/2,y:Hi});i.textContent=e,n.appendChild(i),m.appendChild(n),h.push(n)}),m.appendChild(Y(`circle`,{class:`palm-null__ring`,cx:u,cy:d(zi),r:15}));let v=Y(`text`,{class:`palm-null__text`,x:u,y:d(zi)});v.textContent=`∅`,m.appendChild(v);let y=Y(`g`,{class:`palm-pairs`});m.appendChild(y);let b=Y(`g`,{class:`palm-edges`});m.appendChild(b);let x=[];for(let e=0;e<a;e+=1){let t=Y(`g`,{class:`palm-node`});t.appendChild(Y(`rect`,{class:`palm-node__box`,x:0,y:0,width:Fi,height:Ii,rx:9}));let r=Y(`text`,{class:`palm-node__value`,x:Fi/2,y:Ii/2});r.textContent=String(n[e]),t.appendChild(r),m.appendChild(t),x.push(t)}function S(){let e=Y(`g`,{class:`palm-chip`});e.appendChild(Y(`rect`,{class:`palm-chip__box`,x:-58/2,y:-26/2,width:Ui,height:Wi}));let t=Y(`text`,{class:`palm-chip__text`,x:0,y:0});return e.appendChild(t),{g:e,t}}let C=[S(),S()];C.forEach(e=>m.appendChild(e.g));let w=Y(`g`,{class:`palm-verdict`}),T=Y(`rect`,{class:`palm-verdict__box`,x:(l-190)/2,y:Ki-18,width:190,height:36,rx:18}),E=Y(`text`,{class:`palm-verdict__text`,x:l/2,y:Ki});w.appendChild(T),w.appendChild(E),m.appendChild(w);let D=document.createElement(`p`);D.className=`viz__desc`,D.setAttribute(`aria-live`,`polite`),f.appendChild(D);let O=Q();f.appendChild(O.root),e.textContent=``,e.appendChild(f);let k=null;function A(e,t,n){let r=n[e],i=n[t],a=Y(`g`,{class:`palm-edge`});if(r.y===i.y&&Math.abs(r.x-i.x)===108){let e=r.y+Ii/2,t=r.x+Fi,n=i.x;a.appendChild(Y(`line`,{class:`palm-edge__line`,x1:t+3,y1:e,x2:n-9,y2:e})),a.appendChild(Y(`path`,{class:`palm-edge__head`,d:`M ${n} ${e} L ${n-9} ${e-5.5} L ${n-9} ${e+5.5} Z`}))}else{let e=r.y+Ii,t=i.y+Ii,n=r.x+Fi/2,o=i.x+Fi/2;a.appendChild(Y(`path`,{class:`palm-edge__line`,d:`M ${n} ${e} C ${n} ${e+38}, ${o} ${t+38}, ${o} ${t+8}`})),a.appendChild(Y(`path`,{class:`palm-edge__head`,d:`M ${o} ${t} L ${o-5.5} ${t+9} L ${o+5.5} ${t+9} Z`}))}b.appendChild(a)}function j(e,t,n){let r=Y(`g`,{class:`palm-pair ${e.ok?`is-ok`:`is-bad`} ${n?`is-on`:``}`});if(e.f===e.b){let n=t[e.f],i=n.x+Fi/2-18,a=n.y+Ii;r.appendChild(Y(`path`,{class:`palm-pair__line`,d:`M ${i-14} ${a} C ${i-22} ${a+26}, ${i+22} ${a+26}, ${i+14} ${a}`})),M(r,i,a+26*.78,e.ok)}else{let n=t[e.f],i=t[e.b],a=n.x+Fi/2-18,o=n.y+Ii,s=i.y,c=(o+s)/2;r.appendChild(Y(`line`,{class:`palm-pair__line`,x1:a,y1:o+10,x2:a,y2:c-11})),r.appendChild(Y(`line`,{class:`palm-pair__line`,x1:a,y1:c+11,x2:a,y2:s-2})),M(r,a,c,e.ok)}y.appendChild(r)}function M(e,t,n,r){e.appendChild(Y(`circle`,{class:`palm-pair__disc`,cx:t,cy:n,r:11}));let i=Y(`text`,{class:`palm-pair__mark`,x:t,y:n});i.textContent=r?`✓`:`✗`,e.appendChild(i)}function N(e,t){let n=Array(a).fill(null);t.front.forEach((e,t)=>{n[e]={x:s(t),y:zi}}),t.back.forEach((e,t)=>{n[e]={x:s(t),y:Bi}});let r=Math.max(t.front.length,t.back.length);for(let e=0;e<a;e+=1)n[e]||(n[e]={x:s(r),y:zi},r+=1);let i=new Set;for(let e of t.pairs)i.add(e.f),i.add(e.b);let o=new Set;t.active&&(o.add(t.active.f),o.add(t.active.b));let c=new Set;t.active&&!t.active.ok&&(c.add(t.active.f),c.add(t.active.b));for(let e=0;e<a;e+=1){let t=n[e];x[e].setAttribute(`transform`,`translate(${t.x} ${t.y})`),x[e].classList.toggle(`is-paired`,i.has(e)),x[e].classList.toggle(`is-active`,o.has(e)),x[e].classList.toggle(`is-bad`,c.has(e))}y.textContent=``,t.pairs.forEach((e,r)=>{let i=t.active&&t.pairs.indexOf(t.active)===r;j(e,n,i)}),b.textContent=``;for(let e=0;e<a;e+=1){let r=t.links[e];r!=null&&(r<0||r>=a||A(e,r,n))}h.forEach((e,n)=>e.classList.toggle(`is-on`,t.stage===n+1)),w.setAttribute(`class`,`palm-verdict`);let l=`准备开始`;t.verdict===!0?(w.classList.add(`is-ok`),l=`✓ 是回文链表`):t.verdict===!1?(w.classList.add(`is-bad`),l=`✗ 不是回文链表`):t.phase===`cmp`?l=`比较中…`:t.phase===`split`||t.phase===`rev`?l=`反转中…`:t.phase===`mid`?l=`定位中点…`:t.phase===`init`&&(l=`待判定`),E.textContent=l,C.forEach((e,r)=>{let i=t.chips[r];if(!i){e.g.style.opacity=`0`;return}let a=i.slot===null?{x:u-Fi/2,y:zi}:n[i.slot],o=a.y===Bi&&i.slot!==null?a.y+Ii+14:a.y+Vi;e.g.style.opacity=`1`,e.g.setAttribute(`class`,`palm-chip palm-chip--${i.kind}`),e.t.textContent=i.label,e.g.setAttribute(`transform`,`translate(${a.x+Fi/2} ${o})`)}),Z(D,t.desc)}let P=$({steps:i,controls:O,intervalMs:qi,onRender:N});P.jumpTo(Math.trunc(t.initialStep)||0);let F=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!F&&typeof IntersectionObserver==`function`&&(k=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){k.disconnect(),k=null,P.play();return}},{threshold:.35}),k.observe(f)),{destroy(){k&&=(k.disconnect(),null),P.destroy(),e.textContent=``,delete e.dataset.palmMounted,document.getElementById(Pi)?.remove()}}}function Qi(e,t){let n=new Set(t);for(let r of e){if(!n.has(r))continue;let i=e.indexOf(r),a=t.indexOf(r),o=0;for(;i+o<e.length&&a+o<t.length&&e[i+o]===t[a+o];)o+=1;if(i+o===e.length&&a+o===t.length)return r}return null}function $i(e,t){let n=Qi(e,t);return n===null?0:e.length-e.indexOf(n)}function ea(e,t){let n=$i(e,t);return{a:e.length-n,b:t.length-n,c:n}}function ta(e={}){let t=Array.isArray(e.pool)&&e.pool.length?e.pool:[1,2,3,4,5,6,7],n=Array.isArray(e.pathA)?e.pathA:[0,1,2,3,4],r=Array.isArray(e.pathB)?e.pathB:[5,6,3,4],i={A:n,B:r},a=n.length,o=r.length,s=e=>e==null?`∅`:String(t[e]),c=Qi(n,r),{a:l,b:u,c:d}=ea(n,r),f=[],p=(e,t,n={})=>f.push({phase:e,desc:t,onA:`A`,onB:`B`,iA:0,iB:0,fromA:null,fromB:null,jumpsA:!1,jumpsB:!1,shared:c!==null,equal:!1,meet:null,answer:c,done:!1,...n});if(a===0||o===0)return p(`none`,"有一条链表是空的 —— 空链表不可能有相交节点，直接返回 `null`。",{shared:!1,answer:null,done:!0}),f;p(`init`,`两条链表 A = ${n.map(s).join(` → `)}、B = ${r.map(s).join(` → `)}。`+(c===null?`它们**没有共享任何节点**（下面两个 4 只是值相同，不是同一个节点）。`:`从 ${s(c)} 开始它们**共享同一批节点**，后缀完全重合 —— 这就是"相交"在这个结构里的确切含义。`)+` 目标是找出那个**起始**节点，而且不许开哈希表。`,{onA:`A`,onB:`B`,iA:0,iB:0});let m={on:`A`,i:0},h={on:`B`,i:0},g=0,_=0,v=0,y=2*(a+o)+4,b=()=>({onA:m.on,iA:m.i,onB:h.on,iB:h.i});for(;g<=a+o&&v<y;){v+=1;let e=m.i>=i[m.on].length,t=h.i>=i[h.on].length;if(e&&t)break;if(e||t){let n=m.i>=i[m.on].length?i[m.on][i[m.on].length-1]:i[m.on][m.i],r=h.i>=i[h.on].length?i[h.on][i[h.on].length-1]:i[h.on][h.i],a=[];e&&a.push(`pA`),t&&a.push(`pB`);let o=a.map(e=>s(e===`pA`?n:r)).join(` 和 `);e&&(m={on:m.on===`A`?`B`:`A`,i:0},_+=1),t&&(h={on:h.on===`B`?`A`:`B`,i:0},_+=1);let c=s(i[m.on][m.i]),l=s(i[h.on][h.i]);p(`jump`,`**${a.join(` 和 `)} 走到了 ∅，搬到了对方链表的头上。** 它从 ${o} 的 \`next\` 直接跳到另一条链的第一个节点，于是 pA 在 ${c}、pB 在 ${l}。这一步是整套解法的关键：**pA 走完 A 就去走 B，pB 走完 B 就去走 A**，两条"游标自己走过的路"就此等长。`,{...b(),fromA:n,fromB:r,jumpsA:e,jumpsB:t,equal:i[m.on][m.i]===i[h.on][h.i]});continue}if(i[m.on][m.i]===i[h.on][h.i])break;let n=s(i[m.on][m.i]),r=s(i[h.on][h.i]);m.i+=1,h.i+=1,g+=1;let a=m.i>=i[m.on].length?`∅`:s(i[m.on][m.i]),o=h.i>=i[h.on].length?`∅`:s(i[h.on][h.i]);p(`walk`,`第 ${g} 步：pA 在 ${n}、pB 在 ${r}，**不是同一个节点**，一起前移一格 —— pA 到 ${a}、pB 到 ${o}。注意判断相交比的是**节点本身**，不是值：值相等不算数。`,{...b(),equal:i[m.on][m.i]===i[h.on][h.i]})}let x=m.i>=i[m.on].length,S=h.i>=i[h.on].length;if(!x&&!S&&i[m.on][m.i]===i[h.on][h.i]){let e=i[m.on][m.i];return p(`found`,`**两个游标同时落在节点 ${s(e)} 上 —— 这就是相交的起始节点。** pA 走了 A 的独有段 ${l} 步 + 公共段 ${d} 步 + B 的独有段 ${u} 步，pB 走了 B 的独有段 ${u} 步 + 公共段 ${d} 步 + A 的独有段 ${l} 步 ——两条路都是 \`a + b + c = ${l+u+d}\`，**路程相等，所以必然同时到达**。`,{...b(),equal:!0,meet:e,done:!0}),f}return p(`none`,`两个游标**同时走到了 ∅** —— 两条链表根本没有共享节点。各自都老老实实走完了"自己那条链 + 对方那条链"（各 ${l+u} 步），恰好手拉手一起掉出去。返回 \`null\`。`,{...b(),done:!0}),f}var na=`ints-styles`,ra=62,ia=46,aa=40,oa=46,sa=150,ca=286,la=sa-62,ua=348,da=482/2,fa=52,pa=24,ma=34,ha=30,ga=396,_a=44,va=-34,ya=1250,ba=`
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
`;function xa(){if(X(),document.getElementById(na))return;let e=document.createElement(`style`);e.id=na,e.textContent=ba,document.head.appendChild(e)}function Sa(e,t={}){if(!e||e.dataset.intsMounted===`1`)return{destroy(){}};e.dataset.intsMounted=`1`,xa();let n=ta(t);n[0];let r=t.autoplay!==!1,i=Array.isArray(t.pool)&&t.pool.length?t.pool:[1,2,3,4,5,6,7],a=Array.isArray(t.pathA)?t.pathA:[0,1,2,3,4],o=Array.isArray(t.pathB)?t.pathB:[5,6,3,4],{a:s,b:c,c:l}=ea(a,o),u=l>0?a.slice(s):[],d=new Set(u);s>0&&a[s-1],c>0&&o[c-1];let f=Math.max(a.length,o.length,1),p=ha,m=e=>76+e*102,h=2*oa+f*ra+(f-1)*aa,g=h+ma*2+ha*2,_=p+h+ma,v=s,y=e=>e+ia/2;function b(e){let t=a.indexOf(e),n=o.indexOf(e);return t>=0&&d.has(e)?{x:m(v+(t-s)),y:sa,col:v+(t-s)}:t>=0&&n<0?{x:m(t),y:sa,col:t}:n>=0&&t<0?{x:m(n),y:ca,col:n}:t>=0?{x:m(t),y:sa,col:t}:{x:m(n),y:ca,col:n}}let x=document.createElement(`div`);x.className=`viz ints`;let S=document.createElement(`div`);S.className=`viz__stage`,x.appendChild(S);let C=Y(`svg`,{class:`viz__svg ints__svg`,viewBox:`0 0 ${g} 440`,role:`img`,"aria-label":`相交链表推演动画`});S.appendChild(C);let w=Y(`g`,{class:`ints-shared-note`}),T=Y(`line`,{class:`ints-shared-note__line`}),E=Y(`text`,{class:`ints-shared-note__text`,x:g/2,y:_a});w.append(T,E),C.appendChild(w);let D=[];for(let[e,t]of[[_,y(sa)],[_,y(ca)]]){C.appendChild(Y(`circle`,{class:`ints-null__ring`,cx:e,cy:t,r:14}));let n=Y(`text`,{class:`ints-null__text`,x:e,y:t});n.textContent=`∅`,C.appendChild(n),D.push({cx:e,cy:t})}let O=Y(`g`,{class:`ints-edges`});C.appendChild(O);let k=Y(`g`,{class:`ints-answer`}),A=Y(`rect`,{class:`ints-answer__box`,x:0,y:0,width:76,height:60,rx:13});k.appendChild(A),C.appendChild(k);let j=new Map;for(let e of new Set([...a,...o])){let t=b(e),n=Y(`g`,{class:`ints-node${d.has(e)?` is-shared`:``}`});n.setAttribute(`transform`,`translate(${t.x} ${t.y})`),n.appendChild(Y(`rect`,{class:`ints-node__box`,x:0,y:0,width:ra,height:ia,rx:9}));let r=Y(`text`,{class:`ints-node__value`,x:ra/2,y:ia/2});r.textContent=String(i[e]),n.appendChild(r),C.appendChild(n),j.set(e,n)}let M=[],N=(e,t)=>{for(let n=0;n<e.length-1;n+=1){let r=e[n],i=e[n+1],a=`${r}->${i}`;M.some(e=>e.key===a)||M.push({key:a,from:r,to:i,kind:t})}};N(a,`a`),N(o,`b`);let P=[];for(let e of M){let t=Y(`g`,{class:`ints-edge ints-edge--${e.kind}`}),n=Y(`path`,{class:`ints-edge__line`}),r=Y(`path`,{class:`ints-edge__head`});t.append(n,r),O.appendChild(t),P.push({...e,g:t,line:n,head:r})}let F=[];{let e=Y(`g`,{class:`ints-edge`}),t=Y(`path`,{class:`ints-edge__line`}),n=Y(`path`,{class:`ints-edge__head`});e.append(t,n),O.appendChild(e),F.push({g:e,line:t,head:n,slot:a[a.length-1],row:sa})}let I={};for(let e of[`a`,`b`]){let t=Y(`g`,{class:`ints-hop ints-hop--${e}`}),n=Y(`path`,{class:`ints-hop__line`}),r=Y(`path`,{class:`ints-hop__head`}),i=Y(`rect`,{class:`ints-hop__tag-bg`,x:-76,y:-9,width:152,height:18,rx:6}),a=Y(`text`,{class:`ints-hop__tag`,x:0,y:0});t.append(n,r,i,a),C.appendChild(t),I[e]={g:t,line:n,head:r,tagBg:i,tag:a}}let L=[];if(s>0){let e=Y(`text`,{class:`ints-row__text ints-row__text--a`,x:m(0)+va,y:y(sa)});e.textContent=`A`,C.appendChild(e),L.push(e)}if(c>0){let e=Y(`text`,{class:`ints-row__text ints-row__text--b`,x:m(0)+va,y:y(ca)});e.textContent=`B`,C.appendChild(e),L.push(e)}function R(e,t){let n=Y(`g`,{class:`ints-chip ints-chip--${e}`});n.appendChild(Y(`rect`,{class:`ints-chip__box`,x:-52/2,y:-24/2,width:fa,height:pa}));let r=Y(`text`,{class:`ints-chip__text`,x:0,y:0});return r.textContent=t,n.appendChild(r),n}let z=R(`a`,`pA`),B=R(`b`,`pB`);C.append(z,B);let V=Y(`line`,{class:`ints-lead ints-lead--a`}),H=Y(`line`,{class:`ints-lead ints-lead--b`});O.append(V,H);let U=Y(`g`,{class:`ints-verdict`}),ee=Y(`rect`,{class:`ints-verdict__box`,x:(g-240)/2,y:ga-18,width:240,height:36,rx:18}),te=Y(`text`,{class:`ints-verdict__text`,x:g/2,y:ga});U.append(ee,te),C.appendChild(U);let W=document.createElement(`p`);W.className=`viz__desc`,W.setAttribute(`aria-live`,`polite`),x.appendChild(W);let G=Q();x.appendChild(G.root),e.textContent=``,e.appendChild(x);let K=null;for(let e of P)ne(e,b(e.from),b(e.to));{let e=F[0],t=b(e.slot),n=t.y+ia/2,r=t.x+ra+3,i=_-14;e.line.setAttribute(`d`,`M ${r} ${n} L ${i-8} ${n}`),e.head.setAttribute(`d`,`M ${i} ${n} L ${i-9} ${n-5.5} L ${i-9} ${n+5.5} Z`)}function ne(e,t,n){if(t.y===n.y){let r=t.y+ia/2,i=t.x+ra,a=n.x;e.line.setAttribute(`d`,`M ${i+3} ${r} L ${a-9} ${r}`),e.head.setAttribute(`d`,`M ${a} ${r} L ${a-9} ${r-5.5} L ${a-9} ${r+5.5} Z`);return}let r=t.x+ra,i=t.y+ia/2,a=n.x,o=n.y+ia/2,s=r+3,c=a-9,l=Math.max(26,(c-s)*.45);e.line.setAttribute(`d`,`M ${s} ${i} C ${s+l} ${i}, ${c-l} ${o}, ${c} ${o}`),e.head.setAttribute(`d`,`M ${a} ${o} L ${a-9} ${o-5.5} L ${a-9} ${o+5.5} Z`)}function q(e,t,n){let r=I[e];if(r.g.classList.toggle(`is-on`,n),!n)return;let i=e===`a`?t.fromA:t.fromB,s=(e===`a`?t.onA:t.onB)===`A`?a:o;if(i==null)return;let c=b(i),l=b(s[0]),u=c.x+ra/2,d=e===`a`?c.y+ia:c.y,f=l.x+ra/2,p=e===`a`?l.y:l.y+ia,m=da;r.line.setAttribute(`d`,`M ${u} ${d} L ${u} ${m} L ${f} ${m} L ${f} ${p}`);let h=p<m;r.head.setAttribute(`d`,h?`M ${f} ${p} L ${f-5.5} ${p+9} L ${f+5.5} ${p+9} Z`:`M ${f} ${p} L ${f-5.5} ${p-9} L ${f+5.5} ${p-9} Z`);let g=(u+f)/2;r.tagBg.setAttribute(`x`,g-76),r.tagBg.setAttribute(`y`,m-9),r.tag.setAttribute(`x`,g),r.tag.setAttribute(`y`,m),r.tag.textContent=e===`a`?`pA 走完 A → 换到 B 的头`:`pB 走完 B → 换到 A 的头`}function re(e,t){let n=t===`A`?e.onA:e.onB,r=t===`A`?e.iA:e.iB,i=n===`A`?a:o;if(r>=i.length){let e=n===`A`?sa:ca;return{x:_-ra/2,y:e,onNull:!0}}return{...b(i[r]),onNull:!1}}function ie(e,t){let n=(()=>{let e=t.onA===`A`?a:o;return t.iA>=e.length?null:e[t.iA]})(),r=(()=>{let e=t.onB===`A`?a:o;return t.iB>=e.length?null:e[t.iB]})();for(let[e,i]of j)i.classList.toggle(`is-cursor-a`,e===n),i.classList.toggle(`is-cursor-b`,e===r&&e!==n),i.classList.toggle(`is-meet`,t.meet!==null&&e===t.meet);if(t.answer!==null&&t.answer!==void 0){let e=b(t.answer);A.setAttribute(`x`,e.x-7),A.setAttribute(`y`,e.y-7),k.style.opacity=`1`}else k.style.opacity=`0`;if(t.answer!==null&&t.answer!==void 0&&l>0){let e=b(t.answer).x+ra/2;E.textContent=`公共段从这里开始（两条链共用这 ${l} 个节点）`,T.setAttribute(`x1`,e),T.setAttribute(`x2`,e),T.setAttribute(`y1`,55),T.setAttribute(`y2`,sa-12),w.style.opacity=`1`}else w.style.opacity=`0`;let s=re(t,`A`),c=re(t,`B`),u=n!==null&&n===r,d=s.onNull?sa:s.y,f=c.onNull?ca:c.y,p=d===ca?ua:la,m=f===sa?la:ua,h=u?p-14:p,g=u?m+14:m;z.setAttribute(`transform`,`translate(${s.x+ra/2} ${h})`),B.setAttribute(`transform`,`translate(${c.x+ra/2} ${g})`),z.style.opacity=`1`,B.style.opacity=`1`;let _=(e,t)=>{let n=e<t.y;return{x:t.x+ra/2,y1:n?e+pa/2:e-pa/2,y2:n?t.y-2:t.y+ia+2}},v=_(h,s),y=_(g,c);V.setAttribute(`x1`,v.x),V.setAttribute(`x2`,v.x),V.setAttribute(`y1`,v.y1),V.setAttribute(`y2`,v.y2),H.setAttribute(`x1`,y.x),H.setAttribute(`x2`,y.x),H.setAttribute(`y1`,y.y1),H.setAttribute(`y2`,y.y2),q(`a`,t,t.phase===`jump`&&t.jumpsA),q(`b`,t,t.phase===`jump`&&t.jumpsB),U.setAttribute(`class`,`ints-verdict`);let x=`准备开始`;t.phase===`found`?(U.classList.add(`is-ok`),x=`✓ 相交于节点 ${i[t.meet]}`):t.phase===`none`?(U.classList.add(`is-bad`),x=`✗ 两条链表不相交`):t.phase===`jump`?x=`换头中…`:t.phase===`walk`?x=`同步前进中…`:t.phase===`init`&&(x=`待判定`),te.textContent=x,Z(W,t.desc)}let ae=$({steps:n,controls:G,intervalMs:ya,onRender:ie});ae.jumpTo(Math.trunc(t.initialStep)||0);let oe=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!oe&&typeof IntersectionObserver==`function`&&(K=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){K.disconnect(),K=null,ae.play();return}},{threshold:.35}),K.observe(x)),{destroy(){K&&=(K.disconnect(),null),ae.destroy(),e.textContent=``,delete e.dataset.intsMounted,document.getElementById(na)?.remove()}}}var Ca=-1;function wa(e,t,n){if(!Array.isArray(t)||n<0||n>=t.length)return 0;let r=e[t[n]],i=1;for(;n+i<t.length&&e[t[n+i]]===r;)i+=1;return i}function Ta(e={}){let t=Array.isArray(e.pool)&&e.pool.length?e.pool:[1,2,3,3,4,4,5],n=Array.isArray(e.path)?e.path:[0,1,2,3,4,5,6],r=e.mode===`keep-one`?`keep-one`:`remove-all`,i=e=>e===Ca||e==null?`dummy`:e>=n.length?`∅`:String(t[n[e]]),a=e=>e<0||e>=n.length?null:t[n[e]],o=e=>wa(t,n,e),s=[],c=[];{let e=0;for(;e<n.length;){let t=o(e);if(t>1)if(r===`keep-one`){for(let n=e;n<e+t-1;n+=1)c.push(n);s.push(e+t-1)}else for(let n=e;n<e+t;n+=1)c.push(n);else s.push(e);e+=t}}let l=[],u=[],d=(e,t,n={})=>l.push({phase:e,desc:t,prev:Ca,curr:0,dupStart:null,dupEnd:null,removed:[...u],removedNow:[],kept:[...s],mode:r,done:!1,...n});if(n.length===0)return d(`done`,"链表是空的 —— 没有节点可删，直接返回 `null`。",{curr:0,prev:Ca,done:!0}),l;d(`init`,`链表 ${n.map((e,t)=>i(t)).join(` → `)} 已经**排好序**，所以重复的元素一定挨在一起。目标是**把所有出现过的重复值都删干净**（一个都不留），`+(r===`keep-one`?`不过这次用阿里变体的规则：**重复过的值留下一个**。`:`这就是本题（LC 82）的要求，注意跟"只留一个"不是一回事。`)+" 先在头上架一个 `dummy` 哨兵 —— 头节点自己也可能是重复段的一员。",{prev:Ca,curr:0});let f=0;for(;f<n.length;){let e=o(f);if(e>1){let t=f,o=f+e,s=a(f);d(`dup-start`,`\`curr\` 在 ${i(f)}，它的值和下一个节点相同（都是 ${s}）——**发现一段重复，长度 ${e}**。\`prev\` 就此**停住不动**，因为一会儿要把整段一次摘掉，摘的动作得由 \`prev.next = curr\` 完成，prev 必须留在这一段的**前一个**位置。`,{prev:f-1<0?Ca:f-1,curr:f,dupStart:t,dupEnd:o});for(let e=t;e<o;e+=1){let n=e+1<o;d(`skip`,`\`curr\` 从 ${i(e)} 往前一格到 ${i(e+1)}（值都是 ${a(e)}）——`+(n?` 后面**还有同值的节点**，重复段没走完，继续往前。`:` 这一步跨出了重复段。`)+" 全程 **`prev` 一动没动** —— 它守在重复段前面的那个节点上，等着被接上。",{prev:f-1<0?Ca:f-1,curr:e+1,dupStart:t,dupEnd:o})}if(r===`keep-one`){let e=o-1;for(let n=t;n<e;n+=1)u.push(n);let n=Array.from({length:e-t},(e,n)=>t+n);d(`unlink`,`**阿里变体：留下一个。** 把重复段里的 ${t} 到 ${e-1} 号节点（值都是 ${s}）摘掉，只留最后一个 ${i(e)}。\`prev.next\` 指向 ${i(e)}。`,{prev:e,curr:o,dupStart:t,dupEnd:o,removedNow:n})}else{for(let e=t;e<o;e+=1)u.push(e);let r=Array.from({length:e},(e,n)=>t+n);d(`unlink`,`**整段摘掉。** \`prev.next = curr\` 一次接上 ${o<n.length?i(o):`∅`} —— 中间的 ${e} 个节点（值都是 ${s}）全被摘出链表，一个不留。这一步就是本题跟 LC 83 的分水岭：**LC 83 会留下一个，这里一个都不留。**`,{prev:f-1<0?Ca:f-1,curr:o,dupStart:t,dupEnd:o,removedNow:r})}f=o;let c=r===`keep-one`?o-1:f-1;f<n.length&&d(`advance`,`刚才那一段处理完了：\`prev\` 现在停在 ${i(c)}，\`curr\` 落在 ${i(f)}。**只有确定 curr 不再是重复段成员时，prev 才跟着前进。**`,{prev:c,curr:f});continue}d(`scan`,`\`curr\` 在 ${i(f)}，它的值（${a(f)}）跟下一个${f+1<n.length?`（${i(f+1)}）`:`（没有下一个了）`} 不相同 —— 这个节点不属于任何重复段，**安全保留**。于是 \`prev\` 也前进一格，跟 \`curr\` 挨着一起往右走。`,{prev:f-1<0?Ca:f-1,curr:f}),f+=1}let p=n.map((e,t)=>i(t)).join(` → `),m=s.map(e=>i(e)).join(` → `),h=c.length?c.map(e=>i(e)).join(`、`):`（无）`;return d(`done`,`\`curr\` 走到了 ∅，循环结束。返回 \`dummy.next\`。\n\n- 原链表：${p}\n- 结果：**${m||`（空）`}**\n- 被摘掉的节点：${h}\n\n`+(r===`keep-one`?`阿里变体的结果里，**重复过的值各留了一个**，没重复过的值原样保留。`:`**所有出现过的重复值都被删干净了** —— 这就是 LC 82 跟 LC 83 的区别。`)+" 全程只用了两根指针，额外空间 `O(1)`。",{prev:Ca,curr:n.length,done:!0}),l}var Ea=`rd2-styles`,Da=0,Oa=62,ka=48,Aa=38,ja=44,Ma=150,Na=174,Pa=58,Fa=24,Ia=Ma-62,La=264,Ra=Ma-34,za=8,Ba=46,Va=372,Ha=46,Ua=1150,Wa=`
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
`;function Ga(){if(X(),document.getElementById(Ea))return;let e=document.createElement(`style`);e.id=Ea,e.textContent=Wa,document.head.appendChild(e)}function Ka(e,t={}){if(!e||e.dataset.rd2Mounted===`1`)return{destroy(){}};e.dataset.rd2Mounted=`1`,Ga();let n=Ta(t),r=t.autoplay!==!1,i=Array.isArray(t.pool)&&t.pool.length?t.pool:[1,2,3,3,4,4,5],a=Array.isArray(t.path)?t.path:[0,1,2,3,4,5,6],o=t.mode===`keep-one`?`keep-one`:`remove-all`,s=a.length,c=s+1,l=e=>e<0?Da:e+1,u=e=>e-1,d=2*ja+c*Oa+(c-1)*Aa,f=e=>ja+e*100,p=e=>f(e)+Oa/2,m=d-Ha,h=document.createElement(`div`);h.className=`viz rd2`;let g=document.createElement(`div`);g.className=`viz__stage`,h.appendChild(g);let _=Y(`svg`,{class:`viz__svg rd2__svg`,viewBox:`0 0 ${d} 416`,role:`img`,"aria-label":`删除排序链表中重复元素的推演动画：${a.map(e=>i[e]).join(` → `)}`});g.appendChild(_);let v=Y(`g`,{class:`rd2-note`}),y=Y(`line`,{class:`rd2-note__line`}),b=Y(`text`,{class:`rd2-note__text`,x:d/2,y:Ba});v.append(y,b),_.appendChild(v),_.appendChild(Y(`circle`,{class:`rd2-null__ring`,cx:m,cy:Na,r:14}));let x=Y(`text`,{class:`rd2-null__text`,x:m,y:Na});x.textContent=`∅`,_.appendChild(x);let S=Y(`line`,{class:`rd2-lead rd2-lead--curr`}),C=Y(`line`,{class:`rd2-lead rd2-lead--prev`});_.append(S,C);let w=Y(`g`,{class:`rd2-edges`});_.appendChild(w);let T=[];function E(e){for(;T.length<=e;){let e=Y(`g`,{class:`rd2-edge`}),t=Y(`line`,{class:`rd2-edge__line`}),n=Y(`path`,{class:`rd2-edge__head`});e.append(t,n),w.appendChild(e),T.push({g:e,line:t,head:n})}return T[e]}function D(e,t,n){let r=f(t)+Oa+3,i=f(n),a=Na;e.line.setAttribute(`x1`,r),e.line.setAttribute(`y1`,a),e.line.setAttribute(`x2`,i-9),e.line.setAttribute(`y2`,a),e.head.setAttribute(`d`,`M ${i} ${a} L ${i-9} ${a-5.5} L ${i-9} 179.5 Z`)}function O(e,t){let n=f(t)+Oa+3,r=m-14,i=Na;e.line.setAttribute(`x1`,n),e.line.setAttribute(`y1`,i),e.line.setAttribute(`x2`,r-9),e.line.setAttribute(`y2`,i),e.head.setAttribute(`d`,`M ${r} ${i} L ${r-9} ${i-5.5} L ${r-9} 179.5 Z`)}let k=Y(`g`,{class:`rd2-arc`}),A=Y(`path`,{class:`rd2-arc__line`}),j=Y(`path`,{class:`rd2-arc__head`}),M=Y(`rect`,{class:`rd2-arc__tag-bg`,x:-66,y:-9,width:132,height:18,rx:6}),N=Y(`text`,{class:`rd2-arc__tag`,x:0,y:0});k.append(A,j,M,N),_.appendChild(k);let P=Y(`g`,{class:`rd2-dupframe`}),F=Y(`rect`,{class:`rd2-dupframe__box`,x:0,y:0,width:0,height:0,rx:14}),I=Y(`rect`,{class:`rd2-dupframe__tag-bg`,x:-50,y:-9,width:100,height:18,rx:6}),L=Y(`text`,{class:`rd2-dupframe__tag`,x:0,y:0});P.append(F,I,L),_.appendChild(P);let R=[];for(let e=0;e<c;e+=1){let t=Y(`g`,{class:`rd2-node${e===Da?` rd2-node--dummy`:``}`});t.appendChild(Y(`rect`,{class:`rd2-node__box`,x:f(e),y:Ma,width:Oa,height:ka,rx:9}));let n=Y(`text`,{class:`rd2-node__value`,x:p(e),y:Na});n.textContent=e===Da?`dummy`:String(i[a[u(e)]]),t.appendChild(n),_.appendChild(t),R.push(t)}function z(e,t){let n=Y(`g`,{class:`rd2-chip rd2-chip--${e}`});n.appendChild(Y(`rect`,{class:`rd2-chip__box`,x:-58/2,y:-24/2,width:Pa,height:Fa}));let r=Y(`text`,{class:`rd2-chip__text`,x:0,y:0});return r.textContent=t,n.appendChild(r),n}let B=z(`curr`,`curr`),V=z(`prev`,`prev`);_.append(B,V);let H=Y(`g`,{class:`rd2-verdict`}),U=Y(`rect`,{class:`rd2-verdict__box`,x:(d-264)/2,y:Va-18,width:264,height:36,rx:18}),ee=Y(`text`,{class:`rd2-verdict__text`,x:d/2,y:Va});H.append(U,ee),_.appendChild(H);let te=document.createElement(`p`);te.className=`viz__desc`,te.setAttribute(`aria-live`,`polite`),h.appendChild(te);let W=Q();h.appendChild(W.root),e.textContent=``,e.appendChild(h);let G=null,K=e=>e>=s?{x:m,onNull:!0}:{x:p(l(e)),onNull:!1};function ne(e){let t=new Set(e.removed),n=[];for(let e=0;e<s;e+=1)t.has(e)||n.push(e);let r=new Map,i=e.prev,a=e.curr;for(let e=0;e<n.length;e+=1){let t=n[e],i=e+1<n.length?n[e+1]:-1;r.set(l(t),i===-1?-1:l(i))}if(r.set(Da,n.length?l(n[0]):-1),i>=-1){let e=i===-1?Da:l(i),t=a>=s?-1:l(a);r.set(e,t)}for(let e of t)r.set(l(e),null);return r}function q(e){let t=(e.phase===`unlink`||e.phase===`advance`)&&e.removedNow.length>0;if(k.classList.toggle(`is-on`,t),!t)return;let n=e.prev===-1?Da:l(e.prev),r=e.curr>=s?null:l(e.curr);if(r===null)return;let i=f(n)+Oa,a=f(r);if(a<=i)return;let o=i+(a-i)*.28,c=i+(a-i)*.72;A.setAttribute(`d`,`M ${i+3} ${Na} C ${o} ${Na-58}, ${c} ${Na-58}, ${a-9} ${Na}`),j.setAttribute(`d`,`M ${a} ${Na} L ${a-9} ${Na-5.5} L ${a-9} 179.5 Z`);let u=(i+a)/2;M.setAttribute(`x`,u-66),M.setAttribute(`y`,Na-58-9),N.setAttribute(`x`,u),N.setAttribute(`y`,Na-58),N.textContent=`prev.next = curr`}function re(e,t){let n=new Set(t.removed),r=e=>t.dupStart!==null&&t.dupEnd!==null&&e>=t.dupStart&&e<t.dupEnd;for(let e=0;e<c;e+=1){if(e===Da){R[e].classList.toggle(`is-prev`,t.prev===-1),R[e].classList.toggle(`is-curr`,!1);continue}let i=u(e);R[e].classList.toggle(`is-cut`,n.has(i)),R[e].classList.toggle(`is-dup`,r(i)&&!n.has(i)),R[e].classList.toggle(`is-prev`,t.prev===i),R[e].classList.toggle(`is-curr`,t.curr===i)}let s=ne(t),d=0;for(let[e,t]of s){if(t===null)continue;let n=E(d);d+=1,n.g.classList.add(`is-on`),t===-1?O(n,e):D(n,e,t)}for(let e=d;e<T.length;e+=1)T[e].g.classList.remove(`is-on`);q(t);let m=t.dupStart!==null&&t.dupEnd!==null&&t.dupEnd>t.dupStart;if(P.classList.toggle(`is-on`,m),m){let e=l(t.dupStart),n=l(t.dupEnd-1);F.setAttribute(`x`,f(e)-za),F.setAttribute(`y`,Ma-za),F.setAttribute(`width`,f(n)+Oa-f(e)+za*2),F.setAttribute(`height`,64);let r=(f(e)+f(n)+Oa)/2,i=t.dupEnd-t.dupStart;L.textContent=`重复段 ${i} 个`,I.setAttribute(`x`,r-50),I.setAttribute(`y`,Ra-9),L.setAttribute(`x`,r),L.setAttribute(`y`,Ra)}let h=K(t.curr),g=t.prev===-1?Da:l(t.prev),_=p(g);if(B.setAttribute(`transform`,`translate(${h.x} ${Ia})`),V.setAttribute(`transform`,`translate(${_} ${La})`),B.style.opacity=`1`,V.style.opacity=`1`,S.setAttribute(`x1`,h.x),S.setAttribute(`x2`,h.x),S.setAttribute(`y1`,100),S.setAttribute(`y2`,Ma-2),C.setAttribute(`x1`,_),C.setAttribute(`x2`,_),C.setAttribute(`y1`,La-Fa/2),C.setAttribute(`y2`,200),m){let e=p(l(t.dupEnd-1));b.textContent=`curr 冲进重复段，prev 原地等 —— 错位就是这么来的`,y.setAttribute(`x1`,e),y.setAttribute(`x2`,e),y.setAttribute(`y1`,57),y.setAttribute(`y2`,Ra-12),v.style.opacity=`1`}else v.style.opacity=`0`;H.setAttribute(`class`,`rd2-verdict`);let x=`准备开始`;if(t.phase===`done`){H.classList.add(`is-ok`);let e=t.kept.map(e=>i[a[e]]).join(` → `);x=e?`✓ ${e||`空`}`:`✓ 全部被删，返回空链表`}else t.phase===`unlink`?(H.classList.add(`is-cut`),x=o===`keep-one`?`摘掉多余的，留一个`:`整段摘掉，一个不留`):t.phase===`dup-start`?x=`发现重复段`:t.phase===`skip`?x=`curr 在重复段里往前冲…`:t.phase===`scan`||t.phase===`advance`?x=`两个指针一起前进`:t.phase===`init`&&(x=`架好 dummy 与 prev / curr`);ee.textContent=x,Z(te,t.desc)}let ie=$({steps:n,controls:W,intervalMs:Ua,onRender:re});ie.jumpTo(Math.trunc(t.initialStep)||0);let ae=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!ae&&typeof IntersectionObserver==`function`&&(G=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){G.disconnect(),G=null,ie.play();return}},{threshold:.35}),G.observe(h)),{destroy(){G&&=(G.disconnect(),null),ie.destroy(),e.textContent=``,delete e.dataset.rd2Mounted,document.getElementById(Ea)?.remove()}}}function qa(e){let t=Array.isArray(e)?e:[],n=[];if(t.length===0||t[0]===null||t[0]===void 0)return{nodes:n,root:-1};let r=new Map,i=[];for(let e=0;e<t.length;e+=1)t[e]===null||t[e]===void 0||(r.set(e,n.length),i.push(e),n.push({id:n.length,value:t[e],left:null,right:null,parent:-1,side:null,depth:0,col:0}));if(n.length===0)return{nodes:n,root:-1};for(let e of n){let a=i[e.id];for(let[i,o]of[[1,`L`],[2,`R`]]){let s=2*a+i;if(s>=t.length)continue;let c=r.get(s);c!==void 0&&(n[c].parent=e.id,n[c].side=o,n[c].depth=e.depth+1,o===`L`?e.left=c:e.right=c)}}let a=new Map;for(let e of n)a.has(e.depth)||a.set(e.depth,[]),a.get(e.depth).push(e.id);for(let e of a.values())e.sort((e,t)=>e-t),e.forEach((e,t)=>{n[e].col=t});return{nodes:n,root:0}}function Ja(e={}){let t=Array.isArray(e.values)?e.values:[3,9,20,null,null,15,7],n=e.mode===`zigzag`?`zigzag`:`plain`,{nodes:r,root:i}=qa(t),a=e=>r[e].value,o=[],s=[],c=[],l=[],u=(e,t,r={})=>c.push({phase:e,desc:t,queue:[...l],levelIndex:-1,levelSize:0,consumed:0,current:null,enqueued:[],levelValues:[],results:o.map(e=>[...e]),rightView:[...s],mode:n,zigzagReversed:!1,done:!1,...r});if(i===-1)return u(`done`,"树是空的（`root` 是 `null`）—— 没有任何节点，直接返回空数组 `[]`。",{done:!0}),c;u(`init`,'把根节点 `3` 入队。**队列是 BFS 的全部内存** —— 它是一个"待处理却还没轮到"的缓冲区，而且天然按层排队：同一层的节点一定挨在一起，且比下一层先出队。 这正是层序遍历能"分层输出"的物理基础。',{enqueued:[i]}),l.push(i);let d=0;for(;l.length>0;){let e=l.length,t=n===`zigzag`&&d%2==1,i=[],c=e=>{t?i.unshift(e):i.push(e)};u(`enter`,`**进第 ${d} 层之前，先做一件最关键的事：把当前队列长度存下来。** 此刻队列里是 \`[${l.map(a).join(`, `)}]\`，所以 \`size = ${e}\` —— 这 ${e} 个节点就是第 ${d} 层的**全部成员**。 为什么要存：接下来的内层循环会一边出队、一边把左右孩子入队，队列长度是**一直在变的**。如果拿实时长度当循环条件，下一层的节点会立刻被卷进来，层就分不开了。`+(t?` 这是锯齿变体的奇数层 —— 顺序要**反过来**，所以这一层的值用头插收集。`:``),{levelIndex:d,levelSize:e,levelValues:[...i],zigzagReversed:t});for(let n=0;n<e;n+=1){let o=l.shift(),s=r[o],f=[];if(s.left!==void 0&&s.left!==null&&f.push(s.left),s.right!==void 0&&s.right!==null&&f.push(s.right),c(s.value),u(`consume`,`出队第 ${n+1} / ${e} 个节点：\`${s.value}\`。 把它记进第 ${d} 层的结果里`+(t?`（头插到前面，因为这一层要从右往左）`:``)+(f.length?`。 它有两个孩子要处理：${f.map(e=>`\`${a(e)}\``).join(` 和 `)} —— 下面一步入队。`:`。 它是叶子节点，没有孩子要入队 —— 队列少了一个、没补上。`)+` 已出队 ${n+1} 个，这一层还剩 ${e-n-1} 个，**出队的次数由进层时那个 \`size\` 决定，跟此刻队列多长无关。**`,{levelIndex:d,levelSize:e,consumed:n+1,current:o,levelValues:[...i],zigzagReversed:t}),f.length){for(let e of f)l.push(e);u(`enqueue`,`把 \`${s.value}\` 的${f.map(e=>` \`${a(e)}\``).join(` 和`)} 入队。**注意它们排到了队尾** —— 在同层还没处理完的节点后面，也就是第 ${d+1} 层的位置。 队列"同层在前、下层在后"的次序，就是分层这件事的全部玄机。`,{levelIndex:d,levelSize:e,consumed:n+1,current:o,enqueued:f,levelValues:[...i],zigzagReversed:t})}}o.push([...i]),s.push(i[i.length-1]),u(`close`,`第 ${d} 层的 ${e} 个节点全部出队，收工。 这一层的结果是 \`[${i.join(`, `)}]\``+(t?`（已按锯齿要求从右往左）`:``)+`。 此刻队列里是 \`[${l.map(a).join(`, `)}]\` —— `+(l.length?`正好是第 ${d+1} 层，下一轮的 \`size\` 就会等于 ${l.length}。`:`空了。`)+(n===`zigzag`?` 下一层的收集方向要**反过来**（锯齿的本质：只改值的方向，不改队列的方向）。`:``),{levelIndex:d,levelSize:e,consumed:e,levelValues:[...i],zigzagReversed:t}),d+=1}return u(`done`,`队列空了，遍历结束。返回 \`[${o.map(e=>`[${e.join(`, `)}]`).join(`, `)}]\`。\n\n- 一共 ${o.length} 层\n- 每层的节点数：${o.map(e=>e.length).join(`、`)}\n- 锯齿变体的结果：\`[${o.map((e,t)=>`[${(n===`zigzag`?e:t%2==1?[...e].reverse():e).join(`, `)}]`).join(`, `)}]\`\n- 右视图（每层最后一个）：\`[${s.join(`, `)}]\`\n\n**每个节点恰好入队一次、出队一次**，所以整个遍历是线性时间；队列里最多压着一层多的节点（最宽的那层 + 它的孩子），空间是 \`O(n)\`。`,{levelIndex:d,done:!0,levelValues:o[o.length-1]??[]}),c}var Ya=`lvo-styles`,Xa=22,Za=84,Qa=66,$a=56,eo=54,to=40,no=110,ro=30,io=1150,ao=`
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
`;function oo(){if(X(),document.getElementById(Ya))return;let e=document.createElement(`style`);e.id=Ya,e.textContent=ao,document.head.appendChild(e)}function so(e,t={}){if(!e||e.dataset.lvoMounted===`1`)return{destroy(){}};e.dataset.lvoMounted=`1`,oo();let n=Ja(t),r=t.autoplay!==!1,{nodes:i,root:a}=qa(Array.isArray(t.values)?t.values:[3,9,20,null,null,15,7]),o=e=>i[e].value,s=i.reduce((e,t)=>Math.max(e,t.depth),0),c=new Map;c.set(a,[]);for(let e of i)e.parent!==-1&&c.set(e.id,[...c.get(e.parent)??[],e.side]);let l=e=>56*2**Math.max(0,s-e),u=e=>{let t=0;for(let n of c.get(e.id)??[])t=t*2+ +(n===`R`);return(t+.5)*l(e.depth)},d=2**s*56,f=Math.max(620,96+d+80),p=(f-d)/2,m=Qa+s*Za+Xa+$a,h=m+81+34,g=h+Math.max(1,s+1)*22+18,_=e=>{let t=i[e];return{x:p+u(t),y:Qa+t.depth*Za}},v=e=>Qa+e*Za,y=Math.max(1,...n.map(e=>e.queue.length),...n.map(e=>e.queue.length+e.enqueued.length)),b=e=>no+e*64,x=document.createElement(`div`);x.className=`viz lvo`;let S=document.createElement(`div`);S.className=`viz__stage`,x.appendChild(S);let C=Y(`svg`,{class:`viz__svg lvo__svg`,viewBox:`0 0 ${f} ${g}`,role:`img`,"aria-label":`层序遍历推演动画`});if(S.appendChild(C),a===-1){let t=Y(`text`,{class:`lvo-empty__text`,x:f/2,y:g/2});return t.textContent=`空树 —— 直接返回 []`,C.appendChild(t),x.appendChild(w()),x.appendChild(Q().root),e.textContent=``,e.appendChild(x),{destroy(){e.textContent=``,delete e.dataset.lvoMounted,document.getElementById(Ya)?.remove()}}}function w(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let T=[];for(let e=0;e<=s;e+=1){let t=v(e),n=Y(`line`,{class:`lvo-layer__line`,x1:62,y1:t,x2:p+d+14,y2:t}),r=Y(`text`,{class:`lvo-layer__text`,x:56,y:t});r.textContent=`第 ${e} 层`,C.append(n,r),T.push({line:n,t:r})}let E=Y(`g`,{class:`lvo-edges`});C.appendChild(E);for(let e of i)for(let t of[e.left,e.right]){if(t==null)continue;let n=_(e.id),r=_(t),i=Y(`line`,{class:`lvo-edge__line`,x1:n.x,y1:n.y+Xa,x2:r.x,y2:r.y-Xa});E.appendChild(i)}let D=new Map;for(let e of i){let t=_(e.id),n=Y(`g`,{class:`lvo-node`});n.setAttribute(`transform`,`translate(${t.x} ${t.y})`),n.appendChild(Y(`circle`,{class:`lvo-node__circle`,cx:0,cy:0,r:Xa}));let r=Y(`text`,{class:`lvo-node__value`,x:0,y:0});r.textContent=String(e.value),n.appendChild(r),C.appendChild(n),D.set(e.id,n)}let O=Y(`text`,{class:`lvo-q__label`,x:ro,y:m+5});O.textContent=`queue`,C.appendChild(O);let k=[];for(let e=0;e<y;e+=1){let t=Y(`g`,{class:`lvo-q__cell-g`});t.setAttribute(`transform`,`translate(${b(e)} ${m-to/2})`);let n=Y(`rect`,{class:`lvo-q__cell`,x:0,y:0,width:eo,height:to,rx:8}),r=Y(`text`,{class:`lvo-q__value`,x:eo/2,y:to/2});t.append(n,r),C.appendChild(t),k.push({g:t,rect:n,t:r})}let A=Y(`line`,{class:`lvo-q__headline`}),j=Y(`text`,{class:`lvo-q__head`});j.textContent=`head`,C.append(A,j);let M=Y(`g`,{class:`lvo-brace`}),N=Y(`path`,{class:`lvo-brace__line`}),P=Y(`text`,{class:`lvo-brace__text`});M.append(N,P),C.appendChild(M);let F=Y(`text`,{class:`lvo-res__title`,x:ro,y:h});F.textContent=`res`,C.appendChild(F);let I=[];for(let e=0;e<Math.max(1,s+1);e+=1){let t=Y(`text`,{class:`lvo-res__text`,x:no,y:h+e*22});C.appendChild(t),I.push(t)}let L=w();x.appendChild(L);let R=Q();x.appendChild(R.root),e.textContent=``,e.appendChild(x);let z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;function B(e,t){let n=new Set(t.queue),r=new Set(t.enqueued),a=Math.max(0,t.levelSize-t.consumed);for(let[e,a]of D){let o=i[e],s=t.current===e,c=r.has(e),l=t.levelIndex>=0&&o.depth<t.levelIndex&&!s,u=t.levelIndex>=0&&o.depth===t.levelIndex&&n.has(e)&&!c&&!s;a.classList.toggle(`is-done`,l),a.classList.toggle(`is-current`,s),a.classList.toggle(`is-pending`,u),a.classList.toggle(`is-fresh`,c)}if(T.forEach(({line:e,t:n},r)=>{let i=r===t.levelIndex;e.classList.toggle(`is-active`,i),n.classList.toggle(`is-active`,i)}),k.forEach((e,n)=>{let i=t.queue[n];if(i===void 0){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`,e.t.textContent=String(o(i));let s=r.has(i),c=t.levelIndex>=0&&t.phase!==`init`,l=c&&!s&&n>=a;e.rect.setAttribute(`class`,`lvo-q__cell${s?` is-fresh`:c?` is-layer`:``}${l?` is-out`:``}`),e.t.setAttribute(`class`,`lvo-q__value${s||c?` is-layer`:``}${l?` is-out`:``}`)}),t.queue.length){let e=b(0)+eo/2;A.setAttribute(`x1`,e),A.setAttribute(`x2`,e),A.setAttribute(`y1`,m+34),A.setAttribute(`y2`,m+42),j.setAttribute(`x`,e),j.setAttribute(`y`,m+48),A.style.opacity=`1`,j.style.opacity=`1`}else A.style.opacity=`0`,j.style.opacity=`0`;if(t.levelIndex>=0&&t.levelSize>0&&t.phase!==`init`){let e=b(0)-5,n=b(t.levelSize-1)+eo+5,r=m+68;N.setAttribute(`d`,`M ${e} ${r-7} L ${e} ${r} L ${n} ${r} L ${n} ${r-7}`),P.setAttribute(`x`,(e+n)/2),P.setAttribute(`y`,m+81),P.textContent=`这一层 size = ${t.levelSize}`,M.classList.add(`is-on`)}else M.classList.remove(`is-on`);I.forEach((e,n)=>{let r=t.results[n];if(!r){e.textContent=``,e.setAttribute(`class`,`lvo-res__text`);return}e.textContent=`[${r.join(`, `)}]`;let i=n===t.levelIndex&&t.phase===`close`;e.setAttribute(`class`,`lvo-res__text${i?` is-done`:` is-active`}`)}),Z(L,t.desc)}let V=$({steps:n,controls:R,intervalMs:io,onRender:B});V.jumpTo(Math.trunc(t.initialStep)||0);let H=null;return r&&!z&&typeof IntersectionObserver==`function`&&(H=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){H.disconnect(),H=null,V.play();return}},{threshold:.35}),H.observe(x)),{destroy(){H&&=(H.disconnect(),null),V.destroy(),e.textContent=``,delete e.dataset.lvoMounted,document.getElementById(Ya)?.remove()}}}function co(e={}){let{nodes:t,root:n}=qa(Array.isArray(e.values)?e.values:[3,5,1,6,2,0,8,null,null,7,4]);if(n===-1)return[{phase:`done`,desc:"**空树**，直接返回 `null`。",stack:[],current:null,returning:null,returnSource:`null`,memo:{},leftOf:{},rightOf:{},depth:-1,maxDepth:0,found:[],answer:null,done:!0}];let r=e=>e==null?null:t[e].value,i=new Map;for(let e of t)i.set(e.value,e.id);let a=e.p===void 0||e.p===null?i.get(6):i.get(e.p),o=e.q===void 0||e.q===null?i.get(4):i.get(e.q),s=Number.isInteger(e.maxFrames)?e.maxFrames:400,c=[],l={},u={},d={},f=[],p=null,m=0,h=0,g=e=>{if(e==null)return`null`;let t=r(e);return e===a?`${t}（p）`:e===o?`${t}（q）`:String(t)},_=e=>e==null?"`null`（这棵子树里一个都没找到）":e===a?`\`${r(e)}\` —— **这是 p 本身，向上当成"p 在这里"的标记**（它不是答案，只是信使）`:e===o?`\`${r(e)}\` —— **这是 q 本身，向上当成"q 在这里"的标记**`:`\`${r(e)}\` —— **这就是答案（LCA），继续向上冒就行了**`,v=(e,t,n={})=>{c.push({phase:e,desc:t,stack:y.map(e=>({id:e.id,stage:e.stage})),current:null,returning:null,returnSource:`null`,memo:{...l},leftOf:{...u},rightOf:{...d},depth:y.length-1,maxDepth:m,found:[...f],answer:p,done:e===`done`,...n})},y=[];for(v(`init`,`要找 \`${g(a)}\` 和 \`${g(o)}\` 的最近公共祖先。**用一个显式栈模拟递归**：每次调用 \`dfs(node)\` 就压栈，返回就出栈。栈底是根 \`${r(n)}\`，栈越深说明递归钻得越深。`,{current:n}),y.push({id:n,stage:`enter`,from:null});y.length>0&&(h+=1,!(h>s));){let e=y[y.length-1],n=t[e.id];if(m=Math.max(m,y.length-1),e.stage===`enter`){if(e.id===a||e.id===o){let t=e.id===a;l[e.id]=e.id,f.includes(e.id)||f.push(e.id),v(`hit`,`进入 \`${g(e.id)}\` —— **命中！**这就是 \`node is p or node is q\` 那一行。**命中就立刻返回，不再往下探它的子树**：如果另一个目标在它的子树里，那它自己就是答案（"一个节点也可以是它自己的祖先"）；如果不在，它也只是个"我在这儿"的标记。两种情况都只需要把**它自己**往上报。`,{current:e.id,returning:e.id,returnSource:t?`p`:`q`});let n=e.id;y.pop(),S(e,n);continue}if(n.left===null&&n.right===null){l[e.id]=null,v(`return`,`进入 \`${r(e.id)}\` —— **叶子节点，而且不是 p 也不是 q**。它的子树是空的，一个目标都没有，所以向父节点汇报 \`null\`。`,{current:e.id,returning:null,returnSource:`null`}),y.pop(),S(e,null);continue}if(n.left!==null){v(`recurse`,`进入 \`${r(e.id)}\` —— 它不是 p 也不是 q，**不能立刻下结论**，必须先把左右两棵子树都问一遍（这就是"后序"的含义）。先向左子树 \`${r(n.left)}\` 递归。`,{current:e.id}),e.stage=`left`,y.push({id:n.left,stage:`enter`,from:`L`});continue}v(`recurse`,`进入 \`${r(e.id)}\` —— 它不是 p 也不是 q，**必须先问子树**。它没有左孩子，直接转向右子树 \`${r(n.right)}\` 递归。`,{current:e.id}),u[e.id]=null,e.stage=`right`,y.push({id:n.right,stage:`enter`,from:`R`});continue}if(e.stage===`left`){if(n.right!==null){v(`recurse`,`\`${r(e.id)}\` 的左子树回来了，返回值是 ${_(u[e.id])}。**先把它记在手边，接着向右子树 \`${r(n.right)}\` 递归** —— 两边都问完，才能判断自己是不是那个分叉点。`,{current:e.id,returning:u[e.id]}),e.stage=`right`,y.push({id:n.right,stage:`enter`,from:`R`});continue}d[e.id]=null,e.stage=`decide`;continue}if(e.stage===`right`){e.stage=`decide`;continue}let i=u[e.id]===void 0?null:u[e.id],s=d[e.id]===void 0?null:d[e.id];v(`collect`,`\`${r(e.id)}\` 的左右子树都回来了：左 = ${_(i)}，右 = ${_(s)}。**现在到做判断的时候了。**`,{current:e.id});let c;if(i!==null&&s!==null)c=e.id,l[e.id]=e.id,p===null&&(p=e.id),v(`decide`,`**左右都非空 —— 两个目标刚好在 \`${r(e.id)}\` 这里分叉！**这是全树唯一一个"左边有一个、右边有一个"的节点，所以它就是最近公共祖先：返回自己 \`${r(e.id)}\`。（再往上的祖先虽然也同时包含 p 和 q，但都不是"最近"的了。）`,{current:e.id,returning:e.id,returnSource:`lca`});else if(i!==null||s!==null){c=i===null?s:i,l[e.id]=c;let t=p!==null&&c===p;v(`decide`,t?`只有一个非空（${i===null?`右`:`左`}边是 ${_(c)}），**这就是已经确定的答案，继续往上冒**。\`${r(e.id)}\` 只是路过，它虽然也同时是 p 和 q 的祖先，但不是"最近"的那个。`:`只有一个非空（${i===null?`右`:`左`}边是 ${_(c)}），说明两个目标**都在同一侧子树里**，\`${r(e.id)}\` 不是分叉点。如实把这唯一的返回值往上报 —— 这里**不改变它**，只负责传递。`,{current:e.id,returning:c,returnSource:t?`lca`:c===a?`p`:`q`})}else c=null,l[e.id]=null,v(`decide`,'左右都是 `null` —— 这棵子树里 p 和 q 一个都没有，向上汇报 `null`。父节点收到它，等于"这条分支可以忽略了"。',{current:e.id,returning:null,returnSource:`null`});y.pop(),S(e,c)}let b=l[n];p===null&&b!=null&&(p=b);let x=p===null?n:p;v(`done`,p===null?`递归结束，栈空了。**返回值一路冒到根，但没有任何节点出现"左右都非空"** —— 说明 p 和 q 不在一棵树上（在本题约束下不会发生）。`:`递归结束，栈空了。最终从根 \`${r(n)}\` 冒出来的返回值是 \`${r(x)}\`，它就是 \`${g(a)}\` 和 \`${g(o)}\` 的**最近公共祖先**。`,{current:x,returning:x,returnSource:`lca`,done:!0});function S(e,t){if(e.from===null)return;let n=y[y.length-1];n&&(e.from===`L`?u[n.id]=t:d[n.id]=t)}return c}var lo=`lca-styles`,uo=24,fo=82,po=62,mo=58,ho=26,go=44,_o=30,vo=214,yo=1250,bo=`
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
`;function xo(){if(document.getElementById(lo))return;let e=document.createElement(`style`);e.id=lo,e.textContent=bo,document.head.appendChild(e)}function So(e,t={}){if(!e||e.dataset.lcaMounted===`1`)return{destroy(){}};e.dataset.lcaMounted=`1`,xo();let n=co(t),r=t.autoplay!==!1,{nodes:i,root:a}=qa(Array.isArray(t.values)?t.values:[3,5,1,6,2,0,8,null,null,7,4]),o=e=>e==null||!i[e]?null:i[e].value,s=Y,c=document.createElement(`div`);c.className=`viz lca`;let l=document.createElement(`div`);if(l.className=`viz__stage`,c.appendChild(l),a===-1){let t=s(`svg`,{class:`viz__svg lca__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`lca-empty__text`,x:620/2,y:120/2});return n.textContent=`空树 —— 直接返回 null`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),{destroy(){e.textContent=``,delete e.dataset.lcaMounted,document.getElementById(lo)?.remove()}}}function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let d=i.reduce((e,t)=>Math.max(e,t.depth),0),f=new Map;f.set(a,[]);for(let e of i)e.parent!==-1&&f.set(e.id,[...f.get(e.parent)??[],e.side]);let p=e=>mo*2**Math.max(0,d-e),m=e=>{let t=0;for(let n of f.get(e.id)??[])t=t*2+ +(n===`R`);return(t+.5)*p(e.depth)},h=2**d*mo,g=Math.max(660,ho+h+68),_=(g-h)/2,v=e=>po+e*fo,y=e=>({x:_+m(i[e]),y:v(i[e].depth)}),b=po+d*fo+uo,x=Math.max(1,...n.map(e=>e.stack.length)),S=b+go,C=S+x*40,w=C+22,T=w+34+26,E=ho,D=vo,O=s(`svg`,{class:`viz__svg lca__svg`,viewBox:`0 0 ${g} ${T}`,role:`img`,"aria-label":`最近公共祖先推演动画`});l.appendChild(O);let k=new Map;for(let e of i){if(e.parent===-1)continue;let t=y(e.parent),n=y(e.id),r=s(`path`,{class:`lca-edge`,d:`M ${t.x} ${t.y+uo} L ${n.x} ${n.y-uo}`});O.appendChild(r),k.set(e.id,r)}let A=[];for(let e of i){let t=y(e.id),n=s(`g`,{class:`lca-node`,transform:`translate(${t.x} ${t.y})`});n.appendChild(s(`circle`,{class:`lca-node__ring`,r:31})),n.appendChild(s(`circle`,{class:`lca-node__circle`,cx:0,cy:0,r:uo}));let r=s(`text`,{class:`lca-node__value`,x:0,y:0});r.textContent=String(e.value),n.appendChild(r);let i=s(`g`,{class:`lca-node__retg`});i.appendChild(s(`rect`,{class:`lca-node__ret`,x:-26,y:-48,width:52,height:20,rx:6}));let a=s(`text`,{class:`lca-node__ret-text`,x:0,y:-38});i.appendChild(a),n.appendChild(i);let o=s(`text`,{class:`lca-node__tag`,x:0,y:39});n.appendChild(o),O.appendChild(n),A.push({g:n,retG:i,rt:a,tag:o,id:e.id})}let j=s(`text`,{class:`lca-stack__title`,x:E,y:S-12});j.textContent=`调用栈（栈底在下）`,O.appendChild(j);let M=[];for(let e=0;e<x;e+=1){let t=s(`g`,{class:`lca-frame`,transform:`translate(${E} ${C-(e+1)*40})`});t.appendChild(s(`rect`,{class:`lca-frame__box`,x:0,y:0,width:D,height:_o,rx:7}));let n=s(`text`,{class:`lca-frame__text`,x:12,y:_o/2});t.appendChild(n),O.appendChild(t),M.push({g:t,t:n})}let N=s(`rect`,{class:`lca-flow__box`,x:E,y:w,width:Math.min(560,g-E-24),height:34,rx:8});O.appendChild(N);let P=s(`text`,{class:`lca-flow__text`,x:E+Math.min(560,g-E-24)/2,y:w+34/2});O.appendChild(P);let F=u(),I=(e,t)=>Object.prototype.hasOwnProperty.call(e.memo,t);function L(e,t){if(!t)return;let n=t.stack.length?t.stack[t.stack.length-1].id:null;t.current;let r=new Set(t.stack.map(e=>e.id));for(let e of A){let{id:r,g:i,retG:a,rt:s,tag:c}=e,l=[`lca-node`];Array.isArray(t.found)&&t.found.includes(r)&&l.push(`is-target`);let u=I(t,r),d=u?t.memo[r]:void 0;u&&d===null?l.push(`is-prune`):u&&d!==null&&l.push(`is-found`),r===n&&l.push(`is-visit`),r===t.answer&&l.push(`is-answer`),i.setAttribute(`class`,l.join(` `)),u?(a.style.opacity=`1`,s.textContent=d===null?`null`:`${o(d)}`,s.setAttribute(`class`,`lca-node__ret-text`)):a.style.opacity=`0`;let f=r===t.pId,p=r===t.qId;c.textContent=f&&p?`=p=q`:f?`p`:p?`q`:``,c.style.opacity=f||p?`1`:`0`}for(let e of i){if(e.parent===-1)continue;let n=k.get(e.id),i=[`lca-edge`];r.has(e.id)&&r.has(e.parent)&&i.push(`is-active`),I(t,e.id)&&t.memo[e.id]===null&&i.push(`is-prune`),n.setAttribute(`class`,i.join(` `))}if(M.forEach((e,n)=>{let r=t.stack[n];if(!r){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`;let i=n===t.stack.length-1;e.g.setAttribute(`class`,`lca-frame${i?` is-top`:``}`);let a=r.stage===`enter`?`刚进入`:r.stage===`left`?`等右子树`:r.stage===`right`?`等返回值`:`做判断`;e.t.textContent=`${n} · dfs(${o(r.id)}) · ${a}`}),t.phase===`hit`||t.phase===`decide`||t.phase===`return`||t.phase===`done`){N.style.opacity=`1`,P.style.opacity=`1`;let e=t.returning;t.returnSource===`null`?P.textContent=t.phase===`done`?`递归结束：返回 null`:`返回 null（子树里什么都没找到）`:t.phase===`done`?P.textContent=`最终答案：${o(e)}`:t.returnSource===`lca`?P.textContent=`返回自己 ${o(e)}（这里就是分叉点）`:P.textContent=`向上返回 ${o(e)}（标记：${t.returnSource} 在这里）`}else N.style.opacity=`0.25`,P.style.opacity=`0.35`,P.textContent=`（这一帧还没有返回值）`;Z(F,t.desc)}c.appendChild(F);let R=Q();c.appendChild(R.root);let z=new Map;for(let e of i)z.set(e.value,e.id);let B=t.p===void 0||t.p===null?6:t.p,V=t.q===void 0||t.q===null?4:t.q,H=z.get(B),U=z.get(V),ee=n.map(e=>({...e,pId:H,qId:U}));e.textContent=``,e.appendChild(c),X();let te=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,W=$({steps:ee,controls:R,intervalMs:yo,onRender:L});W.jumpTo(Math.trunc(t.initialStep)||0);let G=null;return r&&!te&&typeof IntersectionObserver==`function`&&(G=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){G.disconnect(),G=null,W.play();return}},{threshold:.35}),G.observe(c)),{destroy(){G&&=(G.disconnect(),null),W.destroy(),e.textContent=``,delete e.dataset.lcaMounted,document.getElementById(lo)?.remove()}}}function Co(e={}){let{nodes:t,root:n}=qa(Array.isArray(e.values)?e.values:[-10,9,20,null,null,15,7]);if(n===-1)return[{phase:`done`,desc:`**空树** —— 题目保证路径至少包含一个节点，空树不在输入范围内。`,stack:[],current:null,leftGain:null,rightGain:null,rawLeft:null,rawRight:null,through:null,gain:null,gainOf:{},best:-1/0,bestNode:null,bestPath:[],depth:-1,maxDepth:0,pruned:[],done:!0}];let r=e=>e==null||t[e]===void 0?null:t[e].value,i=Number.isInteger(e.maxFrames)?e.maxFrames:400,a=[],o={},s={},c=[],l=-1/0,u=null,d=[],f=0,p=0,m=e=>{let n=e=>{let n=[],r=e;for(;r!=null&&t[r]!==void 0;){n.push(r);let e=t[r],i=e.left===null?null:s[e.left]??null,a=e.right===null?null:s[e.right]??null,o=i!==null&&i>0,c=a!==null&&a>0;if(!o&&!c)break;r=o&&c?i>=a?e.left:e.right:o?e.left:e.right}return n},r=t[e];if(!r)return[];let i=r.left===null||!((s[r.left]??0)>0)?[]:n(r.left),a=r.right===null||!((s[r.right]??0)>0)?[]:n(r.right);return[...i.reverse(),e,...a]},h=(e,t,n={})=>{a.push({phase:e,desc:t,stack:g.map(e=>({id:e.id,stage:e.stage})),current:null,leftGain:null,rightGain:null,rawLeft:null,rawRight:null,through:null,gain:null,gainOf:{...o},best:l,bestNode:u,bestPath:[...d],depth:g.length-1,maxDepth:f,pruned:[...c],done:e===`done`,...n})},g=[];for(h(`init`,`要找**最大路径和**。关键是要同时算两个不同的东西：① **向上汇报的单边贡献值** \`gain = val + max(左, 右)\`（一条胳膊，给父节点继续接）；② **以本节点为拱顶的完整路径** \`through = val + 左 + 右\`（两条胳膊，到此为止）来更新全局最优。**路径不能拐两次弯**，所以向上汇报时只能选一条胳膊 —— 这是本题全部难度的来源。另外 \`max(gain, 0)\` 会剪掉负贡献：负的胳膊接进来只会让和变小。栈底是根 \`${r(n)}\`。`,{current:n}),g.push({id:n,stage:`enter`,from:null});g.length>0&&(p+=1,!(p>i));){let e=g[g.length-1],n=t[e.id];if(f=Math.max(f,g.length-1),e.stage===`enter`){if(n.left===null&&n.right===null){o[e.id]=n.value,s[e.id]=n.value;let t=n.value,i=!1;t>l&&(l=t,u=e.id,d=m(e.id),i=!0),h(i?`update`:`leaf`,`进入 \`${r(e.id)}\` —— **叶子节点**，左右子树都不存在，两边贡献都是 \`0\`。所以以它为拱顶的路径和就是它自己：\`${t}\`；向上汇报的贡献值也是 \`${t}\`。`+(i?`**刷新了全局最优** → \`best = ${l}\`。`:`没超过当前的 \`best = ${l}\`，保持不动。`),{current:e.id,leftGain:0,rightGain:0,rawLeft:null,rawRight:null,through:t,gain:t}),g.pop();continue}if(n.left!==null){h(`recurse`,`进入 \`${r(e.id)}\` —— 它 **不能立刻下结论**：拱顶路径和要用到左右两边的贡献，所以必须**先把两棵子树都问一遍**（后序）。先向左子树 \`${r(n.left)}\` 递归。`,{current:e.id}),e.stage=`left`,g.push({id:n.left,stage:`enter`,from:`L`});continue}h(`recurse`,`进入 \`${r(e.id)}\` —— 它没有左孩子（左边贡献直接记 \`0\`），直接向右子树 \`${r(n.right)}\` 递归。`,{current:e.id}),e.stage=`right`,g.push({id:n.right,stage:`enter`,from:`R`});continue}if(e.stage===`left`){if(n.right!==null){let t=s[n.left],i=Math.max(t,0);h(`recurse`,`\`${r(e.id)}\` 的左子树回来了，原始返回值是 \`${t}\`。`+(t<0?`**它是负的 —— 剪掉！** \`max(${t}, 0) = 0\`，意思就是"这条路走进去只会更小，干脆不进去"。`:`它是非负的，保留：\`max(${t}, 0) = ${i}\`。`)+` 把左贡献 \`${i}\` 记在手边，接着向右子树 \`${r(n.right)}\` 递归。`,{current:e.id,leftGain:i,rawLeft:t}),e.stage=`right`,g.push({id:n.right,stage:`enter`,from:`R`});continue}e.stage=`decide`;continue}if(e.stage===`right`){e.stage=`decide`;continue}let i=n.left===null?null:s[n.left],a=n.right===null?null:s[n.right],p=Math.max(i===null?0:i,0),_=Math.max(a===null?0:a,0);h(`collect`,`\`${r(e.id)}\` 的左右子树都回来了：左 = \`${i===null?`（无）`:i}\` → 取 \`max(·, 0) = ${p}\`，右 = \`${a===null?`（无）`:a}\` → 取 \`max(·, 0) = ${_}\`。**现在要同时算两个量，别搞混。**`,{current:e.id,leftGain:p,rightGain:_,rawLeft:i,rawRight:a});let v=n.value+p+_,y=n.value+Math.max(p,_);o[e.id]=y,s[e.id]=y,i!==null&&i<0&&n.left!==null&&!c.includes(n.left)&&c.push(n.left),a!==null&&a<0&&n.right!==null&&!c.includes(n.right)&&c.push(n.right);let b=v>l;b&&(l=v,u=e.id,d=m(e.id));let x=i!==null&&i<0&&a!==null&&a<0?`两条胳膊都是负的、全被剪了`:i!==null&&i<0?`左胳膊是负的被剪了`:a!==null&&a<0?`右胳膊是负的被剪了`:`两条胳膊都留着`;h(b?`update`:`decide`,`**算拱顶路径（可以拐弯，两条胳膊都用）**：\`${r(e.id)} + ${p} + ${_} = ${v}\`（${x}）。`+(b?` **刷新了全局最优！** \`best\` 从 \`${l===v?`（旧值更小）`:``}\`更新为 \`${v}\` —— 这条路径以 \`${r(e.id)}\` 为最高点，不再往上接。`:` 没超过当前的 \`best = ${l}\`，保持不动。`)+` 同时**算向上汇报的贡献值（只能选一条胳膊）**：\`${r(e.id)} + max(${p}, ${_}) = ${y}\` —— 这个值交给父节点，父节点会在它那里再拐一次弯；如果这里两条胳膊都用掉，父节点再拐就**拐两次弯**了，不是一条路径。`,{current:e.id,leftGain:p,rightGain:_,rawLeft:i,rawRight:a,through:v,gain:y}),g.pop()}return h(`done`,`递归结束，栈空了。全局最优 **\`best = ${l}\`**，对应的路径以 \`${r(u)}\` 为最高点：\`${d.map(e=>r(e)).join(` → `)}\`。注意**它完全不经过根 \`${r(n)}\`** —— 题目说"路径不一定经过根节点"，而这棵树的根是 \`${r(n)}\`（负数），把根接进来只会让和变小，所以递归时根的 \`through\` 反而不是最大的。`+(l<0?" 另外 `best` 是负数 —— 说明全树都是负值，此时答案就是**最大的那个单节点**（路径至少含一个节点，不能返回空路径 0）。":``),{current:u,returnSource:`best`,through:l,gain:o[u],done:!0}),a}var wo=`mps-styles`,To=24,Eo=96,Do=76,Oo=58,ko=26,Ao=40,jo=46,Mo=1250,No=`
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
`;function Po(){if(document.getElementById(wo))return;let e=document.createElement(`style`);e.id=wo,e.textContent=No,document.head.appendChild(e)}function Fo(e,t={}){if(!e||e.dataset.mpsMounted===`1`)return{destroy(){}};e.dataset.mpsMounted=`1`,Po();let n=Co(t),r=t.autoplay!==!1,{nodes:i,root:a}=qa(Array.isArray(t.values)?t.values:[-10,9,20,null,null,15,7]),o=e=>e==null||!i[e]?null:i[e].value,s=Y,c=document.createElement(`div`);c.className=`viz mps`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(a===-1){let t=s(`svg`,{class:`viz__svg mps__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`mps-empty__text`,x:620/2,y:120/2});return n.textContent=`空树 —— 没有节点，路径和按 0 处理（LeetCode 保证至少一个节点）`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),{destroy(){e.textContent=``,delete e.dataset.mpsMounted,document.getElementById(wo)?.remove()}}}let d=i.reduce((e,t)=>Math.max(e,t.depth),0),f=new Map;f.set(a,[]);for(let e of i)e.parent!==-1&&f.set(e.id,[...f.get(e.parent)??[],e.side]);let p=e=>Oo*2**Math.max(0,d-e),m=e=>{let t=0;for(let n of f.get(e.id)??[])t=t*2+ +(n===`R`);return(t+.5)*p(e.depth)},h=2**d*Oo,g=Math.max(660,ko+h+68),_=(g-h)/2,v=e=>Do+e*Eo,y=e=>({x:_+m(i[e]),y:v(i[e].depth)}),b=Do+d*Eo+To+Ao,x=Math.min(600,g-ko*2),S=s(`svg`,{class:`viz__svg mps__svg`,viewBox:`0 0 ${g} ${b+jo+26}`,role:`img`,"aria-label":`二叉树最大路径和推演动画`});l.appendChild(S);let C=s(`g`,{class:`mps-edges`}),w=s(`g`,{class:`mps-nodes`}),T=s(`g`,{class:`mps-labels`});S.appendChild(C),S.appendChild(w),S.appendChild(T);let E=new Map;for(let e of i){if(e.parent===-1)continue;let t=y(e.parent),n=y(e.id),r=s(`path`,{class:`mps-edge`,d:`M ${t.x} ${t.y+To} L ${n.x} ${n.y-To}`});C.appendChild(r),E.set(e.id,r)}let D=e=>{if(e.parent===-1)return 0;let t=e.side===`L`?i[e.parent].right:i[e.parent].left;if(t==null)return 0;let n=Math.abs(y(e.id).x-y(t).x);if(n>=76)return 0;let r=(76-n)/2+4;return e.side===`L`?-r:r},O=[];for(let e of i){let t=y(e.id),n=s(`g`,{class:`mps-node`,transform:`translate(${t.x} ${t.y})`});n.appendChild(s(`circle`,{class:`mps-node__ring`,r:31})),n.appendChild(s(`circle`,{class:`mps-node__circle`,cx:0,cy:0,r:To}));let r=s(`text`,{class:`mps-node__value`,x:0,y:0});r.textContent=String(e.value),n.appendChild(r),w.appendChild(n);let i=s(`g`,{class:`mps-node__gaing`,transform:`translate(${t.x+D(e)} ${t.y})`});i.appendChild(s(`rect`,{class:`mps-node__gain`,x:-32,y:-57,width:64,height:22,rx:7}));let a=s(`text`,{class:`mps-node__gain-text`,x:0,y:-46});i.appendChild(a),T.appendChild(i),O.push({g:n,gainG:i,gt:a,id:e.id})}let k=s(`g`,{class:`mps-banner`});k.appendChild(s(`rect`,{class:`mps-banner__box`,x:ko,y:b,width:x,height:jo,rx:9}));let A=s(`text`,{class:`mps-banner__label`,x:42,y:b+jo/2});A.textContent=`当前最优路径和`,k.appendChild(A);let j=s(`text`,{class:`mps-banner__value`,x:162,y:b+jo/2});k.appendChild(j);let M=s(`text`,{class:`mps-banner__path`,x:ko+x-16,y:b+jo/2});k.appendChild(M),S.appendChild(k);let N=u();function P(e,t){if(!t)return;let n=t.stack.length?t.stack[t.stack.length-1].id:null,r=new Set(t.bestPath??[]),a=new Set(t.pruned??[]),s=e=>Object.prototype.hasOwnProperty.call(t.gainOf,e);for(let e of O){let{id:i,g:o,gainG:c,gt:l}=e,u=[`mps-node`],d=s(i),f=d?t.gainOf[i]:null;d&&u.push(f>0?`is-plus`:`is-zero`),a.has(i)&&u.push(`is-zero`),i===n&&u.push(`is-visit`),r.has(i)&&u.push(`is-onpath`),i===t.bestNode&&u.push(`is-apex`),o.setAttribute(`class`,u.join(` `)),d?(c.style.opacity=`1`,l.textContent=`gain ${f}`):c.style.opacity=`0`}for(let e of i){if(e.parent===-1)continue;let n=E.get(e.id),i=[`mps-edge`];r.has(e.id)&&r.has(e.parent)&&i.push(`is-onpath`),s(e.id)&&t.gainOf[e.id]<=0&&i.push(`is-prune`),n.setAttribute(`class`,i.join(` `))}t.bestNode===null||!(t.bestPath??[]).length?(j.textContent=`—`,M.textContent=`还没算完任何一条路径`):(j.textContent=String(t.best),M.textContent=(t.bestPath??[]).map(e=>o(e)).join(` → `)),Z(N,t.desc)}c.appendChild(N);let F=Q();c.appendChild(F.root),e.textContent=``,e.appendChild(c),X();let I=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,L=$({steps:n,controls:F,intervalMs:Mo,onRender:P});L.jumpTo(Math.trunc(t.initialStep)||0);let R=null;return r&&!I&&typeof IntersectionObserver==`function`&&(R=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){R.disconnect(),R=null,L.play();return}},{threshold:.35}),R.observe(c)),{destroy(){R&&=(R.disconnect(),null),L.destroy(),e.textContent=``,delete e.dataset.mpsMounted,document.getElementById(wo)?.remove()}}}function Io(e={}){let{nodes:t,root:n}=qa(Array.isArray(e.values)?e.values:[3,9,20,null,null,15,7]);if(n===-1)return[{phase:`done`,desc:"**空树** —— 深度记 `0`。这是递归的出口条件，也是整道题的基线。",stack:[],current:null,leftH:null,rightH:null,height:null,heightOf:{},answer:0,depth:-1,maxDepthSeen:0,done:!0}];let r=e=>e==null||t[e]===void 0?null:t[e].value,i=Number.isInteger(e.maxFrames)?e.maxFrames:400,a=[],o={},s=null,c=0,l=0,u=[],d=(e,t,n={})=>{a.push({phase:e,desc:t,stack:u.map(e=>({id:e.id,stage:e.stage})),current:null,leftH:null,rightH:null,height:null,heightOf:{...o},answer:s,depth:u.length-1,maxDepthSeen:c,done:e===`done`,...n})};for(d(`init`,`要求**最大深度**，也就是"从根往下最多能走几层"。做法是**后序递归**：每个节点先问出左右子树各自的高度，再取较大的那个、**加 1**（加的这个 1 就是自己这一层）。注意那个 \`1\` 不能少 —— 它代表的正是"把自己算进去"。栈底是根 \`${r(n)}\`。`,{current:n}),u.push({id:n,stage:`enter`});u.length>0&&(l+=1,!(l>i));){let e=u[u.length-1],i=t[e.id];if(c=Math.max(c,u.length-1),e.stage===`enter`){if(i.left===null&&i.right===null){o[e.id]=1,e.id===n&&(s=1),d(`leaf`,`进入 \`${r(e.id)}\` —— **叶子节点**，左右子树都不存在。按定义空子树高度是 \`0\`，所以它自己的高度 = \`1 + max(0, 0) = 1\`。**叶子是整条递归链的起点** —— 高度就是从这里开始一层层往上冒的。`,{current:e.id,leftH:0,rightH:0,height:1}),u.pop();continue}let t=i.left!==null;d(`recurse`,`进入 \`${r(e.id)}\` —— 它 **还不能下结论**：自己的高度取决于子树的高度，所以必须**先下去问**。`+(t?`先向左子树 \`${r(i.left)}\` 递归。`:`它没有左孩子（左边高度直接记 \`0\`），直接向右子树 \`${r(i.right)}\` 递归。`),{current:e.id}),e.stage=t?`left`:`right`,u.push({id:t?i.left:i.right,stage:`enter`});continue}if(e.stage===`left`){if(i.right!==null){let t=o[i.left];d(`recurse`,`左子树 \`${r(i.left)}\` 回来了，报告高度 **\`${t}\`**。先把它记在手边，接着向右子树 \`${r(i.right)}\` 递归 —— **还没到算自己高度的时候**，因为 \`max\` 要两个数都拿到才敢取。`,{current:e.id,leftH:t}),e.stage=`right`,u.push({id:i.right,stage:`enter`});continue}e.stage=`decide`;continue}if(e.stage===`right`){e.stage=`decide`;continue}let a=i.left===null?0:o[i.left],l=i.right===null?0:o[i.right],f=1+Math.max(a,l);o[e.id]=f;let p=e.id===n;p&&(s=f);let m=a===l?`两边一样高，取哪个都行`:a>l?`右边 \`${l}\` 更矮，被淘汰（\`max\` 只要大的那个）`:`左边 \`${a}\` 更矮，被淘汰（\`max\` 只要大的那个）`;d(`compute`,`\`${r(e.id)}\` 的左右子树都回来了：左 **\`${a}\`**、右 **\`${l}\`**。算自己的高度：\`1 + max(${a}, ${l}) = ${f}\` —— **那个 \`1\` 是把自己这一层算上**，这是本题唯一容易漏的地方。（${m}。）`+(p?` **根算完了，答案就是它：\`${f}\`。** 注意在这之前，中间任何一帧都没有人能提前说出最终答案 —— 高度是从最深的叶子一层层冒上来的，必须等根拿到左右两个数才定得下来。`:` 把这个高度汇报给父节点。`),{current:e.id,leftH:a,rightH:l,height:f}),u.pop()}return d(`done`,`递归结束，栈空了。**最大深度 = \`${s}\`**。回头看整条链路：叶子报 \`1\` → 父节点 \`1 + max(…) \` → 一层层加 1 → 根报出最终答案。**每个节点只被访问一次**，所以是 O(n)。另外注意 104 全程**没有任何全局变量** —— 答案不是"一路取 max 攒出来的"，而是根那一次计算的返回值本身。（对比 LC 124 的 \`best\`：那个才是需要一路刷新的全局最优。）`,{current:n,height:s,done:!0}),a}var Lo=`md-styles`,Ro=24,zo=96,Bo=78,Vo=26,Ho=40,Uo=52,Wo=1150,Go=48,Ko=`
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
`;function qo(){if(document.getElementById(Lo))return;let e=document.createElement(`style`);e.id=Lo,e.textContent=Ko,document.head.appendChild(e)}function Jo(e,t={}){if(!e||e.dataset.mdMounted===`1`)return{destroy(){}};e.dataset.mdMounted=`1`,qo();let n=Io(t),r=t.autoplay!==!1,{nodes:i,root:a}=qa(Array.isArray(t.values)?t.values:[3,9,20,null,null,15,7]),o=e=>e==null||!i[e]?null:i[e].value,s=Y,c=i.length,l=document.createElement(`div`);l.className=`viz md`;let u=document.createElement(`div`);u.className=`viz__stage`,l.appendChild(u);function d(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(a===-1){let t=s(`svg`,{class:`viz__svg md__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`md-empty__text`,x:620/2,y:120/2});return n.textContent=`空树 —— 深度记 0（这就是递归的出口条件）`,t.appendChild(n),u.appendChild(t),l.appendChild(d()),l.appendChild(Q().root),e.textContent=``,e.appendChild(l),{destroy(){e.textContent=``,delete e.dataset.mdMounted,document.getElementById(Lo)?.remove()}}}let f=i.reduce((e,t)=>Math.max(e,t.depth),0),p=Math.min(120,Math.max(58,Math.round(470/2**f))),m=new Map;m.set(a,[]);for(let e of i)e.parent!==-1&&m.set(e.id,[...m.get(e.parent)??[],e.side]);let h=e=>p*2**Math.max(0,f-e),g=e=>{let t=0;for(let n of m.get(e.id)??[])t=t*2+ +(n===`R`);return(t+.5)*h(e.depth)},_=2**f*p,v=Math.max(660,Vo+_+68),y=(v-_)/2,b=e=>Bo+e*zo,x=e=>({x:y+g(i[e]),y:b(i[e].depth)}),S=Bo+f*zo+Ro+Ho,C=Math.min(620,v-Vo*2),w=s(`svg`,{class:`viz__svg md__svg`,viewBox:`0 0 ${v} ${S+Uo+26}`,role:`img`,"aria-label":`二叉树最大深度推演动画`});u.appendChild(w);let T=s(`g`,{class:`md-edges`}),E=s(`g`,{class:`md-nodes`}),D=s(`g`,{class:`md-labels`});w.appendChild(T),w.appendChild(E),w.appendChild(D);let O=new Map;for(let e of i){if(e.parent===-1)continue;let t=x(e.parent),n=x(e.id),r=s(`path`,{class:`md-edge`,d:`M ${t.x} ${t.y+Ro} L ${n.x} ${n.y-Ro}`});T.appendChild(r),O.set(e.id,r)}let k=e=>{if(e.parent===-1)return 0;let t=e.side===`L`?i[e.parent].right:i[e.parent].left;if(t==null)return 0;let n=Math.abs(x(e.id).x-x(t).x);if(n>=56)return 0;let r=(56-n)/2+3;return e.side===`L`?-r:r},A=[];for(let e of i){let t=x(e.id),n=s(`g`,{class:`md-node`,transform:`translate(${t.x} ${t.y})`});n.appendChild(s(`circle`,{class:`md-node__ring`,r:31})),n.appendChild(s(`circle`,{class:`md-node__circle`,cx:0,cy:0,r:Ro}));let r=s(`text`,{class:`md-node__value`,x:0,y:0});r.textContent=String(e.value),n.appendChild(r),E.appendChild(n);let i=s(`g`,{class:`md-node__htag-g`,transform:`translate(${t.x+k(e)} ${t.y})`});i.appendChild(s(`rect`,{class:`md-node__htag`,x:-48/2,y:-56,width:Go,height:22,rx:7}));let a=s(`text`,{class:`md-node__htag-text`,x:0,y:-45});i.appendChild(a),D.appendChild(i),A.push({g:n,gainG:i,gt:a,id:e.id})}let j=s(`g`,{class:`md-banner`});j.appendChild(s(`rect`,{class:`md-banner__box`,x:Vo,y:S,width:C,height:Uo,rx:9}));let M=s(`text`,{class:`md-banner__lead`,x:42,y:S+Uo/2});j.appendChild(M);let N=s(`text`,{class:`md-banner__answer-label`,x:Vo+C-74,y:S+Uo/2});N.textContent=`最大深度`,j.appendChild(N);let P=s(`text`,{class:`md-banner__answer`,x:Vo+C-16,y:S+Uo/2});j.appendChild(P),w.appendChild(j);let F=d();function I(e,t){if(!t)return;let n=t.stack.length?t.stack[t.stack.length-1].id:null,r=t.current,s=e=>Object.prototype.hasOwnProperty.call(t.heightOf,e),c=new Set;for(let e=0;e+1<t.stack.length;e+=1)c.add(t.stack[e+1].id);let l=t.height===null?null:r;for(let e of A){let{id:r,g:i,gainG:a,gt:o}=e,c=[`md-node`],u=s(r);u&&c.push(`is-done`),r===n&&c.push(`is-visit`),r===l&&c.push(`is-fresh`),i.setAttribute(`class`,c.join(` `)),u?(a.style.opacity=`1`,o.textContent=`h=${t.heightOf[r]}`):a.style.opacity=`0`}for(let e of i)e.parent!==-1&&O.get(e.id).setAttribute(`class`,c.has(e.id)?`md-edge is-onstack`:`md-edge`);t.phase===`init`?M.textContent=`从根 ${o(a)} 开始，先下去问子树`:t.phase===`recurse`?M.textContent=t.leftH===null?`进入 ${o(r)}，继续往下问`:`左子树回报 h=${t.leftH}，继续问右边`:t.phase===`leaf`?M.textContent=`${o(r)} 是叶子 → h = 1 + max(0, 0) = 1`:t.phase===`compute`?M.textContent=`${o(r)}：1 + max(${t.leftH}, ${t.rightH}) = ${t.height}`:M.textContent=t.answer===0?`空树：深度记 0`:`根 ${o(a)} 报出 h=${t.answer} —— 这就是答案`;let u=t.answer;u===null?(P.textContent=`?`,P.setAttribute(`class`,`md-banner__answer is-unknown`)):(P.textContent=String(u),P.setAttribute(`class`,`md-banner__answer`)),Z(F,t.desc)}l.appendChild(F);let L=Q();l.appendChild(L.root),e.textContent=``,e.appendChild(l),X();let R=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,z=$({steps:n,controls:L,intervalMs:Wo,onRender:I});z.jumpTo(Math.trunc(t.initialStep)||0);let B=null;return r&&!R&&typeof IntersectionObserver==`function`&&(B=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){B.disconnect(),B=null,z.play();return}},{threshold:.35}),B.observe(l)),l.setAttribute(`aria-description`,`共 ${c} 个节点`),{destroy(){B&&=(B.disconnect(),null),z.destroy(),e.textContent=``,delete e.dataset.mdMounted,document.getElementById(Lo)?.remove()}}}function Yo(e={}){let{nodes:t,root:n}=qa(Array.isArray(e.values)?e.values:[4,2,7,1,3,6,9]);if(n===-1)return[{phase:`done`,desc:"**空树** —— 没什么可翻的，直接返回 `None`。",current:null,swapPair:null,swapped:[],sideOf:{},stack:[],depth:-1,done:!0}];let r=e=>e==null||t[e]===void 0?null:t[e].value,i=Number.isInteger(e.maxFrames)?e.maxFrames:400,a={};for(let e of t)e.parent!==-1&&(a[e.id]=e.side);let o=(e,n)=>{for(let r of t)if(r.parent===e&&a[r.id]===n)return r.id;return null},s=[],c=[],l=[],u=0,d=(e,t,n={})=>{s.push({phase:e,desc:t,current:null,swapPair:null,swapped:[...c],sideOf:{...a},stack:l.map(e=>({id:e.id})),depth:l.length-1,done:e===`done`,...n})},f=t.length;for(d(`init`,`翻转二叉树 —— **把每个节点的两个孩子交换一次**。关键要意识到：**交换和递归的先后顺序不影响结果**，因为每个节点是各自独立地换自己的两个孩子，谁先谁后都不干涉。所以前序（先换再递归）和后序（先递归再换）都对 —— 但**交换绝不能插在两个递归中间**，那样会让已经翻好的子树白翻一遍。这棵树一共 ${f} 个节点，我们从根 \`${r(n)}\` 开始，一层层往下换。`,{current:n}),l.push({id:n,stage:`enter`});l.length>0&&(u+=1,!(u>i));){let e=l[l.length-1];if(t[e.id],e.stage===`enter`){let t=o(e.id,`L`),n=o(e.id,`R`);if(t===null&&n===null){d(`leaf`,`\`${r(e.id)}\` 是**叶子节点**，两个孩子都是空的。交换两个 \`None\` 是**空操作** —— 所以叶子在这里直接返回。这也说明：**真正发生变化的只有非叶节点**。`,{current:e.id}),l.pop();continue}t!==null&&(a[t]=`R`),n!==null&&(a[n]=`L`),c.push(e.id),d(`swap`,`\`${r(e.id)}\` —— **交换它的两个孩子**：`+(t!==null&&n!==null?`\`${r(t)}\` 和 \`${r(n)}\` 互换位置。`:t===null?`原来只有右孩子 \`${r(n)}\`，换成左孩子（另一边仍是空）。`:`原来只有左孩子 \`${r(t)}\`，换成右孩子（另一边仍是空）。`)+` 这是这一帧**唯一**发生的事，别多做也别少做。`,{current:e.id,swapPair:[t,n]}),e.stage=`left`,n!==null&&l.push({id:n,stage:`enter`});continue}if(e.stage===`left`){let t=o(e.id,`R`);t===null?e.stage=`right`:(d(`descend`,`\`${r(e.id)}\` 的左子树已经翻完，回到它身上，接着递归进**右子树** \`${r(t)}\`。注意这个"右子树"其实是**交换前那个左孩子** —— 因为这一层的交换已经发生过了，角色的名字不能想当然。`,{current:e.id}),e.stage=`right`,l.push({id:t,stage:`enter`}));continue}l.pop()}return d(`done`,`递归结束，栈空了。**翻转完成** —— 一共交换了 \`${c.length}\` 个非叶节点的孩子。现在整棵树上，每个节点从根到它的路径都**逐位取反**过了：左变成了右、右变成了左，于是每一层都成了原来那一层的**镜像**。时间复杂度 O(n)（每个节点恰好访问一次），空间 O(h)（递归栈深 = 树高）。`,{current:n,done:!0}),s}var Xo=`it-styles`,Zo=24,Qo=88,$o=76,es=34,ts=68,ns=26,rs=42,is=50,as=1150,os=`
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
`;function ss(){if(document.getElementById(Xo))return;let e=document.createElement(`style`);e.id=Xo,e.textContent=os,document.head.appendChild(e)}function cs(e,t={}){if(!e||e.dataset.itMounted===`1`)return{destroy(){}};e.dataset.itMounted=`1`,ss();let n=Yo(t),r=t.autoplay!==!1,{nodes:i,root:a}=qa(Array.isArray(t.values)?t.values:[4,2,7,1,3,6,9]),o=e=>e==null||!i[e]?null:i[e].value,s=Y,c=document.createElement(`div`);c.className=`viz it`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(a===-1){let t=s(`svg`,{class:`viz__svg it__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`it-empty__text`,x:620/2,y:120/2});return n.textContent=`空树 —— 没什么可翻的，直接返回 None`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),{destroy(){e.textContent=``,delete e.dataset.itMounted,document.getElementById(Xo)?.remove()}}}let d=i.reduce((e,t)=>Math.max(e,t.depth),0),f=Math.min(120,Math.max(58,Math.round(470/2**d))),p=e=>f*2**Math.max(0,d-e),m=2**d*f,h=Math.max(660,ns+m+68),g=(h-m)/2,_=e=>$o+e*Qo,v=(e,t)=>{let n=0,r=1,a=t;for(;i[a].parent!==-1;)e[a]===`R`&&(n+=r),r*=2,a=i[a].parent;return{x:g+(n+.5)*p(i[t].depth),y:_(i[t].depth)}},y=$o+d*Qo+Zo+rs,b=Math.min(620,h-ns*2),x=s(`svg`,{class:`viz__svg it__svg`,viewBox:`0 0 ${h} ${y+is+26}`,role:`img`,"aria-label":`翻转二叉树推演动画`});l.appendChild(x);let S=s(`g`,{class:`it-edges`}),C=s(`g`,{class:`it-nodes`}),w=s(`g`,{class:`it-swap`});x.appendChild(S),x.appendChild(w),x.appendChild(C);let T=new Map;for(let e of i){if(e.parent===-1)continue;let t=s(`path`,{class:`it-edge`,d:`M 0 0 L 0 0`});S.appendChild(t),T.set(e.id,t)}let E=[];for(let e of i){let t=s(`g`,{class:`it-node`});t.appendChild(s(`circle`,{class:`it-node__ring`,r:31})),t.appendChild(s(`circle`,{class:`it-node__circle`,cx:0,cy:0,r:Zo}));let n=s(`text`,{class:`it-node__value`,x:0,y:0});n.textContent=String(e.value),t.appendChild(n),C.appendChild(t),E.push({g:t,value:e.value,id:e.id})}let D=s(`path`,{class:`it-swap__arc`,d:`M 0 0`}),O=s(`path`,{class:`it-swap__head`,d:`M 0 0`}),k=s(`path`,{class:`it-swap__head`,d:`M 0 0`}),A=s(`text`,{class:`it-swap__mark`,x:0,y:0});A.textContent=`⇄`,w.appendChild(D),w.appendChild(O),w.appendChild(k),w.appendChild(A);let j=s(`rect`,{class:`it-banner__box`,x:ns,y,width:b,height:is,rx:9});x.appendChild(j);let M=s(`text`,{class:`it-banner__lead`,x:42,y:y+is/2});x.appendChild(M);let N=s(`text`,{class:`it-banner__count`,x:ns+b-16,y:y+is/2});x.appendChild(N);let P=u();function F(e,t){if(!t)return;let n=t.sideOf??{},r=e=>v(n,e),s=t.current,c=new Set(t.swapped??[]),l=t.swapPair??[],u=new Set(l.filter(e=>e!=null)),d=new Set;for(let e=0;e+1<t.stack.length;e+=1)d.add(t.stack[e+1].id);for(let e of E){let{id:n,g:i}=e,a=r(n);i.setAttribute(`transform`,`translate(${a.x} ${a.y})`);let o=[`it-node`];c.has(n)&&o.push(`is-done`),n===s&&t.phase!==`done`&&o.push(`is-visit`),u.has(n)&&o.push(`is-swapping`),i.setAttribute(`class`,o.join(` `))}for(let e of i){if(e.parent===-1)continue;let t=r(e.parent),n=r(e.id),i=T.get(e.id);i.setAttribute(`d`,`M ${t.x} ${t.y+Zo} L ${n.x} ${n.y-Zo}`),i.setAttribute(`class`,d.has(e.id)?`it-edge is-onstack`:`it-edge`)}let f=l.filter(e=>e!=null);if(t.phase===`swap`&&f.length===2){let e=r(f[0]),t=r(f[1]),n=e.y-Zo-es,i=(e.x+t.x)/2,a=e.y-Zo-ts;D.setAttribute(`d`,`M ${e.x} ${n} Q ${i} ${a} ${t.x} ${n}`),D.style.opacity=`1`,O.setAttribute(`d`,`M ${e.x} ${n} l 9 -4 l 0 8 z`),k.setAttribute(`d`,`M ${t.x} ${n} l -9 -4 l 0 8 z`),O.style.opacity=`1`,k.style.opacity=`1`,A.setAttribute(`x`,i),A.setAttribute(`y`,a-9),A.style.opacity=`1`}else D.style.opacity=`0`,O.style.opacity=`0`,k.style.opacity=`0`,A.style.opacity=`0`;let p=i.filter(e=>e.left!==null||e.right!==null).length;t.phase===`init`?M.textContent=`从根 ${o(a)} 开始，逐层交换两个孩子`:t.phase===`swap`?M.textContent=f.length===2?`交换 ${o(f[0])} 和 ${o(f[1])}`:`单侧孩子移位：${o(f[0]??f[1])}`:t.phase===`leaf`?M.textContent=`${o(s)} 是叶子，交换空操作 → 直接返回`:M.textContent=`继续递归进子树 ${o(s)}`,t.phase===`done`?(M.textContent=`翻转完成 —— 每个节点的路径都逐位取反过了`,j.setAttribute(`class`,`it-banner__box is-done`),N.setAttribute(`class`,`it-banner__count is-done`)):(j.setAttribute(`class`,`it-banner__box`),N.setAttribute(`class`,`it-banner__count`)),N.textContent=`已换 ${t.swapped.length}/${p} 个非叶节点`,Z(P,t.desc)}c.appendChild(P);let I=Q();c.appendChild(I.root),e.textContent=``,e.appendChild(c),X();let L=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,R=$({steps:n,controls:I,intervalMs:as,onRender:F});R.jumpTo(Math.trunc(t.initialStep)||0);let z=null;return r&&!L&&typeof IntersectionObserver==`function`&&(z=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){z.disconnect(),z=null,R.play();return}},{threshold:.35}),z.observe(c)),{destroy(){z&&=(z.disconnect(),null),R.destroy(),e.textContent=``,delete e.dataset.itMounted,document.getElementById(Xo)?.remove()}}}function ls(e={}){let t=typeof e.values==`string`?e.values:`abcabcbb`,n=Array.from(t),r=n.length,i=Number.isInteger(e.maxSteps)?e.maxSteps:400,a={right:-1,left:0,prevLeft:null,ch:null,hitIdx:null,outsideWindow:!1,lastSeen:{},windowLen:0,ans:0,bestRange:null};if(r===0)return[{...a,phase:`done`,desc:"**空串** —— 一个字符都没有，最长无重复子串的长度是 `0`。",done:!0}];let o=[],s={},c=0,l=0,u=null,d=0,f=(e,t,n={})=>{o.push({phase:e,desc:t,right:-1,left:c,prevLeft:null,ch:null,hitIdx:null,outsideWindow:!1,lastSeen:{...s},windowLen:0,ans:l,bestRange:u?[...u]:null,done:e===`done`,...n})};f(`init`,`要在 \`${t}\`（${r} 个字符）里找**最长的不含重复字符的子串**。用**滑动窗口**：\`right\` 一路往右扩张，把字符一个个吃进窗口；一旦吃进来的字符**在窗口内已经出现过**，就让 \`left\` 跳到"那个旧位置 + 1"，把它挤出窗口。两个指针都只往右走，所以整体是 O(n)。维护一张表 \`lastSeen\`，记每个字符最后出现在哪 —— 这就是"一眼看出重不重复"的依据。`);for(let e=0;e<r&&(d+=1,!(d>i));e+=1){let t=n[e],r=s[t],i=r!==void 0&&r<c;if(r!==void 0&&r>=c){let n=c;c=r+1,s[t]=e;let i=e-c+1,a=i>l;a&&(l=i,u=[c,e]),f(`slide`,`\`right\` 走到 \`${e}\`，字符是 **\`${t}\`**。它上次出现在下标 \`${r}\`，**而这个位置还在窗口里**（\`${r} >= left = ${n}\`）—— 构成重复。于是 \`left\` 从 \`${n}\` 跳到 \`${r} + 1 = ${c}\`，把旧的 \`${t}\` 挤出窗口。注意 **\`left\` 只会往右跳，绝不会退回去** —— 这是滑动窗口正确性的根基。现在窗口是 \`[${c}, ${e}]\`，长度 \`${i}\``+(a?`，**刷新了答案 → \`ans = ${l}\`**。`:`，没超过当前的 \`ans = ${l}\`。`),{right:e,left:c,prevLeft:n,ch:t,hitIdx:r,windowLen:i});continue}s[t]=e;let a=e-c+1,o=a>l;o&&(l=a,u=[c,e]),f(`expand`,`\`right\` 走到 \`${e}\`，字符是 **\`${t}\`**。`+(i?`它**出现过**（下标 \`${r}\`），但那个位置**已经在窗口左边之外**了（\`${r} < left = ${c}\`）—— 它早就被挤出窗口，现在再遇到**不算重复**，所以 \`left\` 原地不动。**这一步就是"只看位置是否还在窗口内"这个判据的价值所在**：如果这里无脑写 \`left = ${r} + 1\`，左指针就会倒退回 \`${r+1}\`。`:`它还没在窗口里出现过，直接吃进来。`)+` 现在窗口是 \`[${c}, ${e}]\`，长度 **\`${a}\`**`+(o?`，**刷新了答案 → \`ans = ${l}\`**。`:`，没超过当前的 \`ans = ${l}\`。`),{right:e,left:c,ch:t,hitIdx:i?r:null,outsideWindow:i,windowLen:a})}let p=u?n.slice(u[0],u[1]+1).join(``):``;return f(`done`,`扫描结束。**答案 = \`${l}\`**，对应的窗口是 \`[${u?.[0]}, ${u?.[1]}]\`，内容 \`"${p}"\`。回头看整条链路：\`right\` 一共推进了 ${r} 次，\`left\` 也从头到尾**只往右走、从不后退**，两个指针加起来总移动量不超过 \`2n\` —— 所以是**严格的 O(n)**，而不是"外层枚举左端点 × 内层枚举右端点"的 O(n²)。空间是 O(min(n, 字符集大小))：\`lastSeen\` 每个不同字符只占一条。`,{left:c,right:r-1,windowLen:r-c,done:!0}),o}var us=`ls-styles`,ds=54,fs=52,ps=6,ms=136,hs=22,gs=196,_s=206,vs=9,ys=242,bs=282,xs=296,Ss=46,Cs=26,ws=50,Ts=1150,Es=604,Ds=`
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
`;function Os(){if(document.getElementById(us))return;let e=document.createElement(`style`);e.id=us,e.textContent=Ds,document.head.appendChild(e)}function ks(e,t={}){if(!e||e.dataset.lsMounted===`1`)return{destroy(){}};e.dataset.lsMounted=`1`,Os();let n=ls(t),r=t.autoplay!==!1,i=typeof t.values==`string`?t.values:`abcabcbb`,a=Array.from(i),o=a.length,s=Y,c=document.createElement(`div`);c.className=`viz ls`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(o===0){let t=s(`svg`,{class:`viz__svg ls__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`ls-empty__text`,x:620/2,y:120/2});return n.textContent=`空串 —— 没有字符，答案是 0`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),{destroy(){e.textContent=``,delete e.dataset.lsMounted,document.getElementById(us)?.remove()}}}let d=fs,f=ps,p=17,m=o*d+(o-1)*f;if(m>Es){let e=Es/m;d=Math.max(20,Math.floor(d*e)),f=Math.max(3,Math.floor(f*e)),p=Math.max(11,Math.round(p*e))}let h=o*d+(o-1)*f,g=Math.max(660,Cs*2+h+68),_=(g-h)/2,v=e=>_+e*(d+f),y=Math.min(620,g-Cs*2),b=s(`svg`,{class:`viz__svg ls__svg`,viewBox:`0 0 ${g} 452`,role:`img`,"aria-label":`无重复字符的最长子串推演动画`});l.appendChild(b);let x=s(`g`,{class:`ls-bands`}),S=s(`g`,{class:`ls-cells`}),C=s(`g`,{class:`ls-marks`});b.appendChild(x),b.appendChild(S),b.appendChild(C);let w=s(`rect`,{class:`ls-win__bar`,x:0,y:_s,width:0,height:vs,rx:4});x.appendChild(w);let T=s(`line`,{class:`ls-win__best`,x1:0,y1:gs,x2:0,y2:gs});x.appendChild(T);let E=s(`text`,{class:`ls-win__pin`,x:0,y:ys}),D=s(`text`,{class:`ls-win__pin is-r`,x:0,y:ys}),O=s(`line`,{class:`ls-win__tick`,x1:0,y1:215,x2:0,y2:ys-8}),k=s(`line`,{class:`ls-win__tick is-r`,x1:0,y1:215,x2:0,y2:ys-8});C.appendChild(O),C.appendChild(k),C.appendChild(E),C.appendChild(D);let A=s(`text`,{class:`ls-win__empty`,x:Cs,y:ys});A.textContent=`窗口还没开始滑动 —— 按播放看 right 怎么一步步往右吃字符`,C.appendChild(A);let j=s(`path`,{class:`ls-rpin__tri`,d:`M 0 0 L 0 0 L 0 0`}),M=s(`text`,{class:`ls-rpin__text`,x:0,y:0});M.textContent=`right`,C.appendChild(j),C.appendChild(M);let N=[];for(let e=0;e<o;e+=1){let t=v(e),n=s(`g`,{class:`ls-cell`});n.appendChild(s(`rect`,{class:`ls-cell__box`,x:t,y:ms,width:d,height:ds,rx:7}));let r=s(`text`,{class:`ls-cell__text`,x:t+d/2,y:163,style:`font-size:${p}px`});r.textContent=a[e],n.appendChild(r),S.appendChild(n),N.push({g:n,id:e})}let P=new Set(a).size,F=P>10?5:8,I=Math.max(28,Math.min(56,Math.floor((Es-(P-1)*F)/P))),L=(g-(P*I+(P-1)*F))/2,R=s(`text`,{class:`ls-table__title`,x:L,y:bs});R.textContent=`lastSeen：每个字符最后出现在哪个下标`,C.appendChild(R);let z=[];for(let e=0;e<P;e+=1){let t=L+e*(I+F),n=s(`g`,{class:`ls-card`});n.appendChild(s(`rect`,{class:`ls-card__box`,x:t,y:xs,width:I,height:Ss,rx:7}));let r=s(`text`,{class:`ls-card__ch`,x:t+I/2,y:311});n.appendChild(r);let i=s(`text`,{class:`ls-card__idx`,x:t+I/2,y:329});n.appendChild(i),C.appendChild(n),z.push({g:n,chT:r,idxT:i,x:t})}let B=s(`g`,{class:`ls-banner`});B.appendChild(s(`rect`,{class:`ls-banner__box`,x:Cs,y:376,width:y,height:ws,rx:9}));let V=s(`text`,{class:`ls-banner__lead`,x:42,y:401});B.appendChild(V);let H=s(`text`,{class:`ls-banner__label`,x:Cs+y-74,y:401});H.textContent=`ans`,B.appendChild(H);let U=s(`text`,{class:`ls-banner__ans`,x:Cs+y-16,y:401});B.appendChild(U),b.appendChild(B);let ee=u();function te(e,t){if(!t)return;let n=t.bestRange,r=t.phase===`done`&&n,s=r?n[0]:t.left,c=r?n[1]:t.right,l=t.lastSeen??{};for(let e of N){let{g:n,id:r}=e,i=[`ls-cell`];c>=0&&r>=s&&r<=c?i.push(`is-in`):(c>=0&&r<s||t.phase!==`init`)&&i.push(`is-out`),r===c&&i.push(`is-cur`),n.setAttribute(`class`,i.join(` `))}let u=c>=0;if(u){let e=v(s),t=v(c)+d;w.setAttribute(`x`,e),w.setAttribute(`width`,Math.max(4,t-e)),w.style.opacity=`1`;let n=v(s)+d/2,r=v(c)+d/2;O.setAttribute(`x1`,n),O.setAttribute(`x2`,n),E.setAttribute(`x`,n),O.style.opacity=`1`,E.style.opacity=`1`,s===c?(E.textContent=`L=R=${s}`,D.style.opacity=`0`,k.style.opacity=`0`):(E.textContent=`L=${s}`,k.setAttribute(`x1`,r),k.setAttribute(`x2`,r),D.setAttribute(`x`,r),D.textContent=`R=${c}`,D.style.opacity=`1`,k.style.opacity=`1`),A.style.opacity=`0`}else w.style.opacity=`0`,O.style.opacity=`0`,k.style.opacity=`0`,E.style.opacity=`0`,D.style.opacity=`0`,A.style.opacity=`1`;if(n?(T.setAttribute(`x1`,v(n[0])),T.setAttribute(`x2`,v(n[1])+d),T.style.opacity=`1`):T.style.opacity=`0`,u){let e=v(c)+d/2,t=ms-hs;j.setAttribute(`d`,`M ${e-6} ${t-10} L ${e+6} ${t-10} L ${e} ${t} z`),M.setAttribute(`x`,e),M.setAttribute(`y`,t-20),j.style.opacity=`1`,M.style.opacity=`1`}else j.style.opacity=`0`,M.style.opacity=`0`;let f=Object.keys(l),p=t.ch;if(z.forEach((e,n)=>{let r=f[n];if(r===void 0){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`,e.chT.textContent=r;let i=r===p&&t.phase!==`done`,a=i&&t.hitIdx!==null&&(t.phase===`slide`||t.outsideWindow===!0);e.idxT.textContent=String(a?t.hitIdx:l[r]),e.g.setAttribute(`class`,i?`ls-card is-hit`:`ls-card`),e.idxT.setAttribute(`class`,a?`ls-card__idx is-old`:`ls-card__idx`)}),t.phase===`init`)V.textContent=`字符串 "${i}"，共 ${o} 个字符`;else if(t.phase===`done`){let e=n?a.slice(n[0],n[1]+1).join(``):``;V.textContent=`最长无重复子串 "${e}"`}else{let e=a.slice(s,c+1).join(``);V.textContent=`窗口 [${s}, ${c}] = "${e}"  长度 ${t.windowLen}`}U.textContent=String(t.ans),Z(ee,t.desc)}c.appendChild(ee);let W=Q();c.appendChild(W.root),e.textContent=``,e.appendChild(c),X();let G=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,K=$({steps:n,controls:W,intervalMs:Ts,onRender:te});K.jumpTo(Math.trunc(t.initialStep)||0);let ne=null;return r&&!G&&typeof IntersectionObserver==`function`&&(ne=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){ne.disconnect(),ne=null,K.play();return}},{threshold:.35}),ne.observe(c)),{destroy(){ne&&=(ne.disconnect(),null),K.destroy(),e.textContent=``,delete e.dataset.lsMounted,document.getElementById(us)?.remove()}}}function As(e={}){let t=Array.isArray(e.nums)?e.nums:[2,7,11,15],n=Number.isInteger(e.target)?e.target:9,r=t.length,i=Number.isInteger(e.maxSteps)?e.maxSteps:400,a={i:-1,x:null,need:null,hitIdx:null,seen:{},answer:null};if(r===0)return[{...a,phase:`done`,desc:`**空数组** —— 没有任何元素，凑不出两个数。题目保证有解，所以这不会发生，但状态机要有安静的出口。`,done:!0}];let o=[],s={},c=null,l=0,u=e=>Object.prototype.hasOwnProperty.call(s,e),d=()=>Object.keys(s).length===0?`{}`:`{${Object.entries(s).map(([e,t])=>`${e}→${t}`).join(`, `)}}`,f=(e,t,n={})=>{o.push({phase:e,desc:t,i:-1,x:null,need:null,hitIdx:null,seen:{...s},answer:c?[...c]:null,done:e===`done`,...n})};f(`init`,`要在 \`[${t.join(`, `)}]\` 里找出**两个数**，使它们的和等于 \`target = ${n}\`，返回它们的**下标**。暴力做法是"选一个 i 再往后试每个 j"，O(n²)。换个方向想：**站在 i 的位置，问一句"我需要的那个数 \`${n} - x\`，之前出现过吗？"** ——那就在遍历时顺手用一张表记下"见过的值和它的下标"。**顺序很关键：先查表，再把自己登记进去**（原因见后面第 3 轮）。`);for(let e=0;e<r&&(l+=1,!(l>i));e+=1){let r=t[e],i=n-r,a=u(i),o=a?s[i]:null;if(a){c=[o,e],f(`hit`,`\`i = ${e}\`，当前元素 \`x = ${r}\`。我想要的那个数是 \`${n} - ${r} = ${i}\`。**去表里查一下 —— 找到了！** \`${i}\` 在下标 \`${o}\`（表里当时是 \`${d()}\`）。于是 \`nums[${o}] + nums[${e}] = ${i} + ${r} = ${n}\` ✓。注意 \`${o} < ${e}\` —— **命中位置一定在当前元素左边**，因为查表发生在"把自己放进去"之前，表里根本还没有自己。这正是"同一元素不能重复使用"这条约束被自动满足的原因。`,{i:e,x:r,need:i,hitIdx:o});break}f(`miss`,`\`i = ${e}\`，当前元素 \`x = ${r}\`。我想要的那个数是 \`${n} - ${r} = ${i}\`。**去表里查一下 —— 没有。**`+(Object.keys(s).length===0?`表此刻还是空的（前面没有任何元素），所以必然查不到。`:`表里现在装的是 \`${d()}\`，没有 \`${i}\`。`)+` 那就**再把自己登记进去**，供后面的元素来查。`,{i:e,x:r,need:i}),s[r]=e,f(`put`,`把 \`${r} → ${e}\` 存进表，表变成 \`${d()}\`。**注意这一步必须在"查表"之后** —— 如果反过来先登记自己，当 \`target = 2 × x\` 时就会查到**自己**，返回一个 \`[i, i]\` 这种把同一个位置用了两次的假答案。（文章第三节用 \`[3, 3]\` 配 \`target = 6\` 演了这件事。）`,{i:e,x:r,need:i})}if(c){let[e,r]=c;f(`verify`,`验证一遍：\`nums[${e}] + nums[${r}] = ${t[e]} + ${t[r]} = ${t[e]+t[r]}\`，正好等于 \`target = ${n}\` ✓。返回 **\`[${e}, ${r}]\`**。整个过程只扫了一遍数组，每个元素做 O(1) 的查表 + 登记 —— 所以是 **O(n) 时间**、**O(n) 空间**（最坏情况整张表都要装下来）。`,{i:r,x:t[r]})}return f(`done`,c?`**答案 = \`[${c[0]}, ${c[1]}]\`**。回头看这题的两句关键代码：\`if need in seen\` 和 \`seen[x] = i\` —— **先查再存，顺序不能反。** 它一次就同时解决了两件事："用哈希把查找降到 O(1)"和"保证不重复使用同一个元素"。另外提醒一句：题目给的前提是"**只存在一个有效答案**"，所以这里可以命中就立刻返回；如果要求**所有**满足条件的下标对，就不能提前 return，而且表里要存"值 → 下标列表"。`:`扫描结束，**没有找到**任何一对和为 \`${n}\` 的数。（题目保证有解，所以这不会发生在合法输入上。）`,{i:r-1,x:t[r-1],done:!0}),o}var js=`ts-styles`,Ms=56,Ns=76,Ps=8,Fs=130,Is=20,Ls=214,Rs=272,zs=288,Bs=48,Vs=26,Hs=52,Us=1400,Ws=604,Gs=`
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
`;function Ks(){if(document.getElementById(js))return;let e=document.createElement(`style`);e.id=js,e.textContent=Gs,document.head.appendChild(e)}function qs(e,t={}){if(!e||e.dataset.tsMounted===`1`)return{destroy(){}};e.dataset.tsMounted=`1`,Ks();let n=As(t),r=t.autoplay!==!1,i=Array.isArray(t.nums)?t.nums:[2,7,11,15],a=Number.isInteger(t.target)?t.target:9,o=i.length,s=Y,c=document.createElement(`div`);c.className=`viz ts`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(o===0){let t=s(`svg`,{class:`viz__svg ts__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`ts-empty__text`,x:620/2,y:120/2});return n.textContent=`空数组 —— 凑不出两个数`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),{destroy(){e.textContent=``,delete e.dataset.tsMounted,document.getElementById(js)?.remove()}}}let d=Ns,f=Ps,p=20,m=o*d+(o-1)*f;if(m>Ws){let e=Ws/m;d=Math.max(28,Math.floor(d*e)),f=Math.max(4,Math.floor(f*e)),p=Math.max(12,Math.round(p*e))}let h=o*d+(o-1)*f,g=Math.max(660,Vs*2+h+68),_=(g-h)/2,v=e=>_+e*(d+f),y=Math.min(620,g-Vs*2),b=s(`svg`,{class:`viz__svg ts__svg`,viewBox:`0 0 ${g} 450`,role:`img`,"aria-label":`两数之和推演动画`});l.appendChild(b);let x=s(`g`,{class:`ts-arcs`}),S=s(`g`,{class:`ts-cells`}),C=s(`g`,{class:`ts-marks`});b.appendChild(x),b.appendChild(S),b.appendChild(C);let w=s(`path`,{class:`ts-arc`,d:`M 0 0`});x.appendChild(w);let T=[];for(let e=0;e<o;e+=1){let t=v(e),n=s(`g`,{class:`ts-cell`});n.appendChild(s(`rect`,{class:`ts-cell__ring`,x:t-5,y:Fs-5,width:d+10,height:66,rx:11})),n.appendChild(s(`rect`,{class:`ts-cell__box`,x:t,y:Fs,width:d,height:Ms,rx:8}));let r=s(`text`,{class:`ts-cell__value`,x:t+d/2,y:158,style:`font-size:${p}px`});r.textContent=String(i[e]),n.appendChild(r);let a=s(`text`,{class:`ts-cell__idx`,x:t+d/2,y:202});a.textContent=String(e),n.appendChild(a),S.appendChild(n),T.push({g:n,id:e})}let E=s(`path`,{class:`ts-ipin__tri`,d:`M 0 0 L 0 0 L 0 0`}),D=s(`text`,{class:`ts-ipin__text`,x:0,y:0});D.textContent=`i`,C.appendChild(E),C.appendChild(D);let O=s(`text`,{class:`ts-table__title`,x:Vs,y:Rs});O.textContent=`seen：见过的值 → 它的下标`,C.appendChild(O);let k=s(`text`,{class:`ts-table__empty`,x:Vs,y:312});k.textContent=`（表还是空的）`,C.appendChild(k);let A=o>8?6:10,j=Math.max(40,Math.min(74,Math.floor((Ws-(Math.max(1,o)-1)*A)/Math.max(1,o)))),M=[];for(let e=0;e<o;e+=1){let t=Vs+e*(j+A),n=s(`g`,{class:`ts-card`});n.appendChild(s(`rect`,{class:`ts-card__box`,x:t,y:zs,width:j,height:Bs,rx:8}));let r=s(`text`,{class:`ts-card__key`,x:t+j/2,y:305});n.appendChild(r);let i=s(`text`,{class:`ts-card__val`,x:t+j/2,y:323});n.appendChild(i),C.appendChild(n),M.push({g:n,k:r,val:i})}let N=s(`rect`,{class:`ts-banner__box`,x:Vs,y:372,width:y,height:Hs,rx:9});b.appendChild(N);let P=s(`text`,{class:`ts-banner__lead`,x:42,y:398});b.appendChild(P);let F=s(`text`,{class:`ts-banner__label`,x:Vs+y-84,y:398});F.textContent=`答案下标`,b.appendChild(F);let I=s(`text`,{class:`ts-banner__ans`,x:Vs+y-16,y:398});I.textContent=`—`,b.appendChild(I);let L=u();function R(e,t){if(!t)return;let n=t.seen??{},r=t.answer,s=t.i,c=new Set(r?[r[0],r[1]]:[]),l=new Set(Object.keys(n).map(Number));for(let e of T){let{g:n,id:r}=e,a=[`ts-cell`];l.has(i[r])&&a.push(`is-seen`),r===s&&t.phase!==`done`&&a.push(`is-cur`),c.has(r)&&a.push(`is-answer`),n.setAttribute(`class`,a.join(` `))}if(s>=0&&s<o&&t.phase!==`done`){let e=v(s)+d/2,t=Fs-Is;E.setAttribute(`d`,`M ${e-6} ${t-10} L ${e+6} ${t-10} L ${e} ${t} z`),D.setAttribute(`x`,e),D.setAttribute(`y`,t-20),D.textContent=`i=${s}`,E.style.opacity=`1`,D.style.opacity=`1`}else E.style.opacity=`0`,D.style.opacity=`0`;if(r){let e=v(r[0])+d/2,t=v(r[1])+d/2,n=(e+t)/2;w.setAttribute(`d`,`M ${e} ${Ls} Q ${n} 240 ${t} ${Ls}`),w.style.opacity=`1`}else w.style.opacity=`0`;let u=Object.entries(n);u.length===0?k.style.opacity=`1`:k.style.opacity=`0`,M.forEach((e,n)=>{let r=u[n];if(r===void 0){e.g.style.opacity=`0`;return}let[i,a]=r;e.g.style.opacity=`1`,e.k.textContent=i,e.val.textContent=`↓${a}`;let o=t.phase===`put`&&Number(i)===t.x&&a===t.i,s=t.hitIdx!==null&&Number(a)===t.hitIdx&&t.phase===`hit`;e.g.setAttribute(`class`,`ts-card${s?` is-hit`:o?` is-new`:``}`)}),N.setAttribute(`class`,r?`ts-banner__box is-answer`:`ts-banner__box`),I.textContent=r?`[${r[0]}, ${r[1]}]`:`—`,t.phase===`init`?P.textContent=`nums = [${i.join(`, `)}]，target = ${a}`:t.phase===`miss`?P.textContent=`需要 ${a} - ${t.x} = ${t.need}，查表：没有`:t.phase===`put`?P.textContent=`把 ${t.x} → ${t.i} 登记进表`:t.phase===`hit`?P.textContent=`需要 ${a} - ${t.x} = ${t.need}，查表：命中下标 ${t.hitIdx}`:t.phase===`verify`?P.textContent=`验证 ${i[r[0]]} + ${i[r[1]]} = ${a} ✓`:P.textContent=r?`完成：nums[${r[0]}] + nums[${r[1]}] = ${a}`:`没有找到任何一对`,Z(L,t.desc)}c.appendChild(L);let z=Q();c.appendChild(z.root),e.textContent=``,e.appendChild(c),X();let B=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,V=$({steps:n,controls:z,intervalMs:Us,onRender:R});V.jumpTo(Math.trunc(t.initialStep)||0);let H=null;return r&&!B&&typeof IntersectionObserver==`function`&&(H=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){H.disconnect(),H=null,V.play();return}},{threshold:.35}),H.observe(c)),{destroy(){H&&=(H.disconnect(),null),V.destroy(),e.textContent=``,delete e.dataset.tsMounted,document.getElementById(js)?.remove()}}}var Js=[-1,0,1,2,-1,-4];function Ys(e={}){let t=Array.isArray(e.nums)?e.nums:Js,n=[...t].sort((e,t)=>e-t),r=n.length,i=Number.isInteger(e.maxSteps)?e.maxSteps:400,a={i:-1,l:-1,r:-1,sum:null,sumL:null,sumR:null,lFrom:null,rFrom:null,dedupL:null,dedupR:null,hit:null,results:[],roundOver:!1};if(r<3)return[{...a,arr:[...n],original:[...t],phase:`done`,desc:`数组只有 \`${r}\` 个数，**凑不出三个**，直接返回空列表。题目虽然不会这么给，但状态机要有安静的出口。`,roundOver:!0,done:!0}];let o=[],s=[],c=0,l=e=>`[${e.join(`, `)}]`,u=()=>s.length===0?`[]`:`[${s.map(l).join(`, `)}]`,d=e=>e<0?`(${e})`:`${e}`,f=(e,r,i={})=>{o.push({...a,arr:[...n],original:[...t],results:s.map(e=>[...e]),phase:e,desc:r,done:e===`done`,...i})},p=0,m=0,h=0,g=`outer`;for(f(`init`,`要在 \`${l(t)}\` 里找出**所有**和为 \`0\` 的三元组，而且结果里**不能有重复**。暴力枚举三个下标是 \`O(n³)\`；直接照搬"两数之和"那套哈希表也不好使 —— 哈希能找出和为 0 的组合，但它回答不了"这一组是不是早就出现过了"，去重无处下手。标准路线只有一条：**先排序，再固定一个数，用双指针夹逼另外两个**。排序后数组是 \`${l(n)}\`。这里要点破一个误解：**排序的收益不是"查找更快"**（这题压根没有查找），而是**让相同的数挨在一起** —— 后面两处去重全靠这一点才写得出来。`);c<i;){if(c+=1,g===`outer`){if(p>=r-2)break;let e=n[p];if(e>0){f(`prune`,`\`i = ${p}\`，\`nums[${p}] = ${e} > 0\`。数组已经是升序的，\`i\` 后面的数只会**更大** —— 三个正数加起来不可能等于 \`0\`。所以这里直接 \`break\`，外层循环整体结束，不用再往后看了。`,{i:p});break}if(p>0&&n[p]===n[p-1]){f(`skip-i`,`\`i = ${p}\`，\`nums[${p}] = ${e}\` 和上一轮的 \`nums[${p-1}] = ${n[p-1]}\` **完全相同**。上一轮已经把"以 \`${e}\` 为最小数"的所有三元组找完了，这一轮只会把同样的答案**原样再找一遍**。所以**直接跳过整个内层循环**（\`continue\`）—— 这是第一处去重，注意它的形态是"**事前跳过**"：内层还没开始跑，就知道它毫无意义。另外判断条件里的 \`i > 0\` 不能省：\`i = 0\` 时 \`nums[i - 1]\` 会绕到数组末尾（Python 的负索引特性），比的根本不是"前一个"。`,{i:p,roundOver:!0}),p+=1;continue}m=p+1,h=r-1,f(`pick-i`,`外层固定 \`i = ${p}\`，\`nums[${p}] = ${e}\` —— 它就是这一轮三元组里**最小的那个数**。左指针 \`l = ${m}\`、右指针 \`r = ${h}\`，接下来要在 \`nums[${m}..${h}]\` 里找两个数，使它们的和刚好等于 \`${-e}\`（这样再加上 \`${e}\` 就是 \`0\`）。`,{i:p,l:m,r:h}),g=`inner`;continue}if(g===`inner`){if(m>=h){p+=1,g=`outer`;continue}let e=m,t=h,r=n[p]+n[e]+n[t],i=`\`nums[${p}] + nums[${e}] + nums[${t}]\` = \`${d(n[p])} + ${d(n[e])} + ${d(n[t])} = ${r}\`，`;if(r<0){m+=1,f(`squeeze`,i+"**和太小了**。`i` 已经固定、`r` 又是当前能取到的最大值，唯一能做的就是**把 `l` 往右挪一格**，去够一个更大的数。"+(m>=h?` 挪完 \`l = ${m}\` 已经碰到 \`r\` —— **这一轮结束**。`:``),{i:p,l:m,r:h,sum:r,sumL:e,sumR:t,lFrom:e,roundOver:m>=h});continue}if(r>0){--h,f(`squeeze`,i+"**和太大了**。`i` 已经固定、`l` 又是当前能取到的最小数，唯一能做的就是**把 `r` 往左挪一格**，去够一个更小的数。"+(m>=h?` 挪完 \`r = ${h}\` 已经碰到 \`l\` —— **这一轮结束**。`:``),{i:p,l:m,r:h,sum:r,sumL:e,sumR:t,rFrom:t,roundOver:m>=h});continue}let a=[n[p],n[m],n[h]];s.push(a),f(`hit`,i+` **正好是 \`0\` —— 命中！** 记录一组 \`${l(a)}\`。但别急着移动指针：\`l\` 的右边、\`r\` 的左边，可能还贴着**和它们一模一样的值**，用那些位置当指针会产出和 \`${l(a)}\` 完全相同的三元组。所以下一步必须先**去重**，再各向内走一格。`,{i:p,l:m,r:h,sum:0,sumL:m,sumR:h,hit:a}),g=`dedup`;continue}let e=m,t=h;for(;m<h&&n[m]===n[m+1];)m+=1;for(;m<h&&n[h]===n[h-1];)--h;let i=m===e?null:{from:e,to:m},a=h===t?null:{from:h,to:t};m+=1,--h;let o=[];i?o.push(`\`l\` 从 \`${e}\` 一路跳到 \`${m}\` —— \`nums[${e}..${m}]\` 是同一个值 \`${n[e]}\`，换哪个当下标都是同一个答案。`):o.push(`\`l\` 右边是 \`nums[${e+1}] = ${n[e+1]}\`，和 \`nums[${e}] = ${n[e]}\` 不同，不需要跳。`),a?o.push(`\`r\` 从 \`${t}\` 一路退到 \`${h}\` —— \`nums[${h}..${t}]\` 是同一个值 \`${n[t]}\`。`):o.push(`\`r\` 左边是 \`nums[${t-1}] = ${n[t-1]}\`，和 \`nums[${t}] = ${n[t]}\` 不同，不需要跳。`),f(`dedup`,`**第二处去重**：`+o.join(``)+` 然后左右各向内走一格，\`l = ${m}\`、\`r = ${h}\`。`+(m>=h?" 此时 `l` 和 `r` 已经交叉 —— **这一轮结束**，`i` 前进一格。":``)+` 这处去重的形态和上一处相反：它是"**事后跳过**" —— 必须先把答案记下来，才知道该从哪个位置开始跳。`,{i:p,l:m,r:h,lFrom:e,rFrom:t,dedupL:i,dedupR:a,roundOver:m>=h}),g=`inner`}let _=s.length;return f(`done`,(_===0?"扫描结束，**没有任何**三元组的和为 `0`，返回空列表。":`扫描结束。答案 = \`${u()}\`，一共 **${_} 组**，且两两不重复。`)+` 回头看这趟是怎么走完的：外层 \`i\` 从 \`0\` 推进到 \`${Math.min(p,r-3)}\`，每一轮里 \`l\` 和 \`r\` 从两端往中间夹、两者合计最多走 \`n\` 步，所以内层是 \`O(n)\`，乘上外层就是 **\`O(n²)\`**；再加上开头那次排序 \`O(n log n)\`，总量级仍然是 \`O(n²)\`。空间 \`O(1)\`（不计结果本身）。对比暴力三重循环的 \`O(n³)\`：**多花一个 \`O(n log n)\` 的排序，把内层从 \`O(n²)\` 压到 \`O(n)\`，这笔买卖非常划算**。而且排序顺带把"去重"变成了两处 \`O(1)\` 的值比较 —— **相同的数挨在一起，跳过重复就退化成"跟前一个比一比"。**`,{i:Math.min(p,r-1),l:m,r:h,roundOver:!0,done:!0}),o}var Xs=`tz-styles`,Zs=56,Qs=76,$s=8,ec=66,tc=128,nc=196,rc=234,ic=22,ac=54,oc=284,sc=48,cc=358,lc=368,uc=40,dc=26,fc=604,pc=1180,mc=`
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
`;function hc(){if(document.getElementById(Xs))return;let e=document.createElement(`style`);e.id=Xs,e.textContent=mc,document.head.appendChild(e)}var gc=e=>e<0?`(${e})`:`${e}`;function _c(e,t={}){if(!e||e.dataset.tzMounted===`1`)return{destroy(){}};e.dataset.tzMounted=`1`,hc();let n=Ys(t),r=t.autoplay!==!1,i=n[0].arr,a=n[0].original,o=i.length,s=Y,c=document.createElement(`div`);c.className=`viz tz`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(o<3){let t=s(`svg`,{class:`viz__svg tz__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`tz-empty__text`,x:620/2,y:120/2});return n.textContent=`数组只有 ${o} 个数，凑不出三元组`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),{destroy(){e.textContent=``,delete e.dataset.tzMounted,document.getElementById(Xs)?.remove()}}}let d=Qs,f=$s,p=o*d+(o-1)*f;if(p>fc){let e=fc/p;d=Math.max(26,Math.floor(d*e)),f=Math.max(3,Math.floor(f*e))}let m=i.reduce((e,t)=>Math.max(e,String(t).length),1),h=Math.max(11,Math.min(20,Math.floor((d-12)/Math.max(m,3))+6)),g=o*d+(o-1)*f,_=Math.max(660,dc*2+g),v=(_-g)/2,y=e=>v+e*(d+f),b=e=>y(e)+d/2,x=_-dc*2,S=s(`svg`,{class:`viz__svg tz__svg`,viewBox:`0 0 ${_} 430`,role:`img`,"aria-label":`三数之和推演动画`});l.appendChild(S);let C=s(`g`,{class:`tz-notes`}),w=s(`g`,{class:`tz-cells`}),T=s(`g`,{class:`tz-marks`});S.appendChild(C),S.appendChild(w),S.appendChild(T);let E=s(`text`,{class:`tz-note`,x:dc,y:ec});E.textContent=`原数组 [${a.join(`, `)}] · 已排序 → [${i.join(`, `)}]`,C.appendChild(E);let D=[];for(let e=0;e<o;e+=1){let t=y(e),n=s(`g`,{class:`tz-cell`});n.appendChild(s(`rect`,{class:`tz-cell__ring`,x:t-5,y:tc-5,width:d+10,height:66,rx:11})),n.appendChild(s(`rect`,{class:`tz-cell__box`,x:t,y:tc,width:d,height:Zs,rx:8}));let r=s(`text`,{class:`tz-cell__value`,x:b(e),y:156,style:`font-size:${h}px`});r.textContent=String(i[e]),n.appendChild(r),w.appendChild(n),D.push({g:n,id:e})}function O(e){let t=s(`line`,{class:`tz-pin__tick ${e}`,x1:0,y1:0,x2:0,y2:0}),n=s(`rect`,{class:`tz-pin__tag ${e}`,x:0,y:0,width:ac,height:ic,rx:6}),r=s(`text`,{class:`tz-pin__text`,x:0,y:0});return T.appendChild(t),T.appendChild(n),T.appendChild(r),{tick:t,tag:n,text:r}}let k=s(`path`,{class:`tz-pin__tag`,d:`M 0 0 L 0 0 L 0 0`}),A=s(`rect`,{class:`tz-pin__tag`,x:0,y:0,width:ac,height:ic,rx:6}),j=s(`text`,{class:`tz-pin__text`,x:0,y:0});T.appendChild(k),T.appendChild(A),T.appendChild(j);let M=O(`is-l`),N=O(`is-r`),P=s(`rect`,{class:`tz-banner__box`,x:dc,y:oc,width:x,height:sc,rx:9}),F=s(`text`,{class:`tz-banner__expr`,x:42,y:308}),I=s(`text`,{class:`tz-banner__verdict`,x:dc+x-16,y:308});T.appendChild(P),T.appendChild(F),T.appendChild(I);let L=s(`text`,{class:`tz-list__title`,x:dc,y:cc});T.appendChild(L);let R=s(`text`,{class:`tz-list__empty`,x:dc,y:388});R.textContent=`（还没有找到任何一组）`,T.appendChild(R);let z=n.flatMap(e=>e.results).reduce((e,t)=>Math.max(e,`[${t.join(`, `)}]`.length),0),B=Math.min(150,Math.max(74,Math.round(z*15*.62)+26)),V=Math.max(1,Math.floor(614/(B+10))),H=[];for(let e=0;e<V;e+=1){let t=dc+e*(B+10),n=s(`g`,{class:`tz-chip`});n.appendChild(s(`rect`,{class:`tz-chip__box`,x:t,y:lc,width:B,height:uc,rx:8}));let r=s(`text`,{class:`tz-chip__text`,x:t+B/2,y:388,style:`font-size:15px`});n.appendChild(r),T.appendChild(n),H.push({g:n,t:r})}let U=s(`text`,{class:`tz-list__empty`,x:dc+V*(B+10),y:388});T.appendChild(U);let ee=u();function te(e,t){if(!t)return;let n=t.i,r=t.l,a=t.r,s=t.phase,c=s===`done`,l=r>=0&&r===a,u=new Set;s===`hit`&&t.sumL!==null&&(u.add(t.i),u.add(t.sumL),u.add(t.sumR));let d=new Set;if(t.dedupL)for(let e=t.dedupL.from;e<=t.dedupL.to;e+=1)d.add(e);if(t.dedupR)for(let e=t.dedupR.from;e<=t.dedupR.to;e+=1)d.add(e);let f=s===`skip-i`?t.i:null;for(let e of D){let{g:t,id:i}=e;if(c){t.setAttribute(`class`,`tz-cell`);continue}let o=[`tz-cell`];(d.has(i)||i===f)&&o.push(`is-dup`),u.has(i)&&o.push(`is-hit`),i===r&&r>=0&&o.push(`is-l`),i===a&&a>=0&&!l&&o.push(`is-r`),i===n&&n>=0&&i!==f&&o.push(`is-i`),t.setAttribute(`class`,o.join(` `))}if(!c&&n>=0&&n<o){let e=b(n),t=tc-2,r=t-11;k.setAttribute(`d`,`M ${e-7} ${r} L ${e+7} ${r} L ${e} ${t} z`),k.style.opacity=`1`,A.setAttribute(`x`,e-ac/2),A.setAttribute(`y`,r-ic-5),j.setAttribute(`x`,e),j.setAttribute(`y`,r-ic/2-5),j.textContent=`i=${n}`,A.style.opacity=`1`,j.style.opacity=`1`}else k.style.opacity=`0`,A.style.opacity=`0`,j.style.opacity=`0`;let p=(e,t,n,r)=>{if(t<0||t>=o){e.tick.style.opacity=`0`,e.tag.style.opacity=`0`,e.text.style.opacity=`0`;return}let i=b(t);e.tick.setAttribute(`x1`,i),e.tick.setAttribute(`x2`,i),e.tick.setAttribute(`y1`,187),e.tick.setAttribute(`y2`,n-3),e.tick.style.opacity=`1`,e.tag.setAttribute(`x`,i-ac/2),e.tag.setAttribute(`y`,n),e.text.setAttribute(`x`,i),e.text.setAttribute(`y`,n+ic/2),e.text.textContent=`${r}=${t}`,e.tag.style.opacity=`1`,e.text.style.opacity=`1`};c?(p(M,-1,nc,`L`),p(N,-1,rc,`R`)):l?(p(M,r,nc,`L=R`),p(N,-1,rc,`R`)):(p(M,r,nc,`L`),p(N,a,rc,`R`));let m=`tz-banner__box`,h=`tz-banner__verdict`;t.sum===null?(F.textContent=s===`init`?`等待开始 · 共 ${o} 个数`:s===`pick-i`?`固定 nums[${n}] = ${i[n]}，在 [${r}..${a}] 里找和为 ${-i[n]} 的两个数`:s===`skip-i`?`nums[${n}] = ${i[n]} 与上一轮同值 —— 整轮跳过`:s===`prune`?`nums[${n}] = ${i[n]} > 0 —— 外层提前结束`:t.results.length===0?`没有和为 0 的三元组`:`结束 · 共 ${t.results.length} 组答案`,I.textContent=s===`pick-i`?`双指针夹逼`:s===`done`?`${t.results.length} 组`:``):(F.textContent=`${gc(i[n])} + ${gc(i[t.sumL])} + ${gc(i[t.sumR])} = ${t.sum}`,t.sum<0?(m+=` is-neg`,h+=` is-neg`,I.textContent=`< 0 · 左指针右移`):t.sum>0?(m+=` is-pos`,h+=` is-pos`,I.textContent=`> 0 · 右指针左移`):(m+=` is-zero`,h+=` is-zero`,I.textContent=`= 0 · 命中`)),P.setAttribute(`class`,m),I.setAttribute(`class`,h);let g=t.results;L.textContent=`已收集的三元组（${g.length} 组）`,R.style.opacity=g.length===0?`1`:`0`,H.forEach((e,t)=>{let n=g[t];if(n===void 0){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`,e.t.textContent=`[${n.join(`, `)}]`}),g.length>V?(U.textContent=`+${g.length-V}`,U.style.opacity=`1`):U.style.opacity=`0`,Z(ee,t.desc)}c.appendChild(ee);let W=Q();c.appendChild(W.root),e.textContent=``,e.appendChild(c),X();let G=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,K=$({steps:n,controls:W,intervalMs:pc,onRender:te});K.jumpTo(Math.trunc(t.initialStep)||0);let ne=null;return r&&!G&&typeof IntersectionObserver==`function`&&(ne=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){ne.disconnect(),ne=null,K.play();return}},{threshold:.35}),ne.observe(c)),{destroy(){ne&&=(ne.disconnect(),null),K.destroy(),e.textContent=``,delete e.dataset.tzMounted,document.getElementById(Xs)?.remove()}}}var vc=[0,1,0,2,1,0,1,3,2,1,2,1];function yc(e={}){let t=Array.isArray(e.height)?e.height:vc,n=t.length,r=Number.isInteger(e.maxSteps)?e.maxSteps:400,i={height:[...t],water:Array(n).fill(0),l:0,r:n-1,leftMax:0,rightMax:0,side:null,idx:null,gained:0,total:0};if(n<3)return[{...i,r:n===0?-1:n-1,phase:`done`,desc:`只有 \`${n}\` 根柱子 —— 少于三根就围不出凹槽，**接不住任何水**，答案是 \`0\`。`,done:!0}];let a=[],o=Array(n).fill(0),s=0,c=n-1,l=0,u=0,d=0,f=0,p=(e,t,n={})=>{a.push({...i,water:[...o],l:s,r:c,leftMax:l,rightMax:u,total:d,phase:e,desc:t,done:e===`done`,...n})};for(p(`init`,`给出了 \`${n}\` 根柱子的高度图 \`[${t.join(`, `)}]\`。先想清楚一件事：**位置 \`i\` 能存多少水，只取决于它左边最高的柱子和右边最高的柱子** —— 水会从矮的那一边漏出去，能留住的高度是两者的**短板**，也就是 \`water[i] = max(0, min(左最高, 右最高) - height[i])\`。所以整题其实只在问一句话：**每个位置的"左右最高"分别是多少？** 后面四种解法的全部区别，就是"怎么拿到这两个数"。双指针的做法是：**两端各派一个指针往中间夹**，一边走一边记录"这一侧到目前为止见过的最高"（\`leftMax\` 和 \`rightMax\`），**谁矮就先结算谁**。`);s<c&&(f+=1,!(f>r));){let e=t[s],n=t[c];if(e<n){let t=l;l=Math.max(l,e);let r=l-e;d+=r,o[s]=r,p(`settle-l`,`\`l = ${s}\`、\`r = ${c}\`。比较两端：\`height[${s}] = ${e}\` **<** \`height[${c}] = ${n}\` —— **左端更矮，结算左边这一格**。为什么敢现在就定它的水位？因为 \`${s}\` 的右边至少有一根高度 \`>= ${n}\` 的柱子（就是 \`r\` 自己那根），而 \`${n} > ${e}\` —— 它的"右侧最高"一定严格大于它自己的高度，**右边不可能成为短板**；真正决定水位的只可能是左侧，而 \`leftMax\` 是我们一路扫过来已经确切知道的数。结算：\`leftMax = max(${t}, ${e}) = ${l}\`，这一格的水 = \`${l} - ${e} = ${r}\``+(r===0?`（**它是目前左边最高的柱子**，自己就是边界，存不住水）。`:`。`),{side:`l`,idx:s,gained:r,leftMax:l,total:d}),s+=1}else{let t=u;u=Math.max(u,n);let r=u-n;d+=r,o[c]=r,p(`settle-r`,`\`l = ${s}\`、\`r = ${c}\`。比较两端：\`height[${s}] = ${e}\` **>=** \`height[${c}] = ${n}\` —— **右端更矮（或一样高），结算右边这一格**。道理是对称的：\`${c}\` 的左边至少有一根高度 \`>= ${e}\` 的柱子（就是 \`l\` 自己那根），而 \`${e} >= ${n}\` —— 它的"左侧最高"不会成为短板，水位只能由右侧决定，而 \`rightMax\` 是我们从右扫过来已经确切知道的数。结算：\`rightMax = max(${t}, ${n}) = ${u}\`，这一格的水 = \`${u} - ${n} = ${r}\``+(r===0?`（**它是目前右边最高的柱子**，自己就是边界，存不住水）。`:`。`),{side:`r`,idx:c,gained:r,rightMax:u,total:d}),--c}}let m=o.map((e,t)=>e>0?t:-1).filter(e=>e>=0);return p(`done`,(d===0?`扫描结束，**一滴水都接不住**（没有形成任何凹槽）。`:`扫描结束。**答案 = \`${d}\`** 单位的水，落在下标 \`[${m.join(`, `)}]\` 这几格上。`)+' 回头看这趟：`l` 和 `r` 从两端往中间走，**每一次只动一个指针，两个指针合计最多走 `n` 步** —— 所以是 `O(n)` 时间。全程只用了 `l`、`r`、`leftMax`、`rightMax`、`ans` 五个变量 —— **`O(1)` 空间**，比动态规划那两个数组的版本还省。它为什么能省掉那两个数组？因为**它根本不需要知道"每个位置的两侧最高"** —— 它只在"较矮的那一端"结算，而那一端的水位恰好已经确定。',{side:null,idx:null,gained:0,done:!0}),a}var bc=`trw-styles`,xc=54,Sc=88,Cc=46,wc=158,Tc=320,Ec=46,Dc=3,Oc=14,kc=336,Ac=352,jc=380,Mc=22,Nc=54,Pc=26,Fc=604,Ic=1250,Lc=`
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
`;function Rc(){if(document.getElementById(bc))return;let e=document.createElement(`style`);e.id=bc,e.textContent=Lc,document.head.appendChild(e)}function zc(e,t={}){if(!e||e.dataset.trwMounted===`1`)return{destroy(){}};e.dataset.trwMounted=`1`,Rc();let n=yc(t),r=t.autoplay!==!1,i=n[0].height,a=i.length,o=Y,s=document.createElement(`div`);s.className=`viz trw`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);function l(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(a<3){let t=o(`svg`,{class:`viz__svg trw__svg`,viewBox:`0 0 620 120`,role:`img`}),n=o(`text`,{class:`trw-empty__text`,x:620/2,y:120/2});return n.textContent=`只有 ${a} 根柱子，围不出凹槽，接不住水`,t.appendChild(n),c.appendChild(t),s.appendChild(l()),s.appendChild(Q().root),e.textContent=``,e.appendChild(s),{destroy(){e.textContent=``,delete e.dataset.trwMounted,document.getElementById(bc)?.remove()}}}let u=Ec;a*u+(a-1)*Dc>Fc&&(u=Math.max(8,Math.floor((Fc-(a-1)*Dc)/a)));let d=a*u+(a-1)*Dc,f=Math.max(660,Pc*2+d),p=(f-d)/2,m=e=>p+e*(u+Dc),h=e=>m(e)+u/2,g=Math.max(...i),_=wc/Math.max(g,1),v=e=>Tc-e*_,y=f-Pc*2,b=o(`svg`,{class:`viz__svg trw__svg`,viewBox:`0 0 ${f} 422`,role:`img`,"aria-label":`接雨水双指针推演动画`});c.appendChild(b);let x=o(`g`,{class:`trw-waters`}),S=o(`g`,{class:`trw-bars`}),C=o(`g`,{class:`trw-marks`});b.appendChild(x),b.appendChild(S),b.appendChild(C);let w=o(`text`,{class:`trw-note`,x:Pc,y:xc});w.textContent=`每格的水 = max(0, min(左最高, 右最高) - 自身高度) · 谁矮先结算谁`,C.appendChild(w);let T=o(`line`,{class:`trw-ground`,x1:p-10,y1:Tc,x2:p+d+10,y2:Tc});C.appendChild(T);let E=[];for(let e=0;e<a;e+=1){let t=m(e),n=o(`g`,{class:`trw-bar`});n.appendChild(o(`rect`,{class:`trw-bar__ring`,x:t-4,y:v(i[e])-4,width:u+8,height:Math.max(6,i[e]*_+8),rx:5})),n.appendChild(o(`rect`,{class:`trw-bar__box`,x:t,y:v(i[e]),width:u,height:Math.max(2,i[e]*_),rx:3}));let r=o(`text`,{class:`trw-bar__h`,x:h(e),y:Tc-Oc});r.textContent=String(i[e]),n.appendChild(r),S.appendChild(n);let a=o(`rect`,{class:`trw-bar__water`,x:t,y:v(i[e]),width:u,height:0,rx:2});x.appendChild(a),E.push({g:n,w:a,id:e})}for(let e=0;e<a;e+=1){let t=o(`text`,{class:`trw-idx`,x:h(e),y:kc});t.textContent=String(e),C.appendChild(t)}function D(e){let t=o(`line`,{class:`trw-pin__tick ${e}`,x1:0,y1:0,x2:0,y2:0}),n=o(`rect`,{class:`trw-pin__tag ${e}`,x:0,y:0,width:Nc,height:Mc,rx:6}),r=o(`text`,{class:`trw-pin__text`,x:0,y:0});return C.appendChild(t),C.appendChild(n),C.appendChild(r),{tick:t,tag:n,text:r}}let O=D(`is-l`),k=D(`is-r`),A=o(`rect`,{class:`trw-banner__box`,x:Pc,y:Sc,width:y,height:Cc,rx:9});C.appendChild(A);let j=o(`text`,{class:`trw-banner__seg`,x:44,y:111}),M=o(`text`,{class:`trw-banner__seg`,x:196,y:111});C.appendChild(j),C.appendChild(M);let N=o(`text`,{class:`trw-banner__label`,x:Pc+y-68,y:111});N.textContent=`累计水量`,C.appendChild(N);let P=o(`text`,{class:`trw-banner__ans`,x:Pc+y-18,y:111});P.textContent=`0`,C.appendChild(P);let F=l();function I(e,t){if(!t)return;let n=t.l,r=t.r,o=t.idx,s=t.water,c=t.phase===`done`;for(let e of E){let{g:t,w:n,id:r}=e,a=s[r];if(a>0){let e=v(i[r]+a);n.setAttribute(`y`,e),n.setAttribute(`height`,a*_),n.style.opacity=`1`}else n.style.opacity=`0`,n.setAttribute(`height`,0);let l=[`trw-bar`];!c&&r===o&&l.push(`is-cur`),t.setAttribute(`class`,l.join(` `))}let l=(e,t,i,o)=>{if(c||t<0||t>=a){e.tick.style.opacity=`0`,e.tag.style.opacity=`0`,e.text.style.opacity=`0`;return}let s=h(t);e.tick.setAttribute(`x1`,s),e.tick.setAttribute(`x2`,s),e.tick.setAttribute(`y1`,324),e.tick.setAttribute(`y2`,i-3),e.tick.style.opacity=`1`,e.tag.setAttribute(`x`,s-Nc/2),e.tag.setAttribute(`y`,i),e.text.setAttribute(`x`,s),e.text.setAttribute(`y`,i+Mc/2),e.text.textContent=n===r?`${o===`L`?`L=R`:`R`}=${t}`:`${o}=${t}`,e.tag.style.opacity=`1`,e.text.style.opacity=`1`};n===r?(l(O,n,Ac,`L`),k.tick.style.opacity=`0`,k.tag.style.opacity=`0`,k.text.style.opacity=`0`):(l(O,n,Ac,`L`),l(k,r,jc,`R`)),j.textContent=`leftMax = ${t.leftMax}`,M.textContent=`rightMax = ${t.rightMax}`,P.textContent=String(t.total),Z(F,t.desc)}s.appendChild(F);let L=Q();s.appendChild(L.root),e.textContent=``,e.appendChild(s),X();let R=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,z=$({steps:n,controls:L,intervalMs:Ic,onRender:I});z.jumpTo(Math.trunc(t.initialStep)||0);let B=null;return r&&!R&&typeof IntersectionObserver==`function`&&(B=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){B.disconnect(),B=null,z.play();return}},{threshold:.35}),B.observe(s)),{destroy(){B&&=(B.disconnect(),null),z.destroy(),e.textContent=``,delete e.dataset.trwMounted,document.getElementById(bc)?.remove()}}}var Bc=[0,1,0,2,1,0,1,3,2,1,2,1];function Vc(e={}){let t=Array.isArray(e.height)?e.height:Bc,n=t.length,r=Number.isInteger(e.maxSteps)?e.maxSteps:400,i={height:[...t],water:Array(n).fill(0),i:-1,stack:[],bottom:null,leftBound:null,rightBound:null,width:null,layerH:null,level:null,gained:0,total:0};if(n<3)return[{...i,phase:`done`,desc:`只有 \`${n}\` 根柱子 —— 少于三根就围不出凹槽，**接不住任何水**，答案是 \`0\`。`,done:!0}];let a=[],o=Array(n).fill(0),s=[],c=0,l=0,u=(e,t,n={})=>{a.push({...i,water:[...o],stack:[...s],total:c,phase:e,desc:t,done:e===`done`,...n})};u(`init`,`还是这排柱子 \`[${t.join(`, `)}]\`，但**换一种切法**。前面两种解法（暴力 / 动态规划 / 双指针）都是**竖着切**：站在位置 \`i\` 上问"我头顶能存多少水"，一次算完一整列。单调栈是**横着切**：不问每一列，而是**找到一个凹槽就结算一整层**。做法是：用一个栈存**下标**，并让这些下标对应的高度**单调递减**。一旦遇到一根**比栈顶更高**的柱子，就说明凹槽的右边界出现了 —— 栈顶那个是槽底，弹出后的新栈顶是左边界，当前这根是右边界，于是可以算这一层：\`宽 = 右边界 - 左边界 - 1\`，\`高 = min(左边界高, 右边界高) - 槽底高\`，\`水量 += 宽 × 高\`。**这个视角最直观的差别是：同一个位置的水可能被分几次加上**（一次一层）。官方例里下标 5 那 2 单位的水就是这么来的 —— 留意它。`);for(let e=0;e<n&&(l+=1,!(l>r));e+=1){let n=t[e];for(;s.length>0&&n>t[s[s.length-1]];){let r=s.pop(),i=t[r];if(s.length===0){u(`settle`,`\`i = ${e}\`，\`height[${e}] = ${n}\` **>** 栈顶 \`height[${r}] = ${i}\` —— 右边界出现了。弹出槽底 \`${r}\`，可此时栈**空了** —— **只有右边界、没有左边界，围不出凹槽**，这一层结算为 \`0\`。（这就是代码里 \`if not stack: break\` 那一行的意思。）`,{i:e,bottom:r,gained:0,width:0,layerH:0,level:0});break}let a=s[s.length-1],l=t[a],d=Math.min(n,l),f=d-i,p=e-a-1;if(f>0)for(let n=a+1;n<e;n+=1)o[n]=Math.max(o[n],d-t[n]);let m=p*f;c+=m,u(`settle`,`\`i = ${e}\`，\`height[${e}] = ${n}\` **>** 栈顶 \`height[${r}] = ${i}\` —— 右边界出现了。弹出槽底 \`${r}\`（高度 \`${i}\`）；弹出后的新栈顶 \`${a}\`（高度 \`${l}\`）就是**左边界**，当前这根 \`${e}\`（高度 \`${n}\`）是**右边界**。这一层的水位由两边**较矮的那根**决定：\`min(${n}, ${l}) = ${d}\`。于是 \`高 = ${d} - ${i} = ${f}\`，\`宽 = ${e} - ${a} - 1 = ${p}\`，水量 += \`${p} × ${f} = ${m}\`。`,{i:e,bottom:r,leftBound:a,rightBound:e,width:p,layerH:f,level:d,gained:m})}s.push(e),u(`push`,`\`i = ${e}\`，\`height[${e}] = ${n}\`。`+(s.length>1?`它不高于栈顶 \`height[${s[s.length-2]}] = ${t[s[s.length-2]]}\`，栈内高度保持**递减**，直接压入。`:`栈是空的，直接压入。`)+` 栈 = \`[${s.join(`, `)}]\`。`,{i:e})}let d=o.map((e,t)=>e>0?t:-1).filter(e=>e>=0);return u(`done`,(c===0?`扫描结束，**一滴水都接不住**。`:`扫描结束。**答案 = \`${c}\`** 单位的水，落在下标 \`[${d.join(`, `)}]\` 这几格上。`)+' 和双指针那边的答案**一模一样** —— 它们只是**切法不同**：双指针是竖着切（一次算完一整列），单调栈是横着切（一次填满一层）。回头看下标 5 那格：它的 `2` 单位水是**分两次**加上的 —— `i = 6` 时加了 1 层，`i = 7` 时又加了 1 层。这就是"按层累加"最硬的证据。复杂度：每个下标**恰好入栈一次、出栈一次**，`while` 的总执行次数不超过 `n` —— 所以是 `O(n)` 时间、**`O(n)` 空间**（栈最坏能装下全部下标）。',{i:n-1,done:!0}),a}var Hc=`trs-styles`,Uc=54,Wc=88,Gc=46,Kc=158,qc=320,Jc=46,Yc=3,Xc=14,Zc=336,Qc=20,$c=362,el=376,tl=34,nl=34,rl=4,il=26,al=604,ol=1100,sl=`
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
`;function cl(){if(document.getElementById(Hc))return;let e=document.createElement(`style`);e.id=Hc,e.textContent=sl,document.head.appendChild(e)}function ll(e,t={}){if(!e||e.dataset.trsMounted===`1`)return{destroy(){}};e.dataset.trsMounted=`1`,cl();let n=Vc(t),r=t.autoplay!==!1,i=n[0].height,a=i.length,o=Y,s=document.createElement(`div`);s.className=`viz trs`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);function l(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(a<3){let t=o(`svg`,{class:`viz__svg trs__svg`,viewBox:`0 0 620 120`,role:`img`}),n=o(`text`,{class:`trs-empty__text`,x:620/2,y:120/2});return n.textContent=`只有 ${a} 根柱子，围不出凹槽，接不住水`,t.appendChild(n),c.appendChild(t),s.appendChild(l()),s.appendChild(Q().root),e.textContent=``,e.appendChild(s),{destroy(){e.textContent=``,delete e.dataset.trsMounted,document.getElementById(Hc)?.remove()}}}let u=Jc;a*u+(a-1)*Yc>al&&(u=Math.max(8,Math.floor((al-(a-1)*Yc)/a)));let d=a*u+(a-1)*Yc,f=Math.max(660,il*2+d),p=(f-d)/2,m=e=>p+e*(u+Yc),h=e=>m(e)+u/2,g=Math.max(...i),_=Kc/Math.max(g,1),v=e=>qc-e*_,y=tl;a*y+(a-1)*rl>al&&(y=Math.max(14,Math.floor((al-(a-1)*rl)/a)));let b=(f-(a*y+(a-1)*rl))/2,x=f-il*2,S=o(`svg`,{class:`viz__svg trs__svg`,viewBox:`0 0 ${f} 430`,role:`img`,"aria-label":`接雨水单调栈推演动画`});c.appendChild(S);let C=o(`g`,{class:`trs-waters`}),w=o(`g`,{class:`trs-bars`}),T=o(`g`,{class:`trs-layers`}),E=o(`g`,{class:`trs-marks`});S.appendChild(C),S.appendChild(w),S.appendChild(T),S.appendChild(E);let D=o(`text`,{class:`trs-note`,x:il,y:Uc});D.textContent=`横着切：栈内高度递减，遇到更高的柱子就结算一层`,E.appendChild(D),E.appendChild(o(`line`,{class:`trs-ground`,x1:p-10,y1:qc,x2:p+d+10,y2:qc}));let O=[];for(let e=0;e<a;e+=1){let t=m(e),n=o(`g`,{class:`trs-bar`});n.appendChild(o(`rect`,{class:`trs-bar__box`,x:t,y:v(i[e]),width:u,height:Math.max(2,i[e]*_),rx:3}));let r=o(`text`,{class:`trs-bar__h`,x:h(e),y:qc-Xc});r.textContent=String(i[e]),n.appendChild(r),w.appendChild(n);let a=o(`rect`,{class:`trs-bar__water`,x:t,y:v(i[e]),width:u,height:0,rx:2});C.appendChild(a),O.push({g:n,w:a,id:e})}let k=o(`rect`,{class:`trs-layer`,x:0,y:0,width:0,height:0,rx:2});T.appendChild(k);for(let e=0;e<a;e+=1){let t=o(`text`,{class:`trs-idx`,x:h(e),y:Zc});t.textContent=String(e),E.appendChild(t)}let A=o(`path`,{class:`trs-scan__tri`,d:`M 0 0 L 0 0 L 0 0`}),j=o(`text`,{class:`trs-scan__text`,x:0,y:0});E.appendChild(A),E.appendChild(j);let M=o(`text`,{class:`trs-stack__title`,x:il,y:$c});M.textContent=`栈（左 = 栈底，右 = 栈顶）· 只存下标`,E.appendChild(M);let N=o(`text`,{class:`trs-stack__empty`,x:b,y:393});N.textContent=`（栈是空的）`,E.appendChild(N);let P=[];for(let e=0;e<a;e+=1){let t=b+e*(y+rl),n=o(`g`,{class:`trs-slot`});n.appendChild(o(`rect`,{class:`trs-slot__box`,x:t,y:el,width:y,height:nl,rx:5}));let r=o(`text`,{class:`trs-slot__idx`,x:t+y/2,y:389});n.appendChild(r);let i=o(`text`,{class:`trs-slot__h`,x:t+y/2,y:402});n.appendChild(i),E.appendChild(n),P.push({g:n,idxT:r,hT:i})}E.appendChild(o(`rect`,{class:`trs-banner__box`,x:il,y:Wc,width:x,height:Gc,rx:9}));let F=o(`text`,{class:`trs-banner__seg`,x:44,y:111});E.appendChild(F);let I=o(`text`,{class:`trs-banner__label`,x:il+x-68,y:111});I.textContent=`累计水量`,E.appendChild(I);let L=o(`text`,{class:`trs-banner__ans`,x:il+x-18,y:111});L.textContent=`0`,E.appendChild(L);let R=l();function z(e,t){if(!t)return;let n=t.stack??[],r=t.i,o=t.water,s=t.phase===`done`;for(let e of O){let{g:t,w:n,id:a}=e,c=o[a];c>0?(n.setAttribute(`y`,v(i[a]+c)),n.setAttribute(`height`,c*_),n.style.opacity=`1`):(n.style.opacity=`0`,n.setAttribute(`height`,0));let l=[`trs-bar`];!s&&a===r&&l.push(`is-scan`),t.setAttribute(`class`,l.join(` `))}if(!s&&t.phase===`settle`&&t.leftBound!==null&&t.layerH>0){let e=m(t.leftBound+1),n=m(t.rightBound-1)+u,r=v(t.level),a=v(i[t.bottom]);k.setAttribute(`x`,e),k.setAttribute(`y`,r),k.setAttribute(`width`,Math.max(2,n-e)),k.setAttribute(`height`,Math.max(2,a-r)),k.style.opacity=`1`}else k.style.opacity=`0`;if(!s&&r>=0&&r<a){let e=h(r),t=v(i[r])-6;A.setAttribute(`d`,`M ${e-7} ${t-11} L ${e+7} ${t-11} L ${e} ${t} z`),j.setAttribute(`x`,e),j.setAttribute(`y`,t-Qc),j.textContent=`i=${r}`,A.style.opacity=`1`,j.style.opacity=`1`}else A.style.opacity=`0`,j.style.opacity=`0`;N.style.opacity=n.length===0?`1`:`0`,P.forEach((e,t)=>{let r=n[t];if(r===void 0){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`,e.idxT.textContent=String(r),e.hT.textContent=`h=${i[r]}`,e.g.setAttribute(`class`,t===n.length-1?`trs-slot is-top`:`trs-slot`)}),s?F.textContent=`结束 · 共 ${t.total} 单位`:t.phase===`settle`&&t.leftBound!==null?F.textContent=`槽底 ${t.bottom}(h=${i[t.bottom]}) · 边界 [${t.leftBound}, ${t.rightBound}] · ${t.width}×${t.layerH} = +${t.gained}`:t.phase===`settle`?F.textContent=`弹出 ${t.bottom}，栈空 —— 没有左边界，这一层为 0`:t.phase===`push`?F.textContent=`压入 ${r}（h=${i[r]}）`:F.textContent=`等待开始 · 遇到更高的柱子就结算一层`,L.textContent=String(t.total),Z(R,t.desc)}s.appendChild(R);let B=Q();s.appendChild(B.root),e.textContent=``,e.appendChild(s),X();let V=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,H=$({steps:n,controls:B,intervalMs:ol,onRender:z});H.jumpTo(Math.trunc(t.initialStep)||0);let U=null;return r&&!V&&typeof IntersectionObserver==`function`&&(U=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){U.disconnect(),U=null,H.play();return}},{threshold:.35}),U.observe(s)),{destroy(){U&&=(U.disconnect(),null),H.destroy(),e.textContent=``,delete e.dataset.trsMounted,document.getElementById(Hc)?.remove()}}}var ul=[-2,1,-3,4,-1,2,1,-5,4];function dl(e={}){let t=Array.isArray(e.nums)?e.nums:ul,n=t.length,r=Number.isInteger(e.maxSteps)?e.maxSteps:400,i={nums:[...t],i:-1,x:null,cur:0,best:0,start:0,end:0,bestStart:0,bestEnd:0,reset:!1,dropped:null,improved:!1};if(n===0)return[{...i,phase:`done`,desc:"**空数组** —— 一个元素都没有，凑不出子数组。题目保证 `n >= 1`，但状态机要有安静的出口。",done:!0}];let a=[],o=t[0],s=t[0],c=0,l=0,u=0,d=0,f=0,p=(e,t,n={})=>{a.push({...i,i:l,cur:o,best:s,start:c,end:l,bestStart:u,bestEnd:d,phase:e,desc:t,done:e===`done`,...n})};p(`init`,`要在 \`[${t.join(`, `)}]\` 里找一个**连续**的子数组，让它的和最大。子数组至少要含一个元素，所以答案**不可能是 0**（全负数时答案是那个最大的负数）。暴力枚举所有起点终点是 \`O(n²)\`（用前缀和能把内层降到 O(1)，但外层还是 n² 个组合）。Kadane 的想法是：**从左到右扫，只维护一个量 —— 「以当前位置结尾的最大子数组和」**，记做 \`cur\`。扫到 \`x\` 时只有两种选择：① 接在当前这段后面 → \`cur + x\`；② 从 \`x\` 自己重新开始 → \`x\`。取更大的那个：\`cur = max(x, cur + x)\`。**这一句从头到尾只在问一件事：带上前面那段，是赚了还是亏了？**如果 \`cur < 0\`，那么 \`cur + x < x\` —— 前面那段是**负资产**，接上只会更差，不如从 \`x\` 重新开始。全程再用一个 \`best\` 记录 \`cur\` 的历史最大值，扫完就是答案。先从 \`nums[0] = ${t[0]}\` 起步：\`cur = best = ${t[0]}\`。`,{x:t[0]});for(let e=1;e<n&&(f+=1,!(f>r));e+=1){let n=t[e];l=e;let r=o,i=s;if(o<0){let t=c;o=n,c=e;let a=o>s;a&&(s=o,u=c,d=e),p(`restart`,`\`i = ${e}\`，\`nums[${e}] = ${n}\`。当前这段的和 \`cur = ${r}\` —— **它是负的**。带上一段负数只会让总和变小：\`(${r}) + ${n} = ${r+n}\`，还不如 \`${n}\` 自己。所以**把前面整段扔掉，从 \`${e}\` 重新开始**：\`cur = ${n}\`，当前子数组收缩成 \`[${n}]\`（起点重设为 \`${e}\`）。`+(a?` 再看全局：\`${n} > ${i}\`，**刷新最优** —— \`best = ${s}\`，最优区间记成 \`nums[${u}..${d}]\`。`:` 再看全局：\`${n}\` 没能超过历史最好的 \`${i}\`，\`best\` 保持 \`${s}\`。`),{i:e,x:n,reset:!0,improved:a,dropped:{from:t,to:e-1}})}else{o+=n;let t=o>s;t&&(s=o,u=c,d=e),p(`extend`,`\`i = ${e}\`，\`nums[${e}] = ${n}\`。当前这段的和 \`cur = ${r}\` 是**非负的** —— 带上它总不亏：\`${r} + ${n} = ${o}\`，比 \`${n}\` 自己更大。所以**接上去**：\`cur = ${o}\`，当前子数组变成 \`nums[${c}..${e}]\`。`+(t?` 再看全局：\`${o} > ${i}\`，**刷新最优** —— \`best = ${s}\`，最优区间记成 \`nums[${u}..${d}]\`。`:` 再看全局：\`${o}\` 没超过历史最好的 \`${i}\`，\`best\` 保持 \`${s}\`。`),{i:e,x:n,improved:t})}}let m=t.slice(u,d+1).join(`, `);return p(`done`,`扫描结束。**答案 = \`${s}\`**，对应的子数组是 \`nums[${u}..${d}]\` = \`[${m}]\`。 回头看这趟做了什么：每个元素**只被看过一次**，每次只做两次比较 —— 所以是 **\`O(n)\` 时间、\`O(1)\` 空间**。这已经是理论下界了：至少得把每个元素看一遍，不可能比 \`O(n)\` 更快。而那句 \`cur = max(x, cur + x)\` 从头到尾只在问一件事：**我前面那段，是资产还是负资产？**负的就扔掉重起，正的就一起带上 —— 就这一条规则，把 \`O(n²)\` 压成了 \`O(n)\`。`,{i:n-1,x:t[n-1],done:!0}),a}var fl=`kd-styles`,pl=54,ml=84,hl=46,gl=142,_l=180,vl=16,yl=202,bl=52,xl=58,Sl=6,Cl=260,wl=276,Tl=298,El=26,Dl=604,Ol=1250,kl=`
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
`;function Al(){if(document.getElementById(fl))return;let e=document.createElement(`style`);e.id=fl,e.textContent=kl,document.head.appendChild(e)}function jl(e,t={}){if(!e||e.dataset.kdMounted===`1`)return{destroy(){}};e.dataset.kdMounted=`1`,Al();let n=dl(t),r=t.autoplay!==!1,i=n[0].nums,a=i.length,o=Y,s=document.createElement(`div`);s.className=`viz kd`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);function l(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(a===0){let t=o(`svg`,{class:`viz__svg kd__svg`,viewBox:`0 0 620 120`,role:`img`}),n=o(`text`,{class:`kd-empty__text`,x:620/2,y:120/2});return n.textContent=`空数组 —— 凑不出子数组`,t.appendChild(n),c.appendChild(t),s.appendChild(l()),s.appendChild(Q().root),e.textContent=``,e.appendChild(s),{destroy(){e.textContent=``,delete e.dataset.kdMounted,document.getElementById(fl)?.remove()}}}let u=xl;a*u+(a-1)*Sl>Dl&&(u=Math.max(14,Math.floor((Dl-(a-1)*Sl)/a)));let d=a*u+(a-1)*Sl,f=Math.max(660,El*2+d),p=(f-d)/2,m=e=>p+e*(u+Sl),h=e=>m(e)+u/2,g=f-El*2,_=o(`svg`,{class:`viz__svg kd__svg`,viewBox:`0 0 ${f} 320`,role:`img`,"aria-label":`最大子数组和 Kadane 推演动画`});c.appendChild(_);let v=o(`g`,{class:`kd-bands`}),y=o(`g`,{class:`kd-cells`}),b=o(`g`,{class:`kd-bests`}),x=o(`g`,{class:`kd-marks`});_.appendChild(v),_.appendChild(y),_.appendChild(b),_.appendChild(x);let S=o(`text`,{class:`kd-note`,x:El,y:pl});S.textContent=`cur = max(x, cur + x) —— 每步只问一句：带上前面那段，是赚了还是亏了`,x.appendChild(S),x.appendChild(o(`rect`,{class:`kd-banner__box`,x:El,y:ml,width:g,height:hl,rx:9}));let C=o(`text`,{class:`kd-banner__seg`,x:44,y:107}),w=o(`text`,{class:`kd-banner__seg`,x:196,y:107}),T=o(`text`,{class:`kd-banner__best`,x:El+g-18,y:107});x.appendChild(C),x.appendChild(w),x.appendChild(T);let E=o(`rect`,{class:`kd-band`,x:0,y:_l,width:0,height:vl,rx:4}),D=o(`line`,{class:`kd-band__end`,x1:0,y1:_l-4,x2:0,y2:200}),O=o(`line`,{class:`kd-band__end`,x1:0,y1:_l-4,x2:0,y2:200});v.appendChild(E),v.appendChild(D),v.appendChild(O);let k=[];for(let e=0;e<a;e+=1){let t=m(e),n=o(`g`,{class:`kd-cell`});n.appendChild(o(`rect`,{class:`kd-cell__box`,x:t,y:yl,width:u,height:bl,rx:6}));let r=o(`text`,{class:`kd-cell__value`,x:h(e),y:228});r.textContent=String(i[e]),n.appendChild(r),y.appendChild(n),k.push({g:n,id:e})}for(let e=0;e<a;e+=1){let t=o(`text`,{class:`kd-idx`,x:h(e),y:wl});t.textContent=String(e),x.appendChild(t)}let A=o(`line`,{class:`kd-best__line`,x1:0,y1:Cl,x2:0,y2:Cl}),j=o(`line`,{class:`kd-best__tick`,x1:0,y1:256,x2:0,y2:Cl}),M=o(`line`,{class:`kd-best__tick`,x1:0,y1:256,x2:0,y2:Cl}),N=o(`text`,{class:`kd-best__text`,x:0,y:Tl});b.appendChild(A),b.appendChild(j),b.appendChild(M),b.appendChild(N);let P=o(`path`,{class:`kd-i__tri`,d:`M 0 0 L 0 0 L 0 0`}),F=o(`rect`,{class:`kd-i__tag`,x:0,y:gl,width:54,height:22,rx:6}),I=o(`text`,{class:`kd-i__text`,x:0,y:153});x.appendChild(P),x.appendChild(F),x.appendChild(I);let L=l();function R(e,t){if(!t)return;let n=t.i,r=t.phase===`done`,i=new Set;for(let e=t.start;e<=t.end;e+=1)i.add(e);let o=new Set;for(let e=t.bestStart;e<=t.bestEnd;e+=1)o.add(e);let s=new Set;if(!r&&t.dropped)for(let e=t.dropped.from;e<=t.dropped.to;e+=1)s.add(e);for(let e of k){let{g:t,id:a}=e,c=[`kd-cell`];s.has(a)?c.push(`is-dropped`):(i.has(a)&&c.push(`is-inwin`),o.has(a)&&c.push(`is-inbest`),!r&&a===n&&c.push(`is-cur`)),t.setAttribute(`class`,c.join(` `))}if(r||t.end<t.start)E.style.opacity=`0`,D.style.opacity=`0`,O.style.opacity=`0`;else{let e=m(t.start),n=m(t.end)+u;E.setAttribute(`x`,e),E.setAttribute(`width`,Math.max(2,n-e)),E.style.opacity=`1`,D.setAttribute(`x1`,e),D.setAttribute(`x2`,e),O.setAttribute(`x1`,n),O.setAttribute(`x2`,n),D.style.opacity=`1`,O.style.opacity=`1`}let c=m(t.bestStart),l=m(t.bestEnd)+u;if(j.setAttribute(`x1`,c),j.setAttribute(`x2`,c),M.setAttribute(`x1`,l),M.setAttribute(`x2`,l),A.setAttribute(`x1`,c),A.setAttribute(`x2`,l),N.setAttribute(`x`,(c+l)/2),N.textContent=`最优 nums[${t.bestStart}..${t.bestEnd}] · 和 ${t.best}`,!r&&n>=0&&n<a){let e=h(n),t=yl-6;P.setAttribute(`d`,`M ${e-7} ${t-11} L ${e+7} ${t-11} L ${e} ${t} z`),P.style.opacity=`1`,F.setAttribute(`x`,e-27),I.setAttribute(`x`,e),I.textContent=`i=${n}`,F.style.opacity=`1`,I.style.opacity=`1`}else P.style.opacity=`0`,F.style.opacity=`0`,I.style.opacity=`0`;C.textContent=`cur = ${t.cur}（当前这段）`,w.textContent=`best = ${t.best}`,T.textContent=r?`答案 ${t.best}`:`最优 ${t.best}`,Z(L,t.desc)}s.appendChild(L);let z=Q();s.appendChild(z.root),e.textContent=``,e.appendChild(s),X();let B=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,V=$({steps:n,controls:z,intervalMs:Ol,onRender:R});V.jumpTo(Math.trunc(t.initialStep)||0);let H=null;return r&&!B&&typeof IntersectionObserver==`function`&&(H=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){H.disconnect(),H=null,V.play();return}},{threshold:.35}),H.observe(s)),{destroy(){H&&=(H.disconnect(),null),V.destroy(),e.textContent=``,delete e.dataset.kdMounted,document.getElementById(fl)?.remove()}}}var Ml=[3,2,1,5,6,4],Nl=2;function Pl(e){let t=e>>>0||12345;return()=>(t=t*1103515245+12345&2147483647,t/2147483647)}function Fl(e={}){let t=(Array.isArray(e.nums)?e.nums:Ml).slice(),n=t.length,r=Number.isInteger(e.k)?e.k:Nl,i=Math.min(Math.max(r,1),Math.max(n,1)),a=Number.isInteger(e.maxSteps)?e.maxSteps:400,o=e.pivot===`random`?`random`:`last`,s=Pl(Number.isInteger(e.seed)?e.seed:20240928),c=[],l=n-i,u=0,d=n-1,f=0,p=null,m=null,h=null,g=null,_=null,v=null,y=(e,r,a={})=>{c.push({phase:e,desc:r,arr:t.slice(),n,k:i,target:l,left:u,right:d,pivotValue:h,pivotIdx:g,i:_,j:v,swapPair:null,cmp:null,found:p,foundIdx:m,round:f,done:e===`done`,...a})};if(n===0)return y(`done`,`数组是空的，没有第 k 大。`),c;y(`init`,`给了 \`${n}\` 个数 \`[${t.join(`, `)}]\`，要找**第 \`${i}\` 大**。先把这句话翻译成下标：升序排好之后，第 \`${i}\` 大就是**倒数第 \`${i}\` 个**，也就是升序下标 \`n - k = ${n} - ${i} = ${l}\`。所以题目等价于：**找出升序第 \`${l}\` 位（0 基）的那个数**。这个换算是最容易写错的地方 —— 写成 \`k - 1\` 的话，找的就变成第 \`${i}\` **小**了。另外先约定一件事：「第 k 大」是**排序后的第 k 个位置**，不是「第 k 个不同的值」 —— 重复元素各占各的位置。`);let b=0;for(;u<=d&&b<a;){if(b+=1,f+=1,u===d){p=t[u],m=u,g=u;break}let e=d;if(o===`random`){e=u+Math.floor(s()*(d-u+1));let n=t[e];t[e]=t[d],t[d]=n,e=d}for(h=t[d],g=d,_=u,v=null,y(`pick`,`**第 \`${f}\` 轮分区**，当前搜索区间 \`[${u}, ${d}]\`。`+(o===`random`?`随机挑一个位置、把它换到区间最右端当枢轴 —— 随机化是为了避免"有序输入 + 固定取末尾"退化成 O(n²)。`:`取区间最右端的 \`${h}\` 当枢轴（pivot）。`)+`这一趟扫描只做一件事：把区间里**小于等于 \`${h}\` 的都挪到左边**。游标 \`i\` 指向"小于等于区"的下一个空位，游标 \`j\` 从左往右扫。`),v=u;v<d&&!(b>=a);v+=1){b+=1;let e=t[v];if(e<=h){let n=_,r=v,i=t[n];t[n]=t[r],t[r]=i;let a=n!==r;_+=1,y(`scan`,`\`j = ${v}\`：\`arr[${v}] = ${e}\` **<= \`${h}\`**，归入左边。`+(a?`交换 \`${n}\` 与 \`${r}\` 两格，\`${e}\` 被换到下标 \`${n}\`。`:"它本来就在 `i` 指向的位置上，不用换。")+` \`i\` 前进到 \`${_}\`，"小于等于区"扩大一格。`,{swapPair:[n,r],cmp:`le`})}else y(`scan`,`\`j = ${v}\`：\`arr[${v}] = ${e}\` **> \`${h}\`**，**不动** —— 它属于右边那一堆。\`j\` 继续前进，\`i\` 留在下标 \`${_}\` 等着下一个"小个子"。`,{cmp:`gt`})}let r=_,c=d,x=t[r];if(t[r]=t[c],t[c]=x,g=_,v=null,y(`place`,`扫描结束。此时 \`i\` 正好指向"大于区"的第一个位置，把枢轴 \`${h}\` 换到这里 —— 交换 \`i = ${r}\` 与 \`right = ${c}\`，数组变成 \`[${t.join(`, `)}]\` （区间内部分）。**枢轴就此落在下标 \`${g}\`**：它左边全 \`<= ${h}\`，右边全 \`> ${h}\`。这个位置就是它的**最终排名** —— 整个数组升序排好后它就在这一位。`,{swapPair:[r,c]}),g===l){p=t[g],m=g,y(`found`,`枢轴 \`${h}\` 落在下标 \`${g}\`，**正好是目标位 \`n - k = ${l}\`** —— 它就是第 \`${i}\` 大。此时它左边 \`${g}\` 个元素都不比它大，右边 \`${n-g-1}\` 个元素都不比它小，排名确凿，不用再比了。`);break}if(g<l){let e=u;u=g+1,y(`narrow`,`枢轴落在 \`${g}\`，目标位是 \`${l}\`。\`${g} < ${l}\` —— **答案在枢轴右边**。左边那 \`${g-e+1}\` 个（含枢轴自己）排名都比目标位靠前，全部淘汰，以后一眼都不看。区间收缩成 \`[${u}, ${d}]\`。**这就是省时间的全部秘密**：快排要递归两边，快速选择只进一边。`)}else{let e=d;d=g-1,y(`narrow`,`枢轴落在 \`${g}\`，目标位是 \`${l}\`。\`${g} > ${l}\` —— **答案在枢轴左边**。右边那 \`${e-g+1}\` 个（含枢轴自己）排名都比目标位靠后，全部淘汰。区间收缩成 \`[${u}, ${d}]\`。`)}h=null,_=null}return y(`done`,p===null?`达到步数上限 \`${a}\`，提前收尾（正常输入不会走到这里）。`:`结束。**第 \`${i}\` 大 = \`${p}\`**，它在升序数组里的位置是下标 \`${m}\`。回头看这趟：一共只做了 \`${f}\` 轮分区，每轮扫描当前区间一次就把一半左右的候选淘汰掉，总工作量是 \`n + n/2 + n/4 + … ≈ 2n\` —— 所以是**平均 O(n)** 时间，而且全程只在原数组上交换，**O(1) 额外空间**。但别忘了那两个字是"平均"：最坏情况（比如有序数组配固定取末尾的枢轴）每轮只砍掉 1 个，会退化成 O(n²)。`),c}var Il=`qs-styles`,Ll=54,Rl=84,zl=46,Bl=152,Vl=198,Hl=56,Ul=272,Wl=304,Gl=322,Kl=58,ql=6,Jl=26,Yl=604,Xl=1250,Zl=`
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
`;function Ql(){if(document.getElementById(Il))return;let e=document.createElement(`style`);e.id=Il,e.textContent=Zl,document.head.appendChild(e)}function $l(e,t={}){if(!e||e.dataset.qsMounted===`1`)return{destroy(){}};e.dataset.qsMounted=`1`,Ql();let n=Fl(t),r=t.autoplay!==!1,i=n[0].arr.length,a=Y,o=document.createElement(`div`);o.className=`viz qs`;let s=document.createElement(`div`);s.className=`viz__stage`,o.appendChild(s);function c(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(i===0){let t=a(`svg`,{class:`viz__svg qs__svg`,viewBox:`0 0 620 120`,role:`img`}),n=a(`text`,{class:`qs-empty__text`,x:620/2,y:120/2});return n.textContent=`空数组 —— 没有第 k 大`,t.appendChild(n),s.appendChild(t),o.appendChild(c()),o.appendChild(Q().root),e.textContent=``,e.appendChild(o),X(),{destroy(){e.textContent=``,delete e.dataset.qsMounted,document.getElementById(Il)?.remove()}}}let l=Kl;i*l+(i-1)*ql>Yl&&(l=Math.max(16,Math.floor((Yl-(i-1)*ql)/i)));let u=i*l+(i-1)*ql,d=Math.max(660,Jl*2+u),f=(d-u)/2,p=e=>f+e*(l+ql),m=e=>p(e)+l/2,h=d-Jl*2,g=a(`svg`,{class:`viz__svg qs__svg`,viewBox:`0 0 ${d} 344`,role:`img`,"aria-label":`第 K 大元素 快速选择推演动画`});s.appendChild(g);let _=a(`g`,{class:`qs-cells`}),v=a(`g`,{class:`qs-marks`});g.appendChild(_),g.appendChild(v);let y=a(`text`,{class:`qs-note`,x:Jl,y:Ll});y.textContent=`第 k 大 = 升序第 n-k 位 —— 快速选择只递归一边，所以是 O(n) 不是 O(n log n)`,v.appendChild(y),v.appendChild(a(`rect`,{class:`qs-banner__box`,x:Jl,y:Rl,width:h,height:zl,rx:9}));let b=a(`text`,{class:`qs-banner__seg`,x:44,y:107}),x=a(`text`,{class:`qs-banner__seg`,x:226,y:107}),S=a(`text`,{class:`qs-banner__seg`,x:406,y:107}),C=a(`text`,{class:`qs-banner__ans`,x:Jl+h-18,y:107});v.appendChild(b),v.appendChild(x),v.appendChild(S),v.appendChild(C);let w=[];for(let e=0;e<i;e+=1){let t=p(e),n=a(`g`,{class:`qs-cell`});n.appendChild(a(`rect`,{class:`qs-cell__box`,x:t,y:Vl,width:l,height:Hl,rx:6}));let r=a(`text`,{class:`qs-cell__value`,x:m(e),y:220});n.appendChild(r);let i=a(`text`,{class:`qs-cell__idx`,x:m(e),y:240});i.textContent=String(e),n.appendChild(i),_.appendChild(n),w.push({g:n,v:r,id:e})}let T=a(`path`,{class:`qs-i__tri`,d:`M 0 0 L 0 0 L 0 0`}),E=a(`rect`,{class:`qs-i__tag`,x:0,y:Bl,width:54,height:22,rx:6}),D=a(`text`,{class:`qs-i__text`,x:0,y:163});v.appendChild(T),v.appendChild(E),v.appendChild(D);let O=a(`path`,{class:`qs-j__tri`,d:`M 0 0 L 0 0 L 0 0`}),k=a(`rect`,{class:`qs-j__tag`,x:0,y:Ul,width:54,height:22,rx:6}),A=a(`text`,{class:`qs-j__text`,x:0,y:283});v.appendChild(O),v.appendChild(k),v.appendChild(A);let j=a(`line`,{class:`qs-target__line`,x1:0,y1:256,x2:0,y2:Wl}),M=a(`path`,{class:`qs-target__tri`,d:`M 0 0 L 0 0 L 0 0`}),N=a(`text`,{class:`qs-target__text`,x:0,y:Gl});v.appendChild(j),v.appendChild(M),v.appendChild(N);let P=c();function F(e,t){if(!t)return;let{arr:n,left:r,right:a,target:o,k:s,round:c}=t,l=t.phase,u=l===`done`,d=t.found,f=new Set;l===`scan`&&t.swapPair&&t.swapPair[0]!==t.swapPair[1]&&(f.add(t.swapPair[0]),f.add(t.swapPair[1]));for(let e of w){let i=e.id;e.v.textContent=String(n[i]);let o=[`qs-cell`];i<r||i>a?o.push(`is-outside`):t.i!==null&&i<t.i&&i>=r&&o.push(`is-lezone`),t.pivotIdx!==null&&i===t.pivotIdx&&t.pivotValue!==null&&o.push(`is-pivot`),f.has(i)&&o.push(`is-swap`),d!==null&&i===t.foundIdx&&o.push(`is-found`),e.g.setAttribute(`class`,o.join(` `))}if(!u&&t.i!==null&&t.i>=0&&t.i<i){let e=m(t.i),n=Vl-6;T.setAttribute(`d`,`M ${e-7} ${n-14} L ${e+7} ${n-14} L ${e} ${n} z`),E.setAttribute(`x`,e-27),D.setAttribute(`x`,e),D.textContent=`i=${t.i}`,T.style.opacity=`1`,E.style.opacity=`1`,D.style.opacity=`1`}else T.style.opacity=`0`,E.style.opacity=`0`,D.style.opacity=`0`;if(!u&&t.j!==null&&t.j>=0&&t.j<i){let e=m(t.j);O.setAttribute(`d`,`M ${e-7} 270 L ${e+7} 270 L ${e} 256 z`),k.setAttribute(`x`,e-27),A.setAttribute(`x`,e),A.textContent=`j=${t.j}`,O.style.opacity=`1`,k.style.opacity=`1`,A.style.opacity=`1`}else O.style.opacity=`0`,k.style.opacity=`0`,A.style.opacity=`0`;let p=m(o);j.setAttribute(`x1`,p),j.setAttribute(`x2`,p),M.setAttribute(`d`,`M ${p-7} ${Wl-12} L ${p+7} ${Wl-12} L ${p} ${Wl} z`),N.setAttribute(`x`,p),N.textContent=`目标位 ${o}`,b.textContent=`第 ${s} 大 · 目标位 ${o}`,x.textContent=c>0?`第 ${c} 轮 · 区间 [${r}, ${a}]`:`区间 [${r}, ${a}]`,d===null?l===`scan`&&t.swapPair&&t.swapPair[0]!==t.swapPair[1]?S.textContent=`swap(${t.swapPair[0]}, ${t.swapPair[1]})`:t.pivotValue===null?S.textContent=``:S.textContent=`枢轴 ${t.pivotValue}`:S.textContent=`枢轴归位 ${t.pivotIdx}`,C.textContent=d===null?`答案 ?`:`答案 ${d}`,Z(P,t.desc)}o.appendChild(P);let I=Q();o.appendChild(I.root),e.textContent=``,e.appendChild(o),X();let L=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,R=$({steps:n,controls:I,intervalMs:Xl,onRender:F});R.jumpTo(Math.trunc(t.initialStep)||0);let z=null;return r&&!L&&typeof IntersectionObserver==`function`&&(z=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){z.disconnect(),z=null,R.play();return}},{threshold:.35}),z.observe(o)),{destroy(){z&&=(z.disconnect(),null),R.destroy(),e.textContent=``,delete e.dataset.qsMounted,document.getElementById(Il)?.remove()}}}var eu=[1,1,1,2,2,3],tu=2;function nu(e={}){let t=Array.isArray(e.nums)?e.nums:eu,n=t.length,r=Number.isInteger(e.k)?e.k:tu,i=Math.min(Math.max(r,1),Math.max(n,1)),a=[],o={},s=Array.from({length:n+1},()=>[]),c=[],l=(e,r,l={})=>{a.push({phase:e,desc:r,nums:t,n,k:i,freq:{...o},buckets:s.map(e=>e.slice()),cur:null,curFreq:null,bucketIdx:null,collectIdx:null,ans:c.slice(),collected:c.length,done:e===`done`,...l})};if(n===0)return l(`done`,`数组是空的，没有高频元素可取。`),a;l(`init`,`给了 \`${n}\` 个数 \`[${t.join(`, `)}]\`，要返回**出现频率前 \`${i}\` 高的元素**，而且题目卡死了复杂度：**必须优于 O(n log n)** —— 也就是不允许"哈希计数完再整体排序"这种偷懒写法。思路分三步：先一遍扫描数出每个值出现的**频率**（O(n)）；再按频率把值**分进桶里**（频率天然在 \`[1, ${n}]\` 之间，直接当数组下标用，不用比较）；最后**从高频端往低频端收集**，收满 \`${i}\` 个停。全程没有一次两两比较，总计 O(n)。`);let u=[];for(let e of t)o[e]===void 0?(o[e]=1,u.push(e)):o[e]+=1;for(let e of u)l(`count`,`数完了：值 \`${e}\` 出现了 **\`${o[e]}\` 次**。一张哈希表从左到右扫一遍就够，每个值 O(1)，这一步 \`${t.length}\` 个数共 O(n)。接下来所有的功夫都花在"怎么按频率挑前 \`${i}\` 个"上。`,{cur:e,curFreq:o[e]});for(let e of u){let t=o[e];s[t].push(e),l(`bucket`,`把 \`${e}\` 放进**下标为 \`${t}\` 的桶** —— 频率是多少，就进哪个桶。这一步是桶排序的灵魂：一个元素最多出现 \`${n}\` 次，所以频率天然落在 \`[1, ${n}]\` 里，**键的值域就是数组的下标范围**，建 \`${n+1}\` 个桶直接丢，一次比较都不用做。对比小根堆方案：堆每插一个元素要 \`O(log k)\`，这里每个元素是实打实的 \`O(1)\`。`,{cur:e,curFreq:t,bucketIdx:t})}for(let e=n;e>=1&&!(c.length>=i);--e){if(s[e].length===0){l(`collect`,`桶 \`${e}\` 是**空的** —— 没有值恰好出现 \`${e}\` 次，跳过，继续往左。收集指针从最右端（频率 \`${n}\`）一路往左扫，这就是"从高频到低频"的字面意思。`,{collectIdx:e});continue}for(let t of s[e])if(c.length>=i||(c.push(t),l(`collect`,`桶 \`${e}\` 里有值 \`${t}\`（出现了 \`${e}\` 次），收进答案。已收集 \`${c.length}/${i}\`${c.length>=i?` —— **收满了，停**。`:`，还没够，继续往左扫。`}题目保证答案唯一，所以桶内顺序不影响结果。`,{collectIdx:e,cur:t,curFreq:e}),c.length>=i))break}return l(`done`,`结束。**前 \`${i}\` 个高频元素 = [${c.join(`, `)}]**。回头看这三步：计数 O(n)、入桶 O(n)、收集最多扫 \`${n}\` 个桶也是 O(n) —— **总计 O(n)**，比题目划的红线 O(n log n) 还低。代价是那 \`${n+1}\` 个桶的 **O(n) 额外空间**，以及一个小前提：**频率是整数、且范围已知**（这题天然满足）。如果频率范围没这种保证（比如要按"距离"挑前 k 个），桶就没了，那才轮到堆或快速选择出场。`),a}var ru=`bk-styles`,iu=54,au=84,ou=46,su=150,cu=40,lu=214,uu=252,du=62,fu=332,pu=26,mu=604,hu=40,gu=5,_u=1250,vu=`
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
`;function yu(){if(document.getElementById(ru))return;let e=document.createElement(`style`);e.id=ru,e.textContent=vu,document.head.appendChild(e)}function bu(e,t={}){if(!e||e.dataset.bkMounted===`1`)return{destroy(){}};e.dataset.bkMounted=`1`,yu();let n=nu(t),r=t.autoplay!==!1,i=n[0].nums,a=i.length,o=Y,s=document.createElement(`div`);s.className=`viz bk`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);function l(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(a===0){let t=o(`svg`,{class:`viz__svg bk__svg`,viewBox:`0 0 620 120`,role:`img`}),n=o(`text`,{class:`bk-empty__text`,x:620/2,y:120/2});return n.textContent=`空数组 —— 没有高频元素可取`,t.appendChild(n),c.appendChild(t),s.appendChild(l()),s.appendChild(Q().root),e.textContent=``,e.appendChild(s),X(),{destroy(){e.textContent=``,delete e.dataset.bkMounted,document.getElementById(ru)?.remove()}}}let u=[],d=new Set;for(let e of i)d.has(e)||(d.add(e),u.push(e));let f=a+1,p=52;f*p+(f-1)*gu>mu&&(p=Math.max(hu,Math.floor((mu-(f-1)*gu)/f)));let m=f*p+(f-1)*gu,h=Math.max(660,pu*2+m),g=(h-m)/2,_=e=>g+e*(p+gu),v=e=>_(e)+p/2,y=h-pu*2,b=o(`svg`,{class:`viz__svg bk__svg`,viewBox:`0 0 ${h} 370`,role:`img`,"aria-label":`前 K 个高频元素 桶排序推演动画`});c.appendChild(b);let x=o(`g`,{class:`bk-cells`}),S=o(`g`,{class:`bk-marks`});b.appendChild(x),b.appendChild(S);let C=o(`text`,{class:`bk-note`,x:pu,y:iu});C.textContent=`频率天然落在 [1, n] —— 用频率当桶下标，排序就免费了`,S.appendChild(C),S.appendChild(o(`rect`,{class:`bk-banner__box`,x:pu,y:au,width:y,height:ou,rx:9}));let w=o(`text`,{class:`bk-banner__seg`,x:44,y:107}),T=o(`text`,{class:`bk-banner__seg`,x:236,y:107}),E=o(`text`,{class:`bk-banner__ans`,x:pu+y-18,y:107});S.appendChild(w),S.appendChild(T),S.appendChild(E);let D=Math.min(72,Math.max(46,Math.floor((m-(u.length-1)*8)/Math.max(u.length,1)))),O=(h-(u.length*D+(u.length-1)*8))/2,k=u.map((e,t)=>{let n=o(`g`,{class:`bk-freq`}),r=O+t*(D+8);n.appendChild(o(`rect`,{class:`bk-freq__box`,x:r,y:su,width:D,height:cu,rx:6}));let i=o(`text`,{class:`bk-freq__text`,x:r+D/2,y:170});return n.appendChild(i),x.appendChild(n),{g:n,t:i,v:e}}),A=[];for(let e=0;e<=a;e+=1){let t=_(e),n=o(`g`,{class:`bk-bucket`});n.appendChild(o(`rect`,{class:`bk-bucket__box`,x:t,y:uu,width:p,height:du,rx:6}));let r=o(`text`,{class:`bk-bucket__f`,x:v(e),y:266});r.textContent=`f=${e}`,n.appendChild(r);let i=o(`text`,{class:`bk-bucket__items`,x:v(e),y:292});n.appendChild(i),x.appendChild(n),A.push({g:n,items:i,f:e})}let j=o(`path`,{class:`bk-collect__tri`,d:`M 0 0 L 0 0 L 0 0`}),M=o(`rect`,{class:`bk-collect__tag`,x:0,y:lu,width:54,height:22,rx:6}),N=o(`text`,{class:`bk-collect__text`,x:0,y:225});S.appendChild(j),S.appendChild(M),S.appendChild(N);let P=n[0].k,F=(h-(P*44+(P-1)*10))/2,I=o(`text`,{class:`bk-ans__label`,x:pu,y:350});I.textContent=`答案（收满 ${P} 个停）`,S.appendChild(I);let L=[];for(let e=0;e<P;e+=1){let t=o(`g`,{class:`bk-ans`}),n=F+e*54;t.appendChild(o(`rect`,{class:`bk-ans__box`,x:n,y:fu,width:44,height:36,rx:6}));let r=o(`text`,{class:`bk-ans__text`,x:n+44/2,y:350});t.appendChild(r),S.appendChild(t),L.push({g:t,t:r})}let R=l();function z(e,t){if(!t)return;let n=t.phase,{buckets:r,freq:i,ans:a}=t;for(let e of k){let t=i[e.v]!==void 0;e.t.textContent=t?`${e.v} x ${i[e.v]}`:`${e.v} x ?`,e.g.setAttribute(`class`,t?`bk-freq is-lit`:`bk-freq`)}let o=new Set;for(let e of a)o.add(i[e]);for(let e of A){let i=e.f,a=r[i];e.items.textContent=a.length?a.join(`,`):``;let s=[`bk-bucket`];a.length===0&&s.push(`is-empty`),o.has(i)&&s.push(`is-collected`),n===`bucket`&&t.bucketIdx===i&&s.push(`is-new`),n===`collect`&&t.collectIdx===i&&s.push(`is-scanned`),e.g.setAttribute(`class`,s.join(` `))}if(n===`collect`&&t.collectIdx!==null){let e=v(t.collectIdx),n=uu-2;j.setAttribute(`d`,`M ${e-7} ${n-12} L ${e+7} ${n-12} L ${e} ${n} z`),M.setAttribute(`x`,e-27),N.setAttribute(`x`,e),N.textContent=`f=${t.collectIdx}`,j.style.opacity=`1`,M.style.opacity=`1`,N.style.opacity=`1`}else j.style.opacity=`0`,M.style.opacity=`0`,N.style.opacity=`0`;for(let e=0;e<L.length;e+=1){let t=e<a.length;L[e].t.textContent=t?String(a[e]):`?`,L[e].g.setAttribute(`class`,t?`bk-ans is-filled`:`bk-ans`)}w.textContent=`前 ${t.k} 高频 · 已收 ${t.collected}/${t.k}`,n===`count`?T.textContent=`计数：${t.cur} 出现 ${t.curFreq} 次`:n===`bucket`?T.textContent=`${t.cur} 进桶 f=${t.bucketIdx}`:n===`collect`?T.textContent=t.cur===null?`桶 f=${t.collectIdx} 是空的，跳过`:`收集 f=${t.collectIdx} 里的 ${t.cur}`:n===`init`?T.textContent=`哈希计数 → 按频率入桶 → 从右往左收`:T.textContent=`收满了`,E.textContent=a.length>=t.k?`答案 [${a.join(`, `)}]`:`答案 ?`,Z(R,t.desc)}s.appendChild(R);let B=Q();s.appendChild(B.root),e.textContent=``,e.appendChild(s),X();let V=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,H=$({steps:n,controls:B,intervalMs:_u,onRender:z});H.jumpTo(Math.trunc(t.initialStep)||0);let U=null;return r&&!V&&typeof IntersectionObserver==`function`&&(U=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){U.disconnect(),U=null,H.play();return}},{threshold:.35}),U.observe(s)),{destroy(){U&&=(U.disconnect(),null),H.destroy(),e.textContent=``,delete e.dataset.bkMounted,document.getElementById(ru)?.remove()}}}var xu=[[1,3],[2,6],[8,10],[15,18]];function Su(e={}){let t=Array.isArray(e.intervals)?e.intervals:xu,n=[],r=(e,r,i={})=>{n.push({phase:e,desc:r,intervals:t.map(e=>e.slice()),sorted:[],idx:null,curStart:null,curEnd:null,result:[],cmp:null,done:e===`done`,...i})};if(t.length===0)return r(`done`,`输入是空的，直接返回空数组。`),n;let i=t.map(e=>e.slice()).sort((e,t)=>e[0]-t[0]||e[1]-t[1]);r(`init`,`给了 \`${t.length}\` 个区间：\`[${t.map(e=>`[${e[0]},${e[1]}]`).join(`, `)}]\`。暴力做法是两两比较有没有重叠，\`O(n²)\`；但这题有一个决定性的预处理：**先按左端点排序**。排好序之后有一个性质 —— 新区间的 start 是当前最大的，它如果连当前合并区间的 end 都够不着，就更够不着更早的区间（它们的 end 都被当前合并区间罩着），所以**每个区间只需要和"当前合并区间"比一次**，重叠的候选从 \`O(n²)\` 对坍缩成线性个。另外记住一个语义：**端点相触算重叠**，\`[1,4]\` 和 \`[4,5]\` 要合成 \`[1,5]\`。`),r(`sort`,`按左端点排序完成：\`[${i.map(e=>`[${e[0]},${e[1]}]`).join(`, `)}]\`。这一步 \`O(n log n)\` 是整个算法的瓶颈 —— 之后的合并扫描是严格的 O(n)。扫描规则只有一句：看当前区间的 start 是否 \`<=\` 当前合并区间的 end，够得着就延伸，够不着就收段、新开。`,{sorted:i.map(e=>e.slice())});let a=null,o=null,s=[];for(let e=0;e<i.length;e+=1){let[t,n]=i[e];if(a===null){a=t,o=n,r(`start`,`第一段 \`[${t},${n}]\` 直接成为当前合并区间 \`[${a},${o}]\`。接下来每个区间只问一句话：**你的 start 够得着我的 end 吗？**`,{idx:e,curStart:a,curEnd:o,sorted:i.map(e=>e.slice())});continue}t<=o?(o=Math.max(o,n),r(`extend`,`\`[${t},${n}]\` 的 start \`${t} <= ${o}\`（当前合并区间的 end）—— **够得着，延伸**。当前合并区间变成 \`[${a},${o}]\`。`+(n>o||n===o?`延伸取 \`max(旧 end, ${n})\` —— 注意不能直接覆盖：新区间可能整体被当前区间罩住（比如 \`[2,3]\` 配 \`[1,6]\`）。`:``),{idx:e,curStart:a,curEnd:o,cmp:`overlap`,sorted:i.map(e=>e.slice())})):(s.push([a,o]),a=t,o=n,r(`close`,`\`[${t},${n}]\` 的 start \`${t} > ${o}\` —— **够不着，收段**。把 \`[${s[s.length-1][0]},${s[s.length-1][1]}]\` 收进结果（它再也不可能被延伸了 —— 后面区间的 start 只会更大），当前合并区间换成 \`[${t},${n}]\`。`,{idx:e,curStart:a,curEnd:o,cmp:`gap`,sorted:i.map(e=>e.slice()),result:s.map(e=>e.slice())}))}return s.push([a,o]),r(`done`,`扫描结束，把最后一段 \`[${a},${o}]\` 也收进去。**答案 = [${s.map(e=>`[${e[0]},${e[1]}]`).join(`, `)}]**，共 \`${s.length}\` 段。回头看这趟：排序 \`O(n log n)\` + 扫描 \`O(n)\`，每个区间只和"当前合并区间"比了一次。还有一个工程细节：结果里的区间必须是**新造的数组** —— 要是把输入区间的引用塞进结果再改它的 end，调用方的原数据就被污染了。`,{idx:i.length-1,curStart:a,curEnd:o,result:s.map(e=>e.slice()),sorted:i.map(e=>e.slice())}),n}var Cu=`mi-styles`,wu=54,Tu=84,Eu=46,Du=152,Ou=34,ku=8,Au=34,ju=40,Mu=26,Nu=1250,Pu=`
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
`;function Fu(){if(document.getElementById(Cu))return;let e=document.createElement(`style`);e.id=Cu,e.textContent=Pu,document.head.appendChild(e)}function Iu(e,t={}){if(!e||e.dataset.miMounted===`1`)return{destroy(){}};e.dataset.miMounted=`1`,Fu();let n=Su(t),r=t.autoplay!==!1,i=Y,a=document.createElement(`div`);a.className=`viz mi`;let o=document.createElement(`div`);o.className=`viz__stage`,a.appendChild(o);function s(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(n[0].intervals.length===0){let t=i(`svg`,{class:`viz__svg mi__svg`,viewBox:`0 0 620 120`,role:`img`}),n=i(`text`,{class:`mi-empty__text`,x:620/2,y:120/2});return n.textContent=`空输入 —— 直接返回空数组`,t.appendChild(n),o.appendChild(t),a.appendChild(s()),a.appendChild(Q().root),e.textContent=``,e.appendChild(a),X(),{destroy(){e.textContent=``,delete e.dataset.miMounted,document.getElementById(Cu)?.remove()}}}let c=n[0].sorted.length?n[0].sorted.flat():n[0].intervals.flat(),l=Math.max(...c,1),u=Math.min(...c,0),d=542-Mu,f=e=>118+(e-u)/(l-u||1)*d,p=Math.max(n[0].sorted.length,n[0].intervals.length,1),m=176+(p*42+ku)+Au,h=m+16,g=i(`svg`,{class:`viz__svg mi__svg`,viewBox:`0 0 660 ${h+ju+40}`,role:`img`,"aria-label":`合并区间 推演动画`});o.appendChild(g);let _=i(`g`,{class:`mi-bars`}),v=i(`g`,{class:`mi-marks`});g.appendChild(_),g.appendChild(v);let y=i(`text`,{class:`mi-note`,x:Mu,y:wu});y.textContent=`按左端点排序后，每个区间只和「当前合并区间」比一次`,v.appendChild(y),v.appendChild(i(`rect`,{class:`mi-banner__box`,x:Mu,y:Tu,width:660-Mu*2,height:Eu,rx:9}));let b=i(`text`,{class:`mi-banner__seg`,x:44,y:107}),x=i(`text`,{class:`mi-banner__seg`,x:266,y:107}),S=i(`text`,{class:`mi-banner__ans`,x:660-Mu-18,y:107});v.appendChild(b),v.appendChild(x),v.appendChild(S);let C=i(`line`,{class:`mi-axis__line`,x1:118,y1:Du,x2:634,y2:Du});v.appendChild(C);let w=l-u<=12?1:l-u<=30?2:5;for(let e=Math.ceil(u);e<=l;e+=w){let t=f(e);v.appendChild(i(`line`,{class:`mi-axis__tick`,x1:t,y1:Du-4,x2:t,y2:156}));let n=i(`text`,{class:`mi-axis__num`,x:t,y:Du-14});n.textContent=String(e),v.appendChild(n)}let T=[];for(let e=0;e<p;e+=1){let t=176+e*42,n=i(`g`,{class:`mi-bar`}),r=i(`text`,{class:`mi-bar__label`,x:Mu,y:t+Ou/2});n.appendChild(r);let a=i(`rect`,{class:`mi-bar__box`,x:0,y:t,width:10,height:Ou,rx:8});n.appendChild(a);let o=i(`text`,{class:`mi-bar__text`,x:0,y:t+Ou/2});n.appendChild(o),_.appendChild(n),T.push({g:n,label:r,box:a,text:o,y:t})}let E=i(`text`,{class:`mi-result__label`,x:Mu,y:m});v.appendChild(E);let D=i(`rect`,{class:`mi-result__cur`,x:0,y:h,width:0,height:ju,rx:8});v.appendChild(D);let O=[];for(let e=0;e<p;e+=1){let e=i(`rect`,{class:`mi-result__seg`,x:0,y:h,width:0,height:ju,rx:8});v.appendChild(e),O.push(e)}let k=s();function A(e,t){if(!t)return;let{sorted:n,result:r}=t,i=t.phase,a=i===`done`,o=t.curStart!==null&&!a,s=i===`init`?t.intervals:n;if(T.forEach((e,n)=>{let r=s[n];if(!r){e.g.style.opacity=`0`;return}e.g.style.opacity=`1`;let[i,o]=r;e.label.textContent=`[${i},${o}]`;let c=f(i),l=f(o);e.box.setAttribute(`x`,c),e.box.setAttribute(`width`,Math.max(8,l-c)),e.text.setAttribute(`x`,(c+l)/2),e.text.textContent=`${i} - ${o}`;let u=[`mi-bar`];n<=(t.idx??-1)&&!a&&u.push(`is-done`),n===t.idx&&!a&&u.push(`is-active`),e.g.setAttribute(`class`,u.join(` `))}),O.forEach((e,t)=>{let n=r[t];if(!n){e.style.opacity=`0`;return}e.style.opacity=`1`;let i=f(n[0]),a=f(n[1]);e.setAttribute(`x`,i),e.setAttribute(`width`,Math.max(6,a-i))}),E.textContent=`结果（已收 ${r.length} 段）`,o){let e=f(t.curStart),n=f(t.curEnd);D.setAttribute(`x`,e),D.setAttribute(`width`,Math.max(6,n-e)),D.style.opacity=`1`}else D.style.opacity=`0`;b.textContent=o?`当前 [${t.curStart}, ${t.curEnd}]`:`当前 -`,i===`init`?x.textContent=`先按左端点排序`:i===`sort`?x.textContent=`排序完成，开始扫描`:i===`start`?x.textContent=`第一段直接入座`:i===`extend`?x.textContent=`${t.sorted[t.idx][0]} <= ${t.curEnd} → 延伸（max 保底）`:i===`close`?x.textContent=`${t.sorted[t.idx][0]} > ${t.curEnd} → 收段、新开`:x.textContent=`最后一段收进结果`,S.textContent=a?`${t.result.length} 段`:`结果 ${t.result.length} 段`,Z(k,t.desc)}a.appendChild(k);let j=Q();a.appendChild(j.root),e.textContent=``,e.appendChild(a),X();let M=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,N=$({steps:n,controls:j,intervalMs:Nu,onRender:A});N.jumpTo(Math.trunc(t.initialStep)||0);let P=null;return r&&!M&&typeof IntersectionObserver==`function`&&(P=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){P.disconnect(),P=null,N.play();return}},{threshold:.35}),P.observe(a)),{destroy(){P&&=(P.disconnect(),null),N.destroy(),e.textContent=``,delete e.dataset.miMounted,document.getElementById(Cu)?.remove()}}}var Lu=[4,5,6,7,0,1,2],Ru=0;function zu(e={}){let t=(Array.isArray(e.nums)?e.nums:Lu).slice(),n=t.length,r=Number.isInteger(e.target)?e.target:Ru,i=[],a=(e,n,a={})=>{i.push({phase:e,desc:n,nums:t,target:r,l:null,r:null,live:null,mid:null,midVal:null,ordered:null,range:null,foundIdx:null,done:e===`done`,...a})};if(n===0)return a(`done`,`输入是空的，返回 -1。`,{foundIdx:-1}),i;a(`init`,`在旋转数组 \`[${t.join(`, `)}]\` 里搜 \`${r}\`，要求 \`O(log n)\` —— 不能先旋转回来再搜。旋转数组的馈赠是：**mid 把区间切成的两半里，至少有一半完全有序**。所以每一步三连问：mid 是不是答案？哪一半有序？target 在有序的那半的值域里吗？在 → 进有序半；不在 → 目标只可能在另一半。`);let o=0,s=n-1,c=0;for(;o<=s&&c<100;){c+=1;let e=o,n=s,l=Math.floor((e+n)/2),u=t[l];if(u===r)return a(`probe`,`\`mid = ${l}\`，\`nums[${l}] = ${u}\` —— **正好是 target，命中**。`,{l:e,r:n,live:[e,n],mid:l,midVal:u,foundIdx:l}),a(`done`,`**target ${r} 的下标 = ${l}**。这趟每一步都是"判有序半 → 查值域 → 进对的那半"，\`O(log n)\`，和普通二分一样的复杂度 —— 旋转只是把"哪半有序"换了个位置，判断框架一个字没变。`,{l:e,r:n,live:[e,n],mid:l,midVal:u,foundIdx:l}),i;t[e]<=u?r>=t[e]&&r<u?(s=l-1,a(`probe`,`\`mid = ${l}\`（值 \`${u}\`，不是 target）。\`nums[l] = ${t[e]} <= nums[mid]\` —— **左半 \`[${e}, ${l}]\` 有序**，值域 \`[${t[e]}, ${u})\`。target \`${r}\` 在值域内 → 进左半 → \`r = ${l-1}\`。`,{l:e,r:n,live:[e,l-1],mid:l,midVal:u,ordered:`left`,range:[t[e],u]})):(o=l+1,a(`probe`,`\`mid = ${l}\`（值 \`${u}\`，不是 target）。\`nums[l] = ${t[e]} <= nums[mid]\` —— **左半有序**，值域 \`[${t[e]}, ${u})\`。target \`${r}\` 不在值域内 → 它只可能在**右半**（哪怕右半是断崖那侧）→ \`l = ${l+1}\`。`,{l:e,r:n,live:[l+1,n],mid:l,midVal:u,ordered:`left`,range:[t[e],u]})):r>u&&r<=t[n]?(o=l+1,a(`probe`,`\`mid = ${l}\`（值 \`${u}\`，不是 target）。\`nums[l] = ${t[e]} > nums[mid]\` —— **右半 \`[${l}, ${n}]\` 有序**，值域 \`(${u}, ${t[n]}]\`。target \`${r}\` 在值域内 → 进右半 → \`l = ${l+1}\`。`,{l:e,r:n,live:[l+1,n],mid:l,midVal:u,ordered:`right`,range:[u,t[n]]})):(s=l-1,a(`probe`,`\`mid = ${l}\`（值 \`${u}\`，不是 target）。\`nums[l] = ${t[e]} > nums[mid]\` —— **右半有序**，值域 \`(${u}, ${t[n]}]\`。target \`${r}\` 不在值域内 → 只可能在左半 → \`r = ${l-1}\`。`,{l:e,r:n,live:[e,l-1],mid:l,midVal:u,ordered:`right`,range:[u,t[n]]}))}return a(`done`,c>=100?`异常退出（步数上限），正常输入不会走到这里。`:`\`l > r\`，区间空了 —— **target \`${r}\` 不在数组里，返回 -1**。注意这趟每一步的"哪半有序"判断都没有出过错：二分在旋转数组上依然是对的，只要每一步都确认"要去的那半真的包含答案"。`,{l:o,r:s,live:[o,s],foundIdx:-1}),i}var Bu=`rsearch-styles`,Vu=54,Hu=84,Uu=46,Wu=158,Gu=178,Ku=130,qu=26,Ju=604,Yu=1250,Xu=`
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
`;function Zu(){if(document.getElementById(Bu))return;let e=document.createElement(`style`);e.id=Bu,e.textContent=Xu,document.head.appendChild(e)}function Qu(e,t={}){if(!e||e.dataset.rsMounted===`1`)return{destroy(){}};e.dataset.rsMounted=`1`,Zu();let n=zu(t),r=t.autoplay!==!1,i=n[0].nums,a=n[0].target,o=i.length,s=Y,c=document.createElement(`div`);c.className=`viz rsearch`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(o===0){let t=s(`svg`,{class:`viz__svg rsearch__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{class:`rsearch-empty__text`,x:310,y:60});return n.textContent=`空输入 —— 返回 -1`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),X(),{destroy(){e.textContent=``,delete e.dataset.rsMounted,document.getElementById(Bu)?.remove()}}}let d=58;o*d+(o-1)*6>Ju&&(d=Math.max(20,Math.floor((Ju-(o-1)*6)/o)));let f=o*d+(o-1)*6,p=Math.max(660,qu*2+f),m=(p-f)/2,h=e=>m+e*(d+6)+d/2,g=Ku/Math.max(...i,a),_=e=>336-e*g,v=p-qu*2,y=s(`svg`,{class:`viz__svg rsearch__svg`,viewBox:`0 0 ${p} 372`,role:`img`,"aria-label":`搜索旋转排序数组 推演动画`});l.appendChild(y);let b=s(`g`,{class:`rsearch-cells`}),x=s(`g`,{class:`rsearch-marks`});y.appendChild(b),y.appendChild(x);let S=s(`text`,{class:`rsearch-note`,x:qu,y:Vu});S.textContent=`mid 把区间切两半，至少一半有序 —— 在有序半查值域，就知道 target 在哪边`,x.appendChild(S),x.appendChild(s(`rect`,{class:`rsearch-banner__box`,x:qu,y:Hu,width:v,height:Uu,rx:9}));let C=s(`text`,{class:`rsearch-banner__seg`,x:44,y:107}),w=s(`text`,{class:`rsearch-banner__seg`,x:266,y:107}),T=s(`text`,{class:`rsearch-banner__ans`,x:p-qu-18,y:107});x.appendChild(C),x.appendChild(w),x.appendChild(T);let E=[];for(let e=0;e<o;e+=1){let t=s(`g`,{class:`rsearch-cell`}),n=Math.max(14,i[e]*g),r=s(`rect`,{class:`rsearch-cell__box`,x:h(e)-d/2,y:336-n,width:d,height:n,rx:5});t.appendChild(r);let a=s(`text`,{class:`rsearch-cell__val`,x:h(e),y:336-n+14});a.textContent=String(i[e]),t.appendChild(a);let o=s(`text`,{class:`rsearch-cell__idx`,x:h(e),y:364});o.textContent=String(e),t.appendChild(o),b.appendChild(t),E.push({g:t})}let D={};for(let e of[`l`,`m`,`r`]){let t=s(`g`,{class:`rsearch-pin rsearch-pin--${e}`}),n=s(`rect`,{class:`rsearch-pin__tag`,x:0,y:Wu,width:22,height:20,rx:5}),r=s(`path`,{class:`rsearch-pin__tag`,d:`M 0 0 L 0 0 L 0 0`}),i=s(`text`,{class:`rsearch-pin__text`,x:0,y:168});i.textContent=e,t.appendChild(n),t.appendChild(r),t.appendChild(i),x.appendChild(t),D[e]={g:t,tag:n,tri:r,text:i}}let O=s(`line`,{class:`rsearch-target__line`,x1:m-10,y1:0,x2:m+f+10,y2:0}),k=s(`text`,{class:`rsearch-target__text`,x:0,y:0});k.textContent=`target = ${a}`,x.appendChild(O),x.appendChild(k);let A=s(`circle`,{class:`rsearch-hit__ring`,cx:0,cy:0,r:0}),j=s(`text`,{class:`rsearch-hit__text`,x:0,y:0});x.appendChild(A),x.appendChild(j);let M=u();function N(e,t){if(!t)return;let n=t.phase===`done`,r=t.live??(t.l===null?null:[t.l,t.r]),s=new Set;if(t.ordered===`left`&&t.mid!==null)for(let e=t.l;e<=t.mid;e+=1)s.add(e);else if(t.ordered===`right`&&t.mid!==null)for(let e=t.mid;e<=t.r;e+=1)s.add(e);E.forEach((e,t)=>{let n=[`rsearch-cell`];r&&(t<r[0]||t>r[1])?n.push(`is-out`):s.has(t)&&n.push(`is-ordered`),e.g.setAttribute(`class`,n.join(` `))});let c=(e,t)=>{let n=D[e];if(t==null||t<0||t>=o){n.g.style.opacity=`0`;return}let r=h(t);n.tag.setAttribute(`x`,r-11),n.tri.setAttribute(`d`,`M ${r-6} ${Gu} L ${r+6} ${Gu} L ${r} 187 z`),n.text.setAttribute(`x`,r),n.g.style.opacity=`1`};c(`l`,t.l),c(`m`,n?null:t.mid),c(`r`,n?null:t.r);let l=_(a);if(O.setAttribute(`y1`,l),O.setAttribute(`y2`,l),k.setAttribute(`x`,m+f+12),k.setAttribute(`y`,l),t.foundIdx!==null&&t.foundIdx>=0){let e=h(t.foundIdx),n=Math.max(14,i[t.foundIdx]*g);A.setAttribute(`cx`,e),A.setAttribute(`cy`,336-n/2),A.setAttribute(`r`,Math.max(16,d/2+6)),j.setAttribute(`x`,e),j.setAttribute(`y`,336-n-22),j.textContent=`下标 ${t.foundIdx}`,A.style.opacity=`1`,j.style.opacity=`1`}else A.style.opacity=`0`,j.style.opacity=`0`;C.textContent=r?`存活区间 [${r[0]}, ${r[1]}]`:`存活区间 -`,t.phase===`init`?w.textContent=`在 ${t.nums.length} 个数里找 target = ${a}`:t.ordered===`left`?w.textContent=`左半 [${t.l}, ${t.mid}] 有序，值域 [${t.range[0]}, ${t.range[1]})`:t.ordered===`right`?w.textContent=`右半 [${t.mid}, ${t.r}] 有序，值域 (${t.range[0]}, ${t.range[1]}]`:n&&t.foundIdx!==null&&t.foundIdx>=0?w.textContent=`命中`:n?w.textContent=`区间空了，不存在`:w.textContent=``;let u=n&&(t.foundIdx===null||t.foundIdx<0);T.textContent=u?`-1`:t.foundIdx!==null&&t.foundIdx>=0?`下标 ${t.foundIdx}`:`?`,T.setAttribute(`class`,u?`rsearch-banner__ans is-miss`:`rsearch-banner__ans`),Z(M,t.desc)}c.appendChild(M);let P=Q();c.appendChild(P.root),e.textContent=``,e.appendChild(c),X();let F=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,I=$({steps:n,controls:P,intervalMs:Yu,onRender:N});I.jumpTo(Math.trunc(t.initialStep)||0);let L=null;return r&&!F&&typeof IntersectionObserver==`function`&&(L=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){L.disconnect(),L=null,I.play();return}},{threshold:.35}),L.observe(c)),{destroy(){L&&=(L.disconnect(),null),I.destroy(),e.textContent=``,delete e.dataset.rsMounted,document.getElementById(Bu)?.remove()}}}var $u=[4,5,6,7,0,1,2];function ed(e={}){let t=(Array.isArray(e.nums)?e.nums:$u).slice(),n=t.length,r=[],i=(e,n,i={})=>{r.push({phase:e,desc:n,nums:t,l:null,r:null,live:null,mid:null,midVal:null,rightVal:null,cmp:null,minIdx:null,done:e===`done`,...i})};if(n===0)return i(`done`,`输入是空的，没有最小值。`),r;i(`init`,`旋转数组 \`[${t.join(`, `)}]\`：把一段递增数组从中间切开、两段换个位置 —— 它因此变成**两段各自上升的折线，中间一道断崖**，最小值就站在断崖右侧那段的起点上。二分的每一步只问一个问题：**\`nums[mid]\` 和 \`nums[r]\` 谁大？** \`nums[mid] > nums[r]\` 说明 mid 站在断崖左边（第一段上），最小值在它右边；\`nums[mid] < nums[r]\` 说明 mid 已经在第二段上，最小值在 \`[l, mid]\` 里 —— mid 自己可能就是答案，所以左边界的收缩是 \`r = mid\` 而不是 \`r = mid - 1\`。`);let a=0,o=n-1,s=0;for(;a<o&&s<100;){s+=1;let e=a,n=o,r=Math.floor((e+n)/2),c=t[r],l=t[n];c>l?(a=r+1,i(`probe`,`\`mid = ${r}\`，\`nums[${r}] = ${c} > nums[${n}] = ${l}\` —— mid 站在**断崖左边的第一段**上（它比末尾还大，说明它右边一定跨过了断崖、有更小的数），最小值在 \`[${r+1}, ${n}]\`，mid 自己被淘汰 → \`l = ${r+1}\`。`,{l:e,r:n,live:[a,o],mid:r,midVal:c,rightVal:l,cmp:`>`})):(o=r,i(`probe`,`\`mid = ${r}\`，\`nums[${r}] = ${c} < nums[${n}] = ${l}\` —— mid 已经站在**断崖右边的第二段**上（或者断崖就是 mid 本身），最小值在 \`[${e}, ${r}]\` 里。注意 **mid 可能就是最小值，不能丢** → \`r = ${r}\`（不是 mid-1）。`,{l:e,r:n,live:[a,o],mid:r,midVal:c,rightVal:l,cmp:`<`}))}let c=a;return i(`done`,a===o?`\`l\` 和 \`r\` 相遇在下标 \`${a}\` —— **最小值 = \`nums[${a}] = ${t[a]}\`**。回头看这趟：每一步只用一次比较，就把一半的候选**确定性地**淘汰掉，\`O(log n)\`。数组没旋转时同样成立：mid 永远 < right，一直往左缩，最后停在 nums[0] —— 退化成"找头"，但复杂度不变。`:`异常退出（步数上限），正常输入不会走到这里。`,{l:a,r:o,live:[a,o],mid:a,midVal:t[a],rightVal:t[o],minIdx:c,cmp:null}),r}var td=`rmin-styles`,nd=54,rd=84,id=46,ad=158,od=178,sd=130,cd=26,ld=604,ud=1250,dd=`
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
`;function fd(){if(document.getElementById(td))return;let e=document.createElement(`style`);e.id=td,e.textContent=dd,document.head.appendChild(e)}function pd(e,t={}){if(!e||e.dataset.rminMounted===`1`)return{destroy(){}};e.dataset.rminMounted=`1`,fd();let n=ed(t),r=t.autoplay!==!1,i=n[0].nums,a=i.length,o=Y,s=document.createElement(`div`);s.className=`viz rmin`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);function l(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(a===0){let t=o(`svg`,{class:`viz__svg rmin__svg`,viewBox:`0 0 620 120`,role:`img`}),n=o(`text`,{class:`rmin-empty__text`,x:310,y:60});return n.textContent=`空输入 —— 没有最小值`,t.appendChild(n),c.appendChild(t),s.appendChild(l()),s.appendChild(Q().root),e.textContent=``,e.appendChild(s),X(),{destroy(){e.textContent=``,delete e.dataset.rminMounted,document.getElementById(td)?.remove()}}}let u=58;a*u+(a-1)*6>ld&&(u=Math.max(20,Math.floor((ld-(a-1)*6)/a)));let d=a*u+(a-1)*6,f=Math.max(660,cd*2+d),p=(f-d)/2,m=e=>p+e*(u+6)+u/2,h=sd/Math.max(...i),g=e=>Math.max(14,e*h),_=f-cd*2,v=o(`svg`,{class:`viz__svg rmin__svg`,viewBox:`0 0 ${f} 372`,role:`img`,"aria-label":`寻找旋转排序数组中的最小值 推演动画`});c.appendChild(v);let y=o(`g`,{class:`rmin-cells`}),b=o(`g`,{class:`rmin-marks`});v.appendChild(y),v.appendChild(b);let x=o(`text`,{class:`rmin-note`,x:cd,y:nd});x.textContent=`只问一句：nums[mid] 和 nums[right] 谁大 —— 断崖在哪边，最小值就在哪边`,b.appendChild(x),b.appendChild(o(`rect`,{class:`rmin-banner__box`,x:cd,y:rd,width:_,height:id,rx:9}));let S=o(`text`,{class:`rmin-banner__seg`,x:44,y:107}),C=o(`text`,{class:`rmin-banner__seg`,x:256,y:107}),w=o(`text`,{class:`rmin-banner__ans`,x:f-cd-18,y:107});b.appendChild(S),b.appendChild(C),b.appendChild(w);let T=[];for(let e=0;e<a;e+=1){let t=o(`g`,{class:`rmin-cell`}),n=g(i[e]),r=o(`rect`,{class:`rmin-cell__box`,x:m(e)-u/2,y:336-n,width:u,height:n,rx:5});t.appendChild(r);let a=o(`text`,{class:`rmin-cell__val`,x:m(e),y:336-n+14});a.textContent=String(i[e]),t.appendChild(a);let s=o(`text`,{class:`rmin-cell__idx`,x:m(e),y:364});s.textContent=String(e),t.appendChild(s),y.appendChild(t),T.push({g:t})}let E={};for(let e of[`l`,`m`,`r`]){let t=o(`g`,{class:`rmin-pin rmin-pin--${e}`}),n=o(`rect`,{class:`rmin-pin__tag`,x:0,y:ad,width:22,height:20,rx:5}),r=o(`path`,{class:`rmin-pin__tag`,d:`M 0 0 L 0 0 L 0 0`}),i=o(`text`,{class:`rmin-pin__text`,x:0,y:168});i.textContent=e,t.appendChild(n),t.appendChild(r),t.appendChild(i),b.appendChild(t),E[e]={g:t,tag:n,tri:r,text:i}}let D=o(`circle`,{class:`rmin-min__ring`,cx:0,cy:0,r:0}),O=o(`text`,{class:`rmin-min__text`,x:0,y:0});b.appendChild(D),b.appendChild(O);let k=l();function A(e,t){if(!t)return;let n=t.phase===`done`,r=t.live??(t.l===null?null:[t.l,t.r]);T.forEach((e,i)=>{let a=[`rmin-cell`];r&&(i<r[0]||i>r[1])&&a.push(`is-out`),!n&&t.r!==null&&i===t.r&&a.push(`is-base`),e.g.setAttribute(`class`,a.join(` `))});let o=e=>m(e),s=(e,t)=>{let n=E[e];if(t==null||t<0||t>=a){n.g.style.opacity=`0`;return}let r=o(t);n.tag.setAttribute(`x`,r-11),n.tri.setAttribute(`d`,`M ${r-6} ${od} L ${r+6} ${od} L ${r} 187 z`),n.text.setAttribute(`x`,r),n.g.style.opacity=`1`};if(s(`l`,t.l),s(`m`,n?null:t.mid),s(`r`,n?null:t.r),n&&t.minIdx!==null){let e=m(t.minIdx),n=g(i[t.minIdx]);D.setAttribute(`cx`,e),D.setAttribute(`cy`,336-n/2),D.setAttribute(`r`,Math.max(16,u/2+6)),O.setAttribute(`x`,e),O.setAttribute(`y`,336-n-22),O.textContent=`min = ${i[t.minIdx]}`,D.style.opacity=`1`,O.style.opacity=`1`}else D.style.opacity=`0`,O.style.opacity=`0`;S.textContent=r?`存活区间 [${r[0]}, ${r[1]}]`:`存活区间 -`,t.phase===`init`?C.textContent=`mid 和 nums[right] 比：断崖在哪边，最小值就在哪边`:t.cmp===`>`?C.textContent=`${t.midVal} > ${t.rightVal} → mid 在第一段，去右边`:t.cmp===`<`?C.textContent=`${t.midVal} < ${t.rightVal} → mid 在第二段，r = mid`:n?C.textContent=`l 与 r 相遇`:C.textContent=``,w.textContent=n&&t.minIdx!==null?`min ${t.nums[t.minIdx]}`:`min ?`,Z(k,t.desc)}s.appendChild(k);let j=Q();s.appendChild(j.root),e.textContent=``,e.appendChild(s),X();let M=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,N=$({steps:n,controls:j,intervalMs:ud,onRender:A});N.jumpTo(Math.trunc(t.initialStep)||0);let P=null;return r&&!M&&typeof IntersectionObserver==`function`&&(P=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){P.disconnect(),P=null,N.play();return}},{threshold:.35}),P.observe(s)),{destroy(){P&&=(P.disconnect(),null),N.destroy(),e.textContent=``,delete e.dataset.rminMounted,document.getElementById(td)?.remove()}}}var md=[1,2,3,4,5,6,7],hd=3;function gd(e={}){let t=(Array.isArray(e.nums)?e.nums:md).slice(),n=t.length,r=Number.isInteger(e.k)?e.k:hd,i=n>0?(r%n+n)%n:0,a=[],o=(e,r,o={})=>{a.push({phase:e,desc:r,arr:t.slice(),n,k:i,round:0,roundName:``,flipRange:null,i:null,j:null,swapsDone:0,done:e===`done`,...o})};if(n===0)return o(`done`,`输入是空的，没有可轮转的元素。`),a;if(o(`init`,`给了 \`${n}\` 个数 \`[${t.join(`, `)}]\`，向右轮转 \`${r}\` 位。先取模：\`k = ${r} mod ${n} = ${i}\`（轮转 n 位等于没转，k 可能比 n 大）。`+(i===0?`取模后 k = 0 —— 数组不变，直接结束。`:`要求的进阶是 **O(1) 额外空间**，排除"再开一个数组按位搬运"，剩下的是**三次原地翻转**：① 整体翻转；② 翻转前 k 个；③ 翻转后 n-k 个。原理一句话：**轮转 = 两段交换左右位置**，整体翻转让两段就位（内部顺序全倒），再各自翻回来 —— 反转是自己的逆运算，两次反转让内部顺序复原。`)),i===0)return o(`done`,`取模后 \`k = 0\`，数组不变：\`[${t.join(`, `)}]\`。顺带一个语言坑：Python 切片写法 \`nums[-k:] + nums[:-k]\` 在 k=0 时会炸 —— \`-0\` 就是 \`0\`，\`nums[-0:]\` 是**整个数组**，结果变成"数组接上自己"。所以切片法必须先取模、再特判 k=0（或写 \`nums[n-k:]\`）。`),a;let s=[{a:0,b:n-1,name:`整体翻转`},{a:0,b:i-1,name:`翻转前 k`},{a:i,b:n-1,name:`翻转后 n-k`}],c=0;for(let{a:e,b:n,name:r}of s){c+=1;let i=0,a=e,s=n;for(;a<s;){let l=t[a];t[a]=t[s],t[s]=l,i+=1,o(`flip`,`**第 \`${c}\` 次（${r}，区间 \`[${e}, ${n}]\`）**：交换 \`i = ${a}\` 与 \`j = ${s}\` —— \`${t[s]}\` 和 \`${t[a]}\` 换位（swap 后），数组变成 \`[${t.join(`, `)}]\`。双指针向中间收拢：\`i → ${a+1}\`，\`j → ${s-1}\`。`+(a+1<s-1?` 还有交换要做。`:a+1===s-1?` 还剩中间一对。`:` 本轮翻转完成。`),{round:c,roundName:r,flipRange:[e,n],i:a,j:s,swapsDone:i}),a+=1,--s}i===0&&o(`flip`,`**第 \`${c}\` 次（${r}，区间 \`[${e}, ${n}]\`）**：区间长度不足 2，不需要交换（k = 1 时"前 k 个"就是单元素，天然有序）。`,{round:c,roundName:r,flipRange:[e,n],i:null,j:null,swapsDone:0})}return o(`done`,`三次翻转完成。**答案 = [${t.join(`, `)}]**。回头看这三步：每一步都只做**原地交换**，总共 ${c} 轮、每轮扫描一半区间，时间 \`O(n)\`，**额外空间 O(1)** —— 这就是题目进阶要的答案。对照另一种 O(1) 解法"环状替换"（从 0 出发按 \`(i + k) mod n\` 跳环，需要数 gcd 圈），三次翻转不需要任何数论，好写好记 —— 面试首选。`,{arr:t.slice(),round:3,roundName:`完成`,done:!0}),a}var _d=`rot-styles`,vd=54,yd=84,bd=46,xd=152,Sd=172,Cd=194,wd=52,Td=262,Ed=286,Dd=26,Od=604,kd=1250,Ad=`
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
`;function jd(){if(document.getElementById(_d))return;let e=document.createElement(`style`);e.id=_d,e.textContent=Ad,document.head.appendChild(e)}function Md(e,t={}){if(!e||e.dataset.rotMounted===`1`)return{destroy(){}};e.dataset.rotMounted=`1`,jd();let n=gd(t),r=t.autoplay!==!1,i=n[0].arr.length,a=Y,o=document.createElement(`div`);o.className=`viz rot`;let s=document.createElement(`div`);s.className=`viz__stage`,o.appendChild(s);function c(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(i===0){let t=a(`svg`,{class:`viz__svg rot__svg`,viewBox:`0 0 620 120`,role:`img`}),n=a(`text`,{class:`rot-empty__text`,x:310,y:60});return n.textContent=`空输入 —— 没有可轮转的元素`,t.appendChild(n),s.appendChild(t),o.appendChild(c()),o.appendChild(Q().root),e.textContent=``,e.appendChild(o),X(),{destroy(){e.textContent=``,delete e.dataset.rotMounted,document.getElementById(_d)?.remove()}}}let l=58;i*l+(i-1)*6>Od&&(l=Math.max(20,Math.floor((Od-(i-1)*6)/i)));let u=i*l+(i-1)*6,d=Math.max(660,Dd*2+u),f=(d-u)/2,p=e=>f+e*(l+6)+l/2,m=d-Dd*2,h=a(`svg`,{class:`viz__svg rot__svg`,viewBox:`0 0 ${d} 310`,role:`img`,"aria-label":`轮转数组 三次翻转推演动画`});s.appendChild(h);let g=a(`g`,{class:`rot-cells`}),_=a(`g`,{class:`rot-marks`});h.appendChild(g),h.appendChild(_);let v=a(`text`,{class:`rot-note`,x:Dd,y:vd});v.textContent=`轮转 = 两段交换位置：整体翻转让两段就位，再各自翻回内部顺序`,_.appendChild(v),_.appendChild(a(`rect`,{class:`rot-banner__box`,x:Dd,y:yd,width:m,height:bd,rx:9}));let y=a(`text`,{class:`rot-banner__seg`,x:44,y:107}),b=a(`text`,{class:`rot-banner__seg`,x:276,y:107}),x=a(`text`,{class:`rot-banner__ans`,x:d-Dd-18,y:107});_.appendChild(y),_.appendChild(b),_.appendChild(x);let S=[];for(let e=0;e<i;e+=1){let t=a(`g`,{class:`rot-cell`}),n=a(`rect`,{class:`rot-cell__box`,x:p(e)-l/2,y:Cd,width:l,height:wd,rx:6});t.appendChild(n);let r=a(`text`,{class:`rot-cell__val`,x:p(e),y:220});t.appendChild(r);let i=a(`text`,{class:`rot-cell__idx`,x:p(e),y:Td});i.textContent=String(e),t.appendChild(i),g.appendChild(t),S.push({g:t,box:n,val:r})}let C=a(`g`,{class:`rot-pin`}),w=a(`rect`,{class:`rot-pin__tag`,x:0,y:xd,width:30,height:20,rx:5}),T=a(`path`,{class:`rot-pin__tri`,d:`M 0 0 L 0 0 L 0 0`}),E=a(`text`,{class:`rot-pin__text`,x:0,y:162});C.appendChild(w),C.appendChild(T),C.appendChild(E),_.appendChild(C);let D=a(`text`,{class:`rot-phase__text`,x:d/2,y:Ed});_.appendChild(D);let O=c();function k(e,t){if(!t)return;let{arr:n,k:r,n:i}=t,a=t.phase===`done`,o=new Set;t.phase===`flip`&&t.i!==null&&(o.add(t.i),o.add(t.j));let s=t.flipRange;if(S.forEach((e,t)=>{e.val.textContent=String(n[t]);let r=[`rot-cell`];a?r.push(`is-done`):s&&t>=s[0]&&t<=s[1]&&r.push(`is-flipping`),o.has(t)&&r.push(`is-swap`),e.g.setAttribute(`class`,r.join(` `))}),t.phase===`flip`&&t.i!==null){let e=p(t.i);w.setAttribute(`x`,e-15),T.setAttribute(`d`,`M ${e-6} ${Sd} L ${e+6} ${Sd} L ${e} 181 z`),E.setAttribute(`x`,e),E.textContent=`i=${t.i}`,C.style.opacity=`1`}else C.style.opacity=`0`;y.textContent=t.round>0?`第 ${t.round}/3 次 · ${t.roundName}`:`k = ${r}（mod ${i}）`,t.phase===`init`?b.textContent=`取模 → 三次原地翻转`:t.phase===`flip`&&t.i!==null?b.textContent=`swap(${t.i}, ${t.j})`:t.phase===`flip`?b.textContent=`区间长度不足 2，跳过`:b.textContent=`三次翻转完成`,x.textContent=a?`[${n.join(`,`)}]`:`${i} 个数 · 轮转 ${r} 位`;let c=[`整体`,`前 k`,`后 n-k`].map((e,n)=>{let r=a||t.round>n||t.round===n+1&&t.phase===`flip`&&t.i===null,i=t.round===n+1&&t.phase===`flip`;return`${r?`[x]`:i?`[>]`:`[ ]`} ${e}`});D.textContent=c.join(`   `),Z(O,t.desc)}o.appendChild(O);let A=Q();o.appendChild(A.root),e.textContent=``,e.appendChild(o),X();let j=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,M=$({steps:n,controls:A,intervalMs:kd,onRender:k});M.jumpTo(Math.trunc(t.initialStep)||0);let N=null;return r&&!j&&typeof IntersectionObserver==`function`&&(N=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){N.disconnect(),N=null,M.play();return}},{threshold:.35}),N.observe(o)),{destroy(){N&&=(N.disconnect(),null),M.destroy(),e.textContent=``,delete e.dataset.rotMounted,document.getElementById(_d)?.remove()}}}var Nd=`456`,Pd=`77`;function Fd(e={}){let t=typeof e.num1==`string`&&e.num1.length>0?e.num1:Nd,n=typeof e.num2==`string`&&e.num2.length>0?e.num2:Pd,r=[],i=(e,i,a={})=>{r.push({phase:e,desc:i,num1:t,num2:n,col:-1,i:null,j:null,digitA:0,digitB:0,zeroA:!1,zeroB:!1,carryIn:0,sum:0,out:0,carryOut:0,resLow:[],maxLen:Math.max(t.length,n.length),done:e===`done`,...a})};i(`init`,`给了两个字符串形式的非负整数：\`${t}\` 和 \`${n}\`。题目禁止转整数、也没有大数类型 —— 这不是刁难，而是**排除法**：把「先转数字再算」的捷径全部排除，剩下的就是**小学列竖式** —— 从个位起，每一位算「两位数字 + 低位进位」，写下个位、把进位带上去。双指针 \`i\`、\`j\` 从两个串的**末尾**（个位）出发，指针不断左移对齐数位；循环条件是**三连 or**：\`i >= 0 || j >= 0 || carry > 0\` —— 前两个管「还有数位没加」，carry 管「最后还有进位要长出一位」。`);let a=t.length-1,o=n.length-1,s=0,c=[],l=Math.max(t.length,n.length),u=0;for(;a>=0||o>=0||s>0;){u+=1;let e=l-u,r=a>=0?t.charCodeAt(a)-48:0,d=o>=0?n.charCodeAt(o)-48:0,f=a<0,p=o<0,m=r+d+s,h=m%10,g=+(m>=10);c.push(h);let _=Id(e,l),v=[];v.push(`**${_}（第 \`${u}\` 列）**：`),v.push(f?"`0`（补零，num1 已走完）":`\`${r}\``),v.push(` + `),v.push(p?"`0`（补零，num2 已走完）":`\`${d}\``),v.push(` + 进位 \`${s}\` = \`${m}\``),m>=10?v.push(` —— 满十进一：**写下 \`${h}\`，进位 \`${g}\` 带上一位**。`):v.push(` —— 不满十：**写下 \`${h}\`，进位归 \`${g}\`**。`),v.push(a-1>=0||o-1>=0||g>0?`指针左移：\`i → ${a-1}\`，\`j → ${o-1}\`。`:`两串都走完、进位也是 0 —— 循环终止。`),i(`digit`,v.join(``),{col:e,i:a,j:o,digitA:r,digitB:d,zeroA:f,zeroB:p,carryIn:s,sum:m,out:h,carryOut:g,resLow:c.slice()}),--a,--o,s=g}let d=c.slice().reverse().join(``);return i(`done`,`所有列处理完，进位 \`0\`，循环停。结果低位在前（push 顺序就是从个位往高位），**reverse 后 join 成字符串：答案 = "${d}"**。回头看整个流程：每列只有一次「加-写-进」决策，时间 \`O(max(m, n))\`，除结果串外**额外空间 O(1)**。三个坑对照：一侧走完要**补 0** 而不是跳过；循环条件**漏掉 carry** 会丢最高位（\`"999" + "1"\` 会得 \`"000"\`）；结果用 \`push\` + 末尾 \`reverse\`，别用 \`unshift\` 头插（每帧 O(n)，整体 O(n^2)）。`,{col:-1,i:-1,j:-1,resLow:c.slice(),result:d,carryOut:0}),r}function Id(e,t){let n=t-1-e,r=[`个位`,`十位`,`百位`,`千位`];return n<r.length?r[n]:`10^${n} 位`}var Ld=`addstr-styles`,Rd=54,zd=84,Bd=46,Vd=150,Hd=162,Ud=184,Wd=194,Gd=46,Kd=252,qd=274,Jd=284,Yd=346,Xd=360,Zd=424,Qd=450,$d=26,ef=604,tf=1300,nf=`
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
`;function rf(){if(document.getElementById(Ld))return;let e=document.createElement(`style`);e.id=Ld,e.textContent=nf,document.head.appendChild(e)}function af(e,t={}){if(!e||e.dataset.addstrMounted===`1`)return{destroy(){}};e.dataset.addstrMounted=`1`,rf();let n=Fd(t),r=t.autoplay!==!1,i=n[0],a=i.num1,o=i.num2,s=i.maxLen,c=Y,l=document.createElement(`div`);l.className=`viz addstr`;let u=document.createElement(`div`);u.className=`viz__stage`,l.appendChild(u);function d(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let f=58;(s+1)*f+s*6>ef&&(f=Math.max(26,Math.floor((ef-s*6)/(s+1))));let p=(s+1)*f+s*6,m=s*f+(s-1)*6,h=Math.max(660,$d*2+p),g=h-$d,_=g-p,v=g-m,y=e=>v+e*(f+6)+f/2,b=e=>_+e*(f+6)+f/2,x=h-$d*2,S=c(`svg`,{class:`viz__svg addstr__svg`,viewBox:`0 0 ${h} 474`,role:`img`,"aria-label":`字符串相加 竖式加法推演动画`});u.appendChild(S);let C=c(`g`,{class:`addstr-cells`}),w=c(`g`,{class:`addstr-marks`});S.appendChild(C),S.appendChild(w);let T=c(`text`,{class:`addstr-note`,x:$d,y:Rd});T.textContent=`竖式加法：从个位起，每位算「两位数字 + 低位进位」，写下个位、进位带上`,w.appendChild(T),w.appendChild(c(`rect`,{class:`addstr-banner__box`,x:$d,y:zd,width:x,height:Bd,rx:9}));let E=c(`text`,{class:`addstr-banner__seg`,x:44,y:107}),D=c(`text`,{class:`addstr-banner__seg`,x:236,y:107}),O=c(`text`,{class:`addstr-banner__ans`,x:h-$d-18,y:107});w.appendChild(E),w.appendChild(D),w.appendChild(O);let k=(e,t)=>{let n=c(`text`,{x:_-14,y:e,style:`fill: var(--addstr-muted, #657168); font-size: 12px; text-anchor: end; dominant-baseline: central; font-family: Consolas, monospace;`});n.textContent=t,w.appendChild(n)},A=[];for(let e=0;e<s;e+=1){let t=c(`text`,{class:`addstr-carry`,x:y(e),y:Vd});t.style.opacity=`0`,w.appendChild(t),A.push(t)}function j(e,t){let n=[];for(let r=0;r<t;r+=1){let t=c(`g`,{class:`addstr-cell`}),i=c(`rect`,{class:`addstr-cell__box`,x:y(r)-f/2,y:e,width:f,height:Gd,rx:6});t.appendChild(i);let a=c(`text`,{class:`addstr-cell__val`,x:y(r),y:e+Gd/2});t.appendChild(a),C.appendChild(t),n.push({g:t,box:i,val:a})}return n}let M=j(Wd,s),N=j(Jd,s),P=c(`line`,{class:`addstr-rule`,x1:_,y1:Yd,x2:g,y2:Yd});w.appendChild(P);let F=[];for(let e=0;e<=s;e+=1){let t=c(`g`,{class:`addstr-cell`}),n=c(`rect`,{class:`addstr-cell__box`,x:b(e)-f/2,y:Xd,width:f,height:Gd,rx:6});t.appendChild(n);let r=c(`text`,{class:`addstr-cell__val`,x:b(e),y:383});t.appendChild(r),C.appendChild(t),F.push({g:t,box:n,val:r})}for(let e=1;e<=s;e+=1){let t=c(`text`,{class:`addstr-cell__idx`,x:b(e),y:Zd});t.textContent=String(e-1),w.appendChild(t)}function I(e,t){let n=c(`g`,{class:`addstr-pin`}),r=c(`rect`,{class:`addstr-pin__tag`,x:0,y:e,width:34,height:20,rx:5}),i=c(`path`,{class:`addstr-pin__tri`,d:`M 0 0 L 0 0 L 0 0`}),a=c(`text`,{class:`addstr-pin__text`,x:0,y:e+10});return n.appendChild(r),n.appendChild(i),n.appendChild(a),w.appendChild(n),{g:n,tag:r,tri:i,text:a}}let L=I(Hd,Ud),R=I(Kd,qd),z=c(`text`,{class:`addstr-phase__text`,x:h/2,y:Qd});w.appendChild(z),k(217,`num1`),k(307,`num2`),k(383,`res`);let B=d();function V(e,t){if(!t)return;let n=t.phase===`done`,r=t.phase===`digit`;A.forEach((e,n)=>{let i=r&&t.carryOut>0&&n===t.col-1;e.textContent=`1`,e.style.opacity=i?`1`:`0`});let i=(e,n,i,a)=>{let o=n.length;e.forEach((e,i)=>{let c=i>=s-o,l=[`addstr-cell`];e.val.classList.remove(`is-zero`),c?(e.box.classList.remove(`is-dashed`),e.val.textContent=n[i-(s-o)],r&&i===t.col&&l.push(`is-active`)):(e.box.classList.add(`is-dashed`),r&&a&&i===t.col?(e.val.textContent=`0`,e.val.classList.add(`is-zero`)):e.val.textContent=``),e.g.setAttribute(`class`,l.join(` `))})};i(M,a,t.i,r&&t.zeroA),i(N,o,t.j,r&&t.zeroB);let c=t.resLow.length;F.forEach((e,i)=>{let a=[`addstr-cell`];if(e.val.classList.remove(`is-zero`),e.box.classList.remove(`is-dashed`),n){let n=s-i;n<c?(e.val.textContent=String(t.resLow[n]),a.push(`is-done`)):(e.box.classList.add(`is-dashed`),e.val.textContent=``)}else if(r){let n=s-i;n<c?(e.val.textContent=String(t.resLow[n]),n===c-1&&a.push(`is-fresh`)):(e.box.classList.add(`is-dashed`),e.val.textContent=``)}else e.box.classList.add(`is-dashed`),e.val.textContent=``;e.g.setAttribute(`class`,a.join(` `))});let l=(e,t,n,i,a,o)=>{let c=t+(s-n);if(r&&t>=0&&c>=0&&c<s){let t=y(c);e.tag.setAttribute(`x`,t-17),e.tri.setAttribute(`d`,`M ${t-6} ${a} L ${t+6} ${a} L ${t} ${a+9} z`),e.text.setAttribute(`x`,t),e.text.textContent=o,e.g.style.opacity=`1`}else e.g.style.opacity=`0`};if(l(L,t.i,a.length,Hd,Ud,`i`),l(R,t.j,o.length,Kd,qd,`j`),r?E.textContent=`第 ${s-t.col}/${s} 位 · ${(e=>{let t=s-1-e;return[`个位`,`十位`,`百位`,`千位`][t]||`10^${t} 位`})(t.col)}`:t.phase===`init`?E.textContent=`竖式对齐`:E.textContent=`${s} 列处理完`,r){let e=t.zeroA?`0+`:`${t.digitA}+`,n=t.zeroB?`0+`:`${t.digitB}+`;D.textContent=`${e}${n}${t.carryIn}=${t.sum} → 写 ${t.out} 进 ${t.carryOut}`}else t.phase===`init`?D.textContent=`双指针从个位出发`:D.textContent=`进位 0 · 终止`;O.textContent=n?`"${t.result}"`:`"${a}" + "${o}"`,r?z.textContent=`已写 ${t.resLow.length} 位 · i=${t.i} j=${t.j} carry=${t.carryOut}`:t.phase===`init`?z.textContent=`循环条件 i >= 0 || j >= 0 || carry > 0`:z.textContent=`答案 = reverse(resLow).join("") · O(max(m,n)) 时间 O(1) 空间`,Z(B,t.desc)}l.appendChild(B);let H=Q();l.appendChild(H.root),e.textContent=``,e.appendChild(l),X();let U=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,ee=$({steps:n,controls:H,intervalMs:tf,onRender:V});ee.jumpTo(Math.trunc(t.initialStep)||0);let te=null;return r&&!U&&typeof IntersectionObserver==`function`&&(te=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){te.disconnect(),te=null,ee.play();return}},{threshold:.35}),te.observe(l)),{destroy(){te&&=(te.disconnect(),null),ee.destroy(),e.textContent=``,delete e.dataset.addstrMounted,document.getElementById(Ld)?.remove()}}}var of=`1.02.3`,sf=`1.2.10`;function cf(e){let t=0;for(;t<e.length-1&&e[t]===`0`;)t+=1;return e.slice(t)}function lf(e,t){return e.length===t.length?e===t?0:e<t?-1:1:e.length<t.length?-1:1}function uf(e={}){let t=typeof e.version1==`string`&&e.version1.length>0?e.version1:of,n=typeof e.version2==`string`&&e.version2.length>0?e.version2:sf,r=t.split(`.`),i=n.split(`.`),a=Math.max(r.length,i.length),o=[],s=(e,t,n={})=>{o.push({phase:e,desc:t,rev1:r,rev2:i,col:-1,raw1:null,raw2:null,val1:``,val2:``,isPad1:!1,isPad2:!1,verdict:``,result:null,done:e===`done`,...n})};s(`init`,`给了两个版本号：\`${t}\` 和 \`${n}\`。按 \`.\` 切成修订号数组：\`[${r.map(e=>`"${e}"`).join(`, `)}]\` 和 \`[${i.map(e=>`"${e}"`).join(`, `)}]\`。比较规则把所有情况归到同一条铁轨：**先把每个修订号归一化（剥前导零，缺失视为 0），再逐列比较，**第一列分出胜负就短路返回。归一化后「比数值」有个漂亮的事实：**先比长度、等长再比字典序** —— 剥完前导零的数字串更长的一定更大，全程不用转数字，天然免疫超长修订号的 \`parseInt\` 精度陷阱。`);for(let e=0;e<a;e+=1){let a=e<r.length,c=e<i.length,l=a?r[e]:null,u=c?i[e]:null,d=cf(a?l:`0`),f=cf(c?u:`0`),p=lf(d,f),m=p===0?`equal`:p<0?`less`:`greater`,h=[];if(h.push(`**第 \`${e+1}\` 列**：`),h.push(a?`\`${l}\``:"`0`（补零，v1 修订号已用完）"),h.push(` vs `),h.push(c?`\`${u}\``:"`0`（补零，v2 修订号已用完）"),l!==null&&l!==d||u!==null&&u!==f||!a||!c){let e=[];e.push(a?`"${l}" → "${d}"`:null),e.push(c?`"${u}" → "${f}"`:null);let t=e.filter(Boolean).join(` 与 `);h.push(` —— 剥前导零归一化：${t}。`)}else h.push(` —— 本列无需剥零。`);if(d.length!==f.length&&h.push(`比长度：\`${d.length}\` vs \`${f.length}\` —— **长的一定大**（剥完前导零没有前导零）。`),m===`equal`?h.push(`**等长且逐字符相同 → 数值相等**，进下一列。`):m===`less`?h.push(`**\`${d}\` < \`${f}\`，第一列分出胜负，短路返回 \`-1\`。**`+(d.length===f.length?`注意不是字符比较：字符序里 \`${d[0]}\` 可能大于 \`${f[0]}\`，等长时字符序才恰好等于数值序。`:`字符比较会在这里翻车：字符序看首字符，数值看位数。`)):h.push(`**\`${d}\` > \`${f}\`，第一列分出胜负，短路返回 \`1\`。**`+(d.length===f.length?`等长逐字符比较，字符序 = 数值序。`:`比长度就分出了：位数多的大。`)),s(`compare`,h.join(``),{col:e,raw1:l,raw2:u,val1:d,val2:f,isPad1:!a,isPad2:!c,verdict:m}),m!==`equal`){let r=m===`less`?-1:1;return s(`done`,`第 \`${e+1}\` 列分出胜负，后面的列不用看（短路）。**返回 \`${r}\`**：\`${t}\` ${r<0?`<`:`>`} \`${n}\`。`,{col:e,result:r,verdict:m}),o}}return s(`done`,`所有列都相等（包括补零列）。**返回 \`0\`**：\`${t}\` 与 \`${n}\` 版本号相等 —— \`"1.01"\` 与 \`"1.001"\`、\`"1.0"\` 与 \`"1.0.0"\` 都在这条路上归为相等。`,{col:a-1,result:0,verdict:`equal`}),o}var df=`cmpver-styles`,ff=54,pf=84,mf=46,hf=156,gf=176,_f=46,vf=238,yf=314,bf=26,xf=1350,Sf=`
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
`;function Cf(){if(document.getElementById(df))return;let e=document.createElement(`style`);e.id=df,e.textContent=Sf,document.head.appendChild(e)}function wf(e,t={}){if(!e||e.dataset.cmpverMounted===`1`)return{destroy(){}};e.dataset.cmpverMounted=`1`,Cf();let n=uf(t),r=t.autoplay!==!1,i=n[0],a=i.rev1,o=i.rev2,s=Math.max(a.length,o.length),c=Y,l=document.createElement(`div`);l.className=`viz cmpver`;let u=document.createElement(`div`);u.className=`viz__stage`,l.appendChild(u);function d(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let f=Math.max(...a.map(e=>e.length),...o.map(e=>e.length),2),p=Math.min(76,Math.max(46,f*13+20)),m=s*p+(s-1)*8,h=Math.max(660,bf*2+m),g=(h-m)/2,_=e=>g+e*(p+8)+p/2,v=h-bf*2,y=c(`svg`,{class:`viz__svg cmpver__svg`,viewBox:`0 0 ${h} 338`,role:`img`,"aria-label":`比较版本号 逐列比较推演动画`});u.appendChild(y);let b=c(`g`,{class:`cmpver-cells`}),x=c(`g`,{class:`cmpver-marks`});y.appendChild(b),y.appendChild(x);let S=c(`text`,{class:`cmpver-note`,x:bf,y:ff});S.textContent=`归一化后逐列比较：剥前导零 + 缺失补 0，先比长度再比字典序`,x.appendChild(S),x.appendChild(c(`rect`,{class:`cmpver-banner__box`,x:bf,y:pf,width:v,height:mf,rx:9}));let C=c(`text`,{class:`cmpver-banner__seg`,x:44,y:107}),w=c(`text`,{class:`cmpver-banner__seg`,x:176,y:107}),T=c(`text`,{class:`cmpver-banner__ans`,x:h-bf-18,y:107});x.appendChild(C),x.appendChild(w),x.appendChild(T);let E=(e,t)=>{let n=c(`text`,{x:g-14,y:e,style:`fill: var(--cmpver-muted, #657168); font-size: 12px; text-anchor: end; dominant-baseline: central; font-family: Consolas, monospace;`});n.textContent=t,x.appendChild(n)};function D(e,t,n){let r=[];for(let t=0;t<s;t+=1){let n=c(`g`,{class:`cmpver-cell`}),i=c(`rect`,{class:`cmpver-cell__box`,x:_(t)-p/2,y:e,width:p,height:_f,rx:6});n.appendChild(i);let a=c(`text`,{class:`cmpver-cell__val`,x:_(t),y:e+_f/2});n.appendChild(a),b.appendChild(n),r.push({g:n,box:i,val:a,c:t})}for(let e=0;e<s;e+=1){let t=c(`text`,{class:`cmpver-cell__idx`,x:_(e),y:hf});t.textContent=String(e),x.appendChild(t)}return r}let O=D(gf,a,a.length),k=D(vf,o,o.length);E(199,`v1`),E(261,`v2`);let A=c(`text`,{class:`cmpver-phase__text`,x:h/2,y:yf});x.appendChild(A);let j=d();function M(e,t){if(!t)return;let n=t.phase===`done`,r=t.phase===`compare`,i=(e,i,a,o)=>{e.forEach(e=>{let s=e.c,c=s<a,l=[`cmpver-cell`];e.val.classList.remove(`is-zero`),e.box.classList.remove(`is-dashed`),c?(e.val.textContent=i[s],r&&s===t.col&&l.push(t.verdict===`equal`?`is-active`:`is-hot`),n&&s===t.col&&l.push(`is-done`)):(e.box.classList.add(`is-dashed`),r&&s===t.col&&o?(e.val.textContent=`0`,e.val.classList.add(`is-zero`),l.push(t.verdict===`equal`?`is-active`:`is-hot`)):e.val.textContent=``),e.g.setAttribute(`class`,l.join(` `))})};if(i(O,a,a.length,t.isPad1),i(k,o,o.length,t.isPad2),r){C.textContent=`第 ${t.col+1}/${s} 列`;let e=t.isPad1?`0(补)`:`"${t.raw1}" → ${t.val1}`,n=t.isPad2?`0(补)`:`"${t.raw2}" → ${t.val2}`,r=t.verdict===`equal`?`=`:t.verdict===`less`?`<`:`>`;w.textContent=`${e}  ${r}  ${n}`}else t.phase===`init`?(C.textContent=`按 . 切开`,w.textContent=`逐列归一化比较`):(C.textContent=`${s} 列比较完`,w.textContent=t.result===0?`全部相等`:`第 ${t.col+1} 列分出胜负`);T.textContent=n?`return ${t.result}`:`"${a.join(`.`)}" vs "${o.join(`.`)}"`,r?A.textContent=t.verdict===`equal`?`第 ${t.col+1} 列相等，进下一列（短路：一旦分出胜负立即返回）`:`第 ${t.col+1} 列分出胜负 → return ${t.verdict===`less`?-1:1}`:t.phase===`init`?A.textContent=`剥前导零（"0002" → "2"，全零 → "0"）· 缺失修订号视为 0`:A.textContent=`归一化比较：先比长度（长的一定大），等长再比字典序`,Z(j,t.desc)}l.appendChild(j);let N=Q();l.appendChild(N.root),e.textContent=``,e.appendChild(l),X();let P=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,F=$({steps:n,controls:N,intervalMs:xf,onRender:M});F.jumpTo(Math.trunc(t.initialStep)||0);let I=null;return r&&!P&&typeof IntersectionObserver==`function`&&(I=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){I.disconnect(),I=null,F.play();return}},{threshold:.35}),I.observe(l)),{destroy(){I&&=(I.disconnect(),null),F.destroy(),e.textContent=``,delete e.dataset.cmpverMounted,document.getElementById(df)?.remove()}}}var Tf=`babad`;function Ef(e={}){let t=typeof e.s==`string`&&e.s.length>0?e.s:Tf,n=Array.from(t),r=n.length,i=n,a=[],o=(e,t,i={})=>{a.push({phase:e,desc:t,chars:n,n:r,centerIdx:-1,centerType:null,ci:null,l:null,r:null,len:0,pal:null,bestL:null,bestR:null,bestLen:0,bestUpdated:!1,done:e===`done`,...i})};o(`init`,`给了字符串 \`${t}\`（\`${r}\` 个字符）。求最长回文子串。枚举所有子串要 \`O(n^2)\` 个、每个验回文又要 \`O(n)\` —— \`O(n^3)\` 起步。换个角度：**回文是关于中心对称的，枚举中心就够了** —— 中心只有 **\`2n-1 = ${2*r-1}\` 个**：\`${r}\` 个字符中心（管奇数回文，如 \`"bab"\`）+ \`${r-1}\` 个间隙中心（管偶数回文，如 \`"abba"\`）。每个中心向两边扩展到不能再扩，总时间 \`O(n^2)\`，**空间 O(1)**。下面按「字符 0 · 间隙 0 · 字符 1 · 间隙 1 · …」交错的顺序扫过所有中心。`);let s=null,c=null,l=0,u=0,d=(e,t)=>{let a=null,d=null;if(e===`char`)for(a=t,d=t;a>0&&d<r-1&&i[a-1]===i[d+1];)--a,d+=1;else if(i[t]===i[t+1])for(a=t,d=t+1;a>0&&d<r-1&&i[a-1]===i[d+1];)--a,d+=1;let f=a===null?0:d-a+1,p=a===null?null:n.slice(a,d+1).join(``),m=f>l;m&&(s=a,c=d,l=f);let h=e===`char`?`\`s[${t}]\``:`\`s[${t}]|s[${t+1}]\` 之间`,g=[];g.push(`**中心 \`${u+1}/${2*r-1}\`（${e===`char`?`字符中心`:`间隙中心`} ${h}）**：`),a===null?g.push(e===`gap`?`两侧字符 \`${i[t]}\` ≠ \`${i[t+1]}\`，连最小的偶数回文都构不成 —— 长度 0，跳过。`:`扩展结果就是它自己，长度 1。`):g.push(`向两边扩展到 \`[${a}, ${d}]\`，回文 **"${p}"**，长度 \`${f}\``+(m?` —— **超过当前最优（原 \`${l}\`），更新最优**。`:`，不超过当前最优（\`${l}\`），最优保持。`)),o(`center`,g.join(``),{centerIdx:u,centerType:e,ci:t,l:a,r:d,len:f,pal:p,bestL:s,bestR:c,bestLen:l,bestUpdated:m}),u+=1};for(let e=0;e<r;e+=1)d(`char`,e),e<r-1&&d(`gap`,e);return o(`done`,`\`${2*r-1}\` 个中心全部扫完，最优回文 **"${n.slice(s,c+1).join(``)}"**（\`[${s}, ${c}]\`，长度 \`${l}\`）。回头看：每个中心只向两边扫一次，总时间 \`O(n^2)\`、**空间 O(1)** —— 比 DP 的 \`O(n^2)\` 空间省一个量级。两个提醒：间隙中心（偶数回文）是最容易漏的，\`"abba"\`、\`"cbbd"\` 全靠它们；同长度时先到先得（\`"babad"\` 的 \`"bab"\` 先于 \`"aba"\` 出现）。`,{centerIdx:2*r-1,bestL:s,bestR:c,bestLen:l,done:!0}),a}var Df=`longpal-styles`,Of=54,kf=84,Af=46,jf=176,Mf=50,Nf=262,Pf=284,Ff=318,If=26,Lf=604,Rf=1250,zf=`
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
`;function Bf(){if(document.getElementById(Df))return;let e=document.createElement(`style`);e.id=Df,e.textContent=zf,document.head.appendChild(e)}function Vf(e,t={}){if(!e||e.dataset.longpalMounted===`1`)return{destroy(){}};e.dataset.longpalMounted=`1`,Bf();let n=Ef(t),r=t.autoplay!==!1,i=n[0],a=i.chars,o=i.n,s=Y,c=document.createElement(`div`);c.className=`viz longpal`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let d=52;o*d+(o-1)*8>Lf&&(d=Math.max(24,Math.floor((Lf-(o-1)*8)/o)));let f=o*d+(o-1)*8,p=Math.max(660,If*2+f),m=(p-f)/2,h=e=>m+e*(d+8)+d/2,g=e=>m+(e+1)*(d+8)-8/2,_=p-If*2,v=s(`svg`,{class:`viz__svg longpal__svg`,viewBox:`0 0 ${p} 342`,role:`img`,"aria-label":`最长回文子串 中心扩展推演动画`});l.appendChild(v);let y=s(`g`,{class:`longpal-cells`}),b=s(`g`,{class:`longpal-marks`});v.appendChild(y),v.appendChild(b);let x=s(`text`,{class:`longpal-note`,x:If,y:Of});x.textContent=`中心扩展：枚举 2n-1 个中心（字符 + 间隙），向两边扩展到不能再扩`,b.appendChild(x),b.appendChild(s(`rect`,{class:`longpal-banner__box`,x:If,y:kf,width:_,height:Af,rx:9}));let S=s(`text`,{class:`longpal-banner__seg`,x:44,y:107}),C=s(`text`,{class:`longpal-banner__seg`,x:216,y:107}),w=s(`text`,{class:`longpal-banner__ans`,x:p-If-18,y:107});b.appendChild(S),b.appendChild(C),b.appendChild(w);let T=[];for(let e=0;e<o;e+=1){let t=s(`g`,{class:`longpal-cell`}),n=s(`rect`,{class:`longpal-cell__box`,x:h(e)-d/2,y:jf,width:d,height:Mf,rx:6});t.appendChild(n);let r=s(`text`,{class:`longpal-cell__val`,x:h(e),y:201});r.textContent=a[e],t.appendChild(r);let i=s(`text`,{class:`longpal-cell__idx`,x:h(e),y:jf-8});i.textContent=String(e),b.appendChild(i),y.appendChild(t),T.push({g:t,box:n,val:r})}let E=[];for(let e=0;e<o-1;e+=1){let t=s(`line`,{class:`longpal-gapline`,x1:g(e),y1:jf-8,x2:g(e),y2:234});t.style.opacity=`0`,b.appendChild(t),E.push(t)}let D=s(`line`,{class:`longpal-bestline`,x1:0,y1:Nf,x2:0,y2:Nf}),O=s(`text`,{class:`longpal-besttext`,x:p/2,y:Pf});D.style.opacity=`0`,O.style.opacity=`0`,b.appendChild(D),b.appendChild(O);let k=s(`text`,{class:`longpal-phase__text`,x:p/2,y:Ff});b.appendChild(k);let A=u();function j(e,t){if(!t)return;let n=t.phase===`done`,r=t.phase===`center`;if(E.forEach((e,n)=>{let i=r&&t.centerType===`gap`&&t.ci===n;e.style.opacity=i?`1`:`0`}),T.forEach((e,i)=>{let a=[`longpal-cell`];e.box.classList.remove(`is-dashed`),r&&(t.l!==null&&i>=t.l&&i<=t.r&&a.push(`is-span`),t.centerType===`char`&&i===t.ci&&a.push(`is-center`)),n&&t.bestL!==null&&i>=t.bestL&&i<=t.bestR&&a.push(`is-best-done`),e.g.setAttribute(`class`,a.join(` `))}),t.bestL!==null){let e=m+t.bestL*(d+8),n=m+t.bestR*(d+8)+d;D.setAttribute(`x1`,e),D.setAttribute(`x2`,n),D.style.opacity=`1`,O.textContent=`best: "${t.chars.slice(t.bestL,t.bestR+1).join(``)}" (len ${t.bestLen})`,O.setAttribute(`x`,(e+n)/2),O.style.opacity=`1`}else D.style.opacity=`0`,O.style.opacity=`0`;r?(S.textContent=`中心 ${t.centerIdx+1}/${2*o-1}`,t.l===null?C.textContent=`s[${t.ci}] ≠ s[${t.ci+1}] → 长度 0`:C.textContent=`expand(${t.centerType===`char`?t.ci:`${t.ci},${t.ci+1}`}) → [${t.l}, ${t.r}] "${t.pal}"${t.bestUpdated?` ← 更新`:``}`):t.phase===`init`?(S.textContent=`中心扩展`,C.textContent=`${2*o-1} 个中心交错枚举`):(S.textContent=`${2*o-1} 个中心扫完`,C.textContent=`最优 [${t.bestL}, ${t.bestR}]`),w.textContent=n?`"${t.chars.slice(t.bestL,t.bestR+1).join(``)}"`:`"${a.join(``)}"`,r?k.textContent=t.len>0?`该中心最长回文 len=${t.len} · best=${t.bestLen}`:`偶数回文靠间隙中心 —— 漏了它们就漏了 "abba"`:t.phase===`init`?k.textContent=`字符中心管奇数回文（"bab"）· 间隙中心管偶数回文（"abba"）`:k.textContent=`O(n^2) 时间 · O(1) 空间 —— DP 是 O(n^2) 空间，Manacher 是 O(n) 但难写`,Z(A,t.desc)}c.appendChild(A);let M=Q();c.appendChild(M.root),e.textContent=``,e.appendChild(c),X();let N=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,P=$({steps:n,controls:M,intervalMs:Rf,onRender:j});P.jumpTo(Math.trunc(t.initialStep)||0);let F=null;return r&&!N&&typeof IntersectionObserver==`function`&&(F=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){F.disconnect(),F=null,P.play();return}},{threshold:.35}),F.observe(c)),{destroy(){F&&=(F.disconnect(),null),P.destroy(),e.textContent=``,delete e.dataset.longpalMounted,document.getElementById(Df)?.remove()}}}var Hf=`25525511135`;function Uf(e={}){let t=typeof e.s==`string`&&e.s.length>0?e.s:Hf,n=Array.from(t),r=n.length,i=[],a=(e,a,o={})=>{i.push({phase:e,desc:a,s:t,chars:n,n:r,path:[],pos:0,segLen:null,trySeg:null,verdict:null,ans:[],done:e===`done`,...o})};a(`init`,`给了只含数字的串 \`${t}\`（\`${r}\` 位）。复原 IP = 切成 4 段、中间插 3 个点：每段 1-3 位、数值 0-255、无前导零（\`"0"\` 合法、\`"01"\` 非法）。等价于在 \`${r-1}\` 个缝隙里选 3 个切点 —— 搜索空间天生有界（\`C(${r-1}, 3)\`）。回溯每层切一段：尝试切 1 / 2 / 3 位，**剪枝分两层** —— 段合法性（前导零、\`>255\`）与可行性（剩余位数 \`[segs, segs × 3]\` 才走得通）。`);let o=[],s=(e,n,i)=>{let a=4-i.length;if(e+n>r)return{verdict:`length`,seg:null,detail:`末尾不够切 ${n} 位`};let o=t.slice(e,e+n);if(o.length>1&&o[0]===`0`)return{verdict:`lead-zero`,seg:o,detail:`"${o}" 有前导零（"0" 合法，"0…" 非法）`};if(Number(o)>255)return{verdict:`range`,seg:o,detail:`${o} > 255`};let s=r-e-n,c=a-1;return c>0?s<c||s>c*3?{verdict:`length`,seg:o,detail:s<c?`剩余 ${s} 位 < 剩余 ${c} 段最少需要的 ${c} 位`:`剩余 ${s} 位 > 剩余 ${c} 段最多能装 ${c*3} 位`}:{verdict:`ok`,seg:o,detail:`段合法且剩余 ${s} 位可装进 ${c} 段，深入`}:s===0?{verdict:`answer`,seg:o,detail:`第 4 段恰好用完全部剩余位 —— 收下一个答案`}:{verdict:`length`,seg:o,detail:`第 4 段切完还剩 ${s} 位没进任何段 —— 4 段必须恰好用完全部 ${r} 位`}},c=(e,t)=>{if(t.length!==4)for(let n of[1,2,3]){let{verdict:i,seg:l,detail:u}=s(e,n,t);if(i===`answer`){let e=[...t,l];o.push(e.join(`.`))}4-t.length;let d=[];d.push(`**切第 \`${t.length+1}\` 段（试 ${n} 位）：**`),d.push(l===null?`末尾只剩 \`${r-e}\` 位，不够切。`:`试切 \`"${l}"\``),i===`ok`?d.push(` —— ${u}。`):i===`answer`?d.push(` —— ${u}：**"${[...t,l].join(`.`)}"**。`):i===`length`?d.push(` —— 剪：${u}（可行性 —— 整棵子树都不可行，这条分支到此为止）。`):(i===`lead-zero`||i===`range`)&&d.push(` —— 剪：${u}。`),i===`ok`&&d.push(`回溯后继续试 ${n<3?`切 ${n+1} 位`:`下一条分支`}。`),a(`try`,d.join(``),{path:t.slice(),pos:e,segLen:n,trySeg:l,verdict:i,ans:o.slice()}),i===`ok`?c(e+n,[...t,l]):i===`answer`&&a(`answer`,`第 \`${o.length}\` 个答案：**"${o[o.length-1]}"**。回溯继续找。`,{path:[...t,l],pos:e+n,segLen:n,trySeg:l,verdict:`answer`,ans:o.slice()})}};return r>=4&&r<=12?c(0,[]):a(`try`,`长度 \`${r}\` 不在 \`[4, 12]\` 内（4 段至少 4 位、至多 12 位）—— 直接无解，连搜都不用搜。`,{pos:0,segLen:null,trySeg:null,verdict:`length`}),a(`done`,o.length>0?`搜索结束，共 **${o.length} 个答案**：${o.map(e=>`"${e}"`).join(`、`)}。整棵树最多 3^4 = 81 条路径、只有 4 层 —— 回溯在这里是常数级的；可行性剪枝把 "段合法但走不通" 的分支（如第一段切 \`"2"\`）在层顶就砍掉。`:`搜索结束，**没有答案**（长度 ${r} 无法切成 4 个合法段）。`,{ans:o.slice(),done:!0}),i}var Wf=`rip-styles`,Gf=54,Kf=84,qf=46,Jf=176,Yf=46,Xf=164,Zf=234,Qf=272,$f=296,ep=24,tp=344,np=26,rp=604,ip=1150,ap=`
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
`;function op(){if(document.getElementById(Wf))return;let e=document.createElement(`style`);e.id=Wf,e.textContent=ap,document.head.appendChild(e)}function sp(e,t={}){if(!e||e.dataset.ripMounted===`1`)return{destroy(){}};e.dataset.ripMounted=`1`,op();let n=Uf(t),r=t.autoplay!==!1,i=n[0],a=i.chars,o=i.n,s=Y,c=document.createElement(`div`);c.className=`viz rip`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let d=46;o*d+(o-1)*8>rp&&(d=Math.max(22,Math.floor((rp-(o-1)*8)/o)));let f=o*d+(o-1)*8,p=Math.max(660,np*2+f),m=(p-f)/2,h=e=>m+e*(d+8)+d/2,g=e=>m+(e+1)*(d+8)-8/2,_=p-np*2,v=Math.max(1,...n.map(e=>e.ans.length)),y=$f+(v-1)*ep-(Qf-16)+8,b=s(`svg`,{class:`viz__svg rip__svg`,viewBox:`0 0 ${p} ${Math.max(368,296+y)}`,role:`img`,"aria-label":`复原 IP 地址 分段回溯推演动画`});l.appendChild(b);let x=s(`g`,{class:`rip-cells`}),S=s(`g`,{class:`rip-marks`});b.appendChild(x),b.appendChild(S);let C=s(`text`,{class:`rip-note`,x:np,y:Gf});C.textContent=`分段回溯：每段切 1-3 位，剪枝两层 —— 段合法性（前导零 / >255）+ 可行性（剩余位数）`,S.appendChild(C),S.appendChild(s(`rect`,{class:`rip-banner__box`,x:np,y:Kf,width:_,height:qf,rx:9}));let w=s(`text`,{class:`rip-banner__seg`,x:44,y:107}),T=s(`text`,{class:`rip-banner__seg`,x:201,y:107}),E=s(`text`,{class:`rip-banner__ans`,x:p-np-18,y:107});S.appendChild(w),S.appendChild(T),S.appendChild(E);let D=[];for(let e=0;e<o;e+=1){let t=s(`g`,{class:`rip-cell`}),n=s(`rect`,{class:`rip-cell__box`,x:h(e)-d/2,y:Jf,width:d,height:Yf,rx:6});t.appendChild(n);let r=s(`text`,{class:`rip-cell__val`,x:h(e),y:199});r.textContent=a[e],t.appendChild(r);let i=s(`text`,{class:`rip-cell__idx`,x:h(e),y:Jf-8});i.textContent=String(e),S.appendChild(i),x.appendChild(t),D.push({g:t,box:n,val:r})}let O=[];for(let e=0;e<o-1;e+=1){let t=s(`line`,{class:`rip-div-fixed`,x1:g(e),y1:Xf,x2:g(e),y2:Zf});t.style.opacity=`0`,S.appendChild(t),O.push(t)}let k=s(`text`,{class:`rip-ans__title`,x:np,y:Qf});k.textContent=`answers`,S.appendChild(k);let A=[];for(let e=0;e<v;e+=1){let t=s(`text`,{class:`rip-ans__row`,x:p/2,y:$f+e*ep});t.style.opacity=`0`,S.appendChild(t),A.push(t)}let j=s(`text`,{class:`rip-ans__empty`,x:p/2,y:$f});j.textContent=`（还没有答案 —— 切满 4 段且恰好用完全部数字才会收下）`,S.appendChild(j);let M=s(`text`,{class:`rip-phase__text`,x:p/2,y:tp});S.appendChild(M);let N=u();function P(e,t){if(!t)return;let n=t.phase===`done`,r=t.phase===`try`,i=t.phase===`answer`;O.forEach((e,n)=>{let a=n+1;t.path.slice(0,-0).length;let o=0,s=!1;for(let e of t.path)if(o+=e.length,o===a){s=!0;break}let c=(r||i)&&t.trySeg!==null&&t.pos===a,l=(r||i)&&t.trySeg!==null&&t.pos+t.trySeg.length===a;s?(e.setAttribute(`class`,`rip-div-fixed`),e.style.opacity=`1`):c||l?(e.setAttribute(`class`,`rip-div-try`),e.style.opacity=`1`):e.style.opacity=`0`});let a=t.pos,o=t.trySeg===null?-1:t.pos+t.trySeg.length-1;D.forEach((e,n)=>{let i=[`rip-cell`];e.box.classList.remove(`is-dashed`),r&&n>=a&&n<=o&&i.push(t.verdict===`ok`||t.verdict===`answer`?`is-try-ok`:`is-try-bad`),e.g.setAttribute(`class`,i.join(` `))});let s=t.ans;s.length===0?j.style.opacity=`1`:j.style.opacity=`0`,A.forEach((e,t)=>{t<s.length?(e.textContent=`"${s[t]}"`,e.setAttribute(`class`,`rip-ans__row`+(i&&t===s.length-1?` is-fresh`:``)),e.style.opacity=`1`):e.style.opacity=`0`});let c=t.path.length+1;if(r||i){w.textContent=`切第 ${i?4:c} 段`;let e=t.verdict,n=e===`ok`?`合法，深入`:e===`answer`?`收下答案`:e===`lead-zero`?`前导零`:e===`range`?`超出 255`:`长度不可行`;T.textContent=t.trySeg===null?`末尾只剩 ${t.n-t.pos} 位，不够切 ${t.segLen} 位`:`try "${t.trySeg}" → ${n}`}else t.phase===`init`?(w.textContent=`分段回溯`,T.textContent=`在缝隙里选 3 个切点（每段 1-3 位）`):(w.textContent=`搜索结束`,T.textContent=`${t.ans.length} 个答案`);if(E.textContent=n?`${t.ans.length} 个`:`${t.ans.length} 个答案`,r||i){let e=t.path.length>0?t.path.join(`.`):`(空)`,n=r&&t.trySeg!==null?` + 尝试 "${t.trySeg}"`:``;M.textContent=`path: ${e}${n} · pos=${t.pos} · 剩余 ${t.n-t.pos} 位`}else t.phase===`init`?M.textContent=`长度不在 [4, 12] 直接无解；每层最多 3 个分支、只有 4 层`:M.textContent=`可行性剪枝：剩余 segs 段时，剩余位数必须落在 [segs, segs × 3]`;Z(N,t.desc)}c.appendChild(N);let F=Q();c.appendChild(F.root),e.textContent=``,e.appendChild(c),X();let I=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,L=$({steps:n,controls:F,intervalMs:ip,onRender:P});L.jumpTo(Math.trunc(t.initialStep)||0);let R=null;return r&&!I&&typeof IntersectionObserver==`function`&&(R=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){R.disconnect(),R=null,L.play();return}},{threshold:.35}),R.observe(c)),{destroy(){R&&=(R.disconnect(),null),L.destroy(),e.textContent=``,delete e.dataset.ripMounted,document.getElementById(Wf)?.remove()}}}var cp=`{[()]}`,lp={"(":`)`,"[":`]`,"{":`}`},up=new Set(Object.keys(lp));function dp(e={}){let t=typeof e.s==`string`?e.s:cp,n=Array.from(t),r=n.length,i=[],a=(e,a,o={})=>{i.push({phase:e,desc:a,s:t,chars:n,n:r,i:null,ch:null,stack:[],expect:null,popped:null,verdict:null,done:e===`done`,...o})};a(`init`,`给了括号串 \`${t}\`（\`${r}\` 个字符）。判断左括号是否被**正确类型**的右括号闭合、且嵌套不乱。括号的结构决定了**最近打开的必须先关闭** —— 后开先闭就是 LIFO，所以栈不是"想到用栈"，而是"括号天然就是栈"。做法：遇左括号入栈（记下我在等什么），遇右括号就问栈顶"你是不是我等的那个"。失败有三种：类型不匹配（\`"(]"\`）、右括号没人接（\`"())"\`，栈已空）、左括号没闭合（\`"(()"\`，栈有剩）。`);let o=[];for(let e=0;e<r;e+=1){let t=n[e];if(up.has(t)){o.push(t),a(`push`,`\`s[${e}] = "${t}"\` 是左括号 —— **入栈**，记下"我在等 \`"${lp[t]}"\`"。栈顶现在是 \`${t}\`，它是**最内层尚未闭合**的那个 —— 下一个右括号必须先跟它配。`,{i:e,ch:t,stack:o.slice(),expect:null});continue}if(o.length===0)return a(`unmatched`,`\`s[${e}] = "${t}"\` 是右括号，但**栈是空的** —— 前面没有左括号在等它。（失败模式二：右括号没人接，如 \`"())"\` 的最后一个 \`)\`。）即刻判无效，不用再看后面的字符。`,{i:e,ch:t,stack:o.slice(),expect:null,verdict:`unmatched`}),a(`done`,`**无效**：\`s[${e}] = "${t}"\` 找不到匹配的左括号。三种失败模式里的第二种 —— 右括号来时栈已空。`,{i:e,ch:t,stack:o.slice(),verdict:`unmatched`,done:!0}),i;let r=o[o.length-1],s=lp[r];if(s===t)o.pop(),a(`match`,`\`s[${e}] = "${t}"\` 是右括号 —— 栈顶 \`"${r}"\` 等的就是 \`"${s}"\`，**配对成功，出栈**。`+(o.length>0?`新的栈顶是 \`"${o[o.length-1]}"\` —— 它成为"最内层尚未闭合"的那个。`:`栈空了 —— 目前为止全部闭合。`),{i:e,ch:t,stack:o.slice(),expect:s,popped:r});else return a(`mismatch`,`\`s[${e}] = "${t}"\` 是右括号，它要的是 \`"${t}"\`，但栈顶 \`"${r}"\` 等的是 \`"${s}"\` —— **类型不匹配**（失败模式一，如 \`"([)]"\` 里 \`)\` 撞上 \`[\`）。即刻判无效。`,{i:e,ch:t,stack:o.slice(),expect:s,popped:null,verdict:`mismatch`}),a(`done`,`**无效**：\`s[${e}] = "${t}"\` 与栈顶 \`"${r}"\` 类型不匹配（栈顶在等 \`"${s}"\`）。`,{i:e,ch:t,stack:o.slice(),expect:s,verdict:`mismatch`,done:!0}),i}return o.length>0?(a(`done`,`\`${r}\` 个字符扫完了，但**栈里还留着** \`${o.map(e=>`"${e}"`).join(`、`)}\` —— 失败模式三：左括号没闭合（如 \`"(()"\` 剩下的那个 \`(\`）。栈非空即无效 —— 这是最容易漏的一处检查。`,{i:r-1,stack:o.slice(),verdict:`leftover`,done:!0}),i):(a(`done`,`\`${r}\` 个字符扫完，**栈也恰好空了** —— 每个左括号都被正确类型的右括号按后进先出的顺序闭合。**有效**。`,{i:r-1,stack:o.slice(),verdict:`valid`,done:!0}),i)}var fp=`brk-styles`,pp=54,mp=84,hp=46,gp=158,_p=170,vp=46,yp=256,bp=316,xp=256,Sp=342,Cp=26,wp=604,Tp=1150,Ep=`
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
`;function Dp(){if(document.getElementById(fp))return;let e=document.createElement(`style`);e.id=fp,e.textContent=Ep,document.head.appendChild(e)}function Op(e,t={}){if(!e||e.dataset.brkMounted===`1`)return{destroy(){}};e.dataset.brkMounted=`1`,Dp();let n=dp(t),r=t.autoplay!==!1,i=n[0],a=i.chars,o=i.n,s=Y,c=document.createElement(`div`);c.className=`viz brk`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);function u(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}let d=48;o*d+(o-1)*8>wp&&(d=Math.max(24,Math.floor((wp-(o-1)*8)/o)));let f=o*d+(o-1)*8,p=(o+1)*d+o*8,m=Math.max(660,Cp*2+Math.max(f,p)),h=(m-f)/2,g=(m-p)/2+d/2,_=e=>h+e*(d+8)+d/2,v=e=>g+e*(d+8),y=m-Cp*2,b=s(`svg`,{class:`viz__svg brk__svg`,viewBox:`0 0 ${m} 366`,role:`img`,"aria-label":`有效的括号 栈推演动画`});l.appendChild(b);let x=s(`g`,{class:`brk-cells`}),S=s(`g`,{class:`brk-marks`});b.appendChild(x),b.appendChild(S);let C=s(`text`,{class:`brk-note`,x:Cp,y:pp});C.textContent=`括号天然是栈：最近打开的必须先关闭 —— 左括号入栈，右括号问栈顶`,S.appendChild(C),S.appendChild(s(`rect`,{class:`brk-banner__box`,x:Cp,y:mp,width:y,height:hp,rx:9}));let w=s(`text`,{class:`brk-banner__seg`,x:44,y:107}),T=s(`text`,{class:`brk-banner__seg`,x:156,y:107}),E=s(`text`,{class:`brk-banner__ans`,x:m-Cp-18,y:107});S.appendChild(w),S.appendChild(T),S.appendChild(E);let D=[];for(let e=0;e<o;e+=1){let t=s(`g`,{class:`brk-cell`}),n=s(`rect`,{class:`brk-cell__box`,x:_(e)-d/2,y:_p,width:d,height:vp,rx:6});t.appendChild(n);let r=s(`text`,{class:`brk-cell__val`,x:_(e),y:193});r.textContent=a[e],t.appendChild(r);let i=s(`text`,{class:`brk-cell__idx`,x:_(e),y:gp});i.textContent=String(e),S.appendChild(i),x.appendChild(t),D.push({g:t,box:n,val:r})}let O=s(`text`,{class:`brk-label`,x:g-14,y:279});O.textContent=`stack`,S.appendChild(O);let k=[];for(let e=0;e<o;e+=1){let t=s(`g`,{class:`brk-cell`}),n=s(`rect`,{class:`brk-cell__box`,x:v(e)-d/2,y:yp,width:d,height:vp,rx:6});t.appendChild(n);let r=s(`text`,{class:`brk-cell__val`,x:v(e),y:279});t.appendChild(r),x.appendChild(t),k.push({g:t,box:n,val:r})}let A=(()=>{let e=s(`g`,{class:`brk-cell`}),t=s(`rect`,{class:`brk-cell__box`,x:v(o)-d/2,y:xp,width:d,height:vp,rx:6});e.appendChild(t);let n=s(`text`,{class:`brk-cell__val`,x:v(o),y:279});return e.appendChild(n),x.appendChild(e),{g:e,box:t,val:n}})(),j=s(`text`,{class:`brk-popmark`,x:v(o),y:xp-12});j.textContent=`popped`,S.appendChild(j);let M=s(`text`,{class:`brk-topmark`,x:0,y:bp});M.textContent=`top`,S.appendChild(M);let N=s(`text`,{class:`brk-phase__text`,x:m/2,y:Sp});S.appendChild(N);let P=u();function F(e,t){if(!t)return;let n=t.phase===`done`,r=t.verdict;if(D.forEach((e,i)=>{let a=[`brk-cell`];t.i!==null&&i===t.i&&t.phase!==`done`?t.phase===`match`?a.push(`is-ok`):t.phase===`mismatch`||t.phase===`unmatched`?a.push(`is-bad`):a.push(`is-cur`):n&&r===`valid`?a.push(`is-ok`):t.i!==null&&i>t.i&&a.push(`is-dim`),e.g.setAttribute(`class`,a.join(` `))}),k.forEach((e,i)=>{let a=[`brk-cell`];i<t.stack.length?(a.push(`is-instack`),e.val.textContent=t.stack[i],i===t.stack.length-1&&(t.phase===`mismatch`||n&&r===`leftover`?a.push(`is-bad`):n&&r===`valid`&&a.push(`is-ok`))):(a.push(`is-dim`),e.val.textContent=``),e.g.setAttribute(`class`,a.join(` `))}),t.phase===`match`&&t.popped!==null){let e=v(t.stack.length);A.box.setAttribute(`x`,e-d/2),A.val.setAttribute(`x`,e),j.setAttribute(`x`,e),A.val.textContent=t.popped,A.g.setAttribute(`class`,`brk-cell is-ok`),j.style.opacity=`1`}else A.val.textContent=``,A.g.setAttribute(`class`,`brk-cell is-dim`),j.style.opacity=`0`;t.stack.length>0?(M.setAttribute(`x`,v(t.stack.length-1)),M.style.opacity=`1`):M.style.opacity=`0`,t.phase===`push`?(w.textContent=`s[${t.i}] = "${t.ch}"`,T.textContent=`左括号 → push（记下我在等什么）`):t.phase===`match`?(w.textContent=`s[${t.i}] = "${t.ch}"`,T.textContent=`栈顶 "${t.popped}" 配对成功 → pop`):t.phase===`mismatch`?(w.textContent=`s[${t.i}] = "${t.ch}"`,T.textContent=`栈顶 "${t.stack[t.stack.length-1]}" 在等 "${t.expect}" —— 不匹配`):t.phase===`unmatched`?(w.textContent=`s[${t.i}] = "${t.ch}"`,T.textContent=`栈是空的，没人接这个右括号`):t.phase===`init`?(w.textContent=`栈解法`,T.textContent=`左括号入栈 · 右括号问栈顶`):(w.textContent=`${t.n} 个字符扫完`,T.textContent=r===`valid`?`栈恰好为空`:r===`leftover`?`栈里还留着左括号`:`提前判无效`),n?(E.textContent=r===`valid`?`true（有效）`:r===`leftover`?`false（左括号未闭合）`:r===`mismatch`?`false（类型不匹配）`:`false（右括号无人接）`,E.setAttribute(`class`,`brk-banner__ans`+(r===`valid`?``:` is-bad`))):(E.textContent=`stack: ${t.stack.length} 层`,E.setAttribute(`class`,`brk-banner__ans`)),n?N.textContent=t.stack.length>0?`剩余未闭合：${t.stack.map(e=>`"${e}"`).join(` `)} —— 栈非空即无效`:`三种失败模式都没触发 + 栈为空 = 有效`:t.phase===`match`?N.textContent=`配对 "${t.popped}" + "${t.ch}" 出栈 · 栈深 ${t.stack.length}`:t.phase===`push`?N.textContent=`入栈 "${t.ch}" · 栈顶 = 最内层尚未闭合的那个`:N.textContent=`后开先闭 = LIFO —— 括号的结构本身就是栈`,Z(P,t.desc)}c.appendChild(P);let I=Q();c.appendChild(I.root),e.textContent=``,e.appendChild(c),X();let L=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,R=$({steps:n,controls:I,intervalMs:Tp,onRender:F});R.jumpTo(Math.trunc(t.initialStep)||0);let z=null;return r&&!L&&typeof IntersectionObserver==`function`&&(z=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){z.disconnect(),z=null,R.play();return}},{threshold:.35}),z.observe(c)),{destroy(){z&&=(z.disconnect(),null),R.destroy(),e.textContent=``,delete e.dataset.brkMounted,document.getElementById(fp)?.remove()}}}var kp=[1,3,-1,-3,5,3,6,7],Ap=3;function jp(e={}){let t=(Array.isArray(e.nums)?e.nums:kp).slice(),n=t.length,r=Number.isInteger(e.k)&&e.k>0?e.k:Ap,i=[],a=(e,a,o={})=>{i.push({phase:e,desc:a,nums:t,n,k:r,i:null,l:null,r:null,expired:[],dropped:[],dq:[],maxVal:null,ans:[],done:e===`done`,...o})};if(n===0||r>n)return a(`done`,n===0?`数组为空 —— 没有窗口，返回空。`:`窗口大小 \`${r}\` 大于数组长度 \`${n}\` —— 无有效窗口，返回空。`,{done:!0}),i;a(`init`,`给了数组 \`[${t.join(`, `)}]\`（\`${n}\` 个）和窗口大小 \`k = ${r}\`，窗口从左往右滑，要每个窗口的最大值，要求**线性时间**。暴力每窗扫一遍是 \`O(n·k)\`；线性做法的关键是**队列里只留"还有机会当最大值"的候选**，且按值递减 —— 队首恒为当前窗口最大。判据：一个元素右边出现**不小于它**的新元素时，它就被**支配**了（新元素更大、还更晚离开窗口），可以**永久淘汰**。于是每来一个元素只维护两件事：**队尾淘汰（单调性，看值）**与**队首淘汰（出窗，看下标）** —— 队列存的是**下标**，下标才能判断还在不在窗里。`);let o=[],s=[];for(let e=0;e<n;e+=1){let n=Math.max(0,e-r+1),i=t[e],c=[];for(;o.length>0&&o[0]<n;)c.push(o.shift());let l=[];for(;o.length>0&&t[o[o.length-1]]<=i;)l.push(o.pop());o.push(e);let u=[];u.push(`**\`i = ${e}\`，值 \`${i}\`，窗口 \`[${n}, ${e}]\`**：`),c.length>0&&u.push(`队首 \`${c.map(e=>`${e}(${t[e]})`).join(`、`)}\` 已滑出窗口左端 \`${n}\` —— **出队（动作一：看下标）**。`),l.length>0&&u.push(`队尾 \`${l.map(e=>`${e}(${t[e]})`).join(`、`)}\` 都 \`<= ${i}\` —— **被 ${i} 支配，永久淘汰（动作二：看值）**：只要 \`${i}\` 还在窗里，它们永远轮不到当最大。`),c.length===0&&l.length===0&&u.push(`没有元素需要淘汰 —— 队列仍然严格递减、且都在窗内。`),u.push(`入队 \`${e}(${i})\`，队列（值）现在是 \`[${o.map(e=>t[e]).join(`, `)}]\`，队首 \`${o[0]}(${t[o[0]]})\` 就是当前最大的候选。`),a(`slide`,u.join(``),{i:e,l:n,r:e,expired:c,dropped:l,dq:o.slice(),maxVal:t[o[0]],ans:s.slice()}),e>=r-1&&(s.push(t[o[0]]),a(`record`,`窗口 \`[${n}, ${e}]\` 已经装满 \`${r}\` 个 —— **队首 \`${o[0]}(${t[o[0]]})\` 就是这一窗的最大值**，记入答案。（队列严格递减且在窗内，所以队首必然是最大 —— 不需要再扫一遍窗口。）目前答案 \`[${s.join(`, `)}]\`。`,{i:e,l:n,r:e,dq:o.slice(),maxVal:t[o[0]],ans:s.slice()}))}return a(`done`,`\`${n}\` 个元素扫完，答案 \`[${s.join(`, `)}]\`（共 \`${s.length}\` 个窗口）。回头看：每个元素**最多入队一次、出队一次** —— 均摊 \`O(1)\`，总时间 \`O(n)\`，空间 \`O(k)\`（队列最多存 k 个下标）。两个易错点：① 队列存**下标**而不是值（存值判不了"还在不在窗里"）；② 队首出窗要在**读答案之前**处理，否则会拿到早就滑出去的元素。`,{i:n-1,l:n-r,r:n-1,dq:o.slice(),ans:s.slice(),done:!0}),i}var Mp=`slmax-styles`,Np=54,Pp=84,Fp=46,Ip=156,Lp=168,Rp=46,zp=220,Bp=250,Vp=240,Hp=44,Up=294,Wp=322,Gp=40,Kp=386,qp=26,Jp=604,Yp=1150,Xp=`
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
`;function Zp(){if(document.getElementById(Mp))return;let e=document.createElement(`style`);e.id=Mp,e.textContent=Xp,document.head.appendChild(e)}function Qp(e,t={}){if(!e||e.dataset.slmaxMounted===`1`)return{destroy(){}};e.dataset.slmaxMounted=`1`,Zp();let n=jp(t),r=t.autoplay!==!1,i=n[0],a=i.nums,o=i.n,s=i.k,c=Y,l=document.createElement(`div`);l.className=`viz slmax`;let u=document.createElement(`div`);u.className=`viz__stage`,l.appendChild(u);function d(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}if(o===0||s>o){let t=c(`svg`,{class:`viz__svg slmax__svg`,viewBox:`0 0 620 120`,role:`img`}),n=c(`text`,{x:310,y:60,style:`fill: var(--slmax-muted, #657168); font-size: 14px; text-anchor: middle;`});return n.textContent=o===0?`数组为空 —— 没有窗口`:`窗口大小 ${s} 大于数组长度 ${o} —— 无有效窗口`,t.appendChild(n),u.appendChild(t),l.appendChild(d()),l.appendChild(Q().root),e.textContent=``,e.appendChild(l),X(),{destroy(){e.textContent=``,delete e.dataset.slmaxMounted,document.getElementById(Mp)?.remove()}}}let f=Math.max(1,n[n.length-1].ans.length),p=48;Math.max(o,f,s)*p+(Math.max(o,f,s)-1)*8>Jp&&(p=Math.max(24,Math.floor((Jp-(Math.max(o,f,s)-1)*8)/Math.max(o,f,s))));let m=o*p+(o-1)*8,h=f*p+(f-1)*8,g=s*p+(s-1)*8,_=Math.max(660,qp*2+Math.max(m,h,g)),v=(_-m)/2,y=(_-h)/2,b=(_-g)/2,x=e=>v+e*(p+8)+p/2,S=e=>y+e*(p+8)+p/2,C=e=>b+e*(p+8)+p/2,w=_-qp*2,T=c(`svg`,{class:`viz__svg slmax__svg`,viewBox:`0 0 ${_} 410`,role:`img`,"aria-label":`滑动窗口最大值 单调队列推演动画`});u.appendChild(T);let E=c(`g`,{class:`slmax-bands`}),D=c(`g`,{class:`slmax-cells`}),O=c(`g`,{class:`slmax-marks`});T.appendChild(E),T.appendChild(D),T.appendChild(O);let k=c(`text`,{class:`slmax-note`,x:qp,y:Np});k.textContent=`单调队列：只留「还有机会当最大值」的候选，按值递减 —— 队首恒为最大`,O.appendChild(k),O.appendChild(c(`rect`,{class:`slmax-banner__box`,x:qp,y:Pp,width:w,height:Fp,rx:9}));let A=c(`text`,{class:`slmax-banner__seg`,x:44,y:107}),j=c(`text`,{class:`slmax-banner__seg`,x:176,y:107}),M=c(`text`,{class:`slmax-banner__ans`,x:_-qp-18,y:107});O.appendChild(A),O.appendChild(j),O.appendChild(M);let N=[];for(let e=0;e<o;e+=1){let t=c(`g`,{class:`slmax-cell`}),n=c(`rect`,{class:`slmax-cell__box`,x:x(e)-p/2,y:Lp,width:p,height:Rp,rx:6});t.appendChild(n);let r=c(`text`,{class:`slmax-cell__val`,x:x(e),y:191});r.textContent=String(a[e]),t.appendChild(r);let i=c(`text`,{class:`slmax-cell__idx`,x:x(e),y:Ip});i.textContent=String(e),O.appendChild(i),D.appendChild(t),N.push({g:t,box:n,val:r})}let P=c(`rect`,{class:`slmax-band`,x:0,y:zp,width:0,height:7,rx:3.5});E.appendChild(P);let F=c(`text`,{class:`slmax-band__tag`,x:0,y:238}),I=c(`text`,{class:`slmax-band__tag`,x:0,y:238});O.appendChild(F),O.appendChild(I);let L=c(`text`,{class:`slmax-label`,x:b-14,y:Bp});L.textContent=`deque`,O.appendChild(L);let R=[];for(let e=0;e<s;e+=1){let t=c(`g`,{class:`slmax-cell`}),n=c(`rect`,{class:`slmax-cell__box`,x:C(e)-p/2,y:Vp,width:p,height:Hp,rx:6});t.appendChild(n);let r=c(`text`,{class:`slmax-cell__val`,x:C(e),y:257});t.appendChild(r);let i=c(`text`,{class:`slmax-cell__sub`,x:C(e),y:276});t.appendChild(i),D.appendChild(t),R.push({g:t,box:n,val:r,sub:i})}let z=c(`text`,{class:`slmax-front`,x:0,y:Up});z.textContent=`front (max)`,O.appendChild(z);let B=c(`text`,{class:`slmax-label`,x:y-14,y:342});B.textContent=`ans`,O.appendChild(B);let V=[];for(let e=0;e<f;e+=1){let t=c(`g`,{class:`slmax-cell`}),n=c(`rect`,{class:`slmax-cell__box`,x:S(e)-p/2,y:Wp,width:p,height:Gp,rx:6});t.appendChild(n);let r=c(`text`,{class:`slmax-cell__val`,x:S(e),y:342});t.appendChild(r),D.appendChild(t),V.push({g:t,box:n,val:r})}let H=c(`text`,{class:`slmax-phase__text`,x:_/2,y:Kp});O.appendChild(H);let U=d();function ee(e,t){if(!t)return;let n=t.phase===`slide`,r=t.phase===`record`,i=t.phase===`done`,s=t.l??0,c=t.r??(i?o-1:0),l=new Set(t.dropped||[]),u=new Set(t.expired||[]);if(N.forEach((e,a)=>{let o=[`slmax-cell`];a>=s&&a<=c?o.push(`is-window`):s>0&&a<s&&o.push(`is-left`),(n||r)&&(l.has(a)?o.push(`is-dropped`):u.has(a)&&o.push(`is-left`),a===t.i&&!i&&o.push(`is-cur`)),e.g.setAttribute(`class`,o.join(` `))}),c>=s&&c<o){let e=v+s*(p+8),t=v+c*(p+8)+p;P.setAttribute(`x`,e),P.setAttribute(`width`,Math.max(4,t-e)),P.style.opacity=`1`,F.setAttribute(`x`,e+4),F.textContent=`L=${s}`,I.setAttribute(`x`,t-4),I.textContent=`R=${c}`,F.style.opacity=`1`,I.style.opacity=`1`}else P.style.opacity=`0`,F.style.opacity=`0`,I.style.opacity=`0`;let d=t.dq||[];R.forEach((e,t)=>{let n=[`slmax-cell`];if(t<d.length){let r=d[t];e.val.textContent=String(a[r]),e.sub.textContent=`#${r}`,n.push(`is-queue`),t===0&&n.push(`is-front`)}else e.val.textContent=``,e.sub.textContent=``,n.push(`is-ghost`);e.g.setAttribute(`class`,n.join(` `))}),d.length>0?(z.setAttribute(`x`,C(0)),z.style.opacity=`1`):z.style.opacity=`0`;let f=t.ans||[];if(V.forEach((e,t)=>{let n=[`slmax-cell`];t<f.length?(e.val.textContent=String(f[t]),n.push(r&&t===f.length-1?`is-fresh`:`is-ans`)):(e.val.textContent=``,n.push(`is-ghost`)),e.g.setAttribute(`class`,n.join(` `))}),n||r){A.textContent=`i=${t.i} · 窗口 [${s}, ${c}]`;let e=[];n?(u.size>0&&e.push(`出窗 ${[...t.expired].map(e=>a[e]).join(`,`)}`),l.size>0&&e.push(`被支配 ${[...t.dropped].map(e=>a[e]).join(`,`)}`),e.push(`push ${a[t.i]}`)):e.push(`记录最大值 ${t.maxVal}`),j.textContent=e.join(` · `)}else t.phase===`init`?(A.textContent=`单调队列`,j.textContent=`队列只留还有机会的候选`):(A.textContent=`${o} 个元素扫完`,j.textContent=`${t.ans.length} 个窗口`);if(M.textContent=i?`[${t.ans.join(`,`)}]`:`max=${t.maxVal??`-`}`,n){let e=[];u.size>0&&e.push(`动作一：队首出窗（看下标）`),l.size>0&&e.push(`动作二：队尾被支配（看值）`),H.textContent=e.length>0?`${e.join(` + `)} —— 两个动作一个看下标一个看值，互不干扰`:`队列仍严格递减且都在窗内 —— 无需淘汰`}else r?H.textContent=`队首 ${t.maxVal} 就是这一窗的最大值（队列递减且在窗内，无需再扫）`:t.phase===`init`?H.textContent=`队列存下标 —— 下标才能判断"还在不在窗里"`:H.textContent=`每元素最多入队一次、出队一次 —— 均摊 O(1)，总 O(n) 时间 O(k) 空间`;Z(U,t.desc)}l.appendChild(U);let te=Q();l.appendChild(te.root),e.textContent=``,e.appendChild(l),X();let W=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,G=$({steps:n,controls:te,intervalMs:Yp,onRender:ee});G.jumpTo(Math.trunc(t.initialStep)||0);let K=null;return r&&!W&&typeof IntersectionObserver==`function`&&(K=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){K.disconnect(),K=null,G.play();return}},{threshold:.35}),K.observe(l)),{destroy(){K&&=(K.disconnect(),null),G.destroy(),e.textContent=``,delete e.dataset.slmaxMounted,document.getElementById(Mp)?.remove()}}}var $p=[10,9,2,5,3,7,101,18];function em(e={}){let t=(Array.isArray(e.nums)?e.nums:$p).slice(),n=t.length,r=[],i=(e,i,a={})=>{r.push({phase:e,desc:i,nums:t,n,i:null,j:null,ok:!1,better:!1,dp:[],parent:[],cands:[],best:null,bestJ:null,settled:0,answer:0,bestEnd:null,done:e===`done`,...a})};if(n===0)return i(`done`,"数组为空 —— 没有任何子序列，答案是 `0`。",{done:!0}),r;i(`init`,`给了数组 \`[${t.join(`, `)}]\`，要**最长严格递增子序列**的长度。注意「子序列」不是「子数组」：元素可以跳着挑，只要保持原来的先后顺序 —— 这一点正是难度的全部来源。破局的办法是给状态**加一个锚**：\`dp[i]\` 表示**以 \`nums[i]\` 结尾**的最长递增子序列长度。锚一加上，问题就从「整段怎么挑」退化成「我接在谁后面」：\`dp[i] = 1 + max(dp[j])\`，其中 \`j < i\` 且 \`nums[j] < nums[i]\`；接不上就单独成串，取 \`1\`。最后答案是**整个 \`dp\` 数组的最大值**，不是 \`dp[n - 1]\`。`);let a=Array(n).fill(1),o=Array(n).fill(-1),s=0,c=null;for(let e=0;e<n;e+=1){let n=t[e],r=1,l=-1,u=[];a[e]=1,o[e]=-1;for(let d=0;d<e;d+=1){let f=t[d],p=f<n;p&&u.push(d);let m=p&&a[d]+1>r,h=[`回看 \`j = ${d}\`（值 \`${f}\`）：`];if(!p)h.push(`\`${f} >= ${n}\` —— **接不上**：递增序列里下一个数必须严格更大。`);else if(m){let t=r;r=a[d]+1,l=d,h.push(`\`${f} < ${n}\` 能接，而且 \`dp[${d}] + 1 = ${a[d]} + 1 = ${r}\`，**比当前最好成绩 \`${t}\` 更长** —— 刷新：\`dp[${e}] = ${r}\`，最优前驱 \`parent[${e}] = ${d}\`。`)}else h.push(`\`${f} < ${n}\` 能接，但 \`dp[${d}] + 1 = ${a[d]+1} <= ${r}\`，**不如下面那条链长**，不刷新。`);m&&(a[e]=r,o[e]=l),h.push(`本轮能接的前驱有 \`${u.length}\` 个 \`[${u.join(`, `)}]\`，此刻 \`dp[${e}] = ${r}\`。`),i(`scan`,h.join(``),{i:e,j:d,ok:p,better:m,dp:a.slice(),parent:o.slice(),cands:u.slice(),best:r,bestJ:l,settled:e,answer:s,bestEnd:c})}a[e]=r,o[e]=l;let d=s;r>s&&(s=r,c=e),i(`settle`,`\`i = ${e}\`（值 \`${n}\`）这一轮扫完、定型：`+(l>=0?`最优前驱是 \`j = ${l}\`（值 \`${t[l]}\`，\`dp = ${a[l]}\`），所以 \`dp[${e}] = ${r}\` —— 就是把 \`${n}\` 接在 \`j = ${l}\` 那条链的尾巴上。`:`前面没有任何比 \`${n}\` 小的元素，接不上任何人，只能自己单独成串：\`dp[${e}] = 1\`。`)+(r>d?`**全局最长刷新到 \`${s}\`**（链的末端是 \`i = ${c}\`）。`:`全局最长仍然是 \`${s}\`，没有被刷新。`),{i:e,dp:a.slice(),parent:o.slice(),cands:u.slice(),best:r,bestJ:l,settled:e+1,answer:s,bestEnd:c})}return i(`done`,`\`${n}\` 个位置全部定型：\`dp = [${a.join(`, `)}]\`。答案是**整个 \`dp\` 的最大值** \`${s}\`，出现在 \`i = ${c}\`（值 \`${t[c]}\`）—— **不是 \`dp[${n-1}] = ${a[n-1]}\`**，这是本题第一大坑，而官方样例恰好让两者相等。金框那条就是一条最长递增子序列，长度 \`${s}\`。复杂度：每个 \`i\` 都要往回看一遍，时间 \`O(n^2)\`；\`dp\` 和 \`parent\` 各 \`O(n)\` 空间。想压到 \`O(n log n)\`，得换一套记账方式 —— 看下一个动画。`,{i:n-1,dp:a.slice(),parent:o.slice(),settled:n,answer:s,bestEnd:c,done:!0}),r}var tm=`lisdp-styles`,nm=26,rm=44,im=44,am=112,om=124,sm=52,cm=200,lm=212,um=34,dm=260,fm=32,pm=316,mm=30,hm=604,gm=950,_m=`
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
`;function vm(){if(document.getElementById(tm))return;let e=document.createElement(`style`);e.id=tm,e.textContent=_m,document.head.appendChild(e)}function ym(e,t){let n=new Set;if(t==null||t<0)return n;let r=t,i=0;for(;r>=0&&i<128;)n.add(r),r=e.parent&&e.parent[r]!==void 0?e.parent[r]:-1,i+=1;return n}function bm(e,t={}){if(!e||e.dataset.lisdpMounted===`1`)return{destroy(){}};e.dataset.lisdpMounted=`1`,vm();let n=em(t),r=t.autoplay!==!1,i=n[0],a=i.nums,o=i.n,s=Y,c=document.createElement(`div`);c.className=`viz lisdp`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);let u=()=>{let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e};if(o===0){let t=s(`svg`,{class:`viz__svg lisdp__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{x:310,y:60,style:`fill: var(--lisdp-muted, #657168); font-size: 14px; text-anchor: middle;`});return n.textContent=`数组为空 —— 没有子序列，答案是 0`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),X(),{destroy(){e.textContent=``,delete e.dataset.lisdpMounted,document.getElementById(tm)?.remove()}}}let d=56;o*d+(o-1)*8>hm&&(d=Math.max(24,Math.floor((hm-(o-1)*8)/o)));let f=o*d+(o-1)*8,p=Math.max(660,mm*2+f),m=(p-f)/2,h=e=>m+e*(d+8)+d/2,g=p-mm*2,_=s(`svg`,{class:`viz__svg lisdp__svg`,viewBox:`0 0 ${p} 338`,role:`img`,"aria-label":`最长递增子序列 动态规划推演动画`});l.appendChild(_);let v=s(`g`,{class:`lisdp-marks`}),y=s(`g`,{class:`lisdp-cells`}),b=s(`g`,{class:`lisdp-labels`});_.appendChild(v),_.appendChild(y),_.appendChild(b);let x=s(`text`,{class:`lisdp-note`,x:mm,y:nm});x.textContent=`dp[i] = 以 nums[i] 结尾的最长递增子序列长度 —— 答案是整个 dp 的最大值`,v.appendChild(x),v.appendChild(s(`rect`,{class:`lisdp-banner__box`,x:mm,y:rm,width:g,height:im,rx:9}));let S=s(`text`,{class:`lisdp-banner__seg`,x:48,y:66}),C=s(`text`,{class:`lisdp-banner__seg`,x:240,y:66}),w=s(`text`,{class:`lisdp-banner__val`,x:p-mm-18,y:66});v.appendChild(S),v.appendChild(C),v.appendChild(w);let T=s(`text`,{class:`lisdp-label`,x:m-14,y:150});T.textContent=`nums`,v.appendChild(T);let E=s(`text`,{class:`lisdp-label`,x:m-14,y:229});E.textContent=`dp`,v.appendChild(E);let D=[];for(let e=0;e<o;e+=1){let t=s(`g`,{class:`lisdp-cell`});t.appendChild(s(`rect`,{class:`lisdp-cell__box`,x:h(e)-d/2,y:om,width:d,height:sm,rx:6}));let n=s(`text`,{class:`lisdp-cell__val`,x:h(e),y:143});n.textContent=String(a[e]),t.appendChild(n);let r=s(`text`,{class:`lisdp-cell__sub`,x:h(e),y:165});r.textContent=`#${e}`,t.appendChild(r),y.appendChild(t),D.push({g:t})}let O=[];for(let e=0;e<o;e+=1){let t=s(`g`,{class:`lisdp-cell`});t.appendChild(s(`rect`,{class:`lisdp-cell__box`,x:h(e)-d/2,y:lm,width:d,height:um,rx:6}));let n=s(`text`,{class:`lisdp-cell__val`,x:h(e),y:229});t.appendChild(n),y.appendChild(t),O.push({g:t,val:n})}let k=[];for(let e=0;e<o;e+=1){let t=s(`rect`,{class:`lisdp-ring`,x:h(e)-d/2-5,y:om-5,width:d+10,height:62,rx:9});v.appendChild(t),k.push(t)}let A=(e,t)=>{let n=s(`g`,{class:`lisdp-badge`}),r=s(`rect`,{class:`lisdp-badge__box`,x:h(0)-10,y:t-9,width:20,height:18,rx:5}),i=s(`text`,{class:`lisdp-badge__text`,x:h(0),y:t});return i.textContent=e,n.appendChild(r),n.appendChild(i),v.appendChild(n),{g:n,box:r,text:i}},j=A(`i`,am),M=A(`j`,cm),N=s(`rect`,{class:`lisdp-ans__box`,x:m,y:dm,width:f,height:fm,rx:8});v.appendChild(N);let P=s(`text`,{class:`lisdp-ans__text`,x:m+f/2,y:276});v.appendChild(P);let F=s(`text`,{class:`lisdp-phase__text`,x:p/2,y:pm});v.appendChild(F);let I=u();function L(e,t){if(!t)return;let r=t.phase,i=r===`scan`,s=r===`settle`,c=r===`done`,l=t.i,u=t.j,d=t.cands||[],f=new Set(d),p=ym(t,c?t.bestEnd:l),m=t.answer;D.forEach((e,n)=>{let r=[`lisdp-cell`];p.has(n)&&r.push(`is-chain`),f.has(n)&&r.push(`is-cand`),l!==null&&!c&&n===l?r.push(`is-cur`):i&&n===u&&r.push(t.ok?`is-scan`:`is-dead`),!c&&t.bestJ!==null&&t.bestJ>=0&&n===t.bestJ&&n!==l&&r.push(`is-better`),e.g.setAttribute(`class`,r.join(` `))});let g=t.settled||0;O.forEach((e,n)=>{let r=[`lisdp-cell`];l!==null&&n===l&&g===l?(r.push(`is-growing`),e.val.textContent=String(t.best??``)):n<g?(e.val.textContent=String(t.dp[n]),s&&n===l?r.push(`is-fresh`):p.has(n)&&r.push(`is-chain`)):(e.val.textContent=``,r.push(`is-ghost`)),e.g.setAttribute(`class`,r.join(` `))});let _=!c&&t.bestJ!==null&&t.bestJ>=0&&l!==null&&t.bestJ<l;k.forEach((e,n)=>{e.classList.toggle(`is-on`,_&&n===t.bestJ)});let v=(e,t,n)=>{e.box.classList.toggle(`is-on`,n),e.text.classList.toggle(`is-on`,n),n&&(e.box.setAttribute(`x`,h(t)-10),e.text.setAttribute(`x`,h(t)))};v(j,l??0,l!==null&&!c),v(M,u??0,i&&u!==null),P.textContent=`目前最长递增子序列长度 = ${m}`;let y=m>(e>0?n[e-1].answer:0);if(N.classList.toggle(`is-hot`,y||c),P.classList.toggle(`is-hot`,y||c),i||s){if(S.textContent=`i = ${l} · 值 ${a[l]}`,i){let e=[`看 j = ${u}`];t.ok?t.better?e.push(`接上 dp[${u}] → ${t.best}`):e.push(`接上不如当前`):e.push(`${a[u]} 接不上`),C.textContent=e.join(` · `)}else C.textContent=t.bestJ>=0?`定型 dp[${l}] = ${t.best}（前驱 j = ${t.bestJ}）`:`定型 dp[${l}] = 1（单独成串）`;w.textContent=s?`dp[${l}] = ${t.dp[l]}`:`dp[${l}] = ${t.best}`}else c?(S.textContent=`${o} 个位置全部定型`,C.textContent=`答案是 max(dp)，不是 dp[n-1]`,w.textContent=`答案 = ${m}`):(S.textContent=`第一次接触？`,C.textContent=`dp[i] = 以 nums[i] 结尾的最长递增`,w.textContent=`答案是 max(dp)`);i?t.ok?t.better?F.textContent=`dp[${u}] + 1 = ${t.best} 更长 —— dp[${l}] 刷新，最优前驱记成 j = ${u}`:F.textContent=`dp[${u}] + 1 = ${t.dp[u]+1} 不比当前好 —— 保持不动，继续往回看`:F.textContent=`nums[${u}] >= nums[${l}] —— 递增要求严格更大，这个 j 接不上`:s?F.textContent=t.bestJ>=0?`dp[${l}] 定型为 ${t.best}：把 ${a[l]} 接在 j = ${t.bestJ} 那条链尾巴上`:`dp[${l}] 定型为 1：前面没有更小的元素，只能自己单独成串`:c?F.textContent=`时间 O(n^2)、空间 O(n) —— 想更快，要把「以 i 结尾」换成「按长度记账」`:F.textContent=`dp[i] 的「以 i 结尾」是锚 —— 有了它，才能只知道「我接在谁后面」`,Z(I,t.desc)}c.appendChild(I);let R=Q();c.appendChild(R.root),e.textContent=``,e.appendChild(c),X();let z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,B=$({steps:n,controls:R,intervalMs:gm,onRender:L});B.jumpTo(Math.trunc(t.initialStep)||0);let V=null;return r&&!z&&typeof IntersectionObserver==`function`&&(V=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){V.disconnect(),V=null,B.play();return}},{threshold:.35}),V.observe(c)),{destroy(){V&&=(V.disconnect(),null),B.destroy(),e.textContent=``,delete e.dataset.lisdpMounted,document.getElementById(tm)?.remove()}}}var xm=[10,9,2,5,3,7,101,18];function Sm(e={}){let t=(Array.isArray(e.nums)?e.nums:xm).slice(),n=t.length,r=[],i=(e,i,a={})=>{r.push({phase:e,desc:i,nums:t,n,i:null,x:null,tails:[],lo:null,hi:null,mid:null,goRight:null,pos:null,kind:null,prevVal:null,answer:0,done:e===`done`,...a})};if(n===0)return i(`done`,"数组为空 —— 没有任何子序列，答案是 `0`。",{done:!0}),r;i(`init`,`同一个数组 \`[${t.join(`, `)}]\`，这次要在 \`O(n log n)\` 里做完。上一版按「以 \`i\` 结尾」记账，结尾有 \`n\` 种可能，没法二分；这一版换一个锚 —— **按下标（也就是长度）记账**：\`tails[len]\` 表示**所有长度为 \`len + 1\` 的递增子序列里，末尾元素的最小值**。这个定义自带一个漂亮性质：**\`tails\` 本身严格递增**。于是每来一个 \`x\`，只要在 \`tails\` 里找**第一个 \`>= x\` 的位置**：找到了就把它换成 \`x\`（同长度下末尾更小，对后面更有利），没找到就**追加**、长度加一。**答案就是 \`tails\` 的长度。**`);let a=[];for(let e=0;e<n;e+=1){let n=t[e],r=0,o=a.length;for(;r<o;){let t=r+o>>1,s=a[t]<n;i(`bisect`,`\`i = ${e}\`（值 \`${n}\`）在 \`tails = [${a.join(`, `)}]\` 里二分，找**第一个 \`>= ${n}\` 的位置**。当前区间 \`[${r}, ${o})\`，探针 \`mid = ${t}\`：\`tails[${t}] = ${a[t]}\` —— `+(s?`\`${a[t]} < ${n}\`，这个位置**不是**答案，往右收：\`lo = ${t+1}\`。`:`\`${a[t]} >= ${n}\`，这个位置**可能就是**答案，且左边也可能有，往左收：\`hi = ${t}\`。`),{i:e,x:n,tails:a.slice(),lo:r,hi:o,mid:t,goRight:s,answer:a.length}),s?r=t+1:o=t}let s=r,c=s<a.length?`replace`:`append`,l=null;c===`replace`?(l=a[s],a[s]=n):a.push(n),i(`place`,c===`replace`?`二分收敛：区间收缩到空，\`pos = ${s}\`。\`tails[${s}] = ${l}\` 是**第一个 \`>= ${n}\` 的位置**，把它换成 \`${n}\` —— 长度 \`${s+1}\` 这一档的末尾值从 \`${l}\` 降到 \`${n}\`，**同长度下末尾更小，对后面接数更有利**。长度不变：答案仍是 \`${a.length}\`。注意：\`tails\` 里的 **\`${l}\` 被覆盖掉了**，它并不代表「原序列里 \`${l}\` 被删了」—— tails 只是登记表。`:`二分收敛：区间收缩到空，\`pos = ${s}\`，正好是 \`tails\` 的末尾之外 —— 说明 \`${n}\` 比当前所有末尾都大，可以**追加**。长度 \`${s}\` 变 \`${s+1}\`，**答案涨到 \`${a.length}\`**。`,{i:e,x:n,tails:a.slice(),lo:s,hi:s,mid:null,pos:s,kind:c,prevVal:l,answer:a.length})}return i(`done`,`\`${n}\` 个元素处理完，\`tails = [${a.join(`, `)}]\`，**答案 = 长度 = ${a.length}**。三点必须记住：① \`tails\` **不是**那条最长递增子序列 —— 它只是「每个长度下的最小末尾」登记表，位置会被后来的更小值覆盖（你可以回放看看金框那几步），但**长度一定是正确答案**；② 每个元素只做一次二分，时间 \`O(n log n)\`，\`tails\` 最多 \`O(n)\` 空间；③ 求「最长不减」子序列时二分换成 \`bisect_right\`（找第一个 \`> x\` 的位置），否则相等元素会被误替换。`,{i:n-1,tails:a.slice(),answer:a.length,done:!0}),r}var Cm=`lisbin-styles`,wm=26,Tm=42,Em=44,Dm=108,Om=122,km=48,Am=190,jm=204,Mm=48,Nm=268,Pm=289,Fm=306,Im=324,Lm=32,Rm=380,zm=30,Bm=604,Vm=1e3,Hm=`
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
`;function Um(){if(document.getElementById(Cm))return;let e=document.createElement(`style`);e.id=Cm,e.textContent=Hm,document.head.appendChild(e)}function Wm(e,t={}){if(!e||e.dataset.lisbinMounted===`1`)return{destroy(){}};e.dataset.lisbinMounted=`1`,Um();let n=Sm(t),r=t.autoplay!==!1,i=n[0],a=i.nums,o=i.n,s=Y,c=document.createElement(`div`);c.className=`viz lisbin`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);let u=()=>{let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e};if(o===0){let t=s(`svg`,{class:`viz__svg lisbin__svg`,viewBox:`0 0 620 120`,role:`img`}),n=s(`text`,{x:310,y:60,style:`fill: var(--lisbin-muted, #657168); font-size: 14px; text-anchor: middle;`});return n.textContent=`数组为空 —— 没有子序列，答案是 0`,t.appendChild(n),l.appendChild(t),c.appendChild(u()),c.appendChild(Q().root),e.textContent=``,e.appendChild(c),X(),{destroy(){e.textContent=``,delete e.dataset.lisbinMounted,document.getElementById(Cm)?.remove()}}}let d=56;o*d+(o-1)*8>Bm&&(d=Math.max(24,Math.floor((Bm-(o-1)*8)/o)));let f=o*d+(o-1)*8,p=Math.max(660,zm*2+f),m=(p-f)/2,h=e=>m+e*(d+8)+d/2,g=p-zm*2,_=s(`svg`,{class:`viz__svg lisbin__svg`,viewBox:`0 0 ${p} 402`,role:`img`,"aria-label":`最长递增子序列 二分 + tails 推演动画`});l.appendChild(_);let v=s(`g`,{class:`lisbin-marks`}),y=s(`g`,{class:`lisbin-cells`}),b=s(`g`,{class:`lisbin-labels`});_.appendChild(v),_.appendChild(y),_.appendChild(b);let x=s(`text`,{class:`lisbin-note`,x:zm,y:wm});x.textContent=`tails[len] = 长度为 len+1 的递增子序列里最小的末尾值 —— 答案就是 tails 的长度`,v.appendChild(x),v.appendChild(s(`rect`,{class:`lisbin-banner__box`,x:zm,y:Tm,width:g,height:Em,rx:9}));let S=s(`text`,{class:`lisbin-banner__seg`,x:48,y:64}),C=s(`text`,{class:`lisbin-banner__seg`,x:230,y:64}),w=s(`text`,{class:`lisbin-banner__val`,x:p-zm-18,y:64});v.appendChild(S),v.appendChild(C),v.appendChild(w);let T=s(`text`,{class:`lisbin-label`,x:m-14,y:146});T.textContent=`nums`,v.appendChild(T);let E=s(`text`,{class:`lisbin-label`,x:m-14,y:223});E.textContent=`tails`,v.appendChild(E);let D=[];for(let e=0;e<o;e+=1){let t=s(`g`,{class:`lisbin-cell`});t.appendChild(s(`rect`,{class:`lisbin-cell__box`,x:h(e)-d/2,y:Om,width:d,height:km,rx:6}));let n=s(`text`,{class:`lisbin-cell__val`,x:h(e),y:140});n.textContent=String(a[e]),t.appendChild(n);let r=s(`text`,{class:`lisbin-cell__sub`,x:h(e),y:160});r.textContent=`#${e}`,t.appendChild(r),y.appendChild(t),D.push({g:t})}let O=[];for(let e=0;e<o;e+=1){let t=s(`g`,{class:`lisbin-cell`});t.appendChild(s(`rect`,{class:`lisbin-cell__box`,x:h(e)-d/2,y:jm,width:d,height:Mm,rx:6}));let n=s(`text`,{class:`lisbin-cell__val`,x:h(e),y:222});t.appendChild(n);let r=s(`text`,{class:`lisbin-cell__sub`,x:h(e),y:242});t.appendChild(r),y.appendChild(t),O.push({g:t,val:n,sub:r})}let k=[];for(let e=0;e<o;e+=1){let t=s(`text`,{class:`lisbin-cell__old`,x:h(e),y:Am}),n=s(`line`,{class:`lisbin-oldline`,x1:h(e)-26,y1:Am,x2:h(e)+26,y2:Am});b.appendChild(t),b.appendChild(n),k.push({t,line:n})}let A=s(`line`,{class:`lisbin-range-line`,x1:m,y1:Pm,x2:m,y2:Pm}),j=s(`line`,{class:`lisbin-range-line`,x1:m,y1:Pm-6,x2:m,y2:295}),M=s(`line`,{class:`lisbin-range-line`,x1:m,y1:Pm-6,x2:m,y2:295});v.appendChild(A),v.appendChild(j),v.appendChild(M);let N=s(`g`,{class:`lisbin-badge`}),P=s(`rect`,{class:`lisbin-badge__box`,x:h(0)-18,y:Nm-9,width:36,height:18,rx:5}),F=s(`text`,{class:`lisbin-badge__text`,x:h(0),y:Nm});N.appendChild(P),N.appendChild(F),v.appendChild(N);let I=s(`g`,{class:`lisbin-badge`}),L=s(`rect`,{class:`lisbin-badge__box`,x:h(0)-10,y:Dm-9,width:20,height:18,rx:5}),R=s(`text`,{class:`lisbin-badge__text`,x:h(0),y:Dm});R.textContent=`i`,I.appendChild(L),I.appendChild(R),v.appendChild(I);let z=s(`text`,{class:`lisbin-info`,x:m,y:Fm});v.appendChild(z);let B=s(`rect`,{class:`lisbin-ans__box`,x:m,y:Im,width:f,height:Lm,rx:8});v.appendChild(B);let V=s(`text`,{class:`lisbin-ans__text`,x:m+f/2,y:340});v.appendChild(V);let H=s(`text`,{class:`lisbin-phase__text`,x:p/2,y:Rm});v.appendChild(H);let U=u();function ee(e,t){if(!t)return;let r=t.phase,i=r===`bisect`,a=r===`place`,s=r===`done`,c=t.i,l=t.tails||[],u=t.answer,f=t.lo,p=t.hi,m=t.mid,g=t.pos;D.forEach((e,t)=>{let n=[`lisbin-cell`];c!==null&&!s&&t===c&&n.push(`is-cur`),e.g.setAttribute(`class`,n.join(` `))});let _=e=>i?e>=f&&e<p?`is-range`:`is-out`:a?e===g?`is-range`:`is-out`:null;O.forEach((e,n)=>{let r=[`lisbin-cell`];if(n<l.length){e.val.textContent=String(l[n]),e.sub.textContent=`len ${n}`;let o=_(n);o&&r.push(o),i&&n===m&&r.push(`is-mid`),a&&n===g&&r.push(t.kind===`append`?`is-fresh`:`is-pos`)}else e.val.textContent=``,e.sub.textContent=``,r.push(`is-ghost`);e.g.setAttribute(`class`,r.join(` `))}),k.forEach((e,n)=>{let r=a&&t.kind===`replace`&&n===g&&t.prevVal!==null;if(e.t.classList.toggle(`is-on`,r),e.line.classList.toggle(`is-on`,r),r){e.t.textContent=`原 ${t.prevVal}`;let r=String(t.prevVal).length*7+16;e.line.setAttribute(`x1`,h(n)-r/2),e.line.setAttribute(`x2`,h(n)+r/2)}});let v=i&&p>f;if(A.classList.toggle(`is-on`,v),j.classList.toggle(`is-on`,v),M.classList.toggle(`is-on`,v),v){let e=h(f)-d/2,t=h(p-1)+d/2;A.setAttribute(`x1`,e),A.setAttribute(`x2`,t),j.setAttribute(`x1`,e),j.setAttribute(`x2`,e),M.setAttribute(`x1`,t),M.setAttribute(`x2`,t)}let y=i?m!==null:a;if(P.classList.toggle(`is-on`,y),F.classList.toggle(`is-on`,y),P.classList.toggle(`is-gold`,a),y){let e=i?m:g;F.textContent=i?`mid`:`pos`,P.setAttribute(`x`,h(e)-18),F.setAttribute(`x`,h(e))}let b=c!==null&&!s;L.classList.toggle(`is-on`,b),R.classList.toggle(`is-on`,b),b&&(L.setAttribute(`x`,h(c)-10),R.setAttribute(`x`,h(c))),i?z.textContent=`搜索区间 [${f}, ${p}) · mid = ${m} · 找第一个 >= ${t.x} 的位置`:a?z.textContent=t.kind===`replace`?`pos = ${g} · 替换 tails[${g}]：${t.prevVal} → ${t.x}（长度不变）`:`pos = ${g} · 追加 ${t.x}：长度 ${g} → ${g+1}`:z.textContent=``,V.textContent=`目前最长递增子序列长度 = ${u}`;let x=u>(e>0?n[e-1].answer:0);B.classList.toggle(`is-hot`,x||s),V.classList.toggle(`is-hot`,x||s),i||a?(S.textContent=`i = ${c} · 值 ${t.x}`,i?C.textContent=`二分：tails[${m}] = ${l[m]} ${t.goRight?`<`:`>=`} ${t.x}`:t.kind===`replace`?C.textContent=`${t.prevVal} 换成 ${t.x} —— 末尾更小`:C.textContent=`比所有末尾都大 —— 追加`,w.textContent=`tails 长度 = ${u}`):s?(S.textContent=`${o} 个元素处理完`,C.textContent=`tails 只是登记表，长度才是答案`,w.textContent=`答案 = ${u}`):(S.textContent=`换一套记账`,C.textContent=`tails[len] = 该长度下最小的末尾`,w.textContent=`答案 = tails 长度`),i?H.textContent=t.goRight?`tails[${m}] = ${l[m]} 太小，不可能成为「第一个 >= ${t.x}」的位置 —— 往右收`:`tails[${m}] = ${l[m]} 已经够大，而且左边也许有 —— 往左收`:a?H.textContent=t.kind===`replace`?`替换让「长度 ${g+1} 这一档」的末尾从 ${t.prevVal} 降到 ${t.x} —— 后面更容易接上`:`追加让答案从 ${g} 涨到 ${g+1} —— 这是唯一能让答案变大的动作`:s?H.textContent=`时间 O(n log n)、空间 O(n) —— 每个元素只做一次二分`:H.textContent=`tails 严格递增 —— 这个性质正是能二分的前提`,Z(U,t.desc)}c.appendChild(U);let te=Q();c.appendChild(te.root),e.textContent=``,e.appendChild(c),X();let W=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,G=$({steps:n,controls:te,intervalMs:Vm,onRender:ee});G.jumpTo(Math.trunc(t.initialStep)||0);let K=null;return r&&!W&&typeof IntersectionObserver==`function`&&(K=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){K.disconnect(),K=null,G.play();return}},{threshold:.35}),K.observe(c)),{destroy(){K&&=(K.disconnect(),null),G.destroy(),e.textContent=``,delete e.dataset.lisbinMounted,document.getElementById(Cm)?.remove()}}}var Gm=`horse`,Km=`ros`,qm={match:`相同（不付钱）`,replace:`替换`,delete:`删除`,insert:`插入`};function Jm(e,t){return Array.from(typeof e==`string`?e:t)}function Ym(e,t,n,r,i){let a=e[n-1],o=t[r-1];if(i.match)return`a 的 「${a}」 和 b 的 「${o}」 一样 —— 这一对不用付钱，直接抄对角 dp[${n-1}][${r-1}] = ${i.diag}。另外两个邻居连看都不用看：它们各自至少要再收 1，永远赢不了。`;let s=[`替换：对角 ${i.diag} + 1 = ${i.diag+1}`,`删除：上方 ${i.up} + 1 = ${i.up+1}`,`插入：左方 ${i.left} + 1 = ${i.left+1}`],c=`最小的是${qm[i.op]}，所以 dp[${n}][${r}] = ${i.value}。`;if(i.ties.length>1){let e=i.ties.map(e=>qm[e]).join(` / `);c+=`（有 ${i.ties.length} 个方向并列最小：${e} —— 数值上一模一样，只有把操作序列打出来时才分得出高下。）`}return`a 的 「${a}」 对 b 的 「${o}」 不相同，三种收尾取最小：${s.join(`；`)}。${c}`}function Xm(e={}){let t=Jm(e.word1,Gm),n=Jm(e.word2,Km),r=t.length,i=n.length,a=[];for(let e=0;e<=r;e+=1)a.push(Array(i+1).fill(0));let o=[];for(let e=0;e<=i;e+=1)o.push(e);let s=[],c=(e,c,l,u)=>{s.push({phase:e,i:c,j:l,word1:t,word2:n,m:r,n:i,dp:a.map(e=>e.slice()),buf:o.slice(),bufBefore:null,charA:c!==null&&c>0?t[c-1]:null,charB:l!==null&&l>0?n[l-1]:null,op:null,ties:[],match:!1,diag:null,up:null,left:null,value:null,saved:null,answer:null,done:!1,desc:``,...u})};for(let e=0;e<=i;e+=1)a[0][e]=e;c(`init`,null,null,{desc:`先把第 0 行填成 0 … ${i}：空串变成 b 的前 j 个字符，只能一个字符一个字符地插入，代价恰好是 j。这一行不是凑数用的，它就是「前缀型 dp」的语义本身。滚动数组的初值就是这个第 0 行。`});for(let e=1;e<=r;e+=1){let r=o.slice(),s=a[e-1][0];a[e][0]=e,o[0]=e,c(`col`,e,0,{bufBefore:r,saved:s,diag:s,value:e,desc:`第 ${e} 行先补左边界：a 的前 ${e} 个字符要变成空串，只能全删掉，所以 dp[${e}][0] = ${e}。顺手把上一行的 dp[${e-1}][0] = ${s} 存进 prev —— 它是这一行第一格的对角，等下一格要用。`});for(let r=1;r<=i;r+=1){let i=o.slice(),l=o[r],u=a[e-1][r-1],d=a[e-1][r],f=a[e][r-1],p=t[e-1]===n[r-1],m=Math.min(u,d,f),h=[];u===m&&h.push(`replace`),d===m&&h.push(`delete`),f===m&&h.push(`insert`);let g=p?`match`:h[0],_=p?u:m+1;a[e][r]=_,o[r]=_,c(`cell`,e,r,{bufBefore:i,saved:s,diag:u,up:d,left:f,value:_,op:g,ties:h,match:p,desc:Ym(t,n,e,r,{match:p,op:g,diag:u,up:d,left:f,value:_,ties:h})}),s=l}}return c(`done`,r,i,{value:a[r][i],answer:a[r][i],done:!0,desc:`右下角 dp[${r}][${i}] = ${a[r][i]} 就是答案：a 整个变成 b 最少要 ${a[r][i]} 步。注意只有右下角这一个格子是答案 —— 第一行是「空串长成 b」，第一列是「a 缩成空串」，它们只是把边界说清楚。`+(i>0?`另外：滚动数组跑到最后，buf 只留下最后一行，答案还是 buf[${i}] = ${a[r][i]}。`:``)}),s}var Zm=`editdist-styles`,Qm=880,$m={match:`相同`,replace:`替换`,delete:`删除`,insert:`插入`},eh={match:`ok`,replace:`sub`,delete:`del`,insert:`ins`},th={replace:`is-sub`,delete:`is-del`,insert:`is-ins`},nh=e=>th[e]||`is-sub`,rh=`
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
`;function ih(){if(document.getElementById(Zm))return;let e=document.createElement(`style`);e.id=Zm,e.textContent=rh,document.head.appendChild(e)}function ah(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function oh(e,t,n){return(r,i)=>e===`init`?r===0:e===`done`||r<t?!0:r===t?i<=n:!1}function sh(e,t,n,r){return Math.max(n,Math.min(r,Math.round(e/t)))}function ch(e,t=12,n=7){let r=0;for(let i of e)r+=/[\u3000-\u303f\u4e00-\u9fff\uff00-\uffef]/.test(i)?t:n;return r}function lh(e){return e.match||e.op===`replace`?[e.i-1,e.j-1]:e.op===`delete`?[e.i-1,e.j]:e.op===`insert`?[e.i,e.j-1]:null}function uh(e,t){let{m:n,n:r,word1:i,word2:a}=e[0],o=n+1,s=r+1,c=118;s*c+(s-1)*6>520&&(c=Math.max(26,Math.floor((520-(s-1)*6)/s)));let l=38;o*l+(o-1)*5>300&&(l=Math.max(18,Math.floor((300-(o-1)*5)/o)));let u=s*c+(s-1)*6,d=120+(o*l+(o-1)*5)+20,f=d+30,p=f+22,m=Math.max(68,(680-u)/2+8),h=e=>m+e*(c+6),g=e=>120+e*(l+5),_=sh(c,7.5,9,15),v=sh(l,4.2,7,9),y=l>=34,b=Y,x=b(`svg`,{class:`viz__svg ed__svg`,viewBox:`0 0 680 ${p}`,role:`img`,"aria-label":`编辑距离 二维动态规划推演动画`}),S=b(`g`,{class:`ed-marks`}),C=b(`g`,{class:`ed-cells`});x.appendChild(S),x.appendChild(C);let w=b(`text`,{class:`ed-note`,x:30,y:22});w.textContent=`dp[i][j] = a 的前 i 个字符 变成 b 的前 j 个字符 的最少操作数`,S.appendChild(w),S.appendChild(b(`rect`,{class:`ed-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let T=b(`text`,{class:`ed-banner__seg`,x:46,y:58}),E=b(`text`,{class:`ed-banner__seg`,x:218,y:58}),D=b(`text`,{class:`ed-banner__val`,x:634,y:58});S.appendChild(T),S.appendChild(E),S.appendChild(D);for(let e=0;e<=r;e+=1){let t=b(`text`,{class:`ed-colhdr__text`,x:h(e)+c/2,y:98});t.textContent=e===0?`""`:a[e-1];let n=b(`text`,{class:`ed-colhdr__idx`,x:h(e)+c/2,y:112});n.textContent=e===0?`j=0`:`j=${e}`,S.appendChild(t),S.appendChild(n)}for(let e=0;e<=n;e+=1){let t=b(`text`,{class:`ed-hdr__text`,x:m-16,y:g(e)+l/2});t.textContent=e===0?`""`:i[e-1];let n=b(`text`,{class:`ed-hdr__idx`,x:m-44,y:g(e)+l/2});n.textContent=e===0?`i=0`:`i=${e}`,S.appendChild(t),S.appendChild(n)}let O=[];for(let e=0;e<=n;e+=1){let t=[];for(let n=0;n<=r;n+=1){let r=b(`g`,{class:`ed-cell`});r.appendChild(b(`rect`,{class:`ed-cell__box`,x:h(n),y:g(e),width:c,height:l,rx:6}));let i=b(`text`,{class:`ed-cell__val`,x:h(n)+c/2,y:y?g(e)+l/2-6:g(e)+l/2,style:`font-size: ${_}px`});r.appendChild(i);let a=b(`text`,{class:`ed-cell__op`,x:h(n)+c/2,y:g(e)+l-9,style:`font-size: ${v}px`});y&&r.appendChild(a),C.appendChild(r),t.push({g:r,val:i,op:a})}O.push(t)}let k=b(`rect`,{class:`ed-ring`,x:0,y:0,width:c+10,height:l+10,rx:9});S.appendChild(k);let A=[{color:`--ed-diag, #c2872f`,text:`替换 = 对角`},{color:`--ed-up, #3f6b57`,text:`删除 = 上方`},{color:`--ed-left, #a45f45`,text:`插入 = 左方`}],j=(680-(A.reduce((e,t)=>e+17+ch(t.text)+34,0)-34))/2;for(let e of A){S.appendChild(b(`rect`,{x:j,y:d-5.5,width:11,height:11,rx:3,style:`fill: none; stroke: var(${e.color}); stroke-width: 2.5;`}));let t=b(`text`,{class:`ed-legend__text`,x:j+17,y:d});t.textContent=e.text,S.appendChild(t),j+=17+ch(e.text)+34}let M=b(`text`,{class:`ed-phase__text`,x:680/2,y:f});S.appendChild(M);function N(e,n){if(!n)return;let{phase:r,i,j:a,m:o,n:s,dp:c}=n,l=r===`done`,u=r===`cell`,d=oh(r,i,a),f=u?lh(n):null;O.forEach((e,t)=>{e.forEach((e,p)=>{let m=[`ed-cell`],h=d(t,p);if(h?(t===0||p===0)&&m.push(`is-boundary`):m.push(`is-ghost`),r===`init`&&t===0?m.push(`is-fresh`):r===`col`&&t===i&&p===0?m.push(`is-cur`):u&&t===i&&p===a?m.push(n.match?`is-match`:`is-fresh`):l&&t===o&&p===s&&m.push(`is-fresh`),u){let e=t===i-1&&p===a-1,r=t===i-1&&p===a,o=t===i&&p===a-1;e?m.push(`is-nb-diag`):r?m.push(`is-nb-up`):o&&m.push(`is-nb-left`),n.match&&(r||o)&&m.push(`is-off`),f&&f[0]===t&&f[1]===p&&m.push(`is-best`)}if(e.g.setAttribute(`class`,m.join(` `)),e.val.textContent=h?String(c[t][p]):``,y){let r=u&&t===i&&p===a;e.op.textContent=r&&eh[n.op]||``,e.op.setAttribute(`class`,`ed-cell__op ${r?nh(n.op):``}`)}})}),f?(k.classList.add(`is-on`),k.setAttribute(`x`,h(f[1])-5),k.setAttribute(`y`,g(f[0])-5)):k.classList.remove(`is-on`),r===`init`?(T.textContent=`第 0 行`,E.textContent=`空串长成 b 的前 j 个字符`,D.textContent=`dp[0][j] = j`):r===`col`?(T.textContent=`i = ${i} · 第 0 列`,E.textContent=`a 的前 ${i} 个字符 缩成空串`,D.textContent=`dp[${i}][0] = ${i}`):u?(T.textContent=`i = ${i} · j = ${a}`,E.textContent=n.match?`'${n.charA}' = '${n.charB}' -> 抄对角`:`'${n.charA}' 对 '${n.charB}' -> 取${$m[n.op]}`,D.textContent=`dp[${i}][${a}] = ${n.value}`):(T.textContent=`右下角那一格`,E.textContent=`dp[${o}][${s}] 就是答案`,D.textContent=`答案 = ${n.answer}`),r===`init`?M.textContent=`第 0 行 / 第 0 列不是算出来的，是语义规定的：空串变成 j 个字符 = 插入 j 次。`:r===`col`?M.textContent=`第 ${i} 行先把左边界补上 —— a 的前 ${i} 个字符要缩成空串，代价就是 ${i}。`:u?M.textContent=n.match?`对角 dp[${i-1}][${a-1}] = ${n.diag} 直接抄，不收钱 —— 另外两个邻居至少大 1，不用看。`:`对角 ${n.diag}+1 / 上方 ${n.up}+1 / 左方 ${n.left}+1 —— 取${$m[n.op]}，dp[${i}][${a}] = ${n.value}。`:M.textContent=`时间 O(m·n)、空间 O(m·n) —— 追问多半接着来：能不能只留一行？`,Z(t,n.desc)}return{svgRoot:x,paint:N}}function dh(e,t){let{m:n,n:r,word1:i,word2:a,buf:o}=e[0],s=n+1,c=r+1,l=62;c*l+(c-1)*4>304&&(l=Math.max(20,Math.floor((304-(c-1)*4)/c)));let u=24;s*u+(s-1)*4>192&&(u=Math.max(13,Math.floor((192-(s-1)*4)/s)));let d=118+(s*u+(s-1)*4)+46,f=d+48+16,p=d+48+40,m=p+22,h=e=>78+e*(l+4),g=e=>118+e*(u+4),_=e=>78+e*(l+4),v=Y,y=v(`svg`,{class:`viz__svg ed__svg`,viewBox:`0 0 680 ${m}`,role:`img`,"aria-label":`编辑距离 滚动数组 O(n) 空间推演动画`}),b=v(`g`,{class:`ed2-marks`}),x=v(`g`,{class:`ed2-cells`}),S=v(`g`,{class:`ed2-panel`}),C=v(`g`,{class:`ed2-bufs`});y.appendChild(b),y.appendChild(x),y.appendChild(S),y.appendChild(C);let w=v(`text`,{class:`ed-note`,x:30,y:22});w.textContent=`同一张表，但只需要留一行 —— 每个格子只依赖「上一行」和「本行左邻」，唯一被覆盖掉的就是对角。`,b.appendChild(w),b.appendChild(v(`rect`,{class:`ed-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let T=v(`text`,{class:`ed-banner__seg`,x:46,y:58}),E=v(`text`,{class:`ed-banner__seg`,x:218,y:58}),D=v(`text`,{class:`ed-banner__val`,x:634,y:58});b.appendChild(T),b.appendChild(E),b.appendChild(D);for(let e=0;e<=r;e+=1){let t=v(`text`,{class:`ed-colhdr__text`,x:h(e)+l/2,y:106});t.textContent=e===0?`""`:a[e-1],b.appendChild(t)}for(let e=0;e<=n;e+=1){let t=v(`text`,{class:`ed-hdr__text`,x:64,y:g(e)+u/2});t.textContent=e===0?`""`:i[e-1],b.appendChild(t)}let O=[];for(let e=0;e<=n;e+=1){let t=[];for(let n=0;n<=r;n+=1){let r=v(`g`,{class:`ed2-cell`});r.appendChild(v(`rect`,{class:`ed2-cell__box`,x:h(n),y:g(e),width:l,height:u,rx:4}));let i=v(`text`,{class:`ed2-cell__val`,x:h(n)+l/2,y:g(e)+u/2});r.appendChild(i),x.appendChild(r),t.push({g:r,val:i})}O.push(t)}let k=[{op:`replace`,tag:`替换`},{op:`delete`,tag:`删除`},{op:`insert`,tag:`插入`}];k.forEach((e,t)=>{let n=118+t*57,r=v(`g`,{class:`ed2-term ${nh(e.op)}`}),i=v(`rect`,{class:`ed2-term__box`,x:356,y:n,width:294,height:46,rx:8}),a=v(`text`,{class:`ed2-term__main`,x:370,y:n+17}),o=v(`text`,{class:`ed2-term__tag ${nh(e.op)}`,x:636,y:n+17});o.textContent=e.tag;let s=v(`text`,{class:`ed2-term__note`,x:370,y:n+34});r.appendChild(i),r.appendChild(a),r.appendChild(o),r.appendChild(s),S.appendChild(r),e.g=r,e.main=a,e.noteT=s});let A=[];for(let e=0;e<=r;e+=1){let t=v(`g`,{class:`ed2-buf is-old`});t.appendChild(v(`rect`,{class:`ed2-buf__box`,x:_(e),y:d,width:l,height:48,rx:6}));let n=v(`text`,{class:`ed2-buf__val`,x:_(e)+l/2,y:d+48/2-6});t.appendChild(n);let r=v(`text`,{class:`ed2-buf__idx`,x:_(e)+l/2,y:d+48-11});r.textContent=`#${e}`,t.appendChild(r),C.appendChild(t),A.push({g:t,val:n})}let j=v(`text`,{class:`ed-note`,x:78,y:d-14});j.textContent=`buf —— 只留一行（长度 n+1 = ${r+1}）`,b.appendChild(j);let M=v(`text`,{class:`ed2-tag is-left`,x:0,y:f,opacity:0});M.textContent=`左方`;let N=v(`text`,{class:`ed2-tag is-up`,x:0,y:f,opacity:0});N.textContent=`上方`,b.appendChild(M),b.appendChild(N),b.appendChild(v(`rect`,{class:`ed2-term__box`,x:356,y:d,width:294,height:48,rx:8}));let P=v(`text`,{class:`ed2-term__main`,x:370,y:d+18}),F=v(`text`,{class:`ed2-term__note`,x:370,y:d+35});b.appendChild(P),b.appendChild(F);let I=v(`text`,{class:`ed-phase__text`,x:680/2,y:p});b.appendChild(I);function L(e,t){k.forEach((n,r)=>{n.g.setAttribute(`class`,r===0?`ed2-term ${nh(n.op)} is-best is-pick`:`ed2-term is-hidden`),r===0&&(n.main.textContent=e,n.noteT.textContent=t)})}function R(e,n){if(!n)return;let{phase:r,i,j:a,m:s,n:c,dp:u,buf:d}=n,f=r===`done`,p=r===`cell`,m=oh(r,i,a);if(O.forEach((e,t)=>{e.forEach((e,n)=>{let o=[`ed2-cell`],c=m(t,n),l=`blank`;c&&(l=r===`init`?`alive`:f?t===s?`alive`:`gone`:t<i?t<i-1?`gone`:n<a?`wiped`:`alive`:`new`),l!==`blank`&&o.push(`is-${l}`),p&&t===i-1&&n===a-1&&o.push(`is-diag`),(p||r===`col`)&&t===i&&n===a&&o.push(`is-cur`),e.g.setAttribute(`class`,o.join(` `)),e.val.textContent=c?String(u[t][n]):``})}),A.forEach((e,t)=>{let n=[`ed2-buf`];f||r===`init`?n.push(f?`is-new`:`is-old`):n.push(t<=a?`is-new`:`is-old`),p&&t===a&&n.push(`is-cur`),e.g.setAttribute(`class`,n.join(` `)),e.val.textContent=String(d[t])}),p?(M.setAttribute(`x`,_(a-1)+l/2),N.setAttribute(`x`,_(a)+l/2),M.setAttribute(`opacity`,`1`),N.setAttribute(`opacity`,`1`)):(M.setAttribute(`opacity`,`0`),N.setAttribute(`opacity`,`0`)),p){let e={replace:n.diag,delete:n.up,insert:n.left},t={replace:`dp[${i-1}][${a-1}]`,delete:`dp[${i-1}][${a}]`,insert:`dp[${i}][${a-1}]`},r={replace:n.match?`字符相同 —— 就是它`:`旧值已被覆盖，靠 prev 留了一份`,delete:n.match?`不用看（至少大 1）`:`写之前还躺在 buf[j] 里`,insert:n.match?`不用看（至少大 1）`:`本行刚写进 buf[j-1]`};for(let i of k){let a=n.match?i.op===`replace`:n.ties.includes(i.op),o=[`ed2-term`,nh(i.op)];a&&o.push(`is-best`),a&&i.op===n.op&&o.push(`is-pick`),n.match&&i.op!==`replace`&&o.push(`is-off`),i.g.setAttribute(`class`,o.join(` `)),i.main.textContent=`${t[i.op]} = ${e[i.op]}`,i.noteT.textContent=r[i.op]}P.textContent=`prev = ${n.saved}`,F.textContent=`上一行的对角，数组里那一格已经被覆盖`}else r===`init`?(L(`buf 初值 = [${o.join(`, `)}]`,`第 0 行直接当 buf 的初值 —— 不用算`),P.textContent=`prev 还没意义`,F.textContent=`第一行开始时才从 buf[0] 取出来`):r===`col`?(L(`buf[0] 改成 ${i}`,`dp[${i-1}][0] = ${n.saved} 先被取出来存进 prev`),P.textContent=`prev = ${n.saved}`,F.textContent=`第一格的对角已经拿到手了`):(L(`buf[${c}] = ${n.answer}`,`整个表只用了 n+1 个格子`),P.textContent=`答案 = buf[${c}]`,F.textContent=`左上那一角被丢掉了，答案还是对的`);r===`init`?(T.textContent=`第 0 行`,E.textContent=`直接就是 buf 的初值`,D.textContent=`buf = [${o.join(`, `)}]`):r===`col`?(T.textContent=`i = ${i} · 第 0 列`,E.textContent=`buf[0] 更新，旧的先存进 prev`,D.textContent=`buf[0] = ${i}`):p?(T.textContent=`i = ${i} · j = ${a}`,E.textContent=n.match?`'${n.charA}' 相同 -> 用 prev`:`取${$m[n.op]} -> ${n.value}`,D.textContent=`buf[${a}] = ${n.value}`):(T.textContent=`跑完了`,E.textContent=`buf 就是最后一行`,D.textContent=`答案 = ${n.answer}`),r===`init`?I.textContent=`滚动数组的初值就是第 0 行 —— 空间从 m·n 个格子直接砍到 n+1 个。`:r===`col`?I.textContent=`每行开头都有一个坑：buf[0] 要先备份给 prev，改完就再也取不到旧值了。`:p?I.textContent=n.match?`对角 dp[${i-1}][${a-1}] 已经不在数组里了 —— prev = ${n.saved} 就是它。`:`上方在本行 buf[${a}] 里、左方是刚写的 buf[${a-1}] —— 只有对角必须靠 prev。`:I.textContent=`结论：只要推进顺序是「一行一行从左往右」，n+1 个格子就够 —— 答案还是 buf[n]。`,Z(t,n.desc)}return{svgRoot:y,paint:R}}function fh(e,t,n){if(!e||e.dataset.edMounted===`1`)return{destroy(){}};e.dataset.edMounted=`1`,ih();let r=Xm(t),i=r[0],a=document.createElement(`div`);a.className=`viz ed`;let o=document.createElement(`div`);o.className=`viz__stage`,a.appendChild(o);let s=ah();if(i.m===0&&i.n===0){let t=Y,n=t(`svg`,{class:`viz__svg ed__svg`,viewBox:`0 0 620 120`,role:`img`}),r=t(`text`,{x:310,y:60,style:`fill: var(--ed-muted, #657168); font-size: 14px; text-anchor: middle;`});return r.textContent=`两个都是空串 —— 一个操作都不用做，答案是 0`,n.appendChild(r),o.appendChild(n),a.appendChild(s),a.appendChild(Q().root),e.textContent=``,e.appendChild(a),X(),{destroy(){e.textContent=``,delete e.dataset.edMounted,document.getElementById(Zm)?.remove()}}}let c=n===`grid`?uh(r,s):dh(r,s);o.appendChild(c.svgRoot),a.appendChild(s);let l=Q();a.appendChild(l.root),e.textContent=``,e.appendChild(a),X();let u=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,d=$({steps:r,controls:l,intervalMs:Qm,onRender:(e,t)=>c.paint(e,t)});d.jumpTo(Math.trunc(t.initialStep)||0);let f=null;return t.autoplay!==!1&&!u&&typeof IntersectionObserver==`function`&&(f=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){f.disconnect(),f=null,d.play();return}},{threshold:.35}),f.observe(a)),{destroy(){f&&=(f.disconnect(),null),d.destroy(),e.textContent=``,delete e.dataset.edMounted,document.getElementById(Zm)?.remove()}}}function ph(e,t={}){return fh(e,t,`grid`)}function mh(e,t={}){return fh(e,t,`roll`)}var hh=10,gh=2147483647;function _h(e,t,n){let r=t[e-1],i=t[e-2],a=r+i,o=``;return n!==null&&a>n&&(o=` 注意：${a} 已经超过 int32 上限 ${n} —— 从这一阶起，Java 的 int 先于算法爆掉。`),`dp[${e}] = dp[${e-1}] + dp[${e-2}] = ${r} + ${i} = ${a}。前一类以 1 阶收尾、后一类以 2 阶收尾，互斥且完备，所以直接相加。${o}`}function vh(e={}){let t=Number.isInteger(e.n)&&e.n>=0?e.n:hh,n=e.int32Limit===null||e.int32Limit===void 0?null:Number(e.int32Limit)||gh,r=Array(t+1).fill(0);r[0]=1,t>=1&&(r[1]=1);let i=[],a=(e,a,o,s)=>{i.push({phase:e,i:a,from:o,n:t,limit:n,dp:r.slice(),value:null,over:!1,lastOk:null,answer:null,done:!1,desc:``,...s})};a(`init`,null,null,{desc:`dp[0] = 1：站在地面不动也算一种走法 —— 递推的起点；dp[1] = 1：只能迈一步。接下来每一阶的走法数，都只由它前面两阶决定。`});for(let e=2;e<=t;e+=1){a(`from1`,e,e-1,{desc:`到第 ${e} 阶的最后一步是「从第 ${e-1} 阶迈 1 阶」—— 这类走法数恰好等于到第 ${e-1} 阶的走法数：dp[${e-1}] = ${r[e-1]}。`}),a(`from2`,e,e-2,{desc:`另一类最后一步是「从第 ${e-2} 阶迈 2 阶」—— dp[${e-2}] = ${r[e-2]} 种。按最后一步分类：两类互斥（一步不可能既是 1 又是 2）、又覆盖所有可能，可以相加。`}),r[e]=r[e-1]+r[e-2];let t=n!==null&&r[e]>n;a(`settle`,e,null,{value:r[e],over:t,desc:_h(e,r,n)})}let o=null;if(n!==null)for(let e=0;e<=t;e+=1)r[e]<=n&&(o=e);return a(`done`,t,null,{value:r[t],answer:r[t],over:n!==null&&r[t]>n,lastOk:o,done:!0,desc:n===null?` 到第 ${t} 阶共有 ${r[t]} 种走法 —— 答案就是 dp[${t}]，它正是斐波那契数。`:` ways(${t}) = ${r[t]}。int32 在第 ${o===null?`-`:o+1} 阶就装不下了，int64 也只能撑到第 91 阶 —— 美团追问「n=80」真正考的是类型，不是算法。`}),i}var yh=`climb-styles`,bh=`
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
`;function xh(){if(document.getElementById(yh))return;let e=document.createElement(`style`);e.id=yh,e.textContent=bh,document.head.appendChild(e)}function Sh(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function Ch(e,t,n,r,i,a,o){e.appendChild(n);let s=Q();e.appendChild(s.root),t.textContent=``,t.appendChild(e),X();let c=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,l=$({steps:r,controls:s,intervalMs:a.intervalMs||880,onRender:(e,t)=>i(e,t)});l.jumpTo(Math.trunc(a.initialStep)||0);let u=null;return a.autoplay!==!1&&!c&&typeof IntersectionObserver==`function`&&(u=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){u.disconnect(),u=null,l.play();return}},{threshold:.35}),u.observe(e)),{destroy(){u&&=(u.disconnect(),null),l.destroy(),t.textContent=``,delete t.dataset[o],document.getElementById(yh)?.remove()}}}function wh(e,t){let{n}=e[0],r=n+1,i=48;r*i+(r-1)*6>624&&(i=Math.max(22,Math.floor((624-(r-1)*6)/r)));let a=r>12?4:6,o=(680-(r*i+(r-1)*a))/2,s=Math.max(9,Math.min(17,Math.round(i/3.4))),c=i>=34,l=e=>o+e*(i+a)+i/2,u=Y,d=u(`svg`,{class:`viz__svg climb__svg`,viewBox:`0 0 680 334`,role:`img`,"aria-label":`爬楼梯 动态规划填表动画`}),f=u(`g`,{class:`climb-marks`}),p=u(`g`,{class:`climb-cells`});d.appendChild(f),d.appendChild(p);let m=u(`text`,{class:`climb-note`,x:30,y:22});m.textContent=`dp[i] = dp[i-1] + dp[i-2] —— 最后一步只有「迈 1 阶」「迈 2 阶」两种来路`,f.appendChild(m),f.appendChild(u(`rect`,{class:`climb-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let h=u(`text`,{class:`climb-banner__seg`,x:46,y:58}),g=u(`text`,{class:`climb-banner__seg`,x:190,y:58}),_=u(`text`,{class:`climb-banner__val`,x:634,y:58});f.appendChild(h),f.appendChild(g),f.appendChild(_);let v=[];for(let e=0;e<=n;e+=1){let t=u(`g`,{class:`climb-cell`});t.appendChild(u(`rect`,{class:`climb-cell__box`,x:l(e)-i/2,y:128,width:i,height:56,rx:6}));let n=u(`text`,{class:`climb-cell__val`,x:l(e),y:c?150:156,style:`font-size: ${s}px`});if(t.appendChild(n),c){let n=u(`text`,{class:`climb-cell__idx`,x:l(e),y:173});n.textContent=`#${e}`,t.appendChild(n)}p.appendChild(t),v.push({g:t,val:n})}let y=(e,t,n,r)=>{let i=u(`path`,{class:`climb-arc ${e}`,d:``}),a=u(`text`,{class:`climb-arc__label ${e}`,x:0,y:0});return a.textContent=t,f.appendChild(i),f.appendChild(a),{path:i,label:a,draw(e,t){let o=l(e),s=l(t);i.setAttribute(`d`,`M ${o} 188 Q ${(o+s)/2} ${188+n*2} ${s} 188`),a.setAttribute(`x`,(o+s)/2),a.setAttribute(`y`,188+n+r)}}},b=y(`is-one`,``,26,8),x=y(`is-two`,``,62,8),S=u(`text`,{class:`climb-sum`,x:680/2,y:280});f.appendChild(S);let C=u(`text`,{class:`climb-phase__text`,x:680/2,y:312});f.appendChild(C);function w(e,n){if(!n)return;let{phase:r,i,from:a,dp:o,n:s}=n,c=r===`done`,l=r===`settle`;v.forEach((e,t)=>{let n=[`climb-cell`],u=r===`init`?t<=Math.min(1,s):c?!0:t<=i-1;u||n.push(`is-ghost`),l&&t===i?n.push(`is-fresh`):(r===`from1`||r===`from2`)&&t===i?n.push(`is-cur`):c&&t===s&&n.push(`is-fresh`),r===`from1`&&t===a&&n.push(`is-cur`),r===`from2`&&t===a&&n.push(`is-cur`),e.g.setAttribute(`class`,n.join(` `)),e.val.textContent=u?String(o[t]):``});let u=r===`from1`||r===`from2`||l,d=r===`from2`||l;b.path.classList.toggle(`is-on`,u),b.label.classList.toggle(`is-on`,u),x.path.classList.toggle(`is-on`,d),x.label.classList.toggle(`is-on`,d),u&&(b.draw(i-1,i),b.label.textContent=`迈 1 阶 · 带来 dp[${i-1}] = ${o[i-1]}`),d&&(x.draw(i-2,i),x.label.textContent=`迈 2 阶 · 带来 dp[${i-2}] = ${o[i-2]}`),S.textContent=l||c?`两类互斥且完备 -> 相加：dp[${i}] = ${o[i-1]} + ${o[i-2]} = ${o[i]}`:`按「最后一步的迈法」分类 —— 互斥且完备，所以是加法原理`,S.classList.toggle(`is-hot`,l||c),r===`init`?(h.textContent=`起点`,g.textContent=`dp[0] = 1（不动也算一种）· dp[1] = 1`,_.textContent=``):r===`from1`?(h.textContent=`第 ${i} 阶`,g.textContent=`来路一：从第 `+(i-1)+` 阶迈 1 阶`,_.textContent=`dp[${i-1}] = ${o[i-1]}`):r===`from2`?(h.textContent=`第 ${i} 阶`,g.textContent=`来路二：从第 `+(i-2)+` 阶迈 2 阶`,_.textContent=`dp[${i-2}] = ${o[i-2]}`):l?(h.textContent=`第 ${i} 阶`,g.textContent=`两类相加`,_.textContent=`dp[${i}] = ${o[i]}`):(h.textContent=`${s} 阶楼梯`,g.textContent=`每一阶都只由前两阶决定`,_.textContent=`答案 = ${n.answer}`),C.textContent=c?`dp[n] 就是斐波那契数 —— ways(n) = Fib(n+1)。想知道 O(log n) 的算法，用矩阵快速幂。`:l?`dp[${i}] 定型。注意 dp[i] 之前的值再也不会被用到两次以上 —— 每个格子只算一次。`:`「无后效性」：第 ${i} 阶之后的走法不会改变前面的计数 —— 所以可以从左往右一路填。`,Z(t,n.desc)}return{svgRoot:d,paint:w}}function Th(e,t){let{n,limit:r}=e[0],i=n+1,a=Math.max(5,Math.floor((608-(i-1)*2)/i)),o=(680-(i*a+(i-1)*2))/2,s=e=>o+e*(a+2)+a/2,c=Y,l=c(`svg`,{class:`viz__svg climb__svg`,viewBox:`0 0 680 314`,role:`img`,"aria-label":`爬楼梯 int32 溢出演示动画`}),u=c(`g`,{class:`climb-marks`}),d=c(`g`,{class:`climb-cells`});l.appendChild(u),l.appendChild(d);let f=c(`text`,{class:`climb-note`,x:30,y:22});f.textContent=`每一格是一阶楼梯的走法数 —— 颜色 = 这个数装不装得进 int32`,u.appendChild(f),u.appendChild(c(`rect`,{class:`climb-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let p=c(`text`,{class:`climb-banner__seg`,x:46,y:58}),m=c(`text`,{class:`climb-banner__seg`,x:168,y:58}),h=c(`text`,{class:`climb-banner__val`,x:634,y:58});u.appendChild(p),u.appendChild(m),u.appendChild(h);let g=[];for(let e=0;e<=n;e+=1){let t=c(`g`,{class:`climb-cell`});t.appendChild(c(`rect`,{class:`climb-cell__box`,x:s(e)-a/2,y:118,width:a,height:34,rx:2})),d.appendChild(t),g.push({g:t})}let _=e[e.length-1].dp,v=0;for(let e=0;e<=n;e+=1)_[e]<=r&&(v=e);let y=o+(v+1)*(a+2)-2/2;u.appendChild(c(`line`,{class:`climb-limit`,x1:y,y1:106,x2:y,y2:162}));let b=c(`text`,{class:`climb-limit__label`,x:y-8,y:94});b.textContent=`int32 上限 ${r} —— 左边装得下，右边爆`,u.appendChild(b);let x=c(`text`,{class:`climb-readout`,x:680/2,y:208});u.appendChild(x);let S=c(`text`,{class:`climb-readout-sub`,x:680/2,y:240});u.appendChild(S);let C=c(`text`,{class:`climb-phase__text`,x:680/2,y:292});u.appendChild(C);function w(e,i){if(!i)return;let{phase:a,i:o,dp:s}=i,c=a===`done`;g.forEach((e,t)=>{let i=[`climb-cell`];(a===`init`?t<=1:t<=(c?n:o-1))?i.push(s[t]>r?`is-over`:`is-fresh`):i.push(`is-ghost`),e.g.setAttribute(`class`,i.join(` `))});let l=c?n:o,u=s[l],d=u>r;x.textContent=`ways(${l}) = ${u}`,x.setAttribute(`class`,`climb-readout ${d?`is-bad`:``}`),S.textContent=d?`> int32 上限 ${r} —— Java 的 int 在这一阶就已经是负数了`:`<= int32 上限 ${r}，还装得下`,S.setAttribute(`class`,`climb-readout-sub ${d?`is-bad`:``}`),a===`init`?(p.textContent=`起点`,m.textContent=`ways(0)=1 · ways(1)=1`,h.textContent=``):c?(p.textContent=`${n} 阶`,m.textContent=`int64 也只能撑到 ways(91)`,h.textContent=`ways(${n}) = ${u}`):(p.textContent=`第 ${l} 阶`,m.textContent=d?`装不下了`:`还能装下`,h.textContent=`ways(${l}) = ${u}`),h.setAttribute(`class`,`climb-banner__val ${d?`is-bad`:``}`),C.textContent=c?`int64 撑到 ways(91)；ways(92) 就爆 —— JS 的 Number 更早，ways(78) 起丢整数精度。`:`增长是乘性的（约 1.618 倍每阶）—— 类型宽度是线性的，追不上。`,Z(t,i.desc)}return{svgRoot:l,paint:w}}function Eh(e,t,n,r){if(!e||e.dataset[r]===`1`)return{destroy(){}};e.dataset[r]=`1`,xh();let i=vh(t),a=document.createElement(`div`);a.className=`viz climb`;let o=document.createElement(`div`);o.className=`viz__stage`,a.appendChild(o);let s=Sh(),c=n===`fill`?wh(i,s):Th(i,s);return o.appendChild(c.svgRoot),Ch(a,e,s,i,(e,t)=>c.paint(e,t),t,r)}function Dh(e,t={}){return Eh(e,t,`fill`,`climbMounted`)}function Oh(e,t={}){return Eh(e,{n:50,int32Limit:2147483647,...t},`overflow`,`climbOverMounted`)}var kh=6;function Ah(e={}){let t=Number.isInteger(e.n)&&e.n>=2?e.n:kh,n=[],r=new Map,i=0,a=(e,t,o)=>{let s=r.get(e)||0;r.set(e,s+1);let c=e<2;c&&(i+=1),n.push({idx:n.length,value:e,depth:t,path:o,dup:s>0,leaf:c,ord:s,distinct:r.size}),e>=2&&(a(e-1,t+1,o+`L`),a(e-2,t+1,o+`R`))};a(t,0,``);let o=[],s=0;for(let e of n)e.dup&&(s+=1),o.push({phase:`call`,n:t,node:e,revealed:n.slice(0,e.idx+1),stackPath:e.path,calls:e.idx+1,dupCalls:s,distinct:e.distinct,answer:null,done:!1,desc:``});o.push({phase:`done`,n:t,node:null,revealed:n.slice(),stackPath:``,calls:n.length,dupCalls:s,distinct:r.size,leaves:i,answer:null,done:!0,desc:``});for(let e=0;e<o.length;e+=1){let a=o[e];if(a.phase===`done`){a.desc=`整棵递归树 ${n.length} 个节点、${i} 个叶子（叶子数 = ways(${t})）。其中只有 ${r.size} 个不同的 k —— f(2) 被从头算了 ${r.get(2)||0} 次，f(0) ${r.get(0)||0} 次。记忆化之后，同样的信息只需要 ${t+1} 个格子、${t+1} 次加法。`;continue}let{value:s,depth:c,dup:l,idx:u,ord:d}=a.node;a.desc=l?`第 ${u+1} 次调用 f(${s}) —— 这是第 ${d+1} 次算它，前 ${d} 次全白算：它下面挂着一整棵相同的子树，每次都要重长一遍。`:`第 ${u+1} 次调用 f(${s})（深度 ${c}）。`+(s>=2?`它要先等 f(${s-1}) 和 f(${s-2}) 回来。`:`叶子：直接返回 1。`)}return o}var jh=`climbrec-styles`,Mh=620,Nh=`
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
`;function Ph(){if(document.getElementById(jh))return;let e=document.createElement(`style`);e.id=jh,e.textContent=Nh,document.head.appendChild(e)}function Fh(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function Ih(e){let t=[],n=0,r=(e,i,a)=>{let o=t.length;return t.push({idx:o,value:e,depth:i,parent:a,x:0,y:0,col:null}),e>=2?(r(e-1,i+1,o),r(e-2,i+1,o)):(t[o].col=n,n+=1),o};r(e,0,-1);let i=e=>{let n=t[e];if(n.col!==null)return n.col;let r=t.filter(t=>t.parent===e);return n.col=(i(r[0].idx)+i(r[1].idx))/2,n.col};i(0);let a=n,o=Math.max(30,Math.min(48,620/a)),s=Math.min(70,340/Math.max(1,Math.max(...t.map(e=>e.depth)))),c=Math.max(11,Math.min(17,o/2.9));for(let e of t)e.x=30+e.col*o+o/2,e.y=108+e.depth*s;return{nodes:t,W:680,R:c,treeBottom:108+Math.max(...t.map(e=>e.depth))*s+c,leafCount:a,LEAF_STEP:o}}function Lh(e,t={}){if(!e||e.dataset.climbRecMounted===`1`)return{destroy(){}};e.dataset.climbRecMounted=`1`,Ph();let n=Ah(t),r=n[0],i=Ih(r.n),a=new Map(i.nodes.map(e=>[e.idx,e])),o=i.W,s=i.treeBottom+34,c=s+26,l=c+30,u=l+22,d=document.createElement(`div`);d.className=`viz climbrec`;let f=document.createElement(`div`);f.className=`viz__stage`,d.appendChild(f);let p=Fh(),m=Y,h=m(`svg`,{class:`viz__svg climbrec__svg`,viewBox:`0 0 ${o} ${u}`,role:`img`,"aria-label":`爬楼梯 朴素递归树展开动画`}),g=m(`g`,{class:`climbrec-edges`}),_=m(`g`,{class:`climbrec-nodes`}),v=m(`g`,{class:`climbrec-labels`});h.appendChild(g),h.appendChild(_),h.appendChild(v),f.appendChild(h);let y=m(`text`,{class:`climbrec-note`,x:30,y:22});y.textContent=`f(k) = f(k-1) + f(k-2)，不带记忆化 —— 前序 DFS 的真实执行顺序`,v.appendChild(y),v.appendChild(m(`rect`,{class:`climbrec-banner__box`,x:30,y:38,width:o-60,height:40,rx:9}));let b=m(`text`,{class:`climbrec-banner__seg`,x:46,y:58}),x=m(`text`,{class:`climbrec-banner__seg`,x:176,y:58}),S=m(`text`,{class:`climbrec-banner__val`,x:o-46,y:58});v.appendChild(b),v.appendChild(x),v.appendChild(S);let C=i.nodes.map(e=>{let t=m(`path`,{class:`climbrec-edge`,d:``});return g.appendChild(t),t}),w=i.nodes.map(e=>{let t=m(`g`,{class:`climbrec-node`}),n=m(`circle`,{class:`climbrec-node__circle`,cx:e.x,cy:e.y,r:i.R}),r=m(`text`,{class:`climbrec-node__text`,x:e.x,y:e.y,style:`font-size: ${Math.round(i.R*1.15)}px`});r.textContent=String(e.value);let a=m(`circle`,{class:`climbrec-node__ring`,cx:e.x,cy:e.y,r:i.R+5});return t.appendChild(n),t.appendChild(r),_.appendChild(t),a.remove(),v.appendChild(a),{g:t,circle:n,text:r,ring:a}}),T=m(`text`,{class:`climbrec-stats`,x:o/2,y:s});v.appendChild(T);let E=m(`text`,{class:`climbrec-stack`,x:30,y:c});v.appendChild(E);let D=m(`text`,{class:`climbrec-phase__text`,x:o/2,y:l});v.appendChild(D);function O(e,t){if(!t)return;let n=t.phase===`done`,o=t.node;C.forEach((e,n)=>{let r=i.nodes[n],o=r.parent>=0&&t.revealed.length>r.parent,s=t.revealed.length>n;if(e.classList.toggle(`is-on`,o&&s),o&&s){let t=a.get(r.parent);e.setAttribute(`d`,`M ${t.x} ${t.y+i.R} L ${r.x} ${r.y-i.R}`)}}),w.forEach((e,n)=>{let r=t.revealed.length>n,i=[`climbrec-node`];if(r){i.push(`is-on`);let e=t.revealed[n];i.push(e.dup?`is-dup`:`is-new`),o&&n===o.idx&&i.push(`is-cur`)}e.g.setAttribute(`class`,i.join(` `)),e.ring.classList.remove(`is-on`)}),o&&w[o.idx].ring.classList.add(`is-on`);let s=T;if(s.textContent=`已调用 ${t.calls} 次，其中重复 ${t.dupCalls} 次，不同的 k 只有 ${t.distinct} 个`,o){let e=[r.n],t=r.n;for(let n of o.path)t+=n===`L`?-1:-2,e.push(t);E.textContent=`调用栈：${e.join(` -> `)}`,E.setAttribute(`opacity`,`1`)}else E.setAttribute(`opacity`,`0`);n?(b.textContent=`f(${r.n}) 展开`,x.textContent=`${t.calls} 个节点里只有 ${t.distinct} 个不同的 k`,S.textContent=`重复 ${t.dupCalls} 次`):(b.textContent=`第 ${t.calls} 次调用`,x.textContent=o&&o.dup?`f(${o.value}) 是重复子问题`:`f(${o?o.value:``}) 第一次出现`,S.textContent=`重复 ${t.dupCalls} 次`),D.textContent=n?`加一个 memo 数组，同样的信息只需要 n+1 个格子 —— 这就是从 2^n 到 O(n) 的全部内容。`:`每棵重复的子树都要从头重长一遍 —— 计数是乘性的，这就是 2^n 的来源。`,Z(p,t.desc)}d.appendChild(p);let k=Q();d.appendChild(k.root),e.textContent=``,e.appendChild(d),X();let A=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,j=$({steps:n,controls:k,intervalMs:Mh,onRender:(e,t)=>O(e,t)});j.jumpTo(Math.trunc(t.initialStep)||0);let M=null;return t.autoplay!==!1&&!A&&typeof IntersectionObserver==`function`&&(M=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){M.disconnect(),M=null,j.play();return}},{threshold:.35}),M.observe(d)),{destroy(){M&&=(M.disconnect(),null),j.destroy(),e.textContent=``,delete e.dataset.climbRecMounted,document.getElementById(jh)?.remove()}}}function Rh(e,t={}){return Lh(e,t)}var zh=[3,4,5];function Bh(e){if(!Array.isArray(e)||e.length===0)return zh.slice();let t=e.map(e=>Number(e));return t.every(e=>Number.isInteger(e)&&e>=0)?t:zh.slice()}function Vh(e,t){if(t===0)return null;let n=0;for(let e=0;e<31;e+=1)t>>e&1&&(n=e);for(let r=0;r<e.length;r+=1)if(e[r]>>n&1)return{idx:r,bit:n,newVal:e[r]^t};return null}function Hh(e={}){let t=Bh(e.piles),n=t.length,r=[],i=(e,i)=>{r.push({phase:e,piles:t.slice(),n,run:null,x:null,move:null,result:null,resultXor:null,answer:null,done:!1,desc:``,...i})};i(`init`,{desc:`开局 ${n} 堆：(${t.join(`, `)})。轮流从某一堆取任意正数个，拿到最后一个石子的人胜。判断先手能不能必胜，靠的不是搜索，是一个数：把所有堆异或起来。`});let a=0;for(let e=0;e<n;e+=1)a^=t[e],i(`xor`,{i:e,run:a,x:e===n-1?a:null,desc:`异或第 ${e+1} 堆：${t[e]}（二进制 ${t[e].toString(2).padStart(4,`0`)}），累计异或 = ${a}。`});let o=a;if(o===0)return i(`done`,{x:0,answer:!1,resultXor:0,done:!0,desc:`异或结果是 0 —— 这是必败态。后手只要每一步都照着镜像走（你动哪堆，他就把那堆改成让异或回到 0），先手无论怎么取，异或都会重新变成非 0。所以先手必败。`}),r;let s=Vh(t,o);i(`pick`,{x:o,move:s,desc:`异或结果 x = ${o}（二进制 ${o.toString(2)}）。制胜一步的找法：取 x 的最高置位 bit ${s.bit}，找一堆在这一位上为 1 的石子 —— 第 ${s.idx+1} 堆（${t[s.idx]}）就是。把它改成 ${t[s.idx]} ^ ${o} = ${s.newVal}。`});let c=t.slice();c[s.idx]=s.newVal;let l=c.reduce((e,t)=>e^t,0);return i(`take`,{x:o,move:s,result:c,resultXor:l,desc:`从第 ${s.idx+1} 堆取走 ${t[s.idx]-s.newVal} 个，剩下 ${s.newVal} 个。新局面 (${c.join(`, `)}) 的异或 = ${l} —— 必败态交到后手手里。这就是「后手怎么走都赢不了」的数学表述。`}),i(`done`,{x:o,move:s,result:c,resultXor:l,answer:!0,done:!0,desc:`先手必胜。整个论证只有两句话：异或非 0 时存在一步走到异或为 0 的局面；而异或为 0 时任何一步都会走到异或非 0。循环归纳，必胜。`}),r}var Uh=`nim-styles`,Wh=`
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
`;function Gh(){if(document.getElementById(Uh))return;let e=document.createElement(`style`);e.id=Uh,e.textContent=Wh,document.head.appendChild(e)}function Kh(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function qh(e,t={}){if(!e||e.dataset.nimMounted===`1`)return{destroy(){}};e.dataset.nimMounted=`1`,Gh();let n=Hh(t),{n:r,piles:i}=n[0],a=Math.max(56,Math.min(132,(560-(r-1)*12)/r)),o=(680-(r*a+(r-1)*12))/2,s=e=>o+e*(a+12)+a/2,c=Y,l=c(`svg`,{class:`viz__svg nim__svg`,viewBox:`0 0 680 414`,role:`img`,"aria-label":`Nim 博弈 先手必胜判定动画`}),u=c(`g`,{class:`nim-marks`}),d=c(`g`,{class:`nim-cells`});l.appendChild(u),l.appendChild(d);let f=c(`text`,{class:`nim-note`,x:30,y:22});f.textContent=`Nim 博弈：把所有堆异或起来 —— 非 0 先手必胜，0 先手必败`,u.appendChild(f),u.appendChild(c(`rect`,{class:`nim-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let p=c(`text`,{class:`nim-banner__seg`,x:46,y:58}),m=c(`text`,{class:`nim-banner__seg`,x:196,y:58}),h=c(`text`,{class:`nim-banner__val`,x:634,y:58});u.appendChild(p),u.appendChild(m),u.appendChild(h);let g=c(`text`,{class:`nim-note`,x:o-14,y:151});g.textContent=`各堆`,u.appendChild(g);let _=[];for(let e=0;e<r;e+=1){let t=c(`g`,{class:`nim-pile`});t.appendChild(c(`rect`,{class:`nim-pile__box`,x:s(e)-a/2,y:116,width:a,height:70,rx:8}));let n=c(`text`,{class:`nim-pile__val`,x:s(e),y:144});n.textContent=String(i[e]);let r=c(`text`,{class:`nim-pile__bin`,x:s(e),y:172});r.textContent=i[e].toString(2).padStart(4,`0`),t.appendChild(n),t.appendChild(r),d.appendChild(t),_.push({g:t,val:n,bin:r})}let v=c(`text`,{class:`nim-note`,x:o-14,y:226});v.textContent=`累计异或`,u.appendChild(v);let y=[];for(let e=0;e<r;e+=1){let t=c(`g`,{class:`nim-run is-off`});t.appendChild(c(`rect`,{class:`nim-run__box`,x:s(e)-a/2,y:208,width:a,height:36,rx:7}));let n=c(`text`,{class:`nim-run__val`,x:s(e),y:226});t.appendChild(n),d.appendChild(t),y.push({g:t,val:n})}let b=c(`rect`,{class:`nim-move__box nim-move`,x:60,y:262,width:560,height:52,rx:10}),x=c(`text`,{class:`nim-move__text`,x:680/2,y:288});u.appendChild(b),u.appendChild(x);let S=c(`rect`,{class:`nim-ans__box`,x:60,y:338,width:560,height:38,rx:10}),C=c(`text`,{class:`nim-ans__text`,x:680/2,y:357});u.appendChild(S),u.appendChild(C);let w=c(`text`,{class:`nim-phase__text`,x:680/2,y:392});u.appendChild(w);function T(e,t){if(!t)return;let{phase:a,x:o,move:s,result:c,answer:l}=t,u=a===`done`;_.forEach((e,t)=>{let n=[`nim-pile`];s&&t===s.idx&&(a===`pick`||a===`take`||u)&&n.push(`is-target`),c&&(a===`take`||u)&&n.push(`is-done`),e.g.setAttribute(`class`,n.join(` `)),e.val.textContent=c&&(a===`take`||u)&&t===s.idx?String(c[t]):String(i[t]),e.bin.textContent=(c&&(a===`take`||u)?c:i)[t].toString(2).padStart(4,`0`)}),y.forEach((e,i)=>{let s=[`nim-run`];(a===`xor`?i<=t.i:a!==`init`)?(s.push(`is-on`),e.val.textContent=String(n[i+1].run)):(s.push(`is-off`),e.val.textContent=``),i===r-1&&o!==null&&o===0&&s.push(`is-zero`),e.g.setAttribute(`class`,s.join(` `))}),s?(b.classList.remove(`is-off`),x.classList.remove(`is-off`),x.textContent=a===`take`||u?`制胜一手：第 ${s.idx+1} 堆 ${i[s.idx]} 个 取走 ${i[s.idx]-s.newVal} 个 -> 剩 ${s.newVal} 个，异或回到 0`:`制胜一手：取 x 的最高位 bit ${s.bit}，第 ${s.idx+1} 堆 ${i[s.idx]} 改成 ${s.newVal}`,x.setAttribute(`class`,`nim-move__text`)):(b.classList.add(`is-off`),x.classList.add(`is-off`),x.textContent=``);let d=l===!0;C.textContent=u?d?`先手必胜 —— 异或 ${o} 非 0，一定有一手把局面变成必败态`:`先手必败 —— 异或为 0，后手镜像应战即可`:``,S.setAttribute(`class`,`nim-ans__box ${u&&!d?`is-lose`:``}`),C.setAttribute(`class`,`nim-ans__text ${u&&!d?`is-lose`:``}`),a===`init`?(p.textContent=`开局`,m.textContent=`${r} 堆石子`,h.textContent=`(${i.join(`, `)})`):a===`xor`?(p.textContent=`异或第 ${t.i+1} 堆`,m.textContent=`${i[t.i]} = ${i[t.i].toString(2)}`,h.textContent=`累计 = ${t.run}`):a===`pick`?(p.textContent=`x = ${o}`,m.textContent=`最高置位 bit ${s.bit}`,h.textContent=`改第 ${s.idx+1} 堆`):a===`take`?(p.textContent=`取石子`,m.textContent=`第 ${s.idx+1} 堆 -> ${s.newVal}`,h.textContent=`异或 = 0`):(p.textContent=`结论`,m.textContent=d?`先手必胜`:`先手必败`,h.textContent=d?`x = ${o}`:`x = 0`),w.textContent=u?d?`异或非 0 -> 有制胜一手；异或为 0 -> 任何一步都送给对手非 0。归纳即得 Bouton 定理。`:`后手的策略：每次把先手刚动过的那堆，改成让全场异或回到 0。`:a===`xor`?`异或的妙处：它把 N 堆压成一个数，而「能不能一步走到 0」只看这一个数。`:`制胜一手的找法是构造性的 —— 不是搜索，是直接算。`,Z(E,t.desc)}let E=Kh(),D=document.createElement(`div`);D.className=`viz nim`;let O=document.createElement(`div`);O.className=`viz__stage`,O.appendChild(l),D.appendChild(O),D.appendChild(E);let k=Q();D.appendChild(k.root),e.textContent=``,e.appendChild(D),X();let A=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,j=$({steps:n,controls:k,intervalMs:900,onRender:T});j.jumpTo(Math.trunc(t.initialStep)||0);let M=null;return t.autoplay!==!1&&!A&&typeof IntersectionObserver==`function`&&(M=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){M.disconnect(),M=null,j.play();return}},{threshold:.35}),M.observe(D)),{destroy(){M&&=(M.disconnect(),null),j.destroy(),e.textContent=``,delete e.dataset.nimMounted,document.getElementById(Uh)?.remove()}}}function Jh(e,t={}){return qh(e,t)}var Yh=[5,3,4,5];function Xh(e){if(!Array.isArray(e)||e.length===0)return Yh.slice();let t=e.map(e=>Number(e));return t.every(e=>Number.isInteger(e)&&e>0)?t:Yh.slice()}function Zh(e={}){let t=Xh(e.piles),n=t.length,r=[],i=0,a=0;for(let e=0;e<n;e+=1)e%2==0?a+=t[e]:i+=t[e];let o=a>=i?`even`:`odd`,s=o===`even`?`left`:`right`,c=o===`even`?0:1,l=[],u=0,d=n-1,f=0,p=0,m=0;for(;u<=d;){let e;e=f===0?u%2===c?`left`:`right`:u===d?`left`:t[d]>t[u]?`right`:`left`;let n=e===`left`?u:d,r=t[n];f===0?(p+=r,l.push({who:`alex`,end:e,idx:n,val:r,alex:p,lee:m}),e===`left`?u+=1:--d):(m+=r,l.push({who:`lee`,end:e,idx:n,val:r,alex:p,lee:m}),e===`left`?u+=1:--d),f=1-f}let h=(e,c)=>{r.push({phase:e,piles:t.slice(),n,oddSum:i,evenSum:a,target:o,firstEnd:s,moves:[],alex:0,lee:0,answer:null,done:!1,desc:``,...c})};h(`init`,{desc:`一排 ${n} 堆石子，两人轮流只能从头部或尾部取一整堆，Alex 先手，堆数是偶数。问 Alex 有没有必胜策略。答案是必胜，而且不需要算 DP —— 开局站一次队就定了。`}),h(`parity`,{desc:`按原始下标分两队：偶数位 ${t.filter((e,t)=>t%2==0).join(` + `)} = ${a}，奇数位 ${t.filter((e,t)=>t%2==1).join(` + `)} = ${i}。Alex 取左端，之后就只能拿偶数位；取右端就只能拿奇数位 —— 所以取大的那一队（${o===`even`?`偶数位`:`奇数位`}），第一步取${s===`left`?`左`:`右`}端来锁定。`});for(let e=0;e<l.length;e+=1){let t=l[e];h(`take`,{moves:l.slice(0,e+1),alex:t.alex,lee:t.lee,desc:`${t.who===`alex`?`Alex`:`Lee`} 从${t.end===`left`?`左`:`右`}端取走 ${t.val}（原下标 ${t.idx}，${t.idx%2==0?`偶数位`:`奇数位`}）。比分 Alex ${t.alex} : ${t.lee} Lee。`+(t.who===`lee`?`注意 Lee 不管怎么取，剩下的两端都还是 Alex 锁定那一队的下标。`:`这一步把 Alex 锁死在${o===`even`?`偶数位`:`奇数位`}这一队。`)})}return h(`done`,{moves:l.slice(),alex:l[l.length-1].alex,lee:l[l.length-1].lee,answer:!0,done:!0,desc:`终局 Alex ${p} : ${m} Lee —— 先手必胜。关键不在算得准，而在**开局就放弃一半的石子**：堆数为偶数时，先手第一次取哪一端，就把自己钉死在一条奇偶带上，选和大的那条即可。堆数为奇数时这个 trick 失效，必须老老实实上区间 DP。`}),r}var Qh=`lc877-styles`,$h=`
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
`;function eg(){if(document.getElementById(Qh))return;let e=document.createElement(`style`);e.id=Qh,e.textContent=$h,document.head.appendChild(e)}function tg(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function ng(e,t={}){if(!e||e.dataset.lc877Mounted===`1`)return{destroy(){}};e.dataset.lc877Mounted=`1`,eg();let n=Zh(t),{n:r,piles:i}=n[0],a=Math.max(64,Math.min(124,(560-(r-1)*14)/r)),o=(680-(r*a+(r-1)*14))/2,s=e=>o+e*(a+14)+a/2,c=Y,l=c(`svg`,{class:`viz__svg lc877__svg`,viewBox:`0 0 680 402`,role:`img`,"aria-label":`石子游戏 奇偶位站队动画`}),u=c(`g`,{class:`lc877-marks`}),d=c(`g`,{class:`lc877-cells`});l.appendChild(u),l.appendChild(d);let f=c(`text`,{class:`lc877-note`,x:30,y:22});f.textContent=`偶数堆时先手必胜：开局按原始下标的奇偶站队，取和大的那一队`,u.appendChild(f),u.appendChild(c(`rect`,{class:`lc877-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let p=c(`text`,{class:`lc877-banner__seg`,x:46,y:58}),m=c(`text`,{class:`lc877-banner__seg`,x:176,y:58}),h=c(`text`,{class:`lc877-banner__val`,x:634,y:58});u.appendChild(p),u.appendChild(m),u.appendChild(h);let g=[];for(let e=0;e<r;e+=1){let t=c(`g`,{class:`lc877-pile ${e%2==0?`is-even`:`is-odd`}`});t.appendChild(c(`rect`,{class:`lc877-pile__box`,x:s(e)-a/2,y:118,width:a,height:68,rx:8}));let n=c(`text`,{class:`lc877-pile__val`,x:s(e),y:146});n.textContent=String(i[e]);let r=c(`text`,{class:`lc877-pile__idx`,x:s(e),y:172});r.textContent=`#${e} ${e%2==0?`偶`:`奇`}`;let o=c(`text`,{class:`lc877-pile__mark`,x:s(e),y:172});t.appendChild(n),t.appendChild(r),t.appendChild(o),d.appendChild(t),g.push({g:t,val:n,idx:r,mark:o})}let _=(e,t,n)=>{let r=c(`g`,{class:`lc877-chip ${n?`is-win`:``}`});r.appendChild(c(`rect`,{class:`lc877-chip__box`,x:e,y:212,width:190,height:40,rx:9}));let i=c(`text`,{class:`lc877-chip__text`,x:e+190/2,y:232});return i.textContent=t,r.appendChild(i),u.appendChild(r),{g:r,t:i}},v=_(135,``,!1),y=_(355,``,!1),b=c(`rect`,{class:`lc877-score__box`,x:60,y:274,width:560,height:36,rx:10}),x=c(`text`,{class:`lc877-score__text`,x:680/2,y:292});u.appendChild(b),u.appendChild(x);let S=c(`rect`,{class:`lc877-ans__box`,x:60,y:332,width:560,height:38,rx:10}),C=c(`text`,{class:`lc877-ans__text`,x:680/2,y:351});u.appendChild(S),u.appendChild(C);let w=c(`text`,{class:`lc877-phase__text`,x:680/2,y:380});u.appendChild(w);function T(e,t){if(!t)return;let{phase:n,moves:a,alex:o,lee:s,evenSum:c,oddSum:l,target:u}=t,d=n===`done`,f=n!==`init`,_=new Map;for(let e of a)_.set(e.idx,e);if(g.forEach((e,t)=>{let n=[`lc877-pile ${t%2==0?`is-even`:`is-odd`}`],r=_.get(t);r?(n.push(`is-taken`),e.mark.textContent=r.who===`alex`?`A ${r.val}`:`L ${r.val}`,e.mark.setAttribute(`class`,`lc877-pile__mark is-on ${r.who===`alex`?`is-alex`:`is-lee`}`)):(e.mark.textContent=``,e.mark.setAttribute(`class`,`lc877-pile__mark`)),e.g.setAttribute(`class`,n.join(` `))}),v.g.setAttribute(`opacity`,f?`1`:`0`),y.g.setAttribute(`opacity`,f?`1`:`0`),v.t.textContent=`偶数位和 = ${c}`,y.t.textContent=`奇数位和 = ${l}`,v.g.setAttribute(`class`,`lc877-chip ${u===`even`?`is-win`:``}`),y.g.setAttribute(`class`,`lc877-chip ${u===`odd`?`is-win`:``}`),x.textContent=a.length?`Alex ${o}  :  ${s} Lee`:`Alex 先手 —— 还没开局`,C.textContent=d?`先手必胜 —— Alex ${o} : ${s} Lee`:``,S.setAttribute(`class`,`lc877-ans__box`),C.setAttribute(`class`,`lc877-ans__text`),n===`init`)p.textContent=`开局`,m.textContent=`${r} 堆（偶数）`,h.textContent=`(${i.join(`, `)})`;else if(n===`parity`)p.textContent=`站队`,m.textContent=`Alex 锁定${u===`even`?`偶数位`:`奇数位`}`,h.textContent=`第一步取${u===`even`?`左`:`右`}端`;else if(n===`take`){let e=a[a.length-1];p.textContent=`${e.who===`alex`?`Alex`:`Lee`} 取${e.end===`left`?`左`:`右`}端`,m.textContent=`原下标 ${e.idx}（${e.idx%2==0?`偶`:`奇`}）`,h.textContent=`拿到 ${e.val}`}else p.textContent=`终局`,m.textContent=`Alex ${o} : ${s} Lee`,h.textContent=`先手必胜`;w.textContent=d?`堆数为偶数时这个 trick 必胜；堆数是奇数时两端奇偶不同，必须老老实实上区间 DP。`:n===`parity`?`取左端 -> 只能拿原始偶数位；取右端 -> 只能拿奇数位。所以第一次取哪一端，就是选队。`:`Lee 取走一端后，剩下两端必然一个是 Alex 队的下标、一个不是 —— Alex 永远有得选。`,Z(E,t.desc)}let E=tg(),D=document.createElement(`div`);D.className=`viz lc877`;let O=document.createElement(`div`);O.className=`viz__stage`,O.appendChild(l),D.appendChild(O),D.appendChild(E);let k=Q();D.appendChild(k.root),e.textContent=``,e.appendChild(D),X();let A=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,j=$({steps:n,controls:k,intervalMs:900,onRender:T});j.jumpTo(Math.trunc(t.initialStep)||0);let M=null;return t.autoplay!==!1&&!A&&typeof IntersectionObserver==`function`&&(M=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){M.disconnect(),M=null,j.play();return}},{threshold:.35}),M.observe(D)),{destroy(){M&&=(M.disconnect(),null),j.destroy(),e.textContent=``,delete e.dataset.lc877Mounted,document.getElementById(Qh)?.remove()}}}function rg(e,t={}){return ng(e,t)}var ig=[2,8,3,9,4,7];function ag(e){if(!Array.isArray(e)||e.length<2)return ig.slice();let t=e.map(e=>Number(e));return t.every(e=>Number.isFinite(e))&&t.length>=2&&t.length<=24?t:ig.slice()}function og(e){let t=[0],n=[0];for(let r of e)t.push(t[t.length-1]+r),n.push(n[n.length-1]+r*r);return{s1:t,s2:n}}function sg(e,t,n,r){let i=r-n;if(i<=0)return{len:0,mean:0,var:0};let a=t.s1[r]-t.s1[n],o=t.s2[r]-t.s2[n];return{len:i,mean:a/i,var:Math.max(0,o/i-a/i*(a/i))}}function cg(e){return Number.isInteger(e)?String(e):e.toFixed(2)}function lg(e={}){let t=ag(e.seq),n=t.length,r=og(t),i=[],a=-1,o=-1/0,s=(e,r,s)=>{i.push({phase:e,i:r,seq:t.slice(),n,meanL:null,varL:null,meanR:null,varR:null,total:null,best:o,bestI:a,answer:null,done:!1,desc:``,...s})},c=sg(t,r,0,n);s(`init`,null,{desc:`序列 (${t.join(`, `)})，切成 2 段，使两段方差之和最大。先记住两个工具：一阶前缀和给区间和，二阶前缀和给区间平方和 —— 两者一减，均值与方差都是 O(1)。`});for(let e=1;e<n;e+=1){let i=sg(t,r,0,e),c=sg(t,r,e,n),l=i.var+c.var;l>o&&(o=l,a=e),s(`scan`,e,{meanL:i.mean,varL:i.var,meanR:c.mean,varR:c.var,total:l,desc:`切点 ${e}：左边 (${t.slice(0,e).join(`, `)}) 均值 ${cg(i.mean)}、方差 ${cg(i.var)}；右边 (${t.slice(e).join(`, `)}) 均值 ${cg(c.mean)}、方差 ${cg(c.var)}；合计 ${cg(l)}${l===o&&e===a?` —— 目前最优`:``}。`})}return s(`done`,null,{best:o,bestI:a,answer:o,done:!0,desc:`最优切点 = ${a}，两段方差和 = ${cg(o)}。对比一下：不切（k = 1）时方差只有 ${cg(c.var)} —— **切成两段反而更大**，因为两段的均值（${cg(sg(t,r,0,a).mean)} 与 ${cg(sg(t,r,a,n).mean)}）差得远，各自的离散被单独放大了。切成 k 段就是把这个扫描叠 k 层：dp[i][j] = max_{k} dp[k][j-1] + var(k+1..i)。`}),i}var ug=`varpart-styles`,dg=`
.varpart { display: flex; flex-direction: column; gap: 14px; }
.varpart__svg { width: 100%; height: auto; display: block; }

.varpart-note {
  fill: var(--varpart-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.varpart-banner__box {
  fill: var(--varpart-banner, #f4f3ef);
  stroke: var(--varpart-line, #c3c9c2);
  stroke-width: 1.5;
}
.varpart-banner__seg {
  fill: var(--varpart-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.varpart-banner__val {
  fill: var(--varpart-gold, #c2872f);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.varpart-axis { stroke: var(--varpart-line, #c3c9c2); stroke-width: 1.5; }
.varpart-bar { fill: var(--varpart-dim, #9aa39c); }
.varpart-bar.is-left { fill: var(--varpart-ok, #3f6b57); }
.varpart-bar.is-right { fill: var(--varpart-hot, #a45f45); }
.varpart-bar__val {
  fill: var(--varpart-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.varpart-mean {
  stroke-width: 2.5;
  stroke-dasharray: 6 4;
  opacity: 0;
}
.varpart-mean.is-on { opacity: 1; }
.varpart-mean.is-left { stroke: var(--varpart-ok, #3f6b57); }
.varpart-mean.is-right { stroke: var(--varpart-hot, #a45f45); }
.varpart-mean__label {
  font-size: 11px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
  /* 标签会压在比均值高的柱子上 —— 白描边保证可读 */
  paint-order: stroke;
  stroke: var(--varpart-page, #ffffff);
  stroke-width: 4px;
  stroke-linejoin: round;
}
.varpart-mean__label.is-on { opacity: 1; }
.varpart-mean__label.is-left { fill: var(--varpart-ok, #3f6b57); }
.varpart-mean__label.is-right { fill: var(--varpart-hot, #a45f45); }

.varpart-cut { stroke: var(--varpart-gold, #c2872f); stroke-width: 2.5; stroke-dasharray: 5 4; opacity: 0; }
.varpart-cut.is-on { opacity: 1; }
.varpart-cut__label {
  fill: var(--varpart-gold, #c2872f);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.varpart-cut__label.is-on { opacity: 1; }

.varpart-stat__box {
  fill: var(--varpart-fill, #ffffff);
  stroke: var(--varpart-line, #c3c9c2);
  stroke-width: 1.5;
}
.varpart-stat__text {
  fill: var(--varpart-ink, #1f2a24);
  font-size: 13.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.varpart-stat__text.is-left { fill: var(--varpart-ok, #3f6b57); }
.varpart-stat__text.is-right { fill: var(--varpart-hot, #a45f45); }
.varpart-stat.is-best .varpart-stat__box {
  stroke: var(--varpart-gold, #c2872f);
  stroke-width: 3;
  fill: var(--varpart-gold-fill, #fdf3e3);
}
.varpart-stat.is-best .varpart-stat__text { fill: var(--varpart-gold, #c2872f); }
.varpart-stat.is-off { opacity: 0.35; }

.varpart-phase__text {
  fill: var(--varpart-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function fg(){if(document.getElementById(ug))return;let e=document.createElement(`style`);e.id=ug,e.textContent=dg,document.head.appendChild(e)}function pg(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function mg(e,t={}){if(!e||e.dataset.varpartMounted===`1`)return{destroy(){}};e.dataset.varpartMounted=`1`,fg();let n=lg(t),{n:r,seq:i}=n[0],a=Math.max(...i.map(e=>Math.abs(e))),o=a===0?1:128/a,s=Math.max(20,Math.min(64,(540-(r-1)*12)/r)),c=r*s+(r-1)*12,l=(680-c)/2,u=e=>l+e*(s+12),d=e=>u(e)+s/2,f=Y,p=f(`svg`,{class:`viz__svg varpart__svg`,viewBox:`0 0 680 390`,role:`img`,"aria-label":`序列切分方差和最大 扫描动画`}),m=f(`g`,{class:`varpart-marks`}),h=f(`g`,{class:`varpart-cells`}),g=f(`g`,{class:`varpart-top`});p.appendChild(m),p.appendChild(h),p.appendChild(g);let _=f(`text`,{class:`varpart-note`,x:30,y:22});_.textContent=`切成 2 段使方差和最大：枚举切点，一阶/二阶前缀和 O(1) 算每段方差`,m.appendChild(_),m.appendChild(f(`rect`,{class:`varpart-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let v=f(`text`,{class:`varpart-banner__seg`,x:46,y:58}),y=f(`text`,{class:`varpart-banner__seg`,x:186,y:58}),b=f(`text`,{class:`varpart-banner__val`,x:634,y:58});m.appendChild(v),m.appendChild(y),m.appendChild(b),m.appendChild(f(`line`,{class:`varpart-axis`,x1:l-16,y1:248,x2:l+c+16,y2:248}));let x=[];for(let e=0;e<r;e+=1){let t=Math.max(2,Math.abs(i[e])*o),n=i[e]>=0?248-t:248,r=f(`g`,{});r.appendChild(f(`rect`,{class:`varpart-bar`,x:u(e),y:n,width:s,height:t,rx:3}));let a=f(`text`,{class:`varpart-bar__val`,x:d(e),y:n-11});a.textContent=String(i[e]),r.appendChild(a),h.appendChild(r),x.push({g:r,rect:r.firstChild,val:a})}let S=f(`line`,{class:`varpart-mean is-left`,x1:0,y1:0,x2:0,y2:0}),C=f(`line`,{class:`varpart-mean is-right`,x1:0,y1:0,x2:0,y2:0}),w=e=>{let t=f(`text`,{class:`varpart-mean__label ${e}`,x:0,y:0,fill:`none`,stroke:`#ffffff`,"stroke-width":4,"stroke-linejoin":`round`}),n=f(`text`,{class:`varpart-mean__label ${e}`,x:0,y:0});return g.appendChild(t),g.appendChild(n),{halo:t,text:n}},T=w(`is-left`),E=w(`is-right`),D=f(`line`,{class:`varpart-cut`,x1:0,y1:106,x2:0,y2:248}),O=f(`text`,{class:`varpart-cut__label`,x:0,y:96});m.appendChild(S),m.appendChild(C),m.appendChild(D),m.appendChild(O);let k=(e,t)=>{let n=f(`g`,{class:`varpart-stat ${t}`});n.appendChild(f(`rect`,{class:`varpart-stat__box`,x:e,y:292,width:168,height:42,rx:9}));let r=f(`text`,{class:`varpart-stat__text ${t}`,x:e+168/2,y:313});return n.appendChild(r),m.appendChild(n),{g:n,t:r}},A=k(68,`is-left`),j=k(256,`is-right`),M=k(444,``),N=f(`text`,{class:`varpart-phase__text`,x:680/2,y:368});m.appendChild(N);function P(e,t){if(!t)return;let{phase:a,i:f}=t,p=a===`done`;if(a===`scan`||p){let e=p?t.bestI:f,a=u(e)-6,m=u(e)+s+6,h=e=>248-e*o,g=p?n[t.bestI].meanL:t.meanL,_=p?n[t.bestI].meanR:t.meanR;x.forEach((t,n)=>{let r=[];n<e?r.push(`is-left`):n>=e&&r.push(`is-right`),t.rect.setAttribute(`class`,`varpart-bar ${r.join(` `)}`)}),S.setAttribute(`x1`,l-8),S.setAttribute(`x2`,a),S.setAttribute(`y1`,h(g)),S.setAttribute(`y2`,h(g)),S.classList.add(`is-on`),C.setAttribute(`x1`,m),C.setAttribute(`x2`,l+c+8),C.setAttribute(`y1`,h(_)),C.setAttribute(`y2`,h(_)),C.classList.add(`is-on`);let v=(e,t)=>{let n=e;for(let r=e;r<t;r+=1)i[r]>i[n]&&(n=r);return n};T.halo.setAttribute(`x`,d(v(0,e))),T.halo.setAttribute(`y`,h(g)-13),T.halo.textContent=`左段均值 ${g.toFixed(2)}`,T.halo.classList.add(`is-on`),T.text.setAttribute(`x`,d(v(0,e))),T.text.setAttribute(`y`,h(g)-13),T.text.textContent=`左段均值 ${g.toFixed(2)}`,T.text.classList.add(`is-on`),E.halo.setAttribute(`x`,d(v(e,r))),E.halo.setAttribute(`y`,h(_)-13),E.halo.textContent=`右段均值 ${_.toFixed(2)}`,E.halo.classList.add(`is-on`),E.text.setAttribute(`x`,d(v(e,r))),E.text.setAttribute(`y`,h(_)-13),E.text.textContent=`右段均值 ${_.toFixed(2)}`,E.text.classList.add(`is-on`),D.setAttribute(`x1`,u(e)-6),D.setAttribute(`x2`,u(e)-6),D.classList.add(`is-on`),O.setAttribute(`x`,u(e)-6),O.textContent=`切点 ${e}`,O.classList.add(`is-on`);let y=p?n[t.bestI].varL:t.varL,b=p?n[t.bestI].varR:t.varR,w=p?t.best:t.total;A.t.textContent=`左段方差 ${y.toFixed(2)}`,j.t.textContent=`右段方差 ${b.toFixed(2)}`,M.t.textContent=`合计 ${w.toFixed(2)}`;let k=p||t.bestI===t.i&&t.total===t.best;M.g.setAttribute(`class`,`varpart-stat ${k?`is-best`:``}`),A.g.setAttribute(`class`,`varpart-stat is-left`),j.g.setAttribute(`class`,`varpart-stat is-right`)}else x.forEach(e=>e.rect.setAttribute(`class`,`varpart-bar`)),S.classList.remove(`is-on`),C.classList.remove(`is-on`),T.halo.classList.remove(`is-on`),T.text.classList.remove(`is-on`),E.halo.classList.remove(`is-on`),E.text.classList.remove(`is-on`),D.classList.remove(`is-on`),O.classList.remove(`is-on`),A.t.textContent=``,j.t.textContent=``,M.t.textContent=``;a===`init`?(v.textContent=`序列`,y.textContent=`切成 2 段`,b.textContent=`(${i.join(`, `)})`):a===`scan`?(v.textContent=`切点 ${f}`,y.textContent=`左 ${t.meanL.toFixed(2)} / 右 ${t.meanR.toFixed(2)}`,b.textContent=`合计 ${t.total.toFixed(2)}`):(v.textContent=`最优切点 ${t.bestI}`,y.textContent=`两段方差和最大`,b.textContent=t.best.toFixed(2)),N.textContent=p?`切成 k 段就是把这个扫描叠 k 层：dp[i][j] = max_{k} dp[k][j-1] + var(k+1..i)，总复杂度 O(n^2 k)。`:`均值线拉得越开、各段内部越散，两段方差和越大 —— 所以最优切点常常不在「看起来最该切」的地方。`,Z(F,t.desc)}let F=pg(),I=document.createElement(`div`);I.className=`viz varpart`;let L=document.createElement(`div`);L.className=`viz__stage`,L.appendChild(p),I.appendChild(L),I.appendChild(F);let R=Q();I.appendChild(R.root),e.textContent=``,e.appendChild(I),X();let z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,B=$({steps:n,controls:R,intervalMs:900,onRender:P});B.jumpTo(Math.trunc(t.initialStep)||0);let V=null;return t.autoplay!==!1&&!z&&typeof IntersectionObserver==`function`&&(V=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){V.disconnect(),V=null,B.play();return}},{threshold:.35}),V.observe(I)),{destroy(){V&&=(V.disconnect(),null),B.destroy(),e.textContent=``,delete e.dataset.varpartMounted,document.getElementById(ug)?.remove()}}}function hg(e,t={}){return mg(e,t)}var gg={rdlu:[`right`,`down`,`left`,`up`],drul:[`down`,`right`,`up`,`left`]},_g={right:`向右`,down:`向下`,left:`向左`,up:`向上`};function vg(e,t){return Number.isInteger(e)&&e>0&&e<=8?e:t}function yg(e={}){let t=vg(e.rows,3),n=vg(e.cols,3),r=e.mode===`drul`?`drul`:`rdlu`,i=Array.from({length:t},()=>Array(n).fill(0)),a=[],o=t*n,s=0,c=t-1,l=0,u=n-1,d=1,f=(e,f,p,m)=>{a.push({phase:e,mode:r,rows:t,cols:n,grid:i.map(e=>e.slice()),cur:f?{...f}:null,dir:p,value:null,filled:d-1,total:o,bounds:{top:s,bottom:c,left:l,right:u},answer:null,done:!1,desc:``,...m})};f(`init`,null,null,{desc:`${t} x ${n} 的矩阵，从 1 开始按「${gg[r].map(e=>_g[e]).join(`、`)}」的顺序螺旋填入。每一格填一次，共 ${o} 个数 —— 所以时间下界就是 O(${t} x ${n})。`});let p=(e,t,n,r)=>{i[e][t]=d,f(`fill`,{r:e,c:t},n,{value:d,bounds:r,desc:`第 ${d} 个数填在 (${e}, ${t})，方向${_g[n]}。本圈边界：上 ${r.top} / 下 ${r.bottom} / 左 ${r.left} / 右 ${r.right}。`}),d+=1};for(;s<=c&&l<=u;){let e={top:s,bottom:c,left:l,right:u};if(r===`rdlu`){for(let t=l;t<=u;t+=1)p(s,t,`right`,e);s+=1;for(let t=s;t<=c;t+=1)p(t,u,`down`,e);if(--u,s<=c){for(let t=u;t>=l;--t)p(c,t,`left`,e);--c}if(l<=u){for(let t=c;t>=s;--t)p(t,l,`up`,e);l+=1}}else{for(let t=s;t<=c;t+=1)p(t,l,`down`,e);l+=1;for(let t=l;t<=u;t+=1)p(c,t,`right`,e);if(--c,l<=u){for(let t=c;t>=s;--t)p(t,u,`up`,e);--u}if(s<=c){for(let t=u;t>=l;--t)p(s,t,`left`,e);s+=1}}}return f(`done`,null,null,{filled:o,answer:i,done:!0,desc:`填完了。一共 ${o} 格、${o} 次写入，时间 O(${t} x ${n})、额外空间 O(1)（输出数组不算）—— 已经触到下限，因为输出本身就是 ${o} 个数。`}),a}var bg=`spiral-styles`,xg=760,Sg=`
.spiral { display: flex; flex-direction: column; gap: 14px; }
.spiral__svg { width: 100%; height: auto; display: block; }

.spiral-note {
  fill: var(--spiral-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.spiral-banner__box {
  fill: var(--spiral-banner, #f4f3ef);
  stroke: var(--spiral-line, #c3c9c2);
  stroke-width: 1.5;
}
.spiral-banner__seg {
  fill: var(--spiral-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.spiral-banner__val {
  fill: var(--spiral-gold, #c2872f);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ---- 网格 ---- */
.spiral-cell__box {
  fill: var(--spiral-fill, #ffffff);
  stroke: var(--spiral-line, #c3c9c2);
  stroke-width: 1.5;
}
.spiral-cell__val {
  fill: var(--spiral-ink, #1f2a24);
  font-size: 20px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.spiral-cell.is-ghost .spiral-cell__box { fill: none; stroke-dasharray: 3 3; stroke-width: 1.2; }
.spiral-cell.is-ghost .spiral-cell__val { fill: none; }
.spiral-cell.is-fresh .spiral-cell__box {
  fill: var(--spiral-gold-fill, #fdf3e3);
  stroke: var(--spiral-gold, #c2872f);
  stroke-width: 3;
}
.spiral-cell.is-fresh .spiral-cell__val { fill: var(--spiral-gold, #c2872f); }
.spiral-cell.is-cur .spiral-cell__box { stroke: var(--spiral-hot, #a45f45); stroke-width: 3.5; }
.spiral-cell.is-cur .spiral-cell__val { fill: var(--spiral-hot, #a45f45); }

/* 本圈边界虚线框 */
.spiral-ring {
  fill: none;
  stroke: var(--spiral-ok, #3f6b57);
  stroke-width: 2;
  stroke-dasharray: 6 4;
  opacity: 0;
}
.spiral-ring.is-on { opacity: 0.85; }

/* 方向箭头 */
.spiral-arrow {
  fill: var(--spiral-hot, #a45f45);
  opacity: 0;
}
.spiral-arrow.is-on { opacity: 1; }

/* ---- 右侧面板 ---- */
.spiral-panel__box {
  fill: var(--spiral-banner, #f4f3ef);
  stroke: var(--spiral-line, #c3c9c2);
  stroke-width: 1.5;
}
.spiral-panel__title {
  fill: var(--spiral-muted, #657168);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.spiral-panel__row {
  fill: var(--spiral-ink, #1f2a24);
  font-size: 13.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.spiral-dir {
  fill: var(--spiral-fill, #ffffff);
  stroke: var(--spiral-line, #c3c9c2);
  stroke-width: 1.5;
}
.spiral-dir__text {
  fill: var(--spiral-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.spiral-dir.is-cur .spiral-dir__box {
  fill: var(--spiral-hot, #a45f45);
  stroke: var(--spiral-hot, #a45f45);
}
.spiral-dir.is-cur .spiral-dir__text { fill: #ffffff; }
.spiral-dir.is-done .spiral-dir__box { fill: var(--spiral-ok-fill, #eef5f1); }
.spiral-dir.is-done .spiral-dir__text { fill: var(--spiral-ok, #3f6b57); }

.spiral-ans__box {
  fill: var(--spiral-ok-fill, #eef5f1);
  stroke: var(--spiral-ok, #3f6b57);
  stroke-width: 2.5;
  opacity: 0;
}
.spiral-ans__box.is-on { opacity: 1; }
.spiral-ans__text {
  fill: var(--spiral-ok, #3f6b57);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.spiral-ans__text.is-on { opacity: 1; }
.spiral-phase__text {
  fill: var(--spiral-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function Cg(){if(document.getElementById(bg))return;let e=document.createElement(`style`);e.id=bg,e.textContent=Sg,document.head.appendChild(e)}function wg(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function Tg(e,t,n,r){if(!e||e.dataset[r]===`1`)return{destroy(){}};e.dataset[r]=`1`,Cg();let i=yg({...t,mode:n}),{rows:a,cols:o}=i[0],s=Math.max(20,Math.min(88,(356-(o-1)*8)/o,(296-(a-1)*8)/a)),c=o*s+(o-1)*8,l=a*s+(a-1)*8,u=46+Math.max(0,(356-c)/2),d=112+Math.max(0,(296-l)/2),f=e=>u+e*(s+8)+s/2,p=e=>d+e*(s+8)+s/2,m=d+l,h=Math.max(m,408)+46,g=h+22,_=Y,v=_(`svg`,{class:`viz__svg spiral__svg`,viewBox:`0 0 680 ${g}`,role:`img`,"aria-label":`螺旋填数推演动画`}),y=_(`g`,{class:`spiral-rings`}),b=_(`g`,{class:`spiral-cells`}),x=_(`g`,{class:`spiral-top`});v.appendChild(y),v.appendChild(b),v.appendChild(x);let S=_(`text`,{class:`spiral-note`,x:30,y:22});S.textContent=`方向顺序：${gg[n].map(e=>_g[e]).join(` -> `)}`,x.appendChild(S),x.appendChild(_(`rect`,{class:`spiral-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let C=_(`text`,{class:`spiral-banner__seg`,x:46,y:58}),w=_(`text`,{class:`spiral-banner__seg`,x:176,y:58}),T=_(`text`,{class:`spiral-banner__val`,x:634,y:58});x.appendChild(C),x.appendChild(w),x.appendChild(T);let E=_(`rect`,{class:`spiral-ring`,x:0,y:0,width:0,height:0,rx:6});y.appendChild(E);let D=[];for(let e=0;e<a;e+=1){let t=[];for(let n=0;n<o;n+=1){let r=_(`g`,{class:`spiral-cell`});r.appendChild(_(`rect`,{class:`spiral-cell__box`,x:f(n)-s/2,y:p(e)-s/2,width:s,height:s,rx:6}));let i=_(`text`,{class:`spiral-cell__val`,x:f(n),y:p(e)});r.appendChild(i),b.appendChild(r),t.push({g:r,val:i})}D.push(t)}let O=_(`path`,{class:`spiral-arrow`,d:``});x.appendChild(O);let k=(e,t)=>{let{r:n,c:r}=t,i=f(r),a=p(n),o=s/2+9,c;c=e===`right`?`${i+o},${a} ${i+o-7},${a-7} ${i+o-7},${a+7}`:e===`left`?`${i-o},${a} ${i-o+7},${a-7} ${i-o+7},${a+7}`:e===`down`?`${i},${a+o} ${i-7},${a+o-7} ${i+7},${a+o-7}`:`${i},${a-o} ${i-7},${a-o+7} ${i+7},${a-o+7}`,O.setAttribute(`d`,`M ${c} Z`),O.classList.add(`is-on`)},A=_(`rect`,{class:`spiral-panel__box`,x:432,y:112,width:218,height:232,rx:10});x.appendChild(A);let j=_(`text`,{class:`spiral-panel__title`,x:446,y:130});j.textContent=`方向序列（本轮循环）`,x.appendChild(j);let M={};gg[n].forEach((e,t)=>{let n=446+t%2*94,r=144+Math.floor(t/2)*40,i=_(`g`,{class:`spiral-dir`});i.appendChild(_(`rect`,{class:`spiral-dir__box`,x:n,y:r,width:84,height:30,rx:7}));let a=_(`text`,{class:`spiral-dir__text`,x:n+84/2,y:r+30/2});a.textContent=_g[e],i.appendChild(a),x.appendChild(i),M[e]={g:i,t:a}});let N=_(`text`,{class:`spiral-panel__row`,x:446,y:240}),P=_(`text`,{class:`spiral-panel__row`,x:446,y:264}),F=_(`text`,{class:`spiral-panel__row`,x:446,y:288}),I=_(`text`,{class:`spiral-panel__row`,x:446,y:312});x.appendChild(N),x.appendChild(P),x.appendChild(F),x.appendChild(I);let L=_(`rect`,{class:`spiral-ans__box`,x:432,y:358,width:218,height:38,rx:10}),R=_(`text`,{class:`spiral-ans__text`,x:541,y:377});x.appendChild(L),x.appendChild(R);let z=_(`text`,{class:`spiral-phase__text`,x:680/2,y:h});x.appendChild(z);function B(e,t){if(!t)return;let{phase:n,cur:r,dir:i,grid:c,bounds:l,filled:u,total:d}=t,m=n===`done`,h=n===`fill`;if(D.forEach((e,t)=>{e.forEach((e,n)=>{let i=[`spiral-cell`];c[t][n]===0?i.push(`is-ghost`):h&&r&&r.r===t&&r.c===n&&i.push(`is-cur`),e.g.setAttribute(`class`,i.join(` `)),e.val.textContent=c[t][n]===0?``:String(c[t][n])})}),h||n===`init`){let e=l;e.top<=e.bottom&&e.left<=e.right&&(E.classList.add(`is-on`),E.setAttribute(`x`,f(e.left)-s/2-5),E.setAttribute(`y`,p(e.top)-s/2-5),E.setAttribute(`width`,(e.right-e.left)*(s+8)+s+10),E.setAttribute(`height`,(e.bottom-e.top)*(s+8)+s+10))}else E.classList.remove(`is-on`);h&&i?k(i,r):O.classList.remove(`is-on`);for(let e of Object.keys(M)){let t=[`spiral-dir`];h&&e===i?t.push(`is-cur`):m&&t.push(`is-done`),M[e].g.setAttribute(`class`,t.join(` `))}N.textContent=h?`方向：${_g[i]}`:`方向：待开始`,P.textContent=`已填 ${u} / ${d}`,F.textContent=`上 ${l.top}  下 ${l.bottom}`,I.textContent=`左 ${l.left}  右 ${l.right}`,R.textContent=m?`完成：${d} 格全部填满`:``,L.setAttribute(`class`,`spiral-ans__box ${m?`is-on`:``}`),R.setAttribute(`class`,`spiral-ans__text ${m?`is-on`:``}`),n===`init`?(C.textContent=`开局`,w.textContent=`${a} x ${o} 矩阵，从 1 开始`,T.textContent=`方向序列见右`):h?(C.textContent=`第 ${t.value} 个数`,w.textContent=`填在 (${r.r}, ${r.c}) · ${_g[i]}`,T.textContent=`${u} / ${d}`):(C.textContent=`填完`,w.textContent=`${d} 次写入，无重复无遗漏`,T.textContent=`O(${a} x ${o})`),z.textContent=m?`四边界收缩：每圈走完把对应边界内推一格；第三、四条边的守卫是防非方阵重复的关键。`:h?`当前格 (${r.r}, ${r.c})。撞到未填区域的边缘就按方向序列转向 —— 四个方向循环一轮就是一圈。`:`每一格只填一次，所以 O(M x N) 就是下限；边界收缩法额外空间 O(1)。`,Z(V,t.desc)}let V=wg(),H=document.createElement(`div`);H.className=`viz spiral`;let U=document.createElement(`div`);U.className=`viz__stage`,U.appendChild(v),H.appendChild(U),H.appendChild(V);let ee=Q();H.appendChild(ee.root),e.textContent=``,e.appendChild(H),X();let te=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,W=$({steps:i,controls:ee,intervalMs:xg,onRender:B});W.jumpTo(Math.trunc(t.initialStep)||0);let G=null;return t.autoplay!==!1&&!te&&typeof IntersectionObserver==`function`&&(G=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){G.disconnect(),G=null,W.play();return}},{threshold:.35}),G.observe(H)),{destroy(){G&&=(G.disconnect(),null),W.destroy(),e.textContent=``,delete e.dataset[r],document.getElementById(bg)?.remove()}}}function Eg(e,t={}){return Tg(e,t,`rdlu`,`spiralMounted`)}function Dg(e,t={}){return Tg(e,t,`drul`,`spiralCcwMounted`)}var Og=[23,7,45,12,45,8,33,12,19,5,45,27,12,9,33,16,41,3],kg=10;function Ag(e){if(!Array.isArray(e)||e.length===0)return Og.slice();let t=e.map(e=>Number(e));return t.every(e=>Number.isFinite(e))&&t.length<=24?t:Og.slice()}function jg(e={}){let t=Ag(e.nums),n=Number.isInteger(e.k)&&e.k>0&&e.k<=t.length?e.k:Math.min(kg,t.length),r=e.dedupe===!0,i=t.length,a=[],o=new Set,s=new Set,c=[],l=[],u={idx:-1,val:null,action:null},d=(e,o)=>{l.push({phase:e,idx:u.idx,val:u.val,action:u.action,heap:a.slice(),siftPath:[],rejected:c.slice(),rejectedCount:c.length,nums:t.slice(),n:i,k:n,dedupe:r,distinct:s.size,solvable:a.length===n,answer:a.length===n?a[0]:null,done:!1,desc:``,...o})},f=e=>{let t=e,n=[t];for(;t>0;){let e=t-1>>1;if(a[e]<=a[t])break;let r=a[e];a[e]=a[t],a[t]=r,t=e,n.push(t)}return n},p=e=>{let t=e,n=[t];for(;;){let e=2*t+1,r=e+1,i=t;if(e<a.length&&a[e]<a[i]&&(i=e),r<a.length&&a[r]<a[i]&&(i=r),i===t)break;let o=a[i];a[i]=a[t],a[t]=o,t=i,n.push(t)}return n};d(`init`,{desc:`${i} 个元素里找第 ${n} 大${r?`（去重口径）`:`（不去重口径）`}。做法是维护一个只有 ${n} 个位置的最小堆：堆顶永远是「当前第 ${n} 大」。比堆顶小的直接丢，比堆顶大的挤掉堆顶再往下调整。`});for(let e=0;e<i;e+=1){let i=t[e];if(u={idx:e,val:i},s.add(i),r&&o.has(i)){u.action=`dup`,c.push(i),d(`reject`,{desc:`${i} 已经在堆里了 —— 去重口径下重复值只算一次，直接丢弃。这也是为什么去重版要额外记一个「堆里有哪些值」的集合：只靠「大于堆顶」判断，会把堆顶换成两个相同的值。`});continue}if(a.length<n){u.action=`fill`,a.push(i),o.add(i);let e=f(a.length-1);d(`fill`,{siftPath:e,desc:`堆还没满（${a.length}/${n}），${i} 直接入堆，向上调整到位置 ${e[e.length-1]}。当前堆顶 = ${a[0]}。`});continue}if(i>a[0]){u.action=`accept`,o.delete(a[0]),o.add(i);let e=a[0];a[0]=i;let t=p(0);d(`accept`,{siftPath:t,desc:`${i} > 堆顶 ${e} —— 挤掉它，${i} 坐到堆顶后向下调整到位置 ${t[t.length-1]}。新堆顶 = ${a[0]}（这就是新的第 ${n} 大）。`});continue}u.action=`reject`,c.push(i),d(`reject`,{desc:`${i} <= 堆顶 ${a[0]} —— 连前 ${n} 大都进不去，直接丢掉，堆不动。`})}let m=a.slice().sort((e,t)=>e-t),h=a.length===n;return d(`done`,{action:null,answer:h?a[0]:null,finalHeap:m,desc:h?`扫完 ${i} 个元素，堆里留下最大的 ${n} 个${r?`（去重后）`:``}：(${m.slice().reverse().join(`, `)})。堆顶 ${a[0]} 就是第 ${n} 大。`+(r?`同一组数据按不去重口径算是另一个数 —— 差别全在口径。`:`改回去重口径，同一组数据的答案会变小 —— 见第二个动画。`)+` 时间 O(n log ${n})、空间 O(${n})。`:`扫完 ${i} 个元素，堆里只有 ${a.length} 个值，凑不齐 ${n} 个${r?`（全体只有 ${s.size} 个不同值）`:``} —— 本题无解，应抛异常。`}),l}var Mg=`kth-styles`,Ng=780,Pg=`
.kth { display: flex; flex-direction: column; gap: 14px; }
.kth__svg { width: 100%; height: auto; display: block; }

.kth-note {
  fill: var(--kth-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.kth-banner__box {
  fill: var(--kth-banner, #f4f3ef);
  stroke: var(--kth-line, #c3c9c2);
  stroke-width: 1.5;
}
.kth-banner__seg {
  fill: var(--kth-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.kth-banner__val {
  fill: var(--kth-gold, #c2872f);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ---- 输入行 ---- */
.kth-cell__box {
  fill: var(--kth-fill, #ffffff);
  stroke: var(--kth-line, #c3c9c2);
  stroke-width: 1.5;
}
.kth-cell__val {
  fill: var(--kth-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 三态互斥，在 JS 里选好，不交给层叠顺序（坑 V） */
.kth-cell.is-ghost .kth-cell__box { fill: none; stroke-dasharray: 3 3; stroke-width: 1.2; }
.kth-cell.is-ghost .kth-cell__val { fill: var(--kth-dim, #9aa39c); }
.kth-cell.is-out .kth-cell__box { fill: var(--kth-dim-fill, #f6f5f1); stroke: var(--kth-dim, #9aa39c); }
.kth-cell.is-out .kth-cell__val { fill: var(--kth-dim, #9aa39c); }
.kth-cell.is-cur .kth-cell__box { stroke: var(--kth-hot, #a45f45); stroke-width: 3; }
.kth-cell.is-cur .kth-cell__val { fill: var(--kth-hot, #a45f45); }
.kth-cell.is-in .kth-cell__box { fill: var(--kth-ok-fill, #eef5f1); stroke: var(--kth-ok, #3f6b57); stroke-width: 2; }
.kth-cell.is-in .kth-cell__val { fill: var(--kth-ok, #3f6b57); }

/* ---- 堆行 ---- */
.kth-heap__box {
  fill: var(--kth-fill, #ffffff);
  stroke: var(--kth-ok, #3f6b57);
  stroke-width: 2;
}
.kth-heap__val {
  fill: var(--kth-ok, #3f6b57);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.kth-heap__idx {
  fill: var(--kth-dim, #9aa39c);
  font-size: 9.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 堆顶 = 当前第 K 大 */
.kth-heap.is-top .kth-heap__box {
  fill: var(--kth-gold-fill, #fdf3e3);
  stroke: var(--kth-gold, #c2872f);
  stroke-width: 3;
}
.kth-heap.is-top .kth-heap__val { fill: var(--kth-gold, #c2872f); }
/* sift 路径 */
.kth-heap.is-sift .kth-heap__box { stroke: var(--kth-hot, #a45f45); stroke-width: 3; }
.kth-heap.is-sift .kth-heap__val { fill: var(--kth-hot, #a45f45); }
.kth-heap.is-ghost .kth-heap__box { fill: none; stroke-dasharray: 3 3; stroke-width: 1.2; }
.kth-heap.is-ghost .kth-heap__val { fill: none; }
.kth-heap.is-ghost .kth-heap__idx { fill: none; }

.kth-label {
  fill: var(--kth-muted, #657168);
  font-size: 12px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.kth-hint {
  fill: var(--kth-muted, #657168);
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.kth-hint.is-hot { fill: var(--kth-hot, #a45f45); }

.kth-ans__box {
  fill: var(--kth-gold-fill, #fdf3e3);
  stroke: var(--kth-gold, #c2872f);
  stroke-width: 2.5;
  opacity: 0;
}
.kth-ans__box.is-on { opacity: 1; }
.kth-ans__box.is-none { fill: var(--kth-dim-fill, #f6f5f1); stroke: var(--kth-dim, #9aa39c); }
.kth-ans__text {
  fill: var(--kth-gold, #c2872f);
  font-size: 15.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.kth-ans__text.is-on { opacity: 1; }
.kth-ans__text.is-none { fill: var(--kth-muted, #657168); }

.kth-phase__text {
  fill: var(--kth-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function Fg(){if(document.getElementById(Mg))return;let e=document.createElement(`style`);e.id=Mg,e.textContent=Pg,document.head.appendChild(e)}function Ig(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function Lg(e,t,n,r){if(!e||e.dataset[r]===`1`)return{destroy(){}};e.dataset[r]=`1`,Fg();let i=jg({...t,dedupe:n}),a=i[0],{n:o,k:s}=a,c=o>16?3:5,l=Math.max(16,Math.min(30,(590-(o-1)*c)/o)),u=(680-(o*l+(o-1)*c))/2,d=e=>u+e*(l+c)+l/2,f=Math.max(24,Math.min(46,(550-(s-1)*6)/s)),p=(680-(s*f+(s-1)*6))/2,m=e=>p+e*(f+6)+f/2,h=Y,g=h(`svg`,{class:`viz__svg kth__svg`,viewBox:`0 0 680 384`,role:`img`,"aria-label":`第 K 大 最小堆扫描动画`}),_=h(`g`,{class:`kth-marks`}),v=h(`g`,{class:`kth-cells`});g.appendChild(_),g.appendChild(v);let y=h(`text`,{class:`kth-note`,x:30,y:22});y.textContent=n?`去重口径：distinct 值里第 ${s} 大 —— 重复值只算一次`:`不去重口径：降序排列后第 ${s} 个（下标 ${s-1}）`,_.appendChild(y),_.appendChild(h(`rect`,{class:`kth-banner__box`,x:30,y:38,width:620,height:40,rx:9}));let b=h(`text`,{class:`kth-banner__seg`,x:46,y:58}),x=h(`text`,{class:`kth-banner__seg`,x:196,y:58}),S=h(`text`,{class:`kth-banner__val`,x:634,y:58});_.appendChild(b),_.appendChild(x),_.appendChild(S);let C=h(`text`,{class:`kth-label`,x:u-12,y:143});C.textContent=`输入`,_.appendChild(C);let w=h(`text`,{class:`kth-label`,x:p-12,y:244});w.textContent=`堆`,_.appendChild(w);let T=[];for(let e=0;e<o;e+=1){let t=h(`g`,{class:`kth-cell`});t.appendChild(h(`rect`,{class:`kth-cell__box`,x:d(e)-l/2,y:118,width:l,height:50,rx:5}));let n=h(`text`,{class:`kth-cell__val`,x:d(e),y:143});n.textContent=String(a.nums[e]),t.appendChild(n),v.appendChild(t),T.push({g:t,val:n})}let E=[];for(let e=0;e<s;e+=1){let t=h(`g`,{class:`kth-heap`});t.appendChild(h(`rect`,{class:`kth-heap__box`,x:m(e)-f/2,y:218,width:f,height:52,rx:6}));let n=h(`text`,{class:`kth-heap__val`,x:m(e),y:238}),r=h(`text`,{class:`kth-heap__idx`,x:m(e),y:259});r.textContent=`#${e}`,t.appendChild(n),t.appendChild(r),v.appendChild(t),E.push({g:t,val:n})}let D=h(`text`,{class:`kth-hint`,x:680/2,y:296});_.appendChild(D);let O=h(`rect`,{class:`kth-ans__box`,x:60,y:320,width:560,height:38,rx:10}),k=h(`text`,{class:`kth-ans__text`,x:680/2,y:339});_.appendChild(O),_.appendChild(k);let A=h(`text`,{class:`kth-phase__text`,x:680/2,y:362});_.appendChild(A);let j={fill:`入堆（堆还没满）`,accept:`挤掉堆顶，换它`,reject:`小于堆顶，丢弃`,dup:`重复值，丢弃`};function M(e,t){if(!t)return;let{phase:r,idx:i,val:c,action:l,heap:u,siftPath:d,rejected:f,solvable:p,answer:m}=t,h=r===`done`,g=r===`reject`,_=new Set(d);T.forEach((e,t)=>{let n=[`kth-cell`];t>i?n.push(`is-ghost`):g&&t===i?n.push(`is-out`):t===i&&!h?n.push(`is-cur`):f.includes(a.nums[t])&&t<i?n.push(`is-out`):n.push(`is-in`),e.g.setAttribute(`class`,n.join(` `))}),E.forEach((e,t)=>{let n=[`kth-heap`];t>=u.length?n.push(`is-ghost`):(t===0&&n.push(`is-top`),_.has(t)&&n.push(`is-sift`)),e.g.setAttribute(`class`,n.join(` `)),e.val.textContent=t<u.length?String(u[t]):``}),D.textContent=h?``:`堆顶 = ${u.length?u[0]:`-`}（当前第 ${s} 大） · 已丢弃 ${f.length} 个`,D.setAttribute(`class`,`kth-hint ${r===`accept`?`is-hot`:``}`),O.setAttribute(`class`,`kth-ans__box ${h?p?`is-on`:`is-on is-none`:``}`),k.setAttribute(`class`,`kth-ans__text ${h?p?`is-on`:`is-on is-none`:``}`),k.textContent=h?p?`第 ${s} 大${n?`（去重）`:``} = ${m}`:`只有 ${u.length} 个不同值，凑不齐第 ${s} 大 —— 无解`:``,r===`init`?(b.textContent=`准备`,x.textContent=`size-${s} 最小堆`,S.textContent=`n = ${o}`):h?(b.textContent=`扫完`,x.textContent=p?`堆顶就是答案`:`无解`,S.textContent=p?String(m):`null`):(b.textContent=`第 ${i+1} 个`,x.textContent=j[l]||``,S.textContent=`${c} vs 堆顶 ${u.length>=s?u[0]:`-`}`),A.textContent=h?`每个元素最多进出堆一次：均摊 O(n log ${s})，k 固定时就是 O(n)；空间只用一个 size-${s} 的堆。`:r===`accept`?`大于堆顶才替换 —— 堆里始终是「到目前位置最大的 ${s} 个」，所以扫完堆顶就是第 ${s} 大。`:r===`reject`?`小于等于堆顶，连前 ${s} 大都进不去 —— 这是堆比排序省时间的地方：大部分元素被 O(1) 丢掉。`:`堆没满时直接入堆并向上调整；满了之后才需要比较。`,Z(N,t.desc)}let N=Ig(),P=document.createElement(`div`);P.className=`viz kth`;let F=document.createElement(`div`);F.className=`viz__stage`,F.appendChild(g),P.appendChild(F),P.appendChild(N);let I=Q();P.appendChild(I.root),e.textContent=``,e.appendChild(P),X();let L=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,R=$({steps:i,controls:I,intervalMs:Ng,onRender:M});R.jumpTo(Math.trunc(t.initialStep)||0);let z=null;return t.autoplay!==!1&&!L&&typeof IntersectionObserver==`function`&&(z=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){z.disconnect(),z=null,R.play();return}},{threshold:.35}),z.observe(P)),{destroy(){z&&=(z.disconnect(),null),R.destroy(),e.textContent=``,delete e.dataset[r],document.getElementById(Mg)?.remove()}}}function Rg(e,t={}){return Lg(e,t,!1,`kthMounted`)}function zg(e,t={}){return Lg(e,t,!0,`kthDupMounted`)}var Bg=1304,Vg=[`个位`,`十位`,`百位`,`千位`,`万位`,`十万位`,`百万位`,`千万位`,`亿位`,`十亿位`];function Hg(e={}){let t=Number.isInteger(e.n)&&e.n>=0&&e.n<=999999?e.n:Bg,n=String(t).split(``).map(Number),r=n.length,i=[],a=[],o=0,s={posIndex:-1,weight:0,higher:0,cur:0,lower:0,branch:null,contribution:null},c=(e,c)=>{a.push({phase:e,n:t,digits:n,posCount:r,posIndex:s.posIndex,posName:s.posIndex>=0?Vg[s.posIndex]:``,weight:s.weight,higher:s.higher,cur:s.cur,lower:s.lower,branch:s.branch,contribution:s.contribution,positions:i.map(e=>({...e})),total:o,done:e===`done`,desc:``,...c})};c(`init`,{desc:`统计 1 ~ ${t} 里数字 1 出现的总次数。n 共 ${r} 个数位，这套公式只扫 ${r} 轮，和逐个数字检查完全不是一个量级。做法：把每个数位单独拿出来数，某一位上 1 的个数只由「高于它的部分、当前位、低于它的部分」三件套决定。`});for(let e=0;e<r;e+=1){let n=10**e;if(n>t)break;let r=Math.floor(t/(n*10)),a=Math.floor(t/n)%10,l=t%n;s={posIndex:e,weight:n,higher:r,cur:a,lower:l,branch:null,contribution:null},c(`split`,{desc:`第 ${e+1} 个数位（${Vg[e]}，权值 ${n}）拆三件套：高于它的部分 ${r}，当前位 ${a}，低于它的部分 ${l}。`});let u=a===0?`zero`:a===1?`one`:`many`,d=u===`zero`?r*n:u===`one`?r*n+l+1:(r+1)*n;o+=d,i.push({posIndex:e,posName:Vg[e],weight:n,higher:r,cur:a,lower:l,branch:u,contribution:d}),s={posIndex:e,weight:n,higher:r,cur:a,lower:l,branch:u,contribution:d},c(`contribute`,{desc:`${u===`zero`?`当前位是 0：${Vg[e]}上每 ${n*10} 个数连出 ${n} 个 1，${r} 个完整大块给出 ${r*n} 个；当前块还没走到 1 那一截，一个不多给。`:u===`one`?`当前位是 1：正好踩在 1 那一截的起点。${r} 个完整大块给出 ${r*n} 个；当前块里从 1 开始一路数到 ${l}，又多出 ${l+1} 个。`:`当前位是 ${a}：1 那一截已经整个走完。${r} 个完整大块给出 ${r*n} 个；当前块也满额，再拿 ${n} 个。`}这一位合计 ${d}，累计 ${o}。`})}return c(`done`,{posIndex:-1,posName:``,weight:0,higher:0,cur:0,lower:0,branch:null,contribution:null,desc:i.length===0?`1 ~ 0 里一个整数都没有，答案就是 0 —— 公式同样适用，只是循环一次都不进。`:`${r} 个数位全部扫完：${i.map(e=>e.contribution).join(` + `)} = ${o}。这就是 1 ~ ${t} 中数字 1 出现的总次数。时间是 O(数位个数)，也就是 O(log n)：n 换成 21 亿也只要 10 轮。`}),a}var Ug=`d1-styles`,Wg=950,Gg=`
.d1 { display: flex; flex-direction: column; gap: 14px; }
.d1__svg { width: 100%; height: auto; display: block; }

.d1-note {
  fill: var(--d1-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.d1-banner__box {
  fill: var(--d1-banner, #f4f3ef);
  stroke: var(--d1-line, #c3c9c2);
  stroke-width: 1.5;
}
.d1-banner__seg {
  fill: var(--d1-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.d1-banner__val {
  fill: var(--d1-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-seclabel {
  fill: var(--d1-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}

/* ---- 数位条 ---- */
.d1-cell__box {
  fill: var(--d1-fill, #ffffff);
  stroke: var(--d1-line, #c3c9c2);
  stroke-width: 1.5;
}
.d1-cell__val {
  fill: var(--d1-ink, #1f2a24);
  font-size: 23px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-posname {
  fill: var(--d1-muted, #657168);
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1-weight {
  fill: var(--d1-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
}
/* 三段配色走 fill/stroke 两个通道（坑 V）：属于哪一段看填充，是不是当前位看描边 */
.d1-cell.is-hi .d1-cell__box { fill: var(--d1-hi-fill, #e9f0f6); stroke: var(--d1-hi, #3d6a8f); }
.d1-cell.is-hi .d1-cell__val { fill: var(--d1-hi, #3d6a8f); }
.d1-cell.is-low .d1-cell__box { fill: var(--d1-low-fill, #eaf3ee); stroke: var(--d1-low, #3f6b57); }
.d1-cell.is-low .d1-cell__val { fill: var(--d1-low, #3f6b57); }
.d1-cell.is-cur .d1-cell__box { fill: var(--d1-cur-fill, #f8ece5); stroke: var(--d1-cur, #a45f45); stroke-width: 3.2; }
.d1-cell.is-cur .d1-cell__val { fill: var(--d1-cur, #a45f45); }
.d1-cell.is-cur .d1-posname { fill: var(--d1-cur, #a45f45); font-weight: 700; }
.d1-cell.is-cur .d1-weight { fill: var(--d1-cur, #a45f45); }
.d1-cell.is-idle .d1-cell__val { fill: var(--d1-dim, #9aa39c); }

/* ---- 拆分等式 ---- */
/* 等号行含 × 和中文（权值），不能用 Consolas —— 走继承字体，逐字形回退 */
.d1-eq {
  fill: var(--d1-ink, #1f2a24);
  font-size: 14.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1-eq.is-generic { opacity: 0.55; }
.d1-eq .eq-hi { fill: var(--d1-hi, #3d6a8f); font-weight: 700; }
.d1-eq .eq-cur { fill: var(--d1-cur, #a45f45); font-weight: 700; }
.d1-eq .eq-low { fill: var(--d1-low, #3f6b57); font-weight: 700; }

/* ---- 三件套卡片 ---- */
.d1-card__box {
  fill: var(--d1-fill, #ffffff);
  stroke: var(--d1-line, #c3c9c2);
  stroke-width: 1.5;
}
.d1-card__label {
  fill: var(--d1-muted, #657168);
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1-card__val {
  fill: var(--d1-ink, #1f2a24);
  font-size: 21px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-card.is-hi .d1-card__box { stroke: var(--d1-hi, #3d6a8f); stroke-width: 2.2; }
.d1-card.is-hi .d1-card__val { fill: var(--d1-hi, #3d6a8f); }
.d1-card.is-cur .d1-card__box { stroke: var(--d1-cur, #a45f45); stroke-width: 2.6; fill: var(--d1-cur-fill, #f8ece5); }
.d1-card.is-cur .d1-card__val { fill: var(--d1-cur, #a45f45); }
.d1-card.is-low .d1-card__box { stroke: var(--d1-low, #3f6b57); stroke-width: 2.2; }
.d1-card.is-low .d1-card__val { fill: var(--d1-low, #3f6b57); }
.d1-card.is-idle .d1-card__box { stroke-dasharray: 4 4; }
.d1-card.is-idle .d1-card__val { fill: var(--d1-dim, #9aa39c); font-weight: 400; }

/* ---- 三分支表 ---- */
.d1-branch__box {
  fill: var(--d1-fill, #ffffff);
  stroke: var(--d1-line, #c3c9c2);
  stroke-width: 1.2;
}
.d1-branch__cond {
  fill: var(--d1-muted, #657168);
  font-size: 13px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-branch__formula {
  fill: var(--d1-ink, #1f2a24);
  font-size: 13.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.d1-branch__res {
  fill: var(--d1-dim, #9aa39c);
  font-size: 14px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-branch.is-on .d1-branch__box {
  fill: var(--d1-gold-fill, #fdf3e3);
  stroke: var(--d1-gold, #c2872f);
  stroke-width: 2.4;
}
.d1-branch.is-on .d1-branch__cond { fill: var(--d1-gold, #c2872f); }
.d1-branch.is-on .d1-branch__formula { font-weight: 700; }
.d1-branch.is-on .d1-branch__res { fill: var(--d1-gold, #c2872f); font-size: 15px; }

/* ---- 累计 chips ---- */
.d1-chip__box {
  fill: var(--d1-fill, #ffffff);
  stroke: var(--d1-line, #c3c9c2);
  stroke-width: 1.4;
}
.d1-chip__top {
  fill: var(--d1-muted, #657168);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1-chip__val {
  fill: var(--d1-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-chip.is-new .d1-chip__box { stroke: var(--d1-gold, #c2872f); stroke-width: 2.4; }
.d1-chip.is-new .d1-chip__val { fill: var(--d1-gold, #c2872f); }
.d1-chip.is-off { opacity: 0; }
.d1-total__box {
  fill: var(--d1-fill, #ffffff);
  stroke: var(--d1-line, #c3c9c2);
  stroke-width: 1.4;
}
.d1-total__label {
  fill: var(--d1-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1-total__val {
  fill: var(--d1-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-total.is-on .d1-total__box { fill: var(--d1-gold-fill, #fdf3e3); stroke: var(--d1-gold, #c2872f); stroke-width: 2.6; }
.d1-total.is-on .d1-total__label { fill: var(--d1-gold, #c2872f); }
.d1-total.is-on .d1-total__val { fill: var(--d1-gold, #c2872f); }

.d1-phasetext {
  fill: var(--d1-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
`;function Kg(){if(document.getElementById(Ug))return;let e=document.createElement(`style`);e.id=Ug,e.textContent=Gg,document.head.appendChild(e)}function qg(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}var Jg=680,Yg=20,Xg=36,Zg=40,Qg=98,$g=108,e_=48,t_=171,n_=186,r_=214,i_=232,a_=56,o_=310,s_=320,c_=30,l_=442,u_=46,d_=514,f_=532,p_=72,m_=18,h_=[{key:`zero`,cond:`cur = 0`,formula:`higher × weight`},{key:`one`,cond:`cur = 1`,formula:`higher × weight + lower + 1`},{key:`many`,cond:`cur > 1`,formula:`(higher + 1) × weight`}],g_={zero:`cur = 0，不满一个整块`,one:`cur = 1，踩在 1 那一截的起点`,many:`cur > 1，1 那一截已走完`};function __(e,t={}){if(!e||e.dataset.d1Mounted===`1`)return{destroy(){}};e.dataset.d1Mounted=`1`,Kg();let n=Hg(t),{n:r,digits:i,posCount:a}=n[0],o=Y,s=o(`svg`,{class:`viz__svg d1__svg`,viewBox:`0 0 ${Jg} ${f_}`,role:`img`,"aria-label":`1 到 n 中数字 1 出现次数 逐数位统计动画`}),c=o(`g`,{class:`d1-cells`}),l=o(`g`,{class:`d1-marks`});s.appendChild(c),s.appendChild(l);let u=o(`text`,{class:`d1-note`,x:30,y:Yg});u.textContent=`n = ${r} · 共 ${a} 个数位 · 从个位开始，一位一位地数`,l.appendChild(u),l.appendChild(o(`rect`,{class:`d1-banner__box`,x:30,y:Xg,width:Jg-60,height:Zg,rx:9}));let d=o(`text`,{class:`d1-banner__seg`,x:46,y:56}),f=o(`text`,{class:`d1-banner__seg`,x:236,y:56}),p=o(`text`,{class:`d1-banner__val`,x:Jg-46,y:56});l.append(d,f,p);let m=o(`text`,{class:`d1-seclabel`,x:30,y:Qg});m.textContent=`n 按位拆开（橙 = 当前位，蓝 = 高于它，绿 = 低于它）`,l.appendChild(m);let h=(Jg-(a*p_+(a-1)*m_))/2,g=[];for(let e=0;e<a;e+=1){let t=a-1-e,n=h+e*90+p_/2,r=o(`g`,{class:`d1-cell`});r.appendChild(o(`rect`,{class:`d1-cell__box`,x:n-p_/2,y:$g,width:p_,height:e_,rx:7}));let s=o(`text`,{class:`d1-cell__val`,x:n,y:132});s.textContent=String(i[e]);let l=o(`text`,{class:`d1-posname`,x:n,y:t_});l.textContent=[`个位`,`十位`,`百位`,`千位`,`万位`,`十万位`,`百万位`,`千万位`,`亿位`,`十亿位`][t];let u=o(`text`,{class:`d1-weight`,x:n,y:n_});u.textContent=`权值 ${10**t}`,r.append(s,l,u),c.appendChild(r),g.push({g:r,name:l,weight:u})}let _=o(`text`,{class:`d1-eq`,x:Jg/2,y:r_});l.appendChild(_);let v=(e,t)=>{let n=o(`tspan`,t?{class:t}:null);return n.textContent=e,n},y=e=>{if(_.textContent=``,e.weight>0)_.appendChild(v(`${e.n} = `)),_.appendChild(v(`${e.higher}`,`eq-hi`)),_.appendChild(v(` × ${e.weight*10} + `)),_.appendChild(v(`${e.cur}`,`eq-cur`)),_.appendChild(v(` × ${e.weight} + `)),_.appendChild(v(`${e.lower}`,`eq-low`));else{_.textContent=``,_.appendChild(v(`n = higher × (权值 × 10) + cur × 权值 + lower`)),_.setAttribute(`class`,`d1-eq is-generic`);return}_.setAttribute(`class`,`d1-eq`)},b=(Jg-580)/2,x=[{key:`hi`,label:`高于它的部分 higher`,field:`higher`},{key:`cur`,label:`当前位 cur`,field:`cur`},{key:`low`,label:`低于它的部分 lower`,field:`lower`}].map((e,t)=>{let n=b+t*202,r=o(`g`,{class:`d1-card`});r.appendChild(o(`rect`,{class:`d1-card__box`,x:n,y:i_,width:176,height:a_,rx:8}));let i=o(`text`,{class:`d1-card__label`,x:n+176/2,y:249});i.textContent=e.label;let a=o(`text`,{class:`d1-card__val`,x:n+176/2,y:271});return r.append(i,a),c.appendChild(r),{g:r,val:a,def:e}}),S=o(`text`,{class:`d1-seclabel`,x:30,y:o_});S.textContent=`三种情况，对号入座`,l.appendChild(S);let C=h_.map((e,t)=>{let n=s_+t*36,r=o(`g`,{class:`d1-branch`});r.appendChild(o(`rect`,{class:`d1-branch__box`,x:30,y:n,width:Jg-60,height:c_,rx:7}));let i=o(`text`,{class:`d1-branch__cond`,x:46,y:n+c_/2});i.textContent=e.cond;let a=o(`text`,{class:`d1-branch__formula`,x:140,y:n+c_/2});a.textContent=e.formula;let s=o(`text`,{class:`d1-branch__res`,x:Jg-46,y:n+c_/2});return r.append(i,a,s),c.appendChild(r),{g:r,res:s,def:e}}),w=Math.max(64,Math.min(120,(Jg-60-116-16-(a-1)*10)/a)),T=[];for(let e=0;e<a;e+=1){let t=30+e*(w+10),n=o(`g`,{class:`d1-chip is-off`});n.appendChild(o(`rect`,{class:`d1-chip__box`,x:t,y:l_,width:w,height:u_,rx:8}));let r=o(`text`,{class:`d1-chip__top`,x:t+w/2,y:456}),i=o(`text`,{class:`d1-chip__val`,x:t+w/2,y:474});n.append(r,i),c.appendChild(n),T.push({g:n,top:r,val:i})}let E=30+a*(w+10)-10+16,D=o(`g`,{class:`d1-total`});D.appendChild(o(`rect`,{class:`d1-total__box`,x:E,y:l_,width:116,height:u_,rx:8}));let O=o(`text`,{class:`d1-total__label`,x:E+116/2,y:457});O.textContent=`合计`;let k=o(`text`,{class:`d1-total__val`,x:E+116/2,y:475});D.append(O,k),c.appendChild(D);let A=o(`text`,{class:`d1-phasetext`,x:Jg/2,y:d_});l.appendChild(A);let j={init:`每一位单独数：这一位上 1 的个数，只由「高于它、当前位、低于它」三个值决定。`,split:`higher 框住当前位之上，lower 框住当前位之下 —— 它们决定当前位能看见多少。`,zero:`cur = 0：当前块连 1 那一截的边都没碰到，只拿完整大块那份。`,one:`cur = 1：当前块正好从 1 开始，一路数到 lower，共 lower + 1 个。`,many:`cur > 1：1 那一截整个落在当前块内，当前块也按满额算。`,done:`时间是 O(数位个数)，也就是 O(log n)：n 从 1304 换成 21 亿，只是从 4 轮变成 10 轮。`},M=e=>e.branch===`zero`?`${e.higher} × ${e.weight} = ${e.contribution}`:e.branch===`one`?`${e.higher} × ${e.weight} + ${e.lower} + 1 = ${e.contribution}`:`(${e.higher} + 1) × ${e.weight} = ${e.contribution}`;function N(e,t){if(!t)return;let{phase:n,posCount:i,posIndex:a,weight:o}=t,s=o>0,c=s?i-1-a:-1;g.forEach((e,t)=>{let n=[`d1-cell`];s?t===c?n.push(`is-cur`):t<c?n.push(`is-hi`):n.push(`is-low`):n.push(`is-idle`),e.g.setAttribute(`class`,n.join(` `))}),y(t),x.forEach(({g:e,val:n,def:r})=>{let i=[`d1-card`];s?i.push(`is-${r.key}`):i.push(`is-idle`),e.setAttribute(`class`,i.join(` `)),n.textContent=s?String(t[r.field]):`–`}),C.forEach(({g:e,res:r,def:i})=>{let a=n===`contribute`&&t.branch===i.key;e.setAttribute(`class`,`d1-branch ${a?`is-on`:``}`),r.textContent=a?M(t):``}),T.forEach((e,r)=>{let i=t.positions[r],a=[`d1-chip`];i?n===`contribute`&&r===t.positions.length-1&&a.push(`is-new`):a.push(`is-off`),e.g.setAttribute(`class`,a.join(` `)),i&&(e.top.textContent=`${i.posName} × ${i.weight}`,e.val.textContent=String(i.contribution))}),D.setAttribute(`class`,`d1-total ${n===`done`?`is-on`:``}`),k.textContent=String(t.total),n===`init`?(d.textContent=`准备`,f.textContent=`逐位扫描，从个位开始`,p.textContent=`n = ${r}`):n===`done`?(d.textContent=`${i} 位全部扫完`,f.textContent=`合计`,p.textContent=String(t.total)):(d.textContent=`${t.posName} · 权值 ${o}`,f.textContent=n===`split`?`拆三件套`:g_[t.branch],p.textContent=n===`split`?`?`:String(t.contribution)),A.textContent=j[n]||j[t.branch]||``,Z(P,t.desc)}let P=qg(),F=document.createElement(`div`);F.className=`viz d1`;let I=document.createElement(`div`);I.className=`viz__stage`,I.appendChild(s),F.appendChild(I),F.appendChild(P);let L=Q();F.appendChild(L.root),e.textContent=``,e.appendChild(F),X();let R=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,z=$({steps:n,controls:L,intervalMs:Wg,onRender:N});z.jumpTo(Math.trunc(t.initialStep)||0);let B=null;return t.autoplay!==!1&&!R&&typeof IntersectionObserver==`function`&&(B=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){B.disconnect(),B=null,z.play();return}},{threshold:.35}),B.observe(F)),{destroy(){B&&=(B.disconnect(),null),z.destroy(),e.textContent=``,delete e.dataset.d1Mounted,document.getElementById(Ug)?.remove()}}}var v_=47,y_=[`个位`,`十位`,`百位`,`千位`,`万位`,`十万位`,`百万位`,`千万位`,`亿位`,`十亿位`];function b_(e={}){let t=e.n,n=Number.isInteger(t)&&t>=10&&t<=99?t:v_,r=String(n).length,i=[],a=[],o=0,s={posIndex:-1,weight:0,cycle:0,fullBlocks:0,runLen:0,positionTotal:0,highlighted:[]},c=(e,t)=>{i.push({phase:e,n,cols:10,posCount:r,posIndex:s.posIndex,posName:s.posIndex>=0?y_[s.posIndex]:``,weight:s.weight,cycle:s.cycle,fullBlocks:s.fullBlocks,runLen:s.runLen,positionTotal:s.positionTotal,highlighted:s.highlighted.slice(),positions:a.map(e=>({...e})),total:o,done:e===`done`,desc:``,...t})},l=e=>{let t=[];for(let r=0;r<=n;r+=1)Math.floor(r/e)%10==1&&t.push(r);return t};c(`init`,{desc:`换个角度：先别管公式，看看 1 在数轴上长什么样。下面是 0 ~ ${n}，一个数位一个数位地看过去。0 本身没有 1，放进来只是让每一行凑整。`});for(let e=0;e<r;e+=1){let t=10**e,r=t*10,i=Math.floor(n/r),u=n%r,d=Math.max(0,Math.min(u-t+1,t)),f=i*t+d,p=l(t);s={posIndex:e,weight:t,cycle:r,fullBlocks:i,runLen:d,positionTotal:f,highlighted:p},c(`pattern`,{desc:`看${y_[e]}：每 ${r} 个数一个循环，每个循环里${y_[e]}为 1 的恰好 ${t} 个`+(t>1?`，而且是连成一片的（${p[0]} ~ ${p[p.length-1]}）`:`，是个孤零零的散点`)+`。`}),o+=f,a.push({posIndex:e,posName:y_[e],weight:t,cycle:r,fullBlocks:i,runLen:d,positionTotal:f}),c(`count`,{desc:`${y_[e]}账本：0 ~ ${n} 里有 ${i} 个完整循环，每个贡献 ${t} 个 → ${i*t}；剩下的零头 ${i*r} ~ ${n} 里，1 那一截${d>0?`数出 ${d} 个`:`还没开始`}。${y_[e]}合计 ${f}。`})}return c(`done`,{posIndex:-1,posName:``,weight:0,cycle:0,fullBlocks:0,runLen:0,positionTotal:0,highlighted:[],desc:`合计 ${o}。「完整循环数 × 每循环贡献 + 零头里那一截」—— 这就是公式的原型。把它翻译成代码，就是下一个动画里的 higher / cur / lower 三件套。`}),i}var x_=`d1b-styles`,S_=1050,C_=`
.d1b { display: flex; flex-direction: column; gap: 14px; }
.d1b__svg { width: 100%; height: auto; display: block; }

.d1b-note {
  fill: var(--d1b-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.d1b-banner__box {
  fill: var(--d1b-banner, #f4f3ef);
  stroke: var(--d1b-line, #c3c9c2);
  stroke-width: 1.5;
}
.d1b-banner__seg {
  fill: var(--d1b-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.d1b-banner__val {
  fill: var(--d1b-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1b-seclabel {
  fill: var(--d1b-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}

/* ---- 数字网格 ---- */
.d1b-cell__box {
  fill: var(--d1b-fill, #ffffff);
  stroke: var(--d1b-line, #c3c9c2);
  stroke-width: 1.2;
}
.d1b-cell__val {
  fill: var(--d1b-ink, #1f2a24);
  font-size: 13px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1b-cell.is-one .d1b-cell__box {
  fill: var(--d1b-gold-fill, #fdf3e3);
  stroke: var(--d1b-gold, #c2872f);
  stroke-width: 2.2;
}
.d1b-cell.is-one .d1b-cell__val { fill: var(--d1b-gold, #c2872f); font-weight: 700; }
.d1b-cell.is-zero .d1b-cell__val { fill: var(--d1b-dim, #9aa39c); }

/* ---- 账本面板 ---- */
.d1b-ledger__box {
  fill: var(--d1b-fill, #ffffff);
  stroke: var(--d1b-line, #c3c9c2);
  stroke-width: 1.5;
}
.d1b-ledger__title {
  fill: var(--d1b-ink, #1f2a24);
  font-size: 13.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.d1b-ledger__line {
  fill: var(--d1b-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.d1b-ledger__sum {
  fill: var(--d1b-gold, #c2872f);
  font-size: 14px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.d1b-ledger.is-idle .d1b-ledger__line { fill: var(--d1b-dim, #9aa39c); }

/* ---- 累计 chips + 合计 ---- */
.d1b-chip__box {
  fill: var(--d1b-fill, #ffffff);
  stroke: var(--d1b-line, #c3c9c2);
  stroke-width: 1.4;
}
.d1b-chip__top {
  fill: var(--d1b-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1b-chip__val {
  fill: var(--d1b-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1b-chip.is-new .d1b-chip__box { stroke: var(--d1b-gold, #c2872f); stroke-width: 2.4; }
.d1b-chip.is-new .d1b-chip__val { fill: var(--d1b-gold, #c2872f); }
.d1b-chip.is-off { opacity: 0; }
.d1b-total__box {
  fill: var(--d1b-fill, #ffffff);
  stroke: var(--d1b-line, #c3c9c2);
  stroke-width: 1.4;
}
.d1b-total__label {
  fill: var(--d1b-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1b-total__val {
  fill: var(--d1b-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1b-total.is-on .d1b-total__box { fill: var(--d1b-gold-fill, #fdf3e3); stroke: var(--d1b-gold, #c2872f); stroke-width: 2.6; }
.d1b-total.is-on .d1b-total__label { fill: var(--d1b-gold, #c2872f); }
.d1b-total.is-on .d1b-total__val { fill: var(--d1b-gold, #c2872f); }

.d1b-phasetext {
  fill: var(--d1b-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
`,w_=680,T_=20,E_=36,D_=40,O_=96,k_=106,A_=44,j_=32,M_=8,N_=10,P_=22,F_=100,I_=16,L_=46;function R_(){if(document.getElementById(x_))return;let e=document.createElement(`style`);e.id=x_,e.textContent=C_,document.head.appendChild(e)}function z_(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}function B_(e,t={}){if(!e||e.dataset.d1bMounted===`1`)return{destroy(){}};e.dataset.d1bMounted=`1`,R_();let n=b_(t),{n:r,posCount:i}=n[0],a=Math.ceil((r+1)/N_),o=a*j_+(a-1)*M_,s=(w_-494)/2,c=k_+o+P_,l=c+F_+I_,u=l+L_+26,d=u+18,f=Y,p=f(`svg`,{class:`viz__svg d1b__svg`,viewBox:`0 0 ${w_} ${d}`,role:`img`,"aria-label":`1 到 n 中数字 1 出现次数 数轴周期块动画`}),m=f(`g`,{class:`d1b-cells`}),h=f(`g`,{class:`d1b-marks`});p.appendChild(m),p.appendChild(h);let g=f(`text`,{class:`d1b-note`,x:30,y:T_});g.textContent=`数轴视角：0 ~ ${r}，看 1 长什么样（烫金 = 当前数位为 1）`,h.appendChild(g),h.appendChild(f(`rect`,{class:`d1b-banner__box`,x:30,y:E_,width:w_-60,height:D_,rx:9}));let _=f(`text`,{class:`d1b-banner__seg`,x:46,y:56}),v=f(`text`,{class:`d1b-banner__seg`,x:236,y:56}),y=f(`text`,{class:`d1b-banner__val`,x:w_-46,y:56});h.append(_,v,y);let b=f(`text`,{class:`d1b-seclabel`,x:30,y:O_});b.textContent=`0 ~ ${r}（每行 10 个，0 没有 1，永远不高亮）`,h.appendChild(b);let x=[];for(let e=0;e<=r;e+=1){let t=Math.floor(e/N_),n=s+e%N_*50,r=k_+t*40,i=f(`g`,{class:`d1b-cell`});i.appendChild(f(`rect`,{class:`d1b-cell__box`,x:n,y:r,width:A_,height:j_,rx:6}));let a=f(`text`,{class:`d1b-cell__val`,x:n+A_/2,y:r+j_/2});a.textContent=String(e),i.appendChild(a),m.appendChild(i),x.push({g:i,v:e})}h.appendChild(f(`rect`,{class:`d1b-ledger__box`,x:30,y:c,width:w_-60,height:F_,rx:9}));let S=f(`g`,{class:`d1b-ledger`}),C=f(`text`,{class:`d1b-ledger__title`,x:46,y:c+22}),w=f(`text`,{class:`d1b-ledger__line`,x:46,y:c+46}),T=f(`text`,{class:`d1b-ledger__line`,x:46,y:c+68}),E=f(`text`,{class:`d1b-ledger__sum`,x:46,y:c+88});S.append(C,w,T,E),h.appendChild(S);let D=(w_-(i*120+(i-1)*12+16+150))/2,O=[];for(let e=0;e<i;e+=1){let t=D+e*132,n=f(`g`,{class:`d1b-chip is-off`});n.appendChild(f(`rect`,{class:`d1b-chip__box`,x:t,y:l,width:120,height:L_,rx:8}));let r=f(`text`,{class:`d1b-chip__top`,x:t+120/2,y:l+14}),i=f(`text`,{class:`d1b-chip__val`,x:t+120/2,y:l+32});n.append(r,i),m.appendChild(n),O.push({g:n,top:r,val:i})}let k=D+i*132-12+16,A=f(`g`,{class:`d1b-total`});A.appendChild(f(`rect`,{class:`d1b-total__box`,x:k,y:l,width:150,height:L_,rx:8}));let j=f(`text`,{class:`d1b-total__label`,x:k+150/2,y:l+15});j.textContent=`合计`;let M=f(`text`,{class:`d1b-total__val`,x:k+150/2,y:l+33});A.append(j,M),m.appendChild(A);let N=f(`text`,{class:`d1b-phasetext`,x:w_/2,y:u});h.appendChild(N);function P(e,t){if(!t)return;let{phase:n,posName:a,weight:o,cycle:s,fullBlocks:c,runLen:l,positionTotal:u,total:d}=t,f=new Set(t.highlighted);if(x.forEach(({g:e,v:t})=>{let n=[`d1b-cell`];f.has(t)?n.push(`is-one`):t===0&&n.push(`is-zero`),e.setAttribute(`class`,n.join(` `))}),S.setAttribute(`class`,`d1b-ledger ${n===`count`?``:`is-idle`}`),n===`count`){C.textContent=`${a}账本`,w.textContent=`完整循环：${c} 个 × 每个 ${o} 个 = ${c*o}`;let e=c*s;T.textContent=l>0?l===o?`零头 ${e} ~ ${r}：1 那一截整块都在，数出 ${l} 个`:`零头 ${e} ~ ${r}：数出 ${l} 个`:`零头 ${e} ~ ${r}：还没走到 1 那一截`,E.textContent=`${a}合计 = ${u}`}else n===`done`?(C.textContent=`总账本`,w.textContent=t.positions.map(e=>`${e.posName} ${e.positionTotal}`).join(` + `),T.textContent=`0 ~ ${r} 里每一个数字 1 都数到了，没有遗漏也没有重复。`,E.textContent=`合计 = ${d}`):(C.textContent=`账本`,w.textContent=`先把当前数位为 1 的格子看出来（烫金），再记账。`,T.textContent=``,E.textContent=``);O.forEach((e,r)=>{let i=t.positions[r],a=[`d1b-chip`];i?n===`count`&&r===t.positions.length-1&&a.push(`is-new`):a.push(`is-off`),e.g.setAttribute(`class`,a.join(` `)),i&&(e.top.textContent=i.posName,e.val.textContent=String(i.positionTotal))}),A.setAttribute(`class`,`d1b-total ${n===`done`?`is-on`:``}`),M.textContent=String(d),n===`init`?(_.textContent=`准备`,v.textContent=`先看分布，再记账`,y.textContent=`0 ~ ${r}`):n===`done`?(_.textContent=`${i} 位全部看完`,v.textContent=`合计`,y.textContent=String(d)):(_.textContent=`${a} · 每 ${s} 个数一次`,v.textContent=n===`pattern`?`看分布`:`记账本`,y.textContent=n===`pattern`?`?`:String(u)),N.textContent=n===`init`?`0 本身没有 1，放进来只是让每一行凑整 —— 它永远不高亮。`:n===`pattern`?o===1?`个位：每 10 个数循环一次，一个循环里个位是 1 的只有 1 个 —— 所以是散点。`:`${a}：每 ${s} 个数循环一次，一个循环里有连续 ${o} 个数的${a}是 1 —— 所以是整块。`:n===`count`?`每个数位的账本都是同一句话：完整循环数 × 每循环贡献 + 零头里那一截。`:`把这句话翻译成代码，就是下一个动画里的 higher / cur / lower 三件套。`,Z(F,t.desc)}let F=z_(),I=document.createElement(`div`);I.className=`viz d1b`;let L=document.createElement(`div`);L.className=`viz__stage`,L.appendChild(p),I.appendChild(L),I.appendChild(F);let R=Q();I.appendChild(R.root),e.textContent=``,e.appendChild(I),X();let z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,B=$({steps:n,controls:R,intervalMs:S_,onRender:P});B.jumpTo(Math.trunc(t.initialStep)||0);let V=null;return t.autoplay!==!1&&!z&&typeof IntersectionObserver==`function`&&(V=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){V.disconnect(),V=null,B.play();return}},{threshold:.35}),V.observe(I)),{destroy(){V&&=(V.disconnect(),null),B.destroy(),e.textContent=``,delete e.dataset.d1bMounted,document.getElementById(x_)?.remove()}}}var V_=[3,0,7,5,4];function H_(e){return e===0?`王`:e===11?`J`:e===12?`Q`:e===13?`K`:String(e)}function U_(e){return Array.isArray(e)&&e.length===5&&e.every(e=>Number.isInteger(e)&&e>=0&&e<=13)}function W_(e){let t=[...e].sort((e,t)=>e-t),n=t.filter(e=>e===0).length,r=t.filter(e=>e!==0);if(new Set(r).size!==r.length)return{result:!1,failReason:`dup`,zeros:n,rest:r,need:0};let i=0;for(let e=0;e<r.length-1;e+=1)i+=Math.max(0,r[e+1]-r[e]-1);return{result:n>=i,failReason:n>=i?null:`gap`,zeros:n,rest:r,need:i}}function G_(e={}){let t=U_(e.cards)?e.cards.slice():V_.slice(),n=[...t].sort((e,t)=>e-t),r=n.filter(e=>e===0).length,i=n.filter(e=>e!==0),a=[],o=[];for(let e=0;e<i.length-1;e+=1)o.push({index:e,a:i[e],b:i[e+1],gap:i[e+1]-i[e]});let s=r,c=0,l=null,u=!1,d=[],f=i.length>0?i[0]:0,p=i.length>0?[{value:i[0],byJoker:!1}]:[],m=()=>p.length>0?{from:f,to:p[p.length-1].value,filled:p.map(e=>({...e}))}:null,h=(e,u)=>{a.push({phase:e,input:t,sorted:n,zeros:r,rest:i,pairCount:o.length,pairIndex:d.length>0?d[d.length-1].index:-1,gap:d.length>0?d[d.length-1].gap:0,need:c,remaining:s,failReason:l,result:null,checked:d.map(e=>({...e})),segment:m(),done:e===`done`,desc:``,...u})};h(`init`,{desc:`手里 5 张牌：${t.map(H_).join(`、`)}。规则：牌面 1~13，5 张连续算顺子；大小王（0）可以当任意牌。先排序，让王浮到最前、牌按大小排好 —— 顺子的判断就变成「相邻两张差多少、王够不够补」一件事。`}),h(`sort`,{desc:`排序后：${n.map(H_).join(`、`)}。王排在开头，非王牌 ${i.length} 张升序排列。`+(i.length>0?`接下来只看非王牌之间相邻的差。`:`全是王，任意 5 张都是顺子。`)}),r>0?h(`jokers`,{desc:`数一下王：${r} 张。每张王就是一次「任意填」的机会 —— 后面每发现一个断档，就填一张王进去。王用完还不够，就不是顺子。`}):h(`jokers`,{desc:`没有王。5 张非王牌必须严丝合缝地连续，任何断档都补不上。`});for(let e of o){if(u)break;let t=e.gap;if(t===0){l=`dup`,u=!0,d.push({...e,kind:`dup`,consumed:0}),h(`gap`,{desc:`${e.a} 和 ${e.b} 一样大 —— 非王牌里有重复。顺子要求 5 个互不相同的数，王能填「缺的数」，填不了「已有的数」，重复无解，直接判定不是顺子。`});break}if(t===1){d.push({...e,kind:`tight`,consumed:0}),p.push({value:e.b,byJoker:!1}),h(`gap`,{desc:`${e.a} 到 ${e.b} 差 1，天然连续，不用王。当前已接上 ${p.map(e=>H_(e.value)).join(`-`)}。`});continue}let n=t-1;if(s>=n){s-=n,c+=n,d.push({...e,kind:`filled`,consumed:n});for(let t=e.a+1;t<e.b;t+=1)p.push({value:t,byJoker:!0});p.push({value:e.b,byJoker:!1}),h(`gap`,{desc:`${e.a} 到 ${e.b} 差了 ${t}，中间缺 ${n} 个数（${Array.from({length:n},(t,n)=>e.a+1+n).map(H_).join(`、`)}）。拿 ${n} 张王补上，王还剩 ${s} 张。当前已接上 ${p.map(e=>H_(e.value)).join(`-`)}。`});continue}l=`gap`,u=!0,c+=n,d.push({...e,kind:`short`,consumed:n}),h(`gap`,{desc:`${e.a} 到 ${e.b} 差了 ${t}，中间缺 ${n} 个数，但王只剩 ${s} 张 —— 补不上这个断档，判定不是顺子。`});break}let g=l?!1:c<=r;return h(`done`,{result:g,failReason:g?null:l,desc:g?`${i.length} 张非王牌全部接上，一共需要补 ${c} 个洞，${r} 张王刚好够用`+(s>0?`（还剩 ${s} 张王没用完）`:`（一张不剩，正好用完）`)+`。拼出来是 ${p.map(e=>H_(e.value)).join(`-`)} —— 连续 5 张，是顺子。`:l===`dup`?`非王牌里有重复，王救不了 —— 不是顺子。`:`断档太多、王不够补 —— 不是顺子。`}),a}var K_=`p61-styles`,q_=1050,J_=`
.p61 { display: flex; flex-direction: column; gap: 14px; }
.p61__svg { width: 100%; height: auto; display: block; }

.p61-note {
  fill: var(--p61-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.p61-banner__box {
  fill: var(--p61-banner, #f4f3ef);
  stroke: var(--p61-line, #c3c9c2);
  stroke-width: 1.5;
}
.p61-banner__seg {
  fill: var(--p61-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.p61-banner__val {
  fill: var(--p61-gold, #c2872f);
  font-size: 16px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
}
.p61-seclabel {
  fill: var(--p61-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}

/* ---- 牌面 ---- */
.p61-card__box {
  fill: var(--p61-fill, #ffffff);
  stroke: var(--p61-line, #c3c9c2);
  stroke-width: 1.5;
}
.p61-card__val {
  fill: var(--p61-ink, #1f2a24);
  font-size: 25px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}
.p61-card__sub {
  fill: var(--p61-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.p61-card.is-joker .p61-card__box {
  fill: var(--p61-gold-fill, #fdf3e3);
  stroke: var(--p61-gold, #c2872f);
  stroke-width: 2.4;
}
.p61-card.is-joker .p61-card__val { fill: var(--p61-gold, #c2872f); }
.p61-card.is-joker .p61-card__sub { fill: var(--p61-gold, #c2872f); }
.p61-card.is-cur .p61-card__box {
  stroke: var(--p61-cur, #a45f45);
  stroke-width: 3.2;
}
.p61-card.is-cur .p61-card__val { fill: var(--p61-cur, #a45f45); }
.p61-card.is-dup .p61-card__box {
  stroke: var(--p61-red, #b3452f);
  stroke-width: 3.2;
}
.p61-card.is-dup .p61-card__val { fill: var(--p61-red, #b3452f); }
.p61-card.is-dim .p61-card__box { stroke-dasharray: 4 4; }
.p61-card.is-dim .p61-card__val { fill: var(--p61-dim, #9aa39c); font-weight: 400; }

/* 相邻对之间的连接弧（当前对） */
.p61-pairlink {
  fill: none;
  stroke: var(--p61-cur, #a45f45);
  stroke-width: 2;
  stroke-dasharray: 5 4;
}

/* ---- 相邻对账本 chip ---- */
.p61-gap__box {
  fill: var(--p61-fill, #ffffff);
  stroke: var(--p61-line, #c3c9c2);
  stroke-width: 1.3;
}
.p61-gap__text {
  fill: var(--p61-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.p61-gap.is-pending .p61-gap__box { stroke-dasharray: 4 4; }
.p61-gap.is-pending .p61-gap__text { fill: var(--p61-dim, #9aa39c); }
.p61-gap.is-cur .p61-gap__box {
  fill: var(--p61-gold-fill, #fdf3e3);
  stroke: var(--p61-gold, #c2872f);
  stroke-width: 2.4;
}
.p61-gap.is-cur .p61-gap__text { fill: var(--p61-gold, #c2872f); font-weight: 700; }
.p61-gap.is-tight .p61-gap__box { stroke: var(--p61-green, #3f6b57); }
.p61-gap.is-tight .p61-gap__text { fill: var(--p61-green, #3f6b57); }
.p61-gap.is-filled .p61-gap__box {
  fill: var(--p61-gold-fill, #fdf3e3);
  stroke: var(--p61-gold, #c2872f);
}
.p61-gap.is-filled .p61-gap__text { fill: var(--p61-gold, #c2872f); }
.p61-gap.is-bad .p61-gap__box {
  fill: var(--p61-red-fill, #f9ece8);
  stroke: var(--p61-red, #b3452f);
  stroke-width: 2.2;
}
.p61-gap.is-bad .p61-gap__text { fill: var(--p61-red, #b3452f); font-weight: 700; }

/* ---- 拼出的顺子 ---- */
.p61-slot__box {
  fill: var(--p61-fill, #ffffff);
  stroke: var(--p61-green, #3f6b57);
  stroke-width: 1.8;
}
.p61-slot__val {
  fill: var(--p61-green, #3f6b57);
  font-size: 19px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}
.p61-slot__mark {
  fill: var(--p61-gold, #c2872f);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.p61-slot.is-joker .p61-slot__box {
  fill: var(--p61-gold-fill, #fdf3e3);
  stroke: var(--p61-gold, #c2872f);
  stroke-width: 2.4;
}
.p61-slot.is-joker .p61-slot__val { fill: var(--p61-gold, #c2872f); }
.p61-slot.is-hole .p61-slot__box {
  fill: var(--p61-red-fill, #f9ece8);
  stroke: var(--p61-red, #b3452f);
  stroke-dasharray: 4 4;
}
.p61-slot.is-hole .p61-slot__val { fill: var(--p61-red, #b3452f); }
.p61-slot.is-empty { opacity: 0; }

/* ---- 判定 ---- */
.p61-verdict__box {
  fill: var(--p61-fill, #ffffff);
  stroke: var(--p61-line, #c3c9c2);
  stroke-width: 1.5;
}
.p61-verdict__label {
  fill: var(--p61-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}
.p61-verdict__main {
  fill: var(--p61-dim, #9aa39c);
  font-size: 21px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.p61-verdict__sub {
  fill: var(--p61-muted, #657168);
  font-size: 13px;
  text-anchor: end;
  dominant-baseline: central;
}
.p61-verdict.is-yes .p61-verdict__box {
  fill: var(--p61-green-fill, #eaf3ee);
  stroke: var(--p61-green, #3f6b57);
  stroke-width: 2.6;
}
.p61-verdict.is-yes .p61-verdict__main { fill: var(--p61-green, #3f6b57); }
.p61-verdict.is-no .p61-verdict__box {
  fill: var(--p61-red-fill, #f9ece8);
  stroke: var(--p61-red, #b3452f);
  stroke-width: 2.6;
}
.p61-verdict.is-no .p61-verdict__main { fill: var(--p61-red, #b3452f); }

.p61-phasetext {
  fill: var(--p61-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
`;function Y_(){if(document.getElementById(K_))return;let e=document.createElement(`style`);e.id=K_,e.textContent=J_,document.head.appendChild(e)}function X_(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}var Z_=680,Q_=20,$_=36,ev=40,tv=98,nv=108,rv=92,iv=62,av=214,ov=224,sv=42,cv=288,lv=298,uv=46,dv=372,fv=54,pv=456,mv=474,hv={tight:e=>`差 1 · 天然连续`,filled:e=>`差 ${e.gap} · 缺 ${e.gap-1} 个 · 王补`,short:e=>`差 ${e.gap} · 缺 ${e.gap-1} 个 · 王不够`,dup:()=>`重复 · 无解`};function gv(e,t={}){if(!e||e.dataset.p61Mounted===`1`)return{destroy(){}};e.dataset.p61Mounted=`1`,Y_();let n=G_(t),r=n[0],{sorted:i,zeros:a,rest:o}=r,s=Y,c=s(`svg`,{class:`viz__svg p61__svg`,viewBox:`0 0 ${Z_} ${mv}`,role:`img`,"aria-label":`扑克牌顺子判断动画：排序、数大小王、逐对补洞`}),l=s(`g`,{class:`p61-cells`}),u=s(`g`,{class:`p61-marks`});c.appendChild(l),c.appendChild(u);let d=s(`text`,{class:`p61-note`,x:30,y:Q_});d.textContent=`输入 ${r.input.map(H_).join(`、`)} · 0 = 大小王可当任意牌 · 5 张连续即顺子`,u.appendChild(d),u.appendChild(s(`rect`,{class:`p61-banner__box`,x:30,y:$_,width:Z_-60,height:ev,rx:9}));let f=s(`text`,{class:`p61-banner__seg`,x:46,y:56}),p=s(`text`,{class:`p61-banner__seg`,x:168,y:56}),m=s(`text`,{class:`p61-banner__val`,x:Z_-46,y:56});u.append(f,p,m);let h=s(`text`,{class:`p61-seclabel`,x:30,y:tv});h.textContent=`排序后：王浮到最前，非王牌升序（橙框 = 当前检查的相邻对）`,u.appendChild(h);let g=(Z_-516)/2,_=i.map((e,t)=>{let n=g+t*106,r=s(`g`,{class:`p61-card`});r.appendChild(s(`rect`,{class:`p61-card__box`,x:n,y:nv,width:rv,height:iv,rx:8}));let i=s(`text`,{class:`p61-card__val`,x:n+rv/2,y:133});i.textContent=H_(e);let a=s(`text`,{class:`p61-card__sub`,x:n+rv/2,y:155});return a.textContent=e===0?`大小王 · 0`:`牌面 ${e}`,r.append(i,a),l.appendChild(r),{g:r,c:e,i:t}}),v=s(`path`,{class:`p61-pairlink`});u.appendChild(v);let y=s(`text`,{class:`p61-seclabel`,x:30,y:av});y.textContent=`相邻非王牌逐对检查：差多少、要不要动用王`,u.appendChild(y);let b=[];for(let e=0;e<o.length-1;e+=1)b.push({index:b.length,a:o[e],b:o[e+1],gap:o[e+1]-o[e]});let x=b.length>0?Math.min(200,(Z_-60-(b.length-1)*12)/b.length):200,S=(Z_-(b.length*x+(b.length-1)*12))/2,C=b.map(e=>{let t=S+e.index*(x+12),n=s(`g`,{class:`p61-gap is-pending`});n.appendChild(s(`rect`,{class:`p61-gap__box`,x:t,y:ov,width:x,height:sv,rx:8}));let r=s(`text`,{class:`p61-gap__text`,x:t+x/2,y:245});r.textContent=`${H_(e.a)} → ${H_(e.b)}`;let i=s(`text`,{class:`p61-gap__text`,x:t+x/2,y:261});return n.append(r,i),l.appendChild(n),{g:n,text:r,text2:i,def:e}}),w=s(`text`,{class:`p61-seclabel`,x:30,y:cv});w.textContent=`已经接上的连续段（烫金 = 王补出来的数）`,u.appendChild(w);let T=Math.min(56,(Z_-100)/13),E=[];for(let e=0;e<13;e+=1){let e=s(`g`,{class:`p61-slot is-empty`});e.appendChild(s(`rect`,{class:`p61-slot__box`,y:lv,width:T,height:uv,rx:7}));let t=s(`text`,{class:`p61-slot__val`,y:315}),n=s(`text`,{class:`p61-slot__mark`,y:335});e.append(t,n),l.appendChild(e),E.push({g:e,val:t,mark:n})}let D=s(`g`,{class:`p61-verdict`});D.appendChild(s(`rect`,{class:`p61-verdict__box`,x:30,y:dv,width:Z_-60,height:fv,rx:10}));let O=s(`text`,{class:`p61-verdict__label`,x:48,y:389});O.textContent=`判定`;let k=s(`text`,{class:`p61-verdict__main`,x:48,y:408}),A=s(`text`,{class:`p61-verdict__sub`,x:Z_-48,y:399});D.append(O,k,A),l.appendChild(D);let j=s(`text`,{class:`p61-phasetext`,x:Z_/2,y:pv});u.appendChild(j);let M={init:`顺子 = 5 个互不相同的连续数。排序之后，判断塌缩成「相邻差多少、王够不够补」。`,sort:`王（0）小于所有牌面，排序后自动排到最前 —— 后面只关心非王牌之间的相邻差。`,jokers:`每张王就是一次「任意填」。断档出现时填一张，王用完还不够就不是顺子。`,gap:`相邻差 1 天然连续；差 N 就要拿 N-1 张王补中间的洞；差 0 是重复，王救不了。`,done:`时间 O(1)（5 张牌排序是常数级），空间 O(1) —— 但这题的分数全在边界和 bug 防范上。`},N=e=>{if(e.phase===`init`)return[`准备`,`5 张牌，先排序`,`${r.input.map(H_).join(` `)}`];if(e.phase===`sort`)return[`排序`,`王浮到最前，非王升序`,i.map(H_).join(` `)];if(e.phase===`jokers`)return[`数王`,a>0?`每张王 = 一次任意填`:`没有王，必须严丝合缝`,`王 × ${a}`];if(e.phase===`gap`){let t=e.checked[e.checked.length-1],n=t?t.kind:`tight`;return[`检查相邻对`,n===`dup`?`${H_(t.a)} 和 ${H_(t.b)} 重复`:n===`tight`?`${H_(t.a)}→${H_(t.b)} 差 1，连续`:n===`filled`?`${H_(t.a)}→${H_(t.b)} 缺 ${t.gap-1} 个，王补`:`${H_(t.a)}→${H_(t.b)} 缺 ${t.gap-1} 个，王只剩 ${e.remaining}`,`王剩 ${e.remaining}`]}return[`判定`,e.result?`是顺子`:`不是顺子`,e.result?`拼出 ${e.segment?e.segment.filled.map(e=>H_(e.value)).join(`-`):``}`:e.failReason===`dup`?`有重复`:`王不够`]};function P(e,t){if(!t)return;let n=t.phase===`gap`?t.checked[t.checked.length-1]:null,r=n&&n.kind===`dup`?n:null;if(_.forEach(e=>{let t=[`p61-card`];e.c===0&&t.push(`is-joker`),r&&(e.c===r.a||e.c===r.b)?t.push(`is-dup`):n&&(e.c===n.a||e.c===n.b)&&t.push(`is-cur`),e.g.setAttribute(`class`,t.join(` `))}),n&&n.kind!==`dup`){let e=i.indexOf(n.a),t=i.indexOf(n.b),r=g+e*106+rv/2,a=g+t*106+rv/2,o=nv-14;v.setAttribute(`d`,`M ${r} ${nv-4} Q ${(r+a)/2} ${o-14} ${a} ${nv-4}`),v.style.opacity=`1`}else v.style.opacity=`0`;C.forEach(({g:e,text:n,text2:r,def:i})=>{let a=t.checked.find(e=>e.index===i.index),o=t.phase===`gap`&&t.pairIndex===i.index,s=`p61-gap`;a?s+=` is-${a.kind}`:o?s+=` is-cur`:s+=` is-pending`,e.setAttribute(`class`,s),a?(n.textContent=`${H_(i.a)} → ${H_(i.b)}`,r.textContent=hv[a.kind](a)):(n.textContent=`${H_(i.a)} → ${H_(i.b)}`,r.textContent=o?`检查中…`:`差 ${i.gap}`)});let o=t.segment;E.forEach((e,t)=>{if(!o||t>=o.filled.length){e.g.setAttribute(`class`,`p61-slot is-empty`);return}let n=o.filled[t],r=[`p61-slot`,n.byJoker?`is-joker`:``].join(` `).trim();e.g.setAttribute(`class`,r);let i=o.filled.length,a=(Z_-(i*T+(i-1)*8))/2+t*52.61538461538461;e.g.querySelector(`.p61-slot__box`).setAttribute(`x`,a),e.val.setAttribute(`x`,a+T/2),e.mark.setAttribute(`x`,a+T/2),e.val.textContent=H_(n.value),e.mark.textContent=n.byJoker?`王补`:``});let s=[`p61-verdict`];t.phase===`done`&&s.push(t.result?`is-yes`:`is-no`),D.setAttribute(`class`,s.join(` `)),t.phase===`done`?(k.textContent=t.result?`是顺子`:`不是顺子`,A.textContent=t.result?`补 ${t.need} 个洞 · 王用 ${a-t.remaining}/${a} 张`:t.failReason===`dup`?`非王牌有重复`:`需补 ${t.need} 个洞 · 王只有 ${a} 张`):(k.textContent=t.failReason?`不是顺子`:`检查中…`,A.textContent=`王还剩 ${t.remaining} 张 · 已接上 ${o?o.filled.length:0} 张`);let[c,l,u]=N(t);f.textContent=c,p.textContent=l,m.textContent=u,j.textContent=M[t.phase]||``,Z(F,t.desc)}let F=X_(),I=document.createElement(`div`);I.className=`viz p61`;let L=document.createElement(`div`);L.className=`viz__stage`,L.appendChild(c),I.appendChild(L),I.appendChild(F);let R=Q();I.appendChild(R.root),e.textContent=``,e.appendChild(I),X();let z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,B=$({steps:n,controls:R,intervalMs:q_,onRender:P});B.jumpTo(Math.trunc(t.initialStep)||0);let V=null;return t.autoplay!==!1&&!z&&typeof IntersectionObserver==`function`&&(V=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){V.disconnect(),V=null,B.play();return}},{threshold:.35}),V.observe(I)),{destroy(){V&&=(V.disconnect(),null),B.destroy(),e.textContent=``,delete e.dataset.p61Mounted,document.getElementById(K_)?.remove()}}}var _v=[{key:`no-dup`,cards:[1,2,2,3,4],bugName:`不判重复`,bugCode:`只看 max(非王) - min(非王) < 5`,bugWhy:`非王牌跨度只有 3，判据看都不看重复就放行了。顺子是 5 个互不相同的数 —— 王能填「缺的数」，填不了「已有的数」，重复出现时再多王也无解。`},{key:`le5`,cards:[1,2,3,4,6],bugName:`判据写成 ≤ 5`,bugCode:`max(非王) - min(非王) <= 5`,bugWhy:`跨度正好 5，≤ 5 把它放了过去。5 张无王的牌要连续，跨度必须恰好是 4 —— 跨度 5 意味着中间差着一个数（这里是 5），没有王来补。`},{key:`joker-pairs`,cards:[0,0,1,2,6],bugName:`王也算进相邻对`,bugCode:`for i in 1..4: gap += nums[i] - nums[i-1] - 1`,bugWhy:`遍历从下标 1 开始，0 和 0 这对也被算了进去：0 - 0 - 1 = -1。两张王各贡献 -1 的负 gap，把 2 → 6 需要的 3 个洞抵成 1 个，2 张王「刚好够」—— 其实 3、4、5 三个数一张王都补不上。`}];function vv(e){let t=e.filter(e=>e!==0);return t.length===0?!0:Math.max(...t)-Math.min(...t)<5}function yv(e){let t=e.filter(e=>e!==0);return t.length===0?!0:Math.max(...t)-Math.min(...t)<=5}function bv(e){let t=[...e].sort((e,t)=>e-t),n=t.filter(e=>e===0).length,r=0;for(let e=1;e<t.length;e+=1)r+=t[e]-t[e-1]-1;return r<=n}var xv={"no-dup":vv,le5:yv,"joker-pairs":bv},Sv=[[1,2,3,4,5],[0,0,1,2,5]];function Cv(){let e=[],t=(t,n)=>{e.push({phase:t,groupIndex:-1,group:null,done:t===`done`,desc:``,...n})};return t(`init`,{desc:`官方样例只有两组：[1,2,3,4,5] 和 [0,0,1,2,5]，都返回 true。下面三个错法在这两组样例上全部失声，各配一个最小反例 —— 注意三个错法的方向一致：把不是顺子的牌放过去。`}),_v.forEach((e,n)=>{let r=[...e.cards].sort((e,t)=>e-t),i=r.filter(e=>e===0).length,a=r.filter(e=>e!==0),o=a.length>0?Math.max(...a)-Math.min(...a):0,s=W_(e.cards),c=xv[e.key],l=c(e.cards),u=Sv.every(e=>c(e)===W_(e).result);t(`hand`,{groupIndex:n,group:{...e,sorted:r,zeros:i,rest:a,span:o,correct:s.result,correctReason:s.failReason===`dup`?`非王牌有重复`:`断档补不上`,bugVerdict:l,silent:u,pairGaps:e.key===`joker-pairs`?r.slice(1).map((e,t)=>e-r[t]-1):null},desc:`第 ${n+1} 组：${r.map(H_).join(`、`)}。`+(i>0?`王 ${i} 张，非王 ${a.map(H_).join(`、`)}（跨度 ${o}）。`:`无王，跨度 ${o}。`)+`错法「${e.bugName}」：${e.bugCode}。`}),t(`verdict`,{groupIndex:n,group:{...e,sorted:r,zeros:i,rest:a,span:o,correct:s.result,correctReason:s.failReason===`dup`?`非王牌有重复`:`断档补不上`,bugVerdict:l,silent:u,pairGaps:e.key===`joker-pairs`?r.slice(1).map((e,t)=>e-r[t]-1):null},desc:`正解：${s.result?`是顺子`:`不是顺子（${s.failReason===`dup`?`非王牌有重复`:`需要补 ${s.need} 个洞，王只有 ${i} 张`}）`}。错法「${e.bugName}」判成 ${l?`是顺子`:`不是顺子`} —— ${l===s.result?`这组碰巧一致`:`判错了`}。`+e.bugWhy+(u?`（两组官方样例在这个错法下都返回 true，抓不住它。）`:``)})}),t(`done`,{desc:`三个错法一个共同点：只盯着「跨度」，忘了顺子还有「不重复」和「王只补缺失」两条约束。测顺子题必备的三组反例：[1,2,2,3,4]（重复）、[1,2,3,4,6]（跨 5 无王）、[0,0,1,2,6]（王被负 gap 抵掉）。`}),e}var wv=`p61b-styles`,Tv=1250,Ev=`
.p61b { display: flex; flex-direction: column; gap: 14px; }
.p61b__svg { width: 100%; height: auto; display: block; }

.p61b-note {
  fill: var(--p61b-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-banner__box {
  fill: var(--p61b-banner, #f4f3ef);
  stroke: var(--p61b-line, #c3c9c2);
  stroke-width: 1.5;
}
.p61b-banner__seg {
  fill: var(--p61b-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-banner__val {
  fill: var(--p61b-gold, #c2872f);
  font-size: 15px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
}

/* ---- 反例行 ---- */
.p61b-row__box {
  fill: var(--p61b-fill, #ffffff);
  stroke: var(--p61b-line, #c3c9c2);
  stroke-width: 1.3;
}
.p61b-row__label {
  fill: var(--p61b-ink, #1f2a24);
  font-size: 13.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-row__bannerum {
  fill: var(--p61b-gold, #c2872f);
  font-size: 12px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-row.is-cur .p61b-row__box {
  stroke: var(--p61b-gold, #c2872f);
  stroke-width: 2.4;
}
.p61b-row.is-dim { opacity: 0.45; }

/* 迷你牌 */
.p61b-card__box {
  fill: var(--p61b-fill, #ffffff);
  stroke: var(--p61b-line, #c3c9c2);
  stroke-width: 1.4;
}
.p61b-card__val {
  fill: var(--p61b-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}
.p61b-card.is-joker .p61b-card__box {
  fill: var(--p61b-gold-fill, #fdf3e3);
  stroke: var(--p61b-gold, #c2872f);
  stroke-width: 2;
}
.p61b-card.is-joker .p61b-card__val { fill: var(--p61b-gold, #c2872f); }
.p61b-card.is-dup .p61b-card__box {
  stroke: var(--p61b-red, #b3452f);
  stroke-width: 2.4;
}
.p61b-card.is-dup .p61b-card__val { fill: var(--p61b-red, #b3452f); }

/* 判定丸 */
.p61b-pill__box {
  fill: var(--p61b-fill, #ffffff);
  stroke: var(--p61b-line, #c3c9c2);
  stroke-width: 1.4;
}
.p61b-pill__head {
  fill: var(--p61b-muted, #657168);
  font-size: 11px;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-pill__main {
  fill: var(--p61b-dim, #9aa39c);
  font-size: 14.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-pill__sub {
  fill: var(--p61b-muted, #657168);
  font-size: 11.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-pill.is-no .p61b-pill__box {
  fill: var(--p61b-red-fill, #f9ece8);
  stroke: var(--p61b-red, #b3452f);
  stroke-width: 2.2;
}
.p61b-pill.is-no .p61b-pill__main { fill: var(--p61b-red, #b3452f); }
.p61b-pill.is-yes .p61b-pill__box {
  fill: var(--p61b-green-fill, #eaf3ee);
  stroke: var(--p61b-green, #3f6b57);
  stroke-width: 2.2;
}
.p61b-pill.is-yes .p61b-pill__main { fill: var(--p61b-green, #3f6b57); }
.p61b-pill.is-wrong .p61b-pill__box {
  fill: var(--p61b-green-fill, #eaf3ee);
  stroke: var(--p61b-red, #b3452f);
  stroke-width: 2.2;
  stroke-dasharray: 5 3;
}
.p61b-pill.is-wrong .p61b-pill__main { fill: var(--p61b-green, #3f6b57); }
.p61b-pill.is-wrong .p61b-pill__head { fill: var(--p61b-red, #b3452f); font-weight: 700; }
.p61b-pill.is-pending { opacity: 0.5; }
.p61b-pill.is-pending .p61b-pill__main { fill: var(--p61b-dim, #9aa39c); font-weight: 400; }

.p61b-why {
  fill: var(--p61b-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}

.p61b-phasetext {
  fill: var(--p61b-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
`;function Dv(){if(document.getElementById(wv))return;let e=document.createElement(`style`);e.id=wv,e.textContent=Ev,document.head.appendChild(e)}function Ov(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}var kv=680,Av=20,jv=36,Mv=40,Nv=96,Pv=134,Fv=520,Iv=544,Lv=50,Rv=42,zv=150,Bv=56,Vv=[[`错在只问「跨度够不够小」，忘了问「有没有重复」。顺子是 5 个互不相同的数 ——`,`王能填缺失的数，填不了已经出现过的数，重复出现时再多王也无解。`],[`错在把边界写宽了。5 张无王的牌要连续，跨度必须恰好是 4；写成 ≤ 5，`,`跨度 5 的牌（中间差着一个数）就被放了进去，而手里一张王都没有。`],[`错在遍历的起点。从下标 1 开始会把「王-王」这对也算成相邻对：0 - 0 - 1 = -1，`,`两张王贡献 -2 的负 gap，把真正的洞抵掉了 —— 需要补 3 个洞，账上却只有 1 个。`]];function Hv(e,t={}){if(!e||e.dataset.p61bMounted===`1`)return{destroy(){}};e.dataset.p61bMounted=`1`,Dv();let n=Cv(),r=n.filter(e=>e.phase===`hand`).map(e=>e.group),i=r.length,a=Y,o=a(`svg`,{class:`viz__svg p61b__svg`,viewBox:`0 0 ${kv} ${Iv}`,role:`img`,"aria-label":`扑克牌顺子三个经典错误与正解对照动画`}),s=a(`g`,{class:`p61b-cells`}),c=a(`g`,{class:`p61b-marks`});o.appendChild(s),o.appendChild(c);let l=a(`text`,{class:`p61b-note`,x:30,y:Av});l.textContent=`两组官方样例 [1,2,3,4,5] 与 [0,0,1,2,5] 在三个错法下全部返回 true —— 一声不响`,c.appendChild(l),c.appendChild(a(`rect`,{class:`p61b-banner__box`,x:30,y:jv,width:kv-60,height:Mv,rx:9}));let u=a(`text`,{class:`p61b-banner__seg`,x:46,y:56}),d=a(`text`,{class:`p61b-banner__seg`,x:190,y:56}),f=a(`text`,{class:`p61b-banner__val`,x:kv-46,y:56});c.append(u,d,f);let p=r.map((e,t)=>{let n=Nv+t*Pv,r=a(`g`,{class:`p61b-row is-dim`});r.appendChild(a(`rect`,{class:`p61b-row__box`,x:22,y:n,width:kv-44,height:Pv-12,rx:10}));let i=a(`text`,{class:`p61b-row__label`,x:36,y:n+18});i.textContent=`反例 ${t+1}：`;let o=a(`tspan`,{class:`p61b-row__bannerum`});o.textContent=` ${e.cards.map(H_).join(`, `)}`,i.appendChild(o);let c=a(`tspan`,{class:`p61b-row__bannerum`});c.textContent=`  · 错法「${e.bugName}」`,i.appendChild(c),r.appendChild(i),e.sorted.forEach((e,t)=>{let i=36+t*58,o=a(`g`,{class:`p61b-card${e===0?` is-joker`:``}`});o.appendChild(a(`rect`,{class:`p61b-card__box`,x:i,y:n+30,width:Lv,height:Rv,rx:6}));let s=a(`text`,{class:`p61b-card__val`,x:i+Lv/2,y:n+30+Rv/2});s.textContent=H_(e),o.appendChild(s),r.appendChild(o)});let l=(e,t,i,o,s)=>{let c=a(`g`,{class:`p61b-pill is-pending`});c.appendChild(a(`rect`,{class:`p61b-pill__box`,x:e,y:n+30,width:zv,height:Bv,rx:8}));let l=a(`text`,{class:`p61b-pill__head`,x:e+10,y:n+42});l.textContent=t;let u=a(`text`,{class:`p61b-pill__main`,x:e+10,y:n+60});u.textContent=i;let d=a(`text`,{class:`p61b-pill__sub`,x:e+10,y:n+76});return d.textContent=o,c.append(l,u,d),r.appendChild(c),{g:c,h:l,m:u,s:d}},u=l(348,`正解`,`?`,``,``),d=l(508,`错法 · ${e.bugName}`,`?`,``,``);return Vv[t].forEach((e,t)=>{let i=a(`text`,{class:`p61b-why`,x:36,y:n+100+t*17});i.textContent=e,r.appendChild(i)}),s.appendChild(r),{g:r,correctPill:u,bugPill:d,label:i}}),m=a(`text`,{class:`p61b-phasetext`,x:kv/2,y:Fv});c.appendChild(m);function h(e,t){if(t){if(p.forEach((e,n)=>{let i=r[n],a=t.groupIndex===n,o=[`p61b-row`];a?o.push(`is-cur`):o.push(`is-dim`),e.g.setAttribute(`class`,o.join(` `));let s=t.phase===`done`?!0:t.phase===`verdict`?n<=t.groupIndex:n<t.groupIndex,c=e.correctPill,l=e.bugPill;if(s){c.g.setAttribute(`class`,`p61b-pill ${i.correct?`is-yes`:`is-no`}`),c.m.textContent=i.correct?`✓ 是顺子`:`✗ 不是顺子`,c.s.textContent=i.correctReason;let e=i.bugVerdict!==i.correct;l.g.setAttribute(`class`,`p61b-pill ${e?`is-wrong`:i.bugVerdict?`is-yes`:`is-no`}`),l.m.textContent=i.bugVerdict?`✓ 判成顺子`:`✗ 判成不是`,l.s.textContent=e?`判错了 ✗`:`碰巧一致`}else t.phase===`hand`&&a?(c.g.setAttribute(`class`,`p61b-pill`),c.m.textContent=`正解怎么判？`,c.s.textContent=``,l.g.setAttribute(`class`,`p61b-pill`),l.m.textContent=`错法怎么判？`,l.s.textContent=``):(c.g.setAttribute(`class`,`p61b-pill is-pending`),c.m.textContent=`?`,c.s.textContent=``,l.g.setAttribute(`class`,`p61b-pill is-pending`),l.m.textContent=`?`,l.s.textContent=``)}),t.phase===`init`)u.textContent=`三个错法`,d.textContent=`官方样例全部失声`,f.textContent=`各配一个最小反例`;else if(t.phase===`done`)u.textContent=`共性`,d.textContent=`只盯跨度，忘了不重复和王只补缺失`,f.textContent=`方向一致：放水`;else{let e=t.group;u.textContent=`反例 ${t.groupIndex+1}/${i}`,d.textContent=t.phase===`hand`?`${e.bugCode}`:`正解 vs 错法`,f.textContent=t.phase===`hand`?`先看牌`:e.silent?`样例抓不住`:``}m.textContent=t.phase===`init`?`下面三组牌，正解全部判「不是顺子」，三个错法全部判「是顺子」—— 而且官方样例一个都抓不到。`:t.phase===`done`?`测顺子题，这三组反例 [1,2,2,3,4] / [1,2,3,4,6] / [0,0,1,2,6] 应当常备 —— 每一个都精准打在一条被忽略的约束上。`:``,Z(g,t.desc)}}let g=Ov(),_=document.createElement(`div`);_.className=`viz p61b`;let v=document.createElement(`div`);v.className=`viz__stage`,v.appendChild(o),_.appendChild(v),_.appendChild(g);let y=Q();_.appendChild(y.root),e.textContent=``,e.appendChild(_),X();let b=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,x=$({steps:n,controls:y,intervalMs:Tv,onRender:h});x.jumpTo(Math.trunc(t.initialStep)||0);let S=null;return!b&&typeof IntersectionObserver==`function`&&(S=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){S.disconnect(),S=null,x.play();return}},{threshold:.35}),S.observe(_)),{destroy(){S&&=(S.disconnect(),null),x.destroy(),e.textContent=``,delete e.dataset.p61bMounted,document.getElementById(wv)?.remove()}}}var Uv=`abcdef`,Wv=`abcdxf`;function Gv(e,t){return typeof e==`string`&&typeof t==`string`&&e.length>0&&t.length>0&&e.length<=8&&t.length<=8&&/^[a-z]+$/.test(e)&&/^[a-z]+$/.test(t)}function Kv(e={}){let t=Gv(e.s,e.t)?e.s:Uv,n=Gv(e.s,e.t)?e.t:Wv,r=t.length,i=n.length,a=[],o=(e,o)=>{a.push({phase:e,s:t,t:n,n:r,m:i,i:0,cell:null,filled:0,best:0,done:e===`done`,desc:``,...o})};o(`init`,{desc:`s = ${t}，t = ${n}，各 ${r} 个字符。求允许至多一处不等的最长公共连续子串。表格两行状态：f 是全程相等的干净后缀，g 是至多一处不等的后缀。关键只有一条 —— 不等的时候，g 只能从 f 接过额度再 +1。`});let s=Array.from({length:r+1},()=>Array(i+1).fill(0)),c=Array.from({length:r+1},()=>Array(i+1).fill(0)),l=0;for(let e=1;e<=r;e+=1){for(let r=1;r<=i;r+=1){let i=t[e-1]===n[r-1],a=s[e-1][r-1],o=c[e-1][r-1];i?(s[e][r]=a+1,c[e][r]=o+1):(s[e][r]=0,c[e][r]=Math.max(a+1,1)),c[e][r]>l&&(l=c[e][r])}let r=Math.min(e,i),a=t[e-1]===n[r-1],u=c[e-1][r-1],d={j:r,f:s[e][r],g:c[e][r],fDiag:s[e-1][r-1],gDiag:u,equal:a,rule:a?`s[${e-1}]=${t[e-1]} 与 t[${r-1}]=${n[r-1]} 相等：g = g 左上 + 1 = ${u} + 1 = ${c[e][r]}，不消耗额度`:`s[${e-1}]=${t[e-1]} 与 t[${r-1}]=${n[r-1]} 不等：f 断成 0，g = f 左上 + 1 = ${s[e-1][r-1]} + 1 = ${c[e][r]}`+(u+1===c[e][r]?``:`（若误用 g 左上 + 1 会得到 ${u+1}，虚高）`)};o(`row`,{i:e,cell:d,filled:e,best:l,desc:`第 ${e} 行填完：${Array.from({length:i},(t,n)=>c[e][n+1]).join(`、`)}。`+d.rule})}return o(`done`,{i:r,filled:r,best:l,desc:`扫完整张表，最大的 g 值是 ${l}：${t} 与 ${n} 只有 e/x 这一处不同，所以 6 个字符整体就算一段带 1 处错的公共连续子串。整题 O(n × m) 时间、O(n × m) 空间（滚动数组可压到 O(min(n, m))）。`}),a}var qv=`lc1-styles`,Jv=1300,Yv=`
.lc1 { display: flex; flex-direction: column; gap: 14px; }
.lc1__svg { width: 100%; height: auto; display: block; }

.lc1-note {
  fill: var(--lc1-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.lc1-banner__box {
  fill: var(--lc1-banner, #f4f3ef);
  stroke: var(--lc1-line, #c3c9c2);
  stroke-width: 1.5;
}
.lc1-banner__seg {
  fill: var(--lc1-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.lc1-banner__val {
  fill: var(--lc1-gold, #c2872f);
  font-size: 16px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ---- 字符条 ---- */
.lc1-ch__box {
  fill: var(--lc1-fill, #ffffff);
  stroke: var(--lc1-line, #c3c9c2);
  stroke-width: 1.3;
}
.lc1-ch__v {
  fill: var(--lc1-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc1-ch.is-s .lc1-ch__box { stroke: var(--lc1-hi, #3d6a8f); }
.lc1-ch.is-s .lc1-ch__v { fill: var(--lc1-hi, #3d6a8f); }
.lc1-ch.is-t .lc1-ch__box { stroke: var(--lc1-low, #3f6b57); }
.lc1-ch.is-t .lc1-ch__v { fill: var(--lc1-low, #3f6b57); }
.lc1-ch.is-cur .lc1-ch__box {
  fill: var(--lc1-cur-fill, #f8ece5);
  stroke: var(--lc1-cur, #a45f45);
  stroke-width: 2.6;
}
.lc1-ch.is-cur .lc1-ch__v { fill: var(--lc1-cur, #a45f45); }
.lc1-slabel {
  fill: var(--lc1-dim, #9aa39c);
  font-size: 11px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ---- DP 表格 ---- */
.lc1-cell__box {
  fill: var(--lc1-fill, #ffffff);
  stroke: var(--lc1-line, #c3c9c2);
  stroke-width: 1.1;
}
.lc1-cell__g {
  fill: var(--lc1-dim, #9aa39c);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc1-cell__f {
  fill: var(--lc1-line, #c3c9c2);
  font-size: 9.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc1-cell.is-filled .lc1-cell__g { fill: var(--lc1-ink, #1f2a24); }
.lc1-cell.is-filled .lc1-cell__f { fill: var(--lc1-muted, #657168); }
/* 顺序即优先级：is-row（当前行浅底） < is-best（最优格绿） < is-cur（讲解格金） */
.lc1-cell.is-row .lc1-cell__box { fill: var(--lc1-banner, #f4f3ef); }
.lc1-cell.is-best .lc1-cell__box {
  fill: var(--lc1-green-fill, #eaf3ee);
  stroke: var(--lc1-green, #3f6b57);
  stroke-width: 1.8;
}
.lc1-cell.is-best .lc1-cell__g { fill: var(--lc1-green, #3f6b57); }
.lc1-cell.is-cur .lc1-cell__box {
  fill: var(--lc1-gold-fill, #fdf3e3);
  stroke: var(--lc1-gold, #c2872f);
  stroke-width: 2.8;
}
.lc1-cell.is-cur .lc1-cell__g { fill: var(--lc1-gold, #c2872f); font-size: 17px; }
.lc1-cell.is-off .lc1-cell__box { stroke-dasharray: 2 3; }

.lc1-head {
  fill: var(--lc1-muted, #657168);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc1-legend {
  fill: var(--lc1-muted, #657168);
  font-size: 11px;
  text-anchor: start;
  dominant-baseline: central;
}

/* ---- 规则面板 ---- */
.lc1-rule__box {
  fill: var(--lc1-fill, #ffffff);
  stroke: var(--lc1-line, #c3c9c2);
  stroke-width: 1.4;
}
.lc1-rule.is-on .lc1-rule__box {
  fill: var(--lc1-gold-fill, #fdf3e3);
  stroke: var(--lc1-gold, #c2872f);
  stroke-width: 2.4;
}
.lc1-rule__head {
  fill: var(--lc1-muted, #657168);
  font-size: 11.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.lc1-rule.is-on .lc1-rule__head { fill: var(--lc1-gold, #c2872f); font-weight: 700; }
.lc1-rule__eq {
  fill: var(--lc1-ink, #1f2a24);
  font-size: 13px;
  text-anchor: start;
  dominant-baseline: central;
}
.lc1-rule__warn {
  fill: var(--lc1-red, #b3452f);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}
.lc1-rule__warn.is-off { opacity: 0; }

.lc1-phasetext {
  fill: var(--lc1-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
`;function Xv(){if(document.getElementById(qv))return;let e=document.createElement(`style`);e.id=qv,e.textContent=Yv,document.head.appendChild(e)}function Zv(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}var Qv=680,$v=20,ey=36,ty=40,ny=100,ry=26,iy=172,ay=72,oy=32,sy=396,cy=62,ly=484,uy=502;function dy(e,t={}){if(!e||e.dataset.lc1Mounted===`1`)return{destroy(){}};e.dataset.lc1Mounted=`1`,Xv();let n=Kv(t),{s:r,t:i,n:a,m:o}=n[0],s=Y,c=s(`svg`,{class:`viz__svg lc1__svg`,viewBox:`0 0 ${Qv} ${uy}`,role:`img`,"aria-label":`允许一处错误的最长公共连续子串：双状态 DP 动画`}),l=s(`g`,{class:`lc1-cells`}),u=s(`g`,{class:`lc1-marks`});c.appendChild(l),c.appendChild(u);let d=s(`text`,{class:`lc1-note`,x:30,y:$v});d.textContent=`s = ${r} · t = ${i} · 大数字 = g（至多一处不等） · 左上小数字 = f（全程相等）`,u.appendChild(d),u.appendChild(s(`rect`,{class:`lc1-banner__box`,x:30,y:ey,width:Qv-60,height:ty,rx:9}));let f=s(`text`,{class:`lc1-banner__seg`,x:46,y:56}),p=s(`text`,{class:`lc1-banner__seg`,x:190,y:56}),m=s(`text`,{class:`lc1-banner__val`,x:Qv-46,y:56});u.append(f,p,m);let h=(Qv-ay*(o+1))/2,g=e=>h+e*ay,_=s(`text`,{class:`lc1-slabel`,x:h-8,y:113});_.textContent=`s`;let v=s(`text`,{class:`lc1-slabel`,x:h-8,y:147});v.textContent=`t`,u.append(_,v);let y=[];for(let e=1;e<=o;e+=1)for(let[t,n,a]of[[0,r,`is-s`],[1,i,`is-t`]]){let r=ny+t*34,i=s(`g`,{class:`lc1-ch ${a}`});i.appendChild(s(`rect`,{class:`lc1-ch__box`,x:g(e)+8,y:r,width:ay-16,height:ry,rx:6}));let o=s(`text`,{class:`lc1-ch__v`,x:g(e)+ay/2,y:r+ry/2});o.textContent=n[e-1],i.appendChild(o),l.appendChild(i),y.push({g:i,j:e,row:t})}for(let e=1;e<=o;e+=1){let t=s(`text`,{class:`lc1-head`,x:g(e)+ay/2,y:161});t.textContent=`t${e-1}`,u.appendChild(t)}let b=[];for(let e=1;e<=a;e+=1){let t=iy+(e-1)*oy,n=s(`text`,{class:`lc1-head`,x:h-8,y:t+oy/2});n.textContent=`s${e-1}`,u.appendChild(n);for(let n=1;n<=o;n+=1){let r=g(n),i=s(`g`,{class:`lc1-cell is-off`});i.appendChild(s(`rect`,{class:`lc1-cell__box`,x:r,y:t,width:ay,height:oy,rx:5}));let a=s(`text`,{class:`lc1-cell__g`,x:r+ay/2,y:t+oy/2+1}),o=s(`text`,{class:`lc1-cell__f`,x:r+5,y:t+10});i.append(a,o),l.appendChild(i),b.push({g:i,gv:a,fv:o,i:e,j:n})}}let x=s(`g`,{class:`lc1-rule`});x.appendChild(s(`rect`,{class:`lc1-rule__box`,x:30,y:sy,width:Qv-60,height:cy,rx:9}));let S=s(`text`,{class:`lc1-rule__head`,x:48,y:413}),C=s(`text`,{class:`lc1-rule__eq`,x:48,y:433}),w=s(`text`,{class:`lc1-rule__warn`,x:48,y:449});x.append(S,C,w),l.appendChild(x);let T=s(`text`,{class:`lc1-phasetext`,x:Qv/2,y:ly});u.appendChild(T);let E={init:`「连续」= 子串：对齐时只能沿对角线一格一格走，不能像普通 LCS 那样跳格。`,row:`每格算两遍：f 记干净后缀，g 记至多一处不等的后缀。答案取全表最大的 g。`,done:`答案 = 全表最大的 g。时间 O(n × m)，滚动数组可压到 O(min(n, m)) 空间。`};function D(e,t){if(!t)return;let n=t.phase===`row`?t.cell:null,s=n?t.i:-1,c=n?n.j:-1;y.forEach(({g:e,j:t,row:r})=>{let i=[`lc1-ch`,r===0?`is-s`:`is-t`];n&&(t===c||r===0&&t===s||r===1&&t===c)&&i.push(`is-cur`),e.setAttribute(`class`,i.join(` `))});let l=null;if(t.phase!==`init`){let e=Array.from({length:a+1},()=>Array(o+1).fill(0)),n=Array.from({length:a+1},()=>Array(o+1).fill(0));for(let s=1;s<=Math.min(a,t.filled);s+=1)for(let t=1;t<=o;t+=1)r[s-1]===i[t-1]?(e[s][t]=e[s-1][t-1]+1,n[s][t]=n[s-1][t-1]+1):(e[s][t]=0,n[s][t]=Math.max(e[s-1][t-1]+1,1)),n[s][t]>0&&(!l||n[s][t]>n[l[0]][l[1]])&&(l=[s,t]);b.forEach(({gv:t,fv:r,i,j:a})=>{t.textContent=String(n[i][a]),r.textContent=String(e[i][a])})}if(b.forEach(({g:e,i:n,j:r})=>{let i=n<=t.filled,a=s===n,o=a&&c===r,u=i&&l&&l[0]===n&&l[1]===r,d=[`lc1-cell`];i?(d.push(`is-filled`),a&&d.push(`is-row`),u&&d.push(`is-best`)):d.push(`is-off`),o&&d.push(`is-cur`),e.setAttribute(`class`,d.join(` `))}),n){x.setAttribute(`class`,`lc1-rule is-on`),S.textContent=`第 ${t.i} 行 · 讲解格 (${t.i}, ${n.j})：s[${t.i-1}]=${r[t.i-1]} 对 t[${n.j-1}]=${i[n.j-1]}`,C.textContent=n.equal?`相等 → f = ${n.fDiag} + 1 = ${n.f}，g = g 左上 ${n.gDiag} + 1 = ${n.g}（不消耗额度）`:`不等 → f 断成 0，g = f 左上 ${n.fDiag} + 1 = ${n.g}（额度只能从 f 接）`;let e=!n.equal&&n.gDiag+1!==n.g;w.setAttribute(`class`,`lc1-rule__warn ${e?``:`is-off`}`),w.textContent=e?`若误用 g 左上 + 1 = ${n.gDiag+1}，答案虚高`:``}else x.setAttribute(`class`,`lc1-rule`),S.textContent=t.phase===`done`?`全表扫完：最大 g = ${t.best}`:`转移规则`,C.textContent=t.phase===`done`?`答案取全表最大的 g —— 至多一处不等的最长公共连续子串`:`相等：f/g 都沿对角 +1；不等：f 归 0，g = f 左上 + 1`,w.setAttribute(`class`,`lc1-rule__warn is-off`);t.phase===`init`?(f.textContent=`准备`,p.textContent=`两行状态 f / g`,m.textContent=`${a} × ${o}`):t.phase===`done`?(f.textContent=`扫完整表`,p.textContent=`最大 g`,m.textContent=String(t.best)):(f.textContent=`第 ${t.i} / ${a} 行`,p.textContent=n.equal?`对角续上`:`不等 · 断 f 接 g`,m.textContent=`best ${t.best}`),T.textContent=E[t.phase]||``,Z(O,t.desc)}let O=Zv(),k=document.createElement(`div`);k.className=`viz lc1`;let A=document.createElement(`div`);A.className=`viz__stage`,A.appendChild(c),k.appendChild(A),k.appendChild(O);let j=Q();k.appendChild(j.root),e.textContent=``,e.appendChild(k),X();let M=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,N=$({steps:n,controls:j,intervalMs:Jv,onRender:D});N.jumpTo(Math.trunc(t.initialStep)||0);let P=null;return t.autoplay!==!1&&!M&&typeof IntersectionObserver==`function`&&(P=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){P.disconnect(),P=null,N.play();return}},{threshold:.35}),P.observe(k)),{destroy(){P&&=(P.disconnect(),null),N.destroy(),e.textContent=``,delete e.dataset.lc1Mounted,document.getElementById(qv)?.remove()}}}var fy=`abcdef`,py=`bcdefa`;function my(e,t){return typeof e==`string`&&typeof t==`string`&&e.length>0&&t.length>0&&e.length<=8&&t.length<=8&&/^[a-z]+$/.test(e)&&/^[a-z]+$/.test(t)}function hy(e,t){let n=e.length,r=t.length,i=Array.from({length:n+1},()=>Array(r+1).fill(0)),a=Array.from({length:n+1},()=>Array(r+1).fill(0)),o=Array.from({length:n+1},()=>Array(r+1).fill(0));for(let s=1;s<=n;s+=1)for(let n=1;n<=r;n+=1)e[s-1]===t[n-1]?(i[s][n]=i[s-1][n-1]+1,a[s][n]=a[s-1][n-1]+1,o[s][n]=o[s-1][n-1]+1):(i[s][n]=0,a[s][n]=Math.max(i[s-1][n-1]+1,1),o[s][n]=o[s-1][n-1]+1);return{f:i,gOk:a,gBug:o}}function gy(e={}){let t=my(e.s,e.t)?e.s:fy,n=my(e.s,e.t)?e.t:py,r=t.length,i=n.length,{f:a,gOk:o,gBug:s}=hy(t,n),c=Math.max(...o.flat()),l=Math.max(...s.flat()),u=(e,t)=>a[e][t],d=[],f=(e,a)=>{d.push({phase:e,s:t,t:n,n:r,m:i,path:null,i:0,j:0,charS:``,charT:``,equal:!1,value:0,cells:[],bestOk:c,bestBug:l,done:e===`done`,desc:``,...a})};f(`init`,{desc:`s = ${t}，t = ${n}。公共连续子串只能沿对角线走 —— 逐格对齐，不能跳。这组输入把两条路径的差别照得很清楚：一条是正解的全等走法，一条是「错误配额被重复消耗」的错法走法。`});let p=[];for(let e=1;e<Math.min(r,i);e+=1){let r=e+1,i=e,a=t[r-1]===n[i-1],s=o[r][i];p.push([r,i,s,u(r,i)]),f(`walk`,{path:`ok`,i:r,j:i,charS:t[r-1],charT:n[i-1],equal:a,value:s,cells:p.map(e=>[...e]),desc:a?`正解走次对角线：s[${r-1}]=${t[r-1]} 对上 t[${i-1}]=${n[i-1]}，相等，g 沿对角续到 ${s}。这 5 格全等 —— "bcdef" 本身就是一个 0 错的公共连续子串。`:`第 ${e} 格不相等，连续段断掉，g 退回 ${s}。`})}let m=[];for(let e=1;e<=Math.min(r,i);e+=1){let r=e,i=e,a=t[r-1]===n[i-1],o=s[r][i];m.push([r,i,o]),f(`walk`,{path:`bug`,i:r,j:i,charS:t[r-1],charT:n[i-1],equal:a,value:o,cells:m.map(e=>[...e]),desc:a?`错法走主对角线第 ${e} 格：这一格相等，g = g 左上 + 1 = ${o}。`:`错法走主对角线第 ${e} 格：s[${r-1}]=${t[r-1]} 与 t[${i-1}]=${n[i-1]} 不等，但 g 又从「g 左上」+1 拿到了 ${o} —— 同一个字符上第二次消耗错误配额，这就是虚高的来源。`})}return f(`done`,{desc:`对照收尾：正解 ${c}（"bcdef"，0 处错），错法 ${l}（把 ${r} 个全不等的位置当成一次错误串起来）。差的这一格就是「错误配额被重复消耗」的全部代价 —— 全量对拍统计里，这个错法在 61.8% 的输入上都与正解不同。`}),d}var _y=`lc1w-styles`,vy=1e3,yy=`
.lc1w { display: flex; flex-direction: column; gap: 14px; }
.lc1w__svg { width: 100%; height: auto; display: block; }

.lc1w-note {
  fill: var(--lc1w-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.lc1w-banner__box {
  fill: var(--lc1w-banner, #f4f3ef);
  stroke: var(--lc1w-line, #c3c9c2);
  stroke-width: 1.5;
}
.lc1w-banner__seg {
  fill: var(--lc1w-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.lc1w-banner__val {
  font-size: 16px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc1w-banner__val.is-ok { fill: var(--lc1w-green, #3f6b57); }
.lc1w-banner__val.is-bug { fill: var(--lc1w-red, #b3452f); }

/* ---- 字符条 ---- */
.lc1w-ch__box {
  fill: var(--lc1w-fill, #ffffff);
  stroke: var(--lc1w-line, #c3c9c2);
  stroke-width: 1.3;
}
.lc1w-ch__v {
  fill: var(--lc1w-ink, #1f2a24);
  font-size: 18px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc1w-ch.is-s .lc1w-ch__v { fill: var(--lc1w-hi, #3d6a8f); }
.lc1w-ch.is-t .lc1w-ch__v { fill: var(--lc1w-low, #3f6b57); }
.lc1w-ch.is-ok .lc1w-ch__box {
  fill: var(--lc1w-green-fill, #eaf3ee);
  stroke: var(--lc1w-green, #3f6b57);
  stroke-width: 2.6;
}
.lc1w-ch.is-bug .lc1w-ch__box {
  fill: var(--lc1w-red-fill, #f9ece8);
  stroke: var(--lc1w-red, #b3452f);
  stroke-width: 2.6;
}
.lc1w-ch.is-rest .lc1w-ch__box { stroke-dasharray: 3 3; }
.lc1w-ch.is-off .lc1w-ch__box { opacity: 0.25; }
.lc1w-slabel {
  fill: var(--lc1w-dim, #9aa39c);
  font-size: 11px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ---- 迷你网格 ---- */
.lc1w-g__box {
  fill: var(--lc1w-fill, #ffffff);
  stroke: var(--lc1w-line, #c3c9c2);
  stroke-width: 1;
}
.lc1w-g.is-off .lc1w-g__box { stroke-dasharray: 2 3; }
.lc1w-g.is-ok .lc1w-g__box {
  fill: var(--lc1w-green-fill, #eaf3ee);
  stroke: var(--lc1w-green, #3f6b57);
  stroke-width: 1.6;
}
.lc1w-g.is-bug .lc1w-g__box {
  fill: var(--lc1w-red-fill, #f9ece8);
  stroke: var(--lc1w-red, #b3452f);
  stroke-width: 1.6;
}
.lc1w-g__v {
  fill: var(--lc1w-muted, #657168);
  font-size: 10px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc1w-g.is-ok .lc1w-g__v { fill: var(--lc1w-green, #3f6b57); }
.lc1w-g.is-bug .lc1w-g__v { fill: var(--lc1w-red, #b3452f); }
.lc1w-grid-label {
  fill: var(--lc1w-muted, #657168);
  font-size: 11px;
  text-anchor: start;
  dominant-baseline: central;
}

/* ---- 结论对照 ---- */
.lc1w-verdict__box {
  fill: var(--lc1w-fill, #ffffff);
  stroke: var(--lc1w-line, #c3c9c2);
  stroke-width: 1.5;
}
.lc1w-verdict__main {
  font-size: 22px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}
.lc1w-verdict__label {
  fill: var(--lc1w-muted, #657168);
  font-size: 11.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.lc1w-verdict.is-ok .lc1w-verdict__box {
  fill: var(--lc1w-green-fill, #eaf3ee);
  stroke: var(--lc1w-green, #3f6b57);
  stroke-width: 2.6;
}
.lc1w-verdict.is-ok .lc1w-verdict__main { fill: var(--lc1w-green, #3f6b57); }
.lc1w-verdict.is-bug .lc1w-verdict__box {
  fill: var(--lc1w-red-fill, #f9ece8);
  stroke: var(--lc1w-red, #b3452f);
  stroke-width: 2.6;
}
.lc1w-verdict.is-bug .lc1w-verdict__main { fill: var(--lc1w-red, #b3452f); }
.lc1w-verdict.is-idle { opacity: 0.45; }

.lc1w-phasetext {
  fill: var(--lc1w-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
`;function by(){if(document.getElementById(_y))return;let e=document.createElement(`style`);e.id=_y,e.textContent=yy,document.head.appendChild(e)}function xy(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}var Sy=680,Cy=20,wy=36,Ty=40,Ey=96,Dy=52,Oy=28,ky=10,Ay=186,jy=196,My=24,Ny=30,Py=362,Fy=372,Iy=240,Ly=60,Ry=456,zy=474;function By(e,t={}){if(!e||e.dataset.lc1wMounted===`1`)return{destroy(){}};e.dataset.lc1wMounted=`1`,by();let n=gy(t),{s:r,t:i,n:a,m:o}=n[0],s=Y,c=s(`svg`,{class:`viz__svg lc1w__svg`,viewBox:`0 0 ${Sy} ${zy}`,role:`img`,"aria-label":`公共连续子串两条走位路径对照：正确路径与错误配额重复消耗的错法`}),l=s(`g`,{class:`lc1w-cells`}),u=s(`g`,{class:`lc1w-marks`});c.appendChild(l),c.appendChild(u);let d=s(`text`,{class:`lc1w-note`,x:30,y:Cy});d.textContent=`s = ${r} · t = ${i} · 公共连续子串只能沿对角线走，一格一格不能跳`,u.appendChild(d),u.appendChild(s(`rect`,{class:`lc1w-banner__box`,x:30,y:wy,width:Sy-60,height:Ty,rx:9}));let f=s(`text`,{class:`lc1w-banner__seg`,x:46,y:56}),p=s(`text`,{class:`lc1w-banner__seg`,x:200,y:56}),m=s(`text`,{class:`lc1w-banner__val`,x:Sy-46,y:56});u.append(f,p,m);let h=(Sy-(a*Dy+(a-1)*ky))/2,g=[];for(let e=0;e<2;e+=1){let t=e===0?r:i,n=Ey+e*38,o=s(`text`,{class:`lc1w-slabel`,x:h-10,y:n+Oy/2});o.textContent=e===0?`s`:`t`,u.appendChild(o);for(let r=0;r<a;r+=1){let i=h+r*62,a=s(`g`,{class:`lc1w-ch ${e===0?`is-s`:`is-t`}`});a.appendChild(s(`rect`,{class:`lc1w-ch__box`,x:i,y:n,width:Dy,height:Oy,rx:6}));let o=s(`text`,{class:`lc1w-ch__v`,x:i+Dy/2,y:n+Oy/2});o.textContent=t[r],a.appendChild(o),l.appendChild(a),g.push({g:a,row:e,i:r})}}let _=s(`text`,{class:`lc1w-grid-label`,x:30,y:Ay});_.textContent=`走过的格（行 = s，列 = t）：绿 = 正解 · 红 = 错法`,u.appendChild(_);let v=(Sy-o*Ny)/2,y=[];for(let e=1;e<=a;e+=1)for(let t=1;t<=o;t+=1){let n=v+(t-1)*Ny,r=jy+(e-1)*My,i=s(`g`,{class:`lc1w-g is-off`});i.appendChild(s(`rect`,{class:`lc1w-g__box`,x:n,y:r,width:Ny-5,height:My-4,rx:4}));let a=s(`text`,{class:`lc1w-g__v`,x:n+(Ny-5)/2,y:r+(My-4)/2});i.appendChild(a),l.appendChild(i),y.push({g:i,v:a,i:e,j:t})}let b=s(`text`,{class:`lc1w-verdict__label`,x:Sy/2,y:Py});b.textContent=`收尾对照`,u.appendChild(b);let x=Math.floor((Sy-Iy*2-40)/2),S=(e,t)=>{let n=s(`g`,{class:`lc1w-verdict is-idle`});n.appendChild(s(`rect`,{class:`lc1w-verdict__box`,x:e,y:Fy,width:Iy,height:Ly,rx:9}));let r=s(`text`,{class:`lc1w-verdict__label`,x:e+Iy/2,y:389});r.textContent=t;let i=s(`text`,{class:`lc1w-verdict__main`,x:e+Iy/2,y:412});return n.append(r,i),l.appendChild(n),{g:n,m:i}},C=S(x,`正解（额度从 f 接）`),w=S(360,`错法（额度从 g 接）`),T=s(`text`,{class:`lc1w-phasetext`,x:Sy/2,y:Ry});u.appendChild(T);let E=n.filter(e=>e.phase===`walk`&&e.path===`ok`).map(e=>e.cells[e.cells.length-1]),D=n.filter(e=>e.phase===`walk`&&e.path===`bug`).map(e=>e.cells[e.cells.length-1]);function O(e,t){if(!t)return;let n=t.path,r=t.cells||[],i=t.phase===`done`;g.forEach(({g:e,row:t,i:a})=>{let o=[`lc1w-ch`,t===0?`is-s`:`is-t`];if(n===null){o.push(i?`is-rest`:`is-off`),e.setAttribute(`class`,o.join(` `));return}r.some(([e,n])=>(t===0?e-1:n-1)===a)?o.push(n===`ok`?`is-ok`:`is-bug`):o.push(`is-rest`),e.setAttribute(`class`,o.join(` `))}),y.forEach(({g:e,v:t,i:a,j:o})=>{let s=r.find(([e,t])=>e===a&&t===o),c=i?E.find(([e,t])=>e===a&&t===o):null,l=r.find(([e,t])=>e===a&&t===o),u=i?D.find(([e,t])=>e===a&&t===o):null,d=`lc1w-g`,f=``;n===`ok`?s?(d+=` is-ok`,f=String(s[2])):d+=` is-off`:n===`bug`?l?(d+=` is-bug`,f=String(l[2])):d+=` is-off`:i?c?(d+=` is-ok`,f=String(c[2])):u?(d+=` is-bug`,f=String(u[2])):d+=` is-off`:d+=` is-off`,e.setAttribute(`class`,d),t.textContent=f});let a=n===`ok`||t.phase===`done`,o=n===`bug`||t.phase===`done`,s=e=>e.length?Math.max(...e.map(e=>e[2])):0;if(C.g.setAttribute(`class`,`lc1w-verdict ${a?`is-ok`:`is-idle`}`),C.m.textContent=a?String(i||n===`bug`?t.bestOk:s(r)):`?`,w.g.setAttribute(`class`,`lc1w-verdict ${o?`is-bug`:`is-idle`}`),w.m.textContent=o?String(i||n===`ok`?t.bestBug:s(r)):`?`,t.phase===`init`)f.textContent=`准备`,p.textContent=`两条路径，一条对一条错`,m.textContent=``,m.setAttribute(`class`,`lc1w-banner__val`);else if(t.phase===`done`)f.textContent=`对照收尾`,p.textContent=`正解 ${t.bestOk} vs 错法 ${t.bestBug}`,m.textContent=`差 ${t.bestBug-t.bestOk}`,m.setAttribute(`class`,`lc1w-banner__val is-bug`);else{let e=n===`ok`;f.textContent=e?`正解路径（次对角线）`:`错法路径（主对角线）`,p.textContent=`(${t.i}, ${t.j}) '${t.charS}' vs '${t.charT}'`,m.textContent=`g = ${t.value}`,m.setAttribute(`class`,`lc1w-banner__val ${e?`is-ok`:`is-bug`}`)}T.textContent=t.phase===`init`?`正解只从干净的 f 接过错误额度；错法让同一个字符反复消耗额度，答案一路虚涨。`:t.phase===`done`?`正解 ${t.bestOk} 对应 "bcdef"（0 处错）；错法 ${t.bestBug} 把 6 个不等位置当成一次错误串了起来。`:``,Z(k,t.desc)}let k=xy(),A=document.createElement(`div`);A.className=`viz lc1w`;let j=document.createElement(`div`);j.className=`viz__stage`,j.appendChild(c),A.appendChild(j),A.appendChild(k);let M=Q();A.appendChild(M.root),e.textContent=``,e.appendChild(A),X();let N=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,P=$({steps:n,controls:M,intervalMs:vy,onRender:O});P.jumpTo(Math.trunc(t.initialStep)||0);let F=null;return t.autoplay!==!1&&!N&&typeof IntersectionObserver==`function`&&(F=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){F.disconnect(),F=null,P.play();return}},{threshold:.35}),F.observe(A)),{destroy(){F&&=(F.disconnect(),null),P.destroy(),e.textContent=``,delete e.dataset.lc1wMounted,document.getElementById(_y)?.remove()}}}var Vy=[37,12,37,5,63,42],Hy=64;function Uy(e={}){let t=Array.isArray(e.input)&&e.input.length>0&&e.input.every(e=>Number.isInteger(e)&&e>=0&&e<Hy)?e.input.slice():Vy.slice(),n=[],r=[],i=[],a=(e,a)=>{n.push({phase:e,input:t,size:Hy,value:null,word:0,bit:0,already:!1,placed:r.slice(),skipped:i.slice(),distinct:r.slice().sort((e,t)=>e-t),done:e===`done`,desc:``,...a})};return a(`init`,{desc:`输入 ${t.length} 个整数：${t.join(`、`)}，值域 0 ~ ${Hy-1}。位图的做法：开一片连续的内存，值域里每个整数对应 1 bit —— 出现过就把那 1 bit 置 1。重复的数再到来时那一位已经是 1，天然去重；最后按 bit 下标从小到大扫一遍，输出就是有序去重序列。`}),t.forEach((e,t)=>{let n=e>>5,o=e&31,s=r.includes(e);a(`locate`,{value:e,word:n,bit:o,already:s,desc:`第 ${t+1} 个数 ${e}：算它落在哪 —— word = ${e} >> 5 = ${n}（第 ${n} 个字，每字装 32 个数），bit = ${e} & 31 = ${o}（字内第 ${o} 位）。换算成人话：${e} = ${n} × 32 + ${o}。`}),s?(i.push(e),a(`act`,{value:e,word:n,bit:o,already:!0,desc:`这一位已经是 1 —— ${e} 之前出现过，直接跳过。这就是位图去重：不需要哈希表、不需要比较，看一眼 bit 就够。`})):(r.push(e),a(`act`,{value:e,word:n,bit:o,already:!1,desc:`这一位还是 0 —— 新数。执行置位：words[${n}] |= 1 << ${o}。注意是 |=（按位或）：只翻本位，同字其他位原样不动；写成 = 会把整个字冲掉。已放入 ${r.length} 个。`}))}),a(`done`,{value:null,desc:`扫描全位图（0 到 ${Hy-1} 逐位看）：置了 1 的位依次是 ${r.slice().sort((e,t)=>e-t).join(`、`)}。${t.length} 个输入去重后剩 ${r.length} 个，且天然有序 —— 这就是「10 亿个数排序去重」的全部魔法：值域 10^9 时位图只要 119 MiB，而原数组是 4 GB。`}),n}var Wy=`bm-styles`,Gy=900,Ky=`
.bm { display: flex; flex-direction: column; gap: 14px; }
.bm__svg { width: 100%; height: auto; display: block; }

.bm-note {
  fill: var(--bm-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.bm-banner__box {
  fill: var(--bm-banner, #f4f3ef);
  stroke: var(--bm-line, #c3c9c2);
  stroke-width: 1.5;
}
.bm-banner__seg {
  fill: var(--bm-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.bm-banner__val {
  fill: var(--bm-gold, #c2872f);
  font-size: 16px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bm-seclabel {
  fill: var(--bm-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}

/* ---- 位图阵列 ---- */
.bm-wordlabel {
  fill: var(--bm-muted, #657168);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
}
.bm-ruler {
  fill: var(--bm-dim, #9aa39c);
  font-size: 10px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bm-cell__box {
  fill: var(--bm-fill, #ffffff);
  stroke: var(--bm-line, #c3c9c2);
  stroke-width: 1;
}
.bm-cell.is-on .bm-cell__box {
  fill: var(--bm-green-fill, #eaf3ee);
  stroke: var(--bm-green, #3f6b57);
}
.bm-cell.is-cur .bm-cell__box {
  fill: var(--bm-cur-fill, #f8ece5);
  stroke: var(--bm-cur, #a45f45);
  stroke-width: 2.6;
}
.bm-cell.is-skip .bm-cell__box {
  fill: var(--bm-gold-fill, #fdf3e3);
  stroke: var(--bm-gold, #c2872f);
  stroke-width: 2.2;
}
.bm-cell.is-empty .bm-cell__box { stroke-dasharray: 2 2; }

/* ---- 定位等式 ---- */
/* 含 × 和中文（字/位），不能用 Consolas —— 走继承字体 */
.bm-eq {
  fill: var(--bm-ink, #1f2a24);
  font-size: 14.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.bm-eq .eq-v { fill: var(--bm-cur, #a45f45); font-weight: 700; }
.bm-eq .eq-w { fill: var(--bm-hi, #3d6a8f); font-weight: 700; }
.bm-eq .eq-b { fill: var(--bm-green, #3f6b57); font-weight: 700; }
.bm-eq.is-generic { opacity: 0.55; }

/* ---- 输出 chips ---- */
.bm-chip__box {
  fill: var(--bm-fill, #ffffff);
  stroke: var(--bm-line, #c3c9c2);
  stroke-width: 1.4;
}
.bm-chip__val {
  fill: var(--bm-green, #3f6b57);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bm-chip.is-new .bm-chip__box {
  stroke: var(--bm-gold, #c2872f);
  stroke-width: 2.4;
}
.bm-chip.is-new .bm-chip__val { fill: var(--bm-gold, #c2872f); }
.bm-chip.is-off { opacity: 0; }

/* ---- 判定 ---- */
.bm-verdict__box {
  fill: var(--bm-fill, #ffffff);
  stroke: var(--bm-line, #c3c9c2);
  stroke-width: 1.5;
}
.bm-verdict__label {
  fill: var(--bm-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}
.bm-verdict__main {
  fill: var(--bm-dim, #9aa39c);
  font-size: 19px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.bm-verdict__sub {
  fill: var(--bm-muted, #657168);
  font-size: 12.5px;
  text-anchor: end;
  dominant-baseline: central;
}
.bm-verdict.is-on .bm-verdict__box {
  fill: var(--bm-green-fill, #eaf3ee);
  stroke: var(--bm-green, #3f6b57);
  stroke-width: 2.6;
}
.bm-verdict.is-on .bm-verdict__main { fill: var(--bm-green, #3f6b57); }

.bm-phasetext {
  fill: var(--bm-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
`;function qy(){if(document.getElementById(Wy))return;let e=document.createElement(`style`);e.id=Wy,e.textContent=Ky,document.head.appendChild(e)}function Jy(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}var Yy=680,Xy=20,Zy=36,Qy=40,$y=100,eb=26,tb=[112,144],nb=17,rb=64,ib=186,ab=216,ob=250,sb=260,cb=34,lb=336,ub=50,db=424,fb=442,pb=64,mb=2;function hb(e,t={}){if(!e||e.dataset.bmMounted===`1`)return{destroy(){}};e.dataset.bmMounted=`1`,qy();let n=Uy(t),r=n[0],i=Y,a=i(`svg`,{class:`viz__svg bm__svg`,viewBox:`0 0 ${Yy} ${fb}`,role:`img`,"aria-label":`位图排序去重动画：置位、判重、扫描输出`}),o=i(`g`,{class:`bm-cells`}),s=i(`g`,{class:`bm-marks`});a.appendChild(o),a.appendChild(s);let c=i(`text`,{class:`bm-note`,x:30,y:Xy});c.textContent=`输入 ${r.input.length} 个整数（${r.input.join(`、`)}）· 值域 0 ~ ${pb-1} · 每个整数只占 1 bit`,s.appendChild(c),s.appendChild(i(`rect`,{class:`bm-banner__box`,x:30,y:Zy,width:Yy-60,height:Qy,rx:9}));let l=i(`text`,{class:`bm-banner__seg`,x:46,y:56}),u=i(`text`,{class:`bm-banner__seg`,x:150,y:56}),d=i(`text`,{class:`bm-banner__val`,x:Yy-46,y:56});s.append(l,u,d);let f=i(`text`,{class:`bm-seclabel`,x:30,y:$y});f.textContent=`位图：${mb} 个字 × 32 位（绿 = 已置位，橙 = 当前位，金 = 命中重复）`,s.appendChild(f);let p=[];for(let e=0;e<pb;e+=1){let t=e>>5,n=rb+(e&31)*19,r=tb[t],a=i(`g`,{class:`bm-cell is-empty`});a.appendChild(i(`rect`,{class:`bm-cell__box`,x:n,y:r,width:nb,height:eb,rx:3})),o.appendChild(a),p.push({g:a,v:e})}for(let e=0;e<mb;e+=1){let t=i(`text`,{class:`bm-wordlabel`,x:rb-8,y:tb[e]+eb/2});t.textContent=`字 ${e}`,s.appendChild(t)}for(let e=0;e<32;e+=4){let t=i(`text`,{class:`bm-ruler`,x:rb+e*19+nb/2,y:ib});t.textContent=String(e),s.appendChild(t)}let m=i(`text`,{class:`bm-eq`,x:Yy/2,y:ab});s.appendChild(m);let h=(e,t)=>{let n=i(`tspan`,t?{class:t}:null);return n.textContent=e,n},g=e=>{m.textContent=``,e.value===null?(m.appendChild(h(`v = word × 32 + bit —— 置位 words[word] |= 1 << bit`)),m.setAttribute(`class`,`bm-eq is-generic`)):(m.appendChild(h(`${e.value} = `)),m.appendChild(h(`${e.word}`,`eq-w`)),m.appendChild(h(` × 32 + `)),m.appendChild(h(`${e.bit}`,`eq-b`)),e.phase===`act`&&(m.appendChild(h(`   ·   words[${e.word}] ${e.already?`>>`:`|=`} `)),m.appendChild(h(`1 << ${e.bit}`,`eq-b`))),m.setAttribute(`class`,`bm-eq`))},_=i(`text`,{class:`bm-seclabel`,x:30,y:ob});_.textContent=`已置位的值（扫描位图即得，天然升序）`,s.appendChild(_);let v=[];for(let e=0;e<12;e+=1){let t=30+e%6*62,n=sb+Math.floor(e/6)*42,r=i(`g`,{class:`bm-chip is-off`});r.appendChild(i(`rect`,{class:`bm-chip__box`,x:t,y:n,width:52,height:cb,rx:7}));let a=i(`text`,{class:`bm-chip__val`,x:t+52/2,y:n+cb/2});r.appendChild(a),o.appendChild(r),v.push({g:r,val:a})}let y=i(`g`,{class:`bm-verdict`});y.appendChild(i(`rect`,{class:`bm-verdict__box`,x:30,y:lb,width:Yy-60,height:ub,rx:10}));let b=i(`text`,{class:`bm-verdict__label`,x:48,y:352});b.textContent=`进度`;let x=i(`text`,{class:`bm-verdict__main`,x:48,y:370}),S=i(`text`,{class:`bm-verdict__sub`,x:Yy-48,y:361});y.append(b,x,S),o.appendChild(y);let C=i(`text`,{class:`bm-phasetext`,x:Yy/2,y:db});s.appendChild(C);let w={init:`整数有界 → 每个整数 1 bit。数据量再大，位图的大小只由值域决定。`,locate:`word = v >> 5 定第几个字，bit = v & 31 定字内第几位 —— v = word × 32 + bit。`,act:`|= 只翻本位；写成 = 会冲掉整个字。位是 1 说明来过，跳过即去重。`,done:`按 bit 下标从小到大扫一遍，输出天然有序 —— 排序和去重都不需要额外操作。`};function T(e,t){if(!t)return;let n=t.value;p.forEach(({g:e,v:r})=>{let i=[`bm-cell`],a=t.placed.includes(r);r===n&&t.phase!==`done`?i.push(t.already?`is-skip`:`is-cur`):a?i.push(`is-on`):i.push(`is-empty`),e.setAttribute(`class`,i.join(` `))}),g(t);let r=t.distinct;v.forEach((e,i)=>{if(i>=r.length){e.g.setAttribute(`class`,`bm-chip is-off`);return}let a=t.phase===`act`&&!t.already&&r[i]===n;e.g.setAttribute(`class`,`bm-chip ${a?`is-new`:``}`),e.val.textContent=String(r[i])}),t.phase===`done`?(y.setAttribute(`class`,`bm-verdict is-on`),b.textContent=`扫描完成`,x.textContent=`${t.input.length} 个输入 → ${t.placed.length} 个 distinct`,S.textContent=`跳过 ${t.skipped.length} 个重复`):(y.setAttribute(`class`,`bm-verdict`),b.textContent=`进度`,x.textContent=`已置位 ${t.placed.length} · 已跳过 ${t.skipped.length}`,S.textContent=`共 ${t.input.length} 个输入`),t.phase===`init`?(l.textContent=`准备`,u.textContent=`开一片全 0 的位图`,d.textContent=`${pb} bit`):t.phase===`done`?(l.textContent=`扫描输出`,u.textContent=`按 bit 下标从小到大`,d.textContent=`${t.placed.length} 个`):t.phase===`locate`?(l.textContent=`定位 ${t.value}`,u.textContent=`word = ${t.value} >> 5`,d.textContent=`bit = ${t.value} & 31`):(l.textContent=`${t.already?`跳过`:`置位`} ${t.value}`,u.textContent=t.already?`这一位已经是 1`:`words[${t.word}] |= 1 << ${t.bit}`,d.textContent=t.already?`重复`:`第 ${t.bit} 位`),C.textContent=w[t.phase]||``,Z(E,t.desc)}let E=Jy(),D=document.createElement(`div`);D.className=`viz bm`;let O=document.createElement(`div`);O.className=`viz__stage`,O.appendChild(a),D.appendChild(O),D.appendChild(E);let k=Q();D.appendChild(k.root),e.textContent=``,e.appendChild(D),X();let A=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,j=$({steps:n,controls:k,intervalMs:Gy,onRender:T});j.jumpTo(Math.trunc(t.initialStep)||0);let M=null;return t.autoplay!==!1&&!A&&typeof IntersectionObserver==`function`&&(M=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){M.disconnect(),M=null,j.play();return}},{threshold:.35}),M.observe(D)),{destroy(){M&&=(M.disconnect(),null),j.destroy(),e.textContent=``,delete e.dataset.bmMounted,document.getElementById(Wy)?.remove()}}}var gb=[3,7,3,3,12,7],_b=16,vb={0:`00 未出现`,1:`01 一次`,2:`10 多次`,3:`11 保留`};function yb(e={}){let t=Array.isArray(e.input)&&e.input.length>0&&e.input.every(e=>Number.isInteger(e)&&e>=0&&e<_b)?e.input.slice():gb.slice(),n=[],r=Array(_b).fill(0),i=()=>{let e=[],t=[],n=[];for(let i=0;i<_b;i+=1)r[i]===1?(e.push(i),n.push(i)):(r[i]===2||r[i]===3)&&(e.push(i),t.push(i));return{distinct:e,dups:t,uniques:n}},a=(e,a)=>{let o=i();n.push({phase:e,input:t,size:_b,value:null,from:0,to:0,states:r.slice(),distinct:o.distinct,dups:o.dups,uniques:o.uniques,done:e===`done`,desc:``,...a})};return a(`init`,{desc:`还是这批数：${t.join(`、`)}，但换成 2-bit 位图 —— 每个数占 2 bit，四个状态：00 未出现、01 出现一次、10 出现多次（11 保留）。一遍扫完，三个问题同时有答案：哪些出现过、哪些重复了、哪些只出现一次。`}),t.forEach((e,t)=>{let n=r[e],i=n;n===0?i=1:(n===1||n===3)&&(i=2),r[e]=i,a(`step`,{value:e,from:n,to:i,desc:`第 ${t+1} 个数 ${e}：状态 ${vb[n]} → ${vb[i]}。`+(n===0?`第一次见到：00 翻 01。`:n===1?`第二次见到：01 翻 10 —— 「一次」升级成「多次」。`:`已经记着是多次了：10 保持。`)})}),a(`done`,{value:null,desc:`扫描一遍收答案：出现过 ${n[n.length-1].distinct.length} 个（${n[n.length-1].distinct.join(`、`)}），重复 ${n[n.length-1].dups.length} 个（${n[n.length-1].dups.join(`、`)||`无`}），只出现一次 ${n[n.length-1].uniques.length} 个（${n[n.length-1].uniques.join(`、`)||`无`}）。空间代价是 1-bit 位图的两倍，换来「次数分档」这个新维度。`}),n}var bb=`bm2-styles`,xb=1e3,Sb=`
.bm2 { display: flex; flex-direction: column; gap: 14px; }
.bm2__svg { width: 100%; height: auto; display: block; }

.bm2-note {
  fill: var(--bm2-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.bm2-banner__box {
  fill: var(--bm2-banner, #f4f3ef);
  stroke: var(--bm2-line, #c3c9c2);
  stroke-width: 1.5;
}
.bm2-banner__seg {
  fill: var(--bm2-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.bm2-banner__val {
  fill: var(--bm2-gold, #c2872f);
  font-size: 16px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bm2-seclabel {
  fill: var(--bm2-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}

/* ---- 状态阵列 ---- */
.bm2-cell__box {
  fill: var(--bm2-fill, #ffffff);
  stroke: var(--bm2-line, #c3c9c2);
  stroke-width: 1.3;
}
.bm2-cell__v {
  fill: var(--bm2-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
}
.bm2-cell__st {
  fill: var(--bm2-dim, #9aa39c);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bm2-cell.is-once .bm2-cell__box { stroke: var(--bm2-green, #3f6b57); }
.bm2-cell.is-once .bm2-cell__st { fill: var(--bm2-green, #3f6b57); }
.bm2-cell.is-many .bm2-cell__box {
  fill: var(--bm2-gold-fill, #fdf3e3);
  stroke: var(--bm2-gold, #c2872f);
  stroke-width: 2;
}
.bm2-cell.is-many .bm2-cell__st { fill: var(--bm2-gold, #c2872f); }
.bm2-cell.is-cur .bm2-cell__box {
  stroke: var(--bm2-cur, #a45f45);
  stroke-width: 3;
}
.bm2-cell.is-cur .bm2-cell__v { fill: var(--bm2-cur, #a45f45); font-weight: 700; }
.bm2-cell.is-flash .bm2-cell__box { stroke: var(--bm2-cur, #a45f45); stroke-width: 3; }
.bm2-cell.is-reserved .bm2-cell__st { fill: #7a5aa8; }

/* ---- 转移表 ---- */
.bm2-tr__box {
  fill: var(--bm2-fill, #ffffff);
  stroke: var(--bm2-line, #c3c9c2);
  stroke-width: 1.2;
}
.bm2-tr__cond {
  fill: var(--bm2-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bm2-tr__desc {
  fill: var(--bm2-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.bm2-tr__arrow {
  fill: var(--bm2-dim, #9aa39c);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.bm2-tr.is-on .bm2-tr__box {
  fill: var(--bm2-gold-fill, #fdf3e3);
  stroke: var(--bm2-gold, #c2872f);
  stroke-width: 2.2;
}
.bm2-tr.is-on .bm2-tr__cond { fill: var(--bm2-gold, #c2872f); }

/* ---- 三集合 ---- */
.bm2-set__label {
  fill: var(--bm2-muted, #657168);
  font-size: 12px;
  font-anchor: start;
  dominant-baseline: central;
}
.bm2-pill__box {
  fill: var(--bm2-fill, #ffffff);
  stroke: var(--bm2-line, #c3c9c2);
  stroke-width: 1.3;
}
.bm2-pill__val {
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bm2-pill.is-green .bm2-pill__box { stroke: var(--bm2-green, #3f6b57); }
.bm2-pill.is-green .bm2-pill__val { fill: var(--bm2-green, #3f6b57); }
.bm2-pill.is-gold .bm2-pill__box { stroke: var(--bm2-gold, #c2872f); }
.bm2-pill.is-gold .bm2-pill__val { fill: var(--bm2-gold, #c2872f); }
.bm2-pill.is-off { opacity: 0; }
.bm2-set__empty {
  fill: var(--bm2-dim, #9aa39c);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}

.bm2-phasetext {
  fill: var(--bm2-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
`;function Cb(){if(document.getElementById(bb))return;let e=document.createElement(`style`);e.id=bb,e.textContent=Sb,document.head.appendChild(e)}function wb(){let e=document.createElement(`p`);return e.className=`viz__desc`,e.setAttribute(`aria-live`,`polite`),e}var Tb=680,Eb=20,Db=36,Ob=40,kb=100,Ab=36,jb=40,Mb=112,Nb=178,Pb=188,Fb=26,Ib=320,Lb=332,Rb=30,zb=452,Bb=470,Vb=16,Hb=[{from:0,to:1,cond:`00 → 01`,desc:`第一次见到：翻低位，记「一次」`},{from:1,to:2,cond:`01 → 10`,desc:`第二次见到：清低位置高位，升级成「多次」`},{from:2,to:2,cond:`10 → 10`,desc:`已经是多次：保持，不再加码`},{from:3,to:2,cond:`11 → 10`,desc:`保留态兜底：同样视作多次`}];function Ub(e,t={}){if(!e||e.dataset.bm2Mounted===`1`)return{destroy(){}};e.dataset.bm2Mounted=`1`,Cb();let n=yb(t),r=n[0],i=Y,a=i(`svg`,{class:`viz__svg bm2__svg`,viewBox:`0 0 ${Tb} ${Bb}`,role:`img`,"aria-label":`2-bit 位图动画：去重、数重复、找只出现一次的数`}),o=i(`g`,{class:`bm2-cells`}),s=i(`g`,{class:`bm2-marks`});a.appendChild(o),a.appendChild(s);let c=i(`text`,{class:`bm2-note`,x:30,y:Eb});c.textContent=`输入 ${r.input.join(`、`)} · 每个数 2 bit：00 未出现 / 01 一次 / 10 多次 / 11 保留`,s.appendChild(c),s.appendChild(i(`rect`,{class:`bm2-banner__box`,x:30,y:Db,width:Tb-60,height:Ob,rx:9}));let l=i(`text`,{class:`bm2-banner__seg`,x:46,y:56}),u=i(`text`,{class:`bm2-banner__seg`,x:150,y:56}),d=i(`text`,{class:`bm2-banner__val`,x:Tb-46,y:56});s.append(l,u,d);let f=i(`text`,{class:`bm2-seclabel`,x:30,y:kb});f.textContent=`16 个数的状态格（上：数值，下：2-bit 状态）`,s.appendChild(f);let p=(Tb-666)/2,m=[];for(let e=0;e<Vb;e+=1){let t=p+e*42,n=i(`g`,{class:`bm2-cell`});n.appendChild(i(`rect`,{class:`bm2-cell__box`,x:t,y:Mb,width:Ab,height:jb,rx:6}));let r=i(`text`,{class:`bm2-cell__v`,x:t+Ab/2,y:124});r.textContent=String(e);let a=i(`text`,{class:`bm2-cell__st`,x:t+Ab/2,y:140});a.textContent=`00`,n.append(r,a),o.appendChild(n),m.push({g:n,st:a,v:e})}let h=i(`text`,{class:`bm2-seclabel`,x:30,y:Nb});h.textContent=`状态转移表（金色 = 本轮命中）`,s.appendChild(h);let g=Hb.map((e,t)=>{let n=Pb+t*31,r=i(`g`,{class:`bm2-tr`});r.appendChild(i(`rect`,{class:`bm2-tr__box`,x:30,y:n,width:Tb-60,height:Fb,rx:7}));let a=i(`text`,{class:`bm2-tr__cond`,x:46,y:n+Fb/2});a.textContent=e.cond;let s=i(`text`,{class:`bm2-tr__arrow`,x:130,y:n+Fb/2});s.textContent=`→`;let c=i(`text`,{class:`bm2-tr__desc`,x:156,y:n+Fb/2});return c.textContent=e.desc,r.append(a,s,c),o.appendChild(r),{g:r,def:e}}),_=i(`text`,{class:`bm2-seclabel`,x:30,y:Ib});_.textContent=`一遍扫完，三个问题同时有答案`,s.appendChild(_);let v=[{key:`distinct`,label:`出现过`,cls:`is-green`},{key:`dups`,label:`重复（≥2 次）`,cls:`is-gold`},{key:`uniques`,label:`只一次`,cls:`is-green`}].map((e,t)=>{let n=Lb+t*Rb,r=i(`text`,{class:`bm2-seclabel`,x:30,y:n+13});r.textContent=e.label;let a=[];for(let t=0;t<Vb;t+=1){let r=150+t*48,s=i(`g`,{class:`bm2-pill is-off ${e.cls}`});s.appendChild(i(`rect`,{class:`bm2-pill__box`,x:r,y:n+2,width:40,height:22,rx:6}));let c=i(`text`,{class:`bm2-pill__val`,x:r+40/2,y:n+13});s.appendChild(c),o.appendChild(s),a.push({g:s,val:c})}return s.appendChild(r),{row:e,pills:a}}),y=i(`text`,{class:`bm2-phasetext`,x:Tb/2,y:zb});s.appendChild(y);function b(e,t){t&&(m.forEach(({g:e,st:n,v:r})=>{let i=t.states[r],a=[`bm2-cell`];i===1?a.push(`is-once`):i===2?a.push(`is-many`):i===3&&a.push(`is-reserved`),t.value===r&&t.phase===`step`&&a.push(`is-cur`),e.setAttribute(`class`,a.join(` `)),n.textContent=i.toString(2).padStart(2,`0`)}),g.forEach(({g:e,def:n})=>{let r=t.phase===`step`&&t.from===n.from&&t.to===n.to;e.setAttribute(`class`,`bm2-tr ${r?`is-on`:``}`)}),v.forEach(({row:e,pills:n})=>{let r=t[e.key];n.forEach((t,n)=>{if(n>=r.length){t.g.setAttribute(`class`,`bm2-pill is-off ${e.cls}`);return}t.g.setAttribute(`class`,`bm2-pill ${e.cls}`),t.val.textContent=String(r[n])})}),t.phase===`init`?(l.textContent=`准备`,u.textContent=`全 00 起步`,d.textContent=`${Vb} 个数 × 2 bit`):t.phase===`done`?(l.textContent=`扫描完成`,u.textContent=`重复 ${t.dups.length} · 唯一 ${t.uniques.length}`,d.textContent=`distinct ${t.distinct.length}`):(l.textContent=`数 ${t.value}`,u.textContent=vb[t.from].split(` `)[0]+` → `+vb[t.to].split(` `)[0],d.textContent=t.to===2?`记多次`:t.to===1?`记一次`:``),y.textContent=t.phase===`init`?`1-bit 位图只回答「出现过没有」；每个数加到 2 bit，就能同时区分一次和多次。`:t.phase===`done`?`空间是 1-bit 位图的两倍，换来「次数分档」：去重、数重复、找唯一一次全解决。`:``,Z(x,t.desc))}let x=wb(),S=document.createElement(`div`);S.className=`viz bm2`;let C=document.createElement(`div`);C.className=`viz__stage`,C.appendChild(a),S.appendChild(C),S.appendChild(x);let w=Q();S.appendChild(w.root),e.textContent=``,e.appendChild(S),X();let T=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,E=$({steps:n,controls:w,intervalMs:xb,onRender:b});E.jumpTo(Math.trunc(t.initialStep)||0);let D=null;return t.autoplay!==!1&&!T&&typeof IntersectionObserver==`function`&&(D=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){D.disconnect(),D=null,E.play();return}},{threshold:.35}),D.observe(S)),{destroy(){D&&=(D.disconnect(),null),E.destroy(),e.textContent=``,delete e.dataset.bm2Mounted,document.getElementById(bb)?.remove()}}}var Wb=[{op:`push`,val:-2},{op:`push`,val:0},{op:`push`,val:-3},{op:`getMin`},{op:`pop`},{op:`top`},{op:`getMin`}],Gb={push:e=>`push(${e})`,pop:()=>`pop()`,top:()=>`top()`,getMin:()=>`getMin()`};function Kb(e={}){let t=Array.isArray(e.ops)&&e.ops.length>0?e.ops.map(e=>({...e})):Wb.map(e=>({...e})),n=[],r=(e,r,o={})=>{n.push({phase:e,desc:r,ops:t,opIdx:null,main:i.slice(),mins:a.slice(),minPushed:!1,popped:null,minPopped:null,result:null,done:e===`done`,...o})},i=[],a=[];r(`init`,`设计一个栈，在 \`push\` / \`pop\` / \`top\` 之外还要支持 \`getMin\` —— 取栈内**最小元素**，且 \`getMin\` 必须是 \`O(1)\`。难点：栈只能看到栈顶，最小值可能埋在任意一层；每次现扫是 \`O(n)\`。思路：**最小值是历史，必须按层存** —— 开一个辅助栈，主栈每进一个元素，辅助栈同步记下"这一刻全栈的最小值"。于是辅助栈顶恒等于全栈最小值，\`getMin\` 直接读栈顶；\`pop\` 时两栈一起弹，**旧的最小值自动恢复**。操作序列：\`${t.map(e=>Gb[e.op](e.val)).join(` → `)}\`。`,{main:[],mins:[]});for(let e=0;e<t.length;e+=1){let n=t[e];if(n.op===`push`){let t=Number(n.val),o=a.length>0?a[a.length-1]:null,s=a.length===0||t<=o;i.push(t),s&&a.push(t);let c=a[a.length-1];r(`push`,`**\`push(${t})\`**：主栈压入 \`${t}\`。辅助栈判据 \`x <= 当前最小值\`${o===null?`（辅助栈为空）`:`（栈顶 \`${o}\`）`}：`+(s?`\`${t}\` ${o===null?`是第一个元素`:`不比当前最小值 \`${o}\` 大`} —— 压入辅助栈，记录"**${t} 入栈这一刻**，全栈最小值是 \`${c}\`"。`:`\`${t} > ${o}\`，它入栈后最小值没变 —— 辅助栈**不压**（留空档）。此刻全栈最小值仍是 \`${c}\`。`)+`主栈（底→顶）\`[${i.join(`, `)}]\`，辅助栈 \`[${a.join(`, `)}]\`。`,{opIdx:e,minPushed:s,result:null});continue}if(n.op===`pop`){if(i.length===0){r(`pop`,"**`pop()`**：栈已空，无操作。",{opIdx:e});continue}let t=i.pop(),n=null;a.length>0&&a[a.length-1]===t&&(n=a.pop());let o=a.length>0?a[a.length-1]:null;r(`pop`,`**\`pop()\`**：主栈弹出栈顶 \`${t}\`。`+(n===null?`\`${t}\` 不是当前最小值（辅助栈顶是 \`${a[a.length-1]}\`），辅助栈**不动** —— 它入栈时就没压过，弹它不影响最小值。`:`它**正是**辅助栈顶 \`${n}\`（说明它入栈时就是当时的最小值）—— 两栈同步弹出，栈里**恢复出更早的最小值 \`${o}\`** —— 这就是"按层存历史"的意义：pop 之后要回到过去，旧最小值必须本来就存着。`)+`主栈 \`[${i.join(`, `)}]\`，辅助栈 \`[${a.join(`, `)}]\`。`,{opIdx:e,popped:t,minPopped:n});continue}if(n.op===`top`){let t=i.length>0?i[i.length-1]:null;r(`top`,`**\`top()\`**：读主栈栈顶 \`${t}\`（空栈返回 \`null\`）。栈的本职工作，\`O(1)\`。`,{opIdx:e,result:t});continue}if(n.op===`getMin`){let t=a.length>0?a[a.length-1]:null;r(`getMin`,`**\`getMin()\` → \`${t}\`**：直接读辅助栈顶 —— \`O(1)\`。辅助栈顶恒等于 \`min(主栈全体)\`（不变量，见说明），所以这一步**不需要扫主栈**。`,{opIdx:e,result:t});continue}r(`push`,`未知操作 \`${n.op}\`，跳过。`,{opIdx:e})}let o=a.length>0?a[a.length-1]:null;return r(`done`,`七个操作走完：主栈 \`[${i.join(`, `)}]\`，辅助栈 \`[${a.join(`, `)}]\`，当前最小值 \`${o}\`。四个操作全 \`O(1)\`，代价是辅助栈的 \`O(n)\` 空间 —— 用空间换"记住历史"。两个要点：① 辅助栈存的是"**每一刻**的最小值"，不是"最小值本身"，所以 pop 能恢复过去；② 压入判据是 \`<=\`（相等也压）—— 用 \`<\` 会在重复最小值 pop 后提前弹空。`,{done:!0}),n}var qb=`minstack-styles`,Jb=54,Yb=84,Xb=46,Zb=336,Qb=46,$b=84,ex=362,tx=388,nx=1250,rx=`
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
`;function ix(){if(document.getElementById(qb))return;let e=document.createElement(`style`);e.id=qb,e.textContent=rx,document.head.appendChild(e)}function ax(e,t={}){if(!e||e.dataset.minstackMounted===`1`)return{destroy(){}};e.dataset.minstackMounted=`1`,ix();let n=Kb(t),r=t.autoplay!==!1,i=n[0].ops,a=Y,o=document.createElement(`div`);o.className=`viz msv`;let s=document.createElement(`div`);s.className=`viz__stage`,o.appendChild(s);let c=Math.max(1,...n.map(e=>e.main.length)),l=Math.max(1,...n.map(e=>e.mins.length)),u=a(`svg`,{class:`viz__svg msv__svg`,viewBox:`0 0 660 412`,role:`img`,"aria-label":`最小栈 辅助栈推演动画`});s.appendChild(u);let d=a(`g`,{class:`msv-cells`}),f=a(`g`,{class:`msv-marks`});u.appendChild(d),u.appendChild(f);let p=a(`text`,{class:`msv-note`,x:26,y:Jb});p.textContent=`最小值是历史：辅助栈每层记「这一刻全栈的最小值」—— pop 后自动恢复过去`,f.appendChild(p),f.appendChild(a(`rect`,{class:`msv-banner__box`,x:26,y:Yb,width:608,height:Xb,rx:9}));let m=a(`text`,{class:`msv-banner__op`,x:44,y:107}),h=a(`text`,{class:`msv-banner__ret`,x:616,y:107});f.appendChild(m),f.appendChild(h),f.appendChild(a(`line`,{class:`msv-floor`,x1:220-$b/2-10,y1:Zb,x2:272,y2:Zb})),f.appendChild(a(`line`,{class:`msv-floor`,x1:440-$b/2-10,y1:Zb,x2:492,y2:Zb}));let g=a(`text`,{class:`msv-label`,x:220,y:ex});g.textContent=`main 主栈`;let _=a(`text`,{class:`msv-label`,x:440,y:ex});_.textContent=`mins 辅助栈`,f.appendChild(g),f.appendChild(_);let v=(e,t)=>{let n=[];for(let r=0;r<=t;r+=1){let t=a(`g`,{class:`msv-cell`}),i=Zb-(r+1)*52,o=a(`rect`,{class:`msv-cell__box`,x:e-$b/2,y:i,width:$b,height:Qb,rx:6});t.appendChild(o);let s=a(`text`,{class:`msv-cell__val`,x:e,y:i+Qb/2-5});t.appendChild(s);let c=a(`text`,{class:`msv-cell__sub`,x:e,y:i+Qb-9});t.appendChild(c),d.appendChild(t),n.push({g:t,val:s,sub:c})}return n},y=v(220,c),b=v(440,l),x=a(`g`,{class:`msv-sync`}),S=a(`line`,{class:`msv-arrow`,x1:268,y1:0,x2:440-$b/2-14,y2:0}),C=a(`path`,{class:`msv-arrow__head`,d:``}),w=a(`text`,{class:`msv-arrow__text`,x:660/2,y:0});x.appendChild(S),x.appendChild(C),x.appendChild(w),f.appendChild(x);let T=a(`text`,{class:`msv-phase__text`,x:660/2,y:tx});f.appendChild(T);let E=document.createElement(`p`);E.className=`viz__desc`,E.setAttribute(`aria-live`,`polite`);function D(e,t,n,r,i,a){e.forEach((e,o)=>{let s=[`msv-cell`];o<t.length?(e.val.textContent=String(t[o]),e.sub.textContent=o===0?`bottom`:`#${o}`,o===n&&s.push(`is-top`),o===r&&s.push(`is-fresh`)):o===i?(e.val.textContent=a,e.sub.textContent=`弹出`,s.push(`is-ghost`)):(e.val.textContent=``,e.sub.textContent=``,s.push(`is-minghost`)),e.g.setAttribute(`class`,s.join(` `))})}function O(e,t){if(!t)return;let n=t.main,r=t.mins,a=n.length-1,o=r.length-1,s=t.phase===`push`,c=t.phase===`pop`;if(D(y,n,a,s?a:-1,c?n.length:-1,c?String(t.popped):``),D(b,r,o,s&&t.minPushed?o:-1,c&&t.minPopped!==null?r.length:-1,c&&t.minPopped!==null?String(t.minPopped):``),s&&t.minPushed||c&&t.minPopped!==null){let e=Zb-(r.length+ +!s)*52+Qb/2;S.setAttribute(`y1`,e),S.setAttribute(`y2`,e),S.setAttribute(`x2`,440-$b/2-10),C.setAttribute(`d`,`M ${440-$b/2-4} ${e} L ${440-$b/2-13} ${e-5} L ${440-$b/2-13} ${e+5} Z`),w.setAttribute(`y`,e-12),w.textContent=s?`同步压入`:`同步弹出`,x.style.opacity=`1`}else x.style.opacity=`0`;let l=t.opIdx===null?null:i[t.opIdx];t.phase===`init`?(m.textContent=`最小栈：getMin 要求 O(1)`,h.textContent=``):t.phase===`done`?(m.textContent=`${i.length} 个操作完成`,h.textContent=`min=${r.length>0?r[r.length-1]:`∅`}`):l&&(m.textContent=l.op===`push`?`push(${l.val})`:`${l.op}()`,t.result!==null&&t.result!==void 0?h.textContent=`→ ${t.result}`:c?h.textContent=`弹 ${t.popped}${t.minPopped===null?``:` · 同步弹 min`}`:h.textContent=``),s?T.textContent=t.minPushed?`x <= 当前最小值 → 辅助栈同步压入，记录这一刻的历史`:`x > 当前最小值 → 辅助栈留空档，历史没变化`:c?T.textContent=t.minPopped===null?`弹出的不是最小值 → 辅助栈不动，最小值不变`:`弹出的是当前最小值 → 两栈同步弹，旧最小值自动恢复`:t.phase===`getMin`?T.textContent=`getMin = 读辅助栈顶 —— O(1)，不扫主栈`:t.phase===`top`?T.textContent=`top = 读主栈顶 —— 栈的本职工作`:t.phase===`init`?T.textContent=`栈只见栈顶，最小值却在任意一层 —— 所以按层存`:T.textContent=`四个操作全 O(1) —— 用辅助栈的 O(n) 空间换「记住历史」`,Z(E,t.desc)}o.appendChild(E);let k=Q();o.appendChild(k.root),e.textContent=``,e.appendChild(o),X();let A=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,j=$({steps:n,controls:k,intervalMs:nx,onRender:O});j.jumpTo(Math.trunc(t.initialStep)||0);let M=null;return r&&!A&&typeof IntersectionObserver==`function`&&(M=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){M.disconnect(),M=null,j.play();return}},{threshold:.35}),M.observe(o)),{destroy(){M&&=(M.disconnect(),null),j.destroy(),e.textContent=``,delete e.dataset.minstackMounted,document.getElementById(qb)?.remove()}}}var ox=[{op:`push`,val:1},{op:`push`,val:2},{op:`push`,val:3},{op:`pop`},{op:`peek`},{op:`pop`},{op:`push`,val:4},{op:`pop`},{op:`pop`}],sx={push:e=>`push(${e})`,pop:()=>`pop()`,peek:()=>`peek()`,empty:()=>`empty()`};function cx(e={}){let t=Array.isArray(e.ops)&&e.ops.length>0?e.ops.map(e=>({...e})):ox.map(e=>({...e})),n=[],r=[],i=[],a=[],o=0,s=(e,s,c={})=>{n.push({phase:e,desc:s,ops:t,opIdx:null,inn:r.slice(),out:i.slice(),moved:null,result:null,queueOut:a.slice(),transfers:o,done:e===`done`,...c})};s(`init`,`用两个栈实现队列：支持 \`push\` / \`pop\` / \`peek\`，要求 FIFO。栈是 LIFO，方向正好相反 —— 但"相反"翻**两次**就是原样：进 \`in\` 栈倒一次，整摞翻进 \`out\` 栈再倒一次，\`out\` 顶就是最早来的。正确性的钉子：**只有 \`out\` 空了才搬运** —— 搬一半的顺序是坏的。操作序列：\`${t.map(e=>sx[e.op](e.val)).join(` → `)}\`。`);for(let e=0;e<t.length;e+=1){let n=t[e];if(n.op===`push`){let t=Number(n.val);r.push(t),s(`push`,`**\`push(${t})\`**：直接压进 \`in\` 栈顶 —— \`O(1)\`，\`out\` 不动。此时 \`in\`（底→顶）\`[${r.join(`, `)}]\`，\`out\` \`[${i.join(`, `)}]\`。`+(i.length>0?`注意 \`out\` 里还留着旧的 \`${i.join(`、`)}\` —— 它们**先于** ${t} 入队，必须等 \`out\` 清空才轮到新元素，所以现在**绝不能搬**。`:"（`out` 为空，新元素排在队尾。）"),{opIdx:e});continue}if(n.op===`pop`||n.op===`peek`){let t=n.op===`pop`;if(r.length===0&&i.length===0){s(t?`pop`:`peek`,`**\`${n.op}()\`**：队列已空，返回 \`null\`。`,{opIdx:e,result:null});continue}if(i.length===0)for(s(`transfer`,`**\`${n.op}()\`** 要取队首，但 \`out\` 空了 —— 触发搬运：把 \`in\` 整摞 \`[${r.join(`, `)}]\`（顶在右）逐个弹出、压进 \`out\`。翻完之后 \`out\` 顶就是**最早入队**的元素 —— 两次反转，方向转正。`,{opIdx:e});r.length>0;){let t=r.pop();i.push(t),o+=1,s(`transfer`,`搬运：\`in\` 弹出 \`${t}\` → 压入 \`out\`。此刻 \`in\` \`[${r.join(`, `)}]\`，\`out\` \`[${i.join(`, `)}]\`（顶 = \`${i[i.length-1]}\` = 队首）。这是 \`${t}\` 一生**唯一一次**搬运。`,{opIdx:e,moved:t})}let c=i[i.length-1];t&&(i.pop(),a.push(c)),s(t?`pop`:`peek`,`**\`${n.op}()\` → \`${c}\`**：${t?`\`out\` 弹出栈顶 \`${c}\`，记入出队序列 \`[${a.join(`, `)}]\``:`读 \`out\` 栈顶 \`${c}\`，**不弹出** —— 它就是队首`}。`+(i.length>0?` \`out\` 还剩 \`[${i.join(`, `)}]\`（顶 \`${i[i.length-1]}\` 是下一个队首）—— 消费只动 \`out\`，\`in\` 里新来的元素**插不了队**。`:" `out` 空了 —— 下次 `pop` 再触发搬运（或队列真的空了）。")+" 单次 `O(1)`（搬运已提前付掉）。",{opIdx:e,result:c});continue}if(n.op===`empty`){s(`pop`,`**\`empty()\` → \`${r.length===0&&i.length===0}\`**：两栈皆空即队列空。`,{opIdx:e});continue}s(`push`,`未知操作 \`${n.op}\`，跳过。`,{opIdx:e})}let c=t.filter(e=>e.op===`push`).map(e=>e.val).join(`,`);return s(`done`,`${t.length} 个操作走完，出队序列 \`[${a.join(`, `)}]\` —— 正好是入队顺序 \`${c}\`，FIFO 成立。账本：\`${a.length}\` 次 pop 总共只搬了 \`${o}\` 次 —— 每个元素**一生最多被搬一次**，所以 \`n\` 次操作总花费 \`O(n)\`，**均摊 \`O(1)\`**（单次最坏 \`O(n)\`：那一次恰好触发搬运）。两个钉子：① 搬运必须**整摞**翻，且只在 \`out\` 空时发生；② \`pop\`/\`peek\` 只动 \`out\` —— 旧的一摞没消费完，新的一摞绝不插队。`,{done:!0}),n}var lx=`qstacks-styles`,ux=54,dx=84,fx=46,px=322,mx=44,hx=78,gx=346,_x=372,vx=40,yx=440,bx=1050,xx=`
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
`;function Sx(){if(document.getElementById(lx))return;let e=document.createElement(`style`);e.id=lx,e.textContent=xx,document.head.appendChild(e)}function Cx(e,t={}){if(!e||e.dataset.qstacksMounted===`1`)return{destroy(){}};e.dataset.qstacksMounted=`1`,Sx();let n=cx(t),r=t.autoplay!==!1,i=n[0],a=i.ops,o=Y,s=document.createElement(`div`);s.className=`viz qsv`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=Math.max(1,...n.map(e=>e.inn.length)),u=Math.max(1,...n.map(e=>e.out.length)),d=Math.max(1,i.queueOut.length,...n.map(e=>e.queueOut.length)),f=o(`svg`,{class:`viz__svg qsv__svg`,viewBox:`0 0 660 464`,role:`img`,"aria-label":`用栈实现队列 双栈推演动画`});c.appendChild(f);let p=o(`g`,{class:`qsv-cells`}),m=o(`g`,{class:`qsv-marks`});f.appendChild(p),f.appendChild(m);let h=o(`text`,{class:`qsv-note`,x:26,y:ux});h.textContent=`两次反转 = 正序：进 in 倒一次，整摞翻进 out 再倒一次 —— out 顶就是队首`,m.appendChild(h),m.appendChild(o(`rect`,{class:`qsv-banner__box`,x:26,y:dx,width:608,height:fx,rx:9}));let g=o(`text`,{class:`qsv-banner__op`,x:44,y:107}),_=o(`text`,{class:`qsv-banner__ret`,x:616,y:107});m.appendChild(g),m.appendChild(_),m.appendChild(o(`line`,{class:`qsv-floor`,x1:210-hx/2-10,y1:px,x2:259,y2:px})),m.appendChild(o(`line`,{class:`qsv-floor`,x1:450-hx/2-10,y1:px,x2:499,y2:px}));let v=o(`text`,{class:`qsv-label`,x:210,y:gx});v.textContent=`in 栈（进队）`;let y=o(`text`,{class:`qsv-label`,x:450,y:gx});y.textContent=`out 栈（出队）`,m.appendChild(v),m.appendChild(y);let b=(e,t)=>{let n=[];for(let r=0;r<=t;r+=1){let t=o(`g`,{class:`qsv-cell`}),i=px-(r+1)*50,a=o(`rect`,{class:`qsv-cell__box`,x:e-hx/2,y:i,width:hx,height:mx,rx:6});t.appendChild(a);let s=o(`text`,{class:`qsv-cell__val`,x:e,y:i+mx/2-5});t.appendChild(s);let c=o(`text`,{class:`qsv-cell__sub`,x:e,y:i+mx-9});t.appendChild(c),p.appendChild(t),n.push({g:t,val:s,sub:c})}return n},x=b(210,l),S=b(450,u),C=o(`g`,{class:`qsv-transfer`}),w=o(`line`,{class:`qsv-arrow`,x1:0,y1:0,x2:0,y2:0}),T=o(`path`,{class:`qsv-arrow__head`,d:``}),E=o(`text`,{class:`qsv-arrow__text`,x:660/2,y:0});C.appendChild(w),C.appendChild(T),C.appendChild(E),m.appendChild(C);let D=o(`text`,{class:`qsv-label`,x:40,y:392});D.textContent=`出队`,m.appendChild(D);let O=[],k=660/2-(d*54+(d-1)*6)/2;for(let e=0;e<d;e+=1){let t=o(`g`,{class:`qsv-cell`}),n=k+e*60,r=o(`rect`,{class:`qsv-cell__box`,x:n,y:_x,width:54,height:vx,rx:6});t.appendChild(r);let i=o(`text`,{class:`qsv-cell__val`,x:n+54/2,y:392});t.appendChild(i),p.appendChild(t),O.push({g:t,val:i})}let A=o(`text`,{class:`qsv-phase__text`,x:660/2,y:yx});m.appendChild(A);let j=document.createElement(`p`);j.className=`viz__desc`,j.setAttribute(`aria-live`,`polite`);function M(e,t,n,r,i,a){e.forEach((e,o)=>{let s=[`qsv-cell`];o<t.length?(e.val.textContent=String(t[o]),e.sub.textContent=o===0?`bottom`:`#${o}`,o===n&&s.push(`is-top`),o===r&&s.push(`is-fresh`)):o===i?(e.val.textContent=a,e.sub.textContent=`弹出`,s.push(`is-ghost`)):(e.val.textContent=``,e.sub.textContent=``,s.push(`is-empty`)),e.g.setAttribute(`class`,s.join(` `))})}function N(e,t){if(!t)return;let n=t.inn,r=t.out,i=t.phase===`transfer`,o=i&&t.moved!==null,s=i&&t.moved===null,c=t.phase===`pop`,l=t.phase===`peek`;if(M(x,n,n.length-1,t.phase===`push`?n.length-1:-1,o?n.length:-1,o?String(t.moved):``),M(S,r,r.length-1,o?r.length-1:-1,-1,``),i){let e=o?px-r.length*50+mx/2:px-(n.length+1)*50+mx/2;w.setAttribute(`x1`,255),w.setAttribute(`y1`,e),w.setAttribute(`x2`,450-hx/2-10),w.setAttribute(`y2`,e),T.setAttribute(`d`,`M ${450-hx/2-4} ${e} L ${450-hx/2-13} ${e-5} L ${450-hx/2-13} ${e+5} Z`),E.setAttribute(`y`,e-12),E.textContent=o?`in 顶 → out 顶`:`整摞翻！`,C.style.opacity=`1`}else C.style.opacity=`0`;let u=t.queueOut;O.forEach((e,n)=>{let r=[`qsv-cell`];n<u.length?(e.val.textContent=String(u[n]),r.push(c&&t.result!==null&&n===u.length-1?`is-freshq`:`is-outq`)):(e.val.textContent=``,r.push(`is-empty`)),e.g.setAttribute(`class`,r.join(` `))});let d=t.opIdx===null?null:a[t.opIdx];t.phase===`init`?(g.textContent=`双栈队列：栈 LIFO 翻两次 = FIFO`,_.textContent=``):t.phase===`done`?(g.textContent=`${a.length} 个操作完成 · 共搬运 ${t.transfers} 次`,_.textContent=`[${t.queueOut.join(`,`)}]`):d&&(g.textContent=d.op===`push`?`push(${d.val})`:`${d.op}()`,s?_.textContent=`out 空 → 触发搬运`:o?_.textContent=`翻 ${t.moved}`:c||l?_.textContent=`→ ${t.result}`:_.textContent=``),t.phase===`push`?A.textContent=t.out.length>0?`push 只进 in —— out 还有存货，绝不搬运（旧元素没消费完）`:`push 只进 in，O(1) —— out 空，新元素排在队尾`:s?A.textContent=`out 空了才搬运 —— 且必须整摞翻，搬一半的顺序是坏的`:o?A.textContent=`in 顶弹出、压入 out 顶 —— 每个元素一生最多搬这一次`:c||l?A.textContent=l?`peek 只读 out 顶不弹出 —— 队首就是 out 顶`:`pop 只动 out —— 旧的一摞没消费完，新的一摞绝不插队`:t.phase===`init`?A.textContent=`进 in 倒一次，翻进 out 再倒一次 —— 方向转正`:A.textContent=`出队序列 = 入队序列 —— FIFO 成立；n 次操作 O(n)，均摊 O(1)`,Z(j,t.desc)}s.appendChild(j);let P=Q();s.appendChild(P.root),e.textContent=``,e.appendChild(s),X();let F=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,I=$({steps:n,controls:P,intervalMs:bx,onRender:N});I.jumpTo(Math.trunc(t.initialStep)||0);let L=null;return r&&!F&&typeof IntersectionObserver==`function`&&(L=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){L.disconnect(),L=null,I.play();return}},{threshold:.35}),L.observe(s)),{destroy(){L&&=(L.disconnect(),null),I.destroy(),e.textContent=``,delete e.dataset.qstacksMounted,document.getElementById(lx)?.remove()}}}var wx=`1 + 2 - (3 + 4) - 5`;function Tx(e){let t=[],n=0;for(;n<e.length;){let r=e[n];if(r===` `){n+=1;continue}if(r>=`0`&&r<=`9`){let r=n;for(;r<e.length&&e[r]>=`0`&&e[r]<=`9`;)r+=1;t.push(e.slice(n,r)),n=r;continue}t.push(r),n+=1}return t}function Ex(e={}){let t=typeof e.expr==`string`&&e.expr.trim()!==``?e.expr:wx,n=Tx(t),r=[],i=0,a=1,o=[],s=(e,s,c={})=>{r.push({phase:e,desc:s,expr:t,tokens:n,pos:null,token:null,result:i,prev:i,sign:a,stack:o.map(e=>({...e})),value:null,contribution:null,pushed:null,popped:null,inner:null,done:e===`done`,...c})};s(`init`,`表达式 \`${t}\` 只含数字、\`+\`、\`-\`、括号 —— **没有优先级要处理**（加减同级、左结合）。所以不用双栈、不用调度场：一个累计值 \`result\`、一个符号 \`sign\` 从左到右扫就够。唯一的麻烦是**括号**：\`-\`(3+4)\` 里整个括号要**乘以前面的负号**并回外层。办法：看到 \`(\` 就把「**外层累计值 + 括号外符号**」这对上下文压栈、进括号重启累加器；看到 \`)\` 弹栈合并 \`result = 外层result + 外层sign * 括号内值\`。这就是 LC 20 的括号配对长了算术能力 —— 栈照旧存"没闭合的上一层"，只是那层从"等哪个右括号"升级成"等一个数值"。`,{result:0,prev:0,sign:1,stack:[]});for(let e=0;e<n.length;e+=1){let t=n[e];if(t>=`0`&&t<=`9`){let n=Number(t),r=a*n,o=i;i+=r,s(`number`,`**\`${t}\`**：数字带着当前符号入账 —— \`result += sign * ${n}\` = \`${o}\` + \`${r}\` = \`${i}\`。同级左结合意味着数字**没有资格等待**：符号已定，立刻结算进累计值。`,{pos:e,token:t,prev:o,value:n,contribution:r});continue}if(t===`+`||t===`-`){a=t===`+`?1:-1,s(`sign`,`**\`${t}\`**：只是给**下一个数字**登记符号 \`sign = ${a}\`，累计值不动（\`${i}\`）。加减同级，所以这个符号不需要和任何"栈顶运算符"比优先级 —— 直接覆盖即可。`,{pos:e,token:t});continue}if(t===`(`){let n={result:i,sign:a};o.push({result:i,sign:a});let r=i;i=0,a=1,s(`open`,`**\`(\`**：进入新括号层。把上下文 \`{result: ${n.result}, sign: ${n.sign>0?`+1`:`-1`}}\` 压栈 —— 记的是"**外层已累计多少**"和"**这个括号整体该乘什么符号**"。然后重启一个干净的累加器：\`result = 0\`、\`sign = +1\`。`,{pos:e,token:t,prev:r,pushed:n});continue}if(t===`)`){let n=i,r=o.pop(),a=i;i=r.result+r.sign*n,s(`close`,`**\`)\`**：括号内算完，\`inner = ${n}\`。弹栈合并：\`result = ${r.result} + (${r.sign>0?`+`:`-`}1) * ${n} = ${i}\` —— 括号作为一个**整体数值**、乘上括号外的符号，并回外层累计值。一层上下文就此闭合。`,{pos:e,token:t,prev:a,inner:n,popped:r});continue}s(`sign`,`未知 token \`${t}\`，跳过。`,{pos:e,token:t})}return s(`done`,`扫完：\`${t}\` = **\`${i}\`**。全程只有一个累计值 + 一个符号，栈仅在括号进出时动 —— 空间 \`O(括号嵌套深度)\`，时间 \`O(n)\`。两个要点：① 加减同级左结合，数字来一个结一个，**不需要运算符栈**；② 栈存的不是中间结果本身，是"**外层欠账**"：外层累计 + 括号符号，闭合时一并清算。`,{done:!0}),r}var Dx=`basiccalc-styles`,Ox=40,kx=62,Ax=34,jx=42,Mx=4,Nx=108,Px=132,Fx=64,Ix=336,Lx=40,Rx=168,zx=360,Bx=386,Vx=1250,Hx=`
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
`;function Ux(){if(document.getElementById(Dx))return;let e=document.createElement(`style`);e.id=Dx,e.textContent=Hx,document.head.appendChild(e)}var Wx=e=>e>0?`+1`:`-1`;function Gx(e,t={}){if(!e||e.dataset.basiccalcMounted===`1`)return{destroy(){}};e.dataset.basiccalcMounted=`1`,Ux();let n=Ex(t),r=t.autoplay!==!1,i=n[0].tokens,a=Y,o=document.createElement(`div`);o.className=`viz bcv`;let s=document.createElement(`div`);s.className=`viz__stage`,o.appendChild(s);let c=a(`svg`,{class:`viz__svg bcv__svg`,viewBox:`0 0 660 408`,role:`img`,"aria-label":`基本计算器 LC224 推演动画`});s.appendChild(c);let l=a(`g`,{}),u=a(`g`,{}),d=a(`g`,{});c.appendChild(l),c.appendChild(u),c.appendChild(d);let f=a(`text`,{class:`bcv-note`,x:26,y:Ox});f.textContent=`栈存的不是数字，是「外层欠账」：括号前的累计值 + 括号的符号`,d.appendChild(f);let p=i.length*46-Mx,m=Math.max(26,(660-p)/2),h=i.map((e,t)=>{let n=m+t*46,r=a(`g`,{class:`bcv-tok`});r.appendChild(a(`rect`,{class:`bcv-tok__box`,x:n,y:kx,width:jx,height:Ax,rx:6}));let i=a(`text`,{class:`bcv-tok__val`,x:n+jx/2,y:79});return i.textContent=e,r.appendChild(i),l.appendChild(r),{g:r,x:n}}),g=a(`path`,{class:`bcv-pointer`,d:``});d.appendChild(g),d.appendChild(a(`rect`,{class:`bcv-panel__box`,x:26,y:Px,width:608,height:Fx,rx:9}));let _=a(`text`,{class:`bcv-panel__label`,x:130,y:148});_.textContent=`sign（下一个数字的符号）`;let v=a(`text`,{class:`bcv-panel__num`,x:130,y:172}),y=a(`text`,{class:`bcv-panel__op`,x:232,y:172});y.textContent=`result =`;let b=a(`text`,{class:`bcv-panel__num`,x:320,y:172}),x=a(`text`,{class:`bcv-panel__formula`,x:440,y:172});d.append(_,v,y,b,x);let S=Math.max(1,...n.map(e=>e.stack.length));d.appendChild(a(`line`,{class:`bcv-floor`,x1:330-Rx/2-10,y1:Ix,x2:424,y2:Ix}));let C=a(`text`,{class:`bcv-label`,x:330,y:zx});C.textContent=`括号上下文栈 {外层result, 括号sign}`,d.appendChild(C);let w=[];for(let e=0;e<=S;e+=1){let t=a(`g`,{class:`bcv-cell`}),n=Ix-(e+1)*46;t.appendChild(a(`rect`,{class:`bcv-cell__box`,x:330-Rx/2,y:n,width:Rx,height:Lx,rx:6}));let r=a(`text`,{class:`bcv-cell__val`,x:330,y:n+Lx/2});t.appendChild(r),u.appendChild(t),w.push({g:t,val:r})}let T=a(`text`,{class:`bcv-phase__text`,x:660/2,y:Bx});d.appendChild(T);let E=document.createElement(`p`);E.className=`viz__desc`,E.setAttribute(`aria-live`,`polite`);function D(e,t){if(!t)return;if(h.forEach((e,n)=>{let r=[`bcv-tok`];t.pos===null?t.done&&r.push(`is-past`):n<t.pos?r.push(`is-past`):n===t.pos&&r.push(`is-now`),e.g.setAttribute(`class`,r.join(` `))}),t.pos!==null){let e=h[t.pos].x+jx/2;g.setAttribute(`d`,`M ${e} ${Nx-6} L ${e-6} 111 L ${e+6} 111 Z`),g.style.opacity=`1`}else g.style.opacity=`0`;v.textContent=Wx(t.sign),b.textContent=String(t.result);let n=t.phase===`number`,r=t.phase===`close`,i=t.phase===`sign`;b.setAttribute(`class`,`bcv-panel__num`+(t.done?` is-final`:n||r?` is-fresh`:``)),v.setAttribute(`class`,`bcv-panel__num`+(i?` is-fresh`:``)),n?x.textContent=`${t.prev} + ${Wx(t.sign)} * ${t.value} = ${t.result}`:r?x.textContent=`${t.popped.result} + ${Wx(t.popped.sign)} * (${t.inner}) = ${t.result}`:x.textContent=``;let a=t.stack,o=a.length-1,s=t.phase===`open`;w.forEach((e,n)=>{let i=[`bcv-cell`];n<a.length?(e.val.textContent=`result=${a[n].result}  sign=${Wx(a[n].sign)}`,n===o&&i.push(`is-top`),s&&n===o&&i.push(`is-fresh`)):r&&n===a.length?(e.val.textContent=`result=${t.popped.result}  sign=${Wx(t.popped.sign)}  弹出合并`,i.push(`is-ghost`)):e.val.textContent=``,e.g.setAttribute(`class`,i.join(` `))}),t.phase===`init`?T.textContent=`加减同级左结合：数字来一个结一个，不需要运算符栈`:n?T.textContent=`数字没有资格等待 —— 符号已定，立刻结算`:i?T.textContent=`运算符只登记符号，不动累计值`:s?T.textContent=`压栈「外层欠账」，进括号重启累加器`:r?T.textContent=`括号塌缩成一个数，乘上括号外的符号并回外层`:T.textContent=`时间 O(n)，空间 O(括号嵌套深度)`,Z(E,t.desc)}o.appendChild(E);let O=Q();o.appendChild(O.root),e.textContent=``,e.appendChild(o),X();let k=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,A=$({steps:n,controls:O,intervalMs:Vx,onRender:D});A.jumpTo(Math.trunc(t.initialStep)||0);let j=null;return r&&!k&&typeof IntersectionObserver==`function`&&(j=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){j.disconnect(),j=null,A.play();return}},{threshold:.35}),j.observe(o)),{destroy(){j&&=(j.disconnect(),null),A.destroy(),e.textContent=``,delete e.dataset.basiccalcMounted,document.getElementById(Dx)?.remove()}}}var Kx=`2*(5+5*2)/3+(6/2+8)`,qx={"+":1,"-":1,"*":2,"/":2};function Jx(e){let t=[],n=0;for(;n<e.length;){let r=e[n];if(r===` `){n+=1;continue}if(r>=`0`&&r<=`9`){let r=n;for(;r<e.length&&e[r]>=`0`&&e[r]<=`9`;)r+=1;t.push(e.slice(n,r)),n=r;continue}t.push(r),n+=1}return t}function Yx(e,t){let n=t.pop(),r=e.pop(),i=e.pop(),a;return a=n===`+`?i+r:n===`-`?i-r:n===`*`?i*r:Math.trunc(i/r),e.push(a),{a:i,op:n,b:r,res:a}}function Xx(e={}){let t=typeof e.expr==`string`&&e.expr.trim()!==``?e.expr:Kx,n=Jx(t),r=[],i=[],a=[],o=(e,o,s={})=>{r.push({phase:e,desc:o,expr:t,tokens:n,pos:null,token:null,nums:i.slice(),ops:a.slice(),value:null,pushedOp:null,applies:[],parenPopped:!1,result:null,done:e===`done`,...s})},s=e=>`${e.a} ${e.op} ${e.b} = ${e.res}`;o(`init`,`表达式 \`${t}\` 在 224 之上加了 \`*\` \`/\` —— **优先级不再统一**，\`2+3*4\` 的 \`+\` 不能急着算，得**等右边乘法结账**。来一个结一个失效，就需要 Dijkstra 的**双栈调度场**：\`nums\` 存操作数、\`ops\` 存运算符（\`(\` 也进 ops 当挡板）。唯一纪律：新运算符来临，把栈顶所有**优先级 >= 它**的都弹出结算（\`>=\` 顺带保证同级左结合），再压自己。于是 \`ops\` 里**每层括号内部**从底到顶优先级严格递增 —— 这条不变量就是算法骨架。除法一律 \`Math.trunc\` **向零截断**。`,{nums:[],ops:[]});for(let e=0;e<n.length;e+=1){let t=n[e];if(t>=`0`&&t<=`9`){let n=Number(t);i.push(n),o(`number`,`**\`${t}\`**：数字直接进 \`nums\`（栈顶 \`${i[i.length-1]}\`）。数字永远不主动结算 —— **什么时候算，是运算符的事**。`,{pos:e,token:t,value:n});continue}if(t===`(`){a.push(`(`),o(`open`,"**`(`**：压进 `ops` 当**挡板** —— 它不比优先级、不参与结算，作用只有一个：让后面进来的运算符在它面前停下，把括号内圈成独立小天地。",{pos:e,token:t});continue}if(t===`)`){let n=[];for(;a.length>0&&a[a.length-1]!==`(`;)n.push(Yx(i,a));a.pop(),o(`close`,`**\`)\`**：一路结算到挡板为止：${n.map(s).join(`，`)}。再把 \`(\` 弹掉 —— 括号内已塌缩成 \`nums\` 顶上的**一个数**，回到外层，继续受外层运算符的优先级纪律管。`,{pos:e,token:t,applies:n,parenPopped:!0});continue}let r=[];for(;a.length>0&&a[a.length-1]!==`(`&&qx[a[a.length-1]]>=qx[t];)r.push(Yx(i,a));a.push(t),o(`operator`,`**\`${t}\`**：先看栈顶 —— `+(r.length>0?`优先级 \`>= ${t}\` 的先结账：${r.map(s).join(`，`)}；`:"没有可结算的（栈空、或遇 `(` 挡板、或栈顶优先级更低）；")+`然后 \`'${t}'\` 压入 \`ops\`。`+(r.length>0?`高优先级的先走，\`${t}\` 排队 —— 这就是"优先级"在栈里的样子。`:`\`${t}\` 在等它的右操作数（或更晚的更高优先级）。`),{pos:e,token:t,applies:r,pushedOp:t})}let c=[];for(;a.length>0;)c.push(Yx(i,a));o(`flush`,`**扫完收尾**：\`ops\` 里剩的运算符从栈顶到底依次结算：${c.map(s).join(`，`)}。栈形不变量（从底到顶优先级严格递增）保证"从顶到底结算"这个顺序**恰好就是正确的运算顺序** —— 低优先级的本来就沉在栈底，轮到最后。`,{applies:c});let l=i.length===1?i[0]:null;return o(`done`,`\`${t}\` = **\`${l}\`**。双栈各司其职：\`nums\` 只进不出地攒操作数、被结算时才吐结果；\`ops\` 靠**优先级比较**决定谁先结账。三个记忆锚点：① 结算判据 \`栈顶优先级 >= 新运算符\`（\`>=\` = 左结合）；② \`(\` 是挡板、\`)\` 结算到挡板；③ 除法 \`Math.trunc\` 向零截断，\`floor\` 在负数上是坑。`,{result:l,done:!0}),r}var Zx=`calciii-styles`,Qx=40,$x=58,eS=28,tS=29,nS=2,rS=97,iS=116,aS=38,oS=352,sS=38,cS=128,lS=376,uS=398,dS=1150,fS=`
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
`;function pS(){if(document.getElementById(Zx))return;let e=document.createElement(`style`);e.id=Zx,e.textContent=fS,document.head.appendChild(e)}function mS(e,t={}){if(!e||e.dataset.calciiiMounted===`1`)return{destroy(){}};e.dataset.calciiiMounted=`1`,pS();let n=Xx(t),r=t.autoplay!==!1,i=n[0].tokens,a=Y,o=document.createElement(`div`);o.className=`viz c3v`;let s=document.createElement(`div`);s.className=`viz__stage`,o.appendChild(s);let c=a(`svg`,{class:`viz__svg c3v__svg`,viewBox:`0 0 660 420`,role:`img`,"aria-label":`基本计算器 III LC772 双栈调度场动画`});s.appendChild(c);let l=a(`g`,{}),u=a(`g`,{}),d=a(`g`,{});c.appendChild(l),c.appendChild(u),c.appendChild(d);let f=a(`text`,{class:`c3v-note`,x:26,y:Qx});f.textContent=`新运算符来临：栈顶优先级 >= 它的先结账（>= 即左结合），再压自己`,d.appendChild(f);let p=i.length*31-nS,m=Math.max(16,(660-p)/2),h=i.map((e,t)=>{let n=m+t*31,r=a(`g`,{class:`c3v-tok`});r.appendChild(a(`rect`,{class:`c3v-tok__box`,x:n,y:$x,width:tS,height:eS,rx:5}));let i=a(`text`,{class:`c3v-tok__val`,x:n+tS/2,y:72});return i.textContent=e,r.appendChild(i),l.appendChild(r),{g:r,x:n}}),g=a(`path`,{class:`c3v-pointer`,d:``});d.appendChild(g),d.appendChild(a(`rect`,{class:`c3v-ban__box`,x:26,y:iS,width:608,height:aS,rx:8}));let _=a(`text`,{class:`c3v-ban__text`,x:660/2,y:135});d.appendChild(_);let v=Math.max(1,...n.map(e=>e.nums.length)),y=Math.max(1,...n.map(e=>e.ops.length));d.appendChild(a(`line`,{class:`c3v-floor`,x1:180-cS/2-8,y1:oS,x2:252,y2:oS})),d.appendChild(a(`line`,{class:`c3v-floor`,x1:480-cS/2-8,y1:oS,x2:552,y2:oS}));let b=a(`text`,{class:`c3v-label`,x:180,y:lS});b.textContent=`nums 数值栈`;let x=a(`text`,{class:`c3v-label`,x:480,y:lS});x.textContent=`ops 运算符栈（含挡板）`,d.append(b,x);let S=(e,t)=>{let n=[];for(let r=0;r<=t;r+=1){let t=a(`g`,{class:`c3v-cell`}),i=oS-(r+1)*43;t.appendChild(a(`rect`,{class:`c3v-cell__box`,x:e-cS/2,y:i,width:cS,height:sS,rx:6}));let o=a(`text`,{class:`c3v-cell__val`,x:e,y:i+sS/2-4});t.appendChild(o);let s=a(`text`,{class:`c3v-cell__sub`,x:e,y:i+sS-8});t.appendChild(s),u.appendChild(t),n.push({g:t,val:o,sub:s})}return n},C=S(180,v),w=S(480,y),T=a(`text`,{class:`c3v-phase__text`,x:660/2,y:uS});d.appendChild(T);let E=document.createElement(`p`);E.className=`viz__desc`,E.setAttribute(`aria-live`,`polite`);function D(e,t,n,r,i,a){let o=t.length-1;e.forEach((e,s)=>{let c=[`c3v-cell`];s<t.length?(e.val.textContent=String(t[s]),e.sub.textContent=s===0?`bottom`:`#${s}`,s===o&&c.push(`is-top`),s===n&&c.push(`is-fresh`),s===a&&c.push(`is-final`)):s===r?(e.val.textContent=i,e.sub.textContent=`结算/弹出`,c.push(`is-ghost`)):(e.val.textContent=``,e.sub.textContent=``),e.g.setAttribute(`class`,c.join(` `))})}function O(e,t){if(!t)return;if(h.forEach((e,n)=>{let r=[`c3v-tok`];t.pos===null?(t.done||t.phase===`flush`)&&r.push(`is-past`):n<t.pos?r.push(`is-past`):n===t.pos&&r.push(`is-now`),e.g.setAttribute(`class`,r.join(` `))}),t.pos!==null){let e=h[t.pos].x+tS/2;g.setAttribute(`d`,`M ${e} ${rS-6} L ${e-6} 100 L ${e+6} 100 Z`),g.style.opacity=`1`}else g.style.opacity=`0`;t.applies.length>0?_.textContent=`结算：`+t.applies.map(e=>`${e.a} ${e.op} ${e.b} = ${e.res}`).join(`  →  `):t.phase===`init`?_.textContent=`nums 攒操作数 · ops 靠优先级决定谁先结账`:t.phase===`done`?_.textContent=`答案：${t.result}`:_.textContent=`本帧无结算 —— 继续攒`;let n=t.phase===`number`,r=t.phase===`operator`,i=t.applies.length>0,a=t.phase===`done`,o=n||i?t.nums.length-1:-1;D(C,t.nums,o,-1,``,a?0:-1);let s=t.phase===`close`?`(`:i?t.applies.at(-1).op:null;D(w,t.ops,r?t.ops.length-1:-1,i||t.phase===`close`?t.ops.length:-1,s??``,-1),t.phase===`init`?T.textContent=`优先级不统一 → "来一个结一个"失效 → 双栈调度场`:n?T.textContent=`数字只进 nums：什么时候算，是运算符的事`:t.phase===`open`?T.textContent=`'(' 压进 ops 当挡板 —— 后面的运算符在它面前停下`:t.phase===`close`?T.textContent=`')' 结算到挡板：括号塌缩成 nums 顶上的一个数`:t.phase===`flush`?T.textContent=`栈形不变量保证：从顶到底结算 === 正确运算顺序`:r?T.textContent=i?`高优先级的先走，我排队`:`栈顶优先级更低（或被挡板挡住）→ 直接压栈等待`:T.textContent=`时间 O(n)，空间 O(n) —— 双栈各存各的`,Z(E,t.desc)}o.appendChild(E);let k=Q();o.appendChild(k.root),e.textContent=``,e.appendChild(o),X();let A=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,j=$({steps:n,controls:k,intervalMs:dS,onRender:O});j.jumpTo(Math.trunc(t.initialStep)||0);let M=null;return r&&!A&&typeof IntersectionObserver==`function`&&(M=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){M.disconnect(),M=null,j.play();return}},{threshold:.35}),M.observe(o)),{destroy(){M&&=(M.disconnect(),null),j.destroy(),e.textContent=``,delete e.dataset.calciiiMounted,document.getElementById(Zx)?.remove()}}}var hS=[-1,0,3,5,9,12,15,20,26,31,38,44],gS=31;function _S(e={}){let t=Array.isArray(e.nums)&&e.nums.length>0?[...e.nums]:[...hS],n=Number.isFinite(e.target)?e.target:gS,r=[],i=0,a=t.length-1,o=-1,s=!1,c=(e,c,l={})=>{r.push({phase:e,desc:c,nums:[...t],target:n,left:i,right:a,prevLeft:i,prevRight:a,mid:null,value:null,cmp:null,action:null,eliminated:0,result:o,found:s,done:e===`done`,...l})};c(`init`,`有序数组 \`[${t.join(`, `)}]\`，找 \`target = ${n}\`。二分的本质不是"折半"，是**维持一条不变量**：若 target 在数组里，它的下标永远落在闭区间 \`[left, right]\` 内。开局区间是整段 \`[0, ${t.length-1}]\`。每轮探中点、把**不可能的一半**整段扔掉 —— 扔掉的前半句是"检查过 mid"，后半句是"边界必须跳过 mid"（\`left = mid + 1\` / \`right = mid - 1\`）。三条铁律配套闭区间这一个约定：\`while (left <= right)\`、\`mid = left + ((right - left) >> 1)\`、边界收缩带 ±1。`,{left:0,right:t.length-1,prevLeft:0,prevRight:t.length-1});let l=0;for(;i<=a&&l<64;){l+=1;let e=i,u=a,d=i+(a-i>>1),f=t[d],p=f<n?-1:+(f>n);if(p===0){s=!0,o=d,c(`probe`,`**第 ${r.length} 探**：\`mid = ${e} + ((${u} - ${e}) >> 1) = ${d}\`，\`nums[${d}] = ${f}\` **等于** target —— 结案！注意区间**不动**：命中即返回，二分查找（找特定值）在这一刻就结束了。全程只探了 ${r.length} 次 —— 每探一次砍掉一半，\`log₂(${t.length})\` 级别。`,{mid:d,value:f,cmp:p,action:`found`,eliminated:0});break}p<0?(i=d+1,c(`probe`,`**第 ${r.length} 探**：\`mid = ${e} + ((${u} - ${e}) >> 1) = ${d}\`，\`nums[${d}] = ${f} < ${n}\` —— 升序数组里 mid **左边（含 mid）**全部比 target 小，整段排除：\`left = mid + 1 = ${i}\`，\`right\` 不动。一次扔掉 ${d-e+1} 个元素，不变量"答案若在则必在 [left, right]"依然成立。`,{mid:d,value:f,cmp:p,action:`go_right`,eliminated:d-e+1,left:i,right:a,prevLeft:e,prevRight:u})):(a=d-1,c(`probe`,`**第 ${r.length} 探**：\`mid = ${e} + ((${u} - ${e}) >> 1) = ${d}\`，\`nums[${d}] = ${f} > ${n}\` —— mid **右边（含 mid）**全部比 target 大，整段排除：\`right = mid - 1 = ${a}\`，\`left\` 不动。一次扔掉 ${u-d+1} 个元素，搜索区间从 ${u-e+1} 缩到 ${a-i+1}。`,{mid:d,value:f,cmp:p,action:`go_left`,eliminated:u-d+1,left:i,right:a,prevLeft:e,prevRight:u}))}return c(`done`,s?`返回 **\`${o}\`**。复盘：${r.length-1} 次探测把 ${t.length} 个元素砍到命中 —— 每次比较都**排除一半**，这就是 \`O(log n)\` 的全部秘密。三条铁律回顾：① 闭区间 \`[left, right]\` 配 \`while (left <= right)\`；② \`mid = left + ((right - left) >> 1)\` 防爆 int；③ 收缩必带 ±1，mid 检查过不回头。`:`\`left = ${i} > right = ${a}\`，闭区间**空了** —— 不变量的逆否命题：若 target 在数组里它本该还在区间内，区间却已空，所以 target 必不在，返回 \`-1\`。注意 \`left === right + 1\` 恰好是闭区间为空的条件 —— 这就是 \`while (left <= right)\` 的由来。`,{done:!0,result:o,found:s,left:i,right:a}),r}var vS=`binarysearch-styles`,yS=34,bS=62,xS=76,SS=42,CS=132,wS=148,TS=168,ES=46,DS=228,OS=56,kS=306,AS=604,jS=1400,MS=`
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
`;function NS(){if(document.getElementById(vS))return;let e=document.createElement(`style`);e.id=vS,e.textContent=MS,document.head.appendChild(e)}function PS(e,t={}){if(!e||e.dataset.binarysearchMounted===`1`)return{destroy(){}};e.dataset.binarysearchMounted=`1`,NS();let n=_S(t),r=t.autoplay!==!1,i=n[0].nums,a=n[0].target,o=Y,s=document.createElement(`div`);s.className=`viz bsv`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=o(`svg`,{class:`viz__svg bsv__svg`,viewBox:`0 0 660 328`,role:`img`,"aria-label":`二分查找 LC704 推演动画`});c.appendChild(l);let u=o(`g`,{}),d=o(`g`,{});l.appendChild(u),l.appendChild(d);let f=o(`text`,{class:`bsv-note`,x:26,y:yS});f.textContent=`不变量：target 若在数组里，下标恒在 [left, right]`,d.appendChild(f);let p=o(`text`,{class:`bsv-note bsv-note--r`,x:634,y:yS});p.textContent=`target = ${a}`,d.appendChild(p);let m=i.length,h=Math.min(46,Math.floor((AS-(m-1)*4)/Math.max(1,m))),g=(660-(m*h+(m-1)*4))/2,_=i.map((e,t)=>{let n=g+t*(h+4),r=o(`g`,{class:`bsv-cell`});r.appendChild(o(`rect`,{class:`bsv-cell__box`,x:n,y:xS,width:h,height:SS,rx:6}));let i=o(`text`,{class:`bsv-cell__val`,x:n+h/2,y:92});i.textContent=String(e),r.appendChild(i);let a=o(`text`,{class:`bsv-cell__idx`,x:n+h/2,y:109});return a.textContent=String(t),r.appendChild(a),u.appendChild(r),{g:r,cx:n+h/2}}),v=o(`path`,{class:`bsv-tri bsv-tri--m`,d:``}),y=o(`text`,{class:`bsv-ptr bsv-ptr--m`,x:0,y:bS});y.textContent=`mid`;let b=o(`path`,{class:`bsv-tri bsv-tri--l`,d:``}),x=o(`text`,{class:`bsv-ptr bsv-ptr--l`,x:0,y:wS});x.textContent=`left`;let S=o(`path`,{class:`bsv-tri bsv-tri--r`,d:``}),C=o(`text`,{class:`bsv-ptr bsv-ptr--r`,x:0,y:wS});C.textContent=`right`,d.append(v,y,b,x,S,C),d.appendChild(o(`rect`,{class:`bsv-banner__box`,x:26,y:TS,width:608,height:ES,rx:9}));let w=o(`text`,{class:`bsv-banner__text`,x:660/2,y:191});d.appendChild(w),d.appendChild(o(`rect`,{class:`bsv-panel__box`,x:26,y:DS,width:608,height:OS,rx:9}));let T=(e,t)=>{let n=o(`text`,{class:`bsv-panel__label`,x:t,y:243});n.textContent=e;let r=o(`text`,{class:`bsv-panel__num`,x:t,y:265});return d.append(n,r),r},E=T(`left`,660/2-165),D=T(`right`,660/2-55),O=T(`区间大小`,385),k=T(`已排除`,495),A=o(`text`,{class:`bsv-phase__text`,x:660/2,y:kS});d.appendChild(A);let j=document.createElement(`p`);j.className=`viz__desc`,j.setAttribute(`aria-live`,`polite`);function M(e,t){if(!t)return;_.forEach((e,n)=>{let r=[`bsv-cell`];t.mid!==null&&n===t.mid?r.push(t.action===`found`?`is-hit`:`is-mid`):(n<t.left||n>t.right)&&r.push(`is-out`),e.g.setAttribute(`class`,r.join(` `))});let r=(e,t,n)=>n===`down`?`M ${e-6} ${t-8} L ${e+6} ${t-8} L ${e} ${t+1} Z`:`M ${e-6} ${t+8} L ${e+6} ${t+8} L ${e} ${t-1} Z`;if(t.mid!==null){let e=_[t.mid].cx;v.setAttribute(`d`,r(e,xS-4,`down`)),y.setAttribute(`x`,e),v.style.opacity=`1`,y.style.opacity=`1`}else v.setAttribute(`d`,``),v.style.opacity=`0`,y.style.opacity=`0`;let i=t.left<m?_[t.left].cx:_[m-1].cx+h+4,o=t.right>=0?_[t.right].cx:_[0].cx-h-4;b.setAttribute(`d`,r(i,CS,`up`)),x.setAttribute(`x`,i),S.setAttribute(`d`,r(o,CS,`up`)),C.setAttribute(`x`,o);let s=t.left>t.right;if(x.textContent=s?`left>right`:`left`,C.textContent=`right`,t.phase===`probe`){let e=t.cmp<0?`<`:t.cmp>0?`>`:`=`,n=t.action===`found`?`命中 → 返回 ${t.mid}`:t.action===`go_right`?`left = mid + 1 = ${t.left}（排除 ${t.eliminated} 个）`:`right = mid - 1 = ${t.right}（排除 ${t.eliminated} 个）`;w.textContent=`nums[${t.mid}] = ${t.value} ${e} ${a}  →  ${n}`,w.setAttribute(`class`,`bsv-banner__text`+(t.action===`found`?` is-ok`:``))}else t.phase===`done`?(w.textContent=t.found?`返回下标 ${t.result}`:`区间空 → 返回 -1`,w.setAttribute(`class`,`bsv-banner__text`+(t.found?` is-ok`:``))):(w.textContent=`开局：整个数组都是嫌疑区 [0, ${m-1}]`,w.setAttribute(`class`,`bsv-banner__text`));E.textContent=String(t.left),D.textContent=String(t.right),E.setAttribute(`class`,`bsv-panel__num`+(t.action===`go_right`?` is-fresh`:``)),D.setAttribute(`class`,`bsv-panel__num`+(t.action===`go_left`?` is-fresh`:``)),O.textContent=String(Math.max(0,t.right-t.left+1));let c=0;for(let t=1;t<=e;t+=1)c+=n[t].eliminated||0;k.textContent=String(c),t.phase===`init`?A.textContent=`每轮砍一半，但绝不误伤不变量`:t.action===`go_right`?A.textContent=`nums[mid] < target → 左半（含 mid）整段出局`:t.action===`go_left`?A.textContent=`nums[mid] > target → 右半（含 mid）整段出局`:t.action===`found`?A.textContent=`找特定值：命中即返回`:A.textContent=`O(log n)：每探一次，嫌疑减半`,Z(j,t.desc)}s.appendChild(j);let N=Q();s.appendChild(N.root),e.textContent=``,e.appendChild(s),X();let P=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,F=$({steps:n,controls:N,intervalMs:jS,onRender:M});F.jumpTo(Math.trunc(t.initialStep)||0);let I=null;return r&&!P&&typeof IntersectionObserver==`function`&&(I=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){I.disconnect(),I=null,F.play();return}},{threshold:.35}),I.observe(s)),{destroy(){I&&=(I.disconnect(),null),F.destroy(),e.textContent=``,delete e.dataset.binarysearchMounted,document.getElementById(vS)?.remove()}}}var FS=8;function IS(e={}){let t=Number.isInteger(e.x)&&e.x>=0?e.x:FS,n=[],r=0,i=t,a=0,o=(e,o,s={})=>{n.push({phase:e,desc:o,x:t,lo:r,hi:i,prevLo:r,prevHi:i,mid:null,sq:null,le:null,action:null,ans:a,prevAns:a,done:e===`done`,...s})};o(`init`,`求 \`√${t}\` 的整数部分。69 没有数组 —— 但**整数区间 \`[0, ${t}]\` 就是那个有序数组**：定义谓词 \`P(k) = (k * k <= ${t})\`，k 越大 k² 越大，P 必是"前真后假"：\`true true … true | false … false\`。算术平方根 = **最后一个 true 的下标** —— 这是"边界二分"，和 704 的"命中二分"只差一个动作：P(mid) 成立时**不收工**，记下 \`ans = mid\` 当候选，然后 \`lo = mid + 1\` 继续向右找更大的。`,{lo:0,hi:t,prevLo:0,prevHi:t,ans:0,prevAns:0});let s=0;for(;r<=i&&s<64;){s+=1;let e=r,c=i,l=a,u=r+(i-r>>1),d=u*u,f=d<=t;f?(a=u,r=u+1,o(`probe`,`**第 ${n.length} 探**：\`mid = ${e} + ((${c} - ${e}) >> 1) = ${u}\`，\`mid² = ${d} <= ${t}\` —— 谓词成立。但这是**边界**不是命中：mid 右边可能还有更大的合法 k，所以**记候选** \`ans = ${u}\`，\`lo = mid + 1 = ${r}\` **继续向右**。这就是 69 与 704 的分岔口：704 相等即返回，69 成立仍不停。`,{mid:u,sq:d,le:f,action:`record_right`,lo:r,hi:i,prevLo:e,prevHi:c,ans:a,prevAns:l})):(i=u-1,o(`probe`,`**第 ${n.length} 探**：\`mid = ${e} + ((${c} - ${e}) >> 1) = ${u}\`，\`mid² = ${d} > ${t}\` —— 谓词不成立，mid 及右边全是 false，整段排除：\`hi = mid - 1 = ${i}\`，\`ans = ${a}\` 不动。真解被压进 \`[${a}, ${i}]\`，每探一次候选区间减半。`,{mid:u,sq:d,le:f,action:`go_left`,lo:r,hi:i,prevLo:e,prevHi:c,ans:a,prevAns:l}))}return o(`done`,`\`lo = ${r} > hi = ${i}\`，区间空 —— 最后一个记下的候选就是答案：**\`⌊√${t}⌋ = ${a}\`**（校验：\`${a}² = ${a*a} <= ${t}\` 且 \`(${a} + 1)² = ${(a+1)*(a+1)} > ${t}\`）。复盘模板：和 704 同一套闭区间三件套，只把"命中返回"换成"成立记候选再向右" —— **答案不在数组里，答案在谓词的边界上**。`,{done:!0,lo:r,hi:i,ans:a,prevAns:a}),n}var LS=`sqrt-styles`,RS=34,zS=62,BS=76,VS=52,HS=142,US=158,WS=178,GS=46,KS=238,qS=56,JS=316,YS=604,XS=1400,ZS=`
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
`;function QS(){if(document.getElementById(LS))return;let e=document.createElement(`style`);e.id=LS,e.textContent=ZS,document.head.appendChild(e)}function $S(e,t={}){if(!e||e.dataset.sqrtMounted===`1`)return{destroy(){}};e.dataset.sqrtMounted=`1`,QS();let n=IS(t),r=t.autoplay!==!1,i=n[0].x,a=Y,o=document.createElement(`div`);o.className=`viz sqv`;let s=document.createElement(`div`);s.className=`viz__stage`,o.appendChild(s);let c=a(`svg`,{class:`viz__svg sqv__svg`,viewBox:`0 0 660 338`,role:`img`,"aria-label":`x 的平方根 LC69 推演动画`});s.appendChild(c);let l=a(`g`,{}),u=a(`g`,{});c.appendChild(l),c.appendChild(u);let d=a(`text`,{class:`sqv-note`,x:26,y:RS});d.textContent=`谓词 P(k) = k² <= x：前真后假，求最后一个真`,u.appendChild(d);let f=a(`text`,{class:`sqv-note sqv-note--r`,x:634,y:RS});f.textContent=`x = ${i}`,u.appendChild(f);let p=i+1,m=Math.min(52,Math.floor((YS-(p-1)*4)/Math.max(1,p))),h=(660-(p*m+(p-1)*4))/2,g=[];for(let e=0;e<=i;e+=1){let t=h+e*(m+4),n=a(`g`,{class:`sqv-cell`});n.appendChild(a(`rect`,{class:`sqv-cell__box`,x:t,y:BS,width:m,height:VS,rx:6}));let r=a(`text`,{class:`sqv-cell__val`,x:t+m/2,y:93});r.textContent=String(e),n.appendChild(r);let i=a(`text`,{class:`sqv-cell__sub`,x:t+m/2,y:113});i.textContent=`${e*e<=999?e*e:`…`}`,n.appendChild(i);let o=a(`text`,{class:`sqv-cell__sub`,x:t+m/2,y:124});o.textContent=`k²`,n.appendChild(o),l.appendChild(n),g.push({g:n,cx:t+m/2})}let _=a(`path`,{class:`sqv-tri sqv-tri--m`,d:``}),v=a(`text`,{class:`sqv-ptr sqv-ptr--m`,x:0,y:zS});v.textContent=`mid`;let y=a(`path`,{class:`sqv-tri sqv-tri--l`,d:``}),b=a(`text`,{class:`sqv-ptr sqv-ptr--l`,x:0,y:US});b.textContent=`lo`;let x=a(`path`,{class:`sqv-tri sqv-tri--r`,d:``}),S=a(`text`,{class:`sqv-ptr sqv-ptr--r`,x:0,y:US});S.textContent=`hi`,u.append(_,v,y,b,x,S),u.appendChild(a(`rect`,{class:`sqv-banner__box`,x:26,y:WS,width:608,height:GS,rx:9}));let C=a(`text`,{class:`sqv-banner__text`,x:660/2,y:201});u.appendChild(C),u.appendChild(a(`rect`,{class:`sqv-panel__box`,x:26,y:KS,width:608,height:qS,rx:9}));let w=(e,t)=>{let n=a(`text`,{class:`sqv-panel__label`,x:t,y:253});n.textContent=e;let r=a(`text`,{class:`sqv-panel__num`,x:t,y:275});return u.append(n,r),r},T=w(`lo`,660/2-180),E=w(`hi`,660/2-60),D=w(`ans（候选）`,390),O=a(`text`,{class:`sqv-panel__note`,x:525,y:275});u.append(O);let k=a(`text`,{class:`sqv-phase__text`,x:660/2,y:JS});u.appendChild(k);let A=document.createElement(`p`);A.className=`viz__desc`,A.setAttribute(`aria-live`,`polite`);function j(e,t){if(!t)return;g.forEach((e,n)=>{let r=[`sqv-cell`],a=t.mid!==null&&n===t.mid;n*n>i&&r.push(`is-false`),(n<t.lo||n>t.hi)&&!a&&r.push(`is-out`),a?r.push(`is-mid`):n===t.ans&&t.ans*t.ans<=i&&r.push(`is-ans`),e.g.setAttribute(`class`,r.join(` `))});let n=(e,t,n)=>n===`down`?`M ${e-6} ${t-8} L ${e+6} ${t-8} L ${e} ${t+1} Z`:`M ${e-6} ${t+8} L ${e+6} ${t+8} L ${e} ${t-1} Z`;if(t.mid!==null){let e=g[t.mid].cx;_.setAttribute(`d`,n(e,BS-4,`down`)),v.setAttribute(`x`,e),_.style.opacity=`1`,v.style.opacity=`1`}else _.setAttribute(`d`,``),_.style.opacity=`0`,v.style.opacity=`0`;let r=t.lo<=i?g[t.lo].cx:g[i].cx+m+4,a=t.hi>=0?g[t.hi].cx:g[0].cx-m-4;if(y.setAttribute(`d`,n(r,HS,`up`)),b.setAttribute(`x`,r),x.setAttribute(`d`,n(a,HS,`up`)),S.setAttribute(`x`,a),b.textContent=t.lo>t.hi?`lo>hi`:`lo`,t.phase===`probe`){let e=t.le?`<=`:`>`,n=t.le?`记 ans = ${t.mid}，lo = ${t.lo} 继续向右`:`hi = ${t.hi}（mid 及右边全 false）`;C.textContent=`${t.mid}² = ${t.sq} ${e} ${i}  →  ${n}`,C.setAttribute(`class`,`sqv-banner__text`+(t.le?` is-ok`:``))}else t.phase===`done`?(C.textContent=`区间空 → ⌊√${i}⌋ = ${t.ans}`,C.setAttribute(`class`,`sqv-banner__text is-ok`)):(C.textContent=`候选区间 [0, ${i}]：绿色=满足 k²<=${i}，灰色=不满足`,C.setAttribute(`class`,`sqv-banner__text`));T.textContent=String(t.lo),E.textContent=String(t.hi),T.setAttribute(`class`,`sqv-panel__num`+(t.action===`record_right`?` is-fresh`:``)),E.setAttribute(`class`,`sqv-panel__num`+(t.action===`go_left`?` is-fresh`:``)),D.textContent=String(t.ans),D.setAttribute(`class`,`sqv-panel__num`+(t.done?` is-final`:t.action===`record_right`?` is-fresh`:``)),O.textContent=`校验 ${t.ans}² = ${t.ans*t.ans} <= ${i}，(${t.ans}+1)² = ${(t.ans+1)*(t.ans+1)} > ${i}？`,t.phase===`init`?k.textContent=`答案不在数组里，答案在谓词的边界上`:t.action===`record_right`?k.textContent=`成立不收工：记候选，继续向右找更大的`:t.action===`go_left`?k.textContent=`不成立：mid 及右边整段出局`:k.textContent=`区间空 → ans 即最后一个真 = ⌊√x⌋`,Z(A,t.desc)}o.appendChild(A);let M=Q();o.appendChild(M.root),e.textContent=``,e.appendChild(o),X();let N=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,P=$({steps:n,controls:M,intervalMs:XS,onRender:j});P.jumpTo(Math.trunc(t.initialStep)||0);let F=null;return r&&!N&&typeof IntersectionObserver==`function`&&(F=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){F.disconnect(),F=null,P.play();return}},{threshold:.35}),F.observe(o)),{destroy(){F&&=(F.disconnect(),null),P.destroy(),e.textContent=``,delete e.dataset.sqrtMounted,document.getElementById(LS)?.remove()}}}var eC=[7,1,5,3,6,4];function tC(e={}){let t=Array.isArray(e.prices)&&e.prices.length>0?[...e.prices]:[...eC],n=[],r=t[0],i=0,a=(e,a,o={})=>{n.push({phase:e,desc:a,prices:[...t],day:0,price:null,prevPrice:null,minPrice:r,prevMin:r,candidate:null,best:i,prevBest:i,updated:null,result:i,done:e===`done`,...o})};a(`init`,`价格序列 \`[${t.join(`, `)}]\`。只许**买卖一次**（先买后卖），求最大利润。暴力枚举所有 (买, 卖) 对是 \`O(n²)\`；一维扫描只需两个变量：\`minPrice\` = **截至昨天**的历史最低价（我手里最便宜的那笔买入），\`best\` = 历史最大的"今天卖出"利润。开局第 0 天：\`minPrice = ${t[0]}\`，还没卖过，\`best = 0\`。每天两件事、**顺序固定**：先按今天的价格卖一把，再把今天并入历史最低价 —— 反了就变成"今天买今天卖"。`,{day:0,minPrice:t[0],prevMin:t[0],best:0,prevBest:0});for(let e=1;e<t.length;e+=1){let n=t[e],o=t[e-1],s=r,c=i,l=n-s,u=Math.max(c,l),d=Math.min(s,n),f=u>c?`best`:d<s?`minPrice`:`none`;i=u,r=d;let p;p=f===`best`?`**第 ${e} 天** \`price = ${n}\`：先卖一把 —— \`candidate = ${n} - ${s} = ${l}\`，\`best = max(${c}, ${l}) = ${i}\` **刷新**！历史最低价仍是 \`${s}\`（今天比它贵，不更新）。注意 candidate 用的是**更新前**的 minPrice —— 先卖后记，顺序即题意。`:f===`minPrice`?`**第 ${e} 天** \`price = ${n}\`：卖一把 \`candidate = ${n} - ${s} = ${l} ≤ ${c}\`，best 不动；但今天比历史最低价还便宜，\`minPrice = ${r}\` **刷新** —— 它在等未来某一天把这笔"便宜买入"卖出去。全程最低价是不断**下台阶**的。`:`**第 ${e} 天** \`price = ${n}\`：\`candidate = ${n} - ${s} = ${l} ≤ best = ${i}\`，且 \`price ≥ minPrice\` 也不刷新历史最低 —— 两变量**原地不动**。大多数日子都是这种"路过帧"：扫描的常态是不动，动的那几帧才是答案的来路。`,a(`scan`,p,{day:e,price:n,prevPrice:o,minPrice:r,prevMin:s,candidate:l,best:i,prevBest:c,updated:f})}return a(`done`,`返回 **\`${i}\`**。复盘：${t.length-1} 次路过，best 只在上坡日刷新、minPrice 只在下台阶日刷新 —— 两个单调变量把 O(n²) 的对枚举压成 O(n)。若全程下跌，candidate 恒为负，best 停在 0（语义 = **干脆不买**，这也是 121 的合法答案）。记住这两个变量的含义：minPrice 是"最便宜的昨天"，best 是"最赚的卖出日"。`,{done:!0,result:i,day:t.length-1}),n}var nC=`stocki-styles`,rC=34,iC=62,aC=76,oC=42,sC=132,cC=148,lC=168,uC=46,dC=228,fC=56,pC=306,mC=604,hC=1500,gC=`
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
`;function _C(){if(document.getElementById(nC))return;let e=document.createElement(`style`);e.id=nC,e.textContent=gC,document.head.appendChild(e)}function vC(e,t={}){if(!e||e.dataset.stockiMounted===`1`)return{destroy(){}};e.dataset.stockiMounted=`1`,_C();let n=tC(t),r=t.autoplay!==!1,i=n[0].prices,a=Y,o=document.createElement(`div`);o.className=`viz siv`;let s=document.createElement(`div`);s.className=`viz__stage`,o.appendChild(s);let c=a(`svg`,{class:`viz__svg siv__svg`,viewBox:`0 0 660 328`,role:`img`,"aria-label":`买卖股票最佳时机 I LC121 推演动画`});s.appendChild(c);let l=a(`g`,{}),u=a(`g`,{});c.appendChild(l),c.appendChild(u);let d=a(`text`,{class:`siv-note`,x:26,y:rC});d.textContent=`先卖一把，再记最低价 —— 顺序即题意`,u.appendChild(d);let f=a(`text`,{class:`siv-note siv-note--r`,x:634,y:rC});f.textContent=`只许买卖一次`,u.appendChild(f);let p=i.length,m=Math.min(64,Math.floor((mC-(p-1)*6)/Math.max(1,p))),h=(660-(p*m+(p-1)*6))/2,g=e=>{let t=0;for(let n=1;n<=(e.phase===`done`?p-1:e.day);n+=1)i[n]<i[t]&&(t=n);return t},_=i.map((e,t)=>{let n=h+t*(m+6),r=a(`g`,{class:`siv-cell`});r.appendChild(a(`rect`,{class:`siv-cell__box`,x:n,y:aC,width:m,height:oC,rx:6}));let i=a(`text`,{class:`siv-cell__val`,x:n+m/2,y:92});i.textContent=String(e),r.appendChild(i);let o=a(`text`,{class:`siv-cell__idx`,x:n+m/2,y:109});return o.textContent=String(t),r.appendChild(o),l.appendChild(r),{g:r,cx:n+m/2}}),v=a(`path`,{class:`siv-tri siv-tri--t`,d:``}),y=a(`text`,{class:`siv-ptr siv-ptr--t`,x:0,y:iC});y.textContent=`today`;let b=a(`path`,{class:`siv-tri siv-tri--m`,d:``}),x=a(`text`,{class:`siv-ptr siv-ptr--m`,x:0,y:cC});x.textContent=`min`,u.append(v,y,b,x),u.appendChild(a(`rect`,{class:`siv-banner__box`,x:26,y:lC,width:608,height:uC,rx:9}));let S=a(`text`,{class:`siv-banner__text`,x:660/2,y:191});u.appendChild(S),u.appendChild(a(`rect`,{class:`siv-panel__box`,x:26,y:dC,width:608,height:fC,rx:9}));let C=(e,t)=>{let n=a(`text`,{class:`siv-panel__label`,x:t,y:243});n.textContent=e;let r=a(`text`,{class:`siv-panel__num`,x:t,y:265});return u.append(n,r),r},w=C(`minPrice`,660/2-145),T=C(`candidate`,660/2-48),E=C(`best`,378),D=C(`day`,475),O=a(`text`,{class:`siv-phase__text`,x:660/2,y:pC});u.appendChild(O);let k=document.createElement(`p`);k.className=`viz__desc`,k.setAttribute(`aria-live`,`polite`);function A(e,t){if(!t)return;let n=g(t),r=t.phase===`done`?-1:t.day;_.forEach((e,i)=>{let a=[`siv-cell`];i===r?a.push(`is-today`):i===n?a.push(`is-min`):t.phase!==`init`&&i<t.day&&a.push(`is-past`),e.g.setAttribute(`class`,a.join(` `))});let i=(e,t,n)=>n===`down`?`M ${e-6} ${t-8} L ${e+6} ${t-8} L ${e} ${t+1} Z`:`M ${e-6} ${t+8} L ${e+6} ${t+8} L ${e} ${t-1} Z`;if(r>=0){let e=_[r].cx;v.setAttribute(`d`,i(e,aC-4,`down`)),y.setAttribute(`x`,e),v.style.opacity=`1`,y.style.opacity=`1`}else v.setAttribute(`d`,``),v.style.opacity=`0`,y.style.opacity=`0`;let a=_[n].cx;if(b.setAttribute(`d`,i(a,sC,`up`)),x.setAttribute(`x`,a),t.phase===`scan`){let e=t.candidate>t.prevBest?`>`:t.candidate<t.prevBest?`<`:`=`,n=t.updated===`best`?`best 刷新 → ${t.best}`:t.updated===`minPrice`?`minPrice 下台阶`:`两变量不动（路过）`;S.textContent=`卖一把：${t.price} - ${t.prevMin} = ${t.candidate} ${e} best ${t.prevBest}  →  ${n}`,S.setAttribute(`class`,`siv-banner__text`+(t.updated===`best`?` is-ok`:``))}else t.phase===`done`?(S.textContent=`最大利润 = ${t.result}（minPrice 等来的那次上坡）`,S.setAttribute(`class`,`siv-banner__text is-ok`)):(S.textContent=`开局：minPrice = ${t.minPrice}，best = 0（还没卖过）`,S.setAttribute(`class`,`siv-banner__text`));w.textContent=String(t.minPrice),w.setAttribute(`class`,`siv-panel__num`+(t.updated===`minPrice`?` is-fresh`:``)),T.textContent=t.candidate===null?`—`:String(t.candidate),T.setAttribute(`class`,`siv-panel__num`+(t.phase===`scan`?` is-fresh`:``)),E.textContent=String(t.best),E.setAttribute(`class`,`siv-panel__num`+(t.phase===`done`?` is-final`:t.updated===`best`?` is-fresh`:``)),D.textContent=String(t.day),t.phase===`init`?O.textContent=`每天两件事：先卖一把，再记最低价`:t.updated===`best`?O.textContent=`上坡日：candidate 超过 best，刷新`:t.updated===`minPrice`?O.textContent=`下台阶日：更便宜的买入机会出现`:t.phase===`done`?O.textContent=`O(n)：两个单调变量吃掉 O(n²) 枚举`:O.textContent=`路过日：既不上坡也不破底，什么都不动`,Z(k,t.desc)}o.appendChild(k);let j=Q();o.appendChild(j.root),e.textContent=``,e.appendChild(o),X();let M=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,N=$({steps:n,controls:j,intervalMs:hC,onRender:A});N.jumpTo(Math.trunc(t.initialStep)||0);let P=null;return r&&!M&&typeof IntersectionObserver==`function`&&(P=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){P.disconnect(),P=null,N.play();return}},{threshold:.35}),P.observe(o)),{destroy(){P&&=(P.disconnect(),null),N.destroy(),e.textContent=``,delete e.dataset.stockiMounted,document.getElementById(nC)?.remove()}}}var yC=[7,1,5,3,6,4];function bC(e={}){let t=Array.isArray(e.prices)&&e.prices.length>0?[...e.prices]:[...yC],n=[],r=0,i=-t[0],a=0,o=(e,o,s={})=>{n.push({phase:e,desc:o,prices:[...t],day:0,price:null,prevPrice:null,diff:null,take:null,greedy:a,prevGreedy:a,cash:r,hold:i,prevCash:r,prevHold:i,sellValue:null,buyValue:null,cashFrom:null,holdFrom:null,result:r,done:e===`done`,...s})};o(`init`,`价格序列 \`[${t.join(`, `)}]\`。可**无限次**买卖（先买后卖、同时最多持一股），求最大利润。每天收盘只有两种状态：\`cash\` = 空仓的最大利润，\`hold\` = 持股的最大利润。开局第 0 天：要么什么都没干 \`cash = 0\`，要么以 \`prices[0] = ${t[0]}\` 建仓 \`hold = -${t[0]}\`（负利润 —— 钱变成票了）。贪心侧同步开局：还没有任何差，\`greedy = 0\`。`,{day:0,cash:0,hold:-t[0],prevCash:0,prevHold:-t[0],greedy:0,prevGreedy:0});for(let e=1;e<t.length;e+=1){let n=t[e],s=t[e-1],c=r,l=i,u=a,d=n-s,f=d>0,p=l+n,m=c-n,h=Math.max(c,p),g=Math.max(l,m),_=u+(f?d:0);r=h,i=g,a=_;let v=p>c?`sell`:`keep`,y=m>l?`buy`:`keep`;o(`scan`,`**第 ${e} 天** \`price = ${n}\`，差值 \`diff = ${n} - ${s} = ${d>0?`+`:``}${d}\`。`+(f?`上坡 → 贪心**吃下**这段：\`greedy = ${u} + ${d} = ${a}\`。`:`下坡 → 贪心**跳过**（不持仓躲过去）：\`greedy\` 保持 ${a}。`)+` DP 侧两条转移同时打分：\`cash = max(空仓不动 ${c}, 今天卖 ${l} + ${n} = ${p}) = ${r}\`；\`hold = max(持股不动 ${l}, 今天买 ${c} - ${n} = ${m}) = ${i}\`。注意 hold 用的 buyValue 是**更新前**的 cash —— 卖和买不能在同一天既变现又建仓（先卖后买等价于"换仓"，题意允许）。看面板：\`greedy\` 与 \`cash\` **逐帧相等** —— 贪心就是这台状态机在"每天必做决定"下的投影。`,{day:e,price:n,prevPrice:s,diff:d,take:f,greedy:a,prevGreedy:u,cash:r,hold:i,prevCash:c,prevHold:l,sellValue:p,buyValue:m,cashFrom:v,holdFrom:y})}return o(`done`,`终态取 **\`cash = ${r}\`**（答案必在空仓侧 —— 持股未变现不算利润）。复盘：正差之和 = ${a}，与 cash 全程逐帧相等，两条路一个终点。等价操作是把每段上坡拆成独立交易：${t.slice(1).map((e,n)=>({d:n+1,diff:e-t[n]})).filter(e=>e.diff>0).map(e=>`第 ${e.d-1}→${e.d} 天 +${e.diff}`).join(`，`)||`（全程无上坡）`}。冷冻期 309 给 cash 加一支"昨天刚卖"、手续费 714 在卖的那支减 fee、限两笔 123 把 cash/hold 复制成四变量 —— 方程一改，机器照跑。`,{done:!0,result:r,day:t.length-1}),n}var xC=`stockii-styles`,SC=34,CC=72,wC=42,TC=129,EC=148,DC=58,OC=224,kC=46,AC=286,jC=56,MC=364,NC=604,PC=1600,FC=`
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
`;function IC(){if(document.getElementById(xC))return;let e=document.createElement(`style`);e.id=xC,e.textContent=FC,document.head.appendChild(e)}function LC(e,t={}){if(!e||e.dataset.stockiiMounted===`1`)return{destroy(){}};e.dataset.stockiiMounted=`1`,IC();let n=bC(t),r=t.autoplay!==!1,i=n[0].prices,a=Y,o=document.createElement(`div`);o.className=`viz sv2`;let s=document.createElement(`div`);s.className=`viz__stage`,o.appendChild(s);let c=a(`svg`,{class:`viz__svg sv2__svg`,viewBox:`0 0 660 386`,role:`img`,"aria-label":`买卖股票最佳时机 II LC122 推演动画`});s.appendChild(c);let l=a(`g`,{}),u=a(`g`,{});c.appendChild(l),c.appendChild(u);let d=a(`text`,{class:`sv2-note`,x:26,y:SC});d.textContent=`贪心吃正差 ≡ 状态机 cash/hold —— 盯住两列逐帧相等`,u.appendChild(d);let f=a(`text`,{class:`sv2-note sv2-note--r`,x:634,y:SC});f.textContent=`可无限次买卖`,u.appendChild(f);let p=i.length,m=Math.min(64,Math.floor((NC-(p-1)*6)/Math.max(1,p))),h=(660-(p*m+(p-1)*6))/2,g=i.map((e,t)=>{let n=h+t*(m+6),r=a(`g`,{class:`sv2-cell`});r.appendChild(a(`rect`,{class:`sv2-cell__box`,x:n,y:CC,width:m,height:wC,rx:6}));let i=a(`text`,{class:`sv2-cell__val`,x:n+m/2,y:88});i.textContent=String(e),r.appendChild(i);let o=a(`text`,{class:`sv2-cell__idx`,x:n+m/2,y:105});return o.textContent=String(t),r.appendChild(o),l.appendChild(r),{g:r,cx:n+m/2,x:n}}),_=[];for(let e=1;e<p;e+=1){let t=a(`text`,{class:`sv2-diff`,x:g[e-1].x+m+6/2,y:TC});u.appendChild(t),_.push(t)}let v=a(`rect`,{class:`sv2-state__box`,x:120/2,y:EC,width:250,height:DC,rx:10}),y=a(`rect`,{class:`sv2-state__box`,x:350,y:EC,width:250,height:DC,rx:10}),b=a(`text`,{class:`sv2-state__label`,x:185,y:162});b.textContent=`cash（空仓最大利润）`;let x=a(`text`,{class:`sv2-state__label`,x:475,y:162});x.textContent=`hold（持股最大利润）`;let S=a(`text`,{class:`sv2-state__num`,x:185,y:186}),C=a(`text`,{class:`sv2-state__num`,x:475,y:186});u.append(v,y,b,x,S,C),u.appendChild(a(`rect`,{class:`sv2-banner__box`,x:26,y:OC,width:608,height:kC,rx:9}));let w=a(`text`,{class:`sv2-banner__text`,x:660/2,y:247});u.appendChild(w),u.appendChild(a(`rect`,{class:`sv2-panel__box`,x:26,y:AC,width:608,height:jC,rx:9}));let T=(e,t)=>{let n=a(`text`,{class:`sv2-panel__label`,x:t,y:301});n.textContent=e;let r=a(`text`,{class:`sv2-panel__num`,x:t,y:323});return u.append(n,r),r},E=T(`diff`,660/2-165),D=T(`greedy`,660/2-55),O=T(`cash`,385),k=T(`hold`,495),A=a(`text`,{class:`sv2-phase__text`,x:660/2,y:MC});u.appendChild(A);let j=document.createElement(`p`);j.className=`viz__desc`,j.setAttribute(`aria-live`,`polite`);function M(e,t){if(!t)return;let n=t.phase===`done`?-1:t.day;g.forEach((e,r)=>{let i=[`sv2-cell`];r===n?i.push(`is-today`):t.phase!==`init`&&r<t.day&&i.push(`is-past`),e.g.setAttribute(`class`,i.join(` `))});for(let e=1;e<p;e+=1){let n=_[e-1];if(t.phase===`init`||e>t.day){n.textContent=``;continue}let r=i[e]-i[e-1],a=r>0,o=t.phase===`scan`&&e===t.day;n.textContent=`${a?`+`:``}${r}`,n.setAttribute(`class`,`sv2-diff ${a?`is-up`:`is-down`}`+(o?` is-live`:``))}S.textContent=String(t.cash),C.textContent=String(t.hold),v.setAttribute(`class`,`sv2-state__box`+(t.cashFrom===`sell`?` is-win`:``)),y.setAttribute(`class`,`sv2-state__box`+(t.holdFrom===`buy`?` is-win`:``)),S.setAttribute(`class`,`sv2-state__num`+(t.phase===`done`?` is-final`:``)),C.setAttribute(`class`,`sv2-state__num`),t.phase===`scan`?(w.textContent=`cash = max(${t.prevCash}, ${t.prevHold}+${t.price}=${t.sellValue}) = ${t.cash}   hold = max(${t.prevHold}, ${t.prevCash}-${t.price}=${t.buyValue}) = ${t.hold}`,w.setAttribute(`class`,`sv2-banner__text`+(t.cash>t.prevCash?` is-ok`:``))):t.phase===`done`?(w.textContent=`答案 = cash = ${t.result}（终态必须空仓；hold=${t.hold} 是"如果死拿"）`,w.setAttribute(`class`,`sv2-banner__text is-ok`)):(w.textContent=`开局：cash = 0（空仓）  hold = ${t.hold}（第 0 天建仓，钱变票）`,w.setAttribute(`class`,`sv2-banner__text`)),E.textContent=t.diff===null?`—`:`${t.diff>0?`+`:``}${t.diff}`,E.setAttribute(`class`,`sv2-panel__num`+(t.phase===`scan`?` is-fresh`:``)),D.textContent=String(t.greedy),D.setAttribute(`class`,`sv2-panel__num`+(t.take?` is-fresh`:``)),O.textContent=String(t.cash),k.textContent=String(t.hold),t.phase===`init`?A.textContent=`每天收盘：要么空仓 cash，要么持股 hold`:t.take?A.textContent=`上坡：贪心吃下 +差，DP 侧 cash 由"今天卖"刷新`:t.phase===`done`?A.textContent=`greedy 与 cash 全程逐帧相等 —— 贪心 ≡ 状态机`:A.textContent=`下坡：贪心跳过，DP 侧 hold 由"低位补仓"刷新`,Z(j,t.desc)}o.appendChild(j);let N=Q();o.appendChild(N.root),e.textContent=``,e.appendChild(o),X();let P=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,F=$({steps:n,controls:N,intervalMs:PC,onRender:M});F.jumpTo(Math.trunc(t.initialStep)||0);let I=null;return r&&!P&&typeof IntersectionObserver==`function`&&(I=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){I.disconnect(),I=null,F.play();return}},{threshold:.35}),I.observe(o)),{destroy(){I&&=(I.disconnect(),null),F.destroy(),e.textContent=``,delete e.dataset.stockiiMounted,document.getElementById(xC)?.remove()}}}var RC=[1,2,5],zC=11,BC=1/0;function VC(e={}){let t=(Array.isArray(e.coins)?e.coins:[]).filter(e=>Number.isInteger(e)&&e>0),n=Number.isInteger(e.amount)&&e.amount>=0?e.amount:zC;return{coins:t.length>0?t:[...RC],amount:n}}var HC=e=>e===BC?`∞`:String(e);function UC(e={}){let{coins:t,amount:n}=VC(e),r=[],i=Array(n+1).fill(BC);i[0]=0;let a=Array(n+1).fill(null),o=(e,a,o={})=>{r.push({phase:e,desc:a,coins:[...t],amount:n,a:-1,dp:[...i],prevDp:[...i],trials:[],best:null,fromCoin:null,sourceIdx:null,traceIdx:-1,traceCoin:null,picked:[],combination:[],result:i[n]===BC?-1:i[n],done:e===`done`,...o})};o(`init`,`硬币面额 \`[${t.join(`, `)}]\`，目标金额 \`${n}\`，每种硬币**数量不限**，求最少枚数。定义 \`dp[x]\` = 凑出金额 \`x\` 的**最少硬币枚数**：边界 \`dp[0] = 0\`（零元一枚都不用），其余全部初始化成 **∞** —— 先假定凑不出，凑得出再往下降。递推式 \`dp[x] = min( dp[x-c] + 1 )\`：把每枚硬币当作"最后一枚"试一遍，看剩下的 \`x-c\` 最少要几枚、再补上这一枚。金额 \`x\` 从 1 到 ${n} **正序**推进，算 \`dp[x]\` 时用到的 \`dp[x-c]\`（下标更小）早已就绪 —— 这正是"硬币可以重复用"的开关。`);for(let e=1;e<=n;e+=1){let n=[...i],r=[],s=BC,c=null;for(let i of t){let t=e-i;if(t<0){r.push({coin:i,idx:-1,prev:null,value:BC,ok:!1,reachable:!1});continue}let a=n[t],o=a+1,l=o<s;l&&(s=o,c=i),r.push({coin:i,idx:t,prev:a,value:o,ok:l,reachable:a!==BC})}i[e]=s,a[e]=c;let l=r.map(t=>t.idx<0?`\`${t.coin}\` 比 ${e} 大，跳过`:t.prev===BC?`\`${t.coin}\`：dp[${t.idx}] = ∞ 此路不通`:`\`${t.coin}\`：dp[${t.idx}] + 1 = ${t.prev} + 1 = ${t.value}${t.ok?` ✓`:``}`).join(`；`),u=c===null?null:e-c;o(`fill`,`金额 **${e}**：逐个试硬币 —— ${l}。`+(c===null?`三种试法全不可达，\`dp[${e}] = ∞\`（此刻还凑不出）。`:`最小是 ${s}（最后一枚用 \`${c}\`，来源 \`dp[${u}] = ${HC(n[u])}\`），\`dp[${e}] = ${s}\`。`)+`注意比较用的是**更新前**的 dp，且来源格 \`${u??`—`}\` 下标更小、**可能已经用过这枚硬币** —— 无限复用就发生在这一步。`,{a:e,prevDp:n,trials:r,best:s,fromCoin:c,sourceIdx:u})}let s=i[n]!==BC,c=[],l=[n];if(s&&n>0){let e=n;for(;e>0;){let t=a[e],n=e-t;c.push(t),l.push(n),o(`trace`,`**回溯**：\`dp[${e}] = ${HC(i[e])}\`，取到它的最后一枚是 \`${t}\`，于是跳到 \`dp[${n}] = ${HC(i[n])}\`（${HC(i[e])} = ${HC(i[n])} + 1）。已锁定的硬币：${c.map(e=>`\`${e}\``).join(` + `)}。只记枚数还原不出组合，靠的就是这张 \`chosen\` 前驱表。`,{a:e,traceIdx:e,traceCoin:t,sourceIdx:n,picked:[...c]}),e=n}}let u=[...c].reverse();return o(`done`,s?n===0?`返回 **0**：金额为 0，一枚都不用凑。`:`返回 **${i[n]}**：组合 \`${u.join(` + `)} = ${n}\`，共 ${u.length} 枚。回溯链 \`${l.join(` → `)}\`。复盘：\`dp[x]\` 只在正序推进下才允许"自己再叠一枚自己"，这是完全背包与 0-1 背包的**唯一**分界线（见动画 2）。`:`返回 **-1**：\`dp[${n}] = ∞\`，任何硬币组合都凑不出 ${n}。注意 ∞ 在比较里会一路"沉底"—— 只有真正可达的路径才有机会刷新它。`,{a:-1,combination:u,picked:[...c],done:!0}),r}var WC=`coinchange-styles`,GC=1/0,KC=30,qC=56,JC=44,YC=108,XC=120,ZC=48,QC=184,$C=44,ew=242,tw=54,nw=316,rw=604,iw=1350,aw=`
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
`;function ow(){if(document.getElementById(WC))return;let e=document.createElement(`style`);e.id=WC,e.textContent=aw,document.head.appendChild(e)}var sw=e=>e===GC?`∞`:String(e);function cw(e,t={}){if(!e||e.dataset.coinchangeMounted===`1`)return{destroy(){}};e.dataset.coinchangeMounted=`1`,ow();let n=UC(t),r=t.autoplay!==!1,i=n[0].coins,a=n[0].amount,o=Y,s=document.createElement(`div`);s.className=`viz ccv`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=o(`svg`,{class:`viz__svg ccv__svg`,viewBox:`0 0 660 338`,role:`img`,"aria-label":`零钱兑换 LC322 推演动画`});c.appendChild(l);let u=o(`g`,{}),d=o(`g`,{});l.appendChild(u),l.appendChild(d);let f=o(`text`,{class:`ccv-note`,x:26,y:KC});f.textContent=`正序推进金额：来源格下标更小、可能已用过这枚硬币`,d.appendChild(f);let p=o(`text`,{class:`ccv-note ccv-note--r`,x:634,y:KC});p.textContent=`硬币 [${i.join(`, `)}] · 目标 ${a}`,d.appendChild(p);let m=a+1,h=Math.min(52,Math.floor((rw-(m-1)*5)/Math.max(1,m))),g=(660-(m*h+(m-1)*5))/2,_=[];for(let e=0;e<=a;e+=1){let t=g+e*(h+5),n=o(`g`,{class:`ccv-cell`});n.appendChild(o(`rect`,{class:`ccv-cell__box`,x:t,y:qC,width:h,height:JC,rx:6}));let r=o(`text`,{class:`ccv-cell__val`,x:t+h/2,y:72});n.appendChild(r);let i=o(`text`,{class:`ccv-cell__idx`,x:t+h/2,y:91});i.textContent=String(e),n.appendChild(i),u.appendChild(n),_.push({g:n,val:r,cx:t+h/2,x:t})}let v=o(`path`,{class:`ccv-arc`,d:``}),y=o(`path`,{class:`ccv-arc__head`,d:``});d.append(v,y);let b=o(`text`,{class:`ccv-trial__cap`,x:26,y:XC-2});b.setAttribute(`text-anchor`,`start`),d.appendChild(b);let x=i.length,S=Math.min(160,Math.floor((rw-(x-1)*10)/Math.max(1,x))),C=(660-(x*S+(x-1)*10))/2,w=i.map((e,t)=>{let n=C+t*(S+10),r=o(`g`,{class:`ccv-trial`});r.appendChild(o(`rect`,{class:`ccv-trial__box`,x:n,y:XC,width:S,height:ZC,rx:7}));let i=o(`text`,{class:`ccv-trial__coin`,x:n+S/2,y:136});i.textContent=String(e),r.appendChild(i);let a=o(`text`,{class:`ccv-trial__expr`,x:n+S/2,y:154});return r.appendChild(a),d.appendChild(r),{g:r,coin:i,expr:a}});d.appendChild(o(`rect`,{class:`ccv-banner__box`,x:26,y:QC,width:608,height:$C,rx:9}));let T=o(`text`,{class:`ccv-banner__text`,x:660/2,y:206});d.appendChild(T),d.appendChild(o(`rect`,{class:`ccv-panel__box`,x:26,y:ew,width:608,height:tw,rx:9}));let E=(e,t)=>{let n=o(`text`,{class:`ccv-panel__label`,x:t,y:257});n.textContent=e;let r=o(`text`,{class:`ccv-panel__num`,x:t,y:279});return d.append(n,r),r},D=E(`金额 a`,660/2-190),O=E(`dp[a]`,660/2-65),k=E(`fromCoin`,395),A=E(`result`,520),j=o(`text`,{class:`ccv-phase__text`,x:660/2,y:nw});d.appendChild(j);let M=document.createElement(`p`);M.className=`viz__desc`,M.setAttribute(`aria-live`,`polite`);function N(e,t){if(!t)return;let n=new Set;if(t.phase===`trace`){let e=a;for(let r of t.picked)n.add(e),e-=r;n.add(0)}if(_.forEach((e,r)=>{let i=[`ccv-cell`],a=r===t.a,o=t.sourceIdx!==null&&r===t.sourceIdx;a?i.push(`is-target`):o?i.push(`is-source`):t.phase===`trace`&&n.has(r)?i.push(`is-locked`):t.phase===`fill`&&r<t.a&&i.push(`is-past`),t.dp[r]===GC&&i.push(`is-unreach`),e.g.setAttribute(`class`,i.join(` `)),e.val.textContent=sw(t.dp[r])}),t.sourceIdx!==null&&t.sourceIdx!==t.a){let e=_[t.sourceIdx].cx,n=_[t.a].cx;v.setAttribute(`d`,`M ${e} 100 Q ${(e+n)/2} ${YC} ${n} 101`);let r=n>e?-1:1;y.setAttribute(`d`,`M ${n} 101 L ${n+r*6} 95 L ${n-r*6} 95 Z`)}else v.setAttribute(`d`,``),y.setAttribute(`d`,``);if(t.phase===`fill`?(b.textContent=`试每一枚当"最后一枚"：`,w.forEach((e,n)=>{let r=t.trials[n];e.g.style.display=``,e.g.setAttribute(`class`,`ccv-trial`+(r.ok?` is-win`:r.idx<0||!r.reachable?` is-dead`:``)),e.coin.textContent=String(r.coin),e.expr.textContent=r.idx<0?`${r.coin} > ${t.a} 跳过`:`dp[${r.idx}]+1 = ${sw(r.value)}`})):t.phase===`trace`?(b.textContent=`前驱链已锁定：`,w.forEach((e,n)=>{let r=t.picked[n];if(r===void 0){e.g.style.display=`none`;return}e.g.style.display=``,e.g.setAttribute(`class`,`ccv-trial is-win`),e.coin.textContent=String(r),e.expr.textContent=`第 ${n+1} 枚`})):(b.textContent=``,w.forEach(e=>{e.g.style.display=`none`})),t.phase===`fill`){let e=t.trials.filter(e=>e.idx>=0).map(e=>`dp[${e.idx}]+1=${sw(e.value)}`);T.textContent=`dp[${t.a}] = min(${e.join(`, `)}) = ${sw(t.dp[t.a])}`,T.setAttribute(`class`,`ccv-banner__text`+(t.fromCoin===null?``:` is-ok`))}else t.phase===`trace`?(T.textContent=`回溯：dp[${t.a}] = dp[${t.sourceIdx}] + 1 = ${sw(t.dp[t.sourceIdx])} + 1 = ${sw(t.dp[t.a])}`,T.setAttribute(`class`,`ccv-banner__text is-ok`)):t.phase===`done`?(T.textContent=t.result===-1?`答案 = -1：dp[${a}] = ∞，任何组合都凑不出`:`答案 = ${t.result}：${t.combination.join(` + `)} = ${a}`,T.setAttribute(`class`,`ccv-banner__text`+(t.result===-1?``:` is-ok`))):(T.textContent=`开局：dp[0] = 0，其余全是 ∞`,T.setAttribute(`class`,`ccv-banner__text`));D.textContent=t.a<0?`—`:String(t.a),O.textContent=t.a<0?sw(t.dp[a]):sw(t.dp[t.a]),O.setAttribute(`class`,`ccv-panel__num`+(t.a>=0&&t.dp[t.a]!==GC?` is-fresh`:``)+(t.a>=0&&t.dp[t.a]===GC?` is-dead`:``)+(t.phase===`done`&&t.result!==-1?` is-final`:``)),k.textContent=t.phase===`fill`?t.fromCoin===null?`—`:String(t.fromCoin):t.traceCoin===null?`—`:String(t.traceCoin),A.textContent=String(t.result),A.setAttribute(`class`,`ccv-panel__num`+(t.phase===`done`?t.result===-1?` is-dead`:` is-final`:``)),t.phase===`init`?j.textContent=`dp[x] = 凑出金额 x 的最少硬币枚数`:t.phase===`fill`?j.textContent=t.fromCoin===null?`这枚金额此刻还凑不出 → 保持 ∞`:`dp[${t.a}] 由硬币 ${t.fromCoin} 从 dp[${t.sourceIdx}] 转移而来`:t.phase===`trace`?j.textContent=`顺 chosen 前驱表走回 dp[0]，路径就是最优组合`:j.textContent=t.result===-1?`∞ 在 min 里一路沉底，最后原样返回`:`只记枚数还原不出组合 —— 前驱表才带得回硬币`,Z(M,t.desc)}s.appendChild(M);let P=Q();s.appendChild(P.root),e.textContent=``,e.appendChild(s),X();let F=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,I=$({steps:n,controls:P,intervalMs:iw,onRender:N});I.jumpTo(Math.trunc(t.initialStep)||0);let L=null;return r&&!F&&typeof IntersectionObserver==`function`&&(L=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){L.disconnect(),L=null,I.play();return}},{threshold:.35}),L.observe(s)),{destroy(){L&&=(L.disconnect(),null),I.destroy(),e.textContent=``,delete e.dataset.coinchangeMounted,document.getElementById(WC)?.remove()}}}var lw=[1,2,5],uw=11,dw=1/0;function fw(e={}){let t=(Array.isArray(e.coins)?e.coins:[]).filter(e=>Number.isInteger(e)&&e>0),n=Number.isInteger(e.amount)&&e.amount>=0?e.amount:uw;return{coins:t.length>0?t:[...lw],amount:n}}var pw=e=>e===dw?`∞`:String(e),mw=e=>e===dw?-1:e;function hw(e={}){let{coins:t,amount:n}=fw(e),r=[],i=Array(n+1).fill(dw),a=Array(n+1).fill(dw);i[0]=0,a[0]=0;let o=(e,o,s={})=>{r.push({phase:e,desc:o,coins:[...t],amount:n,coinIndex:-1,coin:null,step:0,a:-1,descA:-1,dpAsc:[...i],prevDpAsc:[...i],ascRead:null,ascValue:null,ascUpdated:!1,dpDesc:[...a],prevDpDesc:[...a],descRead:null,descValue:null,descUpdated:!1,ascResult:mw(i[n]),descResult:mw(a[n]),result:mw(i[n]),done:e===`done`,...s})};o(`init`,`把 LC 322 写成背包：**外层面额、内层金额**。硬币 \`[${t.join(`, `)}]\`，目标 \`${n}\`。两块面板的方程**逐字相同**：\`dp[a] = min(dp[a], dp[a-c] + 1)\`；唯一的区别是内层金额的**遍历方向**。左：\`a\` 从 1 到 ${n} **正序**（本轮扫过的区间从左往右长）；右：\`a\` 从 ${n} 降到 1 **逆序**（往左长）。开局两边都是 \`dp[0] = 0\`、其余 **∞**（先假定凑不出）。每一帧同时推两格，盯住"来源格 \`dp[a-c]\` 读到的到底是本轮的新值还是上一轮的老值"。`);for(let e=0;e<t.length;e+=1){let r=t[e],s=[...a],c=[...s];for(let t=1;t<=n;t+=1){let l=t,u=n+1-t,d=[...i],f=[...a],p=null,m=null,h=!1,g=l-r;g>=0&&(p=d[g],m=p+1,m<d[l]&&(i[l]=m,h=!0));let _=null,v=null,y=!1,b=u-r;b>=0&&(_=s[b],v=_+1,v<c[u]&&(c[u]=v,y=!0)),a=s.map((e,t)=>t>=u?c[t]:e);let x=g<0?`\`${l} < ${r}\` 装不下，跳过`:`来源 \`dp[${g}] = ${pw(p)}\` 是**本轮已经刷过的新值**，\`+1 = ${m}\` → ${h?`刷新成 **${i[l]}**`:`不优于现值 ${pw(d[l])}`}`,S=b<0?`\`${u} < ${r}\` 装不下，跳过`:`来源 \`dp[${b}] = ${pw(_)}\` 还是**本轮没碰过的旧值**，\`+1 = ${v}\` → ${y?`刷新成 **${a[u]}**`:`不优于现值 ${pw(f[u])}`}`;o(`update`,`第 ${e+1} 枚硬币 \`c = ${r}\`，本轮第 ${t} 步。**正序（左）处理金额 ${l}**：${x}。**逆序（右）处理金额 ${u}**：${S}。同一行代码，唯一差别是左边的 \`dp[a-c]\` 属于"本轮已经扫过的区间"，右边的不属于 —— 于是左边能"再叠一枚 c"，右边不能。`,{coinIndex:e,coin:r,step:t,a:l,descA:u,prevDpAsc:d,ascRead:p,ascValue:m,ascUpdated:h,prevDpDesc:f,descRead:_,descValue:v,descUpdated:y})}}let s=mw(i[n]),c=mw(a[n]);return o(`done`,`终局：**正序 \`dp[${n}] = ${pw(i[n])}\` → 答案 ${s}**（完全背包，硬币可复用）；逆序 \`dp[${n}] = ${pw(a[n])}\` → ${c}（0-1 背包，每枚硬币最多一次）。`+(c===-1?`逆序不是"算得慢"，而是**题意被改掉了**：三枚硬币总面额 ${t.reduce((e,t)=>e+t,0)} < ${n}，每枚最多用一次永远凑不出。`:`逆序把每枚硬币都锁成一次，答案与正序不同 —— 同样的代码，换个方向就不是这道题了。`)+`记住这条分界线：**内层金额正序 = 完全背包**（322 对），**逆序 = 0-1 背包**（416 分割等和、1049 最后一块石头这类"每件用一次"的用逆序）。也能反过来记：正序读"同一轮已经写好的自己"，逆序读"上一轮留下的自己"。`,{done:!0,result:s}),r}var gw=`coinorder-styles`,_w=1/0,vw=30,yw=58,bw=66,xw=38,Sw=118,Cw=148,ww=156,Tw=208,Ew=226,Dw=46,Ow=286,kw=54,Aw=358,jw=604,Mw=850,Nw=`
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
`;function Pw(){if(document.getElementById(gw))return;let e=document.createElement(`style`);e.id=gw,e.textContent=Nw,document.head.appendChild(e)}var Fw=e=>e===_w?`∞`:String(e);function Iw(e,t={}){if(!e||e.dataset.coinorderMounted===`1`)return{destroy(){}};e.dataset.coinorderMounted=`1`,Pw();let n=hw(t),r=t.autoplay!==!1,i=n[0].coins,a=n[0].amount,o=Y,s=document.createElement(`div`);s.className=`viz cco`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=o(`svg`,{class:`viz__svg cco__svg`,viewBox:`0 0 660 380`,role:`img`,"aria-label":`零钱兑换 LC322 金额正序与逆序对照动画`});c.appendChild(l);let u=o(`g`,{}),d=o(`g`,{});l.appendChild(u),l.appendChild(d);let f=o(`text`,{class:`cco-note`,x:26,y:vw});f.textContent=`同一行方程，只差内层金额的方向`,d.appendChild(f);let p=o(`text`,{class:`cco-note cco-note--r`,x:634,y:vw});p.textContent=`硬币 [${i.join(`, `)}] · 目标 ${a}`,d.appendChild(p);let m=a+1,h=Math.min(46,Math.floor((jw-(m-1)*5)/Math.max(1,m))),g=(660-(m*h+(m-1)*5))/2,_=e=>{let t=[];for(let n=0;n<=a;n+=1){let r=g+n*(h+5),i=o(`g`,{class:`cco-cell`});i.appendChild(o(`rect`,{class:`cco-cell__box`,x:r,y:e,width:h,height:xw,rx:5}));let a=o(`text`,{class:`cco-cell__val`,x:r+h/2,y:e+xw/2-5});i.appendChild(a);let s=o(`text`,{class:`cco-cell__idx`,x:r+h/2,y:e+xw/2+11});s.textContent=String(n),i.appendChild(s),u.appendChild(i),t.push({g:i,val:a,cx:r+h/2})}return t},v=o(`text`,{class:`cco-title cco-title--asc`,x:26,y:yw});v.setAttribute(`text-anchor`,`start`),v.textContent=`正序 1 → ${a}　完全背包（硬币可复用）`;let y=o(`text`,{class:`cco-title cco-title--desc`,x:26,y:Cw});y.setAttribute(`text-anchor`,`start`),y.textContent=`逆序 ${a} → 1　0-1 背包（每枚最多一次）`,d.append(v,y);let b=_(bw),x=_(ww),S=o(`text`,{class:`cco-cap cco-cap--asc`,x:660/2,y:Sw}),C=o(`text`,{class:`cco-cap cco-cap--desc`,x:660/2,y:Tw});d.append(S,C),d.appendChild(o(`rect`,{class:`cco-banner__box`,x:26,y:Ew,width:608,height:Dw,rx:9}));let w=o(`text`,{class:`cco-banner__text`,x:660/2,y:249});d.appendChild(w),d.appendChild(o(`rect`,{class:`cco-panel__box`,x:26,y:Ow,width:608,height:kw,rx:9}));let T=(e,t)=>{let n=o(`text`,{class:`cco-panel__label`,x:t,y:301});n.textContent=e;let r=o(`text`,{class:`cco-panel__num`,x:t,y:323});return d.append(n,r),r},E=T(`coin`,660/2-175),D=T(`本轮第几步`,660/2-45),O=T(`正序 dp[amount]`,425),k=T(`逆序 dp[amount]`,550),A=o(`text`,{class:`cco-phase__text`,x:660/2,y:Aw});d.appendChild(A);let j=document.createElement(`p`);j.className=`viz__desc`,j.setAttribute(`aria-live`,`polite`);function M(e,t,n,r,i,a){e.forEach((e,o)=>{let s=[`cco-cell`];o===n?s.push(`is-target`):o===r?s.push(`is-from`):o>=i&&o<=a&&s.push(`is-scanned`),t[o]===_w&&s.push(`is-unreach`),e.g.setAttribute(`class`,s.join(` `)),e.val.textContent=Fw(t[o])})}function N(e,t){if(!t)return;let n=t.phase===`update`,r=t.coin,i=n&&r!==null&&t.a-r>=0?t.a-r:null,o=n&&r!==null&&t.descA-r>=0?t.descA-r:null;if(M(b,t.dpAsc,n?t.a:-1,i,n?1:-1,n?t.a:-1),M(x,t.dpDesc,n?t.descA:-1,o,n?t.descA:-1,n?a:-1),n?(S.textContent=`本轮已扫 1 → ${t.a}　dp[${t.a}] = ${Fw(t.dpAsc[t.a])}`,C.textContent=`本轮已扫 ${t.descA} → ${a}　dp[${t.descA}] = ${Fw(t.dpDesc[t.descA])}`):t.phase===`done`?(S.textContent=`终态 dp[${a}] = ${Fw(t.dpAsc[a])}`,C.textContent=`终态 dp[${a}] = ${Fw(t.dpDesc[a])}`):(S.textContent=`dp[0] = 0，其余 ∞`,C.textContent=`dp[0] = 0，其余 ∞`),n){let e=t.ascRead===null?`a=${t.a} 装不下`:`a=${t.a}: dp[${i}]+1 = ${Fw(t.ascValue)}${t.ascUpdated?` ✓`:``}`,n=t.descRead===null?`a=${t.descA} 装不下`:`a=${t.descA}: 旧 dp[${o}]+1 = ${Fw(t.descValue)}${t.descUpdated?` ✓`:``}`;w.textContent=`正序｜${e}　　逆序｜${n}`,w.setAttribute(`class`,`cco-banner__text`+(t.ascUpdated?` is-ok`:``))}else t.phase===`done`?(w.textContent=`正序 = ${t.result}　≠　逆序 = ${t.descResult} —— 方向一换，题意就变了`,w.setAttribute(`class`,`cco-banner__text`+(t.descResult===-1?` is-warn`:``))):(w.textContent=`dp[a] = min(dp[a], dp[a-c] + 1)　两边一字不差`,w.setAttribute(`class`,`cco-banner__text`));E.textContent=r===null?`—`:String(r),D.textContent=t.step===0?`—`:String(t.step),O.textContent=String(t.ascResult),O.setAttribute(`class`,`cco-panel__num`+(t.ascResult===-1?` is-dead`:` is-asc`)),k.textContent=String(t.descResult),k.setAttribute(`class`,`cco-panel__num`+(t.descResult===-1?` is-dead`:` is-desc`)),t.phase===`init`?A.textContent=`两块面板：外层面额、内层金额，只差遍历方向`:n?A.textContent=t.ascUpdated?`正序读到的是"本轮的新值"，于是能再叠一枚同一硬币`:`正序这一步没刷新；逆序读到的永远是"上一轮的老值"`:A.textContent=t.descResult===-1?`逆序把每枚硬币都锁成一次 —— 就不再是这道题了`:`正序 = 完全背包，是 LC 322 的正确方向`,Z(j,t.desc)}s.appendChild(j);let P=Q();s.appendChild(P.root),e.textContent=``,e.appendChild(s),X();let F=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,I=$({steps:n,controls:P,intervalMs:Mw,onRender:N});I.jumpTo(Math.trunc(t.initialStep)||0);let L=null;return r&&!F&&typeof IntersectionObserver==`function`&&(L=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){L.disconnect(),L=null,I.play();return}},{threshold:.35}),L.observe(s)),{destroy(){L&&=(L.disconnect(),null),I.destroy(),e.textContent=``,delete e.dataset.coinorderMounted,document.getElementById(gw)?.remove()}}}var Lw=`applepenapple`,Rw=[`apple`,`pen`];function zw(e={}){let t=typeof e.s==`string`&&e.s.length>0?e.s:Lw,n=Array.isArray(e.words)?e.words:[],r=[...new Set(n.filter(e=>typeof e==`string`&&e.length>0))];return{s:t,words:r.length>0?r:[...Rw]}}function Bw(e={}){let{s:t,words:n}=zw(e),r=t.length,i=n.reduce((e,t)=>Math.max(e,t.length),0),a=new Set(n),o=[],s=Array(r+1).fill(!1);s[0]=!0;let c=Array(r+1).fill(null),l=(e,a,l={})=>{o.push({phase:e,desc:a,s:t,words:[...n],n:r,maxLen:i,i:-1,j:-1,seg:``,dpJ:!1,inDict:!1,skipped:0,lo:0,hi:-1,hit:!1,dp:[...s],prevDp:[...s],cut:[...c],result:s[r],segments:[],done:e===`done`,...l})};l(`init`,`给字符串 \`s = "${t}"\`（${r} 个字符）和字典 \`[${n.map(e=>`"${e}"`).join(`, `)}]\`，判断整个 s 能否由字典里的词**整段拼接**而成（词可以重复使用）。定义 \`dp[i]\` = s 的**前 i 个字符**能否拼出：底座 \`dp[0] = true\`（空串天然拼得出），其余先全部 \`false\`。递推 \`dp[i] = OR( dp[j] && s[j:i] ∈ dict )\` —— 语义是**枚举"最后一个词"**：最后一段取 \`s[j:i]\`，只要它本身是词、且它前面的 \`s[0:j]\` 拼得出（\`dp[j] = true\`），\`dp[i]\` 就成立。字典里最长的词是 ${i} 个字符，所以切分点只看窗口 \`j ∈ [i - ${i}, i - 1]\`：更靠左的 j 会让"最后一个词"长度超过 maxLen，不可能命中。任何一个 j 命中，\`dp[i]\` 立刻置 true 并停止扫描（**命中即短路**）。`);for(let e=1;e<=r;e+=1){let n=Math.max(0,e-i),r=e-1,o=0,u=0,d=!1;for(let f=n;f<=r;f+=1){if(!s[f]){o+=1;continue}let p=[...s],m=t.slice(f,e),h=a.has(m);h&&(s[e]=!0,c[e]=f,d=!0),u+=1;let g=n>0?`窗口左端 \`${n} = ${e} - ${i}\`：最后一词最长 ${i}，更靠左的 j 连长度都对不上，不必看。`:``,_=o>0?`先跳过 ${o} 个 \`dp[j] = false\` 的切分点 —— 前一段自己都拼不出来，后面接什么词都白搭。`:``;if(l(`probe`,`前缀 **${e}**（即 \`s\` 的前 ${e} 个字符 \`"${t.slice(0,e)}"\`），窗口 \`j ∈ [${n}, ${r}]\`。`+_+`盯住 \`j = ${f}\`：\`dp[${f}] = true\`（\`"${t.slice(0,f)}"\` 已拼得出），再查最后一段 \`s[${f}:${e}] = "${m}"\` —— `+(h?`**在字典里**，于是 \`dp[${e}] = true\`。命中即短路，本格剩下的切分点不用再试了。`:`不在字典里，这个切分点作废，接着试下一个 j。`)+g,{i:e,j:f,seg:m,dpJ:p[f],inDict:h,skipped:o,lo:n,hi:r,hit:d,prevDp:p}),d)break}u===0&&l(`probe`,`前缀 **${e}**，窗口 \`j ∈ [${n}, ${r}]\` 里 ${o} 个切分点的 \`dp[j]\` 全是 \`false\` —— 前一段自己就拼不出来，后面接什么词都白搭，\`dp[${e}] = false\`。注意 \`dp\` 是**布尔可达性**：没人能走到 \`i\`，这一格就一直是 false，不像 LC 322 那样还有"先设成 ∞、等路径来刷新"的余地。`,{i:e,j:-1,skipped:o,lo:n,hi:r,hit:!1})}let u=s[r],d=[],f=[r];if(u){let e=r;for(;e>0;){let n=c[e];d.push(t.slice(n,e)),f.push(n),e=n}d.reverse()}let p=d.length!==new Set(d).size;return l(`done`,(u?`返回 **true**：\`dp[${r}] = true\`，整个串拼得出来。顺 \`cut\` 表回溯出切分点链 \`${f.join(` → `)}\`，即 \`${d.join(` | `)}\`（${d.length} 段）。`+(p?`注意 \`${d.find((e,t)=>d.indexOf(e)!==t)}\` 用了不止一次 —— **词可重复使用**正是"完全背包"的语义，跟 LC 322 里硬币无限复用是同一件事。`:'每一段都在字典里，每段起点处 `dp[j]` 都是 true（所以 `dp` 表同时也是一张"可达位置"的清单）。'):`返回 **false**：\`dp[${r}] = false\`，无论怎么切都有一段不在字典里。注意 \`dp[i]\` 是**布尔或**：只要有一条通路能走到 i 就够，不必去数"有几种切法"。`)+`这也就是 139 与 322 的分工 —— 322 求**最少枚数**（min），139 求**能否到达**（OR）。`,{segments:d,chain:f,done:!0}),o}var Vw=`wordbreak-styles`,Hw=28,Uw=48,Ww=58,Gw=40,Kw=116,qw=124,Jw=38,Yw=176,Xw=44,Zw=234,Qw=54,$w=310,eT=604,tT=1250,nT=`
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
`;function rT(){if(document.getElementById(Vw))return;let e=document.createElement(`style`);e.id=Vw,e.textContent=nT,document.head.appendChild(e)}function iT(e,t={}){if(!e||e.dataset.wordbreakMounted===`1`)return{destroy(){}};e.dataset.wordbreakMounted=`1`,rT();let n=Bw(t),r=t.autoplay!==!1,{s:i,words:a,n:o,maxLen:s}=n[0],c=Y,l=document.createElement(`div`);l.className=`viz wbv`;let u=document.createElement(`div`);u.className=`viz__stage`,l.appendChild(u);let d=c(`svg`,{class:`viz__svg wbv__svg`,viewBox:`0 0 660 332`,role:`img`,"aria-label":`单词拆分 LC139 推演动画`});u.appendChild(d);let f=c(`g`,{}),p=c(`g`,{}),m=c(`g`,{});d.append(f,p,m);let h=c(`text`,{class:`wbv-note`,x:26,y:Hw});h.textContent=`枚举"最后一个词"：s[j:i] 在字典里，且 dp[j] 为真`,m.appendChild(h);let g=c(`text`,{class:`wbv-note wbv-note--r`,x:634,y:Hw});g.textContent=`s = "${i}" · 字典 [${a.map(e=>`"${e}"`).join(`, `)}]`,m.appendChild(g);let _=o+1,v=Math.min(46,Math.floor((eT-(_-1)*5)/_)),y=(660-(_*v+(_-1)*5))/2,b=e=>y+e*(v+5),x=e=>y+(e+.5)*(v+5),S=c(`rect`,{class:`wbv-band`,x:0,y:Ww-5,width:0,height:50,rx:8});f.appendChild(S);let C=c(`text`,{class:`wbv-lbl`,x:26,y:Uw});C.textContent=`dp[i] = s 的前 i 个字符能不能拼出（0 = 空串）`,m.appendChild(C);let w=[];for(let e=0;e<=o;e+=1){let t=b(e),n=c(`g`,{class:`wbv-cell`});n.appendChild(c(`rect`,{class:`wbv-cell__box`,x:t,y:Ww,width:v,height:Gw,rx:6}));let r=c(`text`,{class:`wbv-cell__val`,x:t+v/2,y:73});n.appendChild(r);let i=c(`text`,{class:`wbv-cell__idx`,x:t+v/2,y:90});i.textContent=String(e),n.appendChild(i),p.appendChild(n),w.push({g:n,val:r})}let T=c(`text`,{class:`wbv-lbl`,x:26,y:Kw});T.textContent=`s 的字符：候选最后一段 s[j:i] 从边界 j 跨到 i`,m.appendChild(T);let E=i.split(``).map((e,t)=>{let n=x(t),r=c(`g`,{}),i=c(`rect`,{class:`wbv-ch`,x:n,y:qw,width:v,height:Jw,rx:6}),a=c(`text`,{class:`wbv-ch__val`,x:n+v/2,y:143});return a.textContent=e,r.append(i,a),p.appendChild(r),{box:i,val:a}}),D=c(`line`,{class:`wbv-cut`,x1:0,y1:Ww-5,x2:0,y2:167});m.appendChild(D),m.appendChild(c(`rect`,{class:`wbv-banner__box`,x:26,y:Yw,width:608,height:Xw,rx:9}));let O=c(`text`,{class:`wbv-banner__text`,x:660/2,y:198});m.appendChild(O),m.appendChild(c(`rect`,{class:`wbv-panel__box`,x:26,y:Zw,width:608,height:Qw,rx:9}));let k=(e,t)=>{let n=c(`text`,{class:`wbv-panel__label`,x:t,y:249});n.textContent=e;let r=c(`text`,{class:`wbv-panel__num`,x:t,y:271});return m.append(n,r),r},A=k(`i`,660/2-230),j=k(`j`,660/2-115),M=k(`跳过 dp[j]=false`,660/2),N=k(`s[j:i]`,445),P=k(`结果`,560),F=c(`text`,{class:`wbv-phase__text`,x:660/2,y:$w});m.appendChild(F);let I=document.createElement(`p`);I.className=`viz__desc`,I.setAttribute(`aria-live`,`polite`);function L(e,t){if(!t)return;let n=t.phase===`probe`,r=n&&t.j>=0,i=t.i;n&&t.hi>=t.lo?(S.setAttribute(`x`,String(b(t.lo)-3)),S.setAttribute(`width`,String(b(t.hi)+v-(b(t.lo)-3)))):S.setAttribute(`width`,`0`),w.forEach((e,a)=>{let o=[`wbv-cell`];r&&a===t.j?o.push(`is-from`):n&&a===i?(o.push(`is-target`),t.hit&&o.push(`is-hit`)):!n||a<i?o.push(t.dp[a]?`is-true`:`is-dead`):o.push(`is-ahead`),e.g.setAttribute(`class`,o.join(` `)),e.val.textContent=t.dp[a]?`T`:`F`}),E.forEach((e,n)=>{let a=`wbv-ch`;r&&n>=t.j&&n<i?a+=` is-word`:t.phase===`done`&&t.result||i>=0&&n<i?a+=` is-prefix`:a+=` is-ahead`,e.box.setAttribute(`class`,a)}),i>=0?(D.setAttribute(`x1`,String(b(i)+v/2)),D.setAttribute(`x2`,String(b(i)+v/2)),D.setAttribute(`opacity`,`0.8`)):D.setAttribute(`opacity`,`0`),r?(O.textContent=`dp[${i}] = dp[${t.j}] && s[${t.j}:${i}] ∈ dict = ${t.dpJ?`true`:`false`} && ${t.inDict?`true`:`false`} = ${t.hit?`true`:`false`}`,O.setAttribute(`class`,`wbv-banner__text`+(t.hit?` is-ok`:``))):n?(O.textContent=`窗口 j ∈ [${t.lo}, ${t.hi}] 内 dp[j] 全为 false → dp[${i}] = false`,O.setAttribute(`class`,`wbv-banner__text`)):t.phase===`done`?(O.textContent=t.result?`答案 true：${t.segments.join(` | `)}`:`答案 false：dp[${o}] 始终为 false`,O.setAttribute(`class`,`wbv-banner__text`+(t.result?` is-ok`:``))):(O.textContent=`dp[i] = OR( dp[j] && s[j:i] ∈ dict )　dp[0] = true`,O.setAttribute(`class`,`wbv-banner__text`)),A.textContent=i<0?`—`:String(i),j.textContent=r?String(t.j):`—`,M.textContent=n?String(t.skipped):`—`,N.textContent=r?`"${t.seg}"`:`—`,N.setAttribute(`class`,`wbv-panel__num`+(r&&t.inDict?` is-fresh`:``)),P.textContent=String(t.result),P.setAttribute(`class`,`wbv-panel__num`+(t.phase===`done`?t.result?` is-ok`:` is-dead`:``)),t.phase===`init`?F.textContent=`dp[0] = true 是唯一底座；其余从 false 开始被"命中"翻上来`:n?F.textContent=t.hit?`命中即短路：dp[${i}] 已为 true，本格剩下的切分点不再试`:r?`这个切分点不成立，继续试下一个 j`:`前一段自己都拼不出来，这一格只能停在 false`:F.textContent=t.result?`每个 true 的 dp[i] 背后都连着一条完整的切分链`:`布尔或全 false：没有任何一条通路能走到 n`,Z(I,t.desc)}l.appendChild(I);let R=Q();l.appendChild(R.root),e.textContent=``,e.appendChild(l),X();let z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,B=$({steps:n,controls:R,intervalMs:tT,onRender:L});B.jumpTo(Math.trunc(t.initialStep)||0);let V=null;return r&&!z&&typeof IntersectionObserver==`function`&&(V=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){V.disconnect(),V=null,B.play();return}},{threshold:.35}),V.observe(l)),{destroy(){V&&=(V.disconnect(),null),B.destroy(),e.textContent=``,delete e.dataset.wordbreakMounted,document.getElementById(Vw)?.remove()}}}var aT=`applepenapple`,oT=[`apple`,`pen`];function sT(e={}){let t=typeof e.s==`string`&&e.s.length>0?e.s:aT,n=Array.isArray(e.words)?e.words:[],r=[...new Set(n.filter(e=>typeof e==`string`&&e.length>0))];return{s:t,words:r.length>0?r:[...oT]}}function cT(e={}){let{s:t,words:n}=sT(e),r=t.length,i=n.reduce((e,t)=>Math.max(e,t.length),0),a=new Set(n),o=Array(r+1).fill(!1);o[0]=!0;for(let e=1;e<=r;e+=1){let n=Math.max(0,e-i);for(let r=n;r<e;r+=1)if(o[r]&&a.has(t.slice(r,e))){o[e]=!0;break}}let s=[],c=[],l=[r],u=r,d=o[r],f=(e,a,u={})=>{s.push({phase:e,desc:a,s:t,words:[...n],n:r,maxLen:i,pos:-1,j:-1,seg:``,dpJ:!1,inDict:!1,hit:!1,lo:0,hi:-1,dp:[...o],locked:c.map(e=>({...e})),segments:[],chain:[...l],result:d,done:e===`done`,...u})};for(f(`init`,`先把 dp 表算出来（与动画一同一台机器）：\`dp[i] = OR( dp[j] && s[j:i] ∈ dict )\`，底座 \`dp[0] = true\`，窗口 \`j ∈ [i - ${i}, i - 1]\`（\`maxLen = ${i}\`）。\`s = "${t}"\`（${r} 个字符），字典 \`[${n.map(e=>`"${e}"`).join(`, `)}]\`，\`dp[${r}] = ${d}\`。这一遍不看"怎么填表"，而看**"表算好之后，怎么把 s 真的切成词"** —— dp 只回答了"能不能"，它没有记住"怎么切"。做法是从右往左走：在位置 \`pos\` 找一个切分点 \`j\`，使 \`dp[j] = true\` 且 \`s[j:pos]\` 在字典里，那 \`s[j:pos]\` 就可以当**最后一个词**，然后把 \`pos\` 挪到 \`j\` 继续往左 —— 走到 \`pos = 0\` 就切完了。扫描方向是 \`j\` 从 \`pos - 1\` 递减（最后一段**从短到长**）。`);u>0;){let e=Math.max(0,u-i),n=u-1,r=!1;for(let s=n;s>=e;--s){let d=t.slice(s,u),p=o[s],m=a.has(d),h=p&&m,g=e>0?`窗口左端 \`${e} = ${u} - ${i}\`：再往左的最后一段就超过 ${i} 个字符了。`:``;if(h){c.push({start:s,end:u,word:d}),c.sort((e,t)=>e.start-t.start),l.push(s);let t=s;f(`scan`,`右端 \`pos = ${u}\`：从 \`j = ${n}\` 往左试，到 \`j = ${s}\` **命中** —— \`dp[${s}] = true\`、\`s[${s}:${u}] = "${d}"\` 在字典里。于是最后一段锁定为 \`"${d}"\`，把 \`pos\` 挪到 \`${t}\`，继续往左找剩下的前缀。`+g,{pos:u,j:s,seg:d,dpJ:p,inDict:m,hit:!0,lo:e,hi:n}),u=t,r=!0;break}f(`scan`,`右端 \`pos = ${u}\`，试 \`j = ${s}\`：候选最后一段 \`s[${s}:${u}] = "${d}"\` —— `+(p?`\`dp[${s}] = true\`（前缀拼得出）没问题，但 \`"${d}"\` 不在字典里，这条路作废。`:`\`dp[${s}] = false\` —— 前缀 \`"${t.slice(0,s)}"\` 自己就拼不出来，后面接什么词都没用，跳过。`)+g,{pos:u,j:s,seg:d,dpJ:p,inDict:m,hit:!1,lo:e,hi:n})}if(!r)break}let p=c.map(e=>e.word);return f(`done`,(d?`切完：\`${p.join(` | `)}\`（${p.length} 段），切分点链 \`${l.join(` → `)}\`。整个过程**没有额外的 cut 表** —— \`dp\` 表本身就是"每个位置能不能拼出"的完整信息：只要 \`dp[j] = true\` 且 \`s[j:pos]\` 是词，这一段就一定接得上。把"找到一个就停"换成"DFS 枚举所有 j"、再配记忆化，就是 LC 140 单词拆分 II 的标准解。`:`\`dp[${r}] = false\`：从 \`pos = ${r}\` 往左一个能接上的 j 都没有，整串切不开。回溯的前提是 \`dp[${r}] = true\` —— dp 为 false 时连第一步都迈不出去。`)+'回头对照：动画一是**填表**（枚举"最后一个词"、正序推进），动画二是**读表**（从 n 往回切）—— 同一张 `dp`，一个负责"能不能"，一个负责"怎么切"。',{done:!0,segments:p,chain:[...l]}),s}var lT=`wordbreakseg-styles`,uT=28,dT=46,fT=54,pT=34,mT=104,hT=112,gT=46,_T=172,vT=186,yT=44,bT=244,xT=54,ST=320,CT=604,wT=1250,TT=`
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
`;function ET(){if(document.getElementById(lT))return;let e=document.createElement(`style`);e.id=lT,e.textContent=TT,document.head.appendChild(e)}function DT(e,t={}){if(!e||e.dataset.wordbreaksegMounted===`1`)return{destroy(){}};e.dataset.wordbreaksegMounted=`1`,ET();let n=cT(t),r=t.autoplay!==!1,{s:i,words:a,n:o}=n[0],s=Y,c=document.createElement(`div`);c.className=`viz wbs`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);let u=s(`svg`,{class:`viz__svg wbs__svg`,viewBox:`0 0 660 342`,role:`img`,"aria-label":`单词拆分 LC139 切分还原动画`});l.appendChild(u);let d=s(`g`,{}),f=s(`g`,{});u.append(d,f);let p=s(`text`,{class:`wbs-note`,x:26,y:uT});p.textContent=`dp 只回答"能不能"；从 n 往左走，才把 s 切成词`,f.appendChild(p);let m=s(`text`,{class:`wbs-note wbs-note--r`,x:634,y:uT});m.textContent=`s = "${i}" · 字典 [${a.map(e=>`"${e}"`).join(`, `)}]`,f.appendChild(m);let h=o+1,g=Math.min(46,Math.floor((CT-(h-1)*5)/h)),_=(660-(h*g+(h-1)*5))/2,v=e=>_+e*(g+5),y=e=>_+(e+.5)*(g+5),b=s(`text`,{class:`wbs-lbl`,x:26,y:dT});b.textContent=`算好的 dp 表（T = 这一段前缀拼得出）`,f.appendChild(b);let x=[];for(let e=0;e<=o;e+=1){let t=v(e),n=s(`g`,{class:`wbs-cell`});n.appendChild(s(`rect`,{class:`wbs-cell__box`,x:t,y:fT,width:g,height:pT,rx:5}));let r=s(`text`,{class:`wbs-cell__val`,x:t+g/2,y:68});n.appendChild(r);let i=s(`text`,{class:`wbs-cell__idx`,x:t+g/2,y:82});i.textContent=String(e),n.appendChild(i),d.appendChild(n),x.push({g:n,val:r})}let S=s(`text`,{class:`wbs-lbl`,x:26,y:mT});S.textContent=`把 s 逐段切出来：绿 = 已锁定，金 = 正在试，虚线 = 还没切到`,f.appendChild(S);let C=i.split(``).map((e,t)=>{let n=y(t),r=s(`g`,{}),i=s(`rect`,{class:`wbs-ch`,x:n,y:hT,width:g,height:gT,rx:6}),a=s(`text`,{class:`wbs-ch__val`,x:n+g/2,y:135});return a.textContent=e,r.append(i,a),d.appendChild(r),{box:i}}),w=i.split(``).map(()=>{let e=s(`text`,{class:`wbs-seg`,x:0,y:_T});return f.appendChild(e),e}),T=s(`line`,{class:`wbs-cursor`,x1:0,y1:fT,x2:0,y2:162}),E=s(`text`,{class:`wbs-cursor__cap`,x:0,y:174});f.append(T,E),f.appendChild(s(`rect`,{class:`wbs-banner__box`,x:26,y:vT,width:608,height:yT,rx:9}));let D=s(`text`,{class:`wbs-banner__text`,x:660/2,y:208});f.appendChild(D),f.appendChild(s(`rect`,{class:`wbs-panel__box`,x:26,y:bT,width:608,height:xT,rx:9}));let O=(e,t)=>{let n=s(`text`,{class:`wbs-panel__label`,x:t,y:259});n.textContent=e;let r=s(`text`,{class:`wbs-panel__num`,x:t,y:281});return f.append(n,r),r},k=O(`pos`,660/2-230),A=O(`j`,660/2-115),j=O(`dp[j]`,660/2),M=O(`s[j:pos]`,445),N=O(`结果`,560),P=s(`text`,{class:`wbs-phase__text`,x:660/2,y:ST});f.appendChild(P);let F=document.createElement(`p`);F.className=`viz__desc`,F.setAttribute(`aria-live`,`polite`);function I(e,t){if(!t)return;let n=t.phase===`scan`,r=t.pos,i=t.j,a=n&&t.hit?{start:i,end:r}:null;x.forEach((e,a)=>{let o=[`wbs-cell`];n&&a===i?o.push(`is-from`):n&&a===r&&o.push(`is-target`),o.push(t.dp[a]?`is-true`:`is-dead`),e.g.setAttribute(`class`,o.join(` `)),e.val.textContent=t.dp[a]?`T`:`F`});let s=e=>t.locked.some(t=>e>=t.start&&e<t.end);C.forEach((e,t)=>{let o=`wbs-ch`;a&&t>=a.start&&t<a.end?o+=` is-word`:s(t)?o+=` is-locked`:n&&t>=i&&t<r?o+=` is-try`:o+=` is-ahead`,e.box.setAttribute(`class`,o)});let c=[...t.locked].sort((e,t)=>e.start-t.start);if(w.forEach((e,t)=>{let n=c[t];if(!n){e.textContent=``;return}let r=y(n.start),i=y(n.end-1)+g;e.setAttribute(`x`,String((r+i)/2)),e.textContent=`"${n.word}"`}),r>=0){let e=v(r)+g/2;T.setAttribute(`x1`,String(e)),T.setAttribute(`x2`,String(e)),T.setAttribute(`opacity`,`1`),E.setAttribute(`x`,String(e)),E.textContent=`pos=${r}`,E.setAttribute(`opacity`,`1`)}else T.setAttribute(`opacity`,`0`),E.setAttribute(`opacity`,`0`);n?(D.textContent=`dp[${i}] = ${t.dpJ?`true`:`false`} && s[${i}:${r}] = "${t.seg}" ${t.inDict?`∈`:`∉`} dict → ${t.hit?`锁定这一段`:`作废`}`,D.setAttribute(`class`,`wbs-banner__text`+(t.hit?` is-ok`:``))):t.phase===`done`?(D.textContent=t.result?`切分：${t.segments.join(` | `)}`:`返回 false：dp[${o}] 始终为 false`,D.setAttribute(`class`,`wbs-banner__text`+(t.result?` is-ok`:``))):(D.textContent=`dp[i] = OR( dp[j] && s[j:i] ∈ dict )　dp[${o}] = true`,D.setAttribute(`class`,`wbs-banner__text is-ok`)),k.textContent=r<0?`—`:String(r),A.textContent=n?String(i):`—`,j.textContent=n?t.dpJ?`true`:`false`:`—`,j.setAttribute(`class`,`wbs-panel__num`+(n?t.dpJ?` is-ok`:` is-dead`:``)),M.textContent=n?`"${t.seg}"`:`—`,M.setAttribute(`class`,`wbs-panel__num`+(n&&t.inDict?` is-fresh`:``)),N.textContent=String(t.result),N.setAttribute(`class`,`wbs-panel__num`+(t.phase===`done`?t.result?` is-ok`:` is-dead`:``)),t.phase===`init`?P.textContent=`dp 表已经算好；现在从 n 往左，一段一段把 s 切出来`:n?P.textContent=t.hit?`命中：这一段就是最后一个词，把 pos 左移到它的起点`:`这一段接不上（词不在字典里，或前缀 dp[j] 为假）`:P.textContent=t.result?`dp 表 + 贪心回溯就够切出一条合法方案；要枚举所有方案就是 LC 140`:`dp[n] 为 false，从最后一步就迈不出去`,Z(F,t.desc)}c.appendChild(F);let L=Q();c.appendChild(L.root),e.textContent=``,e.appendChild(c),X();let R=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,z=$({steps:n,controls:L,intervalMs:wT,onRender:I});z.jumpTo(Math.trunc(t.initialStep)||0);let B=null;return r&&!R&&typeof IntersectionObserver==`function`&&(B=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){B.disconnect(),B=null,z.play();return}},{threshold:.35}),B.observe(c)),{destroy(){B&&=(B.disconnect(),null),z.destroy(),e.textContent=``,delete e.dataset.wordbreaksegMounted,document.getElementById(lT)?.remove()}}}var OT=[3,6,5,1,8];function kT(e={}){let t=(Array.isArray(e.nums)?e.nums:[]).filter(e=>Number.isInteger(e));return{nums:t.length>0?t:[...OT]}}function AT(e,t){return e.map((e,t)=>({v:e,i:t,m:(e%3+3)%3})).filter(e=>e.m===t).sort((e,t)=>e.v-t.v||e.i-t.i)}function jT(e={}){let{nums:t}=kT(e),n=t.length,r=t.map(e=>(e%3+3)%3),i=t.reduce((e,t)=>e+t,0),a=(i%3+3)%3,o=AT(t,0),s=AT(t,1),c=AT(t,2),l=o.map(e=>e.v),u=s.map(e=>e.v),d=c.map(e=>e.v),f=o.map(e=>e.i),p=s.map(e=>e.i),m=c.map(e=>e.i),h=a===1?s:a===2?c:[],g=a===1?c:a===2?s:[],_=a!==0&&h.length>=1?h[0].v:null,v=_===null?[]:[h[0].i],y=a!==0&&g.length>=2?g[0].v+g[1].v:null,b=y===null?[]:[g[0].i,g[1].i],x=`none`,S=null;a===0?(x=`none`,S=0):_===null&&y===null?(x=`none`,S=null):_!==null&&(y===null||_<=y)?(x=`one`,S=_):(x=`two`,S=y);let C=a===0?i:S===null?0:i-S,w=[],T=(e,o,s={})=>{w.push({phase:e,desc:o,nums:[...t],n,idx:-1,runningSum:i,rems:[...r],total:i,r:a,m0:[...l],m1:[...u],m2:[...d],m0i:[...f],m1i:[...p],m2i:[...m],candOne:_,candOneIdx:[...v],candTwo:y,candTwoIdx:[...b],active:null,chosen:x,drop:S,result:C,done:e===`done`,...s})};T(`init`,`数组 \`[${t.join(`, `)}]\`，求一个**子集**使其和能被 3 整除且最大。注意是**任意个**元素（不是"恰好三个"）—— 约束只有"和 ≡ 0 (mod 3)"。因为元素全为**正数**，\`sum(nums) = ${i}\` 是所有子集和的**上界**：想被 3 整除，唯一手段是**扔掉最少的一小撮**，让剩下的和回到 \`≡ 0\`。先求和，再看它对 3 的余数 \`r = ${i} % 3\`。`,{idx:-1,runningSum:0});let E=0;for(let e=0;e<n;e+=1){E+=t[e];let r=e===n-1,o=(E%3+3)%3;T(`sum`,`把 \`nums[${e}]\`（= ${t[e]}）加进来：当前和 \`${E}\`，对 3 的余数 \`${o}\`。`+(r?`加完全部元素，\`total = ${i}\`、余数 \`r = ${a}\`。`:`继续累加，最后再统一看余数。`),{idx:e,runningSum:E})}if(T(`bucket`,`按**余数**分三桶：\`m0 = [${l.join(`, `)}]\`（余 0，永远不扔）、\`m1 = [${u.join(`, `)}]\`、\`m2 = [${d.join(`, `)}]\`，每桶**升序**。`+(a===0?`\`r = 0\`：\`${i}\` 本身就被 3 整除 —— **全选即最优**，根本不用动桶。`:`\`r = ${a}\`：需要在 \`m${a===1?1:2}\`、\`m${a===1?2:1}\` 里削掉一小撮来修正余数。`)),a!==0){let e=a,t=3-a;T(`candidate`,`候选 A：削**一个余 ${e}**（\`m${e}\` 里最小的那个）—— `+(_===null?`但 \`m${e}\` 是空的，这条路走不通，代价记作 \`∞\`。`:`代价 \`${_}\`（取该桶最小的一个）。`),{active:`one`}),T(`candidate`,`候选 B：削**两个余 ${t}**（\`2 + 2 ≡ 1\`、\`1 + 1 ≡ 2\`，所以两个 \`余 ${t}\` 恰好修正余数）—— `+(y===null?`但 \`m${t}\` 不足两个元素，凑不出两个，代价记作 \`∞\`。`:`取该桶最小的两个，代价 \`${y}\`。`),{active:`two`})}let D=a===0?`不需要削任何元素`:S===null?`两种候选都凑不齐（\`m${a}\` 为空、\`m${3-a}\` 不足两个）`:x===`one`?`候选 A 更小：削一个余 ${a}，代价 \`${S}\``:`候选 B 更小：削两个余 ${3-a}，代价 \`${S}\``;return T(`done`,a===0?`返回 **${i}**：\`total = ${i}\` 已被 3 整除，全选就是答案。记住判据 \`r == 0\` 先短路，别去动桶。`:S===null?`返回 **0**：没有任何子集能被 3 整除，只能选**空集**（和为 0）。`:`返回 **${C}**：${D}，于是 \`${i} − ${S} = ${C}\`。保留的元素和 ${C} 恰好 \`≡ 0 (mod 3)\`。复盘：余数世界里 \`1+1≡2\`、\`2+2≡1\`、\`1+2≡0\` —— 三个同类抵消、一混合白扔、多削只会更亏，所以最小代价必是「最小的一个 \`m${a}\`」或「最小的两个 \`m${3-a}\`」。`,{done:!0}),w}var MT=`greatestsumdiv3-styles`,NT=28,PT=52,FT=60,IT=44,LT=132,RT=38,zT=258,BT=58,VT=330,HT=40,UT=384,WT=50,GT=452,KT=604,qT=1200,JT=`
.gsv { display: flex; flex-direction: column; gap: 14px; }
.gsv__svg { width: 100%; height: auto; display: block; }

.gsv-note {
  fill: var(--gsv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-note--r { text-anchor: end; }

.gsv-lbl {
  fill: var(--gsv-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.gsv-cell__box {
  fill: var(--gsv-fill, #ffffff); stroke: var(--gsv-line, #c3c9c2); stroke-width: 1.5;
}
.gsv-cell__val {
  fill: var(--gsv-ink, #1f2a24); font-size: 15px; font-weight: 800;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-cell__sub {
  fill: var(--gsv-dim, #9aa39c); font-size: 9.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-cell.is-cur .gsv-cell__box {
  fill: var(--gsv-gold-fill, #fdf3e3); stroke: var(--gsv-gold, #c2872f); stroke-width: 3;
}
.gsv-cell.is-cur .gsv-cell__val { fill: var(--gsv-gold, #c2872f); }
.gsv-cell.is-dropped .gsv-cell__box {
  fill: var(--gsv-past, #eef0ec); stroke: var(--gsv-line, #c3c9c2);
  stroke-dasharray: 4 3; stroke-width: 1.5;
}
.gsv-cell.is-dropped .gsv-cell__val { fill: var(--gsv-dim, #9aa39c); text-decoration: line-through; }

.gsv-bucket__row { opacity: 1; transition: opacity 0.2s ease; }
.gsv-bucket.is-ahead { opacity: 0.28; }
.gsv-chip__box {
  fill: var(--gsv-fill, #ffffff); stroke: var(--gsv-line, #c3c9c2); stroke-width: 1.5;
}
.gsv-chip__val {
  fill: var(--gsv-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-bucket.is-hot .gsv-chip__box { stroke: var(--gsv-ok, #3f6b57); stroke-width: 2; }
.gsv-bucket.is-hot .gsv-lbl { fill: var(--gsv-ok, #3f6b57); font-weight: 700; }
.gsv-chip.is-pick .gsv-chip__box {
  fill: var(--gsv-gold-fill, #fdf3e3); stroke: var(--gsv-gold, #c2872f); stroke-width: 3;
}
.gsv-chip.is-pick .gsv-chip__val { fill: var(--gsv-gold, #c2872f); }

.gsv-card__box {
  fill: var(--gsv-fill, #ffffff); stroke: var(--gsv-line, #c3c9c2); stroke-width: 1.5;
}
.gsv-card.is-active .gsv-card__box { stroke: var(--gsv-ok, #3f6b57); stroke-width: 2.5; }
.gsv-card.is-win .gsv-card__box {
  fill: var(--gsv-gold-fill, #fdf3e3); stroke: var(--gsv-gold, #c2872f); stroke-width: 3;
}
.gsv-card__title {
  fill: var(--gsv-muted, #657168); font-size: 12px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-card.is-win .gsv-card__title { fill: var(--gsv-gold, #c2872f); font-weight: 700; }
.gsv-card__num {
  fill: var(--gsv-ink, #1f2a24); font-size: 22px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-card.is-win .gsv-card__num { fill: var(--gsv-gold, #c2872f); }
.gsv-card__num.is-dead { fill: var(--gsv-dim, #9aa39c); font-weight: 500; }

.gsv-banner__box {
  fill: var(--gsv-banner, #f4f3ef); stroke: var(--gsv-line, #c3c9c2); stroke-width: 1.5;
}
.gsv-banner__text {
  fill: var(--gsv-hot, #a45f45); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-banner__text.is-ok { fill: var(--gsv-ok, #3f6b57); }

.gsv-panel__box {
  fill: var(--gsv-fill, #ffffff); stroke: var(--gsv-line, #c3c9c2); stroke-width: 1.5;
}
.gsv-panel__label {
  fill: var(--gsv-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-panel__num {
  fill: var(--gsv-ink, #1f2a24); font-size: 18px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-panel__num.is-ok { fill: var(--gsv-ok, #3f6b57); }
.gsv-panel__num.is-fresh { fill: var(--gsv-gold, #c2872f); }
.gsv-panel__num.is-dead { fill: var(--gsv-dim, #9aa39c); }

.gsv-phase__text {
  fill: var(--gsv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function YT(){if(document.getElementById(MT))return;let e=document.createElement(`style`);e.id=MT,e.textContent=JT,document.head.appendChild(e)}var XT=e=>e==null?`∞`:String(e);function ZT(e,t={}){if(!e||e.dataset.gsdiv3Mounted===`1`)return{destroy(){}};e.dataset.gsdiv3Mounted=`1`,YT();let n=jT(t),r=t.autoplay!==!1,{nums:i}=n[0],a=i.length,o=Y,s=document.createElement(`div`);s.className=`viz gsv`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=o(`svg`,{class:`viz__svg gsv__svg`,viewBox:`0 0 660 474`,role:`img`,"aria-label":`可被三整除的最大和 LC1262 贪心推演动画`});c.appendChild(l);let u=o(`g`,{}),d=o(`g`,{});l.append(u,d);let f=o(`text`,{class:`gsv-note`,x:26,y:NT});f.textContent=`先全选：sum 是上界，只减不增`,d.appendChild(f);let p=o(`text`,{class:`gsv-note gsv-note--r`,x:634,y:NT});p.textContent=`nums = [${i.join(`, `)}] · 目标和 ≡ 0 (mod 3)`,d.appendChild(p);let m=o(`text`,{class:`gsv-lbl`,x:26,y:PT});m.textContent=`nums（每格下方是对 3 的余数）`,d.appendChild(m);let h=Math.min(56,Math.floor((KT-(a-1)*8)/a)),g=(660-(a*h+(a-1)*8))/2,_=i.map((e,t)=>{let n=g+t*(h+8),r=o(`g`,{class:`gsv-cell`});r.appendChild(o(`rect`,{class:`gsv-cell__box`,x:n,y:FT,width:h,height:IT,rx:6}));let i=o(`text`,{class:`gsv-cell__val`,x:n+h/2,y:76});i.textContent=String(e),r.appendChild(i);let a=o(`text`,{class:`gsv-cell__sub`,x:n+h/2,y:95});return a.textContent=`≡${(e%3+3)%3}`,r.appendChild(a),u.appendChild(r),{g:r,box:r.firstChild}}),v=[0,1,2].map(e=>{let t=LT+e*RT,n=o(`g`,{class:`gsv-bucket`}),r=o(`text`,{class:`gsv-lbl`,x:26,y:t+RT/2});return n.appendChild(r),d.appendChild(n),{g:n,lbl:r,y:t,chips:[]}}),y=Math.floor((KT-102)/40);for(let e of[0,1,2]){let t=v[e],n=Math.min(y,10);for(let e=0;e<n;e+=1){let n=128+e*40,r=o(`g`,{class:`gsv-chip`});r.appendChild(o(`rect`,{class:`gsv-chip__box`,x:n,y:t.y+(RT-26)/2,width:34,height:26,rx:5}));let i=o(`text`,{class:`gsv-chip__val`,x:n+34/2,y:t.y+RT/2});r.appendChild(i),t.g.appendChild(r),t.chips.push({g:r,val:i,x:n})}}let b=(KT-24)/2,x=[26,340],S=[0,1].map(e=>{let t=o(`g`,{class:`gsv-card`});t.appendChild(o(`rect`,{class:`gsv-card__box`,x:x[e],y:zT,width:b,height:BT,rx:9}));let n=o(`text`,{class:`gsv-card__title`,x:x[e]+b/2,y:275}),r=o(`text`,{class:`gsv-card__num`,x:x[e]+b/2,y:298});return t.append(n,r),d.appendChild(t),{g:t,title:n,num:r}});d.appendChild(o(`rect`,{class:`gsv-banner__box`,x:26,y:VT,width:608,height:HT,rx:9}));let C=o(`text`,{class:`gsv-banner__text`,x:660/2,y:350});d.appendChild(C),d.appendChild(o(`rect`,{class:`gsv-panel__box`,x:26,y:UT,width:608,height:WT,rx:9}));let w=(e,t)=>{let n=o(`text`,{class:`gsv-panel__label`,x:t,y:398});n.textContent=e;let r=o(`text`,{class:`gsv-panel__num`,x:t,y:419});return d.append(n,r),r},T=w(`S = sum`,660/2-190),E=w(`r = S % 3`,660/2-65),D=w(`代价 drop`,395),O=w(`答案`,520),k=o(`text`,{class:`gsv-phase__text`,x:660/2,y:GT});d.appendChild(k);let A=document.createElement(`p`);A.className=`viz__desc`,A.setAttribute(`aria-live`,`polite`);let j=e=>[e.m0,e.m1,e.m2],M=e=>[e.m0i,e.m1i,e.m2i];function N(e,t){if(!t)return;let n=t.phase===`bucket`||t.phase===`candidate`||t.phase===`done`,r=t.phase===`done`,i=t.r,a=new Set;if(r&&t.chosen===`one`)for(let e of t.candOneIdx)a.add(e);if(r&&t.chosen===`two`)for(let e of t.candTwoIdx)a.add(e);_.forEach((e,n)=>{let r=[`gsv-cell`];t.phase===`sum`&&n===t.idx&&r.push(`is-cur`),a.has(n)&&r.push(`is-dropped`),e.g.setAttribute(`class`,r.join(` `))});let o=t.phase===`candidate`?t.active===`one`?i:3-i:r&&t.chosen===`one`?i:r&&t.chosen===`two`?3-i:-1,s=new Set(r&&t.chosen===`one`?t.candOneIdx:r&&t.chosen===`two`?t.candTwoIdx:t.phase===`candidate`&&t.active===`one`?t.candOneIdx:t.phase===`candidate`&&t.active===`two`?t.candTwoIdx:[]),c=j(t),l=M(t);if(v.forEach((e,t)=>{let r=[`gsv-bucket`];n?t===o&&r.push(`is-hot`):r.push(`is-ahead`),e.g.setAttribute(`class`,r.join(` `)),e.lbl.textContent=`m${t} 余${t}`,e.chips.forEach((e,n)=>{let r=n<c[t].length;e.g.style.display=r?``:`none`,r&&(e.val.textContent=String(c[t][n]),e.g.setAttribute(`class`,`gsv-chip`+(l[t][n]!==void 0&&s.has(l[t][n])?` is-pick`:``)))})}),i===0)S.forEach(e=>{e.g.style.display=`none`});else{S.forEach(e=>{e.g.style.display=``});let e=[{title:`削一个 m${i}`,val:t.candOne,kind:`one`},{title:`削两个 m${3-i}`,val:t.candTwo,kind:`two`}];S.forEach((n,a)=>{let o=e[a],s=[`gsv-card`];t.phase===`candidate`&&t.active===o.kind&&s.push(`is-active`),r&&t.chosen===o.kind&&s.push(`is-win`),n.g.setAttribute(`class`,s.join(` `)),n.title.textContent=i===0?``:o.title,n.num.textContent=XT(o.val),n.num.setAttribute(`class`,`gsv-card__num`+(o.val===null?` is-dead`:``))})}t.phase===`init`?(C.textContent=`S = sum(nums)　r = S % 3`,C.setAttribute(`class`,`gsv-banner__text`)):t.phase===`sum`?(C.textContent=`S = ${t.runningSum}　（继续累加，最后再看 r）`,C.setAttribute(`class`,`gsv-banner__text`)):t.phase===`bucket`?(C.textContent=i===0?`S = ${t.total}, r = 0 → 全选即最优`:`S = ${t.total}, r = ${i} → 需要削掉一小撮修正`,C.setAttribute(`class`,`gsv-banner__text`+(i===0?` is-ok`:``))):t.phase===`candidate`?(C.textContent=`min(候选 A = ${XT(t.candOne)}, 候选 B = ${XT(t.candTwo)})`,C.setAttribute(`class`,`gsv-banner__text`)):(C.textContent=i===0?`答案 = S = ${t.total}`:t.drop===null?`答案 = 0（无可行子集，只能选空集）`:`答案 = ${t.total} − ${t.drop} = ${t.result}`,C.setAttribute(`class`,`gsv-banner__text`+(i===0||t.drop!==null?` is-ok`:``))),T.textContent=String(t.phase===`sum`?t.runningSum:t.total),E.textContent=n?String(i):`—`,E.setAttribute(`class`,`gsv-panel__num`+(n&&i===0?` is-ok`:n?` is-fresh`:``)),D.textContent=n?i===0?`0`:XT(t.drop):`—`,O.textContent=r?String(t.result):`—`,O.setAttribute(`class`,`gsv-panel__num`+(r?t.result>0?` is-ok`:` is-dead`:``)),t.phase===`init`?k.textContent=`元素全为正 → sum 是上界 → 只减不增`:t.phase===`sum`?k.textContent=`先把总和 S 攒出来，再看它对 3 的余数`:t.phase===`bucket`?k.textContent=i===0?`r = 0，一步到位：S 本身就被 3 整除`:`余 0 的不扔；只在 m${i} 与 m${3-i} 上动刀`:t.phase===`candidate`?k.textContent=t.active===`one`?`候选 A：取 m${i} 最小的一个`:`候选 B：取 m${3-i} 最小的两个`:k.textContent=i===0?`全选即答案，一个元素都不用扔`:t.drop===null?`两种候选都凑不齐 → 空集，返回 0`:`每桶只取最小的一个/两个：越靠后的元素越亏，轮不到`,Z(A,t.desc)}s.appendChild(A);let P=Q();s.appendChild(P.root),e.textContent=``,e.appendChild(s),X();let F=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,I=$({steps:n,controls:P,intervalMs:qT,onRender:N});I.jumpTo(Math.trunc(t.initialStep)||0);let L=null;return r&&!F&&typeof IntersectionObserver==`function`&&(L=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){L.disconnect(),L=null,I.play();return}},{threshold:.35}),L.observe(s)),{destroy(){L&&=(L.disconnect(),null),I.destroy(),e.textContent=``,delete e.dataset.gsdiv3Mounted,document.getElementById(MT)?.remove()}}}var QT=[3,6,5,1,8],$T=-1/0;function eE(e={}){let t=(Array.isArray(e.nums)?e.nums:[]).filter(e=>Number.isInteger(e));return{nums:t.length>0?t:[...QT]}}function tE(e={}){let{nums:t}=eE(e),n=t.length,r=[],i=[0,$T,$T],a=(e,a,o={})=>{r.push({phase:e,desc:a,nums:[...t],n,i:-1,x:0,rem:0,dp:[...i],prevDp:[...i],transitions:[],result:i[0],done:e===`done`,...o})};a(`init`,'换一台机器：**三格滚动 dp**。定义 `dp[j]` = 当前已扫描的前缀里，子集和 `≡ j (mod 3)` 的**最大和**（j ∈ {0, 1, 2}）。初值 `dp = [0, −∞, −∞]`：空集的和是 0、余 0；余 1、余 2 暂时不可达，给 `−∞`。对每个元素 `x`，先**快照** `old = dp`，再枚举旧状态 `j`：`dp[(j + x%3) % 3] = max(dp[...], old[j] + x)`。**先快照再写**是 0-1 背包的"每件只用一次"——不拷贝的话，同一个 `x` 会被用两遍。');for(let e=0;e<n;e+=1){let n=t[e],r=(n%3+3)%3,o=[...i],s=[];for(let e=0;e<3;e+=1){if(o[e]===$T)continue;let t=(e+r)%3,a=o[e]+n,c=a>i[t];c&&(i[t]=a),s.push({from:e,to:t,prev:o[e],value:a,ok:c})}let c=s.map(e=>`\`dp[${e.from}]\`(=${nE(e.prev)}) + ${n} → \`dp[${e.to}]\` = ${e.value}${e.ok?` ✓`:`（没刷新）`}`).join(`；`);a(`fill`,`处理 \`nums[${e}] = ${n}\`（余 ${r}）：逐个试旧状态 —— ${c}。本轮只有 \`to\` 指向的那几格可能被刷新：加法 \`(j + ${r}) % 3\` 是**双射**，不同的 \`j\` 落在不同的 \`to\` 上，互不打架。当前 \`dp = [${i.map(nE).join(`, `)}]\`。注意读的是**快照 \`old\`**，所以这个元素只被用了一次。`,{i:e,x:n,rem:r,prevDp:o,transitions:s})}return a(`done`,`返回 **${i[0]}**（\`dp[0]\`）。最终 \`dp = [${i.map(nE).join(`, `)}]\` —— 余 1、余 2 那两格是**中间产物**：它们留着，是为了后面还能被别的数"救"回到余 0。与贪心对照：贪心靠"元素全为正 + 削最小"，dp 不依赖正负，且同样 \`O(n)\` / \`O(1)\`。`,{done:!0}),r}function nE(e){return e===$T?`−∞`:String(e)}var rE=`greatestsumdiv3dp-styles`,iE=28,aE=54,oE=62,sE=44,cE=128,lE=138,uE=58,dE=214,fE=240,pE=40,mE=294,hE=50,gE=362,_E=1250,vE=`
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
`;function yE(){if(document.getElementById(rE))return;let e=document.createElement(`style`);e.id=rE,e.textContent=vE,document.head.appendChild(e)}var bE=e=>e===-1/0||e==null?`−∞`:String(e);function xE(e,t={}){if(!e||e.dataset.gsdiv3dpMounted===`1`)return{destroy(){}};e.dataset.gsdiv3dpMounted=`1`,yE();let n=tE(t),r=t.autoplay!==!1,{nums:i}=n[0],a=Y,o=document.createElement(`div`);o.className=`viz gdv`;let s=document.createElement(`div`);s.className=`viz__stage`,o.appendChild(s);let c=a(`svg`,{class:`viz__svg gdv__svg`,viewBox:`0 0 660 384`,role:`img`,"aria-label":`可被三整除的最大和 LC1262 取模 dp 推演动画`});s.appendChild(c);let l=a(`g`,{}),u=a(`g`,{});c.append(l,u);let d=a(`text`,{class:`gdv-note`,x:26,y:iE});d.textContent=`dp[j] = 子集和 ≡ j (mod 3) 的最大和；每件只用一次（先快照 old）`,u.appendChild(d);let f=a(`text`,{class:`gdv-note gdv-note--r`,x:634,y:iE});f.textContent=`nums = [${i.join(`, `)}]`,u.appendChild(f);let p=a(`text`,{class:`gdv-lbl`,x:26,y:aE});p.textContent=`当前元素`,u.appendChild(p);let m=a(`g`,{});m.appendChild(a(`rect`,{class:`gdv-elem__box`,x:282,y:oE,width:96,height:sE,rx:8}));let h=a(`text`,{class:`gdv-elem__val`,x:330,y:78}),g=a(`text`,{class:`gdv-elem__sub`,x:330,y:97});m.append(h,g),u.appendChild(m);let _=a(`text`,{class:`gdv-lbl`,x:26,y:cE});_.textContent=`dp 三格（余 0 / 余 1 / 余 2）`,u.appendChild(_);let v=e=>66+e*184,y=e=>v(e)+160/2,b=[0,1,2].map(e=>{let t=v(e),n=a(`g`,{class:`gdv-cell`});n.appendChild(a(`rect`,{class:`gdv-cell__box`,x:t,y:lE,width:160,height:uE,rx:8}));let r=a(`text`,{class:`gdv-cell__idx`,x:t+160/2,y:154});r.textContent=`dp[${e}]　余 ${e}`;let i=a(`text`,{class:`gdv-cell__val`,x:t+160/2,y:175});return n.append(r,i),l.appendChild(n),{g:n,val:i}}),x=a(`g`,{});c.appendChild(x);let S=[0,1,2].map(()=>{let e=a(`g`,{}),t=a(`path`,{class:`gdv-arc`,d:``}),n=a(`path`,{class:`gdv-arc__head`,d:``});return e.append(t,n),x.appendChild(e),{g:e,path:t,head:n}});u.appendChild(a(`rect`,{class:`gdv-banner__box`,x:26,y:fE,width:608,height:pE,rx:9}));let C=a(`text`,{class:`gdv-banner__text`,x:660/2,y:260});u.appendChild(C),u.appendChild(a(`rect`,{class:`gdv-panel__box`,x:26,y:mE,width:608,height:hE,rx:9}));let w=(e,t)=>{let n=a(`text`,{class:`gdv-panel__label`,x:t,y:308});n.textContent=e;let r=a(`text`,{class:`gdv-panel__num`,x:t,y:329});return u.append(n,r),r},T=w(`i`,660/2-190),E=w(`x`,660/2-65),D=w(`x % 3`,395),O=w(`答案 dp[0]`,520),k=a(`text`,{class:`gdv-phase__text`,x:660/2,y:gE});u.appendChild(k);let A=document.createElement(`p`);A.className=`viz__desc`,A.setAttribute(`aria-live`,`polite`);function j(e,t){if(!t)return;let n=t.phase===`fill`,r=n?t.transitions:[],i=new Set(r.map(e=>e.from)),a=new Set(r.map(e=>e.to)),o=new Set(r.filter(e=>e.ok).map(e=>e.to));if(m.style.display=n?``:`none`,n&&(h.textContent=String(t.x),g.textContent=`≡${t.rem}`),b.forEach((e,n)=>{let r=[`gdv-cell`];o.has(n)?r.push(`is-updated`):i.has(n)?r.push(`is-source`):a.has(n)&&r.push(`is-target`),t.dp[n]===-1/0&&r.push(`is-unreach`),e.g.setAttribute(`class`,r.join(` `)),e.val.textContent=bE(t.dp[n])}),S.forEach((e,t)=>{let n=r[t];if(!n){e.g.style.display=`none`;return}e.g.style.display=``;let i=y(n.from),a=y(n.to),o=n.from===n.to?228:dE;e.path.setAttribute(`d`,`M ${i} 196 Q ${(i+a)/2} ${o} ${a} 197`);let s=a>i?-1:1;e.head.setAttribute(`d`,`M ${a} 197 L ${a+s*6} 187 L ${a-s*6} 187 Z`);let c=!n.ok;e.path.setAttribute(`class`,`gdv-arc`+(c?` is-dead`:``)),e.head.setAttribute(`class`,`gdv-arc__head`+(c?` is-dead`:``))}),t.phase===`init`?(C.textContent=`dp = [0, −∞, −∞]　dp[j] = 子集和 ≡ j (mod 3) 的最大和`,C.setAttribute(`class`,`gdv-banner__text`)):n?(C.textContent=`dp[(j + ${t.rem}) % 3] = max(dp[...], old[j] + ${t.x})　快照 old = [${t.prevDp.map(bE).join(`, `)}]`,C.setAttribute(`class`,`gdv-banner__text`)):(C.textContent=`答案 = dp[0] = ${t.result}`,C.setAttribute(`class`,`gdv-banner__text is-ok`)),T.textContent=n?String(t.i):`—`,E.textContent=n?String(t.x):`—`,D.textContent=n?String(t.rem):`—`,O.textContent=String(t.result),O.setAttribute(`class`,`gdv-panel__num`+(t.phase===`done`?` is-ok`:n&&o.has(0)?` is-fresh`:``)),t.phase===`init`)k.textContent=`三格状态：dp[0]=0 是底座，余 1 / 余 2 先留 −∞`;else if(n){let e=r.filter(e=>e.ok).length;k.textContent=e>0?`本元素刷新了 ${e} 个状态；更新的格子描金`:`本元素没能刷新任何状态（候选都没超过旧值）`}else k.textContent=`余 1 / 余 2 是中间产物，被后面的数"救"回余 0`;Z(A,t.desc)}o.appendChild(A);let M=Q();o.appendChild(M.root),e.textContent=``,e.appendChild(o),X();let N=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,P=$({steps:n,controls:M,intervalMs:_E,onRender:j});P.jumpTo(Math.trunc(t.initialStep)||0);let F=null;return r&&!N&&typeof IntersectionObserver==`function`&&(F=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){F.disconnect(),F=null,P.play();return}},{threshold:.35}),F.observe(o)),{destroy(){F&&=(F.disconnect(),null),P.destroy(),e.textContent=``,delete e.dataset.gsdiv3dpMounted,document.getElementById(rE)?.remove()}}}var SE=[[1,1,0,0,0],[1,1,0,0,0],[0,0,1,0,0],[0,0,0,1,1]],CE=[[-1,0],[0,1],[1,0],[0,-1]];function wE(e={}){let t=(Array.isArray(e.grid)?e.grid:[]).filter(e=>Array.isArray(e)&&e.length>0).map(e=>e.map(e=>+(e===1||e===`1`)));return{grid:t.length>0&&t[0].length>0?t:SE.map(e=>[...e])}}function TE(e={}){let{grid:t}=wE(e),n=t.length,r=t[0].length,i=Array.from({length:n},()=>Array(r).fill(!1)),a=[],o=(e,o,s={})=>{a.push({phase:e,desc:o,grid:t.map(e=>[...e]),m:n,n:r,visited:i.map(e=>[...e]),count:0,cur:null,frontier:[],pushed:[],depth:0,done:e===`done`,...s})},s=e=>`(${e[0]}, ${e[1]})`;o(`init`,`网格 ${n}×${r}，\`'1'\` 是陆地、\`'0'\` 是水；只有**上下左右**相邻算连通，斜着不算。数岛屿 = 数**连通块**：扫描全网格，遇到一块**未被访问的陆地**就 \`count += 1\`，再用一次染色把与它相连的整座岛全部标记。这里用**显式栈**做 DFS：seed 帧把新岛起点入栈并计数，pop 帧弹出一块、把它四周未访问的陆地标记后压栈。`,{count:0});let c=0;for(let e=0;e<n;e+=1)for(let a=0;a<r;a+=1){if(t[e][a]!==1||i[e][a])continue;c+=1,i[e][a]=!0;let l=[[e,a]];for(o(`seed`,`扫描到 \`(${e}, ${a})\`：是陆地且**未被访问** → 这是一座新岛，\`count = ${c}\`。把起点压栈，开始染色（栈深度 = 1，正对应递归版的第一层调用）。`,{count:c,cur:[e,a],frontier:l.map(e=>[...e]),pushed:[[e,a]],depth:l.length});l.length>0;){let[e,a]=l.pop(),u=[];for(let[o,s]of CE){let c=e+o,d=a+s;c<0||c>=n||d<0||d>=r||t[c][d]!==1||i[c][d]||(i[c][d]=!0,l.push([c,d]),u.push([c,d]))}o(`pop`,`弹出栈顶 \`(${e}, ${a})\`，检查它上下左右四邻：`+(u.length>0?`其中 ${u.map(s).join(`、`)} 是未访问的陆地 → **标记并入栈**（染进同一座岛）。`:`都没能压入新格子（水 / 已访问 / 出界）—— 这一步就走到头了。`)+`当前栈：${l.length?l.map(s).join(` `):`空`}，栈深度 \`${l.length}\`。`,{count:c,cur:[e,a],frontier:l.map(e=>[...e]),pushed:u,depth:l.length})}}return o(`done`,`扫描结束，返回 **${c}**。每座岛在**第一次**碰到它时被计数一次（seed），之后同一座岛的所有陆地都在染色中被标记、再扫到就跳过 —— 这就是"每座岛只 +1 一次"的保证。注意整个过程用**显式栈**：把它换成递归调用，栈深度最坏可达连通块大小（\`O(m·n)\`），蛇形长岛会 \`RecursionError\` / \`StackOverflowError\` —— 这正是要防的爆栈。`,{count:c,done:!0}),a}var EE=`islands-styles`,DE=28,OE=30,kE=74,AE=40,jE=300,ME=334,NE=74,PE=76,FE=162,IE=90,LE=268,RE=292,zE=40,BE=360,VE=1150,HE=`
.giv { display: flex; flex-direction: column; gap: 14px; }
.giv__svg { width: 100%; height: auto; display: block; }

.giv-note {
  fill: var(--giv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.giv-note--r { text-anchor: end; }

.giv-lbl {
  fill: var(--giv-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.giv-cell__box { stroke: var(--giv-line, #c3c9c2); stroke-width: 1.5; }
.giv-cell--land .giv-cell__box { fill: var(--giv-land, #79a892); }
.giv-cell--water .giv-cell__box { fill: var(--giv-water, #eef2ee); stroke: var(--giv-line, #d8ded6); }
.giv-cell--seen .giv-cell__box { fill: var(--giv-seen, #c7cfc8); }
.giv-cell.is-pushed .giv-cell__box { stroke: var(--giv-ok, #3f6b57); stroke-width: 3; }
.giv-cell.is-cur .giv-cell__box { stroke: var(--giv-gold, #c2872f); stroke-width: 3.5; }
.giv-cell__val {
  fill: var(--giv-ink, #1f2a24); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.giv-cell--water .giv-cell__val { fill: var(--giv-dim, #aab2ab); font-weight: 500; }

.giv-box {
  fill: var(--giv-fill, #ffffff); stroke: var(--giv-line, #c3c9c2); stroke-width: 1.5;
}
.giv-count__label {
  fill: var(--giv-muted, #657168); font-size: 11.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.giv-count__num {
  fill: var(--giv-ok, #3f6b57); font-size: 30px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.giv-count__num.is-bumped { fill: var(--giv-gold, #c2872f); }

.giv-chip__box { fill: var(--giv-fill, #ffffff); stroke: var(--giv-line, #c3c9c2); stroke-width: 1.5; }
.giv-chip.is-top .giv-chip__box {
  fill: var(--giv-gold-fill, #fdf3e3); stroke: var(--giv-gold, #c2872f); stroke-width: 2.5;
}
.giv-chip__val {
  fill: var(--giv-ink, #1f2a24); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.giv-chip.is-top .giv-chip__val { fill: var(--giv-gold, #c2872f); font-weight: 700; }
.giv-stack__empty {
  fill: var(--giv-dim, #9aa39c); font-size: 12px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.giv-swatch { stroke: var(--giv-line, #c3c9c2); stroke-width: 1.5; }
.giv-legend { fill: var(--giv-muted, #657168); font-size: 11px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.giv-banner__box {
  fill: var(--giv-banner, #f4f3ef); stroke: var(--giv-line, #c3c9c2); stroke-width: 1.5;
}
.giv-banner__text {
  fill: var(--giv-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.giv-banner__text.is-ok { fill: var(--giv-ok, #3f6b57); }

.giv-phase__text {
  fill: var(--giv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function UE(){if(document.getElementById(EE))return;let e=document.createElement(`style`);e.id=EE,e.textContent=HE,document.head.appendChild(e)}function WE(e,t={}){if(!e||e.dataset.islandsMounted===`1`)return{destroy(){}};e.dataset.islandsMounted=`1`,UE();let n=TE(t),r=t.autoplay!==!1,{grid:i,m:a,n:o}=n[0],s=Y,c=document.createElement(`div`);c.className=`viz giv`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);let u=s(`svg`,{class:`viz__svg giv__svg`,viewBox:`0 0 660 382`,role:`img`,"aria-label":`岛屿数量 LC200 染色推演动画`});l.appendChild(u);let d=s(`g`,{}),f=s(`g`,{});u.append(d,f);let p=s(`text`,{class:`giv-note`,x:26,y:DE});p.textContent=`扫描网格，遇到未访问的陆地就 +1 并染色（显式栈）`,f.appendChild(p);let m=s(`text`,{class:`giv-note giv-note--r`,x:634,y:DE});m.textContent=`${a} × ${o} 网格`,f.appendChild(m);let h=[];for(let e=0;e<a;e+=1){let t=[];for(let n=0;n<o;n+=1){let r=OE+n*46,i=kE+e*46,a=s(`g`,{class:`giv-cell`});a.appendChild(s(`rect`,{class:`giv-cell__box`,x:r,y:i,width:AE,height:AE,rx:6}));let o=s(`text`,{class:`giv-cell__val`,x:r+AE/2,y:i+AE/2});a.appendChild(o),d.appendChild(a),t.push({g:a,val:o})}h.push(t)}f.appendChild(s(`rect`,{class:`giv-box`,x:jE,y:NE,width:ME,height:PE,rx:9}));let g=s(`text`,{class:`giv-count__label`,x:467,y:92});g.textContent=`岛屿数 count`;let _=s(`text`,{class:`giv-count__num`,x:467,y:124});f.append(g,_),f.appendChild(s(`rect`,{class:`giv-box`,x:jE,y:FE,width:ME,height:IE,rx:9}));let v=s(`text`,{class:`giv-lbl`,x:312,y:178});f.appendChild(v);let y=s(`text`,{class:`giv-stack__empty`,x:467,y:215});y.textContent=`（栈空）`,f.appendChild(y);let b=[];for(let e=0;e<4;e+=1){let t=310+e*68,n=s(`g`,{class:`giv-chip`});n.appendChild(s(`rect`,{class:`giv-chip__box`,x:t,y:216,width:60,height:24,rx:5}));let r=s(`text`,{class:`giv-chip__val`,x:t+60/2,y:228});n.appendChild(r),f.appendChild(n),b.push({g:n,val:r})}let x=[{fill:`#79a892`,text:`陆地`},{fill:`#c7cfc8`,text:`已访问`},{fill:`#eef2ee`,text:`水`}],S=OE;for(let e of x){f.appendChild(s(`rect`,{class:`giv-swatch`,x:S,y:LE,width:18,height:18,rx:4,fill:e.fill}));let t=s(`text`,{class:`giv-legend`,x:S+24,y:277});t.textContent=e.text,f.appendChild(t),S+=24+e.text.length*13+20}f.appendChild(s(`rect`,{class:`giv-banner__box`,x:26,y:RE,width:608,height:zE,rx:9}));let C=s(`text`,{class:`giv-banner__text`,x:660/2,y:312});f.appendChild(C);let w=s(`text`,{class:`giv-phase__text`,x:660/2,y:BE});f.appendChild(w);let T=document.createElement(`p`);T.className=`viz__desc`,T.setAttribute(`aria-live`,`polite`);function E(e,t){if(!t)return;let n=t.cur?`${t.cur[0]},${t.cur[1]}`:null,r=new Set(t.pushed.map(e=>`${e[0]},${e[1]}`));h.forEach((e,i)=>{e.forEach((e,a)=>{let o=[`giv-cell`];o.push(t.grid[i][a]===1?`giv-cell--land`:`giv-cell--water`),t.visited[i][a]&&o.push(`giv-cell--seen`),r.has(`${i},${a}`)&&o.push(`is-pushed`),n===`${i},${a}`&&o.push(`is-cur`),e.g.setAttribute(`class`,o.join(` `)),e.val.textContent=String(t.grid[i][a])})}),_.textContent=String(t.count),_.setAttribute(`class`,`giv-count__num`+(t.phase===`seed`?` is-bumped`:``));let i=t.frontier;v.textContent=`显式栈（底 → 顶）· 深度 ${t.depth}`,y.style.display=i.length===0?``:`none`;let a=Math.min(i.length,4);b.forEach((e,t)=>{if(t>=a){e.g.style.display=`none`;return}e.g.style.display=``;let n=i[t];e.val.textContent=`(${n[0]},${n[1]})`;let r=t===a-1&&i.length===a;e.g.setAttribute(`class`,`giv-chip`+(r?` is-top`:``))}),t.phase===`init`?(C.textContent=`数岛屿 = 数连通块　遇到新陆地：count += 1 再染色`,C.setAttribute(`class`,`giv-banner__text`)):t.phase===`seed`?(C.textContent=`新岛：(${t.cur[0]}, ${t.cur[1]}) → count = ${t.count}`,C.setAttribute(`class`,`giv-banner__text is-ok`)):t.phase===`pop`?(C.textContent=`弹出 (${t.cur[0]}, ${t.cur[1]})`+(t.pushed.length?`　压入 ${t.pushed.map(e=>`(${e[0]},${e[1]})`).join(` `)}`:`　无新入栈`),C.setAttribute(`class`,`giv-banner__text`)):(C.textContent=`答案 = ${t.count} 座岛`,C.setAttribute(`class`,`giv-banner__text is-ok`)),t.phase===`init`?w.textContent=`只对「未访问的陆地」计数；水和已访问的陆地直接跳过`:t.phase===`seed`?w.textContent=`seed：一座岛只在此刻 +1，之后它的陆地都会被染色`:t.phase===`pop`?w.textContent=`pop：弹栈顶、把四邻未访问的陆地标记并压栈（栈深度 = 递归版深度）`:w.textContent=`每座岛只 +1 一次；递归版在此处最坏占 O(m·n) 调用栈 → 会爆栈`,Z(T,t.desc)}c.appendChild(T);let D=Q();c.appendChild(D.root),e.textContent=``,e.appendChild(c),X();let O=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,k=$({steps:n,controls:D,intervalMs:VE,onRender:E});k.jumpTo(Math.trunc(t.initialStep)||0);let A=null;return r&&!O&&typeof IntersectionObserver==`function`&&(A=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){A.disconnect(),A=null,k.play();return}},{threshold:.35}),A.observe(c)),{destroy(){A&&=(A.disconnect(),null),k.destroy(),e.textContent=``,delete e.dataset.islandsMounted,document.getElementById(EE)?.remove()}}}var GE=[[1,1,0,0,0],[1,1,0,0,0],[0,0,1,0,0],[0,0,0,1,1]];function KE(e={}){let t=(Array.isArray(e.grid)?e.grid:[]).filter(e=>Array.isArray(e)&&e.length>0).map(e=>e.map(e=>+(e===1||e===`1`)));return{grid:t.length>0&&t[0].length>0?t:GE.map(e=>[...e])}}function qE(e={}){let{grid:t}=KE(e),n=t.length,r=t[0].length,i=(e,t)=>`${e},${t}`,a=new Map,o=e=>{let t=e;for(;a.get(t)!==t;)t=a.get(t);let n=e;for(;a.get(n)!==t;){let e=a.get(n);a.set(n,t),n=e}return t},s=[],c=(e,i,o={})=>{s.push({phase:e,desc:i,grid:t.map(e=>[...e]),m:n,n:r,parent:Object.fromEntries(a),count:0,cur:null,neighbor:null,merged:!1,done:e===`done`,...o})};c(`init`,'换一台机器：**并查集**。每块陆地先自成一个集合（`count += 1`），扫描时把它和**上方、左方**的陆地合并 —— 合并成功一次，连通块数 `count -= 1`。一行行推进，扫完时 `count` 就是岛屿数。全程**没有递归、没有栈**，不存在 DFS 那种"调用栈深过最长的岛"的问题。',{count:0});let l=0;for(let e=0;e<n;e+=1)for(let s=0;s<r;s+=1)if(t[e][s]===1){a.set(i(e,s),i(e,s)),l+=1,c(`add`,`扫到陆地 \`(${e}, ${s})\`：先让它**自成一个集合**（父指针指向自己），\`count = ${l}\`。接下来看它上方 \`(${e-1}, ${s})\`、左方 \`(${e}, ${s-1})\` 是否也是陆地。`,{count:l,cur:[e,s]});for(let[u,d]of[[e-1,s],[e,s-1]]){if(u<0||u>=n||d<0||d>=r||t[u][d]!==1)continue;let f=o(i(e,s)),p=o(i(u,d)),m=!1;f!==p&&(a.set(f,p),--l,m=!0),c(`union`,`与${u===e?`左方`:`上方`} \`(${u}, ${d})\` 合并：\`(${e}, ${s})\` 的根是 \`${f}\`、\`(${u}, ${d})\` 的根是 \`${p}\` —— `+(m?`**根不同**，把 \`${f}\` 挂到 \`${p}\` 下，连通块合并，\`count = ${l}\`。`:`**已经同根**（本就属于同一块），不重复合并。`)+'并查集用"根是否相同"天然去重，不需要额外的 `visited`。',{count:l,cur:[e,s],neighbor:[u,d],merged:m})}}return c(`done`,`扫描结束，返回 **${l}**。\`count\` 从 0 起：**每加一块陆地 +1、每次成功合并 -1**，最后剩下的就是连通块（岛屿）数。并查集的杀手锏不是这题本身，而是**动态加陆地**：若陆地一块块地出现（LC 305），染色法要从头重算，并查集却能**增量维护**答案。`,{count:l,done:!0}),s}var JE=`islandsuf-styles`,YE=28,XE=30,ZE=74,QE=40,$E=300,eD=334,tD=74,nD=76,rD=162,iD=90,aD=292,oD=40,sD=360,cD=1150,lD=[`#79a892`,`#c2872f`,`#8aa0c0`,`#b08fb0`,`#a4b06a`,`#c08a8a`],uD=`
.ufv { display: flex; flex-direction: column; gap: 14px; }
.ufv__svg { width: 100%; height: auto; display: block; }

.ufv-note {
  fill: var(--ufv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ufv-note--r { text-anchor: end; }

.ufv-lbl {
  fill: var(--ufv-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.ufv-cell__box { stroke: var(--ufv-line, #c3c9c2); stroke-width: 1.5; }
.ufv-cell--water .ufv-cell__box { fill: var(--ufv-water, #eef2ee); stroke: var(--ufv-line, #d8ded6); }
.ufv-cell.is-cur .ufv-cell__box { stroke: var(--ufv-gold, #c2872f); stroke-width: 3.5; }
.ufv-cell.is-nbr .ufv-cell__box { stroke: var(--ufv-ok, #3f6b57); stroke-width: 3; }
.ufv-cell__val {
  fill: var(--ufv-ink, #1f2a24); font-size: 9px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ufv-cell--water .ufv-cell__val { fill: var(--ufv-dim, #b3bbb3); }

.ufv-box {
  fill: var(--ufv-fill, #ffffff); stroke: var(--ufv-line, #c3c9c2); stroke-width: 1.5;
}
.ufv-count__label {
  fill: var(--ufv-muted, #657168); font-size: 11.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ufv-count__num {
  fill: var(--ufv-ok, #3f6b57); font-size: 30px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ufv-count__num.is-bumped { fill: var(--ufv-gold, #c2872f); }

.ufv-status__t {
  fill: var(--ufv-ink, #1f2a24); font-size: 12px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ufv-status__t.is-ok { fill: var(--ufv-ok, #3f6b57); font-weight: 700; }
.ufv-status__t.is-muted { fill: var(--ufv-muted, #657168); }

.ufv-caption {
  fill: var(--ufv-muted, #657168); font-size: 11px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.ufv-banner__box {
  fill: var(--ufv-banner, #f4f3ef); stroke: var(--ufv-line, #c3c9c2); stroke-width: 1.5;
}
.ufv-banner__text {
  fill: var(--ufv-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ufv-banner__text.is-ok { fill: var(--ufv-ok, #3f6b57); }

.ufv-phase__text {
  fill: var(--ufv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function dD(){if(document.getElementById(JE))return;let e=document.createElement(`style`);e.id=JE,e.textContent=uD,document.head.appendChild(e)}function fD(e,t={}){if(!e||e.dataset.islandsUfMounted===`1`)return{destroy(){}};e.dataset.islandsUfMounted=`1`,dD();let n=qE(t),r=t.autoplay!==!1,{grid:i,m:a,n:o}=n[0],s=Y,c=document.createElement(`div`);c.className=`viz ufv`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);let u=s(`svg`,{class:`viz__svg ufv__svg`,viewBox:`0 0 660 382`,role:`img`,"aria-label":`岛屿数量 LC200 并查集推演动画`});l.appendChild(u);let d=s(`g`,{}),f=s(`g`,{});u.append(d,f);let p=s(`text`,{class:`ufv-note`,x:26,y:YE});p.textContent=`每块陆地自成集合，与上/左相邻陆地合并：合并一次 count−1`,f.appendChild(p);let m=s(`text`,{class:`ufv-note ufv-note--r`,x:634,y:YE});m.textContent=`${a} × ${o} 网格`,f.appendChild(m);let h=[];for(let e=0;e<a;e+=1){let t=[];for(let n=0;n<o;n+=1){let r=XE+n*46,i=ZE+e*46,a=s(`g`,{class:`ufv-cell`}),o=s(`rect`,{class:`ufv-cell__box`,x:r,y:i,width:QE,height:QE,rx:6}),c=s(`text`,{class:`ufv-cell__val`,x:r+QE/2,y:i+QE/2});a.append(o,c),d.appendChild(a),t.push({g:a,box:o,val:c})}h.push(t)}f.appendChild(s(`rect`,{class:`ufv-box`,x:$E,y:tD,width:eD,height:nD,rx:9}));let g=s(`text`,{class:`ufv-count__label`,x:467,y:92});g.textContent=`连通块数 count`;let _=s(`text`,{class:`ufv-count__num`,x:467,y:124});f.append(g,_),f.appendChild(s(`rect`,{class:`ufv-box`,x:$E,y:rD,width:eD,height:iD,rx:9}));let v=s(`text`,{class:`ufv-lbl`,x:312,y:180});v.textContent=`本步`,f.appendChild(v);let y=s(`text`,{class:`ufv-status__t`,x:312,y:206}),b=s(`text`,{class:`ufv-status__t`,x:312,y:230});f.append(y,b);let x=s(`text`,{class:`ufv-caption`,x:XE,y:277});x.textContent=`同色的陆地 = 同一个根（同一座岛）；格子里是它当前的根坐标`,f.appendChild(x),f.appendChild(s(`rect`,{class:`ufv-banner__box`,x:26,y:aD,width:608,height:oD,rx:9}));let S=s(`text`,{class:`ufv-banner__text`,x:660/2,y:312});f.appendChild(S);let C=s(`text`,{class:`ufv-phase__text`,x:660/2,y:sD});f.appendChild(C);let w=document.createElement(`p`);w.className=`viz__desc`,w.setAttribute(`aria-live`,`polite`);let T=(e,t)=>{let n=t;for(;e[n]!==void 0&&e[n]!==n;)n=e[n];return n};function E(e,t){if(!t)return;let n=t.parent,r=new Map;for(let e=0;e<a;e+=1)for(let i=0;i<o;i+=1){let a=`${e},${i}`;if(t.grid[e][i]!==1||n[a]===void 0)continue;let o=T(n,a);r.has(o)||r.set(o,lD[r.size%lD.length])}let i=t.cur?`${t.cur[0]},${t.cur[1]}`:null,s=t.neighbor?`${t.neighbor[0]},${t.neighbor[1]}`:null;for(let e=0;e<a;e+=1)for(let a=0;a<o;a+=1){let o=h[e][a],c=t.grid[e][a]===1,l=`${e},${a}`,u=[`ufv-cell`];if(!c)u.push(`ufv-cell--water`),o.val.textContent=``,o.box.setAttribute(`fill`,``);else if(n[l]===void 0)o.box.setAttribute(`fill`,`#dbe7df`),o.val.textContent=``;else{let e=T(n,l);o.box.setAttribute(`fill`,r.get(e)||`#79a892`),o.val.textContent=e}s===`${e},${a}`&&u.push(`is-nbr`),i===`${e},${a}`&&u.push(`is-cur`),o.g.setAttribute(`class`,u.join(` `))}if(_.textContent=String(t.count),_.setAttribute(`class`,`ufv-count__num`+(t.phase===`add`?` is-bumped`:``)),t.phase===`init`)y.textContent=`parent = { }`,y.setAttribute(`class`,`ufv-status__t is-muted`),b.textContent=`每块陆地一个集合`,b.setAttribute(`class`,`ufv-status__t is-muted`);else if(t.phase===`add`)y.textContent=`新增集合 (${t.cur[0]},${t.cur[1]})`,y.setAttribute(`class`,`ufv-status__t is-ok`),b.textContent=`count += 1 → ${t.count}`,b.setAttribute(`class`,`ufv-status__t`);else if(t.phase===`union`){let e=T(n,`${t.cur[0]},${t.cur[1]}`),r=T(n,`${t.neighbor[0]},${t.neighbor[1]}`);y.textContent=`根 ${e}  vs  根 ${r}`,y.setAttribute(`class`,`ufv-status__t`),b.textContent=t.merged?`根不同 → 合并，count − 1 → ${t.count}`:`已同根 → 不合并`,b.setAttribute(`class`,`ufv-status__t`+(t.merged?` is-ok`:` is-muted`))}else y.textContent=`最终 count = ${t.count}`,y.setAttribute(`class`,`ufv-status__t is-ok`),b.textContent=`= 岛屿数`,b.setAttribute(`class`,`ufv-status__t is-muted`);t.phase===`init`?(S.textContent=`并查集：每块陆地一个集合，相邻陆地就合并`,S.setAttribute(`class`,`ufv-banner__text`)):t.phase===`add`?(S.textContent=`新增陆地 (${t.cur[0]}, ${t.cur[1]})　count = ${t.count}`,S.setAttribute(`class`,`ufv-banner__text`)):t.phase===`union`?(S.textContent=t.merged?`合并 (${t.cur[0]},${t.cur[1]}) + (${t.neighbor[0]},${t.neighbor[1]})　count = ${t.count}`:`(${t.cur[0]},${t.cur[1]}) 与 (${t.neighbor[0]},${t.neighbor[1]}) 已同根，跳过`,S.setAttribute(`class`,`ufv-banner__text`+(t.merged?` is-ok`:``))):(S.textContent=`答案 = ${t.count} 座岛（连通块数）`,S.setAttribute(`class`,`ufv-banner__text is-ok`)),t.phase===`init`?C.textContent=`无递归、无栈：并查集把"连通"变成"合并集合"`:t.phase===`add`?C.textContent=`每加一块陆地 count += 1，先假定它是一座孤岛`:t.phase===`union`?C.textContent=t.merged?`成功合并一次，连通块数 -1`:`根已相同 —— 并查集天然去重，不需要 visited`:C.textContent=`count = 陆地数 − 成功合并数；动态加陆地时（LC 305）可增量维护`,Z(w,t.desc)}c.appendChild(w);let D=Q();c.appendChild(D.root),e.textContent=``,e.appendChild(c),X();let O=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,k=$({steps:n,controls:D,intervalMs:cD,onRender:E});k.jumpTo(Math.trunc(t.initialStep)||0);let A=null;return r&&!O&&typeof IntersectionObserver==`function`&&(A=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){A.disconnect(),A=null,k.play();return}},{threshold:.35}),A.observe(c)),{destroy(){A&&=(A.disconnect(),null),k.destroy(),e.textContent=``,delete e.dataset.islandsUfMounted,document.getElementById(JE)?.remove()}}}var pD=[[2,1,1],[1,1,0],[0,1,1]],mD=[[-1,0],[0,1],[1,0],[0,-1]];function hD(e={}){let t=(Array.isArray(e.grid)?e.grid:[]).filter(e=>Array.isArray(e)&&e.length>0).map(e=>e.map(e=>e===2||e===`2`?2:+(e===1||e===`1`)));return{grid:t.length>0&&t[0].length>0?t:pD.map(e=>[...e])}}function gD(e={}){let{grid:t}=hD(e),n=t.length,r=t[0].length,i=t.map(e=>[...e]),a=[],o=[],s=0;for(let e=0;e<n;e+=1)for(let t=0;t<r;t+=1)i[e][t]===2?(a.push([e,t]),o.push([e,t])):i[e][t]===1&&(s+=1);let c=[],l=0,u=e=>`(${e[0]}, ${e[1]})`,d=(e,t,u={})=>{c.push({phase:e,desc:t,grid:i.map(e=>[...e]),m:n,n:r,minute:l,fresh:s,queue:o.map(e=>[...e]),layer:[],processed:[],newlyRotted:[],sources:a.map(e=>[...e]),answer:null,done:e===`done`,...u})};for(d(`init`,`**多源 BFS**：初始就把**所有**腐烂橘子 \`${a.map(u).join(`、`)}\` 一起入队 —— 它们都是第 0 分钟的「源」，往外扩散的每一圈都同时出发。现在 minute = 0，还有 ${s} 个新鲜橘子。（只把其中一个源入队是本题第一大坑：分钟数会算大甚至算错。）`);o.length>0&&s>0;){let e=o.splice(0,o.length);d(`layer`,`第 ${l+1} 分钟开始：本层要处理的是队列里这 ${e.length} 个格子 \`${e.map(u).join(`、`)}\` —— 它们是上一分钟刚腐烂的那批。**先整层弹出、再统一扩散**，这样同一分钟内的格子不会互相「插队」影响。`,{layer:e.map(e=>[...e]),queue:e.map(e=>[...e])});let t=[];for(let[a,c]of e)for(let[e,l]of mD){let u=a+e,d=c+l;u<0||u>=n||d<0||d>=r||i[u][d]===1&&(i[u][d]=2,--s,t.push([u,d]),o.push([u,d]))}l+=1,d(`rot`,`扩散完毕：本层 ${e.length} 个格子把四周的${t.length>0?` \`${t.map(u).join(`、`)}\` `:`新鲜橘子都`}变成腐烂`+(t.length>0?`（**入队即标记**，同一格不会被两个邻居重复腐烂）；`:`（没有新腐烂的格子）—— 队列只剩这一批，下一分钟就没得扩散了；`)+`minute = ${l}，fresh = ${s}。`,{layer:e.map(e=>[...e]),processed:e.map(e=>[...e]),newlyRotted:t.map(e=>[...e])})}return s===0?d(`done`,`所有新鲜橘子都被腐烂光了：**返回 ${l}**。要点：分钟数在「整层扩散完」之后才 +1（不是每弹一个格子都加），而且最后一轮扩散若把 fresh 清零就直接结束 —— 答案就是当前 minute。`,{answer:l}):d(`done`,`队列枯竭但还有 ${s} 个新鲜橘子：它们被空格（\`0\`）隔开，永远烂不到 —— **返回 -1**。要点：-1 的判据是「BFS 结束后 fresh 仍大于 0」，不是「队列空了」本身。`,{answer:-1}),c}var _D=`rotorange-styles`,vD=28,yD=34,bD=76,xD=46,SD=214,CD=412,wD=76,TD=76,ED=162,DD=50,OD=222,kD=90,AD=248,jD=326,MD=40,ND=392,PD=1150,FD=`
.rov { display: flex; flex-direction: column; gap: 14px; }
.rov__svg { width: 100%; height: auto; display: block; }

.rov-note {
  fill: var(--rov-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-note--r { text-anchor: end; }

.rov-lbl {
  fill: var(--rov-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.rov-cell__box { stroke: var(--rov-line, #c3c9c2); stroke-width: 1.5; }
.rov-cell--empty .rov-cell__box { fill: var(--rov-empty, #eef2ee); stroke: var(--rov-line, #d8ded6); }
.rov-cell--fresh .rov-cell__box { fill: var(--rov-fresh, #77a58c); }
.rov-cell--rot .rov-cell__box { fill: var(--rov-rot, #c2872f); }
.rov-cell.is-layer .rov-cell__box { stroke: var(--rov-gold, #8a5a1c); stroke-width: 3.5; }
.rov-cell.is-new .rov-cell__box {
  fill: var(--rov-new-fill, #f6ecd8); stroke: var(--rov-ok, #3f6b57); stroke-width: 3.5;
}
.rov-cell.is-processed .rov-cell__box { stroke: var(--rov-dim, #9aa39c); stroke-width: 2.5; }
.rov-cell__val {
  fill: var(--rov-ink, #1f2a24); font-size: 15px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-cell--empty .rov-cell__val { fill: var(--rov-dim, #b3bbb3); font-weight: 500; }
.rov-cell--rot .rov-cell__val { fill: var(--rov-rot-ink, #3d2a0e); }
.rov-src { fill: var(--rov-src, #a45f45); }

.rov-box {
  fill: var(--rov-fill, #ffffff); stroke: var(--rov-line, #c3c9c2); stroke-width: 1.5;
}
.rov-min__label {
  fill: var(--rov-muted, #657168); font-size: 11.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-min__num {
  fill: var(--rov-ink, #1f2a24); font-size: 30px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-min__num.is-running { fill: var(--rov-gold, #c2872f); }
.rov-min__num.is-neg { fill: var(--rov-hot, #a45f45); }

.rov-fresh__t {
  fill: var(--rov-ink, #1f2a24); font-size: 13px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-fresh__t.is-zero { fill: var(--rov-ok, #3f6b57); font-weight: 700; }
.rov-fresh__num { font-weight: 800; }

.rov-chip__box { fill: var(--rov-fill, #ffffff); stroke: var(--rov-line, #c3c9c2); stroke-width: 1.5; }
.rov-chip__val {
  fill: var(--rov-ink, #1f2a24); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-chip.is-front .rov-chip__box { fill: var(--rov-gold-fill, #fdf3e3); stroke: var(--rov-gold, #c2872f); stroke-width: 2.5; }
.rov-chip.is-front .rov-chip__val { fill: var(--rov-gold, #c2872f); font-weight: 700; }
.rov-queue__empty {
  fill: var(--rov-dim, #9aa39c); font-size: 12px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.rov-swatch { stroke: var(--rov-line, #c3c9c2); stroke-width: 1.5; }
.rov-legend { fill: var(--rov-muted, #657168); font-size: 11px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.rov-banner__box {
  fill: var(--rov-banner, #f4f3ef); stroke: var(--rov-line, #c3c9c2); stroke-width: 1.5;
}
.rov-banner__text {
  fill: var(--rov-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-banner__text.is-ok { fill: var(--rov-ok, #3f6b57); }

.rov-phase__text {
  fill: var(--rov-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function ID(){if(document.getElementById(_D))return;let e=document.createElement(`style`);e.id=_D,e.textContent=FD,document.head.appendChild(e)}function LD(e,t={}){if(!e||e.dataset.rotOrangeMounted===`1`)return{destroy(){}};e.dataset.rotOrangeMounted=`1`,ID();let n=gD(t),r=t.autoplay!==!1,{grid:i,m:a,n:o,sources:s}=n[0],c=Y,l=document.createElement(`div`);l.className=`viz rov`;let u=document.createElement(`div`);u.className=`viz__stage`,l.appendChild(u);let d=c(`svg`,{class:`viz__svg rov__svg`,viewBox:`0 0 660 414`,role:`img`,"aria-label":`腐烂的橘子 LC994 多源 BFS 推演动画`});u.appendChild(d);let f=c(`g`,{}),p=c(`g`,{});d.append(f,p);let m=c(`text`,{class:`rov-note`,x:26,y:vD});m.textContent=`所有腐烂橘子同时入队，每分钟向外扩一圈（多源 BFS）`,p.appendChild(m);let h=c(`text`,{class:`rov-note rov-note--r`,x:634,y:vD});h.textContent=`${a} × ${o} 网格`,p.appendChild(h);let g=new Set(s.map(e=>`${e[0]},${e[1]}`)),_=[];for(let e=0;e<a;e+=1){let t=[];for(let n=0;n<o;n+=1){let r=yD+n*54,i=bD+e*54,a=c(`g`,{class:`rov-cell`});a.appendChild(c(`rect`,{class:`rov-cell__box`,x:r,y:i,width:xD,height:xD,rx:7}));let o=c(`text`,{class:`rov-cell__val`,x:r+xD/2,y:i+xD/2});a.appendChild(o),g.has(`${e},${n}`)&&a.appendChild(c(`circle`,{class:`rov-src`,cx:r+10,cy:i+10,r:4})),f.appendChild(a),t.push({g:a,val:o})}_.push(t)}p.appendChild(c(`rect`,{class:`rov-box`,x:SD,y:wD,width:CD,height:TD,rx:9}));let v=c(`text`,{class:`rov-min__label`,x:420,y:94});v.textContent=`分钟 minute`;let y=c(`text`,{class:`rov-min__num`,x:420,y:126});p.append(v,y),p.appendChild(c(`rect`,{class:`rov-box`,x:SD,y:ED,width:CD,height:DD,rx:9}));let b=c(`text`,{class:`rov-fresh__t`,x:230,y:187});p.appendChild(b),p.appendChild(c(`rect`,{class:`rov-box`,x:SD,y:OD,width:CD,height:kD,rx:9}));let x=c(`text`,{class:`rov-lbl`,x:226,y:238});p.appendChild(x);let S=c(`text`,{class:`rov-queue__empty`,x:420,y:275});S.textContent=`（队列空）`,p.appendChild(S);let C=[];for(let e=0;e<10;e+=1){let t=226+e%5*72,n=252+Math.floor(e/5)*32,r=c(`g`,{class:`rov-chip`});r.appendChild(c(`rect`,{class:`rov-chip__box`,x:t,y:n,width:64,height:24,rx:5}));let i=c(`text`,{class:`rov-chip__val`,x:t+64/2,y:n+24/2});r.appendChild(i),p.appendChild(r),C.push({g:r,val:i})}let w=[{fill:`#77a58c`,text:`新鲜`},{fill:`#c2872f`,text:`腐烂`},{fill:`#eef2ee`,text:`空`}],T=yD;for(let e of w){p.appendChild(c(`rect`,{class:`rov-swatch`,x:T,y:AD,width:18,height:18,rx:4,fill:e.fill}));let t=c(`text`,{class:`rov-legend`,x:T+24,y:257});t.textContent=e.text,p.appendChild(t),T+=24+e.text.length*13+20}p.appendChild(c(`circle`,{class:`rov-src`,cx:42,cy:274,r:4}));let E=c(`text`,{class:`rov-legend`,x:58,y:283});E.textContent=`圆点 = 初始腐烂（源）`,p.appendChild(E),p.appendChild(c(`rect`,{class:`rov-banner__box`,x:26,y:jD,width:608,height:MD,rx:9}));let D=c(`text`,{class:`rov-banner__text`,x:660/2,y:346});p.appendChild(D);let O=c(`text`,{class:`rov-phase__text`,x:660/2,y:ND});p.appendChild(O);let k=document.createElement(`p`);k.className=`viz__desc`,k.setAttribute(`aria-live`,`polite`);function A(e,t){if(!t)return;let n=new Set(t.layer.map(e=>`${e[0]},${e[1]}`)),r=new Set(t.newlyRotted.map(e=>`${e[0]},${e[1]}`)),i=new Set(t.processed.map(e=>`${e[0]},${e[1]}`));_.forEach((e,a)=>{e.forEach((e,o)=>{let s=`${a},${o}`,c=t.grid[a][o],l=[`rov-cell`,c===0?`rov-cell--empty`:c===1?`rov-cell--fresh`:`rov-cell--rot`];t.phase===`layer`&&n.has(s)&&l.push(`is-layer`),t.phase===`rot`&&i.has(s)&&l.push(`is-processed`),t.phase===`rot`&&r.has(s)&&l.push(`is-new`),e.g.setAttribute(`class`,l.join(` `)),e.val.textContent=String(c)})});let a=t.minute,o=!1;t.phase===`layer`?(a=t.minute+1,o=!0):t.phase===`done`&&t.answer===-1?a=`−1`:t.phase===`done`&&(a=t.answer),y.textContent=String(a),y.setAttribute(`class`,`rov-min__num`+(t.phase===`done`&&t.answer===-1?` is-neg`:o?` is-running`:``)),b.textContent=`剩余新鲜 fresh = ${t.fresh}`,b.setAttribute(`class`,`rov-fresh__t`+(t.fresh===0?` is-zero`:``));let s=t.queue;x.textContent=`队列（待扩散）· 长度 ${s.length}`,S.style.display=s.length===0?``:`none`;let c=Math.min(s.length,C.length);C.forEach((e,n)=>{if(n>=c){e.g.style.display=`none`;return}e.g.style.display=``;let r=s[n];e.val.textContent=`(${r[0]},${r[1]})`;let i=t.phase===`layer`&&n===0;e.g.setAttribute(`class`,`rov-chip`+(i?` is-front`:``))}),t.phase===`init`?(D.textContent=`多源 BFS：所有腐烂橘子一起入队，第 0 分钟`,D.setAttribute(`class`,`rov-banner__text`)):t.phase===`layer`?(D.textContent=`第 ${t.minute+1} 分钟：本层 ${t.layer.length} 个格子同时扩散`,D.setAttribute(`class`,`rov-banner__text`)):t.phase===`rot`?(D.textContent=t.newlyRotted.length>0?`第 ${t.minute} 分钟：新腐烂 ${t.newlyRotted.length} 个 · fresh = ${t.fresh}`:`第 ${t.minute} 分钟：无新腐烂 —— 队列即将断流`,D.setAttribute(`class`,`rov-banner__text`+(t.fresh===0?` is-ok`:``))):t.answer===-1?(D.textContent=`返回 −1：还有 ${t.fresh} 个新鲜橘子够不到`,D.setAttribute(`class`,`rov-banner__text`)):(D.textContent=`答案 = ${t.answer} 分钟`,D.setAttribute(`class`,`rov-banner__text is-ok`)),t.phase===`init`?O.textContent=`初始就把「所有」腐烂橘子入队 —— 它们是第 0 分钟同时出发的多个源`:t.phase===`layer`?O.textContent=`整层弹出、统一扩散：同一分钟内的格子互不插队`:t.phase===`rot`?O.textContent=`入队即标记（变 2 并立刻入队），每个格子最多腐烂一次`:t.answer===-1?O.textContent=`−1 的判据：BFS 结束后 fresh 仍大于 0，而不是「队列空了」本身`:O.textContent=`分钟数在整层扩散完后才 +1；fresh 清零就直接结束`,Z(k,t.desc)}l.appendChild(k);let j=Q();l.appendChild(j.root),e.textContent=``,e.appendChild(l),X();let M=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,N=$({steps:n,controls:j,intervalMs:PD,onRender:A});N.jumpTo(Math.trunc(t.initialStep)||0);let P=null;return r&&!M&&typeof IntersectionObserver==`function`&&(P=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){P.disconnect(),P=null,N.play();return}},{threshold:.35}),P.observe(l)),{destroy(){P&&=(P.disconnect(),null),N.destroy(),e.textContent=``,delete e.dataset.rotOrangeMounted,document.getElementById(_D)?.remove()}}}var RD=[[2,1,1],[1,1,0],[0,1,1]],zD=[[-1,0],[0,1],[1,0],[0,-1]];function BD(e={}){let t=(Array.isArray(e.grid)?e.grid:[]).filter(e=>Array.isArray(e)&&e.length>0).map(e=>e.map(e=>e===2||e===`2`?2:+(e===1||e===`1`)));return{grid:t.length>0&&t[0].length>0?t:RD.map(e=>[...e])}}function VD(e={}){let{grid:t}=BD(e),n=t.length,r=t[0].length,i=t.map(e=>[...e]),a=Array.from({length:n},()=>Array(r).fill(null)),o=[],s=[],c=0;for(let e=0;e<n;e+=1)for(let t=0;t<r;t+=1)i[e][t]===2?(o.push([e,t]),a[e][t]=0,s.push([e,t])):i[e][t]===1&&(c+=1);let l=[],u=0,d=0,f=e=>`(${e[0]}, ${e[1]})`,p=(e,t,s={})=>{l.push({phase:e,desc:t,grid:i.map(e=>[...e]),m:n,n:r,stamp:a.map(e=>[...e]),fresh:c,minute:u,stamped:[],sources:o.map(e=>[...e]),maxStamp:d,answer:null,done:e===`done`,...s})};for(p(`init`,o.length>0?`换一种记账：不数「第几分钟」，而是直接给每个格子盖**腐烂时刻**的章 —— 源格子 \`${o.map(f).join(`、`)}\` 的时刻是 **0**，其余格子等着被 BFS 第一次访问时盖章。这个章的值就是**到最近源的距离**：全场最大时间戳就是答案（fresh 清零时）。`:`网格里没有腐烂橘子：没有源也就没有任何格子能被盖章。`+(c===0?`（也没有新鲜橘子，答案是 0。）`:`还有 ${c} 个新鲜橘子永远烂不掉。`));s.length>0&&c>0;){u+=1;let e=[],t=[];for(let[o,l]of s)for(let[s,d]of zD){let f=o+s,p=l+d;f<0||f>=n||p<0||p>=r||i[f][p]===1&&(i[f][p]=2,a[f][p]=u,--c,t.push([f,p]),e.push([f,p]))}if(t.length===0)break;d=u,s=e,p(`stamp`,`第 ${u} 分钟：给 \`${t.map(f).join(`、`)}\` 盖上 **${u}** —— 它们离最近的源正好 ${u} 步。**第一次访问即定章、之后不再改**，这正是 BFS「先到的一定最近」的性质。`,{stamped:t.map(e=>[...e])})}let m=c===0?d:-1;return m===-1?p(`done`,`BFS 结束，还有 ${c} 个新鲜橘子始终没被盖章（被空格隔开）：**返回 -1**。若换成先算「所有源的距离场」，这道题还藏着一条判据：**答案 = fresh 清零时的最大时间戳**；若最大时间戳还算不出来就有剩余，直接 -1。`,{answer:m}):p(`done`,`全场盖章完毕：**答案 = 最大时间戳 = ${m}**。注意最后一分钟不需要「再空转一轮」—— fresh 清零时的时间戳就是答案；源本身的 0 不参与取 max（答案是「最后一块被感染的格子」的时刻）。`,{answer:m}),l}var HD=`rotorangedist-styles`,UD=28,WD=34,GD=76,KD=46,qD=214,JD=412,YD=76,XD=76,ZD=162,QD=50,$D=222,eO=90,tO=248,nO=326,rO=40,iO=392,aO=1150,oO=`
.rod { display: flex; flex-direction: column; gap: 14px; }
.rod__svg { width: 100%; height: auto; display: block; }

.rod-note {
  fill: var(--rod-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-note--r { text-anchor: end; }

.rod-lbl {
  fill: var(--rod-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.rod-cell__box { stroke: var(--rod-line, #c3c9c2); stroke-width: 1.5; }
.rod-cell--blank .rod-cell__box { fill: var(--rod-blank, #eef2ee); stroke: var(--rod-line, #d8ded6); }
.rod-cell--wait .rod-cell__box { fill: var(--rod-wait, #77a58c); }
.rod-cell--stamped .rod-cell__box { fill: var(--rod-stamped, #c2872f); }
.rod-cell.is-new .rod-cell__box {
  fill: var(--rod-new-fill, #f6ecd8); stroke: var(--rod-ok, #3f6b57); stroke-width: 3.5;
}
.rod-cell__val {
  fill: var(--rod-ink, #1f2a24); font-size: 15px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-cell--blank .rod-cell__val { fill: var(--rod-dim, #b3bbb3); font-weight: 500; }
.rod-cell--wait .rod-cell__val { fill: var(--rod-wait-ink, #24402f); }
.rod-cell--stamped .rod-cell__val { fill: var(--rod-stamped-ink, #3d2a0e); }
.rod-cell.is-new .rod-cell__val { fill: var(--rod-gold, #8a5a1c); }
.rod-src { fill: var(--rod-src, #a45f45); }

.rod-box {
  fill: var(--rod-fill, #ffffff); stroke: var(--rod-line, #c3c9c2); stroke-width: 1.5;
}
.rod-min__label {
  fill: var(--rod-muted, #657168); font-size: 11.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-min__num {
  fill: var(--rod-ink, #1f2a24); font-size: 30px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-min__num.is-running { fill: var(--rod-gold, #c2872f); }
.rod-min__num.is-neg { fill: var(--rod-hot, #a45f45); }

.rod-max__t {
  fill: var(--rod-ink, #1f2a24); font-size: 13px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-max__t.is-ok { fill: var(--rod-ok, #3f6b57); font-weight: 700; }
.rod-max__num { font-weight: 800; }

.rod-chip__box { fill: var(--rod-fill, #ffffff); stroke: var(--rod-line, #c3c9c2); stroke-width: 1.5; }
.rod-chip__val {
  fill: var(--rod-ink, #1f2a24); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-chip.is-new .rod-chip__box { fill: var(--rod-new-fill, #f6ecd8); stroke: var(--rod-ok, #3f6b57); stroke-width: 2.5; }
.rod-chip.is-new .rod-chip__val { fill: var(--rod-ok, #3f6b57); font-weight: 700; }
.rod-stamp__empty {
  fill: var(--rod-dim, #9aa39c); font-size: 12px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.rod-swatch { stroke: var(--rod-line, #c3c9c2); stroke-width: 1.5; }
.rod-legend { fill: var(--rod-muted, #657168); font-size: 11px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.rod-banner__box {
  fill: var(--rod-banner, #f4f3ef); stroke: var(--rod-line, #c3c9c2); stroke-width: 1.5;
}
.rod-banner__text {
  fill: var(--rod-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-banner__text.is-ok { fill: var(--rod-ok, #3f6b57); }

.rod-phase__text {
  fill: var(--rod-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function sO(){if(document.getElementById(HD))return;let e=document.createElement(`style`);e.id=HD,e.textContent=oO,document.head.appendChild(e)}function cO(e,t={}){if(!e||e.dataset.rotOrangeDistMounted===`1`)return{destroy(){}};e.dataset.rotOrangeDistMounted=`1`,sO();let n=VD(t),r=t.autoplay!==!1,{grid:i,m:a,n:o,sources:s}=n[0],c=Y,l=document.createElement(`div`);l.className=`viz rod`;let u=document.createElement(`div`);u.className=`viz__stage`,l.appendChild(u);let d=c(`svg`,{class:`viz__svg rod__svg`,viewBox:`0 0 660 414`,role:`img`,"aria-label":`腐烂的橘子 LC994 时间戳距离场推演动画`});u.appendChild(d);let f=c(`g`,{}),p=c(`g`,{});d.append(f,p);let m=c(`text`,{class:`rod-note`,x:26,y:UD});m.textContent=`每个格子盖「腐烂时刻」的章：数值 = 到最近源的距离`,p.appendChild(m);let h=c(`text`,{class:`rod-note rod-note--r`,x:634,y:UD});h.textContent=`${a} × ${o} 网格`,p.appendChild(h);let g=new Set(s.map(e=>`${e[0]},${e[1]}`)),_=[];for(let e=0;e<a;e+=1){let t=[];for(let n=0;n<o;n+=1){let r=WD+n*54,i=GD+e*54,a=c(`g`,{class:`rod-cell`});a.appendChild(c(`rect`,{class:`rod-cell__box`,x:r,y:i,width:KD,height:KD,rx:7}));let o=c(`text`,{class:`rod-cell__val`,x:r+KD/2,y:i+KD/2});a.appendChild(o),g.has(`${e},${n}`)&&a.appendChild(c(`circle`,{class:`rod-src`,cx:r+10,cy:i+10,r:4})),f.appendChild(a),t.push({g:a,val:o})}_.push(t)}p.appendChild(c(`rect`,{class:`rod-box`,x:qD,y:YD,width:JD,height:XD,rx:9}));let v=c(`text`,{class:`rod-min__label`,x:420,y:94});v.textContent=`盖章分钟 minute`;let y=c(`text`,{class:`rod-min__num`,x:420,y:126});p.append(v,y),p.appendChild(c(`rect`,{class:`rod-box`,x:qD,y:ZD,width:JD,height:QD,rx:9}));let b=c(`text`,{class:`rod-max__t`,x:230,y:187});p.appendChild(b),p.appendChild(c(`rect`,{class:`rod-box`,x:qD,y:$D,width:JD,height:eO,rx:9}));let x=c(`text`,{class:`rod-lbl`,x:226,y:238});p.appendChild(x);let S=c(`text`,{class:`rod-stamp__empty`,x:420,y:275});S.textContent=`（本轮没有新盖章）`,p.appendChild(S);let C=[];for(let e=0;e<10;e+=1){let t=226+e%5*72,n=252+Math.floor(e/5)*32,r=c(`g`,{class:`rod-chip`});r.appendChild(c(`rect`,{class:`rod-chip__box`,x:t,y:n,width:64,height:24,rx:5}));let i=c(`text`,{class:`rod-chip__val`,x:t+64/2,y:n+24/2});r.appendChild(i),p.appendChild(r),C.push({g:r,val:i})}let w=[{fill:`#c2872f`,text:`已盖章`},{fill:`#77a58c`,text:`待盖`},{fill:`#eef2ee`,text:`空`}],T=WD;for(let e of w){p.appendChild(c(`rect`,{class:`rod-swatch`,x:T,y:tO,width:18,height:18,rx:4,fill:e.fill}));let t=c(`text`,{class:`rod-legend`,x:T+24,y:257});t.textContent=e.text,p.appendChild(t),T+=24+e.text.length*13+12}p.appendChild(c(`circle`,{class:`rod-src`,cx:42,cy:274,r:4}));let E=c(`text`,{class:`rod-legend`,x:58,y:283});E.textContent=`圆点 = 源（章 = 0）`,p.appendChild(E),p.appendChild(c(`rect`,{class:`rod-banner__box`,x:26,y:nO,width:608,height:rO,rx:9}));let D=c(`text`,{class:`rod-banner__text`,x:660/2,y:346});p.appendChild(D);let O=c(`text`,{class:`rod-phase__text`,x:660/2,y:iO});p.appendChild(O);let k=document.createElement(`p`);k.className=`viz__desc`,k.setAttribute(`aria-live`,`polite`);function A(e,t){if(!t)return;let n=new Set(t.stamped.map(e=>`${e[0]},${e[1]}`));_.forEach((e,r)=>{e.forEach((e,i)=>{let a=`${r},${i}`,o=t.grid[r][i],s=t.stamp[r][i],c=[`rod-cell`];o===0?(c.push(`rod-cell--blank`),e.val.textContent=``):s===null?(c.push(`rod-cell--wait`),e.val.textContent=`—`):(c.push(`rod-cell--stamped`),e.val.textContent=String(s)),t.phase===`stamp`&&n.has(a)&&c.push(`is-new`),e.g.setAttribute(`class`,c.join(` `))})});let r=t.minute,i=!1;t.phase===`stamp`?i=!0:t.phase===`done`&&t.answer===-1?r=`−1`:t.phase===`done`&&(r=t.answer),y.textContent=String(r),y.setAttribute(`class`,`rod-min__num`+(t.phase===`done`&&t.answer===-1?` is-neg`:i?` is-running`:``)),b.textContent=`最大时间戳 max(stamp) = ${t.maxStamp} · 剩余新鲜 fresh = ${t.fresh}`,b.setAttribute(`class`,`rod-max__t`+(t.fresh===0?` is-ok`:``));let a=t.stamped;x.textContent=`本轮盖章（第 ${t.minute} 分钟）· ${a.length} 个`,S.style.display=t.phase===`stamp`?`none`:``;let o=Math.min(a.length,C.length);C.forEach((e,n)=>{if(n>=o){e.g.style.display=`none`;return}e.g.style.display=``;let r=a[n];e.val.textContent=`(${r[0]},${r[1]}) → ${t.minute}`,e.g.setAttribute(`class`,`rod-chip is-new`)}),t.phase===`init`?(D.textContent=`源盖章 0；其余格子由 BFS 第一次访问时盖章`,D.setAttribute(`class`,`rod-banner__text`)):t.phase===`stamp`?(D.textContent=`第 ${t.minute} 分钟：给 ${t.stamped.length} 个格子盖上 ${t.minute}`,D.setAttribute(`class`,`rod-banner__text`+(t.fresh===0?` is-ok`:``))):t.answer===-1?(D.textContent=`返回 −1：有新鲜橘子始终没盖上章（够不到）`,D.setAttribute(`class`,`rod-banner__text`)):(D.textContent=`答案 = 最大时间戳 = ${t.answer}`,D.setAttribute(`class`,`rod-banner__text is-ok`)),t.phase===`init`?O.textContent=`时间戳 = 到最近源的距离 —— 这就是多源 BFS 的不变量`:t.phase===`stamp`?O.textContent=`第一次访问即定章、之后不再改（BFS 先到的一定最近）`:t.answer===-1?O.textContent=`还有格子盖不上章 → fresh 不为 0 → 返回 −1`:O.textContent=`答案 = fresh 清零时的最大时间戳；源自己的 0 不参与取 max`,Z(k,t.desc)}l.appendChild(k);let j=Q();l.appendChild(j.root),e.textContent=``,e.appendChild(l),X();let M=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,N=$({steps:n,controls:j,intervalMs:aO,onRender:A});N.jumpTo(Math.trunc(t.initialStep)||0);let P=null;return r&&!M&&typeof IntersectionObserver==`function`&&(P=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){P.disconnect(),P=null,N.play();return}},{threshold:.35}),P.observe(l)),{destroy(){P&&=(P.disconnect(),null),N.destroy(),e.textContent=``,delete e.dataset.rotOrangeDistMounted,document.getElementById(HD)?.remove()}}}var lO=4,uO=[[1,0],[2,0],[3,1],[3,2]];function dO(e={}){let t=Number.isInteger(e.numCourses)?e.numCourses:lO,n=t>=0?t:lO;return{numCourses:n,prerequisites:(Array.isArray(e.prerequisites)?e.prerequisites:uO).filter(e=>Array.isArray(e)&&e.length===2&&Number.isInteger(e[0])&&Number.isInteger(e[1])&&e[0]>=0&&e[0]<n&&e[1]>=0&&e[1]<n).map(e=>[e[0],e[1]])}}function fO(e={}){let{numCourses:t,prerequisites:n}=dO(e),r=n.map(([e,t])=>[t,e]),i=Array.from({length:t},()=>[]),a=Array(t).fill(0);for(let[e,t]of r)i[e].push(t),a[t]+=1;for(let e of i)e.sort((e,t)=>e-t);let o=[],s=[],c=[],l=new Set,u=(e,n,i={})=>{o.push({phase:e,desc:n,numCourses:t,edges:r.map(e=>[...e]),indegree:[...a],queue:[...s],order:[...c],cur:null,relaxed:[],enqueued:[],stuck:[],answer:null,done:e===`done`,...i})};for(let e=0;e<t;e+=1)a[e]===0&&(s.push(e),l.add(e));for(u(`init`,`把 prerequisites 的 \`[a, b]\` 读成有向边 **b → a**（修 a 之前必须先修 b），先算出入度表：入度 = 它有多少门**没修的先修课**。入度为 0 的课没有任何前置，可以立刻开修 —— 第 0 层起点是 \`{${s.join(`, `)}}\`，全部入队。**入度为 0 的课永远可以第一个修**，这是 Kahn 的全部起点。`);s.length>0;){let e=s.shift();c.push(e);let t=[],n=[];for(let r of i[e])--a[r],t.push([r,a[r]]),a[r]===0&&!l.has(r)&&(s.push(r),l.add(r),n.push(r));u(`pop`,`修完第 \`${c.length}\` 门课 \`${e}\`：它的后继 `+(t.length>0?`${t.map(([e,t])=>`\`${e}\`(入度→${t})`).join(`、`)}`+(n.length>0?`，其中 \`${n.join(`、`)}\` 入度减到 0，可以开修了 →`:`，都还有前置没修 →`)+`入队 \`{${s.join(`, `)||`空`}}\`。`:`（没有后继），队列 \`{${s.join(`, `)||`空`}}\`。`)+`\`order = [${c.join(`, `)}]\`。`,{cur:e,relaxed:t,enqueued:n})}let d=c.length===t,f=[];for(let e=0;e<t;e+=1)c.includes(e)||f.push(e);return d?u(`done`,`队列空、且**出队数量 ${c.length} == numCourses ${t}**：没有课被卡住，说明图里没有环，**返回 true**；而 \`[${c.join(`, `)}]\` 本身就是一个合法修课顺序 —— 210 的答案（任意一个拓扑序都合法）。`,{answer:{possible:!0,order:[...c]},stuck:f}):u(`done`,`队列提前枯竭：只修完了 ${c.length} / ${t} 门课，剩下的 \`{${f.join(`, `)}}\` 有前置没修完 —— 它们**互相等待**（在环里）或被环卡住，**返回 false**。判据：**出队数量 == numCourses**，不是「队列空了」。`,{answer:{possible:!1,order:[...c]},stuck:f}),o}function pO(e,t,n={}){let r=n.cx??330,i=n.cy??158,a=n.colGap??208,o=n.rowGap??84,s=Array.from({length:e},()=>[]),c=Array(e).fill(0);for(let[e,n]of t)s[e].push(n),c[n]+=1;let l=[...c],u=[];for(let t=0;t<e;t+=1)l[t]===0&&u.push(t);let d=[];for(;u.length>0;){let e=u.shift();d.push(e);for(let t of s[e])--l[t],l[t]===0&&u.push(t)}let f=Array(e).fill(null);for(let e of d)f[e]=0;for(let e of d)for(let t of s[e])f[t]!==null&&(f[t]=Math.max(f[t],f[e]+1));let p=0;for(let e of d)p=Math.max(p,f[e]);let m=!1;for(let t=0;t<e;t+=1)f[t]===null&&(f[t]=p+1,m=!0);m&&(p+=1);let h=new Map;for(let t=0;t<e;t+=1)h.has(f[t])||h.set(f[t],[]),h.get(f[t]).push(t);let g=Array(e);for(let[e,t]of h)t.sort((e,t)=>e-t),t.forEach((n,s)=>{let c=r+(e-p/2)*a,l=i+(s-(t.length-1)/2)*o;g[n]={x:c,y:l}});return{positions:g,acyclic:d}}function mO(e,t,n,r=9){let i=t.x-e.x,a=t.y-e.y,o=Math.hypot(i,a)||1,s=i/o,c=a/o,l=e.x+s*n,u=e.y+c*n,d=t.x-s*(n+2),f=t.y-c*(n+2),p=-c,m=s,h=d-s*r,g=f-c*r;return{x1:l,y1:u,x2:d,y2:f,head:[[d,f],[h+p*r*.55,g+m*r*.55],[h-p*r*.55,g-m*r*.55]].map(([e,t])=>`${e.toFixed(1)},${t.toFixed(1)}`).join(` `)}}var hO=`courseschedule-styles`,gO=28,_O=240,vO=288,yO=326,bO=40,xO=392,SO=1150,CO=`
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
`;function wO(){if(document.getElementById(hO))return;let e=document.createElement(`style`);e.id=hO,e.textContent=CO,document.head.appendChild(e)}function TO(e,t={}){if(!e||e.dataset.courseScheduleMounted===`1`)return{destroy(){}};e.dataset.courseScheduleMounted=`1`,wO();let n=fO(t),r=t.autoplay!==!1,{numCourses:i,edges:a}=n[0],o=Y,s=document.createElement(`div`);s.className=`viz csv`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=o(`svg`,{class:`viz__svg csv__svg`,viewBox:`0 0 660 414`,role:`img`,"aria-label":`课程表 LC207 Kahn 拓扑排序推演动画`});c.appendChild(l);let u=o(`g`,{}),d=o(`g`,{}),f=o(`g`,{});l.append(u,d,f);let p=o(`text`,{class:`csv-note`,x:26,y:gO});p.textContent=`入度表 + 队列：0 入度的课开修，修完就松开它的后继（角标 = 当前入度）`,f.appendChild(p);let m=o(`text`,{class:`csv-note csv-note--r`,x:634,y:gO});m.textContent=`${i} 门课 · ${a.length} 条边`,f.appendChild(m);let{positions:h}=pO(i,a),g=a.map(([e,t])=>{let n=mO(h[e],h[t],24),r=o(`line`,{class:`csv-edge`,x1:n.x1,y1:n.y1,x2:n.x2,y2:n.y2}),i=o(`polygon`,{class:`csv-arrow`,points:n.head});return u.append(r,i),{line:r,head:i,from:e}}),_=[];for(let e=0;e<i;e+=1){let{x:t,y:n}=h[e],r=o(`g`,{class:`csv-node`});r.appendChild(o(`circle`,{class:`csv-node__circle`,cx:t,cy:n,r:24}));let i=o(`text`,{class:`csv-node__num`,x:t,y:n});i.textContent=String(e),r.appendChild(i),d.appendChild(r);let a=o(`g`,{class:`csv-badge`});a.appendChild(o(`circle`,{class:`csv-badge__circle`,cx:t+19,cy:n-19,r:11}));let s=o(`text`,{class:`csv-badge__num`,x:t+19,y:n-19});a.appendChild(s),f.appendChild(a),_.push({g:r,badgeG:a,badgeNum:s})}let v=o(`text`,{class:`csv-lbl`,x:26,y:253});v.textContent=`队列 queue`;let y=o(`text`,{class:`csv-lbl`,x:26,y:301});y.textContent=`顺序 order`,f.append(v,y);let b=o(`text`,{class:`csv-empty`,x:148,y:253});b.textContent=`（空 —— 没有 0 入度的课了）`,f.appendChild(b);let x=[],S=[];for(let e=0;e<16;e+=1){let t=148+e*40,n=o(`g`,{class:`csv-chip`});n.appendChild(o(`rect`,{class:`csv-chip__box`,x:t,y:_O,width:34,height:26,rx:6}));let r=o(`text`,{class:`csv-chip__val`,x:t+34/2,y:253});n.appendChild(r),f.appendChild(n),x.push({g:n,val:r});let i=o(`g`,{class:`csv-chip is-done`});i.appendChild(o(`rect`,{class:`csv-chip__box`,x:t,y:vO,width:34,height:26,rx:6}));let a=o(`text`,{class:`csv-chip__val`,x:t+34/2,y:301});i.appendChild(a),f.appendChild(i),S.push({g:i,val:a})}f.appendChild(o(`rect`,{class:`csv-banner__box`,x:26,y:yO,width:608,height:bO,rx:9}));let C=o(`text`,{class:`csv-banner__text`,x:660/2,y:346});f.appendChild(C);let w=o(`text`,{class:`csv-phase__text`,x:660/2,y:xO});f.appendChild(w);let T=document.createElement(`p`);T.className=`viz__desc`,T.setAttribute(`aria-live`,`polite`);function E(e,t){if(!t)return;let n=new Set(t.queue),r=new Set(t.order),i=new Set(t.stuck),a=new Set(t.relaxed.map(([e])=>e));g.forEach(({line:e,head:n,from:r})=>{let i=t.phase===`pop`&&t.cur===r?` is-relaxing`:``;e.setAttribute(`class`,`csv-edge${i}`),n.setAttribute(`class`,`csv-arrow${i}`)}),_.forEach((e,o)=>{let s=[`csv-node`];r.has(o)?s.push(`csv-node--done`):n.has(o)&&s.push(`csv-node--queued`),t.phase===`pop`&&t.cur===o&&s.push(`csv-node--cur`),t.phase===`done`&&i.has(o)&&s.push(`csv-node--stuck`),e.g.setAttribute(`class`,s.join(` `)),e.badgeNum.textContent=String(t.indegree[o]);let c=[`csv-badge`];t.indegree[o]===0&&c.push(`csv-badge--zero`),a.has(o)&&c.push(`csv-badge--hot`),e.badgeG.setAttribute(`class`,c.join(` `))});let o=t.queue;b.style.display=o.length===0?``:`none`;let s=Math.min(o.length,x.length);x.forEach((e,t)=>{if(t>=s){e.g.style.display=`none`;return}e.g.style.display=``,e.val.textContent=String(o[t]),e.g.setAttribute(`class`,`csv-chip`+(t===0?` is-front`:``))});let c=Math.min(t.order.length,S.length);if(S.forEach((e,n)=>{if(n>=c){e.g.style.display=`none`;return}e.g.style.display=``,e.val.textContent=String(t.order[n]),e.g.setAttribute(`class`,`csv-chip is-done`)}),t.phase===`init`)C.textContent=`全部 0 入度的课入队：{${t.queue.join(`, `)}}`,C.setAttribute(`class`,`csv-banner__text`);else if(t.phase===`pop`){let e=t.relaxed.length?`，后继 ${t.relaxed.map(([e,t])=>`${e}(${t})`).join(`、`)}`:``;C.textContent=`修完第 ${t.order.length} 门：课程 ${t.cur}${e}`+(t.enqueued.length?`　→ 入队 {${t.enqueued.join(`, `)}}`:``),C.setAttribute(`class`,`csv-banner__text`)}else t.answer?.possible?(C.textContent=`答案 = [${t.answer.order.join(`, `)}]（合法拓扑序）`,C.setAttribute(`class`,`csv-banner__text is-ok`)):(C.textContent=`返回 false：课程 {${t.stuck.join(`, `)}} 互相等待，修不完`,C.setAttribute(`class`,`csv-banner__text`));t.phase===`init`?w.textContent=`入度 = 还有几门「没修的先修课」；0 入度 = 现在就能修`:t.phase===`pop`?w.textContent=`取出一门课 → 它的后继入度 −1，减到 0 的立刻入队`:t.answer?.possible?w.textContent=`出队数量 == 课程数 ⇔ 没有环 ⇔ 能修完所有课`:w.textContent=`出队数量 < 课程数：剩下的课在环里（或等环），返回 false`,Z(T,t.desc)}s.appendChild(T);let D=Q();s.appendChild(D.root),e.textContent=``,e.appendChild(s),X();let O=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,k=$({steps:n,controls:D,intervalMs:SO,onRender:E});k.jumpTo(Math.trunc(t.initialStep)||0);let A=null;return r&&!O&&typeof IntersectionObserver==`function`&&(A=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){A.disconnect(),A=null,k.play();return}},{threshold:.35}),A.observe(s)),{destroy(){A&&=(A.disconnect(),null),k.destroy(),e.textContent=``,delete e.dataset.courseScheduleMounted,document.getElementById(hO)?.remove()}}}var EO=4,DO=[[1,0],[2,0],[3,1],[3,2]];function OO(e={}){let t=Number.isInteger(e.numCourses)?e.numCourses:EO,n=t>=0?t:EO;return{numCourses:n,prerequisites:(Array.isArray(e.prerequisites)?e.prerequisites:DO).filter(e=>Array.isArray(e)&&e.length===2&&Number.isInteger(e[0])&&Number.isInteger(e[1])&&e[0]>=0&&e[0]<n&&e[1]>=0&&e[1]<n).map(e=>[e[0],e[1]])}}function kO(e={}){let{numCourses:t,prerequisites:n}=OO(e),r=n.map(([e,t])=>[t,e]),i=Array.from({length:t},()=>[]);for(let[e,t]of r)i[e].push(t);for(let e of i)e.sort((e,t)=>e-t);let a=[],o=Array(t).fill(0),s=[],c=[],l=(e,n,i={})=>{a.push({phase:e,desc:n,numCourses:t,edges:r.map(e=>[...e]),color:[...o],stack:[...s],post:[...c],cur:null,target:null,answer:null,done:e===`done`,...i})};l(`init`,`DFS 三色标记：**白** = 没碰过、**灰** = 正在递归栈里（还没探完它的邻居）、**黑** = 已确认安全。沿边往下走：碰到**白**就入栈变灰继续；碰到**灰**，说明边指回了当前递归栈里的节点 —— **有环**；碰到**黑**直接跳过（它的路已经验过安全）。一门课**变黑时**追加到后序列表，**后序反转就是拓扑序**。`);let u=null;outer:for(let e=0;e<t;e+=1){if(o[e]!==0)continue;o[e]=1,s.push(e),l(`enter`,`出发：课程 \`${e}\` 白 → 灰，压入递归栈 \`[${s.join(`, `)}]\` —— 开始探测它的后继（先修课指向后修课）。`,{cur:e});let t=[{node:e,idx:0}];for(;t.length>0;){let e=t[t.length-1],n=e.node,r=i[n];if(e.idx<r.length){let i=r[e.idx];if(e.idx+=1,o[i]===1){u={from:n,to:i},l(`cycle`,`探到课程 \`${n}\` 的后继 \`${i}\` —— 它是**灰色**、还在递归栈里 \`[${s.join(`, `)}]\`：边 \`${n} → ${i}\` 指回了祖先，**环被抓住**（课程 ${i} → … → ${n} → ${i}）。有环 = 有课永远修不完 → 返回 **false**。`,{cur:n,target:i});break outer}o[i]===0&&(o[i]=1,s.push(i),t.push({node:i,idx:0}),l(`enter`,`课程 \`${n}\` 的后继 \`${i}\` 是白色的：白 → 灰，压栈 \`[${s.join(`, `)}]\`，继续往下探。`,{cur:i}))}else t.pop(),s.pop(),o[n]=2,c.push(n),l(`finish`,`课程 \`${n}\` 的邻居全部处理完：灰 → 黑，弹栈（栈 = \`[${s.join(`, `)||`空`}]\`），追加后序 \`[${c.join(`, `)}]\` —— 它的所有**后继**都已排在它后面。`,{cur:n})}}if(u)l(`done`,`发现过环（\`${u.from} → ${u.to}\` 的灰色回边）：**返回 false**，不存在任何修课顺序。三色法的判环口径：**只要出现过灰色回边，就有环** —— 黑色邻居不算（那是另一条安全的路汇合）。`,{answer:{possible:!1,order:[]},cur:u.from,target:u.to});else{let e=[...c].reverse();l(`done`,`所有课程都变黑，没有灰色回边 → **返回 true**；后序 \`[${c.join(`, `)}]\` 反转得到 \`[${e.join(`, `)}]\` —— 一个合法修课顺序（210 的答案）。注意：它是**后序的反转**，不是后序本身 —— 后序最后才轮到「所有后继都安全的起点」。`,{answer:{possible:!0,order:e}})}return a}var AO=`coursescheduledfs-styles`,jO=28,MO=240,NO=288,PO=326,FO=40,IO=392,LO=1150,RO=`
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
`;function zO(){if(document.getElementById(AO))return;let e=document.createElement(`style`);e.id=AO,e.textContent=RO,document.head.appendChild(e)}function BO(e,t={}){if(!e||e.dataset.courseScheduleDfsMounted===`1`)return{destroy(){}};e.dataset.courseScheduleDfsMounted=`1`,zO();let n=kO(t),r=t.autoplay!==!1,{numCourses:i,edges:a}=n[0],o=Y,s=document.createElement(`div`);s.className=`viz cdf`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=o(`svg`,{class:`viz__svg cdf__svg`,viewBox:`0 0 660 414`,role:`img`,"aria-label":`课程表 LC207 DFS 三色标记推演动画`});c.appendChild(l);let u=o(`g`,{}),d=o(`g`,{}),f=o(`g`,{});l.append(u,d,f);let p=o(`text`,{class:`cdf-note`,x:26,y:jO});p.textContent=`白 = 没访问 · 灰 = 递归栈里 · 黑 = 已确认安全（灰色回边 = 环）`,f.appendChild(p);let m=o(`text`,{class:`cdf-note cdf-note--r`,x:634,y:jO});m.textContent=`${i} 门课 · ${a.length} 条边`,f.appendChild(m);let{positions:h}=pO(i,a),g=a.map(([e,t])=>{let n=mO(h[e],h[t],24),r=o(`line`,{class:`cdf-edge`,x1:n.x1,y1:n.y1,x2:n.x2,y2:n.y2}),i=o(`polygon`,{class:`cdf-arrow`,points:n.head});return u.append(r,i),{line:r,head:i,from:e,to:t}}),_=[];for(let e=0;e<i;e+=1){let{x:t,y:n}=h[e],r=o(`g`,{class:`cdf-node`});r.appendChild(o(`circle`,{class:`cdf-node__circle`,cx:t,cy:n,r:24}));let i=o(`text`,{class:`cdf-node__num`,x:t,y:n});i.textContent=String(e),r.appendChild(i),d.appendChild(r),_.push(r)}let v=o(`text`,{class:`cdf-lbl`,x:26,y:253});v.textContent=`递归栈 stack`;let y=o(`text`,{class:`cdf-lbl`,x:26,y:301});y.textContent=`后序 post`,f.append(v,y);let b=o(`text`,{class:`cdf-empty`,x:148,y:253});b.textContent=`（空）`,f.appendChild(b);let x=[],S=[];for(let e=0;e<16;e+=1){let t=148+e*40,n=o(`g`,{class:`cdf-chip is-gray`});n.appendChild(o(`rect`,{class:`cdf-chip__box`,x:t,y:MO,width:34,height:26,rx:6}));let r=o(`text`,{class:`cdf-chip__val`,x:t+34/2,y:253});n.appendChild(r),f.appendChild(n),x.push({g:n,val:r});let i=o(`g`,{class:`cdf-chip is-post`});i.appendChild(o(`rect`,{class:`cdf-chip__box`,x:t,y:NO,width:34,height:26,rx:6}));let a=o(`text`,{class:`cdf-chip__val`,x:t+34/2,y:301});i.appendChild(a),f.appendChild(i),S.push({g:i,val:a})}f.appendChild(o(`rect`,{class:`cdf-banner__box`,x:26,y:PO,width:608,height:FO,rx:9}));let C=o(`text`,{class:`cdf-banner__text`,x:660/2,y:346});f.appendChild(C);let w=o(`text`,{class:`cdf-phase__text`,x:660/2,y:IO});f.appendChild(w);let T=document.createElement(`p`);T.className=`viz__desc`,T.setAttribute(`aria-live`,`polite`);function E(e,t){if(!t)return;new Set(t.stack),g.forEach(({line:e,head:n,from:r,to:i})=>{let a=t.phase===`cycle`&&t.cur===r&&t.target===i?` is-cycle`:``;e.setAttribute(`class`,`cdf-edge${a}`),n.setAttribute(`class`,`cdf-arrow${a}`)}),_.forEach((e,n)=>{let r=[`cdf-node`];t.color[n]===1?r.push(`cdf-node--gray`):t.color[n]===2&&r.push(`cdf-node--black`),(t.phase===`enter`||t.phase===`finish`)&&t.cur===n&&r.push(`cdf-node--cur`),t.phase===`cycle`&&(t.cur===n||t.target===n)&&r.push(`cdf-node--cycle`),t.phase===`done`&&t.target===n&&r.push(`cdf-node--cycle`),e.setAttribute(`class`,r.join(` `))});let n=t.stack;b.style.display=n.length===0?``:`none`;let r=Math.min(n.length,x.length);x.forEach((e,t)=>{if(t>=r){e.g.style.display=`none`;return}e.g.style.display=``,e.val.textContent=String(n[t]),e.g.setAttribute(`class`,`cdf-chip is-gray`+(t===r-1?` is-rev`:``))});let i=t.post,a=Math.min(i.length,S.length);S.forEach((e,t)=>{if(t>=a){e.g.style.display=`none`;return}e.g.style.display=``,e.val.textContent=String(i[t]),e.g.setAttribute(`class`,`cdf-chip is-post`)}),t.phase===`init`?(C.textContent=`全白出发：碰到白 → 变灰压栈；碰到灰 → 环`,C.setAttribute(`class`,`cdf-banner__text`)):t.phase===`enter`?(C.textContent=`课程 ${t.cur} 白 → 灰，压栈（深度 ${t.stack.length}）`,C.setAttribute(`class`,`cdf-banner__text`)):t.phase===`finish`?(C.textContent=`课程 ${t.cur} 灰 → 黑，追加后序 → post = [${t.post.join(`, `)}]`,C.setAttribute(`class`,`cdf-banner__text`)):t.phase===`cycle`?(C.textContent=`发现灰色回边：${t.cur} → ${t.target}（${t.target} 还在递归栈里）= 有环`,C.setAttribute(`class`,`cdf-banner__text`)):t.answer?.possible?(C.textContent=`后序反转 = [${t.answer.order.join(`, `)}]（合法拓扑序）`,C.setAttribute(`class`,`cdf-banner__text is-ok`)):(C.textContent=`返回 false：出现过灰色回边，存在环`,C.setAttribute(`class`,`cdf-banner__text`)),t.phase===`init`?w.textContent=`灰 = 还没有探完邻居的节点；灰边 = 指回递归栈 = 环`:t.phase===`enter`?w.textContent=`白 → 灰：开始探索这门课的后继`:t.phase===`finish`?w.textContent=`灰 → 黑：后继全部安全，追加后序（反转即拓扑序）`:t.phase===`cycle`?w.textContent=`灰色回边 = 环 —— 与 Kahn 的「出队数量 < 课程数」是同一件事`:t.answer?.possible?w.textContent=`黑色邻居只跳过（另一条安全的路），只有灰色回边才算环`:w.textContent=`有环 ⇒ 不存在拓扑序 ⇒ 返回 false`,Z(T,t.desc)}s.appendChild(T);let D=Q();s.appendChild(D.root),e.textContent=``,e.appendChild(s),X();let O=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,k=$({steps:n,controls:D,intervalMs:LO,onRender:E});k.jumpTo(Math.trunc(t.initialStep)||0);let A=null;return r&&!O&&typeof IntersectionObserver==`function`&&(A=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){A.disconnect(),A=null,k.play();return}},{threshold:.35}),A.observe(s)),{destroy(){A&&=(A.disconnect(),null),k.destroy(),e.textContent=``,delete e.dataset.courseScheduleDfsMounted,document.getElementById(AO)?.remove()}}}var VO=2,HO=[[`put`,1,1],[`put`,2,2],[`get`,1],[`put`,3,3],[`get`,2],[`put`,4,4],[`get`,1],[`get`,3],[`get`,4]];function UO(e={}){let t=Number.isInteger(e.capacity)?e.capacity:VO;return{capacity:t>=1?t:VO,ops:(Array.isArray(e.ops)?e.ops:HO).filter(e=>Array.isArray(e)&&(e[0]===`get`?e.length>=2&&Number.isInteger(e[1]):e[0]===`put`&&e.length>=3&&Number.isInteger(e[1])&&Number.isInteger(e[2])))}}function WO(e={}){let{capacity:t,ops:n}=UO(e),r=1,i=[],a=new Map,o=[],s=[],c=()=>i.map(e=>({id:e.id,key:e.key,value:e.value})),l=()=>[...a.keys()].map(e=>({key:e,id:a.get(e).id})),u=(e,n,r,i={})=>{s.push({phase:e,desc:n,capacity:t,order:c(),mapEntries:l(),opText:r,cur:null,evicted:null,result:null,results:[...o],done:e===`done`,...i})},d=e=>{let t=i.indexOf(e);i.splice(t,1),i.unshift(e)};u(`init`,`LRU = **哈希表 + 双向链表**：哈希表按 key 一步找到节点（O(1) 定位），双向链表按「最近使用」排序 —— **队首 = 最近使用**，**队尾 = 最久未使用**，容量满就淘汰队尾。两条结构同步增删，保证 get / put 都是 O(1)。容量 = ${t}，全部操作逐帧推演。`,`LRUCache(${t})`);for(let e of n)if(e[0]===`get`){let t=e[1];if(a.has(t)){let e=a.get(t);d(e),o.push(e.value),u(`get-hit`,`\`get(${t})\` **命中**：哈希表一步找到节点（第 ${e.id} 号），返回 \`${e.value}\`；把它**移到队首**（刚刚被使用过）。这一步只动了链表指针，哈希表不动。`,`get(${t}) → ${e.value}`,{cur:e.id,result:e.value})}else o.push(-1),u(`get-miss`,`\`get(${t})\` **未命中**：哈希表里没有这个 key，返回 \`-1\`；链表、哈希表都原样不动。`,`get(${t}) → -1`,{result:-1})}else{let[,n,o]=e;if(a.has(n)){let e=a.get(n);e.value=o,d(e),u(`put-update`,`\`put(${n}, ${o})\`：key **已存在** → 改值 + **移到队首**。注意：**put 已存在的 key 也算一次使用** —— 漏掉这一步是本题最常见的错误。`,`put(${n}, ${o})：已存在 → 改值并移到队首`,{cur:e.id})}else{if(i.length===t){let e=i[i.length-1];a.delete(e.key),i.pop(),u(`evict`,`\`put(${n}, ${o})\`：容量已满 → 先**淘汰队尾** —— 第 ${e.id} 号节点 \`(${e.key}, ${e.value})\` 是最久未使用的。链表中摘掉它，**哈希表同步删除**，两处都要删干净，漏一个就是幽灵节点。`,`淘汰队尾 (${e.key}, ${e.value})`,{evicted:{id:e.id,key:e.key,value:e.value}})}let e={id:r,key:n,value:o};r+=1,a.set(n,e),i.unshift(e),u(`put-insert`,`\`put(${n}, ${o})\`：新 key → 建一个新节点**插到队首**（它刚刚被使用），哈希表登记 \`${n} → 第 ${e.id} 号节点\`。现在链表（头 → 尾）：\`${i.map(e=>`(${e.key}, ${e.value})`).join(` → `)}\`。`,`put(${n}, ${o})：新节点插到队首`,{cur:e.id})}}return u(`done`,`推演结束。所有 get 的返回值（按顺序）：\`[${o.join(`, `)}]\` —— 每次「命中」都返回哈希表里节点存的值（值跟着节点走，改值不搬家）；「未命中」固定 -1；淘汰只发生在 put 新 key 且容量已满时，且永远淘汰**队尾**。`,`完成：get 返回值 = [${o.join(`, `)}]`),s}var GO=`lrucache-styles`,KO=28,qO=78,JO=46,YO=182,XO=240,ZO=34,QO=292,$O=336,ek=40,tk=400,nk=1150,rk=66,ik=34,ak=22,ok=`
.lru { display: flex; flex-direction: column; gap: 14px; }
.lru__svg { width: 100%; height: auto; display: block; }

.lru-note {
  fill: var(--lru-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lru-note--r { text-anchor: end; }
.lru-lbl { fill: var(--lru-muted, #657168); font-size: 11.5px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.lru-sent__box { fill: var(--lru-sent, #e8ebe6); stroke: var(--lru-line, #b9c1b8); stroke-width: 2; }
.lru-sent__val { fill: var(--lru-muted, #657168); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }

.lru-node__box { fill: var(--lru-fill, #ffffff); stroke: var(--lru-line, #b9c1b8); stroke-width: 2; }
.lru-node--front .lru-node__box { fill: var(--lru-front, #eef5f1); stroke: var(--lru-ok, #3f6b57); }
.lru-node--cur .lru-node__box { stroke: var(--lru-gold, #c2872f); stroke-width: 3.5; }
.lru-node--victim .lru-node__box { stroke: var(--lru-hot, #a45f45); stroke-width: 3.5; stroke-dasharray: 5 4; }
.lru-node__kv { fill: var(--lru-ink, #1f2a24); font-size: 14px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.lru-node--victim .lru-node__kv { fill: var(--lru-hot, #a45f45); }
.lru-node__id { fill: var(--lru-dim, #9aa39c); font-size: 9.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }

.lru-link { stroke: var(--lru-line, #b9c1b8); stroke-width: 2; fill: none; }
.lru-link-head { fill: var(--lru-line, #b9c1b8); }

.lru-micro { fill: var(--lru-dim, #8d968e); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }

.lru-chip__box { fill: var(--lru-fill, #ffffff); stroke: var(--lru-line, #c3c9c2); stroke-width: 1.5; }
.lru-chip__val { fill: var(--lru-ink, #1f2a24); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.lru-chip.is-cur .lru-chip__box { fill: var(--lru-gold-fill, #fdf3e3); stroke: var(--lru-gold, #c2872f); stroke-width: 2.5; }
.lru-chip.is-cur .lru-chip__val { fill: var(--lru-gold, #c2872f); font-weight: 700; }
.lru-chip.is-result .lru-chip__box { fill: var(--lru-ok-fill, #eef5f1); stroke: var(--lru-ok, #3f6b57); stroke-width: 2; }
.lru-chip.is-result .lru-chip__val { fill: var(--lru-ok, #3f6b57); font-weight: 700; }
.lru-chip.is-miss .lru-chip__box { fill: var(--lru-hot-fill, #f7ece8); stroke: var(--lru-hot, #a45f45); stroke-width: 2; }
.lru-chip.is-miss .lru-chip__val { fill: var(--lru-hot, #a45f45); font-weight: 700; }

.lru-op__box { fill: var(--lru-op, #f4f3ef); stroke: var(--lru-line, #c3c9c2); stroke-width: 1.5; }
.lru-op__text { fill: var(--lru-ink, #1f2a24); font-size: 12.5px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }

.lru-banner__box { fill: var(--lru-banner, #f4f3ef); stroke: var(--lru-line, #c3c9c2); stroke-width: 1.5; }
.lru-banner__text { fill: var(--lru-hot, #a45f45); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.lru-banner__text.is-ok { fill: var(--lru-ok, #3f6b57); }

.lru-phase__text { fill: var(--lru-muted, #657168); font-size: 13px; font-weight: 600; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
`;function sk(){if(document.getElementById(GO))return;let e=document.createElement(`style`);e.id=GO,e.textContent=ok,document.head.appendChild(e)}function ck(e,t={}){if(!e||e.dataset.lruCacheMounted===`1`)return{destroy(){}};e.dataset.lruCacheMounted=`1`,sk();let n=WO(t),r=t.autoplay!==!1,{capacity:i}=n[0],a=Y,o=document.createElement(`div`);o.className=`viz lru`;let s=document.createElement(`div`);s.className=`viz__stage`,o.appendChild(s);let c=a(`svg`,{class:`viz__svg lru__svg`,viewBox:`0 0 660 422`,role:`img`,"aria-label":`LRU 缓存 LC146 双向链表与哈希表推演动画`});s.appendChild(c);let l=a(`g`,{}),u=a(`g`,{});c.append(l,u);let d=a(`text`,{class:`lru-note`,x:26,y:KO});d.textContent=`哈希表按 key 找节点；链表按使用顺序排 —— 队首 = 最近使用，队尾 = 淘汰对象`,u.appendChild(d);let f=a(`text`,{class:`lru-note lru-note--r`,x:634,y:KO});f.textContent=`容量 = ${i}`,u.appendChild(f);let p=Math.max(i,1),m=(660-(2*ik+p*rk+(p+1)*ak))/2,h=a(`g`,{});h.appendChild(a(`rect`,{class:`lru-sent__box`,x:m,y:qO,width:ik,height:JO,rx:8}));let g=a(`text`,{class:`lru-sent__val`,x:m+ik/2,y:101});g.textContent=`H`,h.appendChild(g),l.appendChild(h);let _=[];for(let e=0;e<p;e+=1){let t=m+ik+ak+e*88,n=a(`g`,{class:`lru-node`});n.appendChild(a(`rect`,{class:`lru-node__box`,x:t,y:qO,width:rk,height:JO,rx:9}));let r=a(`text`,{class:`lru-node__kv`,x:t+rk/2,y:105}),i=a(`text`,{class:`lru-node__id`,x:t+rk/2,y:90});n.append(r,i),l.appendChild(n),_.push({g:n,kv:r,id:i})}let v=a(`g`,{}),y=m+ik+ak+p*88;v.appendChild(a(`rect`,{class:`lru-sent__box`,x:y,y:qO,width:ik,height:JO,rx:8}));let b=a(`text`,{class:`lru-sent__val`,x:y+ik/2,y:101});b.textContent=`T`,v.appendChild(b),l.appendChild(v);let x=[];for(let e=0;e<=p;e+=1){let t=m+ik+e*88-ak;x.push([t,t+ak])}for(let[e,t]of x){let n=a(`line`,{class:`lru-link`,x1:e+4,y1:101,x2:t-4,y2:101}),r=a(`polygon`,{class:`lru-link-head`,points:`${e},101 ${e+5},97 ${e+5},105`}),i=a(`polygon`,{class:`lru-link-head`,points:`${t},101 ${t-5},97 ${t-5},105`});l.append(n,r,i)}let S=a(`text`,{class:`lru-micro`,x:m+ik/2,y:140});S.textContent=`队首 · 最近使用`;let C=a(`text`,{class:`lru-micro`,x:y+ik/2,y:140});C.textContent=`队尾 · 淘汰`,u.append(S,C);let w=a(`text`,{class:`lru-lbl`,x:26,y:194});w.textContent=`哈希表 key → 节点`,u.appendChild(w);let T=[];for(let e=0;e<4;e+=1){let t=146+e*70,n=a(`g`,{class:`lru-chip`});n.appendChild(a(`rect`,{class:`lru-chip__box`,x:t,y:YO,width:62,height:24,rx:6}));let r=a(`text`,{class:`lru-chip__val`,x:t+62/2,y:194});n.appendChild(r),u.appendChild(n),T.push({g:n,t:r})}let E=a(`text`,{class:`lru-micro`,x:146,y:194});E.setAttribute(`text-anchor`,`start`),E.textContent=`（空）`,u.appendChild(E),u.appendChild(a(`rect`,{class:`lru-op__box`,x:26,y:XO,width:608,height:ZO,rx:8}));let D=a(`text`,{class:`lru-op__text`,x:660/2,y:257});u.appendChild(D);let O=a(`text`,{class:`lru-lbl`,x:26,y:304});O.textContent=`get 返回`,u.appendChild(O);let k=[];for(let e=0;e<8;e+=1){let t=146+e*40,n=a(`g`,{class:`lru-chip`});n.appendChild(a(`rect`,{class:`lru-chip__box`,x:t,y:QO,width:34,height:24,rx:6}));let r=a(`text`,{class:`lru-chip__val`,x:t+17,y:304});n.appendChild(r),u.appendChild(n),k.push({g:n,t:r})}u.appendChild(a(`rect`,{class:`lru-banner__box`,x:26,y:$O,width:608,height:ek,rx:9}));let A=a(`text`,{class:`lru-banner__text`,x:660/2,y:356});u.appendChild(A);let j=a(`text`,{class:`lru-phase__text`,x:660/2,y:tk});u.appendChild(j);let M=document.createElement(`p`);M.className=`viz__desc`,M.setAttribute(`aria-live`,`polite`);function N(e,t){if(!t)return;let n=t.mapEntries.find(e=>e.id===t.cur)?.key??null;_.forEach((e,n)=>{let r=t.order[n];if(!r){e.g.style.display=`none`;return}e.g.style.display=``,e.kv.textContent=`${r.key}:${r.value}`,e.id.textContent=`#${r.id}`;let i=[`lru-node`];n===0&&i.push(`lru-node--front`),t.cur===r.id&&i.push(`lru-node--cur`),e.g.setAttribute(`class`,i.join(` `))});let r=t.phase===`evict`?t.order.length:-1;if(r>=0&&r<_.length){let e=_[r];e.g.style.display=``,e.kv.textContent=`${t.evicted.key}:${t.evicted.value}`,e.id.textContent=`#${t.evicted.id} 淘汰`,e.g.setAttribute(`class`,`lru-node lru-node--victim`)}let i=t.mapEntries;E.style.display=i.length===0?``:`none`,T.forEach((e,t)=>{if(t>=i.length){e.g.style.display=`none`;return}e.g.style.display=``,e.t.textContent=`${i[t].key} → #${i[t].id}`,e.g.setAttribute(`class`,`lru-chip`+(n===i[t].key?` is-cur`:``))}),D.textContent=t.opText;let a=t.results.slice(-k.length);k.forEach((e,t)=>{if(t>=a.length){e.g.style.display=`none`;return}e.g.style.display=``,e.t.textContent=String(a[t]);let n=t===a.length-1;e.g.setAttribute(`class`,`lru-chip`+(n?a[t]===-1?` is-miss`:` is-result`:``))}),t.phase===`init`?(A.textContent=`空缓存，容量 ${t.capacity}：哈希表与链表都为空`,A.setAttribute(`class`,`lru-banner__text`)):t.phase===`get-hit`?(A.textContent=`get 命中 → 返回 ${t.result}，节点移到队首`,A.setAttribute(`class`,`lru-banner__text is-ok`)):t.phase===`get-miss`?(A.textContent=`get 未命中 → 返回 −1（结构不动）`,A.setAttribute(`class`,`lru-banner__text`)):t.phase===`put-update`?(A.textContent=`put 已存在的 key → 改值 + 移到队首（也算使用）`,A.setAttribute(`class`,`lru-banner__text is-ok`)):t.phase===`evict`?(A.textContent=`容量满 → 淘汰队尾 (${t.evicted.key}, ${t.evicted.value})`,A.setAttribute(`class`,`lru-banner__text`)):t.phase===`put-insert`?(A.textContent=`新节点插到队首`,A.setAttribute(`class`,`lru-banner__text is-ok`)):(A.textContent=`完成：get 返回值 = [${t.results.join(`, `)}]`,A.setAttribute(`class`,`lru-banner__text is-ok`)),t.phase===`init`?j.textContent=`O(1) 的来源：哈希表定位 + 链表搬运，两件事都是常数时间`:t.phase===`get-hit`?j.textContent=`命中：先查表，再把节点从链表中间摘下来插到队首`:t.phase===`get-miss`?j.textContent=`未命中：什么都不做 —— 不在缓存里的 key 不会「占位」`:t.phase===`put-update`?j.textContent=`漏掉「移到队首」= 把一个热 key 误判成冷 key，面试扣分点`:t.phase===`evict`?j.textContent=`淘汰 = 链表摘尾 + 哈希表删除，两处必须同步`:t.phase===`put-insert`?j.textContent=`插入 = 新节点加到队首 + 哈希表登记，同样是 O(1)`:j.textContent=`get 与 put 都 O(1)：没有一次遍历，只有常数次指针操作`,Z(M,t.desc)}o.appendChild(M);let P=Q();o.appendChild(P.root),e.textContent=``,e.appendChild(o),X();let F=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,I=$({steps:n,controls:P,intervalMs:nk,onRender:N});I.jumpTo(Math.trunc(t.initialStep)||0);let L=null;return r&&!F&&typeof IntersectionObserver==`function`&&(L=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){L.disconnect(),L=null,I.play();return}},{threshold:.35}),L.observe(o)),{destroy(){L&&=(L.disconnect(),null),I.destroy(),e.textContent=``,delete e.dataset.lruCacheMounted,document.getElementById(GO)?.remove()}}}var lk=2,uk=[[`put`,1,1],[`put`,2,2],[`get`,2],[`get`,2],[`get`,1],[`put`,3,3],[`get`,1],[`get`,2],[`get`,3]];function dk(e={}){let t=Number.isInteger(e.capacity)?e.capacity:lk;return{capacity:t>=1?t:lk,ops:(Array.isArray(e.ops)?e.ops:uk).filter(e=>Array.isArray(e)&&(e[0]===`get`?e.length>=2&&Number.isInteger(e[1]):e[0]===`put`&&e.length>=3&&Number.isInteger(e[1])&&Number.isInteger(e[2])))}}function fk(e={}){let{capacity:t,ops:n}=dk(e),r=1,i=0,a=new Map,o=[],s=[],c=()=>[...a.values()].sort((e,t)=>e.freq-t.freq||e.stamp-t.stamp).map(e=>({id:e.id,key:e.key,value:e.value,freq:e.freq})),l=()=>{let e=null;for(let t of a.values())e=e===null?t.freq:Math.min(e,t.freq);return e},u=(e,n,r,i={})=>{s.push({phase:e,desc:n,capacity:t,nodes:c(),minFreq:l(),opText:r,cur:null,evicted:null,result:null,results:[...o],done:e===`done`,...i})};u(`init`,`LFU = **按使用频率淘汰**：每个节点记一个 \`freq\`（被 get / put 命中一次就 +1），容量满时淘汰 \`freq\` **最小**的节点；**freq 并列时淘汰其中「最久未使用」的**（频率维度 + 时间维度兜底）。和 LRU 对着看：下面这串操作会让两台机器**淘汰不同的 key**。容量 = ${t}。`,`LFUCache(${t})`);for(let e of n)if(e[0]===`get`){let t=e[1],n=a.get(t);if(n){let e=n.freq;n.freq+=1,n.stamp=++i,o.push(n.value),u(`get-hit`,`\`get(${t})\` 命中：返回 \`${n.value}\`，并把它的频率从 \`${e}\` 提到 \`${n.freq}\`。**注意：LFU 里的 get 会改结构** —— 频率变了，淘汰的优先级也跟着变（LRU 的 get 只动顺序、不改“权重”）。`,`get(${t}) → ${n.value}（freq ${e} → ${n.freq}）`,{cur:n.id,result:n.value})}else o.push(-1),u(`get-miss`,`\`get(${t})\` 未命中，返回 \`-1\`。**未命中不改变任何节点的频率**。`,`get(${t}) → -1`,{result:-1})}else{let[,n,o]=e,s=a.get(n);if(s){let e=s.freq;s.value=o,s.freq+=1,s.stamp=++i,u(`put-update`,`\`put(${n}, ${o})\`：已存在 → 改值，并把频率从 \`${e}\` 提到 \`${s.freq}\`。（LRU 是「移到队首」，LFU 是「升一档频率」——同样算一次使用，但记的东西不同。）`,`put(${n}, ${o})：改值 + freq ${e} → ${s.freq}`,{cur:s.id})}else{if(a.size===t){let e=null;for(let t of a.values())(e===null||t.freq<e.freq||t.freq===e.freq&&t.stamp<e.stamp)&&(e=t);let t=e.freq;a.delete(e.key),u(`evict`,`\`put(${n}, ${o})\`：容量已满 → 淘汰 \`freq\` **最小**的节点：\`(${e.key}, ${e.value})\`，freq = \`${t}\`（并列时才是「最久未使用」的 tie-break）。**不是淘汰最久未用的那个** —— 这就是 LFU 和 LRU 的分岔点。`,`淘汰 freq 最小的 (${e.key}, ${e.value})，freq = ${t}`,{evicted:{id:e.id,key:e.key,value:e.value,freq:t}})}let e={id:r,key:n,value:o,freq:1,stamp:++i};r+=1,a.set(n,e),u(`put-insert`,`插入新节点 \`(${n}, ${o})\`，**freq 从 1 起**（新来的还没被用过）。当前各节点频率：${c().map(e=>`\`${e.key}:${e.freq}\``).join(`、`)}，minFreq = \`${l()}\`。`,`put(${n}, ${o})：新节点 freq = 1`,{cur:e.id})}}return u(`done`,`推演结束，get 返回值 = \`[${o.join(`, `)}]\`。对照记忆：LRU 淘汰「最久未用」，LFU 淘汰「用得最少」（并列再比谁更久没用）；代价是 LFU 的 get 要更新频率、结构更重 —— 面试里这两题连问，考的就是你知不知道它们差在哪。`,`完成：get 返回值 = [${o.join(`, `)}]`),s}var pk=`lfucache-styles`,mk=28,hk=78,gk=46,_k=165,vk=240,yk=34,bk=292,xk=336,Sk=40,Ck=400,wk=1150,Tk=84,Ek=132,Dk=`
.lfu { display: flex; flex-direction: column; gap: 14px; }
.lfu__svg { width: 100%; height: auto; display: block; }

.lfu-note {
  fill: var(--lfu-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lfu-note--r { text-anchor: end; }
.lfu-lbl { fill: var(--lfu-muted, #657168); font-size: 11.5px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.lfu-evict-arrow { stroke: var(--lfu-hot, #a45f45); stroke-width: 2; fill: none; }
.lfu-evict-head { fill: var(--lfu-hot, #a45f45); }
.lfu-evict-text { fill: var(--lfu-hot, #a45f45); font-size: 11px; font-weight: 700; text-anchor: start;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }

.lfu-node__box { fill: var(--lfu-fill, #ffffff); stroke: var(--lfu-line, #b9c1b8); stroke-width: 2; }
.lfu-node--min .lfu-node__box { fill: var(--lfu-min-fill, #f7ece8); stroke: var(--lfu-hot, #a45f45); }
.lfu-node--cur .lfu-node__box { stroke: var(--lfu-gold, #c2872f); stroke-width: 3.5; }
.lfu-node--victim .lfu-node__box { stroke: var(--lfu-hot, #a45f45); stroke-width: 3.5; stroke-dasharray: 5 4; }
.lfu-node__kv { fill: var(--lfu-ink, #1f2a24); font-size: 14px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.lfu-node--victim .lfu-node__kv { fill: var(--lfu-hot, #a45f45); }
.lfu-badge__circle { fill: var(--lfu-fill, #ffffff); stroke: var(--lfu-line, #b9c1b8); stroke-width: 1.5; }
.lfu-node--cur .lfu-badge__circle { fill: var(--lfu-gold-fill, #fdf3e3); stroke: var(--lfu-gold, #c2872f); stroke-width: 2; }
.lfu-badge__num { fill: var(--lfu-ink, #1f2a24); font-size: 11px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.lfu-node--cur .lfu-badge__num { fill: var(--lfu-gold, #c2872f); }

.lfu-chip__box { fill: var(--lfu-fill, #ffffff); stroke: var(--lfu-line, #c3c9c2); stroke-width: 1.5; }
.lfu-chip__val { fill: var(--lfu-ink, #1f2a24); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.lfu-chip.is-result .lfu-chip__box { fill: var(--lfu-ok-fill, #eef5f1); stroke: var(--lfu-ok, #3f6b57); stroke-width: 2; }
.lfu-chip.is-result .lfu-chip__val { fill: var(--lfu-ok, #3f6b57); font-weight: 700; }
.lfu-chip.is-miss .lfu-chip__box { fill: var(--lfu-hot-fill, #f7ece8); stroke: var(--lfu-hot, #a45f45); stroke-width: 2; }
.lfu-chip.is-miss .lfu-chip__val { fill: var(--lfu-hot, #a45f45); font-weight: 700; }

.lfu-op__box { fill: var(--lfu-op, #f4f3ef); stroke: var(--lfu-line, #c3c9c2); stroke-width: 1.5; }
.lfu-op__text { fill: var(--lfu-ink, #1f2a24); font-size: 12.5px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }

.lfu-banner__box { fill: var(--lfu-banner, #f4f3ef); stroke: var(--lfu-line, #c3c9c2); stroke-width: 1.5; }
.lfu-banner__text { fill: var(--lfu-hot, #a45f45); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.lfu-banner__text.is-ok { fill: var(--lfu-ok, #3f6b57); }

.lfu-phase__text { fill: var(--lfu-muted, #657168); font-size: 13px; font-weight: 600; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
`;function Ok(){if(document.getElementById(pk))return;let e=document.createElement(`style`);e.id=pk,e.textContent=Dk,document.head.appendChild(e)}function kk(e,t={}){if(!e||e.dataset.lfuCacheMounted===`1`)return{destroy(){}};e.dataset.lfuCacheMounted=`1`,Ok();let n=fk(t),r=t.autoplay!==!1,{capacity:i}=n[0],a=Y,o=document.createElement(`div`);o.className=`viz lfu`;let s=document.createElement(`div`);s.className=`viz__stage`,o.appendChild(s);let c=a(`svg`,{class:`viz__svg lfu__svg`,viewBox:`0 0 660 422`,role:`img`,"aria-label":`LFU 缓存 LC460 频率淘汰推演动画`});s.appendChild(c);let l=a(`g`,{}),u=a(`g`,{});c.append(l,u);let d=a(`text`,{class:`lfu-note`,x:26,y:mk});d.textContent=`freq 最小者先淘汰（并列 → 最久未使用）；get 命中会涨 freq`,u.appendChild(d);let f=a(`text`,{class:`lfu-note lfu-note--r`,x:634,y:mk});f.textContent=`容量 = ${i}`,u.appendChild(f),u.appendChild(a(`line`,{class:`lfu-evict-arrow`,x1:34,y1:101,x2:Ek-14,y2:101})),u.appendChild(a(`polygon`,{class:`lfu-evict-head`,points:`${Ek-8},101 ${Ek-18},96 ${Ek-18},106`}));let p=a(`text`,{class:`lfu-evict-text`,x:34,y:hk-16});p.textContent=`淘汰优先 →`,u.appendChild(p);let m=Math.max(i+1,2),h=[];for(let e=0;e<m;e+=1){let t=Ek+e*100,n=a(`g`,{class:`lfu-node`});n.appendChild(a(`rect`,{class:`lfu-node__box`,x:t,y:hk,width:Tk,height:gk,rx:9}));let r=a(`text`,{class:`lfu-node__kv`,x:t+Tk/2,y:107});n.appendChild(r);let i=a(`g`,{class:`lfu-badge`});i.appendChild(a(`circle`,{class:`lfu-badge__circle`,cx:t+Tk-14,cy:91,r:11}));let o=a(`text`,{class:`lfu-badge__num`,x:t+Tk-14,y:91});i.appendChild(o),n.appendChild(i),l.appendChild(n),h.push({g:n,kv:r,badge:i,bnum:o})}let g=a(`text`,{class:`lfu-lbl`,x:26,y:_k});g.textContent=`minFreq（淘汰目标频率）`;let _=a(`text`,{class:`lfu-op__text`,x:210,y:_k,"text-anchor":`start`});u.append(g,_);let v=a(`text`,{class:`lfu-lbl`,x:320,y:_k});v.textContent=`＝ 所有节点 freq 的最小值；并列时看谁更久没用`,u.appendChild(v),u.appendChild(a(`rect`,{class:`lfu-op__box`,x:26,y:vk,width:608,height:yk,rx:8}));let y=a(`text`,{class:`lfu-op__text`,x:660/2,y:257});u.appendChild(y);let b=a(`text`,{class:`lfu-lbl`,x:26,y:304});b.textContent=`get 返回`,u.appendChild(b);let x=[];for(let e=0;e<8;e+=1){let t=146+e*40,n=a(`g`,{class:`lfu-chip`});n.appendChild(a(`rect`,{class:`lfu-chip__box`,x:t,y:bk,width:34,height:24,rx:6}));let r=a(`text`,{class:`lfu-chip__val`,x:t+17,y:304});n.appendChild(r),u.appendChild(n),x.push({g:n,t:r})}u.appendChild(a(`rect`,{class:`lfu-banner__box`,x:26,y:xk,width:608,height:Sk,rx:9}));let S=a(`text`,{class:`lfu-banner__text`,x:660/2,y:356});u.appendChild(S);let C=a(`text`,{class:`lfu-phase__text`,x:660/2,y:Ck});u.appendChild(C);let w=document.createElement(`p`);w.className=`viz__desc`,w.setAttribute(`aria-live`,`polite`);function T(e,t){if(!t)return;let n=t.phase===`evict`?t.evicted:null,r=+!!n;h.forEach((e,i)=>{let a=t.nodes[i-r],o=n&&i===0;if(!a&&!o){e.g.style.display=`none`;return}if(e.g.style.display=``,o){e.kv.textContent=`${n.key}:${n.value}`,e.bnum.textContent=String(n.freq),e.g.setAttribute(`class`,`lfu-node lfu-node--victim`);return}e.kv.textContent=`${a.key}:${a.value}`,e.bnum.textContent=String(a.freq);let s=[`lfu-node`];i-r===0&&s.push(`lfu-node--min`),t.cur===a.id&&s.push(`lfu-node--cur`),e.g.setAttribute(`class`,s.join(` `))}),_.textContent=t.minFreq===null?`—`:String(t.minFreq),y.textContent=t.opText;let i=t.results.slice(-x.length);x.forEach((e,t)=>{if(t>=i.length){e.g.style.display=`none`;return}e.g.style.display=``,e.t.textContent=String(i[t]);let n=t===i.length-1;e.g.setAttribute(`class`,`lfu-chip`+(n?i[t]===-1?` is-miss`:` is-result`:``))}),t.phase===`init`?(S.textContent=`空缓存，容量 ${t.capacity}：节点按 freq 从低到高从左到右排`,S.setAttribute(`class`,`lfu-banner__text`)):t.phase===`get-hit`?(S.textContent=`get 命中 → 返回 ${t.result}，freq +1（淘汰优先级跟着变）`,S.setAttribute(`class`,`lfu-banner__text is-ok`)):t.phase===`get-miss`?(S.textContent=`get 未命中 → 返回 −1（不改频率）`,S.setAttribute(`class`,`lfu-banner__text`)):t.phase===`put-update`?(S.textContent=`put 已存在 → 改值 + freq +1`,S.setAttribute(`class`,`lfu-banner__text is-ok`)):t.phase===`evict`?(S.textContent=`淘汰 freq 最小的 (${t.evicted.key}, ${t.evicted.value})，freq = ${t.evicted.freq}`,S.setAttribute(`class`,`lfu-banner__text`)):t.phase===`put-insert`?(S.textContent=`新节点 freq = 1（从最冷起步）`,S.setAttribute(`class`,`lfu-banner__text is-ok`)):(S.textContent=`完成：get 返回值 = [${t.results.join(`, `)}]`,S.setAttribute(`class`,`lfu-banner__text is-ok`)),t.phase===`init`?C.textContent=`LFU 只认「用得多少」：最左的节点就是下一个淘汰对象`:t.phase===`get-hit`?C.textContent=`和 LRU 的关键分歧：get 会改频率 → 改淘汰顺序`:t.phase===`get-miss`?C.textContent=`未命中：频率不变 —— 冷 key 不会因为被看空一次变热`:t.phase===`put-update`?C.textContent=`put 命中同样升频：写入也算一次使用`:t.phase===`evict`?C.textContent=`并列 freq 时淘汰最久未使用的 —— 频率 + 时间的双维度`:t.phase===`put-insert`?C.textContent=`新来的最冷（freq 1）；minFreq 也随之更新`:C.textContent=`真实现场用「频率桶 + minFreq 指针」把 LFU 也做到 O(1)（LC 460 的考点）`,Z(w,t.desc)}o.appendChild(w);let E=Q();o.appendChild(E.root),e.textContent=``,e.appendChild(o),X();let D=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,O=$({steps:n,controls:E,intervalMs:wk,onRender:T});O.jumpTo(Math.trunc(t.initialStep)||0);let k=null;return r&&!D&&typeof IntersectionObserver==`function`&&(k=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){k.disconnect(),k=null,O.play();return}},{threshold:.35}),k.observe(o)),{destroy(){k&&=(k.disconnect(),null),O.destroy(),e.textContent=``,delete e.dataset.lfuCacheMounted,document.getElementById(pk)?.remove()}}}var Ak=[4,7,7,6,1,3,2,5,6,1,5,2];function jk(e={}){let t=Number.isInteger(e.from)&&e.from>=2?e.from:7,n=t*t,r=Number.isInteger(e.to)&&e.to>=2&&e.to<=n?e.to:10,i=Array.isArray(e.rolls)?e.rolls:null,a=Ak;if(i&&i.length>=2){let e=i.filter(e=>Number.isInteger(e)&&e>=1&&e<=t);a=e.length>=2?e:Ak}return{from:t,to:r,size:n,rolls:a.slice(0,a.length-a.length%2)}}function Mk(e={}){let{from:t,to:n,size:r,rolls:i}=jk(e),a=Math.floor(r/n)*n,o=a/n,s=2*r/a,c=[],l=[],u=0,d=0,f=0,p=(e,i,p={})=>{c.push({phase:e,desc:i,from:t,to:n,size:r,acceptLimit:a,perOutput:o,expect:s,a:null,b:null,cellValue:null,output:null,outputs:[...l],calls:u,rejects:d,attempts:f,done:e===`done`,...p})};p(`init`,`目标：用 \`rand${t}()\` 造出 \`rand${n}()\`。一次只有 ${t} 个等概率状态，凑不出 ${n} 份均分 —— 但**两次独立的 \`rand${t}()\`** 有 ${t} × ${t} = ${r} 个等概率状态（乘积空间）。取 \`v = (a-1) × ${t} + b\` 得到 1..${r} 的均匀整数；${r} 里能整整除 ${n} 的最大块是 ${a} = ${o} × ${n} —— **v ≤ ${a} 接受、v > ${a} 拒绝重掷**（拒绝率 ${r-a}/${r}）。`);for(let e=0;e+1<i.length;e+=2){let s=i[e],c=i[e+1],m=(s-1)*t+c;if(f+=1,u+=2,p(`roll`,`第 ${f} 次尝试：掷出 \`a = ${s}\`、\`b = ${c}\` → \`v = (${s}-1) × ${t} + ${c} = ${m}\`，落在 ${t}×${t} 状态表的第 \`${m}\` 格。${m} 与 ${a} 的大小，决定这次接受还是拒绝。`,{a:s,b:c,cellValue:m}),m<=a){let e=(m-1)%n+1;l.push(e),p(`accept`,`\`v = ${m} ≤ ${a}\`：**接受**，输出 \`(v-1) % ${n} + 1 = ${e}\`。结果均匀的原因：每个输出 1..${n} 恰好对应 ${o} 个状态（${a} = ${o} × ${n}），所有状态等概率，所以给定「接受」时每个输出的条件概率都是 ${o}/${a} = 1/${n}。`,{a:s,b:c,cellValue:m,output:e})}else d+=1,p(`reject`,`\`v = ${m} > ${a}\`：**拒绝**，这次的两个 rand${t}() 作废，**整组重掷**。不要心疼这 ${r-a}/${r} 的浪费 —— 拒绝不破坏均匀性：重掷是独立的，「第一次落进接受区」的那一轮，条件分布依然是均匀的。`,{a:s,b:c,cellValue:m})}return p(`done`,`脚本跑完：输出序列 \`[${l.join(`, `)}]\`，共调用 ${u} 次 rand${t}()（${f} 轮尝试，拒绝 ${d} 次）。理论值：每轮 2 次调用、接受率 ${a}/${r}，**期望调用次数 = 2 × ${r}/${a} = ${s.toFixed(2)} 次**；信息论下界是 log(${n}) / log(${t}) ≈ ${(Math.log(n)/Math.log(t)).toFixed(2)} 次 —— 拒绝法离它还有距离，进阶写法会把被拒绝状态「回收」进下一轮。`),c}var Nk=`rand10-styles`,Pk=28,Fk=30,Ik=76,Lk=40,Rk=350,zk=284,Bk=392,Vk=40,Hk=456,Uk=1150,Wk=`
.rdv { display: flex; flex-direction: column; gap: 14px; }
.rdv__svg { width: 100%; height: auto; display: block; }

.rdv-note {
  fill: var(--rdv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rdv-note--r { text-anchor: end; }
.rdv-lbl { fill: var(--rdv-muted, #657168); font-size: 11.5px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.rdv-cell__box { stroke: var(--rdv-line, #d8ded6); stroke-width: 1; }
.rdv-cell--accept .rdv-cell__box { fill: var(--rdv-accept, #e7f2ea); }
.rdv-cell--reject .rdv-cell__box { fill: var(--rdv-reject, #f7ece8); }
.rdv-cell.is-hit .rdv-cell__box { stroke: var(--rdv-gold, #c2872f); stroke-width: 3; fill: var(--rdv-hit, #fdf3e3); }
.rdv-cell.is-rejected .rdv-cell__box { stroke: var(--rdv-hot, #a45f45); stroke-width: 3; }
.rdv-cell__num {
  fill: var(--rdv-ink, #4a544c); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rdv-cell.is-hit .rdv-cell__num { fill: var(--rdv-gold, #c2872f); font-weight: 700; }
.rdv-cell.is-rejected .rdv-cell__num { fill: var(--rdv-hot, #a45f45); font-weight: 700; }
.rdv-idx { fill: var(--rdv-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }

.rdv-box { fill: var(--rdv-fill, #ffffff); stroke: var(--rdv-line, #c3c9c2); stroke-width: 1.5; }
.rdv-die__lbl { fill: var(--rdv-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.rdv-die__val {
  fill: var(--rdv-ink, #1f2a24); font-size: 26px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rdv-die__val.is-live { fill: var(--rdv-gold, #c2872f); }

.rdv-formula { fill: var(--rdv-ink, #1f2a24); font-size: 13px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.rdv-verdict { font-size: 15px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.rdv-verdict.is-ok { fill: var(--rdv-ok, #3f6b57); }
.rdv-verdict.is-no { fill: var(--rdv-hot, #a45f45); }
.rdv-verdict.is-idle { fill: var(--rdv-dim, #9aa39c); }

.rdv-chip__box { fill: var(--rdv-fill, #ffffff); stroke: var(--rdv-line, #c3c9c2); stroke-width: 1.5; }
.rdv-chip__val { fill: var(--rdv-ink, #1f2a24); font-size: 12px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.rdv-chip.is-out .rdv-chip__box { fill: var(--rdv-ok-fill, #eef5f1); stroke: var(--rdv-ok, #3f6b57); stroke-width: 2; }
.rdv-chip.is-out .rdv-chip__val { fill: var(--rdv-ok, #3f6b57); }
.rdv-chip.is-latest .rdv-chip__box { fill: var(--rdv-gold-fill, #fdf3e3); stroke: var(--rdv-gold, #c2872f); stroke-width: 2.5; }
.rdv-chip.is-latest .rdv-chip__val { fill: var(--rdv-gold, #c2872f); }

.rdv-count { fill: var(--rdv-muted, #657168); font-size: 12px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.rdv-count b { font-weight: 700; }

.rdv-banner__box { fill: var(--rdv-banner, #f4f3ef); stroke: var(--rdv-line, #c3c9c2); stroke-width: 1.5; }
.rdv-banner__text { fill: var(--rdv-hot, #a45f45); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.rdv-banner__text.is-ok { fill: var(--rdv-ok, #3f6b57); }

.rdv-phase__text { fill: var(--rdv-muted, #657168); font-size: 13px; font-weight: 600; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
`;function Gk(){if(document.getElementById(Nk))return;let e=document.createElement(`style`);e.id=Nk,e.textContent=Wk,document.head.appendChild(e)}function Kk(e,t={}){if(!e||e.dataset.rand10Mounted===`1`)return{destroy(){}};e.dataset.rand10Mounted=`1`,Gk();let n=Mk(t),r=t.autoplay!==!1,{from:i,to:a,size:o,acceptLimit:s}=n[0],c=Y,l=document.createElement(`div`);l.className=`viz rdv`;let u=document.createElement(`div`);u.className=`viz__stage`,l.appendChild(u);let d=c(`svg`,{class:`viz__svg rdv__svg`,viewBox:`0 0 660 478`,role:`img`,"aria-label":`Rand7 实现 Rand10 LC470 拒绝采样推演动画`});u.appendChild(d);let f=c(`g`,{}),p=c(`g`,{});d.append(f,p);let m=c(`text`,{class:`rdv-note`,x:26,y:Pk});m.textContent=`两次 rand${i}() 凑成 ${o} 个等概率状态：v ≤ ${s} 接受，否则整组重掷`,p.appendChild(m);let h=c(`text`,{class:`rdv-note rdv-note--r`,x:634,y:Pk});h.textContent=`rand${i}() → rand${a}()`,p.appendChild(h);let g=[];for(let e=0;e<i;e+=1){let t=[];for(let n=0;n<i;n+=1){let r=Fk+n*44,a=Ik+e*44,o=e*i+n+1,s=c(`g`,{class:`rdv-cell`});s.appendChild(c(`rect`,{class:`rdv-cell__box`,x:r,y:a,width:Lk,height:Lk,rx:5}));let l=c(`text`,{class:`rdv-cell__num`,x:r+Lk/2,y:a+Lk/2});l.textContent=String(o),s.appendChild(l),f.appendChild(s),t.push({g:s})}g.push(t)}for(let e=0;e<i;e+=1){let t=Fk+e*44+Lk/2,n=Ik+e*44+Lk/2,r=c(`text`,{class:`rdv-idx`,x:t,y:Ik-14});r.textContent=String(e+1);let i=c(`text`,{class:`rdv-idx`,x:Fk-14,y:n});i.textContent=String(e+1),p.append(r,i)}let _=c(`text`,{class:`rdv-lbl`,x:Fk-14,y:Ik-32,"text-anchor":`middle`});_.textContent=`a`;let v=c(`text`,{class:`rdv-lbl`,x:182,y:Ik-32});v.textContent=`b →`,p.append(_,v),p.appendChild(c(`rect`,{class:`rdv-box`,x:Rk,y:Ik,width:134,height:62,rx:9})),p.appendChild(c(`rect`,{class:`rdv-box`,x:500,y:Ik,width:134,height:62,rx:9}));let y=c(`text`,{class:`rdv-die__lbl`,x:417,y:90});y.textContent=`rand${i}() → a`;let b=c(`text`,{class:`rdv-die__lbl`,x:567,y:90});b.textContent=`rand${i}() → b`;let x=c(`text`,{class:`rdv-die__val`,x:417,y:116}),S=c(`text`,{class:`rdv-die__val`,x:567,y:116});p.append(y,b,x,S),p.appendChild(c(`rect`,{class:`rdv-box`,x:Rk,y:154,width:zk,height:40,rx:8}));let C=c(`text`,{class:`rdv-formula`,x:492,y:174});p.appendChild(C),p.appendChild(c(`rect`,{class:`rdv-box`,x:Rk,y:204,width:zk,height:40,rx:8}));let w=c(`text`,{class:`rdv-verdict is-idle`,x:492,y:224});p.appendChild(w);let T=c(`text`,{class:`rdv-lbl`,x:Rk,y:272});T.textContent=`rand10() 输出序列`,p.appendChild(T);let E=[];for(let e=0;e<8;e+=1){let t=Rk+e*40,n=c(`g`,{class:`rdv-chip`});n.appendChild(c(`rect`,{class:`rdv-chip__box`,x:t,y:284,width:34,height:26,rx:6}));let r=c(`text`,{class:`rdv-chip__val`,x:t+34/2,y:297});n.appendChild(r),p.appendChild(n),E.push({g:n,t:r})}let D=c(`text`,{class:`rdv-count`,x:Rk,y:344});p.appendChild(D),p.appendChild(c(`rect`,{class:`rdv-banner__box`,x:26,y:Bk,width:608,height:Vk,rx:9}));let O=c(`text`,{class:`rdv-banner__text`,x:660/2,y:412});p.appendChild(O);let k=c(`text`,{class:`rdv-phase__text`,x:660/2,y:Hk});p.appendChild(k);let A=document.createElement(`p`);A.className=`viz__desc`,A.setAttribute(`aria-live`,`polite`);function j(e,t){if(!t)return;let n=t.a===null?-1:t.a-1,r=t.b===null?-1:t.b-1,c=t.cellValue;g.forEach((e,a)=>{e.forEach((e,o)=>{let c=[`rdv-cell`,a*i+o+1<=s?`rdv-cell--accept`:`rdv-cell--reject`];a===n&&o===r&&(c.push(`is-hit`),t.phase===`reject`&&c.push(`is-rejected`)),e.g.setAttribute(`class`,c.join(` `))})}),x.textContent=t.a===null?`—`:String(t.a),S.textContent=t.b===null?`—`:String(t.b),x.setAttribute(`class`,`rdv-die__val`+(t.a===null?``:` is-live`)),S.setAttribute(`class`,`rdv-die__val`+(t.b===null?``:` is-live`)),C.textContent=c===null?`v = (a−1) × ${i} + b`:`v = (${t.a}−1) × ${i} + ${t.b} = ${c}`,t.phase===`accept`?(w.textContent=`v = ${c} ≤ ${s} → 接受`,w.setAttribute(`class`,`rdv-verdict is-ok`)):t.phase===`reject`?(w.textContent=`v = ${c} > ${s} → 拒绝，整组重掷`,w.setAttribute(`class`,`rdv-verdict is-no`)):t.phase===`roll`?(w.textContent=`等定夺…`,w.setAttribute(`class`,`rdv-verdict is-idle`)):(w.textContent=`—`,w.setAttribute(`class`,`rdv-verdict is-idle`));let l=t.outputs.slice(-E.length);E.forEach((e,t)=>{if(t>=l.length){e.g.style.display=`none`;return}e.g.style.display=``,e.t.textContent=String(l[t]);let n=t===l.length-1;e.g.setAttribute(`class`,`rdv-chip is-out`+(n?` is-latest`:``))}),D.textContent=`调用 ${t.calls} 次 · 拒绝 ${t.rejects} 次 · 期望 ${t.expect.toFixed(2)} 次`,t.phase===`init`?(O.textContent=`49 个等概率状态：1..${s} 绿色接受区、${s+1}..${o} 红色拒绝区`,O.setAttribute(`class`,`rdv-banner__text`)):t.phase===`roll`?(O.textContent=`第 ${t.attempts} 次尝试：a = ${t.a}，b = ${t.b}`,O.setAttribute(`class`,`rdv-banner__text`)):t.phase===`accept`?(O.textContent=`接受 → 输出 ${t.output}（(v−1) % ${a} + 1）`,O.setAttribute(`class`,`rdv-banner__text is-ok`)):t.phase===`reject`?(O.textContent=`拒绝 v = ${t.cellValue} —— 不产出，重掷`,O.setAttribute(`class`,`rdv-banner__text`)):(O.textContent=`完成：输出 [${t.outputs.join(`, `)}]，共调用 ${t.calls} 次`,O.setAttribute(`class`,`rdv-banner__text is-ok`)),t.phase===`init`?k.textContent=`一次 rand${i}() 只有 ${i} 个状态，两次独立才有 ${o} 个等概率状态`:t.phase===`roll`?k.textContent=`先算 v = (a−1)×7+b：把二维的 (a,b) 拍平成一维的 1..49`:t.phase===`accept`?k.textContent=`每个输出恰好 4 个来源状态（40 = 4 × 10），所以均匀`:t.phase===`reject`?k.textContent=`拒绝不破坏均匀：重掷独立同分布，条件分布不变`:k.textContent=`期望 = 2 × 49/40 = 2.45 次；信息论下界约 1.18 次`,Z(A,t.desc)}l.appendChild(A);let M=Q();l.appendChild(M.root),e.textContent=``,e.appendChild(l),X();let N=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,P=$({steps:n,controls:M,intervalMs:Uk,onRender:j});P.jumpTo(Math.trunc(t.initialStep)||0);let F=null;return r&&!N&&typeof IntersectionObserver==`function`&&(F=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){F.disconnect(),F=null,P.play();return}},{threshold:.35}),F.observe(l)),{destroy(){F&&=(F.disconnect(),null),P.destroy(),e.textContent=``,delete e.dataset.rand10Mounted,document.getElementById(Nk)?.remove()}}}function qk(e={}){let t=Number.isInteger(e.from)&&e.from>=2?e.from:7,n=t*t;return{from:t,to:Number.isInteger(e.to)&&e.to>=2&&e.to<=n?e.to:10,size:n}}function Jk(e,t){let n=e*e,r=Math.floor(n/t)*t,i=[];for(let n=0;n<e;n+=1){let a=[];for(let i=0;i<e;i+=1){let o=n*e+i+1,s=o<=r;a.push({value:o,accepted:s,output:s?(o-1)%t+1:null})}i.push(a)}return{size:n,acceptLimit:r,perOutput:r/t,board:i}}function Yk(e={}){let{from:t,to:n,size:r}=qk(e),{acceptLimit:i,perOutput:a,board:o}=Jk(t,n),s=[],c=(e,c,l)=>{let u=Array(n).fill(0);for(let e=0;e<t;e+=1)for(let n=0;n<t;n+=1){let t=o[e][n];t.output!==null&&t.output<=l&&(u[t.output-1]+=1)}s.push({phase:e,desc:c,from:t,to:n,size:r,acceptLimit:i,perOutput:a,revealed:l,counts:u,done:e===`done`})};c(`init`,`证明的目标：**每个输出 1..${n} 的概率恰好是 1/${n}**。盘面上是 ${t} × ${t} = ${r} 个等概率状态（每个格子是 (a, b) 掷出的一对值，概率都是 1/${r}）。接受区是 1..${i}（绿色底），被拒绝的是 ${i+1}..${r}（灰色）。下面按输出 1..${n} 逐组点亮它们的光源格。`,0);for(let e=1;e<=n;e+=1)c(`reveal`,`输出 \`${e}\` 对应哪些状态？解 \`(v-1) % ${n} + 1 = ${e}\` 且 \`v ≤ ${i}\`：恰好 **${a} 个**（v = ${Array.from({length:a},(t,r)=>e+r*n).join(`, `)}）。点亮它们 —— 记住这个数：**每个输出都是 ${a} 个**，一个不多一个不少。`,e);return c(`done`,`${n} 组全部点亮：接受区共 ${i} 格被**均分**给 ${n} 个输出，每组恰好 ${a} 格；中间 0 格重叠、0 格遗漏。于是给定「接受」：\`P(输出 = k | 接受) = ${a}/${i} = 1/${n}\`，**均匀性得证**。拒绝的 ${r-i} 格（灰色）会触发重掷 —— 重掷与上一轮独立，「第一次落进接受区」的那一轮仍然服从同样的分布，所以拒绝不影响均匀，只影响期望次数。`,n),s}var Xk=`rand10uniform-styles`,Zk=28,Qk=30,$k=76,eA=40,tA=350,nA=392,rA=40,iA=456,aA=1150,oA=[`#79a892`,`#c2872f`,`#8aa0c0`,`#b08fb0`,`#a4b06a`,`#c08a8a`,`#7fa7a0`,`#c7a76a`,`#9aa3c7`,`#b3a08a`],sA=`
.rdp { display: flex; flex-direction: column; gap: 14px; }
.rdp__svg { width: 100%; height: auto; display: block; }

.rdp-note {
  fill: var(--rdp-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rdp-note--r { text-anchor: end; }
.rdp-lbl { fill: var(--rdp-muted, #657168); font-size: 11.5px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.rdp-cell__box { stroke: var(--rdp-line, #d8ded6); stroke-width: 1; }
.rdp-cell--reject .rdp-cell__box { fill: var(--rdp-reject, #e9e6e1); }
.rdp-cell--pending .rdp-cell__box { fill: var(--rdp-pending, #f6f7f4); }
.rdp-cell.is-live .rdp-cell__box { stroke: var(--rdp-gold, #c2872f); stroke-width: 2.5; }
.rdp-cell__num {
  fill: var(--rdp-dim, #b3bbb3); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rdp-cell.is-colored .rdp-cell__num { fill: #ffffff; font-weight: 700; }
.rdp-cell--reject .rdp-cell__num { fill: var(--rdp-dim, #a8b0a8); }
.rdp-idx { fill: var(--rdp-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }

.rdp-legend__box { fill: var(--rdp-fill, #ffffff); stroke: var(--rdp-line, #c3c9c2); stroke-width: 1.5; }
.rdp-legend__box.is-on { stroke-width: 2.5; }
.rdp-legend__t { font-size: 11.5px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.rdp-legend__count { font-size: 11.5px; font-weight: 700; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.rdp-note2 { fill: var(--rdp-muted, #657168); font-size: 12px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.rdp-note2 b { font-weight: 700; fill: var(--rdp-ink, #1f2a24); }

.rdp-banner__box { fill: var(--rdp-banner, #f4f3ef); stroke: var(--rdp-line, #c3c9c2); stroke-width: 1.5; }
.rdp-banner__text { fill: var(--rdp-hot, #a45f45); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.rdp-banner__text.is-ok { fill: var(--rdp-ok, #3f6b57); }

.rdp-phase__text { fill: var(--rdp-muted, #657168); font-size: 13px; font-weight: 600; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
`;function cA(){if(document.getElementById(Xk))return;let e=document.createElement(`style`);e.id=Xk,e.textContent=sA,document.head.appendChild(e)}function lA(e,t={}){if(!e||e.dataset.rand10UniformMounted===`1`)return{destroy(){}};e.dataset.rand10UniformMounted=`1`,cA();let n=Yk(t),r=t.autoplay!==!1,{from:i,to:a,size:o,acceptLimit:s,perOutput:c}=n[0],{board:l}=Jk(i,a),u=Y,d=document.createElement(`div`);d.className=`viz rdp`;let f=document.createElement(`div`);f.className=`viz__stage`,d.appendChild(f);let p=u(`svg`,{class:`viz__svg rdp__svg`,viewBox:`0 0 660 478`,role:`img`,"aria-label":`Rand10 均匀性证明推演动画`});f.appendChild(p);let m=u(`g`,{}),h=u(`g`,{});p.append(m,h);let g=u(`text`,{class:`rdp-note`,x:26,y:Zk});g.textContent=`${o} 格等概率（各 1/${o}）；被接受的 ${s} 格恰好均分给 ${a} 个输出`,h.appendChild(g);let _=u(`text`,{class:`rdp-note rdp-note--r`,x:634,y:Zk});_.textContent=`每组 ${c} 格`,h.appendChild(_);let v=[];for(let e=0;e<i;e+=1){let t=[];for(let n=0;n<i;n+=1){let r=Qk+n*44,i=$k+e*44,a=u(`g`,{class:`rdp-cell`}),o=u(`rect`,{class:`rdp-cell__box`,x:r,y:i,width:eA,height:eA,rx:5}),s=u(`text`,{class:`rdp-cell__num`,x:r+eA/2,y:i+eA/2});s.textContent=String(l[e][n].value),a.append(o,s),m.appendChild(a),t.push({g:a,box:o})}v.push(t)}for(let e=0;e<i;e+=1){let t=u(`text`,{class:`rdp-idx`,x:Qk+e*44+eA/2,y:$k-14});t.textContent=String(e+1);let n=u(`text`,{class:`rdp-idx`,x:Qk-14,y:$k+e*44+eA/2});n.textContent=String(e+1),h.append(t,n)}let y=u(`text`,{class:`rdp-lbl`,x:tA,y:$k-14});y.textContent=`每个输出的前像（来源状态）`,h.appendChild(y);let b=Math.ceil(a/2),x=[];for(let e=1;e<=a;e+=1){let t=e%2==1?0:1,n=Math.floor((e-1)/2),r=tA+t*150,i=$k+n*32,a=u(`g`,{class:`rdp-legend`}),o=u(`rect`,{class:`rdp-legend__box`,x:r,y:i,width:134,height:26,rx:6}),s=u(`text`,{class:`rdp-legend__t`,x:r+12,y:i+26/2}),c=u(`text`,{class:`rdp-legend__count`,x:r+134-12,y:i+26/2,"text-anchor":`end`});a.append(o,s,c),h.appendChild(a),x.push({g:a,box:o,t:s,count:c})}let S=u(`text`,{class:`rdp-note2`,x:tA,y:$k+b*32+26}),C=u(`text`,{class:`rdp-note2`,x:tA,y:$k+b*32+50});h.append(S,C),h.appendChild(u(`rect`,{class:`rdp-banner__box`,x:26,y:nA,width:608,height:rA,rx:9}));let w=u(`text`,{class:`rdp-banner__text`,x:660/2,y:412});h.appendChild(w);let T=u(`text`,{class:`rdp-phase__text`,x:660/2,y:iA});h.appendChild(T);let E=document.createElement(`p`);E.className=`viz__desc`,E.setAttribute(`aria-live`,`polite`);function D(e,t){if(!t)return;let n=t.revealed;v.forEach((e,t)=>{e.forEach((e,r)=>{let i=l[t][r],a=[`rdp-cell`];if(!i.accepted){a.push(`rdp-cell--reject`),e.g.setAttribute(`class`,a.join(` `)),e.box.setAttribute(`fill`,``);return}i.output!==null&&i.output<=n?(a.push(`is-colored`),e.box.setAttribute(`fill`,oA[(i.output-1)%oA.length]),i.output===n&&a.push(`is-live`)):(a.push(`rdp-cell--pending`),e.box.setAttribute(`fill`,``)),e.g.setAttribute(`class`,a.join(` `))})}),x.forEach((e,r)=>{let i=r+1,a=i<=n,o=oA[(i-1)%oA.length];e.box.setAttribute(`class`,`rdp-legend__box`+(a?` is-on`:``)),e.box.style.fill=a?o:``,e.box.style.stroke=a?o:``,e.t.style.fill=a?`#ffffff`:`#9aa39c`,e.count.style.fill=a?`#ffffff`:`#9aa39c`,e.t.textContent=`输出 ${i}`,e.count.textContent=`×${t.counts[r]}`});let r=t.counts.reduce((e,t)=>e+t,0);S.textContent=`已点亮 ${r}/${s} 格；每组恰好 ${c} 格`,C.textContent=`拒绝 ${o-s} 格 → 重掷，不影响分布`,t.phase===`init`?(w.textContent=`全暗：${o} 个等概率状态，${s} 个会被接受（接下来按输出逐组点亮）`,w.setAttribute(`class`,`rdp-banner__text`)):t.phase===`reveal`?(w.textContent=`点亮输出 ${n} 的 ${c} 个来源状态`,w.setAttribute(`class`,`rdp-banner__text is-ok`)):(w.textContent=`${s} 格 ÷ ${a} 组 = 每组 ${c} 格，零重叠零遗漏 → 均匀性得证`,w.setAttribute(`class`,`rdp-banner__text is-ok`)),t.phase===`init`?T.textContent=`证明的关键：不是「看起来均匀」，而是「每组格子数严格相等」`:t.phase===`reveal`?T.textContent=`解 (v−1) % 10 + 1 = k 且 v ≤ 40 —— 每组恰好 4 个解`:T.textContent=`拒绝只影响期望次数，不影响条件分布：重掷独立同分布`,Z(E,t.desc)}d.appendChild(E);let O=Q();d.appendChild(O.root),e.textContent=``,e.appendChild(d),X();let k=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,A=$({steps:n,controls:O,intervalMs:aA,onRender:D});A.jumpTo(Math.trunc(t.initialStep)||0);let j=null;return r&&!k&&typeof IntersectionObserver==`function`&&(j=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){j.disconnect(),j=null,A.play();return}},{threshold:.35}),j.observe(d)),{destroy(){j&&=(j.disconnect(),null),A.destroy(),e.textContent=``,delete e.dataset.rand10UniformMounted,document.getElementById(Xk)?.remove()}}}var uA=`55128921`;function dA(e,t){return e.charCodeAt(0)-48+(t.charCodeAt(0)-48)}function fA(e={}){let t=typeof e.s==`string`?e.s:uA,n=Array.from(t),r=n.length,i=[],a=(e,a,o={})=>{i.push({phase:e,desc:a,s:t,chars:n,n:r,i:null,ch:null,topIdx:null,topCh:null,stack:[],eliminated:null,gone:[],pops:0,result:null,done:e===`done`,...o})};a(`init`,`给了数字串 \`${t}\`（\`${r}\` 个字符）。规则：**相邻两数之和为 10 就可以消除**，消除后两边接在一起继续检查。\`1~9\` 里每个数字只有**一个**补数（\`d\` 配 \`10-d\`，\`5\` 配自己），所以新数字只需要看栈顶：互补就一起消失，否则入栈。栈里存的就是**当前串约化后的形态** —— 题面那句"两边接在一起"，本质就是"弹掉栈顶"，不用真的去拼接字符串。下面从 \`s[0]\` 开始逐位扫描。`);let o=[],s=[],c=0;for(let e=0;e<r;e+=1){let t=n[e],r=o.length>0?o[o.length-1]:null,i=r===null?null:n[r];if(r!==null&&dA(i,t)===10){o.pop(),s.push(r,e),c+=1;let l=o.length>0?n[o[o.length-1]]:null;a(`pop`,`\`s[${e}] = "${t}"\`：栈顶是 \`"${i}"\`（下标 ${r}）—— \`${i} + ${t} = 10\`，**两个一起消失**。`+(l===null?`弹出后栈空了 —— 左边已经没有任何没消掉的数字。`:`弹出后新的栈顶是 \`"${l}"\` —— 这就是"两边接在一起"：下标 ${r} 被消掉后，它左边的数字直接跟后面的字符相邻了，**栈自动完成这件事**。`),{i:e,ch:t,topIdx:r,topCh:i,stack:o.slice(),eliminated:[r,e],gone:s.slice(),pops:c});continue}o.push(e);let l=i===null?null:dA(i,t);a(`push`,i===null?`\`s[${e}] = "${t}"\`：栈空 —— 左边没有还没消掉的数字跟它配，**入栈**。`:`\`s[${e}] = "${t}"\`：栈顶 \`"${i}"\`（下标 ${r}）—— \`${i} + ${t} = ${l}\`（≠ 10），消不掉，\`"${t}"\` **入栈**，成为新的栈顶。`,{i:e,ch:t,topIdx:r,topCh:i,stack:o.slice(),gone:s.slice(),pops:c})}let l=o.map(e=>n[e]).join(``);return a(`done`,`\`${r}\` 个字符扫完，栈里剩下 \`${l}\`（长度 \`${r} - 2 × ${c} = ${l.length}\`）：一共消掉 \`${c}\` 对。剩下的串里**没有任何相邻互补对**，已经消无可消（不可约形）。而且这个结果是**唯一**的 —— 不管按什么顺序消，都会停在这里（临界对 \`a b a\` 两种消法都剩 \`a\`，加上每步必减 2 的终止性）。所以"最短剩余长度"就是 \`${l.length}\`，不用搜索。`,{i:r>0?r-1:null,ch:r>0?n[r-1]:null,stack:o.slice(),gone:s.slice(),pops:c,result:l,done:!0}),i}var pA=`elimsum10-styles`,mA=30,hA=52,gA=46,_A=112,vA=38,yA=8,bA=336,xA=88,SA=6,CA=150,wA=290,TA=170,EA=344,DA=150,OA=362,kA=388,AA=1250,jA=`
.elv {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.elv__svg { width: 100%; height: auto; display: block; }

.elv-note {
  fill: var(--elv-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.elv-banner__box {
  fill: var(--elv-banner, #f4f3ef);
  stroke: var(--elv-line, #c3c9c2);
  stroke-width: 1.5;
}
.elv-banner__op {
  fill: var(--elv-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.elv-banner__ret {
  fill: var(--elv-gold, #c2872f);
  font-size: 15px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 输入串的格子 */
.elv-chip__box {
  fill: var(--elv-fill, #ffffff);
  stroke: var(--elv-line, #c3c9c2);
  stroke-width: 1.5;
}
.elv-chip__val {
  fill: var(--elv-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.elv-chip__idx {
  fill: var(--elv-dim, #9aa39c);
  font-size: 9.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 当前扫到的字符：金框 */
.elv-chip.is-cur .elv-chip__box {
  fill: var(--elv-gold-fill, #fdf3e3);
  stroke: var(--elv-gold, #c2872f);
  stroke-width: 3;
}
.elv-chip.is-cur .elv-chip__val { fill: var(--elv-gold, #c2872f); }
/* 栈顶（左边最后一个还在的数字）：绿框 */
.elv-chip.is-top .elv-chip__box {
  stroke: var(--elv-ok, #3f6b57);
  stroke-width: 3;
}
.elv-chip.is-top .elv-chip__val { fill: var(--elv-ok, #3f6b57); }
/* 已被消掉：灰虚线 */
.elv-chip.is-gone .elv-chip__box {
  fill: none;
  stroke: var(--elv-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.5;
}
.elv-chip.is-gone .elv-chip__val { fill: var(--elv-dim, #9aa39c); }
/* 本帧被消掉：红虚线 */
.elv-chip.is-elim .elv-chip__box {
  fill: none;
  stroke: var(--elv-hot, #a45f45);
  stroke-dasharray: 4 3;
  stroke-width: 3;
}
.elv-chip.is-elim .elv-chip__val { fill: var(--elv-hot, #a45f45); }
.elv-chip.is-dim { opacity: 0.55; }

/* 栈格 */
.elv-cell__box {
  fill: var(--elv-fill, #ffffff);
  stroke: var(--elv-line, #c3c9c2);
  stroke-width: 1.5;
}
.elv-cell__val {
  fill: var(--elv-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.elv-cell__sub {
  fill: var(--elv-dim, #9aa39c);
  font-size: 10px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.elv-cell.is-top .elv-cell__box {
  stroke: var(--elv-ok, #3f6b57);
  stroke-width: 3;
}
.elv-cell.is-top .elv-cell__val { fill: var(--elv-ok, #3f6b57); }
.elv-cell.is-fresh .elv-cell__box {
  fill: var(--elv-gold-fill, #fdf3e3);
  stroke: var(--elv-gold, #c2872f);
  stroke-width: 3;
}
.elv-cell.is-fresh .elv-cell__val { fill: var(--elv-gold, #c2872f); }
.elv-cell.is-ghost .elv-cell__box {
  fill: none;
  stroke: var(--elv-hot, #a45f45);
  stroke-dasharray: 4 3;
  stroke-width: 2.5;
}
.elv-cell.is-ghost .elv-cell__val { fill: var(--elv-hot, #a45f45); }
.elv-cell.is-ghost .elv-cell__sub { fill: var(--elv-hot, #a45f45); }
.elv-cell.is-empty .elv-cell__box {
  fill: none;
  stroke: var(--elv-line, #c3c9c2);
  stroke-dasharray: 2 4;
  stroke-width: 1;
}

.elv-panel__box {
  fill: var(--elv-banner, #f4f3ef);
  stroke: var(--elv-line, #c3c9c2);
  stroke-width: 1.5;
}
.elv-panel__label {
  fill: var(--elv-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.elv-panel__value {
  fill: var(--elv-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.elv-panel__value.is-ok { fill: var(--elv-ok, #3f6b57); }
.elv-panel__value.is-hot { fill: var(--elv-hot, #a45f45); }

.elv-label {
  fill: var(--elv-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.elv-floor {
  stroke: var(--elv-line, #c3c9c2);
  stroke-width: 2;
}
.elv-phase__text {
  fill: var(--elv-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function MA(){if(document.getElementById(pA))return;let e=document.createElement(`style`);e.id=pA,e.textContent=jA,document.head.appendChild(e)}function NA(e,t={}){if(!e||e.dataset.elimsum10Mounted===`1`)return{destroy(){}};e.dataset.elimsum10Mounted=`1`,MA();let n=fA(t),r=t.autoplay!==!1,i=n[0],a=i.chars,o=i.n,s=Y,c=document.createElement(`div`);c.className=`viz elv`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);let u=Math.max(1,...n.map(e=>e.stack.length))+1,d=Math.min(46,Math.floor((bA-TA-(u-1)*SA)/u)),f=s(`svg`,{class:`viz__svg elv__svg`,viewBox:`0 0 660 412`,role:`img`,"aria-label":`相邻和为 10 消除 栈模拟动画`});l.appendChild(f);let p=s(`g`,{class:`elv-strip`}),m=s(`g`,{class:`elv-cells`}),h=s(`g`,{class:`elv-marks`});f.appendChild(m),f.appendChild(p),f.appendChild(h);let g=s(`text`,{class:`elv-note`,x:26,y:mA});g.textContent=`补数配对：1↔9  2↔8  3↔7  4↔6  5↔5 —— 栈顶和新数字互补就一起消失`,h.appendChild(g),h.appendChild(s(`rect`,{class:`elv-banner__box`,x:26,y:hA,width:608,height:gA,rx:9}));let _=s(`text`,{class:`elv-banner__op`,x:44,y:75}),v=s(`text`,{class:`elv-banner__ret`,x:616,y:75});h.appendChild(_),h.appendChild(v);let y=o*vA+Math.max(0,o-1)*yA,b=Math.max(26,(660-y)/2),x=a.map((e,t)=>{let n=b+t*46,r=s(`g`,{class:`elv-chip`});r.appendChild(s(`rect`,{class:`elv-chip__box`,x:n,y:_A,width:vA,height:vA,rx:6}));let i=s(`text`,{class:`elv-chip__val`,x:n+vA/2,y:127}),a=s(`text`,{class:`elv-chip__idx`,x:n+vA/2,y:142});return a.textContent=String(t),r.appendChild(i),r.appendChild(a),p.appendChild(r),{g:r,val:i}}),S=[];for(let e=0;e<u;e+=1){let t=s(`g`,{class:`elv-cell`}),n=bA-(e+1)*d-e*SA;t.appendChild(s(`rect`,{class:`elv-cell__box`,x:CA-xA/2,y:n,width:xA,height:d,rx:6}));let r=s(`text`,{class:`elv-cell__val`,x:CA,y:n+d/2-5}),i=s(`text`,{class:`elv-cell__sub`,x:CA,y:n+d-9});t.appendChild(r),t.appendChild(i),m.appendChild(t),S.push({g:t,val:r,sub:i})}h.appendChild(s(`line`,{class:`elv-floor`,x1:CA-xA/2-10,y1:bA,x2:204,y2:bA}));let C=s(`text`,{class:`elv-label`,x:CA,y:OA});C.textContent=`栈（底 → 顶）`,h.appendChild(C),h.appendChild(s(`rect`,{class:`elv-panel__box`,x:wA,y:TA,width:EA,height:DA,rx:10}));let w=[{label:`本帧判定`,y:210,key:`verdict`},{label:`已消对数`,y:246,key:`pops`},{label:`剩余长度`,y:282,key:`len`}].map(e=>{let t=s(`text`,{class:`elv-panel__label`,x:308,y:e.y});t.textContent=e.label;let n=s(`text`,{class:`elv-panel__value`,x:616,y:e.y});return h.appendChild(t),h.appendChild(n),{...e,value:n}}),T=s(`text`,{class:`elv-phase__text`,x:660/2,y:kA});h.appendChild(T);let E=document.createElement(`p`);E.className=`viz__desc`,E.setAttribute(`aria-live`,`polite`);function D(e,t){if(!t)return;let n=new Set(t.gone),r=new Set(t.eliminated||[]),i=t.stack.length>0?t.stack[t.stack.length-1]:null,s=t.phase===`done`;x.forEach((e,o)=>{let c=[`elv-chip`];s&&c.push(`is-dim`),n.has(o)&&c.push(`is-gone`),i===o&&!s&&c.push(`is-top`),t.i===o&&!s&&c.push(`is-cur`),r.has(o)&&c.push(`is-elim`),e.g.setAttribute(`class`,c.join(` `)),e.val.textContent=a[o]});let c=t.stack;if(S.forEach((e,n)=>{let r=[`elv-cell`];n<c.length?(e.val.textContent=a[c[n]],e.sub.textContent=n===0?`#${c[n]} 底`:`#${c[n]}`,n===c.length-1&&!s&&r.push(`is-top`),t.phase===`push`&&n===c.length-1&&r.push(`is-fresh`)):t.phase===`pop`&&n===c.length?(e.val.textContent=t.topCh,e.sub.textContent=`弹出`,r.push(`is-ghost`)):(e.val.textContent=``,e.sub.textContent=``,r.push(`is-empty`)),e.g.setAttribute(`class`,r.join(` `))}),t.phase===`init`)_.textContent=`相邻和为 10 就消除：栈顶互补就弹出`,v.textContent=`${o} 个字符`;else if(s)_.textContent=`${o} 个字符扫完`,v.textContent=`结果 "${t.result}"`;else{_.textContent=`s[${t.i}] = "${t.ch}"`;let e=t.topCh===null?null:Number(t.topCh)+Number(t.ch);t.phase===`pop`?v.textContent=`${t.topCh} + ${t.ch} = 10 → 消`:v.textContent=t.topCh===null?`栈空 → 入栈`:`${t.topCh} + ${t.ch} = ${e} ≠ 10 → 入栈`}let l=t.topCh===null?null:Number(t.topCh)+Number(t.ch);w[0].value.textContent=s?`"${t.result}"`:t.phase===`pop`?`${t.topCh} + ${t.ch} = 10`:t.topCh===null?`栈空`:`${t.topCh} + ${t.ch} = ${l}`,w[0].value.setAttribute(`class`,`elv-panel__value ${t.phase===`pop`?`is-hot`:s?`is-ok`:``}`),w[1].value.textContent=String(t.pops),w[2].value.textContent=String(c.length),t.phase===`init`?T.textContent=`每个数字只有一个补数 —— 这是"结果唯一"的根源`:t.phase===`pop`?T.textContent=`两个一起消失；弹出后新栈顶就是"左边接过来的数字"`:t.phase===`push`?T.textContent=`消不掉 → 入栈，成为新的栈顶（一个数字最多消一个栈顶）`:T.textContent=`结果不可约、且与消除顺序无关 —— 所以"最短长度"就是 ${t.result.length}`,Z(E,t.desc)}c.appendChild(E);let O=Q();c.appendChild(O.root),e.textContent=``,e.appendChild(c),X();let k=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,A=$({steps:n,controls:O,intervalMs:AA,onRender:D});A.jumpTo(Math.trunc(t.initialStep)||0);let j=null;return r&&!k&&typeof IntersectionObserver==`function`&&(j=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){j.disconnect(),j=null,A.play();return}},{threshold:.35}),j.observe(c)),{destroy(){j&&=(j.disconnect(),null),A.destroy(),e.textContent=``,delete e.dataset.elimsum10Mounted,document.getElementById(pA)?.remove()}}}var PA=`191191`;function FA(e,t){return e.charCodeAt(0)-48+(t.charCodeAt(0)-48)}function IA(e,t){let n=[],r=e.map((e,t)=>t),i=null;for(;;){let a=[];for(let t=0;t+1<r.length;t+=1)FA(e[r[t]],e[r[t+1]])===10&&a.push(t);let o=a.length===0;if(n.push({alive:r.slice(),removed:i,done:o,steps:n.length}),o)break;let s=t?a[0]:a[a.length-1];i=[r[s],r[s+1]],r=r.filter((e,t)=>t!==s&&t!==s+1)}return n}var LA=(e,t)=>t.alive.map(t=>e[t]).join(``);function RA(e={}){let t=typeof e.s==`string`?e.s:PA,n=Array.from(t),r=n.length,i=IA(n,!0),a=IA(n,!1),o=[],s=(e,s,c={})=>{o.push({phase:e,desc:s,s:t,chars:n,n:r,turn:null,a:i[0],b:a[0],converged:null,result:null,done:e===`done`,...c})};s(`init`,`同一个串 \`${t}\`，两条路线并排跑：**A 每次消最左边那一对**，**B 每次消最右边那一对**。这两条路线一开始就分道扬镳（可消的对互相重叠 —— 比如开头的 \`191\`，先消左边的 \`1 9\` 还是先消右边的 \`9 1\`，剩下的形态不同）。题面能放心地问"最后剩下的串"，靠的就是两条路线**最后会撞在同一个地方**。`);let c=0,l=0;for(;c<i.length-1||l<a.length-1;){if(c<i.length-1){c+=1;let e=i[c],[t,r]=e.removed;s(`step`,`**路线 A**（消最左）：消掉 \`${n[t]}\`（下标 ${t}）和 \`${n[r]}\`（下标 ${r}）—— \`${n[t]} + ${n[r]} = 10\`。剩下的串是 \`${LA(n,e)}\`。注意它出现的**位置**：被消掉的两个字符不在串尾，消完两边立刻接上。`,{turn:`A`,a:e,b:a[l]})}if(l<a.length-1){l+=1;let e=a[l],[t,r]=e.removed;s(`step`,`**路线 B**（消最右）：消掉 \`${n[t]}\`（下标 ${t}）和 \`${n[r]}\`（下标 ${r}）—— \`${n[t]} + ${n[r]} = 10\`。剩下的串是 \`${LA(n,e)}\`。同一时刻 A 停在中途形态 \`${LA(n,i[c])}\` —— **两条路线的中途形态并不一样**。`,{turn:`B`,a:i[c],b:e})}}let u=i[i.length-1],d=a[a.length-1],f=LA(n,u),p=LA(n,d),m=f===p;return s(`done`,m?`两条路线都消无可消了：**A 停在 \`${f}\`，B 停在 \`${p}\` —— 完全一样**。A 消了 \`${u.steps}\` 对、B 消了 \`${d.steps}\` 对，次数相同、终点相同。这不是巧合：每一步恰好删 2 个字符（终止），而唯一会互相干扰的形态是临界对 \`a b a\`（\`a + b = 10\`）—— 先消左边那对还是右边那对，剩下的都是 \`a\`。所以"最后剩下的串"没有歧义，"最短剩余长度"就是 \`${f.length}\`，栈模拟给的就是它。`:`两条路线停在了不同的串上：A = \`${f}\`、B = \`${p}\` —— 说明这个规则**不合流**，题目就得改成"求最短"的搜索问题了。`,{turn:null,a:u,b:d,converged:m,result:m?f:null,done:!0}),o}var zA=`elimsum10order-styles`,BA=28,VA=38,HA=6,UA=150,WA=634,GA=84,KA=192,qA=26,JA=276,YA=52,XA=1400,ZA=`
.evo {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.evo__svg { width: 100%; height: auto; display: block; }

.evo-note {
  fill: var(--evo-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.evo-row__label {
  fill: var(--evo-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.evo-row.is-turn .evo-row__label { fill: var(--evo-gold, #c2872f); }
.evo-row__summary {
  fill: var(--evo-ink, #1f2a24);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.evo-chip__box {
  fill: var(--evo-fill, #ffffff);
  stroke: var(--evo-line, #c3c9c2);
  stroke-width: 1.5;
}
.evo-chip__val {
  fill: var(--evo-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.evo-chip__idx {
  fill: var(--evo-dim, #9aa39c);
  font-size: 9.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 本帧被消掉：红虚线 */
.evo-chip.is-elim .evo-chip__box {
  fill: none;
  stroke: var(--evo-hot, #a45f45);
  stroke-dasharray: 4 3;
  stroke-width: 3;
}
.evo-chip.is-elim .evo-chip__val { fill: var(--evo-hot, #a45f45); }
/* 更早消掉：灰虚线 */
.evo-chip.is-gone .evo-chip__box {
  fill: none;
  stroke: var(--evo-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.5;
}
.evo-chip.is-gone .evo-chip__val { fill: var(--evo-dim, #9aa39c); }
.evo-chip.is-gone { opacity: 0.8; }
/* 终态还活着：绿框 */
.evo-chip.is-end .evo-chip__box {
  fill: var(--evo-ok-fill, #eef4ef);
  stroke: var(--evo-ok, #3f6b57);
  stroke-width: 3;
}
.evo-chip.is-end .evo-chip__val { fill: var(--evo-ok, #3f6b57); }

.evo-card__box {
  fill: var(--evo-banner, #f4f3ef);
  stroke: var(--evo-line, #c3c9c2);
  stroke-width: 1.5;
}
.evo-card__title {
  fill: var(--evo-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.evo-card__value {
  fill: var(--evo-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.evo-card__value.is-ok { fill: var(--evo-ok, #3f6b57); }
.evo-card__value.is-hot { fill: var(--evo-hot, #a45f45); }
`;function QA(){if(document.getElementById(zA))return;let e=document.createElement(`style`);e.id=zA,e.textContent=ZA,document.head.appendChild(e)}var $A=(e,t)=>t.alive.map(t=>e[t]).join(``);function ej(e,t={}){if(!e||e.dataset.elimsum10OrderMounted===`1`)return{destroy(){}};e.dataset.elimsum10OrderMounted=`1`,QA();let n=RA(t),r=t.autoplay!==!1,i=n[0],a=i.chars,o=i.n,s=Y,c=document.createElement(`div`);c.className=`viz evo`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);let u=s(`svg`,{class:`viz__svg evo__svg`,viewBox:`0 0 660 344`,role:`img`,"aria-label":`相邻和为 10 消除 两种消法对比动画`});l.appendChild(u);let d=s(`text`,{class:`evo-note`,x:26,y:BA});d.textContent=`同一个串、两种消法：A 每次消最左那一对，B 每次消最右那一对`,u.appendChild(d);let f=Math.min(34,Math.floor((WA-UA-(o-1)*HA)/Math.max(1,o))),p=(e,t,n)=>{let r=s(`g`,{class:`evo-row ${n}`}),i=s(`text`,{class:`evo-row__label`,x:qA,y:e+VA/2});i.textContent=t,r.appendChild(i);let c=[];for(let t=0;t<o;t+=1){let n=s(`g`,{class:`evo-chip`}),i=UA+t*(f+HA);n.appendChild(s(`rect`,{class:`evo-chip__box`,x:i,y:e,width:f,height:VA,rx:5}));let o=s(`text`,{class:`evo-chip__val`,x:i+f/2,y:e+VA/2-5});o.textContent=a[t],n.appendChild(o);let l=s(`text`,{class:`evo-chip__idx`,x:i+f/2,y:e+VA-9});l.textContent=String(t),n.appendChild(l),r.appendChild(n),c.push(n)}let l=s(`text`,{class:`evo-row__summary`,x:UA,y:e+VA+18});return r.appendChild(l),u.appendChild(r),{g:r,chips:c,summary:l}},m=p(GA,`A 消最左`,`evo-row--a`),h=p(KA,`B 消最右`,`evo-row--b`);u.appendChild(s(`rect`,{class:`evo-card__box`,x:26,y:JA,width:608,height:YA,rx:9}));let g=s(`text`,{class:`evo-card__title`,x:660/2,y:293}),_=s(`text`,{class:`evo-card__value`,x:660/2,y:313});u.appendChild(g),u.appendChild(_);let v=document.createElement(`p`);v.className=`viz__desc`,v.setAttribute(`aria-live`,`polite`);function y(e,t,n,r,i,o){let s=new Set(t.alive),c=new Set(n&&t.removed||[]);e.chips.forEach((e,t)=>{let n=[`evo-chip`];c.has(t)?n.push(`is-elim`):s.has(t)?i&&o&&n.push(`is-end`):n.push(`is-gone`),e.setAttribute(`class`,n.join(` `))}),e.g.setAttribute(`class`,`evo-row ${e===m?`evo-row--a`:`evo-row--b`}${r?` is-turn`:``}`),e.summary.textContent=`当前串 "${$A(a,t)}" · 已消 ${t.steps} 对${t.done?` · 消无可消`:``}`}function b(e,t){if(!t)return;let n=t.phase===`done`,r=t.converged===!0;y(m,t.a,t.turn===`A`,t.turn===`A`,n,r),y(h,t.b,t.turn===`B`,t.turn===`B`,n,r),n?(g.textContent=r?`两条路线的终点`:`两条路线的终点（不相同 —— 规则不合流）`,_.textContent=r?`相同："${t.result}" —— 消除顺序不影响结果`:`A "${$A(a,t.a)}" ≠ B "${$A(a,t.b)}"`,_.setAttribute(`class`,`evo-card__value ${r?`is-ok`:`is-hot`}`)):(g.textContent=`本帧走的路线`,_.textContent=t.turn===`A`?`A：消最左边那一对`:`B：消最右边那一对`,_.setAttribute(`class`,`evo-card__value`)),Z(v,t.desc)}c.appendChild(v);let x=Q();c.appendChild(x.root),e.textContent=``,e.appendChild(c),X();let S=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,C=$({steps:n,controls:x,intervalMs:XA,onRender:b});C.jumpTo(Math.trunc(t.initialStep)||0);let w=null;return r&&!S&&typeof IntersectionObserver==`function`&&(w=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){w.disconnect(),w=null,C.play();return}},{threshold:.35}),w.observe(c)),{destroy(){w&&=(w.disconnect(),null),C.destroy(),e.textContent=``,delete e.dataset.elimsum10OrderMounted,document.getElementById(zA)?.remove()}}}var tj=[5,1,2,20,20,3],nj=[[0,1,2],[1,2,2],[2,5,2],[0,3,1],[3,4,1],[4,5,1]],rj=5,ij=1/0;function aj(e={}){let t=Array.isArray(e.fees)&&e.fees.length>=2?e.fees:e.fees===void 0?void 0:e.fees,n;n=Array.isArray(t)&&t.length>=2?t.map(e=>typeof e==`number`&&Number.isFinite(e)&&e>=0?Math.trunc(e):0):[...tj];let r=n.length,i=Array.isArray(e.edges)?e.edges:[],a=[];for(let e of i){if(!Array.isArray(e)||e.length<3)continue;let[t,n,i]=e;!Number.isInteger(t)||!Number.isInteger(n)||!Number.isInteger(i)||t<0||t>=r||n<0||n>=r||t===n||i<1||a.push([t,n,i])}let o=nj.filter(([e,t])=>e<r&&t<r).map(e=>[...e]),s=Number.isInteger(e.maxTime)&&e.maxTime>=1?e.maxTime:rj;return{n:r,fees:n,edges:a.length>0?a:o,maxTime:s}}function oj(e={}){let{n:t,fees:n,edges:r,maxTime:i}=aj(e),a=t-1,o=Array.from({length:t},()=>[]);r.forEach(([e,t,n])=>{o[e].push({to:t,time:n}),o[t].push({to:e,time:n})});let s=Array.from({length:i+1},()=>Array(t).fill(ij)),c=Array.from({length:i+1},()=>Array(t).fill(null));s[0][0]=n[0];let l=a===0?n[0]:ij,u=a===0?0:-1,d=0,f=[],p=e=>e.map(e=>e.slice()),m=(e,o,c={})=>{f.push({phase:e,desc:o,n:t,maxTime:i,fees:[...n],edges:r.map(e=>[...e]),target:a,t:-1,v:-1,u:-1,et:0,arr:-1,from:ij,cand:ij,old:ij,improved:!1,prevDp:p(s),dp:p(s),best:l,bestT:u,cutCount:d,answer:l===ij?-1:l,chain:[],cities:[],done:e===`done`,...c})};m(`init`,`给 ${t} 座城市（\`0..${a}\`）、无向边 ${r.map(([e,t,n])=>`\`${e}—${t}(${n})\``).join(`、`)}，以及每座城市的通行费 \`[${n.join(`, `)}]\`。每条边**只有时间、没有花费**；每**经过**一座城市要付一次它的通行费，**含起点与终点**。问从 \`0\` 走到 \`${a}\`、总时间 **≤ maxTime = ${i}** 时，最少要付多少通行费。定义分层图的格子 \`dp[t][v]\` = **恰好在时刻 \`t\` 到达城市 \`v\`** 的最小通行费：底座 \`dp[0][0] = fees[0] = ${n[0]}\`（起点也要付），其余全是 \`∞\`。按 \`t\` **正序**逐层向外松弛所有边 —— 已经知道"t 时刻在 v、花了多少"，再走一条耗时 \`et\` 的边到 \`u\`，就要多付 \`u\` 的通行费：\`dp[t + et][u] = min( dp[t + et][u], dp[t][v] + fees[u] )\`。答案取 \`min over t ≤ ${i} of dp[t][${a}]\`（都到不了就是 -1）。还有一条：\`arr = t + et > maxTime\` 的松弛**直接剪掉、不进入后续层** —— 时间只能往前走、不会回头，迟到就是迟到（动画里这些被剪掉的松弛不进帧，只累加到统计面板的"已剪枝"计数上）。**为什么非要二维**：一维的 \`dp[v]\` 只记"到 v 的最少花费"，会忘掉"是第几时刻到的" —— 而时间不能被压缩，"便宜但超时"和"贵但达标"是两条不能互相顶替的路。`);for(let e=0;e<=i;e+=1)for(let r=0;r<t;r+=1)if(s[e][r]!==ij)for(let{to:t,time:f}of o[r]){let o=e+f,h=s[e][r],g=h+n[t];if(o>i){d+=1;continue}let _=s[o][t],v=g<_,y=p(s);v&&(s[o][t]=g,c[o][t]={t:e,v:r},t===a&&g<l&&(l=g,u=o));let b=_===ij?`∞（这一格从没到过）`:`\`${_}\``;m(`relax`,v?`城市 **${r}** 在 **t = ${e}** 的花费是 \`${h}\`。走边 \`${r} → ${t}\`（耗 **${f}** 分钟）在 **t' = ${o}** 到达城市 **${t}**，加上它的通行费 \`fees[${t}] = ${n[t]}\` 得 \`${h} + ${n[t]} = ${g}\`。原来这一格是 ${b}，**${g} < ${_===ij?`∞`:_}**，于是刷新成 \`${g}\``+(t===a?`，同时把当前答案压到 \`${l}\`（**min over t of dp[t][${a}]** 又降了一档）。`:`。`):`城市 **${r}** 在 **t = ${e}** 的花费是 \`${h}\`。走边 \`${r} → ${t}\`（耗 **${f}** 分钟）在 **t' = ${o}** 到达城市 **${t}**，算得 \`${h} + ${n[t]} = ${g}\`，但这一格已经是 ${b}、**不比我更差**。这一趟走得更晚还更贵，作废，格子保持原值。`,{t:e,v:r,u:t,et:f,arr:o,from:h,cand:g,old:_,improved:v,prevDp:y})}let h=[];if(u>=0&&s[u][a]!==ij){let e=u,t=a,n=[{t:e,v:t}],r=i+2;for(;!(e===0&&t===0)&&r>0;){let i=c[e][t];if(!i)break;n.push({t:i.t,v:i.v}),e=i.t,t=i.v,--r}n.reverse(),h.push(...n)}let g=h.map(e=>e.v);return m(`done`,(l===ij?`扫描完所有时刻，\`dp[t][${a}]\` 在 \`t ≤ ${i}\` 内始终是 \`∞\` —— **返回 -1**：在时间窗内根本走不到终点。注意这不是"最贵"的问题，是"无解"。`:`返回 **${l}**：在 \`t ≤ ${i}\` 里，\`dp[t][${a}]\` 的最小值出现在 \`t = ${u}\`，值 \`${l}\`。沿前驱表从 \`(${u}, ${a})\` 回溯到 \`(0, 0)\`，状态链 \`${h.map(e=>`(${e.t},${e.v})`).join(` → `)}\`，城市序列 \`${g.join(` → `)}\`，途中共付 \`${n[g[0]]}${g.slice(1).map(e=>` + ${n[e]}`).join(``)} = ${l}\` 的通行费。`)+'回头对照 LC 322 零钱兑换：那里 `dp[x]` 是**一维**的（凑出金额 x 的最少枚数），因为"枚数"可以无限累加、彼此同质；而这里**时间是一个不能压缩的维度**，"什么时候到"决定了"还能不能赶上截止"，所以状态必须把时刻一并带上 —— 这正是**分层图**与普通最短路的区别。',{chain:h,cities:g,done:!0}),f}var sj=`lc1928-styles`,cj=1e3,lj=680,uj=62,dj=22,fj=52,pj=66,mj=76,hj=38,gj=8,_j=8,vj=44,yj=58,bj=`
.lv8 { display: flex; flex-direction: column; gap: 14px; }
.lv8__svg { width: 100%; height: auto; display: block; }

.lv8-note {
  fill: var(--lv8-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-note--r { text-anchor: end; }

.lv8-lbl {
  fill: var(--lv8-muted, #657168); font-size: 11.5px;
  text-anchor: end; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-corner {
  fill: var(--lv8-dim, #9aa39c); font-size: 10.5px;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-hd1 {
  fill: var(--lv8-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-hd2 {
  fill: var(--lv8-dim, #9aa39c); font-size: 10px;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-hd1.is-tgt { fill: var(--lv8-gold, #c2872f); }
.lv8-hd2.is-tgt { fill: var(--lv8-gold, #c2872f); }

.lv8-band { fill: var(--lv8-gold-fill, #fdf3e3); opacity: 0.62; }

.lv8-cell__box {
  fill: var(--lv8-fill, #ffffff);
  stroke: var(--lv8-line, #c3c9c2);
  stroke-width: 1.5;
}
.lv8-cell__val {
  fill: var(--lv8-ink, #1f2a24);
  font-weight: 700; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 还没到达的格子：虚线 + 灰 ∞ */
.lv8-cell.is-inf .lv8-cell__box {
  fill: var(--lv8-dim-fill, #f6f5f1);
  stroke-dasharray: 4 3;
}
.lv8-cell.is-inf .lv8-cell__val { fill: var(--lv8-dim, #9aa39c); font-weight: 500; }
/* 已到达：白底实值 */
.lv8-cell.is-val .lv8-cell__box { fill: var(--lv8-ok-fill, #eef5f1); stroke: var(--lv8-ok, #3f6b57); }
.lv8-cell.is-val .lv8-cell__val { fill: var(--lv8-ok, #3f6b57); }
/* 底座 dp[0][0] */
.lv8-cell.is-base .lv8-cell__box { stroke: var(--lv8-gold, #c2872f); stroke-width: 3; }
/* 本帧的源格 */
.lv8-cell.is-cur .lv8-cell__box { stroke: var(--lv8-hot, #a45f45); stroke-width: 3.4; }
/* 本帧刷新的目标格 */
.lv8-cell.is-fresh .lv8-cell__box {
  fill: var(--lv8-gold-fill, #fdf3e3);
  stroke: var(--lv8-gold, #c2872f);
  stroke-width: 3.4;
}
.lv8-cell.is-fresh .lv8-cell__val { fill: var(--lv8-gold, #c2872f); }
/* 本帧看了但没改进的目标格 */
.lv8-cell.is-dup .lv8-cell__box { stroke: var(--lv8-hot, #a45f45); stroke-width: 2.4; stroke-dasharray: 4 3; }
/* done 帧回溯出的最优链 */
.lv8-cell.is-chain .lv8-cell__box { fill: var(--lv8-gold-fill, #fdf3e3); stroke: var(--lv8-gold, #c2872f); stroke-width: 2.4; }
.lv8-cell.is-chain .lv8-cell__val { fill: var(--lv8-gold, #c2872f); }

.lv8-edge__line {
  stroke: var(--lv8-hot, #a45f45); stroke-width: 2; fill: none;
  stroke-dasharray: 5 4;
}
.lv8-edge__head { fill: var(--lv8-hot, #a45f45); }

.lv8-ring {
  fill: none; stroke: var(--lv8-gold, #c2872f); stroke-width: 2.4;
  stroke-dasharray: 5 4; opacity: 0;
}
.lv8-ring.is-on { opacity: 1; }

.lv8-banner__box {
  fill: var(--lv8-banner, #f4f3ef);
  stroke: var(--lv8-line, #c3c9c2);
  stroke-width: 1.5;
}
.lv8-banner__text {
  fill: var(--lv8-hot, #a45f45); font-size: 13.5px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-banner__text.is-ok { fill: var(--lv8-ok, #3f6b57); }
.lv8-banner__text.is-gold { fill: var(--lv8-gold, #c2872f); }

.lv8-panel__box {
  fill: var(--lv8-fill, #ffffff);
  stroke: var(--lv8-line, #c3c9c2);
  stroke-width: 1.5;
}
.lv8-panel__label {
  fill: var(--lv8-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-panel__num {
  fill: var(--lv8-ink, #1f2a24); font-size: 16px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-panel__num.is-gold { fill: var(--lv8-gold, #c2872f); }
.lv8-panel__num.is-ok { fill: var(--lv8-ok, #3f6b57); }
.lv8-panel__num.is-dead { fill: var(--lv8-dim, #9aa39c); }

.lv8-phase__text {
  fill: var(--lv8-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function xj(){if(document.getElementById(sj))return;let e=document.createElement(`style`);e.id=sj,e.textContent=bj,document.head.appendChild(e)}var Sj=e=>e===1/0?`∞`:String(e);function Cj(e,t={}){if(!e||e.dataset.lc1928Mounted===`1`)return{destroy(){}};e.dataset.lc1928Mounted=`1`,xj();let n=oj(t),{n:r,maxTime:i,fees:a,target:o}=n[0],s=i+1,c=Y,l=document.createElement(`div`);l.className=`viz lv8`;let u=document.createElement(`div`);u.className=`viz__stage`,l.appendChild(u);let d=lj-uj-26,f=Math.min(84,Math.floor((d-(r-1)*_j)/r)),p=uj+(d-(r*f+(r-1)*_j))/2,m=e=>p+e*(f+_j),h=e=>mj+e*46,g=s*hj+(s-1)*gj,_=mj+g+16,v=_+vj+14,y=v+yj+18,b=y+22,x=Math.max(10,Math.min(16,Math.round(f/7.2))),S=c(`svg`,{class:`viz__svg lv8__svg`,viewBox:`0 0 ${lj} ${b}`,role:`img`,"aria-label":`规定时间内到达终点的最小花费 LC1928 分层图推演动画`}),C=c(`g`,{}),w=c(`g`,{}),T=c(`g`,{});S.append(C,w,T),u.appendChild(S);let E=c(`text`,{class:`lv8-note`,x:26,y:dj});E.textContent=`dp[t][v] = 恰好在时刻 t 到达城市 v 的最小通行费`,T.appendChild(E);let D=c(`text`,{class:`lv8-note lv8-note--r`,x:lj-26,y:dj});D.textContent=`${r} 座城市 · maxTime = ${i}`,T.appendChild(D),C.appendChild(c(`rect`,{class:`lv8-band`,x:m(o)-3,y:mj-4,width:f+6,height:g+8,rx:9}));let O=c(`text`,{class:`lv8-corner`,x:uj-16,y:fj});O.textContent=`t \\ v`,T.appendChild(O);for(let e=0;e<r;e+=1){let t=e===o,n=c(`text`,{class:`lv8-hd1${t?` is-tgt`:``}`,x:m(e)+f/2,y:fj});n.textContent=`城市 ${e}`;let r=c(`text`,{class:`lv8-hd2${t?` is-tgt`:``}`,x:m(e)+f/2,y:pj});r.textContent=`费 ${a[e]}`,T.append(n,r)}for(let e=0;e<s;e+=1){let t=c(`text`,{class:`lv8-lbl`,x:uj,y:h(e)+hj/2});t.textContent=`t = ${e}`,T.appendChild(t)}let k=[];for(let e=0;e<s;e+=1){let t=[];for(let n=0;n<r;n+=1){let r=c(`g`,{class:`lv8-cell`});r.appendChild(c(`rect`,{class:`lv8-cell__box`,x:m(n),y:h(e),width:f,height:hj,rx:6}));let i=c(`text`,{class:`lv8-cell__val`,x:m(n)+f/2,y:h(e)+hj/2,style:`font-size: ${x}px`});r.appendChild(i),w.appendChild(r),t.push({g:r,val:i})}k.push(t)}let A=c(`g`,{}),j=c(`path`,{class:`lv8-edge__line`,d:``}),M=c(`polygon`,{class:`lv8-edge__head`,points:``});A.append(j,M),A.style.display=`none`,T.appendChild(A);let N=c(`rect`,{class:`lv8-ring`,x:0,y:0,width:f+10,height:48,rx:9});T.appendChild(N),T.appendChild(c(`rect`,{class:`lv8-banner__box`,x:26,y:_,width:lj-52,height:vj,rx:9}));let P=c(`text`,{class:`lv8-banner__text`,x:lj/2,y:_+vj/2});T.appendChild(P),T.appendChild(c(`rect`,{class:`lv8-panel__box`,x:26,y:v,width:lj-52,height:yj,rx:9}));let F=(e,t)=>{let n=lj/2+(t-4/2)*116,r=c(`text`,{class:`lv8-panel__label`,x:n,y:v+16});r.textContent=e;let i=c(`text`,{class:`lv8-panel__num`,x:n,y:v+40});return T.append(r,i),i},I=F(`t`,0),L=F(`v → u`,1),R=F(`from → cand`,2),z=F(`已剪枝`,3),B=F(`答案`,4),V=c(`text`,{class:`lv8-phase__text`,x:lj/2,y});T.appendChild(V);let H=document.createElement(`p`);H.className=`viz__desc`,H.setAttribute(`aria-live`,`polite`);function U(e,t){if(!t)return;let{phase:n,dp:r,t:s,v:c,u:l,arr:u,from:d,cand:p,improved:g,cutCount:_,best:v,bestT:y,answer:b,chain:x}=t,S=n===`relax`,C=n===`done`,w=new Set((C?x:[]).map(e=>`${e.t}:${e.v}`));if(k.forEach((e,t)=>{e.forEach((e,n)=>{let i=r[t][n],a=[`lv8-cell`];i===1/0?a.push(`is-inf`):a.push(`is-val`),t===0&&n===0&&a.push(`is-base`),S&&t===s&&n===c&&a.push(`is-cur`),S&&t===u&&n===l&&a.push(g?`is-fresh`:`is-dup`),w.has(`${t}:${n}`)&&a.push(`is-chain`),e.g.setAttribute(`class`,a.join(` `)),e.val.textContent=Sj(i)})}),S){let e=m(c)+f/2,t=h(s)+hj,n=m(l)+f/2,r=h(u)-1,i=r-t;j.setAttribute(`d`,`M ${e.toFixed(1)} ${t.toFixed(1)} C ${e.toFixed(1)} ${(t+i*.45).toFixed(1)}, ${n.toFixed(1)} ${(r-i*.45).toFixed(1)}, ${n.toFixed(1)} ${(r-9).toFixed(1)}`),M.setAttribute(`points`,`${n.toFixed(1)},${r.toFixed(1)} ${(n-5.5).toFixed(1)},${(r-9).toFixed(1)} ${(n+5.5).toFixed(1)},${(r-9).toFixed(1)}`),A.style.display=``}else A.style.display=`none`;y>=0&&r[y][o]!==1/0?(N.setAttribute(`x`,String(m(o)-5)),N.setAttribute(`y`,String(h(y)-5)),N.setAttribute(`class`,`lv8-ring is-on`)):N.setAttribute(`class`,`lv8-ring`),S?(P.textContent=`dp[${u}][${l}] = min( dp[${u}][${l}] , dp[${s}][${c}] + fees[${l}] ) = min( ${t.old===1/0?`∞`:t.old} , ${d} + ${a[l]} ) = ${Sj(r[u][l])}`,P.setAttribute(`class`,`lv8-banner__text`+(g?` is-gold`:``))):C?(P.textContent=b===-1?`答案 -1：t ≤ ${i} 内 dp[t][${o}] 始终是 ∞`:`答案 = ${b}：dp[${y}][${o}] = ${b}（t ≤ ${i} 中的最小值）`,P.setAttribute(`class`,`lv8-banner__text`+(b===-1?``:` is-ok`))):(P.textContent=`dp[0][0] = fees[0] = ${a[0]}，其余全是 ∞　→ 按 t 正序逐层松弛所有边`,P.setAttribute(`class`,`lv8-banner__text`)),I.textContent=S?String(s):C?`—`:`0`,I.setAttribute(`class`,`lv8-panel__num`),L.textContent=S?`${c} → ${l}`:`—`,L.setAttribute(`class`,`lv8-panel__num`),R.textContent=S?`${d} → ${p}`:`—`,R.setAttribute(`class`,`lv8-panel__num`+(S?` is-gold`:``)),z.textContent=String(_),z.setAttribute(`class`,`lv8-panel__num`+(_>0?` is-dead`:``)),B.textContent=String(b),B.setAttribute(`class`,`lv8-panel__num`+(C?b===-1?` is-dead`:` is-ok`:v===1/0?` is-dead`:``)),n===`init`?V.textContent=`底座只有一格：dp[0][0] = fees[0]（起点也要付自己的通行费）`:S?V.textContent=g?`更便宜 → 刷新 dp[${u}][${l}] = ${p}${l===o?`，并把答案压到 `+v:``}`:`这一趟更晚也更贵（${p} ≥ ${t.old===1/0?`∞`:t.old}），作废，格子保持原值`:b===-1?V.textContent=`时间窗内到不了终点 —— 不是"最贵"，是"无解"，返回 -1`:V.textContent=`答案不在 dp[0][n-1]，而是 min over t ≤ maxTime of dp[t][n-1]`,Z(H,t.desc)}l.appendChild(H);let ee=Q();l.appendChild(ee.root),e.textContent=``,e.appendChild(l),X();let te=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,W=$({steps:n,controls:ee,intervalMs:cj,onRender:U});W.jumpTo(Math.trunc(t.initialStep)||0);let G=null;return t.autoplay!==!1&&!te&&typeof IntersectionObserver==`function`&&(G=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){G.disconnect(),G=null,W.play();return}},{threshold:.35}),G.observe(l)),{destroy(){G&&=(G.disconnect(),null),W.destroy(),e.textContent=``,delete e.dataset.lc1928Mounted,document.getElementById(sj)?.remove()}}}var wj=[5,1,2,20,20,3],Tj=[[0,1,2],[1,2,2],[2,5,2],[0,3,1],[3,4,1],[4,5,1]],Ej=5,Dj=1/0;function Oj(e={}){let t=Array.isArray(e.fees)&&e.fees.length>=2?e.fees:void 0,n=Array.isArray(t)?t.map(e=>typeof e==`number`&&Number.isFinite(e)&&e>=0?Math.trunc(e):0):[...wj],r=n.length,i=Array.isArray(e.edges)?e.edges:[],a=[];for(let e of i){if(!Array.isArray(e)||e.length<3)continue;let[t,n,i]=e;!Number.isInteger(t)||!Number.isInteger(n)||!Number.isInteger(i)||t<0||t>=r||n<0||n>=r||t===n||i<1||a.push([t,n,i])}let o=Tj.filter(([e,t])=>e<r&&t<r).map(e=>[...e]),s=Number.isInteger(e.maxTime)&&e.maxTime>=1?e.maxTime:Ej;return{n:r,fees:n,edges:a.length>0?a:o,maxTime:s}}function kj(e,t,n){let r=null;for(let[i,a,o]of e)(i===t&&a===n||i===n&&a===t)&&(r===null||o<r)&&(r=o);return r}function Aj(e,t){let n=[0];for(let r=1;r<t.length;r+=1){let i=kj(e,t[r-1],t[r]);if(i===null)return null;n.push(n[r-1]+i)}return n}function jj(e,t,n,r){let i=Array.from({length:e},()=>[]);for(let[e,t,r]of n)i[e].push({to:t,time:r}),i[t].push({to:e,time:r});let a=Array(e).fill(Dj),o=Array(e).fill(-1),s=Array(e).fill(!1);a[0]=t[0];for(let n=0;n<e;n+=1){let n=-1;for(let t=0;t<e;t+=1)s[t]||a[t]===Dj||(n===-1||a[t]<a[n])&&(n=t);if(n===-1)break;s[n]=!0;for(let{to:e}of i[n]){if(s[e])continue;let r=a[n]+t[e];r<a[e]&&(a[e]=r,o[e]=n)}}if(a[r]===Dj)return null;let c=[];for(let e=r;e!==-1;e=o[e])c.push(e);return c.reverse(),c[0]===0?{cities:c,fee:a[r]}:null}function Mj(e,t,n,r){let i=e-1,a=Array.from({length:e},()=>[]);for(let[e,t,r]of n)a[e].push({to:t,time:r}),a[t].push({to:e,time:r});let o=Array.from({length:r+1},()=>Array(e).fill(Dj)),s=Array.from({length:r+1},()=>Array(e).fill(null));o[0][0]=t[0];let c=Dj,l=-1;for(let n=0;n<=r;n+=1)for(let u=0;u<e;u+=1)if(o[n][u]!==Dj)for(let{to:e,time:d}of a[u]){let a=n+d;if(a>r)continue;let f=o[n][u]+t[e];f<o[a][e]&&(o[a][e]=f,s[a][e]={t:n,v:u},e===i&&f<c&&(c=f,l=a))}if(c===Dj)return{fee:Dj,chain:[],bestT:-1};let u=[],d=l,f=i,p=[{t:d,v:f}],m=r+2;for(;!(d===0&&f===0)&&m>0;){let e=s[d][f];if(!e)break;p.push({t:e.t,v:e.v}),d=e.t,f=e.v,--m}return p.reverse(),u.push(...p),{fee:c,chain:u,bestT:l}}function Nj(e={}){let{n:t,fees:n,edges:r,maxTime:i}=Oj(e),a=t-1,o=jj(t,n,r,a),s=Mj(t,n,r,i),c=o?(()=>{let e=Aj(r,o.cities);return e?{cities:[...o.cities],arriveAt:e,fee:o.fee,totalTime:e[e.length-1],valid:e[e.length-1]<=i,found:!0}:null})():null,l=s.chain.length>0?{cities:s.chain.map(e=>e.v),arriveAt:s.chain.map(e=>e.t),fee:s.fee,totalTime:s.chain[s.chain.length-1].t,chain:s.chain.map(e=>({...e}))}:null,u=l?l.fee:-1,d=l?String(l.fee):`-1`,f=[],p=(e,o,s={})=>{f.push({phase:e,desc:o,n:t,maxTime:i,fees:[...n],edges:r.map(e=>[...e]),target:a,cheap:c?{cities:[...c.cities],arriveAt:[...c.arriveAt],fee:c.fee,totalTime:c.totalTime,valid:c.valid,found:!0}:null,best:l?{cities:[...l.cities],arriveAt:[...l.arriveAt],fee:l.fee,totalTime:l.totalTime,chain:l.chain.map(e=>({...e}))}:null,answer:u,cursor:-1,revealedStates:0,done:e===`done`,...s})};if(p(`init`,`动画一把分层图 \`dp[t][v]\` 填好了。这一遍回答两件事：**(1) 只图便宜会怎样** —— 完全不看时间、只按通行费找最便宜的路，它会走哪条、要花多久？**(2) 守住 maxTime = ${i} 的最优路是哪条** —— 然后从最优终点状态沿**前驱表**回退，把城市序列与每个到达时刻一并还原出来。注意 dp 表本身只记了**花费**，路藏在 \`prev[arr][u] = (t, v)\` 里："我在 t' 时刻、城市 u，是从哪个状态走过来的"。`),c&&p(`cheap`,c.valid?`先看**无视时间窗**的贪心：只按通行费找最便宜的路，得到 \`${c.cities.join(` → `)}\`，通行费 \`${c.fee}\`、耗时 **${c.totalTime}** —— 恰好 \`≤ maxTime = ${i}\`，所以这一条**本身就是可行解**（这说明本题里"最便宜"和"来得及"这回碰巧不冲突）。`:`先看**无视时间窗**的贪心：只按通行费找最便宜的路，得到 \`${c.cities.join(` → `)}\`，通行费只要 \`${c.fee}\` —— 比后面那条便宜得多。可它要花 **${c.totalTime}** 分钟，\`${c.totalTime} > maxTime = ${i}\`，**超时，直接作废**。这就是本题的命门：**便宜 ≠ 来得及**。如果只用一个一维的 \`dp[v]\`（到 v 的最少花费），就会把这条便宜路记成"到终点的最优解"，把时间这一维整个漏掉 —— 于是得到错误的答案。`,{cheap:c}),l){p(`best`,`再看**守住时间窗**的最优路：在 \`t ≤ ${i}\` 的所有状态里，\`dp[t][${a}]\` 的最小值出现在 **\`(t = ${l.totalTime}, 城市 ${a})\`**，价值 \`${l.fee}\`。从它沿前驱回退，得到的城市序列是 \`${l.cities.join(` → `)}\`，到达时刻 \`${l.arriveAt.join(`, `)}\`，共 **${l.totalTime}** 分钟。`+(c&&!c.valid?`对照上面那条：它贵得多（\`${l.fee}\` vs \`${c.fee}\`），却是**唯一来得及**的 —— 时间窗一卡，"最便宜"就必须让位给"刚好赶得上"。`:`它比贪心那条不可能更便宜（\`${l.fee} ≤ ${c?c.fee:l.fee}\`），因为它在"守时"的基础上还要最省。`),{best:l});for(let e=l.chain.length-1;e>=0;--e){let t=l.chain[e],r=e>0?l.chain[e-1]:null;p(`back`,(e===l.chain.length-1?`回退的起点是终点状态 \`(t = ${t.t}, 城市 ${t.v})\` —— 也就是 \`dp[${t.t}][${t.v}] = ${l.fee}\` 那一格。`:`回退到状态 \`(t = ${t.t}, 城市 ${t.v})\`。`)+(r?`它的前驱是 \`(t = ${r.t}, 城市 ${r.v})\`：也就是说，是在 **t = ${r.t}** 从城市 ${r.v} 走了一条耗时 **${t.t-r.t}** 的边过来的（\`${t.t-r.t} = ${t.t} - ${r.t}\`）。`:`它是链的源头 \`(0, 0)\` —— \`dp[0][0] = fees[0] = ${n[0]}\`，起点也要付自己的通行费。到达 \`(0, 0)\` 就退完了。`),{cursor:e,revealedStates:l.chain.length-e})}}return p(`done`,(l?`还原完毕：\`${l.cities.join(` → `)}\`，到达时刻 \`${l.arriveAt.join(`, `)}\`，总时间 \`${l.totalTime} ≤ ${i}\`，通行费 \`${l.cities.map(e=>n[e]).join(` + `)} = ${l.fee}\`。回头看两层对照：**隐藏时间的贪心**给出 \`${c?`${c.fee}（超时 ${c.totalTime}）`:`无`}\`，**守住时间窗的答案**是 \`${d}\` —— 一维 dp 会把前者当成答案，而分层图（把时刻并进状态）才拿得到后者。路不是 dp 值直接给的，是从**前驱表**一段段退回来的。`:`扫描完所有时刻，\`dp[t][${a}]\` 在 \`t ≤ ${i}\` 内始终是 \`∞\`：**没有可行路**。此时不管贪心那条便宜路多便宜，只要它超时，答案就是 \`-1\` —— **可行性与最优性是两个问题**：先要"走得通且不超时"，才谈得上"最便宜"。`)+'这也正是 **LC 1928** 与 **LC 743**（网络延迟时间）、**LC 1631**（最小体力消耗路径）那类"最短路"的分界：它们的代价维度可以直接相加比较，而这里**时间是一个硬约束**，所以状态 `(t, v)` 必须二维展开。',{done:!0,cursor:0,revealedStates:l?l.chain.length:0}),f}var Pj=`lc1928path-styles`,Fj=1150,Ij=680,Lj=26,Rj=22,zj=176,Bj=288,Vj=50,Hj=358,Uj=368,Wj=38,Gj=424,Kj=44,qj=502,Jj=`
.lv8p { display: flex; flex-direction: column; gap: 14px; }
.lv8p__svg { width: 100%; height: auto; display: block; }

.lv8p-note {
  fill: var(--lv8p-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-note--r { text-anchor: end; }
.lv8p-lbl {
  fill: var(--lv8p-muted, #657168); font-size: 11.5px;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lv8p-edge { stroke: var(--lv8p-line, #c3c9c2); stroke-width: 2; fill: none; }
.lv8p-arrow { fill: var(--lv8p-line, #c3c9c2); stroke: none; }
.lv8p-path { stroke-width: 4; fill: none; opacity: 0; stroke-linecap: round; }
.lv8p-path.is-cheap { stroke: var(--lv8p-hot, #a45f45); }
.lv8p-path.is-best { stroke: var(--lv8p-ok, #3f6b57); }
.lv8p-path.is-on { opacity: 1; }
.lv8p-wt {
  fill: var(--lv8p-muted, #657168); font-size: 10px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lv8p-node__circle { stroke: var(--lv8p-line, #b9c1b8); stroke-width: 2; fill: var(--lv8p-fill, #ffffff); }
.lv8p-node__num {
  fill: var(--lv8p-ink, #1f2a24); font-size: 17px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-node__fee {
  fill: var(--lv8p-dim, #9aa39c); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-node.is-src .lv8p-node__circle { stroke: var(--lv8p-gold, #c2872f); stroke-width: 3.5; }
.lv8p-node.is-cheap .lv8p-node__circle { fill: #f6e6e0; stroke: var(--lv8p-hot, #a45f45); stroke-width: 3; }
.lv8p-node.is-best .lv8p-node__circle { fill: var(--lv8p-ok-fill, #eef5f1); stroke: var(--lv8p-ok, #3f6b57); stroke-width: 3; }
.lv8p-node.is-tail .lv8p-node__circle { stroke: var(--lv8p-gold, #c2872f); stroke-width: 3.5; }

.lv8p-card__box {
  fill: var(--lv8p-banner, #f4f3ef); stroke: var(--lv8p-line, #c3c9c2); stroke-width: 1.5;
}
.lv8p-card.is-hot .lv8p-card__box { stroke: var(--lv8p-hot, #a45f45); stroke-width: 2.4; }
.lv8p-card.is-ok .lv8p-card__box { stroke: var(--lv8p-ok, #3f6b57); stroke-width: 2.4; }
.lv8p-card.is-dim { opacity: 0.5; }
.lv8p-card__title {
  fill: var(--lv8p-muted, #657168); font-size: 11px; font-weight: 700;
  text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-card__main {
  fill: var(--lv8p-ink, #1f2a24); font-size: 12.5px; font-weight: 700;
  text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-card__verdict {
  font-size: 12.5px; font-weight: 800; text-anchor: end; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-card__verdict.is-hot { fill: var(--lv8p-hot, #a45f45); }
.lv8p-card__verdict.is-ok { fill: var(--lv8p-ok, #3f6b57); }
.lv8p-card__verdict.is-dead { fill: var(--lv8p-dim, #9aa39c); }

.lv8p-chip__box { fill: var(--lv8p-fill, #ffffff); stroke: var(--lv8p-line, #c3c9c2); stroke-width: 1.6; }
.lv8p-chip__t {
  fill: var(--lv8p-dim, #9aa39c); font-size: 9.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-chip__v {
  fill: var(--lv8p-ink, #1f2a24); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-chip.is-revealed .lv8p-chip__box { fill: var(--lv8p-ok-fill, #eef5f1); stroke: var(--lv8p-ok, #3f6b57); }
.lv8p-chip.is-revealed .lv8p-chip__v { fill: var(--lv8p-ok, #3f6b57); }
.lv8p-chip.is-cur .lv8p-chip__box { stroke: var(--lv8p-gold, #c2872f); stroke-width: 3; }
.lv8p-chip.is-cur .lv8p-chip__v { fill: var(--lv8p-gold, #c2872f); }
.lv8p-chip.is-hidden { opacity: 0; }

.lv8p-link__line { stroke: var(--lv8p-ok, #3f6b57); stroke-width: 1.6; stroke-dasharray: 3 3; }
.lv8p-link__head { fill: var(--lv8p-ok, #3f6b57); }

.lv8p-banner__box {
  fill: var(--lv8p-banner, #f4f3ef); stroke: var(--lv8p-line, #c3c9c2); stroke-width: 1.5;
}
.lv8p-banner__text {
  fill: var(--lv8p-hot, #a45f45); font-size: 13.5px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-banner__text.is-ok { fill: var(--lv8p-ok, #3f6b57); }

.lv8p-phase__text {
  fill: var(--lv8p-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function Yj(){if(document.getElementById(Pj))return;let e=document.createElement(`style`);e.id=Pj,e.textContent=Jj,document.head.appendChild(e)}function Xj(e,t){let n=Array.from({length:e},()=>[]);for(let[e,r]of t)n[e].push(r),n[r].push(e);let r=Array(e).fill(-1);r[0]=0;let i=[0];for(let e=0;e<i.length;e+=1){let t=i[e];for(let e of n[t])r[e]===-1&&(r[e]=r[t]+1,i.push(e))}let a=0,o=1,s=new Map;for(let t=0;t<e;t+=1)r[t]===-1&&(r[t]=-2);for(let t=0;t<e;t+=1)r[t]>=0&&r[t]>a&&(a=r[t]);for(let t=0;t<e;t+=1)r[t]===-2&&(r[t]=a+1);for(let t=0;t<e;t+=1)s.has(r[t])||s.set(r[t],[]),s.get(r[t]).push(t);for(let e of s.values())o=Math.max(o,e.length);let c=Math.min(170,Math.floor((Ij-140)/Math.max(1,a))),l=Math.min(80,Math.floor((zj-40)/Math.max(1,o-1))),u=Array(e);for(let[e,t]of s)t.sort((e,t)=>e-t),t.forEach((n,r)=>{u[n]={x:Ij/2+(e-a/2)*c,y:zj+(r-(t.length-1)/2)*l}});return u}function Zj(e,t,n){let r=t.x-e.x,i=t.y-e.y,a=Math.hypot(r,i)||1,o=r/a,s=i/a,c=e.x+o*n,l=e.y+s*n,u=t.x-o*(n+1),d=t.y-s*(n+1),f=-s,p=o,m=u-o*9,h=d-s*9;return{x1:c,y1:l,x2:u,y2:d,head:`${u.toFixed(1)},${d.toFixed(1)} ${(m+f*5).toFixed(1)},${(h+p*5).toFixed(1)} ${(m-f*5).toFixed(1)},${(h-p*5).toFixed(1)}`}}function Qj(e,t={}){if(!e||e.dataset.lc1928PathMounted===`1`)return{destroy(){}};e.dataset.lc1928PathMounted=`1`,Yj();let n=Nj(t),{n:r,maxTime:i,fees:a,edges:o,target:s}=n[0],c=Y,l=document.createElement(`div`);l.className=`viz lv8p`;let u=document.createElement(`div`);u.className=`viz__stage`,l.appendChild(u);let d=c(`svg`,{class:`viz__svg lv8p__svg`,viewBox:`0 0 ${Ij} 524`,role:`img`,"aria-label":`规定时间内到达终点的最小花费 LC1928 便宜路与守时路对照动画`}),f=c(`g`,{}),p=c(`g`,{}),m=c(`g`,{}),h=c(`g`,{});d.append(f,p,m,h),u.appendChild(d);let g=c(`text`,{class:`lv8p-note`,x:26,y:Rj});g.textContent=`同一张图：只图便宜的路 vs 守住 maxTime 的路 —— 便宜 ≠ 来得及`,h.appendChild(g);let _=c(`text`,{class:`lv8p-note lv8p-note--r`,x:Ij-26,y:Rj});_.textContent=`maxTime = ${i} · 终点 = 城市 ${s}`,h.appendChild(_);let v=Xj(r,o);for(let[e,t,n]of o){let r=Zj(v[e],v[t],Lj);f.appendChild(c(`line`,{class:`lv8p-edge`,x1:r.x1,y1:r.y1,x2:r.x2,y2:r.y2})),f.appendChild(c(`polygon`,{class:`lv8p-arrow`,points:r.head}));let i=(v[e].x+v[t].x)/2,a=(v[e].y+v[t].y)/2,o=c(`text`,{class:`lv8p-wt`,x:i.toFixed(1),y:(a-7).toFixed(1)});o.textContent=`${n}分`,h.appendChild(o)}let y={cheap:[],best:[]};for(let e of[`cheap`,`best`])for(let[t,n]of o){let r=Zj(v[t],v[n],Lj),i=c(`line`,{class:`lv8p-path is-${e}`,x1:r.x1,y1:r.y1,x2:r.x2,y2:r.y2});p.appendChild(i),y[e].push({el:i,a:t,b:n})}let b=[];for(let e=0;e<r;e+=1){let{x:t,y:n}=v[e],r=c(`g`,{class:`lv8p-node`});r.appendChild(c(`circle`,{class:`lv8p-node__circle`,cx:t,cy:n,r:Lj}));let i=c(`text`,{class:`lv8p-node__num`,x:t,y:n});i.textContent=String(e),r.appendChild(i),m.appendChild(r);let o=c(`text`,{class:`lv8p-node__fee`,x:t,y:n+Lj+13});o.textContent=`费 ${a[e]}`,h.appendChild(o),b.push({g:r})}let x=(Ij-52-14)/2,S=(e,t)=>{let n=c(`g`,{class:`lv8p-card is-${t}`});n.appendChild(c(`rect`,{class:`lv8p-card__box`,x:e,y:Bj,width:x,height:Vj,rx:9}));let r=c(`text`,{class:`lv8p-card__title`,x:e+14,y:304}),i=c(`text`,{class:`lv8p-card__main`,x:e+14,y:323}),a=c(`text`,{class:`lv8p-card__verdict`,x:e+x-14,y:304});return n.append(r,i,a),h.appendChild(n),{g:n,title:r,main:i,verdict:a}},C=S(26,`hot`),w=S(347,`ok`);C.title.textContent=`只图便宜 · 不看时间`,w.title.textContent=`守时间窗 · 最优`;let T=c(`text`,{class:`lv8p-lbl`,x:26,y:Hj});T.textContent=`状态链（沿前驱表从终点往回退）`,h.appendChild(T);let E=Math.min(84,Math.floor((Ij-52-152)/6)),D=[];for(let e=0;e<20;e+=1){let t=26+e*87,n=c(`g`,{class:`lv8p-chip is-hidden`});n.appendChild(c(`rect`,{class:`lv8p-chip__box`,x:t,y:Uj,width:E,height:Wj,rx:7}));let r=c(`text`,{class:`lv8p-chip__t`,x:t+E/2,y:379}),i=c(`text`,{class:`lv8p-chip__v`,x:t+E/2,y:394});n.append(r,i),h.appendChild(n),D.push({g:n,tv:r,vv:i})}let O=[];for(let e=0;e<19;e+=1){let t=26+e*87,n=t+E,r=c(`g`,{});r.appendChild(c(`line`,{class:`lv8p-link__line`,x1:n.toFixed(1),y1:387,x2:(t+E+8).toFixed(1),y2:387}));let i=t+E+8;r.appendChild(c(`polygon`,{class:`lv8p-link__head`,points:`${i.toFixed(1)},387 ${(i-6).toFixed(1)},${383.4.toFixed(1)} ${(i-6).toFixed(1)},${390.6.toFixed(1)}`})),r.style.display=`none`,h.appendChild(r),O.push(r)}h.appendChild(c(`rect`,{class:`lv8p-banner__box`,x:26,y:Gj,width:Ij-52,height:Kj,rx:9}));let k=c(`text`,{class:`lv8p-banner__text`,x:Ij/2,y:446});h.appendChild(k);let A=c(`text`,{class:`lv8p-phase__text`,x:Ij/2,y:qj});h.appendChild(A);let j=document.createElement(`p`);j.className=`viz__desc`,j.setAttribute(`aria-live`,`polite`);function M(e,t){if(!t)return;let{phase:n,cheap:r,best:a,answer:o,cursor:c,revealedStates:l}=t,u=n!==`init`&&r,d=(n===`best`||n===`back`||n===`done`)&&a;for(let e of[`cheap`,`best`]){let t=e===`cheap`?r?.cities:a?.cities,n=e===`cheap`?u:d,i=[];if(n&&t)for(let e=0;e<t.length-1;e+=1)i.push([t[e],t[e+1]]);y[e].forEach(({el:t,a:n,b:r})=>{let a=i.some(([e,t])=>e===n&&t===r||e===r&&t===n);t.setAttribute(`class`,`lv8p-path is-${e}${a?` is-on`:``}`)})}let f=new Set(u?r.cities:[]),p=new Set(d?a.cities:[]);b.forEach((e,t)=>{let n=[`lv8p-node`];t===0&&n.push(`is-src`),t===s&&n.push(`is-tail`),p.has(t)?n.push(`is-best`):f.has(t)&&n.push(`is-cheap`),e.g.setAttribute(`class`,n.join(` `))});let m=(e,t,n,r)=>{if(e.g.setAttribute(`class`,`lv8p-card is-${r}${n?``:` is-dim`}`),!t){e.main.textContent=`—`,e.verdict.textContent=``,e.verdict.setAttribute(`class`,`lv8p-card__verdict`);return}e.main.textContent=`${t.cities.join(` → `)} · 费 ${t.fee} · ${t.totalTime}分`,r===`hot`?(e.verdict.textContent=t.valid?`来得及`:`超时 ${t.totalTime} > ${i}`,e.verdict.setAttribute(`class`,`lv8p-card__verdict ${t.valid?`is-ok`:`is-hot`}`)):(e.verdict.textContent=`最优`,e.verdict.setAttribute(`class`,`lv8p-card__verdict is-ok`))};m(C,r,u,`hot`),m(w,a,d,`ok`);let h=a?a.chain:[],g=Math.max(0,l);D.forEach((e,t)=>{if(t>=h.length){e.g.setAttribute(`class`,`lv8p-chip is-hidden`);return}let n=[`lv8p-chip`];t<g?(n.push(`is-revealed`),e.tv.textContent=`t = ${h[t].t}`,e.vv.textContent=`城市 ${h[t].v}`):(e.tv.textContent=`?`,e.vv.textContent=`?`),c>=0&&t===c&&n.push(`is-cur`),e.g.setAttribute(`class`,n.join(` `))}),O.forEach((e,t)=>{let n=t+1<h.length&&t+1<g;e.style.display=n?``:`none`}),n===`init`?(k.textContent=`先不守时间：只按通行费找最便宜的路，看看它会超时多少`,k.setAttribute(`class`,`lv8p-banner__text`)):n===`cheap`?(k.textContent=r?`贪心路 ${r.cities.join(` → `)}　费 ${r.fee}　耗时 ${r.totalTime} ${r.valid?`≤`:`>`} ${i}`:`只按通行费也走不到终点`,k.setAttribute(`class`,`lv8p-banner__text`+(r&&r.valid?` is-ok`:``))):n===`best`?(k.textContent=`守时最优 ${a.cities.join(` → `)}　费 ${a.fee}　耗时 ${a.totalTime} ≤ ${i}`,k.setAttribute(`class`,`lv8p-banner__text is-ok`)):n===`back`?(k.textContent=`回溯状态链：还剩 ${h.length-g} 步退回 (0, 0)`,k.setAttribute(`class`,`lv8p-banner__text is-ok`)):(k.textContent=o===-1?`时间窗内没有可行路 → 返回 -1`:`答案 = ${o}（守时间窗的最小通行费）`,k.setAttribute(`class`,`lv8p-banner__text`+(o===-1?``:` is-ok`))),n===`init`?A.textContent=`一维 dp[v] 只记"到 v 的最少花费"，会把"第几时刻到的"整个丢掉`:n===`cheap`?A.textContent=r&&r.valid?`这条便宜路恰好没超时 —— 但这只是运气，本题里两件事通常冲突`:`便宜路超时作废 —— 若只看花费，一维 dp 会把它错当成答案`:n===`best`?A.textContent="把时刻并进状态后，`(t, v)` 二维展开才拿得到第一条来得及的路":n===`back`?A.textContent=`路不在 dp 值里，藏在 prev[arr][u] = (t, v)：一段一段问"我从哪来"`:A.textContent=`可行性（来得及）与最优性（最便宜）是两问：先过时间窗，才谈最省`,Z(j,t.desc)}l.appendChild(j);let N=Q();l.appendChild(N.root),e.textContent=``,e.appendChild(l),X();let P=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,F=$({steps:n,controls:N,intervalMs:Fj,onRender:M});F.jumpTo(Math.trunc(t.initialStep)||0);let I=null;return t.autoplay!==!1&&!P&&typeof IntersectionObserver==`function`&&(I=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){I.disconnect(),I=null,F.play();return}},{threshold:.35}),I.observe(l)),{destroy(){I&&=(I.disconnect(),null),F.destroy(),e.textContent=``,delete e.dataset.lc1928PathMounted,document.getElementById(Pj)?.remove()}}}var $j=`abacaba`;function eM(e={}){let t=typeof e.p==`string`&&e.p.length>=1?e.p:$j;return{p:t,n:t.length}}function tM(e={}){let{p:t,n}=eM(e),r=Array(n).fill(0),i=0,a=0,o=0,s=1,c=[],l=(e,l,u={})=>{c.push({phase:e,desc:l,p:t,n,i:-1,jBefore:i,jAfter:i,chI:``,chJ:``,match:!1,prevNext:r.slice(),next:r.slice(),retreats:a,comparisons:o,knownCount:s,done:e===`done`,...u})};l(`init`,`p = "${t}"（${n} 个字符）。定义：\`next[i]\` = \`p[0..i]\` 这个子串的**最长相等真前后缀**长度 —— 「真」指不含子串本身，所以 \`next[0] = 0\` **恒成立**。求法一句话：**自己跟自己匹配**。 维护 \`j\` = 已匹配的前缀长度（也是下一个要和 \`p[i]\` 比的 p 下标），从 \`i = 1\` 起：先 \`while j > 0 且 p[i] != p[j]\` 就 \`j = next[j-1]\` 回退，再 \`if p[i] == p[j]\` 就 \`j += 1\`，最后 \`next[i] = j\`。另有把首项记作 \`-1\` 的定义（严蔚敏《数据结构》），与本文的关系是 \`B = [-1] + A[0..n-2]\` —— **面试先确认用哪种**，本文默认前者（前缀函数）。`);for(let e=1;e<n;e+=1){let c=!1;for(;i>0;){let n=t[e],s=t[i],u=n===s;if(o+=1,l(`compare`,`比较 \`p[${e}] = '${n}'\` 与 \`p[${i}] = '${s}'\`：**${u?`相等`:`不等`}**。进入比较前有一步不变量：\`p[0..${i-1}]\` 与 \`p[${e-i}..${e-1}]\` **逐字相等** —— \`j\` 正是「当前最长的、能接下去的前缀」的长度。`,{i:e,jBefore:i,jAfter:i,chI:n,chJ:s,match:u}),u){c=!0;break}let d=i,f=r[d-1];a+=1,l(`retreat`,`\`p[${e}]\` 与 \`p[${d}]\` 对不上，把 \`j\` 从 ${d} 回退到 \`next[${d-1}] = ${f}\`。**回退不是退步**：它换的是「更短但仍接得上的前后缀」，靠的正是 \`next[j-1]\` 记着 \`p[0..${d-1}]\` 自身的最长相等前后缀（长度 ${f}）。`,{i:e,jBefore:d,jAfter:f,chI:t[e],chJ:t[d],match:!1}),i=f}if(!c){let n=t[e],r=t[0],i=n===r;o+=1,l(`compare`,`比较 \`p[${e}] = '${n}'\` 与 \`p[0] = '${r}'\`：**${i?`相等`:`不等`}**。`+(i?`前缀可以再长一位。`:`而 \`j\` 已是 0，没有更短的候选可退 —— 只能 \`next[${e}] = 0\`。`),{i:e,jBefore:0,jAfter:0,chI:n,chJ:r,match:i}),i&&(c=!0)}let u=i,d=c?i+1:i,f=r.slice();r[e]=d,i=d,s=e+1,l(`assign`,`定下 \`next[${e}] = ${d}\`，\`j\` 更新为 ${d}`+(c?"（比较相等，`j` 前进一位）":"（比较不等且 `j` 已是 0，停在 0）")+(e+1<n?`。下一步 \`i\` 走到 ${e+1}。`:`。`),{i:e,jBefore:u,jAfter:d,chI:t[e],chJ:t[u],match:c,prevNext:f,next:r.slice(),knownCount:s})}let u=[-1,...r.slice(0,Math.max(0,n-1))];return l(`done`,`循环走完，**next = [${r.join(`,`)}]**（p = "${t}"）。每个 \`next[i]\` 都等于 \`p[0..i]\` 的最长相等真前后缀长度。把首项记作 \`-1\` 的那种定义（严蔚敏版）写作 \`[${u.join(`,`)}]\`，与本文只差一次整体移位。求 next 是 **O(n)**：\`j\` 每次最多自增 1、回退总量不超过自增总量，均摊线性。拿到 next 之后，用它做 KMP 匹配也是 \`O(n + m)\`。`,{i:-1,jBefore:i,jAfter:i,knownCount:n,done:!0}),c}var nM=`kmp-styles`,rM=1e3,iM=680,aM=22,oM=44,sM=52,cM=46,lM=113,uM=131,dM=152,fM=42,pM=216,mM=44,hM=274,gM=58,_M=350,vM=372,yM=`
.lk { display: flex; flex-direction: column; gap: 14px; }
.lk__svg { width: 100%; height: auto; display: block; }

.lk-note {
  fill: var(--lk-muted, #657168); font-size: 12.5px; text-anchor: start;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-note--r { text-anchor: end; }
.lk-side {
  fill: var(--lk-dim, #9aa39c); font-size: 11px; text-anchor: end;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-idx {
  fill: var(--lk-dim, #9aa39c); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.lk-cell__box {
  fill: var(--lk-fill, #ffffff);
  stroke: var(--lk-line, #c3c9c2);
  stroke-width: 1.6;
}
.lk-cell__ch {
  fill: var(--lk-ink, #1f2a24); font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-cell.is-window .lk-cell__box { fill: var(--lk-ok-fill, #eef5f1); stroke: var(--lk-ok, #3f6b57); }
.lk-cell.is-window .lk-cell__ch { fill: var(--lk-ok, #3f6b57); }
.lk-cell.is-hot .lk-cell__box { stroke: var(--lk-hot, #a45f45); stroke-width: 3.2; }
.lk-cell.is-hot .lk-cell__ch { fill: var(--lk-hot, #a45f45); }
.lk-cell.is-match .lk-cell__box { fill: var(--lk-ok-fill, #eef5f1); stroke: var(--lk-ok, #3f6b57); }
.lk-cell.is-match .lk-cell__ch { fill: var(--lk-ok, #3f6b57); }

.lk-ncell__box {
  fill: var(--lk-muted-fill, #f7f6f2);
  stroke: var(--lk-line, #c3c9c2); stroke-width: 1.5;
}
.lk-ncell__val {
  fill: var(--lk-ink, #1f2a24); font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-ncell.is-unknown .lk-ncell__box { stroke-dasharray: 4 3; }
.lk-ncell.is-unknown .lk-ncell__val { fill: var(--lk-dim, #9aa39c); font-weight: 500; }
.lk-ncell.is-known .lk-ncell__box { fill: var(--lk-ok-fill, #eef5f1); stroke: var(--lk-ok, #3f6b57); }
.lk-ncell.is-known .lk-ncell__val { fill: var(--lk-ok, #3f6b57); }
.lk-ncell.is-newi .lk-ncell__box { fill: var(--lk-gold-fill, #fdf3e3); stroke: var(--lk-gold, #c2872f); stroke-width: 3.2; }
.lk-ncell.is-newi .lk-ncell__val { fill: var(--lk-gold, #c2872f); }
.lk-ncell.is-src .lk-ncell__box { stroke: var(--lk-hot, #a45f45); stroke-width: 3; }

.lk-chip__dot { fill: var(--lk-fill, #ffffff); stroke: var(--lk-chrome, #657168); stroke-width: 1.6; }
.lk-chip__t { fill: var(--lk-chrome, #657168); font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.lk-chip--i .lk-chip__dot { stroke: var(--lk-hot, #a45f45); }
.lk-chip--i .lk-chip__t { fill: var(--lk-hot, #a45f45); }
.lk-chip--j .lk-chip__dot { stroke: var(--lk-gold, #c2872f); }
.lk-chip--j .lk-chip__t { fill: var(--lk-gold, #c2872f); }
.lk-chip--jt .lk-chip__dot { stroke: var(--lk-ok, #3f6b57); }
.lk-chip--jt .lk-chip__t { fill: var(--lk-ok, #3f6b57); }

.lk-link { stroke: var(--lk-hot, #a45f45); stroke-width: 2; fill: none; stroke-dasharray: 5 4; }

.lk-banner__box {
  fill: var(--lk-banner, #f4f3ef); stroke: var(--lk-line, #c3c9c2); stroke-width: 1.5;
}
.lk-banner__text {
  fill: var(--lk-hot, #a45f45); font-size: 13.5px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-banner__text.is-ok { fill: var(--lk-ok, #3f6b57); }
.lk-banner__text.is-gold { fill: var(--lk-gold, #c2872f); }

.lk-panel__box { fill: var(--lk-fill, #ffffff); stroke: var(--lk-line, #c3c9c2); stroke-width: 1.5; }
.lk-panel__label {
  fill: var(--lk-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-panel__num {
  fill: var(--lk-ink, #1f2a24); font-size: 16px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-panel__num.is-gold { fill: var(--lk-gold, #c2872f); }
.lk-panel__num.is-ok { fill: var(--lk-ok, #3f6b57); }
.lk-panel__num.is-small { font-size: 12.5px; }

.lk-phase__text {
  fill: var(--lk-muted, #657168); font-size: 13px; font-weight: 600; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function bM(){if(document.getElementById(nM))return;let e=document.createElement(`style`);e.id=nM,e.textContent=yM,document.head.appendChild(e)}function xM(e,t={}){if(!e||e.dataset.kmpMounted===`1`)return{destroy(){}};e.dataset.kmpMounted=`1`,bM();let n=tM(t),{p:r,n:i}=n[0],a=Y,o=document.createElement(`div`);o.className=`viz lk`;let s=document.createElement(`div`);s.className=`viz__stage`,o.appendChild(s);let c=Math.min(64,Math.floor((iM-56-(i-1)*8)/i)),l=(iM-(i*c+(i-1)*8))/2,u=e=>l+e*(c+8),d=e=>u(e)+c/2,f=Math.max(15,Math.min(24,Math.round(c/2.3))),p=Math.max(12,Math.min(17,Math.round(c/3.2))),m=a(`svg`,{class:`viz__svg lk__svg`,viewBox:`0 0 ${iM} ${vM}`,role:`img`,"aria-label":`KMP 求 next 数组推演动画`}),h=a(`g`,{}),g=a(`g`,{}),_=a(`g`,{});m.append(h,g,_),s.appendChild(m);let v=a(`text`,{class:`lk-note`,x:26,y:aM});v.textContent=`next[i] = p[0..i] 的最长相等真前后缀的长度`,_.appendChild(v);let y=a(`text`,{class:`lk-note lk-note--r`,x:iM-26,y:aM});y.textContent=`p = "${r}" · n = ${i}`,_.appendChild(y);let b=(e,t)=>{let n=a(`text`,{class:`lk-side`,x:l-12,y:t});n.textContent=e,_.appendChild(n)};b(`p`,75),b(`next`,173);let x=[];for(let e=0;e<i;e+=1){let t=a(`text`,{class:`lk-idx`,x:d(e),y:oM});t.textContent=String(e),_.appendChild(t);let n=a(`g`,{class:`lk-cell`});n.appendChild(a(`rect`,{class:`lk-cell__box`,x:u(e),y:sM,width:c,height:cM,rx:6}));let i=a(`text`,{class:`lk-cell__ch`,x:d(e),y:75,style:`font-size: ${f}px`});i.textContent=r[e],n.appendChild(i),h.appendChild(n),x.push({g:n,ch:i})}let S=[];for(let e=0;e<i;e+=1){let t=a(`g`,{class:`lk-ncell`});t.appendChild(a(`rect`,{class:`lk-ncell__box`,x:u(e),y:dM,width:c,height:fM,rx:6}));let n=a(`text`,{class:`lk-ncell__val`,x:d(e),y:173,style:`font-size: ${p}px`});t.appendChild(n),h.appendChild(t),S.push({g:t,val:n})}let C=e=>{let t=a(`g`,{class:`lk-chip ${e}`});t.appendChild(a(`circle`,{class:`lk-chip__dot`,cx:0,cy:0,r:10}));let n=a(`text`,{class:`lk-chip__t`,x:0,y:0,style:`font-size: 12px`});return t.append(n),_.appendChild(t),{g:t,t:n}},w=C(`lk-chip--i`);w.t.textContent=`i`;let T=C(`lk-chip--j`);T.t.textContent=`j`;let E=C(`lk-chip--jt`);E.t.textContent=`j`;let D=(e,t,n)=>e.g.setAttribute(`transform`,`translate(${t.toFixed(1)}, ${n})`),O=a(`path`,{class:`lk-link`,d:``});g.appendChild(O),_.appendChild(a(`rect`,{class:`lk-banner__box`,x:26,y:pM,width:iM-52,height:mM,rx:9}));let k=a(`text`,{class:`lk-banner__text`,x:iM/2,y:238});_.appendChild(k),_.appendChild(a(`rect`,{class:`lk-panel__box`,x:26,y:hM,width:iM-52,height:gM,rx:9}));let A=(e,t)=>{let n=iM/2+(t-4/2)*116,r=a(`text`,{class:`lk-panel__label`,x:n,y:290});r.textContent=e;let i=a(`text`,{class:`lk-panel__num`,x:n,y:314});return _.append(r,i),i},j=A(`i`,0),M=A(`j`,1),N=A(`比较次数`,2),P=A(`回退次数`,3),F=A(`已定 next`,4),I=a(`text`,{class:`lk-phase__text`,x:iM/2,y:_M});_.appendChild(I);let L=document.createElement(`p`);L.className=`viz__desc`,L.setAttribute(`aria-live`,`polite`);function R(e,t){if(!t)return;let{phase:n,i:r,jBefore:a,jAfter:o,match:s,next:c,retreats:l,comparisons:u,knownCount:f}=t,p=n===`compare`,m=n===`retreat`,h=n===`assign`,g=n===`init`,_=n===`done`,v=0,y=-1;p||m?(v=a,y=r):h&&(v=o,y=r);let b=v-1,C=y>=0?y-v:-1,A=y>=0?y-1:-2,R=e=>v>0&&e>=0&&e<=b||v>0&&e>=C&&e<=A;x.forEach((e,t)=>{let n=[`lk-cell`];R(t)&&n.push(`is-window`),(p||h)&&t===r&&n.push(`is-hot`),p&&t===a&&n.push(`is-hot`),m&&t===a&&n.push(`is-hot`),p&&s&&t===a&&n.push(`is-match`),p&&s&&t===r&&n.push(`is-match`),e.g.setAttribute(`class`,n.join(` `))}),S.forEach((e,t)=>{let n=t<f,i=[`lk-ncell`,n?`is-known`:`is-unknown`];h&&t===r&&i.push(`is-newi`),m&&t===a-1&&i.push(`is-src`),e.g.setAttribute(`class`,i.join(` `)),e.val.textContent=n?String(c[t]):`·`});let z=r>=0;if(w.g.style.display=z?``:`none`,z&&D(w,d(r),lM),p||m?(T.g.style.display=``,D(T,d(a),uM)):T.g.style.display=`none`,m){E.g.style.display=``,D(E,d(o),lM);let e=d(a),t=d(a-1),n=dM;O.setAttribute(`d`,`M ${e.toFixed(1)} ${98 .toFixed(1)} C ${e.toFixed(1)} ${120 .toFixed(1)}, ${t.toFixed(1)} ${(n-22).toFixed(1)}, ${t.toFixed(1)} ${n.toFixed(1)}`),O.style.display=``}else E.g.style.display=`none`,O.style.display=`none`;h&&(T.g.style.display=``,D(T,d(o),uM)),g?(k.textContent=`next[0] = 0（定义）· j = 0 —— 从 i = 1 起「自己跟自己」比`,k.setAttribute(`class`,`lk-banner__text`)):p?(k.textContent=`p[${r}] = '${t.chI}'  vs  p[${a}] = '${t.chJ}'   →   ${s?`相等 ✓`:`不等 ✗`}`,k.setAttribute(`class`,`lk-banner__text`+(s?` is-ok`:``))):m?(k.textContent=`p[${r}] ≠ p[${a}]   →   j = next[${a-1}] = ${o}（回退）`,k.setAttribute(`class`,`lk-banner__text`)):h?(k.textContent=`next[${r}]  =  ${o}`,k.setAttribute(`class`,`lk-banner__text is-gold`)):(k.textContent=`next = [${c.join(`, `)}]`,k.setAttribute(`class`,`lk-banner__text is-ok`)),j.textContent=g||_?`—`:String(r),j.setAttribute(`class`,`lk-panel__num`),M.textContent=String(o),M.setAttribute(`class`,`lk-panel__num`+(o>0?` is-gold`:``)),N.textContent=String(u),N.setAttribute(`class`,`lk-panel__num`),P.textContent=String(l),P.setAttribute(`class`,`lk-panel__num`+(l>0?` is-gold`:``)),F.textContent=`${f} / ${i}`,F.setAttribute(`class`,`lk-panel__num is-small`+(f===i?` is-ok`:``)),g?I.textContent=`next[0] = 0 是定义、不用算；i 从 1 开始，j 从 0 开始`:p?I.textContent=s?`相等 → 前缀再长一位，j 前进`:`不等 → 该回退了（换个更短、但接得上的候选）`:m?I.textContent=`j 退到 next[j-1]：回退换的是候选前缀，不是丢掉已匹配部分`:h?I.textContent=`next[i] = j 落定；j 就是新的「已匹配前缀长度」`:I.textContent=`答案就是这张 next 表 —— 全算完，O(n)`,Z(L,t.desc)}o.appendChild(L);let z=Q();o.appendChild(z.root),e.textContent=``,e.appendChild(o),X();let B=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,V=$({steps:n,controls:z,intervalMs:rM,onRender:R});V.jumpTo(Math.trunc(t.initialStep)||0);let H=null;return t.autoplay!==!1&&!B&&typeof IntersectionObserver==`function`&&(H=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){H.disconnect(),H=null,V.play();return}},{threshold:.35}),H.observe(o)),{destroy(){H&&=(H.disconnect(),null),V.destroy(),e.textContent=``,delete e.dataset.kmpMounted,document.getElementById(nM)?.remove()}}}var SM=`abababacaba`,CM=`abacaba`;function wM(e){let t=e.length,n=Array(t).fill(0),r=0;for(let i=1;i<t;i+=1){for(;r>0&&e[i]!==e[r];)r=n[r-1];e[i]===e[r]&&(r+=1),n[i]=r}return n}function TM(e={}){return{text:typeof e.text==`string`&&e.text.length>=1?e.text:SM,p:typeof e.p==`string`&&e.p.length>=1?e.p:CM}}function EM(e,t){let n=e.length,r=t.length,i=0;for(let a=0;a+r<=n;a+=1){let n=0;for(;n<r&&(i+=1,e[a+n]===t[n]);)n+=1;if(n===r)break}return i}function DM(e={}){let{text:t,p:n}=TM(e),r=n.length,i=t.length,a=wM(n),o=EM(t,n),s=[],c=0,l=0,u=0,d=!1,f=-1,p=(e,u,p={})=>{s.push({phase:e,desc:u,text:t,p:n,n:r,m:i,next:a.slice(),i:-1,jBefore:c,jAfter:c,tch:``,pch:``,match:!1,matched:c,found:d,index:f,kmpComparisons:l,bruteComparisons:o,done:e===`done`,...p})};p(`init`,`主串 text = "${t}"（${i} 个字符），模式串 p = "${n}"（${r} 个字符），借用动画一算好的 \`next = [${a.join(`,`)}]\`。匹配时把 \`j\` 当作「已匹配的模式串前缀长度」：\`text[i]\` 与 \`p[j]\` 相等就 \`j += 1\`，一旦 \`j == n\` 就命中；不等且 \`j > 0\` 时 **主串指针 i 一动不动**，只把 \`j\` 退到 \`next[j-1]\` 接着比。这正是 next 数组的用武之地 —— 暴力匹配会在每个失配处从 \`i - j + 1\` 重新开始，而 KMP 把 \`i\` 领着一路向前、永不回头。`);outer:for(let e=0;e<i;e+=1){let i=!1;for(;c>0;){let r=t[e],o=n[c],s=r===o;l+=1;let d=c,f=s?c+1:c;if(p(`compare`,`比较 \`text[${e}] = '${r}'\` 与 \`p[${d}] = '${o}'\`：**${s?`相等`:`不等`}**。`+(s?`已匹配的模式串前缀长到 ${f}。`:`不等 —— 但 \`i\` 不动，把 \`j\` 退到 \`next[${d-1}] = ${a[d-1]}\` 接着比。`),{i:e,jBefore:d,jAfter:f,tch:r,pch:o,match:s,matched:f}),s){c=f,i=!0;break}let m=a[d-1];u+=1,p(`retreat`,`回退：\`j\` 从 ${d} 跳到 \`next[${d-1}] = ${m}\`。**主串指针 \`i\` 一动不动**，只换了个更短的候选前缀，继续和同一个 \`text[${e}]\` 比 —— 已匹配的那段 \`p[0..${d-1}]\` 里本就藏着长度 ${m} 的相等前后缀，不用重比。`,{i:e,jBefore:d,jAfter:m,tch:r,pch:o,match:!1,matched:m}),c=m}if(!i){let r=t[e],a=n[0],o=r===a;l+=1;let s=+!!o;p(`compare`,`\`j = 0\`：直接拿 \`text[${e}] = '${r}'\` 与 \`p[0] = '${a}'\` 比，**${o?`相等`:`不等`}**。`+(o?`起步了，已匹配前缀长到 1。`:"`j` 停在 0，看主串的下一个字符。"),{i:e,jBefore:0,jAfter:s,tch:r,pch:a,match:o,matched:s}),c=s,o&&(i=!0)}if(c===r){d=!0,f=e-r+1,p(`found`,`\`j == n = ${r}\` —— **命中！** 起点下标 = \`i - n + 1 = ${e} - ${r} + 1 = ${f}\`。这一段的模式串与 \`text[${f}..${e}] = "${t.slice(f,e+1)}"\` 逐字相等。回头数代价：KMP 只比了 ${l} 次，暴力要 ${o} 次 —— 差别就出在命中前，暴力在 \`s = 0, 1, 2, 3\` 每个起点都要**从头重比**。`,{i:e,jBefore:r-1,jAfter:r,tch:t[e],pch:n[r-1],match:!0,matched:r});break outer}}return d?p(`done`,`返回 **${f}**：模式串 \`p\` 在主串里第一次出现于下标 ${f}。KMP 的 \`O(n + m)\` 来自 **主串指针永不回头**：整个匹配过程中 \`i\` 只往前走 m 步，\`j\` 的回退总量也不超过它的前进总量，所以总比较次数是线性的 —— 这正是 next 数组买来的东西。（本例 KMP ${l} 次 vs 暴力 ${o} 次。）`,{i:-1,jBefore:r,jAfter:r,matched:r,done:!0}):p(`done`,"主串扫描完，`j` 始终没到 `n` —— **没找到模式串**，返回 `-1`。",{i:-1,jBefore:c,jAfter:c,matched:c,done:!0}),s}var OM=`kmp-match-styles`,kM=1e3,AM=680,jM=22,MM=44,NM=52,PM=44,FM=114,IM=44,LM=171,RM=188,zM=206,BM=234,VM=44,HM=292,UM=58,WM=368,GM=390,KM=`
.lk2 { display: flex; flex-direction: column; gap: 14px; }
.lk2__svg { width: 100%; height: auto; display: block; }

.lk2-note {
  fill: var(--lk2-muted, #657168); font-size: 12.5px; text-anchor: start;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-note--r { text-anchor: end; }
.lk2-side {
  fill: var(--lk2-dim, #9aa39c); font-size: 11px; text-anchor: end;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-idx {
  fill: var(--lk2-dim, #9aa39c); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.lk2-cell__box {
  fill: var(--lk2-fill, #ffffff); stroke: var(--lk2-line, #c3c9c2); stroke-width: 1.6;
}
.lk2-cell__ch {
  fill: var(--lk2-ink, #1f2a24); font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-cell.is-window .lk2-cell__box { fill: var(--lk2-ok-fill, #eef5f1); stroke: var(--lk2-ok, #3f6b57); }
.lk2-cell.is-window .lk2-cell__ch { fill: var(--lk2-ok, #3f6b57); }
.lk2-cell.is-hot .lk2-cell__box { stroke: var(--lk2-hot, #a45f45); stroke-width: 3.2; }
.lk2-cell.is-hot .lk2-cell__ch { fill: var(--lk2-hot, #a45f45); }
.lk2-cell.is-match .lk2-cell__box { fill: var(--lk2-ok-fill, #eef5f1); stroke: var(--lk2-ok, #3f6b57); stroke-width: 3.2; }
.lk2-cell.is-match .lk2-cell__ch { fill: var(--lk2-ok, #3f6b57); }
.lk2-cell.is-gap .lk2-cell__box { fill: var(--lk2-muted-fill, #f7f6f2); stroke: var(--lk2-line, #c3c9c2); stroke-dasharray: 4 3; }
.lk2-cell.is-found .lk2-cell__box { fill: var(--lk2-gold-fill, #fdf3e3); stroke: var(--lk2-gold, #c2872f); stroke-width: 3.2; }
.lk2-cell.is-found .lk2-cell__ch { fill: var(--lk2-gold, #c2872f); }

.lk2-pcell__box {
  fill: var(--lk2-fill, #ffffff); stroke: var(--lk2-line, #c3c9c2); stroke-width: 1.6;
}
.lk2-pcell__ch {
  fill: var(--lk2-ink, #1f2a24); font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-pcell.is-window .lk2-pcell__box { fill: var(--lk2-ok-fill, #eef5f1); stroke: var(--lk2-ok, #3f6b57); }
.lk2-pcell.is-window .lk2-pcell__ch { fill: var(--lk2-ok, #3f6b57); }
.lk2-pcell.is-hot .lk2-pcell__box { stroke: var(--lk2-hot, #a45f45); stroke-width: 3.2; }
.lk2-pcell.is-hot .lk2-pcell__ch { fill: var(--lk2-hot, #a45f45); }
.lk2-pcell.is-to .lk2-pcell__box { stroke: var(--lk2-ok, #3f6b57); stroke-width: 3.2; }
.lk2-pcell.is-to .lk2-pcell__ch { fill: var(--lk2-ok, #3f6b57); }
.lk2-pcell.is-match .lk2-pcell__box { fill: var(--lk2-ok-fill, #eef5f1); stroke: var(--lk2-ok, #3f6b57); stroke-width: 3.2; }
.lk2-pcell.is-match .lk2-pcell__ch { fill: var(--lk2-ok, #3f6b57); }
.lk2-pcell.is-found .lk2-pcell__box { fill: var(--lk2-gold-fill, #fdf3e3); stroke: var(--lk2-gold, #c2872f); stroke-width: 3.2; }
.lk2-pcell.is-found .lk2-pcell__ch { fill: var(--lk2-gold, #c2872f); }

.lk2-chip__dot { fill: var(--lk2-fill, #ffffff); stroke: var(--lk2-chrome, #657168); stroke-width: 1.6; }
.lk2-chip__t { fill: var(--lk2-chrome, #657168); font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.lk2-chip--i .lk2-chip__dot { stroke: var(--lk2-hot, #a45f45); }
.lk2-chip--i .lk2-chip__t { fill: var(--lk2-hot, #a45f45); }
.lk2-chip--j .lk2-chip__dot { stroke: var(--lk2-gold, #c2872f); }
.lk2-chip--j .lk2-chip__t { fill: var(--lk2-gold, #c2872f); }
.lk2-chip--jt .lk2-chip__dot { stroke: var(--lk2-ok, #3f6b57); }
.lk2-chip--jt .lk2-chip__t { fill: var(--lk2-ok, #3f6b57); }

.lk2-link { stroke: var(--lk2-hot, #a45f45); stroke-width: 2; fill: none; stroke-dasharray: 5 4; }

.lk2-banner__box { fill: var(--lk2-banner, #f4f3ef); stroke: var(--lk2-line, #c3c9c2); stroke-width: 1.5; }
.lk2-banner__text {
  fill: var(--lk2-hot, #a45f45); font-size: 13.5px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-banner__text.is-ok { fill: var(--lk2-ok, #3f6b57); }
.lk2-banner__text.is-gold { fill: var(--lk2-gold, #c2872f); }

.lk2-panel__box { fill: var(--lk2-fill, #ffffff); stroke: var(--lk2-line, #c3c9c2); stroke-width: 1.5; }
.lk2-panel__label {
  fill: var(--lk2-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-panel__num {
  fill: var(--lk2-ink, #1f2a24); font-size: 16px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-panel__num.is-gold { fill: var(--lk2-gold, #c2872f); }
.lk2-panel__num.is-ok { fill: var(--lk2-ok, #3f6b57); }
.lk2-panel__num.is-dead { fill: var(--lk2-dim, #9aa39c); }

.lk2-phase__text {
  fill: var(--lk2-muted, #657168); font-size: 13px; font-weight: 600; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
`;function qM(){if(document.getElementById(OM))return;let e=document.createElement(`style`);e.id=OM,e.textContent=KM,document.head.appendChild(e)}function JM(e,t={}){if(!e||e.dataset.kmpMatchMounted===`1`)return{destroy(){}};e.dataset.kmpMatchMounted=`1`,qM();let n=DM(t),{text:r,p:i,n:a,m:o}=n[0],s=Y,c=document.createElement(`div`);c.className=`viz lk2`;let l=document.createElement(`div`);l.className=`viz__stage`,c.appendChild(l);let u=Math.min(42,Math.floor((AM-56-(o-1)*6)/o)),d=(AM-(o*u+(o-1)*6))/2,f=u+6,p=e=>d+e*f,m=e=>p(e)+u/2,h=Math.max(13,Math.min(20,Math.round(u/2.2))),g=s(`svg`,{class:`viz__svg lk2__svg`,viewBox:`0 0 ${AM} ${GM}`,role:`img`,"aria-label":`KMP 字符串匹配推演动画`}),_=s(`g`,{}),v=s(`g`,{}),y=s(`g`,{}),b=s(`g`,{});g.append(_,v,y,b),l.appendChild(g);let x=s(`text`,{class:`lk2-note`,x:26,y:jM});x.textContent=`KMP：text[i] 与 p[j] 比，失配只回退 j，i 永不回头`,b.appendChild(x);let S=s(`text`,{class:`lk2-note lk2-note--r`,x:AM-26,y:jM});S.textContent=`text = "${r}" · p = "${i}"`,b.appendChild(S);let C=(e,t)=>{let n=s(`text`,{class:`lk2-side`,x:d-12,y:t});n.textContent=e,b.appendChild(n)};C(`text`,74),C(`p`,136);let w=[];for(let e=0;e<o;e+=1){let t=s(`text`,{class:`lk2-idx`,x:m(e),y:MM});t.textContent=String(e),b.appendChild(t);let n=s(`g`,{class:`lk2-cell`});n.appendChild(s(`rect`,{class:`lk2-cell__box`,x:p(e),y:NM,width:u,height:PM,rx:6}));let i=s(`text`,{class:`lk2-cell__ch`,x:m(e),y:74,style:`font-size: ${h}px`});i.textContent=r[e],n.appendChild(i),_.appendChild(n),w.push({g:n,ch:i})}let T=[];for(let e=0;e<a;e+=1){let t=s(`g`,{class:`lk2-pcell`});t.appendChild(s(`rect`,{class:`lk2-pcell__box`,x:p(e),y:FM,width:u,height:IM,rx:6}));let n=s(`text`,{class:`lk2-pcell__ch`,x:p(e)+u/2,y:136,style:`font-size: ${h}px`});n.textContent=i[e],t.appendChild(n);let r=s(`text`,{class:`lk2-idx`,x:p(e)+u/2,y:LM});r.textContent=String(e),t.appendChild(r),v.appendChild(t),T.push({g:t,ch:n})}let E=e=>{let t=s(`g`,{class:`lk2-chip ${e}`});t.appendChild(s(`circle`,{class:`lk2-chip__dot`,cx:0,cy:0,r:10}));let n=s(`text`,{class:`lk2-chip__t`,x:0,y:0,style:`font-size: 12px`});return t.append(n),b.appendChild(t),{g:t,t:n}},D=E(`lk2-chip--i`);D.t.textContent=`i`;let O=E(`lk2-chip--j`);O.t.textContent=`j`;let k=E(`lk2-chip--jt`);k.t.textContent=`j`;let A=(e,t,n)=>e.g.setAttribute(`transform`,`translate(${t.toFixed(1)}, ${n})`),j=s(`path`,{class:`lk2-link`,d:``});y.appendChild(j),b.appendChild(s(`rect`,{class:`lk2-banner__box`,x:26,y:BM,width:AM-52,height:VM,rx:9}));let M=s(`text`,{class:`lk2-banner__text`,x:AM/2,y:256});b.appendChild(M),b.appendChild(s(`rect`,{class:`lk2-panel__box`,x:26,y:HM,width:AM-52,height:UM,rx:9}));let N=(e,t)=>{let n=AM/2+(t-4/2)*116,r=s(`text`,{class:`lk2-panel__label`,x:n,y:308});r.textContent=e;let i=s(`text`,{class:`lk2-panel__num`,x:n,y:332});return b.append(r,i),i},P=N(`i`,0),F=N(`j`,1),I=N(`KMP 比较`,2),L=N(`暴力 比较`,3),R=N(`命中下标`,4),z=s(`text`,{class:`lk2-phase__text`,x:AM/2,y:WM});b.appendChild(z);let B=document.createElement(`p`);B.className=`viz__desc`,B.setAttribute(`aria-live`,`polite`);function V(e,t){if(!t)return;let{phase:n,i:r,jBefore:i,jAfter:s,match:c,matched:l,found:u,index:d,kmpComparisons:p,bruteComparisons:h}=t,g=n===`compare`,_=n===`retreat`,v=n===`found`||n===`done`&&u,y=n===`init`,b=n===`done`,x=e=>{let t=e;return t<0&&(t=0),o>=a&&t+a>o&&(t=o-a),t},S,C;v?(S=a,C=x(d)):r>=0?(S=i,C=x(r-i)):(S=0,C=x(0));let E=C*f;T.forEach(e=>e.g.setAttribute(`transform`,`translate(${E.toFixed(1)}, 0)`)),w.forEach((e,t)=>{let n=[`lk2-cell`];S>0&&t>=C&&t<=C+S-1&&n.push(`is-window`),(g||_)&&t===r&&n.push(`is-hot`),g&&c&&t===r&&n.push(`is-match`),v&&t>=d&&t<=d+a-1&&n.push(`is-found`),e.g.setAttribute(`class`,n.join(` `))}),T.forEach((e,t)=>{let n=[`lk2-pcell`];S>0&&t<=S-1&&n.push(`is-window`),(g||_)&&t===i&&n.push(`is-hot`),g&&c&&t===i&&n.push(`is-match`),_&&t===s&&n.push(`is-to`),v&&n.push(`is-found`),e.g.setAttribute(`class`,n.join(` `))});let N=r>=0;if(D.g.style.display=N?``:`none`,N&&A(D,m(r),RM),g||_)if(O.g.style.display=``,A(O,m(C+i),zM),_){k.g.style.display=``,A(k,m(C+s),RM);let e=m(C+i),t=m(C+s);j.setAttribute(`d`,`M ${e.toFixed(1)} ${136 .toFixed(1)} Q ${((e+t)/2).toFixed(1)} ${162 .toFixed(1)} ${t.toFixed(1)} ${136 .toFixed(1)}`),j.style.display=``}else k.g.style.display=`none`,j.style.display=`none`;else O.g.style.display=`none`,k.g.style.display=`none`,j.style.display=`none`;y?(M.textContent=`在 text 里找 p：先从上一张动画借来 next 表`,M.setAttribute(`class`,`lk2-banner__text`)):g?(M.textContent=`text[${r}] = '${t.tch}'  vs  p[${i}] = '${t.pch}'   →   ${c?`相等 ✓`:`不等 ✗`}`,M.setAttribute(`class`,`lk2-banner__text`+(c?` is-ok`:``))):_?(M.textContent=`不等   →   j = next[${i-1}] = ${s}（i 不动）`,M.setAttribute(`class`,`lk2-banner__text`)):v?(M.textContent=`命中！起点 index = i - n + 1 = ${d}`,M.setAttribute(`class`,`lk2-banner__text is-gold`)):(M.textContent=u?`返回 ${d}：p 首次出现于下标 ${d}`:`未找到 → 返回 -1`,M.setAttribute(`class`,`lk2-banner__text`+(u?` is-ok`:``))),P.textContent=y||b&&!u?`—`:r>=0?String(r):`—`,P.setAttribute(`class`,`lk2-panel__num`),F.textContent=String(l),F.setAttribute(`class`,`lk2-panel__num`+(l>0?` is-gold`:``)),I.textContent=String(p),I.setAttribute(`class`,`lk2-panel__num`+(b?` is-ok`:``)),L.textContent=String(h),L.setAttribute(`class`,`lk2-panel__num is-dead`),R.textContent=d>=0?String(d):`—`,R.setAttribute(`class`,`lk2-panel__num`+(b?u?` is-ok`:` is-dead`:d>=0?` is-gold`:``)),y?z.textContent=`j = 已匹配的模式串前缀长度；i = 主串游标`:g?z.textContent=c?`相等 → j 前进，i 下一格`:`不等 → i 不动，只回退 j`:_?z.textContent=`j = next[j-1]：主串指针 i 不回退 —— 这就是 KMP 快的原因`:v?z.textContent=`j == n → 命中，起点 = i - n + 1`:z.textContent=u?`主串指针永不回头 → 总比较 O(n + m)`:`扫完未命中 → 返回 -1`,Z(B,t.desc)}c.appendChild(B);let H=Q();c.appendChild(H.root),e.textContent=``,e.appendChild(c),X();let U=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches,ee=$({steps:n,controls:H,intervalMs:kM,onRender:V});ee.jumpTo(Math.trunc(t.initialStep)||0);let te=null;return t.autoplay!==!1&&!U&&typeof IntersectionObserver==`function`&&(te=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){te.disconnect(),te=null,ee.play();return}},{threshold:.35}),te.observe(c)),{destroy(){te&&=(te.disconnect(),null),ee.destroy(),e.textContent=``,delete e.dataset.kmpMatchMounted,document.getElementById(OM)?.remove()}}}var YM=[`innerHTML`],XM=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,ZM=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,QM=`0.16.21`,$M=`11.4.1`,eN=y({__name:`MarkdownView`,props:{html:{type:String,default:``},title:{type:String,default:``}},setup(r){let i=r,a=t(null),c=v(()=>ut(lt.sanitize(i.html,{ADD_ATTR:[`target`,`rel`],FORBID_TAGS:[`style`,`iframe`,`object`,`embed`,`form`],FORBID_ATTR:[`onerror`,`onload`,`onclick`]}),i.title));function u(e){e.classList.add(`copied`),e.innerHTML=ZM,setTimeout(()=>{e.classList.remove(`copied`),e.innerHTML=XM},2e3)}function d(){a.value&&a.value.querySelectorAll(`table`).forEach(e=>{if(e.parentElement?.classList.contains(`table-scroll`))return;let t=document.createElement(`div`);t.className=`table-scroll`,e.parentNode.insertBefore(t,e),t.appendChild(e)})}function f(){a.value&&a.value.querySelectorAll(`pre`).forEach(e=>{if(e.parentElement?.classList.contains(`code-block-wrapper`))return;let t=document.createElement(`div`);t.className=`code-block-wrapper`,e.parentNode.insertBefore(t,e),t.appendChild(e);let n=document.createElement(`button`);n.className=`copy-btn`,n.title=`复制代码`,n.innerHTML=XM,n.addEventListener(`click`,()=>{let t=(e.querySelector(`code`)||e).textContent||``;navigator.clipboard.writeText(t).then(()=>{u(n)}).catch(()=>{let e=document.createElement(`textarea`);e.value=t,e.style.position=`fixed`,e.style.opacity=`0`,document.body.appendChild(e),e.select(),document.execCommand(`copy`),document.body.removeChild(e),u(n)})}),t.appendChild(n)})}function p(e,t){return new Promise((n,r)=>{if(document.querySelector(`link[data-lib-href="${e}"]`))return n();let i=document.createElement(`link`);i.rel=`stylesheet`,i.href=e,i.integrity=t,i.crossOrigin=`anonymous`,i.dataset.libHref=e,i.onload=()=>n(),i.onerror=()=>r(Error(`Failed to load stylesheet `+e)),document.head.appendChild(i)})}function m(e,t){return new Promise((n,r)=>{if(document.querySelector(`script[data-lib-src="${e}"]`))return n();let i=document.createElement(`script`);i.src=e,i.integrity=t,i.crossOrigin=`anonymous`,i.dataset.libSrc=e,i.onload=()=>n(),i.onerror=()=>r(Error(`Failed to load script `+e)),document.head.appendChild(i)})}let h=null;async function g(){return h||=Promise.all([p(`https://cdn.jsdelivr.net/npm/katex@${QM}/dist/katex.min.css`,`sha384-zh0CIslj+VczCZtlzBcjt5ppRcsAmDnRem7ESsYwWwg3m/OaJ2l4x7YBZl9Kxxib`),m(`https://cdn.jsdelivr.net/npm/katex@${QM}/dist/katex.min.js`,`sha384-Rma6DA2IPUwhNxmrB/7S3Tno0YY7sFu9WSYMCuulLhIqYSGZ2gKCJWIqhBWqMQfh`)]).then(()=>window.katex),h}let _=null;async function y(){return _||=m(`https://cdn.jsdelivr.net/npm/mermaid@${$M}/dist/mermaid.min.js`,`sha384-rbtjAdnIQE/aQJGEgXrVUlMibdfTSa4PQju4HDhN3sR2PmaKFzhEafuePsl9H/9I`).then(()=>window.mermaid),_}async function b(){if(!a.value)return;let e=a.value.querySelectorAll(`code.language-mermaid`);if(e.length)try{let t=await y();e.forEach(e=>{let n=e.closest(`pre`);if(!n||n.dataset.mermaidRendered)return;n.dataset.mermaidRendered=`1`;let r=document.createElement(`div`);r.className=`mermaid-container`,r.textContent=e.textContent,n.parentNode.replaceChild(r,n),t.run({nodes:[r]})})}catch(e){console.warn(`Mermaid failed to load/render:`,e?.message||e)}a.value.querySelectorAll(`img`).forEach(e=>{let t=e.getAttribute(`src`)||``;e.getAttribute(`alt`);let n=t.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);if(n){let t=document.createElement(`div`);t.className=`video-wrapper`,t.innerHTML=`<iframe src="https://www.youtube.com/embed/${n[1]}" frameborder="0" allowfullscreen></iframe>`,e.parentNode.replaceChild(t,e);return}let r=t.match(/bilibili\.com\/video\/(BV[\w]+)/);if(r){let t=document.createElement(`div`);t.className=`video-wrapper`,t.innerHTML=`<iframe src="https://player.bilibili.com/player.html?bvid=${r[1]}" frameborder="0" allowfullscreen></iframe>`,e.parentNode.replaceChild(t,e);return}});let t=/(\$\$[\s\S]+?\$\$|\$[^\s$](?:[^$]*[^\s$])?\$)/,n=document.createTreeWalker(a.value,NodeFilter.SHOW_TEXT),r=[],i;for(;i=n.nextNode();)!i.nodeValue||!t.test(i.nodeValue)||i.parentElement?.closest(`pre, code`)||r.push(i);if(r.length)try{let e=await g();for(let n of r){let r=document.createDocumentFragment();for(let i of n.nodeValue.split(t)){if(!i)continue;let t=i.startsWith(`$$`)&&i.endsWith(`$$`)&&i.length>3,n=!t&&i.startsWith(`$`)&&i.endsWith(`$`)&&i.length>2;if(!t&&!n){r.appendChild(document.createTextNode(i));continue}let a=i.slice(t?2:1,t?-2:-1),o=document.createElement(`span`);o.innerHTML=e.renderToString(a,{displayMode:t,throwOnError:!1}),r.appendChild(o)}n.parentNode.replaceChild(r,n)}}catch(e){console.warn(`KaTeX failed to load/render:`,e?.message||e)}}let x={"algo-viz--lc206":It,"algo-viz--lc21":an,"algo-viz--lc23":In,"algo-viz--lc23dc":tr,"algo-viz--lc141":Or,"algo-viz--lc142":Hr,"algo-viz--lc19":si,"algo-viz--lc143":Oi,"algo-viz--lc234":Zi,"algo-viz--lc160":Sa,"algo-viz--lc82":Ka,"algo-viz--lc102":so,"algo-viz--lc236":So,"algo-viz--lc124":Fo,"algo-viz--lc104":Jo,"algo-viz--lc226":cs,"algo-viz--lc3":ks,"algo-viz--lc1":qs,"algo-viz--lc15":_c,"algo-viz--lc42":zc,"algo-viz--lc42stack":ll,"algo-viz--lc53":jl,"algo-viz--lc215":$l,"algo-viz--lc347":bu,"algo-viz--lc56":Iu,"algo-viz--lc33":Qu,"algo-viz--lc153":pd,"algo-viz--lc189":Md,"algo-viz--lc415":af,"algo-viz--lc165":wf,"algo-viz--lc5":Vf,"algo-viz--lc93":sp,"algo-viz--lc20":Op,"algo-viz--lc239":Qp,"algo-viz--lc300dp":bm,"algo-viz--lc300binary":Wm,"algo-viz--lc72":ph,"algo-viz--lc72roll":mh,"algo-viz--lc70":Dh,"algo-viz--lc70over":Oh,"algo-viz--lc70rec":Rh,"algo-viz--nim":Jh,"algo-viz--lc877":rg,"algo-viz--varpart":hg,"algo-viz--spiral":Eg,"algo-viz--spiralccw":Dg,"algo-viz--kthlarge":Rg,"algo-viz--kthdup":zg,"algo-viz--lc233":__,"algo-viz--lc233block":B_,"algo-viz--poker61":gv,"algo-viz--poker61bug":Hv,"algo-viz--lcs1":dy,"algo-viz--lcs1walk":By,"algo-viz--bitmap":hb,"algo-viz--bitmap2bit":Ub,"algo-viz--lc155":ax,"algo-viz--lc232":Cx,"algo-viz--lc224":Gx,"algo-viz--lc772":mS,"algo-viz--lc704":PS,"algo-viz--lc69":$S,"algo-viz--lc121":vC,"algo-viz--lc122":LC,"algo-viz--lc322":cw,"algo-viz--lc322order":Iw,"algo-viz--lc139":iT,"algo-viz--lc139seg":DT,"algo-viz--lc1262":ZT,"algo-viz--lc1262dp":xE,"algo-viz--lc200":WE,"algo-viz--lc200uf":fD,"algo-viz--lc994":LD,"algo-viz--lc994dist":cO,"algo-viz--lc207":TO,"algo-viz--lc207dfs":BO,"algo-viz--lc146":ck,"algo-viz--lc146lfu":kk,"algo-viz--lc470":Kk,"algo-viz--lc470uni":lA,"algo-viz--txelim":NA,"algo-viz--txorder":ej,"algo-viz--lc1928":Cj,"algo-viz--lc1928path":Qj,"algo-viz--kmp":xM,"algo-viz--kmpmatch":JM},S=[];function w(){S.forEach(e=>{try{e?.destroy?.()}catch(e){console.warn(`Algo viz teardown failed:`,e?.message||e)}}),S=[]}function T(){a.value&&(w(),a.value.querySelectorAll(`.algo-viz`).forEach(e=>{let t=Object.keys(x).find(t=>e.classList.contains(t));if(t)try{S.push(x[t](e))}catch(e){console.warn(`Algo viz failed to mount:`,t,e?.message||e)}}))}return n(()=>{C(()=>{T(),b(),d(),f()})}),o(w),e(()=>i.html,()=>{C(()=>{T(),b(),d(),f()})}),(e,t)=>(s(),l(`div`,{ref_key:`bodyRef`,ref:a,class:`markdown-body`,innerHTML:c.value},null,8,YM))}},[[`__scopeId`,`data-v-672192ca`]]);function tN(e){return T.get(`/articles/${e}/comments/`)}function nN(e,t){return T.post(`/articles/${e}/comments/`,t)}var rN={key:0,class:`form-title`},iN={key:1,class:`form-title`},aN={class:`form-field`},oN={key:0,class:`field-error`},sN={class:`form-field`},cN={key:0,class:`field-error`},lN={class:`hp-field`,"aria-hidden":`true`},uN={class:`form-field`},dN={key:0,class:`field-error`},fN={key:0,class:`submit-error`},pN={key:1,class:`submit-success`},mN={class:`form-actions`},hN=[`disabled`],gN={key:0,class:`spinner`},_N={key:1},vN=y({__name:`CommentForm`,props:{articleSlug:{type:String,required:!0},parentId:{type:[Number,String],default:null}},emits:[`submitted`,`cancel`],setup(e,{emit:n}){let r=e,a=n,o=w({author_name:``,author_email:``,content:``,website:``}),u=w({author_name:``,author_email:``,content:``}),f=t(!1),p=t(null),m=t(!1);function h(){let e=!0;return u.author_name=``,u.author_email=``,u.content=``,o.author_name.trim()||(u.author_name=`请输入昵称`,e=!1),o.author_email.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.author_email)||(u.author_email=`邮箱格式不正确`,e=!1):(u.author_email=`请输入邮箱`,e=!1),o.content.trim()?o.content.trim().length<3&&(u.content=`评论内容至少3个字符`,e=!1):(u.content=`请输入评论内容`,e=!1),e}function g(e){u[e]&&(u[e]=``),p.value=null}async function _(){if(h()){f.value=!0,p.value=null;try{let e={author_name:o.author_name.trim(),author_email:o.author_email.trim(),content:o.content.trim(),website:o.website};r.parentId&&(e.parent=r.parentId),await nN(r.articleSlug,e),m.value=!0,setTimeout(()=>{m.value=!1},3e3),a(`submitted`),o.author_name=``,o.author_email=``,o.content=``}catch(e){let t=e?.response?.data;if(typeof t==`object`&&t){let e=t;e.author_name&&(u.author_name=Array.isArray(e.author_name)?e.author_name[0]:e.author_name),e.author_email&&(u.author_email=Array.isArray(e.author_email)?e.author_email[0]:e.author_email),e.content&&(u.content=Array.isArray(e.content)?e.content[0]:e.content),e.detail&&(p.value=e.detail),e.non_field_errors&&(p.value=Array.isArray(e.non_field_errors)?e.non_field_errors[0]:e.non_field_errors)}else typeof t==`string`?p.value=t:p.value=e.message||`提交失败，请稍后重试`}finally{f.value=!1}}}return(t,n)=>(s(),l(`div`,{class:x([`comment-form`,{"reply-form":!!e.parentId}])},[e.parentId?(s(),l(`h4`,rN,`回复评论`)):(s(),l(`h4`,iN,`发表评论`)),c(`form`,{onSubmit:j(_,[`prevent`]),class:`form-body`},[c(`div`,aN,[i(c(`input`,{"onUpdate:modelValue":n[0]||=e=>o.author_name=e,type:`text`,placeholder:`昵称 *`,class:x([`form-input`,{"input-error":u.author_name}]),onInput:n[1]||=e=>g(`author_name`)},null,34),[[E,o.author_name]]),u.author_name?(s(),l(`p`,oN,d(u.author_name),1)):b(``,!0)]),c(`div`,sN,[i(c(`input`,{"onUpdate:modelValue":n[2]||=e=>o.author_email=e,type:`email`,placeholder:`邮箱 *`,class:x([`form-input`,{"input-error":u.author_email}]),onInput:n[3]||=e=>g(`author_email`)},null,34),[[E,o.author_email]]),u.author_email?(s(),l(`p`,cN,d(u.author_email),1)):b(``,!0)]),c(`div`,lN,[i(c(`input`,{"onUpdate:modelValue":n[4]||=e=>o.website=e,type:`text`,tabindex:`-1`,autocomplete:`off`},null,512),[[E,o.website]])]),c(`div`,uN,[i(c(`textarea`,{"onUpdate:modelValue":n[5]||=e=>o.content=e,placeholder:`说点什么...`,rows:`4`,class:x([`form-textarea`,{"input-error":u.content}]),onInput:n[6]||=e=>g(`content`)},null,34),[[E,o.content]]),u.content?(s(),l(`p`,dN,d(u.content),1)):b(``,!0)]),p.value?(s(),l(`p`,fN,d(p.value),1)):b(``,!0),m.value?(s(),l(`p`,pN,`评论已提交！`)):b(``,!0),c(`div`,mN,[e.parentId?(s(),l(`button`,{key:0,type:`button`,class:`cancel-btn`,onClick:n[7]||=e=>t.$emit(`cancel`)},` 取消回复 `)):b(``,!0),c(`button`,{type:`submit`,class:`submit-btn`,disabled:f.value},[f.value?(s(),l(`span`,gN)):(s(),l(`span`,_N,`提交`))],8,hN)])],32)],2))}},[[`__scopeId`,`data-v-49410be9`]]),yN={class:`comment-list`},bN={class:`comments-title`},xN={key:0,class:`comments-count`},SN={key:0,class:`skeleton-comments`},CN={key:1,class:`empty-comments`},wN={key:2,class:`comments-tree`},TN={class:`comment-main`},EN={class:`comment-content`},DN={class:`comment-header`},ON={class:`comment-author`},kN={class:`comment-time`},AN={class:`comment-text`},jN=[`onClick`],MN={key:1,class:`replies`},NN={class:`comment-main`},PN={class:`comment-content`},FN={class:`comment-header`},IN={class:`comment-author`},LN={class:`comment-time`},RN={class:`comment-text`},zN=y({__name:`CommentList`,props:{articleSlug:{type:String,required:!0}},setup(e){let i=e,a=t([]),o=t(!0),f=t(null),m=v(()=>a.value.filter(e=>!e.parent));function y(e){f.value=f.value===e?null:e}async function x(){o.value=!0;try{let e=await tN(i.articleSlug);a.value=e.data.results||e.data||[]}catch{a.value=[]}finally{o.value=!1}}function S(){f.value=null,x()}function C(e){if(!e)return``;let t=Date.now()-new Date(e).getTime(),n=Math.floor(t/6e4),r=Math.floor(t/36e5),i=Math.floor(t/864e5);return n<1?`刚刚`:n<60?`${n}分钟前`:r<24?`${r}小时前`:i<30?`${i}天前`:i<365?`${Math.floor(i/30)}个月前`:`${Math.floor(i/365)}年前`}function w(e){let t=[`#3f6b57`,`#a45f45`,`#8a6c3f`,`#637b68`,`#7b6757`,`#4f7477`,`#8a635f`,`#6b7250`,`#536b5d`,`#9b704e`,`#65706a`,`#7b6a83`];if(!e)return t[0];let n=0;for(let t=0;t<e.length;t++)n=e.charCodeAt(t)+((n<<5)-n);return t[Math.abs(n)%t.length]}return n(x),(t,n)=>(s(),l(`div`,yN,[c(`h3`,bN,[n[1]||=g(` 评论 `,-1),a.value.length?(s(),l(`span`,xN,`(`+d(a.value.length)+`)`,1)):b(``,!0)]),o.value?(s(),l(`div`,SN,[(s(),l(p,null,r(3,e=>c(`div`,{key:e,class:`skeleton-comment`},[...n[2]||=[_(`<div class="skeleton-avatar" data-v-98dfce57></div><div class="skeleton-body" data-v-98dfce57><div class="skeleton-line w-30" data-v-98dfce57></div><div class="skeleton-line w-50" data-v-98dfce57></div><div class="skeleton-line w-80" data-v-98dfce57></div></div>`,2)]])),64))])):m.value.length?(s(),l(`div`,wN,[(s(!0),l(p,null,r(m.value,t=>(s(),l(`div`,{key:t.id,class:`comment-item`},[c(`div`,TN,[c(`div`,{class:`comment-avatar`,style:u({background:w(t.author_name)})},d(t.author_name?t.author_name.charAt(0).toUpperCase():`?`),5),c(`div`,EN,[c(`div`,DN,[c(`span`,ON,d(t.author_name),1),c(`span`,kN,d(C(t.created_at)),1)]),c(`p`,AN,d(t.content),1),c(`button`,{class:`reply-btn`,onClick:e=>y(t.id)},[...n[4]||=[c(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[c(`polyline`,{points:`9 17 4 12 9 7`}),c(`path`,{d:`M20 18v-2a4 4 0 0 0-4-4H4`})],-1),g(` 回复 `,-1)]],8,jN)])]),f.value===t.id?(s(),h(vN,{key:0,"article-slug":e.articleSlug,"parent-id":t.id,onSubmitted:S,onCancel:n[0]||=e=>f.value=null,class:`reply-form-wrapper`},null,8,[`article-slug`,`parent-id`])):b(``,!0),t.replies&&t.replies.length?(s(),l(`div`,MN,[(s(!0),l(p,null,r(t.replies,e=>(s(),l(`div`,{key:e.id,class:`comment-item reply-item`},[c(`div`,NN,[c(`div`,{class:`comment-avatar comment-avatar-sm`,style:u({background:w(e.author_name)})},d(e.author_name?e.author_name.charAt(0).toUpperCase():`?`),5),c(`div`,PN,[c(`div`,FN,[c(`span`,IN,d(e.author_name),1),c(`span`,LN,d(C(e.created_at)),1)]),c(`p`,RN,d(e.content),1)])])]))),128))])):b(``,!0)]))),128))])):(s(),l(`div`,CN,[...n[3]||=[c(`svg`,{width:`40`,height:`40`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`1.5`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[c(`path`,{d:`M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z`})],-1),c(`p`,null,`暂无评论，来说点什么吧`,-1)]]))]))}},[[`__scopeId`,`data-v-98dfce57`]]),BN={key:0,class:`toc-list-wrapper`},VN={class:`toc-list`},HN=[`href`,`title`,`onClick`],UN={class:`toc-text`},WN={key:1,class:`toc-empty-state`},GN=y({__name:`TocNav`,props:{html:{type:String,default:``}},setup(i){let a=i,u=t([]),f=t(null),m=null,h=[];function g(){if(!a.html){u.value=[];return}try{let e=new DOMParser().parseFromString(a.html,`text/html`),t=new Map;e.querySelectorAll(`a[href^="#"]`).forEach(e=>{let n=(e.getAttribute(`href`)||``).slice(1),r=(e.textContent||``).replace(/\s+/g,` `).trim();n&&r&&!t.has(r)&&t.set(r,n)});let n=[],r=new Set;e.querySelectorAll(`h2, h3, h4`).forEach((e,i)=>{let a=(e.textContent||``).replace(/\s+/g,` `).trim(),o=t.get(a),s=e.id||(o&&!r.has(o)?o:`toc-heading-${i}`);r.has(s)&&(s=`toc-heading-${i}`),r.add(s),n.push({id:s,tag:e.tagName.toLowerCase(),text:e.textContent||``})}),u.value=n}catch{u.value=[]}}function _(){if(!u.value.length)return;let e=document.querySelector(`.markdown-body`);e&&e.querySelectorAll(`h2, h3, h4`).forEach((e,t)=>{let n=u.value[t];n&&!e.id&&(e.id=n.id)})}function v(){m&&=(m.disconnect(),null),h=[],u.value.length&&(m=new IntersectionObserver(e=>{let t=e.filter(e=>e.isIntersecting);t.length?f.value=t[0].target.id:window.scrollY<100&&(f.value=u.value[0]?.id||null)},{rootMargin:`-80px 0px -60% 0px`,threshold:0}),C(()=>{u.value.forEach(e=>{let t=document.getElementById(e.id);t&&(m.observe(t),h.push(t))})}))}function y(e){let t=document.getElementById(e);t&&(t.scrollIntoView({behavior:`smooth`,block:`start`}),f.value=e)}return e(()=>a.html,()=>{g(),C(()=>{_(),v()})}),n(()=>{g(),C(()=>{_(),v()})}),o(()=>{m&&m.disconnect()}),(e,t)=>(s(),l(`nav`,{class:x([`toc-nav`,{"toc-empty":!u.value.length}])},[t[2]||=c(`h4`,{class:`toc-title`},`目录`,-1),u.value.length?(s(),l(`div`,BN,[c(`ul`,VN,[(s(!0),l(p,null,r(u.value,e=>(s(),l(`li`,{key:e.id,class:x([`toc-item`,[`toc-depth-${e.tag}`,{"toc-active":f.value===e.id}]])},[c(`a`,{href:`#`+e.id,class:`toc-link`,title:e.text,onClick:j(t=>y(e.id),[`prevent`])},[t[0]||=c(`span`,{class:`toc-dot`},null,-1),c(`span`,UN,d(e.text),1)],8,HN)],2))),128))])])):(s(),l(`div`,WN,[...t[1]||=[c(`p`,null,`无目录`,-1)]]))],2))}},[[`__scopeId`,`data-v-bbfd9863`]]),KN={class:`share-buttons`},qN={key:0,class:`copy-feedback`},JN=y({__name:`ShareButtons`,props:{title:{type:String,default:``},url:{type:String,default:``}},setup(e){let n=e,r=t(!1);function i(){let e=encodeURIComponent(n.url||window.location.href),t=encodeURIComponent(n.title);window.open(`https://service.weibo.com/share/share.php?url=${e}&title=${t}`,`_blank`,`noopener,noreferrer,width=600,height=400`)}function a(){let e=encodeURIComponent(n.url||window.location.href),t=encodeURIComponent(n.title);window.open(`https://twitter.com/intent/tweet?url=${e}&text=${t}`,`_blank`,`noopener,noreferrer,width=600,height=400`)}function o(){alert(`请复制链接后在微信中粘贴发送`)}async function u(){try{await navigator.clipboard.writeText(n.url||window.location.href),r.value=!0,setTimeout(()=>r.value=!1,2e3)}catch{let e=document.createElement(`textarea`);e.value=n.url||window.location.href,document.body.appendChild(e),e.select(),document.execCommand(`copy`),document.body.removeChild(e),r.value=!0,setTimeout(()=>r.value=!1,2e3)}}return(e,t)=>(s(),l(`div`,KN,[t[4]||=c(`span`,{class:`share-label`},`分享：`,-1),c(`button`,{class:`share-btn wechat`,title:`微信`,onClick:o},[...t[0]||=[c(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`},[c(`path`,{d:`M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.136 0 .241-.11.241-.245 0-.06-.024-.12-.04-.178l-.325-1.233a.49.49 0 0 1 .178-.554C23.028 18.48 24 16.82 24 14.98c0-3.21-2.931-5.952-7.062-6.122zm-2.18 2.769c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z`})],-1)]]),c(`button`,{class:`share-btn weibo`,title:`微博`,onClick:i},[...t[1]||=[c(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`},[c(`path`,{d:`M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zm-7.317-6.781c-1.059-.2-1.911.419-1.903 1.383.008.964.87 1.907 1.93 2.107 1.058.2 1.91-.419 1.903-1.383-.008-.964-.87-1.907-1.93-2.107zm2.13 3.68c-.563-.249-.754-.766-.428-1.153.326-.388 1.019-.523 1.58-.275.56.248.753.764.429 1.153-.326.386-1.018.524-1.581.275zm.992-3.808c-2.07-.028-4.538.537-7.344 2.641C-.405 17.1-.279 19.15.35 20.49c.528 1.123 1.494 1.773 2.43 2.144 4.878 1.935 10.857.606 13.679-1.35 2.934-2.035 4.033-4.771 3.157-7.165-.516-1.405-1.797-2.398-3.31-2.882l.06-.05c2.485-2.08 4.213-4.585 4.213-7.146 0-5.213-7.11-7.735-10.966-5.371-1.742 1.07-2.772 2.788-3.064 4.72.422-.12.865-.197 1.323-.23 3.271-.241 7.273.776 7.273 3.86 0 3.502-3.823 4.667-6.721 4.667-.89 0-1.785-.215-2.595-.598z`})],-1)]]),c(`button`,{class:`share-btn twitter`,title:`Twitter`,onClick:a},[...t[2]||=[c(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`},[c(`path`,{d:`M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z`})],-1)]]),c(`button`,{class:`share-btn copy`,title:`复制链接`,onClick:u},[...t[3]||=[c(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[c(`path`,{d:`M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71`}),c(`path`,{d:`M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71`})],-1)]]),r.value?(s(),l(`span`,qN,`已复制`)):b(``,!0)]))}},[[`__scopeId`,`data-v-857c6fb5`]]),YN={key:0,class:`related-section`},XN={class:`related-grid`},ZN={key:0,class:`related-cover`},QN=[`src`,`alt`],$N={class:`related-card-title`},eP=y({__name:`RelatedArticles`,props:{articles:{type:Array,default:()=>[]}},setup(e){return(t,n)=>{let i=a(`router-link`);return e.articles.length?(s(),l(`section`,YN,[n[0]||=c(`h3`,{class:`related-title`},`相关文章`,-1),c(`div`,XN,[(s(!0),l(p,null,r(e.articles,e=>(s(),h(i,{key:e.slug,to:`/article/`+e.slug,class:`related-card`},{default:m(()=>[e.cover_image?(s(),l(`div`,ZN,[c(`img`,{src:e.cover_image,alt:e.title,loading:`lazy`},null,8,QN)])):b(``,!0),c(`span`,$N,d(e.title),1)]),_:2},1032,[`to`]))),128))])])):b(``,!0)}}},[[`__scopeId`,`data-v-e3d8298c`]]),tP={class:`newsletter glass-card`},nP=[`disabled`],rP=[`disabled`],iP={key:0},aP={key:1},oP={key:2},sP=y({__name:`NewsletterForm`,setup(e){let n=t(``),r=t(!1),a=t(!1),o=t(``),u=t(``);async function f(){if(n.value.trim()){r.value=!0,o.value=``;try{let e=await T.post(`/subscribe/`,{email:n.value.trim()});a.value=!0,o.value=e.data.detail||`订阅成功！`,u.value=`msg-success`}catch(e){let t=e?.response?.data?.error||e?.response?.data?.detail||`订阅失败`;o.value=typeof t==`string`?t:`订阅失败，请稍后重试`,u.value=`msg-error`}finally{r.value=!1}}}return(e,t)=>(s(),l(`div`,tP,[t[1]||=_(`<h4 class="newsletter-title" data-v-54a32a66><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-54a32a66><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" data-v-54a32a66></path><polyline points="22,6 12,13 2,6" data-v-54a32a66></polyline></svg> 订阅更新 </h4><p class="newsletter-desc" data-v-54a32a66>新文章发布时，通过邮件通知你</p>`,2),c(`form`,{onSubmit:j(f,[`prevent`]),class:`newsletter-form`},[i(c(`input`,{"onUpdate:modelValue":t[0]||=e=>n.value=e,type:`email`,placeholder:`your@email.com`,class:`newsletter-input`,disabled:a.value,required:``},null,8,nP),[[E,n.value]]),c(`button`,{type:`submit`,class:`newsletter-btn`,disabled:r.value||a.value},[r.value?(s(),l(`span`,iP,`...`)):a.value?(s(),l(`span`,aP,`✓`)):(s(),l(`span`,oP,`订阅`))],8,rP)],32),o.value?(s(),l(`p`,{key:0,class:x(u.value)},d(o.value),3)):b(``,!0)]))}},[[`__scopeId`,`data-v-54a32a66`]]);function cP(e){if(!e)return 1;let t=(e.match(/[一-鿿㐀-䶿]/g)||[]).length+(e.match(/[a-zA-Z]+/g)||[]).length;return Math.max(1,Math.ceil(t/250))}function lP(e){return e?e.replace(/```[\s\S]*?```/g,``).replace(/`[^`]*`/g,``).replace(/!\[.*?\]\(.*?\)/g,``).replace(/\[([^\]]*)\]\(.*?\)/g,`$1`).replace(/[#*>`~\-+|_:]/g,` `).replace(/\s+/g,` `).trim():``}var uP={class:`page page-article-detail`},dP={key:0,class:`detail-skeleton`},fP={key:1,class:`error-state`},pP={key:2,class:`detail-layout`},mP={class:`detail-main`},hP={class:`article-header`},gP={class:`article-title`},_P={class:`article-meta`},vP={class:`meta-item meta-author`},yP={class:`meta-item meta-date`},bP={key:0,class:`meta-item meta-category neon-text-pink`},xP={class:`meta-item meta-reading-time`},SP={class:`meta-item meta-views`},CP={key:0,class:`article-tags`},wP={key:0,class:`article-cover`},TP=[`src`,`alt`],EP={key:1,class:`article-nav`},DP={class:`nav-title`},OP={class:`nav-title`},kP={class:`article-actions`},AP=[`disabled`],jP={class:`comment-section`},MP={class:`detail-sidebar`},NP=y({__name:`ArticleDetail`,setup(i){let o=k();O();let u=F(),y=t(null),C=t(!0),w=t(null),E=t(null),j=t(0),I=0,L=v(()=>y.value?.created_at?new Date(y.value.created_at).toLocaleDateString(`zh-CN`,{year:`numeric`,month:`2-digit`,day:`2-digit`}):``),R=v(()=>P(y.value?.author)),z=v(()=>N(y.value?.category)),B=v(()=>{let e=y.value?.tags;return!e||!Array.isArray(e)?[]:e.map(M).filter(Boolean)}),V=t(!1),H=t(!1),U=v(()=>window.location.origin+o.fullPath),ee=v(()=>y.value?y.value.reading_time?y.value.reading_time:cP(lP(y.value.content||``)):1),te=v(()=>y.value?JSON.stringify({"@context":`https://schema.org`,"@type":`Article`,headline:y.value.title,description:y.value.excerpt||``,image:y.value.cover_image||void 0,datePublished:y.value.created_at,dateModified:y.value.updated_at,author:{"@type":`Person`,name:D},publisher:{"@type":`Person`,name:D}}):``),W=null;e(te,e=>{if(!e){W?.remove(),W=null;return}W||(W=document.createElement(`script`),W.type=`application/ld+json`,W.dataset.articleJsonLd=`1`,document.head.appendChild(W)),W.textContent=e},{immediate:!0});async function G(){if(!(V.value||H.value)){H.value=!0;try{let e=await T.post(`/articles/${y.value.slug}/like/`);y.value&&(y.value.likes_count=e.data.likes_count),V.value=!0}catch{}finally{H.value=!1}}}async function K(){let e=o.params.slug,t=++I;if(!e){w.value=`缺少文章标识`,E.value=null,C.value=!1;return}C.value=!0,w.value=null,E.value=null,y.value=null,V.value=!1;try{let n=u.getArticleBySlug(e);if(n){if(t!==I)return;y.value=n,C.value=!1,ne();return}let r=await u.fetchArticleBySlug(e);if(t!==I)return;y.value=r,y.value?ne():w.value=`文章不存在`}catch(e){if(t!==I)return;E.value=e?.response?.status??null,E.value===404?w.value=`文章不存在`:w.value=e?.response?.data?.detail||e.message||`加载文章失败`}finally{t===I&&(C.value=!1)}}function ne(){y.value&&A({title:y.value.title,description:y.value.excerpt||``,image:y.value.cover_image||``,url:`${window.location.origin}/article/${y.value.slug}/`,type:`article`})}return n(K),e(()=>o.params.slug,()=>{window.scrollTo({top:0,behavior:`instant`}),j.value++,K()}),S(()=>{W?.remove(),W=null}),(e,t)=>{let n=a(`router-link`);return s(),l(`div`,uP,[C.value?(s(),l(`div`,dP,[...t[1]||=[_(`<div class="skeleton-header" data-v-1ee0e703><div class="skeleton-line w-80 skeleton-lg" data-v-1ee0e703></div><div class="skeleton-meta-row" data-v-1ee0e703><div class="skeleton-line w-20" data-v-1ee0e703></div><div class="skeleton-line w-15" data-v-1ee0e703></div><div class="skeleton-line w-10" data-v-1ee0e703></div></div></div><div class="skeleton-body" data-v-1ee0e703><div class="skeleton-line w-100" data-v-1ee0e703></div><div class="skeleton-line w-100" data-v-1ee0e703></div><div class="skeleton-line w-90" data-v-1ee0e703></div><div class="skeleton-line w-100" data-v-1ee0e703></div><div class="skeleton-line w-70" data-v-1ee0e703></div></div>`,2)]])):w.value?(s(),l(`div`,fP,[t[3]||=c(`svg`,{width:`48`,height:`48`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`1.5`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[c(`circle`,{cx:`12`,cy:`12`,r:`10`}),c(`line`,{x1:`12`,y1:`8`,x2:`12`,y2:`12`}),c(`line`,{x1:`12`,y1:`16`,x2:`12.01`,y2:`16`})],-1),c(`h2`,null,d(E.value===404?`文章不存在`:`加载失败`),1),c(`p`,null,d(w.value),1),f(n,{to:`/articles`,class:`back-link`},{default:m(()=>[...t[2]||=[g(`返回首页`,-1)]]),_:1})])):y.value?(s(),l(`div`,pP,[c(`article`,mP,[c(`header`,hP,[c(`h1`,gP,d(y.value.title),1),c(`div`,_P,[c(`span`,vP,[t[4]||=c(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[c(`path`,{d:`M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2`}),c(`circle`,{cx:`12`,cy:`7`,r:`4`})],-1),g(` `+d(R.value),1)]),c(`span`,yP,[t[5]||=_(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-1ee0e703><rect x="3" y="4" width="18" height="18" rx="2" ry="2" data-v-1ee0e703></rect><line x1="16" y1="2" x2="16" y2="6" data-v-1ee0e703></line><line x1="8" y1="2" x2="8" y2="6" data-v-1ee0e703></line><line x1="3" y1="10" x2="21" y2="10" data-v-1ee0e703></line></svg>`,1),g(` `+d(L.value),1)]),y.value.category?(s(),l(`span`,bP,[t[6]||=c(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[c(`path`,{d:`M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z`})],-1),g(` `+d(z.value),1)])):b(``,!0),c(`span`,xP,[t[7]||=c(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[c(`circle`,{cx:`12`,cy:`12`,r:`10`}),c(`polyline`,{points:`12 6 12 12 16 14`})],-1),g(` 约 `+d(ee.value)+` 分钟 `,1)]),c(`span`,SP,[t[8]||=c(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[c(`path`,{d:`M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z`}),c(`circle`,{cx:`12`,cy:`12`,r:`3`})],-1),g(` `+d(y.value.views_count||0),1)])]),B.value.length?(s(),l(`div`,CP,[(s(!0),l(p,null,r(B.value,(e,t)=>(s(),l(`span`,{key:t,class:`tag-pill`},d(e),1))),128))])):b(``,!0)]),y.value.cover_image?(s(),l(`div`,wP,[c(`img`,{src:y.value.cover_image,alt:y.value.title},null,8,TP)])):b(``,!0),f(eN,{html:y.value.html_content||y.value.content||``,title:y.value.title},null,8,[`html`,`title`]),y.value.prev_article||y.value.next_article?(s(),l(`nav`,EP,[y.value.prev_article?(s(),h(n,{key:0,to:`/article/`+(y.value.prev_article.slug||y.value.prev_article),class:`nav-link prev-link`},{default:m(()=>[t[9]||=c(`span`,{class:`nav-direction`},[c(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[c(`polyline`,{points:`15 18 9 12 15 6`})]),g(` 上一篇 `)],-1),c(`span`,DP,d(y.value.prev_article.title||y.value.prev_article),1)]),_:1},8,[`to`])):b(``,!0),y.value.next_article?(s(),h(n,{key:1,to:`/article/`+(y.value.next_article.slug||y.value.next_article),class:`nav-link next-link`},{default:m(()=>[t[10]||=c(`span`,{class:`nav-direction`},[g(` 下一篇 `),c(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[c(`polyline`,{points:`9 18 15 12 9 6`})])],-1),c(`span`,OP,d(y.value.next_article.title||y.value.next_article),1)]),_:1},8,[`to`])):b(``,!0)])):b(``,!0),c(`div`,kP,[f(JN,{title:y.value.title,url:U.value},null,8,[`title`,`url`]),c(`button`,{class:x([`like-btn`,{liked:V.value}]),disabled:H.value,onClick:G},[t[11]||=c(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`},[c(`path`,{d:`M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z`})],-1),c(`span`,null,d(y.value.likes_count||0),1)],10,AP)]),f(eP,{articles:y.value.related_articles||[]},null,8,[`articles`]),f(sP),c(`section`,jP,[(s(),h(zN,{"article-slug":y.value.slug,key:j.value},null,8,[`article-slug`])),f(vN,{"article-slug":y.value.slug,onSubmitted:t[0]||=e=>j.value++},null,8,[`article-slug`])])]),c(`aside`,MP,[f(GN,{html:y.value.html_content||y.value.content||``},null,8,[`html`])])])):b(``,!0)])}}},[[`__scopeId`,`data-v-1ee0e703`]]);export{NP as default};