import{A as e,C as t,D as n,E as r,R as i,S as a,b as o,c as s,d as c,dt as l,h as u,i as d,j as f,k as p,l as m,lt as h,m as g,p as _,s as v,t as y,u as b,ut as x,w as S,x as C,z as w}from"./_plugin-vue_export-helper-BK47PYcU.js";import{t as T}from"./client-DyaaoQco.js";import{f as E,p as D,v as O,y as k}from"./index-DTfaZeoE.js";import{i as A,n as j,t as ee}from"./labels-H7OcNmBE.js";import{t as te}from"./article-hLoBXJev.js";function M(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function N(e){if(Array.isArray(e))return e}function P(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r,i,a,o,s=[],c=!0,l=!1;try{if(a=(n=n.call(e)).next,t!==0)for(;!(c=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);c=!0);}catch(e){l=!0,i=e}finally{try{if(!c&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(l)throw i}}return s}}function ne(){throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function F(e,t){return N(e)||P(e,t)||I(e,t)||ne()}function I(e,t){if(e){if(typeof e==`string`)return M(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?M(e,t):void 0}}var re=Object.entries,ie=Object.setPrototypeOf,ae=Object.isFrozen,oe=Object.getPrototypeOf,L=Object.getOwnPropertyDescriptor,R=Object.freeze,z=Object.seal,se=Object.create,ce=typeof Reflect<`u`&&Reflect,le=ce.apply,B=ce.construct;R||=function(e){return e},z||=function(e){return e},le||=function(e,t){var n=[...arguments].slice(2);return e.apply(t,n)},B||=function(e){return new e(...[...arguments].slice(1))};var ue=G(Array.prototype.forEach),de=G(Array.prototype.lastIndexOf),fe=G(Array.prototype.pop),pe=G(Array.prototype.push),me=G(Array.prototype.splice),he=Array.isArray,ge=G(String.prototype.toLowerCase),_e=G(String.prototype.toString),ve=G(String.prototype.match),ye=G(String.prototype.replace),be=G(String.prototype.indexOf),xe=G(String.prototype.trim),Se=G(Number.prototype.toString),V=G(Boolean.prototype.toString),Ce=typeof BigInt>`u`?null:G(BigInt.prototype.toString),H=typeof Symbol>`u`?null:G(Symbol.prototype.toString),U=G(Object.prototype.hasOwnProperty),we=G(Object.prototype.toString),W=G(RegExp.prototype.test),Te=Ee(TypeError);function G(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);var n=[...arguments].slice(1);return le(e,t,n)}}function Ee(e){return function(){return B(e,[...arguments])}}function K(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:ge;if(ie&&ie(e,null),!he(t))return e;let r=t.length;for(;r--;){let i=t[r];if(typeof i==`string`){let e=n(i);e!==i&&(ae(t)||(t[r]=e),i=e)}e[i]=!0}return e}function De(e){for(let t=0;t<e.length;t++)U(e,t)||(e[t]=null);return e}function q(e){let t=se(null);for(let r of re(e)){var n=F(r,2);let i=n[0],a=n[1];U(e,i)&&(he(a)?t[i]=De(a):a&&typeof a==`object`&&a.constructor===Object?t[i]=q(a):t[i]=a)}return t}function Oe(e){switch(typeof e){case`string`:return e;case`number`:return Se(e);case`boolean`:return V(e);case`bigint`:return Ce?Ce(e):`0`;case`symbol`:return H?H(e):`Symbol()`;case`undefined`:return we(e);case`function`:case`object`:{if(e===null)return we(e);let t=e,n=ke(t,`toString`);if(typeof n==`function`){let e=n(t);return typeof e==`string`?e:we(e)}return we(e)}default:return we(e)}}function ke(e,t){for(;e!==null;){let n=L(e,t);if(n){if(n.get)return G(n.get);if(typeof n.value==`function`)return G(n.value)}e=oe(e)}function n(){return null}return n}function Ae(e){try{return W(e,``),!0}catch{return!1}}var je=R(`a.abbr.acronym.address.area.article.aside.audio.b.bdi.bdo.big.blink.blockquote.body.br.button.canvas.caption.center.cite.code.col.colgroup.content.data.datalist.dd.decorator.del.details.dfn.dialog.dir.div.dl.dt.element.em.fieldset.figcaption.figure.font.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.img.input.ins.kbd.label.legend.li.main.map.mark.marquee.menu.menuitem.meter.nav.nobr.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.section.select.shadow.slot.small.source.spacer.span.strike.strong.style.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.track.tt.u.ul.var.video.wbr`.split(`.`)),Me=R(`svg.a.altglyph.altglyphdef.altglyphitem.animatecolor.animatemotion.animatetransform.circle.clippath.defs.desc.ellipse.enterkeyhint.exportparts.filter.font.g.glyph.glyphref.hkern.image.inputmode.line.lineargradient.marker.mask.metadata.mpath.part.path.pattern.polygon.polyline.radialgradient.rect.stop.style.switch.symbol.text.textpath.title.tref.tspan.view.vkern`.split(`.`)),Ne=R([`feBlend`,`feColorMatrix`,`feComponentTransfer`,`feComposite`,`feConvolveMatrix`,`feDiffuseLighting`,`feDisplacementMap`,`feDistantLight`,`feDropShadow`,`feFlood`,`feFuncA`,`feFuncB`,`feFuncG`,`feFuncR`,`feGaussianBlur`,`feImage`,`feMerge`,`feMergeNode`,`feMorphology`,`feOffset`,`fePointLight`,`feSpecularLighting`,`feSpotLight`,`feTile`,`feTurbulence`]),Pe=R([`animate`,`color-profile`,`cursor`,`discard`,`font-face`,`font-face-format`,`font-face-name`,`font-face-src`,`font-face-uri`,`foreignobject`,`hatch`,`hatchpath`,`mesh`,`meshgradient`,`meshpatch`,`meshrow`,`missing-glyph`,`script`,`set`,`solidcolor`,`unknown`,`use`]),Fe=R(`math.menclose.merror.mfenced.mfrac.mglyph.mi.mlabeledtr.mmultiscripts.mn.mo.mover.mpadded.mphantom.mroot.mrow.ms.mspace.msqrt.mstyle.msub.msup.msubsup.mtable.mtd.mtext.mtr.munder.munderover.mprescripts`.split(`.`)),Ie=R([`maction`,`maligngroup`,`malignmark`,`mlongdiv`,`mscarries`,`mscarry`,`msgroup`,`mstack`,`msline`,`msrow`,`semantics`,`annotation`,`annotation-xml`,`mprescripts`,`none`]),Le=R([`#text`]),Re=R(`accept.action.align.alt.autocapitalize.autocomplete.autopictureinpicture.autoplay.background.bgcolor.border.capture.cellpadding.cellspacing.checked.cite.class.clear.color.cols.colspan.command.commandfor.controls.controlslist.coords.crossorigin.datetime.decoding.default.dir.disabled.disablepictureinpicture.disableremoteplayback.download.draggable.enctype.enterkeyhint.exportparts.face.for.headers.height.hidden.high.href.hreflang.id.inert.inputmode.integrity.ismap.kind.label.lang.list.loading.loop.low.max.maxlength.media.method.min.minlength.multiple.muted.name.nonce.noshade.novalidate.nowrap.open.optimum.part.pattern.placeholder.playsinline.popover.popovertarget.popovertargetaction.poster.preload.pubdate.radiogroup.readonly.rel.required.rev.reversed.role.rows.rowspan.spellcheck.scope.selected.shape.size.sizes.slot.span.srclang.start.src.srcset.step.style.summary.tabindex.title.translate.type.usemap.valign.value.width.wrap.xmlns`.split(`.`)),ze=R(`accent-height.accumulate.additive.alignment-baseline.amplitude.ascent.attributename.attributetype.azimuth.basefrequency.baseline-shift.begin.bias.by.class.clip.clippathunits.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.cx.cy.d.dx.dy.diffuseconstant.direction.display.divisor.dominant-baseline.dur.edgemode.elevation.end.exponent.fill.fill-opacity.fill-rule.filter.filterunits.flood-color.flood-opacity.font-family.font-size.font-size-adjust.font-stretch.font-style.font-variant.font-weight.fx.fy.g1.g2.glyph-name.glyphref.gradientunits.gradienttransform.height.href.id.image-rendering.in.in2.intercept.k.k1.k2.k3.k4.kerning.keypoints.keysplines.keytimes.lang.lengthadjust.letter-spacing.kernelmatrix.kernelunitlength.lighting-color.local.marker-end.marker-mid.marker-start.markerheight.markerunits.markerwidth.maskcontentunits.maskunits.max.mask.mask-type.media.method.mode.min.name.numoctaves.offset.operator.opacity.order.orient.orientation.origin.overflow.paint-order.path.pathlength.patterncontentunits.patterntransform.patternunits.points.preservealpha.preserveaspectratio.primitiveunits.r.rx.ry.radius.refx.refy.repeatcount.repeatdur.restart.result.rotate.scale.seed.shape-rendering.slope.specularconstant.specularexponent.spreadmethod.startoffset.stddeviation.stitchtiles.stop-color.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke.stroke-width.style.surfacescale.systemlanguage.tabindex.tablevalues.targetx.targety.transform.transform-origin.text-anchor.text-decoration.text-orientation.text-rendering.textlength.type.u1.u2.unicode.values.viewbox.visibility.version.vert-adv-y.vert-origin-x.vert-origin-y.width.word-spacing.wrap.writing-mode.xchannelselector.ychannelselector.x.x1.x2.xmlns.y.y1.y2.z.zoomandpan`.split(`.`)),Be=R(`accent.accentunder.align.bevelled.close.columnalign.columnlines.columnspacing.columnspan.denomalign.depth.dir.display.displaystyle.encoding.fence.frame.height.href.id.largeop.length.linethickness.lquote.lspace.mathbackground.mathcolor.mathsize.mathvariant.maxsize.minsize.movablelimits.notation.numalign.open.rowalign.rowlines.rowspacing.rowspan.rspace.rquote.scriptlevel.scriptminsize.scriptsizemultiplier.selection.separator.separators.stretchy.subscriptshift.supscriptshift.symmetric.voffset.width.xmlns`.split(`.`)),Ve=R([`xlink:href`,`xml:id`,`xlink:title`,`xml:space`,`xmlns:xlink`]),He=z(/{{[\w\W]*|^[\w\W]*}}/g),Ue=z(/<%[\w\W]*|^[\w\W]*%>/g),We=z(/\${[\w\W]*/g),Ge=z(/^data-[\-\w.\u00B7-\uFFFF]+$/),Ke=z(/^aria-[\-\w]+$/),qe=z(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Je=z(/^(?:\w+script|data):/i),Ye=z(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Xe=z(/^html$/i),Ze=z(/^[a-z][.\w]*(-[.\w]+)+$/i),Qe=z(/<[/\w!]/g),$e=z(/<[/\w]/g),et=z(/<\/no(script|embed|frames)/i),tt=z(/\/>/i),J={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,processingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},nt=function(){return typeof window>`u`?null:window},rt=function(e,t){if(typeof e!=`object`||typeof e.createPolicy!=`function`)return null;let n=null,r=`data-tt-policy-suffix`;t&&t.hasAttribute(r)&&(n=t.getAttribute(r));let i=`dompurify`+(n?`#`+n:``);try{return e.createPolicy(i,{createHTML(e){return e},createScriptURL(e){return e}})}catch{return console.warn(`TrustedTypes policy `+i+` could not be created.`),null}},it=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},at=function(e,t,n,r){return U(e,t)&&he(e[t])?K(r.base?q(r.base):{},e[t],r.transform):n};function ot(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:nt(),t=e=>ot(e);if(t.version=`3.4.12`,t.removed=[],!e||!e.document||e.document.nodeType!==J.document||!e.Element)return t.isSupported=!1,t;let n=e.document,r=n,i=r.currentScript;e.DocumentFragment;let a=e.HTMLTemplateElement,o=e.Node,s=e.Element,c=e.NodeFilter;e.NamedNodeMap===void 0&&(e.NamedNodeMap||e.MozNamedAttrMap),e.HTMLFormElement;let l=e.DOMParser,u=e.trustedTypes,d=s.prototype,f=ke(d,`cloneNode`),p=ke(d,`remove`),m=ke(d,`nextSibling`),h=ke(d,`childNodes`),g=ke(d,`parentNode`),_=ke(d,`shadowRoot`),v=ke(d,`attributes`),y=o&&o.prototype?ke(o.prototype,`nodeType`):null,b=o&&o.prototype?ke(o.prototype,`nodeName`):null;if(typeof a==`function`){let e=n.createElement(`template`);e.content&&e.content.ownerDocument&&(n=e.content.ownerDocument)}let x,S=``,C,w=!1,T=0,E=function(){if(T>0)throw Te(`A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.`)},D=function(e){E(),T++;try{return x.createHTML(e)}finally{T--}},O=function(e){E(),T++;try{return x.createScriptURL(e)}finally{T--}},k=function(){return w||=(C=rt(u,i),!0),C},A=n,j=A.implementation,ee=A.createNodeIterator,te=A.createDocumentFragment,M=A.getElementsByTagName,N=r.importNode,P=it();t.isSupported=typeof re==`function`&&typeof g==`function`&&j&&j.createHTMLDocument!==void 0;let ne=He,F=Ue,I=We,ie=Ge,ae=Ke,oe=Je,L=Ye,ce=Ze,le=qe,B=null,Se=K({},[...je,...Me,...Ne,...Fe,...Le]),V=null,Ce=K({},[...Re,...ze,...Be,...Ve]),H=Object.seal(se(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),we=null,G=null,Ee=Object.seal(se(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),De=!0,st=!0,ct=!1,lt=!0,ut=!1,dt=!0,Y=!1,ft=!1,pt=null,mt=null,ht=!1,X=!1,gt=!1,_t=!1,vt=!0,yt=!1,bt=`user-content-`,xt=!0,St=!1,Ct={},Z=null,wt=K({},`annotation-xml.audio.colgroup.desc.foreignobject.head.iframe.math.mi.mn.mo.ms.mtext.noembed.noframes.noscript.plaintext.script.selectedcontent.style.svg.template.thead.title.video.xmp`.split(`.`)),Tt=null,Et=K({},[`audio`,`video`,`img`,`source`,`image`,`track`]),Dt=null,Ot=K({},[`alt`,`class`,`for`,`id`,`label`,`name`,`pattern`,`placeholder`,`role`,`summary`,`title`,`value`,`style`,`xmlns`]),kt=`http://www.w3.org/1998/Math/MathML`,At=`http://www.w3.org/2000/svg`,jt=`http://www.w3.org/1999/xhtml`,Mt=jt,Nt=!1,Pt=null,Ft=K({},[kt,At,jt],_e),It=R([`mi`,`mo`,`mn`,`ms`,`mtext`]),Q=K({},It),Lt=R([`annotation-xml`]),Rt=K({},Lt),zt=K({},[`title`,`style`,`font`,`a`,`script`]),Bt=null,Vt=[`application/xhtml+xml`,`text/html`],$=null,Ht=null,Ut=n.createElement(`form`),Wt=function(e){return e instanceof RegExp||e instanceof Function},Gt=function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(Ht&&Ht===e)return;(!e||typeof e!=`object`)&&(e={}),e=q(e),Bt=Vt.indexOf(e.PARSER_MEDIA_TYPE)===-1?`text/html`:e.PARSER_MEDIA_TYPE,$=Bt===`application/xhtml+xml`?_e:ge,B=at(e,`ALLOWED_TAGS`,Se,{transform:$}),V=at(e,`ALLOWED_ATTR`,Ce,{transform:$}),Pt=at(e,`ALLOWED_NAMESPACES`,Ft,{transform:_e}),Dt=at(e,`ADD_URI_SAFE_ATTR`,Ot,{transform:$,base:Ot}),Tt=at(e,`ADD_DATA_URI_TAGS`,Et,{transform:$,base:Et}),Z=at(e,`FORBID_CONTENTS`,wt,{transform:$}),we=at(e,`FORBID_TAGS`,q({}),{transform:$}),G=at(e,`FORBID_ATTR`,q({}),{transform:$}),Ct=U(e,`USE_PROFILES`)?e.USE_PROFILES&&typeof e.USE_PROFILES==`object`?q(e.USE_PROFILES):e.USE_PROFILES:!1,De=e.ALLOW_ARIA_ATTR!==!1,st=e.ALLOW_DATA_ATTR!==!1,ct=e.ALLOW_UNKNOWN_PROTOCOLS||!1,lt=e.ALLOW_SELF_CLOSE_IN_ATTR!==!1,ut=e.SAFE_FOR_TEMPLATES||!1,dt=e.SAFE_FOR_XML!==!1,Y=e.WHOLE_DOCUMENT||!1,X=e.RETURN_DOM||!1,gt=e.RETURN_DOM_FRAGMENT||!1,_t=e.RETURN_TRUSTED_TYPE||!1,ht=e.FORCE_BODY||!1,vt=e.SANITIZE_DOM!==!1,yt=e.SANITIZE_NAMED_PROPS||!1,xt=e.KEEP_CONTENT!==!1,St=e.IN_PLACE||!1,le=Ae(e.ALLOWED_URI_REGEXP)?e.ALLOWED_URI_REGEXP:qe,Mt=typeof e.NAMESPACE==`string`?e.NAMESPACE:jt,Q=U(e,`MATHML_TEXT_INTEGRATION_POINTS`)&&e.MATHML_TEXT_INTEGRATION_POINTS&&typeof e.MATHML_TEXT_INTEGRATION_POINTS==`object`?q(e.MATHML_TEXT_INTEGRATION_POINTS):K({},It),Rt=U(e,`HTML_INTEGRATION_POINTS`)&&e.HTML_INTEGRATION_POINTS&&typeof e.HTML_INTEGRATION_POINTS==`object`?q(e.HTML_INTEGRATION_POINTS):K({},Lt);let t=U(e,`CUSTOM_ELEMENT_HANDLING`)&&e.CUSTOM_ELEMENT_HANDLING&&typeof e.CUSTOM_ELEMENT_HANDLING==`object`?q(e.CUSTOM_ELEMENT_HANDLING):se(null);if(H=se(null),U(t,`tagNameCheck`)&&Wt(t.tagNameCheck)&&(H.tagNameCheck=t.tagNameCheck),U(t,`attributeNameCheck`)&&Wt(t.attributeNameCheck)&&(H.attributeNameCheck=t.attributeNameCheck),U(t,`allowCustomizedBuiltInElements`)&&typeof t.allowCustomizedBuiltInElements==`boolean`&&(H.allowCustomizedBuiltInElements=t.allowCustomizedBuiltInElements),z(H),ut&&(st=!1),gt&&(X=!0),Ct&&(B=K({},Le),V=se(null),Ct.html===!0&&(K(B,je),K(V,Re)),Ct.svg===!0&&(K(B,Me),K(V,ze),K(V,Ve)),Ct.svgFilters===!0&&(K(B,Ne),K(V,ze),K(V,Ve)),Ct.mathMl===!0&&(K(B,Fe),K(V,Be),K(V,Ve))),Ee.tagCheck=null,Ee.attributeCheck=null,U(e,`ADD_TAGS`)&&(typeof e.ADD_TAGS==`function`?Ee.tagCheck=e.ADD_TAGS:he(e.ADD_TAGS)&&(B===Se&&(B=q(B)),K(B,e.ADD_TAGS,$))),U(e,`ADD_ATTR`)&&(typeof e.ADD_ATTR==`function`?Ee.attributeCheck=e.ADD_ATTR:he(e.ADD_ATTR)&&(V===Ce&&(V=q(V)),K(V,e.ADD_ATTR,$))),U(e,`ADD_URI_SAFE_ATTR`)&&he(e.ADD_URI_SAFE_ATTR)&&K(Dt,e.ADD_URI_SAFE_ATTR,$),U(e,`FORBID_CONTENTS`)&&he(e.FORBID_CONTENTS)&&(Z===wt&&(Z=q(Z)),K(Z,e.FORBID_CONTENTS,$)),U(e,`ADD_FORBID_CONTENTS`)&&he(e.ADD_FORBID_CONTENTS)&&(Z===wt&&(Z=q(Z)),K(Z,e.ADD_FORBID_CONTENTS,$)),xt&&(B[`#text`]=!0),Y&&K(B,[`html`,`head`,`body`]),B.table&&(K(B,[`tbody`]),delete we.tbody),e.TRUSTED_TYPES_POLICY){if(typeof e.TRUSTED_TYPES_POLICY.createHTML!=`function`)throw Te(`TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.`);if(typeof e.TRUSTED_TYPES_POLICY.createScriptURL!=`function`)throw Te(`TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.`);let t=x;x=e.TRUSTED_TYPES_POLICY;try{S=D(``)}catch(e){throw x=t,e}}else e.TRUSTED_TYPES_POLICY===null?(x=void 0,S=``):(x===void 0&&(x=k()),x&&typeof S==`string`&&(S=D(``)));R&&R(e),Ht=e},Kt=K({},[...Me,...Ne,...Pe]),qt=K({},[...Fe,...Ie]),Jt=function(e,t,n){return t.namespaceURI===jt?e===`svg`:t.namespaceURI===kt?e===`svg`&&(n===`annotation-xml`||Q[n]):!!Kt[e]},Yt=function(e,t,n){return t.namespaceURI===jt?e===`math`:t.namespaceURI===At?e===`math`&&Rt[n]:!!qt[e]},Xt=function(e,t,n){return t.namespaceURI===At&&!Rt[n]||t.namespaceURI===kt&&!Q[n]?!1:!qt[e]&&(zt[e]||!Kt[e])},Zt=function(e){let t=g(e);(!t||!t.tagName)&&(t={namespaceURI:Mt,tagName:`template`});let n=ge(e.tagName),r=ge(t.tagName);return Pt[e.namespaceURI]?e.namespaceURI===At?Jt(n,t,r):e.namespaceURI===kt?Yt(n,t,r):e.namespaceURI===jt?Xt(n,t,r):!!(Bt===`application/xhtml+xml`&&Pt[e.namespaceURI]):!1},Qt=function(e){pe(t.removed,{element:e});try{g(e).removeChild(e)}catch{if(p(e),!g(e))throw Te(`a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place`)}},$t=function(e){nn(e);let t=h(e);if(t){let e=[];ue(t,t=>{pe(e,t)}),ue(e,e=>{try{p(e)}catch{}})}let n=v(e);if(n)for(let t=n.length-1;t>=0;--t){let r=n[t],i=r&&r.name;if(typeof i==`string`)try{e.removeAttribute(i)}catch{}}},en=function(e,n){try{pe(t.removed,{attribute:n.getAttributeNode(e),from:n})}catch{pe(t.removed,{attribute:null,from:n})}if(n.removeAttribute(e),e===`is`)if(X||gt)try{Qt(n)}catch{}else try{n.setAttribute(e,``)}catch{}},tn=function(e){let t=v(e);if(t)for(let n=t.length-1;n>=0;--n){let r=t[n],i=r&&r.name;if(!(typeof i!=`string`||V[$(i)]))try{e.removeAttribute(i)}catch{}}},nn=function(e){let t=[e];for(;t.length>0;){let e=t.pop();(y?y(e):e.nodeType)===J.element&&tn(e);let n=h(e);if(n)for(let e=n.length-1;e>=0;--e)t.push(n[e])}},rn=function(e){if(!dt)return;let t=[e];for(;t.length>0;){let e=t.pop(),n=y?y(e):e.nodeType;if(n===J.processingInstruction||n===J.comment&&W($e,e.data)){try{p(e)}catch{}continue}if(n===J.element){let t=e,n=$(b?b(e):e.nodeName);try{t.hasAttribute&&t.hasAttribute(`patchsrc`)&&t.removeAttribute(`patchsrc`),t.hasAttribute&&t.hasAttribute(`for`)&&n!==`label`&&n!==`output`&&t.removeAttribute(`for`)}catch{}}let r=h(e);if(r)for(let e=r.length-1;e>=0;--e)t.push(r[e])}},an=function(e){let t=null,r=null;if(ht)e=`<remove></remove>`+e;else{let t=ve(e,/^[\r\n\t ]+/);r=t&&t[0]}Bt===`application/xhtml+xml`&&Mt===jt&&(e=`<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>`+e+`</body></html>`);let i=x?D(e):e;if(Mt===jt)try{t=new l().parseFromString(i,Bt)}catch{}if(!t||!t.documentElement){t=j.createDocument(Mt,`template`,null);try{t.documentElement.innerHTML=Nt?S:i}catch{}}let a=t.body||t.documentElement;return e&&r&&a.insertBefore(n.createTextNode(r),a.childNodes[0]||null),Mt===jt?M.call(t,Y?`html`:`body`)[0]:Y?t.documentElement:a},on=function(e){return ee.call(e.ownerDocument||e,e,c.SHOW_ELEMENT|c.SHOW_COMMENT|c.SHOW_TEXT|c.SHOW_PROCESSING_INSTRUCTION|c.SHOW_CDATA_SECTION,null)},sn=function(e){return e=ye(e,ne,` `),e=ye(e,F,` `),e=ye(e,I,` `),e},cn=function(e){e.normalize();let t=ee.call(e.ownerDocument||e,e,c.SHOW_TEXT|c.SHOW_COMMENT|c.SHOW_CDATA_SECTION|c.SHOW_PROCESSING_INSTRUCTION,null),n=t.nextNode();for(;n;)n.data=sn(n.data),n=t.nextNode();let r=e.querySelectorAll?.call(e,`template`);r&&ue(r,e=>{un(e.content)&&cn(e.content)})},ln=function(e){let t=b?b(e):null;return typeof t!=`string`||$(t)!==`form`?!1:typeof e.nodeName!=`string`||typeof e.textContent!=`string`||typeof e.removeChild!=`function`||e.attributes!==v(e)||typeof e.removeAttribute!=`function`||typeof e.setAttribute!=`function`||typeof e.namespaceURI!=`string`||typeof e.insertBefore!=`function`||typeof e.hasChildNodes!=`function`||e.nodeType!==y(e)||e.childNodes!==h(e)},un=function(e){if(!y||typeof e!=`object`||!e)return!1;try{return y(e)===J.documentFragment}catch{return!1}},dn=function(e){if(!y||typeof e!=`object`||!e)return!1;try{return typeof y(e)==`number`}catch{return!1}};function fn(e,n,r){e.length!==0&&ue(e,e=>{e.call(t,n,r,Ht)})}let pn=function(e,t){return!!(dt&&e.hasChildNodes()&&!dn(e.firstElementChild)&&W(Qe,e.textContent)&&W(Qe,e.innerHTML)||dt&&e.namespaceURI===jt&&t===`style`&&dn(e.firstElementChild)||e.nodeType===J.processingInstruction||dt&&e.nodeType===J.comment&&W($e,e.data))},mn=function(e,t){if(!we[t]&&vn(t)&&(H.tagNameCheck instanceof RegExp&&W(H.tagNameCheck,t)||H.tagNameCheck instanceof Function&&H.tagNameCheck(t)))return!1;if(xt&&!Z[t]){let t=g(e),n=h(e);if(n&&t){let r=n.length;for(let i=r-1;i>=0;--i){let r=St?n[i]:f(n[i],!0);t.insertBefore(r,m(e))}}}return Qt(e),!0},hn=function(e,n){if(fn(P.beforeSanitizeElements,e,null),e!==n&&g(e)===null)return!0;if(ln(e))return Qt(e),!0;let r=$(b?b(e):e.nodeName);if(fn(P.uponSanitizeElement,e,{tagName:r,allowedTags:B}),e!==n&&g(e)===null)return!0;if(pn(e,r))return Qt(e),!0;if(we[r]||!(Ee.tagCheck instanceof Function&&Ee.tagCheck(r))&&!B[r]){let t=mn(e,r);return t===!1&&fn(P.afterSanitizeElements,e,null),t}if((y?y(e):e.nodeType)===J.element&&!Zt(e)||(r===`noscript`||r===`noembed`||r===`noframes`)&&W(et,e.innerHTML))return Qt(e),!0;if(ut&&e.nodeType===J.text){let n=sn(e.textContent);e.textContent!==n&&(pe(t.removed,{element:e.cloneNode()}),e.textContent=n)}return fn(P.afterSanitizeElements,e,null),!1},gn=function(e,t,r){if(G[t]||dt&&t===`patchsrc`||dt&&t===`for`&&e!==`label`&&e!==`output`||vt&&(t===`id`||t===`name`)&&(r in n||r in Ut))return!1;let i=V[t]||Ee.attributeCheck instanceof Function&&Ee.attributeCheck(t,e);if(!(st&&W(ie,t))&&!(De&&W(ae,t))){if(!i){if(!(vn(e)&&(H.tagNameCheck instanceof RegExp&&W(H.tagNameCheck,e)||H.tagNameCheck instanceof Function&&H.tagNameCheck(e))&&(H.attributeNameCheck instanceof RegExp&&W(H.attributeNameCheck,t)||H.attributeNameCheck instanceof Function&&H.attributeNameCheck(t,e))||t===`is`&&H.allowCustomizedBuiltInElements&&(H.tagNameCheck instanceof RegExp&&W(H.tagNameCheck,r)||H.tagNameCheck instanceof Function&&H.tagNameCheck(r))))return!1}else if(!Dt[t]&&!W(le,ye(r,L,``))&&!((t===`src`||t===`xlink:href`||t===`href`)&&e!==`script`&&be(r,`data:`)===0&&Tt[e])&&!(ct&&!W(oe,ye(r,L,``)))&&r)return!1}return!0},_n=K({},[`annotation-xml`,`color-profile`,`font-face`,`font-face-format`,`font-face-name`,`font-face-src`,`font-face-uri`,`missing-glyph`]),vn=function(e){return!_n[ge(e)]&&W(ce,e)},yn=function(e,t,n,r){if(x&&typeof u==`object`&&typeof u.getAttributeType==`function`&&!n)switch(u.getAttributeType(e,t)){case`TrustedHTML`:return D(r);case`TrustedScriptURL`:return O(r)}return r},bn=function(e,n,r,i){try{r?e.setAttributeNS(r,n,i):e.setAttribute(n,i),ln(e)?Qt(e):fe(t.removed)}catch{en(n,e)}},xn=function(e){fn(P.beforeSanitizeAttributes,e,null);let t=e.attributes;if(!t||ln(e))return;let n={attrName:``,attrValue:``,keepAttr:!0,allowedAttributes:V,forceKeepAttr:void 0},r=t.length,i=$(e.nodeName);for(;r--;){let a=t[r],o=a.name,s=a.namespaceURI,c=a.value,l=$(o),u=c,d=o===`value`?u:xe(u);if(n.attrName=l,n.attrValue=d,n.keepAttr=!0,n.forceKeepAttr=void 0,fn(P.uponSanitizeAttribute,e,n),d=n.attrValue,yt&&(l===`id`||l===`name`)&&be(d,bt)!==0&&(en(o,e),d=bt+d),dt&&W(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,d)){en(o,e);continue}if(l===`attributename`&&ve(d,`href`)){en(o,e);continue}if(!n.forceKeepAttr){if(!n.keepAttr){en(o,e);continue}if(!lt&&W(tt,d)){en(o,e);continue}if(ut&&(d=sn(d)),!gn(i,l,d)){en(o,e);continue}d=yn(i,l,s,d),d!==u&&bn(e,o,s,d)}}fn(P.afterSanitizeAttributes,e,null)},Sn=function(e){let t=null,n=on(e);for(fn(P.beforeSanitizeShadowDOM,e,null);t=n.nextNode();)if(fn(P.uponSanitizeShadowNode,t,null),hn(t,e),xn(t),un(t.content)&&Sn(t.content),(y?y(t):t.nodeType)===J.element){let e=_(t);un(e)&&(Cn(e),Sn(e))}fn(P.afterSanitizeShadowDOM,e,null)},Cn=function(e){let t=[{node:e,shadow:null}];for(;t.length>0;){let e=t.pop();if(e.shadow){Sn(e.shadow);continue}let n=e.node,r=(y?y(n):n.nodeType)===J.element,i=h(n);if(i)for(let e=i.length-1;e>=0;--e)t.push({node:i[e],shadow:null});if(r){let e=b?b(n):null;if(typeof e==`string`&&$(e)===`template`){let e=n.content;un(e)&&t.push({node:e,shadow:null})}}if(r){let e=_(n);un(e)&&t.push({node:null,shadow:e},{node:e,shadow:null})}}};return t.sanitize=function(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=null,a=null,o=null,s=null;if(Nt=!e,Nt&&(e=`<!-->`),typeof e!=`string`&&!dn(e)&&(e=Oe(e),typeof e!=`string`))throw Te(`dirty is not a string, aborting`);if(!t.isSupported)return e;ft?(B=pt,V=mt):Gt(n),(P.uponSanitizeElement.length>0||P.uponSanitizeAttribute.length>0)&&(B=q(B)),P.uponSanitizeAttribute.length>0&&(V=q(V)),t.removed=[];let c=St&&typeof e!=`string`&&dn(e);if(c){rn(e);let t=b?b(e):e.nodeName;if(typeof t==`string`){let n=$(t);if(!B[n]||we[n])throw $t(e),Te(`root node is forbidden and cannot be sanitized in-place`)}if(ln(e))throw $t(e),Te(`root node is clobbered and cannot be sanitized in-place`);try{Cn(e)}catch(t){throw $t(e),t}}else if(dn(e))i=an(`<!---->`),a=i.ownerDocument.importNode(e,!0),a.nodeType===J.element&&a.nodeName===`BODY`||a.nodeName===`HTML`?i=a:i.appendChild(a),Cn(a);else{if(!X&&!ut&&!Y&&e.indexOf(`<`)===-1)return x&&_t?D(e):e;if(i=an(e),!i)return X?null:_t?S:``}i&&ht&&Qt(i.firstChild);let l=c?e:i,u=on(l);try{for(;o=u.nextNode();)hn(o,l),xn(o),un(o.content)&&Sn(o.content)}catch(n){throw c&&($t(e),ue(t.removed,e=>{e.element&&nn(e.element)})),n}if(c)return ue(t.removed,e=>{e.element&&nn(e.element)}),ut&&cn(e),e;if(X){if(ut&&cn(i),gt)for(s=te.call(i.ownerDocument);i.firstChild;)s.appendChild(i.firstChild);else s=i;return(V.shadowroot||V.shadowrootmode)&&(s=N.call(r,s,!0)),s}let d=Y?i.outerHTML:i.innerHTML;return Y&&B[`!doctype`]&&i.ownerDocument&&i.ownerDocument.doctype&&i.ownerDocument.doctype.name&&W(Xe,i.ownerDocument.doctype.name)&&(d=`<!DOCTYPE `+i.ownerDocument.doctype.name+`>
`+d),ut&&(d=sn(d)),x&&_t?D(d):d},t.setConfig=function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Gt(e),ft=!0,pt=B,mt=V},t.clearConfig=function(){Ht=null,ft=!1,pt=null,mt=null,x=C,S=``},t.isValidAttribute=function(e,t,n){Ht||Gt({});let r=$(e),i=$(t);return gn(r,i,n)},t.addHook=function(e,t){typeof t==`function`&&U(P,e)&&pe(P[e],t)},t.removeHook=function(e,t){if(U(P,e)){if(t!==void 0){let n=de(P[e],t);return n===-1?void 0:me(P[e],n,1)[0]}return fe(P[e])}},t.removeHooks=function(e){U(P,e)&&(P[e]=[])},t.removeAllHooks=function(){P=it()},t}var st=ot();function ct(e,t){let n=String(e??``),r=n.match(/^\s*<h1\b[^>]*>([\s\S]*?)<\/h1>\s*/i);if(!r)return n;let i=r[1].replace(/<[^>]*>/g,``).replace(/\s+/g,` `).trim(),a=String(t??``).replace(/\s+/g,` `).trim();return!a||i!==a?n:n.slice(r[0].length)}function lt(e){let t=e.length,n=Array.from({length:t},(e,n)=>n+1<t?n+1:null),r=[],i=null,a=t>0?0:null,o=null,s=(e,t)=>r.push({phase:e,desc:t,prev:i,curr:a,next:o,nextOf:[...n],done:!1}),c=t=>t===null?`∅`:String(e[t]);if(t===0)return s(`init`,"空链表。`head` 本身就是 ∅，直接返回 ∅ —— 这是必须单独处理的第一种边界。"),r[0].done=!0,r;for(s(`init`,`初始状态：\`prev\` 先站在 ∅（反转后头节点会变成尾节点，它的 \`next\` 必须指向空），\`curr\` 指向头节点 ${c(a)}。`);a!==null;)o=n[a],s(`read-next`,`① \`next = curr.next\`，先记住 ${c(o)}。这一步看着多余，其实是整个算法的命门：一旦 ② 把 \`curr\` 的指针掉头，通往后面节点的唯一线索就断了，所以必须提前存好。`),n[a]=i,s(`flip`,`② \`curr.next = prev\`，把 ${c(a)} 的箭头掉个头，指向 ${c(i)}。`+(i===null?` 因为 \`prev\` 还是 ∅，${c(a)} 就成了新的尾节点。`:``)),i=a,a=o,s(`advance`,a===null?`③ \`prev = curr\`，\`curr = next\` = ∅。curr 走出了链表，循环结束 —— 返回 \`prev\`（${c(i)}），它就是反转后的新头节点。`:`③ \`prev\` 和 \`curr\` 一起右移：\`prev\` 指向 ${c(i)}，\`curr\` 指向 ${c(a)}。准备处理下一个节点。`);return r[r.length-1].done=!0,r}var ut=`viz-chrome-styles`,dt=`http://www.w3.org/2000/svg`;function Y(e,t){let n=document.createElementNS(dt,e);if(t)for(let e in t)n.setAttribute(e,t[e]);return n}function ft(e,t,n,r,i=`viz-arrow`){let a=Y(`g`,{class:i}),o=r>0?t:e,s=r>0?e:t;return a.appendChild(Y(`line`,{class:`${i}__line`,x1:s,y1:n,x2:o-r*9,y2:n})),a.appendChild(Y(`path`,{class:`${i}__head`,d:`M ${o} ${n} L ${o-r*9} ${n-5.5} L ${o-r*9} ${n+5.5} Z`})),a}var pt=`
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
`;function mt(){if(document.getElementById(ut))return;let e=document.createElement(`style`);e.id=ut,e.textContent=pt,document.head.appendChild(e)}function ht(){document.getElementById(ut)?.remove()}function X(e,t){e.textContent=``;let n=String(t??``),r=/(`[^`]*`|\*\*[^*]+\*\*)/g,i=0;for(let t of n.matchAll(r)){t.index>i&&e.appendChild(document.createTextNode(n.slice(i,t.index)));let r=t[0],a=r.startsWith("`"),o=document.createElement(a?`code`:`strong`);o.textContent=r.slice(a?1:2,a?-1:-2),e.appendChild(o),i=t.index+r.length}i<n.length&&e.appendChild(document.createTextNode(n.slice(i)))}function gt({playLabel:e=`播放`,pauseLabel:t=`暂停`}={}){let n=(e,t)=>{let n=document.createElement(`button`);return n.type=`button`,n.className=t?`viz__btn ${t}`:`viz__btn`,n.textContent=e,n},r=document.createElement(`div`);r.className=`viz__bar`;let i=n(`上一步`),a=n(e,`viz__btn--play`),o=n(`下一步`),s=n(`重置`),c=document.createElement(`span`);return c.className=`viz__count`,r.append(i,a,o,s,c),{root:r,prev:i,play:a,next:o,reset:s,count:c,setPlaying:n=>{a.textContent=n?t:e}}}function _t({steps:e,controls:t,intervalMs:n=1150,onRender:r}){let i=0,a=null,o=()=>{a&&=(clearInterval(a),null),t.setPlaying(!1)},s=()=>{r(i,e[i]),t.count.textContent=`第 ${i+1} / ${e.length} 步`,t.prev.disabled=i===0,t.next.disabled=i===e.length-1,t.reset.disabled=i===0&&!a},c=()=>{a||(i===e.length-1&&(i=0),t.setPlaying(!0),a=setInterval(()=>{if(i>=e.length-1){o(),s();return}i+=1,s()},n),s())},l=t=>{o(),i=Math.min(e.length-1,Math.max(0,i+t)),s()},u=()=>{o(),i=0,s()},d=t=>{o(),i=Math.min(e.length-1,Math.max(0,t)),s()},f={prev:()=>l(-1),next:()=>l(1),reset:u,play:()=>a?o():c()};return t.prev.addEventListener(`click`,f.prev),t.next.addEventListener(`click`,f.next),t.reset.addEventListener(`click`,f.reset),t.play.addEventListener(`click`,f.play),{render:s,play:c,stop:o,reset:u,jumpTo:d,destroy:()=>{o(),t.prev.removeEventListener(`click`,f.prev),t.next.removeEventListener(`click`,f.next),t.reset.removeEventListener(`click`,f.reset),t.play.removeEventListener(`click`,f.play)},get index(){return i}}}var vt=`llv-styles`,yt=72,bt=52,xt=44,St=68,Ct=96,Z=122,wt=48,Tt=200,Et=240,Dt=62,Ot=26,kt=276,At=26,jt=1150,Mt=0,Nt=(e,t,n,r)=>ft(e,t,n,r,`llv-edge`),Pt=`
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
`;function Ft(){if(mt(),document.getElementById(vt))return;let e=document.createElement(`style`);e.id=vt,e.textContent=Pt,document.head.appendChild(e)}function It(e,t={}){if(!e||e.dataset.llvMounted===`1`)return{destroy(){}};e.dataset.llvMounted=`1`,Ft(),Mt+=1;let n=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4,5],r=t.autoplay!==!1,i=lt(n),a=n.length,o=Array.from({length:a},(e,t)=>t+1<a?t+1:null),s=2*St+a*yt+Math.max(0,a-1)*xt,c=e=>St+e*116,l=e=>c(e)+yt/2,u=At,d=s-At,f=document.createElement(`div`);f.className=`viz llv`;let p=document.createElement(`div`);p.className=`viz__stage`,f.appendChild(p);let m=Y(`svg`,{class:`viz__svg llv__svg`,viewBox:`0 0 ${s} ${kt}`,role:`img`,"aria-label":`反转链表推演动画：${n.join(` → `)}`});p.appendChild(m);for(let e of[u,d]){m.appendChild(Y(`circle`,{class:`llv-null__ring`,cx:e,cy:Z,r:15}));let t=Y(`text`,{class:`llv-null__text`,x:e,y:Z});t.textContent=`∅`,m.appendChild(t)}let h=Y(`line`,{class:`llv-tick`}),g=Y(`line`,{class:`llv-tick`}),_=Y(`line`,{class:`llv-tick`});m.append(h,g,_);let v=[];for(let e=0;e<a-1;e+=1){let t=c(e)+yt,n=c(e+1),r=Nt(t,n,Z,1),i=Nt(t,n,Z,-1);m.append(r,i),v.push({fwd:r,bwd:i})}let y=Nt(c(a-1)+yt,d-15,Z,1),b=Nt(41,c(0),Z,-1);m.append(y,b);let x=[];for(let e=0;e<a;e+=1){let t=Y(`g`,{class:`llv-node`});t.appendChild(Y(`rect`,{class:`llv-node__box`,x:c(e),y:Ct,width:yt,height:bt,rx:9}));let r=Y(`text`,{class:`llv-node__value`,x:l(e),y:Z});r.textContent=String(n[e]),t.appendChild(r),m.appendChild(t),x.push(t)}function S(e,t){let n=Y(`g`,{class:`llv-chip llv-chip--${e}`});n.appendChild(Y(`rect`,{class:`llv-chip__box`,x:-62/2,y:-26/2,width:Dt,height:Ot}));let r=Y(`text`,{class:`llv-chip__text`,x:0,y:0});return r.textContent=t,n.appendChild(r),n}let C=S(`next`,`next`),w=S(`prev`,`prev`),T=S(`curr`,`curr`);m.append(C,w,T);let E=document.createElement(`p`);E.className=`viz__desc`,E.setAttribute(`aria-live`,`polite`),f.appendChild(E);let D=gt();f.appendChild(D.root),e.textContent=``,e.appendChild(f);let O=null;function k(e,t,n,r,i,a,o){e.style.transform=`translate(${n}px, ${r}px)`,e.style.opacity=i?`1`:`0`,i?(t.setAttribute(`x1`,n),t.setAttribute(`x2`,n),t.setAttribute(`y1`,a),t.setAttribute(`y2`,o),t.style.opacity=`0.65`):t.style.opacity=`0`}function A(e,t){for(let e=0;e<a;e+=1){let n=x[e];n.classList.toggle(`is-flipped`,t.nextOf[e]!==o[e]),n.classList.toggle(`is-curr`,t.curr===e),n.classList.toggle(`is-next`,t.next===e)}for(let e=0;e<a-1;e+=1){let n=t.nextOf[e]===e+1,r=t.nextOf[e+1]===e;v[e].fwd.classList.toggle(`is-on`,n),v[e].bwd.classList.toggle(`is-on`,r),v[e].bwd.classList.toggle(`is-flipped`,r)}let n=t.nextOf[a-1]===null,r=t.nextOf[0]===null;y.classList.toggle(`is-on`,n),b.classList.toggle(`is-on`,r),b.classList.toggle(`is-flipped`,r),k(w,g,t.prev===null?u:l(t.prev),Tt,!0,Tt-Ot/2,148),k(T,_,t.curr===null?d:l(t.curr),Et,!0,Et-Ot/2,148),k(C,h,t.next===null?d:l(t.next),wt,t.phase!==`init`,61,Ct),X(E,t.desc)}let j=_t({steps:i,controls:D,intervalMs:jt,onRender:A});j.jumpTo(Math.trunc(t.initialStep)||0);let ee=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!ee&&typeof IntersectionObserver==`function`&&(O=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){O.disconnect(),O=null,j.play();return}},{threshold:.35}),O.observe(f)),{destroy(){O&&=(O.disconnect(),null),j.destroy(),e.textContent=``,delete e.dataset.llvMounted,--Mt,Mt<=0&&(document.getElementById(vt)?.remove(),ht())}}}var Q=e=>String(e);function Lt(e,t){let n=Array.isArray(e)?e:[],r=Array.isArray(t)?t:[],i=[],a=[],o=0,s=0,c=(e,t,c={})=>i.push({phase:e,desc:t,p1:o<n.length?o:null,p2:s<r.length?s:null,taken:a.map(e=>({...e})),rest:null,done:!1,...c}),l=(e,t)=>e===`a`?n[t]:r[t];if(n.length===0&&r.length===0)return c(`init`,`两条链表都是空的。哑结点后面什么都没有，返回 ∅。`),i[0].done=!0,i;if(n.length===0||r.length===0){let e=n.length===0?`A`:`B`,t=e===`A`?`B`:`A`;return c(`init`,`${e} 是空链表，那么「合并」就是原样返回 ${t}（${(t===`A`?n:r).map(Q).join(`、`)}）—— 一个空链表和一个有序链表合并，结果就是那个有序链表本身。`),i[0].done=!0,i}for(c(`init`,`两个指针各站在自己链表的头部：\`p1\` 指向 A 的 ${Q(n[0])}，\`p2\` 指向 B 的 ${Q(r[0])}。结果链表先放一个**哑结点**当锚点 —— 它不是答案的一部分，只是为了让我们不必特判「第一个节点该接谁」，最后返回 \`dummy.next\` 就行。`);o<n.length&&s<r.length;){let e=n[o]<=r[s];c(`compare`,`比较 \`p1\` 的 ${Q(n[o])} 和 \`p2\` 的 ${Q(r[s])}：`+(e?`${Q(n[o])} ≤ ${Q(r[s])}，取 A 的 ${Q(n[o])}。`+(n[o]===r[s]?`（相等时取哪边都行，习惯上取 A）`:``):`${Q(r[s])} < ${Q(n[o])}，取 B 的 ${Q(r[s])}。`),{cursor:e?`a`:`b`}),e?(a.push({list:`a`,i:o}),o+=1):(a.push({list:`b`,i:s}),s+=1),c(`take`,`把 ${Q(l(a[a.length-1].list,a[a.length-1].i))} 接到结果链表的尾部，然后 ${e?"`p1`":"`p2`"} 前移一格。`+(e&&o>=n.length?` A 走完了。`:``)+(!e&&s>=r.length?` B 走完了。`:``),{picked:e?`a`:`b`})}if(o<n.length||s<r.length){let e=o<n.length?`a`:`b`,t=o<n.length?o:s,i=(e===`a`?n.slice(o):r.slice(s)).map(Q).join(`、`),l=e===`a`?n:r,u=o<n.length?o:null,d=s<r.length?s:null;for(let n=t;n<l.length;n+=1)a.push({list:e,i:n});e===`a`?o=n.length:s=r.length,c(`append-rest`,`${e===`a`?`B`:`A`} 已经走完了，${e===`a`?`A`:`B`} 剩下的 ${i} 全部原样接到结果尾部。**这是整道题最容易被忽略的一步**：两条链表各自都是有序的，所以剩下这段不需要再逐个比较，直接整段接上就对。`,{rest:{list:e,from:t},p1:u,p2:d})}return c(`done`,`两条链表都走完了。结果链表是 ${a.map(e=>Q(l(e.list,e.i))).join(` → `)} —— 但别忘了开头那个哑结点，它不是答案的一部分，所以返回 \`dummy.next\`。`),i[i.length-1].done=!0,i}var Rt=`mtl-styles`,zt=60,Bt=44,Vt=94,$=84,Ht=40,Ut=130,Wt=218,Gt=214/2,Kt=38,qt=24,Jt=17,Yt=26,Xt=15,Zt=302,Qt=1150,$t=0,en=`
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
`;function tn(){if(mt(),document.getElementById(Rt))return;let e=document.createElement(`style`);e.id=Rt,e.textContent=en,document.head.appendChild(e)}function nn(e,t={}){if(!e||e.dataset.mtlMounted===`1`)return{destroy(){}};e.dataset.mtlMounted=`1`,tn(),$t+=1;let n=Array.isArray(t.listA)&&t.listA.length?t.listA:[1,2,4],r=Array.isArray(t.listB)&&t.listB.length?t.listB:[1,3,4],i=t.autoplay!==!1,a=Lt(n,r),o=a[a.length-1].taken,s=e=>e.list===`a`?n[e.i]:r[e.i],c=1+o.length,l=e=>$+e*Vt,u=e=>l(e)+zt/2,d=e=>e<=0?$:$+(e-1)*Vt+zt,f=e=>e<=0?$:d(e)+Yt,p=Math.max(d(n.length),d(r.length),d(c))+Yt+Xt+12,m=document.createElement(`div`);m.className=`viz mtl`;let h=document.createElement(`div`);h.className=`viz__stage`,m.appendChild(h);let g=Y(`svg`,{class:`viz__svg mtl__svg`,viewBox:`0 0 ${p} ${Zt}`,role:`img`,"aria-label":`合并两个有序链表推演动画：${n.join(`、`)} 与 ${r.join(`、`)}`});h.appendChild(g);for(let[e,t]of[[`A`,62],[`B`,152],[`结果`,240]]){let n=Y(`text`,{class:`mtl-row-label`,x:30,y:t});n.textContent=e,g.appendChild(n)}function _(e,t){g.appendChild(Y(`circle`,{class:`mtl-dummy__box`,cx:e,cy:t,r:Xt}));let n=Y(`text`,{class:`mtl-dummy__text`,x:e,y:t});n.textContent=`∅`,g.appendChild(n)}function v(e,t,n,r){let i=Y(`g`,{class:r});return i.appendChild(Y(`line`,{class:`mtl-edge__line`,x1:e,y1:n,x2:t-9,y2:n})),i.appendChild(Y(`path`,{class:`mtl-edge__head`,d:`M ${t} ${n} L ${t-9} ${n-5.5} L ${t-9} ${n+5.5} Z`})),g.appendChild(i),i}function y(e,t){let n=t+Bt/2;for(let t=0;t<e-1;t+=1)v(l(t)+zt,l(t+1),n,`mtl-edge`);_(f(e),n),e>0&&v(d(e),f(e)-Xt,n,`mtl-edge`)}y(n.length,Ht),y(r.length,Ut);let b=[];for(let e=1;e<c;e+=1)b.push(v(l(e-1)+zt,l(e),240,`mtl-edge mtl-redge`));_(f(c),240);let x=v(d(c),f(c)-Xt,240,`mtl-edge mtl-redge`);function S(e,t,n,r){let i=Y(`g`,{class:`mtl-node ${r}`});i.appendChild(Y(`rect`,{class:`mtl-node__box`,x:l(t),y:n,width:zt,height:Bt,rx:9}));let a=Y(`text`,{class:`mtl-node__value`,x:u(t),y:n+Bt/2});return a.textContent=String(e),i.appendChild(a),g.appendChild(i),i}let C=n.map((e,t)=>S(e,t,Ht,`mtl-node--a`)),w=r.map((e,t)=>S(e,t,Ut,`mtl-node--b`)),T=Y(`g`,{class:`mtl-dummy`});T.appendChild(Y(`rect`,{class:`mtl-dummy__box`,x:l(0),y:Wt,width:zt,height:Bt,rx:9}));let E=Y(`text`,{class:`mtl-dummy__text`,x:u(0),y:240});E.textContent=`dummy`,T.appendChild(E),g.appendChild(T);let D=o.map((e,t)=>S(s(e),t+1,Wt,`mtl-rslot mtl-rslot--from-${e.list}`)),O=Y(`g`,{class:`mtl-vs`});O.appendChild(Y(`circle`,{class:`mtl-vs__ring`,cx:0,cy:0,r:13}));let k=Y(`text`,{class:`mtl-vs__text`,x:0,y:0});k.textContent=`vs`,O.appendChild(k),g.appendChild(O);function A(e,t){let n=Y(`g`,{class:`mtl-chip mtl-chip--${e}`});n.appendChild(Y(`rect`,{class:`mtl-chip__box`,x:-38/2,y:-24/2,width:Kt,height:qt}));let r=Y(`text`,{class:`mtl-chip__text`,x:0,y:0});return r.textContent=t,n.appendChild(r),g.appendChild(n),n}let j=A(`p1`,`p1`),ee=A(`p2`,`p2`),te=A(`tail`,`tail`),M=document.createElement(`p`);M.className=`viz__desc`,M.setAttribute(`aria-live`,`polite`),m.appendChild(M);let N=gt();m.appendChild(N.root),e.textContent=``,e.appendChild(m);let P=null;function ne(e,t,n){e.style.transform=`translate(${t}px, ${n}px)`}function F(e,t){let i=new Set(t.taken.map(e=>`${e.list}:${e.i}`));C.forEach((e,n)=>{e.classList.toggle(`is-taken`,i.has(`a:${n}`)),e.classList.toggle(`is-cand`,t.phase===`compare`&&t.p1===n),e.classList.toggle(`is-win`,t.phase===`compare`&&t.cursor===`a`&&t.p1===n),e.classList.toggle(`is-rest`,t.phase===`append-rest`&&t.rest?.list===`a`&&n>=t.rest.from)}),w.forEach((e,n)=>{e.classList.toggle(`is-taken`,i.has(`b:${n}`)),e.classList.toggle(`is-cand`,t.phase===`compare`&&t.p2===n),e.classList.toggle(`is-win`,t.phase===`compare`&&t.cursor===`b`&&t.p2===n),e.classList.toggle(`is-rest`,t.phase===`append-rest`&&t.rest?.list===`b`&&n>=t.rest.from)});let a=t.rest?(t.rest.list===`a`?n.length:r.length)-t.rest.from:0,o=t.phase===`take`?t.taken.length:t.phase===`append-rest`?t.taken.length-a+1:1/0;D.forEach((e,n)=>{let r=n+1,i=r<=t.taken.length;e.classList.toggle(`is-filled`,i),e.classList.toggle(`is-new`,i&&r>=o)}),b.forEach((e,n)=>e.classList.toggle(`is-on`,n+1<=t.taken.length)),x.classList.toggle(`is-on`,t.done);let s=t.phase===`compare`;if(O.classList.toggle(`is-on`,s),s){let e=(u(t.p1)+u(t.p2))/2;O.style.transform=`translate(${e}px, ${Gt}px)`}ne(j,t.p1===null?f(n.length):u(t.p1),Ht-Jt),ne(ee,t.p2===null?f(r.length):u(t.p2),Ut-Jt),ne(te,u(Math.min(t.taken.length,c-1)),279),X(M,t.desc)}let I=_t({steps:a,controls:N,intervalMs:Qt,onRender:F});I.jumpTo(Math.trunc(t.initialStep)||0);let re=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return i&&!re&&typeof IntersectionObserver==`function`&&(P=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){P.disconnect(),P=null,I.play();return}},{threshold:.35}),P.observe(m)),{destroy(){P&&=(P.disconnect(),null),I.destroy(),e.textContent=``,delete e.dataset.mtlMounted,--$t,$t<=0&&(document.getElementById(Rt)?.remove(),ht())}}}var rn=e=>String.fromCharCode(65+e);function an(e){let t=(Array.isArray(e)?e:[]).map(e=>Array.isArray(e)?e.slice():[]),n=t.length,r=[],i=t.map(e=>e.length?0:null),a=[],o=[],s=(e,n)=>{let r=t[e.list][e.i],i=t[n.list][n.i];return r===i?e.list<n.list:r<i},c=e=>t[e.list][e.i],l=(e,t,n={})=>r.push({phase:e,desc:t,heap:o.map(e=>({...e})),cursors:i.slice(),taken:a.map(e=>({...e})),popped:null,pushed:null,moved:[],done:!1,...n});function u(e){let t=[];for(;e>0;){let n=e-1>>1;if(!s(o[e],o[n]))break;[o[e],o[n]]=[o[n],o[e]],t.push(e,n),e=n}return t}function d(e){let t=[];for(;;){let n=2*e+1,r=2*e+2,i=e;if(n<o.length&&s(o[n],o[i])&&(i=n),r<o.length&&s(o[r],o[i])&&(i=r),i===e)break;[o[e],o[i]]=[o[i],o[e]],t.push(e,i),e=i}return t}let f=[];for(let e=0;e<n;e+=1)i[e]!==null&&(o.push({list:e,i:0}),f=f.concat(u(o.length-1)));let p=t.filter(e=>e.length).length,m=t.reduce((e,t)=>e+t.length,0);if(o.length===0)return l(`init`,n===0?"`lists` 是个空数组，一条链表都没有，直接返回 ∅。":`${n} 条链表全是空的 —— 堆建起来是空的，直接返回 ∅。`,{moved:[],done:!0}),r;for(l(`init`,`把 ${p} 条链表的**头节点**放进小顶堆：${o.map(e=>`${rn(e.list)} 的 ${c(e)}`).join(`、`)}。注意**只放头部**，每条链表后面那些节点还在原地等 —— 堆里现在只有 ${o.length} 个元素，不是 ${m} 个。这是 O(N log K) 里那个 K 的来源。`,{moved:f});o.length;){let e=o[0],n=[],r=o.pop();o.length&&(o[0]=r,n.push(...d(0))),a.push({list:e.list,i:e.i});let s=e.list;i[s]=i[s]+1<t[s].length?i[s]+1:null;let f=null;i[s]!==null&&(f={list:s,i:i[s]},o.push(f),n.push(...u(o.length-1)));let p=f?`${rn(s)} 前移一格，新头 ${c(f)} 入堆，堆里还是 ${o.length} 个元素。`:`${rn(s)} 已经走完了，不再补位 —— 堆里只剩 ${o.length} 个元素。`;l(`take`,`堆顶是 ${c(e)}（来自 ${rn(s)}）。出堆 → 接到结果尾部 → ${p}`,{popped:{...e},pushed:f?{...f}:null,moved:n})}let h=a.map(e=>c(e)).join(` → `);return l(`done`,`堆空了，说明每个节点都被取走且只被取走了一次 —— 一共 ${a.length} 轮，每轮最多两次堆操作（出堆 + 入堆），每次 O(log K)，所以是 O(N log K)。结果链表是 ${h}；开头那个哑结点只是锚点，返回 \`dummy.next\`。`,{done:!0}),r}var on=`mkl-styles`,sn=52,cn=40,ln=74,un=58,dn=15,fn=26,pn=40,mn=22,hn=16,gn=66,_n=34,vn=36,yn=40,bn=28,xn=168,Sn=12,Cn=46,wn=22,Tn=56,En=180,Dn=1250,On=0,kn=[`l0`,`l1`,`l2`,`l3`,`l4`,`l5`],An=e=>`mkl-${kn[e%kn.length]}`,jn=`
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
`;function Mn(){if(mt(),document.getElementById(on))return;let e=document.createElement(`style`);e.id=on,e.textContent=jn,document.head.appendChild(e)}function Nn(e){let t=Math.floor(Math.log2(e+1));return{x:(e-(2**t-1)+.5)/2**t*xn,y:t*Cn}}function Pn(e,t={}){if(!e||e.dataset.mklMounted===`1`)return{destroy(){}};e.dataset.mklMounted=`1`,Mn(),On+=1;let n=Array.isArray(t.lists)&&t.lists.length?t.lists:[[1,4],[2,5],[3,6],[0,7]],r=t.autoplay!==!1,i=an(n),a=n.length,o=Math.max(1,a),s=n.reduce((e,t)=>Math.max(e,t.length),0),c=1+n.reduce((e,t)=>e+t.length,0),l=e=>un+e*ln,u=e=>l(e)+sn/2,d=e=>e<=0?un:un+(e-1)*ln+sn,f=e=>d(e)+fn,p=o*gn-(gn-cn),m=wn+(Math.floor(Math.log2(o))*Cn+bn),h=Math.max(p,m),g=_n+h+vn,_=g+cn+hn+20,v=f(s)+dn,y=v+Tn+En,b=f(c)+dn+12,x=Math.max(y+36,b),S=Math.round((x-y)/2),C=S+v+Tn,w=e=>C+Sn+Nn(e).x,T=e=>_n+Math.max(0,Math.round((h-m)/2))+wn+Nn(e).y,E=document.createElement(`div`);E.className=`viz mkl`;let D=document.createElement(`div`);D.className=`viz__stage`,E.appendChild(D);let O=Y(`svg`,{class:`viz__svg mkl__svg`,viewBox:`0 0 ${x} ${_}`,role:`img`,"aria-label":`合并 ${a} 个升序链表的小顶堆推演动画`});D.appendChild(O);function k(e,t,n,r,i){let a=Y(`g`,{class:i});return a.appendChild(Y(`line`,{class:`mkl-edge__line`,x1:t,y1:r,x2:n-9,y2:r})),a.appendChild(Y(`path`,{class:`mkl-edge__head`,d:`M ${n} ${r} L ${n-9} ${r-5.5} L ${n-9} ${r+5.5} Z`})),e.appendChild(a),a}function A(e,t,n){e.appendChild(Y(`circle`,{class:`mkl-null__ring`,cx:t,cy:n,r:dn}));let r=Y(`text`,{class:`mkl-null__text`,x:t,y:n});r.textContent=`∅`,e.appendChild(r)}function j(e,t,n,r,i){let a=Y(`g`,{class:`mkl-node ${i}`});a.appendChild(Y(`rect`,{class:`mkl-node__box`,x:n,y:r,width:sn,height:cn,rx:8}));let o=Y(`text`,{class:`mkl-node__value`,x:n+sn/2,y:r+cn/2});return o.textContent=String(t),a.appendChild(o),e.appendChild(a),a}let ee=n.map((e,t)=>{let n=_n+t*gn,r=n+cn/2,i=Y(`g`,{class:`mkl-src ${An(t)}`}),a=Y(`text`,{class:`mkl-row-label`,x:S+un/2-6,y:r});a.textContent=String.fromCharCode(65+t),i.appendChild(a);let o=e.map((e,t)=>j(i,e,S+un+t*ln,n,``));for(let t=0;t<e.length-1;t+=1)k(i,S+un+t*ln+sn,S+un+(t+1)*ln,r,``);return e.length>0&&k(i,S+d(e.length),S+f(e.length)-dn,r,``),A(i,S+f(e.length),r),O.appendChild(i),{g:i,labelEl:a,nodes:o,values:e}}),te=Y(`g`,{class:`mkl-heap`});O.appendChild(te);let M=Y(`text`,{class:`mkl-heap__caption`,x:C+Sn+xn/2,y:_n+Math.max(0,Math.round((h-m)/2))+wn/2});te.appendChild(M);let N=[];for(let e=1;e<o;e+=1){let t=e-1>>1,n=Y(`g`,{class:`mkl-hedge`});n.appendChild(Y(`line`,{class:`mkl-hedge__line`,x1:w(t),y1:T(t)+bn,x2:w(e),y2:T(e)})),te.appendChild(n),N.push({g:n,child:e})}let P=[];for(let e=0;e<o;e+=1){let t=Y(`g`,{class:`mkl-hslot is-off`});t.appendChild(Y(`rect`,{class:`mkl-hnode__box`,x:w(e)-yn/2,y:T(e),width:yn,height:bn,rx:7}));let n=Y(`text`,{class:`mkl-hnode__value`,x:w(e),y:T(e)+bn/2});t.appendChild(n),te.appendChild(t),P.push({g:t,textEl:n})}let ne=Y(`text`,{class:`mkl-heap__root-tag`,x:w(0)+yn/2+24,y:T(0)+bn/2});ne.textContent=`堆顶`,te.appendChild(ne);let F=Y(`g`,{class:`mkl-result`});O.appendChild(F);let I=g+cn/2,re=Y(`text`,{class:`mkl-row-label`,x:26,y:I});re.textContent=`结果`,F.appendChild(re);let ie=Y(`g`,{class:`mkl-dummy`});ie.appendChild(Y(`rect`,{class:`mkl-dummy__box`,x:l(0),y:g,width:sn,height:cn,rx:8}));let ae=Y(`text`,{class:`mkl-dummy__text`,x:u(0),y:I});ae.textContent=`dummy`,ie.appendChild(ae),F.appendChild(ie);let oe=[];for(let e=1;e<c;e+=1)oe.push(k(F,l(e-1)+sn,l(e),I,`mkl-redge`));A(F,f(c),I);let L=k(F,d(c),f(c)-dn,I,`mkl-redge`),R=i[i.length-1].taken.map((e,t)=>j(F,n[e.list][e.i],l(t+1),g,`mkl-rslot ${An(e.list)}`)),z=Y(`g`,{class:`mkl-chip mkl-chip--tail`});z.appendChild(Y(`rect`,{class:`mkl-chip__box`,x:-40/2,y:-22/2,width:pn,height:mn}));let se=Y(`text`,{class:`mkl-chip__text`,x:0,y:0});se.textContent=`tail`,z.appendChild(se),F.appendChild(z);let ce=document.createElement(`p`);ce.className=`viz__desc`,ce.setAttribute(`aria-live`,`polite`),E.appendChild(ce);let le=gt();E.appendChild(le.root),e.textContent=``,e.appendChild(E);let B=null;function ue(e,t){let r=t.heap.length,i=new Set(t.moved);ee.forEach((e,n)=>{let r=t.cursors[n];e.g.classList.toggle(`is-dead`,r===null),e.labelEl.classList.toggle(`is-live`,r!==null),e.labelEl.classList.toggle(`is-dead`,r===null),e.nodes.forEach((e,t)=>{e.classList.toggle(`is-taken`,r===null||t<r),e.classList.toggle(`is-head`,r===t)})}),P.forEach((e,a)=>{if(a>=r){e.g.setAttribute(`class`,`mkl-hslot is-off`);return}let o=t.heap[a];e.textEl.textContent=String(n[o.list][o.i]),e.g.setAttribute(`class`,`mkl-hslot ${An(o.list)}${i.has(a)?` is-moved`:``}`+(a===0?` is-root`:``))}),N.forEach(e=>{e.g.style.display=e.child<r?``:`none`}),M.textContent=r===0?`堆：空了 —— 全部节点已取出`:`堆：只有 ${r} 个候选（每条链表当前的头部）`,ne.classList.toggle(`is-off`,r===0);let a=t.phase===`take`?t.taken.length:1/0;R.forEach((e,n)=>{let r=n+1,i=r<=t.taken.length;e.classList.toggle(`is-filled`,i),e.classList.toggle(`is-new`,i&&r>=a)}),oe.forEach((e,n)=>e.classList.toggle(`is-on`,n+1<=t.taken.length)),L.classList.toggle(`is-on`,t.done);let o=Math.min(t.taken.length,c-1);z.style.transform=`translate(${u(o)}px, ${g+cn+hn}px)`,X(ce,t.desc)}let de=_t({steps:i,controls:le,intervalMs:Dn,onRender:ue});de.jumpTo(Math.trunc(t.initialStep)||0);let fe=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!fe&&typeof IntersectionObserver==`function`&&(B=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){B.disconnect(),B=null,de.play();return}},{threshold:.35}),B.observe(E)),{destroy(){B&&=(B.disconnect(),null),de.destroy(),e.textContent=``,delete e.dataset.mklMounted,--On,On<=0&&(document.getElementById(on)?.remove(),ht())}}}function Fn(e,t){let n=[],r=0,i=0;for(;r<e.length&&i<t.length;)e[r]<=t[i]?(n.push(e[r]),r+=1):(n.push(t[i]),i+=1);for(;r<e.length;)n.push(e[r++]);for(;i<t.length;)n.push(t[i++]);return n}var In=e=>e.length?e.join(`、`):`∅`;function Ln(e){let t=(Array.isArray(e)?e:[]).map(e=>Array.isArray(e)?e.slice():[]),n=t.length,r=[],i=t.reduce((e,t)=>e+t.length,0),a=e=>e.map(e=>({lists:e.lists.map(e=>e.slice()),from:e.from?e.from.map(e=>[e[0],e[1]]):null}));if(n===0)return r.push({phase:`init`,desc:"`lists` 是个空数组，一条链表都没有，直接返回 ∅。",levels:[],activeLevel:-1,rounds:0,done:!0}),r;let o=[{lists:t.map(e=>e.slice()),from:null}];if(n===1)return r.push({phase:`init`,desc:`只有 1 条链表，**一次合并都不用做** —— 分治的轮数是 ⌈log₂1⌉ = 0，直接返回它自己（${In(t[0])}）。`,levels:a(o),activeLevel:0,rounds:0,done:!0}),r;r.push({phase:`init`,desc:`分治的起手：${n} 条链表一字排开，一共 ${i} 个节点。接下来每一轮**两两配对合并**，链表条数每次减半 —— ${n} → ${Math.ceil(n/2)} → … → 1，一共 ⌈log₂${n}⌉ = ${Math.ceil(Math.log2(n))} 轮。`,levels:a(o),activeLevel:0,rounds:0,done:!1});let s=t,c=0;for(;s.length>1;){let e=[],t=[];for(let n=0;n<s.length;n+=2)n+1<s.length?(e.push(Fn(s[n],s[n+1])),t.push([n,n+1])):(e.push(s[n].slice()),t.push([n,-1]));c+=1,o.push({lists:e,from:t});let n=s.length,i=e.length,l=t.reduce((e,[t,n])=>e+(n>=0?s[t].length+s[n].length:0),0),u=t.filter(e=>e[1]>=0).length,d=t.find(e=>e[1]<0);r.push({phase:`merge`,desc:`第 ${c} 轮：把 ${n} 条两两配对，做 ${u} 次「合并两个有序链表」，得到 ${i} 条。本轮被摸到的节点一共 ${l} 个，不超过 N —— 每轮都是 O(N) 的工作量。`+(d?`注意第 ${d[0]+1} 条这轮**轮空**了，原样进下一轮（不是丢掉）。`:`链表条数 ${n} → ${i}。`),levels:a(o),activeLevel:o.length-1,rounds:c,done:!1}),s=e}return r.push({phase:`done`,desc:`一共 ${c} 轮，每轮 O(N)，所以总时间是 **O(N log K)** —— 和最小堆同阶。结果链表是 ${In(s[0])}。分治的隐藏优势：它不需要堆，每一轮都是纯粹的指针比较，常数更小。`,levels:a(o),activeLevel:o.length-1,rounds:c,done:!0}),r}var Rn=`mkc-styles`,zn=44,Bn=36,Vn=18,Hn=38,Un=68,Wn=76,Gn=34,Kn=54,qn=30,Jn=1400,Yn=0,Xn=`
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
`;function Zn(){if(mt(),document.getElementById(Rn))return;let e=document.createElement(`style`);e.id=Rn,e.textContent=Xn,document.head.appendChild(e)}var Qn=e=>`mkc-lv${Math.min(e,4)}`;function $n(e,t={}){if(!e||e.dataset.mkcMounted===`1`)return{destroy(){}};e.dataset.mkcMounted=`1`,Zn(),Yn+=1;let n=Array.isArray(t.lists)&&t.lists.length?t.lists:[[7],[2],[5],[1],[8],[3],[6],[4]],r=t.autoplay!==!1,i=Ln(n),a=i[i.length-1].levels,o=a.map(e=>{let t=[],n=Un;for(let r of e.lists){let e=r.length?r.length*zn+(r.length-1)*Vn:qn;t.push({x:n,w:e,values:r}),n+=e+Hn}return{items:t,width:t.length?n-Hn:Un,top:Gn}});o.forEach((e,t)=>{e.top=Gn+t*Wn});let s=o.reduce((e,t)=>Math.max(e,t.width),Un)+Kn,c=Gn+(o.length-1)*Wn+Bn+26,l=(e,t)=>{let n=o[e].items[t];return n?n.x+n.w/2:Un},u=document.createElement(`div`);u.className=`viz mkc`;let d=document.createElement(`div`);d.className=`viz__stage`,u.appendChild(d);let f=Y(`svg`,{class:`viz__svg mkc__svg`,viewBox:`0 0 ${s} ${c}`,role:`img`,"aria-label":`合并 ${n.length} 个升序链表的分治推演动画`});d.appendChild(f);let p=[];for(let e=1;e<o.length;e+=1)(a[e].from||[]).forEach((t,n)=>{let[r,i]=t,a=o[e-1].top+Bn,s=o[e].top,c=l(e,n),u=Y(`g`,{class:`mkc-link ${Qn(e)}`});if(i<0)u.appendChild(Y(`line`,{class:`mkc-link__line`,x1:l(e-1,r),y1:a,x2:c,y2:s}));else for(let t of[r,i]){let n=l(e-1,t);u.appendChild(Y(`path`,{class:`mkc-link__line`,d:`M ${n} ${a} C ${n} ${a+22}, ${c} ${s-22}, ${c} ${s}`}))}f.appendChild(u),p.push({g:u,level:e})});let m=[];o.forEach((e,t)=>{let n=Y(`g`,{class:`mkc-row ${Qn(t)}`}),r=e.top+Bn/2,i=Y(`text`,{class:`mkc-row-label`,x:Un-16,y:r});i.textContent=t===0?`输入`:`第 ${t} 轮`,n.appendChild(i);let a=Y(`text`,{class:`mkc-row-count`,x:e.width+14,y:r});a.textContent=`${e.items.length} 条`,n.appendChild(a);let o=[];e.items.forEach(t=>{if(!t.values.length){n.appendChild(Y(`circle`,{class:`mkc-null__ring`,cx:t.x+qn/2,cy:r,r:11}));let e=Y(`text`,{class:`mkc-null__text`,x:t.x+qn/2,y:r});e.textContent=`∅`,n.appendChild(e);return}t.values.forEach((i,a)=>{let s=t.x+a*62,c=Y(`g`,{class:`mkc-node`});c.appendChild(Y(`rect`,{class:`mkc-node__box`,x:s,y:e.top,width:zn,height:Bn,rx:7}));let l=Y(`text`,{class:`mkc-node__value`,x:s+zn/2,y:r});l.textContent=String(i),c.appendChild(l),n.appendChild(c),o.push(c)})}),f.appendChild(n),m.push({g:n,nodes:o,countEl:a,level:t})});let h=document.createElement(`p`);h.className=`viz__desc`,h.setAttribute(`aria-live`,`polite`),u.appendChild(h);let g=gt();u.appendChild(g.root),e.textContent=``,e.appendChild(u);let _=null;function v(e,t){let n=t.levels.length;m.forEach(e=>{e.g.classList.toggle(`is-hidden`,e.level>=n),e.g.classList.toggle(`is-active`,e.level===t.activeLevel),e.nodes.forEach(n=>{n.classList.toggle(`is-new`,e.level===t.activeLevel&&t.phase!==`init`)}),e.level<n&&(e.countEl.textContent=`${t.levels[e.level].lists.length} 条`)}),p.forEach(e=>{e.g.classList.toggle(`is-hidden`,e.level>=n),e.g.classList.toggle(`is-on`,e.level===t.activeLevel)}),X(h,t.desc)}let y=_t({steps:i,controls:g,intervalMs:Jn,onRender:v});y.jumpTo(Math.trunc(t.initialStep)||0);let b=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!b&&typeof IntersectionObserver==`function`&&(_=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){_.disconnect(),_=null,y.play();return}},{threshold:.35}),_.observe(u)),{destroy(){_&&=(_.disconnect(),null),y.destroy(),e.textContent=``,delete e.dataset.mkcMounted,--Yn,Yn<=0&&(document.getElementById(Rn)?.remove(),ht())}}}var er=[1,2,3,4,5,6,7,8,9,10,11,12,13],tr=4;function nr(e,t,n){return!Number.isInteger(e)||!Number.isInteger(t)||!Number.isInteger(n)||n<=0||e<t?null:(e-t)%n}function rr(e,t){let n=Math.abs(e),r=Math.abs(t);for(;r;)[n,r]=[r,n%r];return n}function ir(e={}){let t=Array.isArray(e.values)?e.values.slice():er.slice(),n=t.length,r=Number.isInteger(e.fastStep)&&e.fastStep>=1?e.fastStep:2,i=r-1,a=e.cycleStart===void 0?tr:e.cycleStart,o=Number.isInteger(a)&&a>=0&&a<n,s=o?a:null,c=o?n-s:0,l=o?{start:s,length:c}:null,u=[],d=(e,t,n={})=>u.push({phase:e,desc:t,slow:null,fast:null,gap:null,cycle:l?{...l}:null,fastStep:r,closing:i,steps:0,met:!1,done:!1,...n});if(n===0)return d(`end`,"链表是空的，连头节点都没有 —— 不存在环，返回 `false`。",{done:!0}),u;let f=e=>!Number.isInteger(e)||e>=n?null:e+1<n?e+1:o?s:null,p=e=>Number.isInteger(e)&&e>=0&&e<n?String(t[e]):`∅`,m=(e,t)=>{if(!o)return null;let n=nr(e,s,c),r=nr(t,s,c);return n===null||r===null?null:(n-r+c)%c},h=0,g=0,_=i<=0?`**两个指针速度一样，相对速度是 0** —— 它们会永远保持这个距离，不可能相遇。`:`快指针每步比慢指针多走 ${i} 格 —— 这个相对速度恒定不变，是后面一切的起点。`;if(d(`init`,`慢指针和快指针都站在头节点 ${p(0)}。快指针每步走 **${r} 格**、慢指针走 1 格，`+_,{slow:h,fast:g,steps:0}),i<=0)return d(`end`,`相对速度是 0，两指针永远同步前进，距离不会变 —— 不相遇。所以快指针**至少要走 2 步**，这是「一定相遇」的第一道门槛。`,{slow:h,fast:g,done:!0}),u;let v=2*n+8,y=`cap`;for(let e=1;e<=v;e+=1){let t=g;for(let e=0;e<r&&t!==null;e+=1)t=f(t);if(g=t,h=f(h),h===null&&g===null){y=`fell-off`;break}let n=m(h,g);if(h!==null&&h===g){let t=i===1?`相对速度是 1，所以「快指针沿环前进方向到慢指针的距离」每步**恰好减 1**；它是在模 ${c} 的意义下减 1 的，必然依次经过 ${c-1}、…、1、0 —— 所以**一定相遇**，慢指针进环后最多 ${c-1} 步。`:`相对速度是 ${i}，距离每步减 ${i}；它能减到 0，是因为慢指针进环那一刻的距离恰好是 gcd(${i}, ${c}) = ${rr(i,c)} 的倍数。`;return d(`met`,`两者在节点 ${p(h)} **相遇**。走了 ${e} 步，快指针比慢指针多走了 ${e*i} 格，正好是环长 ${c} 的整数倍 —— 这是相遇的代数原因。${t}`,{slow:h,fast:g,gap:n,steps:e,met:!0,done:!0}),u}if(g===null){y=`fell-off`;break}let a;a=n===null?o&&g>=s?`慢指针还在直段（第 ${h+1} 个节点），快指针已经进环了 —— 慢指针没进环之前，两者不可能相遇。`:`两者都还在直段，快指针只是领先慢指针 ${g-h} 格，距离还没有被环长约束住。`:`两者都在环上。快指针沿环前进方向到慢指针还差 **${n} 格**，比上一步少了 ${i} —— 只要相对速度是 1，这个数每步必然减 1。`,d(`move`,`慢指针到 ${p(h)}、快指针到 ${p(g)}。${a}`,{slow:h,fast:g,gap:n,steps:e})}return y===`fell-off`?(d(`end`,`快指针走到了链表末尾（\`fast\` 或 \`fast.next\` 是空）—— **这条链表没有环**，返回 \`false\`。一共走了 ${u.length} 步：没有环时快指针每步走 ${r} 格，最多 n / ${r} 步就出界，所以判环是 O(n) 时间、O(1) 空间。`,{slow:h,fast:g,done:!0}),u):(d(`end`,`走了 ${u.length} 步仍未相遇，已超过步数上限 ${v} —— 这是不该出现的情况，请检查输入（两指针同起点时，任何 fastStep ≥ 2 都必然相遇）。`,{slow:h,fast:g,gap:m(h,g),done:!0}),u)}var ar=`cyc-layout-styles`,or=20,sr=`
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
`;function wr(){if(mt(),cr(),document.getElementById(yr))return;let e=document.createElement(`style`);e.id=yr,e.textContent=Cr,document.head.appendChild(e)}function Tr(e,t,n){let r=Y(`g`,{class:`cyc-chip cyc-chip--${t}`});r.appendChild(Y(`rect`,{class:`cyc-chip__box`,x:-26/2,y:-20/2,width:xr,height:20}));let i=Y(`text`,{class:`cyc-chip__text`,x:0,y:0});return i.textContent=n,r.appendChild(i),e.appendChild(r),r}function Er(e,t={}){if(!e||e.dataset.cydMounted===`1`)return{destroy(){}};e.dataset.cydMounted=`1`,wr();let n=ir(t),r=n[0].cycle,i=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4,5,6,7,8,9,10,11,12,13],a=r?r.start:null,o=t.autoplay!==!1,s=document.createElement(`div`);s.className=`viz cyd`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=Y(`svg`,{class:`viz__svg cyd__svg`,viewBox:`0 0 700 400`,role:`img`,"aria-label":`Floyd 判圈（龟兔赛跑）推演动画`});c.appendChild(l);let u=vr(l,{values:i,cycleStart:a});l.setAttribute(`viewBox`,`0 0 ${u.width} ${u.height}`),l.setAttribute(`width`,u.width),l.setAttribute(`height`,u.height);let d=Y(`g`,{class:`cyd-arc is-off`}),f=Y(`path`,{class:`cyd-arc__line`}),p=Y(`path`,{class:`cyd-arc__head`}),m=Y(`rect`,{class:`cyd-arc__tag-bg`,x:-30,y:-9,width:60,height:18,rx:6}),h=Y(`text`,{class:`cyd-arc__tag`,x:0,y:0}),g=Y(`g`,{class:`cyd-arc__tag-group`});g.append(m,h),d.append(f,p,g),l.appendChild(d);let _=Tr(l,`slow`,`慢`),v=Tr(l,`fast`,`快`);function y(e,t){return _r(u.at(e),u,t)}let b=(e,t)=>{if(!t){e.style.opacity=`0`;return}e.style.opacity=`1`,e.setAttribute(`transform`,`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)})`)},x=document.createElement(`p`);x.className=`viz__desc`,x.setAttribute(`aria-live`,`polite`),s.appendChild(x);let S=gt();s.appendChild(S.root),e.textContent=``,e.appendChild(s);let C=null;function w(e,t){let n=u.b,r=t.slow!==null&&t.slow===t.fast;u.nodes.forEach(e=>{let n=e.index===t.slow,r=e.index===t.fast;e.g.classList.toggle(`is-slow`,n&&!r),e.g.classList.toggle(`is-fast`,r&&!n),e.g.classList.toggle(`is-both`,n&&r)}),b(_,t.slow===null?null:y(t.slow,r?-1:0)),b(v,t.fast===null?null:y(t.fast,+!!r));let i=t.fast===null?-1:u.ringKOf(t.fast),a=t.slow===null?-1:u.ringKOf(t.slow),o=n>0&&i>=0&&a>=0&&t.gap!==null&&t.gap>0;if(d.classList.toggle(`is-off`,!o),o){let e=u.radius-br,r=(a-i+n)%n,o=ur(i,n),s=ur(i+r,n),c=s-o,l=t=>{let n=t*Math.PI/180;return{x:u.ringCenter.x+e*Math.cos(n),y:u.ringCenter.y+e*Math.sin(n)}},d=l(o),m=l(s),_=+(c>180);f.setAttribute(`d`,`M ${d.x.toFixed(1)} ${d.y.toFixed(1)} A ${e} ${e} 0 ${_} 1 ${m.x.toFixed(1)} ${m.y.toFixed(1)}`);let v=s*Math.PI/180,y=-Math.sin(v),b=Math.cos(v),x=-b,S=y;p.setAttribute(`d`,`M ${m.x} ${m.y} L ${m.x-y*9+x*5} ${m.y-b*9+S*5} L ${m.x-y*9-x*5} ${m.y-b*9-S*5} Z`);let C=(o+c/2)*Math.PI/180,w={x:u.ringCenter.x+e*Math.cos(C),y:u.ringCenter.y+e*Math.sin(C)};g.setAttribute(`transform`,`translate(${w.x.toFixed(1)} ${w.y.toFixed(1)})`),h.textContent=`${t.gap} 格`}X(x,t.desc)}let T=_t({steps:n,controls:S,intervalMs:Sr,onRender:w});T.jumpTo(Math.trunc(t.initialStep)||0);let E=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return o&&!E&&typeof IntersectionObserver==`function`&&(C=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){C.disconnect(),C=null,T.play();return}},{threshold:.35}),C.observe(s)),{destroy(){C&&=(C.disconnect(),null),T.destroy(),e.textContent=``,delete e.dataset.cydMounted,document.getElementById(yr)?.remove()}}}var Dr=[1,2,3,4,5,6,7,8,9,10,11,12,13],Or=4;function kr(e={}){let t=Array.isArray(e.values)?e.values.slice():Dr.slice(),n=t.length,r=e.cycleStart===void 0?Or:e.cycleStart,i=[],a=(e,t,n={})=>i.push({phase:e,desc:t,ptr1:null,ptr2:null,walked:0,remain1:0,remain2:0,passed2:!1,entry:null,meetAt:null,a:0,b:0,x:0,m:0,done:!1,...n});if(n===0)return a(`none`,"链表是空的，没有环，返回 `null`。",{done:!0}),i;let o=ir({values:t,cycleStart:r}),s=o[o.length-1];if(!s.met)return a(`none`,"这条链表没有环（快指针已经走到末尾），所以 LC 142 直接返回 `null` —— 入口根本不存在。",{done:!0}),i;let c=s.cycle.start,l=s.cycle.length,u=s.slow,d=(u-c)%l,f=c+d,p=f/l,m=l-d,h=e=>Number.isInteger(e)&&e>=0&&e<n?String(t[e]):`∅`,g=e=>!Number.isInteger(e)||e>=n?null:e+1<n?e+1:c,_=c===m?`这里 a 恰好等于 b - x，所以两个指针会**同步**抵达入口。`:`注意 a = ${c} 而 b - x = ${m}，后者更小 —— ptr2 会先路过入口、绕回来之后才和 ptr1 碰上。同余式只管「差整数圈」，不管谁先到。`;if(a(`meet`,`第一阶段的终点：慢指针和快指针在节点 ${h(u)} 相遇。设入口是 ${h(c)}、直段长 \`a = ${c}\`、环长 \`b = ${l}\`、相遇点距入口 \`x = ${d}\`，那么 \`a + x = ${f} = ${p} × b\`，也就是 \`a ≡ b - x (mod b)\`。现在**把 ptr1 放回 head、ptr2 留在相遇点，两者都改成每步走 1 格**：ptr1 要走到入口差 **${c} 步**，ptr2 沿环走到入口差 **${m} 步**。${_}`,{ptr1:0,ptr2:u,walked:0,remain1:c,remain2:m,entry:c,meetAt:u,a:c,b:l,x:d,m:p}),c===0)return a(`found`,`**入口就是头节点 ${h(0)}。** 这里 a = 0，头节点本身就在环上 —— ptr1 一步都不用走，而相遇点也正好是入口（x = 0），所以两个指针一开始就重合。LC 142 返回这个节点。`,{ptr1:0,ptr2:u,walked:0,remain1:0,remain2:0,entry:0,meetAt:u,a:c,b:l,x:d,m:p,done:!0}),i;let v=0,y=u;for(let e=1;e<=c;e+=1){v=g(v),y=g(y);let t=c-e,n=m-e,r=n<0,o=r?(n%l+l)%l:n;if(v===y)return a(`found`,`**两个指针在节点 ${h(v)} 相遇 —— 这就是环的入口。** 从 head 走了 ${e} 步，从相遇点也走了 ${e} 步。回到那条同余式：a = ${c} 步到入口、b - x = ${m} 步也到入口，两者相差 ${p>1?`${p} 圈`:`零圈`}，所以它们必然在入口碰头。LC 142 返回这个节点。`,{ptr1:v,ptr2:y,walked:e,remain1:t,remain2:o,passed2:r,entry:c,meetAt:u,a:c,b:l,x:d,m:p,done:!0}),i;a(`walk`,`走了 ${e} 步。ptr1 到 ${h(v)}（离入口还差 **${t} 步**）、ptr2 到 ${h(y)}（离入口还差 **${o} 步**）。`+(r?`注意 ptr2 已经**越过**了入口，它要再绕一圈回来 —— 但同余式保证它绕回入口的那一刻，ptr1 也正好走到。`:`两个剩余步数**同步递减**，这是「两条路一样长」的直接体现。`),{ptr1:v,ptr2:y,walked:e,remain1:t,remain2:o,passed2:r,entry:c,meetAt:u,a:c,b:l,x:d,m:p})}return a(`found`,`走了 ${c} 步仍未同时落在入口，这不该发生 —— 请检查输入。`,{ptr1:v,ptr2:y,walked:c,entry:c,meetAt:u,a:c,b:l,x:d,m:p,done:!0}),i}var Ar=`cye-styles`,jr=42,Mr=56,Nr=32,Pr=17,Fr=1250,Ir=`
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
`;function Lr(){if(mt(),cr(),document.getElementById(Ar))return;let e=document.createElement(`style`);e.id=Ar,e.textContent=Ir,document.head.appendChild(e)}function Rr(e,t,n){let r=Y(`g`,{class:`cyc-chip cyc-chip--${t}`});r.appendChild(Y(`rect`,{class:`cyc-chip__box`,x:-32/2,y:-20/2,width:Nr,height:20}));let i=Y(`text`,{class:`cyc-chip__text`,x:0,y:0});return i.textContent=n,r.appendChild(i),e.appendChild(r),r}function zr(e,t){let n=Y(`g`,{class:`cye-tag-group cye-tag-group--${t}`}),r=Y(`rect`,{class:`cye-tag-bg`,x:-38,y:-10,width:76,height:20,rx:6}),i=Y(`text`,{class:`cye-tag cye-tag--${t}`,x:0,y:0});return n.append(r,i),e.appendChild(n),{g:n,t:i,bg:r}}function Br(e,t={}){if(!e||e.dataset.cyeMounted===`1`)return{destroy(){}};e.dataset.cyeMounted=`1`,Lr();let n=kr(t),r=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4,5,6,7,8,9,10,11,12,13],i=n[0],a=Number.isInteger(i.a)&&i.b>0?i.a:null,o=t.autoplay!==!1,s=document.createElement(`div`);s.className=`viz cye`;let c=document.createElement(`div`);c.className=`viz__stage`,s.appendChild(c);let l=Y(`svg`,{class:`viz__svg cye__svg`,viewBox:`0 0 700 400`,role:`img`,"aria-label":`环形链表找入口推演动画`});c.appendChild(l);let u=vr(l,{values:r,cycleStart:a});l.setAttribute(`viewBox`,`0 0 ${u.width} ${u.height}`),l.setAttribute(`width`,u.width),l.setAttribute(`height`,u.height);let d=u.at(u.a),f=null;if(Number.isInteger(i.meetAt)&&u.at(i.meetAt)){let e=u.at(i.meetAt),t=Y(`g`,{class:`cye-meet`});t.appendChild(Y(`rect`,{class:`cye-meet__box`,x:e.cx-46/2-6,y:e.cy-30/2-6,width:58,height:42,rx:12})),l.appendChild(t),f=t}let p=Y(`g`,{class:`cye-bar`}),m=Y(`path`,{class:`cye-bar__line`}),h=Y(`path`,{class:`cye-bar__tick`}),g=Y(`path`,{class:`cye-bar__tick`});p.append(m,h,g),l.appendChild(p);let _=zr(l,`p1`),v=Y(`g`,{class:`cye-arc`}),y=Y(`path`,{class:`cye-arc__line`}),b=Y(`path`,{class:`cye-arc__head`});v.append(y,b),l.appendChild(v);let x=zr(l,`p2`),S=Rr(l,`p1`,`P1`),C=Rr(l,`p2`,`P2`);function w(e,t){return _r(u.at(e),u,t,Pr)}let T=(e,t)=>{if(!t){e.style.opacity=`0`;return}e.style.opacity=`1`,e.setAttribute(`transform`,`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)})`)},E=document.createElement(`p`);E.className=`viz__desc`,E.setAttribute(`aria-live`,`polite`),s.appendChild(E);let D=gt();s.appendChild(D.root),e.textContent=``,e.appendChild(s);let O=null;function k(e,t){let n=u.b,r=t.ptr1!==null&&t.ptr1===t.ptr2;u.nodes.forEach(e=>{let n=e.index===t.ptr1,r=e.index===t.ptr2;e.g.classList.toggle(`is-slow`,n&&!r),e.g.classList.toggle(`is-fast`,r&&!n),e.g.classList.toggle(`is-both`,n&&r)}),T(S,t.ptr1===null?null:w(t.ptr1,r?-1:0)),T(C,t.ptr2===null?null:w(t.ptr2,+!!r)),f&&(f.style.opacity=t.phase===`found`?`0.45`:`1`);let i=t.ptr1===null?null:u.at(t.ptr1),a=!!i&&t.remain1>0&&!!d;if(p.classList.toggle(`is-off`,!a),_.g.style.opacity=a?`1`:`0`,a){let e=u.rowY+Mr,n=i.cx,r=d.cx;m.setAttribute(`d`,`M ${n} ${e} L ${r} ${e}`),h.setAttribute(`d`,`M ${n} ${e-6} L ${n} ${e+6}`),g.setAttribute(`d`,`M ${r} ${e-6} L ${r} ${e+6}`),_.g.setAttribute(`transform`,`translate(${((n+r)/2).toFixed(1)} ${e})`),_.t.textContent=`还差 ${t.remain1} 步`}let o=t.ptr2===null?-1:u.ringKOf(t.ptr2),s=n>0&&o>=0&&t.remain2>0&&!t.passed2;if(v.classList.toggle(`is-off`,!s),x.g.style.opacity=s?`1`:`0`,s){let e=u.radius-jr,r=ur(o,n),i=ur(o+t.remain2,n),a=i-r,s=t=>{let n=t*Math.PI/180;return{x:u.ringCenter.x+e*Math.cos(n),y:u.ringCenter.y+e*Math.sin(n)}},c=s(r),l=s(i);y.setAttribute(`d`,`M ${c.x.toFixed(1)} ${c.y.toFixed(1)} A ${e} ${e} 0 ${+(a>180)} 1 ${l.x.toFixed(1)} ${l.y.toFixed(1)}`);let d=i*Math.PI/180,f=-Math.sin(d),p=Math.cos(d);b.setAttribute(`d`,`M ${l.x} ${l.y} L ${l.x-f*9-p*5} ${l.y-p*9+f*5} L ${l.x-f*9+p*5} ${l.y-p*9-f*5} Z`);let m=(r+a/2)*Math.PI/180;x.g.setAttribute(`transform`,`translate(${(u.ringCenter.x+e*Math.cos(m)).toFixed(1)} ${(u.ringCenter.y+e*Math.sin(m)).toFixed(1)})`),x.t.textContent=`还差 ${t.remain2} 步`}X(E,t.desc)}let A=_t({steps:n,controls:D,intervalMs:Fr,onRender:k});A.jumpTo(Math.trunc(t.initialStep)||0);let j=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return o&&!j&&typeof IntersectionObserver==`function`&&(O=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){O.disconnect(),O=null,A.play();return}},{threshold:.35}),O.observe(s)),{destroy(){O&&=(O.disconnect(),null),A.destroy(),e.textContent=``,delete e.dataset.cyeMounted,document.getElementById(Ar)?.remove()}}}function Vr(e,t){let n=e.length,r=Array.from({length:n+1},(e,t)=>t+1<=n?t+1:null),i=[],a=t=>t===null?`∅`:t===0?`dummy`:String(e[t-1]),o=(e,a,o={})=>i.push({phase:e,desc:a,fast:0,slow:0,gap:null,links:[...r],cutSlot:null,leadTotal:t+1,syncTotal:Math.max(0,n-t),done:!1,...o});if(n===0)return o(`init`,"空链表：没有可删的节点，返回 `∅` 即可。"),i[0].done=!0,i;o(`init`,"先接一个哑结点 `dummy`，`fast` 和 `slow` 都从它出发。有它在，「删头节点」就不再需要特判。");let s=0;for(let e=1;e<=t+1;e+=1){s=r[s];let n=s-0;o(`lead`,e===1?`① \`fast\` 先走：第 1 / ${t+1} 步，指向 ${a(s)}。约定是先走 **n+1 = ${t+1}** 步 —— 要定位的是待删节点的**前驱**，所以多退这一步。`:s===null?`① \`fast\` 第 ${e} / ${t+1} 步落到了 ∅ —— \`n\` 正好等于链长，要删的就是**头节点**。同步阶段将一步不走，\`slow\` 会留在 \`dummy\` 上。`:`① \`fast\` 继续走：第 ${e} / ${t+1} 步，指向 ${a(s)}。`+(e===t+1?`间隔锁死为 **n+1 = ${t+1}**， \`slow\` 从现在起一步不会再被落下。`:`\`slow\` 原地不动，间隔拉开到 ${n}。`),{fast:s,gap:s===null?null:n})}let c=0,l=0;for(;s!==null;){s=r[s],c=r[c],l+=1;let e=s===null;o(`sync`,e?`② \`fast\` 撞到了 ∅，停下。\`slow\` 停在 ${a(c)} —— 正是**倒数第 n+1 个**节点，待删节点 ${a(c+1)} 的**前驱**。`:`② 两个指针一起走（第 ${l} / ${n-t} 步）：\`fast\` 在 ${a(s)}，\`slow\` 在 ${a(c)}。间隔保持 ${s-c} 不变 —— 这就是循环不变量。`,{fast:s,slow:c,gap:e?null:s-c})}let u=c+1;return r[c]=r[u],o(`cut`,`③ \`slow.next = slow.next.next\`：${a(c)} 的箭头跨过 ${a(u)}，直接指向 ${a(r[c])}。节点 ${a(u)} 被摘掉 —— 注意它还在内存里，只是没人再引用它。`,{slow:c,cutSlot:u}),o(`done`,`④ 返回 \`dummy.next\`（**不是 head**——如果删的是头节点，head 已经不在链上了）。得到 ${e.filter((e,t)=>t!==u-1).map(String).join(` → `)}。全程只扫了**一趟**。`,{slow:c,cutSlot:u}),i[i.length-1].done=!0,i}var Hr=`rnth-styles`,Ur=64,Wr=50,Gr=42,Kr=48,qr=88,Jr=113,Yr=40,Xr=196,Zr=236,Qr=56,$r=26,ei=272,ti=26,ni=1150,ri=`
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
`;function ii(){if(mt(),document.getElementById(Hr))return;let e=document.createElement(`style`);e.id=Hr,e.textContent=ri,document.head.appendChild(e)}function ai(e,t={}){if(!e||e.dataset.rnthMounted===`1`)return{destroy(){}};e.dataset.rnthMounted=`1`,ii();let n=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4,5],r=Math.min(Math.max(Math.trunc(t.n)||2,1),n.length),i=t.autoplay!==!1,a=Vr(n,r),o=n.length,s=o+1,c=2*Kr+s*Ur+(s-1)*Gr,l=e=>Kr+e*106,u=e=>l(e)+Ur/2,d=c-ti,f=document.createElement(`div`);f.className=`viz rnth`;let p=document.createElement(`div`);p.className=`viz__stage`,f.appendChild(p);let m=Y(`svg`,{class:`viz__svg rnth__svg`,viewBox:`0 0 ${c} ${ei}`,role:`img`,"aria-label":`删除倒数第 ${r} 个节点推演动画：${n.join(` → `)}`});p.appendChild(m),m.appendChild(Y(`circle`,{class:`rnth-null__ring`,cx:d,cy:Jr,r:15}));let h=Y(`text`,{class:`rnth-null__text`,x:d,y:Jr});h.textContent=`∅`,m.appendChild(h);let g=Y(`line`,{class:`rnth-tick`}),_=Y(`line`,{class:`rnth-tick`});m.append(g,_);let v=[];for(let e=0;e<o;e+=1){let t=ft(l(e)+Ur,l(e+1),Jr,1,`rnth-edge`);m.appendChild(t),v.push(t)}let y=ft(l(o)+Ur,d-15,Jr,1,`rnth-edge`);m.appendChild(y);let b=Y(`path`,{class:`rnth-arc__line`}),x=Y(`path`,{class:`rnth-arc__head`}),S=Y(`g`,{class:`rnth-arc`});S.append(b,x),m.appendChild(S);let C=[];for(let e=0;e<s;e+=1){let t=Y(`g`,{class:`rnth-node${e===0?` rnth-node--dummy`:``}`});t.appendChild(Y(`rect`,{class:`rnth-node__box`,x:l(e),y:qr,width:Ur,height:Wr,rx:9}));let r=Y(`text`,{class:`rnth-node__value`,x:u(e),y:Jr});r.textContent=e===0?`dummy`:String(n[e-1]),t.appendChild(r),m.appendChild(t),C.push(t)}let w=Y(`g`,{class:`rnth-gapline`}),T=Y(`line`,{class:`rnth-gapline__line`}),E=Y(`path`,{class:`rnth-gapline__head`}),D=Y(`path`,{class:`rnth-gapline__head`}),O=Y(`rect`,{class:`rnth-gapline__tag-bg`,x:-26,y:-9,width:52,height:18,rx:6}),k=Y(`text`,{class:`rnth-gapline__tag`,x:0,y:0});w.append(T,E,D,O,k),m.appendChild(w);function A(e,t){let n=Y(`g`,{class:`rnth-chip rnth-chip--${e}`});n.appendChild(Y(`rect`,{class:`rnth-chip__box`,x:-56/2,y:-26/2,width:Qr,height:$r}));let r=Y(`text`,{class:`rnth-chip__text`,x:0,y:0});return r.textContent=t,n}let j=A(`fast`,`fast`),ee=A(`slow`,`slow`);m.append(j,ee);let te=document.createElement(`p`);te.className=`viz__desc`,te.setAttribute(`aria-live`,`polite`),f.appendChild(te);let M=gt();f.appendChild(M.root),e.textContent=``,e.appendChild(f);let N=null,P=e=>e===null?d:u(e);function ne(e,t,n,r){let i=P(n);e.style.transform=`translate(${i}px, ${r}px)`,e.style.opacity=`1`,t.setAttribute(`x1`,i),t.setAttribute(`x2`,i),t.setAttribute(`y1`,r-$r/2),t.setAttribute(`y2`,138),t.style.opacity=`0.65`}function F(e){let t=e.cutSlot;if(t===null||e.links[t-1]!==t+1){S.classList.remove(`is-on`);return}let n=l(t-1)+Ur,r=l(t+1),i=Jr,a=Jr,o=n+(r-n)*.3,s=n+(r-n)*.7;b.setAttribute(`d`,`M ${n} ${i} C ${o} ${i-44}, ${s} ${a-44}, ${r-8} ${a}`),x.setAttribute(`d`,`M ${r} ${a} L ${r-9} ${a-5.5} L ${r-9} 118.5 Z`),S.classList.add(`is-on`)}function I(e){let t=e.gap!==null&&e.gap>0&&e.fast!==null;if(w.classList.toggle(`is-on`,t),!t)return;let n=u(e.slow),r=u(e.fast);T.setAttribute(`x1`,n),T.setAttribute(`x2`,r),T.setAttribute(`y1`,Yr),T.setAttribute(`y2`,Yr),E.setAttribute(`d`,`M ${n} ${Yr} L ${n+7} ${Yr-4.5} L ${n+7} 44.5 Z`),D.setAttribute(`d`,`M ${r} ${Yr} L ${r-7} ${Yr-4.5} L ${r-7} 44.5 Z`),O.setAttribute(`x`,(n+r)/2-26),O.setAttribute(`y`,Yr-9),k.setAttribute(`x`,(n+r)/2),k.setAttribute(`y`,Yr),k.textContent=`间隔 ${e.gap}`}function re(e,t){for(let e=0;e<s;e+=1)C[e].classList.toggle(`is-cut`,t.cutSlot!==null&&e===t.cutSlot);for(let e=0;e<o;e+=1)v[e].classList.toggle(`is-on`,t.links[e]===e+1);y.classList.toggle(`is-on`,t.links[o]===null),F(t),I(t),t.fast===null?(j.style.transform=`translate(${d}px, ${Xr}px)`,j.style.opacity=`1`,g.style.opacity=`0`):ne(j,g,t.fast,Xr),ne(ee,_,t.slow,Zr),X(te,t.desc)}let ie=_t({steps:a,controls:M,intervalMs:ni,onRender:re});ie.jumpTo(Math.trunc(t.initialStep)||0);let ae=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return i&&!ae&&typeof IntersectionObserver==`function`&&(N=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){N.disconnect(),N=null,ie.play();return}},{threshold:.35}),N.observe(f)),{destroy(){N&&=(N.disconnect(),null),ie.destroy(),e.textContent=``,delete e.dataset.rnthMounted,document.getElementById(Hr)?.remove()}}}function oi(e){if(e<=0)return null;let t=0,n=1;for(;n<e&&n+1<e;)t+=1,n+=2;return t}function si(e,t){let n=[],r=e,i=new Set;for(;r!=null&&!i.has(r);)i.add(r),n.push(r),r=t[r];return n}function ci(e){let t=e.length,n=[];for(let r=0;r<Math.floor(t/2);r+=1)n.push(e[r],e[t-1-r]);return t%2==1&&n.push(e[Math.floor(t/2)]),n}function li(e){let t=e.length,n=Array.from({length:t},(e,n)=>n+1<t?n+1:null),r=t=>t===null?`∅`:String(e[t]),i=[],a=(e,t,r={})=>i.push({phase:e,stage:0,desc:t,links:[...n],merged:[],front:[],back:[],chips:[],cutEdge:null,done:!1,...r}),o=(e,t)=>si(e,n).filter(e=>!t.includes(e));if(t<=1)return a(`init`,t===0?`空链表，没什么可重排的。`:`只有一个节点，重排之后还是它自己 —— 直接返回。`,{front:si(0,n)}),i[0].done=!0,i;a(`init`,`目标：前半段顺序不变，后半段倒过来插进缝隙 —— 也就是要把 ${e.join(` → `)} 变成 ${ci(e).join(` → `)}。全程只改指针，一个值都不动。`,{front:si(0,n)});let s=oi(t),c=0,l=1,u=0;for(;l<t&&l+1<t;)c+=1,l+=2,u+=1,a(`mid`,`① 快慢指针找中点（第 ${u} 步）：\`fast\` 一次跨两格到 ${r(l<t?l:null)}，\`slow\` 一次挪一格到 ${r(c)}。`+(c===s?` \`fast\` 走不动了 —— \`slow\` 停在 **${r(c)}**，正是前半段的最后一个节点。`:``),{stage:1,front:si(0,n),chips:[{kind:`slow`,label:`slow`,slot:c},{kind:`fast`,label:`fast`,slot:l<t?l:null}]});let d=s+1;n[s]=null,a(`split`,`② **\`slow.next = None\`** —— 断开。这一步看着多余，其实是防环的命门：前半段的尾巴要是还搭在后半段上，第 ③ 步合并时指针会绕成环，链表再也走不到头。现在前段是 ${e.slice(0,s+1).map(String).join(` → `)}，后段是 ${e.slice(d).map(String).join(` → `)}。`,{stage:2,front:si(0,n),back:si(d,n),cutEdge:[s,d]});let f=null,p=d;for(;p!==null;){let e=n[p];n[p]=f;let t=p;f=p,p=e,a(`rev`,p===null?`反转最后一步：\`${r(t)}.next\` 指向 ${r(n[t])}，后半段变成 ${si(f,n).map(r).join(` → `)}。这是 LC 206 的逐字复刻，只是起点换成了 \`second\`。`:`反转后半段：\`${r(t)}.next\` 掉头指向 ${r(n[t])}，\`prev\` 前移到 ${r(f)}，\`curr\` 前移到 ${r(p)}。`,{stage:2,front:si(0,n),back:si(f,n).concat(si(p,n)),chips:[{kind:`prev`,label:`prev`,slot:f},{kind:`curr`,label:`curr`,slot:p}]})}let m=0,h=f,g=[];for(;h!==null;){let e=n[m],t=n[h];n[m]=h,g.push(m,h),a(`merge`,`③ \`first.next = second\`：\`${r(m)}\` 的箭头改指向 ${r(h)}，把后半段的头节点拽了上来。\`t1\`(\`${r(e)}\`) 和 \`t2\`(\`${r(t)}\`) 提前记住了两条链的下家 —— 改指针之前先把路记住，和反转链表里那个 \`nxt\` 是同一个道理。`,{stage:3,merged:[...g],front:o(e,g),back:o(t,g),chips:[{kind:`first`,label:`first`,slot:m},{kind:`second`,label:`second`,slot:h}]}),n[h]=e,a(`merge`,t===null?`③ \`second.next = t1\`：\`${r(h)}\` 接回 ${r(e)}。后半段用完了（\`second\` 变成 ∅），循环结束 —— 条件写的是 \`while second\`，因为后半段更短。`:`③ \`second.next = t1\`：\`${r(h)}\` 接回 ${r(e)}。两个指针各自前移：\`first\` → ${r(e)}，\`second\` → ${r(t)}。`,{stage:3,merged:[...g],front:o(e,g),back:o(t,g),chips:[{kind:`first`,label:`first`,slot:e},{kind:`second`,label:`second`,slot:t}]}),m=e,h=t}let _=si(0,n);return a(`done`,`重排完成：${_.map(r).join(` → `)}。**头节点还是原来的 ${r(0)}** —— 所以这题不需要返回新头，Java 的签名就是 \`void\`。`,{stage:3,merged:_}),i[i.length-1].done=!0,i}var ui=`rord-styles`,di=64,fi=48,pi=44,mi=44,hi=118,gi=218,_i=-26,vi=44,yi=58,bi=26,xi=62,Si=1250,Ci=[`① 找中点`,`② 断开并反转`,`③ 交替合并`],wi=`
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
`;function Ti(){if(mt(),document.getElementById(ui))return;let e=document.createElement(`style`);e.id=ui,e.textContent=wi,document.head.appendChild(e)}function Ei(e,t={}){if(!e||e.dataset.rordMounted===`1`)return{destroy(){}};e.dataset.rordMounted=`1`,Ti();let n=Array.isArray(t.values)&&t.values.length?t.values:[1,2,3,4],r=t.autoplay!==!1,i=li(n),a=n.length,o=Math.max(a,1),s=e=>mi+e*108,c=2*mi+o*di+(o-1)*pi,l=c+xi,u=c+xi/2,d=e=>e+fi/2,f=document.createElement(`div`);f.className=`viz rord`;let p=document.createElement(`div`);p.className=`viz__stage`,f.appendChild(p);let m=Y(`svg`,{class:`viz__svg rord__svg`,viewBox:`0 0 ${l} 322`,role:`img`,"aria-label":`重排链表推演动画：${n.join(` → `)}`});p.appendChild(m);let h=[],g=Math.min(150,(l-2*mi-32)/3),_=(l-(3*g+32))/2;Ci.forEach((e,t)=>{let n=Y(`g`,{class:`rord-stage`}),r=_+t*(g+16);n.appendChild(Y(`rect`,{class:`rord-stage__box`,x:r,y:vi-15,width:g,height:30,rx:15}));let i=Y(`text`,{class:`rord-stage__text`,x:r+g/2,y:vi});i.textContent=e,n.appendChild(i),m.appendChild(n),h.push(n)}),m.appendChild(Y(`circle`,{class:`rord-null__ring`,cx:u,cy:d(hi),r:15}));let v=Y(`text`,{class:`rord-null__text`,x:u,y:d(hi)});v.textContent=`∅`,m.appendChild(v);let y=Y(`g`,{class:`rord-edges`});m.appendChild(y);let b=[];for(let e=0;e<a;e+=1){let t=Y(`g`,{class:`rord-node`});t.appendChild(Y(`rect`,{class:`rord-node__box`,x:0,y:0,width:di,height:fi,rx:9}));let r=Y(`text`,{class:`rord-node__value`,x:di/2,y:fi/2});r.textContent=String(n[e]),t.appendChild(r),m.appendChild(t),b.push(t)}function x(){let e=Y(`g`,{class:`rord-chip`});e.appendChild(Y(`rect`,{class:`rord-chip__box`,x:-58/2,y:-26/2,width:yi,height:bi}));let t=Y(`text`,{class:`rord-chip__text`,x:0,y:0});return e.appendChild(t),{g:e,t}}let S=[x(),x()];S.forEach(e=>m.appendChild(e.g));let C=document.createElement(`p`);C.className=`viz__desc`,C.setAttribute(`aria-live`,`polite`),f.appendChild(C);let w=gt();f.appendChild(w.root),e.textContent=``,e.appendChild(f);let T=null;function E(e,t,n,r){let i=n[e],a=n[t],o=Y(`g`,{class:`rord-edge ${r||``}`});if(i.y===a.y&&Math.abs(i.x-a.x)===108){let e=i.y+fi/2,t=i.x+di,n=a.x;o.appendChild(Y(`line`,{class:`rord-edge__line`,x1:t+3,y1:e,x2:n-9,y2:e})),o.appendChild(Y(`path`,{class:`rord-edge__head`,d:`M ${n} ${e} L ${n-9} ${e-5.5} L ${n-9} ${e+5.5} Z`}))}else{let e=i.y+fi,t=a.y+fi,n=i.x+di/2,r=a.x+di/2;o.appendChild(Y(`path`,{class:`rord-edge__line`,d:`M ${n} ${e} C ${n} ${e+38}, ${r} ${t+38}, ${r} ${t+8}`})),o.appendChild(Y(`path`,{class:`rord-edge__head`,d:`M ${r} ${t} L ${r-5.5} ${t+9} L ${r+5.5} ${t+9} Z`}))}y.appendChild(o)}function D(e,t){let n=Array(a).fill(null),r=[...t.merged,...t.front];r.forEach((e,t)=>{n[e]={x:s(t),y:hi}}),t.back.forEach((e,t)=>{n[e]={x:s(r.length+t),y:gi}});let i=r.length+t.back.length;for(let e=0;e<a;e+=1)n[e]||(n[e]={x:s(i),y:hi},i+=1);let o=new Set(t.merged);for(let e=0;e<a;e+=1){let t=n[e];b[e].setAttribute(`transform`,`translate(${t.x} ${t.y})`),b[e].classList.toggle(`is-merged`,o.has(e))}y.textContent=``;for(let e=0;e<a;e+=1){let r=t.links[e];r!=null&&(r<0||r>=a||E(e,r,n,t.phase===`merge`||t.phase===`done`?`rord-edge--merged`:``))}if(t.cutEdge){let[e,r]=t.cutEdge;if(n[e]&&n[r]){let t=Y(`g`,{class:`rord-edge rord-edge--cut`}),i=n[e],a=n[r];t.appendChild(Y(`line`,{class:`rord-edge__line`,x1:i.x+di,y1:i.y+fi/2,x2:a.x,y2:a.y+fi/2})),y.appendChild(t)}}h.forEach((e,n)=>e.classList.toggle(`is-on`,t.stage===n+1)),S.forEach((e,r)=>{let i=t.chips[r];if(!i){e.g.style.opacity=`0`;return}let a=i.slot===null?{x:u-di/2,y:hi}:n[i.slot];e.g.style.opacity=`1`,e.g.setAttribute(`class`,`rord-chip rord-chip--${i.kind}`),e.t.textContent=i.label,e.g.setAttribute(`transform`,`translate(${a.x+di/2} ${a.y+_i})`)}),X(C,t.desc)}let O=_t({steps:i,controls:w,intervalMs:Si,onRender:D});O.jumpTo(Math.trunc(t.initialStep)||0);let k=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!k&&typeof IntersectionObserver==`function`&&(T=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){T.disconnect(),T=null,O.play();return}},{threshold:.35}),T.observe(f)),{destroy(){T&&=(T.disconnect(),null),O.destroy(),e.textContent=``,delete e.dataset.rordMounted,document.getElementById(ui)?.remove()}}}function Di(e,t){let n=[],r=e,i=new Set;for(;r!=null&&!i.has(r);)i.add(r),n.push(r),r=t[r];return n}function Oi(e){if(e<=0)return null;let t=0,n=0;for(;n<e&&n+1<e;)t+=1,n+=2;return t}function ki(e){let t=e.length;for(let n=0;n<Math.floor(t/2);n+=1)if(e[n]!==e[t-1-n])return!1;return!0}function Ai(e){let t=Oi(e);if(t===null)return[];let n=[];for(let r=0;e-1-r>=t;r+=1)n.push([r,e-1-r]);return n}function ji(e){let t=e.length,n=Array.from({length:t},(e,n)=>n+1<t?n+1:null),r=t=>t==null?`∅`:String(e[t]),i=[],a=(e,t,r={})=>i.push({phase:e,stage:0,desc:t,links:[...n],front:[],back:[],pairs:[],active:null,verdict:null,chips:[],done:!1,...r});if(t===0)return a(`init`,"空链表。正着读、反着读都是「什么都没有」—— **空链表也算回文**，返回 `true`。",{stage:0,done:!0,verdict:!0}),i;ki(e);let o=e.slice().reverse().join(` → `);if(a(`init`,`判断 ${e.join(` → `)} 是不是回文。核心一句话：**把后半段反转过来（${o}），它应该跟前半段逐位相同**。全程只改指针、只比值，不开数组。`,{front:Di(0,n)}),t===1)return a(`done`,"只有一个节点，正着读反着读都是它自己 —— **是回文**，返回 `true`。",{front:[0],stage:3,done:!0,verdict:!0}),i;let s=Oi(t),c=0,l=0,u=0;for(;l<t&&l+1<t;){c+=1,l+=2,u+=1;let e=l>=t;a(`mid`,`① \`fast\` 一次跨两格、\`slow\` 一次一格：第 ${u} 步后 \`slow\` 走到 ${r(c)}、\`fast\` 走到 ${r(l)}。`+(e?` \`fast\` 冲出链表了 —— \`slow\` 停在 ${r(c)} 上，**这就是后半段的开头**。`:``),{stage:1,front:Di(0,n),chips:[{kind:`slow`,label:`slow`,slot:c},{kind:`fast`,label:`fast`,slot:l<t?l:null}]})}let d=Array.from({length:s},(e,t)=>t),f=Array.from({length:t-s},(e,t)=>s+t),p=d.map(r).join(` → `);a(`split`,`② 后半段 ${f.map(r).join(` → `)} 整体下移一行，前半段是 ${p}。接下来反转下行 —— 反转完它从左到右读起来，应该跟上行一模一样。注意这里**不需要断开**：反转时中点 `+r(s)+" 的 `next` 会被置空，前半段的尾巴走到它自然就停了。",{stage:2,front:d,back:f,chips:[{kind:`curr`,label:`curr`,slot:s}]});let m=null,h=s,g=0;for(;h!==null;){let e=n[h];n[h]=m,m=h,h=e,g+=1;let t=[...Di(m,n),...h===null?[]:Di(h,n)];a(`rev`,`② 第 ${g} 个节点掉头：\`curr\` 的 \`next\` 改成 \`prev\`，也就是 ${r(m)} → ${r(n[m])}。`+(h===null?" 后半段反转完成，`prev` 站在新的段头（原来的尾节点）上。":` \`curr\` 前移到 ${r(h)}，剩下的还没处理。`),{stage:2,front:d,back:t,chips:[{kind:`prev`,label:`prev`,slot:m},...h===null?[]:[{kind:`curr`,label:`curr`,slot:h}]]})}let _=Di(t-1,n),v=[],y=Ai(t);for(let t=0;t<y.length;t+=1){let[n,o]=y[t],s=n===o,c=e[n]===e[o],l={f:n,b:o,ok:c};if(v.push(l),a(`cmp`,`③ 第 ${t+1} / ${y.length} 对：`+(s?`\`p1\` 和 \`p2\` 都走到了中点 ${r(n)} 上 —— **中点跟自己比，必然相等**，这一对是白送的。`:`\`p1\` 指向 ${r(n)}、\`p2\` 指向 ${r(o)}，${e[n]} ${c?`==`:`!=`} ${e[o]} —— `+(c?`相等，两个指针一起往前。`:"**不相等，直接返回 `false`**，后面几对不用比了。")),{stage:3,front:d,back:_,pairs:[...v],active:l,verdict:c?null:!1,done:!c,chips:s?[{kind:`p1`,label:`p1/p2`,slot:n}]:[{kind:`p1`,label:`p1`,slot:n},{kind:`p2`,label:`p2`,slot:o}]}),!c)return i}return a(`done`,`③ \`p2\` 走到 ∅，${y.length} 对全部相等 —— **${e.join(` → `)} 是回文链表**，返回 \`true\`。`,{stage:3,front:d,back:_,pairs:[...v],active:null,verdict:!0,done:!0}),i}var Mi=`palm-styles`,Ni=64,Pi=48,Fi=44,Ii=44,Li=118,Ri=236,zi=-26,Bi=44,Vi=58,Hi=26,Ui=62,Wi=350,Gi=1250,Ki=[`① 找中点`,`② 反转后半段`,`③ 逐对比较`],qi=`
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
`;function Ji(){if(mt(),document.getElementById(Mi))return;let e=document.createElement(`style`);e.id=Mi,e.textContent=qi,document.head.appendChild(e)}function Yi(e,t={}){if(!e||e.dataset.palmMounted===`1`)return{destroy(){}};e.dataset.palmMounted=`1`,Ji();let n=Array.isArray(t.values)&&t.values.length?t.values:[1,2,2,1],r=t.autoplay!==!1,i=ji(n),a=n.length,o=Math.max(a,1),s=e=>Ii+e*108,c=2*Ii+o*Ni+(o-1)*Fi,l=c+Ui,u=c+Ui/2,d=e=>e+Pi/2,f=document.createElement(`div`);f.className=`viz palm`;let p=document.createElement(`div`);p.className=`viz__stage`,f.appendChild(p);let m=Y(`svg`,{class:`viz__svg palm__svg`,viewBox:`0 0 ${l} 390`,role:`img`,"aria-label":`回文链表推演动画：${n.join(` → `)}`});p.appendChild(m);let h=[],g=Math.min(150,(l-2*Ii-32)/3),_=(l-(3*g+32))/2;Ki.forEach((e,t)=>{let n=Y(`g`,{class:`palm-stage`}),r=_+t*(g+16);n.appendChild(Y(`rect`,{class:`palm-stage__box`,x:r,y:Bi-15,width:g,height:30,rx:15}));let i=Y(`text`,{class:`palm-stage__text`,x:r+g/2,y:Bi});i.textContent=e,n.appendChild(i),m.appendChild(n),h.push(n)}),m.appendChild(Y(`circle`,{class:`palm-null__ring`,cx:u,cy:d(Li),r:15}));let v=Y(`text`,{class:`palm-null__text`,x:u,y:d(Li)});v.textContent=`∅`,m.appendChild(v);let y=Y(`g`,{class:`palm-pairs`});m.appendChild(y);let b=Y(`g`,{class:`palm-edges`});m.appendChild(b);let x=[];for(let e=0;e<a;e+=1){let t=Y(`g`,{class:`palm-node`});t.appendChild(Y(`rect`,{class:`palm-node__box`,x:0,y:0,width:Ni,height:Pi,rx:9}));let r=Y(`text`,{class:`palm-node__value`,x:Ni/2,y:Pi/2});r.textContent=String(n[e]),t.appendChild(r),m.appendChild(t),x.push(t)}function S(){let e=Y(`g`,{class:`palm-chip`});e.appendChild(Y(`rect`,{class:`palm-chip__box`,x:-58/2,y:-26/2,width:Vi,height:Hi}));let t=Y(`text`,{class:`palm-chip__text`,x:0,y:0});return e.appendChild(t),{g:e,t}}let C=[S(),S()];C.forEach(e=>m.appendChild(e.g));let w=Y(`g`,{class:`palm-verdict`}),T=Y(`rect`,{class:`palm-verdict__box`,x:(l-190)/2,y:Wi-18,width:190,height:36,rx:18}),E=Y(`text`,{class:`palm-verdict__text`,x:l/2,y:Wi});w.appendChild(T),w.appendChild(E),m.appendChild(w);let D=document.createElement(`p`);D.className=`viz__desc`,D.setAttribute(`aria-live`,`polite`),f.appendChild(D);let O=gt();f.appendChild(O.root),e.textContent=``,e.appendChild(f);let k=null;function A(e,t,n){let r=n[e],i=n[t],a=Y(`g`,{class:`palm-edge`});if(r.y===i.y&&Math.abs(r.x-i.x)===108){let e=r.y+Pi/2,t=r.x+Ni,n=i.x;a.appendChild(Y(`line`,{class:`palm-edge__line`,x1:t+3,y1:e,x2:n-9,y2:e})),a.appendChild(Y(`path`,{class:`palm-edge__head`,d:`M ${n} ${e} L ${n-9} ${e-5.5} L ${n-9} ${e+5.5} Z`}))}else{let e=r.y+Pi,t=i.y+Pi,n=r.x+Ni/2,o=i.x+Ni/2;a.appendChild(Y(`path`,{class:`palm-edge__line`,d:`M ${n} ${e} C ${n} ${e+38}, ${o} ${t+38}, ${o} ${t+8}`})),a.appendChild(Y(`path`,{class:`palm-edge__head`,d:`M ${o} ${t} L ${o-5.5} ${t+9} L ${o+5.5} ${t+9} Z`}))}b.appendChild(a)}function j(e,t,n){let r=Y(`g`,{class:`palm-pair ${e.ok?`is-ok`:`is-bad`} ${n?`is-on`:``}`});if(e.f===e.b){let n=t[e.f],i=n.x+Ni/2-18,a=n.y+Pi;r.appendChild(Y(`path`,{class:`palm-pair__line`,d:`M ${i-14} ${a} C ${i-22} ${a+26}, ${i+22} ${a+26}, ${i+14} ${a}`})),ee(r,i,a+26*.78,e.ok)}else{let n=t[e.f],i=t[e.b],a=n.x+Ni/2-18,o=n.y+Pi,s=i.y,c=(o+s)/2;r.appendChild(Y(`line`,{class:`palm-pair__line`,x1:a,y1:o+10,x2:a,y2:c-11})),r.appendChild(Y(`line`,{class:`palm-pair__line`,x1:a,y1:c+11,x2:a,y2:s-2})),ee(r,a,c,e.ok)}y.appendChild(r)}function ee(e,t,n,r){e.appendChild(Y(`circle`,{class:`palm-pair__disc`,cx:t,cy:n,r:11}));let i=Y(`text`,{class:`palm-pair__mark`,x:t,y:n});i.textContent=r?`✓`:`✗`,e.appendChild(i)}function te(e,t){let n=Array(a).fill(null);t.front.forEach((e,t)=>{n[e]={x:s(t),y:Li}}),t.back.forEach((e,t)=>{n[e]={x:s(t),y:Ri}});let r=Math.max(t.front.length,t.back.length);for(let e=0;e<a;e+=1)n[e]||(n[e]={x:s(r),y:Li},r+=1);let i=new Set;for(let e of t.pairs)i.add(e.f),i.add(e.b);let o=new Set;t.active&&(o.add(t.active.f),o.add(t.active.b));let c=new Set;t.active&&!t.active.ok&&(c.add(t.active.f),c.add(t.active.b));for(let e=0;e<a;e+=1){let t=n[e];x[e].setAttribute(`transform`,`translate(${t.x} ${t.y})`),x[e].classList.toggle(`is-paired`,i.has(e)),x[e].classList.toggle(`is-active`,o.has(e)),x[e].classList.toggle(`is-bad`,c.has(e))}y.textContent=``,t.pairs.forEach((e,r)=>{let i=t.active&&t.pairs.indexOf(t.active)===r;j(e,n,i)}),b.textContent=``;for(let e=0;e<a;e+=1){let r=t.links[e];r!=null&&(r<0||r>=a||A(e,r,n))}h.forEach((e,n)=>e.classList.toggle(`is-on`,t.stage===n+1)),w.setAttribute(`class`,`palm-verdict`);let l=`准备开始`;t.verdict===!0?(w.classList.add(`is-ok`),l=`✓ 是回文链表`):t.verdict===!1?(w.classList.add(`is-bad`),l=`✗ 不是回文链表`):t.phase===`cmp`?l=`比较中…`:t.phase===`split`||t.phase===`rev`?l=`反转中…`:t.phase===`mid`?l=`定位中点…`:t.phase===`init`&&(l=`待判定`),E.textContent=l,C.forEach((e,r)=>{let i=t.chips[r];if(!i){e.g.style.opacity=`0`;return}let a=i.slot===null?{x:u-Ni/2,y:Li}:n[i.slot],o=a.y===Ri&&i.slot!==null?a.y+Pi+14:a.y+zi;e.g.style.opacity=`1`,e.g.setAttribute(`class`,`palm-chip palm-chip--${i.kind}`),e.t.textContent=i.label,e.g.setAttribute(`transform`,`translate(${a.x+Ni/2} ${o})`)}),X(D,t.desc)}let M=_t({steps:i,controls:O,intervalMs:Gi,onRender:te});M.jumpTo(Math.trunc(t.initialStep)||0);let N=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return r&&!N&&typeof IntersectionObserver==`function`&&(k=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){k.disconnect(),k=null,M.play();return}},{threshold:.35}),k.observe(f)),{destroy(){k&&=(k.disconnect(),null),M.destroy(),e.textContent=``,delete e.dataset.palmMounted,document.getElementById(Mi)?.remove()}}}var Xi=[`innerHTML`],Zi=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,Qi=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,$i=`0.16.21`,ea=`11.4.1`,ta=y({__name:`MarkdownView`,props:{html:{type:String,default:``},title:{type:String,default:``}},setup(e){let t=e,n=w(null),r=v(()=>ct(st.sanitize(t.html,{ADD_ATTR:[`target`,`rel`],FORBID_TAGS:[`style`,`iframe`,`object`,`embed`,`form`],FORBID_ATTR:[`onerror`,`onload`,`onclick`]}),t.title));function i(e){e.classList.add(`copied`),e.innerHTML=Qi,setTimeout(()=>{e.classList.remove(`copied`),e.innerHTML=Zi},2e3)}function s(){n.value&&n.value.querySelectorAll(`table`).forEach(e=>{if(e.parentElement?.classList.contains(`table-scroll`))return;let t=document.createElement(`div`);t.className=`table-scroll`,e.parentNode.insertBefore(t,e),t.appendChild(e)})}function l(){n.value&&n.value.querySelectorAll(`pre`).forEach(e=>{if(e.parentElement?.classList.contains(`code-block-wrapper`))return;let t=document.createElement(`div`);t.className=`code-block-wrapper`,e.parentNode.insertBefore(t,e),t.appendChild(e);let n=document.createElement(`button`);n.className=`copy-btn`,n.title=`复制代码`,n.innerHTML=Zi,n.addEventListener(`click`,()=>{let t=(e.querySelector(`code`)||e).textContent||``;navigator.clipboard.writeText(t).then(()=>{i(n)}).catch(()=>{let e=document.createElement(`textarea`);e.value=t,e.style.position=`fixed`,e.style.opacity=`0`,document.body.appendChild(e),e.select(),document.execCommand(`copy`),document.body.removeChild(e),i(n)})}),t.appendChild(n)})}function u(e,t){return new Promise((n,r)=>{if(document.querySelector(`link[data-lib-href="${e}"]`))return n();let i=document.createElement(`link`);i.rel=`stylesheet`,i.href=e,i.integrity=t,i.crossOrigin=`anonymous`,i.dataset.libHref=e,i.onload=()=>n(),i.onerror=()=>r(Error(`Failed to load stylesheet `+e)),document.head.appendChild(i)})}function d(e,t){return new Promise((n,r)=>{if(document.querySelector(`script[data-lib-src="${e}"]`))return n();let i=document.createElement(`script`);i.src=e,i.integrity=t,i.crossOrigin=`anonymous`,i.dataset.libSrc=e,i.onload=()=>n(),i.onerror=()=>r(Error(`Failed to load script `+e)),document.head.appendChild(i)})}let f=null;async function m(){return f||=Promise.all([u(`https://cdn.jsdelivr.net/npm/katex@${$i}/dist/katex.min.css`,`sha384-zh0CIslj+VczCZtlzBcjt5ppRcsAmDnRem7ESsYwWwg3m/OaJ2l4x7YBZl9Kxxib`),d(`https://cdn.jsdelivr.net/npm/katex@${$i}/dist/katex.min.js`,`sha384-Rma6DA2IPUwhNxmrB/7S3Tno0YY7sFu9WSYMCuulLhIqYSGZ2gKCJWIqhBWqMQfh`)]).then(()=>window.katex),f}let h=null;async function g(){return h||=d(`https://cdn.jsdelivr.net/npm/mermaid@${ea}/dist/mermaid.min.js`,`sha384-rbtjAdnIQE/aQJGEgXrVUlMibdfTSa4PQju4HDhN3sR2PmaKFzhEafuePsl9H/9I`).then(()=>window.mermaid),h}async function _(){if(!n.value)return;let e=n.value.querySelectorAll(`code.language-mermaid`);if(e.length)try{let t=await g();e.forEach(e=>{let n=e.closest(`pre`);if(!n||n.dataset.mermaidRendered)return;n.dataset.mermaidRendered=`1`;let r=document.createElement(`div`);r.className=`mermaid-container`,r.textContent=e.textContent,n.parentNode.replaceChild(r,n),t.run({nodes:[r]})})}catch(e){console.warn(`Mermaid failed to load/render:`,e?.message||e)}n.value.querySelectorAll(`img`).forEach(e=>{let t=e.getAttribute(`src`)||``;e.getAttribute(`alt`);let n=t.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);if(n){let t=document.createElement(`div`);t.className=`video-wrapper`,t.innerHTML=`<iframe src="https://www.youtube.com/embed/${n[1]}" frameborder="0" allowfullscreen></iframe>`,e.parentNode.replaceChild(t,e);return}let r=t.match(/bilibili\.com\/video\/(BV[\w]+)/);if(r){let t=document.createElement(`div`);t.className=`video-wrapper`,t.innerHTML=`<iframe src="https://player.bilibili.com/player.html?bvid=${r[1]}" frameborder="0" allowfullscreen></iframe>`,e.parentNode.replaceChild(t,e);return}});let t=/(\$\$[\s\S]+?\$\$|\$[^\s$](?:[^$]*[^\s$])?\$)/,r=document.createTreeWalker(n.value,NodeFilter.SHOW_TEXT),i=[],a;for(;a=r.nextNode();)!a.nodeValue||!t.test(a.nodeValue)||a.parentElement?.closest(`pre, code`)||i.push(a);if(i.length)try{let e=await m();for(let n of i){let r=document.createDocumentFragment();for(let i of n.nodeValue.split(t)){if(!i)continue;let t=i.startsWith(`$$`)&&i.endsWith(`$$`)&&i.length>3,n=!t&&i.startsWith(`$`)&&i.endsWith(`$`)&&i.length>2;if(!t&&!n){r.appendChild(document.createTextNode(i));continue}let a=i.slice(t?2:1,t?-2:-1),o=document.createElement(`span`);o.innerHTML=e.renderToString(a,{displayMode:t,throwOnError:!1}),r.appendChild(o)}n.parentNode.replaceChild(r,n)}}catch(e){console.warn(`KaTeX failed to load/render:`,e?.message||e)}}let y={"algo-viz--lc206":It,"algo-viz--lc21":nn,"algo-viz--lc23":Pn,"algo-viz--lc23dc":$n,"algo-viz--lc141":Er,"algo-viz--lc142":Br,"algo-viz--lc19":ai,"algo-viz--lc143":Ei,"algo-viz--lc234":Yi},b=[];function x(){b.forEach(e=>{try{e?.destroy?.()}catch(e){console.warn(`Algo viz teardown failed:`,e?.message||e)}}),b=[]}function T(){n.value&&(x(),n.value.querySelectorAll(`.algo-viz`).forEach(e=>{let t=Object.keys(y).find(t=>e.classList.contains(t));if(t)try{b.push(y[t](e))}catch(e){console.warn(`Algo viz failed to mount:`,t,e?.message||e)}}))}return a(()=>{o(()=>{T(),_(),s(),l()})}),C(x),p(()=>t.html,()=>{o(()=>{T(),_(),s(),l()})}),(e,t)=>(S(),c(`div`,{ref_key:`bodyRef`,ref:n,class:`markdown-body`,innerHTML:r.value},null,8,Xi))}},[[`__scopeId`,`data-v-498a8ea0`]]);function na(e){return T.get(`/articles/${e}/comments/`)}function ra(e,t){return T.post(`/articles/${e}/comments/`,t)}var ia={key:0,class:`form-title`},aa={key:1,class:`form-title`},oa={class:`form-field`},sa={key:0,class:`field-error`},ca={class:`form-field`},la={key:0,class:`field-error`},ua={class:`hp-field`,"aria-hidden":`true`},da={class:`form-field`},fa={key:0,class:`field-error`},pa={key:0,class:`submit-error`},ma={key:1,class:`submit-success`},ha={class:`form-actions`},ga=[`disabled`],_a={key:0,class:`spinner`},va={key:1},ya=y({__name:`CommentForm`,props:{articleSlug:{type:String,required:!0},parentId:{type:[Number,String],default:null}},emits:[`submitted`,`cancel`],setup(e,{emit:t}){let n=e,r=t,a=i({author_name:``,author_email:``,content:``,website:``}),o=i({author_name:``,author_email:``,content:``}),u=w(!1),d=w(null),p=w(!1);function m(){let e=!0;return o.author_name=``,o.author_email=``,o.content=``,a.author_name.trim()||(o.author_name=`请输入昵称`,e=!1),a.author_email.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.author_email)||(o.author_email=`邮箱格式不正确`,e=!1):(o.author_email=`请输入邮箱`,e=!1),a.content.trim()?a.content.trim().length<3&&(o.content=`评论内容至少3个字符`,e=!1):(o.content=`请输入评论内容`,e=!1),e}function g(e){o[e]&&(o[e]=``),d.value=null}async function _(){if(m()){u.value=!0,d.value=null;try{let e={author_name:a.author_name.trim(),author_email:a.author_email.trim(),content:a.content.trim(),website:a.website};n.parentId&&(e.parent=n.parentId),await ra(n.articleSlug,e),p.value=!0,setTimeout(()=>{p.value=!1},3e3),r(`submitted`),a.author_name=``,a.author_email=``,a.content=``}catch(e){let t=e?.response?.data;if(typeof t==`object`&&t){let e=t;e.author_name&&(o.author_name=Array.isArray(e.author_name)?e.author_name[0]:e.author_name),e.author_email&&(o.author_email=Array.isArray(e.author_email)?e.author_email[0]:e.author_email),e.content&&(o.content=Array.isArray(e.content)?e.content[0]:e.content),e.detail&&(d.value=e.detail),e.non_field_errors&&(d.value=Array.isArray(e.non_field_errors)?e.non_field_errors[0]:e.non_field_errors)}else typeof t==`string`?d.value=t:d.value=e.message||`提交失败，请稍后重试`}finally{u.value=!1}}}return(t,n)=>(S(),c(`div`,{class:h([`comment-form`,{"reply-form":!!e.parentId}])},[e.parentId?(S(),c(`h4`,ia,`回复评论`)):(S(),c(`h4`,aa,`发表评论`)),s(`form`,{onSubmit:k(_,[`prevent`]),class:`form-body`},[s(`div`,oa,[f(s(`input`,{"onUpdate:modelValue":n[0]||=e=>a.author_name=e,type:`text`,placeholder:`昵称 *`,class:h([`form-input`,{"input-error":o.author_name}]),onInput:n[1]||=e=>g(`author_name`)},null,34),[[O,a.author_name]]),o.author_name?(S(),c(`p`,sa,l(o.author_name),1)):b(``,!0)]),s(`div`,ca,[f(s(`input`,{"onUpdate:modelValue":n[2]||=e=>a.author_email=e,type:`email`,placeholder:`邮箱 *`,class:h([`form-input`,{"input-error":o.author_email}]),onInput:n[3]||=e=>g(`author_email`)},null,34),[[O,a.author_email]]),o.author_email?(S(),c(`p`,la,l(o.author_email),1)):b(``,!0)]),s(`div`,ua,[f(s(`input`,{"onUpdate:modelValue":n[4]||=e=>a.website=e,type:`text`,tabindex:`-1`,autocomplete:`off`},null,512),[[O,a.website]])]),s(`div`,da,[f(s(`textarea`,{"onUpdate:modelValue":n[5]||=e=>a.content=e,placeholder:`说点什么...`,rows:`4`,class:h([`form-textarea`,{"input-error":o.content}]),onInput:n[6]||=e=>g(`content`)},null,34),[[O,a.content]]),o.content?(S(),c(`p`,fa,l(o.content),1)):b(``,!0)]),d.value?(S(),c(`p`,pa,l(d.value),1)):b(``,!0),p.value?(S(),c(`p`,ma,`评论已提交！`)):b(``,!0),s(`div`,ha,[e.parentId?(S(),c(`button`,{key:0,type:`button`,class:`cancel-btn`,onClick:n[7]||=e=>t.$emit(`cancel`)},` 取消回复 `)):b(``,!0),s(`button`,{type:`submit`,class:`submit-btn`,disabled:u.value},[u.value?(S(),c(`span`,_a)):(S(),c(`span`,va,`提交`))],8,ga)])],32)],2))}},[[`__scopeId`,`data-v-49410be9`]]),ba={class:`comment-list`},xa={class:`comments-title`},Sa={key:0,class:`comments-count`},Ca={key:0,class:`skeleton-comments`},wa={key:1,class:`empty-comments`},Ta={key:2,class:`comments-tree`},Ea={class:`comment-main`},Da={class:`comment-content`},Oa={class:`comment-header`},ka={class:`comment-author`},Aa={class:`comment-time`},ja={class:`comment-text`},Ma=[`onClick`],Na={key:1,class:`replies`},Pa={class:`comment-main`},Fa={class:`comment-content`},Ia={class:`comment-header`},La={class:`comment-author`},Ra={class:`comment-time`},za={class:`comment-text`},Ba=y({__name:`CommentList`,props:{articleSlug:{type:String,required:!0}},setup(e){let t=e,n=w([]),i=w(!0),o=w(null),u=v(()=>n.value.filter(e=>!e.parent));function f(e){o.value=o.value===e?null:e}async function p(){i.value=!0;try{let e=await na(t.articleSlug);n.value=e.data.results||e.data||[]}catch{n.value=[]}finally{i.value=!1}}function h(){o.value=null,p()}function y(e){if(!e)return``;let t=Date.now()-new Date(e).getTime(),n=Math.floor(t/6e4),r=Math.floor(t/36e5),i=Math.floor(t/864e5);return n<1?`刚刚`:n<60?`${n}分钟前`:r<24?`${r}小时前`:i<30?`${i}天前`:i<365?`${Math.floor(i/30)}个月前`:`${Math.floor(i/365)}年前`}function C(e){let t=[`#3f6b57`,`#a45f45`,`#8a6c3f`,`#637b68`,`#7b6757`,`#4f7477`,`#8a635f`,`#6b7250`,`#536b5d`,`#9b704e`,`#65706a`,`#7b6a83`];if(!e)return t[0];let n=0;for(let t=0;t<e.length;t++)n=e.charCodeAt(t)+((n<<5)-n);return t[Math.abs(n)%t.length]}return a(p),(t,a)=>(S(),c(`div`,ba,[s(`h3`,xa,[a[1]||=g(` 评论 `,-1),n.value.length?(S(),c(`span`,Sa,`(`+l(n.value.length)+`)`,1)):b(``,!0)]),i.value?(S(),c(`div`,Ca,[(S(),c(d,null,r(3,e=>s(`div`,{key:e,class:`skeleton-comment`},[...a[2]||=[_(`<div class="skeleton-avatar" data-v-98dfce57></div><div class="skeleton-body" data-v-98dfce57><div class="skeleton-line w-30" data-v-98dfce57></div><div class="skeleton-line w-50" data-v-98dfce57></div><div class="skeleton-line w-80" data-v-98dfce57></div></div>`,2)]])),64))])):u.value.length?(S(),c(`div`,Ta,[(S(!0),c(d,null,r(u.value,t=>(S(),c(`div`,{key:t.id,class:`comment-item`},[s(`div`,Ea,[s(`div`,{class:`comment-avatar`,style:x({background:C(t.author_name)})},l(t.author_name?t.author_name.charAt(0).toUpperCase():`?`),5),s(`div`,Da,[s(`div`,Oa,[s(`span`,ka,l(t.author_name),1),s(`span`,Aa,l(y(t.created_at)),1)]),s(`p`,ja,l(t.content),1),s(`button`,{class:`reply-btn`,onClick:e=>f(t.id)},[...a[4]||=[s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`polyline`,{points:`9 17 4 12 9 7`}),s(`path`,{d:`M20 18v-2a4 4 0 0 0-4-4H4`})],-1),g(` 回复 `,-1)]],8,Ma)])]),o.value===t.id?(S(),m(ya,{key:0,"article-slug":e.articleSlug,"parent-id":t.id,onSubmitted:h,onCancel:a[0]||=e=>o.value=null,class:`reply-form-wrapper`},null,8,[`article-slug`,`parent-id`])):b(``,!0),t.replies&&t.replies.length?(S(),c(`div`,Na,[(S(!0),c(d,null,r(t.replies,e=>(S(),c(`div`,{key:e.id,class:`comment-item reply-item`},[s(`div`,Pa,[s(`div`,{class:`comment-avatar comment-avatar-sm`,style:x({background:C(e.author_name)})},l(e.author_name?e.author_name.charAt(0).toUpperCase():`?`),5),s(`div`,Fa,[s(`div`,Ia,[s(`span`,La,l(e.author_name),1),s(`span`,Ra,l(y(e.created_at)),1)]),s(`p`,za,l(e.content),1)])])]))),128))])):b(``,!0)]))),128))])):(S(),c(`div`,wa,[...a[3]||=[s(`svg`,{width:`40`,height:`40`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`1.5`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`path`,{d:`M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z`})],-1),s(`p`,null,`暂无评论，来说点什么吧`,-1)]]))]))}},[[`__scopeId`,`data-v-98dfce57`]]),Va={key:0,class:`toc-list-wrapper`},Ha={class:`toc-list`},Ua=[`href`,`title`,`onClick`],Wa={class:`toc-text`},Ga={key:1,class:`toc-empty-state`},Ka=y({__name:`TocNav`,props:{html:{type:String,default:``}},setup(e){let t=e,n=w([]),i=w(null),u=null,f=[];function m(){if(!t.html){n.value=[];return}try{let e=new DOMParser().parseFromString(t.html,`text/html`),r=[];e.querySelectorAll(`h2, h3, h4`).forEach((e,t)=>{let n=e.id||`toc-heading-${t}`;r.push({id:n,tag:e.tagName.toLowerCase(),text:e.textContent||``})}),n.value=r}catch{n.value=[]}}function g(){if(!n.value.length)return;let e=document.querySelector(`.markdown-body`);e&&e.querySelectorAll(`h2, h3, h4`).forEach((e,t)=>{let r=n.value[t];r&&!e.id&&(e.id=r.id)})}function _(){u&&=(u.disconnect(),null),f=[],n.value.length&&(u=new IntersectionObserver(e=>{let t=e.filter(e=>e.isIntersecting);t.length?i.value=t[0].target.id:window.scrollY<100&&(i.value=n.value[0]?.id||null)},{rootMargin:`-80px 0px -60% 0px`,threshold:0}),o(()=>{n.value.forEach(e=>{let t=document.getElementById(e.id);t&&(u.observe(t),f.push(t))})}))}function v(e){let t=document.getElementById(e);t&&(t.scrollIntoView({behavior:`smooth`,block:`start`}),i.value=e)}return p(()=>t.html,()=>{m(),o(()=>{g(),_()})}),a(()=>{m(),o(()=>{g(),_()})}),C(()=>{u&&u.disconnect()}),(e,t)=>(S(),c(`nav`,{class:h([`toc-nav`,{"toc-empty":!n.value.length}])},[t[2]||=s(`h4`,{class:`toc-title`},`目录`,-1),n.value.length?(S(),c(`div`,Va,[s(`ul`,Ha,[(S(!0),c(d,null,r(n.value,e=>(S(),c(`li`,{key:e.id,class:h([`toc-item`,[`toc-depth-${e.tag}`,{"toc-active":i.value===e.id}]])},[s(`a`,{href:`#`+e.id,class:`toc-link`,title:e.text,onClick:k(t=>v(e.id),[`prevent`])},[t[0]||=s(`span`,{class:`toc-dot`},null,-1),s(`span`,Wa,l(e.text),1)],8,Ua)],2))),128))])])):(S(),c(`div`,Ga,[...t[1]||=[s(`p`,null,`无目录`,-1)]]))],2))}},[[`__scopeId`,`data-v-21d21cb1`]]),qa={class:`share-buttons`},Ja={key:0,class:`copy-feedback`},Ya=y({__name:`ShareButtons`,props:{title:{type:String,default:``},url:{type:String,default:``}},setup(e){let t=e,n=w(!1);function r(){let e=encodeURIComponent(t.url||window.location.href),n=encodeURIComponent(t.title);window.open(`https://service.weibo.com/share/share.php?url=${e}&title=${n}`,`_blank`,`noopener,noreferrer,width=600,height=400`)}function i(){let e=encodeURIComponent(t.url||window.location.href),n=encodeURIComponent(t.title);window.open(`https://twitter.com/intent/tweet?url=${e}&text=${n}`,`_blank`,`noopener,noreferrer,width=600,height=400`)}function a(){alert(`请复制链接后在微信中粘贴发送`)}async function o(){try{await navigator.clipboard.writeText(t.url||window.location.href),n.value=!0,setTimeout(()=>n.value=!1,2e3)}catch{let e=document.createElement(`textarea`);e.value=t.url||window.location.href,document.body.appendChild(e),e.select(),document.execCommand(`copy`),document.body.removeChild(e),n.value=!0,setTimeout(()=>n.value=!1,2e3)}}return(e,t)=>(S(),c(`div`,qa,[t[4]||=s(`span`,{class:`share-label`},`分享：`,-1),s(`button`,{class:`share-btn wechat`,title:`微信`,onClick:a},[...t[0]||=[s(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`},[s(`path`,{d:`M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.136 0 .241-.11.241-.245 0-.06-.024-.12-.04-.178l-.325-1.233a.49.49 0 0 1 .178-.554C23.028 18.48 24 16.82 24 14.98c0-3.21-2.931-5.952-7.062-6.122zm-2.18 2.769c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z`})],-1)]]),s(`button`,{class:`share-btn weibo`,title:`微博`,onClick:r},[...t[1]||=[s(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`},[s(`path`,{d:`M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zm-7.317-6.781c-1.059-.2-1.911.419-1.903 1.383.008.964.87 1.907 1.93 2.107 1.058.2 1.91-.419 1.903-1.383-.008-.964-.87-1.907-1.93-2.107zm2.13 3.68c-.563-.249-.754-.766-.428-1.153.326-.388 1.019-.523 1.58-.275.56.248.753.764.429 1.153-.326.386-1.018.524-1.581.275zm.992-3.808c-2.07-.028-4.538.537-7.344 2.641C-.405 17.1-.279 19.15.35 20.49c.528 1.123 1.494 1.773 2.43 2.144 4.878 1.935 10.857.606 13.679-1.35 2.934-2.035 4.033-4.771 3.157-7.165-.516-1.405-1.797-2.398-3.31-2.882l.06-.05c2.485-2.08 4.213-4.585 4.213-7.146 0-5.213-7.11-7.735-10.966-5.371-1.742 1.07-2.772 2.788-3.064 4.72.422-.12.865-.197 1.323-.23 3.271-.241 7.273.776 7.273 3.86 0 3.502-3.823 4.667-6.721 4.667-.89 0-1.785-.215-2.595-.598z`})],-1)]]),s(`button`,{class:`share-btn twitter`,title:`Twitter`,onClick:i},[...t[2]||=[s(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`},[s(`path`,{d:`M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z`})],-1)]]),s(`button`,{class:`share-btn copy`,title:`复制链接`,onClick:o},[...t[3]||=[s(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`path`,{d:`M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71`}),s(`path`,{d:`M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71`})],-1)]]),n.value?(S(),c(`span`,Ja,`已复制`)):b(``,!0)]))}},[[`__scopeId`,`data-v-857c6fb5`]]),Xa={key:0,class:`related-section`},Za={class:`related-grid`},Qa={key:0,class:`related-cover`},$a=[`src`,`alt`],eo={class:`related-card-title`},to=y({__name:`RelatedArticles`,props:{articles:{type:Array,default:()=>[]}},setup(t){return(i,a)=>{let o=n(`router-link`);return t.articles.length?(S(),c(`section`,Xa,[a[0]||=s(`h3`,{class:`related-title`},`相关文章`,-1),s(`div`,Za,[(S(!0),c(d,null,r(t.articles,t=>(S(),m(o,{key:t.slug,to:`/article/`+t.slug,class:`related-card`},{default:e(()=>[t.cover_image?(S(),c(`div`,Qa,[s(`img`,{src:t.cover_image,alt:t.title,loading:`lazy`},null,8,$a)])):b(``,!0),s(`span`,eo,l(t.title),1)]),_:2},1032,[`to`]))),128))])])):b(``,!0)}}},[[`__scopeId`,`data-v-e3d8298c`]]),no={class:`newsletter glass-card`},ro=[`disabled`],io=[`disabled`],ao={key:0},oo={key:1},so={key:2},co=y({__name:`NewsletterForm`,setup(e){let t=w(``),n=w(!1),r=w(!1),i=w(``),a=w(``);async function o(){if(t.value.trim()){n.value=!0,i.value=``;try{let e=await T.post(`/subscribe/`,{email:t.value.trim()});r.value=!0,i.value=e.data.detail||`订阅成功！`,a.value=`msg-success`}catch(e){let t=e?.response?.data?.error||e?.response?.data?.detail||`订阅失败`;i.value=typeof t==`string`?t:`订阅失败，请稍后重试`,a.value=`msg-error`}finally{n.value=!1}}}return(e,u)=>(S(),c(`div`,no,[u[1]||=_(`<h4 class="newsletter-title" data-v-54a32a66><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-54a32a66><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" data-v-54a32a66></path><polyline points="22,6 12,13 2,6" data-v-54a32a66></polyline></svg> 订阅更新 </h4><p class="newsletter-desc" data-v-54a32a66>新文章发布时，通过邮件通知你</p>`,2),s(`form`,{onSubmit:k(o,[`prevent`]),class:`newsletter-form`},[f(s(`input`,{"onUpdate:modelValue":u[0]||=e=>t.value=e,type:`email`,placeholder:`your@email.com`,class:`newsletter-input`,disabled:r.value,required:``},null,8,ro),[[O,t.value]]),s(`button`,{type:`submit`,class:`newsletter-btn`,disabled:n.value||r.value},[n.value?(S(),c(`span`,ao,`...`)):r.value?(S(),c(`span`,oo,`✓`)):(S(),c(`span`,so,`订阅`))],8,io)],32),i.value?(S(),c(`p`,{key:0,class:h(a.value)},l(i.value),3)):b(``,!0)]))}},[[`__scopeId`,`data-v-54a32a66`]]),lo=`个人博客Blog`,uo=`Zhou Jun 的个人博客 — 技术、编程、AI 与科学`;function fo(e={}){let{title:t=lo,description:n=uo,image:r=``,url:i=window.location.href}=e,a=t===`个人博客Blog`?t:`${t} | ${lo}`;document.title=a;let o=(e,t,n=!1)=>{if(!t)return;let r=n?`name`:`property`,i=document.querySelector(`meta[${r}="${e}"]`);i||(i=document.createElement(`meta`),i.setAttribute(r,e),document.head.appendChild(i)),i.setAttribute(`content`,t)};o(`description`,n,!0),o(`og:title`,a),o(`og:description`,n),o(`og:image`,r),o(`og:url`,i),o(`og:type`,`article`),o(`twitter:card`,r?`summary_large_image`:`summary`),o(`twitter:title`,a),o(`twitter:description`,n),o(`twitter:image`,r),((e,t)=>{if(!t)return;let n=document.querySelector(`link[rel="${e}"]`);n||(n=document.createElement(`link`),n.setAttribute(`rel`,e),document.head.appendChild(n)),n.setAttribute(`href`,t)})(`canonical`,i)}var po={title:lo,description:uo,image:``,url:``};function mo(){fo({...po,url:window.location.origin+`/`});let e=document.querySelector(`meta[property="og:type"]`);e&&e.setAttribute(`content`,`website`);let t=document.querySelector(`link[rel="canonical"]`);t&&t.setAttribute(`href`,window.location.origin+`/`)}function ho(e){if(!e)return 1;let t=(e.match(/[一-鿿㐀-䶿]/g)||[]).length+(e.match(/[a-zA-Z]+/g)||[]).length;return Math.max(1,Math.ceil(t/250))}function go(e){return e?e.replace(/```[\s\S]*?```/g,``).replace(/`[^`]*`/g,``).replace(/!\[.*?\]\(.*?\)/g,``).replace(/\[([^\]]*)\]\(.*?\)/g,`$1`).replace(/[#*>`~\-+|_:]/g,` `).replace(/\s+/g,` `).trim():``}var _o={class:`page page-article-detail`},vo={key:0,class:`detail-skeleton`},yo={key:1,class:`error-state`},bo={key:2,class:`detail-layout`},xo={class:`detail-main`},So={class:`article-header`},Co={class:`article-title`},wo={class:`article-meta`},To={class:`meta-item meta-author`},Eo={class:`meta-item meta-date`},Do={key:0,class:`meta-item meta-category neon-text-pink`},Oo={class:`meta-item meta-reading-time`},ko={class:`meta-item meta-views`},Ao={key:0,class:`article-tags`},jo={key:0,class:`article-cover`},Mo=[`src`,`alt`],No={key:1,class:`article-nav`},Po={class:`nav-title`},Fo={class:`nav-title`},Io={class:`article-actions`},Lo=[`disabled`],Ro={class:`comment-section`},zo={class:`detail-sidebar`},Bo=y({__name:`ArticleDetail`,setup(i){let o=E();D();let f=te(),y=w(null),x=w(!0),C=w(null),O=w(null),k=w(0),M=0,N=v(()=>y.value?.created_at?new Date(y.value.created_at).toLocaleDateString(`zh-CN`,{year:`numeric`,month:`2-digit`,day:`2-digit`}):``),P=v(()=>ee(y.value?.author)),ne=v(()=>j(y.value?.category)),F=v(()=>{let e=y.value?.tags;return!e||!Array.isArray(e)?[]:e.map(A).filter(Boolean)}),I=w(!1),re=w(!1),ie=v(()=>window.location.origin+o.fullPath),ae=v(()=>y.value?y.value.reading_time?y.value.reading_time:ho(go(y.value.content||``)):1),oe=v(()=>y.value?JSON.stringify({"@context":`https://schema.org`,"@type":`Article`,headline:y.value.title,description:y.value.excerpt||``,image:y.value.cover_image||void 0,datePublished:y.value.created_at,dateModified:y.value.updated_at,author:{"@type":`Person`,name:`Zhou Jun`},publisher:{"@type":`Person`,name:`Zhou Jun`}}):``),L=null;p(oe,e=>{if(!e){L?.remove(),L=null;return}L||(L=document.createElement(`script`),L.type=`application/ld+json`,L.dataset.articleJsonLd=`1`,document.head.appendChild(L)),L.textContent=e},{immediate:!0});async function R(){if(!(I.value||re.value)){re.value=!0;try{let e=await T.post(`/articles/${y.value.slug}/like/`);y.value&&(y.value.likes_count=e.data.likes_count),I.value=!0}catch{}finally{re.value=!1}}}async function z(){let e=o.params.slug,t=++M;if(!e){C.value=`缺少文章标识`,O.value=null,x.value=!1;return}x.value=!0,C.value=null,O.value=null,y.value=null,I.value=!1;try{let n=f.getArticleBySlug(e);if(n){if(t!==M)return;y.value=n,x.value=!1,se();return}let r=await f.fetchArticleBySlug(e);if(t!==M)return;y.value=r,y.value?se():C.value=`文章不存在`}catch(e){if(t!==M)return;O.value=e?.response?.status??null,O.value===404?C.value=`文章不存在`:C.value=e?.response?.data?.detail||e.message||`加载文章失败`}finally{t===M&&(x.value=!1)}}function se(){y.value&&fo({title:y.value.title,description:y.value.excerpt||``,image:y.value.cover_image||``,url:window.location.origin+o.fullPath})}return a(z),p(()=>o.params.slug,()=>{window.scrollTo({top:0,behavior:`instant`}),k.value++,z()}),t(()=>{mo(),L?.remove(),L=null}),(t,i)=>{let a=n(`router-link`);return S(),c(`div`,_o,[x.value?(S(),c(`div`,vo,[...i[1]||=[_(`<div class="skeleton-header" data-v-c0862088><div class="skeleton-line w-80 skeleton-lg" data-v-c0862088></div><div class="skeleton-meta-row" data-v-c0862088><div class="skeleton-line w-20" data-v-c0862088></div><div class="skeleton-line w-15" data-v-c0862088></div><div class="skeleton-line w-10" data-v-c0862088></div></div></div><div class="skeleton-body" data-v-c0862088><div class="skeleton-line w-100" data-v-c0862088></div><div class="skeleton-line w-100" data-v-c0862088></div><div class="skeleton-line w-90" data-v-c0862088></div><div class="skeleton-line w-100" data-v-c0862088></div><div class="skeleton-line w-70" data-v-c0862088></div></div>`,2)]])):C.value?(S(),c(`div`,yo,[i[3]||=s(`svg`,{width:`48`,height:`48`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`1.5`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`circle`,{cx:`12`,cy:`12`,r:`10`}),s(`line`,{x1:`12`,y1:`8`,x2:`12`,y2:`12`}),s(`line`,{x1:`12`,y1:`16`,x2:`12.01`,y2:`16`})],-1),s(`h2`,null,l(O.value===404?`文章不存在`:`加载失败`),1),s(`p`,null,l(C.value),1),u(a,{to:`/articles`,class:`back-link`},{default:e(()=>[...i[2]||=[g(`返回首页`,-1)]]),_:1})])):y.value?(S(),c(`div`,bo,[s(`article`,xo,[s(`header`,So,[s(`h1`,Co,l(y.value.title),1),s(`div`,wo,[s(`span`,To,[i[4]||=s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`path`,{d:`M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2`}),s(`circle`,{cx:`12`,cy:`7`,r:`4`})],-1),g(` `+l(P.value),1)]),s(`span`,Eo,[i[5]||=_(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-c0862088><rect x="3" y="4" width="18" height="18" rx="2" ry="2" data-v-c0862088></rect><line x1="16" y1="2" x2="16" y2="6" data-v-c0862088></line><line x1="8" y1="2" x2="8" y2="6" data-v-c0862088></line><line x1="3" y1="10" x2="21" y2="10" data-v-c0862088></line></svg>`,1),g(` `+l(N.value),1)]),y.value.category?(S(),c(`span`,Do,[i[6]||=s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`path`,{d:`M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z`})],-1),g(` `+l(ne.value),1)])):b(``,!0),s(`span`,Oo,[i[7]||=s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`circle`,{cx:`12`,cy:`12`,r:`10`}),s(`polyline`,{points:`12 6 12 12 16 14`})],-1),g(` 约 `+l(ae.value)+` 分钟 `,1)]),s(`span`,ko,[i[8]||=s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`path`,{d:`M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z`}),s(`circle`,{cx:`12`,cy:`12`,r:`3`})],-1),g(` `+l(y.value.views_count||0),1)])]),F.value.length?(S(),c(`div`,Ao,[(S(!0),c(d,null,r(F.value,(e,t)=>(S(),c(`span`,{key:t,class:`tag-pill`},l(e),1))),128))])):b(``,!0)]),y.value.cover_image?(S(),c(`div`,jo,[s(`img`,{src:y.value.cover_image,alt:y.value.title},null,8,Mo)])):b(``,!0),u(ta,{html:y.value.html_content||y.value.content||``,title:y.value.title},null,8,[`html`,`title`]),y.value.prev_article||y.value.next_article?(S(),c(`nav`,No,[y.value.prev_article?(S(),m(a,{key:0,to:`/article/`+(y.value.prev_article.slug||y.value.prev_article),class:`nav-link prev-link`},{default:e(()=>[i[9]||=s(`span`,{class:`nav-direction`},[s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`polyline`,{points:`15 18 9 12 15 6`})]),g(` 上一篇 `)],-1),s(`span`,Po,l(y.value.prev_article.title||y.value.prev_article),1)]),_:1},8,[`to`])):b(``,!0),y.value.next_article?(S(),m(a,{key:1,to:`/article/`+(y.value.next_article.slug||y.value.next_article),class:`nav-link next-link`},{default:e(()=>[i[10]||=s(`span`,{class:`nav-direction`},[g(` 下一篇 `),s(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[s(`polyline`,{points:`9 18 15 12 9 6`})])],-1),s(`span`,Fo,l(y.value.next_article.title||y.value.next_article),1)]),_:1},8,[`to`])):b(``,!0)])):b(``,!0),s(`div`,Io,[u(Ya,{title:y.value.title,url:ie.value},null,8,[`title`,`url`]),s(`button`,{class:h([`like-btn`,{liked:I.value}]),disabled:re.value,onClick:R},[i[11]||=s(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`},[s(`path`,{d:`M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z`})],-1),s(`span`,null,l(y.value.likes_count||0),1)],10,Lo)]),u(to,{articles:y.value.related_articles||[]},null,8,[`articles`]),u(co),s(`section`,Ro,[(S(),m(Ba,{"article-slug":y.value.slug,key:k.value},null,8,[`article-slug`])),u(ya,{"article-slug":y.value.slug,onSubmitted:i[0]||=e=>k.value++},null,8,[`article-slug`])])]),s(`aside`,zo,[u(Ka,{html:y.value.html_content||y.value.content||``},null,8,[`html`])])])):b(``,!0)])}}},[[`__scopeId`,`data-v-c0862088`]]);export{Bo as default};