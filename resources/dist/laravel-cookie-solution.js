/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const I = window, ht = I.ShadowRoot && (I.ShadyCSS === void 0 || I.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ct = Symbol(), dt = /* @__PURE__ */ new WeakMap();
let xt = class {
  constructor(t, e, o) {
    if (this._$cssResult$ = !0, o !== ct)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (ht && t === void 0) {
      const o = e !== void 0 && e.length === 1;
      o && (t = dt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), o && dt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const kt = (s) => new xt(typeof s == "string" ? s : s + "", void 0, ct), jt = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((o, r, i) => o + ((n) => {
    if (n._$cssResult$ === !0)
      return n.cssText;
    if (typeof n == "number")
      return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[i + 1], s[0]);
  return new xt(e, s, ct);
}, qt = (s, t) => {
  ht ? s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet) : t.forEach((e) => {
    const o = document.createElement("style"), r = I.litNonce;
    r !== void 0 && o.setAttribute("nonce", r), o.textContent = e.cssText, s.appendChild(o);
  });
}, pt = ht ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const o of t.cssRules)
    e += o.cssText;
  return kt(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var W;
const L = window, ut = L.trustedTypes, Dt = ut ? ut.emptyScript : "", mt = L.reactiveElementPolyfillSupport, rt = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Dt : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, At = (s, t) => t !== s && (t == t || s == s), Z = { attribute: !0, type: String, converter: rt, reflect: !1, hasChanged: At };
let A = class extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = !1, this.hasUpdated = !1, this._$El = null, this.u();
  }
  static addInitializer(t) {
    var e;
    this.finalize(), ((e = this.h) !== null && e !== void 0 ? e : this.h = []).push(t);
  }
  static get observedAttributes() {
    this.finalize();
    const t = [];
    return this.elementProperties.forEach((e, o) => {
      const r = this._$Ep(o, e);
      r !== void 0 && (this._$Ev.set(r, o), t.push(r));
    }), t;
  }
  static createProperty(t, e = Z) {
    if (e.state && (e.attribute = !1), this.finalize(), this.elementProperties.set(t, e), !e.noAccessor && !this.prototype.hasOwnProperty(t)) {
      const o = typeof t == "symbol" ? Symbol() : "__" + t, r = this.getPropertyDescriptor(t, o, e);
      r !== void 0 && Object.defineProperty(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, o) {
    return { get() {
      return this[e];
    }, set(r) {
      const i = this[t];
      this[e] = r, this.requestUpdate(t, i, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) || Z;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return !1;
    this.finalized = !0;
    const t = Object.getPrototypeOf(this);
    if (t.finalize(), t.h !== void 0 && (this.h = [...t.h]), this.elementProperties = new Map(t.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const e = this.properties, o = [...Object.getOwnPropertyNames(e), ...Object.getOwnPropertySymbols(e)];
      for (const r of o)
        this.createProperty(r, e[r]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), !0;
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const o = new Set(t.flat(1 / 0).reverse());
      for (const r of o)
        e.unshift(pt(r));
    } else
      t !== void 0 && e.push(pt(t));
    return e;
  }
  static _$Ep(t, e) {
    const o = e.attribute;
    return o === !1 ? void 0 : typeof o == "string" ? o : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  u() {
    var t;
    this._$E_ = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), (t = this.constructor.h) === null || t === void 0 || t.forEach((e) => e(this));
  }
  addController(t) {
    var e, o;
    ((e = this._$ES) !== null && e !== void 0 ? e : this._$ES = []).push(t), this.renderRoot !== void 0 && this.isConnected && ((o = t.hostConnected) === null || o === void 0 || o.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$ES) === null || e === void 0 || e.splice(this._$ES.indexOf(t) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((t, e) => {
      this.hasOwnProperty(e) && (this._$Ei.set(e, this[e]), delete this[e]);
    });
  }
  createRenderRoot() {
    var t;
    const e = (t = this.shadowRoot) !== null && t !== void 0 ? t : this.attachShadow(this.constructor.shadowRootOptions);
    return qt(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var t;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$ES) === null || t === void 0 || t.forEach((e) => {
      var o;
      return (o = e.hostConnected) === null || o === void 0 ? void 0 : o.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$ES) === null || t === void 0 || t.forEach((e) => {
      var o;
      return (o = e.hostDisconnected) === null || o === void 0 ? void 0 : o.call(e);
    });
  }
  attributeChangedCallback(t, e, o) {
    this._$AK(t, o);
  }
  _$EO(t, e, o = Z) {
    var r;
    const i = this.constructor._$Ep(t, o);
    if (i !== void 0 && o.reflect === !0) {
      const n = (((r = o.converter) === null || r === void 0 ? void 0 : r.toAttribute) !== void 0 ? o.converter : rt).toAttribute(e, o.type);
      this._$El = t, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$El = null;
    }
  }
  _$AK(t, e) {
    var o;
    const r = this.constructor, i = r._$Ev.get(t);
    if (i !== void 0 && this._$El !== i) {
      const n = r.getPropertyOptions(i), p = typeof n.converter == "function" ? { fromAttribute: n.converter } : ((o = n.converter) === null || o === void 0 ? void 0 : o.fromAttribute) !== void 0 ? n.converter : rt;
      this._$El = i, this[i] = p.fromAttribute(e, n.type), this._$El = null;
    }
  }
  requestUpdate(t, e, o) {
    let r = !0;
    t !== void 0 && (((o = o || this.constructor.getPropertyOptions(t)).hasChanged || At)(this[t], e) ? (this._$AL.has(t) || this._$AL.set(t, e), o.reflect === !0 && this._$El !== t && (this._$EC === void 0 && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t, o))) : r = !1), !this.isUpdatePending && r && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = !0;
    try {
      await this._$E_;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var t;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((r, i) => this[i] = r), this._$Ei = void 0);
    let e = !1;
    const o = this._$AL;
    try {
      e = this.shouldUpdate(o), e ? (this.willUpdate(o), (t = this._$ES) === null || t === void 0 || t.forEach((r) => {
        var i;
        return (i = r.hostUpdate) === null || i === void 0 ? void 0 : i.call(r);
      }), this.update(o)) : this._$Ek();
    } catch (r) {
      throw e = !1, this._$Ek(), r;
    }
    e && this._$AE(o);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$ES) === null || e === void 0 || e.forEach((o) => {
      var r;
      return (r = o.hostUpdated) === null || r === void 0 ? void 0 : r.call(o);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$Ek() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$EC !== void 0 && (this._$EC.forEach((e, o) => this._$EO(o, this[o], e)), this._$EC = void 0), this._$Ek();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
A.finalized = !0, A.elementProperties = /* @__PURE__ */ new Map(), A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, mt == null || mt({ ReactiveElement: A }), ((W = L.reactiveElementVersions) !== null && W !== void 0 ? W : L.reactiveElementVersions = []).push("1.6.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var J;
const B = window, C = B.trustedTypes, wt = C ? C.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, it = "$lit$", y = `lit$${(Math.random() + "").slice(9)}$`, St = "?" + y, It = `<${St}>`, E = document, M = () => E.createComment(""), R = (s) => s === null || typeof s != "object" && typeof s != "function", Ct = Array.isArray, Lt = (s) => Ct(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", X = `[ 	
\f\r]`, N = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, gt = /-->/g, ft = />/g, $ = RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), vt = /'/g, bt = /"/g, Et = /^(?:script|style|textarea|title)$/i, Bt = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), d = Bt(1), x = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), yt = /* @__PURE__ */ new WeakMap(), S = E.createTreeWalker(E, 129, null, !1), Vt = (s, t) => {
  const e = s.length - 1, o = [];
  let r, i = t === 2 ? "<svg>" : "", n = N;
  for (let a = 0; a < e; a++) {
    const l = s[a];
    let f, h, u = -1, m = 0;
    for (; m < l.length && (n.lastIndex = m, h = n.exec(l), h !== null); )
      m = n.lastIndex, n === N ? h[1] === "!--" ? n = gt : h[1] !== void 0 ? n = ft : h[2] !== void 0 ? (Et.test(h[2]) && (r = RegExp("</" + h[2], "g")), n = $) : h[3] !== void 0 && (n = $) : n === $ ? h[0] === ">" ? (n = r ?? N, u = -1) : h[1] === void 0 ? u = -2 : (u = n.lastIndex - h[2].length, f = h[1], n = h[3] === void 0 ? $ : h[3] === '"' ? bt : vt) : n === bt || n === vt ? n = $ : n === gt || n === ft ? n = N : (n = $, r = void 0);
    const q = n === $ && s[a + 1].startsWith("/>") ? " " : "";
    i += n === N ? l + It : u >= 0 ? (o.push(f), l.slice(0, u) + it + l.slice(u) + y + q) : l + y + (u === -2 ? (o.push(void 0), a) : q);
  }
  const p = i + (s[e] || "<?>") + (t === 2 ? "</svg>" : "");
  if (!Array.isArray(s) || !s.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return [wt !== void 0 ? wt.createHTML(p) : p, o];
};
class H {
  constructor({ strings: t, _$litType$: e }, o) {
    let r;
    this.parts = [];
    let i = 0, n = 0;
    const p = t.length - 1, a = this.parts, [l, f] = Vt(t, e);
    if (this.el = H.createElement(l, o), S.currentNode = this.el.content, e === 2) {
      const h = this.el.content, u = h.firstChild;
      u.remove(), h.append(...u.childNodes);
    }
    for (; (r = S.nextNode()) !== null && a.length < p; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) {
          const h = [];
          for (const u of r.getAttributeNames())
            if (u.endsWith(it) || u.startsWith(y)) {
              const m = f[n++];
              if (h.push(u), m !== void 0) {
                const q = r.getAttribute(m.toLowerCase() + it).split(y), D = /([.?@])?(.*)/.exec(m);
                a.push({ type: 1, index: i, name: D[2], strings: q, ctor: D[1] === "." ? Ft : D[1] === "?" ? Yt : D[1] === "@" ? Wt : Q });
              } else
                a.push({ type: 6, index: i });
            }
          for (const u of h)
            r.removeAttribute(u);
        }
        if (Et.test(r.tagName)) {
          const h = r.textContent.split(y), u = h.length - 1;
          if (u > 0) {
            r.textContent = C ? C.emptyScript : "";
            for (let m = 0; m < u; m++)
              r.append(h[m], M()), S.nextNode(), a.push({ type: 2, index: ++i });
            r.append(h[u], M());
          }
        }
      } else if (r.nodeType === 8)
        if (r.data === St)
          a.push({ type: 2, index: i });
        else {
          let h = -1;
          for (; (h = r.data.indexOf(y, h + 1)) !== -1; )
            a.push({ type: 7, index: i }), h += y.length - 1;
        }
      i++;
    }
  }
  static createElement(t, e) {
    const o = E.createElement("template");
    return o.innerHTML = t, o;
  }
}
function P(s, t, e = s, o) {
  var r, i, n, p;
  if (t === x)
    return t;
  let a = o !== void 0 ? (r = e._$Co) === null || r === void 0 ? void 0 : r[o] : e._$Cl;
  const l = R(t) ? void 0 : t._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== l && ((i = a == null ? void 0 : a._$AO) === null || i === void 0 || i.call(a, !1), l === void 0 ? a = void 0 : (a = new l(s), a._$AT(s, e, o)), o !== void 0 ? ((n = (p = e)._$Co) !== null && n !== void 0 ? n : p._$Co = [])[o] = a : e._$Cl = a), a !== void 0 && (t = P(s, a._$AS(s, t.values), a, o)), t;
}
class Gt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    var e;
    const { el: { content: o }, parts: r } = this._$AD, i = ((e = t == null ? void 0 : t.creationScope) !== null && e !== void 0 ? e : E).importNode(o, !0);
    S.currentNode = i;
    let n = S.nextNode(), p = 0, a = 0, l = r[0];
    for (; l !== void 0; ) {
      if (p === l.index) {
        let f;
        l.type === 2 ? f = new U(n, n.nextSibling, this, t) : l.type === 1 ? f = new l.ctor(n, l.name, l.strings, this, t) : l.type === 6 && (f = new Zt(n, this, t)), this._$AV.push(f), l = r[++a];
      }
      p !== (l == null ? void 0 : l.index) && (n = S.nextNode(), p++);
    }
    return i;
  }
  v(t) {
    let e = 0;
    for (const o of this._$AV)
      o !== void 0 && (o.strings !== void 0 ? (o._$AI(t, o, e), e += o.strings.length - 2) : o._$AI(t[e])), e++;
  }
}
class U {
  constructor(t, e, o, r) {
    var i;
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = o, this.options = r, this._$Cp = (i = r == null ? void 0 : r.isConnected) === null || i === void 0 || i;
  }
  get _$AU() {
    var t, e;
    return (e = (t = this._$AM) === null || t === void 0 ? void 0 : t._$AU) !== null && e !== void 0 ? e : this._$Cp;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = P(this, t, e), R(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== x && this._(t) : t._$litType$ !== void 0 ? this.g(t) : t.nodeType !== void 0 ? this.$(t) : Lt(t) ? this.T(t) : this._(t);
  }
  k(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  $(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.k(t));
  }
  _(t) {
    this._$AH !== c && R(this._$AH) ? this._$AA.nextSibling.data = t : this.$(E.createTextNode(t)), this._$AH = t;
  }
  g(t) {
    var e;
    const { values: o, _$litType$: r } = t, i = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = H.createElement(r.h, this.options)), r);
    if (((e = this._$AH) === null || e === void 0 ? void 0 : e._$AD) === i)
      this._$AH.v(o);
    else {
      const n = new Gt(i, this), p = n.u(this.options);
      n.v(o), this.$(p), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = yt.get(t.strings);
    return e === void 0 && yt.set(t.strings, e = new H(t)), e;
  }
  T(t) {
    Ct(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let o, r = 0;
    for (const i of t)
      r === e.length ? e.push(o = new U(this.k(M()), this.k(M()), this, this.options)) : o = e[r], o._$AI(i), r++;
    r < e.length && (this._$AR(o && o._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var o;
    for ((o = this._$AP) === null || o === void 0 || o.call(this, !1, !0, e); t && t !== this._$AB; ) {
      const r = t.nextSibling;
      t.remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cp = t, (e = this._$AP) === null || e === void 0 || e.call(this, t));
  }
}
class Q {
  constructor(t, e, o, r, i) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = i, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = c;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t, e = this, o, r) {
    const i = this.strings;
    let n = !1;
    if (i === void 0)
      t = P(this, t, e, 0), n = !R(t) || t !== this._$AH && t !== x, n && (this._$AH = t);
    else {
      const p = t;
      let a, l;
      for (t = i[0], a = 0; a < i.length - 1; a++)
        l = P(this, p[o + a], e, a), l === x && (l = this._$AH[a]), n || (n = !R(l) || l !== this._$AH[a]), l === c ? t = c : t !== c && (t += (l ?? "") + i[a + 1]), this._$AH[a] = l;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ft extends Q {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
const Qt = C ? C.emptyScript : "";
class Yt extends Q {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    t && t !== c ? this.element.setAttribute(this.name, Qt) : this.element.removeAttribute(this.name);
  }
}
class Wt extends Q {
  constructor(t, e, o, r, i) {
    super(t, e, o, r, i), this.type = 5;
  }
  _$AI(t, e = this) {
    var o;
    if ((t = (o = P(this, t, e, 0)) !== null && o !== void 0 ? o : c) === x)
      return;
    const r = this._$AH, i = t === c && r !== c || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, n = t !== c && (r === c || i);
    i && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e, o;
    typeof this._$AH == "function" ? this._$AH.call((o = (e = this.options) === null || e === void 0 ? void 0 : e.host) !== null && o !== void 0 ? o : this.element, t) : this._$AH.handleEvent(t);
  }
}
class Zt {
  constructor(t, e, o) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    P(this, t);
  }
}
const _t = B.litHtmlPolyfillSupport;
_t == null || _t(H, U), ((J = B.litHtmlVersions) !== null && J !== void 0 ? J : B.litHtmlVersions = []).push("2.7.3");
const Jt = (s, t, e) => {
  var o, r;
  const i = (o = e == null ? void 0 : e.renderBefore) !== null && o !== void 0 ? o : t;
  let n = i._$litPart$;
  if (n === void 0) {
    const p = (r = e == null ? void 0 : e.renderBefore) !== null && r !== void 0 ? r : null;
    i._$litPart$ = n = new U(t.insertBefore(M(), p), p, void 0, e ?? {});
  }
  return n._$AI(s), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var K, tt;
let g = class extends A {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t, e;
    const o = super.createRenderRoot();
    return (t = (e = this.renderOptions).renderBefore) !== null && t !== void 0 || (e.renderBefore = o.firstChild), o;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Jt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) === null || t === void 0 || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) === null || t === void 0 || t.setConnected(!1);
  }
  render() {
    return x;
  }
};
g.finalized = !0, g._$litElement$ = !0, (K = globalThis.litElementHydrateSupport) === null || K === void 0 || K.call(globalThis, { LitElement: g });
const $t = globalThis.litElementPolyfillSupport;
$t == null || $t({ LitElement: g });
((tt = globalThis.litElementVersions) !== null && tt !== void 0 ? tt : globalThis.litElementVersions = []).push("3.3.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = (s) => (t) => typeof t == "function" ? ((e, o) => (customElements.define(e, o), o))(s, t) : ((e, o) => {
  const { kind: r, elements: i } = o;
  return { kind: r, elements: i, finisher(n) {
    customElements.define(e, n);
  } };
})(s, t);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Xt = (s, t) => t.kind === "method" && t.descriptor && !("value" in t.descriptor) ? { ...t, finisher(e) {
  e.createProperty(t.key, s);
} } : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: t.key, initializer() {
  typeof t.initializer == "function" && (this[t.key] = t.initializer.call(this));
}, finisher(e) {
  e.createProperty(t.key, s);
} };
function _(s) {
  return (t, e) => e !== void 0 ? ((o, r, i) => {
    r.constructor.createProperty(i, o);
  })(s, t, e) : Xt(s, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function k(s) {
  return _({ ...s, state: !0 });
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var et;
((et = window.HTMLSlotElement) === null || et === void 0 ? void 0 : et.prototype.assignedElements) != null;
var Kt = Object.defineProperty, te = Object.getOwnPropertyDescriptor, Pt = (s, t, e, o) => {
  for (var r = o > 1 ? void 0 : o ? te(t, e) : t, i = s.length - 1, n; i >= 0; i--)
    (n = s[i]) && (r = (o ? n(t, e, r) : n(r)) || r);
  return o && r && Kt(t, e, r), r;
};
let nt = class extends g {
  constructor() {
    super(...arguments), this.duration = 0, this._relativeTimeFormatter = new Intl.RelativeTimeFormat(void 0, {
      style: "long"
    });
  }
  render() {
    return d` ${this.formatDuration(this.duration)} `;
  }
  formatDuration(s) {
    if (s === 0)
      return "session";
    let t;
    return s % 365 === 0 ? t = this._relativeTimeFormatter.formatToParts(s / 365, "year") : s % 30 === 0 ? t = this._relativeTimeFormatter.formatToParts(s / 30, "month") : t = this._relativeTimeFormatter.formatToParts(s, "day"), `${t[1].value} ${t[2].value}`;
  }
};
Pt([
  _({ type: Number })
], nt.prototype, "duration", 2);
nt = Pt([
  z("cookie-solution-duration")
], nt);
function Tt(s) {
  var t, e, o = "";
  if (typeof s == "string" || typeof s == "number")
    o += s;
  else if (typeof s == "object")
    if (Array.isArray(s))
      for (t = 0; t < s.length; t++)
        s[t] && (e = Tt(s[t])) && (o && (o += " "), o += e);
    else
      for (t in s)
        s[t] && (o && (o += " "), o += t);
  return o;
}
function v() {
  for (var s, t, e = 0, o = ""; e < arguments.length; )
    (s = arguments[e++]) && (t = Tt(s)) && (o && (o += " "), o += t);
  return o;
}
const ee = '*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.prose{color:var(--tw-prose-body);max-width:100%}.prose :where(p):not(:where([class~="not-prose"] *)){margin-top:1.25em;margin-bottom:1.25em}.prose :where([class~="lead"]):not(:where([class~="not-prose"] *)){color:var(--tw-prose-lead);font-size:1.25em;line-height:1.6;margin-top:1.2em;margin-bottom:1.2em}.prose :where(a):not(:where([class~="not-prose"] *)){color:var(--tw-prose-links);text-decoration:underline;font-weight:500}.prose :where(strong):not(:where([class~="not-prose"] *)){color:var(--tw-prose-bold);font-weight:600}.prose :where(a strong):not(:where([class~="not-prose"] *)){color:inherit}.prose :where(blockquote strong):not(:where([class~="not-prose"] *)){color:inherit}.prose :where(thead th strong):not(:where([class~="not-prose"] *)){color:inherit}.prose :where(ol):not(:where([class~="not-prose"] *)){list-style-type:decimal;margin-top:1.25em;margin-bottom:1.25em;padding-left:1.625em}.prose :where(ol[type="A"]):not(:where([class~="not-prose"] *)){list-style-type:upper-alpha}.prose :where(ol[type="a"]):not(:where([class~="not-prose"] *)){list-style-type:lower-alpha}.prose :where(ol[type="A" s]):not(:where([class~="not-prose"] *)){list-style-type:upper-alpha}.prose :where(ol[type="a" s]):not(:where([class~="not-prose"] *)){list-style-type:lower-alpha}.prose :where(ol[type="I"]):not(:where([class~="not-prose"] *)){list-style-type:upper-roman}.prose :where(ol[type="i"]):not(:where([class~="not-prose"] *)){list-style-type:lower-roman}.prose :where(ol[type="I" s]):not(:where([class~="not-prose"] *)){list-style-type:upper-roman}.prose :where(ol[type="i" s]):not(:where([class~="not-prose"] *)){list-style-type:lower-roman}.prose :where(ol[type="1"]):not(:where([class~="not-prose"] *)){list-style-type:decimal}.prose :where(ul):not(:where([class~="not-prose"] *)){list-style-type:disc;margin-top:1.25em;margin-bottom:1.25em;padding-left:1.625em}.prose :where(ol > li):not(:where([class~="not-prose"] *))::marker{font-weight:400;color:var(--tw-prose-counters)}.prose :where(ul > li):not(:where([class~="not-prose"] *))::marker{color:var(--tw-prose-bullets)}.prose :where(hr):not(:where([class~="not-prose"] *)){border-color:var(--tw-prose-hr);border-top-width:1px;margin-top:3em;margin-bottom:3em}.prose :where(blockquote):not(:where([class~="not-prose"] *)){font-weight:500;font-style:italic;color:var(--tw-prose-quotes);border-left-width:.25rem;border-left-color:var(--tw-prose-quote-borders);quotes:"“""”""‘""’";margin-top:1.6em;margin-bottom:1.6em;padding-left:1em}.prose :where(blockquote p:first-of-type):not(:where([class~="not-prose"] *)):before{content:open-quote}.prose :where(blockquote p:last-of-type):not(:where([class~="not-prose"] *)):after{content:close-quote}.prose :where(h1):not(:where([class~="not-prose"] *)){color:var(--tw-prose-headings);font-weight:800;font-size:2.25em;margin-top:0;margin-bottom:.8888889em;line-height:1.1111111}.prose :where(h1 strong):not(:where([class~="not-prose"] *)){font-weight:900;color:inherit}.prose :where(h2):not(:where([class~="not-prose"] *)){color:var(--tw-prose-headings);font-weight:700;font-size:1.5em;margin-top:2em;margin-bottom:1em;line-height:1.3333333}.prose :where(h2 strong):not(:where([class~="not-prose"] *)){font-weight:800;color:inherit}.prose :where(h3):not(:where([class~="not-prose"] *)){color:var(--tw-prose-headings);font-weight:600;font-size:1.25em;margin-top:1.6em;margin-bottom:.6em;line-height:1.6}.prose :where(h3 strong):not(:where([class~="not-prose"] *)){font-weight:700;color:inherit}.prose :where(h4):not(:where([class~="not-prose"] *)){color:var(--tw-prose-headings);font-weight:600;margin-top:1.5em;margin-bottom:.5em;line-height:1.5}.prose :where(h4 strong):not(:where([class~="not-prose"] *)){font-weight:700;color:inherit}.prose :where(img):not(:where([class~="not-prose"] *)){margin-top:2em;margin-bottom:2em}.prose :where(figure > *):not(:where([class~="not-prose"] *)){margin-top:0;margin-bottom:0}.prose :where(figcaption):not(:where([class~="not-prose"] *)){color:var(--tw-prose-captions);font-size:.875em;line-height:1.4285714;margin-top:.8571429em}.prose :where(code):not(:where([class~="not-prose"] *)){color:var(--tw-prose-code);font-weight:600;font-size:.875em}.prose :where(code):not(:where([class~="not-prose"] *)):before{content:"`"}.prose :where(code):not(:where([class~="not-prose"] *)):after{content:"`"}.prose :where(a code):not(:where([class~="not-prose"] *)){color:inherit}.prose :where(h1 code):not(:where([class~="not-prose"] *)){color:inherit}.prose :where(h2 code):not(:where([class~="not-prose"] *)){color:inherit;font-size:.875em}.prose :where(h3 code):not(:where([class~="not-prose"] *)){color:inherit;font-size:.9em}.prose :where(h4 code):not(:where([class~="not-prose"] *)){color:inherit}.prose :where(blockquote code):not(:where([class~="not-prose"] *)){color:inherit}.prose :where(thead th code):not(:where([class~="not-prose"] *)){color:inherit}.prose :where(pre):not(:where([class~="not-prose"] *)){color:var(--tw-prose-pre-code);background-color:var(--tw-prose-pre-bg);overflow-x:auto;font-weight:400;font-size:.875em;line-height:1.7142857;margin-top:1.7142857em;margin-bottom:1.7142857em;border-radius:.375rem;padding:.8571429em 1.1428571em}.prose :where(pre code):not(:where([class~="not-prose"] *)){background-color:transparent;border-width:0;border-radius:0;padding:0;font-weight:inherit;color:inherit;font-size:inherit;font-family:inherit;line-height:inherit}.prose :where(pre code):not(:where([class~="not-prose"] *)):before{content:none}.prose :where(pre code):not(:where([class~="not-prose"] *)):after{content:none}.prose :where(table):not(:where([class~="not-prose"] *)){width:100%;table-layout:auto;text-align:left;margin-top:2em;margin-bottom:2em;font-size:.875em;line-height:1.7142857}.prose :where(thead):not(:where([class~="not-prose"] *)){border-bottom-width:1px;border-bottom-color:var(--tw-prose-th-borders)}.prose :where(thead th):not(:where([class~="not-prose"] *)){color:var(--tw-prose-headings);font-weight:600;vertical-align:bottom;padding-right:.5714286em;padding-bottom:.5714286em;padding-left:.5714286em}.prose :where(tbody tr):not(:where([class~="not-prose"] *)){border-bottom-width:1px;border-bottom-color:var(--tw-prose-td-borders)}.prose :where(tbody tr:last-child):not(:where([class~="not-prose"] *)){border-bottom-width:0}.prose :where(tbody td):not(:where([class~="not-prose"] *)){vertical-align:baseline}.prose :where(tfoot):not(:where([class~="not-prose"] *)){border-top-width:1px;border-top-color:var(--tw-prose-th-borders)}.prose :where(tfoot td):not(:where([class~="not-prose"] *)){vertical-align:top}.prose{--tw-prose-body: #374151;--tw-prose-headings: #111827;--tw-prose-lead: #4b5563;--tw-prose-links: #111827;--tw-prose-bold: #111827;--tw-prose-counters: #6b7280;--tw-prose-bullets: #d1d5db;--tw-prose-hr: #e5e7eb;--tw-prose-quotes: #111827;--tw-prose-quote-borders: #e5e7eb;--tw-prose-captions: #6b7280;--tw-prose-code: #111827;--tw-prose-pre-code: #e5e7eb;--tw-prose-pre-bg: #1f2937;--tw-prose-th-borders: #d1d5db;--tw-prose-td-borders: #e5e7eb;--tw-prose-invert-body: #d1d5db;--tw-prose-invert-headings: #fff;--tw-prose-invert-lead: #9ca3af;--tw-prose-invert-links: #fff;--tw-prose-invert-bold: #fff;--tw-prose-invert-counters: #9ca3af;--tw-prose-invert-bullets: #4b5563;--tw-prose-invert-hr: #374151;--tw-prose-invert-quotes: #f3f4f6;--tw-prose-invert-quote-borders: #374151;--tw-prose-invert-captions: #9ca3af;--tw-prose-invert-code: #fff;--tw-prose-invert-pre-code: #d1d5db;--tw-prose-invert-pre-bg: rgb(0 0 0 / 50%);--tw-prose-invert-th-borders: #4b5563;--tw-prose-invert-td-borders: #374151;font-size:1rem;line-height:1.75}.prose :where(video):not(:where([class~="not-prose"] *)){margin-top:2em;margin-bottom:2em}.prose :where(figure):not(:where([class~="not-prose"] *)){margin-top:2em;margin-bottom:2em}.prose :where(li):not(:where([class~="not-prose"] *)){margin-top:.5em;margin-bottom:.5em}.prose :where(ol > li):not(:where([class~="not-prose"] *)){padding-left:.375em}.prose :where(ul > li):not(:where([class~="not-prose"] *)){padding-left:.375em}.prose :where(.prose > ul > li p):not(:where([class~="not-prose"] *)){margin-top:.75em;margin-bottom:.75em}.prose :where(.prose > ul > li > *:first-child):not(:where([class~="not-prose"] *)){margin-top:1.25em}.prose :where(.prose > ul > li > *:last-child):not(:where([class~="not-prose"] *)){margin-bottom:1.25em}.prose :where(.prose > ol > li > *:first-child):not(:where([class~="not-prose"] *)){margin-top:1.25em}.prose :where(.prose > ol > li > *:last-child):not(:where([class~="not-prose"] *)){margin-bottom:1.25em}.prose :where(ul ul,ul ol,ol ul,ol ol):not(:where([class~="not-prose"] *)){margin-top:.75em;margin-bottom:.75em}.prose :where(hr + *):not(:where([class~="not-prose"] *)){margin-top:0}.prose :where(h2 + *):not(:where([class~="not-prose"] *)){margin-top:0}.prose :where(h3 + *):not(:where([class~="not-prose"] *)){margin-top:0}.prose :where(h4 + *):not(:where([class~="not-prose"] *)){margin-top:0}.prose :where(thead th:first-child):not(:where([class~="not-prose"] *)){padding-left:0}.prose :where(thead th:last-child):not(:where([class~="not-prose"] *)){padding-right:0}.prose :where(tbody td,tfoot td):not(:where([class~="not-prose"] *)){padding:.5714286em}.prose :where(tbody td:first-child,tfoot td:first-child):not(:where([class~="not-prose"] *)){padding-left:0}.prose :where(tbody td:last-child,tfoot td:last-child):not(:where([class~="not-prose"] *)){padding-right:0}.prose :where(.prose > :first-child):not(:where([class~="not-prose"] *)){margin-top:0}.prose :where(.prose > :last-child):not(:where([class~="not-prose"] *)){margin-bottom:0}.prose-sm{font-size:.875rem;line-height:1.7142857}.prose-sm :where(p):not(:where([class~="not-prose"] *)){margin-top:1.1428571em;margin-bottom:1.1428571em}.prose-sm :where([class~="lead"]):not(:where([class~="not-prose"] *)){font-size:1.2857143em;line-height:1.5555556;margin-top:.8888889em;margin-bottom:.8888889em}.prose-sm :where(blockquote):not(:where([class~="not-prose"] *)){margin-top:1.3333333em;margin-bottom:1.3333333em;padding-left:1.1111111em}.prose-sm :where(h1):not(:where([class~="not-prose"] *)){font-size:2.1428571em;margin-top:0;margin-bottom:.8em;line-height:1.2}.prose-sm :where(h2):not(:where([class~="not-prose"] *)){font-size:1.4285714em;margin-top:1.6em;margin-bottom:.8em;line-height:1.4}.prose-sm :where(h3):not(:where([class~="not-prose"] *)){font-size:1.1em;margin-top:1.5555556em;margin-bottom:.4444444em;line-height:1.5555556}.prose-sm :where(h4):not(:where([class~="not-prose"] *)){margin-top:1.4285714em;margin-bottom:.5714286em;line-height:1.4285714}.prose-sm :where(img):not(:where([class~="not-prose"] *)){margin-top:1.7142857em;margin-bottom:1.7142857em}.prose-sm :where(video):not(:where([class~="not-prose"] *)){margin-top:1.7142857em;margin-bottom:1.7142857em}.prose-sm :where(figure):not(:where([class~="not-prose"] *)){margin-top:1.7142857em;margin-bottom:1.7142857em}.prose-sm :where(figure > *):not(:where([class~="not-prose"] *)){margin-top:0;margin-bottom:0}.prose-sm :where(figcaption):not(:where([class~="not-prose"] *)){font-size:.8571429em;line-height:1.3333333;margin-top:.6666667em}.prose-sm :where(code):not(:where([class~="not-prose"] *)){font-size:.8571429em}.prose-sm :where(h2 code):not(:where([class~="not-prose"] *)){font-size:.9em}.prose-sm :where(h3 code):not(:where([class~="not-prose"] *)){font-size:.8888889em}.prose-sm :where(pre):not(:where([class~="not-prose"] *)){font-size:.8571429em;line-height:1.6666667;margin-top:1.6666667em;margin-bottom:1.6666667em;border-radius:.25rem;padding:.6666667em 1em}.prose-sm :where(ol):not(:where([class~="not-prose"] *)){margin-top:1.1428571em;margin-bottom:1.1428571em;padding-left:1.5714286em}.prose-sm :where(ul):not(:where([class~="not-prose"] *)){margin-top:1.1428571em;margin-bottom:1.1428571em;padding-left:1.5714286em}.prose-sm :where(li):not(:where([class~="not-prose"] *)){margin-top:.2857143em;margin-bottom:.2857143em}.prose-sm :where(ol > li):not(:where([class~="not-prose"] *)){padding-left:.4285714em}.prose-sm :where(ul > li):not(:where([class~="not-prose"] *)){padding-left:.4285714em}.prose-sm :where(.prose-sm > ul > li p):not(:where([class~="not-prose"] *)){margin-top:.5714286em;margin-bottom:.5714286em}.prose-sm :where(.prose-sm > ul > li > *:first-child):not(:where([class~="not-prose"] *)){margin-top:1.1428571em}.prose-sm :where(.prose-sm > ul > li > *:last-child):not(:where([class~="not-prose"] *)){margin-bottom:1.1428571em}.prose-sm :where(.prose-sm > ol > li > *:first-child):not(:where([class~="not-prose"] *)){margin-top:1.1428571em}.prose-sm :where(.prose-sm > ol > li > *:last-child):not(:where([class~="not-prose"] *)){margin-bottom:1.1428571em}.prose-sm :where(ul ul,ul ol,ol ul,ol ol):not(:where([class~="not-prose"] *)){margin-top:.5714286em;margin-bottom:.5714286em}.prose-sm :where(hr):not(:where([class~="not-prose"] *)){margin-top:2.8571429em;margin-bottom:2.8571429em}.prose-sm :where(hr + *):not(:where([class~="not-prose"] *)){margin-top:0}.prose-sm :where(h2 + *):not(:where([class~="not-prose"] *)){margin-top:0}.prose-sm :where(h3 + *):not(:where([class~="not-prose"] *)){margin-top:0}.prose-sm :where(h4 + *):not(:where([class~="not-prose"] *)){margin-top:0}.prose-sm :where(table):not(:where([class~="not-prose"] *)){font-size:.8571429em;line-height:1.5}.prose-sm :where(thead th):not(:where([class~="not-prose"] *)){padding-right:1em;padding-bottom:.6666667em;padding-left:1em}.prose-sm :where(thead th:first-child):not(:where([class~="not-prose"] *)){padding-left:0}.prose-sm :where(thead th:last-child):not(:where([class~="not-prose"] *)){padding-right:0}.prose-sm :where(tbody td,tfoot td):not(:where([class~="not-prose"] *)){padding:.6666667em 1em}.prose-sm :where(tbody td:first-child,tfoot td:first-child):not(:where([class~="not-prose"] *)){padding-left:0}.prose-sm :where(tbody td:last-child,tfoot td:last-child):not(:where([class~="not-prose"] *)){padding-right:0}.prose-sm :where(.prose-sm > :first-child):not(:where([class~="not-prose"] *)){margin-top:0}.prose-sm :where(.prose-sm > :last-child):not(:where([class~="not-prose"] *)){margin-bottom:0}.visible{visibility:visible}.static{position:static}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.inset-0{inset:0px}.-bottom-\\[1px\\]{bottom:-1px}.bottom-toggle-bottom{bottom:var(--cs--toggle-position-bottom, 1rem)}.left-1\\/2{left:50%}.left-toggle-x{left:var(--cs--toggle-position-x, 1rem)}.right-toggle-x{right:var(--cs--toggle-position-x, 1rem)}.top-1\\/2{top:50%}.z-max{z-index:999999}.col-span-2{grid-column:span 2 / span 2}.mb-4{margin-bottom:1rem}.mb-8{margin-bottom:2rem}.mr-4{margin-right:1rem}.mt-2{margin-top:.5rem}.mt-4{margin-top:1rem}.mt-8{margin-top:2rem}.block{display:block}.inline{display:inline}.flex{display:flex}.grid{display:grid}.hidden{display:none}.h-10{height:2.5rem}.h-12{height:3rem}.h-14{height:3.5rem}.h-5{height:1.25rem}.h-6{height:1.5rem}.h-full{height:100%}.max-h-\\[90vh\\]{max-height:90vh}.w-11{width:2.75rem}.w-12{width:3rem}.w-5{width:1.25rem}.w-6{width:1.5rem}.w-full{width:100%}.max-w-\\[900px\\]{max-width:900px}.flex-1{flex:1 1 0%}.shrink-0{flex-shrink:0}.-translate-x-1\\/2{--tw-translate-x: -50%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.-translate-y-1\\/2{--tw-translate-y: -50%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-x-5{--tw-translate-x: 1.25rem;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.scale-75{--tw-scale-x: .75;--tw-scale-y: .75;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-2{gap:.5rem}.gap-8{gap:2rem}.space-y-8>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(2rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(2rem * var(--tw-space-y-reverse))}.divide-y>:not([hidden])~:not([hidden]){--tw-divide-y-reverse: 0;border-top-width:calc(1px * calc(1 - var(--tw-divide-y-reverse)));border-bottom-width:calc(1px * var(--tw-divide-y-reverse))}.divide-gray-100>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(243 244 246 / var(--tw-divide-opacity))}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.border-2{border-width:2px}.border-b{border-bottom-width:1px}.border-l-4{border-left-width:4px}.border-t{border-top-width:1px}.border-t-4{border-top-width:4px}.border-gray-200{--tw-border-opacity: 1;border-color:rgb(229 231 235 / var(--tw-border-opacity))}.border-gray-300{--tw-border-opacity: 1;border-color:rgb(209 213 219 / var(--tw-border-opacity))}.border-highlight{border-color:var(--cs--color-highlight, #ea580c)}.bg-gray-100{--tw-bg-opacity: 1;background-color:rgb(243 244 246 / var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity: 1;background-color:rgb(229 231 235 / var(--tw-bg-opacity))}.bg-gray-400{--tw-bg-opacity: 1;background-color:rgb(156 163 175 / var(--tw-bg-opacity))}.bg-gray-900\\/30{background-color:#1118274d}.bg-highlight{background-color:var(--cs--color-highlight, #ea580c)}.bg-white{--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.fill-current{fill:currentColor}.fill-highlight{fill:var(--cs--color-highlight, #ea580c)}.p-2{padding:.5rem}.p-4{padding:1rem}.px-0{padding-left:0;padding-right:0}.px-0\\.5{padding-left:.125rem;padding-right:.125rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xs{font-size:.75rem;line-height:1rem}.font-bold{font-weight:700}.font-medium{font-weight:500}.italic{font-style:italic}.text-gray-700{--tw-text-opacity: 1;color:rgb(55 65 81 / var(--tw-text-opacity))}.text-gray-800{--tw-text-opacity: 1;color:rgb(31 41 55 / var(--tw-text-opacity))}.text-gray-900{--tw-text-opacity: 1;color:rgb(17 24 39 / var(--tw-text-opacity))}.text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.underline{text-decoration-line:underline}.opacity-0{opacity:0}.opacity-50{opacity:.5}.shadow{--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.duration-300{transition-duration:.3s}.duration-500{transition-duration:.5s}.hover\\:bg-gray-100:hover{--tw-bg-opacity: 1;background-color:rgb(243 244 246 / var(--tw-bg-opacity))}.hover\\:opacity-90:hover{opacity:.9}.hover\\:shadow-xl:hover{--tw-shadow: 0 20px 25px -5px rgb(0 0 0 / .1), 0 8px 10px -6px rgb(0 0 0 / .1);--tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.focus\\:shadow:focus{--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.aria-selected\\:text-highlight[aria-selected=true]{color:var(--cs--color-highlight, #ea580c)}@media (min-width: 640px){.sm\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.sm\\:justify-start{justify-content:flex-start}}@media (min-width: 768px){.md\\:ml-10{margin-left:2.5rem}.md\\:mr-16{margin-right:4rem}.md\\:mr-4{margin-right:1rem}.md\\:inline{display:inline}.md\\:flex{display:flex}.md\\:h-12{height:3rem}.md\\:w-6{width:1.5rem}.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.md\\:pl-10{padding-left:2.5rem}.md\\:pr-20{padding-right:5rem}.md\\:text-sm{font-size:.875rem;line-height:1.25rem}}\n', j = jt`
    ${kt(ee)}
`;
var oe = Object.defineProperty, se = Object.getOwnPropertyDescriptor, zt = (s, t, e, o) => {
  for (var r = o > 1 ? void 0 : o ? se(t, e) : t, i = s.length - 1, n; i >= 0; i--)
    (n = s[i]) && (r = (o ? n(t, e, r) : n(r)) || r);
  return o && r && oe(t, e, r), r;
};
let V = class extends g {
  constructor() {
    super(...arguments), this.position = "right";
  }
  _open() {
    this.dispatchEvent(
      new CustomEvent("open", {
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    return d`
            <div
                class="${v(
      "fixed bottom-toggle-bottom z-max",
      this.position === "left" ? "left-toggle-x" : "right-toggle-x"
    )}"
            >
                <button
                    class="flex h-12 w-12 items-center justify-center rounded-full bg-white p-2 shadow hover:shadow-xl"
                    @click="${this._open}"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full fill-highlight" viewBox="0 0 48 48">
                        <path
                            d="M21 20.1q1.3 0 2.2-.9.9-.9.9-2.2 0-1.3-.9-2.2-.9-.9-2.2-.9-1.3 0-2.2.9-.9.9-.9 2.2 0 1.3.9 2.2.9.9 2.2.9Zm-4 10q1.3 0 2.2-.9.9-.9.9-2.2 0-1.3-.9-2.2-.9-.9-2.2-.9-1.3 0-2.2.9-.9.9-.9 2.2 0 1.3.9 2.2.9.9 2.2.9ZM30 32q.85 0 1.425-.575Q32 30.85 32 30q0-.85-.575-1.425Q30.85 28 30 28q-.85 0-1.425.575Q28 29.15 28 30q0 .85.575 1.425Q29.15 32 30 32Zm-6 12q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.6 1.95-8.6t5.225-6.775q3.275-2.775 7.55-4T27.6 4.3q-.3 2.25.4 4.25t2.125 3.4q1.425 1.4 3.425 2.05 2 .65 4.2.3-1 3.05 1.1 5.475t5.1 2.675q.4 4.35-1.025 8.25-1.425 3.9-4.175 6.85-2.75 2.95-6.55 4.7T24 44Zm0-3q7.1 0 11.8-4.675 4.7-4.675 5.25-11.525-2.7-1-4.375-2.975Q35 19.85 34.6 17.3q-4.05-.55-6.825-3.5Q25 10.85 24.6 6.95q-3.7-.15-6.925 1.2-3.225 1.35-5.6 3.7Q9.7 14.2 8.35 17.375 7 20.55 7 24q0 7.1 4.95 12.05Q16.9 41 24 41Zm.05-17.25Z"
                        />
                    </svg>
                </button>
            </div>
        `;
  }
};
V.styles = [j];
zt([
  _({ type: String })
], V.prototype, "position", 2);
V = zt([
  z("cookie-solution-toggle")
], V);
var re = Object.defineProperty, ie = Object.getOwnPropertyDescriptor, Y = (s, t, e, o) => {
  for (var r = o > 1 ? void 0 : o ? ie(t, e) : t, i = s.length - 1, n; i >= 0; i--)
    (n = s[i]) && (r = (o ? n(t, e, r) : n(r)) || r);
  return o && r && re(t, e, r), r;
};
let T = class extends g {
  constructor() {
    super(...arguments), this.checked = !1, this.disabled = !1, this.readonly = !1;
  }
  _onClick() {
    this.disabled || this.readonly || (this.checked = !this.checked, this.dispatchEvent(
      new CustomEvent("change", {
        detail: this.checked,
        bubbles: !0,
        composed: !0
      })
    ));
  }
  render() {
    return d`
            <button
                type="button"
                role="switch"
                aria-checked="${this.checked}"
                @click="${this._onClick}"
                class="${v({
      "flex h-6 w-11 cursor-pointer items-center rounded-full px-0.5 duration-300 focus:shadow": !0,
      "opacity-50": this.readonly,
      "bg-highlight": this.checked,
      "bg-gray-200": !this.checked
    })}"
            >
                <span
                    class="${v({
      "block h-5 w-5 transform rounded-full duration-300": !0,
      "translate-x-5 bg-white": this.checked,
      "bg-gray-400": !this.checked
    })}"
                ></span>
            </button>
        `;
  }
};
T.styles = [j];
Y([
  _({ type: Boolean })
], T.prototype, "checked", 2);
Y([
  _({ type: Boolean })
], T.prototype, "disabled", 2);
Y([
  _({ type: Boolean })
], T.prototype, "readonly", 2);
T = Y([
  z("cookie-solution--switch")
], T);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ne = (s) => s.strings === void 0;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Nt = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, Ot = (s) => (...t) => ({ _$litDirective$: s, values: t });
class Mt {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, o) {
    this._$Ct = t, this._$AM = e, this._$Ci = o;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const O = (s, t) => {
  var e, o;
  const r = s._$AN;
  if (r === void 0)
    return !1;
  for (const i of r)
    (o = (e = i)._$AO) === null || o === void 0 || o.call(e, t, !1), O(i, t);
  return !0;
}, G = (s) => {
  let t, e;
  do {
    if ((t = s._$AM) === void 0)
      break;
    e = t._$AN, e.delete(s), s = t;
  } while ((e == null ? void 0 : e.size) === 0);
}, Rt = (s) => {
  for (let t; t = s._$AM; s = t) {
    let e = t._$AN;
    if (e === void 0)
      t._$AN = e = /* @__PURE__ */ new Set();
    else if (e.has(s))
      break;
    e.add(s), he(t);
  }
};
function ae(s) {
  this._$AN !== void 0 ? (G(this), this._$AM = s, Rt(this)) : this._$AM = s;
}
function le(s, t = !1, e = 0) {
  const o = this._$AH, r = this._$AN;
  if (r !== void 0 && r.size !== 0)
    if (t)
      if (Array.isArray(o))
        for (let i = e; i < o.length; i++)
          O(o[i], !1), G(o[i]);
      else
        o != null && (O(o, !1), G(o));
    else
      O(this, s);
}
const he = (s) => {
  var t, e, o, r;
  s.type == Nt.CHILD && ((t = (o = s)._$AP) !== null && t !== void 0 || (o._$AP = le), (e = (r = s)._$AQ) !== null && e !== void 0 || (r._$AQ = ae));
};
class ce extends Mt {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, e, o) {
    super._$AT(t, e, o), Rt(this), this.isConnected = t._$AU;
  }
  _$AO(t, e = !0) {
    var o, r;
    t !== this.isConnected && (this.isConnected = t, t ? (o = this.reconnected) === null || o === void 0 || o.call(this) : (r = this.disconnected) === null || r === void 0 || r.call(this)), e && (O(this, t), G(this));
  }
  setValue(t) {
    if (ne(this._$Ct))
      this._$Ct._$AI(t, this);
    else {
      const e = [...this._$Ct._$AH];
      e[this._$Ci] = t, this._$Ct._$AI(e, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const de = () => new pe();
let pe = class {
};
const ot = /* @__PURE__ */ new WeakMap(), ue = Ot(class extends ce {
  render(s) {
    return c;
  }
  update(s, [t]) {
    var e;
    const o = t !== this.G;
    return o && this.G !== void 0 && this.ot(void 0), (o || this.rt !== this.lt) && (this.G = t, this.ct = (e = s.options) === null || e === void 0 ? void 0 : e.host, this.ot(this.lt = s.element)), c;
  }
  ot(s) {
    var t;
    if (typeof this.G == "function") {
      const e = (t = this.ct) !== null && t !== void 0 ? t : globalThis;
      let o = ot.get(e);
      o === void 0 && (o = /* @__PURE__ */ new WeakMap(), ot.set(e, o)), o.get(this.G) !== void 0 && this.G.call(this.ct, void 0), o.set(this.G, s), s !== void 0 && this.G.call(this.ct, s);
    } else
      this.G.value = s;
  }
  get rt() {
    var s, t, e;
    return typeof this.G == "function" ? (t = ot.get((s = this.ct) !== null && s !== void 0 ? s : globalThis)) === null || t === void 0 ? void 0 : t.get(this.G) : (e = this.G) === null || e === void 0 ? void 0 : e.value;
  }
  disconnected() {
    this.rt === this.lt && this.ot(void 0);
  }
  reconnected() {
    this.ot(this.lt);
  }
});
var me = Object.defineProperty, we = Object.getOwnPropertyDescriptor, Ht = (s, t, e, o) => {
  for (var r = o > 1 ? void 0 : o ? we(t, e) : t, i = s.length - 1, n; i >= 0; i--)
    (n = s[i]) && (r = (o ? n(t, e, r) : n(r)) || r);
  return o && r && me(t, e, r), r;
};
let F = class extends g {
  constructor() {
    super(...arguments), this.open = !1, this.contentRef = de();
  }
  _updateContentStyle() {
    if (!this.contentRef.value)
      return;
    this.contentRef.value.style.height = "auto";
    const s = this.contentRef.value.getBoundingClientRect().height;
    this.open ? (this.contentRef.value.style.height = "0px", requestAnimationFrame(() => {
      this.contentRef.value.style.height = `${s}px`, this.contentRef.value.addEventListener(
        "transitionend",
        () => {
          this.contentRef.value.style.height = "auto";
        },
        { once: !0 }
      );
    })) : (this.contentRef.value.style.height = `${s}px`, requestAnimationFrame(() => {
      this.contentRef.value.style.height = "0px";
    }));
  }
  _onToggleOpenEvent(s) {
    s.stopPropagation(), this.open = !this.open, this._updateContentStyle();
  }
  firstUpdated() {
    this.contentRef.value.style.height = this.open ? "auto" : "0px";
  }
  render() {
    return d`
            <div class="group" @toggle-open="${this._onToggleOpenEvent}">
                <slot></slot>
                <div class="overflow-hidden transition-all duration-500" ${ue(this.contentRef)}>
                    <slot name="content"></slot>
                </div>
            </div>
        `;
  }
};
F.styles = [j];
Ht([
  _({ type: Boolean })
], F.prototype, "open", 2);
F = Ht([
  z("cookie-solution--collapsable")
], F);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class at extends Mt {
  constructor(t) {
    if (super(t), this.et = c, t.type !== Nt.CHILD)
      throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(t) {
    if (t === c || t == null)
      return this.ft = void 0, this.et = t;
    if (t === x)
      return t;
    if (typeof t != "string")
      throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (t === this.et)
      return this.ft;
    this.et = t;
    const e = [t];
    return e.raw = e, this.ft = { _$litType$: this.constructor.resultType, strings: e, values: [] };
  }
}
at.directiveName = "unsafeHTML", at.resultType = 1;
const Ut = Ot(at);
function ge(s, t, e) {
  const o = new Date(Date.now() + e * 24 * 60 * 60 * 1e3), r = document.location.protocol === "https:";
  document.cookie = `${s}=${encodeURIComponent(
    t
  )}; expires=${o.toUTCString()}; path=/; samesite=lax; ${r ? ";secure" : ""}`;
}
function fe(s) {
  const t = document.cookie.split(";").find((o) => o.trim().startsWith(`${s}=`));
  if (!t)
    return;
  const e = t.split("=")[1];
  return decodeURIComponent(e);
}
function ve(s) {
  s = s.trim().replace("#", ""), s.length === 3 && (s = s.split("").map((i) => i + i).join(""));
  let t = parseInt(s.substring(0, 2), 16), e = parseInt(s.substring(2, 4), 16), o = parseInt(s.substring(4, 6), 16);
  return (t * 299 + e * 587 + o * 114) / 1e3 >= 128 ? "black" : "white";
}
var be = Object.defineProperty, ye = Object.getOwnPropertyDescriptor, b = (s, t, e, o) => {
  for (var r = o > 1 ? void 0 : o ? ye(t, e) : t, i = s.length - 1, n; i >= 0; i--)
    (n = s[i]) && (r = (o ? n(t, e, r) : n(r)) || r);
  return o && r && be(t, e, r), r;
};
function st() {
  return {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    purposes: {
      necessary: !0,
      preferences: !1,
      statistics: !1,
      marketing: !1
    }
  };
}
let w = class extends g {
  constructor() {
    super(...arguments), this.cookieName = "laravel_cookie_solution", this._showModal = !1, this._showModalStatus = "hidden", this._tab = 0, this._contrastColor = "white", this._status = void 0;
  }
  async connectedCallback() {
    if (super.connectedCallback(), await this._loadConfig(), this._loadStatus(), this._loadContrastColor(), !this._config) {
      console.error("CookieSolution: No configuration found.");
      return;
    }
    this._status || this.show();
  }
  async _loadConfig() {
    this._config = window._cookieSolution, this._configHash = await this._generateConfigHash();
  }
  async _generateConfigHash() {
    if (this._config && crypto.subtle != null)
      try {
        const s = new TextEncoder().encode(JSON.stringify(this._config.cookies)), t = await crypto.subtle.digest("SHA-256", s);
        return Array.from(new Uint8Array(t)).map((e) => e.toString(16).padStart(2, "0")).join("");
      } catch {
        return;
      }
  }
  _loadContrastColor() {
    const s = getComputedStyle(this).getPropertyValue("--cs--color-highlight");
    this._contrastColor = ve(s);
  }
  _loadStatus() {
    var t;
    const s = fe(this.cookieName);
    this._status = s ? JSON.parse(s) : void 0, this._configHash != null && this._configHash !== ((t = this._status) == null ? void 0 : t.digest) && (this._status = void 0), this._emitStatusChange();
  }
  _saveStatus() {
    this._status && (this._status.digest = this._configHash, ge(this.cookieName, JSON.stringify(this._status), 365), this._emitStatusChange());
  }
  _emitStatusChange() {
    var s, t, e, o, r;
    this.dispatchEvent(
      new CustomEvent("cookie-solution-status-change", {
        detail: this._status
      })
    );
    try {
      typeof gtag == "function" && gtag("consent", "update", {
        ad_storage: (s = this._status) != null && s.purposes.marketing ? "granted" : "denied",
        analytics_storage: (t = this._status) != null && t.purposes.statistics ? "granted" : "denied",
        functionality_storage: (e = this._status) != null && e.purposes.necessary ? "granted" : "denied",
        personalization_storage: (o = this._status) != null && o.purposes.preferences ? "granted" : "denied"
      });
    } catch {
    }
    try {
      typeof fbq == "function" && fbq("consent", (r = this._status) != null && r.purposes.marketing ? "grant" : "revoke");
    } catch {
    }
  }
  show() {
    this._showModal = !0, this._showModalStatus = "showing", setTimeout(() => this._showModalStatus = "visible", 1);
  }
  hide() {
    this._showModalStatus = "hiding";
    const s = this.renderRoot.querySelector('[role="dialog"]');
    s instanceof HTMLElement && s.addEventListener(
      "transitionend",
      () => {
        this._showModalStatus = "hidden", this._showModal = !1;
      },
      { once: !0 }
    ), setTimeout(() => {
      this._showModalStatus = "hidden", this._showModal = !1;
    }, 500);
  }
  _onTabSelected(s) {
    if (s.target instanceof HTMLButtonElement) {
      const t = s.target.dataset.tab;
      this._tab = Number.isNaN(t) ? this._tab : Number(t);
    }
  }
  _onAcceptAll() {
    this._status = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      purposes: {
        necessary: !0,
        preferences: this._config != null && this._config.cookies.preferences.length > 0,
        statistics: this._config != null && this._config.cookies.statistics.length > 0,
        marketing: this._config != null && this._config.cookies.marketing.length > 0
      }
    }, this._saveStatus(), this.hide();
  }
  _onAcceptSelected() {
    this._status || (this._status = st()), this._status.timestamp = (/* @__PURE__ */ new Date()).toISOString(), this._saveStatus(), this.hide();
  }
  _onRefuse() {
    this._status = st(), this._saveStatus(), this.hide();
  }
  _onPurposeChange(s, t) {
    this._status || (this._status = st()), this._status.purposes[s] = t;
  }
  render() {
    return this._config ? this._showModal ? d`
            <div class="fixed inset-0 z-max bg-gray-900/30">
                <div
                    role="dialog"
                    class="${v({
      "opacity-0 scale-75": this._showModalStatus === "showing" || this._showModalStatus === "hiding",
      "fixed top-1/2 left-1/2 z-max flex max-h-[90vh] w-full max-w-[900px] -translate-x-1/2 -translate-y-1/2 overflow-hidden p-4 duration-300": !0
    })}"
                >
                    <div class="flex w-full flex-col rounded-lg bg-white font-sans text-gray-900 shadow">
                        ${this.header()}
                        <div class="flex-1 overflow-auto p-4">
                            ${this._tab === 0 ? this.consentTab() : null}
                            ${this._tab === 1 ? this.customizeTab() : null}
                            ${this._tab === 2 ? this.informationTab() : null}
                        </div>
                        ${this.footer()}
                    </div>
                </div>
            </div>
        ` : this.modalToggle() : null;
  }
  header() {
    if (this._config)
      return d`
            <div class="grid shrink-0 grid-cols-3 border-b border-gray-200">
                <button
                    class="${v("h-14 w-full text-sm font-medium duration-300", {
        "aria-selected:text-highlight": this._contrastColor === "white"
      })}"
                    role="tab"
                    data-tab="0"
                    aria-selected="${this._tab === 0}"
                    @click="${this._onTabSelected}"
                >
                    ${this._config.texts.tab_consent}
                </button>
                <button
                    class="${v("h-14 w-full text-sm font-medium duration-300", {
        "aria-selected:text-highlight": this._contrastColor === "white"
      })}"
                    role="tab"
                    data-tab="1"
                    aria-selected="${this._tab === 1}"
                    @click="${this._onTabSelected}"
                >
                    ${this._config.texts.tab_customize}
                </button>
                <button
                    class="${v("h-14 w-full text-sm font-medium duration-300", {
        "aria-selected:text-highlight": this._contrastColor === "white"
      })}"
                    role="tab"
                    data-tab="2"
                    aria-selected="${this._tab === 2}"
                    @click="${this._onTabSelected}"
                >
                    ${this._config.texts.tab_information}
                </button>
                <div class="relative">
                    <hr
                        class="absolute -bottom-[1px] w-full transform border-t-4 border-highlight duration-300"
                        style="--tw-translate-x: ${this._tab * 100}%"
                    />
                </div>
            </div>
        `;
  }
  footer() {
    if (!this._config)
      return;
    const s = d`
            <div>
                <button
                    class="block h-10 w-full border-2 border-highlight text-sm font-medium duration-300 hover:bg-gray-100 md:h-12"
                    @click="${() => this._tab = 1}"
                >
                    ${this._config.texts.button_customize}
                </button>
            </div>
        `, t = d`
            <div>
                <button
                    class="block h-10 w-full border-2 border-highlight text-sm font-medium duration-300 hover:bg-gray-100 md:h-12"
                    @click="${this._onAcceptSelected}"
                >
                    ${this._config.texts.button_accept_selected}
                </button>
            </div>
        `;
    return d`
            <div class="grid shrink-0 gap-2 border-t border-gray-200 p-4 md:grid-cols-3">
                <div>
                    <button
                        class="block h-10 w-full border-2 border-highlight text-sm font-medium duration-300 hover:bg-gray-100 md:h-12"
                        @click="${this._onRefuse}"
                    >
                        ${this._config.texts.button_refuse}
                    </button>
                </div>
                ${this._tab === 1 ? t : s}
                <div>
                    <button
                        class="${v({
      "block h-10 w-full bg-highlight text-sm font-bold duration-300 hover:opacity-90 md:h-12": !0,
      "text-white": this._contrastColor === "white"
    })}"
                        @click="${this._onAcceptAll}"
                    >
                        ${this._config.texts.button_accept_all}
                    </button>
                </div>
            </div>
        `;
  }
  consentTab() {
    if (this._config)
      return d`
            <div>
                <div class="text-sm font-bold">${this._config.texts.consent_title}</div>
                <div class="mt-2 text-sm">${this._config.texts.consent_message}</div>
            </div>
        `;
  }
  customizeTab() {
    return this._config ? d`
            <div class="divide-y divide-gray-100">
                ${this.cookiePurposeRow("necessary")}
                ${this._config.cookies.preferences.length > 0 ? this.cookiePurposeRow("preferences") : null}
                ${this._config.cookies.statistics.length > 0 ? this.cookiePurposeRow("statistics") : null}
                ${this._config.cookies.marketing.length > 0 ? this.cookiePurposeRow("marketing") : null}
            </div>
        ` : null;
  }
  informationTab() {
    return this._config ? d` <div class="prose prose-sm">${Ut(this._config.texts.information_text)}</div> ` : null;
  }
  modalToggle() {
    var s;
    return d`
            <cookie-solution-toggle
                position="${(s = this._config) == null ? void 0 : s.toggle_position}"
                @open="${this.show}"
            ></cookie-solution-toggle>
        `;
  }
  cookiePurposeRow(s) {
    var o, r;
    if (!this._config)
      return;
    const t = this._config.cookies[s].length > 0, e = (i) => {
      var n;
      return (n = i.target) == null ? void 0 : n.dispatchEvent(
        new CustomEvent("toggle-open", {
          bubbles: !0,
          composed: !0
        })
      );
    };
    return d`
            <cookie-solution--collapsable>
                <div class="flex gap-8">
                    <div class="flex h-12 flex-1 items-center">
                        ${t ? d`
                                  <button @click="${e}">
                                      <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 48 48"
                                          class="mr-4 h-6 w-6 fill-current"
                                      >
                                          <path d="m24 30.75-12-12 2.15-2.15L24 26.5l9.85-9.85L36 18.8Z" />
                                      </svg>
                                  </button>
                              ` : d` <div class="md:mr-4 md:w-6"></div>`}

                        <button
                            class="${v({
      "block flex h-12 items-center text-sm font-bold": !0,
      "cursor-default": !t
    })}"
                            @click="${t ? e : void 0}"
                        >
                            ${this._config.texts[`customize_purpose_${s}`]}
                        </button>
                    </div>
                    <div class="flex h-12 w-12 items-center">
                        ${s === "necessary" ? d` <cookie-solution--switch checked readonly></cookie-solution--switch> ` : d`
                                  <cookie-solution--switch
                                      ?checked="${(r = (o = this._status) == null ? void 0 : o.purposes) == null ? void 0 : r[s]}"
                                      @change="${(i) => this._onPurposeChange(s, i.detail)}"
                                  ></cookie-solution--switch>
                              `}
                    </div>
                </div>

                <div class="mb-4 md:pl-10 md:pr-20">
                    <p class="text-sm text-gray-800">
                        ${this._config.texts[`customize_purpose_${s}_description`]}
                    </p>
                </div>

                <div slot="content">
                    <div class="mb-8 md:ml-10 md:mr-16">
                        ${this._config.cookies[s].map(
      (i) => d`
                                <div class="mt-4 border-l-4 border-gray-300 px-4">
                                    <div>
                                        <span class="block text-sm font-medium md:inline">${i.name}</span>
                                        <span class="block text-xs md:inline md:text-sm">(${i.provider})</span>
                                    </div>
                                    <div class="mt-2 divide-y divide-gray-100">
                                        ${i.cookies.map((n) => this.cookieRow(n))}
                                    </div>
                                </div>
                            `
    )}
                    </div>
                </div>
            </cookie-solution--collapsable>
        `;
  }
  cookieRow(s) {
    return d`
            <div class="grid grid-cols-2 items-center gap-2 py-1 sm:grid-cols-4">
                <div>
                    <span class="text-xs font-bold italic">${s.name}</span>
                </div>
                <div class="flex justify-end sm:justify-start">
                    <span class="rounded-lg bg-gray-100 px-2 py-1 text-xs font-bold text-gray-700">
                        <cookie-solution-duration duration="${s.duration}"></cookie-solution-duration>
                    </span>
                </div>
                <div class="col-span-2 text-xs">${s.description}</div>
            </div>
        `;
  }
};
w.styles = [j];
b([
  _({ type: String, attribute: "cookie-name" })
], w.prototype, "cookieName", 2);
b([
  k()
], w.prototype, "_config", 2);
b([
  k()
], w.prototype, "_configHash", 2);
b([
  k()
], w.prototype, "_showModal", 2);
b([
  k()
], w.prototype, "_showModalStatus", 2);
b([
  k()
], w.prototype, "_tab", 2);
b([
  k()
], w.prototype, "_contrastColor", 2);
b([
  k()
], w.prototype, "_status", 2);
w = b([
  z("cookie-solution-banner")
], w);
var _e = Object.defineProperty, $e = Object.getOwnPropertyDescriptor, xe = (s, t, e, o) => {
  for (var r = o > 1 ? void 0 : o ? $e(t, e) : t, i = s.length - 1, n; i >= 0; i--)
    (n = s[i]) && (r = (o ? n(t, e, r) : n(r)) || r);
  return o && r && _e(t, e, r), r;
};
let lt = class extends g {
  async connectedCallback() {
    super.connectedCallback();
  }
  render() {
    return d` <div>${Ut(this.innerHTML)}</div> `;
  }
};
lt.styles = [j];
lt = xe([
  z("cookie-solution-policy-formatter")
], lt);
const ke = document.createElement("cookie-solution-banner");
document.body.append(ke);
