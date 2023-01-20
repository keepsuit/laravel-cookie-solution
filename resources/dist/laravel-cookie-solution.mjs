/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = window, tt = j.ShadowRoot && (j.ShadyCSS === void 0 || j.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, et = Symbol(), ot = /* @__PURE__ */ new WeakMap();
let ft = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== et)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (tt && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = ot.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && ot.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const mt = (s) => new ft(typeof s == "string" ? s : s + "", void 0, et), At = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, o, r) => i + ((n) => {
    if (n._$cssResult$ === !0)
      return n.cssText;
    if (typeof n == "number")
      return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + s[r + 1], s[0]);
  return new ft(e, s, et);
}, kt = (s, t) => {
  tt ? s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet) : t.forEach((e) => {
    const i = document.createElement("style"), o = j.litNonce;
    o !== void 0 && i.setAttribute("nonce", o), i.textContent = e.cssText, s.appendChild(i);
  });
}, rt = tt ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules)
    e += i.cssText;
  return mt(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Q;
const I = window, nt = I.trustedTypes, St = nt ? nt.emptyScript : "", at = I.reactiveElementPolyfillSupport, G = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? St : null;
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
} }, wt = (s, t) => t !== s && (t == t || s == s), V = { attribute: !0, type: String, converter: G, reflect: !1, hasChanged: wt };
let $ = class extends HTMLElement {
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
    return this.elementProperties.forEach((e, i) => {
      const o = this._$Ep(i, e);
      o !== void 0 && (this._$Ev.set(o, i), t.push(o));
    }), t;
  }
  static createProperty(t, e = V) {
    if (e.state && (e.attribute = !1), this.finalize(), this.elementProperties.set(t, e), !e.noAccessor && !this.prototype.hasOwnProperty(t)) {
      const i = typeof t == "symbol" ? Symbol() : "__" + t, o = this.getPropertyDescriptor(t, i, e);
      o !== void 0 && Object.defineProperty(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    return { get() {
      return this[e];
    }, set(o) {
      const r = this[t];
      this[e] = o, this.requestUpdate(t, r, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) || V;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return !1;
    this.finalized = !0;
    const t = Object.getPrototypeOf(this);
    if (t.finalize(), t.h !== void 0 && (this.h = [...t.h]), this.elementProperties = new Map(t.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const e = this.properties, i = [...Object.getOwnPropertyNames(e), ...Object.getOwnPropertySymbols(e)];
      for (const o of i)
        this.createProperty(o, e[o]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), !0;
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const o of i)
        e.unshift(rt(o));
    } else
      t !== void 0 && e.push(rt(t));
    return e;
  }
  static _$Ep(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  u() {
    var t;
    this._$E_ = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), (t = this.constructor.h) === null || t === void 0 || t.forEach((e) => e(this));
  }
  addController(t) {
    var e, i;
    ((e = this._$ES) !== null && e !== void 0 ? e : this._$ES = []).push(t), this.renderRoot !== void 0 && this.isConnected && ((i = t.hostConnected) === null || i === void 0 || i.call(t));
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
    return kt(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var t;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$ES) === null || t === void 0 || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) === null || i === void 0 ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$ES) === null || t === void 0 || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) === null || i === void 0 ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$EO(t, e, i = V) {
    var o;
    const r = this.constructor._$Ep(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const n = (((o = i.converter) === null || o === void 0 ? void 0 : o.toAttribute) !== void 0 ? i.converter : G).toAttribute(e, i.type);
      this._$El = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$El = null;
    }
  }
  _$AK(t, e) {
    var i;
    const o = this.constructor, r = o._$Ev.get(t);
    if (r !== void 0 && this._$El !== r) {
      const n = o.getPropertyOptions(r), d = typeof n.converter == "function" ? { fromAttribute: n.converter } : ((i = n.converter) === null || i === void 0 ? void 0 : i.fromAttribute) !== void 0 ? n.converter : G;
      this._$El = r, this[r] = d.fromAttribute(e, n.type), this._$El = null;
    }
  }
  requestUpdate(t, e, i) {
    let o = !0;
    t !== void 0 && (((i = i || this.constructor.getPropertyOptions(t)).hasChanged || wt)(this[t], e) ? (this._$AL.has(t) || this._$AL.set(t, e), i.reflect === !0 && this._$El !== t && (this._$EC === void 0 && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t, i))) : o = !1), !this.isUpdatePending && o && (this._$E_ = this._$Ej());
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
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((o, r) => this[r] = o), this._$Ei = void 0);
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), (t = this._$ES) === null || t === void 0 || t.forEach((o) => {
        var r;
        return (r = o.hostUpdate) === null || r === void 0 ? void 0 : r.call(o);
      }), this.update(i)) : this._$Ek();
    } catch (o) {
      throw e = !1, this._$Ek(), o;
    }
    e && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$ES) === null || e === void 0 || e.forEach((i) => {
      var o;
      return (o = i.hostUpdated) === null || o === void 0 ? void 0 : o.call(i);
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
    this._$EC !== void 0 && (this._$EC.forEach((e, i) => this._$EO(i, this[i], e)), this._$EC = void 0), this._$Ek();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
$.finalized = !0, $.elementProperties = /* @__PURE__ */ new Map(), $.elementStyles = [], $.shadowRootOptions = { mode: "open" }, at == null || at({ ReactiveElement: $ }), ((Q = I.reactiveElementVersions) !== null && Q !== void 0 ? Q : I.reactiveElementVersions = []).push("1.6.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Z;
const B = window, x = B.trustedTypes, lt = x ? x.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, m = `lit$${(Math.random() + "").slice(9)}$`, bt = "?" + m, Et = `<${bt}>`, A = document, N = (s = "") => A.createComment(s), M = (s) => s === null || typeof s != "object" && typeof s != "function", _t = Array.isArray, Ct = (s) => _t(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", T = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ht = /-->/g, dt = />/g, w = RegExp(`>|[ 	
\f\r](?:([^\\s"'>=/]+)([ 	
\f\r]*=[ 	
\f\r]*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ct = /'/g, ut = /"/g, $t = /^(?:script|style|textarea|title)$/i, Tt = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), p = Tt(1), k = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), pt = /* @__PURE__ */ new WeakMap(), y = A.createTreeWalker(A, 129, null, !1), Pt = (s, t) => {
  const e = s.length - 1, i = [];
  let o, r = t === 2 ? "<svg>" : "", n = T;
  for (let a = 0; a < e; a++) {
    const l = s[a];
    let v, h, c = -1, g = 0;
    for (; g < l.length && (n.lastIndex = g, h = n.exec(l), h !== null); )
      g = n.lastIndex, n === T ? h[1] === "!--" ? n = ht : h[1] !== void 0 ? n = dt : h[2] !== void 0 ? ($t.test(h[2]) && (o = RegExp("</" + h[2], "g")), n = w) : h[3] !== void 0 && (n = w) : n === w ? h[0] === ">" ? (n = o ?? T, c = -1) : h[1] === void 0 ? c = -2 : (c = n.lastIndex - h[2].length, v = h[1], n = h[3] === void 0 ? w : h[3] === '"' ? ut : ct) : n === ut || n === ct ? n = w : n === ht || n === dt ? n = T : (n = w, o = void 0);
    const z = n === w && s[a + 1].startsWith("/>") ? " " : "";
    r += n === T ? l + Et : c >= 0 ? (i.push(v), l.slice(0, c) + "$lit$" + l.slice(c) + m + z) : l + m + (c === -2 ? (i.push(void 0), a) : z);
  }
  const d = r + (s[e] || "<?>") + (t === 2 ? "</svg>" : "");
  if (!Array.isArray(s) || !s.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return [lt !== void 0 ? lt.createHTML(d) : d, i];
};
class O {
  constructor({ strings: t, _$litType$: e }, i) {
    let o;
    this.parts = [];
    let r = 0, n = 0;
    const d = t.length - 1, a = this.parts, [l, v] = Pt(t, e);
    if (this.el = O.createElement(l, i), y.currentNode = this.el.content, e === 2) {
      const h = this.el.content, c = h.firstChild;
      c.remove(), h.append(...c.childNodes);
    }
    for (; (o = y.nextNode()) !== null && a.length < d; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) {
          const h = [];
          for (const c of o.getAttributeNames())
            if (c.endsWith("$lit$") || c.startsWith(m)) {
              const g = v[n++];
              if (h.push(c), g !== void 0) {
                const z = o.getAttribute(g.toLowerCase() + "$lit$").split(m), H = /([.?@])?(.*)/.exec(g);
                a.push({ type: 1, index: r, name: H[2], strings: z, ctor: H[1] === "." ? Mt : H[1] === "?" ? Rt : H[1] === "@" ? Ut : q });
              } else
                a.push({ type: 6, index: r });
            }
          for (const c of h)
            o.removeAttribute(c);
        }
        if ($t.test(o.tagName)) {
          const h = o.textContent.split(m), c = h.length - 1;
          if (c > 0) {
            o.textContent = x ? x.emptyScript : "";
            for (let g = 0; g < c; g++)
              o.append(h[g], N()), y.nextNode(), a.push({ type: 2, index: ++r });
            o.append(h[c], N());
          }
        }
      } else if (o.nodeType === 8)
        if (o.data === bt)
          a.push({ type: 2, index: r });
        else {
          let h = -1;
          for (; (h = o.data.indexOf(m, h + 1)) !== -1; )
            a.push({ type: 7, index: r }), h += m.length - 1;
        }
      r++;
    }
  }
  static createElement(t, e) {
    const i = A.createElement("template");
    return i.innerHTML = t, i;
  }
}
function S(s, t, e = s, i) {
  var o, r, n, d;
  if (t === k)
    return t;
  let a = i !== void 0 ? (o = e._$Co) === null || o === void 0 ? void 0 : o[i] : e._$Cl;
  const l = M(t) ? void 0 : t._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== l && ((r = a == null ? void 0 : a._$AO) === null || r === void 0 || r.call(a, !1), l === void 0 ? a = void 0 : (a = new l(s), a._$AT(s, e, i)), i !== void 0 ? ((n = (d = e)._$Co) !== null && n !== void 0 ? n : d._$Co = [])[i] = a : e._$Cl = a), a !== void 0 && (t = S(s, a._$AS(s, t.values), a, i)), t;
}
class Nt {
  constructor(t, e) {
    this.u = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  v(t) {
    var e;
    const { el: { content: i }, parts: o } = this._$AD, r = ((e = t == null ? void 0 : t.creationScope) !== null && e !== void 0 ? e : A).importNode(i, !0);
    y.currentNode = r;
    let n = y.nextNode(), d = 0, a = 0, l = o[0];
    for (; l !== void 0; ) {
      if (d === l.index) {
        let v;
        l.type === 2 ? v = new R(n, n.nextSibling, this, t) : l.type === 1 ? v = new l.ctor(n, l.name, l.strings, this, t) : l.type === 6 && (v = new zt(n, this, t)), this.u.push(v), l = o[++a];
      }
      d !== (l == null ? void 0 : l.index) && (n = y.nextNode(), d++);
    }
    return r;
  }
  p(t) {
    let e = 0;
    for (const i of this.u)
      i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class R {
  constructor(t, e, i, o) {
    var r;
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = o, this._$Cm = (r = o == null ? void 0 : o.isConnected) === null || r === void 0 || r;
  }
  get _$AU() {
    var t, e;
    return (e = (t = this._$AM) === null || t === void 0 ? void 0 : t._$AU) !== null && e !== void 0 ? e : this._$Cm;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = S(this, t, e), M(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== k && this.g(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ct(t) ? this.k(t) : this.g(t);
  }
  O(t, e = this._$AB) {
    return this._$AA.parentNode.insertBefore(t, e);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  g(t) {
    this._$AH !== u && M(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var e;
    const { values: i, _$litType$: o } = t, r = typeof o == "number" ? this._$AC(t) : (o.el === void 0 && (o.el = O.createElement(o.h, this.options)), o);
    if (((e = this._$AH) === null || e === void 0 ? void 0 : e._$AD) === r)
      this._$AH.p(i);
    else {
      const n = new Nt(r, this), d = n.v(this.options);
      n.p(i), this.T(d), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = pt.get(t.strings);
    return e === void 0 && pt.set(t.strings, e = new O(t)), e;
  }
  k(t) {
    _t(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, o = 0;
    for (const r of t)
      o === e.length ? e.push(i = new R(this.O(N()), this.O(N()), this, this.options)) : i = e[o], i._$AI(r), o++;
    o < e.length && (this._$AR(i && i._$AB.nextSibling, o), e.length = o);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) === null || i === void 0 || i.call(this, !1, !0, e); t && t !== this._$AB; ) {
      const o = t.nextSibling;
      t.remove(), t = o;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cm = t, (e = this._$AP) === null || e === void 0 || e.call(this, t));
  }
}
class q {
  constructor(t, e, i, o, r) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = o, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = u;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t, e = this, i, o) {
    const r = this.strings;
    let n = !1;
    if (r === void 0)
      t = S(this, t, e, 0), n = !M(t) || t !== this._$AH && t !== k, n && (this._$AH = t);
    else {
      const d = t;
      let a, l;
      for (t = r[0], a = 0; a < r.length - 1; a++)
        l = S(this, d[i + a], e, a), l === k && (l = this._$AH[a]), n || (n = !M(l) || l !== this._$AH[a]), l === u ? t = u : t !== u && (t += (l ?? "") + r[a + 1]), this._$AH[a] = l;
    }
    n && !o && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Mt extends q {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
const Ot = x ? x.emptyScript : "";
class Rt extends q {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    t && t !== u ? this.element.setAttribute(this.name, Ot) : this.element.removeAttribute(this.name);
  }
}
class Ut extends q {
  constructor(t, e, i, o, r) {
    super(t, e, i, o, r), this.type = 5;
  }
  _$AI(t, e = this) {
    var i;
    if ((t = (i = S(this, t, e, 0)) !== null && i !== void 0 ? i : u) === k)
      return;
    const o = this._$AH, r = t === u && o !== u || t.capture !== o.capture || t.once !== o.once || t.passive !== o.passive, n = t !== u && (o === u || r);
    r && this.element.removeEventListener(this.name, this, o), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e, i;
    typeof this._$AH == "function" ? this._$AH.call((i = (e = this.options) === null || e === void 0 ? void 0 : e.host) !== null && i !== void 0 ? i : this.element, t) : this._$AH.handleEvent(t);
  }
}
class zt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    S(this, t);
  }
}
const gt = B.litHtmlPolyfillSupport;
gt == null || gt(O, R), ((Z = B.litHtmlVersions) !== null && Z !== void 0 ? Z : B.litHtmlVersions = []).push("2.6.1");
const Ht = (s, t, e) => {
  var i, o;
  const r = (i = e == null ? void 0 : e.renderBefore) !== null && i !== void 0 ? i : t;
  let n = r._$litPart$;
  if (n === void 0) {
    const d = (o = e == null ? void 0 : e.renderBefore) !== null && o !== void 0 ? o : null;
    r._$litPart$ = n = new R(t.insertBefore(N(), d), d, void 0, e ?? {});
  }
  return n._$AI(s), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var F, W;
let b = class extends $ {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t, e;
    const i = super.createRenderRoot();
    return (t = (e = this.renderOptions).renderBefore) !== null && t !== void 0 || (e.renderBefore = i.firstChild), i;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ht(e, this.renderRoot, this.renderOptions);
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
    return k;
  }
};
b.finalized = !0, b._$litElement$ = !0, (F = globalThis.litElementHydrateSupport) === null || F === void 0 || F.call(globalThis, { LitElement: b });
const vt = globalThis.litElementPolyfillSupport;
vt == null || vt({ LitElement: b });
((W = globalThis.litElementVersions) !== null && W !== void 0 ? W : globalThis.litElementVersions = []).push("3.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const it = (s) => (t) => typeof t == "function" ? ((e, i) => (customElements.define(e, i), i))(s, t) : ((e, i) => {
  const { kind: o, elements: r } = i;
  return { kind: o, elements: r, finisher(n) {
    customElements.define(e, n);
  } };
})(s, t);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const jt = (s, t) => t.kind === "method" && t.descriptor && !("value" in t.descriptor) ? { ...t, finisher(e) {
  e.createProperty(t.key, s);
} } : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: t.key, initializer() {
  typeof t.initializer == "function" && (this[t.key] = t.initializer.call(this));
}, finisher(e) {
  e.createProperty(t.key, s);
} };
function C(s) {
  return (t, e) => e !== void 0 ? ((i, o, r) => {
    o.constructor.createProperty(r, i);
  })(s, t, e) : jt(s, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function U(s) {
  return C({ ...s, state: !0 });
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var X;
((X = window.HTMLSlotElement) === null || X === void 0 ? void 0 : X.prototype.assignedElements) != null;
const It = `*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.visible{visibility:visible}.static{position:static}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.inset-0{top:0px;right:0px;bottom:0px;left:0px}.top-1\\/2{top:50%}.left-1\\/2{left:50%}.-bottom-\\[1px\\]{bottom:-1px}.bottom-4{bottom:1rem}.right-4{right:1rem}.z-max{z-index:999999}.col-span-2{grid-column:span 2 / span 2}.mt-2{margin-top:.5rem}.mr-4{margin-right:1rem}.mb-4{margin-bottom:1rem}.mb-8{margin-bottom:2rem}.mt-4{margin-top:1rem}.block{display:block}.inline{display:inline}.flex{display:flex}.grid{display:grid}.hidden{display:none}.h-14{height:3.5rem}.h-10{height:2.5rem}.h-12{height:3rem}.h-6{height:1.5rem}.h-5{height:1.25rem}.max-h-\\[90vh\\]{max-height:90vh}.w-full{width:100%}.w-12{width:3rem}.w-6{width:1.5rem}.w-11{width:2.75rem}.w-5{width:1.25rem}.max-w-\\[900px\\]{max-width:900px}.flex-1{flex:1 1 0%}.shrink-0{flex-shrink:0}.-translate-x-1\\/2{--tw-translate-x: -50%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.-translate-y-1\\/2{--tw-translate-y: -50%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-x-5{--tw-translate-x: 1.25rem;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.scale-75{--tw-scale-x: .75;--tw-scale-y: .75;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.cursor-pointer{cursor:pointer}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.gap-2{gap:.5rem}.gap-8{gap:2rem}.divide-y>:not([hidden])~:not([hidden]){--tw-divide-y-reverse: 0;border-top-width:calc(1px * calc(1 - var(--tw-divide-y-reverse)));border-bottom-width:calc(1px * var(--tw-divide-y-reverse))}.divide-gray-100>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(243 244 246 / var(--tw-divide-opacity))}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.rounded-lg{border-radius:.5rem}.rounded-full{border-radius:9999px}.border-2{border-width:2px}.border-b{border-bottom-width:1px}.border-t-4{border-top-width:4px}.border-t{border-top-width:1px}.border-l-4{border-left-width:4px}.border-gray-200{--tw-border-opacity: 1;border-color:rgb(229 231 235 / var(--tw-border-opacity))}.border-highlight{border-color:var(--cs--color-highlight, #ea580c)}.border-gray-300{--tw-border-opacity: 1;border-color:rgb(209 213 219 / var(--tw-border-opacity))}.bg-gray-900\\/30{background-color:#1118274d}.bg-white{--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.bg-highlight{background-color:var(--cs--color-highlight, #ea580c)}.bg-gray-100{--tw-bg-opacity: 1;background-color:rgb(243 244 246 / var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity: 1;background-color:rgb(229 231 235 / var(--tw-bg-opacity))}.bg-gray-400{--tw-bg-opacity: 1;background-color:rgb(156 163 175 / var(--tw-bg-opacity))}.fill-highlight{fill:var(--cs--color-highlight, #ea580c)}.fill-current{fill:currentColor}.p-4{padding:1rem}.p-2{padding:.5rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-0\\.5{padding-left:.125rem;padding-right:.125rem}.px-0{padding-left:0;padding-right:0}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.font-bold{font-weight:700}.italic{font-style:italic}.text-gray-900{--tw-text-opacity: 1;color:rgb(17 24 39 / var(--tw-text-opacity))}.text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.text-gray-800{--tw-text-opacity: 1;color:rgb(31 41 55 / var(--tw-text-opacity))}.text-gray-700{--tw-text-opacity: 1;color:rgb(55 65 81 / var(--tw-text-opacity))}.opacity-0{opacity:0}.shadow{--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.duration-300{transition-duration:.3s}.duration-500{transition-duration:.5s}.hover\\:bg-gray-100:hover{--tw-bg-opacity: 1;background-color:rgb(243 244 246 / var(--tw-bg-opacity))}.hover\\:opacity-90:hover{opacity:.9}.hover\\:shadow-xl:hover{--tw-shadow: 0 20px 25px -5px rgb(0 0 0 / .1), 0 8px 10px -6px rgb(0 0 0 / .1);--tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.focus\\:shadow:focus{--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.aria-selected\\:text-highlight[aria-selected=true]{color:var(--cs--color-highlight, #ea580c)}@media (min-width: 640px){.sm\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.sm\\:justify-start{justify-content:flex-start}}@media (min-width: 768px){.md\\:mr-4{margin-right:1rem}.md\\:ml-10{margin-left:2.5rem}.md\\:mr-16{margin-right:4rem}.md\\:inline{display:inline}.md\\:h-12{height:3rem}.md\\:w-6{width:1.5rem}.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.md\\:pl-10{padding-left:2.5rem}.md\\:pr-20{padding-right:5rem}.md\\:text-sm{font-size:.875rem;line-height:1.25rem}}
`, st = At`${mt(It)}`;
var Bt = Object.defineProperty, Dt = Object.getOwnPropertyDescriptor, Y = (s, t, e, i) => {
  for (var o = i > 1 ? void 0 : i ? Dt(t, e) : t, r = s.length - 1, n; r >= 0; r--)
    (n = s[r]) && (o = (i ? n(t, e, o) : n(o)) || o);
  return i && o && Bt(t, e, o), o;
};
let E = class extends b {
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
    return p`
            <button
                type="button"
                role="switch"
                aria-checked="${this.checked}"
                @click="${this._onClick}"
                class="${this.checked ? "bg-highlight" : "bg-gray-200"} flex h-6 w-11 cursor-pointer items-center rounded-full px-0.5 duration-300 focus:shadow"
            >
                <span
                    class="${this.checked ? "translate-x-5 bg-white" : "bg-gray-400"} block h-5 w-5 transform rounded-full duration-300"
                ></span>
            </button>
        `;
  }
};
E.styles = [st];
Y([
  C({ type: Boolean })
], E.prototype, "checked", 2);
Y([
  C({ type: Boolean })
], E.prototype, "disabled", 2);
Y([
  C({ type: Boolean })
], E.prototype, "readonly", 2);
E = Y([
  it("cookie-solution-toggle")
], E);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Lt = (s) => s.strings === void 0;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qt = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, Yt = (s) => (...t) => ({ _$litDirective$: s, values: t });
class Qt {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, i) {
    this._$Ct = t, this._$AM = e, this._$Ci = i;
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
const P = (s, t) => {
  var e, i;
  const o = s._$AN;
  if (o === void 0)
    return !1;
  for (const r of o)
    (i = (e = r)._$AO) === null || i === void 0 || i.call(e, t, !1), P(r, t);
  return !0;
}, D = (s) => {
  let t, e;
  do {
    if ((t = s._$AM) === void 0)
      break;
    e = t._$AN, e.delete(s), s = t;
  } while ((e == null ? void 0 : e.size) === 0);
}, yt = (s) => {
  for (let t; t = s._$AM; s = t) {
    let e = t._$AN;
    if (e === void 0)
      t._$AN = e = /* @__PURE__ */ new Set();
    else if (e.has(s))
      break;
    e.add(s), Ft(t);
  }
};
function Vt(s) {
  this._$AN !== void 0 ? (D(this), this._$AM = s, yt(this)) : this._$AM = s;
}
function Zt(s, t = !1, e = 0) {
  const i = this._$AH, o = this._$AN;
  if (o !== void 0 && o.size !== 0)
    if (t)
      if (Array.isArray(i))
        for (let r = e; r < i.length; r++)
          P(i[r], !1), D(i[r]);
      else
        i != null && (P(i, !1), D(i));
    else
      P(this, s);
}
const Ft = (s) => {
  var t, e, i, o;
  s.type == qt.CHILD && ((t = (i = s)._$AP) !== null && t !== void 0 || (i._$AP = Zt), (e = (o = s)._$AQ) !== null && e !== void 0 || (o._$AQ = Vt));
};
class Wt extends Qt {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, e, i) {
    super._$AT(t, e, i), yt(this), this.isConnected = t._$AU;
  }
  _$AO(t, e = !0) {
    var i, o;
    t !== this.isConnected && (this.isConnected = t, t ? (i = this.reconnected) === null || i === void 0 || i.call(this) : (o = this.disconnected) === null || o === void 0 || o.call(this)), e && (P(this, t), D(this));
  }
  setValue(t) {
    if (Lt(this._$Ct))
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
const Xt = () => new Jt();
class Jt {
}
const J = /* @__PURE__ */ new WeakMap(), Kt = Yt(class extends Wt {
  render(s) {
    return u;
  }
  update(s, [t]) {
    var e;
    const i = t !== this.Y;
    return i && this.Y !== void 0 && this.rt(void 0), (i || this.lt !== this.ct) && (this.Y = t, this.dt = (e = s.options) === null || e === void 0 ? void 0 : e.host, this.rt(this.ct = s.element)), u;
  }
  rt(s) {
    var t;
    if (typeof this.Y == "function") {
      const e = (t = this.dt) !== null && t !== void 0 ? t : globalThis;
      let i = J.get(e);
      i === void 0 && (i = /* @__PURE__ */ new WeakMap(), J.set(e, i)), i.get(this.Y) !== void 0 && this.Y.call(this.dt, void 0), i.set(this.Y, s), s !== void 0 && this.Y.call(this.dt, s);
    } else
      this.Y.value = s;
  }
  get lt() {
    var s, t, e;
    return typeof this.Y == "function" ? (t = J.get((s = this.dt) !== null && s !== void 0 ? s : globalThis)) === null || t === void 0 ? void 0 : t.get(this.Y) : (e = this.Y) === null || e === void 0 ? void 0 : e.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
});
var Gt = Object.defineProperty, te = Object.getOwnPropertyDescriptor, xt = (s, t, e, i) => {
  for (var o = i > 1 ? void 0 : i ? te(t, e) : t, r = s.length - 1, n; r >= 0; r--)
    (n = s[r]) && (o = (i ? n(t, e, o) : n(o)) || o);
  return i && o && Gt(t, e, o), o;
};
let L = class extends b {
  constructor() {
    super(...arguments), this.open = !1, this.contentRef = Xt();
  }
  _updateContentStyle() {
    if (this.contentRef.value)
      if (this.open) {
        this.contentRef.value.style.height = "auto";
        const s = this.contentRef.value.getBoundingClientRect().height;
        this.contentRef.value.style.height = "0px", requestAnimationFrame(() => {
          this.contentRef.value.style.height = `${s}px`, this.contentRef.value.addEventListener(
            "transitionend",
            () => {
              this.contentRef.value.style.height = "auto";
            },
            { once: !0 }
          );
        });
      } else
        this.contentRef.value.style.height = "0px";
  }
  _onToggleOpenEvent(s) {
    s.stopPropagation(), this.open = !this.open, this._updateContentStyle();
  }
  firstUpdated() {
    this._updateContentStyle();
  }
  render() {
    return p`
            <div class="group" @toggle-open="${this._onToggleOpenEvent}">
                <slot></slot>
                <div class="overflow-hidden transition-all duration-500" ${Kt(this.contentRef)}>
                    <slot name="content"></slot>
                </div>
            </div>
        `;
  }
};
L.styles = [st];
xt([
  C({ type: Boolean })
], L.prototype, "open", 2);
L = xt([
  it("cookie-solution-collapsable")
], L);
function ee(s, t, e) {
  const i = new Date(Date.now() + e * 24 * 60 * 60 * 1e3), o = document.location.protocol === "https:";
  document.cookie = `${s}=${encodeURIComponent(
    t
  )}; expires=${i.toUTCString()}; path=/; samesite=lax; ${o ? ";secure" : ""}`;
}
function ie(s) {
  const t = document.cookie.split(";").find((i) => i.trim().startsWith(`${s}=`));
  if (!t)
    return;
  const e = t.split("=")[1];
  return decodeURIComponent(e);
}
var se = Object.defineProperty, oe = Object.getOwnPropertyDescriptor, _ = (s, t, e, i) => {
  for (var o = i > 1 ? void 0 : i ? oe(t, e) : t, r = s.length - 1, n; r >= 0; r--)
    (n = s[r]) && (o = (i ? n(t, e, o) : n(o)) || o);
  return i && o && se(t, e, o), o;
};
function K() {
  return {
    timestamp: new Date().toISOString(),
    purposes: {
      necessary: !0,
      preferences: !1,
      statistics: !1,
      marketing: !1
    }
  };
}
let f = class extends b {
  constructor() {
    super(...arguments), this.cookieName = "laravel_cookie_solution", this._showModal = !1, this._showModalStatus = "hidden", this._tab = 0, this._status = void 0, this._relativeTimeFormatter = new Intl.RelativeTimeFormat(void 0, {
      style: "long"
    });
  }
  connectedCallback() {
    if (super.connectedCallback(), this._loadConfig(), this._loadStatus(), !this._config) {
      console.error("CookieSolution: No configuration found.");
      return;
    }
    this._status || this.show();
  }
  _loadConfig() {
    this._config = window._cookieSolution;
  }
  _loadStatus() {
    const s = ie(this.cookieName);
    this._status = s ? JSON.parse(s) : void 0, this._emitStatusChange();
  }
  _saveStatus() {
    ee(this.cookieName, JSON.stringify(this._status), 365), this._emitStatusChange();
  }
  _emitStatusChange() {
    var s, t, e, i, o;
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
        personalization_storage: (i = this._status) != null && i.purposes.preferences ? "granted" : "denied"
      });
    } catch {
    }
    try {
      typeof fbq == "function" && fbq("consent", (o = this._status) != null && o.purposes.marketing ? "grant" : "revoke");
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
      timestamp: new Date().toISOString(),
      purposes: {
        necessary: !0,
        preferences: !0,
        statistics: !0,
        marketing: !0
      }
    }, this._saveStatus(), this.hide();
  }
  _onAcceptSelected() {
    this._status || (this._status = K()), this._status.timestamp = new Date().toISOString(), this._saveStatus(), this.hide();
  }
  _onRefuse() {
    this._status = K(), this._saveStatus(), this.hide();
  }
  _onPurposeChange(s, t) {
    this._status || (this._status = K()), this._status.purposes[s] = t;
  }
  render() {
    return this._config ? this._showModal ? p`
            <div class="fixed inset-0 z-max bg-gray-900/30">
                <div
                    role="dialog"
                    class="${this._showModalStatus === "showing" || this._showModalStatus === "hiding" ? "opacity-0 scale-75" : ""} fixed top-1/2 left-1/2 z-max flex max-h-[90vh] w-full max-w-[900px] -translate-x-1/2 -translate-y-1/2 overflow-hidden p-4 duration-300"
                >
                    <div class="flex w-full flex-col rounded-lg bg-white font-sans text-gray-900 shadow">
                        ${this.header()}
                        <div class="flex-1 overflow-auto p-4">
                            ${this._tab === 0 ? this.consentTab() : null}
                            ${this._tab === 1 ? this.customizeTab() : null}
                        </div>
                        ${this.footer()}
                    </div>
                </div>
            </div>
        ` : this.modalToggle() : null;
  }
  header() {
    if (this._config)
      return p`
            <div class="grid shrink-0 grid-cols-3 border-b border-gray-200">
                <button
                    class="h-14 w-full text-sm font-medium duration-300 aria-selected:text-highlight"
                    role="tab"
                    data-tab="0"
                    aria-selected="${this._tab === 0}"
                    @click="${this._onTabSelected}"
                >
                    ${this._config.texts.tab_consent}
                </button>
                <button
                    class="h-14 w-full text-sm font-medium duration-300 aria-selected:text-highlight"
                    role="tab"
                    data-tab="1"
                    aria-selected="${this._tab === 1}"
                    @click="${this._onTabSelected}"
                >
                    ${this._config.texts.tab_customize}
                </button>
                <button
                    class="h-14 w-full text-sm font-medium duration-300 aria-selected:text-highlight"
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
    const s = p`
            <div>
                <button
                    class="block h-10 w-full border-2 border-highlight text-sm font-medium duration-300 hover:bg-gray-100 md:h-12"
                    @click="${() => this._tab = 1}"
                >
                    ${this._config.texts.button_customize}
                </button>
            </div>
        `, t = p`
            <div>
                <button
                    class="block h-10 w-full border-2 border-highlight text-sm font-medium duration-300 hover:bg-gray-100 md:h-12"
                    @click="${this._onAcceptSelected}"
                >
                    ${this._config.texts.button_accept_selected}
                </button>
            </div>
        `;
    return p`
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
                        class="block h-10 w-full bg-highlight text-sm font-bold text-white duration-300 hover:opacity-90 md:h-12"
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
      return p`
            <div>
                <div class="text-sm font-bold">${this._config.texts.consent_title}</div>
                <div class="mt-2 text-sm">${this._config.texts.consent_message}</div>
            </div>
        `;
  }
  customizeTab() {
    return this._config ? p`
            <div class="divide-y divide-gray-100">
                ${this.cookiePurposeRow("necessary")}
                ${this._config.cookies.preferences.length > 0 ? this.cookiePurposeRow("preferences") : null}
                ${this._config.cookies.statistics.length > 0 ? this.cookiePurposeRow("statistics") : null}
                ${this._config.cookies.marketing.length > 0 ? this.cookiePurposeRow("marketing") : null}
            </div>
        ` : null;
  }
  modalToggle() {
    return p`
            <div class="fixed bottom-4 right-4 z-max">
                <button
                    class="flex h-12 w-12 items-center justify-center rounded-full bg-white p-2 shadow hover:shadow-xl"
                    @click="${() => this.show()}"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="fill-highlight" viewBox="0 0 48 48">
                        <path
                            d="M21 20.1q1.3 0 2.2-.9.9-.9.9-2.2 0-1.3-.9-2.2-.9-.9-2.2-.9-1.3 0-2.2.9-.9.9-.9 2.2 0 1.3.9 2.2.9.9 2.2.9Zm-4 10q1.3 0 2.2-.9.9-.9.9-2.2 0-1.3-.9-2.2-.9-.9-2.2-.9-1.3 0-2.2.9-.9.9-.9 2.2 0 1.3.9 2.2.9.9 2.2.9ZM30 32q.85 0 1.425-.575Q32 30.85 32 30q0-.85-.575-1.425Q30.85 28 30 28q-.85 0-1.425.575Q28 29.15 28 30q0 .85.575 1.425Q29.15 32 30 32Zm-6 12q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.6 1.95-8.6t5.225-6.775q3.275-2.775 7.55-4T27.6 4.3q-.3 2.25.4 4.25t2.125 3.4q1.425 1.4 3.425 2.05 2 .65 4.2.3-1 3.05 1.1 5.475t5.1 2.675q.4 4.35-1.025 8.25-1.425 3.9-4.175 6.85-2.75 2.95-6.55 4.7T24 44Zm0-3q7.1 0 11.8-4.675 4.7-4.675 5.25-11.525-2.7-1-4.375-2.975Q35 19.85 34.6 17.3q-4.05-.55-6.825-3.5Q25 10.85 24.6 6.95q-3.7-.15-6.925 1.2-3.225 1.35-5.6 3.7Q9.7 14.2 8.35 17.375 7 20.55 7 24q0 7.1 4.95 12.05Q16.9 41 24 41Zm.05-17.25Z"
                        />
                    </svg>
                </button>
            </div>
        `;
  }
  cookiePurposeRow(s) {
    var e, i;
    if (!this._config)
      return;
    const t = (o) => {
      var r;
      return (r = o.target) == null ? void 0 : r.dispatchEvent(
        new CustomEvent("toggle-open", {
          bubbles: !0,
          composed: !0
        })
      );
    };
    return p`
            <cookie-solution-collapsable>
                <div class="flex gap-8">
                    <div class="flex h-12 flex-1 items-center">
                        ${this._config.cookies[s].length > 0 ? p`
                                <button @click="${t}">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 48 48"
                                        class="mr-4 h-6 w-6 fill-current"
                                    >
                                        <path d="m24 30.75-12-12 2.15-2.15L24 26.5l9.85-9.85L36 18.8Z" />
                                    </svg>
                                </button>
                            ` : p`
                                <div class="md:mr-4 md:w-6"></div>`}

                        <button class="block flex h-12 items-center text-sm font-bold" @click="${t}">
                            ${this._config.texts[`customize_purpose_${s}`]}
                        </button>
                    </div>
                    <div class="flex h-12 w-12 items-center">
                        ${s === "necessary" ? p`
                                <cookie-solution-toggle checked readonly></cookie-solution-toggle> ` : p`
                                <cookie-solution-toggle
                                    ?checked="${(i = (e = this._status) == null ? void 0 : e.purposes) == null ? void 0 : i[s]}"
                                    @change="${(o) => this._onPurposeChange(s, o.detail)}"
                                ></cookie-solution-toggle>
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
      (o) => p`
                                <div class="mt-4 border-l-4 border-gray-300 px-4">
                                    <div>
                                        <span class="block text-sm font-medium md:inline">${o.name}</span>
                                        <span class="block text-xs md:inline md:text-sm">(${o.provider})</span>
                                    </div>
                                    <div class="mt-2 divide-y divide-gray-100">
                                        ${o.cookies.map((r) => this.cookieRow(r))}
                                    </div>
                                </div>
                            `
    )}
                    </div>
                </div>
            </cookie-solution-collapsable>
        `;
  }
  cookieRow(s) {
    return p`
            <div class="grid grid-cols-2 items-center gap-2 py-1 sm:grid-cols-4">
                <div>
                    <span class="text-xs font-bold italic">${s.name}</span>
                </div>
                <div class="flex justify-end sm:justify-start">
                    <span class="rounded-lg bg-gray-100 px-2 py-1 text-xs font-bold text-gray-700">
                        ${this.formatDuration(s.duration)}
                    </span>
                </div>
                <div class="col-span-2 text-xs">${s.description}</div>
            </div>
        `;
  }
  formatDuration(s) {
    if (s === 0)
      return "session";
    let t;
    return s % 365 === 0 ? t = this._relativeTimeFormatter.formatToParts(s / 365, "year") : s % 30 === 0 ? t = this._relativeTimeFormatter.formatToParts(s / 30, "month") : t = this._relativeTimeFormatter.formatToParts(s, "day"), `${t[1].value} ${t[2].value}`;
  }
};
f.styles = [st];
_([
  C({ type: String, attribute: "cookie-name" })
], f.prototype, "cookieName", 2);
_([
  U()
], f.prototype, "_config", 2);
_([
  U()
], f.prototype, "_showModal", 2);
_([
  U()
], f.prototype, "_showModalStatus", 2);
_([
  U()
], f.prototype, "_tab", 2);
_([
  U()
], f.prototype, "_status", 2);
f = _([
  it("cookie-solution-banner")
], f);
const re = document.createElement("cookie-solution-banner");
document.body.append(re);
